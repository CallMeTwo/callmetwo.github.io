---
title: Ecological studies
summary: Population-level designs for studying group exposures and outcomes, with attention to aggregation, ecological bias, and multilevel alternatives.
---

## Overview

An ecological study uses groups rather than people as its units of analysis. A group may be a district, hospital, school, country, workplace, or place-time combination. The exposure and outcome are measured or summarized for each group, and the analysis asks how those group-level quantities vary together. This design is often efficient because administrative records and public statistics are already organized by area. It is also directly relevant when a decision is made for a whole community, such as changing a clean-air rule or allocating health services across districts.

The central discipline is to state the level at which a claim is being made. An association between districts with higher average pollution and higher mortality is a between-district association. It does not by itself identify how an individual's risk changes when that person's exposure changes. Aggregated data suppress the joint distribution of individual exposures, outcomes, and confounders; many individual patterns can produce the same group averages. This is the ecological inference problem. It does not make ecological research invalid, but it limits the claims that the design can support.

## Decide what the group represents

Groups can be the target population, the setting, the assignment unit, or a convenient reporting boundary. Those roles have different implications. If a policy is enacted by county and the outcome is county-level admissions, the policy effect on county rates may be the policy question. If counties merely summarize individual exposure and disease, a person-level association is not identified by the county regression. Define the group, the time window, and the contrast before selecting a statistical model.

An area-level estimand might be the change in age-standardized admission rate under a policy regime compared with the rate that would have occurred without it. A compositional estimand might compare places with different population distributions. A contextual estimand might examine whether features of the place affect all residents regardless of their individual characteristics. These are distinct. A group-level coefficient should not be translated into an individual treatment effect unless the design and data identify that effect.

The choice of geographic unit should reflect how the exposure is assigned, measured, and used. A school district may fit an education policy, while a watershed may fit environmental contamination. Administrative convenience alone is a weak rationale. Make boundaries stable over time when possible and document changes. If the target is all residents rather than an average place, decide how area populations enter the estimand; equal weighting of areas and population weighting answer different questions.

## What aggregation hides

Suppose two districts have the same average exposure but different exposure distributions. If risk is nonlinear in exposure, their expected outcomes can differ even when average exposure is identical. Mathematically, \(f(E[X\mid G])\) need not equal \(E[f(X)\mid G]\). Differences in age, occupation, income, baseline health, access to care, or diagnostic practices can similarly shape group rates. Aggregate adjustment only controls measured group-level variables; it does not reveal the unobserved joint relationships among individuals.

The classic ecological fallacy occurs when a relation between group summaries is incorrectly attributed to individuals. Its mirror-image error also matters: a weak between-area association does not rule out a strong individual association. Within-area and between-area effects can differ in magnitude or direction, a pattern sometimes called Simpson's paradox. Neither direction can be inferred from aggregate slopes alone.

Ecological data can sometimes identify useful bounds on individual associations from known margins, such as the number exposed and the total number with disease in each group. Usually those bounds are wide. A single point estimate of an individual effect then requires additional data or assumptions. If individual inference is essential, seek linked records, survey microdata, or a multilevel cohort. If such data are unavailable, present the group-level estimand honestly and, where useful, report bounds or sensitivity analyses rather than implying that a model recovers missing cross-tabulations.

## Assemble comparable group-level measures

For every exposure and outcome, specify its numerator, denominator, source, ascertainment, timing, and aggregation rule. A rate can use residents, visits, person-years, births, or another population at risk; these denominators are not interchangeable. Define whether the outcome counts events, unique people, or repeated episodes. Explain how incomplete reporting, suppressed small counts, migration, and population turnover affect the comparison.

Age standardization can make rates more comparable when age distributions differ. Direct standardization applies the same reference age distribution to each area's age-specific rates. It addresses age composition only; it does not adjust smoking, access to care, deprivation, or case ascertainment. State the standard population, age bands, and uncertainty method. In small districts, a standardized rate can be unstable because some age-specific cells are sparse. Display counts and intervals alongside rates so that precision is visible.

