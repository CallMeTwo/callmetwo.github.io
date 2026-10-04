---
title: Multilayer perceptrons
summary: How feedforward neural networks model fixed-size clinical feature vectors, with practical notes on scaling, regularization, and calibration.
---

## Overview

A multilayer perceptron (MLP), also called a dense feed-forward network, maps a fixed-length vector of predictors through one or more nonlinear hidden layers to an outcome prediction. Each layer applies a weighted sum and bias, followed by an activation. MLPs can represent nonlinear relationships and interactions, but on small tabular clinical datasets they often need substantial regularization and do not reliably outperform simpler regression or tree-based methods.

The model estimates associations useful for prediction under its training distribution. It does not show that changing a predictor changes the outcome. A high-risk output is a probability only when the target, loss, sampling scheme, and calibration support that interpretation. Define the clinical prediction problem before specifying the architecture.

## Forward computation and learning

For an input vector x, a one-hidden-layer MLP computes h=g(Wx+b) and then output z=Vh+c. For binary classification, p=1/(1+exp(−z)); for regression, the output may be linear. Multiple hidden layers compose these transformations. Nonlinear activation functions allow the network to model patterns that a linear predictor cannot represent.

Training minimizes a loss over examples. Binary cross-entropy is −[y log(p)+(1−y)log(1−p)]; squared error is common for continuous outcomes. Backpropagation applies the chain rule to calculate gradients, and an optimizer updates weights. Learning rate, minibatch size, initialization, and stopping rule affect the resulting model. Multiple random seeds can produce distinct solutions, so report reproducibility and variation.

Regularization constrains fitting. Weight decay penalizes large weights; dropout randomly masks units during training; early stopping limits iterations using validation loss. These are not interchangeable guarantees against overfitting. Each choice must occur within training resampling, and validation data used for early stopping cannot also serve as an untouched test set.

### A forward-pass example

Suppose a network uses standardized age x1=1 and baseline score x2=−0.5. A hidden unit with weights 0.4 and 0.8 and bias −0.1 gives pre-activation 0.4(1)+0.8(−0.5)−0.1=−0.1. ReLU yields h=0. A second hidden unit may activate, and the output layer combines hidden values into a logit. If the final logit is 0.7, the predicted probability is expit(0.7)≈0.668. The calculation illustrates architecture, not clinical validity.

~~~r
library(nnet)
fit <- nnet(event ~ age + baseline_score + lab_a + lab_b,
            data = train, size = 6, decay = 0.02,
            maxit = 600, trace = FALSE)
p <- predict(fit, newdata = test, type = "raw")
~~~

This example assumes a binary outcome encoded as intended and complete numeric predictors. The nnet package is useful for compact demonstrations, but large or high-dimensional problems may need other frameworks. Scaling and imputation must be learned in each training fold. Ensure that output columns map to the event class correctly and evaluate probabilities on independent data.

### Architecture and tabular data

An MLP’s hidden width and depth control representational capacity. More units allow more complex functions but increase estimation and tuning burden. For tabular data, a shallow network may be adequate; deeper networks are not automatically better. Compare architecture choices against regularized logistic regression, splines, and gradient boosting on identical partitions.

Categorical predictors may be one-hot encoded or represented with embeddings. One-hot encoding is transparent but can become wide; embeddings learn category vectors and need sufficient observations per level. Rare categories may be unstable or encode site-specific information. Unseen levels at deployment require an explicit rule. Missing data need an imputation and indicator strategy or architecture that handles missingness; the model cannot infer a principled value from a blank field without a defined procedure.

Interactions can be learned, but are difficult to interpret and may require large samples. Feature scaling improves optimization because gradients behave more predictably when predictors have comparable ranges. Fit means, standard deviations, and category maps only on training data; apply them unchanged to validation and test records. A data pipeline should package preprocessing with model weights.

## Development example and evaluation

