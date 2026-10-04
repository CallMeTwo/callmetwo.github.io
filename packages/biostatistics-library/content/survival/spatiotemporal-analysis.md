---
title: Spatiotemporal analysis
summary: Analyze health outcomes that vary across both places and time, accounting for spatial dependence, temporal trends, population denominators, and uncertainty in maps.
---

## Overview

Spatiotemporal analysis studies how health outcomes vary across locations and over time. It is used for infectious disease surveillance, environmental epidemiology, health-service planning, and mapping disparities. The central challenge is dependence: nearby places may share exposures or healthcare systems, and adjacent times may share outbreaks, weather, or policy effects. Ignoring either structure can produce overconfident estimates and misleading hot spots.

Maps are descriptive displays, not evidence by themselves that location causes risk. A high count may reflect a large population; a high rate in a small area may be unstable. Define the outcome, spatial unit, time interval, denominator, and inferential target before fitting a model. Distinguish prediction, cluster detection, burden estimation, and causal effect analysis.

## Define spatial units and denominators

Spatial data may be points (addresses, facilities), lines (roads, rivers), or areas (districts, census tracts). Geocoding error, boundary changes, and privacy restrictions affect analysis. Areal data depend on chosen boundaries: the modifiable areal unit problem means patterns can change when areas are redefined or aggregated. Report the geographic resolution and boundary vintage.

Counts require population-at-risk denominators when estimating rates. If one district has 100 events among 100,000 people and another has 10 among 2,000, the first has more events but lower rate (100 vs 500 per 100,000). Age-standardization may be needed when demographic composition differs. Denominator uncertainty matters for small populations or modeled populations.

Choose time aggregation based on disease dynamics and data reliability. Daily data may be noisy and delayed; monthly aggregation can mask short outbreaks. Irregular periods require explicit exposure time. If reporting latency changes, recent counts may be incomplete. Avoid comparing crude counts across spatial units or time without accounting for population and observation process.

## Spatial dependence and neighborhood structure

Spatial dependence means observations in nearby areas are more alike than distant ones after modeled covariates. Define neighborhoods through shared borders, distance bands, travel networks, or social contact, depending on the mechanism. A contiguity matrix may be appropriate for infectious spread across adjacent districts; commuting flows may better capture exposure transmission in urban systems.

Global Moran's I summarizes spatial autocorrelation but depends on the weights matrix and can obscure local variation. Local indicators or scan statistics identify candidate clusters but involve multiple testing and boundary sensitivity. Hot-spot maps should display uncertainty or stability, not only color-coded point estimates.

A spatial weights matrix (W) encodes which areas are neighbors and how strongly they interact. Row-standardization makes weights sum to one but changes interpretation; binary adjacency treats all neighbors equally. Islands with no neighbors and disconnected regions require explicit handling. Sensitivity to reasonable matrices is important because results can be driven by arbitrary neighborhood definitions.

CAR random effects borrow strength among neighbors through a conditional distribution in which each area's latent effect depends on adjacent areas. The intrinsic CAR prior is improper without a constraint and has a spatially constant component confounded with the intercept. BYM2 parameterization separates structured and unstructured variance and is often easier to scale, but still requires prior choices for total variation and spatial mixing. State the graph and prior specification.

Spatial smoothing stabilizes noisy area estimates but can suppress a true local extreme, especially if it is isolated or borders lower-risk areas. A high posterior exceedance probability can be used to flag areas above a policy threshold, but it depends on posterior uncertainty and threshold choice. Distinguish exploratory prioritization from confirmatory evidence. Model-based borrowing is not evidence that neighbors share a causal exposure.

## Spatiotemporal count model

For area (i) and time (t), a common model is (Y_{it}\sim\text{Poisson}(E_{it}\theta_{it})), where (E_{it}) is expected count or population offset and \(\theta_{it}\) relative risk. A log-linear predictor can include covariates, spatial random effect, temporal trend, and space-time interaction:

\[
\log(\theta_{it})=\beta_0+X_{it}\beta+u_i+v_t+w_{it}.
\]

Here \(u_i\) captures persistent area differences, \(v_t\) common temporal change, and \(w_{it}\) local deviations. For overdispersed counts, negative-binomial or hierarchical models may be more appropriate than Poisson. Spatial random effects often use conditional autoregressive (CAR) priors based on adjacency; their assumptions and identifiability constraints need explicit treatment.

