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

## Product terms and conditional effects

For continuous X and binary Z∈{0,1}, linear regression E(Y|X,Z)=β0+β1X+β2Z+β3XZ. At Z=0 the slope is β1; at Z=1 it is β1+β3; β3 is the difference in slopes. For binary X and Z, the four expected means combine into a difference-in-differences contrast β3. For categorical factors with multiple levels, an interaction is a set of parameters and is tested jointly. A single coefficient's p-value may not test the scientific interaction hypothesis.

In logistic regression, the product term is on the log-odds scale. For modifier Z=0, OR_X=e^β1; for Z=1, OR_X=e^(β1+β3); their ratio is e^β3. The effect on probabilities is not constant because inverse-logit is nonlinear. Even with no product term in a logistic model, risk differences can vary across baseline risk. Thus “no interaction” is scale-specific.

### Worked example: interpret the blood-pressure model

The model gives drug slope −6.2 mmHg in younger patients and −6.2+3.8=−2.4 mmHg in older patients. The interaction contrast is 3.8 mmHg: treatment-associated lowering is 3.8 mmHg less in the older stratum. Its stated 95% CI (0.4,7.2) excludes zero, but inference should use the prespecified contrast and account for model design. To estimate uncertainty of the older slope, Var(β1+β3)=Var(β1)+Var(β3)+2Cov(β1,β3); one cannot add separate confidence interval endpoints.

```r
fit <- lm(change_sbp ~ drug * older + baseline_sbp, data = dat)
coef(fit)
# younger treatment slope is coef["drug"]
# older slope is coef["drug"] + coef["drug:older"]
```

Use `emmeans` or a linear contrast to calculate estimates and intervals. The code assumes drug and older are coded as intended; inspect factor reference levels. Adjusting for baseline outcome may improve precision if prespecified, while conditioning on post-treatment variables can bias total-effect estimates.

## Additive and multiplicative interaction

For a binary outcome, additive interaction asks whether joint exposure risk exceeds the sum of separate excess risks. With risks p11, p10, p01, p00, RERI=p11−p10−p01+p00; equivalently relative-risk form RR11−RR10−RR01+1 after scaling by p00. RERI=0 indicates no additive interaction, positive values indicate super-additivity, and negative values sub-additivity. The attributable proportion due to interaction is RERI/RR11 when meaningful. These quantities concern absolute excess risk and can have direct public-health relevance.

Multiplicative interaction compares ratios, such as RR11/(RR10×RR01), or the product-term coefficient in a log-link model. Logistic regression gives interaction on odds scale; with common outcomes, odds interaction may differ from risk interaction. Report scale and absolute risks. In case-control designs, OR-based RERI may approximate risk-based measures only under rare-disease and other assumptions.

### Calculation example

Suppose risks are p00=.10 (neither exposure), p10=.15 (A only), p01=.20 (B only), and p11=.32 (both). Additive interaction contrast=.32−.15−.20+.10=.07, meaning seven excess percentage points beyond additive separate risk increments. The multiplicative ratio is (.32/.10)/[(.15/.10)(.20/.10)]=3.2/3.0=1.067, a much smaller relative departure. These answer different questions and both estimates need uncertainty intervals.

```r
p00 <- .10; p10 <- .15; p01 <- .20; p11 <- .32
reri <- (p11-p00) - (p10-p00) - (p01-p00)
mult_int <- (p11/p00) / ((p10/p00)*(p01/p00))
c(RERI = reri, multiplicative_interaction = mult_int)
```

The calculation assumes risks are standardized to a common target population and exposure states are well-defined. Confounding and sparse joint-exposure groups can undermine estimates.

## Design, power, and interpretation

Interaction tests generally require more information than main-effect tests. Power depends on modifier prevalence, exposure distribution within strata, outcome frequency or residual variance, effect scale, and interaction size. Do not rely on a universal sample-size multiplier. Prespecify a small number of biologically motivated interactions, plan sample size or precision around the contrast, and report intervals even if tests are nonsignificant. Absence of significance is not evidence of homogeneity.

Effect modification is not confounding. Confounding is bias in an exposure-outcome association due to a common cause; effect modification is variation in the effect across a subgroup or covariate. A variable can do both. Within-stratum contrasts may still be confounded; adjust appropriately within strata or use standardized estimates. A significant subgroup result and nonsignificant result elsewhere do not prove an interaction; test the difference directly.

## Continuous modifiers and visualization

A product X×Z with continuous Z assumes the X slope changes linearly with Z. Center Z at a meaningful value so the X main effect refers to that value. If modification is nonlinear, use spline interactions or prespecified categories, but degrees of freedom and power increase. Plot predicted outcomes or contrasts with confidence bands over observed modifier values, showing data density; do not extrapolate into sparse ranges. Categorical cutoffs lose information and can manufacture apparent subgroup differences.

In randomized trials, subgroup effects are causal under trial assumptions but often imprecise; multiplicity and selective reporting remain concerns. In observational studies, causal effect modification additionally requires control of confounding within modifier strata and positivity. Report prespecified versus exploratory analyses and avoid deterministic claims from average subgroup effects.


## Estimating interaction uncertainty

For the older-group treatment slope β1+β3, standard error is sqrt[Var(β1)+Var(β3)+2Cov(β1,β3)]. For a difference-in-differences, use a linear contrast and the fitted covariance matrix. For RERI, which is a nonlinear function of risk ratios, use delta-method or bootstrap intervals; sparse joint-exposure groups can make normal approximations unreliable. A point estimate alone is insufficient, especially when interaction power is low.

