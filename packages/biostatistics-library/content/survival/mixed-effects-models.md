---
title: Mixed-effects models
summary: Regression for longitudinal and clustered data that separates between-subject and within-subject variation.
---

## Overview and key ideas

A **mixed-effects model** (linear mixed model, LMM) extends ordinary linear
regression to repeated and clustered observations by adding **random
effects** — random intercepts and, if needed, random slopes — for each subject
on top of the fixed effects that answer the research question. The typical
form is:

Y_ik = beta_0 + beta_1 x_ik + u_i + e_ik, where u_i ~ N(0, sigma_u²) is the
subject-specific deviation from the population intercept and e_ik ~ N(0, sigma_e²)
is the residual. The random term makes observations from the same subject
correlated, and the fixed effects are estimated with all available data —
including subjects who missed some visits — under maximum likelihood.

The fixed-effect estimates are what the paper reports; the variance components
(sigma_u², sigma_e²) quantify how much of the total variability is between
people versus within people over time.

## When to use it

| Setting | Example question |
| --- | --- |
| Longitudinal trial | How does haemoglobin change over 12 months in iron deficiency, and does iron therapy alter the slope? |
| Growth studies | How do children's heights grow, and does nutrition change the trajectory? |
| Clustered data | How do hospital-level staffing levels relate to readmission, when patients are nested within hospitals? |

Choose a mixed model when you want a **subject-specific** interpretation
("this individual's expected trajectory"), when the number of levels of a
clustering factor is large, or when you want to predict for individuals.

## Assumptions and limitations

- **Normality** of random effects and residuals; the LMM is least-squares in
  fixed effects and likelihood-based in variance components, so departures can
  bias standard errors more than point estimates.
- **Linearity** in the fixed effects; if growth is curvilinear, include
  polynomial or spline terms in time.
- The chosen **covariance structure** must be plausible: an uncorrelated
  structure ignores the data's design, and a compound-symmetry structure can
  be wrong for data whose correlation decays with time.
- With a small number of clusters (fewer than ~5–10 hospitals, say),
  variance components are estimated imprecisely and fixed-effect standard
  errors need cluster-robust or small-sample adjustments.
- Missing data are handled as missing-at-random by default; informative
  dropout violates that.

## Worked example

A trial randomises 200 children with iron-deficiency anaemia to oral iron
(n = 100) or placebo (n = 100), measuring haemoglobin at baseline, 3, 6, and
12 months. A mixed model with random intercepts and a fixed effect for time ×
treatment interaction gives an interaction coefficient of 1.1 g/dL
(95% CI 0.7 to 1.5): iron patients' haemoglobin rose about 1.1 g/dL more than
placebo patients' by 12 months, after allowing for each child's own baseline
level. The random-intercept variance (sigma_u² = 0.21) versus residual variance
(sigma_e² = 0.14) means about 60% of the variability is between children, so
averaging everyone's 12-month value into one comparison would discard most of
the signal.

## Interpretation and common pitfalls

- Fixed-effects and random-effects estimates of the **treatment effect** can
  differ: in a random-effects model the effect can be read as how a given
  person's outcome changes, while in a GEE it is the average change across
  people; choose the estimand first, then the model.
- Reporting standard errors from a model fitted with a misspecified
  covariance structure; use likelihood-ratio tests or information criteria to
  compare structures, but do not treat the chosen structure as truth.
- Confusing the random intercept with a covariate: the random intercept
  absorbs each subject's stable baseline, so a fixed baseline covariate should
  not also be added carelessly — check for separation and interpretability.
- Extrapolating beyond the observed time range: the model interpolates the
  visits you measured; predicted values past the last visit assume the
  trajectory continues as modelled.

Random intercepts and slopes induce a covariance pattern through the distribution of latent subject effects; they are not merely a way to “account for repeated measures.” Likelihood-based mixed models can use incomplete outcome trajectories under a missing-at-random assumption conditional on included variables and the observed history. This does not justify ignoring predictors of missingness or dropout. Random-effects normality and covariance assumptions can affect inference, and a population-average estimand may call for GEE instead. Include time-by-treatment interactions when the treatment contrast can evolve, and use planned contrasts to make the comparison at meaningful visits explicit.

## References and further reading

## Model interpretation and covariance

## Random intercept and slope example

## Worked coefficient and variance interpretation

