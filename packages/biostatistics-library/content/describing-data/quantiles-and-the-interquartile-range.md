---
title: Quantiles and the interquartile range
summary: Percentiles, quartiles and the IQR as robust summaries of position and spread, plus Tukey fences for outlier screening.
---

## Overview and key ideas

A **quantile** cuts a distribution into equal-probability pieces: the p-th quantile is the value below which a proportion p of observations falls. The 50th percentile (p = 0.5) is the median; the 25th and 75th percentiles are the first and third quartiles (Q1, Q3); the 95th percentile (P95) is the value exceeded by only 5% of the sample. The **interquartile range (IQR)** is Q3 − Q1, the width of the box containing the middle 50% of the data.

Unlike the mean and SD, the quartiles and IQR are **resistant**: shifting a few extreme values barely moves them. That is exactly why they are the default summary for skewed clinical variables — lengths of stay, biomarker concentrations, income, waiting times — and why the box plot is built from them. Quantiles are also the inverse of the cumulative distribution: where the CDF answers "what proportion is below x?", the quantile answers "which value is exceeded by 1 − p of the population?" — the natural language of reference ranges.

- Q1, median and Q3 locate where patients cluster, without assuming any distribution shape.
- The IQR measures spread in the variable's own units, covering the middle 50% rather than an arbitrary 95%.
- Tukey's outlier rule flags observations beyond Q1 − 1.5×IQR or Q3 + 1.5×IQR for review.
- Percentiles underlie reference intervals: the commonly used adult reference range is the 2.5th–97.5th centile of a healthy population.

## When to use it

| Setting | Example question |
| --- | --- |
| Skewed continuous variable in a baseline table | How spread are CRP values when most sit near the lower limit of detection? |
| Outlier screening before modelling | Which patients fall beyond 1.5×IQR of a covariate's distribution? |
| Establishing reference intervals | What are the 2.5th and 97.5th centiles of this laboratory analyte? |
| Growth or dosing data | How does the 90th percentile of body weight change with age? |
| Comparing groups without normality | Do the middle 50% of outcomes differ between treatments? |
| Reporting skewed trial endpoints | How do the 25th, 50th and 75th percentiles of time-to-recovery compare between arms? |

## Assumptions and limitations

- No distributional assumption is needed to *report* quartiles, but individual quantile estimates are unstable in small samples; the 2.5th and 97.5th centiles in particular need large samples to be precise.
- Several slightly different algorithms exist for sample quantiles (linear interpolation vs nearest-rank; inclusive vs exclusive halves), so Q1 and Q3 can differ a little between software packages; state the method when exact values matter.
- The IQR describes only the middle half. A variable with identical quartiles but very different tails is not fully characterised; pair the IQR with the range or a histogram.
- A bimodal distribution can have a wide IQR that spans a gap between two clusters, so the IQR can hide the very structure a histogram would reveal.
- Tukey's 1.5×IQR fences are a screening heuristic, not a test of abnormality; in a small or skewed sample, values beyond the fence can be entirely expected and legitimate.
- Percentiles are order statistics of the sample, not properties of a fitted model: two samples from the same population can give noticeably different P95s.

### Estimating and comparing quantiles

Sample quantiles are order-statistic estimates, and software conventions
interpolate differently between adjacent ordered values. For a reproducible
report, specify the algorithm when exact quartile values matter and use the
same method across groups. A confidence interval for a population quantile
can be built from binomial order-statistic theory; it is often wide in the
tails unless the sample is large. In survival data, ordinary sample
percentiles are inappropriate when some participants are censored before the
quantile is reached; Kaplan–Meier methods estimate time quantiles while
accounting for censoring under independent censoring assumptions.

## Worked example

