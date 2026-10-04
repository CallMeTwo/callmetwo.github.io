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

An estimand makes the treatment question explicit through population, treatment conditions, outcome, handling of intercurrent events, and population-level summary. The analysis method should estimate that quantity; ITT is an important analysis principle but does not by itself specify how treatment discontinuation, rescue therapy, or death enters the estimand. Lock the SAP before unblinding to comparative outcomes, retain version history, and describe deviations with timing and rationale. A SAP should specify sensitivity analyses for key assumptions (especially missing data), multiplicity strategy, and analysis populations rather than naming a method only at a high level.

## References and further reading

## SAP structure and estimand specification

## Worked SAP excerpt: continuous primary endpoint

## Sensitivity analysis matrix

## SAP for observational analyses

## Final alignment check

Record the approvers, date, protocol version, and whether treatment allocation was still masked when the SAP was finalized. Preserve superseded versions and change history for audit.

Keep the signed SAP accessible to the analysis team and publication reviewers, and maintain an immutable copy alongside output metadata.

For each prespecified sensitivity analysis, state the assumption varied, expected interpretation, and whether the result is confirmatory or supportive. Avoid adding analyses after unblinding without documenting rationale and timing. The final report should reconcile the signed SAP with executed code and explain deviations that could affect estimates, intervals, or decisions.

Maintain a table linking each protocol objective to endpoint, estimand, analysis population, model, contrast, missingness strategy, multiplicity treatment, and output shell. This crosswalk exposes inconsistencies early and supports review by clinicians, statisticians, programmers, and regulators. Any unresolved decisions should be settled before unblinding.

The SAP should also define coding of treatment, reference levels, units, rounding, software, and primary table denominators. When assumptions fail, a prespecified fallback hierarchy preserves transparency and reduces outcome-informed analytic choices. Review and sign off before unblinding.

Keep final analysis outputs traceable to SAP version, code commit, and locked dataset. The report should identify deviations, timing, rationale, and impact; an SAP is useful only when its decisions can be audited against analysis execution.

Confirm SAP language matches protocol endpoints, registration, sample-size assumptions, and reporting tables. Resolve inconsistent definitions before unblinding. For each analysis, identify data fields, population, estimand, model, contrast, interval, missingness, and multiplicity. Record the finalized signed version and ensure programming teams use it. Deviations after outcome access should be visible in the manuscript and supplement.

For an observational study, specify target-trial elements and estimand; define time zero, eligibility, exposure strategies, follow-up, outcome, censoring, and competing events. Predefine confounder selection from subject-matter causal structure, not significance screening. Specify propensity/outcome models, overlap diagnostics, balance metrics, weight stabilization/truncation, standardization target, and variance estimation. Define handling of time-varying confounding, informative censoring, and missingness. Include quantitative sensitivity analysis for unmeasured confounding and alternative exposure windows.

SAP should distinguish primary causal estimate from predictive/associational analyses and state assumptions. A propensity-score procedure does not guarantee causal inference; document positivity and target population changes due to restriction. Include falsification or negative-control analyses when scientifically justified and specify interpretation limits.

## Version control and deviation table

Use a versioned, signed SAP, cross-reference protocol/registry version, and log all changes. A final report should include a table of deviations: original plan, actual analysis, timing, reason, and potential impact. Even seemingly technical choices (covariate transformation, visit window, variance estimator) can change results and deserve documentation. Keep analysis code synchronized with the SAP and identify outputs generated before versus after unblinding.

Define a compact matrix of sensitivity analyses and their assumptions: alternative population (e.g. per-protocol), alternate covariance structure, different missing-data delta, censoring/competing-risk method, and influence of protocol deviations. Each analysis should answer a specified robustness question. Avoid a large unstructured collection of models whose only purpose is to see whether p crosses .05. Identify which results support the primary conclusion and which are exploratory.

