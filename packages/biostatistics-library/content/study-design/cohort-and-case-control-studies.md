---
title: Cohort and case-control studies
summary: How longitudinal follow-up and outcome-based sampling answer different epidemiologic questions.
---

## Overview

Cohort and case-control studies are observational designs that organize evidence differently. A cohort begins with people at risk, classifies exposure or strategy, and observes outcomes over time. A case-control study samples people according to outcome status, then compares prior exposure. The cohort preserves a denominator and can estimate risk or rate directly; ordinary case-control sampling fixes the number of cases and controls, so its sample proportions do not reveal population risk.

Neither design is inherently prospective or retrospective. A historical cohort can reconstruct entry and follow-up from records; a case-control study can measure exposure after case identification. The key is the sampling frame: who could become a case, when eligibility begins, and how the comparison group represents that source population.

## Map eligibility, time zero, and observation

For a cohort, specify inclusion criteria, exposure strategies, time zero, outcome definition, follow-up end, and censoring. Time zero should align with eligibility and treatment assignment. If treated participants are classified by a prescription filled after cohort entry, the waiting interval must not be counted as treated time. Otherwise, treated people had to remain alive and event-free long enough to qualify, creating immortal-time bias.

New-user designs align covariate measurement before treatment initiation and avoid mixing long-term survivors with new initiators. An active comparator can make treatment choices more comparable by restricting both groups to people facing a similar clinical decision. This does not guarantee exchangeability, but helps define a useful contrast.

In case-control work, define the source population that produced the cases, diagnostic criteria, incident versus prevalent status, and exposure window. Controls must have been eligible to become cases in that population. With risk-set sampling, controls are selected from those still at risk at each case time; they may later become cases. Controls sampled once at the end of follow-up represent a different design.

## Choose the measure the sampling supports

A cohort with complete fixed-horizon follow-up can compare risks. If follow-up differs, incidence rates divide events by person-time; a rate ratio is not a risk ratio. Survival methods handle event timing and censoring, subject to their assumptions. For competing events, cumulative incidence estimates the real-world probability of the event before a competing event; Kaplan–Meier treating competing events as censoring estimates a different hypothetical quantity and overstates actual probability.

A case-control odds ratio from cumulative sampling estimates the source-population disease odds ratio and approximates a risk ratio only when the outcome is uncommon. Under incidence-density sampling, the exposure odds ratio estimates the incidence-rate ratio without a rare-disease assumption. These interpretations follow from sampling, not from the logistic regression software.

Example: an exposed cohort contributes 18,000 person-years and 36 events; an unexposed cohort contributes 24,000 person-years and 30 events. The rates are 2.0 and 1.25 per 1,000 person-years. The rate ratio is 1.6 and rate difference 0.75 per 1,000 person-years. Assuming independent Poisson counts, the log-rate-ratio standard error is √(1/36+1/30)=0.245; an approximate 95% interval for the ratio is exp[log(1.6) ± 1.96(0.245)] = 0.99 to 2.60. This interval is imprecise and assumes comparable person-time and Poisson variation.

    events <- c(36, 30)
    py <- c(18000, 24000)
    rate <- events / py
    irr <- rate[1] / rate[2]
    se <- sqrt(1 / events[1] + 1 / events[2])
    c(rate_exposed_per_1000 = rate[1] * 1000,
      rate_unexposed_per_1000 = rate[2] * 1000,
      IRR = irr,
      lower = exp(log(irr) - 1.96 * se),
      upper = exp(log(irr) + 1.96 * se))

This is a crude comparison. Confounding adjustment, clustering, overdispersion, or recurrent events require additional modeling and variance choices.

## Construct a valid case-control sample

Suppose a study selects 100 cases and 100 controls. Exposure is present in 60 cases and 30 controls. The odds ratio is (60×70)/(40×30)=3.5. It is incorrect to say the exposed participants have 3.5 times the risk from these data alone: investigators selected case and control totals. The source-population sampling scheme determines whether this odds ratio has a risk-odds or rate-ratio interpretation.

    tab <- matrix(c(60, 40, 30, 70), nrow = 2, byrow = TRUE)
    or <- (tab[1, 1] * tab[2, 2]) / (tab[1, 2] * tab[2, 1])
    se <- sqrt(sum(1 / tab))
    c(OR = or, lower = exp(log(or) - 1.96 * se),
      upper = exp(log(or) + 1.96 * se))

