---
title: Decision-curve analysis
summary: Evaluate whether a prediction model improves clinical decisions using net benefit across clinically meaningful risk thresholds.
---

## Overview and key ideas

**Decision-curve analysis (DCA)** evaluates whether using a prediction model to guide action produces more benefit than strategies such as acting on everyone or no one. It is especially useful when a model estimates an individual's probability of an outcome and a clinical action has unequal consequences for missed cases and unnecessary interventions.

For a chosen threshold probability `p_t`, act on people whose predicted risk is at least `p_t`. The threshold encodes a trade-off: the odds `p_t / (1 − p_t)` represent how many false-positive interventions are considered acceptable relative to one true-positive intervention, under the decision assumptions. Net benefit is commonly calculated as:

`Net benefit = (true positives / n) − (false positives / n) × [p_t / (1 − p_t)]`.

Thus, false positives are weighted by the threshold odds. DCA plots net benefit over a clinically reasonable range of thresholds. A model is potentially useful where its curve is above “treat none” and “treat all” and above relevant alternative models. The method evaluates consequences implied by a specified decision threshold; it is not a universal measure of model quality.

## When to use it

Use DCA when the decision is threshold-based, the predicted probabilities can be used at the intended decision point, and clinicians or patients can identify a defensible range of action thresholds. Examples include whether to refer for imaging, offer preventive therapy, or intensify follow-up. Compare the model against realistic alternatives, including current practice when possible.

DCA complements discrimination and calibration evaluation. A model with useful net benefit needs sufficiently accurate probabilities in the relevant population; DCA does not excuse poor calibration or validation. Evaluate it on external or appropriately held-out data, and quantify uncertainty (often with bootstrap methods).

## Assumptions and limitations

- **Threshold meaning:** A threshold should reflect the relative consequences of action and inaction, not be selected solely because it makes a model curve look favorable. The implied trade-off may vary across patients and settings.
- **Valid probabilities:** The model should be calibrated in the target population, especially near the thresholds being evaluated. Miscalibration can misclassify who crosses the threshold.
- **Well-defined action and outcome:** “Treat” should correspond to a clear intervention, and the outcome should be measured over a decision-relevant time horizon. Treatment benefit and harm may vary between patients, while standard DCA treats them through a common threshold weight.
- **No causal effect from prediction alone:** DCA estimates decision value under the assumed threshold weighting; it does not prove that implementing the model improves outcomes. An impact study may be needed.
- **Data leakage and optimism:** Evaluating a model on its development data exaggerates performance. Use external validation or nested resampling that repeats the full model-development process.
- **Competing options and capacity:** Treat-all and treat-none are useful references but may not represent actual practice, resource constraints, or several available actions. Decision-analytic extensions may be needed.
- **Uncertainty:** A visually higher curve may reflect sampling noise. Show confidence intervals or uncertainty bands and avoid overinterpreting tiny differences.

## Worked example

In a validation cohort of 1,000 people, 100 experience the outcome. At a threshold of 10%, a model flags 80 people: 50 are true positives and 30 are false positives. Its net benefit is:

`50/1,000 − (30/1,000) × (0.10/0.90) = 0.050 − 0.00333 = 0.0467`.

Treat-none has net benefit 0. Treat-all has `100/1,000 − (900/1,000) × (0.10/0.90) = 0`, also zero at this threshold. In this sample and at this threshold, the model has net benefit 0.0467, or about 47 net true-positive equivalents per 1,000 people under the threshold's weighting.

This calculation does not mean the model prevents 47 events. It is a weighted decision metric. To claim clinical benefit, the threshold must be appropriate, predictions must be usable and calibrated, and implementation effects—including treatment efficacy, harms, and workflow—must be assessed.

## Interpretation and common pitfalls

- Explain the threshold range clinically; do not report a favorable interval of thresholds without explaining whose decisions it represents.
- Do not interpret net benefit as accuracy, events prevented, or the number needed to treat.
- Compare model-guided care to all relevant strategies and usual care, not just to a convenient null strategy.
- A high AUC alone does not imply net benefit: ranking can improve while probabilities remain miscalibrated or recommendations fail to cross useful thresholds.
- Report the target population, outcome prevalence, prediction time point, action, threshold range, validation approach, and uncertainty.
- If a model is evaluated only retrospectively, describe DCA as estimated potential utility, not evidence that deployment improves patient outcomes.

## Decision theory behind net benefit

