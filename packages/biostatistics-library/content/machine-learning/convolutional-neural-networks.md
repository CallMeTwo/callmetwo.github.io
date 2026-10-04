---
title: Convolutional neural networks
summary: How CNNs use local filters and shared weights to analyze biomedical images and other spatial signals.
---

## Overview

A convolutional neural network (CNN) is designed for data with local spatial structure, especially images. Convolutional filters apply the same learned pattern detector across locations; pooling or strided operations reduce spatial resolution; deeper layers combine local features into broader representations. The final layer predicts an image-level class, a pixel-level segmentation, or another target.

In clinical imaging, CNNs can detect patterns but also exploit acquisition artifacts, labels, and workflow shortcuts. Performance depends on patients and sites represented, image preprocessing, reference labels, and intended action. A heat map or high AUC does not prove that the network uses the expected anatomy or improves care. Validation must operate at patient level and across relevant devices and institutions.

## Convolutions and receptive fields

A convolutional layer computes weighted sums over local patches. For an image input, a small kernel slides across spatial positions, sharing weights; this reduces the parameter count compared with a fully connected layer on every pixel and encodes translation-equivariant structure. Stacking layers expands the receptive field, so later units can combine local edges, textures, and shapes. Stride and pooling reduce spatial dimensions, trading detail for computation.

For binary image classification, a network may output a logit z and probability p=sigmoid(z). A segmentation model outputs a probability per pixel or voxel. The target definition must match the clinical task: image-level abnormality, patient-level diagnosis, lesion detection, severity score, or future event. Multiple images per patient require aggregation and patient-level splitting.

CNN assumptions are not universally appropriate. Images may have orientation, laterality, or anatomical location where translation invariance is harmful. Augmentations such as rotations and flips should preserve clinical meaning. A flipped radiograph may invert laterality or device placement; aggressive color transformations may erase pathology cues. Domain experts should review augmentations.

### Worked screening example

Suppose a development dataset contains 4,000 radiographs from 2,500 patients, with 400 positive examinations. The target is patient-level detection of a validated abnormality within an examination. All images for each patient must remain in one partition. If multiple views make one examination, define how their scores combine before validation. Reserve a later hospital cohort for external testing.

On an independent cohort of 500 examinations with 50 positive cases, a threshold flags 80 examinations, including 35 true positives. PPV is 35/80=43.75%, sensitivity is 35/50=70%, and false positives are 45. These values depend on prevalence and label quality. A high image-level AUC would not show whether the model identifies the right patients or whether clinicians can act on the output.

~~~r
# Illustration only: image tensors and labels are prepared separately.
# A real CNN is typically defined in torch, keras, or another deep-learning framework.
library(pROC)
roc_obj <- roc(response = test_label, predictor = test_probability)
auc(roc_obj)
~~~

This code computes ranking discrimination and does not assess calibration, threshold utility, or patient-level grouping. The model development must split by patient before extracting crops or augmentations. If the final intended decision is per patient, calculate all metrics at the patient unit.

## Data curation and labels

Imaging cohorts are shaped by referral, scanning, and labeling. A radiology report is not always a reliable gold standard; it can be delayed, uncertain, or influenced by the image interpretation process. Define how labels were assigned, whether annotators were blinded, how disagreements were resolved, and whether follow-up confirmed the target. Label noise can cap achievable performance and affect subgroups differently.

Images require consistent preprocessing: orientation, pixel spacing, windowing, normalization, and resolution. Preserve clinically meaningful acquisition information and document exclusions for poor quality. A model trained on a particular scanner or protocol may exploit site signatures. Compare performance by device, site, and calendar period. External validation should include realistic variations in acquisition and patient mix.

Prevent duplicate leakage. Near-identical images, repeated scans, and derived crops must not cross train and test partitions. Image augmentation is applied only to training data after partitioning. If patches are sampled, keep all patches from a patient in one fold. For longitudinal imaging, define whether prior scans are available at the time of prediction and prevent future information from entering.

## Training, imbalance, and uncertainty