Exposure and outcome measurements should represent compatible times. A same-year measure can put outcome events before exposure was recorded, reverse temporal order, or dilute a biologically relevant lag. A yearly mean may conceal brief but intense exposure peaks. Choose lag windows based on mechanism or policy timing, and prespecify the rationale rather than selecting the lag with the most favorable coefficient. For policies, record announcement, implementation, compliance, and likely anticipation separately.

Boundary changes introduce measurement error. A county may split, merge, or change its reporting system; converting data to constant boundaries often requires crosswalking counts or population. Areal interpolation assumes something about how counts are distributed within source regions. Document that assumption and assess whether exposure surfaces are smooth enough for it to be plausible. If boundary changes track economic or political changes, the missingness is not random noise.

## Model counts, rates, and repeated areas

When outcome counts arise over different amounts of person-time or population, count models with an offset often preserve the sampling structure better than ordinary regression on crude rates. For area (i), a Poisson model can be written

\[
Y_i \sim \text{Poisson}(E_i\lambda_i), \qquad \log(E[Y_i])=\log(E_i)+\beta_0+\beta_1X_i+\boldsymbol{\gamma}^{T}Z_i,
\]

where \(E_i\) is the denominator or expected count, \(X_i\) is exposure, and \(Z_i\) contains prespecified group covariates. Then \(\beta_1\) is a log rate ratio per stated exposure increment, conditional on included covariates. It is not automatically a causal effect. If count variability exceeds the Poisson assumption, standard errors may be too small; assess overdispersion and consider quasi-Poisson, negative-binomial, or hierarchical approaches.

```r
# One row per district: events, person_years, pm25, deprivation
fit <- glm(events ~ I(pm25 / 5) + deprivation + offset(log(person_years)),
           family = poisson(), data = district)
exp(cbind(rate_ratio = coef(fit), confint(fit)))
```

The exposure coefficient is the conditional rate ratio for each 5-unit increase in PM2.5 under the specified log-linear model. Before interpreting it, inspect the distribution, exposure-response shape, influential areas, denominator quality, and residual dispersion. A rate ratio can be statistically precise while still reflecting unmeasured area differences. If the relationship is nonlinear, use a prespecified spline or other defensible form and show the range supported by observed data.

For area-period panels, account for common secular trends, seasonality, repeated observations, and area-specific dependence. A model with area and time fixed effects estimates changes within areas over time, but does not automatically control for time-varying confounding. Repeated rows do not create independent information equal to their count. Use an uncertainty method aligned with the level at which exposure is assigned and the dependence structure; when there are few areas, standard cluster-robust asymptotics may be unreliable.

Spatial smoothing and hierarchical models can stabilize small-area estimates by partial pooling. They estimate a smoothed surface under a model; they do not convert sparse observations into exact local truth. Show raw counts or rates next to modeled estimates, report uncertainty, and explain the neighborhood structure or prior that induces smoothing. For dashboards, stability flags can deter overinterpretation of the noisiest areas.

## Worked policy illustration: what the slope says

Suppose a cross-section of 40 districts has a fitted association of 1.8 additional deaths per 100,000 residents for every 5 µg/m³ higher annual pollution, with standard error 0.71. The normal-approximation 95% confidence interval is

\[
1.8 \pm 1.96(0.71) = (0.41,\ 3.19).
\]

In this model, districts with higher mean pollution tend to have higher mortality after the stated group-level adjustment. The interval describes sampling uncertainty conditional on the model; it does not quantify uncertainty from unmeasured confounding, exposure error, boundary choice, or the ecological identification problem.

Adding thousands of residents to each district can improve the precision of each district's rate, but the exposure slope still has only 40 independent area units in this cross-sectional analysis. More individuals do not substitute for more independent groups. A model that weights districts by population also changes the implicit target toward the average resident's district; equal weighting describes the average district. Explain which summary policy-makers need, and compare both only if they answer legitimate distinct questions.

```r
fit <- lm(death_rate ~ pm25 + deprivation + urbanicity, data = district)
coef(summary(fit))["pm25", ]
plot(fitted(fit), resid(fit))
```

