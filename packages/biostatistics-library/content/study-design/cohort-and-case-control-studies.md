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

## Cohort design: entry, follow-up, and measures

## Cohort estimands and analysis variants

## Competing risks and recurrent events

For a first event with competing causes, the cumulative incidence is the real-world probability of the event by time (t) before a competing event. Kaplan–Meier treating competing events as censoring estimates a hypothetical net risk and overestimates actual probability. Cause-specific hazards describe instantaneous rates among those still free of any event; subdistribution hazards model cumulative incidence. Choose the measure that matches the clinical question and report absolute cumulative incidence at specified times. For recurrent events, define whether the estimand is first event, event count, time between events, or total burden. Andersen–Gill, conditional frailty, negative binomial, and marginal rate models encode different assumptions about within-person dependence and event history.

## Bias from exposure timing and immortal person-time

Exposure status should be determined using information available at the beginning of the risk interval. If follow-up begins before exposure classification is complete, assign the intervening time correctly (unexposed, a grace-period regime, or excluded by design) rather than backdating treatment. Landmark analyses define eligibility and exposure at a fixed landmark and begin follow-up after it, but estimate effects among landmark survivors. New-user designs reduce prevalent-user depletion and align covariate measurement before initiation. Active comparators can reduce confounding by indication by comparing patients eligible for similar treatment decisions.

## Case-control sampling efficiency

In incidence-density sampling, each case's controls come from the risk set at that event time; the conditional logistic OR estimates the incidence rate ratio regardless of outcome rarity. In cumulative sampling, controls are sampled from noncases at the end of follow-up and the OR approximates a risk ratio only when disease is rare (or can be converted with baseline risk information). Nested case-control analysis can lower biomarker assay cost, but sampled controls may be reused and weights may be needed if sampling fractions vary. Document matching and risk-set construction sufficiently for replication.

The cohort framework accommodates several estimands that should not be conflated. Cumulative risk compares probabilities by a fixed horizon; incidence density compares events per person-time; a risk difference counts excess events per population; survival contrasts account for timing and censoring. Risk ratios, rate ratios, hazard ratios, and odds ratios answer different questions. For a fixed horizon with complete follow-up, a simple risk ratio is transparent. With unequal follow-up or censoring, time-to-event methods are needed, and competing events require cumulative incidence if the target is actual event probability.

An open (dynamic) cohort allows entry and exit over time, while a closed cohort follows a defined baseline population. Open cohorts often use person-time rates; closed cohorts support cumulative incidence if follow-up is adequately observed. A nested case-control study samples controls from a cohort risk set at each case time, reducing assay costs while preserving the efficiency of incidence-density odds-ratio estimation. A case-cohort design samples a subcohort at baseline and includes all incident cases; it can support multiple outcomes but requires design-weighted variance estimation. These are sampling variants of a cohort, not generic unmatched case-control studies.

### Worked rate comparison

In an occupational cohort, exposed workers contribute 18,000 person-years with 36 events; unexposed workers contribute 24,000 person-years with 30 events. Rates are 2.0 and 1.25 per 1,000 person-years. The incidence-rate ratio is 1.6 and the rate difference is 0.75 per 1,000 person-years. Under a Poisson model, an approximate log-rate-ratio SE is \(\sqrt{1/36+1/30}=0.245\); the 95% interval is \(\exp[\log(1.6)\pm1.96(0.245)]≈0.99\) to 2.60. This interval is imprecise and roughly compatible with no rate difference as well as a substantial elevation. It assumes independent Poisson counts and comparable person-time definitions; overdispersion, recurrent events, or clustering require other variance models.

```r
events <- c(36, 30)
py <- c(18000, 24000)
rate <- events / py
irr <- rate[1] / rate[2]
se_log_irr <- sqrt(1 / events[1] + 1 / events[2])
c(rate_exposed_per_1000 = rate[1] * 1000,
  rate_unexposed_per_1000 = rate[2] * 1000,
  IRR = irr,
  lower = exp(log(irr) - 1.96 * se_log_irr),
  upper = exp(log(irr) + 1.96 * se_log_irr))
```

