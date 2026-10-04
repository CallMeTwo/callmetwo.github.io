---
title: Health economic evaluation
summary: Compare the costs and health consequences of alternative interventions, including cost-effectiveness, QALYs, incremental analysis, and uncertainty.
---

## Overview and key ideas

A **health economic evaluation** compares at least two alternatives in terms of both costs and consequences. It asks whether additional health gains justify additional resource use from a stated decision-maker's perspective. Common forms include cost-effectiveness analysis (outcomes in natural units), cost-utility analysis (often quality-adjusted life-years, QALYs), and cost-benefit analysis (both costs and benefits expressed in monetary units). A cost analysis that compares expenditures without measuring consequences is not a full comparative economic evaluation.

The perspective determines which costs and consequences count. A health-system perspective may include medical care paid by that system; a societal perspective may also include patient time, informal care, and productivity effects. The **time horizon** must be long enough to capture important differences in costs and outcomes. A model may combine trial data with external evidence to extrapolate beyond observed follow-up, but extrapolation adds uncertainty.

For two strategies, incremental cost-effectiveness ratio (ICER) is:

`ICER = (Cost_new − Cost_comparator) / (Effect_new − Effect_comparator)`.

For cost-utility analysis, the effect is often QALYs: a year in a health state is weighted by its health-related quality-of-life utility (usually anchored at 0 for death and 1 for full health, though some states may be valued below 0). Decision-makers compare incremental cost and effect with an opportunity-cost threshold or use net benefit, `λ × effect − cost`, where `λ` is the value placed on a unit of health gain.

## When to use it

Use comparative economic evaluation when decision-makers must allocate limited resources among interventions, services, or technologies. Trial-based analyses can use observed resource use and outcomes; decision models are useful when evidence comes from multiple sources, outcomes extend beyond trial follow-up, or uncertainty and long-term consequences matter. Budget-impact analysis is related but asks whether a payer can afford adoption over a budget period; it does not replace cost-effectiveness analysis.

## Assumptions and limitations

- **Perspective and costing:** State whose costs count, the price year, currency, setting, resource quantities, and unit costs. A narrow perspective can omit costs shifted to patients, caregivers, or other services.
- **Comparator and population:** Compare with current relevant practice and define the population, setting, and intervention strategies. Results can change with the comparator and baseline risk.
- **Time horizon:** A short horizon can miss delayed benefits or downstream costs; a long horizon requires transparent extrapolation and validation.
- **QALYs and utilities:** Utility weights depend on instruments, respondents, valuation methods, and context. A QALY is a summary measure and may not capture every distributional or equity concern.
- **Discounting:** Future costs and health effects are generally discounted to present value under jurisdiction-specific guidance. Report the rates and explore alternatives when required; rates and reference-case rules vary by decision-maker and can change over time.
- **Incremental analysis:** Order strategies by cost, remove dominated and extendedly dominated options where appropriate, and compare incremental rather than average ratios. An ICER can be difficult to interpret when incremental effects are near zero or when an option is both more effective and less costly.
- **Uncertainty:** Parameter uncertainty, structural uncertainty, and heterogeneity can materially affect conclusions. Use deterministic and probabilistic sensitivity analyses, scenario analyses, and value-of-information methods when useful.
- **Transferability and equity:** Costs, clinical practice, utilities, and thresholds differ across settings. A cost-effective average result does not establish affordability, equitable access, or equal benefit across groups.
- **Reporting versus quality:** CHEERS 2022 is a reporting checklist. Complete reporting improves transparency but does not by itself establish that the model, data, or conclusions are methodologically sound.

## Worked example

Over a common 10-year horizon, a new intervention costs $24,000 per patient and yields 5.4 QALYs; usual care costs $18,000 and yields 5.0 QALYs. Incremental cost is `$24,000 − $18,000 = $6,000`; incremental effect is `5.4 − 5.0 = 0.4 QALYs`. The ICER is `$6,000 / 0.4 = $15,000 per QALY gained`.

At an illustrative willingness-to-pay value of $20,000 per QALY, incremental net monetary benefit is `($20,000 × 0.4) − $6,000 = $2,000`. This suggests the new strategy is cost-effective under that threshold and these inputs. It does not mean it saves money: it costs more and gains health. If costs and QALYs are discounted over the 10-year horizon, the example's numbers should already represent present values; the chosen rates must follow the target jurisdiction's guidance. Uncertainty in effectiveness, utilities, costs, and extrapolation should be reflected in sensitivity analyses rather than hidden behind one ICER.

## Interpretation and common pitfalls

