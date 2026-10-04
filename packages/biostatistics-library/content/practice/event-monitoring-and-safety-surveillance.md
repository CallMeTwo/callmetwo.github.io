---
title: Event monitoring and safety surveillance
summary: Design ongoing monitoring systems that detect unusual event patterns while accounting for exposure, reporting delays, false alarms, and follow-up investigation.
---

## Overview

Safety surveillance is a repeated process of collecting reports, estimating event rates, identifying unusual patterns, and investigating signals. It differs from a one-time hypothesis test because observations arrive over time, exposure changes, data are delayed, and decisions may be triggered by alerts. A statistical signal is a prompt for review, not proof that an intervention caused harm.

The monitoring plan should define the event, population at risk, exposure denominator, time unit, alert purpose, and action after an alert. “Monitor adverse events” is not operational enough. A vaccine program might monitor anaphylaxis per administered dose during the first 48 hours; an inpatient system might monitor central-line infections per 1,000 line-days by unit and month. The denominator and latency shape what the signal means.

## Design the surveillance question

Specify whether surveillance is passive (reports arise through routine systems), active (participants or records are followed systematically), or triggered by a specific exposure. Passive reporting often has under-reporting and stimulated-reporting bias: publicity or a warning can increase reporting even when true incidence is unchanged. Active surveillance improves case ascertainment but costs more and can still miss events.

Define case criteria before counting. Distinguish confirmed, probable, and possible events, and preserve adjudication status. Ensure the event window follows plausible biology and is not chosen after inspecting peaks. Record exposure dates, person-time, time-varying risk factors, and competing events where relevant. Linkage errors, duplicates, and changes in coding should be monitored because they can mimic changes in incidence.

Surveillance aims differ. Signal detection prioritizes sensitivity and rapid review; estimating incidence prioritizes valid denominators and ascertainment; evaluating an intervention requires a causal comparison and control for secular trends. A control chart can detect process change without attributing it to a policy. A causal interrupted time series or comparative design requires stronger assumptions than alerting.

## Rates and expected counts

For rare events, a Poisson model is a useful starting point. If 40,000 doses are administered and the background event rate is 2 per 10,000 doses, the expected count is 8. Suppose 15 events are observed. Under a fixed Poisson mean of 8, the upper-tail probability (P(Y\ge15\mid\lambda=8)) is about 0.04. That may merit review, but it is not a causal probability: the background rate may be uncertain, reporting may have changed, and many event types or windows may be monitored.

```r
observed <- 15
expected <- 8
ppois(observed - 1, lambda = expected, lower.tail = FALSE)
```

This calculation assumes a known stable expected rate and independent event counts. If the baseline rate is estimated, its uncertainty should be included; treating it as fixed can make alerts too frequent. For recurrent events or overdispersed counts, a negative-binomial model or empirical baseline may be more appropriate. The exact model should reflect the operational decision, not be selected solely to yield a convenient threshold.

An observed-to-expected ratio is 15/8=1.875. Its magnitude may be clinically concerning, but an interval is also needed. Under a simple Poisson assumption, a confidence interval for the observed count can be translated to a standardized ratio. With sparse events, exact or profile-likelihood intervals are often preferable to a normal approximation. Report numerator, denominator, expected count, rate ratio, interval, and case review status together.

## Choosing a sequential signal method

Shewhart charts flag a point beyond control limits, often useful for large abrupt changes. CUSUM accumulates smaller deviations over time and can detect persistent shifts sooner. Exponentially weighted moving average charts smooth recent data while retaining memory of earlier observations. A Poisson CUSUM can accumulate evidence for an incidence-rate increase; a likelihood-ratio sequential probability ratio test formalizes competing rate hypotheses. Each requires choices about baseline, target shift, false-alarm rate, and reset behavior.

Suppose a hospital wants to detect a sustained doubling of a rare infection rate while limiting false alarms. A CUSUM can be tuned to have a stated in-control average run length, the expected number of monitoring periods before a false signal under baseline conditions. An average run length of 200 weeks does not mean every alarm arrives after 200 weeks; some occur early and many later. Simulate operating characteristics across realistic baseline variation and autocorrelation before deployment.

