---
title: Systematic reviews
summary: A structured, reproducible method for locating, appraising and synthesising all relevant studies on a clinical question.
---

## Overview and key ideas

A systematic review answers a clearly formulated question by locating *all* relevant studies through a comprehensive, pre-specified search, selecting them against explicit eligibility criteria, appraising their risk of bias, and summarising the results. What distinguishes it from a narrative review is not the effort but the *process*: every step — search strings, databases, inclusion rules, quality checks — is documented before results are seen, so another team could repeat the work and reach the same study set.

The standard workflow is: (1) frame a focused PICO-style question; (2) write the protocol, ideally registered (e.g. PROSPERO); (3) run the documented search across databases and grey literature; (4) screen titles/abstracts, then full texts, usually with two independent reviewers; (5) extract data and assess risk of bias (e.g. the Cochrane Risk of Bias tool for trials); and (6) synthesise narratively — or quantitatively via meta-analysis when the studies are similar enough to pool.

The final product should be reportable step by step, and most teams use the PRISMA checklist to ensure none of the steps — including how disagreements between reviewers were resolved and who funded the review — is left out of the report.

## When to use it

| Setting | Example question |
| --- | --- |
| Clinical guideline development | What is the comparative effectiveness of biologic agents in moderate-to-severe Crohn's disease? |
| Pre-surgical decision support | Does routine intraoperative antibiotic prophylaxis reduce infection after spine surgery? |
| Drug safety | What is the risk of tendon rupture with fluoroquinolones in adults over 60? |
| Resource allocation | Is home-based telemonitoring cost-effective for heart failure follow-up? |

## Assumptions and limitations

- **What you do not find, you cannot use** — the review is only as complete as its search; unindexed, unpublished and non-English studies (the "grey literature") are systematically missed, which biases results toward published, positive trials.
- **Eligibility is a choice, not a fact** — excluding studies after seeing their results (e.g. dropping small trials that hurt the conclusion) invalidates the review; criteria must be fixed in the protocol.
- **Garbage in, garbage out** — pooling high-bias studies gives a precise estimate of the wrong quantity; the risk-of-bias appraisal must feed the conclusions, not just a table.
- **Staleness** — evidence moves; a review is a snapshot, and for fast-moving fields it should be treated as a date-stamped summary rather than a permanent verdict.

## Worked example

Question: does early goal-directed therapy (EGDT) reduce mortality in septic shock, or has it been superseded by bundle care? A team registers a PROSPERO protocol, searches MEDLINE, Embase and CENTRAL (plus trial registries and reference lists) through a fixed date, and applies pre-set inclusion rules: adult ICU trials, EGDT versus usual or bundle care, all-cause mortality at 28 days. They screen 1,240 records, read 94 full texts, and include 7 RCTs. Two reviewers independently extract outcomes and flag 4 trials with unclear allocation concealment. The narrative synthesis concludes that EGDT does not outperform structured bundle care on 28-day mortality — consistent with the large PROCESS trial — so the intervention is not adopted, even though early small trials had suggested a mortality benefit.

Interpretation: the same clinical question, asked decades apart, produced opposite answers; only by pulling *all* the trials — including the larger, negative ones the earlier reviews never contained — could the field move on. That shift from hopeful small studies to null large trials is exactly what a systematic review is built to reveal, and it is why its conclusions carry so much weight.

## Interpretation and common pitfalls

- Treating a systematic review as automatically "the best evidence": if it includes only biased trials, or missed key studies, its summary can mislead just like a single poor trial.
- Ignoring the risk-of-bias table: a pooled estimate from several high-risk trials is a precise estimate of a questionable quantity, not a reliable effect.
- Assuming the search is exhaustive: if the review did not include grey literature or non-English work, the result set may be skewed toward positive findings.
- Reading an older review as current: check the search date and any subsequent updates before basing a decision on it.
- Assuming the review's included studies answer the exact question your patient raises; if eligibility criteria excluded, say, comorbid kidney disease, the conclusion may not transfer to a patient with it — the protocol's criteria define the answer's scope.

