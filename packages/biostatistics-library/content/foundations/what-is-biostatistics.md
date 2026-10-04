---
title: What is biostatistics?
summary: The branch of statistics applied to biological and medical research — turning messy data into trustworthy evidence.
---

## Overview

Biostatistics is the discipline of designing health research and reasoning from its data. It links a scientific question to a study plan, a measurable outcome, an estimand, an analysis, and a conclusion whose uncertainty and limits are explicit. It is not simply a menu of tests: the same dataset can support different answers depending on who was observed, what was measured, and which comparison was intended.

A useful way to see the discipline is as a chain of decisions. Researchers define a target population and question; design determines which comparisons are credible; measurement converts clinical concepts into recorded variables; statistical models summarize patterns under stated assumptions; and interpretation asks what those summaries can support in practice. Weakness at an early link cannot usually be repaired by a more elaborate model at the end.

## Start with the question and target quantity

Before collecting or analyzing data, specify the population, exposure or intervention, comparator, outcome, and time horizon. For a treatment question, distinguish the effect of assignment from the effect of adherence, and decide whether the target is an average effect, a subgroup effect, or the outcome expected for an individual. These quantities are called estimands. A vague question such as “does treatment work?” does not define which effect is to be estimated.

Consider a trial that randomizes 200 adults with hypertension, 100 to a new drug and 100 to usual care, and measures systolic blood pressure after 12 weeks. One estimand is the mean difference in 12-week pressure under assignment to the new drug versus assignment to usual care among eligible participants. A different estimand concerns the effect if every participant adhered to treatment. The first follows randomization; the second requires assumptions or additional design because adherence is not randomized.

Define the outcome in observable terms and identify its denominator. “Hospital complications” might mean at least one complication per person within 30 days, a count of complications, or a time-to-first-event outcome. These choices change both the analysis and the clinical meaning. Specify how deaths, loss to follow-up, and events after treatment discontinuation are handled. Write these decisions in the protocol before inspecting comparative results whenever feasible.

## Design determines the strength of a comparison

Randomization balances measured and unmeasured baseline causes in expectation, making the assigned groups comparable on average. It does not ensure perfect balance in one finite trial, prevent missing outcomes, or guarantee that the intervention was delivered as planned. Allocation concealment, blinding where possible, follow-up, and intention-to-treat analysis protect different links in the inference.

When randomization is not feasible, an observational design can estimate associations and sometimes support causal inference, but the claim depends on assumptions. Confounding occurs when a common cause of exposure and outcome distorts their relationship. Selection into the study and measurement error can also bias results. Regression adjustment, matching, weighting, instrumental variables, and difference-in-differences answer different questions and require different assumptions; none transforms observational data into randomized data by itself.

Design also determines dependence. Repeated measurements on one patient, patients clustered within clinics, and matched pairs do not provide the same amount of independent information as an equal number of unrelated observations. Analysis must reflect the sampling and assignment structure. For example, if 1,000 patients come from only 10 clinics, ignoring clinic-level similarity can make standard errors too small and confidence intervals too narrow.

## Measurement and data are part of the method

Clinical constructs such as pain, function, or disease severity are not directly observed in the same way as age. They are represented by instruments, diagnostic criteria, laboratory assays, or coded records. Ask whether the measure captures the intended construct, whether it behaves consistently, and whether its error differs across groups or time. A highly reproducible instrument can still measure the wrong construct.

Make data definitions reproducible. Record units, allowable ranges, category coding, dates, derivations, and the source of each variable. A value of zero must be distinguishable from “not measured”; dates should be checked against plausible sequences; duplicate records should be resolved by rules set without knowledge of the desired result. Missingness is not automatically harmless. If sicker patients are more likely to miss a follow-up visit, a complete-case mean may describe a selected subset rather than all randomized patients.

A small audit can prevent a large analytic error. Suppose a laboratory result is stored in mg/dL for one site and mmol/L for another. Pooling the raw values creates a site artifact that may look like biological heterogeneity. Unit harmonization and source checks belong before model fitting, with corrections documented so another analyst can reproduce them.

## Estimation, uncertainty, and a worked comparison

An estimate is a data-based summary of a target quantity; uncertainty describes how much the estimate could vary under the study’s sampling process and model. For a simple randomized comparison, let the outcome be change in systolic pressure, with negative values indicating reductions. Suppose mean change is −8 mmHg in the new-drug group and −3 mmHg in usual care. The estimated difference is

\[
\widehat{\Delta}= -8 - (-3) = -5\text{ mmHg}.
\]

If the standard error of the difference is 1.8 mmHg, a rough 95% confidence interval is −5 ± 1.96(1.8), or −8.5 to −1.5 mmHg. This interval expresses sampling uncertainty under the analysis assumptions; it does not say there is a 95% probability that the fixed treatment effect lies in this particular interval. A p-value alone would discard much of the information about plausible magnitude and precision.

A reproducible calculation from patient-level data can be made in R:

```r
# change is follow-up minus baseline; assignment is randomized group
with(dat, tapply(change, assignment, mean, na.rm = TRUE))
fit <- lm(change ~ assignment, data = dat)
confint(fit)
summary(fit)
```

For a two-arm randomized study, the coefficient for `assignment` estimates the unadjusted mean difference when the reference level is usual care. Check factor ordering and missingness before interpreting it. If the outcome is skewed, binary, censored, or measured repeatedly, the model and estimand need to match that structure; the simple linear model is an illustration, not a universal default.

Statistical compatibility is not the same as clinical importance. A 5 mmHg average difference may be meaningful for one population and insufficient for another depending on durability, adverse effects, burden, and baseline risk. Conversely, a clinically important estimate may be imprecise in a small study. Interpret the point estimate, interval, outcome definition, and study context together.

## Models summarize data under assumptions

A statistical model is a simplified representation of how observations relate to parameters. Linear regression describes a conditional mean as a linear combination of predictors; logistic regression models log odds; survival models describe event timing while accounting for censoring under specified assumptions. Model choice follows the outcome and design, not a search for whichever method yields a small p-value.

Check whether model assumptions are plausible and whether conclusions depend on them. Diagnostics can reveal nonlinearity, influential observations, separation, poor residual behavior, or calibration problems. Robust standard errors may address certain variance misspecifications but do not repair confounding, selection bias, or a wrong outcome definition. Flexible machine-learning methods can improve prediction in some settings, but they still require leakage-safe validation and do not automatically estimate causal effects.

For prediction, define the index time and horizon, ensure predictors are available at that time, and evaluate both discrimination and calibration in data that represent intended use. For causal inference, define the intervention contrast and identification assumptions. Prediction asks who is likely to experience an outcome; causal inference asks what would change under an intervention. Good performance at one task does not establish success at the other.

## Evidence stewardship and communication

Statistical analysis is one contribution to evidence, alongside clinical judgment, study conduct, measurement quality, and external replication. Prespecify primary outcomes and analysis choices when possible. Distinguish planned analyses from exploratory ones, report all relevant outcomes, and explain deviations. Selective reporting creates a misleading picture even when every individual calculation is correct.

Present absolute quantities when they help decisions. A relative risk reduction of 20% means different things when baseline risk is 2% versus 20%. Report denominators, follow-up duration, missingness, and uncertainty. Avoid treating a conventional significance threshold as a boundary between “works” and “does not work.” Protect privacy when publishing small cells or linked data, and document code and data transformations so the analysis can be audited.

A concise interpretation should answer: what population and period are represented; what quantity was estimated; how the data and design support that estimate; how uncertain it is; which systematic biases remain possible; and what action, if any, the evidence justifies. This makes the limits legible instead of burying them in a statistical appendix.


## Precision, sample size, and the information a study can provide

Sample size planning begins with the estimand and design, then asks what precision or power is achievable under plausible assumptions. It is not a search for a magic minimum number. For a two-group comparison of means, precision depends on the outcome variance, allocation ratio, and number of independent participants. With clustering, repeated measures, or unequal sampling weights, the nominal participant count overstates information unless dependence is incorporated. A study with 400 people spread over four clinics may contain less independent information about a clinic-level intervention than a trial with 300 people randomized individually.

For illustration, if a mean difference of 5 units is the smallest clinically important effect and the standard deviation is 10, then the standardized difference is 0.5. A planned two-sided test at 5% significance and 80% power needs a sample size determined by that effect, variance, and allocation; changing the target difference to 2 units increases the required sample substantially. These calculations are conditional on assumptions, including outcome distribution, loss to follow-up, and analysis method. They do not guarantee an informative study if the measurement is unreliable or the intervention is poorly implemented.

Precision should also be considered for estimation rather than hypothesis testing. If the goal is to estimate prevalence with a 95% margin of error of 3 percentage points, a simple random sample size can be approximated with n = 1.96² p(1−p)/d². At p=0.5 and d=0.03, this is about 1,068 people before accounting for design effects or nonresponse. If prevalence is expected to be 0.1, the corresponding simple-random-sample estimate is about 384. The larger worst-case value protects against uncertainty in p. In real studies, cluster sampling, finite populations, unequal response, and subgroup objectives alter this calculation.

A conventional power calculation answers a narrow design question under a specified model. It does not measure the probability that the scientific hypothesis is true, and it does not make an underpowered study worthless. Estimates and intervals from small studies can still inform later evidence synthesis, but conclusions should reflect wide uncertainty. Avoid retrospective “observed power,” which is largely a transformation of the p-value and adds no useful information beyond the estimate and confidence interval.

## Missing observations and incomplete follow-up

Missing data affect both the amount of information and the population represented by an analysis. First describe the missingness by variable, treatment group, site, and time; then ask why values are absent. Missing completely at random means missingness is unrelated to observed or unobserved values, a strong condition. Missing at random allows dependence on observed information, while missing not at random allows residual dependence on the unseen value. These are assumptions about the data-generation process, not labels that can be proven by a statistical test.