Repeatedly testing each weekly count at p<0.05 produces far more than a 5% lifetime false-alarm risk. Sequential methods calibrate repeated monitoring under a specified process, while multiplicity also arises across many units, outcomes, and subgroup scans. The threshold should reflect the tolerance for missed signals, investigation capacity, and consequences of false alerts. No universal p-value threshold works for every surveillance program.

### Fixed thresholds, control limits, and changing baselines

A Shewhart chart is easy to explain because each point is compared with limits, but it can miss a modest sustained rise. CUSUM adds evidence across periods. The standard one-sided CUSUM for a process mean can be written (C_t=\max(0,C_{t-1}+X_t-k)), where (k) is a reference value representing the shift one wants to detect; an alarm occurs when (C_t>h). For counts, use a likelihood-ratio increment comparing target elevated and baseline rates rather than applying this Gaussian form blindly.

Control limits assume a stable in-control process. Seasonality, secular trends, changing denominators, and autocorrelation can produce apparent signals. Model expected counts with calendar time, season, site, and exposure as needed, but guard against overfitting away the signal of interest. Baseline periods should exclude known outbreaks or major coding transitions, and updating rules should be explicit. A rolling baseline that continually incorporates recent counts can absorb a genuine persistent increase.

Overdispersion occurs when counts vary more than a Poisson model predicts, often because of heterogeneity among sites or individuals. A negative-binomial or hierarchical Poisson model can represent extra variation. For a clinic system, partially pooled site-specific rates can stabilize sparse estimates; however, a new site with unusual case mix may still be poorly predicted. Use posterior predictive checks or residual diagnostics to assess baseline fit and simulate false-alarm behavior under the fitted process.

### Sequential evidence and Bayesian monitoring

Bayesian monitoring can update the posterior rate ratio as exposure and outcomes accumulate. A rule might alert if the posterior probability that the rate ratio exceeds 1.5 is above 0.95. This probability is conditional on prior and likelihood assumptions; the operating characteristics depend on both. Simulate alert frequency under no increase, under clinically relevant increases, and under reporting delays before deploying the rule. A posterior threshold does not eliminate false alerts.

Frequentist sequential probability ratio tests compare likelihoods under a baseline rate and an elevated rate, with stopping boundaries chosen for false-positive and false-negative tolerances. They are efficient for a prespecified pair of hypotheses but less direct when rates vary continuously. For multiple possible adverse outcomes, hierarchical shrinkage can reduce noisy extremes, but may also delay a genuine rare signal. The surveillance objective should determine whether speed, sensitivity, or specificity has priority.

## Worked example: rare event after a new product

Assume 50,000 people receive a new product and a serious neurologic event is expected at background rate 1 per 10,000 person-weeks during a prespecified 2-week risk window. Expected events are (50{,}000\times2/10{,}000=10), if person-weeks and the rate definition align. If 19 events are reported, the observed-to-expected ratio is 1.9. The Poisson upper-tail probability under a fixed mean of 10 is `ppois(18, 10, lower.tail=FALSE)`, approximately 0.03.

This is an alert for investigation, not a conclusion of causation. Check whether all 50,000 people completed the two-week window, whether reports were equally complete before and after rollout, whether case definitions match, and whether events cluster by site or calendar time. Verify duplicates and dates; review medical records using blinded adjudication if feasible. Compare observed characteristics and alternative risk windows only as prespecified or clearly exploratory analyses.

If background rate itself is estimated from an external source with uncertainty, integrate that uncertainty or use a hierarchical model rather than plugging in one value. If many outcomes are screened, a 0.03 tail probability will arise somewhere by chance. Use a transparent prioritization system that considers severity, biological plausibility, exposure timing, data quality, and independent evidence. A safety committee should document its interpretation and actions.

## Data latency, reporting, and nowcasting

Recent counts are often incomplete because reports arrive late. A naive chart may show an artificial decline at the end of the series. Track report delay from event occurrence to receipt and estimate completeness by event date. Nowcasting can adjust recent counts using historical delay distributions, but it depends on delays being sufficiently stable. Show uncertainty bands and mark provisional periods clearly.

