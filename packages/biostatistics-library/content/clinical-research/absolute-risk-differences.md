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

In randomized studies, calculate the risk difference from the same population, outcome definition, and follow-up horizon in each arm. A risk difference of −0.002 corresponds to two fewer events per 1,000 over that horizon; its reciprocal gives an NNT of 500 only when the absolute difference is beneficial and the follow-up period is specified. Confidence intervals can cross zero, making reciprocal NNT intervals discontinuous and requiring careful presentation (often as benefit and harm regions). In observational studies, a crude difference is not necessarily causal; standardization or another justified adjustment targets a marginal contrast under assumptions such as exchangeability and positivity.

## References and further reading

## Estimation, uncertainty, and transport to a target population

## Worked adjusted risk difference

## Unequal follow-up and competing events

## Risk difference in nonrandomized data

The crude RD in an observational cohort is generally associational because exposure groups may differ in prognosis. Standardization estimates risks under each exposure in a target population if confounding is controlled by measured pre-exposure covariates and positivity holds. Inverse-probability weights can target the population average; matching may target overlap/matched population. Report covariate balance and effective sample size. If a key confounder is poorly measured, a narrow interval around adjusted RD does not remove bias; quantitative sensitivity analysis should accompany causal language.

When an exposure is continuous, a single RD requires a contrast (e.g. treatment at dose 10 versus 0) and a specified covariate distribution. Model splines or dose-response functions and report standardized risks across clinically relevant doses. Dichotomizing dose can discard information and create residual confounding. For effect modification, show absolute effects across prespecified risk groups, with uncertainty and no claim that the same NNT transports universally.

If follow-up differs, compare cumulative incidence at a common time using survival methods rather than event proportions. With competing causes, estimate the cumulative incidence function for the event of interest; censoring competing events in KM estimates a hypothetical net event probability. A 2-year RD and a 5-year RD are different estimands and may differ if hazards vary over time. State the horizon, risk set, and competing-event treatment alongside any NNT translation.

If proportional hazards is plausible, one may derive standardized survival from a Cox model, but an HR itself cannot be inverted into NNT. Restricted mean survival time difference gives absolute event-free time through τ and may be preferable when curves cross. For recurring outcomes, mean cumulative count difference can capture burden not reflected in first-event risk.

## Statistical versus clinical thresholds

## Translating estimates into a decision

Suppose a decision threshold is an absolute reduction of at least 1 percentage point over 5 years. An estimate of −1.8 points with interval −3.2 to −0.4 crosses the threshold: benefit is plausible and clinically meaningful, but the interval also includes a smaller-than-important effect. Report this uncertainty rather than declaring the treatment effective solely because the interval excludes zero. A decision-maker may still favor treatment if low burden and strong preferences, but that is a benefit-harm judgment beyond the statistical test.

Absolute benefits should be accompanied by harms and treatment burden using consistent populations and horizons. If adverse event risk increases by 0.5 points while target-event risk falls by 1.8 points, event severity and utility matter; event counts alone do not establish net benefit. Shared decisions can present natural frequencies and allow patient preferences to determine tradeoffs.

Clinical importance should be discussed against a prespecified minimally important risk difference, patient burden, cost, and harms. An interval excluding zero may still include effects too small to matter; an interval crossing zero may exclude large benefits and harms, supporting a narrower conclusion. Avoid equating “not statistically significant” with no absolute benefit. Show how uncertainty maps to decisions and which parameter values would change a recommendation.

Imagine a pragmatic trial of 1,000 participants per arm with 80 events on treatment and 100 on control. The crude RD is .08−.10=−.02. Suppose baseline risk factors are imbalanced by chance and a prespecified logistic model is used for precision. Predict each participant's risk twice—once with treatment and once with control—while keeping baseline covariates fixed; average predictions to obtain standardized (p_1) and (p_0). If predictions are .079 and .099, adjusted RD is −.020, or 20 fewer events per 1,000 over follow-up. Bootstrap the entire fitting/prediction procedure to obtain an interval. A coefficient OR from the logistic model is not itself this marginal RD.

