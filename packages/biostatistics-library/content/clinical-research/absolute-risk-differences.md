---
title: Absolute risk differences
summary: The simple difference in event risk between two groups — the effect size most directly tied to clinical decisions.
---

## Overview and key ideas

The **absolute risk difference** (ARD, or risk difference) is the arithmetic difference between two risks: ARD = risk(group 1) − risk(group 2). Unlike a ratio, it incorporates the baseline risk, so it answers the patient's real question — "how much better (or worse) will I actually do?" — and it is the quantity from which the number needed to treat (NNT = 1/absolute risk reduction) and number needed to harm are computed.

The two measures are linked by RR = 1 + ARD / baseline risk, so they diverge systematically: the same relative effect produces a small ARD on a low baseline risk and a large one on a high baseline risk. Trials and guidelines therefore report both — the relative measure for consistency across populations, the absolute measure for decision-making.

A worked pair makes the link concrete. The same drug, RR = 0.75, applied to two populations:

| Population | Baseline risk | Treated risk | ARD | NNT |
| --- | --- | --- | --- | --- |
| High-risk (age 70+, prior MI) | 20% | 15% | 5% | 20 |
| Low-risk (age 50, no comorbidity) | 4% | 3% | 1% | 100 |

One relative effect, two very different absolute effects — the reason NNT is quoted alongside a trial's relative risk.

## When to use it

| Setting | Example question |
| --- | --- |
| Trial of a new antihypertensive | How many patients per 1,000 avoid a stroke over 10 years compared with standard therapy? |
| Screening programme | How many breast cancer deaths are averted per 10,000 women screened over 10 years? |
| Safety monitoring (NNH) | How many patient-years of a drug are needed to cause one case of drug-induced liver injury? |
| Public health policy | What is the population-level impact of a 5% relative risk reduction for a rare disease? |

## Assumptions and limitations

- **Same time horizon and outcome definition** — the risks must be cumulative incidences over an identical follow-up in both groups; comparing a 5-year risk with a 10-year risk is meaningless.
- **Cell counts for the interval** — the normal-approximation CI uses SE = sqrt(p1(1−p1)/n1 + p2(1−p2)/n2); with few events, exact (e.g. Newcombe) intervals are more reliable.
- **Population-specific** — the same drug can have different ARDs in different populations even if its RR is constant, so the NNT from a trial is only a guide for your own patient.
- **Statistical ≠ clinical** — on a very low baseline risk the ARD may be statistically significant yet clinically trivial; the reverse pattern (impressive ARD, wide CI crossing zero) is common in small trials.

## Worked example

Consider 10-year follow-up in 10,000 women aged 50–69 per arm of a mammography screening trial: 100 breast cancer deaths among screened women versus 120 among unscreened controls.

- Absolute risk reduction = 120/10,000 − 100/10,000 = **0.2 percentage points**.
- Relative risk = 0.010 / 0.012 = **0.83** — a 17% relative reduction, which sounds much larger than the 0.2-point absolute reduction.
- 95% CI: SE = sqrt(0.012 × 0.988/10,000 + 0.010 × 0.990/10,000) = 0.0015, so CI = 0.002 ± 1.96 × 0.0015 → roughly **−0.1% to +0.5%**, crossing zero.
- NNT = 1/0.002 = **500**: 500 women need 10 years of screening to avert one breast cancer death.

Interpretation: the relative framing (17% reduction) and the absolute framing (0.2 points, about one death averted per 500 women screened) describe the same trial; the interval crossing zero means the reduction is not statistically conclusive at 5%, which is exactly the tension at the heart of real screening debates. For contrast: antibiotics versus placebo for sore throat resolve by day 6 in 74% versus 62% — the same modest relative effect (RR ≈ 1.19) is a large 12-point absolute difference because the baseline risk is high (NNT = 8).

## Interpretation and common pitfalls

- Reporting only the relative risk: "17% reduction" sounds striking, while 0.2 percentage points is the number a patient can weigh against harms and costs.
- Misapplying NNT: it assumes your patient matches the trial population; NNT scales inversely with baseline risk, so it is much larger for a low-risk individual.
- Ignoring the confidence interval: an absolute risk reduction whose interval crosses zero does not support a claim of benefit (or harm) at the 5% level.
- Mixing ARD with incidence rates or different follow-up windows; the difference is only valid when both risks are cumulative over the same period.
- Reporting the ARD as a stable constant: it is an estimate with its own sampling variability, and small studies of rare outcomes give ARD intervals wide enough to span both harm and benefit.

## References and further reading

- Greenland S, Rothman KJ, Lachin JM. "Measures of Occurrence and Effect." In Rothman KJ, Greenland S, Lash TL (eds), *Modern Epidemiology*. Lippincott Williams & Wilkins.
- Bland M, Altman DG. *Statistics with Confidence*. BNP Books.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- The library's "Risk ratios and odds ratios" article contrasts relative measures with these absolute ones.
