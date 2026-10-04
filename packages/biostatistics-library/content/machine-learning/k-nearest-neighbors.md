---
title: K-nearest neighbors
summary: A distance-based prediction method, including scaling and neighborhood choices that matter for biomedical data.
---

## Overview and key ideas

K-nearest neighbors (k-NN) predicts an outcome for a new patient by finding the k most similar patients in the training data. For classification, it uses a majority vote or the proportion of neighbors in each class; for regression, it averages their outcomes, sometimes with closer neighbors weighted more heavily. It is a **lazy** method: it stores training records rather than fitting a compact equation.

The distance metric defines similarity. Euclidean distance is common for continuous variables; mixed clinical data may require carefully designed scaling and categorical distance. The value of k controls smoothness: small k is sensitive to noise, while large k averages over broader neighborhoods and can blur local patterns.

## When to use it

k-NN can serve as a transparent conceptual baseline when similar patients are expected to have similar outcomes, for example estimating length of stay from a small, consistently measured set of admission features. It can also support exploratory similarity searches, provided similarity is not presented as a clinical match without validation.

## Assumptions and limitations

- Features must be on comparable scales or the largest numeric units dominate distance. Standardization parameters must be learned in each training fold.
- The method suffers in high dimensions: observations become far apart and “nearest” may not mean clinically similar. Irrelevant variables and correlated measurements distort neighborhoods.
- Missing data and mixed variable types require explicit handling. Imputation and transformations must not use held-out outcomes or population information unavailable at prediction time.
- Class imbalance affects majority votes; class weighting and probability interpretation require evaluation. Neighbor fractions are not automatically calibrated risks.
- k-NN does not naturally extrapolate beyond the observed data and can be slow at prediction time for large datasets.

## Worked example

To classify a new patient as likely or unlikely to have a 30-day readmission, suppose the five nearest training patients (after scaling age, comorbidity score, and prior admissions) include three readmissions and two non-readmissions. Unweighted 5-NN predicts the readmission class and gives a simple neighbor proportion of 3/5 = 0.60. With inverse-distance weights of 0.40, 0.25, 0.15, 0.12, and 0.08, where the first three neighbors had readmission, the weighted score is 0.40 + 0.25 + 0.15 = 0.80. That change illustrates how weighting affects output; neither score is a calibrated 60% or 80% risk without evaluation. Select k and metric within cross-validation, then assess calibration and external performance.

## Interpretation and common pitfalls

- “Nearest” is determined by chosen variables, scales, and metric. It is not an intrinsic statement that two patients are clinically equivalent.
- Tune k, distance, and weighting only inside development data. Report a simple baseline and uncertainty.
- Preserve patient-level separation in repeated-measure data and time-aware separation for future prediction.
- Inspect whether one feature or missingness pattern dominates distances. Conduct sensitivity analyses with clinically defensible feature sets.
- Do not infer treatment effects from neighboring patients’ outcomes; treatment selection may differ for important reasons.


## Geometry, distance, and probability behavior

For standardized continuous variables, Euclidean distance between patients x and z is sqrt(sum_j (x_j-z_j)^2). A single unscaled laboratory measure can dominate this sum, so centers and scales must be estimated from each training fold and then applied unchanged to validation patients. Standardization gives each variable equal variance, not equal clinical importance. A weighted distance, Mahalanobis distance, or clinically constructed metric may be more appropriate, but it introduces further choices and assumptions.

The curse of dimensionality is practical: as irrelevant dimensions accumulate, distances become similar and nearest neighbors cease to be meaningfully near. Feature selection therefore must be nested inside validation. For binary prediction, the raw neighborhood fraction is a stepwise estimate with resolution 1/k. At k=5 it can only take six values and is highly variable; increasing k smooths variance but can mix unlike patients. Distance weighting emphasizes close matches, but can create unstable scores when distances are nearly tied or one point is exceptionally close. These scores need calibration assessment.

```r
library(class)
vars <- c("age", "eGFR", "prior_admissions")
mu <- vapply(train[vars], mean, numeric(1), na.rm = TRUE)
sd0 <- vapply(train[vars], sd, numeric(1), na.rm = TRUE)
# Imputation must be learned using training data; shown scaling assumes complete inputs.
Xtr <- scale(as.matrix(train[vars]), center = mu, scale = sd0)
Xte <- scale(as.matrix(test[vars]), center = mu, scale = sd0)
y <- factor(train$event, levels = c(0, 1))
knn_class <- knn(train = Xtr, test = Xte, cl = y, k = 15,
                 prob = TRUE, use.all = TRUE)
attr(knn_class, "prob")
```

