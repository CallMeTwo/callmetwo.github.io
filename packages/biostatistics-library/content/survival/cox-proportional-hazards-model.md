---
title: Cox proportional hazards model
summary: Model covariate associations with time-to-event outcomes using partial likelihood, assess proportional hazards, and report interpretable absolute risks alongside hazard ratios.
---

## Overview

The Cox model relates the hazard at time (t) to predictors through (h(t\mid x)=h_0(t)\exp(x^T\beta)). The baseline hazard (h_0(t)) is unspecified, while coefficients describe multiplicative differences in hazard. For a one-unit increase in (x_k), the hazard ratio is (e^{\beta_k}), conditional on other model variables and under proportional hazards.

The model is semiparametric: it avoids specifying the baseline event-time distribution, yet estimates relative effects through partial likelihood. Its flexibility does not make its assumptions automatic. The key proportional-hazards condition says a covariate's hazard ratio is constant over time. Continuous predictor form, independent censoring, correct time origin, and adequate information also matter.

## What partial likelihood uses

At each event time, the Cox partial likelihood compares the covariate values for the person with the event against values among everyone still at risk. A participant contributes to risk sets until event or censoring. The likelihood conditions on one event occurring at that time and cancels the unknown baseline hazard. Thus coefficient estimates depend on ordering and risk sets, not an assumed baseline survival shape.

The partial likelihood for a single event at time (t_j) contributes approximately \(\exp(x_j^T\beta)/\sum_{i\in R(t_j)}\exp(x_i^T\beta)\), where (R(t_j)) is the risk set. With tied event times, Breslow or Efron approximations handle multiple events; Efron often performs better when ties are common. The tie method should be recorded, especially for time measured in days or months.

For a cohort of 850 patients with 310 deaths, a model with age and comorbidity may estimate age HR 1.06 per year and comorbidity HR 1.42 per point. A 10-year age difference and 2-point comorbidity difference imply conditional HR (1.06^{10}\times1.42^2\approx3.6), if log-linearity and proportional hazards hold for both. This is a relative hazard contrast, not a 3.6-fold probability of death.

```r
library(survival)
fit <- coxph(Surv(time_days, death) ~ age + comorbidity + treatment,
             data = cohort, ties = "efron", x = TRUE)
summary(fit)
```

The event indicator must identify the event of interest, censoring must be adequately independent conditional on modeled information, and each person's time origin must align with eligibility. If delayed entry occurs, use `Surv(entry, exit, event)`. Time-varying covariates require start-stop format and careful temporal ordering.

## Interpreting coefficients and intervals

For coefficient estimate \(\hat\beta=0.20\), the hazard ratio is (e^{0.20}=1.22), or an estimated 22% higher instantaneous hazard per unit increase, conditional on other predictors. A 95% interval for \(\beta\) of 0.05 to 0.35 transforms to HR 1.05 to 1.42. State the predictor scale; “per unit” is meaningless unless the unit is clear. Center or rescale continuous predictors for readability without changing fitted predictions.

Hazard ratios are conditional on the covariates and risk-set composition. They are not risk ratios or odds ratios. Because hazard is defined among those still event-free, changing who remains in the risk set over time can affect interpretation. An HR of 0.70 does not mean 30% fewer people experience the event by five years. Report survival probabilities, cumulative incidence, or RMST differences for absolute impact.

Adjusted HRs may differ from crude HRs because of confounding, but also due to noncollapsibility and changing risk sets. In observational studies, adjustment only supports causal interpretation if confounders are appropriately measured and modeled, positivity holds, and selection/censoring assumptions are credible. The Cox model itself does not create causal identification.

## Check functional form and proportionality

For a continuous predictor, the usual linear term assumes a straight-line relationship with log hazard. Assess martingale residuals or use restricted cubic splines. Categorizing a continuous variable at an arbitrary cut point loses information, creates a discontinuity, and can exaggerate apparent subgroup differences. If nonlinear, present predicted effects or contrasts at clinically meaningful values.

Proportional hazards can be examined using scaled Schoenfeld residuals. Under PH, residuals should show no systematic time trend. A formal test may detect small departures in large samples or miss important deviations in small ones, so inspect plots and clinical patterns. Test each key covariate and global behavior; do not use a p-value alone as a pass/fail rule.

