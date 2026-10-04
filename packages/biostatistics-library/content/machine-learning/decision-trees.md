---
title: Decision trees
summary: How tree models split patient data into interpretable prediction rules, and how to control their instability and overfitting.
---

## Overview and key ideas

A decision tree repeatedly partitions observations using predictor thresholds. For example, it might first split on oxygen saturation below 90%, then split the lower-risk branch by age. Each terminal **leaf** holds a prediction: a class, an estimated probability, or a mean outcome. Classification trees often choose splits that reduce impurity (such as Gini impurity or entropy); regression trees reduce within-node squared error. A tree is attractive because its path can be read as a sequence of rules, but a large tree can be as hard to understand as a model with many parameters.

Tree growth is greedy: at each step the algorithm selects a locally favorable split, not necessarily the globally best tree. Complexity is controlled by limits on depth or leaf size and by pruning. A split that improves training fit may merely capture random variation, so pruning or tuning must use resampling confined to the training data.

## When to use it

Use a tree when nonlinear thresholds and interactions are plausible, when a compact rule set is useful, or as a baseline for ensemble methods. A clinical illustration is predicting which post-operative patients need intensified observation from early vital signs and comorbidities. The fitted rule is a predictive summary, not a treatment protocol until prospectively assessed.

## Assumptions and limitations

- Trees do not require linear relationships or normally distributed residuals, but they still require representative, accurately measured data and an appropriate target definition.
- Small changes in patients or measurements can lead to different early splits. A single tree is often unstable; report uncertainty and consider bootstrap stability checks.
- Standard trees make axis-aligned splits and can approximate smooth relationships inefficiently. They may create abrupt, unrealistic risk jumps at cutpoints.
- Missing values and category handling vary by implementation. Specify these procedures; do not silently impute using the full dataset.
- Class imbalance can make accuracy misleading. Choose an objective and evaluation measures suited to the clinical consequence.

## Worked example

In a training cohort of 100 post-operative patients, 20 experience a complication. A candidate split on oxygen saturation creates a low-saturation node of 25 patients with 12 complications and a higher-saturation node of 75 patients with 8. The observed complication proportions are 12/25 = 48% and 8/75 ≈ 10.7%, respectively. The split appears clinically meaningful, but these rates are noisy estimates and the threshold was selected from many candidates. Pruning and patient-level cross-validation estimate whether the rule generalizes. If the risk in the low-saturation leaf is later reported as 48%, external calibration must verify that probability; the training proportion is not automatically a calibrated risk.

## Interpretation and common pitfalls

- Show the full tree or a faithful simplified representation, including sample counts and event counts at leaves. A diagram without support counts can overstate certainty.
- Do not report selected split points as validated biological thresholds. They are data-dependent and may move in new cohorts.
- A tree path supports a prediction, not causal reasoning: “low saturation predicts complications” does not show that changing saturation itself prevents them.
- Compare a single tree with a simple regression and, where appropriate, ensembles. A more complex model may improve prediction but reduce transparency.
- Evaluate calibration and decision consequences at the intended threshold; accuracy alone does not define clinical usefulness.

## References and further reading

- Breiman L, Friedman JH, Olshen RA, Stone CJ. *Classification and Regression Trees*. Chapman & Hall/CRC; 1984. [doi:10.1201/9781315139470](https://doi.org/10.1201/9781315139470)
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378)
