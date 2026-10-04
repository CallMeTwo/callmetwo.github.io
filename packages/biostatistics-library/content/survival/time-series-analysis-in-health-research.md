---
title: Time-series analysis in health research
summary: Analyze ordered health measurements by modeling trend, seasonality, autocorrelation, and intervention effects without treating adjacent observations as independent.
---

## Overview

A time series is an ordered sequence of measurements collected across time: daily admissions, monthly mortality, weekly test positivity, or repeated biomarker values. Its central feature is dependence: today's value often relates to yesterday's, and both may reflect trend, seasonality, or external shocks. Methods that treat each time point as an independent observation can understate uncertainty and confuse ordinary temporal variation with an intervention effect.

Time-series analysis can describe patterns, forecast future values, or estimate effects of an intervention. Those goals need different models and assumptions. A forecast can be accurate without identifying why a trend changed; an interrupted time series (ITS) can estimate a policy-associated change only if the counterfactual trend is credible.

## Define the time axis and outcome process

Specify the unit of time, observation window, outcome scale, and data-generating process. Is the outcome a count, rate, proportion, continuous measure, or individual trajectory? Are intervals equally spaced? Are observations missing, revised, or delayed? For counts, record the population at risk or person-time denominator; a rise in counts can reflect population growth rather than incidence increase.

Plot the series with raw values, denominators, and intervention dates. Examine secular trend, seasonality, level shifts, changing variance, outliers, and missing intervals. Mark changes in coding, testing capacity, surveillance, or eligibility. Visual inspection is descriptive, not a model-selection oracle, but often reveals structural breaks and data errors.

## Decompose trend, seasonality, and dependence

A basic additive representation is (Y_t=T_t+S_t+E_t), with trend (T_t), seasonal component (S_t), and residual (E_t). Multiplicative structure may be more natural when seasonal amplitude grows with level; log transformation can convert multiplicative patterns to additive form. Seasonal periods may be weekly, annual, or multiple, and can shift over time.

Autocorrelation describes association between observations separated by a lag. An AR(1) process has (Y_t-\mu=\phi(Y_{t-1}-\mu)+\epsilon_t), with correlation decaying approximately as \(\phi^k\) at lag (k). ACF and PACF plots can inform model structure, but differencing and seasonal terms need scientific interpretation. Overdifferencing can induce artificial negative correlation.

Stationarity means key distributional properties such as mean and autocovariance do not change over time. Many health series are nonstationary due to trend, policy, or population change. Differencing can remove trend for forecasting; regression with time trend and autocorrelated errors may be preferable for estimating an intervention contrast. A unit-root test is not a substitute for understanding structural changes.

Seasonality should be modeled with a representation matching its shape and frequency. Monthly data can use month-of-year indicators or Fourier sine and cosine pairs; weekly data may need day-of-week effects and annual harmonics. If seasonality changes over years, allow smooth interaction with time or use a state-space decomposition. Seasonal differencing can aid forecasting but may obscure an intervention effect if the intervention coincides with a seasonal cycle.

Multiple seasonal cycles occur in daily health data, such as weekly and annual patterns. Fourier terms, dynamic harmonic regression, or specialized state-space models can represent these. Calendar effects such as holidays, school terms, and daylight changes can be more interpretable than generic seasonality. Include only variables known at forecast time when building a forecasting model; future values unavailable in deployment create leakage.

Autocorrelation diagnostics should be performed on model residuals, not only raw data. ACF bars outside approximate limits can indicate remaining dependence, but many lags are inspected and tests have limited power in short series. ACF/PACF patterns guide ARMA models, while domain knowledge informs plausible lag structure. For count outcomes, generalized linear autoregressive models or state-space count models may be needed rather than Gaussian ARIMA.

## Interrupted time series: a policy example

Suppose monthly emergency admissions are observed for 36 months before and 24 months after a new triage policy. A segmented regression models baseline trend, immediate level change, and slope change. Let (t) be months from series start and (I_t) indicate post-policy; define (P_t=0) before implementation and months since implementation afterward:

\[
Y_t=\beta_0+\beta_1t+\beta_2I_t+\beta_3P_t+\epsilon_t.
\]

