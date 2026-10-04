---
title: Sensitivity, specificity and predictive values
summary: How well a test detects and excludes disease — and why a positive result's meaning depends on how common the disease is.
---

## Overview and key ideas

A diagnostic test is summarised against a reference standard in a 2×2 table. **Sensitivity** = TP / (TP + FN) is the proportion of truly diseased people the test detects; **specificity** = TN / (TN + FP) is the proportion of healthy people correctly called negative. **Positive predictive value (PPV)** = TP / (TP + FP) is the probability that a positive result is truly positive; **negative predictive value (NPV)** = TN / (TN + FN) is the corresponding probability for a negative result.

Sensitivity and specificity are (nearly) properties of the test itself at a given threshold, while PPV and NPV are properties of the test in a particular population — they move with the prevalence of disease. This is the practical heart of diagnostic reasoning: a clinician can never "look up" the probability that a positive result is real, because it is not a fixed property of the test; it is a function of how sick the tested population is.

The clean bridge between the two worlds is the likelihood ratio: LR+ = sensitivity / (1 − specificity) and LR− = (1 − sensitivity) / specificity, which convert a pre-test probability into a post-test probability via Bayes' theorem without needing to know prevalence.

Rough clinical heuristics for likelihood ratios (Fagan's nomogram logic): LR− near 0.1 (e.g. a very sensitive test) can effectively rule disease out; LR+ near 10 can effectively rule it in; LRs between 1 and 10 shift the probability only modestly and are usually not enough for a decision on their own.

## When to use it

| Setting | Example question |
| --- | --- |
| Emergency rule-out | How well does D-dimer exclude pulmonary embolism in low-risk chest pain? |
| Rule-in strategy | Which biomarker best confirms myocardial infarction in an ED chest pain cohort? |
| Test selection | Rapid antigen test versus throat culture for suspected streptococcal pharyngitis — which trade-off fits the setting? |
| Follow-up of screening | In a 50-year-old woman with an abnormal mammogram, what is the probability of cancer? |

## Assumptions and limitations

- **Reference-standard assumptions** — sensitivity and specificity assume every participant is classified by a gold standard applied to everyone; if the reference standard is imperfect, or is applied conditionally on the test result (verification bias), both estimates are distorted.
- **Spectrum effects** — test performance changes with disease stage and severity; a 95% sensitivity in symptomatic patients may be far lower in an asymptomatic screening population.
- **Transportability of predictive values** — PPV and NPV computed in one study apply at that study's prevalence; moving them to your clinic requires re-computing at your local pre-test probability.
- **A single threshold** — for a continuous marker, the numbers summarise one chosen cut-off; the full sensitivity–specificity trade-off is shown by the ROC curve (see the article on ROC curves and AUC).

## Worked example

D-dimer is measured in 400 emergency chest pain patients, of whom 40 (prevalence 10%) have pulmonary embolism confirmed on CT angiography. The test has sensitivity 95% and specificity 55%:

| | PE present | PE absent |
| --- | --- | --- |
| Test positive | 38 | 162 |
| Test negative | 2 | 198 |

- Sensitivity = 38/40 = **95%**; specificity = 198/360 = **55%**.
- PPV = 38 / (38 + 162) = **19%** — most positive D-dimers are false positives.
- NPV = 198 / (198 + 2) = **99%** — a negative D-dimer virtually excludes PE.
- LR+ = 0.95 / 0.45 = **2.1**; LR− = 0.05 / 0.55 = **0.09**.

If the target population has a lower 2% prevalence, PPV falls to 8 / (8 + 176) ≈ **4%** while NPV stays near 99.5%. Interpretation: the test is built for exclusion — its high sensitivity gives a small LR−, so a negative result sharply lowers post-test probability, while a positive result (LR+ 2.1) moves it little and the correct next step is CTPA. The example shows that a "95% sensitive" test can still generate 81% false positives, because the accuracy of a positive result is a property of the patient population, not the test.

## Interpretation and common pitfalls

- Quoting one study's PPV as if it applied in your clinic; PPV moves with prevalence, so recompute it at your patient's pre-test probability.
- Reading sensitivity and specificity as one "accuracy": a 95%/55% test is excellent for ruling out and poor for ruling in — the two numbers answer different questions.
- Forgetting the cut-off: for continuous markers, raising the threshold raises specificity and lowers sensitivity; always state which cut-off the quoted values refer to.
- Confusing test characteristics with post-test probability — sensitivity is not the probability that a positive result is true; that is the PPV.
- Comparing two tests by their sum of sensitivity and specificity, or by "accuracy," in a lopsided population where most people are healthy (or sick); accuracy can be deceptively high and tells you little about the errors that matter.

Sensitivity and specificity are conditional on disease status and can still vary across clinical settings because case severity, comorbidities, and control selection affect the tested spectrum. Predictive values additionally depend directly on prevalence: for sensitivity Se, specificity Sp, and prevalence π, PPV = Seπ/[Seπ + (1−Sp)(1−π)]. For example, with Se=0.95, Sp=0.90, and prevalence 1%, PPV is about 8.8%, despite high sensitivity and specificity. Validate thresholds in a representative target population and report indeterminate results and missing tests rather than silently excluding them.

## References and further reading

## Threshold-specific accuracy and uncertainty

## Likelihood ratios and sequential updating

## Confidence intervals for accuracy estimates

## Verification bias correction

## Study size and precision planning

## Reporting test performance for practice

## Choosing cutpoints responsibly

Thresholds should be selected in development based on a prespecified clinical use and then evaluated in independent validation. Maximizing Youden's J or minimizing distance to upper-left corner ignores prevalence and unequal harms. If a threshold is selected from data, use nested validation or bootstrap optimism correction and label it exploratory. A continuous marker can support multiple thresholds for rule-out, intermediate, and rule-in zones rather than a single dichotomy.

For a test with a gray zone, define what clinicians should do with intermediate values (repeat, additional testing, watchful waiting). Excluding the gray zone from accuracy calculations inflates performance; report its frequency and pathway. Decision thresholds may vary by pretest probability and patient preferences, so decision support can combine test result with clinical risk factors rather than use a universal cutpoint.

Provide a 2×2 table with exact counts, not only rounded percentages. State threshold, test version, reference standard, setting, recruitment spectrum, blinding, and interval method. Include indeterminate tests and participant flow. Report prevalence in intended-use population and distinguish study PPV/NPV from transported values. If several thresholds are considered, explain prespecification and correct/label exploratory selection.

For a pathway, show test sequence, repeat testing, confirmatory tests, and consequences. Sensitivity and specificity are not necessarily constant at each stage if tests are conditionally dependent. For serial testing (both positive required), overall sensitivity often falls and specificity rises; for parallel testing (either positive), sensitivity rises and specificity falls. Calculate joint performance from participant-level data rather than multiplying marginal values absent independence.

To estimate sensitivity with desired half-width (d), a rough sample size among diseased participants is (n_D\approx z^2p(1-p)/d^2). At sensitivity .90, 95% confidence and precision ±5 percentage points, this is about 139 diseased participants. If prevalence is 5%, roughly 2,780 screened participants are needed before nonresponse/verification losses. Specificity requires a separate nondiseased sample-size target. Exact/binomial methods may be preferable near boundaries, and clustering/multicenter design inflates requirements.

For paired tests, sample size for difference in sensitivity depends on discordant results among diseased participants, not independent proportions. Predefine the clinically meaningful accuracy difference and use paired methods. Diagnostic studies often underpower subgroup and threshold comparisons; report achieved interval precision rather than claiming equivalence.

If reference-standard verification is performed only for test-positive patients, observed false negatives are missing and sensitivity is overestimated. In a two-phase design, randomly verify a known fraction of negatives and weight verified records by inverse verification probability, or use likelihood methods accounting for verification. Verification probabilities must be positive and known/modelled. Report the verification flow and perform sensitivity analysis if verification depends on unobserved disease severity.

## Indeterminate and repeated test results

Indeterminate results are clinically meaningful and should not be dropped without accounting. Report their frequency and reasons, and evaluate repeat-testing or indeterminate-as-positive/negative strategies as appropriate. For repeated tests, distinguish test-retest reliability from diagnostic accuracy. If multiple specimens per participant are analyzed, account for within-person clustering. A threshold chosen after seeing the reference results is optimistic; lock the threshold before validation.

Sensitivity is estimated among diseased participants and specificity among nondiseased participants, so their precision depends on the numbers in those groups, not total sample size alone. If 90 of 100 diseased participants test positive, sensitivity is 90% with a Wilson interval roughly 82.6%–94.5%; collecting 1,000 non-diseased controls does little to narrow sensitivity uncertainty. Plan diagnostic accuracy sample size separately for desired sensitivity and specificity precision, and account for prevalence when estimating recruitment needs.

For predictive values in a probability sample, binomial intervals may be appropriate; case-control enriched samples do not directly estimate PPV/NPV because their disease fraction is artificial. Reweight to target prevalence only if sensitivity/specificity transport. For paired test comparisons, use methods accounting for paired discordant results; DeLong tests compare AUC, while McNemar-type methods compare paired classification rates at a fixed threshold.

## Calibration and decision threshold example

Suppose a disease has 2% prevalence and a test has 95% sensitivity and 95% specificity. In 10,000 screened, expected true positives are 190 and false positives 490, yielding PPV 28%. A positive result may warrant confirmatory testing, not immediate treatment. If treatment threshold is 10%, a post-test risk of 28% crosses it only if test result and pretest risk are calibrated for this population and harms/benefits support that threshold.

Report the flow from screening through confirmatory diagnosis and treatment. False positives can cause anxiety and invasive workup; false negatives can delay care. Sensitivity/specificity alone omit these downstream consequences. Decision analysis should account for prevalence, patient preferences, test costs, and harms.

Likelihood ratios summarize how much a test result changes disease odds. Pretest odds are (p/(1-p)); post-test odds equal pretest odds times LR. For sensitivity 90% and specificity 90%, LR+ is 9 and LR− is 0.111. At a 5% pretest probability, pretest odds are .0526; a positive result gives post-test odds .474 and probability .474/1.474=32.2%. A negative result gives odds .00585 and probability about 0.58%. This reproduces Bayes' PPV/NPV calculation and makes clear that the same test result has different meaning at different pretest probability.

```r
lr_pos <- 0.90 / (1 - 0.90)
lr_neg <- (1 - 0.90) / 0.90
update_prob <- function(p, lr) {
  odds <- p / (1 - p) * lr
  odds / (1 + odds)
}
c(positive = update_prob(.05, lr_pos),
  negative = update_prob(.05, lr_neg))
```

Sequential multiplication assumes conditional independence of test results given disease status. Repeating the same test or using correlated tests and multiplying LRs exaggerates evidence. A diagnostic pathway should model joint accuracy or use validated conditional LRs. LRs may also vary by disease severity, so a single value may not fit all patients.

## ROC threshold selection and decision consequences

The ROC curve plots sensitivity against 1−specificity across thresholds. The AUC is the probability a randomly chosen case ranks above a noncase; it is a ranking measure, not calibration or clinical utility. AUC can remain high despite poor calibration and can change little when clinically important threshold performance changes. Report sensitivity, specificity, PPV/NPV at intended thresholds, calibration if probabilities are produced, and decision consequences such as downstream tests or treatment harms.

Youden's index (sensitivity+specificity−1) weights false positives and false negatives symmetrically and does not account for prevalence or consequences. The “optimal” threshold should reflect clinical harms, costs, and patient preferences. If a test is used to rule out disease, a high-sensitivity operating point may be desired; rule-in use may prioritize specificity and confirmatory evidence. Report multiple prespecified thresholds where no single use dominates.

## Verification, spectrum, and imperfect reference standards

Accuracy studies need the index test and reference standard applied to all participants or a random subset regardless of index result; otherwise partial verification bias distorts results. If the reference standard is invasive, two-phase designs can verify a sample of test-negative individuals and use inverse-probability weighting. Differential verification with different reference tests by index result can introduce bias. Blinding prevents the index result from influencing reference interpretation.

If the reference standard is imperfect, observed sensitivity/specificity measure agreement with that standard rather than true disease. Latent-class models can estimate accuracy without a gold standard, but require assumptions such as conditional independence or multiple populations with varying prevalence; these assumptions are often strong. State the clinical disease definition and reference test limitations. Include indeterminate results and test failures in the flow diagram and clarify whether they were excluded, repeated, or counted as errors.

Sensitivity and specificity are conditional on disease status; positive and negative predictive values (PPV, NPV) are conditional on the test result and therefore depend strongly on prevalence in the tested population. At a chosen threshold, sensitivity is TP/(TP+FN), specificity TN/(TN+FP), PPV TP/(TP+FP), and NPV TN/(TN+FN). These denominators should accompany percentages in reports. Accuracy is not a single immutable property of an assay: spectrum, disease definition, reference standard, setting, and threshold all affect its measured performance.

Suppose 1,000 people are tested, disease prevalence is 5%, sensitivity is 90%, and specificity is 90%. Then there are approximately 45 true positives, 5 false negatives, 95 false positives, and 855 true negatives. PPV is 45/(45+95)=32.1%; NPV is 855/(855+5)=99.4%. A test can therefore have apparently strong sensitivity and specificity while most positive results are false positives when disease is uncommon. Applying the same operating characteristics at 1% prevalence yields PPV below 9%, illustrating why validation cohort PPV should not be exported uncritically.

```r
N <- 1000; prevalence <- 0.05
sens <- 0.90; spec <- 0.90
tp <- N * prevalence * sens
fn <- N * prevalence * (1 - sens)
tn <- N * (1 - prevalence) * spec
fp <- N * (1 - prevalence) * (1 - spec)
c(TP = tp, FN = fn, TN = tn, FP = fp,
  PPV = tp / (tp + fp), NPV = tn / (tn + fn))
```

The values are expected counts, so fractional results can arise; round only for display. In a real study, use observed counts and confidence intervals. Wilson intervals generally behave better than simple Wald intervals for proportions, particularly near zero or one. For paired diagnostic tests applied to the same participants, account for paired outcomes when comparing sensitivities or specificities; treating estimates as independent wastes information and misstates uncertainty.

## Threshold selection and study design

Threshold choice encodes the consequences of false positives and false negatives. Screening may favor high sensitivity to avoid missed cases, followed by a confirmatory test; a toxic treatment decision may require higher specificity or a calibrated probability threshold based on expected benefit and harm. The threshold should be prespecified or selected in development data and evaluated independently. Optimizing a threshold and estimating its accuracy in the same small sample creates optimistic performance.

Diagnostic accuracy studies should recruit a representative clinical spectrum, apply the index test and reference standard to participants without verification bias, and blind interpretation where possible. Partial verification (only test-positive patients receive the reference standard), differential reference standards, and exclusion of indeterminate results can distort both sensitivity and specificity. Case-control samples containing clear advanced cases and healthy controls often inflate apparent accuracy compared with the intended-use population. STARD recommends describing recruitment, test conduct, thresholds, flow, missing results, and uncertainty.

Predictive values in practice can be recalculated from sensitivity, specificity, and target prevalence using Bayes' theorem, but this assumes those accuracy values transport to the target setting. If spectrum changes alter sensitivity or specificity, prevalence adjustment alone is insufficient. Report likelihood ratios as well: LR+ = sensitivity/(1−specificity), LR−=(1−sensitivity)/specificity. They update pretest odds to post-test odds, yet they too can vary across disease severity and clinical settings.

Pitfalls include interpreting NPV as proof that an individual is disease-free, omitting indeterminate tests, choosing a cutpoint after inspecting outcomes, and reporting predictive value without prevalence. For continuous tests, show threshold-specific tradeoffs and consider calibration, clinical utility, and harms from downstream testing. Reference standards are themselves imperfect; observed sensitivity and specificity are relative to the chosen reference definition.

- Bossuyt PM, Reitsma JB, Bruns DE, et al. STARD 2015: an updated list of essential items for reporting diagnostic accuracy studies. *BMJ*. 2015;351:h5527. https://doi.org/10.1136/bmj.h5527
- Leeflang MMG, Bossuyt PMM, Irwig L. Diagnostic test accuracy may vary with prevalence: implications for evidence-based diagnosis. *Journal of Clinical Epidemiology*. 2009;62:5–12. https://doi.org/10.1016/j.jclinepi.2008.04.007

- Leeflang MMG, Rutjes AWS, Reitsma JB, Hooft L, Bossuyt PMM. Variation of a test's sensitivity and specificity with disease prevalence. *CMAJ*. 2013;185:E537–E544. [doi:10.1503/cmaj.121286](https://doi.org/10.1503/cmaj.121286)

- Bland M, Altman DG. *Statistics with Confidence*. BNP Books.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Vickers AJ, Elkin EB. "Understanding the area under the receiver operating characteristic curve." *BMC Medical Informatics and Decision Making*. 2006.
- The library's "ROC curves and AUC" article shows how to compare thresholds across the full range of cut-offs.
