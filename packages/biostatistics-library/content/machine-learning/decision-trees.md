---
title: Decision trees
summary: How tree models split patient data into interpretable prediction rules, and how to control their instability and overfitting.
---

## Overview

A decision tree predicts by dividing observations into increasingly specific regions and assigning each region a value. A clinical tree might first separate patients by oxygen saturation, then distinguish patients in one branch by age or comorbidity. The resulting path is easy to inspect, but each selected threshold is data-dependent and can change when the development sample changes. A tree is a prediction rule, not a causal diagram or a clinical protocol.

Classification trees predict a category or probability; regression trees predict a numeric outcome. At each node, the algorithm searches candidate splits and chooses one that improves a criterion, such as reduction in Gini impurity or squared error. This greedy process is computationally convenient but does not guarantee the globally best tree. Unrestricted growth can produce terminal nodes that memorize training data, so complexity control and independent validation are central.

## What a split optimizes

For binary classification, a node with event probability p has Gini impurity 2p(1−p), which is zero when all observations have the same class and largest at p=0.5. Entropy, −p log(p)−(1−p)log(1−p), is another measure. A candidate split is scored by the weighted impurity of its child nodes; the best split maximizes parent impurity minus child impurity. Regression trees generally select splits that reduce within-node squared error or another chosen loss.

Consider a parent node with 40 patients and 12 events, so p=.30 and Gini=.42. A candidate split produces a group of 20 with 10 events and another of 20 with 2. The child impurities are .50 and .18; their weighted average is .34, so the decrease is .08. This is an apparent training improvement. Because the algorithm searches many predictors and cutpoints, the best observed decrease is optimistic even when no real subgroup structure exists.

Tree construction is greedy and axis-aligned. A single split uses one variable at a time, so a diagonal decision boundary may require many branches. The tree handles nonlinearities and interactions without explicit terms, but can approximate smooth relationships with abrupt jumps. These jumps may be useful for a compact rule, or may be artifacts of finite data.

## Complexity, pruning, and probability estimates

Complexity can be constrained by maximum depth, minimum node size, minimum leaf size, or a minimum improvement requirement. Cost-complexity pruning balances training loss against number of terminal nodes: R(T)+α|T|, where α penalizes tree size. As α increases, branches are removed. Select complexity using resampling confined to training data, then evaluate the chosen procedure on untouched data.

Terminal-node probabilities are often event proportions among training observations assigned to that leaf. Small leaves yield noisy and sometimes extreme probabilities. If a leaf contains 20 patients and 4 events, its estimated risk is 20%; a rough binomial standard error is sqrt(.2*.8/20)=.089. A normal interval would be very wide; Wilson or exact intervals are preferable near boundaries. The estimate also ignores that the leaf itself was selected after searching the data.

A large tree may have excellent training performance and poor generalization. Pruning can improve prediction and readability, but a small tree is not automatically stable. Bootstrap the complete modeling procedure to assess how often splits recur and how patient assignments change. If the first split varies substantially, present the tree as one useful representation rather than a definitive set of clinical thresholds.

## A worked risk partition

Imagine a development cohort of 100 postoperative patients, 20 with a complication. A candidate split on oxygen saturation creates a node of 25 patients with 12 events and another of 75 with 8 events. Observed proportions are 48% and 10.7%. The large separation may suggest a useful risk partition, but many candidate variables and thresholds were examined. Its apparent performance is optimistic until pruning and validation are applied.

```r
library(rpart)
fit <- rpart(event ~ age + oxygen_saturation + comorbidity,
             data = train, method = "class",
             control = rpart.control(cp = .002, minbucket = 15,
                                     maxdepth = 3, xval = 10))
printcp(fit)
cp_opt <- fit$cptable[which.min(fit$cptable[, "xerror"]), "CP"]
small_tree <- prune(fit, cp = cp_opt)
p <- predict(small_tree, newdata = test, type = "prob")[, "1"]
```

