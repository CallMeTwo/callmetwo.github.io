---
title: Mann–Whitney and Wilcoxon tests
summary: Nonparametric tests for whether two groups differ in distribution, using ranks instead of raw values.
---

## Overview

The Mann–Whitney U test (Wilcoxon rank-sum) compares two independent samples through their pooled ranks. The Wilcoxon signed-rank test uses ranks of within-pair differences. Both are distribution-free under their randomization/exchangeability nulls, but they answer different questions from a t-test and should not be casually described as tests of medians.

## Independent groups and probability of superiority

For independent samples X and Y, the Mann–Whitney statistic is closely related to the number of cross-group pairs in which X exceeds Y. Dividing U by nX nY estimates P(X>Y)+½P(X=Y), a probabilistic index. A value .5 means neither group tends to produce larger observations under this summary; it can be meaningful even when distributions differ in shape.

Example: group A recovery times are 2, 3, 4, 5 days; group B times are 3, 4, 6, 7. There are 16 cross-pairs. A value from A exceeds B in 2 comparisons and ties in 3, giving estimated superiority (2+1.5)/16=.219; the distribution tends to be lower in A. This describes ordering, not a 78% chance an individual patient benefits from treatment.

```r
A <- c(2, 3, 4, 5)
B <- c(3, 4, 6, 7)
wilcox.test(A, B, exact = FALSE, conf.int = TRUE)
```

R’s reported W is a rank-sum statistic; inferential options and interval interpretation depend on the estimand and tie structure. For a direct probabilistic index, compute all pairwise comparisons and bootstrap participants within groups. In a randomized trial, preserve the randomization structure in permutation inference.

## Paired outcomes and signed ranks

For paired differences Dᵢ, discard exact zero differences according to the chosen convention, rank |Dᵢ|, then compare positive and negative rank sums. Under a symmetric distribution of differences centered at zero, the signed-rank test assesses a location shift. Symmetry matters: without it, the test does not simply test a zero median. When only direction matters and magnitudes are not comparable, the sign test is a simpler but less powerful alternative.

```r
before <- c(8, 7, 6, 9, 5, 8, 7, 6)
after  <- c(6, 6, 5, 7, 4, 6, 7, 5)
wilcox.test(after, before, paired = TRUE, exact = FALSE,
            conf.int = TRUE)
```

The participant is the unit; never pair observations merely because rows happen to align. Clarify whether a positive difference denotes improvement. Large tied blocks or many zero differences reduce information, and exact p-value availability depends on sample size and ties.

### Choosing the estimand before the test

If the target is an arithmetic mean difference, a t-based method may remain appropriate under skew in adequately sized groups, or use robust/permutation inference with a clearly defined statistic. If the target is a median shift, compare distributions with a location-shift model and inspect shape assumptions. If an ordinal scale is central, ordinal regression may use more structure. Rank procedures do not magically remove confounding or accommodate covariates.

The null of identical distributions is stronger than equal medians. A significant Mann–Whitney test can reflect a spread or shape difference even if medians match. Conversely, ties on coarse scales can obscure distinctions. Report group distributions, chosen effect measure (e.g., median difference, probabilistic index), interval, sample sizes, and exact/asymptotic method. For post hoc pairwise tests after several groups, control multiplicity. Avoid choosing a rank test merely because a normality test rejected; align the analysis with the clinical quantity that matters.

## Mann–Whitney statistic and probability index

For independent groups X₁,…,Xₙ and Y₁,…,Yₘ, count all cross-group comparisons. The Mann–Whitney U for X can be written ΣᵢΣⱼ[I(Xᵢ>Yⱼ)+½I(Xᵢ=Yⱼ)]. Dividing U by nm estimates the probability index θ=P(X>Y)+½P(X=Y). Under identical continuous distributions, θ=.5. A rank-sum W is an affine transformation of U, so different software may report different statistic labels while testing the same null.

For A=(2,3,4,5) and B=(3,4,6,7), pairwise A values exceed B in 2 of 16 comparisons and tie in 3. Thus θ-hat=(2+0.5×3)/16=.219. The reverse orientation yields .781. This is an interpretable rank effect: a randomly selected A value is less than a randomly selected B value in most cross-pairs. It is not the probability that a specific treated patient improves or that treatment caused the difference.

