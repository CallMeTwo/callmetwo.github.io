---
title: Clinical event prediction
summary: Develop and evaluate models that estimate an individual's probability of a diagnostic or future clinical event for a defined population and time horizon.
---

## Overview and key ideas

A **clinical prediction model** combines patient characteristics, symptoms, tests, or other predictors to estimate an individual's probability of an outcome. A diagnostic model estimates whether a condition is present at a defined time; a prognostic model estimates a future event. A prognostic prediction needs a clear time horizon, such as 30-day readmission or 5-year cardiovascular disease. A score without an outcome definition, prediction time, and horizon is not an interpretable risk estimate.

Prediction and causal explanation are different goals. A noncausal proxy may improve forecasts; a causal risk factor may add little predictive information. The model's value depends on whether accurate estimates change decisions and improve outcomes in the target workflow. Discrimination, calibration, and decision usefulness must therefore be assessed separately.

The estimand is usually a conditional risk `P(Y=1 | X=x)` at a specified time, in a defined target population. For a survival outcome it may be `P(T≤τ | X=x)`; where a competing event prevents the outcome, use the cumulative incidence `P(T≤τ, cause=k | X=x)`. This is not the same as a cause-specific hazard or a risk estimated by censoring competing deaths as if they were ordinary losses.

## When to use it

Use prediction when a defined decision at a defined point in care can be supported by an individualized estimate: offer confirmatory testing, arrange preventive treatment, prioritize follow-up, or communicate prognosis. Specify target population, setting, predictors available at decision time, outcome, prediction horizon, and intended action before model development. If no action could change based on the estimate, a prediction tool may add cost without benefit.

## Development and validation

### Cohort and predictors

Define eligibility, time zero, follow-up, outcome adjudication, and predictor measurement windows. Prevent **information leakage**: predictors must be available at the moment the prediction is meant to be used. A discharge code added after readmission, or a lab obtained after clinical deterioration, cannot be used for an earlier decision. Repeated patient records need person-level data splits or resampling so the same patient does not appear in training and validation partitions.

Choose candidate predictors using clinical knowledge and data availability rather than univariable p-value screening. Continuous variables usually contain information that is lost by arbitrary categorization; represent nonlinear relationships with restricted cubic splines or another prespecified flexible function. Missingness may itself carry information, but missing indicators alone do not generally solve bias. Multiple imputation should respect the outcome and validation structure; imputation, scaling, feature selection, and tuning all belong inside each resampling split.

For logistic regression, `logit(p_i)=β0+Σβ_jx_ij`. Penalization or shrinkage can stabilize estimates and reduce overfit. Machine learning methods can capture nonlinearities and interactions but still require representative data, probability calibration, internal validation, and careful comparison against simpler models. Increasing algorithm complexity does not compensate for small sample size, weak outcome measurement, or dataset shift.

### Sample size and overfitting

Prediction sample size should be planned around the number of candidate parameters, event fraction, anticipated model fit, and desired precision in overall risk and calibration. Rules such as a fixed events-per-variable threshold are inadequate for many modern models. Low event counts, extensive data-driven selection, and many degrees of freedom increase optimism. Shrinkage reduces coefficient magnitude and can improve out-of-sample performance; bootstrap validation estimates optimism by repeating the entire modeling process.

### Internal validation

Internal validation asks how the model is expected to perform in similar data from the same source population. Bootstrap resampling often uses data efficiently; cross-validation can work well when folds are formed at the right unit and all preprocessing is nested inside the training fold. A single random split discards development data and provides a noisy estimate, especially for small cohorts. Temporal validation is useful when future deployment is the target; geographic or institution-level splits assess transport across sites.

### External validation and updating

External validation evaluates a locked model in new data, time, or setting. Assess whether predictor definitions, outcome ascertainment, and target population match. Report calibration-in-the-large (systematic over/underprediction), calibration slope (spread of predictions too extreme or too narrow), calibration curve, discrimination, and clinical utility with confidence intervals. Recalibration of the intercept may correct baseline event frequency; intercept and slope updating can address systematic shrinkage. More extensive updating should be described as redevelopment and assessed on data independent of the update where possible.

## Performance and decision theory

### Discrimination

The ROC AUC or c-statistic is the probability that a randomly selected case receives a higher predicted score than a randomly selected noncase, with conventions for ties. It assesses ranking, not probability accuracy. AUC depends on case mix and can change even when model coefficients remain fixed. Precision-recall curves may be more informative for rare outcomes, but precision depends on prevalence. Report operating characteristics at prespecified, clinically relevant thresholds if actions use thresholds.

