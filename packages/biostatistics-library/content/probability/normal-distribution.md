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

### Reference intervals are not confidence intervals

A central 95% reference interval describes the middle 95% of values in a
defined reference population; it does not mean that 95% of patients are
healthy or that values outside it are necessarily diseased. A confidence
interval for the population mean instead quantifies uncertainty in an
estimated parameter. In laboratory practice, reference intervals are often
estimated from a selected healthy sample using the 2.5th and 97.5th
percentiles; the mean ± 1.96 SD shortcut requires an approximately normal
distribution. Partitioning by age or sex may be needed when distributions
differ, but subgroup intervals need enough observations. For bounded or
strongly skewed measures, use methods suited to their distribution rather than
forcing a normal model.

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

## Normal models, standardization, and inference

A normal variable X~N(μ,σ²) has density proportional to exp{−(x−μ)²/(2σ²)}. Its symmetry means mean, median, and mode coincide; the standard deviation controls spread. Standardization Z=(X−μ)/σ maps the distribution to N(0,1), allowing probabilities to be calculated from the cumulative distribution Φ. For an interval [a,b], probability is Φ((b−μ)/σ)−Φ((a−μ)/σ). Tail probabilities use complements to avoid confusing the area below a threshold with the area above it.

Normal assumptions enter many ways. A Gaussian model for raw outcomes assumes conditional residuals are approximately normal with suitable variance structure; a t-test assumes independent observations and uses a t reference distribution for estimated variance. The central limit theorem can make a sample mean approximately normal even when individual values are not normal, but it does not guarantee a good approximation for small samples, heavy tails, or dependent observations. In regression, inspect residuals conditional on fitted values rather than deciding from the marginal outcome histogram alone.

Reference intervals and prediction intervals differ from confidence intervals. A reference interval describes individual values in a defined reference population. A confidence interval concerns uncertainty in a parameter such as the mean. A prediction interval concerns a future individual and is wider because it includes both parameter uncertainty and individual variation. The common μ±1.96σ central interval is appropriate only under an approximately normal reference distribution; empirical quantiles or robust methods may be better for skewed values.

### Worked example: threshold probability and uncertainty

Suppose systolic blood pressure follows an idealized N(120,15²) distribution. For threshold 140, z=(140−120)/15=1.333. Thus P(X>140)=1−Φ(1.333)≈0.0918. The central 95% interval is 120±1.96(15), or 90.6 to 149.4 mmHg. This describes the model-implied distribution, not the diagnostic performance of a one-time reading. If μ and σ were estimated from a sample, uncertainty in those estimates should be reflected in uncertainty about the tail probability.

```r
mu <- 120; sigma <- 15; cutoff <- 140
z <- (cutoff - mu) / sigma
p_above <- pnorm(cutoff, mean = mu, sd = sigma, lower.tail = FALSE)
central_95 <- qnorm(c(0.025, 0.975), mean = mu, sd = sigma)
c(z = z, probability_above = p_above, central_95)
```

R's `pnorm` computes a probability and `qnorm` computes a quantile. The model is illustrative: actual blood pressure may vary with age, treatment, measurement conditions, and selection into a reference sample. A fixed distribution should not be transported to a different population without validation.

### Lognormal measurements

If log(X) is normal, X is lognormal and strictly positive, with a right-skewed distribution. If log(X)~N(μ,σ²), the median is exp(μ), while the arithmetic mean is exp(μ+σ²/2). These are not interchangeable. A model on log scale estimates effects on geometric means or ratios, while arithmetic means may be the decision-relevant quantity. Back-transforming a fitted mean on log scale requires attention to residual variance; exponentiating only the linear predictor estimates a conditional median under a lognormal model, not generally the arithmetic mean.

### Diagnostic checks and limits

Use a Q–Q plot to compare empirical residual quantiles against normal quantiles; systematic curvature may indicate skew, heavy tails, or mixtures. A Shapiro–Wilk test can reject trivial departures in large samples and has little power in small samples, so it should not replace graphical and substantive assessment. Outliers should be checked for data errors and influence, not removed automatically. In reference interval work, apply appropriate screening of the healthy reference sample, consider age/sex partitions only when justified, and follow laboratory standards such as CLSI EP28. Never call a value outside a reference interval “abnormal” without clinical context.


