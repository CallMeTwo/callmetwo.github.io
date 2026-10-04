---
title: Decision-curve analysis
summary: Evaluate whether a prediction model improves clinical decisions using net benefit across clinically meaningful risk thresholds.
---

## Overview

Decision-curve analysis (DCA) evaluates whether using a prediction model to guide an action could provide more benefit than harm across a range of risk thresholds. It reports net benefit, which combines true positives and false positives using a threshold probability as the relative weight of their consequences. DCA complements discrimination and calibration: it asks about potential decision value, not simply ranking or probability accuracy.

DCA is meaningful when the outcome, action, target population, and threshold range have clinical meaning. A curve cannot establish that clinicians will follow recommendations or that the action improves health. It is a model-based decision analysis whose assumptions should be checked, followed by prospective impact evaluation when adoption is contemplated.

## Deriving net benefit

For N patients, let TP be true positives and FP false positives at threshold p_t. Net benefit is NB = TP/N − FP/N × p_t/(1−p_t). The threshold encodes the relative harm of a false positive compared with the benefit of a true positive. For example, p_t=.20 implies weighting each false positive by .20/.80=.25 true-positive equivalents.

The treat-none strategy has net benefit zero. Treat-all has NB=prevalence−(1−prevalence)×p_t/(1−p_t). A model is potentially useful where its curve exceeds these alternatives over thresholds that clinicians and patients consider plausible. Select the threshold range from the decision context, not after seeing which portion makes the model look favorable.

## Worked calculation

Suppose 1,000 patients are evaluated, with 100 events. At threshold .10, a model identifies 70 true positives and 180 false positives. NB=.07−.18(.10/.90)=.05. This is equivalent to 50 net true-positive decisions per 1,000 under the threshold’s weighting. Treat-all NB=.10−.90(.10/.90)=0; treat-none NB=0. At this threshold the model has greater calculated net benefit than either reference strategy.

At threshold .30, suppose the model identifies 40 true positives and 60 false positives. NB=.04−.06(.30/.70)=.0143. Treat-all NB=.10−.90(.30/.70)=−.2857, while treat-none remains zero. The model is above both references, but utility interpretation depends on whether .30 is a plausible threshold and whether intervention benefits and harms are represented by that preference.

~~~r
dca_nb <- function(y, p, threshold) {
  flag <- p >= threshold
  tp <- sum(flag & y == 1)
  fp <- sum(flag & y == 0)
  n <- length(y)
  tp / n - fp / n * threshold / (1 - threshold)
}
~~~

The code assumes a binary outcome coded 0 and 1, complete predictions, and one independent record per decision. For repeated decisions per patient, define the estimand and uncertainty method to account for clustering. Calculate treat-all and treat-none at every threshold, and bootstrap at the patient or cluster level.

## Probability quality and validation

DCA uses thresholds on predicted probability. If predictions are poorly calibrated, a nominal threshold may not represent the intended risk trade-off. Assess calibration in independent representative data. DCA does not replace calibration; it evaluates a decision rule based on scores and threshold interpretation.

Validation splits should match use: patient-level for new patients, temporal for future deployment, and site-level for new institutions. Model tuning and threshold selection must not use the final test data. Compare models on the same held-out individuals and report uncertainty. Bootstrap net benefit using a resampling unit that respects dependence.

For case-control data, event prevalence is set by sampling and does not represent deployment. Net benefit and treat-all curves depend on prevalence. Use a representative cohort or correct estimates using known sampling fractions and explicit assumptions. Censoring, competing risks, and time-dependent outcomes require a risk definition at a specified horizon.

## Choosing thresholds and actions

A threshold should represent a real decision trade-off. At p_t=.10, the implied relative cost of a false positive is one-ninth that of a false negative in the simple framework. Actual decisions include multiple harms, treatment burden, costs, and patient preferences. The intervention must be effective for those identified, and service capacity matters.

Elicit thresholds before inspecting curves. Ask clinicians and patients what risk justifies action, what false-positive burden is acceptable, and whether action changes across the range. A model that improves net benefit only at implausible thresholds is not useful for that purpose. If capacity is fixed, a top-k policy may be more relevant than a probability threshold; evaluate that policy directly.

