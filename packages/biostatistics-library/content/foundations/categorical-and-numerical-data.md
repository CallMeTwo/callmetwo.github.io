---
title: Categorical and numerical data
summary: Categorical data take a finite set of values; numerical data take numbers with meaning, and the choice decides which statistics apply.
---

## Overview and key ideas

Every variable in a dataset is either **categorical** or **numerical**, and
this is the first fork in the analysis path because it determines which
summaries and tests are meaningful.

**Categorical variables** take values that are labels or categories: blood
group, yes/no for a complication, NYHA class. *Nominal* categories have no
natural order (blood group A, B, AB, O); *ordinal* categories do (mild,
moderate, severe). **Numerical variables** take values on a numeric scale,
split into *discrete* (number of admissions) and *continuous* (blood
pressure, time to event). The distinction drives the summary: categorical data
are summarised by counts and proportions; numerical data by a centre (mean or
median) and a spread (standard deviation or IQR). It also constrains the
test — proportions with chi-square or Fisher's exact test, two means with a
t-test, counts with Poisson or binomial models.

## When to use it

The classification is made at variable-definition time and governs everything
downstream. Typical scenarios:

| Setting | Example question |
| --- | --- |
| Stroke registry | Is the proportion receiving thrombolysis higher this year than last? (categorical, compared as proportions) |
| Metabolic study | Do patients with metabolic syndrome have a higher mean triglyceride level? (continuous, compared as means) |
| Adverse events | How many treatment-related serious adverse events per 100 patient-months? (count, rate) |
| Case series | What is the typical time from symptom onset to presentation? (continuous, usually skewed, median) |

In a stroke registry, "received thrombolysis: yes/no" is a binary categorical
outcome while "onset-to-presentation (hours)" is continuous and right-skewed.
The first is summarised by the proportion of yes's; the second by the median
and IQR, because a few very late presenters would pull the mean upward.
Getting the variable type right is what keeps summary and test consistent.

## Assumptions and limitations

- **Ordinal categories pretend to a numeric scale.** Ordering NYHA classes
  I–IV and computing their "mean" is defensible in some contexts but
  arbitrary in others; the spacing between classes is not measured.
- **Binning continuous data loses information.** Converting age to
  "<65 / 65+" changes the analysis from a regression into a comparison of
  group means, at a cost in power and precision.
- **Discrete vs continuous is a continuum.** A count of 0–2 is discrete; a
  count routinely reaching 20 is well approximated as continuous. The label
  should follow the actual data, not the questionnaire's intent.

