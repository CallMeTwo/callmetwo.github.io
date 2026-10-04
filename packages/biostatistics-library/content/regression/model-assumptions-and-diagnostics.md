---
title: Model assumptions and diagnostics
summary: Residual plots and tests that check linearity, independence, constant variance and influential points after fitting a regression model.
---

## Overview and key ideas

Every regression model rests on assumptions — linearity of the mean, independence of observations, constant residual variance, normality of residuals (for exact inference in small samples), and the absence of overly influential observations. Diagnostics are the systematic check that these hold for *your* data rather than in theory. The workhorse tool is the residual: the difference between observed and fitted values. Residuals should look like random noise — mean zero, constant spread, no pattern against fitted values, predictors, or time — and anything structured in them points to a specific violated assumption.

For generalised linear models (logistic, Poisson) the raw residuals are not scale-free, so diagnostics use *standardised* or *deviance* residuals; the same logic applies, but a residual "larger than 3" is judged on a roughly standard-normal scale. The goal is not to prove the model right — it is to find the specific, fixable problems (a curved relationship, a leveraged outlier, clustered errors) before trusting the coefficients.

## When to use it

- **After fitting any regression** — linear, logistic, Poisson — as a routine step before reporting coefficients, p-values or predictions.
- **Before publication** — journals increasingly expect evidence that assumptions were checked, or a statement of why the chosen robust alternative is fine.
- **When results look suspicious** — a p-value that flips after adding a covariate, a coefficient with a huge confidence interval, or predictions outside a plausible range.
- **After a data revision** — new participants, exclusions or a change in outcome definition can break a previously fine model.

## Assumptions and limitations

The standard checklist, and the diagnostic that reveals each failure:

- **Linearity** — mean of Y changes linearly with each continuous predictor. Check: residual-vs-fitted plot and residual-vs-predictor plots; a smooth (lowess) through the residuals should be flat. A curved trend → add a quadratic term, spline, or transform.
- **Independence** — residuals uncorrelated across subjects. Check: plot residuals in the order data were collected (e.g. visit date); an autocorrelation pattern → use mixed models or GEE. This is the assumption no plot of fitted values can catch, because it is a property of the *design*.
- **Homoscedasticity** — residual spread constant across fitted values. Check: residual-vs-fitted plot; a fan or cone shape (e.g. SD of lab values growing with mean) → use robust (sandwich) standard errors, a variance-stabilising transform such as log(Y), or weighted regression.
- **Normality of residuals** — for ordinary least squares this supports exact small-sample t and F inference, not unbiasedness of the slope. Check a Q–Q plot; there is no universal sample-size cutoff at which non-normality becomes harmless. Robust or bootstrap inference may help for some departures, but neither corrects a misspecified mean or dependence.
- **Influential points** — one observation driving the fit. Check: Cook's distance (commonly flagging d > 4/n), leverage values (hᵢ > 2k/n, where k is the number of parameters), and the change in coefficients on case deletion. A point can be influential without being an outlier in Y.

## Worked example

A team fits a linear model of postoperative pain score (0–10) on age, BMI and analgesic dose in 180 patients. The residual-vs-fitted plot shows a clear funnel: residual spread near 1.0 for pain scores around 2 but around 2.5 near 8, a variance ratio of roughly 6 between the low- and high-pain groups. The Q–Q plot is otherwise unremarkable, the lowess curve is flat (linearity fine), and no Cook's distance exceeds 4/180 = 0.022. Because the outcome is a bounded scale with mean–variance dependence, the team refits with weighted least squares using weights proportional to 1/fitted variance; the coefficient for analgesic dose changes from −0.31 (p = 0.004) to −0.27 (p = 0.02) with a similar CI width — the conclusion is unchanged, but the standard errors are now valid. The practical lesson: the p-value *before* the fix was anti-conservative, and the funnel was visible in a single plot.

## Interpretation and common pitfalls

- A statistically "significant" Shapiro–Wilk test on residuals does not automatically invalidate a large-sample model; normality is needed for exact small-sample inference, and the central limit theorem does the rest. Judge the Q–Q plot, not only the test p-value.
- A single influential point is a *reason to investigate the data*, not automatically a reason to delete it — check for data-entry error first; deleting without documentation is a reproducibility problem.
- Checking only the residual-vs-fitted plot misses independence violations and predictor-specific nonlinearity; each key continuous predictor deserves its own residual plot.
- Diagnostics on the *final* model after stepwise selection can look deceptively clean; fit the diagnostics to the model you actually intend to report, and remember that selected models overstate R².
- Robust standard errors fix heteroscedasticity inference but do not fix a badly misspecified mean; the linear fit may still be wrong.

Diagnostics are model-specific. For linear regression, non-normal errors do not bias ordinary least-squares slopes by themselves; normality primarily supports exact small-sample t and F inference, while heteroscedasticity can invalidate conventional standard errors. Sandwich standard errors address the latter asymptotically but do not repair a wrong conditional mean, dependence, or extrapolation. In logistic and count models inspect calibration, influential observations, functional form on the link scale, and overdispersion where relevant; a generic residual cutoff is not a universal decision rule. Predefine sensitivity analyses and show whether conclusions depend on influential records rather than deleting them automatically.

## References and further reading

- Fox J. *Applied Regression Analysis and Generalized Linear Models*. SAGE.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and Other Advanced Topics*. Brooks/Cole.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- *The topic map's "Regression models" section introduces the models whose assumptions are checked here (articles planned).*