- Do not call an intervention “cost-effective” without stating the comparator, perspective, horizon, outcome metric, threshold, and uncertainty.
- Do not compare ICERs from studies with different perspectives, populations, horizons, price years, or modeling assumptions as though they were directly interchangeable.
- Do not confuse cost-effectiveness with affordability. A good value per QALY may still have a large budget impact.
- Avoid reporting only an ICER when strategies are dominated, incremental effects are near zero, or costs and effects have complex uncertainty; show incremental costs and effects and a cost-effectiveness plane or acceptability curve where appropriate.
- Show model structure, data sources, validation, assumptions, and sensitivity analysis. Probabilistic sensitivity analysis propagates parameter uncertainty but does not resolve structural uncertainty or biased evidence.
- Treat CHEERS as guidance for what to report, not a certification of analytic quality.

## Decision problem, perspective, and analytic structure

An economic evaluation is a structured comparison of alternative courses of action for a defined decision-maker and population. Specify the decision problem before extracting costs: target population, setting, intervention and comparator, perspective, time horizon, outcome measure, and decision rule. The perspective determines whose costs and outcomes count. A payer perspective may include reimbursed medical services; a healthcare-sector perspective can include health services regardless of payer; a societal perspective can add patient time, informal care, transport, and productivity where appropriate. A transfer may be a cost to one party and a saving to another, so perspective changes the ledger and sometimes the conclusion.

Choose the horizon to capture meaningful differences in survival, quality of life, recurrence, adverse effects, and downstream resource use. Trial follow-up can support direct estimates during observed time, but long-term extrapolation requires a model. State structure should reflect clinically distinct states and transitions; a cohort Markov model uses transition probabilities between states, while microsimulation follows individuals with attributes and history. Partition survival models may be suitable when individual-level trial data exist, but extrapolated state occupancy should remain clinically plausible. Model complexity is not evidence quality: a simple model with transparent inputs may be preferable to an opaque microsimulation.

For cohort state-transition models, a row vector of state occupancy `s_t` evolves as `s_(t+1) = s_t P`, where `P` is a transition matrix whose rows sum to one. If `c` is the vector of state costs and `u` the state utility vector, expected costs and QALYs over cycles can be accumulated as `Σ d_C(t) s_t c` and `Σ d_E(t) s_t u Δt`, with appropriate discount factors `d_C,d_E`. Apply half-cycle corrections when events can occur throughout a cycle and the discrete cycle approximation would otherwise systematically overcount time in states. Validate that transition probabilities, state occupancy, costs, and outcomes behave plausibly under extreme scenarios.

## Costs, outcomes, and incremental decisions

Measure resource quantities and unit costs separately where possible. Record currency and price year; adjust older prices with relevant health-sector or inflation indices and convert currencies transparently when comparing countries. Include implementation, training, infrastructure, monitoring, adverse events, and downstream care if they differ between strategies and belong to the chosen perspective. Avoid double-counting bundled costs or counting transfer payments as resource use without a rationale.

QALYs combine duration and health-related quality weights: a patient spending half a year at utility 0.8 accrues approximately `0.5×0.8=0.4` QALYs, under the conventional area-under-the-curve approach. Utility instruments and valuation sets matter. Utility may vary over time, and baseline utility should be included when estimating within-person change. QALYs support comparison across conditions but can obscure distributional priorities, severity, caregiver effects, or non-health benefits. Present disaggregated outcomes when relevant and consider distributional cost-effectiveness analysis if equity is central.

Order strategies by cost and remove simple dominance (a strategy costs more and yields fewer health gains) and extended dominance (a strategy has a higher ICER than a more effective alternative). Compute incremental ratios between adjacent nondominated options, not separate average ratios versus a convenient baseline. ICERs can be negative in two quadrants: a cheaper, more effective intervention is dominant, whereas a more costly, less effective option is dominated. When incremental effects approach zero, the ratio becomes unstable and misleading. Net monetary benefit is often easier for uncertainty analysis: `NMB(λ)=λE−C`; incremental NMB is positive when the intervention is preferred at willingness-to-pay value `λ`.

### Worked calculation with dominance

Suppose three strategies have costs and QALYs: A ($10,000; 4.0), B ($14,000; 4.3), C ($20,000; 4.5). B versus A costs $4,000 for 0.3 QALY, ICER $13,333/QALY. C versus B costs $6,000 for 0.2 QALY, ICER $30,000/QALY. At `λ=$20,000/QALY`, incremental NMB is $2,000 for B versus A; C versus B is `20,000×0.2−6,000=−$2,000`. B is preferred among these options under the threshold. If C instead yielded 4.6 QALYs for $21,000, C's incremental ICER versus B would be $70,000/QALY; if its ratio exceeded that of a still more effective option, extended dominance could remove an intermediate strategy. Always show the cost-effect and health differences and the alternatives retained.

