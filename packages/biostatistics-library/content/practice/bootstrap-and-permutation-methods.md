---
title: Bootstrap and permutation methods
summary: Two resampling strategies — the bootstrap estimates sampling distributions by treating the sample as the population; permutation tests invert hypothesis tests by re-assigning labels.
---

## Overview and key ideas

Most textbook tests (t-test, ANOVA, chi-square) give formulas for the sampling distribution of a statistic that depend on assumptions — normality, equal variance, large samples. **Resampling** replaces the formula with the data itself.

The **nonparametric bootstrap** is a way to estimate the sampling distribution of a statistic (a mean, a median, a regression coefficient, a risk ratio) without assuming its form. The idea: the observed sample is your best guess at the population, so resample *with replacement* from it many times (say B = 2000 or 10,000), compute the statistic in each resample, and use the resulting distribution for standard errors and confidence intervals. The bootstrap standard error is simply the standard deviation of the B resampled statistics; it estimates how much the statistic would vary from sample to sample without requiring a closed-form formula.

Two widely used intervals are the **percentile interval** (the 2.5th and 97.5th percentiles of the bootstrap distribution) and the **BCa (bias-corrected and accelerated) interval**, which adjusts for skewness in the statistic's distribution and for the rate at which the percentile changes; BCa is generally preferable, and the simple percentile interval should be avoided when the bootstrap distribution is visibly skewed.

A **permutation test** (randomization test) works in the opposite direction. It answers a hypothesis-testing question exactly under the sharp null of no effect: take the observed data, shuffle the group labels among individuals B times, and compute the test statistic in each shuffled world. The p-value is the fraction of permutations in which the statistic is as extreme as the observed one. Because it uses only the data actually observed, it needs almost no distributional assumptions — it only needs the labels to be exchangeable under the null, which holds under randomization.

## When to use it

| Setting | Example question |
| --- | --- |
| Small sample, skewed outcome | 18 patients, lognormal recovery time after surgery — the t-test is shaky; bootstrap the median and its CI |
| Complex statistic, no closed-form SE | A risk ratio from a Poisson model with small counts — bootstrap the whole model to get its standard error |
| Randomized controlled trial | A two-arm trial with a binary outcome and small cells where the exact test is unwieldy — a label-permutation test is valid under the randomization alone |
| Model-based diagnostics | Does this regression coefficient's CI assume normality? Bootstrap it and compare |

Rule of thumb: the bootstrap is for **estimation** (intervals, standard errors) when the sampling distribution is inconvenient; the permutation test is for **hypothesis testing** when the null makes labels exchangeable. They are not interchangeable — the bootstrap does not validate a null hypothesis the way a permutation test does.

## Assumptions and limitations

- **The bootstrap assumes the sample is a reasonable stand-in for the population.** With small samples (n < 20 or so), extreme outliers, or data with strong clustering, resampling individuals fails to capture the true variability. For clustered data use a *cluster-level* (case) bootstrap.
- **Resampling units must match the sampling unit.** If the data were collected in groups (patients within clinics), resampling individual rows while ignoring the clustering underestimates standard errors.
- **Permutation tests require exchangeability under the null** — the labels must be randomizable. In an observational study with no randomization, shuffling labels is not a valid test of the sharp null; the bootstrap is a safer (and less exact) fallback.
- **Both methods need enough replications** — with B = 500, the p-value itself is only accurate to roughly ±0.02, and the endpoints of a percentile CI wobble. Use B ≥ 2000 for estimates and more for small p-values.

## Worked example

In a randomized trial, 22 patients with early diabetic retinopathy are allocated to treatment (n = 11) or placebo (n = 11). After 6 months, the mean change in retinal capillary density is +4.1% (SE from bootstrap: 1.3%) in treatment and +1.2% (SE 1.1%) in placebo. The difference is 2.9 percentage points; the standard t-test would be borderline because of small n and skew in the placebo changes.

Because allocation was random, a permutation test is exact under the null of no treatment effect. Re-assign the 22 labels 10,000 times, recompute the difference each time, and find that 142 of the 10,000 shuffled differences are ≥ 2.9 points. The p-value is 142/10000 ≈ 0.014. The interpretation is direct: if the treatment had no effect, a difference this large or larger would arise from the randomization about 1.4% of the time.

The bootstrap serves a complementary role in the same study: resample the 22 patients 5,000 times and recompute the difference in means each time, and the 95% BCa interval for the treatment effect is roughly (0.4, 5.8) points. The permutation test answers "is there an effect at all?"; the bootstrap interval answers "how big is it, and how precisely is it estimated?" Reporting both gives the reader the full picture neither one alone provides.

## Interpretation and common pitfalls

- **Bootstrap is estimation, not proof** — a bootstrap CI says what the sampling distribution looks like *given this sample*; it does not make the study design or assumptions it rests on (random sampling, independence) magically valid.
- **Use the right resampling unit** — resampling individuals from cluster-collected data is the most common bootstrap error, and it flatters the precision.
- **Permutation tests test a different null than the model** — the permutation p-value addresses the sharp null of zero effect; it does not estimate the size or uncertainty of the effect.
- **Set a seed and report B** — resampling results are random; record the random seed, the number of replications, and the interval type (percentile vs BCa) so the analysis is reproducible.

Bootstrap resampling approximates sampling variability by resampling observational units with replacement; it must preserve the design (for example, resample clusters for cluster-randomized or clustered data). The ordinary percentile interval can perform poorly for biased or skewed estimators, so BCa or studentized intervals may be preferable when justified. Permutation inference is exact under an exchangeability or randomization argument: in a randomized trial, permute according to the actual assignment scheme, not arbitrarily across participants. Neither method repairs confounding, measurement error, or a nonrepresentative sample.

## References and further reading

- Efron B. Bootstrap methods: another look at the jackknife. *The Annals of Statistics*. 1979;7:1–26. [doi:10.1214/aos/1176344552](https://doi.org/10.1214/aos/1176344552)

- Efron B, Tibshirani RJ. *An Introduction to the Bootstrap*. Chapman and Hall.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Collett D. *Modelling Survival Data in Medical Research*. Chapman and Hall/CRC.

The [confidence intervals article](../inference/confidence-intervals.html) explains how resampling can support interval estimation.
