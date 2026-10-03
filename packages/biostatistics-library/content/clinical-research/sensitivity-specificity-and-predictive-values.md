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

## References and further reading

- Bland M, Altman DG. *Statistics with Confidence*. BNP Books.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Vickers AJ, Elkin EB. "Understanding the area under the receiver operating characteristic curve." *BMC Medical Informatics and Decision Making*. 2006.
- The library's "ROC curves and AUC" article shows how to compare thresholds across the full range of cut-offs.
