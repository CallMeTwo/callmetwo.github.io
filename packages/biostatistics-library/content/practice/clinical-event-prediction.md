---
title: Clinical event prediction
summary: Develop and evaluate clinical risk models by defining a prediction target, validating calibration and discrimination, and linking scores to decisions.
---

## Overview

A clinical prediction model estimates an individual's probability of an outcome over a stated time horizon from information available at a stated moment. Its purpose is to support a decision: triage, preventive treatment, diagnostic work-up, or planning. It is not a causal model. A variable can predict an outcome without causing it, and a strong association does not guarantee useful decisions.

Prediction starts with the use case rather than the algorithm. Specify the eligible population, prediction time, outcome, horizon, intended user, and action that a score might change. “Predict mortality” is underspecified: in whom, from what time origin, over what period, and using which measurements? These choices determine cohort construction, feature availability, outcome labeling, and performance measures.

## Define the prediction task before selecting variables

For a 30-day readmission tool, the target might be: among adults discharged alive from medical wards, estimate the probability of unplanned readmission within 30 days using information available at discharge. A patient readmitted on day 45 is a non-event for this horizon; a death before readmission is a competing event and needs an explicit rule. If the model is intended for use at admission, discharge medications and length of stay are unavailable and must not be predictors.

Leakage occurs when a predictor contains information recorded after the prediction time or is a proxy for the outcome process itself. Examples include a billing code finalized after readmission, a laboratory measurement ordered because deterioration has begun, or a variable derived from the entire follow-up record. Time stamps and a simulated “as-of” data extract help reveal this problem. Also define how repeat admissions are handled and whether the estimand concerns a patient's first eligible episode or all episodes.

## Development and validation without optimistic shortcuts

Data should resemble the population and workflow where the model will be used. Resolve duplicate records, impossible dates, changing coding systems, and missingness while preserving the temporal structure. Split data by patient, not encounter, when individuals contribute repeated encounters. Random train/test splitting can estimate internal performance but does not test transport to another hospital, later period, or care system. Temporal and geographic validation answer distinct transport questions.

Choose model complexity based on the number of outcome events, candidate parameters, predictor distributions, and expected signal. Penalization can reduce overfitting, but does not replace adequate sample size. All data-driven steps—imputation, feature selection, scaling, tuning, and threshold selection—must occur within each resampling fold. Doing preprocessing before cross-validation leaks information from held-out observations.

## Example: translating predicted risks into performance

Suppose a model gives predicted 30-day risks to 1,000 discharges. In a validation sample, 100 patients are readmitted. At a 10% action threshold, it flags 240 people, of whom 60 are readmitted; it misses 40 events. Sensitivity is 60/100 = 0.60, specificity is 720/900 = 0.80, positive predictive value is 60/240 = 0.25. The tool finds 60% of readmissions, while three quarters of flagged patients are not readmitted. Whether that is useful depends on the consequences and burden of the action triggered.

Discrimination summarizes ranking. The area under the ROC curve is the probability that a randomly selected event receives a higher score than a randomly selected non-event. It does not tell whether a predicted risk of 20% corresponds to a 20% event rate. Calibration addresses that probability meaning. A calibration plot compares observed and predicted risk across the range; calibration-in-the-large detects systematic over- or underprediction, while a calibration slope below 1 often indicates predictions that are too extreme.

```r
library(rms)
fit <- lrm(readmit30 ~ age + comorbidity + prior_admission +
             creatinine + discharge_support,
           data = development, x = TRUE, y = TRUE)
pred <- predict(fit, newdata = validation, type = "fitted")
val.prob(pred, validation$readmit30, m = 10)
```

This sketch assumes a binary fixed-horizon outcome with complete follow-up. If some patients are lost before day 30, ordinary binary validation can misclassify unknown outcomes; use methods for censoring or define ascertainment rules. The model formula, coding, imputation and validation design need to match the planned deployment pipeline.

## From statistical performance to a care decision

