---
title: Cox proportional hazards model
summary: The workhorse regression for time-to-event data, modelling how covariates change the hazard over time.
---

## Overview and key ideas

The **Cox proportional hazards (PH) model** relates the hazard at time t to
covariates: h(t|x) = h0(t) × exp(b1 x1 + b2 x2 + ...), where h0(t) is a
baseline hazard with unspecified shape and the b coefficients are estimated by
partial likelihood. The key property is **proportionality**: the ratio of
hazards between any two patients, the hazard ratio (HR), does not depend on
time. An HR of 1.8 means that patient's event rate is 1.8 times the other's
at every point during follow-up.

Because the baseline hazard is left unspecified, the model is semiparametric —
more flexible than parametric survival models, and the coefficient estimates
are driven by the ordering of event times rather than the absolute scale.
Cox models adjust simultaneously for multiple covariates, which is their main
advantage over the log-rank test: they answer "does this covariate matter,
holding the others constant?"

## When to use it

| Setting | Example question |
| --- | --- |
| Cohort study | Which baseline factors independently predict mortality after heart failure admission? |
| Trial analysis | Is the treatment effect on overall survival consistent after adjusting for age, stage, and comorbidity? |
| Prognostic research | Does tumour grade add information to stage in predicting recurrence? |

The Cox model is the standard for multivariable survival analysis, for
stratified analyses, and for checking whether an apparent treatment effect
dissolves once confounders are controlled.

## Assumptions and limitations

- **Proportional hazards**: HRs constant over time. Test with Schoenfeld
  residuals or by plotting log(−log S(t)) versus log(t) — parallel lines
  suggest proportionality. When violated, options include time-dependent
  covariates, stratification, or accelerated-failure-time models.
- **Linearity on the log-hazard scale**: continuous covariates enter
  multiplicatively via exp(b x); check with martingale residuals or flexible
  (fractional polynomial, spline) terms.
- **Independent censoring** as in all survival analysis.
- With many covariates and few events, estimates become unstable; a common
  rule of thumb is at least 10 events per covariate.
- The baseline hazard is not used to estimate coefficients, but it must be
  estimated (e.g. Breslow) before predicting individual survival curves.

## Worked example

In a cohort of 850 patients admitted with acute heart failure, 310 died within
2 years. A 2-covariate Cox model with age and Charlson comorbidity index gives:
age, HR 1.06 (95% CI 1.03 to 1.09) per year older; comorbidity index, HR 1.42
(95% CI 1.21 to 1.67) per one-point increase. A 70-year-old with comorbidity
index 5 versus a 60-year-old with index 3 has HR = 1.06^10 × 1.42^2 =
1.79 × 2.02 ≈ 3.6 — about 3.6 times the mortality hazard at every time point.
Interpretation: both factors are independently associated with 2-year
mortality; each additional comorbidity point raises the hazard 42%, and the
CI excludes 1 for both, so the association is statistically significant. The
CI width also shows precision: the age effect is estimated much more tightly
than the comorbidity effect.

## Interpretation and common pitfalls

- A hazard ratio is a ratio of **rates**, not of risks or probabilities: an
  HR of 1.4 over 5 years may correspond to a small absolute difference if
  baseline mortality is low. Always pair HRs with absolute rates or predicted
  survival.
- Adjusted HRs are conditional on the model's covariates; omitting a strong
  confounder biases the HRs of the covariates that are included.
- Checking proportionality after seeing significant results can overstate the
  problem; the PH assumption matters most when reporting a single HR as the
  summary of the whole follow-up.
- Predicting individual survival requires the baseline hazard, which is
  estimated with its own uncertainty; naive point predictions should carry
  that caveat.

The partial likelihood estimates relative hazards without specifying the baseline hazard, but absolute survival predictions require estimating that baseline and are conditional on the model being transportable. Assess proportional hazards using scaled Schoenfeld residuals and time-by-covariate patterns; a significant test alone is not the diagnosis. If an effect changes over time, report time-specific effects or a flexible time-varying coefficient, or use restricted mean survival time through a clinically chosen horizon. For non-proportional treatment effects, a single hazard ratio may obscure benefit and harm patterns and is not a risk ratio.

## References and further reading

## Model structure and interpretation

## Partial likelihood and ties

## Worked example with adjusted contrasts

