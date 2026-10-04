---
title: Decision trees
summary: How tree models split patient data into interpretable prediction rules, and how to control their instability and overfitting.
---

## Overview and key ideas

A decision tree repeatedly partitions observations using predictor thresholds. For example, it might first split on oxygen saturation below 90%, then split the lower-risk branch by age. Each terminal **leaf** holds a prediction: a class, an estimated probability, or a mean outcome. Classification trees often choose splits that reduce impurity (such as Gini impurity or entropy); regression trees reduce within-node squared error. A tree is attractive because its path can be read as a sequence of rules, but a large tree can be as hard to understand as a model with many parameters.

Tree growth is greedy: at each step the algorithm selects a locally favorable split, not necessarily the globally best tree. Complexity is controlled by limits on depth or leaf size and by pruning. A split that improves training fit may merely capture random variation, so pruning or tuning must use resampling confined to the training data.

## When to use it

Use a tree when nonlinear thresholds and interactions are plausible, when a compact rule set is useful, or as a baseline for ensemble methods. A clinical illustration is predicting which post-operative patients need intensified observation from early vital signs and comorbidities. The fitted rule is a predictive summary, not a treatment protocol until prospectively assessed.

## Assumptions and limitations

- Trees do not require linear relationships or normally distributed residuals, but they still require representative, accurately measured data and an appropriate target definition.
- Small changes in patients or measurements can lead to different early splits. A single tree is often unstable; report uncertainty and consider bootstrap stability checks.
- Standard trees make axis-aligned splits and can approximate smooth relationships inefficiently. They may create abrupt, unrealistic risk jumps at cutpoints.
- Missing values and category handling vary by implementation. Specify these procedures; do not silently impute using the full dataset.
- Class imbalance can make accuracy misleading. Choose an objective and evaluation measures suited to the clinical consequence.

## Worked example

In a training cohort of 100 post-operative patients, 20 experience a complication. A candidate split on oxygen saturation creates a low-saturation node of 25 patients with 12 complications and a higher-saturation node of 75 patients with 8. The observed complication proportions are 12/25 = 48% and 8/75 ≈ 10.7%, respectively. The split appears clinically meaningful, but these rates are noisy estimates and the threshold was selected from many candidates. Pruning and patient-level cross-validation estimate whether the rule generalizes. If the risk in the low-saturation leaf is later reported as 48%, external calibration must verify that probability; the training proportion is not automatically a calibrated risk.

## Interpretation and common pitfalls

- Show the full tree or a faithful simplified representation, including sample counts and event counts at leaves. A diagram without support counts can overstate certainty.
- Do not report selected split points as validated biological thresholds. They are data-dependent and may move in new cohorts.
- A tree path supports a prediction, not causal reasoning: “low saturation predicts complications” does not show that changing saturation itself prevents them.
- Compare a single tree with a simple regression and, where appropriate, ensembles. A more complex model may improve prediction but reduce transparency.
- Evaluate calibration and decision consequences at the intended threshold; accuracy alone does not define clinical usefulness.


## Split criteria, pruning, and uncertainty

For a binary node with event fraction p, Gini impurity is 2p(1-p); entropy is -p log(p) -(1-p) log(1-p). A candidate split is scored by the weighted decrease in impurity. If a parent node has 40 people, 12 events, its event fraction is .30 and Gini impurity .42. Suppose a split yields 20 people with 10 events (Gini .50) and 20 with 2 events (Gini .18). The children’s weighted impurity is (.50+.18)/2=.34, so the decrease is .08. Greedy search selects a best split among many candidates; this search itself creates optimism, which is why a visually plausible first split is not confirmatory evidence.

Cost-complexity pruning formalizes the trade-off between fit and size. For a tree T, one can minimize R(T)+alpha|T|, where R is training loss and |T| is the number of terminal leaves. As alpha increases, weakly supported branches are removed. The pruning parameter should be selected inside resampling, then assessed on untouched data. Depth and minimum node size are alternative complexity controls. Tiny leaves produce highly variable risks even if the tree diagram appears crisp.

```r
# rpart uses the Gini criterion for classification by default
library(rpart)
fit <- rpart(event ~ age + oxygen_saturation + comorbidity,
             data = train, method = "class",
             control = rpart.control(cp = .001, minbucket = 20,
                                     maxdepth = 4, xval = 10))
printcp(fit)                         # internal cross-validation is exploratory
pruned <- prune(fit, cp = fit$cptable[which.min(fit$cptable[, "xerror"]), "CP"])
p <- predict(pruned, newdata = test, type = "prob")[, "1"]
```

