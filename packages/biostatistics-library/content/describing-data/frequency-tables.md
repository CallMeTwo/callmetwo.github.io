---
title: Frequency tables
summary: Counts, proportions and two-way cross-tabulations as the starting point for summarising categorical clinical data.
---

## Overview

Frequency tables organize categorical observations into counts and proportions. They answer basic but consequential questions: how many participants belong to each group, how common is an event, and what denominator supports a reported percentage? In clinical research, the table’s layout and denominator determine whether a number describes risk within a group, the composition of cases, or the overall sample. Always show counts with percentages; percentages alone conceal precision and can mislead when cells are small.

## Start with one variable

For a single categorical variable with categories k=1,…,K, the count nₖ and relative frequency p̂ₖ=nₖ/N summarize its sample distribution. The counts sum to N and proportions to one, apart from rounding. Categories should be mutually exclusive and collectively exhaustive for the target population. A missing or unknown category should be displayed or its handling explained; silently dropping it changes the denominator.

```r
status <- factor(c("mild", "none", "moderate", "mild", "none"),
                 levels = c("none", "mild", "moderate", "severe"),
                 ordered = TRUE)
tab <- table(status, useNA = "ifany")
cbind(count = tab, percent = 100 * prop.table(tab))
```

Explicit factor levels preserve clinically meaningful order and display categories with zero observed counts. `table()` omits missing values by default unless requested; check whether the denominator should include them. Percentages in small samples are unstable, so report exact numerator/denominator as well as rounded percent.

## Two-way tables: choose the denominator deliberately

A cross-tabulation of treatment by adverse event can be displayed with counts, row percentages, column percentages, or overall percentages. Each answers a different question. If rows are treatment arms, row percentages estimate event frequency within arm. Column percentages describe the distribution of treatment among people with or without an event. Overall percentages describe the share of the total sample in each cell.

Suppose 20 of 100 participants in arm A and 10 of 50 in arm B report nausea. Both arms have 20% nausea, although 67% of all nausea cases came from A because A enrolled twice as many people. The first statement compares risks; the second describes case composition. Confusing these denominators can reverse a narrative.

```r
tab <- matrix(c(20, 80, 10, 40), nrow = 2, byrow = TRUE,
              dimnames = list(arm = c("A", "B"),
                              nausea = c("yes", "no")))
tab
prop.table(tab, margin = 1)  # within arm
prop.table(tab, margin = 2)  # within nausea status
prop.table(tab)             # whole sample
```

Use row or column orientation that aligns with the question, label it in the table, and show denominators. For diagnostic performance, columns or rows can be set to reference-standard status; sensitivity and specificity use disease-status denominators, whereas predictive values use test-result denominators.

## Stratification and Simpson’s paradox

A marginal table can obscure differences across age, site, severity, or another prognostic factor. A pooled association may weaken, disappear, or reverse after stratification because the strata have different exposure and outcome distributions. Display stratified counts when the scientific question requires them, but avoid treating every stratum-specific p-value as a discovery. For adjustment, use a regression or standardization strategy that matches the estimand and causal structure. Stratification is descriptive; it does not automatically eliminate confounding.

### Sparse cells, privacy, and data quality

Small cells can produce unstable percentages and can risk disclosure in small populations. Follow applicable privacy rules and report suppression transparently. Statistical tests may require exact or model-based methods when expected counts are sparse, but collapsing categories solely to improve a p-value can erase clinical distinctions. Check for impossible combinations, duplicate records, inconsistent category coding, and missingness before interpretation. A frequency table is often an effective data audit: unexpected levels and zeros can reveal coding errors.

## Reporting and interpretation

State the analysis population, denominator, time period, category definitions, missing-data handling, and whether percentages are weighted. In randomized trials, baseline tables are descriptive; significance tests for baseline balance are usually unhelpful because randomization, not a p-value, addresses balance in expectation. Report adverse events by arm with count and denominator, and distinguish participants with at least one event from total recurrent event counts. These are different data structures.