Define eligibility and outcomes before searching, and publish a protocol where feasible. A complete search is reproducible only when databases, platforms, dates, full strategies, language restrictions, and supplementary sources are reported. Duplicate independent screening and extraction reduce errors; resolve disagreement by a documented process. Risk-of-bias assessment is study- and outcome-specific, and certainty of evidence is not the same as statistical significance or the pooled estimate. PRISMA improves reporting transparency but does not guarantee that the review methods are unbiased.

## References and further reading

## Protocol, eligibility, and search architecture

## Search sensitivity, precision, and reproducibility

## From review question to analytic framework

Eligibility criteria should be operational enough that two reviewers can apply them consistently. Define design restrictions, minimum follow-up, intervention dose, comparator, setting, outcome construct, and allowable study report types. Avoid outcome-driven inclusion decisions after seeing results. For broad questions, use a framework such as PICOS; for diagnostic reviews, define index test, target condition, reference standard, and intended clinical role; for prognosis, define population at risk, prognostic factor/model, outcome, and prediction horizon.

Specify the primary estimand and synthesis strategy before extracting effects. For interventions this may be assignment effect at 12 months; for diagnostic tests, sensitivity/specificity at thresholds; for prognosis, calibration and discrimination at horizon. Decide how to handle multiple reports, arms, time points, and adjusted versus unadjusted estimates. Prefer estimates aligned with the causal question, but do not select the most favorable model.

## Data extraction and verification

## Search update and automation risks

## Protocol deviations and transparent decisions

Common deviations include adding outcomes after seeing studies, changing eligibility to enable pooling, or switching effect measure because one is significant. Maintain a dated amendment log with reason, timing, and whether results were known. Distinguish clarifications that do not affect evidence from analytic changes that can alter conclusions. Protocol registration improves transparency but does not eliminate selective decisions; compare final methods with protocol and explain differences.

## Interpreting evidence for decisions

A systematic review synthesizes evidence but does not itself guarantee certainty or applicability. Assess whether included populations, care settings, baseline risks, and intervention delivery match the decision context. Translate pooled effects to absolute effects for the target population and horizon, and discuss harms, resource use, equity, and patient preferences. When evidence is low certainty, recommendations should reflect uncertainty rather than present a pooled estimate as settled truth.

Automated deduplication and screening tools can improve efficiency but may merge distinct reports or miss records due to metadata variation. Retain original citation IDs and audit a sample of deduplication decisions. Machine-learning prioritization can order records but stopping after a fixed number of irrelevant citations risks missed eligible studies; define validation/recall safeguards. Record software, version, and human oversight. Search automation should not obscure reproducible search strings.

When updating a review, search from the last search date with validated strategy and rerun deduplication against prior records. Screen new records under the same criteria, reconcile amendments, and update PRISMA flow. If the review conclusion changes, explain which new evidence drove the change and whether synthesis methods remained constant.

## Review bias and conflicts

## Evidence tables and data visualization

Archive protocol, search exports, screening decisions, extraction sheets, risk-of-bias judgments, and analysis code with version identifiers. This audit trail is essential when reviewers ask how a particular estimate or exclusion was derived.

## Protocol registration and amendments

Register the review protocol before screening where possible. Include eligibility, search strategy, outcomes, synthesis plans, and risk-of-bias tools. Amendments may be necessary as the evidence landscape becomes clear, but date them and explain whether knowledge of results could have influenced the choice. Compare protocol, registration, and final report systematically. If a planned meta-analysis is not performed because studies differ, explain why; if an unplanned synthesis is added, label it exploratory.

Registration does not ensure quality or prevent duplication. Check for existing reviews and explain how the new question differs. For living reviews, version the protocol and document update procedures. Share search strings and extraction templates to support replication.

Evidence tables should summarize study population, design, intervention/comparator, outcomes, follow-up, effect estimate, and risk of bias. Keep outcome time points explicit and avoid combining incompatible scales. Summary-of-findings tables show baseline risk, absolute effect, relative effect, participants/studies, certainty, and key footnotes. Forest plots should display study-level data and pooled estimate; harvest or effect-direction plots can help when pooling is not defensible. Visuals should not replace a transparent narrative of heterogeneity and limitations.

