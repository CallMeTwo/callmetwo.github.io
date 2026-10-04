---
title: Mean, median and mode
summary: Three complementary measures of central tendency and when each one is the right summary for a clinical variable.
---

## Overview

Mean, median, and mode summarize different aspects of a distribution’s center. The mean uses every numerical value and is sensitive to extreme observations; the median is the 50th percentile and resists a small number of extremes; the mode identifies the most frequent value or category. These are not interchangeable “averages.” Choose a summary based on measurement scale, distribution, and the question a reader needs answered.

## Mean: a balance point

For observations x₁,…,xₙ, the arithmetic mean is x̄=Σxᵢ/n. It is the value that minimizes the sum of squared deviations and is central to many linear models and treatment-effect estimands. Because it uses all values, it moves when any observation changes. A few long hospital stays can pull the mean above the value experienced by a typical patient, but the mean remains relevant for resource planning because total bed-days depend on the arithmetic average.

If data are roughly symmetric and without influential extremes, report mean with standard deviation. The standard deviation describes spread among individuals, not precision of the estimated mean. For a treatment comparison, report the mean difference and confidence interval as well as each group’s descriptive mean and SD.

## Median: a resistant center

The median is the middle ordered value; with an even sample size it is often the average of the two central observations, depending on quantile convention. It minimizes the sum of absolute deviations and is resistant to extreme tails. It is useful for skewed quantities such as length of stay, cost, and inflammatory markers. Report it with the IQR, which spans the central half of observations.

For the values 2, 3, 3, 4, 5, 30, the mean is 7.8 while the median is 3.5. The long value materially affects the arithmetic mean but barely changes the median. The median does not describe the size of the upper-tail burden: if the 30 represents an ICU stay, that tail may still be clinically and economically important. Pair robust center with quantiles or distribution plots.

## Mode: common category or value

The mode is the most frequent category and is meaningful for nominal data such as blood group or organism type, where mean/median are undefined. For discrete counts, a mode can answer “what count is most common?” Continuous data often have no stable exact mode because each value may occur once; a density mode depends on smoothing or binning. A multimodal distribution can have several modes, warning that a single center may summarize a mixture poorly.

## Shape and the relation among centers

In a symmetric unimodal distribution, mean, median, and mode are often close. In a right-skewed distribution, the long upper tail often pulls mean above median; the left-skew pattern reverses. This is a tendency, not a theorem for every irregular sample. Multimodality, truncation, and outliers can create more complex ordering. Inspect a histogram or empirical distribution before choosing one summary.

```r
x <- c(2, 3, 3, 4, 5, 30)
c(mean = mean(x), median = median(x),
  sd = sd(x), IQR = IQR(x))
```

R does not provide a universal mode function because categorical modes and continuous density modes differ. For a categorical vector, use `which.max(table(x))`; for a continuous variable, specify a smoothing method rather than reporting the most repeated rounded value as an intrinsic population mode.

### Measurement scale and clinical communication

For nominal categories, report counts and proportions, not arithmetic summaries. For ordinal scales, median and category frequencies preserve order but not equal category spacing. For interval or ratio measurements, mean may be meaningful, though distribution and estimand still matter. Temperature scales with arbitrary zero differ from counts with true zero; ratios of Celsius values are not meaningful.

A single summary can hide clinically important heterogeneity. Baseline disease severity may create subgroups with different centers; a mixture may be bimodal. Summarize by prespecified strata only when meaningful, and avoid data-driven splitting to produce a preferred pattern. For repeated measures, the mean at each time point does not show individual changes; pair with longitudinal plots or models.

## Reporting choices and common errors

Use mean (SD) for approximately symmetric continuous variables; median (IQR) for skewed distributions; n (%) for categorical variables. This is a reporting convention, not a law: explain choices for bounded or ordinal scales. Do not report mean±SE as patient variability; the SE measures precision of the estimated mean. Do not select median simply because a normality test rejects, or mean because it produces a familiar model. If a mean is the target, robust or bootstrap inference may be preferable to changing the estimand.

The mean can be scientifically important even with skewness; the median can be stable but insensitive to clinically meaningful tail changes. State what the chosen center represents, the units, sample size, and complementary spread measure. Descriptive summaries do not imply causality or statistical significance.

## Mean and median estimate different population features

The population mean is the expected value of a measurement; the population median divides probability mass into halves. They answer different questions and can differ even with very large samples. In a skewed distribution, the mean summarizes total burden per person, while the median locates a typical rank. For costs, the mean matters for budgeting; the median may describe the common patient experience. Reporting one alone can conceal the other’s relevance.

The sample mean is sensitive to the sampling frame and extreme observations. A median is robust to a small fraction of contamination but can be less efficient for a normal distribution and says little about tails. A trimmed mean removes a prespecified fraction from each tail and provides a compromise, but targets a different quantity. If used, state trimming proportion and interval method.

## Uncertainty around centers

