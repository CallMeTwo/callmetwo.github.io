---
title: Kaplan–Meier curves and the log-rank test
summary: Estimate and compare event-free survival while accounting for right-censoring, risk sets, curve uncertainty, and the limitations of a global rank test.
---

## Overview

Kaplan–Meier curves estimate the probability of remaining event-free over time when participants have different follow-up lengths and some outcomes are censored. The log-rank test compares groups using the event times and risk sets across follow-up. Together they offer a basic, design-transparent description of time-to-event outcomes, but neither automatically adjusts for confounding nor answers every clinical question.

Use curves to show when events occur and how the event-free proportion evolves, not just whether a final p-value crosses a threshold. Use the log-rank test for a global comparison under assumptions that give similar meaning to differences across time. If curves cross or treatment effects change over time, the test may be hard to interpret and a single hazard ratio may conceal benefit-harm patterns.

## Construct the curve from event and censoring times

For each distinct event time (t_j), count (n_j), the number at risk immediately beforehand, and (d_j), the number of events. The Kaplan–Meier estimate is:

\[
\widehat S(t)=\prod_{t_j\le t}\left(1-\frac{d_j}{n_j}\right).
\]

Censoring removes a participant from future risk sets but does not lower the curve. For example, if 50 patients enter, 3 have events before any censoring, and then 5 are censored before the next event, the first step is 47/50=0.94. If the next event occurs with 42 remaining at risk, the second step multiplies by 41/42, giving 0.918. The estimate reflects the conditional event-free fractions among those still followed.

```r
library(survival)
fit <- survfit(Surv(followup_days, event) ~ arm, data = dat)
plot(fit, col = c("grey40", "steelblue"), lty = 1:2,
     xlab = "Days from randomization",
     ylab = "Event-free survival probability")
legend("bottomleft", legend = levels(dat$arm),
       col = c("grey40", "steelblue"), lty = 1:2)
summary(fit, times = c(90, 180, 365))
```

The event indicator is 1 for the prespecified event and 0 for right censoring. Add confidence intervals and a number-at-risk table to the figure. Define the time origin and event in captions. If a competing event prevents the event of interest, use cumulative incidence methods rather than treating the competing event as ordinary censoring.

Greenwood's formula estimates pointwise uncertainty. Log-log confidence intervals respect the 0-to-1 range and are commonly used. The median survival is the earliest time the curve reaches 0.5; if it never does, the median is not reached. Fixed-time survival estimates with intervals are often more clinically useful. Restricted mean survival time (RMST), the area under (S(t)) through a chosen horizon, provides an average event-free time contrast when proportional hazards is doubtful.

## What the log-rank test compares

At each event time, the log-rank test compares observed events in each group with the number expected if groups had the same hazard among those at risk. These differences are summed over event times and standardized by their variance. Under the null of equal survival distributions and independent censoring, the statistic is approximately chi-squared. The test is powerful when the hazard ratio is roughly constant over time, because differences accumulate consistently.

With two groups, a two-sided log-rank p-value tests whether the observed event-time distributions differ globally. It does not estimate how large the difference is, identify when it appears, or provide a causal effect. Report the curves, fixed-time risks, and a contrast with uncertainty alongside the test. If participants were randomized, preserve the randomized comparison; if observational, the test is unadjusted and confounded comparisons are likely.

```r
survdiff(Surv(followup_days, event) ~ arm, data = dat, rho = 0)
```

`rho = 0` gives the ordinary log-rank test. Weighted alternatives such as the Gehan–Breslow or Tarone–Ware tests emphasize earlier events; a Fleming–Harrington weight can emphasize early or late differences. Choosing a weight after inspecting the curves inflates false-positive risk. Prespecify it and explain the clinical time window it targets.

For two groups, at event time (t_j), if (n_{1j}) of (n_j) at risk are in group 1 and (d_j) total events occur, the expected group-1 events under equal hazards are (d_j n_{1j}/n_j). The log-rank score sums observed minus expected events over event times; its variance accounts for the hypergeometric allocation of events under the null. The standardized score squared is approximately chi-squared with one degree of freedom. This connects the test to actual observed risk sets rather than comparing end-of-study proportions.

