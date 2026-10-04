---
title: Generalized estimating equations
summary: Estimate population-average effects for correlated outcomes using a mean model and robust sandwich variance, while choosing a defensible working correlation.
---

## Overview

Generalized estimating equations (GEE) extend generalized linear models to repeated or clustered outcomes. They model the marginal mean directly and use a working correlation to improve efficiency while accounting for within-cluster dependence. The robust sandwich variance can remain consistent if the mean model is correct and there are enough independent clusters, even when the chosen working correlation is wrong.

GEE estimates population-average, or marginal, associations. This differs from subject-specific effects in generalized linear mixed models, which condition on latent random effects. The distinction matters most for nonlinear links such as logistic regression. GEE is attractive when the scientific question concerns average response across a population and the number of independent clusters is reasonably large.

## Mean model and estimating equations

Let cluster (i) contribute outcome vector (Y_i), covariates (X_i), and mean vector \(\mu_i\). A link function relates mean to predictors: \(g(\mu_i)=X_i\beta\). GEE solves estimating equations of the form \(\sum_i D_i^T V_i^{-1}(Y_i-\mu_i)=0\), where (D_i) is the derivative of the mean with respect to coefficients and (V_i) is a working covariance built from marginal variances and a correlation structure.

The working correlation may be independence, exchangeable (common within-cluster correlation), autoregressive (correlation declines with lag), or unstructured. If the mean model is correct, the robust sandwich variance protects inference against a misspecified working correlation asymptotically. The model is not robust to a wrong mean structure, informative cluster size under ordinary assumptions, or too few independent clusters.

Suppose 200 patients each have blood pressure measured at baseline, 3, 6, and 12 months. An identity-link GEE with time, treatment, and time-by-treatment terms estimates the average treatment-group difference at each time. An exchangeable working correlation assumes all within-person pairs correlate equally. An AR(1) structure assumes nearby visits are more correlated. The robust standard errors account for repeated measures within each patient.

```r
library(geepack)
fit <- geeglm(bp ~ treatment * factor(visit) + baseline_bp,
              id = patient_id, data = long_dat,
              family = gaussian(), corstr = "ar1")
summary(fit)
```

Rows must be sorted by cluster and visit for some correlation structures. `id` must identify independent clusters; if patients are clustered within clinics and treatment assigned by clinic, the independent unit is clinic and additional nesting must be handled. This code is illustrative; define the target contrast and visit coding before fitting.

## Marginal versus subject-specific interpretation

For an identity-link Gaussian model, marginal and conditional mean contrasts often align under common structures. For logistic outcomes, they differ because odds ratios are noncollapsible. A GEE coefficient for treatment is a population-averaged odds ratio, while a mixed-effects logistic coefficient is conditional on the random effect and usually farther from 1. Neither is universally preferred; choose based on the target question.

Suppose a logistic GEE yields treatment OR 0.75. This compares population-averaged odds across treatment groups, conditional on included covariates in the marginal mean model. It does not mean 25% lower risk. If outcome prevalence is common, OR can differ substantially from risk ratio. Report standardized risks or risk differences when those are more interpretable. For a cluster-randomized trial, clarify whether the estimand is an average individual effect or average cluster effect, since cluster size may affect weighting.

## Choosing a working correlation

Independence is a valid starting choice when robust variance is used and the mean model is right; it may lose efficiency if correlation is strong. Exchangeable is parsimonious and useful for roughly equal correlations within a cluster. AR(1) is appropriate for equally spaced repeated measures with stronger correlation at nearby visits. Unstructured estimates a separate correlation for each pair and requires many clusters relative to visit count; it can be unstable.

Use subject-matter understanding and data structure rather than choosing correlation solely by a fit statistic. QIC can compare GEE models but is not directly equivalent to likelihood AIC and should not replace design reasoning. Robust and model-based standard errors can be compared: large differences suggest correlation misspecification or finite-sample concerns. Report the chosen structure and why.

