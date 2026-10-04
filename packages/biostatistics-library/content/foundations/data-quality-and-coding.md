---
title: Data quality and coding
summary: Coding turns raw answers into analyzable values; data quality work finds and fixes the errors, gaps and inconsistencies before any inference.
---

## Overview and key ideas

**Data coding** translates raw readings and free-text answers into structured
values: assigning numbers to response categories, mapping lab units to a
common scale, and encoding missingness deliberately. **Data quality** is the
set of checks that verify coded data are complete, consistent, plausible and
correctly recorded before any analysis. Recurring problem types:

- **Missing values** — a blank field, a missed visit, an unreturned result;
  the mechanism (random, related to the value, related to other variables)
  determines whether the missingness biases the analysis.
- **Implausible values** — blood pressure 380/240, a birth weight recorded in
  the wrong field, age 140.
- **Inconsistency** — the same patient coded "male" on one visit and "female"
  on the next.
- **Unit errors** — results in µmol/L analysed as mg/dL.

Coding and quality work are *upstream* of statistics: no test or estimate can
repair data that were coded wrong. A clean, documented coded dataset is the
precondition for trustworthy inference.

## When to use it

Coding and quality checks are applied where raw data first become the analysis
dataset — at data entry, dataset lock, and before any analysis. Scenarios:

| Setting | Example question |
| --- | --- |
| Trial database | Are the 8% of missing follow-up blood pressures missing at random, or concentrated in dropouts? |
| Lab integration | Do creatinine values from two assays sit on the same scale before pooling? |
| Survey data | Are open-text occupation answers coded consistently across 400 respondents? |
| Registry lock | Which records fail range checks (systolic > 250) — corrected, excluded, or flagged? |

In a hypertension trial, follow-up blood pressure is missing in 8% of visits.
Coding first distinguishes "not measured" from "result not available" from
"genuinely no value" — each may need different handling. Quality work then
asks whether the 8% is spread evenly across arm and visit, or concentrated in
the treatment arm's last visit, because the answer changes whether the
missingness biases the treatment comparison.

## Assumptions and limitations

- **A coded value is only as good as the coding scheme.** If the coder applied
  a Likert scale inconsistently, or sites interpreted the instrument
  differently, the numbers carry a systematic error no analysis detects.
- **Missingness mechanism is an assumption.** Imputation assumes something
  about why values are missing; "missing at random" is convenient and often
  false. If missingness depends on the value itself (very high pressures less
  likely to be recorded), imputation can bias results.
- **Range checks assume a plausible envelope.** The envelope must be set with
  clinical knowledge: too tight and real extremes are silently deleted; too
  loose and errors pass through.
- **Unit harmonisation assumes comparability.** Assay differences, reference
  intervals and calibration drift can all break the assumption that two
  sources measure the same quantity on the same scale.

The process breaks down when data are locked before checks are complete, when
the raw record is no longer available to resolve a discrepancy, or when
coding is left to a single untrained person without a documented scheme.

### Missingness mechanisms and sensitivity analysis

MCAR means missingness is unrelated to observed or unobserved data; MAR means
it may depend on observed information after conditioning on variables in the
analysis; MNAR allows dependence on the unobserved value itself. These are
assumptions about the missingness process and cannot generally be diagnosed
from observed data alone. Compare missingness by arm, site, visit and measured
prognostic factors. Multiple imputation under MAR should include outcome
predictors, auxiliary variables and design features, and conclusions should
be tested under plausible departures from MAR. A missingness indicator is not
generally a substitute for modelling missingness.

## Worked example

A trial database holds 2,400 blood-pressure readings. Quality checks find 192
readings (8.0%) with a missing diastolic value, 6 with systolic > 250, and 11
records whose sex code changed between visits. The team traces the 192 to a
device batch that failed to store diastolic values — *systematic*,
device-related missingness, not random. They correct the 6 extreme readings
against source monitors (4 transcription errors corrected; 2 genuine crises
retained and flagged) and resolve the 11 sex inconsistencies from source
records (all data-entry slips).

