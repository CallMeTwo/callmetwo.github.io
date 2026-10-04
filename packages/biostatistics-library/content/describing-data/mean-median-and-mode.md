---
title: Mean, median and mode
summary: Three complementary measures of central tendency and when each one is the right summary for a clinical variable.
---

## Overview and key ideas

Every dataset needs a single number that represents its centre, and biostatistics offers three. The **mean** is the sum of all values divided by the number of observations: mean = (x1 + x2 + ... + xn) / n. Because it uses every value, it is the most efficient summary for symmetric data and the basis of most parametric tests. The **median** is the middle value once the data are ordered; with an even number of observations it is the average of the two central values. It depends only on position, so extreme values cannot move it. The **mode** is the most frequently occurring value — the natural summary for discrete counts (number of comorbidities, number of readmissions) and the only sensible "centre" for nominal categories (most common blood group).

The three measures sit close together when a distribution is roughly symmetric. Under skew they separate predictably: in a right-skewed distribution the tail of large values pulls the mean up, so typically mode < median < mean; a left skew reverses the order. That ordering is one of the quickest shape checks available, and it is why baseline tables pair the mean with the standard deviation or the median with the interquartile range, depending on the histogram.

- Mean: uses all data; sensitive to outliers; the right default for symmetric continuous variables.
- Median: resistant; describes the typical patient even when a few extreme values exist.
- Mode: useful for discrete or categorical data; unstable for continuous measurements.

## When to use it

| Setting | Example question |
| --- | --- |
| Symmetric continuous variable (haemoglobin, systolic pressure in a healthy cohort) | What is the average haemoglobin concentration in this population? |
| Skewed continuous variable (ICU length of stay, CRP) | What is the typical admission duration when a few long stays exist? |
| Discrete count variable (number of comorbidities, readmissions) | How many comorbidities do patients most commonly have? |
| Categorical variable (blood group, tumour grade, stroke side) | Which grade is most frequent in this biopsy series? |
| Baseline reporting | Are the randomised arms comparable in age, BMI and disease severity? |

The choice of centre follows the scale and the shape:

- Interval scale, roughly symmetric → mean (with SD).
- Interval scale, skewed or with outliers → median (with IQR).
- Categorical → mode, backed by a full frequency table.

## Assumptions and limitations

- The mean requires an interval or ratio scale. Averaging nominal categories is meaningless, and averaging ordinal scales (1–5 severity scores) is common practice but an assumption about the numbers, not a property of them.
- With strong skew, heavy tails or influential outliers, the mean no longer represents the typical patient and can sit far from where most values cluster.
- The median discards magnitude information: two very different datasets can share a median, so it can hide large variability or a bimodal mixture on its own.
- The mode is unstable for continuous data — it depends on rounding and binning — and a multimodal distribution has no single useful mode; a "mode" there is better read as a signal of mixed subgroups.
- Group differences in the mean or median can be driven by a few patients; always report the spread (SD or IQR) alongside the centre.
- With small samples all three are noisy estimates of population parameters; the mean's sampling variability is the standard-error topic of the inference section.

### Robust alternatives and the target summary

The arithmetic mean is the target for questions such as average resource use
per patient, even when the distribution is skewed; a median alone then answers
a different question. Conversely, the median describes the 50th percentile
and is often more representative of a typical stay. For positive, strongly
right-skewed outcomes, a geometric mean can summarize multiplicative
variation, but it requires a stated log scale and is not the arithmetic
average. A trimmed mean reduces sensitivity to extremes, but the trimming
fraction changes the estimand and should be prespecified. Pair a centre with a
spread and inspect the distribution when shape matters.

## Worked example

Fifteen patients with acute coronary syndrome had ICU stays (days) of: 1, 1, 2, 2, 2, 3, 3, 4, 5, 5, 6, 8, 9, 12, 30. The sum is 93, so the mean is 93/15 = 6.2 days; the median is the 8th ordered value, 4 days; the mode is 2 days.

One 30-day stay inflates the mean to 6.2 days, well above the central bulk of stays, whereas the median of 4 days sits where most patients actually are. Deleting the outlier drops the mean to (93 − 30)/14 = 4.5 days, showing how strongly the mean reacts to a single observation. The appropriate report is "median 4 days (IQR 2–8 days)", with the mean added only if a mean-based quantity such as total bed-days is needed.

## Interpretation and common pitfalls

- Reporting mean and SD for a skewed variable makes most patients look atypical; switch to median and IQR.
- Averages of ratios are not ratios of averages: the mean of each patient's diastolic/systolic ratio is not mean diastolic divided by mean systolic.
- Do not pool subgroup means by simple averaging; weight by subgroup size (averaging ward means of different sizes misstates the overall mean).
- The mode of a continuous variable measured at limited precision is an artifact of rounding, not a real centre of the distribution.

## What each measure estimates