DCA generally considers a binary action and outcome. Multistage pathways, resource constraints, competing outcomes, and heterogeneous treatment effects can require richer decision models. Net benefit supports deliberation under stated assumptions; it is not an automatic model selection rule.

## From potential utility to clinical impact

A favorable decision curve does not demonstrate patient benefit. The calculation assumes that predicted risk is available, the threshold is used, the intervention has expected effects, and consequences are represented adequately. It does not automatically account for workflow failures, clinician override, adherence, or behavior changes.

Prospective evaluation can first run silently to verify data timing and calibration, then test implementation. Randomized or cluster-randomized impact studies can compare model-guided care with usual practice. Measure outcomes, adverse effects, workload, costs, and equity. The intervention is the complete system: model, interface, threshold, response, and monitoring.

## Uncertainty and subgroup considerations

Net-benefit estimates are uncertain, especially with few events or small subgroups. Bootstrap intervals should preserve patient or cluster units and repeat model development if estimating a selection procedure. Curves can cross; do not claim universal superiority based on one selected threshold. Report prevalence, event counts, and uncertainty over the prespecified range.

Subgroup DCA may reveal that a policy benefits one group and harms another, but small samples yield noisy curves. Assess calibration, threshold errors, and action consequences by group. Differences may result from access, measurement, or prevalence. Engage affected groups in defining relevant thresholds and acceptable trade-offs. Aggregate net benefit can conceal unequal burden.

## R workflow for a decision curve

Packages such as rmda or dcurves can compute and plot net benefit, but inspect how they define thresholds, prevalence, missingness, and uncertainty. If using custom code, verify calculations against a hand-worked example and a known implementation. Use held-out predicted probabilities rather than apparent training predictions.

~~~r
thresholds <- seq(0.05, 0.30, by = 0.01)
nb_model <- sapply(thresholds, function(t) dca_nb(y_test, p_test, t))
prev <- mean(y_test == 1)
nb_all <- prev - (1 - prev) * thresholds / (1 - thresholds)
nb_none <- rep(0, length(thresholds))
plot(thresholds, nb_model, type = "l",
     ylim = range(nb_model, nb_all, nb_none),
     xlab = "Threshold probability", ylab = "Net benefit")
lines(thresholds, nb_all, lty = 2)
lines(thresholds, nb_none, lty = 3)
~~~

This code shows point estimates only. Add bootstrap confidence bands and annotate the clinically justified threshold interval. Recompute predictions inside resampling if model-development uncertainty is part of the target. The final evaluation set should not be used to choose the threshold.

## Reporting a complete analysis

Report decision context, outcome horizon, target population, prediction model, validation cohort, prevalence, threshold range and rationale, comparison strategies, and net-benefit uncertainty. State whether predictions were calibrated and whether thresholds were prespecified. Explain what a unit of net benefit means for the study denominator and clinical action.

Show curves with an interpretable vertical scale and avoid exaggerating small differences. Include net benefit and action counts at key thresholds. Distinguish retrospective potential utility from prospective impact. Report subgroup results with uncertainty and note case-control sampling, censoring, or intervention-effect assumptions.

### Interpreting the threshold as a preference

Threshold probability p_t can be understood as the risk at which a decision maker is indifferent between acting and not acting under simplified assumptions. The ratio p_t/(1−p_t) represents the relative weight assigned to false positives. At p_t=.20, one false positive is weighted one quarter of a true positive; at p_t=.50, they are weighted equally. This interpretation assumes a binary action, consistent consequences across people, and a well-defined outcome horizon.

Clinical consequences are often more complex. A positive prediction may trigger a low-burden test or a high-risk intervention; false negatives may be rescued by routine care. Patient preferences and resource availability vary. Thresholds should therefore be elicited for a defined decision and population. If action effects differ by patient, a single threshold may not represent all individuals. Consider individualized utility or cost-effectiveness analysis rather than forcing a universal threshold.

Thresholds chosen from guidelines or clinician interviews should be documented before plotting. If researchers show only the interval where their model exceeds treat-all or treat-none, readers cannot judge whether that interval was selected post hoc. Display a prespecified clinically credible range, explain its basis, and report results outside it only as exploratory context.

