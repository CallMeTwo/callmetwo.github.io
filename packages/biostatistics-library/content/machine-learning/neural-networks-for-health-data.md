---
title: Neural networks for health data
summary: The shared concepts behind neural networks and deep learning, with guidance on when added model flexibility is justified.
---

## Overview and key ideas

A neural network composes simple mathematical units into layers. Each unit combines inputs using learned weights and a bias, applies a nonlinear activation, and passes a representation onward. Training adjusts weights to reduce a specified loss, commonly by gradient-based optimization and backpropagation. Multiple learned layers can represent complex patterns; “deep learning” generally refers to networks with multiple representation layers.

Architecture should match data structure. A **multilayer perceptron (MLP)** handles fixed-size feature vectors; **convolutional neural networks (CNNs)** exploit local spatial structure such as images; **recurrent neural networks (RNNs)** process sequences; **Transformers** use attention to relate sequence elements. These are modeling choices, not guarantees of better performance. See the specific articles on [MLPs](multilayer-perceptrons.html), [CNNs](convolutional-neural-networks.html), [RNNs](recurrent-neural-networks.html), and [Transformers](transformers-for-health-data.html).

## When to use it

Neural networks are plausible when data are large or structured and the task benefits from learned representations, such as image segmentation, waveform classification, or text extraction. For modest tabular cohorts, regularized regression and tree ensembles are strong comparisons and may be easier to validate. A network should be chosen because it addresses a data or task need, not because it is labeled AI.

## Assumptions and limitations

- Training requires enough informative examples relative to model flexibility. Parameter count alone does not determine sample needs; outcome prevalence, label noise, patient clustering, and distribution shift matter.
- Optimization can be sensitive to initialization, architecture, regularization, and random seed. Repeated experiments and tuning consume information; preserve an untouched evaluation set.
- Inputs require representation choices, normalization, and missing-data handling. Learn all data-dependent preprocessing on training partitions only.
- Networks can be poorly calibrated and can perform unevenly across subgroups. Evaluate both, and examine data quality and label construction.
- Saliency maps or attention weights are not automatically faithful explanations or causal evidence. Model behavior and clinical mechanism are different questions.
- Deployment adds risks from software changes, data pipelines, and workflow. A retrospective metric alone cannot demonstrate patient benefit.

## Worked example

A hospital wants to classify 12-lead ECG windows as atrial fibrillation or no atrial fibrillation. The unit of partition must be the patient, not the ECG window, so repeated ECGs do not occur in both training and test sets. If 1,000 independent test patients include 100 with atrial fibrillation and the model identifies 80 of them, sensitivity is 80/100 = 80%. If it also flags 180 of 900 patients without atrial fibrillation, specificity is 720/900 = 80%, and positive predictive value is 80/(80+180) ≈ 30.8%. This illustrates prevalence effects: at a lower prevalence, most positive alerts may be false positives despite 80% sensitivity and specificity. External testing at another hospital and calibration checks are needed before use.

## Interpretation and common pitfalls

