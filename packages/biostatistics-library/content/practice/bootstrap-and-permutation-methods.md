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

## Bootstrap design must match the sampling design

## Bias correction and nonsmooth statistics

## Worked bootstrap for a median difference

For skewed hospital length of stay, the median difference may be more interpretable than a mean. Resample patients independently within each treatment arm, compute both medians and their difference each draw, and use a percentile/BCa interval. If participants are clustered in hospitals, resample hospitals and retain all patients within selected hospitals. The bootstrap distribution can be discrete for small samples and percentile coverage may be poor; compare with quantile-regression intervals or a robust model where appropriate.

When estimates involve imputation, propensity weighting, or threshold tuning, repeat the entire analytic pipeline within every resample. Holding selected variables or weights fixed understates uncertainty. If computational burden is high, reduce model complexity based on prespecified science and report Monte Carlo precision rather than silently lowering the number of replications.

## Randomization tests with nuisance covariates

## When resampling fails

## Choosing between bootstrap and permutation

For reporting, identify the inferential target, resampling/permutation unit, number of replicates, interval/test method, assignment restrictions, random seed, and handling of failed replicates. Include estimate and interval alongside p-value and clarify the null tested.

Use bootstrap to approximate sampling uncertainty for an estimator under an empirical sampling model; use permutation to test a null under exchangeability or randomized assignment. They answer different questions. A bootstrap CI can be paired with an estimate of a population parameter; a permutation p-value evaluates a specified null. Permuting observational exposures without exchangeability is invalid, while bootstrapping a biased estimator does not remove confounding. In randomized trials, randomization inference is design-based; bootstrap can support interval estimation, but must preserve allocation/cluster structure.

For paired data, resample pairs for bootstrap and swap within pairs for permutation. For clustered data, resample clusters and permute cluster assignments. For time-to-event data, preserve censoring and risk-set structure; naive row permutation breaks event-time information. Select method from design and estimand, not convenience.

## Permutation test worked interpretation

## Bootstrap confidence interval choice

The percentile interval takes bootstrap quantiles directly and is easy to explain, but may have poor coverage when estimator bias or skewness is appreciable. The basic interval reflects quantiles around the observed estimate; BCa adjusts for bias and acceleration; studentized intervals use a bootstrap t-statistic and can perform well but require a valid SE in each replicate. For small samples, compare interval behavior through simulation or established methods for the statistic. Report why the chosen interval is suitable and do not choose the narrowest one after seeing results.

For regression coefficients, bootstrap at the independent unit and refit full model. If variable selection is part of the pipeline, repeat selection each replicate to capture selection variability. If the scientific target has a prespecified model, avoid stepwise selection in the first place. Percentile intervals from a non-smooth selection procedure may still be unreliable.

## Monte Carlo precision and compute budget

Bootstrap and permutation estimates have simulation error. For a bootstrap SE, Monte Carlo SE is roughly (s_{boot}/\sqrt{2(B-1)}); for a tail probability near .05, it is about .005 at 2,000 replicates. Choose B to make computation error small relative to statistical uncertainty, set seeds, and report number of successful replicates. Parallelization must preserve reproducible RNG streams. Save summaries, not enormous arrays of every replicate, unless needed for audit.

Suppose an individually randomized trial observes mean difference −3 points in symptom score, where lower is better. A design-preserving randomization test permutes assignment labels while retaining the original group sizes, computes the difference for each allocation, and compares absolute values with the observed statistic. If 240 of 9,999 permutations are as extreme, the corrected two-sided p-value is (240+1)/(9,999+1)=.0241. This supports incompatibility with the sharp null under the assignment scheme; it does not say there is a 2.4% probability the null is true.

To estimate a confidence interval, invert a family of sharp-effect tests (e.g. constant additive effect) or use a model-based interval. The assumption of a common additive effect can be unrealistic for heterogeneous outcomes. Present estimate and interval alongside randomization p-value, and say which null is tested.

For stratified assignment, permute within strata. In matched pairs, swap treatment within each pair. In cluster randomization, permute clusters as allocated. A generic `sample()` over all individuals is invalid for these designs and can produce spuriously small p-values.

Bootstrap may be unreliable for parameters on boundaries (variance=0), extreme quantiles with sparse tails, highly adaptive estimators, or data with very few independent clusters. Degenerate resamples can yield undefined statistics; report their frequency and do not silently discard many failures. For rare-event ratios, parametric likelihood or exact methods may be preferable. For small randomized trials, exact randomization inference can be more defensible than asymptotic bootstrap intervals, though interval construction needs additional assumptions.

Use parametric bootstrap when a model-based data-generating process is justified and the statistic is complex; simulate under fitted model, refit each dataset, and evaluate sampling distribution. This checks model-implied uncertainty, not model adequacy. Compare nonparametric and parametric results where feasible. For a bootstrap CI on a model coefficient, refit the model each iteration and retain convergence warnings/failed fits for assessment; a high failure rate indicates weak identification, not merely software inconvenience.

Covariate-adjusted randomization tests can improve power. Fit a prespecified regression statistic and permute assignments under the actual allocation scheme, recomputing the statistic each time. Under sharp null, this provides design-based inference. Covariate adjustment method should be fixed before outcomes are unblinded; selecting a model by observed significance invalidates the test. For blocked designs, preserve block assignment, and for unequal-probability randomization, sample permutations according to the assignment probabilities.

