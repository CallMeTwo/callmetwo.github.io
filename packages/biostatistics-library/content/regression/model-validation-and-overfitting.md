---
title: Model validation and overfitting
summary: Estimate how well a model will perform beyond its development data, control optimism from flexible modeling, and validate calibration, discrimination, and utility.
---

## Overview

Overfitting occurs when a model captures random quirks of its development sample along with reproducible signal. Apparent performance measured on the same data used to choose predictors and tune parameters is optimistic. Validation estimates how well the full modeling process will perform in new observations, time periods, or settings.

Validation is not one number. For prediction, assess calibration (probabilities are accurate), discrimination (ranking), and clinical utility (decisions improve). The design must match deployment: future patients, new hospitals, or other populations create different transport challenges. A high AUC in a random split does not establish useful absolute risk or external validity.

## Development data and model complexity

Effective model complexity includes every estimated parameter: categories, spline terms, interactions, transformations, and data-driven selection. Ten variables can imply many more than ten parameters. A large predictor set relative to events invites overfitting, unstable coefficients, and exaggerated predictions. Shrinkage, penalization, and prior regularization can reduce variance but cannot create information absent from data.

Avoid univariable screening followed by stepwise selection as default. It leads to biased coefficients, unstable selected predictors, and invalid ordinary confidence intervals. Prespecify clinically relevant predictors, use shrinkage, and validate the entire modeling strategy. If feature selection or tuning is done, repeat it inside each resample or training fold.

Sample size should be planned from desired shrinkage, calibration precision, event fraction, and anticipated model fit rather than a fixed events-per-variable rule. Prediction-model sample-size formulas can estimate required events and total participants. Sparse outcome settings need larger samples because calibration and subgroup performance require enough events and non-events.

## Apparent, internal, and external performance

Apparent performance is evaluated on development data and is optimistic. Internal validation estimates optimism using the same source population. Bootstrap validation draws samples with replacement, repeats all modeling steps, and compares performance in bootstrap samples with performance in the original data. Average optimism is subtracted from apparent performance.

Cross-validation divides data into folds, fits on training folds, and evaluates held-out predictions. Repeated cross-validation reduces dependence on a single split. A split-sample approach is simple but inefficient: it uses fewer observations for both fitting and validation and can have high variance, especially in small datasets.

External validation applies a locked model to independent data without refitting coefficients. Temporal validation tests performance in later patients at the same site; geographic validation tests other sites; setting validation tests other care systems. If the model is updated using validation data, call it model updating and use new data for unbiased assessment of the updated version.

## Avoid leakage in resampling

Every data-dependent operation belongs inside the training portion of each fold: imputation, scaling, feature selection, spline knot selection, tuning, and threshold selection. If imputation is done once before splitting, information from held-out outcomes can leak into development. If patient records are repeated, keep each patient in one fold. For transport to new hospitals, split by hospital rather than individual.

Temporal data require temporal validation. Randomly dividing rows can allow future observations to inform predictions for the past and can distribute seasonal or coding patterns across folds. Use rolling-origin validation or a prespecified temporal holdout. For clustered data, leave-one-cluster-out or grouped folds assess performance in new clusters.

Repeated cross-validation uses several random fold partitions, reducing dependence on one split. It does not create independent validation data; fold estimates are correlated and uncertainty calculation needs care. Bootstrap optimism correction can be more efficient for smaller datasets, but relies on the empirical sample approximating the target population. External validation remains the clearest transport assessment.

For hyperparameter tuning, use nested cross-validation: inner folds choose penalty or model settings, outer folds estimate performance. If the same folds choose and evaluate tuning parameters, performance is optimistic. After tuning, refit the final model on all development data and lock it before external evaluation.

Preprocessing must also be nested. Centering, scaling, missing-data imputation, feature filtering, and batch correction should be estimated within training data and applied to held-out data. For unsupervised transformations using no outcomes, leakage can still occur if held-out distribution information would not be available at deployment. Simulate the deployment pipeline faithfully.

## Performance measures for binary predictions

Discrimination is often summarized by ROC AUC, the probability an event case receives a higher score than a non-event case. AUC is insensitive to calibration and prevalence, and can appear high for a model that gives inaccurate probabilities. Precision-recall curves emphasize positive predictive value when events are rare, but depend on prevalence.

