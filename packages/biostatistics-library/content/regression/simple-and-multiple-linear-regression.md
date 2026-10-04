---
title: Simple and multiple linear regression
summary: Estimate conditional mean differences for continuous outcomes, interpret coefficients, examine model form and residuals, and distinguish association from prediction or causation.
---

## Overview

Linear regression models the conditional mean of a continuous outcome as a linear combination of predictors. Simple regression has one predictor; multiple regression includes several covariates to describe adjusted associations, improve prediction, or estimate a contrast under causal assumptions. The word “linear” refers to linearity in coefficients, so predictors can be transformed or modeled with spline bases.

Regression is not a single-purpose method. An explanatory analysis estimates associations, a predictive model estimates outcomes for new observations, and a causal analysis targets effects under identification assumptions. The same formula can support different goals, but coefficient interpretation, validation, and assumptions differ. Start with the estimand and design.

## The conditional mean model

For outcome (Y_i) and predictors (x_i), ordinary least squares (OLS) estimates \(E(Y_i\mid x_i)=\beta_0+\beta_1x_{i1}+\cdots+\beta_px_{ip}\) by minimizing squared residuals. In simple regression, \(\beta_1\) is the expected mean change in (Y) for one-unit higher (X). In multiple regression, it is the expected difference per unit of (X_j), holding included predictors fixed.

Suppose a fitted model predicts systolic blood pressure from age and treatment: \(\widehat Y=112+0.45(age)-3.2(treatment)\). The age coefficient means 0.45 mmHg higher mean pressure per year at fixed treatment, under a linear age effect. Treatment coefficient −3.2 means a 3.2 mmHg lower conditional mean compared with control at the same modeled age. If treatment was not randomized, this is not automatically causal.

```r
fit <- lm(sbp ~ age + treatment + baseline_sbp, data = dat)
summary(fit)
confint(fit)
```

Coefficients depend on coding and scale. Center age at a meaningful value to make the intercept interpretable; rescale variables so coefficients represent clinically useful increments. Include a reference category for factors. Report units and confidence intervals, not just model p-values.

## Interpreting adjustment and collinearity

Multiple regression estimates conditional associations. Adjustment can reduce confounding when variables are appropriate pre-exposure common causes; adding every available variable can instead introduce bias by conditioning on mediators or colliders. Use a causal diagram or subject-matter rationale, not automated p-value selection, to define a confounder set.

Correlated predictors increase uncertainty and can make coefficients unstable. Multicollinearity does not necessarily harm prediction but complicates attribution of an effect to one variable. Variance inflation factors and condition indices can diagnose near-collinearity; dropping a clinically essential confounder solely to reduce VIF may worsen bias. Consider reporting joint tests or contrasts for correlated predictor sets.

Suppression can occur when adjustment changes a coefficient's direction because covariates capture different associations. This is not necessarily a coding error, but it warrants checking variable coding, temporal ordering, confounding structure, and extrapolation. Compare crude and adjusted estimates with explanation rather than describing changes as proof that adjustment “removed bias.”

## Functional form and interactions

The phrase “holding other variables constant” describes a conditional comparison that may have little empirical support if predictors are highly correlated. Check overlap in covariate patterns and whether the target contrast requires extrapolation. Comparing treated and untreated patients at combinations of severity and age observed in only one group produces model-dependent estimates. Restricting to common support changes the population and should be explicit.

Suppressor variables can make a coefficient larger after adjustment even when confounding is reduced. For linear models, the Frisch–Waugh–Lovell theorem interprets a partial coefficient as the association between residualized outcome and residualized predictor after removing other predictors. This helps explain why coefficient interpretation depends on the full covariate set.

For a log outcome, simply exponentiating the fitted log mean estimates a conditional median under lognormal errors, not arithmetic mean. A smearing estimator or distributional model is needed for the arithmetic mean. If zeros are common, log transformation with an arbitrary constant changes interpretation; a two-part model or alternative family may be more appropriate.

Restricted cubic splines use a small number of basis functions to allow smooth nonlinear associations while remaining linear in coefficients. Choose knot locations before examining outcome associations or use a prespecified modeling strategy. A joint test of nonlinear spline terms can summarize departure from linearity, but estimated curves and confidence bands show the shape. Avoid overinterpreting local wiggles in sparse tails.