Assume a fitted model has coefficients β-treatment = −0.36, β-age-per-10-years = 0.20, and β-treatment×age = 0.08 where age is centered at 60. At age 60, the treatment HR is \(e^{-0.36}=0.70\). At age 70, the treatment log-HR is −0.36+0.08=−0.28 and HR is 0.76. The interaction suggests the relative treatment effect is less protective at older ages on the hazard scale, but inference requires the covariance between coefficients to calculate the age-specific interval. Compute the linear contrast and its standard error; do not combine endpoint intervals or interpret separate subgroup p-values.

If estimated baseline survival at 2 years for the reference covariate pattern is 0.80, under PH the treated survival for a linear predictor difference of −0.36 is approximately \(S_0(2)^{e^{-0.36}}=.80^{.70}=.855\). This is only a model-based illustration at a covariate pattern. The prediction requires a valid baseline survival estimate, PH, correct functional forms, and uncertainty propagation. Population-average survival further averages across covariates rather than using one reference profile.

## Functional form and residual diagnostics

## Numerical validation of model output

## Reproducible baseline survival prediction

## Sparse events and overfitting

### Reporting a hazard ratio

Write “estimated hazard was lower” rather than “risk was reduced by” unless an absolute risk contrast is separately computed. Name the reference group and covariate conditioning, state the PH assumption and time horizon of any derived prediction, and give the HR with interval. Avoid interpreting a hazard as a probability over follow-up; cumulative risk integrates hazard over time and competing events.

When events are few relative to parameters, coefficients can be unstable, standard errors large, and apparent associations exaggerated. A rule of ten events per variable is only a crude historical heuristic; effective model complexity, predictor distributions, censoring, and separation all matter. Limit parameters based on subject-matter rationale, avoid stepwise selection, use shrinkage/penalization where appropriate, and report uncertainty. Firth penalization can address monotone likelihood in some Cox models, but changes estimation and should be stated. For prediction, validate optimism with bootstrap and avoid splitting a small dataset into inefficient train/test partitions.

For a causal treatment analysis, covariates should be chosen to control confounding, not to optimize p-values. Penalization may shrink confounders toward zero and induce residual confounding; causal estimation may need different methods than pure prediction. Keep these objectives distinct.

The `survfit` method applied to a Cox fit can return curves for specified covariate patterns. Select profiles that represent clinical scenarios and report all fixed covariate values; an “average patient” may not exist when covariates are categorical or nonlinear. For marginal absolute risk, generate predictions for the cohort under each treatment value and average survival at the horizon. Use bootstrap resampling to include uncertainty from coefficient and baseline hazard estimation. Calibration at a horizon can be assessed with observed-versus-predicted risk across groups, while discrimination can be summarized with a time-dependent C statistic; neither alone establishes clinical utility.

```r
sf <- survfit(fit, newdata = data.frame(treatment = 1, age = 60, sex = "F"))
summary(sf, times = c(1, 2, 5))
```

This returns conditional predictions for the specified covariates. If `sex` or treatment coding differs from the data's factor levels, prediction can silently refer to an unintended contrast or fail. Confirm factor levels and time units. External validation should assess both calibration-in-the-large and calibration slope, and recalibration must be evaluated on data separate from model development.

Before interpreting a fitted Cox model, verify the number of rows, events, and risk sets matches the analysis plan. Inspect missingness and exclusions by treatment, check that event coding is correct, and confirm time units and delayed entry. Compare unadjusted KM curves with model-based predictions as a gross calibration check; divergence can arise from covariate distributions but may reveal coding errors. Use confidence intervals on log-HR scale, exponentiated for display; a coefficient CI that crosses zero corresponds to an HR CI crossing one.

For age-specific treatment effects, calculate a linear contrast from the covariance matrix. If β=(βT,βTA) and age value is (a), log-HR is βT+aβTA and variance is (Var(βT)+a^2Var(βTA)+2aCov(βT,βTA)). This covariance term is essential. In R, `emmeans` or direct matrix multiplication can obtain the contrast; report age scale, centering, and interval method.

```r
b <- coef(fit); V <- vcov(fit)
a <- 1 # one 10-year increment above centered age
L <- c(treatment = 1, `treatment:age10` = a)
est <- sum(L * b[names(L)])
se <- sqrt(drop(t(L) %*% V[names(L), names(L)] %*% L))
c(HR = exp(est), lower = exp(est - 1.96 * se), upper = exp(est + 1.96 * se))
```

