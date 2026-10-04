---
title: Spatiotemporal analysis
summary: Study how health outcomes vary across both place and time, accounting for spatial dependence, changing populations and scale.
---

## Overview and key ideas

**Spatiotemporal analysis** studies health outcomes indexed by both location and time: weekly dengue cases across districts, annual asthma admissions near changing pollution sources, or individual infections linked to travel and weather. Location may be represented as a point, a continuous exposure surface, or an area such as a district. Time may be a date, interval, or event time. The resolution and representation determine which comparisons are available and which assumptions are plausible.

Neighboring observations are often dependent. Nearby districts share climate, services, social conditions, and movement; adjacent weeks share ongoing transmission and reporting delays. Spatial dependence can arise from the outcome, omitted covariates, shared measurement, or genuine spillover. A model that accounts for dependence can improve uncertainty and small-area estimation, but spatial smoothing does not by itself remove confounding or identify a causal effect.

A rigorous analysis identifies its **estimand** first: an area-specific incidence rate, an exposure-associated rate ratio, a temporal change in a map, an intervention effect, an individual risk surface, or a cluster signal for follow-up. These are not interchangeable. In particular, area-level associations do not establish individual-level effects; this ecological limitation is discussed in [Ecological studies](../study-design/ecological-studies.html).

Three common data structures are: (1) geocoded individuals with individual covariates; (2) cases and denominators aggregated to areas by time; and (3) health outcomes linked to modeled environmental surfaces. Each has distinct error and privacy concerns. Aggregation may hide within-area variation; point data can reveal fine structure but create confidentiality risks; modeled exposures add uncertainty from interpolation and monitoring coverage.

## When to use it

- Compare disease burden across places with different population sizes.
- Describe whether geographic patterns persist, emerge, or move over time.
- Estimate area-level associations with environmental, social, or service exposures.
- Identify possible clusters as a public-health signal requiring investigation.
- Evaluate interventions implemented in selected locations, subject to a credible comparison strategy.
- Produce local estimates for planning when some areas have few events and partial pooling is defensible.

## Estimands, dependence, and model choices

### Counts, rates, and small-area estimation

For area `i` and time `t`, a count model can be written

`Y_it ~ Poisson(E_it × RR_it)`,

where `E_it` is expected events or person-time and `RR_it` is a relative rate. Equivalently, `log(E_it)` enters as an offset. The offset is essential when populations vary. A standardized expected count may incorporate age and sex structure; it should be distinguished from a directly standardized rate. Poisson variance equals its mean, a restrictive assumption. Negative-binomial models or random effects can account for extra variability, but overdispersion should prompt substantive investigation as well as a change of family.

For sparse areas, directly calculated rates can be unstable. Hierarchical models partially pool local rates toward a global or spatially structured mean. This reduces variance at the cost of introducing model dependence and shrinkage. A smoothed estimate is a posterior or fitted expectation under assumptions; it is not the exact “true rate.” Show raw counts and denominators next to smoothed rates and uncertainty.

### Spatial structure

For areal data, a neighborhood graph defines which areas are adjacent. Conditional autoregressive (CAR) and intrinsic CAR structures encourage neighboring area effects to be similar. This is a substantive prior or penalty: the geographic adjacency graph determines what “nearby” means. An island, an artificial boundary, or an area connected by travel but not by borders may require a different graph. Distance-based, network-based, and shared-border structures answer different questions.

Point-referenced data often use a Gaussian process, where correlation decays with distance. The assumed covariance function and range influence estimates. A stationary isotropic process assumes that dependence depends only on distance and is the same in all directions; barriers, coastlines, transport corridors, and anisotropy may violate this. Computation can be demanding for large datasets, motivating sparse approximations or basis representations.

Spatial autocorrelation statistics such as Moran's I are descriptive diagnostics for global pattern, while local statistics flag local departures. Their p-values depend on the chosen weights matrix and search procedure. A significant global statistic does not identify a mechanism or a specific hotspot.

### Temporal and space-time structure

Time can be represented with categorical periods, smooth splines, seasonal Fourier terms, autoregressive latent effects, or explicit transmission dynamics. A space-time model may include spatial effect `u_i`, temporal effect `v_t`, and interaction `δ_it`:

`log(RR_it) = α + x_it'β + u_i + v_t + δ_it`.

An interaction allows area-specific departures from the common temporal pattern. It also consumes information and can be weakly identified when the data are sparse. Smoothness assumptions over time and space should reflect the resolution and science, and sensitivity analyses should vary plausible structures.

