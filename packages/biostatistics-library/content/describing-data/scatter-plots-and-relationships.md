---
title: Scatter plots and relationships
summary: Plotting two continuous variables together to judge the direction, strength, form and outliers of an association.
---

## Overview and key ideas

The **scatter plot** pairs each subject's value of one continuous variable (x, horizontal axis) with their value of a second (y, vertical axis), one point per subject. It is the first thing to draw whenever a question involves two continuous measures — dose and response, BMI and blood pressure, creatinine clearance and drug dose — because it shows what no single number can: the direction (positive or negative), the strength (tight or loose) and the form (linear or curved) of the relationship, plus any individual points that look anomalous.

The **Pearson product-moment correlation coefficient r** compresses a linear scatter into one number between −1 and +1: r = Σ((xi − x̄)(yi − ȳ)) / sqrt( Σ(xi − x̄)² · Σ(yi − ȳ)² ). r = +1 means every point lies on an upward straight line, r = −1 on a downward line, and r near 0 means no *linear* association. Because r summarises linearity only, a perfectly curved (U-shaped) relationship can give r ≈ 0. When the relationship is monotonic but not straight, or the data are ordinal, the **Spearman rank correlation** — Pearson r computed on the ranks — is the robust alternative.

A scatter plot is also the first look for *form*: before any regression, check whether the cloud is linear, curved, threshold-like or bunched into distinct clusters. Form determines the modelling strategy — a straight line calls for linear regression, a curve for a transformed or non-linear model, clusters for a stratified analysis. And because it is the only standard plot that shows individual subjects, it is where data-entry errors and protocol violations (an implausibly high value in a healthy volunteer) usually surface.

## When to use it

| Setting | Example question |
| --- | --- |
| Dose–response / PK–PD | Do higher measured drug levels associate with fewer infections? |
| Biomarker validation | How closely do two assays track across the measurement range? |
| Risk factor exploration | Is higher BMI associated with higher systolic pressure in this cohort? |
| Checking model assumptions | Do regression residuals scatter randomly, without curvature or a funnel? |
| Method comparison | Are two laboratory methods concordant across the whole range? |
| Exploratory analysis of a new dataset | Where are the gaps, clusters and implausible points in these two variables? |

- Always plot before computing r; the number only summarises what the plot already shows.
- Label both axes with units; one point per subject (never one point per subgroup mean, unless the unit of analysis really is the subgroup).
- Annotate the sample size and flag any removed or imputed points.

## Assumptions and limitations

- Pearson r assumes a linear relationship and, for inference (confidence intervals, tests on r), roughly bivariate normal data. Strong skew, outliers or curvature invalidate the number, though the plot still works.
- r measures association, not causation and not agreement. Two methods can correlate tightly (r = 0.9) yet disagree by a clinically important fixed offset; agreement questions need Bland–Altman analysis, not r.
- A near-zero r means "no linear relationship", not "no relationship". U-shaped, threshold and saturating patterns are invisible to r, which is why the plot always comes first.
- r is range-dependent: restricting the x-range (studying only healthy adults, say) attenuates r toward zero even when the underlying association is strong.
- A single influential point can swing r dramatically; compute r with and without suspected outliers before trusting either.
- Both variables should be measured on continuous (or at least interval) scales for Pearson r; for mixed or ordinal data the rank correlation is safer, and for binary × continuous data the question is usually better posed as a group comparison.

### Correlation, regression and agreement answer different questions

Correlation is unitless and symmetric: it describes linear co-movement, not
the expected change in an outcome per unit of exposure. A regression slope
has units and depends on which variable is assigned as outcome. For Pearson
correlation, one influential observation or restricted range can dominate the
result; inspect residuals and the scatter before relying on a p-value. In
method comparison, plot paired differences against paired means and examine
their average and limits of agreement; proportional bias may require
transformation or regression-based agreement methods. Repeated pairs from the
same patient require methods that account for within-person dependence.

## Worked example