A binary threshold decision has two possible actions: intervene or do not intervene. For a person with predicted event probability `p`, suppose intervention yields benefit `B` if the event would occur and harm/cost `H` if it would not; for a simplified derivation, treat `B` and `H` as commensurate utility units. The expected utility difference between intervening and not intervening is `pB − (1−p)H`. Intervention is preferred when this exceeds zero, equivalently `p > H/(B+H)`. Thus the threshold probability is not an arbitrary classifier cutoff: it represents a relative consequence tradeoff under the assumed utility structure. Rearranging gives `H/B = p_t/(1−p_t)`, the false-positive weight used in conventional net benefit.

For threshold `p_t`, model-guided net benefit per patient is `TP/n − FP/n × p_t/(1−p_t)`. One true positive is counted as one unit, and a false positive incurs a weight corresponding to the threshold odds. This normalization makes net benefit interpretable in “true-positive equivalents,” but those equivalents are a decision metric, not events prevented. For treat-all, `NB_all = prevalence − (1−prevalence)×p_t/(1−p_t)`; treat-none has net benefit zero under the convention that no action creates neither benefit nor harm. At thresholds below prevalence, treat-all may have positive net benefit; above prevalence, its net benefit is negative.

DCA compares strategies at a series of thresholds. It does not optimize a threshold by inspecting the same data, and it does not prove that the assumed threshold is acceptable to patients or clinicians. Threshold ranges should be elicited from the decision context in advance. If multiple actions exist (e.g., surveillance, biopsy, or treatment), a binary treat/not-treat curve may oversimplify; use multi-action decision analysis or compare concrete policies.

## Example with manual calculation

In 1,000 validation patients, 100 experience the outcome. At a 10% threshold the model refers 80 people: 50 are true positives and 30 false positives. Then `NB_model = 50/1000 − (30/1000)(0.1/0.9) = 0.04667`. Treat-none gives 0. Treat-all gives `0.10 − 0.90(0.1/0.9)=0`. The model therefore has an estimated advantage of 0.04667 over either strategy. Multiplying by 1,000 gives about 46.7 weighted true-positive equivalents per 1,000 decisions. This does not mean 47 cases will be prevented; actual benefit depends on whether acting changes outcomes, intervention efficacy, harms, and uptake.

The threshold odds at 10% are `0.1/0.9=1/9`: in this simplified utility framing, one false-positive action carries one ninth the weight of a true-positive benefit. At 20%, the odds are 0.25, so false positives are penalized more heavily. Consequently, a model can be useful at one threshold range and not another. A high sensitivity or AUC alone does not determine clinical value.

## Probability quality and validation

Conventional DCA treats a prediction at or above threshold as action-eligible. Calibration is therefore central. If predicted risks are systematically too high near the threshold, too many people cross it; if too low, people who could benefit may be missed. Calibration-in-the-large, calibration slope, and smooth calibration curves should be reported alongside discrimination. Calibration must be assessed in the target population and at the intended prediction time. Recalibration may be needed when baseline risk changes, but should be based on appropriate data and evaluated without leakage.

For a model developed from data, evaluate the entire development procedure. A random train-test split can waste data or create unstable estimates, especially for small datasets. Bootstrap optimism correction or cross-validation can estimate internal performance; external validation tests transport to new settings or time periods. If variable selection, imputation, feature engineering, and hyperparameter tuning occurred, they must be repeated inside resampling folds. Applying DCA to apparent predictions or cross-validated predictions that inadvertently used validation outcomes in preprocessing creates optimistic curves.

For censored outcomes, binary DCA at a fixed horizon must handle censoring appropriately. Simply labeling people without observed events as non-events biases the confusion counts. Use estimators that account for censoring, such as inverse-probability-of-censoring weighting or appropriate survival decision-curve methods, and state assumptions about censoring and competing risks. For competing events, clarify whether the predicted probability is a cause-specific cumulative incidence and how the action affects competing outcomes.

## R implementation and uncertainty

The following base R function computes net benefit from predicted probabilities and binary outcomes at one horizon:

```r
net_benefit <- function(y, risk, thresholds) {
  stopifnot(length(y) == length(risk), all(y %in% c(0, 1)))
  n <- length(y)
  vapply(thresholds, function(pt) {
    act <- risk >= pt
    tp <- sum(act & y == 1)
    fp <- sum(act & y == 0)
    tp / n - fp / n * pt / (1 - pt)
  }, numeric(1))
}

thresholds <- seq(0.05, 0.30, by = 0.01)
nb_model <- net_benefit(validation$event, validation$risk, thresholds)
prev <- mean(validation$event)
nb_all <- prev - (1 - prev) * thresholds / (1 - thresholds)
nb_none <- rep(0, length(thresholds))
```

