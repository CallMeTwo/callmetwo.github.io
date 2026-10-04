---
title: Bootstrap and permutation methods
summary: How bootstrap resampling estimates uncertainty and design-based permutations test hypotheses, with guidance on choosing the resampling unit and interpreting results.
---

## Overview

Resampling methods use repeated rearrangements of observed data to answer questions that are awkward for a single textbook formula. The bootstrap approximates how an estimator would vary across repeated samples. A permutation test constructs a reference distribution under a null hypothesis by rearranging treatment labels or other exchangeable units. Both methods can be implemented with a few lines of R, but validity comes from the sampling or assignment design, not from computation alone.

The distinction matters. A confidence interval from a bootstrap concerns uncertainty in an estimate under a model for how observations were sampled. A randomization p-value concerns how unusual the observed statistic is under a specified assignment mechanism and null. The methods may be used in the same trial, but they answer different questions.

## Start with the unit that could have been sampled or assigned

Before writing code, identify the independent unit. If patients were independently sampled, resample patients. If treatment was assigned to clinics, resample or permute clinics. For paired measurements, keep the pair together. In a stratified design, preserve strata. Resampling individual rows from a cluster trial treats correlated people as independent and usually understates uncertainty; freely shuffling labels across randomization blocks creates assignments that could never have occurred.

The estimand also matters. A bootstrap for a mean difference must calculate that same difference in every resample. If the analysis includes imputation, weighting, variable selection, or tuning, repeat those steps within each bootstrap replicate when their uncertainty is part of the target. Holding data-adaptive choices fixed gives uncertainty conditional on choices made from the original sample and can be too narrow.

## Bootstrap: approximate repeated sampling

For observations (X_1,\ldots,X_n), the empirical distribution assigns probability (1/n) to each observed value. A nonparametric bootstrap draws (n) observations with replacement from this distribution, computes the statistic, and repeats the process (B) times. The standard deviation of the bootstrap estimates approximates the estimator's standard error. Quantiles of their distribution provide percentile intervals; other intervals, such as BCa or studentized intervals, use additional corrections.

Consider a small randomized study with 12 patients per arm and a skewed length-of-stay outcome. The observed mean difference (new care minus usual care) is −1.8 days. In 5,000 patient-level bootstrap replicates, suppose the standard deviation of the differences is 1.1 days and the 2.5th and 97.5th percentiles are −4.2 and 0.3 days. The estimate suggests a shorter stay, but the interval includes zero and remains compatible with little or no average difference. The bootstrap has not made the trial larger; it has approximated the sampling uncertainty supported by these data.

```r
set.seed(2026)
B <- 5000
boot_diff <- replicate(B, {
  i_new <- sample(which(dat$arm == "new"), replace = TRUE)
  i_usual <- sample(which(dat$arm == "usual"), replace = TRUE)
  mean(dat$stay[i_new]) - mean(dat$stay[i_usual])
})
sd(boot_diff)
quantile(boot_diff, c(.025, .5, .975), na.rm = TRUE)
```

This code resamples separately within arms, matching a fixed group-size randomized design and estimating uncertainty conditional on those sizes. For a cluster-randomized trial, sample clinics within arms and retain all patients in each sampled clinic. If the target is a population treatment effect under the actual allocation, a design-based analysis may be preferable. Record the seed, number of replicates, interval method, and number of failed replicates. Increasing (B) reduces Monte Carlo noise but does not repair a poor sampling design or a biased estimator.

The percentile interval is simple but can have poor coverage when the statistic is biased, skewed, near a boundary, or based on a very small sample. BCa intervals adjust for estimated bias and acceleration; studentized intervals account for replicate-specific standard errors. These methods are not automatic upgrades: the jackknife acceleration can be unstable for nonsmooth statistics, while studentization can be computationally demanding. Report the estimator and interval construction so readers know what the endpoints mean.

## Permutation: recreate the null assignment process

