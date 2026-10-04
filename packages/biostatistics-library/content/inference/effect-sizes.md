---
title: Effect sizes
summary: Measures of how large an association or treatment effect is - risk differences, risk ratios, odds ratios, hazard ratios, and standardised mean differences.
---

## Overview and key ideas

An **effect size** quantifies the magnitude of an association or a treatment effect. Unlike the p-value, which mixes magnitude with sample size, the effect size answers "how big is it?", and the confidence interval around it answers "how precisely is it estimated?"

For binary outcomes three scales are used most often:

| Measure | Definition | Typical use |
| --- | --- | --- |
| Risk difference (RD) | p1 - p2, the absolute change in risk | Trials; links directly to number needed to treat |
| Risk ratio (RR) | p1 / p2, the relative risk | Cohort studies and trials with a defined risk set |
| Odds ratio (OR) | (p1 / (1 - p1)) / (p2 / (1 - p2)) | Case-control studies; logistic regression |

For time-to-event outcomes the **hazard ratio** summarises the relative instantaneous risk over follow-up. For continuous outcomes the **mean difference** is used, and the **standardised mean difference** (Cohen's d = mean difference / pooled SD) expresses the effect in units of variability so that different endpoints can be compared, for example in a meta-analysis.

One decision aid that follows directly from the absolute scale is the **number needed to treat** (NNT): NNT = 1 / RD when the treatment is beneficial (number needed to harm, NNH = 1 / RD, when it is harmful). An NNT of 33 means 33 patients must be treated for one year to prevent one recurrent myocardial infarction in this example; it combines the effect size with the follow-up horizon and is often the single clearest number for clinicians and patients.

## When to use it

| Setting | Appropriate effect size |
| --- | --- |
| Randomised trial with a hard endpoint | RD with NNT, plus RR for context |
| Prospective cohort study | RR, or hazard ratio if follow-up times differ |
| Case-control study | OR (the only ratio the design can validly estimate) |
| Meta-analysis across different endpoints | Standardised mean difference |
| Policy or formulary decisions | RD and NNT, because they map to absolute impact |

## Assumptions and limitations

- The OR estimates the RR only when the outcome is rare; for common outcomes the OR exaggerates the strength of the association in whichever direction it points.
- RR and RD require a well-defined population at risk with known follow-up; the hazard ratio additionally assumes the proportional hazards condition holds over the follow-up window of interest.
- The SD in Cohen's d is estimated from the data and differs between populations; the 0.2 / 0.5 / 0.8 "small / medium / large" thresholds are rules of thumb, not clinical truths.
- Relative measures can make tiny absolute effects look dramatic: a 50% reduction of a baseline risk of 1 in 10,000 still halves something negligible.

## Worked example

A trial randomises 500 patients with acute coronary syndrome to an intensive antiplatelet strategy and 500 to standard care. At 12 months, 25 of 500 (5%) versus 40 of 500 (8%) in the two arms have a recurrent myocardial infarction. The risk difference is 8% - 5% = 3% (number needed to treat = 1/0.03 = 33); the risk ratio is 5/8 = 0.625; the odds ratio is (25 x 460) / (475 x 40) = 0.605. The OR is close to, but slightly more extreme than, the RR because the outcome, at 5-8%, is no longer rare. Reporting only the RR ("a 37.5% relative reduction") would overstate the benefit for a clinician deciding about an individual patient; the 3% absolute reduction, with its confidence interval, is the number that drives the treatment decision.

## Interpretation and common pitfalls

- **Reporting only the relative effect.** Pair every RR or OR with the absolute risk difference so readers can see the baseline risk it acts on.
- **Reading an OR as if it were an RR** when the outcome is common - it exaggerates the association.
- **Letting the p-value, not the effect size, carry the conclusion.** A statistically significant 1 mmHg blood pressure difference is "significant" but clinically unimportant.
- **Choosing the most flattering scale.** RR and RD tell different stories when baseline risk is extreme; prespecify the primary measure and report the others alongside it.

## Calculating absolute and relative effects together

In the trial example, intensive treatment has risk 25/500=0.05 and
standard care 40/500=0.08. Defining benefit as standard care minus
intensive treatment, the absolute risk reduction is 0.03 and the relative
risk reduction is \(1-0.05/0.08=0.375\), or 37.5%. The odds ratio is
\((25/475)/(40/460)=0.605\). These statements are all correct, but answer
different questions. If the untreated risk were only 0.008, the same RR of
0.625 would imply an absolute reduction of 0.003 and NNT about 333, not
33. NNT must always name the outcome and time horizon; “NNT=33” without
“to prevent one recurrent MI over 12 months” is incomplete.

The point estimate of NNT is reciprocal to the risk difference, so its
uncertainty behaves nonlinearly. If the 95% CI for absolute benefit is
0.005 to 0.055, the corresponding NNT interval is about 18 to 200. If the
risk-difference interval crosses zero, reciprocal transformation produces
two disjoint regions: possible benefit (positive NNT) and possible harm
(negative NNT/NNH). Do not report a single finite NNT interval across zero.
For decision making, retain the RD and its interval as primary and treat
NNT as a transformed, horizon-specific aid.

```r
treated_events <- 25; treated_n <- 500
control_events <- 40; control_n <- 500
p_t <- treated_events / treated_n
p_c <- control_events / control_n
rd_benefit <- p_c - p_t
rr <- p_t / p_c
or <- (treated_events * (control_n - control_events)) /
      ((treated_n - treated_events) * control_events)
c(RD_benefit = rd_benefit, RR = rr, OR = or,
  NNT = 1 / rd_benefit)
```

This simple computation returns point estimates only. Use a method that
accounts for binomial uncertainty to obtain intervals (for example, a
Newcombe interval for risk difference or a log-scale interval for RR/OR).
For adjusted analyses, obtain standardized marginal risks by predicting
each participant under both treatment conditions and averaging over a
defined target covariate distribution. Exponentiating a logistic coefficient
gives a conditional OR; it is not generally the marginal OR, even without
confounding, because odds ratios are non-collapsible. The two quantities
answer distinct questions and should not be conflated.

## Continuous outcomes and standardisation

For an unadjusted mean difference, retain the native units whenever they
are interpretable: a 4-mmHg systolic-pressure difference is more useful
than “0.27 SD.” Cohen's d divides the mean difference by a pooled within
group SD. In a two-arm design, Hedges' g applies a small-sample correction
to reduce d's upward bias. Standardisation facilitates synthesis across
scales but makes the denominator population-dependent: the same absolute
change yields a larger d in a homogeneous sample than in a heterogeneous
one. In repeated-measures designs, standardised change depends on whether
the denominator is the baseline SD, final SD, or SD of paired differences;
state the convention because values are not directly interchangeable.

For skewed outcomes, a ratio of geometric means or a difference in
medians may be more faithful than a standardised mean difference. For
ordinal patient-reported outcomes, proportional odds or a probability of
superiority can preserve rank interpretation. No universal “small,”
“medium,” or “large” threshold substitutes for clinical context, baseline
risk, treatment burden, harms, and patient preferences.

## Time-to-event and heterogeneity

A hazard ratio compares instantaneous event rates among people who remain
at risk; it is not a ratio of cumulative probabilities. With nonproportional
hazards, one HR may obscure early benefit and later harm. Report survival
probabilities at clinically relevant times, a difference in restricted
mean survival time, or another estimand aligned with the question. In
observational studies, association measures also depend on confounding
control and selection; an adjusted effect is conditional on model choices
and does not automatically represent a causal effect. Report both absolute
and relative effects with intervals and make the reference group, event
definition, follow-up duration, and adjustment set explicit.

## Baseline risk, transportability, and adjusted effects

Relative effects do not determine absolute benefit without a baseline risk.
If a treatment has RR=0.75, a control risk of 20% implies a treated risk of
15%, an RD of −5 percentage points, and NNT 20 over the stated horizon.
At a control risk of 2%, the same RR implies a treated risk of 1.5%, RD
−0.5 points, and NNT 200. This is why trial results transported to a
population with a different baseline risk can have a different absolute
impact even if the relative effect is stable. Conversely, assuming a
constant RR across populations is itself an assumption that may fail when
effect modifiers or care pathways differ.

For a common outcome, an OR can be translated to a risk only when baseline
risk is known: \(p_1=OR\,p_0/(1-p_0+OR\,p_0)\). For example, OR=0.60 at
control risk 0.20 corresponds to treated risk
\(0.12/(0.80+0.12)=0.130\), giving RR≈0.65—not RR=0.60. At low baseline
risk, OR and RR converge. This conversion is a useful communication
device, but the baseline risk must come from a relevant population and
the OR's conditional or marginal interpretation must be clear.

Adjusted treatment effects require care in choosing the scale. A logistic
model coefficient is a conditional OR holding covariates fixed. The
marginal RD or RR can be more useful for policy because it averages
predicted risks across a target population. Standardization estimates
these risks by predicting each eligible subject under each treatment and
averaging; the contrast of those averages is then reported with an interval
that accounts for model estimation. In observational work, a causal
interpretation also requires exchangeability, consistency, positivity, and
adequate handling of missingness and selection. A sophisticated estimator
does not make those assumptions automatically true.

## Effect modification and subgroup presentation

## Translating effects into expected event counts

## Choosing a scale for clinical communication

The best effect scale often depends on who will use the result. Clinicians
may need absolute risk differences to discuss expected benefit with a
patient; epidemiologists may use relative measures to compare associations
across populations; health-system planners may need events prevented per
1,000 eligible people and a fixed budget impact. A complete report can
present all these views without implying they are competing answers.
State the denominator and time horizon beside every absolute estimate and
name the comparator beside every ratio.

For example, a 25% relative reduction may sound large, but if control risk
is 4%, treated risk is 3%, an absolute reduction of one percentage point.
If the control risk is 40%, the same RR implies treated risk 30%, an
absolute reduction of ten points. Conversely, equal RDs can represent
different proportional changes at different baselines. Absolute and
relative scales are mathematically linked once baseline risk is given, but
they emphasize distinct aspects relevant to choices and resource
allocation.

For continuous outcomes, translate standardized effects back to a familiar
unit when a credible SD is available. If Hedges' g is 0.30 and the relevant
SD is 10 points on a symptom scale, this corresponds roughly to a 3-point
mean difference. The translation should use a representative SD and
should not be mistaken for a guarantee that an individual improves by
three points. For outcomes with a known minimally important difference,
report the probability or proportion exceeding that threshold when the
analysis supports it, alongside the average effect.

Absolute effects can be made more concrete by applying a risk difference to
a target population. If an intervention prevents 3 events per 100 people
over one year and 10,000 eligible patients are treated, the expected
reduction is about 300 events, assuming the trial effect transports to
those patients and treatment uptake is complete. If only 70% adhere, the
impact may be smaller, though a per-protocol adjustment needs causal
assumptions rather than a simple multiplication. A benefit of 3 per 100
should be accompanied by adverse-event effects on the same time horizon;
net benefit depends on event severity and patient preferences.

For rare outcomes, risk ratios can look large while event counts remain
small. Reducing risk from 2 per 10,000 to 1 per 10,000 halves relative
risk, yet prevents only one event per 10,000 treated; an NNT of 10,000 may
not justify substantial burden or cost. In contrast, a modest relative
effect on a frequent, serious outcome can prevent many events. Present
baseline and treated risks per a clear denominator (for example per 1,000
people over five years), the difference, and uncertainty. This avoids
relying on relative language such as “50% lower” without context.

Competing risks further complicate absolute event measures. If death
prevents a nonfatal outcome from occurring, a cause-specific hazard ratio
does not directly equal the difference in cumulative incidence. Use a
competing-risk estimand appropriate to the question and report cumulative
incidence by time point. Likewise, censoring in a survival analysis can
make simple event proportions misleading when follow-up differs. Effect
size is inseparable from how the endpoint and follow-up are defined.

When effects differ across patient groups, a single average can obscure
clinically important variation. Report subgroup estimates with intervals
and test or estimate the interaction directly; “significant in group A,
nonsignificant in group B” does not establish that the groups differ. On
the additive scale, interaction concerns differences in risk differences;
on the multiplicative scale it concerns ratios of ratios. Effect
modification is scale-dependent, so specify the scale that maps to the
decision. Subgroup findings are often imprecise and multiple, and should
be distinguished as prespecified confirmatory analyses or exploratory
hypothesis generation.

For meta-analysis, between-study heterogeneity means that a pooled mean
effect may not apply to every setting. A random-effects mean, prediction
interval, and study-level context communicate different pieces of evidence.
Standardised mean differences facilitate pooling but should be translated
back to a familiar scale when possible. Keep the clinical endpoint and
absolute event rates visible so readers do not mistake a standardized or
relative summary for an individual patient's expected benefit.

## Precision for a risk difference and transformed measures

For two independent event risks, a first-order standard error for the
risk difference is
\(\sqrt{p_1(1-p_1)/n_1+p_0(1-p_0)/n_0}\). With 25/500 versus 40/500,
this is \(\sqrt{0.05(0.95)/500+0.08(0.92)/500}=0.0156\), or 1.56
percentage points. A simple normal interval for benefit (control minus
treatment, 3 points) is approximately 0.03 ± 1.96(0.0156), or −0.0005 to
0.0605. The interval crosses zero; a score-based Newcombe
interval is preferable to relying on this boundary-sensitive Wald
calculation. The reciprocal range maps to a very broad NNT range (about
17 to several thousand), illustrating how unstable NNT becomes when the
absolute effect is near zero.

```r
n1 <- n0 <- 500
p1 <- 25 / n1  # treatment
p0 <- 40 / n0  # control
rd <- p0 - p1
se_rd <- sqrt(p0 * (1 - p0) / n0 + p1 * (1 - p1) / n1)
c(rd = rd, lower_wald = rd - 1.96 * se_rd,
  upper_wald = rd + 1.96 * se_rd)
```

The code intentionally labels the interval Wald; do not treat its narrow
positive lower bound as robust evidence that benefit is nonzero. Score
intervals generally behave better for small risks. The point estimate NNT
is 33.3, but its interval should be derived from a suitable RD interval and
reported with the follow-up horizon.

## Relative effects are estimand-specific

Risk ratios compare cumulative risks by a fixed time; incidence rate ratios
compare events per person-time; odds ratios compare odds; and hazard ratios
compare instantaneous event rates among those still event-free. They are
not interchangeable. If follow-up varies, a risk ratio requires a common
horizon and censoring handled appropriately. A rate ratio can exceed 1
without representing a probability ratio. A hazard ratio under
nonproportional hazards can average changing relative hazards in a way
that is difficult to interpret clinically. Report survival or cumulative
incidence at meaningful time points alongside the HR where appropriate.

In case-control sampling, the sampling fractions fix numbers of cases and
controls, so absolute disease risk and the risk ratio generally cannot be
estimated from the sampled table alone; the odds ratio remains estimable
under standard sampling schemes. In cohort data, logistic regression also
estimates an OR, but when outcome risk is common that OR can be far from
the risk ratio. Modified Poisson models with robust variance can estimate
adjusted RRs for binary outcomes, while standardization from a logistic
model can estimate marginal risks and contrasts. Choose a measure that
matches study design and stakeholder decisions, not whichever gives the
most dramatic number.

## References and further reading

- Cochrane. [Handbook, Chapter 6: Choosing effect measures and computing estimates of effect](https://training.cochrane.org/handbook/current/chapter-06).
- Altman DG, Andersen PK. [Calculating the number needed to treat for trials where the outcome is time to an event](https://doi.org/10.1136/bmj.319.7223.1492). *BMJ*. 1999;319:1492–1495.
- Agresti A. *Categorical Data Analysis*. Wiley.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Hedges LV, Olkin I. *Statistical Methods for Meta-Analysis*. Academic Press, 1985.
- Cummings P. The new statistics: why and how. *Journal of Child Psychology and Psychiatry*. 2012;53(10):1015–1024. [doi:10.1111/j.1469-7610.2012.02554.x](https://doi.org/10.1111/j.1469-7610.2012.02554.x)