A mean’s standard error is s/√n for independent observations; its confidence interval uses a t distribution in small samples under standard assumptions. A median interval can be obtained from order statistics or bootstrap, with uncertainty depending on density near the median. The sample IQR describes spread, not precision of the median. Do not confuse median (IQR) with a confidence interval for the median.

For a categorical mode, uncertainty is often represented by category proportions and intervals rather than a single mode. When the top two categories have similar counts, the identity of the modal category is unstable. Report the full frequency distribution.

## Means after transformation

If data are log-normal, the mean on log scale corresponds after exponentiation to a geometric mean. The arithmetic mean on original scale is larger and depends on log-scale variance; naive exponentiation of predicted log means underestimates it. A smearing correction or distributional model may be needed to estimate arithmetic means. Decide whether the question concerns multiplicative typical change or expected total quantity.

### A clinical example

For length of stay values 2, 3, 3, 4, 5, 30, mean 7.8 days and median 3.5 days tell different stories. The mean may be relevant to bed capacity; the median better reflects the middle patient. The 30-day observation could be a valid complex case. Report quantiles or a plot to show the tail rather than dropping it. If comparing treatments, a difference in means estimates days saved on average; a median difference estimates a different shift and may not summarize tail savings.

### Reporting

Choose summaries based on scale, distribution, and decision. Use mean (SD) for symmetric continuous outcomes, median (IQR) for skewed outcomes, and n (%) for categories, while recognizing these conventions are not mandates. Give units, sample size, missingness, and any transformation. For comparative inference, report the effect estimate and interval on the scale of interest. A descriptive center alone does not establish group differences or causality.

### Robustness, influence, and mixtures

The mean has an unbounded influence function: a sufficiently extreme observation can move it arbitrarily far. The median’s influence is bounded, making it robust to isolated extremes. This statistical property does not mean the median is always better. If extremes represent genuine resource use or rare toxicity, the mean may be exactly the quantity needed. Report distribution tails alongside whichever center is chosen.

A mixture of subpopulations can make the mean fall in a region where few individuals lie. For example, a clinic serving both mild and severe disease may show two modes; the mean score may represent neither group. Examine stratified distributions based on meaningful clinical variables, and consider whether a mixture model or subgroup description is warranted. Data-driven clustering after seeing the outcome risks overinterpretation.

### Geometric means and multiplicative processes

For positive measurements with multiplicative variation, geometric mean is exp(mean(log x)). It is appropriate for ratios, fold changes, or log-normal distributions, but it is not the arithmetic expected value. For log-normal data, arithmetic mean equals exp(μlog+σ²log/2), larger than the geometric mean exp(μlog). Report which quantity is used and why. Geometric mean does not accommodate zero values without an explicit model or transformation.

### Mode and category distributions

For nominal outcomes, the full frequency distribution is generally more useful than a single mode. A mode identifies the most frequent category but ignores the relative frequencies of others and can be unstable in small samples. For continuous data, a mode depends on smoothing or bins and may not be a well-defined sample statistic. If multimodality is scientifically relevant, use density estimation or mixture models with validation.

### Communicating centers in trials

Baseline tables often use mean (SD) for symmetric measurements and median (IQR) for skewed ones, but baseline significance tests should not determine summaries. At follow-up, compare treatment groups with an estimand-aligned effect and interval. Separate changes within each arm do not estimate randomized treatment contrast. If response is a thresholded category, show category counts and avoid implying the mode is treatment effect.

### Baseline summaries and clinical decisions

The appropriate baseline summary depends on the variable’s scale and shape, not on a test of normality. For age with near-symmetric distribution, mean (SD) may be clear; for length of stay, median (IQR) may better describe the typical patient. If a decision depends on extreme values, add a high percentile. In a randomized trial, baseline summaries describe the sample but should not be accompanied by balance p-values as a test of randomization.

### Comparing means under skew

The arithmetic mean remains the target in many policy questions. Skewness can make a small-sample t interval inaccurate, but larger samples, robust variance methods, or bootstrap intervals may help while retaining the mean. A rank test answers another question. Do not change from mean to median only because the mean comparison is less significant. Prespecify the estimand and explain sensitivity analyses.

### Weighted and survey summaries

In a complex survey, the unweighted sample mean may not estimate the population mean if inclusion probabilities differ. A survey-weighted mean uses design weights; its standard error must reflect strata and clusters. A weighted median is defined through cumulative weights and may not equal the median of expanded pseudo-records under every convention. Report the target population and whether summaries are weighted.

In clinical registries, case mix and referral selection can shift both means and medians relative to the general population. Descriptive centers from a selected cohort should not be presented as population norms without a sampling argument.

### Robustness analysis for extreme values

When one valid extreme observation drives the mean, report the primary mean and a sensitivity analysis using a robust estimator or model appropriate to the target. Explain whether the observation is clinically real and why the alternative summary is informative. Avoid choosing the summary that yields a desired treatment conclusion. A prespecified trimmed mean can be useful when the scientific estimand tolerates trimming, but it does not estimate the population arithmetic mean.

