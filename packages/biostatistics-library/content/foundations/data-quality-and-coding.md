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

## References and further reading

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland JM, Altman DG. *Statistics with Confidence*. BMJ Books.
- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott
  Williams & Wilkins.
- The topic map's *Missing data* section covers imputation methods and the
  missingness mechanisms in depth (article planned).
