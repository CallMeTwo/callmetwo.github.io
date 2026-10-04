---
title: Multiple testing
summary: Testing many hypotheses inflates the chance of false positives; Bonferroni and Holm corrections control the familywise error rate at a prespecified level.
---

## Overview

Multiplicity arises when a study creates several opportunities to make a claim: multiple outcomes, doses, time points, subgroups, interim looks, or biomarkers. If each test is judged at level α, the chance of at least one false rejection across a family generally exceeds α. Adjustment is a design and interpretation decision: define which claims must be protected together, then select control appropriate to the scientific purpose.

## A small family, calculated

For m independent true null hypotheses tested at α=.05, the probability of no false rejection is (1−.05)^m. With 10 tests, family-wise error is 1−.95^10≈0.401. Independence is simplifying; Bonferroni gives a valid upper bound under arbitrary dependence by testing each at α/m, though it may be conservative. Holm’s step-down procedure controls family-wise error and is at least as powerful as simple Bonferroni.

```r
p <- c(.004, .018, .031, .22, .61)
p.adjust(p, method = "holm")
p.adjust(p, method = "BH") # Benjamini-Hochberg FDR procedure
```

Holm is often appropriate for confirmatory families where any false positive is costly. Benjamini–Hochberg controls the expected false discovery proportion under independence and certain positive dependence conditions; it addresses screening where follow-up validation is expected. FDR control does not mean that each selected finding has a 5% probability of being false.

### Define the family before analysis

A family could be the set of primary endpoints, all pairwise comparisons after an omnibus test, or all genes in a discovery screen. Its boundary should follow the claims and decision process, not whichever grouping produces the smallest adjusted p-value. Hierarchical testing can prioritize a primary endpoint and open gated secondary claims only after specified conditions; closed testing and simultaneous confidence intervals offer other structured approaches.

Not every exploratory analysis needs a mechanical correction. The essential requirement is honest labeling and calibrated claims. A prespecified single primary test differs from dozens of unplanned analyses, even if both report p<.05. Registration, protocol, and analysis plan should state the endpoint hierarchy, contrasts, interim looks, and adjustment method.

### Power trade-offs and reporting

Correction reduces false positives but can reduce power, so sample size planning must account for the family and target effect. Do not react to lower adjusted significance by switching to an unadjusted result without changing the inferential claim. Report raw estimates and intervals alongside adjusted inference, and state the number and nature of tests. For a broad screen, report the full result set or make data available; a short list of “significant” findings hides the denominator needed to judge discovery reliability.

Multiplicity adjustment cannot repair biased outcome selection, selective publication, poor measurement, or confounding. Nor does an adjusted p-value convey effect importance. Present effect estimates with uncertainty and describe findings as confirmatory or exploratory. A reproducible family definition matters as much as the formula used to adjust it.

## Error control is a choice about claims

Family-wise error rate (FWER) is the probability of at least one false rejection in a defined family. It is a natural target when any unsupported claim could change clinical practice, for example multiple primary efficacy claims. False discovery rate (FDR) is the expected proportion of false discoveries among rejected hypotheses and is useful in broad screens where leads will be validated. They protect different quantities. A 5% FDR procedure does not say that every individual discovery has a 5% probability of being false.

The family is defined by the set of claims jointly interpreted. It may be all pairwise treatment comparisons, a hierarchy of primary and secondary endpoints, all doses, or thousands of genomic markers. Defining a small family after observing results is itself a form of selection. A protocol should specify tests, family boundaries, order, and the rule for moving from one claim to the next.

## Bonferroni, Holm, and stepwise logic

Bonferroni tests each of m hypotheses at α/m or multiplies each p-value by m (capped at one). The union bound guarantees FWER≤α under arbitrary dependence, but conservatism can reduce power. Holm sorts p-values p(1)≤…≤p(m), then compares p(i) with α/(m−i+1), stopping at the first failure. Holm also controls FWER under arbitrary dependence and is uniformly at least as powerful as simple Bonferroni.

```r
p <- c(.004, .018, .031, .22, .61)
data.frame(raw = p,
           bonferroni = p.adjust(p, "bonferroni"),
           holm = p.adjust(p, "holm"),
           BH = p.adjust(p, "BH"))
```