- Define a simple benchmark and compare fairly using the same patient-level splits and preprocessing.
- Report the full data pipeline, architecture, tuning, software, and uncertainty; follow [TRIPOD+AI](https://doi.org/10.1136/bmj-2023-078378) for clinical prediction reporting.
- Evaluate external transport, calibration, subgroup performance, and operational consequences, not only a random internal test split.
- Beware of shortcuts such as image markers, hospital-specific acquisition signatures, or labels generated from downstream decisions.
- A neural network that predicts outcome accurately does not estimate the effect of changing treatment. Use causal designs and assumptions for causal questions.


## Mathematical foundation and design choices

A feed-forward network composes transformations h_l=phi_l(W_l h_(l-1)+b_l), with h_0=x. The final layer maps the learned representation to a prediction; sigmoid yields a binary probability and softmax yields a multiclass probability vector. A loss (for example, cross-entropy) measures fit, and a penalty can constrain weights. Backpropagation applies the chain rule to compute gradients. Optimization finds parameters that reduce empirical loss, not necessarily a unique or causal representation. Non-convex optimization makes initialization and seed relevant, although modern training often yields similar predictive behavior across some solutions.

Architecture encodes assumptions: convolutions favor local patterns and weight sharing; recurrence summarizes an ordered stream; attention permits content-dependent interactions among positions; dense layers treat input dimensions as a vector. These inductive biases can improve sample efficiency when aligned with the data and mislead when structure is wrong. Transfer learning supplies parameters learned elsewhere, but population, label, and acquisition mismatch can defeat transfer. Fine-tuning and model selection still require leakage-safe validation.

```r
# Binary loss for logits z and binary outcome y, shown mathematically in R:
log1pexp <- function(z) pmax(z, 0) + log1p(exp(-abs(z)))
bce <- function(y, z) mean(log1pexp(z) - y * z)
# A network should be compared against a prespecified simpler benchmark.
```

Cross-entropy is a proper scoring rule in expectation: it rewards honest probabilities when evaluated on the target distribution. Optimization on a finite, selected cohort does not guarantee calibration in new data. Track loss by epoch, use regularization and early stopping based only on development folds, and evaluate calibration externally. For imaging, report patient-level partitions and acquisition conditions; for sequences, define time windows and censoring; for text, state note availability and prevent copied notes from crossing partitions. Explain the full pipeline, including preprocessing and pretrained weights, rather than only the layer diagram.


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


## Training, uncertainty, and translation across modalities

The empirical objective is a sample average, such as L(theta)=-(1/n)sum_i[y_i log(p_i)+(1-y_i)log(1-p_i)]+lambda*||theta||^2. Mini-batch gradients are noisy estimates of the full gradient. Learning rate, batch size, optimizer, initialization, normalization, and weight decay interact; a training-loss decrease alone is insufficient because flexible networks can memorize labels. Early stopping, dropout, augmentation, and weight penalties are regularization choices that must be selected without using final-test outcomes. A fixed number of epochs chosen after looking at test loss is test-set tuning.

For repeated clinical records, uncertainty should be assessed at the patient rather than row level. Bootstrap or repeated grouped cross-validation can reveal instability from sampling and model fitting, though it cannot cover shifts absent from the data. Ensembles across seeds may improve stability but increase compute and do not remove shared bias. For transferred models, freeze versus fine-tune is a substantive choice: full fine-tuning can adapt strongly but overfit small cohorts; freezing early layers reduces parameters but may preserve incompatible acquisition features. Compare these strategies on nested development data.

A complete model card should specify intended users and population, exclusions, inputs, timing, target, known failure modes, performance by setting and subgroup, calibration, uncertainty, and monitoring. If the system produces a score, determine who sees it and what action follows. Retrospective utility can be misleading if clinicians respond to scores during data collection or if treatment changes the outcome used as the label. Prospective evaluation may need a silent phase followed by an impact design. Resource-use, false-alert consequences, and unequal access are part of validity, not post-deployment decoration.


## Reproducibility, governance, and model lifecycle

A neural network artifact includes learned weights, input order, units, encoders, normalization constants, missingness handling, software libraries, hardware behavior, and thresholds. Saving weights alone is not sufficient. Create deterministic preprocessing tests and retain a versioned reference set for reproducibility. Numerical differences across libraries or accelerators may be small but can move patients near decision thresholds; assess this explicitly if the action is discontinuous.

External validation should test the complete pipeline in populations that differ meaningfully in site, time, equipment, language, or care pathway. Report uncertainty and the number of events by subgroup; a subgroup with ten events cannot support a precise claim of equal performance. Do not use a non-significant interaction test as proof of fairness. Investigate differences in calibration, sensitivity, false-positive burden, and access to follow-up actions. If a model is updated, evaluate the new version prospectively and preserve the ability to roll back.

Retrospective AUC does not show that a neural-network intervention improves outcomes. A silent prospective phase estimates real-time data quality and workload without influencing care. A subsequent randomized, stepped-wedge, or carefully controlled implementation evaluation can estimate impact, depending on feasibility and contamination. Measure unintended effects such as alert fatigue, delayed care, or disparities in access. Governance should assign responsibility for drift monitoring, incident review, and retirement; these operational details are part of the model’s validity in use.


## Sample size, shift, and claims of benefit

Neural networks can be data hungry, but raw sample count is not enough: repeated images, tiles, ECG segments, or visits from one person are correlated. Effective information depends on independent patients, event count, label quality, diversity of sites and devices, and representation of important subgroups. Randomly splitting image tiles can create thousands of nominal examples while testing on near-duplicates. Split at the patient or higher unit matching the intended transport claim.

A model can perform well under internal validation and fail under temporal, geographic, or technical shift. Use external validation that reflects deployment and identify whether the shift involves prevalence, acquisition, predictor distributions, or outcome definitions. Recalibration may correct a changed baseline event rate but cannot fix new image artifacts, shifted coding, or altered predictor effects. Monitor failures and maintain a route to human review or fallback. Prospective impact evaluation is required to claim that model-assisted care improves outcomes; good retrospective discrimination is not sufficient.

Communicate the exact intended use: decision support, prioritization, automation, or research triage. Define the action and harm of an incorrect output. A network used to prioritize specialist review should be assessed for queue effects and delayed care among people not prioritized. A segmentation tool should be assessed for editing time and clinically important omissions. These outcomes may require workflow experiments rather than more retrospective model metrics.


## Model selection and communicating evidence

The choice among MLP, CNN, RNN, and Transformer should follow the form of the data and the independent sample available. A CNN encodes local spatial structure; an RNN encodes sequential updating; a Transformer uses attention over positions; an MLP assumes a fixed vector input. None is universally best. In multimodal work, simple late fusion (fit modality-specific representations and combine them) may be easier to validate than a single large network. Missing modalities need explicit handling because availability can be associated with severity or access.

A fair comparison fixes the target, patient split, and evaluation metrics, then gives each approach an appropriate but documented tuning budget. Compare against standard clinical predictors and established scores where relevant. Report paired differences with uncertainty, not only which model has the largest point estimate. If the best model changes substantially across folds or seeds, state that selection instability. Complexity has costs in compute, maintenance, latency, and auditability; a small gain may not justify these costs.

For a risk model, separate discrimination, calibration, threshold performance, and clinical utility. Calibration-in-the-large assesses mean risk bias; the calibration slope assesses whether predictions are too extreme or too moderate. AUC can remain unchanged after recalibration even as absolute probabilities become much more useful. Decision curves evaluate net benefit across threshold probabilities, but depend on whether the threshold represents a plausible clinical trade-off. Prospective evaluation is required to establish impact.

Communication should avoid anthropomorphic claims that a network “understands” a scan or chart. It estimates patterns under a training distribution and objective. Explain what evidence supports the claimed use, what populations were tested, and what failure modes remain. Provide a clear fallback when inputs are missing, corrupted, or outside the validated range.


## Reporting a reproducible model and meaningful comparison

To reproduce a neural model, report input construction, tensor shapes, units, normalization, missingness masks, architecture, loss, optimizer, learning-rate schedule, batch size, epoch selection, regularization, augmentation, hardware, software versions, and random seeds. For pretrained systems, give source model and weights, pretraining domain where known, fine-tuning data, and layer-freezing strategy. A diagram of layers without preprocessing is not a reproducible method. Preserve the inference code and a small set of permitted test examples for regression testing.

Model comparisons should use paired predictions on identical held-out patients. Compare absolute performance and uncertainty, such as the bootstrap distribution of difference in AUC or Brier score. If outcomes are rare, confidence intervals may be broad even in large datasets. Report subgroup denominators and do not treat a non-significant subgroup difference as proof of parity. Calibration and threshold-specific error burden may differ even when subgroup AUC is similar.

Communicate results in terms of intended clinical decisions: how many people are flagged, what follow-up occurs, how many true cases are identified, and what adverse consequences may follow. If the model changes care, outcomes under deployment will differ from historical labels. Monitoring therefore needs both statistical performance and workflow measures, and impact claims require a prospective comparison. Maintain governance for retraining, approval, and version retirement.


## A minimum evidence statement

A useful conclusion separates four claims: the model learned a signal in development data; it predicts in an independent population; its risks or outputs are calibrated for the intended use; and using it improves decisions or health. Each needs different evidence. Report which claims are supported and where. Do not infer clinical readiness from a single random split, explanation plot, or benchmark score. State the limits of population, modality, outcome definition, and workflow, and identify what prospective evidence is still required.


## Maintenance after release

Record expected input ranges, software dependencies, acceptable latency, and the contact responsible for reviewing drift. Monitor outcome labels when they mature and distinguish data-quality incidents from genuine performance change. Retraining creates a new model version and requires renewed evaluation; silent updates undermine reproducibility and may change care unevenly across groups.


State clearly whether a reported result comes from internal resampling, temporal validation, independent external validation, prospective feasibility, or an impact evaluation. Readers should not have to infer the evidence stage from the methods section.


Avoid claims beyond the modality, population, and workflow actually represented in evaluation.


A comparison should report the baseline result and paired difference, not just the neural network’s standalone score. This helps establish whether its added complexity produced meaningful predictive or clinical value.


Where there is no reproducible gain, favor the simpler validated alternative.


Maintain a complete record of the inference pipeline.

## References and further reading

- Moons KGM, Damen JAA, Kaul T, et al. PROBAST+AI: an updated quality, risk of bias, and applicability assessment tool for prediction models using regression or artificial intelligence methods. *BMJ*. 2025;388:e082505. [doi:10.1136/bmj-2024-082505](https://doi.org/10.1136/bmj-2024-082505)
- LeCun Y, Bengio Y, Hinton G. Deep learning. *Nature*. 2015;521:436–444. [doi:10.1038/nature14539](https://doi.org/10.1038/nature14539)
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378)
