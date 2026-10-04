---
title: Clinical event prediction
summary: Develop and evaluate models that estimate an individual's probability of a diagnostic or future clinical event for a defined population and time horizon.
---

## Overview and key ideas

A **clinical prediction model** combines patient characteristics, symptoms, tests or other predictors to estimate an outcome for an individual. A diagnostic model estimates whether a condition is currently present; a prognostic model estimates a future event. Prognostic predictions need a clearly stated **time horizon**: for example, 30-day readmission, 5-year cardiovascular risk, or time to relapse.

Prediction is not the same as explaining causes. A predictor can improve forecasts without being causal, and a causal risk factor need not improve useful prediction. Individual risk prediction also differs from aggregate event surveillance, which asks whether an event rate or process has changed over time.

Good prediction requires more than a high area under the ROC curve. **Discrimination** describes how well predictions rank people with and without the event. **Calibration** compares predicted probabilities with observed event frequency. Clinical usefulness additionally depends on decisions, consequences and thresholds.

## When to use it

Use a model when it will support a defined decision at a defined point in care, such as offering confirmatory testing, prioritizing follow-up, or discussing preventive treatment. Specify the target population, setting, predictors available at decision time, outcome definition, prediction horizon, and intended action before fitting a model.

## Assumptions and limitations

- **Outcome and horizon:** a model for a 1-year event is not automatically valid for 5-year risk. For survival outcomes, account for censoring; for competing risks (for example, non-cardiovascular death before cardiovascular disease), estimate the cumulative incidence of the target event rather than treating competing events as ordinary loss to follow-up.
- **Predictor timing and leakage:** use only information available when the prediction is made. Post-outcome variables or information recorded after the decision create leakage and implausibly optimistic performance.
- **Overfitting:** too many candidate predictors, univariable screening, stepwise selection and small event counts can exaggerate performance. Use prespecified modeling, shrinkage or penalization and internal validation, commonly bootstrap or cross-validation that repeats the full modeling process.
- **Validation:** internal validation estimates optimism in the development data; it does not establish transportability. External validation in other times, places or settings should assess calibration and discrimination. Updating may be needed when case mix or baseline event rates change.
- **Calibration matters:** a model can rank patients well but systematically overpredict or underpredict absolute risk. Calibration-in-the-large, calibration slope and plots across clinically relevant risk ranges are useful complements to discrimination.
- **Class imbalance and missing data:** accuracy can look high when events are rare. State how missing predictors were handled and evaluate performance at the intended prevalence and setting.
- **Decision thresholds:** thresholds depend on benefits and harms of action and patient preferences. A probability cutoff is not universally optimal. Decision-curve analysis can compare net benefit with treat-all and treat-none strategies across plausible thresholds, but relies on a decision context and does not replace impact evaluation.
- **Fairness and implementation:** performance can differ across subgroups; assess calibration and errors in relevant groups, data quality, access, and consequences. A validated model may still fail when workflow or treatment changes.

## Worked example: 30-day readmission risk

A hospital wants to identify adults discharged after heart-failure admission who may benefit from a follow-up call within 48 hours. Define the prediction time as discharge, predictors as information available by discharge, and outcome as unplanned readmission within 30 days. If death before readmission is common, decide whether the target is readmission before death (competing-risk cumulative incidence) or a composite of readmission or death; these are different outcomes.

Suppose an internally validated model has a c-statistic of 0.72. This means a randomly selected patient who is readmitted tends to receive a higher score than one who is not, about 72% of comparable pairs (with usual handling of ties). It does not mean that 72% of predicted probabilities are correct. On external validation, predicted risk averages 18% but observed risk is 12%, showing overprediction; the model needs recalibration or redevelopment before threshold-based deployment.

If a 20% threshold triggers a care-management call, decision-curve analysis can estimate net benefit across thresholds and compare the model with calling everyone or no one. At a 20% threshold, the implied harm-to-benefit trade-off is encoded in the threshold itself; the clinical team should verify that this trade-off is acceptable. Finally, evaluate whether using the model actually changes care and patient outcomes in the intended workflow.

## Interpretation and common pitfalls

- Report absolute risks with horizon, not just a score or rank. A “high-risk” label without a stated outcome and time window is ambiguous.
- Do not report only AUC/c-statistic. Include calibration and uncertainty; use clinically meaningful risk groups only when justified.
- A random train/test split wastes data in small samples and can still yield unstable performance. Bootstrap or cross-validation with all preprocessing and selection nested inside validation is generally more efficient for internal validation.
- Do not choose a cutoff by maximizing sensitivity plus specificity unless that trade-off matches the actual decision consequences.
- External validation should use a separate, relevant population and a prespecified evaluation plan. If recalibration is performed, report validation before and after updating distinctly.
- Association, performance and clinical impact are separate: an accurate risk estimate does not prove that acting on it improves health.

## References and further reading

- Collins GS, Reitsma JB, Altman DG, Moons KGM. Transparent reporting of a multivariable prediction model for individual prognosis or diagnosis (TRIPOD): the TRIPOD statement. *BMJ*. 2015;350:g7594. [doi:10.1136/bmj.g7594](https://doi.org/10.1136/bmj.g7594).
- Moons KGM, Wolff RF, Riley RD, et al. PROBAST: a tool to assess risk of bias and applicability of prediction model studies. *Ann Intern Med*. 2019;170:51–58. [doi:10.7326/M18-1376](https://doi.org/10.7326/M18-1376).
- Vickers AJ, Elkin EB. Decision curve analysis: a novel method for evaluating prediction models. *Med Decis Making*. 2006;26:565–574. [doi:10.1177/0272989X06295361](https://doi.org/10.1177/0272989X06295361).
- Steyerberg EW. *Clinical Prediction Models*. 2nd ed. Springer; 2019. [doi:10.1007/978-3-030-16399-0](https://doi.org/10.1007/978-3-030-16399-0).
- Gerds TA, Andersen PK, Kattan MW. Calibration plots for risk prediction models in the presence of competing risks. *Stat Med*. 2014;33:3191–3203. [doi:10.1002/sim.6152](https://doi.org/10.1002/sim.6152).

*For prediction model reporting and machine-learning risk-of-bias assessment, see the official [TRIPOD statement](https://www.tripod-statement.org/) and [PROBAST resources](https://www.probast.org/).*
