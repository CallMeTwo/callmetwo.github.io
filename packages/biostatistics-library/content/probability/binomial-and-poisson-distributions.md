---
title: Binomial and Poisson distributions
summary: Probability models for counts of events — fixed cohorts (binomial) and rare events over time (Poisson) — and when one approximates the other.
---

## Overview

The binomial distribution models the number of events among a fixed number n of independent trials, each with the same event probability p. The Poisson distribution models a count over a defined interval or exposure when events occur at average rate λ under assumptions approximating independent increments and constant intensity. Both are foundational for adverse events, infections, readmissions, and mortality, but their denominators and interpretations differ.

## Binomial model for a fixed cohort

For X~Binomial(n,p), P(X=k)=choose(n,k)pᵏ(1−p)ⁿ⁻ᵏ; mean=np and variance=np(1−p). The model assumes a fixed number of units, binary event status for each, independence, and a common probability. If 12 of 200 patients experience an event, observed risk is 6%; uncertainty can be summarized with Wilson or exact intervals.

```r
binom.test(12, 200)                 # exact interval and test
prop.test(12, 200, correct = FALSE) # score-based approximation
pbinom(12, size = 200, prob = .08)  # probability count <= 12 under p=.08
```

The binomial model is appropriate for a common follow-up horizon with fully observed status. Unequal follow-up, censoring, competing events, or recurrent events require other methods.

## Poisson model for counts and rates

For X~Poisson(λ), P(X=k)=e^(−λ)λᵏ/k!, with equal mean and variance λ. If observation time or population at risk differs, model a rate λ per exposure and include log(exposure) as an offset. A rate ratio compares event rates per person-time, not cumulative risk. Poisson counts can exceed the number of people when recurrent events occur.

A binomial count is approximated by Poisson when n is large, p is small, and λ=np is moderate. The approximation is useful for rare events, but it is not exact and may fail when risk is not small or events are dependent.

### Limitations and interpretation

Overdispersion occurs when variance exceeds the Poisson mean, often because risks vary across people, events cluster, or rates change over time. Use quasi-Poisson, negative binomial, random effects, or robust variance as appropriate. Excess zeros may arise from a separate structural process or simply a low mean; do not adopt zero-inflated models automatically. Check residuals and predicted counts.

State count, denominator or person-time, rate units, and event definition. Distinguish event count from number of participants with ≥1 event. Poisson and binomial models describe sampling distributions; neither establishes causation without design and confounding control.

## Worked binomial probability

If adverse-event risk is .08 in each of 50 independent participants, expected event count is np=4 and variance np(1−p)=3.68, SD≈1.92. The probability of at least one event is 1−.92⁵⁰≈.984, while chance of exactly four can be evaluated with the binomial mass function. Expected counts do not guarantee that the observed count will be near the mean in a small sample.

```r
n <- 50; p <- .08
c(mean = n*p, variance = n*p*(1-p),
  exactly4 = dbinom(4, n, p),
  at_least1 = 1 - dbinom(0, n, p))
```

The independence/common-probability assumptions can fail if risks differ by age or site or outcomes cluster. A beta-binomial or logistic model can represent heterogeneity; a single binomial model may understate predictive variation.

## Worked Poisson rate

Suppose 18 admissions occur over 600 person-years. Estimated rate is .03 per person-year, or 30 per 1,000 person-years. A Poisson model uses log(person-time) as offset. If groups have rates λ₁ and λ₀, the exponentiated treatment coefficient estimates rate ratio under the model.

```r
fit <- glm(events ~ arm + offset(log(person_years)),
           family = poisson, data = dat)
exp(coef(fit))
```

The coefficient for `arm` is log rate ratio relative to its reference group. Check overdispersion and include confounders only according to the design and estimand. Person-time offsets assume rate proportional to exposure duration, which can fail if hazards change strongly over time.

## Binomial versus Poisson

Binomial denominators are fixed individuals observed over a common window; Poisson denominators are exposure time or space, often with recurrent counts. A rare event in a fixed cohort can be approximated by Poisson with λ=np, but risk and rate are conceptually different. For mortality by a horizon, cumulative risk or survival probability is often preferable; for recurrent events, rate may be appropriate.

## Overdispersion and dependence

