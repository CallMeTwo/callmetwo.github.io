---
title: Absolute risk differences
summary: The simple difference in event risk between two groups — the effect size most directly tied to clinical decisions.
---

## Overview

The absolute risk difference compares the probability of an outcome between two groups: RD = risk in group 1 minus risk in group 0. It expresses how many more or fewer events occur per person or population over a specified period. An absolute contrast is often directly relevant to patients and services because it depends on baseline risk as well as relative treatment effect.

An absolute risk difference is not a complete causal claim by itself. Its interpretation depends on study design, population, outcome definition, follow-up, confounding control, and whether risks are measured or standardized. Always state the denominator, time horizon, and direction of subtraction. A negative difference can mean benefit or harm depending on which group is subtracted first.

## Risk difference versus relative effects

If risk is 20% under usual care and 15% under an intervention, RD=0.15−0.20=−0.05, a reduction of 5 percentage points. The risk ratio is .15/.20=.75, a 25% relative reduction. Both describe the same two risks but answer different questions. Reporting only the relative reduction can make the absolute benefit seem larger than it is when baseline risk is low.

Absolute differences vary across populations even when relative effects are similar. If baseline risk is 4% and the relative risk is .75, treated risk is 3% and RD is −1 percentage point. With a 20% baseline risk, treated risk is 15% and RD is −5 points. Transporting a relative effect does not guarantee that absolute benefit transports, because baseline risk and treatment effect heterogeneity may differ.

The number needed to treat (NNT) is often defined as 1/absolute risk reduction over a stated follow-up. For a 5-point reduction, NNT=20 over that period. This is an interpretation of a group average, not a prediction that every 20 treated patients produce exactly one prevented event. If the risk difference is uncertain or crosses zero, the reciprocal can be unbounded or change sign; report the risk difference and interval first.

### A 2×2 table calculation

Suppose 30 of 200 people in an intervention group have a 30-day event, compared with 44 of 200 controls. Risks are 0.15 and 0.22. The intervention-minus-control difference is 0.15−0.22=−0.07, or 7 fewer events per 100 participants. A rough standard error is sqrt[.15(.85)/200 + .22(.78)/200] ≈ .039. A normal 95% interval is −.07 ± 1.96(.039), approximately −.147 to .007. It includes no difference and a potentially substantial reduction.

~~~r
tab <- matrix(c(30, 170, 44, 156), nrow = 2, byrow = TRUE,
              dimnames = list(group = c("intervention", "control"),
                              outcome = c("event", "no_event")))
risk <- tab[, "event"] / rowSums(tab)
rd <- risk["intervention"] - risk["control"]
rd
~~~

For formal inference, use a suitable score-based interval for the difference or a regression/standardization approach that respects the design. If clustered randomization was used, account for clustering. The code assumes complete binary outcomes and equal follow-up; it does not adjust for baseline risk or missingness.

## Estimation and uncertainty

For independent binomial groups, the plug-in risk difference is p1−p0. A simple Wald standard error uses estimated binomial variances, but coverage can be poor with small samples or risks near 0 or 1. Newcombe-Wilson, score, or exact methods often behave better. For matched or paired outcomes, use within-pair information; treating paired observations as independent wastes or misstates uncertainty.

In randomized trials, an unadjusted risk difference estimates the marginal assignment contrast under follow-up assumptions. Baseline-adjusted regression can improve precision, especially when prognostic factors are strong. Obtain adjusted risks by standardizing predicted outcomes across the target population, then subtract them. A logistic coefficient is an odds ratio on a conditional scale, not an absolute risk difference. Report model-based risks and the standardization method.

~~~r
fit <- glm(event ~ treatment + age + baseline_risk,
           data = dat, family = binomial())
d1 <- transform(dat, treatment = 1)
d0 <- transform(dat, treatment = 0)
r1 <- mean(predict(fit, d1, type = "response"))
r0 <- mean(predict(fit, d0, type = "response"))
c(risk_treated = r1, risk_control = r0, RD = r1 - r0)
~~~

