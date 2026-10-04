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


## From affine layers to a fitted risk function

An MLP with one hidden layer maps x to p(y=1|x)=sigmoid(b_0+sum_h v_h*phi(b_h+w_h^T x)). The activation phi supplies nonlinearity; without it, stacked affine layers collapse to one affine model. For multiple classes, the output commonly uses softmax. Training minimizes an objective such as binary cross-entropy plus a penalty on weights. Backpropagation computes gradients through the layers, and stochastic optimization updates weights in mini-batches. Width and depth increase representational flexibility, while weight decay, dropout, early stopping, and augmentation can regularize.

Scaling numeric predictors helps optimization; categorical encoding, rare levels, nonlinear transforms, and missingness indicators need deliberate treatment. For tabular health data, neural nets do not automatically exploit feature structure and may lose to boosted trees or penalized regression, especially with limited events. The independent sample size is patients, not the number of repeated encounters. Architecture selection, random seeds, and preprocessing all consume validation information.

```r
# Minimal torch sketch for already prepared numeric matrices and binary labels.
library(torch)
net <- nn_module(
  initialize = function(p) {
    self$fc1 <- nn_linear(p, 16); self$drop <- nn_dropout(.2)
    self$out <- nn_linear(16, 1)
  },
  forward = function(x) self$out(self$drop(torch_relu(self$fc1(x))))
)
model <- net(ncol(X_train))
opt <- optim_adam(model$parameters, lr = 1e-3, weight_decay = 1e-4)
# Train with mini-batches; monitor a development fold for stopping.
# Use logits with binary_cross_entropy_with_logits for numerical stability.
```

The snippet intentionally omits a full training loop because batching, device, and stopping strategy depend on dataset size. In each epoch calculate training loss and development loss; stop based on a prespecified patience rule, restore the best epoch, and never inspect final test outcomes during this choice. Repeat fitting across seeds or bootstrap samples to characterize variability. Evaluate calibration because cross-entropy optimization does not ensure transportable calibration. If class weighting or oversampling is used, explain how it changes the effective prior and assess probabilities on data with target prevalence.


## Development workflow: from question to a defensible model

A model is meaningful only after the prediction problem has been made precise. State the eligible population, prediction index time, outcome definition, prediction horizon, and intended action. For example, “predict deterioration” is incomplete: a usable specification says which patients, what counts as deterioration, when prediction occurs, and how far ahead it should signal. Predictors must be available at that index time. Variables entered later may encode the outcome or the clinical response to it. This is temporal leakage even if the data table contains no obvious duplicate column.

Choose the independent unit to match deployment. If the system will predict for new patients, every record from a patient belongs to one partition. If it will predict future cases at an existing hospital, a chronological split is often more informative than a random split. If use at a new hospital is intended, retain site-level external validation. Confidence intervals and effective sample size should reflect clustering by patient or site; thousands of rows do not imply thousands of independent people.

Keep every data-adaptive step inside resampling: imputation, scaling, feature filtering, encoding, dimension reduction, class rebalancing, and hyperparameter selection. A typical nested workflow uses inner folds to choose settings and outer folds to estimate the performance of that entire selection process. A separate temporal or external test cohort, if available, should be used once after choices are frozen. Repeatedly checking its results turns it into development data. Report the number of patients and outcomes in each split, not only the row count.

Use metrics tied to the intended decision. Discrimination measures ranking; for a binary outcome, ROC AUC is the probability that a randomly selected case receives a higher score than a randomly selected non-case. It does not assess absolute risk. Calibration compares predicted and observed risks, using calibration-in-the-large, slope, and plots with uncertainty. At a chosen operating point, show sensitivity, specificity, positive predictive value, negative predictive value, and the proportion flagged. Precision-recall summaries can be informative when events are uncommon. For time-to-event outcomes, account for censoring rather than labeling patients event-free before adequate follow-up. Decision-curve analysis or a prospective impact study is needed to connect predictions to clinical net benefit.

A compact R pattern for a binary outcome illustrates the separation between fitting, discrimination, and calibration. It presumes `dat` has one row per patient, a 0/1 `event`, and predictors fixed before the prediction time. The split is only illustrative; repeated patients, sites, or calendar time require grouped or temporal partitions. The final test set must not be used to tune the model.

```r
set.seed(41)
i <- sample(seq_len(nrow(dat)), floor(.8 * nrow(dat)))
train <- dat[i, ]; test <- dat[-i, ]
fit <- glm(event ~ age + prior_admissions + severity,
           data = train, family = binomial())
p <- predict(fit, newdata = test, type = "response")
# Calibration-in-the-large: intercept ideally 0 when slope fixed at 1
cal0 <- glm(test$event ~ 1, offset = qlogis(p), family = binomial())
# Calibration slope: ideally 1; assess uncertainty, not only point estimate
cals <- glm(test$event ~ qlogis(p), family = binomial())
coef(cal0); coef(cals)
```

