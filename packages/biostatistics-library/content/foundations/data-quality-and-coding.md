---
title: Data quality and coding
summary: Coding turns raw answers into analyzable values; data quality work finds and fixes the errors, gaps and inconsistencies before any inference.
---

## Overview

Data quality is the degree to which recorded information is fit for a defined analysis and decision. It is not a permanent property of a dataset: values adequate for estimating a hospital’s annual admission count may be inadequate for evaluating treatment timing or predicting deterioration hours in advance. Quality therefore begins with the question and the data-generating process, not with a universal checklist of “clean” values.

Cleaning can prevent coding and measurement errors from contaminating an analysis, but it can also introduce bias if decisions are made after seeing outcomes or if inconvenient observations are silently removed. A defensible workflow makes definitions explicit, checks source data, records transformations, and preserves a path from reported result back to the original record. Automated rules help, but clinical review remains necessary for ambiguous values.

## Start with provenance and a data map

Before analysis, determine where each field came from, when it was recorded, who entered it, and how it was transformed before delivery. Electronic health records may combine manually entered notes, device readings, billing codes, and derived problem lists. The same field name can conceal different meanings across sites or versions. A data dictionary should document names, definitions, units, allowable values, collection time, missing-value codes, derivations, and changes over time.

Define the analysis unit. A file with 30,000 rows may represent 10,000 people with repeated visits, not 30,000 independent participants. Identify patient, encounter, specimen, and site keys, and document how duplicates are resolved. A duplicate encounter may be a data error, a legitimate repeat record, or a consequence of joining one-to-many tables. Removing duplicate rows blindly can erase real information; failing to resolve duplicated joins can inflate denominators.

Build a lineage from source to analysis dataset: source extracts and dates, inclusion criteria, linkage steps, recodes, exclusions, imputations, and derived variables. Version-control code and data dictionaries; keep immutable raw input where governance permits. Never overwrite raw fields with cleaned values. Store corrected values alongside original values and a reason code so reviewers can audit what changed.

## Validation rules as executable definitions

A validation rule states a property expected from the data. Rules can include permissible ranges, category membership, cross-field consistency, temporal order, uniqueness, and requiredness. For example, a birth date should precede an encounter date; systolic pressure should be positive and within a plausibility range; treatment assignment must be one of the protocol arms; a discharge date should not precede admission. Distinguish hard failures from soft warnings: an impossible date may require correction, while an unusual laboratory value may be clinically valid and should trigger review rather than deletion.

Rules should be derived from protocols, instrument manuals, clinical logic, and data contracts. A biologically implausible value may be a unit-conversion error, a transcription error, or a rare true observation. Flag it with source context and adjudicate using a prespecified approach. Winsorizing extreme values because they change a p-value is not data cleaning; it changes the estimand and can suppress valid tails.

An executable check makes assumptions testable and repeatable. In R, `stopifnot()` can enforce required fields, while packages such as `validate` or `pointblank` can return a report of failing records. Checks should be rerun after every import and transformation. Store counts of records passing, failing, corrected, excluded, and unresolved. A table of violations by site or time can reveal a systematic interface problem that a pooled check would hide.

```r
library(dplyr)
checks <- dat |>
  mutate(
    bad_date = encounter_date < birth_date,
    bad_sbp = !is.na(sbp) & (sbp < 40 | sbp > 300),
    bad_group = !assignment %in% c("usual care", "intervention")
  )
checks |>
  summarise(across(starts_with("bad_"), ~ sum(.x, na.rm = TRUE)))
```

These ranges are illustrative only; actual plausibility limits must fit the instrument and population. This code flags values but does not decide whether they are errors. Keep row identifiers and source details for review without printing direct identifiers into reports or logs.

## A worked example: unit harmonization before analysis

