---
title: Model assumptions and diagnostics
summary: Diagnose whether a regression model captures its mean structure, dependence, variance, and influential data patterns, then use targeted alternatives rather than mechanical tests.
---

## Overview

Regression diagnostics assess whether a model is a useful representation of the data and whether its uncertainty calculations are credible. They do not prove assumptions or determine whether an analysis is causal. A fitted model can pass common tests while being scientifically wrong, or show statistically detectable deviations that have little practical effect.

Diagnostics should connect to the model's purpose. For explanation, check functional form, confounding structure, and interpretable contrasts. For prediction, assess calibration and out-of-sample error. For causal analysis, evaluate design assumptions such as exchangeability and positivity, which residual plots cannot verify. Begin with the study design and estimand, then inspect residual patterns relevant to the chosen model.

## Mean structure and functional form

Most regression models assume a specified relationship between predictors and the conditional mean. In linear regression, a continuous predictor enters linearly unless transformed. In logistic or count regression, linearity is on the link scale. Plot outcome against predictor, partial residuals, and fitted values. Curvature suggests splines, polynomials, or transformations may be needed.

For a linear model with age, residuals that systematically rise and fall across fitted values indicate missing curvature or omitted predictors. Add a restricted cubic spline and compare predicted means and uncertainty across observed ages. A joint test of nonlinear terms can summarize evidence, but the plot shows whether the deviation matters clinically. Avoid selecting the functional form solely by which has the smallest p-value.

Categorizing a continuous predictor can mask nonlinearity and creates arbitrary jumps. If categories are needed for communication, retain continuous modeling and show predictions at category-representative values. Transformations change coefficient meaning; document units and back-transform predictions carefully.

Restricted cubic splines join cubic polynomial segments with constraints that make the curve linear in the tails. They provide smooth flexibility without choosing many cut points. Knot number and locations should be prespecified or selected within internal validation. Plot the fitted curve and confidence band with data density; a spline can behave erratically in sparse tails even when the global fit statistic improves.

For a logistic model, the logit is linear in predictors unless basis terms are added. Plot observed event proportions or partial residual summaries against continuous predictors, but avoid crude bins that obscure patterns. For count models, check log-mean form and whether the exposure offset is proportional. For Cox regression, martingale residuals can assess continuous predictor form and Schoenfeld residuals help assess time-varying coefficients.

Interactions can reveal mean-structure misspecification if omitted, but adding every possible interaction overfits. Use subject-matter knowledge and prespecified effect modifiers. When an interaction is included, retain main effects and interpret contrasts at specific values. Diagnostic changes should be distinguished from confirmatory hypothesis tests.

## Residuals, variance, and distribution

Residuals are observed minus fitted values for linear models; generalized models use deviance, Pearson, or simulation-based residuals. Residual-versus-fitted plots can reveal nonlinearity, heteroskedasticity, and outliers. Q-Q plots assess residual tails for Gaussian models. Residuals should not show systematic pattern, though exact normality is not required for unbiased OLS estimates.

Heteroskedasticity means residual variance changes with predictors or fitted mean. Conventional OLS standard errors may be wrong, though coefficients can remain unbiased under exogeneity. Use heteroskedasticity-robust standard errors or a defensible variance model. Weighted least squares can improve efficiency only if weights represent the variance structure; arbitrary weighting changes the estimand.

For logistic regression, check separation, calibration, influential cases, and sparse cells. For count models, compare mean and variance, residual autocorrelation, and zero/tail frequencies. For survival models, assess proportional hazards and functional form using residuals. Each model family needs diagnostics specific to its link and outcome process.

Q-Q plots can highlight heavy tails but do not require automatic transformation. OLS estimates concern conditional means; a transformation changes the target unless predictions are back-transformed correctly. A Box–Cox procedure can suggest a transformation, but data-driven choice should be included in uncertainty assessment. Robust regression may reduce influence of tails while estimating a different weighted mean relationship.

In generalized linear models, deviance residuals and Pearson residuals are approximate diagnostics. Simulation-based residuals are often preferable for discrete outcomes because raw residuals are bounded or have nonconstant variance. Check expected versus observed frequencies, calibration, and predictive distributions. A large residual may be inevitable for a rare outcome and should be judged relative to model-generated variability.

