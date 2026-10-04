---
title: Random forests
summary: An ensemble of randomized decision trees for flexible prediction, with guidance on tuning, validation, and variable-importance limits.
---

## Overview

A random forest combines predictions from many decision trees fitted to randomized versions of the training data. For each tree, bootstrap sampling selects observations and random feature subsets restrict candidate splits. Regression predictions are averaged; classification predictions are aggregated to produce class scores or probabilities. The randomization lowers correlation among trees, so averaging can reduce the variance of an unstable single tree.

Forests are often effective for tabular data with nonlinearities and interactions. They require less feature scaling than distance-based methods and can accommodate mixed predictors, depending on implementation. Their flexibility does not guarantee calibrated probabilities, transportability, or clinical benefit. A forest is a prediction procedure, not a causal model: a feature that predicts an adverse event is not thereby a cause of that event.

## Why bagging and feature sampling help

A single tree may change substantially when a few observations are added or removed. Bootstrap aggregation, or bagging, fits trees to samples drawn with replacement from the development set. At each split, only a random subset of predictors is considered. These mechanisms aim to create useful but less correlated trees.

If each of B trees has prediction variance σ² and pairwise correlation ρ, the variance of the averaged prediction is approximately σ²[ρ+(1−ρ)/B]. As B grows, the second component shrinks, but the correlated component remains. Increasing the number of trees reduces Monte Carlo noise; it does not remove bias, leakage, confounding, or distribution shift.

The number of candidate features per split, often called mtry, influences the trade-off. A small value increases tree diversity but can weaken individual splits; a large value can make trees more similar. Minimum node size and maximum depth govern how local each tree becomes. Very small terminal nodes create noisy risk estimates. Tune these parameters inside the development resampling procedure, not against the final test cohort.

Observations omitted from a tree’s bootstrap sample are out-of-bag for that tree. Combining predictions from trees that excluded a training observation provides an internal OOB estimate. It can help diagnose fit, but is not external validation. Row-level OOB predictions can leak when several records from the same patient appear in different bootstrap samples.

## Worked example: scores and threshold consequences

Suppose a cohort contains 1,000 patients, 100 of whom have a 30-day adverse drug event. On an independent evaluation set, a forest flags 20 patients at a chosen threshold; 8 of those patients experience the event. The positive predictive value is 8/20 = 40%. Sensitivity cannot be calculated without the total number of events in that evaluation set. A score of 0.30 for one patient should not be described as a 30% risk until calibration has been assessed in representative data.

~~~r
library(ranger)
set.seed(41)
rf <- ranger(factor(event) ~ age + eGFR + prior_admissions + drug_count,
             data = train, num.trees = 1000, mtry = 2,
             min.node.size = 20, probability = TRUE,
             importance = "permutation")
p <- predict(rf, data = test)$predictions[, "1"]
~~~

Confirm the outcome factor ordering and the positive-class label. All preprocessing, imputation, and feature selection should be fitted inside each training partition. For repeated records, create patient-grouped folds; the default OOB calculation does not automatically keep all of one person’s records together. Compare the forest with a regularized regression and a simple clinical baseline using the same partitions.

Probability forests aggregate the observed event proportions in tree leaves. Averaging may smooth predictions, but calibration can still be poor, particularly when outcomes are rare or the development sample was case-control sampled. Examine a calibration curve and calibration intercept and slope, as well as discrimination. Recalibration may help if the ranking transports but baseline risk changes; it should be fitted on separate representative data and evaluated as part of the final procedure.

## Feature importance is not causal explanation

Impurity-based importance sums split improvements and can favor continuous variables or factors with many possible split points. Permutation importance shuffles one variable and measures the loss in predictive performance. It can understate a variable’s importance when correlated variables substitute for it, or redistribute importance across a group of related variables. Conditional permutation methods address some dependence but require additional modeling choices.

Importance is not direction, effect size, or evidence that intervening on the feature changes outcomes. A medication count may be predictive because it reflects disease severity or access to care. A site identifier may capture local coding practices. Investigate data provenance and clinical meaning before communicating a ranked list as biological insight.

Partial dependence plots vary one predictor while averaging over other observed values. With correlated predictors, they can create combinations that rarely or never occur. Individual conditional expectation plots display predictions for specific observations but may also extrapolate beyond support. Treat these displays as model diagnostics, not as causal effects or universally valid explanations.

If explanations guide clinical action, evaluate their stability across bootstrap samples, groups, and sites. A feature can remain predictively useful while its clinical meaning changes across settings. Explain how importance was calculated and state the dependence limitations.

## Validation should resemble deployment

If future use is for new patients, all records for each patient must remain in one partition. For use at new hospitals, hold out whole sites. For future use in the same system, evaluate on a later period. Random row splits can place the same person, clinician, or site in both training and test data, creating optimistic estimates. Hyperparameter tuning should occur in inner resampling, with outer folds or a locked external cohort used to estimate the full selection procedure.