Controls drawn from hospitals can be problematic if their admission causes relate to exposure. Population controls better represent the source population but may be harder to recruit. Prevalent cases select people who survived or remained diseased long enough to be sampled; if exposure affects survival, this creates prevalence-incidence (Neyman) bias. Objective records, blinded coding, and standardized interviews reduce some recall and interviewer differences, but administrative data can misclassify exposure too.

Matching can improve efficiency or control design variables, but is not itself confounder control. Individually matched sets generally need conditional logistic regression; frequency matching requires appropriate adjustment for matching variables. Overmatching can reduce exposure variation and precision. Explain whether controls can later become cases and whether controls may be selected more than once.

## Account for changing exposure and follow-up

Exposure can change over time. Baseline classification may dilute effects of initiation or discontinuation; time-updated exposure can create time-varying confounding when prior exposure changes later confounders. For acute effects, define short, biologically plausible risk windows. For chronic disease, latency may demand lag periods and cumulative exposure measures. Avoid using exposure information after outcome onset.

Loss to follow-up can bias cohort estimates when related to prognosis after conditioning on measured history. Report follow-up by exposure group and reasons for loss. Inverse probability-of-censoring weights or sensitivity analyses may be appropriate, but depend on measured predictors and positivity. Competing risks need a stated estimand: cause-specific hazard for etiologic rate among those still event-free, or cumulative incidence for actual probability in the presence of competing events.

Nested case-control and case-cohort sampling can reduce expensive biomarker assays. A nested case-control study samples controls from cohort risk sets, preserving incidence-density interpretation. A case-cohort design takes a baseline subcohort and adds all incident cases, allowing study of multiple outcomes but requiring design-aware variance estimation and weights as needed.

## Make confounding adjustment follow the design

Cohort adjustment should target the specified population. Standardization estimates marginal risks under each strategy; propensity matching or weighting may target the matched population or full cohort, depending on implementation. Check covariate balance and treatment overlap. Extreme weights signal inadequate support; trimming changes the target population.

For case-control data, control selection and matching define the analysis. Conditional logistic regression compares exposure within matched sets. With frequency matching, include matching factors in an unconditional model. In either design, choose confounders from temporal and causal knowledge. Do not adjust indiscriminately for post-exposure mediators when estimating total effects. A cohort improves the chance of establishing temporality but does not by itself make treatment groups exchangeable.

## Report enough detail to reconstruct the comparison

Describe source population, eligibility, exposure and outcome definitions, index date, follow-up, censoring, missingness, and control selection. Give absolute risks where the design permits them, and explain the interpretation of each measure. A causal interpretation needs consistency, exchangeability, and positivity, plus appropriate handling of selection and measurement. Report which assumptions were supported by design and which remain unverified.

For observational treatment comparisons, a target-trial specification can clarify eligibility, assignment strategies, time zero, follow-up, outcome, and analysis. This prevents common errors such as assigning exposure based on future behavior or comparing participants at different clinical decision points. Sensitivity analysis should address plausible residual confounding, measurement error, and informative loss rather than serving as a generic robustness label.

## Translate a cohort into an explicit analysis

The cohort denominator is not just the enrollment count. It changes when people enter a dynamic population, when eligibility is restricted, and when participants are censored. A closed cohort enrolls a defined set and follows them; an open cohort allows entry and exit, often contributing person-time while each member is at risk. In either case, report how event-free time is accrued and whether delayed entry occurs. A participant recruited years after becoming at risk is not automatically observed from disease-free baseline.

For a simple fixed-horizon cohort with complete follow-up, a two-by-two table gives risk. With unequal follow-up, person-time rates are useful if the rate is meaningful and event occurrence is modeled appropriately. A Poisson regression can include the logarithm of person-time as an offset:

    fit <- glm(events ~ exposure + age_group,
               offset = log(person_years),
               family = poisson(), data = cohort)
    exp(coef(fit))

