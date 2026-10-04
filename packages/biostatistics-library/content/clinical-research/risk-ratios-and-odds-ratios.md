---
title: Risk ratios and odds ratios
summary: Two ratios that compare an event rate between groups, and when each one answers a different clinical question.
---

## Overview and key ideas

The **risk ratio** (relative risk) compares the probability of an event in two groups: RR = risk(exposed) / risk(unexposed). It is computed directly from cohort studies and randomized trials, where follow-up is known for both groups. An RR of 0.60 means the event occurs 40% less often in the exposed group.

The **odds ratio** compares odds rather than risks: OR = [a/b] / [c/d], where a and c are the numbers of events in each group and b and d the numbers without the event. The OR can be computed from any study design, including case-control studies where risks are not estimable, and it is the natural effect measure from logistic regression, because the model estimates log odds.

When the outcome is rare (say under 10%), odds closely approximate probabilities, so OR ≈ RR. As the outcome becomes more common the OR increasingly exaggerates the RR: for a harmful exposure the OR is larger than the RR, and for a protective one it is smaller.

Both ratios start from the same 2×2 table — in the statin trial used in the worked example:

| | Event | No event |
| --- | --- | --- |
| Statin (n=400) | 48 (a) | 352 (b) |
| Placebo (n=400) | 80 (c) | 320 (d) |

From it: risk = a/(a+b); RR = [a/(a+b)] / [c/(c+d)]; OR = (a/b) / (c/d).

## When to use it

Use the risk ratio when you can estimate risks in both groups, and the odds ratio when you cannot, or when modelling several predictors simultaneously.

| Setting | Example question |
| --- | --- |
| Randomized trial | Does adding a statin to standard care reduce 5-year coronary events? |
| Prospective cohort | Is long-term NSAID use associated with a higher risk of gastrointestinal bleeding? |
| Case-control study | Are neonatal antibiotics associated with a childhood asthma diagnosis? |
| Multivariable logistic regression | Which admission variables independently predict 30-day readmission? |

## Assumptions and limitations

- **Rare-outcome approximation** — quoting an OR as if it were an RR is only defensible when the outcome is uncommon; at 20% risk the gap is already visible.
- **Adequate cell counts** — normal-approximation confidence intervals for log OR or log RR misbehave with small cells or zero cells; use exact or penalized (e.g. Firth) logistic regression instead.
- **Comparable follow-up** — the risk ratio compares cumulative risks; if follow-up differs between groups, an incidence rate ratio on person-time is more honest.
- **Not a substitute for absolute risk** — the same RR means very different things on different baseline risks; always pair the ratio with absolute risks (see the article on absolute risk differences).

## Worked example

A trial randomizes 400 patients to a statin and 400 to placebo. Over 5 years, 48 of 400 in the statin arm and 80 of 400 in the placebo arm have a major coronary event.

- Risk ratio = 0.12 / 0.20 = **0.60**, a 40% relative reduction.
- 95% CI on the log scale: SE(log RR) = sqrt(1/48 − 1/400 + 1/80 − 1/400) = 0.168; log RR = −0.511, so CI = exp(−0.511 ± 1.96 × 0.168) = **0.43 to 0.83**, which excludes 1.
- Odds ratio = (48/352) / (80/320) = 0.136 / 0.25 = **0.55**, close to the RR because the outcome is moderately rare.

Interpretation: statin-treated patients have a 40% lower relative risk of a coronary event over 5 years, and the interval excludes no effect. Because the placebo risk is 20%, the absolute benefit is 8 percentage points — the number that should drive the shared decision (NNT = 12.5).

## Interpretation and common pitfalls

- Reporting an odds ratio of 2.5 as "the risk is 2.5 times higher." With a 20% baseline risk, an OR of 2.5 corresponds to an RR of 2.0 (exposed risk 40%); odds are not risks.
- Reading a case-control OR as a risk estimate. It estimates the RR in the source population under valid sampling, not the actual probability of the outcome.
- Confusing direction: RR < 1 favours the exposed group, while the same magnitude above 1 is a relative increase — always state which group has the higher risk.
- Choosing OR versus RR by habit rather than design: the logistic-regression OR is convenient, but when risks are estimable, risk ratios (or risk differences) are usually easier for clinicians to act on.
- Back-calculating an exposed-group risk from an OR in a trial: the OR identifies the ratio of odds, and converting it back to a risk requires knowing the baseline risk, which the OR alone does not provide.

