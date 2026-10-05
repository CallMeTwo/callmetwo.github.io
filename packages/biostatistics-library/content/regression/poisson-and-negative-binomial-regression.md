---
title: Poisson and negative binomial regression
summary: Choose and interpret regression models for discrete event counts and rates, including Poisson, negative binomial, hurdle, and zero-inflated models.
---

## Overview

Poisson and negative-binomial regression model nonnegative event counts. They are useful for hospital admissions, infections, recurrent events, and adverse-event counts, especially when observation time or population size varies. A log link ensures fitted means are positive; an offset incorporates exposure such as person-time.

Poisson regression assumes conditional mean equals conditional variance. Health counts often vary more than Poisson allows because of unmeasured heterogeneity, clustering, or outbreaks. Negative-binomial regression adds a dispersion parameter. Neither model automatically handles zero inflation, dependence, confounding, or informative exposure; those features need explicit modeling.

## Check that the outcome is a count

A count records how many times an event occurred for a defined unit during a defined observation window. It takes integer values starting at zero and usually has no fixed upper bound: admissions per person-year, infections per catheter-day, or adverse events per treatment cycle. The unit, event definition, follow-up window, and ascertainment process define the outcome as much as the number does.

Several other discrete outcomes need different likelihoods. A yes/no endpoint is Bernoulli and is commonly modeled with logistic regression. The number of successes out of a known number of opportunities is binomial; for example, infections out of 12 catheter-days is not automatically the same estimand as infections per catheter-day. An ordered symptom grade is ordinal, even though it is coded with integers. A bounded count such as the number of affected organs out of a fixed set may be binomial or beta-binomial. Do not use a Poisson model just because the outcome is numeric and discrete.

Counts should be nonnegative integers. If sampling includes only people with at least one event, zero-truncated models may be required. If records stop at a maximum because of a survey or claims window, the observed upper endpoint may be censoring rather than a true bound. If different people have different time at risk, model counts with an exposure offset when proportional accumulation of events over exposure is plausible. A rate is a count divided by exposure; it is not itself a count outcome.

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

### Match the variance model to the source of extra variation

Overdispersion is a diagnosis that the fitted conditional variance is too small; it is not a diagnosis of its cause. A negative-binomial NB2 model commonly uses \(Var(Y_i\mid X_i)=\mu_i+\alpha\mu_i^2\), so extra variation grows quadratically with the mean. NB1 instead uses a variance that grows approximately linearly with the mean. Quasi-Poisson uses \(Var(Y_i\mid X_i)=\phi\mu_i\) and estimates a scale factor, but does not specify a full probability distribution. These alternatives can yield different standard errors, predictions, and likelihoods.

Before adding a dispersion parameter, check whether the mean model is wrong. Nonlinear age or calendar-time effects, omitted exposure, seasonality, an influential clinic, or an inappropriate independence assumption can all make the residual variance look too large. A negative-binomial model can accommodate unobserved heterogeneity but will not repair a wrong denominator, serial correlation, or confounding. If observations are more regular than Poisson allows, investigate the sampling process and consider an underdispersed count family rather than forcing a negative-binomial model.

The Pearson dispersion statistic \(\sum_i r_{Pi}^2/(n-p)\) is a useful rough screen, not a pass/fail threshold. It can be high because the mean structure is wrong and can be misleading with small samples or estimated dispersion. Inspect residuals against fitted values, exposure, time, and clusters. Compare the observed count frequencies, including zero and upper-tail counts, with frequencies simulated from the fitted model. A model that gets the mean right can still badly miss the probability of zero or a clinically important high count.

## Excess zeros: zero-inflated and hurdle models

An ordinary Poisson model already predicts many zeros when the mean is small: at \(\mu=0.2\), \(P(Y=0)=e^{-0.2}=0.819\). Therefore a large observed zero percentage is not, by itself, evidence of zero inflation. First compare the observed zeros with the zero frequency predicted after fitting a suitable Poisson or negative-binomial mean model. Also check whether low exposure, different risk groups, missed events, or a poor mean model explains the zeros.

A zero-inflated model represents two latent states. With probability \(\pi_i\), an observation is in a state that always produces zero; otherwise it follows a count distribution with mean \(\mu_i\), which can itself produce zero. For zero-inflated Poisson (ZIP),

\[
P(Y_i=0)=\pi_i+(1-\pi_i)e^{-\mu_i},\qquad
P(Y_i=y>0)=(1-\pi_i)\frac{e^{-\mu_i}\mu_i^y}{y!}.
\]

