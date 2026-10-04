---
title: Normal distribution
summary: The symmetric bell-shaped distribution, its role in reference ranges and z-scores, and how to check whether data deserve it.
---

## Overview

The normal distribution is a symmetric continuous model indexed by mean μ and standard deviation σ. It appears as an outcome model for some measurements and, more broadly, as an approximation to sampling distributions of estimators. Its bell shape is useful but not universal: counts, concentrations, and lengths are bounded or skewed, and a normal curve can assign probability to impossible values.

## Density, standard scores, and probabilities

For X~N(μ,σ²), standardize with Z=(X−μ)/σ, which follows the standard normal distribution. Approximate 68%, 95%, and 99.7% of values lie within 1, 1.96, and 3 SD of μ. A z-score locates a value relative to the model; it is not inherently a clinical severity score.

```r
# Probability systolic pressure exceeds 140 if N(125, 15^2)
1 - pnorm(140, mean = 125, sd = 15)
# 90th percentile of the same model
qnorm(.90, mean = 125, sd = 15)
```

The probability is meaningful only if the normal model and parameters describe the target population. Estimated μ and σ create additional uncertainty.

## Normal outcomes and sampling distributions

A normal outcome model can support t-based inference for means, but many estimators are approximately normal even when individual observations are not, through the central limit theorem. These are different uses. A normal distribution of patient values is not required for every mean-based analysis in large samples; conversely, a normal-looking histogram does not prove independent sampling.

## Reference intervals and limitations

A central 95% reference interval under a normal model is μ±1.96σ. It describes a reference population, not a confidence interval for μ and not a diagnostic decision limit. If the measurement is skewed, use quantiles or a justified transformation. The normal distribution is unbounded, so it can assign negative probabilities of concentration or length; avoid it when that creates material implausibility.

### Diagnostics and alternatives

Inspect histograms and Q-Q plots, especially residuals for model-based inference. Mild departures may be tolerable, while heavy tails and influential outliers can matter in small samples. Lognormal, gamma, beta, binomial, and Poisson models better represent common biomedical supports. Choose the model based on measurement process and estimand, not visual resemblance alone.

## Quantiles, z-scores, and tails

The standard normal CDF Φ(z) gives P(Z≤z); the quantile function returns z such that Φ(z)=p. A z-score of 2 corresponds to an upper-tail probability about .023 under a standard normal model. In clinical use, do not confuse this tail probability with disease probability unless the model and base rate are incorporated. A reference interval μ±1.96σ covers central 95% only if the population is normal and parameters known.

```r
pnorm(2)       # P(Z <= 2)
qnorm(.975)    # 97.5th percentile
```

When μ and σ are estimated, uncertainty in reference limits matters. Prediction for a future person also includes parameter uncertainty, unlike a theoretical population quantile.

### Normality for measurements and errors

Many biological measurements are positive and right-skewed; a lognormal model may be more plausible. A normal model is symmetric and unbounded, which can yield negative predictions for positive quantities. For proportions, use binomial or beta models; for counts, Poisson or negative binomial; for bounded scores, inspect ceiling/floor effects. A transformation can make residuals more symmetric but changes the estimand and interpretation.

In linear regression, the normality assumption usually concerns conditional errors for small-sample t/F inference, not predictors. The CLT can make coefficient estimates approximately normal under regularity conditions even if errors are not, but heavy tails, dependence, and small samples remain concerns.

### Normal approximation and continuity

Normal approximation to a binomial works when expected successes and failures are sufficiently large; no single threshold is universal. A continuity correction can improve a discrete-to-continuous approximation. For rare events, exact binomial or Poisson methods are often preferable. Approximation quality should be checked for the tail probability of interest, not merely central behavior.

### Mixtures and subgroup distributions

A mixture of two normal subpopulations can be skewed or multimodal even if each subgroup is normal. A pooled Q-Q plot may show departure due to genuine heterogeneity. Stratify by meaningful design variables or fit mixture/hierarchical models only with adequate evidence. Do not assume every nonnormal histogram calls for transformation; it may reflect clinically distinct groups.

### Reference and decision limits

