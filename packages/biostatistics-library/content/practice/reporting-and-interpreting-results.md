---
title: Reporting and interpreting results
summary: Reporting guidelines (CONSORT, STROBE, STARD) and the interpretive discipline — confidence intervals, effect sizes, and the difference between statistical and clinical significance.
---

## Overview and key ideas

A result is not reported until it has been *communicated*: a number with its uncertainty, in a context a reader can evaluate. The field has settled on **reporting guidelines** — structured checklists that specify what must be stated for each study design — and most journals require the relevant one:

- **CONSORT** — randomised controlled trials: flow of participants through allocation and analysis, the primary analysis exactly as pre-specified, and all results for all prespecified endpoints.
- **STROBE** — observational studies (cohort, case–control, cross-sectional): the population, why, exposure and outcome definitions, confounders considered, and the quantitative measures of association with their precision.
- **STARD** — diagnostic accuracy studies: the reference standard, blinding of readers, the 2×2 counts, and sensitivity/specificity (or, where appropriate, likelihood ratios and ROC points).

Beyond the checklist, good reporting means three things about every key result: (1) the **point estimate** (the effect size, in clinically meaningful units), (2) its **uncertainty** (95% confidence interval), and (3) the **interpretation in plain terms** — what the number means for the patient, not just for the p-value. A result reported as only "p = 0.03" discards the two most important pieces of information.

The interpretive core: **statistical significance is not the finding; the effect size and its precision are the finding.** The p-value answers a fixed null question; the confidence interval answers the useful one — how large, and how precisely estimated, is the effect? A narrow interval that excludes both the null and the minimal clinically important difference is a genuinely reassuring result; a wide interval that merely fails to reach 0.05 is a much weaker claim, and the two must not be presented the same way.

## When to use it

| Setting | Example question |
| --- | --- |
| A finished RCT | Does the manuscript report the CONSORT flow, the pre-specified primary analysis, and effect sizes with CIs for every key endpoint? |
| An observational cohort | Are the exposures, outcomes, and confounders defined clearly enough (STROBE) that the hazard ratio can be judged for residual confounding? |
| A diagnostic test evaluation | Is the reference standard and the blinding of test readers stated (STARD), so the sensitivity is not inflated by verification bias? |
| A journal submission | Does the paper state which guideline it followed, with the completed checklist as a supplement? |

These rules apply to any quantitative result in a paper, abstract, conference slide, or press release. The guideline is chosen by the *design of the study*, not by what is convenient to report.

## Assumptions and limitations

- **Guidelines are checklists, not validators** — a CONSORT-compliant trial can still be biased by poor randomisation or selective follow-up; the checklist makes the bias *visible*, not absent.
- **The confidence interval inherits the model's assumptions** — a CI around a hazard ratio presumes proportional hazards; around a regression coefficient, linearity and independent errors. Reporting the CI without checking its assumptions is reporting a number, not a guarantee.
- **STARD results are only as good as the reference standard** — if the "gold standard" is imperfect or differs by group, sensitivity and specificity are mismeasured in a direction the 2×2 table cannot reveal.
- **A reporting guideline cannot fix a study that wasn't designed to answer the question** — post-hoc subgroup "findings" reported as if confirmatory are the most common interpretive failure, and no checklist can launder them.

## Worked example

A 500-patient RCT of a new vaccine reports, per CONSORT: 250 per arm randomised, 246 and 244 analysed; 9 cases in vaccine, 21 in placebo. The hazard ratio for infection is 0.42 (95% CI 0.19–0.93), p = 0.031.

The correct interpretation is layered. First, the *effect*: vaccinated patients had about 58% fewer infections (HR 0.42), and the 95% CI (0.19–0.93) says the true protection could plausibly range from 7% to 81% — so the result is statistically significant but imprecisely estimated. Second, the *clinical* read: even the worst end of the interval (HR 0.93) is a small benefit, while the central estimate is large; the authors should state whether a 58% relative reduction meets the threshold for adoption given cost and side effects. Reporting only "p = 0.03, vaccine effective" would have discarded the range and the magnitude. The CONSORT flow table lets a reader confirm the 250→246/244 drop did not break the randomisation.

## Interpretation and common pitfalls

- **Treating p < 0.05 as "real" and p ≥ 0.05 as "nothing"** — significance is a binary gate the data crossed by chance of the null; the size and precision of the effect, from the CI, carry the scientific content.
- **Reporting a p-value without the estimate and CI** — the most common and most damaging omission; it makes the effect size and its uncertainty unknowable to the reader.
- **Cherry-picking significant subgroup or secondary endpoints** as if they were the primary analysis; the guideline (and the SAP) exist to prevent exactly this.
- **Conflating statistical and clinical significance** — a highly significant 1-point blood-pressure change may be clinically trivial, while a borderline 15-point change may be transformative; both require the effect size in context, not just the p.

Reporting recommendations change over time: use the current design-specific checklist (CONSORT 2025 for randomized trials, STROBE for observational studies, STARD for diagnostic accuracy, and TRIPOD+AI for prediction models using regression or machine learning). A checklist supports completeness; it neither certifies low risk of bias nor substitutes for protocol/SAP access. Report denominators, missingness, analysis populations, effect scale, precision, and deviations from planned methods. Interpret intervals against a clinically meaningful threshold where one is defined, and avoid treating a 95% confidence interval as a 95% probability statement about the fixed parameter.

## References and further reading

- CONSORT 2025. [BMJ 2025;389:e081123](https://doi.org/10.1136/bmj-2024-081123)
- STROBE Statement. [The Lancet 2007;370:1453–1457](https://doi.org/10.1016/S0140-6736(07)61602-X)
- Bossuyt PM, Reitsma JB, Bruns DE, et al. STARD 2015. [BMJ 2015;351:h5527](https://doi.org/10.1136/bmj.h5527)
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378)

- Altman DG, Schulz KF, Moher D. *The CONSORT Statement: Revised Recommendations for Reporting Parallel Group Randomised Trials*. BMJ.
- von Elm E, Altman DG, Egger M, Pocock SJ, Gøtzsche PC, Vandenbroucke JP. *The STROBE Statement: Strengthening the Reporting of Observational Studies in Epidemiology*.
- Bland M. *Statistics in Practice: A Guide to the Statistical Methods in Medicine and the Health Sciences*. Chapman and Hall.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.

The [confidence intervals article](../inference/confidence-intervals.html) develops the interval interpretation used throughout.
