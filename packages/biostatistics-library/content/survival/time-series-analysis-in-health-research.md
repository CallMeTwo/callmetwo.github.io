---
title: Time-series analysis in health research
summary: Analyze measurements ordered in time while accounting for trend, seasonality, serial dependence and interventions.
---

## Overview and key ideas

A **time series** is a sequence of observations indexed by time: daily emergency visits, weekly infections, monthly medication use, or hourly physiology. Ordering is part of the data structure. Measurements close together often share causes and resemble one another, so treating each observation as independent usually gives standard errors that are too small and confidence intervals that are too narrow.

Time-series methods answer several distinct questions. **Description** characterizes trend, seasonality, and irregular variation. **Forecasting** predicts future values conditional on observed history and assumptions about the future. **Intervention analysis** estimates how a defined event changed a trajectory relative to a counterfactual. **Process monitoring** looks for departures from an expected pattern. These questions require different models and evaluation criteria; a model with good forecast accuracy need not identify a causal effect.

A useful decomposition is

`Y_t = trend_t + seasonal_t + remainder_t`,

or, when effects multiply,

`Y_t = trend_t × seasonal_t × remainder_t`.

The remainder may still have serial dependence. The autocorrelation at lag `k` describes correlation between `Y_t` and `Y_(t-k)` after accounting for relevant trend and seasonality. Autocorrelation is not merely a nuisance: it can represent persistence, delayed response, transmission, or service workflows.

Specify the **time index**, **sampling interval**, **outcome**, **denominator**, **target population**, and **estimand** before modeling. “Change after the policy” is incomplete. A more precise estimand might be the immediate change in monthly rate at implementation, the change in monthly slope, the average difference between observed and counterfactual rates over 12 months, or the 1-step-ahead forecast error.

This differs from survival analysis, which models time from an individual origin to an event while allowing censoring; see [Censoring and survival functions](censoring-and-survival-functions.html). It also differs from ordinary repeated-measures analysis, where the main aim is often comparing person-level trajectories; see [Repeated-measures designs](repeated-measures-designs.html).

## When to use it

Use time-series analysis when observations are meaningfully ordered and the question concerns evolution, prediction, intervention effects, or process signals. Common applications include:

- Describing disease incidence, hospital use, prescriptions, or laboratory results over calendar time.
- Forecasting demand, admissions, blood-product use, or staffing needs.
- Estimating changes associated with a policy, guideline, service redesign, or product launch through an interrupted time series (ITS).
- Quantifying seasonal patterns, weekday effects, delayed exposure effects, or persistence.
- Monitoring a clinical or public-health process against an expected range.

ITS designs need enough pre- and post-intervention observations to characterize the background trajectory. A comparison series or concurrent control group often improves causal interpretation. If the outcome is repeated within individuals rather than an aggregate sequence, person-level correlation and varying trajectories may be better addressed using mixed models or generalized estimating equations.

## Estimands and model families

### Descriptive and forecasting targets

For a regular series, a forecast target is often the conditional mean `E(Y_(T+h) | Y_1,...,Y_T)` at horizon `h`. A prediction interval concerns a future observation and includes both uncertainty in the mean and irreducible outcome variation; a confidence interval around the mean trajectory is narrower. Forecast performance should be assessed at horizons relevant to the decision, using time-ordered validation rather than random train/test splits.

Autoregressive integrated moving-average (ARIMA) models represent dependence through lagged values and lagged innovations. An AR(p) model has `Y_t = c + φ_1Y_(t-1)+...+φ_pY_(t-p)+ε_t`; a moving-average component includes past shocks. Differencing can remove a stochastic trend, but over-differencing may erase useful long-run information. Seasonal ARIMA adds seasonal lags. Dynamic regression adds external predictors while modeling autocorrelated errors. Exponential smoothing offers a direct way to update level, trend, and seasonal components.

No model class is universally preferred. Compare candidates using training data and time-respecting validation, then examine residual autocorrelation, distribution, stability, and forecast intervals. Information criteria help compare models fitted to the same outcome and data, but do not show that a causal interpretation is correct.

### Interrupted time series estimands

For an intervention beginning at time `T0`, define `time_t` as elapsed time, `post_t = I(t ≥ T0)`, and `time_after_t = max(0, t-T0)`. Segmented regression is

`g{E(Y_t)} = β0 + β1 time_t + β2 post_t + β3 time_after_t + seasonal_terms_t + covariates_t`.

