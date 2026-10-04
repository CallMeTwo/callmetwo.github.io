---
title: Systematic reviews
summary: A structured, reproducible method for locating, appraising and synthesising all relevant studies on a clinical question.
---

## Overview

A systematic review uses explicit, reproducible methods to identify, select, appraise, and synthesize studies addressing a focused question. It differs from a narrative overview because eligibility, search, screening, data extraction, and synthesis decisions are documented in advance. A review can be systematic without a meta-analysis; pooling is appropriate only when studies estimate sufficiently compatible quantities.

A review is a research study with its own risks of bias. Incomplete searches, selective eligibility, data extraction errors, and unjustified pooling can mislead even when the included trials are well conducted. The protocol, audit trail, and careful interpretation are part of the evidence.

## Shape the question and eligibility

Define population, intervention or exposure, comparator, outcomes, design, setting, and follow-up. For diagnostic reviews, specify index test, reference standard, target condition, and participant spectrum. For qualitative or mixed-method reviews, use frameworks suited to those questions rather than forcing PICO. Eligibility criteria should distinguish the scientific scope from convenience restrictions such as language or publication status.

Choose primary outcomes and time points before screening. A single study may report multiple scales, analyses, and follow-ups. Specify which result is eligible and rules for selecting among them. Define unit of inclusion: report, study, trial, cohort, or dataset. Several publications can describe the same participant sample; treating them as independent studies double counts evidence.

Register a protocol where appropriate and document amendments with dates and rationale. A protocol reduces outcome and analysis switching but cannot anticipate every issue. Transparent deviations are preferable to pretending the plan was unchanged.

## Search architecture and reproducibility

Search multiple bibliographic databases and relevant registries. Tailor controlled vocabulary and free-text terms to each platform. Search reference lists, citation indexes, trial registries, and grey literature where relevant. Database coverage and indexing differ, so a single broad Google-style query is rarely comprehensive.

A search strategy balances sensitivity and precision. Synonyms, spelling variants, brand and generic names, population terms, and indexing changes matter. Avoid unnecessary design filters that may miss eligible studies. Record database name, platform, complete strategy, date searched, limits, and number retrieved. Save exported records and deduplication decisions.

A librarian or information specialist can improve search coverage. Pilot the strategy against known eligible studies. Update searches before publication when evidence changes quickly. Automated text mining can prioritize screening, but should be validated and transparent; it does not justify omitting records without an established process.

## Screening and study flow

Use two independent reviewers for title/abstract screening and full-text eligibility when feasible, with a prespecified conflict-resolution procedure. Pilot criteria on a sample and refine ambiguous definitions before full screening. Record full-text exclusion reasons and show the flow from identified records through studies included. A report-level flow is not a study count when multiple reports describe one study.

Screening software can manage duplicates and decisions. Machine-learning prioritization may reduce workload if recall is monitored, but stopping early can miss relevant records. Report software and human oversight. Conflicts should be resolved using eligibility criteria rather than an informal preference for including or excluding an inconvenient result.

## Extraction, verification, and risk of bias

Extract study design, participants, setting, intervention, comparator, outcomes, follow-up, analysis, and results in a structured form. Define rules for multiple arms, adjusted estimates, missing summary statistics, and time points. Pilot extraction and independently verify critical outcome data, especially for large or influential studies. Contact authors where appropriate and document responses.

Assess risk of bias using a design-specific tool. Randomized trials require evaluation of randomization, deviations, missing outcomes, measurement, and selective reporting. Observational studies need attention to confounding, selection, exposure classification, and outcome measurement. A quality score that adds domains into one number can obscure which bias threatens a particular result. Use domain judgments and explain how they affect synthesis.

Outcome data can be extracted incorrectly through digitization, conversion, or transcription. Keep source page, table, and calculation notes. If a graph is digitized, preserve values and uncertainty about extraction. For shared controls or multi-arm studies, account for dependence rather than double counting the comparator group.

## Synthesis decision and worked example

Before pooling, confirm studies estimate a compatible effect for a sufficiently similar population, intervention, comparator, outcome, and time. A meta-analysis of risk ratios from comparable trials may be meaningful; combining odds ratios, hazard ratios, and risk differences without transformation changes the estimand. Clinical and methodological heterogeneity should be assessed before statistics.