Reporting propensity can change after media coverage, label changes, or active solicitation. Include reporting channel and calendar time; compare stable sources where possible. A rise in spontaneous reports may reflect heightened awareness rather than higher event incidence. Conversely, passive systems can miss true increases because under-reporting persists. Surveillance counts should not be called incidence unless numerator ascertainment and population-time denominators support that interpretation.

Case validation is essential. Automated code-based definitions can be sensitive but poorly specific; chart review improves classification but may be delayed. Monitor positive predictive value of the case algorithm over time. If coding practice changes, recalibrate the baseline or stratify by source. Preserve the original report and adjudication decision for audit.

The denominator needs equal scrutiny. Dose counts may include cancelled administrations; person-time may be counted after a participant is no longer at risk; device-days may be unavailable for some units. Align event window and exposure window precisely. A rate per enrolled participant can be misleading when follow-up differs; person-time or a fixed-horizon risk may be better. If exposure is time-varying, the risk set must update as people initiate, discontinue, or switch.

Active surveillance can use scheduled follow-up, electronic health records, claims, registries, or laboratory feeds. Each source has different delays, coverage, and misclassification. Linkage sensitivity and specificity should be assessed when possible. When source completeness changes over calendar time, adjust for ascertainment or stratify the analysis. Sudden expansion of a database can increase events and denominator simultaneously; inspect both before interpreting a rate ratio.

## Confounding and causal follow-up

An alert after an intervention can coincide with changes in population, season, diagnostic testing, or healthcare use. Before making a causal claim, define the target trial or comparison and assess confounding. Self-controlled designs compare risk and control windows within an individual but require assumptions about event-independent exposure timing, time trends, and event effects on future exposure. Cohort studies need measured confounder control and adequate overlap. Interrupted time series need a credible counterfactual trend and attention to concurrent events.

The surveillance signal and confirmatory causal analysis can be separated. A fast, sensitive alert may use broad definitions; a later analysis may use adjudicated cases and a prespecified design. Avoid using the same data to discover a signal and then report an unadjusted confirmatory p-value. If follow-up data are used for both, account for selection and repeated testing or seek independent replication.

Self-controlled case series and case-crossover designs can control time-invariant individual confounding, but they are not assumption-free. The case-series design generally requires event occurrence not to alter subsequent exposure observation or risk periods in a way that creates bias; event-dependent exposure and competing death need special handling. Case-crossover designs require transient exposure and appropriate control windows, and can be biased by time trends in exposure. State these requirements and perform sensitivity analyses around risk-window definitions.

Active comparators and negative controls can help identify residual bias. A negative-control outcome should share confounding or measurement processes but lack a plausible causal pathway from exposure. A negative-control exposure should share outcome confounding but not affect the outcome. Their null results do not prove absence of bias, but non-null findings can reveal problems. Use them as diagnostics in a causal analysis, not as decorative extra p-values.

## Operational response and escalation

Every alert should have a defined owner, review timeline, and escalation pathway. A useful workflow records the triggering statistic, data vintage, threshold, cases reviewed, quality issues, and rationale for action or no action. Actions can include enhanced case finding, temporary label review, clinical guidance, or further epidemiologic study. The alert itself should not automatically trigger a policy change unless that action is explicitly justified by the risk-management plan.

Investigation capacity is part of statistical design. If a system generates dozens of low-value alerts each week, reviewers may ignore the important one. Prioritize signals using severity, expected harm, actionability, and data confidence. Use different thresholds for triage and formal escalation if appropriate, and evaluate the consequences of each. Review false alerts and missed events to improve the system.

Before adopting a threshold, simulate it under a baseline process. For example, generate 10,000 Poisson sequences with mean 8 per period, apply the full alert rule, and estimate the proportion that alarm at least once over 52 periods. Repeat under means 10, 12, and 16 to estimate detection probability and delay. Include overdispersion, seasonality, incomplete recent reporting, and site heterogeneity when these occur in practice. Report uncertainty in these operating characteristics; Monte Carlo simulation itself has error.