Polynomial terms such as \(x\) and \(x^2\) can represent curvature but coefficients depend on scale and are correlated. Centering and scaling improve numerical stability and interpretation. The derivative \(dE(Y\mid x)/dx=\beta_1+2\beta_2x\) gives the local slope; report predictions or contrasts rather than describing \(\beta_1\) as a universal effect when the quadratic term is present.

OLS assumes the conditional mean is correctly specified. A straight-line term for age assumes each additional year has the same mean association. Plot outcome against predictor and residuals; use restricted cubic splines, polynomial terms, or scientifically motivated transformations when needed. Categorizing a continuous variable discards information and can create arbitrary discontinuities.

Interactions allow a predictor association to vary by another variable. If treatment-by-age coefficient is 0.10, the treatment contrast changes 0.10 outcome units per year on the additive scale. The treatment effect at age (a) is the treatment main effect plus (a) times interaction (depending on centering). Compute a linear contrast and interval using covariance; separate subgroup p-values do not test interaction.

If outcome is log-transformed, coefficients describe changes in log mean. Exponentiating gives multiplicative effects; a coefficient 0.08 corresponds to about \((e^{0.08}-1)\times100=8.3\%\) higher geometric mean, under model assumptions. Back-transforming predictions requires attention to retransformation bias and residual variance.

## Worked calculation: adjusted mean difference

In a randomized trial, the model is follow-up score = intercept + treatment + baseline score + site. Treatment estimate is −2.4 points with SE 0.85. With large-sample 95% interval, −2.4 ± 1.96(0.85) gives −4.07 to −0.73 points. If lower scores are better and the minimally important difference is 3 points, the point estimate is clinically relevant but the interval includes smaller effects. The p-value tests a null difference of zero, not whether benefit exceeds 3 points.

For a profile with baseline score 30 and a reference site, predicted control mean might be 22.0 and active mean 19.6. The difference remains −2.4 because the model is additive and has no treatment interaction. If treatment-by-baseline interaction is present, the contrast depends on baseline score and must be calculated for chosen values.

The coefficient's standard error describes sampling uncertainty in the adjusted mean contrast under the model. It does not include uncertainty from choosing the functional form, selecting covariates, measurement error, or transporting to another population. If several reasonable models are examined, show a prespecified primary estimate and a small number of scientifically motivated sensitivity results rather than only the most favorable one.

Standardized regression coefficients divide predictor and outcome by their standard deviations. They can compare scale-free associations within a model but depend on the sample's variability and are less clinically interpretable. In intervention research, native units and clinically meaningful differences are usually preferable. If comparing studies with different outcome scales, standardized effects may be useful but should accompany original-scale context.

For an interaction between treatment and baseline score, suppose \(\hat\beta_T=-1.0\), \(\hat\beta_{TX}=-0.08\), and baseline score is centered at 20. At score 30, the treatment contrast is −1.0−0.08(10)=−1.8. Its variance uses the coefficient covariance. Report the contrast at chosen values with interval and avoid claiming effect modification from a coefficient alone without understanding the scale.

## Residual assumptions and inference

### What residual plots can reveal

Residuals are observed minus fitted outcomes. A curved residual pattern suggests a missing nonlinear term; a fan shape suggests nonconstant variance; bands over time indicate autocorrelation; isolated high-leverage points may have disproportionate influence. Studentized residuals, leverage, and Cook's distance are useful screening summaries, but fixed cutoffs are not automatic deletion rules. Investigate the data-generating context and report sensitivity for influential valid observations.

Normal Q-Q plots assess residual distribution, not whether predictors are normal. Mild tail departures mainly affect small-sample inference; in larger samples, coefficient estimates can be approximately normal under regularity conditions. Strong skew or heteroskedasticity may call for robust standard errors, transformation, generalized linear modeling, or bootstrap inference. Choose based on target and interpretability rather than a diagnostic test p-value alone.

Independence is especially important. Repeated outcomes from the same participant, measurements within clinics, or spatially linked observations require a dependence-aware variance or model. Cluster-robust standard errors need enough independent clusters; few-cluster corrections or mixed models may be needed. Robust variance does not correct omitted confounding or a wrong conditional mean.