Consider a fixed-horizon 90-day mortality model for 3,000 patients, with 240 deaths. Define the index time as hospital admission and include only predictors available then. Split by patient and reserve a later calendar period for evaluation. Within the development period, use nested cross-validation to select hidden width, decay, and stopping epoch. Compare with logistic regression using the same predictor set and evaluation scheme.

Suppose the MLP achieves AUC 0.81, while the logistic model achieves 0.80. This small ranking difference does not justify deployment by itself. Compare calibration, Brier score, confidence intervals, risk thresholds, subgroup performance, and alert burden. If probabilities are poorly calibrated, a threshold-based action may be harmful despite acceptable AUC. Report event counts so readers can judge precision.

Validation must match intended use: patient grouping for new-patient estimates, temporal splits for future prediction, and external sites for transport. If architecture is selected using one test cohort, the reported performance is no longer independent. Repeat preprocessing and tuning inside folds. Bootstrap patients to quantify uncertainty and paired differences.

## Capacity, events, and overfitting

The information available depends on independent patients and events, not rows. Repeated measurements from one patient add structure but are correlated. A model with many parameters can fit few events, producing unstable probabilities and large optimism. There is no fixed parameter-to-patient rule that guarantees adequate sample size. Consider outcome frequency, shrinkage, candidate predictors, missingness, and desired precision.

Use learning curves to assess whether validation performance improves with more independent cases. Limit architecture search when data are sparse and favor regularization. Report the number of tuning attempts and do not select a model based on repeated inspection of final test data. If a smaller regression performs similarly, its calibration and maintainability may make it preferable.

Class imbalance can bias optimization toward the majority. Class weights or sampling may help detection but alter score calibration. Evaluate on the real prevalence and report sensitivity, PPV, and the number flagged. Do not rebalance external test data. For rare outcomes, uncertainty intervals around sensitivity and PPV can be wide even in apparently large datasets.

## Calibration and probability use

Cross-entropy encourages probabilistic output but does not guarantee calibration. Overfitting, class weighting, case-control sampling, and temporal prevalence shift can produce inaccurate risks. Use calibration plots, calibration intercept and slope, Brier score, and log loss on an independent representative cohort. Recalibration may adjust average risk or slope, but should be treated as part of the system and evaluated separately.

Choose thresholds based on action consequences. A threshold of 0.2 means acting above 20% predicted risk only if probabilities are calibrated and the implied trade-off is acceptable. Report sensitivity, specificity, predictive values, confusion counts, and workload. Decision curves can summarize potential net benefit across threshold probabilities but do not prove prospective clinical impact.

## Diagnostics and explanation

Inspect training and validation loss, learning curves, calibration, residuals for continuous outcomes, and predictions across predictor ranges. Check whether predictions change implausibly with small input perturbations or respond to impossible feature combinations. Feature importance, permutation methods, and attribution techniques depend on assumptions and can be unstable when predictors correlate. They are not causal effects.

For tabular models, partial dependence may average over combinations not represented in data. SHAP attributions depend on background distribution and feature-dependence treatment. Use explanations to locate leakage or unexpected reliance, then verify through data audits. Report method and uncertainty, especially when clinicians will see explanations.

## Subgroups, fairness, and deployment

Assess calibration and error rates for relevant groups, with denominators and intervals. Differences may arise from measurement quality, access, outcome coding, or prevalence. Removing protected attributes does not eliminate proxies. Engage stakeholders in deciding which errors matter and monitor resource allocation and downstream effects.

Before deployment, freeze model and preprocessing versions, verify implementation parity, define missing-input and out-of-range handling, and assign operational responsibility. Conduct silent prospective evaluation for data latency and calibration. Monitor missingness, input shifts, prevalence, subgroup error, and actions. Define triggers for recalibration, redevelopment, suspension, or rollback. A new training run creates a new model version requiring validation.

## Training choices that change the fitted model

The optimizer minimizes a nonconvex objective, so initialization and training path can lead to different parameter values and predictions. Stochastic gradient descent and adaptive optimizers such as Adam use minibatches and learning-rate schedules. Report optimizer, learning rate, batch size, number of epochs, initialization, and stopping rule. A reproducible seed does not establish that a model is stable; refit with several seeds and quantify performance variation.

