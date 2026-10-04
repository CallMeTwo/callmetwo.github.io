---
title: ROC curves and AUC
summary: A plot of sensitivity against 1 − specificity for every possible cut-off, whose area summarises a test's discriminatory power.
---

## Overview and key ideas

For a continuous marker, move the diagnostic cut-off from the lowest to the highest observed value, and at each position compute sensitivity (true positive rate) and 1 − specificity (false positive rate). Plotting sensitivity on the y-axis against 1 − specificity on the x-axis gives the **ROC curve**: every point is the operating pair at one threshold. The 45° diagonal represents a marker with no discriminatory power (AUC = 0.5); the top-left corner represents a perfect marker (AUC = 1.0).

The **area under the curve (AUC)** has a simple probability interpretation: it is the chance that a randomly chosen diseased person has a higher marker value than a randomly chosen non-diseased person. That makes AUC a threshold-free summary of *discrimination* — but it says nothing about *calibration* (whether predicted probabilities are numerically accurate) or about how the test performs at the specific working threshold your clinic will use.

Two useful landmarks on the curve: the origin (0,0) and top-right corner (1,1) are trivial points; the curve's steepest rise near the top-left corner is where both sensitivity and specificity are high, and the flattening toward the bottom-right is where the test is essentially useless. A curve that hugs the top-left corner has a high AUC; one that follows the diagonal has an AUC of 0.5; one that falls below the diagonal (AUC < 0.5) means the marker discriminates in the *wrong* direction — the marker is informative, but the direction of the test should be reversed.

## When to use it

| Setting | Example question |
| --- | --- |
| Comparing markers | Does high-sensitivity troponin discriminate MI from non-MI chest pain better than CK-MB? |
| Choosing a threshold | At what troponin level should chest pain patients be sent for angiography? |
| Model comparison | Does adding clinical variables to a biomarker improve discrimination of 30-day outcomes? |
| Screening evaluation | How do sensitivity and specificity of PSA change across candidate cut-offs? |

## Assumptions and limitations

