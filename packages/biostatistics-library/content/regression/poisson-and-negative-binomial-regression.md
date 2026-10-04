---
title: Poisson and negative binomial regression
summary: Models count outcomes and incidence rates with log-link models, extending from the equidispersed Poisson to the overdispersed negative binomial.
---

## Overview and key ideas

Poisson regression models a count outcome (or an event rate per unit of exposure time) as the dependent variable: log(μ) = β₀ + β₁X₁ + …, where μ is the expected count (or rate) and the link is the natural logarithm. Exponentiating a coefficient gives a rate ratio (RR), also called a multiplicative incidence-rate ratio: for a one-unit increase in Xⱼ the expected count/rate is multiplied by e^βⱼ, holding other predictors fixed. Because log(μ) = log(count) − log(offset), including log(person-time) as an offset lets the model estimate *incidence rates* (events per person-year) while adjusting for unequal follow-up.

The Poisson distribution has a built-in constraint: its variance equals its mean. In real health data the variance of counts is often larger — for example, a few patients account for many relapses while most have none. That *overdispersion* can make Poisson standard errors too small and p-values too small. The negative binomial regression is a common remedy: in the NB2 parameterization it adds a dispersion parameter α≥0 and has variance μ+αμ²; as α→0 the model approaches the Poisson. Other software uses a size parameter θ=1/α, for which the Poisson limit is θ→∞. Be explicit about parameterization. Rate-ratio estimates may be similar under the two models, but standard errors and predictions can differ materially.

## When to use it

| Setting | Example question |
| --- | --- |
| Cohort follow-up | Do diabetes and statin use affect the incidence rate of new cataracts per person-year? |
| Recurrent events | How do age and severity score predict the number of asthma ER visits per year? |
| Infectious disease | Is vaccination associated with a lower rate of infections per month? |
| Resource use | Which patient factors predict the number of readmissions in one year? |

Use it when the outcome is a non-negative integer count or a rate with person-time, and you want an interpretable multiplicative effect. If only a very few events per subject matter and the outcome is effectively binary, logistic regression is simpler. If the outcome is time-to-*first* event rather than a count, Cox regression is the usual tool.

## Assumptions and limitations

- **Independence of counts**: one count per subject per period; recurrent events on the same subject are dependent, which requires a GEE or mixed model with the same log link.
- **Correct exposure measurement**: with person-time, follow-up must be recorded accurately; left truncation and administrative censoring change the valid at-risk time.
- **Equidispersion (Poisson only)**: var(count) = mean(count). Check by comparing the residual deviance to its degrees of freedom, or by estimating the dispersion parameter; deviance df much above 1 signals overdispersion.
- **Linearity on the log scale** for continuous predictors.
- **Zero inflation**: a large excess of *structural* zeros (patients who can never have the event) is not handled by the negative binomial and may call for a zero-inflated or hurdle model.

## Worked example

A cohort of 4,000 patients with inflammatory bowel disease contributes 9,800 person-years and 1,470 hospitalisations. A Poisson model with an offset of log(person-time) and the covariates age (per 10 years) and prior hospitalisations in year 1 (count) gives: log(rate) = −1.90 + 0.18·(age/10) + 0.42·(prior admissions). A 50-year-old with 2 admissions last year has expected rate e^(−1.90 + 0.90 + 0.84) = e^−0.16 ≈ 0.85 admissions/year, versus e^(−1.90 + 0.90 + 0) = 0.37/year for a same-age patient with 0 — a rate ratio of e^0.42 = 1.52 (95% CI 1.30 to 1.77): each extra prior admission is associated with a 52% higher admission rate. The residual deviance was 2,150 on 1,240 df (ratio ≈ 1.73), indicating marked overdispersion; refitting the same model as negative binomial gave α ≈ 0.45 and a rate ratio of 1.55 with a wider 95% CI of 1.31 to 1.83 — the effect is similar, but only the negative binomial CI is trustworthy.

## Interpretation and common pitfalls