Residual definitions differ by model family. A Gaussian residual is on the outcome scale; a logistic deviance residual is based on likelihood contribution and may be asymmetric; a Poisson Pearson residual divides count deviation by fitted standard deviation. Compare observed data with replicated or simulated outcomes under the fitted model when raw residual plots are hard to interpret. Simulation-based checks can reveal overdispersion, zero excess, tail mismatch, and group structure.

In logistic models, calibration is a key diagnostic because the mean model concerns probabilities. Plot observed versus predicted risk with binomial uncertainty, examine calibration-in-the-large and slope, and avoid relying only on Hosmer–Lemeshow p-values. A model can have well-behaved residuals and still poorly rank or calibrate new patients. External validation assesses transport, which internal residual diagnostics cannot.

In Poisson regression, compare observed and predicted count distributions stratified by exposure and covariates. Deviance/df above 1 can suggest overdispersion but may also reflect mean misspecification or dependence. Negative-binomial variance can help, but if extra variation arises from repeated measures, a correlation model may be needed. Inspect zero and upper tail frequencies separately.

Heteroskedasticity tests such as Breusch–Pagan can flag variance related to predictors but are sensitive to sample size and model specification. Robust standard errors are often a reasonable inferential response, but they do not fix poor prediction intervals or lack of fit. If the variance pattern is scientifically meaningful, model it explicitly and validate that structure.

```r
fit <- lm(outcome ~ age + treatment, data = dat)
par(mfrow = c(2, 2))
plot(fit)
```

The standard plots provide screening, not automatic decisions. Residuals should be interpreted against data collection and model purpose; fix data errors, revise plausible structure, or report sensitivity. Avoid deleting observations merely to make diagnostic plots look clean.

## Independence and dependence

Standard errors commonly assume independent observations. Repeated measurements, patients nested in clinics, family data, and spatial or temporal series violate this assumption. Residual autocorrelation or cluster patterns can indicate dependence. Use mixed models, GEE, cluster-robust variance, spatial models, or time-series methods suited to the design.

Cluster-robust standard errors require enough independent clusters. A study with 500 patients in 8 clinics has 8 independent clusters for clinic-level treatment assignment. Small-sample corrections or randomization-based methods may be needed. Robust variance does not fix a wrong mean, confounding, or informative missingness.

Autocorrelation in time-ordered residuals means nearby errors are related. In linear regression this can leave coefficients unbiased under exogeneity but make usual standard errors too small and forecasts poor. Use ACF plots, Durbin–Watson as a rough check in simple settings, and models with AR errors or HAC variance when justified. In longitudinal data, a mixed model or GEE can represent within-subject dependence; do not treat visit rows as independent.

Spatial correlation can remain after covariate adjustment if nearby regions share unmeasured conditions. Residual maps, Moran's I, or variograms can suggest remaining structure. A spatial random effect or cluster-robust inference may be appropriate, but it can also change exposure estimates where exposure is spatially smooth. Model choice should follow the target and spatial sampling mechanism.

For clustered data, the relevant number of independent groups determines asymptotic validity. With few clinics, ordinary sandwich errors can be biased downward. Use small-sample corrections, wild cluster bootstrap, or randomization inference if appropriate to design. State the cluster count and method; saying “robust SEs used” is incomplete.

## Leverage, influence, and sparse support

Leverage measures unusual predictor combinations; residual size measures outcome discrepancy; influence reflects impact on estimates. Cook's distance, studentized residuals, DFBETAs, and leverage values help identify cases for review. They are flags, not exclusion rules. Verify records and assess whether the observation belongs to the target population.

High leverage can reveal extrapolation. If nearly all treated patients are young and nearly all controls old, an adjusted treatment effect at a common age relies on model assumptions rather than direct comparisons. Diagnose overlap and positivity, especially for causal analyses. A model can fit the observed data while extrapolating into unsupported covariate regions.

