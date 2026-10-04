---
title: Mixed-effects models
summary: Model clustered and repeated outcomes with fixed effects for population relationships and random effects for variation across people, clinics, or other groups.
---

## Overview

Mixed-effects models combine fixed effects, which describe average relationships, with random effects, which represent variation across clusters or individuals. They are useful when observations are correlated because people are measured repeatedly, patients share clinics, or samples are nested within sites. Modeling dependence improves uncertainty estimates and can describe heterogeneity, but does not automatically solve confounding or missing-data problems.

The target interpretation depends on the model and link. In a linear mixed model, fixed effects often represent population-average mean differences under common assumptions. In a logistic mixed model, coefficients are conditional on random effects and are subject-specific; they generally differ from marginal population-average effects from GEE. Choose a model based on the scientific estimand and data structure.

## Separate within-person and between-person variation

For continuous outcome \(Y_{ij}\) measured for person \(i\) at time \(j\), a random-intercept model is \(Y_{ij}=\beta_0+\beta_1t_{ij}+b_{0i}+\epsilon_{ij}\), with \(b_{0i}\sim N(0,\sigma_b^2)\) and residual \(\epsilon_{ij}\sim N(0,\sigma^2)\). The random intercept captures stable differences between people; repeated measurements from the same person are correlated through shared \(b_{0i}\).

The intraclass correlation in this simple model is \(\sigma_b^2/(\sigma_b^2+\sigma^2)\), the proportion of total variance attributable to between-person differences. If \(\sigma_b^2=16\) and residual variance is 9, ICC is 16/25=0.64; two measurements from the same person are strongly correlated. This affects standard errors and the information gained from repeated visits.

Random slopes allow individual trajectories to vary: \(Y_{ij}=\beta_0+\beta_1t_{ij}+b_{0i}+b_{1i}t_{ij}+\epsilon_{ij}\). The covariance between random intercept and slope describes whether people with higher baseline values tend to change faster or slower. Random effects should reflect plausible heterogeneity and be supported by enough independent clusters and repeated observations.

Within-person and between-person associations can differ. If a patient's biomarker rises over time, the association between that within-person change and outcome may not equal the association between patients with different average biomarker levels. Decompose a time-varying predictor into the person's mean and deviation from that mean. This distinguishes a within-person effect from a between-person effect and avoids conflating them in one coefficient.

For example, for repeated blood pressure \(X_{ij}\), include person mean \(\bar X_i\) and deviation \(X_{ij}-\bar X_i\). The coefficient for deviation describes how outcome changes when a person is above their own usual pressure; the mean coefficient compares people with different usual pressures. This is descriptive unless time-varying confounding and measurement error are addressed, but it clarifies what variation supports each estimate.

```r
library(lme4)
fit <- lmer(score ~ treatment * time + baseline_score +
              (1 + time | patient_id), data = long_dat)
summary(fit)
```

This model assumes a linear mean trajectory and normally distributed random effects and residuals. Time may need a categorical, spline, or nonlinear form. `patient_id` is the repeated-measure unit; add a clinic-level term if appropriate and adequately supported. Check convergence, singular fit, residual patterns, and sensitivity to random-effects structure.

## Fixed effects, random effects, and the estimand

Fixed effects describe average covariate relationships across the modeled population. Random effects represent latent cluster-specific deviations drawn from a distribution. For example, a random clinic intercept allows baseline outcome levels to vary by clinic, while a treatment random slope allows treatment association to vary across clinics. These are distributional assumptions, not merely software options.

A subject-specific prediction includes estimated random effects for a known individual; a population-average prediction integrates over the random-effects distribution. For a Gaussian identity-link model these can align for mean contrasts, but for nonlinear links they differ. In logistic regression, a conditional OR of 0.60 can correspond to a marginal OR closer to 0.70 because averaging over heterogeneity changes the scale. Report which prediction or effect is given.

Random effects are often treated as independent of included covariates. If cluster-level characteristics correlate with unobserved cluster effects, this assumption can fail. Include relevant cluster-level predictors, or use within-between decompositions to separate individual and cluster associations. A random intercept does not control all cluster-level confounding automatically.

## Site effects and exchangeability

