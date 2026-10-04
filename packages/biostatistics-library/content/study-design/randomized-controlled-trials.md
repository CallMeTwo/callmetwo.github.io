---
title: Randomized controlled trials
summary: Design and interpretation of randomized comparisons, from allocation to estimand and reporting.
---

## Overview

A randomized controlled trial (RCT) assigns eligible participants to intervention strategies using a chance mechanism, then compares outcomes. Randomization prevents systematic baseline causes from determining assignment in expectation; it does not guarantee equal groups in a finite sample, successful blinding, complete follow-up, adherence, or unbiased outcome measurement.

A rigorous trial begins with the clinical decision it is meant to inform. Define who is eligible, what strategies are compared, when assignment occurs, which outcomes matter, how long follow-up lasts, and what effect measure will guide the decision. These elements determine the estimand and the design.

## Define what the trial compares

A trial may estimate the effect of assignment to an offer (treatment policy), the effect if participants followed assigned treatment, or an effect among a principal subgroup such as those who would adhere under either assignment. These are not interchangeable. The intention-to-treat (ITT) contrast preserves randomization and estimates the effect of assignment, including nonadherence and treatment switching. Per-protocol effects address sustained adherence but require additional adjustment for prognostic differences created after randomization.

Specify population, treatment conditions, outcome, handling of events after randomization, and summary measure. For a two-arm trial, a 12-month risk difference answers a different decision question from a hazard ratio or mean score difference. State whether death, treatment discontinuation, rescue therapy, or crossover is part of the outcome strategy or an intercurrent event requiring a defined handling approach.

A placebo-controlled trial asks a different question from an active-comparator trial. An active comparator can improve relevance when the real decision is between available treatments. Dose, duration, co-interventions, rescue rules, and adherence support need to be specified well enough for the strategy to be reproducible.

## Make allocation unpredictable and conceal it

Random sequence generation prevents recruiters from selecting assignment based on prognosis. Allocation concealment keeps the upcoming assignment unknown until eligibility and consent are final. Central web or telephone systems are common ways to maintain concealment. Alternation, date of birth, or unsealed envelopes can be predictable and permit selection.

Simple randomization is easy but can yield chance imbalances in small studies. Permuted blocks keep group sizes similar during recruitment, but fixed block sizes can become predictable; varying block sizes and concealing them helps. Stratification by a small number of strong prognostic factors can ensure representation, but excessive strata create operational complexity. Minimization can balance many factors but often includes a random component to retain unpredictability.

Baseline significance testing is not a test of randomization. Imbalances can occur by chance. Describe important baseline variables and use prespecified adjustment for strongly prognostic factors to improve precision. Do not choose covariates because a baseline p-value crossed a threshold.

## Match randomization to the intervention

In an individually randomized parallel trial, each participant receives one strategy. A factorial design randomizes two or more interventions, often efficiently estimating main effects, but interaction and combination effects need adequate sample size and compatible treatment assumptions. A crossover trial has participants receive multiple treatments in sequence; it requires stable disease, reversible effects, adequate washout, and analysis accounting for within-person correlation and period effects. Carryover can invalidate a simple paired comparison.

When an intervention is delivered to clinics, schools, or communities, cluster randomization avoids contamination but reduces effective sample size because outcomes within clusters are correlated. With average cluster size m and intraclass correlation ρ, the approximate design effect is 1+(m−1)ρ. For 20 people per clinic and ρ=0.05, this is 1.95: nearly twice the sample size may be required relative to independent individuals. Unequal cluster sizes can increase the penalty. Analyze according to the assignment unit and account for clustering in standard errors.

Pragmatic trials aim to estimate effects under routine conditions, while explanatory trials test efficacy under controlled conditions. This is a spectrum. Eligibility, site selection, flexibility of care, follow-up intensity, and outcome collection shape generalizability. A pragmatic label does not guarantee that results transport to all routine settings.

## Plan sample size around precision and decisions

For a continuous outcome with equal allocation, a rough per-arm sample size for detecting mean difference Δ is

$$
n \approx \frac{2\sigma^2(z_{1-\alpha/2}+z_{1-\beta})^2}{\Delta^2}.
$$