Here \(\beta_2\) estimates an immediate level shift and \(\beta_3\) a change in monthly trend, relative to the projected pre-policy trajectory. If \(\beta_2=-12\) admissions/month and \(\beta_3=-0.4\), the modeled difference at 12 months post-policy is −12−0.4(12)=−16.8 admissions/month, assuming a linear trend and no concurrent shock. This is an association with implementation unless the counterfactual assumptions support causal attribution.

```r
library(nlme)
dat$post <- as.integer(dat$month >= policy_month)
dat$time_after <- pmax(0, dat$month - policy_month)
fit <- gls(admissions ~ month + post + time_after,
           correlation = corAR1(form = ~ month), data = dat)
summary(fit)
```

For counts, consider Poisson or negative-binomial regression with log population offset; this Gaussian example suits approximately continuous rates. `corAR1` handles residual autocorrelation under an equally spaced time scale. Check residuals and model assumptions; estimate uncertainty with methods appropriate to the number of time points.

The immediate level term represents a sudden jump at implementation. If the intervention effect accumulates gradually, add a lag or ramp function. A delayed effect can be modeled with a prespecified delay period or distributed lag; selecting the lag that maximizes effect after looking at data introduces bias. If policy changes exposure intensity continuously, model intensity rather than a simple binary indicator when measurement supports it.

For Gaussian outcomes, residual autocorrelation can be represented directly with an AR(1) correlation. For count outcomes, a log-link model might specify expected count as population offset plus trend, seasonality, level, and slope terms, with overdispersion. A quasi-Poisson model's standard errors may not account for serial dependence; use suitable correlation structures or robust methods and validate small-sample behavior.

The number of time points is a critical source of information. Many individuals contributing to each monthly aggregate improve precision of that month's rate but do not create additional independent time periods for estimating trend changes. A study with only 6 points before and 6 after has limited ability to distinguish a trend shift from ordinary autocorrelation. Planning should simulate series under plausible trends, seasonal cycles, dispersion, and intervention effects.

## Counterfactual assumptions and design strength

An ITS assumes the pre-intervention trend would have continued absent the intervention, conditional on modeled seasonality and covariates. Concurrent policies, outbreaks, changes in coding, anticipation, or delayed implementation can invalidate this counterfactual. More pre- and post-points improve characterization but do not remove confounding by a coincident event.

A control series can strengthen inference if it shares underlying shocks and is unaffected by the intervention. Difference-in-differences ITS compares changes in level and slope between intervention and control series, but requires comparable pre-trends and no differential concurrent shock. Choose controls based on mechanism, not merely because they show a favorable trend.

The intervention date must be defined operationally. If rollout is gradual, a single step indicator misrepresents exposure; use implementation intensity, phased rollout, or a transition period. Anticipatory behavior may shift outcomes before formal launch. Sensitivity analyses can vary plausible dates, exclude transition periods, and test alternative trend forms.

### Controlled ITS and comparator selection

With a control series, model group, time, post-intervention, and their interactions. The group-by-post coefficient estimates differential immediate level change; group-by-time-after estimates differential slope change. In a segmented difference-in-differences design, a common secular shock is removed only if it affects both series similarly and the control is not exposed to spillover. Pre-intervention trajectories should be compared graphically and quantitatively, but parallel pre-trends cannot be proven from a short series.

Choose controls with similar measurement systems, population, outcome determinants, and trend drivers, while remaining unaffected by the policy. A neighboring hospital may share an outbreak but also adopt the same policy informally. An unrelated outcome can serve as a negative-control series for coding or system changes if it shares measurement processes but is biologically unaffected. Control choice should be documented before post-policy results are inspected.

Synthetic control methods combine multiple comparison units to construct a weighted counterfactual for a treated unit. They can be useful when a single control is inadequate, but require donor units unaffected by treatment and good pre-intervention fit. The number of pre-periods, donor pool composition, and placebo analyses affect interpretation. A synthetic control is not simply a more complex ITS; its assumptions and estimand should be reported.

## Count, proportion, and rate models

For count data, specify the exposure offset as log person-time or population at risk. If admissions per month are modeled without denominator and population grows 10%, an apparent rise may reflect more residents rather than greater risk. Standardize denominators if age structure shifts. If event counts are clustered by facility, consider hierarchical random effects or robust variance, while recognizing there may be few facilities.

