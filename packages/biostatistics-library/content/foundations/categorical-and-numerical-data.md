---
title: Categorical and numerical data
summary: Categorical data take a finite set of values; numerical data take numbers with meaning, and the choice decides which statistics apply.
---

## Overview

A dataset contains categories, measurements, counts, and often mixtures of these. The distinction matters because a variable’s values carry different information. A category label identifies group membership; an ordered category also carries rank; a numerical measurement may represent distance on a scale; and a count represents how often an event occurred. The choice of summary and model should reflect the meaning and collection process of the variable, not merely whether software stores it as text or a number.

Begin by defining the observational unit and the variable’s role. A “number of visits” may be a count per person over a fixed year or a repeated row-level encounter count. “Positive test” may be a result, an assay threshold, or a clinical diagnosis. A meaningful data dictionary records the construct, units, categories, timing, and missing-value codes before analyses begin.

## Categories without and with order

Nominal categories have no natural ranking: blood type, treatment arm, or hospital. Their basic summaries are frequencies and proportions. Categories should generally be mutually exclusive and collectively adequate for the research purpose, though “other” and “unknown” can be retained where needed. If participants can have multiple diagnoses, the data are not a single categorical variable unless the coding rule selects one; use separate indicators or a multi-response structure.

Ordinal categories have a meaningful order but not necessarily equal gaps. Cancer stage, pain severity, and Likert responses are common examples. Report category counts and cumulative proportions. The median category can summarize the center, but the arithmetic mean assumes score distances that may not be justified. An ordinal regression models ordered thresholds without requiring equal spacing, though its own assumptions must be evaluated.

When a nominal predictor enters regression, software typically creates indicator variables. If four hospitals are labeled A through D, a single numeric code 1–4 would incorrectly impose a linear trend unless that structure is intended. Treatment contrasts estimate differences against a reference hospital; other contrasts can compare planned combinations, such as two intervention sites versus two control sites. Report the reference and contrast definition.

## Numerical measurements, counts, and time

Continuous measurements can take values across a range, subject to instrument precision and limits. Examples include body temperature, concentration, and elapsed time. Discrete counts take nonnegative integer values, such as number of admissions. Counts may have many zeros, skewness, or overdispersion; a mean and standard deviation can obscure those features. Summarize the distribution and decide whether a count model should represent exposure time or repeated events.

A numerical value’s scale determines interpretations. Ratio-scale measures have meaningful zero, while interval-scale measurements have equal units but arbitrary zero. A 20-minute delay is twice 10 minutes; 20°C is not twice 10°C. A standard deviation describes spread in units of the measure; an interquartile range is robust to extreme tails. For skewed biomarkers, report median and quantiles alongside any mean if both are scientifically useful.

Time variables need an origin and unit. Date of diagnosis, age at diagnosis, and duration from enrollment are not interchangeable. For rates, person-time denominators matter. A count of 10 events over 500 person-years is an incidence rate of 20 per 1,000 person-years, not automatically a 2% risk. Survival time may be censored, so ordinary means of observed times can be biased; survival estimators use partial follow-up information under assumptions about censoring.

## Summaries should preserve distributional information

For a categorical variable, show count and proportion with denominator and missingness. For binary outcomes, give both group-specific risks and a contrast if the question is comparative. The same relative effect can correspond to very different absolute risks. For numerical data, inspect plots: histograms show shape; boxplots show quantiles and potential extremes; scatterplots reveal relationships and nonlinearities. A mean alone hides multimodality and floor or ceiling effects.

Consider 100 patients reporting a symptom on a 0–10 scale. If half score 0 and half score 8, the mean is 4 and standard deviation is large, but no patient scored near the mean. The distribution communicates a two-group pattern that a single mean does not. If scores are ordinal, category proportions may be even more informative. Summaries should answer the clinical question, not satisfy a default table format.