Suppose the model slope is 0.36 deaths per 100,000 per 1 µg/m³, with standard error 0.142. Multiplying by five gives 1.8 and 0.71, respectively. The regression diagnostic can identify nonlinearity or an influential district, but it cannot test whether pollution and mortality share an unmeasured cause. A strong policy claim would require a defensible causal design, richer data, or a clear statement that the result is descriptive.

## Strengthen causal interpretation with design

Measured-covariate adjustment is credible only if important common causes are adequately measured and overlap is sufficient. Create a causal diagram at the group level to clarify whether a covariate is a confounder, mediator, or collider. Adjusting indiscriminately for every available variable can introduce bias. Consider how group deprivation, healthcare supply, age composition, policy adoption, and exposure measurement arise over time.

If a policy begins at a known time, a controlled interrupted time series or difference-in-differences comparison may make a stronger counterfactual than a cross-sectional regression. Difference-in-differences requires plausible parallel untreated trends and careful treatment of staggered implementation; interrupted time series needs a credible expected trajectory and attention to concurrent shocks. A policy threshold may support regression discontinuity if potential outcomes vary smoothly around the cutoff and the rule is not manipulated. None of these labels guarantees identification. Their assignment mechanisms and assumptions should be explained in ordinary language. See the library's [non-randomized intervention studies article](non-randomized-intervention-studies.html).

Spatial spillovers are a special concern: an intervention or exposure in one area can affect neighboring outcomes. Define whether the estimand includes direct, spillover, or total regional effects. Conventional no-interference assumptions may fail for infectious disease, air pollution, health-service catchments, or migration. A buffer zone, network exposure mapping, or regional aggregate may better represent the causal structure, but each changes the question.

## Examine stability without manufacturing certainty

Sensitivity analyses should name the uncertainty they address. Try alternative plausible functional forms to assess model shape; this does not remove confounding. Change boundary systems or time aggregation to study scale sensitivity; this does not prove one scale is correct. Use alternative denominators to inspect rate construction; this cannot repair differential case finding. Add confounders only when the causal rationale is defensible. If there is a plausible unmeasured confounder, quantitative bias analysis can state the strength of association it would need with exposure and outcome to change the conclusion.

Assess missing areas and suppressed counts. If small or rural districts are more likely to lack records, complete-case analysis may describe a selected geography. Compare included and excluded districts and describe the reporting process. Imputation should respect spatial and temporal structure; it should not imply more information than the data support. Privacy suppression is a deliberate data mechanism, not ordinary random missingness, and reconstruction from correlated releases may violate privacy expectations.

For multiple comparisons across regions, outcomes, and lags, distinguish prespecified hypotheses from exploratory mapping. Searching many combinations and reporting the most striking association exaggerates evidence. Consider multiplicity control or clearly label exploratory analyses, and seek confirmation in new periods or external data. Maps are useful for describing distribution; visual clusters do not by themselves establish a statistically unusual pattern or a causal pathway.

## Communicate scale and uncertainty to decision-makers

Translate the result into an absolute rate difference or expected count over a meaningful exposure change, and retain the group-level unit in every sentence. Avoid rankings that imply individual residents are personally high risk because their district average is high. A map used for resource allocation should show denominators and uncertainty, especially for small areas. Explain whether conclusions are descriptive, predictive, or causal and identify the assumptions supporting any causal interpretation.

An ecological analysis can be a strong first step: it can identify geographic inequality, assess population-level trends, and help target data collection. It can also be the final design when a group-level policy estimand is the decision target and the comparison is credible. The goal is not to apologize for aggregation; it is to align the conclusion with what was measured and the unit the evidence can support.

## A compact analysis plan for an area-level question

Take a city considering a low-emission zone. The decision concerns a policy applied to neighborhoods; possible outcomes include respiratory admissions per resident, roadside pollution, and displacement of traffic into nearby areas. A useful plan first defines the population of neighborhoods, policy start date, comparison areas, exposure contrast, outcome period, and whether spillover areas count as treated. If the objective is to forecast where admissions may rise, a predictive model could be suitable. If the objective is to claim that the zone caused a decline, the analysis needs a defensible counterfactual, such as a controlled time-series design with comparable cities. A map of lower rates after implementation alone cannot separate the policy from weather, secular trends, economic changes, or concurrent programs.

