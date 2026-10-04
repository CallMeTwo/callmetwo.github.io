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

## References and further reading

- NIST/SEMATECH. [Quantiles](https://www.itl.nist.gov/div898/handbook/eda/section3/eda352.htm).
- Hyndman RJ, Fan Y. [Sample quantiles in statistical packages](https://doi.org/10.1080/00031305.1996.10473566). *The American Statistician*. 1996.

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland M, Altman DG. *Statistics with Confidence*. BMJ Books.
- Greenland S, Rothman K, Lachin JM. *Modern Epidemiology*. Lippincott Williams & Wilkins.

The [histograms and box plots article](histograms-and-box-plots.html) shows
these quantities graphically.