## The t distribution and uncertainty in the mean

When σ is unknown and replaced by sample SD s, the standardized statistic (X̄−μ)/(s/√n) follows a Student t distribution with n−1 degrees of freedom if observations are independent and normal. The t distribution has heavier tails than the standard normal, reflecting uncertainty in estimating σ; as degrees of freedom increase it approaches normality. The one-sample t interval is X̄±t_(.975,n−1)s/√n. This interval concerns μ, not individual observations. For paired data apply the t method to within-person differences.

### Worked example: sample mean and t interval

A sample of 16 patients has mean LDL 132 mg/dL and SD 24 mg/dL. SE=24/4=6. With 15 degrees of freedom, t_(.975,15)≈2.131, so the 95% interval is 132±12.79, or 119.2 to 144.8 mg/dL. A z interval would be slightly narrower because it treats population SD as known. With this small sample, examine skew and outliers; the t procedure is exactly valid under normality, but can be sensitive to heavy tails.

```r
n <- 16; xbar <- 132; s <- 24
se <- s / sqrt(n)
tcrit <- qt(.975, df = n - 1)
c(SE = se, lower = xbar - tcrit*se, upper = xbar + tcrit*se)
```

If this is a convenience sample from a clinic, the interval addresses sampling variability under a model, not selection into the clinic. If LDL measurements are repeated within patients, independence also fails unless the analysis uses one prespecified measurement or models the repeated structure.

## Normal approximation to binomial data

For X~Binomial(n,p), a normal approximation centers at np with variance np(1−p). A continuity correction adjusts integer boundaries by roughly 0.5. The approximation is poorest when p is near zero or one or n is small. The common rule requiring at least 5 or 10 expected successes and failures is only a heuristic; compare exact probabilities or use score intervals where accuracy matters. For sample proportions, probability calculations can use `pbinom` exactly, avoiding approximation entirely.

```r
n <- 40; p <- .10
exact <- pbinom(2, size = n, prob = p) # P(X <= 2)
normal_cc <- pnorm(2.5, mean = n*p,
                   sd = sqrt(n*p*(1-p)))
c(exact = exact, normal_with_continuity_correction = normal_cc)
```

This example compares probabilities under a known binomial model. It does not address uncertainty in p if p is estimated. Normal approximations are computationally convenient but should be checked near boundaries.

## Mixtures and multimodality

A population formed by mixing subgroups with different means may not be normal even if each subgroup is. For example, combining pediatric and adult measurements can produce a bimodal distribution; a single mean and SD obscure both groups. Stratify or model group membership when scientifically meaningful. A Q–Q plot can reveal tail departures but may not clearly diagnose multimodality; histograms and density plots are useful complements. Robust summaries may describe location better than the mean when distributions are asymmetric, but they answer different questions.

## Reference intervals and clinical thresholds

A reference interval is conventionally the central 95% of values in a selected reference population, leaving 2.5% in each tail. This means some healthy people fall outside by construction. A clinical decision limit is chosen based on outcomes, treatment benefits, and harms and may not coincide with a percentile. A diagnostic threshold balances sensitivity and specificity; a lab reference limit describes a distribution. Confusing these concepts creates unnecessary alarms or missed disease.

Parametric reference limits μ±1.96σ require approximate normality and robust estimation of mean and SD. Nonparametric percentile estimates require sufficient reference sample size, especially for tail quantiles. Partitioning by subgroup increases the required sample; do not create numerous intervals from sparse data. Follow CLSI EP28 or relevant specialty guidance and verify intervals locally when assay, population, or method differs.


## Standard errors for transformed and standardized quantities

Normal calculations often enter through a transformed statistic rather than the raw outcome. The delta method approximates a smooth function's distribution near an estimate. If log(X) is normal, quantiles back-transform multiplicatively: the 95th percentile is exp(μ+1.645σ), not exp(μ)+1.645exp(σ). For a lognormal variable with μ=0 and σ=.5, median is 1 while mean is exp(.125)=1.133. The arithmetic mean exceeds the median because of the upper tail.

```r
mu_log <- 0; sd_log <- .5
c(median = exp(mu_log), arithmetic_mean = exp(mu_log + sd_log^2/2),
  q95 = exp(mu_log + qnorm(.95)*sd_log))
```