The log-rank test is closely related to the score test for a Cox model with a binary group indicator. Its natural alternative corresponds roughly to a constant hazard ratio, so it is particularly efficient when proportional hazards holds. Under nonproportional hazards, a significant test still indicates some global difference, but direction and timing require inspection. A nonsignificant result can reflect crossing effects, too few events, or wide uncertainty; it is not evidence that curves are identical.

For more than two groups, the log-rank test is omnibus. A significant result says at least one survival distribution differs, not which pair differs. Pairwise post hoc tests create multiplicity and should be adjusted or labeled exploratory. If groups are ordered doses, a prespecified trend test may answer a different question more efficiently.

## Weighted tests and time-varying effects

The Fleming–Harrington family weights event-time contributions by functions of estimated survival, often denoted (\widehat S(t)^\rho[1-\widehat S(t)]^\gamma). Setting positive \(\rho\) emphasizes earlier times when survival is high; positive \(\gamma\) emphasizes later times as survival falls. These tests can be useful when a biologically credible effect pattern is known in advance, but selecting among many weights after plotting the data invalidates nominal p-values.

If treatment benefit is expected only shortly after randomization, a weighted test may target that pattern, but the analysis plan should define the window or weights ahead of time. Another strategy is a combination test that protects type I error across a limited prespecified family of weights. Such methods can gain power under nonproportional hazards while preserving calibration, but the resulting claim is more complex and needs clear explanation.

When proportional hazards fails, alternatives include time-specific survival differences, RMST differences through a prespecified horizon, or a flexible model with time-varying coefficients. A single hazard ratio averaged over follow-up can be hard to interpret and may depend on censoring patterns. Presenting only a weighted test p-value without an effect estimate is inadequate for clinical interpretation.

## Interpreting an illustrative trial

Suppose 1-year event-free survival is estimated as 0.84 for treatment and 0.76 for control. Their estimated event risks are 16% and 24%, a difference of −8 percentage points by one year. If the log-rank p-value is 0.03, the result is evidence against equal survival curves under the test assumptions. The p-value does not mean treatment reduces each patient's event risk by 8% or that there is a 97% probability treatment works. Give confidence intervals for the group estimates and, ideally, the difference.

If control survival is 0.76 but 15% of that group is censored before one year, the Kaplan–Meier estimate uses remaining participants under independent censoring. It is not simply 1 minus observed event count divided by enrolled count. If censoring is related to prognosis, both curve and test can be biased. Compare censoring patterns and consider sensitivity methods.

## Assumptions and curve diagnostics

The Kaplan–Meier estimator assumes independent censoring, at least conditional on any variables used to stratify or adjust. The log-rank test also assumes independent observations and uses the risk sets correctly. In cluster-randomized or matched data, naive standard errors and p-values may be invalid; account for clustering or use a design-aware analysis. The test does not handle confounding in observational studies.

Plot censoring marks where helpful, display numbers at risk below the x-axis, and limit the display horizon to where follow-up supports interpretation. A flat tail with few participants is not strong evidence of durable protection. Assess whether entry times, follow-up, or endpoint ascertainment differ across groups. Report median follow-up with a method appropriate for censoring, commonly reverse Kaplan–Meier.

Crossing curves are a warning that a single global test or proportional-hazards summary may be misleading. The log-rank test can lose power when effects change sign, because early and late differences cancel. Examine prespecified time-specific survival contrasts or RMST; avoid searching many cut points until one gives a small p-value. If early benefit followed by later harm is scientifically plausible, plan analyses that reflect that pattern.

The Kaplan–Meier estimator also assumes the event process is sufficiently well-defined and that observation times are measured accurately. Interval-censored events need methods beyond ordinary step curves. Delayed entry requires defining when participants enter risk sets. If participants contribute multiple episodes, standard methods assuming one independent survival time per person understate uncertainty; use recurrent-event or frailty approaches suited to the question.

