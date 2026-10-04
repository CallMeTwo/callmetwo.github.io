---
title: Logistic regression
summary: Model binary outcomes through log odds, estimate conditional associations, check calibration and functional form, and translate coefficients into absolute risks.
---

## Overview

Logistic regression models the probability of a binary outcome as a function of predictors. It is commonly used for disease status, treatment response, readmission, and adverse events. The model uses the logit link so fitted probabilities remain between zero and one, while coefficients describe changes in log odds conditional on other included predictors.

The model estimates association, not causation by default. Its interpretation depends on the target population, predictor timing, confounder control, outcome definition, and functional form. For prediction, calibration and validation matter as much as discrimination. For causal analysis, odds ratios are often less directly useful than marginal risks and risk differences.

## From probability to odds and log odds

For event probability (p), odds are (p/(1-p)), and log odds are \(\log[p/(1-p)]\). Logistic regression specifies \(\logit(p_i)=\beta_0+\beta_1x_{i1}+\cdots+\beta_kx_{ik}\). A one-unit increase in (x_j) multiplies the odds by \(e^{\beta_j}\), holding other model variables fixed. This is a conditional odds ratio, not generally a risk ratio.

Suppose a fitted model gives treatment coefficient −0.40. Then conditional OR is \(e^{-0.40}=0.67\), or 33% lower odds in the treated group at the same values of included covariates. If control risk is 20%, applying OR 0.67 gives treated odds (0.67\times0.20/0.80=0.1675), or risk (0.1675/(1+0.1675)=0.144), about 14.4%. This is a 5.6 percentage-point risk difference in that setting, not a 33% risk reduction.

```r
fit <- glm(event ~ treatment + age + severity,
           data = dat, family = binomial())
exp(coef(fit))                 # conditional odds ratios
predict(fit, type = "response") # fitted probabilities
```

Reference categories and factor coding determine coefficient meaning. For a categorical predictor, report the reference group. For a continuous predictor, “per one unit” must be clinically interpretable; rescale age per 10 years or biomarker per standard deviation only when useful and clearly state it.

## Estimation and interpretation

Maximum likelihood estimates coefficients by choosing values that make observed binary outcomes most likely under the model. Standard errors arise from the information matrix or robust variance estimators. Wald intervals are convenient, but profile-likelihood or penalized intervals can be more reliable with sparse data. A coefficient p-value tests a conditional null given the model; it does not quantify clinical importance or establish an independent causal effect.

Odds ratios are noncollapsible: adjusted and unadjusted ORs can differ even when the added covariate is not a confounder, because conditional and marginal odds are different summaries. Therefore, a change in OR after adjustment does not by itself measure confounding. To obtain population-average risks, predict under each exposure for everyone in a target population, then average. This standardization produces marginal risks and contrasts.

For a clinical trial, report event risks by randomized group, risk difference or ratio, and an adjusted analysis if prespecified. For a case-control study, the sample's case fraction is set by design, so the intercept and predicted absolute risks are not population risks without external prevalence information. Under appropriate sampling, odds-ratio slopes can still estimate exposure-disease association.

## Worked example: readmission risk

Suppose 100 of 500 patients are readmitted within 30 days. A model includes treatment, age per 10 years, and prior admission. Estimated treatment coefficient is −0.35 (SE 0.16), giving OR 0.70 with approximate 95% CI \(\exp[-0.35\pm1.96(0.16)] = (0.51,0.96)\). This is compatible with lower conditional odds among treated patients, given included variables. If predicted control risk for a representative profile is 0.20, an OR of 0.70 corresponds to treated risk about 0.149, a 5.1-point absolute difference.

That profile-specific conversion is not a population effect. Compute average standardized risks over the study population to get marginal contrasts. If treatment selection was observational, the causal interpretation further requires measured confounding control, positivity, consistency, and correct model specification. Include unmeasured confounding sensitivity when consequential.

### Standardizing predictions over a target population

