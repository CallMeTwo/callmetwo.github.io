---
title: Poisson and negative binomial regression
summary: Model event counts and rates with log links and exposure offsets, diagnose overdispersion, and interpret incidence-rate ratios on an absolute scale.
---

## Overview

Poisson and negative-binomial regression model nonnegative event counts. They are useful for hospital admissions, infections, recurrent events, and adverse-event counts, especially when observation time or population size varies. A log link ensures fitted means are positive; an offset incorporates exposure such as person-time.

Poisson regression assumes conditional mean equals conditional variance. Health counts often vary more than Poisson allows because of unmeasured heterogeneity, clustering, or outbreaks. Negative-binomial regression adds a dispersion parameter. Neither model automatically handles zero inflation, dependence, confounding, or informative exposure; those features need explicit modeling.

## Mean model, log link, and offset

For count (Y_i), a Poisson model specifies (Y_i\sim\text{Poisson}(\mu_i)) and \(\log(\mu_i)=\beta_0+X_i\beta+\log(E_i)\), where (E_i) is exposure. The offset coefficient is fixed at 1, so \(\mu_i/E_i\) is the modeled event rate. Exponentiated coefficients are incidence-rate ratios (IRRs), conditional on included predictors.

If 100 patients contribute 500 person-years and 50 events occur, crude rate is 0.10 events per person-year. A treatment coefficient −0.223 gives IRR \(e^{-0.223}=0.80\), or 20% lower event rate conditional on covariates. If control rate is 0.10, model implies treated rate about 0.08 under common assumptions. For recurrent events, the rate can exceed one per person-year and is not a probability.

```r
fit_pois <- glm(events ~ treatment + age + offset(log(person_years)),
                data = dat, family = poisson())
exp(cbind(IRR = coef(fit_pois), confint(fit_pois)))
```

Exposure must be positive and correctly measured. A zero exposure means no time at risk and usually contributes no count information. If exposure varies across periods, use the appropriate person-time or population denominator. A changing denominator can reverse conclusions based on raw counts.

## Negative-binomial variation

The negative-binomial model permits variance greater than mean, commonly parameterized as \(Var(Y_i)=\mu_i+\alpha\mu_i^2\). When \(\alpha=0\), it approaches Poisson; larger \(\alpha\) represents extra-Poisson heterogeneity. It is useful for overdispersed counts but does not explain the source of heterogeneity.

```r
library(MASS)
fit_nb <- glm.nb(events ~ treatment + age + offset(log(person_years)),
                 data = dat)
exp(cbind(IRR = coef(fit_nb), confint(fit_nb)))
```

Compare fitted means and residual patterns, not only a dispersion test. Quasi-Poisson inflates standard errors by a dispersion factor but lacks a full likelihood; negative binomial estimates a likelihood-based heterogeneity parameter. Robust sandwich standard errors can address some variance misspecification with enough independent units, but not omitted clustering or wrong mean.

## Worked example: infection rates

In a cohort, 30 infections occur during 600 catheter-days in usual care, and 24 occur during 640 catheter-days after a prevention bundle. Crude rates are 5.0 and 3.75 per 100 catheter-days; rate ratio is 0.75. A Poisson model with log catheter-days offset estimates an adjusted IRR, perhaps 0.78 after accounting for unit and patient severity. Report counts, exposure, rates, IRR, and interval. The estimate means a lower conditional incidence rate, not a 22% reduction in each patient's probability.

If infections cluster by ward and month, standard Poisson variance may be too small. Include ward effects, use negative binomial or robust variance clustered by ward, and consider temporal dependence. With only five wards, sandwich inference may be unreliable; a cluster-level or small-sample method may be needed.

### Estimating the crude rate ratio by hand

The usual care rate is (30/600=0.05) per catheter-day; bundle rate is (24/640=0.0375). Their ratio is (0.0375/0.05=0.75). An approximate standard error for the log rate ratio is \(\sqrt{1/30+1/24}=0.274\), giving a log interval \(\log(0.75)\pm1.96(0.274)\), or −0.824 to 0.250. Exponentiating yields about 0.44 to 1.28. The interval is wide and includes no difference; the point estimate alone overstates certainty.