For standard deviation 10, target difference 4, two-sided α=0.05 and 80% power, n≈98 per arm before allowance for loss to follow-up. The calculation depends on the outcome distribution and intended analysis. A clinically important difference should be justified from patient relevance, not selected because it makes recruitment convenient.

For binary endpoints, event probability drives precision; for time-to-event endpoints, required events can matter more than total enrollment. Inflate for attrition, nonadherence if relevant to the estimand, cluster design effect, and planned subgroup or interim analyses. A statistically significant effect can be too small to matter, while a clinically important estimate may remain inconclusive if the interval is wide. Report confidence intervals and clinically meaningful thresholds alongside p-values.

## Analyze according to assignment and outcome structure

The primary analysis should follow the prespecified estimand. For a binary endpoint under ITT, compare randomized groups and report arm-specific risks and a risk difference or ratio with confidence interval. Covariate-adjusted analyses can improve precision if specified in advance and use baseline variables. For continuous outcomes, baseline adjustment often improves efficiency compared with change scores alone. For time-to-event endpoints, state censoring assumptions and present absolute survival or cumulative incidence at relevant horizons.

Missing outcome data threaten randomization’s protection if missingness depends on prognosis differently by group. Prevent missingness through follow-up independent of treatment discontinuation when ethically appropriate. Report amount and reasons by arm. Multiple imputation or likelihood-based approaches rely on assumptions about missingness; perform sensitivity analyses for departures, especially when missingness could depend on unobserved outcomes.

Multiplicity arises from many endpoints, time points, treatment arms, subgroups, and interim looks. Prespecify a primary endpoint and analysis, and use hierarchical testing or adjusted error rates when confirmatory claims span multiple hypotheses. Secondary analyses should be labeled accordingly. Post hoc subgroups are hypothesis-generating.

## Worked interpretation: risk difference

Suppose 100 of 500 participants assigned a new treatment and 125 of 500 controls experience the primary outcome by one year. Risks are 20% and 25%; the risk difference is −5 percentage points, and the risk ratio is 0.80. The number needed to treat is 1/0.05=20 over one year, if the treatment-policy contrast is causal and the risk difference is stable in the target population. This does not mean every 20th person benefits; it is an average contrast. Report uncertainty around the risk difference before presenting the reciprocal, since its interval can be asymmetric or cross zero.

    treated <- c(event = 100, total = 500)
    control <- c(event = 125, total = 500)
    p1 <- treated["event"] / treated["total"]
    p0 <- control["event"] / control["total"]
    c(risk_treated = p1, risk_control = p0,
      risk_difference = p1 - p0,
      risk_ratio = p1 / p0,
      NNT = 1 / (p0 - p1))

This code gives point estimates only; use a prespecified regression or randomization-based method for intervals and adjust for clustering if assignment was clustered. NNT should be tied to a specific horizon and outcome definition.

## Handle adherence, deviations, and safety transparently

ITT answers the effect of assignment even if some participants never start treatment, switch, or receive rescue therapy. Excluding nonadherent participants breaks randomization because adherence can depend on prognosis. A per-protocol analysis can estimate the effect of adherence to assigned strategies only after accounting for predictors of adherence and censoring, often with weighting. Present it as complementary, with its additional assumptions.

Unblinding can influence co-interventions and outcome reporting, especially for subjective endpoints. Use blinded outcome assessment where feasible and objective outcomes where appropriate. Safety monitoring should record exposure time, severity, relatedness, and stopping rules. Trials are often too small to detect rare harms; postmarketing or registry evidence may be needed.

For noninferiority, define a clinically justified margin before observing results. The confidence interval must exclude unacceptable loss, not merely fail to show superiority. Both intention-to-treat and per-protocol analyses may be informative because nonadherence can bias toward apparent similarity. Equivalence requires the entire interval to lie within both sides of a prespecified margin. These are design claims, not interpretations added after a nonsignificant superiority test.

## Report the trial so its result can be judged

Publish the protocol and statistical analysis plan before unblinding where possible. Report sequence generation, concealment, masking, participant flow, deviations, outcomes, and harms. Use CONSORT guidance and give trial registration. Describe the population and settings so readers can assess applicability. Share enough analytic detail to reproduce estimates.