Calibration compares predicted and observed event probabilities. Calibration-in-the-large detects average over- or underprediction; calibration slope detects predictions that are too extreme or too moderate. Plot smooth observed risk against predicted risk with uncertainty. Grouped deciles can hide local miscalibration and should be interpreted cautiously.

Brier score is mean squared probability error, \(n^{-1}\sum(p_i-y_i)^2\); lower is better. It combines calibration and discrimination and depends on event prevalence. Compare against a reference prediction such as prevalence. Report confidence intervals for performance metrics using resampling at the independent unit.

Calibration-in-the-large can be estimated by fitting a logistic model with the original linear predictor as offset; ideal calibration intercept is zero. The calibration slope is estimated by regressing outcome on the linear predictor; ideal slope is one. A slope below one indicates predictions are too extreme, often due to overfitting. An intercept may be zero while slope is poor, so report both and inspect a curve.

Calibration plots can be built from flexible smooths, but the curve is uncertain in the tails where few patients have extreme predictions. Show confidence bands and rug marks. Grouping into deciles is simple but creates arbitrary bins and can hide local errors. Hosmer–Lemeshow tests depend on binning and sample size and should not replace graphical assessment.

Calibration is horizon-specific. A model predicting 1-year event probability should be assessed for 1-year outcomes, accounting for censoring if not all participants have complete follow-up. Treating censored individuals as non-events biases calibration. For time-to-event prediction, use time-dependent calibration methods and state the horizon.

Discrimination also depends on case mix. AUC can be higher in a heterogeneous validation population than a homogeneous one even if model coefficients are unchanged. Compare populations and report AUC with uncertainty; use calibration and decision performance to judge practical value. AUC alone cannot establish transportability.

## Worked example: optimistic AUC

Suppose a model with 30 candidate parameters is fit to 150 patients and 45 events. Apparent AUC is 0.88, but bootstrap optimism is 0.09, giving optimism-corrected AUC 0.79. Calibration slope is 0.62, suggesting predictions are too extreme. The model has learned sample-specific patterns. A penalized model may yield lower apparent AUC but better corrected calibration and prediction in new patients.

This example does not establish the model's future performance. Bootstrap validation assumes development data represent the target population and repeats the full pipeline. External validation is still needed. With only 45 events, even optimism-corrected performance is uncertain; show intervals and avoid reporting 0.79 as a precise property.

## R workflow for bootstrap validation

The `rms` package can estimate optimism-corrected discrimination and calibration for a logistic model. The example uses a prespecified model; if variable selection or tuning occurs, that entire procedure must be repeated within each bootstrap.

```r
library(rms)
dd <- datadist(dat); options(datadist = "dd")
fit <- lrm(event ~ rcs(age, 4) + sex + severity + treatment,
           data = dat, x = TRUE, y = TRUE)
validate(fit, method = "boot", B = 1000)
cal <- calibrate(fit, method = "boot", B = 1000)
plot(cal)
```

Inspect optimism estimates and calibration curve, and report number of resamples, seed, and failed fits. The model syntax and spline knots should be justified and fixed or reselected inside resamples according to the intended development process. This workflow is internal validation, not external validation.

Suppose at a 10% threshold, 60 of 100 events and 720 of 900 non-events are correctly classified. Sensitivity is 60%, specificity 80%, and positive predictive value is 60/(60+180)=25%. The model flags 240 of 1,000 patients, and three quarters of flags are false positives under this outcome definition. Whether this is acceptable depends on intervention burden and missed-event consequences. AUC alone does not expose this tradeoff.

## Thresholds and clinical utility

Threshold-specific sensitivity, specificity, predictive values, and net benefit address decisions more directly. Select thresholds based on clinical consequences and patient preferences, not by maximizing performance on the validation data. Decision-curve analysis compares model-guided action with treat-all and treat-none across thresholds; it relies on utility assumptions and does not prove improved patient outcomes.

If a threshold is selected as part of model development, selection must occur within resampling and evaluation on independent data. Report proportion flagged, false-positive burden, and downstream resource implications. A model can improve AUC while worsening decision utility at the clinically relevant threshold.