The exponentiated exposure coefficient is a conditional rate ratio under the model. Check for overdispersion and within-person or within-site dependence; robust sandwich variance or a negative-binomial model may be needed. If age-specific baseline rates differ, directly standardizing rates to a common age distribution can make groups more comparable. Model adjustment does not replace transparent denominators.

## Distinguish hazards, risks, and competing events

The hazard is an instantaneous event rate among people still event-free at that moment. It is not a probability and its risk-set population changes over time. A hazard ratio can be non-proportional or difficult to interpret as follow-up progresses. Report survival or cumulative incidence at clinically meaningful times when possible, along with absolute differences.

When a competing event prevents the outcome of interest, such as death before dementia diagnosis, the cumulative incidence function estimates the actual probability of the event in the presence of that competing event. Treating death as ordinary censoring in Kaplan–Meier analysis answers a hypothetical question in which death is removed and generally overstates real-world probability. Cause-specific hazard analyses can be useful for etiologic questions about rates among those still at risk; subdistribution models relate covariates to cumulative incidence. State which question drives model choice.

Recurrent events need their own estimand. Is the outcome first hospitalization, total admissions, time between admissions, or days alive and out of hospital? A first-event survival analysis discards later burden. Andersen–Gill models assume a particular counting-process structure; frailty models describe heterogeneity between individuals; negative-binomial models can compare counts with overdispersion. Choose based on the clinical quantity and show absolute event burden when readers need it.

## Make case-control sampling efficient without losing its logic

Incidence-density sampling is especially useful when exposure assays are costly. For each incident case at time t, select controls from cohort members who remain at risk at t. A control may be sampled more than once or later become a case. The conditional logistic odds ratio estimates an incidence-rate ratio because each case is compared with the exposure distribution in its contemporaneous risk set. Matching on age or calendar time can align risk sets but the analysis must preserve the matched sets.

Cumulative sampling selects controls among those who did not become cases by the end. Its odds ratio is tied to cumulative disease odds and approximates the risk ratio when disease is rare. If controls are sampled with unequal probabilities, weights may be required. For a case-cohort design, a random subcohort is sampled at baseline and all cases are included; this can support study of several outcomes using the same biomarker sample, but the variance estimator must reflect the sampling scheme.

Case definition matters as much as control selection. Broad definitions increase sensitivity but may include false positives; narrow definitions improve specificity but can select a more severe subset. If exposure measurement differs by case status, differential error is possible. Use blinded laboratory assays and standardized extraction where feasible. Report the number eligible, contacted, enrolled, and analyzed in each group, plus how nonresponse relates to exposure history.

## Example: what risk-set sampling buys

Imagine a cohort of 20,000 people followed for 10 years, with 80 incident cases. Detailed metabolomic assays are affordable for the cases and 4 controls per case, not the entire cohort. Sampling 320 controls from the risk sets reduces assay cost substantially while preserving the incidence-density contrast. If the scientific aim shifts to absolute 10-year risk, however, the sampled case-control dataset alone does not directly supply that risk; use the parent cohort data or known sampling fractions and an appropriate method.

This illustrates a general principle: efficient sampling preserves information for a specified estimand, not every possible estimand. Before sampling, specify whether the target is a rate ratio, risk ratio, etiologic odds ratio, or prediction model. The choice affects control sampling, matching, weights, and analysis.

## Report the design rather than only the model

For cohort reports, include entry criteria, exposure definition, time zero, follow-up, censoring rules, person-time, outcome ascertainment, and competing event handling. For case-control reports, state the source population, case definition, control sampling, risk-set rules, matching, and whether controls could later become cases. Give the crude counts and denominators that allow readers to see what was observed.

Present confounder adjustment as part of the design rationale. Explain which measured variables preceded exposure, whether they are common causes, how balance or model fit was assessed, and what overlap remained. Use directed acyclic graphs or a written causal rationale for consequential choices. Sensitivity analyses should address plausible residual confounding, exposure error, selection, and loss to follow-up.

