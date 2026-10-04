---
title: Convolutional neural networks
summary: How CNNs use local filters and shared weights to analyze biomedical images and other spatial signals.
---

## Overview and key ideas

A convolutional neural network (CNN) applies learned filters across an image or spatial signal. Reusing the same filter weights at different locations reduces parameters and encodes the idea that a local pattern may matter wherever it occurs. Stacked convolutions and nonlinearities build features from edges and textures toward more complex structures; pooling or strided convolutions reduce spatial resolution. CNNs can classify an image, locate objects, or produce a pixel-level segmentation.

For medical imaging, the unit of analysis and split matter. Images, slices, lesions, and patches from one patient are correlated; they must not be split independently across training and test sets when the intended use is a new patient.

## When to use it

CNNs fit image-like data such as radiographs, pathology tiles, retinal photographs, ultrasound, or spatially arranged sensor measurements. They are most compelling when there are enough representative labeled examples or a suitable pretrained model and when the output task is clearly defined. For small datasets, transfer learning can help, but it does not remove the need for independent validation.

## Assumptions and limitations

- Convolutions encode local spatial structure and approximate translation equivariance; anatomy, orientation, scale, and acquisition differences may violate simplistic assumptions.
- Labels may be noisy or reflect reports, billing, or clinician decisions rather than verified disease. Label provenance should be described.
- Dataset shift is common across scanners, protocols, institutions, and populations. Internal random splits can conceal it.
- Image-level artifacts, laterality markers, burned-in text, or acquisition settings can act as shortcuts. Saliency visualizations do not reliably rule out such shortcuts.
- For segmentation, pixel-level overlap metrics can obscure errors in small but clinically important lesions. Report task-relevant measures and uncertainty.

## Worked example

A CNN detects a condition on chest radiographs. The external test set has 500 patients, 100 with the condition. At a chosen threshold it identifies 85 affected patients (sensitivity 85/100 = 85%) and incorrectly flags 80 of 400 unaffected patients (specificity 320/400 = 80%). Positive predictive value is 85/(85+80) ≈ 51.5%. If prevalence in routine screening is 2% rather than 20%, the same sensitivity and specificity would yield an approximate PPV of (0.85×0.02)/[(0.85×0.02)+(0.20×0.98)] ≈ 8.0%. Thus the study cohort’s PPV cannot be carried directly to a lower-prevalence setting.

## Interpretation and common pitfalls

- Split at patient level and, where relevant, by site or time. Keep preprocessing and augmentation within training data.
- Describe image acquisition, labeling, exclusions, and class prevalence. Evaluate at external sites with confidence intervals.
- Report calibration as well as discrimination and sensitivity/specificity at prespecified operating points.
- Test subgroup performance and shortcut susceptibility; explain how the model would fit the clinical workflow.
- A heat map is a diagnostic aid, not evidence that the model reasons like a radiologist or that highlighted pixels cause disease.


## Convolution, receptive fields, and image-level targets

For an input image I and filter K, a 2-D convolution produces a feature map (I*K)(u,v)=sum_a sum_b K(a,b)I(u-a,v-b). The same K is applied at every spatial location, sharing weights and reducing parameter count compared with a dense layer. Stride controls movement; padding controls boundary dimensions. Nonlinear activations permit composition, and pooling or strided layers enlarge the effective receptive field while reducing resolution. Deeper layers can represent larger patterns, but their apparent hierarchy is not necessarily a human-interpretable sequence of clinical concepts.

Image labels have a unit and provenance: image, study, lesion, slide, or patient. If the label is patient-level but multiple slices are used, aggregation must be specified and splitting must occur before slice extraction or augmentation. Data augmentation should preserve label meaning; flips can reverse laterality, and intensity changes may alter pathology cues. For segmentation, Dice=2|A∩B|/(|A|+|B|) can be high for large structures while a small lesion is missed; also report lesion-level sensitivity, surface distance, and clinically relevant error.

```r
# A simple binomial calculation: PPV from prevalence, sensitivity, specificity
ppv <- function(prev, sens, spec) sens * prev /
  (sens * prev + (1 - spec) * (1 - prev))
ppv(.02, .85, .80) # about 0.080
```

The calculation shows why the test-cohort positive predictive value may not transport when prevalence changes. It assumes sensitivity and specificity remain constant, which may fail under spectrum or workflow shift. Validation should include later data and distinct sites, scanner vendors, and relevant subgroups. Check for shortcut cues such as labels, borders, burned-in text, portable-device markers, or post-outcome images. Saliency maps can help locate suspicious dependence but cannot prove its absence. For deployment, describe acquisition, image quality rejection, inference latency, human review, and how uncertain or out-of-distribution cases are handled.


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


## Full worked analysis: screening image classifier