A randomization test compares the observed statistic with statistics generated under assignments allowed by the study design. In a completely randomized trial with fixed arm sizes, permute labels while retaining those sizes. For a paired trial, swap labels within each pair; for blocked randomization, permute within blocks; for cluster assignment, permute clusters. Under the sharp null that treatment changes no participant's outcome, the test is exact if all permitted assignments are treated according to the randomization probabilities.

Suppose a parallel trial has 24 participants, 12 per arm, and an observed difference in mean pain score of −2.4 points. Of 9,999 permitted reallocations, 286 produce an absolute difference at least 2.4. The Monte Carlo two-sided p-value with the plus-one correction is ((286+1)/(9{,}999+1)=0.0287). This is evidence that the observed contrast is unusual under the sharp no-effect null and the specified randomization. It is not the probability that the null is true, nor does it quantify how likely a clinically important benefit is.

```r
set.seed(83)
obs <- with(dat, mean(score[arm == "new"]) -
                      mean(score[arm == "usual"]))
perm <- replicate(9999, {
  z <- sample(dat$arm)  # valid only for complete randomization
  mean(dat$score[z == "new"]) - mean(dat$score[z == "usual"])
})
(1 + sum(abs(perm) >= abs(obs))) / (length(perm) + 1)
```

This generic shuffle is invalid when assignments were blocked, matched, or clustered. The permutation code must encode the allocation actually used. With covariate adjustment, one can use a prespecified adjusted statistic and recompute it for every permitted assignment. Choosing the adjustment after looking at which model gives the smallest p-value breaks the design-based argument.

The sharp null is stronger than a null average treatment effect: it says no individual would have a different outcome under the other assignment. Inference for a weak null of zero average effect may require studentized statistics or large-sample justification. Confidence intervals can be formed by inverting tests of hypothesized constant effects, but the constant-effect assumption should be stated. Randomization inference is not a general substitute for modeling every scientific question.

## Choosing the method and reading its uncertainty

Use bootstrap resampling when the goal is a standard error or interval for a statistic and an empirical approximation to the sampling process is defensible. Use permutation when the null and design provide a valid exchangeability scheme. A permutation test can be exact for a randomized experiment even when outcomes are highly non-normal; a bootstrap interval may still be useful for effect magnitude. In observational data, labels are not generally exchangeable because treatment depends on prognosis. Shuffling them does not remove confounding.

Resampling also has failure modes. With very few independent clusters, the ordinary cluster bootstrap has few distinct resamples and can be unreliable. Rare outcomes may disappear from bootstrap replicates, causing infinite estimates or model nonconvergence. Extreme quantiles and maxima are nonsmooth and often need specialized methods. Report the proportion of failed fits and investigate why they fail rather than silently discarding them. For complex survey samples, use design-provided replicate weights or a variance method that preserves strata and primary sampling units.

### How interval construction changes the answer

The standard error is the spread of the bootstrap estimates, but the interval is a separate choice. A percentile interval takes the relevant empirical quantiles directly. It is easy to explain and invariant to monotone transformations, but it can inherit bias and poor tail coverage. A basic interval reflects those quantiles around the observed estimate and can behave awkwardly when the estimate is near a boundary. A normal interval, estimate ± 1.96 bootstrap SE, presumes approximate symmetry and can extend beyond possible values. BCa corrects for median bias and the change in estimator variability across the parameter space; it is often a useful default for smooth statistics when the sample supports stable jackknife calculations.

For example, if a risk difference is estimated as 0.08 and the bootstrap standard error is 0.04, a normal interval is 0.08 ± 0.078, or about 0.002 to 0.158. If the bootstrap distribution is skewed because the event is rare, its percentile interval could instead be −0.01 to 0.17. This disagreement is diagnostic: it signals that symmetric large-sample reasoning is questionable. The negative lower endpoint is possible for a risk difference, but would be impossible for a risk ratio. For a ratio, construct inference on the log scale or use an interval method that respects the parameter space.