The classification breaks down for mixed variables ("number of comorbidities,
0–5+") and when coding errors turn what should be a continuous measurement
into a few binned values — at which point the original numeric variable must
be recovered if still available.

### Choosing a model, not just a summary

Data type narrows the options, but design and estimand finish the choice. For
a binary outcome, logistic regression models log odds; with a common outcome,
the odds ratio can be appreciably farther from 1 than the risk ratio. A
binomial model can target risks directly. Count outcomes may use Poisson
regression with log person-time as an offset; if counts vary more than the
Poisson model allows because of clustering or patient heterogeneity, a
negative-binomial model may be preferable. Repeated outcomes from one patient
need methods that account for within-person dependence. Preserve the original
measurement and state the target effect before selecting a model.

## Worked example

A stroke registry records, for 500 patients, thrombolysis (yes/no) and time
from onset to presentation (hours). Thrombolysis was given in 180 of 500
(36.0%); using the normal approximation, 95% CI ≈ 31.7% to 40.4%. The
onset-to-presentation times have a mean of 6.9 hours but a median of 4.2,
IQR 2.8–7.5 — the right skew visible as the mean exceeding the median.

The correct summaries therefore differ by variable type: report thrombolysis
as a proportion with its 95% confidence interval, and time-to-presentation as
median and IQR (4.2 h, IQR 2.8–7.5). A reader who saw only "mean 6.9 hours"
would overstate the typical patient; one who saw only the proportion would
lose the temporal information. The variable type is what tells you which
number to report.

## Interpretation and common pitfalls

- **Averaging ordinal categories as if numeric.** "Mean severity 2.3 on a
  1–5 scale" implies equal spacing the scale may not support; medians or
  proportions by category are safer.
- **Over-binning continuous data** to fit a chi-square table sacrifices power
  and precision for no gain in simplicity.
- **Treating a count as a proportion (or vice versa).** "12 complications in
  200 patients" is a count with a denominator; reporting it as 6% without the
  denominator, or pooling counts across different denominators, is an error.
- **Letting the data entry form dictate the type.** A field stored as text
  ("high", "med", "low") for what is really a numeric measurement forces the
  analysis down the categorical path; capture the raw number at entry.

## Measurement structure and analytic consequences

Variable type describes the information a recorded value carries, not merely the storage format. A numeric code 1, 2, 3 for blood group remains nominal; arithmetic on those codes has no scientific interpretation. Conversely, an ordinal response such as pain category contains rank information but not necessarily equal spacing. Continuous measurements may be rounded to integers in a database without becoming counts. Record the original scale, units, allowable values, and derivation in a data dictionary.

A binary outcome observed in independent participants is commonly modeled as Bernoulli data, with likelihood p^x(1−p)^(1−x). Across n people, the count is binomial when the probability is common and observations are independent. A count such as exacerbations per patient may instead reflect differing observation time and heterogeneity; Poisson regression uses a log rate and person-time offset, while negative-binomial models allow overdispersion. A continuous outcome may be modeled with a Gaussian likelihood when residual behavior is acceptable; bounded scores, positive skew, and detection limits often call for another distribution or a scientifically justified transformation.

The mean of an ordinal scale is not automatically invalid, but its interpretation relies on treating category steps as approximately equal. For a five-item symptom score with a validated total, common practice may justify a mean contrast; for a single mild/moderate/severe item, category probabilities or an ordinal regression preserve more of the measurement structure. The proportional-odds model assumes a common log-odds shift across cut points, an assumption to check and report. Dichotomizing an ordinal outcome discards ordering and distinctions within each collapsed category.

### Worked example: common outcome and odds ratio

Suppose outcome risks are 30% under exposure and 20% without exposure. The risk ratio is 0.30/0.20 = 1.50. The odds are 0.30/0.70 = 0.429 and 0.20/0.80 = 0.25, so the odds ratio is 1.71. Thus, interpreting the odds ratio as a risk ratio would overstate the relative contrast. For a rare outcome, odds and risks are numerically closer; for common outcomes they diverge.

```r
events <- c(30, 20)
total  <- c(100, 100)
risk <- events / total
odds <- risk / (1 - risk)
c(risk_difference = diff(risk), risk_ratio = risk[1] / risk[2],
  odds_ratio = odds[1] / odds[2])
# 0.10, 1.50, 1.71
```

The order here is exposed then unexposed; reverse the vector order and the ratio reciprocates. For clustered data, this table's nominal independent-binomial uncertainty is too optimistic unless clustering is accounted for.

### Selecting summaries and models

For nominal categories report counts and denominators, not percentages alone. For ordinal categories show the full distribution or a prespecified clinically meaningful contrast. For symmetric continuous data report mean and SD; for skewed data report median and quantiles, while still showing the distribution. For counts report the observation window and distinguish a total count from a rate. If data are paired, identify the within-person contrast. If multiple records belong to one patient or site, account for dependence. If measurements are censored below a laboratory limit, replacing all values with zero or half the limit changes the measurement model and can bias estimates.

A model choice should follow the outcome's support and the scientific question. Linear regression predicts a conditional mean; logistic regression models log odds; Poisson regression models a log rate when an exposure offset is specified. A convenient family is not proof of validity: inspect residuals, calibration, influential observations, and whether fitted values are possible. Avoid automatic categorization of age, biomarkers, or follow-up time. If a nonlinear relationship is plausible, splines often retain information better than arbitrary cut points. See the categorical-analysis reference by Agresti and the library's descriptive-data pages for compatible summaries.


## Repeated, paired, and clustered measurements

Observation structure is separate from variable type. A continuous outcome measured before and after treatment in the same person is paired; the analysis should use within-person differences or a repeated-measures model. A binary endpoint recorded at several visits has correlated Bernoulli outcomes, and treating every visit as an independent row inflates precision. Generalized estimating equations target population-average effects under a working correlation structure, while mixed-effects models describe conditional effects given random effects. The choice affects interpretation, particularly for nonlinear models such as logistic regression.

For categorical predictors with many rare levels, estimates can be unstable. Combine levels only when clinically and scientifically defensible and preferably before outcome inspection. For a continuous predictor, model the relationship flexibly rather than defaulting to categories. Restricted cubic splines can capture smooth nonlinearity while preserving the underlying scale. Report predicted values or contrasts at clinically meaningful values, since spline coefficients themselves are not simple slopes.

### Worked example: paired versus independent uncertainty

Suppose 40 patients have a biomarker measured before and after treatment. The mean change is −4 units with SD of paired changes 10. The SE is 10/√40=1.58, and a t interval using 39 df is roughly −4±2.02(1.58), or −7.19 to −0.81. If one instead treated pre and post values as 80 independent observations, the covariance within person would be ignored and the estimand itself could be misrepresented. The correct variation is the distribution of differences, not the separate marginal SDs.

```r
change <- post - pre
mean(change)
sd(change) / sqrt(length(change))
t.test(post, pre, paired = TRUE)
```

The paired t method assumes independent patients and an approximately normal distribution of differences, especially for small samples. It does not require each marginal measurement to be normal. With strong outliers or a highly discrete outcome, examine robust or appropriate nonparametric alternatives, recognizing that a signed-rank test targets a different parameter under general conditions.

### Outcome type does not dictate design interpretation

A binary endpoint can be summarized as a risk, odds, or rate depending on follow-up. If all participants have fixed follow-up, risk is often natural; if follow-up varies and event timing matters, survival analysis may be preferable. Repeated-event counts can be analyzed as rates if recurrent events are part of the estimand, but a first-event analysis answers a different question. A continuous laboratory value can be measured with error, censored at assay limits, or sampled at informative times. Type determines support; measurement process and design determine the likelihood and estimand.

### Coding categories in R without losing meaning

Use factors with explicit labels and reference levels. Avoid representing nominal categories as integers and then fitting a linear model, because this imposes a false one-unit trend. For an ordered factor, set the order deliberately, then decide whether a linear trend, proportional-odds model, or category-specific effects are scientifically justified. Validate levels and missing codes before model fitting.

```r
dat$severity <- factor(dat$severity,
  levels = c("mild", "moderate", "severe"), ordered = TRUE)
dat$blood_group <- factor(dat$blood_group,
  levels = c("O", "A", "B", "AB"))
```

R's default contrasts depend on factor type and options; inspect `model.matrix()` when coefficient meanings matter. Define contrasts so that reference groups correspond to the clinical comparison, and report the coding. Statistical software cannot determine whether a category is nominal or ordinal; that is a measurement decision.


## Information loss from categorization

Suppose age has a linear relationship with outcome risk. Dividing age at 65 assigns the same fitted value to a 40-year-old and 64-year-old and another common fitted value to 65- and 90-year-olds. The result depends on a cutoff chosen by convention, and a person just above the threshold is treated as fundamentally different from one just below. Categorization usually reduces power because it discards order and spacing, and residual confounding persists within categories. When a clinical threshold exists, report it for decision-making but model the continuous measurement flexibly for association estimation.

Restricted cubic splines allow a smooth nonlinear relationship. Knots should be prespecified or placed at outcome-blind quantiles, and the number should be limited to avoid overfitting. Plot adjusted predicted outcomes across the observed range and show uncertainty; do not interpret each spline basis coefficient in isolation. Extrapolation beyond the observed data range is especially unreliable.

```r
# Illustration with rms package; dat must contain outcome and age
# fit <- rms::lrm(outcome ~ rms::rcs(age, 4) + sex, data = dat)
# plot(Predict(fit, age, fun = plogis), ylab = "Predicted risk")
```

The example requires a correctly specified outcome and adequate events across the age range. It is not a license to fit flexible curves to tiny datasets; model complexity must be supported by information and validated.

## Distribution summaries that retain context

For a binary variable, report numerator and denominator plus a confidence interval. For a nominal multi-category variable, percentages should sum to 100% only if categories are mutually exclusive and missingness is separately displayed. For ordinal measures, give category-specific counts and perhaps a cumulative proportion. For continuous data, use a histogram or density plot to expose multimodality and outliers; a mean and SD can coexist with median and IQR when both center and tail behavior matter. For counts, report zero frequency, range, and exposure duration if relevant.

The sample size for each summary may differ because of missing values. State the denominator for each row instead of letting readers assume complete data. In repeated measurements, a table of independent visit counts can obscure within-person changes; pair summaries with trajectory plots or model-based estimates. Stratify descriptively by design groups when useful, but avoid treating baseline p-values as proof of randomization success. Good descriptive practice clarifies the data before inferential modeling.

## Measurement error and misclassification

Categorical variables can be misclassified (a diagnosis code may not match chart adjudication); numerical values can contain random or systematic error (a poorly calibrated pressure cuff). Nondifferential misclassification of a binary exposure often attenuates associations in simple settings, but this is not universal, especially with multiple categories or confounding. Differential error can bias in either direction. Validate a subsample against a stronger reference measurement and preserve information on source and measurement method.

For continuous error, repeated measurements can separate within-person variability from between-person differences, although biological variation may itself be meaningful. Averaging replicate values reduces independent random measurement error but not systematic calibration bias. If errors are large relative to true variation, regression calibration or measurement-error models may be needed. Sensitivity analyses over plausible reliability values can show how robust a slope is.

## Denominator discipline

Every proportion requires a defined denominator. “Six percent had complications” could mean six of all randomized participants, of those completing follow-up, of procedures, or of person-time. A count can be numerically identical while representing different risks. For a rate, state the exposure time and whether recurrent events contribute. For missing categorical data, show the missing category or state that percentages are calculated among nonmissing responses. This denominator discipline is as important as correctly labeling the variable type.

A practical decision sequence is: establish the scientific construct and unit; classify its support (categories, ordered categories, counts, continuous values, or censored values); identify whether observations are independent or repeated/clustered; specify the estimand; then choose a summary and model. This sequence prevents a common mistake: selecting a test solely from a variable's data type. Two categorical variables in a paired design call for different methods than two categorical variables in independent groups, and a continuous outcome with censoring differs from an ordinary Gaussian measurement.

When presenting plots, use scales that reflect the data. A histogram of a continuous variable reveals distribution shape; a bar chart of categories should show counts or proportions with clear denominators; a box plot compresses shape into quantiles and can hide multimodality. For paired data, connect observations or plot within-person changes rather than presenting unrelated group summaries. Label units, category order, missing values, and time windows. Visual summaries often reveal data-type or coding errors before a model is fitted.

## Type-specific questions for analysts

Before summarizing, ask whether the categories are mutually exclusive, whether the numerical scale has a true zero, whether zeros are meaningful or coded missingness, whether repeated values indicate rounding or true discreteness, and whether a measurement is censored. “Not detected” is not a zero concentration; “none” may be a valid count; a score of zero may mean absence of symptoms or missing assessment depending on the instrument. These distinctions affect both descriptive statistics and likelihood construction. Consult the data dictionary and source form instead of inferring meaning from numeric appearance.

## References and further reading

- Agresti A. [An Introduction to Categorical Data Analysis](https://doi.org/10.1002/0470114754). Wiley.
- UCLA Institute for Digital Research and Education. [Choosing a statistical test](https://stats.oarc.ucla.edu/other/mult-pkg/whatstat/).

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland JM, Altman DG. *Statistics with Confidence*. BMJ Books.
- Agresti A. *Categorical Data Analysis*. Wiley.
- The *Describing data* articles in this library cover summaries and plots
  matched to variable type.