A reference interval describes a population distribution; a treatment threshold is selected for a decision. The central 95% interval does not imply values outside are pathological. State population, assay, and partitioning. For skewed populations, empirical quantiles or transformed normal methods may be needed and validated.

### Deriving a probability and percentile

For X~N(125,15²), the probability of systolic pressure above 140 is P(Z>(140−125)/15)=P(Z>1)=.1587. The 90th percentile is μ+z.90σ≈125+1.282×15=144.2. A z-score expresses standardized distance; the percentile gives a population position. Neither says whether an individual needs treatment without clinical context.

```r
pnorm(140, mean = 125, sd = 15, lower.tail = FALSE)
qnorm(.90, mean = 125, sd = 15)
```

If parameters were estimated from a small sample, these plug-in probabilities ignore estimation uncertainty. A prediction interval or parameter simulation may be needed for patient-level prediction.

### Linear combinations and the multivariate normal

If a vector of measurements is jointly multivariate normal, any linear combination is normal. This property supports t-tests and linear-model inference under assumptions. Correlation determines the variance of a sum or difference: Var(X+Y)=Var(X)+Var(Y)+2Cov(X,Y). Treating correlated biomarkers as independent can misstate uncertainty. Marginally normal variables are not necessarily jointly normal, and a normal pair has linear conditional expectations.

Multivariate normal models can approximate repeated-measure outcomes or random effects, but residual checks and covariance structure matter. A normal marginal histogram does not prove joint normality or independence.

## The t distribution

When σ is unknown and estimated by s, (X̄−μ)/(s/√n) follows t(n−1) exactly under independent normal sampling. The t distribution has heavier tails than N(0,1), accounting for uncertainty in estimated scale. As n increases, its critical values approach normal quantiles. For regression, t/F inference relies on residual assumptions and degrees of freedom; robust or asymptotic methods may differ.

## Normal approximations for proportions and counts

For a binomial count, the normal approximation uses mean np and variance np(1−p). It works best when both expected successes and failures are not too small. A continuity correction may improve discrete-tail approximation. Near boundaries, use exact or score methods. A Poisson count with large λ can also be approximated by normal with mean/variance λ, but skew is substantial when λ is small.

### Mixtures, truncation, and censoring

A mixture of two normal subpopulations may be skewed or bimodal; pooled normal-model assumptions can fail even when within-group distributions are normal. Truncated samples (e.g. only measurements within assay reportable range) are not normally distributed. Censoring at detection limits creates piles at boundaries; replacing censored observations by the limit changes distribution. Use truncated/censored likelihoods where the mechanism matters.

## Robustness and diagnostics

A Q-Q plot compares ordered residuals to normal quantiles; tail curvature can indicate skew or heavy tails. Formal tests can be oversensitive at large n and underpowered at small n. In mean inference, moderate nonnormality may have little effect in balanced large samples, but extreme observations and small n can be consequential. Bootstrap or permutation procedures may help if design permits. Independence and unbiased sampling remain separate assumptions and are not checked by a Q-Q plot.

### Reference intervals and decision limits

A normal reference interval μ±1.96σ is a model-based estimate of central 95% population values if normality and parameter estimates are suitable. It is not a confidence interval for the mean. A diagnostic cutoff is selected based on outcomes and consequences, not simply the 2.5th or 97.5th percentile. Reference intervals also depend on age, sex, assay, and population; verify before transport.

## Reporting

State whether normality models individual outcomes, residuals, or sampling distributions. Give μ and σ with units, sample size, and estimation uncertainty when relevant. Explain transformation and back-transformed target. For bounded outcomes, use a distribution respecting the support rather than relying on an implausible normal approximation. The normal model is a useful approximation when its implications fit the question and data.

### Standardization and tail areas

A z-score is (x−μ)/σ. For X=140, μ=125 and σ=15, z=1; standard-normal upper tail is 0.1587. The percentile is Φ(z)=.8413. This percentile is relative to model assumptions and reference population. A z score from a fitted regression residual has a different interpretation than a z score of an individual measurement against population SD.

### Parameter estimation uncertainty

