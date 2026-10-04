---
title: K-nearest neighbors
summary: A distance-based prediction method, including scaling and neighborhood choices that matter for biomedical data.
---

## Overview

K-nearest neighbors (KNN) predicts an observation from the outcomes of similar observations in the training data. For a new patient, the algorithm calculates distances to training patients, selects the k closest, and summarizes their outcomes. Classification uses a vote or averaged class probability; regression uses an average or distance-weighted average. KNN is conceptually simple and can represent nonlinear boundaries, but its meaning depends directly on how similarity is defined.

KNN has little conventional model fitting: it stores training observations and performs most computation at prediction time. This can make it useful as a local comparison method, but also creates memory, privacy, and latency concerns. It does not learn a global clinical rule. A patient’s “neighbors” are determined by chosen variables, scaling, missing-data handling, and distance metric.

## Geometry defines what counts as similar

For numeric variables, Euclidean distance between patients i and j is sqrt(Σ_l (x_il−x_jl)²). A variable with a large numeric range can dominate the distance. Age measured in years may contribute less than a biomarker measured in thousands of units, even if the biomarker is not more clinically relevant. Standardize or otherwise scale features using training data only, and apply the same transformation to new patients.

Scaling is not a neutral step. Standardizing by standard deviation gives noisy and clinically unimportant variables potential influence comparable to stable measures. Robust scaling can reduce outlier impact, while clinically justified weights can emphasize meaningful dimensions. Every choice changes the neighborhood and should be justified and validated.

Distance concentration is a central problem in high dimensions: the nearest and farthest observations can become similarly distant, making “nearest” less informative. Redundant, irrelevant, or highly correlated features distort geometry. Feature selection or dimension reduction may help, but must be performed inside resampling. With sparse clinical tables, a simpler model may outperform local averaging.

Mixed data need a distance suitable for their types. One-hot encoding nominal variables can make category mismatches contribute multiple dimensions; ordinal encoding imposes ordering and spacing; Gower distance combines scaled numeric and categorical differences but needs thoughtful missingness rules. Do not use an arbitrary distance formula simply because a package accepts the data.

## Worked neighborhood probability

Suppose k=5 nearest training patients have outcomes 1, 1, 0, 0, 1. The unweighted estimated probability is 3/5=0.60 and majority voting assigns the positive class. If distances are 0.2, 0.3, 0.7, 0.8, and 1.0, inverse-distance weights make closer patients contribute more, but may produce a different score. This 0.60 is a local empirical proportion, not necessarily a calibrated 60% risk. Its uncertainty depends on neighborhood size and the local density of observations.

~~~r
library(class)
# Scale using training-set parameters; apply them unchanged to test data.
mu <- sapply(train[predictors], mean, na.rm = TRUE)
sdev <- sapply(train[predictors], sd, na.rm = TRUE)
x_train <- scale(train[predictors], center = mu, scale = sdev)
x_test <- scale(test[predictors], center = mu, scale = sdev)
pred <- knn(train = x_train, test = x_test,
            cl = train$event, k = 15, prob = TRUE)
~~~

This basic example assumes complete numeric predictors and uses a class vote. The returned probability is for the winning class, not automatically the event class; inspect the prediction attribute and factor levels. Imputation, feature selection, and scaling must be estimated inside each resampling fold. For missing values or mixed predictors, use a justified distance and an implementation whose behavior is documented.

## Choosing k and the weighting rule

Small k creates highly local, variable predictions; large k smooths across broader regions and may obscure real subgroups. At k=1, training classification can appear perfect while test error is high. Choose k and any distance weights using training resampling only. The relevant metric may be log loss, Brier score, discrimination, or threshold utility, depending on the task. Use nested resampling if many values and preprocessing choices are compared.

Distance weighting gives more influence to close neighbors, but can magnify measurement noise when a distance is nearly zero. Specify the function, such as inverse distance or a kernel weight with a bandwidth. Ensure duplicate records do not create trivial matches between train and test; split by patient and remove cross-partition duplicates. A patient may appear multiple times in a longitudinal dataset, which can cause leakage if not grouped.