Use consistent direction of benefit across outcomes and document conversions. Data extraction from figures should be flagged as estimated. Provide supplementary tables with all included studies and excluded full texts, as permitted. A reader should be able to trace each conclusion back to underlying evidence.

Review authors' eligibility and interpretation decisions can be influenced by prior views or funding. Disclose conflicts and funding, use independent screening/extraction, and consider external peer review of protocol and search strategy. Industry-funded trials may differ in comparators and reporting; assess trial-level funding as context but do not substitute it for domain-based risk-of-bias assessment.

Pilot a structured extraction form on several studies. Extract arm-level denominators, events, means/SDs, adjusted estimates, covariate sets, follow-up, and missingness. Capture page/table/figure source for every number and note whether values were digitized from plots or derived. Double-check critical outcomes independently. Contact authors for clarifications and log attempts. Harmonize units and direction with a reproducible transformation script while retaining original values.

When studies report multiple adjusted estimates, choose according to a prespecified hierarchy (e.g. most fully adjusted without post-treatment mediators) and extract covariate set. Mixing adjusted and crude estimates can create heterogeneity. For cluster trials, adjust for intracluster correlation; for crossover, use paired variance; for multi-arm studies, account for shared comparators. The review analysis should respect the original design.

## Synthesis without pooling

When meta-analysis is inappropriate, structured synthesis should still compare study effects and uncertainty. Organize by intervention/comparator, outcome, setting, and risk of bias; describe direction and magnitude rather than count how many p-values are below .05. Vote counting by significance is misleading because power differs. Tables and visual displays such as harvest plots or effect-direction plots can summarize patterns, but avoid discarding intervals and sample size.

Use SWiM reporting guidance when synthesis without meta-analysis. Explain grouping, prioritization, metric, and how evidence was synthesized. State why pooling was not appropriate and what can/cannot be concluded. Qualitative synthesis does not mean informal narrative; it still needs transparent methods.

Search strategies trade sensitivity against precision. For intervention reviews, broad synonyms and controlled vocabulary reduce missed records; overly restrictive filters for randomized design or human studies can omit poorly indexed records. Validate search strings against a set of known relevant studies and ask an information specialist to peer-review the strategy (PRESS). Record database platform because syntax and indexing vary. Deduplicate records reproducibly and preserve both original and deduplicated exports.

Update searches immediately before final synthesis if publication delay is long. Use trial registries and regulatory sources to find unpublished outcomes, and cite search dates. Citation chasing can find reports not captured by terms but is not a substitute for systematic database search. Contact authors for missing details using a standard, documented process.

## Screening reliability and adjudication

Two reviewers reduce erroneous exclusion, especially at full text. During pilot screening, calculate agreement only as a process check; kappa is prevalence-sensitive and is not a quality score. Resolve disagreement through discussion using written eligibility rules, then third-review adjudication if unresolved. Maintain a decision log when criteria are clarified. Screening software can prioritize records but human verification and transparent stopping rules remain necessary.

Full-text exclusion reasons should be mutually exclusive and assigned consistently. One report may describe multiple studies; link reports to studies so participants are not double-counted. Conversely, one study may have multiple publications with distinct outcomes or follow-up; consolidate them under a study identifier before extraction.

## Certainty, evidence profiles, and conclusions

GRADE certainty applies to a specific outcome and body of evidence, not an article's overall quality. Imprecision considers whether intervals include materially different decisions; inconsistency considers magnitude/direction and plausible explanations; indirectness considers population/intervention/outcome alignment; publication bias considers missing evidence. Absolute effects should use an appropriate baseline risk and horizon, with assumptions stated. A strong recommendation cannot be inferred mechanically from high certainty; values, resources, equity, and feasibility matter.

Conclusion language should match certainty. “Evidence suggests” and “we are uncertain” are often more accurate than definitive causal claims from low-certainty observational studies. Highlight evidence gaps and applicability, not only pooled significance. Explain whether recommendations are author interpretations or formal guideline panel judgments.

A systematic review starts with a protocol that defines the question, population, interventions/exposures, comparators, outcomes, study designs, setting, and follow-up. A PICO question is a useful scaffold but may need extensions for diagnostic, prognostic, qualitative, or economic evidence. Specify primary versus secondary outcomes, time points, effect measures, subgroup hypotheses, and synthesis plans. Register in PROSPERO when eligible or publish a protocol; amendments should be dated and justified before results are known where possible.