## Action counts and worked policy comparison

Net benefit is easier to interpret when paired with numbers treated and events. At a given threshold, report how many would receive the intervention, how many events would be identified, and how many false-positive actions would occur. Two models can have similar net benefit but very different alert burdens or sensitivity, which may matter to a clinic with limited staff.

Suppose a risk model and a new model are evaluated in the same 2,000-person cohort. At threshold .15, the first has 90 true positives and 210 false positives; the second has 100 true positives and 300 false positives. For the first, NB=.045−.105(.15/.85)=.0265. For the second, NB=.05−.15(.15/.85)=.0235. Although the second detects 10 more events, the added false positives yield lower net benefit under this threshold weighting. A different threshold can change the comparison. Report both action counts and the assumptions that weight them.

Decision curves are descriptive summaries under modeled utility. They do not account automatically for downstream costs, treatment efficacy, adherence, adverse events, or the ability to deliver intervention. If a model’s positive predictions would trigger a test rather than treatment, the true-positive and false-positive consequences must reflect that test pathway.

### Bootstrap uncertainty calculation

A nonparametric bootstrap can estimate uncertainty in net benefit by resampling independent units, recalculating threshold decisions, and computing the formula in each replicate. For patient-level independent data, sample patients with replacement. For clustered care, sample clinics or use a cluster bootstrap. If the model itself was developed from the same dataset, repeat model fitting and tuning within each replicate to estimate uncertainty for the development procedure; otherwise the interval is conditional on a fixed model.

~~~r
set.seed(99)
B <- 1000
t <- 0.15
boot_nb <- replicate(B, {
  ii <- sample(seq_along(y_test), replace = TRUE)
  dca_nb(y_test[ii], p_test[ii], t)
})
quantile(boot_nb, c(.025, .5, .975))
~~~

This estimates sampling uncertainty for a fixed model at one threshold under independent observations. It does not account for model-selection uncertainty, clustering, threshold choice, or uncertainty in the relative harm encoded by t. For a full development evaluation, resample the development data, repeat preprocessing and tuning, predict on a bootstrap test or out-of-bag set, and document the procedure. For clustered data, resample clusters.

Pointwise confidence intervals across a curve do not form a simultaneous confidence band. Avoid interpreting isolated crossings that may result from sampling variation. If a threshold range is primary, consider summarizing area under the decision curve over that range or net benefit at prespecified thresholds, with uncertainty and a clear interpretation.

### Calibration and prevalence dependence

Although net benefit is calculated from classifications at thresholds, threshold values are probability preferences. Poor calibration means a threshold such as .20 may select patients whose actual risks are far from 20%. Discrimination can remain good while calibration fails. Assess calibration in the same target population and time period; if recalibration is required, evaluate DCA after recalibration on independent observations.

Prevalence affects treat-all net benefit and predictive values. Case-control sampling changes prevalence and can distort curves if raw sample proportions are used. One may reweight to target prevalence when case-control design and sampling fractions are known, but this does not solve spectrum differences or miscalibration. DCA using a convenience sample should be interpreted cautiously and not presented as direct clinical utility in a population it does not represent.

If an event is rare, a small number of false positives can outweigh true positives at thresholds reflecting substantial intervention burden. Report prevalence and absolute counts. For time-to-event targets, cumulative incidence at a fixed horizon may be needed; censoring requires inverse-probability weighting or other appropriate estimation. Competing events change who could experience the target outcome and should be handled explicitly.

### Comparators and current practice

Treat-all and treat-none are useful reference policies, but are not always realistic. A decision curve should include current clinical practice where it can be defined and evaluated. If clinicians use an existing score or multifactorial assessment, compare the candidate model with that strategy. The action should be the same across models; otherwise differences may reflect different interventions rather than predictions.

A model can dominate simple references and still add little beyond current practice. Conversely, modest net-benefit improvement may matter when applied to a large population, but implementation costs and capacity must be considered. Report how many additional true-positive actions and false-positive actions occur compared with the current strategy. Evaluate whether clinical teams can provide the intervention to those identified.

