---
title: Scales of measurement
summary: Nominal, ordinal, interval and ratio scales describe how much structure a variable carries, and the structure fixes which operations are valid.
---

## Overview and key ideas

The **scale of measurement** classifies a variable by the structure its values
carry, in four ascending levels:

- **Nominal** — categories with no order (blood group, sex, hospital site).
  Summarise with counts and proportions; models can use indicator variables
  without implying a numeric order.
- **Ordinal** — ordered categories with unequal or unknown spacing (NYHA
  class I–IV, pain mild/moderate/severe). Ranking is valid; arithmetic is not.
- **Interval** — ordered, equal-spaced values with no true zero (Celsius
  temperature, IQ, dates). Differences are meaningful; ratios are not (20°C
  is not twice as hot as 10°C).
- **Ratio** — interval plus a true zero, so ratios are meaningful (weight,
  blood pressure, concentrations, durations, counts).

The level is not a property of the quantity but of the *scale chosen to record
it*: weight is a ratio scale in kilograms but ordinal if recorded only as
"underweight / normal / overweight". The recorded scale is the ceiling on the
analyses you can legitimately do — ratio-scale information cannot be recovered
from a coarser record.

## When to use it

Scale of measurement is fixed when the instrument is designed, because it
decides which statistics and tests are admissible. Typical scenarios:

| Setting | Example question |
| --- | --- |
| Heart-failure clinic | Patients are graded NYHA I–IV (ordinal) and weighed (ratio); which summaries are valid for each? |
| Quality survey | Staff rate communication "poor/fair/good/excellent" (ordinal) — can we compute a mean? |
| Lab reference interval | Serum creatinine is ratio-scale, supporting both mean and coefficient of variation. |
| Trial endpoint | Time to first event (ratio, survival analysis) versus "event by 90 days" (nominal) — a design choice, not a technicality. |

In a heart-failure clinic, NYHA class is ordinal: class III is worse than II,
but the "distance" II→III need not equal III→IV. Weight is ratio-scale: a 70
kg patient really weighs twice a 35 kg patient, so ratios and geometric means
are legitimate. The same patient, measured on scales of different richness,
supports different analyses.

## Assumptions and limitations

- **The recorded scale is a ceiling, not a floor.** Once a continuous
  measurement is collapsed into categories, the finer information is gone.
  Record at the finest defensible scale and bin only at analysis time, if ever.
- **Interval scales lack a true zero.** For Celsius, "10 degrees higher" is
  meaningful but "twice as warm" is not; ratio-based operations (coefficients
  of variation, relative changes) should be avoided on interval data.
- **Ordinal spacing is unknown.** Treating Likert or NYHA scores as
  equally-spaced numbers is a modelling assumption that should be stated, not
  assumed.
- **Some "categorical" data are interval in disguise.** Recording time-of-day
  as "morning/afternoon/evening" throws away interval structure that could
  support time-based analysis.

The classification breaks down for variables measured on different scales in
different contexts (a date is interval; a duration is ratio) and for hybrid
instruments, where the scale is assigned per item rather than per
questionnaire.

## Worked example

A heart-failure clinic records, for 120 patients, NYHA class (ordinal), body
weight (ratio) and serum sodium concentration (ratio). NYHA class III is the
mode (45 patients, 37.5%); the class distribution is best summarised by the
mode and the proportion in III–IV. Median weight is 78 kg (IQR 70–86); a
geometric mean is meaningful for positive values when a multiplicative summary
is useful. Serum sodium has a mean of 138 mmol/L (SD 3.1); concentration has a
meaningful zero, so ratios are defined, though the coefficient of variation is
not necessarily the clinically most useful summary.

The point: the same 120 patients support a mode and proportions for the
ordinal variable and medians and IQR (or means and SDs if roughly symmetric)
for numeric variables. The recorded scale constrains interpretation, but it
does not alone dictate a statistical method: distribution, design, estimand
and model assumptions matter too.

## Interpretation and common pitfalls

- **Computing a mean on ordinal data and reporting it as a "score".** A mean
  of 2.4 on a 1–4 NYHA scale implies equal spacing; report proportions by
  class or the median unless the spacing assumption is defensible.
- **Confusing the quantity with the scale.** Sodium is intrinsically a ratio
  quantity, but if the lab only reports "normal/low/high" the recorded scale
  is nominal and only counts are valid.
- **Taking ratios on interval data.** "Sodium changed by a factor of two" or
  "Celsius temperature doubled" misuses a scale with no true zero.
- **Binning at data entry.** Recording a continuous lab value as
  "above/below the reference range" in the form makes later continuous
  analysis impossible even if the raw value existed in the lab report.

## References and further reading

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland JM, Altman DG. *Statistics with Confidence*. BMJ Books.
- Agresti A. *Categorical Data Analysis*. Wiley.
- The *Describing data* articles in this library pair scales with appropriate
  summaries and plots.