Eleven patients with suspected hypercholesterolaemia had total cholesterol (mmol/L) of 3.8, 4.1, 4.4, 4.6, 4.9, 5.2, 5.5, 5.8, 6.2, 6.9, 8.4. The median (6th value) is 5.2; the median of the lower five values is Q1 = 4.4 and the median of the upper five is Q3 = 5.8, so the IQR is 5.8 − 4.4 = 1.4 mmol/L. Equivalently, 50% of patients had cholesterol below 5.2 and 75% below 5.8 mmol/L — the reading a clinician most often wants.

Tukey's fences are 4.4 − 1.5×1.4 = 2.3 and 5.8 + 1.5×1.4 = 7.9. The 8.4 mmol/L result lies above the upper fence and is flagged for review — worth checking for an acute-phase illness, a lab artefact, or a genuinely different patient, rather than deleting automatically. The summary "median 5.2 (IQR 4.4–5.8) mmol/L" tells a more faithful story than the mean of 5.4, which is pulled upward by the single high value. Note that with 11 values the "exclusive halves" method is used here (drop the median, take the median of each remaining half); inclusive methods give slightly different Q1/Q3 — another reason to state the method.

## Interpretation and common pitfalls

- Treating the IQR as comparable to the SD. For a normal distribution the IQR ≈ 1.35×SD, so the two are not interchangeable and should not be mixed within one table.
- Flagging every value beyond the Tukey fence as an error. In skewed or small data, roughly 1–2% of legitimate observations fall outside; investigate, don't delete.
- Comparing IQRs across variables on different scales, as if they were unit-free like the coefficient of variation.
- Reporting percentiles from small samples as though they were stable; a P95 estimated from 30 observations carries a very wide uncertainty.
- Assuming the median is the mean. In skewed data the two differ, and readers substitute whichever they see — report both or state the convention.

## Quantiles as inverse distribution functions

For a population distribution function F(x)=P(X≤x), the p quantile is often defined as Q(p)=inf{x:F(x)≥p}. In a continuous distribution, F(Q(p))=p; with discrete data or ties, no observed value may yield exactly p. Sample quantiles estimate these population cut points using ordered observations and an interpolation convention. The empirical distribution function is F_n(x)=n^−1ΣI(X_i≤x); its jumps are 1/n, making tail estimates coarse when n is small.

Quartiles divide ordered values into four approximately equal groups: Q1=Q(.25), median=Q(.5), and Q3=Q(.75). IQR=Q3−Q1 is a robust spread measure in the original units. It is resistant to extreme values because only central ranks determine it, but it ignores tail distance. A percentile is not a percentage of values equal to that number; it is a threshold with a specified proportion at or below it, subject to ties.

### Worked example: algorithms and interpolation

For x=(3,5,7,9), the median is (5+7)/2=6. Under R's default type 7 algorithm, the 25th percentile position is 1+(n−1)p=1.75, so Q1=3+.75(5−3)=4.5. Q3 position is 3.25, so Q3=7+.25(9−7)=7.5; IQR=3. Other algorithms can return different sample quartiles, especially at small n. The data themselves do not determine a unique interpolation convention.

```r
x <- c(3, 5, 7, 9)
quantile(x, c(.25, .5, .75), type = 7)
quantile(x, c(.25, .5, .75), type = 1) # inverse empirical CDF convention
```

Type 1 returns observed order statistics and type 7 interpolates; neither is universally correct for every purpose. State the convention when exact reproducibility matters and use one method consistently across groups. For very large samples, differences often become small relative to sampling variability.

## Uncertainty for quantiles

Quantiles are estimated from order statistics. For a target median m, the number of observations below m is binomial with probability near .5 under continuity. A nonparametric confidence interval can be formed from selected ordered values X_(k) and X_(n−k+1), choosing k so binomial tail probabilities achieve the desired coverage. This interval is distribution-free under independent sampling and continuity, but can be wide for modest n. In the tails, uncertainty is much larger because few observations determine the estimate.

For a P95 estimate, a sample of 30 has only about 1.5 expected observations above the population P95; the apparent sample maximum may effectively determine the estimate. Laboratory reference intervals based on 2.5th and 97.5th percentiles therefore need much larger reference samples than median summaries. If data are clustered, ordinary order-statistic intervals ignore dependence; resample clusters or use design-aware methods.

