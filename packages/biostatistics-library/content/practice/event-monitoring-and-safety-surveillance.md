---
title: Event monitoring and safety surveillance
summary: Detect meaningful changes in health events or adverse outcomes over time while managing false alerts, delayed data and confirmatory investigation.
---

## Overview and key ideas

**Event monitoring** repeatedly examines incoming counts, rates, or reports to identify changes that may require action. It includes outbreak surveillance, post-market monitoring of medical products, hospital-acquired infection monitoring, and clinical quality measurement. Surveillance is a system of data collection, analysis, interpretation, and communication for action; an algorithm is only one component.

The target is usually a **signal**, not a causal conclusion. A signal is evidence that a process may have changed enough to warrant investigation. It may be caused by a real increase, random variation, changes in testing or reporting, altered denominators, coding revisions, or a data-feed problem. The alert must lead to case validation and contextual assessment before response.

An operational specification states: event definition; population and denominator; data source; reporting delay; expected baseline; monitored streams; look frequency; alert threshold; acceptable false-alert burden; and actions assigned to each alert. The target estimand may be an excess count, rate ratio, log-likelihood ratio for an increase, or time to detection under a specified alternative. These describe different properties of the system.

Aggregate event surveillance differs from [Clinical event prediction](clinical-event-prediction.html), which estimates individual probabilities, and from [Time-series analysis](../survival/time-series-analysis-in-health-research.html), which may evaluate a policy's effect or forecast a process. Surveillance prioritizes sequential detection, operational burden, and timely investigation.

## When to use it

- Detect possible increases in disease, injury, adverse outcomes, or device failures sooner than periodic reports.
- Monitor a clinical process against an expected range while accounting for volume and case mix.
- Compare event-based or indicator-based surveillance systems by sensitivity, timeliness, positive predictive value, and completeness.
- Monitor product safety when rapid evidence accumulation is needed, with a confirmatory pathway and appropriate comparison design.

## Statistical foundations and design choices

### Baselines and denominators

For independent counts with expected value `μ_t`, a Poisson model gives `P(Y_t=y)=exp(-μ_t)μ_t^y/y!`. If expected burden varies with person-time or procedures, model a rate and include exposure volume as an offset: `log(μ_t)=log(E_t)+x_t'β`. Estimate seasonality and day-of-week patterns using suitable historical periods, and avoid training a baseline that includes the outbreak one is trying to detect. Historical baselines can become stale after population, coding, or care changes; document when and how they are recalibrated.

Underdispersion or overdispersion, serial correlation, and clustering alter false-alert behavior. A Poisson chart applied to overdispersed data may alert too often. Negative-binomial models, quasi-likelihood, random effects, or empirically calibrated limits may be needed. Model adjustment should not obscure operationally important changes in data quality.

### Repeated looks and alert burden

A one-time 5% test has a 5% false-positive probability under its null assumptions. Repeating the test every day does not preserve an overall 5% false-alarm probability. Sequential methods are built to control or characterize evidence accumulation over repeated looks, often under a defined null and alternative. Even then, monitoring many event types, hospitals, and subgroups creates a larger system-level false-alert burden. Report false alerts per stream and per time period, not only a per-test p-value.

The acceptable trade-off depends on response capacity and event severity. A low threshold can detect small increases quickly but overwhelms investigators. A high threshold reduces workload and delays or misses subtle increases. Evaluate the full operating characteristic over plausible event sizes and onset times, rather than choosing a limit because it “looks right” on one chart.

### Control charts and sequential methods

- **Shewhart charts** compare a current point with control limits; they are sensitive to large abrupt changes, less so to modest persistent shifts.
- **CUSUM** accumulates evidence of a shift. A one-sided CUSUM can be written `C_t=max(0,C_(t-1)+X_t−k)` and signals when `C_t>h`; reference value `k` and limit `h` determine shift sensitivity and false alarms.
- **EWMA** weights recent data more heavily: `Z_t=λX_t+(1−λ)Z_(t−1)`. Smaller `λ` smooths noise and detects sustained shifts; limits depend on variance and initialization.
- **Sequential likelihood ratio methods** compare hypotheses over time and can control type-I error under specified sampling assumptions.
- **Scan statistics** search for clusters across space and time. Their calibration must account for the windows searched and dependence between windows.

For sparse counts, normal-theory control limits may be inappropriate. Use count models, exact or simulation-calibrated limits, and review the impact of overdispersion and serial correlation. Statistical process control often distinguishes a stable process from common-cause variation; public-health outbreak detection additionally considers risk, exposure, and action consequences.