Suppose a model screens radiographs for a condition with 2% prevalence. At sensitivity .85 and specificity .80, among 10,000 screened people one expects 200 cases: 170 true positives and 30 false negatives. Among 9,800 without disease, 1,960 are false positives and 7,840 true negatives. PPV=170/(170+1960)=8.0%, so roughly 12.5 positive alerts occur per true detected case. This arithmetic makes downstream capacity visible. It assumes performance is constant across the deployment spectrum; mild/asymptomatic cases, image quality, and disease severity can change sensitivity and specificity.

Before training, define whether the unit is a patient, radiograph, or study. If multiple projections or studies per patient are inputs, aggregate them according to a prespecified rule and split patients before augmentation. Keep a final set from another site or later period. For a segmentation model, patient-level Dice can mask a small lesion miss; report lesion sensitivity and false positives per scan. For classification, threshold selection should consider referral capacity and confirmatory testing, and calibration should be assessed at deployment prevalence. A classifier trained on enriched case-control data requires recalibration or appropriate sampling weights for absolute-risk interpretation.

```r
prev <- .02; sens <- .85; spec <- .80; N <- 10000
expected <- c(TP=N*prev*sens, FN=N*prev*(1-sens),
              FP=N*(1-prev)*(1-spec), TN=N*(1-prev)*spec)
expected
expected["TP"]/(expected["TP"]+expected["FP"])
```

Audit performance by scanner, institution, age, sex, and relevant clinical subgroups with uncertainty intervals. Investigate differences in image acquisition and label practices before interpreting disparities as model defects or biology. A heatmap can expose dependence on an image border or device marker, but apparent localization does not prove the model uses the lesion. Use controlled counterfactual perturbations, external cohorts, and error review to identify shortcuts; no one visualization establishes faithful reasoning. Document how images are rejected or routed when low quality or outside the training distribution.


## Uncertainty, external testing, and segmentation endpoints

Image-level confidence is not the same as epistemic uncertainty. A model can be confidently wrong on an unfamiliar scanner or rare pathology. Ensembles, test-time augmentation, or predictive entropy can flag some uncertainty, but each needs validation and none reliably detects every out-of-distribution image. Define an abstention pathway for low-quality or unfamiliar studies and measure coverage alongside accuracy: performance among the cases the system accepts may improve while many patients are deferred.

For segmentation, define how pixel masks are produced and adjudicated, whether annotators are blinded, and how disagreement is handled. Dice and intersection-over-union are size-sensitive; surface distance and lesion-level detection reveal different errors. Report per-patient distributions, not only pooled pixels, because large images otherwise dominate. For small lesions, a one-pixel boundary discrepancy can sharply change overlap; conversely, a high overlap on a large organ can conceal a dangerous missed focus. Agree on a clinically meaningful tolerance before analysis.

External testing should hold out institutions or time periods, not only random images. Analyze acquisition and prevalence differences, and establish whether recalibration or fine-tuning is allowed before evaluation. A newly fine-tuned model requires another independent test. Report intended scanner/protocol range, image quality exclusions, and workflow for a human reader. A retrospective image classifier may answer “what label is associated with this image?” rather than “what should the clinician do now?” That distinction belongs in the intended-use statement.


## Pretraining and augmentation decisions

Transfer learning starts with filters learned on a source dataset and adapts some or all weights to the target task. It can reduce optimization burden when target labels are scarce, but source images may differ in anatomy, acquisition, color scale, or label definition. Compare frozen feature extraction, partial fine-tuning, and full fine-tuning within development resampling. A pretrained model can carry source-population artifacts, and external validation remains necessary. Document source weights and licensing, because reproducibility and clinical use depend on them.

Augmentation can encode plausible invariances: small rotations, intensity shifts, or crops may represent acquisition variability. But an augmentation is unsafe if it changes laterality, removes a lesion, alters clinically meaningful density, or produces images outside realistic acquisition. Apply augmentations only to training data and never to evaluation images. Validate robustness to clinically plausible perturbations separately from routine test performance. Synthetic data require independent assessment for privacy leakage and fidelity.

Class imbalance in patch or pixel segmentation can lead the loss to favor background. Dice or focal losses can increase attention to small structures, but their probability outputs may not be calibrated and optimization behavior differs from cross-entropy. Select loss based on the clinical endpoint and report both overlap and detection errors. A thresholded mask can be postprocessed; postprocessing parameters are part of the model and must be tuned only within development data.


## Architecture and evaluation choices for clinical images

A classification head usually pools spatial feature maps and maps them to one or more labels. Global average pooling reduces parameters but discards some localization information. Detection models predict boxes or regions, while segmentation models return pixel labels; their annotation burden and clinical failure modes differ. If a model is trained with image-level labels but deployed to mark a lesion, a heatmap is not equivalent to a segmentation model and should not be presented as one. Align target granularity with the clinical question.