Five patients had BMI (kg/m²) and systolic blood pressure (mmHg) of (21, 120), (23, 124), (25, 126), (27, 138), (29, 142). The means are x̄ = 25 and ȳ = 130. Deviation products: (−4)(−10) = 40, (−2)(−6) = 12, (0)(−4) = 0, (2)(8) = 16, (4)(12) = 48, summing to 116. The sums of squared deviations are Σ(xi − x̄)² = 40 and Σ(yi − ȳ)² = 360, so r = 116 / sqrt(40 × 360) = 116 / 120 ≈ 0.97.

The scatter is a tight upward line, so the number confirms a strong positive linear association: higher BMI accompanies higher systolic pressure in this sample. Two cautions attach: with only five points the confidence interval around r is wide and one patient could move it substantially, and the association is observational — it says nothing about whether weight causes the pressure rise.

If a sixth patient were added at (31, 122) — high BMI, low pressure — the same calculation would pull r sharply downward even though the original five points still sit on a line. Recomputing r after setting that patient aside is the standard check, and the lesson is general: with small samples, r is a property of the sample as drawn, not of the population.

## Interpretation and common pitfalls

- Reading correlation as causation. The plot is symmetric and r does not change if x and y are swapped; neither variable is "the cause" in the statistic.
- Citing r without the plot. r hides curvature and outliers; journals expect the scatter plot whenever r is reported.
- Using Pearson r on ordinal or skewed data. The Spearman rank correlation is more appropriate, and both should be reported if they differ.
- Confusing correlation with agreement between two measurements of the same quantity; a high r with constant bias is useless for replacing one method with another.
- Reporting r from an ecological (aggregate-level) scatter as if it applied to individuals; ecological correlations routinely differ from individual-level ones.

## Covariance, correlation, and linear regression

Sample covariance s_xy=Σ(x_i−x̄)(y_i−ȳ)/(n−1) measures joint variation and carries units x×y. Pearson correlation r=s_xy/(s_xs_y) rescales covariance to [−1,1]. It is invariant to positive changes of units but not to nonlinear transformations, range restriction, or influential observations. Correlation is symmetric in x and y; regression is directional and asks how the conditional mean of Y changes with X.

In simple least-squares regression, slope b1=s_xy/s_x² and intercept b0=ȳ−b1x̄. The slope has units of outcome per predictor unit. In the five-patient BMI/blood-pressure example, Σ cross-products is 116, Σx deviations squared is 40, so slope=116/40=2.9 mmHg per BMI unit and intercept=130−2.9(25)=57.5. The fitted line predicts 130 at BMI 25. Correlation r=.967 indicates tight linear co-movement in these five observations, but the slope and correlation are highly uncertain at n=5.

```r
bmi <- c(21, 23, 25, 27, 29)
sbp <- c(120, 124, 126, 138, 142)
cor(bmi, sbp)
fit <- lm(sbp ~ bmi)
coef(fit) # intercept 57.5, slope 2.9
summary(fit)$r.squared
```

Here R-squared equals r² only for simple linear regression with an intercept, approximately .936. The line is descriptive and not causal. Inference for slope assumes independent errors and appropriate mean/variance structure; five points cannot support strong population claims.

## Nonlinearity and transformations

Pearson r summarizes straight-line association. A U-shaped relationship can have r near zero despite a strong deterministic relation. A saturating dose-response may be monotone but nonlinear; Spearman correlation can be high while Pearson r is more modest. Neither coefficient identifies the right functional form. Use a scatter plot with a smooth trend and inspect residuals. If a nonlinear model is needed, splines or mechanistic curves may be suitable, but flexible functions require adequate data and validation.

A logarithmic axis can reveal multiplicative behavior across orders of magnitude, but changes visual distances and interpretation. State transformations and show original units when possible. A log-linear slope β corresponds to an approximate percent change of 100(exp(β)−1) in outcome per unit predictor when outcome is logged. Do not transform merely to make a correlation coefficient larger.

## Outliers, leverage, and influence