```r
# General linear contrast from an lm/glm coefficient covariance matrix
b <- coef(fit); V <- vcov(fit)
L <- rep(0, length(b)); names(L) <- names(b)
L[c("drug", "drug:older")] <- 1
estimate <- sum(L*b)
se <- sqrt(drop(t(L) %*% V %*% L))
c(estimate = estimate, lower = estimate-1.96*se,
  upper = estimate+1.96*se)
```

Confirm coefficient names from `names(coef(fit))`; factor coding can alter names and contrast signs. In nonlinear models, predicted risk contrasts should be calculated on the probability scale with uncertainty propagated, rather than interpreting only a logit product coefficient.

## Subgroup analysis safeguards

Predefine subgroup rationale, modifier scale, outcome, and interaction scale. Limit the number of hypotheses, report all planned subgroup findings, and distinguish exploratory analyses. Avoid dichotomizing continuous modifiers at data-derived thresholds. Show treatment effects and intervals by subgroup, plus the formal interaction estimate. Do not infer interaction from separate within-subgroup significance tests. Consider whether subgroup definitions are available at clinical decision time and whether sample sizes support usable estimates.

## Joint tests and presentation

For a categorical modifier with multiple levels, interaction has several product coefficients. Use a joint likelihood-ratio, score, or Wald test for all interaction terms rather than selecting the most favorable coefficient. Report stratum-specific adjusted effects with intervals and the interaction test on the prespecified scale. Graph predicted outcomes or effect contrasts across modifier values with uncertainty; include a histogram or rug for modifier distribution so readers can see where data support estimates.

On an absolute scale, interaction may be important even when multiplicative interaction is absent, particularly when baseline risk is high. Conversely, multiplicative effect modification can occur with small absolute differences in low-risk populations. Public health prioritization often values excess cases (additive scale), while mechanistic or transport questions may focus on relative effects. State which interpretation motivates the analysis.

## Continuous modifier example

Suppose treatment contrast in SBP is modeled as β_T+β_TA(A−60), where age A is centered at 60. If β_T=−5 and β_TA=.08 mmHg per year, predicted treatment effect is −5 mmHg at age 60, −3.4 at age 80, and −6.6 at age 40. The interaction coefficient says the treatment effect becomes .08 mmHg less negative per additional year under this linear specification. Plot the contrast and interval across observed ages; do not assume the linear trend continues indefinitely.

```r
ages <- seq(40, 80, by = 5)
effect <- -5 + .08*(ages - 60)
plot(ages, effect, type = "b", xlab = "Age",
     ylab = "Treatment contrast in SBP (mmHg)")
abline(h = 0, lty = 2)
```

This is a point-estimate illustration; add confidence bands using the coefficient covariance matrix. If age modification is nonlinear, use spline interactions and prespecify degrees of freedom to limit overfitting.

## Power and uncertainty in subgroup estimates

If a modifier is rare, the stratum with few participants can dominate uncertainty even when the total trial is large. For binary modifier prevalence q, expected information on an interaction is often greatest when groups are reasonably balanced, but clinical prevalence cannot be manipulated in an observational setting. Report subgroup denominators and event counts. If interaction is a key objective, recruit or enrich relevant strata where ethical and plan the analysis prospectively.

Subgroup estimates should be viewed with intervals rather than as a leaderboard of p-values. A benefit estimate in one stratum and a null estimate in another can have overlapping intervals and no evidence of interaction. Conversely, a clinically important interaction may have a wide interval because the trial was powered only for an overall effect. State this precision limitation explicitly.

For reproducible interaction reporting, state the model family and link, coding and centering of each term, scale of effect modification, joint test used, subgroup sample sizes, and whether the hypothesis was prespecified. Include the main-effect interpretation at the modifier reference value. A product term without these details cannot be reliably translated into subgroup effects.

If a treatment's effect differs by modifier, the overall average effect remains a valid target for the trial population but may not guide decisions for every subgroup. Report both the population-average effect and prespecified subgroup contrasts when useful. Avoid converting exploratory heterogeneity into a treatment recommendation without independent confirmation and sufficient absolute-risk information.

A confidence interval for an interaction contrast is often more informative than a binary test result. If the interval includes both clinically important benefit and harm modification, conclude that heterogeneity remains uncertain rather than that effects are equal. Consider whether the modifier is measured reliably and whether its categories were defined before outcome analysis.

## Report the target contrast in plain language

Translate estimates back to the clinical scale: for the trial example, “drug-associated SBP reduction was estimated 3.8 mmHg smaller in older participants, with a 95% interval from 0.4 to 7.2 mmHg smaller.” Avoid saying the drug “works only” in one subgroup unless the data support both within-group effects and a formal contrast. Statistical interaction can reflect scale choice; biological explanation requires external evidence and replication.

## References and further reading

- Knol MJ, VanderWeele TJ. Recommendations for presenting analyses of effect modification and interaction. *International Journal of Epidemiology*. 2012;41:514–520. [doi:10.1093/ije/dyr218](https://doi.org/10.1093/ije/dyr218)

- Agresti A. *Categorical Data Analysis*. Wiley.
- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott Williams & Wilkins.
- Fox J. *Applied Regression Analysis and Generalized Linear Models*. SAGE.
- The companion [linear regression article](simple-and-multiple-linear-regression.html) covers the base model to which interaction terms are added.

Effect modification can guide targeting only when subgroup membership is known before treatment and estimates are sufficiently precise. A modifier defined after treatment can introduce selection bias. Consider feasibility, harms, and absolute baseline risk before translating heterogeneity estimates into clinical rules.

The interaction estimate is itself a statistical quantity whose confidence interval reflects uncertainty in both subgroup effects and their covariance. If that interval is wide, avoid ranking subgroup responses. Seek replication, use partial pooling for multiple related subgroups when justified, and preserve the overall randomized comparison as the primary evidence unless a subgroup hypothesis was prespecified and adequately supported.
