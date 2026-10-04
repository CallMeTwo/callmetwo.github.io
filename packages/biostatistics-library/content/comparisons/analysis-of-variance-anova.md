---
title: Analysis of variance (ANOVA)
summary: Comparing the means of three or more groups with a single F-test, then locating which pairs differ.
---

## Overview

Analysis of variance (ANOVA) is a linear-model framework for comparing means across groups. Its name reflects the decomposition of outcome variation into parts associated with modeled group differences and residual variation. For a one-way design, it tests the omnibus null that all population means are equal. The F statistic is a ratio of mean squares: variation among group means, scaled by group degrees of freedom, divided by residual variation within groups.

ANOVA is not a separate species from regression. Coding a categorical treatment as a factor in a linear model yields the same fitted means and tests. This perspective makes extensions to covariate adjustment, factorial designs, contrasts, and unequal sample sizes natural, while reminding us that the design determines what comparisons are valid.

## Reading the F test as a model comparison

Suppose k groups have sample sizes nᵢ, means x̄ᵢ, and a grand mean x̄. The between-group sum of squares is Σ nᵢ(x̄ᵢ−x̄)²; the residual sum of squares is ΣΣ(xᵢⱼ−x̄ᵢ)². Divide by k−1 and N−k respectively to obtain mean squares. Under equal means and the classical model, their ratio follows F(k−1,N−k). A large F says the observed separation of fitted group means is difficult to reconcile with the null and residual model. It does not identify which pair differs.

With exactly two groups, F=t² for the corresponding pooled-variance t test. With multiple groups, the omnibus test protects the global question; follow-up comparisons need a plan. Tukey intervals suit all pairwise comparisons, Dunnett compares several treatments with one control, and prespecified contrasts target scientific hypotheses more efficiently.

## Worked example: three dose groups

Consider change in a biomarker (lower is better) among 12 participants per arm. Suppose means are −1, −3, and −4 units, with a common within-group SD of 2.5. The grand mean is −8/3. Between-group SS is 12[(−1+8/3)²+(−3+8/3)²+(−4+8/3)²]=56. Residual SS is (36−3)(2.5²)=206.25 if the observed residual SD is 2.5. Thus MSbetween=28, MSwithin=6.25 and F=4.48 with 2,33 df. The exact p-value should be calculated from the data; a significant omnibus result would indicate some dose means differ, not a linear dose response or a clinically important effect.

```r
d <- data.frame(
  arm = factor(rep(c("placebo", "low", "high"), each = 12),
               levels = c("placebo", "low", "high")),
  change = c(-1 + rnorm(12, 0, 2.5),
             -3 + rnorm(12, 0, 2.5),
             -4 + rnorm(12, 0, 2.5)))
fit <- aov(change ~ arm, data = d)
summary(fit)
TukeyHSD(fit, "arm")
```

The random values are simulated to illustrate workflow, not reproduce the arithmetic example. Report model-based contrasts and intervals, not only the omnibus p-value. For the scientific dose question, a planned linear trend contrast may be more relevant than every pairwise contrast.

## Residual model and study design

Classical fixed-effects ANOVA assumes independent errors with common variance and approximately normal residuals for exact small-sample inference. Normality concerns residuals conditional on the design, not necessarily the pooled outcome. Mild departures are often tolerated in balanced designs, but outliers, severe skew, unequal variances combined with unbalanced group sizes, or dependence can invalidate the usual F calibration. Plot residuals against fitted values and group, inspect distributions, and understand data collection before choosing an alternative.

If variances differ, Welch’s one-way test avoids pooling a single variance estimate. If the estimand is a median or rank ordering, Kruskal–Wallis may be relevant, but it tests a distributional/rank contrast, not simply equality of means. For repeated observations, use a model that accounts for within-person covariance; treating each visit as independent understates uncertainty. For cluster-randomized data, include the cluster structure. A transformation changes the estimand scale and should be justified, not applied solely to obtain a smaller p-value.

## Contrasts, adjustment, and meaningful effects

Factorial ANOVA estimates main effects and interactions. An interaction means the effect of one factor varies across levels of another; it often makes a single averaged main effect incomplete. State whether the model uses Type I sequential sums of squares, Type II, or Type III tests when the design is unbalanced, because these correspond to different hypotheses. In planned analyses, direct contrast estimates with confidence intervals are clearer than debating a generic sums-of-squares label.

