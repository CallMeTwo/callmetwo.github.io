---
title: Confidence intervals
summary: A 95% confidence interval is a random interval that, over repeated samples, covers the true parameter 95% of the time - not a probability statement about this particular interval.
---

## Overview and key ideas

A **confidence interval (CI)** gives a range of plausible values for an unknown parameter, computed from the sample. For a mean (normal data or large n), a 95% CI is x-bar +/- 1.96 x SE; for a proportion, the large-sample interval is p-hat +/- 1.96 x sqrt(p-hat (1 - p-hat) / n). The width of the interval, roughly 4 x SE, is a direct measure of precision: a wide interval signals an imprecise estimate.

The interpretation trips up most readers. In the frequentist framework the parameter (the true mean, say) is **fixed**, and it is the interval that is **random**. "95% confidence" means: if the study were repeated many times, each time computing an interval with the same rule, then 95% of those intervals would contain the true parameter. Once your interval has been computed, it either contains the true value or it does not - so saying "there is a 95% probability that the true mean lies in this interval" is strictly wrong.

A CI also doubles as a hypothesis test: for a two-sided test at level alpha, the null value is rejected exactly when the 100(1 - alpha)% CI excludes it. A 95% CI for a risk ratio that does not include 1 corresponds to a p-value below 0.05.

Three practical notes round out the picture. First, for small samples the multiplier 1.96 is replaced by the appropriate t critical value with n - 1 degrees of freedom, giving a slightly wider interval. Second, wider is not inherently worse: a wide interval for a rare outcome may be an honest reflection of limited information, and the remedy is usually a larger sample or a longer follow-up, not a different calculation. Third, all of this presumes the model is right: a confidence interval inherits the assumptions of the estimator that produced it, so a model with strong confounding produces a precise interval around the wrong target.

## When to use it

| Setting | Example question |
| --- | --- |
| Randomised trial | By how much does the new drug lower LDL, and how precise is that estimate? |
| Non-inferiority trial | Is the upper limit of the CI below the prespecified non-inferiority margin? |
| Epidemiological cohort | What range of relative risks is compatible with the observed association? |
| Regression analysis | What is the plausible range for a regression coefficient after adjustment? |

## Assumptions and limitations

- The x-bar +/- 1.96 x SE formula is exact for normal data and approximate otherwise through the central limit theorem. With small n and skewed data (biomarkers with long right tails, for example), a log transformation or a t-based interval is more reliable.
- The normal-approximation CI for a proportion misbehaves near 0 or 1; use a Wilson or exact (Clopper-Pearson) interval when the event count is small.
- For ratio measures (risk ratio, odds ratio, hazard ratio) the CI is computed on the log scale and back-transformed, producing an asymmetric interval.
- A CI assumes the analysis model is correct and the sample is representative of the target population. A biased study produces a narrow interval centred in the wrong place.

## Worked example

In a single-arm study, 45 of 100 patients on a statin had their LDL lowered by at least 20% at 12 months, so p-hat = 0.45. The standard error is sqrt(0.45 x 0.55 / 100) = 0.0497, giving a 95% CI of 0.45 +/- 1.96 x 0.0497, that is 0.353 to 0.548 (35% to 55%). The correct reading: across many repetitions of this 100-patient study, 95% of the intervals computed this way would cover the true proportion of patients who respond. It is *not* correct to say "there is a 95% probability that the true response rate is between 35% and 55%"; the frequentist 95% attaches to the long-run performance of the procedure, not to this particular realised interval.

## Interpretation and common pitfalls

- **"There is a 95% probability the parameter is in this interval."** Under the frequentist reading the interval is fixed once observed and the parameter is fixed; the 95% refers to repeated sampling, not to this interval.
- **Equating "the CI crosses the null" with "equivalence."** A wide interval that includes both clinically beneficial and harmful values is evidence of imprecision, not of harmlessness. Declaring equivalence requires a formal equivalence or non-inferiority design with prespecified margins.
- **Using the CI only as a disguised p-value.** The interval also conveys the range of clinically plausible effects; if it spans values that would change management, the study is too imprecise to be decisive whatever the p-value says.
- **Taking a narrow CI as proof of accuracy.** Width reflects sample size and variability, not freedom from bias.

## Constructing intervals for common estimands

