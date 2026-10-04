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

- Peto R, Peto J. Asymptotically efficient rank invariant test procedures. *Journal of the Royal Statistical Society: Series A*. 1972;135:185–207. [doi:10.2307/2344317](https://doi.org/10.2307/2344317)
- Royston P, Parmar MKB. Restricted mean survival time: an alternative to the hazard ratio for the design and analysis of randomized trials with a time-to-event outcome. *BMC Medical Research Methodology*. 2013;13:152. [doi:10.1186/1471-2288-13-152](https://doi.org/10.1186/1471-2288-13-152)

- Klein JP, Moeschberger ML. *Survival Analysis: A Self-Learning Text*.
  Springer.
- Collett D. *Modelling Survival Data in Medical Research*. Chapman & Hall/CRC.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.

*The "Cox proportional hazards model" article shows how to extend group
comparisons to adjusted, covariate-based analysis.*