Poisson regression assumes conditional mean equals variance. Negative-binomial regression estimates an extra-dispersion parameter; it is often useful when heterogeneity creates variance greater than mean. Quasi-Poisson estimates a dispersion multiplier but lacks a full likelihood for standard AIC comparison. Zero-inflated models distinguish structural zeros from sampling zeros, but should be used only when a plausible two-process mechanism exists.

For proportions, use numerator and denominator to preserve precision: 20/100 and 200/1,000 are not equally precise even though both are 20%. A binomial model handles this automatically. Overdispersion can result from clustering or unmodeled heterogeneity; beta-binomial or quasi-binomial approaches can help. A continuity-corrected percentage series is not a substitute for modeling counts and denominators.

## Counts, rates, and overdispersion

For monthly counts, a Poisson model assumes conditional variance equals mean. Health counts often exhibit overdispersion from unmeasured heterogeneity, clustering, or outbreaks. Negative-binomial models add dispersion; quasi-Poisson adjusts variance but not likelihood. Include log population or person-time as offset when estimating rates. If denominator changes over time, reporting counts alone can mislead.

For a percentage or rate bounded between 0 and 1, normal regression may predict impossible values and misrepresent variance. Binomial models use numerator and denominator; beta regression may suit continuous proportions strictly between bounds. For sparse counts, zero inflation or hierarchical variation may be relevant, but additional model complexity should be supported by data.

## Forecasting versus intervention evaluation

Forecasting minimizes future prediction error and may use ARIMA, exponential smoothing, state-space models, or machine learning. Intervention evaluation seeks a contrast against a counterfactual; good forecast performance does not guarantee unbiased causal effect. Conversely, a causal ITS model may estimate intervention parameters without being the best forecasting model.

Validate forecasts using rolling-origin evaluation: train on past data, predict a future window, and repeat. Random train-test splitting leaks temporal structure. Report prediction intervals and compare with simple baselines such as last value or seasonal naive forecast. Forecast accuracy should be assessed at the horizon that matters operationally.

Forecast evaluation should match how the model will be used. If the hospital plans weekly staffing decisions, assess one- to four-week-ahead forecasts rather than annual error. Compare mean absolute error or root mean squared error with a seasonal-naive benchmark; percentage errors behave badly when counts approach zero. Assess interval coverage as well as point error, because underestimating uncertainty can lead to unsafe resource allocation.

Refit and update rules are part of the forecast model. A rolling window adapts to recent changes but may discard useful long-term structure; expanding windows preserve history but can lag after structural breaks. Define when the model is retrained and how performance drift triggers review. Do not use future revisions of data in historical backtests if those revisions would not have been available at the forecast date.

For intervention evaluation, forecasting a pre-period trend forward is one counterfactual strategy, not a causal proof. Forecasting methods optimized for prediction can absorb post-policy effects if trained on the whole series. Fit the counterfactual using pre-intervention data or an unaffected control, and evaluate assumptions separately from predictive accuracy.

## Diagnostics and sensitivity analysis

Inspect residuals for autocorrelation, changing variance, seasonality, outliers, and structural breaks. Durbin–Watson or Ljung–Box tests can flag residual dependence but have limited interpretation under fitted regression; use ACF plots and model context. Standard errors that ignore autocorrelation can be severely underestimated. HAC/Newey–West estimators may help for some regression settings, but small numbers of time points remain problematic.

Assess alternative trend forms, seasonal adjustment, intervention dates, lagged effects, and influential events. Report whether conclusions persist under plausible specifications. Avoid trying many trend models and selecting the one with the smallest intervention p-value. A preanalysis plan should identify primary form and sensitivity set.

For ITS, inspect pre-intervention fit, residual serial correlation, heteroskedasticity, and influential months such as strikes or extreme outbreaks. Plot observed values against the projected counterfactual with uncertainty, not only coefficient estimates. Use Newey–West/HAC standard errors with a justified lag when appropriate; these can be unreliable with few periods and do not correct a misspecified counterfactual. ARIMA-error regression explicitly models serial dependence but requires careful order selection.

