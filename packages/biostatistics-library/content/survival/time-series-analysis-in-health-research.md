---
title: Time-series analysis in health research
summary: Analyze measurements ordered in time while accounting for trend, seasonality, serial dependence and interventions.
---

## Overview and key ideas

A **time series** is a sequence of observations recorded in time order, often at regular intervals: daily emergency visits, weekly infection counts, monthly prescription rates, or hourly oxygen saturation. The order matters. Adjacent observations often resemble one another, so treating every day or week as an independent observation usually understates uncertainty.

Time-series analysis asks how an outcome evolves, what patterns recur, whether a defined intervention changes that evolution, or what values may occur next. Three components commonly appear: long-term **trend**, repeating **seasonality**, and short-term deviations or shocks. The remaining serial dependence is often called autocorrelation. A useful analysis states the time scale, outcome and target question before choosing a model.

This differs from survival analysis, which models time from an individual origin to an event while allowing censoring; see [Censoring and survival functions](censoring-and-survival-functions.html). It also differs from ordinary repeated-measures analysis, where the main aim is often to compare mean trajectories across people or treatment groups; see [Repeated-measures designs](repeated-measures-designs.html). Time series typically emphasize the evolving aggregate process and its dependence across adjacent times, though person-level repeated observations can themselves form a time series.

## When to use it

- Describe and forecast health-service demand or disease counts.
- Estimate whether a policy introduced on a known date changed an outcome's level or slope using an interrupted time series (ITS).
- Separate a recurring seasonal pattern from a longer-term trend.
- Monitor a process for unusual changes, with an explicitly chosen alert rule.

For causal evaluation, many observations before and after an intervention help define the underlying trajectory, but a comparison series or other design support is valuable because a concurrent event can mimic an intervention effect.

## Assumptions and limitations

- **Stable measurement and population:** changes in coding, case definitions, access, catchment population, or data completeness may look like health changes.
- **Serial dependence:** residuals from a model may remain autocorrelated. Ignoring this often makes standard errors too small. Model it or use an appropriate robust approach, and inspect residuals.
- **Seasonality and calendar effects:** respiratory illness, staffing and service use vary by day of week, holidays and seasons. Choose terms that reflect the calendar and available duration; a short series cannot reliably separate annual seasonality from trend.
- **Intervention timing and form:** basic segmented regression assumes a clearly timed intervention with an immediate level change, a slope change, or both. Gradual rollout, anticipation, multiple interruptions and delayed effects require explicit modeling.
- **Time-varying confounding:** a concurrent epidemic, policy, supply shortage or change in eligibility can confound an ITS. A controlled ITS can help if the comparison series is plausibly unaffected and shares relevant background trends.
- **Outcome distribution:** counts may need Poisson or negative-binomial models and an offset for population or person-time; overdispersion is common. Continuous outcomes may need transformations or errors with suitable variance.
- **Forecasts are conditional:** forecast intervals widen with horizon and do not account for unforeseen policy or epidemic shocks unless scenarios represent them.

## Worked example: a segmented ITS

Suppose a hospital introduces a sepsis-screening pathway at the start of month 25. Monthly sepsis-related deaths per 1,000 admissions are available for 24 months before and 24 after. A basic segmented model is

`Y_t = β0 + β1 time_t + β2 post_t + β3 time_after_t + seasonal_terms_t + ε_t`.

Here `β1` is the pre-intervention monthly trend; `β2` is the immediate change at implementation; and `β3` is the change in monthly trend after implementation. If the fitted immediate change is −0.8 deaths per 1,000 admissions (95% CI −1.3 to −0.3) and the post-period slope change is −0.05 per month (95% CI −0.10 to 0.00), the evidence is compatible with an immediate reduction and at most a modest further decline. The unit and uncertainty matter; a statistically nonzero coefficient does not establish that the pathway caused the change.

Before analysis, plot the raw series, check denominators and intervention timing, and decide whether the effect should be immediate, gradual, or delayed. Include seasonal terms where justified and account for serial correlation in residuals. A comparison hospital with a similar pre-intervention trend and no exposure to the pathway can strengthen the counterfactual, if its own changes and spillovers are understood.

## Interpretation and common pitfalls

- A correlation between two trending series can be spurious. Check trends, seasonality and plausible mechanisms before interpreting association.
- Do not equate a statistically significant ITS coefficient with a causal effect. Document co-interventions, changes in ascertainment and external shocks.
- Do not select a complex seasonal or autoregressive model solely because it fits the observed series. Check residual behavior and whether the model answers the prespecified question.
- Report the number and spacing of observations, missing intervals, outcome definition, denominator, intervention date, model terms, dependence handling and uncertainty.
- In forecasts, distinguish prediction intervals for future observations from confidence intervals for the mean trajectory.

## References and further reading

- Bernal JL, Cummins S, Gasparrini A. Interrupted time series regression for the evaluation of public health interventions: a tutorial. *Int J Epidemiol*. 2017;46:348–355. [doi:10.1093/ije/dyw098](https://doi.org/10.1093/ije/dyw098).
- Kontopantelis E, Doran T, Springate DA, Buchan I, Reeves D. Regression based quasi-experimental approach when randomisation is not an option: interrupted time series analysis. *BMJ*. 2015;350:h2750. [doi:10.1136/bmj.h2750](https://doi.org/10.1136/bmj.h2750).
- Box GEP, Jenkins GM, Reinsel GC, Ljung GM. *Time Series Analysis: Forecasting and Control*. 5th ed. Wiley; 2015.

*For correlated person-level trajectories, see [Mixed-effects models](mixed-effects-models.html) and [Generalized estimating equations](generalized-estimating-equations.html).*