### Causal questions and geographic interventions

A causal effect requires a defined treatment, outcome, time zero, comparison, and target population. Spatial proximity may induce interference: intervention in one area changes exposure or outcomes in another through travel, contagion, or resource displacement. Standard no-interference assumptions then fail. Define whether the target is a direct effect, spillover effect, or total effect under an allocation policy. For place-based interventions, compare pre-trends, account for selective placement, and consider alternative comparison areas or synthetic controls. Spatial random effects can absorb residual pattern, but they do not guarantee exchangeability or correct confounding.

## Assumptions and limitations

- **Geographic unit and modifiable areal unit problem (MAUP):** results can change when boundaries or aggregation scales change. Repeat analyses on defensible units where possible and avoid treating administrative boundaries as natural disease processes.
- **Population at risk:** counts are not risks when populations differ. Population offsets may still be biased if denominators poorly represent exposure, migration, or person-time.
- **Measurement and geocoding:** location error, address changes, residence-versus-exposure mismatch, boundary revisions, and interpolation uncertainty can blur associations.
- **Spatial dependence specification:** adjacency, distance, or network matrices encode assumptions. Misspecified structure can produce misleading smooth maps or uncertainties.
- **Ecological inference:** area averages do not identify individual effects. Within-area exposure distributions and individual confounders may be unavailable.
- **Temporal alignment:** exposures may act with lags; annual aggregation can hide outbreaks, while daily data may be sparse and noisy. Prespecify lag windows and test plausible alternatives.
- **Multiple search:** scanning many locations, scales, time windows, and outcomes inflates false discoveries. Treat cluster detection as exploratory, adjust or validate, and report the search space.
- **Residual confounding and spatial confounding:** spatially smooth exposure and spatial random effects may be difficult to separate. Estimates may change sharply with prior or basis choices.
- **Privacy:** small counts, precise addresses, rare outcomes, and maps with linked covariates can re-identify individuals. Aggregate, mask, or otherwise protect sensitive locations.

## Worked example: district-level dengue rates

A health department observes weekly dengue cases in 30 districts for three years. District populations differ tenfold, reporting can be delayed, and neighboring districts share weather and travel. The scientific question is whether rainfall is associated with dengue incidence, not whether the map can simply identify the highest count.

Suppose district A has 42 cases among 60,000 residents and district B has 70 cases among 200,000. Crude annualized rates per 100,000 are `42/60,000 × 100,000 = 70` for A and `70/200,000 × 100,000 = 35` for B. The larger count in B does not mean its rate is higher. If age structure differs, compare age-standardized rates or model age-specific expected counts.

A hierarchical model might include rainfall lagged by two weeks, seasonal terms, a log-population offset, and spatial and temporal random effects. Estimate the rainfall association as a rate ratio. If `exp(β_rain)=1.18` with 95% interval 1.05–1.32 per prespecified rainfall increment, this means an 18% higher conditional area-time rate under the model, with uncertainty. It does not imply each individual exposed to rain has an 18% higher risk. Travel, vector control, reporting, and socioeconomic differences may confound the association.

Illustrative R code using `sf`, `spdep`, and `MASS` begins with exploratory diagnostics and an unstructured negative-binomial model:

```r
library(sf)
library(spdep)
library(MASS)

# districts: sf polygons with cases, population, rainfall_lag2, week, district
nb <- poly2nb(districts, queen = TRUE)
listw <- nb2listw(nb, style = "W", zero.policy = TRUE)

# A descriptive global residual diagnostic after a baseline model
base <- glm.nb(cases ~ rainfall_lag2 + factor(week_of_year) +
                 offset(log(population)), data = districts)
moran.test(residuals(base, type = "pearson"), listw,
           zero.policy = TRUE)
```

The code illustrates a diagnostic, not a final spatiotemporal model. Moran's I on model residuals is sensitive to the weights matrix and does not itself yield a corrected causal estimate. A full model could use Bayesian CAR/AR structures (for example, `CARBayes` or `INLA`) or frequentist spatial generalized mixed models. Validate forecasts out of time and, when transportability matters, out of area. If districts were redrawn, align historical cases and denominators to a stable geography or explicitly model boundary changes.

## Interpretation and common pitfalls

