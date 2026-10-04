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

## References and further reading

- Bland JM, Altman DG. [The mean, the median and the skew](https://doi.org/10.1136/bmj.310.6977.713). *BMJ*. 1995.
- NIST/SEMATECH. [Measures of location](https://www.itl.nist.gov/div898/handbook/eda/section3/eda351.htm).

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland M, Altman DG. *Statistics with Confidence*. BMJ Books.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and Other Advanced Topics*. Brooks/Cole.

The sampling-distribution article in this library develops standard errors
and sampling variability.
