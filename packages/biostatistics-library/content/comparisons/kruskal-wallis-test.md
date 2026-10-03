---
title: Kruskal–Wallis test
summary: A rank-based omnibus test for whether three or more independent groups differ in distribution.
---

## Overview and key ideas

The Kruskal–Wallis test is the nonparametric counterpart of one-way ANOVA.
It asks whether three or more independent groups come from the same
distribution, using only the ranks of the observations rather than the raw
values.

The procedure is straightforward:

- Pool all N observations across the k groups and rank them 1 to N
  (assigning average ranks for ties).
- Sum the ranks within each group, giving rank sums R1, R2, ..., Rk.
- The test statistic H measures how unevenly those rank sums are spread
  relative to what chance would produce: H = (12 / N(N+1)) × Σ(Rj²/nj)
  − 3(N+1), where nj is the size of group j.
- Under the null hypothesis that all groups share the same distribution, H
  is approximately chi-square distributed with k − 1 degrees of freedom
  (exact tables or permutation p-values are preferred for small samples).

A large H means at least one group's values tend to occupy a different part
of the overall ordering than the others — for example, one group is
consistently higher than the rest. Like ANOVA, a significant result is only
an omnibus signal: it tells you the groups are not all alike, not which
pairs differ. Follow up with pairwise rank comparisons (e.g. Dunn's test
with a multiple-comparison adjustment) if the design justifies it.

For two groups the Kruskal–Wallis test is algebraically equivalent to the
Mann–Whitney test, so the choice between the two is simply k = 2 versus
k ≥ 3.

## When to use it

| Setting | Example question |
| --- | --- |
| Skewed continuous outcome, 3+ groups | Does viral load at week 4 differ across four treatment regimens? |
| Ordinal severity scale, multiple arms | Do three rehabilitation programmes produce different ordinal pain-severity ratings? |
| Outlier-prone biomarker | Does a liver enzyme differ across four BMI categories when values are heavily right-skewed? |
| Dose levels | Do the three dose levels of an antihypertensive differ in the magnitude of BP fall? |

Use the Kruskal–Wallis test when you have three or more independent groups
and the outcome is continuous but skewed, contains extreme outliers, or is
measured on an ordinal scale. For paired or repeated measurements use
Friedman's test instead; for exactly two groups the Mann–Whitney test is the
direct equivalent.

## Assumptions and limitations

- **Independence** — each subject belongs to exactly one group, and subjects
  are independent. Repeated measures, matched samples, or clustering
  (several patients per clinic) violate this and require Friedman's test,
  mixed models, or cluster-robust methods.
- **No normality required**, but the null hypothesis is that all k
  distributions are identical. If the groups differ in shape or spread as
  well as location, a significant H does not by itself mean the medians
  differ. When the distributions have similar shapes, the test is effectively
  a test of a common shift in location.
- **Small samples** — with very small groups (e.g. fewer than 5 per arm) the
  chi-square approximation is poor; use exact or permutation-based
  p-values, and be aware the test has limited power to separate more than
  one group from the rest.
- **Ties** — common in ordinal or rounded data; standard tie-corrected
  formulas handle them, but extensive tying reduces the effective sample
  size and the discrimination of the test.
- **The test is omnibus only.** It does not tell you which pairs of groups
  differ. Pre-specify pairwise follow-up comparisons (with a
  multiple-comparison adjustment such as Bonferroni or Holm) rather than
  exploring all pairs post hoc without correction.

## Worked example

A study randomised 36 patients to three smoking-cessation strategies
(n = 12 each). Six months later, the number of quit attempts (a skewed
count-like outcome, range 0–14) was recorded.

- Group A (counselling only): ranks sum R1 = 132
- Group B (nicotine patch): ranks sum R2 = 186
- Group C (combination therapy): ranks sum R3 = 252

H = (12 / (36 × 37)) × (132²/12 + 186²/12 + 252²/12) − 3 × 37
  = (12/1332) × (1452 + 2883 + 5292) − 111
  = (0.00901) × 9627 − 111
  = 86.7 − 111 = 25.7 (illustrative; exact value depends on tie correction)

With 2 degrees of freedom, H = 25.7 gives p < 0.001. The three strategies
do not all produce the same distribution of quit attempts. Dunn's test with
Holm adjustment separates group C from both A and B (p < 0.01 for each),
while A and B do not differ (p = 0.31). Combination therapy is associated
with a markedly higher number of quit attempts at 6 months than either
single strategy.

## Interpretation and common pitfalls

- **Significant H ≠ all pairs differ.** With k = 4 groups, one elevated
  group can drive the omnibus result while the other three are
  indistinguishable. Report the group medians and IQRs, and follow up with
  pre-planned pairwise comparisons if the clinical question requires it.
- **This is not a test of medians.** The null is identical distributions.
  Reporting "the medians differ significantly (Kruskal–Wallis p = ...)"
  overstates the inference; present the medians as descriptive summaries and
  state the null hypothesis explicitly.
- **Do not use Kruskal–Wallis just because n is small.** With large samples
  and roughly normal data, one-way ANOVA is more powerful. The rank test is
  preferable when normality is genuinely doubtful or the outcome is ordinal.
- **Post hoc without adjustment inflates type I error.** Running k(k−1)/2
  unadjusted pairwise Mann–Whitney tests after a significant omnibus result
  can produce false positives; apply Bonferroni, Holm, or Dunn's corrected
  procedure.

## References and further reading

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis
  and Other Advanced Topics*. Brooks/Cole.
- Bland J, Altman D. *Statistics with Confidence*. BMJ Books.
- The topic map's "Mann–Whitney and Wilcoxon tests" article covers the
  two-group counterpart of this test.