Benjamini–Hochberg (BH) orders p-values and compares p(i) to i q/m; it controls FDR under independence and certain positive dependence structures. Benjamini–Yekutieli is more conservative but accommodates arbitrary dependence. When hypotheses are hierarchical or structured, methods that use that structure may be more powerful, but the structure must be prespecified and software validated.

## Gatekeeping and hierarchy

A clinical program may define one primary outcome, followed by key secondary outcomes tested only if the primary succeeds. Gatekeeping preserves strong error control while reflecting a scientific hierarchy. Closed testing offers a general framework: all relevant intersection hypotheses must be rejected before a component claim is made. Graphical procedures can recycle alpha across hypotheses according to prespecified transition weights. These procedures are more complex than applying a single adjustment but can match the claim structure and retain power.

Interim monitoring is another multiplicity problem: repeated looks at accruing data increase the chance of crossing an unadjusted boundary. Group sequential designs use spending functions or boundaries that preserve the overall Type I error while allowing early stopping. Adaptive changes, sample-size re-estimation, or treatment selection can be valid, but only if the inference method accounts for the adaptation.

## Planning and communicating

Multiplicity affects sample size and detectable effects. If a study has several confirmatory endpoints, sample size based on an unadjusted single test may yield inadequate power after the planned procedure. Simulate or calculate the design under plausible correlations and effects; do not compensate post hoc by removing an outcome from the family.

Report the family definition, procedure, adjusted p-values or simultaneous intervals, and raw effect estimates. In exploratory analyses, complete disclosure of the number of tests and all results matters more than a ritual correction applied to a poorly defined family. Adjustment reduces one source of false positives; it does not fix confounding, measurement error, selective publication, or a misspecified model. Keep confirmatory claims distinct from discovery and replication stages.

## Simultaneous inference after a multiarm trial

Suppose a trial compares three active doses with one control on a continuous endpoint. Three independent t-tests at .05 would have a larger-than-.05 chance of at least one false positive, though tests are correlated because they share a control. Dunnett’s procedure exploits this shared-control structure to provide simultaneous comparisons with less penalty than Bonferroni. If the scientific aim is dose trend, a prespecified trend contrast can use one degree of freedom and avoid treating every pair as equally important. The best adjustment follows the scientific claim, not convenience after observing results.

For all pairwise comparisons among k groups, Tukey’s method controls FWER for the complete set under the linear-model assumptions. If only a subset of contrasts matters, multiplicity can be limited to that prespecified family. Reporting a global omnibus test then unadjusted selected pairwise p-values does not preserve error control merely because the omnibus test was significant; use a valid closed or gatekeeping strategy.

## FDR and the meaning of a discovery list

In a high-dimensional study, Benjamini–Hochberg adjusted p-values (q-values in common usage) help control the expected false fraction among selected findings under its conditions. The procedure orders p-values and uses rank, so the significance threshold is data-dependent. A discovery list should still be treated as candidate signals, especially when effect estimates are subject to winner’s curse: selected estimates tend to be exaggerated because selection favors large observed values. Independent replication and shrinkage methods can provide more realistic effect estimates.

When tests are highly dependent, the usual BH guarantee may not apply in its simplest form. Dependence can be positive and structured (e.g. correlated biomarkers), but complex dependence requires method-specific justification. Benjamini–Yekutieli controls FDR more broadly at a power cost. Resampling-based procedures, hierarchical models, or domain-specific methods may exploit known structure. State assumptions and report the full tested set, not only discoveries.

### Prespecification does not mean rigidity

Protocols cannot anticipate every data issue. Amendments may be appropriate, but they should be dated, justified, and disclosed before results are known when feasible. A change made after unblinding can still be scientifically valuable as exploration, but its inferential status changes. Separate the confirmatory family from new questions, and validate new findings in fresh data. Statistical adjustment cannot turn a post hoc question into a prespecified one.

### Interpreting adjusted evidence

Adjusted p-values are useful decision summaries but should not replace estimates and intervals. A multiplicity-adjusted p-value is generally not a probability that a specific null is true. Simultaneous confidence intervals communicate the range of effects compatible with the familywise procedure. For FDR procedures, pair adjusted evidence with shrinkage or validation and explain expected error control at the list level. Readers need the method, number of hypotheses, family definition, dependency assumptions, and analytic selection process to understand what the adjustment means.

