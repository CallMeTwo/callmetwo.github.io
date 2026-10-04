---
title: Censoring and survival functions
summary: How censored observations are handled in time-to-event data, and what the survival function actually tells you.
---

## Overview and key ideas

Time-to-event data measure how long patients live, stay disease-free, or remain
free of a complication. In almost every real study, some patients are still
event-free when the study ends or are lost to follow-up. Their event times are
**right-censored**: we know they remained event-free through their last contact,
but not what happened afterward. A competing event (such as death before
recurrence) is observed and may prevent the event of interest; it is not
ordinary censoring when estimating cumulative incidence.

The two central objects are the **survival function** S(t), the probability of
surviving (remaining event-free) beyond time t, and the **hazard function**
h(t), the instantaneous rate of events at time t among those still at risk.
They are linked: S(t) = exp(-integral of h from 0 to t), so the survival curve
is fully determined by the hazard over time. A censored patient contributes
their exact follow-up duration to the analysis — the information "no event
happened up to this time" — but contributes nothing about what happens after
their censoring time.

## When to use it

Survival-function thinking is required whenever the outcome is a time to an
event, not a simple yes/no. Typical settings:

| Setting | Example question |
| --- | --- |
| Oncology | What proportion of melanoma patients are recurrence-free at 5 years? |
| Cardiology | How long do patients remain free of cardiovascular events after stenting? |
| Transplantation | What is the probability of graft failure within 3 years of kidney transplant? |
| Infection | How long do patients remain hospitalised before discharge? |

## Assumptions and limitations

- **Non-informative (independent) censoring** is the foundational assumption:
  the censoring mechanism must be unrelated to the risk of the event,
  conditional on measured covariates. If sicker patients are more likely to be
  lost to follow-up, the survival curve will be biased.
- Censoring is **right censoring only** — information is cut off from the
  right. Left censoring (event preceded study entry) and interval censoring
  (event known to fall in a window) require different methods.
- Summarising S(t) at a single time point ignores the shape of the curve; two
  groups can share a median survival but differ substantially in early or late
  risk.
- Survival functions describe probabilities, not individual fates; small
  samples produce noisy estimates at times when the risk set is small.

## Worked example

Consider 50 melanoma patients followed after surgery. At 12 months, 14 have
recurred, 28 are recurrence-free and still under observation, and 8 were lost
to follow-up between 3 and 11 months. A Kaplan–Meier estimate (the standard
non-parametric estimator, described in the companion article on Kaplan–Meier
curves) might give S(12 months) = 0.55, 95% CI 0.40 to 0.70. The eight
censored patients count in the risk set up to their last contact but are
excluded afterwards. The interpretation: roughly 55% of such patients are
recurrence-free at one year, and we are 95% confident the true proportion lies
between 40% and 70%. Censoring here means we cannot claim what would happen
after the 12-month mark without data we do not have.

## Interpretation and common pitfalls

- Counting censored patients as "survivors" at the end of follow-up
  overstates survival; counting them as "failures" understates it. Both are
  wrong — censoring means unknown, not either.
- Ignoring the risk-set size at late time points: a survival estimate based on
  two patients still under observation has a very wide confidence interval and
  should not be quoted as if it were precise.
- Comparing groups by eyeballing survival curves is unreliable; use a formal
  test (the log-rank test) and report effect estimates, not just p-values.
- Reporting "survival" when the event is something undesirable (recurrence,
  death) without defining the endpoint clearly confuses readers.

Kaplan–Meier estimation relies on independent, non-informative right censoring: conditional on modeled information, those censored at a given time should have the same subsequent event prospects as those still observed. Loss to follow-up related to prognosis can violate this condition. If censoring differs by measured predictors, inverse-probability-of-censoring weighting may help under a correctly specified censoring model and positivity; it does not solve unmeasured informative censoring. Death can also be a competing event rather than censoring when the target is cumulative incidence of another event. State the time origin, event definition, censoring rule, and numbers at risk.

## References and further reading

## Censoring mechanisms and estimands

## Competing risks in detail

## Worked cumulative-incidence interpretation

