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

## Design quantities and operating characteristics

An interim plan starts from the final inferential objective. Define the endpoint and estimand, test statistic, directionality, overall type I error, target power, maximum sample size or information, and clinically meaningful effect. Group-sequential theory exploits correlation among cumulative test statistics: data at a later look include earlier participants, so the tests are not independent. Boundaries are calibrated to the joint distribution of the sequence, not by dividing 0.05 mechanically by the number of looks (although conservative Bonferroni approaches exist).

Information fraction is the ratio of accrued to planned statistical information. For a simple normal endpoint with equal variance and allocation, it is approximately the fraction of total sample size with observed outcomes. In event-driven survival trials, it is usually related to the fraction of target events observed. Calendar time can be a poor proxy if enrollment or outcome accrual is uneven. Boundaries should be based on the actual design information metric, and timing deviations should be documented.

A group-sequential design specifies efficacy boundaries `u_k` for standardized statistics `Z_k` at information fractions `t_k`. Stop for efficacy if a boundary is crossed, subject to the prespecified direction and multiplicity scheme. O’Brien–Fleming boundaries are high early and close to the ordinary final critical value late; Pocock boundaries are more nearly constant. Neither is universally best. Early stopping probability depends on the true effect, accrual, and boundary. Expected sample size reductions are greatest for very large effects; under modest effects, a trial may almost always reach its maximum.

Lan–DeMets alpha spending expresses cumulative type I error spent by information time, allowing approximate flexibility in the exact timing of looks. Common spending shapes mimic O’Brien–Fleming or Pocock designs. The actual boundary is recalculated using observed information and the selected spending function. Flexibility does not authorize arbitrary repeated unblinded review, changes in endpoints, or unplanned looks without recalibration. For unplanned looks or design changes, involve the trial statistician and committee before access to treatment comparisons.

## Efficacy, futility, and safety are different decisions

An efficacy boundary is designed around a specified false-positive criterion. Futility asks whether continuing has a sufficiently low probability of success or value. **Conditional power** calculates the probability of crossing the final efficacy boundary given current results and an assumed future effect. It depends strongly on that assumed effect: observed-effect conditional power can be pessimistic after regression to the mean, while design-effect conditional power can be optimistic if the target effect is no longer plausible. Predictive power averages over uncertainty in the future effect, often using a prior. A futility rule should state the quantity, threshold, and whether it is binding.

A nonbinding futility boundary can be crossed without changing the formal efficacy type I error calculation if the trial continues, because the efficacy test still follows its planned rule. A binding futility boundary is part of the stopping design. In either case, stopping for futility is not proof of no clinically meaningful effect. It is a resource or value judgment conditional on the data, assumptions, and continuation rule. Report the observed conditional/predictive probability and the clinical margin considered.

Safety monitoring is not simply efficacy monitoring with the sign reversed. Harms may be rare, delayed, severity-weighted, or concentrated in subgroups. A safety committee may use event counts, exposure-adjusted rates, Bayesian hierarchical models, external data, or clinical case review. Formal statistical thresholds must be interpreted with biological plausibility, multiplicity, data quality, and actionability. A trial can stop treatment while maintaining follow-up to characterize outcomes. Stopping efficacy early should not erase planned ascertainment of longer-term harms.

## Type I error and estimation after stopping

A valid group-sequential test controls the probability of false rejection at the planned level under its assumptions. Repeated nominal p-values do not. Early stopping at a favorable extreme also creates a winner's curse: conditional on having crossed a boundary, the observed effect tends to overstate the true effect. The usual maximum-likelihood point estimate may be biased, especially after early stopping. Median-unbiased estimates, stagewise ordering methods, and confidence intervals compatible with the stopping rule can improve inference. State whether reported intervals are adjusted; ordinary fixed-sample intervals may not have their nominal unconditional coverage after a sequential stopping decision.

Multiplicity extends beyond interim looks. Several primary endpoints, doses, populations, or treatment comparisons need an overall strategy. A spending function for one endpoint does not automatically control family-wise error across endpoints. If adaptations include sample-size re-estimation, treatment selection, or population enrichment, describe the adaptation algorithm and its impact on estimands and error control. Blinded nuisance-parameter re-estimation may preserve type I error in some settings but still needs prespecification and operational controls.