Poisson equidispersion Var(X)=E(X) is restrictive. Patient heterogeneity, clustering, contagion, or unmodeled time variation can inflate variance. Pearson dispersion statistic divided by residual df can flag overdispersion, but inspect fit and design. Negative binomial adds a dispersion parameter; quasi-Poisson scales variance but does not define a full likelihood; random effects model heterogeneity. Robust standard errors address some inference but not predictive distribution shape.

Excess zeros can arise because some patients are not at risk, through low rates, or through detection limits. Zero-inflated and hurdle models distinguish processes but require scientific rationale. Do not use them simply because a dataset contains many zeros.

### Exact uncertainty and interpretation

For binomial counts, exact Clopper–Pearson intervals have at least nominal coverage but can be conservative; Wilson intervals often perform well. For Poisson counts, an exact interval for event count can be translated to a rate by dividing by person-time. State exposure denominator and units. These models quantify uncertainty in counts under assumptions; they do not adjust for confounding, informative follow-up, or competing events.

### Exact and approximate calculations

For binomial X with n=50 and p=.08, mean=4 and variance=3.68. The probability of observing at most two events is P(X≤2), computed by summing binomial probabilities; a Poisson approximation with λ=4 gives a nearby but not identical value. Approximation is best when p is small and n large at fixed np. If p=.30, Poisson can be poor because events are no longer rare.

```r
pbinom(2, size = 50, prob = .08)
ppois(2, lambda = 50 * .08)
```

Check the tail of interest rather than assuming the approximation is acceptable from mean agreement alone. Exact binomial probabilities are inexpensive in most ordinary applications.

### Event rates, offsets, and follow-up

If one group contributes 500 person-years and another 300, raw counts are not directly comparable. A Poisson regression uses log person-time as an offset: log(E[count])=β₀+β₁treatment+log(time). Exponentiating β₁ gives rate ratio under the model. Exposure time should represent actual time at risk; pauses, loss to follow-up, or competing death change the denominator.

A constant rate assumes expected counts increase proportionally with exposure. If early and late hazards differ, a single offset model may not fit. Stratify time or use survival/recurrent-event methods. If only first event matters and censoring occurs, ordinary Poisson regression on total events may not estimate cumulative risk.

### Overdispersion and predictive uncertainty

If variance exceeds mean, standard Poisson SEs may be too small. Calculate residual deviance/df or Pearson chi-square/df as a rough diagnostic, then inspect mean-variance patterns and clustering. Negative binomial variance often takes μ+αμ². Quasi-Poisson estimates a scale factor for SEs but lacks a full likelihood for likelihood-ratio tests or AIC. Random effects can represent heterogeneity across patients or sites.

Prediction intervals for future counts should account for rate uncertainty and extra-Poisson variation. A confidence interval for mean rate is not a prediction interval for an individual site’s future events. Explain which target is reported.

## Confidence intervals and zero-event studies

For k events among n independent participants with common follow-up, Wilson intervals generally perform better than the simple Wald interval p̂±1.96√[p̂(1−p̂)/n], especially near 0 or 1. Exact binomial intervals guarantee at least nominal coverage but can be conservative. If zero events occur, the upper 95% risk bound is approximately 3/n under the rule of three. Zero observed events do not establish zero risk.

For a Poisson count k over exposure T, estimated rate is k/T. An exact confidence interval for λ can be calculated from chi-square quantiles and divided by T. With zero counts, an approximate upper 95% bound is 3/T. This bound assumes a stable Poisson process and complete event ascertainment.

### Model diagnostics in R

```r
fit <- glm(events ~ treatment + offset(log(person_years)),
           family = poisson, data = dat)
dispersion <- sum(residuals(fit, type = "pearson")^2) / df.residual(fit)
c(dispersion = dispersion, deviance = deviance(fit),
  residual_df = df.residual(fit))
```

Dispersion near one is compatible with the model but does not prove it. Inspect residuals by fitted value and time, influential observations, and zero patterns. If overdispersion exists, use negative binomial, quasi-likelihood, random effects, or robust variance according to the data process.

### Person-time interpretation

A rate of 30 per 1,000 person-years does not mean 3% risk in every participant. Converting rate to risk requires a hazard model and time horizon. Under constant hazard with no competing event, risk at one year is 1−exp(−.03)=2.96%, but varying hazards or competing mortality alter cumulative incidence. State rate units and avoid “percent” language for rates.

