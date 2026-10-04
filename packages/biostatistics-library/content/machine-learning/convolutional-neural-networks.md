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

## References and further reading

- LeCun Y, Bengio Y, Hinton G. Deep learning. *Nature*. 2015;521:436–444. [doi:10.1038/nature14539](https://doi.org/10.1038/nature14539)
- Litjens G, Kooi T, Bejnordi BE, et al. A survey on deep learning in medical image analysis. *Medical Image Analysis*. 2017;42:60–88. [doi:10.1016/j.media.2017.07.005](https://doi.org/10.1016/j.media.2017.07.005)
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378)
