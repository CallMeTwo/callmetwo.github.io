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

## References and further reading

- Vickers AJ, Elkin EB. "Understanding the area under the receiver operating characteristic curve." *BMC Medical Informatics and Decision Making*. 2006.
- Bland M, Altman DG. *Statistics with Confidence*. BNP Books.
- Collett D. *Modelling Binary Data*. CRC Press.
- The library's "Sensitivity, specificity and predictive values" article builds the 2×2 table that each ROC point summarises.