```r
A <- c(2, 3, 4, 5)
B <- c(3, 4, 6, 7)
comparisons <- outer(A, B, "-")
theta <- mean(comparisons > 0) + .5 * mean(comparisons == 0)
theta
wilcox.test(A, B, exact = FALSE, conf.int = TRUE)
```

The orientation of `outer(A,B,"-")` determines whether greater A is counted. R’s reported W convention and confidence interval may refer to a location shift rather than θ; inspect documentation and report the statistic’s definition. With ties, asymptotic variance is tie-corrected.

## Wilcoxon signed ranks and symmetry

For paired differences dᵢ, the signed-rank procedure ranks |dᵢ| and sums ranks by sign. Under a symmetric distribution centered at zero, it tests a location shift of zero. It is not merely a “nonparametric paired t-test”: the t-test targets the arithmetic mean difference, whereas signed ranks use signs and magnitude ranks. A few large differences therefore influence the tests differently.

Exact inference is available for small samples with no ties/zero differences under standard algorithms. Zero differences may be discarded or handled by a convention; ties in absolute differences receive average ranks. For ordinal paired data, signed ranks may be questionable if numerical gaps between categories do not represent comparable distances. A sign test uses direction only and may be more defensible but less powerful.

## Null hypotheses and distribution shape

Mann–Whitney is often described as testing equal medians, but its general null is equality of distributions (or exchangeability) under the rank-sum formulation. If two distributions have the same shape and differ only by a location shift, the result can be interpreted as evidence of a shift. When spreads or shapes differ, the test can reject even with equal medians. The probability index θ provides a specific ordering estimand, but still can equal .5 when distributions differ symmetrically in shape.

Rank tests require independent observations between groups. Paired or clustered samples violate this assumption. They also do not automatically adjust for covariates. For adjusted analysis, use an ordinal model, quantile regression, or regression for the probability index with robust inference. Confounding remains a design issue, not something ranking eliminates.

## Confidence intervals and effect summaries

For a Mann–Whitney comparison, possible summaries include Hodges–Lehmann shift (median of pairwise differences under a location-shift model), probability of superiority, and rank-biserial correlation (2θ−1 under one common convention). They answer related but distinct questions. Specify whether a shift estimate assumes common shape; pairwise differences may not estimate a meaningful location shift under crossing distributions.

For signed ranks, the Hodges–Lehmann pseudomedian estimates the center of pairwise Walsh averages; it equals the median under symmetry. R can return a location estimate and interval, but tie-heavy data may prevent exact calculations. A bootstrap interval for θ should resample participants independently within arms; for paired inference, resample pairs. Small-sample bootstrap intervals may be unstable, so show raw distributions as well.

## Ties, censoring, and measurement scales

Ties are routine in ordinal scales, bounded scores, and rounded laboratory values. Tie corrections improve variance calibration but cannot restore lost information. If an outcome is censored, such as time to discharge with deaths, ordinary rank tests do not account appropriately for censoring or competing events; use survival methods with estimands suited to the event structure. A floor effect can also cause many zeros and alter interpretation.

The scale matters: an ordinal pain score supports ordering but not necessarily equal spacing, while a continuous biomarker may have a meaningful mean contrast. Choose rank methods because the ordering estimand is appropriate or robustness is justified, not simply after a normality test rejects. For a mean estimand, robust mean methods may be preferable.

## Practical analysis and reporting

Describe group distributions with medians/IQRs and plots, but do not report only these if the test targets ranks. Give n, test name, exact/asymptotic method, ties/zero handling, effect summary with interval, and contrast direction. For paired tests, state number of complete pairs and difference convention. For multiple pairwise comparisons, adjust the family and show estimates. Do not interpret p>.05 as equality or a significant result as a median difference without shape assumptions. Relate the rank effect back to clinically meaningful units and the study design.

### A paired signed-rank calculation

Consider paired improvements D=(2,−1,3,0,−4,2). Remove the zero difference under the common convention, rank absolute magnitudes 1,2,2,3,4 with average ranks for the tied twos, then sum ranks by sign. Positive ranks sum to 2.5+2.5+4=9; negative ranks sum to 1+5=6. The imbalance is modest. Exact p-values depend on how ties and zeros are handled; software may fall back to an approximation.