Batch normalization rescales intermediate activations using batch statistics during training and stored statistics at prediction. Small or nonrepresentative batches can make these estimates unstable. Dropout randomly removes activations while training, which can discourage reliance on particular units but changes the effective model. Weight decay penalizes large weights. These settings should be tuned within development data, and their effects evaluated on untouched observations.

Early stopping monitors validation loss. Selecting the best epoch is a model-selection step. If the same validation data are used to compare many architectures, preprocessing options, and thresholds, the selected result is optimistic. Use an inner validation layer for stopping and a separate outer evaluation, or employ nested cross-validation. Record the selected epoch distribution across folds; large variability can indicate weak information or an unstable learning process.

### A fuller calculation from logit to threshold

For a binary outcome, suppose the final logit is z=0.7. The sigmoid probability is 1/(1+e^(−0.7))=0.668. At a decision threshold of 0.60, this patient is flagged; at 0.70, they are not. The threshold is separate from the network and should be based on costs and benefits of the downstream action. If the development calibration is poor, this numeric comparison has no reliable risk interpretation.

On an independent cohort of 500 patients with 50 events, suppose a 0.60 threshold flags 40 people, 18 of whom have the event. PPV=18/40=45%, sensitivity=18/50=36%, and the false-positive count is 22. Those numbers alone do not indicate whether the policy is worthwhile. Compare them with usual care and the resources needed to follow 40 patients. Report uncertainty, especially because PPV is based on only 40 flagged individuals.

~~~r
# p is a held-out prediction and y is a 0/1 outcome
brier <- mean((p - y)^2)
cal <- glm(y ~ qlogis(p), family = binomial())
coef(cal)  # intercept ideally 0; slope ideally 1
flag <- p >= 0.60
table(flag, y)
~~~

Avoid probabilities exactly zero or one before computing logits. This code assesses one held-out cohort and one threshold; do not choose the threshold from these same outcomes and then report the resulting sensitivity as independent validation. If calibration is fitted after evaluation, reserve another dataset to assess the combined model.

## Choosing architecture for the question

A dense network is a flexible baseline for fixed-length feature vectors, but it has no built-in knowledge of spatial neighborhoods, temporal order, or clinical hierarchy. CNNs encode locality in images; RNNs and temporal convolution encode sequence; transformers use attention to model context. For tabular data, these specialized structures may not help unless the input has corresponding structure. Simpler generalized additive models or boosted trees can be stronger and easier to validate.

Network depth is not a proxy for scientific sophistication. Deeper architectures may be harder to train, need more examples, and amplify data leakage through complex preprocessing. Select architecture based on modality, amount of independent data, computational limits, and decision needs. Justify hidden width and depth through development evidence and stability, not by copying a benchmark configuration.

## Missing data and distributional support

Imputation should reflect variable type and relationships, be fitted inside each training fold, and be deployable with the same available predictors. Mean imputation can create implausible profiles; missingness indicators may help prediction but encode how care was delivered. Test performance in strata with sparse or absent data. A model should not silently output a confident prediction when a required laboratory value is unavailable or outside the development range.

Out-of-distribution inputs can produce confident outputs because standard MLPs generally return a value for any numeric vector. Monitor distance or density in the input representation, prediction uncertainty, and missingness patterns. Define abstention criteria based on validation data and assess how often they trigger across groups. Abstention can improve safety but may also disproportionately deny support to underrepresented populations; review that consequence.

### Model behavior and responsible explanation

Input gradients measure local sensitivity, not what would happen under an intervention. Feature attribution methods distribute prediction among inputs under a reference distribution and assumptions about dependence. For correlated clinical variables, different methods may allocate credit differently. Evaluate attribution stability across seeds and cohorts, and do not present weights as a clinical coefficient.