The curve should display pointwise confidence bands or intervals at prespecified times. Pointwise 95% intervals do not form a simultaneous 95% band over the entire curve; avoid saying the true curve lies inside the whole band with 95% probability. When comparing two groups, uncertainty in their difference is not obtained by visually checking overlap of separate intervals. Use a direct contrast with its own interval.

Number-at-risk tables should align with time ticks and include the count entering each interval. Consider also showing cumulative events and censorings. If groups differ in recruitment or follow-up, curves may be supported by different risk sets. Use a common time axis and state if truncating the plot for readability. Show confidence intervals or bands without visual clutter, especially when late estimates are unstable.

### Interpretation of a fixed-time difference

Suppose (\widehat S_A(365)=0.84) and (\widehat S_B(365)=0.76). At one year, estimated event risks are 0.16 and 0.24; their absolute difference is −0.08. This calculation is straightforward only when the outcome is a single event without competing risks and censoring assumptions support both estimates. The difference is not the same as the hazard ratio. Confidence limits for each curve do not directly produce the interval for the difference; estimate that contrast using an appropriate method, often with bootstrap or model-based standardization.

If the survival curves are close early and diverge later, the one-year difference summarizes only that horizon. If they cross, the absolute difference can change sign by time. Choose horizons clinically and report more than one when the trajectory itself matters. Avoid interpreting a single timepoint selected because it yielded the most favorable contrast.

## Competing events and estimand choices

If death prevents recurrence, censoring deaths and plotting one minus Kaplan–Meier estimates a net risk under a hypothetical elimination of death. It overestimates the observed-world recurrence probability when competing death is common. The cumulative incidence function estimates the probability of recurrence before death and should be used for absolute prognosis. Cause-specific hazard comparisons answer a different question: event rate among those still event-free from all causes.

Choose the estimand before analysis. A composite endpoint may count recurrence or death; a competing-risk estimand may focus on recurrence before death; a cause-specific hazard may target event process. Each has different interpretation and can yield different conclusions. The censoring-and-survival-functions article provides further detail on competing risks.

## Model-based follow-up to the global comparison

A Cox model can adjust for prespecified covariates and estimate a hazard ratio if proportional hazards is reasonable. Check proportionality with scaled Schoenfeld residuals and graphical patterns; a test p-value alone is insufficient. If effects vary with time, report time-varying effects or a more interpretable absolute measure. Covariate-adjusted curves require model-based standardization and should state the population over which predictions are averaged.

For a causal trial interpretation, randomization supports the assignment contrast but missing outcomes, nonadherence, and censoring may still matter. For observational data, a log-rank result is crude; confounding adjustment and a causal estimand are needed before claiming an intervention effect. A Kaplan–Meier plot is descriptive, not a causal design.

## Censoring patterns and follow-up reporting

The log-rank test and Kaplan–Meier curves require censoring independent of event time, often conditional on group and measured covariates. If treatment follow-up is shorter due to toxicity or withdrawal related to prognosis, the analysis may be biased. Report numbers and reasons censored by group and compare follow-up distributions. Inverse-probability-of-censoring weighting or joint models may address measured informative loss, but both introduce assumptions and require diagnostics.

Median follow-up is best estimated with reverse Kaplan–Meier, treating the event of interest as censored and censoring as the event. This estimates potential observation time rather than the median of observed times, which is distorted by early events. Report median follow-up and range or interquartile range, event counts, and numbers at risk. Avoid saying “all participants were followed for one year” when only a fraction reached that horizon.

## Why a global test cannot replace estimation

The log-rank test compresses all event-time information into one statistic. It does not convey absolute risk, treatment benefit magnitude, timing, or patient-level prediction. A very large study can produce a small p-value for a trivial survival difference; a small study can have a large observed difference with a wide interval. Report curves and quantitative contrasts regardless of significance.

