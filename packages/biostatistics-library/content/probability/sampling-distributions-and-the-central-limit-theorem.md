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

## Sampling distributions and the logic of standard error

A statistic varies from sample to sample even when the population and data-generating process stay fixed. Its sampling distribution is the probability distribution induced by the sampling design. This is distinct from the empirical distribution of the observed participants. Repeated-sampling thought experiments explain why an estimator has a standard error and how interval procedures achieve coverage. The standard error is generally estimated from the data; it is not known simply because a formula exists.

For independent identically distributed observations with finite variance σ², the sample mean has expectation μ and variance σ²/n exactly. The standardized mean, √n(X̄−μ)/σ, converges in distribution to N(0,1) as n grows under the classical CLT. “Converges” is asymptotic: approximation quality depends on skew, tail behavior, and sample size. If the population has infinite variance, the classical result may fail. Dependence changes the variance: Var(X̄) includes covariance terms, so positive intraclass or serial correlation reduces effective information.

For a sample proportion p̂ from n Bernoulli observations, variance is p(1−p)/n. The normal approximation is unreliable near boundaries or with few expected events; Wilson score intervals generally behave better than Wald intervals. For a difference in independent means, variances add; for paired measurements, the variance is that of within-person differences, often much smaller because stable person-level variation cancels. The design determines the sampling distribution and therefore the right standard error.

### Worked example: precision and probability of a sample mean

Assume the population HbA1c has mean 7.5% and SD 2.0%. For n=49 independent observations, SE=2/7=0.2857. The probability that a sample mean is at least 7.8% is approximately 1−Φ((7.8−7.5)/0.2857)=1−Φ(1.05)≈0.147. A 95% normal-approximation interval around an observed mean of 7.8 is 7.8±1.96(0.2857), approximately 7.24 to 8.36%; for small samples with estimated SD use a t critical value. Quadrupling n to 196 halves the SE, a consequence of square-root scaling.

```r
mu <- 7.5; sigma <- 2; n <- 49
se <- sigma / sqrt(n)
p_ge_7_8 <- pnorm(7.8, mean = mu, sd = se, lower.tail = FALSE)
ci_if_xbar_7_8 <- 7.8 + c(-1, 1) * qnorm(0.975) * se
c(SE = se, P_mean_ge_7_8 = p_ge_7_8, ci_if_xbar_7_8)
```

This probability is conditional on the assumed μ and σ and an approximate normal sampling distribution. It is not the posterior probability that the population mean exceeds 7.8. Those are different inferential statements.

### Simulation as a diagnostic aid

Simulation can show sampling variability under a specified model and reveal when asymptotic approximations are poor. For example, repeatedly drawing skewed exponential observations and averaging them illustrates convergence of the mean's distribution toward normality. Simulation does not establish that the model matches real data; it answers “what follows if this data-generating assumption were true?” Use a fixed seed for reproducibility and enough replications to stabilize simulation summaries.

```r
set.seed(2026)
B <- 5000; n <- 10
means <- replicate(B, mean(rexp(n, rate = 1)))
mean(means)       # near population mean 1
sd(means)         # near theoretical SE 1/sqrt(n)
quantile(means, c(.025, .5, .975))
hist(means, breaks = 40, main = "Sampling distribution of mean",
     xlab = "Mean of 10 exponential observations")
```

For n=10 the distribution remains right-skewed to some extent; increasing n improves the approximation. `replicate` samples independent observations here. For clustered or repeated data, resampling individuals independently would destroy the dependence structure; resample whole clusters or use design-respecting methods.

### Bootstrap and design-based alternatives

The nonparametric bootstrap approximates a sampling distribution by resampling observed units with replacement. It can help for nonlinear statistics but relies on the sample representing the population and may fail for extreme tails, small samples, or boundary parameters. A cluster bootstrap resamples clusters; a stratified bootstrap resamples within strata. Randomization inference instead uses the known treatment assignment mechanism to form a reference distribution for a sharp null. These methods answer different questions and are not interchangeable generic fixes.

Always report the estimator and its uncertainty, state whether intervals use normal, t, bootstrap, survey, or model-based methods, and account for design effects. A small standard error means precision under the assumed sampling model; it does not imply absence of selection bias, measurement error, or confounding.


## Proportions, differences, and design effects