Suppose two trials report log risk ratios −0.20 and −0.35 with standard errors 0.10 and 0.15. Fixed-effect inverse-variance weights are 1/0.10²=100 and 1/0.15²=44.4. The pooled log ratio is [100(−.20)+44.4(−.35)]/144.4≈−.246, corresponding to RR≈0.78. This calculation assumes a common underlying effect and independent study estimates. It does not establish that pooling is clinically justified.

If studies are too heterogeneous or outcome definitions incompatible, provide a structured narrative synthesis with tables and explain why pooling was inappropriate. Vote counting based on statistical significance is not a substitute: it ignores effect magnitude and precision. Synthesis may include ranges, direction, contextual differences, and certainty judgments.

## Meta-analysis and heterogeneity

A fixed-effect model estimates a common effect under assumptions; a random-effects model estimates an average across a distribution of study effects. Random effects do not make incompatible studies comparable. Report τ² and consider prediction intervals where meaningful. With few studies, heterogeneity estimates and random-effects intervals are unstable.

Explore heterogeneity using prespecified subgroup hypotheses or meta-regression when enough studies support it. Study-level associations are ecological and may not represent patient-level effect modification. Avoid fitting many moderators to a small set of trials. Sensitivity analyses can examine risk-of-bias restrictions, alternative effect measures, and influential studies.

Publication bias and selective dissemination can make available studies unrepresentative. Funnel plot asymmetry is not proof of publication bias; small-study effects can arise from heterogeneity, methodological differences, or chance. Search registries, compare protocols and publications, and use sensitivity analyses. Report what evidence may be missing.

## Certainty and implications

Certainty assessment considers risk of bias, inconsistency, indirectness, imprecision, and publication bias. A statistically precise pooled estimate can still be low certainty if studies are biased or indirect. A wide interval may include both meaningful benefit and harm. Separate certainty in the effect estimate from recommendations, which also involve values, resources, feasibility, and equity.

Interpret average effects with clinical context and baseline risk. Relative effects can translate into different absolute effects across settings. State whether evidence applies to the population and intervention under consideration. Do not frame a non-significant result as proof of no effect unless the interval excludes important effects under a justified margin.

## Reporting a review others can reproduce

Follow PRISMA 2020 and provide protocol registration, eligibility criteria, full search strategies, screening process, extraction methods, risk-of-bias tool, synthesis decisions, and flow diagram. List excluded full texts with reasons and identify multiple reports of the same study. Provide data and code where permitted. Disclose conflicts and funding.

Separate prespecified analyses from exploratory ones. Explain amendments, unavailable data, and any synthesis that could not be performed. Report effect estimates with intervals, heterogeneity, prediction intervals where appropriate, certainty, and limitations. A transparent review is useful even when it concludes that evidence cannot be pooled.

### Protocol registration and amendment discipline

A protocol specifies what question will be answered and how. Registering it makes the planned eligibility, outcomes, synthesis, and subgroup analyses visible to readers. Registration does not guarantee good methods and should not replace a full protocol. For living or rapidly changing evidence, include an update plan and version history.

Amendments can be necessary when outcomes are not reported as expected, study designs differ from anticipated, or new evidence changes the question. Record amendment date, reason, and whether it preceded data extraction or analysis. Distinguish a decision made to resolve a technical issue from one made after seeing effect estimates. The latter may still be scientifically defensible but is exploratory and should be labeled.

Prespecify rules for multiple reports, overlapping cohorts, time points, outcome scales, adjusted estimates, and missing data. A rule such as “select the most adjusted model” may not be appropriate if covariates differ or adjustment includes mediators. Define a hierarchy based on causal relevance and data availability, and test sensitivity to alternate eligible results.

### Search sensitivity and update

Search strategy should be reproducible line by line, including subject headings, field tags, Boolean logic, limits, and dates. Translate the strategy to each database rather than copying syntax mechanically. Validate retrieval against sentinel studies known to meet eligibility. If a sentinel is missed, investigate whether terms, indexing, or database coverage need adjustment.

