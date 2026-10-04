---
title: Generalized estimating equations
summary: A robust method for correlated repeated and clustered outcomes that estimates population-average effects.
---

## Overview and key ideas

**Generalized estimating equations (GEE)** extend generalized linear models to
correlated data — repeated measures on the same subject or outcomes clustered
within hospitals, schools, or families — by replacing the likelihood with a set
of moment equations. The model has three pieces: the **mean structure**
(logit or linear link, as in a GLM), the **variance structure**, and a
**working correlation structure** describing how a subject's repeated
observations depend on each other (independent, exchangeable,
first-order autoregressive).

The parameter estimates answer a **population-averaged** question: "what is
the average effect of the exposure across all subjects?" The key practical
feature is robustness — with a correct mean model but a **mis-specified
working correlation**, the coefficient estimates remain consistent and the
**sandwich (robust) standard errors** remain valid. This makes GEE attractive
when the true correlation structure is unknown.

## When to use it

| Setting | Example question |
| --- | --- |
| Longitudinal binary outcome | Does a vaccination reduce the probability of infection across three seasonal follow-ups? |
| Clustered counts | Are antibiotic resistance counts per admission over a year associated with ward-level cleaning compliance? |
| Repeated binary data | Which factors predict repeated falls across quarterly home visits? |

Choose GEE when you want the **average** treatment or exposure effect in the population,
the outcome is binary or count (a GLM family), or you prefer not to commit to a subject-specific distribution.

## Assumptions and limitations

- **Correct specification of the mean model** is essential; unlike the
  covariance structure, a wrong mean model biases the estimates.
- The working correlation structure need not be correct for valid inference,
  but a poor choice reduces **efficiency** — wider standard errors, fewer
  events detected for the same sample.
- GEE handles **missing data as complete cases by default** in most
  implementations; unlike mixed models it does not naturally exploit the
  likelihood for missing-at-random data, so attrition can bias results.
- With a small number of clusters, the sandwich variance can be
  anti-conservative; small-sample corrections are needed.
- Inference is about the population average, not about any individual
  subject; do not quote a GEE coefficient as an individual-level prediction.

## Worked example

In a cohort of 300 elderly residents followed for a year with quarterly
assessments (1,200 person-observations), researchers ask whether a new
balancing programme reduces the odds of falls between visits. A GEE with a
logit link and exchangeable working correlation gives, for programme
participation, an odds ratio of 0.62 (95% CI 0.47 to 0.82, robust SE):
participating residents had, on average across the population, 38% lower odds
of falling in a given quarter, independent of their own previous fall history.
The exchangeable structure assumed equal correlation between any pair of a
person's visits; even if the true correlation decays with time (autoregressive
would be closer), the coefficient and its robust SE remain valid — only
efficiency is at stake.

## Interpretation and common pitfalls

- **Population-averaged versus subject-specific**: a GEE odds ratio and a
  mixed-model (logistic random-effects) odds ratio for the same data can
  differ numerically, even with the same mean model; the GEE ratio describes
  the marginal, across-the-population association. Do not mix the two
  estimands in one sentence.
- Trusting the **model-based** standard errors that come with some GEE
  software defaults: the valid ones are the robust/sandwich versions —
  verify which was printed.
- Treating a poor working-correlation choice as an error: it affects
  efficiency, not validity of the robust SE, as long as the mean model is
  right and clusters are reasonably sized.
- Applying GEE to data with only one or two observations per subject while
  treating the subject as a cluster — the correlation estimate is then
  unstable; consider modelling the clustering factor directly instead.

GEE targets a population-averaged mean, which generally differs from a subject-specific effect in a nonlinear model such as logistic regression. The sandwich variance is asymptotically robust to a misspecified working correlation when the mean model is correct and the number of independent clusters is sufficiently large; with few clusters, ordinary sandwich intervals can be too narrow. Consider small-sample corrections or cluster-level methods, and report the number and size distribution of clusters. GEE handles within-cluster correlation, not confounding caused by cluster assignment or informative cluster size.

## References and further reading

## Marginal models and the estimating equation

## GEE compared with mixed models

## Complete binary-outcome example

