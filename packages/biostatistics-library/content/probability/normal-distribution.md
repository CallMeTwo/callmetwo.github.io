---
title: Normal distribution
summary: The symmetric bell-shaped distribution, its role in reference ranges and z-scores, and how to check whether data deserve it.
---

## Overview and key ideas

The **normal (Gaussian) distribution** with mean μ and standard deviation σ is the
symmetric bell-shaped distribution that appears throughout biology — both as the
shape of measured variables and as an approximation for sampling distributions.
Its practical properties:

- About **68%** of values fall within μ ± σ, **95%** within μ ± 1.96σ, and
  **99.7%** within μ ± 3σ.
- Any value can be standardised to a **z-score**: z = (x − μ) / σ. A z-score is
  how many standard deviations x lies from the mean; under a true normal model it
  follows the standard normal distribution.
- **Reference ranges** (e.g. laboratory "normal" intervals) are typically built
  as the central 95%: μ ± 1.96σ.
- The normal distribution is unbounded in both directions, so for quantities
  that cannot be negative or zero (counts, concentrations), it is a model, not a
  law — often after a log transformation.

## When to use it

| Setting | Example question |
| --- | --- |
| Reference intervals | What systolic blood pressure range covers the central 95% of a reference population? |
| Z-scores and growth charts | Is a child's height unusual for age and sex? |
| Dose–response and thresholds | What proportion of patients exceeds a treatment threshold if the variable is approximately normal? |
| Checking other methods | Is the outcome approximately normal enough for a t-test or a parametric model? |

## Assumptions and limitations

- **Many clinical variables are not normal.** Skewed examples — CRP, waiting
  times, lengths of stay, income, most biomarkers in undiagnosed populations —
  should not be summarised with a mean and SD, and thresholds computed as
  mean ± k×SD are misleading.
- **Check before assuming:** a Q–Q plot, the pattern of mean vs median and
  skewness, and a histogram are the standard diagnostic tools. A log or other
  transformation often restores approximate normality.
- The 68–95–99.7 rule is exact only for a true normal; it is a rough guide for
  "approximately normal" data.
- Using the normal model for a single subject's value (e.g. judging one lab
  result) is different from using it for a *distribution of sample means* — the
  latter is covered by the central limit theorem and is far more forgiving.

## Worked example

In a clinic population, systolic blood pressure has mean μ = 120 mmHg and
standard deviation σ = 15 mmHg, approximately normally distributed.

- Proportion above the hypertension threshold of 140: z = (140 − 120)/15 =
  1.33, so P(X > 140) = 1 − Φ(1.33) = 1 − 0.9082 ≈ 0.092, or about 9% of
  patients.
- The central 95% reference interval is 120 ± 1.96 × 15, i.e. roughly
  90.6 to 149.4 mmHg.

Interpretation: about 1 in 11 people in this population would exceed 140 mmHg
purely from the spread of values, even though the mean is 120 — which is why
reference ranges are wider than most people expect, and why a single high
reading is not the same as a diagnosis. The same calculation with a skewed
distribution (say, one with a long upper tail) would put far more than 9% above
140, so the shape matters.

## Interpretation and common pitfalls

- **Assuming normality without checking** — a Q–Q plot with heavy tails or a
  marked skew should stop the analysis, not start it.
- **Confusing SD with SE** — SD describes the spread of individual values; the
  standard error (SD/√n) describes the uncertainty of the *mean*. Reference
  ranges use SD; confidence intervals use SE.
- **Mean ± 2SD is not "normal"** — it is the central 95% of a *reference*
  population, not a disease threshold, and it is only valid if the distribution
  is actually symmetric.
- **Applying z-scores outside their reference population** — a z-score of +1 in
  children is not +1 in elderly adults; the mean and SD used must match the
  group being compared against.

## References and further reading

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland JM, Altman DG. *Medical Statistics: A Companion Guide*. Nelson.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Biostatistics*. Pearson.

*The "Sampling distributions and the central limit theorem" article in this
library explains why sample means are normal even when individual values are not
(article planned).*
