---
title: Parameters and statistics
summary: A parameter is a fixed population quantity; a statistic is the number computed from a sample that estimates it.
---

## Overview and key ideas

A **parameter** is a fixed, usually unknown, numerical quantity describing a
population — the true 5-year survival probability of a disease. A
**statistic** is a number computed from a sample — the 5-year survival
observed in your 200 patients. The statistic is the estimate; the parameter
is what it aims at. Conventions separate the two notationally:

| Quantity | Parameter (population) | Statistic (sample) |
| --- | --- | --- |
| Mean | μ (mu) | x̄ (x-bar) |
| Standard deviation | σ (sigma) | s |
| Proportion | p | p̂ (p-hat) |

Because the sample is a random subset, the statistic is itself a random
quantity: a different sample gives a different statistic. The **sampling
distribution** is the distribution of the statistic over repeated samples from
the same population, and its spread is the **standard error**. For a mean,
SE = s / sqrt(n); the standard error shrinks with the square root of sample
size, so quadrupling n halves it. Confidence intervals use the sampling
distribution to bound where the parameter plausibly lies, and hypothesis tests
ask whether the data are compatible with a particular parameter value.

## When to use it

The parameter/statistic distinction is the grammar of every inferential
statement, not a specific test. Typical scenarios:

| Setting | Example question |
| --- | --- |
| Cohort description | In a diabetes cohort of 340 people the mean HbA1c is 7.9% — an estimate of the mean in the whole catchment? |
| Diagnostic accuracy | A sensitivity of 88% on 120 test-positive cases estimates the true sensitivity, with a confidence interval around it. |
| Trial reporting | The 30-day mortality difference between arms (6% vs 10%) estimates the treatment effect in the target population. |
| Lab reference ranges | The 2.5th–97.5th centiles from 200 healthy subjects estimate the corresponding population centiles. |

In the HbA1c example, the parameter is the mean HbA1c of *all* adults with
diabetes in the catchment area; 7.9% is the statistic. Whether it can be
reported as "the mean HbA1c of diabetic patients in our area" depends
entirely on whether the 340 patients were sampled to be representative of
that population.

## Assumptions and limitations

The bridge from statistic to parameter assumes:

- **Random or representative sampling** — the sample must be exchangeable with
  the population of interest, or its deviation must be acknowledged.
- **A correct definition of the target parameter.** "Mean HbA1c of all
  diabetic patients" and "…under 65" are different parameters; a statistic
  estimates only the one matching its sampling frame.
- **Independence of observations** for the usual standard-error formulas.
  Clustered or repeated measurements make the effective sample size smaller
  than n and the naive SE too small.

The distinction breaks down when authors report a sample statistic and phrase
it as a population fact ("the mean age of patients with X is 62"), when n is
so small the sampling distribution is coarse, or when the data are a complete
census of a finite population — in which case there is no sampling uncertainty
about that population, only about further extrapolation.

## Worked example

A clinic measures HbA1c in a random sample of 340 adults with type 2 diabetes:
sample mean 7.9%, sample standard deviation s = 1.8%. The standard error of
the mean is SE = s / sqrt(n) = 1.8 / sqrt(340) ≈ 1.8 / 18.4 ≈ 0.10%, so a 95%
confidence interval for the population mean μ is 7.9% ± 1.96 × 0.10% ≈ 7.7%
to 8.1%.

Interpretation: the mean HbA1c of all adults with type 2 diabetes in the
catchment area is estimated at 7.9%, and repeated random samples of this size
would bracket the true mean within roughly 7.7–8.1% on 95 occasions in 100.
Note the contrast with the standard deviation: 1.8% describes the spread of
individuals' values, while 0.10% describes the precision of the mean estimate
— confusing the two is one of the most frequent reporting errors in clinical
papers.

## Interpretation and common pitfalls

- **Reporting a statistic as a parameter.** "The mean HbA1c of diabetic
  patients is 7.9%" silently upgrades a sample number to a population fact.
  State the sample, the population, and the confidence interval.
- **Confusing standard deviation with standard error.** s describes
  individuals; SE describes the estimate. Both matter, but they answer
  different questions and are easily swapped in a results table.
- **Assuming a large n "finds" the parameter.** A larger sample shrinks the
  confidence interval but does not make a biased estimate correct; precision
  and validity are separate properties.
- **Ignoring the target population when comparing.** A statistic from a
  tertiary-care sample estimates a tertiary-care parameter, not the general
  population's, no matter how large the sample.

## References and further reading

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and
  Other Advanced Topics*. Brooks/Cole.
- Bland JM, Altman DG. *Statistics with Confidence*. BMJ Books.
- The topic map's *Estimation and confidence intervals* section develops how
  statistics are turned into bounds on parameters (article planned).
