---
title: Kruskal–Wallis test
summary: A rank-based omnibus test for whether three or more independent groups differ in distribution.
---

## Overview

The Kruskal–Wallis test is a rank-based omnibus procedure for comparing k independent groups. It pools observations, ranks them, and tests whether rank distributions differ more than expected under exchangeability. It is often introduced as a nonparametric alternative to one-way ANOVA, but it does not generally test equality of medians. A location-shift interpretation requires similarly shaped distributions across groups.

## Rank sums and H statistic

Let Rᵢ be the rank sum in group i, nᵢ its sample size, and N total observations. The statistic H≈[12/(N(N+1))]Σ(Rᵢ²/nᵢ)−3(N+1), with a tie correction when repeated values occur. Under the null and suitable sample size, H is compared with chi-square(k−1). For small samples, exact or permutation inference may better match the discrete rank distribution.

### Worked example with ordinal severity

Suppose three independent care pathways yield pain scores on a bounded 0–10 scale, with marked skew and ties. Rather than comparing arithmetic means by default, the clinical team may ask whether outcome ordering differs across pathways. After ranking all scores, imagine n=(10,10,10), rank sums=(390,300,240), N=30. The uncorrected H equals 12/(30×31)×(390²/10+300²/10+240²/10)−93 ≈3.87. With 2 df, the asymptotic p-value is about .14. This illustrative calculation does not establish equal distributions; precision may be weak.

```r
score <- c(2,3,4,4,5,5,6,6,7,8,
           1,2,3,3,4,4,5,6,6,7,
           0,1,2,2,3,3,4,4,5,6)
pathway <- factor(rep(c("A", "B", "C"), each = 10))
kruskal.test(score ~ pathway)
```

R handles ties in the statistic. The simulated values shown here are only a compact demonstration; do not use a significant omnibus result alone to claim which pathway performs better.

### What alternatives does it answer?

The test is sensitive to differences in rank distributions. If one group has greater variability or a different shape, H may be significant even when medians coincide. If the scientific estimand is a mean difference, robust or permutation-based mean inference may preserve that target better. If the outcome is ordinal, cumulative-link models can use ordering while adjusting for covariates and expressing cumulative odds under a proportional-odds assumption.

Groups must be independent. Repeated measures require Friedman’s test or a longitudinal model; clustered data require dependence-aware methods. Ties are common in discrete clinical scales and reduce effective information; software correction addresses the statistic but does not restore distinctions absent from the measurement scale.

### Follow-up without fishing

A significant H indicates at least one group differs in rank distribution. Follow-up pairwise comparisons, such as Dunn tests, need multiplicity control. Report pairwise effect estimates and intervals, not merely a list of adjusted p-values. Useful effect summaries include probability of superiority or rank-based epsilon-squared, with definitions stated. Present medians and IQRs for description, but do not imply the omnibus test is specifically a median test unless its assumptions support that interpretation.

Predefine the outcome scale, contrast family, and analysis strategy. Avoid choosing Kruskal–Wallis only because a normality test crossed .05. Explain the target quantity, distribution shape, ties, sample sizes, and how adjusted follow-up was conducted. For clinical interpretation, translate rank evidence into absolute scale summaries and patient-relevant thresholds.

## Worked rank calculation

Suppose three independent groups have observations A=(1,2,4), B=(3,5,6), C=(7,8,9). Pool and rank from 1 to 9; rank sums are 6, 15, and 24. With nᵢ=3 and N=9, H=[12/(9×10)](6²/3+15²/3+24²/3)−3×10=7.2. Against chi-square with 2 df, p≈.027. The result indicates different rank distributions; here the ordered pattern suggests group C tends higher. The tiny example is illustrative and the exact/permutation distribution is preferable for such small groups.

```r
score <- c(1, 2, 4, 3, 5, 6, 7, 8, 9)
group <- factor(rep(c("A", "B", "C"), each = 3))
kruskal.test(score ~ group)
```

Base R uses an asymptotic chi-square approximation with tie correction. The `exact` argument is not generally available for the multi-group Kruskal test in base R; use an appropriate permutation or exact implementation for small samples. Avoid code that suggests unsupported arguments. With ties, ranks are averaged and the statistic receives a correction; ordinal scores commonly have many ties.