Suppose a randomized study measures symptom resolution at three visits. A marginal logistic GEE with visit as a factor, treatment, and treatment-by-visit interaction estimates population-average odds at each visit. If the interaction coefficient at week 4 is −0.30, the week-4 treatment odds ratio relative to control is \(e^{-0.30}=0.74\), conditional on included covariates in the marginal mean model. This does not mean 26 percentage points fewer symptoms; convert to standardized predicted probabilities for absolute interpretation. If control prevalence is 40%, the corresponding intervention probability cannot be calculated from the OR without a baseline risk and specified covariate pattern.

```r
library(geepack)
dat$visit_f <- factor(dat$visit)
gee_fit <- geeglm(resolved ~ treatment * visit_f + baseline_score,
                  id = participant, waves = visit, data = dat,
                  family = binomial("logit"), corstr = "exchangeable")
summary(gee_fit)
```

Inspect factor reference levels so the interaction contrasts map to intended visits. The robust SE is clustered by `participant`; if clinic-level assignment or dependence exists, the independent cluster may instead be clinic. If there are few clinics, standard sandwich Wald tests are not reliable. Predicted probabilities should be averaged over a stated covariate distribution; use a bootstrap resampling independent clusters to obtain intervals when feasible.

## Working correlation selection and QIC

Independence is a valid working choice for coefficient consistency under a correct marginal mean and enough independent clusters, though less efficient when within-cluster correlation is strong. Exchangeable is parsimonious for roughly constant correlation; AR(1) fits ordered equally spaced visits; unstructured is flexible but can be unstable. Compare empirical within-cluster residual correlations with assumed structures and assess convergence. QIC is an adaptation of an information criterion for GEE, but differences should be modestly interpreted and not used to fish for the smallest p-value.

Sensitivity analysis can compare coefficients under plausible structures. If estimates change materially, investigate mean-model misspecification, influential clusters, few-cluster behavior, and missingness rather than declaring the preferred structure solely by QIC. Report both robust and model-based standard errors if the working covariance is central to efficiency claims.

GEE treats clusters as independent sampling units and specifies the marginal mean directly; it does not estimate a distribution of subject-level random effects. A generalized linear mixed model includes random effects and typically yields subject-specific coefficients conditional on those effects. For logistic models, conditional odds ratios are often farther from one than marginal odds ratios even absent confounding because odds ratios are non-collapsible. To compare models, translate both to marginal predicted risks over the same covariate distribution rather than comparing raw coefficients. GEE is attractive when the population-average estimand is primary and there are enough clusters; mixed models can be useful with small numbers of clusters or for individual trajectory prediction, subject to their assumptions.

## Unequal observation counts and informative cluster size

Classical GEE solves an estimating equation summed over clusters, which gives each cluster a contribution influenced by its size and covariance. When larger clusters systematically have different outcomes, the implied estimand may be observation-weighted rather than cluster-weighted. Decide whether the target is the average person or average cluster. Weighted GEE can target a desired population, but weights and robust variance must account for design and observation processes. Report cluster-size distribution and assess whether cluster size predicts outcome.

## Robust variance and finite samples

The sandwich estimator has the form (M^{-1}BM^{-1}), with (M) the model-based bread and (B) the empirical cluster score meat. Its validity relies on independent clusters and asymptotics in the number of clusters. With few clusters, the meat is noisy and standard normal references can give anti-conservative tests. Bias-corrected sandwich estimators, t references, and permutation/randomization inference can improve calibration in specific settings. Choose corrections before examining significance and report the number of independent clusters prominently.

For longitudinal data with few participants but many visits, participants—not visits—are the independent units; repeated measurements do not create more independent clusters. Conversely, in a multicenter trial, clinic may be the independent cluster if treatment was assigned by clinic. A robust covariance estimator handles only the dependence represented by the cluster identifier; multiway dependence may need specialized methods.

## Model-based contrasts and missingness

## GEE result interpretation checklist

## Robust standard errors and confidence limits

## Data validation before fitting

### Reporting checklist

Describe the population-average mean model, link, interaction structure, working correlation, cluster definition/count, missing-data handling, and robust or model-based covariance. For binary endpoints, provide marginal predicted probabilities in addition to odds or ratios when possible. Include visit-specific denominators, cluster-size range, and small-sample correction if used. This lets readers distinguish model coefficient meaning from the covariance device used for valid inference.