Cook's distance combines residual size and leverage to summarize change in fitted coefficients if a case is omitted. DFBETAs show change in individual coefficients; leave-one-cluster-out analysis can be informative in multicenter data. These summaries do not define which cases are erroneous. Compare the influence of a case on scientifically important contrasts and confirm its eligibility and measurement accuracy.

Collinearity is distinct from influential observations. High variance inflation factors indicate a predictor is predictable from others and its partial coefficient may be imprecise. Collinearity can be expected when adjusting for related clinical severity variables. Consider joint tests, prespecified composite scores, or regularization for prediction, but retain confounders needed for causal adjustment. Do not eliminate a confounder merely to obtain a smaller standard error.

Sparse categories, separation, and empty cells can make logistic coefficients infinite or unstable. Check cross-tabulations and event counts before fitting. Firth correction or Bayesian regularization can address separation; combine levels only when categories are substantively similar and prespecify the rule. Report the method and sensitivity.

## Worked diagnostic example

Suppose a linear model estimates a treatment difference of −3.0 units. Residual-versus-fitted plot shows variance increasing with fitted value, Q-Q plot is reasonably straight, and one participant has high leverage. First verify the participant's source data. If valid, compare conventional and HC3 robust standard errors; suppose the SE changes from 0.9 to 1.2, widening the interval from −4.8 to −1.2 to −5.4 to −0.6. The point estimate is unchanged, but uncertainty accounts for unequal variance.

If the high-leverage observation drives treatment effect, report sensitivity with and without it only if the exclusion is scientifically defensible; the primary estimate should retain valid eligible data. Consider spline terms if residuals also curve, and cluster standard errors if participants share clinic. Diagnostics should lead to targeted checks, not a generic “assumptions met” sentence.

If the same analysis is clustered by clinic, compare ordinary, cluster-robust, and small-sample-corrected standard errors. Suppose treatment estimate remains −3.0, while SE rises from 0.9 to 1.6 after clinic clustering. The coefficient is unchanged, but the interval may now include zero, reflecting dependence. This does not imply the original patients changed; it reveals that independent information was overstated. With only eight clinics, even the corrected interval may remain uncertain.

For logistic regression, a calibration plot may show risk overprediction among the highest predicted decile despite acceptable AUC. This points to calibration or model transport, not necessarily a need to change discrimination. Recalibration can adjust intercept or slope, but evaluate the updated model in new data. For count models, residual simulations may show too many extreme counts; consider overdispersion or latent heterogeneity, then recheck prediction.

## Model calibration and predictive checks

For prediction, evaluate on held-out or external data. Calibration plots compare predicted and observed outcomes; slope below one often indicates overfitting. Discrimination such as AUC or (R^2) does not show that absolute predictions are accurate. Report error metrics and uncertainty at the decision horizon.

Simulation-based residual checks compare observed summaries with replicated datasets under the fitted model. They are useful for generalized linear and hierarchical models, including checking overdispersion, zero inflation, tails, and cluster patterns. A model can reproduce marginal distribution but miss conditional relationships; check relevant subgroups and time patterns.

For continuous-outcome prediction, assess residual bias across predicted values, RMSE, MAE, and calibration slope on held-out data. For binary prediction, report calibration and AUC plus threshold-specific utility. For count prediction, compare predictive intervals and count deviance. Avoid choosing performance metrics after viewing results; select those aligned to intended decisions.

Internal validation should repeat any data-dependent model-building steps. If spline knots, transformations, variable selection, or tuning were chosen using the full dataset before cross-validation, held-out performance is optimistic. Use nested resampling or a bootstrap of the whole pipeline. For clustered data, validation folds should be formed by cluster when deployment concerns new sites.

Prediction intervals should account for residual outcome variation as well as uncertainty in estimated coefficients. A confidence interval for the mean response describes uncertainty in average prediction, not the range for a new patient. Use the proper interval for the intended decision and state assumptions about future observations.

## Diagnostics do not test causal identification

No residual test can establish no unmeasured confounding, correct time zero, consistency, or positivity. Covariate balance diagnostics assess measured variables after weighting or matching, not hidden variables. Negative controls and quantitative bias analysis can probe some threats but rely on their own assumptions. State causal assumptions explicitly.