Consider a model `score ~ treatment * time + (1 | id)` with treatment coded 1 for intervention and time in weeks. If the time coefficient is −0.4 and interaction is 0.15, the control group declines 0.4 score units/week, while the treated group declines 0.25/week. At week 8, the model-estimated between-arm contrast relative to baseline is 1.2 units. This is an average fixed-effect contrast if random effects have mean zero. If outcome scores are bounded or highly skewed, Gaussian residual assumptions may be poor; robust intervals, transformation, or an appropriate ordinal/count model could be needed.

Suppose random intercept variance is 25 and residual variance 36. For two observations close in time under a random-intercept-only model, the implied correlation is (25/(25+36)=0.41). This model implies constant covariance across times, which may be unrealistic if correlation decays. A random slope makes covariance depend on time and may yield near-perfect correlation at nearby measurement times while allowing trajectories to diverge. Examine model-implied covariance against empirical within-person patterns.

## Estimation, REML, and boundary tests

REML maximizes a likelihood based on error contrasts and typically reduces small-sample bias in variance components. Fixed-effect comparisons require ML because restricted likelihoods depend on fixed-effect design. Testing a random-effect variance of zero is on the boundary of parameter space; a conventional one-degree-of-freedom chi-square reference is not generally correct. Parametric bootstrap or mixture reference distributions may be more appropriate. Report estimation method and convergence warnings; a numerical convergence message is not a guarantee that the model is identified.

For non-Gaussian GLMMs, likelihood approximations can influence estimates. Adaptive quadrature may improve accuracy at additional computational cost, whereas Laplace approximations are faster. Compare integration settings for important parameters, inspect separation and sparse clusters, and consider penalization or weakly informative Bayesian priors when estimates diverge. Interpret priors transparently and assess sensitivity.

Suppose blood pressure is measured at baseline and months 3, 6, and 12. A random-intercept model assumes participants differ in their underlying level but share a common mean slope; adding a random slope permits individual slopes to vary. If time is in months, the fixed treatment-by-time coefficient is the between-arm difference in average monthly change. Rescale time to years or center it at 6 months to improve coefficient interpretation and numerical conditioning. Plot observed trajectories and group means before fitting; nonlinearity may be more important than random-slope complexity.

```r
library(lme4)
fit <- lmer(bp ~ treatment * splines::ns(month, df = 3) + baseline_bp +
              (1 + month | id), data = visits, REML = TRUE)
```

Natural spline terms allow a flexible population mean, while the random slope remains linear here. This mismatch can be sensible when individual deviations are approximately linear, but inspect diagnostics and compare justified structures. With four visits, a fully unstructured random-effects and residual covariance may be over-parameterized. Use likelihood, residual structure, and scientific design—not a convergence-free model alone—to select complexity.

## Subject-specific versus population-average interpretation

For Gaussian identity-link models, fixed effects in a linear mixed model can also describe marginal mean contrasts under mean-zero random effects. For nonlinear links, conditional and marginal effects differ. A logistic mixed model's exponentiated treatment coefficient is a conditional odds ratio for individuals with the same random effect. Population-average risk differences require integrating predicted outcomes over the random-effects distribution and averaging covariates. Setting random effects to zero estimates a typical conditional subject, not the average population risk.

If the policy question concerns average outcome across all eligible patients, calculate marginal standardized predictions. If the question concerns a patient with a given latent propensity, conditional predictions may be useful but are harder to validate clinically. Report which interpretation is intended, and be careful that random effects can absorb heterogeneity without identifying its source.

## Diagnostics and model uncertainty

## Missing-data sensitivity worked plan

## Predicting an individual trajectory

## Model reporting template

### Interpretation checklist

Clarify whether each coefficient describes a population mean or conditional subject-specific effect, and whether predictions include random-effect integration. Report time units, reference time, random-effects terms, variance components, residual assumptions, and handling of incomplete trajectories. Provide fixed-effect contrasts with intervals at useful times and model diagnostics. A random intercept captures modeled dependence but does not correct confounding, selection, or missing-not-at-random dropout.

State outcome distribution/link, fixed effects and interactions, random-effects structure, residual covariance, estimation method, optimizer and convergence, missingness assumption, and software. For continuous outcomes, provide variance components and ICC when informative; for nonlinear outcomes, clarify conditional versus marginal contrasts. Explain time centering and units so intercepts are interpretable. Report estimated means or contrasts at planned times with intervals rather than only omnibus tests. Share code that constructs long data and derives visit time, since errors in data reshape often alter dependence structure.