## Discounting and uncertainty

Discount future costs and health outcomes to reflect time preference and the opportunity cost of resources, using rates and reference-case rules of the relevant jurisdiction. Rates can differ across jurisdictions and guidance changes, so do not hard-code a generic value as universal. Test alternative rates and timing assumptions. The discount convention matters for cycle models: apply factors using cycle midpoints or another prespecified convention consistently.

Distinguish parameter uncertainty (imprecise transition probabilities, costs, utilities), structural uncertainty (model form, omitted states, treatment waning), heterogeneity (real effect variation across patients), and methodological uncertainty (perspective, discount rate, outcome valuation). Deterministic one-way and scenario analyses reveal drivers but do not quantify joint probability. Probabilistic sensitivity analysis samples uncertain parameters jointly from defensible distributions and recalculates incremental outcomes. Preserve correlation: for example, costs and event rates may share a source or be correlated. Avoid independently sampling probabilities that must sum to one; use a multinomial or suitable transformed parameterization.

A cost-effectiveness plane plots incremental cost against incremental QALYs, showing uncertainty and the four decision quadrants. A cost-effectiveness acceptability curve gives the proportion of probabilistic iterations with positive incremental NMB across `λ`; it is not the probability the intervention is “cost-effective” in an absolute sense unless uncertainty distributions and decision context are appropriately interpreted. Expected value of perfect information estimates the expected value of eliminating parameter uncertainty; expected value of sample information can inform whether further research is worth its cost. These quantities depend on population size, time horizon, and decision lifetime, not just individual-level uncertainty.

## R calculations and model checks

For a simple two-arm analysis from trial data:

```r
incremental <- function(cost_new, qaly_new, cost_control, qaly_control,
                        lambda = 20000) {
  dC <- cost_new - cost_control
  dE <- qaly_new - qaly_control
  c(delta_cost = dC, delta_qaly = dE,
    ICER = if (dE == 0) NA_real_ else dC / dE,
    incremental_NMB = lambda * dE - dC)
}
incremental(24000, 5.4, 18000, 5.0)
```

This returns $6,000 incremental cost, 0.4 QALY, $15,000/QALY, and $2,000 incremental NMB at $20,000/QALY. For paired patient-level data, bootstrap the joint cost and effect outcomes by patient (or cluster, if randomized by cluster); do not bootstrap costs and QALYs independently because their covariance affects uncertainty. For a model, use probabilistic simulation and report convergence/stability checks. Compare model predictions with external data, validate face validity with clinicians, and test extreme parameter values. Calibration against the same evidence used to construct the model is not independent validation.

## Reporting and decision interpretation

Present the reference case first, then transparent scenario analyses. Explain why inputs were chosen, their uncertainty distributions, source populations, and transformations. Report incremental costs and effects, NMB or ICER, uncertainty, subgroup results where prespecified, and budget impact separately. Cost-effectiveness is not affordability: a highly cost-effective intervention can be unaffordable at scale, while budget impact does not indicate value for money. Neither economic measure answers distributional fairness by itself.

A result is transferable only when epidemiology, treatment pathways, prices, utilities, capacity, and opportunity costs are sufficiently similar or adapted. Local adaptation should not consist only of changing currency. State the decision threshold's source and uncertainty; thresholds approximate opportunity cost and are not universal biological constants. Explain whose opportunity costs and health gains are represented. Reporting checklists such as CHEERS improve completeness but do not certify methods. Publish model code and input documentation where possible, while protecting participant privacy and proprietary data. The library's [clinical trial article](../study-design/randomized-controlled-trials.html) discusses trial endpoints and [effect sizes article](../inference/effect-sizes.html) covers interpretation of meaningful health gains.


## Handling patient-level economic data

Costs are often right-skewed, with many moderate observations and a few very expensive admissions. The arithmetic mean is still the relevant average resource use for a budget decision, even when the distribution is skewed. A log transformation changes the estimand and can produce bias when retransformed; bootstrap confidence intervals, generalized linear models with suitable distributions/link functions, or two-part models can be considered. QALYs may be bounded or concentrated near zero, but methods should target mean differences that decision makers need. For randomized economic evaluations, adjust for baseline utility and stratification variables when prespecified to improve precision.

Missing cost and utility data may be related to health status and healthcare use. Complete-case analysis can be biased and inefficient. Multiple imputation should include treatment, outcome, baseline predictors, resource-use variables, and auxiliary predictors of missingness, with distributions and bounds appropriate to each variable. Impute cost and effect jointly or preserve their dependence. Sensitivity analyses under departures from missing at random can explore how conclusions change if missing patients have systematically different costs or utilities.