Decision-curve analysis expresses the tradeoff between true-positive and false-positive classifications over thresholds. At threshold (p_t), net benefit is \(TP/n - FP/n \times p_t/(1-p_t)\). For the example, at (p_t=0.10), net benefit is \(60/1000 - 180/1000\times .1/.9=0.04\), or 40 net true-positive equivalents per 1,000 patients. Compare this with “treat none” (zero) and “treat all”; the latter has net benefit \(.10-.90(.1/.9)=0\). This calculation is only meaningful if the threshold represents a real decision and the intervention has the assumed consequences.

Calibration often changes across settings as prevalence, referral patterns, or measurement practices shift. External validation should report calibration as well as AUC. Recalibration of the intercept or slope can correct systematic drift, but cannot repair changed predictor-outcome relationships or missing predictors. Monitor performance after deployment, including subgroup calibration, alert frequency, clinician response, and downstream outcomes. A model can retain AUC while becoming dangerously miscalibrated.

## Validation questions that need separate answers

Internal validation estimates optimism caused by developing a model in a finite sample. Bootstrap optimism correction repeatedly samples development participants, refits the complete modeling process, and compares performance in the bootstrap sample with performance when that fitted model is applied to the original sample. The average optimism is subtracted from apparent performance. This is often more efficient than a single random split, especially when data are limited, provided all modeling steps are repeated inside the bootstrap.

Cross-validation partitions the sample into folds, trains on all but one fold, and predicts the held-out fold; repeating this gives out-of-fold predictions. For repeated records, family members, or multisite data, fold assignment must keep dependent units together. For temporal prediction, random folds can leak future practice patterns into earlier records. Use rolling-origin or temporal validation when the deployment question is future performance. A split-sample estimate is often unstable because it uses less data to fit and fewer observations to validate.

External validation applies a locked model to new participants without refitting its coefficients. Report any deviations in predictor definitions, outcome ascertainment, eligibility, and follow-up. A later-period sample at the same hospital tests temporal transport; a different hospital tests geographic transport. If the model is updated using the validation data, label the result as model updating and evaluate the updated version in another sample.

### Calibration as an absolute-risk check

If 100 people are assigned risks around 0.20, about 20 events are expected on average over repeated comparable groups; it does not mean exactly 20 events must occur. Calibration plots compare predicted with observed frequencies across risk. Grouping into deciles is easy to communicate but can hide local miscalibration and depend on arbitrary cut points. Smooth calibration curves with uncertainty bands are more informative when sample size allows.

Calibration-in-the-large asks whether predictions are systematically too high or low. A calibration slope assesses whether predictions are too extreme or too moderate. In a logistic model, one can regress outcome on the logit of the predicted probability; ideal intercept is 0 and slope is 1. A slope below 1 indicates overly extreme predictions, often from overfitting. A slope above 1 indicates predictions vary too little. These summaries do not capture every shape of miscalibration, so pair them with plots.

```r
lp <- qlogis(pmin(pmax(pred, 1e-6), 1 - 1e-6))
calibration_slope <- coef(glm(validation$readmit30 ~ lp,
                              family = binomial()))["lp"]
calibration_slope
```

The intercept in this regression is conditional on the estimated slope; calibration-in-the-large is often estimated with the slope fixed at 1. Report which definition is used. With censoring before the prediction horizon, use time-dependent calibration methods rather than treating unobserved outcomes as event-free.

Discrimination and calibration answer different questions. A model can have a high AUC and systematically overestimate every patient's absolute risk. Conversely, recalibrating the baseline risk can improve calibration while leaving ranking, and thus AUC, nearly unchanged. Because clinical actions usually depend on absolute risk, calibration drift can invalidate a threshold even when discrimination seems stable.

## Outcomes, censoring, and competing events

For a fixed horizon, binary prediction requires outcome status to be known for all included people. If administrative follow-up ends before the horizon, excluding those patients can create selection bias; classifying them as non-events is worse. Use survival prediction methods that account for right censoring, and state the time origin and horizon. At a specified horizon, assess time-dependent discrimination, calibration, and Brier score with methods that appropriately handle censoring.