- State whether estimates are counts, crude rates, standardized rates, relative rates, or individual risks; include denominators.
- Display uncertainty and sample size. A smooth color gradient without count context overstates certainty in sparse areas.
- Explain how the neighborhood graph, distance metric, temporal trend, and interaction were selected.
- Do not call a high-rate area a cause or a hotspot without considering random variation, ascertainment, and the search procedure.
- A spatial random effect is not a universal confounding adjustment. Report the covariates, causal structure, and sensitivity to spatial specification.
- Separate exploratory signal detection from confirmatory analysis. Confirm signals in independent data or through field investigation.
- For causal effects, articulate assumptions about treatment assignment, common trends, spillovers, and changing composition.
- Report map projection, boundaries, time aggregation, geocoding quality, missing data, privacy safeguards, software, and uncertainty intervals.

## Data representation and advanced design choices

### Point, areal, and raster data

For **point-referenced** measurements, coordinates are observed locations and the model represents spatial covariance continuously. This suits air-monitoring stations or geocoded cases, but sampled locations may be preferential: facilities are more likely in populated or accessible places. Predictions away from observed points then depend on both the covariance model and the sampling design. For **areal** data, outcomes are aggregated to polygons and spatial structure is often represented by adjacency. For **raster** data, exposures or outcomes live on a grid; grid resolution can impose artificial precision and neighboring pixels are not necessarily independent.

Choose representation based on how the process is generated and how the decision will be made. A district map may be operationally useful even if transmission follows a travel network. A pollution surface can be linked to residence, workplace, or time-activity locations; these are distinct exposure assignments. Do not treat a modeled exposure surface as error-free simply because it contains a value at every address.

### Spatial confounding and identifiability

Spatial confounding occurs when a spatially patterned exposure overlaps with unmeasured spatial structure. Adding a smooth random effect can reduce residual dependence but may also absorb exposure variation, widening intervals or shifting coefficients. Constraining the random effect to be orthogonal to covariates can stabilize estimates under some goals, but changes the model and does not solve omitted confounding. Report whether the target is predictive smoothing or an exposure effect and show sensitivity to reasonable spatial structures.

### Lags, transmission, and mobility

Exposure and outcomes can have biologically plausible delays. A same-week weather association may be implausible if incubation and reporting take several weeks. Define lags using scientific knowledge and account for correlated lagged predictors. Mobility links can cause neighboring but nonadjacent areas to exchange infections or patients. If available, commuting, travel, referral, or contact networks may represent dependence better than shared borders. Network structure also complicates spillover assumptions for causal analyses.

### Cluster detection and multiplicity

A cluster scan searches candidate windows and compares observed counts with expected counts under a null model. The p-value should account for selection of the most extreme window, and the null should incorporate population denominators and relevant temporal baseline. Repeating scans across outcomes, window sizes, and start dates creates additional multiplicity. Report scan parameters and use held-out periods or independent confirmation. A statistically unusual cluster is a lead for investigation, not a causal attribution.

### Model checking and validation

Posterior predictive checks or residual maps can reveal lack of fit, but residual diagnostics have limited power when counts are sparse. Evaluate calibration of predicted counts and rates, residual temporal and spatial structure, sensitivity to boundary definitions, and predictive performance in held-out times or areas. For an intervention effect, predictive validation alone does not establish causal identification; the counterfactual design assumptions remain central. Sensitivity analyses should vary priors, neighborhood graphs, temporal smoothness, lag windows, and denominator choices that could reasonably alter conclusions.

## Presenting maps responsibly

Maps can make small differences appear important because color scales emphasize spatial contrast. Use a legend with units, disclose whether the scale is fixed across panels, and show uncertainty or counts. A map of posterior means can hide wide intervals in sparsely populated locations. Consider mapping probability that a rate exceeds a decision threshold alongside the estimated rate, while explaining that this probability is conditional on the model and prior. Avoid ranking areas on tiny differences when uncertainty overlaps substantially.

Spatial scale also affects confidentiality. Suppressing a small count does not always prevent reconstruction when neighboring totals or demographic margins are available. A sequence of maps across time can reveal a rare case's movement or residence. Follow institutional disclosure rules, aggregate rare outcomes, and assess the combined disclosure risk of geography and covariates. Data release and visualization are part of the analysis plan, not a final cosmetic step.

For public communication, distinguish “area with an elevated observed rate,” “area with a model-smoothed estimate,” and “area where an exposure is associated with an outcome.” The first is descriptive, the second borrows information under a model, and the third is an association estimate. None alone establishes an environmental source or an individual's exposure. Explain what further investigation the signal justifies and what evidence would be needed for a causal conclusion.

## Exposure assessment and measurement error

