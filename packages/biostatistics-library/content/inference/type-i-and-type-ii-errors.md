---
title: Type I and Type II errors
summary: A hypothesis test can be wrong in two directions - a false positive (Type I, controlled by alpha) or a false negative (Type II, governed by power).
---

## Overview

A test can reject a true null (Type I error) or fail to reject a false null (Type II error). The Type I error probability α is controlled by the procedure under its assumptions; Type II error β depends on the true effect, sample size, variability, allocation, and analysis. Power, 1−β, is therefore not a fixed property of a study: it varies with the effect size one hopes to detect.

## The decision grid and its limits

| Truth | Reject null | Do not reject null |
| --- | --- | --- |
| Null true | Type I error, probability α | Correct non-rejection |
| Alternative true | Correct detection, power 1−β | Type II error, probability β |

Suppose a two-arm trial targets a 5 mmHg difference, outcome SD 10 mmHg, equal groups, two-sided α=.05, and 80% power. A normal approximation for each arm gives n≈2(1.96+0.84)²(10²)/(5²)=62.7, so at least 63 per group before allowing for attrition or design effects. The assumed effect and SD dominate this calculation; choosing an implausibly large target produces a deceptively small sample size.

```r
# Approximate equal-size two-sample calculation
alpha <- .05; power <- .80; delta <- 5; sd <- 10
n_per_arm <- 2 * (qnorm(1-alpha/2) + qnorm(power))^2 * sd^2 / delta^2
ceiling(n_per_arm)
power.t.test(delta = delta, sd = sd, sig.level = alpha,
             power = power, type = "two.sample")
```

The first formula is a planning approximation; exact calculations use the noncentral t distribution and may differ slightly. Include expected loss to follow-up, unequal allocation, clustering, multiplicity, and interim boundaries in a real protocol.

## Design for effects that matter

Power should be evaluated at the smallest clinically important effect, not an optimistic effect selected because it gives a convenient sample size. Plot a power curve across plausible effects and variances. When recruitment is constrained, a precision-based design may be more transparent: determine what interval width is achievable and whether it can exclude effects that would change practice.

Reducing α for multiple primary outcomes usually lowers power unless sample size increases. Cluster randomization inflates required sample size approximately by design effect 1+(m−1)ρ, where m is average cluster size and ρ the intracluster correlation; unequal cluster sizes can add further inflation. Repeated measures may improve precision when within-person correlation is modeled correctly, but they do not create independent participants.

## Interpreting a negative study

A nonsignificant result does not identify which error occurred. Examine the estimate and interval: if the interval includes large benefit and harm, evidence is inconclusive; if it excludes clinically important effects, the result may rule those out under the model. “Observed power” computed from the observed estimate adds little information and can mislead. Report the planned power assumptions, achieved sample, estimate, and interval.

Error rates apply to procedures and long-run repetitions, not to the probability that this particular conclusion is wrong. Selective reporting and unplanned analyses can make actual error rates exceed nominal α. Good design, complete reporting, and calibrated interpretation reduce both statistical and scientific errors.

## Alpha and beta are design properties, not posterior odds

An α=.05 procedure has a 5% false-rejection probability over repeated studies when the null is true and assumptions are met. It does not mean there is a 5% chance the result is false. A β=.20 design at a particular alternative has 80% power there; it does not mean a nonsignificant result has an 80% chance of being a false negative. To calculate the probability a claim is true after a result requires additional information about prior plausibility, study bias, and the result’s likelihood under alternatives.

Power is a function, not a badge attached to the completed study. At zero effect, a calibrated test rejects with probability α; as the true effect moves farther from zero, power generally rises. The design should target a clinically meaningful minimum, and sensitivity analyses should show consequences of plausible SDs, event rates, attrition, and effect values. A single “80% powered” sentence can conceal fragile assumptions.

## Sample size under unequal allocation and clustering