```r
before <- c(8, 7, 6, 9, 5, 8, 7)
after  <- c(6, 8, 3, 9, 9, 6, 7)
d <- before - after  # positive means improvement under this coding
wilcox.test(before, after, paired = TRUE, exact = FALSE,
            conf.int = TRUE)
```

State the subtraction direction and define positive change clinically. The interval from R may estimate a pseudomedian shift, not necessarily the ordinary median of individual differences unless symmetry holds.

### Small samples, ties, and exact p-values

Exact rank-test calculations rely on exchangeability under the null and commonly assume no ties for simple algorithms. Ties arise from discrete scales and rounding; software may use asymptotic tie corrections. If a sample is tiny, test statistics have only a few attainable values and two-sided p-values are discrete. “Exact” can be conservative; mid-p versions are less conservative but do not guarantee nominal size. Choose the method before seeing results and describe it.

For many ties or zero differences, show raw paired differences or outcome distributions. A sign test may provide a more robust direction-only analysis for paired data, at a cost in power. For a clinically meaningful average change, consider a t interval on differences if robust enough rather than abandoning the mean estimand automatically.

### Worked independent-group probabilities

With A=(2,3,4,5) and B=(3,4,6,7), there are 16 ordered cross-pairs. A exceeds B twice, ties three times, and is lower in 11. The estimated probability that A is larger, counting half a tie, is .219; the complementary probability B exceeds A is .781. The rank-biserial correlation 2θ−1 is −.562 under the orientation A versus B. These summaries convey direction and ordering but do not specify how many days recovery differs.

If the data support a common location shift, Hodges–Lehmann can estimate a median pairwise difference. If distributions have different shapes, probability of superiority is more general but may still hide clinically meaningful crossing. Plot empirical CDFs or violin/strip plots to inspect where one group tends larger and where it does not.

### Randomization and causal interpretation

In a randomized trial, a rank statistic can be evaluated under the assignment mechanism, preserving blocks or stratification. Such a randomization test can provide a valid test of a sharp null without assuming a normal outcome distribution. The rank-sum test’s exchangeability null is still not a direct causal effect size unless the assignment and estimand support it. In observational comparisons, ranking does not remove confounding; adjusted rank regression or causal methods are needed and still depend on measured-confounding assumptions.

### Reporting both tests responsibly

Give the group sample sizes, medians/IQRs or a distribution plot, statistic, exact/asymptotic method, and an interpretable effect estimate. For paired signed-rank analysis, report complete pairs and the distribution of within-person changes. State assumptions needed to interpret a shift. Avoid the phrase “nonparametric t-test” because it suggests the same estimand and obscures differences in what the rank procedure detects.

### Comparing a mean estimand with a rank test

Suppose recovery times are highly skewed but the scientific decision concerns average hospital days and total bed capacity. Mann–Whitney does not test the mean difference. A robust mean difference, bootstrap CI, or generalized linear model may better answer the question while handling skew. Conversely, when a patient-centered question asks whether one treatment tends to yield better ordinal outcomes, probability of superiority can be a natural estimand. “Nonparametric” is not a generic remedy; choose the quantity first.

### Small-sample randomization inference

In a randomized two-arm study, permute treatment labels according to the actual assignment and recalculate U. This tests a sharp no-effect null under the randomization scheme and can avoid asymptotic approximations. If allocation was stratified, preserve strata. The permutation p-value does not directly estimate treatment effect; pair it with a probability-index or shift estimate and interval. For matched pairs, sign flips of within-pair differences can provide a randomization test if treatment assignment supports that exchangeability.

### Practical plots

Strip plots show the actual observations and ties; empirical CDFs display the whole distribution and reveal crossings. Box plots can hide multimodality and pile-ups. For paired data, connect each participant’s before/after values or plot the difference distribution. These visualizations help interpret what rank evidence is responding to and whether a simple location shift is plausible.

### Frequent interpretation errors

A significant Mann–Whitney result does not automatically mean medians differ; unequal shape or spread can drive the ranks. A significant signed-rank result does not automatically mean the median of differences is nonzero without symmetry. Neither test compares arithmetic means. State the null and effect measure in plain language.

