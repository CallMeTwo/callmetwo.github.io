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

## Worked example

Ten patients had postoperative haemoglobin (g/L) of 10.8, 11.2, 11.5, 12.0, 12.4, 12.8, 13.1, 13.6, 14.0, 16.9. A histogram with 1 g/L bins gives: 11–12: 3, 12–13: 4, 13–14: 2, 16–17: 1 — a right tail with a conspicuous gap between 14 and 17.

The box plot five-number summary: median = (12.4 + 12.8)/2 = 12.6; Q1 = 11.5; Q3 = 13.6; IQR = 2.1. The whisker fences are 11.5 − 3.15 = 8.35 and 13.6 + 3.15 = 16.75, so the 16.9 g/L value sits just beyond the upper fence and is drawn as an individual point. The report would read: "median 12.6 (IQR 11.5–13.6) g/L, with one value (16.9 g/L) beyond the upper Tukey fence" — a single patient worth a clinical look rather than an automatic deletion.

Both plots tell the same story: a mildly right-skewed distribution with one high value. The histogram shows the gap and the tail; the box plot pins down the median, the IQR and the flag. Reporting the median and IQR alongside the plot (rather than the mean and SD) is the consistent choice for data like these.

## Interpretation and common pitfalls

- Reading a histogram's shape from too few bins: with three or four bars everything looks "fine". Inspect at two or three different bin widths before concluding the shape.
- Treating every point beyond a whisker as an error or as significant. It is a flag, not a verdict.
- Comparing groups by eye when boxes barely overlap — or assuming no difference because they overlap a lot. Overlap is not equivalence; follow up with a formal test.
- Hiding the sample size. A box from n = 4 and one from n = 400 look identical; annotate n, and for small groups add jittered raw points (a strip plot) beside each box.
- Misreading the whisker ends as the minimum and maximum. They are the most extreme *in-fence* values; the true min/max may be further out and are only shown if plotted.
- Comparing histograms with different bin widths or different y-axis scales (counts vs density) as if they were the same picture.

## References and further reading

- Bland M, Altman DG. *Statistics with Confidence*. BMJ Books.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and Other Advanced Topics*. Brooks/Cole.

*The "Quantiles and the interquartile range" article in this library defines the five-number summary used by the box plot (article planned).*
