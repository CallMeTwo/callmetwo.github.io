---
title: Event monitoring and safety surveillance
summary: Detect meaningful changes in health events or adverse outcomes over time while managing false alerts, delayed data and confirmatory investigation.
---

## Overview and key ideas

**Event monitoring** repeatedly examines incoming counts, rates or reports to identify possible changes that may need action. It includes public-health surveillance for outbreaks, monitoring adverse events after a medical product is introduced, and ongoing quality monitoring in a health system. Surveillance describes systematic data collection, interpretation and communication for action; an alert algorithm is only one component of that system.

The objective is early detection under uncertainty. A signal means the data warrant review; it does not establish that an exposure caused an event. A useful system defines the event, population, reporting process, baseline, monitoring frequency, alert threshold, and who will verify and act on an alert.

This is different from **individual risk prediction**. Surveillance asks whether an aggregate process or event rate has changed; prediction estimates a particular person's probability of an outcome over a defined horizon. See [Clinical event prediction](clinical-event-prediction.html).

## When to use it

- Detect an increase in disease, injury, or adverse-event counts earlier than routine periodic summaries.
- Monitor a clinical process against an expected range, such as infection rates or device failures.
- Evaluate the performance of an event-based or indicator-based surveillance system, including timeliness, sensitivity and positive predictive value of alerts.

## Assumptions and limitations

- **Stable reporting process:** changes in test availability, definitions, care seeking, reporting completeness, or coding may generate apparent signals.
- **Expected counts must fit context:** baseline rates can vary by season, day of week, geography, age, exposure volume and recent outbreaks. Adjust expected counts for relevant denominators and known patterns.
- **Repeated looks create false alarms:** examining data continuously increases the chance of at least one random alert. Thresholds must be calibrated for monitoring frequency, number of streams and acceptable false-alert burden.
- **Detection trade-offs:** stricter thresholds reduce false alarms but may delay detection or miss modest increases. Assess delay and sensitivity under plausible outbreak scenarios, not just historical fit.
- **Dependence and clustering:** serial correlation, spatial spillover and multiple related streams affect calibration. A method designed for independent normal observations may be unsuitable for sparse Poisson counts.
- **Data delay and revision:** reports arrive late and may be backfilled. Use nowcasting or delay adjustment where appropriate; distinguish provisional from finalized counts.
- **A signal is not a causal conclusion:** clinical review, epidemiologic investigation, and sometimes confirmatory testing are needed before response.

## Approaches and worked example

Common methods include Shewhart control charts for relatively abrupt large changes, exponentially weighted moving average (EWMA) charts for persistent modest shifts, and cumulative sum (CUSUM) charts that accumulate evidence over time. For count data, Poisson or negative-binomial models can account for changing expected volumes, with control limits or sequential likelihood methods built around the expected rate. Event-based surveillance also uses structured triage of unstructured reports; statistical thresholds alone cannot assess credibility or public-health importance.

Suppose a regional network monitors weekly emergency visits for a respiratory syndrome. The expected count is 120 visits per week, adjusted for season, holidays and reporting completeness. If this week's count is 165, a naive alert at “more than 120” would fire frequently even under ordinary random variation. Instead, the network can predefine a count model and alert rule, evaluate its false-alert rate against historical data and simulated increases, and route a signal to an epidemiologist for assessment of location, laboratory findings, data quality and severity.

For a medical product safety system, a sequential comparison may monitor exposed and comparator person-time for a prespecified adverse event while controlling the sequential error rate. The comparison group, risk window, event validation and confounding adjustment matter as much as the signal statistic. Signals should be followed by clinical case review and appropriately designed confirmatory studies.

## Interpretation and common pitfalls

- Publish the alert definition, baseline period, denominator, monitoring cadence and alert handling process before relying on it.
- Report operational performance: sensitivity, false alerts per period or stream, detection delay, positive predictive value and completeness/timeliness of data, with uncertainty.
- Repeatedly changing thresholds after seeing signals undermines interpretability. If a system is recalibrated, document the change and evaluate the revised operating characteristics.
- Do not confuse a count increase with a rate increase when population size or exposure volume has changed.
- Avoid “alert fatigue” by routing alerts to people who can investigate and by tracking whether actions followed and whether the signal was verified.
- In comparative safety surveillance, a disproportional reporting ratio or spontaneous-report signal cannot estimate incidence without an appropriate denominator and design.

## References and further reading

- CDC. [Principles of Epidemiology: Public Health Surveillance](https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson5/section1.html).
- CDC. [Lexicon, definitions, and conceptual framework for public health surveillance](https://www.cdc.gov/mmwr/preview/mmwrhtml/su6103a3.htm). *MMWR*. 2012.
- Crawley AW, Mercy K, Shivji S, et al. An indicator framework for the monitoring and evaluation of event-based surveillance systems. *Lancet Glob Health*. 2024;12:e707–e711. [doi:10.1016/S2214-109X(24)00034-2](https://doi.org/10.1016/S2214-109X(24)00034-2).
- Fricker RD Jr. *Introduction to Statistical Methods for Biosurveillance*. Cambridge University Press; 2013. [doi:10.1017/CBO9781139014096](https://doi.org/10.1017/CBO9781139014096).

*Interrupted time-series designs are one approach to evaluating interventions that may change aggregate health trends.*