Suppose one laboratory reports creatinine in µmol/L and another in mg/dL, but the merged field is called `creatinine` with no unit column. A site difference in the numerical values may appear to be a patient difference. If the conversion factor is 88.4 µmol/L per mg/dL, a value of 1.0 mg/dL corresponds to about 88.4 µmol/L. Pooling unconverted values can distort distributions, risk scores, and regression coefficients by orders of magnitude.

The correct workflow is to retrieve site-specific metadata, preserve the source measurement, convert to a common unit, and verify the converted distribution against clinically plausible ranges. Then compare site and time patterns before and after harmonization. If conversion status cannot be determined for a subset, mark those values as unresolved and conduct sensitivity analyses rather than guessing based on outcome association. A useful audit table includes original value, original unit, converted value, conversion rule, source site, and rule version.

```r
dat <- dat |>
  mutate(creatinine_umol_l = case_when(
    creatinine_unit == "mg/dL" ~ creatinine * 88.4,
    creatinine_unit == "umol/L" ~ creatinine,
    TRUE ~ NA_real_
  ))
```

Do not rely on this code unless the unit labels are trustworthy and all valid units are represented. A missing or malformed unit should remain visible as a data-quality issue. After transformation, verify row counts and summarize by site, calendar period, and original unit. Unexpected shifts may reveal a faulty factor or a changed assay.

## Missing values have meanings and mechanisms

A blank cell can mean not collected, not applicable, refused, unknown, below detection, or lost in linkage. Collapsing these states into one `NA` may be unavoidable in analysis, but retain reason codes where possible. A zero is an observed value and should not serve as a missing code. Values such as 999 or −1 used as sentinels must be recoded only after confirming their meaning; otherwise legitimate measurements may be overwritten.

Describe missingness by variable, participant group, site, and time. A missingness map can reveal patterns: baseline covariates absent for one site may signal extraction failure, while follow-up values absent after treatment discontinuation may reflect clinical processes. Missing completely at random, missing at random conditional on observed variables, and missing not at random describe assumptions about why values are missing. They are not diagnoses that software can infer conclusively.

Complete-case analysis changes the effective sample and can bias estimates. Multiple imputation may be appropriate under a plausible missing-at-random model that includes outcome, treatment, design variables, predictors of missingness, and useful auxiliary variables. Imputation should respect data type and structure, such as bounded scores, clusters, repeated measures, and interactions. Sensitivity analyses should assess departures from the imputation assumptions. Imputation cannot recover information never measured or guarantee unbiasedness under an untestable missing-not-at-random process.

For example, if a 12-week outcome is missing more often among patients who experienced side effects, comparing observed outcomes may make treatment appear safer or more effective than it is. Report missing counts per arm and reasons, compare baseline characteristics where informative, and explore clinically plausible outcomes for missing participants. A flow diagram should reconcile randomized, treated, followed, and analyzed denominators.

## Coding and derivation should preserve meaning

Categorical coding should use stable labels and explicit mappings. Verify spelling variants, capitalization, deprecated codes, and combinations that indicate multiple conditions. Do not merge categories solely to make a model converge without stating how the grouping changes interpretation. For ordinal variables, preserve ordering in metadata; software may otherwise sort categories alphabetically.

Derived variables need documented formulae and timing. Age at enrollment differs from age at outcome; baseline BMI differs from maximum BMI during follow-up. A “prior admission” variable should use only events before the prediction or treatment index date. Use date-aware logic to prevent future data from leaking into baseline predictors. A derived indicator should be checked against source values for a sample of records and its missingness pattern examined.

Data linkage creates additional quality questions. Deterministic matching may miss records when identifiers are incomplete; probabilistic matching can create false links. Assess linkage rate by subgroup and validate a sample of matched and unmatched pairs where allowed. If linkage quality differs by exposure or outcome, resulting estimates may be biased. Report linkage methods, match thresholds, and uncertainty or error assessment.

## Prevent information leakage in prediction work