The simple estimate ± critical value × standard error recipe works only
when the estimator is approximately symmetric on its working scale. For a
mean from a modest sample, use the Student t quantile rather than 1.96:
\(\bar{x} \pm t_{0.975,n-1}s/\sqrt{n}\). With mean 8.4, SD 2.7, and n=36,
the SE is 0.45 and \(t_{0.975,35}\approx2.03\), giving 7.49 to 9.31
mmol/L. The interval is a statement about the population mean under the
sampling model, not a prediction interval for an individual measurement.
The latter is wider because it includes both sampling uncertainty and
person-to-person variation.

For a proportion, the Wald interval uses \(\hat p\pm1.96\sqrt{\hat p(1-\hat
p)/n}\). Near 0 or 1 it can extend beyond the legal range [0,1], and its
coverage may be poor even at moderate n. Wilson's score interval avoids
that defect by inverting the score test. For k successes among n trials,
let \(z=1.96\); its centre is
\((\hat p+z^2/(2n))/(1+z^2/n)\), and its half-width is
\(z\sqrt{\hat p(1-\hat p)/n+z^2/(4n^2)}/(1+z^2/n)\). With 2 successes in
20, the Wald interval is approximately −0.03 to 0.23, while the Wilson
interval is about 0.028 to 0.301. The latter stays in range and has better
small-sample coverage. An exact Clopper–Pearson interval is conservative
(coverage is at least nominal, often appreciably higher); it is useful for
very sparse binomial data when that conservatism is acceptable.

The following R code uses a separate toy sample to show the corresponding
commands; its numerical result is not intended to reproduce the summary
statistics above.

```r
binom.test(2, 20)                 # exact binomial interval
prop.test(2, 20, correct = FALSE) # score-based interval/test
```

For a risk ratio or odds ratio, inference is usually approximately normal
on the logarithmic scale. If \(\hat\theta\) is the ratio and
\(SE_{\log\theta}\) its standard error, form
\([\log\hat\theta-1.96SE,\log\hat\theta+1.96SE]\) and exponentiate both
ends. Back-transformation makes the interval asymmetric around the ratio,
as it should be for a positive parameter. Do not calculate a symmetric
interval directly on the ratio scale. For a risk difference, the scale is
additive and a suitable score, Newcombe, or model-based interval is often
preferable to the elementary Wald interval, especially when event counts
are small or one risk is near a boundary.

## Design-based and model-based uncertainty

A model-based interval treats the assumed likelihood or regression model
as the source of repeated samples. A design-based interval instead reflects
the sampling design, including strata, unequal selection weights, and
clusters. These are not interchangeable: in a cluster-randomised trial,
patients within the same clinic tend to resemble one another. If 20 clinics
contribute 50 patients each, the nominal n=1,000 overstates independent
information. For average cluster size m and intracluster correlation rho,
the approximate design effect is \(1+(m-1)\rho\). With m=50 and rho=0.02,
it is 1.98; the effective sample size is roughly 1,000/1.98=505. Use an
analysis respecting the randomisation unit or cluster-robust methods with
enough independent clusters. Robust standard errors with only a handful of
clusters can still be seriously biased.

Bootstrap intervals resample observational units and refit the estimator;
the resampling unit must match the independent unit (resample clinics, not
patients, for a cluster sample). Percentile intervals use empirical
quantiles, while BCa intervals adjust for bias and skewness. Bootstrap
resampling cannot repair confounding, selection, poor measurement, or a
nonrepresentative sample; it estimates sampling variation under the
observed data-generating structure. For heavily skewed estimators, sparse
events, or estimates on a boundary, check whether the bootstrap distribution
is stable and whether the method is appropriate for the estimand.

## Reading width against a clinical decision

The same interval can support different practical conclusions depending
on a prespecified threshold. Suppose a new therapy reduces mean pain by an
estimated 1.2 points on a 0–10 scale, with 95% CI 0.2 to 2.2, and a
clinically important improvement is 1.0 point. The estimate is compatible
with both a trivial average benefit and a substantial one; the interval
crosses the decision threshold. A p-value below 0.05 would not resolve
that uncertainty. In non-inferiority work, the relevant comparison is the
confidence bound against a clinically justified margin, not whether the
interval includes zero. In equivalence, both bounds must lie within the
equivalence margins. Always state the estimand, analysis population,
confidence level, and interval method, particularly when alternatives
(complete-case, imputed, robust, or model-based) produce materially
different limits.

## Intervals from regression and survival models

## Coverage in practice and precision planning

## One-sided bounds in safety and non-inferiority