Missing visits do not automatically invalidate GEE if the missingness process is appropriately independent of unobserved outcomes conditional on modeled history, but ordinary GEE is generally biased under informative dropout. Weighted GEE can use inverse probability of observation weights under a correctly specified observation model and positivity. Multiple imputation or likelihood methods may be more suitable depending on the estimand and missingness pattern.

### What robust variance does and does not protect

The sandwich variance has a “bread” from the estimating-equation sensitivity and a “meat” from empirical cluster residuals. It allows the within-cluster covariance used in fitting to be wrong while preserving asymptotic variance consistency when clusters are independent and the marginal mean is correct. It does not protect against a wrong link, omitted interaction, informative missingness, or dependence across clusters. With few clusters, the empirical meat itself is noisy, hence small-sample corrections.

Model-based standard errors assume the working covariance is correctly specified and may be more efficient if that assumption holds. Robust standard errors are often called empirical or Huber–White sandwich estimates. State which one is reported. If working and robust standard errors differ substantially, investigate rather than choose the smaller value. A cluster bootstrap can be used for sensitivity when the number of clusters supports it, resampling whole independent clusters.

The number of repeated measurements is not the asymptotic replication count. For 20 patients with 10 visits each, there are 20 independent clusters, not 200 independent observations. Similarly, in a cluster-randomized trial with 10 sites and 500 participants, only 10 independent treatment assignments inform the treatment contrast. Robust variance needs enough such units for reliable inference.

## Missing data and observation weights

Ordinary GEE typically requires a form of missing completely at random or conditional independence of missingness for consistent estimation, depending on the model and pattern. If dropout depends on prior observed outcomes, complete-case GEE may be biased because the observed visit-specific mean is no longer the target population mean. Likelihood-based mixed models can use incomplete trajectories under MAR; multiple imputation can preserve uncertainty; weighted GEE can reweight observed records to represent those with similar measured histories.

For weighted GEE, estimate (\pi_{ij}=P(R_{ij}=1\mid\text{observed history})) and use stabilized inverse probabilities for records observed at visit (j). The model must include predictors of both missingness and outcome, and positivity requires nonzero observation probability across relevant histories. Inspect weight distribution and effective sample size. Truncation trades variance for potential bias and should be prespecified or shown as sensitivity analysis.

MAR and independent censoring assumptions are not verified by a nonsignificant missingness test. Plan sensitivity analysis for unobserved outcomes, such as delta shifts in imputed values or selection-model parameters. Collecting outcomes after treatment discontinuation often gives more robust evidence than increasingly elaborate missing-data models.

## Interaction calculations and margins

Suppose a logistic GEE has treatment coefficient −0.30 at baseline and treatment-by-month-6 coefficient −0.25. The treatment log odds ratio at month 6 is −0.55, giving OR \(e^{-0.55}=0.58\), not 0.74. Its variance is the sum of the two coefficient variances plus twice their covariance. Obtain the linear contrast and interval from the fitted model; do not multiply or compare separate intervals. With a logit link, calculate marginal probabilities to communicate clinical impact.

For continuous outcomes, a treatment-by-time coefficient can represent additional mean change from the reference visit. State whether time is categorical or numeric. A linear time term assumes a constant change per unit time; categorical visits permit nonlinearity but use more parameters. A spline can balance flexibility and parsimony. Choose the representation based on design and scientific expectations, and show predicted trajectories.

## Cluster size and target population

The default GEE estimates an observation-weighted marginal effect: participants in larger clusters contribute more records. If cluster sizes are informative, such as larger clinics serving sicker populations, this may not equal an average-clinic effect. An equal-cluster target may use cluster-level weighting or a two-stage approach. Define whether the target is the average person, average clinic, or average future measurement before choosing weights.

Unequal cluster sizes can also affect working correlation and efficiency. Report median and range of cluster size, intracluster correlation estimate or working correlation, and number of independent clusters. For cluster trials, power and precision depend heavily on the number and size variation of clusters. A large total patient count cannot compensate fully for few randomized units.

If clinics are nested in regions and patients in clinics, decide the clustering level for robust variance based on treatment assignment and dependence. Clustering only at patient ignores shared clinic effects; clustering at clinic requires enough clinics. Multiway clustering may be appropriate for crossed structures, but small numbers in either dimension can undermine asymptotics.