For small samples, percentages can look more stable than the underlying counts. “50% improved” could mean 1 of 2 or 500 of 1,000. Always show numerator and denominator. Confidence intervals for proportions should use methods with suitable coverage, especially near 0 or 1; the simple Wald formula can perform poorly. When comparing groups, uncertainty for differences should respect the design and any matching or clustering.

## Repeated and clustered observations change summaries

Observations from the same patient are correlated. If each patient contributes monthly measurements, the number of rows is not the number of independent people. A per-patient summary may be appropriate for a descriptive objective; a longitudinal model is useful for trajectories but should account for within-person correlation. Likewise, patients within a clinic share care context, so standard errors may require cluster-aware methods.

Define whether a summary gives equal weight to each person or each observation. A mean over all visits gives more weight to people with more visits; a mean of patient-specific means weights patients equally. These answer different questions. If sicker patients are seen more often, the visit-level average can describe care encounters rather than the average patient’s health. State the unit and weighting explicitly.

Paired data also need a paired summary. For pre/post measurements, calculate within-person changes or fit a model that accounts for pairing. Treating before and after values as unrelated discards their covariance and can waste precision or produce incorrect uncertainty. A paired binary outcome has transition categories; marginal proportions alone do not describe who changed in which direction.

## Categorization of continuous measurements

Cutting a continuous measure into categories can simplify communication or reflect a real decision threshold, but it discards information and creates artificial boundaries. Dichotomizing age at 65 treats 64 and 65 as categorically different, while treating 40 and 64 as equivalent. It reduces power and may leave residual confounding when used to adjust for a continuous confounder. A threshold chosen to maximize observed group separation is especially prone to optimism.

If a guideline threshold is clinically established, show results on both sides when decision relevance requires it, but preserve the continuous measure in modeling where possible. Restricted cubic splines or fractional polynomials can represent smooth nonlinear associations. Display predicted outcomes across the observed range and check whether the shape is supported by adequate data. Do not extrapolate beyond the range or interpret a curve as causal without a causal design.

Ordinal categories are also sometimes collapsed to avoid sparse cells. Combining levels can be reasonable when prespecified and clinically coherent, but changes the estimand and may obscure severity distinctions. Report the original distribution and rationale. If small cells threaten confidentiality, disclosure control should be applied transparently and separately from the analysis definition.

## Worked example: binary outcome and absolute contrast

Suppose 18 of 120 patients receiving a new care pathway are readmitted within 30 days, compared with 27 of 120 under usual care. Risks are 15% and 22.5%. The risk difference is 15%−22.5%=−7.5 percentage points, while the risk ratio is 0.15/0.225=0.67. The odds ratio is (18×93)/(102×27)=0.61. The three measures are related but not interchangeable; because the outcome is not very rare, the odds ratio is farther from 1 than the risk ratio.

An approximate standard error for the risk difference is sqrt[0.15(0.85)/120 + 0.225(0.775)/120] ≈ 0.049. A rough 95% interval is −0.075 ± 1.96(0.049), approximately −0.171 to 0.021. The interval includes no difference and a potentially meaningful reduction. A score-based interval is preferable for formal reporting, and if allocation was clustered, the variance must account for clusters.

```r
# event: 1 = readmitted; group: pathway or usual
with(dat, prop.table(table(group, event), 1))
fit <- glm(event ~ group, data = dat, family = binomial())
# Obtain standardized risks rather than interpreting the odds ratio as a risk ratio.
newdat <- transform(dat, group = "pathway")
risk_pathway <- mean(predict(fit, newdat, type = "response"))
newdat$group <- "usual"
risk_usual <- mean(predict(fit, newdat, type = "response"))
risk_pathway - risk_usual
```

This example treats each record as independent and assumes the model and observed covariate distribution are suitable. A causal interpretation requires design or identification assumptions beyond this code. The risk difference is often easier to connect to decisions, while the odds ratio may be convenient for logistic modeling; report the scale explicitly.