Variable selection after diagnostics can create selection bias. If model form is modified after viewing outcome relationships, disclose the process and validate the final procedure. A prespecified primary model plus a small set of sensitivity analyses is more interpretable than a search over many specifications.

Positivity cannot be established by a residual plot. Inspect propensity-score overlap, exposure distributions, and effective sample size after weighting. A lack of common support means some conditional contrasts are not data-identified. Restricting to overlap or changing the target population may be more honest than extrapolating. Report the resulting estimand.

Missing-data diagnostics likewise cannot prove MAR. Compare missingness by observed predictors, plot patterns, and include reasons for dropout, but conduct sensitivity analysis for plausible MNAR departures. Outcome measurement validity, selection into the study, and unmeasured confounding are outside the scope of standard residual diagnostics.

## A targeted review sequence

First confirm coding, denominator, time ordering, eligibility, and unit of analysis. Second inspect observed data distributions and missingness. Third assess mean form and residual variance/dependence. Fourth examine influence and support. Fifth validate calibration or predictive error if prediction is intended. Finally assess design assumptions that diagnostics cannot establish, such as confounding and censoring. This sequence reduces the temptation to react to a single formal test.

For each issue, state what was checked, what was found, and what action followed. “Assumptions were assessed” is not reproducible. If no major pattern was evident, say which plots or summaries supported that judgment. If a model changed after diagnostics, describe the change and retain a distinction between planned primary and data-informed sensitivity analyses.

## Diagnostic uncertainty and sample size

Diagnostic summaries themselves are uncertain. A calibration slope from a small external sample may have a very wide interval; a nonsignificant test of autocorrelation can reflect low power. Use confidence bands or bootstrap uncertainty for key diagnostic plots where feasible. Do not describe “no evidence of violation” as “the assumption is true.”

Large datasets can flag tiny deviations that have no meaningful impact on the target estimate. Compare the size of the departure and the sensitivity of estimates, not merely its p-value. Conversely, low power in a small sample means visual and substantive checks matter; formal tests should not be treated as clearance.

## Robustness as a complement to diagnostics

When a plausible assumption is uncertain, compare estimates under alternatives that address the concern: linear versus spline form, model-based versus robust variance, Poisson versus negative binomial, complete case versus imputation, or proportional hazards versus RMST. The goal is to understand which conclusions depend on choices, not to find a specification with preferred significance.

Robust procedures have limits. Sandwich standard errors do not fix confounding or mean misspecification; bootstrap does not repair a biased sample; rank regression changes the estimand; robust regression downweights observations according to a rule. Explain what changes and what remains assumed. A sensitivity analysis is informative when its alternative is scientifically plausible and its target is clear.

Preserve the plots, code, and summaries used to support material diagnostic decisions with the analysis record.

Review diagnostics in the context of the sampling design and practical consequences.

Preserve a copy of key diagnostic plots and record analyst decisions so changes to the model can be reviewed later.

If an assumption is materially violated, state its consequence for the estimand or interval and show how the chosen alternative addresses that specific problem. Avoid a generic declaration that robust methods make inference assumption-free; every procedure replaces one set of assumptions with another.

Diagnostics should also be reproducible across analysts. Preserve the analysis dataset definition, software versions, random seeds for resampling, and the code that generated plots; a screenshot alone cannot show whether the display used a transformed scale or omitted influential observations. For a collaborative review, pair each flagged feature with a short decision log: what was observed, whether it was expected from the design, what action was taken, and whether the primary estimate changed. This record distinguishes a principled sensitivity analysis from undocumented iterative tuning. If a diagnostic points to data error, correct the source and rerun the full pipeline; do not manually alter a single residual or observation in the model matrix.

## References and further reading

- Cook RD, Weisberg S. *Residuals and Influence in Regression*. Chapman & Hall; 1982.
- Harrell FE. *Regression Modeling Strategies*. 2nd ed. Springer; 2015.
- Fox J, Weisberg S. *An R Companion to Applied Regression*. 3rd ed. Sage; 2019.
- Gelman A, Hill J, Vehtari A. *Regression and Other Stories*. Cambridge University Press; 2020.
- The [model validation article](model-validation-and-overfitting.html) discusses optimism and external performance.