### Medical-product safety and spontaneous reports

Spontaneous reports can identify unusual combinations of products and events, but reporting is selective, stimulated by publicity, incomplete, and often lacks denominators. Disproportionality measures (such as reporting odds ratios) compare reporting proportions and are signal-detection tools; they do not estimate incidence or causal risk. Confounding by indication, concomitant drugs, and differential reporting require clinical review and stronger designs. Active surveillance using linked health records can estimate rates more directly, but still needs a defined risk window, comparator, outcome validation, and confounding control.

## Assumptions and limitations

- **Stable event definition and ascertainment:** diagnostic criteria, test access, coding, care seeking, and reporting completeness may change.
- **Valid denominator:** counts should be interpreted relative to population, person-time, procedures, or exposure where appropriate.
- **Baseline fit:** seasonal patterns, weekday effects, geographic variation, and long-term trends must be represented. A baseline contaminated by past outbreaks may normalize unusual burden.
- **Repeated and correlated monitoring:** multiple streams and sequential looks increase alert opportunities; serial correlation changes nominal limits.
- **Delayed and revised data:** late reports can make the current week look artificially low, then create a false jump after backfill. Distinguish provisional from mature data and estimate delay distributions where useful.
- **Alert-to-action system:** a statistical signal is useful only if investigators can validate cases, assess context, and act. Alert fatigue reduces practical sensitivity.
- **No causal inference from a signal:** observed disproportionality or count increases are not causal estimates.
- **Threshold transportability:** changes in population, workflow, or data systems can degrade historical alert performance; recalibration needs its own evaluation.

## Worked example: weekly respiratory-event monitoring

A regional network expects 120 emergency visits weekly for a syndrome after adjustment for season, holidays, and reporting completeness. It observes 165 visits. A crude Poisson check gives standard deviation `sqrt(120)=10.95`; 165 is approximately `(165−120)/10.95=4.11` standard deviations above expectation. That is a potentially notable signal under a simple fixed-mean Poisson model, but the calculation ignores estimation uncertainty, overdispersion, temporal dependence, and the fact that many streams may be monitored. It is not a final alert rule.

A CUSUM example illustrates sequential accumulation. Suppose weekly counts are standardized residuals `X_t=(Y_t−μ_t)/sqrt(μ_t)` and an increase of roughly one standard deviation is the target; set reference `k=0.5`. If sequential standardized residuals are 0.2, 0.9, 1.1, then `C_1=max(0,0+0.2−0.5)=0`; `C_2=0.4`; `C_3=1.0`. Whether 1.0 triggers depends on a prespecified threshold `h` calibrated to the desired false-alert rate and data structure. The example shows accumulation, not a universal threshold.

Illustrative R code for a transparent EWMA chart:

```r
# counts and expected are vectors in chronological order.
lambda <- 0.2
z <- numeric(length(counts))
z[1] <- counts[1] - expected[1]
for (t in 2:length(counts)) {
  residual <- counts[t] - expected[t]
  z[t] <- lambda * residual + (1 - lambda) * z[t - 1]
}

# Under independent homoscedastic normal errors with variance sigma2,
# steady-state EWMA SD is approximately sigma*sqrt(lambda/(2-lambda)).
# For counts, calibrate limits by an appropriate count model or simulation.
```

In production, simulate under a fitted baseline and plausible alternatives to estimate false alerts per year, probability of detection, and median detection delay. Validate events after alerts, record non-alerted outbreak onsets where known, and track data completeness. An outbreak signal should trigger an epidemiologic review of location, laboratory results, exposure histories, severity, and data quality. A medical-product signal should trigger case validation and a prespecified confirmatory analysis, not an immediate claim of harm.

## Interpretation and common pitfalls

- Publish event definition, baseline period, denominator, look frequency, thresholds, stream count, and alert-handling procedure.
- Report sensitivity, false alerts per unit time, positive predictive value, detection delay, and reporting completeness with uncertainty.
- Do not select thresholds solely for historical fit; evaluate under simulated shifts and expected operational workload.
- Do not repeatedly tune a threshold after seeing alerts without recording the change and recalibrating performance.
- Separate provisional signals from validated cases and confirmed causal evidence.
- A count increase may reflect volume growth; present counts, rates, denominators, and reporting maturity together.
- For spontaneous reports, avoid incidence language unless an appropriate denominator and design support it.
- Monitor subgroup and geographic alerts without creating an unmanageable number of comparisons or exposing identifiable cases.

