---
title: Simple and multiple linear regression
summary: Models a continuous outcome as a weighted sum of predictors, allowing adjustment for confounders and prediction from several variables.
---

## Overview and key ideas

Simple linear regression models one continuous outcome Y as a straight-line function of a single predictor X: Y = β₀ + β₁X + ε, where β₀ is the intercept and β₁ the slope — the average change in Y for each one-unit increase in X. Multiple linear regression extends this to several predictors: Y = β₀ + β₁X₁ + β₂X₂ + … + βₖXₖ + ε. Each coefficient βⱼ then has the interpretation "the average change in Y per one-unit increase in Xⱼ, *holding the other predictors fixed*", which is what lets the model adjust for confounding.

The model is fitted by least squares, minimising the sum of squared vertical deviations of observed points from the fitted line. The key outputs are the coefficient estimates with their standard errors, p-values and confidence intervals, the R² (proportion of variance in Y explained by the model), and the adjusted R², which penalises for adding useless predictors. A model with a single predictor is simple regression; with two or more it is multiple, but the mathematics is the same.

## When to use it

| Setting | Example question |
| --- | --- |
| Prognostic research | Do age, cholesterol and smoking status predict resting systolic blood pressure? |
| Dose–response | Is the change in FEV₁ per month related to inhaled corticosteroid dose? |
| Adjustment | Does statin use remain associated with lower LDL after adjusting for diet score? |
| Prediction | Can a simple equation from routine labs estimate GFR? |

Use it when the outcome is continuous and roughly normally distributed around its mean, the main goal is estimation or adjustment, and the relationship of interest is plausibly linear. If the outcome is a count (e.g. number of ER visits), a binary result (died/survived), or a time-to-event, other models are more appropriate — Poisson/negative binomial, logistic, or survival regression respectively.

## Assumptions and limitations

- **Linearity**: the mean of Y changes linearly with each predictor; curvilinear relationships bias the coefficients and predictions.
- **Independence**: residuals are uncorrelated across observations; violated by clustered or repeated-measures data (e.g. multiple visits per patient).
- **Homoscedasticity**: the spread of residuals is constant across fitted values; with heteroscedasticity the coefficient estimates remain unbiased but standard errors and p-values are wrong.
- **Normality of residuals** (for exact p-values and CIs in small samples); with large n the central limit theorem makes the estimates robust to mild departures.
- **No strong multicollinearity**: highly correlated predictors make individual coefficients unstable, with wide CIs and sign flips, even though overall predictions stay fine.

## Worked example

A hospital team wants to predict admission systolic blood pressure from age and BMI. Fitting the model to 300 admissions gives: SBP = 84.2 + 0.38·(age) + 0.91·(BMI). For a 60-year-old with BMI 28, the predicted SBP is 84.2 + 22.8 + 25.48 = 132.48 mmHg, about 132.5. The age coefficient of 0.38 means a one-year older patient is expected to have about 0.4 mmHg higher SBP at the same BMI. Age is p < 0.001 (95% CI 0.30 to 0.46) and BMI is p = 0.002 (95% CI 0.40 to 1.42), and R² = 0.41: age and BMI together explain 41% of the observed variation around the sample mean. In ordinary least squares with an intercept, residual SD relative to the outcome SD is approximately sqrt(1−R²)=sqrt(.59)=.768, or 77%, not 24%; substantial individual variation therefore remains unexplained.

## Interpretation and common pitfalls

- "Holding the other predictors fixed" does not mean they *were* fixed — in observational data the adjusted coefficient is a controlled association, and it estimates a causal effect only under no-unmeasured-confounding and a correct model.
- Never interpret a coefficient of a continuous predictor from a model where it was entered as a dummy or vice versa; scaling (e.g. age in decades vs years) changes the coefficient but not the fit.
- A small p-value on an added predictor can coexist with a large change in the main predictor's coefficient — that is confounding, and the adjusted (post-change) coefficient is the one to report.
- Do not select predictors by fishing for significance one at a time; this inflates false positives and gives an optimistic R².