For observational studies, an SAP should additionally describe causal diagram/adjustment rationale, target trial elements, confounder handling, positivity diagnostics, weight truncation, and unmeasured-confounding sensitivity. For prediction studies, specify model development, internal/external validation, calibration, discrimination, missing predictors, and decision-curve analyses. For diagnostic studies, prespecify reference standard, thresholds, indeterminate handling, paired comparisons, and subgroup spectrum.

## Reproducibility artifacts

## SAP review checklist

The final report should cite the SAP version used and identify any deviations that affected implementation.

## Primary analysis audit before database lock

Before lock, verify endpoint derivations against source records, confirm randomization strata and reference levels, reconcile subject counts, and test table shells on dummy data. Ensure missing-data flags and intercurrent-event variables are populated and treatment codes remain masked. The SAP should specify who signs off on queries, code review, and unblinding. After lock, record dataset snapshot, checksum, software versions, and any deviations.

If the primary model fails to converge, specify a prespecified fallback hierarchy (simpler covariance, alternative optimizer, or robust estimator) and criteria for use. A fallback should preserve estimand as much as possible and be documented, not chosen by favorable significance. Independent review of endpoint programming and treatment assignment checks can prevent avoidable errors.

Before approval, verify every primary objective maps to one estimand, endpoint definition, model, contrast, missing-data strategy, and table shell. Check that primary analysis matches protocol and registration, sample-size assumptions align with endpoint and model, and multiplicity is handled. Confirm that intercurrent events and censoring are operationalized. Ensure subgroup, sensitivity, safety, and interim sections distinguish confirmatory from supportive work. Independent statistical review can identify ambiguity before unblinding.

## Example output shells and data conventions

For a binary primary endpoint, shell should show N randomized/analyzed, event count, risk by arm, RD/RR or OR with CI, and missing count. For time-to-event, include events, censoring, median follow-up, KM probability at planned horizons, HR with PH diagnostics, and competing events. For continuous repeated data, show visit-specific N, means/SDs, adjusted contrasts, and covariance model. Footnotes should define populations, windows, imputation, and interval method. Consistent shells reduce later selective emphasis.

Define programming conventions: factor reference levels, units, date derivations, rounding, and handling of missing/out-of-range values. Store reusable derivations in version-controlled functions and validate against independently programmed results for primary endpoints. The SAP should not dictate every line of code, but must define decisions that affect the estimand or inference.

Create a shell for each planned table/figure, define denominators and derivation rules, and link each output to analysis code. Use a mock dataset to test output generation before lock. The SAP should specify data cut, database lock, unblinding, and analysis sequence. Maintain version history, reviewer comments, and approvals. A SAP that exists but is not followed should be accompanied by transparent deviations and impact assessment.

For an endpoint measured at baseline and week 12, an SAP might specify ANCOVA of week-12 score on randomized treatment, baseline score, and randomization strata; treatment contrast is adjusted mean difference with two-sided 95% CI. The analysis population is all randomized participants under treatment-policy strategy. Baseline is the last valid pre-randomization value; week-12 visit window is days 70–98 and selection among duplicates follows a prespecified rule. If missing week-12 outcomes occur, primary analysis uses likelihood-based repeated-measures model under MAR with treatment, visit, treatment-by-visit, baseline score, and stratification factors; MNAR sensitivity uses delta-adjusted imputation.

The SAP should also state model diagnostics, covariance structure, degrees-of-freedom approximation, intercurrent events, multiplicity status, and exact table shells. A vague clause that “appropriate methods will be used for missing data” is not operational enough for independent implementation.

## Blinding and analysis implementation

When possible, finalize the SAP while treatment is coded as A/B and before unblinding. Blinded review can verify data derivations and resolve data anomalies without revealing treatment contrasts. Record who accessed unblinded summaries and when. If post-unblinding changes occur, retain prior versions and clearly distinguish amendments informed by data from administrative clarifications.

Specify software and procedures for validated derivations, but avoid locking the SAP to a single package if equivalent implementations are acceptable. Independent programming review or double programming of key endpoints can detect errors. Resolve discrepancies against source definitions, not by choosing the output that supports a preferred conclusion.