This calculation assumes independent Poisson counts and fixed exposure. Clustering and overdispersion widen uncertainty. If there are repeated periods or ward-level dependence, use a model reflecting those units and report the number of independent wards. A more complex adjusted analysis should not obscure the sparse numerator.

Attribution to the bundle requires more than an IRR. If units adopted the bundle at different times, account for calendar trend and concurrent infection-control changes. If only before-after rates are compared, regression to the mean or surveillance intensity may explain part of the difference. State the design and causal assumptions.

## Assessing overdispersion and excess zeros

For a fitted Poisson model, residual deviance divided by residual degrees of freedom is a rough dispersion diagnostic; values well above 1 suggest extra variation, but interpretation depends on model and sample size. Pearson residual dispersion, simulation-based residual checks, and observed-versus-predicted count distributions provide additional evidence. A formal test can detect trivial overdispersion in large samples.

Many zeros do not automatically justify a zero-inflated model. Zeros may be expected from low means under ordinary Poisson. A zero-inflated model assumes a separate structural-zero process plus count process; a hurdle model separates zero versus positive outcomes and models positive counts. Use them only when a plausible mechanism exists and data support added parameters.

### What the dispersion parameter represents

In a negative-binomial model, \(\alpha\) represents residual variation beyond the conditional mean after included predictors. It can reflect omitted heterogeneity, contagion, clustering, or a mixture of rates. It is a statistical accommodation, not an explanation of why variation exists. If wards have persistent rate differences, a random ward effect may be more interpretable; if counts correlate within ward over time, a temporal correlation structure may also be needed.

Overdispersion affects uncertainty and sometimes point estimates. Under a correct log-mean, Poisson coefficients can remain consistent despite variance misspecification, but standard errors are too small; with omitted structure tied to predictors, coefficients can be biased. Quasi-Poisson adjusts variance but cannot support likelihood-based likelihood-ratio tests or AIC in the usual way. Negative binomial has a full likelihood but assumes a particular mean-variance relationship. Compare estimates and predictions across plausible models.

Use simulation-based diagnostics to compare observed count frequencies with replicated data, especially tails and zeros. Check residuals against fitted values, exposure, time, and clusters. A single dispersion ratio does not identify the appropriate alternative. If the model predicts too few zeros and too few extreme counts, unmodeled heterogeneity is plausible; if excess zeros occur only in a subgroup, model that mechanism.

For Poisson GLM, Pearson dispersion is \(\sum r_{Pi}^2/(n-p)\), where (r_{Pi}) are Pearson residuals. A value near 1 is compatible with the Poisson variance but does not demonstrate fit; a value of 2 suggests variance roughly twice the model expectation as a rough summary. Inspect residuals and compare observed versus expected zeros, ones, and upper-tail counts. With small samples, the ratio is noisy.

Negative-binomial dispersion estimates can be poorly identified when counts are sparse or few observations are available. If estimated \(\alpha\) is near zero, Poisson may suffice, but compare uncertainty rather than relying on a boundary test. If overdispersion comes from clusters, a hierarchical model may improve transport and prediction more than a single global dispersion parameter.

### Hurdle and zero-inflated models

A hurdle model has two processes: whether any event occurs and, conditional on a positive count, how many events occur. It fits when event initiation and recurrence are distinct, such as whether a patient is ever hospitalized and the number of admissions among those hospitalized. A zero-inflated model assumes some observations are in a structural-zero state while others arise from a count process that can also produce zeros.

These models can be weakly identified if data do not distinguish the zero mechanisms. Interpret both components and provide predicted probabilities and expected counts. Do not select them just because the zero fraction seems high; low event rates naturally produce many zeros. Compare out-of-sample calibration and clinical plausibility, and report uncertainty in the zero-process membership.

## Functional form and covariates

The model assumes log mean is linear in continuous predictors. Check whether age, calendar time, or dose has nonlinear association; use splines or transformed terms. A one-unit coefficient interpretation depends on scale. For categorical predictors, state reference categories. Interactions change IRRs across covariates and require calculation of contrasts with covariance.

Confounder selection should follow design and subject matter. Adjusting for exposure-affected variables can alter causal estimand or induce bias. Count regression does not turn an observational association into a causal rate ratio. Positivity and exchangeability remain necessary for causal interpretation.

