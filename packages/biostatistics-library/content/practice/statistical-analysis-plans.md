---
title: Statistical analysis plans
summary: A pre-specified contract between the statistician and the data — fixing estimands, analysis populations, methods, and decision rules before results are seen.
---

## Overview and key ideas

A **statistical analysis plan (SAP)** is a written document, finalized and locked *before* the primary data are unblinded, that specifies exactly how a study will be analysed. It is the difference between a study and a fishing expedition: once the data can be looked at, every subsequent analytic choice — which endpoint, which covariates, which model, which multiplicity adjustment — is either "as planned" or an exploratory detour.

A SAP protects the **integrity of the inference**. Without it, the analyst (consciously or not) can try variations until something turns out significant — the multiple-comparisons problem in disguise. With a locked SAP, the primary analysis carries a pre-committed error rate, and anything else is honestly labelled.

The SAP also serves the people who did not run the analysis: reviewers, regulators, and the next team member who inherits the dataset. It is the single place where the question "which of the many defensible analyses is *the* analysis?" has an answer that was chosen before the outcome was known.

The core components of a trial SAP:

- **Estimands** — for each endpoint, precisely what is being measured: the population, the variable, how intercurrent events (discontinuation, rescue medication, death) are handled, and the summary measure (primary, key secondary, other).
- **Analysis populations** — the randomised (intention-to-treat) population for the primary analysis, and any per-protocol or as-treated populations with their justification.
- **Methods for each analysis** — the exact model (e.g. Cox regression with covariables), the covariate set, how missing data will be handled, and the multiplicity strategy that controls the overall type I error across all hypothesis tests.
- **Decision rules and stopping** — interim analysis schedules, the boundary for efficacy or futility, and what triggers a protocol deviation in analysis.
- **Secondary and exploratory analyses** — pre-specified, but explicitly not driving the primary claim.

The document is **versioned and frozen** at a named lock date, with a sign-off process. Amendments after the lock require a documented rationale and are flagged in the report.

## When to use it

| Setting | Example question |
| --- | --- |
| Phase III randomized trial | What is the primary analysis, the covariate model, and the type I error allocation across the three co-primary endpoints? |
| Non-inferiority trial | What non-inferiority margin was chosen, on which scale, and is the primary estimand an ITT or a modified ITT? |
| Adaptive trial | What are the interim rules, how does the design adapt (sample size re-estimation, dose selection), and how is the overall error preserved? |
| Real-world / registry study | Which confounders enter the model, how is missingness handled, and which analyses are confirmatory vs exploratory? |

A SAP is expected in essentially every registered clinical trial and is a core requirement of most regulatory submissions. For observational work the same logic applies, even if the document is less formal.

## Assumptions and limitations

- **The SAP fixes the method, not the truth** — a well-specified analysis can still be wrong if the study design, endpoint, or assumptions are flawed. The SAP controls analytical freedom; it does not guarantee a correct conclusion.
- **Locking too early is as bad as not locking** — if the SAP is written before the feasibility of an endpoint is known, it may prescribe an analysis that cannot be run. The right time is after design and feasibility are settled, before the primary unblinding.
- **A SAP cannot anticipate every data surprise** — a large dropout rate or a data-quality issue discovered at analysis will require a deviation. The discipline is to document the deviation and its reason, not to silently improvise.
- **Multiplicity must be addressed, not ignored** — a SAP that runs ten tests and reports the smallest p-value has no valid error rate; the plan must state how the overall alpha is allocated.

## Worked example

A phase III trial of a new antihypertensive has a co-primary: systolic BP change at 12 weeks, analysed in the ITT population. The SAP, locked four weeks before unblinding, specifies: mixed-effects model for repeated measures with baseline systolic, age, sex, and site as covariates; multiple imputation (m = 50) for missing visits with MAR assumed; a closed-testing multiplicity strategy that allocates alpha = 0.025 to each co-primary before any secondary looks.

At unblinding, 14% of 12-week values are missing. Because the SAP already mandated imputation, the team runs exactly that — no ad-hoc "let's try complete cases and see." The co-primary p-value is 0.008, within the pre-allocated 0.025, so it is declared significant. The second co-primary, tested next in the closed-testing sequence, inherits the unused alpha and also passes. The report states: "Primary analyses as per SAP v3.2, locked 12 March; no deviations from the statistical methods occurred."

## Interpretation and common pitfalls

- **The SAP is not a data-collection protocol** — it does not say who gets enrolled or how the drug is given; it says how the collected data will be turned into conclusions.
- **"As planned" must be verifiable** — if the report does not cite the SAP version and the lock date, a reviewer cannot confirm the primary analysis was the one committed to.
- **Pre-specifying everything is not the goal** — the SAP locks the primary and confirmatory analyses; it should leave honest room for genuinely new exploratory questions, clearly labelled as such.
- **The SAP should be written with the data in hand, not before it** — the covariate list, the handling of missing data, and the multiplicity design should reflect what is actually feasible, which is why the lock comes late in the timeline, not at protocol start.

## References and further reading

- Chow SC, Shao J, Wang H, Lokhnygina Y. *Sample Size Calculations in Clinical Research*. Chapman and Hall/CRC.
- ICH E9(R1). *Statistical Principles for Clinical Trials* (estimators and estimands).
- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott Williams & Wilkins.

*The topic map's "Study design" section covers the trial protocol that the SAP complements (article planned).*
