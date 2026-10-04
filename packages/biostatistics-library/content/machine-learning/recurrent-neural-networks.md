---
title: Recurrent neural networks
summary: How recurrent models process ordered clinical events and signals, and why time-aware validation and missingness handling matter.
---

## Overview

Recurrent neural networks (RNNs) process ordered inputs by updating a hidden state as each time step arrives. This state summarizes part of the preceding sequence and informs the next prediction. Gated variants such as long short-term memory (LSTM) and gated recurrent units (GRU) control how information is retained or forgotten. They are useful for longitudinal records, waveforms, and other sequences, but require careful construction of time, outcome, and prediction windows.

An RNN does not inherently understand clinical chronology or causality. It learns from the supplied order, timestamps, and labels. A model predicting deterioration can exploit measurement frequency, treatment responses, or post-event documentation unless these are excluded. Define exactly when the prediction is made and what information is available at that moment.

## State updates and gating

A simple RNN updates hidden state h_t from current input x_t and previous state h_(t−1), for example h_t=tanh(W_x x_t + W_h h_(t−1)+b). The output can use h_t to predict a current or future outcome. Backpropagation through time computes gradients across sequence steps. Long sequences can lead to vanishing or exploding gradients, making early information difficult to learn.

LSTM and GRU units introduce gates that regulate information flow. An LSTM has input, forget, and output gates plus a cell state; a GRU combines some gating operations into a more compact form. These mechanisms can improve learning over longer sequences but do not guarantee that the model captures clinically meaningful temporal patterns. Sequence length, missingness, and data density still matter.

Prediction can be many-to-one (use a full history to predict one outcome), many-to-many (predict at each time), or sequence generation. These setups imply different estimands. For dynamic risk, each prediction time defines a landmark and horizon; repeated landmarks from one patient are correlated. For forecasting a waveform, temporal resolution and signal preprocessing become central.

## Constructing the sequence without leakage

Define the index time and prediction horizon. If the task is to alert for deterioration in the next six hours, features must be recorded before each hourly index, and outcomes must be defined after it. A treatment given in response to early deterioration may be available before the recorded event but could encode clinician suspicion. Whether it belongs in the input depends on intended use and whether the system is meant to reproduce or improve current care.

Irregular clinical measurements are not equally spaced. Padding a sequence to a fixed length, carrying values forward, adding time-gap indicators, or resampling to regular intervals each imposes assumptions. Measurement frequency can itself reflect severity and clinician behavior. Compare models with and without measurement-process features and assess transport when protocols differ.

Repeated observations require patient-level partitioning. If hourly windows from one patient appear in both training and test, shared physiology and care patterns inflate performance. For future use, use time-based validation; for new hospitals, hold out sites. For survival targets, account for censoring and competing events. A row labeled “no event” must have sufficient follow-up for the horizon.

### Worked six-hour alert example

Suppose an RNN predicts whether a ward patient will require emergency respiratory support within six hours, using the prior 24 hours of vital signs and laboratory results at hourly update times. The dataset has 1,200 patients and 96 events, but 20,000 hourly windows. The independent outcome information is closer to the patient and event counts than to the window count. Split by patient and reserve a later calendar period.

If the model assigns risk 0.25 to a window, it should correspond to about a 25% event frequency among similar windows in representative validation data. At a 0.20 threshold, suppose 50 of 1,000 windows are flagged and 15 precede an event. The PPV is 30%; if 60 total events occur, sensitivity is 25%. Alert burden should also be summarized per patient-day, because one person may trigger repeated alerts.

~~~r
# Pseudocode-style Keras example; seq_train is a padded 3-D tensor.
library(keras)
model <- keras_model_sequential() |>
  layer_masking(mask_value = 0) |>
  layer_lstm(units = 32, dropout = 0.2) |>
  layer_dense(units = 1, activation = "sigmoid")
model |> compile(optimizer = "adam", loss = "binary_crossentropy",
                 metrics = list("AUC"))
