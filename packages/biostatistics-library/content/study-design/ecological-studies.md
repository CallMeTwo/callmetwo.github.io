---
title: Ecological studies
summary: Population-level designs for studying group exposures and outcomes, with attention to aggregation, ecological bias, and multilevel alternatives.
---

## Overview and key ideas

An **ecological study** uses groups rather than people as the units of analysis. Groups may be countries, districts, hospitals, schools, or calendar periods. Researchers compare group-level exposure summaries (such as average air pollution or vaccination coverage) with group-level outcomes (such as mortality rates). These designs are useful when the exposure is inherently contextual, when policy is assigned to groups, or when individual data are unavailable.

The group association is a real population-level quantity, but it does not automatically describe an individual-level association. A correlation between district deprivation and district mortality does not establish that the more deprived individuals in each district are the people who died. That leap is the **ecological fallacy**. The reverse error also occurs: an individual-level association need not predict the effect of a group policy, because context and composition can act differently.

Aggregation loses information about within-group exposure and outcome variation, the joint distribution of individual exposure and confounders, and sometimes the timing or distribution of exposure. Ecological bias is therefore not fixed by simply adding more groups. It can arise even with perfectly measured group averages.

## When to use it

Use an ecological design when the question itself concerns places, institutions, or policies—for example, whether districts with higher heat exposure have higher heat-related mortality—or when the exposure is only defined at group level. Repeated group observations can assess changes around policy adoption; geographic comparisons can describe spatial patterns and generate hypotheses. Ecological comparisons are often efficient for initial surveillance and hypothesis generation.

If the intended conclusion concerns individuals, prefer linked individual-level data or a multilevel design. A contextual exposure can still be analyzed at group level alongside individual outcomes, but the model should retain individual records and represent the clustering and contextual variables explicitly.

## Assumptions and limitations

- **Correct unit and target:** State whether the estimand is a group-level association, a contextual effect, or an individual causal effect. These are different questions.
- **Confounding:** Group-level socioeconomic, demographic, health-system, and environmental factors may confound comparisons. Group means alone cannot generally recover unobserved within-group confounding.
- **Aggregation and ecological bias:** A group exposure-outcome relationship can differ in magnitude or direction from the individual relationship. Aggregate data usually cannot identify the individual cross-classification needed to resolve this.
- **Measurement and denominator:** Rates require appropriate population denominators and comparable case ascertainment. Small-area rates may be unstable; age-standardization can improve comparability but does not remove all confounding.
- **Spatial and temporal dependence:** Neighboring areas and adjacent time periods are often correlated. Ordinary regression standard errors can be too small if dependence is ignored; spatial structure, clustering, and serial correlation may need modeling.
- **Boundary and scale choices:** Results can change with geographic units or time windows (the modifiable areal unit problem). Report how boundaries and aggregation periods were selected.
- **Causal interpretation:** Ecological designs do not randomize exposure. A group-level association alone rarely supports causal conclusions without a credible design and explicit assumptions.

## Worked example

Suppose 20 districts have average annual fine-particle pollution and age-standardized cardiovascular mortality rates. A regression estimates 1.8 additional deaths per 100,000 per year for each 5 µg/m³ higher district-average pollution (95% CI 0.4 to 3.2).

This is an estimated **between-district association**. It does not mean that an individual exposed to 5 µg/m³ more pollution has 1.8 additional deaths per 100,000. Districts also differ in income, smoking, access to care, migration, and pollution measurement. Age-standardization addresses age composition only; it does not control those other differences. An individual-level cohort with residential exposure estimates, confounders, and a multilevel model could address a different, person-level question while accounting for district clustering. Even that design would require causal assumptions and careful exposure measurement.

## Interpretation and common pitfalls

- Do not translate a group-level slope into an individual risk ratio or individual treatment effect.
- Do not treat age-standardization or a large number of areas as protection against ecological bias.
- Separate **composition** (who lives in an area) from **context** (features of the area that affect residents). Aggregate summaries often combine the two.
- For policy evaluations, define the intervention at the level where it is assigned and account for time trends, concurrent policies, and spillovers.
- When individual records are available, multilevel regression can separate within- and between-group associations by including group means and individual deviations. It does not magically recover information that was never measured, and it still depends on model specification and confounder control.
- Present maps and correlations as descriptive evidence unless the design supports a causal claim.