Coefficient names and vector order vary; explicitly align names before evaluating. This contrast is valid only for the fitted model's parameterization and asymptotic normal approximation. Bootstrap or profile likelihood can be considered for small samples or unstable estimates.

For continuous covariates, a linear predictor assumes a linear effect on log hazard. Categorizing age or biomarker values creates arbitrary cutpoints and loses information. Restricted cubic splines provide flexible shape while preserving continuity; select knots using standard practice and report the functional form. Martingale residuals can indicate systematic curvature, but residual patterns are noisy and must be interpreted with exposure range and event count. Assess influential cases with dfbeta and deviance residuals; do not delete influential observations automatically. Verify that proportionality diagnostics for time-dependent covariates make sense under chosen functional forms.

The global Schoenfeld test can reject because of a single covariate or tiny deviations. Inspect covariate-specific tests and smooth residual plots, then ask whether the magnitude and timing matter clinically. Remedies include stratification, time interactions, flexible parametric models, or reporting RMST/time-specific risk. Every remedy changes interpretation, so describe the resulting estimand and avoid presenting a single HR if it averages incompatible periods.

For an event at (t_i) in individual (i), the partial likelihood contribution is \(\exp(\beta^TX_i)/\sum_{j\in R(t_i)}\exp(\beta^TX_j)\), where (R(t_i)) is the risk set just before the event. Conditioning on the risk set removes the unspecified baseline hazard from estimation of β. With tied event times, exact partial likelihood is conceptually natural for discrete time but can be computationally intensive; Efron is generally accurate for moderate tie frequency, while Breslow may be adequate when ties are few. Ties often arise from rounding continuous times to days/months, so preserve event-time precision when available.

## Time-dependent effects and covariates

A time-varying coefficient can be represented by an interaction between predictor (X) and a function of time, such as (X\times\log(t)). This yields a time-specific HR and requires selecting a useful time scale and presenting estimates at clinically relevant times. A time-dependent covariate (X(t)) changes value over follow-up; start-stop records split follow-up at changes. Values must be measured before the interval's outcome, and “last observation carried forward” for covariates is an assumption rather than a neutral coding choice. If prior treatment affects a time-varying confounder that affects later treatment and outcome, standard time-dependent adjustment can bias total effects; marginal structural approaches may be required.

```r
library(survival)
long <- tmerge(data1 = baseline, data2 = baseline, id = id,
               event = event(time, status))
long <- tmerge(long, labs, id = id, marker = tdc(lab_time, marker_value))
fit_td <- coxph(Surv(tstart, tstop, event) ~ treatment + marker,
                data = long)
```

The `tmerge` structure must reflect measurements available at each risk interval, with no future leakage. A marker association is conditional on included covariates and is not automatically causal. Consider lagging biomarkers if imminent events alter them; explain the lag choice and test alternatives.

## Stratification, prediction, and validation

Stratified Cox regression gives each stratum its own baseline hazard while estimating common covariate effects. It is useful when a nuisance categorical covariate violates PH, but it cannot estimate that variable's HR. Interactions allow effect heterogeneity; report predicted contrasts and avoid interpreting averaged coefficients as universal. For prediction, assess calibration at clinically meaningful times, discrimination, and overall prediction error in independent data. Bootstrap internal validation corrects some optimism, but external validation across settings is required before implementation. Risk prediction demands a baseline hazard estimate and calibrated absolute probabilities; the relative HR alone is insufficient.

If the goal is a causal treatment effect, distinguish conditional HR from marginal survival difference. Standardization or weighting can estimate marginal survival under treatment policies, but requires exchangeability, positivity, consistency, and valid censoring assumptions. Do not infer causal protection simply because a model adjusts for many covariates. Provide a causal rationale for confounder selection and align time zero and treatment assignment to avoid immortal-time bias.

### Coding, interactions, and predicted survival

Categorical predictors require an explicit reference category, and coefficients depend on that coding. An interaction between treatment and age means the treatment hazard ratio varies with age: if \(\eta=\beta_T T+\beta_A A+\beta_{TA}TA\), then the treatment HR at age \(A=a\) is \(\exp(\beta_T+a\beta_{TA})\). Report contrasts at meaningful ages with confidence intervals rather than interpreting \(\beta_T\) as a universal effect. Center age so the main treatment coefficient refers to a clinically relevant age.