This requires a lognormal model for positive values. Censoring, zeros, or a mixture of subpopulations violates the simple formulation. Report which scale's mean is being interpreted.

## Normal scores and reference standardization

A z-score compares an observation with a reference mean and SD: z=(x−μref)/σref. The reference group must match the intended comparison in age, sex, assay, and measurement conditions. Growth charts often use age-specific distributional curves rather than one fixed mean and SD because variance and skew change with age. A z-score is not intrinsically a percentile if the reference distribution is nonnormal; Φ(z) gives the percentile only under the normal model.

Repeatedly measuring a patient creates regression-to-the-mean effects: unusually high observed values partly reflect transient variation and tend to be less extreme on repeat, even without treatment. Selecting people because of an extreme baseline and then measuring change can therefore produce apparent improvement. Randomized controls and repeated baseline measures help distinguish true change from measurement variability.

## Robust alternatives and sample size

If data are heavily skewed, report quantiles and consider robust estimators, transformation, or a distribution tailored to the outcome. A large sample mean may have an approximately normal sampling distribution under finite variance, but the mean itself remains sensitive to extreme values and may not describe a typical patient. Bootstrap intervals can help, but sampling must respect clusters and the extreme tail must be represented. For highly skewed endpoints, plan sample size by simulation from plausible distributions and assess robustness to tail assumptions.

## Multiple measurements and the normal model

A measurement can be normal conditional on covariates even when the overall sample is not. Blood pressure may be approximately normal within age bands, while a mixture across ages shifts and spreads the distribution. Linear regression's normality condition applies to errors conditional on predictors for exact small-sample t inference; the marginal outcome may be skewed because predictors have different means. Conversely, a normal-looking outcome histogram does not establish independent, homoscedastic residuals.

For repeated measurements, subject-specific random effects can create a mixture distribution with wider marginal tails. A mixed model may assume normal random effects and residuals; check whether conclusions are robust to deviations. For bounded laboratory values or detection limits, an unbounded Gaussian model can produce impossible predictions. Use a scientifically appropriate transformation or likelihood rather than interpreting a normal fit as a property of nature.

## Quantile mapping and percentiles

The percentile of x under a normal reference is Φ((x−μ)/σ). If z=1.645, the value is at the 95th percentile; z=−1.96 is near the 2.5th percentile. Empirical percentile ranks can differ substantially if the reference distribution is skewed. When reporting a child's growth z-score or lab percentile, identify the reference chart, version, age range, and calibration population. Percentile ranks are not equal-interval scales: the difference between 50th and 60th percentiles does not represent the same measurement increment as between 90th and 100th.

When using a normal model for decision thresholds, show sensitivity to plausible mean and SD values if they were estimated or transported from another population. Tail probabilities can change rapidly with a small shift in the mean when the threshold lies near the center. Report parameter uncertainty or use predictive simulation rather than implying the plug-in tail probability is exact.

A z-score is only as defensible as the reference mean and SD. Reference values estimated from small samples carry uncertainty, and percentile estimates at distribution tails are especially imprecise. When a threshold drives treatment or referral, validate its operating consequences in the target population and report sensitivity, specificity, and predictive values rather than relying on a normal-tail calculation alone.

When a normal model is fitted to residuals, evaluate variance separately from shape. Normal errors with variance increasing across fitted values violate homoscedasticity and can invalidate conventional standard errors even if the Q–Q plot looks acceptable. Use heteroscedasticity-robust uncertainty or model the variance when justified. Independence and correct mean structure remain separate requirements; normality checks alone do not validate a model.

## References and further reading

- CLSI. [EP28: Defining, establishing, and verifying reference intervals in the clinical laboratory](https://clsi.org/standards/products/method-evaluation/documents/ep28/).
- NIST/SEMATECH. [Normal probability plot](https://www.itl.nist.gov/div898/handbook/eda/section3/normprpl.htm).

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland JM, Altman DG. *Medical Statistics: A Companion Guide*. Nelson.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Biostatistics*. Pearson.

The [sampling distributions article](sampling-distributions-and-the-central-limit-theorem.html)
explains why sample means can be approximately normal even when individual
values are not.