Fixed effects can represent a finite set of specific sites rather than a population distribution of sites. A site-indicator model estimates site-specific intercepts without assuming sites are exchangeable draws. This can control stable site differences when there are enough sites, but site coefficients are not generalized. Random effects partially pool site estimates and support prediction for new sites if the distributional model is credible.

The random-effect distribution is usually assumed normal and independent of residual error. Strong departures may affect variance estimates and cluster-specific prediction. With many clusters, fixed-effect estimates can be fairly robust to moderate nonnormality; with few clusters or extreme imbalance, assumptions matter more. Bayesian hierarchical models can regularize variance components, but prior choice then deserves sensitivity analysis.

## Longitudinal treatment example

Suppose a trial measures pain at baseline, 1, 3, and 6 months. A treatment-by-time interaction estimates how mean trajectories differ. With time categorical, each interaction is the treatment difference in change from baseline to that visit. With numeric time, it is a difference in linear slope per month. The latter is more parsimonious but assumes linear trajectory; compare fitted values with observed summaries.

If treatment-by-month-6 coefficient is −2.0 (SE 0.8), the estimated additional improvement at six months is 2 points in the favorable direction, with 95% CI approximately −3.6 to −0.4 under the chosen coding. Explain the sign and scale, and consider whether 2 points is clinically important. If baseline is included as an outcome repeated measure and covariate, avoid redundant parameterization; specify the analysis model clearly.

## Random-effects structure and covariance

A random intercept imposes a compound-symmetry-like correlation for repeated observations under equal residual variance. A random slope gives correlation that can vary with time. Residual autocorrelation may remain even after random effects; models can add AR(1) residual structure, though support varies by software. Choose covariance structure based on measurement schedule and scientific expectations, and avoid maximal random-effects structures unsupported by data.

Singular fits occur when one or more variance components are estimated near zero or correlations at boundaries. They can indicate overparameterization, insufficient clusters, or genuinely negligible variation. Simplify based on a prespecified hierarchy and scientific rationale, not just to obtain a desired p-value. Report singularity and sensitivity to reasonable structures.

For cluster trials, a random intercept for clinic accounts for outcome correlation but treatment effect remains a fixed average unless a random treatment slope is included. With few clinics, variance estimates can be imprecise and standard asymptotic tests anti-conservative. Use small-sample degrees-of-freedom corrections or cluster-level/randomization-based inference where appropriate. The number of clusters, not patient count alone, limits information about cluster-level treatment.

### Interpreting the intraclass correlation

Under a random-intercept Gaussian model, ICC quantifies similarity of outcomes from the same cluster. If ICC is 0.10 and average clinic size is 20, the familiar design effect is approximately \(1+(20-1)(0.10)=2.9\): variance can be nearly three times that under independent sampling. Unequal cluster sizes can increase it further. This approximation explains why cluster trials need enough clinics, but it is not a substitute for design-specific power calculations.

For a logistic mixed model, latent-scale ICC uses logistic residual variance \(\pi^2/3\) and can be difficult to interpret as an observed-scale correlation. Report the variance component and, where useful, predicted probabilities or marginal correlation. ICC depends on outcome prevalence and model scale; avoid comparing values across radically different populations without context.

Random slopes induce richer covariance patterns. In the linear model, covariance between observations at times \(t\) and \(s\) includes \(Var(b_0)+(t+s)Cov(b_0,b_1)+tsVar(b_1)\). Correlation may increase or decrease with time. If measurements are highly irregular, a random slope may not adequately represent serial dependence; consider residual correlation structures.

## Binary and count outcomes

Generalized linear mixed models extend random effects to non-Gaussian outcomes. A logistic mixed model uses a logit link and conditional odds ratios; a Poisson mixed model models counts with log link and can include an exposure offset. Random effects capture heterogeneity and induce within-cluster dependence. Distributional assumptions become important, particularly with few clusters or rare outcomes.

For binary outcomes, conditional odds ratios are not marginal risk ratios. Calculate population-average probabilities by integrating predictions over random effects or use marginal standardization. For counts, check overdispersion and zero inflation; a random intercept may absorb some heterogeneity but not necessarily all. State whether estimates are cluster-specific or population-averaged.

```r
fit_bin <- glmer(event ~ treatment + age + (1 | clinic),
                 data = dat, family = binomial())
exp(fixef(fit_bin)["treatmentactive"])
```

