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

A hospital team wants to predict admission systolic blood pressure from age and BMI. Fitting the model to 300 admissions gives: SBP = 84.2 + 0.38·(age) + 0.91·(BMI). For a 60-year-old with BMI 28, the predicted SBP is 84.2 + 22.8 + 25.5 = 132.5 mmHg. The age coefficient of 0.38 means a one-year older patient is expected to have about 0.4 mmHg higher SBP at the same BMI. Age is p < 0.001 (95% CI 0.30 to 0.46) and BMI is p = 0.002 (95% CI 0.40 to 1.42), and R² = 0.41: age and BMI together explain 41% of the variation in SBP, so a typical observed value deviates from its prediction by roughly sqrt(1 − 0.41) ≈ 24% of the SD.

## Interpretation and common pitfalls

- "Holding the other predictors fixed" does not mean they *were* fixed — in observational data the adjusted coefficient is a controlled association, and it estimates a causal effect only under no-unmeasured-confounding and a correct model.
- Never interpret a coefficient of a continuous predictor from a model where it was entered as a dummy or vice versa; scaling (e.g. age in decades vs years) changes the coefficient but not the fit.
- A small p-value on an added predictor can coexist with a large change in the main predictor's coefficient — that is confounding, and the adjusted (post-change) coefficient is the one to report.
- Do not select predictors by fishing for significance one at a time; this inflates false positives and gives an optimistic R².

The coefficient in a multiple regression is a conditional contrast: expected outcome difference for a one-unit predictor change with the listed covariates held fixed. It is not automatically a causal effect. If the objective is causal, define the intervention and estimand and justify adjustment from the causal structure; controlling for mediators or colliders can introduce bias. For prediction, do not interpret conditional coefficients as independent importance rankings when predictors are correlated. Report units, coding and a confidence interval, inspect nonlinear terms, and avoid predictions outside the observed covariate range.

## References and further reading

- Fox J. *Applied Regression Analysis and Generalized Linear Models*. SAGE.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and Other Advanced Topics*. Brooks/Cole.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- The companion [model assumptions and diagnostics article](model-assumptions-and-diagnostics.html) covers checks for linearity, residual spread and influential points.
