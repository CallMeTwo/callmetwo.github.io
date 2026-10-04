---
title: Recurrent neural networks
summary: How recurrent models process ordered clinical events and signals, and why time-aware validation and missingness handling matter.
---

## Overview and key ideas

Recurrent neural networks (RNNs) process a sequence one step at a time, updating a hidden state that summarizes prior inputs. Basic RNNs can struggle to learn dependencies over long sequences because gradients may vanish or grow during training. Gated variants such as long short-term memory (LSTM) and gated recurrent units (GRUs) regulate information flow and are commonly used for time series, waveforms, and sequences of clinical events.

An RNN’s output may be produced at every time step (e.g., next-hour deterioration risk) or after a sequence (e.g., classify an ECG segment). Irregular clinical records require decisions about elapsed time, missing visits, and variable observation frequency; padding records without representing time can mislead the model.

## When to use it

RNNs can be considered for ordered data where past context matters, such as vital-sign sequences or event histories. Compare with simpler summaries, time-aware regression, and other sequence approaches. For modest, irregular electronic health record cohorts, an RNN’s complexity may not be warranted.

## Assumptions and limitations

- The sequence window and prediction time must be defined. Future information or variables recorded after an outcome begins create leakage.
- Sequence order must carry meaningful information, and sampling intervals should be handled explicitly when they vary.
- Repeated measurements within a person are not independent. Split by patient and use temporal external evaluation if predicting future patients or periods.
- Missingness and measurement frequency often reflect severity and care processes. The model may learn workflow patterns that change across sites.
- RNN probabilities can be miscalibrated; performance can be uneven across subgroups with different measurement intensity or care access.

## Worked example

For early warning, consider predicting ICU transfer within the next 6 hours from hourly vital signs. A prediction made at hour 10 may use values observed through hour 10, but not an intervention or laboratory result recorded at hour 11. If there are 1,000 patient stays and 50 transfers, a random split by hourly windows could put windows from one stay into both training and test data, making evaluation optimistic. Instead split by patient (or reserve later admissions), define one or more prediction landmarks per stay, and report event-level sensitivity alongside false alerts per patient-day. If the model flags 40 of 50 transfers and creates 120 alerts over 2,000 patient-days, sensitivity is 80% and alert rate is 0.06 alerts per patient-day; both are more operationally informative than accuracy alone.

## Interpretation and common pitfalls

- Establish a baseline with recent values or summary statistics before adopting an RNN.
- Represent time gaps and missingness deliberately; avoid treating padding as a physiologic value.
- Prevent overlap of patient sequences across partitions. Use nested tuning and preserve an untouched test cohort.
- Evaluate calibration, alert burden, lead time, and subgroup performance at the intended use point.
- Hidden-state attribution is not causal explanation. A temporal pattern predictive of deterioration may be a consequence of clinicians recognizing deterioration.


## Recurrence, gating, and clinical time

A basic recurrent unit updates h_t=phi(W_x x_t+W_h h_(t-1)+b). Repeated multiplication by recurrent Jacobians can shrink or amplify gradients, making long dependencies difficult. An LSTM uses input, forget, and output gates to regulate a cell state; a GRU uses update and reset gates with fewer parameters. These mechanisms help optimization but do not ensure that a learned state represents a clinically meaningful history.

Clinical sequences are often irregular. A row index is not elapsed time: ten measurements over one hour differ from ten measurements over a week. Potential representations include elapsed-time features, time-gap embeddings, fixed time bins, event tokens with timestamps, or models explicitly designed for irregular sampling. Carry-forward imputation can create long artificial plateaus; missingness flags and observation intensity may predict outcomes because clinicians measure sicker patients. Such signal may fail when practice changes. Define landmarks and horizons to prevent immortal-time and future-information leakage.

```r
# Event-level evaluation illustration, if 40 of 50 transfers are detected
sensitivity <- 40 / 50
alerts_per_patient_day <- 120 / 2000
c(sensitivity = sensitivity, alerts_per_patient_day = alerts_per_patient_day)
```

For early warning, evaluate lead time distribution, event sensitivity at a fixed alert burden, repeated alerts per stay, and positive predictive value per alert episode. A pointwise AUC can reward many redundant windows from the same patient and ignore whether any actionable warning was delivered. Aggregate predictions into clinically meaningful episodes using a prespecified rule. Split patients and preferably reserve future calendar time. Compare against last-value, summary-statistic, and logistic or survival baselines. Calibrate risk at the intended horizon; a score for “event in next six hours” cannot be interpreted as a general lifetime risk. Review temporal attribution cautiously because measurements may follow clinician concern rather than precede it.


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


## Full worked analysis: six-hour deterioration alert