- A rate ratio of 1.5 means the *rate* is 50% higher, not that the probability of the event rises by 0.5 — rates per person-time are not probabilities, and they can exceed 1 for recurrent events.
- Always check dispersion before trusting Poisson p-values; reporting Poisson inference on overdispersed data makes everything look more significant than it is.
- Do not use Poisson regression as a shortcut for a binary outcome with a "large denominator"; the models answer different questions (rare-event approximation only).
- For recurrent events, an ordinary Poisson model on the total count ignores within-subject correlation; use a GEE/mixed model with a log link and report the design effect.

Use an exposure offset when subjects contribute different person-time: log E(Yᵢ) = Xᵢβ + log(Tᵢ), so exp(β) compares rates per unit time. The offset coefficient is fixed at one; it is not an estimated predictor. Poisson variance equidispersion is a distributional assumption, and robust standard errors can protect inference against some variance misspecification but do not change the fitted mean. Negative-binomial regression models extra-Poisson variation; zero inflation should be used only when a distinct structural-zero process is substantively plausible, not simply because the sample has many zeros. Check residual patterns and predicted counts, and report the time or exposure denominator.

## Poisson likelihood, offsets, and interpretation

For a count Y_i with mean μ_i, Poisson regression assumes P(Y_i=y)=exp(−μ_i)μ_i^y/y! and log(μ_i)=X_i'β. If participant i contributes exposure time T_i, set log(μ_i)=X_i'β+log(T_i), with log(T_i) as an offset whose coefficient is fixed at one. Then exp(X_i'β) is the event rate per unit exposure, and exp(β_j) is a conditional rate ratio for a one-unit predictor contrast. Without an offset, the model predicts counts at the observed exposure scale and may confound opportunity time with risk.

In the example, overall crude rate is 1,470/9,800=.15 admissions per person-year. The model's illustrative predictor calculation is exp(−1.90+.18(5)+.42(2))=exp(−.16)=.852/year. For same age and no prior admissions, rate is exp(−1.00)=.368/year; ratio=.852/.368=exp(.84)=2.32 for two additional prior admissions, or exp(.42)=1.52 per additional admission. This is an expected rate, not the probability of at least one hospitalization. Under a constant rate and no competing event, a one-year event probability would be 1−exp(−rate), but recurrent counts and nonconstant hazards complicate that conversion.

```r
rate <- exp(-1.90 + .18*(50/10) + .42*2)
rate_zero_prior <- exp(-1.90 + .18*(50/10))
c(rate = rate, rate_zero_prior = rate_zero_prior,
  ratio_for_two_admissions = rate/rate_zero_prior,
  RR_per_admission = exp(.42), crude_rate = 1470/9800)
```

The model values are illustrative and need participant-level data to fit. Exposure time must be positive; zero or mismeasured time cannot be handled by taking its log. Define when time at risk begins and ends, including treatment changes, death, and censoring.

## Equidispersion and negative-binomial variance

Under Poisson, Var(Y|X)=μ. Overdispersion means conditional variance exceeds the mean and often arises from omitted heterogeneity, clustering, repeated events, or a wrong mean function. The NB2 model has Var(Y|X)=μ+αμ², with α≥0; α→0 gives Poisson. Some software parameterizes θ=1/α (size), so large θ is the Poisson limit. The negative binomial can be derived as a gamma mixture of Poisson rates, representing unobserved heterogeneity. It handles extra-Poisson variation in counts but does not automatically model within-person temporal dependence or informative censoring.

A dispersion statistic such as Pearson χ²/df or residual deviance/df is a screening diagnostic, not a formal proof. A large value can reflect omitted nonlinear terms, excess zeros, site clustering, or influential counts. Robust sandwich standard errors may protect coefficient inference under some variance misspecification when the mean model is correct and sample size adequate; they do not fix a wrong fitted mean or dependence. Diagnose mechanism before selecting NB, GEE, random effects, hurdle, or zero-inflated models.

## Event process and choice of model

Distinguish first-event incidence from recurrent-event burden. A first-event count per person-time is often naturally modeled with survival analysis, especially if hazard changes over time or death competes. Recurrent admissions can use count regression, but repeated events within the same patient are correlated. GEE targets population-average rate ratios; mixed-effects Poisson/NB models target subject-specific conditional effects given random effects. These differ in interpretation. State whether follow-up after a first event contributes and how death truncates exposure.

Structural zeros require a substantive mechanism: some individuals may be not-at-risk, while others have a count process. Hurdle models separately model any event and positive counts; zero-inflated models mix a structural-zero process with a count distribution that itself can produce zeros. Many zeros alone do not justify these models, especially when low expected rates naturally produce zeros. Compare predicted and observed zero frequencies and validate predictions.

## R workflow and model interpretation

```r
fit_p <- glm(events ~ treatment + age + offset(log(person_years)),
             family = poisson(), data = dat)
summary(fit_p)
exp(cbind(RR = coef(fit_p), confint(fit_p)))
# Example NB2 fit using MASS; parameterization should be checked
fit_nb <- MASS::glm.nb(events ~ treatment + age + offset(log(person_years)),
                        data = dat)
summary(fit_nb)
```

Report the offset unit, count definition, variance model, dispersion assessment, and whether inference is robust or model-based. An exponentiated coefficient is a rate ratio conditional on included predictors; it is not a risk ratio or hazard ratio. With recurrent event data, use patient-clustered uncertainty or a model explicitly representing within-person dependence. Validate predicted count distributions, not only coefficient signs.


## Rate ratio uncertainty and predicted counts

In the log-link model, a treatment coefficient β_T has rate ratio exp(β_T). A Wald interval on the log scale is exp[β̂_T±1.96SE(β̂_T)], which preserves positivity. For sparse events or small clusters use profile likelihood, exact methods, or small-sample corrections. Report event counts and person-time by group in addition to adjusted rate ratios so absolute burden remains visible.

For the inflammatory-bowel-disease example, observed crude rate=0.15 per person-year. A constant-rate approximation gives 1−exp(−.15)=.139 one-year probability of at least one event, not .15 exactly. But the fitted recurrent-event mean can exceed one, and a person can have multiple admissions. This conversion is only appropriate for a first-event process with constant hazard and no competing event; do not turn a recurrent count rate into a patient risk without defining the event process.

## Negative-binomial model details

The NB2 variance is μ+αμ². One common parameterization has `theta=1/alpha`; gamma mixing gives individual-specific latent rate variability. Large α permits substantial overdispersion, while α near zero approaches Poisson. NB1 is another parameterization with variance μ+αμ, so software output and documentation should be checked before interpreting a dispersion value. Do not compare raw alpha across packages without matching parameterization.

A likelihood-ratio test of α=0 is on a boundary of parameter space, so the ordinary chi-square reference can be imperfect; information criteria, residual checks, and predictive performance provide context. A large overdispersion statistic can result from unmodeled time trends or site heterogeneity; an NB model may absorb variability but not explain it. For cluster-randomized data, random effects or GEE may be preferable to a single marginal NB variance.

## Offsets and exposure definition

Offsets encode proportional opportunity: a patient with twice as much observed time has twice the expected count if the rate is stable. If exposure is not proportional—risk rises after surgery, for example—split follow-up into intervals or use a time-varying hazard model. Person-time after treatment discontinuation may or may not belong, depending on treatment-policy estimand. Define whether exposure includes time after first event for recurrent counts and how death or loss to follow-up ends accumulation.

```r
# Aggregate demonstration; actual inference needs independent units/strata
events <- c(20, 15)
py <- c(800, 1000)
crude_rates <- events / py
c(rates_per_100py = 100*crude_rates,
  crude_rate_ratio = crude_rates[2]/crude_rates[1])
```

The example's crude rates are 2.5 and 1.5 per 100 person-years and treatment/control ratio .60 if control is first. With only two aggregate rows, a regression standard error is not estimable; use person- or stratum-level data and account for clustering.

## Model checks and alternatives

Inspect fitted versus observed counts, Pearson residuals, zeros, large counts, temporal trends, and predictor functional forms. Check sensitivity to Poisson with robust SE, negative binomial, and clustered models where design supports them. Zero-inflated models should only represent a plausible separate no-risk process; hurdle models may be more interpretable when event occurrence and recurrence are distinct stages. Validate prediction of total count and tail burden, not only average rates.

## Estimating rates from aggregate data

For an unadjusted Poisson count x over exposure T, maximum-likelihood rate is x/T. A rough standard error is sqrt(x)/T, so the log-rate SE is 1/√x when x>0. With 36 events in 1,200 person-years, rate=.03 per person-year and approximate 95% interval on log scale is exp[log(.03)±1.96/6], roughly .021 to .043. Exact Poisson intervals are preferable for low counts. At zero events the log method fails; an upper bound remains necessary.

```r
x <- 36; T <- 1200
rate <- x/T
c(rate = rate,
  lower = exp(log(rate) - 1.96/sqrt(x)),
  upper = exp(log(rate) + 1.96/sqrt(x)))
```

This assumes a homogeneous Poisson process and known exposure. Clustering and heterogeneity widen uncertainty; using participant-level models or robust variance may be needed. A crude rate interval and adjusted model interval answer related but distinct questions.

## Interpreting coefficients with interactions and offsets

If treatment interacts with time or severity, exp(β_treatment) is the rate ratio only at the reference value of the interacting covariate. Center continuous modifiers at a meaningful value and calculate contrasts. An offset is not a covariate with estimated effect; omitting it changes the estimand from rate to count. Using log follow-up as a regular predictor estimates an exposure relationship rather than enforcing proportionality and is rarely a substitute for a proper offset.

Check whether exposure time depends on prognosis. If sicker patients are followed longer or die sooner, simple person-time rates can be informative but may not correspond to cumulative patient risk. Use survival or recurrent-event approaches and address informative censoring when needed.

## Compare fitted rates in interpretable units

Suppose treatment coefficient is β=−.30 with SE=.12. Rate ratio=exp(−.30)=.741, interval exp(−.30±1.96×.12)=(.586,.936). If control rate is 4 events per 100 person-years, the fitted treatment rate is about 2.96 per 100 person-years under the log-linear model. This is an adjusted rate comparison; multiply by person-time only when predicting expected event counts and keep the exposure unit explicit.

```r
beta <- -.30; se <- .12; rate0 <- 4
rr_ci <- exp(beta + c(-1,1)*1.96*se)
c(RR = exp(beta), lower = rr_ci[1], upper = rr_ci[2],
  treatment_rate_per_100py = rate0*exp(beta))
```

If baseline rate varies by covariates, use standardized predictions to obtain population-average absolute rates. A conditional coefficient alone does not give the population event reduction.

## Diagnostics and reporting checklist

Report the count-generating unit, event definition, recurrent-event handling, follow-up exposure, offset units, link, variance family, dispersion assessment, and uncertainty correction. Show counts and crude rates before adjusted coefficients. State whether the model estimates subject-specific or population-average associations. Include a fitted-versus-observed check and assess residuals over time and by important predictors. These details let readers determine whether a rate ratio is interpretable in their setting.

For recurrent admissions, a count model's expected value can be greater than one and represents mean episodes per exposure period. If policy decisions concern the probability of avoiding any admission, report that probability separately from the rate. If a first event ends observation, survival models preserve event timing and censoring more directly. Naming the outcome process avoids treating every count model as a generic “risk model.”

When the count is bounded by a fixed number of opportunities (for example, number of successful tasks out of 10), a binomial model may fit the support better than Poisson. If events are rare and opportunity is large, a Poisson approximation can be convenient, but assess mean-variance behavior. The outcome's generating process and denominator should determine the family, not a rule that all counts use Poisson.

A rate ratio is conditional on the covariate values and exposure definition. If the treatment is assigned and follow-up differs because of competing death, exposure-time offsets alone may not answer a treatment-policy question. Present cumulative incidence or restricted mean quantities where clinically appropriate, alongside rates, and explain the estimand.

## References and further reading

- Cameron AC, Trivedi PK. Regression-based tests for overdispersion in the Poisson model. *Journal of Econometrics*. 1990;46:347–364. [doi:10.1016/0304-4076(90)90014-K](https://doi.org/10.1016/0304-4076(90)90014-K)

- Agresti A. *Categorical Data Analysis*. Wiley.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and Other Advanced Topics*. Brooks/Cole.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- The [Cox proportional hazards article](../survival/cox-proportional-hazards-model.html) covers regression for time-to-first-event outcomes.