The marginal mean is \((1-\pi_i)\mu_i\), not \(\mu_i\). In a zero-inflated negative-binomial model (ZINB), the count state is negative binomial and can handle extra-Poisson variation among counts as well as the separate zero mixture. In `pscl::zeroinfl()`, the formula to the left of `|` describes the count component; the formula to the right describes the probability of belonging to the extra-zero component. A positive coefficient in this second logit model means higher odds of the extra-zero state. It does not mean higher odds of any observed zero, since the count state can also generate zeros.

A hurdle model also has two parts, but it assigns every zero to the zero part. The first part models zero versus positive count. The second part models positive values using a zero-truncated Poisson or negative-binomial distribution. This is a natural formulation when crossing from no event to at least one event is a distinct process from how often an event recurs. In `pscl::hurdle()`, the formula after `|` models the zero part; the count distribution for positive observations is truncated at zero. Unlike a zero-inflated model, a hurdle count component cannot generate additional zeros. A hurdle model can represent either more or fewer zeros than its underlying untruncated count model would predict, while a zero-inflated mixture can only add zero probability for fixed count-component parameters.

The mechanisms are assumptions, not labels that can be read directly from an observed zero. A zero in a ZIP or ZINB fit may come from either latent state. Unless membership is known from design, the model estimates probabilities of state membership rather than certifying which individuals are “structural zeros.” Hurdle models do not require that interpretation. If the scientific question is the probability of any event and the burden among those with events, a hurdle model may align well with the estimands. If a subgroup can never experience the event during the observation window for a substantive reason, a zero-inflated model may be defensible. In either case, state the mechanism and show marginal predictions.

### Worked zero-inflation calculation

Suppose 200 patients contribute comparable follow-up and experience 96 recurrent events in total. The mean is \(96/200=0.48\) events per patient-window, and 134 patients have zero events (67%). A homogeneous Poisson model with mean 0.48 predicts

\[
P(Y=0)=e^{-0.48}=0.619,
\]

or about \(200(0.619)=124\) zero-event patients. The observed 134 zeros suggest possible excess zeros, but differences in exposure or predictors could account for some of this gap.

For illustration, suppose a ZIP model estimates \(\pi=0.40\) and a mean of \(\mu=0.80\) in the count-generating state. Its overall mean is \((1-0.40)(0.80)=0.48\), the same as above, while its probability of zero is

\[
0.40+0.60e^{-0.80}=0.670,
\]

which predicts about 134 zeros among 200 patients. The two models have the same marginal mean but different distributions. Under ZIP, the probability of exactly one event is \(0.60e^{-0.80}(0.80)=0.216\), or about 43 patients; under Poisson(0.48), it is \(e^{-0.48}(0.48)=0.297\), or about 59 patients. The mixture reallocates probability away from one event toward zero and, in this example, higher counts.

Even in this fitted illustration, an observed zero is not certainly from the extra-zero state. Its model-based probability of being from that state is

\[
P(S=1\mid Y=0)=\frac{0.40}{0.40+0.60e^{-0.80}}=0.597.
\]

Thus the fitted model assigns about a 60% probability to that latent state for a zero observation. This is a model-based posterior classification, not observed biological truth. With covariates and unequal exposure, calculate these quantities for each covariate pattern rather than substituting one overall mean.

### Fit and interpret candidate models in R

The following reproducible example simulates recurrent event counts with unequal follow-up, extra zeros linked to eligibility, and a treatment effect in the count-generating state. `MASS` and `pscl` are separate R packages; install them once with `install.packages(c("MASS", "pscl"))` if needed. The simulation makes a known extra-zero process for teaching; real data require a scientific justification for that process.