```r
zph <- cox.zph(fit)
print(zph)
plot(zph)
```

If PH fails, options include stratifying on a categorical nuisance variable, adding a time-by-covariate interaction, or using a flexible parametric survival model. Stratification permits a separate baseline hazard but does not estimate the stratification variable's coefficient. Time-varying effects require careful choice of function of time and a clear summary, such as HR at 6 and 12 months. If effects cross, an RMST contrast may be more interpretable.

### A simple Schoenfeld-residual pattern

Suppose the treatment Schoenfeld residual smooth declines over time. This may indicate a treatment HR that begins near 0.55 and approaches 1, rather than a constant HR of 0.70. The global PH test might be significant, but the substantive issue is the shape and size of the time variation. Plot the residual with a smooth and confidence band; consider clinically motivated time intervals or a spline interaction, then report time-specific contrasts with intervals. Do not simply add an arbitrary interaction until the diagnostic p-value becomes nonsignificant.

The PH assumption concerns relative hazards, not whether baseline hazard itself changes. A hazard that rises sharply for everyone over time can still satisfy PH if group hazard ratios remain constant. Conversely, parallel survival curves are not required. The log-minus-log survival plot is a rough diagnostic for categorical covariates; residual-based checks are more general but still need judgment.

## Model the predictor scale deliberately

The log-linear assumption means a one-unit increase in a continuous predictor multiplies the hazard by the same factor at all values. If age effect is nonlinear, a single HR per year can misrepresent risk. Restricted cubic splines allow a smooth curve while preserving a continuous predictor. Choose knots before outcome-driven exploration, often based on predictor quantiles and sample size, and display predicted relative hazards or survival at representative values.

For a binary exposure, the HR compares the coded group with the reference group. For a multi-category factor, report each level relative to a meaningful reference and clarify whether an overall Wald or likelihood-ratio test assessed the factor. For an interaction, a coefficient alone is not the subgroup effect; calculate the linear contrast including covariance between main and interaction terms. Report uncertainty for each clinically relevant contrast.

Centering continuous predictors changes the interpretation of the baseline hazard and intercept-like quantities but not fitted relative effects. Scaling age by 10 years yields an HR per decade that is easier to interpret. Centering at a clinically meaningful value also stabilizes interaction interpretation. Report transformation choices and back-transformed quantities.

## Absolute survival prediction

The Cox coefficient model alone gives relative effects; absolute survival predictions also require estimating the baseline cumulative hazard, commonly with Breslow's estimator. For covariates (x), estimated survival is approximately \(\widehat S(t\mid x)=\widehat S_0(t)^{\exp(x^T\hat\beta)}\). The baseline survival corresponds to the reference covariate pattern and needs uncertainty. Individual predicted curves should not be treated as exact probabilities without validation.

For population-level contrasts, standardize predicted survival over a target covariate distribution: predict each person under each treatment strategy and average. This produces marginal survival curves, distinct from conditional HRs. In causal settings, standardization additionally depends on exchangeability, consistency, and positivity. In prediction settings, assess calibration at clinically relevant horizons.

The Cox model is often introduced as a regression tool, but predicting absolute risk requires more than exponentiating coefficients. The baseline cumulative hazard is estimated from observed event times and depends on the study's risk sets. If a patient's covariate pattern lies far outside the development data, the conditional estimate is extrapolation. Validate calibration-in-the-large and calibration slope in new data, and assess discrimination separately.

To compare treatments marginally, calculate (\widehat S(t\mid A=a,X_i)) under each strategy (a) for every target-population participant (i), then average over (i). The difference in these averages gives standardized survival contrast. Bootstrap the whole pipeline, including baseline hazard estimation and any model selection, for uncertainty. A conditional HR and marginal survival difference can tell complementary stories, especially when covariate effects are strong.

## Diagnostics and model stability

Check Schoenfeld residuals for PH, martingale residuals for continuous functional form, deviance residuals for unusual observations, and dfbeta or score residuals for influence. Inspect sparse risk sets, separation, convergence warnings, and event counts relative to model complexity. The familiar “10 events per variable” rule is not a guarantee; each parameter, spline, and interaction consumes information, and shrinkage or sample-size planning may be needed.