~~~

This is a minimal architecture example, not a validated workflow. Padding value and masks must be handled correctly; zeros may be valid clinical measurements. Build splits by patient before window generation or ensure patient grouping throughout. Fit imputation, scaling, and any resampling using training patients only. Evaluate calibration and alert workload on a locked cohort.

## Baselines, sequence representations, and uncertainty

Compare an RNN with static logistic regression, landmark models using summary features, and simpler time-series methods. A model may gain little from sequence architecture if recent values, slopes, and variability summaries capture the signal. Conversely, temporal order may matter for medication or vital-sign trajectories. Ablation can test whether the model uses sequence ordering, but all experiments must be reported to avoid selective claims.

CNNs over time-series can capture local temporal motifs; transformers can represent long-range interactions; hidden Markov or state-space models offer structured temporal assumptions. Model choice depends on sequence length, sample size, irregularity, interpretability, and computation. Benchmarks should use equivalent patient and temporal splits.

RNN predictions can vary with initialization and sequence truncation. Bootstrap patients, repeat seeds, and quantify variation at patient-level outcomes. For dynamic predictions, summarize discrimination and calibration by landmark time and horizon. A single pooled metric can conceal poor performance early or late in follow-up.

### Censoring, competing risks, and recurrent events

For time-to-event prediction, censoring means event status beyond last follow-up is unknown, not event-free. A binary six-hour target can label a patient negative only if follow-up covers the full horizon or censoring is handled appropriately. In-hospital discharge may end observable follow-up but also alter risk. Death can preclude a nonfatal deterioration event. Define whether the target is cause-specific hazard, cumulative incidence, or a composite.

Repeated landmarks create overlapping windows. A patient may contribute many negative windows and one positive window, which can overwhelm training and distort the objective. Use sampling or weighting carefully, and evaluate at the intended decision frequency. Confidence intervals must account for within-patient dependence. Report event counts by patient and by prediction window.

If the system triggers interventions that change outcomes, observed labels are affected by prior care. The model can learn that high-risk patients who received effective treatment did not experience the event, making their untreated risk hard to estimate. This is a causal feedback issue. Retrospective prediction of observed outcomes does not automatically estimate counterfactual risk absent action.

## Diagnostics for temporal behavior

Inspect performance by sequence length, missingness, time since last measurement, and measurement density. Test whether predictions are dominated by last observed values or by missingness patterns. Perturb timestamps or remove post-index records to detect leakage. Evaluate sequences with clinically plausible missingness and irregular timing.

For vital-sign models, ensure units and device calibration are consistent. For waveform models, report sampling frequency, filtering, window size, and artifact rejection. For EHR sequences, describe code grouping, timestamps, and event ordering. A timestamp entered retrospectively can make a feature appear available before it actually was.

Explanations for RNNs include saliency over time, feature perturbation, and attention weights where architectures include attention. These methods may be unstable and do not identify causal time points. Validate explanations against known data generation and controlled perturbations. A temporal heat map is not proof that the model recognized disease progression.

## Thresholds, fairness, and clinical use

Choose the alert threshold based on missed-event harms, false-alarm burden, and available response capacity. Report sensitivity, PPV, alerts per patient-day, repeated alerts, and time gained before an event. Compare with usual observation schedules and current early warning scores. Decision curves may help explore thresholds but require calibrated risk and plausible consequences.

Assess performance across demographic groups, wards, hospitals, and data completeness patterns. Measurement frequency and sensor quality may differ by group or location. The model may systematically alert more for patients with intensive monitoring, or underpredict those whose vital signs are measured less often. Monitor action rates and downstream access, not only score metrics.

Deployment needs latency guarantees, handling of missing streams, escalation paths, and human oversight. Run silently first to verify sequences and timestamps. Monitor calibration, alert volume, input drift, and outcomes. Define conditions for abstention, recalibration, retraining, suspension, or rollback. A model update is a new system version requiring validation.

