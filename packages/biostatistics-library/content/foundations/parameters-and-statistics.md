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

### Estimand, estimator and standard error

An estimand states the population quantity sought, including the population,
outcome, handling of events after treatment and summary measure. An estimator
is the rule applied to data; the estimate is the realized value. This matters
when discontinuation or death changes what a follow-up measurement means. The
usual SE formula s/√n assumes independent observations. In a cluster sample,
precision depends on both the number of clinics and within-clinic similarity;
many patients from only a few clinics can add much less information than the
same number spread across more clinics. A narrow confidence interval quantifies
sampling uncertainty under the model, not bias or measurement error.

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

## Estimands, estimators, and sampling behavior

A parameter is defined by a population and a measurement rule. “Mean systolic pressure” is incomplete until one states whose pressure, at which visit, under which measurement protocol, and whether each person or each reading receives equal weight. A statistic computed from collected records estimates that parameter only if the sampling and measurement process connect the sample to the target. In a convenience sample, the sample mean can be calculated precisely while remaining a poor estimate of the population mean.

An estimator is a rule mapping data to a parameter estimate. Its properties include bias, variance, consistency, and efficiency under a specified model. The sample mean is unbiased for the population mean under simple random sampling with finite expectation. The sample variance uses denominator n−1 because this correction makes it unbiased for population variance under independent identically distributed sampling; dividing by n instead describes the empirical variance around the sample mean. Bias-variance tradeoffs matter: a slightly biased estimator can have lower mean squared error, but the choice must be justified by the target and assumptions.

The standard error is the sampling standard deviation of an estimator, not the spread of individual observations. For independent observations with variance σ², Var(X̄)=σ²/n and SE(X̄)=σ/√n. Estimating σ with s yields the familiar estimated SE. Under clustered sampling or unequal weights, this simple formula is wrong: observations within a clinic share information, and a survey's design weights alter variance. Confidence intervals should use the design-consistent variance estimator and degrees of freedom where appropriate.

### Worked calculation: estimate versus uncertainty

A random sample of 64 adults has mean HbA1c 7.8% and SD 1.6%. Estimated SE = 1.6/√64 = 0.20 percentage points. Using a t critical value with 63 degrees of freedom, approximately 2.00, the 95% interval is 7.8 ± 2.00(0.20) = 7.40 to 8.20%. The interval concerns the target population mean under the sampling model; it does not describe where 95% of individual HbA1c values lie. An approximate interval for an individual distribution would use the SD, yielding a far wider range.

```r
n <- 64; xbar <- 7.8; s <- 1.6
tcrit <- qt(0.975, df = n - 1)
se <- s / sqrt(n)
c(estimate = xbar, SE = se,
  lower = xbar - tcrit * se, upper = xbar + tcrit * se)
```

The t interval relies on independent sampling and a sufficiently well-behaved distribution of the mean; at small n, severe skew or outliers can undermine it. If the sample design is stratified or clustered, use survey-design methods rather than this formula.

### What a confidence interval does and does not say

A 95% confidence procedure has 95% coverage over repeated samples if its assumptions hold. Once the interval is calculated, frequentist interpretation does not assign 95% probability to this fixed parameter lying in that realized interval. The interval communicates precision conditional on the model and design; systematic bias is not included unless explicitly modeled. A narrow interval from a biased sample is still misleading. Statistical significance is also distinct from importance: compare the interval with clinically meaningful effect thresholds and the prespecified null value.

Parameters can be vectors: regression coefficients, risks at several times, or a treatment-effect curve. Selecting the “best” subgroup after inspecting data changes the inferential problem and often invalidates nominal uncertainty. Prespecify primary estimands, distinguish confirmatory from exploratory analyses, and account for multiplicity where relevant. For population proportions near zero or one, Wald intervals can have poor coverage; score or exact binomial methods are generally preferable. See the sampling-distribution and confidence-interval articles for interval construction and interpretation.


## Design-based estimators and weighting

