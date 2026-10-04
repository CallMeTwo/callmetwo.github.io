---
title: Kaplan–Meier curves and the log-rank test
summary: Estimating survival curves from censored data and comparing groups with the most widely used survival test.
---

## Overview and key ideas

The **Kaplan–Meier (product-limit) estimator** computes the survival function
S(t) step by step: at each time a failure occurs, the current survival estimate
is multiplied by (1 − d/n), where d is the number of failures at that time and
n is the number still at risk just before it. Censored patients leave the risk
set but do not trigger a step. The result is a step function that is the
non-parametric maximum likelihood estimate of S(t) under independent
censoring.

The **log-rank test** compares two or more groups on these curves. It counts,
at each failure time, how many failures occurred in each group (observed, O)
versus how many were expected given the at-risk composition (expected, E), and
tests whether O − E differs from zero, weighted equally across all time points.
It is a chi-squared test with one degree of freedom per additional group and is
the default test for comparing survival groups.

## When to use it

| Setting | Example question |
| --- | --- |
| Randomised trial | Do two chemotherapy regimens give different 2-year disease-free survival? |
| Cohort study | Does diabetes alter survival after an acute myocardial infarction? |
| Comparative effectiveness | How do outcomes differ between two surgical approaches to hip replacement? |

Use the log-rank test specifically when you want a single test of "do these
survival curves differ at any time?" and the difference, if present, is
approximately proportional over time (one curve is consistently above the
other).

## Assumptions and limitations

- **Independent censoring**, as for the survival function itself: censoring
  must be unrelated to future event risk given the measured covariates.
- The log-rank test has maximum power when the **hazard ratio is constant**
  over time. If curves cross — early harm then late benefit, or the reverse —
  the log-rank test can fail to detect a real difference, and the hazard
  ratio itself becomes uninterpretable as a single number.
- With few failures the chi-squared approximation to the log-rank statistic is
  poor; use exact or permutation-based variants in very small studies.
- Kaplan–Meier estimates at times when the risk set is very small are
  imprecise; report the number at risk alongside the curves.
- The method handles only group-level comparisons; adjusting for covariates
  requires regression (Cox model).

## Worked example

A trial randomises 300 patients with advanced non-small-cell lung cancer to
chemotherapy (n = 150) or chemo-immunotherapy (n = 150). At 24 months, the
Kaplan–Meier disease-free survival is 0.18 (95% CI 0.11 to 0.27) with
chemotherapy and 0.34 (0.24 to 0.44) with chemo-immunotherapy. At each failure
time the observed minus expected counts are accumulated; the resulting
statistic is (O − E)²/E = 8.2, giving a log-rank chi-squared of 8.2 on 1 df,
p < 0.01. Interpretation: patients receiving chemo-immunotherapy had
significantly longer disease-free survival, with an estimated 16-percentage-
point advantage at 2 years; the curves do not cross and the new regimen
remains superior throughout follow-up.

## Interpretation and common pitfalls

- Crossing curves: a non-significant or even a significant log-rank p-value
  becomes misleading when curves cross; report the curves, examine the hazard
  ratio over time, and consider a test that weights early or late differences.
- "No difference in median survival" does not imply identical curves; medians
  are a single summary of two very different shapes.
- Comparing medians when the median is not reached (survival at end of
  follow-up above 50%) forces arbitrary choices; compare the whole curves and
  report the test.
- Censoring heavily in one group near the end of follow-up can make late
  estimates in that group unstable; check the at-risk table before
  interpreting differences at long times.

The log-rank test compares entire event-time distributions and is most powerful under proportional hazards; crossing curves can yield a small or misleadingly uninformative global contrast despite clinically important time-varying differences. It does not estimate an effect size. Pair it with survival probabilities at prespecified times or restricted mean survival time (RMST), and state the horizon for RMST. Numbers at risk are essential because tail estimates may be based on very few individuals; confidence bands widen as risk sets shrink.

## References and further reading

## Product-limit estimation in practice

## Confidence intervals and quantiles

## Worked example with group comparison

