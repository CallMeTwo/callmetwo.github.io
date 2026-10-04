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

## Diagnostics begin with the design and estimand

A diagnostic plot cannot verify that the target population is represented, that confounders were measured, or that the model matches the scientific question. First identify independent units, repeated observations, clustering, time ordering, and missing-data mechanisms. Then assess model components: conditional mean, variance, dependence, distributional assumptions needed for inference, and influence. Diagnostics are not a sequence of tests that certify validity; they are evidence used to find misspecification and motivate sensitivity analyses.

For ordinary least squares, residual e_i=y_i−ŷ_i should have conditional mean zero. A residual-versus-fitted plot can reveal curvature, nonconstant spread, or groups. Residuals versus each continuous predictor detect functional-form errors hidden by the overall plot. Plot residuals against time/order for serial structure. A normal Q–Q plot assesses tail shape; exact normality mainly supports small-sample t/F reference distributions, not unbiased OLS coefficients. Independence is primarily justified from design and sampling, not a residual histogram.

## Worked diagnostic calculations

In the pain-score example n=180. The common Cook's distance screen 4/n=4/180=.0222 identifies cases for review, not automatic deletion. If a point has D=.03, inspect leverage, studentized residual, source data, and coefficient changes. High leverage h_i is unusual predictor configuration; influence combines leverage and residual. A valid patient can be influential and should generally remain in the primary analysis, with sensitivity checks if needed.

A funnel with residual SD near 1 at low fitted values and 2.5 at high fitted values indicates variance ratio 2.5²/1²=6.25, not merely 2.5. If weights are proportional to inverse residual variance, high-variance observations receive less weight. Weights must arise from a defensible variance model; setting them from outcome residuals without accounting for estimation uncertainty can overstate precision. Heteroscedasticity-consistent standard errors offer a simpler asymptotic correction while leaving OLS fitted mean unchanged.

```r
fit <- lm(pain ~ age + bmi + dose, data = dat)
n <- nobs(fit)
cook_flag <- cooks.distance(fit) > 4/n
plot(fit, which = 1) # residuals versus fitted
plot(fit, which = 2) # normal Q-Q plot
plot(fit, which = 4) # Cook's distance
```

The 4/n threshold is a heuristic. Inspect case identifiers securely and verify values against source; do not publish identifiers. Use plots and model context rather than a single cutoff.

## Functional form and transformations

Linearity refers to the conditional mean for a continuous predictor, not necessarily a straight marginal scatter. Partial residual or component-plus-residual plots can help reveal adjusted curvature. Add a quadratic term or spline when clinically plausible, and compare predicted means across the observed range. Center predictors for interpretability and ensure enough data in tails. Transforming Y changes the modeled mean scale; transforming X changes how unit increases are interpreted. Do not select a transformation solely because it produces a favorable p-value.

For GLMs, check linearity on the link scale. Logistic models require log odds linear in continuous predictors; Poisson models require log rate linear. Plot residuals or calibration against predictors and assess overdispersion for counts. Pearson/deviance residuals are useful but do not have a universal standard-normal cutoff for every GLM. Binned residual plots can expose systematic errors, but bins can hide local patterns.

## Dependence and variance structure

Repeated measures, family data, clinics, and serial observations violate simple independence. Estimate cluster-robust standard errors only with enough independent clusters and suitable small-sample corrections. Mixed models specify random effects; GEE specifies a working correlation and robust sandwich variance. Choose based on target (conditional vs population-average) and design. Newey–West or time-series methods address particular serial correlation patterns, not arbitrary clustering.

Homoscedasticity violations affect conventional standard errors and prediction intervals. White/HC robust covariance estimates can be useful for large samples, but do not fix biased mean estimates, influential observations, or dependence. Weighted least squares can improve efficiency if inverse variance weights are correct; if weights are estimated, their uncertainty and positivity matter.

## Influence and sensitivity analysis

Cook's distance, leverage, DFBETAs, and leave-one-out refits reveal how individual cases affect estimates. They are diagnostic summaries, not deletion rules. Check transcription, eligibility, measurement units, and whether the case represents a real subgroup. If valid but influential, report the full-data result and a transparent sensitivity analysis, potentially using robust regression where its estimand is suitable. A robust fit should not silently replace the prespecified analysis.

## Reporting diagnostics

Document key plots, tests only when informative, and remedies applied. State whether robust SEs, transformations, splines, cluster corrections, or exclusions were used and why. Report whether substantive estimates changed under reasonable specifications. Avoid saying “assumptions were met” from nonsignificant tests; tests have limited power and can be overly sensitive in large samples. Diagnostics support judgment; they do not prove the model true.


## Diagnostic tests and their limits

Breusch–Pagan-type tests can detect variance patterns; Ramsey RESET can flag mean-structure misspecification; Shapiro–Wilk can test residual normality. These tests are sensitive to sample size and model context. A small dataset may fail to detect serious violations, while a large one can reject negligible departures. Use plots and subject-matter reasoning, then quantify how inference changes under robust or alternative models. Do not treat a nonsignificant diagnostic test as proof of assumptions.

Autocorrelation tests such as Durbin–Watson are meaningful only under specific ordered linear-model settings. In repeated clinical observations, the design itself indicates dependence; a test should not be used to decide whether to cluster-adjust. Similarly, a VIF flags collinearity but does not say which variable to remove. Diagnostics identify questions, not automatic actions.

## Logistic and count model diagnostics