## Heterogeneous consequences and equity

The simple net-benefit formula assigns the same false-positive and false-negative trade-off to all people. In practice, intervention benefits, harms, access, and patient preferences can vary. A uniform threshold can distribute burdens unequally. Subgroup curves can explore differences, but require enough data and should be interpreted alongside calibration and decision consequences.

Equal net benefit across groups does not necessarily mean equitable care. One group may have less access to follow-up after a positive flag, or face greater burden from false alarms. Include downstream pathway access and treatment uptake. Engage affected groups in identifying outcomes and acceptable trade-offs. Aggregate curves can mask these differences.

For individualized treatment effects, risk prediction alone may not identify who benefits. A person with high untreated risk may also have high risk under treatment. DCA built on prognostic risk supports decisions only under assumptions about intervention effects represented by threshold weighting. For treatment allocation, causal effect estimates or a randomized policy evaluation may be necessary.

## Common implementation mistakes

Do not calculate DCA from fitted probabilities on the training data and call the result validation. Do not choose a threshold range after inspecting the curve. Do not compare curves calculated from different samples without accounting for case mix. Do not assume a high AUC implies positive net benefit. Do not omit calibration or the action consequences. Do not interpret positive net benefit as observed patient benefit.

Check the formula and denominator. Some software reports standardized net benefit, net reduction in interventions, or scaled values; label the quantity and confirm against a hand calculation. Verify whether event coding and threshold inclusivity match expectations. If predictions are missing, report how those patients were handled and whether missingness differs by risk.

### A decision-focused interpretation

A useful conclusion states: in this population and at the prespecified threshold range, the model had higher estimated net benefit than the named alternatives; this corresponded to a stated number of additional true-positive decisions and false-positive actions; uncertainty was quantified using a specified resampling unit; and the estimate assumes a defined action and outcome horizon. It then clarifies that prospective impact and implementation costs remain to be assessed.

This phrasing keeps the inference proportional to evidence. DCA can help determine whether a model warrants a prospective evaluation or which threshold deserves testing. It cannot alone establish effectiveness, cost-effectiveness, or fairness.

## Choosing DCA versus economic evaluation

DCA expresses utility in true-positive equivalents using a risk threshold, which can be intuitive when a single action is considered. It does not usually account for monetary costs, quality-adjusted survival, budget impact, or competing program choices. Health-economic evaluation may be needed when comparing interventions with different costs and health outcomes. The methods can complement each other: DCA can assess classification policy value, while economic analysis examines resource allocation and cost-effectiveness.

Do not translate net benefit directly into money without an explicit utility or cost model. Similarly, a cost-effectiveness result does not guarantee that a prediction threshold is calibrated or useful at the point of care. Keep the decision question and scale of consequences clear.

When presenting a curve, mark the prespecified range, state whether values are pointwise estimates, and label the comparator lines. Avoid a truncated vertical axis that makes a small absolute difference appear decisive. Include a table of representative thresholds and counts so readers can assess both statistical and practical size.

Report implementation feasibility, follow-up completeness, and any recalibration performed before drawing conclusions about potential utility.

State whether prediction thresholds are applied once or repeatedly, since repeated decisions change both action counts and dependencies.

### Interpreting curve crossings

When curves cross within the plausible threshold range, there may be no single best policy. Report which strategy is favored at each decision region and discuss whether thresholds differ among patients or services.

## References and further reading

- Vickers AJ, Elkin EB. Decision curve analysis: a novel method for evaluating prediction models. *Medical Decision Making*. 2006;26:565–574. [doi:10.1177/0272989X06295361](https://doi.org/10.1177/0272989X06295361).
- Vickers AJ, Van Calster B, Steyerberg EW. Net benefit approaches to the evaluation of prediction models, molecular markers, and diagnostic tests. *BMJ*. 2016;352:i6. [doi:10.1136/bmj.i6](https://doi.org/10.1136/bmj.i6).
- See [ROC curves and AUC](roc-curves-and-auc.html) for discrimination and [Health economic evaluation](health-economic-evaluation.html) for cost and outcome trade-offs.