## Evaluating a surveillance system

Algorithm performance and system performance are different. The system begins with event recognition and reporting and ends with investigation and action. Useful indicators include sensitivity to events of public-health importance, positive predictive value of alerts, timeliness from onset to detection, completeness, representativeness, data quality, stability, and acceptability to reporters. A highly sensitive algorithm can perform poorly if the data arrive too late; a prompt alert can have little value if no team can investigate it.

Sensitivity is difficult to estimate because the complete set of true outbreaks or adverse events is unknown. Use multiple sources, retrospective case review, known historical events, and simulation, while stating limitations. Positive predictive value depends on event prevalence: even a seemingly specific alert can produce mostly false alerts when the target event is rare. Report the number of alerts and verified events, not only a percentage. Detection delay should be measured from a defensible event onset, and data maturity should be considered because apparent delay can result from late reporting.

### Simulation-based calibration

A practical calibration design defines a baseline process, then simulates sequences under (a) no change and (b) relevant alternatives: abrupt increases, gradual rises, seasonal onset, changes in denominator, and reporting delays. For each simulated sequence, apply the complete pipeline, including baseline estimation, repeated looks, data revisions, and alert suppression rules. Summarize the probability of at least one false signal over a year, alerts per stream, probability of detecting an event of each size, and median delay. Simulation is only as credible as its assumptions, so vary baseline dispersion, autocorrelation, and event onset patterns.

Illustrative code for a simple Poisson CUSUM makes the reset logic explicit:

```r
cusum <- function(y, expected, k = 0.5, h = 5) {
  stopifnot(length(y) == length(expected), all(expected > 0))
  # Standardized residuals shown for teaching; real count CUSUMs can
  # accumulate log-likelihood ratios for a prespecified rate increase.
  x <- (y - expected) / sqrt(expected)
  cval <- numeric(length(x))
  alarm <- logical(length(x))
  for (i in seq_along(x)) {
    prev <- if (i == 1) 0 else cval[i - 1]
    cval[i] <- max(0, prev + x[i] - k)
    alarm[i] <- cval[i] > h
  }
  data.frame(cusum = cval, alarm = alarm)
}
```

A production system should calibrate `h` to its chosen false-alarm target, accommodate estimated expected counts, and assess the impact of resetting after an alert. Resetting can hide continued elevation; not resetting can keep the system in alarm. Define the post-alert review and reset policy before operation.

### Safety signal workflow

For a product safety signal, distinguish signal generation, validation of cases, clinical assessment, analytic follow-up, and regulatory or clinical action. A disproportionality statistic can prioritize review, but case narratives and exposure timing matter. Active-comparator, new-user cohort designs can reduce some confounding by indication; self-controlled designs may control time-invariant individual characteristics but require assumptions about event-dependent exposure, time trends, and risk windows. A signal should motivate a design suited to the causal question rather than be presented as the result of that design.

## Governance and operational evaluation

Before launch, assign ownership for baseline approval, alert review, data-quality escalation, event confirmation, and public communication. Define an alert's severity categories and response times. Log each signal, including whether it was investigated, verified, dismissed, or led to action. This audit trail supports estimates of predictive value and identifies operational bottlenecks. Review false alerts constructively: a signal can be statistically false yet reveal an emerging data-quality problem.

Set a regular review schedule for the event definition, expected rates, thresholds, and data feed. Recalibration should use stable data that are not dominated by an unresolved event. Preserve the previous algorithm version and evaluate changes prospectively or in replay data. If reporting or case definitions change, mark the discontinuity and communicate it to analysts and decision-makers.

A surveillance dashboard should communicate status without implying certainty. Show expected and observed counts or rates, data completeness, whether data are provisional, and the rule that generated an alert. Avoid red/green status alone. The investigator needs context to distinguish a signal of disease from a signal of changed reporting. For rare severe outcomes, even one validated event can warrant review regardless of a statistical threshold; statistical monitoring should complement clinical judgment rather than block it.

## Choosing a statistical signal measure

An alert measure should match the alternative of interest. A one-sided count limit is easy to explain for an abrupt increase; a likelihood ratio can target a defined rate ratio and accumulate evidence efficiently when that alternative is plausible. A scan statistic is useful when event location and timing are unknown, but search flexibility increases calibration needs. For continuous measurements, Shewhart, EWMA, or CUSUM charts target different shift shapes. Select the measure before seeing the monitoring period and document why the alternative is operationally meaningful.