Suppose 100 participants are randomized to each arm, with 40 and 50 events respectively by 24 months. KM survival at 24 months might be 0.58 vs 0.46 after accounting for censoring, so the absolute event-free survival difference is 12 percentage points at that horizon. The log-rank test uses all event-time risk sets, not only the 24-month counts, and may yield a different significance impression. Report risk sets and confidence intervals; a curve-based difference at a single horizon has uncertainty and should be prespecified if it is a primary contrast.

For a teaching-only complete follow-up scenario with no censoring, 24-month risks would be 40% and 50%; with censoring, those crude proportions are biased summaries of risk unless censoring is independent and follow-up patterns match. KM uses the event/censoring times to estimate survival under independent censoring. If dropout is informative, the curve remains biased even though censoring is represented mathematically.

## Weighted and adjusted survival summaries

## Plotting and table construction

## Fixed-time absolute effects and RMST

## Conditional versus marginal curves

### Interpretation checklist

State whether the event is death, recurrence, or a composite; identify censoring and competing events; show follow-up and risk sets; and report an absolute contrast at a prespecified time or RMST when useful. The median may not be reached and should not be extrapolated. A log-rank p-value does not measure effect size, clinical importance, or PH validity. Explain whether the plotted curves are unadjusted, stratified, or standardized.

Unadjusted KM curves are marginal for the observed groups but can be confounded in observational comparisons. Stratified KM curves condition on a categorical covariate and may become unstable with many strata. Model-adjusted curves are conditional predictions unless averaged over a target population. A standardized marginal curve predicts each eligible person's survival under each exposure and averages; this yields a defined population contrast but relies on model and causal assumptions. Label plots accordingly and do not call an adjusted curve “Kaplan–Meier” unless it is a genuine nonparametric estimator.

For randomized allocation, the unadjusted KM curve preserves the assignment contrast, while adjusted curves can improve precision if prespecified. If treatment adherence differs, an as-treated KM curve loses randomization and can be biased. Retain ITT as the primary assignment comparison and treat per-protocol curves as assumption-dependent supplementary analyses.

At a prespecified time τ, report \(\hat S_1(\tau)-\hat S_0(\tau)\) with an interval. The event-risk difference is the negative of this survival difference when the event definition is the complement and competing risks are absent. Do not call a survival difference an event-risk reduction without clarifying sign and horizon. RMST difference integrates the entire curve to τ and can be interpreted as event-free time gained/lost; it is robust to PH violation but depends on the chosen truncation time and follow-up support.

For example, survival probabilities 0.72 and 0.64 at 2 years imply an 8 percentage-point higher event-free probability in the first group at 2 years. This does not imply 8% longer survival or an 8% hazard reduction. If median survival is not reached, fixed-time probability or RMST may still be estimable and clinically useful. Use intervals and avoid extrapolating the KM tail.

Survival plots should show confidence bands, censoring marks when legible, and a risk table aligned to time ticks. Risk-table counts include people event-free and uncensored just before each tick; they are not numbers originally enrolled. Avoid extending the curve beyond the last event/censoring time or presenting a long flat tail with no risk-set context. Use consistent time units, clear event-free outcome label, and group names instead of generic 0/1. A table of survival probability and interval at selected times can aid accessibility.

KM curves are step functions; smoothing them can imply unobserved changes. If curves cross, show the crossing clearly and discuss nonproportionality. Separate panels can obscure direct comparison, while overlapping confidence bands are not a formal test of no difference. A log-rank p-value belongs in text or figure caption with the test specified; avoid treating the plot as a binary significant/nonsignificant graphic.

## Bootstrap uncertainty and clustered observations

For RMST or standardized curves, bootstrap resampling should follow the independent sampling unit. In a cluster-randomized trial, resample clusters within randomization strata, not individual patients. In a matched cohort, resample matched sets where appropriate. Percentile intervals may perform poorly with small samples; consider studentized or model-based alternatives. Report bootstrap replicate count, resampling unit, and failed-fit handling. A bootstrap cannot repair confounding, informative censoring, or sparse support.

