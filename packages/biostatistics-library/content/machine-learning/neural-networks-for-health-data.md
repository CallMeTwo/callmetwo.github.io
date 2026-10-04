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

## References and further reading

- LeCun Y, Bengio Y, Hinton G. Deep learning. *Nature*. 2015;521:436–444. [doi:10.1038/nature14539](https://doi.org/10.1038/nature14539)
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378)