Report duplicate removal. Deduplication can be automated but false matches can merge distinct studies and missed matches can create redundant screening. Preserve identifiers and counts before and after deduplication. Citation chasing can find studies missed by indexing but should be documented with date and method. Trial registry searches may uncover completed but unpublished research; record registry and search fields.

Searches become stale. Update before submission or decision use, particularly for fast-moving topics. A living review requires monitoring, versioned methods, and a clear process for updating screening, risk of bias, synthesis, and conclusions. Automated alerts and classifiers can prioritize new records, but humans should monitor missed eligible records and record recall.

### Screening reliability and adjudication

Two reviewers can interpret eligibility differently, especially for broad constructs, mixed populations, or outcomes with varying definitions. Pilot screening on a diverse sample, discuss disagreements, and clarify criteria before large-scale work. A kappa statistic can describe agreement but is affected by prevalence; report raw agreement and the nature of disagreements too. High agreement does not prove criteria are valid.

At full text, record a primary exclusion reason using a prespecified hierarchy, such as wrong population, design, intervention, or outcome. If multiple reasons apply, a hierarchy prevents inconsistent counts. Maintain a link from each report to the underlying study. Use a flow diagram that distinguishes records, reports, and unique studies.

Machine-assisted screening may order records by predicted relevance. If reviewers stop after a threshold, estimate missed-record risk and continue monitoring low-ranked records. Train and validate prioritization on a representative set, document software and stopping rules, and preserve a human-auditable record. Automation can reduce workload but does not eliminate selection bias.

### Data extraction, conversions, and missing information

A pilot extraction form should specify effect measure, group denominators, analysis population, follow-up, and variance data. Two extractors can independently extract primary outcomes or one can extract with independent verification. Resolve inconsistencies against source documents and retain page, table, and figure references. A data table should distinguish reported values from analyst-derived quantities.

Conversions can introduce assumptions. Standard deviations may be reconstructed from standard errors, confidence intervals, or p-values; medians may be converted to means using distributional assumptions. If such methods are necessary, identify formulas and perform sensitivity analysis. Do not treat estimated variance as directly reported. For cluster trials, adjust for clustering if the published estimate ignores it; obtain ICC assumptions and test alternatives.

When study data are missing, contact authors or search protocols, registries, and supplements. Report attempts and nonresponse. Do not substitute zero for an unreported outcome. If only a subset of outcomes is available, assess selective reporting risk. Narrative synthesis may be more honest than imputation across incompatible studies.

### Choosing synthesis without pooling

A structured narrative synthesis should group studies by clinically relevant characteristics, summarize design and risk of bias, and explain patterns in effect direction, size, and precision. It should not count how many studies are statistically significant. A forest plot can display estimates without a pooled diamond, allowing comparison while signaling that synthesis was not appropriate.

Tables should include outcome definitions, follow-up, population, intervention, and result scales. Explain heterogeneity sources and avoid ranking interventions from indirect comparisons unless network methods and transitivity assumptions are justified. If studies use incompatible metrics, report them separately or transform only when necessary assumptions are credible.

Certainty can be downgraded for inconsistency even when a pooled estimate is precise. Conversely, substantial statistical heterogeneity does not always mean effects differ in a clinically important way. Interpret the magnitude and context, not only an I-squared threshold. A prediction interval may be wide and more relevant to a new setting than the mean effect.

### Meta-regression and subgroup hypotheses

Study-level meta-regression associates effect estimates with study characteristics, such as mean age or intervention intensity. It is vulnerable to ecological bias: a relationship across study averages may not hold for individuals. With few studies, coefficients are unstable and multiple moderator searches produce false discoveries. Prespecify a small set of plausible moderators and treat results as exploratory.

Subgroup analyses should be based on hypotheses that predict different effects, not on whether one subgroup is statistically significant. Within-study interaction evidence is preferable to comparing separate study subsets. Report interaction estimates and intervals. If subgroup data are absent or inconsistent, state that effect modification cannot be evaluated.

### Risk of bias and sensitivity analysis

