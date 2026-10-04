---
title: Statistical analysis plans
summary: Specify estimands, outcomes, models, missing-data handling, multiplicity, and sensitivity analyses before unblinded results are examined.
---

## Overview

A statistical analysis plan (SAP) translates a study protocol and scientific question into reproducible analyses. It specifies what will be estimated, which participants and outcomes contribute, how data problems will be handled, and how uncertainty will be summarized. A good SAP reduces outcome-driven analytic choices while leaving room to document genuine changes in understanding or data quality.

The plan is not a substitute for sound design. It cannot repair poor randomization, inadequate follow-up, confounding, or an endpoint that does not represent the clinical question. Its value is that investigators and readers can distinguish planned decisions from choices made after seeing results. The level of detail should match the design, risk, and complexity of the study.

## Define the estimand before the model

An estimand describes the treatment effect or association the study aims to quantify. In a trial, specify the population, treatment conditions, outcome variable, time point, and strategy for intercurrent events such as discontinuation, rescue therapy, or death. “Difference in 12-week symptom score” is incomplete if the protocol permits rescue medication and participants stop assigned treatment. A treatment-policy estimand may use outcomes regardless of discontinuation; a hypothetical estimand asks what would have happened without the intercurrent event and needs additional assumptions.

For an observational analysis, specify target population, exposure contrast, outcome, follow-up period, and whether the aim is descriptive, predictive, or causal. State the causal identification assumptions if a causal interpretation is intended. The model is a tool for estimating the estimand; it does not define it by itself.

## Build a map from question to analysis

A SAP should identify the primary endpoint and primary contrast, analysis population, covariates, model family, link function, effect scale, and confidence interval method. Explain variable coding, reference categories, transformations, and how continuous predictors are handled. For a multicenter trial, specify site and randomization strata. For clustered assignment or repeated measurements, define the correlation structure and small-sample correction if needed.

For a continuous endpoint measured at baseline and follow-up, an ANCOVA model can estimate the adjusted group difference:

```r
fit <- lm(score_12w ~ arm + score_baseline + site, data = trial)
confint(fit, "armactive")
```

This example assumes a continuous outcome, a prespecified linear covariate effect, and independent residuals conditional on the model. The SAP should name the exact contrast and units, whether site is fixed or random, how missing outcomes are treated, and what diagnostics or sensitivity analyses are planned. Listing only “ANCOVA will be used” is not enough for independent reproduction.

## Specify the analysis population and data rules

Define intention-to-treat, per-protocol, safety, and other populations precisely. In a randomized trial, the primary analysis usually preserves randomized assignment and includes all randomized participants with usable outcomes, but the exact approach to missing outcome data must be stated. Per-protocol analyses are vulnerable to post-randomization selection and should not replace the randomized comparison without justification. For observational studies, specify eligibility dates, index date, washout, duplicate handling, and exclusions before modeling.

Set data conventions for values outside range, implausible dates, duplicate records, treatment switching, and endpoint adjudication. Distinguish data cleaning rules from outcome-driven exclusions. Specify whether blinded review of unusual observations is permitted and who performs it. Avoid deleting outliers solely because they weaken the treatment effect; use prespecified robust methods or sensitivity analyses where appropriate.

## Missing outcomes and intercurrent events

The SAP should state expected missingness patterns, primary assumptions, and methods. For repeated continuous outcomes, a likelihood-based mixed model under MAR may use all available visits, conditional on observed history and model covariates. Multiple imputation may be appropriate when the estimand or analysis requires a completed dataset. A single imputation such as last observation carried forward generally understates uncertainty and relies on implausible stability assumptions.

Plan sensitivity analysis for departures from MAR, such as delta-adjusted pattern-mixture models or tipping-point analyses. Choose a clinically meaningful range before unblinding. Explain which participants and values receive the shift. The missing-data-and-imputation article discusses the mechanism assumptions and diagnostics in depth.

