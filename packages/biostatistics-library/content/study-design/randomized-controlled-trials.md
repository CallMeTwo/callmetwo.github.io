---
title: Randomized controlled trials
summary: The gold-standard interventional design — random assignment to treatment or control balances known and unknown confounders and supports causal effect estimation.
---

## Overview and key ideas

A **randomized controlled trial (RCT)** allocates participants to treatment groups by a random mechanism (random number generator, randomization table) before any outcome information is available. Randomization is what distinguishes an RCT from an observational design: it is the only commonly used design feature that balances *unknown* prognostic factors across groups, not just the known ones that can be adjusted in a regression. The result is that any systematic difference in outcome between the groups is, in expectation, attributable to the treatment — which is what makes the RCT the strongest available basis for causal inference about an intervention.

Key components: a well-defined **intervention** and **control** (placebo, standard-of-care, or no treatment), a **randomization** mechanism, **blinding** (of participants, outcome assessors, or both), and a pre-specified **primary outcome** and **analysis population**.

## When to use it

| Setting | Example question |
| --- | --- |
| Phase III therapeutic trial | Does a new antihypertensive drug lower 10-year cardiovascular event rate compared with current standard therapy? |
| Surgical technique | Does a minimally invasive approach to appendectomy reduce post-operative infection versus laparotomy in children? |
| Diagnostic trial | Does a new rapid antigen test, compared with standard ELISA, change treatment decisions in community-acquired pneumonia? |
| Non-inferiority trial | Does a cheaper generic formulation of a chronic-disease drug maintain the same 24-week survival as the reference product? |
| Cluster-randomized trial | Does a school-based diet programme (assigned by school) reduce childhood obesity prevalence compared with usual curricula? |
| Pragmatic (practitioner-blinded) trial | In routine primary care, does structured follow-up by a care coordinator reduce 30-day hospital readmission after discharge? |

When a valid RCT is not feasible (rare disease, long latency, ethical or cost barriers), an observational design must be used and its limitations stated explicitly.

## Assumptions and limitations

- **Intention-to-treat (ITT) analysis.** The primary analysis must compare participants by the group to which they were *randomized*, not by the treatment they actually received. ITT preserves the confounding-balance property of randomization; per-protocol analysis is a sensitivity analysis, not a substitute.
- **Loss to follow-up.** Randomization only balances groups at baseline; if dropout or death is differential, late-stage ITT estimates can be biased. Pre-specified handling of missing outcomes is essential.
- **Randomization ≠ blinding.** Without blinding, differential assessment or behaviour (Hawthorne effect) can bias the outcome even when allocation was random.
- **External validity.** A highly selected trial population (strict inclusion/exclusion criteria) limits generalisability to real-world patients; a statistically significant result in a narrow population does not by itself apply to the broader population of interest.
- **Cluster randomisation changes the unit of analysis.** When schools or practices are randomised, observations within a cluster are correlated; the effective sample size is much smaller than the raw number of patients, and cluster-level methods (mixed models, GEE) must be used.
- **Non-inferiority trials** require a justified non-inferiority margin; an overly large margin can declare an inferior drug "non-inferior".
- **Assay and measurement validity.** The primary outcome must be measured reliably and consistently across groups; if the measurement instrument changes mid-trial, or is calibrated differently in different sites, apparent treatment differences may reflect measurement drift.

## Worked example

A double-blind RCT randomised 500 patients with stage 2 hypertension to a new drug (n = 250) and to standard therapy (n = 250). The primary outcome was mean change in systolic BP at 12 weeks.

- New drug group: mean change −18.4 mmHg, SD 9.2, n = 248 (2 withdrawn).
- Standard therapy group: mean change −12.1 mmHg, SD 8.9, n = 246 (4 withdrawn).

Difference = −6.3 mmHg. Pooled SD = sqrt((9.2² + 8.9²)/2) ≈ 9.05. SE = 9.05 × sqrt(1/248 + 1/246) ≈ 0.81. 95% CI = −6.3 ± 1.96 × 0.81 = **−7.9 to −4.7 mmHg**. The interval excludes 0, supporting a difference in mean change at the 0.05 level under this complete-case model. Clinical importance depends on a threshold set in advance; if 5 mmHg is the threshold, this interval includes effects smaller than 5 mmHg, so the analysis does not establish that the benefit exceeds that amount. The summaries include 494 of 500 randomized participants. Assigning participants to their randomized group defines the ITT estimand but does not provide missing outcomes; the analysis must state how missing data were handled and assess sensitivity to those assumptions. The small amount of missing data may limit its impact, but counts alone do not demonstrate this.

## Interpretation and common pitfalls

