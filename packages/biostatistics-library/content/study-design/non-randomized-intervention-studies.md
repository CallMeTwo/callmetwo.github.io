---
title: Non-randomized intervention studies
summary: How to estimate intervention effects when assignment is not randomized, using explicit causal questions and quasi-experimental designs.
---

## Overview

Non-randomized intervention studies evaluate programs, policies, services, or treatments when people or organizations receive them through clinical decisions, personal choice, geography, administrative rules, or practical constraints rather than chance. These studies are often the only way to assess a policy operating at scale or a treatment that cannot ethically be withheld. Their central difficulty is that intervention and comparison groups may have different outcomes even if the intervention had no effect.

Statistical adjustment does not erase that difficulty. A causal conclusion requires a credible comparison representing the outcome that would have occurred under the alternative strategy. The strongest analyses begin with the assignment mechanism: who became treated, when, and why? They define a target trial, choose a design whose assumptions fit that mechanism, and make the assumptions testable where possible. A sophisticated model applied to a weak comparison remains a weak design.

## Reconstruct the trial you wish had been run

Before opening the outcome results, specify the target population, eligibility criteria, treatment strategies, assignment time, follow-up start and end, outcome, and causal contrast. This target-trial protocol exposes mismatches between eligibility and treatment initiation. If follow-up begins after treatment starts, patients must survive or remain event-free during the gap to be classified as treated, creating immortal-time or selection bias. A new-user, active-comparator design often aligns the eligibility and treatment decisions better than a comparison of prevalent users with untreated people.

Potential outcomes give a precise target. Let (Y^1) and (Y^0) denote the outcome under strategies 1 and 0. The average treatment effect is (E(Y^1-Y^0)) in the eligible population; the average effect among treated is (E(Y^1-Y^0\mid A=1)). They differ when effects vary or when the treated population differs from the full target population. Specify whether the question concerns initiating treatment, sustained adherence, assignment to a program, or actual receipt. These are distinct interventions, and each needs its own handling of discontinuation, crossover, and competing events.

Identification commonly relies on consistency, conditional exchangeability, and positivity. Consistency means the observed outcome under the received strategy corresponds to that strategy's potential outcome, and treatment versions are sufficiently well defined. Conditional exchangeability says that after controlling for measured pre-treatment covariates (L), assignment is independent of potential outcomes. Positivity requires a nonzero chance of each strategy at every covariate pattern in the target population. Interference may violate the assumption that one person's treatment leaves another's outcome unchanged, especially for vaccination, hospital policy, and community programs. These conditions are substantive, not properties a regression diagnostic can prove.

## Let the assignment process choose the design

Draw a timeline and a causal diagram. Include determinants of intervention uptake and outcome, the timing of each measure, and variables changed by earlier exposure. Ask whether assignment arose from a cutoff, a rollout schedule, a clinical choice, a capacity constraint, or a secular trend. This history determines which comparisons are plausible and what effect they estimate.

If treatment is selected based on observed baseline risk and there is overlap, matching, weighting, standardization, or outcome regression may adjust measured confounders. If a policy is introduced at a known date with enough pre- and post-period observations, interrupted time series may be more credible. If treated and comparison groups are observed before and after a change, difference-in-differences may remove common time shocks under a parallel-trends assumption. If a threshold changes assignment sharply, regression discontinuity may identify a local effect. If an external instrument shifts treatment but otherwise has no outcome pathway, instrumental variables may identify an effect among compliers. These methods do not estimate interchangeable quantities.

Describe the comparator's access to services and other concurrent changes. “Untreated” may mean usual care, delayed access, ineligible, or not yet exposed; each creates a different contrast. A historical control can differ in diagnostic criteria, coding, staffing, referral patterns, and background prognosis. A concurrent active comparator may improve comparability but change the question to one treatment versus another. Explain why this group approximates the counterfactual, rather than relying on its label.

## Adjustment for measured baseline confounding

For a baseline exposure (A) and covariates (L), the propensity score (e(L)=P(A=1\mid L)) can be used for matching, stratification, weighting, or as a covariate. Inverse-probability weighting creates a pseudo-population where measured baseline covariates are balanced in expectation. Stabilized ATE weights are (P(A=a)/P(A=a\mid L)); ATT weights assign 1 to treated and (e(L)/(1-e(L))) to controls. The estimand follows the weighting scheme, so say whether the result targets all eligible people or those treated.

