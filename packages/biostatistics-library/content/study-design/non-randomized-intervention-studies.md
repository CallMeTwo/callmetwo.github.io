---
title: Non-randomized intervention studies
summary: How to estimate intervention effects when assignment is not randomized, using explicit causal questions and quasi-experimental designs.
---

## Overview and key ideas

A **non-randomized intervention study** evaluates an intervention whose assignment is determined by clinicians, patients, institutions, policy, or logistics rather than chance. Examples include a new discharge program introduced at selected hospitals, a law implemented in some regions, or a treatment chosen according to clinical severity. These studies may be prospective or retrospective and may include comparison groups and repeated measurements.

Because the intervention groups can differ before treatment, an observed outcome difference mixes the intervention effect with **selection and confounding**. Statistical adjustment can help only for measured, adequately modeled factors. A useful starting point is to specify the target question as if a trial could be run: eligible population, treatment strategies, assignment time, follow-up, outcome, and causal contrast. This target-trial framing helps avoid immortal-time bias, misaligned eligibility and treatment assignment, and inappropriate comparator selection.

**Quasi-experimental designs** strengthen causal inference by exploiting a policy threshold, rollout timing, comparison series, or other assignment mechanism. They do not remove assumptions; they make the identifying assumptions more explicit and sometimes more plausible.

## When to use it

Use these designs when randomization is infeasible, unethical, or unavailable, or when evaluating real-world policies and service changes. Common approaches include:

| Design | Core comparison | Key identifying idea |
| --- | --- | --- |
| Difference-in-differences | Change in treated units versus change in comparison units | In the absence of intervention, average outcome trends would have been parallel |
| Interrupted time series | Outcome level and trend before versus after intervention | No coincident event or change in measurement explains the post-intervention shift |
| Regression discontinuity | Units just above versus below an assignment cutoff | Near the cutoff, potential outcomes vary smoothly and the cutoff is not manipulated |
| Instrumental variables | Outcome differences induced by an instrument | Instrument affects treatment, is independent of potential outcomes, and affects outcome only through treatment (plus design-specific assumptions) |
| Propensity score weighting or matching | Outcomes among measured-covariate comparable groups | Conditional exchangeability, positivity, consistency, and correct enough estimation |

When treatment starts at different times across places, the analysis must account for treatment timing and potentially different effects by cohort and time since adoption. A simple two-way fixed-effects coefficient can be misleading under staggered adoption and heterogeneous effects.

## Assumptions and limitations

- **Exchangeability / no unmeasured confounding:** Conditional on measured covariates or the quasi-experimental design, treatment assignment is independent of relevant potential outcomes. This cannot generally be verified from observed data alone.
- **Consistency and well-defined treatment:** “Intervention” must represent sufficiently clear strategies. Different versions, uptake, and co-interventions can make the causal contrast ambiguous.
- **Positivity:** For covariate patterns in the target population, there must be a realistic chance of receiving each strategy. Extreme propensity weights signal weak overlap and unstable extrapolation.
- **Difference-in-differences:** Parallel trends concerns the untreated potential outcomes, not merely similar observed baseline levels. Similar pre-trends are supportive but cannot prove future parallel trends. Anticipation, spillovers, changing group composition, or concurrent policies can violate the design.
- **Interrupted time series:** Enough observations are needed before and after; seasonality, autocorrelation, secular trends, and concurrent events must be modeled. A single before-after contrast is not a robust time-series analysis.
- **Regression discontinuity:** The assignment rule must be enforced around a known cutoff; inspect manipulation and covariate continuity. The effect is local to units near that cutoff.
- **Instrumental variables:** The exclusion restriction is especially demanding and usually not testable directly. The estimate often applies to compliers, not every patient.
- **Outcome and follow-up:** Differential outcome ascertainment, loss to follow-up, and competing events can bias estimates even when the assignment design is credible.

## Worked example

A health system introduces a pharmacist-led discharge service at 8 hospitals. Eight similar hospitals do not introduce it during the same period. Thirty-day readmission falls from 18% to 14% in intervention hospitals and from 16% to 15% in comparison hospitals.

The unadjusted difference-in-differences estimate is:

`(14% − 18%) − (15% − 16%) = −4% − (−1%) = −3 percentage points.`

This estimate says readmission declined 3 percentage points more in the intervention hospitals, under the parallel-trends and other assumptions. It is not automatically causal: the service may have been introduced in hospitals already improving faster, or another discharge policy may have changed at the same time. Several pre-intervention periods, a prespecified comparison group, case-mix trends, implementation timing, and negative-control outcomes can help assess credibility. The standard error must reflect hospital-level assignment; treating every patient as independent would overstate precision.

## Interpretation and common pitfalls

- Label the estimate as causal only when the design's assumptions are credible, not because a regression adjusted for many covariates.
- Draw a causal diagram or write the assignment process in words before choosing adjustment variables. Adjusting for mediators or colliders can introduce bias.
- Avoid “significant pre-trend test = parallel trends.” Such tests can have low power; substantively assess pre-intervention trajectories and use sensitivity analysis.
- Do not compare a post-intervention group with a historically convenient control without addressing secular change and composition.
- Report the target population, treatment strategies, estimand, assumptions, diagnostics, and sensitivity analyses. If assumptions are weak, present the finding as an association and explain what would change the conclusion.
- For staggered adoption, select methods suited to treatment timing and heterogeneous effects rather than relying automatically on a conventional two-way fixed-effects model.

## References and further reading

- Hernán MA, Wang W, Leaf DE. [Target trial emulation: a framework for causal inference from observational data](https://doi.org/10.1001/jama.2022.21383). *JAMA*. 2022;328(24):2446–2447.
- Hernán MA, Robins JM. [Using big data to emulate a target trial when a randomized trial is not available](https://doi.org/10.1097/EDE.0000000000000477). *Epidemiology*. 2016;27(3):335–338.
- Zeldow B, Hatfield LA. [Confounding and regression adjustment in difference-in-differences studies](https://doi.org/10.1111/1475-6773.13666). *Health Services Research*. 2021;56(5):932–941.
- The library's [bias and confounding article](bias-and-confounding.html) reviews confounding and adjustment; [randomized controlled trials](randomized-controlled-trials.html) describes the design benchmark these approaches seek to approximate.
