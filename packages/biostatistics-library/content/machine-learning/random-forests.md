---
title: Random forests
summary: An ensemble of randomized decision trees for flexible prediction, with guidance on tuning, validation, and variable-importance limits.
---

## Overview and key ideas

A random forest fits many decision trees and combines their predictions. Each tree is trained on a bootstrap sample, and each split considers a random subset of predictors. This decorrelates trees; averaging regression predictions or voting/class-probability aggregation for classification often reduces the variance of an individual unstable tree. Observations omitted from a tree’s bootstrap sample are called out-of-bag (OOB) for that tree and can provide an internal error estimate.

Important tuning choices include the number of candidate predictors considered at each split, minimum leaf size, and whether trees are constrained. Increasing the number of trees usually stabilizes the ensemble but does not fix leakage, unrepresentative data, or poor target definitions.

## When to use it

Random forests are useful as a strong tabular-data baseline when relationships may be nonlinear and interactions are expected, such as predicting medication-related adverse events from demographics, diagnoses, and baseline laboratory results. They generally need less feature scaling than distance-based methods and can handle mixed predictor types depending on implementation.

## Assumptions and limitations

- A forest assumes the training observations represent the prediction setting. It cannot extrapolate reliably beyond ranges or populations it has seen.
- OOB error is an internal estimate under the training sampling scheme, not external validation. It can be invalid if records from the same patient or site leak across bootstrap units.
- Impurity-based importance can favor variables with many possible split points or categories; correlated predictors can divide or distort importance. Importance is not a causal effect.
- Averaging can smooth predictions and often improves ranking, but probability calibration may still be poor, particularly under class imbalance or prevalence shift.
- Large forests may be computationally expensive and less transparent than a single tree. “More accurate” should be demonstrated against a fair baseline using nested tuning and held-out evaluation.

## Worked example

Consider 1,000 patients, of whom 100 have a 30-day adverse drug event. A forest trained to predict event risk gives patient A a score of 0.30 and patient B 0.05. If a threshold of 0.20 flags patients, then among 100 held-out patients, suppose 20 are flagged and 8 experience the event. The positive predictive value is 8/20 = 40%; sensitivity cannot be inferred without knowing the total events in those 100 patients. The score 0.30 should not be called a 30% risk until calibration is checked. If the validation set had 10 events total, report the uncertainty around all these estimates.

## Interpretation and common pitfalls

- Use patient-grouped or temporal folds when observations repeat. Randomly splitting rows from the same person can inflate apparent accuracy.
- Tune parameters inside cross-validation and reserve a final evaluation set. Repeatedly adjusting the forest based on OOB or test results creates optimism.
- Report discrimination, calibration, confidence intervals, subgroup performance, and the threshold’s consequences. AUC alone does not measure clinical utility.
- Permutation importance measures dependence of prediction on a feature under a specific dataset and can be misleading with correlated predictors; it does not reveal what would happen under an intervention.
- Check missingness handling, coding artifacts, and proxies for site or access. A forest can exploit a timestamp or device indicator that will not transport.

## References and further reading

- Breiman L. Random forests. *Machine Learning*. 2001;45:5–32. [doi:10.1023/A:1010933404324](https://doi.org/10.1023/A:1010933404324)
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378)