Check that `event` is a factor with the intended positive level. The built-in cross-validation partitions rows randomly; it is inappropriate when the same patient contributes repeated records or when future-time performance is the target. Use patient-grouped or temporal resampling in those settings. Keep imputation and any feature selection inside the resampling pipeline.

If the pruned tree assigns 0.48 risk to a leaf, that is an empirical training proportion, not automatically a calibrated prediction. Evaluate calibration and uncertainty on independent data. A threshold of 0.20 could prompt enhanced observation, but the threshold should reflect the benefit and burden of that action. Compare net benefit and alert volume with current practice, treat-all, and treat-none strategies.

## Interpreting branches as predictive rules

A path such as “oxygen saturation below 91%, then age above 70” describes how the fitted model partitions the data. It does not show that oxygen saturation below 91% causes complications or that raising saturation above the threshold prevents them. Predictor importance and split order depend on the sample, available variables, and algorithm. Correlated predictors can substitute for one another, changing the displayed rule while leaving predictions similar.

Tree plots should show terminal-node counts and events, class probabilities, and the units and definitions of split variables. Report whether cutpoints were prespecified or learned. Avoid turning a threshold selected for prediction into a diagnostic cutoff or care guideline without separate clinical validation. A simplified diagram must faithfully preserve the model’s logic; rounding a boundary can change classifications.

Missing values are handled differently across implementations. Some methods use surrogate splits; others impute or route missing observations by default. Explain the procedure and make sure it can be reproduced at deployment. Missingness can reflect workflow and access, so a branch on missingness may fail after an EHR change. Test performance when predictors are absent and provide a safe fallback or abstention rule.

## Validation design for the intended setting

A random train/test split is only credible if its unit and time structure match use. For new-patient prediction, group all records from each patient. For new hospitals, hold out sites. For future use at the same institution, train on earlier time and test on later time. If the tree is tuned over depth, leaf size, or pruning, select those settings in inner resampling and estimate performance in outer folds or a final independent cohort.

Report discrimination, calibration, and threshold-specific consequences. AUC describes ranking and cannot show that a 20% prediction means 20% risk. Calibration plots and intercept/slope matter; probability leaves often need recalibration, but recalibration should use representative data and a frozen model. For rare events, show precision-recall or positive predictive value with prevalence and event counts. Provide uncertainty intervals using a resampling unit that respects patients or sites.

Subgroup checks should be prespecified and interpreted with sample sizes. A tree may route a smaller group to leaves with very few outcomes. An apparently different subgroup error rate can be random noise or reflect measurement and access differences. Do not respond to each fluctuation with more branches; seek external evidence and assess whether the decision consequences differ.

## When a tree helps, and when it does not

A shallow tree can be useful when a small set of nonlinear rules is valuable for communication, exploratory stratification, or workflow design. It may serve as a baseline for ensembles. Compare it with a simple regression and current clinical practice. If performance is similar, the transparent tree may be attractive; if the cutpoints are unstable or calibration poor, a tree may be a weak risk calculator despite easy visualization.

Tree models can struggle when a relationship is smooth, predictors are highly correlated, data are sparse, or accurate extrapolation is needed. They create discontinuous predictions and can be unstable under small data changes. Ensembles such as random forests often reduce variance but give up the single compact path. Model choice should balance accuracy, calibration, stability, interpretability, and the real action supported.

For causal questions, a prediction tree is not a substitute for a causal design. Treatment effects may differ across subgroups, but searching for “responders” with a standard outcome-prediction tree can confuse prognostic risk with treatment-effect heterogeneity. Use methods designed for causal effect modification, prespecify hypotheses, and validate subgroup effects independently.

## Reporting and deployment

Describe the software and version, split criterion, candidate variables, missing-data behavior, complexity controls, pruning rule, and validation design. Report sample and event counts in terminal nodes, the full tree or accessible model, and uncertainty. Include the prediction time, horizon, intended population, threshold, and action. Share code and a data dictionary where governance allows.

