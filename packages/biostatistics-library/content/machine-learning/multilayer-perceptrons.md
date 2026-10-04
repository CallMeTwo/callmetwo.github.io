---
title: Multilayer perceptrons
summary: How feedforward neural networks model fixed-size clinical feature vectors, with practical notes on scaling, regularization, and calibration.
---

## Overview and key ideas

A multilayer perceptron (MLP) is a feedforward network for fixed-size input vectors. Each dense layer computes weighted combinations of all units in the preceding layer, applies a nonlinear activation, and produces a new representation. For binary outcomes, a final sigmoid output can represent a predicted probability; multiclass outcomes commonly use a softmax. Training minimizes a loss such as cross-entropy, usually with stochastic gradient descent or a related optimizer.

The network’s depth and width determine flexibility. Regularization methods include weight decay, dropout, and early stopping. These reduce overfitting in some settings but do not replace sound validation.

## When to use it

An MLP may be considered for a reasonably sized fixed feature table when nonlinear combinations are expected, or when it is one component of a larger system combining structured data with learned representations. For ordinary clinical tabular data, compare it with regularized logistic regression and boosted trees; MLP superiority should be demonstrated, not assumed.

## Assumptions and limitations

- Numeric features typically need scaling; categorical variables need a deliberate encoding. Fit scaling, category handling, and imputation inside each training fold.
- Dense layers do not encode temporal or spatial structure. A vector of sequential measurements fed to an MLP may discard order unless order is explicitly represented.
- MLPs can require substantial data and tuning. A flexible network may overfit when patient count or event count is modest.
- Output probabilities may be miscalibrated, especially after class weighting or oversampling. Evaluate and, if justified, recalibrate on data representing the target population.
- Feature attribution can be unstable with correlated inputs, and learned associations are not causal effects.

## Worked example

Suppose a model predicts 30-day mortality from 20 baseline variables in 4,000 patients, with 200 deaths. An MLP is trained with patient-level nested cross-validation, with scaling and imputation refit inside every training fold. On a held-out temporal cohort, it yields AUC 0.76. Calibration-in-the-large shows average predicted risk of 6.8%, while observed mortality is 5.0%, so average risk is overpredicted by 1.8 percentage points in that sample. AUC describes ranking, not this probability error. Recalibration may correct average risk, but the team should also inspect calibration slope and subgroup performance and then evaluate changes in a new cohort.

## Interpretation and common pitfalls

- Do not treat the number of training records as the number of independent examples when patients contribute repeated rows.
- Tune architecture, learning rate, regularization, and stopping rules without touching the final evaluation set.
- Compare with simpler models on the same data splits; report uncertainty rather than only the best random seed.
- Inspect calibration and decision thresholds; a high AUC does not imply useful absolute risks.
- Avoid translating input attribution into a claim that altering that predictor changes risk.

## References and further reading

- LeCun Y, Bengio Y, Hinton G. Deep learning. *Nature*. 2015;521:436–444. [doi:10.1038/nature14539](https://doi.org/10.1038/nature14539)
- Van Calster B, McLernon DJ, van Smeden M, Wynants L, Steyerberg EW. Calibration: the Achilles heel of predictive analytics. *BMC Medicine*. 2019;17:230. [doi:10.1186/s12916-019-1466-7](https://doi.org/10.1186/s12916-019-1466-7)
