---
title: Logistic regression
summary: Models the log-odds of a binary outcome as a linear combination of predictors, yielding interpretable odds ratios with confidence intervals.
---

## Overview and key ideas

Logistic regression is the standard model for binary outcomes — died/survived, infected/not infected, present/absent — and, with extensions, for rare events and ordinal responses. It models the *log-odds* (logit) of the outcome as a linear function of the predictors: log(p / (1 − p)) = β₀ + β₁X₁ + β₂X₂ + …, where p is the probability of the event. The inverse logit converts back to a probability: p = 1 / (1 + e^−(β₀ + β₁X₁ + …)), which always stays between 0 and 1.

The model is fitted by maximum likelihood rather than least squares. The central estimand is the exponentiated coefficient: for a one-unit increase in Xⱼ, the *odds* of the event are multiplied by e^βⱼ — the odds ratio (OR) — holding other predictors fixed. OR = 1 means no association, OR > 1 increases odds, OR < 1 decreases them. For a binary predictor (e.g. sex), the OR compares the odds between the two groups directly. Logistic regression can be used descriptively (adjusting for confounders) or for prediction, and it underpins case-control studies, where it naturally estimates ORs even when disease prevalence is sampled, not measured.

## When to use it

| Setting | Example question |
| --- | --- |
| Case-control study | Is a genetic variant associated with a rare cancer, adjusted for age and sex? |
| Risk modelling | Which baseline factors independently predict in-hospital mortality? |
| Diagnostic research | Do imaging features predict whether a nodule is malignant? |
| Clinical trial | Does the treatment reduce the odds of treatment failure at 12 weeks? |

Use it when the outcome is binary (or a count of rare events per subject) and you want an effect estimate adjusted for covariates. If the outcome is a rate (events per person-time), use Poisson or negative binomial regression; if it is time-to-event, use Cox proportional hazards. Logistic regression can also be fitted to a binary outcome with a 1-in-N prevalence as an approximation of a rare-event rate.

## Assumptions and limitations

- **Linearity on the logit scale**: the log-odds must change linearly with each continuous predictor; a curved relationship (e.g. U-shaped risk by age) biases the OR.
- **Independence**: one observation per subject; repeated measures or clustered patients require generalised estimating equations or mixed models.
- **No severe multicollinearity** among predictors, as in any linear-model family.
- **Sufficient information**: a fixed “10 events per variable” threshold is not a guarantee of stability. Needed sample size depends on event proportion, number and distribution of candidate parameters, expected model fit, and shrinkage target; sparse data can cause overfitting or separation even above the heuristic.
- **OR ≠ risk ratio**: when the outcome is common (prevalence > 10–20%), the OR overstates the risk ratio in both directions; a rare outcome (incidence < 10%) makes OR ≈ RR.

## Worked example

A registry of 1,200 myocardial infarction patients models in-hospital death with age (per 10 years) and Killip class (>1 vs 1). Suppose maximum likelihood gives: logit(death) = −2.00 + 0.25·(age/10) + 0.95·(Killip > 1). For a 70-year-old in Killip class I: logit = −2.00 + 0.25(7) = −0.25, so p = 1/(1 + e^0.25) ≈ 0.438, an estimated 44% mortality under this illustrative model. With Killip class >1, logit = −0.25 + 0.95 = 0.70 and p = 1/(1 + e^−0.70) ≈ 0.668. The exponentiated Killip coefficient is e^0.95 = 2.59 (suppose its 95% CI is 1.70 to 3.95): at the same age, Killip class >1 multiplies the odds by about 2.6; the fitted probability rises from 44% to 67%. This illustrates why odds ratios and absolute risks answer different questions and should be reported together. The probabilities are model-based adjusted predictions, not raw group proportions.

## Interpretation and common pitfalls

- The OR is a ratio of *odds*, not of probabilities: an OR of 2 does not mean "twice as likely" when the baseline probability is anything but small.
- Reporting ORs from a case-control study as risk ratios, or ORs from a cohort study of a common outcome as if they were RRs, systematically exaggerates effects.
- A "non-significant" adjusted OR can still be an important finding (wide CI) or a sign of residual confounding; examine the CI and the change from the crude OR, not just the p-value.
- Do not interpret the intercept as a clinically meaningful baseline risk unless the reference values of all predictors are realistic (e.g. age = 0).