This assumes complete binary outcome ascertainment, independent rows for the simple calculation, and calibrated predictions from a valid validation set. It computes point estimates only. Use patient-level bootstrap resampling to create uncertainty bands; if there is site clustering, resample sites or use a cluster-aware method. Curves across thresholds are highly correlated, so pointwise intervals are not simultaneous confidence bands. Avoid declaring superiority because one curve is microscopically higher at a single threshold.

## From potential utility to clinical impact

DCA is model-based evaluation of a strategy's potential decision value under stipulated weights. It does not incorporate every operational effect of deployment: clinician override, test availability, adherence, treatment response, capacity constraints, unequal access, or workflow displacement. If model-guided care appears promising, a prospective impact evaluation can compare outcomes under the model strategy and usual practice, often through a randomized or stepped implementation design. Monitor calibration drift and subgroup net benefit after deployment.

Where treatment efficacy varies with patient characteristics, a risk model for outcome is not necessarily a treatment-benefit model. Predicting who will have an event under current care may identify high-risk people, but those people may not benefit most from the intervention. Decision analysis should use counterfactual treatment benefit or explicitly assume a common relative treatment effect. Likewise, a predictor may be associated with outcome but not actionable. DCA does not establish causal treatment-effect heterogeneity.

Report the intended action, population, prediction horizon, threshold range and rationale, prevalence, comparator strategies, validation design, calibration, uncertainty, missing/censored outcome handling, and whether results represent retrospective potential utility or prospective impact. Include enough information to reproduce predicted action counts and net-benefit curves. Link the statistical curve back to actual clinical consequences and resource constraints.


## Thresholds, competing risks, and heterogeneous consequences

The threshold-to-odds translation assumes a stable exchange rate between the benefit of correctly intervening and harm of unnecessary intervention. In practice, harms may vary: a test may be more burdensome for frail patients, treatment may be contraindicated in some groups, or capacity constraints may make false-positive referrals costly. A single threshold can then conceal individual utility differences. Consider subgroup-specific thresholds or a richer decision model, but ensure these are clinically justified and do not encode inequitable access as a lower expected benefit.

Thresholds also depend on what happens after the model acts. A 10% risk threshold for a low-harm screening test is not comparable to a 10% threshold for major surgery. When the action is diagnostic testing followed by treatment only if positive, the policy has multiple stages; test harms, test accuracy, downstream actions, and patient preferences all matter. Conventional DCA may be applied to the first decision, but its utility weights should represent the full pathway or be supplemented with decision analysis.

For time-to-event outcomes, risk depends on horizon. A 5-year absolute risk prediction is not an instantaneous hazard and should be compared with an action threshold relevant to a 5-year decision. If competing death prevents the event, cumulative incidence should reflect that competing event rather than censor it as though independent. Model recalibration for a different horizon or competing-risk distribution may materially alter net benefit.

DCA can be used to compare a model with another model, but the difference curve needs interpretation. A more complex model may have small incremental net benefit over a simpler model while adding cost, workflow burden, or implementation risk. Clinical usefulness should consider whether the gain changes enough decisions to justify complexity. Report counts of people assigned to action at key thresholds, true and false positives, and expected workload to make the abstract curve operationally meaningful.

## Bootstrap uncertainty example

For independent validation participants, a simple percentile bootstrap can estimate pointwise uncertainty:

```r
set.seed(2026)
B <- 1000
boot_nb <- replicate(B, {
  i <- sample.int(nrow(validation), replace = TRUE)
  net_benefit(validation$event[i], validation$risk[i], thresholds)
})
lo <- apply(boot_nb, 1, quantile, 0.025)
hi <- apply(boot_nb, 1, quantile, 0.975)
```

These are pointwise intervals and treat the fitted model as fixed. They capture sampling variation in the validation cohort, not uncertainty from developing the model. To estimate development-process optimism, resample development data and repeat imputation, feature selection, tuning, and model fitting within each bootstrap sample, then evaluate on out-of-bootstrap observations. For clustered validation data, resample the independent clusters. With few events, percentile bands can be unstable; report event counts and avoid overclaiming smoothness.