The coefficient in a multiple regression is a conditional contrast: expected outcome difference for a one-unit predictor change with the listed covariates held fixed. It is not automatically a causal effect. If the objective is causal, define the intervention and estimand and justify adjustment from the causal structure; controlling for mediators or colliders can introduce bias. For prediction, do not interpret conditional coefficients as independent importance rankings when predictors are correlated. Report units, coding and a confidence interval, inspect nonlinear terms, and avoid predictions outside the observed covariate range.

## Least squares, estimands, and coefficient interpretation

In matrix notation, the linear model is Y=Xβ+ε. Ordinary least squares chooses β̂ to minimize Σ(y_i−ŷ_i)², yielding β̂=(X'X)^−1X'Y when X has full column rank. This is a conditional mean model: E(Y|X)=Xβ. It does not require predictors to be normally distributed. Under zero conditional mean, the fitted slope estimates the specified linear projection; unbiasedness for a causal effect requires much stronger design and confounding assumptions. Correlated predictors can make X'X nearly singular, increasing coefficient variance and making individual effects unstable.

A slope is a conditional contrast: expected mean outcome difference for a one-unit change in that predictor while other included predictors are held fixed. If age is measured in years, β_age is mmHg/year; rescaling age to decades multiplies the coefficient by ten and divides its standard error by ten without changing fitted values. Centering predictors changes the intercept and main-effect interpretation in models with interactions but not fitted values or model fit. Always report coding and reference levels for categorical variables.

### Worked example: fitted values and residuals

Using SBP=84.2+.38(age)+.91(BMI), the prediction for age 60 and BMI 28 is 132.48 mmHg. If observed SBP is 140, residual=140−132.48=7.52 mmHg. A positive residual means observed pressure exceeded the fitted conditional mean. It is not a prediction error for an individual guaranteed to be correct; it combines unexplained variation, measurement error, and possible model misspecification.

```r
fit <- lm(sbp ~ age + bmi, data = dat)
coef(fit)
predict(fit, newdata = data.frame(age = 60, bmi = 28),
        interval = "prediction")
resid(fit)[1]
```

A prediction interval is wider than a confidence interval for the conditional mean because it includes residual individual variation. Newdata must use exactly the model's variable names and factor levels. Predictions outside the observed age/BMI range are extrapolations and should be labeled as such.

## Multiple predictors, confounding, and collinearity

Adding covariates can reduce confounding for an observational contrast, improve precision, or support prediction; these are distinct motivations. A coefficient adjusted for covariates is conditional on their values and can differ from the crude coefficient because of confounding, nonlinearity, or non-collapsibility in related generalized models. Do not adjust mechanically for every available variable. In causal analysis, avoid controlling for mediators when estimating total effects and for colliders that induce selection bias; use a causal diagram and define the estimand.

Multicollinearity occurs when predictors contain overlapping information. It does not necessarily harm predictions, but inflates standard errors and makes conditional coefficients sensitive to small data changes. The variance inflation factor (VIF) is 1/(1−R_j²), where R_j² is the R-squared from regressing predictor j on the others. VIF=5 means variance is five times what it would be under orthogonality, and SE is multiplied by √5≈2.24. There is no universal cutoff; consider the scientific estimand and coefficient stability.

Categorical predictors use indicator variables. With k categories, a reference-coded model has k−1 coefficients; the intercept corresponds to the reference category at continuous covariates equal to zero. Releveling changes coefficient labels but not fitted values. For ordered or continuous predictors, imposing a linear score trend is an assumption, not an automatic property of codes 1,2,3.

## Functional form and interactions

A straight-line term assumes a constant change in conditional mean per unit predictor. Inspect residuals versus each continuous predictor and consider splines or prespecified quadratic terms when curvature is plausible. Categorizing age or biomarkers loses information and introduces arbitrary boundaries. Restricted cubic splines allow smooth nonlinear associations while retaining the continuous scale, though added degrees of freedom require adequate sample size.

If an interaction X×Z is included, the main effect of X is its slope at Z=0. Centering Z at a clinically meaningful value makes that coefficient interpretable. For example, center age at 60 so the treatment coefficient describes effect at age 60 rather than the impossible age zero. Present predicted means or contrasts across representative covariate values; the product coefficient alone can be hard to interpret.

## Uncertainty, fit, and interpretation

Under classical assumptions, coefficient standard errors support t tests and confidence intervals. Heteroscedasticity does not bias OLS coefficients when conditional mean is correct, but conventional standard errors are wrong; sandwich estimators or variance models can address inference. Dependence from repeated patients or clinics requires cluster-aware standard errors, GEE, or mixed models. Residual normality supports exact small-sample inference, not unbiasedness of β̂. Diagnostics should assess conditional mean, variance, dependence, and influential records.

R-squared is the fraction of sample outcome variability around its mean explained by the fitted model in ordinary least squares with an intercept. It is not percent accuracy, causal explanation, or external predictive performance. Adding predictors cannot lower ordinary R², so adjusted R² penalizes parameter count but does not replace validation. Residual standard error describes residual spread in outcome units. Compare models with appropriate criteria and validate prediction models on new or resampled data.

## Practical R workflow

```r
fit <- lm(sbp ~ age + bmi + smoking, data = dat)
summary(fit)
confint(fit)
plot(fit, which = 1:4)  # residual, Q-Q, scale-location, influence
car::vif(fit)           # inspect collinearity
```

R code assumes one independent row per analysis unit and correctly coded missingness. If patients have repeated visits, a simple `lm` standard error is generally not appropriate. Report coefficient, units, interval, sample size, model form, and purpose (causal estimation, association, or prediction); do not conflate these claims.


## Confidence intervals, contrasts, and clinical meaning

A coefficient confidence interval estimates uncertainty in a conditional mean contrast under the model. If β_age=.38 with 95% CI .30 to .46 mmHg/year, a 10-year contrast is 3.8 mmHg with interval 3.0 to 4.6 by linear rescaling. This interval is not a prediction interval for a patient's pressure. To estimate an adjusted mean difference between two treatment levels, use a linear contrast of coefficients; its variance uses the full covariance matrix, including covariance among estimates.

For a binary factor, a coefficient compares the nonreference category to reference holding other predictors fixed. For a multi-level factor, use an omnibus F or Wald test before interpreting individual contrasts if the overall factor is the scientific question. Multiple pairwise contrasts need a multiplicity strategy. Report both statistical uncertainty and a clinically meaningful threshold, such as a minimally important SBP reduction.

### Centering and changing units

Suppose age ranges 20–90 years. The intercept at age zero has no clinical meaning. Centering age at 60 makes the intercept the expected outcome at age 60 and allows interactions to be interpreted there. Centering does not change slope, fitted values, residuals, or R² in a model without interactions, but it can reduce nonessential collinearity when products or polynomials are present.

```r
dat$age60 <- dat$age - 60
fit <- lm(sbp ~ age60 * treatment + bmi, data = dat)
```

The treatment coefficient now describes the treatment contrast at age 60; the interaction coefficient describes change in that contrast per year. Verify treatment factor coding and avoid interpreting coefficients outside observed support.

## Collinearity and partial association

A multiple-regression coefficient is not a simple correlation. It describes the association between Y and the part of X_j not linearly predictable from the other included covariates, with analogous adjustment in Y. If age and comorbidity are highly correlated, their individual conditional slopes can be imprecise even if together they strongly predict outcome. VIF is one diagnostic, but coefficient standard errors, correlation matrices, and stability under scientifically reasonable specifications are also useful.

Collinearity is not fixed by deleting a clinically essential confounder. If the target is the combined predictive value, evaluate prediction. If the target is an individual causal effect, reconsider whether the data can identify it precisely and whether the estimand is sensible. Principal components or ridge regression change coefficient interpretation; they can help prediction but do not automatically answer a causal question.

## Model fit and residual scale

R²=1−SSE/SST in ordinary least squares with an intercept. It measures in-sample variance explained relative to a mean-only model. Residual standard error is sqrt(SSE/(n−p)), where p counts fitted coefficients including intercept. R² does not describe calibration for new data and can be high in a confounded model. Adjusted R² may decrease when a predictor adds little, but is not an external validation estimate.

For each coefficient, report estimate, interval, and unit. For prediction, report a prediction interval or validated error metric. For causal estimation, emphasize the prespecified contrast and assumptions rather than model fit. A high R² cannot demonstrate a causal mechanism; a low R² does not invalidate a precise mean effect.

## Confounding and model purpose: a practical distinction

Suppose treatment T and baseline severity S both predict outcome Y. A crude difference in Y by T may combine treatment association and severity imbalance. Adding S estimates a conditional contrast only if S is measured adequately and the model form is correct. If S is a mediator caused by treatment, adjustment removes part of a total treatment effect; if S is a collider, adjustment can induce bias. Draw a causal diagram and define whether the goal is total effect, direct effect, or prediction before selecting covariates.

For prediction, a predictor need not be causal, but must be available at prediction time and stable enough to transport. For causal estimation, a predictor's predictive value alone does not make it a confounder. This distinction is essential when interpreting “adjusted” coefficients.

## Missing data and influence

`lm()` uses complete cases by default, potentially changing the analytic population. Report how many rows were excluded and why. If missingness depends on observed covariates, multiple imputation or weighting may be defensible under assumptions; compare with complete-case results. For repeated outcomes, use models aligned to the longitudinal estimand rather than analyzing only complete trajectories without justification.

Influential cases can arise from a valid rare covariate pattern. Check Cook's distance and DFBETAs, then verify source data and eligibility. If valid, retain in the primary analysis and show sensitivity if conclusions change. Deleting cases based on their effect on statistical significance is not a neutral cleaning choice.

## Prediction versus explanation

A regression equation can be used to estimate a conditional mean, but prediction for a new individual must include residual variability. `interval="confidence"` describes uncertainty in the mean at specified covariates; `interval="prediction"` describes an individual outcome and is wider. Both rely on model assumptions and are unreliable far outside the predictor support. Validate prediction error on held-out or resampled data and check calibration across clinically relevant subgroups.

For explanatory analysis, focus on the target contrast and its uncertainty, not on maximizing R². For causal interpretation, adjust for a defensible confounder set and state consistency, exchangeability, and positivity assumptions. For prediction, prioritize validation and calibration; a variable can predict without being causal. A single model report should not blur these goals.

## Checking a prediction by hand

For the SBP example, a point prediction is a weighted sum of predictor values plus an intercept. Confirm each unit and coefficient before reporting. A 10-year increase contributes 3.8 mmHg; a 5-unit BMI increase contributes 4.55 mmHg under the fitted linear model. These are conditional model contrasts and assume no interaction or curvature over those ranges. If prediction is intended for practice, compare predicted and observed values in an independent sample and report error in mmHg.

When reporting multiple regression, include the analysis n and missing-data strategy, coefficient units and coding, interval estimates, model purpose, and diagnostics. For prediction, show validated error and calibration rather than only coefficients. For causal contrasts, state the target population and adjustment assumptions. An equation without its scale, reference group, and population is difficult to reproduce or use.

If residuals show substantial skew or heteroscedasticity, compare conventional, robust, and model-based intervals rather than choosing whichever is narrowest. Report the primary method and whether conclusions change. A p-value near .05 is especially sensitive to uncertainty method; the effect estimate and interval provide a fuller account than a binary significance label.

## References and further reading

- Fox J. *Applied Regression Analysis and Generalized Linear Models*. SAGE.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and Other Advanced Topics*. Brooks/Cole.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- The companion [model assumptions and diagnostics article](model-assumptions-and-diagnostics.html) covers checks for linearity, residual spread and influential points.
