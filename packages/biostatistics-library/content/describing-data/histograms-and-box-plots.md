---
title: Histograms and box plots
summary: Two indispensable plots for seeing distribution shape, skew, outliers and group differences at a glance.
---

## Overview

Histograms and box plots reveal features that a single mean or median hides. A histogram displays the empirical distribution of a quantitative variable through bins; a box plot compresses its center and spread into quartiles, whiskers, and flagged points. They help identify skewness, multimodality, ceiling effects, unusual values, and group differences before modeling. Neither graph diagnoses assumptions on its own, and design context is needed to decide whether a pattern is concerning.

## Build and read a histogram

A histogram partitions the measurement scale into intervals and plots counts or density. Bin width and origin affect appearance. Very wide bins conceal structure; very narrow bins turn sampling noise into apparent peaks. Compare a small set of reasonable widths, and use the same scale when comparing groups. Counts are intuitive for one sample; density rescales for bin width and sample size so the total area equals one.

```r
hist(dat$crp, breaks = "FD", xlab = "CRP", main = "CRP distribution")
hist(dat$crp, breaks = "Scott", freq = FALSE,
     xlab = "CRP", main = "Density-scaled histogram")
```

Freedman–Diaconis and Scott rules provide data-based starting widths, not final truth. If CRP has a long right tail, a log scale may show the bulk more clearly, but state the scale and retain the original-unit interpretation. A histogram can suggest two modes, but apparent multimodality may be a binning artifact or a mixture of subpopulations. Check subgroup and time structure.

## Read a box plot precisely

A Tukey box plot marks Q1, median, and Q3. The box height is the IQR=Q3−Q1. Whiskers usually extend to the most extreme observed values within 1.5 IQR of the quartiles, and more distant observations are drawn individually. Those points are “flagged” under a convention, not automatically errors or statistical outliers. A box plot does not display the full distribution, sample size reliably, or density within the box.

```r
boxplot(crp ~ arm, data = dat, ylab = "CRP", xlab = "Treatment arm",
        outline = TRUE)
```

For small groups, overlay raw observations; for unequal sample sizes, include n. Violin plots or jittered dot plots reveal clustering and gaps that a box hides. If many values are tied at a detection limit, describe censoring/rounding rather than treating the box as a smooth distribution.

## Compare groups without hiding the data

Place distributions on a common axis and preserve group labels. Overlapping boxes do not imply no difference, and nonoverlapping boxes are not a hypothesis test. Compare estimated effects and intervals for inferential claims. In longitudinal data, plotting each visit separately can hide within-person trajectories; use paired lines or model-based trajectories. In cluster studies, display the independent-unit structure if feasible.

## Outliers and transformations

A point beyond whiskers can be a valid severe patient, data entry mistake, assay failure, or evidence of a heavy-tailed distribution. Check source records and measurement context; do not delete solely because it changes a p-value. Report sensitivity analyses when influence is substantial. A log transform may reduce right skew and stabilize variance, but it changes the scale: the mean on log scale relates to geometric means and multiplicative effects. Back-transformation requires care.

### Model diagnostics and reporting

For regression or ANOVA, inspect residual plots and Q-Q plots rather than only the raw outcome histogram. The relevant normality assumption typically concerns errors conditional on predictors, not the pooled outcome. Independence is a design property and cannot be diagnosed by a histogram. Plots can reveal heteroscedasticity, nonlinearity, and influential observations, but they cannot prove a model correct.

A report should identify the variable, units, transformation, group sample sizes, and what box-plot whiskers represent if nonstandard. Histograms are useful for exploratory work; publication figures should use readable axis limits and avoid truncated scales that exaggerate differences. Pair graphical summaries with numerical estimates suited to the data’s shape and the scientific question.

### Worked distribution comparison

Suppose a biomarker is measured in 120 patients and most values lie between 0 and 10, with a few values above 50. A histogram on the raw scale may compress the central mass, while a log scale spreads it but cannot include zeros without an explicit strategy. A box plot may flag high values beyond 1.5 IQR but cannot show whether they form a second cluster. Compare raw-scale and transformed views, and describe the assay’s lower detection limit.