A decision curve is calculated across thresholds using the same participants, so adjacent points are correlated. A collection of pointwise intervals does not guarantee that the entire curve lies within the displayed band with 95% probability. Simultaneous bands or a prespecified threshold contrast may be more appropriate when making a formal superiority claim. In most applications, uncertainty should communicate the range of plausible decision value rather than produce a binary significance test for the curve.


## Policy evaluation and fairness considerations

A model can show positive average net benefit while performing poorly for a subgroup. Compare calibration and net benefit across clinically important populations, and examine whether access to the downstream intervention differs. A threshold that is nominally common may not represent equal utility if treatment benefit, harm, or patient preferences differ. Subgroup analyses are often imprecise, so show uncertainty and avoid ranking populations by unstable point estimates. Fairness cannot be inferred from one parity metric; the relevant concern depends on the intervention and the consequences of errors.

External validation should reproduce the actual care setting. If a prediction is made before clinician assessment in deployment, evaluating predictions after clinicians have already selected tests can create spectrum and selection differences. If care following prediction changes the outcome, retrospective outcome labels may not represent untreated risk. Treatment paradox can occur: high-risk patients receive effective preventive treatment and therefore appear to have lower observed event rates. Prediction targets and labels must be defined relative to the care pathway.

A health system may have limited capacity, so a threshold policy could refer more patients than resources permit. Capacity-constrained decision rules rank patients or allocate slots and cannot always be represented by one fixed risk threshold. Evaluate expected health outcomes, waiting times, and displaced care under the actual policy. DCA can inform but not fully model capacity allocation or dynamic queues.


## Reporting a complete decision-curve result

A useful report shows more than a curve. At a few clinically chosen thresholds, tabulate the percentage assigned to intervention, true-positive and false-positive counts per 1,000, net benefit, and difference in net benefit versus usual care. This makes the trade-off visible and allows clinicians to judge workload. State how thresholds were selected and whether they came from patient preferences, guidelines, or an explicit harm-benefit calculation. If the threshold range is wide, explain why decisions across that range are plausible in the target setting.

Separate model performance from strategy performance. AUC and calibration characterize predictions; net benefit characterizes a threshold policy under utility assumptions; an impact trial estimates what happens after implementation. These are complementary stages. A model can be well calibrated but have no advantage over current practice if it does not change decisions. Conversely, a model with an apparently favorable retrospective curve may fail operationally if predictions arrive too late or action capacity is unavailable.

Before deployment, define monitoring for calibration drift, changes in event prevalence, subgroup performance, and intervention harms. A recalibration plan should specify who can update the model, what validation is required, and how version changes are tracked. DCA on post-deployment data can identify changing potential utility but should not replace monitoring actual patient outcomes and unintended consequences.


## A threshold sensitivity illustration

At thresholds `p_t = 0.05`, `0.10`, and `0.20`, the false-positive weights are respectively `0.0526`, `0.1111`, and `0.25`. A false-positive action is therefore penalized nearly five times as heavily at 20% as at 5%. For each threshold, recompute who is classified for action and the resulting TP and FP counts; do not keep one confusion matrix while changing the threshold weight. A model may have higher net benefit at 5% but lower net benefit at 20%, reflecting different acceptable balances of missed cases and unnecessary intervention. This is why threshold selection should be justified clinically before looking at the validation curve.


## References and further reading

- Vickers AJ, Elkin EB. [Decision curve analysis: a novel method for evaluating prediction models](https://doi.org/10.1177/0272989X06295361). *Medical Decision Making*. 2006;26(6):565–574.
- Vickers AJ, Van Calster B, Steyerberg EW. [Net benefit approaches to the evaluation of prediction models, molecular markers, and diagnostic tests](https://doi.org/10.1136/bmj.i6). *BMJ*. 2016;352:i6.
- Van Calster B, McLernon DJ, van Smeden M, Wynants L, Steyerberg EW. [Calibration: the Achilles heel of predictive analytics](https://doi.org/10.1186/s12916-019-1466-7). *BMC Medicine*. 2019;17:230.
- Kerr KF, Brown MD, Zhu K, Janes H. Assessing the clinical impact of risk prediction models with decision curves: guidance for correct interpretation and appropriate use. *Journal of Clinical Oncology*. 2016;34(21):2534–2540. [https://doi.org/10.1200/JCO.2015.65.565](https://doi.org/10.1200/JCO.2015.65.565)
- The library's [ROC curves and AUC article](roc-curves-and-auc.html) covers discrimination; [sensitivity, specificity and predictive values](sensitivity-specificity-and-predictive-values.html) explains threshold-specific test performance.