Do not present random-effect variance as evidence of biologically meaningful subgroups without validation. A continuous distribution of participant deviations is not equivalent to latent classes. Mixture models or trajectory groups introduce additional assumptions and should be externally validated before clinical subgroup claims.

Conditional fitted trajectories combine fixed effects with estimated participant random effects (BLUPs). These are shrinkage estimates: participants with sparse data are pulled toward the population mean more strongly than those with many observations. They should not be interpreted as error-free personal parameters. Prediction intervals for a future observation must include residual variation and uncertainty in fixed/random effects; confidence bands for the mean are narrower and answer a different question. Validate individual prediction by holding out participants, not random visits, to prevent leakage of each person's trajectory into both training and validation.

For clinical deployment, check calibration across time and subgroups and evaluate whether random-effect estimation is available at the time decisions are made. If predictions are needed before repeated data accumulate, random effects estimated from future visits are unavailable. Report the prediction time, history used, and update scheme.

Suppose participants with worsening symptoms are more likely to miss later visits. A likelihood mixed model using observed outcomes is valid under MAR conditional on observed history included in the model, but worsening not captured by previous measurements makes MNAR plausible. First include strong observed predictors of attendance and outcome, then describe missingness by prior outcome and arm. As sensitivity analysis, use pattern-mixture imputation that shifts missing outcomes by δ points relative to MAR predictions, varying δ over clinically plausible deterioration. Plot the treatment contrast across δ and identify the tipping point where inference changes. This does not estimate the true MNAR mechanism; it shows dependence of conclusions on untestable assumptions.

Joint models can link longitudinal outcome and time-to-dropout/event through shared random effects, but add distributional assumptions and computational complexity. Use them when the joint process is scientifically relevant, not as an automatic cure. Compare to simpler MAR analyses and report sensitivity to the association structure.

## Marginal contrasts from a mixed model

For Gaussian outcomes with identity link, fixed effects often yield marginal mean contrasts directly under zero-mean random effects. For logistic mixed models, obtain population-average probability by integrating over random-effect distribution. In practice, simulate random effects from estimated distribution for each covariate profile, calculate predicted probabilities under each treatment, and average over target covariates and random draws. Plugging in random effect zero systematically differs from integration because the inverse-logit is nonlinear. Include uncertainty from fixed effects and variance components, preferably using bootstrap or posterior draws.

Check residual-versus-fitted plots, Q-Q plots for conditional residuals and random effects, temporal residual autocorrelation, and influential groups. Normality violations may matter most for variance estimates and prediction at extremes; robust alternatives or bootstrap can be considered. Singularity indicates one or more random-effect variance components are near zero or correlations are at boundaries; simplify the covariance structure if unsupported and report the decision. Compare predictions under alternative plausible structures.

For binary outcomes, separation and sparse cluster-level outcomes can destabilize GLMM estimates. Bayesian priors or penalization may regularize, but prior sensitivity should be assessed. For few groups, random-effect variance is weakly identified and asymptotic Wald intervals may be unreliable. Parametric bootstrap or profile likelihood can improve inference. Random effects also do not solve informative dropout; joint longitudinal-survival models may be needed when the repeated marker and event process share latent factors and the scientific aim warrants the added assumptions.

### Random effects do not replace design

Repeated outcomes may be nested in patients, patients nested in clinics, and clinics nested in regions. A multilevel model can represent several covariance levels, for example `(1 | region/clinic/id)`, but inference still depends on sufficient independent units at each level and on the sampling/randomization design. If treatment is assigned by clinic, the effective information for treatment is driven by clinics; many patient records cannot compensate for very few randomized clinics. Cluster-robust or randomization-based sensitivity analyses may be needed.

Random-effects assumptions should be checked through distribution plots and sensitivity analyses, especially when there are few groups or strong skew. A random slope correlated with the intercept may be weakly identified; centering time and simplifying unsupported covariance can improve stability. Avoid selecting random-effects structure solely by a sequence of p-values. Fixed-effect estimates can be sensitive to omitted nonlinear time trends, while random effects capture heterogeneity, not systematic mean misspecification.