The effective local sample size differs from k when weights vary. Report neighborhood size and distance distribution for representative predictions. If the nearest neighbor is far away, the model is extrapolating locally from poor support even though it always returns an answer. Define an abstention or “insufficiently similar examples” rule rather than trusting every output.

## Missing data, noise, and class imbalance

KNN requires a distance for each candidate pair. Pairwise deletion can make distances incomparable when different patients are compared on different subsets of variables. Mean imputation can compress distances and create artificial neighborhoods; missingness indicators may encode workflow differences. Impute within training partitions and assess whether the procedure is available and appropriate at prediction time. If key inputs are missing, abstention may be safer.

Noisy predictors can dominate or scramble nearest-neighbor relations, especially when many features are included. Feature selection should reflect domain knowledge and be validated, not optimized to one held-out set. Correlated features can repeatedly count the same construct. Use sensitivity analyses with plausible scaling, distance, and feature sets, and see whether predictions and neighbors remain stable.

With imbalanced outcomes, a local majority vote may almost always choose the common class. Class weighting, targeted sampling, or distance-weighted voting may improve sensitivity but alter probability interpretation. Evaluate on representative prevalence and report sensitivity, PPV, and alert burden. Calibration should be checked; local proportions can be unstable in regions with few events.

## Validation and interpretation

Validation must match intended use. Group all records from a patient when testing new-patient performance; use time splits for future cases; hold out sites for transport. Tune k, scaling, feature subset, and metric within development resampling. Use an untouched cohort for final evaluation. Compare with logistic regression, a simple clinical score, and relevant flexible baselines using the same partitions.

Report discrimination, calibration, threshold metrics, and uncertainty. AUC assesses ranking and does not show probability accuracy. Bootstrap independent patients or sites for intervals. If neighbors are reused across many predictions, account for dependence in uncertainty estimation. Check performance across clinically relevant groups and regions of feature space; KNN can perform poorly where training density is low even when aggregate metrics look adequate.

Neighbor examples can aid local explanation: show which training cases influenced a prediction, their outcomes, and distances. Protect privacy and avoid revealing identifiable records. Similarity is defined by the algorithm, not guaranteed clinical equivalence. A nearby patient may differ on an unmeasured contraindication or care context. Local explanations should not be treated as causal analogies.

## Clinical and computational trade-offs

KNN can be attractive as a teaching baseline, a local analog retrieval tool, or a model for moderate-sized datasets with meaningful distance. It can struggle with high-dimensional sparse data, large training sets, heterogeneous variables, and latency-sensitive deployment. Prediction cost grows with the number of stored observations and dimensions unless approximate-neighbor indexing is used. Approximate search changes results and needs evaluation.

Storing patient-level data for future comparison raises privacy and governance issues. De-identification may not prevent membership or linkage risks, and nearest records could reveal sensitive patterns. Secure storage, access controls, data minimization, and deletion policies are part of model design. A model that cannot safely retain the data it needs may be operationally unsuitable.

## Reporting a KNN analysis

Specify preprocessing, distance metric, scaling, feature weighting, missing-data strategy, k, vote weighting, tie handling, and any approximate search. Describe how tuning was nested in validation and how partitions respected patients, time, and sites. Report neighborhood support, calibration, discrimination, threshold consequences, and uncertainty. Provide enough detail to reproduce distance calculations and factor encoding.

Monitor whether new patients fall within the development support, whether input distributions change, and whether neighborhood outcomes remain calibrated. Define conditions for abstaining, retraining, or decommissioning. Compare updated versions on a prospective or held-out cohort rather than assuming that adding new records improves performance.

### Distances, scaling, and an explicit calculation