## Design a defensible exposure window

Exposure definitions should distinguish initiation, current use, cumulative dose, and duration. A single baseline measure can misclassify people who later stop, switch, or start. Repeated measures improve temporal detail but also raise analytic questions: is the target effect of baseline assignment, current exposure, cumulative exposure, or a dynamic strategy? A biologically justified lag can reduce reverse causation when preclinical disease changes behavior or prescribing. Select the lag before examining outcome associations and show sensitivity to plausible alternatives.

Outcome ascertainment should be comparable across exposure groups. Registry linkage can capture events outside study visits but may depend on access and coding practice. Active follow-up can improve completeness but may produce differential detection if one group is contacted more often. Validate algorithms against charts or adjudicated outcomes when feasible; report sensitivity and specificity or positive predictive value if known.

## Check whether follow-up supports the intended target

Censoring occurs at administrative end, withdrawal, loss to follow-up, or competing event depending on the estimand. Administrative censoring may be unrelated to prognosis if calendar time is handled appropriately. Withdrawal can be informative. Describe censoring patterns and compare reasons between exposure groups. Inverse-probability weighting is one option under conditional independent censoring, but weights require positive observation probability and adequate models. A complete-case analysis silently assumes a selected group can stand in for those lost.

Transport from a cohort to a broader population also requires care. The study effect may apply to participants with measured covariate support; patients excluded by eligibility, care setting, or treatment contraindications may have different effects. Report the recruitment context and relevant effect modifiers. Standardization to external population data can improve transport only when those modifiers are measured and the study includes sufficient support.

## Keep the denominator auditable

A participant flow diagram should show the source population, exclusions before time zero, exposure groups, events, censoring, and analytic sample. Report person-time alongside event counts when a rate is estimated. State whether the denominator is people, person-years, or matched risk sets. This lets readers detect denominator changes caused by exclusions, delayed entry, or sampling fractions.

Present crude and adjusted estimates with the same effect scale where possible. Give absolute risks or rates alongside relative measures and identify the standard population used for adjustment. If matching or weighting changes the target population, name it directly. A table of model coefficients alone cannot communicate who the estimate represents.

## Reconcile design efficiency with evidence strength

The efficiency of a case-control sample is valuable when assays or follow-up are costly, but the parent sampling frame remains part of the inference. Retain linkage to the cohort when possible so absolute risk, sampling weights, and outcome rates can be recovered. If only the sampled data are available, avoid presenting estimates that require the unsampled denominator. A cohort’s apparent comprehensiveness is also no guarantee of validity: missing exposure history, outcome coding, and loss to follow-up can erase its advantage unless measurement and follow-up are adequate.

## Interpret the occupational cohort contrast

In the worked rate example, the rate difference of 0.75 events per 1,000 person-years can be translated into an excess of about 7.5 events per 10,000 person-years if the rate is stable and the exposed population is comparable. This is not the same as 7.5 excess people per 10,000 over ten years: follow-up duration, competing mortality, and changing rates affect cumulative risk. Report both rate and horizon-specific risk when the cohort supports each.

## References and further reading

- Hernán MA, Robins JM. [*Causal Inference: What If*](https://www.hsph.harvard.edu/miguel-hernan/causal-inference-book/). Chapman & Hall/CRC; 2020.
- Rothman KJ, Greenland S, Lash TL, eds. *Modern Epidemiology*. 3rd ed. Lippincott Williams & Wilkins; 2008.
- Pearce N. What does the odds ratio estimate in a case-control study? *International Journal of Epidemiology*. 1993;22:1189–1192. https://doi.org/10.1093/ije/22.6.1189
- STROBE. [Strengthening the Reporting of Observational Studies in Epidemiology](https://www.strobe-statement.org/).
- Hernán MA, Sauer BC, Hernández-Díaz S, Platt R, Shrier I. Specifying a target trial prevents immortal time bias and other self-inflicted injuries in observational analyses. *Journal of Clinical Epidemiology*. 2016;79:70–75. https://doi.org/10.1016/j.jclinepi.2016.04.014