Covariate adjustment can improve precision, especially in randomized trials with baseline outcome. State covariates in advance and use adjusted between-arm comparisons, not separate pre/post tests within arms. Report group means or adjusted means, the contrast, interval, degrees of freedom, and multiplicity handling. A statistically detectable difference is not automatically important; compare the estimate and interval with a clinically meaningful difference.

### Factor coding and interpretable contrasts

The formula `outcome ~ arm` generally uses treatment coding: the intercept is the reference-arm mean, and coefficients represent differences from that arm. Changing the reference level changes coefficient labels but not fitted values or the global equality test. A contrast is a weighted combination of means, cᵀμ. Weights summing to zero compare means; weights such as (−1, 0, 1) test a linear dose trend for equally spaced doses, while (−1, 1/2, 1/2) compares control with the average of two active arms.

Prespecified contrasts usually answer the scientific question more directly than every possible pairwise comparison. They also avoid spending precision on irrelevant contrasts. In an unbalanced design, state how marginal means are averaged over other factors and covariates. Estimated marginal means can be standardized equally over factor levels or according to a target population distribution; these choices define different summaries.

```r
# Set dose order explicitly and fit a factor model
trial$arm <- factor(trial$arm, levels = c("control", "low", "high"))
fit <- lm(change ~ arm, data = trial)

# A linear trend contrast for equally spaced doses:
# control, low, high receive weights -1, 0, 1
coef(fit)
# Contrast packages can test the weighted mean contrast;
# alternatively compare nested models or use emmeans::contrast().
```

If dose spacing is not equal, use scores reflecting actual dose distances rather than assuming equal increments. A test for linear trend does not establish a linear biological dose-response; inspect group means and consider nonlinear contrasts. A polynomial trend with three dose levels is only a compact description and can be unstable at boundaries.

## Factorial designs and interaction

With two factors A and B, the model can include A, B, and A×B. The interaction asks whether the effect of A differs across levels of B on the modeled outcome scale. For a two-by-two design, the difference-in-differences is (μ11−μ10)−(μ01−μ00). An interaction can be clinically central even when neither averaged main effect is informative. Conversely, a statistically significant interaction may reflect a small departure from additivity that has little clinical consequence.

Interpret interactions by displaying cell means and simple contrasts with intervals, not by reporting only an interaction p-value. The “main effect of A” in a model with interaction is conditional on reference coding or a chosen averaging scheme. In unbalanced data, apparent main effects can be especially sensitive to how means are weighted. Clarify whether hypotheses are about treatment effects within strata, average effects over a target population, or an additive interaction.

Do not infer interaction from one stratum having p<.05 and another p>.05. Test the difference between stratum effects directly. Interaction tests often have low power; wide intervals can leave substantial heterogeneity plausible. If a subgroup claim is confirmatory, prespecify it and account for multiplicity. If exploratory, report the estimates and describe the pattern without definitive subgroup language.

### Covariate adjustment and baseline measurements

An ANCOVA model includes treatment and prognostic baseline covariates to estimate adjusted group differences and often improves precision in randomized studies. For a baseline and follow-up outcome, the follow-up score adjusted for baseline is usually preferable to separate within-arm tests or an unadjusted change-score comparison when assumptions are reasonable. The treatment coefficient describes the adjusted contrast; report adjusted means and their difference with an interval.

Covariates should be selected on substantive and design grounds, preferably before outcome analysis. Randomization protects treatment allocation in expectation, but finite samples can still show chance baseline imbalance; selecting covariates only because they are imbalanced can create unstable inference. Do not adjust for post-randomization variables such as adherence or intermediate biomarkers without an explicit causal estimand, because conditioning may introduce bias.

The common-slope ANCOVA assumes the baseline-outcome relationship is the same across treatment groups. If treatment-by-baseline interaction is scientifically plausible, model and report it, with enough sample support. Nonlinear baseline associations can be handled with splines, but keep the treatment contrast interpretable. In observational data, covariate adjustment also requires no important unmeasured confounding and adequate overlap; ANOVA itself does not confer causal identification.