### Calibration

Calibration compares predicted and observed probabilities. Calibration-in-the-large near zero (on the logit scale) indicates average risk is correct; a calibration slope near one indicates appropriate spread. Calibration plots should use smooth methods and uncertainty bands when sample size permits; coarse risk groups can hide important miscalibration. Brier score, `mean((Y-p)^2)`, combines calibration and discrimination and depends on prevalence. For survival predictions, account for censoring with appropriate methods and evaluate calibration at specified horizons.

### Thresholds and net benefit

At a threshold probability `p_t`, decision-curve analysis commonly expresses net benefit as

`NB = TP/N − FP/N × [p_t/(1−p_t)]`.

The threshold encodes the relative harm of unnecessary action to benefit of correctly treating a case. Compare the model with strategies such as act on nobody or everybody across a range of plausible thresholds. Net benefit is not a direct measure of health gain; decision analysis assumes the threshold meaningfully represents preferences and treatment consequences. Impact studies evaluate whether use of the model actually changes decisions and outcomes.

## Worked example: readmission model with calculations and R

A hospital predicts unplanned 30-day readmission at discharge to prioritize follow-up calls. Define target population as adults discharged after heart-failure admission, prediction time as discharge, and outcome as readmission by day 30. Death before readmission is a competing event; investigators must decide whether they need risk of readmission before death, a composite of readmission or death, or another estimand. These choices lead to different labels and actions.

Suppose external validation yields c-statistic 0.72. This means a randomly selected readmitted patient tends to rank above a randomly selected non-readmitted patient in about 72% of case/noncase pairs, with ties conventionally handled. It does not mean 72% of predicted probabilities are correct. If mean predicted risk is 18% while observed risk is 12%, expected calibration error at the population level is 6 percentage points, and the model overpredicts on average. An intercept update may help if the slope and calibration curve are otherwise sound; subgroup and risk-range calibration still require examination.

At a 20% decision threshold, the false-positive weight is `0.20/(1−0.20)=0.25`. If among 1,000 patients there are 100 true positives and 200 false positives under the model, net benefit is `100/1000 − 200/1000×0.25 = 0.05`. This is equivalent to 50 net true-positive decisions per 1,000 under the specified threshold weighting. Compare it with treat-all and treat-none and with uncertainty. It is not proof the calls improve health; that requires impact evaluation.

Illustrative R code for binary outcomes:

```r
# y: observed 0/1 outcome; p: predicted risk from a locked model
brier <- mean((y - p)^2)
cal_intercept <- glm(y ~ 1, offset(qlogis(p)), family = binomial())
cal_slope <- glm(y ~ qlogis(p), family = binomial())
summary(cal_intercept)
coef(cal_slope) # ideal intercept 0, slope 1

threshold <- 0.20
act <- p >= threshold
tp <- sum(act & y == 1)
fp <- sum(act & y == 0)
nb <- tp / length(y) - fp / length(y) * threshold / (1 - threshold)
nb
```

Use a calibration plot rather than relying only on regression summaries. Predictions of exactly 0 or 1 need careful handling before `qlogis`. For development, this code must be run on out-of-sample predictions; evaluating fitted probabilities in the development data is optimistic. For censored or competing-risk outcomes, use survival or competing-risk calibration and decision methods, not the binary formulas unchanged.

## Assumptions and limitations

- **Outcome and horizon:** outcome definitions and follow-up must be consistent; competing risks change cumulative incidence.
- **Predictor timing:** every input must be known at the actual decision time. Avoid leakage and post-outcome proxies.
- **Representativeness:** calibration and utility may shift across institutions, calendar time, or patient groups because of prevalence, case mix, measurement, or treatment changes.
- **Overfitting:** high apparent performance in development data is expected when flexibility exceeds information. Validate the entire pipeline.
- **Missing data:** complete-case analysis can select a biased subset. Imputation and preprocessing must be performed without using validation information.
- **Uncertainty:** performance estimates, especially subgroup calibration and net benefit, can be imprecise. Report confidence intervals and event counts.
- **Decision context:** thresholds reflect action benefits and harms, resource constraints, and patient values. They are not universal constants.
- **Fairness and impact:** assess subgroup performance and downstream consequences. A model can be accurate yet amplify inequity or fail in workflow.

## Interpretation and common pitfalls