Bootstrap resampling does not automatically remove bias. Bias can be estimated as mean bootstrap estimate minus original estimate, but bias correction can increase variance. BCa intervals adjust for bias and acceleration but depend on jackknife calculations and can be unstable for small samples. Nonsmooth statistics such as maxima, thresholds, and variable-selection estimates may violate ordinary bootstrap consistency. For high-dimensional selection, repeat selection inside each resample and consider stability selection or external validation rather than trusting an ordinary percentile interval.

For clustered or longitudinal data, resample the independent unit and retain within-unit observations. If treatment was randomized within strata, preserve strata in resampling. For survey data, use replicate weights or resample PSUs with design-aware methods. The resampling algorithm is part of the statistical method and should be justified in the report.

## Randomization inference versus model-based inference

Randomization inference conditions on observed outcomes and uses the known assignment mechanism to evaluate a sharp null. It can provide exact finite-sample tests in randomized studies, but an exact p-value does not by itself provide a confidence interval for an average treatment effect. Invert tests under constant additive effects or use studentized statistics for weak nulls, stating assumptions. Model-based bootstrap intervals can estimate sampling uncertainty but rely on outcome-model regularity. Reporting both can illuminate sensitivity in small trials.

Permutation tests in observational studies are not valid simply because labels can be shuffled in code. Exchangeability is not created by random number generation; confounders and assignment mechanism must justify permissible rearrangements. Matched observational designs may allow within-set permutations under a sharp conditional null, but this is a design assumption.

The nonparametric bootstrap resamples observations with replacement from the empirical sample. For an independent cohort, resample participants; for paired measurements, resample participant pairs; for clustered data, resample clusters; for stratified surveys, resample PSUs within strata or use agency replicate weights. Resampling the wrong unit breaks dependence and gives incorrect uncertainty. If only a few clusters exist, ordinary cluster bootstrap can be unstable; wild cluster bootstrap or randomization inference may be more suitable for some estimands.

The bootstrap approximates the sampling distribution of an estimator by repeatedly recomputing it on resamples. Percentile intervals use empirical quantiles; basic intervals reflect quantiles around the observed estimate; studentized intervals standardize by resample-specific SE and can improve coverage at greater computational cost. BCa intervals adjust bias and acceleration, but may fail for degenerate or nonsmooth statistics. For a proportion near a boundary or a rare event, naive bootstrap resamples may contain zero events; use a method designed for the parameter or report limitations.

```r
set.seed(41)
B <- 2000
boot_rd <- replicate(B, {
  idx <- sample.int(nrow(dat), replace = TRUE)
  d <- dat[idx, ]
  mean(d$outcome[d$arm == "treated"]) -
    mean(d$outcome[d$arm == "control"])
})
quantile(boot_rd, c(.025, .5, .975), na.rm = TRUE)
```

This code assumes independent participants and both arms appear in nearly every resample. In a cluster trial, sample cluster IDs and retain all members within selected clusters. Report failed replicates, number of valid replicates, interval type, and random seed. The percentile interval is illustrative; choose interval method based on estimator and sample size.

## Permutation tests and exchangeability

A permutation test compares the observed statistic with its distribution under reassignment permitted by the null and design. In a completely randomized trial, treatment labels may be permuted while preserving arm sizes. In blocked or stratified randomization, permute within blocks/strata. In matched pairs, swap labels within pairs. In cluster randomization, permute clusters, not individuals. A permutation p-value is exact under the sharp null of no unit-level treatment effect and the actual randomization scheme; weak average-effect nulls may require studentized statistics or asymptotics.

```r
obs <- with(dat, mean(outcome[arm == 1]) - mean(outcome[arm == 0]))
perm <- replicate(9999, {
  z <- sample(dat$arm)  # only valid for complete randomization
  mean(dat$outcome[z == 1]) - mean(dat$outcome[z == 0])
})
(1 + sum(abs(perm) >= abs(obs))) / (length(perm) + 1)
```

The plus-one correction avoids zero Monte Carlo p-values. For actual blocked/cluster designs, this label shuffle is invalid and must be replaced with design-preserving permutations. Permutation inference does not fix confounding in observational data; exchangeability must arise from randomization or a defensible conditional design.

## Monte Carlo error and reporting

With B random replicates, Monte Carlo error in a tail probability near .05 is roughly \(\sqrt{.05(.95)/B}\); at B=2,000 it is about .005. Use more draws when a decision depends on a precise tail estimate. Bootstrap SE is the SD of resampled estimates, while percentile intervals use quantiles; they are not interchangeable. Report resampling unit, B, interval/test type, handling of ties/missingness, software, and whether all model-selection steps were repeated within resamples.

- Efron B. Bootstrap methods: another look at the jackknife. *The Annals of Statistics*. 1979;7:1–26. [doi:10.1214/aos/1176344552](https://doi.org/10.1214/aos/1176344552)

- Efron B, Tibshirani RJ. *An Introduction to the Bootstrap*. Chapman and Hall.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Collett D. *Modelling Survival Data in Medical Research*. Chapman and Hall/CRC.

The [confidence intervals article](../inference/confidence-intervals.html) explains how resampling can support interval estimation.
