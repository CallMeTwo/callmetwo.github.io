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

## References and further reading

- Bland M, Altman DG. *Statistics with Confidence*. BMJ Books.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Fox J. *Applied Regression Analysis and Generalized Linear Models*. Sage.

*The "Statistical inference" section of the topic map develops confidence intervals for correlation and regression (article planned).*