## Define the estimand before choosing the model

The word *ecological* identifies the level at which variables are observed; it does not uniquely define the estimand. A useful protocol states (1) the population of groups, (2) the exposure contrast, (3) the outcome scale, (4) the period, and (5) whether the target is descriptive, associational, predictive, or causal. For example, “the adjusted difference in district age-standardized cardiovascular mortality associated with a 5 µg/m³ higher annual mean PM2.5 among districts in the study region during 2018–2024” is a group-level association. It is not the effect of assigning one individual to a higher exposure.

Three distinct questions are often conflated. A **contextual effect** asks whether place or policy changes outcomes beyond who lives there. A **compositional association** asks whether places with different mixtures of residents have different rates. An **individual-level effect** compares people under individual exposure strategies. A contextual policy can affect residents while an area mean also acts as a proxy for residents' composition. If both individual exposure and group context matter, retain individual observations and model both levels where possible.

A compact causal diagram helps expose the aggregation problem. Let `G` denote group, `X_ij` individual exposure, `Y_ij` individual outcome, and `U_ij` individual confounders. The group mean `Xbar_g` does not reveal the within-group joint distribution of `X_ij`, `U_ij`, and `Y_ij`. Two groups can have identical exposure and outcome means but very different exposure-outcome relationships. More groups improve precision for a group-level regression, but they do not identify the missing joint distribution. Ecological bias is an identification problem, not simply small-sample noise.

### A decomposition for individual data

When person-level records exist, separate within- and between-group exposure contrasts. A simple model is `Y_ij = β0 + βW (X_ij − Xbar_g) + βB Xbar_g + u_g + ε_ij`. Here `βW` describes the association comparing individuals within the same group at different exposure, while `βB` describes between-group contrasts in group means. The contextual contrast is sometimes expressed as `βB − βW`, subject to the chosen model and causal interpretation. A random intercept `u_g` accounts for residual group clustering, but it does not automatically control group-level confounding. Include measured group covariates and explain whether the target is within-group, between-group, or contextual.

## Analysis of aggregate rates

For count outcomes, model counts with an offset for population at risk rather than treating noisy rates as equally precise. If `D_g` is the number of events and `P_g` is person-time, a Poisson model can be written as `log E(D_g) = log(P_g) + β0 + β1 X_g + γ' Z_g`. Then `exp(β1)` is the incidence rate ratio per unit of group exposure, conditional on modeled covariates. Overdispersion, excess zeros, and unmodeled heterogeneity can make Poisson standard errors too small; assess dispersion and consider quasi-Poisson, negative binomial, or hierarchical count models. Do not select a complicated distribution merely because it fits a particular diagnostic; connect it to the data-generating process.

Illustrative R code for an offset model:

```r
# One row per district; events, person_years, pm25, deprivation are columns
fit <- glm(events ~ I(pm25 / 5) + deprivation + offset(log(person_years)),
           family = poisson(), data = district)
exp(cbind(rate_ratio = coef(fit), confint(fit)))
```

This is executable when `district` contains the stated variables. The coefficient for `I(pm25 / 5)` is the conditional rate ratio per 5-unit exposure contrast. If districts are repeatedly observed, add a justified time structure and account for within-district dependence; an ordinary independent-row model is not enough. For small area counts, empirical Bayes or fully Bayesian smoothing can stabilize estimates, but smoothed maps answer a prediction/smoothing question and can conceal local uncertainty. Show uncertainty and distinguish observed rates from model-based estimates.

Age-standardization is useful when age distributions differ and age-specific rates are available. Direct standardization applies a common reference age distribution to each area's rates; it does not adjust smoking, income, access, or ascertainment. Standardized rates can also be statistically unstable in small populations. Report the standard population, age groups, denominator, case definition, and uncertainty. When outcomes arise from repeated populations, explain whether the denominator is residents, person-time, visits, or another exposure base.

## Dependence, scale, and robustness

Spatial autocorrelation means neighboring units may share omitted causes or exposures. Conventional regression can retain unbiased coefficients under some conditions while producing invalid standard errors; spatial dependence in the outcome may also signal omitted structure. Mapping residuals, estimating Moran's I, or examining semivariograms can inform diagnostics, but a positive statistic does not identify the right causal correction. Options include cluster-robust uncertainty at the assignment unit, spatial error or conditional autoregressive models, and explicit spatially varying effects. State the neighborhood definition and conduct sensitivity analyses to alternative adjacency or distance structures. With few groups, asymptotic robust standard errors can be unreliable.

