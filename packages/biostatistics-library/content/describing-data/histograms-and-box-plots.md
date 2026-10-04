---
title: Histograms and box plots
summary: Two indispensable plots for seeing distribution shape, skew, outliers and group differences at a glance.
---

## Overview and key ideas

Numbers summarise; plots reveal. The **histogram** bins a continuous variable into adjacent intervals and draws a bar for each bin's count (or density). The binning is the key design choice: too few bins smear real structure, too many turn random fluctuation into apparent structure. A useful starting point is about sqrt(n) bins (or Sturges' rule, 1 + log2(n)); the final width should be chosen by inspecting the shape at two or three candidate widths, not by the rule alone. On the y-axis, counts answer "how many?"; density (counts divided by bin width and by n) lets histograms with different bin widths be compared on the same axis, which is the safer choice when re-binning.

The **box plot** (Tukey's box-and-whisker) compresses the same information into the five-number summary — minimum, Q1, median, Q3, maximum — with one twist: the whiskers extend to the most extreme observation *within* 1.5×IQR of the box, and points beyond are drawn individually as outliers. A box plot therefore answers three questions at once: where is the centre (median line), how wide is the middle 50% (box), and are there unusual extremes (beyond the whiskers)?

- Histograms are best for one variable at a time, showing full shape.
- Box plots excel at side-by-side comparison of the same variable across groups, e.g. each trial arm on a shared axis.
- The two are complementary: the histogram shows what the box hides (bimodality, fine shape); the box plot shows what a long histogram buries (group comparison, individual outliers).

Reading a histogram is a three-step routine: (1) centre — where is the mass; (2) spread — how wide is the bulk; (3) shape — symmetric, skewed, gapped or multimodal? Shape decides whether the mean or the median is the honest summary, which is why the histogram precedes the choice of descriptive statistic.

## When to use it

| Setting | Example question |
| --- | --- |
| Checking normality before a t-test or ANOVA | Is the outcome or residual distribution roughly symmetric? |
| Comparing a continuous outcome between arms | Do the distributions of time to recovery overlap or shift? |
| Data-entry and outlier review | Are there implausible values, e.g. haemoglobin 169 g/L, in the dataset? |
| Exploring a new variable before analysis | Are there gaps, clusters or two subpopulations in this biomarker? |
| Safety reporting | Distribution of a safety lab value before and after dosing |
| Methods sections | Showing readers the distribution a summary statistic cannot convey |

## Assumptions and limitations

- Histograms depend on the bin edges: shifting the origin or changing the width can create or erase apparent skew or modes, so never read fine structure from a single arbitrary binning.
- Box plots summarise five numbers (plus individual outliers). Identical boxes can hide very different shapes: a right-skewed and a bimodal dataset can draw the same box.
- Box plots compress small samples into five numbers and make them look more precise than they are; with n < 10 the median and quartiles are very unstable.
- The 1.5×IQR whisker rule flags values for attention, not invalidity: in skewed or small data, values beyond the whisker may be entirely normal, while in very large samples many will be flagged by chance alone.
- Overlapping boxes do not prove distributions are equal, and non-overlapping ones do not prove a significant difference; plots motivate the test, they do not replace it.
- Both plots describe one sample; they say nothing about how stable the shape is across samples, which is what the inference section's sampling variability covers.

### Reading plots with the measurement process in mind

For unequal-width bins, bar area—not height—should represent frequency; plot
density so comparisons remain meaningful. If groups have different sample
sizes, raw-count histograms can make the larger group look more variable; use
density or relative frequency and display each group's n. The 1.5×IQR fences
are descriptive flags, not confidence limits or tests. For small groups,
overlay individual observations because quartiles can conceal multimodality
and sparse clusters. Check unusual points against units, instrument limits and
source records before deciding whether they are errors.

## Worked example

Ten patients had postoperative haemoglobin (g/L) of 10.8, 11.2, 11.5, 12.0, 12.4, 12.8, 13.1, 13.6, 14.0, 16.9. Using left-closed 1 g/L bins, counts are: [10,11): 1, [11,12): 2, [12,13): 3, [13,14): 2, [14,15): 1, [15,16): 0, [16,17): 1 — a right tail with a gap between 15 and 16.

The box plot five-number summary: median = (12.4 + 12.8)/2 = 12.6; Q1 = 11.5; Q3 = 13.6; IQR = 2.1. The whisker fences are 11.5 − 3.15 = 8.35 and 13.6 + 3.15 = 16.75, so the 16.9 g/L value sits just beyond the upper fence and is drawn as an individual point. The report would read: "median 12.6 (IQR 11.5–13.6) g/L, with one value (16.9 g/L) beyond the upper Tukey fence" — a single patient worth a clinical look rather than an automatic deletion.

Both plots tell the same story: a mildly right-skewed distribution with one high value. The histogram shows the gap and the tail; the box plot pins down the median, the IQR and the flag. Reporting the median and IQR alongside the plot (rather than the mean and SD) is the consistent choice for data like these.

## Interpretation and common pitfalls

- Reading a histogram's shape from too few bins: with three or four bars everything looks "fine". Inspect at two or three different bin widths before concluding the shape.
- Treating every point beyond a whisker as an error or as significant. It is a flag, not a verdict.
- Comparing groups by eye when boxes barely overlap — or assuming no difference because they overlap a lot. Overlap is not equivalence; follow up with a formal test.
- Hiding the sample size. A box from n = 4 and one from n = 400 look identical; annotate n, and for small groups add jittered raw points (a strip plot) beside each box.
- Misreading the whisker ends as the minimum and maximum. They are the most extreme *in-fence* values; the true min/max may be further out and are only shown if plotted.
- Comparing histograms with different bin widths or different y-axis scales (counts vs density) as if they were the same picture.

## Histogram construction and interpretation

A histogram estimates the shape of a numerical distribution by partitioning its support into bins. For bin width h and origin a, bin k covers [a+kh, a+(k+1)h). The count depends on h and a, so two reasonable histograms can appear different. Density height is count divided by n×h; the area of a bar equals its relative frequency and all bar areas sum to one. If widths differ, heights alone no longer represent counts; use area or a density scale.

Common starting rules include Sturges' number of bins, approximately 1+log2(n), and the Freedman–Diaconis width h=2×IQR×n^(−1/3). Sturges can oversmooth large datasets; Freedman–Diaconis adapts to robust spread but can produce very wide bins for small samples. No formula discovers the true distribution. Inspect at several reasonable widths and origins, and compare with an empirical cumulative distribution or raw observations when n is small. A kernel density curve also depends on bandwidth and can hide boundary constraints.

### Worked example: histogram density and bin width

For 100 observations and bin width 2 units, suppose a bin contains 18 observations. Its relative frequency is .18 and density height is 18/(100×2)=.09 per unit; the bar area is 2×.09=.18. If the bin width is changed to 1 while covering the same values, the corresponding count may be around 9 and density remains about .09 if the underlying data are similarly distributed. Comparing raw counts across unequal widths is misleading because taller bars may only reflect narrower bins.

```r
x <- c(10.8, 11.2, 11.5, 12.0, 12.4, 12.8, 13.1, 13.6, 14.0, 16.9)
bw <- 2 * IQR(x) / length(x)^(1/3) # Freedman-Diaconis width
hist(x, breaks = "FD", probability = TRUE,
     xlab = "Haemoglobin", main = "Distribution with density scale")
boxplot(x, horizontal = TRUE, xlab = "Haemoglobin")
```

Base R's `breaks="FD"` chooses a binning based on the range and an algorithm; exact boundaries can vary. The example is tiny, so a rule-based histogram is only exploratory. With few observations, plot the individual points and avoid making strong claims about skew or modes.

## Box plots and their mathematical definitions

A Tukey box plot places the lower and upper hinges near Q1 and Q3, draws a median, and defines IQR=Q3−Q1. The lower and upper fences are Q1−1.5IQR and Q3+1.5IQR. Whiskers reach the most extreme observed values still inside those fences; points outside are shown separately. The fences are not whisker endpoints, not confidence limits, and not a formal outlier test. Some software uses hinges that differ slightly from interpolated sample quartiles for small n.

For the postoperative hemoglobin values in the initial example, Q1=11.5, Q3=13.6, IQR=2.1. Upper fence=13.6+1.5(2.1)=16.75; 16.9 exceeds it by .15. The point deserves source and clinical review, but the flag does not imply error. In a normal population, about 0.7% of observations lie beyond 1.5-IQR fences in either tail combined (because 1.5 IQR is roughly 2.02 SD from the median), so a sufficiently large dataset will contain legitimate flagged observations.

A box plot can compare groups efficiently on a shared axis, but hides sample size, multimodality, gaps, and density. Add jittered points or a violin/raincloud representation when data volume allows, and always label n. For small samples, show every point; the apparent precision of quartile boxes is otherwise deceptive. When groups have dramatically different sample sizes, display n and consider plots that show distribution density without implying equal support.

## Comparing groups without confusing shape and scale

Overlaid or side-by-side histograms should use a common bin origin and width, the same axis scale, and density rather than raw counts when group sizes differ. Faceting is often clearer than transparency overlays. A shift in medians does not guarantee stochastic dominance; distributions can cross. A box plot may show different medians but similar IQRs, or similar medians but different tails. Describe center and spread separately and use a model or estimand-aligned contrast to quantify differences.

For a treatment trial, the raw outcome distribution is useful exploration, but inference may target an adjusted mean, risk, or time-to-event quantity. Inspect model residuals for assumptions rather than demanding that the raw outcome look normal. A skewed raw outcome can yield approximately normal residuals after modeling predictors; conversely, a normal-looking histogram does not ensure homoscedasticity or independence.

## Outliers, transformations, and bounded data

An apparent extreme can arise from data-entry error, unit mismatch, true biological heterogeneity, or a different subpopulation. Check source records, instrument range, units, time point, and eligibility. Do not winsorize or delete solely because a point lies beyond a fence. If analysis is sensitive, report robust estimates or a sensitivity analysis with a justified rule, preserving the primary analysis where the record is valid.

Log transformations can make positive right-skewed values more symmetric, but change the scale. Plot both original and transformed values and explain whether model estimates concern a geometric mean or multiplicative ratio. For proportions bounded by 0 and 1, a histogram's apparent pile-up near boundaries may require beta or binomial modeling rather than Gaussian assumptions. For counts, use integer-aware axes and consider excess zeros or exposure time.

## Practical workflow in R

Use histogram plus box plot, then inspect empirical quantiles and group sizes. Record units and include a rug for modest n. When comparing groups, set shared scales and annotate missingness rather than plotting only complete observations without explanation.

```r
# dat contains value and arm; keep the same bins and density scale
bw <- 2 * IQR(dat$value, na.rm = TRUE) /
  sum(!is.na(dat$value))^(1/3)
ggplot2::ggplot(dat, ggplot2::aes(value, colour = arm, fill = arm)) +
  ggplot2::geom_histogram(ggplot2::aes(y = after_stat(density)),
                          binwidth = bw, position = "identity", alpha = .25) +
  ggplot2::labs(x = "Outcome (units)", y = "Density")
```

Overlaid densities can conceal observations where groups overlap; use facets if colors are difficult to distinguish. The bin width should be justified and checked against alternatives. A plot is an exploratory aid, not a test of group equality.


## Comparing density, counts, and empirical distributions

A count histogram answers how many observations fall in each interval and is appropriate when sample size is the focus. A relative-frequency histogram scales counts by n; a density histogram additionally divides by bin width so total area is one. If two groups have different n, density is usually better for comparing shape, while a separate annotation gives the group size. A probability density can exceed one when measurements are concentrated in a narrow interval; its area, not height, is probability.

An empirical cumulative distribution function (ECDF) plots the fraction at or below each value and is invariant to bin choice. It shows whether one group's distribution is generally shifted, whether distributions cross, and where quantiles lie. For comparing treatments, an ECDF can reveal tail differences hidden in box plots. It still describes the sample and does not quantify uncertainty without bands or an inferential method.

```r
plot(ecdf(dat$value[dat$arm == "control"]),
     xlab = "Outcome (units)", ylab = "Proportion at or below x",
     main = "Empirical distributions")
lines(ecdf(dat$value[dat$arm == "active"]), col = 2)
legend("bottomright", c("Control", "Active"), col = 1:2, lty = 1)
```

Use common axes and note the number of observed outcomes in each arm. Missing values are omitted by `ecdf`; if missingness differs, show the denominators.

## Skewness, transformations, and choice of summary

Right-skew produces a long upper tail, often seen in length of stay, cost, and biomarkers. Mean>median is a clue but not a formal diagnostic; a mixture can make this ordering misleading. Plot on original units first. A log scale may spread low values and compress high values, revealing multiplicative structure, but zero values require special handling and interpretation changes. Box plots on a log axis can help show several orders of magnitude, while quartile calculations remain on the original scale unless data themselves are transformed.

A box plot's symmetry is not a reliable normality test. Equal whiskers and centered median can occur in nonnormal data, and apparent asymmetry can be sampling noise. For model assumptions, inspect residual plots and Q–Q plots. The aim is to understand data quality and shape, not to choose a test mechanically based on visual normality.

## Jitter and overplotting

When values are rounded, many observations may occupy the same coordinate. A scatter of raw points can hide this multiplicity. Jitter adds small random displacement for display only; it must not alter analysis values. Use transparency and a fixed seed if jitter is generated algorithmically, or use a beeswarm/strip plot that avoids overlap. For large data, hexagonal bins or two-dimensional density plots summarize point concentration, but state that each mark represents multiple observations.

```r
set.seed(10)
plot(jitter(as.numeric(dat$arm), amount = .08), dat$value,
     xaxt = "n", xlab = "Arm", ylab = "Outcome")
axis(1, at = seq_along(levels(dat$arm)), labels = levels(dat$arm))
```

This illustrates visual jitter only. Prefer established plotting functions for production figures and keep plotted jitter separate from the model dataset.

## Plot selection and communication

Use a histogram for one-variable shape, side-by-side box/violin or ECDF for group distributions, and raw points for small samples. Avoid three-dimensional effects and truncated axes that exaggerate differences. Label bin width, units, n, and whether y is count, proportion, or density. Outlier points should not be removed from a graph merely to improve appearance; explain any axis break or transformation. The plot should agree with the summary reported in text and tables.

For publication, state whether bins are left-closed/right-open and how observations exactly on boundaries are assigned; this rarely changes broad interpretation but supports reproducibility. A zero-inflated biomarker may require displaying the point mass at zero separately from the positive-value distribution, or using a log scale only for positive measurements. One plot should not force all observations into a misleading continuous shape.

A box plot's flagged points depend on quartile algorithm, sample size, and distribution. A point's scientific relevance depends on measurement validity and clinical context. In a large cohort, many valid measurements will exceed Tukey fences; in a small cohort, a single point can move the quartiles and fences substantially. Report an outlier rule as a screening convention and show values when appropriate, rather than using the label “outlier” as a synonym for error.

## References and further reading

- Tukey JW. [Exploratory Data Analysis](https://www.worldcat.org/oclc/3058187). Addison-Wesley; 1977.
- NIST/SEMATECH. [Histogram](https://www.itl.nist.gov/div898/handbook/eda/section3/histogra.htm) and [box plot](https://www.itl.nist.gov/div898/handbook/eda/section3/boxplot.htm) guidance.

- Bland M, Altman DG. *Statistics with Confidence*. BMJ Books.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and Other Advanced Topics*. Brooks/Cole.

The [quantiles and interquartile range article](quantiles-and-the-interquartile-range.html)
defines the five-number summary used by the box plot.