The denominator deserves particular care. If residents move because of housing prices or traffic, the area population changes after the policy. A rate among current residents may then compare different people over time. The estimand might instead be a place-level effect, including population movement as part of the policy consequence, or a resident-level effect under a stable population. Data often cannot distinguish these questions, so specify the target and discuss migration as a possible mechanism rather than treating it as a technical nuisance.

## Choose weighting and uncertainty to match the target

An unweighted regression gives equal influence to each group and describes the average group association, subject to the model. Weighting by population shifts emphasis toward populous groups but is not automatically correct: the variance of a rate depends on the number of events, baseline heterogeneity, denominator quality, and overdispersion. Inverse-variance weighting can be unstable when variances are estimated noisily. Count likelihoods with offsets, quasi-likelihood, or hierarchical models may better represent the process, but the target remains a policy choice. State what weights were used, why, and how results change without them.

Uncertainty has several layers. A confidence interval from a Poisson model may reflect sampling variability in counts while assuming rates are correctly specified and areas independent conditional on covariates. It does not generally include uncertainty from boundary harmonization, exposure surfaces, standard populations, model selection, or unmeasured confounding. For public communication, avoid presenting a narrow model interval as if it captured all uncertainty. Sensitivity ranges can communicate uncertainty that a single standard error cannot.

## Spatial and temporal structure require a scientific model

Nearby groups may share weather, labor markets, healthcare systems, policies, and exposures. Spatial autocorrelation can make conventional standard errors too optimistic, but inserting a spatial random effect is not a universal cure. Choose the neighborhood graph or distance scale based on the process, show residual diagnostics, and assess alternative plausible structures. A spatial model can stabilize estimates while smoothing real local extremes; show raw and smoothed results together when local decisions depend on both.

The modifiable areal unit problem refers to changes in association when data are aggregated into different zone shapes or sizes. It is partly a substantive scale problem: disease transmission may operate across households while health services are allocated by district. Analyze alternative meaningful scales as a sensitivity exercise, report the boundary versions, and avoid trying many partitions until one produces a preferred result. The same discipline applies to time windows and lag choices.

## Avoid ecological overreach in routine communication

Write the unit into the results sentence: “Across districts, higher average exposure was associated with higher age-standardized rates.” This makes it harder for a reader to unconsciously substitute an individual-level claim. When the policy target is the population, translate estimates into expected community counts while showing the time horizon and uncertainty. When the target is a subgroup of residents, explain what individual data or assumptions are needed to reach that conclusion. Separate a map's descriptive role from any causal model layered on it.

## References and further reading

- Wakefield J. Ecologic studies revisited. *Annual Review of Public Health*. 2008;29:75–90. [https://doi.org/10.1146/annurev.publhealth.29.020907.090821](https://doi.org/10.1146/annurev.publhealth.29.020907.090821)
- Greenland S, Robins J. Invited commentary: ecologic studies—biases, misconceptions, and counterexamples. *American Journal of Epidemiology*. 1994;139(8):747–760. [https://doi.org/10.1093/oxfordjournals.aje.a117069](https://doi.org/10.1093/oxfordjournals.aje.a117069)
- Robinson WS. Ecological correlations and the behavior of individuals. *American Sociological Review*. 1950;15(3):351–357. [https://doi.org/10.2307/2087176](https://doi.org/10.2307/2087176)
- Morgenstern H. Ecologic studies in epidemiology: concepts, principles, and methods. *Annual Review of Public Health*. 1995;16:61–81. [https://doi.org/10.1146/annurev.pu.16.050195.000425](https://doi.org/10.1146/annurev.pu.16.050195.000425)
- The library's [cross-sectional studies article](cross-sectional-studies.html) introduces population snapshots; [bias and confounding](bias-and-confounding.html) covers causal adjustment.
