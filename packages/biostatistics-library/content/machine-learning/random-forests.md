---
title: Random forests
summary: An ensemble of randomized decision trees for flexible prediction, with guidance on tuning, validation, and variable-importance limits.
---

## Overview and key ideas

A random forest fits many decision trees and combines their predictions. Each tree is trained on a bootstrap sample, and each split considers a random subset of predictors. This decorrelates trees; averaging regression predictions or voting/class-probability aggregation for classification often reduces the variance of an individual unstable tree. Observations omitted from a tree’s bootstrap sample are called out-of-bag (OOB) for that tree and can provide an internal error estimate.

Important tuning choices include the number of candidate predictors considered at each split, minimum leaf size, and whether trees are constrained. Increasing the number of trees usually stabilizes the ensemble but does not fix leakage, unrepresentative data, or poor target definitions.

## When to use it

Random forests are useful as a strong tabular-data baseline when relationships may be nonlinear and interactions are expected, such as predicting medication-related adverse events from demographics, diagnoses, and baseline laboratory results. They generally need less feature scaling than distance-based methods and can handle mixed predictor types depending on implementation.

## Assumptions and limitations

- A forest assumes the training observations represent the prediction setting. It cannot extrapolate reliably beyond ranges or populations it has seen.
- OOB error is an internal estimate under the training sampling scheme, not external validation. It can be invalid if records from the same patient or site leak across bootstrap units.
- Impurity-based importance can favor variables with many possible split points or categories; correlated predictors can divide or distort importance. Importance is not a causal effect.
- Averaging can smooth predictions and often improves ranking, but probability calibration may still be poor, particularly under class imbalance or prevalence shift.
- Large forests may be computationally expensive and less transparent than a single tree. “More accurate” should be demonstrated against a fair baseline using nested tuning and held-out evaluation.

## Worked example

Consider 1,000 patients, of whom 100 have a 30-day adverse drug event. A forest trained to predict event risk gives patient A a score of 0.30 and patient B 0.05. If a threshold of 0.20 flags patients, then among 100 held-out patients, suppose 20 are flagged and 8 experience the event. The positive predictive value is 8/20 = 40%; sensitivity cannot be inferred without knowing the total events in those 100 patients. The score 0.30 should not be called a 30% risk until calibration is checked. If the validation set had 10 events total, report the uncertainty around all these estimates.

## Interpretation and common pitfalls

- Use patient-grouped or temporal folds when observations repeat. Randomly splitting rows from the same person can inflate apparent accuracy.
- Tune parameters inside cross-validation and reserve a final evaluation set. Repeatedly adjusting the forest based on OOB or test results creates optimism.
- Report discrimination, calibration, confidence intervals, subgroup performance, and the threshold’s consequences. AUC alone does not measure clinical utility.
- Permutation importance measures dependence of prediction on a feature under a specific dataset and can be misleading with correlated predictors; it does not reveal what would happen under an intervention.
- Check missingness handling, coding artifacts, and proxies for site or access. A forest can exploit a timestamp or device indicator that will not transport.


## Why randomization helps, and what it does not solve

For a regression forest with B trees, prediction is typically the average of tree predictions. If each tree has variance sigma-squared and pairwise correlation rho, the variance of the average is approximately sigma-squared[rho+(1-rho)/B]. Adding trees reduces the second term, but the correlated component remains. Bootstrap sampling and random candidate-feature sets seek to lower rho while preserving useful trees. This explains why increasing `ntree` stabilizes Monte Carlo noise but cannot cure a biased target, leakage, or distribution shift.

At each node, `mtry` controls the candidate-feature count. A smaller value increases diversity but may weaken individual splits; larger values can make trees more alike. Node size governs local averaging: small leaves can fit rare patterns but increase variance, while larger leaves smooth risk. OOB predictions use only trees for which a training patient was out-of-bag. They are useful for diagnostics, but not external evidence, and row-level OOB can still leak when multiple records belong to a patient.

```r
library(ranger)
rf <- ranger(factor(event) ~ age + eGFR + prior_admissions + drug_count,
             data = train, num.trees = 1000, mtry = 2,
             min.node.size = 20, probability = TRUE,
             respect.unordered.factors = "order",
             importance = "permutation", seed = 41)
p <- predict(rf, data = test)$predictions[, "1"]
# Tune mtry and leaf size using patient-grouped folds, not this test set.
```

Probability forests average class probabilities rather than only voting labels, but they are not automatically calibrated. Bootstrap aggregation often improves ranking and reduces variance; leaf-level probabilities may remain biased in small samples or under case-control sampling. Evaluate calibration and recalibrate only using representative data separate from final assessment. Standard permutation importance asks how prediction performance changes when a feature is shuffled; correlated features can substitute for one another, and marginal shuffling can create clinically impossible combinations. Conditional importance, grouped permutation, and prespecified ablation analyses answer different questions. None estimate causal effects.


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