## Worked calculation and R implementation

Suppose a normally distributed endpoint has a planned final standardized test statistic and two looks at 50% and 100% information. An illustrative O’Brien–Fleming plan has a stringent interim critical value near 2.8 (two-sided p roughly 0.005) and a final critical value near 1.98 (p roughly 0.048). Exact values depend on the spending function and implementation. If interim `Z=2.1`, ordinary two-sided `p≈0.036` does not cross the interim boundary; the trial continues. If final `Z=2.0`, the final boundary may be crossed. The nominal 0.05 test at each look would have a larger cumulative false-positive probability than 0.05.

A reproducible R design can be generated with a package such as `gsDesign` (install it in an R environment where CRAN access is available):

```r
library(gsDesign)
gs <- gsDesign(k = 2, test.type = 3, alpha = 0.05, beta = 0.20,
                sfu = sfLDOF, timing = c(0.5, 1))
gs$upper$bound
```

The printed boundary is on the standardized Z scale. Consult the package version's documentation and record software/version, sidedness, information fractions, and spending function in the protocol. This code illustrates a design object; it does not replace sample-size calculations based on the actual endpoint, allocation, censoring, and effect scale.

## Governance and reporting

The data monitoring committee should have a charter covering membership, conflicts, access to unblinded data, meeting schedule, confidentiality, recommendation categories, and communication with the sponsor. The committee advises; governance documents specify who makes the final decision and how safety obligations are fulfilled. Separate the committee's unblinded report from investigators' blinded operational reports. Enrollment, endpoint adjudication, and outcome management should continue without revealing comparative trends. Even apparently innocuous disclosures, such as the number of boundary crossings or conditional power, can compromise blinding.

The protocol and statistical analysis plan should identify planned looks, information targets, boundaries or spending function, efficacy and futility rules, safety review, multiplicity, estimation after stopping, and handling of missed or delayed looks. Final reporting should include planned and actual information fractions, number of looks, results against boundaries, committee recommendations and actions (at an appropriate level), stopping rationale, follow-up after stopping, and design-adjusted inference. A transparent report lets readers distinguish a designed sequential trial from a trial that stopped after informal repeated testing.


## Planning the monitoring architecture

Monitoring decisions are easier to defend when the protocol distinguishes statistical rules from governance. The statistical charter specifies what evidence will be presented, how information time is computed, and what boundaries or predictive probabilities trigger a recommendation. The committee charter states who reviews unblinded data, how urgent safety concerns are communicated, and how conflicts are handled. The sponsor and investigators should not receive comparative information that could alter recruitment or care, while the committee should receive the clinical context needed to interpret accumulating results.

Plan for operational contingencies: a scheduled look may be delayed by incomplete outcome adjudication, unexpectedly low event accrual, or data-quality concerns. Prespecify whether the analysis waits for a target information fraction, uses a permitted window, or is omitted. If actual timing differs, a Lan–DeMets approach may recalculate a boundary, but unplanned analyses still require statistical review. Define a process for urgent safety review outside the efficacy schedule; participants should not wait for a formal boundary if a serious unexpected hazard requires action.

Information fractions are not interchangeable across endpoints. A continuous outcome's information may depend on outcome variance and allocation; a binary endpoint's information depends on event frequency; a survival endpoint is often event driven. Blinded nuisance-parameter updates can revise sample size in certain designs without examining comparative treatment effects. Unblinded sample-size changes, population adaptations, and treatment selection can affect error control and estimands and therefore require a design-specific combination or conditional-error method.

## Simulating trial operating characteristics

Analytical boundaries rely on assumptions about the test statistic's joint distribution. Simulation is useful when outcomes are non-normal, accrual is irregular, missingness is substantial, or the design includes complex adaptations. Under each scenario, generate trial data according to the planned randomization, accrual, outcome, censoring, and analysis; apply the exact stopping and final-analysis rules; then summarize false-positive probability, power, expected sample size, probability of stopping at each look, and estimation bias. Include null scenarios beyond a single point null when nuisance parameters matter, and explore plausible deviations such as delayed effects or nonproportional hazards.

