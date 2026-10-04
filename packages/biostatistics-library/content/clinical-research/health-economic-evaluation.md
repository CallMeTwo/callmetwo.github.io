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

## References and further reading

- Husereau D, Drummond M, Augustovski F, et al. [CHEERS 2022 statement: updated reporting guidance for health economic evaluations](https://doi.org/10.1136/bmj-2021-067975). *BMJ*. 2022;376:e067975.
- National Institute for Health and Care Excellence. [NICE health technology evaluations: the manual, economic evaluation](https://www.nice.org.uk/process/pmg36/chapter/economic-evaluation-2/). Follow the version and reference-case rules relevant to the decision context.
- Sanders GD, Neumann PJ, Basu A, et al. [Recommendations for conduct, methodological practices, and reporting of cost-effectiveness analyses: Second Panel on Cost-Effectiveness in Health and Medicine](https://doi.org/10.1001/jama.2016.12195). *JAMA*. 2016;316(10):1093–1103.
- The library's [effect sizes article](../inference/effect-sizes.html) discusses meaningful effect scales; [meta-analysis and forest plots](meta-analysis-and-forest-plots.html) covers synthesis of evidence that may inform model inputs.
