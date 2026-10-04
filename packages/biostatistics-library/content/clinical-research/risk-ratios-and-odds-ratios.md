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

- Greenland S, Robins JM, Pearl J. Confounding and collapsibility in causal inference. *Statistical Science*. 1999;14:29–46. [doi:10.1214/ss/1009211805](https://doi.org/10.1214/ss/1009211805)

- Greenland S, Rothman KJ, Lachin JM. "Measures of Occurrence and Effect." In Rothman KJ, Greenland S, Lash TL (eds), *Modern Epidemiology*. Lippincott Williams & Wilkins.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Collett D. *Modelling Binary Data*. CRC Press.
- The [effect sizes article](../inference/effect-sizes.html) develops interpretation of relative versus absolute effects.