The arithmetic mean is the total sum divided by n and estimates the population expectation when sampling and measurement assumptions support it. It is the right target for average resource consumption or average biomarker concentration even when skewed, though it may not resemble a typical individual's value. The median estimates the 50th population quantile and minimizes the sum of absolute deviations; it answers where half of observations lie above and half below. The mode identifies the most frequent value or density peak, but can be unstable and nonunique.

For a symmetric unimodal distribution, mean, median, and mode often align. This is not a universal identity and cannot be inferred from three sample numbers alone. In mixtures, the mean may fall between clusters where few observations occur; the median may sit in one cluster or a gap; the mode may be multimodal. Plot the data and state the estimand before choosing a center.

### Worked example: outlier sensitivity and weighted averages

For ICU stays summing 93 days across 15 patients, mean=6.2 days and median=4. Replacing the 30-day observation with a plausible 10-day observation changes the sum to 73 and mean to 4.87, while the median remains 4. This shows the mean's sensitivity, not a reason to discard a valid long stay. If estimating bed-days per patient, the high value must remain because it contributes real resource use.

Suppose ward A has 10 patients with mean stay 4 days and ward B has 90 patients with mean 8 days. The overall mean is (10×4+90×8)/100=7.6 days, not (4+8)/2=6. The overall median cannot be recovered from group medians and sizes alone; patient-level order information is needed.

```r
ward_n <- c(10, 90)
ward_mean <- c(4, 8)
weighted.mean(ward_mean, ward_n) # overall arithmetic mean, 7.6
```

This aggregation is exact for means when group means and sizes are defined on the same population and measurement scale. It does not recover variance without within-group variances and between-group differences.

## Geometric means, trimmed means, and domains

For positive measurements with multiplicative variation, the geometric mean is exp(mean(log(x))). It is useful for concentrations spanning orders of magnitude or fold changes, and is equivalent to the median only under particular log-scale distributions, not in general. Report the log scale and handle zeros explicitly; adding an arbitrary constant changes the result. The geometric mean describes a multiplicative center and is not the expected arithmetic amount.

A trimmed mean removes a prespecified proportion from each tail and averages the remainder. A 20% trimmed mean can resist extreme tails while using more information than a median, but it estimates a trimmed-location parameter rather than the population arithmetic mean. Winsorized means replace extremes rather than deleting them and can support robust variance estimation. Selection of trimming after observing which result is favorable invalidates a confirmatory interpretation.

The mode is meaningful for discrete outcomes, such as the most common number of admissions, and nominal categories, such as blood group. For continuous observations, the exact mode may not occur twice; an estimated mode depends on smoothing or binning. A multimodal density suggests subpopulations, measurement heaping, or distinct mechanisms and should prompt investigation rather than a single reported mode.

## Mean and median under transformation

If Y=log(X), mean(Y) exponentiated is the geometric mean of X. It is not the arithmetic mean of X. By Jensen's inequality, exp(E[log X])≤E[X] for positive X, with equality only when X is constant. For lognormal data with log-scale mean μ and variance σ², geometric mean=exp(μ), arithmetic mean=exp(μ+σ²/2), and median=exp(μ). The distinction matters when estimating average cost or dose exposure, where arithmetic means may be relevant despite skew.

For regression on log outcome, exponentiating a predicted log mean gives a geometric-scale estimate or median under lognormal assumptions. To recover an arithmetic conditional mean, account for residual variance; simply exponentiating can underestimate it. State which summary is being reported and why it matches the scientific question.

## Sampling uncertainty and robust summaries

A sample mean's standard error is s/√n under independent observations. The sample median has a sampling distribution governed by density near the population median; for a continuous distribution with density f(m)>0, its asymptotic variance is approximately 1/[4n f(m)^2]. Thus a median can be more or less precise than a mean depending on shape. Bootstrap intervals can help but need enough observations near the center and resampling at the independent unit. In small samples or highly discrete outcomes, empirical median intervals can be coarse.

Do not present a center without spread and denominator. Mean with SD describes location and individual variability for roughly symmetric data; median with IQR describes center and middle-half spread for skewed data. If arithmetic mean is decision-relevant despite skew, report it with a robust interval and distribution plot rather than substituting median alone. The choice should answer the stated question, not simply follow a normality test.

## R examples and reproducibility

R's `mean()` and `median()` ignore no missing values unless `na.rm=TRUE`; do not let this hide denominator changes. `table()` or `which.max(table(x))` can identify a discrete mode, but ties can yield multiple modes. `quantile()` provides robust context, and grouped summaries should report the number of nonmissing values.

```r
x <- c(1, 1, 2, 2, 2, 3, 3, 4, 5, 5, 6, 8, 9, 12, 30)
c(n = length(x), mean = mean(x), median = median(x),
  sd = sd(x), q1 = quantile(x, .25), q3 = quantile(x, .75))
mode_values <- names(which(table(x) == max(table(x))))
mode_values
```

The `mode_values` code returns every tied most frequent value as text because table names are labels; convert only when the original variable is numeric. This is a sample summary, not an interval estimate or population truth. For repeated measures, summarize participant-level outcomes or use a model that accounts for within-person dependence.