Environmental exposure assignment can use nearest monitor, interpolation, satellite retrieval, land-use regression, or personal sensors. Each estimates a different quantity and carries different spatial and temporal error. Nearest-monitor assignment may misclassify people when monitor density is low; interpolation smooths extremes and can understate uncertainty; satellite measurements may represent a column or surface proxy rather than personal dose. Record the source, resolution, validation, and uncertainty of each exposure surface.

Classical nondifferential measurement error may attenuate a simple association, but spatially structured and differential errors can bias in either direction. When exposure prediction is estimated from monitoring data, propagate uncertainty or perform sensitivity analyses where feasible. A very fine-resolution map is not evidence of fine-resolution accuracy. Match claims to validation support and avoid interpreting pixel-level coefficients as individual dose-response effects.

## Population composition and standardization

Geographic rates can differ because of age, sex, or other population composition even when stratum-specific rates are similar. Direct standardization applies stratum-specific rates to a common reference population; indirect standardization compares observed events with expected events based on reference rates. These approaches answer different questions and can be unstable in small areas. Regression adjustment can estimate conditional associations, but standardized marginal estimates may be more relevant for policy. State the standard population and whether the reported quantity is a crude, standardized, or model-based rate.

Migration changes both numerator and denominator relationships. Residence at diagnosis may differ from residence during the etiologically relevant exposure period. For mobile populations or changing boundaries, consider person-time allocation, time-varying residence, or a stable common geography. If such information is unavailable, explicitly limit interpretation to recorded area-time rates rather than individual exposure histories.

## Choosing spatial weights

A contiguity graph connects polygons that share an edge or vertex. Row-standardization makes each area's neighboring weights sum to one, which helps interpret a spatial lag as a neighbor average but gives isolated areas special treatment. Distance-band weights connect areas within a specified radius; k-nearest-neighbor weights guarantee a minimum number of connections but may create long links in sparsely settled regions. Travel-time or commuting weights can better represent interaction when relevant. Define the matrix before inspecting the outcome and show sensitivity to plausible alternatives, since a hotspot can depend on the chosen neighborhood definition.

## Temporal validation of risk surfaces

A model that interpolates well in a random held-out sample may fail when predicting a future period because nearby observations leak information about the held-out point. Separate validation by time, geographic block, or both according to the intended use. Random splits are especially optimistic when adjacent districts or weeks share outcomes. For a map intended to guide the next season, train on earlier years and validate on later years; for deployment in a new region, hold out entire regions. Report how the split was formed and whether all preprocessing used only training data.

When communicating small-area results, state which decisions the estimates support and which they cannot support. A district estimate can guide where to investigate or allocate broad resources, but it should not be used to label an individual resident as exposed or at risk. Revisit maps as population and boundary definitions evolve so apparent trends are not artifacts of changed geography.

In all reported maps, preserve the date of the underlying data extract and note whether recent periods are incomplete. A map is a time-stamped estimate, not a timeless property of a place.

## References and further reading

- Wakefield J. Ecologic studies revisited. *Annu Rev Public Health*. 2008;29:75–90. [doi:10.1146/annurev.publhealth.29.020907.090821](https://doi.org/10.1146/annurev.publhealth.29.020907.090821).
- Elliott P, Wartenberg D. Spatial epidemiology: current approaches and future challenges. *Environ Health Perspect*. 2004;112:998–1006. [doi:10.1289/ehp.6735](https://doi.org/10.1289/ehp.6735).
- Auchincloss AH, Gebreab SY, Mair C, Diez Roux AV. A review of spatial methods in epidemiology, 2000–2010. *Annu Rev Public Health*. 2012;33:107–122. [doi:10.1146/annurev-publhealth-031811-124655](https://doi.org/10.1146/annurev-publhealth-031811-124655).
- Lawson AB. *Bayesian Disease Mapping: Hierarchical Modeling in Spatial Epidemiology*. 3rd ed. CRC Press; 2018.
- Besag J, York J, Mollié A. Bayesian image restoration, with two applications in spatial statistics. *Ann Inst Stat Math*. 1991;43:1–20. [doi:10.1007/BF00116466](https://doi.org/10.1007/BF00116466).
- Waller LA, Gotway CA. *Applied Spatial Statistics for Public Health Data*. Wiley; 2004.

*For group-level designs, see [Ecological studies](../study-design/ecological-studies.html). For time-indexed outcomes, see [Time-series analysis in health research](time-series-analysis-in-health-research.html).*