Decision-curve net benefit at threshold \(p_t\) is \(TP/n-(FP/n)\times p_t/(1-p_t)\). The threshold encodes the relative consequence of false positives to true positives. Plot model net benefit against treat-all and treat-none over thresholds clinicians consider plausible. A curve above these strategies suggests potential utility under the assumed tradeoff, not proven improvement in patient outcomes.

Threshold performance varies with prevalence. Sensitivity and specificity are conditional on outcome status and can transport differently; positive predictive value and negative predictive value depend directly on event prevalence. Report expected numbers flagged and events captured per 1,000 patients in the target setting. If prevalence shifts, recalibrate and recalculate utility.

Clinical impact evaluation may require a prospective implementation study or randomized trial. The model could change clinician behavior, induce testing, or create alert fatigue. Statistical validation in retrospective records does not evaluate these workflow effects. Distinguish model performance from impact of using the model.

## Recalibration, updating, and transport

When calibration drifts but predictor effects remain stable, updating the intercept can adjust average risk; updating intercept and slope can correct systematic overfitting. More extensive recalibration modifies coefficients or adds predictors. Each update creates a new model version and should be validated separately. Do not describe validation data used for refitting as an untouched test set.

Transport may fail because prevalence, case mix, predictor measurement, or outcome definitions differ. AUC can shift with spectrum; calibration often changes with baseline risk. Assess subgroup performance and data quality, and identify missing predictors. Recalibration cannot fix a changed relationship or severe measurement mismatch.

External validation should compare inclusion criteria, predictor availability and timing, outcome definition, follow-up horizon, and missing-data process with development. Apply the original model without refitting first. Report calibration, discrimination, decision utility, and uncertainty. Differences in coding or laboratory assay should be documented before interpreting performance loss as a statistical problem.

If recalibration is needed, an intercept-only update changes average predicted risk while preserving relative coefficients. Updating intercept and slope adjusts both average level and extremity. Full coefficient revision or predictor addition constitutes model updating. Avoid optimizing many parameters in a small validation dataset; shrink updated parameters and validate in a later or separate sample.

Geographic and temporal validation are not interchangeable. A later cohort at one hospital probes changes in practice and prevalence; a different hospital probes organizational and case-mix transport. A model may pass one and fail the other. Multisite validation can quantify heterogeneity and identify where local recalibration is needed.

## Overfitting, shrinkage, and model stability

Ridge regression shrinks coefficients toward zero and is useful with correlated predictors; lasso can set coefficients to zero but selection can be unstable; elastic net combines penalties. Firth logistic regression addresses small-sample bias and separation. Bayesian priors provide regularization with explicit assumptions. Tune penalties inside resampling and report the chosen method.

Bootstrap coefficient distributions and selection frequencies can reveal instability. If small data changes produce different selected variables or large coefficient swings, avoid claiming a definitive predictor set. For prediction, stable out-of-sample performance can matter more than stable individual coefficients, but implementation still needs transparent model specification.

Uniform shrinkage multiplies regression coefficients by a factor between zero and one, reducing overextreme predictions. Ridge shrinkage is continuous and handles collinearity; lasso selects a sparse set but may choose arbitrarily among correlated predictors. Elastic net balances both. Tuning must be internal to validation. Report whether predictors were standardized before penalization and how the intercept was treated.

Bootstrap optimism correction estimates apparent minus test performance within resamples. For each bootstrap sample, repeat model development, calculate performance in bootstrap data, then in original data; average difference estimates optimism. Subtract from apparent performance. If the development algorithm includes stepwise selection, that selection must be rerun in every resample. Otherwise correction ignores the main source of overfitting.

With small development samples, performance estimates themselves have wide uncertainty. A single split can yield wildly different results depending on which events land in test data. Prefer bootstrap or repeated/nested cross-validation for internal validation, but report limitations and seek external validation. Do not treat resampling as a replacement for adequate sample size.

## Reporting validation clearly

State development and validation populations, sample sizes and events, split strategy, all modeling steps, performance measures, uncertainty intervals, calibration, discrimination, threshold utility, and missingness handling. Identify whether validation was internal, temporal, geographic, or external. Report model version and any recalibration.