Check missingness, influential clusters, and dependent censoring. Robust sandwich standard errors can address some within-cluster dependence when there are enough independent clusters, but they do not repair confounding or misspecified functional form. If few clusters exist, use suitable small-sample methods. For weighted Cox models, inspect weight distribution and effective sample size.

The event-to-parameter ratio is only a rough warning. Sparse events in one exposure category, high collinearity, or rare factor levels can destabilize estimates even when total events seem adequate. Penalized partial likelihood can reduce small-sample bias, particularly under separation, but changes the estimator and needs transparent reporting. Bootstrap optimism correction or external validation is more informative than citing a single rule of thumb.

Influence diagnostics identify observations with unusual impact on coefficients. A case with a rare predictor pattern and event time may strongly affect partial likelihood. Investigate data accuracy first; do not remove a valid case merely because it changes the estimate. Report sensitivity with and without influential observations only when scientifically justified, and keep the primary analysis aligned with the target population.

Functional-form checks and PH diagnostics are multiple opportunities to detect anomalies. Treat them as model criticism, not a series of hypothesis tests from which the most favorable model is selected. If an assumption fails, explain the alternative model and the changed estimand. Report the original prespecified model as well when the change was data-driven.

## Worked analysis interpretation

Suppose treatment coefficient is −0.36, HR 0.70 (95% CI 0.52 to 0.94), with PH diagnostics showing no strong systematic trend. Under the model, treatment is associated with an estimated 30% lower instantaneous hazard over follow-up, conditional on included covariates. If one-year control survival is 0.80, the treated survival is not automatically 0.86; estimate baseline survival and derive predicted curves. Report absolute differences and intervals at meaningful times.

If residual diagnostics show treatment effect wanes over time, the HR 0.70 is at best a weighted summary and may hide a time pattern. Report time-varying estimates or RMST instead. If the study is observational, include the confounding strategy and limitations. A model fit does not prove the treatment caused the hazard reduction.

## Special survival structures

Delayed entry uses counting-process data to include people only after they enter observation. Time-dependent covariates use start-stop intervals; ensure each value was known before the interval's event time to avoid immortal-time or reverse-causation bias. Recurrent events need methods that account for within-person dependence and a defined event process. Competing risks require choosing between cause-specific hazards and subdistribution models for different questions.

For stratified Cox models, each stratum gets a distinct baseline hazard but shares coefficients. This can control a nuisance variable's nonproportional effect without estimating it. Interactions allow effect modification but should be prespecified and interpreted on the hazard scale. Testing many interactions after inspection inflates false discovery and makes subgroup estimates unstable.

## Worked contrast with an interaction

Suppose treatment coefficient is −0.36 and treatment-by-age (age centered at 60, in decades) is 0.08. At age 60, the treatment HR is (e^{-0.36}=0.70). At age 70, the log-HR is −0.36+0.08=−0.28, giving HR 0.76. The interaction suggests a weaker relative treatment association among older participants, but to assess uncertainty at age 70 compute the variance of the sum: (Var(\hat\beta_T+\hat\beta_I)=Var(\hat\beta_T)+Var(\hat\beta_I)+2Cov(\hat\beta_T,\hat\beta_I)). Combining separate confidence intervals or subgroup p-values is incorrect.

Age modification on the hazard-ratio scale does not imply the same modification on the absolute-risk scale. Baseline mortality may rise with age, so the absolute risk difference can be larger in older patients even if the relative HR is closer to 1. Present standardized survival or risk contrasts if clinical decisions depend on absolute benefit.

## Causal interpretation and covariate choice

In randomized trials, baseline covariate adjustment can improve precision, but post-randomization variables require care. Adjusting for a mediator or a variable affected by treatment can change the estimand or induce collider bias. For observational studies, define the causal contrast and confounder set using subject-matter knowledge. Do not adjust for every available variable or use automated selection based on outcome p-values.

Time-varying confounders affected by prior treatment create a more difficult problem. A standard time-dependent Cox model can be biased when adjusting for such covariates because it conditions on variables influenced by prior treatment. Marginal structural models with inverse-probability weights may be needed for a sustained treatment strategy, under sequential exchangeability and positivity. Clearly distinguish these causal assumptions from the Cox model's statistical assumptions.