Seasonality may be confounded with intervention timing if implementation occurs at the start of winter or respiratory season. Include seasonal terms and examine multiple years on both sides where possible. A single year before and after cannot distinguish an intervention from recurring annual cycles. Test robustness to alternative seasonal terms and exclude periods with known data-system disruptions only by prespecified rules.

Structural-break tests can identify unmodeled changes, but searching over break dates after seeing outcome data adds multiplicity and selection bias. If an unknown break is scientifically relevant, use methods designed for change-point detection and validate the break in independent data or a later period. Distinguish exploratory discovery of a break from confirmatory policy evaluation.

## Worked evaluation of an admission-rate shift

Suppose a city has 48 monthly asthma admission counts with population offsets. A new air-quality alert is introduced after month 24. Pre-policy rates decline by 0.2 admissions per 100,000 per month. Segmented regression estimates an immediate decline of 1.5 per 100,000 and a further decline of 0.1 per month, with AR(1) residual correlation 0.45. At 12 months, the fitted difference from the counterfactual is −1.5−1.2=−2.7 per 100,000, conditional on the model. Translate this to expected admissions using population size, with interval.

Before attributing the change to alerts, examine concurrent smoking restrictions, weather, coding changes, and changes in asthma prevalence. A control outcome such as admissions for a condition unlikely to respond to air-quality alerts can detect system-wide coding changes. A comparison city with similar pre-trends can help, but may experience different weather or policies. Report the causal interpretation as conditional on these design assumptions.

## Distributed lags and delayed response

Some exposures act over several periods rather than immediately. Distributed-lag models represent effects of exposure at current and previous times, such as temperature affecting admissions over several days. Correlated exposure histories create multicollinearity, so coefficients at each lag can be unstable. Constrain the lag-response shape with splines or summarize cumulative effect over a prespecified window. Choose the maximum lag from biology and prior evidence.

For interventions, delayed implementation can be represented through ramp functions, transition indicators, or distributed effects. Interpret cumulative changes rather than one coefficient when the policy effect accrues. Data-driven lag selection can produce overly optimistic intervals and should be treated as exploratory unless validated.

## Reporting a time-series analysis

Show the raw time series, intervention timing, denominator, missing periods, and fitted counterfactual. State the number and spacing of pre- and post-intervention observations, model terms for trend and seasonality, error distribution, autocorrelation method, and any comparison series. Give level and slope estimates with intervals and translate them to effects at relevant times. Document concurrent events and data-system changes.

For forecasting, report training period, forecast horizon, validation strategy, benchmark, error metric, and prediction-interval coverage. For intervention analyses, distinguish association from causal inference and state counterfactual assumptions. Avoid describing a visually sharp change as an intervention effect until seasonality, trend, denominator, autocorrelation, and competing events have been considered.

For an ITS with a single treated unit, report the counterfactual trajectory and uncertainty across the whole post-period, not just an immediate coefficient. A persistent slope change can produce a large long-term difference even when the immediate shift is near zero. Conversely, an abrupt level change may attenuate. Distinguish these mechanisms and their practical implications.

When implementation is staggered across regions, consider whether rollout timing supports a comparative design. Record actual adoption dates and implementation intensity rather than assuming the announced date represents exposure for every unit.

Store the exact data vintage because retrospective revisions can alter the apparent timing and magnitude of a trend break.

Describe whether final counts are provisional or mature at each time point.

Mark that status clearly in figures and forecast outputs.

## References and further reading

- Bernal JL, Cummins S, Gasparrini A. Interrupted time series regression for the evaluation of public health interventions: a tutorial. *Int J Epidemiol*. 2017;46:348–355. [doi:10.1093/ije/dyw098](https://doi.org/10.1093/ije/dyw098)
- Box GEP, Jenkins GM, Reinsel GC, Ljung GM. *Time Series Analysis: Forecasting and Control*. 5th ed. Wiley; 2015.
- Hyndman RJ, Athanasopoulos G. *Forecasting: Principles and Practice*. 3rd ed. [otexts.com/fpp3](https://otexts.com/fpp3/)
- Shadish WR, Cook TD, Campbell DT. *Experimental and Quasi-Experimental Designs for Generalized Causal Inference*. Houghton Mifflin; 2002.
- The [spatiotemporal analysis article](spatiotemporal-analysis.html) addresses spatial dependence alongside temporal structure.