Risk ratios compare probabilities over a specified follow-up period; odds ratios compare p/(1−p). In case-control sampling, the exposure odds ratio is identifiable under standard sampling assumptions, but absolute risk and a risk ratio generally are not available without external incidence or sampling information. For common outcomes, consider reporting standardized risks and risk differences alongside odds ratios. Odds ratios are also non-collapsible: an adjusted OR can differ from a crude OR even without confounding, so coefficient change alone is not proof that confounding was controlled. Name the reference group and time horizon.

## References and further reading

## Estimands, sampling, and adjustment

## Converting an odds ratio to an absolute risk

## Worked 2×2 calculation and interpretation

In 500 treated participants, 30 events occur (risk 6%); in 500 controls, 20 occur (4%). RR=0.06/0.04=1.5, RD=2 percentage points, and OR=(30×480)/(470×20)=1.53. Here OR approximates RR because outcome is uncommon, but the approximation worsens as risk increases. The approximate log RR SE is sqrt(1/30−1/500+1/20−1/500)=0.283, giving 95% RR interval about 0.86–2.62. The point estimate suggests increased risk, but interval is wide and includes no association.

```r
a <- 30; n1 <- 500; c <- 20; n0 <- 500
rr <- (a / n1) / (c / n0)
se <- sqrt(1/a - 1/n1 + 1/c - 1/n0)
c(RR = rr, lower = exp(log(rr) - 1.96 * se),
  upper = exp(log(rr) + 1.96 * se))
```

These intervals assume independent binomial groups and adequate counts. Clustered or matched designs require corresponding variance methods. The p-value does not communicate that effects ranging from modest protection to substantial harm remain compatible with the data.

## Model diagnostics and standardized contrasts

## Effect measure choice by design

## Reporting checklist

Give numerator/denominator or event risks, define exposed and reference groups, identify time horizon and sampling design, state whether the measure is RR, OR, rate ratio, or HR, and provide an interval. For common outcomes, avoid translating OR directly into relative risk. For observational estimates, name adjustment variables and target population; for case-control sampling, do not infer absolute risk from sampled proportions.

## Communicating relative and absolute effects together

## Confounding, modification, and scale

In observational studies, adjusted measures depend on which covariates and scale are used. Confounding is not assessed by whether an adjusted estimate changes from crude by 10%; use causal structure and design knowledge. Effect modification can make RR constant while RD varies with baseline risk, or vice versa. Report scale-specific interaction and subgroup estimates when clinically important. If using logistic regression, distinguish a conditional OR from standardized marginal odds/risk estimates.

For follow-up with competing events, a cause-specific HR, subdistribution HR, and cumulative risk ratio are different estimands. An HR compares instantaneous rates among those event-free; cumulative incidence contrast describes actual probability by time. Avoid calling them all relative risk. Give event counts and absolute incidence whenever data support it.

For a clinical report, give risks by group and denominator, then RD and RR or OR with interval. Example: 30/500 vs 20/500 yields 6% vs 4%, RD +2 percentage points and RR 1.5. This communicates the same data from two perspectives. If only RR is shown, readers cannot judge absolute burden; if only RD is shown, baseline-relative consistency across settings may be less apparent. Name reference group explicitly, and use “times the odds” for OR rather than “times as likely” when outcome is common.

An OR may approximate RR for rare outcomes, but rarity depends on outcome frequency in the unexposed/source population and study design. The approximation is unreliable for common outcomes or strongly varying baseline risks. Converting a conditional adjusted OR using one overall baseline risk can fail due to non-collapsibility and covariate distributions; obtain standardized predictions instead. In case-control studies, observed case fraction is imposed by sampling and cannot provide the baseline risk for conversion.

Use risk ratios for cumulative incidence when follow-up is fixed and outcome status observed. Use rate ratios for person-time incidence when a rate model is meaningful, and hazard ratios for instantaneous event rates under survival assumptions. Odds ratios arise naturally from logistic likelihood and case-control sampling. They are not interchangeable. State time horizon and follow-up scheme, then choose measure aligned with question. For common outcomes, reporting only OR can make relative association appear larger than the risk ratio.