Immortal-time bias can arise when treatment is defined by future receipt. Starting time at diagnosis and labeling eventual recipients as treated gives them guaranteed event-free time before treatment. Define a common time zero and assignment strategy, use time-varying exposure appropriately, or emulate a target trial. A Cox model with many covariates cannot repair a time-origin error.

## Reporting a Cox analysis

Report event count, censoring pattern, follow-up, model covariates, coding and transformations, tie method, missing-data handling, and PH assessment. Give HRs with confidence intervals and units or contrasts. For clinical relevance, show absolute survival or cumulative incidence at chosen times, or RMST differences. Describe how baseline hazard was estimated for prediction and how prediction calibration was evaluated.

If PH is violated, do not report one HR as though it applied throughout follow-up. Present the time-varying pattern or alternative estimand, explain how the time function was chosen, and show uncertainty. If proportionality diagnostics were prespecified but no departure was detected, avoid claiming the assumption was proven; diagnostics may have limited power. State any model changes after examining data.

For an observational study, describe confounding control and make clear whether estimates are associational or causal. For a randomized trial, report the randomized assignment contrast and sensitivity analyses for missing outcomes or censoring. An adjusted conditional HR is not equivalent to a marginal population effect, so name the target explicitly.

For a nonlinear predictor or interaction, provide a plot of adjusted relative hazards or standardized survival across meaningful values, with uncertainty bands. A table of coefficients alone can obscure nonlinear shape and make interactions difficult to understand. Ensure the plot is restricted to the observed support; curves at covariate combinations absent from the data are extrapolations.

For an individual clinical estimate, show absolute survival at a stated horizon and describe the cohort used to estimate baseline risk. A relative hazard coefficient alone is not an individualized prognosis.

If absolute survival depends on competing death, estimate cumulative incidence rather than applying the cause-specific Cox model as if competing events were independent censoring.

Report the chosen time horizon and event definition beside all absolute predictions.

Also report the reference covariate pattern used to define baseline survival.

Include follow-up horizon and units in tables.

An HR is a summary over a risk set that changes with time and covariate history. Even under a true causal effect, the HR can be noncollapsible and depend on who remains event-free. It should not be interpreted as a biological mechanism without additional assumptions. Report it as a model-based relative hazard contrast and pair it with an absolute measure for decision-making.

If sample size is modest, simplify the model based on prior knowledge and combine categories only when clinically defensible. Penalization can improve stability but does not justify complex post hoc subgroup discovery. Include confidence intervals that reflect clustering or weighting used in the design.

## Time-dependent covariates and effects

A time-dependent covariate changes during follow-up and must be represented with start-stop intervals so each value applies only while observed. A time-varying effect means the coefficient itself changes with time. These concepts are distinct: a patient's biomarker can vary over time while its association with hazard remains proportional, or a baseline treatment effect can vary with time.

```r
fit_tv <- coxph(Surv(start, stop, event) ~ treatment + biomarker,
                data = long_dat, id = patient_id, ties = "efron")
```

Ensure the biomarker was measured before the interval's event and is not updated using information after the event. A time-dependent covariate affected by prior treatment can induce bias in causal analyses; use longitudinal causal methods when appropriate. Report how intervals were constructed and how tied events were handled.

## References and further reading

- Cox DR. Regression models and life-tables. *JRSS B*. 1972;34:187–220. [doi:10.1111/j.2517-6161.1972.tb00899.x](https://doi.org/10.1111/j.2517-6161.1972.tb00899.x)
- Schoenfeld D. Partial residuals for the proportional hazards regression model. *Biometrika*. 1982;69:239–241. [doi:10.1093/biomet/69.1.239](https://doi.org/10.1093/biomet/69.1.239)
- Therneau TM, Grambsch PM. *Modeling Survival Data: Extending the Cox Model*. Springer; 2000.
- Royston P, Parmar MKB. Flexible parametric proportional-hazards and proportional-odds models for censored survival data. *Statistics in Medicine*. 2002;21:2175–2197. [doi:10.1002/sim.1203](https://doi.org/10.1002/sim.1203)
- The [censoring and survival functions article](censoring-and-survival-functions.html) reviews hazard and survival function distinctions.
