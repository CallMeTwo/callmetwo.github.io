---
title: Analysis of variance (ANOVA)
summary: Comparing the means of three or more groups with a single F-test, then locating which pairs differ.
---

## Overview and key ideas

When you want to compare the means of three or more groups, a string of
pairwise t-tests inflates the type I error rate (three comparisons at 5% each
give about a 14% chance of at least one false positive). One-way analysis of
variance (ANOVA) makes a single omnibus test of whether all group means are
equal by partitioning the total variation into two components:

- **Between-group variation** — how far each group mean lies from the overall
  mean, summarised by MS_between = SSB / (k − 1).
- **Within-group variation** — the scatter of individuals around their group
  mean, summarised by MS_within = SSW / (N − k).

Under the null hypothesis that all k group means are equal, the ratio
F = MS_between / MS_within follows an F distribution with (k − 1, N − k)
degrees of freedom. A large F means the group means are more spread out than
can be explained by the within-group scatter alone. If the omnibus test is
significant, a post-hoc procedure (e.g. Tukey's HSD) identifies which pairs
of groups differ while controlling the family-wise error rate.

ANOVA is not a different kind of question from the t-test: for exactly two
groups it is algebraically equivalent (F = t²). It extends the same logic to
k groups, and to two-way designs (e.g. treatment × sex) that add main effects
and an interaction term.

## When to use it

| Setting | Example question |
| --- | --- |
| Multi-arm clinical trial | Do three glucose-lowering strategies produce different HbA1c at 12 months? |
| Dose-response study | Does the outcome differ across four dose levels of the same drug? |
| Two-way design | Do readmission rates differ by hospital and by patient age group, and do they interact? |
| Quality improvement | Are length-of-stay distributions equivalent across four surgical units? |

Use one-way ANOVA for one factor with three or more independent groups. Use
two-way ANOVA when you want to model two factors and their interaction
simultaneously. For non-normal or ordinal outcomes use the Kruskal–Wallis
test instead; for repeated measurements within subjects use
repeated-measures ANOVA.

## Assumptions and limitations

- **Independence** — each subject contributes exactly one observation.
  Repeated measures, matched groups, or clustering violate this and need
  repeated-measures ANOVA, mixed models, or cluster-robust methods.
- **Approximate normality within groups** — the F-test is reasonably robust
  for moderate sample sizes; with small or heavily skewed groups, extreme
  outliers can distort the result. Check group boxplots or Q–Q plots.
- **Homogeneity of variances** — the groups should have similar variances.
  With roughly equal group sizes the F-test tolerates mild
  heteroscedasticity; with very unequal n and unequal variances, Welch's
  ANOVA is the safer default. Levene's test screens for variance
  differences.
- **Fixed vs random effects** — the classical one-way ANOVA treats group
  membership as fixed (you care about exactly these k groups). If the groups
  are a random sample from a larger population, a random-effects model
  changes both the hypothesis and the test.

The test tells you only that *some* means differ, not which ones or by how
much — plan your post-hoc comparisons before looking at the data.

## Worked example

A 12-month trial randomised 30 type 2 diabetes patients to three
glucose-lowering strategies (n = 10 per arm). Mean HbA1c at 12 months was
7.0% (standard care), 6.5% (drug A) and 6.0% (drug B), with each group's SD
about 0.7.

- SSB = 10[(7.0 − 6.5)² + (6.5 − 6.5)² + (6.0 − 6.5)²] = 5.0, so
  MS_between = 5.0 / 2 = 2.5
- SSW = 27 × 0.7² = 13.23, so MS_within = 13.23 / 27 = 0.49
- F(2, 27) = 2.5 / 0.49 = 5.1, p ≈ 0.013

The three strategies do not all give the same mean HbA1c. Tukey's HSD (with
a critical difference of about 0.78%) separates standard care from drug B
(1.0% apart, significant) but not the other pairs: drug A and drug B (0.5%
apart) are not distinguishable at this sample size. Report all three group
means with 95% CIs, not just the F statistic.

## Interpretation and common pitfalls

- **A significant ANOVA is not the end of the analysis.** It only says at
  least one mean differs; without post-hoc comparisons you cannot say which.
- **Do not "test down" with unadjusted pairwise t-tests.** Running all
  pairwise t-tests after a significant ANOVA inflates the type I error; use
  Tukey, Dunnett (versus a single control), or pre-planned contrasts.
- **Unequal group sizes are a risk factor.** Very unequal n combined with
  unequal variances can make the F-test anti-conservative or
  over-conservative — check Levene's test and consider Welch's ANOVA.
- **ANOVA compares means, not variances.** If the groups differ mainly in
  spread rather than location, the F-test can mislead; inspect the
  distributions before interpreting.

## References and further reading

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Chow S, Lu J, Jehessel M. *Design and Analysis of Clinical Trials*. Wiley.
- Bland J, Altman D. *Statistics with Confidence*. BMJ Books.
- The topic map's "Multiple testing" section develops post-hoc correction
  in detail (article planned).