```r
ps_fit <- glm(A ~ age + severity + comorbidity + prior_use,
              family = binomial(), data = d)
d$ps <- predict(ps_fit, type = "response")
p_treat <- mean(d$A == 1)
d$sw <- ifelse(d$A == 1, p_treat / d$ps,
               (1 - p_treat) / (1 - d$ps))
weighted_fit <- glm(Y ~ A, family = binomial(), data = d, weights = sw)
summary(weighted_fit)
```

This code illustrates stabilized weights for a binary outcome, not a complete causal analysis. Inspect covariate balance after weighting using standardized differences, score overlap, the weight distribution, and effective sample size. Near-zero propensity scores create huge weights and indicate that the data contain little support for one strategy in some strata. Trimming weights can reduce variance but changes the bias-variance trade-off and may alter the target population. State the rule and show sensitivity to plausible choices.

The model-based standard error printed by this weighted `glm` may not account adequately for estimated weights or clustering. Use an inference method suited to the design, such as a robust sandwich estimator or bootstrap that repeats propensity estimation and respects the assignment unit. For a risk difference, predict standardized risks under each treatment and subtract them; a logistic regression coefficient is an odds ratio and is not a risk difference. Doubly robust estimators combine treatment and outcome models and may remain consistent if one model is correctly specified, given the identification assumptions. They do not protect against unmeasured confounding, poor overlap, or ill-defined interventions.

## When exposure changes over time

Ordinary adjustment can fail when a time-varying covariate predicts later treatment and outcome but is itself affected by earlier treatment. Adjusting for it in a conventional regression can block part of the treatment effect or open a biased path. Marginal structural models use inverse probability weights for treatment and censoring histories; the parametric g-formula models the outcome process under specified treatment regimes; structural nested models provide another option. These methods require sequential exchangeability, consistency, and positivity at each time point. Extreme longitudinal weights are common and signal weak support for sustained regimes.

Define treatment histories clearly: initiation, duration, adherence, switching, and discontinuation. Censoring at treatment deviation can create selection bias; inverse probability of censoring weights may address it under additional assumptions. Report how the strategy handles death, competing events, and loss to follow-up. A per-protocol effect and an initiation effect are not the same estimand.

## Use natural experiments with explicit assumptions

### Difference-in-differences

With treated and comparison groups measured before and after intervention, the basic estimator is

\[
\widehat{\tau}_{DID}=(Y_{T,post}-Y_{T,pre})-(Y_{C,post}-Y_{C,pre}).
\]

For example, if treated districts fall from 18 to 14 admissions per 10,000 and comparison districts fall from 16 to 15, then DID is ((14-18)-(15-16)=-3) admissions per 10,000. The estimate says the treated group's rate declined by three more than the comparison group's over the period, under the model. A causal reading requires that, absent the policy, the groups would have followed parallel trends on the chosen scale.

Plot multiple pre-intervention periods and assess their substantive comparability. A non-significant pretrend test does not prove parallel trends; such tests can have low power. Check anticipation, concurrent programs, composition changes, and spillovers. Cluster uncertainty at the policy assignment unit. With staggered adoption and heterogeneous effects, a conventional two-way fixed-effects regression can mix comparisons and produce difficult-to-interpret weights. Cohort-time methods or event-study estimators designed for staggered rollout are generally preferable. Define which cohorts and post-treatment periods contribute to the target contrast.

### Interrupted time series

Segmented regression models an expected level and trend change at implementation, for example (Y_t=\beta_0+\beta_1t+\beta_2I(t\ge T)+\beta_3(t-T)_++\epsilon_t). Here β₂ is an immediate level change and β₃ a change in slope, conditional on the model. Choose the time scale and functional form before examining a set of candidate breakpoints. Consider autocorrelation, seasonality, overdispersion for counts, missing observations, and delayed effects. A control series exposed to similar background conditions but not to the intervention can strengthen the comparison. A coincident shock, altered coding system, or changing population can still mimic the intervention.

### Regression discontinuity

When treatment eligibility changes at a threshold in a running variable, compare units just above and below the cutoff. The local effect is credible if potential outcomes evolve smoothly through the threshold, units cannot precisely manipulate assignment, and treatment probability actually changes there. Plot outcome and covariate patterns, inspect the running-variable density, justify the bandwidth, and report sensitivity to polynomial form and bandwidth. A fuzzy design uses the assignment jump as an instrument for treatment; it identifies a local effect for compliers near the cutoff under additional assumptions, not an average effect for everyone.