`class::knn` returns a winning-class vote proportion, whose direction depends on the predicted class; it is not automatically the event probability. For probability estimation, compute both class vote fractions explicitly or use a method that exposes them, then validate calibration. Choose k, distance, and weighting within grouped cross-validation. Because the algorithm stores training records, consider privacy and prediction latency as well as discrimination. A neighbor display can aid review only if similarity features, distance, and the reference cohort are clinically justified; it should not imply that another patient’s treatment or outcome is transferable.


## Development workflow: from question to a defensible model

A model is meaningful only after the prediction problem has been made precise. State the eligible population, prediction index time, outcome definition, prediction horizon, and intended action. For example, “predict deterioration” is incomplete: a usable specification says which patients, what counts as deterioration, when prediction occurs, and how far ahead it should signal. Predictors must be available at that index time. Variables entered later may encode the outcome or the clinical response to it. This is temporal leakage even if the data table contains no obvious duplicate column.

Choose the independent unit to match deployment. If the system will predict for new patients, every record from a patient belongs to one partition. If it will predict future cases at an existing hospital, a chronological split is often more informative than a random split. If use at a new hospital is intended, retain site-level external validation. Confidence intervals and effective sample size should reflect clustering by patient or site; thousands of rows do not imply thousands of independent people.

Keep every data-adaptive step inside resampling: imputation, scaling, feature filtering, encoding, dimension reduction, class rebalancing, and hyperparameter selection. A typical nested workflow uses inner folds to choose settings and outer folds to estimate the performance of that entire selection process. A separate temporal or external test cohort, if available, should be used once after choices are frozen. Repeatedly checking its results turns it into development data. Report the number of patients and outcomes in each split, not only the row count.

Use metrics tied to the intended decision. Discrimination measures ranking; for a binary outcome, ROC AUC is the probability that a randomly selected case receives a higher score than a randomly selected non-case. It does not assess absolute risk. Calibration compares predicted and observed risks, using calibration-in-the-large, slope, and plots with uncertainty. At a chosen operating point, show sensitivity, specificity, positive predictive value, negative predictive value, and the proportion flagged. Precision-recall summaries can be informative when events are uncommon. For time-to-event outcomes, account for censoring rather than labeling patients event-free before adequate follow-up. Decision-curve analysis or a prospective impact study is needed to connect predictions to clinical net benefit.

A compact R pattern for a binary outcome illustrates the separation between fitting, discrimination, and calibration. It presumes `dat` has one row per patient, a 0/1 `event`, and predictors fixed before the prediction time. The split is only illustrative; repeated patients, sites, or calendar time require grouped or temporal partitions. The final test set must not be used to tune the model.

```r
set.seed(41)
i <- sample(seq_len(nrow(dat)), floor(.8 * nrow(dat)))
train <- dat[i, ]; test <- dat[-i, ]
fit <- glm(event ~ age + prior_admissions + severity,
           data = train, family = binomial())
p <- predict(fit, newdata = test, type = "response")
# Calibration-in-the-large: intercept ideally 0 when slope fixed at 1
cal0 <- glm(test$event ~ 1, offset = qlogis(p), family = binomial())
# Calibration slope: ideally 1; assess uncertainty, not only point estimate
cals <- glm(test$event ~ qlogis(p), family = binomial())
coef(cal0); coef(cals)
```

The code does not replace internal validation or uncertainty intervals. A small event count can make both performance and calibration estimates unstable. Bootstrap at the patient level or repeat appropriately grouped resampling, and report intervals. When transporting a model, compare outcome prevalence, predictor distributions, measurement practice, and label ascertainment; recalibration of the intercept can address a prevalence shift under restrictive conditions, but cannot repair changed predictor effects or systematic measurement errors.

For a clinical prediction report, document the cohort flow, missingness, feature timing, model specification, tuning procedure, split unit, and evaluation population. TRIPOD+AI provides a reporting framework. PROBAST+AI can help assess risk of bias and applicability. Neither checklist certifies clinical usefulness. A retrospective prediction model still requires prospective evaluation of workflow, alert burden, clinician response, and patient outcomes before claims of benefit.


## Full worked analysis: defining a meaningful neighborhood

Consider predicting 30-day readmission from age, eGFR, prior admissions, and a comorbidity score. Before distance calculations, determine whether a one-standard-deviation difference in each variable should count equally. Standard scaling is an algorithmic convenience, not clinical validation of equal weights. Strongly correlated variables (e.g., creatinine and eGFR) can count kidney function twice. A rare binary comorbidity contributes a distance jump that may dominate common continuous variation. Sensitivity analysis across prespecified feature sets and metrics is therefore part of the method, not an optional cosmetic check.

