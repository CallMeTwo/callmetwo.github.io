---
title: Health economic evaluation
summary: Compare the costs and health consequences of alternative interventions, including cost-effectiveness, QALYs, incremental analysis, and uncertainty.
---

## Overview

Health-economic evaluation compares the costs and consequences of alternative health interventions. It asks whether the additional health gained from one option is worth its additional resource use from a specified decision maker’s perspective. Common forms include cost-effectiveness analysis using natural health units, cost-utility analysis using quality-adjusted life-years (QALYs), cost-benefit analysis using monetary values, and cost-minimization when outcomes are demonstrably equivalent.

Economic evidence complements clinical efficacy. A treatment can improve outcomes and still be poor value at its price; a modestly effective program may be worthwhile if inexpensive and scalable. Results depend on perspective, population, time horizon, outcome measurement, comparator, and willingness-to-pay threshold. These choices should be set before examining results.

## Frame the decision and perspective

Specify the decision context: population, intervention, comparator, setting, and decision maker. The comparator should represent current practice or the next-best feasible alternative, not an irrelevant placebo if patients would otherwise receive active care. State whether the perspective is health system, payer, provider, patient, or societal. Perspective determines which costs count. A health-system analysis might include medication and hospitalization costs; a societal analysis may also include patient travel and productivity loss.

Set a time horizon long enough to capture important costs and consequences. A short trial may miss future complications or benefits. Extrapolation beyond observed follow-up requires a model, assumptions about survival and treatment effects, and validation. Use a decision tree for short, discrete pathways and state-transition or individual-level simulation for recurrent events and long-term trajectories. Match complexity to the question and data.

Define the health outcome. Cost-effectiveness analysis may use life-years gained, events prevented, or symptom improvement. Cost-utility analysis uses QALYs, combining survival and health-related quality of life. QALYs depend on preference weights and duration; report how utilities were measured and whose preferences they represent. Cost-benefit analysis values health outcomes in money, which raises additional valuation and equity questions.

## Measure costs and health outcomes

Resource use can include medications, visits, tests, admissions, staff time, patient expenses, and productivity. Identify quantities and unit costs separately. Micro-costing records detailed inputs; gross-costing applies average costs to service counts. Use current, setting-appropriate prices and state currency and price year. Distinguish charges from opportunity costs; billed charges do not necessarily represent resources consumed.

Costs are often skewed, with many low values and a few very high-cost patients. Mean cost is usually the relevant per-person total for budget impact, but its uncertainty may require bootstrap or generalized models. Do not compare medians alone when the decision concerns total expenditure. Explain handling of zero costs, censoring, recurrent costs, and missing follow-up.

For QALYs, utility weights typically range from death at 0 to full health at 1, though some states may be valued below zero. Utility is integrated over time. If a patient spends half a year at utility .8 and half a year at .6, undiscounted QALYs are .5(.8)+.5(.6)=.7. State whether utilities came from patient reports, general-population preferences, mapping, or literature.

## Incremental comparison and worked example

Economic evaluation compares differences, not isolated totals. Let ΔC be mean cost in intervention minus comparator and ΔE the corresponding health effect. The incremental cost-effectiveness ratio is ICER=ΔC/ΔE. Suppose a new program costs $6,000 more per patient and yields 0.4 additional QALYs. ICER=$6,000/.4=$15,000 per QALY. At a willingness-to-pay threshold λ=$20,000/QALY, incremental net monetary benefit is INMB=λΔE−ΔC=$20,000(.4)−$6,000=$2,000. Positive INMB favors the new program under that threshold.

The ratio can be difficult to interpret when ΔE is near zero or negative. Plot incremental costs and effects on the cost-effectiveness plane and report INMB across thresholds. Strategies that cost more and produce fewer QALYs are dominated; extended dominance can occur when a combination of alternatives provides better value. Do not interpret a single ICER without uncertainty and comparators.

~~~r
delta_cost <- 6000
delta_qaly <- 0.4
icer <- delta_cost / delta_qaly
lambda <- 20000
inmb <- lambda * delta_qaly - delta_cost
c(ICER = icer, INMB = inmb)
~~~

These values are illustrative. In an empirical study, estimate mean incremental costs and effects for the target population, account for missingness and censoring, and preserve paired patient-level differences. Report the price year and perspective. A positive INMB is not a universal statement of affordability or equity.