The exponentiated coefficient is a clinic-conditional OR, not an absolute risk difference. Compute marginal predictions for clinical communication and validate the model. With sparse events, separation or boundary estimates may require penalized methods or Bayesian priors.

## Missing outcomes and unbalanced follow-up

Likelihood-based mixed models can use participants with different numbers of observed measurements under a MAR assumption conditional on included variables and observed history. They do not require every participant to have the same visits. If dropout depends on unobserved outcomes after conditioning, estimates can be biased. Compare dropout by group and history, include predictors of missingness, and perform MNAR sensitivity analyses.

Intermittent missingness and dropout have different patterns. A participant missing month 3 but observed at month 6 contributes both observed outcomes. The model assumes the observed data likelihood is correctly specified. Multiple imputation can be used as a sensitivity or primary method, but the imputation model must preserve within-person dependence and analysis interactions.

The MAR assumption is conditional on all included observed information, including prior outcomes if they predict dropout. If dropout depends on unobserved worsening after conditioning, likelihood estimates may be biased. Pattern-mixture sensitivity analyses can shift imputed post-dropout values in a direction representing plausible deterioration, while selection models link response probability to the unseen outcome. Results should show whether clinically relevant conclusions change over plausible values.

If treatment discontinuation is an intercurrent event, decide whether the target is treatment-policy (continue follow-up regardless of discontinuation) or hypothetical (outcome had treatment continued). Missing after discontinuation is not automatically equivalent to the hypothetical estimand. Collecting outcomes after discontinuation supports a treatment-policy analysis and avoids strong extrapolation.

## Model checks and predictions

Inspect residuals versus fitted values and time, normal Q-Q plots for Gaussian residuals and random effects, and influence of clusters. For generalized models, use simulation-based residual diagnostics and check calibration. Assess whether random effects are approximately modeled; inferences for fixed effects may be robust to some deviations with many clusters, but predictions for new clusters depend directly on the random-effects distribution.

Distinguish prediction for an existing cluster from a new cluster. Existing-cluster predictions may condition on estimated random effects (BLUPs), which are shrunk toward zero. New-cluster predictions integrate over the random-effects distribution and have greater uncertainty. Report prediction intervals or uncertainty bands, not just fitted means. Validate predictive performance at the level of intended use.

### Interpreting a treatment-by-time coefficient

Suppose the model uses months as a numeric variable and estimates treatment-by-time coefficient −0.25 points per month (SE 0.10), with lower scores better. This says the active group improves by an additional 0.25 points per month relative to control under the linear mean trajectory. Over six months, the modeled difference in change is −1.5 points, but its standard error is not simply six times 0.10; calculate the linear contrast and use the coefficient covariance matrix. If the time pattern is not linear, this extrapolation is inappropriate.

With categorical visits, each treatment-by-visit coefficient compares the treatment difference in change at that visit to the reference visit. Report the reference period and derive visit-specific contrasts. A main treatment coefficient then refers only to the reference time, often baseline, and may not represent a clinically relevant follow-up effect.

For random slope models, fixed treatment-by-time terms describe the average trajectory, while random slope variance describes individual variation around it. A significant mean effect can coexist with substantial patient-to-patient heterogeneity. Plot predicted population mean and, when useful, distribution of individual trajectories; avoid presenting shrunken empirical Bayes predictions as directly observed individual effects.

## Causal and design limitations

Mixed-effects models account for correlation; they do not randomize exposure or eliminate unmeasured confounding. In observational data, cluster random effects may be correlated with treatment choice, violating model assumptions. Include measured confounders and consider fixed effects or within-cluster contrasts when appropriate, recognizing that time-invariant exposures cannot be estimated with cluster fixed effects.

In longitudinal causal analyses, time-varying confounders affected by prior treatment require methods beyond ordinary mixed regression, such as marginal structural models. Conditioning on post-treatment variables can bias total effects. Define the estimand and temporal ordering before selecting covariates.

## Small samples and computational behavior

Variance components are estimated near a boundary of zero, so standard Wald intervals and likelihood-ratio tests can be inaccurate in small samples. Profile likelihood or parametric bootstrap intervals may better reflect asymmetry. For a random effect with estimated variance zero, the data provide little evidence of between-cluster heterogeneity under the fitted model; this does not prove observations are independent or justify ignoring the assignment design.

