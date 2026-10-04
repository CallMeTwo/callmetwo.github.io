---
title: Introduction to machine learning for health data
summary: A practical introduction to supervised and unsupervised learning, evaluation, leakage, and responsible use in biomedical research.
---

## Overview and key ideas

Machine learning (ML) describes algorithms that use data to estimate patterns or make predictions. In **supervised learning**, examples have a known outcome: a model may estimate 30-day readmission from information available at discharge. In **unsupervised learning**, outcomes are not supplied; methods summarize structure, such as grouping patients by measured profiles. These goals differ from causal inference. A model that predicts who receives a treatment or has an outcome does not, by itself, estimate what would happen if treatment were changed.

A useful workflow is: define the intended population, time point, outcome, and action; assemble a cohort that represents that use; split data at the correct unit; fit and tune within development data; evaluate once on held-out or external data; then assess calibration, subgroup performance, and consequences of use. The model is only one part of a prediction system, which also includes data collection, workflow, thresholds, and monitoring.

For a binary outcome, a model may output a probability (e.g., 0.18 risk of deterioration). A threshold turns that probability into a decision, but the right threshold depends on the costs of false alarms and missed cases. Ranking metrics such as area under the ROC curve (AUC) do not tell us whether probabilities are accurate or whether acting on them helps patients.

## When to use it

ML can be useful when the goal is prediction or pattern discovery, the data contain information relevant to that goal, and the proposed use can be evaluated. Examples include predicting deterioration from vital-sign histories, classifying pathology images, or exploring whether laboratory profiles contain reproducible subgroups. Begin with a clinical question and a simple baseline (such as a prevalence estimate or regression model); use a more complex method only if it adds reliable value.

## Assumptions and limitations

- **Representative data:** the development sample and deployment population must have sufficiently similar relationships between predictors and outcome. Changes in coding, referral, prevalence, or care can degrade performance.
- **No information leakage:** every predictor must be available at the stated prediction time. Data cleaning, imputation, scaling, feature selection, and tuning must be learned using training folds only. Repeated admissions from one patient should generally remain in one partition; random row splitting can place nearly identical records on both sides.
- **Adequate outcome information:** effective sample size depends on outcome events, predictor complexity, clustering, and missingness, not just total rows. High-dimensional data need stronger regularization and broader validation.
- **Measurement and selection:** labels may be noisy or reflect unequal access to care. A model can reproduce historical disparities even when sensitive attributes are removed.
- **Prediction is not intervention evidence:** predictive associations can be confounded, and treatment decisions can change the outcome being predicted.

## Worked example

Suppose 2,000 adult admissions are used to predict unplanned ICU transfer within 24 hours after ward arrival. The target time is arrival; predictors include age, initial vital signs, and laboratory results available by then. There are 160 transfers (8%). A useful baseline that predicts 8% for everyone has no discrimination but gives a reference Brier score of 0.08 × 0.92² + 0.92 × 0.08² = 0.0737. The team compares regularized logistic regression and a tree ensemble using patient-level, temporal cross-validation. If a model has AUC 0.78, that means a randomly selected case tends to receive a higher score than a randomly selected non-case; it does not mean 78% of patients are correctly classified. The team also checks calibration, sensitivity and positive predictive value at a clinically selected alert threshold, subgroup errors, and alert burden. A later hospital cohort is reserved for external evaluation.

## Interpretation and common pitfalls

- Specify the prediction horizon and information cutoff. “Predict mortality” is incomplete without when predictions are made and over what period.
- Keep a final test set untouched until choices are finished. Repeatedly inspecting its performance makes it part of model development.
- Compare with a meaningful baseline, report uncertainty, and evaluate calibration as well as discrimination. See [model validation and overfitting](../regression/model-validation-and-overfitting.html).
- Audit errors and performance across clinically relevant groups. Aggregate performance can hide poor performance in a smaller subgroup.
- A feature-importance score describes how a fitted model uses data under a particular procedure; it is not a causal effect or proof of biological mechanism.
- Monitor performance after implementation, with governance for updates, human oversight, and a route to investigate harms.

## References and further reading

- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement: updated guidance for reporting clinical prediction models that use regression or machine learning methods. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378)
- Van Calster B, McLernon DJ, van Smeden M, Wynants L, Steyerberg EW. Calibration: the Achilles heel of predictive analytics. *BMC Medicine*. 2019;17:230. [doi:10.1186/s12916-019-1466-7](https://doi.org/10.1186/s12916-019-1466-7)
- Obermeyer Z, Powers B, Vogeli C, Mullainathan S. Dissecting racial bias in an algorithm used to manage the health of populations. *Science*. 2019;366:447–453. [doi:10.1126/science.aax2342](https://doi.org/10.1126/science.aax2342)