Because the missing values concentrate in one device batch rather than
scattering randomly, the analysis plan is updated: the primary analysis uses
readings from unaffected devices, with a sensitivity analysis including
imputed values. The *pattern* of the missingness — discovered only by quality
work — determined a change in analytic strategy, not just a cleaning footnote.

## Interpretation and common pitfalls

- **Treating all missing values as one thing.** "Not measured", "refused" and
  "lost to follow-up" have different implications; coding them into a single
  blank hides the mechanism that matters most.
- **Correcting by deletion without documentation.** Silently removing
  implausible values without a log makes the analysis unreproducible and can
  bias results if the removed values were not random.
- **Assuming missing at random.** Imputing under MAR when missingness depends
  on the unobserved value (MNAR) produces biased estimates that look more
  precise, not less.
- **Locking the dataset before quality work is done.** Once locked,
  discrepancies can only be handled analytically, not corrected at source —
  the far more expensive path.

## A reproducible data-quality workflow

A robust workflow separates source data, cleaned data, and analysis-ready variables. Preserve immutable raw exports with checksums and access controls. Apply documented transformations in code, never overwrite the source, and create a log containing record identifier, original value, action, reason, date, and responsible reviewer. Define permissible values before looking at outcome associations where possible. Automated checks should flag records for human adjudication rather than silently deleting inconvenient observations.

Data validation has several layers. Syntactic checks identify impossible formats and values outside allowed ranges. Semantic checks identify conflicts such as a procedure date preceding birth or a discharge date before admission. Cross-field checks identify logic violations, such as pregnancy recorded in an impossible age range, while allowing clinically plausible exceptions to be reviewed. Temporal checks detect duplicate visits, unexpected gaps, and values carried forward. Provenance checks record source instrument, device, site, units, and software version. A value can pass a range check and still be wrong, so high-impact records should be traceable to source.

Missing-data coding should preserve why a value is absent. A single NA cannot distinguish not assessed, refused, not applicable, lost record, or below detection limit. In R, use explicit reason variables or structured codes that are converted to NA only at the analysis step. Missingness summaries should use the expected denominator at each visit and stratify by arm, site, time, and relevant baseline characteristics. MAR and MNAR are assumptions about unobserved data and cannot generally be established by a significance test on observed values.

### Worked example: audit and unit conversion

Suppose an imported laboratory table contains creatinine values in mixed units, with source units recorded. Convert µmol/L to mg/dL using approximately 88.4 µmol/L per mg/dL. A source value of 106 µmol/L becomes 106/88.4=1.20 mg/dL. Do not infer units from the magnitude alone: some values overlap plausible ranges. Validate conversion against source documentation and retain the raw number and unit.

```r
library(dplyr)
lab_clean <- lab_raw |>
  mutate(creatinine_mg_dl = case_when(
    unit == "mg/dL" ~ value,
    unit == "umol/L" ~ value / 88.4,
    TRUE ~ NA_real_
  ),
  unit_unrecognized = !unit %in% c("mg/dL", "umol/L"))

lab_clean |>
  summarise(n = n(), n_missing = sum(is.na(creatinine_mg_dl)),
            n_unknown_unit = sum(unit_unrecognized))
```

This conversion assumes the documented units are accurate and the analytes and assay conventions are comparable. It does not harmonize assay calibration, specimen timing, or method-specific bias. Unknown units should trigger source review, not an arbitrary conversion.

### Missingness and sensitivity analyses

Under MCAR, missingness is independent of measured and unmeasured values; under MAR, it can depend on observed data conditional on variables in the model; under MNAR it also depends on unobserved values. These labels are useful because they clarify assumptions, not because a dataset can certify one. Multiple imputation under MAR should include the outcome, treatment, predictors of missingness, auxiliary variables, and design structure; the imputation and analysis models should be compatible. Sensitivity analyses can shift imputed values or use pattern-mixture/delta adjustments to show how conclusions change under plausible MNAR departures. The ICH E9(R1) estimand framework helps align missing-data strategies with the treatment effect question.