A frequency table describes observed data; it does not establish why categories differ. A difference in crude proportions may reflect chance, confounding, selection, or an intervention effect depending on design. Add a risk difference, ratio, confidence interval, and appropriate model when inference is needed. Avoid causal language from a cross-tabulation alone.

## Three denominators in a clinical table

Take an adverse-event table with arm A: 20 events and 80 non-events; arm B: 10 events and 40 non-events. Total N=150; 30 participants had an event. Row percentages are 20/100=20% and 10/50=20%, so event risk is equal. Column percentages among events are 20/30=67% from A and 33% from B, reflecting the larger enrollment in A. Overall percentages are 13.3%, 6.7%, 53.3%, and 26.7% across cells. None is intrinsically “the correct percent”; the target question chooses the denominator.

```r
tab <- matrix(c(20, 80, 10, 40), nrow = 2, byrow = TRUE)
round(100 * prop.table(tab, 1), 1) # event distribution within arm
round(100 * prop.table(tab, 2), 1) # arm distribution within outcome
round(100 * prop.table(tab), 1)    # share of total cohort
```

Label the table orientation and percentage basis. In published tables, many misinterpretations arise because the percentage denominator is unstated.

### Counts, rates, and repeated events

A binary frequency table counts participants with at least one event. It does not describe the total burden when participants can experience recurrent events. For recurrent infections, distinguish number of people with ≥1 infection from total infection episodes and person-time rate. The first can be summarized by a binary table; the latter needs count/rate methods and attention to within-person dependence. A count divided by person-time is a rate, not a proportion, and can exceed one per person-year.

For unequal follow-up, use survival or rate analyses rather than crude proportions if time at risk differs materially. A frequency table remains useful descriptively if each denominator and observation window is shown. Specify whether death or competing events end follow-up.

## Weighted and stratified percentages

Survey weights alter estimated counts and percentages because participants represent different numbers of people in the target population. Weighted proportions need design-based standard errors accounting for strata and clusters. The unweighted table describes the sample; the weighted table estimates the population under the sampling design. State both when useful. Nonresponse adjustment and calibration do not guarantee representativeness if inclusion mechanisms remain unmodeled.

Stratified tables can reveal a confounding pattern or effect heterogeneity. Summarize each prespecified stratum and consider standardized marginal estimates when a single population-level number is needed. Do not average percentages arbitrarily: choose weights based on target population distribution. If stratum counts are sparse, maintain clinical categories and use suitable modeling rather than data-driven collapsing.

## Missing categories and denominator discipline

Missing values can mean not measured, refused, unknown, or not applicable; these should not be conflated. A table can show missingness as its own row or report valid and total denominators. Complete-case percentages answer a question about those observed; all-enrolled denominators may be appropriate for a treatment-policy endpoint, but missing outcomes are not automatically non-events. Describe missingness by arm and reason when possible.

For categorical variables with structural zeros, distinguish impossible combinations from unobserved possibilities. Structural zeros alter expected-count calculations and model support. A zero because no one in a small sample happened to fall in a category is a sampling zero. Data validation should check mutually exclusive category coding, duplicates, and whether recoding changed the denominator.

## Baseline tables and balance

In randomized trials, baseline characteristics are usually summarized descriptively by arm. Significance tests for baseline balance are not useful evidence that randomization succeeded or failed; any observed differences arise by chance, and testing them can distract from design integrity. Standardized differences can describe imbalance magnitude but also should not dictate covariate inclusion mechanically. Prespecify prognostic covariates for adjusted analyses.

Report categorical variables as n (%), with explicit category order and denominator. Avoid excessive decimal places for small counts and avoid omitting zero-event safety rows without explanation. Disclosure rules may require suppression of small cells; report that suppression and do not imply the count was zero.

### Association is not a cause

A cross-tabulation is an unadjusted summary. In a cohort, the risk in exposed and unexposed groups can differ because of age, severity, or selection into exposure. In a randomized trial, the design supports a causal comparison, but missing outcomes, nonadherence, or post-randomization selection can complicate interpretation. A chi-square p-value does not correct these problems. Use the table to describe observed counts, then choose an adjusted analysis that follows the study design and causal estimand.