The **modifiable areal unit problem** has two related components: changing the size/shape of zones and changing how boundaries partition the same space. Estimates may vary when counties are replaced by districts or when aggregation uses different time windows. This is not merely a nuisance; it reflects the scale at which a process and decision operate. Prespecify a substantively meaningful scale, document boundary versions, and assess plausible alternatives. Avoid choosing the map that produces the most compelling association.

Temporal aggregation can hide exposure timing. A yearly mean may miss short high-intensity events; a same-year exposure and outcome can also reverse temporal order. Specify lag windows based on biology or policy implementation and avoid selecting lags solely by fit. Include seasonality and secular trends for repeated area-time data. For policy changes, distinguish a cross-sectional ecological comparison from a controlled interrupted time-series or difference-in-differences design; the latter brings additional assumptions, discussed in the library's [non-randomized intervention studies article](non-randomized-intervention-studies.html).

### Numerical illustration: uncertainty is not ecological identification

Suppose a group-level model gives `β = 1.8` extra deaths per 100,000 per 5 µg/m³ higher pollution, with standard error 0.71. A normal approximation gives `1.8 ± 1.96(0.71) = 0.41 to 3.19`, close to a reported 95% interval of 0.4 to 3.2. This interval describes sampling uncertainty for the group-level slope under the model. It does not account for unmeasured group confounding, exposure error, boundary choice, or ecological identification. Narrowing the interval by adding more districts addresses only some uncertainty sources.

## Reporting checklist for an ecological analysis

Report the unit of analysis and why it matches the question; group inclusion and exclusions; boundary and period definitions; exposure and outcome aggregation; numerator, denominator, and standardization; missingness; covariates and their causal rationale; functional form; dependence structure; estimand and scale; uncertainty; and sensitivity analyses. Display data where useful, but suppress or aggregate sensitive small counts. Label causal language in the abstract and conclusions consistently with the design. If the target is an individual association, state plainly that aggregate data cannot identify it without additional information and assumptions.


## Sensitivity analyses that address different uncertainties

An ecological analysis benefits from separating sensitivity checks by the uncertainty they target. Refit with alternative plausible functional forms (linear, spline, or exposure categories) to assess model shape; this does not address confounding. Vary boundary definitions and aggregation periods to study scale sensitivity; this does not establish which scale is causal. Use alternative denominators or standard populations to inspect rate construction; this does not repair differential case ascertainment. Add measured group covariates based on a causal rationale; do not include every available variable indiscriminately, since conditioning on mediators or colliders can distort associations.

For unmeasured confounding, specify a plausible confounder, its association with exposure and outcome, and estimate the resulting bias under stated assumptions. Quantitative bias analysis is more interpretable than saying “residual confounding may remain.” If a contextual policy is the exposure, compare treated and untreated areas over time and look for pre-intervention outcome trajectories, policy anticipation, and spillovers. Instrumental-variable or natural-experiment arguments may strengthen inference only if the assignment mechanism and exclusion assumptions are credible. Ecological data alone do not turn an exposure into a natural experiment.

If group counts vary greatly, precision also varies. Weighted least squares of observed rates using population size as a weight can be a useful approximation in some settings, but count likelihoods with offsets usually match the sampling process better. Population size alone is not the correct precision weight when risk heterogeneity or overdispersion is substantial. Hierarchical models can partially pool estimates and propagate uncertainty from sparse areas; report both raw and modeled estimates, and explain the intended use of smoothing. For public dashboards, uncertainty intervals and stability flags can prevent the rank-ordering of noisy small-area rates from being mistaken for real differences.

Consider missingness at the area level. If small or rural districts lack outcome reporting, complete-case analyses may target a selected set of areas. Describe missingness patterns and compare included and excluded districts. Imputation of aggregate variables needs a model that respects spatial and temporal structure and should not create false precision. Suppression due to privacy is not ordinary random missingness; use methods appropriate to the reporting process and avoid reconstructing protected counts from correlated releases.


## Ecological inference and partial identification