For a new patient, suppose the 7 nearest training patients have outcomes (1,1,0,0,0,0,0). The unweighted vote is 2/7=.286. If the first two distances are .2 and .3 and the remaining five each .8, inverse-distance weights give event score (5+3.33)/(5+3.33+5*1.25)=.571. The large change comes from the weighting rule; it does not mean the patient’s probability is known to be 57%. In small neighborhoods, vote fractions are coarse and can be overconfident. Repeated cross-validation can evaluate log loss and calibration, and isotonic or logistic recalibration may help only if a separate representative dataset is available.

```r
library(FNN)
cols <- c("age", "egfr", "prior_admissions")
center <- vapply(train[cols], mean, 0.0)
scale0 <- vapply(train[cols], sd, 0.0)
Xtr <- scale(as.matrix(train[cols]), center, scale0)
Xte <- scale(as.matrix(test[cols]), center, scale0)
# Query k neighbors; then form event fractions explicitly.
ix <- get.knnx(Xtr, Xte, k = 15)$nn.index
p.vote <- rowMeans(matrix(train$event[ix], nrow=nrow(ix)))
```

This example assumes complete numeric inputs and independent rows; fit imputation on training folds and group all repeated patient records. In evaluation, compare several k values, Euclidean versus defensible alternatives, and weighted/unweighted votes using the same nested folds. Measure prediction-time memory and latency because the reference cohort is retained. A patient-similarity interface needs privacy safeguards, clear explanation of the selected reference sample, and safeguards against treating historical care choices as recommendations. Neighbor outcomes are not counterfactual outcomes.


## Full worked analysis: defining a meaningful neighborhood

Consider predicting 30-day readmission from age, eGFR, prior admissions, and a comorbidity score. Before distance calculations, determine whether a one-standard-deviation difference in each variable should count equally. Standard scaling is an algorithmic convenience, not clinical validation of equal weights. Strongly correlated variables (e.g., creatinine and eGFR) can count kidney function twice. A rare binary comorbidity contributes a distance jump that may dominate common continuous variation. Sensitivity analysis across prespecified feature sets and metrics is therefore part of the method, not an optional cosmetic check.

For a new patient, suppose the 7 nearest training patients have outcomes (1,1,0,0,0,0,0). The unweighted vote is 2/7=.286. If the first two distances are .2 and .3 and the remaining five each .8, inverse-distance weights give event score (5+3.33)/(5+3.33+5*1.25)=.571. The large change comes from the weighting rule; it does not mean the patient’s probability is known to be 57%. In small neighborhoods, vote fractions are coarse and can be overconfident. Repeated cross-validation can evaluate log loss and calibration, and isotonic or logistic recalibration may help only if a separate representative dataset is available.

```r
library(FNN)
cols <- c("age", "egfr", "prior_admissions")
center <- vapply(train[cols], mean, 0.0)
scale0 <- vapply(train[cols], sd, 0.0)
Xtr <- scale(as.matrix(train[cols]), center, scale0)
Xte <- scale(as.matrix(test[cols]), center, scale0)
# Query k neighbors; then form event fractions explicitly.
ix <- get.knnx(Xtr, Xte, k = 15)$nn.index
p.vote <- rowMeans(matrix(train$event[ix], nrow=nrow(ix)))
```

This example assumes complete numeric inputs and independent rows; fit imputation on training folds and group all repeated patient records. In evaluation, compare several k values, Euclidean versus defensible alternatives, and weighted/unweighted votes using the same nested folds. Measure prediction-time memory and latency because the reference cohort is retained. A patient-similarity interface needs privacy safeguards, clear explanation of the selected reference sample, and safeguards against treating historical care choices as recommendations. Neighbor outcomes are not counterfactual outcomes.


## Efficient prediction and clinical governance

Exact nearest-neighbor search compares a new observation with much of the reference sample, so computational cost and memory rise with cohort size and feature dimension. Approximate-neighbor indexing can reduce latency but may alter retrieved neighbors; quantify recall of exact neighbors and evaluate downstream prediction impact. A refreshed reference cohort changes outputs even if code is unchanged. Freeze and version the reference data, preprocessing, distance function, and tie-breaking rules.

A nearest-patient interface also raises privacy concerns: highly similar records can expose rare combinations, and membership inference may reveal whether a person was in a reference cohort. Limit displayed details and apply governance for access, retention, and de-identification. More fundamentally, clinical similarity requires a purpose: patients can be similar for one endpoint and dissimilar for treatment response or contraindications. Displaying a neighbor’s outcome or treatment can invite inappropriate analogical reasoning.