For common outcomes, report risk differences alongside ratios because relative effects alone can obscure absolute burden. If a table arises from case-control sampling, the sampled case fraction is fixed by design and cannot estimate disease prevalence or risk; the odds ratio may still be informative under appropriate sampling. State how participants were selected.

### Visual formats and reproducibility

For a single categorical variable, a bar chart shows counts or proportions; use bars from zero and order categories logically. For two variables, stacked or grouped bars can reveal patterns, but table counts remain important for small cells. Mosaic plots encode cell proportions by area and can show residual structure. Avoid pie charts for precise comparisons or many categories.

A reproducible table pipeline should retain raw category labels, apply a documented recoding dictionary, and calculate counts from the analysis dataset. Validate that totals match expected enrollment and that percentage sums reconcile apart from rounding. If weighted estimates are shown, label them separately from raw counts.

### Summary checklist

Before presenting a frequency table, confirm the unit (person, visit, event), time window, category definitions, denominator, missingness handling, and whether the sample or target population is described. Show counts before percentages, preserve meaningful category order, and explain weighting or suppression. These details make a simple table statistically interpretable.

### Risk, odds, and prevalence

A table can supply the components of risk and odds, but these are distinct quantities. If 20 of 100 participants have an event, risk is .20 and odds are .20/.80=.25. Comparing two groups yields a risk ratio or odds ratio; a chi-square statistic does not encode either effect measure. For common outcomes, the odds ratio can be farther from one than the risk ratio. Show absolute risks and choose a contrast relevant to clinical decisions.

A cross-sectional frequency table estimates prevalence at the observed time, not incidence. A cohort table over follow-up can estimate cumulative risk only if participants are observed over a defined horizon and censoring is handled appropriately. A case-control table sampled by outcome cannot estimate risk directly because the case fraction is fixed by design. Study design determines how counts map to population quantities.

### Categories and data management

Category definitions should be stable across sites and time. “Unknown,” “not assessed,” and “not applicable” differ; combining them may conceal process problems. For ordinal categories, preserve ordering in tables and graphs. For free-text diagnoses mapped to codes, document the crosswalk and how multiple diagnoses per person are counted. If categories are mutually exclusive only after a hierarchy is applied, state that rule.

Large administrative datasets may have duplicate people, multiple encounters, and changing coding practices. Decide whether the table counts unique people, visits, or events. When each person can appear more than once, report the unit explicitly and use clustered inference for uncertainty. Count totals are not automatically independent observations.

### Percentage rounding and small numbers

Percentages can sum to 99.9% or 100.1% due to rounding. Mention this only when needed; do not adjust a cell to force totals if it misrepresents the count. With small denominators, one participant can change a percentage substantially. Report numerator/denominator and avoid decimal precision unsupported by the sample. Privacy suppression may be necessary; explain suppressed cells and avoid reconstruction from margins.

### A report-ready example

“Among 100 participants assigned to A, 20 (20%) reported nausea by day 14; among 50 assigned to B, 10 (20%) did so. Percentages are within-arm and use all randomized participants with ascertainable outcome; 3 participants had missing nausea status and are shown separately.” This wording establishes event, time, denominator, percentage basis, and missingness. A separate inferential result can then provide risk difference and interval under the planned analysis.

### Weighted example

Suppose two sampled patients represent 10 and 100 people because their selection probabilities differ. An unweighted event proportion gives each sampled person equal influence; a weighted estimate gives the second patient much greater population representation. Weighted cell totals may be fractional and should not be described as literal people. Report raw n alongside weighted percentages and design-based intervals. Nonresponse weights can improve representation only under assumptions about response mechanisms and measured predictors.

### Testing versus description

A table can be followed by a chi-square test for independent categorical observations, Fisher’s exact test for sparse tables, or a regression model for adjustment. The descriptive table should stand on its own and not omit cells just because inferential methods change. Repeated measures, clustering, and survey designs require adapted methods. Statistical significance does not alter the observed denominator or indicate clinical importance.