## Uncertainty and decision thresholds

Sampling uncertainty in costs and outcomes can be represented using nonparametric bootstrap of patients, preserving treatment groups and any cluster assignment. Each replicate yields ΔC, ΔE, ICER, and INMB. The cost-effectiveness plane displays joint uncertainty; a cost-effectiveness acceptability curve shows the probability of positive INMB over λ values. It is a probability conditional on data and analysis assumptions, not the probability the intervention is objectively cost-effective.

Parameter uncertainty in a decision model is distinct from sampling uncertainty. Probabilistic sensitivity analysis assigns distributions to uncertain parameters and simulates outcomes. Structural uncertainty concerns model form, extrapolation, and omitted pathways; examine alternative assumptions and scenarios. One-way sensitivity analysis can identify influential inputs but does not summarize joint uncertainty.

A willingness-to-pay threshold reflects opportunity costs and decision context. It may not be a single accepted number. Report INMB over a plausible range and distinguish cost-effectiveness from budget impact: an intervention can be good value per QALY but unaffordable at scale. Budget impact estimates total expenditure over a budget period given uptake and eligible population.

## Trial-based and model-based evaluation

Trial-based analyses use observed resource use and outcomes alongside a clinical study. Randomization supports a causal comparison within the trial population, but missing follow-up, short horizon, protocol-driven care, and trial participation can limit inference. Use intention-to-treat consistent with the estimand, account for censoring, and explain extrapolation beyond trial duration.

Model-based evaluations synthesize evidence from trials, registries, and literature to represent longer-term pathways. Specify states, transitions, cycle length, treatment effects, utilities, costs, and validation. Avoid double-counting events or applying relative effects to incompatible baseline risks. Calibration to observed data and external validation strengthen confidence but do not prove the model is correct.

## Equity, distribution, and affordability

Standard cost-effectiveness analysis often aggregates health gains and costs, potentially hiding who benefits and who bears costs. Distributional cost-effectiveness analysis can examine health impacts by subgroup and trade-offs between total health and equity. Report subgroup assumptions and uncertainty. Consider whether access barriers mean projected benefits will reach the intended population.

Affordability depends on eligible population, uptake, implementation capacity, and budget constraints. A low ICER can coexist with a large total budget impact. Conversely, a high-cost intervention may be targeted to a small group. Decision makers need both value and financial impact, plus operational feasibility.

## Reporting and reproducibility

Report perspective, population, comparator, time horizon, discounting, outcome measure, cost components, unit prices, price year, missing-data methods, analytic model, and uncertainty. Provide incremental costs and effects, dominance assessment, ICER and INMB, threshold range, and sensitivity analyses. Identify data sources, assumptions, and validation. Use CHEERS 2022 to support transparent reporting.

### Discounting and time horizon

Costs and health consequences that occur in the future are often discounted to reflect time preference and opportunity cost. If annual discount rate r applies to a cost or outcome at year t, present value is value_t/(1+r)^t. A $1,000 cost in five years discounted at 3% has present value about $1,000/(1.03)^5=$863. Apply rates according to relevant national or payer guidance and test alternatives. Costs and health effects may have different prescribed rates in some jurisdictions.

The horizon should capture meaningful differences between strategies. A vaccination program may have up-front costs and benefits years later; a 12-month horizon would omit most value. Lifetime horizons require assumptions about survival, recurrence, waning effects, and future costs. Extrapolation uncertainty can dominate sampling error. Show results for alternative horizons and treatment-effect duration assumptions.

A Markov model cycles through health states such as stable disease, complication, and death. Transition probabilities and state utilities can generate costs and QALYs over time. Half-cycle correction, competing risks, and tunnel states may matter. Individual-level simulation may represent history-dependent risks more naturally but is harder to validate. Explain why the chosen structure represents the disease pathway.

### Estimating patient-level cost and outcome differences

In a randomized study, calculate total costs and outcomes per person over the follow-up horizon, then estimate group means and incremental differences. Preserve pairing of cost and effect within each patient for bootstrap analysis. Costs are often right-skewed, but arithmetic mean differences remain relevant to a payer deciding total expenditures. Generalized linear models can adjust for baseline variables, but report the estimand and marginal adjusted means rather than only a regression coefficient on a transformed scale.