Report discrimination and calibration, with uncertainty. AUC summarizes ranking, not whether a predicted probability of 20% corresponds to a 20% event rate. For rare outcomes, include precision-recall performance, event counts, predictive values, and threshold workload. Accuracy alone can be very high for a model that never identifies an event. Confidence intervals should resample the correct independent unit, such as patient or site.

A model can achieve higher AUC without improving decisions. At a clinically plausible threshold, report sensitivity, specificity, predictive values, false alerts, missed events, and the number of patients who would receive the action. Decision-curve analysis can compare net benefit over threshold ranges, but depends on meaningful consequences and valid predicted probabilities. Compare with current practice and treat-all or treat-none strategies when relevant.

## Missingness, imbalance, and transport

Implementations differ in missing-value handling: some drop records, impute, use surrogate splits, or offer specialized procedures. Document the approach and ensure it can run at deployment. Missingness can itself predict outcomes because clinicians order tests selectively; however, that pattern may change when ordering policy changes. Evaluate people with incomplete information separately and specify a safe fallback or abstention rule.

For rare outcomes, class weights or balanced sampling may improve minority-class detection, but they can change probability calibration. Do not rebalance the external evaluation set when estimating real-world predictive values. Recalibrate using representative data if needed, then evaluate the recalibrated model independently.

Forests partition the observed predictor space and average predictions; they do not extrapolate reliably far beyond training ranges. New assays, coding systems, patient mix, or care pathways can make plausible-looking scores unsupported. Check covariate overlap, data quality, site and time shifts, and subgroup calibration. Restrict or suspend use when inputs fall outside the development domain.

## Tuning and uncertainty

The number of trees should be large enough for predictions to stabilize. After that, more trees generally reduce computational noise rather than fix model quality. Tune mtry, node size, sample strategy, and class weights within cross-validation. Nested validation is useful when many configurations are searched. Report the search strategy and selected settings.

A bootstrap confidence interval should resample patients or sites and, where possible, repeat tuning to capture development variability. Intervals that treat the fitted forest as fixed omit uncertainty from model selection. Compare candidate models on identical held-out cases and evaluate calibration and utility alongside ranking. If a small performance gain is uncertain, a simpler model may be easier to audit and maintain.

Assess performance in clinically relevant subgroups with denominators, event counts, and intervals. Aggregate results can conceal underprediction or excessive false alarms in a smaller population. Disparities may arise from measurement quality, access, selection, or the model. Engage clinical teams and affected communities to decide which errors matter and how harms will be monitored.

## From model to operational system

Before release, freeze the model version and feature definitions, test code parity between development and production, and verify edge cases. Agree on the threshold, the action, response time, and responsibility for missing inputs. A silent prospective phase can test data feeds and calibration before a score changes care.

Monitor predictor distributions, missingness, calibration, alerts, outcomes, and subgroup impact. Changes in coding, instrumentation, population, or treatment pathways can degrade performance. Define triggers for recalibration, external evaluation, suspension, or redevelopment. Recalibration does not fix a changed target or a model whose ranking no longer works.

A prospective impact study evaluates the whole intervention: forest, interface, workflow, and response protocol. Retrospective validation cannot show whether clinicians will act on a score or whether action improves patient outcomes. Where feasible, compare model-supported care with usual practice and measure benefits, harms, resource use, and unintended consequences.

## A deeper look at OOB validation and development bias

For a bootstrap sample of n draws from n observations, about 63.2% of distinct observations appear at least once on average, leaving roughly 36.8% out of bag for a given tree. An observation’s OOB prediction aggregates only trees whose bootstrap sample omitted it. This yields an internal estimate that is computationally convenient, but it evaluates one fitted forest under the development sampling scheme. It does not test a new hospital, a later period, or a changed case definition.

OOB evaluation can be optimistic when the development process has dependencies. If patient A contributes five admissions, an OOB prediction for one admission may be averaged from trees trained on the other admissions. The model has seen patient-specific patterns, so the score is not an honest estimate for a new person. The same concern applies to multiple images from one patient, repeated laboratory windows, and site-specific rows. Grouped cross-validation or external validation must split at the intended unit.

Any tuning on OOB error uses the same internal data repeatedly. Comparing many values of mtry, node size, class weights, and feature sets, then reporting the best OOB score, can overfit the OOB criterion. Use nested resampling or a separate evaluation set. Keep a final cohort locked until model and threshold decisions are complete.

## Calibration and threshold metrics in practice

Calibration can be checked by comparing predicted and observed risks across the score range. Grouped calibration tables are easy to read but depend on bins; smooth curves reveal shape but can be unstable when events are sparse. Report a calibration intercept and slope, with uncertainty, in addition to a plot. The Brier score is the mean squared difference between predicted probability and outcome; compare it with simple reference predictions and remember it depends on event prevalence.

A model may discriminate well but systematically overestimate risk. If 100 patients are predicted at 20% risk and 10 events occur, those scores are not well calibrated to that group. Applying a treatment threshold at 15% would lead to action for many patients whose true risk is lower than expected. Conversely, underestimation can miss patients who might benefit. Calibration is especially important when a decision threshold is expressed on the absolute risk scale.