For a sample proportion, the CLT yields an approximately normal distribution when both n p and n(1−p) are sufficiently large. If there are few events, the distribution is skewed and boundary-aware intervals are preferable. For independent groups with proportions p1 and p2, the variance of the difference is p1(1−p1)/n1+p2(1−p2)/n2. Paired binary data require discordant-pair information; two marginal proportions alone do not supply the variance of a paired difference.

### Worked example: standard error and detectable precision

If p=.20 and n=400, SE(p̂)=sqrt(.2×.8/400)=.02. A rough 95% margin is 1.96(.02)=.039, so the estimate has about ±4 percentage point sampling error. To target a margin of 0.03 under this approximate formula, solve n≈1.96² p(1−p)/.03²≈683. If p is unknown, using .5 gives the most conservative variance and n≈1,068. This calculation ignores design effects, nonresponse, and finite population corrections.

```r
p <- .20; margin <- .03
n_needed <- qnorm(.975)^2 * p * (1-p) / margin^2
n_conservative <- qnorm(.975)^2 * .25 / margin^2
c(n_needed = ceiling(n_needed),
  conservative_n = ceiling(n_conservative))
```

These are approximate planning values; use an exact or score-based method for final design, adjust for expected response, and inflate for clustering. If subgroup precision is required, plan each subgroup rather than only the overall sample.

## Unequal sampling and finite populations

When sampling without replacement from a finite population of size N, the variance of a sample mean includes finite population correction sqrt((N−n)/(N−1)). It matters when the sampled fraction is substantial. In large populations with small sampling fractions it is nearly one and can be ignored. Complex survey samples add stratification, clustering, and unequal selection weights; their standard errors should be estimated with design information, commonly using Taylor linearization or replicate weights.

The ordinary bootstrap assumes independent sampling from an empirical distribution. For a stratified sample resample within strata; for clusters resample primary units; for unequal probability designs use replicate-weight methods supplied with the survey design. Standard errors from software that ignores these features can be dramatically underestimated. The sample design is part of the sampling distribution, not a nuisance added after analysis.

## CLT limitations under dependence and heavy tails

Serial dependence creates covariance contributions: Var(X̄)=σ²/n + (2/n²)Σ_(i<j) Cov(Xi,Xj). Positive correlation makes the standard error larger than σ/√n. For an autoregressive process with correlation ρ^k, a rough effective sample size for large n is n(1−ρ)/(1+ρ). If ρ=.5, only about one-third of the nominal observations contribute independent information. This approximation assumes stationary AR(1) correlation and should not replace time-series methods.

Heavy-tailed distributions can converge slowly; one or two extremes can dominate a finite-sample mean. Robust estimators, transformations, or bootstrap intervals may help but change assumptions or estimands. If observations are spatially correlated, neighboring measurements share information; spatial covariance modeling or cluster-robust methods may be needed. The phrase “n is large” is not a universal permission to ignore dependence.

## Simulation of coverage

A confidence interval can be evaluated by repeated simulation under a known data-generating model. For example, generate many samples from a skewed distribution and calculate t intervals; the fraction containing the true mean estimates coverage in that scenario. Vary sample size and distribution to understand limitations. This evaluates operating characteristics conditional on simulated assumptions; it does not validate those assumptions for the actual study.

```r
set.seed(42)
B <- 2000; n <- 15; mu <- 1
covered <- replicate(B, {
  x <- rexp(n, rate = 1)
  ci <- t.test(x)$conf.int
  ci[1] <= mu && mu <= ci[2]
})
mean(covered)
```

A single Monte Carlo estimate has simulation error approximately sqrt(c(1−c)/B); with coverage near .95 and B=2,000 this is about .005. Increase replications for stable comparisons. Preserve a seed and report the model, interval method, and number of simulations if simulation informs design decisions.


## Standard error versus prediction uncertainty

The standard error of a sample mean describes uncertainty in the estimated population mean. A prediction interval for a new individual includes both uncertainty in the mean and individual-level variation. Under normal sampling, a prediction interval for a future observation is approximately X̄±t s√(1+1/n), wider than the confidence interval X̄±t s/√n. Confusing these leads to claims that a mean estimate predicts individual outcomes precisely.

### Worked calculation: confidence versus prediction interval

For n=25 measurements with mean 100 and SD 15, df=24 gives t critical about 2.064. The mean's 95% interval is 100±2.064(15/5), or 93.8 to 106.2. A prediction interval is 100±2.064(15√1.04), or approximately 68.4 to 131.6. The first interval concerns the population mean; the second concerns one future individual under the normal model.