## Repeated measures and clustered observations

Ordinary one-way ANOVA assumes each observation is independent. When the same patient contributes measurements at multiple visits, within-person outcomes are correlated. Repeated-measures ANOVA imposes covariance structures and often requires complete balanced data and sphericity for univariate tests. Mixed-effects models can represent subject-specific intercepts or slopes and handle unbalanced visit schedules under a missing-at-random assumption conditional on included information. Generalized estimating equations target population-average effects with a working correlation and robust variance, requiring enough independent clusters.

For a cluster-randomized trial, treatment is assigned to clinics or wards, so patients within a cluster do not provide independent treatment assignments. A multilevel model or cluster-robust analysis must respect the randomization unit. A large patient sample from only a few clusters can still yield weak treatment information. Report number of clusters, their size distribution, and the covariance method. Do not use a standard ANOVA on all patient rows and assume the degrees of freedom are determined by patient count.

## Unequal variances and robust alternatives

Classical ANOVA pools one residual variance across groups. When variance differs, Welch’s ANOVA adjusts the group means and degrees of freedom without assuming homoscedasticity. It is particularly useful when variances and sample sizes are both unequal. Robust trimmed-mean procedures or permutation tests may be useful for heavy tails, but the null and estimand must be stated: a permutation test is exact under exchangeability/randomization, not automatically under unequal group distributions.

Transformations can stabilize variance, but a log-scale ANOVA compares means of logs, which typically corresponds to geometric means or multiplicative effects. Back-transforming requires careful interpretation. If an outcome is strongly skewed or bounded, a generalized linear model may align better with its support and mean-variance relationship. Choose based on the scientific parameter and diagnostics, not on which method yields significance.

## Diagnostics as model questions

Inspect residual-versus-fitted and residual-versus-group plots for heteroscedasticity and structure; use a Q-Q plot to identify severe tail departures; examine raw group data for outliers and multimodality. Residual normality matters most for small-sample calibration and prediction, while balanced designs can be reasonably robust to modest departures. Formal normality tests have high power to detect trivial deviations in large samples and low power in small samples. They should not be used as automatic gatekeepers.

An outlier may be a data error, a valid extreme patient, or evidence the mean model is inadequate. Verify source data and report sensitivity analyses if an observation has substantial influence. Removing a valid patient solely to restore assumptions changes the analyzed population and risks bias. For small samples, use design-based or robust inference when justified and show how conclusions depend on modeling choices.

## Power, reporting, and a clinical conclusion

For k groups under equal variance, power depends on the noncentrality parameter linked to between-group dispersion and residual variance. A sample-size calculation must specify a clinically meaningful pattern of means, SD, allocation, alpha, and planned contrasts. Planning for an omnibus F test alone may not give adequate power for a key treatment-control contrast after multiplicity adjustment. Include dropout, clustering, and unequal allocation in the design calculation.

A complete report gives group n, descriptive means and SDs (or model-appropriate summaries), the omnibus F statistic with degrees of freedom and p-value if it addresses the question, prespecified contrasts with estimates and confidence intervals, variance/covariance assumptions, and multiplicity method. Include effect sizes such as η² or partial η² only with clear definitions; these are sample- and design-dependent and do not replace raw-scale contrasts. Explain whether a difference reaches clinical importance. If the omnibus test is not significant, do not imply that groups are equivalent; inspect intervals and design precision.

### Worked contrast and R output interpretation

Suppose adjusted mean changes are −1.0, −2.5, and −4.0 units for control, low dose, and high dose, with standard error 0.7 for each adjusted mean under a balanced design. The planned high-dose versus control contrast is −3.0 units. The omnibus ANOVA asks whether any means differ; the contrast answers the primary dose question. A linear trend contrast using scores 0, 1, 2 has expected mean change per dose step of −1.5 units. These are related but distinct estimands. A pairwise Tukey procedure would widen intervals to cover all pairs, whereas a single prespecified contrast can use a more focused interval.

```r
fit <- lm(change ~ arm + baseline, data = trial)
anova(fit)                         # model term tests
summary(fit)                       # reference-coded coefficients
# emmeans::emmeans(fit, ~ arm)      # adjusted means
# emmeans::contrast(emmeans(fit, ~ arm),
#                   list(high_vs_control = c(-1, 0, 1)))
```