```r
par(mfrow = c(1, 2))
hist(dat$marker, breaks = "FD", main = "Raw scale", xlab = "Marker")
boxplot(marker ~ arm, data = dat, ylab = "Marker", main = "By arm")
par(mfrow = c(1, 1))
```

If there are zeros, `log1p` changes interpretation and is not equivalent to a log transform of positive concentrations. For left-censored laboratory values, use an appropriate censored-data strategy rather than substituting zero or half the detection limit without sensitivity analysis.

### Bin width and apparent structure

A histogram’s bin origin can shift peaks even with the same width. Use consistent breaks for group comparisons, and do not choose a binning solely because it highlights a preferred pattern. Density overlays can aid comparisons but smoothing bandwidth also changes visual structure. A rug plot shows observed values, while empirical CDFs avoid binning and provide a direct view of cumulative proportions.

With small samples, a histogram is rough and can exaggerate gaps; dot plots or strip plots show each observation. With large samples, overplotting can conceal dense regions; hexbin plots or 2D densities help. The visualization method should make the sampling unit and point density legible.

### Boxplot conventions and alternatives

Standard box plots use quartiles and 1.5-IQR whiskers, but software differs in quartile algorithms and treatment of whisker endpoints. State nonstandard definitions. Notched boxes approximate uncertainty around medians under assumptions; notch overlap is not a formal test. Variable-width boxes may encode sample size but should be explained. For heavily tied or zero-inflated data, overlay raw values or frequencies.

Violin plots estimate a smoothed density and can imply continuity where outcomes are discrete. Raincloud plots combine density and raw points. For small cohorts, simpler plots may be more honest. Always include group n because equal-looking boxes from different sample sizes have different evidential precision.

### Outlier review and influence

Statistical flags are prompts to investigate. Check impossible units, decimal errors, duplicate records, assay batch effects, and patient context. A valid severe observation should remain in the primary descriptive plot. In modeling, influence diagnostics ask how much an estimate changes when observations are omitted; Cook’s distance is a model-based diagnostic, not a deletion rule. Report sensitivity analyses if conclusions depend on valid extreme values.

A distribution can be skewed for meaningful reasons, such as a mixture of mild and severe disease. Transforming or trimming can hide this population structure. Stratify only using prespecified clinical factors and report the full distribution as well.

### Assumptions and graph interpretation

Histograms do not test independence; repeated measures can look normal while being correlated. Box plots do not test equal variance robustly. For linear-model assumptions, examine residuals against fitted values and relevant predictors; a raw outcome histogram answers another question. A Q-Q plot compares empirical residual quantiles with a reference normal distribution but does not prove normality. Use plots as diagnostics integrated with design knowledge and sensitivity analysis.

In reports, identify transformations, units, n, and the meaning of whiskers/outliers. Avoid truncated y-axes for histograms and inconsistent axes across groups. Graphs should show enough context to support the summary, not merely decoration.

## Density, counts, and normalization

A count histogram’s bar height is the number of observations per bin; if bin widths differ, bar area rather than height should correspond to count. A density histogram divides by N and bin width so total area equals one. It estimates the empirical distribution and can be compared across sample sizes. A density curve is smoothed and may extend beyond the observed range depending on kernel choice; do not interpret every wiggle as a population feature.

When comparing arms with unequal n, count histograms can make the larger arm look more variable simply because it contributes more observations. Density scaling helps compare shape, while counts communicate sample size. Showing both, or adding n labels, clarifies the distinction.

### Axis transformations and units

A logarithmic x-axis is useful for multiplicative ranges, but distances then represent ratios rather than absolute differences. Tick labels must be explicit. If zero is possible, a log scale cannot display it; adding an arbitrary constant changes low-end structure. Consider a two-panel raw/log display or a model appropriate for zero-inflated data. Back-transforming summaries also requires stating whether geometric or arithmetic means are reported.