Image tasks are often imbalanced. Class weights or sampling can help optimization, but probabilities may need calibration to deployment prevalence. Report event counts and PPV, sensitivity, specificity, and alert burden at thresholds. For segmentation, evaluate overlap measures such as Dice alongside lesion-level sensitivity and false-positive burden; aggregate pixel metrics can obscure clinically important small lesions.

Transfer learning initializes a CNN using a model trained on other images. It can help when target data are limited, but source images, label tasks, and acquisition domains differ. Report the pretrained source, layers frozen or fine-tuned, and augmentation. Fine-tuning decisions should be made within development resampling. External testing remains necessary.

Uncertainty can reflect sampling variation, model instability, ambiguous labels, and distribution shift. Bootstrap patients or sites, not image crops. Repeat training with different seeds and inspect confidence intervals. Ensembles and test-time augmentation may stabilize predictions, but computational uncertainty methods are not automatically calibrated. Define a low-confidence or out-of-distribution pathway and evaluate how often it applies.

## Evaluation beyond AUC

Discrimination measures ranking. Calibration checks whether predicted probabilities correspond to observed frequencies. Use calibration plots, intercept and slope, Brier score, and threshold metrics on independent data. For low-prevalence screening, precision-recall summaries and predictive values are important. Case-control evaluation can distort prevalence-dependent metrics; adjust or validate in representative samples.

Threshold selection depends on the consequences of false negatives and false positives. For screening, missed disease may be harmful; false positives create follow-up tests, anxiety, and cost. Decision curves can summarize potential net benefit across thresholds but require a meaningful clinical action. Prospective impact studies test whether using the model improves decisions and outcomes.

Subgroup evaluation should consider age, sex, ethnicity, skin tone where relevant, device, site, and clinically important conditions. Small subgroup samples create wide uncertainty; report denominators. A model can perform differently because of image quality, disease prevalence, access to confirmatory testing, or labels. Engage domain experts and affected groups in defining acceptability.

## Explanation maps and shortcut detection

Saliency maps and class activation maps visualize regions associated with a prediction. They can help find reliance on image borders, markers, text, or devices, but a plausible-looking map does not establish faithful reasoning. Maps can be insensitive to model parameters or vary with method. Compare explanations across methods, perturb inputs, and perform targeted artifact tests.

Test for shortcuts by evaluating on external sites, removing markers, masking non-anatomical regions, and stratifying by acquisition features. These interventions are diagnostic and can themselves distort images, so interpret cautiously. If performance collapses when a site marker is removed, investigate leakage rather than claiming anatomical reasoning.

## From validation to implementation

Define the intended workflow: when images arrive, how quickly a score is available, who reviews it, and how discordance is handled. A CNN used for triage can reorder a worklist; it should not silently exclude unflagged patients unless evidence supports that policy. Run a silent prospective phase to test image ingestion, latency, calibration, and failure handling before clinical influence.

Monitor scanner and protocol changes, image quality, prevalence, calibration, subgroup errors, and downstream actions. Model updates, new image preprocessing, and threshold changes create a new system version. Maintain rollback and human review. A deployment decision should include benefit, harms, workload, equity, and cost, not just retrospective AUC.

## Reporting a reproducible imaging model

Report patient and image counts, label source, inclusion/exclusion, patient-level split design, preprocessing, architecture, initialization, augmentation, loss, optimization, tuning, and software version. State whether metrics are image-level, examination-level, or patient-level. Include external sites, uncertainty, calibration, subgroup performance, threshold consequences, and failure analysis.

Provide code, model weights, and preprocessing details where permitted. Use TRIPOD+AI and relevant imaging reporting guidance; describe intended use and limits. Separate technical validation from a prospective study of clinical impact.

### Image labels and imperfect reference standards

A target label can be derived from pathology, follow-up, expert annotation, billing codes, or radiology reports; each has limitations. A report may be a noisy label for the image, and a model trained to reproduce the report may learn reporting behavior rather than disease truth. Pathology is more specific but available only for selected patients, creating verification bias. Describe ascertainment and selection into the labeled cohort.

For localization tasks, define the annotation unit and adjudication procedure. Pixel masks can differ across annotators at lesion boundaries. Use multiple readers or consensus rules and quantify inter-rater variation. A segmentation model’s apparent error may reflect annotation ambiguity; evaluation should acknowledge this and consider tolerance-based measures. For detection, count lesions and patients separately, since many false-positive boxes in one patient have different implications from isolated false alarms across many patients.