For predictive models, quality checks must respect the time the prediction is intended to be made. A laboratory result recorded after deterioration, a billing code added after diagnosis, or an intervention triggered by early warning signs can encode future information. Splitting data after these variables are constructed may not remove leakage. Define an index time, enforce feature availability before it, and recreate all preprocessing within each training fold.

Leakage also arises from patient overlap across train and test data, site identifiers that reveal outcomes, target-derived encodings, or imputation and scaling performed before splitting. A pipeline should learn transformations from training data alone and apply them unchanged to validation data. For deployment, monitor shifts in missingness and coding because process changes can invalidate the learned patterns even if the raw variable names remain the same.

## Auditing corrections and exclusions

Every correction should have a reason, rule, date, and responsible process. Distinguish automatic recoding (such as converting documented units) from adjudication (reviewing a conflicting record) and exclusion (removing an observation from an analysis). The primary analysis population should be defined independently of outcome results where possible. Maintain an exclusion log with counts and reasons, and verify that analytic denominators reconcile with source totals.

Sensitivity analyses should examine consequential cleaning choices: alternative plausible unit conversions, exclusion versus retention of flagged extreme values, different duplicate-resolution rules, and missing-data methods. These analyses are not a license to select the result that looks best. They show readers whether the conclusion depends on a defensible but uncertain data decision.

A reproducible pipeline should fail loudly when expected columns disappear, categories change unexpectedly, or row counts shift beyond a specified range. At the same time, the pipeline should not silently delete unusual records to pass a check. Route warnings to a documented review and maintain a human-readable report. Raw data access and corrections must follow privacy, security, and institutional governance requirements.

## Reporting quality so readers can judge it

Describe the source systems, collection dates, eligibility, linkage, variable definitions, transformations, missingness, and quality checks relevant to the analysis. Give counts before and after cleaning and explain material corrections or exclusions. For prediction studies, describe when predictors were measured relative to the outcome and how preprocessing was nested within validation. For clinical comparisons, explain whether data-quality procedures were blind to treatment and outcome where possible.

A statement such as “data were cleaned” is not reproducible. A useful description might say that duplicate encounters were identified using patient and visit identifiers, retained only when they represented distinct visits, units were harmonized from site metadata, impossible dates were queried against source records, and unresolved measurements were treated as missing with a sensitivity analysis. This enables another team to assess whether the rules are valid for the scientific question.


## Reconcile records across tables and time

Relational data often contain one row per person in a demographic table, one row per encounter, and multiple rows per laboratory result. Joining these tables can multiply observations. If each of 100 patients has two diagnoses and three laboratory results, a careless join may create six rows per patient. Counts and standard errors then become wrong even though every value is individually valid. Before merging, state the expected key for each table, test uniqueness, and verify row counts and denominators after the join.

A safe merge reports unmatched keys on both sides and checks expected cardinality. One-to-one and many-to-one joins should preserve the primary table’s row count; a one-to-many join should increase it in a predictable way. Inspect patients with unusually high numbers of encounters or measurements, which may be data duplication or genuinely intensive care. Never use `distinct()` as a universal repair because it can hide the join error without restoring the intended unit.

Longitudinal data also require temporal validation. Confirm that baseline measurements precede treatment assignment, outcome dates fall within follow-up, and repeated measures have plausible sequences. Daylight-saving changes, timezone conversion, date-only fields, and delayed chart entry can make timestamps appear out of order. Distinguish event time from documentation time. For predictive analyses, the latter may be the only operationally available time and can differ from when the clinical event occurred.

## Data quality in routinely collected health records

Routine records are generated for care, payment, and operations rather than solely for research. A diagnosis code may document reimbursement or suspected disease, not a validated case definition. A missing medication field may mean no prescription, external pharmacy use, or an incomplete reconciliation. Validation against chart review, registry data, or clinical criteria may be needed, with sensitivity and specificity evaluated in relevant subgroups.