For a probability sample with inclusion probability πi, the Horvitz–Thompson estimator of a population total is Σ yi/πi. The corresponding weighted mean divides the weighted total by the estimated population size, or uses a ratio estimator. Large weights can make estimates unstable, so trimming weights trades variance reduction against potential bias and should be justified. Variance estimation must reflect strata and primary sampling units; treating the weighted observations as a simple random sample gives incorrect standard errors.

In randomized trials, the difference in sample means is unbiased for the finite-sample average treatment effect under random assignment, even when outcomes are non-normal. Covariate adjustment can improve precision if prespecified and correctly implemented; it is not needed to remove baseline confounding caused by assignment, though chance imbalance can occur. In observational data, regression adjustment estimates a conditional contrast and requires exchangeability, positivity, consistency, and adequate model specification for a causal interpretation. A statistic can be unbiased for the wrong target if the estimand is misunderstood.

### Worked example: why a standard error depends on design

Consider 20 clinics with 25 sampled patients per clinic, 500 observations total, and an assumed intraclass correlation of .04. The approximate design effect is 1+(25−1)(.04)=1.96. The variance is nearly twice the simple-random-sample variance; the rough effective sample size is 500/1.96≈255. This calculation is an intuition aid, not a substitute for a cluster-robust or multilevel analysis. If clinic sizes vary widely, the equal-cluster approximation can underestimate design effects.

```r
clusters <- 20; m <- 25; rho <- 0.04
n <- clusters * m
deff <- 1 + (m - 1) * rho
c(raw_n = n, design_effect = deff, effective_n = n / deff)
```

With only 20 clusters, small-sample corrections for cluster-robust standard errors may matter. The number of independent clusters, not merely the number of people, governs precision for cluster-level exposure effects.

### Bootstrap, robust, and model-based uncertainty

The bootstrap resamples observations to approximate estimator variability, but the resampling unit must match the independent unit. For paired data resample pairs; for cluster-randomized studies resample clusters; for stratified surveys preserve strata. Parametric bootstrap simulates from a fitted model and inherits its assumptions. Robust standard errors protect against specified variance misspecification, not omitted confounding, selection bias, or a wrong link function. “Robust” is not a universal guarantee.

For ratios, log-scale intervals often preserve positivity and behave better than symmetric intervals on the original scale. For skewed means, bootstrap intervals can be useful but may be unstable with small samples and extreme tails. Report the method and avoid presenting more decimal places than measurement and design support. Sensitivity analysis should address plausible sources of systematic uncertainty, not merely recalculate the same estimator with several software options.

### A reporting checklist for estimates

State the estimand in words and notation where useful; identify population, outcome, time point, intervention contrast, and handling of post-randomization events. Define the estimator, analysis set, variance method, and missingness assumptions. Give an absolute measure and a relative measure if both aid decisions. Present interval estimates and clinically meaningful benchmarks. For model-adjusted results, describe functional forms and covariates and show enough diagnostic information to support adequacy. This reporting connects the sample statistic to the population parameter the reader cares about.


## Finite-sample and superpopulation targets

In a finite-population framework, the parameter is a fixed quantity for the actual set of units, and randomness arises from sampling or treatment assignment. In a superpopulation framework, observed units are realizations from a broader process, and uncertainty also reflects that process. A randomized trial's finite-sample average treatment effect among enrolled participants and a hypothetical effect in future eligible patients are related but not identical targets. Clarify the population before interpreting a standard error.

The sample mean is an unbiased design-based estimator under simple random sampling, but under unequal inclusion probabilities the unweighted mean may not be. Conversely, a model-based estimator can gain precision through assumptions about outcome structure but can be biased if those assumptions fail. Robustness should be assessed relative to the actual sampling and assignment design rather than by treating any one framework as universally correct.

## Ratio estimates and nonlinear transformations

For nonlinear functions g(θ), uncertainty in θ must be propagated to g(θ). The delta method approximates Var[g(θ̂)] by [g′(θ)]² Var(θ̂). For a risk ratio, computing a symmetric interval directly on the ratio scale can yield a negative lower bound. Work on the log scale: log(RR) has approximate variance, build an interval there, then exponentiate. For number needed to treat, NNT=1/|RD| is nonlinear and becomes unbounded when the risk difference interval includes zero. Reporting a single finite NNT without the risk-difference interval can conceal substantial uncertainty.