An interval's precision can also be compared with a decision threshold. If
a minimally worthwhile benefit is 2 mmHg and a trial estimates a 1-mmHg
reduction with a 95% interval from 0.2 to 1.8 mmHg, the interval excludes
no effect but also excludes the prespecified worthwhile benefit. This is
statistically distinguishable from zero yet may have little clinical
importance. If instead the interval is 0.2 to 3.5, the estimated benefit
is positive but the evidence remains compatible with both small and
important effects. The correct conclusion is about what values remain
compatible with the data, not whether a single threshold has been crossed.

Intervals are also affected by the estimand's time horizon. A risk
difference at 30 days cannot be read as a one-year difference, especially
when hazards vary over time or competing events occur. For repeated
measurements, an interval around a mean trajectory is not an interval for
individual trajectories; the latter needs prediction or random-effect
uncertainty. Report time, population, endpoint, and contrast with every
interval so that precision statements remain tied to the quantity actually
estimated.

Many decisions depend on one confidence bound rather than a central
two-sided interval. To show that a treatment's excess risk is below a
non-inferiority margin M, compare the upper one-sided bound for
\(p_T-p_C\) with M. A one-sided 97.5% upper bound matches the upper end of
a two-sided 95% interval when based on the same symmetric procedure. For
safety, an upper bound on the risk difference can rule out an unacceptable
increase even when the estimate is near zero; for efficacy, a lower bound
may be compared with a minimum worthwhile benefit. The direction must be
chosen before results are known. Reversing the tail after observing an
unexpected estimate invalidates nominal coverage.

In sparse event settings, one-sided exact bounds may be materially wider
than normal approximations. With zero observed events among n patients,
the observed risk is 0, but the true risk is not thereby proven to be zero.
The approximate “rule of three” gives a 95% upper bound near 3/n when
events are rare and observations independent. With n=100, zero events is
compatible with a risk around 3%; this may be unacceptable if the safety
threshold is 1%. The exact binomial upper bound is
\(1-0.05^{1/n}\), about 2.95% for n=100. This calculation illustrates
why “no events observed” must be accompanied by a denominator and an
uncertainty bound.

Coverage is a property of a procedure across repeated datasets, and it
depends on how the interval is constructed. A nominal 95% Wald interval
may cover less than 95% when the sample is sparse, the estimator is near a
boundary, or the sampling distribution is asymmetric. A score or exact
interval may have coverage closer to or above nominal at the expense of
width. An interval's reported confidence level therefore does not by
itself certify its operating characteristics; method choice should match
the data type and sample size.

For a mean with known SD, approximate 95% half-width is
\(1.96\sigma/\sqrt n\). To target half-width h, solve
\(n=(1.96\sigma/h)^2\). If SD is 12 mmHg and desired precision is 3 mmHg,
\(n=(1.96\times12/3)^2=61.5\), so at least 62 independent observations
are needed. This is a precision calculation, distinct from a power
calculation: it asks how narrow the interval should be, not the probability
of rejecting a null at a specified effect. Inflate for clustering,
attrition, and design features that affect effective information.

```r
sigma <- 12
target_half_width <- 3
ceiling((qnorm(.975) * sigma / target_half_width)^2)
```

If SD is estimated from a small pilot study, its uncertainty can make this
planning value optimistic. Use a conservative plausible SD or show a
range of required sample sizes. Precision targets should be anchored to
clinical interpretation: an interval narrow enough to distinguish
clinically meaningful benefit from no benefit may be more useful than a
conventional sample size with no explicit precision rationale.

For a regression coefficient, a Wald interval is estimate ± critical value
times its model-based SE. For a log-link coefficient, exponentiate both
limits to report a rate ratio; for logistic regression, exponentiate to
report an odds ratio. The interval is conditional on the model's functional
form, covariates, variance specification, and sampled population. If a
continuous predictor is modeled linearly but its true association is curved,
the reported coefficient interval can be narrow and still summarize the
wrong contrast. Flexible splines, prespecified contrasts, and plotted
predicted outcomes make the parameter easier to interpret.

Wald intervals can be poor with sparse data, near separation, or highly
skewed likelihoods. Profile-likelihood intervals invert the likelihood
ratio test and often behave better in those settings, though they still
depend on model adequacy. For a hazard ratio, the standard interval is
constructed on the log-HR scale; it quantifies uncertainty under the
proportional-hazards model. If proportional hazards fail, a single interval
around one HR may have no stable time-averaged interpretation. Consider
time-varying effects or a fixed-horizon survival difference and report the
estimand explicitly.