At a fixed threshold, report counts. If 50 of 1,000 patients are flagged and 20 are events, PPV is 40%; if 100 total events occurred, sensitivity is 20%. These measures have different denominators. Accuracy would be 920/1,000 if 920 patients were correctly classified, but could hide poor event detection. Choose a threshold based on consequences and operational capacity, then evaluate it on independent representative data.

### Worked net-benefit comparison

Suppose a held-out sample has 1,000 patients, 100 events. At a threshold of 0.20, the forest identifies 50 true positives and 150 false positives. Net benefit is TP/n − FP/n × t/(1−t) = .05 − .15(.20/.80) = .0125. This can be interpreted as 12.5 net true-positive equivalents per 1,000 patients under the threshold’s implied relative weighting. Treat-all net benefit is .10 − .90(.20/.80) = −.125; treat-none is zero. The forest is preferable by this calculation at this threshold, but that conclusion depends on threshold relevance, valid risk predictions, and availability of an effective action.

Decision curves should include a clinically plausible threshold range and uncertainty. They do not establish that the chosen model improves care, because the assumed consequences are encoded through threshold probability and real workflow can differ. A prospective impact study is needed to determine whether acting on alerts changes outcomes.

## Model explanation and correlated predictors

Permutation importance relies on replacing a feature with shuffled values, which may create unrealistic predictor combinations. With highly correlated biomarkers, shuffling one can have little impact because another retains similar information. A low importance score does not mean the feature is clinically irrelevant; a high score can arise from a proxy. Grouped or conditional importance can help but should be interpreted with the assumptions of the method.

Partial dependence estimates average predictions after setting a feature to chosen values. If high eGFR is observed only in younger patients, plotting predictions for high eGFR among all ages may extrapolate into unsupported combinations. Accumulated local effects or conditional summaries can reduce some problems but do not turn predictive associations into intervention effects. Display data support alongside explanation plots and avoid causal language.

## Reporting and fair comparison

State how the forest handles unordered factors, missing values, class weights, sampling, number of trees, candidate features per split, node size, and importance. Report software and version, random seed where relevant, preprocessing, and tuning strategy. Provide the full validation design and whether records were grouped by patient, site, or time. Report event prevalence and counts for each partition.

Compare models on the same eligible cohort with the same predictors and tuning effort. A highly tuned forest should not be compared with an untuned baseline. Include a simple model and current practice where possible. Report confidence intervals and calibration, not only point estimates of AUC. Document failed or excluded model families if extensive experimentation occurred, so selective reporting does not create an exaggerated performance claim.

Fairness assessment should examine data quality, outcome ascertainment, calibration, and threshold errors across relevant groups. A score may perform differently because some populations have less complete laboratory measurement or different access to care. Metrics cannot alone decide what fairness requires; clinical stakeholders and affected communities should consider error consequences, resource distribution, and recourse when a score is wrong.

### Model lifecycle decisions

Monitoring should distinguish data drift from concept drift. Data drift changes predictor distributions; concept drift changes the relation between predictors and outcome. Recalibration may address a change in baseline event rate when ranking remains stable. A changed treatment pathway or outcome coding may require new model development and validation. Set monitoring intervals and triggers before release, and define who can authorize updates.

Keep an audit trail of the deployed version, inputs, outputs, overrides, and actions, subject to privacy controls. Human oversight should include a way to contest or disregard unsupported predictions. A model that cannot be safely monitored, updated, or withdrawn is not ready for routine clinical use. The lifecycle evidence is part of the predictive system, not an administrative afterthought.

## When a forest is the wrong choice

A forest may be a poor fit when a short, stable rule is essential, the sample has few independent events, or decisions require extrapolation beyond observed ranges. It can be computationally burdensome for frequent retraining and difficult to audit at the level of an individual prediction. Sparse categorical variables and rare outcome combinations can produce unstable leaves even when many trees are averaged. A simpler regression with splines, a decision tree, or a prespecified score may be more suitable if it meets the decision need with clearer behavior.

Conversely, do not reject a forest solely because it is less interpretable than a linear model. Compare its added value, calibration, subgroup behavior, stability, resource cost, and prospective impact. If it offers no material improvement, complexity is difficult to justify. If it improves decisions, document the specific evidence and preserve an explainable governance process without overstating feature-level explanations.

Record data cut dates, outcome ascertainment windows, and all transformations so later evaluations use the same prediction contract. Recheck that the deployed code returns the validated score for representative and boundary-case records.

## References and further reading

- Breiman L. Random forests. *Machine Learning*. 2001;45:5–32. [doi:10.1023/A:1010933404324](https://doi.org/10.1023/A:1010933404324).
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378).
- Moons KGM, Damen JAA, Kaul T, et al. PROBAST+AI. *BMJ*. 2025;388:e082505. [doi:10.1136/bmj-2024-082505](https://doi.org/10.1136/bmj-2024-082505).
- See [Decision trees](decision-trees.html) for split criteria and pruning.
