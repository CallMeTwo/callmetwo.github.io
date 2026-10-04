---
title: Cohort and case-control studies
summary: Two observational designs that track the exposure-to-outcome route — cohorts follow exposed subjects forward in time, case-control studies compare past exposures of cases and controls.
---

## Overview and key ideas

A **cohort study** starts from the exposure: exposed and unexposed individuals are identified and followed over time, and outcome rates are compared between the two groups. It estimates incidence (cumulative incidence or incidence rate) directly, and the effect measure is the **relative risk (RR)**. A cohort can be *prospective* — exposure ascertained before any outcome, the classical form — or *retrospective* — exposure and outcome both recovered from existing records (hospital or employment registers). The time direction of inference is the same in both; only the calendar direction differs.

A **case-control study** starts from the outcome: people with the outcome (cases) and people without it (controls) are selected, and their past exposures are compared. Because the numbers of cases and controls are fixed by design, incidence cannot be estimated; the natural effect measure is the **odds ratio (OR)**, which approximates the relative risk when the outcome is rare in the source population (**rare-disease assumption**).

A third distinction matters in practice: in a cohort, the effect can be reported as a relative risk (risk ratio) or, with person-time follow-up, as a **rate ratio** using incidence rates; in a case-control study, the only directly estimable ratio is the odds ratio. The case-control OR can be converted to a risk ratio only when the outcome incidence in the source population is known from an independent source — otherwise it should be reported as an odds ratio, full stop.

The two designs are mirror images: a cohort fixes the exposure and watches for the outcome; a case-control fixes the outcome and looks back for the exposure.

A further efficiency point: a cohort can answer several outcome questions at once from a single follow-up (hence "cohort studies" as long-running research programmes), while a case-control study is built around one outcome and one exposure — extending it to a second outcome requires a fresh selection of cases and controls.

## When to use it

| Setting | Example question |
| --- | --- |
| Rare outcome, well-defined exposure | Does a particular gene variant predispose to early-onset Alzheimer disease? (A case-control study finds enough cases; a cohort would wait decades.) |
| Common exposure, rare or slow outcome | Silica dust exposure and lung cancer incidence among mine workers over 20 years (prospective or record-based cohort). |
| Long latency, waiting is infeasible | Cigarette smoking and lung cancer, reconstructed from registry records (retrospective cohort) or exposure histories (case-control). |
| One exposure, several outcomes | A women's health cohort: incidence of fracture, coronary disease, and breast cancer in hormone-therapy users vs non-users. |
| Newly identified exposure | A case-control study of cancer cluster near a new industrial chemical release. |

Rule of thumb: a cohort is more efficient when the exposure is common; a case-control study is more efficient when the outcome is rare. A practical way to choose is to ask which arm of the mirror image is cheap: if you can identify and follow the exposed, do a cohort; if you can identify cases from a registry or hospital system, do case-control.

## Assumptions and limitations

- **Cohort** — long follow-up for rare outcomes is expensive and produces loss to follow-up; incidence estimates assume the cohort is representative of the exposed source population; the at-risk time scale must be handled correctly (person-time vs cumulative incidence).
- **Cohort** — if the outcome develops at different times, comparing proportions (cumulative incidence) and rates (incidence per person-time) can give different pictures: a cohort with longer follow-up in the exposed group will show higher cumulative incidence even if the hazard is identical.
- **Case-control** — controls must be sampled from the same **source population** that generated the cases; selecting hospital controls who share the exposure of interest (Berkson selection bias) inflates or deflates the OR.
- **Case-control** — the OR ≈ RR approximation holds only when the outcome is rare in the source population; for common outcomes the OR overstates the RR.
- **Both** — exposure measurement error and recall bias (worse in case-controls, where cases and controls interview differently); confounding is handled by design (restriction, matching) or analysis (stratification, regression), not by the design itself.

## Worked example

A retrospective cohort followed 4,000 long-term smokers and 4,000 never-smokers for 20 years using hospital and death records. One hundred twenty lung cancers occurred among smokers and 12 among never-smokers. Cumulative incidence: 120/4,000 = 3.0% vs 12/4,000 = 0.3%, so RR = 3.0% / 0.3% = **10.0**.

In a separate case-control study, 200 incident lung-cancer cases and 200 age-matched controls were interviewed. Smoking history was present in 160 cases and 80 controls. OR = (160 × 120) / (40 × 80) = **6.0**.

Both point to a strong association; the OR of 6.0 is a reasonable approximation of the RR here because lung cancer is uncommon in the source population over 20 years. If the outcome were common, the OR would overstate the relative risk and should be reported as an odds ratio, not a risk ratio. Note also the contrast in denominators: the cohort's 120 vs 12 events are incidence counts from 8,000 person-followed subjects, while the case-control counts (160 vs 80) are exposure counts in selected cases and controls — the two 2×2 tables answer different questions even though they come from the same population.

## Interpretation and common pitfalls

- Treating a case-control odds ratio as a relative risk when the outcome is common — the OR is then an overestimate of the RR.
- Selecting controls from the same hospital as cases for a condition with a shared exposure (e.g., comparing stroke to angina in a cardiac ward) — Berkson bias, not a valid reference.
- **Immortal time bias** in retrospective cohorts: defining exposure as "ever treated" counts follow-up time before treatment initiation as exposed, artificially favouring the exposed group.
- Matching cases and controls on a variable and then ignoring the matching in the analysis (or matching on a non-confounder such as the outcome's consequence, which can induce bias).
- Using a single control group when the source population is heterogeneous: matching on age, sex, or calendar period, or using two control groups, reduces residual confounding from the strongest, well-measured variables.
- Reporting the OR from a hospital-based case-control study as if it applied to the whole population: the OR is valid for the source population from which the cases arose (that hospital's catchment), not automatically for the nation.

## References and further reading

- [STROBE Statement](https://www.strobe-statement.org/), reporting guidance for cohort, case-control, and cross-sectional studies.
- Hernán MA, Robins JM. [*Causal Inference: What If*](https://www.hsph.harvard.edu/miguel-hernan/causal-inference-book/). Chapman & Hall/CRC, 2020.
- Rothman KJ, Greenland S, Lash TL, eds. *Modern Epidemiology*. 3rd ed. Lippincott Williams & Wilkins, 2008.
- Klein J, Moeschberger M. *Survival Analysis: A Self-Learning Text*. Springer.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.

The [bias and confounding article](/biostatistics-library/study-design/bias-and-confounding.html) develops selection, information, and confounding bias in detail.