A p-value above .05 is not evidence of equal distributions. Rank tests may have low power with small samples, heavy ties, or many zero differences. Report intervals for an interpretable effect and show raw distributions. Do not choose between rank and t procedures by whichever produces a preferred conclusion.

### Planning rank-based studies

Power depends on the full outcome distributions, not only a median difference. Pilot data should inform spread, skew, ties, and expected probability of superiority. For paired signed ranks, power depends on the distribution of nonzero differences and their symmetry. Simulation under plausible distributions can compare a t-based mean analysis, rank analysis, and a clinically interpretable probabilistic index. Prespecify a primary estimand and avoid selecting a method after seeing the observed shape.

### Convey clinical magnitude

Translate rank results into original units through distribution plots, quantiles, or a shift estimate where shape assumptions hold. A probability index of .60 may sound interpretable but could arise from tiny differences if measurement precision is high or from larger differences under another distribution. Pair the index with the scale and clinical threshold.

### Multiple comparisons and covariates

With more than two groups, a significant Kruskal–Wallis test may be followed by pairwise rank-sum tests, but the family of comparisons requires adjustment. Dunn’s test uses pooled ranks and can be appropriate for pairwise contrasts. If treatment comparisons involve a shared control, a specialized procedure may be more efficient. Covariate adjustment is not achieved by running separate rank tests within strata; a regression model or stratified estimand is needed.

### What “nonparametric” leaves assumed

Rank tests avoid a specific normal outcome distribution, but they still assume correct independent units, exchangeability under the null, and valid measurement. They can be sensitive to clustering and selection just like mean tests. Nonparametric does not mean assumption-free.

### Final interpretation

Mann–Whitney and signed-rank procedures are valuable when their rank-based questions match the clinical objective. Identify independent versus paired structure, state whether a shift interpretation needs common shape or symmetry, and present a defined effect measure. Ranks can make inference less sensitive to extreme magnitude, but they do not remove design assumptions or make results automatically interpretable as medians.

### Direction, ties, and effect conventions

Different definitions orient the U statistic toward group one or group two. Some rank-biserial correlations reverse sign under group swapping; the p-value does not. State which group is subtracted or which probability is estimated. Half-credit for ties is conventional for the probability index, but other rank measures may handle ties differently. Include this definition where readers might calculate the result independently.

### Final interpretation

Rank tests describe ordering under a defined null. Their value depends on matching that ordering question to the clinical objective and respecting independent or paired structure. Explain shape assumptions, ties, zeros, effect conventions, and interval method. Do not let “nonparametric” replace a precise statement of the estimand.

For independent samples, report probability-of-superiority orientation explicitly, for example P(recovery time in A is shorter than in B), counting ties by one-half. That plain-language definition prevents ambiguity when software reports U or W under different conventions.

For paired signed-rank results, state whether positive difference means improvement, and include the number of zero differences. If a location-shift interpretation is made, discuss the symmetry assumption on paired differences. A test statistic without this coding information can be impossible to interpret clinically.

When many observations tie, report the tie-aware asymptotic or permutation method. Exact algorithms that assume continuous outcomes may not apply directly.

### Read a nonsignificant result carefully

A nonsignificant rank test does not establish stochastic equality or a zero location shift. Inspect the interval for the selected effect summary and the number of ties/discordances. Sparse or coarse data can leave substantial differences unresolved.

## References and further reading

- Mann HB, Whitney DR. [On a test of whether one of two random variables is stochastically larger than the other](https://doi.org/10.2307/3001968). *The Annals of Mathematical Statistics*. 1947;18(1):50–60.
- Wilcoxon F. [Individual comparisons by ranking methods](https://doi.org/10.1214/aoms/1177730491). *Biometrics Bulletin*. 1945;1(6):80–83.
- Lang TA, Altman DG. [The SAMPL guidelines](https://www.equator-network.org/reporting-guidelines/sampl/), statistical reporting guidance.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis
  and Other Advanced Topics*. Brooks/Cole.
- Agresti A. *Categorical Data Analysis*. Wiley.
- The [Kruskal–Wallis article](/biostatistics-library/comparisons/kruskal-wallis-test.html) extends the rank approach to three or more groups.