For logistic models, examine observed event frequency by predicted-risk groups with uncertainty, calibration slope/intercept, influential cases, and functional form of continuous predictors. Deviance residuals can flag unexpected observations but not replace calibration. For Poisson/NB models, compare observed and fitted counts and investigate overdispersion, zero frequency, temporal dependence, and offset accuracy. Simulated residuals can help for discrete outcomes because ordinary residual distributions are discrete and heteroscedastic.

No single residual threshold applies across Gaussian and generalized models. A binary outcome has limited residual values; a deviance residual above 3 has a different interpretation than a standardized Gaussian residual. Use diagnostics aligned to the likelihood and prediction objective.

## Remedies and sensitivity analyses

If a mean relationship is curved, specify a nonlinear function; if variance changes, consider robust covariance or a justified variance model; if data are clustered, fit cluster-aware models; if one valid point drives results, report sensitivity rather than deletion. Transformations alter scale and estimand, so translate coefficients back. Robust methods can improve stability but usually target a different functional (e.g. M-estimator location) and should be explained.

Repeat diagnostics after any substantive model revision and document the final model. If multiple models were explored, do not present only the one whose diagnostics look best without acknowledging selection. For confirmatory work, prespecify primary form and sensitivity alternatives where feasible.

## Residual definitions and scaling

For linear regression, raw residuals have different variances depending on leverage: Var(e_i)=σ²(1−h_ii). Standardized or studentized residuals account for this to varying degrees. A large raw residual at high leverage can have a modest standardized value, while a moderate raw residual at low leverage may be surprising. Internally studentized residuals use the full fit; externally studentized residuals refit without the point and can better identify outliers, but repeated testing across cases invites false flags.

For GLMs, Pearson residual is (y−μ̂)/sqrt(V(μ̂)) and deviance residual is signed square root of the observation's deviance contribution. Their distributions depend on the response family and fitted mean. Simulation-based residuals can standardize discrete outcomes by comparing each observed value with its fitted conditional distribution. Interpret with model context, not a universal cutoff.

## Remedies should match failure mechanism

Curvature suggests functional-form revision; nonconstant variance suggests robust covariance, transformation, or explicit variance modeling; serial dependence suggests time-series or repeated-measure structure; influential data suggest source review and sensitivity; separation suggests penalized logistic estimation. No one remedy fixes all failures. Report changed estimands when transforming outcomes or using robust loss functions. If a model is selected after extensive exploration, apparent diagnostic adequacy may be optimistic and should be validated.

A residual plot is not a test of causal identification. Unmeasured confounding, selection bias, and measurement error may leave no obvious residual pattern. Pair diagnostics with design review, missingness assessment, and sensitivity analysis for assumptions not testable from observed residuals.

## Leverage and influence calculations

For a linear model with p estimated coefficients, average leverage is p/n and Σh_ii=p. A point with high leverage lies in an unusual predictor region; it may or may not have a large residual. Cook's distance roughly combines residual size and leverage and measures how much the fitted coefficients change if the case is removed. The common 4/n or 4/(n−p) screens are heuristics; compare coefficient changes and predictions rather than treating the threshold as a deletion rule.

A high-leverage point can be scientifically valuable because it extends the covariate range, but it can also make a slope depend on one participant. Report whether the point was valid and show sensitivity. Avoid hiding high-leverage observations by trimming axes or removing cases before diagnostics.

## Diagnostics after transformations

If log(Y) is modeled, residual diagnostics apply on the log scale. Back-transformed predictions can be biased for arithmetic means due to Jensen's inequality. If a predictor is transformed, residual plots should assess the transformed functional form and the original-scale implications. Every remedy should be described in terms of the estimand and coefficient interpretation, not only that it made a diagnostic plot look cleaner.

## Practical sequence for model review

Start with data integrity and study design; map each assumption to a diagnostic or design justification; inspect response against predictors and residuals; evaluate variance, influence, and dependence; then fit defensible alternatives. Record which conclusions are stable. This sequence avoids the common ritual of generating a Q–Q plot while ignoring repeated patients or a wrong outcome definition. Re-run diagnostics after changes in data, inclusion criteria, or model specification.

Diagnostics should be reproducible: save plots, record thresholds and software, and tie each correction to a reason. If a model changed because of diagnostics, report the planned primary result and the revised or sensitivity analysis transparently. This is especially important when multiple plausible specifications yield different p-values; choosing one silently makes model checking a source of selective reporting.

Small-sample cluster-robust variance can be downward biased with few clusters. Use corrections or cluster-level randomization inference suited to the design, and report the number of clusters. A large patient count does not compensate for only a handful of independent sites when treatment varies by site. This limitation comes from design information, not from a residual plot.

The model's intended use changes which diagnostic matters most. For mean-effect estimation, coefficient bias and valid uncertainty are central; for individual prediction, calibration, error distribution, and extrapolation matter; for causal interpretation, residual plots cannot establish exchangeability. State the purpose before interpreting diagnostics so a clean plot is not mistaken for proof of causal validity.

## References and further reading

- Fox J. *Applied Regression Analysis and Generalized Linear Models*. SAGE.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and Other Advanced Topics*. Brooks/Cole.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- See also: [linear regression](simple-and-multiple-linear-regression.html), [logistic regression](logistic-regression.html), and [count regression](poisson-and-negative-binomial-regression.html), whose model-specific assumptions are reviewed here.

Keep diagnostic figures and decisions in an analysis log. Record which observation was reviewed, whether source data confirmed it, what model alternatives were considered, and whether the primary conclusion changed. This is particularly important when the number of plausible transformations or outlier rules is large, since undocumented analyst flexibility can make uncertainty appear smaller than it is.