The code does not replace internal validation or uncertainty intervals. A small event count can make both performance and calibration estimates unstable. Bootstrap at the patient level or repeat appropriately grouped resampling, and report intervals. When transporting a model, compare outcome prevalence, predictor distributions, measurement practice, and label ascertainment; recalibration of the intercept can address a prevalence shift under restrictive conditions, but cannot repair changed predictor effects or systematic measurement errors.

For a clinical prediction report, document the cohort flow, missingness, feature timing, model specification, tuning procedure, split unit, and evaluation population. TRIPOD+AI provides a reporting framework. PROBAST+AI can help assess risk of bias and applicability. Neither checklist certifies clinical usefulness. A retrospective prediction model still requires prospective evaluation of workflow, alert burden, clinician response, and patient outcomes before claims of benefit.


## Full worked analysis: a fixed-horizon mortality model

Suppose 4,000 patients have 200 deaths by 30 days, and 20 candidate baseline variables are measured at admission. A valid analysis first establishes that every predictor is available at the admission prediction time and that outcome follow-up is complete enough to classify the binary target. If discharge timing varies, define whether the intended target is death within 30 days of admission or discharge. Randomly splitting encounters can leak repeated patients; split at patient level, and reserve a later period if future performance is the goal.

With 200 events, compare penalized logistic regression, a tree ensemble, and an MLP using identical outer folds. The MLP’s number of hidden units, depth, dropout, weight decay, learning rate, and stopping epoch are hyperparameters. Tune them in inner folds, preferably with a modest search motivated by sample size. Track each fold and seed: a single lucky initialization can mislead. Use class weights cautiously; they alter the optimization target and may compromise probability scale. Evaluate discrimination, Brier score, calibration-in-the-large, calibration slope, and clinically chosen threshold metrics on outer or untouched data.

```r
library(torch)
# Xtr is a training-fold standardized numeric matrix; ytr is 0/1.
model <- nn_sequential(
  nn_linear(ncol(Xtr), 16), nn_relu(), nn_dropout(.2),
  nn_linear(16, 1)
)
opt <- optim_adam(model$parameters, lr=1e-3, weight_decay=1e-4)
xb <- torch_tensor(Xtr, dtype=torch_float())
yb <- torch_tensor(matrix(ytr, ncol=1), dtype=torch_float())
for (epoch in 1:100) {
  model$train(); opt$zero_grad()
  logits <- model(xb)
  loss <- nnf_binary_cross_entropy_with_logits(logits, yb)
  loss$backward(); opt$step()
  # In real use, evaluate development loss and early-stop, then restore best epoch.
}
```

The snippet demonstrates logits and numerically stable binary cross-entropy but omits batching and validation for brevity. Avoid feeding the whole dataset in every update for large cohorts. Save the training recipe, factor encodings, random seeds, package versions, and selected epoch. Interpret input attributions only as model dependence; correlated predictors can share or exchange attribution. Validate whether any apparent benefit over regression persists in an independent population and whether recalibration repairs absolute risk without hiding subgroup failures.


## Architecture selection and probability calibration

A practical search begins with a linear model, then one modest hidden layer and limited width/depth. Increase capacity only if nested validation shows stable improvement. Batch normalization can stabilize optimization but interacts with small batch sizes; dropout is applied during training and disabled during evaluation. Weight decay penalizes large weights, but the penalty’s scale depends on predictor normalization. Early stopping selects an effective complexity through the number of updates. Report all of these choices, not merely “a neural network was trained.”

If output risks are too extreme, temperature scaling or logistic recalibration can improve calibration with relatively few parameters, but calibration data must be representative and separate from final evaluation. Isotonic regression is more flexible and needs more data. Assess subgroup calibration as well as average calibration: perfect overall calibration can coexist with systematic overprediction for one group and underprediction for another. Any recalibration changes the deployed model and should itself be versioned and validated.

Feature attribution for an MLP depends on the background population, feature correlations, and chosen method. Permutation can create implausible combinations; gradient saliency may vary sharply with small input perturbations. Use attributions as hypotheses about model behavior, then conduct targeted stress tests. Avoid reporting a single ranked list as a biological discovery. For a modest tabular cohort, transparent regression can be preferable when its calibration and utility are comparable and its maintenance burden is lower.


## Data volume, event counts, and model stability

There is no universal patients-per-parameter rule for an MLP because effective capacity depends on regularization, feature redundancy, outcome prevalence, and optimization. Still, event scarcity limits how reliably the model can learn rare-outcome patterns. With 100 events and 20 candidate predictors, even a modest network can have many adjustable weights relative to independent outcome information. Learning curves, shrinkage or regularization, and nested validation provide more useful evidence than a simple parameter count. If external performance varies widely across seeds or folds, that instability is itself an important result.

For small tabular cohorts, compare a penalized generalized linear model and boosted trees; for larger structured data, test whether a network’s representation adds value. Keep training and tuning budgets comparable and report computational cost. Do not infer that a model is superior because its training loss is lower. Present uncertainty intervals around performance and calibration, including subgroup uncertainty. A bootstrap must resample patients, preserving all their records together.