The calculation does not adjust for confounding, age structure, or clustering. A Poisson regression with log person-time offset can adjust measured covariates, but evaluate overdispersion and use robust variance if needed. Standardization can yield adjusted absolute rates in a stated target population.

## Outcome and exposure ascertainment

## Confounding control and target population

The cohort's eligibility criteria define the population to which standardized effects may generalize. Propensity scores can match, stratify, or weight measured baseline covariates, but each method targets a potentially different population and depends on overlap. Matching often discards nonmatchable participants and estimates an effect among those retained. Inverse-probability treatment weighting may target all eligible participants but is unstable under extreme weights. Check covariate balance and effective sample size and report the target after trimming or restriction.

For case-control studies, matching factors should be controlled by design-appropriate analysis. Individual matching typically uses conditional logistic regression, which compares exposure within matched sets; frequency matching uses unconditional regression with matching factors. Matching on too many variables can create sparse sets or overmatching. Matching does not guarantee control of other confounders and can reduce efficiency when a matching factor is weakly associated with exposure.

Define a risk window for exposure before outcome to avoid reverse causation and immortal time. For acute effects, a long exposure look-back can misclassify relevant timing; for chronic disease, latency may require long lags and cumulative exposure metrics. Repeated exposure measurement reduces misclassification but creates time-varying confounding and requires methods aligned with the treatment regime. Use blinded outcome adjudication or validated algorithms; differential surveillance can lead exposed groups to have more outcomes detected even when true incidence is equal.

In case-control studies, choose controls from the source population that produced the cases, and use the same eligibility and time frame. For risk-set sampling, each control must be at risk at the case's event time; sampling controls only once at baseline changes the interpretation. Frequency matching should be reflected in analysis and does not remove confounding on its own. Explain whether a control can later become a case and how repeated selection is handled.

## Causal interpretation and reporting

Construct an explicit causal contrast before selecting covariates. Confounding adjustment should use pre-exposure causes of exposure and outcome; post-exposure mediators are not adjusted when estimating total effects. For time-varying treatment and confounding, specify sequential strategies and consider marginal structural models. Report missing follow-up, linkage failure, competing events, exposure changes, and sensitivity analyses. Cohort design establishes temporal sequence more readily than cross-sectional designs but is not automatically causal; selection into the cohort and loss to follow-up can still undermine comparability.

### Time zero and immortal time

Suppose medication initiators must fill a prescription within 30 days after hospital discharge, while follow-up for outcomes begins on discharge. A patient classified as treated must remain alive and event-free long enough to fill the prescription; the pre-fill interval is “immortal” for that group. Counting it as treated follow-up artificially favors treatment. Assign exposure at a common time zero, use a grace-period design with cloning/censoring/weighting, or formulate a target trial that aligns eligibility, assignment, and follow-up. The method is secondary to making the treatment strategies and time zero explicit.

For a cohort with time-varying treatment, baseline exposure classification may misrepresent later use. Updating exposure can create time-varying confounding if prior treatment affects subsequent confounders. Standard time-dependent Cox regression may adjust for these variables in a way that blocks prior treatment effects; marginal structural models can target regime effects under stronger sequential assumptions. Describe exposure windows and lag periods to reduce reverse causation when early symptoms change treatment.

A cohort is defined by eligibility, exposure or treatment strategies, time zero, follow-up, outcome, and censoring rules. Time zero must align across eligibility and treatment assignment; if exposed participants must survive long enough to begin treatment while controls are followed from an earlier date, immortal-time bias can result. New-user active-comparator designs can improve alignment by comparing patients at the same clinical decision point. In prospective cohorts, measurement can be planned; in retrospective cohorts, data availability and coding validity constrain what can be inferred.

When every participant has a common follow-up window, estimate risk and risk ratios. With unequal observation time, incidence rates use person-time, but a rate ratio is not a risk ratio and assumes a meaningful rate model. For time-to-event outcomes, Kaplan–Meier and Cox approaches account for right censoring under assumptions; informative censoring requires adjustment or sensitivity analysis. Loss to follow-up should be reported by exposure and prognosis, not hidden under a single total.

## Case-control design and sampling

