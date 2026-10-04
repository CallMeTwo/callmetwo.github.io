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

## Choosing between binomial counts and Poisson rates

The binomial model describes the number of successes in a fixed number n of independent Bernoulli trials with common success probability p. Its mean is np and variance np(1−p). The number of patients with an event among 100 followed participants is naturally binomial if follow-up and outcome definitions are comparable and observations are independent. If risks differ substantially across patients or observations cluster by clinic, the simple binomial variance can be too small.

The Poisson model describes a count N over a specified exposure E with rate λ, so E(N)=λE and Var(N)=λE. A rate is events per person-time, not a probability. Under a constant hazard, the probability of at least one event over time t is 1−exp(−λt), which is approximately λt only for small λt. A Poisson regression with log exposure offset models rates: log E(N_i)=log(E_i)+x_iβ. The offset coefficient is fixed at one, ensuring longer observation contributes proportionally more expected events.

Poisson assumptions include conditional independence of event increments, a constant rate over the modeled interval, and equality of mean and variance conditional on covariates. Overdispersion can arise from unmeasured heterogeneity, clustering, or recurrent events; a negative-binomial model adds a dispersion parameter. Zero inflation is not a diagnosis based solely on many zeros: first ask whether the sampling process permits structural zeros and whether the mean model is misspecified. For common binary outcomes, do not substitute a Poisson model without robust variance and a clear reason; direct binomial models are often preferable.

### Worked example: events per person-time

A cohort contributes 1,200 person-years and experiences 36 first events. The crude incidence rate is 36/1,200=0.03 per person-year, or 3 per 100 person-years. Under a constant Poisson rate, the one-year probability is 1−exp(−0.03)=0.0296 (about 3%). Over five years it is 1−exp(−0.15)=0.139, not simply 5×3%=15%, although the linear approximation is close at low cumulative risk.

```r
events <- 36
person_years <- 1200
rate <- events / person_years
risk_1y <- 1 - exp(-rate * 1)
risk_5y <- 1 - exp(-rate * 5)
c(rate_per_100_py = 100 * rate, risk_1y = risk_1y, risk_5y = risk_5y)
```

This conversion assumes a constant hazard and no competing risk. In real follow-up, hazards may change with time and censoring may be informative. A cumulative incidence estimator or survival model is then more appropriate. The crude rate's confidence interval can be computed from a Poisson count interval divided by person-time; using a normal interval near zero is unreliable.

### Comparing two rates with an offset

Suppose 20 events occur during 800 person-years in a control group and 15 during 1,000 person-years in a treatment group. Rates are 2.5 and 1.5 per 100 person-years; the crude rate ratio is 0.60. A Poisson regression can adjust for covariates while accounting for unequal observation time through an offset. It estimates a conditional rate ratio under the log-linear rate model; it is not automatically a risk ratio.

```r
d <- data.frame(events = c(20, 15), py = c(800, 1000),
                treatment = c(0, 1))
fit <- glm(events ~ treatment + offset(log(py)),
           family = poisson(), data = d)
exp(coef(fit))
```

Two aggregate rows are insufficient for meaningful regression or variance estimation; this code only demonstrates model syntax. Fit such a model to participant- or stratum-level data, inspect residual deviance and overdispersion, and use robust or clustered uncertainty when the design requires it. A zero-event group can produce unstable maximum-likelihood estimates; exact methods or suitable Bayesian models may be needed.

### Model checks and communication

Show event counts, denominators, person-time, and rates with intervals. State whether recurrent events count once or repeatedly, and how death or loss to follow-up ends exposure time. Check whether rates vary by calendar time or follow-up duration. If mean counts greatly exceed variance, the Poisson model may be inadequate; if variance exceeds mean, investigate clustering and heterogeneity before selecting a dispersion adjustment. References such as Cameron and Trivedi provide deeper count-model treatment.


## Binomial inference and confidence intervals

For X~Binomial(n,p), the probability mass at x is choose(n,x)p^x(1−p)^(n−x). The sample proportion X/n estimates p with SE approximately sqrt[p(1−p)/n]. A Wald interval uses the estimated SE and can extend below zero or above one, with poor coverage near the boundaries. The Wilson score interval inverts a score test and generally has more reliable coverage; the exact Clopper–Pearson interval guarantees at least nominal coverage but can be conservative.