Death may prevent a nonfatal event such as readmission. A cause-specific cumulative incidence is not the same quantity as one minus a Kaplan–Meier estimate that censors competing deaths. Decide whether the model predicts the probability of the event in the presence of competing events, a cause-specific hazard, or a composite. The decision and interpretation differ. For repeated events, define whether the target is first event, number of events, or time to recurrent event.

Outcome definitions must be clinically coherent and reproducible. A code-based readmission measure may vary with billing practices, while adjudicated outcomes may be more specific but costly. Misclassification changes calibration and apparent performance. If ascertainment differs by site or patient group, apparent subgroup model performance can reflect measurement differences rather than genuine risk differences.

## Thresholds, harms, and the decision pathway

A risk threshold is a policy choice that trades false positives against false negatives. At threshold (p_t), the relative weight (p_t/(1-p_t)) encodes the harm of unnecessary intervention relative to missing an event under the decision-curve framework. At (p_t=0.10), one false positive is weighted as one ninth of a true positive. This is not a universal property of the disease; it depends on the action and context. If an alert prompts a low-cost assessment, the acceptable threshold may be lower than if it triggers a harmful treatment.

Decision curves compare net benefit for model-guided action with treat-all and treat-none strategies across plausible thresholds. They do not establish that the model improves patient outcomes. A model may have positive net benefit under assumed utilities but fail because clinicians ignore alerts, interventions are ineffective, or care capacity is limited. An impact study or randomized implementation evaluation may be required to measure clinical consequences.

Avoid optimizing the threshold on the same validation sample and then reporting its performance as if prespecified. That creates optimism. Define plausible thresholds with clinicians and patients before validation, or treat threshold selection as model development and evaluate the selected policy in new data. Report sensitivity, specificity, predictive values, and proportion flagged at the proposed threshold; predictive values change with prevalence and will not transport automatically.

## Deployment is another validation setting

A model changes when its environment changes. New laboratory assays, clinical pathways, coding policies, and case mix can alter predictor distributions and outcome rates. A deployment plan should define data-quality checks, missing-predictor handling, score version, intended users, override rules, and monitoring intervals. Track calibration, discrimination, subgroup performance, alert burden, clinician uptake, and downstream harms. Reassess after major workflow changes.

Recalibration may update an intercept to match a changed event rate or update intercept and slope to correct systematic overfitting. More extensive model revision needs new validation. Do not silently retrain and keep the same model name: the new version has different parameters and requires its own documentation and evaluation. If monitoring detects a problem, a safe fallback may be to suspend automated recommendations while preserving ordinary clinical judgment.

Performance should be assessed across groups relevant to access and safety, but no single fairness metric answers every concern. Calibration within groups, false-negative rates, false-positive rates, and opportunity to receive follow-up may point in different directions. Small subgroup samples produce wide uncertainty; show those intervals rather than presenting unstable point estimates as definitive rankings. Consider whether predictors encode structural differences in healthcare access and whether deployment would amplify those differences.

## Predictor handling and model complexity

Predictors should be measured before or at the stated prediction time and defined in a way that can be reproduced at use. A continuous predictor should usually remain continuous; arbitrary categorization discards information and creates artificial jumps in predicted risk. If the relationship may be nonlinear, use restricted cubic splines or other prespecified flexible terms and assess whether complexity is supported by events. Interactions can be clinically important but consume degrees of freedom and can destabilize estimates.

Missing predictors are common in routine records. Complete-case analysis can change the target population and bias estimates when complete records are selected. Multiple imputation can be appropriate during development, but the imputation model must avoid leakage from future information and be usable in the intended prediction setting. At deployment, missingness handling must be fully specified; “impute the validation mean” is not a deployable rule unless that value is fixed from development data. Consider whether a missing indicator reflects care processes that may not transport.

The number of candidate parameters matters more than the number of named variables. A categorical variable with several levels, a spline, and interactions each use multiple parameters. Model-development sample-size calculations should consider event fraction, anticipated model fit, and desired shrinkage or precision, not rely on a fixed events-per-variable rule. Penalized regression can control variance and improve calibration, but hyperparameters require internal resampling. Machine-learning algorithms also need adequate events and nested validation; flexibility does not create information.