Suppose a cohort of 1,000 eligible patients is used to estimate the effect of a discharge intervention. To estimate marginal risks, create two copies of the cohort, set intervention to 1 for everyone in one copy and 0 in the other, predict each person's probability, and average within copy. The difference in averages is the standardized risk difference. This preserves the observed distribution of age, severity, and other covariates and is usually easier to interpret than an adjusted conditional OR.

The result is causal only under assumptions: conditional exchangeability given measured covariates, positivity of both intervention options, consistency of treatment definitions, and adequate model specification. If some high-severity patients always receive the intervention, predictions under no intervention for them extrapolate beyond data support. Inspect overlap and limit the target population if needed.

Uncertainty should include estimation of the regression coefficients and standardization. A nonparametric bootstrap can resample participants, refit the model, and repeat predictions. If data are clustered, resample clusters. Report the target population, average predicted risks, risk difference, interval, and sensitivity to model form.

## Functional form and interactions

The standard model assumes each continuous predictor is linear on the log-odds scale. This is not the same as a linear probability relationship. Use restricted cubic splines or fractional polynomials when nonlinearity is plausible; inspect partial residuals and predicted risk curves. Categorizing a continuous variable at the sample median loses information and creates an artificial jump. If nonlinear terms are used, present predicted probabilities across clinically meaningful values rather than individual spline coefficients.

An interaction means the association of one predictor varies by another on the model's log-odds scale. A treatment-by-age coefficient tests modification of the conditional log OR, not necessarily absolute risk difference. Even with no logit-scale interaction, risk differences may vary as baseline risk changes. Calculate contrasts on the scale relevant to decisions and show uncertainty.

Suppose treatment coefficient is −0.50 and treatment-by-age-per-decade coefficient is 0.20, with age centered at 60. At age 60, OR is (e^{-0.50}=0.61); at age 70, OR is (e^{-0.30}=0.74). The confidence interval for the age-70 contrast requires the covariance of both estimates. Report model-based contrasts and interaction interval rather than comparing p-values within age strata. Also plot standardized absolute risks by age to show whether the clinical effect changes on a decision scale.

Interactions are scale-specific. No interaction on the odds-ratio scale does not imply no interaction on risk difference or risk ratio scale. Prespecify effect modifiers based on biology or clinical use, limit the number examined, and label exploratory subgroup analyses. Small subgroups have wide intervals even when the overall sample seems large.

## Assumptions and diagnostics

Observations should be independent conditional on the model, unless dependence is handled with cluster-robust standard errors, GEE, or random effects. The logit mean model should be adequately specified, predictors measured appropriately, and influential observations investigated. Outcome classification should be consistent. Standard logistic regression assumes a linear predictor but does not require normally distributed predictors or residuals.

Assess calibration with plots, calibration intercept and slope, and Brier score. Discrimination can be summarized with ROC AUC, but high AUC does not establish calibrated risk. Check separation, influential observations, multicollinearity, sparse categories, and model convergence. Calibration and predictive performance should be assessed in data not used to develop or tune the model.

Complete separation occurs when a predictor perfectly predicts outcome, driving maximum-likelihood coefficients toward infinity. Firth penalized logistic regression or weakly informative Bayesian priors can provide finite estimates. Penalization changes estimation and intervals; report the method. Do not solve separation by silently collapsing categories without scientific justification.

### Separation and sparse data

Suppose no untreated patients with a rare genotype experience an event, while several treated patients do. Maximum likelihood can assign an extremely large genotype coefficient because increasing it keeps improving the likelihood. Standard errors become huge and Wald intervals nonsensical. Firth's bias-reduced likelihood adds a penalty that yields finite estimates and often improves small-sample behavior. Exact logistic regression is another option for very small datasets but can be computationally demanding and conditions on sufficient statistics.

Sparse-data bias can occur even without complete separation, particularly for rare exposures and outcomes. Penalized estimation or informative priors can stabilize estimates, but the prior or penalty should be justified and sensitivity reported. A large coefficient from a handful of events is not strong evidence of a large effect; show cell counts and interval width.

### Calibration and validation

