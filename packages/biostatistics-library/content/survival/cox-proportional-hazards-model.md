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

- Schoenfeld D. Partial residuals for the proportional hazards regression model. *Biometrika*. 1982;69:239–241. [doi:10.1093/biomet/69.1.239](https://doi.org/10.1093/biomet/69.1.239)

- Klein JP, Moeschberger ML. *Survival Analysis: A Self-Learning Text*.
  Springer.
- Collett D. *Modelling Survival Data in Medical Research*. Chapman & Hall/CRC.
- Fox J, Weisberg S. *An R Companion to Applied Regression*. Sage.

*The "Censoring and survival functions" article covers the non-parametric
building blocks used in the survival examples here.*
