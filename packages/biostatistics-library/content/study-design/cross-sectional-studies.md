---
title: Cross-sectional studies
summary: A design that measures exposure and outcome simultaneously, producing a snapshot of disease and risk-factor prevalence in a population.
---

## Overview and key ideas

A cross-sectional (prevalence) study measures both the exposure of interest and the outcome in each individual at a single point in time — or over a short, well-defined window. Unlike cohort or case-control designs, it does not follow people forward in time: it photographs the population, and each person contributes exactly one exposure–outcome pair. The central quantity is the **prevalence** of the outcome in the population, and among people with the outcome, the **cross-sectional odds ratio** (or prevalence ratio) comparing exposure between those with and without the outcome.

Because the same sample supplies both denominators, a cross-sectional survey is usually the cheapest design for questions of the form "how common is this, and who has it?"

Prevalence and association are summarised on different scales: the disease itself is described by a proportion (the prevalence), while exposure is compared between diseased and non-diseased people, giving a cross-sectional odds ratio — or, with the log-binomial model, a prevalence ratio. The choice matters for interpretation: an odds ratio of 2 for a common outcome looks striking but corresponds to a much smaller prevalence ratio.

## When to use it

Cross-sectional designs fit questions about the burden of disease at one point in time, not about temporal causality.

| Setting | Example question |
| --- | --- |
| National or local health surveys | What proportion of adults in this district meet the case definition of undiagnosed hypertension? |
| Occupational and service planning | How prevalent is low back pain among nurses in this hospital, and how is it associated with years worked? |
| Screening evaluation | What is the prevalence of diabetic retinopathy in this clinic's diabetic population, and is it associated with HbA1c? |
| Public health surveillance | What proportion of adolescents reports less than the recommended physical activity, by socioeconomic stratum? |

Cross-sectional data also supply prior probabilities for diagnostic-accuracy studies and baseline characteristics for later cohort work.

## Assumptions and limitations

- **No temporal ordering.** Exposure and outcome are measured together, so the design cannot establish which came first: a survey of smoking and depression cannot distinguish whether smoking causes depression or depressed people start smoking.
- **Prevalence, not incidence.** Prevalence reflects both new-onset incidence and duration; a fast-fatal or fast-resolving disease looks rare even with high incidence.
- **Prevalent-case (Neyman) bias.** Only people who survived and remain in the survey population are counted, so long-surviving or chronic cases are over-represented.
- **Prevalence–incidence–duration relation.** Prevalence ≈ incidence × average duration of disease; a cross-sectional estimate therefore conflates three quantities, and comparing prevalence across populations with different survival or remission patterns can mislead.
- **New cases are missed.** Cases arising after the measurement window are not captured, so cross-sectional data cannot support statements about incident disease.
- **Small-cell approximation.** Confidence intervals for proportions rely on the normal approximation; with fewer than about 5 expected events the interval is unreliable and an exact (Clopper–Pearson) method should be used instead.
- All estimates assume the sample is representative of the target population; a low response rate or convenience sample invalidates the prevalence estimate (see the library's sampling article).

## Worked example

A health screening examined 1,200 adults aged 40–75 in one city district. Ninety-six of them had diabetes. Among the 96 diabetics, 41 reported regular physical activity; among the 1,104 non-diabetics, 512 did.

- Diabetes prevalence = 96 / 1,200 = 8.0% (95% CI by the normal approximation for a proportion: 6.6%–9.7%).
- Cross-sectional odds ratio for diabetes, regular vs irregular activity = (41 × 592) / (55 × 512) ≈ 0.86 (95% CI ≈ 0.59–1.26).

The point estimate is near 1 and the interval includes 1, so regular activity shows no detectable cross-sectional association with diabetes in this survey — and the design cannot say whether inactivity, if anything, preceded the diabetes, since both were measured on the same day.

## Interpretation and common pitfalls

- Reporting a cross-sectional odds ratio as if it were causal: because exposure and disease coexist, there is no evidence about which came first.
- Confusing prevalence with incidence: a 20% prevalence may mean many short-lived cases or a few long-lived ones; they have very different public-health meanings.
- Assuming non-responders are missing at random: people who refuse a health survey are often systematically different (worse health, different income), which can bias prevalence in either direction.
- Ignoring survey weights: in a two-stage cluster survey (as in most national health surveys), unweighted means are not population prevalences; weighted estimates and design-adjusted standard errors are required.
- Generalising a single-site snapshot: a one-time survey in one district says nothing about prevalence in another population with different age structure, healthcare access, or referral patterns.

## References and further reading

- Rothman K, Greenland S, Lash TL. *Modern Epidemiology*. Lippincott Williams & Wilkins.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and Other Advanced Topics*. Brooks/Cole.

*The planned "Sampling methods" article in this library covers how a survey sample is turned into an unbiased population estimate.*