Bootstrap replications are not new patients and do not increase the effective sample size. An empirical bootstrap cannot generate covariate patterns absent from the study. In a sample with no events among exposed participants, ordinary resampling will repeat that absence and cannot estimate a finite odds ratio. A parametric bootstrap can simulate events from a fitted model, but then uncertainty depends on that model being appropriate. Exact methods, penalized estimation, or a more informative design may be preferable.

### Preserve the design in more complex studies

In matched-pair data, resample pairs rather than individual records, then calculate the within-pair contrast. For a cluster sample, resample whole clusters; if cluster sizes vary, specify whether the target is an average individual effect or an average cluster effect. The two targets weight large and small clusters differently. In a stratified survey, resample primary sampling units within strata or use replicate weights supplied by the survey design. A naive row bootstrap ignores unequal inclusion probabilities and can misstate uncertainty.

For a treatment contrast in a parallel randomized trial, resampling within arms as in the code conditions on arm sizes. A pooled participant bootstrap instead allows arm counts to vary and may be aligned with a superpopulation model, but it is not the same design-based calculation. State which source of variation the interval represents. In small randomized trials, compare a bootstrap interval with randomization-based inference rather than treating one as universally superior.

The entire estimator must be reproduced in each replicate. If a weighted estimate uses propensity scores, re-estimate the propensity model, weights, and outcome statistic in each sample. If missing data are multiply imputed, there are nested sources of uncertainty; a valid procedure must account for imputation and sampling rather than resampling only a completed dataset. Likewise, if a model is selected from candidate predictors, selection should be repeated if the target concerns the full modeling procedure. These choices can make resampling expensive, but fixing them can give unjustifiably narrow intervals.

## Permutation inference beyond a generic label shuffle

An exact permutation test enumerates every allowed assignment and calculates a tail proportion. In practice there may be too many assignments, so Monte Carlo sampling approximates the reference distribution. The plus-one calculation used in the example avoids reporting a zero p-value from a finite number of draws. If no sampled assignment is as extreme among 9,999 draws, the result is not p=0; it is roughly p=0.0001 at the resolution of the simulation. Report the number of draws and Monte Carlo uncertainty.

The statistic should reflect the null and design. A difference in means is natural for a continuous outcome; a studentized difference can improve robustness for unequal variances. For binary outcomes, one might use a risk difference or score statistic. Covariate adjustment can increase precision, but only if the statistic and adjustment procedure are prespecified or justified independently of the observed treatment contrast. If treatment was randomized with unequal probabilities, assignments should be sampled with their actual probabilities; equally weighting allocations would target a different reference distribution.

Permutation tests also apply to paired designs. Suppose 15 patients each receive both devices in randomized order and the endpoint is a paired measurement. Under the sharp null of no device effect for anyone, each pair's two labels can be swapped, giving (2^{15}) assignments. A paired t statistic can be recomputed for each sign pattern. This preserves within-person pairing; shuffling all 30 observations would destroy it. In cluster trials, with only eight clinics, the number of possible allocations may be small, so p-values have coarse attainable values. This is a design limitation, not a software problem.

For observational comparisons, the word “permutation” does not by itself establish validity. Conditional permutations can sometimes be justified within matched sets or exchangeability strata, but residual confounding and treatment selection remain. If covariates strongly predict treatment, unrestricted label shuffling answers a hypothetical randomized assignment question that the actual data did not implement. Use a causal design and model appropriate to the study, and make the identifying assumptions explicit.

## A defensible reporting record

For a bootstrap, report the estimand and statistic, resampling unit and strata, number of replications, random seed or reproducibility mechanism, interval type, treatment of model failures, and all analysis steps repeated within each replicate. For a permutation test, state the null (sharp or otherwise), test statistic, allowed assignments, whether enumeration was complete or Monte Carlo, number of draws, tail definition, and any plus-one correction. Give the effect estimate and uncertainty even when a p-value is emphasized.