For prediction, distinguish discrimination from calibration: an AUC can be acceptable while predicted probabilities are systematically too high. Report calibration-in-the-large and a calibration plot, and validate the entire modeling process (including variable selection and tuning) with resampling. When separation occurs, ordinary maximum-likelihood estimates can diverge; Firth penalized likelihood is one option, while exact or weakly informative Bayesian methods may suit particular designs. These methods do not make a sparse dataset informative, so show uncertainty and avoid interpreting unstable subgroup estimates.

## Likelihood, link, and fitted probabilities

For independent binary outcomes Y_i∈{0,1}, logistic regression assumes Y_i|X_i~Bernoulli(p_i) with logit(p_i)=X_i'β. The likelihood is ∏p_i^y_i(1−p_i)^(1−y_i); maximum likelihood chooses β to maximize it. The logit link maps probabilities (0,1) to the real line, and inverse logit returns valid probabilities. For a one-unit change in predictor x_j holding others fixed, log odds change by β_j and odds multiply by exp(β_j). This is a conditional odds ratio under the specified model.

The worked example's corrected linear predictor at age 70 is −2+.25×7=−.25, giving p=expit(−.25)=.438 for Killip I. For Killip>1, logit=.70 and p=.668. The odds ratio e^.95=2.59; odds are .438/.562=.779 in the reference state and .668/.332=2.012 in the higher Killip state, ratio 2.58 subject to rounding. An OR of 2.59 does not mean risk is 2.59 times as high; predicted risks differ by .230 here and the RR is .668/.438=1.53.

```r
expit <- function(eta) plogis(eta)
age <- 70
eta_k1 <- -2 + .25*(age/10)
eta_k2 <- eta_k1 + .95
c(p_killip1 = expit(eta_k1), p_killip_gt1 = expit(eta_k2),
  OR_killip = exp(.95), RR_predicted = expit(eta_k2)/expit(eta_k1))
```

This computes model-based conditional probabilities at fixed age. It does not account for uncertainty in β; use `predict(..., type="link", se.fit=TRUE)` and transform appropriately for intervals. Wald intervals on the probability scale can be poor near boundaries; simulation or profile likelihood can propagate uncertainty better.

## Coding and functional form

Binary predictors need a clear reference group. For a factor with multiple levels, R uses contrasts; inspect `model.matrix()` and set the baseline deliberately. A continuous predictor is assumed linear on the logit scale, not on the probability scale. Consequently, a constant β can imply large probability changes near p=.5 and small changes near p=.05. Check linearity using splines or grouped calibration plots, while avoiding arbitrary categorization.

If a predictor is scaled (age per 10 years), its odds ratio is per 10-unit change. A coefficient for a 5-unit change is exp(5β) if the original scale is one-unit. For interactions, an OR depends on the other interacting variable; report conditional estimates or predicted risks over meaningful values. Odds ratios are non-collapsible: adjusted and marginal ORs may differ even without confounding, so do not interpret coefficient change alone as proof of confounding.

## Sparse data, separation, and sample size

Complete separation occurs when a predictor combination perfectly distinguishes outcomes; maximum-likelihood coefficients can diverge and standard errors become huge. Quasi-separation creates similar instability. Convergence warnings, extreme estimates, and fitted probabilities near zero/one are clues. Firth penalized likelihood can produce finite estimates; weakly informative Bayesian priors or exact methods may be appropriate in specific sparse settings. Penalization stabilizes estimation but does not create information. Report the method and avoid overconfident subgroup claims.

A fixed events-per-variable rule is inadequate. Model complexity includes all candidate parameters, including spline and interaction degrees of freedom. Events, non-events, predictor distribution, anticipated shrinkage, and desired precision matter. Prespecify predictors and use shrinkage/penalization or bootstrap validation when developing prediction models. Stepwise p-value selection biases coefficients and performance estimates.

## Risk, odds, and absolute effects

In cohort studies, logistic regression estimates odds ratios. For common outcomes, the OR can be materially farther from one than the risk ratio. Modified Poisson regression with robust variance or log-binomial models can estimate risk ratios under conditions, while standardization from a logistic model can produce marginal risks and risk differences. In case-control studies with outcome-dependent sampling, logistic slope ORs are estimable under standard sampling assumptions, but the intercept and absolute risk are generally not identified without external prevalence information.

