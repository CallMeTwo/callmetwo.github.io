---
title: Logistic regression
summary: Models the log-odds of a binary outcome as a linear combination of predictors, yielding interpretable odds ratios with confidence intervals.
---

## Overview and key ideas

Logistic regression is the standard model for binary outcomes — died/survived, infected/not infected, present/absent — and, with extensions, for rare events and ordinal responses. It models the *log-odds* (logit) of the outcome as a linear function of the predictors: log(p / (1 − p)) = β₀ + β₁X₁ + β₂X₂ + …, where p is the probability of the event. The inverse logit converts back to a probability: p = 1 / (1 + e^−(β₀ + β₁X₁ + …)), which always stays between 0 and 1.

The model is fitted by maximum likelihood rather than least squares. The central estimand is the exponentiated coefficient: for a one-unit increase in Xⱼ, the *odds* of the event are multiplied by e^βⱼ — the odds ratio (OR) — holding other predictors fixed. OR = 1 means no association, OR > 1 increases odds, OR < 1 decreases them. For a binary predictor (e.g. sex), the OR compares the odds between the two groups directly. Logistic regression can be used descriptively (adjusting for confounders) or for prediction, and it underpins case-control studies, where it naturally estimates ORs even when disease prevalence is sampled, not measured.

## When to use it

| Setting | Example question |
| --- | --- |
| Case-control study | Is a genetic variant associated with a rare cancer, adjusted for age and sex? |
| Risk modelling | Which baseline factors independently predict in-hospital mortality? |
| Diagnostic research | Do imaging features predict whether a nodule is malignant? |
| Clinical trial | Does the treatment reduce the odds of treatment failure at 12 weeks? |

Use it when the outcome is binary (or a count of rare events per subject) and you want an effect estimate adjusted for covariates. If the outcome is a rate (events per person-time), use Poisson or negative binomial regression; if it is time-to-event, use Cox proportional hazards. Logistic regression can also be fitted to a binary outcome with a 1-in-N prevalence as an approximation of a rare-event rate.

## Assumptions and limitations

- **Linearity on the logit scale**: the log-odds must change linearly with each continuous predictor; a curved relationship (e.g. U-shaped risk by age) biases the OR.
- **Independence**: one observation per subject; repeated measures or clustered patients require generalised estimating equations or mixed models.
- **No severe multicollinearity** among predictors, as in any linear-model family.
- **Sufficient events**: a rule of thumb is at least 10 outcome events per fitted coefficient (often stricter for prediction models), or the maximum-likelihood estimates become unstable and overfit.
- **OR ≠ risk ratio**: when the outcome is common (prevalence > 10–20%), the OR overstates the risk ratio in both directions; a rare outcome (incidence < 10%) makes OR ≈ RR.

## Worked example

A registry of 1,200 myocardial infarction patients models in-hospital death with age (per 10 years) and Killip class (>1 vs 1). Maximum likelihood gives: logit(death) = −2.00 + 0.25·(age/10) + 0.95·(Killip > 1). For a 70-year-old in Killip class I: logit = −2.00 + 0.50 = −1.50, so p = 1/(1 + e^1.5) ≈ 0.18, i.e. an estimated 18% mortality. Upgrading to Killip class II adds 0.95 to the logit: p = 1/(1 + e^0.55) ≈ 0.58. The exponentiated Killip coefficient is e^0.95 = 2.59 (95% CI e^0.53 to e^1.37, i.e. 1.70 to 3.95): Killip class >1 multiplies the odds of death by about 2.6 at any given age — roughly tripling, not merely adding, the probability (18% to 58%), which is why the OR and the absolute risks must be reported together.

## Interpretation and common pitfalls

- The OR is a ratio of *odds*, not of probabilities: an OR of 2 does not mean "twice as likely" when the baseline probability is anything but small.
- Reporting ORs from a case-control study as risk ratios, or ORs from a cohort study of a common outcome as if they were RRs, systematically exaggerates effects.
- A "non-significant" adjusted OR can still be an important finding (wide CI) or a sign of residual confounding; examine the CI and the change from the crude OR, not just the p-value.
- Do not interpret the intercept as a clinically meaningful baseline risk unless the reference values of all predictors are realistic (e.g. age = 0).

## References and further reading

- Agresti A. *Categorical Data Analysis*. Wiley.
- Menard S. *Applied Logistic Regression*. SAGE.
- Collett D. *Modelling Binary Data*. Chapman & Hall/CRC.
- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott Williams & Wilkins.
- *The topic map's "Count and rate outcomes" section covers Poisson and negative binomial regression (article planned).*