Case-control sampling selects based on outcome status, then compares prior exposure. It is efficient for rare disease or long latency because one need not follow a huge disease-free cohort. With cumulative sampling from a closed cohort, the odds ratio estimates the disease odds ratio. With incidence-density (risk-set) sampling, controls are sampled from people still at risk when each case occurs; the exposure odds ratio estimates an incidence rate ratio, even when outcomes are not rare. Controls may later become cases and can be sampled more than once depending on protocol. Matching can improve efficiency and control design variables but requires matched analysis; it does not itself eliminate confounding.

Controls should represent the exposure distribution in the source population that generated the cases. Hospital controls may be unsuitable if their admission causes are related to exposure. Population controls can be difficult to recruit and may have lower response. Define incident versus prevalent cases, diagnostic criteria, exposure window, and index date. Prevalent case-control studies can suffer Neyman bias because exposure affects survival or disease duration. Recall and interviewer bias are reduced by objective records, blinded coding, and standardized instruments, though records also misclassify.

Example: In a case-control sample, exposure is present in 60/100 cases and 30/100 controls. The OR is \((60×70)/(40×30)=3.5\). It is not valid to say exposed people have 3.5 times the risk based on these sampled counts; case and control totals were fixed by design. Under incidence-density sampling, it may estimate a rate ratio. Under rare-disease assumptions and cumulative sampling, it may approximate a risk ratio.

```r
tab <- matrix(c(60, 40, 30, 70), nrow = 2, byrow = TRUE)
or <- (tab[1, 1] * tab[2, 2]) / (tab[1, 2] * tab[2, 1])
log_or_se <- sqrt(sum(1 / tab))
c(OR = or, lower = exp(log(or) - 1.96 * log_or_se),
  upper = exp(log(or) + 1.96 * log_or_se))
```

The Wald interval is only approximate and can be unreliable with sparse cells. Use conditional logistic regression for individually matched sets, and account for matching factors in frequency-matched designs. Matching on a variable unrelated to exposure can reduce efficiency; matching on a consequence of exposure can induce bias.

## Analysis, causal contrasts, and reporting

Confounder adjustment should follow causal structure, not automatic significance testing. In cohorts, estimate marginal risks or rates in addition to model coefficients when clinical decisions require absolute effects. In case-control studies, conditional and unconditional logistic regression answer different model-based contrasts depending on sampling and matching. Report selection of controls, source population, exposure ascertainment, matching, nonresponse, and sensitivity analyses for misclassification and unmeasured confounding.

For either design, specify how eligibility, exposure, outcome, and follow-up were operationalized before inspecting associations. Handle competing events according to the estimand. A cause-specific hazard and cumulative incidence answer different questions. Avoid classifying exposure using future information, adjusting indiscriminately for post-exposure variables, or comparing prevalent cases with controls without considering survival selection. State clearly whether the estimand is associational, predictive, or causal and what assumptions support it.

- Rothman KJ, Greenland S, Lash TL. *Modern Epidemiology*. 3rd ed. Lippincott Williams & Wilkins; 2008.
- Hernán MA, Robins JM. *Causal Inference: What If*. 2020. https://www.hsph.harvard.edu/miguel-hernan/causal-inference-book/
- Pearce N. What does the odds ratio estimate in a case-control study? *International Journal of Epidemiology*. 1993;22:1189–1192. https://doi.org/10.1093/ije/22.6.1189

- [STROBE Statement](https://www.strobe-statement.org/), reporting guidance for cohort, case-control, and cross-sectional studies.
- Hernán MA, Robins JM. [*Causal Inference: What If*](https://www.hsph.harvard.edu/miguel-hernan/causal-inference-book/). Chapman & Hall/CRC, 2020.
- Rothman KJ, Greenland S, Lash TL, eds. *Modern Epidemiology*. 3rd ed. Lippincott Williams & Wilkins, 2008.
- Klein J, Moeschberger M. *Survival Analysis: A Self-Learning Text*. Springer.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.

The [bias and confounding article](/biostatistics-library/study-design/bias-and-confounding.html) develops selection, information, and confounding bias in detail.
