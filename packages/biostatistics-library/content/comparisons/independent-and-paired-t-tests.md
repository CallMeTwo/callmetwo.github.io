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

Use the independent version when the groups are different people (or
clusters), and the paired version when each subject or matched set produces
both measurements. If you have more than two groups, use one-way ANOVA
instead of a series of t-tests.

## Assumptions and limitations

- **Independence** — observations within and between groups are independent;
  this is violated by clustered sampling (several patients from the same
  clinic, family members) or by analysing repeated measurements as if they
  were independent.
- **Approximate normality of the outcome** — with small samples (roughly
  n < 20 per group), strong skewness or outliers make the t-test
  unreliable; for large n the central limit theorem makes it robust. For the
  paired test it is the *differences* that should be plausibly normal, which
  is often easier to satisfy than the raw measurements.
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

**Independent example.** In a parallel placebo group (n = 8) the mean
reduction was 1.5 mmHg (SD 2.2). Welch's t-test gives
t = (6.0 − 1.5) / sqrt(2.0²/8 + 2.2²/8) = 4.5 / 1.05 = 4.3, p < 0.001: the
new drug reduces BP more than placebo does.

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

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Chow S, Lu J, Jehessel M. *Design and Analysis of Clinical Trials*. Wiley.
- Bland J, Altman D. *Statistics with Confidence*. BMJ Books.