Assess bias at outcome/result level when different outcomes within a study have different measurement or missingness. For randomized trials, consider randomization, deviations, missing data, measurement, and selective reporting. For observational studies, evaluate confounding and selection mechanisms. Use domain-level judgments with justifications; do not sum items into an unvalidated quality score.

Sensitivity analyses can exclude studies at high risk of bias, vary correlation assumptions, choose alternate eligible time points, or test different synthesis models. These are meaningful only when motivated and reported fully. A robustness check does not prove absence of bias; it indicates whether conclusions change under specified alternatives.

### Diagnostic reviews and network comparisons

Diagnostic test reviews often require bivariate or hierarchical models to account for the correlation between sensitivity and specificity and threshold variation. Pooling sensitivity and specificity independently can produce incoherent summaries. Spectrum, reference-standard quality, and threshold differences are central. Assess patient flow and verification bias, and show a summary ROC curve or clinically meaningful operating points.

Network meta-analysis compares multiple interventions using direct and indirect evidence. It requires transitivity: distributions of effect modifiers should be sufficiently comparable across comparisons. Inconsistency between direct and indirect evidence should be explored. Rankings alone are unstable and can obscure uncertainty; report effects and intervals, certainty, and assumptions.

## Reproducibility and conflicts

Keep a dated search log, screening decisions, extraction file, risk-of-bias judgments, analysis scripts, and change record. Use version control for code and a controlled data repository for extracted study-level information. Reviewers should disclose conflicts, funding, and relationships that may influence eligibility or interpretation. Independent adjudication can strengthen controversial decisions.

Data and code sharing improves verification, but copyright, licensing, and publisher restrictions may limit full-text redistribution. Share citations, extraction schemas, code, and derived data where allowed. Document inaccessible reports and unresolved ambiguities. A reproducible workflow lets readers understand not only what was included but how reasonable alternatives might change the conclusion.

## Communicating evidence for decisions

Conclusions should be proportional to certainty and applicability. Identify populations and settings with direct evidence, those requiring extrapolation, and outcomes not studied. Present absolute effects using relevant baseline risks when possible. Explain whether a recommendation also depends on values, resources, feasibility, and equity. Avoid converting low-certainty pooled averages into categorical claims.

A systematic review can be valuable when it finds that studies are too heterogeneous to pool or that evidence is absent. State the uncertainty and what studies would resolve it: better outcome standardization, longer follow-up, representative recruitment, or prospective validation. Evidence gaps are findings, not failures of the review.

### Living review governance

For an updateable review, define who monitors new evidence, how often searches run, and what change triggers reanalysis. Maintain versioned conclusions and distinguish evidence added at each update. A living process needs resources for screening, extraction, risk-of-bias assessment, and statistical review; an automated alert alone is not an update.

When conclusions change, explain whether this reflects new studies, corrected data, altered methods, or changed clinical context. Notify users of prior versions where feasible and archive previous reports so decisions can be audited.

Report the date of the last search prominently so readers can judge currency. Distinguish certainty in each outcome from the overall impression of a review, and identify whose perspective informed the question and interpretation.

State whether protocol registration occurred before screening and provide the identifier. If unavailable, disclose that limitation and make the methods and amendments public where possible.

Document any unavailable full texts, author contacts, and unresolved data questions that may affect inclusion or synthesis.

Interpret findings with clinical, methodological, and population context rather than a pooled estimate alone.

Avoid overstating certainty when evidence is indirect or incomplete.

### Review update implications

State the last search date and whether evidence published after that date could materially change the conclusion. For time-sensitive decisions, plan a search update before applying recommendations.

## References and further reading

- Page MJ, McKenzie JE, Bossuyt PM, et al. PRISMA 2020 statement. *BMJ*. 2021;372:n71. [doi:10.1136/bmj.n71](https://doi.org/10.1136/bmj.n71).
- Cochrane. *Cochrane Handbook for Systematic Reviews of Interventions*. [Handbook](https://training.cochrane.org/handbook).
- See [Meta-analysis and forest plots](meta-analysis-and-forest-plots.html) and [Heterogeneity and publication bias](heterogeneity-and-publication-bias.html) for synthesis methods.