```r
set.seed(7)
x <- rexp(200, rate = 1)
median(x)
quantile(x, c(.25, .5, .75, .95))
# Bootstrap uncertainty for the median, resampling independent observations
boot_med <- replicate(2000, median(sample(x, replace = TRUE)))
quantile(boot_med, c(.025, .975))
```

The bootstrap interval approximates sampling uncertainty under an empirical distribution; it can be poor for small samples and tail percentiles. For clustered data, resample whole clusters, and for survey data retain strata and weights. Use a fixed seed for reproducibility but do not mistake reproducibility for validity.

## Tukey fences and robust scale

Fences Q1−1.5IQR and Q3+1.5IQR are exploratory flags. A value beyond a fence is not automatically erroneous or biologically abnormal. The rule is symmetric in distances from quartiles, so it can flag many legitimate high values in a right-skewed distribution. For strongly skewed data, adjusted box plots or transformations may be more useful, but any flag should prompt source verification and context rather than deletion.

For normal data, IQR≈1.349σ, so an IQR-based scale estimate is IQR/1.349. This estimate is robust but less efficient than SD under an exact normal model. The median absolute deviation (MAD) is another robust measure; a normal-consistent estimate is approximately 1.4826×MAD. Each scale answers a slightly different question. Report units and do not compare raw IQR across differently scaled variables.

## Quantiles for censored survival outcomes

If participants are censored before the event, ordinary empirical quantiles among observed event times are biased because those still event-free have incomplete follow-up. Kaplan–Meier estimates the survival function; the median survival is the time at which estimated survival first falls to .5, if reached. If follow-up ends while survival remains above .5, median is not estimable and should be reported as not reached, not replaced by the largest observed time. Confidence intervals for survival quantiles can be obtained by inverting confidence bands under suitable conditions.

The same caution applies to upper-tail recovery times with loss to follow-up. Report censoring, number at risk, and follow-up distribution. Quantile regression can estimate conditional quantiles with covariates, but ordinary regression of sample quantiles is not equivalent; assumptions and standard errors depend on the method.

## R and reporting

Use `quantile(x, probs=..., type=...)` and record the type if reproducibility matters. Pair median and IQR with sample size and units. For grouped analyses, apply the same convention and show missing denominators. A histogram, ECDF, or box plot complements the IQR by revealing tails, clusters, and gaps that quartiles omit. Do not interpret a percentile difference as a difference in means or as a causal effect without an appropriate design and estimand.


## Order-statistic confidence interval example

For a continuous population median m, the number of sample observations below m follows Binomial(n,.5). With n=11, the interval [X_(3),X_(9)] has coverage P(3≤B≤8) for B~Binomial(11,.5), approximately 0.935; this is a conservative nonparametric interval for the median. To get coverage above 95%, an interval may extend farther, for example [X_(2),X_(10)] with coverage about 0.988. The interval is discrete and can be wide. For n=11, no interval can attain exactly 95% using only two observed order statistics.

```r
n <- 11
sum(dbinom(3:8, size = n, prob = .5)) # coverage for X_(3) to X_(9)
sum(dbinom(2:9, size = n, prob = .5)) # coverage for X_(2) to X_(10)
```

The order-statistic result assumes independent observations from a continuous population. Ties, clustering, weighted samples, or informative sampling require adaptations. The interval covers the population median under repeated samples; it is not the range containing 95% of patient values.

## Quantile regression and conditional distributions

A marginal sample median summarizes the whole observed group. Quantile regression estimates conditional quantiles given predictors, such as the median recovery time by treatment adjusted for age. It can show how covariate effects differ between the lower and upper tails, unlike a mean model. Coefficients refer to a conditional quantile and are not necessarily effects on the same individuals' ranks. Standard errors may use asymptotic methods or bootstrap, with resampling respecting clusters.