When μ and σ are estimated, using qnorm with plug-in values ignores uncertainty in parameter estimates. For a prediction interval from a normal sample, use a t-based predictive formula that includes both residual spread and estimation uncertainty. Reference interval establishment also needs confidence limits on endpoints. A theoretical normal quantile is not automatically a precise clinical limit.

### Tail risk and multiple comparisons

Extreme z-scores occur by chance. In a large panel of laboratory values, at least one result beyond 2 SD is common even in healthy people. Interpreting one abnormal value without accounting for how many tests were run inflates false alarms. Repeat testing, clinical context, and multiplicity-aware interpretation matter. A normal model provides probabilities for specified events, not a diagnosis.

### Model checking in practice

A normal Q-Q plot of residuals can flag tail or skew departures. Shapiro–Wilk and similar tests are sensitive to n and should not be the sole criterion. Inspect whether a departure affects the estimator and interval; compare robust or bootstrap analyses if important. Outliers can dominate small-sample normal inference even when most points align with a line.

### The normal curve is not a mechanism

A bell-shaped histogram does not prove a biological process is normal. Aggregation of many influences can yield approximate normality, but mixtures, selection, and measurement bounds alter shape. Use normality as a tractable model supported by diagnostics and knowledge, not as an assumption of nature.

### Normal-model inference for a mean

For a sample from a normal population with unknown σ, the statistic (X̄−μ)/(s/√n) follows t(n−1). A 95% interval is x̄±t(.975,n−1)s/√n. As n grows, t critical values approach 1.96. This exact result depends on independent normal observations; in larger samples, the CLT may support approximate inference without normal raw data. Clustered data require adjusted covariance.

```r
x <- c(126, 131, 119, 124, 128, 121, 133, 122)
t.test(x)$conf.int
```

A normal probability plot can assess compatibility of residuals with a normal model. It does not test independence, representativeness, or equality of variances. At small n, diagnostic power is weak.

### Transformations and geometric summaries

If log(X) is normal, X is lognormal and positive. The median is exp(μlog), while arithmetic mean is exp(μlog+σlog²/2). The geometric SD is exp(σlog), describing multiplicative spread. Log transformation can suit concentrations or costs, but analysis then targets log-scale differences/ratios. Back-transform predictions carefully and identify whether the reported summary is geometric or arithmetic.

### Normal approximation to a binomial

For X~Binomial(n,p), normal approximation has mean np and variance np(1−p). Continuity-corrected approximation to P(X≤k) uses the boundary k+0.5. The approximation is poor when expected events or non-events are small or p is near zero/one. Wilson/exact intervals are usually safer for proportions near boundaries.

### Standardized residuals

In contingency and regression models, standardized residuals measure deviations relative to estimated variability and can be approximately normal under the model. Large residuals flag cells or observations to investigate, but searching many residuals creates multiplicity. A z-score is not automatically a p-value without a defined reference distribution and adjustment.

### When the normal model is useful

Normality supports tractable summaries, error propagation, and many sampling approximations. It is often a reasonable local model for measurement error or aggregate outcomes. Check support, tails, dependence, and residuals. For discrete counts, proportions, survival, or bounded scales, use models that respect the data-generating process or justify approximation empirically.

### Worked reference interval and uncertainty

If a healthy reference population is approximately normal with mean 125 and SD 15, model-based central 95% interval is 125±1.96×15, or 95.6 to 154.4. These endpoints are estimated from a sample and have uncertainty. If the distribution is skewed, direct empirical 2.5th and 97.5th percentiles may be preferable. The range is not a confidence interval for mean pressure and not a treatment cutoff.

### Standard normal tail interpretation

For a standardized residual z=2.5, the two-sided tail probability under standard normal is about .0124. If thousands of residuals or biomarkers are examined, some such values arise by chance. Account for multiplicity and use model diagnostics, not a one-value alarm. A z-score’s tail area is conditional on the reference model.

### Normality and robust inference

The sample mean may be approximately normal under the CLT even when outcomes are skewed, but the finite-sample t interval can be sensitive to outliers. Balanced group comparisons are often robust to moderate departures; small or highly unequal samples require more caution. Use data displays, robust methods, or bootstrap that respect the design. A normal model should be justified for the estimator and residuals, not presumed because it is familiar.