- **Confusing superiority with non-inferiority.** A trial designed to show that drug A is not worse than drug B by more than a margin is a different statistical exercise from showing that A is better than B; the null hypothesis, the confidence-interval interpretation, and the required sample size all differ.
- **Post-hoc subgroup analyses.** Splitting a sufficiently powered primary outcome into subgroups (e.g., by age, sex, genotype) generates many small, underpowered comparisons; a "significant" subgroup is most often a false positive unless pre-specified and tested with multiplicity correction.
- **Treating the null hypothesis as proven.** A non-significant p-value (e.g., p = 0.08) does not show equivalence; it only fails to reject the null. Equivalence or non-inferiority requires a pre-specified margin and a test designed for that hypothesis.
- **Multiple comparisons without correction.** Testing 20 secondary endpoints and reporting the single lowest p-value inflates the family-wise type I error rate dramatically; at least a Bonferroni or false-discovery-rate adjustment is required.
- **Ignoring the ITT principle in the primary analysis.** Excluding participants who crossed over, discontinued, or were non-adherent (per-protocol or as-treated analysis as the primary endpoint) selectively exposes the group that tolerated the drug, biasing the effect estimate in the direction of benefit.
- **Stopping early for significance.** An interim analysis that stops the trial as soon as the p-value crosses 0.05 tends to exaggerate the final effect size, because the stopping point is often a local fluctuation above the true effect; pre-specified stopping boundaries with alpha spending (e.g., O'Brien-Fleming) are the remedy.

## References and further reading

## Estimands and randomization choices

## Factorial, crossover, cluster, and pragmatic designs

## Noninferiority and equivalence decisions

In a noninferiority trial, define the treatment difference direction and margin Δ before enrollment. If higher outcomes are worse, a new treatment may be declared noninferior only if the confidence interval's unfavorable bound excludes a loss greater than Δ. The margin should preserve a clinically acceptable fraction of established active-control benefit and account for assay sensitivity, constancy, and historical evidence. A margin chosen from observed data is invalid. Equivalence requires the entire two-sided interval to fall within −Δ and +Δ. Failure to find a superiority difference is neither proof of noninferiority nor equivalence.

Nonadherence and crossover toward the null can falsely favor noninferiority, so intention-to-treat alone may be insufficient; per-protocol analyses are often also examined, with their own selection bias and assumptions. Consistency across analysis sets strengthens the conclusion but does not automatically validate the margin. Report absolute differences and intervals against the margin, not only a one-sided p-value.

## Effect modification and subgroup analysis

### Example: interaction on additive scale

If control risks are 10% in low-risk and 30% in high-risk patients, and treatment RR is 0.80 in both groups, the absolute risk reductions are 2 and 6 percentage points. Relative effect is homogeneous while absolute benefit differs threefold. A subgroup claim should state whether effect modification is assessed on relative or absolute scale and why that scale matters to decisions. Interaction tests often need substantially larger samples than the primary-effect test; a nonsignificant test does not establish homogeneity.

Prespecified subgroup analysis should be based on plausible effect modification, use a limited number of factors, and test an interaction rather than compare subgroup-specific significance. For a continuous modifier, preserve its continuous form when possible and estimate the treatment-effect curve with uncertainty. Subgroups with few events can produce unstable effects; hierarchical shrinkage or partial pooling may reduce exaggeration but is not a substitute for adequate information. Clearly label post hoc analyses and treat them as hypothesis-generating.

## Protocol deviations and treatment adherence

Adherence summaries help explain whether assignment changed treatment received, but conditioning on adherence breaks randomization because adherence is post-randomization and prognostic. Instrumental-variable or g-method approaches may estimate effects among compliers under additional assumptions; simple as-treated comparisons generally do not. Record initiation, dose, interruptions, crossover, rescue treatment, and reasons. Define whether these are part of treatment-policy estimand or require hypothetical/composite strategies under ICH guidance.

A factorial design randomizes participants to combinations of interventions, such as a 2×2 design testing drug A, drug B, both, or neither. It can estimate two main effects efficiently when interaction is absent or small, but the interaction must be considered clinically and statistically; an important interaction means a single averaged main effect may mislead. Sample size and analysis should account for factorial allocation and planned interaction precision. Do not infer “no interaction” merely because an interaction p-value is nonsignificant.

Crossover trials expose each participant to multiple treatments in randomized sequences, using within-person comparisons to control stable characteristics. They suit chronic, reversible conditions when treatment effect is rapid and washout is adequate. Period effects, carryover, disease progression, and treatment-by-period interaction can invalidate a simple paired analysis. The protocol should justify washout and define whether first-period data provide a fallback. Crossover is unsuitable when treatment permanently changes disease course or outcomes are irreversible.

Cluster randomization is appropriate when interventions operate at clinic/community level or individual allocation risks contamination. Design and analysis must account for intracluster correlation, unequal cluster sizes, and a possibly small number of clusters. Stratification or constrained randomization can balance cluster characteristics. Recruitment after cluster allocation risks differential participant selection; recruit before randomization where feasible. A cluster-level estimand can differ from an individual-average estimand when cluster sizes vary or cluster size relates to outcomes.

Pragmatic trials evaluate interventions under usual-care conditions; explanatory trials test efficacy under controlled conditions. Pragmatic features include broad eligibility, flexible delivery, routine outcomes, and usual-care comparators, but pragmatic intent does not eliminate the need for a clear estimand or rigorous conduct. Hybrid trials combine implementation and clinical questions. Describe the care setting, intervention adherence, cointerventions, and generalizability limitations rather than applying a single pragmatic label.

## Missing outcomes and intercurrent events

## Estimation, confidence intervals, and multiplicity

Report the primary treatment contrast with a two-sided confidence interval even when a protocol specified a one-sided test. The interval conveys effect magnitude and precision against clinical thresholds. For adjusted analyses, specify covariates before unblinding; baseline outcome and stratification variables commonly improve precision. Avoid choosing covariates based on baseline p-values, which are random and do not diagnose randomization failure. For multiple arms or outcomes, describe the family of claims controlled and the testing order.

When a trial stops early, distinguish stopping for safety, efficacy, futility, or feasibility. Sequential boundaries control false-positive error for planned interim looks; they do not remove bias in the estimated effect after selection. Report the stopping boundary, information fraction, and adjusted or unadjusted interval as appropriate. Include participants' exposure time and event ascertainment completeness at stop, since abrupt closure can affect outcomes unevenly.

Treatment discontinuation, switching, rescue medication, death, and nonadherence are intercurrent events that affect interpretation. Under a treatment-policy strategy, outcomes are analyzed regardless of discontinuation; under a hypothetical strategy, the effect is estimated as if the event had not occurred, which often needs modeling; while-on-treatment and principal-stratum effects answer still different questions. Pre-specify the strategy for each event and align analysis and sensitivity analysis with the estimand. Simple censoring at discontinuation can be biased if the reason for stopping predicts outcome.

Missing outcome data should be minimized operationally and reported by arm, time, and reason. Multiple imputation under MAR should include treatment, baseline predictors, observed outcomes, and variables related to missingness; preserve interactions and repeated structure. Sensitivity analyses can apply delta adjustments or tipping-point scenarios to assess how far departures from MAR must go to alter conclusions. Last observation carried forward generally understates uncertainty and imposes implausible stability, so it should not be used as a default.

## Monitoring and public reporting

Safety monitoring needs predefined adverse-event definitions, expected/unexpected event pathways, and stopping guidance. Independent data monitoring committees may review unblinded accumulating information under a charter. Interim efficacy looks change type-I error and require boundaries or spending functions; repeated unadjusted testing inflates false-positive risk. Stopping early for apparent benefit can exaggerate effect estimates and should be reported with the stopping rule and information fraction.

Register the trial before enrollment, publish protocol and analysis plan, disclose amendments and timing, and report all prespecified outcomes. A CONSORT flow diagram should distinguish screened, randomized, treated, followed, and analyzed participants. Present effect sizes and confidence intervals, not only p-values; report harms, adherence, fidelity, and deviations. Explain applicability to populations excluded from the trial and distinguish post hoc subgroup findings from confirmatory evidence.

### Allocation, concealment, and blinding in operation

An unpredictable random sequence is not enough if recruiters can see the next assignment. Central web/telephone randomization or sequentially numbered, opaque, sealed envelopes with safeguards can maintain concealment. Blinding participants and clinicians can reduce differential cointerventions and adherence effects; blinded outcome adjudication can reduce assessment bias even when treatment itself is obvious. For pragmatic interventions where blinding is infeasible, standardize cointerventions, use objective outcomes where appropriate, and describe who knew assignment and when.

In cluster trials, randomize the cluster when intervention spillover makes individual randomization invalid. Recruit participants before randomization when feasible; post-randomization recruitment can induce selection if recruiters know cluster allocation. Analysis must account for clustering and the number of randomized clusters. Stratified or constrained randomization can help balance few clusters, but inference should reflect the actual randomization scheme. Record sequence generation, implementation, concealment, and deviations separately.

Randomization balances measured and unmeasured baseline causes in expectation, but does not guarantee exact balance in a finite trial. The protocol should define the treatment conditions, target population, outcome, intercurrent events, and summary measure—the estimand. The intention-to-treat (ITT) contrast compares outcomes according to randomized assignment and estimates the effect of assignment under the trial's treatment-policy strategy. Per-protocol or while-treated effects ask different questions and require adjustment for adherence-related selection. ICH E9(R1) emphasizes making these choices explicit rather than treating “ITT” as a complete estimand specification.

Simple randomization is unpredictable but can yield chance imbalance in small studies. Permuted blocks maintain approximate balance over enrollment but require concealed block sizes or other safeguards to prevent prediction. Stratification by a small set of strong prognostic factors can improve balance and precision; too many strata create operational complexity and sparse cells. Minimization can balance multiple factors, often with a random component. Allocation concealment prevents recruiters from knowing the next assignment; blinding acts after assignment and addresses performance or assessment bias. They solve different problems.

## Sample size, precision, and analysis

For a continuous outcome with common SD \(\sigma\), equal group sizes \(n\), two-sided type-I error \(\alpha\), and target power \(1-\beta\), the approximate per-arm sample size for difference \(\delta\) is

\[
n\approx 2(z_{1-\alpha/2}+z_{1-\beta})^2\sigma^2/\delta^2.
\]

At \(\alpha=.05\), 80% power, SD=10, and a target difference of 5, \(n≈2(1.96+0.84)^2(100)/25≈63\) per arm. Inflate for expected attrition and account for clustering, multiplicity, interim monitoring, and analysis efficiency. The chosen difference should be clinically meaningful, not merely detectable. A confidence interval communicates the range of effects compatible with data more directly than whether p falls below .05.

```r
alpha <- 0.05; power <- 0.80; sigma <- 10; delta <- 5
z_alpha <- qnorm(1 - alpha / 2)
z_power <- qnorm(power)
n_per_arm <- ceiling(2 * (z_alpha + z_power)^2 * sigma^2 / delta^2)
n_per_arm
```

The normal approximation assumes independent observations, equal variance and allocation, and a continuous outcome. Binary outcomes, survival endpoints, cluster randomization, noninferiority margins, and repeated measures need design-specific calculations. Sample-size software should be checked against the estimand and assumptions, not treated as a black box.

The primary analysis should follow the prespecified model, adjustment variables, handling of baseline outcome, missingness, and estimand strategy. Baseline adjustment for prognostic covariates can improve precision, but data-driven selection risks biased estimates and invalid intervals. For repeated outcomes, mixed models or generalized estimating equations must match the desired subject-specific or population-average interpretation. For cluster trials, the number of clusters often limits information more than total participants; use cluster-level or appropriately modeled inference.

## Bias, missing outcomes, and trial conduct

Randomization protects against baseline confounding only if allocation is concealed and analysis respects assignment. Differential cointerventions, contamination, unblinding, outcome measurement influenced by knowledge of treatment, and informative loss to follow-up can compromise inference. Missing data do not become harmless because treatment was randomized. Describe amount, timing, and reasons by arm; choose a primary missing-data assumption; use likelihood or multiple imputation under a stated MAR model when defensible; and conduct sensitivity analyses for departures from MAR.

Trial registration, protocol publication, and a statistical analysis plan completed before unblinding reduce selective outcome reporting. Report participant flow, exclusions after randomization, adherence, protocol deviations, harms, and all prespecified outcomes with estimates and intervals. Subgroup effects need interaction estimates and cautious interpretation; “significant in one subgroup but not another” does not demonstrate effect modification. Noninferiority trials require assay sensitivity, adherence, a justified margin, and often both intention-to-treat and per-protocol perspectives.

- ICH E9(R1). Addendum on estimands and sensitivity analysis in clinical trials. 2019. https://database.ich.org/sites/default/files/E9-R1_Step4_Guideline_2019_1203.pdf
- Schulz KF, Altman DG, Moher D. CONSORT 2010 statement. *BMJ*. 2010;340:c332. https://doi.org/10.1136/bmj.c332
- Piaggio G, Elbourne DR, Pocock SJ, Evans SJW, Altman DG. Reporting of noninferiority and equivalence randomized trials. *JAMA*. 2012;308:2594–2604. https://doi.org/10.1001/jama.2012.87802

- Schulz KF, Altman DG, Moher D, for the CONSORT Group. [CONSORT 2010 statement](https://doi.org/10.1136/bmj.c332). *BMJ*. 2010;340:c332.
- [ICH E9(R1): Estimands and Sensitivity Analysis in Clinical Trials](https://www.ich.org/page/efficacy-guidelines), guidance on defining treatment effects and handling intercurrent events.
- [Cochrane Handbook, Chapter 8: Assessing risk of bias in a randomized trial](https://training.cochrane.org/handbook/current/chapter-08).
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Chow S, Lu W, Jiang H. *Sample Size Calculations in Clinical Research*. CRC Press.
- Agresti A. *Categorical Data Analysis*. Wiley.
- Higgins J, Thomas J, Chandler J, Cumpston M, Li T. *Cochrane Handbook for Systematic Reviews of Interventions*. Wiley.

The [bias and confounding article](/biostatistics-library/study-design/bias-and-confounding.html) explains how post-randomization deviations, missingness, and outcome measurement can still affect trial results.