## Tie correction and information

If tied observations occupy ranks that would otherwise be distinct, assign average ranks. The uncorrected H variance is reduced by ties, so multiply by a correction factor based on tie-group sizes: C=1−Σ(t³−t)/(N³−N). The corrected statistic is H/C. When all observations are tied, C=0 and the data contain no rank information for comparing groups. Statistical software applies this correction automatically.

Ties are not a nuisance that can always be removed. A 0–10 pain score is ordinal/coarsened; many patients may report the same integer value. The rank test respects ordering but cannot recover distinctions that the scale does not measure. Report group counts at each value or distribution plots, not only median and IQR.

## Effect sizes and pairwise follow-up

A significant omnibus test identifies that at least one group distribution differs. Dunn’s pairwise rank-sum comparisons or pairwise Mann–Whitney tests with Holm adjustment can locate differences, but the family and adjustment should be declared. Report pairwise probability-of-superiority estimates, rank-biserial correlations, or Hodges–Lehmann shift estimates with intervals where suitable. These effect measures have distinct interpretations and require explicit definitions.

An epsilon-squared estimate can summarize omnibus rank effect, but small-sample bias and formulas differ across implementations. It should not replace raw outcome summaries. If shapes differ, a significant rank contrast need not correspond to a shift in typical value; compare distribution plots and quantiles.

## Covariates and complex designs

The basic Kruskal–Wallis test cannot adjust for age, baseline severity, or site. If covariate adjustment is needed, use quantile regression, ordinal regression, aligned-rank methods, or a permutation procedure that respects the design and targets the estimand. For repeated measures, Friedman’s test or a longitudinal model is needed; for clustered data, dependence-aware methods are required. Rank transformation alone does not make a model robust to clustering or confounding.

## Planning and reporting

Power depends on the distributions, ties, group allocation, and alternative pattern, so simulation using plausible outcome distributions is often more reliable than a universal formula. Report n per group, medians/IQRs or full distributions, H statistic, df, p-value, tie handling, and adjusted post hoc contrasts. State that the test compares rank distributions. Do not call it a “test of medians” unless group distributions are similarly shaped and a location-shift interpretation is reasonable.

## Comparing ranks with means and medians

Kruskal–Wallis can be viewed as comparing group mean ranks. Its test is sensitive to whether observations from one group tend to occupy higher pooled ranks than observations from another. If all group distributions have the same shape and spread and differ only by a shift, this often corresponds to a location difference. If spreads differ, ranks can shift even if medians are equal. Thus median (IQR) summaries are descriptive, while the inferential null concerns rank distributions.

For example, group A could be concentrated around 10 with low variability and group B centered at 10 with a few very low and very high values. Their medians can match, yet rank distributions differ. Conversely, distributions can differ in means while rank-order probability remains near one half. Plot empirical distributions and state the effect measure.

## Permutation inference

A permutation test shuffles group labels while preserving group sizes and recalculates H, generating a null distribution under exchangeability. This can improve calibration in small samples, but only if labels are exchangeable under the null and the assignment structure is respected. In a randomized trial, permute according to the actual randomization strata or blocks. For observational data with different covariate distributions, unrestricted permutation is generally invalid.

With B random permutations and b statistics at least as extreme as observed, estimate p=(b+1)/(B+1), avoiding a zero Monte Carlo p-value. Report B and seed when reproducibility matters. As with Monte Carlo exact tests, simulation error can be material near thresholds.

### Ordinal outcomes and cumulative models

For ordered categories such as none/mild/moderate/severe, Kruskal–Wallis treats category order through ranks but ignores covariate adjustment and does not estimate a direct probability at each severity. A proportional-odds model estimates cumulative odds of being at or above thresholds, assuming a common odds ratio across cut points. Check that assumption; partial proportional odds or multinomial models may be needed if effects vary by threshold. These models preserve ordinal structure and support adjusted treatment contrasts.

A bounded numeric scale with many levels may be analyzed as continuous if the mean difference is meaningful and model behavior acceptable. Kruskal–Wallis can be a useful sensitivity analysis, but switching to it only after a normality-test rejection changes the estimand. Report both analyses only with a clear primary choice and reason.

### Rank effect uncertainty