```r
n <- 25; xbar <- 100; s <- 15
tcrit <- qt(.975, n-1)
ci_mean <- xbar + c(-1,1)*tcrit*s/sqrt(n)
pi_individual <- xbar + c(-1,1)*tcrit*s*sqrt(1+1/n)
rbind(mean_CI = ci_mean, individual_PI = pi_individual)
```

The prediction interval assumes a future observation from the same stable population and normal model. It does not account for future changes in clinical practice or population mix.

## Sample-size planning as precision design

For estimating a normal mean with known or anticipated SD σ and desired half-width d, approximate n=(z_(.975)σ/d)². If σ=2 and desired half-width .3, n≈(1.96×2/.3)²≈171. The calculation targets precision, not power for a hypothesis test. For comparing groups, include allocation ratio and anticipated loss to follow-up; for clustered trials, inflate by the design effect. If the SD estimate is uncertain, use conservative plausible values or pilot data with caution.

Sample size cannot remedy poor measurement or selection. For rare proportions, normal formulas may underestimate needed n; use exact planning or simulation. For multiple primary outcomes or subgroup precision, adjust the design objectives accordingly. State whether the target is a confidence interval width, power for a clinically important difference, or both.

## Reproducibility of simulation studies

Simulation code should state the data-generating model, parameter values, number of repetitions, random seed, and performance metric. Monte Carlo error can be reduced by more repetitions; it cannot be reduced by rounding. Use vectorized or carefully checked code and validate a small run by hand. Keep simulated scenarios separate from empirical validation: simulations explore consequences of assumptions, while data assess how well those assumptions describe a real setting.

## Paired designs and covariance

For paired measurements X and Y on the same person, Var(X−Y)=Var(X)+Var(Y)−2Cov(X,Y). Positive correlation can make the difference much more precise than an unpaired comparison. If pre- and post-treatment SDs are each 10 and correlation is .7, SD of differences is sqrt(100+100−140)=7.75, not sqrt(200)=14.14 as an independence assumption would imply. The paired design gains precision by controlling stable between-person variability; it does not remove time trends or regression to the mean.

```r
sd_pre <- 10; sd_post <- 10; rho <- .70
sd_change <- sqrt(sd_pre^2 + sd_post^2 -
                  2*rho*sd_pre*sd_post)
sd_change
```

Use the actual within-person covariance or calculate differences from raw paired records. Marginal summaries alone cannot reconstruct the standard error of change without correlation information.

## Multiple comparisons and selection

A 95% interval for each of 20 independent null effects will miss zero for at least one about 1−.95^20=.642 of the time. The independence assumption is illustrative; correlated tests change the exact probability, but selective attention to the smallest p-value still inflates false discoveries. Distinguish a prespecified primary estimate from exploratory analyses, and use multiplicity procedures or replication when making families of claims. The CLT does not protect against selection bias induced by reporting only favorable analyses.

## When asymptotics should be supplemented

For small samples, sparse events, high leverage, or complex dependence, use exact randomization distributions, small-sample t methods, bootstrap schemes matching the design, or simulation-based calibration. Report limitations and avoid implying that a standard error formula is universally reliable. The relevant question is whether the estimator's sampling distribution under the actual design is adequately approximated by the chosen reference distribution.

A standard error is meaningful only with its estimator and design attached. “SE=2” could refer to a mean, regression coefficient, cluster-adjusted contrast, or bootstrap estimate. State the independent unit, variance method, and whether degrees-of-freedom corrections were applied. This makes the uncertainty calculation reproducible and lets readers judge whether the assumed sampling distribution is credible.

## Do not use the CLT to excuse biased sampling

The CLT describes random variation of a statistic under a sampling process; it does not guarantee that the process targets the desired population. A precisely estimated clinic mean can differ systematically from a community mean because of referral patterns. Increasing n narrows sampling error but leaves selection, measurement, and confounding biases intact. Discuss these sources separately from the standard error and use design, weighting, validation, or sensitivity analysis where possible.

## References and further reading

- NIST/SEMATECH. [Normal distribution and central limit theorem](https://www.itl.nist.gov/div898/handbook/eda/section3/eda3661.htm).
- Rice JA. *Mathematical Statistics and Data Analysis*. 3rd ed. Cengage Learning; 2006.

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland JM, Altman DG. *Medical Statistics: A Companion Guide*. Nelson.
- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott Williams & Wilkins.

The articles on estimation and confidence intervals in this library build on
these sampling-distribution ideas.
