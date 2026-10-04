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

## References and further reading

- Agresti A. [An Introduction to Categorical Data Analysis](https://doi.org/10.1002/0470114754). Wiley.
- UCLA Institute for Digital Research and Education. [Choosing a statistical test](https://stats.oarc.ucla.edu/other/mult-pkg/whatstat/).

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland JM, Altman DG. *Statistics with Confidence*. BMJ Books.
- Agresti A. *Categorical Data Analysis*. Wiley.
- The *Describing data* articles in this library cover summaries and plots
  matched to variable type.
