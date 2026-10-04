---
title: Censoring and survival functions
summary: Understand event-time data, risk sets, censoring mechanisms, survival probabilities, hazards, and the assumptions required for valid time-to-event analysis.
---

## Overview

Survival analysis studies time from a defined origin to an event while recognizing that some participants' event times are not observed. A person who remains event-free at study end has not demonstrated permanent freedom from the event; their event time is only known to exceed their last observed time. This partial information is censoring, and methods such as Kaplan–Meier estimation and Cox regression use it through risk sets.

Correct analysis begins with a clear time origin, event definition, and censoring rule. “Time to death” could start at diagnosis, randomization, surgery, or discharge, and each defines a different question. The survival function, hazard, and cumulative incidence also answer different questions; hazard is an instantaneous rate, not a probability.

## Represent each participant's follow-up

For a single event type with right censoring, record observed time \(T_i=\min(T_i^*,C_i)\) and event indicator \(\delta_i=I(T_i^*\le C_i)\), where \(T_i^*\) is true event time and \(C_i\) censoring time. If \(\delta_i=1\), the event occurred at \(T_i\); if 0, the participant was event-free through \(T_i\) and may experience the event later. Do not code censoring as “no event ever.”

The time origin and eligibility criteria must align. In a post-discharge study, starting follow-up at admission while including only patients discharged alive can create immortal-time bias because participants had to survive to discharge. Delayed entry (left truncation) handles participants who become observable after time zero by including them in risk sets only after entry. For a recurrent event, first-event survival analysis discards later events; recurrent-event methods may better address the question.

## Three functions with distinct interpretations

The survival function (S(t)=P(T^*>t)) is the probability of remaining event-free beyond time (t). The cumulative distribution (F(t)=1-S(t)) is event risk by (t) when there are no competing events. The hazard (h(t)) is the instantaneous event rate at time (t) among those event-free just before (t); cumulative hazard (H(t)=\int_0^t h(u)du) relates to survival through (S(t)=\exp[-H(t)]) in continuous time.

The hazard is conditional on remaining event-free. A hazard ratio compares instantaneous rates in the current risk sets; it is not a risk ratio, and it does not directly provide an absolute probability. A hazard can increase while event risk remains low if few people remain at risk, or decrease as susceptible individuals experience events. Present survival probabilities or cumulative incidence at meaningful times alongside hazard ratios.

## Kaplan–Meier estimation from risk sets

At each distinct event time (t_j), let (n_j) be the number at risk just before the time and (d_j) the number of events. The Kaplan–Meier estimate multiplies conditional survival proportions:

\[
\widehat S(t)=\prod_{t_j\le t}\left(1-\frac{d_j}{n_j}\right).
\]

Consider 10 patients followed for recurrence. At day 5, 1 of 10 at risk has an event, so survival becomes 0.9. Two are censored at day 7, leaving 7 at risk. At day 10, 2 events occur; survival becomes (0.9\times(1-2/7)=0.643). Censored participants contribute information up to their censoring time, then leave the risk set. They do not cause a downward step in the curve.

```r
library(survival)
fit <- survfit(Surv(time_days, event) ~ treatment, data = dat)
summary(fit, times = c(30, 90, 180))
plot(fit, xlab = "Days since randomization",
     ylab = "Estimated event-free probability")
```

The code assumes a binary event indicator coded 1 for the event of interest and right censoring otherwise. Specify `Surv(start, stop, event)` for counting-process data with delayed entry or time-varying covariates. State the event and censoring definition in labels. A plotted curve alone is insufficient: include confidence intervals, numbers at risk, event counts, and follow-up duration.

Greenwood's formula estimates variance of the Kaplan–Meier curve; log-log transformed intervals remain within 0 and 1 and often behave better near boundaries than simple normal intervals. Median survival is the first time \(\widehat S(t)\le0.5\); if the curve never falls below 0.5, the median is not reached and should not be extrapolated. Restricted mean survival time (RMST) through horizon \(\tau\) is area under the survival curve from 0 to \(\tau\), interpretable as average event-free time up to that horizon.

## Censoring mechanisms and what they assume