For a two-sample mean comparison with group sizes n1 and n0, the variance of the difference is σ²(1/n1+1/n0) under equal variances. At fixed total N, balanced allocation minimizes that variance, but cost or recruitment constraints can justify unequal allocation. If the control arm is four times the treatment arm, the gain in control information is not fourfold because the standard error is driven by reciprocal sample sizes.

Cluster assignment inflates sample size. With average cluster size m and intracluster correlation ρ, design effect D≈1+(m−1)ρ, so an individually randomized sample size n is multiplied by D as a rough approximation. For m=20 and ρ=.05, D=1.95, almost doubling recruitment. Unequal cluster sizes increase the design effect, and degrees of freedom are tied more closely to number of clusters than number of individuals. Power planning should simulate realistic cluster counts and sizes rather than rely on a simple formula in small-cluster settings.

## Multiple outcomes and adaptive decisions

If several primary hypotheses are tested, Type I error control often requires a family-wise procedure that changes critical values and thus power. More outcomes can require larger enrollment to preserve target power for each key claim. Interim efficacy analyses also spend alpha; boundaries are set so the overall false-positive probability remains at the chosen level. Futility stopping can reduce expected sample size but depends on conditional power or predictive probabilities and must be prespecified.

The Type I / Type II framework assumes a particular null and alternative. In clinical decisions, consequences are asymmetric: a false claim of benefit may expose patients to harm, while missing a useful therapy also has costs. Sample size and thresholds should reflect ethical and regulatory constraints, while the final decision combines evidence with benefits, harms, feasibility, and patient values.

### Negative findings and precision

After a nonsignificant test, examine the interval relative to the smallest worthwhile effect. If it spans both substantial benefit and harm, the study is inconclusive. If it excludes important effects in both directions, it may provide useful evidence of little difference, though formal equivalence design is needed for an equivalence claim. Do not report post hoc power computed from the observed effect as if it resolves uncertainty; its value is largely a transformation of the p-value. Give the effect estimate, confidence interval, planned target, and reasons actual information differed from the design assumptions.

## Choosing the target effect and alpha

The minimal clinically important effect should come from patient priorities, established scales, prior evidence, or a treatment decision threshold. It should not be chosen simply to fit available enrollment. If an intervention’s cost or toxicity is high, the effect required to justify use may be larger; for a low-risk intervention, a smaller benefit may matter. Alpha also reflects consequences and standards: lowering alpha reduces false positive risk per test but increases required information to preserve power.

A two-sided .05 test allocates .025 to each tail. A one-sided .025 test can have the same boundary in the prespecified direction, but not the same protection against an effect in the opposite direction. For non-inferiority, the hypothesis boundary is the margin, and power is calculated at an assumed true effect relative to that margin. These designs need more than swapping a keyword in software: assay sensitivity, adherence, and margin justification shape their error properties.

## Information, not just enrollment

The effective information depends on outcome variance, event rate, measurement reliability, follow-up, treatment adherence, and allocation. For a time-to-event trial, power is often driven by number of observed events rather than total sample size; low event incidence or short follow-up may leave a large trial underpowered. For a binary endpoint, an assumed control risk that is too high can overstate power. For continuous outcomes, baseline adjustment may reduce residual variance if prespecified and measured reliably.

Recruitment targets should include attrition and non-evaluable outcomes, but inflating enrollment only helps if missing participants do not create bias. A trial can achieve nominal sample size and still lose information through nonadherence, crossover, contamination, or measurement failure. Monitor data quality and recruitment assumptions without unblinded outcome peeking unless the design accounts for it.

### Interpreting one study’s errors

Type I and II errors are not labels that can be assigned with certainty after the fact. A significant result could be a false positive, and a nonsignificant result could reflect either a true null or a missed effect. The observed data do not reveal the truth. Conclusions should instead say how compatible effects are with the result, what the design could detect, and which assumptions remain uncertain.

Post-study calculations sometimes plug the observed effect into a power formula. This “observed power” is largely a re-expression of the p-value and does not add evidence. Use interval width to describe realized precision and compare it with the minimum effect that would matter. If the interval is wide, recommend a larger or better-designed study; if it is narrow enough to exclude useful effects, the evidence can inform practice even without a formal equivalence claim.

