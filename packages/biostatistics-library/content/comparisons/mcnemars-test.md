---
title: McNemar’s test
summary: A paired test for changes in a binary outcome before and after treatment, or between two matched measurements.
---

## Overview and key ideas

McNemar's test compares a binary outcome measured twice on the same subjects —
before and after an intervention, or under two matched conditions. It ignores
the subjects whose outcome did not change and focuses only on those who changed
between the two measurements, asking whether changes in one direction are
as common as changes in the other.

Arrange the data in a 2×2 table of paired outcomes:

|  | After: yes | After: no |
| --- | --- | --- |
| Before: yes | a | b |
| Before: no | c | d |

The two off-diagonal cells are the "discordant" pairs — subjects who changed
from yes to no (b) or from no to yes (c). McNemar's statistic is

    chi-square = (b - c)^2 / (b + c)

on 1 degree of freedom, or for small discordant counts a signed binomial test
of b against c. The concordant cells (a and d) carry no information about the
direction of change.

## When to use it

| Setting | Example question |
| --- | --- |
| Before-and-after intervention | Did a smoking-cessation programme change the quit rate among the same 200 patients? |
| Matched diagnostic comparison | Do two screening tests disagree on the same cohort in a systematic direction? |
| Left-right or paired sites | Is disease more common in one eye than the other in the same patients? |
| Repeated binary measurement | Did a policy change alter the proportion of patients receiving a recommended care? |

Use it whenever the two measurements are on the *same* units; a plain chi-square
test would be wrong because it treats paired observations as independent.

## Assumptions and limitations

- **Paired data** — the two measurements must come from the same subjects or
  matched pairs; applying McNemar's to independent samples is a design error.
- **Binary outcome** — the method is defined for a two-category result; more
  categories need a different marginal-homogeneity test (e.g. Stuart–Maxwell).
- **Independence between pairs** — pairs themselves must be independent;
  clustering within pairs is not accommodated.
- **Discordant counts must be adequate** — the large-sample chi-square form is
  unreliable when b + c is small (often below 25); use the exact binomial form
  in that case.
- **It tests marginal change, not agreement** — McNemar's asks whether the two
  marginals differ, not whether the two measurements agree; use Cohen's kappa
  for agreement.

## Worked example

In 215 patients with hypertension, 120 had a blood pressure above target before
a medication change and 95 were at target. After six months, 70 of the 120 who were
previously above target were still above target (a = 70) and 50 fell to target
(b = 50); of the 95 who were at target, 15 went above target (c = 15) and 80
stayed at target (d = 80). The discordant pairs are b = 50 and c = 15. McNemar's
statistic is (50 - 15)^2 / (50 + 15) = 1225 / 65 ≈ 18.8, giving a p-value well
below 0.001: far more patients moved from above target to at target than the
reverse. The marginal proportion above target changed from 120/215 = 55.8% to
85/215 = 39.5%, a decrease of 16.3 percentage points. This before-and-after
association alone does not establish that the medication change caused the
improvement; secular changes and co-interventions remain possible.

## Interpretation and common pitfalls

- McNemar's tests whether the *proportion* changed, not whether the two
  measurements agree — a non-significant result does not mean the two tests are
  interchangeable; check agreement with kappa or a kappa-style measure.
- Do not use an independent-samples test (chi-square, two-proportion z) on
  paired data — it ignores the pairing and gives a wrong p-value.
- When the number of discordant pairs is small, use the exact binomial version
  rather than the chi-square approximation.
- Report the paired proportions (e.g. 48% before, 28% after) and the change,
  not just the p-value, so the size of the shift is visible.

## References and further reading

- McNemar Q. [Note on the sampling error of the difference between correlated proportions or percentages](https://doi.org/10.1007/BF02295996). *Psychometrika*. 1947;12:153–157.
- Agresti A. *An Introduction to Categorical Data Analysis*. 3rd ed. Wiley, 2018.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis
  and Other Advanced Topics*. Brooks/Cole.