### Instrumental variables

An instrument must predict treatment (relevance), be independent of potential outcomes (independence), affect the outcome only through treatment (exclusion), and often satisfy monotonicity for a local average treatment effect interpretation. The exclusion restriction is usually not empirically testable. Explain why the instrument exists and why alternative pathways are implausible. Weak instruments produce unstable estimates and poor confidence-interval coverage. Do not call an instrument a generic fix for confounding; its estimate answers a particular local question for people whose treatment changes with the instrument.

## Diagnose what the data can and cannot tell you

Check covariate balance and overlap, missingness, measurement quality, outcome definition stability, and influential observations. For quasi-experimental designs, examine pre-trends, cutoff manipulation, placebo dates, negative-control outcomes, and alternative windows where justified. Diagnostics can uncover violations, but a passed diagnostic is not proof of the identifying assumption. Use negative controls only when their own causal relationships are understood.

Quantify sensitivity to unmeasured confounding where feasible. State a plausible confounder, its associations with exposure and outcome, and how strong those associations would need to be to change the estimate. Compare alternative specifications that follow a causal rationale, not a search for the most favorable p-value. Consider how differential exposure misclassification, outcome ascertainment, censoring, and selection into linked data could bias results. Missing covariates should not be treated as resolved merely by complete-case analysis or imputation; explain the assumptions each approach requires.

For small treated-cluster counts, conventional standard errors can be anti-conservative even with many people per cluster. Use small-sample corrections, randomization-based inference when the assignment mechanism supports it, or design-specific methods. Report the number of independent assignment units. Precision should be discussed in light of the effective comparison, not only the record count.

## Worked analysis and interpretation

Imagine a vaccination reminder is introduced in 12 clinics while 10 comparable clinics continue usual outreach. The primary question is the policy effect on completed vaccination by six months among eligible patients registered before rollout. Define clinic-level implementation date as assignment, preserve the pre-rollout eligibility cohort, and compare clinic rates over several periods. If reminders spill across clinics or patients move between them, document that exposure contamination. Adjusting for baseline clinic and patient characteristics may help, but the policy's nonrandom adoption may depend on leadership, staffing, and local need.

For DID, estimate the change in treated clinics relative to comparison clinics and cluster uncertainty by clinic, the level of assignment. Plot pre-period vaccination trends, test sensitivity to excluding clinics with concurrent campaigns, and report absolute percentage-point differences. If rollout is staggered, use an estimator that handles treatment timing and heterogeneous effects rather than interpreting an unqualified two-way fixed-effects coefficient. If pre-trends diverge substantially, the causal interpretation weakens; additional covariate adjustment does not automatically repair it.

R's `lm()` can fit a basic two-period contrast, but a real analysis should reflect repeated clinics, patient denominators, and uncertainty at assignment level. For counts, use an appropriate binomial or count model; standardize predictions to the target patient population. Report both the model contrast and the raw clinic-period data so readers can inspect the comparison. A confidence interval quantifies sampling uncertainty conditional on the model, not uncertainty from every design assumption.

## Explain the strength of evidence without overstating it

Use language matched to design: “was associated with,” “the adjusted estimate,” or “under the parallel-trends assumption” when assumptions remain uncertain. Reserve direct causal language for settings where the design and supporting evidence make the counterfactual credible. Report the estimate, interval, absolute scale, target population, follow-up period, and assumptions. Show how alternative reasonable choices affect conclusions, and distinguish confirmatory analyses from exploratory subgroup and outcome searches.

Transparent reporting should include the target-trial protocol, assignment process, inclusion flow, treatment definitions, time zero, confounder rationale, missing-data handling, model specification, diagnostics, and sensitivity analyses. State deviations from protocol and whether they were outcome-informed. Describe generalizability: a local cutoff effect or clinic-specific rollout may not transfer to other thresholds, care systems, or populations. A careful quasi-experiment can be more informative than an underpowered randomized trial, but design credibility comes from the assignment mechanism and the data, not from a method name.

## A practical route from question to estimator

Use the assignment mechanism to narrow the design before trying multiple models. If treatment depends on a measured clinical score and every score range has treated and untreated patients, baseline adjustment may be plausible. If treatment is assigned by a sharp eligibility cutoff, use a regression-discontinuity design rather than extrapolating a global regression across the entire score range. If a policy starts on a known date and a comparable unaffected outcome series exists, an interrupted time series or controlled time series may better account for secular change. If adoption timing varies across locations, determine whether a staggered difference-in-differences method fits the rollout and effect heterogeneity. If none of these mechanisms offers a believable comparison, report a descriptive association and explain what stronger data would be required.

