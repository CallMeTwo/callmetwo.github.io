---
title: Model validation and overfitting
summary: How to test whether a prediction or risk model generalises beyond its development data, and how to detect and prevent overfitting.
---

## Overview and key ideas

A regression model fitted to a dataset will always fit that dataset well — and increasingly well the more predictors you add. *Overfitting* is the failure mode in which the model captures random noise specific to the sample, so its *apparent* performance (e.g. R², AUC) is much better than its performance on new patients. Validation is the set of techniques that estimate how the model will actually perform in new data, and shrinkage is what overfitting does to a model: its coefficient estimates tend to be too large in magnitude, and its calibration (predicted vs observed probabilities) tends to be worse than it looks internally.

The standard ladder of validation is: **optimism** (no validation — the model's own fit, always too optimistic), **internal validation** (bootstrap resampling or k-fold cross-validation on the same data), **temporal validation** (apply the model to patients followed later in the same cohort), and **external validation** (apply it to a genuinely independent dataset, ideally from a different site). For a model with k fitted coefficients, the classic shortcut for the expected overfitting of R² is the shrinkage estimate: adjusted R² ≈ 1 − (1 − R²)(n − 1)/(n − k − 1). With n = 150 and k = 15, a development R² of 0.30 shrinks to about 1 − (0.70)(149/134) ≈ 0.20 — one-fifth of the variance, not three-tenths.

## When to use it

| Setting | Example question |
| --- | --- |
| Risk score development | Does this 12-week readmission model still rank patients correctly at the next site? |
| Biomarker panel | Is the panel's AUC in 200 patients likely to survive replication? |
| Model comparison | Which of two scoring rules predicts outcome better in *new* patients? |
| Regulatory / guideline work | Does the published model's calibration hold in our hospital's population? |

Validation is required whenever a model is used for prediction (not just inference) — every clinical risk score, nomogram or ML model — and the more predictive claims are made, the more rigorous the validation must be: development-only performance is a minimum for an honest external test, not a promise of it.

## Assumptions and limitations

- **Sample size relative to complexity**: the events-per-variable (EPV) heuristic (≥ 10 outcome events per predictor, often ≥ 20 for reliable prediction) is a guard against overfitting, not a law; small samples with many predictors guarantee optimistic performance estimates.
- **Applicability**: external validation tests performance *in a new population*; if the new population differs substantially (different case mix, outcome prevalence, measurement methods), the model may be inapplicable rather than merely imperfect.
- **Bootstrap assumptions**: the .632+ bootstrap (Efron) and k-fold CV estimate optimism under the assumption that the new data come from the same population; they do not protect against population shift.
- **Stability of the data-generating process**: a model validated on 2010–2015 data may fail after a care pathway change in 2020; temporal validity can decay.
- **What is being validated**: discrimination (AUC, calibration slope) and calibration (intercept, slope) are distinct; a model can discriminate well while being miscalibrated, and vice versa.

## Worked example

A team builds a logistic model predicting 30-day readmission from 12 predictors in 900 patients (215 readmissions). The development AUC is 0.79 and R² (Hosmer–Lemeshow-type) looks excellent. A 10-fold cross-validation gives AUC 0.71 — an optimism of 0.08. The calibration slope from the bootstrap is 0.72, indicating coefficients are about 28% too large. The team shrinks the model (ridge penalty) and re-estimates: AUC 0.72, slope 0.85. Two independent hospitals then apply the shrunk model: AUC 0.69 and 0.71, calibration slope 0.90 and 0.94. The honest claim is "AUC about 0.7, reasonably well calibrated, externally validated in two sites" — not "AUC 0.79". Had the unshrunk model been deployed, its predicted probabilities would have been systematically too extreme: patients it labelled 25% risk would have observed risk closer to 19%.

## Interpretation and common pitfalls

- Reporting the development AUC or R² as if it were the expected real-world performance is the single most common error; always pair it with a cross-validated or externally validated estimate.
- A "non-significant" difference between two models' AUCs means the data cannot distinguish them — it does not prove they are equally good, and it is not a license to pick by convenience and report the winner's optimistic number.
- Good discrimination (AUC) does not mean the model is clinically useful: compare the model's predictions to a baseline using decision-curve analysis or net reclassification, and check calibration in the risk range where decisions are actually made.
- Adding predictors until the cross-validated metric stops improving is a defensible stopping rule; adding predictors until the *development* metric stops improving is how overfitted models are built.
- External validation with a small external sample has its own wide CIs; a single external AUC of 0.68 with n = 120 may be compatible with a true AUC of 0.62–0.74 — report the CI.

For binary prediction models, report calibration as well as discrimination. The Brier score averages squared prediction errors and reflects both; calibration plots should include uncertainty and avoid overinterpreting sparse risk ranges. Internal validation must repeat every data-driven step inside each resample, including imputation, feature selection, and tuning, or optimism remains. External validation assesses transportability; report calibration slope and intercept and consider recalibration before refitting. AUC alone is insensitive to whether predicted risks are clinically useful, so decision-curve net benefit can complement performance measures when thresholds correspond to real decisions.

## Prediction targets and leakage

Validation asks whether a model's predictions generalize to the intended future population, time, and setting. Define the prediction time, outcome horizon, eligible population, and clinical use before splitting data. Leakage occurs when information unavailable at prediction time enters predictors, or when related observations from the same patient appear in both training and test data. Leakage produces deceptively strong performance. Split by patient, family, site, or time according to the deployment target.

Overfitting arises when model flexibility is large relative to information. In linear regression, adding predictors increases training R² and decreases residual error even when predictors encode noise. In logistic prediction, many parameters relative to events produce unstable coefficients and extreme risks. Feature selection, transformations, imputation, and tuning all contribute to effective model complexity. Penalization (ridge, lasso, elastic net) shrinks estimates but requires tuning within validation resamples.

## Worked example: optimism and internal validation

Suppose a logistic model is developed on 500 patients with 60 events and 30 candidate predictors, some selected by stepwise search. Apparent AUC=.86 may reflect selection noise. In bootstrap validation, each resample repeats imputation, variable selection, and fitting; test the fitted model back on original data to estimate optimism. If average optimism is .08, optimism-corrected AUC≈.78. A random train/test split would waste data and could be highly variable with only 60 events.

```r
set.seed(2026)
# Basic cross-validation illustration; preprocessing/selection belongs inside folds
fold <- sample(rep(1:5, length.out = nrow(dat)))
auc <- numeric(5)
for (k in 1:5) {
  train <- dat[fold != k, ]
  test <- dat[fold == k, ]
  fit <- glm(event ~ age + biomarker, family = binomial(), data = train)
  pred <- predict(fit, newdata = test, type = "response")
  # calculate AUC using a validated package, e.g. pROC::roc
  auc[k] <- as.numeric(pROC::auc(test$event, pred))
}
mean(auc)
```

This code demonstrates folds for a fixed two-predictor model. If variable selection or tuning occurs, it must be repeated inside each training fold. If multiple rows belong to one patient, assign folds by patient, not row. Repeated cross-validation reduces partition noise but not transportability uncertainty.

## Calibration, discrimination, and overall accuracy

Discrimination measures ranking: AUC is the probability a randomly chosen case receives a higher score than a randomly chosen noncase. It is insensitive to calibration shifts. Calibration compares predicted and observed absolute risk. Calibration-in-the-large assesses systematic over/underprediction; calibration slope detects predictions that are too extreme or too moderate. A Brier score is mean squared error of predicted probabilities and reflects calibration and discrimination, but depends on outcome prevalence.

Calibration plots should show uncertainty, especially in sparse risk ranges, and avoid over-smoothed curves. External validation should report calibration intercept and slope, AUC with interval, Brier score, and clinical net benefit if decision use is intended. Recalibration adjusts intercept and possibly slope; refitting all predictors requires new data and should be distinguished from validation.

## Resampling designs and external validation

Bootstrap validation is efficient for modest datasets and estimates optimism when the entire modeling pipeline is repeated. Cross-validation partitions data into folds and evaluates held-out predictions; nested CV is needed when tuning hyperparameters. The unit of resampling must match independent sampling. Clustered data require cluster bootstrap or grouped folds. Temporal validation trains on earlier data and tests later data; geographic validation tests transport across sites. External validation is strongest for generalization but can still be underpowered or unrepresentative.

Do not select the best-performing model on a test set and report its test performance as unbiased; repeated use turns the test set into training information. Keep a final test set untouched or use nested resampling. Preprocessing steps (scaling, imputation, feature filtering) must be estimated in training data only to avoid leakage.

## Sample size, shrinkage, and decision utility

A prediction model needs enough outcome information for all candidate parameters, including nonlinear terms and interactions. The old fixed events-per-variable rule is not sufficient; plan based on expected R², outcome prevalence, number of parameters, target shrinkage, and precision of overall risk. Shrinkage reduces coefficient extremes; calibration slope below one in validation indicates overfitting. A model can discriminate well but offer no net benefit at clinically relevant thresholds. Decision curves compare net benefit against treat-all and treat-none strategies, with thresholds representing action preferences.

## Reporting and deployment

Follow TRIPOD guidance: define intended use, participants, outcome, predictors, missing-data handling, model development, validation, and full coefficients. Provide code and a calculator only when reproducible and safe. Monitor calibration drift after deployment as prevalence, practice, assays, or coding change. Validation is not permanent; recalibration may be needed. A model's performance is population- and time-specific, and external deployment requires governance and impact evaluation, not AUC alone.


## Optimism correction and calibration recalibration

Apparent performance evaluates predictions on the same data used for fitting and is optimistic. Bootstrap optimism correction fits the model in each bootstrap sample, evaluates in bootstrap and original data, and subtracts the average performance gap from apparent performance. Every modeling step must be repeated within each bootstrap. If model selection is fixed outside resampling, estimated optimism remains understated.

Calibration-in-the-large can be assessed by fitting an intercept-only logistic recalibration model with the original linear predictor as an offset; ideal intercept is zero. Calibration slope comes from logit(Y)~α+γ logit(p̂); ideal γ=1. A slope below one suggests overfitting and overly extreme predictions. Updating intercept and slope can recalibrate to a new setting, but should be reported separately from full model redevelopment.

## Validation uncertainty and transport

A validation estimate has its own uncertainty. AUC confidence intervals can be wide when events or non-events are few; calibration curves are especially uncertain in risk tails. Report denominators and intervals, not only point metrics. Compare case mix, outcome prevalence, measurement procedures, and care pathways between development and validation settings. A performance drop can result from predictor distribution shift, changed baseline risk, coding drift, or genuine effect changes.

Temporal validation is useful for clinical systems likely to drift; geographic validation probes site transport. Random splitting within one hospital mainly estimates performance on similar patients and may not reflect deployment elsewhere. External validation should use the intended-use population and preserve an untouched dataset. Recalibration can help if only baseline risk shifts, but predictor effects may also change.

## Decision utility and model impact

A model with better AUC does not necessarily improve decisions. Decision-curve analysis evaluates net benefit across threshold probabilities by weighing true positives against false positives according to the implied harm-benefit tradeoff. The relevant threshold range should be clinically plausible. Prospective impact evaluation assesses whether using the model changes care and outcomes, including workload, inequity, and unintended consequences. A model should not be deployed based only on internal validation metrics.

Before release, lock model version, define input availability and missingness handling, assess subgroup calibration, and monitor performance over time. Provide a fallback when inputs are unavailable and governance for updates. Validation is an ongoing process, not a one-time certificate.

## Performance measures for continuous outcomes

For continuous prediction, report calibration plot of observed versus predicted values, mean absolute error, root mean squared error, and R² in validation data. RMSE penalizes large errors more heavily than MAE; neither is meaningful without outcome units and a baseline comparison. R² can be negative on a test set if predictions perform worse than predicting the training mean. Prediction intervals should be evaluated for coverage and width, not only point error.

For binary outcomes, compare Brier score with the null score based on prevalence and report calibration. AUC can remain unchanged under any monotonic transformation of predictions, even when absolute probabilities are badly wrong. Threshold-specific sensitivity, specificity, and predictive values depend on the decision threshold and prevalence. Choose metrics based on intended use and harms of errors, not convenience.

## Reproducible validation pipeline

Use nested resampling for hyperparameter selection: inner folds select tuning parameters; outer folds estimate generalization. All data-dependent transformations—standardization, missing-data imputation, feature screening, spline-knot choices if estimated, and calibration—must be learned within training folds. Keep a final external dataset untouched until model choices are fixed. Document random seeds, fold assignment, software versions, and event distribution per fold. If temporal drift is expected, random CV may overstate future performance; use rolling-origin or temporal validation.

## Worked example: calibration slope

Suppose external validation yields calibration slope γ=.72 (95% CI .55 to .89). Predictions are too extreme: high predicted risks are generally too high and low risks too low. A simple recalibration shrinks the original logit predictions by .72 and estimates a new intercept to match average risk. This improves calibration under a transport assumption that predictor ranking and relative effects are broadly stable. If predictors have changed effects or measurement, intercept/slope recalibration may not suffice.

A calibration slope estimated in the same development data is optimistically near one by construction. Use bootstrap or external data. Report calibration-in-the-large separately, as a model may have a good slope but systematically overpredict across the population.

## Subgroup validation and fairness

Evaluate calibration and discrimination across clinically relevant demographic and care subgroups, with uncertainty and adequate denominators. Similar AUCs do not guarantee similar false-positive burdens or calibration. Small subgroup samples can make estimates unstable; report uncertainty rather than overclaiming parity. Investigate missingness, measurement quality, and prevalence differences. Fairness criteria can conflict, so state the chosen clinical and ethical objective and governance process.

## Predictor selection and shrinkage

Univariable screening can discard predictors that matter jointly and inflate selection bias among retained coefficients. Stepwise selection yields unstable models when predictors are correlated and fails to account for search in ordinary intervals. If the aim is prediction, ridge or elastic-net shrinkage can stabilize coefficients; lasso can set some to zero but selection may vary across samples. Tune penalties within nested resampling and report the full pipeline. If the goal is causal estimation, select covariates from the causal estimand, not predictive performance alone.

A useful validation report specifies development and validation dates/sites, participant flow, outcome prevalence, missingness, predictor availability, metrics with intervals, calibration, and any recalibration. Make the intended use explicit: triage, screening, prognosis, or treatment selection each has different acceptable errors. Independent validation should reproduce the original predictor definitions exactly before any adaptation is considered.

Missing predictors at deployment create a practical validation issue: evaluate the same imputation or fallback strategy intended for use. A model validated only on complete records may perform worse in routine practice where missingness is common. Track missing input rates, subgroup performance, and consequences of fallback decisions after implementation.

Validation results should be reported with the exact model version and predictor definitions. If recalibration or coefficient updating is performed, that updated model needs another evaluation on data not used for the update. Distinguish “external validation of the original model” from “model updating followed by evaluation,” since they support different conclusions about transport.

## References and further reading

- Collins GS, Reitsma JB, Altman DG, Moons KGM. Transparent reporting of a multivariable prediction model for individual prognosis or diagnosis (TRIPOD). *Annals of Internal Medicine*. 2015;162:55–63. [doi:10.7326/M14-0697](https://doi.org/10.7326/M14-0697)

- Vickers AJ, Elkin EB. "Decision curve analysis: a novel method for evaluating prediction models." *Med Decis Making* 2006.
- Fox J. *Applied Regression Analysis and Generalized Linear Models*. SAGE.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- The companion [model assumptions and diagnostics article](model-assumptions-and-diagnostics.html) covers checks that should precede validation.

If the validation setting differs from development, distinguish a genuine transport failure from a changed outcome definition or predictor measurement. Reproduce the original definitions first, quantify missing or shifted predictors, and then report any adaptation as model updating. This preserves a clear record of what was externally tested and what was newly fitted.