For matched case-control designs, OR is conditional on matched sets; an unconditional estimate that ignores matching may be biased or inefficient. For randomized or cohort trials, modified Poisson with robust variance can estimate RR, while logistic regression may be retained for model convenience if absolute risks are standardized. Explain which effect is primary and provide complementary absolute risks.

For modified Poisson RR models, use robust covariance and inspect fitted means; log-link predictions can exceed one. For logistic regression, assess functional form, separation, calibration, and influential observations. To obtain adjusted absolute risks, predict counterfactual exposure levels for each target person, average each set, then compute RD or RR. Bootstrap the full procedure or use the delta method. State target population and covariate distribution; a conditional coefficient and marginal standardized contrast are not interchangeable.

In case-control studies, the sampled case proportion is fixed by design, so it cannot serve as baseline risk. An OR remains available under appropriate sampling, but converting to RR requires an external baseline risk and correct sampling assumptions. In risk-set sampling, OR estimates a rate ratio without the rare-disease approximation; specify the sampling mechanism.

If baseline risk (p_0) is known and the OR is transportable, the corresponding treated risk is \(p_1=OR\,p_0/(1-p_0+OR\,p_0)\). For OR=2 and baseline risk 10%, the treated risk is \(.20/(.90+.20)=18.2\%\), yielding RR=1.82 rather than 2. At baseline risk 50%, OR=2 corresponds to treated risk 66.7% and RR=1.33. Thus OR magnitude is strongly baseline-risk dependent when translated to probability.

```r
or_to_risk <- function(or, p0) or * p0 / (1 - p0 + or * p0)
p0 <- c(.01, .10, .50)
p1 <- or_to_risk(2, p0)
data.frame(p0, p1, RR = p1 / p0, RD = p1 - p0)
```

This conversion is valid only for a compatible conditional or marginal OR and baseline risk. Combining an adjusted conditional OR with a crude baseline risk may not yield a valid adjusted risk. Prefer standardized prediction from the fitted model when covariates and interactions are available, and propagate uncertainty in both the OR and baseline risk.

## Conditional and marginal effects

The OR is non-collapsible: marginal and conditional ORs can differ even when exposure is randomized and there is no confounding. Logistic regression coefficients condition on included covariates; a standardized population OR compares averaged risks then converts them to odds. The two targets should not be compared as though one must be confounded. Risk ratios are collapsible under appropriate conditions, but adjusted RR coefficients can still vary with effect modification and target population.

In randomized trials, report the unadjusted marginal risks and risk difference/RR as interpretable summaries, and a prespecified adjusted analysis for precision if planned. In observational analyses, decide whether the target is conditional or marginal before fitting and choose an adjustment method accordingly. For policy, marginal effects often map better to population burden; for etiologic effect conditional on covariates, conditional models may be relevant but need a clear scientific rationale.

## Sparse data and alternative models

When one cell is zero, log-Wald intervals fail or become infinite. Exact conditional methods, profile likelihood, Firth-penalized logistic regression, or Bayesian models with weakly informative priors can stabilize estimation. Continuity corrections are quick but arbitrary and can materially bias sparse tables. For common outcomes, modified Poisson with robust SE estimates RR directly; log-binomial regression is another option but may fail at the boundary. Always check predicted risks are plausible and less than one.

For matched case-control data, conditional logistic regression estimates a matched OR and should respect matched sets. For stratified randomization or clustered data, account for design in variance. For time-to-event outcomes, distinguish HR from cumulative RR or OR; report absolute survival/risk at specified horizons where possible.

For a binary outcome, the risk ratio compares cumulative probabilities over a defined horizon, whereas an odds ratio compares odds. In a cohort or randomized trial, both risks can be estimated directly. In case-control sampling, the investigator fixes the numbers sampled from outcome groups, so the sample does not identify population risks; the exposure odds ratio remains estimable under appropriate sampling, but absolute risks and risk ratios require external incidence information or a valid model for the sampling design. Always say which population and time period the estimand refers to.