This decision is not a competition to use the most sophisticated estimator. The estimand, support in the observed data, and assumptions should drive the choice. A propensity model can balance measured covariates while leaving severe unmeasured confounding. A quasi-experimental design can be more credible with fewer observations when assignment near a threshold or timing rule is plausibly as-if random. Conversely, a natural-experiment label does not rescue an invalid exclusion restriction or clearly nonparallel trends.

## Diagnostics as questions, not certification

After fitting, ask whether the data show features that contradict the design story. For propensity weighting, inspect score overlap and balance before and after weighting, then quantify effective sample size (ESS=(\sum_iw_i)^2/\sum_iw_i^2). If a nominal cohort of 20,000 has weighted ESS of 900, the estimate behaves more like a sample of that scale for some purposes. For DID, plot outcomes for every pre-period, check changes in composition, and examine whether a placebo intervention date creates a similar “effect.” For regression discontinuity, inspect the running-variable density and covariate continuity near the threshold. For ITS, plot the full series and residual autocorrelation. These checks can identify weaknesses, but none certifies the unobserved counterfactual.

```r
ess <- function(w) sum(w)^2 / sum(w^2)
ess(d$sw)
```

Report diagnostics that could change how a reader interprets the estimate, not only a large panel of routine tests. A non-significant pretrend test can reflect low power; show the estimated trend differences and intervals. A balanced covariate table only covers measured covariates. Negative-control outcomes can reveal a shared bias pathway only if the intervention truly cannot affect them and they share relevant confounding structures.

## Small worked sensitivity example

Suppose the weighted estimate of a program is a 4-percentage-point increase in adherence, with a 95% confidence interval from 1 to 7 points. Balance is good on recorded age, severity, and prior use, but clinicians also select patients based on motivation, which is not recorded. The statistical interval does not include uncertainty from motivation. A useful sensitivity analysis can posit a binary motivation indicator, specify its prevalence in each group and its association with adherence, then estimate how much the adjusted effect would move. If plausible differences could erase the 4-point estimate, state that limitation; if only extreme values do so, explain why those values are implausible. Avoid an unsupported statement that “residual confounding may remain” as the only sensitivity assessment.

Even a robustness value or bias factor is conditional on a model. It cannot tell the reader which unmeasured factor is most credible. Pair quantitative analysis with subject-matter knowledge and report the assumptions behind the sensitivity parameters. Also inspect outcome definition, exposure misclassification, censoring, and selection into the analytic cohort: confounding is not the only route to bias.

## References and further reading

- Hernán MA, Robins JM. *Causal Inference: What If*. Chapman & Hall/CRC; 2020. [Free online text](https://www.hsph.harvard.edu/miguel-hernan/causal-inference-book/)
- Hernán MA, Sauer BC, Hernández-Díaz S, Platt R, Shrier I. Specifying a target trial prevents immortal time bias and other self-inflicted injuries in observational analyses. *Journal of Clinical Epidemiology*. 2016;79:70–75. [https://doi.org/10.1016/j.jclinepi.2016.04.014](https://doi.org/10.1016/j.jclinepi.2016.04.014)
- Wing C, Simon K, Bello-Gomez RA. Designing difference in difference studies: best practices for public health policy research. *Annual Review of Public Health*. 2018;39:453–469. [https://doi.org/10.1146/annurev-publhealth-040617-013507](https://doi.org/10.1146/annurev-publhealth-040617-013507)
- Bernal JL, Cummins S, Gasparrini A. Interrupted time series regression for the evaluation of public health interventions. *International Journal of Epidemiology*. 2017;46(1):348–355. [https://doi.org/10.1093/ije/dyw098](https://doi.org/10.1093/ije/dyw098)
- Imbens GW, Lemieux T. Regression discontinuity designs: a guide to practice. *Journal of Econometrics*. 2008;142(2):615–635. [https://doi.org/10.1016/j.jeconom.2007.05.001](https://doi.org/10.1016/j.jeconom.2007.05.001)
- The library's [bias and confounding article](bias-and-confounding.html) reviews confounder control; [randomized controlled trials](randomized-controlled-trials.html) provides the target-trial benchmark.