## Reporting a sequence model

Report target, index times, horizon, input look-back window, sequence length, sampling frequency, missingness and padding, architecture, hidden units, optimization, tuning, and stopping. Describe patient-level and temporal split design, window counts and patient/event counts, and external sites. Provide calibration, discrimination, threshold consequences, uncertainty, subgroup results, and error analysis.

Explain whether the model produces one prediction per patient or repeated dynamic scores. State how censoring and competing risks were handled. Make code and model version available when permitted. Use TRIPOD+AI and PROBAST+AI and distinguish retrospective validation from prospective impact.

### Time construction and targets in more detail

A sequence dataset is generated by choosing windows and labels. For a prediction at time t, a look-back window might include all measurements from t−24 hours through just before t, while the label indicates an event in (t,t+6 hours]. Specify boundary conventions, time zones, delayed charting, and whether events occurring exactly at the horizon count. Without these rules, different analysts can create different examples from the same record system.

Overlapping windows can make a single event generate many positive or near-positive examples. Sampling one index per patient, using a case-control window design, or weighting windows can address computational or imbalance issues but changes the training distribution. Ensure evaluation metrics correspond to patient-level decisions and actual alert frequency. If repeated windows are retained, confidence intervals must cluster by patient.

Prediction-time availability can differ from event-time measurement. A laboratory result may be collected at 10:00 but entered at 14:00; a deployed model at noon cannot use it unless the result was available. Use both measurement and availability timestamps when possible. Similarly, a diagnosis code can be added after discharge despite referring to earlier disease. Time leakage is often invisible in a cross-sectional feature table.

### Padding, masking, and irregular intervals

Neural sequence models often require equal-length batches. Padding shorter sequences with a sentinel value and masking padded positions prevents those positions from contributing to hidden-state updates. If the sentinel is a valid value, such as zero for a normalized variable, a separate mask is needed. Truncating long histories to a fixed length may discard clinically relevant early events; state the truncation rule.

Resampling irregular observations to fixed intervals can require interpolation or carry-forward. Carry-forward assumes a value remains informative until replaced; this can be wrong for rapidly changing physiology. Linear interpolation uses future measurements when filling earlier gaps unless carefully constrained, causing leakage. Include time-since-last-measurement and missingness indicators only if those signals will be available and stable in deployment.

Time gaps can be represented explicitly, modeled with continuous-time approaches, or handled by event-based sequences. Each approach imposes assumptions about how information decays. Measurement frequency may encode severity and clinician attention. Compare temporal models with baselines that include simple frequency and recency features to understand what the network gains.

## Interpreting the alert calculation

In the example, 50 flagged windows with 15 events yields a window-level PPV of 30%. If some patients contribute multiple flagged windows, this is not equivalent to 15 of 50 distinct patients benefiting from an alert. Aggregate alert counts per patient and determine whether repeated alerts are actionable. Define refractory periods or suppression rules before evaluation and include them as part of the deployed algorithm.

If the horizon is six hours, sensitivity at the window level can be inflated by flagging the same eventual event at several adjacent windows. A patient-level detection measure might ask whether at least one alert occurred within a prespecified lead-time interval before the event. Report lead time, alerts per event, false alerts per patient-day, and proportion of events with no timely warning. These measures align better with clinical operations than AUC over highly overlapping windows.

Thresholds may be patient-specific or context-dependent, but complexity in thresholding increases validation needs. If the alert is suppressed after a prior warning, evaluate the complete suppression policy. A model score alone is not the clinical intervention.

## Alternatives and model comparisons

A static model can use the latest observation, baseline covariates, and summary features such as mean, minimum, slope, and variability over a window. Such a model can be easier to inspect and may perform comparably with an RNN. Compare against established early warning scores and simple logistic models. If sequence information improves prediction, test whether the gain persists at external sites and under changed measurement frequency.

