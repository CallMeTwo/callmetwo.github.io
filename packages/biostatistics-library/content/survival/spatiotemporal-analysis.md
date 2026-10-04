---
title: Spatiotemporal analysis
summary: Study how health outcomes vary across both place and time, accounting for spatial dependence, changing populations and scale.
---

## Overview and key ideas

**Spatiotemporal analysis** studies a health outcome indexed by both location and time: for example, weekly dengue cases across districts, or annual asthma admissions around changing pollution sources. Place may be represented as points (individual residences or facility locations), continuous surfaces (modeled pollution), or areas such as districts. The choice changes what a model can estimate.

Data near one another in space or time are often dependent. Nearby districts can share climate, health services, and population movement; neighboring weeks share ongoing transmission and reporting delays. Spatial and temporal dependence can make ordinary independent-observation standard errors unreliable and can expose unmodeled structure. Models may use spatial random effects, temporal terms, and space-time interactions, but the model should follow the scientific question and data resolution.

Spatiotemporal analysis is related to time-series analysis, which emphasizes ordered temporal measurements, and to ecological studies, which analyze group-level data. Aggregated district associations do not automatically describe individual risks: this is the ecological fallacy.

## When to use it

- Map and compare disease burden while accounting for different population sizes.
- Estimate geographic variation in exposure or health outcome over time.
- Identify where and when a cluster may have emerged, as a signal for investigation.
- Assess whether trends differ across areas or change after a place-specific intervention.

## Assumptions and limitations

- **The geographic unit is part of the question.** District boundaries, grid size, and time aggregation affect summary rates and apparent clusters. The modifiable areal unit problem (MAUP) refers to findings that change when areal units are regrouped or redrawn. Repeat analyses using defensible alternative scales where feasible.
- **Spatial dependence must be considered.** A map of high values can arise from chance, population density, or spatially patterned confounding. Spatial autocorrelation means nearby observations are more similar than expected under independence; it can concern the outcome, covariates, or residuals.
- **Population denominators and movement matter.** Counts are not risks when populations differ. Residence may not represent exposure location, and commuting, migration, referral patterns and care access can cross boundaries.
- **Exposure and outcome surfaces are uncertain.** Geocoding error, interpolation, changing boundaries, under-reporting, and temporal mismatch can blur or bias apparent associations.
- **Ecological inference has limits.** If only area averages are available, one cannot infer that individuals exposed to a higher area average have the observed individual risk. Individual-level covariates or multilevel designs may reduce, but not automatically eliminate, ecological bias.
- **Hotspot discovery is exploratory.** Repeatedly searching across many locations and time windows creates false alarms. Account for multiplicity or validate signals in independent data and treat maps as hypotheses, not proof of causal sources.
- **Small-area estimates are unstable.** Shrinkage or partial pooling can improve precision but pulls estimates toward a model-based mean. Display uncertainty alongside mapped estimates.

## Worked example: weekly dengue by district

A health department records dengue cases weekly in 30 districts for three years. District populations vary greatly, and neighboring districts share weather and travel links. A first step is to plot weekly counts and rates (with denominators), map missingness and reporting delays, and examine whether crude patterns track population size or surveillance intensity.

One possible count model is a Poisson or negative-binomial regression with log population as an offset, calendar-time terms for seasonality and trend, measured covariates such as rainfall, and spatial and temporal random effects. A spatial effect can partially pool noisy district rates toward values informed by connected districts; a temporal effect can model adjacent-week similarity. A space-time interaction allows district-specific departures from the overall temporal pattern. These terms do not magically remove confounding: they encode assumptions about how effects vary and borrow information across units.

Suppose the estimated rate ratio associated with higher rainfall is 1.18 (95% interval 1.05–1.32). This is an adjusted area-time association under the chosen model, not proof that rainfall increased each resident's individual risk by 18%. Investigators should assess model fit, residual spatial and temporal dependence, alternative lag choices, and sensitivity to district boundaries or reporting changes.

## Interpretation and common pitfalls

- Distinguish a **count**, **rate**, **risk**, and **standardized ratio**; always state the denominator and population at risk.
- Do not read a smoothed map as observed truth. Show raw data or sample size and uncertainty as well as modeled estimates.
- Spatially correlated predictors can make separate effects hard to identify. A smooth spatial adjustment may absorb some exposure variation; coefficients can become unstable.
- Temporal aggregation can conceal short outbreaks, while fine intervals produce sparse noisy counts. State the spatial and temporal resolution and justify it.
- A cluster is a pattern conditional on the analysis method and search window. Detection does not identify a cause and is not equivalent to individual-level prediction.
- Protect privacy: precise addresses and rare outcomes can identify individuals. Aggregate or perturb locations when appropriate and consider disclosure risk before mapping.

## References and further reading

- Wakefield J. Ecologic studies revisited. *Annu Rev Public Health*. 2008;29:75–90. [doi:10.1146/annurev.publhealth.29.020907.090821](https://doi.org/10.1146/annurev.publhealth.29.020907.090821).
- Elliott P, Wartenberg D. Spatial epidemiology: current approaches and future challenges. *Environ Health Perspect*. 2004;112:998–1006. [doi:10.1289/ehp.6735](https://doi.org/10.1289/ehp.6735).
- Auchincloss AH, Gebreab SY, Mair C, Diez Roux AV. A review of spatial methods in epidemiology, 2000–2010. *Annu Rev Public Health*. 2012;33:107–122. [doi:10.1146/annurev-publhealth-031811-124655](https://doi.org/10.1146/annurev-publhealth-031811-124655).

*For a discussion of correlation and association, see [Scatter plots and relationships](../describing-data/scatter-plots-and-relationships.html).*