Monte Carlo error is separate from sampling uncertainty. If a permutation p-value is near 0.05 and (B=2{,}000), its Monte Carlo standard error is approximately \(\sqrt{.05(.95)/2000}=0.0049\). More permutations make the numerical approximation more stable; they do not make the scientific evidence stronger. For bootstrap endpoints, inspect the distribution and report enough replicates that quantiles are stable to reruns. A useful sensitivity check is to compare estimates across seeds or increase (B) and confirm conclusions do not shift due only to simulation noise.

Monte Carlo error is separate from sampling uncertainty. If a permutation p-value is near 0.05 and (B=2{,}000), its Monte Carlo standard error is approximately \(\sqrt{.05(.95)/2000}=0.0049\). More permutations make the numerical approximation more stable; they do not make the scientific evidence stronger. For bootstrap endpoints, inspect the distribution and report enough replicates that quantiles are stable to reruns.

In applied reports, avoid describing an interval as “the range containing 95% of the bootstrap estimates.” The interval is intended to have a repeated-sampling coverage property for the target parameter under its assumptions; it does not contain 95% of individual patient effects. Similarly, a two-sided randomization p-value should state how extremeness was defined. For an asymmetric null distribution, doubling the smaller one-sided tail and counting outcomes at least as far from the null are not always equivalent. A prespecified statistic and tail rule prevent post hoc choices.

| Scientific goal | Candidate procedure | Key justification |
| --- | --- | --- |
| Standard error for a median difference | Bootstrap the independent sampling units | Sample represents the target population; resampling matches dependence |
| Test no effect in a randomized trial | Permute according to the randomization | Sharp null and actual assignment mechanism |
| Interval for a randomized-trial effect | Bootstrap or invert randomization tests | State whether inference is superpopulation or design-based |
| Test an observational exposure contrast | Neither unrestricted method automatically applies | Address confounding and identification before inference |
| Cluster-level intervention with few clusters | Design-based inference or small-sample cluster methods | Number of independent assigned units limits information |

The confidence-intervals article provides further background on coverage and interval interpretation. Resampling is most useful when paired with a transparent estimand and a design-respecting implementation; it cannot compensate for a question the study did not identify.

For an analysis with multiple endpoints, decide whether each is confirmatory or exploratory before looking at resampling p-values. Permutation does not automatically solve multiplicity: a family-wise test may require a max-statistic across outcomes, and a bootstrap interval for one endpoint does not adjust simultaneous coverage. Report all planned outcomes and avoid selecting the most favorable resampling result after analysis. When testing many hypotheses, preserve the dependence among outcomes during resampling and state whether the goal is family-wise error control or false-discovery control.

For randomized trials, distinguish a randomization test from a bootstrap confidence interval in the methods and abstract. The former is anchored to the allocation mechanism; the latter commonly invokes a sampling model for participants. Agreement is reassuring but does not prove assumptions. Disagreement can arise from skewness, small samples, a sharp-null versus average-effect target, or a mismatch in resampling units. Explain that difference rather than choosing whichever p-value crosses a conventional threshold.

If the test and interval target different nulls or estimands, say so explicitly in the report.

Avoid reporting more Monte Carlo digits than the number of simulations supports.

State whether the interval is pointwise or simultaneous when covering multiple estimates.

Choose a resampling scheme before outcomes are examined.

## References and further reading

- Efron B. Bootstrap methods: another look at the jackknife. *The Annals of Statistics*. 1979;7:1–26. [doi:10.1214/aos/1176344552](https://doi.org/10.1214/aos/1176344552)
- Davison AC, Hinkley DV. *Bootstrap Methods and Their Application*. Cambridge University Press; 1997.
- Good PI. *Permutation, Parametric, and Bootstrap Tests of Hypotheses*. 3rd ed. Springer; 2005.
- Efron B, Tibshirani RJ. *An Introduction to the Bootstrap*. Chapman & Hall; 1993.
- The [confidence intervals article](../inference/confidence-intervals.html) discusses interval interpretation and uncertainty reporting.