Temporal convolutional networks can parallelize computations and capture local patterns. Transformers can represent long-range dependencies but often need larger datasets and careful positional or time encoding. State-space models can make explicit assumptions about latent processes and irregular observations. Hidden Markov models model transitions among latent states. The best approach depends on data density, target, number of patients, computational resources, and validation support.

Model comparisons must use equivalent split units, outcome definitions, and tuning effort. Comparing an extensively tuned RNN to a default baseline exaggerates advantage. Report paired differences and uncertainty. If model selection is based on one external cohort, obtain a new independent cohort for confirmation.

## Calibration over time and landmarks

Dynamic predictions should be evaluated over time. Calibration at admission may differ from calibration after 24 hours because patients remaining in the ward form a selected risk set. Plot observed event rates against predicted risks at relevant landmarks and horizons. Account for censoring and competing events. A pooled calibration estimate may conceal poor performance at clinically important times.

If event prevalence changes, recalibration may restore risk levels only if ranking and predictors remain valid. Calibration drift can be caused by a treatment change, outcome coding update, or altered monitoring schedule. Monitor prevalence and follow-up completeness, and avoid recalibrating using outcomes selectively available for alerted patients. Selective outcome observation creates verification bias.

## Safety, subgroup performance, and alert fatigue

Repeated alerts can overwhelm staff and reduce trust. Measure alert volume, positive predictive value, events missed, and staff response. Evaluate how performance changes by ward, shift, data completeness, age, and other relevant groups. A model that appears to detect deterioration earlier may simply reflect more frequent measurements in certain patients.

Define human oversight: who receives the score, what action is recommended, and when a clinician can override. Provide uncertainty and data-quality warnings, not only a risk label. Determine a fallback when the model fails or data feeds stop. Retrospective accuracy does not show that alerting is safe under workload constraints.

A prospective silent run can verify timestamp alignment, latency, and data availability. A subsequent impact study should assess patient outcomes, response times, additional testing, alert fatigue, and resource distribution. Monitor unintended effects and maintain a mechanism to pause the system.

### Documentation for reproducibility

Describe cohort construction, sequence generation, index times, look-back and prediction windows, sampling strategy, patient split, label adjudication, timestamp rules, and censoring. Report how many patients, events, windows, and sites are involved. State architecture, optimizer, loss, padding/masking, missingness, tuning, and software versions.

Release a model card or equivalent record with intended use, contraindications, known failure patterns, update history, and governance owners. Protect patient identifiers in example sequences and logs. Preserve code to regenerate windows because seemingly minor changes in the time boundary can materially alter results.

## Sample size and uncertainty

A large number of windows does not imply a large independent sample. If 1,200 patients contribute 20,000 hourly windows and 96 events, the number of independent patients and event patients governs confidence in transport. Repeated-seed performance and patient-level bootstrap intervals can reveal instability, but cannot compensate for too few events. Plan an external cohort with enough outcomes to estimate calibration and threshold sensitivity at useful precision.

Report how many patients and events contribute at each landmark. Later landmarks may contain fewer patients and a selected subset, so uncertainty differs over time. Use confidence intervals and avoid claims based on a few events, especially within demographic or site subgroups.

Validate missing-stream behavior, maximum sequence length, and the delay between measurement, chart entry, and prediction. A model that performs well on retrospectively complete sequences may fail when deployed feeds arrive late or out of order. Include these conditions in simulation and silent prospective testing.

Version the event definition and prediction-window logic alongside the weights; changing either changes the prediction target and invalidates prior performance claims.

## Alert timing

Report the distribution of lead time among detected events, not only whether an event was ever flagged. An alert too close to deterioration may not leave enough time for an effective response.

## References and further reading

- Hochreiter S, Schmidhuber J. Long short-term memory. *Neural Computation*. 1997;9:1735–1780. [doi:10.1162/neco.1997.9.8.1735](https://doi.org/10.1162/neco.1997.9.8.1735).
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378).
- See [Transformers for health data](transformers-for-health-data.html) for attention-based sequence modeling.