### Worked example: uncertainty for an event risk

If 12 of 80 patients experience an adverse event, p̂=.15. The Wald interval is .15±1.96√(.15×.85/80), approximately .071 to .229. A Wilson interval is approximately .087 to .248. The difference is noticeable because the sample is modest. Always report numerator and denominator with the interval and clarify whether the denominator is all randomized participants, treated participants, or those with observed follow-up.

```r
x <- 12; n <- 80
wald <- x/n + c(-1, 1) * qnorm(.975) * sqrt((x/n)*(1-x/n)/n)
w <- prop.test(x, n, correct = FALSE)$conf.int
c(wald_lower = wald[1], wald_upper = wald[2],
  wilson_lower = w[1], wilson_upper = w[2])
```

`prop.test` uses a score-based method without continuity correction in this example. For very small expected counts or an exact coverage requirement, `binom.test` provides the Clopper–Pearson interval. Neither method corrects bias from missing outcomes or unequal follow-up.

## Poisson uncertainty and overdispersion

For a Poisson count X with mean μ, the variance equals μ. A confidence interval for a rate λ with x events over exposure T can be formed from a Poisson interval for μ divided by T. If x=0, the maximum-likelihood rate is zero, but the true rate is not known to be zero; an upper confidence bound is essential. The “rule of three” gives an approximate 95% upper bound of 3/T after zero events under a Poisson model.

```r
x <- 0; exposure <- 500 # person-years
upper_rate_95 <- qchisq(.95, df = 2*(x + 1)) / (2 * exposure)
1000 * upper_rate_95 # upper bound per 1,000 person-years
```

For x events, the exact two-sided interval uses chi-square quantiles with 2x and 2(x+1) degrees of freedom for lower and upper limits, divided by 2T. This assumes a constant rate and independent Poisson increments. With heterogeneity across patients, variation may exceed the mean. Examine Pearson dispersion or residual deviance relative to degrees of freedom, but investigate cause: omitted covariates, clusters, and repeated events call for different models.

A negative-binomial distribution can be parameterized with mean μ and dispersion α, giving variance μ+αμ². As α approaches zero it converges toward Poisson. Robust sandwich standard errors can address some variance misspecification for coefficient uncertainty, but they do not fix incorrect mean structure or guarantee good small-sample inference. For clustered counts, use cluster-robust methods or hierarchical random effects; for recurrent events, explicitly define the event process and dependence.

## Exposure offsets and interpretation

If participant i contributes person-time Ti, the Poisson model uses log(Ti) as offset so E(Xi)=Ti exp(xiβ). Exponentiating β gives a rate ratio conditional on covariates. A one-unit increase in a continuous predictor multiplies the rate by exp(β); for a binary treatment, exp(β) compares rates under treatment and control. This contrast is not a cumulative risk ratio except under restrictive constant-hazard conditions and a shared follow-up horizon.

The denominator person-time should stop at a clearly specified event, censoring, or competing event. Death prevents later occurrence of nonfatal outcomes and can make crude rates hard to compare if mortality differs by group. Cause-specific rates and cumulative incidence answer different questions. Calendar time, recurrent events, and staggered enrollment can also violate a constant rate. Use piecewise rates or flexible survival methods when hazards vary materially.

## Model diagnostics

Plot observed counts versus fitted means, examine residuals by time and exposure, and assess excess zeros and influential observations. Check whether adding covariates explains apparent overdispersion. Compare Poisson and negative-binomial fits using substantive interpretation and diagnostics rather than a test alone. Report dispersion assumptions, offset definition, and uncertainty method. Cite Cameron and Trivedi for count regression and Rothman for rate interpretation; the survival-analysis articles extend the treatment of person-time and censoring.


## Exact tails and planning probabilities

The binomial distribution calculates probabilities for a fixed number of independent opportunities. If an adverse event probability is .03 per dose over 20 doses, the expected count is .6 but the probability of at least one event is 1−.97^20=.456. The Poisson approximation with mean np=.6 gives 1−e^(−.6)=.451, close because p is small and n is moderate. For common events or small n, calculate binomial probabilities directly.