An omnibus rank effect such as epsilon-squared summarizes separation but has different finite-sample formulas. A probability-index effect between groups can be estimated pairwise; for k groups, there is no single universal probability summary. Bootstrap confidence intervals should resample independent units and, for clustered data, resample clusters. With few observations, intervals can be unstable; show group distributions and avoid overclaiming based on one p-value.

### Practical interpretation of an omnibus result

If H is significant, identify follow-up comparisons in the prespecified family and adjust them. If it is not significant, the study may still lack precision to exclude clinically relevant rank differences. Medians and IQRs alone can hide multimodality or different spreads. Show distributions and report effect estimates with intervals. A rank-based result should be translated back to the original outcome scale wherever possible.

For sample size, simulate ranks from plausible distributions with expected ties and group sizes. This is often more realistic than using a normal-theory power calculation designed for mean differences. State the alternative pattern used because power depends on which groups shift and by how much.

### Interpreting effect size under unequal shapes

The probability of superiority for two groups is P(X>Y)+½P(X=Y), but for k groups an omnibus H statistic aggregates rank separation without a single direction. A pairwise effect may be .65 for A versus B and .50 for A versus C, even when the global test is significant. Report each prespecified contrast with intervals after multiplicity adjustment. If distributions cross, a single location shift can mislead; show empirical cumulative distribution functions or quantile summaries.

### Permutation details and exchangeability

Permutation tests are valid when labels are exchangeable under the null or reflect the original randomized assignment. If groups differ in baseline covariates, unrestricted label shuffling breaks the data structure. In blocked randomization, permute within blocks. For observational data, a covariate-adjusted rank model or a carefully justified residual permutation may be needed; rank transformation itself does not neutralize confounding.

When using Monte Carlo permutations, calculate p=(b+1)/(B+1). The plus-one correction prevents reporting p=0 when no sampled permutation is as extreme. With B=9,999 and p near .05, Monte Carlo uncertainty is roughly √(.05×.95/10,000)=.0022. More iterations can clarify borderline results but cannot fix a mismatched null model.

### Ordinal scales and ties

A five-category symptom scale is ordinal: higher scores mean worse symptoms, but the difference between “none” and “mild” may not equal the difference between “moderate” and “severe.” Rank procedures use ordering and are therefore attractive, but many ties limit information. An ordinal cumulative model provides category-specific probabilities under proportional odds and can adjust covariates. Check proportional odds; if implausible, consider partial proportional odds or multinomial regression. Report estimated category probabilities to restore clinical meaning.

### What the p-value cannot say

A significant H does not reveal whether every group differs, which group is best, or how large the clinical difference is. A nonsignificant H does not imply equal medians or distributions. Follow up only with prespecified or adjusted comparisons and show actual group distributions. Rank evidence is most interpretable when paired with patient-scale summaries.

### Rank method limitations

Ranks discard distance information: gaps of 1 and 20 units both contribute only to ordering. This can help reduce sensitivity to extreme magnitudes but can also lose clinically important size information. On a scale where a 10-point change matters, a raw mean or quantile contrast may be more useful. Use rank procedures when ordering is itself meaningful or robustness justifies the change in target.

### Reporting essentials

Name the independent groups, rank statistic, tie correction, reference distribution or permutation scheme, group sample sizes, follow-up method, and effect summaries. Explain whether the interpretation is about distributional ordering or a location shift. This gives readers enough context to evaluate the result.

### Worked tie example

Suppose three patients in each group receive a 0–4 ordinal score and several observations tie. Assign average ranks for tied values, sum within each group, and apply the tie correction. The rank sums still preserve ordering, but a tie block reduces the statistic’s effective variance. Software’s corrected H should be reported rather than manually applying the uncorrected formula. For transparency, show the score frequencies so the extent of ties is visible.

When sample sizes are small, permute labels under a valid exchangeability scheme and compare H with its simulated null distribution. Keep randomization blocks intact. Exact/permutation inference can improve calibration but remains tied to the chosen null and does not adjust for covariates by itself.

### Relation to ANOVA