## Example: binary outcome across visits

Imagine a trial with 300 participants measured at baseline and months 1, 3, and 6. The outcome is whether blood pressure is controlled. A logistic GEE models marginal probability by treatment, visit, and interaction. If treatment coefficient is (\beta_T=-0.30), then at the reference visit the population-averaged OR is (e^{-0.30}=0.74). At later visits, include interaction coefficients to calculate visit-specific contrasts; do not interpret \(\beta_T\) as the overall effect when interactions are present.

To communicate absolute effect, predict the control and treatment probabilities at each visit using the fitted marginal model and average over the target covariate distribution. If predicted control probability is 0.50 and treated is 0.43, risk difference is −7 percentage points. Include uncertainty for the standardized contrasts, often by delta method or cluster bootstrap. The OR alone hides baseline probability and can exaggerate apparent risk changes.

## Cluster size and small-sample inference

The sandwich variance relies on a large number of independent clusters, not merely a large number of rows. With 12 clinics and thousands of patients, naive robust standard errors may be too small. Use small-sample corrections, bias-reduced sandwich estimators, a t reference distribution with appropriate degrees of freedom, or randomization-based methods consistent with the design. In cluster-randomized studies, the number of randomized clinics drives information.

Unequal cluster sizes matter. Standard GEE can target an observation-weighted population average; large clusters contribute more. If the scientific target weights each cluster equally, use appropriate weighting or a cluster-level analysis. Informative cluster size, where size relates to outcome, can bias marginal interpretations. State the target and weighting scheme.

For nested data (visits within patients within sites), one cluster ID at a time may not capture all dependence. Robust variance clustered at site can account for within-site association when enough sites exist. Alternatively, use multilevel models for nested structure. Do not specify patient as independent cluster when treatment assignment or shared care occurs at site level.

## Model checks and failure modes

Check whether the mean model captures time pattern, nonlinear covariate effects, and interactions. GEE's robust variance does not fix omitted nonlinearities or wrong link. Plot observed and fitted marginal means by visit and group. Examine residuals and convergence warnings. Estimated correlations near boundaries can signal an overcomplex structure or sparse cluster patterns.

Time-varying covariates need careful temporal interpretation. A concurrent biomarker may be affected by prior treatment; adjusting for it can change the estimand or introduce bias. For causal longitudinal effects with time-varying confounding, marginal structural models may be required rather than standard GEE adjustment. For prediction, GEE can estimate marginal mean but does not provide subject-specific random effects; use an approach aligned with the use case.

For a binary model, convert coefficients to predicted probabilities and average over a clearly defined covariate distribution. For example, compare each participant's predicted outcome under active and control assignment, then average the differences. This standardization yields a marginal risk difference. Use a cluster bootstrap or delta method for uncertainty, respecting the independent cluster. Report the covariate distribution because a marginal effect depends on the target population when effects are heterogeneous.

Residual checks should examine fitted mean against observed outcomes across time and covariate ranges. A plausible working correlation does not rescue an inadequate mean structure. If visit spacing is irregular, AR(1) by row order is not an appropriate continuous-time correlation; use actual time differences or a different model. If outcomes are highly skewed, bounded, or zero-inflated, choose an appropriate marginal distribution or robust mean method.

Convergence problems can result from an overcomplex unstructured correlation with too few clusters, sparse binary outcomes, or near-singular working covariance. Simplify the structure based on design knowledge, inspect category counts, and consider independence with robust variance as a stable comparator. Report convergence warnings and sensitivity. Do not hide a warning by switching silently to another correlation.

## Alternatives and model choice

Use linear mixed models when subject-specific trajectories and cluster-level variance components are central, especially for continuous outcomes. Generalized mixed models yield conditional effects for non-Gaussian outcomes. GEE is preferred when population-average effects are primary and robust marginal inference is desired. For few clusters, small-sample corrected GEE or cluster-level randomization inference may be safer. For irregular observation times, continuous-time correlation structures or flexible time models may be needed.