Let each eligible patient have a prediction landmark at hour t, and define Y_t=1 if ICU transfer or death occurs in (t,t+6h]. Exclude or separately handle patients whose outcome has already begun by t. Build input sequences only from measurements timestamped no later than t. If transfer is triggered by a clinician’s decision, predictors such as transfer order or post-decision interventions leak the outcome. Define eligibility and censoring explicitly: discharge before six hours may not mean no deterioration, and death may compete with transfer.

Suppose 50 events occur across 1,000 stays. An RNN detects 40 events at an alert policy producing 120 alerts over 2,000 patient-days: event sensitivity is .80 and burden is .06 alerts per patient-day. However, if 30 of the 40 detected events had alerts only one minute before transfer, operational value may be minimal. Report lead time among detected events, alert duration, repeated-alert grouping, PPV per alert episode, and the fraction of patients alerted. Compare with a baseline using current vital signs and recent changes. Repeated landmarks create within-patient dependence, so bootstrap patients or use patient-clustered intervals.

```r
# Convert alert-level counts to workflow summaries
sensitivity <- 40/50
alerts_per_100_patient_days <- 120/2000 * 100
median_lead_minutes <- median(lead_minutes_detected, na.rm=TRUE)
c(sensitivity=sensitivity,
  alerts_per_100_patient_days=alerts_per_100_patient_days,
  median_lead_minutes=median_lead_minutes)
```

A full sequence model must represent elapsed time and missingness deliberately. Include masks and time gaps only if they are available and robust at deployment. Compare fixed hourly bins to event-time encodings, checking whether conclusions change. Use patient-disjoint temporal development and test sets, with hyperparameters tuned within development data. Outcomes at many overlapping landmarks can overweight long stays; select landmarks or weight patients according to a target use. Calibrate risk over the actual horizon and assess subgroups with different monitoring intensity. Prospective silent evaluation can quantify alert burden before clinicians see scores.


## Censoring, repeated landmarks, and operational utility

A patient can contribute dozens of prediction times, but the clinical decision may be one alert episode. If each landmark is treated as an independent row, uncertainty is understated and patients with long stays dominate. Cluster resampling at patient level, predefined landmark schedules, or patient-level weighting can address parts of this problem. Define what happens after an alert: predictions may alter testing and treatment, which changes later covariates and outcomes. Retrospective replay assumes those trajectories would remain unchanged and can misrepresent impact.

For time-to-event targets, distinguish competing outcomes and censoring. Transfer may preclude observation of ward deterioration; discharge may end surveillance; death can compete with ICU transfer. A binary label at six hours is only valid if follow-up and competing events are handled consistently. Alternatives include cause-specific or subdistribution hazards, discrete-time hazards, or multi-state prediction, each targeting a different quantity. Calibration should be evaluated at the stated horizon among patients eligible at each landmark.

Operational performance includes lead time, alerts per patient-day, proportion of stays alerted, duration of alert episodes, and response time. Thresholds may need hysteresis (different start and stop thresholds) to avoid rapid alert flicker, but this changes the algorithm and must be evaluated. The highest sensitivity is not necessarily best if alert burden overwhelms staff. A prospective silent study can test data latency, missing streams, and alert burden before an impact trial; it cannot alone prove that acting on alerts benefits patients.


## Baselines, representations, and uncertainty

Before fitting an RNN, compare with last-observation values, simple trend summaries, logistic regression on prespecified windows, and a discrete-time survival model. These baselines can reveal whether sequence order adds value or whether the network mostly exploits current severity. Ensure they use the same information window and patient-level partitions. If an RNN improvement disappears under temporal validation, the source may have learned documentation cadence or site patterns.

Sequence length and truncation matter. Keeping the most recent events may discard remote history; keeping the first events may miss deterioration near prediction time. Padding must have a mask, and a padding value should not be confused with a physiologic zero. Long histories increase computation and may overweight patients with extensive prior care. Summarize performance across sequence lengths and missingness patterns, and state how records are truncated in deployment.

Prediction uncertainty can be assessed by patient-level resampling, ensembles, or calibrated uncertainty methods, but none guarantee safe detection of novel trajectories. Evaluate abstention and fallback rules. For multiple forecasts per patient, show both landmark-level metrics and event-level utility. An attractive time-dependent AUC can coexist with late warnings or excessive repetitive alarms; lead-time and workload are essential outcomes.


## RNN model development and sequence-level diagnostics

Represent each training example as a patient sequence with a mask for valid timesteps. For variable-length sequences, padding should not contribute to the loss or hidden-state update. A bidirectional RNN uses both earlier and later elements in the supplied sequence; it is valid for classifying a completed ECG window but leaks future information for prospective forecasting if the “later” elements occur after the prediction time. Specify whether the task is sequence classification, per-time-step classification, or next-event prediction.

