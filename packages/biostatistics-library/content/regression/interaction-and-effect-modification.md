---
title: Interaction and effect modification
summary: Quantifying whether the effect of one exposure differs across levels of a second variable, using product terms in regression models.
---

## Overview and key ideas

Effect modification — the phenomenon that the effect of an exposure on an outcome differs depending on the level of a second variable — is a genuine feature of the biology or system under study: a drug may work in younger patients but not in older ones, a genetic risk variant may matter only under environmental exposure. Interaction is the *statistical* expression of this: a term in the model whose presence changes the estimated effect of another term across levels of a third variable.

In a linear model, the interaction between a continuous X and a binary Z enters as a product term: Y = β₀ + β₁X + β₂Z + β₃(X·Z) + ε. The effect of X is then β₁ when Z = 0 and β₁ + β₃ when Z = 1; β₃ is the *difference in slopes*. In logistic regression the interaction is written on the log-odds scale: logit(p) = β₀ + β₁X + β₂Z + β₃(X·Z) + ε, so the odds ratio for X is e^β₁ in the Z = 0 group and e^(β₁+β₃) in the Z = 1 group; e^β₃ is the ratio of those two ORs (the "interaction contrast"). A statistically significant interaction means the association is not homogeneous across groups — it says nothing about whether either association is itself significant.

## When to use it

| Setting | Example question |
| --- | --- |
| Precision medicine | Does the treatment effect on HbA1c differ by baseline genotype? |
| Safety pharmacology | Is the bleeding risk of anticoagulation modified by age stratum? |
| Gene–environment studies | Does the dietary factor modify the association between a SNP and a disease? |
| Trial stratification | Is the drug's effect on event rate different in men versus women? |

Add an interaction term when there is a substantive hypothesis or a strong prior signal of modification — not as a default. When the modifier is a continuous variable (e.g. age), consider whether the effect is plausibly linear in it or whether a categorical stratum (or spline) is more honest.

## Assumptions and limitations

- **Power**: interaction tests are often imprecise because they estimate a contrast between effects. There is no universal sample-size multiplier: power depends on exposure and modifier distributions, event rate or outcome variance, effect scale, and the interaction magnitude. Plan around a clinically meaningful interaction and report its interval.
- **Scale dependence**: a "non-significant" interaction in logistic regression (log-odds scale) can coexist with a significant one on the risk-difference scale, and vice versa; state the scale explicitly.
- **Model specification**: for continuous modifiers the product term assumes the modification is linear in the modifier; check by stratified estimates at several values.
- **Collinearity**: the product term is correlated with its components; centring the continuous variables before forming X·Z makes the main-effect coefficients interpretable and slightly stabilises estimation.
- **Confounding vs modification**: a stratified estimate can differ across strata because of *confounding* by variables that differ between strata, not because of true modification; adjustment within each stratum is needed to separate the two.

## Worked example

A trial randomises 800 patients with hypertension to a drug or placebo. The primary outcome is change in systolic blood pressure over 12 weeks (continuous). A model with drug, age (>65 vs ≤65), and their product gives: ΔSBP = −6.2·(drug) + 1.1·(age>65) + 3.8·(drug × age>65). In patients aged ≤65 the drug lowers SBP by 6.2 mmHg; in those >65 by 6.2 − 3.8 = 2.4 mmHg. The interaction coefficient 3.8 (p = 0.031, 95% CI 0.4 to 7.2) means the drug's effect is about 3.8 mmHg smaller in older patients — a genuine effect modification. If the same model were logistic (binary outcome: SBP reduction ≥ 10 mmHg) with an interaction p = 0.14, the data would be compatible with modification but not precise enough to conclude it; reporting the two stratum-specific ORs (1.9 for ≤65, 1.3 for >65) alongside the non-significant interaction is the honest summary.

## Interpretation and common pitfalls

- "Interaction" and "effect modification" are not synonyms in casual use: interaction is the model term; effect modification is the substantive claim that the effect genuinely varies. The former requires the latter to be scientifically meaningful.
- A non-significant interaction test does not mean "no modification" — it means the data are compatible with a range of modifications, including large ones. Report the CI on the interaction contrast.
- Do not report only the overall (pooled) effect when modification is present; the average of two different effects can mask a large effect in a subgroup.
- In logistic regression, testing for interaction by comparing nested models (with and without the product term) via a likelihood-ratio test is the standard approach; do not rely on the Wald p-value of the product term alone when n is small.
- Centring continuous predictors before forming a product term is cosmetic for the interaction estimate but important for the interpretability of the main effects; document it.

For a binary outcome, additive interaction has direct public-health meaning: compare risks under the joint exposure states. With risk ratios, the relative excess risk due to interaction is RERI = RR11 − RR10 − RR01 + 1; RERI = 0 denotes no additive interaction under this measure. This is not interchangeable with a product-term test on the logistic (multiplicative odds) scale. Estimate stratum-specific risks or standardized contrasts with confidence intervals, and name the target scale before testing. In trials, subgroup estimates are often imprecise; formal interaction tests and prespecified hypotheses are more informative than comparing whether each subgroup's p-value crosses 0.05.

## References and further reading

- Knol MJ, VanderWeele TJ. Recommendations for presenting analyses of effect modification and interaction. *International Journal of Epidemiology*. 2012;41:514–520. [doi:10.1093/ije/dyr218](https://doi.org/10.1093/ije/dyr218)

- Agresti A. *Categorical Data Analysis*. Wiley.
- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott Williams & Wilkins.
- Fox J. *Applied Regression Analysis and Generalized Linear Models*. SAGE.
- The companion [linear regression article](simple-and-multiple-linear-regression.html) covers the base model to which interaction terms are added.