### Leverage versus residual size

A case can have high leverage because its predictor values are unusual, even if its residual is small; another can have a large residual at an ordinary predictor pattern. Influence combines both. Investigate data validity and whether the point lies within the target population. If it is valid but rare, a linear model may be extrapolating from little support; report that limitation rather than trimming the case to improve fit.

OLS coefficient estimates are unbiased under a correctly specified conditional mean and exogeneity, \(E(\epsilon\mid X)=0\). Classical standard errors assume independent, constant-variance errors; residual normality supports exact small-sample t inference but is not required for unbiasedness. With heteroskedasticity, robust standard errors can improve inference. With clustered observations, cluster-robust or multilevel methods are needed.

Inspect residual-versus-fitted plots for nonlinearity and unequal variance, Q-Q plots for tail departures, leverage and Cook's distance for influence, and residuals over time or cluster for dependence. Diagnostics identify concerns; they do not validate causal assumptions. Large samples can make minor deviations statistically detectable, so consider practical impact and sensitivity.

Heteroskedasticity-robust standard errors change estimated uncertainty, not fitted coefficients or misspecified mean. Weighted least squares can improve efficiency if variance structure is known or modeled, but incorrect weights can harm inference. Bootstrap intervals must resample the independent unit and refit the entire analysis.

## Prediction and validation

For prediction, evaluate out-of-sample error using RMSE, MAE, calibration plots, and prediction intervals. Training (R^2) always increases with added predictors, so use adjusted (R^2), cross-validation, or external validation to assess generalization. Randomly splitting repeated observations from the same person leaks information; split by patient, clinic, or time according to deployment.

A confidence interval for the mean response is narrower than a prediction interval for an individual outcome because the latter includes residual variation. Do not present a fitted mean as a precise individual prediction. Check whether predictions are used within the observed predictor range; linear models extrapolate indefinitely and can yield impossible values.

For an explanatory analysis, cross-validation is not required to interpret an unbiased coefficient under its model assumptions, but it is important if the fitted equation will predict new outcomes. For a prediction task, a random split can be unstable in small samples; bootstrap optimism correction or repeated cross-validation may use data more efficiently. If there are repeated patients or multiple hospitals, split by the independent patient or hospital according to intended deployment.

Report prediction error with uncertainty and compare to a simple benchmark such as predicting the training mean. A high (R^2) may arise from a wide outcome range and does not ensure low individual prediction error. External validation should check calibration slope and intercept as well as RMSE or MAE. Recalibration or model updating changes the model and should itself be evaluated.

Extrapolation is especially risky with polynomial and spline models. A quadratic model can turn sharply upward outside the observed range; spline tails can also behave unexpectedly. Restrict displays to data support and flag predictions outside it. Prediction intervals should include residual variability, parameter uncertainty, and clustering when relevant.

## Missing data, outliers, and influential observations

Complete-case regression estimates can be biased if inclusion depends on outcome or predictors. Describe missingness, use appropriate likelihood or imputation methods under stated assumptions, and perform sensitivity analysis when MNAR is plausible. Imputation models should include outcome, predictors, nonlinear terms, interactions, and auxiliary variables relevant to missingness.

Outliers can be valid observations or data errors. Verify source records; do not remove cases just because they alter significance. Robust regression can reduce sensitivity to extreme residuals but changes the estimand/weighting. Report prespecified handling and compare estimates under defensible alternatives.

Heteroskedasticity means residual variance varies with predictors. OLS coefficient estimates can remain unbiased under exogeneity, but usual standard errors may be wrong and OLS may be inefficient. HC-type sandwich errors often provide asymptotically robust inference; in small samples, corrections or bootstrap procedures may be preferable. Weighted least squares can model known variance patterns, but weights should be justified and not chosen to minimize p-values.

If outcome errors are clustered or longitudinal, robust standard errors should be clustered at the independent sampling unit. A participant-level cluster correction is not enough when the exposure was assigned to clinics. With few clusters, use small-sample methods or design-based inference. A random intercept may improve efficiency and model heterogeneity, but assumes a distribution for cluster effects.

## Causal limits and reporting