To adjust for baseline differences, fit a survival regression and predict survival under each group for every participant, then average predictions over a common target population. This standardization yields marginal curves under model assumptions; bootstrap individuals or clusters according to sampling design for confidence bands. Alternatively, inverse-probability treatment weights can create a weighted pseudo-population, but extreme weights and censoring require diagnostics. State whether the result targets the treated, overall eligible, or another population.

An adjusted Cox curve generated from a single mean covariate vector is not generally equivalent to population-standardized survival, particularly with nonlinear covariate effects. Show adjusted absolute risks at prespecified times and curves if they support interpretation. A log-rank test is an unadjusted test and is not a substitute for adjusted estimand estimation in observational comparisons.

Greenwood's variance estimates uncertainty on the survival scale; log, log-log, or arcsine transformations can improve interval behavior near boundaries. The log-log transformation is common and produces limits between zero and one after back-transformation. At a fixed time, the interval assumes appropriate independent censoring and can be wide when few remain at risk. Median survival is a quantile of the survival distribution. Its confidence interval is obtained by inverting confidence bands for the survival curve, so one or both endpoints may be unestimable if the curve's band does not cross 0.5.

The mean survival time is not estimable nonparametrically when the tail is censored; report restricted mean survival up to a common τ instead. Select τ before analysis based on clinically relevant follow-up and adequate support in both groups. The RMST is the area under the survival curve up to τ, and the between-group difference is measured in units of event-free time. A positive difference of 1.2 months through 24 months means an average of 1.2 more event-free months within that restricted horizon, not a lifetime gain.

## Log-rank statistic and alternatives

At each event time, the log-rank score is observed minus expected events in each group under equal hazards; summing across times yields a chi-square statistic. It gives greater influence to times with larger risk sets and events. With proportional hazards, it is locally efficient; with crossing hazards, effects in opposite directions can cancel. Weighted log-rank tests can emphasize early or late differences, but choosing weights after inspecting curves inflates type-I error. Prespecify the test and show survival contrasts regardless of significance.

For nonproportional hazards, report complementary summaries such as time-specific survival difference, RMST, or milestone risk, each with interval and horizon. These remain sensitive to the selected time horizon, so show curves and avoid cherry-picking. A Cox HR and log-rank p-value are closely related under the PH model; reporting both without a clear purpose can create the appearance of independent evidence.

## Surveyed and matched survival data

Standard KM assumes independent participants. If data are clustered by family, clinic, or matched set, ordinary confidence intervals may be too narrow; use appropriate robust or stratified methods. In matched observational cohorts, stratified log-rank comparisons preserve matched-set structure, while weighted curves may target marginal risks. Survey-weighted survival estimation needs design-based methods. A visually adjusted curve should identify the covariate distribution and method used; simple stratification by one factor is not general adjustment.

### Numerical product-limit example

Suppose 10 participants are event-free at baseline. At month 2, two events occur while all 10 are at risk, so survival becomes \(1×(1-2/10)=0.80\). One participant is censored at month 3; this person contributes to the risk set through month 3 but causes no step. At month 5, one event among the seven remaining at risk multiplies survival by \(6/7\), giving \(0.80×6/7≈0.686\). Risk sets are updated in event-time order; censoring before an event time reduces the denominator for later events. This product-limit construction is why censoring times must be retained, not merely the final event/censoring counts.

The curve is a step function and estimates survival only over times supported by observed follow-up. At the maximum follow-up, one or two participants may remain, so a flat tail is not evidence of zero hazard. Median confidence intervals can be wide or unbounded if the lower survival confidence limit never crosses 0.5. Report that uncertainty rather than presenting a precise-looking median alone.

At each distinct event time \(t_j\), let \(n_j\) be the number at risk just before that time and \(d_j\) the number of events. The Kaplan–Meier estimator is \(\hat S(t)=\prod_{t_j\le t}(1-d_j/n_j)\). A censored observation reduces subsequent risk sets but does not cause a downward step in the curve. The estimator assumes censoring is independent of event time, possibly conditional on modeled covariates. Tied events are handled together at a time point; the conventional product-limit estimate applies the full observed decrement.