For clustered or repeated data, explain how dependence was handled in splitting and uncertainty. For prediction in clinical practice, describe prediction time, horizon, available predictors, and deployment workflow. TRIPOD and TRIPOD+AI guidance support transparent reporting but do not replace sound design.

Describe the full development pipeline, including candidate predictors, transformations, missing-data handling, selection, tuning, and threshold choice. State which steps were repeated inside resampling and which were fixed in advance. Give calibration plots and discrimination with intervals, not only a single C-statistic. For external validation, state whether any recalibration occurred before final evaluation.

Provide model equations, intercept, coefficients, coding rules, and software so predictions can be reproduced. If intellectual-property or data-access constraints limit release, explain them and provide a route for qualified validation. A model's public paper alone is not a deployable specification.

## Temporal and geographic drift

Temporal validation should preserve chronology. Train on earlier years and evaluate later years, optionally using rolling windows to assess degradation and retraining. Coding, treatment standards, diagnostic technology, and prevalence may change. A model that performs well in a random split of pooled years can fail when used prospectively because each split contains examples from every era.

Geographic validation should hold out whole sites or regions. If site identifiers or local coding patterns appear in both train and test, performance can reflect site recognition rather than portable clinical signal. Compare calibration and error across sites and report heterogeneity. A pooled mean can hide poor performance in a vulnerable subgroup or rural setting.

When sample size is small, leave-one-site-out estimates can be noisy and the sites may not represent the target deployment population. Interpret them as stress tests, not definitive ranking. Prospective validation in intended-use workflows remains important for high-stakes models.

Validation sample size should be planned for precision of calibration and utility, not simply as a percentage of development data. Few outcome events produce wide intervals for calibration slope and threshold sensitivity. Report uncertainty and avoid declaring acceptable performance from a favorable point estimate alone.

After deployment, monitor data quality, alert volume, calibration, subgroup errors, and clinician response. Predefine triggers for review, recalibration, or suspension. A model version should be traceable to its development dataset, code, coefficients, and validation evidence.

Drift monitoring should respect privacy and avoid reacting to random short-term variation. Use rolling summaries with uncertainty and document who reviews alerts. Recalibration must not be confused with evidence that clinical outcomes improved.

Report the exact model version and validation population with any quoted performance statistic.

An apparent performance estimate should always be labeled as apparent when reported; readers should not confuse it with validation evidence.

When reporting an updated model, retain the original validation result and present new performance estimates only from data not used to update. This avoids reusing the same validation evidence as both development and evaluation.

The deployment threshold should be evaluated in the same population and care pathway in which alerts will operate. A threshold selected to achieve a sensitivity target in a retrospective cohort may produce a very different alert burden when prevalence changes or clinicians order tests selectively. Estimate sensitivity, specificity, positive predictive value, and alerts per 1,000 people with uncertainty at the proposed threshold; describe the action triggered by a positive result. If clinicians can override or ignore alerts, evaluation should include uptake and downstream consequences, not only the frozen model's score. This moves assessment from an abstract discrimination exercise toward the actual decision system while preserving the distinction between prediction and evidence that using the model improves health.

## References and further reading

- Steyerberg EW. *Clinical Prediction Models*. 2nd ed. Springer; 2019.
- Riley RD, Ensor J, Snell KIE, et al. Calculating the sample size required for developing a clinical prediction model. *BMJ*. 2020;368:m441. [doi:10.1136/bmj.m441](https://doi.org/10.1136/bmj.m441)
- Collins GS, Reitsma JB, Altman DG, Moons KGM. Transparent reporting of a multivariable prediction model for individual prognosis or diagnosis (TRIPOD). *Ann Intern Med*. 2015;162:55–63. [doi:10.7326/M14-0697](https://doi.org/10.7326/M14-0697)
- Harrell FE. *Regression Modeling Strategies*. 2nd ed. Springer; 2015.
- Van Calster B, McLernon DJ, van Smeden M, Wynants L, Steyerberg EW. Calibration: the Achilles heel of predictive analytics. *BMC Medicine*. 2019;17:230. [doi:10.1186/s12916-019-1466-7](https://doi.org/10.1186/s12916-019-1466-7)
