---
title: Variance and standard deviation
summary: Measures of spread around the mean: how to calculate them, why the denominator is n-1, and how the SD differs from the standard error.
---

## Overview

Variance and standard deviation quantify dispersion around a mean. Variance averages squared deviations and has squared units; standard deviation is its square root and shares the data’s units. They describe person-to-person variability, not uncertainty in an estimated mean. Their sensitivity to extreme values can be useful when extremes matter, but can make them poor summaries for highly skewed data.

## Population and sample formulas

For a population with mean μ and N values, variance is σ²=Σ(xᵢ−μ)²/N. In a sample, the usual unbiased estimator of population variance is s²=Σ(xᵢ−x̄)²/(n−1), with sample SD s=√s². The n−1 denominator corrects bias in the variance estimator under independent sampling; it does not make s itself unbiased for σ. Some descriptive contexts use divisor n to describe the observed finite dataset. Software conventions should be known.

```r
x <- c(120, 124, 126, 129, 131, 140)
var(x)   # sample variance, denominator n - 1
sd(x)    # sample standard deviation
sqrt(mean((x - mean(x))^2)) # finite-sample descriptive SD, denominator n
```

Use sample SD when estimating population spread from a sample. Keep units clear: if pressure is mmHg, variance is mmHg² and SD is mmHg.

## What SD says about a distribution

For a normal distribution, about 68%, 95%, and 99.7% of values lie within 1, 1.96, and 3 SD of the mean, respectively. These rules do not apply generally. With skewness or heavy tails, mean±2 SD may cover much less or more than 95%, and may cross impossible values such as negative length of stay. Use quantiles or a distribution model suited to the data.

SD is influenced by every observation because deviations are squared. A small number of extreme values can dominate it. This sensitivity is not always undesirable: variance-based methods and resource estimates may care about large deviations. If a robust spread is desired, use IQR or MAD and state the distinction.

## Variance decomposition and modeling

Variance can be decomposed into between- and within-group components in ANOVA. In clustered data, total variation includes cluster-level and individual-level variation. Intraclass correlation (ICC)=σ²between/(σ²between+σ²within) describes similarity within clusters under a model. It influences design effects and sample-size planning. For repeated measures, covariance matters: variance of a change equals variance at each time minus twice the covariance.

Heteroscedasticity means residual variance changes with predictors or groups. Classical ANOVA pools a common residual variance; Welch’s method or variance modeling can address unequal group variances. Residual plots help reveal patterns. A single overall SD may hide meaningful heterogeneity across age, site, or treatment groups.

## SD versus standard error

For n independent observations, the standard error of the mean is approximately s/√n. SD describes spread among individuals; SE describes sampling variability of the estimated mean. Larger samples reduce SE while leaving population SD about the same. Reporting mean±SE as if it describes patient variation is a common error. Use mean (SD) for descriptive tables and confidence intervals for precision of estimated means or contrasts.

### Interpretation and quality checks

Check units, impossible values, outliers, and whether the sample is representative. An underestimated SD in planning can lead to underpowered studies; a pilot SD is uncertain, especially with small n. Consider sensitivity scenarios. In skewed data, report median and IQR alongside or instead of mean and SD, but retain the mean if it is the target estimand. Variance is scale dependent: multiplying all values by c multiplies variance by c² and SD by |c|.

Report the sample size, calculation convention, and spread measure. For weighted, clustered, or repeated designs, ordinary sample variance may not describe population variability; use design-based or model-based summaries. Dispersion is a property of the population and measurement process, not a measure of treatment effect or statistical significance.

### Worked calculation and uncertainty distinction

For x=(120,124,126,129,131,140), the sample mean is 128.3. Squared deviations sum to about 246.7. Sample variance is 246.7/(6−1)=49.3 mmHg² and sample SD≈7.02 mmHg. The standard error of the mean is 7.02/√6≈2.87 mmHg. SD describes patient spread; SE describes precision of this small-sample mean. A t interval for the population mean uses 5 degrees of freedom and is far wider than a normal approximation.

```r
x <- c(120, 124, 126, 129, 131, 140)
c(mean = mean(x), variance = var(x), sd = sd(x),
  se_mean = sd(x) / sqrt(length(x)))
t.test(x)$conf.int
```

