---
title: ROC curves and AUC
summary: A plot of sensitivity against 1 − specificity for every possible cut-off, whose area summarises a test's discriminatory power.
---

## Overview

A receiver operating characteristic (ROC) curve displays sensitivity against one minus specificity as a diagnostic threshold varies. The area under the curve (AUC) summarizes ranking discrimination: it is the probability that a randomly selected case receives a higher score than a randomly selected non-case, with ties handled appropriately. ROC analysis describes discrimination, not calibration, clinical benefit, or the best threshold.

AUC is useful for comparing ranking across thresholds, but it can conceal where errors occur and depends on the case mix and disease spectrum. Report the intended population, index test, reference standard, threshold-specific performance, and uncertainty. For clinical decisions, relate thresholds to consequences and absolute risks.

## Building the ROC curve

For each possible cutoff, classify test-positive and test-negative results. Sensitivity=TP/(TP+FN); specificity=TN/(TN+FP). Plot sensitivity on the vertical axis and false-positive rate 1−specificity on the horizontal axis. A score with higher values indicating disease uses one direction; if lower values indicate disease, reverse appropriately.

A perfect classifier reaches the upper-left corner; a non-informative ranking lies near the diagonal. The ROC curve can be constructed empirically by evaluating observed score thresholds. Smoothing or parametric models can produce a cleaner curve but impose assumptions. State method and handle ties consistently.

## AUC calculation and interpretation

The empirical AUC is equivalent to the Mann–Whitney statistic: the proportion of case-control pairs where the case has a higher score, plus half credit for ties. If AUC=.80, a randomly chosen case is ranked above a randomly chosen non-case in about 80% of pairs. It does not mean 80% of patients are correctly classified or that predicted probabilities are accurate.

An AUC of .80 can correspond to different clinical performance depending on prevalence and score distributions. It does not select a threshold. A model can have higher AUC yet offer less net benefit in the relevant threshold range. Calibration and threshold utility need separate assessment.

## Worked threshold example

Suppose 100 patients have disease and 900 do not. At a threshold, sensitivity is .80 and specificity .70. Then TP=80, FN=20, TN=630, FP=270. PPV=80/(80+270)=22.9%; NPV=630/(630+20)=96.9%. Even with good sensitivity and moderate specificity, most positive results are false positives because disease prevalence is low.

At higher prevalence, PPV rises while sensitivity and specificity remain conditionally defined. Thus predictive values must be interpreted in the target population. Case-control studies can estimate sensitivity and specificity under suitable sampling but do not directly estimate target-population PPV without prevalence information.

~~~r
library(pROC)
roc_obj <- roc(response = status, predictor = score,
               levels = c("control", "case"), direction = "<")
auc(roc_obj)
coords(roc_obj, x = 0.80, input = "sensitivity",
       ret = c("threshold", "specificity"))
~~~

Confirm factor levels and score direction. The coordinate chosen by sensitivity is not automatically clinically optimal. Bootstrap patients for uncertainty, and if observations are clustered use a cluster-respecting method. Threshold selection and performance evaluation should use separate data or nested procedures.

## Thresholds and decision consequences

A diagnostic cutoff trades sensitivity against specificity. Screening may favor sensitivity to avoid missed disease, whereas confirmatory testing may favor specificity. The appropriate balance depends on consequences, available follow-up, and treatment effectiveness. Selecting the threshold that maximizes Youden’s J (sensitivity+specificity−1) implicitly gives sensitivity and specificity equal weight and ignores prevalence and action costs.

Thresholds chosen by optimizing the ROC curve on the same sample are optimistic. Prespecify a clinically justified cutoff or select it in development data and validate independently. Report the full confusion matrix and confidence intervals at the chosen threshold. If a test result is continuous and decisions vary, report a range of operating points.

## Calibration and predictive values

ROC measures ranking and is invariant to monotone transformations of scores. A recalibrated or distorted score can have the same AUC but very different probability meaning. Calibration compares predicted risk with observed frequency; evaluate calibration plots, intercept/slope, and Brier score for risk models. A diagnostic score that is not a probability should not be described as one.