Suppose observed count is 24 in an area where expected count is 16. Crude standardized incidence ratio is 1.5. A Poisson interval is broad when counts are small; hierarchical smoothing may shrink the area's relative risk toward the overall mean using neighboring information. The smoothed value is not simply a “corrected rate”: it is a model-based posterior or empirical estimate whose uncertainty and prior structure should be shown.

```r
library(INLA)
fit <- inla(cases ~ 1 + offset(log(expected)) +
              f(area, model = "bym2", graph = adjacency) +
              f(time, model = "rw1"),
            family = "poisson", data = dat,
            control.predictor = list(compute = TRUE))
```

This is illustrative. The BYM2 model combines structured and unstructured area variation; `expected` must be positive and correctly derived. The random walk assumes adjacent periods evolve smoothly. Check prior sensitivity, fit, overdispersion, and predictive performance. Data structure and package APIs should be validated in the project environment.

Expected counts can be generated by indirect standardization: sum age- and sex-specific local population multiplied by reference rates. If the reference population or rates are uncertain, treating (E_{it}) as fixed understates uncertainty. Alternatively, include log population as offset and covariates directly. Decide whether the target is standardized relative risk or absolute rate, and label maps accordingly.

Poisson variation may be too restrictive even with spatial and temporal random effects. Negative-binomial models add residual dispersion; zero-inflated models can represent structural absence only when a credible mechanism exists. Posterior predictive checks should compare distributions of zeros, extremes, spatial autocorrelation, and temporal runs with replicated datasets. A model can reproduce mean rates but miss outbreak clustering.

Space-time interaction can be structured or unstructured. An unstructured (w_{it}) for every area-period pair may require many parameters and overfit. Structured interactions can allow spatial patterns to evolve smoothly over time, but assume neighboring areas change similarly. Compare simpler models and use out-of-sample prediction or posterior predictive checks to justify complexity.

## Temporal structure and changing exposure

Temporal dependence can use autoregressive processes, random walks, splines, seasonal components, or explicit intervention terms. Choose the structure based on time spacing and plausible dynamics. An AR(1) process assumes correlation decays geometrically with lag; a random walk assumes cumulative innovations and can drift. Seasonality may differ by region; include space-by-season structure only with sufficient information.

Exposure fields such as pollution, temperature, or policy rollout can vary across both space and time. Their effects may be delayed and spatially correlated. Use appropriate lag structures and account for measurement error in gridded or interpolated exposures. Spatial confounding occurs when exposure aligns with spatial random effects; spatial adjustment can attenuate or distort exposure coefficients if not carefully defined.

Temporal dependence can vary by area. A shared random walk assumes all areas experience common change; area-specific random slopes allow different long-term trends, while local AR processes allow area-period deviations to persist. More flexible dynamics require more time points and areas. With a short series, a complex spatiotemporal random field can appear well fitted while predictions remain unstable.

If counts arrive with delay, the final periods may be right-truncated. Model reporting delay separately or exclude incomplete periods until mature. Nowcasts can estimate latent recent incidence from historical delay distributions, but uncertainty should increase near the present. A map of provisional counts should visually distinguish nowcast estimates from final observed counts.

Weather and pollution exposures are often measured at monitors or grids and assigned to administrative areas. Interpolation error can be spatially correlated and may vary with monitor density. A regression treating assigned exposure as exact can understate uncertainty and bias exposure effects. Use measurement-error models or sensitivity analyses if exposure uncertainty is substantial; validate assignment against held-out monitors where possible.

## Maps, uncertainty, and privacy

Map posterior means or fitted rates with uncertainty intervals, exceedance probabilities, or stability classifications. A single shaded rate map can imply certainty where sparse counts produce wide uncertainty. Distinguish raw rate, standardized ratio, smoothed estimate, and predicted risk in legends and captions. Use consistent scales across time panels to avoid visual exaggeration.

Small-area maps risk re-identification, especially for rare events. Aggregate, suppress, perturb, or restrict access according to governance and disclosure policy. Suppression can itself distort neighboring estimates; document procedures. Avoid mapping individual locations unless consent and security allow it.