Greenwood's variance is \(\widehat{Var}(\hat S(t))=\hat S(t)^2\sum_{t_j\le t}d_j/[n_j(n_j-d_j)]\). Since survival is bounded between zero and one, transformed intervals such as log-log intervals are preferable to an untransformed Wald interval. Median survival is the first time the estimated survival falls to 0.5; if the curve stays above 0.5, the median is not reached and should be reported as not estimable, not extrapolated from the tail.

```r
library(survival)
km <- survfit(Surv(followup_months, event) ~ arm, data = trial)
summary(km, times = c(6, 12, 18), extend = FALSE)
plot(km, col = c("steelblue", "firebrick"), lty = 1,
     xlab = "Months since randomization", ylab = "Survival probability",
     conf.int = TRUE, mark.time = TRUE)
```

The time variable must begin at the chosen origin (often randomization), and `event` should be 1 only for the event being analyzed. Do not use `extend = TRUE` to imply survival beyond the observed follow-up without clearly marking that extrapolation. Add a risk table and censoring marks; many marks close together can make the curve unreadable, so show a table or concise note instead. Report numbers at risk at meaningful times because the uncertainty in the tail grows as the risk set shrinks.

## Comparing groups and limits of the log-rank test

The log-rank test compares observed with expected event counts over event times under the null of equal hazards. It is most powerful under proportional hazards and uses event-time ordering rather than a fixed time-point risk. It is not a test of equality of medians, nor does a small p-value quantify clinical importance. If hazards cross, positive and negative contributions can cancel, reducing power; weighted tests target different departures and should be prespecified.

```r
survdiff(Surv(followup_months, event) ~ arm, data = trial, rho = 0)
```

`rho = 0` gives the standard log-rank test. A generalized Wilcoxon-type weighting gives more influence to earlier events but changes the alternative emphasized. Plot curves and consider proportional-hazards diagnostics. Report an effect estimate with interval—such as a Cox hazard ratio if its assumptions are suitable, a time-specific risk difference, or RMST difference—not only the log-rank p-value.

## Competing events and censoring

If a different event precludes the event of interest (for example, non-cardiovascular death before cardiovascular death), ordinary KM censoring estimates a hypothetical net survival, not the observed-world probability. For actual event probability use the cumulative incidence function; the Gray test compares subdistribution functions, while cause-specific hazard models address rates among those still event-free. Choose based on question. Independent censoring is a substantive assumption: withdrawals related to impending events can bias the curve. Describe censoring reasons and use sensitivity analysis or IPCW when warranted.

Comparisons of KM curves are unadjusted. If groups differ in prognostic characteristics, adjustment may be appropriate, but adjusted curves require standardization over a target covariate distribution. In randomized trials, unadjusted curves preserve the randomization contrast, although prespecified covariate-adjusted analyses can improve precision. The curve describes the observed study population and does not alone establish that an intervention caused differences.

- Kaplan EL, Meier P. Nonparametric estimation from incomplete observations. *JASA*. 1958;53:457–481. https://doi.org/10.1080/01621459.1958.10501452
- Peto R, Peto J. Asymptotically efficient rank invariant test procedures. *JRSS A*. 1972;135:185–207. https://doi.org/10.2307/2344317
- Andersen PK, Geskus RB, de Witte T, Putter H. Competing risks in epidemiology. *International Journal of Epidemiology*. 2012;41:861–870. https://doi.org/10.1093/ije/dyr213

- Peto R, Peto J. Asymptotically efficient rank invariant test procedures. *Journal of the Royal Statistical Society: Series A*. 1972;135:185–207. [doi:10.2307/2344317](https://doi.org/10.2307/2344317)
- Royston P, Parmar MKB. Restricted mean survival time: an alternative to the hazard ratio for the design and analysis of randomized trials with a time-to-event outcome. *BMC Medical Research Methodology*. 2013;13:152. [doi:10.1186/1471-2288-13-152](https://doi.org/10.1186/1471-2288-13-152)

- Klein JP, Moeschberger ML. *Survival Analysis: A Self-Learning Text*.
  Springer.
- Collett D. *Modelling Survival Data in Medical Research*. Chapman & Hall/CRC.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.

*The "Cox proportional hazards model" article shows how to extend group
comparisons to adjusted, covariate-based analysis.*
