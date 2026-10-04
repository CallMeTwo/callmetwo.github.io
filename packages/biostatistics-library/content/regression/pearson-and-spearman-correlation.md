---
title: Pearson and Spearman correlation
summary: Two coefficients that quantify the strength and direction of association between continuous variables, for linear and monotonic relationships.
---

## Overview and key ideas

Correlation summarises how two variables move together. The Pearson product-moment correlation (r) measures the strength of a *linear* association on the scale −1 to +1: 0 means no linear association, while ±1 indicates that one variable is an exact linear function of the other. The Spearman rank correlation (ρ, "rho") instead ranks each variable and then computes Pearson's r on the ranks, so it captures *monotonic* associations — relationships that are consistently increasing or decreasing even when not straight-line.

Both coefficients are symmetric (correlation of X with Y equals that of Y with X) and say nothing about cause. A frequently used companion is r², the proportion of variance in one variable explained by the other: r = 0.5 means r² = 0.25, i.e. only a quarter of the variability is shared. In medical research, correlations of 0.3–0.5 are usually considered moderate, 0.5–0.7 strong, and above 0.7 very strong, but these thresholds depend on the field and the noise in measurement.

## When to use it

| Setting | Example question |
| --- | --- |
| Biomarker validation | How closely do two lab assays (e.g. two HbA1c methods) agree in measured value? |
| Physiology | Is systolic blood pressure linearly related to body mass index in adults? |
| Questionnaire research | Do pain scores correlate with a patient's self-rated global health? |
| Data screening | Which covariates are highly intercorrelated before fitting a regression model? |

Choose Pearson when both variables are approximately continuous and the scatterplot looks linear. Choose Spearman when the relationship is monotonic but curved, when the data are ordinal (e.g. Likert scale pain ratings), or when outliers and skew make ranks more representative. A Bland–Altman analysis is the better tool when the scientific question is *agreement* between two measurements rather than association.

## Assumptions and limitations

- Pearson assumes a linear relationship between the variables and that the joint distribution is roughly bivariate normal; both variables should be at least interval-scaled.
- Pearson is very sensitive to outliers and to ceiling/floor effects — a single extreme value can inflate or deflate r by 0.1 or more.
- Both coefficients require paired observations on the same subjects; they assume independence between subjects (repeated measures on one patient inflate significance).
- Neither coefficient detects nonlinear patterns: r can be 0 for a perfect U-shaped relationship.
- The significance test for r uses t = r·sqrt(n−2)/sqrt(1−r²); with n above 50, even weak but nonzero correlations become "significant", so the size of r matters more than the p-value.

## Worked example

In a study of 200 adults, a laboratory compares a new point-of-care HbA1c analyser with the reference HPLC method. The Pearson correlation between the two methods is r = 0.94, so r² = 0.8836: about 88% of the variability in one measurement is explained by a simple linear prediction from the other. The test statistic is t = 0.94·sqrt(198)/sqrt(1 − 0.8836) ≈ 38.8, giving p < 0.001. The association is extremely strong and precise, but for method-comparison purposes the remaining variation may still be clinically important—a patient with HbA1c 8.0% on the reference method could differ materially on the new assay, so Bland–Altman limits of agreement are the appropriate next step.

## Interpretation and common pitfalls

- Correlation is not causation, and not agreement: two methods can correlate 0.95 while consistently differing by 2 units, which may be clinically unacceptable.
- A correlation of 0 does not mean "no relationship" — it means no *linear* (for Pearson) or *monotonic* (for Spearman) relationship.
- Restricting the range of one variable (e.g. studying only patients with BMI 22–28) attenuates r; correlations from different samples are not directly comparable.
- Do not choose Spearman "to be safe" whenever the scatterplot looks linear — Pearson is more powerful in that case.

Correlation measures association, not agreement or causal effect. For repeated measurements or paired devices, use an agreement framework (for example, a Bland–Altman plot with limits of agreement) and define acceptable clinical limits in advance. Pearson's r is sensitive to outliers and measures linear association; Spearman's rho measures rank association and can be near zero for a strong U-shaped relation. Plot the paired observations, report the interval estimate, and account for clustering when observations are not independent. A narrow confidence interval around correlation does not remove confounding or establish that changing one variable changes the other.