### A worked sensitivity analysis for planning

Suppose a study expects SD=10 and targets a 5-point difference with 80% power at two-sided α=.05, yielding roughly 63 participants per arm by a normal approximation. If the true SD is 12 instead, the variance increases by 44%, so required n scales approximately with SD²: 63×(12/10)²≈91 per arm. If the meaningful effect is 4 rather than 5, n scales by (5/4)², giving about 98 per arm at SD=10. These simple ratios show why sample-size reports should include scenarios rather than a single precise number.

```r
expand.grid(sd = c(8, 10, 12), delta = c(4, 5, 6)) |>
  transform(n_approx = ceiling(2 *
    (qnorm(.975) + qnorm(.80))^2 * sd^2 / delta^2))
```

R's native pipe requires a recent R version; for older versions, store the grid and call `transform()` separately. This approximation assumes a continuous outcome, equal allocation, independent groups, and complete data. It is not a replacement for protocol-grade calculations under the actual design.

### Ethical dimensions of information

An underpowered trial can expose participants without a reasonable chance of answering its question. An excessively large trial may expose more participants than needed, especially when existing evidence already makes the decision clear. Sequential designs can stop early for overwhelming benefit, harm, or futility while preserving error control. Independent monitoring committees may review unblinded data, with prespecified boundaries and safeguards against operational bias.

Power does not measure study quality or guarantee a meaningful result. A precisely designed study can still fail due to poor recruitment, invalid measurement, implementation failure, or an irrelevant endpoint. Sample size is one component of design adequacy.

### Distinguish individual from program-level error

A trial-level alpha does not automatically control the probability of a false conclusion across an entire research program with repeated publications, endpoints, and analyses. Replication, preregistration, data transparency, and synthesis reduce broader scientific error. Type I and II probabilities are valuable when the design and claim are clearly bounded; they should not be used as a complete theory of evidence.

### Power in diagnostic and prediction studies

For sensitivity, specificity, and predictive values, precision depends on the number of participants with the relevant disease status, not just total enrollment. A study may recruit many healthy participants yet have too few diseased cases to estimate sensitivity precisely. For prediction models, sample size should reflect outcome prevalence, number of candidate parameters, anticipated model fit, and desired shrinkage/precision; simple events-per-variable rules are not universally adequate. Validation splits consume information, and external validation needs sufficient outcome events across clinically relevant subgroups.

### Clustered and repeated designs require design-specific power

Repeated measurements can increase power when within-subject correlation is leveraged, but missing visits and covariance-model uncertainty reduce gains. Cluster trials need enough independent clusters; large patient counts within a few clusters do not guarantee adequate degrees of freedom. Sample-size calculations should account for unequal cluster sizes, expected ICC, baseline adjustment, and cluster loss. For stepped-wedge designs, secular time trends and treatment rollout pattern contribute materially to information.

### State uncertainty in the assumptions

Before finalizing a study, vary control event rate, SD, effect size, attrition, ICC, and adherence in sensitivity scenarios. Show a range of sample sizes or power. Pilot estimates are uncertain; use conservative values or blinded internal re-estimation where allowed. Explain the rationale for the target effect and why it matters to patients. A transparent planning record helps readers judge whether a negative finding reflects a genuinely small effect or insufficient information.

### Information monitoring and futility

A futility rule can stop a study when the chance of eventual success becomes small, reducing participant burden and resource use. Nonbinding futility boundaries typically do not inflate Type I error if ignored, but they influence expected power and trial duration; binding boundaries can alter operating characteristics. Predictive probability of success is Bayesian in form and depends on the model and prior, whereas conditional power evaluates future success under specified effect assumptions. Define which measure drives stopping and disclose its assumptions.

Stopping for apparent benefit early can inflate effect estimates through random high excursions—the “winner’s curse” of sequential selection. Confidence intervals adjusted for the stopping design and cautious discussion of magnitude are important. Early stopping may also limit safety information and subgroup understanding, even when the efficacy boundary is crossed.