This g-computation example estimates a marginal contrast under the fitted model. In randomized data it can be a precision-adjusted estimate; in observational data causal interpretation requires exchangeability, positivity, consistency, and adequate model specification or a robust alternative. Bootstrap patients for uncertainty and repeat the model fit and standardization in each replicate.

## Unequal follow-up and competing events

A proportion is a risk only over a defined follow-up and with adequate outcome ascertainment. If follow-up varies, comparing crude event proportions can be misleading. Survival methods estimate cumulative risk at a specified time while accounting for right censoring, under assumptions about censoring. State the horizon, such as 1-year risk difference, and use a method that incorporates censoring.

Competing events change the probability of the event of interest. If death prevents a nonfatal outcome, treating death as ordinary censoring estimates a different quantity than cumulative incidence. Define whether the target is cause-specific risk, composite outcome, or a hypothetical risk absent the competing event. Report competing-event frequency and method.

For recurrent outcomes, risk of at least one event differs from event rate. One event per person denominator estimates cumulative occurrence; a recurrent-event rate uses person-time and can count multiple events. These measures have different clinical meanings and cannot be substituted without assumptions.

## Risk differences in observational data

In nonrandomized studies, crude RD can reflect confounding and selection. Standardization estimates risks under each exposure setting by predicting outcomes for a common covariate distribution and averaging. Inverse probability weighting reweights observations to create a pseudo-population with exposure independent of measured confounders under assumptions. Matching can target a matched population rather than the entire source population. State the target and method.

Causal identification requires no unmeasured confounding conditional on covariates, positivity, consistency, and appropriate handling of selection and missingness. Risk differences can be estimated with outcome regression, propensity methods, or doubly robust estimators, but none guarantees these assumptions. Inspect overlap and avoid extrapolating to covariate patterns where one exposure group is absent.

Absolute effects can be heterogeneous. A common relative effect can imply larger absolute benefit among people with higher baseline risk. Conversely, effect modification may occur on both relative and additive scales. Report subgroup contrasts with prespecified rationale and uncertainty; do not infer benefit heterogeneity merely because one subgroup has a significant result and another does not.

## Statistical versus clinical importance

An interval excluding zero does not imply a worthwhile effect. Compare the point estimate and interval with a clinically important difference defined using patient values, outcome severity, and intervention burden. A precise 0.5 percentage-point reduction may be negligible for a burdensome treatment; a wide interval may include meaningful benefit and harm.

Equivalence and noninferiority questions require prespecified margins. Failure to find a significant difference does not establish equivalence. For noninferiority, the confidence interval must exclude a clinically unacceptable loss under the chosen scale and analysis. Margins should be justified clinically and statistically before results are known.

## Communication and NNT conventions

Report both group risks and the absolute difference, with units and follow-up. “Five fewer per 100 over 30 days” is more interpretable than “25% reduction” alone. If NNT is reported, state whether it treats or prevents one event, direction, horizon, and interval convention. When RD uncertainty crosses zero, an NNT interval may include benefit and harm regions; do not present a misleading finite range.

For patient communication, baseline risk matters. A relative risk reduction of 25% corresponds to 25 fewer per 100 if baseline risk is 100%, but only one fewer per 100 if baseline risk is 4%. Present natural frequencies using the target population and distinguish average effect from individual prediction.

## Sample size and precision planning

Planning an RD study should target a clinically meaningful difference and a desired interval width, not simply conventional power. Under independent binomial sampling, variance depends on both group risks and group sizes. Rare events require more participants to estimate a small absolute difference precisely. Cluster randomization inflates sample requirements according to cluster size and intraclass correlation; imbalance in cluster sizes can increase this further.

For illustration, a control risk of 20% and an intervention risk of 15% imply a 5-point difference. If the true difference is only 1 point, substantially more participants are required to distinguish it from random error. Power calculations assume the baseline risk and effect are plausible; uncertainty in those inputs should be explored. In pragmatic trials, loss to follow-up and contamination also reduce effective information.