```r
set.seed(2026)
n <- 800
dat <- data.frame(
  treatment = rbinom(n, 1, 0.5),
  age_z = rnorm(n),
  person_years = runif(n, 0.5, 1.5),
  not_eligible = rbinom(n, 1, 0.2)
)

# Probability of a latent extra-zero state; mean count is defined among
# observations in the event-generating state.
dat$pi_zero <- plogis(-2 + 1.8 * dat$not_eligible)
dat$mu_count <- exp(log(0.45) - 0.25 * dat$treatment +
                    0.20 * dat$age_z + log(dat$person_years))
structural_zero <- rbinom(n, 1, dat$pi_zero) == 1
dat$events <- ifelse(structural_zero, 0, rpois(n, dat$mu_count))

# Poisson, quasi-Poisson, and negative-binomial mean models
fit_pois <- glm(events ~ treatment + age_z +
                  offset(log(person_years)),
                family = poisson(), data = dat)
fit_quasi <- update(fit_pois, family = quasipoisson())
fit_nb <- MASS::glm.nb(events ~ treatment + age_z +
                         offset(log(person_years)), data = dat)

# The right side of | models the extra-zero probability in pscl::zeroinfl()
fit_zip <- pscl::zeroinfl(
  events ~ treatment + age_z + offset(log(person_years)) |
    not_eligible + age_z,
  dist = "poisson", data = dat
)
fit_zinb <- pscl::zeroinfl(
  events ~ treatment + age_z + offset(log(person_years)) |
    not_eligible + age_z,
  dist = "negbin", data = dat
)

# Hurdle: the right side models zero versus positive; the count part is
# fitted to positive observations using a zero-truncated distribution.
fit_hurdle <- pscl::hurdle(
  events ~ treatment + age_z + offset(log(person_years)) |
    not_eligible + age_z,
  dist = "negbin", data = dat
)

# Rough Poisson dispersion screen and observed vs fitted zero frequencies
pearson_dispersion <- sum(residuals(fit_pois, type = "pearson")^2) /
  df.residual(fit_pois)
zero_check <- c(
  observed = mean(dat$events == 0),
  poisson = mean(exp(-fitted(fit_pois))),
  zinb = mean(predict(fit_zinb, type = "prob", at = 0)[, "0"])
)

# exp(beta_treatment) is the adjusted rate ratio in the NB count model.
nb_irr <- exp(coef(fit_nb)["treatment"])
AIC(fit_pois, fit_nb, fit_zip, fit_zinb, fit_hurdle)

# pscl zero-inflated predictions:
# response = marginal expected count; count = mean in count state;
# zero = probability of extra-zero state.
prediction <- data.frame(
  marginal_mean = predict(fit_zinb, type = "response"),
  count_state_mean = predict(fit_zinb, type = "count"),
  extra_zero_probability = predict(fit_zinb, type = "zero")
)

pearson_dispersion
zero_check
nb_irr
head(prediction)
```

The dispersion ratio is a rough diagnostic. The `zero_check` compares observed zeros with mean fitted probabilities, not merely the zero percentage against a single Poisson mean. `nb_irr` is conditional on the NB model's included covariates and offset. In ZINB, `count_state_mean` is the mean within the count-generating state; `marginal_mean` combines that mean with the estimated extra-zero probability. Report the marginal expected count or a standardized contrast when the question concerns the full population. Do not describe the extra-zero component coefficient as the effect on the total event rate.

Fit models to the same observations before comparing likelihood-based criteria. AIC can compare Poisson, NB, ZIP, ZINB, and hurdle likelihoods when they use the same outcome and records; quasi-Poisson does not have a full likelihood for ordinary AIC. A lower AIC does not establish a zero-generating mechanism or adequate external prediction. Also inspect calibration by treatment, exposure, risk group, and important time or clinic strata, and validate on held-out patients, clinics, or later periods when prediction is intended.

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
- Lambert D. Zero-inflated Poisson regression, with an application to defects in manufacturing. *Technometrics*. 1992;34(1):1–14. [doi:10.1080/00401706.1992.10485228](https://doi.org/10.1080/00401706.1992.10485228)
- Mullahy J. Specification and testing of some modified count data models. *Journal of Econometrics*. 1986;33(3):341–365. [doi:10.1016/0304-4076(86)90002-3](https://doi.org/10.1016/0304-4076(86)90002-3)
- Feng CX. A comparison of zero-inflated and hurdle models for modeling zero-inflated count data. *Journal of Statistical Distributions and Applications*. 2021;8:8. [doi:10.1186/s40488-021-00121-4](https://doi.org/10.1186/s40488-021-00121-4)
- Ver Hoef JM, Boveng PL. Quasi-Poisson vs. negative binomial regression: how should we model overdispersed count data? *Ecology*. 2007;88:2766–2772. [doi:10.1890/07-0043.1](https://doi.org/10.1890/07-0043.1)
- Zeileis A, Kleiber C, Jackman S. Regression models for count data in R. *Journal of Statistical Software*. 2008;27(8):1–25. [doi:10.18637/jss.v027.i08](https://doi.org/10.18637/jss.v027.i08)
- `pscl` package documentation: [zero-inflated and hurdle model reference manual](https://cran.r-project.org/web/packages/pscl/refman/pscl.html) and [count-data vignette](https://cran.r-project.org/web/packages/pscl/vignettes/countreg.pdf).
