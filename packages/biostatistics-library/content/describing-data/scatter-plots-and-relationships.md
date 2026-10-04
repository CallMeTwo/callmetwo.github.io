---
title: Scatter plots and relationships
summary: Plotting two continuous variables together to judge the direction, strength, form and outliers of an association.
---

## Overview

A scatter plot displays paired values of two quantitative variables, one point per independent unit, so readers can inspect form, direction, spread, clusters, and unusual observations. It is a first step whenever an analysis concerns association or prediction. Correlation compresses a relationship into a number; the plot can reveal nonlinearity, heteroscedasticity, outliers, and mixtures that a correlation hides.

## Constructing a useful plot

Assign the explanatory variable to the horizontal axis and response to the vertical axis when a direction is meaningful; label variables and units. Use transparent points or jitter when values overlap. For large datasets, hexbin or density summaries can show point concentration. Avoid decorative 3D perspective that obscures coordinates. Axis limits should show the relevant range without cropping observations in a misleading way.

```r
plot(dat$age, dat$systolic_bp,
     xlab = "Age (years)", ylab = "Systolic blood pressure (mmHg)",
     pch = 19, col = grDevices::adjustcolor("navy", alpha.f = .35))
abline(lm(systolic_bp ~ age, data = dat), col = "firebrick", lwd = 2)
```

A fitted straight line is a model summary, not proof that the relation is linear. Add a smoother as an exploratory guide and compare with a clinically motivated model.

## Patterns that matter

A positive trend means larger x tends to accompany larger y; negative means the reverse. Curvature suggests that a linear coefficient may average distinct local relationships. A fan shape indicates variance changes with x. Clusters can represent sites, repeated measures, or subpopulations; distinguish them by color or facet when known. A single influential point can dominate Pearson correlation and regression slope; investigate its provenance and influence.

Correlation r measures linear association and is invariant to units but sensitive to outliers and range restriction. Spearman correlation measures monotonic rank association and can detect nonlinear monotone patterns, but neither correlation implies causation. A zero Pearson r can coexist with a strong U-shaped relation. Always inspect the graph.

## Confounding, clustering, and repeated measurements

A pooled scatter plot may show a strong trend because groups differ in both variables even when within-group relationships are weak or reversed. Color by important strata and distinguish within- from between-group associations. Repeated observations from one patient are not independent points; connect trajectories or use mixed models/cluster-aware inference. A scatter plot alone does not adjust for confounding or identify a causal effect.

### Transformations and regression

Log transformations can linearize multiplicative relationships or stabilize spread, but change the scale and interpretation. A log-y model interprets coefficients multiplicatively after appropriate retransformation. Splines and generalized additive models can represent smooth nonlinearity; interaction terms can allow slopes to vary by group. Choose complexity based on design, sample size, and prior knowledge, not to chase a visually perfect fit.

### Reporting and interpretation

Describe whether the pattern appears linear, monotone, curved, or heterogeneous; report sample size and any transformation or grouping. If estimating association, give slope or correlation with uncertainty and clarify adjustment. In observational data, avoid causal language unless the design and assumptions support it. A visual relationship is a hypothesis-generating description, not a test of mechanism.

## Correlation is a summary, not a picture substitute

Pearson’s correlation r=Cov(X,Y)/(SD(X)SD(Y)) measures linear association on a −1 to 1 scale. It changes with influential observations and range restriction. Spearman’s rho is Pearson correlation of ranks and summarizes monotone association, handling some nonlinear patterns but not arbitrary curves. Kendall’s tau relates to concordant and discordant pairs. None is a universal measure of “strength”; choose based on scale and association form.

```r
with(dat, cor.test(age, systolic_bp, method = "pearson"))
with(dat, cor.test(age, systolic_bp, method = "spearman", exact = FALSE))
```

A correlation can be near zero for a U-shaped relation because positive and negative slopes cancel. A high correlation can be driven by a common time trend or group separation. Plot the data, check nonlinearity and clusters, and report uncertainty. Correlation is symmetric, whereas regression distinguishes predictor and response; neither alone implies causality.

## Regression line and residual structure