GEE does not estimate a full likelihood and cannot directly use likelihood-based AIC in the usual way. QIC is one criterion but can be unstable. Compare scientific interpretation, fit diagnostics, correlation plausibility, and inferential robustness. Report whether standard errors are robust or model-based and how few-cluster adjustments were implemented.

For a Gaussian outcome with a random intercept, a linear mixed model can estimate both population mean and between-person variation. With a nonlinear link, the mixed-model coefficient is conditional on the random effect, while the GEE coefficient is marginal; comparing them as if one were simply a more robust version of the other is incorrect. If the scientific target is an individual's trajectory, random effects may be central. If it is the average population response, GEE is direct.

GEE can also be used with ordinal, count, and binary outcomes through an appropriate family and link, but estimates remain marginal. For recurrent events, a GEE count model with person-time offset may estimate average event rates while accounting for repeated counts; it does not model event-time ordering. For survival data with censoring, use survival methods rather than forcing time-to-event outcomes into a standard binary GEE.

## Reporting enough to reproduce the model

Report the independent cluster definition, number of clusters, cluster-size distribution, outcome family and link, predictors and interactions, time coding, working correlation, robust or model-based variance, finite-sample correction, and missingness approach. Give estimates with confidence intervals and state population-average interpretation. For binary outcomes, provide absolute marginal predictions or contrasts; for repeated continuous outcomes, show fitted mean trajectories.

Document software and package version, convergence diagnostics, and any departures from the planned correlation or mean structure. State how cluster size relates to the target weighting. In cluster trials, include the randomization unit and any stratification. GEE handles within-cluster correlation only within a specified mean and observation process; it is not a substitute for a clearly defined scientific estimand.

Avoid using the phrase “population average” without naming the population and weighting. An average over sampled visits, enrolled patients, or clinics can differ. State how participants with unequal numbers of observed visits contribute, and consider observation weights if follow-up is informative.

## Reporting a GEE analysis

State outcome distribution and link, marginal mean formula, cluster definition, number of clusters and sizes, repeated measurement schedule, working correlation, robust variance method, and missing-data handling. Report coefficients on a clinically interpretable scale, with intervals; for logit links, add marginal risks or risk differences where possible. Explain whether estimates are population-averaged and whether clusters are weighted by size.

For complex surveys, account for sampling weights, strata, and primary sampling units rather than applying ordinary GEE. For cluster-randomized trials, identify the randomization unit and any small-sample correction. For observational studies, define confounder adjustment and causal assumptions. GEE handles correlation; it does not by itself resolve confounding, selection, or measurement error.

When reporting a repeated binary outcome, provide visit-specific marginal probabilities alongside ORs. A change in prevalence across visits can make the same OR correspond to different absolute differences. If clinically relevant, translate the model into standardized risk difference with an interval rather than asking readers to mentally convert a conditional coefficient.

Always report the number of observed clusters after exclusions; a seemingly small data-cleaning change can materially reduce independent units and alter sandwich inference.

If cluster membership changes over time, define whether the cluster is fixed at baseline or time-updated.

Changing clusters can make simple exchangeable correlation assumptions implausible.

## References and further reading

- Liang K-Y, Zeger SL. Longitudinal data analysis using generalized linear models. *Biometrika*. 1986;73:13–22. [doi:10.1093/biomet/73.1.13](https://doi.org/10.1093/biomet/73.1.13)
- Zeger SL, Liang K-Y, Albert PS. Models for longitudinal data: a generalized estimating equation approach. *Biometrics*. 1988;44:1049–1060. [doi:10.2307/2531734](https://doi.org/10.2307/2531734)
- Hardin JW, Hilbe JM. *Generalized Estimating Equations*. 2nd ed. Chapman & Hall/CRC; 2013.
- Mancl LA, DeRouen TA. A covariance estimator for GEE with improved small-sample properties. *Biometrics*. 2001;57:126–134. [doi:10.1111/j.0006-341X.2001.00126.x](https://doi.org/10.1111/j.0006-341X.2001.00126.x)
- Zeger SL, Liang K-Y, Albert PS. Models for longitudinal data: a generalized estimating equation approach. *Biometrics*. 1988;44:1049–1060.