For a continuous predictor with spline terms, the IRR for a clinically meaningful contrast is computed from the difference in linear predictors, exponentiated. It is not generally the exponentiated coefficient of one basis function. Plot predicted rates and intervals across the observed range. If there is an interaction with treatment, derive subgroup-specific contrasts with their covariance.

An offset is appropriate when expected count scales proportionally with exposure. If a patient with twice the person-time is expected to have twice the event count at the same rate, fixing offset coefficient at one is sensible. If the relationship is not proportional, a freely estimated exposure coefficient or alternative process may be needed, but this requires scientific justification. Do not use both exposure as an offset and as an unconstrained predictor without a clear target.

The log link assumes multiplicative changes in the mean. A coefficient of 0.10 corresponds to an IRR of 1.105 (about 10.5% higher rate), not a 0.10-event increase. For a categorical exposure, calculate rate contrasts against the reference group. For a spline, compute the exponentiated difference in fitted linear predictors between two values; individual spline coefficients are not IRRs on their own.

If a covariate effect is suspected to vary by exposure level, fit an interaction only when scientifically motivated and report predicted rates across relevant values. An interaction on the log-rate scale is multiplicative; the absolute rate difference can vary with baseline rate even without interaction. Present both scales when making clinical decisions.

Exposure definitions should match risk time. Person-days after death or discharge should not remain in denominator if the event is no longer observable. For population rates, use population at risk for each time interval; age-standardize if composition changes. If exposure is measured with error, the IRR may be biased and offset uncertainty is often ignored.

## Dependence, clustering, and repeated counts

Poisson and negative-binomial GLMs assume independent observations conditional on predictors. Repeated counts per patient, clustering within sites, or shared time shocks require GEE, random effects, cluster-robust variance, or time-series models. A random intercept can model persistent heterogeneity; robust variance needs enough independent clusters. If cluster size relates to outcome, define whether target is person- or cluster-weighted.

For recurrent events, include person-time at risk and define whether terminal events stop observation. Recurrent-event survival models preserve event timing; count regression summarizes total burden. If event counts are measured over unequal intervals, use exposure offsets and account for within-person dependence.

A random-intercept negative-binomial model has \(Y_{ij}\mid b_i\sim NB(\mu_{ij},\alpha)\), with \(\log\mu_{ij}=X_{ij}\beta+b_i+\log E_{ij}\). The exponentiated fixed coefficients describe cluster-conditional IRRs, whereas GEE provides marginal rate ratios. With a log link and random effects, marginal effects need not equal conditional effects. State which is reported.

Robust sandwich standard errors cluster by independent unit and allow within-cluster dependence with enough clusters. They do not account for informative cluster size or fix a wrong mean. With few clusters, use small-sample correction or randomization-based methods. In a cluster-randomized study, treatment inference is based on independent clusters. Cluster-robust p-values using hundreds of patient rows and six clinics can be anti-conservative.

Temporal count data may have serial correlation after covariate adjustment. Include time trend, seasonality, and AR structure or use a time-series count model. Standard negative-binomial regression treats periods independent; changing outbreak dynamics can invalidate that assumption. The time-series analysis article covers interrupted series and temporal dependence.

## Interpretation and reporting

Report event counts, exposure denominators, crude rates, model family, link, offset, dispersion handling, covariates, variance estimator, and intervals. Translate IRRs into rates at meaningful exposure levels. A rate difference may be more useful than relative effect: reducing 5 to 4 events per 100 person-years is one fewer event per 100 person-years, but baseline rates vary across populations.

For prediction, assess calibration of expected counts and predictive intervals. For causal analyses, identify the estimand and adjustment assumptions. Avoid saying “risk” when the model estimates a rate unless a fixed-horizon probability has been derived. Include zero counts and ascertainment issues.

## Contrast calculations on relative and absolute scales

If treatment coefficient is \(\hat\beta=-0.22\) with SE 0.10, IRR is (e^{-0.22}=0.80). A Wald 95% interval on the log scale is −0.416 to −0.024, transformed to 0.66 to 0.98. This describes a rate ratio, not a rate difference. If comparator rate is 4 per 100 person-years, predicted treated rate is 3.2 per 100 person-years, an absolute difference of −0.8 per 100 person-years under the model. In another population with baseline rate 20, the same IRR implies difference −4; baseline burden determines absolute impact.

