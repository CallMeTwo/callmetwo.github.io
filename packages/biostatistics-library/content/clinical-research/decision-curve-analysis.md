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

## References and further reading

- Vickers AJ, Elkin EB. [Decision curve analysis: a novel method for evaluating prediction models](https://doi.org/10.1177/0272989X06295361). *Medical Decision Making*. 2006;26(6):565–574.
- Vickers AJ, Van Calster B, Steyerberg EW. [Net benefit approaches to the evaluation of prediction models, molecular markers, and diagnostic tests](https://doi.org/10.1136/bmj.i6). *BMJ*. 2016;352:i6.
- Van Calster B, McLernon DJ, van Smeden M, Wynants L, Steyerberg EW. [Calibration: the Achilles heel of predictive analytics](https://doi.org/10.1186/s12916-019-1466-7). *BMC Medicine*. 2019;17:230.
- The library's [ROC curves and AUC article](roc-curves-and-auc.html) covers discrimination; [sensitivity, specificity and predictive values](sensitivity-specificity-and-predictive-values.html) explains threshold-specific test performance.
