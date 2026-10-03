---
title: Point estimates and standard errors
summary: A single number from the sample estimates an unknown population quantity, and the standard error measures how much that estimate varies from sample to sample.
---

## Overview and key ideas

A **point estimate** is a single number computed from the data and used as the best summary of an unknown population quantity: the population mean, a proportion, a risk difference, or a regression coefficient. The most familiar examples are the sample mean (x-bar) and the sample proportion (p-hat). Because different samples contain different patients, a point estimate is itself a random quantity: repeat the same study and you will get a different number.

The **standard error (SE)** quantifies that sampling variability. For the mean of n independent observations with sample standard deviation s:

- SE of the mean = s / sqrt(n)
- SE of a proportion p-hat = sqrt(p-hat (1 - p-hat) / n)
- The SE shrinks as 1/sqrt(n): quadrupling the sample size halves the SE.

The SE plays two roles. It underpins the confidence interval (estimate +/- 1.96 x SE for a 95% CI) and the test statistic (the estimate divided by its SE, giving a z or t value). It measures *precision*, not accuracy: a biased estimate can have a small SE and still sit far from the truth.

For comparisons, the SE of a difference is needed. If two independent samples of size n have sample standard deviations s1 and s2, the SE of the difference in means is sqrt(s1^2/n1 + s2^2/n2), and the same logic gives the SEs for risk differences and, on the log scale, for risk and odds ratios. A good habit is to always report the estimate together with either its SE or, preferably, its confidence interval, so that the reader sees both the centre and the spread of the estimate at a glance.

## When to use it

Whenever you report an estimate from a sample and want readers to judge how stable it is:

| Setting | Example question |
| --- | --- |
| Randomised trial | What is the estimated mean change in systolic blood pressure, and how precisely is it estimated? |
| Diagnostic accuracy study | What is the estimated sensitivity of this blood test for acute coronary syndrome? |
| Cohort study | What is the estimated 10-year cardiovascular risk among exposed participants? |
| Subgroup analysis | How precisely is the treatment effect estimated in the small subgroup of patients over 80? |

## Assumptions and limitations

- The formula SE = s/sqrt(n) is exact when the data are normal and the observations are independent. For skewed data with small n it understates the error, and the sampling distribution of the mean may not be close to normal.
- The proportion formula is a large-sample binomial approximation. It behaves poorly when the expected number of events, n x p-hat, or non-events, n x (1 - p-hat), is small; use an exact binomial approach instead.
- The SE assumes the sample is a valid (random or representative) draw of the target population. No choice of SE formula can compensate for selection bias.
- With correlated data - repeated measures on the same patient, cluster randomisation, related family members - the naive SE is too small, because the effective sample size is less than n.

## Worked example

A clinic measures fasting plasma glucose in 36 newly diagnosed type 2 diabetes patients and reports a mean of 8.4 mmol/L with a standard deviation of 2.7 mmol/L. The standard error of the mean is 2.7 / sqrt(36) = 2.7 / 6 = 0.45 mmol/L. Interpreted correctly, this means that if the clinic repeated the same 36-patient survey many times, the sample means would scatter around the true population mean with a standard deviation of about 0.45 mmol/L - it does *not* mean that individual patients' glucose values lie within 0.45 of the mean (that is what the SD of 2.7 describes). If the study had enrolled 144 patients instead of 36, the SE would fall to 2.7 / 12 = 0.225 mmol/L, halving the uncertainty about the estimated mean.

## Interpretation and common pitfalls

- **Confusing SD with SE.** The SD (2.7) describes spread among individual patients; the SE (0.45) describes uncertainty about the estimated mean. Report the SD for descriptive purposes and the SE or confidence interval when the question concerns the population parameter.
- **"The SE is the measurement error."** It is the sampling variability of the estimator. Assay imprecision and missing data contribute to bias and precision in different ways that the SE does not capture.
- **Combining SEs carelessly.** The SE of a ratio such as a rate ratio is not obtained by dividing the SEs of the numerator and denominator; use a model or the delta method.
- **Precision without accuracy.** A small SE only says the estimate is reproducible across samples; if the design is biased, every sample consistently lands in the wrong place.

## References and further reading

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott-Raven.
- The topic map's "Statistical inference" section develops confidence intervals built on the standard error (article planned).