For a clinically interpretable report, translate the model into predicted probabilities for representative profiles or standardized risks over the target population. The same OR can imply different absolute changes at different baseline risks. Avoid describing odds as “probability,” “risk,” or “times more likely.”

## Model assessment and R workflow

Assess calibration and discrimination separately. Calibration asks whether predicted probabilities agree with observed frequencies; discrimination measures ranking. AUC does not measure calibration or clinical usefulness. Check calibration-in-the-large, slope, calibration plot with uncertainty, Brier score, and decision consequences when relevant. Internal validation must repeat preprocessing and variable selection within resamples.

```r
fit <- glm(death ~ age10 + killip, family = binomial(), data = dat)
summary(fit)
exp(cbind(OR = coef(fit), confint(fit)))
predict(fit, newdata = data.frame(age10 = 7, killip = 0),
        type = "response")
```

The profile-likelihood `confint` may take longer than a Wald interval. Ensure the factor encoding matches the intended reference category. For clustered or repeated data use GEE or random effects. Report outcome definition, time horizon, covariate coding, missingness, model diagnostics, and whether the analysis estimates association or prediction.


## From conditional odds to standardized risks

A logistic coefficient conditions on included covariates. To obtain a marginal risk under treatment level a, predict each target-population member's risk after setting treatment to a, then average: p̄(a)=N^−1Σ expit(X_i(a)'β̂). A marginal risk difference is p̄(1)−p̄(0); a marginal risk ratio is p̄(1)/p̄(0). This g-computation approach can be applied in trials for precision and in observational settings under exchangeability, positivity, consistency, and correct model assumptions. Bootstrap the entire procedure for uncertainty when needed.

```r
fit <- glm(event ~ treatment + age + sex, family = binomial(), data = dat)
d0 <- d1 <- dat
d0$treatment <- 0
d1$treatment <- 1
p0 <- mean(predict(fit, d0, type = "response"))
p1 <- mean(predict(fit, d1, type = "response"))
c(risk0 = p0, risk1 = p1, risk_difference = p1-p0,
  risk_ratio = p1/p0)
```

This averages over the covariate distribution in `dat`, so the target is that empirical population. For complex survey weights use a weighted average; for external target populations standardize to their covariate distribution. In observational data these estimates remain assumption-dependent and can extrapolate where treatment groups have no overlap.

## Calibration and discrimination

AUC/C-statistic measures ranking across randomly selected cases and noncases. It does not tell whether a predicted risk of .30 corresponds to a 30% observed frequency. Calibration intercept ideally equals zero and slope one when regressing outcomes on the logit of predictions in validation data; slope below one indicates predictions too extreme on average. Calibration plots should avoid overly coarse bins and display uncertainty. Brier score is mean squared probability error and can be compared with a prevalence-only reference.

For a causal explanatory model, predictive calibration may not be the primary goal, but predicted probabilities still require plausible interpretation. For a risk model, evaluate external or bootstrap validation and decision utility at thresholds where action changes. A model can have excellent AUC but poor net benefit if it does not improve decisions over treat-all/treat-none.

## Missingness, clustering, and alternatives

Complete-case logistic regression changes the analyzed population if outcomes or predictors are missing. Multiple imputation should include outcome, treatment, predictors, and auxiliary variables and respect nonlinearities/interactions in analysis. Pool estimates using appropriate multiple-imputation rules. For repeated outcomes use GEE or mixed-effects logistic regression; conditional and population-averaged ORs differ. If absolute risk is the primary measure and outcomes are common, consider log-binomial or modified Poisson approaches, while checking predicted risks and robust variance.

When reporting, state event coding, time horizon, factor references, continuous predictor scaling, sample and event counts, missing-data approach, and whether coefficients are intended for inference or prediction. Present adjusted absolute risks alongside odds ratios when readers need clinical meaning.

## Interactions, nonlinearity, and prediction uncertainty

A logistic model's continuous predictor effect is linear in log odds unless specified otherwise. Restricted cubic splines can represent smooth nonlinear logit effects; test nonlinear components jointly and plot predicted risks with confidence bands. Interactions require product terms and often substantially larger sample sizes. The coefficient for treatment is conditional on modifier reference levels, while predicted probabilities vary nonlinearly. Provide clinically interpretable risk contrasts at representative profiles.