Right censoring is independent or noninformative when, conditional on modeled information, censoring time provides no additional information about future event time. Administrative end-of-study censoring may be plausibly independent if follow-up procedures are consistent. Loss to follow-up can be informative if worsening health, relocation, or treatment burden predicts both censoring and event risk. Standard Kaplan–Meier and Cox methods do not correct informative censoring automatically.

Left censoring means the event occurred before first observation but its exact time is unknown; interval censoring means event time is known only to lie between visits. Examples include disease onset detected at screening or recurrence assessed at periodic scans. Treating the first positive visit as the exact event time can bias estimates. Use interval-censored survival methods when the inspection process creates such data.

Competing risks occur when an event prevents the event of interest, such as death before a nonfatal relapse. Treating competing death as ordinary independent censoring and using (1-\widehat S(t)) estimates a hypothetical net risk under elimination of competing events, not observed-world cumulative incidence. Use the Aalen–Johansen estimator for cumulative incidence of a cause in the presence of competing events. Clarify whether the target is cause-specific hazard or absolute cause-specific probability.

## Worked interpretation with absolute quantities

Suppose estimated 1-year event-free survival is 0.82 in treatment and 0.75 in control. The estimated event risks are 18% and 25%, a difference of −7 percentage points at one year. If censoring is independent and event definitions are consistent, this is an estimated absolute contrast. A log-rank p-value tests a broader comparison of survival curves; it does not quantify the size of the difference. Report confidence intervals for group survival and the contrast where available.

If deaths unrelated to the event occur, these values may not be observed-world event risks unless competing risks were handled appropriately. A clinician interpreting recurrence risk should know whether participants who died before recurrence count as a competing event, composite endpoint, or censoring event. Estimands must specify the treatment of competing events because no single choice is universally correct.

## Diagnostics and common distortions

Plot censoring patterns by treatment and key covariates. A marked difference in follow-up completeness can signal informative censoring or differential ascertainment. Compare baseline characteristics of those censored early with those followed; this does not prove independence but helps identify concern. Inverse-probability-of-censoring weighting can adjust for measured predictors of censoring, but requires positivity and a correct model. Sensitivity analysis is needed for unmeasured informative censoring.

Check data for time zero inconsistencies, negative follow-up, events after censoring, duplicate records, and treatment changes. Ensure units are consistent and event dates precede administrative censor dates. Report reverse Kaplan–Meier estimates of potential follow-up when appropriate; the median observed follow-up among event-free participants is not a reliable summary when events occur.

## Additional consequences of the censoring assumption

Independent censoring is conditional and cannot be guaranteed by recording an administrative end date. If follow-up stops because a participant becomes too ill, censoring may depend on prognosis. If it is independent only after conditioning on measured baseline and time-varying information, include that structure or consider inverse-probability-of-censoring weights. Weighting estimates the distribution expected under continued observation given measured predictors; extreme weights reveal weak positivity and can destabilize estimates. Sensitivity analysis remains important for unmeasured predictors of loss to follow-up.

Administrative censoring can also be informative when enrollment is staggered and calendar time affects prognosis. A trial closing date is independent of event time only under conditions such as stable recruitment and care. For a database ending on a fixed calendar date, participants entering near the end contribute less follow-up; this may be benign under independent entry and censoring, but changing treatment, coding, or background risk can invalidate the assumption.

Left truncation differs from left censoring. With delayed entry, a person is observed only after surviving event-free to entry; their risk time begins then. A registry enrolling disease survivors two years after diagnosis cannot treat their risk as observed from diagnosis. Left truncation conditions on survival to entry and changes the risk set. Interval censoring instead means the event time lies between assessments; specialized likelihood methods account for this coarsening.

## Ties, sparse risk sets, and uncertainty

When multiple events share a recorded time, the Kaplan–Meier step uses (d_j/n_j) at that time. Ties can arise because time is measured in days or visits rather than because events occurred simultaneously. The product-limit estimator remains well-defined for grouped times, but the underlying order of events and censoring within the interval may be unknown. In Cox regression, tie handling uses approximations such as Breslow or Efron; Efron often performs better when many events tie.