A simple linear regression models E(Y|X)=β₀+β₁X. The slope estimates expected change in Y per unit X; the intercept may have no clinical meaning if X=0 is outside the observed range. Residuals are observed minus fitted values. Plot residuals against fitted values and X to look for curvature, fan-shaped variance, and clusters. A high R² does not validate linearity or independence.

A nonlinear trend can be modeled with restricted cubic splines or generalized additive models. Avoid categorizing a continuous predictor just to create groups; categorization loses information and induces arbitrary thresholds. If the scientific question is a threshold, prespecify and justify it.

### Confounding and group structure

Suppose age and blood pressure both differ by clinic. A pooled positive slope may reflect older clinics having higher average pressure, even if within-clinic association is weak. Color points by clinic, examine within-group patterns, and fit multilevel or fixed-effect models when appropriate. A confounder may create or mask a relationship. Causal interpretation requires temporal ordering and assumptions beyond the scatter plot.

Repeated measures create trajectories rather than independent points. Connect observations from each person, color trajectories by treatment, or display subject-specific summaries. Use mixed models or cluster-robust inference for formal analysis. Treating every visit as a separate independent dot exaggerates sample size.

## Measurement error and range restriction

Error in X generally attenuates a simple regression slope toward zero under classical assumptions. Measurement error in Y increases residual variability and reduces precision. Restricting inclusion to a narrow age or severity range can weaken correlation despite a real association in the target population. Report measurement reliability and eligibility restrictions; a visual scatter plot cannot recover unobserved range.

## Plot ethics and reporting

Do not truncate axes in ways that exaggerate association. Show units, sample size, transformations, and any excluded observations. If transparency alpha, jitter, or smoothing is used, explain enough to reproduce it. Highlighting subgroups should be based on prespecified or clearly exploratory factors. Report the association estimate and interval, model form, and adjustment set. A plot reveals patterns; the study design governs interpretation.

### A worked interpretation of a nonlinear pattern

Suppose age and a biomarker rise together through middle age and then flatten. A Pearson correlation may be positive but a linear slope overstates the relation in older participants. A scatter plot with a LOESS curve can reveal the bend. A spline model can estimate a smooth conditional mean, with uncertainty bands; avoid interpreting each bend as a biological threshold unless replicated. Center age for interpretable coefficients and show the observed range so extrapolation is not implied.

```r
plot(dat$age, dat$marker, pch = 16,
     col = adjustcolor("darkgreen", alpha.f = .25))
lines(lowess(dat$age, dat$marker), col = "black", lwd = 2)
# For formal flexible modeling, use splines or a GAM and inspect diagnostics.
```

LOESS is descriptive and can behave poorly near boundaries or in sparse regions. It does not adjust for confounders. Formal inference needs a prespecified model and uncertainty method.

### Range restriction and selection

Eligibility criteria may truncate one variable’s range, attenuating correlation and altering regression slopes. Conditioning on a selection variable affected by both X and Y can induce an association even if none exists in the source population. A scatter plot of enrolled participants describes the selected sample; transport to a broader population requires understanding selection mechanisms.

### Time trends and spurious association

Two variables that both trend over calendar time can correlate strongly even if unrelated at the individual level. Plot against time and examine detrended or within-period associations. For repeated data, account for autocorrelation and subject clustering. A high r is not evidence of a direct mechanism.

## Correlation uncertainty and inference

A confidence interval for Pearson correlation typically relies on a Fisher z transform, with assumptions of independent pairs and approximate bivariate normality for exact properties. Bootstrap intervals can be used for nonnormal data, but resample independent units and preserve clusters. Spearman correlation inference is often asymptotic or permutation-based. Report n and interval; a correlation estimate from a narrow range may have little transportability.

```r
cor.test(dat$x, dat$y, method = "pearson")
cor.test(dat$x, dat$y, method = "spearman", exact = FALSE)
```

The test of zero correlation is not a test of no association of any form. A U-shaped relationship can have zero Pearson correlation. A nonlinear model or visualization may be needed to describe it.

### Regression diagnostics and influence

