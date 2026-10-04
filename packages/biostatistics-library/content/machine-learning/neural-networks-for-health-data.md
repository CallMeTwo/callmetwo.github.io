---
title: Neural networks for health data
summary: The shared concepts behind neural networks and deep learning, with guidance on when added model flexibility is justified.
---

## Overview

Neural networks are flexible functions built by composing layers of weighted sums and nonlinear activation functions. During training, an optimization algorithm adjusts parameters to reduce a loss function. Networks can learn representations from tabular data, images, waveforms, text, and longitudinal records, but architecture alone does not solve problems of target definition, data quality, validation, or clinical utility.

A neural network’s output is conditional on its training data, preprocessing, architecture, and optimization. It can predict outcomes without estimating intervention effects. A feature that contributes to a high predicted risk is not necessarily a cause, and a visually plausible explanation does not establish biological mechanism. Neural models require the same clarity about population, prediction time, outcome, horizon, and action as any other prediction method.

## From input to prediction

A basic dense network maps an input vector through layers. In layer l, the hidden representation is h_l = g(W_l h_(l−1)+b_l), where W_l and b_l are weights and biases, and g is a nonlinear activation such as ReLU. The final layer maps the representation to an output: a linear value for regression, a logit for a binary event, or multiple logits for categories. Without nonlinear activation, several stacked affine layers collapse to one linear transformation.

Training minimizes a loss over examples, often with regularization. For binary classification, cross-entropy penalizes disagreement between predicted probabilities and outcomes. Gradient-based optimization updates parameters using minibatches; learning rate, batch size, initialization, optimizer, and stopping rule affect the fitted solution. Different random seeds can yield different networks, so repeatability and uncertainty should be assessed.

Representation learning can be valuable when raw data contain structure. Convolutional networks exploit local patterns in images, recurrent networks process sequences with state, and transformers use attention to represent relationships among tokens or time steps. These architectures encode assumptions about spatial or temporal structure. They are not interchangeable, and their complexity should match the data and use.

### A small forward-pass calculation

Consider a one-hidden-layer network with two inputs x1 and x2, a single hidden unit with weights 0.5 and −0.25, bias 0, and ReLU activation. For x=(2,4), the hidden value is ReLU(0.5×2−0.25×4)=ReLU(0)=0. A final logit with hidden weight 1 and bias −1 is −1, corresponding to probability expit(−1)≈0.269. This arithmetic illustrates the mapping, not how the weights should be chosen or whether the probability is calibrated.

~~~r
logit <- -1
risk <- plogis(logit)
risk
~~~

For a real model, inspect input units, normalization, missing-data handling, and output layer. If inputs are standardized, transformations must be stored and applied exactly at validation and deployment. A model artifact without preprocessing can yield different predictions from those evaluated.

### Capacity, sample size, and regularization

A network with many weights can fit complex patterns but also memorize noise. Capacity depends on architecture, parameter count, regularization, data augmentation, and optimization; parameter count alone does not determine overfitting. Dropout, weight decay, early stopping, and data augmentation are common tools, but each changes the training procedure and must be evaluated inside validation.

The effective sample size is the number of independent units and outcome events, not the number of rows, image patches, or hourly windows. Millions of pixels from a few hundred patients do not provide millions of independent examples. Keep all records from a patient in one partition. For high-dimensional modalities, external site and temporal validation are essential because device and workflow differences can dominate signals.

Learning curves can show whether validation performance improves with more independent patients or has plateaued. If a model has few events, reduce architecture complexity, limit candidate experiments, and compare with regularized regression or established baselines. Pretraining can help learn representations but does not remove the need for target-specific validation or calibration.

## Worked binary risk model

Suppose a cohort of 2,000 patients has 160 events by 90 days. A dense network predicts probabilities using baseline laboratory and demographic features. The development procedure uses patient-level partitions, fits imputation and scaling within each training fold, and tunes regularization and hidden-layer width in inner folds. A later hospital cohort is reserved for external evaluation.