Randomization supports causal inference for the assigned strategies in the enrolled population when allocation is preserved and outcome ascertainment is adequate. Generalization beyond that population requires additional reasoning. State the limitations directly: chance imbalance, missing data, adherence, imprecision, outcome measurement, cluster structure, or restricted eligibility. A clear account of what was randomized and what was estimated makes the trial useful beyond its p-value.

## Calculate precision for the chosen estimand

Sample-size planning is not a ritual to obtain 80% power. It encodes the smallest effect worth detecting, the variability or event rate, allocation ratio, type I error, desired power, and analysis. These inputs should be clinically defensible and consistent with the primary outcome. A minimum clinically important difference is a decision threshold, not a statistical convenience. If the planned interval is too wide to distinguish worthwhile benefit from harm, the trial may be uninformative even if its nominal power is high under a large assumed effect.

For a continuous outcome under equal allocation and a normal approximation, per-arm size is approximately

$$
n=\frac{2\sigma^2(z_{1-\alpha/2}+z_{1-\beta})^2}{\Delta^2}.
$$

Suppose the outcome SD is 10, the difference of interest is 4, two-sided alpha is .05, and power is 80%. With z values 1.96 and 0.84, n≈2(100)(2.8²)/16≈98 per arm. If 10% of outcomes are expected missing, divide by 0.90, yielding about 109 per arm. This inflation only compensates for sample size under a particular missingness assumption; it does not remove bias from differential missingness.

For binary outcomes, event probability determines information. If the control risk is 25% and the intervention is expected to lower it to 20%, calculation should target the chosen absolute or relative effect and account for continuity corrections or exact methods if event counts are small. For time-to-event studies, the number of events often drives power more directly than total enrollment; recruitment duration, accrual, and follow-up determine how many events accrue.

Cluster randomization needs a design effect. If mean cluster size is 20 and intraclass correlation is 0.05, a rough multiplier is 1+(20−1)(0.05)=1.95. This nearly doubles the independent-person sample size before accounting for unequal cluster sizes or small numbers of clusters. Recruiting many participants in only a few clusters cannot substitute for enough independent randomization units. Specify whether the estimand is participant-average or cluster-average, since unequal cluster sizes can make these differ.

## Protect against interim decisions and multiplicity

Repeatedly examining unblinded results and stopping when p<.05 inflates false-positive probability. If interim looks are planned, specify timing, information fraction, boundaries, who sees the data, and the data monitoring committee’s remit before recruitment. Group-sequential designs allocate the type I error across looks; O’Brien–Fleming-type boundaries are stringent early and approach the conventional threshold near the end. Futility rules may be nonbinding or binding and should be clear. Early stopping for benefit can exaggerate treatment effects because estimates that cross a boundary are often unusually large.

Multiplicity also arises across multiple primary endpoints, doses, treatment arms, subgroup hypotheses, and repeated time points. A hierarchical testing plan can preserve confirmatory interpretation for a sequence of outcomes; familywise adjustments or false discovery approaches may suit other goals. Designate one primary endpoint and time point. Report all prespecified outcomes even when results are unfavorable, and label exploratory analyses as exploratory.

The data monitoring committee typically reviews accumulating unblinded efficacy and safety data independently of investigators. It considers benefit, harm, futility, data quality, and external evidence, not merely a threshold crossing. Stopping decisions have ethical and statistical consequences; an overly rigid numeric boundary ignores clinical context, while undisclosed discretion invites bias. Publish the monitoring plan and explain decisions without exposing confidential interim data.

## Design noninferiority and equivalence as distinct questions

A noninferiority trial asks whether a new treatment is not unacceptably worse than an active comparator by a prespecified margin. The margin must be justified clinically and statistically, often with reference to the established comparator benefit over placebo. A margin chosen after seeing results is not credible. The confidence interval for the treatment contrast must rule out losses beyond the margin; a nonsignificant superiority test does not establish noninferiority.

Equivalence requires the entire confidence interval to lie within both the lower and upper margins. It is therefore not the same as “no statistically significant difference.” Nonadherence, crossover, and poor assay sensitivity can bias toward similarity, so both ITT and per-protocol analyses are often examined. Interpretation depends on design quality and consistency, not selecting whichever analysis passes.

## Analyze randomized assignment without discarding it

