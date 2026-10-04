---
title: Independent and paired t-tests
summary: Comparing the means of two groups, using separate samples or matched before-and-after measurements from the same subjects.
---

## Overview and key ideas

The t-test asks whether the difference between two group means is larger than
would be expected from sampling variability alone. The test statistic
t = (difference in means) / (standard error of that difference) follows
Student's t distribution with a suitable number of degrees of freedom under
the null hypothesis of no true difference.

Two situations call for two versions:

- **Independent (two-sample) t-test** — the two groups come from separate
  subjects, e.g. a drug arm versus a placebo arm. The variability of each
  group is estimated from its own data, and the difference is compared
  against a combined standard error (classical Student) or an
  uncombined one (Welch's t-test).
- **Paired (matched) t-test** — each subject contributes two measurements,
  e.g. systolic blood pressure before and after treatment, or the two eyes of
  the same patient. The analysis is a one-sample t-test on the n
  within-subject differences, which removes between-subject variability and
  usually gives much more power.

The choice between the two is a design question: does a pairing exist in the
data or not? A paired test on unrelated groups, or an independent test on
clearly paired data, wastes information or misstates the uncertainty.

## When to use it

| Setting | Example question |
| --- | --- |
| Randomised trial, two arms | Does drug A lower systolic BP more than standard care after 12 weeks? |
| Before-and-after study | Does a 4-week exercise programme reduce fasting glucose within the same patients? |
| Matched controls | Does a biomarker differ between cases and age-, sex- and site-matched controls? |
| Contralateral comparison | Is function better in the treated limb than in the untreated limb of the same patient? |

Use the independent version when the groups contain different people, and the
paired version when each subject or matched set produces both measurements.
If treatment was assigned by cluster or several observations come from each
cluster, account for that dependence with a cluster-level analysis or an
appropriate model; a plain t-test on individuals is not enough. If you have
more than two groups, use one-way ANOVA instead of a series of t-tests.

## Assumptions and limitations

- **Independence** — observations within and between groups are independent;
  this is violated by clustered sampling (several patients from the same
  clinic, family members) or by analysing repeated measurements as if they
  were independent.
- **Normality and influential observations** — with small samples, strong
  skewness or influential outliers can make t-based inference unreliable;
  sample size alone does not determine a safe cutoff. For the paired test it
  is the *within-pair differences* that should be plausibly normal. Inspect
  plots and the study design; for larger samples, the sampling distribution
  of the mean is often less sensitive to moderate non-normality, but extreme
  tails and dependence still matter.
- **Equal variances** — the classical Student two-sample t-test assumes equal
  group variances. Welch's t-test, which does not, is the safer default in
  most software and is preferred unless you have a good reason otherwise.
- **Small-sample fragility** — with very small n the p-value can be carried
  by a single outlier; always report the data (means, SDs, ideally a plot)
  alongside the test.

Neither test estimates more than a difference in mean locations: if the two
distributions differ in shape rather than level, the mean difference may not
summarise what you care about.

## Worked example

**Paired example.** In 8 patients with hypertension, diastolic BP (mmHg) was
measured before and after 8 weeks of a new beta-blocker. The within-patient
differences (before − after) were: 4, 6, 5, 8, 7, 6, 9, 3.

- Mean difference d-bar = 6.0 mmHg; SD of the differences s_d = 2.0
- SE = s_d / sqrt(n) = 2.0 / sqrt(8) = 0.71
- t = 6.0 / 0.71 = 8.5 on 7 degrees of freedom, two-sided p < 0.001
- 95% CI for the mean difference: 6.0 ± 2.365 × 0.71 = (4.3, 7.7) mmHg

The treatment lowered diastolic BP by about 6 mmHg on average (95% CI 4.3 to
7.7), a highly significant reduction. Note that the analysis uses only the 8
differences — the before and after values are never compared as two separate
groups, which would have been wrong.

**Independent example.** In a separate parallel-group trial, 8 patients per
arm have individual BP reductions with mean 6.0 mmHg (SD 2.0) on the new drug
and 1.5 mmHg (SD 2.2) on placebo. These are SDs of individual changes within
each independent arm; the SD 2.0 above was calculated from paired changes in
the separate before-and-after example and is not automatically transferable.
Welch's standard error is sqrt(2.0²/8 + 2.2²/8) = 1.05 mmHg, so
t = (6.0 − 1.5)/1.05 = 4.28 with approximately 13.8 degrees of freedom
(two-sided p ≈ 0.0008). Using the corresponding t critical value (about 2.15),
the 95% CI for the difference in mean reductions is about 2.24 to 6.76 mmHg.
This comparison supports a larger average reduction on the drug in this
illustrative sample; it is a different estimand and design from the paired
within-arm test above.

## Interpretation and common pitfalls

- **Pairing is a design feature, not an analysis choice.** If you measured
  the same people twice, use the paired test; choosing the independent test
  because it "gave a cleaner result" is wrong and usually underpowered.
- **Significance is not equivalence.** A non-significant t-test means you
  could not detect a difference, not that the true difference is zero —
  report the confidence interval and consider the study's power.
- **Do not run several t-tests for 3+ groups.** Comparing three arms
  pairwise inflates the family-wise type I error; use one-way ANOVA (or
  pre-planned contrasts) instead.
- **Check the assumptions before trusting small-sample p-values.** A single
  extreme outlier can carry the whole result; look at the data, not just the
  test output.

## References and further reading

- Welch BL. [The generalization of Student's problem when several different population variances are involved](https://doi.org/10.1093/biomet/34.1-2.28). *Biometrika*. 1947;34(1–2):28–35.
- Altman DG, Machin D, Bryant TN, Gardner MJ, eds. *Statistics with Confidence*. 2nd ed. BMJ Books, 2000.
- Lang TA, Altman DG. [The SAMPL guidelines](https://www.equator-network.org/reporting-guidelines/sampl/), basic statistical reporting in biomedical journals.