If 40 patients in that external cohort have predicted risks above 0.20 and 14 experience the event, PPV is 14/40=35%. Sensitivity still requires the total event count. The network’s AUC describes ranking; calibration determines whether a score of 0.20 corresponds to about 20% event frequency. A decision threshold must be justified by the action’s harms and benefits, not selected only to maximize a metric.

~~~r
library(nnet)
fit <- nnet(event ~ age + baseline_score + lab_a + lab_b,
            data = train, size = 5, decay = 0.01,
            maxit = 500, trace = FALSE)
p <- predict(fit, newdata = test, type = "raw")
~~~

This simple R interface is illustrative and may not scale to large or high-dimensional data. It assumes a correctly coded binary outcome and complete predictors. Use a pipeline that prevents preprocessing leakage, groups patients appropriately, and evaluates calibration with independent data. Neural network software differs in architecture, optimization, and defaults, so report package and version.

## Validation, calibration, and clinical utility

A random row split is often inadequate. Use patient-grouped folds for new-patient prediction, temporal splits for future deployment, and site-held-out evaluation for transport. Tune architecture and preprocessing within development folds. If early stopping uses a validation set, reserve a separate final test set. Repeatedly comparing architectures on the same test data converts it into training information.

Report discrimination, calibration, threshold-specific consequences, and uncertainty. Calibration curves, intercept and slope, Brier score, and log loss complement AUC. For rare outcomes, include precision-recall summaries and event counts. Confidence intervals should resample patients or sites, and paired comparisons should use the same cases. A neural network with superior AUC but poor calibration may be unsafe at probability thresholds.

Decision-curve analysis can compare net benefit over plausible thresholds, but assumes an action whose relative benefits and harms are represented by the threshold. Prospective impact evaluation tests whether the complete model-supported workflow improves outcomes. Retrospective validation cannot establish adoption, clinician response, or patient benefit.

## Interpreting model behavior

Weights are distributed across layers and rarely provide a direct clinical explanation. Saliency maps, feature attribution, counterfactuals, and attention visualizations describe aspects of model behavior under method-specific assumptions. They can be unstable, insensitive to model parameters, or misleading when features are correlated. An explanation is not causal evidence.

Use explanation methods to identify possible leakage, spurious image borders, site markers, or unexpected input dependence. Validate findings through targeted data checks and external tests. For images, inspect whether predictions rely on acquisition artifacts; for text, ensure copied templates and post-outcome notes are absent; for time series, check that future measurements do not enter the input window. Explanations should be accompanied by uncertainty and a description of method limits.

## Shift, fairness, and safety

Performance can change when patient mix, prevalence, devices, assays, language, or care pathways shift. Neural networks can be highly confident outside training support. Monitor input distributions, missingness, calibration, and subgroup errors. Define when the model abstains, when human review is required, and how unsupported inputs are handled.

Assess performance across relevant groups with sample sizes and uncertainty. Apparent disparities may reflect differential measurement or label quality, not only architecture. Removing sensitive fields does not remove proxies. Engage affected communities and clinical users in choosing error metrics, actions, and acceptable trade-offs. Consider downstream effects such as alert burden, resource allocation, and denial of care.

Before deployment, freeze model and preprocessing versions, test production parity, establish audit logs, and specify update governance. A new training run is a new model requiring validation. Define triggers for recalibration, evaluation, suspension, or rollback. Human oversight should provide a route to challenge a prediction and investigate a harmful recommendation.

## Reporting and reproducibility

Describe population, index time, outcome and horizon, modality, preprocessing, architecture, parameter choices, optimizer, loss, regularization, stopping rule, tuning, and validation. Report patient and event counts, not only the number of images, visits, or windows. Provide calibration and threshold consequences, subgroup analyses, uncertainty, external validation, and all key comparisons.

Document software versions, random seeds, data provenance, and code. For pretrained models, identify training source, model checkpoint, fine-tuning or prompting procedure, and any licensing limits. Use TRIPOD+AI and PROBAST+AI to support complete reporting and risk-of-bias assessment. Separate technical performance from evidence that using the system improves health.

