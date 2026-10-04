---
title: Mixed-effects models
summary: Regression for longitudinal and clustered data that separates between-subject and within-subject variation.
---

## Overview and key ideas

A **mixed-effects model** (linear mixed model, LMM) extends ordinary linear
regression to repeated and clustered observations by adding **random
effects** — random intercepts and, if needed, random slopes — for each subject
on top of the fixed effects that answer the research question. The typical
form is:

Y_ik = beta_0 + beta_1 x_ik + u_i + e_ik, where u_i ~ N(0, sigma_u²) is the
subject-specific deviation from the population intercept and e_ik ~ N(0, sigma_e²)
is the residual. The random term makes observations from the same subject
correlated, and the fixed effects are estimated with all available data —
including subjects who missed some visits — under maximum likelihood.

The fixed-effect estimates are what the paper reports; the variance components
(sigma_u², sigma_e²) quantify how much of the total variability is between
people versus within people over time.

## When to use it

| Setting | Example question |
| --- | --- |
| Longitudinal trial | How does haemoglobin change over 12 months in iron deficiency, and does iron therapy alter the slope? |
| Growth studies | How do children's heights grow, and does nutrition change the trajectory? |
| Clustered data | How do hospital-level staffing levels relate to readmission, when patients are nested within hospitals? |

Choose a mixed model when you want a **subject-specific** interpretation
("this individual's expected trajectory"), when the number of levels of a
clustering factor is large, or when you want to predict for individuals.

## Assumptions and limitations

- **Normality** of random effects and residuals; the LMM is least-squares in
  fixed effects and likelihood-based in variance components, so departures can
  bias standard errors more than point estimates.
- **Linearity** in the fixed effects; if growth is curvilinear, include
  polynomial or spline terms in time.
- The chosen **covariance structure** must be plausible: an uncorrelated
  structure ignores the data's design, and a compound-symmetry structure can
  be wrong for data whose correlation decays with time.
- With a small number of clusters (fewer than ~5–10 hospitals, say),
  variance components are estimated imprecisely and fixed-effect standard
  errors need cluster-robust or small-sample adjustments.
- Missing data are handled as missing-at-random by default; informative
  dropout violates that.

## Worked example

A trial randomises 200 children with iron-deficiency anaemia to oral iron
(n = 100) or placebo (n = 100), measuring haemoglobin at baseline, 3, 6, and
12 months. A mixed model with random intercepts and a fixed effect for time ×
treatment interaction gives an interaction coefficient of 1.1 g/dL
(95% CI 0.7 to 1.5): iron patients' haemoglobin rose about 1.1 g/dL more than
placebo patients' by 12 months, after allowing for each child's own baseline
level. The random-intercept variance (sigma_u² = 0.21) versus residual variance
(sigma_e² = 0.14) means about 60% of the variability is between children, so
averaging everyone's 12-month value into one comparison would discard most of
the signal.

## Interpretation and common pitfalls

- Fixed-effects and random-effects estimates of the **treatment effect** can
  differ: in a random-effects model the effect can be read as how a given
  person's outcome changes, while in a GEE it is the average change across
  people; choose the estimand first, then the model.
- Reporting standard errors from a model fitted with a misspecified
  covariance structure; use likelihood-ratio tests or information criteria to
  compare structures, but do not treat the chosen structure as truth.
- Confusing the random intercept with a covariate: the random intercept
  absorbs each subject's stable baseline, so a fixed baseline covariate should
  not also be added carelessly — check for separation and interpretability.
- Extrapolating beyond the observed time range: the model interpolates the
  visits you measured; predicted values past the last visit assume the
  trajectory continues as modelled.

Random intercepts and slopes induce a covariance pattern through the distribution of latent subject effects; they are not merely a way to “account for repeated measures.” Likelihood-based mixed models can use incomplete outcome trajectories under a missing-at-random assumption conditional on included variables and the observed history. This does not justify ignoring predictors of missingness or dropout. Random-effects normality and covariance assumptions can affect inference, and a population-average estimand may call for GEE instead. Include time-by-treatment interactions when the treatment contrast can evolve, and use planned contrasts to make the comparison at meaningful visits explicit.

## References and further reading

- Pinheiro J, Bates D. *Mixed-Effects Models in S and S-PLUS*. Springer.
- Diggle P, Heagerty P, Liang K, Zeger S. *Analysis of Longitudinal Data*.
  Oxford University Press.
- Fox J, Weisberg S. *An R Companion to Applied Regression*. Sage.

*The "Generalized estimating equations" article contrasts the population-
averaged alternative to the subject-specific perspective used here.*