Power should be described as a function of both event size and delay from onset. “Detects an outbreak” is too vague: a method might detect a doubling rapidly but miss a 10% rise for months. Simulations should vary onset week, season, denominator, reporting lag, and baseline uncertainty. Summaries can include median delay among detected events and probability of detection within a fixed action window; failures to detect should not be omitted from delay summaries.

## Distinguishing safety monitoring from trial interim analysis

Ongoing population surveillance is not automatically equivalent to interim analysis in a randomized trial. A trial's repeated efficacy or harm looks can affect type-I error and participant safety, so monitoring plans may use alpha-spending, group-sequential boundaries, or a data-monitoring committee with access to unblinded data. Routine hospital dashboards and public-health surveillance often use alert rules calibrated to operational false-alarm rates instead. The monitoring purpose, decision authority, and consequences of a signal determine the design. Reusing a trial stopping boundary in an operational dashboard, or treating a dashboard alert as trial evidence, can misstate what the threshold means.

Monitoring outcomes after an intervention begins may also be affected by the response itself. An alert can trigger testing, isolation, or treatment, changing later counts. Preserve timestamps for signal, investigation, and action; analyses that ignore response timing can confuse the untreated process with the managed process. Evaluation should distinguish detection performance before action from outcomes after response.

## Data latency and nowcasting

Current counts are right-truncated: recent events have had less time to be reported than earlier events. A naive chart may therefore show an apparent decline at the series end, followed by a surge as reports arrive. Estimate the reporting-delay distribution from event and report dates, and nowcast the recent total when the delay process is sufficiently stable. Display nowcast uncertainty and retain finalized values for retrospective evaluation. If reporting delay changes during an outbreak or after a system upgrade, a historical delay model may fail; monitor completeness by event date and communicate provisional status clearly.

## Balancing sensitivity with investigation capacity

The best alert rate depends on team capacity. If every alert requires a costly site visit, prioritize specificity and tier signals so low-cost review precedes intensive investigation. If the event is catastrophic and intervention is low risk, a lower statistical threshold may be justified. Track workload as person-hours per verified event and time from alert to review, alongside sensitivity. A technically sensitive system that leaves alerts unreviewed is not operationally sensitive. Reassess thresholds when staffing, data volume, or the response pathway changes.

For every monitoring program, preserve both the real-time view and the finalized historical series. This enables fair retrospective evaluation of false alarms and detection delay while retaining the information actually available to decision-makers at the time. Never evaluate a real-time alert system solely on revised data that were unavailable when an alert could have been issued.

## Documentation for alerts and investigations

An alert log should retain the date and time the signal became available, the algorithm version, the data snapshot, threshold crossed, reviewer, investigation findings, and action. This makes the system auditable and supports later measurement of timeliness. Record why an alert was dismissed, since recurrent dismissals may indicate an overly noisy threshold, a poor event definition, or inadequate clinical context. Review a sample of non-alert periods as well as alerts to estimate missed-event patterns; investigating only flagged records cannot characterize sensitivity.

If the event has strong seasonal cycles, include complete seasonal periods in baseline development when possible and assess whether exceptional holidays or disruptions need separate treatment. A baseline extrapolated from one unusual year may poorly represent ordinary variation, so show the historical data used and uncertainty in expected counts.

## References and further reading

- CDC. [Principles of Epidemiology: Public Health Surveillance](https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson5/section1.html).
- CDC. [Lexicon, definitions, and conceptual framework for public health surveillance](https://www.cdc.gov/mmwr/preview/mmwrhtml/su6103a3.htm). *MMWR*. 2012.
- Crawley AW, Mercy K, Shivji S, et al. An indicator framework for the monitoring and evaluation of event-based surveillance systems. *Lancet Glob Health*. 2024;12:e707–e711. [doi:10.1016/S2214-109X(24)00034-2](https://doi.org/10.1016/S2214-109X(24)00034-2).
- Fricker RD Jr. *Introduction to Statistical Methods for Biosurveillance*. Cambridge University Press; 2013. [doi:10.1017/CBO9781139014096](https://doi.org/10.1017/CBO9781139014096).
- Woodall WH. The use of control charts in health-care and public-health surveillance. *J Qual Technol*. 2006;38:89–104. [doi:10.1080/00224065.2006.11918630](https://doi.org/10.1080/00224065.2006.11918630).
- Rogerson PA, Yamada I. *Statistical Detection and Surveillance of Geographic Clusters*. 2nd ed. CRC Press; 2020.

*Interrupted time-series designs are one approach to evaluating interventions that may change aggregate health trends.*
