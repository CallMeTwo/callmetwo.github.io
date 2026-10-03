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

## Worked example

Eight postoperative patients had systolic blood pressures (mmHg) of 118, 124, 130, 122, 135, 128, 121, 132. The mean is 1010/8 = 126.25 mmHg. Squared deviations from the mean are 68.06, 5.06, 14.06, 18.06, 76.56, 3.06, 27.56 and 33.06, summing to 245.5. The sample variance is 245.5/7 ≈ 35.07 mmHg² and the SD is sqrt(35.07) ≈ 5.9 mmHg.

So the group summary is 126.3 (5.9) mmHg. If the readings were near-normal, about 95% would fall within 126.3 ± 2×5.9 ≈ 114–138 mmHg, consistent with the observed range of 118–135. Note the distinction the numbers make: the SD (5.9 mmHg) describes patient-to-patient spread, while the SE = 5.9/sqrt(8) ≈ 2.1 mmHg describes how precisely this sample mean estimates the true group mean — a smaller number that belongs in an inference, not in a baseline table.

## Interpretation and common pitfalls

- Printing the standard error in a descriptive table. SE belongs to inference about the mean; SD belongs to describing the data. Baseline tables need SD.
- Pooling SDs by averaging them. To combine groups, average the variances (weighted by n − 1) and take the square root, or pool the raw data.
- Using mean ± 2 SD as "normal limits" for a skewed variable. The 95% coverage holds only approximately under normality; clinical reference limits are set by percentiles (2.5th–97.5th), not by the SD.
- Ignoring that a large SD swamps a group difference: a mean difference of 6 mmHg with SD 18 needs a much larger sample to detect than the same difference with SD 5.
- Quoting the SD from a small pilot as if it were the population's: one pilot's SD drives the whole power calculation, and a single outlier in it inflates the required n.

## References and further reading

- Bland M, Altman DG. *Statistics with Confidence*. BMJ Books. (See also their "Statistics notes: measures of spread", BMJ 1996.)
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and Other Advanced Topics*. Brooks/Cole.

*The "Quantiles and the interquartile range" article in this library covers the spread measure used when the SD is inappropriate (article planned).*