If using an MLP for repeated measurements, summarize trajectories only if the summary preserves the intended signal; otherwise use a sequence architecture with time handling. If using images or text, a dense network over flattened inputs ignores structure and may be inefficient. Architecture should match the observation process. Report tensor construction and missingness masks because these choices can be as consequential as the number of layers.


## A more complete leakage-safe training recipe

The central analytic object is not only the network but also the recipe that converts raw records into tensors. For a numeric tabular model, estimate imputation values and centering/scaling constants in the training fold. Encode categorical levels using training data and define handling for unseen levels. Keep person-level partitions fixed before any resampling. In each inner fold, refit the full preprocessing pipeline and network; outer held-out folds estimate performance after selection. A single random train/test split can be unstable with few events, so use repeated grouped validation and retain a truly external cohort if available.

Training curves should include both loss and a decision-relevant metric. If training loss falls while validation loss rises, the network is overfitting; early stopping selects a checkpoint based on development data. A noisy validation curve suggests too little data for aggressive architecture selection. Use a learning-rate schedule or gradient clipping only when justified, and record these as part of the model. Establish a simple reproducible baseline and compare paired predictions on the same outer folds.

For binary outcomes, choose class weighting only after considering the target. Weighting makes errors in one class cost more during training, but the minimizer no longer generally estimates the original population probability. The model may still rank patients well; threshold selection and calibration are separate. Evaluate with a representative test prevalence and report absolute risks, not just class labels. A posterior output of .4 is not itself a recommendation; the intervention threshold is a decision problem involving harms, benefits, and capacity.

Finally, present a model card with intended use, exclusions, data windows, architecture, preprocessing, tuning, calibration, subgroup evidence, limitations, and update policy. Clinical collaborators should review failure cases before a workflow claim is made. Ensure the model’s inputs can be produced at the required time and that units and missing-value conventions are stable. A neural model cannot compensate for an unreliable data pipeline.


## Diagnostics for model behavior

Inspect predictions across risk strata and input ranges. Plot predicted probability against observed outcome frequency, display a rug or histogram of predictions, and examine calibration slope. In a small cohort, quantile groups can contain few events and produce jagged calibration curves; smooth curves should be shown with uncertainty and not overinterpreted. Check whether extreme scores occur for patients far outside the training distribution. Neural networks can produce extreme probabilities for unusual inputs without an explicit warning.

Probe sensitivity to plausible changes. If a one-unit change in a laboratory value causes a large score jump, check units, scaling, and nonlinear response. Permutation or ablation of a predictor can reveal reliance but correlated features may compensate. Counterfactual explanations can propose impossible combinations, such as changing age while holding age-dependent variables fixed. Use clinical review to identify implausibility, and state that explanation methods describe fitted behavior rather than biological mechanisms.

For small datasets, repeated nested validation may be computationally costly, but reducing leakage safeguards is not a sound compromise. Use a modest, prespecified architecture search; save folds and random seeds; exploit parallelism without allowing test outcomes to guide development. If all folds yield wide uncertainty, report that evidence is insufficient to establish a stable gain. An honest negative comparison against simpler regression can be more useful than a highly optimized score from an underpowered cohort.


## Reporting results for clinical readers

Describe the target and index time before the architecture. Give patient and event counts, split logic, missingness, preprocessing, tuning search, stopping rule, software, and uncertainty. Report paired performance against the benchmark, including calibration and threshold metrics. Show representative errors and assess whether the input pipeline can run at the intended time. Avoid the phrase “black box” as a substitute for evaluation: explain which model behaviors were tested, which could not be interpreted, and how users should respond to uncertain or out-of-range predictions.


## Calibration and operating thresholds

Select a threshold using development data and an explicit benefit-harm or capacity rationale. Report threshold-specific errors on an untouched cohort. Recalibration may adjust probability scale but should not conceal subgroup miscalibration. If predicted risks are communicated to patients or clinicians, validate them at the deployment prevalence and state the uncertainty around each aggregate calibration estimate.


Retain the selected preprocessing recipe and checkpoint with the model artifact. This ensures future predictions use the same variable ordering, scales, category mapping, and missing-value conventions as the evaluated model.


The final selected network should be evaluated only after preprocessing and calibration are fixed.

## References and further reading

- Moons KGM, Damen JAA, Kaul T, et al. PROBAST+AI: an updated quality, risk of bias, and applicability assessment tool for prediction models using regression or artificial intelligence methods. *BMJ*. 2025;388:e082505. [doi:10.1136/bmj-2024-082505](https://doi.org/10.1136/bmj-2024-082505)
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378)
- LeCun Y, Bengio Y, Hinton G. Deep learning. *Nature*. 2015;521:436–444. [doi:10.1038/nature14539](https://doi.org/10.1038/nature14539)
- Van Calster B, McLernon DJ, van Smeden M, Wynants L, Steyerberg EW. Calibration: the Achilles heel of predictive analytics. *BMC Medicine*. 2019;17:230. [doi:10.1186/s12916-019-1466-7](https://doi.org/10.1186/s12916-019-1466-7)