### Worked step-down adjustment

For p-values .004, .018, .031, .22, and .61 in a family of five, Holm’s first threshold is .05/5=.01. The first value .004 passes. The second is compared with .05/4=.0125; .018 fails, so subsequent hypotheses are not rejected by the step-down rule. Adjusted values are monotone and can be reported with the effect estimates. The adjustment preserves FWER under arbitrary dependence, but it does not change which hypotheses were chosen or remove bias from outcome measurement.

```r
p <- c(primary = .004, secondary1 = .018, secondary2 = .031,
       secondary3 = .22, exploratory = .61)
p.adjust(p, method = "holm")
```

Keep p-values paired with their endpoint labels and estimates; never sort one column independently in a results table. The family should be clear enough that readers can tell why these five tests, and not others, were grouped.

### Selective inference and winner’s curse

When an analysis selects the largest association from many estimates, the selected point estimate is biased away from zero even if each unselected estimator is unbiased. Conventional confidence intervals calculated as if selection had not occurred understate uncertainty. Selective-inference methods can adjust for a known selection rule, but the cleanest confirmation is an independent dataset or a prespecified replication. Shrinkage can reduce exaggerated estimates, though it relies on assumptions about the distribution of effects.

This issue appears in subgroup exploration, biomarker screening, and machine learning feature discovery. Multiple-testing correction of p-values alone does not necessarily remove effect-size exaggeration. Report selection steps and validate both direction and magnitude in fresh data.

### A transparent analysis plan

A concise multiplicity plan names the primary hypothesis, key secondary family, exploratory tests, alpha allocation or adjustment, handling of interim looks, and what happens if a gate fails. If secondary endpoints are only formally tested after primary success, explain the hierarchy. If no adjustment is planned for exploratory outcomes, say so and avoid confirmatory wording. This clarity makes the result interpretable without forcing every scientific question into the same correction method.

## Planning power under adjustment

Suppose three co-primary endpoints must all succeed. The decision rule may require all three to meet their criteria; in that case the chance of false overall success under the global null can be at most α for each component, but the probability of missing the joint success depends on endpoint correlations and effects. If success on any one endpoint is sufficient, multiplicity control is essential because opportunities accumulate. The protocol must distinguish these logical structures.

A conservative Bonferroni plan can calculate each endpoint at α/3. More efficient procedures exploit correlation or gatekeeping, but planning should simulate the actual joint distribution. For highly correlated endpoints, the penalty differs from independent outcomes. The sample size should be adequate for each endpoint’s clinically meaningful effect and measurement reliability, not just the easiest endpoint.

### Combining discovery and confirmation

A common research program separates exploratory screening from confirmatory validation. The discovery stage may use FDR control to prioritize candidates; the validation stage tests a small prespecified set under a family-wise rule. Reusing discovery data for confirmation invalidates the clean separation unless selective inference is handled. Keep data partitions, code, and decision rules clear, especially in high-dimensional omics or prediction studies.

Prediction model development has its own multiplicity through feature selection, tuning, and repeated validation. A nominal p-value for the final selected coefficient is generally not calibrated if selection is ignored. Nested cross-validation estimates predictive performance but does not automatically provide valid inferential p-values for selected features. Keep prediction goals and causal/etiologic claims distinct.

### Audit trail for endpoint choices

Maintain a table listing every prespecified outcome and analysis, its hierarchy/family, adjustment, and result. Record changed definitions, transformations, subgroup cuts, and stopping decisions with dates. The purpose is not bureaucratic completeness: it reveals how many opportunities existed for a favorable result and lets readers distinguish evidence generation from confirmation. Open data and code make this audit reproducible.

### Multiplicity in subgroup and interim analyses

Subgroup analyses create multiplicity across candidate modifiers and possible cut points. Testing age as continuous, then categorizing at 60, 65, and 70, then reporting the most favorable split creates more opportunities than the final table reveals. Prefer a small set of prespecified interactions with biologically motivated scales; show all tested subgroup results and treat exploratory patterns as candidates for replication.

Interim analyses may stop a trial early. O’Brien–Fleming-type boundaries spend little alpha at early looks and approach the conventional threshold near the final analysis; other spending functions trade early sensitivity against final power. Report the planned number/timing of looks, boundary, and whether the trial stopped early. A nominal final p-value should not be interpreted as if no interim examination occurred.