Sometimes the research question truly concerns individual behavior but only group margins are available. The missing individual cross-tabulation cannot generally be recovered from group averages without assumptions. This is the ecological inference problem: aggregate exposure prevalence and outcome prevalence do not uniquely determine individual risks. For a binary exposure and outcome, multiple tables can have the same margins but very different individual associations, including associations in opposite directions. A regression across groups estimates how group margins co-vary; it does not solve this underdetermination.

If the individual target is essential, present bounds or sensitivity analyses rather than a single ecological regression coefficient. Bounds use known margins to identify a range of possible individual associations. Stronger conclusions require auxiliary data, known constraints, or explicit parametric assumptions. Such models should report how results change under plausible within-area correlations and should not label model-imposed assumptions as empirical information. Linked survey, census, registry, or cohort data can improve identification, but linkage introduces coverage, privacy, and selection concerns.

Aggregation also changes the scale of variation. Suppose risk is nonlinear in exposure: the outcome at a group's mean exposure, `f(E[X|G])`, need not equal the mean of individual risks, `E[f(X)|G]`. Thus, a regression of group outcome on group mean exposure can differ from an individual relationship even without classic confounding. Categorizing group averages can add further information loss. If sufficient distributional summaries are available, consider exposure quantiles or within-group variance, but these do not replace individual joint data.

Ecological studies can nevertheless be highly policy-relevant. A government may decide whether to implement a district-level air-quality policy, so the policy's group-level total effect is the target. In that case the relevant estimand compares area-level outcomes under alternative policy regimes, including spillovers and population movement as part of the intervention definition. An individual cohort association is not automatically a substitute for this policy effect. Clarify whether the area is an assignment unit, an exposure context, or merely an aggregation convenience.


## Design, sampling, and generalization

An ecological dataset may be a census of defined places for a period or a sample of places selected into a study. In a census of all districts, uncertainty does not disappear: the target may be a superpopulation of places, future years, or hypothetical policy assignments, and model uncertainty remains. State what population the interval generalizes to. If the set of areas was selected based on data availability, generalization to all areas additionally depends on selection assumptions.

Area boundaries can change during follow-up through administrative mergers, redistricting, or revised census geography. Harmonizing to stable boundaries can require areal interpolation, which allocates counts or population across new zones and adds measurement uncertainty. Document the crosswalk and assess whether exposure and outcome surfaces are sufficiently smooth for the interpolation assumptions. Changes in denominators due to migration can create apparent rate trends even when individual risks are unchanged; consider population turnover and avoid interpreting area-level change as within-person change.

The ecological design is often the right first step for surveillance because routinely collected area indicators are timely and policy-relevant. A strong surveillance report still avoids causal claims: it defines the case and denominator, compares like periods, displays uncertainty, and signals when observed differences may reflect reporting or access. Subsequent individual-level or quasi-experimental studies can then test mechanisms. This sequence preserves the descriptive value of ecological data without asking them to identify an individual effect they cannot recover.


## Communicating the result to a policy audience

Translate model outputs into the unit that matches the area-level decision: predicted counts per population, absolute rate differences, and uncertainty across a realistic exposure contrast. Avoid rankings that imply a district's residents are individually high-risk based only on its average. A map can guide resource allocation, but it should include uncertainty and population denominators; otherwise small areas with unstable rates may appear to be the most urgent. Explain which conclusions are descriptive and which depend on causal assumptions. This distinction lets policy teams use surveillance findings while planning stronger evaluation of interventions.


## References and further reading

- Wakefield J. [Ecologic studies revisited](https://doi.org/10.1146/annurev.publhealth.29.020907.090821). *Annual Review of Public Health*. 2008;29:75–90.
- Greenland S, Robins J. [Invited commentary: ecologic studies—biases, misconceptions, and counterexamples](https://doi.org/10.1093/oxfordjournals.aje.a117069). *American Journal of Epidemiology*. 1994;139(8):747–760.
- Robinson WS. [Ecological correlations and the behavior of individuals](https://doi.org/10.2307/2087176). *American Sociological Review*. 1950;15(3):351–357.
- Morgenstern H. Ecologic studies in epidemiology: concepts, principles, and methods. *Annual Review of Public Health*. 1995;16:61–81. [https://doi.org/10.1146/annurev.pu.16.050195.000425](https://doi.org/10.1146/annurev.pu.16.050195.000425)
- The library's [cross-sectional studies article](cross-sectional-studies.html) introduces group and individual snapshots; [bias and confounding](bias-and-confounding.html) reviews confounding in observational comparisons.
