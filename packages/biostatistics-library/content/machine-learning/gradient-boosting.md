---
title: Gradient boosting
summary: How boosted trees build predictions sequentially, how regularization controls complexity, and how to validate clinical use.
---

## Overview and key ideas

Gradient boosting builds an additive model in stages. Each new weak learner, commonly a shallow decision tree, is fitted to improve the current model’s loss. For squared-error regression this resembles fitting residuals; more generally, the algorithm follows the negative gradient of a chosen loss function. The learning rate shrinks each step, while the number and depth of trees set model complexity. Implementations such as XGBoost, LightGBM, and CatBoost add engineering and regularization choices, but the core idea is sequential correction of current errors.

Unlike a random forest, where trees are grown largely independently and averaged, boosting trees depend on earlier trees. It can capture complex interactions in tabular data, but tuning is consequential and overfit is possible.

## When to use it

Consider gradient-boosted trees for tabular prediction such as estimating 30-day readmission from demographics, diagnoses, medication history, and laboratory values. Compare against regularized regression and random forests using the same partitions and tuning budget. If the goal is an interpretable treatment effect, use a design and causal method appropriate to that estimand instead.

## Assumptions and limitations

- The loss function should match the task. Classification log-loss produces probabilities, while ranking-oriented objectives may not yield calibrated probabilities.
- Learning rate, tree depth, number of trees, subsampling, and regularization interact. Early stopping requires a tuning set and must not use final test outcomes.
- Boosting can exploit missingness or coding patterns that encode local workflow rather than stable clinical signal.
- Feature importance and SHAP-style explanations describe model behavior, with dependence on the data and explanation method; they do not establish causality.
- Class imbalance may require thoughtful weighting or threshold selection. Any rebalancing must occur inside training folds and probabilities may need recalibration to the deployment prevalence.

## Worked example

Suppose there are 500 readmissions among 5,000 discharges (10%). A model outputs risks for 200 held-out patients; 20 have a predicted risk above 0.25, and 9 of those are readmitted. The threshold group’s observed proportion is 9/20 = 45%. This says the threshold selected a higher-risk subgroup in this sample; it does not show the model’s overall sensitivity or calibration. If those same 20 are 10% of the sample, report the alert rate as 10%; then give the count of all readmissions captured and calibration across the full risk range. A high-performing tuned model is credible only if every tuning step was contained in the development resampling and performance persists in later or external data.

## Interpretation and common pitfalls

- Use nested cross-validation or a dedicated tuning set for hyperparameter selection, then evaluate once on data not used for any choices.
- Assess calibration-in-the-large and calibration slope in addition to AUC or precision-recall measures. Recalibration may be needed at a new site.
- Do not compare one heavily tuned boosted model with a default baseline and attribute the difference solely to algorithm family.
- Avoid claiming that the top ranked variables cause the outcome. Important predictors may be proxies, consequences of disease, or artifacts of care processes.
- Describe the complete pipeline and intended population. For reporting, consult [model validation and overfitting](../regression/model-validation-and-overfitting.html).

## References and further reading

- Friedman JH. Greedy function approximation: a gradient boosting machine. *Annals of Statistics*. 2001;29:1189–1232. [doi:10.1214/aos/1013203451](https://doi.org/10.1214/aos/1013203451)
- Chen T, Guestrin C. XGBoost: a scalable tree boosting system. *Proceedings of KDD*. 2016. [doi:10.1145/2939672.2939785](https://doi.org/10.1145/2939672.2939785)