Complete-case analysis is unbiased for some targets under restrictive conditions, but it can lose precision and change the analyzed population. Multiple imputation can be useful when its model includes relevant outcome, predictors, design variables, and auxiliary information, with analysis and imputation models aligned. It does not cure unmeasured missingness mechanisms automatically. Sensitivity analysis should examine plausible departures from the primary assumption, such as shifting imputed outcomes in one group by clinically interpretable amounts.

In a randomized study, randomization protects baseline comparability, not necessarily post-randomization follow-up. If 15% of the intervention group and 5% of controls lack the primary outcome because of adverse effects, observed outcomes alone can bias the treatment comparison. Report the extent and reasons for missingness, how the primary analysis addresses it, and how conclusions respond to alternative assumptions. For time-to-event outcomes, distinguish administrative end of follow-up from loss to follow-up and consider whether censoring is plausibly independent after conditioning on modeled information.

## Subgroups, multiplicity, and exploratory discovery

Subgroup questions should be motivated by clinical reasoning and formulated as comparisons of effects between groups. Finding a statistically significant effect in one subgroup and a nonsignificant effect in another does not establish that the effects differ; the interaction itself needs evaluation. Sparse subgroup data produce imprecise estimates, and repeated searching across many candidate modifiers increases the chance of chance findings. Report subgroup estimates with intervals, identify prespecification, and treat exploratory signals as hypotheses for further study.

Multiplicity is broader than the number of p-values in a paper. Researchers may consider multiple outcomes, time points, transformations, subgroups, and analysis choices. Prespecification, transparent reporting, and replication can make exploratory work useful without pretending it was confirmatory. Adjustments such as family-wise error control or false-discovery-rate procedures are appropriate for some families of claims, but do not replace clear definition of the scientific question or effect magnitude.

Model selection also creates optimism. If dozens of predictors or cutpoints are explored and the best result is reported, ordinary confidence intervals and p-values ignore the search. For prediction, feature selection and tuning belong within resampling, and final performance should be evaluated in data not used to choose the model. For causal analyses, adjustment variables should be selected from the causal question and design rather than only from automated significance screening; conditioning on a collider can introduce bias even if it improves apparent fit.

## From one study to cumulative evidence

Individual studies are pieces of evidence, not final answers in isolation. Systematic reviews assess which studies address a compatible question, how their designs differ, and whether estimates can be combined. A pooled effect can be precise yet misleading if interventions, populations, follow-up, or outcome definitions differ in ways that change the target. Random-effects models describe a distribution of study effects under assumptions; they do not make incomparable studies exchangeable by decree.

Interpret a synthesis using both the average effect and the spread across studies. A prediction interval can convey the range of effects expected in a new setting when the random-effects assumptions are credible, while certainty assessments also consider risk of bias, inconsistency, indirectness, imprecision, and publication bias. A funnel plot or statistical asymmetry test is a diagnostic, not proof that unpublished negative studies exist. Clinical reasoning, registry searches, and sensitivity analyses matter.

A practical evidence statement keeps levels of inference distinct: the observed study estimate; the causal or predictive claim supported by design and assumptions; the target settings to which results may transport; and the decision implications given benefits, harms, costs, and preferences. This structure avoids the common jump from “the coefficient is significant” to “the intervention should be adopted.”

## A reproducible analysis is an auditable argument

Reproducibility requires more than code that runs. The data dictionary should define units and derived variables; the analysis plan should identify the primary outcome and estimand; code should record transformations and model choices; and outputs should be linked to the analysis version. A clean computational environment, versioned dependencies, and synthetic examples help others rerun the workflow without exposing confidential records. When full data cannot be shared, provide sufficient documentation and controlled access procedures where appropriate.

Analytic decisions should be visible in the report: exclusions, missing-data handling, deviations from protocol, model diagnostics, and sensitivity analyses. A reproducible pipeline can still produce a biased answer if its design assumptions are weak, so auditability and validity are complementary. Conversely, an apparently sound conclusion that cannot be checked is difficult to trust or extend.

The final communication should let a reader reconstruct the reasoning from question to result. State the study design, target population, outcome, effect measure, time horizon, sample size, and uncertainty. Separate prespecified results from exploratory analyses. Explain what remains unknown and what additional evidence would change the decision. Those practices make statistical work useful beyond the analyst’s immediate calculation.

Statistical reasoning also benefits from domain collaboration. Clinicians clarify what outcomes and effects matter; data managers explain how records were generated; patients and communities identify burdens and meaningful endpoints; and statisticians make the inferential consequences explicit. A shared vocabulary helps each contributor detect mismatches between the clinical question, the available data, and the conclusion being proposed.

## References and further reading

- National Academies. [Reproducibility and Replicability in Science](https://doi.org/10.17226/25303). 2019.
- STROBE Initiative. [Reporting guidance for observational studies](https://www.strobe-statement.org/).
- CONSORT. [CONSORT 2025 statement](https://doi.org/10.1136/bmj-2024-081123). *BMJ*. 2025.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and Other Advanced Topics*. Brooks/Cole.
- See also [Confidence intervals](../inference/confidence-intervals.html) in the *Statistical inference* section.