Simulation does not replace mathematical validation. Check code against known special cases and independent implementations; set and record random seeds; estimate Monte Carlo error. If 10,000 null simulations yield a rejection rate near 0.05, its Monte Carlo standard error is approximately `sqrt(.05*.95/10000)=0.0022`. Report enough simulation runs and uncertainty to show whether observed operating characteristics meet design tolerances. Review code independently, particularly around skipped looks, ties at boundaries, and missing endpoint data.

The final decision may consider factors beyond the efficacy boundary, including external evidence, feasibility, data integrity, subgroup safety, and changing standard of care. These are legitimate committee considerations, but the final report should state which were statistical criteria and which were broader clinical or operational judgments. This preserves confidence that the trial did not relabel an unplanned decision as a prespecified test.


## Ethical interpretation and patient follow-up

Interim monitoring sits between statistical error control and ethical oversight. A boundary crossing is evidence under a planned statistical rule, not an automatic instruction to stop. The committee weighs effect magnitude, uncertainty, outcome severity, consistency across endpoints, safety, data quality, and whether the result is likely to change practice. Conversely, a trial can have a compelling safety concern before a formal statistical threshold is crossed. The stopping process should allow urgent action while maintaining a clear record of the evidence and rationale.

Early efficacy stopping can limit information about durability, rare harms, subgroups, and treatment-effect heterogeneity. If treatment is stopped, continue scheduled follow-up when feasible and clarify whether follow-up is under assignment or actual treatment received. Participants should not lose access to outcome monitoring merely because the efficacy question appears settled. Communicate results without implying that an early, extreme estimate is an unbiased estimate of long-term benefit.

Consent documents can explain that an independent committee periodically reviews safety and trial progress without promising that individual participants or investigators will receive interim comparisons. Public registration and protocols should disclose the monitoring plan at an appropriate level while protecting confidential unblinded data. At trial completion, report deviations from the original monitoring plan and explain whether they could affect inference.

### Sample size savings and expected duration

The maximum sample size is not the expected sample size. Under a null effect, a conservative O’Brien–Fleming design often uses close to the maximum information because early crossing is rare. Under a very large effect, early stopping can substantially reduce expected sample size. Under a modest but clinically relevant effect, the trial may still need near-maximum information. Design comparisons should therefore report expected sample size under several treatment-effect scenarios, not just the best-case saving. Enrollment duration and follow-up duration can also differ: a time-to-event trial may stop recruitment for efficacy but require continued follow-up to estimate survival.


## Boundary interpretation and final reporting details

A boundary is defined for a particular statistic and direction. In a two-sided efficacy plan, superiority in either direction may trigger a boundary; in a one-sided plan, the favored direction is prespecified. The phrase “nominal p-value at the interim” can be ambiguous: report the observed test statistic, its ordinary fixed-sample p-value, and the design-specific boundary or adjusted p-value. When testing noninferiority or equivalence, account for the margin, direction, and multiplicity; early evidence of no superiority does not establish noninferiority.

If a look is skipped, do not simply pretend it occurred or reset alpha. The design and spending function determine how cumulative error changes with actual information time. If the endpoint data arrive in batches, information may be estimated with delay; the protocol should describe whether the committee receives incomplete data and how final analysis handles outcomes that mature later. A change in outcome variance or event rate can alter information even with the planned number of participants, which is another reason to use information-based timing.


## References and further reading

- U.S. Food and Drug Administration. [Adaptive Design Clinical Trials for Drugs and Biologics: Guidance for Industry](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/adaptive-design-clinical-trials-drugs-and-biologics-guidance-industry). 2019.
- European Medicines Agency. [ICH E9: Statistical Principles for Clinical Trials](https://www.ema.europa.eu/en/ich-e9-statistical-principles-clinical-trials-scientific-guideline).
- Lan KKG, DeMets DL. [Discrete sequential boundaries for clinical trials](https://doi.org/10.1093/biomet/70.3.659). *Biometrika*. 1983;70(3):659–663.
- Jennison C, Turnbull BW. *Group Sequential Methods with Applications to Clinical Trials*. Chapman & Hall/CRC; 2000.
- The library's [statistical analysis plans article](../practice/statistical-analysis-plans.html) discusses prespecification and [type I and type II errors](../inference/type-i-and-type-ii-errors.html) explains the error rates interim boundaries control.