Intercurrent events must be connected to the estimand. If treatment is discontinued but outcomes continue to be collected, a treatment-policy strategy uses those outcomes. If rescue treatment is part of routine care, treatment-policy analysis may represent the real-world effect of assignment; a hypothetical no-rescue effect needs modeling assumptions. A composite strategy may count rescue as treatment failure. State how death is handled for outcomes where it makes measurement undefined.

## Multiplicity and hierarchy of claims

List confirmatory hypotheses and their testing order. If there are co-primary outcomes, specify whether all must succeed or how family-wise error is controlled. For multiple doses, endpoints, or interim looks, identify the adjustment method and alpha allocation. A gatekeeping procedure can preserve type I error while allowing ordered claims. Exploratory outcomes may be reported with unadjusted intervals if clearly labeled as exploratory; they should not be promoted to confirmatory claims after results are known.

Subgroup analyses should be limited to a few clinically justified modifiers with interaction tests, not separate within-group significance testing. State whether modifiers are baseline variables, how continuous variables are modeled, and whether analysis is confirmatory or exploratory. A subgroup table with no interaction estimate is insufficient evidence of effect modification.

## Sample size, power, and precision assumptions

Document the target effect, outcome variance or event rate, allocation ratio, type I error, power, attrition allowance, and method. For cluster trials include intraclass correlation, cluster-size variation, and number of clusters. For time-to-event studies, events rather than enrollment often determine information. A sensitivity table across plausible nuisance parameters is more transparent than one supposedly exact sample-size calculation.

Power is conditional on assumed effect and model. It is not the probability that the study will be positive, and it does not guarantee adequate precision for secondary outcomes. If the design targets a clinically important effect, report that threshold and the expected interval width. For prediction model development, plan sample size to control overfitting and precision of calibration rather than relying on a fixed events-per-variable rule.

## Interim analyses and adaptive features

If interim efficacy or futility analyses are planned, specify timing or information fraction, boundaries, alpha-spending function, and who can access unblinded data. Define whether interim looks can change sample size, allocation, or study conduct. A data monitoring committee charter and SAP should align but need not disclose confidential operational details to blinded study staff. Unplanned looks can inflate type I error and encourage selective stopping.

For adaptive designs, state adaptation rules, simulation-based operating characteristics, and analysis methods that account for adaptation. If sample size may be increased based on nuisance parameters, clarify whether treatment effects remain blinded. Document how modifications are logged and which version of the plan governs each decision.

## Sensitivity analyses tied to threats

Sensitivity analyses should target assumptions that could materially change conclusions: missing-not-at-random outcomes, alternative covariance structures, influential observations, different confounder sets, competing event definitions, or departures from proportional hazards. State the reason for each scenario, method, and interpretation before results are examined. A long list of arbitrary models can confuse rather than strengthen inference.

For nonrandomized treatment effects, consider negative controls, quantitative bias analysis, alternative propensity-score specifications, and restriction to regions of covariate overlap. For a continuous primary endpoint, compare the planned model with a robust or rank-based sensitivity analysis if heavy tails are a concern. For survival outcomes, report restricted mean survival time if nonproportional hazards are plausible. These analyses probe different assumptions and do not make them disappear.

The primary model should be defended in relation to design and target. In a randomized trial, covariate adjustment can improve precision when baseline predictors are prognostic; covariates and form should be selected before outcomes are examined. Avoid stepwise variable selection based on p-values. In observational studies, confounder selection should use subject-matter knowledge and a causal structure, not automated significance screening. The adjustment set should avoid mediators and colliders when estimating total effects.

Specify what happens if the model fails to converge, a category is empty, or a continuous predictor has a nonlinear relationship. A fallback should be chosen before outcome unblinding where feasible: for example, a prespecified penalized logistic regression if separation occurs. Do not choose among fallback models by which produces a favorable treatment p-value. If the primary model is unusable, explain the failure, use the predefined alternative, and report both the issue and its impact.