```r
n <- 20; p <- .03
c(binomial_at_least_one = 1 - dbinom(0, n, p),
  poisson_approximation = 1 - exp(-n*p))
```

This comparison assumes each dose has the same independent risk. Repeated dosing may create cumulative susceptibility, tolerance, or treatment discontinuation; the independent-trial model then misstates risk. Use the formula for planning only when the per-opportunity model fits the process.

## Choosing binomial, Poisson, or survival analysis

Use binomial likelihood for a fixed number of people with a binary outcome over a common time horizon. Use Poisson regression for counts with exposure time when an event rate is meaningful and the log-linear rate structure is plausible. Use survival analysis when time to first event and censoring matter. These frameworks are related but estimate different quantities. A Poisson model with person-time is not automatically a substitute for Kaplan–Meier risk, particularly when hazards vary or competing events occur.

For common binary outcomes, modified Poisson regression with robust variance can estimate risk ratios, but predicted means may exceed one and the model is an estimating approach rather than a literal Poisson data model. Log-binomial regression directly models risk ratios but can have convergence problems. Logistic regression is stable but produces odds ratios. State the target measure and method explicitly.

## Overdispersion and predictive calibration

A residual deviance much larger than degrees of freedom may suggest overdispersion, but investigate mean misspecification and dependence. Plot residuals against fitted values and covariates; check site-level patterns, time trends, and zero counts. For prediction, compare observed and expected counts across risk groups. Confidence intervals for coefficients do not prove that predicted event counts are calibrated. For sparse outcomes, penalized likelihood or Bayesian regularization may stabilize estimates, but external validation remains necessary.

## Rate ratios and absolute rates together

A rate ratio of 0.60 can arise from rates 2.5 versus 1.5 per 100 person-years, or from 25 versus 15 per 100 person-years. Relative effects match, absolute burden differs tenfold. Report both rates, their uncertainty, person-time, and a clinically interpretable time horizon. If hazards are roughly constant, convert rate to risk with 1−exp(−λt), but explain that this assumes a stable rate and no competing events.

For a rate ratio from two independent Poisson counts, the approximate standard error of the log ratio is sqrt(1/x1+1/x0). With few events, use exact methods or profile likelihood. Zero counts create an infinite or zero ratio; arbitrary continuity corrections can materially change results. Bayesian priors or exact conditional procedures can handle sparse data more transparently.

## Excess zeros require a process explanation

A zero-inflated model posits two processes: a structural-zero state and a count-generating state. A hurdle model separately models any event versus positive count and then the positive count distribution. These models can be useful when some participants are not at risk at all, but can overfit if zeros are merely expected under a low Poisson mean. Compare predicted and observed zero proportions and assess whether the proposed “never event” group makes clinical sense. Model complexity should be supported by enough positive counts.

A final model report should distinguish the observed count, expected count, and estimated parameter. For a binomial result, give events/participants and risk; for a Poisson result, give events/person-time and rate. Include confidence intervals and state any offset, overdispersion correction, clustering, or exact method. This simple format makes it harder to confuse incidence proportion with incidence rate.

## Follow-up windows and person-time accounting

Person-time should accrue only while a participant is observable and at risk for the event under the analysis definition. If an event is counted once, stop at the first event; if recurrent events are counted, specify how time after the first event contributes. Death, withdrawal, and end of study may end observation at different times. Incorrectly retaining time after an event or omitting unequal exposure creates a biased rate. Provide a flow diagram or table showing events and person-time by group.

## References and further reading

- NIST/SEMATECH. [Poisson distribution](https://www.itl.nist.gov/div898/handbook/eda/section3/eda366j.htm).
- Cameron AC, Trivedi PK. [Regression Analysis of Count Data](https://doi.org/10.1017/CBO9780511814365). Cambridge University Press.

- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Biostatistics*. Pearson.
- Agresti A. *Categorical Data Analysis*. Wiley.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.

The [sampling distributions article](sampling-distributions-and-the-central-limit-theorem.html)
discusses when normal approximations to counts and proportions are useful.