For an early-warning task, sequence-level labels can duplicate a positive patient across many preceding windows. This creates a large apparent sample and can overweight cases. Alternatives include selecting prespecified landmarks, using discrete-time hazard targets at each eligible interval, or weighting each patient so total contribution is controlled. Use patient-level splits and bootstrap. Check event-level recall and alert burden after mapping scores to alert episodes. A high window-level AUC is not necessarily operationally useful.

Use gradient clipping to prevent exploding gradients when training becomes unstable, but it does not solve vanishing gradients or poor time representation. LSTM/GRU gating helps preserve information, yet long-range memory may still be limited by truncation, sparse visits, and missingness. Test sequence-length sensitivity, time-gap features, and measurement masks. Examine learned behavior with counterfactual input perturbations or feature ablation cautiously; deleting a measurement may create an impossible clinical sequence. Saliency through time can identify influential intervals, but not causal mechanisms.

When reporting, state the hidden dimension, layers, directionality, dropout, sequence construction, padding, time features, optimization, and early stopping. Give software versions and code or configuration where possible. Also describe the target definition, prediction cadence, alert aggregation, and clinical workflow; architecture alone is not enough to reproduce the analysis.


## Data construction and reproducibility checklist

Sequence extraction should be deterministic. Define tie-breaking for events with equal timestamps, time zones, delayed result availability, and duplicate records. Use the time a value becomes available to the clinician rather than specimen collection alone if the model is meant to run live. Normalize features using training data only, and distinguish physiologic zeros from absent measurements. If a sequence is truncated, record whether earliest or latest events are retained and how many patients lose context.

The target construction deserves the same detail as the network. Specify event start, horizon, eligibility, competing events, and how a patient contributes multiple landmarks. Prevent windows after event onset from becoming negative examples. For a six-hour forecast, overlapping label windows can be highly correlated; resampling and confidence intervals must account for patient and possibly hospital clustering. A temporal split by admission date is useful but may still contain patients from both periods; keep a patient-disjoint check where repeated persons are common.

Report hidden units, gates, layers, bidirectionality, dropout, loss, optimizer, learning schedule, gradient clipping, batch padding, mask handling, time-gap representation, tuning folds, and best epoch. Retain training code and versions. Evaluate robustness to changes in measurement frequency and missingness. If an RNN’s benefit depends on dense hourly observations unavailable at a smaller hospital, the intended population must be narrowed or the model redesigned.


## Reporting and clinical handoff

Report how streams are synchronized, the feature window, prediction cadence, horizon, missingness mask, time-gap encoding, sequence truncation, and postprocessing into alert episodes. Include event-level sensitivity, alert burden, lead time, calibration, and uncertainty. Explain whether an output is visible to clinicians and what action is expected. Recheck all results with patient-disjoint or future-time validation. A model that requires measurements arriving too late or too frequently for routine care does not match the intended workflow.


## Communicating temporal predictions

A score should be displayed with its prediction horizon, update time, and data freshness. “Risk 0.3” without a horizon can be misread. Show whether the risk refers to the next six hours or a longer period, and suppress stale outputs when streams stop updating. Evaluate the consequences of delayed or missing measurements in realistic live-data replay.


For all temporal metrics, state whether they are calculated at each window, at each event episode, or per patient. This denominator changes interpretation and prevents repeated windows from creating a misleading impression of precision.


Record timestamp semantics and patient grouping so future readers can assess temporal leakage risk.


Describe the alert episode aggregation rule because it changes the number of actionable alerts and the estimated workload. Include this rule in both retrospective replay and prospective evaluation.


Stale data should suppress alerts.


These units should match the clinical workflow.

## References and further reading

- Moons KGM, Damen JAA, Kaul T, et al. PROBAST+AI: an updated quality, risk of bias, and applicability assessment tool for prediction models using regression or artificial intelligence methods. *BMJ*. 2025;388:e082505. [doi:10.1136/bmj-2024-082505](https://doi.org/10.1136/bmj-2024-082505)
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378)
- Hochreiter S, Schmidhuber J. Long short-term memory. *Neural Computation*. 1997;9(8):1735–1780. [doi:10.1162/neco.1997.9.8.1735](https://doi.org/10.1162/neco.1997.9.8.1735)
- Choi E, Bahadori MT, Schuetz A, Stewart WF, Sun J. Doctor AI: predicting clinical events via recurrent neural networks. *Proceedings of Machine Learning for Healthcare*. 2016. [PMLR 56:301–318](https://proceedings.mlr.press/v56/Choi16.html)
