---
title: Poisson and negative binomial regression
summary: Models count outcomes and incidence rates with log-link models, extending from the equidispersed Poisson to the overdispersed negative binomial.
---

## Overview and key ideas

Poisson regression models a count outcome (or an event rate per unit of exposure time) as the dependent variable: log(μ) = β₀ + β₁X₁ + …, where μ is the expected count (or rate) and the link is the natural logarithm. Exponentiating a coefficient gives a rate ratio (RR), also called a multiplicative incidence-rate ratio: for a one-unit increase in Xⱼ the expected count/rate is multiplied by e^βⱼ, holding other predictors fixed. Because log(μ) = log(count) − log(offset), including log(person-time) as an offset lets the model estimate *incidence rates* (events per person-year) while adjusting for unequal follow-up.

The Poisson distribution has a built-in constraint: its variance equals its mean. In real health data the variance of counts is often larger — for example, a few patients account for many relapses while most have none. That *overdispersion* makes Poisson standard errors too small and p-values too small. The negative binomial regression is the standard remedy: it adds one extra parameter (often called the size or inverse-dispersion parameter α) that lets the variance exceed the mean; as α → 0 the model approaches a gamma-mixed Poisson, and as α → ∞ it collapses back to the Poisson. The RR estimates are nearly identical under the two models; the standard errors and p-values are not.

## When to use it

| Setting | Example question |
| --- | --- |
| Cohort follow-up | Do diabetes and statin use affect the incidence rate of new cataracts per person-year? |
| Recurrent events | How do age and severity score predict the number of asthma ER visits per year? |
| Infectious disease | Is vaccination associated with a lower rate of infections per month? |
| Resource use | Which patient factors predict the number of readmissions in one year? |

Use it when the outcome is a non-negative integer count or a rate with person-time, and you want an interpretable multiplicative effect. If only a very few events per subject matter and the outcome is effectively binary, logistic regression is simpler. If the outcome is time-to-*first* event rather than a count, Cox regression is the usual tool.

## Assumptions and limitations

- **Independence of counts**: one count per subject per period; recurrent events on the same subject are dependent, which requires a GEE or mixed model with the same log link.
- **Correct exposure measurement**: with person-time, follow-up must be recorded accurately; left truncation and administrative censoring change the valid at-risk time.
- **Equidispersion (Poisson only)**: var(count) = mean(count). Check by comparing the residual deviance to its degrees of freedom, or by estimating the dispersion parameter; deviance df much above 1 signals overdispersion.
- **Linearity on the log scale** for continuous predictors.
- **Zero inflation**: a large excess of *structural* zeros (patients who can never have the event) is not handled by the negative binomial and may call for a zero-inflated or hurdle model.

## Worked example

A cohort of 4,000 patients with inflammatory bowel disease contributes 9,800 person-years and 1,470 hospitalisations. A Poisson model with an offset of log(person-time) and the covariates age (per 10 years) and prior hospitalisations in year 1 (count) gives: log(rate) = −1.90 + 0.18·(age/10) + 0.42·(prior admissions). A 50-year-old with 2 admissions last year has expected rate e^(−1.90 + 0.90 + 0.84) = e^−0.16 ≈ 0.85 admissions/year, versus e^(−1.90 + 0.90 + 0) = 0.37/year for a same-age patient with 0 — a rate ratio of e^0.42 = 1.52 (95% CI 1.30 to 1.77): each extra prior admission is associated with a 52% higher admission rate. The residual deviance was 2,150 on 1,240 df (ratio ≈ 1.73), indicating marked overdispersion; refitting the same model as negative binomial gave α ≈ 0.45 and a rate ratio of 1.55 with a wider 95% CI of 1.31 to 1.83 — the effect is similar, but only the negative binomial CI is trustworthy.

## Interpretation and common pitfalls

- A rate ratio of 1.5 means the *rate* is 50% higher, not that the probability of the event rises by 0.5 — rates per person-time are not probabilities, and they can exceed 1 for recurrent events.
- Always check dispersion before trusting Poisson p-values; reporting Poisson inference on overdispersed data makes everything look more significant than it is.
- Do not use Poisson regression as a shortcut for a binary outcome with a "large denominator"; the models answer different questions (rare-event approximation only).
- For recurrent events, an ordinary Poisson model on the total count ignores within-subject correlation; use a GEE/mixed model with a log link and report the design effect.

## References and further reading

- Agresti A. *Categorical Data Analysis*. Wiley.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and Other Advanced Topics*. Brooks/Cole.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- *The topic map's "Survival analysis" section covers time-to-first-event modelling (article planned).*
