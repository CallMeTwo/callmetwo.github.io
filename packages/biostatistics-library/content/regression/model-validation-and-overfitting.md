---
title: Model validation and overfitting
summary: How to test whether a prediction or risk model generalises beyond its development data, and how to detect and prevent overfitting.
---

## Overview and key ideas

A regression model fitted to a dataset will always fit that dataset well — and increasingly well the more predictors you add. *Overfitting* is the failure mode in which the model captures random noise specific to the sample, so its *apparent* performance (e.g. R², AUC) is much better than its performance on new patients. Validation is the set of techniques that estimate how the model will actually perform in new data, and shrinkage is what overfitting does to a model: its coefficient estimates tend to be too large in magnitude, and its calibration (predicted vs observed probabilities) tends to be worse than it looks internally.

The standard ladder of validation is: **optimism** (no validation — the model's own fit, always too optimistic), **internal validation** (bootstrap resampling or k-fold cross-validation on the same data), **temporal validation** (apply the model to patients followed later in the same cohort), and **external validation** (apply it to a genuinely independent dataset, ideally from a different site). For a model with k fitted coefficients, the classic shortcut for the expected overfitting of R² is the shrinkage estimate: adjusted R² ≈ 1 − (1 − R²)(n − 1)/(n − k − 1). With n = 150 and k = 15, a development R² of 0.30 shrinks to about 1 − (0.70)(149/134) ≈ 0.20 — one-fifth of the variance, not three-tenths.

## When to use it

| Setting | Example question |
| --- | --- |
| Risk score development | Does this 12-week readmission model still rank patients correctly at the next site? |
| Biomarker panel | Is the panel's AUC in 200 patients likely to survive replication? |
| Model comparison | Which of two scoring rules predicts outcome better in *new* patients? |
| Regulatory / guideline work | Does the published model's calibration hold in our hospital's population? |

Validation is required whenever a model is used for prediction (not just inference) — every clinical risk score, nomogram or ML model — and the more predictive claims are made, the more rigorous the validation must be: development-only performance is a minimum for an honest external test, not a promise of it.

## Assumptions and limitations

- **Sample size relative to complexity**: the events-per-variable (EPV) heuristic (≥ 10 outcome events per predictor, often ≥ 20 for reliable prediction) is a guard against overfitting, not a law; small samples with many predictors guarantee optimistic performance estimates.
- **Applicability**: external validation tests performance *in a new population*; if the new population differs substantially (different case mix, outcome prevalence, measurement methods), the model may be inapplicable rather than merely imperfect.
- **Bootstrap assumptions**: the .632+ bootstrap (Efron) and k-fold CV estimate optimism under the assumption that the new data come from the same population; they do not protect against population shift.
- **Stability of the data-generating process**: a model validated on 2010–2015 data may fail after a care pathway change in 2020; temporal validity can decay.
- **What is being validated**: discrimination (AUC, calibration slope) and calibration (intercept, slope) are distinct; a model can discriminate well while being miscalibrated, and vice versa.

## Worked example

A team builds a logistic model predicting 30-day readmission from 12 predictors in 900 patients (215 readmissions). The development AUC is 0.79 and R² (Hosmer–Lemeshow-type) looks excellent. A 10-fold cross-validation gives AUC 0.71 — an optimism of 0.08. The calibration slope from the bootstrap is 0.72, indicating coefficients are about 28% too large. The team shrinks the model (ridge penalty) and re-estimates: AUC 0.72, slope 0.85. Two independent hospitals then apply the shrunk model: AUC 0.69 and 0.71, calibration slope 0.90 and 0.94. The honest claim is "AUC about 0.7, reasonably well calibrated, externally validated in two sites" — not "AUC 0.79". Had the unshrunk model been deployed, its predicted probabilities would have been systematically too extreme: patients it labelled 25% risk would have observed risk closer to 19%.

## Interpretation and common pitfalls

- Reporting the development AUC or R² as if it were the expected real-world performance is the single most common error; always pair it with a cross-validated or externally validated estimate.
- A "non-significant" difference between two models' AUCs means the data cannot distinguish them — it does not prove they are equally good, and it is not a license to pick by convenience and report the winner's optimistic number.
- Good discrimination (AUC) does not mean the model is clinically useful: compare the model's predictions to a baseline using decision-curve analysis or net reclassification, and check calibration in the risk range where decisions are actually made.
- Adding predictors until the cross-validated metric stops improving is a defensible stopping rule; adding predictors until the *development* metric stops improving is how overfitted models are built.
- External validation with a small external sample has its own wide CIs; a single external AUC of 0.68 with n = 120 may be compatible with a true AUC of 0.62–0.74 — report the CI.

## References and further reading

- Vickers AJ, Elkin EB. "Decision curve analysis: a novel method for evaluating prediction models." *Med Decis Making* 2006.
- Fox J. *Applied Regression Analysis and Generalized Linear Models*. SAGE.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- *The companion article "Model assumptions and diagnostics" covers the checks that should precede validation (article planned).*