- **Prevalence-independence, with a caveat** — the AUC itself does not depend on case mix, but the *operating point* (and hence PPV/NPV) you care about does; a curve estimated in a high-prevalence case series is still the right place to read thresholds from, but not from PPVs.
- **Comparing two AUCs** — when the markers come from the same patients (as here), use a paired test (DeLong's method); with overlapping 95% CIs the two tests cannot be declared different.
- **Cost is ignored** — the "best" cut-off depends on the relative consequences of false positives and false negatives, which AUC does not model; decision curve analysis is one remedy for that gap (Vickers & Elkin).
- **Unstable in small samples** — with few cases or a rare outcome the AUC estimate has wide uncertainty; report bootstrap confidence intervals.

## Worked example

A chest pain cohort of 500 patients (100 with MI) is studied with high-sensitivity troponin (ng/mL):

| Cut-off | Sensitivity | Specificity | 1 − Specificity |
| --- | --- | --- | --- |
| 0.04 | 95% | 70% | 30% |
| 0.14 | 60% | 92% | 8% |

The ROC curve passes through (0.30, 0.95) and (0.08, 0.60); the area under the curve is ≈ **0.89**, versus ≈ 0.50 for a non-discriminating marker in the same cohort.

Interpretation: troponin ranks most MI patients above non-MI patients (AUC 0.89). The two cut-offs are a policy choice: 0.04 ng/mL catches 95% of MIs but flags 30% of non-MIs as positive, while 0.14 ng/mL is far cleaner but misses 40% of MIs. The Youden index (sensitivity + specificity − 1) picks the threshold maximising correct calls in the study sample — 0.04 here (0.65 vs 0.52) — but the final choice should weigh the clinical cost of missed MIs against unnecessary workups, not the index alone.

## Interpretation and common pitfalls

- Treating AUC 0.7 as "fine" by default — there is no universal standard; 0.7 may be acceptable for a low-stakes screen and inadequate for a rule-in test in high-stakes care.
- Using the AUC to pick the working cut-off: AUC is threshold-free by construction, so the cut-off must be chosen on accuracy, cost and consequences, not on the area.
- Comparing AUCs from different samples without paired methods, or ignoring overlapping CIs; and assuming equal AUCs mean equal predictive quality — AUC ignores calibration entirely.
- Reading a single point on the curve as "typical" performance; each point is one specific threshold, and the study's threshold is not necessarily yours.
- Using the AUC as the only evaluation of a predictive model: a model with AUC 0.8 that is badly miscalibrated (predicts 80% when the true probability is 30%) can still be a poor basis for individual clinical decisions, even though its ranking is good.

The AUC is the probability that a randomly selected case receives a higher score than a randomly selected non-case (with ties handled conventionally). It measures ranking, not calibration, clinical benefit, or performance at a chosen threshold. Compare AUCs on paired participants with methods that account for correlated ROC curves, and report confidence intervals. For clinical use, show sensitivity and specificity at prespecified thresholds and evaluate consequences across threshold probabilities, for example with decision-curve analysis. Case-control sampling can estimate ROC characteristics under appropriate spectrum assumptions, but does not provide predictive values or population calibration without prevalence information.

## References and further reading

## ROC construction and interpretation

## AUC calculation and uncertainty

## Decision thresholds should match use

### AUC sample size considerations

Precision for AUC depends on case and noncase counts, not merely total enrollment. Rare disease requires substantial screening to accrue enough cases, and subgroup AUC comparisons require additional participants. Plan confidence-interval width or a clinically relevant difference between paired AUCs, accounting for correlation between tests. Report achieved precision if recruitment falls short; a nonsignificant comparison with wide interval does not establish similar discrimination.

## ROC reporting checklist

State positive class, score direction, AUC with interval, test threshold, sample spectrum, prevalence, reference standard, and whether estimates are internally or externally validated. Give sensitivity/specificity and predictive values at intended-use thresholds. Explain that AUC is ranking, not accuracy or calibration, and identify downstream decisions.

An early triage test may prioritize sensitivity to minimize missed disease, while a confirmatory test may prioritize specificity to avoid unnecessary treatment. Report performance in the intended-use region, not only whole-curve AUC. Thresholds should reflect benefits and harms, prevalence, downstream tests, and patient preferences. If several thresholds are shown, identify which was prespecified and which are exploratory.

For high-stakes deployment, evaluate net benefit and workflow impact in prospective validation, including uptake and indeterminate results. Discrimination alone does not establish clinical utility.

## Paired comparison example

When two biomarkers are measured on the same cases and controls, compare their AUCs using paired covariance. An observed AUC of .82 vs .79 with a 95% difference interval −.01 to .07 does not establish superiority; it remains compatible with small disadvantage or moderate advantage. If the clinical claim is noninferiority within .03, prespecify margin and use a confidence interval designed for that decision. Do not infer equivalence from a nonsignificant DeLong test.

For repeated cross-validation, predictions for a participant must come from folds where that participant was held out. Pooling in-sample predictions across folds leaks training information and inflates AUC. For nested model comparisons, repeat feature selection and tuning within each training fold. The final model should be refit on development data and evaluated on independent validation data once.

## Case-control spectrum and prevalence

ROC AUC is not directly changed by artificial prevalence under ideal sampling because it conditions on case/control status, but case-control recruitment often changes spectrum and disease severity, which can alter sensitivity and ranking. PPV/NPV from such samples are invalid for routine care. Re-estimate threshold predictive values at target prevalence only when accuracy transports; otherwise conduct validation in intended-use settings.

Empirical AUC is a Mann–Whitney U statistic: it estimates the proportion of case-control pairs correctly ordered by the score. DeLong variance uses the covariance of pairwise placements and is appropriate for independent subjects; paired ROC curves use covariance between scores on the same subjects. Bootstrap can accommodate more complex pipelines but must resample the independent sampling unit. If multiple lesions per patient are treated as independent, AUC uncertainty will be understated.

ROC analysis is affected by case mix. A test may discriminate better when cases are advanced and controls clearly healthy than among borderline patients in the intended clinic. Compare performance across severity spectrum and settings. AUC can increase merely because the validation sample has a wider range of disease severity, even if assay biology is unchanged. Report recruitment spectrum and reference-standard methods.

## Thresholds, costs, and calibration

## External validation and transport

## Reporting a diagnostic model study

Report participant flow, clinical setting, disease prevalence/severity, reference standard, blinding, index-test timing, missing/indeterminate results, and threshold rationale. For continuous prediction, specify whether score was trained on the study cohort or externally defined. Include AUC interval, calibration plots/intercept/slope, and clinically relevant threshold performance. If model development used the same sample, use bootstrap optimism correction or nested cross-validation and describe all feature selection/tuning steps. External validation remains necessary before use.

For a high-stakes threshold, quantify false positives and false negatives per 1,000 at target prevalence and describe downstream action. AUC alone cannot establish net benefit, fairness, or operational feasibility. Follow STARD for diagnostic accuracy or TRIPOD+AI for prediction model reporting, as appropriate.

## Full worked threshold example

Suppose 1,000 symptomatic patients undergo a biomarker test, 100 have disease by the reference standard, and threshold (c) yields sensitivity 85% and specificity 90%. This gives 85 TP, 15 FN, 90 FP, and 810 TN; PPV=85/175=48.6%, NPV=810/825=98.2%. If the same test is used in a 2% prevalence screening population and accuracy transports, PPV drops to about 14.8%: among 10,000, 170 TP and 980 FP. Thus an AUC or sensitivity/specificity pair does not determine practical value without setting and prevalence.

```r
prev <- c(.10, .02); sens <- .85; spec <- .90
ppv <- prev * sens / (prev * sens + (1 - prev) * (1 - spec))
npv <- (1 - prev) * spec / ((1 - prev) * spec + prev * (1 - sens))
data.frame(prevalence = prev, PPV = ppv, NPV = npv)
```

The calculation assumes sensitivity/specificity remain constant across settings, which may fail with spectrum shifts. A threshold should be chosen with downstream action and harms in mind. At a low-prevalence screening setting, confirmatory testing may reduce false-positive harms.

## ROC limitations and reporting

## Calibration alongside discrimination

If the test score is intended to estimate disease probability, assess calibration-in-the-large, calibration slope, and flexible calibration plots in addition to AUC. A model can rank patients well but systematically predict 30% risk when observed risk is 10%; threshold decisions based on such probabilities are unsafe. Recalibration may adjust intercept or slope, but should be done in representative validation data and reported as model updating. Provide Brier score or other overall accuracy measure as complementary evidence.

## Subgroup performance and fairness

Assess sensitivity, specificity, calibration, and threshold consequences across relevant demographic and clinical groups. Equal AUC does not imply equal false-negative rates or calibration. Small subgroup samples yield wide intervals, so avoid confident fairness claims from point estimates. Investigate differences in reference-standard access, measurement protocol, prevalence, and spectrum. If the test informs high-stakes action, prospectively evaluate workflow impact and unintended consequences.

## Case-control data and AUC

In a case-control sample, AUC can be estimated when sampling is independent of test score within disease strata, but spectrum bias may still alter it. PPV/NPV cannot be read from the enriched sample. For rare disease, precision in sensitivity depends on number of cases; precision in specificity depends on controls. Report each denominator and whether sample selection was consecutive, random, or convenience-based.

ROC curve treats false positives and false negatives symmetrically across thresholds, while clinical consequences are rarely symmetric. AUC averages ranking across thresholds that may never be used. Two curves can cross and have equal AUC while one performs better in the clinically relevant region. Report operating-point metrics, calibration, prevalence, and decision consequences. If case-control sampling was used, disclose sampling and avoid sample PPV/NPV.

Validate in a temporally or geographically distinct cohort that reflects intended clinical use. Preserve the development threshold for primary validation; recalibration or retuning should be reported as model updating and evaluated separately. Report AUC with interval, calibration, threshold-specific sensitivity/specificity, predictive values at target prevalence, and decision consequences. Spectrum, verification, and prevalence differences should be described. A high AUC in a case-control sample of clear cases and healthy controls may not transport to a primary-care population with early disease and comorbidity.

If several centers contribute data, show center-specific performance and uncertainty. A pooled AUC can hide poor performance at a site. Hierarchical summaries may quantify variation, but implementation decisions should include calibration at each site and feasibility of local recalibration.

If a model outputs risk, calibration compares predicted probabilities with observed frequencies; ROC AUC is unchanged by monotone transformations and therefore cannot detect miscalibration. A calibrated risk of 20% has direct decision meaning, while a rank score does not. Threshold should reflect treatment benefit/harm, testing cost, and patient preference, and can be examined with decision-curve analysis. Decision-curve results also depend on valid risk predictions and a clinically meaningful threshold range.

For screening, a two-stage pathway can use a sensitive initial test and a specific confirmatory test. Overall pathway sensitivity/specificity depend on sequential conditional performance, not the product of independent marginal values unless conditional independence is justified. Evaluate the full clinical workflow including indeterminate results and uptake.

For a continuous marker, each threshold gives a sensitivity and false-positive rate; connecting these points forms the ROC curve. The AUC can be interpreted as the probability that a randomly selected case receives a higher score than a randomly selected noncase (with half credit for ties). It measures ranking/discrimination, not calibration, causal effect, or clinical benefit. AUC=0.5 corresponds to chance ranking and 1.0 to perfect ranking in the evaluated sample. An AUC of 0.80 does not mean 80% of patients are correctly classified at a chosen threshold.

```r
library(pROC)
roc_obj <- roc(response = dat$disease, predictor = dat$score,
               levels = c("no", "yes"), direction = "<")
auc(roc_obj)
ci.auc(roc_obj, method = "delong")
coords(roc_obj, x = 0.90, input = "sensitivity",
       ret = c("threshold", "specificity"))
```

Specify positive class and score direction explicitly; software may otherwise select direction that maximizes apparent AUC. DeLong intervals account for paired empirical ROC estimates in independent participants, but clustered or repeated measurements need cluster-aware bootstrap. Threshold selection and AUC estimation in the same sample can be optimistic, particularly after trying many markers or cutpoints.

## Comparing AUCs and validating a marker

When two tests are measured in the same individuals, their AUC estimates are correlated; DeLong's test accounts for this paired structure. Tests measured in different participants require independent comparison. A nonsignificant AUC difference does not establish equivalence; define a clinically acceptable difference and use an equivalence framework if that is the goal. Also compare calibration and threshold-specific consequences, because similar AUCs can conceal very different behavior in the clinically relevant region.

Internal validation should repeat all model development steps—including feature selection and threshold choice—inside each bootstrap or cross-validation resample. Evaluating a score on its training data exaggerates performance. External validation should represent the intended population, preserve the intended threshold, and report changes due to spectrum, prevalence, and assay protocol. AUC may transport more readily than PPV but still changes with case mix and disease severity.

## Partial AUC and clinical use

In screening, high sensitivity may be required; in confirmatory testing, high specificity may matter more. Partial AUC summarizes discrimination over a restricted false-positive range, but its scaling and interpretation should be stated. Compare sensitivity at fixed specificity or specificity at fixed sensitivity with confidence intervals. Clinical utility depends on prevalence and consequences, so decision-curve analysis or net benefit can complement ROC performance. ROC analysis alone does not select a treatment threshold.

For imbalanced data, accuracy can be misleading, while ROC AUC is mathematically prevalence-independent but may appear favorable even when PPV is low. Precision-recall curves foreground positive predictive value and sensitivity and can be informative when disease is rare. Report prevalence and clinically relevant predictive values in the target setting alongside ROC measures.

- DeLong ER, DeLong DM, Clarke-Pearson DL. Comparing the areas under two or more correlated ROC curves. *Biometrics*. 1988;44:837–845. https://doi.org/10.2307/2531595
- Bossuyt PM, Reitsma JB, Bruns DE, et al. STARD 2015. *BMJ*. 2015;351:h5527. https://doi.org/10.1136/bmj.h5527

- DeLong ER, DeLong DM, Clarke-Pearson DL. Comparing the areas under two or more correlated receiver operating characteristic curves. *Biometrics*. 1988;44:837–845. [doi:10.2307/2531595](https://doi.org/10.2307/2531595)

- Vickers AJ, Elkin EB. "Understanding the area under the receiver operating characteristic curve." *BMC Medical Informatics and Decision Making*. 2006.
- Bland M, Altman DG. *Statistics with Confidence*. BNP Books.
- Collett D. *Modelling Binary Data*. CRC Press.
- The library's "Sensitivity, specificity and predictive values" article builds the 2×2 table that each ROC point summarises.