The example assumes independent representative observations. If measurements are clustered by ward or repeated within patients, ordinary variance formulas do not apply.

### Variance decomposition

For a one-way grouping, total sum of squares separates into between-group and within-group components. The between component reflects group mean separation; within-group component reflects residual variation. In a random-effects model, total variance can be decomposed into between-cluster and within-cluster terms. ICC=σ²cluster/(σ²cluster+σ²individual) estimates the fraction of variance attributable to cluster membership under the model.

If average cluster size is m and ICC is ρ, the design effect for a simple cluster sample is roughly 1+(m−1)ρ. With m=20 and ρ=.05, this is 1.95, so standard errors can be roughly √1.95≈1.40 times larger than independence-based calculations. This approximation assumes similar cluster sizes; unequal sizes can inflate variance further.

### Variance under transformations

If Y is multiplied by c, variance becomes c²Var(Y) and SD becomes |c|SD(Y). Adding a constant changes the mean but not variance. Under logarithms, variance is measured on the log scale and expresses multiplicative spread. Exponentiating log-scale means or SDs does not yield a symmetric original-scale spread. Report transformed summaries and back-transform with clear interpretation.

## Heteroscedasticity and robust methods

Equal variance is assumed by pooled t and classical ANOVA. Residual plots can show variance increasing with fitted values; use Welch’s tests, heteroscedasticity-robust standard errors, generalized least squares, or a distributional model as appropriate. Robust variance estimators do not fix nonlinearity, dependence, or biased sampling. For small samples, sandwich estimates may be unreliable; use small-sample corrections or design-based inference.

### Sample-size planning

For a mean, required n grows with σ² and shrinks with squared target difference. Underestimating SD leads to underpowered studies. A pilot estimate can vary greatly at small n; use external evidence and sensitivity ranges. If outcomes are skewed or censored, the normal-theory SD may not adequately characterize information. In cluster trials, include ICC and cluster sizes; in repeated designs, incorporate within-person covariance.

### Robust spread summaries

The IQR and MAD resist extremes and often better summarize skewed data. They are not substitutes for SD when the scientific target requires variance (e.g. normal-theory prediction or process control). State units and method. For a normal distribution, MAD×1.4826 estimates SD; outside normality it describes a different robust scale.

## Reporting

Report SD with the mean for descriptive variability and SE/CI for precision of an estimate. State n, units, and whether variance is sample-based, weighted, or model-derived. For clusters or repeated measures, identify the covariance method. Check implausible values and outliers, but retain valid observations. A dispersion statistic alone does not indicate whether an intervention works or whether a group differs.

## Variance of a sum and paired changes

For random variables X and Y, Var(X−Y)=Var(X)+Var(Y)−2Cov(X,Y). Thus repeated measurements’ correlation changes the SD of within-person change. If both times have SD 10 and correlation .7, change variance is 100+100−140=60, SD≈7.75. Treating times as independent would use SD≈14.14 and misstate precision. Conversely, negative correlation increases change variability. The covariance structure is a design feature, not a nuisance term.

For sums of independent observations, variances add; for correlated observations, covariance terms must be included. This is why summing patient-level variances in clustered data is incorrect without accounting for shared cluster effects.

### Variance and normal reference limits

Under a normal model, mean±1.96 SD approximates a central 95% interval. This relationship fails for skewed data and can produce impossible values. Laboratory reference intervals should generally be based on reference-population quantiles or a validated transformation/model. Do not convert SD mechanically into a “normal range” without assessing distribution and reference population.

### Process variation versus sampling variation

A process-control SD describes variation over time and may combine within-subgroup and between-subgroup components. A sample SD from one time period describes observed spread but does not show process stability. Control charts distinguish common-cause variation from special-cause signals under sequential assumptions. For clinical quality metrics, risk adjustment may be needed before comparing hospital-level variation.

## Uncertainty in estimated variance

Sample variance is itself uncertain, especially in small samples. Under independent normal sampling, (n−1)s²/σ² follows a chi-square distribution with n−1 degrees of freedom, enabling a confidence interval for σ² or σ. This interval is asymmetric and can be wide. Outside normality, that exact result fails; bootstrap or robust scale methods may be preferable.