For an identity link, `β1` is the baseline slope, `β2` the immediate level change at the intervention, and `β3` the slope change. At `h` time units after intervention, the model-implied difference from continuation of the pre-intervention trend is `β2 + hβ3`. With a log link, exponentiated coefficients are ratios; changes should be translated to rates or counts at relevant times. The average effect over a post-period of `H` equally spaced observations (with `h=0,...,H-1`) is `β2 + β3(H-1)/2` on the identity scale.

A **controlled ITS** adds a comparison series and interaction terms. The key contrast is whether the exposed series changed beyond contemporaneous changes in the comparison. Its credibility depends on a shared counterfactual trend, lack of spillover, comparable measurement, and no differential concurrent shock. A comparison series need not be untreated in all respects, but exposure and measurement changes must be understood.

### Counts, rates, and denominators

For counts `Y_t`, a Poisson model assumes conditional mean and variance are equal; health counts often show overdispersion, where variance exceeds the mean. A negative-binomial model can allow extra-Poisson variability. Include `log(population_t)` or `log(person_time_t)` as an offset when estimating rates, and make clear whether the estimand is a count, rate, or rate ratio. A population offset adjusts scale but does not fix changes in case ascertainment or population composition.

## Assumptions and limitations

- **Stable measurement and population:** coding, case definitions, access, catchment populations, and data completeness can change. Model covariates cannot reliably repair a poorly documented outcome definition.
- **Adequate time structure:** observations must span enough cycles to separate trend from seasonality. A short series cannot distinguish a slow secular trend from an annual cycle.
- **Residual dependence:** after modeling, inspect autocorrelation and partial autocorrelation. Unmodeled correlation usually biases uncertainty; choosing an arbitrary autoregressive order can also distort estimates.
- **Seasonality and calendar effects:** weekday, holiday, school, or annual cycles should be specified at a resolution supported by the data. Flexible splines or Fourier terms can represent smooth seasonal patterns; too many degrees of freedom can absorb a real intervention effect.
- **Intervention form and timing:** segmented regression assumes a defined interruption and a specified immediate, gradual, or delayed effect. Anticipation, staggered adoption, ramp-up, discontinuation, and multiple interventions require explicit terms or another design.
- **No unmeasured coincident shock for causal claims:** a new epidemic, reimbursement change, staffing shortage, or coding rule may coincide with intervention. Many data points do not remove this threat.
- **Missingness and irregular times:** omitted periods, changing reporting delays, and irregular observation intervals can bias trends. Do not compress time by dropping missing dates; represent calendar gaps explicitly.
- **Forecast stability:** forecasts assume the data-generating process and predictor relationships remain sufficiently stable. Intervals cannot cover a surprise policy or outbreak unless it is represented in a scenario.

## Worked example: a segmented ITS with calculation and R

A hospital introduces a sepsis-screening pathway at the start of month 25. There are 24 monthly observations before and 24 after. The endpoint is deaths per 1,000 admissions. The segmented model includes a linear baseline trend, an immediate change, and a post-intervention slope change. Suppose the fitted coefficients are: baseline slope `β1 = -0.02` deaths per 1,000 admissions per month, immediate change `β2 = -0.80`, and slope change `β3 = -0.05` per month.

At month 25, the estimated gap from the extrapolated baseline is `−0.80`. At 12 months after implementation (`h=12`), it is `−0.80 + 12(−0.05) = −1.40` deaths per 1,000 admissions. If the 95% confidence interval for `β2` is `−1.30` to `−0.30`, the immediate change is compatible with a reduction. The slope-change interval, say `−0.10` to `0.00`, is borderline and should not be described as a proven continuing decline. The trajectory contrast at month 12 needs a confidence interval computed from the covariance of `β2` and `β3`; adding coefficient interval endpoints is incorrect.

Illustrative R code using `sandwich` gives a basic fit and Newey–West covariance estimate:

```r
# dat has one row per consecutive calendar month:
# month (1,...,48), deaths, admissions
library(sandwich)
library(lmtest)

dat$post <- as.integer(dat$month >= 25)
dat$after <- pmax(0, dat$month - 25)
dat$rate <- 1000 * dat$deaths / dat$admissions
fit <- lm(rate ~ month + post + after + factor(month %% 12), data = dat)

# HAC covariance: choose the lag from the sampling frequency and design,
# then examine sensitivity to plausible lag choices.
coeftest(fit, vcov. = NeweyWest(fit, lag = 3, prewhite = FALSE))
```

This code is only a starting point. A count model with `offset(log(admissions))` may be preferable to a rate regression, especially with small denominators. The month-of-year factor can overfit if there are few annual cycles; Fourier terms or prespecified seasonal terms may be more stable. HAC standard errors are not a substitute for checking model structure. Plot the observed series and fitted counterfactual, examine residual ACF and influential months, test plausible alternative trend forms, and report how missing observations and denominator changes were handled.