An alert should trigger a sequence of review steps rather than an unstructured reaction: verify source data and denominator, confirm case definition, assess temporal and geographic clustering, seek alternative explanations, and evaluate clinical plausibility. Record the evidence at each step. If an urgent hazard is plausible, action may be warranted before causal certainty; the threshold for precautionary action can differ from the threshold for claiming a causal association.

Independent clinical adjudication can reduce confirmation bias. Reviewers may be blinded to exposure or whether a case came from an alert where feasible. At minimum, use standardized criteria and record disagreements. A monitoring committee should have predefined authority, access to unblinded information where appropriate, and a process for communicating urgent concerns without compromising ongoing studies.

## Evaluating a surveillance system

Assess timeliness, completeness, sensitivity, positive predictive value, representativeness, stability, and usefulness. Sensitivity may be estimated by comparing surveillance detections with an independent case source; positive predictive value requires adjudicating a sample of alerts. Evaluate performance across sites and groups because under-ascertainment may differ. Document how long an event takes to appear and what proportion of expected data is available at each update.

Monitor statistical calibration: do alert rates under stable conditions match the designed false-alarm frequency? Changes in overdispersion or autocorrelation can invalidate nominal limits. Re-estimate baselines carefully, using a holdout period or robust methods so a true emerging increase is not absorbed into the new baseline. Version every threshold and baseline update, and retain the history of alarms.

| Monitoring output | What it can establish | What still requires review |
| --- | --- | --- |
| Count above a control limit | Unusual relative to a modeled baseline | Data quality, cause, and clinical relevance |
| Elevated observed-to-expected ratio | More events than the chosen expectation | Baseline uncertainty and confounding |
| Cluster of reports by time or site | Pattern worth prioritizing | Whether ascertainment or exposure differs |
| Adjudicated case series | Events meet defined clinical criteria | Counterfactual risk and causal attribution |

An evaluation should also estimate positive predictive value: among alerts, what fraction lead to a confirmed safety issue or actionable investigation? Sensitivity is harder because undetected signals are unknown; use independent registries, chart review samples, or retrospective known events to approximate it. Report the reference standard and ascertainment limitations. A system that detects many events but cannot distinguish risk from reporting artifacts may be poorly suited to decision-making.

Stakeholders should know whether an alert is provisional, whether rates are adjusted or crude, and which denominator is used. Present raw counts beside standardized measures and include uncertainty. A one-line “signal detected” label without the underlying data can encourage overinterpretation and undermine trust when later review changes the conclusion.

Surveillance conclusions should be updated as evidence accumulates. Preserve earlier assessments and explain what new cases, adjudication, or comparison data changed the interpretation. A correction is part of responsible monitoring, not a failure of the statistical system.

Record the date and data vintage for every formal signal review.

Use the same case definition across review cycles where possible.

## References and further reading

- Farrington CP, Andrews NJ, Beale AD, Catchpole MA. A statistical algorithm for the early detection of outbreaks of infectious disease. *JRSS A*. 1996;159:547–563. [doi:10.2307/2983331](https://doi.org/10.2307/2983331)
- Kulldorff M. A spatial scan statistic. *Communications in Statistics—Theory and Methods*. 1997;26:1481–1496. [doi:10.1080/03610929708831995](https://doi.org/10.1080/03610929708831995)
- Evans SJW, Waller PC, Davis S. Use of proportional reporting ratios (PRRs) for signal generation from spontaneous adverse drug reaction reports. *Pharmacoepidemiology and Drug Safety*. 2001;10:483–486. [doi:10.1002/pds.677](https://doi.org/10.1002/pds.677)
- Hauben M, Aronson JK. Defining ‘signal’ and its subtypes in pharmacovigilance based on a systematic review of previous definitions. *Drug Safety*. 2009;32:99–110. [doi:10.2165/00002018-200932020-00003](https://doi.org/10.2165/00002018-200932020-00003)
- CDC. Updated guidelines for evaluating public health surveillance systems. *MMWR*. 2001;50(RR-13):1–35. [cdc.gov](https://www.cdc.gov/mmwr/preview/mmwrhtml/rr5013a1.htm)