## Pearson correlation from covariance

For paired observations, sample covariance is s_xy=Σ(x_i−x̄)(y_i−ȳ)/(n−1), while sample SDs are s_x and s_y. Pearson r=s_xy/(s_xs_y). The denominator standardizes units, so r is unchanged by adding a constant or multiplying both variables by positive constants. Multiplying one variable by a negative constant reverses sign. Correlation is symmetric and describes linear co-variation; it is not a slope and carries no units.

In the HbA1c-method example r=.94, so r²=.8836. Under simple linear regression with intercept, this is the sample fraction of variation in one method explained by a linear prediction from the other. It does not mean 88% agreement or 88% of patients have matching results. The test statistic t=.94√198/√(1−.94²)≈38.8 with 198 df, giving a very small p-value, but practical agreement still requires differences and clinical tolerance limits.

```r
r <- .94; n <- 200
t <- r * sqrt(n - 2) / sqrt(1 - r^2)
p <- 2 * pt(-abs(t), df = n - 2)
c(r = r, r_squared = r^2, t = t, p_value = p)
```

This test assumes independent pairs and a bivariate-normal model for exact inference. Large n makes tiny associations statistically detectable; report effect size and uncertainty.

## Confidence interval for correlation

Fisher's z=atanh(r) is approximately normal with SE=1/√(n−3) under bivariate normality. Construct z±1.96SE and transform back with tanh. For r=.94 and n=200, z≈1.738, SE≈.0712, and a 95% interval transforms to approximately .921–.954. The interval quantifies sampling uncertainty in correlation under assumptions; it does not quantify method agreement or causal uncertainty.

```r
z <- atanh(r); se <- 1/sqrt(n-3)
tanh(z + c(-1,1)*qnorm(.975)*se)
```

For outliers, clustering, ties, or strongly nonnormal data, a bootstrap or permutation procedure may be more suitable, respecting the paired unit and cluster structure. In small samples the Fisher interval can be inaccurate.

## Spearman rho and Kendall tau

Spearman's rho is Pearson correlation of ranks. It measures monotone association and is invariant under strictly increasing transformations. Ties are assigned average ranks in common implementations; many ties reduce attainable values and affect null distributions. A monotone curved relation can have rho near one while Pearson r is lower. A U-shaped association can have both near zero even when dependence is strong. Kendall's tau is based on concordant and discordant pairs and has a direct pairwise interpretation, but its scale differs from rho.

```r
cor(x, y, method = "pearson")
cor(x, y, method = "spearman", exact = FALSE)
cor.test(x, y, method = "kendall", exact = FALSE)
```

Choose the measure from the relationship and scale, not from which p-value is smaller. Rank methods still require independent pairs for standard inference and do not fix confounding, range restriction, or clustered data.

## Correlation, agreement, and measurement error

Correlation can be high when two methods have systematic bias or when the sample spans a wide range. Agreement asks whether paired measurements are close enough for interchangeability. Bland–Altman analysis uses difference against mean, estimates mean bias and limits of agreement, and requires clinically defined acceptable limits. If proportional bias exists, differences vary with magnitude; transformation or regression-based agreement may be required. Repeated measurements require variance components for within- and between-subject variation.

Classical independent measurement error attenuates observed correlation. Shared batch or calibration error may inflate it. Restricting range in a homogeneous sample also lowers correlation. Therefore, compare correlations across studies only with attention to population range, protocol, assay reliability, and selection.

## Confounding and interpretation

A correlation between exposure and outcome can be generated by a common cause, reverse direction, selection, or aggregation. Scatter plots reveal form and outliers, not causal structure. Adjusted regression can estimate conditional association but requires appropriate covariates and model form. For clustered or repeated data, a pooled correlation mixes within- and between-unit relations. Report the unit of analysis and avoid ecological inference from group averages.