Cluster trials and repeated observations require the analysis to respect design. Ignoring within-person repeated utility measures can underestimate uncertainty; ignoring cluster assignment can overstate precision. Patient-level bootstrap resampling should occur at the randomized unit when appropriate. If costs and QALYs are compared at group level, preserve the covariance between them because incremental net benefit is `λΔE−ΔC` and its variance depends on `Cov(ΔE,ΔC)`.

## Model transparency and validation

Document the conceptual model before coding: health states, events, treatment pathways, cycle length, competing risks, and assumptions about treatment waning. Use a diagram and explain why relevant events are included or omitted. Parameter sources should be linked to the target population; relative treatment effects may need to be combined with local baseline risks. Extrapolation can dominate lifetime results, so show alternative survival distributions, hazard shapes, treatment waning, and mortality assumptions. External validation may compare predicted survival, state occupancy, costs, or QALYs with independent cohorts or registries.

Internal verification checks that code implements the conceptual specification: extreme-case tests, conservation of cohort size, probability sums, event accounting, and independent replication of key calculations. Face validation asks clinical experts whether structure and outputs are plausible, but expert agreement cannot establish empirical accuracy. Document software, code version, random seeds for probabilistic analyses, and any manual corrections. Where code cannot be released, provide enough equations and inputs for a reviewer to reproduce the model.

Value-of-information analyses can identify whether uncertainty could change the decision. Expected value of perfect information is the expected gain from eliminating all parameter uncertainty; expected value of partial perfect information focuses on selected parameters. Expected value of sample information models a proposed future study and its ability to reduce decision uncertainty, accounting for study cost and delay. These analyses can help prioritize research, but are only as credible as the underlying decision model and evidence distributions.


## Distributional and affordability questions

An average incremental cost-effectiveness result can conceal who gains and who bears costs. Distributional cost-effectiveness analysis estimates health gains and opportunity costs across socioeconomic or clinical groups and makes equity weights explicit. Equity weights are value judgments and should be visible, not embedded silently in a model. Report subgroup effects only when evidence supports them, and distinguish heterogeneity in treatment response from differences caused by access or baseline risk.

Budget impact analysis complements cost-effectiveness by estimating the cash-flow consequences of adoption over a payer's short-term budget horizon. It uses eligible population size, uptake, displacement, implementation costs, and timing. A cost-effective intervention can create an unaffordable near-term budget impact; a budget-neutral intervention may still deliver poor health value. Present these as separate questions to decision makers.

Productivity costs are contentious because valuation methods can favor working-age groups and omit unpaid labor. The chosen perspective and valuation method should follow the decision context and applicable guidance. If productivity is excluded from a health-system reference case, a supplementary societal scenario can show its influence without conflating perspectives. Similarly, caregiver outcomes and patient time may matter even when excluded from a narrow payer perspective.


## Interpreting thresholds and uncertainty for decision makers

A willingness-to-pay value `λ` is often treated as a fixed threshold for reporting, but decision makers may face an uncertain opportunity-cost threshold. Show results over a range and explain the source of any reference value. Positive incremental NMB at a selected λ indicates preference under that value and modeled uncertainty; it does not mean the intervention is universally efficient. If evidence uncertainty is large, report the probability of positive incremental NMB and expected value of additional research alongside a clear statement of structural limitations.

For multiple comparators, pairwise comparisons against usual care can be misleading because the preferred option may depend on the set of available alternatives. Present the efficient frontier and remove dominated strategies before interpreting ICERs. If a new option changes the treatment pathway or makes a previously irrelevant alternative feasible, include the complete decision set. Where the decision is sequential—for example, test first, treat after a positive result—model the full sequence rather than attributing all costs and QALYs to the initial technology alone.


## References and further reading

- Husereau D, Drummond M, Augustovski F, et al. [CHEERS 2022 statement: updated reporting guidance for health economic evaluations](https://doi.org/10.1136/bmj-2021-067975). *BMJ*. 2022;376:e067975.
- National Institute for Health and Care Excellence. [NICE health technology evaluations: the manual, economic evaluation](https://www.nice.org.uk/process/pmg36/chapter/economic-evaluation-2/). Follow the version and reference-case rules relevant to the decision context.
- Sanders GD, Neumann PJ, Basu A, et al. [Recommendations for conduct, methodological practices, and reporting of cost-effectiveness analyses: Second Panel on Cost-Effectiveness in Health and Medicine](https://doi.org/10.1001/jama.2016.12195). *JAMA*. 2016;316(10):1093–1103.
- The library's [effect sizes article](../inference/effect-sizes.html) discusses meaningful effect scales; [meta-analysis and forest plots](meta-analysis-and-forest-plots.html) covers synthesis of evidence that may inform model inputs.