For outcomes with different data types, the effect scale and model must align. Binary outcomes may use risk differences, risk ratios, or odds ratios; logistic regression estimates conditional odds ratios, which are noncollapsible and may differ from marginal effects even without confounding. Count outcomes may need Poisson or negative-binomial models with person-time offsets. Ordinal scales may require cumulative-link models, while continuous scales invite ANCOVA or repeated-measures models. Describe how estimates will be transformed or standardized for reporting.

### Example: align contrast, coding, and interval

Suppose treatment is coded 0 for control and 1 for active and the fitted ANCOVA coefficient is −2.4 points with standard error 0.85. With approximately 294 residual degrees of freedom, a 95% interval uses (t_{.975,294}\approx1.97): −2.4 ± 1.97(0.85) = −4.07 to −0.73. The SAP should make clear that negative values favor active treatment, the unit is points, and the contrast is baseline-adjusted. It should also say whether a minimally important difference is 3 points, so the result can be interpreted against clinical relevance rather than statistical threshold alone.

If there are two co-primary outcomes and both must be positive to claim success, the decision rule differs from testing either outcome at 0.05. If success on either is sufficient, family-wise error control is needed. The SAP should encode the actual scientific claim and multiplicity strategy, not use generic language such as “adjust for multiple comparisons as appropriate.”

## Observational studies need explicit causal structure

An observational SAP should identify the time zero, eligibility, treatment strategies, follow-up, outcome, and causal contrast, ideally using a target-trial framework. Define baseline confounders before analysis and explain their measurement timing. Specify propensity-score estimation, overlap diagnostics, weighting or matching, and balance criteria. If treatment is time-varying, identify time-varying confounding and whether g-methods are required. Standard regression with baseline adjustment may not handle confounders affected by prior treatment.

Positivity means each treatment strategy is possible for individuals with relevant covariate patterns. If some patients almost always receive one treatment, weighting can produce extreme weights and poor precision. The SAP should specify diagnostics and what action follows poor overlap, such as restricting the target population or changing the estimand. Truncation thresholds should be justified and sensitivity results reported. An adjusted estimate should not be labeled causal merely because many covariates were included.

## Database lock and analysis traceability

Before primary analysis, define a data-cleaning log, derivation specifications, analysis datasets, and quality checks. Variables in the dataset should map to protocol definitions. Keep treatment coding blinded until data cleaning, endpoint derivation, and model code are finalized when feasible. A reproducible pipeline should regenerate tables and figures from locked data and version-controlled code.

The SAP should include table shells or mock outputs for the primary endpoint, participant flow, baseline characteristics, harms, and sensitivity analyses. Shells make clear the planned denominator and display scale without revealing results. Store code review records and validation outputs. Independent programming or double derivation may be appropriate for high-stakes primary endpoints.

An analysis deviation log should record the original specification, change, date, reason, decision-maker, and knowledge of treatment results at the time. Classify changes as blinded operational refinements, data-driven amendments made before unblinding, or post hoc changes. All can be scientifically reasonable, but the distinction matters for confirmatory interpretation.

## How to review a plan before approval

Reviewers should trace the primary claim from protocol objective to estimand, data derivation, model, contrast, interval, and display. Ask whether an independent statistician could reproduce the analysis without making undocumented choices. Check that the sample-size assumptions correspond to the planned estimand and that the endpoint timing is consistent across protocol, case-report forms, and code. Confirm that every intercurrent event has a strategy and that missingness assumptions have a sensitivity analysis.

For adaptive trials, verify that the adaptation rules and interim boundaries have operating-characteristic simulations over realistic null, alternative, and nuisance-parameter scenarios. For observational analyses, review time zero, confounding strategy, overlap, and whether covariates precede exposure. For prediction work, separate model development from validation and ensure all tuning is nested within resampling. For economic evaluations, specify perspective, time horizon, discounting, currency year, and uncertainty analysis.

The approval record should identify protocol and SAP versions, statistical reviewer, date, and any unresolved limitations. A SAP is most useful when it is readable by clinicians as well as analysts: define technical terms, explain why a method serves the question, and avoid unexplained package-specific jargon. Detailed implementation appendices can accompany a concise main plan, provided they are versioned and consistent.