### Not all averages are patient averages

The mean across patients differs from the mean across hospitals when hospital sizes differ. Weighting hospitals equally estimates an average hospital; weighting by patient count estimates the average patient’s facility context. Choose the unit of averaging based on the policy question and report the weighting. Hierarchical summaries can separate within- and between-site centers.

### Mean and median under sampling

Sample means and medians vary from sample to sample. For independent observations with finite variance, SE(mean)=s/√n. Median uncertainty depends on density near the population median and is often estimated by order-statistic or bootstrap methods. The IQR is distribution spread, not the uncertainty interval for a median. In clustered samples, both center estimates need design-aware uncertainty; treating all records as independent is incorrect.

### Robust mean summaries

A trimmed mean removes a fixed proportion from each tail; a winsorized mean replaces tails with boundary values. These methods reduce sensitivity to extreme observations but target a modified location. They can improve efficiency under heavy tails, but should be prespecified and paired with appropriate variance estimators. A “robust mean” is not a median, and its clinical interpretation should be explained.

### Categorical modes

For a categorical variable, report all category frequencies; the mode alone can hide a nearly tied second category. For ordinal categories, include the ordered distribution and perhaps median category. If one category is most common by one observation, avoid implying a stable dominant state.

### A concise selection guide

Use the mean when the arithmetic average is the target; pair with SD and an interval for estimates. Use the median when a resistant middle position is the target; pair with IQR and quantile uncertainty. Use mode for nominal categories or a prespecified discrete “most common” question; show full frequencies. For multimodal populations, describe mixture structure instead of forcing one center.

### Worked example of center and spread

For the six stays 2, 3, 3, 4, 5, 30 days, mean is 7.83, median 3.5, and mode 3. The sample SD is about 10.9 days, while IQR depends on quantile convention but is much smaller. The mean and SD reflect the long stay’s contribution to resource use; the median and IQR reflect the central patient experience. Neither set is “correct” universally. Show the distribution and explain the decision the summary serves.

```r
stay <- c(2, 3, 3, 4, 5, 30)
c(mean = mean(stay), median = median(stay), sd = sd(stay),
  q1 = quantile(stay, .25), q3 = quantile(stay, .75))
```

The mode is calculated from frequencies, but with continuous measurements it can depend on rounding. Use it only when repeated discrete values carry meaning.

### Means across groups

A pooled mean weights each group by its sample size; an equally weighted mean of group means answers a different question. In multi-site studies, a patient-average outcome weights large sites more, while an average-site summary gives each facility equal weight. State the unit and weighting. These choices affect interpretation of population-level summaries.

### Distinguish a sample center from treatment effect

A group mean or median describes an arm; the treatment effect is a contrast between arms under a defined estimand. Baseline and follow-up centers should not be compared informally without uncertainty. In randomized trials, use an adjusted between-arm contrast or change contrast as planned. Separate within-arm tests answer whether each arm changed from its own baseline, not whether treatments differ.

### Summary table conventions

Report n, mean (SD) or median (IQR), and n (%) for categories. Make missingness visible and use consistent decimal places. For skewed variables with decision-relevant means, consider giving both mean (SD) and median (IQR) rather than forcing a single conventional summary. Explain why each measure is shown.

### Interpretation in a treatment study

Suppose the intervention mean is 5 points lower than control but the median is only 1 point lower. This may reflect improvement in a subset with large responses or a long tail. A single center cannot resolve that pattern. Show distributions and responder proportions using a prespecified clinical threshold, then estimate the planned treatment contrast with uncertainty. Do not claim benefit in typical patients from a mean alone.

### Means of ratios and ratios of means

A mean individual ratio differs from the ratio of group means. For example, average fold change per participant weights people equally, whereas ratio of aggregate means weights by baseline magnitude. These quantities may diverge with heterogeneous baselines. State which is estimated, especially in biomarker and pharmacokinetic analyses.

### Final interpretation

Center is a feature of a distribution, not a universal property summarized by one number. The mean captures arithmetic expectation, the median captures central rank, and the mode captures frequency. Use a spread measure and distribution view alongside the center, explain the target, and report treatment contrasts separately from arm summaries.

A complete report gives the chosen center, the complementary spread, units and n, with an effect contrast and interval when comparing groups.

A 95% interval for a mean estimates precision of that mean, not the spread of individual observations; always label SD and confidence limits separately.

If the mean and median are far apart, describe the shape and tails rather than declaring one statistic wrong; each summarizes a different feature.

## References and further reading

- Bland JM, Altman DG. [The mean, the median and the skew](https://doi.org/10.1136/bmj.310.6977.713). *BMJ*. 1995.
- NIST/SEMATECH. [Measures of location](https://www.itl.nist.gov/div898/handbook/eda/section3/eda351.htm).

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland M, Altman DG. *Statistics with Confidence*. BMJ Books.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and Other Advanced Topics*. Brooks/Cole.

The sampling-distribution article in this library develops standard errors
and sampling variability.