### Data construction across modalities

For tabular data, categorical encoding, scaling, missing-value handling, and interaction structure need explicit choices. One-hot encoding can create wide sparse vectors; embeddings can learn category representations but require enough examples and may encode site-specific patterns. Missingness indicators can capture test-ordering behavior. Compare neural approaches with simpler models that handle nonlinearities, such as splines and boosted trees, under identical partitions.

For images, the analysis unit is usually the patient or study, not the individual crop or image. Multiple views and scans should remain grouped in validation. Check image orientation, resolution, acquisition device, and preprocessing. A network may learn rulers, text overlays, or institutional marks that correlate with diagnosis. External testing across devices and hospitals is important, and image-level performance should not be mistaken for patient-level performance.

For longitudinal records, define the prediction window and feature availability at each index time. Padding, truncation, irregular intervals, and missing observations alter what the network can learn. A sequence model may infer care intensity from measurement frequency; that pattern can shift when protocols change. Compare against landmark regression or time-series baselines and test prospective timestamps.

For clinical text, preserve whether notes were available before prediction and remove post-outcome or discharge content. De-identification can leave rare phrases that identify people. Language models can reproduce memorized text or produce unsupported answers. Evaluate task-specific errors, hallucination, privacy, and human review rather than relying on generic language benchmarks.

### Uncertainty and ensemble behavior

Neural predictions can vary with random initialization, training sample, and optimization. Repeated seeds or bootstrap refits can show variability, but seed-to-seed spread alone is not a calibrated uncertainty interval. Ensembles may improve accuracy and sometimes reduce variance, at the cost of computation and more complex monitoring. Bayesian approximations and dropout-based uncertainty methods also rely on assumptions and may be miscalibrated under shift.

For decisions, uncertainty should include both outcome uncertainty and uncertainty in model development. A narrow confidence interval around AUC may coexist with large uncertainty for subgroup calibration or a high-risk threshold. Report event counts, interval methods, and the resampling unit. In small samples, avoid fine-grained subgroup claims and plan additional validation.

An abstention policy can flag inputs unlike training data, low-quality images, missing critical variables, or high disagreement among ensemble members. Define what happens next: human specialist review, conventional scoring, or no automated output. Measure how often abstention occurs and for whom; otherwise a safety mechanism can systematically exclude underrepresented patients.

## The role of pretraining and transfer

Pretraining uses a model learned from another task or dataset as initialization or representation. It may reduce the number of target examples needed, particularly for images and language, but source-target mismatch matters. Differences in population, device, label, language, or data pipeline can limit benefit. Report pretraining corpus, objective, selection, licensing, and whether sensitive data were used.

Fine-tuning can overfit a small target cohort. Freeze some layers, use low learning rates, regularize, and compare with training from scratch when feasible. Evaluate all transfer choices within resampling. A model selected because it performs best on an external cohort has used that cohort for selection; obtain another independent assessment.

For foundation models and generative systems, prompting choices and model versions are part of the method. Output can vary across prompts or updates. Use a prespecified test set of representative cases, including safety-critical and rare scenarios. Evaluate completeness, factuality, subgroup performance, privacy, and workflow fit with domain experts. A language model’s fluent explanation is not evidence that its prediction is correct.

## Sample size and experimental discipline

There is no fixed number of observations that makes a neural network safe. Information depends on independent patients, event counts, feature dimensionality, label noise, and intended generalization. Repeated windows or augmented images do not create new independent patients. A model with millions of parameters can be fit with fewer cases under strong pretraining or regularization, but uncertainty and transport still need evidence.

Limit architecture and hyperparameter experiments based on available data. Use learning curves to assess whether added independent patients improve validation. Register primary metrics and splits where possible; report all major model families explored. Reusing a small holdout to choose architecture, preprocessing, threshold, and calibration leads to optimistic performance. Nested validation or a truly locked external dataset is preferable.

