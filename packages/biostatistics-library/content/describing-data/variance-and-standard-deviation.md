---
title: Variance and standard deviation
summary: Measures of spread around the mean: how to calculate them, why the denominator is n-1, and how the SD differs from the standard error.
---

## Overview and key ideas

Central tendency alone is a poor description of clinical data: two wards can share the same mean systolic blood pressure with very different clinical meaning if one is tightly clustered and the other wildly variable. The **variance** is the average of the squared deviations from the mean, and the **standard deviation (SD)** is its square root, which returns the measure to the original units. For a sample, the standard unbiased formula is s² = Σ(xi − x̄)² / (n − 1), with s = sqrt(s²).

Dividing by n − 1 rather than n (Bessel's correction) removes the downward bias introduced by estimating the mean from the same data; with that correction the sample variance is an unbiased estimate of the population variance. Because deviations are squared before averaging, the SD is dominated by the most extreme observations and describes spread faithfully only when the distribution is roughly symmetric and unimodal.

Two uses appear constantly in clinical work. First, as a descriptor of within-group variability: "mean blood pressure 132 (SD 18) mmHg" tells the reader that a typical patient is near 132 but that individual readings spread roughly over 132 ± 2×18 = 96–168 mmHg if the data are near-normal. Second, as a quality-control quantity: laboratory control charts track the SD of a control material over time, and a rising SD signals assay degradation before the mean drifts.

- σ (population SD) vs s (sample SD): the different symbols carry the n vs n − 1 distinction.
- The SD is in the variable's own units and is interpretable; the variance is in squared units and is mainly useful mathematically.
- For two independent measurements, the variance of their difference is the sum of the variances: Var(x − y) = s1² + s2².

## When to use it

| Setting | Example question |
| --- | --- |
| Baseline table, near-normal continuous variable | How variable is haemoglobin within each randomised arm? |
| Describing treatment outcomes | How tightly do individual responses cluster around the mean change? |
| Laboratory quality control | Is the day-to-day variability of the glucose assay stable over time? |
| Approximate central range | What does mean ± 2 SD cover for a near-normal variable? |
| Power analysis | Which pilot SD should feed the sample size formula for a two-arm trial? |
| Combining independent measurements | What is the uncertainty in the difference of two lab results? |

The SD is the correct companion to the mean (mean, SD). When the data are skewed, replace the pair with median and interquartile range rather than reporting a misleading one.

## Assumptions and limitations

- The SD presumes a reasonably symmetric, unimodal distribution. For skewed variables (length of stay, procalcitonin) it overstates the typical patient-to-patient spread; the IQR is the more honest companion.
- It is scale-sensitive: multiplying every measurement by 10 multiplies the SD by 10, so SDs are comparable only within the same variable.
- The n − 1 formula estimates a population variance from a random sample. With tiny samples (n < 5) it is unstable and should not be over-interpreted.
- The SD says nothing about the precision of the mean itself. That is the standard error, SE = s / sqrt(n), which shrinks as the sample grows; conflating SD with SE is the classic descriptive-reporting error.
- Variance is additive for independent quantities (the property behind ANOVA and measurement-error models), but that additivity does not extend to means of ratios or to correlated within-patient repeats.
- The squared-deviation construction also means two datasets with the same SD can have very different shapes; the SD is one summary, not a description.

### Variance, pooled spread and precision

The unbiased sample variance uses n−1 because the sample mean is estimated
from the same observations; deviations around that fitted mean have only n−1
independent degrees of freedom. When combining independent groups, the pooled
variance is a degrees-of-freedom-weighted average of group variances:
Σ(nⱼ−1)sⱼ² / Σ(nⱼ−1), not the arithmetic average of SDs. For a mean difference
between independent groups, Var(x̄₁−x̄₂) = σ₁²/n₁ + σ₂²/n₂; with paired
measurements, calculate the SD of within-person differences instead. These
formulas expose why a study's design and unit of analysis matter to precision.

## Worked example

Eight postoperative patients had systolic blood pressures (mmHg) of 118, 124, 130, 122, 135, 128, 121, 132. The mean is 1010/8 = 126.25 mmHg. Squared deviations from the mean are 68.06, 5.06, 14.06, 18.06, 76.56, 3.06, 27.56 and 33.06, summing to 245.5. The sample variance is 245.5/7 ≈ 35.07 mmHg² and the SD is sqrt(35.07) ≈ 5.9 mmHg.

So the group summary is 126.3 (5.9) mmHg. If the readings were near-normal, about 95% would fall within 126.3 ± 2×5.9 ≈ 114–138 mmHg, consistent with the observed range of 118–135. Note the distinction the numbers make: the SD (5.9 mmHg) describes patient-to-patient spread, while the SE = 5.9/sqrt(8) ≈ 2.1 mmHg describes how precisely this sample mean estimates the true group mean — a smaller number that belongs in an inference, not in a baseline table.

## Interpretation and common pitfalls

- Printing the standard error in a descriptive table. SE belongs to inference about the mean; SD belongs to describing the data. Baseline tables need SD.
- Pooling SDs by averaging them. To combine groups, average the variances (weighted by n − 1) and take the square root, or pool the raw data.
- Using mean ± 2 SD as "normal limits" for a skewed variable. The 95% coverage holds only approximately under normality; clinical reference limits are set by percentiles (2.5th–97.5th), not by the SD.
- Ignoring that a large SD swamps a group difference: a mean difference of 6 mmHg with SD 18 needs a much larger sample to detect than the same difference with SD 5.
- Quoting the SD from a small pilot as if it were the population's: one pilot's SD drives the whole power calculation, and a single outlier in it inflates the required n.

## Population variance, sample variance, and degrees of freedom

For a finite population of N values with mean μ, variance is σ²=Σ(x_i−μ)²/N. For a random sample, the population mean is unknown and estimated by x̄. The residual deviations sum to zero, imposing one linear constraint; only n−1 deviations are free. Under independent sampling with common finite variance, Σ(x_i−x̄)²/(n−1) is unbiased for σ². Dividing by n gives the empirical second central moment and is biased downward as an estimator of population variance, although it can be appropriate when describing exactly the observed dataset as a finite set.

The sample SD s is the square root of the unbiased sample variance, but s itself is not an unbiased estimator of σ in general; the unbiasedness result applies to s². For a normal sample, a small correction factor can make s unbiased, though routine descriptive reporting uses the conventional sample SD. This distinction matters in derivations and simulation, while the practical goal remains to state clearly which spread is being described.

### Worked calculation and denominator effect

For the eight blood-pressure values, the sum of squared deviations from x̄=126.25 is 245.5. Dividing by n−1=7 gives s²=35.071 and s=5.922. Dividing by n=8 gives 30.688 and square root 5.540. The difference is material in this small sample; as n increases, denominators n and n−1 become closer. R's `var()` uses n−1.

```r
x <- c(118, 124, 130, 122, 135, 128, 121, 132)
mean(x)
var(x)       # sample variance, denominator n - 1
sd(x)        # sqrt(var(x))
sqrt(mean((x - mean(x))^2)) # descriptive population-style divisor n
```

This code describes the sample. If patients are clustered, the formula does not account for design-induced dependence. If values have been rounded or measured with error, the observed variance combines biological, measurement, and sampling variation.

## Variance identities and covariance

For random variables X and Y, Var(X+Y)=Var(X)+Var(Y)+2Cov(X,Y); Var(X−Y)=Var(X)+Var(Y)−2Cov(X,Y). Variances add only when covariance is zero, with independence a sufficient but not necessary condition. In paired clinical measurements, positive correlation often makes within-person differences less variable than independent-group formulas suggest. Ignoring covariance can substantially misstate precision.

If a variable is multiplied by constant a and shifted by b, Var(aX+b)=a²Var(X), SD(aX+b)=|a|SD(X). A unit conversion from mmol/L to mg/dL multiplies SD by the conversion factor; adding a constant offset leaves SD unchanged. For independent components, total variance is additive, which is why ANOVA decomposes variability into within- and between-group components.

### Worked example: paired measurements

Suppose pre- and post-treatment values each have SD 10 and within-person correlation .7. Then SD of change is sqrt(10²+10²−2(.7)(10)(10))=sqrt(60)=7.75. If one incorrectly assumes independence, SD difference is sqrt(100+100)=14.14. The paired design's gain comes from stable person-level variation cancelling in the contrast. This calculation uses the actual covariance; a paired analysis should directly compute each person's change.

```r
sd_pre <- 10; sd_post <- 10; r <- .70
sqrt(sd_pre^2 + sd_post^2 - 2*r*sd_pre*sd_post)
```

The correlation must correspond to the paired measurements in the relevant population and time window. A pilot estimate can be imprecise, so sample-size planning should examine a plausible range.

## Pooled variance and heterogeneity

For independent groups assumed to share a common population variance, pooled variance is s_p²=[(n1−1)s1²+(n2−1)s2²]/(n1+n2−2). This weights each group variance by its degrees of freedom. It is not the average of SDs and does not include between-group differences in means because each group's deviations are centered on its own mean. If the equal-variance assumption is implausible, Welch's method uses separate variances and adjusted degrees of freedom.

For a combined dataset's overall variance, within-group variance is not enough: group mean differences also contribute. The total sum of squares decomposes into within-group sums plus Σ n_j(x̄_j−x̄)^2. Pooling two wards with different average stays can produce a total SD larger than either within-ward SD. The correct summary depends on whether the target is within-group variability or variability across the mixed population.

## SD, SE, and intervals

SD describes the spread of individual observations. Standard error describes the sampling variability of an estimator; for an independent sample mean, SE=s/√n. The 95% interval for a normal population mean uses a t critical value times SE, not SD. Mean±1.96 SD approximates a central reference range under normality; mean±1.96 SE approximates a confidence interval for the mean only for large samples and known/estimated variance. These intervals answer different questions.

For a normally distributed variable, about 68% lie within μ±1σ and 95% within μ±1.96σ. Skewed variables can have much more than 5% outside these limits, and values outside are not automatically pathological. For an individual future observation, a prediction interval includes both residual spread and parameter uncertainty and is wider than a confidence interval for the mean.

## Coefficient of variation and robust alternatives

The coefficient of variation CV=s/x̄ is a unitless relative spread useful for positive ratio-scale variables with meaningful zero. It is unstable when the mean is near zero and can be meaningless for interval scales such as Celsius temperature. Comparing CVs across groups assumes comparable distributions and measurement processes. For skewed data, IQR or MAD may better describe typical spread; for positive multiplicative variation, SD on log scale can be more interpretable.

Variance is highly sensitive to extremes because deviations are squared. Check outliers and distribution shape; do not remove valid observations simply to lower SD. If the mean and SD do not describe the sample well, report median and IQR or robust measures, but retain the original estimand when average burden is clinically relevant.

## R workflow and reporting

Use `sd()` and `var()` for sample spread, and report n and units. For subgroup summaries, calculate pooled values from participant-level data or combine sufficient statistics correctly. State whether SD is across individuals, within person, between sites, or residual from a model. Avoid comparing an SD with an SE or presenting a standard deviation as a measure of estimate precision.


## Variance decomposition and ANOVA intuition

For groups j with n_j observations, overall sum of squared deviations decomposes into within-group and between-group parts: Σ_jΣ_i(x_ij−x̄_j)² + Σ_j n_j(x̄_j−x̄)². The first term measures spread within groups; the second reflects differences between group means. Overall variance can be large even when each ward is internally consistent if average pressures differ by ward. Conversely, pooled within-group SD is not the SD of all patients combined.

### Worked example: pooled versus total variability

Ward A has 5 readings all near 120 with SD 2; ward B has 5 readings near 140 with SD 2. The pooled within-group variance is 4. But combining both wards produces a total SD around 10.6 because the 20-unit separation of means contributes substantial between-group variation. An overall SD alone therefore conflates individual variation and site differences.

```r
a <- c(118, 119, 120, 121, 122)
b <- c(138, 139, 140, 141, 142)
x <- c(a, b)
c(within_A = sd(a), within_B = sd(b), total = sd(x))
```

The exact sample SD of combined values depends on sample means and sizes. If groups are the target comparison, report group-specific SDs and model the site or treatment structure rather than interpreting total spread as homogeneous variability.

## Variance intervals and sample-size planning

For normally distributed independent observations, (n−1)s²/σ² follows chi-square with n−1 degrees of freedom. This yields a confidence interval for population variance, and square roots give an interval for σ. Variance estimates are much less precise than means in small samples and are sensitive to normality. A pilot SD should therefore be treated as uncertain, not as a fixed design truth.

For a two-group difference in means with equal group sizes and common SD σ, approximate standard error is σ√(2/n) per group. Halving the SD roughly quarters the required sample size for a fixed effect and power. Planning should use a clinically meaningful difference and plausible SD range, not an optimistic point estimate from a tiny pilot. Cluster design effects and attrition further increase required enrollment.

## Standard deviation under transformations

If X is converted from kilograms to pounds by multiplying by 2.20462, its SD is also multiplied by 2.20462, whereas variance is multiplied by 2.20462². If converting Celsius to Fahrenheit, SD is multiplied by 9/5; the +32 offset does not affect spread. This illustrates why SD is unit-dependent and comparisons require a common scale. A coefficient of variation can compare relative spread for positive ratio measurements, but should not be used for temperatures or variables with means near zero.

For log-transformed positive data, SD on the log scale describes multiplicative dispersion. If log(X) has SD σ_log, a one-SD multiplicative factor is exp(σ_log); a rough central 95% multiplicative range around geometric mean is exp(μ_log±1.96σ_log). This is often clearer for concentration data spanning orders of magnitude, provided the lognormal model is reasonable.

## Descriptive SD versus residual SD

The sample SD summarizes raw observations around their sample mean. In regression, residual SD summarizes deviations from fitted conditional means after accounting for predictors. Residual SD can be smaller because predictors explain variation, but it is conditional on the model. In mixed models, variance components distinguish residual, patient, and site variability. Report which variance is used; a generic “SD” can otherwise be ambiguous.

Repeated measures create within-subject and between-subject variation. The total SD mixes both. Intraclass correlation is the between-subject variance fraction in a random-intercept model, useful for understanding clustering but dependent on population and measurement occasion. For change scores, calculate SD of changes; do not infer it from marginal SDs without correlation information.

## Reporting spread

For approximately symmetric distributions, report mean (SD) with units and n. For skewed distributions, median (IQR) is often more representative, while mean may remain relevant for total cost or resource use. Avoid describing mean±SD as the range of observed values. If showing mean±2SD as a reference approximation, verify distribution shape and distinguish it from a confidence interval. In model-based analyses, provide variance assumptions and any robust or cluster correction used.

## Practical example: mean precision versus individual variability

For the eight blood-pressure observations, SD≈5.9 mmHg and SE≈5.9/√8=2.1 mmHg. If a larger sample of 32 had the same SD, the SE would be about 1.0 mmHg; individual variability remains about 5.9, while the mean estimate becomes more precise. This illustrates why increasing sample size does not make patients more homogeneous. Use SD when describing patient variation and SE or a confidence interval when describing estimate precision.

For clinical reference ranges, use the distribution of individual values and a defined reference population. Do not report mean±2SE as a range for patients; it narrows with sample size and would eventually imply nearly everyone has the same value, which is not what it measures.

## References and further reading

- NIST/SEMATECH. [Measures of scale](https://www.itl.nist.gov/div898/handbook/eda/section3/eda356.htm).
- Bland JM, Altman DG. [Statistics notes: measurement error](https://doi.org/10.1136/bmj.313.7059.744). *BMJ*. 1996.

- Bland M, Altman DG. *Statistics with Confidence*. BMJ Books. (See also their "Statistics notes: measures of spread", BMJ 1996.)
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and Other Advanced Topics*. Brooks/Cole.

The [quantiles and interquartile range article](quantiles-and-the-interquartile-range.html)
covers a spread measure used when the SD is inappropriate.