```r
x <- c(120, 124, 126, 129, 131, 140)
n <- length(x); s2 <- var(x); df <- n - 1
ci_var <- c(df * s2 / qchisq(.975, df),
            df * s2 / qchisq(.025, df))
sqrt(ci_var) # interval for SD under normal sampling
```

The interval relies strongly on normality. Do not use it as a universal precision interval for skewed clinical outcomes.

### Measurement reliability and observed spread

Observed variance combines true between-person variation and measurement error under classical assumptions. Low reliability inflates SD and attenuates standardized associations. Repeated measurements can separate within-person measurement error from stable between-person variance, but require a suitable reliability model. A narrow observed SD can also result from restrictive eligibility criteria rather than high measurement reliability.

### Between-study heterogeneity

In meta-analysis, within-study variance determines precision of each effect, while between-study variance describes variation in true effects. A pooled SD of patient outcomes is not the random-effects variance of treatment effects. Report heterogeneity separately, and consider prediction intervals for effects in new settings. These quantities answer different questions despite both being called variance.

### Small samples and normal-theory inference

Under independent normal sampling, sample variance has a chi-square sampling distribution. This is why variance estimates from tiny studies are imprecise, and why t intervals account for extra uncertainty with degrees of freedom. Heavy tails or skewness can make variance especially unstable because squared deviations emphasize extremes. Report sample size and consider robust spread summaries as complements.

### Variability between and within people

Repeated measures contain stable between-person differences and within-person fluctuation. A high total SD can coexist with reliable within-person change if most variation is between people. In measurement studies, intraclass correlation compares between-person variance with total variance; it depends on the population’s heterogeneity and measurement design. Test–retest reliability is not purely an instrument property.

### Variance assumptions in group comparisons

Equal variance assumptions concern residuals within groups, not equality of observed SDs as an isolated rule. With balanced samples, classical ANOVA may tolerate moderate variance differences; with imbalance, the combination can affect Type I error. Welch procedures or heteroscedasticity-robust methods avoid pooling a common variance. Use residual plots and design knowledge; do not select the model by a preliminary variance test.

### Summary

Variance and SD are useful when their sensitivity to extremes matches the question. Interpret them with distribution shape, units, sample design, and distinction from standard error. Robust alternatives such as IQR/MAD complement but do not replace SD when variance is the actual target.

### Biological and technical variation

Observed variance can combine biological differences, within-person fluctuation, instrument error, and sample handling. Replicate measurements or a variance-components model can separate some sources. For a laboratory assay, technical variation may be estimated from repeated controls; biological variation may be estimated from repeated patient samples. A single SD across patients mixes both and should not be interpreted as assay precision.

### SD and coefficient of variation

Coefficient of variation CV=SD/mean is a unitless relative variability measure, useful for positive ratio-scale quantities when the mean is meaningfully above zero. It is unstable near zero and inappropriate for measurements with arbitrary zero or negative values. Lognormal data may be better summarized with geometric CV. Always provide mean and SD alongside CV so the denominator is visible.

### Comparability across groups

A larger SD can reflect broader case mix, poorer measurement reliability, or a treatment that creates heterogeneous responses. It is not necessarily a failure. Compare variances only with a prespecified question and appropriate model; variance tests are sensitive to nonnormality. Report distributions and subgroup context.

### A concise interpretation guide

Use SD to describe individual spread when a mean is informative and the distribution is reasonably characterized. Use IQR or MAD for resistant spread under skew; use SE/CI for estimator precision. In clustered or weighted data, calculate design-aware variability. State whether variance reflects people, repeated measures, technical replicates, or between-study effects.

### Worked sample versus population variance

For values 120, 124, 126, 129, 131, 140, mean≈128.33. Squared deviations total≈246.67. Dividing by n−1=5 gives sample variance≈49.33 and SD≈7.02. Dividing by n=6 gives finite-dataset variance≈41.11 and SD≈6.41. The former estimates population variance under independent sampling; the latter describes these six observations as a finite set. Know which quantity software returns before reporting.