### A small adjusted result table

A useful result table has one row per planned hypothesis and columns for estimate, confidence interval, raw p-value, adjusted p-value, and family. This prevents readers from seeing only discoveries. For simultaneous procedures, intervals should match the adjustment. If a treatment’s adjusted p-value is .08 but its interval still excludes the null because the interval is unadjusted, the apparent disagreement reflects different procedures; label both clearly or avoid mixing them.

### Multiplicity versus model uncertainty

Multiplicity concerns repeated opportunities to make claims; model uncertainty concerns which data-generating structure is adequate. Adjusting 20 tests does not account for trying five transformations, three covariate sets, and multiple exclusion rules unless those choices are also part of the selection process. A confirmatory analysis should lock the model and outcome definition where possible. Robustness analyses can show how conclusions vary but should not be counted as independent confirmations.

### When to adjust and when to disclose

A single prespecified primary test with no outcome selection may require no multiplicity correction, though other analyses still need transparent classification. Several confirmatory endpoints or treatment contrasts usually need a family-level strategy. Exploratory analyses can remain unadjusted if clearly described as exploratory and interpreted cautiously; applying an adjustment to an undefined list can create a false sense of rigor. The goal is calibrated claims, not maximizing adjusted p-values.

Before analysis, map the decision tree from primary to secondary claims. Specify which hypotheses are protected, what alpha allocation is used, and whether success on one or all endpoints is required. After analysis, publish all family members, estimates, and adjusted results. If a post hoc question is scientifically important, report it as hypothesis-generating and plan validation. No adjustment method compensates for missing outcomes or selective publication.

### Interpreting adjusted results in the clinic

Suppose five prespecified secondary endpoints have adjusted p-values ranging from .03 to .40. This tells readers which null hypotheses met the family-level procedure, but it does not show which changes matter or whether the endpoints are independent. Present each estimate and interval, describe the adjustment, and explain whether secondary claims were gated by primary success. If only one of several scales improves, consider whether this reflects a domain-specific effect or measurement noise, and avoid an unplanned composite narrative.

### Reproducibility safeguards

Archive the protocol, statistical analysis plan, outcome dictionary, and code version. Preserve a record of every tested outcome and subgroup. For adaptive or sequential analyses, include simulation code and boundary specifications. These records let readers reconstruct the multiplicity family and judge whether the reported evidence is confirmatory. They also protect the scientific value of exploratory results by clarifying what should be replicated.

### Check the unit of multiplicity

The number of hypotheses is not always the number of rows in a table. A single omnibus test may cover several coefficients, while one endpoint analyzed at multiple times may create distinct claims. Define the family by the decision that stakeholders will make. If the treatment should be recommended only when both efficacy and safety criteria hold, the joint decision has a different error structure from choosing whichever endpoint succeeds. Write the decision logic explicitly before selecting an adjustment.

## References and further reading

- Holm S. [A simple sequentially rejective multiple test procedure](https://doi.org/10.2307/4615733). *Scandinavian Journal of Statistics*. 1979;6(2):65–70.
- Benjamini Y, Hochberg Y. [Controlling the false discovery rate: a practical and powerful approach to multiple testing](https://doi.org/10.1111/j.2517-6161.1995.tb02031.x). *Journal of the Royal Statistical Society: Series B*. 1995;57(1):289–300.
- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott-Raven.
- Benjamini Y, Yekutieli D. The control of the false discovery rate in multiple testing under dependency. *Annals of Statistics*. 2001;29(4):1165–1188. [doi:10.1214/aos/1013699998](https://doi.org/10.1214/aos/1013699998)
- Dunnett CW. A multiple comparison procedure for comparing several treatments with a control. *Journal of the American Statistical Association*. 1955;50(272):1096–1121. [doi:10.1080/01621459.1955.10501294](https://doi.org/10.1080/01621459.1955.10501294)
- Tukey JW. Comparing individual means in the analysis of variance. *Biometrics*. 1949;5(2):99–114. [doi:10.2307/3001913](https://doi.org/10.2307/3001913)
- The [p-values article](/biostatistics-library/inference/p-values-and-significance-levels.html) discusses interpretation of individual tests.