Changes in workflow can create artificial trends. A new electronic order set may increase recording of a symptom; a coding transition may split one category into several; a hospital merger may change patient identifiers. Plot variable frequency and missingness by site and calendar time. Annotate known system changes and consider restricting or stratifying analyses when measurements are not comparable. Statistical adjustment for calendar time cannot recover information if the outcome definition itself changed.

A validation subsample should be selected to represent the range of records and, where relevant, groups likely to differ in accuracy. Reviewing only obvious positive cases estimates positive predictive value but not sensitivity. Reviewers should be blinded to exposure when feasible, and adjudication disagreements documented. If a gold standard is imperfect, state that limitation and consider latent-class or probabilistic approaches only when assumptions and data support them.

## Metadata, privacy, and reproducible stewardship

Data dictionaries and provenance logs should avoid embedding direct identifiers in shared code or reports. Use study-specific keys, restrict access by role, and keep linkage files separately under approved governance. Small cell counts and rare combinations can identify people even after names are removed; suppress, aggregate, or use controlled access as appropriate. Reproducibility does not mean unrestricted publication of sensitive data.

Record software versions, code commits, extraction dates, and data-source updates. A result can change because the EHR backfilled encounters, not because the model changed. For each release, capture a frozen analytic snapshot or reproducible query, a checksum where permitted, and a changelog describing schema or logic changes. If upstream data cannot be frozen, log the query parameters and extract metadata and note that exact reconstruction may not be possible.

Automated monitoring can track expected ranges, category frequencies, missingness, duplicates, and linkage rates. Set thresholds based on process knowledge, not arbitrary statistical rules alone. A sudden rise in missing laboratory values should trigger investigation; a valid seasonal shift should not automatically stop a pipeline. Assign an owner to each check and a documented resolution path so warnings do not become ignored noise.

## Distinguish correction from analytic choice

A confirmed transcription error can be corrected from a source record. Choosing how to handle a clinically implausible but unresolved value is an analytic decision. Imputing a value, excluding a person, or truncating an extreme affects the target and should be prespecified or transparently justified. When possible, preserve an indicator that a value was queried or corrected and assess whether the correction differs by arm, site, or outcome.

Suppose a participant’s weight is recorded as 820 kg. It is almost certainly a misplaced decimal, but the true value could be 82.0, 82.0 in another unit, or a different patient’s data. If source verification is impossible, replacing it with 82.0 invents information. Flag it, describe the rule, and compare analyses with the value missing versus plausible alternatives. The uncertainty is data uncertainty, not ordinary sampling error.

Similarly, an extreme biomarker result may be clinically real and prognostically important. A robust estimator can reduce its influence without deleting it, but changes the target summary. Report the distribution and rationale for robust methods. Sensitivity analysis should show whether conclusions depend on the point, and clinical consultation can help distinguish biological extremity from recording error.

## A compact implementation checklist

Before analysis, confirm that the research question and unit of analysis are defined; source, timing, and coding for each key variable are documented; joins preserve expected records; identifiers and duplicates are resolved with explicit rules; and units and category mappings are harmonized. Summarize missingness and its reasons, validate date sequences and plausible ranges, and preserve raw values and transformations.

During analysis, prevent future information from entering predictors, apply data-adaptive preprocessing only within training partitions, and retain design variables for variance estimation. Record exclusions and corrections, investigate warnings by site and time, and keep the primary decisions separate from exploratory sensitivity analyses. At handoff, publish a data dictionary, code and software versions, validation summary, analytic flow, and explanation of unresolved quality limitations.

## References and further reading

- Sterne JAC et al. [Multiple imputation for missing data in epidemiological and clinical research](https://doi.org/10.1136/bmj.b2393). *BMJ*. 2009.
- ICH. [E9(R1): Estimands and sensitivity analysis in clinical trials](https://database.ich.org/sites/default/files/E9-R1_Step4_Guideline_2019_1203.pdf).
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland JM, Altman DG. *Statistics with Confidence*. BMJ Books.
- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott Williams & Wilkins.