Before release, define handling of out-of-range values, missing predictors, and unrepresented patients. Monitor leaf occupancy, event rates, calibration, alerts, and downstream outcomes. A change in coding or measurement may move many patients across a threshold. Revalidate after workflow, population, or outcome-definition changes. Maintain version history and a route to suspend the rule if harms or performance failures emerge.

## Selection instability and uncertainty in the rule

The tree search considers many candidate predictors and cutpoints, so a winning split can capitalize on random variation. This selection affects both performance and interpretation. Ordinary standard errors for a coefficient do not apply to a selected threshold. A bootstrap that resamples patients and repeats imputation, tuning, and pruning can show how often each split appears, how deep the tree becomes, and how often a patient changes leaf. If the selected oxygen threshold ranges from 88% to 96% across resamples, reporting 91% as a validated boundary is unwarranted.

Instability has more than one meaning. Predictions may be reasonably stable even when individual tree structures differ because correlated predictors substitute for each other. Conversely, the same early split can appear repeatedly while risk estimates in small leaves remain highly uncertain. Assess both predictive stability and structural stability, and clarify which matters to the use case. If communication is the goal, stable rules may matter; if only calibrated risk is needed, an ensemble may be preferable.

When bootstrapping, sample at the independent unit. For clustered observations, resample clinics or use a design-respecting procedure. For temporal deployment, resampling rows does not represent future drift; use temporal validation. The final model is usually refit on all development data after complexity choices are locked, but external performance estimates should come from untouched observations or a valid optimism-correction procedure.

## Missing data, class imbalance, and alternate outcomes

Surrogate splits route an observation with a missing primary split variable using another predictor that mimics the original split. This preserves cases but makes the displayed path incomplete. Imputation may be more transparent when fitted inside resampling and available at deployment. Either approach can exploit patterns of missingness that change across sites. Report missingness by predictor and group, and test the model under plausible missing-data scenarios.

For rare outcomes, impurity criteria can favor majority-class predictions and produce poor sensitivity. Class weights or balanced sampling may improve discrimination for the minority outcome, but probability estimates after rebalancing may no longer match real prevalence. Recalibrate in representative data and evaluate positive predictive value at the actual use prevalence. Report event counts in leaves; a leaf with 15 patients and one event cannot support a stable 7% risk estimate.

Outcome definition also changes the tree. A binary event by 30 days requires adequate follow-up; censoring before 30 days cannot simply be labeled no event. Consider survival trees or a clearly defined horizon with methods for incomplete follow-up. Competing events matter: death may prevent a readmission, so “readmission among survivors” differs from cumulative incidence of readmission before death. State the estimand and use a method that matches it.

## Practical pruning and tuning example

A practical development plan prespecifies a modest grid of maximum depth, minimum node size, and complexity parameter. Within each training fold, fit candidate trees, choose complexity using a metric tied to use (for example, log loss plus a constraint on alert burden), and evaluate the selected procedure in an outer fold. Do not choose pruning complexity by looking at the final test set. A single internal cross-validation estimate from the same data used to select the best complexity is likely optimistic when many settings are compared.

In `rpart`, the complexity parameter table reports cross-validated relative error for candidate subtrees. The minimum-error choice and the one-standard-error choice give different complexity trade-offs. The latter often favors a smaller tree whose error is within one estimated standard error of the minimum; this is a heuristic, not a guarantee of optimal transport. The exact criterion should be declared, and grouped or temporal resampling may require a custom workflow rather than `xval`.

```r
cp_tab <- fit$cptable
i_min <- which.min(cp_tab[, "xerror"])
cp_min <- cp_tab[i_min, "CP"]
# illustrative one-standard-error rule
limit <- cp_tab[i_min, "xerror"] + cp_tab[i_min, "xstd"]
i_1se <- max(which(cp_tab[, "xerror"] <= limit))
cp_1se <- cp_tab[i_1se, "CP"]
pruned_1se <- prune(fit, cp = cp_1se)
```