### A design-to-conclusion example

Imagine a trial designed for 80% power to detect a 5-point improvement, with an observed mean difference of 1 point and a 95% interval from −3 to 5. The result does not show that the treatment has no effect. It is compatible with harm of 3 points and benefit up to 5, including the effect the trial was designed to detect. The data therefore remain inconclusive for that target. By contrast, an interval from −0.5 to 2.5 might exclude the 5-point benefit, even if a formal test of zero were nonsignificant. The interval, target effect, and design assumptions together guide interpretation.

If recruitment stopped early or variance was higher than planned, actual power is lower than the design target. Do not recalculate “power” from the observed effect; explain the achieved sample and report the interval. A replication may be justified if uncertainty spans an important treatment effect.

### Communicate the decision errors carefully

Use Type I and Type II terminology when discussing a prespecified procedure and its operating characteristics. Avoid attaching posterior language to them. A type I error is not the probability a significant result is false; a type II error is not the probability a nonsignificant result missed an effect. These are long-run conditional probabilities. For an individual study, the true state is unknown, so state which effect sizes remain compatible and how the decision threshold was chosen.

### Operating characteristics as a curve

A power curve plots rejection probability against true effect. At the null, the curve equals α; around a target clinically important effect, it should reach the desired power. Plotting several curves across plausible SDs, event rates, or ICCs shows how fragile a plan is. This is more informative than reporting one number and reveals whether recruitment constraints leave the study unable to answer its question.

The same idea applies to Bayesian decision rules: simulate the probability of triggering a decision across true effects and prior scenarios. Label these as operating characteristics, not posterior probabilities. Such simulations clarify how assumptions translate into real-world false alarms, missed opportunities, and expected sample size.

### Report design assumptions beside the result

A concise design report states the target effect, variability or event-rate assumption, alpha, desired power, allocation ratio, sample size, allowance for missing data, and any clustering or multiplicity adjustment. Then report actual enrollment and follow-up, estimate, and confidence interval. This lets readers compare planned information with achieved information without relying on post hoc power. If a major assumption failed, explain how that affects the interpretation.

### Distinguish error rates from evidence strength

The nominal alpha and power describe how a procedure behaves over repeated studies under specified truths. They do not provide a direct posterior probability for the hypothesis in the completed study. A significant finding can be false; a nonsignificant finding can miss an effect; neither outcome reveals which error occurred. Use estimates and intervals to describe realized uncertainty, and use external evidence and replication to update scientific confidence.

For a non-inferiority study, Type I error means incorrectly declaring non-inferiority when the true effect crosses the unacceptable margin. For an equivalence study, the null contains effects outside the acceptable range; Type II error is failure to establish equivalence when the true effect is inside. Error labels depend on the hypotheses and should be restated for these designs rather than borrowed from a superiority framework.

### Sensitivity and design transparency

Report how enrollment changes under plausible effects and variance assumptions. If recruitment cannot meet the target, state the achieved precision and the consequences for claims. This transparency is more valuable than retrofitting a new “detectable” effect after the data are known.

## References and further reading

- Dupont WD, Schuemaker L. *Statistical Power for Clinical Trials*. Marcel Dekker.
- Wasserstein RL, Lazar NA. [The ASA's statement on p-values: context, process, and purpose](https://doi.org/10.1080/00031305.2016.1154108). *The American Statistician*. 2016;70(2):129–133.
- Lang TA, Altman DG. [The SAMPL guidelines](https://www.equator-network.org/reporting-guidelines/sampl/), basic statistical reporting in biomedical journals.
- The [p-values article](/biostatistics-library/inference/p-values-and-significance-levels.html) explains the evidence summary and its limitations.
- Chow SC, Shao J, Wang H, Lokhnygina Y. *Sample Size Calculations in Clinical Research*. 3rd ed. Chapman & Hall/CRC, 2017.
- Julious SA. *Sample Sizes for Clinical Trials*. Chapman & Hall/CRC, 2010.