A controlled ITS could add hospital indicators and interactions between hospital, post period, and time-after terms. The intervention effect is a difference-in-differences of changes in level/slope, conditional on an adequately comparable control trajectory. It is not automatically causal just because a control series is included.

## Interpretation and common pitfalls

- A strong correlation between two trending series can be spurious. Model common trends and ask whether a defensible mechanism links them.
- A significant ITS coefficient does not prove causation. Describe co-interventions, anticipation, secular changes, and ascertainment changes.
- Do not present `β2` alone when a slope change exists. Report absolute predictions and contrasts at clinically relevant post-intervention times.
- Distinguish predictive uncertainty from uncertainty in the mean. State the forecast horizon and validate at that horizon.
- A rate can change because the numerator changed, the denominator changed, or both. Show denominators and outcome counts alongside rates.
- Avoid post hoc selection of breakpoints, seasonal terms, or lag structures without disclosing the search. If the interruption date is uncertain, account for that uncertainty.
- Report the sampling interval, number of pre/post points, missingness, outcome definition, denominator, seasonal terms, dependence handling, model diagnostics, effect scale, and uncertainty.

## Deeper modeling considerations

### Stationarity, differencing, and transformations

A weakly stationary process has a constant mean and variance, with covariance depending on lag rather than calendar time. Many health series are not stationary because of trend, seasonality, changing population size, or evolving data systems. ARIMA methods use differencing to stabilize the mean, but differencing changes the estimand and can induce artificial negative autocorrelation when applied unnecessarily. Plot the original series, inspect seasonal patterns, and use subject-matter knowledge; unit-root tests have limited power in short series and should not dictate the analysis by themselves.

A log transformation can stabilize variance for positive continuous outcomes, but zeros complicate interpretation. For counts, a generalized linear model with an appropriate link is often preferable to transforming counts and treating them as Gaussian. If a log-scale model is used, retransformation to the arithmetic mean requires accounting for residual variance; simply exponentiating a fitted log mean typically estimates a geometric mean.

### Missing observations and measurement changes

Missing intervals are not equivalent to zero. A missed reporting week may reflect a data outage, while a zero count is an observed absence of events. Mark missing time explicitly and investigate whether missingness is related to workload or outbreak severity. Standard ARIMA procedures can handle some missing outcomes, but inference still depends on assumptions about the missing process. For interrupted designs, data gaps near the interruption are especially consequential.

A measurement-system change can create an artificial step or slope. Maintain a data provenance timeline showing coding systems, laboratory criteria, denominator sources, facility participation, and reporting rules. If an observed breakpoint coincides with a known measurement change, conduct sensitivity analyses or harmonize the series before causal interpretation. Statistical adjustment cannot identify which of two perfectly coincident changes produced the step without additional information.

### Forecast validation and uncertainty

For forecasting, use rolling-origin evaluation: fit through time `t`, forecast the next `h` periods, move the origin forward, and aggregate errors over origins. Do not randomly shuffle time points because it allows future information into training. Report metrics that reflect the decision: MAE is interpretable in outcome units; RMSE penalizes large errors; MASE compares with a naive benchmark; interval coverage checks uncertainty calibration. For rare counts, percentage errors can be undefined or unstable near zero.

Prediction intervals should widen with horizon and include parameter and innovation uncertainty. Standard intervals generally assume the selected model is correct and shocks follow its distribution. Add scenarios for plausible policy changes, epidemics, or staffing shifts rather than presenting one long-range path as certain. For model comparison, report benchmark performance (such as seasonal-naive forecasts) and uncertainty in score differences.

### Lagged exposures and distributed effects

An exposure may act over a delay: temperature affects mortality over several days, while a service redesign may take months to alter admissions. A distributed-lag model estimates a pattern over multiple lags, but neighboring lagged exposures are correlated and can make individual lag coefficients unstable. Prespecify plausible lag windows, use structured smooths or constraints, and report cumulative effects over interpretable windows. Searching many lags and reporting only the strongest creates selection bias.

For an intervention with a gradual rollout, the treatment date may not represent a single shock. Consider ramp functions, exposure intensity, or a model aligned with actual uptake. If implementation starts at different times across sites, a single aggregate interruption may conceal heterogeneous effects and requires a design for staggered interventions.

## Reporting and design checklist