### Normal model selection and reporting

Use the normal model when its support, symmetry, and variance structure are plausible for the outcome or estimator. If a transformation is used, state whether inference is on transformed scale and how results were back-transformed. Report parameters and units, and distinguish population SD from standard error. For bounded, skewed, or discrete outcomes, choose a model that reflects support or justify a normal approximation with diagnostics and sensitivity analyses.

### Normality and clinical evidence

Normal probabilities are useful for standardized comparisons and tail calculations, but a normal model is an approximation whose consequences should be checked. State whether the model describes measurements, residual errors, or an estimator’s sampling distribution. If the support is bounded or the tails matter, compare with models that honor those features. A convenient bell curve should not be mistaken for evidence that the biological process is bell-shaped.

### Prediction and standardization example

For a normal population with μ=125 and σ=15, a value of 155 has z=2 and upper-tail probability .0228. This describes how unusual it is under that population model. If μ and σ are estimated from n=20, uncertainty in the reference distribution should be considered; using fixed values can overstate precision. If predicting a future measurement, account for both parameter and individual variation.

### Standard errors in regression

Normal residual assumptions yield exact small-sample t and F distributions under linear-model conditions. Large-sample sandwich estimators use asymptotic normality instead. The normal reference distribution for a coefficient does not mean the outcome itself is normal. State which quantity is assumed normal and why.

### Summary for practice

The normal curve supports standardization, mean inference, and approximate tail calculations when model conditions are reasonable. Check support, skew, dependence, and estimation uncertainty; distinguish raw outcomes from residuals and sampling distributions. Use alternative distributions or robust methods when the bell-shaped model conflicts with the measurement process.

### Normal reference models in laboratory practice

A normal model can estimate central reference limits efficiently when the transformed measurement is approximately symmetric. Laboratories should verify transferability to their assay and population, assess outliers using clinically defined criteria, and report uncertainty in reference limits. A model-derived interval is still conditional on distributional assumptions; empirical quantiles may be preferable with adequate reference samples.

### Normality does not imply independence

Two measurements can each have a normal marginal distribution yet be highly correlated within a patient or clinic. Analyses that assume independent observations still need design-aware covariance. A normal Q-Q plot says nothing about dependence or selection.



If reporting a z-score, specify the reference mean and SD and whether those parameters are known, estimated, or externally standardized.


A normal approximation should be checked for the specific probability tail or interval being used, especially when inference concerns rare extremes.

For bounded outcomes, explicitly check whether the normal model assigns meaningful probability to impossible values before using it for prediction.

A Q–Q plot assesses distributional shape but cannot establish independent sampling or representative recruitment.

State whether intervals are pointwise or simultaneous when many normal-theory comparisons are presented.

Check the assumed distribution against the measured scale.

Use tail-area statements only under a justified reference model.



### Summary of normal approximations

Normal theory is useful for means and standardized residuals when assumptions are plausible, and as a limit for some estimators. It is not a universal model for clinical measurements. Respect the outcome’s support, inspect residuals, and distinguish model uncertainty from sampling uncertainty.


If parameters are estimated, include uncertainty in reference limits and future predictions rather than treating μ and σ as fixed.

When deviations from normality are material, report the alternative distribution or robust method, and show how it changes the clinical estimate rather than describing model fit only in abstract terms.

Model assumptions should be stated alongside estimates and intervals.

## References and further reading

- CLSI. [EP28: Defining, establishing, and verifying reference intervals in the clinical laboratory](https://clsi.org/standards/products/method-evaluation/documents/ep28/).
- NIST/SEMATECH. [Normal probability plot](https://www.itl.nist.gov/div898/handbook/eda/section3/normprpl.htm).

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland JM, Altman DG. *Medical Statistics: A Companion Guide*. Nelson.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Biostatistics*. Pearson.

The [sampling distributions article](sampling-distributions-and-the-central-limit-theorem.html)
explains why sample means can be approximately normal even when individual
values are not.