This code assumes the built-in cross-validation is appropriate and the table is ordered along the pruning sequence. In repeated-patient or time-based data, create folds explicitly and compare candidate trees in those folds. Select the complexity rule before evaluating a held-out cohort.

## Probability calibration and a decision rule

A terminal leaf returns a constant score, creating stepwise calibration. Large leaves smooth estimates but may hide real heterogeneity; small leaves represent heterogeneity with high variance. A probability tree should be assessed with calibration plots and proper scoring rules on independent data. If recalibration is needed, do it with a separate representative dataset and document that the final predictor includes the recalibration step.

Choose action thresholds from consequences. If enhanced observation costs staff time but is relatively safe, a lower threshold may be reasonable than for an invasive intervention. A decision curve can compare net benefit across plausible thresholds, but its assumptions about treatment benefit and harm should be discussed. Report numbers flagged, events captured, false alarms, and resource needs. A threshold selected to maximize sensitivity plus specificity is not necessarily clinically appropriate.

If the model creates a short checklist, test the translated rule against the software model on a broad set of edge cases: exact cutpoints, missing values, units, and out-of-range readings. Rounding 90.5 to 91 can alter routing. Preserve versioned code and provide a clear fallback for observations that do not meet development-data assumptions.

### Communicating uncertainty to clinicians

A tree diagram can make a model seem more certain than its evidence warrants because every branch appears deliberate. Annotate terminal nodes with denominator, event count, and confidence interval or equivalent uncertainty summary. Explain that uncertainty includes more than the binomial variation within a leaf because split selection and model tuning were data-adaptive. Avoid describing a branch as a disease mechanism or recommending treatment solely from its observed risk.

Discuss what happens to a patient near a cutpoint. Two patients with nearly identical oxygen saturation can receive different predictions because of measurement rounding, while patients far apart within a leaf get the same estimate. Sensitivity analysis to measurement error and repeat readings can reveal whether the decision is robust. When threshold crossing is clinically consequential, use a confirmation process or a smoother model rather than presenting the split as a natural boundary.

## Equity and ongoing review

Check whether measurement quality, leaf support, calibration, and error rates differ across groups defined by age, sex, ethnicity, language, or site when those comparisons are clinically and ethically appropriate. Small subgroups yield uncertain estimates, so display denominators and avoid ranking groups from noisy percentages. A split on access or documentation may reproduce inequities embedded in care records. Review the action triggered by each branch with clinicians and affected patients, and monitor downstream consequences after deployment. Reassess the tree when outcome prevalence, workflow, predictor definitions, or treatment options change.

For each subgroup review, distinguish differences in predicted risk from differences in model error and in the consequences of acting. Equal sensitivity does not guarantee equal benefit if access to follow-up differs. Engage data stewards and clinical teams to investigate whether apparent disparities arise from measurement, selection, or true risk variation before changing a branch or threshold. Document changes and validate the revised rule in data not used to make them.

Retain the original development cohort definition, code, fitted object, and any post-fit transformations. A text transcription of the tree can drift from implementation, especially when missing values or factor contrasts are involved. Version-control both and include checks that compare rule-based outputs with software predictions.

### Small changes near a split

Report measurement precision for predictors that define important branches. If routine measurement error can move a patient across a threshold, evaluate routing stability and avoid treating a fitted cutpoint as a sharp physiological boundary.

## References and further reading

- Breiman L, Friedman JH, Olshen RA, Stone CJ. *Classification and Regression Trees*. Chapman & Hall/CRC; 1984. [doi:10.1201/9781315139470](https://doi.org/10.1201/9781315139470).
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378).
- Moons KGM, Damen JAA, Kaul T, et al. PROBAST+AI. *BMJ*. 2025;388:e082505. [doi:10.1136/bmj-2024-082505](https://doi.org/10.1136/bmj-2024-082505).