The Cox model can produce adjusted survival predictions by combining the estimated baseline cumulative hazard and linear predictor, but prediction needs calibration assessment and external validation. The baseline hazard is not a nuisance for absolute prediction: it determines absolute risk. For a target population, compute predicted survival under each treatment strategy and average across covariate profiles; bootstrap the whole procedure for uncertainty. Predictions beyond observed support are extrapolations even though the model is semiparametric.

The Cox model specifies \(h(t\mid X)=h_0(t)\exp(\beta^T X)\), leaving the baseline hazard \(h_0(t)\) unspecified. The partial likelihood compares each event case with the risk set immediately before that event. For a one-unit increase in a continuous predictor, \(e^\beta\) is the conditional hazard ratio, assuming other modeled covariates equal and proportional hazards. It is not a risk ratio and is not a direct change in survival probability. A hazard ratio of 0.70 does not mean 30% fewer people experience the event by a given time.

For tied event times, common approximations include Breslow and Efron; Efron often performs better when ties are common. Delayed entry (left truncation) requires specifying entry time so people contribute only when they become at risk. Stratified Cox models allow separate baseline hazards by stratum but do not estimate coefficients for the stratification variable. Time-varying covariates require start-stop data and careful temporal ordering; a covariate measured after an event or affected by prior treatment may create bias.

## Assumption checks and alternatives

Proportional hazards means hazard ratios do not change with time. Schoenfeld residual plots and tests can reveal departures but should be interpreted with graphical diagnostics and clinical knowledge; a significant global test in a large dataset may reflect a small departure, while low power can miss important nonproportionality. For a categorical predictor with a time-varying effect, add an interaction with a function of time or stratify if its coefficient is not the focus. If curves cross substantially, a single average hazard ratio can obscure clinically important patterns.

```r
library(survival)
fit <- coxph(Surv(time, event) ~ treatment + age + sex, data = dat,
             ties = "efron", x = TRUE)
summary(fit)
zph <- cox.zph(fit)
print(zph)
plot(zph)
```

Check coding, reference levels, functional form for continuous predictors, influential observations, and sparse risk sets. A linear age term assumes a linear relationship with log hazard; restricted cubic splines can relax that assumption. Martingale residuals help assess functional form, while deviance or dfbeta diagnostics identify unusual observations. Diagnostics do not establish causality or validate unmeasured confounding assumptions.

When proportional hazards is untenable, alternatives include reporting time-specific survival contrasts, RMST difference to a prespecified horizon, flexible parametric survival models, or an explicitly time-varying hazard ratio. Stratification sacrifices estimation of a covariate's effect; adding time interactions estimates changing effects but can be hard to summarize. Choose a clinically meaningful estimand before selecting the model.

## Worked interpretation

Suppose the fitted treatment coefficient is −0.357, so \(HR=e^{-0.357}=0.70\). The proper interpretation is that, conditional on included covariates and under proportional hazards, the instantaneous event hazard in the treated group is estimated to be 30% lower at each modeled time. If the baseline 2-year risk is 20%, the corresponding treated risk is not automatically 14%; derive it from an estimated baseline survival and the model, and include uncertainty. With nonproportional hazards, even this conditional summary is inadequate.

For causal inference, define time zero, treatment strategy, eligibility, outcome, and follow-up; ensure positivity and exchangeability or randomization; avoid immortal time and adjust only for appropriate baseline or time-varying covariates. The Cox model is a conditional model and does not itself identify a marginal causal effect. Standardization from fitted survival curves can estimate marginal survival under treatment strategies if model and causal assumptions are credible.

- Cox DR. Regression models and life-tables. *JRSS B*. 1972;34:187–220. https://doi.org/10.1111/j.2517-6161.1972.tb00899.x
- Schoenfeld D. Partial residuals for the proportional hazards regression model. *Biometrika*. 1982;69:239–241. https://doi.org/10.1093/biomet/69.1.239
- Therneau TM, Grambsch PM. *Modeling Survival Data: Extending the Cox Model*. Springer; 2000.

- Schoenfeld D. Partial residuals for the proportional hazards regression model. *Biometrika*. 1982;69:239–241. [doi:10.1093/biomet/69.1.239](https://doi.org/10.1093/biomet/69.1.239)

- Klein JP, Moeschberger ML. *Survival Analysis: A Self-Learning Text*.
  Springer.
- Collett D. *Modelling Survival Data in Medical Research*. Chapman & Hall/CRC.
- Fox J, Weisberg S. *An R Companion to Applied Regression*. Sage.

*The "Censoring and survival functions" article covers the non-parametric
building blocks used in the survival examples here.*