The primary ITT analysis retains participants in their randomized groups regardless of adherence. Randomization protects the assignment contrast at baseline, not every post-randomization comparison. Excluding participants who stop treatment or fail a protocol can select on prognosis and undermine that protection. Explain how deaths, rescue treatment, treatment switching, and discontinuation enter the estimand.

For baseline covariate adjustment, prespecify prognostic factors and use a method compatible with the randomization. In small trials, chance imbalance is possible; adjustment can improve precision but should not be driven by baseline p-values. In stratified or blocked designs, account for the design variables. In cluster trials, analyze at participant level with correct cluster-robust or mixed-model variance, or aggregate at cluster level with appropriate weighting. Very few clusters can make standard asymptotic corrections unreliable.

Report effect estimates and confidence intervals, not only a p-value. A treatment difference may be statistically detectable but clinically trivial. Conversely, an interval spanning both important benefit and important harm is inconclusive rather than evidence of no effect. For harms, show absolute frequencies and denominators, seriousness, and follow-up duration; relative measures alone can obscure low event rates.

## Preserve follow-up and examine missingness

Collect outcomes even after treatment discontinuation whenever ethically and practically possible. This maintains the treatment-policy estimand and reduces differential missingness. Report missing outcome counts by arm and reasons, including whether missingness preceded or followed an intercurrent event. Compare baseline predictors of missingness and examine whether patterns suggest differential observation.

Likelihood-based models and multiple imputation can be valid when missingness is conditionally independent of the unobserved outcome given observed data and the models are adequate. Pattern-mixture or tipping-point analyses can show how severe departures would need to be to change conclusions. Last observation carried forward is generally not a neutral solution: it assumes no change after the last measurement and understates uncertainty. No missing-data method can substitute for strong retention and transparent reporting.

## Think beyond the enrolled sample

Randomization supports a comparison among participants who were eligible and enrolled under the trial’s procedures. Applying the result elsewhere requires assessing differences in baseline risk, treatment delivery, adherence, competing care, and effect modifiers. A narrow eligibility trial may identify efficacy under controlled conditions but provide limited evidence for people with multimorbidity or different access to care. Report recruitment setting, exclusions, and participant characteristics so readers can judge applicability.

An estimate is also tied to the follow-up horizon. A one-year risk difference may not predict five-year benefit or harm if treatment effects change over time, adherence declines, or delayed adverse effects emerge. Plot cumulative outcomes when appropriate and state whether proportional hazards or constant effects were assumed. Avoid extrapolating beyond observed follow-up without an explicit model.

## Make protocol deviations visible

Protocol deviations should be classified by timing and consequence. Eligibility violations discovered after randomization remain part of ITT; excluding participants after assignment can break randomization. Major deviations that affect treatment delivery may inform a per-protocol estimand, but the exclusion rule and adjustment need prespecification. Report deviations by randomized arm without implying that an imbalance alone invalidates randomization.

Blinding can fail even when a trial is nominally double blind. Distinctive side effects may reveal assignment and affect co-intervention or reporting. Ask participants and assessors about perceived assignment when relevant, and prioritize objective outcome ascertainment. In open-label pragmatic trials, standardize outcome definitions and adjudication to reduce differential measurement.

## References and further reading

- Schulz KF, Altman DG, Moher D. CONSORT 2010 Statement: updated guidelines for reporting parallel group randomised trials. *BMJ*. 2010;340:c332. https://doi.org/10.1136/bmj.c332
- ICH E9(R1). [Addendum on estimands and sensitivity analysis in clinical trials](https://www.ich.org/page/efficacy-guidelines).
- Hernán MA, Robins JM. [*Causal Inference: What If*](https://www.hsph.harvard.edu/miguel-hernan/causal-inference-book/). Chapman & Hall/CRC; 2020.
- Campbell MK, Piaggio G, Elbourne DR, Altman DG. CONSORT 2010 statement: extension to cluster randomised trials. *BMJ*. 2012;345:e5661. https://doi.org/10.1136/bmj.e5661
- Piantadosi S. *Clinical Trials: A Methodologic Perspective*. 2nd ed. Wiley; 2005.
- Friedman LM, Furberg CD, DeMets DL, Reboussin DM, Granger CB. *Fundamentals of Clinical Trials*. 5th ed. Springer; 2015.