Calibration asks whether predicted probabilities match observed frequencies. Calibration-in-the-large evaluates systematic over- or underprediction; calibration slope assesses overly extreme predictions. A slope below 1 often indicates overfitting. A smooth calibration curve with uncertainty bands is more informative than a Hosmer–Lemeshow test, whose result depends on arbitrary grouping and sample size. The Brier score averages squared probability error but depends on prevalence; compare to a simple reference model.

Discrimination describes ranking. AUC 0.80 means a randomly selected event tends to receive a higher score than a randomly selected non-event 80% of the time, with ties handled appropriately. It does not say risks are accurate or decisions improve. Report threshold performance and utility if a score triggers action. A model may have an unchanged AUC while calibration degrades in a new hospital.

Internal validation by bootstrap or cross-validation estimates optimism. All steps must be repeated within each resample or fold, including imputation, variable selection, nonlinear-term selection, and tuning. For external validation, freeze the model and apply it in new data; if coefficients are refit, report it as model updating and validate the updated model separately. Temporal validation is particularly important when practice and prevalence change.

## Sample size, overfitting, and prediction

The number of events and non-events, candidate parameters, predictor distributions, and expected signal determine model stability. A fixed events-per-variable rule is not sufficient. Many candidate transformations and interactions increase effective model complexity. Penalization or shrinkage can help, but internal validation should repeat all feature selection and tuning within resampling.

For prediction, split or resample at the independent patient or site level. Randomly splitting repeated records from the same patient leaks information. Use temporal or external validation to assess transport. Report calibration and discrimination with uncertainty, threshold-specific sensitivity and predictive values, and decision utility when the model guides care.

The development sample should be sized to limit overfitting and estimate absolute risks with adequate precision. Required sample size depends on event fraction, number of candidate parameters, anticipated model fit, and desired shrinkage. A rule such as 10 events per predictor is not a guarantee: spline terms, categories, interactions, and data-driven selection each use multiple degrees of freedom. Prediction-model sample-size formulas can quantify shrinkage and optimism goals.

Do not use stepwise p-value selection as a default. It creates unstable coefficients, biased p-values, and optimistic apparent performance. Prespecify predictors based on clinical knowledge, use shrinkage when complexity is high, and validate the full modeling strategy. If feature selection is essential, nest it inside cross-validation.

Missing predictors need an operational plan. During development, multiple imputation may be appropriate, but the imputation model should not use information unavailable at deployment. At prediction time, specify how a missing value is handled, whether the model refuses to score, and whether a missingness indicator is used. Changes in measurement practice can shift both predictor distribution and calibration.

## Common misinterpretations

An OR of 2 is not necessarily twice the risk, especially when the outcome is common. “Adjusted for age and sex” does not mean all confounding is removed. Statistical significance does not mean useful prediction; a clinically important association does not guarantee an individual-level classifier. Do not interpret prediction coefficients causally, and do not use a model's fitted probabilities outside the population and horizon where they were validated.

If events are rare, OR may approximate risk ratio, but this is a context-dependent approximation. When presenting risk, give absolute baseline risk and time horizon. For treatment effects, include risk difference or NNT only with uncertainty and an explicit population. For prognostic models, report what information was available at prediction time and how missing predictors are handled in practice.

## Dependence and clustered outcomes

Ordinary logistic regression assumes independent outcomes conditional on predictors. Patients within hospitals, families, or matched sets may share unmeasured factors. Ignoring this dependence can underestimate standard errors. Use cluster-robust variance when there are enough independent clusters, GEE for marginal associations, or a mixed-effects logistic model for cluster-specific effects. The choice changes interpretation, especially for odds ratios.

For a cluster-randomized trial with 15 clinics, robust sandwich inference may be unreliable because the cluster count is small. Small-sample corrections, randomization inference at clinic level, or a carefully specified hierarchical model may be preferable. A large number of patients within a few clinics does not create many independent treatment assignments.

## Confounding and causal contrasts

In observational studies, covariate adjustment should reflect a causal structure. Adjust for common causes of treatment and outcome, not every measured variable. Conditioning on a mediator changes a total effect to a direct-effect-like contrast; conditioning on a collider can induce association. Logistic regression does not reveal which variables are confounders by their p-values.

