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

## References and further reading

- Hochreiter S, Schmidhuber J. Long short-term memory. *Neural Computation*. 1997;9(8):1735–1780. [doi:10.1162/neco.1997.9.8.1735](https://doi.org/10.1162/neco.1997.9.8.1735)
- Choi E, Bahadori MT, Schuetz A, Stewart WF, Sun J. Doctor AI: predicting clinical events via recurrent neural networks. *Proceedings of Machine Learning for Healthcare*. 2016. [PMLR 56:301–318](https://proceedings.mlr.press/v56/Choi16.html)