Greenwood's variance estimate is \(\widehat{Var}[\widehat S(t)]=\widehat S(t)^2\sum_{j:t_j\le t}d_j/[n_j(n_j-d_j)]\). It grows as risk sets become small. A confidence band at late follow-up can be very wide even when the curve looks flat, because few participants remain. Avoid emphasizing tail behavior without showing numbers at risk. If the curve is censored before the median, report “median not reached” and a fixed-time survival estimate with interval rather than extrapolating a crossing.

Restricted mean survival time (RMST) offers an alternative when a proportional-hazards summary is inappropriate. For horizon \(\tau\), RMST is \(\int_0^\tau S(t)dt\), the expected event-free time accumulated through \(\tau\). A difference of 12 days through one year means the treatment group averages 12 more event-free days during that year, subject to the chosen horizon. RMST avoids proportional hazards but depends on the clinically meaningful horizon; choose it before looking at curve crossings and report sensitivity to nearby horizons if needed.

## Competing risks in absolute-risk questions

Suppose a cohort has 100 people at baseline. By one year, 10 experience recurrence and 8 die first. The observed-world recurrence probability is not simply one minus the Kaplan–Meier estimate that censors deaths, because those 8 people can no longer recur. The Aalen–Johansen cumulative incidence accumulates recurrence hazard multiplied by the probability of remaining free of all event types up to each time. It estimates the actual probability of recurrence before death under observed conditions.

Cause-specific hazards can answer a process question: among people currently alive and recurrence-free, what is the instantaneous recurrence rate? But a covariate effect on this hazard does not directly equal its effect on cumulative incidence, because that covariate may also affect competing death. For prognosis and counseling, cumulative incidence is often the relevant absolute risk. State which quantity is reported.

```r
library(survival)
library(cmprsk)
ci <- cuminc(ftime = dat$time_days,
             fstatus = dat$status,  # 0=censored, 1=recurrence, 2=death
             group = dat$treatment)
plot(ci, xlab = "Days", ylab = "Cumulative incidence")
```

This code assumes distinct numeric status values and appropriate independent censoring. For adjusted cumulative incidence, use regression-based standardization; crude curves do not adjust for confounding. The Fine–Gray subdistribution hazard model targets a different parameter from a cause-specific hazard and should not be interpreted as an ordinary event rate.

## Time origin and immortal-time traps

The time origin must be common to eligibility, treatment assignment, and follow-up. Suppose a study compares patients who ever receive a transplant with those who do not, starting follow-up at diagnosis. A patient classified as transplanted had to survive from diagnosis to the procedure; that guaranteed event-free period is immortal time. Assigning it to the transplant group creates artificial survival advantage. Align eligibility and treatment strategies at a common time zero, or use time-varying exposure methods that correctly allocate pre-transplant time.

The same issue appears when defining groups by a future response, treatment completion, or procedure. A landmark analysis can define eligibility at a fixed time and compare participants alive and event-free then, but the estimand becomes conditional on surviving to that landmark. A target-trial approach clarifies eligibility, assignment strategies, follow-up, outcome, and analysis and helps prevent time-related bias. Censoring methods cannot repair a misaligned time origin.

For each participant, document date of eligibility, date of treatment assignment or initiation, event date, last known event-free date, and reason for censoring. If treatment can change over time, specify whether the estimand is effect of initial assignment or sustained treatment strategy. Naively censoring at treatment switch may be informative because switching depends on health status; inverse-probability weighting may be needed under a causal strategy.

## Weighting for measured informative censoring

Let (G_i(t)=P(C_i\ge t\mid H_i(t))) denote the conditional probability of remaining observed through time (t), given measured history (H_i(t)). Inverse-probability weights proportional to (1/G_i(t)) upweight people who resemble those lost earlier. Stabilized weights use a numerator model with fewer predictors to reduce variance. In practice, estimate the censoring process in discrete intervals or with a survival model, inspect the distribution, and evaluate covariate balance among those still observed.