If the same radiologist labels training and test images, systematic reader tendencies may be shared. Blinding and independent adjudication reduce some bias. Keep model developers separate from reference labeling when feasible. If reports created labels after model exposure or with access to other tests, the target may include post-index information and become unavailable at deployment.

## Image-level, exam-level, and patient-level targets

A radiograph examination may include several views; a patient can have multiple examinations. Define the prediction target at the level of intended action. If the system prioritizes examinations, evaluate examination-level performance. If it supports patient triage, combine views and repeated exams into a patient-level score and prevent repeated cases crossing partitions.

Aggregation rules matter. Taking the maximum view score may increase sensitivity but also false alarms as the number of views grows. Averaging can dilute a focal abnormality. Learn aggregation within training data and validate it with the whole pipeline. Report number of images per examination and how missing views are handled.

Longitudinal imaging can use prior scans, but availability and timing must match intended deployment. A model that uses post-diagnosis images to classify earlier disease leaks outcome information. For prognosis, define the landmark and horizon, and account for patients with incomplete follow-up. A “baseline” scan should be defined by the scan acquisition time available to the clinical team.

### Metrics for screening and segmentation

For screening, ROC AUC may appear high in a case-control sample even when the target prevalence is much lower. Positive predictive value depends strongly on prevalence. Report sensitivity and specificity with confidence intervals and representative prevalence, and estimate the number of follow-up tests per detected case. A decision threshold selected in an enriched cohort may not be appropriate in routine screening.

For lesion segmentation, Dice similarity coefficient measures overlap: 2|A∩B|/(|A|+|B|). It can be insensitive to clinically important boundary errors in large structures and unstable for tiny lesions. Report complementary measures such as lesion-wise sensitivity, false positives per scan, volume error, and boundary distance as appropriate. Define how empty masks and multiple lesions are treated.

Model selection should not rely on one summary. A small improvement in mean Dice may hide a subgroup of missed lesions. Show case-level distributions, representative failures, and subgroup results. Confidence intervals should resample patients, not slices. For paired model comparisons, evaluate predictions on the same patient set.

### Shortcut auditing and data leakage tests

Common shortcuts include laterality markers, embedded text, image borders, portable-device labels, hospital-specific compression, and repeated patients. Construct diagnostic evaluations that test sensitivity to these features: compare performance by scanner or site, mask non-anatomical regions, evaluate on a new acquisition source, and inspect examples with unexpected predictions. Each test can alter image content, so use it as evidence about reliance rather than a definitive proof.

Dataset-level leakage can occur when near duplicates or serial studies cross splits. Hashing and image similarity tools can flag duplicates, but manual review may be needed. Ensure preprocessing statistics are computed from training data, not all images. Tuning thresholds, selecting architectures, or choosing checkpoints using the external test set invalidates its independence.

If performance is much higher for images from a particular site, check whether site and outcome prevalence are associated. A random split will preserve this correlation and make a shortcut appear useful. Site-held-out testing can reveal failure. If the intended deployment includes those sites, determine whether recalibration suffices or whether acquisition and labeling mechanisms have changed.

## Model uncertainty and quality control

A CNN will produce a score for corrupted, out-of-focus, or unsupported images unless a quality gate prevents it. Develop image-quality checks for missing views, severe artifacts, orientation errors, and unsupported modalities. Test quality control by site and subgroup; poor image quality may correlate with access or clinical urgency. Define when the system rejects an image and how staff proceed.

Prediction uncertainty can be estimated through ensembles, stochastic augmentations, or other methods, but uncertainty scores need calibration. Evaluate whether high uncertainty corresponds to errors or distribution shift in independent data. A confidence score should not be used as a safety guarantee. Review false negatives and high-uncertainty cases with clinicians and determine escalation pathways.

Monitoring must include input quality and acquisition variables, not only outcome metrics. Outcomes may arrive months later, so combine early operational signals with delayed calibration monitoring. Changes to image compression, scanner software, or preprocessing should trigger reassessment.

