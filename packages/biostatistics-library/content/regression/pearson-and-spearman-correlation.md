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

In a study of 200 adults, a laboratory compares a new point-of-care HbA1c analyser with the reference HPLC method. The Pearson correlation between the two methods is r = 0.94, so r² = 0.88: about 88% of the variability in one measurement is shared with the other. The test statistic is t = 0.94·sqrt(198)/sqrt(1 − 0.8836) = 13.19/0.342 ≈ 38.6, giving p < 0.001. The association is extremely strong and precise, but for method-comparison purposes the 94% shared variance still leaves roughly 6% of variation unexplained — a patient with HbA1c 8.0% on the reference method could plausibly measure anything near the regression line, so Bland–Altman limits of agreement are the appropriate next step.

## Interpretation and common pitfalls

- Correlation is not causation, and not agreement: two methods can correlate 0.95 while consistently differing by 2 units, which may be clinically unacceptable.
- A correlation of 0 does not mean "no relationship" — it means no *linear* (for Pearson) or *monotonic* (for Spearman) relationship.
- Restricting the range of one variable (e.g. studying only patients with BMI 22–28) attenuates r; correlations from different samples are not directly comparable.
- Do not choose Spearman "to be safe" whenever the scatterplot looks linear — Pearson is more powerful in that case.

Correlation measures association, not agreement or causal effect. For repeated measurements or paired devices, use an agreement framework (for example, a Bland–Altman plot with limits of agreement) and define acceptable clinical limits in advance. Pearson's r is sensitive to outliers and measures linear association; Spearman's rho measures rank association and can be near zero for a strong U-shaped relation. Plot the paired observations, report the interval estimate, and account for clustering when observations are not independent. A narrow confidence interval around correlation does not remove confounding or establish that changing one variable changes the other.

## References and further reading

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and Other Advanced Topics*. Brooks/Cole.
- Bland JM, Altman DG. "Statistical methods for assessing agreement between two methods of clinical measurement." *BMJ* 1986.
- The [confidence intervals article](../inference/confidence-intervals.html) discusses uncertainty intervals for association estimates.