R’s `anova()` on an `lm` object usually reports sequential Type I sums of squares; results can depend on term order when predictors are correlated or the design is unbalanced. For a prespecified adjusted contrast, estimate the linear combination directly and use its covariance. Packages such as `emmeans` help construct marginal means and contrasts, but specify weights, reference levels, and multiplicity adjustments explicitly. Do not report only a coefficient without its coding.

### Effect-size definitions

Eta-squared, η²=SSbetween/SStotal, is the proportion of sample outcome variation associated with group in a one-way fixed-effects decomposition. Partial η² divides the effect sum of squares by that plus its error sum of squares, excluding other modeled effects. They are not interchangeable and can differ across designs. Both are influenced by the particular sample and model; a large value does not tell readers how many mmHg or symptom points separate groups. Raw contrasts and intervals should remain primary. Generalized eta-squared has been proposed for comparing repeated-measures designs where partial eta-squared is inflated by within-subject factors.

### Common interpretive errors

The omnibus F test is not a test that every pair differs. A significant F can be driven by one group, a nonlinear pattern, or a variance issue. A nonsignificant F is not evidence of equivalence. Separate paired pre/post tests within treatment arms do not test whether randomized arms differ; test the treatment contrast directly. Post hoc tests chosen after examining group means can inflate false-positive risk. Finally, a multiple-group comparison is not causal unless treatment assignment or confounding control justifies causal interpretation.

### Unbalanced designs and sum-of-squares choices

In a balanced factorial design, orthogonality makes many sums-of-squares formulations agree. In an unbalanced design, factors may be correlated and sequential Type I sums of squares depend on term order. Type II tests each main effect after other main effects but not interactions; Type III tests each term conditional on all others, including interactions, and can test awkward hypotheses depending on coding. Rather than treating one type as universally correct, state the contrast of scientific interest and estimate it from the fitted model. Empty cells can make some interactions unidentifiable; no sums-of-squares convention repairs a lack of overlap.

If cell sizes are unequal because of attrition, describe that pattern and consider whether missingness changes the target population. Estimated marginal means can weight cells equally or by observed frequency. Equal weighting targets an average over factor levels; proportional weighting targets the observed mix. Choose the population relevant to the decision.

### Reporting a contrast, not only F

If the primary question is treatment versus control, report that contrast even when an omnibus F test is included. A table of pairwise p-values without estimated differences hides scale and precision. State whether confidence intervals are simultaneous or pointwise and which family they cover. For an interaction, display cell estimates and the simple effects that explain it. Readers should be able to understand what changed without reconstructing the model from a p-value.

### Distinguish omnibus and planned questions

The omnibus F test is useful when the question is whether any group mean differs, but it can be inefficient for a specific contrast. A planned control-versus-average-treatment contrast may carry most of the scientific meaning. If it was prespecified, report it regardless of the omnibus result, with an appropriate multiplicity plan. Conversely, an omnibus result alone does not license every unadjusted pairwise comparison.

For very large samples, even tiny mean differences can produce a large F. Always compare contrast estimates and intervals with clinically meaningful units. An effect-size fraction can supplement but not replace that interpretation.

### Practical model review

Before interpreting an ANOVA table, check factor levels and reference coding, sample sizes, missing outcomes, and whether independence follows from the design. Inspect cell-level means and residuals. Confirm that post hoc comparisons match the prespecified family. A report that supplies only “one-way ANOVA, p=.04” leaves readers unable to reconstruct either the contrast or its relevance.

## References and further reading

- Lang TA, Altman DG. [The SAMPL guidelines](https://www.equator-network.org/reporting-guidelines/sampl/), guidance on reporting statistical analyses and estimates.
- Maxwell SE, Delaney HD, Kelley K. *Designing Experiments and Analyzing Data: A Model Comparison Perspective*. 3rd ed. Routledge, 2018.
- Chow S, Lu J, Jehessel M. *Design and Analysis of Clinical Trials*. Wiley.
- Bland J, Altman D. *Statistics with Confidence*. BMJ Books.
- The [multiple-testing article](/biostatistics-library/inference/multiple-testing.html) explains family-wise error control for post-hoc contrasts.