For two independent groups, a large-sample standard error for the log risk ratio is

\[
SE\{\log(RR)\}=\sqrt{1/a-1/n_1+1/c-1/n_0},
\]

where \(a,c\) are event counts and \(n_1,n_0\) are group totals. For the odds ratio, the corresponding log-scale variance is \(1/a+1/b+1/c+1/d\) for the usual 2×2 table. These approximations become unstable with zero or very small cells; exact, penalized, or carefully justified continuity-corrected methods may be preferable. Do not silently add 0.5 to every cell: that can materially alter sparse-data estimates.

```r
tab <- matrix(c(30, 470, 20, 480), nrow = 2, byrow = TRUE,
              dimnames = list(group = c("treated", "control"),
                              outcome = c("event", "no_event")))
rr <- (tab[1, "event"] / sum(tab[1, ])) /
      (tab[2, "event"] / sum(tab[2, ]))
or <- (tab[1, "event"] * tab[2, "no_event"]) /
      (tab[1, "no_event"] * tab[2, "event"])
c(RR = rr, OR = or)
```

This example has risks of 6% and 4%, so RR=1.5 and OR≈1.53. If risks were 40% and 20%, the same OR would be 2.67 while RR would be 2. The odds ratio increasingly exaggerates the risk ratio as outcomes become common; “rare outcome” is a substantive approximation, not a universal cutoff.

For adjusted analyses, log-binomial regression models log risk but may fail to converge because fitted probabilities must stay below one. Modified Poisson regression with a log link and robust sandwich variance is a practical way to estimate adjusted risk ratios for binary outcomes. Logistic regression estimates conditional odds ratios; because of non-collapsibility, an adjusted OR can differ from the marginal OR even without confounding. To communicate absolute impact, predict risks under each exposure and average across the target covariate distribution.

## Causal and clinical interpretation

Association measures are not causal effects by themselves. In nonrandomized comparisons, control confounding using a defensible design and prespecified covariates, and address selection, measurement error, and positivity. A single adjusted coefficient cannot guarantee exchangeability. In randomized trials, the intention-to-treat risk ratio preserves the randomized assignment contrast; per-protocol effects require additional assumptions and methods for adherence.

Ratios omit baseline risk. An RR of 0.8 corresponds to 2 fewer events per 100 when control risk is 10%, but only 0.2 fewer per 100 when control risk is 1%. Report absolute risks and a risk difference alongside RR or OR, with confidence intervals and a common follow-up horizon. For time-to-event data, a hazard ratio is neither an RR nor an odds ratio; do not translate it into one without a survival model and assumptions about baseline hazard and competing events.

Common reporting failures include calling an odds ratio a “risk” ratio, interpreting an OR as a percentage reduction in probability, comparing ratios computed at different time horizons, and reporting only a p-value. State the numerator and reference group explicitly (for example, “risk in intervention divided by risk in control”). If an OR is used in a case-control study, explain the sampling rationale and avoid presenting absolute risk unless its estimation is supported by additional data.

- Greenland S, Senn SJ, Rothman KJ, et al. Statistical tests, P values, confidence intervals, and power: a guide to misinterpretations. *European Journal of Epidemiology*. 2016;31:337–350. https://doi.org/10.1007/s10654-016-0149-3
- Zou G. A modified Poisson regression approach to prospective studies with binary data. *American Journal of Epidemiology*. 2004;159:702–706. https://doi.org/10.1093/aje/kwh090
- Hernán MA, Robins JM. *Causal Inference: What If*. 2020. https://www.hsph.harvard.edu/miguel-hernan/causal-inference-book/

- Greenland S, Robins JM, Pearl J. Confounding and collapsibility in causal inference. *Statistical Science*. 1999;14:29–46. [doi:10.1214/ss/1009211805](https://doi.org/10.1214/ss/1009211805)

- Greenland S, Rothman KJ, Lachin JM. "Measures of Occurrence and Effect." In Rothman KJ, Greenland S, Lash TL (eds), *Modern Epidemiology*. Lippincott Williams & Wilkins.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Collett D. *Modelling Binary Data*. CRC Press.
- The [effect sizes article](../inference/effect-sizes.html) develops interpretation of relative versus absolute effects.