Search at least two relevant bibliographic databases and add trial registries, grey literature, reference lists, and citation tracking according to topic. Combine controlled vocabulary and free-text synonyms, adapt syntax to each platform, and seek information specialist review. Report exact strategies, dates, limits, and deduplication. A search ending years before publication can miss emerging evidence; update searches before final synthesis. Language restrictions and publication filters can introduce selection bias and should be justified.

## Screening, extraction, and risk of bias

Use two independent reviewers for title/abstract and full-text screening or a documented alternative with verification. Resolve disagreement through consensus or a third reviewer. Maintain reasons for full-text exclusion and present PRISMA flow counts. Pilot screening criteria and data extraction on diverse records to refine ambiguous definitions before full abstraction. Extract study design, setting, sample, interventions, outcome definitions, follow-up, analysis, funding, and conflicts, as well as numerical data needed for effect estimates.

Risk-of-bias tools are design-specific: RoB 2 for randomized trials, ROBINS-I for nonrandomized intervention studies, QUADAS-2 for diagnostic accuracy, and QUIPS for prognostic studies. These assess domains tied to a result, not a single vague quality score. Assessors should judge each domain using supporting quotations and rationale. Risk-of-bias assessments inform certainty and sensitivity analyses; excluding all high-risk studies is not automatically appropriate because it may change the question and reduce evidence.

## Synthesis decisions and certainty

Decide whether meta-analysis is appropriate based on clinical and methodological comparability, not merely statistical test results. If pooling is inappropriate, use structured tables and synthesis without meta-analysis methods that preserve effect direction, magnitude, and uncertainty; avoid vote counting by statistical significance. For pooling, choose model/effect scale and handle multiple outcomes, missing SDs, cluster designs, and multi-arm correlations in advance. Explore heterogeneity with prespecified moderators and prediction intervals.

GRADE assesses certainty across risk of bias, inconsistency, indirectness, imprecision, and publication bias for each outcome. Certainty is not a mechanical average and can differ across outcomes in the same review. Explain downgrading/upgrading decisions and link evidence to absolute effects at a relevant baseline risk. Distinguish certainty of evidence from strength of recommendation, which also involves values, resource use, equity, feasibility, and acceptability.

## Reproducibility and living updates

Maintain a review dataset with stable record IDs, search exports, screening decisions, extraction sources, and analysis scripts. Preserve original reports and page/table references for every extracted number. A living review requires surveillance intervals, update triggers, versioned search strategies, and transparent change logs; not every review needs continuous updating. Report PRISMA 2020 items, funding, conflicts, protocol deviations, and data/code availability. Reproducibility means another team can trace each included study and reproduce transformations from source data to synthesis.

- Page MJ, McKenzie JE, Bossuyt PM, et al. PRISMA 2020 statement. *BMJ*. 2021;372:n71. https://doi.org/10.1136/bmj.n71
- Sterne JAC, Savović J, Page MJ, et al. RoB 2: a revised tool for assessing risk of bias in randomized trials. *BMJ*. 2019;366:l4898. https://doi.org/10.1136/bmj.l4898
- Sterne JA, Hernán MA, Reeves BC, et al. ROBINS-I: a tool for assessing risk of bias in non-randomised studies of interventions. *BMJ*. 2016;355:i4919. https://doi.org/10.1136/bmj.i4919

- Page MJ, McKenzie JE, Bossuyt PM, et al. The PRISMA 2020 statement: an updated guideline for reporting systematic reviews. *BMJ*. 2021;372:n71. [doi:10.1136/bmj.n71](https://doi.org/10.1136/bmj.n71)

- Higgins JPT, Thomas J, Chandler J, Cumpston M, Li T, et al. *Cochrane Handbook for Systematic Reviews of Interventions*, 2nd edn. Wiley-Blackwell.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland M, Altman DG. *Statistics with Confidence*. BNP Books.
- The library's "Meta-analysis and forest plots" article covers the quantitative synthesis step.
