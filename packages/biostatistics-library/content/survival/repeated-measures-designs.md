---
title: Repeated-measures designs
summary: Study designs where the same subjects are measured several times, and why simple t-tests fail on such data.
---

## Overview and key ideas

A **repeated-measures design** observes the same subject on multiple occasions:
before and after a treatment, at clinic visits, or at fixed intervals. The
defining feature is that observations from the same person are **correlated** —
a patient's diastolic blood pressure at visit 2 carries information about visit
1 — while observations from different people are independent. This within-
subject correlation violates the independence assumption of ordinary t-tests
and ANOVA.

Two related designs matter. In a **within-subject (crossover or pre-post)**
design, every subject receives all conditions, acting as their own control
for greater precision. In a **parallel-group longitudinal** design,
different subjects receive different treatments and are followed over time,
combining a between-subject factor with a repeated time factor. The analysis
problem in both is the same: model the mean response as a function of time and
treatment while accounting for the covariance structure of the repeated
observations.

## When to use it

| Setting | Example question |
| --- | --- |
| Clinical trial | Does a new antihypertensive lower blood pressure more than placebo across 12 weeks of follow-up? |
| Paediatrics | How does lung function change with age, and does inhaled therapy modify that trajectory? |
| Rehabilitation | Does physiotherapy improve pain scores from baseline through six weeks? |

Repeated measures are most valuable when between-subject variability is large but each
subject is stable — comparing the same person across conditions beats comparing different patients.

## Assumptions and limitations

- **Sphericity** (or its generalisation, compound symmetry): in repeated
  measures ANOVA, the variances of the pairwise differences between time
  points must be equal; real longitudinal data often violate this, and the
  Greenhouse–Geisser correction adjusts degrees of freedom, though model-based
  approaches are preferred.
- **Balanced data**: classic repeated-measures ANOVA wants the same set of
  visits for everyone; real studies have dropouts and missed visits, which
  move the analysis toward mixed models or GEE.
- **Independence between subjects** must still hold; clustering (patients from
  the same clinic) needs additional modelling.
- Attrition bias: if the patients who drop out differ systematically from
  those who remain, trajectory estimates for the completers do not represent
  the original cohort.

## Worked example

In a crossover trial, 40 adults with mild hypertension record home systolic
blood pressure weekly for 8 weeks on usual care and 8 weeks on a new agent
(order randomised). The mean fall in systolic pressure is 2.1 mmHg on usual
care and 9.4 mmHg on the new agent. Because each subject is measured under
both conditions, the paired difference (new minus usual) has mean 7.3 mmHg
with SD 5.8, giving a 95% CI of 7.3 ± 1.99 × 5.8/sqrt(40) = 7.3 ± 1.8, i.e.
5.5 to 9.1 mmHg. The within-subject design shrinks the standard error to
about 0.9 mmHg; an unpaired comparison of the two sets of readings, ignoring
that the same 40 people produced both, would have a roughly two-fold larger
standard error and could miss the effect.

## Interpretation and common pitfalls

- Running separate t-tests at each time point and ignoring the correlation
  inflates the type I error; with six visits that is up to six tests, each
  adding error.
- Reporting a single "average over all visits" per subject and then doing a
  standard two-sample test discards the time information and the within-
  subject precision that motivated the design.
- Averaging subjects' individual slopes and assuming those slopes are
  representative can misstate the population mean trajectory when slopes and
  intercepts trade off.
- Ignoring missing visits: complete-case analysis keeps only subjects with
  every visit, which can be a biased subset; model-based methods use all
  available measurements under a stated missingness assumption.

## References and further reading

- Dupont WD, Schuemaker M. *Design and Analysis of Clinical Research*.
  Lippincott Williams & Wilkins.
- Bland M, Altman DG. *Statistics with Confidence: Confidence Intervals and
  Guide to Statistical Analysis with Medcalc*. BMJ Books.
- Diggle P, Heagerty P, Liang K, Zeger S. *Analysis of Longitudinal Data*.
  Oxford University Press.

*The "Mixed-effects models" and "Generalized estimating equations" articles
develop the two main model-based approaches to these designs.*