If the primary scientific question is “How much event-free time is gained through two years?”, RMST aligns directly with it. If the question is “What fraction remain event-free at 12 months?”, report a fixed-time survival probability or risk difference. If the question concerns instantaneous process rates, a hazard model may fit. Choosing the estimand first helps avoid defaulting to the log-rank test because software offers it.

The test's validity depends on independent participants or appropriate clustering. In a cluster-randomized study, comparing individual event times as though participants were independently assigned can overstate evidence. Use a stratified or cluster-level design-based test, a frailty or marginal model with correct variance, or another prespecified method. For matched pairs, account for matching in the analysis.

## Writing a clear figure caption

A useful caption names population, time origin, event, group assignment, censoring mark meaning, confidence interval type, and number-at-risk rows. State that the log-rank test is unadjusted if applicable. For example: “Kaplan–Meier estimates of relapse-free survival from randomization; ticks denote censoring; shaded areas are pointwise 95% confidence intervals; numbers below the axis are at risk; unadjusted log-rank p=0.03.” Add competing-event handling and horizon when relevant.

When a plot includes an adjusted analysis, state how covariates were incorporated and the population used to standardize predictions. A weighted log-rank test should name its weights and rationale. If several analyses are shown, distinguish primary from exploratory in the caption and text. Avoid giving a single p-value without identifying the exact test, especially when weighted and unweighted comparisons are both presented.

Survival comparisons should also be interpreted with clinical context: event severity, available subsequent treatments, and follow-up burden. A difference in time to a minor event can have a different value from a difference in mortality. Curves do not encode these consequences, so discuss benefits and harms across relevant outcomes rather than treating event-free survival as the only meaningful result.

## Comparing curves when the event is rare

With few events, the Kaplan–Meier curve changes in large steps and the log-rank approximation may be poor. Exact or permutation-based methods can be considered when randomization permits, preserving allocation strata and censoring structure. Confidence intervals for survival can be wide and asymmetric. Report the actual number of events and avoid interpreting a smooth-looking plot created by interpolation as dense evidence.

For small randomized studies, a randomization test can compare a prespecified survival statistic under assignments allowed by design. One option is a log-rank statistic, permuted at the patient or cluster assignment unit. The test is exact for the sharp null under the actual allocation mechanism, but a confidence interval requires inverting a specified effect model and may assume a common additive shift in event times or a proportional-hazards structure. State the null and effect assumption.

## Multiple groups and adjusted comparisons

When comparing several treatment arms, an omnibus log-rank test is a first global test. Pairwise comparisons need multiplicity control if confirmatory. If one group is a standard comparator and several doses are tested, Dunnett-type procedures or a prespecified dose-trend contrast may be more efficient than every pair. Plot all group curves and report a coherent hierarchy of claims.

Covariate-adjusted survival curves can be generated from a Cox model by predicting each participant under each group and averaging. This is standardization, not simply plotting a curve at mean covariate values, which may describe a fictitious patient. Choose the target population (trial participants, eligible population, or another cohort) and bootstrap the full estimation procedure for intervals.

## References and further reading

- Kaplan EL, Meier P. Nonparametric estimation from incomplete observations. *JASA*. 1958;53:457–481. [doi:10.1080/01621459.1958.10501452](https://doi.org/10.1080/01621459.1958.10501452)
- Mantel N. Evaluation of survival data and two new rank order statistics arising in its consideration. *Cancer Chemotherapy Reports*. 1966;50:163–170.
- Fleming TR, Harrington DP. *Counting Processes and Survival Analysis*. Wiley; 1991.
- Royston P, Parmar MKB. Restricted mean survival time: an alternative to the hazard ratio for the design and analysis of randomized trials. *BMC Medical Research Methodology*. 2013;13:152. [doi:10.1186/1471-2288-13-152](https://doi.org/10.1186/1471-2288-13-152)
- The [censoring and survival functions article](censoring-and-survival-functions.html) reviews risk sets and censoring.