Do not use verbal thresholds (“moderate,” “strong”) without context. A correlation of .3 may be important for a noisy population risk factor, while .95 may be inadequate for a replacement assay. Present the scatter, n, coefficient, interval, units, range, and question—association, prediction, or agreement.


## Restricted range and dependence

Correlation is sensitive to the range of values in a sample. A narrow healthy-volunteer range can yield a modest coefficient even when two measures track closely over a broad clinical range; conversely, mixing healthy and severe cases can inflate correlation due to between-group separation. Describe the observed range and consider stratified plots. Do not directly compare correlations from populations with different case mix without considering range restriction.

For repeated measurements from each patient, standard correlation tests treat every pair as independent and understate uncertainty. A pooled r can mix between-person and within-person associations. Use cluster bootstrap, mixed-effects models, or repeated-measures correlation according to the question. In method comparison, repeated-measures Bland–Altman methods separate within-subject and between-subject variability.

## Comparing dependent correlations

When comparing two correlations measured on the same participants—for example, two biomarkers each correlated with an outcome—the estimates are dependent because they share a variable and sample. Independent-sample Fisher z tests are inappropriate. Use methods for overlapping/dependent correlations or bootstrap participants and calculate the difference in each resample. Prespecify the comparison and report its interval; “one p-value significant and another not” does not demonstrate their difference.

Correlation matrices used for screening many predictors also raise multiplicity and collinearity issues. High pairwise correlation does not capture multivariable dependence, and low pairwise correlations do not guarantee low VIF. Use model-oriented diagnostics and avoid automated deletion solely by a correlation cutoff.

## Scatterplot-first analysis and Anscombe's lesson

Datasets can share the same means, variances, regression line, and correlation but have very different scatter patterns. One may be linear, another curved, another driven by a single influential point. Therefore a coefficient is never a substitute for plotting raw paired values. Add a smooth trend as a diagnostic, but avoid letting a smoother conceal sparse areas. Display point density transparently when n is large.

For data with a U-shaped relation, Pearson r may be near zero because positive and negative slopes cancel. Spearman rho may also be near zero because the relationship is not monotone. Consider a scientifically specified nonlinear model or compare conditional distributions; do not conclude independence from zero correlation. Zero covariance implies independence only under special distributional families such as joint normality, not generally.

## Rank measures and ties in practice

Spearman's rho is computed from ranks, with average ranks assigned to ties. If values are heavily tied—as in a 5-point Likert scale—many pairs are tied and the attainable coefficient range and exact null distribution change. Kendall's tau-b adjusts for ties and can be useful for ordinal data. For very small n, exact or permutation tests may be more appropriate than asymptotic p-values. Report the coefficient type and tie handling.

```r
cor.test(pain_score, global_rating, method = "spearman",
         exact = FALSE)
cor.test(pain_score, global_rating, method = "kendall",
         exact = FALSE)
```

These tests assume independent pairs. If subjects are nested in clinicians or sites, use cluster-aware methods; ordinary permutation of individual rows breaks the design.

## Method agreement and clinical thresholds

For assay comparison, report mean bias and limits of agreement with confidence intervals and compare them to clinically acceptable differences prespecified before analysis. A narrow mean-bias interval can coexist with wide individual limits, meaning average calibration is good but person-level substitution is poor. Regression of difference on mean can assess proportional bias but needs appropriate repeated-measures methods when subjects contribute replicates. Correlation answers association and should not be the primary validity criterion for interchangeability.

## Confidence intervals and sample size intuition

For Pearson r, Fisher-z standard error is approximately 1/√(n−3), so precision improves slowly with sample size. With n=30, SE_z≈.192; at n=200 it is .071. A narrow interval does not solve bias due to range restriction or shared measurement error. Plan sample size around a desired interval width or minimum relevant correlation, rather than power alone. If correlations are compared across groups, account for independent versus paired samples and multiple comparisons.

When reporting, give the coefficient and confidence interval, sample size, method, and scatter plot. A p-value tests a null association; it does not indicate the probability that the correlation is clinically meaningful.