PPV and NPV depend on prevalence. For sensitivity Se, specificity Sp, and prevalence π, PPV=Seπ/[Seπ+(1−Sp)(1−π)]. At π=.01, Se=.90, Sp=.90, PPV=.009/(.009+.099)=8.3%. A positive result in low-prevalence screening therefore often needs confirmatory testing. Use prevalence from the intended setting, not a case-control dataset’s fraction of cases.

## Paired model comparisons and uncertainty

When two tests are applied to the same participants, their AUC estimates are correlated. Use paired comparison methods such as DeLong’s test or patient-level bootstrap. Comparing overlapping confidence intervals by eye is not a formal test. A statistically significant AUC difference may be clinically trivial; report magnitude and decision consequences.

Confidence intervals depend on sample size and case/control counts. AUC uncertainty is driven by numbers of cases and non-cases, not only total N. Subgroup AUCs can be unstable when one class is rare. Report denominators and intervals. If patients cluster by site or repeated studies, account for dependence.

## Spectrum, verification, and reference standards

Sensitivity and specificity may vary with disease severity, comorbidity, and control selection. A study comparing advanced disease cases with exceptionally healthy controls can inflate AUC relative to real practice, where borderline cases and comorbidities are common. Enroll a representative clinical spectrum and report exclusions.

Verification bias occurs when the reference standard is applied preferentially based on index-test results. Partial verification can bias sensitivity and specificity. Use complete verification where feasible or appropriate corrections and sensitivity analyses. Reference standards can themselves be imperfect; describe adjudication, blinding, and disagreement.

The target condition and timing must be clear. A test may detect current disease but be evaluated against a later diagnosis influenced by the test result. Incorporation bias occurs when the index test contributes to the reference diagnosis. Avoid using a test as part of its own gold standard.

### Partial AUC and clinically relevant regions

AUC weights all false-positive rates equally, including ranges never used clinically. Partial AUC restricts evaluation to a relevant specificity or sensitivity region, but scaling conventions differ. State bounds and whether the partial area is standardized. A high partial AUC in a selected region may be useful for high-specificity confirmation or high-sensitivity screening, but threshold consequences still matter.

ROC curves can cross: one test may be better at high sensitivity and worse elsewhere. The overall AUC can obscure this. Report operating points and confidence intervals in the region relevant to practice. If comparing tests, prespecify the region and use paired inference.

## Subgroups, fairness, and transport

Evaluate discrimination and calibration in relevant subgroups, but remember that AUC can change with disease severity distribution even if conditional test behavior is similar. Differences may reflect spectrum, reference standard, access, or measurement quality. Report case and control counts, thresholds, sensitivity, specificity, and predictive values by group when support permits.

A threshold that works in one setting may misclassify patients elsewhere due to prevalence and spectrum. External validation should reproduce the intended use, including point of care, operator, device, and confirmatory pathway. Recalibration may improve risk estimates but cannot fix an unstable test measurement or label bias.

### Reporting a diagnostic model study

Report target condition, intended role, eligibility, recruitment, index test procedure, reference standard, blinding, threshold, missing and indeterminate results, and timing. Provide ROC curve, AUC with confidence interval, threshold-specific confusion matrix, predictive values for target prevalence, calibration if probabilities are produced, and subgroup performance. Describe sample-size planning and verification.

Use STARD for diagnostic accuracy reporting and TRIPOD+AI for prediction models. Distinguish diagnostic accuracy from clinical utility. Report failures and harms, including false-positive investigations and delayed diagnoses. AUC should be one part of the evidence, not the headline that substitutes for clinical interpretation.

### Confidence intervals for AUC and operating points

AUC is a statistic estimated from sampled cases and controls. DeLong’s method estimates variance using the placement of each case and control in the pairwise ranking; bootstrap methods can accommodate more complex sampling, but must resample the independent unit. Report a confidence interval alongside the point estimate. A narrow interval can still describe a biased sample or an inappropriate reference standard.

Sensitivity and specificity at a fixed threshold are binomial proportions conditional on disease status. Use score or exact intervals when counts are small. Predictive values are also proportions but depend on prevalence. If a case-control design fixed the number of cases, estimate PPV only after applying representative prevalence or validating prospectively. Show counts because percentages can conceal very small denominators.