Never “clean” by excluding outliers solely because they change a result. Verify against source where possible; otherwise retain, flag, and compare robust or sensitivity analyses. Document every derived variable and denominator. A clean dataset is one whose transformations and uncertainties are transparent, not one from which all inconvenient records have disappeared.


## Validation rules, provenance, and adjudication

Quality controls work best when they are layered and tied to a data-generating process. At entry, use range and format constraints for values that can be known in advance, such as valid dates and enumerated responses. After collection, run cross-field checks (for example, a specimen date outside the participant's follow-up period) and longitudinal checks (unexpected duplicate visits, impossible order, or an unexplained unit change). A validation rule should flag a record with enough context for review, not automatically overwrite it. Legitimate exceptions need a route to be retained with a reason.

Use a query lifecycle: identify the record and rule, request source review, record the response and evidence, resolve or retain as an exception, and preserve the audit trail. For derived corrections, store the raw value and the corrected value as separate fields. If a query cannot be resolved, define whether the value is missing, flagged, or included with sensitivity analysis. The person reviewing outcomes should not selectively correct values based on whether they support a preferred hypothesis.

### Worked example: reconcile duplicate and implausible records

Suppose one participant has two systolic readings recorded at the same visit: 128 and 218 mmHg. A naive de-duplication rule that keeps the last row may either discard the correct reading or retain a transcription error. First inspect timestamps, device identifier, repeat-measurement protocol, and source chart. If 218 is a confirmed repeat after an initially high pressure, both readings may be valid; if 218 is a misplaced digit and source documents 128, correct it with provenance. The analytic rule might prespecify using the mean of the last two valid readings, but that rule must not be invented after looking at the treatment contrast.

```r
# Flag possible duplicate visits without deleting them
flags <- dat |>
  dplyr::group_by(id, visit_date) |>
  dplyr::mutate(n_same_visit = dplyr::n(),
                duplicate_visit = n_same_visit > 1,
                sbp_outside_review_range = sbp < 50 | sbp > 250) |>
  dplyr::ungroup()

review_queue <- flags |>
  dplyr::filter(duplicate_visit | sbp_outside_review_range) |>
  dplyr::select(id, visit_date, sbp, device, source, dplyr::everything())
```

The range 50–250 here is an illustrative review threshold, not a universal physiologic boundary. Site and device protocols may justify different values. Extreme values should be retained if clinically real; implausibility is a query trigger, not a deletion criterion.

## Reproducible cleaning and provenance

Represent cleaning as a sequence of executable transformations. Write checks that fail loudly when a supposedly unique key is duplicated, units are unknown, or a date precedes baseline. Version-control code and data dictionaries; record source export date, extract filters, package versions, and any manual adjudication file. Keep manual decisions in a structured table joined by stable identifiers rather than editing spreadsheets in place. An independent reviewer should be able to rerun the script and obtain the same analysis dataset.

Data lineage matters when variables are derived from several sources. Define precedence rules for conflicting records, such as central laboratory versus local laboratory, and define temporal windows for baseline and outcome measurements. If a unit conversion or code mapping changes, quantify how many records were affected and whether results change. Data quality reports should summarize checks run, flags, resolutions, and unresolved issues without exposing identifiable data.

## Missingness and analysis consequences

Distinguish structural absence from a failed observation. “Not applicable” is not equivalent to an unmeasured eligible value. A value below assay detection is interval-censored information, not necessarily zero; a value above an upper limit likewise carries partial information. Depending on the estimand, approaches include censored-likelihood models, multiple imputation, or sensitivity bounds. Avoid substituting the detection limit divided by two automatically; this can bias means, variances, and regression slopes, particularly when censoring is substantial.

For multiple imputation, preserve the form of variables, include predictors of missingness and outcome, and respect clustering or repeated measures. Diagnostics should compare observed and imputed distributions by treatment arm and relevant strata. Imputation uncertainty is combined across completed datasets using within- and between-imputation variance; treating a single completed dataset as observed understates uncertainty. MNAR sensitivity analyses should vary assumptions in clinically interpretable units, such as shifting unobserved outcomes by a specified amount.

The database lock process should include a final reconciliation against the protocol-defined analysis population, outcome derivations, and planned handling of intercurrent events. A locked dataset remains immutable; corrections create a new version with a documented reason. This discipline makes later corrections possible without obscuring which dataset produced each result.

## Data checks as executable specifications

A data dictionary should define variable name, concept, type, allowable values, units, derivation, missingness codes, and source. A validation script can encode these definitions so that a new data extract is checked identically. Separate warning-level checks from hard failures: a date outside a plausible period may be a site-specific exception, while a duplicate participant key may prevent analysis. Record the check version and summary counts each time the pipeline runs.

```r
stopifnot(!anyDuplicated(dat$record_id))
stopifnot(all(dat$arm %in% c("control", "active", NA)))
range_flags <- dat |>
  dplyr::filter(!is.na(age) & (age < 0 | age > 120))
missing_by_arm <- dat |>
  dplyr::group_by(arm) |>
  dplyr::summarise(n = dplyr::n(),
                   missing_outcome = sum(is.na(outcome)),
                   .groups = "drop")
```

The age bound and categories here are illustrative; project-specific definitions belong in the data dictionary. A failed assertion should stop or clearly flag the pipeline rather than silently coerce values. Protect participant identifiers in exported quality reports.

## Auditing changes and reproducibility

For each cleaning decision, preserve before/after counts and compare important summaries. If a unit conversion changes, calculate the number of affected rows and inspect distributions by site and date. If a recoding changes category definitions, rerun primary and sensitivity analyses under both plausible mappings. The final analysis dataset should be generated from raw inputs with a single documented command where feasible. Store software and package versions and use a fixed random seed for stochastic procedures such as imputation, while recognizing that a seed does not substitute for code and data provenance.

Quality assurance should continue after publication. Corrections to source data or code should produce a new version, a clear changelog, and, if conclusions change, a transparent correction to the report. Keep identifiable data in governed systems and share only deidentified or synthetic examples. A reproducible pipeline is both an analytic safeguard and a record of accountability.

A useful final audit compares the analysis dataset to the protocol: eligible participant counts, randomized arms, visit windows, endpoint derivations, exclusions, and follow-up completeness. Reconcile discrepancies before interpreting treatment effects. Document whether corrections occurred before or after treatment labels were unblinded, because outcome-aware cleaning can introduce bias. Independent blinded adjudication is valuable for ambiguous outcomes and supports a defensible record of how raw data became evidence.

Data-quality review also includes privacy and governance. Use minimum necessary fields, separate identifiers from analysis variables, restrict access by role, and log exports. Deidentification is not simply dropping names: rare diagnoses, dates, and combinations of attributes can reidentify individuals. Synthetic data can support code examples but should be labeled and checked so readers do not mistake it for observed evidence. Quality and privacy protections are complementary parts of trustworthy analysis.

## Freeze definitions before evaluating effects

Define primary outcomes, time windows, covariate derivations, and outlier review procedures without reference to treatment differences whenever possible. If an ambiguous definition must be resolved after seeing data, document the rationale and conduct sensitivity analyses under alternative defensible choices. Data cleaning and analysis are not separate in their consequences: changing a threshold, missing-value rule, or unit mapping can change the estimand and the estimated effect. Transparent records make those decisions reviewable.

## References and further reading

- Sterne JAC et al. [Multiple imputation for missing data in epidemiological and clinical research](https://doi.org/10.1136/bmj.b2393). *BMJ*. 2009.
- ICH. [E9(R1): Estimands and sensitivity analysis in clinical trials](https://database.ich.org/sites/default/files/E9-R1_Step4_Guideline_2019_1203.pdf).

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland JM, Altman DG. *Statistics with Confidence*. BMJ Books.
- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott
  Williams & Wilkins.
- ICH E9(R1) gives guidance on aligning missing-data sensitivity analyses
  with the treatment effect of interest.