An SAP translates protocol objectives into operational analyses before treatment codes are unblinded or outcome patterns inspected. It should identify trial phase/design, analysis populations, estimands, endpoint derivation, covariates, model, contrasts, multiplicity, missing-data assumptions, interim analyses, safety summaries, and software. Define each endpoint precisely, including instrument, scale, time point/window, baseline, event adjudication, composite components, and direction of benefit. State hierarchy of primary/secondary/exploratory objectives.

For each estimand, describe population, treatment conditions, variable, intercurrent-event strategy, and population-level summary. For a treatment-policy estimand, analyze outcomes regardless of discontinuation; for hypothetical strategies, specify modeling and assumptions. Do not hide these decisions under “ITT analysis.” Define analysis set membership and handling of protocol deviations before outcome comparisons.

## Model and data specifications

Name the model link, covariates, stratification factors, baseline adjustment, repeated-measures covariance, and effect scale. For time-to-event endpoints, define origin, event, censoring, competing events, and PH diagnostics or alternative estimands. For binary endpoints, specify denominator and missing outcome treatment. For continuous endpoints, define score algorithms and transformations. State how continuous covariates are modeled and avoid data-driven categorization.

Define data derivations with source variables, visit windows, duplicate handling, outlier policy, and treatment-emergent safety period. Specify coding of intercurrent events, rescue medication, death, and treatment discontinuation. Predefine rules for partial dates and inconsistent records. Include mock tables/listings/figures so analysis outputs and denominators are unambiguous.

## Multiplicity, missing data, and sensitivity analysis

Describe alpha allocation or testing hierarchy for multiple primary outcomes, doses, or interim looks. State whether subgroup analyses are confirmatory and how interactions are tested. For missing data, state primary assumption (e.g. MAR), model variables, imputation method/number, pooling, and MNAR sensitivity scenarios. For estimand sensitivity, identify alternative assumptions and analyses that probe robustness rather than create a menu for significance hunting.

Interim monitoring section should reference the charter, data monitoring committee, information fractions, boundaries/spending function, and firewalls preventing operational teams from seeing unblinded results. Safety analyses may be descriptive but should define denominators and exposure windows. Specify database lock, unblinding timing, and whether any analysis occurred before SAP finalization.

## Governance and amendment log

Version-control the SAP with author, reviewer, approval date, protocol version, and changes from prior versions. Any amendment after unblinding should be explicitly marked and justified; distinguish blinded pooled-data refinements from changes informed by treatment differences. Preserve analysis code and the exact dataset snapshot. An SAP is not a substitute for the protocol, monitoring charter, or clinical data standards, but it should cross-reference them consistently.

- ICH E9. Statistical Principles for Clinical Trials. 1998. https://database.ich.org/sites/default/files/E9_Guideline.pdf
- ICH E9(R1). Addendum on estimands and sensitivity analysis in clinical trials. 2019. https://database.ich.org/sites/default/files/E9-R1_Step4_Guideline_2019_1203.pdf
- Gamble C, Krishan A, Stocken D, et al. Guidelines for the content of statistical analysis plans in clinical trials. *JAMA*. 2017;318:2337–2343. https://doi.org/10.1001/jama.2017.18556

- ICH E9(R1). Addendum on estimands and sensitivity analysis in clinical trials. [Official guideline](https://www.ema.europa.eu/en/documents/scientific-guideline/ich-e9-r1-addendum-estimands-sensitivity-analysis-clinical-trials-guideline-statistical-principles-clinical-trials-step-5_en.pdf)

- Chow SC, Shao J, Wang H, Lokhnygina Y. *Sample Size Calculations in Clinical Research*. Chapman and Hall/CRC.
- ICH E9(R1). *Statistical Principles for Clinical Trials* (estimators and estimands).
- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott Williams & Wilkins.

The [randomized controlled trials article](../study-design/randomized-controlled-trials.html) covers the trial protocol that a SAP complements.