A linear mixed model for participant \(i\) at visit \(j\) can be written \(Y_{ij}=X_{ij}^T\beta+Z_{ij}^Tb_i+\epsilon_{ij}\), with random effects \(b_i\sim N(0,G)\) and residuals \(\epsilon_i\sim N(0,R_i)\). Fixed effects describe population mean associations conditional on modeled covariates; random effects represent participant-specific departures and induce within-person dependence. A random intercept captures persistent level differences. A random slope allows individual trajectories to vary. These are assumptions about a distribution, not literal claims that each patient's true effect was randomly assigned from a normal population.

In a random-intercept model, the intraclass correlation under homoscedastic residuals is \(\tau^2/(\tau^2+\sigma^2)\). If between-person SD is 8 and residual SD is 10, ICC is 64/(64+100)=0.39: observations from the same person are substantially correlated. Random slopes and serial residual correlation create richer covariance patterns. The model should reflect the visit schedule and scientific trajectory; an unnecessarily complex random-effects covariance may fail to converge, while an oversimplified structure can misstate uncertainty.

```r
library(lme4)
fit <- lmer(score ~ treatment * time + baseline_score + (1 + time | id),
            data = long_data, REML = TRUE)
summary(fit)
```

The treatment-by-time coefficient estimates difference in mean change per unit time when time is linear and the interaction is coded accordingly. Center time at a meaningful visit to interpret main effects. For treatment comparisons across follow-up, derive estimated marginal means or contrasts at prespecified times. `lmer` assumes Gaussian residual and random-effect distributions for likelihood inference; inspect residuals, fitted-versus-residual patterns, influential participants, and singular-fit warnings. A singular fit often means the data do not support the specified random-effects complexity.

## Likelihood, missing visits, and model selection

Restricted maximum likelihood (REML) estimates variance components with less small-sample bias, but likelihood comparisons of models with different fixed effects should use maximum likelihood (ML), not REML. Variance-component tests are boundary problems because a variance cannot be negative; standard chi-square likelihood-ratio approximations may fail. Information criteria and likelihood comparisons supplement, but do not replace, design-based reasoning and diagnostics. Predefine fixed effects and covariance structure whenever possible.

Likelihood-based mixed models use all available outcome measurements under a missing-at-random assumption conditional on variables in the model. MAR means missingness can depend on observed data but not on the unobserved outcome after conditioning. It is not empirically testable from observed outcomes alone. If dropout depends on unobserved deterioration, standard likelihood estimates may be biased; pattern-mixture, selection, joint models, or sensitivity analyses can assess departures. Include strong predictors of both missingness and outcome, but avoid treating this as proof of MAR.

For binary or count outcomes use generalized linear mixed models, remembering that conditional odds ratios differ from marginal population-average effects. Estimation may use Laplace approximation or adaptive quadrature; check convergence, separation, and sensitivity to integration settings. Marginal predictions can be obtained by integrating over random effects rather than setting random effects to zero, which targets a different quantity.

Report outcome scale, fixed and random effects, covariance structure, estimation method, missing-data assumption, convergence, and how contrasts were calculated. Avoid describing a random intercept as automatically correcting every dependence problem. Repeated measurements may also have serial correlation remaining after random effects; compare residual diagnostics and justified covariance alternatives. For cluster randomized data, randomization unit and analysis unit must align, and degrees-of-freedom corrections may be needed with few clusters.

- Laird NM, Ware JH. Random-effects models for longitudinal data. *Biometrics*. 1982;38:963–974. https://doi.org/10.2307/2529876
- Bates D, Mächler M, Bolker B, Walker S. Fitting linear mixed-effects models using lme4. *Journal of Statistical Software*. 2015;67:1–48. https://doi.org/10.18637/jss.v067.i01
- Fitzmaurice GM, Laird NM, Ware JH. *Applied Longitudinal Analysis*. 2nd ed. Wiley; 2011.

- Pinheiro J, Bates D. *Mixed-Effects Models in S and S-PLUS*. Springer.
- Diggle P, Heagerty P, Liang K, Zeger S. *Analysis of Longitudinal Data*.
  Oxford University Press.
- Fox J, Weisberg S. *An R Companion to Applied Regression*. Sage.

*The "Generalized estimating equations" article contrasts the population-
averaged alternative to the subject-specific perspective used here.*