For a count outcome observed during fixed time, expected count under covariate pattern (x) is \(\exp(x^T\hat\beta)E\). Provide expected numbers over realistic person-time and prediction intervals. Rate estimates are not bounded by one; recurrent events can yield expected counts greater than one per person. Avoid translating rate ratios to probabilities without a specified horizon and event process.

If the outcome is rare and only first events matter, a Poisson model with person-time offset can approximate a piecewise exponential survival model under appropriate assumptions. If event timing and censoring are central, use survival analysis rather than reducing to total counts. If only a fixed binary endpoint is observed, logistic or binomial regression may be more direct.

## Predictive checks and model comparison

Compare observed and predicted mean count by exposure and important covariate strata. Check calibration of total counts and tail probabilities. For individual prediction, predictive intervals include both parameter uncertainty and count variability; confidence intervals for mean counts are narrower. Validate on held-out clusters or future periods if deployment is intended. Randomly splitting repeated counts can leak information.

Use likelihood-ratio tests for nested Poisson models under regularity conditions; testing negative-binomial dispersion at boundary zero requires care. AIC comparisons require models fit to the same outcome and likelihood. Quasi-Poisson does not supply a full likelihood for ordinary AIC. Information criteria do not assess causal validity or external calibration.

## Common interpretation errors

Do not call an IRR a risk ratio. Do not infer overdispersion from a high zero count alone. Do not treat an offset as an ordinary predictor: its coefficient is fixed because exposure defines the rate denominator. Do not interpret a conditional random-effects IRR as a population-average ratio. Do not assume negative binomial solves within-person or temporal dependence.

Report rate numerator and exposure denominator, model family, link, offset, dispersion estimate, cluster or time structure, and confidence interval. When adjusted estimates differ from crude rates, explain the covariates and target rather than presenting the model as a corrected truth. For rare harms, show absolute event counts and uncertainty, even if the relative estimate is large.

If many subgroup rates are screened, extreme estimates are expected by chance. Hierarchical shrinkage can stabilize small-area or clinic rates, but a shrunken estimate is model-dependent. Report raw counts and denominators, uncertainty, and whether subgroup analysis was prespecified. Avoid ranking clinics by crude rates without adjusting for patient mix and uncertainty.

| Data feature | Candidate approach | Main interpretive caution |
| --- | --- | --- |
| Mean approximately equals variance | Poisson GLM | Independence and mean structure still matter |
| Extra-Poisson heterogeneity | Negative binomial or quasi-Poisson | They model variance differently |
| Repeated counts per person | GEE or mixed count model | Marginal and conditional IRRs differ |
| Unequal time at risk | Log exposure offset | Exposure must measure actual risk time |
| Structural zeros plausible | Hurdle or zero-inflated model | Mechanism and components need justification |

Use this mapping as a starting point, then verify fit against the study design and estimand. No row in the table replaces causal reasoning or good denominator data.

When reporting model-based rates, include the covariate profile or standardization population used. Conditional fitted rates at mean covariate values may not equal population-average rates, especially with nonlinear links. If the target is a patient population, average predictions over that population's covariates and present uncertainty.

Report the rate unit in every table and figure caption.

When follow-up varies, state how person-time was accumulated and whether post-discontinuation time remained under observation.

For surveillance counts, also report reporting delay and any revision to recent counts; a provisional numerator can distort apparent rate changes.

## References and further reading

- Cameron AC, Trivedi PK. *Regression Analysis of Count Data*. 2nd ed. Cambridge University Press; 2013.
- Hilbe JM. *Negative Binomial Regression*. 2nd ed. Cambridge University Press; 2011.
- Ver Hoef JM, Boveng PL. Quasi-Poisson vs. negative binomial regression: how should we model overdispersed count data? *Ecology*. 2007;88:2766–2772. [doi:10.1890/07-0043.1](https://doi.org/10.1890/07-0043.1)
- Zeileis A, Kleiber C, Jackman S. Regression models for count data in R. *Journal of Statistical Software*. 2008;27(8):1–25. [doi:10.18637/jss.v027.i08](https://doi.org/10.18637/jss.v027.i08)
