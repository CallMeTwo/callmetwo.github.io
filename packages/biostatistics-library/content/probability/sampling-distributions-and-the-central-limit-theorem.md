---
title: Sampling distributions and the central limit theorem
summary: Why sample means are approximately normal, how the standard error shrinks with sample size, and what this means for confidence intervals.
---

## Overview and key ideas

A **sampling distribution** is the distribution of a statistic (mean, proportion,
difference) you would observe if you repeated your study many times, drawing a
fresh sample each time. For the sample mean X̄ of n independent observations from a
population with mean μ and standard deviation σ:

- The mean of the sampling distribution is μ.
- Its standard deviation is the **standard error**, SE = σ / √n.
- By the **central limit theorem (CLT)**, the shape of this sampling distribution
  is approximately normal, *regardless of the population's own shape*, provided
  n is sufficiently large.

This is the engine behind virtually all inferential statistics: confidence
intervals for the mean (X̄ ± 1.96 × SE when the CLT applies), hypothesis tests,
and the fact that a single sample mean is an *estimate with a known precision*,
not a fixed truth.

## When to use it

| Setting | Example question |
| --- | --- |
| Confidence intervals | How precisely does our sample mean estimate the population mean HbA1c? |
| Study design | How large a sample is needed so the estimate is within a clinically meaningful margin of error? |
| Meta-analysis | Each study's effect estimate is a sample statistic with a known SE; the CLT justifies pooling them. |
| Quality control | Monitoring a clinic's mean waiting time across successive months' samples. |

## Assumptions and limitations

- **Independence of observations** — repeated measures on the same patient, or
  clustered data (patients within the same clinic), violate it; the effective n
  is smaller than the raw count.
- **"Sufficiently large" n is context-dependent.** A rough rule is n ≥ 30 for
  mildly skewed data; strongly skewed populations (waiting times, some
  biomarkers) may need n in the hundreds for the normal approximation to be safe.
- The CLT applies to the **mean** (and, with care, to proportions when n·p and
  n·(1−p) are both adequate), not to every statistic — medians and maximums need
  different arguments.
- The CLT describes the *sampling* distribution, not the raw data. The data may
  be skewed, bimodal, or count-like; the distribution of the mean is what
  becomes normal.

### When the CLT approximation is and is not enough

For independent observations with finite variance, the CLT gives an
asymptotic approximation, not a universal sample-size cutoff. Strong skew,
heavy tails, rare binary outcomes and influential observations can require
much larger samples. For a sample proportion, the normal approximation needs
both expected successes np and failures n(1−p) to be adequate; exact or score
intervals behave better near 0 or 1. With clustered observations, the relevant
uncertainty includes the design effect; with serial correlation, the nominal n
overstates independent information. A bootstrap can estimate sampling
uncertainty for some statistics, but it still requires a resampling scheme
that respects the study design and cannot fix biased sampling.

## Worked example

In a diabetes clinic, HbA1c values are somewhat right-skewed, with population
mean μ = 7.5% and standard deviation σ = 2.0%. A sample of n = 49 patients gives
a sample mean X̄.

- SE = 2.0 / √49 = 2.0 / 7 ≈ 0.286.
- By the CLT, X̄ is approximately N(7.5, 0.286²).
- The chance the sample mean reaches 7.8% or more is P(Z ≥ (7.8 − 7.5)/0.286) =
  P(Z ≥ 1.05) ≈ 0.147.

Interpretation: even if the true clinic mean is exactly 7.5%, about 15% of
samples of 49 patients would have a mean of 7.8% or higher purely by sampling
variation. A single sample mean of 7.8% therefore does not by itself prove the
clinic's mean is that high — the SE (and hence a confidence interval) is what
separates a real difference from noise. Doubling the sample size to 196 would
halve the SE to 0.143, showing the √n law: precision grows with the square root
of n, so quadrupling n is needed to halve the uncertainty again.

## Interpretation and common pitfalls

- **Confusing SD with SE** — the SD (2.0%) describes individual patients; the
  SE (0.286) describes the sample mean. Quoting the wrong one changes the
  confidence interval by a factor of √n.
- **"CLT means the data are normal"** — it does not. The CLT is a statement
  about the distribution of a *statistic across repeated samples*, not about the
  raw measurements in one sample.
- **Small n with strong skew** — with n = 10 and a heavily skewed outcome, the
  sampling distribution of the mean can still be far from normal, and t-tests or
  normal-based intervals can mislead; exact or resampling methods are safer.
- **Ignoring dependence** — treating correlated observations (repeat measures,
  clustered sampling) as independent inflates the effective n and makes
  confidence intervals too narrow.

## References and further reading

- NIST/SEMATECH. [Normal distribution and central limit theorem](https://www.itl.nist.gov/div898/handbook/eda/section3/eda3661.htm).
- Rice JA. *Mathematical Statistics and Data Analysis*. 3rd ed. Cengage Learning; 2006.

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland JM, Altman DG. *Medical Statistics: A Companion Guide*. Nelson.
- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott Williams & Wilkins.

The articles on estimation and confidence intervals in this library build on
these sampling-distribution ideas.