Color palettes should be perceptually ordered for rates and use diverging scales only for signed contrasts around a meaningful reference. Keep bins and scales fixed across time panels. If using quantile bins, a district's color may change even when its rate does not because other areas change; disclose this. Include scale, unit, time window, denominator, and whether values are crude, standardized, smoothed, or predicted.

For privacy-preserving maps, consider minimum-cell suppression, controlled access, or aggregation. Noise addition can change local clusters and should be included in uncertainty assessment. Public-health urgency does not remove ethical obligations; coordinate with data stewards and communities, particularly where maps can stigmatize neighborhoods or marginalized populations.

## Cluster detection versus causal inference

Cluster detection asks whether observed cases concentrate more than expected under a null spatial-temporal process. A scan statistic may evaluate windows over space and time and adjust for the search through its null distribution. A detected cluster does not identify its cause. Searching many window sizes, periods, and outcomes creates multiplicity; report the scan parameters and validation strategy.

Causal spatial analysis asks what would have happened under an alternative exposure or policy. It requires confounding control, positivity, consistency, and a defensible counterfactual. Spatial random effects can model residual correlation but do not automatically remove unmeasured confounding; they can also absorb exposure variation. Consider natural experiments, controlled ITS, or spatial difference-in-differences when design supports them.

## Worked example: mapping respiratory admissions

Suppose 20 districts are observed monthly for five years. Each record has respiratory admissions, age-stratified population, temperature, and pollution. First build expected counts from reference rates by age and month, inspect missingness and boundary changes, then map crude rates and denominators. A BYM2 Poisson model with a temporal random walk can estimate smoothed relative risk while accounting for persistent spatial pattern and shared temporal drift.

If pollution increases by 10 units and estimated log-relative-risk coefficient is 0.04, the conditional rate ratio is (e^{0.04}=1.041), about a 4.1% higher rate per 10 units, conditional on covariates and latent effects. The interval and exposure support matter; if most districts lie in a narrow pollution range, the model extrapolates. Spatial random effects may compete with a spatially smooth exposure term, so present sensitivity to spatial confounding assumptions.

To evaluate a policy changing pollution, a cross-sectional exposure coefficient is not enough. Define a target intervention contrast and control for time-varying confounders and co-policies. If only one treated region changes policy, consider controlled ITS, synthetic control, or other quasi-experimental design and test pre-trends. Mapping model residuals is useful for diagnostics but does not prove causal validity.

For outbreak detection, a scan statistic might flag a space-time cylinder with more cases than expected. The scan adjusts for searching over candidate windows under its model, but a cluster may reflect population movement, reporting delay, or changes in testing. Verify case records and exposure; use independent data or prospective monitoring to confirm. Report the scan window parameters and how many outcomes were explored.

## Validation and sensitivity analysis

Validate predictions out of time and, where possible, out of region. Randomly splitting area-time rows leaks neighboring and adjacent-period information. Use spatial blocks or leave-one-region-out validation, and temporal holdouts. Assess calibration, count deviance, and predictive interval coverage. For cluster detection, assess stability across plausible neighborhood matrices and time windows.

Sensitivity analyses should vary boundary definitions, adjacency matrices, temporal structure, denominator, smoothing priors, and exposure lags. Report whether high-risk areas or exposure associations persist. A model can fit well but produce unstable maps; policy recommendations should account for ranking uncertainty. Avoid labeling small-area estimates as definitive when their posterior intervals overlap substantially.

For risk prediction, assess calibration of counts and rates across space and time, not only overall deviance. Hold out later periods to test forecasting and hold out geographic blocks to test transfer to new locations. Spatially random row splits place near-neighbor observations in both train and test sets, making performance optimistic. For cluster detection, use simulation under realistic null processes and evaluate sensitivity and false alarm rates across alternative cluster sizes.

Check sensitivity to aggregation level: district-level associations may differ from neighborhood- or individual-level associations because of ecological bias. If available, individual-level or multilevel data can separate within- and between-area effects. Avoid inferring that every resident of a high-rate district has high individual risk; ecological associations are group-level.

Uncertainty includes exposure measurement, denominator estimation, reporting, boundary choice, model parameters, and future process variation. Posterior intervals usually quantify only model-based uncertainty conditional on observed data and specification. Map uncertainty or exceedance probabilities, document data limitations, and avoid ranking small areas with nearly indistinguishable posteriors.

