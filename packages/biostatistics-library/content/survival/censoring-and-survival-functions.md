---
title: Censoring and survival functions
summary: How censored observations are handled in time-to-event data, and what the survival function actually tells you.
---

## Overview and key ideas

Time-to-event data measure how long patients live, stay disease-free, or remain
free of a complication. In almost every real study, some patients are still
event-free when the study ends, are lost to follow-up, or experience a
competing event. These patients have not had the event of interest, but we do
not know when they would have had it. Their follow-up times are **censored**
rather than informative.

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

## References and further reading

- Klein JP, Moeschberger ML. *Survival Analysis: A Self-Learning Text*.
  Springer.
- Collett D. *Modelling Survival Data in Medical Research*. Chapman & Hall/CRC.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.

*The "Kaplan–Meier curves and the log-rank test" article develops the
non-parametric estimation of S(t) and group comparison in detail.*