## Coding, missingness, and error

Coding errors can turn valid observations into misleading categories. Check capitalization, trailing spaces, retired codes, impossible combinations, and whether zero is a true value or sentinel for missing. For categorical variables, report an explicit missing category only when “unknown” is meaningful; otherwise distinguish item nonresponse from a substantive group. For measurements, document units, instrument precision, detection limits, and transformations.

Measurement error may be random or differential. Random error in a predictor often weakens associations, while systematic site-specific calibration can create apparent group differences. If a test result is below detection, substituting zero or half the limit can distort analyses. Use methods suited to censoring or present sensitivity analyses. Confirm data provenance and units before pooling sites or calendar periods.

Missingness affects both denominator and interpretation. A complete-case summary describes participants with observed values. If those differ systematically, it may not estimate the target group. Report missing counts and patterns by treatment, site, and time; use imputation only under a stated model and evaluate sensitivity to departures. A table that hides missingness in an “N” column can imply more complete information than the study contains.

## Selecting an analysis from the variable structure

For nominal outcomes with more than two categories, multinomial models can estimate category probabilities; for ordered outcomes, cumulative models may use ordering. Binary outcomes can be summarized by risks, risk differences, ratios, or odds ratios depending on design and question. Continuous outcomes often support mean contrasts or regression, but skewness, censoring, repeated measures, and nonlinear relationships may require other methods. Counts may require Poisson or negative-binomial models with an exposure offset.

These mappings are starting points, not mechanical rules. A small ordinal sample may be best presented descriptively; a randomized trial’s primary estimator can be prespecified even if the outcome distribution is imperfect; a complex survey needs design-based inference regardless of outcome type. Choose an analysis that targets the scientific quantity and respects sampling and measurement.

## Reporting variable definitions clearly

State the unit of analysis, category labels and reference levels, scale ranges and directions, units, time windows, and any transformations or cutpoints. Give denominators, missingness, and summary statistics appropriate to the distribution. For models, state link function, coding, contrasts, clustering, and how adjusted predictions were obtained. Provide plots that show the data structure without implying unsupported precision.

When categories or scales differ across sites, demonstrate harmonization and assess comparability rather than merely merging columns with similar names. For patient-reported scales, cite validation and scoring rules. For counts and rates, state the exposure denominator. The reader should be able to tell what one unit of change means and which population each summary describes.


## Denominators define the descriptive statistic

A proportion is a count divided by a clearly defined set at risk or eligible to experience the event. The denominator may be all randomized participants, all treated participants, all participants with a valid test, or all person-time. These are not interchangeable. Excluding participants after randomization based on adherence can compromise the randomized comparison; reporting positivity among only those who received a test estimates a different quantity than positivity among everyone invited for testing.

For repeated events, distinguish people with at least one event from the number of events. If 12 patients have 20 admissions, the patient-level risk uses 12 people in the numerator, while an admission rate uses 20 events over person-time. Counting each admission as an independent binary observation underestimates uncertainty because events cluster within people. Specify whether recurrent events are included and how follow-up stops.

Small denominators make percentages volatile. In a subgroup of 8 patients, one event changes a percentage by 12.5 points. Show counts and intervals, and avoid overinterpreting subgroup differences. When disclosure risk is present, follow governance rules for suppressing small cells while preserving enough information to understand the analysis.

## Distribution shape and robust description

The mean and standard deviation are useful when a numerical variable is reasonably symmetric or when the mean itself is the target, but outliers can dominate both. The median and interquartile range resist extreme observations, though they do not estimate a mean difference. If a study compares highly skewed costs, a log-scale model estimates a multiplicative contrast under assumptions; retransformation requires care because exponentiating a log mean does not generally recover the arithmetic mean.