Do not measure SAP quality by length alone. A short plan can be sufficient for a simple descriptive study if it makes its target and analysis reproducible. A complex adaptive trial or longitudinal comparative study needs greater detail. The aim is to predefine decisions that could influence the result and leave an audit trail for those that cannot reasonably be anticipated.

Prespecification also supports honest uncertainty. If investigators later discover a data feature the plan did not anticipate, a transparent amendment can be more defensible than forcing the analysis into an unsuitable model. The key is to identify when the feature became known, whether comparative results were visible, and why the change was needed. Report the original and revised analyses when the change could affect the primary conclusion.

An estimand can imply different data collection needs. A treatment-policy question requires outcome follow-up after treatment discontinuation; a hypothetical question may need information about reasons for discontinuation and post-event prognosis. If the protocol collects only on-treatment outcomes, the intended treatment-policy contrast may be impossible to estimate without strong assumptions. The SAP review is therefore also a check that the study design actually supports the planned scientific question.

Prespecified plans improve credibility when they are accessible to readers, not only archived. Cite the final SAP and explain substantial amendments in the manuscript or report.

Link the plan to the protocol and estimand framework so the analysis remains anchored to the clinical objective.

If tables are generated by separate programmers, reconcile derivations and denominators before locking the report.

Resolve discrepancies while treatment coding remains blinded whenever possible.

Document all prespecified alternatives and the reason each exists.

## Governance, blinding, and amendments

The SAP should be finalized before unblinded comparative data are available to analysts responsible for primary decisions. In blinded studies, describe treatment coding and procedures for emergency unblinding. Date and version the plan; preserve prior versions. Amendments should state the reason, date, impact, and whether the decision was made before or after access to relevant data.

Prespecification does not make every decision immutable. Data errors, protocol changes, and unforeseen model failures can require revision. The appropriate response is to document changes transparently, distinguish prespecified from post hoc analyses, and report how conclusions depend on them. Do not backdate or silently overwrite the approved plan.

## A worked specification for a trial endpoint

Consider a two-arm trial of 300 patients with baseline and 12-week symptom scores, lower scores better. A concise primary specification could state: treatment-policy estimand in all randomized participants; endpoint is 12-week score; primary contrast is adjusted mean difference active minus control; ANCOVA includes treatment, baseline score, and randomization strata; two-sided type I error 0.05; report estimate and 95% CI. Missing 12-week outcomes are handled by multiple imputation under MAR including treatment, baseline score, earlier repeated scores, site, and predictors of missingness; a delta-adjusted sensitivity analysis shifts missing active-arm outcomes toward worse scores. The analysis population, coding, software, and diagnostics are then detailed so another analyst can reproduce it.

This specification clarifies the target and key methods but still needs implementation choices: imputation method by variable, number of imputations, pooling, model diagnostics, treatment of death or rescue medication, and multiplicity if there are co-primary outcomes. A SAP is complete when it removes consequential ambiguity, not when it reaches a particular page count.

## References and further reading

- International Council for Harmonisation. ICH E9(R1): Addendum on Estimands and Sensitivity Analysis in Clinical Trials; 2019. [ich.org](https://www.ich.org/page/efficacy-guidelines)
- Gamble C, Krishan A, Stocken D, et al. Guidelines for the content of statistical analysis plans in clinical trials. *JAMA*. 2017;318:2337–2343. [doi:10.1001/jama.2017.18556](https://doi.org/10.1001/jama.2017.18556)
- Chan A-W, Tetzlaff JM, Altman DG, et al. SPIRIT 2013 statement: defining standard protocol items for clinical trials. *Ann Intern Med*. 2013;158:200–207. [doi:10.7326/0003-4819-158-3-201302050-00583](https://doi.org/10.7326/0003-4819-158-3-201302050-00583)
- Little RJA, Rubin DB. *Statistical Analysis with Missing Data*. 3rd ed. Wiley; 2019.
