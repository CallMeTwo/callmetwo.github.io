---
title: Binomial and Poisson distributions
summary: Probability models for counts of events — fixed cohorts (binomial) and rare events over time (Poisson) — and when one approximates the other.
---

## Overview and key ideas

The **binomial distribution** models the count X of "successes" (events) among a
fixed number n of independent trials, each with event probability p:

P(X = k) = n choose k × p^k × (1 − p)^(n − k), with mean np and variance np(1 − p).

The **Poisson distribution** models counts of rare events occurring in a fixed
interval of time or space, with average rate λ (expected number of events):

P(X = k) = e^(−λ) × λ^k / k!, with mean = variance = λ.

The two are linked: when n is large and p is small, with λ = np, the binomial
is well approximated by the Poisson(λ). This is why rare-event data (adverse
reactions, outbreaks, deaths per 100,000 person-years) are usually analysed with
Poisson models even though the underlying process is binomial at its core.

## When to use it

| Setting | Example question |
| --- | --- |
| Binomial | Of 400 patients screened, how many will test positive if the true prevalence is 2%? |
| Binomial | Is the observed proportion of adverse events in a trial arm compatible with a stated baseline risk? |
| Poisson | How many nosocomial infections per 1000 patient-days are expected after an intervention? |
| Poisson | Is the number of rare serious adverse events in a safety signal higher than the historical rate? |

## Assumptions and limitations

- **Binomial:** n is fixed in advance; trials are independent; p is the same for
  every trial. Clustering (e.g. infection outbreaks within a ward) or heterogeneity
  in p violates the model.
- **Poisson:** events occur independently, at a constant average rate, and are
  rare enough that two events effectively cannot occur "at the same time".
- **Overdispersion** — when the observed variance exceeds the mean, Poisson-based
  inference is anti-conservative; quasi-Poisson or negative-binomial models are
  then appropriate.
- The Poisson *approximation* to the binomial works when n ≥ 20 and p ≤ 0.05
  (roughly); it is poor when p is moderate, no matter how large n is.
- For rate data, the Poisson model must be anchored to the right units
  (events per patient-days, per person-years) and the exposure time must be
  recorded for each subject.

### Counts, rates and model checking

The binomial denominator is a fixed number of eligible independent trials; its
parameter p is a probability, not a rate. A Poisson rate model allows unequal
follow-up by adding log person-time as an offset, so exp(β) represents a rate
ratio. The Poisson assumption equates conditional mean and variance; observed
overdispersion can arise from unmeasured risk heterogeneity, clustering or
serial dependence. Check residual variation and exposure definitions before
interpreting a narrow model-based interval. If the event probability varies
between patients, a beta-binomial or random-effects model may address extra
binomial variation more directly than treating each trial as having one common
p.

## Worked example

A clinic plans to screen 400 patients for a condition with true prevalence
p = 0.02. X ~ Binomial(400, 0.02), so the expected number of positives is
np = 8. Suppose the clinic would flag the screen as anomalous at 10 or more
positives. The exact binomial calculation gives

P(X ≥ 10) = 0.282.

The Poisson approximation with λ = np = 8 gives P(X ≥ 10) = 0.283 — virtually
identical, which is the approximation at work. Interpretation: even if the true
prevalence is exactly 2%, a result of 10+ positives would occur in roughly 28%
of such screens by chance alone, so a threshold of 10 is far too low to signal a
genuine rise in prevalence. A second, smaller example: if a rare adverse event
occurs at a mean rate of λ = 3 per 1000 patient-days, the chance of 5 or more in
a given 1000-day window is P(X ≥ 5) ≈ 0.185 — again, ordinary variation, not an
automatic alarm.

## Interpretation and common pitfalls

- **Treating Poisson counts as normal when λ is small** — with λ < 10 the
  distribution is visibly right-skewed; exact Poisson probabilities or the
  Poisson model itself are safer.
- **Ignoring overdispersion** — real clinical counts often vary more than the
  Poisson allows (clustering, patient heterogeneity), which understates
  uncertainty.
- **Using the Poisson approximation in the wrong regime** — with p = 0.3, no
  amount of n makes the Poisson a good approximation to the binomial.
- **Confusing the mean rate with the probability of a single event** — λ = 3
  events per window does not mean a 300% probability; for rare events the
  single-event probability is approximately λ divided by the number of
  opportunities.

## References and further reading

- NIST/SEMATECH. [Poisson distribution](https://www.itl.nist.gov/div898/handbook/eda/section3/eda366j.htm).
- Cameron AC, Trivedi PK. [Regression Analysis of Count Data](https://doi.org/10.1017/CBO9780511814365). Cambridge University Press.

- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Biostatistics*. Pearson.
- Agresti A. *Categorical Data Analysis*. Wiley.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.

The [sampling distributions article](sampling-distributions-and-the-central-limit-theorem.html)
discusses when normal approximations to counts and proportions are useful.