For two numeric predictors, age and a standardized biomarker, suppose patient A is (50, 1.0) and B is (60, 0.5). Euclidean distance is sqrt[(50−60)²+(1.0−0.5)²] ≈ 10.01, because age dominates. After standardizing age by 10 years, their coordinates differ by 1 and 0.5, giving distance sqrt(1²+.5²)=1.12. This changes who counts as a neighbor. Scaling should be chosen based on meaningful variation and fit only in training data.

Standardization by sample mean and standard deviation is not always ideal. If a lab measure has a long tail, robust center and scale can reduce the influence of outliers. If clinical experts regard a 5-year age difference as equivalent to a specified biomarker change, metric weights can encode that judgment, but the choice should be prespecified and tested. A feature with very small variance may be clinically critical even if standardization gives it a similar contribution; conversely, standardization can amplify measurement noise in nearly constant features.

For binary predictors, simple matching distance treats equal mismatches alike; for nominal categories, mismatch contributes a fixed amount. Ordinal variables may be represented by scaled ranks only if the imposed spacing is defensible. Gower distance combines variable-specific dissimilarities and can accommodate mixed data, but its range adjustments and missing-value denominator affect comparisons. Describe the formula and how each variable contributes, rather than just naming a package default.

## High dimensions and local support

As dimensionality rises, volume concentrates in the corners of the feature space. Typical distances between observations become more similar, so the identity of the nearest patient can be sensitive to small measurement changes. Irrelevant predictors add noise to every distance. A model may have thousands of laboratory and code features yet very few patients that are genuinely close across all of them.

Dimension reduction can help, but principal components preserve variance, not necessarily outcome-relevant similarity. Supervised feature selection can use outcome information, but must be performed within each training fold. Feature screening on the full dataset leaks information even if the final neighbor search is done separately. Compare reduced representations with simple clinical feature sets and assess whether the same neighbors recur across resamples.

A support check can use the distance to the k-th neighbor. If a new patient’s k-th distance is much larger than distances observed during development, the local prediction is extrapolative. Threshold this support diagnostic using training or validation data and define a fallback such as a global baseline, specialist review, or no score. The support cutoff itself should be evaluated and reported.

## Probability uncertainty and local estimates

An unweighted binary KNN probability is the event fraction among the selected neighbors. If k=10 and 2 neighbors have events, the score is .20. The binomial standard error approximation sqrt(.2*.8/10)=.126 is large, showing how little information a small neighborhood contains. A formal interval based on a binomial sample is only approximate because neighbors are selected based on predictors and are not a random sample from a fixed group. Selection and dependence add uncertainty.

Increasing k reduces local variance but can introduce bias by averaging patients who are less similar. Distance weighting can lower effective sample size further. Report local support, such as k, event counts, distance range, and optionally an effective weighted sample size. Avoid a false impression of precision from printing probabilities to three decimal places.

Probability calibration can be checked on held-out patients by plotting observed event rates against predicted scores and computing Brier score or log loss. With small datasets, smooth calibration curves may be unstable; show confidence bands or grouped counts. Recalibration can adjust local scores, but if the neighbor relation itself fails across populations, a global correction is unlikely to restore validity.

### Tie handling, duplicate cases, and repeated records

When the k-th distance is tied, implementations may include more than k observations or break ties by row order. This can affect reproducibility, especially with rounded or categorical features. Document tie behavior and set deterministic seeds where randomness is used. Duplicate records may be valid repeated measures, duplicate exports, or copies across partitions. Investigate the source and deduplicate according to the unit of analysis rather than automatically removing identical feature rows.

If repeated visits are used as training examples, a high-utilization patient may appear many times and dominate local neighborhoods. Weighting each patient equally, selecting a single index observation, or modeling trajectories changes the target. Keep patient groups intact during validation and report whether the prediction unit is a patient, visit, or hourly observation.

## Choosing k under resampling