If the conditional distribution crosses, treatment may improve the median while worsening the upper tail. Report several prespecified quantiles when clinically relevant and provide intervals; avoid searching many quantiles for a favorable result. For censored outcomes, specialized quantile regression methods are needed because ordinary quantile regression assumes observed outcomes.

## IQR and robust scaling

For a normal distribution, Q1≈μ−.6745σ and Q3≈μ+.6745σ, so IQR≈1.349σ. Thus IQR/1.349 is a normal-consistent estimate of SD. It is robust to outliers but less statistically efficient than SD if normality is exactly true. The choice is descriptive: IQR communicates middle-half width directly, while scaled IQR estimates a standard-deviation-like quantity under a model.

MAD is median(|X−median(X)|), with normal-consistent scaling 1.4826. It is particularly resistant to extreme points. Because IQR and MAD respond differently to multimodality and ties, pair them with a plot rather than treating them as interchangeable.

## Reporting percentiles responsibly

When quoting a percentile, specify the population, measurement protocol, time point, algorithm, and uncertainty if it supports a clinical threshold. Reference intervals require an explicitly defined healthy reference population; a sample's 2.5th and 97.5th quantiles are not automatically medical decision limits. For growth or dosing percentiles, charts may use smoothed age-specific curves and standardized reference data. Applying a percentile from the wrong age, sex, assay, or population can lead to incorrect classification.

## Tail quantiles and clinical thresholds

A P95 is useful for upper reference limits, but estimation depends on a small fraction of observations. Report its uncertainty and sample size; avoid presenting a single precise decimal from a modest reference sample. If measurement is rounded, quantiles can have ties and the empirical percentile may be an interval of values rather than a unique point. For threshold decisions, validate the clinical consequences of classification instead of assuming a reference percentile is a treatment cutoff.

If comparing groups, a difference in medians is not necessarily the median of individual paired differences. In paired data, calculate within-person change and summarize its quantiles. For independent groups, use group-specific distributions and an estimand-aligned contrast. Report whether quantile comparisons are marginal or conditional on covariates.

A useful reporting statement gives median, Q1, Q3, IQR, n, units, and quantile algorithm when relevant. The notation “median (IQR)” is sometimes interpreted as median followed by lower and upper quartiles, while elsewhere IQR means the width Q3−Q1; spell out both endpoints and, if useful, the width. For example, “5.2 mmol/L (Q1 4.4, Q3 5.8; IQR 1.4).” This avoids ambiguity in tables and meta-analysis extraction.

## Quantiles in repeated and weighted samples

With survey weights, the weighted empirical distribution accumulates normalized weights rather than assigning each observation equal mass. Weighted quantiles can differ from ordinary sample quantiles, and variance estimation must reflect the sampling design. With repeated measures, a visit-level quantile weights people with more visits more heavily; if the target is a participant-level distribution, summarize a participant-level value or use methods for longitudinal quantiles. Define the analysis unit before calculating percentiles.

A percentile is descriptive only of the distribution and time point from which it was estimated. In longitudinal follow-up, a baseline P75 and a month-12 P75 may reflect both change and different participants observed at each visit. Show denominators and missingness by visit; do not infer individual change from marginal quantile shifts alone.

When quantiles are used to define clinical alert thresholds, evaluate both false-alert burden and missed cases in the intended setting. A percentile is a population rank, not an optimal decision boundary. Consider consequences, prevalence, and available follow-up, and validate the threshold prospectively where possible. Show how uncertainty in tail estimates propagates to classification near the cutoff.

## References and further reading

- NIST/SEMATECH. [Quantiles](https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm).
- Hyndman RJ, Fan Y. [Sample quantiles in statistical packages](https://doi.org/10.1080/00031305.1996.10473566). *The American Statistician*. 1996.

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland M, Altman DG. *Statistics with Confidence*. BMJ Books.
- Greenland S, Rothman K, Lachin JM. *Modern Epidemiology*. Lippincott Williams & Wilkins.

The [histograms and box plots article](histograms-and-box-plots.html) shows
these quantities graphically.