## Fairness and accessibility in imaging

Image quality and disease appearance can vary with age, sex, skin pigmentation, comorbidities, positioning, and access to imaging. Evaluate performance for relevant populations and acquisition conditions, while acknowledging limited subgroup sizes. A model trained on tertiary-care images may fail in primary care or mobile settings. Diverse enrollment must be paired with trustworthy outcome labels and external evaluation.

If the model prioritizes worklists, examine wait times and missed cases by group. The threshold can affect access to follow-up differently where resources differ. Stakeholders should decide acceptable trade-offs and mechanisms for human review. Do not use demographic subgroup results as a simple ranking of fairness without considering prevalence, label quality, and clinical consequences.

## Prospective workflow and cost

A useful CNN must fit the imaging workflow. Measure inference latency, image routing, failure rate, and workload. Determine whether users see a probability, heat map, or prioritization marker and how each affects decisions. Human factors testing can identify automation bias or alert fatigue. Silent deployment can verify data pipelines before predictions influence care.

A prospective impact study should evaluate patient outcomes, diagnostic delay, downstream testing, false-positive workups, workload, and costs. A randomized or phased implementation may be appropriate depending on risk and workflow. Include a comparison with existing radiologist or clinician performance and specify how disagreements are resolved. Retrospective image accuracy alone cannot establish clinical benefit.

### Reporting details readers need

Report data sources, patient and image counts, sites, time period, label criteria, reader agreement, preprocessing, input resolution, architecture, pretraining source, augmentation, loss, optimization, tuning, and threshold selection. State split unit and how duplicates were prevented. Give metrics at the deployment unit, confidence intervals, calibration, subgroup results, and failures.

Describe intended use, prohibited uses, image quality constraints, and fallback procedures. Version the model and preprocessing pipeline. Provide examples only when privacy and permissions allow. A reproducible report should distinguish diagnostic classification, triage, segmentation, and prognosis because each requires different evidence.

## When CNN use is unjustified

A CNN may be unnecessary for small tabular datasets, low-resolution inputs without meaningful spatial structure, or a setting where a short validated score already supports the decision. It may also be inappropriate when acquisition variability cannot be monitored or reference labels are too weak to support the desired claim. Simpler image features or established workflows can be compared as baselines.

Model choice should be driven by task, evidence, and maintainability. If a CNN offers a measurable gain, explain whether it improves sensitivity, calibration, or clinical workload and how uncertainty was assessed. Do not infer superiority from architectural complexity.

### Calibration and operating points

CNN probability scores can be miscalibrated even when ranking is strong. Check reliability over the clinically relevant range and recalibrate only on representative data separate from final testing. Threshold selection should account for prevalence and follow-up capacity. A threshold appropriate for prioritizing radiologist review may be unsafe as an autonomous rule-out cutoff. Report sensitivity, specificity, PPV, and the number of studies referred at the chosen operating point.

Image-level metrics should not substitute for patient-level action metrics. If several views contribute to one decision, aggregate them before calculating patient sensitivity and false-positive burden. Provide both levels when each is relevant to workflow.

## References and further reading

- Roberts M, Driggs D, Thorpe M, et al. Common pitfalls and recommendations for using machine learning to detect and prognosticate for COVID-19 using chest radiographs and CT scans. *Nature Machine Intelligence*. 2021;3:199–217. [doi:10.1038/s42256-021-00307-0](https://doi.org/10.1038/s42256-021-00307-0).
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378).
- See [Random forests](random-forests.html) for general prediction calibration and [Decision-curve analysis](../clinical-research/decision-curve-analysis.html) for threshold utility.
- LeCun Y, Bengio Y, Hinton G. Deep learning. *Nature*. 2015;521:436–444. [doi:10.1038/nature14539](https://doi.org/10.1038/nature14539).
- Moons KGM, Damen JAA, Kaul T, et al. PROBAST+AI. *BMJ*. 2025;388:e082505. [doi:10.1136/bmj-2024-082505](https://doi.org/10.1136/bmj-2024-082505).
- See [Neural networks for health data](neural-networks-for-health-data.html) for broader validation and lifecycle guidance.