## Interval coverage and multiplicity

Nominal 95% coverage is a repeated-sampling property under stated
conditions. If a 95% interval procedure is applied repeatedly to the same
parameter under its model, about 95% of intervals cover it in the long run.
This does not imply that every subgroup interval or every endpoint interval
in a study has simultaneous 95% coverage. If readers select the most
promising estimate from many unadjusted intervals, the selected interval
will tend to be too optimistic. Simultaneous intervals or an explicit
multiple-comparison procedure are needed for familywise statements.

Coverage can also fail when standard errors ignore clustering, weights,
adaptivity, or the mechanism that generated missing data. A valid interval
for an observed-data estimand may not answer the causal question if
participants with missing outcomes differ systematically. Sensitivity
analysis should vary plausible assumptions (for example, departures from
missing at random) and show how the estimate and interval move. Reporting a
single narrow interval without explaining these assumptions can imply
certainty the design did not deliver.

## Worked calculation: mean, median, and prediction

Suppose a sample of 36 patients has mean glucose 8.4 mmol/L and SD 2.7.
The estimated SE is 0.45. With 35 degrees of freedom, the 95% t multiplier
is about 2.03, so the confidence interval for the population mean is
\(8.4\pm2.03(0.45)=[7.49,9.31]\). If the scientific question is instead
the range expected for an individual patient's glucose, a prediction
interval is approximately
\(8.4\pm t_{.975,35}(2.7\sqrt{1+1/36})\), or [2.9,13.9]. This much
wider interval reflects individual variation. The interval for the mean
must not be interpreted as containing 95% of patient values.

```r
x <- c(7.2, 8.0, 9.1, 6.8, 11.2, 7.5, 8.4, 9.0, 6.9, 8.1,
       7.6, 10.0, 8.8, 6.7, 9.5, 7.9, 8.3, 5.9, 12.1, 7.4,
       8.6, 7.1, 9.3, 8.2, 6.5, 10.4, 7.7, 8.9, 7.0, 9.7,
       8.5, 6.3, 10.1, 7.8, 8.7, 6.4)
t.test(x)$conf.int
mean(x) + c(-1, 1) * qt(.975, length(x) - 1) *
  sd(x) * sqrt(1 + 1 / length(x)) # prediction interval
```

In applied regression, use `predict()` with a meaningful covariate profile
and distinguish confidence limits for the conditional mean from prediction
limits for an individual.

An interval for a median is not obtained by using SD/√n. A distribution-free
method inverts binomial probabilities for order statistics: choose lower
and upper ranks whose coverage probability is at least the target. It can
be conservative, especially with small n, and may be unbounded if the
sample contains too few observations. Quantile regression and bootstrap
intervals offer alternatives under other assumptions. For skewed
biomarkers, a log-scale mean interval estimates a geometric mean ratio,
which is not the same estimand as an arithmetic mean difference. State the
summary and scale explicitly.

## References and further reading

- Altman DG, Machin D, Bryant TN, Gardner MJ, eds. *Statistics with Confidence: Confidence Intervals and Statistical Guidelines*. 2nd ed. BMJ Books, 2000.
- Lang TA, Altman DG. [The SAMPL guidelines](https://www.equator-network.org/reporting-guidelines/sampl/), recommendations for reporting estimates and uncertainty.
- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott-Raven.
- The [point estimates and standard errors article](/biostatistics-library/inference/point-estimates-and-standard-errors.html) explains the sampling uncertainty that determines interval width.
- Wilson EB. Probable inference, the law of succession, and statistical inference. *Journal of the American Statistical Association*. 1927;22:209–212. [doi:10.1080/01621459.1927.10502953](https://doi.org/10.1080/01621459.1927.10502953)
- Newcombe RG. Two-sided confidence intervals for the single proportion: comparison of seven methods. *Statistics in Medicine*. 1998;17:857–872. [doi:10.1002/(SICI)1097-0258(19980430)17:8%3C857::AID-SIM777%3E3.0.CO;2-E](https://doi.org/10.1002/(SICI)1097-0258(19980430)17:8%3C857::AID-SIM777%3E3.0.CO;2-E)
- Efron B, Tibshirani RJ. *An Introduction to the Bootstrap*. Chapman & Hall/CRC, 1993.