A high-leverage point has unusual predictor values; an influential point materially changes a fitted estimate. Cook’s distance and DFBETAs can screen influence, but no threshold is an automatic exclusion rule. Verify data, fit sensitivity analyses, and state whether conclusions change. Heteroscedasticity-consistent SEs can address variance misspecification but do not correct nonlinear mean structure or influential predictor errors.

### Avoid ecological fallacy

A scatter plot of clinic-level averages describes between-clinic association. It does not establish that individuals with higher X have higher Y. Aggregation can reverse or obscure individual relationships. Label the unit, and do not translate group-level slopes to patient-level claims without multilevel data and assumptions.

### A relationship can change by scale

A linear association on the raw scale may be multiplicative on the log scale. For positive biomarker concentrations, a one-unit predictor increase could correspond to a fixed ratio rather than a fixed absolute increment. Log transformation can linearize such a relation, but coefficients then describe proportional change. Plot both scales and use residual diagnostics to select a model that fits and answers the scientific question.

For bounded outcomes, a straight line can predict impossible values. Binary outcomes need logistic or other appropriate models; proportions may need binomial denominators. The scatter plot remains useful for visualizing data, but the model should reflect outcome support.

### Sampling and measurement quality

Association estimates can be distorted by measurement error, restricted range, assay batches, and differential missingness. Plot color by batch or site when relevant; an apparent cluster may be technical rather than biological. Replicate measurements can quantify reliability. If measurement error is substantial, regression calibration or errors-in-variables models may be needed.

### Communicating the plotted analysis

State the number of independent units, any repeated observations, transformations, fitted model, and covariate adjustment. Avoid describing a smooth line as causal. If an exploratory plot motivates a nonlinear term or subgroup, label that decision and validate. Transparency about smoothing parameters and point handling supports reproducibility.

### Correlation and prediction are different goals

A scatter plot may show strong association but poor prediction if residual variability is large. Conversely, a modest association can improve prediction in a large dataset. Evaluate predictive performance with validation, calibration, and prediction intervals; do not use in-sample r or R² as proof of clinical utility. Causal inference asks yet another question and needs design assumptions.

### Effect modification

Plot separate smooths by a prespecified modifier when scientifically motivated. A common slope can conceal differing associations. Estimate an interaction and interval rather than comparing visual significance or separate p-values. Continuous modifiers should generally remain continuous; arbitrary categorization wastes information and can create misleading subgroup patterns.

### Report scope

State whether the plot is individual-level or aggregate, cross-sectional or longitudinal, and whether points are independent. Clarify that association is descriptive unless causal assumptions are defended. This protects readers from ecological and temporal interpretations the graph cannot support.

### Limits of visual inference

A visually steep slope can reflect a handful of influential points, a confounder, or a narrow selected sample. Overlay raw observations, inspect strata, and fit a model suited to the scale. Report uncertainty and avoid causal claims based on the plot alone.

### Worked correlation interpretation

Suppose Pearson r=.62 between age and systolic pressure among 500 clinic patients. This describes a positive linear association in the sample, not the expected increase per year and not a causal effect. A regression slope with units estimates change in mean pressure per year under a linear model; adjustment for sex, medication, and clinic changes the conditional estimand. The interval for r or slope reflects sampling uncertainty but not selection from attending the clinic.

If the cohort excludes treated hypertensive patients, range restriction can attenuate or distort the relation. If blood pressure is measured more often in high-risk patients, observation processes can induce selection. Explain sampling and measurement alongside the graph.

### Smooths and overfitting

A very flexible smoother can follow noise, especially in sparse tails. Choose degrees of freedom or bandwidth with scientific knowledge and validate patterns. Show uncertainty bands and rug marks to reveal data density. Do not extrapolate beyond observed predictor range. A smooth is an exploratory aid unless its form was prespecified and inference accounts for selection.

### When the plot is categorical or repeated

For a binary variable paired with a continuous measure, jittering binary x values can show distributions but grouped violin/box plots may be clearer. For ordinal predictors, use ordered categories and do not assume equal spacing without rationale. With many repeated observations, connect within-subject points or facet subjects; random scatter can hide autocorrelation and subject-level trends.