The standard error of the sample mean is about 2.87, much smaller than SD because it concerns an average. A confidence interval uses uncertainty in the estimator; it is not a range containing most individuals.

### Descriptive versus inferential use

For a baseline table, sample SD describes observed participant spread. For a population estimate, account for sampling weights and design. For process control, estimate within-subgroup and between-time variation. These contexts use related formulas but target different sources of variability. Label the context explicitly.

### Comparing SDs across populations

An SD is population-dependent. A more heterogeneous cohort has larger SD even if the measurement process is identical. Standardizing a treatment effect by SD can therefore change across studies due to case mix. When comparing spread, consider age/severity composition, eligibility, instrument, and range restriction. A lower SD is not automatically better measurement or more homogeneous disease.

### Final interpretation

Always specify the variable and units, sample size, and whether SD is descriptive or model-based. Separate SD from SE and confidence intervals. Use robust scale measures under skew when they fit the goal, but retain variance when the scientific model or decision truly depends on it.

### Standard deviation for reference and prediction

For normally distributed measurements, mean±1.96 SD approximates a central 95% population interval, whereas a confidence interval for the mean uses SD/√n and is much narrower. A prediction interval for a future observation includes residual variability and uncertainty in the estimated mean. These intervals answer different questions. Do not label mean±SD a “95% confidence interval.”

### Reporting in meta-analysis

Within-study SD describes patient outcome spread and helps derive standard errors for mean effects. Between-study variance describes heterogeneity of true study effects. They are distinct levels of variability. When pooling studies, report heterogeneity estimates and, where appropriate, a prediction interval rather than conflating it with patient-level SD.

### Final interpretation

SD expresses spread in the measured units; variance expresses squared spread. Their meaning depends on distribution, sampling design, and whether variation is biological, technical, within-person, or between-group. Distinguish both from standard error. Report the chosen measure and use robust or design-aware summaries where the data-generating process requires them.

### SD as a planning input

For a two-group mean comparison, required sample size is proportional to σ². A 20% underestimate of SD can materially reduce power; use external data, conservative ranges, or blinded variance re-estimation where appropriate. Report the source of the assumed variability and run sensitivity scenarios. Do not rely on a tiny pilot SD as an exact population constant.

### Scale and units

Variance has the square of the original unit and is often less intuitive to report. SD returns to the original scale, while coefficient of variation expresses relative spread only for meaningful positive ratio-scale variables. Choose and label the measure that readers can interpret.

### SD and clinical reference ranges

A mean±2 SD interval is meaningful as an approximate 95% range only under a suitable normal model. For skewed or bounded clinical measurements, empirical quantiles or a validated transformation are more appropriate. A reference interval describes a reference population, while a prediction interval may be conditional on covariates. State the target and method explicitly.

### Variance and extreme values

Because variance squares deviations, a few extreme but valid observations can dominate it. Verify data quality and consider robust summaries, but do not delete values simply to reduce SD. If an instrument saturates at extremes, the observed SD may understate true variability. Measurement process and scale bounds matter.

Always identify the unit over which spread is calculated: participants, clusters, repeated measurements, or studies. A numerical SD without this sampling level is ambiguous.

A standard deviation is not a fixed quality score: it changes with population heterogeneity, eligibility criteria, and measurement precision. Interpret comparisons of SDs only after considering those factors.

When comparing groups, report group-specific SDs and explain whether unequal variances affect the inferential method.

Use standard error or confidence intervals—not SD—to show precision of a group mean or contrast, and label the quantities separately.

## References and further reading

- NIST/SEMATECH. [Measures of scale](https://www.itl.nist.gov/div898/handbook/eda/section3/eda356.htm).
- Bland JM, Altman DG. [Statistics notes: measurement error](https://doi.org/10.1136/bmj.313.7059.744). *BMJ*. 1996.

- Bland M, Altman DG. *Statistics with Confidence*. BMJ Books. (See also their "Statistics notes: measures of spread", BMJ 1996.)
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and Other Advanced Topics*. Brooks/Cole.

The [quantiles and interquartile range article](quantiles-and-the-interquartile-range.html)
covers a spread measure used when the SD is inappropriate.