Consider a cohort followed for 5 years for cardiovascular death, with non-cardiovascular death as a competing event. If 12% experience cardiovascular death, 18% die of another cause, and the remaining 70% are alive/censored at 5 years, the actual-world cardiovascular cumulative incidence is estimated from the Aalen–Johansen estimator. One minus Kaplan–Meier that censors non-cardiovascular deaths will generally exceed 12%, because it treats those deaths as though they could still later have cardiovascular death. The cause-specific hazard answers the rate of cardiovascular death among currently alive people; the cumulative incidence answers the probability a patient will experience cardiovascular death before another cause. For counseling, the latter is usually the direct probability of interest.

When estimating treatment effects, a treatment can lower one cause while increasing a competing cause; the resulting cumulative incidence reflects both pathways. A cause-specific HR alone does not determine the cumulative-incidence difference. Report cause-specific event counts and cumulative incidence curves for each relevant cause, and explain any model-based standardization. Gray's test is a global curve comparison, not a measure of absolute clinical effect.

## Delayed entry in software and data structure

For a subject observed from attained age 60 to 68, with event at 68, counting-process data might contain `Surv(60, 68, 1)`. A subject censored at age 65 contributes `Surv(61, 65, 0)` if enrolled at 61. Risk sets at age 62 include only those who entered by 62 and remain event-free, not all who will later enroll. For time-varying covariates, split records at measurement times so each covariate value applies only after its measurement. Validate no overlapping intervals per subject and no event occurs before entry.

```r
fit_age <- coxph(Surv(entry_age, exit_age, event) ~ exposure + sex,
                 data = cohort)
```

The underlying left-truncation assumption is that, conditional on modeled variables and survival to entry, the delayed entry process is independent of future event time. If entry depends on latent prognosis, bias may remain. Specify origin, entry, and exit clearly, and consider sensitivity analysis to selection into observation.

For cause (k), the cumulative incidence function is \(F_k(t)=P(T\le t,J=k)\). It depends both on the cause-specific hazard for (k) and on hazards for every competing cause because competing events remove people from being able to experience cause (k). The cause-specific hazard \(h_k(t)\) describes the instantaneous rate among those still free of all events; it is useful for etiologic questions about rates among those at risk. The subdistribution hazard used by Fine–Gray keeps people with competing events in a modified risk set to model the cumulative incidence function. These hazards answer distinct questions and their ratios should not be interchanged.

In R, a multi-state `Surv` object can preserve event types, and `cmprsk::cuminc` estimates empirical cumulative incidence curves. Compare curves with Gray's test when appropriate, then report absolute cumulative incidence at meaningful horizons with confidence intervals. A cause-specific Cox model may be fit by treating other causes as censored for the cause-specific hazard, but its coefficient is not a direct effect on cumulative incidence. To estimate actual event probability under covariates, combine cause-specific hazards or use a direct cumulative-incidence model and standardize predictions.

## Left truncation, delayed entry, and risk sets

In prevalent cohort recruitment, subjects enter observation after surviving event-free from a common origin. Their survival time before study entry is left-truncated: they are only eligible to enter the risk set after entry. The likelihood contribution conditions on surviving to entry. If delayed entry is ignored, early failures are underrepresented and estimated survival is biased upward. For counting-process records, interval ((start,stop]) contributes only during observed risk time. Ensure the start time is on the same time scale as the origin; age as time scale with delayed entry at attained age can be appropriate when age strongly structures risk.

## Diagnostics and sensitivity for censoring

## Reporting a survival analysis

## Cumulative incidence computation in R

## Comparing survival summaries across studies

### Practical interpretation

If a report says 5-year survival is 70%, explain that the estimate concerns the defined cohort and event under its censoring model. It is not an individual's guaranteed prognosis and may not transport to a different stage mix or care era. A confidence interval captures sampling uncertainty, not bias from informative loss, outcome misclassification, or selection. For patient communication, pair relative hazards with absolute event probabilities and competing risks.

Survival probabilities can be compared only when event definitions, time origin, horizon, eligibility, and censoring practices are sufficiently aligned. Median survival is particularly sensitive to follow-up length and baseline risk; hazard ratios may vary with covariate mix and nonproportionality. For evidence synthesis, fixed-time risks or RMST at common horizons may be more transportable than HRs, though they still require consistent outcome ascertainment. Report absolute event rates and background mortality where possible. In older populations, competing non-target mortality makes cause-specific probabilities central to clinical communication.