### Worked example: uncertainty in NNT

If the estimated absolute risk reduction is 0.06 with 95% interval 0.00 to 0.12, the point NNT is about 17, but the interval approaches infinity at a zero effect and is roughly 8.3 to infinity on the benefit side. If plausible effects also include harm, the interval crosses from number needed to treat to number needed to harm. This instability is mathematical, not a software defect. Report the absolute effect first and explain the NNT's time horizon.

```r
arr <- 0.06
c(NNT = 1 / arr,
  NNT_at_larger_benefit = 1 / 0.12,
  NNT_at_small_benefit = 1 / 0.001)
```

The near-zero endpoint demonstrates why reciprocal intervals are asymmetric and may be unbounded. Do not compute a confidence interval by taking reciprocals of endpoints that straddle zero without preserving benefit/harm regions.

## Missingness changes the estimand

Complete-case statistics estimate quantities among people with observed outcomes unless additional assumptions justify broader interpretation. If outcome observation depends on treatment or prognosis, the complete-case mean may not represent the randomized groups. Inverse-probability weighting, imputation, likelihood methods, and bounds each rely on assumptions; none automatically recovers the full population parameter. Define whether the target includes all randomized participants, adherent participants, or another population, then align methods accordingly. Report how many observations contribute to each estimate and compare sensitivity analyses under plausible departures from missing-at-random assumptions.

## Estimator choice, robustness, and influence

The sample mean is efficient under a normal model but sensitive to extreme values. The median has a 50% breakdown point under broad conditions and can better represent a skewed distribution, but its standard error and target differ. A trimmed mean discards a prespecified fraction from each tail and can balance robustness and efficiency; it should not be selected after seeing which summary gives a desired result. For regression, a single high-leverage observation can strongly affect coefficients; inspect influence diagnostics and report sensitivity with and without data points only when exclusion has a defensible measurement or eligibility reason.

A bootstrap standard error for a median can be obtained by resampling independent units and recalculating the statistic. With clustered data, sample clusters, not individual rows. In very small samples, bootstrap distributions may inadequately represent tails, and analytic or randomization-based procedures may be more appropriate. Report both the estimator and uncertainty procedure so readers can understand what variation is represented.

## Statistical versus practical importance

An interval's width should be judged against a meaningful scale. A treatment effect estimate of 0.2 points with a 95% interval 0.1 to 0.3 can be statistically precise yet clinically trivial if important change is 2 points. Conversely, an interval from −1 to 5 may include zero while also including meaningful benefit; it represents uncertainty, not evidence of no effect. Define a minimally important difference independently of the observed estimate where possible. For equivalence or noninferiority, prespecified margins and one-sided decision frameworks are required; failure to reject a superiority null is not proof of equivalence.

For a regression coefficient, specify whether it is marginal or conditional, the reference category, predictor scale, and link function. For example, a logistic coefficient is a conditional log-odds contrast holding included covariates fixed; exponentiating it produces an adjusted odds ratio. It does not directly estimate an adjusted risk difference. To present marginal risks, predict each participant's outcome under each exposure level and average across a defined target sample (g-computation), with uncertainty propagated through the full procedure. The parameter is defined by that averaging target, not by software output alone.

## References and further reading

- ICH. [E9(R1): Estimands and sensitivity analysis in clinical trials](https://database.ich.org/sites/default/files/E9-R1_Step4_Guideline_2019_1203.pdf).
- Greenland S et al. [Statistical tests, P values, confidence intervals, and power](https://doi.org/10.1007/s10654-016-0149-3). *Eur J Epidemiol*. 2016.

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and
  Other Advanced Topics*. Brooks/Cole.
- Bland JM, Altman DG. *Statistics with Confidence*. BMJ Books.
- The sampling-distribution article in this library explains how repeated
  sampling determines standard errors and interval estimates.