- Report absolute risk at a stated horizon, not only a score, rank, odds ratio, or “high-risk” label.
- Do not report AUC alone. Include calibration and decision relevance.
- Do not maximize sensitivity plus specificity unless that criterion reflects the real costs of errors.
- Do not use a random split as a substitute for external validation. Distinguish internal optimism correction from transportability evidence.
- Recalibration changes predictions; report original and updated performance separately and validate updates.
- Accuracy can be high in rare outcomes by predicting “no event” for everyone. Show prevalence, sensitivity, specificity, and predictive values at useful thresholds.
- Discrimination and calibration can vary across subgroups; report uncertainty and consider data quality and treatment access.
- A good prediction model does not demonstrate that using it improves outcomes. Plan an impact evaluation in the real decision pathway.

## Additional design issues

### Competing risks and censoring

For time-to-event prediction, Kaplan–Meier complements can overestimate the absolute incidence of a target event when competing events occur, because the method treats competing events as if those individuals could later experience the target event. Use cumulative incidence for the probability of a particular cause by time `τ`. A cause-specific hazard model and a subdistribution-hazard model parameterize different quantities; neither coefficient is itself the cumulative risk. Evaluate calibration directly for the target cumulative incidence at the decision horizon. If loss to follow-up is informative, standard methods require assumptions or weighting/modeling to address it.

### Updating and dataset shift

Calibration can deteriorate when event prevalence changes, even if ranking remains similar. A logistic intercept update changes average predicted risk while preserving ranking; intercept-plus-slope recalibration adjusts both average risk and extremity. If predictor-outcome relationships change, more extensive updating may be needed. Do not update and assess on the same small validation sample and then report the apparent improvement as independent validation. Maintain version control for model coefficients, preprocessing, and predictor definitions.

Dataset shift can concern covariate distributions, outcome prevalence, measurement processes, or the relationship between predictors and outcome. Monitoring after deployment should include calibration over time, missingness, subgroup performance, and the frequency of decisions. Outcome labels may be delayed or affected by the model's own actions: once high-risk patients receive effective care, observed event rates can fall. This feedback changes the data-generating process and complicates naive recalibration.

### Clinical impact and implementation

Decision-curve analysis is a model-based estimate of potential benefit under a threshold trade-off. An impact study tests the whole policy: whether clinicians see the estimate, whether they act, whether patients receive the intervention, and whether outcomes or harms change. A randomized implementation study may be appropriate when equipoise exists; stepped-wedge or cluster designs may fit system-level rollouts, subject to their own assumptions. Evaluate workload, equity, alert fatigue, treatment harms, and unintended substitution of clinical judgment.

Before deployment, specify who sees the estimate, when it appears, what action is recommended, how overrides are recorded, and what happens when predictors are unavailable. A model should not silently convert probability into a categorical label unless the threshold and action are justified. Communicate uncertainty and avoid implying that a risk score is a diagnosis or destiny.

### Reporting checklist for a prediction analysis

Report participant flow, outcome events, candidate predictors and measurement timing, missing-data handling, model-building steps, complete equations or executable code, internal and external validation, calibration and discrimination with uncertainty, subgroup performance, and decision analysis at clinically justified thresholds. State whether the model is new, updated, or validated and whether any validation data contributed to model selection. TRIPOD and PROBAST help structure transparent reporting and risk-of-bias assessment; adherence cannot compensate for a biased design, but omission of key details prevents appraisal.

## A practical workflow from question to deployment

1. **Write a target-use statement.** Name the population, prediction time, outcome, horizon, and action. A precise statement prevents model development from drifting toward whatever label is easiest to extract.
2. **Audit the data.** Check eligibility, follow-up, predictor timing, missingness, outcome adjudication, and representativeness across sites and groups. Define a data dictionary before fitting.
3. **Set the analysis plan.** Prespecify candidate predictors, functional forms, handling of missingness, validation design, and performance measures. Estimate sample size and uncertainty requirements.
4. **Develop and internally validate.** Use shrinkage and resampling that repeats all modeling steps. Compare against a clinically sensible baseline model and avoid reporting apparent development performance as expected performance.
5. **Validate externally.** Evaluate the locked equation in relevant data before updating. Examine calibration, discrimination, decision consequences, and subgroup performance with uncertainty.
6. **Assess impact and monitor.** Test the model in the intended workflow, measure uptake and outcomes, and monitor drift, missingness, harms, and equity after deployment.

The workflow should include a baseline clinical model. A new algorithm can increase AUC slightly without changing who receives care or improving net benefit. Conversely, a model with similar AUC can improve calibration or simplify workflow. Compare models on the decision that matters and report complexity, data burden, and failure modes, not just one summary statistic.