When censoring patterns differ substantially between studies, pooled KM estimates are not obtained by simply averaging published curves. Individual participant data or carefully harmonized interval counts are needed, with study stratification and appropriate assumptions. Summarize follow-up distribution and competing-event handling across evidence sources.

For a factor-valued event indicator where 0 is censoring and positive values identify event causes, `cmprsk::cuminc` provides nonparametric cause-specific cumulative incidence estimates and Gray tests. Inspect factor coding and event counts before calling the function; accidental conversion of labels to integers can reverse event definitions.

```r
library(cmprsk)
ci <- cuminc(ftime = dat$time, fstatus = dat$status,
             group = dat$treatment, cencode = 0)
print(ci)
plot(ci, xlab = "Years", ylab = "Cumulative incidence")
```

The output may include a test for each event type; these are unadjusted group comparisons. Extract estimates at prespecified times and report intervals if supported by the selected implementation. For covariate-adjusted absolute risk, fit cause-specific models for all event types and combine predicted hazards, or use a subdistribution model with careful interpretation. Do not treat the subdistribution HR as a cumulative risk ratio.

Describe the time origin, event definition, competing events, entry mechanism, censoring rules, and follow-up completeness. Report median potential follow-up (reverse Kaplan–Meier can estimate it), numbers at risk and events, and reasons for censoring by group. A median follow-up computed only among survivors is biased downward and should not replace reverse KM. For competing risks, provide cause-specific counts and cumulative incidence at clinically meaningful horizons. A methods paragraph should specify whether survival probability, cause-specific hazard, cumulative incidence, or restricted mean time is the target.

### Reverse Kaplan–Meier follow-up

To estimate potential follow-up, reverse the event indicator: event-free censoring times are treated as events and actual events as censored, then estimate the median. This summarizes observation opportunity rather than patient survival. It does not prove censoring is independent, but helps readers understand duration of follow-up. For staggered recruitment, median follow-up can be much shorter than total calendar study duration.

Avoid reporting “median follow-up was 36 months” without saying how calculated. Administrative closure, withdrawal, competing death, and loss to follow-up have different implications. Provide group-specific follow-up summaries if enrollment or censoring differs.

Plot censoring distributions and estimate follow-up completeness by group and prognostic strata. Compare baseline characteristics of those retained versus lost, and model censoring using time-updated observed history when using IPCW. Inspect stabilized weights and effective sample size over time; near-zero probability of continued observation violates positivity. For sensitivity analyses, vary assumptions about hazard after dropout, use tipping-point shifts on imputed outcomes, or compare weighted with unweighted estimates. State what unobserved deterioration would be required to overturn conclusions. The best remedy remains collecting outcomes after treatment discontinuation and minimizing loss to follow-up.

### Left truncation and interval censoring

Right censoring is common, but other observation schemes require different likelihoods. With delayed entry (left truncation), a person becomes observable only after surviving to entry; the risk set must include them from entry onward, not from the origin. Failure to account for this selection can bias survival estimates. In `Surv(start, stop, event)` data, the start and stop define counting-process intervals; participants contribute only while under observation and event-free.

In interval censoring, the event is known to occur between visits but its exact time is unknown, as in periodic screening. Assigning the event to the detection visit creates artificial timing precision and may bias hazard estimates. Use interval-censored survival methods, such as Turnbull's nonparametric estimator or parametric models suited to the inspection schedule. State whether the event time is exact, right-censored, left-censored, or interval-censored; the data-generating observation process determines the appropriate risk calculation.

Let \(T\) be event time and \(C\) censoring time; observed time is \(\tilde T=\min(T,C)\) with event indicator \(\Delta=I(T\le C)\). Right censoring means the event has not been observed by the last known time; it does not mean the person is event-free forever. The Kaplan–Meier estimator and standard Cox partial likelihood rely on independent (non-informative) censoring, at least conditional on modeled covariates. Informally, among people still at risk with the same modeled history, those censored should have the same future event distribution as those who remain observed.