An adjusted coefficient is causal only under exchangeability, positivity, consistency, correct temporal ordering, and adequate model specification. Reverse causation, measurement error, selection, and unmeasured confounding can persist. Cross-sectional regression especially cannot establish whether exposure preceded outcome. State whether results are descriptive, predictive, or causal and avoid “independent predictor” when only conditional association is meant.

In randomized trials, baseline adjustment can improve precision if specified in advance and should not compromise the randomized assignment contrast. In nonrandomized data, regression adjustment identifies a causal effect only when all relevant confounding is measured and controlled appropriately. The model cannot distinguish confounders from mediators using statistical significance. Draw a causal diagram or define a target trial before adjustment.

For a total effect, do not casually adjust for post-exposure variables on the causal pathway. If treatment affects adherence, which affects outcome, including adherence changes the estimand and can create collider bias. If time-varying confounders are affected by prior exposure, standard regression may be inadequate; g-methods may be needed. State the target contrast and temporal roles of covariates.

Linear regression is sensitive to the observed outcome range. A mean difference in a selected hospital cohort may not generalize to community care if referral changes both predictors and outcome distribution. External validity is a separate question from model fit. Describe the sample, recruitment, eligibility, and setting so readers can judge transport.

Report sample size, outcome scale, predictor coding, transformations, interactions, model formula, variance estimator, missing-data handling, diagnostics, and validation. Give coefficient estimates with confidence intervals in meaningful units and include model fit where relevant. For prediction, report validation design and calibration; for causal contrasts, state identification assumptions and target population.

## Joint hypotheses and model comparison

An individual coefficient t-test addresses one conditional slope. A joint F-test can assess whether a set of indicators or spline terms contributes collectively, such as whether a categorical exposure has any association or whether nonlinear components improve on a linear term. The model-comparison test should correspond to nested models and a prespecified question. Selecting a model by whichever p-value is smallest inflates uncertainty.

Adjusted (R^2) penalizes additional predictors lightly but is not a causal criterion or guarantee of predictive performance. AIC and cross-validation target relative predictive fit under their own assumptions. For explanation, retain scientifically necessary confounders even if they add little predictive fit. For prediction, avoid reporting training fit as evidence of generalization.

Confidence intervals for coefficients quantify sampling variation conditional on model selection and assumptions. If the same dataset was used to search transformations, interactions, and subgroups, ordinary intervals ignore that search. Prespecification, shrinkage, bootstrap of the full selection procedure, or independent validation can address some optimism. Report the analytic pathway honestly.

When comparing estimates across studies, differences in covariate adjustment sets and outcome scales can matter as much as sampling error. Harmonize estimands before interpreting apparent inconsistency.

State whether reported intervals are confidence or prediction intervals.

The former describes uncertainty in a conditional mean; the latter includes residual variability for a new outcome. Naming the interval prevents false precision in clinical prediction.

If reporting a population-average intervention contrast, standardize fitted means over a stated target population rather than evaluating the equation at a single “average patient.” With interactions or nonlinear terms, the latter can yield a different and sometimes nonexistent covariate profile.

For repeated observations on the same participant, ordinary least squares also requires an appropriate account of within-person dependence. A subject-specific random-intercept model or a marginal model with cluster-robust standard errors may be suitable, depending on whether the target is an individual-specific or population-average association. Merely adding participant ID as a numeric predictor does not model the correlation structure. With few independent clusters, conventional sandwich standard errors can be biased downward; small-sample corrections or a design-based analysis may be needed. Explain the unit of analysis, clustering level, and variance method so readers can judge whether the stated interval reflects the actual sampling process.

## References and further reading

- Kutner MH, Nachtsheim CJ, Neter J, Li W. *Applied Linear Statistical Models*. 5th ed. McGraw-Hill; 2005.
- Harrell FE. *Regression Modeling Strategies*. 2nd ed. Springer; 2015.
- Gelman A, Hill J, Vehtari A. *Regression and Other Stories*. Cambridge University Press; 2020.
- Fox J, Weisberg S. *An R Companion to Applied Regression*. 3rd ed. Sage; 2019.
- The [model assumptions and diagnostics article](model-assumptions-and-diagnostics.html) develops diagnostic tools in more detail.