## Interpreting coefficients and individual estimates

In a logistic model, a coefficient exponentiates to a conditional odds ratio, not a risk ratio. When outcomes are common, odds ratios can substantially exceed risk ratios. Prediction communication should therefore use calibrated absolute probabilities rather than interpreting a coefficient as a patient's change in probability. Holding other predictors fixed may describe a mathematical contrast that is not clinically realizable, especially for correlated or derived features.

Risk estimates also have uncertainty from sampling and model specification. A deployed calculator often returns one number without displaying this uncertainty. For decisions near a threshold, small changes in model coefficients or input measurement can switch the recommendation. Report uncertainty in population-level performance and examine decision stability near thresholds. Avoid false precision such as displaying 12.347% risk when validation calibration supports only approximate estimates.

## What to do when validation is weak

If calibration is poor, first check whether predictors, outcome, time horizon, and data pipeline were implemented as intended. A shifted baseline event rate may justify intercept recalibration, while an incorrect slope suggests overfitting or broader relationship change. Calibration curves with wide intervals may indicate insufficient validation events rather than definite model failure. Avoid fitting a complex recalibration model to a small external dataset; report the uncertainty and collect more data if the decision is high stakes.

If discrimination is lower in a new setting, examine changes in case mix, predictor measurement, care pathways, and outcome ascertainment. Do not assume the AUC can be repaired by changing the threshold. A threshold changes classification decisions but cannot improve the ranking; model updating or a different clinical workflow may be needed. If the model performs poorly for a subgroup, withholding a validated benefit from that subgroup can also cause harm, so decisions should consider subgroup uncertainty, alternative models, and fairness implications rather than applying an automatic exclusion rule.

## Threshold selection in context

A threshold is a policy choice, not a property discovered from ROC coordinates. Estimate the likely benefit of acting among patients above the threshold and the harm or resource cost of acting among those who would not experience the outcome. Incorporate treatment effectiveness, adverse effects, patient preferences, and capacity limits. Thresholds may reasonably differ across settings if care resources or consequences differ, but any local choice should be evaluated and documented. If the intervention is low burden and effective, a lower threshold may be appropriate; if it carries substantial harm, a higher threshold may be warranted. Decision curves summarize one trade-off but do not replace this clinical and economic reasoning.

## Ethical use and communication

Risk estimates can influence access to care, insurance, or patient behavior. Document who benefits from model-assisted decisions, who bears false-positive and false-negative harms, and whether data represent underserved groups. Evaluate subgroup calibration and the consequences of threshold-based allocation. Explain the estimate in plain language, including outcome, horizon, uncertainty, and available action. Do not present group-level risk as an inevitable individual outcome or use a score outside its validated context without review.

## References and further reading

- Collins GS, Reitsma JB, Altman DG, Moons KGM. Transparent reporting of a multivariable prediction model for individual prognosis or diagnosis (TRIPOD): the TRIPOD statement. *BMJ*. 2015;350:g7594. [doi:10.1136/bmj.g7594](https://doi.org/10.1136/bmj.g7594).
- Moons KGM, Wolff RF, Riley RD, et al. PROBAST: a tool to assess risk of bias and applicability of prediction model studies. *Ann Intern Med*. 2019;170:51–58. [doi:10.7326/M18-1376](https://doi.org/10.7326/M18-1376).
- Vickers AJ, Elkin EB. Decision curve analysis: a novel method for evaluating prediction models. *Med Decis Making*. 2006;26:565–574. [doi:10.1177/0272989X06295361](https://doi.org/10.1177/0272989X06295361).
- Steyerberg EW. *Clinical Prediction Models*. 2nd ed. Springer; 2019. [doi:10.1007/978-3-030-16399-0](https://doi.org/10.1007/978-3-030-16399-0).
- Gerds TA, Andersen PK, Kattan MW. Calibration plots for risk prediction models in the presence of competing risks. *Stat Med*. 2014;33:3191–3203. [doi:10.1002/sim.6152](https://doi.org/10.1002/sim.6152).
- Riley RD, Ensor J, Snell KIE, et al. Calculating the sample size required for developing a clinical prediction model. *BMJ*. 2020;368:m441. [doi:10.1136/bmj.m441](https://doi.org/10.1136/bmj.m441).

*For prediction model reporting and machine-learning risk-of-bias assessment, see the official [TRIPOD statement](https://www.tripod-statement.org/) and [PROBAST resources](https://www.probast.org/).*