For a paired comparison, compute the AUC difference and its interval, not just separate intervals. DeLong’s test is suitable for many paired settings with independent participants. For clustered multi-site data, resample or model clusters. If the threshold is selected from data, uncertainty should account for selection; a simple interval conditional on the chosen cutpoint is optimistic.

### ROC, precision-recall, and prevalence

The ROC curve can look strong under severe class imbalance because the false-positive rate denominator includes many non-cases. Precision-recall curves emphasize PPV and sensitivity among positive predictions and can better communicate performance for rare outcomes. The baseline precision equals prevalence, so PR curves change with prevalence; report the target prevalence and do not compare curves across populations without context.

Neither curve alone measures calibration or net benefit. ROC AUC assesses ranking across all thresholds, PR summarizes positive prediction quality, calibration evaluates probabilities, and decision analysis relates predictions to actions. Select metrics based on intended use and present complementary evidence rather than seeking one universal score.

### ROC threshold selection and decision utility

Youden’s J chooses the point maximizing sensitivity+specificity−1. This gives equal statistical weight to false positives and false negatives under a specific construction, but not necessarily equal clinical cost. A screening program may tolerate many false positives to avoid missing disease; a dangerous confirmatory procedure may require high specificity. Select thresholds from clinical consequences and patient preferences.

At a threshold, report numbers of false negatives and positives, not only sensitivity and specificity. For a low-prevalence condition, even a small false-positive rate can create many false alarms. Decision-curve analysis can compare net benefit across risk thresholds when probabilities and actions are well defined. Cost-effectiveness analysis may be needed if consequences include costs and health outcomes beyond binary errors.

If a threshold is chosen by maximizing performance on a development dataset, lock it and evaluate on a separate cohort. Cross-validation can estimate the whole threshold-selection procedure, but results should not be described as external validation. Thresholds should also be checked for stability across sites and subgroups.

### Diagnostic accuracy versus risk prediction

A diagnostic test classifies current disease status against a reference standard. A prognostic model estimates future outcome risk. Some tools do both, but the estimands and validation differ. A diagnostic ROC uses current disease status; a prognostic ROC depends on horizon and censoring. Time-dependent ROC methods need survival-specific definitions and competing-risk handling.

For a probability model, calibration is central because clinicians may act at a risk threshold. For a diagnostic score, sensitivity and specificity at a chosen cutoff may be primary, but predictive values still depend on prevalence. Avoid presenting AUC as proof that a screening program improves health; downstream follow-up and treatment must be effective.

### Case-control sampling and spectrum effects

Case-control studies can enrich the sample with disease cases, which improves efficiency for estimating some aspects of discrimination. But the case and control spectrum should match the intended clinical pathway. Controls drawn from healthy volunteers may differ markedly from patients who present with similar symptoms but do not have the target disease. This can inflate AUC.

Sensitivity and specificity can also vary with severity and competing conditions. A test may be more sensitive in advanced disease than early disease. Report disease stage, setting, comorbidities, and how controls were recruited. Validate in consecutive or representative cohorts whenever feasible.

The AUC is theoretically prevalence-invariant under fixed case and non-case score distributions, but those distributions often change with case mix. AUC can therefore change across settings despite identical assay technology. Predictive values certainly change with prevalence. External testing should examine both spectrum and prevalence.

### Verification and incorporation bias

If only patients with positive index tests receive the reference standard, false negatives remain unknown and sensitivity can be overestimated. This is partial verification bias. Differential verification uses different reference tests in different patients and can also distort estimates. Corrective methods require assumptions about verification probabilities and measured predictors.

Incorporation bias occurs when the index test forms part of the reference diagnosis. The resulting agreement is partly guaranteed. Blinding adjudicators to index results and applying an independent reference standard reduce this bias. If no gold standard exists, define a composite or adjudication method and acknowledge its imperfections.

### Multiclass and repeated-measure settings

For more than two diagnostic categories, one-vs-rest ROC curves and micro- or macro-averaged AUCs summarize different comparisons. State averaging method and class prevalence. A high average can hide poor discrimination for a clinically important rare class. Confusion matrices and per-class sensitivity are essential.

Repeated tests per patient create correlated observations. A per-test ROC may overweight people tested frequently. Define whether the unit is test, episode, or patient and aggregate or model accordingly. Cluster-aware confidence intervals are needed. If longitudinal scores are used, account for time and repeated thresholds.