For laboratory values with lower/upper limits, marks at the limit can form piles that look like a mode. These observations are censored or rounded, not exact at the boundary. A box plot may place the median at a detection limit and hide how much latent variation lies below it. Explain assay reporting rules and consider censored distributions.

## Comparing shapes and centers

The same median can coexist with different spread; the same IQR can coexist with different tails. A box plot provides a compact comparison of quartiles but not a full test of distribution equality. Add raw point overlays for modest sample sizes, and use ECDFs to compare the proportion below clinically chosen values. If a threshold matters, show that threshold on the graph and report its event proportion with uncertainty.

Avoid reading “outlier” as “bad data.” Values beyond whiskers may represent the target population’s severe tail. If excluding or winsorizing values is justified by a prespecified measurement rule, show both primary and sensitivity summaries. Transparency is preferable to silently adjusting a graph to look normal.

### Exploratory versus confirmatory graphs

A plot used to explore dozens of variables can reveal patterns by chance. If the plot motivates a subgroup or threshold, treat it as exploratory and validate independently. A visually chosen cutoff followed by a test at that cutoff ignores selection. Preregister clinically meaningful thresholds when possible.

For a confirmatory report, choose a display aligned with the endpoint and analysis: residual-versus-fitted for variance structure, histogram/ECDF for outcome shape, paired line plot for repeated measures. State any transformations and smoothing choices. A well-designed graph communicates evidence but does not by itself establish statistical significance or causality.

## Reference distributions and Q–Q plots

A histogram is useful for a rough shape check, but binning can make subtle departures hard to judge. A Q–Q plot compares ordered sample quantiles with a theoretical distribution’s quantiles. A straight trend supports compatibility with that shape; tail curvature indicates heavier or lighter tails, and an S shape may indicate skewness. Q–Q plots should be interpreted with sample size and robust estimation in mind: large n makes small deviations visible, while small n can make plots noisy.

For normal-model inference, inspect residual Q–Q plots rather than demanding raw outcome normality. If group means differ, the pooled outcome can be multimodal even when residuals are normal. Formal tests such as Shapiro–Wilk should not dictate method selection by a p-value threshold. Consider whether the deviation materially affects inference and use sensitivity methods where relevant.

### Binning and unequal sample sizes

For side-by-side group histograms, use common breaks and a common horizontal and vertical scale. Separate automatic breaks can create visually different shapes solely because binning differs. If sample sizes differ, compare density rather than counts for shape, while annotating n. For very small groups, show every observation. For large data, consider ECDF or quantile summaries to avoid arbitrary bins.

Histogram area equals one under density scaling, not the height sum. If bins have unequal widths, density height accounts for width. Label y-axis clearly as count, proportion, or density. Avoid a smoothed curve without explaining bandwidth when the data are discrete or rounded.

### Clinical flags and reference limits

A boxplot outlier may be a severe event or a true laboratory extreme that matters. Clinical reference intervals are based on population quantiles, not Tukey fences. A point outside a reference interval is not automatically a measurement error or diagnosis. Use instrument-specific limits and clinical context. When several biomarkers are screened graphically, unusual shapes are exploratory observations and may need independent verification.

## Figure design

Use colorblind-accessible colors and do not rely on color alone to encode arms. Keep group order consistent with tables and analyses. Show zero or clinically relevant thresholds where meaningful, but do not truncate axes in a way that exaggerates differences. If a log axis is used, label ticks in original units and explain transformation. Include sample sizes, data points when feasible, and a clear title/caption describing the sampling population and time.

### Example: choosing a display for a skewed endpoint

For ICU length of stay, a histogram may show a dense mass at 1–3 days and a long tail to several weeks. A box plot shows the median and IQR but relegates the long-stay patients to outlier points. Both are useful: the histogram reveals shape; the box supports concise group comparison. Add a log-scale panel if the tail compresses the bulk, but keep the raw-scale plot because days are the clinical unit. Consider mean and median summaries together if both patient experience and resource use matter.

### Do not infer distribution from summary markers