A transparent analysis should provide a time plot with the intervention date, raw counts and denominators, missing periods, and fitted trend. State whether time is indexed by observation number or calendar dates, how leap years and unequal intervals are handled, and whether seasonal terms are fixed or estimated. For ITS, show observed and counterfactual trajectories and the effect contrast at prespecified times, not just the regression table. Report both model-based and dependence-robust uncertainty when each answers a useful sensitivity question.

For a causal question, describe why the selected intervention date is exogenous enough for the analysis, what alternative events occurred nearby, whether anticipation is plausible, and why the pre-intervention model approximates the unobserved counterfactual. The counterfactual is an extrapolation, not directly observed evidence. When effect estimates depend strongly on the number of pre-intervention points, trend form, comparison series, or excluding a disrupted period, present that instability rather than selecting the most favorable model.

When a series contains several organizations, avoid aggregating away meaningful heterogeneity without checking it. Facility-specific trajectories can differ in baseline, seasonality, intervention uptake, and recording quality. Hierarchical models can partially pool facility estimates; cluster-robust uncertainty may help when the number of clusters is adequate. With few clusters, conventional sandwich estimates can be unreliable. The number of time points does not replace the number of independent intervention units.

## Choosing between analysis goals

A common source of error is using forecasting language for a causal evaluation. Forecasting asks which future values are likely under continuation of the observed process; intervention analysis asks what would have happened without the intervention. Forecast models may use lagged outcomes, while causal models need a credible counterfactual and careful treatment of post-intervention variables. A predictor measured after treatment can improve forecast accuracy but may be an inappropriate adjustment variable for a total causal effect.

Similarly, a process-control chart identifies departures from a reference process, but a control limit is not a clinical safety boundary. A rare event may be harmful below the upper control limit, and a statistically unusual increase may be clinically minor. Pair statistical signals with severity, preventability, and response capacity. Explicitly distinguish a statistical change point from the date at which a policy caused a change; algorithms can locate a break after inspecting data, but causal attribution needs design evidence.

## Sample size and precision for ITS

There is no universal minimum number of time points that guarantees a reliable ITS. Precision depends on baseline variability, residual autocorrelation, seasonal structure, effect size, denominator, and how many parameters are estimated. A series with many observations but strong seasonality and high serial dependence may contain less information than its raw length suggests. Before implementation, simulate plausible trajectories under null and alternative effects, fit the planned model, and estimate bias, interval coverage, and power. Report the assumptions used; a post hoc power calculation based on the fitted effect adds little beyond the confidence interval.

If data are available at a finer interval than the intervention mechanism supports, aggregating can reduce noise but sacrifices temporal resolution and may hide short-lived effects. Conversely, very frequent measures can create strong serial dependence and increase sensitivity to reporting artifacts. Choose the interval based on how quickly the outcome can respond and how consistently it is measured, then check whether reasonable aggregation choices alter the conclusion.

## Sensitivity analysis for intervention effects

A credible ITS should assess whether conclusions change under plausible specifications rather than treating one model as definitive. Prespecify a small set of alternatives: linear versus modestly flexible baseline trend, seasonal adjustment, dependence model or HAC lag, excluding a short implementation transition, and a negative-control outcome or comparison series where available. Plot each counterfactual. Avoid searching many combinations and reporting only the estimate that is statistically significant. If the effect direction is stable but magnitude varies, report that range and explain the modeling choices responsible.

## References and further reading

- Bernal JL, Cummins S, Gasparrini A. Interrupted time series regression for the evaluation of public health interventions: a tutorial. *Int J Epidemiol*. 2017;46:348–355. [doi:10.1093/ije/dyw098](https://doi.org/10.1093/ije/dyw098).
- Kontopantelis E, Doran T, Springate DA, Buchan I, Reeves D. Regression based quasi-experimental approach when randomisation is not an option: interrupted time series analysis. *BMJ*. 2015;350:h2750. [doi:10.1136/bmj.h2750](https://doi.org/10.1136/bmj.h2750).
- Box GEP, Jenkins GM, Reinsel GC, Ljung GM. *Time Series Analysis: Forecasting and Control*. 5th ed. Wiley; 2015.
- Hyndman RJ, Athanasopoulos G. *Forecasting: Principles and Practice*. 3rd ed. [Online text](https://otexts.com/fpp3/).
- Lopez Bernal J, Soumerai S, Gasparrini A. A methodological framework for evaluating health policies with interrupted time series designs. *BMC Med Res Methodol*. 2018;18:18. [doi:10.1186/s12874-018-0590-1](https://doi.org/10.1186/s12874-018-0590-1).

*For correlated person-level trajectories, see [Mixed-effects models](mixed-effects-models.html) and [Generalized estimating equations](generalized-estimating-equations.html).*