## Full worked analysis: risk, threshold, and uncertainty

Assume a temporally held-out cohort contains 400 patients and 40 adverse events. A forest gives predictions; at a 0.15 threshold, 60 patients are flagged and 24 have events. Then PPV=24/60=.40 and the alert fraction is 60/400=.15. If only 24 of the 40 total events are captured, sensitivity=.60. The false-positive count is 36, and specificity=(360-36)/360=.90. These operating characteristics should be accompanied by binomial or bootstrap intervals. They answer different questions: sensitivity concerns missed cases, PPV concerns workload yield, and alert fraction concerns capacity. If intervention capacity is 40 patients, a threshold is not a substitute for a prespecified ranking-and-capacity policy.

Probability calibration can be examined by grouping predictions into clinically sensible risk bands and plotting observed frequency against mean predicted risk, with uncertainty. Flexible smoothers can be unstable with few events; include a histogram of predictions and calibration-in-the-large/slope. If mean predicted risk is 12% but observed prevalence is 10%, there is average overprediction, but this alone does not tell whether high- and low-risk patients are ordered correctly. AUC and Brier score (mean squared probability error) add different summaries. Brier score depends on prevalence and is not an isolated measure of discrimination.

```r
# Illustrative threshold summaries, assuming p is the held-out event probability
cut <- .15
flag <- p >= cut
tp <- sum(flag & test$event == 1); fp <- sum(flag & test$event == 0)
fn <- sum(!flag & test$event == 1); tn <- sum(!flag & test$event == 0)
c(sensitivity = tp/(tp+fn), specificity = tn/(tn+fp),
  ppv = tp/(tp+fp), alert_fraction = mean(flag),
  brier = mean((p-test$event)^2))
```

If a bootstrap is used for uncertainty, resample independent patients (or sites for site-level transport), repeat any tuning and calibration steps, and keep the test cohort’s role clear. A common mistake is to compute intervals conditional on selected hyperparameters while ignoring the instability of selection. For variable importance, repeat importance calculation over resamples and show its variability; ranking features from a single forest can suggest false precision. Validate any mechanistic interpretation independently.


## Full worked analysis: risk, threshold, and uncertainty

Assume a temporally held-out cohort contains 400 patients and 40 adverse events. A forest gives predictions; at a 0.15 threshold, 60 patients are flagged and 24 have events. Then PPV=24/60=.40 and the alert fraction is 60/400=.15. If only 24 of the 40 total events are captured, sensitivity=.60. The false-positive count is 36, and specificity=(360-36)/360=.90. These operating characteristics should be accompanied by binomial or bootstrap intervals. They answer different questions: sensitivity concerns missed cases, PPV concerns workload yield, and alert fraction concerns capacity. If intervention capacity is 40 patients, a threshold is not a substitute for a prespecified ranking-and-capacity policy.

Probability calibration can be examined by grouping predictions into clinically sensible risk bands and plotting observed frequency against mean predicted risk, with uncertainty. Flexible smoothers can be unstable with few events; include a histogram of predictions and calibration-in-the-large/slope. If mean predicted risk is 12% but observed prevalence is 10%, there is average overprediction, but this alone does not tell whether high- and low-risk patients are ordered correctly. AUC and Brier score (mean squared probability error) add different summaries. Brier score depends on prevalence and is not an isolated measure of discrimination.

```r
# Illustrative threshold summaries, assuming p is the held-out event probability
cut <- .15
flag <- p >= cut
tp <- sum(flag & test$event == 1); fp <- sum(flag & test$event == 0)
fn <- sum(!flag & test$event == 1); tn <- sum(!flag & test$event == 0)
c(sensitivity = tp/(tp+fn), specificity = tn/(tn+fp),
  ppv = tp/(tp+fp), alert_fraction = mean(flag),
  brier = mean((p-test$event)^2))
```

If a bootstrap is used for uncertainty, resample independent patients (or sites for site-level transport), repeat any tuning and calibration steps, and keep the test cohort’s role clear. A common mistake is to compute intervals conditional on selected hyperparameters while ignoring the instability of selection. For variable importance, repeat importance calculation over resamples and show its variability; ranking features from a single forest can suggest false precision. Validate any mechanistic interpretation independently.


## Missingness, sampling, and transport

Forest implementations differ in how they handle missing values, categorical predictors, class probabilities, and split rules. Some impute globally, others route missing values or learn default directions. State the implementation and learn any imputation from training data only. An informative missingness pattern can improve within-system prediction because measurement is ordered by clinician suspicion. At a site where testing is routine, the pattern changes and performance may fall even if physiology is comparable. Test performance under alternative missingness patterns and consider including explicit indicators only when these inputs are available consistently.