## Averages under sampling and weighting

The overall arithmetic mean across groups is the size-weighted average of group means. If groups represent a target population but the sample oversampled one group, use target-population weights rather than sample-size weights for a standardized mean. State the target distribution and account for weighting in the standard error. Unequal inclusion probabilities make an unweighted mean a sample description, not necessarily a population estimate.

The mean of changes equals the difference between means when calculated on the same paired observations: mean(Y_after−Y_before)=mean(Y_after)−mean(Y_before). This identity fails if separate missingness patterns change denominators. For repeated measurements, report paired changes or model trajectories; independent group means can obscure within-person change.

## Quantile conventions and ties

For an even sample size, the sample median is often the average of two central observations, but the population median may not be unique when the distribution has a flat interval or point mass. For categorical ordinal outcomes, several values can satisfy the median definition; report category proportions as well. The mode is often tied: a multimodal distribution has several most frequent categories. `which.max(table(x))` returns only the first maximum and can silently hide ties, so identify all tied levels.

```r
x <- c("mild", "moderate", "moderate", "severe", "severe")
tab <- table(x)
names(tab)[tab == max(tab)] # both tied modes
```

For a continuous measure rounded to tenths, a mode may be driven by rounding or heaping. Describe that heaping as a measurement feature rather than a true underlying density peak.

## Robustness does not mean representativeness

A median resists extreme values within the sample but remains vulnerable to selection bias, missingness, and systematic measurement error. If the sickest patients are more likely to be lost, the observed median can be low and precise while misrepresenting the full cohort. Robust summaries protect against some data contamination, not against every source of bias. Similarly, a trimmed mean limits tail influence but cannot correct unmeasured confounding or an unrepresentative sample.

For patient costs, average cost may drive a budget decision while the median describes a typical individual. Report both when appropriate, alongside the distribution. For clinical response, a median shift may hide a subgroup with no benefit and another with large benefit. Consider quantile summaries or distributional effects when heterogeneity matters.

## Confidence intervals for means and medians

For a mean under independent sampling, a t interval is x̄±t_(.975,n−1)s/√n. For a median, the interval can be obtained from order statistics or bootstrap. These are not intervals for individual values. With skewed outcomes and a large sample, a bootstrap or robust sandwich method may be useful for the mean, but the estimand remains the arithmetic mean. For small n with severe skew, report raw values or a distribution plot because all center estimates are unstable.

An interval estimate also depends on study design. Clustered observations reduce effective information; a participant-level bootstrap must resample clusters if clinics are the independent units. A sample mean can have a narrow model-based interval under false independence. State the unit resampled or the variance estimator.

## Mode in categorical reporting

For nominal variables, a full frequency table is usually more informative than naming the mode alone. If blood groups are O 40%, A 35%, B 18%, and AB 7%, “O is most common” omits clinically and operationally relevant composition. For ordinal grades, report category proportions and perhaps the median category; the mode can change with small fluctuations and ignores ordering. In multimodal continuous data, report the clusters and investigate whether they correspond to meaningful subpopulations rather than presenting a single center.

When comparing means across groups, show the group sample size and within-group spread. A mean can be calculated with different missingness patterns across variables, so denominators may differ within a table. Weighted averages should use appropriate population weights, while the median generally cannot be reconstructed from subgroup medians. These details prevent a seemingly simple “average” from being detached from its target.

## Choosing the center from the question

“Typical patient” often points to a median, while “average burden per patient” usually means an arithmetic mean. A hospital planning staffing may need the mean daily admissions because total volume is additive; a patient asking how long a usual admission lasts may benefit from median and upper quantiles. In skewed data, reporting both can show the tail's practical importance rather than treating one as universally correct. Name the target explicitly and keep units and period attached.

For intervention studies, comparing medians may not estimate the average causal effect and can be difficult to adjust for covariates. If the estimand is a difference in expected outcomes, model or estimate means even with skewness, using robust uncertainty or appropriate distributions. Descriptive choice and causal estimand should be coordinated but are not identical decisions.

The mean is also the balance point: the signed deviations from the mean sum to zero, and it minimizes the sum of squared deviations. The median minimizes the sum of absolute deviations. This explains why squared-error methods target means while absolute-error methods target medians. The objective function therefore encodes which center is being estimated; robust regression and quantile regression are not merely alternate calculations of the same parameter.

## References and further reading

- Bland JM, Altman DG. [The mean, the median and the skew](https://doi.org/10.1136/bmj.310.6977.713). *BMJ*. 1995.
- NIST/SEMATECH. [Measures of location](https://www.itl.nist.gov/div898/handbook/eda/section3/eda351.htm).

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland M, Altman DG. *Statistics with Confidence*. BMJ Books.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and Other Advanced Topics*. Brooks/Cole.

The sampling-distribution article in this library develops standard errors
and sampling variability.