For a nonrandomized cohort, the same computation additionally assumes no unmeasured confounding conditional on included baseline covariates, positivity, consistency, and valid outcome/censoring models. If treatment probability approaches zero or one for some profiles, predictions extrapolate beyond data and the contrast is weakly identified. Inspect overlap and target a population with support in both strategies.

## Communicating benefit and harm

Present a natural-frequency display where possible: “per 1,000 treated for 2 years, estimated 80 events versus 100 under control, about 20 fewer; interval ranges from X fewer to Y more.” This communicates absolute impact and uncertainty without rhetorical emphasis on a relative percentage. Pair benefit with adverse events using the same horizon and denominator. If outcomes differ in severity, a simple count of benefit and harm events does not express net value; utility-weighted decision analysis requires explicit preferences.

An NNT based on a composite endpoint should name components and whether recurrent events count. NNTs across different trials cannot be ranked without comparable populations, comparators, endpoint definitions, and durations. The same intervention's NNT changes with baseline risk and follow-up; report the trial-specific estimate, not a universal drug property.

## Interval estimation and number-needed-to-treat conventions

For a risk difference, confidence intervals may be constructed from score intervals for the component risks rather than the Wald formula. Newcombe's method combines Wilson intervals and performs well across a range of proportions. In a randomized trial with covariate adjustment, use a model-based marginal contrast and calculate uncertainty with the model covariance, bootstrap, or randomization-respecting method. The estimator and interval should correspond: do not report a regression-standardized point estimate with a crude Wald interval.

NNT is the reciprocal of an absolute risk reduction and must always name its time horizon and outcome. “NNT=20” is incomplete; say 20 patients treated for 5 years to prevent one event, compared with a specified alternative. NNT varies across baseline risk and follow-up duration, and it is unstable when the risk difference is near zero. If the treatment increases the event, report number needed to harm with clear sign conventions. NNT for a composite outcome should identify its components because a favorable composite may be driven by less serious outcomes.

When confidence limits for a risk difference cross zero, reciprocal limits split into benefit and harm regions around infinity. Reporting a bounded interval such as NNT 50–500 would conceal possible harm. A useful presentation shows absolute difference as the primary estimate and describes NNT benefit/harm regions or avoids the reciprocal summary when uncertainty is too broad. Small changes in risk difference near zero create very large changes in NNT, so decimal precision is inappropriate.

## Standardization and treatment effect heterogeneity

An adjusted marginal risk difference can be estimated by predicting each participant's risk under both strategies and averaging. This g-computation estimand is population-specific; changing the target covariate distribution changes absolute effect. If a treatment has a constant RR but different baseline risks, ARDs differ. If effects vary by covariate, both relative and absolute contrasts can vary. Report subgroup ARDs only when prespecified or clearly exploratory, and show intervals rather than assuming one trial NNT applies to everyone.

For transport to a clinical target population, reweight or standardize to its covariate distribution if those covariates modify outcome risk/effect and are measured in both source and target. This assumes conditional effect transportability and positivity. A treatment's observed absolute benefit in a high-risk trial may overstate benefit in a lower-risk clinic, even when relative efficacy transports. Baseline risk calculators can personalize ARD but require calibration and external validation.

## Beyond binary outcomes

For recurrent events, a simple proportion with at least one event loses event burden; consider mean cumulative count difference over a horizon. For time-to-event outcomes, use cumulative incidence difference at a fixed time or RMST difference; do not apply NNT to a hazard ratio directly. For continuous outcomes, the mean difference is already absolute on the measurement scale, though clinical interpretation depends on scale and meaningful thresholds. For competing risks, the absolute difference in cumulative incidence is the probability contrast relevant to actual event occurrence.

For independent binomial groups, let \(a\) and \(c\) be events among \(n_1\) and \(n_0\) participants. The plug-in estimate is \(\hat p_1-\hat p_0\). Its Wald standard error is

\[
\widehat{SE}(RD)=\sqrt{\hat p_1(1-\hat p_1)/n_1+\hat p_0(1-\hat p_0)/n_0}.
\]