The example assumes `event` is a factor with level `1`; check factor ordering explicitly. `xval` does not automatically respect patient grouping or time, so use a custom resampling strategy when records cluster. Tree probability leaves are empirical proportions and can be extreme for small terminal nodes. Bootstrap the complete development procedure to examine split and variable-selection stability; a stable prediction does not guarantee a stable tree explanation. Compare tree performance and calibration against a prespecified logistic regression and a shallow tree. If no meaningful gain supports complexity, retain the simpler model.


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


## Full worked analysis: estimating risk groups

Suppose a cohort has 240 postoperative patients, 48 complications, and three candidate baseline predictors. The analyst wants a decision-support model at recovery-room discharge. Start by defining the prediction endpoint (e.g., unplanned ICU transfer within 48 hours), ascertainment, and decision time. A predictor such as “vasopressor started after discharge” is disallowed even if it strongly predicts transfer; it occurs after the intended prediction. A patient-level temporal split is preferable if the system will be applied to future patients. With only 48 events, a deep tree can create many leaves supported by one or two events. A maximum depth of two or three and a minimum leaf size set in advance are more defensible starting points than unconstrained growth.

At a terminal node containing 30 patients and 6 events, the empirical probability is .20. Its approximate binomial standard error is sqrt(.2*.8/30)=.073, so an ordinary 95% interval is roughly .06 to .34 (the Wilson interval is preferable near boundaries). This is substantial uncertainty even before accounting for the fact that the node was selected from data. Report support and uncertainty, and do not encode this single estimate as a rigid care threshold. Bootstrap the whole tree-building process and record how often each split recurs. If “oxygen saturation < 91%” appears in 35% of bootstrap trees and <94% in another 30%, a single displayed cutoff overstates stability.

```r
library(rpart)
set.seed(71)
fit <- rpart(event ~ age + oxygen_saturation + comorbidity,
             data = train, method = "class",
             control = rpart.control(cp = .002, minbucket = 20,
                                     maxdepth = 3, xval = 10))
printcp(fit)
cp.opt <- fit$cptable[which.min(fit$cptable[, "xerror"]), "CP"]
small <- prune(fit, cp = cp.opt)
print(small)
prob <- predict(small, newdata = test, type = "prob")[, "1"]
# Report event counts and calibration for the terminal leaves as well.
```

This code is a basic illustration: `xval` randomly partitions rows and should not be used as-is for clustered or future-time validation. With few events, use repeated grouped resampling or bootstrap optimism correction and present wide uncertainty. Choose pruning complexity without examining the final test set. Also compare a penalized logistic model. A tree may be preferred for a short rule set, but its split is a predictive partition, not a causal discontinuity or physiologic threshold.


## Full worked analysis: estimating risk groups

Suppose a cohort has 240 postoperative patients, 48 complications, and three candidate baseline predictors. The analyst wants a decision-support model at recovery-room discharge. Start by defining the prediction endpoint (e.g., unplanned ICU transfer within 48 hours), ascertainment, and decision time. A predictor such as “vasopressor started after discharge” is disallowed even if it strongly predicts transfer; it occurs after the intended prediction. A patient-level temporal split is preferable if the system will be applied to future patients. With only 48 events, a deep tree can create many leaves supported by one or two events. A maximum depth of two or three and a minimum leaf size set in advance are more defensible starting points than unconstrained growth.

At a terminal node containing 30 patients and 6 events, the empirical probability is .20. Its approximate binomial standard error is sqrt(.2*.8/30)=.073, so an ordinary 95% interval is roughly .06 to .34 (the Wilson interval is preferable near boundaries). This is substantial uncertainty even before accounting for the fact that the node was selected from data. Report support and uncertainty, and do not encode this single estimate as a rigid care threshold. Bootstrap the whole tree-building process and record how often each split recurs. If “oxygen saturation < 91%” appears in 35% of bootstrap trees and <94% in another 30%, a single displayed cutoff overstates stability.

```r
library(rpart)
set.seed(71)
fit <- rpart(event ~ age + oxygen_saturation + comorbidity,
             data = train, method = "class",
             control = rpart.control(cp = .002, minbucket = 20,
                                     maxdepth = 3, xval = 10))
printcp(fit)
cp.opt <- fit$cptable[which.min(fit$cptable[, "xerror"]), "CP"]
small <- prune(fit, cp = cp.opt)
print(small)
prob <- predict(small, newdata = test, type = "prob")[, "1"]
# Report event counts and calibration for the terminal leaves as well.
```

This code is a basic illustration: `xval` randomly partitions rows and should not be used as-is for clustered or future-time validation. With few events, use repeated grouped resampling or bootstrap optimism correction and present wide uncertainty. Choose pruning complexity without examining the final test set. Also compare a penalized logistic model. A tree may be preferred for a short rule set, but its split is a predictive partition, not a causal discontinuity or physiologic threshold.