For an observational analysis, sample size alone does not ensure positivity. If very high-risk patients almost always receive treatment, the data may not identify the untreated risk for that group, even with thousands of records. Inspect covariate overlap, effective sample size under weighting, and extreme weights. Narrowing the target to supported patients may be more defensible than extrapolating.

### Bootstrap uncertainty for adjusted contrasts

When risks are obtained from regression standardization, bootstrap the independent units and repeat the complete estimation procedure: fit the model, predict under each exposure condition, average, and calculate the difference. If there are clinics or households, resample clusters. For propensity methods, re-estimate weights in each replicate. This captures some estimation variability but not unmeasured confounding or all model uncertainty.

~~~r
set.seed(18)
B <- 1000
boot_rd <- replicate(B, {
  id <- sample(seq_len(nrow(dat)), replace = TRUE)
  d <- dat[id, ]
  m <- glm(event ~ treatment + age + baseline_risk,
           data = d, family = binomial())
  r1 <- mean(predict(m, transform(d, treatment = 1), type = "response"))
  r0 <- mean(predict(m, transform(d, treatment = 0), type = "response"))
  r1 - r0
})
quantile(boot_rd, c(.025, .5, .975))
~~~

This is a basic independent-patient bootstrap. It assumes a suitable model and complete cases; clustered sampling, missing data, or matched designs need different resampling. A percentile interval can perform poorly in small samples or with boundaries, so consider appropriate score or model-based intervals and report method.

## Standardization target and transport

Adjusted risks depend on the covariate distribution over which predictions are averaged. Averaging over the study sample estimates a study-population marginal contrast. Averaging over an external target population requires target data, compatible covariate definitions, and adequate overlap. These targets can yield different absolute differences even with the same fitted conditional model.

Standardization can make effect modification visible. Predict each person’s outcome under both exposure values, average the two sets of predictions within meaningful strata, and contrast. If a subgroup has a higher baseline risk, the absolute difference may be larger even under a constant relative effect. Report both baseline risk and treatment contrast. Avoid applying a sample-average RD to every individual.

### Rates, attributable fractions, and policy scale

Risk difference can be used to estimate population impact only when exposure prevalence, causal interpretation, and target population are appropriate. A population attributable fraction depends on the causal effect and prevalence of exposure; it is not simply the observed fraction of cases exposed. For a policy, the number of events prevented can be approximated by RD multiplied by the eligible population, but only if uptake, adherence, effect transport, and follow-up align.

For event rates, the rate difference compares events per person-time and can accommodate recurrent outcomes. It does not equal the difference in cumulative risks when follow-up varies or hazards change. State units such as 3 fewer events per 1,000 person-years. For time-to-event effects, report a fixed-horizon risk difference alongside hazard ratios when possible because hazard ratios are not absolute risks and can be difficult to communicate.

### Common interpretation traps

Do not subtract percentages with different denominators or follow-up periods. Do not call an odds difference a risk difference. Do not reverse the subtraction direction without changing the label. Do not compute NNT from a relative risk alone without baseline risk. Do not interpret adjusted RD causally in observational data without assumptions. Do not treat a statistically significant difference as clinically important without a meaningful threshold.

A result should state: intervention and comparator; population; outcome and horizon; each group’s risk; absolute contrast and direction; interval method; adjustment or standardization target; and relevant missingness or competing events. This gives the reader the quantities needed to judge both magnitude and credibility.

## Marginal and conditional risk contrasts

An adjusted model can produce conditional contrasts at fixed covariate values or marginal contrasts averaged over a population. These are not always identical. Logistic regression’s conditional odds ratio is non-collapsible, and conditional risks averaged over a different covariate distribution can change. If the decision concerns expected events in a population, standardized marginal risks are often easier to interpret.