An outlier in Y has a large residual; a high-leverage point is unusual in X; an influential point materially changes the fitted model. These are distinct. A point far from x̄ can have high leverage even if it lies close to the fitted line and can dominate the slope. Examine studentized residuals, leverage, Cook's distance, and leave-one-out sensitivity, but do not delete valid observations automatically. Verify source data and report robust sensitivity analyses if a legitimate point drives conclusions.

Range restriction can attenuate correlation because the observed sample spans less variability than the source population. Referral cohorts, selected case series, and restricted eligibility criteria often create such truncation. Measurement error in either variable generally attenuates correlation under classical independent error, while shared method error can inflate it. Correlation is therefore partly a property of measurement and sampling design.

## Association, confounding, and repeated observations

An aggregate scatter of group means is an ecological association and may differ from individual-level association. Stratifying by a common cause may reveal different slopes or even a reversal, but conditioning on colliders can create spurious patterns. A scatter plot does not distinguish confounding from direct effect. Use design knowledge and causal models before interpreting a slope.

If each patient contributes repeated paired measurements, points are not independent. A pooled correlation can reflect between-person differences while within-person changes move in another direction (Simpson's paradox). Use separate within- and between-person associations or a mixed model. Plot trajectories or use distinct colors and lines per participant for a manageable sample; account for clustering in standard errors.

## Correlation is not agreement

When comparing two methods that measure the same quantity, correlation evaluates whether high values on one method accompany high values on the other. It does not assess whether values are close. If method B equals method A+10, correlation can be 1 while every pair differs by 10 units. Bland–Altman analysis plots paired difference B−A against pair mean (A+B)/2, estimates average bias, and limits of agreement mean difference±1.96 SD of differences when differences are approximately normal and constant in spread. Evaluate whether limits fit clinical tolerances; investigate proportional bias and repeated measurements.

### Worked calculation: fixed bias with perfect correlation

Let method A values be 100, 120, 140 and method B values 110, 130, 150. Pearson r=1 because B=A+10 exactly. Mean difference B−A=10, SD difference=0, so there is perfect linear correlation but a fixed 10-unit disagreement. Replacing A with B would be unacceptable if clinical limits permit only ±5 units.

```r
a <- c(100, 120, 140); b <- a + 10
diff <- b - a
c(correlation = cor(a, b), mean_bias = mean(diff),
  sd_difference = sd(diff))
plot((a+b)/2, diff, xlab = "Pair mean", ylab = "B - A")
abline(h = mean(diff), lty = 2)
```

With only three pairs, limits of agreement cannot be estimated reliably; the calculation demonstrates the concept, not a validation study. If several pairs come from the same subject, use repeated-measures agreement methods.

## Practical plotting and reporting

Plot points before computing coefficients. Use transparency or jitter for overplotting and report n. Distinguish raw association from adjusted regression, show units, and avoid extrapolating a line beyond observed data. Present confidence intervals for slope or correlation when inference is relevant and discuss sample selection, measurement error, and influential observations. For nonlinear or clustered data, choose a method that matches structure rather than forcing Pearson r.


## Inference for correlation

Under independent bivariate-normal sampling, tests and intervals for Pearson r can be derived using a t statistic t=r√[(n−2)/(1−r²)] with n−2 degrees of freedom for testing zero correlation. For interval estimation, Fisher's transformation z=atanh(r) is approximately normal with standard error 1/√(n−3); transform interval endpoints back with tanh. These approximations can be poor with strong nonnormality, outliers, or small samples. A bootstrap interval should resample independent subjects and preserve clusters when present.

For r=.97 with n=5, Fisher z=atanh(.97)≈2.09 and SE=1/√2=.707. A 95% interval on z-scale is roughly .70 to 3.48; transforming yields r around .60 to .998. The very wide range underscores why an impressive sample correlation based on five points is weak population evidence.

```r
r <- cor(bmi, sbp); n <- length(bmi)
z <- atanh(r); se_z <- 1 / sqrt(n - 3)
tanh(z + c(-1, 1) * qnorm(.975) * se_z)
```

This interval assumes bivariate normality and independent pairs. If data are clustered or repeated within patient, use cluster-aware inference. The interval does not address confounding or measurement validity.

## Correlation and regression assumptions

Least-squares regression estimates a conditional mean line by minimizing squared vertical residuals. It does not assume the predictor is random or normal; inference commonly assumes errors are independent, mean zero conditional on X, with constant variance, and normally distributed for exact small-sample t tests. Heteroscedasticity can make conventional standard errors wrong even when the slope estimate remains useful. Plot residuals versus fitted values and predictor; use robust standard errors or a variance model when appropriate.

A correlation p-value tests a specified null under a reference model; it does not test whether a relationship is clinically important. Large n can make a negligible r statistically significant. Report r and interval, scatter plot, and units. In regression, report slope with outcome change per predictor unit, and avoid extrapolating outside the observed range.

## Rank correlation and ties

Spearman's rho is Pearson correlation of ranks and measures monotonic association. It tolerates some outlier influence in magnitudes but is not immune to influential rank changes, and ties require adjusted calculations. It can be high for nonlinear monotone relationships and near zero for nonmonotone patterns. Kendall's tau measures concordant versus discordant pairs and may be easier to interpret probabilistically, though both are rank-based summaries. Choose based on the scientific relationship and scale, not merely because a normality test rejects.

## Confounding and ecological interpretation

A scatter plot can reflect a third variable that drives both axes. BMI and blood pressure may co-vary with age; a crude slope combines within-age and between-age patterns. Adjusted regression changes the question to a conditional association and requires model adequacy. Aggregate clinic-level means can yield an ecological correlation that does not apply to patients; do not infer individual-level associations from group averages. Plot or model within-person, between-person, and site-level structures separately when data are hierarchical.

## Reproducible plot design

Use clear units, show sample size and missingness, avoid hiding points with overplotting, and distinguish smooth curves from model fits. If a smoother is added, specify its method and avoid treating it as prespecified inference. Annotate outliers only after checking records, and document exclusions. A scatter plot is a diagnostic and descriptive tool; the final estimate should come from an analysis aligned with the design and target.

A useful sensitivity analysis recalculates a correlation after verifying a suspected point and reports both values if it is valid but influential. Deleting it from the primary analysis solely because r improves is selective analysis. Robust correlations, such as percentage-bend or skipped correlations, can reduce outlier influence, but change the estimator and need prespecification or an exploratory label. Always show the raw data so the robust summary does not conceal a clinically important subgroup.

A correlation coefficient should be accompanied by n and a confidence interval when inferential interpretation matters. Because confidence intervals are wide at small n and sensitive to nonnormality, show the scatter rather than relying on a threshold such as |r|>.7 for “strong.” Strength is context-dependent: a modest association may matter for a population risk factor, while a high correlation may still be inadequate for replacing a measurement instrument. Clinical interpretation needs scale, range, and decision context.

## Correlation under measurement error

If predictor and outcome are measured with independent random error, observed covariance may shrink relative to true covariance while observed variances include added error, reducing correlation. Shared batch effects can instead induce artificial correlation. Repeatability studies, calibration data, or replicate measurements help distinguish these mechanisms. A scatter plot may show rounding, detection limits, or heteroscedastic error; note these features before interpreting r or a regression slope.

## References and further reading

- Bland JM, Altman DG. [Statistical methods for assessing agreement between two methods of clinical measurement](https://doi.org/10.1016/S0140-6736(86)90837-8). *Lancet*. 1986.
- Schober P, Boer C, Schwarte LA. [Correlation coefficients: appropriate use and interpretation](https://doi.org/10.1213/ANE.0000000000002864). *Anesth Analg*. 2018.

- Bland M, Altman DG. *Statistics with Confidence*. BMJ Books.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Fox J. *Applied Regression Analysis and Generalized Linear Models*. Sage.

Confidence intervals for regression and association are developed in the
library's inference articles.