### Paired AUC comparison example

Suppose two algorithms are evaluated on the same 100 cases and 300 controls. Model A has AUC .82 and model B .84. The .02 difference is not automatically meaningful. Their scores are correlated because they were evaluated on the same patients; a paired DeLong test or patient-level bootstrap estimates uncertainty in the difference. If the 95% interval is −.01 to .05, evidence is compatible with a small disadvantage or moderate advantage for B. Report the interval and decision consequences rather than simply whether a p-value is below .05.

AUC comparison should be prespecified if it is a primary objective. Testing many models, subgroups, and thresholds creates multiplicity and selection bias. Use the same test cohort fairly, but keep it untouched until model choices are locked. An external validation cohort is stronger evidence for transport than repeated internal comparisons.

## Threshold stability and uncertainty

Threshold performance can vary across samples, especially when few cases determine sensitivity. Bootstrap the independent patients and recompute sensitivity, specificity, PPV, and alert burden. If the cutoff itself was selected from data, repeat threshold selection in each bootstrap replicate to reflect selection uncertainty. Do not present a cutpoint with excessive decimal precision.

Subgroup threshold performance can differ even when AUC is similar. A single threshold may produce distinct sensitivity and false-positive burden by group because score distributions or prevalence differ. Evaluate whether a common cutoff supports equitable use and whether different cutoffs are legally, ethically, or clinically appropriate. Report the basis of threshold policy rather than making the decision solely from ROC curves.

### External validation and spectrum

External validation should use independent sites, operators, devices, time periods, and patient spectra representative of intended use. Report whether the reference standard was applied uniformly. A result from a specialist center may not transfer to primary care. Device recalibration, specimen handling, and operator training can shift score distributions.

If accuracy declines, investigate whether it reflects changed prevalence, disease severity, reference standard, or measurement. AUC may remain while calibration and predictive values shift. Recalibrate only when the ranking is stable and source differences are understood; otherwise develop and validate a revised test system. Clinical performance includes the full sequence from test ordering through confirmatory evaluation and treatment.

## Sample size and precision

Diagnostic studies need enough participants with and without the target condition to estimate sensitivity and specificity precisely. For sensitivity expected near .80 and margin .05, a rough simple-binomial calculation gives about 246 diseased participants. At 2% prevalence this may require screening more than 12,000 people. Case-control enrollment can increase case numbers efficiently, but does not provide representative predictive values and may distort spectrum. Plan sample size for the primary metric and the intended setting.

## Communicating the operating point

Present a confusion table with counts and denominators for the chosen cutoff, and specify whether threshold results were prespecified or selected. Explain what confirmatory step follows a positive result and what clinical action follows a negative result.

## Threshold reporting

A cutoff should be reported in the test’s original units, with direction and handling of equality specified. Changes in assay calibration or score version can invalidate an otherwise identical numeric threshold.

## References and further reading

- Hanley JA, McNeil BJ. The meaning and use of the area under a receiver operating characteristic curve. *Radiology*. 1982;143:29–36. [doi:10.1148/radiology.143.1.7063747](https://doi.org/10.1148/radiology.143.1.7063747).
- Saito T, Rehmsmeier M. The precision-recall plot is more informative than the ROC plot when evaluating binary classifiers on imbalanced datasets. *PLOS ONE*. 2015;10:e0118432. [doi:10.1371/journal.pone.0118432](https://doi.org/10.1371/journal.pone.0118432).
- See [Decision-curve analysis](decision-curve-analysis.html) for evaluating threshold utility.
- DeLong ER, DeLong DM, Clarke-Pearson DL. Comparing the areas under two or more correlated receiver operating characteristic curves. *Biometrics*. 1988;44:837–845. [doi:10.2307/2531595](https://doi.org/10.2307/2531595).
- Bossuyt PM, Reitsma JB, Bruns DE, et al. STARD 2015: an updated list of essential items for reporting diagnostic accuracy studies. *BMJ*. 2015;351:h5527. [doi:10.1136/bmj.h5527](https://doi.org/10.1136/bmj.h5527).
- See [Sensitivity, specificity, and predictive values](sensitivity-specificity-and-predictive-values.html) for threshold metrics.