Positivity requires overlap: each covariate profile in the target population has a nonzero probability of each exposure strategy. Inspect propensity-score overlap and covariate balance. If treated and untreated groups do not overlap, regression extrapolates and standard errors may understate uncertainty. Restricting to an overlap population changes the estimand and should be reported.

For a randomized study, adjustment for prespecified baseline predictors can increase precision, but post-randomization covariates may bias the assignment effect. Define whether the target is intention-to-treat, per-protocol, or another estimand. Provide unadjusted group risks as descriptive context and model-adjusted contrasts with assumptions.

## Diagnostics in practice

Check fitted probabilities for values near 0 or 1, sparse cross-tabulations, variance inflation, influential residuals, and calibration. Examine observed versus predicted outcome by clinically meaningful subgroups and time. A global goodness-of-fit test can reject for minor deviations in large samples or fail to detect important local misfit in small samples. Graphical checks and external validation are more informative.

For a continuous predictor, compare linear logit form with a spline using a joint test and plotted predicted risks. Do not report spline basis coefficients as if each were a clinical effect. For a categorical predictor with many levels, inspect event counts by level and consider whether sparse categories require combination based on clinical logic. Avoid outcome-driven collapsing.

Robust standard errors address some variance misspecification but do not change coefficients or fix a wrong mean model. If clustered data are present, specify the cluster level. If repeated binary outcomes are longitudinal, use GEE or mixed models rather than treating each record as an independent logistic observation.

## A reporting template in prose

State the population, binary outcome and horizon, predictor timing, model formula, coding and reference categories, link, missing-data method, and variance estimator. Report coefficient-scale effects only with clear units, and translate odds ratios to risks when possible. Include calibration and discrimination for prediction, and effect estimates with intervals for association or treatment comparison. Document convergence, separation handling, diagnostics, validation sample, and model updates.

For transparency, show both the event counts and denominators by exposure group; adjusted ORs can otherwise obscure sparse data. Give absolute risks standardized to the target population when decisions depend on risk. For case-control studies, note that absolute risk cannot be estimated from the sampled case fraction without external information.

For a single prediction threshold, report the number flagged, sensitivity, specificity, positive and negative predictive values, and consequences of false decisions. Predictive values change with prevalence across settings. Decision-curve analysis can compare model-guided action with treat-all and treat-none strategies over clinically plausible thresholds, but it relies on explicit utility assumptions and does not prove implementation benefit.

If a model will be deployed, monitor calibration and data quality after implementation. Changes in test availability, coding, or clinical workflow can alter predictor distributions and event rates. Recalibration may restore average risk accuracy, but any updated model requires evaluation in data independent of the update process.

## Interpreting evidence without a binary label

An interval crossing OR 1 does not prove no association; it shows the estimate is compatible with a range of effects under the model. Compare that range with clinically meaningful thresholds. Likewise, a small p-value can accompany a negligible OR change in a large sample. Emphasize estimate, interval, and absolute consequences rather than classifying results as positive or negative.

## References and further reading
For model transport, document changes in outcome prevalence and predictor measurement because both can affect calibration.

Before implementation, specify who receives a prediction, when it is generated, what threshold triggers action, and how missing predictors are handled. Retrospective validation does not cover workflow failures.

- Hosmer DW, Lemeshow S, Sturdivant RX. *Applied Logistic Regression*. 3rd ed. Wiley; 2013.
- Harrell FE. *Regression Modeling Strategies*. 2nd ed. Springer; 2015.
- Greenland S, Robins JM, Pearl J. Confounding and collapsibility in causal inference. *Statistical Science*. 1999;14:29–46. [doi:10.1214/ss/1009211805](https://doi.org/10.1214/ss/1009211805)
- Steyerberg EW. *Clinical Prediction Models*. 2nd ed. Springer; 2019.
- The [model validation article](model-validation-and-overfitting.html) covers optimism correction and external validation.