Administrative censoring at a fixed study end can be plausible, while dropout due to worsening illness is likely informative. Competing events are not ordinary censoring when estimating the probability of a particular event: a death before relapse prevents subsequent relapse. Treating competing death as censoring in Kaplan–Meier estimates a hypothetical “net” risk in a world where death is removed and generally overstates actual cumulative incidence. The Aalen–Johansen estimator estimates cumulative incidence in the presence of competing risks.

## Survival and hazard functions

The survival function is \(S(t)=P(T>t)\); the cumulative distribution is \(F(t)=1-S(t)\). The hazard \(h(t)\) is an instantaneous event rate conditional on surviving event-free to just before \(t\), not a probability. The cumulative hazard \(H(t)=\int_0^t h(u)du\) relates to survival through \(S(t)=\exp[-H(t)]\) for continuous event times. A hazard ratio compares these instantaneous rates and cannot usually be read as a ratio of cumulative risks at a fixed time.

With censoring, the risk set at time \(t_j\) contains individuals still under observation and event-free just before that time. Kaplan–Meier multiplies conditional survival estimates \(1-d_j/n_j\) across event times. The number-at-risk table is essential because late curve segments may be based on very few people. Greenwood's formula estimates variance; log-log transformed intervals typically respect the [0,1] range better than simple normal intervals.

```r
library(survival)
fit <- survfit(Surv(time, status == 1) ~ treatment, data = dat)
summary(fit, times = c(6, 12, 24))
plot(fit, xlab = "Months", ylab = "Event-free survival", conf.int = TRUE)
```

Here `status == 1` must encode the event of interest and `time` must use a common origin and unit. Inspect data records for impossible negative or zero times and distinguish administrative censoring from competing events. If `status` has multiple event types, a single `Surv(time, status == 1)` analysis treats other events as censored; use a competing-risk estimator if the target is actual event probability.

## Inverse probability of censoring weighting

When censoring depends on observed prognostic history, inverse probability of censoring weights (IPCW) can reweight those remaining under follow-up to represent those lost. At each time, a stabilized weight is the product of probabilities of remaining uncensored under a numerator model divided by corresponding probabilities under a denominator model conditional on history. This requires censoring exchangeability given measured predictors, positivity of continued observation, correct models, and measured predictors available before censoring. Extreme weights signal weak overlap and can make estimates unstable; truncation is a sensitivity choice, not a cure.

Report censoring counts and reasons by group, follow-up completeness, and sensitivity analyses under plausible informative dropout mechanisms. Multiple imputation of event times is not automatically appropriate because censoring provides partial information. Pattern-mixture, selection, tipping-point, or joint models may be useful depending on missingness structure. Inverse weighting, joint modeling, and imputation each rely on assumptions; compare conclusions across defensible approaches.

## Restricted mean survival time and communication

Restricted mean survival time through \(\tau\) is \(RMST(\tau)=\int_0^\tau S(t)dt\), the expected event-free time accrued through the common horizon. The difference in RMST is an absolute time contrast and can remain interpretable when hazards are nonproportional. Its value depends on the chosen \(\tau\), which should be prespecified and supported by follow-up in both groups. Report survival probability at clinically relevant times, the number at risk, and uncertainty alongside any hazard ratio.

- Kaplan EL, Meier P. Nonparametric estimation from incomplete observations. *JASA*. 1958;53:457–481. https://doi.org/10.1080/01621459.1958.10501452
- Andersen PK, Geskus RB, de Witte T, Putter H. Competing risks in epidemiology: possibilities and pitfalls. *International Journal of Epidemiology*. 2012;41:861–870. https://doi.org/10.1093/ije/dyr213
- Uno H, Claggett B, Tian L, et al. Moving beyond the hazard ratio in quantifying the between-group difference in survival analysis. *JCO*. 2014;32:2380–2385. https://doi.org/10.1200/JCO.2014.55.2208

- Klein JP, Moeschberger ML. *Survival Analysis: A Self-Learning Text*.
  Springer.
- Collett D. *Modelling Survival Data in Medical Research*. Chapman & Hall/CRC.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.

*The "Kaplan–Meier curves and the log-rank test" article develops the
non-parametric estimation of S(t) and group comparison in detail.*