### Reproducibility

Record any excluded points, transformations, smoothing methods, and grouping variables in code. A graph should be regenerated from source data rather than manually edited to remove inconvenient observations. Keep visual exploratory choices distinct from confirmatory model choices.

### Regression to the mean

When participants are selected because X is unusually high, a later measurement of X often moves closer to its long-run mean even without treatment. A scatter plot of baseline versus follow-up can show association but does not separate natural regression from intervention effects. Use a concurrent control group and baseline-adjusted analysis. A pre/post correlation or slope is not a causal treatment effect.

### Collinearity and multivariable relationships

Pairwise plots can reveal strong correlations among predictors, but multicollinearity concerns the design matrix across several predictors. It inflates coefficient uncertainty and can make conditional associations unstable even when overall prediction remains good. Use correlation matrices, variance-inflation diagnostics, and subject-matter selection; do not remove clinically essential confounders solely to reduce a diagnostic number.

### Final interpretation

A scatter plot exposes the shape and quality of a two-variable relationship, but it does not estimate causality or prove model assumptions. Identify independent units, reveal clusters, inspect nonlinearity and influence, and pair the graph with a model and interval suited to the outcome scale. State sampling limits and transformations before drawing substantive conclusions.

### More than two variables

A scatterplot matrix can reveal pairwise patterns among several measures, but it scales poorly and cannot show every conditional relation. Color by one prespecified factor and supplement with model-based diagnostics. High-dimensional exploratory plots invite multiplicity; treat discovered patterns as hypotheses to validate. Avoid inferring a multivariable relationship from a collection of marginal scatter plots.

### Annotation and accessibility

Label axes with variable name and units, use readable point size and contrast, and ensure groups remain distinguishable in grayscale. Include a legend and note sample size. If points are jittered, state that positions are visually perturbed and do not represent exact measurements.

### Missing data in bivariate plots

A scatter plot usually includes only pairs observed on both variables. If missingness depends on severity or the other variable, the visible cloud can be selected and misleading. Report the number of complete pairs and summarize missingness. Imputation or weighting may support analysis under assumptions, but the plot should distinguish observed from imputed values when those are displayed.

### Units and standardization

Standardizing axes can help compare variables measured on different units but removes direct clinical scale. Keep original units in the primary plot when possible. A standardized slope depends on both variables’ SDs and can change across populations. State whether axes were transformed or standardized.

A report should distinguish a marginal association from an adjusted regression relationship. The marginal plot shows observed pairs; the adjusted coefficient is conditional on modeled covariates and may differ. Explain the target rather than implying that the graph displays the adjusted result.

For very large samples, point density can obscure the relationship; use transparency, hexagonal bins, or a density layer and retain a readable scale. For modest samples, raw points make outliers and clustering visible. Avoid smoothing away the observations that determine the fitted trend.

State the sampling unit and number of independent pairs in every analysis so visual point count is not mistaken for independent information.

A scatter plot’s apparent strength also depends on axis limits and selected range; always expose the observed data span and avoid extrapolated visual claims.

If axes are transformed, explain the resulting slope scale and avoid reading transformed distances as raw-unit differences.

Point transparency should preserve visibility in dense regions without making sparse points disappear; state if jitter was applied.

State whether the plot is a sample description, diagnostic check, or model-supported estimate.

For categorical groups overlaid on a scatter plot, use shape and color together and provide a legend; accessible design helps readers distinguish strata without relying on color alone.

## References and further reading

- Bland JM, Altman DG. [Statistical methods for assessing agreement between two methods of clinical measurement](https://doi.org/10.1016/S0140-6736(86)90837-8). *Lancet*. 1986.
- Schober P, Boer C, Schwarte LA. [Correlation coefficients: appropriate use and interpretation](https://doi.org/10.1213/ANE.0000000000002864). *Anesth Analg*. 2018.

- Bland M, Altman DG. *Statistics with Confidence*. BMJ Books.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Fox J. *Applied Regression Analysis and Generalized Linear Models*. Sage.

Confidence intervals for regression and association are developed in the
library's inference articles.