This interval is simple but may have poor coverage when either event count is small or a risk is near zero or one. A Newcombe interval combines Wilson score limits for each risk; it avoids some impossible limits produced by the Wald method. For a randomized trial with stratification or baseline covariates, regression standardization often gives a more efficient marginal risk difference while retaining the interpretation as a difference in population risks.

For example, imagine 80/1,000 events under treatment and 100/1,000 under control. The estimate is −0.020, or 20 fewer events per 1,000. The unadjusted standard error is \(\sqrt{.08(.92)/1000+.10(.90)/1000}=0.0126\). The rough 95% interval is −0.0447 to 0.0047, or 45 fewer to 5 more events per 1,000. The interval matters: the point estimate does not establish that benefit is certain.

```r
event_t <- 80; n_t <- 1000
event_c <- 100; n_c <- 1000
p_t <- event_t / n_t
p_c <- event_c / n_c
rd <- p_t - p_c
se <- sqrt(p_t * (1 - p_t) / n_t + p_c * (1 - p_c) / n_c)
c(rd = rd, lower = rd - 1.96 * se, upper = rd + 1.96 * se)
```

The reciprocal transformation deserves special care. If the entire risk-difference interval is below zero under treatment-minus-control coding, the NNT benefit interval is obtained by reciprocating magnitudes with signs handled explicitly. If the interval crosses zero, a single finite interval for NNT is misleading: it spans possible benefit, no effect, and harm. Report the risk difference and its interval as the primary result, then present NNT benefit and harm regions only with clear conventions and a stated horizon.

In an observational analysis, define the target population before estimating an adjusted contrast. Under conditional exchangeability, consistency, and positivity, a standardized risk under treatment level \(a\) is \(E_X[P(Y=1\mid A=a,X)]\). The causal risk difference is the difference between these standardized risks, not necessarily the coefficient of a logistic regression. A coefficient on the log-odds scale is conditional and non-collapsible; converting it to an absolute contrast requires predicted risks averaged over a specified covariate distribution. Different target populations can therefore have different ARDs even with a common conditional effect.

## Time-to-event outcomes and competing events

When follow-up varies or censoring occurs, a simple event proportion ignores time at risk. A fixed-time risk difference should instead compare cumulative incidence by the same time \(t\). With competing events, the appropriate quantity for a real-world probability of the event is often the cumulative incidence function, not one minus a Kaplan–Meier curve that treats competing events as censoring. A difference in 5-year cumulative incidence is interpretable as an absolute probability difference at five years; it is not interchangeable with a hazard ratio or an incidence-rate difference.

Report the estimand, outcome definition, time origin, horizon, handling of competing events, and censoring assumptions. A risk difference of −0.02 at one year does not imply the same difference at five years. If curves cross, a single summary can conceal early harm and later benefit; show the curves and consider restricted mean event-free time or prespecified time-specific contrasts. For design planning, choose an effect on the scale clinicians will use, but account for the baseline risk and follow-up horizon that determine it.

- Newcombe RG. Interval estimation for the difference between independent proportions: comparison of eleven methods. *Statistics in Medicine*. 1998;17:873–890. https://doi.org/10.1002/(SICI)1097-0258(19980430)17:8%3C873::AID-SIM779%3E3.0.CO;2-I
- Hernán MA, Robins JM. *Causal Inference: What If*. Chapman & Hall/CRC; 2020. https://www.hsph.harvard.edu/miguel-hernan/causal-inference-book/
- Austin PC. Absolute risk reductions and numbers needed to treat can be obtained from adjusted survival models. *Statistics in Medicine*. 2010;29:1800–1809. https://doi.org/10.1002/sim.3913

- Greenland S, Rothman KJ, Lachin JM. "Measures of Occurrence and Effect." In Rothman KJ, Greenland S, Lash TL (eds), *Modern Epidemiology*. Lippincott Williams & Wilkins.
- Bland M, Altman DG. *Statistics with Confidence*. BNP Books.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- The library's "Risk ratios and odds ratios" article contrasts relative measures with these absolute ones.