Report performance by k, metric, feature set, and prevalence; show the distribution of nearest-neighbor distances. If distances are uniformly large, the new patient may lie outside the support of the training data, and returning a score without an abstention warning is hazardous. Establish an out-of-support rule before deployment and evaluate how often it triggers. Validate such abstention across sites rather than treating distance as a calibrated uncertainty estimate.


## Validation targets and reliability of a patient match

A neighbor fraction estimates local prevalence only if the training cohort samples the target population and the neighborhood is locally homogeneous. Case-control sampling, referral enrichment, or changes in outcome ascertainment break that interpretation. For instance, if training data deliberately include equal numbers of readmitted and non-readmitted patients, a 0.6 vote is not a 60% deployment risk. Reweighting or recalibration may help if sampling probabilities are known and conditional relationships remain stable, but external evaluation is necessary.

The choice of k creates a bias-variance trade-off. Small k follows local fluctuations and is highly sensitive to one mislabeled record; large k smooths across potentially dissimilar subgroups. Assess the curve of validation log loss or Brier score against k, not only accuracy. Because selected k varies with feature scaling and cohort size, repeat the full choice across resamples and report stability. In multiclass tasks, class-specific neighborhood prevalence can be reported, but confidence intervals need account for training-sample and validation uncertainty.

When communicating “similar patients,” describe the variables and distance contribution so clinicians can challenge poor matches. Do not show identifiable records or imply treatment comparability. A safe interface may show aggregate characteristics of the reference neighborhood and suppress results if too few close analogues exist. Test abstention thresholds on external populations and report both coverage (fraction receiving a prediction) and accuracy among covered patients. Otherwise, a similarity tool can appear excellent simply by declining difficult cases without disclosing it.


## Mixed features, missing values, and uncertainty

For mixed clinical predictors, there is no universally correct distance. One-hot encoding an unordered category gives equal distance to every distinct level, while ordinal coding imposes a rank and spacing. Binary indicators can be weighted differently from continuous variables; missing-value patterns may need their own distance contribution. A clinically curated dissimilarity can be useful but must be specified transparently and tested. If two patients have disjoint observed features, distance is not comparable unless the rule accounts for the number of dimensions contributing.

Imputation can distort neighborhoods by pulling many records toward a common mean. Multiple imputation in a prediction setting requires care: each imputation model must be learned from training data and available predictors, and predictions may be averaged across imputed datasets. Simple imputation with missingness flags is operationally simpler but can encode local workflow. Report how distance is computed when values are absent and conduct sensitivity analyses to plausible missingness.

The uncertainty of a k-NN prediction reflects both finite local outcomes and uncertainty in which training patients are nearest. A simple binomial interval for the vote fraction ignores neighbor selection and training-sample variability. Patient bootstrap refitting, repeated outer folds, and external test data provide more complete assessment. If neighborhood composition changes drastically with small perturbations, do not present a confident individual score. A local explanation should list influential distances and features carefully, not imply that the closest historical patient is a valid counterfactual.


## Reproducible implementation checklist

Save the reference records or approved de-identified representation, training-fold transformation parameters, feature weights, metric, neighbor count, weighting function, tie policy, and software version. Check that all deployed predictors have the same units and category coding. Test exact and approximate search behavior if approximation is used. Monitor nearest-distance distributions and abstention rates after deployment. A changed patient mix or updated reference database can alter the closest matches even when the algorithm is unchanged; version the data as well as the code.


## Interpreting score changes

A change in k, feature scaling, or distance definition can change neighbors discontinuously. Present sensitivity analyses and avoid implying that one setting identifies objectively similar people. If estimates shift materially under modest choices, treat the result as method-dependent and avoid individual decision use until independent validation supports a stable configuration.


If the selected neighbors are not close in absolute terms, label the prediction low-support and avoid confident clinical use.

## References and further reading

- Moons KGM, Damen JAA, Kaul T, et al. PROBAST+AI: an updated quality, risk of bias, and applicability assessment tool for prediction models using regression or artificial intelligence methods. *BMJ*. 2025;388:e082505. [doi:10.1136/bmj-2024-082505](https://doi.org/10.1136/bmj-2024-082505)
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378)
- Cover TM, Hart PE. Nearest neighbor pattern classification. *IEEE Transactions on Information Theory*. 1967;13:21–27. [doi:10.1109/TIT.1967.1053964](https://doi.org/10.1109/TIT.1967.1053964)
- Hastie T, Tibshirani R, Friedman J. *The Elements of Statistical Learning*. 2nd ed. Springer; 2009. [doi:10.1007/978-0-387-84858-7](https://doi.org/10.1007/978-0-387-84858-7)