Tune k together with distance, scaling, weighting, and feature selection. A typical workflow evaluates a prespecified grid of k values in inner folds and estimates generalization in outer folds. Select a metric aligned with use. Accuracy is inadequate under imbalance; log loss or Brier score assesses probabilities, while sensitivity at a fixed alert burden may be operationally relevant. Do not choose k by examining final test outcomes.

Repeated cross-validation can estimate variability, but folds must be grouped appropriately. Bootstrap patients to quantify uncertainty and record how often neighbor sets and predictions change. Compare KNN with a regularized regression, tree-based model, and prevalence baseline. If performance depends strongly on a narrow feature scaling choice, the proposed similarity may not be robust.

A distance metric can be tuned through metric learning, but this adds parameters and overfitting risk. Any learned projection or feature weighting must be fit only on training data. If the sample is small, domain-defined distances may be more defensible than a flexible learned metric, but their consequences should still be evaluated.

## Interpreting a local analogue responsibly

KNN can present influential training records as analogues, which may help clinicians understand the score. Show the variables and distances that define similarity, the training outcome and follow-up, and how the examples were selected. Avoid implying that those patients are clinically identical or that their outcomes forecast the new patient with certainty. Key differences in unmeasured context may dominate the apparent match.

Privacy review is essential. Displaying nearest records can expose rare combinations or sensitive diagnoses. Use aggregate summaries, synthetic examples, or secure access controls. Model governance should specify whether raw training records are retained, who can inspect them, and how deletion requests or data-retention limits are handled.

Local analogues can also perpetuate historical care patterns. If prior patients from a marginalized group had less access to diagnosis, their outcomes and labels may misrepresent underlying need. Evaluate errors and neighbor composition across groups, and consider whether the algorithm finds similar people only because care and documentation were similar. Similarity in observed data is not necessarily similarity in clinical need.

### Computational options and production behavior

Exact KNN calculates distances from a new record to all training records, which costs roughly proportional to the number of records times the number of features. For large data, tree-based or approximate-neighbor indexes can accelerate queries. Approximate methods may not return the exact closest cases; compare resulting predictions and recall of true neighbors against exact search on a representative subset.

Production must apply the same feature schema, unit conversion, missingness rules, and scaling as development. Store preprocessing parameters with the model. Validate edge cases, such as unseen factor levels and extreme values. Monitor latency and memory as the reference set grows; continual addition of records can alter neighborhoods and model behavior even without explicit refitting.

## Reporting a reproducible analysis

State the unit of observation, feature set, distance function, scaling, weights, missing-data procedure, k, vote rule, tie handling, and any support threshold. Explain all tuning and validation, including how repeated patients, sites, and time were partitioned. Report event prevalence, local support, calibration, discrimination, threshold performance, and uncertainty. Provide enough detail to reconstruct a distance between two observations.

For deployment, specify when a prediction is withheld, when a human review is required, and how new training records are incorporated. A model update can change every neighborhood; evaluate each version on held-out or prospective data. KNN is transparent only to the extent that similarity, support, privacy, and data provenance are made explicit.

KNN can be a helpful comparator in methodological work because its local assumptions are explicit. A poor score can indicate that the chosen feature representation does not encode clinically useful similarity; a good score still requires calibration, transport, and impact evidence before care decisions rely on it.

### Neighborhood review

Inspect representative neighborhoods for clinical coherence, not only distance values. If nearest cases differ on key unmeasured context, describe that limitation and avoid presenting analogues as matched clinical histories.

## References and further reading

- Cover TM, Hart PE. Nearest neighbor pattern classification. *IEEE Transactions on Information Theory*. 1967;13:21–27. [doi:10.1109/TIT.1967.1053964](https://doi.org/10.1109/TIT.1967.1053964).
- Altman NS. An introduction to kernel and nearest-neighbor nonparametric regression. *The American Statistician*. 1992;46:175–185. [doi:10.1080/00031305.1992.10475879](https://doi.org/10.1080/00031305.1992.10475879).
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378).
- See [Clustering in health data](clustering-in-health-data.html) for unsupervised distance-based methods.