To form uncertainty intervals for predicted risk, calculate uncertainty on the linear predictor and transform; because the inverse logit is nonlinear, endpoints may be asymmetric. For marginal standardized risks, bootstrap the entire fit-and-standardize procedure. Plugging coefficient standard errors individually into the probability formula ignores covariance and is incorrect.

## Multiple imputation and clustered outcomes

If predictors are missing, multiple imputation should reflect the binary outcome and the substantive analysis form, including nonlinearities and interactions where relevant. Pool log-odds coefficients and covariance using Rubin's rules, then exponentiate estimates and interval endpoints. Imputing predictors without outcome can attenuate associations. For outcomes missing after randomization, the missingness strategy should be tied to the estimand and include sensitivity analyses under departures from MAR.

With clustered patients, ordinary logistic regression underestimates uncertainty if within-site dependence is ignored. GEE estimates population-average associations with robust variance; random-intercept logistic regression estimates conditional effects given site/patient random effects. These ORs differ due to non-collapsibility. State the estimand and number of independent clusters; few clusters need specialized corrections.

## Worked interpretation of uncertainty

Suppose treatment β̂=−.40 with SE=.20. The OR is exp(−.40)=.67; a Wald 95% interval on the log-odds scale is −.40±1.96(.20)=(−.792,−.008), exponentiating to OR .45–.99. The coefficient's p-value is close to .046, but the interval shows the estimate ranges from a substantial reduction to a very small one. Clinical importance depends on baseline risk and harms. If baseline risk is 30%, OR=.67 corresponds to treated risk about .223, not .201 as an RR interpretation would imply.

```r
beta <- -.40; se <- .20
exp(c(estimate = beta,
      lower = beta - 1.96*se,
      upper = beta + 1.96*se))
p0 <- .30; OR <- exp(beta)
p1 <- OR*p0/(1-p0+OR*p0)
c(p0 = p0, p1 = p1, RR = p1/p0, RD = p1-p0)
```

This conversion assumes the OR applies to the specified baseline risk and covariate profile. An adjusted OR should not be combined with a crude baseline risk without acknowledging potential inconsistency.

## Case-control sampling and absolute risk

In a case-control study, investigators choose numbers of cases and controls, so the sample event fraction is set by design and cannot estimate population prevalence. Under standard outcome-dependent sampling, the logistic slope odds ratios can still estimate exposure-disease odds ratios, but the intercept is shifted. To obtain absolute risks, external prevalence or a cohort sample and additional assumptions are needed. Do not use the sample fraction as baseline risk in a case-control dataset.

Conditional logistic regression is used for matched case-control sets and conditions on each matched set's total case count. Matching must be reflected in the analysis; ignoring it can lose efficiency and bias estimates depending on design. State matching variables and sampling scheme.

A good results table includes events and denominators, adjusted odds ratios with intervals, and absolute predicted risks where clinically useful. State whether the reported risk is conditional for a profile or standardized over a population. Include the number of model parameters, events, and non-events, and disclose any penalization or variable selection. This prevents a compact OR table from hiding unstable estimates or an unclear target.

The logistic likelihood assumes observations are independent conditional on predictors. A random intercept accounts for latent cluster heterogeneity, while GEE targets average association across clusters. Merely adding clinic as a fixed categorical covariate does not generally correct within-clinic correlation. Report cluster count and chosen variance structure, especially when intervention was assigned at clinic level.

A model's intercept corresponds to the log odds when all continuous predictors equal zero and every categorical predictor is at its reference level. Center continuous variables at meaningful values if an interpretable reference profile is useful. This does not change fitted probabilities, but it can make the intercept and main effects easier to communicate, particularly when interactions are present.

## References and further reading

- Heinze G, Schemper M. A solution to the problem of separation in logistic regression. *Statistics in Medicine*. 2002;21:2409–2419. [doi:10.1002/sim.1047](https://doi.org/10.1002/sim.1047)

- Agresti A. *Categorical Data Analysis*. Wiley.
- Menard S. *Applied Logistic Regression*. SAGE.
- Collett D. *Modelling Binary Data*. Chapman & Hall/CRC.
- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott Williams & Wilkins.
- The [Poisson and negative binomial regression article](poisson-and-negative-binomial-regression.html) covers count and rate outcomes.