Data augmentation can encode plausible invariances, such as image rotation within a clinically valid range. It can also create unrealistic inputs or remove meaningful orientation. Justify augmentations clinically and apply them only to training data. For tabular data, synthetic oversampling may create implausible combinations and does not replace representative validation.

## Model behavior under distribution shift

Covariate shift changes the predictor distribution, while concept shift changes the predictor-outcome relationship; label shift changes outcome prevalence. These categories are useful diagnostics but can co-occur. Monitoring only input histograms can miss changed clinical relationships. Link deployed predictions to outcomes when governance permits and monitor calibration over time.

A model trained during one treatment era may predict outcomes poorly after a new therapy changes baseline risk or disease progression. Recalibrating the intercept may help only if ranking remains stable and outcome definition is consistent. If sensor firmware changes, images are acquired differently, or clinical practices alter missingness, inspect feature meaning and recalibrate or retrain only after appropriate evaluation.

Data drift alerts can be noisy. Define thresholds with domain knowledge and ensure an owner investigates them. Monitor the fraction of cases outside training support, rate of missing predictors, delayed data, and subgroup composition. A safe system should have a tested rollback and a documented route to pause automated recommendations.

## Prospective evaluation and clinical impact

A retrospective test estimates performance under recorded historical data. It does not establish that clinicians can act on predictions in time or that actions improve health. Silent prospective evaluation checks workflow, data latency, and calibration without influencing care. An impact study compares model-supported care with usual practice and measures outcomes, adverse consequences, workload, and equity.

The model’s interface matters: showing a single score, a risk trajectory, uncertainty, or contributing observations can change clinician response. Evaluate usability and automation bias. Users need to know intended scope, contraindications, and when to seek review. A human-in-the-loop design is not automatically safe; measure how often people override the model and whether overrides improve or worsen outcomes.

### Reporting modality-specific evidence

For each modality, report how inputs were constructed and which unit defined the split. Image studies should report patient-level separation, scanners, preprocessing, and image quality exclusions. Sequence studies should report time windows, sampling frequency, padding, and censoring. Text studies should report note timing, de-identification, prompting or fine-tuning, and output review. Tabular studies should state coding, missingness, and scaling.

Provide external validation on populations and acquisition settings that reflect intended use. Report subgroup calibration and error with uncertainty. Describe the model version, weights or checkpoint, dependencies, and preprocessing so results can be reproduced. State whether a model is a research prototype, silent tool, decision support, or autonomous system. These are different evidence claims.

## Interpreting benefit and harm

A model may shift workload rather than improve outcome. For a deterioration alert, relevant outcomes include time to review, unnecessary testing, missed escalation, staff burden, and patient harm. For image triage, quantify delayed cases and false urgent flags. For text-generation support, measure factual errors, omissions, privacy exposures, and downstream decisions. Choose outcomes with clinicians and patients before implementation.

A decision curve can summarize expected net benefit under threshold assumptions, but does not replace impact evaluation. Costs and harms may differ by subgroup, institution, and available care. A model that increases average efficiency while worsening access for a small group may be unacceptable. Governance should provide routes to appeal, investigate, and correct errors.

## Updating and retiring models

Every model update changes the evidence object. Changes to weights, preprocessing, prompts, software library, threshold, or input source may change behavior. Version the complete pipeline and evaluate changes before deployment. Maintain a rollback option and document who authorizes release.

Retire or restrict a model if calibration collapses, data feeds become unreliable, a safer alternative emerges, or the supported action is no longer available. Continued use is not justified by historical validation alone. Monitor implementation outcomes and reassess whether the original decision problem remains relevant.

## References and further reading

- Goodfellow I, Bengio Y, Courville A. *Deep Learning*. MIT Press; 2016.
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378).
- Moons KGM, Damen JAA, Kaul T, et al. PROBAST+AI. *BMJ*. 2025;388:e082505. [doi:10.1136/bmj-2024-082505](https://doi.org/10.1136/bmj-2024-082505).
- See [Multilayer perceptrons](multilayer-perceptrons.html) for dense networks and [Convolutional neural networks](convolutional-neural-networks.html) for image models.