### Absolute differences and precision

If 20% of arm A and 10% of arm B report an event, the absolute risk difference is 10 percentage points, whereas the risk ratio is 2.0. A frequency table supplies the raw counts; a comparative analysis supplies an interval for these measures. In small studies, one or two events can change the percentage considerably. Show denominators and avoid interpreting a crude difference without uncertainty or design context.

If outcomes are common, odds ratios can look farther from one than risk ratios. Present absolute risks to ground interpretation. For a public-health intervention, numbers affected per 1,000 may be more useful than relative changes alone.

### Table construction quality checks

Check whether each person appears once, whether categories are mutually exclusive, and whether total counts equal the target analysis set. Compare counts with enrollment logs and missing-data summaries. Verify that percentages use the intended denominator after exclusions. In longitudinal datasets, a participant may have several visits; an event table should indicate whether it counts people, events, or visits.

### Multiple response items

Some surveys allow participants to select several comorbidities or symptoms. Counts across categories then exceed the number of participants, and percentages may sum above 100%. Label the denominator as participants or responses. If multiple diagnoses are recorded per person, distinguish prevalence of people with each diagnosis from share of all diagnosis entries. Ordinary mutually exclusive frequency tables do not fit a multiple-response structure without careful definition.

### Longitudinal categorical outcomes

For repeated status such as remission at several visits, separate visit-specific tables are descriptive but do not capture within-person transitions. A transition table can show remission/persistence/relapse between adjacent visits, while McNemar or longitudinal logistic models address paired change. The observation unit and time window should be explicit. Treating each visit as an independent row overstates precision.

### Communication

Use clear row/column labels, disclose denominators, and provide count first. State whether percentages are weighted and how missing or suppressed values are handled. The table should support a reader’s calculation of the relevant risk or composition without guessing its base.

### Interpretation when groups differ in size

Do not compare raw event counts between arms of unequal size without denominators. Twenty events in 200 people is a smaller risk than 15 events in 75, despite the larger count. Conversely, percentages can obscure that a small arm has little information. Present count and within-group percentage together, then estimate an interval for the risk contrast if inference is needed.

### Reproducible table code

Use explicit factor levels and named denominators to prevent accidental reorder or percentage errors. Save the analytic population definition and missingness count with the table code. Review output manually against the study flow diagram before publication.

### Denominators for diagnostic tables

With a reference standard, a 2×2 table contains true positives, false positives, false negatives, and true negatives. Sensitivity divides true positives by all diseased participants; specificity divides true negatives by all non-diseased participants. Positive predictive value divides true positives by all test-positive participants and depends strongly on prevalence. The table should identify which axis is reference status and show all four counts. A screening sample enriched with disease cannot directly provide population predictive values without prevalence adjustment.

### Data release and suppression

When cells are small, disclosure risk may require suppression or aggregation. Suppression can make margins unrecoverable; explain which values are withheld and avoid reporting totals that permit simple subtraction. Statistical aggregation should preserve meaningful categories and avoid exposing rare conditions. Privacy choices can affect interpretation and should be documented.

For any percentage, explicitly name whether missing observations are excluded from its denominator.

### Final table interpretation

Counts and proportions are descriptive quantities, and the table’s denominator defines their meaning. For comparisons, pair the table with an effect estimate and uncertainty that reflect the study design. State whether the unit is person, visit, or event, and do not imply causality from a crude cross-tabulation. A well-labeled table is a small but important part of reproducible clinical evidence.

## References and further reading

- CDC. [Principles of Epidemiology: rates and denominators](https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section2.html).
- Agresti A. [An Introduction to Categorical Data Analysis](https://doi.org/10.1002/0470114754). Wiley.

- Greenland S, Rothman K, Lachin JM. *Modern Epidemiology*. Lippincott Williams & Wilkins.
- Agresti A. *Categorical Data Analysis*. John Wiley & Sons.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.

The *Probability* articles in this library explain the chance models behind
proportions and two-way tables.