A data summary should be paired with a plot. A histogram can reveal skewness, heaping, or multiple modes. A scatterplot can show nonlinear association or distinct clusters. For longitudinal outcomes, spaghetti plots for a sample plus group summaries can show heterogeneity hidden by a mean curve. Boxplots can make outliers visible but do not identify errors; validate extreme observations against source data before deciding how to analyze them.

Robust methods can reduce sensitivity to extreme values without discarding records. Quantile regression estimates conditional quantiles; trimmed means target a central portion of the distribution; rank-based methods compare distributions under specific conditions. These methods answer different questions. Do not label them “nonparametric” and assume assumption-free; explain the target and use uncertainty methods that match the design.

## Transformations preserve or change interpretation

A logarithmic transformation can make a right-skewed positive biomarker more symmetric and turn multiplicative relationships into additive ones on the log scale. If a model coefficient is β per unit increase in x with log outcome, exp(β) is a ratio of geometric means under the model, not automatically a ratio of arithmetic means. Back-transform predictions with appropriate bias correction when arithmetic-scale expectations are needed.

Standardization to a z-score subtracts the sample mean and divides by the sample standard deviation. It can aid numerical optimization and compare relative predictor changes, but coefficients then refer to a one-standard-deviation increase in that particular sample. Across studies with different variability, the same standardized effect can correspond to different clinical-unit changes. Present an original-unit estimate whenever it is interpretable.

Ranks preserve ordering but discard spacing. A rank correlation can describe monotonic association when a linear relationship is not appropriate, yet it does not quantify a clinically meaningful unit change. A transformation or rank operation should be selected from the question and diagnostics, not solely because it yields a preferred significance result.

## A comparison of ordinal and numeric summaries

Suppose symptom ratings in two groups are 0–4. Group A has counts (10, 12, 18, 15, 5) and group B has (20, 15, 12, 8, 5). Both groups have 60 participants. The arithmetic means are (0×10+1×12+2×18+3×15+4×5)/60 = 1.72 and (0×20+1×15+2×12+3×8+4×5)/60 = 1.38. The mean difference is 0.34 categories, but category spacing may not be equal. The cumulative proportions show a clearer pattern: 50% of group A versus 67% of group B report category 0 or 1. A cumulative odds model can summarize the ordered shift if proportional odds is reasonable.

Neither summary alone captures all information. A group may have improvement in mild ratings but not severe symptoms; inspect the full distribution and communicate which contrast was primary. If a validated questionnaire defines a total score from multiple items, its scoring manual may support approximate interval interpretation, but that evidence should be cited. Do not confuse an instrument’s convenient numeric coding with proof of equal intervals.

## Variable structure as a quality-control lens

The expected structure of a variable can catch errors. A nominal site identifier should have a stable set of labels; a date should parse and lie in an expected period; a count should be integer and nonnegative; a laboratory measure should have known units; an ordinal score should be within its documented range. Checks should identify suspicious records for review, not automatically discard them. Unusual observations can be clinically important.

For a derived variable, verify the calculation on hand-worked records and test boundary cases. For example, an event within 30 days includes events on which dates if the index day is day zero? A percentage denominator excludes which missing outcomes? Precise decisions prevent silent off-by-one and denominator errors. Store derivation code with comments and write a small audit table showing counts for each level and missing value.

The strongest analysis makes these structures visible: a clear table for categories, distribution plots for numerical measures, explicit denominators for proportions, and models whose parameters correspond to stated contrasts. This gives clinical readers enough context to judge whether a summary captures the phenomenon they care about.

## References and further reading

- Agresti A. [An Introduction to Categorical Data Analysis](https://doi.org/10.1002/0470114754). Wiley.
- UCLA Institute for Digital Research and Education. [Choosing a statistical test](https://stats.oarc.ucla.edu/other/mult-pkg/whatstat/).
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland JM, Altman DG. *Statistics with Confidence*. BMJ Books.
- Agresti A. *Categorical Data Analysis*. Wiley.
- See the [Describing data](../describing-data/) articles for summaries and plots matched to variable type.