Confirm one record per planned cluster-time observation, valid ordering, unique participant-visit keys, and consistent cluster identifiers. Check whether visit values encode equal spacing if using AR(1); missing visits should not cause later waves to be renumbered as adjacent without justification. Tabulate cluster counts and sizes, outcome prevalence by visit and treatment, and complete/incomplete patterns. Sparse binary outcomes can make working correlations and regression unstable even with many rows. Fix factor reference levels and inspect design-matrix columns for rank deficiency before interpretation.

For reproducible analysis, retain the model call, software/package versions, convergence messages, and covariance type. Report how clustering maps to randomization and sampling; a technically successful fit can still use the wrong independent unit.

GEE software may report both naive/model-based and robust/empirical standard errors. The robust estimate is usually the primary inferential choice when the working correlation is viewed as a convenience; the model-based estimate can be more efficient if correlation specification is correct. With few clusters, neither asymptotic z tests nor the nominal sandwich interval should be trusted without small-sample correction. Report the covariance estimator and degrees of freedom. For risk ratios, exponentiate coefficient and log-scale interval; for marginal probability contrasts, calculate interval on the probability scale using delta method, bootstrap, or simulation from coefficient covariance.

Convergence and positive-definiteness warnings matter. An unstructured working correlation may be singular with sparse visit patterns. Reduce complexity or use a simpler prespecified structure, then show sensitivity. Missing visit patterns can mean a nominal AR(1) correlation is estimated from different subsets at different lags; document the pattern and check robust conclusions.

Translate link-scale estimates before clinical interpretation. For an identity link, the coefficient is an additive mean difference; for a log link, exponentiation gives a ratio; for a logit link, exponentiation gives an odds ratio. With an interaction, main effects refer to the reference category of other variables. Report the modeled visit, treatment contrast, covariate standardization, working correlation, robust/model-based SE, and independent cluster count. For binary outcomes with common events, accompany ORs with marginal risks and risk differences.

```r
library(marginaleffects)
avg_predictions(gee_fit, variables = "treatment", by = "visit_f")
avg_comparisons(gee_fit, variables = "treatment", by = "visit_f")
```

Prediction helpers may not automatically incorporate every covariance/design nuance for a GEE object. Validate package support and use cluster bootstrap or delta-method calculations based on the sandwich covariance for final intervals. The contrast must average predictions over a stated target population; using the sample average is not equivalent to a survey-weighted target unless weights are included.

## Independence and cluster count

The number of participants is not the asymptotic sample size for GEE if they are correlated within clinics or families. A study with 2,000 patients in six clinics has only six independent clusters for a clinic-level intervention. Robust sandwich SE may be badly biased with so few units. Use small-sample corrections validated for the design, randomization inference aligned to cluster assignment, and cautious degrees-of-freedom methods. Report cluster size range, intracluster correlation estimates where meaningful, and sensitivity to influential clusters.

For nonlinear links, interaction coefficients are not equal to interaction contrasts on the probability scale. Derive predicted population means for each treatment-time combination and calculate contrasts on the intended scale. Use delta-method or bootstrap intervals, accounting for clustering. The coefficient for time in a model with treatment-by-time interaction is the change in the reference arm, not the overall mean trend.

Ordinary GEE can use complete observed outcome records when missingness is MCAR, but MAR dropout depending on prior outcomes can bias estimates. Weighted GEE models the probability of observing each response given measured past information; stabilized weights reduce variance but do not cure lack of positivity. Multiple imputation can preserve associations if its model respects treatment, time, cluster, and nonlinearities. MNAR sensitivity analysis should vary assumptions about outcomes after dropout rather than declare MAR from observed data alone.

### Choosing a link for a binary outcome

With a logit link, a GEE coefficient is a marginal log odds ratio conditional on covariates in the mean model. A log link targets a marginal risk ratio but may yield fitted means above one and numerical convergence problems. An identity link directly targets a risk difference but imposes probability bounds that can be hard to satisfy. Modified Poisson estimating equations with robust covariance are a common route to risk ratios, but check fitted values and make the target population clear. For policy decisions, standardized marginal risks and their difference may be more transparent than any link-scale coefficient.

Model-based covariance gains efficiency when the working structure is correct; empirical sandwich inference is robust asymptotically but often conservative or anti-conservative with few clusters. A small-sample correction and suitable degrees of freedom can help, but no correction creates information absent from a design with very few independent units. In a cluster randomized trial, randomization-based analyses at the cluster level provide a useful sensitivity analysis.