Choose adjustment variables based on design and causal structure. In a randomized study, baseline adjustment can improve precision; adjusting for post-randomization variables may block part of the effect or introduce bias. In observational data, adjust for confounders identified from subject-matter knowledge, not every available variable. Conditioning on a collider can create an association. Report the adjustment set and show overlap.

For a continuous outcome, the mean difference is a location contrast, not an absolute risk difference. For a binary outcome, use risks rather than logistic coefficients if communicating an RD. If model predictions are standardized, report the model family, link, covariates, and population used for averaging. Use robust or bootstrap intervals as justified by the design.

### Competing risks and estimand choices

When death competes with a nonfatal outcome, cumulative incidence estimates the probability of the event before death. Treating death as ordinary censoring and using one minus Kaplan–Meier estimates a hypothetical net risk in a world where competing death is removed, not the observed probability. The risk difference between treatment groups depends on which estimand is desired. A composite outcome including death may answer a different clinical question.

For treatment discontinuation or rescue therapy, define whether outcomes are analyzed by treatment assignment, while on treatment, or under a hypothetical no-rescue scenario. These estimands can produce different absolute differences. Randomization directly supports some contrasts more than others; censoring and missingness strategies require sensitivity assumptions. State how intercurrent events enter the question before computing risks.

## NNT under uncertainty and time

NNT is a nonlinear transformation. If the risk-difference interval is entirely beneficial, reciprocal endpoints yield an interval with reversed order. If it crosses zero, the NNT confidence set has disjoint benefit and harm regions and may extend to infinity. A simple symmetric interval around NNT is incorrect. Report the risk difference with its interval as the primary result and use a recognized method for NNT uncertainty.

NNT varies with baseline risk, follow-up horizon, adherence, and competing events. “NNT of 20” without a time period is incomplete. For an intervention with both benefit and harm, report NNT to benefit and NNH to harm over the same horizon, with uncertainty. These are averages over a population, not guarantees for individuals.

## Absolute effects for shared decisions

Present natural frequencies using a denominator that matches the audience: for example, among 100 similar people followed for one year, 20 may experience the event under usual care and 15 under treatment. This communicates both baseline risk and absolute change. Show uncertainty and explain that the numbers reflect average study evidence, not certainty for one person.

The same treatment can have different absolute benefit for people with different baseline risks. A risk model can stratify baseline risk, but applying one relative effect across strata assumes that relative effect transports. If treatment effects vary, individualized benefit prediction needs causal evidence and validation. Do not tell an individual their treatment benefit from prognostic risk alone.

Equity also matters: treatment availability, adherence, and baseline risk can differ by setting. A population-level reduction estimated under trial uptake may overstate benefit where access is limited. Policy projections should incorporate realistic uptake and implementation, and identify groups who may be missed.

When comparing studies, align outcome definitions, follow-up, and target populations before contrasting RDs. A smaller absolute effect may reflect lower baseline risk rather than weaker relative efficacy. Meta-analysis can pool compatible effects, but heterogeneity and transport should be reported rather than hidden in one average.

An estimate’s precision should be interpreted alongside risk of bias, outcome measurement, adherence, and loss to follow-up. A narrow interval around a biased estimate remains misleading.

State whether the estimate is descriptive or causal and distinguish the statistical interval from uncertainty due to unmeasured bias, selection, and transport.

Use a consistent direction and unit when presenting all contrasts.

## Translating results to the target population

If risks are standardized to a target population, describe its covariate distribution and how it differs from the study sample. The contrast should not be transported beyond support without explicit extrapolation assumptions.

## References and further reading

- Altman DG, Andersen PK. Calculating the number needed to treat for trials where the outcome is time to an event. *BMJ*. 1999;319:1492–1495. [doi:10.1136/bmj.319.7223.1492](https://doi.org/10.1136/bmj.319.7223.1492).
- Newcombe RG. Interval estimation for the difference between independent proportions: comparison of eleven methods. *Statistics in Medicine*. 1998;17:873–890.
- See [Risk ratios and odds ratios](risk-ratios-and-odds-ratios.html) for relative measures.