## Reporting and practical interpretation

Report the exact algorithm and implementation, split criterion, candidate predictors, missing-value handling, minimum split and leaf sizes, depth or pruning rule, class weights, and method used to select complexity. A plot should include terminal-node sample sizes and event counts. Give the predicted probability or class rule and uncertainty; explain whether thresholds were prespecified or chosen empirically. A tree diagram can be deceptively authoritative because every branch looks deliberate. Distinguish a rule selected to optimize prediction in this sample from a clinical guideline supported by benefit-harm evidence.

In multi-site studies, consider site-specific trees only if the intended decision varies by site and enough independent outcomes exist. Otherwise, splitting on site can simply encode local practice. For missing values, surrogate splits can route a patient based on correlated predictors, but the path then differs from the displayed primary split; explain this behavior. Missingness itself may be predictive but can shift when documentation workflows change. Use sensitivity analysis for plausible missing-data mechanisms and avoid presenting data-driven missingness branches as physiology.

A useful comparison set includes an intercept-only risk, a simple regression, and a pruned tree. If the tree has similar discrimination but worse calibration or unstable cutpoints, it may still serve as an exploratory communication aid, but should not be called a reliable risk calculator. Conversely, an ensemble’s better AUC does not automatically justify discarding a simple tree if decisions and net benefit are equivalent. The model choice should be linked to a defined use and supported by external evaluation.


## Decision thresholds, subgroup checks, and deployment

A classification tree can output a leaf probability and a classification label, but those are separate objects. The default class threshold often reflects software conventions rather than consequences. If a leaf estimates .18 risk, an alert threshold of .15 would flag it, while a threshold of .25 would not; the correct choice depends on the value and burden of the action. Because tree probabilities are piecewise constant, adjacent patients on opposite sides of a split may receive sharply different predictions. Calibration plots and decision analysis should reveal whether this discontinuity is useful or merely a by-product of the partition.

Subgroup review should include sample sizes and event counts within leaves. A seemingly low-risk leaf may have few older adults or few patients from a rural site. If one subgroup is routed into a small leaf, uncertainty can be large even where the pooled leaf estimate appears precise. Do not respond to every subgroup fluctuation by adding new splits: that can overfit. Instead prespecify clinically important groups, quantify uncertainty, and seek external data. When a tree is converted into a bedside checklist, preserve the original predictor definitions, units, timing, and missingness behavior; informal simplification changes the fitted rule.

For deployment, define how to handle values outside observed ranges, absent predictors, and contradictory inputs. Standard trees still return a leaf for extreme values, even if that leaf is supported by a different clinical population. Establish data-quality checks and abstention conditions. After implementation, monitor the fraction entering each leaf, event rates, and action burden over time. A change in one upstream measurement system can send many patients down a different branch. Revalidation is needed after a change in coding, target definition, or workflow.


## Sample-size sensitivity and validation design

The combinatorial search in a tree is a source of optimism: among many candidate variables and cutpoints, one will appear to separate outcomes by chance. The more possible splits and the rarer the outcome, the more important complexity control becomes. Minimum leaf size should be chosen considering event and non-event counts, not just total observations. A terminal node with 25 people but one event does not support a stable risk estimate. Constraining leaves can reduce variance but may obscure genuine heterogeneity; compare a small, prespecified range through internal validation and report the selected complexity.

When data are clustered by hospital or clinician, the split criterion may favor site-specific coding practices. Validate by holding out whole sites if transport to new hospitals is the claim. If prediction targets future patients in the same system, use a temporal test period. Bootstrap confidence intervals should resample the correct unit and ideally repeat pruning and tuning. A confidence interval that conditions on a single selected tree misses split instability. Display bootstrap split frequencies or terminal-node membership overlap when the exact rule itself matters.

If the endpoint is censored time-to-event, a standard binary classification tree requires a fixed horizon and careful definition of patients with incomplete follow-up. Alternatives include survival trees, which use censoring-aware criteria, but they still need validation of survival probabilities and calibration. Competing risks also change the target: predicting any event versus a cause-specific event yields different labels. State horizon and estimand before fitting rather than choosing them to maximize apparent separation.

## References and further reading

- Moons KGM, Damen JAA, Kaul T, et al. PROBAST+AI: an updated quality, risk of bias, and applicability assessment tool for prediction models using regression or artificial intelligence methods. *BMJ*. 2025;388:e082505. [doi:10.1136/bmj-2024-082505](https://doi.org/10.1136/bmj-2024-082505)
- Breiman L, Friedman JH, Olshen RA, Stone CJ. *Classification and Regression Trees*. Chapman & Hall/CRC; 1984. [doi:10.1201/9781315139470](https://doi.org/10.1201/9781315139470)
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378)