Censoring can make observed costs incomplete when follow-up differs. Methods include inverse-probability weighting, multiple imputation, or model-based extrapolation under assumptions. Complete-case comparisons can select patients with longer or more successful follow-up. Describe costs accrued before censoring and use sensitivity analyses for unobserved future costs. For terminal care costs, mortality can create complex dependence between cost and survival; model them jointly or justify the chosen approach.

Missing utility measurements also affect QALYs. Linear interpolation between observed utility points assumes a path between visits; it can miss acute changes. Mapping from a disease-specific score introduces prediction error. Multiple imputation should preserve treatment, survival, utility trajectory, and predictors of missingness. Test alternative assumptions when drop-out relates to health state.

## The cost-effectiveness plane and ratios

Plot each bootstrap replicate’s incremental cost and effect. The northeast quadrant means more costly and more effective; southeast is less costly and more effective (dominant); northwest is more costly and less effective (dominated); southwest is less costly and less effective, requiring a value judgment. The ICER ratio becomes unstable near zero incremental effect and can occupy multiple quadrants. This is why net benefit is often easier for statistical inference.

For each willingness-to-pay value λ, INMB=λΔE−ΔC. The intervention is favored if INMB is positive. A cost-effectiveness acceptability curve plots the proportion of bootstrap or probabilistic simulations with positive INMB. This probability summarizes uncertainty conditional on inputs and model. It is not a posterior probability unless generated under an explicitly Bayesian analysis.

An incremental net monetary benefit calculation from the example is $2,000 at λ=$20,000/QALY. If the standard error of ΔE and ΔC is substantial, many joint draws may yield negative INMB. Report a confidence interval or acceptability curve, and show how it changes across λ. State the distribution and correlation assumptions for model parameters.

## Probabilistic sensitivity analysis

In a decision model, assign probability distributions to uncertain inputs: beta for probabilities or utilities bounded 0–1, gamma or lognormal for positive costs, and suitable distributions for relative effects. Draw parameter sets jointly, run the model, and calculate incremental costs, QALYs, and INMB. Correlations should be retained where evidence supports them. Arbitrary independent sampling can create implausible parameter combinations.

One-way analysis varies one input at a time and can show which assumptions drive results, but does not represent joint uncertainty. Scenario analysis can test structural choices such as treatment waning, alternative mortality extrapolation, or inclusion of caregiver costs. Value-of-information analysis estimates whether additional evidence might be worth collecting, but requires careful decision-model specification.

~~~r
set.seed(21)
B <- 5000
delta_cost <- rgamma(B, shape = 25, rate = 25 / 6000)
delta_qaly <- rnorm(B, mean = 0.4, sd = 0.08)
lambda <- 20000
inmb <- lambda * delta_qaly - delta_cost
mean(inmb > 0)
quantile(inmb, c(.025, .5, .975))
~~~

This simulation is illustrative and assumes independent cost and effect uncertainty, which may be unrealistic. In a trial-based analysis, bootstrap paired patient data instead. The fraction with positive INMB depends on the assumed sampling or parameter distribution and should not be described without its conditioning assumptions.

### Cost-effectiveness versus affordability

Cost-effectiveness compares incremental costs with incremental health outcomes; budget impact asks whether a payer can fund the program over a near-term budget horizon. Estimate eligible population, uptake, implementation costs, substitution from existing services, and price changes. A favorable ICER does not imply that implementation is affordable, especially for a large population.

Implementation costs include training, infrastructure, monitoring, and patient support. Savings may accrue to a different budget holder or later period than the initial investment. Report annual spending and cash-flow timing. Consider scale-up constraints and whether capacity can deliver the intervention with trial-level effectiveness.

Thresholds vary across decision makers and opportunity costs. A threshold based on historical practice may not reflect marginal health displaced elsewhere. Present a range and avoid false precision. Decision makers also consider severity, unmet need, distributional effects, and uncertainty beyond one numerical ratio.

### Perspective and distributional choices

From a patient perspective, travel time, out-of-pocket payments, and informal care can matter. A payer perspective may exclude productivity loss; a societal perspective may include it. The selected perspective is normative and changes the result. Present alternative perspectives when stakeholders have legitimate different interests.

Distributional analyses examine which subgroups receive costs and benefits. An intervention can improve total QALYs while widening gaps if uptake is lower among disadvantaged groups. Report subgroup outcomes and access assumptions, and consider equity weights only when their ethical basis is explicit. Avoid claiming a single aggregate ICER resolves distributional concerns.