Two groups can have the same median and IQR but different tails or modes. Box plots cannot show all such differences. For important treatment comparisons, overlay points or ECDFs and report the full relevant effect estimate. A box plot is a compact display, not a complete statistical analysis.

### Comparing model assumptions

A histogram of raw outcome values is not a direct check of regression residual normality. In a two-group comparison, a bimodal pooled histogram may simply reflect different group means. Check residuals after fitting the model and verify independence from study design. Variance equality can be explored with residual-versus-fitted plots, but if group variances differ, use a method such as Welch’s test rather than relying solely on a visual threshold.

Normality tests can flag tiny deviations at large sample sizes and miss important tail issues at small sizes. Combine Q-Q plots, influence checks, sample size, and robustness reasoning. Do not use a single graph to certify assumptions.

### Communicating uncertainty visually

A box plot displays sample quantiles but not uncertainty around them. If the goal is comparing medians, add confidence intervals from a suitable method or a bootstrap. Notches are approximate and can mislead in small or highly skewed samples. Label whether whiskers are 1.5 IQR or min/max, and include sample sizes.

### Histograms for discrete or bounded measurements

A histogram is designed for quantitative intervals. For a small-integer symptom score, bars centered on each possible value or a frequency bar chart may be clearer than arbitrary bins. For zero-inflated data, show the proportion of zeros separately and the positive-value distribution. For bounded percentages, include ceiling/floor mass explicitly. These features can drive the choice of model and effect summary.

### Compare distributions, not just boxes

Empirical CDFs show the proportion of observations below any threshold and avoid histogram binning. They are useful when clinical cutoffs matter. Quantile plots can compare distributions across groups. A Kolmogorov–Smirnov test is sensitive to broad differences but does not identify an effect size or account for clustering automatically. Visualization should guide a planned analysis rather than a search for significant distribution tests.

### Data provenance

A strange spike may result from instrument rounding, a change in laboratory assay, or a data merge—not a true biological subgroup. Color or facet by site, date, and batch; consult metadata. Graphs are most valuable when linked to how measurements were generated.

### Graphs are descriptive evidence

A histogram or box plot summarizes the observed sample; it does not establish a treatment effect, population distribution, or model validity by itself. Sampling and selection determine how well the picture generalizes. Pair plots with estimates, intervals, and study-design information when making scientific claims.

### From exploration to a publication figure

During exploration, vary bin widths and scales to understand the data. For final figures, select one principled display and report the choice; do not show only the binning that emphasizes a desired pattern. A histogram with density scaling should use equal breaks across groups. Box plots should state whisker convention and display n. If sample sizes are small, raw dots are often preferable to a smoothed violin.

For repeated measurements, a set of separate box plots at each visit ignores pairing. Add trajectories, spaghetti plots with transparency, or model-based marginal means with intervals. The display should respect the longitudinal unit and help readers distinguish within-person change from between-person variation.

When reporting a box plot, clarify how extreme points were reviewed and whether all valid observations are displayed.

### Final display interpretation

Use histograms to examine one-variable shape and box plots for compact group summaries, while recognizing what each hides. Binning, scaling, and whisker rules affect appearance; raw points and ECDFs can provide complementary views. Treat flagged outliers as observations to investigate, not automatic errors. Describe the sample, units, transformations, and graph conventions so readers can evaluate the visual evidence.

## References and further reading

- Tukey JW. [Exploratory Data Analysis](https://www.worldcat.org/oclc/3058187). Addison-Wesley; 1977.
- NIST/SEMATECH. [Histogram](https://www.itl.nist.gov/div898/handbook/eda/section3/histogra.htm) and [box plot](https://www.itl.nist.gov/div898/handbook/eda/section3/boxplot.htm) guidance.

- Bland M, Altman DG. *Statistics with Confidence*. BMJ Books.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and Other Advanced Topics*. Brooks/Cole.

The [quantiles and interquartile range article](quantiles-and-the-interquartile-range.html)
defines the five-number summary used by the box plot.
