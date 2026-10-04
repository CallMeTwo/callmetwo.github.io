---
title: Interim analysis and monitoring in randomized trials
summary: Prespecified looks at accumulating trial data for efficacy, futility, and safety, with control of false-positive risk and trial integrity.
---

## Overview and key ideas

An **interim analysis** evaluates accumulating randomized-trial data before planned follow-up is complete. A trial may monitor efficacy, lack of likely benefit (futility), and harm or other safety outcomes. Monitoring can protect participants, avoid continuing a clearly unpromising study, or allow a compelling benefit to be acted on sooner.

Repeatedly checking ordinary p-values and stopping the first time one falls below 0.05 inflates the probability of a false positive. Interim monitoring therefore needs a **prospective design**: define the outcomes, timing or information fractions, stopping criteria, decision roles, and final analysis before unblinded comparative results are examined. Group-sequential designs set boundaries across scheduled looks; alpha-spending functions allocate the overall type I error over information time. O’Brien–Fleming-type boundaries spend very little alpha early and approach the conventional final boundary later; Pocock-type boundaries are more similar across looks. Lan–DeMets spending permits some flexibility in exact look timing while preserving the planned overall error control under its design conditions.

An independent data monitoring committee may review unblinded comparative data while investigators and the sponsor remain blinded to treatment-specific results. The committee considers clinical context and total evidence, not a p-value in isolation.

## When to use it

Plan formal interim efficacy analyses when an early result could plausibly change clinical or ethical decisions and the trial can accrue adequate information for a meaningful look. Safety monitoring may occur more often, with rules adapted to the event's severity, expectedness, and clinical actionability. Futility boundaries can be **non-binding** (ignoring them does not alter type I error control under the specified design) or binding; the protocol and statistical analysis plan should state which.

For a fixed sample size and follow-up, routine interim looks may add little value if the treatment effect is unlikely to emerge early or no realistic early decision would change care. Monitoring is also distinct from unplanned “peeking”: a prespecified data review and stopping plan is part of the design.

## Assumptions and limitations

- **Type I error control:** Efficacy boundaries must be calibrated for the planned number and timing of looks, endpoint, test statistic, and correlation structure. Changing these after seeing unblinded outcomes can invalidate nominal error control.
- **Information time:** Looks are commonly based on the fraction of total statistical information accrued, not simply elapsed calendar time. Event-driven trials may reach information fractions unevenly.
- **Futility is not proof of no effect:** A futility recommendation means the design-specific chance of eventual success is low enough to stop under the chosen rule. It does not establish equivalence or exclude clinically meaningful effects.
- **Early stopping can exaggerate effects:** Trials that stop at an extreme interim estimate tend to report larger effects than the underlying effect. Estimates and confidence intervals may need design-aware adjustment.
- **Safety and efficacy differ:** Rare, delayed, or subgroup-specific harms may not be visible at an efficacy look. Stopping for benefit does not replace continued safety follow-up when needed.
- **Operational bias:** Leakage of interim results can alter recruitment, adherence, outcome assessment, or co-interventions. Committee charters, access controls, and documented recommendations protect trial integrity.
- **Multiplicity:** Multiple endpoints, doses, subgroups, and adaptations also create multiplicity. An interim alpha plan does not automatically address every other multiplicity source.

## Worked example

A two-arm trial plans a two-sided overall type I error of 0.05 and one interim efficacy look at 50% of planned information, followed by the final analysis. Under an illustrative O’Brien–Fleming design, the nominal two-sided boundary at the interim look is about `p = 0.005`, while the final boundary is close to `p = 0.049` (exact values depend on the design and implementation).

Suppose the interim analysis yields `p = 0.02`. This would meet an unadjusted 0.05 threshold, but it does **not** cross the stricter interim efficacy boundary, so the trial continues. If the final test later gives `p = 0.03`, it can meet the planned final boundary. The allocation of alpha across looks keeps the probability of a false efficacy rejection near 0.05 under the model and assumptions. The numbers are illustrative; the trial team should use design software and report the exact information fractions and boundaries in its protocol.

## Interpretation and common pitfalls

- Never stop at the first nominal `p < 0.05` unless that rule was itself part of a valid design; ordinary repeated testing is not a group-sequential plan.
- Do not treat interim futility as evidence that treatments are equal. Report the conditional or predictive probability criterion and the uncertainty in the estimated effect.
- Do not let an interim estimate replace the prespecified estimand or analysis population. Continue outcome follow-up when needed to estimate effects and characterize safety.
- Prespecify who sees unblinded data, who makes recommendations, and how recommendations are documented. Keep adaptations blind where feasible.
- Report the stopping boundary, number and timing of looks, alpha-spending rule, actual information fraction, stopping decision, and any design-adjusted inference.

## References and further reading

- U.S. Food and Drug Administration. [Adaptive Design Clinical Trials for Drugs and Biologics: Guidance for Industry](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/adaptive-design-clinical-trials-drugs-and-biologics-guidance-industry). 2019.
- European Medicines Agency. [ICH E9: Statistical Principles for Clinical Trials](https://www.ema.europa.eu/en/ich-e9-statistical-principles-clinical-trials-scientific-guideline).
- Lan KKG, DeMets DL. [Discrete sequential boundaries for clinical trials](https://doi.org/10.1093/biomet/70.3.659). *Biometrika*. 1983;70(3):659–663.
- Jennison C, Turnbull BW. *Group Sequential Methods with Applications to Clinical Trials*. Chapman & Hall/CRC; 2000.
- The library's [statistical analysis plans article](../practice/statistical-analysis-plans.html) discusses prespecification and [type I and type II errors](../inference/type-i-and-type-ii-errors.html) explains the error rates interim boundaries control.