### Practical data quality in economic studies

Resource-use instruments should match the setting and recall period. Patient recall of hospitalizations can be incomplete; administrative claims can omit services outside coverage. Linkage requires consent, stable identifiers, and assessment of unmatched records. Unit costs should reflect resource opportunity cost and be updated to a stated price year using appropriate indices.

Cost categories should avoid double counting. If a bundled payment already includes laboratory tests, do not add them again. Productivity estimates depend on method and employment assumptions. Utilities measured with EQ-5D or another preference instrument should identify version, tariff, and respondent. Sensitivity analyses should examine alternative cost sources and utility values.

## Reporting the economic result

Show mean costs and outcomes by arm, incremental differences with uncertainty, price year, perspective, horizon, discount rates, and missingness. Report the cost-effectiveness plane, INMB across thresholds, and sensitivity analysis. If only one comparator is assessed, explain why alternatives were omitted. Provide model structure and inputs in supplementary materials where possible.

Use CHEERS 2022 to report objectives, setting, comparators, population, outcomes, and assumptions. Distinguish a trial-based analysis from a model extrapolation. Explain whether uncertainty is sampling, parameter, structural, or methodological. State what evidence would most change the decision and whether impact or budget evaluation remains necessary.

### Bootstrap uncertainty from trial data

A patient-level bootstrap preserves the pairing of costs and outcomes and can estimate uncertainty in incremental net benefit. Resample within randomized groups when allocation was individual; for cluster randomization, resample clusters. If cost and QALY data have different missingness, imputation or weighting must be repeated within each replicate. Do not bootstrap rows independently when repeated observations belong to the same patient.

~~~r
set.seed(31)
B <- 2000
boot_inmb <- replicate(B, {
  id <- sample(seq_len(nrow(dat)), replace = TRUE)
  d <- dat[id, ]
  dc <- mean(d$cost[d$arm == "new"]) - mean(d$cost[d$arm == "usual"])
  de <- mean(d$qaly[d$arm == "new"]) - mean(d$qaly[d$arm == "usual"])
  20000 * de - dc
})
quantile(boot_inmb, c(.025, .5, .975))
~~~

This code assumes complete patient-level data and independent randomization. Clustered or missing data require design-specific resampling and analyses. It estimates uncertainty in INMB at one threshold, not a complete decision model or budget impact.

## Model credibility and validation

A transparent model should be internally checked for arithmetic, state occupancy, and face validity, then compared with external survival, utilization, or cost data. Validate intermediate outcomes as well as total QALYs and costs. If the model reproduces observed trial data only because parameters were tuned to it, that fit is not independent validation. Document calibration targets, deviations, and data limitations.

Structural sensitivity analyses should vary assumptions about treatment duration, recurrence, mortality, utility after events, and future care. Show which choices reverse the decision. A model can be mathematically correct yet inappropriate if it excludes relevant comparators, patient costs, or implementation constraints.

Report both deterministic checks and probabilistic results, and preserve input sources and code so an analyst can reproduce a result. Cost-effectiveness models are decision aids; their conclusions should be revisited when prices, clinical evidence, service capacity, or societal preferences change.

If uncertainty includes structural model choices, present scenario results alongside the probabilistic analysis rather than burying them in a single wide interval. Identify which assumptions are supported by direct evidence and which rely on expert judgment.

State how cost and health outcomes were valued and whether the analysis included patient preferences, implementation constraints, and distributional effects.

Report uncertainties in units and currency as well as relative changes.

Revisit findings when prices, clinical evidence, or service capacity change.

## Price and currency transparency

State currency and price year whenever costs are compared. If converting currencies or inflating prices, document exchange rates and indices; otherwise apparent cost differences may reflect accounting conventions rather than resource use.

## References and further reading

- Husereau D, Drummond M, Augustovski F, et al. CHEERS 2022 statement. *BMJ*. 2022;376:e067975. [doi:10.1136/bmj-2021-067975](https://doi.org/10.1136/bmj-2021-067975).
- Drummond MF, Sculpher MJ, Claxton K, Stoddart GL, Torrance GW. *Methods for the Economic Evaluation of Health Care Programmes*. 4th ed. Oxford University Press; 2015.
- See [Decision-curve analysis](decision-curve-analysis.html) for threshold-based predictive utility.
