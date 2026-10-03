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

## References and further reading

- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott-Raven.
- Agresti A. *Categorical Data Analysis*. Wiley.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