Weights cannot identify outcomes for histories with no chance of continued observation. If a subgroup is always lost, positivity fails and truncating extreme weights does not solve the lack of information. Report weight truncation, effective sample size, and sensitivity to thresholds. Include predictors of both censoring and outcome; omitting an important predictor can leave residual selection bias. Weighting addresses measured selection under the model, not MNAR dependence on unobserved future event time.

## Worked risk-set calculation and curve reading

Imagine 20 participants enter follow-up. At month 2, two have the event and none have been censored: the conditional event-free fraction is 18/20=0.90. At month 4, one event occurs among 15 still at risk after four prior censorings; survival becomes (0.90\times14/15=0.84). At month 6, two events among 10 at risk reduce the estimate to (0.84\times8/10=0.672). The curve's height is a product of conditional survival fractions, not the raw proportion of the original cohort still event-free.

If censoring is independent, early-censored people contribute valid information up to their last contact. The risk set at month 6 contains only those known event-free immediately before month 6. If censoring preferentially removes high-risk participants, the later curve can appear too favorable because the remaining set is selected. Show numbers at risk below the plot and avoid comparing late tails when only a few remain.

## Reporting a survival analysis

Define the event, time origin, time scale, censoring event, competing events, and follow-up horizon. Report event counts and censoring counts separately by group, median potential follow-up, survival estimates at clinically meaningful times with intervals, and number at risk. Explain whether absolute risk accounts for competing events. For a model, identify time-varying covariates and proportional-hazards checks, but do not rely on a single diagnostic p-value.

State whether censoring independence is plausible and what evidence informed that judgment. If losses differ by arm, show patterns and sensitivity analysis. In a figure, use consistent axes across groups, display confidence bands carefully, mark censoring only when it aids interpretation, and include an at-risk table. Avoid extrapolating curves beyond observed follow-up or reporting precise late estimates unsupported by the risk set.

The Kaplan–Meier estimator does not adjust for confounding. In observational comparisons, differences in curves may reflect prognosis, selection, treatment, and censoring. Adjusted survival curves require a model and a target covariate distribution; report how they were standardized. A crude log-rank result should not be described as an adjusted treatment effect.

When event status is uncertain at last contact, define whether the participant is censored at the last verified event-free date or whether another ascertainment source can update status. Misdating censoring by using the administrative database end for everyone can falsely extend follow-up. Sensitivity analyses can vary plausible event dates or censoring assumptions when records are incomplete.

Survival probabilities apply to the defined population and time origin. A 1-year estimate from a selected trial cohort may not transport to older adults or a health system with different treatment patterns. Present the eligibility context and avoid implying individual certainty from a population curve. For individualized prognosis, use a validated prediction model with calibration assessment.

## A practical audit of event-time data

Before fitting a curve, construct a small participant-level audit table with entry, exit, event indicator, event type, and censoring reason. Verify that every event date falls inside observed follow-up and that no one contributes risk time before eligibility. Summarize person-time by group and calendar period. Compare data-derived counts with the source system or adjudication record.

If loss to follow-up is substantial, describe it by reason, group, and baseline prognosis. Reverse Kaplan–Meier estimates potential follow-up; it is preferable to the median of observed follow-up times when events compete with censoring. For administrative end dates, clarify whether participants were known event-free through that date or simply had no later record. These distinctions determine whether censoring is credible.

## References and further reading

- Kaplan EL, Meier P. Nonparametric estimation from incomplete observations. *JASA*. 1958;53:457–481. [doi:10.1080/01621459.1958.10501452](https://doi.org/10.1080/01621459.1958.10501452)
- Andersen PK, Borgan Ø, Gill RD, Keiding N. *Statistical Models Based on Counting Processes*. Springer; 1993.
- Klein JP, Moeschberger ML. *Survival Analysis: Techniques for Censored and Truncated Data*. 2nd ed. Springer; 2003.
- Austin PC, Lee DS, Fine JP. Introduction to the analysis of survival data in the presence of competing risks. *Circulation*. 2016;133:601–609. [doi:10.1161/CIRCULATIONAHA.115.017719](https://doi.org/10.1161/CIRCULATIONAHA.115.017719)
- The [Kaplan–Meier and log-rank article](kaplan-meier-curves-and-the-log-rank-test.html) develops two-group survival comparisons.