Dataset size must be counted at the patient level, and annotation quality must be described. Multiple readers may disagree on subtle findings; consensus labels can conceal uncertainty. Consider inter-reader agreement and adjudication, and evaluate against an independent reference standard when possible. If labels come from reports, models can learn reporting behavior rather than pathology. For case-control samples with enriched disease prevalence, ranking may be estimable but absolute risk and PPV do not represent screening populations without adjustment.

A robust evaluation protocol freezes the patient-level split before creating image patches. Patch extraction, augmentation, normalization, and any feature selection are fit only from training images. Ensure no images from the same study, patient, or near-duplicate acquisition cross partitions. Report both image-level and patient-level performance if each patient contributes multiple exams, and cluster uncertainty intervals by patient. External testing should include independent institutions and acquisition systems; random splitting across a pooled multi-site sample can leak site signatures into every partition.

For reader-assistance tools, evaluate human-AI performance as a separate estimand. A standalone sensitivity gain does not imply that radiologists improve with the model; automation bias can reduce detection of model-missed disease. A reader study should randomize or counterbalance case order, account for reader and case clustering, and include reading time and confidence. Deployment outcomes such as downstream tests, false referrals, and delayed diagnosis may require a prospective impact study.


## Data curation, reproducibility, and image shift

Image preprocessing can introduce subtle leakage. If normalization statistics are calculated across the full dataset, test information has entered development. Learn normalization on training images or use a prespecified acquisition protocol. Crop coordinates, resizing, windowing, color normalization, and compression affect predictions; save these settings and apply them consistently. For pathology, patch sampling must be patient- and slide-aware. Random patches from one slide in both partitions can make a model recognize tissue or stain signatures.

Annotation protocols should define inclusion criteria and reference labels. Radiology reports, pathology consensus, registries, and expert annotations have different errors and temporal relationships to use. Report inter-reader variability and disagreements. If weak labels are used, describe how noise was handled and evaluate errors against higher-quality reference data. A model trained on diagnosis codes may learn care pathways rather than imaging findings.

Image distribution shift can arise from new scanners, reconstruction kernels, staining, compression, patient positioning, or screening prevalence. External validation should test the complete processing chain and include image-quality failures. Recalibration may fix a shifted prior probability but not changed pixel meaning. Track device mix and input quality; define a trigger for review and a safe fallback. Include uncertainty or abstention pathways only after measuring coverage and accepted-case performance. A high-performing model that silently returns scores for out-of-domain images is not necessarily safe.


## Reporting uncertainty and errors

Use patient-level bootstrap intervals for sensitivity, specificity, PPV, and segmentation summaries; image-level resampling understates uncertainty when people contribute multiple images. Report the number of positive patients, not merely image count. For a screening threshold, show the confusion matrix and alert fraction with intervals. In segmentation, summarize per-patient distributions and include failure examples. Compare model-reader performance under a prespecified protocol, and distinguish standalone evaluation from assisted-reader evaluation.


## Calibration and decision thresholds

A classifier’s threshold should be prespecified or selected on development data against a stated consequence. On the external cohort, report sensitivity, specificity, predictive values, and the proportion sent for review at that threshold. A model can preserve AUC but have poor calibration after prevalence shift. Recalibration requires representative data and should be evaluated on a separate sample. In enriched datasets, report that predictive values are not transportable without correcting the sampling design and testing the correction.


Report confidence intervals with the number of independent patients as the resampling unit and include examples of clinically consequential misses. This makes the uncertainty and likely failure modes visible alongside summary accuracy.


Include device and site counts so readers can judge whether external validation represents genuine acquisition diversity.


If the sample includes multiple studies per person, give both patient and image denominators when reporting evaluation results.


Stratify errors by scanner.


Report test patient counts.

## References and further reading

- Moons KGM, Damen JAA, Kaul T, et al. PROBAST+AI: an updated quality, risk of bias, and applicability assessment tool for prediction models using regression or artificial intelligence methods. *BMJ*. 2025;388:e082505. [doi:10.1136/bmj-2024-082505](https://doi.org/10.1136/bmj-2024-082505)
- LeCun Y, Bengio Y, Hinton G. Deep learning. *Nature*. 2015;521:436–444. [doi:10.1038/nature14539](https://doi.org/10.1038/nature14539)
- Litjens G, Kooi T, Bejnordi BE, et al. A survey on deep learning in medical image analysis. *Medical Image Analysis*. 2017;42:60–88. [doi:10.1016/j.media.2017.07.005](https://doi.org/10.1016/j.media.2017.07.005)
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378)