Counterfactual explanations ask what input changes would alter a prediction. A mathematically small change may be impossible or harmful, such as changing age or withholding a test. Constrain explanations by actionable, plausible interventions and clarify that the network is associational. Clinician review can identify impossible outputs but does not establish patient benefit.

## A practical comparison protocol

Fit an intercept-only baseline, a prespecified clinical score if available, logistic regression with plausible nonlinear terms, and the MLP. Use identical development and evaluation splits. Tune every model with a fair level of effort and evaluate on the same patients. Report performance differences with paired uncertainty intervals. If the MLP improves AUC by .01 but worsens calibration or has no net-benefit gain, the extra complexity may not be justified.

Document feature availability at the index time, missing-data strategy, and candidate features. Prevent leakage from post-outcome variables, patient overlap, preprocessing before partitioning, and target-derived features. Audit influential predictions and test whether the model can exploit site identifiers or administrative artifacts. For outcome labels derived from routine care, verify ascertainment quality across groups.

### Communication, monitoring, and evidence

State that an MLP is a predictive model and distinguish it from causal inference. Explain target, population, horizon, and intended action. Report calibration, threshold consequences, subgroup uncertainty, and external evidence in plain language. Avoid communicating only a single accuracy number or a generic claim of AI superiority.

After release, track data quality, calibration, alert burden, clinician response, outcomes, and subgroup effects. Changes to coding, lab instruments, workflow, or treatment alter the prediction system. Define review cadence and who can pause use. If retraining occurs, retain the old version and compare the new model prospectively or on an untouched cohort before replacing it.

## Sample size and uncertainty

Parameter count does not give a simple minimum sample size, but independent events, predictor complexity, and label quality constrain generalization. Thousands of observations from a few hundred patients do not replace independent patients. Use learning curves, bootstrap patients, and repeated seeds to assess performance variability. If event counts are low, shrink complexity and avoid broad hyperparameter searches; a large model’s apparent precision can mask unstable risk estimates.

For confidence intervals, resample at the patient or site level and repeat the entire selection process when feasible. A test-set interval conditional on a chosen architecture does not include architecture-selection uncertainty. Report the number of events and patients in each evaluation stratum so readers can judge the strength of subgroup claims.

## When an MLP is not the right choice

For small tabular cohorts with few events, regularized regression or gradient boosting may be more stable and easier to validate. For images, a dense network on flattened pixels ignores spatial locality and can require many parameters; convolution is usually a more natural representation. For irregular longitudinal records, a fixed-width MLP may discard timing structure unless features are carefully summarized. Match architecture to data rather than treating dense layers as a universal neural model.

If the MLP adds no reliable benefit over a simpler baseline, retain the model that can be calibrated, monitored, and explained for its intended decision. If it offers a meaningful gain, document evidence for calibration, subgroup behavior, and prospective workflow rather than relying on complexity as justification.

A deployment checklist should verify that category levels, scaling constants, imputations, model weights, output labels, and threshold are versioned together. Test representative and boundary inputs against the validated implementation and record how failures are handled.

Keep a record of data cut dates, model dependencies, and training configuration so later performance changes can be traced to a model update or an upstream data shift.

If the proposed use changes from research prioritization to treatment allocation, the acceptable error trade-off changes as well. Revisit the target, threshold, and impact evidence rather than assuming that validation for one workflow authorizes a different one.

Reassess intended use and validity periodically, especially after changes in the patient population, measurement systems, clinical protocols, or available actions.

Record who reviews errors and how clinicians can report unexpected behavior after implementation.

### Numerical stability

Check for exploding or non-finite losses, sensitivity to input scaling, and predictions outside expected ranges. Numerical training stability is necessary for reproducibility but does not establish predictive validity.

## References and further reading

- Bishop CM. *Pattern Recognition and Machine Learning*. Springer; 2006.
- Goodfellow I, Bengio Y, Courville A. *Deep Learning*. MIT Press; 2016.
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378).
- See [Neural networks for health data](neural-networks-for-health-data.html) for broader architecture and governance concepts.