One-way ANOVA tests equality of population means under a linear model; Kruskal–Wallis uses pooled ranks and tests distributional ordering. With similarly shaped distributions, it can detect location shifts and may be more robust to heavy tails. It is not universally more powerful when normal assumptions hold, and it does not estimate a mean contrast. Compare methods based on target and design, not a generic parametric/nonparametric hierarchy.

### Complete interpretation

Report observed group summaries, H and degrees of freedom, p-value method, ties, and adjusted pairwise contrasts if undertaken. Explain whether rank ordering aligns with patient benefit. For sparse ordinal categories, consider displaying category probabilities or fitting an ordinal model rather than relying only on a rank summary.

### A complete clinical reporting example

“Pain scores differed in their rank distributions across the three independent care groups (Kruskal–Wallis H=…, df=2, p=…; tie-corrected asymptotic reference). Group medians and IQRs were …; adjusted Dunn comparisons showed … .” Then explain whether the observed ordering corresponds to a clinically meaningful score difference. If no post hoc comparisons were planned, do not select the most favorable pair after the global test.

For an ordinal endpoint with covariate imbalance, an adjusted ordinal model may be the primary method, with Kruskal–Wallis as an unadjusted descriptive comparison. Report proportional-odds diagnostics or alternatives, and give predicted category probabilities to support clinical interpretation.

### Interpretation when distributions cross

If one group has more low scores and also more high scores, while another is concentrated centrally, the rank test may detect a distribution difference despite similar central tendency. A single median contrast will not describe that pattern. Compare empirical CDFs, quantiles, or category probabilities and consider whether the clinical question concerns stochastic ordering, central location, or tail risk. No omnibus rank statistic captures every aspect of distributional difference.

### Final interpretation

Kruskal–Wallis compares independent group rank distributions. It is not a universal median test or a generic fix for nonnormal data. Pair the omnibus statistic with distribution plots, effect summaries, and adjusted follow-up where planned. Explain ties, dependence, and the scale on which clinical meaning is judged.

If the global test motivates pairwise follow-up, predefine the comparison family and use adjusted intervals or p-values. State what the adjustment controls and avoid selecting only pairs that look favorable in the observed medians.

### Robustness is not the same as relevance

The rank transformation limits the influence of the numerical distance between observations, which can help when extreme tails make mean-based summaries unstable. However, if extreme values correspond to severe clinical events, discarding their magnitude can remove important information. Report both the rank inference and clinically meaningful tail summaries where appropriate. For cost or length-of-stay outcomes, mean differences may be central to resource decisions even when distributions are skewed; consider robust inference for the mean rather than replacing the target with ranks.

When the outcome is ordinal, ordering may be the intended scale and rank summaries can be natural. When it is continuous, decide whether the question concerns a typical patient, arithmetic average, or stochastic ordering. The method choice should follow that target, with the test’s assumptions stated clearly.

For very small independent samples, exact permutation inference can be preferable to the chi-square approximation, provided the exchangeability null is defensible. Ties limit the number of distinct reallocations and attainable p-values. State the method and avoid interpreting a coarse p-value as precise evidence.

### Read the statistic alongside the data

The test’s rank logic is easier to evaluate when the report includes group sample sizes, quantiles, and a plot of the observations. A large H can result from a consistent shift or a complex shape difference. The reader should not have to infer the pattern from a p-value alone.

When a follow-up analysis is adjusted for covariates, identify its estimand and method rather than presenting it as a direct continuation of the unadjusted rank test.

This distinction should be made explicit in the interpretation.

## References and further reading

- Kruskal WH, Wallis WA. [Use of ranks in one-criterion variance analysis](https://doi.org/10.1080/01621459.1952.10483441). *Journal of the American Statistical Association*. 1952;47(260):583–621.
- Dunn OJ. [Multiple comparisons using rank sums](https://doi.org/10.1080/00401706.1964.10490181). *Technometrics*. 1964;6(3):241–252.
- Lang TA, Altman DG. [The SAMPL guidelines](https://www.equator-network.org/reporting-guidelines/sampl/), statistical reporting guidance.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis
  and Other Advanced Topics*. Brooks/Cole.
- Bland J, Altman D. *Statistics with Confidence*. BMJ Books.
- The [Mann–Whitney and Wilcoxon article](/biostatistics-library/comparisons/mann-whitney-and-wilcoxon-tests.html) covers the two-group counterpart.