## Correlation does not imply independence

Pearson r=0 means sample linear covariance is zero; population zero correlation indicates zero covariance, not general statistical independence. A symmetric U-shaped relation can have zero covariance while Y is almost deterministically related to X. Spearman rho=0 similarly indicates no rank-monotone trend, not absence of all dependence. Plot and consider nonlinear dependence measures only when motivated; no single coefficient captures every relationship.

### Worked nonlinear illustration

Let X range symmetrically around zero and Y=X². Positive and negative X values pair with similar Y, so Pearson correlation can be near zero even though knowing X determines Y. A scatter plot shows a parabola immediately. Fitting a linear regression alone produces a near-zero slope and can falsely suggest “no association.” Add a quadratic term if the U-shape is scientifically plausible and supported by data.

```r
set.seed(3)
x <- runif(200, -2, 2)
y <- x^2 + rnorm(200, sd = .2)
cor(x, y)      # near zero by symmetry
plot(x, y)
summary(lm(y ~ x + I(x^2)))
```

The simulated example is illustrative. The quadratic model assumes a specific shape; validate residuals and avoid choosing polynomial degree solely by significance.

## Correlation matrices and multiplicity

A matrix of many pairwise correlations can be useful for exploration but creates many hypotheses and may highlight chance extremes. Correlations are also pairwise complete by default in some workflows; different pairs can use different subsets, making the matrix not positive semidefinite and hard to compare. State missing-data handling, show pairwise sample sizes, and use a prespecified subset or multiplicity adjustment for confirmatory claims. Use VIF or model diagnostics to assess multivariable collinearity rather than relying only on pairwise r.

A correlation should be interpreted within the observed range and measurement protocol. Report whether pairs were complete, how ties were handled, and whether multiple observations per person were present. Show units even though r is dimensionless: units make the axes and clinical spread interpretable. If the purpose is calibration or interchangeability, supplement the coefficient with regression bias or agreement limits and predefined acceptance criteria.

For two methods intended to replace one another, define acceptable absolute or relative error from clinical needs before analysis. A regression line can describe systematic calibration, but high correlation does not guarantee narrow prediction errors. Plot differences across the range, check for proportional bias, assess repeatability, and test performance near critical clinical thresholds. Report uncertainty in bias and limits, not correlation alone.

Before calculating a correlation, inspect missingness and pair matching. Pairwise deletion can use a different set of patients for each pair in a correlation matrix; listwise deletion can discard many otherwise useful observations. Imputation or model-based correlations require assumptions and should be reported. Never correlate group means when the question concerns individuals unless the ecological level is explicitly the target.

## Reporting a complete correlation analysis

A reproducible report specifies Pearson, Spearman, or Kendall; sample size and missing-pair handling; estimate and interval; scatterplot; measurement ranges and units; and whether observations are independent. If an association is nonlinear or clustered, explain how the chosen coefficient summarizes it and what it cannot capture. If the purpose is method comparison, include bias and agreement limits with clinical tolerances. These details prevent a dimensionless coefficient from being interpreted beyond its evidence.

## References and further reading

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and Other Advanced Topics*. Brooks/Cole.
- Bland JM, Altman DG. "Statistical methods for assessing agreement between two methods of clinical measurement." *BMJ* 1986.
- The [confidence intervals article](../inference/confidence-intervals.html) discusses uncertainty intervals for association estimates.

Do not interpret a high Pearson coefficient as sufficient evidence that one biomarker can substitute for another. If the range is broad, correlation may be high despite clinically meaningful error at decision cutoffs. Evaluate bias and precision around those cutoffs and determine whether recalibration would be stable across populations. The replacement claim requires agreement evidence and external validation, not just shared variance.

For a strongly nonlinear but monotone association, compare scatterplot shape with both Pearson and rank summaries and explain why one is primary. Rank correlation does not quantify change in original units, so a regression model may still be needed for prediction or dose-response interpretation. Report a coefficient only with the plot and the scientific question it summarizes.
