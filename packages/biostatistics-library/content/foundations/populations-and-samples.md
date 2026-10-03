---
title: Populations and samples
summary: The population is the group you want to know about; the sample is what you can actually measure, and the link between them is sampling.
---

## Overview and key ideas

A **population** is the complete set of individuals or events about which you
want to draw conclusions; a **sample** is the subset you actually observe.
Statistics exists because populations are almost never measurable in full, so
we measure a sample and infer the population quantity from it. Three concepts
link the two:

- **Sampling frame** — the list or mechanism that defines who could enter the
  sample (e.g. the hospital's admissions register for the year).
- **Probability sampling** — every member of the frame has a known, non-zero
  chance of selection; this is what makes valid population inference possible.
- **Non-probability sampling** — convenience samples (patients seen on a ward
  round). Useful for pilot work, but inference to a wider population rests on
  how typical the sample is.

Precision improves with sample size, but no sample size fixes a sampling
mechanism that systematically excludes part of the population.

## When to use it

Defining population, frame and sampling scheme is a design-stage task.
Typical scenarios:

| Setting | Example question |
| --- | --- |
| Surveillance | What is the central-line bloodstream infection rate in all ICU admissions this year? |
| Cohort study | Among all patients newly diagnosed with type 2 diabetes, what is the 5-year risk of retinopathy? |
| Clinical trial | Which population do the results apply to — those randomised, those who took the drug, or all patients like them? |
| Quality audit | Do 60 consecutive knee replacements represent the year's caseload, or only consenting surgeons? |

In the surveillance example the population is "all ICU admissions to our
hospital this year", the frame is the admissions register, and 100% capture
makes it a census — a reminder that census and sample are roles, not
properties of data.

## Assumptions and limitations

Inference from a sample to a population rests on two assumptions:

- **Representativeness** — the sampling mechanism does not systematically
  exclude or over-represent subgroups; a frame covering only telephone-triage
  admissions under-represents the sickest patients.
- **Non-selective errors** — mistakes in who is sampled or how they are
  counted do not correlate with the outcome being measured.

The method breaks down when non-participation is selective: an audit whose
response rate falls from 90% to 40% over the year is not sampling the same
population at both points. Missing data within the sample is a second,
separate problem, but it compounds the first — the effective sample may differ
from the sample in exactly the way the population question cares about.

## Worked example

A hospital wants the infection rate among all 1,420 ICU admissions in a year.
Auditing every chart is infeasible, so the team randomly selects 100 charts
and finds central-line bloodstream infection in 7 of them: a point estimate of
7.0%. Treating the selection as a simple random sample, the standard error is
sqrt(p(1-p)/n) = sqrt(0.07 × 0.93 / 100) ≈ 0.026, so a 95% confidence
interval is roughly 7.0% ± 1.96 × 2.6% — about 2% to 12%.

The interval is wide because of the modest sample size, not a flaw in the
logic: with n = 100, a 7% rate is imprecisely estimated, and the honest
conclusion is that the true rate plausibly lies in the 2–12% range, subject to
the assumption that the register frame covers all ICU admissions.

## Interpretation and common pitfalls

- **Reporting the sample, silently claiming the population.** If 100 charts
  were randomly sampled from a frame of 1,420, the rate applies to the frame —
  but only if the frame is complete. State frame and population separately.
- **Conflating non-response with random error.** If 30 of 100 charts could
  not be obtained and missingness correlates with severity, the effective
  sample is no longer the random sample.
- **Extrapolating across settings.** A rate estimated at one hospital cannot
  be generalised to "all hospitals" by statistics alone; that is a multi-centre
  design question, not arithmetic.
- **Choosing the sample size after seeing the data.** Power is a planning
  concept; a post-hoc "we only had 40 patients" does not become a design
  decision.

## References and further reading

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and
  Other Advanced Topics*. Brooks/Cole.
- Bland JM, Altman DG. *Statistics with Confidence*. BMJ Books.
- The topic map's *Sampling and study design* section covers probability
  sampling methods in detail (article planned).