For cluster \(i\), GEE specifies a marginal mean \(g(\mu_{ij})=X_{ij}^T\beta\) and a working covariance \(V_i=A_i^{1/2}R_i(\alpha)A_i^{1/2}\). The estimating equation sums \(D_i^TV_i^{-1}(Y_i-\mu_i)=0\), where \(D_i=\partial\mu_i/\partial\beta\). If the mean model is correct and clusters are independent, the sandwich covariance can remain consistent even when the working correlation is wrong, as the number of independent clusters grows. Robust standard errors do not rescue a misspecified mean, dependent clusters, or very few clusters.

The coefficient is population-average (marginal), unlike a generalized linear mixed model's conditional subject-specific coefficient. For nonlinear links, these differ even when both models are correctly specified. Choose based on the scientific question: average population change versus conditional trajectory among individuals with the same random effect. For a binary outcome with a logit link, exponentiated GEE coefficients are marginal odds ratios under the model; with an identity link they are marginal risk differences, though convergence and bounds require attention.

## Working correlation and small-sample inference

Independence, exchangeable, autoregressive, and unstructured working correlations are common. Exchangeable assumes a common within-cluster correlation; AR(1) assumes correlation decays geometrically with time lag; unstructured estimates all pairwise correlations and can be parameter hungry. The robust sandwich estimator protects asymptotically against working-correlation misspecification, while model-based standard errors rely more heavily on the working structure. QIC may guide comparison but should not replace scientific reasoning or validation.

```r
library(geepack)
dat <- dat[order(dat$id, dat$visit), ]
fit <- geeglm(outcome ~ treatment * visit + age,
              id = id, waves = visit, data = dat,
              family = gaussian, corstr = "ar1")
summary(fit)
```

For binary data use `family = binomial`; choose a link that matches the estimand. `id` must identify independent clusters, and `waves` must correctly encode ordered observation times. Do not use a participant ID as cluster if households or clinics induce additional dependence; the highest relevant independent sampling unit may be the cluster. If clusters are few, the sandwich estimator is downward biased; consider small-sample corrected variance, a t reference with cluster-based degrees of freedom, or cluster-level randomization inference. With only a handful of clusters, ordinary GEE inference is unreliable regardless of the number of individuals per cluster.

## Missing visits, unequal cluster size, and diagnostics

Standard GEE generally uses available outcome records and is consistent under MCAR or certain covariate-dependent observation mechanisms when the mean model is correct. If follow-up depends on unobserved outcomes after conditioning on observed history, ordinary GEE can be biased. Inverse-probability weighted GEE can address observed-history-dependent dropout with correctly specified observation probabilities and positivity. Multiple imputation is another option, but imputation models must preserve cluster and longitudinal structure. Informative cluster size—where cluster size relates to outcome—changes the implicit weighting and may require a size-weighted or cluster-average estimand.

Inspect fitted means, residual patterns over time, leverage, convergence, and the empirical correlation structure. Ensure all modeled time interactions are interpretable; a linear time term assumes a constant change on the link scale. For irregularly spaced visits, AR(1) by visit index may be wrong; use elapsed time or a suitable covariance model. Report link, mean structure, working correlation, cluster count and size distribution, missingness method, and whether standard errors are robust or model-based.

- Liang KY, Zeger SL. Longitudinal data analysis using generalized linear models. *Biometrika*. 1986;73:13–22. https://doi.org/10.1093/biomet/73.1.13
- Mancl LA, DeRouen TA. A covariance estimator for GEE with improved small-sample properties. *Biometrics*. 2001;57:126–134. https://doi.org/10.1111/j.0006-341X.2001.00126.x
- Hardin JW, Hilbe JM. *Generalized Estimating Equations*. 2nd ed. Chapman & Hall/CRC; 2013.

- Liang KY, Zeger SL. Longitudinal data analysis using generalized linear models. *Biometrika*. 1986;73:13–22. [doi:10.1093/biomet/73.1.13](https://doi.org/10.1093/biomet/73.1.13)

- Diggle P, Heagerty P, Liang K, Zeger S. *Analysis of Longitudinal Data*.
  Oxford University Press.
- Liang K, Zeger S. Longitudinal data analysis using generalized estimating
  equations. *Biometrics* 1986;42:1056-1070.
- Agresti A. *Categorical Data Analysis*. Wiley.

*The "Mixed-effects models" article develops the subject-specific
counterpart to the population-averaged perspective used here.*