## Communicating model-based maps

Report the spatial unit, boundary vintage, time aggregation, event definition, denominator method, and neighborhood matrix. Describe fixed effects, spatial and temporal random effects, prior distributions, and whether estimates are posterior means, medians, or exceedance probabilities. Provide observed counts and expected counts beside smoothed risks where possible, and show uncertainty in a companion map or table.

For policy, identify whether the goal is to allocate resources, detect outbreaks, forecast burden, or estimate an exposure effect. A smoothed risk map can prioritize investigation but should not be interpreted as a causal map. Explain how missing areas, small counts, and reporting delay were handled. Share code and boundaries when lawful, with privacy protections documented.

Avoid calling an area a “hot spot” based only on its highest posterior mean. Define the threshold and quantify uncertainty, such as probability risk exceeds a policy threshold. If many areas are compared, account for multiple testing or use a hierarchical model that partially pools estimates. The language should match the evidence: “areas prioritized for review” is safer than definitive labels when estimates are unstable.

## Planning data collection and resolution

Spatial analysis is constrained by where outcomes and exposures are measured. Before modeling, identify coverage gaps, geocoding precision, boundary changes, and minimum population sizes. Finer spatial resolution can reveal heterogeneity but increases sparse counts, privacy risk, and sensitivity to location error. Coarser aggregation stabilizes rates but can conceal localized burden. Choose resolution based on the intervention scale and data quality.

For prospective surveillance, standardize geographic coding and retain event dates and exposure denominators at the finest safe level; aggregation can occur later. For retrospective studies, harmonize boundary vintages or use areal interpolation and quantify its uncertainty. Record how individuals are assigned to areas and whether residential mobility is captured.

Before publishing a map, review its likely interpretation with local public-health stakeholders. An apparently high-risk area may need resources, not blame. Explain uncertainty and data limitations in plain language, and avoid ecological statements about individual behavior based on area-level associations.

Network structure can be more relevant than straight-line distance. For infectious disease, commuting flows, school contacts, or referral pathways may connect areas that do not share borders. A network weights matrix can represent these links, but its construction needs data and sensitivity analysis. A spatial model built on adjacency alone may miss transmission along transport corridors.

For environmental exposures, a person's exposure may differ from the value assigned to their residential area because of mobility, indoor environments, and time spent elsewhere. Area-level exposure models estimate contextual associations and should not be interpreted as individual dose-response without additional measurement. Report the exposure assignment rule and its limitations.

When maps are used to allocate resources, evaluate whether the decision is robust to plausible uncertainty in district ranking. A top-ranked area with a wide interval may not warrant a different response from several nearby areas with overlapping estimates.

If rank drives decisions, report posterior rank probabilities or expected loss under the allocation rule, not just point-estimate ordering.

Maps should be reviewed by people familiar with local boundaries and service patterns, who can identify artifacts from misgeocoding or administrative changes.

Document any manual boundary or geocoding correction for audit.

Release maps at a resolution appropriate to privacy and policy decisions.

Pair mapped summaries with downloadable aggregate tables where disclosure rules permit, so readers can inspect numeric values.

## References and further reading

- Besag J, York J, Mollié A. Bayesian image restoration, with two applications in spatial statistics. *Annals of the Institute of Statistical Mathematics*. 1991;43:1–20. [doi:10.1007/BF00116466](https://doi.org/10.1007/BF00116466)
- Wakefield J. *Bayesian and Frequentist Regression Methods*. Springer; 2013.
- Lawson AB. *Bayesian Disease Mapping: Hierarchical Modeling in Spatial Epidemiology*. 3rd ed. CRC Press; 2018.
- Kulldorff M. A spatial scan statistic. *Communications in Statistics—Theory and Methods*. 1997;26:1481–1496. [doi:10.1080/03610929708831995](https://doi.org/10.1080/03610929708831995)
- Rue H, Martino S, Chopin N. Approximate Bayesian inference for latent Gaussian models by using integrated nested Laplace approximations. *JRSS B*. 2009;71:319–392. [doi:10.1111/j.1467-9868.2008.00700.x](https://doi.org/10.1111/j.1467-9868.2008.00700.x)