For a clinical model, simplicity has operational value: fewer predictors can reduce missingness, measurement burden, and integration failures. But removing a predictor solely because its individual p-value exceeds 0.05 is not a principled simplification rule. Compare candidate models with optimism-corrected performance, calibration, decision consequences, and implementation burden. A small apparent AUC gain may not justify collecting an invasive test or maintaining a complex pipeline.

## Communicating uncertainty to users

Predicted probabilities are estimates, not facts about a patient's future. Their uncertainty includes sampling variation in coefficients, model selection, missing-data handling, and future changes in practice. Most point scores omit this parameter uncertainty and may look more precise than the evidence supports. When individual decisions are consequential, show clinically meaningful risk bands and explain the validation population and horizon; avoid displaying excessive decimal places.

Distinguish risk from recommendation. A 20% predicted risk does not determine whether to treat unless the benefits, harms, alternatives, and patient preferences are considered. Communicate which action the model supports, what evidence supports that action, and when clinical review overrides the score. The reporting-and-interpreting-results article discusses clear communication of uncertainty; decision-curve analysis provides a formal framework for comparing thresholds.

The Brier score, mean squared error of predicted probabilities, combines calibration and discrimination into one proper scoring rule: for binary outcome (Y_i) and predicted risk (p_i), it is (n^{-1}\sum_i(p_i-Y_i)^2), with lower values better. It depends on outcome prevalence, so compare it with a reference prediction such as the event rate and avoid ranking models across populations without context. No single summary replaces a calibration plot and decision-relevant operating characteristics.

## Pitfalls that change the meaning of a score

Do not interpret a model coefficient as a causal effect or use feature importance as evidence that changing the feature changes risk. Do not report only AUC: threshold-specific sensitivity, predictive values, calibration and clinical utility are needed. Do not select a threshold by maximizing the Youden index unless equal costs and priorities are plausible. Do not evaluate on data used to select features or tune parameters. A very precise performance estimate from a large number of encounters may still be misleading if patients or hospitals are not independent.

Fairness assessment requires more than comparing one metric across demographic groups. Compare calibration, error rates and access to downstream care, accounting for sample size and differences in outcome ascertainment. Group metrics can conflict, especially with differing event prevalence. Document intended use, prohibited uses, versioning, data-quality checks, and a route for review when predictions are implausible.

Validation size should be planned from the precision needed for calibration and discrimination, not simply as a fixed percentage of development size. Few outcome events yield unstable calibration slopes and wide intervals for sensitivity at clinically important thresholds. Report confidence intervals, preferably with resampling at the independent patient or site level, and be cautious when a point estimate appears favorable but its interval spans clinically unacceptable performance.

## References and further reading

- Steyerberg EW. *Clinical Prediction Models*. 2nd ed. Springer; 2019.
- Collins GS, Reitsma JB, Altman DG, Moons KGM. Transparent reporting of a multivariable prediction model for individual prognosis or diagnosis (TRIPOD). *Ann Intern Med*. 2015;162:55–63. [doi:10.7326/M14-0697](https://doi.org/10.7326/M14-0697)
- Van Calster B, McLernon DJ, van Smeden M, Wynants L, Steyerberg EW. Calibration: the Achilles heel of predictive analytics. *BMC Medicine*. 2019;17:230. [doi:10.1186/s12916-019-1466-7](https://doi.org/10.1186/s12916-019-1466-7)
- Vickers AJ, Elkin EB. Decision curve analysis: a novel method for evaluating prediction models. *Med Decis Making*. 2006;26:565–574. [doi:10.1177/0272989X06295361](https://doi.org/10.1177/0272989X06295361)
- Riley RD, Ensor J, Snell KIE, et al. Calculating the sample size required for developing a clinical prediction model. *BMJ*. 2020;368:m441. [doi:10.1136/bmj.m441](https://doi.org/10.1136/bmj.m441)