Class imbalance does not necessarily make a forest fail, but default classification thresholds and accuracy can hide poor event detection. Class weights or stratified sampling change training emphasis; probability values may then require recalibration. Distinguish threshold choice from probability estimation. When an outcome is rare, precision-recall curves and alert yield can be more operationally informative than ROC AUC, but neither substitutes for calibration and uncertainty.

OOB predictions can guide diagnostics such as learning curves and rough hyperparameter exploration. They should not be repeatedly mined until a favorable model emerges and then reported as an unbiased estimate. If variable importance is central, compare permutation importance with drop-column performance in held-out resampling, report uncertainty, and group correlated measurements. Importance rankings can change when substitutable predictors are grouped differently. No method can turn predictive importance into an intervention effect without a causal design.


## Choosing the number of trees and uncertainty summaries

The number of trees B mainly controls Monte Carlo stability. Plot OOB error or another development-only estimate against B; stop increasing B when predictions and diagnostics stabilize. More trees do not necessarily overfit in the same way as adding parameters to a single tree, but they increase storage and latency, and allow increasingly extensive informal tuning. A fixed B with reproducible seed is useful for exact replication. OOB error is not a confidence interval and does not quantify uncertainty due to a new hospital, future time, or model selection.

Prediction uncertainty can be approached through patient bootstrap refits, quantile regression forests for conditional outcome distributions, or repeated model fits. These quantify different sources and should be labeled carefully. Variation across individual forest trees is not a valid predictive interval by itself because trees are dependent and do not capture all training-sample uncertainty. For binary risk, show calibration uncertainty and individual predictions as estimates rather than certainties. If patients have repeated admissions, bootstrap the person-level clusters.

Check learning curves by fitting on increasing patient counts. If validation performance continues to improve, more labeled data may help; if it plateaus, better outcome definition or measurement may matter more. Compare performance across calendar periods and sites, and inspect whether the forest relies heavily on hospital identifiers, billing codes, or test ordering. A stable model can still encode an ethically problematic allocation pattern. Clinical review of influential patterns and a clear action policy complement statistical validation.


## When forests are the wrong tool

A forest is not naturally extrapolative. In regression, predictions are averages of observed outcomes in terminal leaves, so a new value far outside the training range generally receives an in-range average rather than a defensible extrapolation. This matters for laboratory measurements in a new severity range or policy changes that alter practice. Check covariate support and define how unusual inputs are handled. A forest may be an excellent interpolation model and a poor model under extrapolation.

A forest is also not inherently robust to biased labels or selection. If only patients tested for a condition receive a confirmed label, the model may predict clinicians’ testing decisions. If outcomes are missing selectively, the learned relationship may reflect observation rather than disease. Forests can reproduce proxy discrimination and access patterns with high accuracy. Analyze label generation and selection mechanisms before fitting, and compare performance in groups whose measurement process differs.

For a causal question, an ordinary forest trained to predict outcome is not a treatment-effect estimator. Causal forests and related methods target treatment-effect heterogeneity but require treatment assignment assumptions, overlap, correct handling of confounding, and honest sample splitting. Their subgroup effect estimates need uncertainty and independent confirmation. Do not interpret predictive variable importance as evidence for intervention targeting. Algorithm choice cannot replace the design needed to identify the causal contrast.


## Reporting and reproducibility

Record the forest implementation, sampling scheme, number of trees, candidate features per split, node-size controls, class weighting, missing-value behavior, and random seed. State whether reported performance is OOB, cross-validated, temporal, or external. Include event prevalence, calibration, uncertainty, and operating-point workload. Preserve preprocessing and factor-level conventions. A forest’s internal variable importance is not a substitute for a prespecified clinical analysis, and OOB error should not be labeled external validation.


## Threshold selection in practice

Report the threshold rule, event capture, false alerts, and fraction of patients affected. If a fixed number can receive intervention, rank-based capacity is different from a probability threshold and should be evaluated as such. Confirm that predicted risk is calibrated before communicating it as an absolute probability; forest class votes alone are not a guarantee of accurate risk.

## References and further reading

- Moons KGM, Damen JAA, Kaul T, et al. PROBAST+AI: an updated quality, risk of bias, and applicability assessment tool for prediction models using regression or artificial intelligence methods. *BMJ*. 2025;388:e082505. [doi:10.1136/bmj-2024-082505](https://doi.org/10.1136/bmj-2024-082505)
- Breiman L. Random forests. *Machine Learning*. 2001;45:5–32. [doi:10.1023/A:1010933404324](https://doi.org/10.1023/A:1010933404324)
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378)