### Binomial versus Poisson regression

A binomial logistic model can estimate odds of at least one event over fixed follow-up; Poisson with offset models event rate over person-time. Modified Poisson regression with robust variance can estimate risk ratios for common fixed-horizon binary outcomes, but it is not the same as recurrent-event Poisson modeling. Choose model by outcome definition and denominator. Recurrent counts within individuals may require negative binomial or Andersen–Gill/frailty survival methods.

### Assumptions and interpretation

Binomial trials assume a common p; heterogeneous risks create beta-binomial overdispersion. Poisson assumes conditionally independent increments and a modeled intensity; clustering and unmeasured heterogeneity violate this. Both models can be extended, but extensions require assumptions and diagnostics. Report the event definition, window or person-time, count, denominator, effect measure, interval, and covariates. A rate ratio is an association unless design supports causal inference.

### Independence and common-risk assumptions

Binomial variance np(1−p) assumes each trial has same p and independent outcomes. If patient risks vary, marginal count variance can exceed binomial variance even without direct interaction; this is heterogeneity. Household transmission, shared clinic practice, and common exposures create dependence. Beta-binomial models allow p to vary across clusters; logistic mixed models can condition on covariates and random effects.

Poisson counts assume independent increments conditional on rate and constant intensity within modeled strata. Epidemic contagion violates independence as infections create future infections. A negative-binomial model can accommodate extra-Poisson variance but not necessarily represent transmission mechanism. For outbreaks, branching-process or transmission models may be appropriate.

### Rate ratios and absolute rates

A Poisson rate ratio compares events per person-time; report each arm’s rate as well as the ratio. A twofold rate increase from 1 to 2 per 1,000 person-years has a small absolute increment; from 100 to 200 has a much larger one. If person-time differs because of competing death or informative dropout, simple offsets may be biased. Describe follow-up and risk set.

### Zero inflation and hurdle processes

A zero-inflated model assumes a latent structural-zero group and a count-generating group; a hurdle model separately models any event and positive count intensity. These models can describe situations where some patients are not at risk or never use a service, but identification can be weak. Compare to negative binomial and assess predictive fit. Excess zeros alone are not sufficient evidence for a mixture mechanism.

## Choosing an analysis from the sampling frame

If each enrolled participant is followed for 30 days and event status is complete, a binomial risk is natural. If follow-up varies and total events accrue over person-time, a rate model may be more appropriate. If only time to first event matters with censoring, survival analysis is often preferable. If patients can have recurrent episodes, count models or recurrent-event methods may be needed. Write the event unit and time denominator before selecting a distribution.

### Data visualization

Plot observed counts against person-time or group, and compare mean and variance. A Poisson Q-Q plot or rootogram can show lack of fit; residuals by fitted value can reveal overdispersion. Show zero frequency and upper tail. Diagnostics should prompt model assessment, not automatic adoption of complex zero-inflated models.

### Confidence intervals for rates

For k Poisson events over T person-years, maximum-likelihood rate is k/T. A central exact 95% interval for the count mean is approximately [0.5χ²(2k,.025), 0.5χ²(2(k+1),.975)]; divide both bounds by T for a rate interval. For k=0, the lower bound is zero and the upper remains positive. This reinforces that no observed events does not mean risk is absent.

```r
k <- 18; T <- 600
rate <- k / T
ci <- c(.5 * qchisq(.025, 2*k),
        .5 * qchisq(.975, 2*(k+1))) / T
c(rate = rate, lower = ci[1], upper = ci[2])
```

Use a method appropriate to exposure process and event independence. Recurrent event counts from the same person may require robust or frailty variance, not an ordinary exact Poisson interval.

### Predictive versus inferential questions

A confidence interval for λ estimates uncertainty in the underlying rate. A predictive interval for a future count includes Poisson variation plus parameter uncertainty and is wider. For planning, probability of exceeding a safety threshold may be more useful than a rate interval. Simulate posterior or likelihood-based rates and counts under an explicit follow-up scenario.

### Worked comparison of risk and rate

If 12 of 200 participants have at least one event by 30 days, observed risk is 6%. If 18 events occur over 600 person-years, rate is 0.03 per person-year or 30 per 1,000 person-years. They need not describe the same estimand: the first counts participants, the second recurrent event episodes per time. A patient can contribute several Poisson events but only one binary “any event” outcome.