Convergence warnings, singular covariance matrices, and correlations estimated near ±1 indicate the random-effects structure may be too complex or poorly identified. Center and scale time, simplify unsupported covariance terms, and compare prespecified structures. Do not increase optimizer iterations indefinitely without diagnosing the issue. Report software, optimizer, convergence checks, and any simplification.

In cluster-randomized trials with few clusters, mixed models can still have biased fixed-effect standard errors. Kenward–Roger or Satterthwaite degrees of freedom, small-sample corrections, or randomization-based inference may be needed. The number of independent randomization units is the main constraint; adding patients to a few clinics helps less than adding clinics.

## Choosing between mixed models and GEE

Use a mixed model when cluster- or person-specific trajectories, variance components, or predictions for existing and new clusters matter. Use GEE when a marginal population-average mean is primary and enough independent clusters support sandwich inference. For continuous Gaussian outcomes, point estimates can be similar, but standard errors and missing-data handling differ. For binary outcomes, subject-specific and population-average coefficients differ even when both models fit well.

Neither method is universally “more correct.” A random-effects distribution imposes assumptions about heterogeneity and can provide efficient estimates if reasonable. GEE relies on a marginal mean model and robust variance asymptotics. With few clusters, ordinary GEE sandwich inference can fail; mixed models also need small-sample corrections. Compare estimates on the same estimand scale before treating differences as a model conflict.

If the goal is an average risk difference, fit a model that supports standardized marginal predictions or use GEE with an appropriate identity link if stable. A logistic mixed model coefficient does not directly answer that question. For causal effects with time-varying confounding, neither routine mixed regression nor ordinary GEE may suffice; g-methods may be needed.

## Reporting subject- and population-level results

State which levels receive random effects, which terms are fixed, the covariance structure, estimation method, and whether predictions condition on estimated cluster effects or average over the distribution. Report variance components and intervals where meaningful. For binary outcomes, label exponentiated coefficients as conditional odds ratios and provide marginal predicted risks when decisions are population-based.

For longitudinal analyses, state time coding and reference visit, treatment-by-time contrasts, and missingness assumptions. Include predicted trajectories with uncertainty and distinguish population mean from individual predicted path. For cluster studies, report number of clusters and size distribution. The repeated-measures-designs article compares approaches to within-person correlation and visit scheduling.

Avoid describing random effects as “random variation” without explaining their role. A random intercept captures shared cluster propensity under a model; it does not absorb every unmeasured confounder. A random slope estimates heterogeneity across sampled clusters but may be imprecise when few clusters are observed. These limitations should shape any claim about between-site variation.

Use prediction intervals when communicating expected outcomes for a new clinic or patient trajectory; confidence intervals around the average fixed effect omit much of that predictive heterogeneity. Clearly distinguish uncertainty in the population mean from spread among individuals.

Model outputs should identify the target cluster population and the scale on which effects are estimated, since prediction for a known site and an unseen site are different tasks.

For longitudinal prediction, validate predictions at the future visit and in the population where they will be used. Random-effect shrinkage can improve prediction for an observed patient with repeated history, but a baseline-only prediction for a new patient has greater uncertainty. State which setting a reported prediction represents.

When an estimated variance is near zero, report the uncertainty and model structure rather than interpreting the point estimate as proof of no clustering.

## References and further reading

- Laird NM, Ware JH. Random-effects models for longitudinal data. *Biometrics*. 1982;38:963–974. [doi:10.2307/2529876](https://doi.org/10.2307/2529876)
- Fitzmaurice GM, Laird NM, Ware JH. *Applied Longitudinal Analysis*. 2nd ed. Wiley; 2011.
- McCulloch CE, Searle SR, Neuhaus JM. *Generalized, Linear, and Mixed Models*. 2nd ed. Wiley; 2008.
- Bates D, Mächler M, Bolker B, Walker S. Fitting linear mixed-effects models using lme4. *Journal of Statistical Software*. 2015;67(1):1–48. [doi:10.18637/jss.v067.i01](https://doi.org/10.18637/jss.v067.i01)
- The [repeated-measures designs article](repeated-measures-designs.html) compares longitudinal design and analysis choices.