### Missing exposure time

Person-time should stop at event, loss to follow-up, death, or end of observation according to the estimand. Informative censoring can bias rate estimates if high-risk patients leave early. Use survival or inverse-probability methods where appropriate. An offset handles different exposure amounts under proportional rate assumption; it does not solve informative observation.

### Heterogeneity in event risk

A common binomial p assumes participants are exchangeable with equal conditional risk. Age, disease stage, and treatment adherence create risk variation; marginal event counts then show extra-binomial variation. Stratifying or modeling predictors can explain some heterogeneity. Random effects or beta-binomial models account for residual variation, but prediction for a new cluster must include between-cluster uncertainty.

### Model choice checklist

Define whether the outcome counts people, episodes, or time to first event; specify denominator and horizon; inspect variance and zero pattern; identify clustering and censoring; then choose binomial, Poisson, survival, or recurrent-event model. Report effect measure and units. No distribution choice substitutes for a meaningful event definition.

### Interpreting model coefficients

In logistic regression, exponentiated treatment coefficients are conditional odds ratios. In Poisson regression with a log offset, exponentiated coefficients are rate ratios. Neither is automatically a risk ratio. For common outcomes, the odds ratio can be far from the risk ratio; for fixed-window binary events, modified Poisson or marginal standardization may estimate risk ratios. State the link and outcome denominator.

### Descriptive and model-based summaries

Observed proportions and rates are useful descriptive anchors. Regression adjusts for covariates and can standardize to a target population, but depends on model form and positivity. Present absolute risks/rates with relative contrasts where possible. Model-based precision does not remove confounding or measurement error.

### A sample-size illustration

For a binomial risk near .10, a rough normal-approximation sample size for a 95% margin of error .04 is n≈1.96²(.10)(.90)/.04²≈216. Exact or Wilson precision differs, and attrition increases enrollment. For Poisson rates, expected event count determines relative precision; the approximate relative SE is 1/√k, so about 100 events yield roughly 10% relative SE before other design effects. Rare outcomes may require long follow-up or pooled evidence.

### Reporting checklist

Give event definition, participant count or person-time, observed count, rate/risk units, interval method, model family and offset, overdispersion assessment, and dependence structure. Include absolute rates and relative contrasts. This makes assumptions and denominator visible.

### Interpretation and causality

A binomial risk or Poisson rate is a descriptive or model-based outcome measure. The distribution specifies sampling variability; it does not establish that an exposure caused a difference. In observational data, adjust for confounding based on the causal question and discuss residual bias. Show event counts and absolute measures before interpreting a relative coefficient.

When presenting a count model, make clear whether “zero” means no event observed during complete follow-up or missing/unknown ascertainment. These cases have different likelihood contributions.



For person-time rates, state units such as events per 1,000 person-years and the observation window; never present the rate as a percent risk.


A rate ratio should be presented with each arm’s event count and person-time so the scale and denominator remain visible.

When follow-up differs by group, state how person-time was accumulated and whether event-dependent censoring could alter observed rates.

Include confidence intervals for both absolute risk/rate and relative treatment effect, and explain their distinct interpretations.

A model-based rate is conditional on the specified exposure process and may not transport across populations with different case mix.

Choose the denominator before interpreting a count.

Account for censoring when time at risk differs across participants.



### Summary of model assumptions

Binomial inference requires a fixed denominator and common event probability; Poisson inference requires an exposure-based count process with an appropriate rate structure. Clustering, heterogeneity, censoring, and recurrent outcomes may require extensions. Report the observed count and denominator so readers can judge the model’s context.


## References and further reading

- NIST/SEMATECH. [Poisson distribution](https://www.itl.nist.gov/div898/handbook/eda/section3/eda366j.htm).
- Cameron AC, Trivedi PK. [Regression Analysis of Count Data](https://doi.org/10.1017/CBO9780511814365). Cambridge University Press.

- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Biostatistics*. Pearson.
- Agresti A. *Categorical Data Analysis*. Wiley.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.

The [sampling distributions article](sampling-distributions-and-the-central-limit-theorem.html)
discusses when normal approximations to counts and proportions are useful.
