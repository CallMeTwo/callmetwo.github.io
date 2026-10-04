---
title: Missing data and imputation
summary: Diagnose why values are missing, preserve the estimand, and choose analyses such as likelihood, multiple imputation, weighting, or sensitivity models.
---

## Overview

Missing data are an information problem, not merely a software inconvenience. An analysis method is valid only relative to assumptions about why measurements are absent and how those assumptions relate to the scientific target. Replacing every missing value with a mean, deleting every incomplete record, or adding a missingness indicator can alter both the estimand and uncertainty. No method can recover information that the study never collected without relying on assumptions.

Begin by defining the target population, outcome, time point, and estimand. Then describe which variables are missing, for whom, and when. A missing primary outcome in a randomized trial is different from a missing baseline covariate; intermittent missed visits differ from dropout after worsening symptoms. Clinical reasons for missingness often help more than a single percentage.

## The mechanism is a statement about probability

Let (Y) be a value that may be missing and (R=1) indicate it is observed. Missing completely at random (MCAR) means (R) is independent of observed and unobserved data. Under MCAR, complete-case estimates are often unbiased for the full sample target, though less precise. It is a strong condition and cannot be established from observed data alone.

Missing at random (MAR) means the probability of missingness can depend on observed information but not on the missing value after conditioning on those observed data. For example, follow-up may be less complete among younger participants and those with known baseline severity, while no additional dependence on unobserved current severity remains after these predictors are included. MAR is not synonymous with “the missingness was explained”; it is an assumption about the unobserved values conditional on the analysis information.

Missing not at random (MNAR) means missingness still depends on the unseen value after conditioning on observed data. Patients with the worst unrecorded symptom burden may be more likely to skip a visit. MAR and MNAR generally cannot be distinguished using the observed data alone. Fit a model under MAR, then vary assumptions about missing values in a planned sensitivity analysis.

## Map missingness before choosing a method

Summarize missingness by variable, visit, treatment group, site, calendar time, and observed prognostic factors. Distinguish structural missingness (not applicable by design) from an unrecorded measurement that was intended to be collected. Plot follow-up patterns: monotone dropout has a different structure from intermittent missed visits followed by return. Check whether reasons for missingness were recorded and whether the data system changed.

```r
library(naniar)
vis_miss(dat)
miss_var_summary(dat)
with(dat, table(arm, is.na(outcome_6m)))
```

These summaries describe observed patterns; they do not test MAR. A regression of the missingness indicator on observed variables can reveal predictors of missingness, but a nonsignificant association does not establish MCAR. Large samples detect trivial differences, and MNAR dependence on the unobserved value remains unknowable from this check.

## Complete cases, likelihood, and weighting

Complete-case analysis is simple but changes the analyzed population to people observed on all required variables. It is unbiased under MCAR for many estimands, and under some models can remain valid under weaker conditions, but these conditions are not generic. If inclusion depends on treatment and outcome prognosis, dropping incomplete records can induce selection bias. Report how many people and events remain, and compare included and excluded participants descriptively.

Likelihood-based models can use incomplete outcome histories under MAR when the likelihood correctly represents observed data and covariates related to missingness are included. In longitudinal studies, mixed models use each observed outcome without filling in an entire missing trajectory; they still rely on a missingness assumption and model specification. Maximum likelihood is not a universal remedy when dropout depends on unobserved outcomes.

Inverse-probability weighting estimates the probability that a record remains observed from measured history, then weights observed cases by the inverse probability. For longitudinal dropout, stabilized weights can be formed from numerator and denominator probabilities. Very small probabilities create extreme weights and unstable estimates. Inspect positivity, weight distributions, and effective sample size; prespecify truncation or report sensitivity to it. Weighting only handles measured predictors of observation and does not solve MNAR dropout.

## Multiple imputation under a MAR model

Multiple imputation (MI) replaces each missing value with several plausible draws from a predictive distribution, creating (m) completed datasets. Each dataset is analyzed using the planned model; estimates are combined so within-imputation and between-imputation uncertainty both contribute. Unlike single imputation, MI does not pretend the filled values are known.

For a scalar estimate (Q_j) with variance (U_j) in imputation (j), the pooled estimate is \(\bar Q=m^{-1}\sum Q_j\). Within-imputation variance is \(\bar U=m^{-1}\sum U_j\), between-imputation variance is \(B=(m-1)^{-1}\sum(Q_j-\bar Q)^2\), and total variance is \(T=\bar U+(1+1/m)B\). The square root of (T) is the pooled standard error. If five imputations yield an average treatment effect 2.1 and total variance 0.64, the pooled SE is 0.8; an approximate 95% interval is 2.1 ± 1.96(0.8), or 0.53 to 3.67, with finite-imputation degrees of freedom used in the actual analysis.

```r
library(mice)
imp <- mice(dat, m = 40, maxit = 20, seed = 902,
            method = "pmm", printFlag = FALSE)
fits <- with(imp, lm(change_6m ~ arm + baseline + age + site))
summary(pool(fits), conf.int = TRUE)
```

Predictive mean matching is shown for illustration; the imputation model must respect variable types and distributions. Binary variables need a binary model, unordered categories a multinomial model, and ordered categories an ordinal model. Include the outcome and variables in the analysis model, as well as useful auxiliary predictors of missingness or value. Do not impute a deterministic structural missing value as though it were an unknown measurement.

The imputation model and analysis model should be congenial: the imputation procedure should preserve relationships needed for the final estimate. If the analysis includes an interaction, nonlinear term, or clustered structure, the imputation model should retain it appropriately. Passive imputation can derive a transformed term from imputed variables, while substantive-model-compatible approaches can better preserve nonlinear outcome relationships. Blindly imputing each column with a default method can attenuate associations.

## Sensitivity to departures from MAR

Because MNAR is not identified by observed data alone, use a sensitivity parameter with clinical meaning. A delta-adjustment shifts imputed outcomes for participants with missing data relative to MAR imputations. For a continuous symptom score where larger is worse, one may impute under MAR and then add 2 points to missing outcomes in the treatment arm, representing worse unobserved symptoms than predicted. Repeat over a range such as 0, 1, 2, and 3 points, and show when the treatment conclusion changes. The range should be justified with clinical knowledge, not selected to preserve significance.

For binary outcomes, pattern-mixture models may alter the odds of an event among missing participants by a prespecified factor. Selection models instead model missingness as a function of the unseen outcome. Tipping-point analyses find how extreme assumptions must be to change the decision. These analyses do not determine which MNAR scenario is true; they show robustness across plausible alternatives. Report both the MAR primary analysis and sensitivity results.

The direction and target of a delta shift should be explicit. A common choice is to shift only post-dropout outcomes while retaining observed measurements before dropout. If the outcome is a score where lower is better, a positive delta may favor the comparator or harm the intervention, depending on coding. For a binary endpoint, a log-odds shift is not the same absolute risk increase at every baseline risk. Translate model parameters into outcome-scale implications so clinicians can judge plausibility.

For monotone dropout, a pattern-mixture analysis may stratify by dropout time and vary the conditional mean among those who discontinue. A shared-parameter model can link the longitudinal outcome process to dropout through a latent random effect. These models can be useful, but their identifying assumptions are stronger and often less transparent than a delta-adjusted MI analysis. Present more than one plausible specification if conclusions depend heavily on a particular extrapolation.

## Longitudinal data: intermittent visits and dropout

Repeated outcome records create patterns that standard wide-format MI can obscure. A participant may miss one visit and return later, or may permanently discontinue follow-up. Under MAR, the distribution of future outcomes can depend on observed past outcomes, baseline severity, treatment, and auxiliary variables such as adverse events. Include enough history in the imputation model to capture that dependence. If visit schedules differ by arm, represent time correctly and avoid treating the last observed value as the endpoint.

Likelihood-based mixed models often use all observed outcome measurements and estimate mean trajectories under a MAR assumption conditional on included covariates and prior observed data. MI can support more flexible analyses, pooling, and derived estimands, but the imputation procedure must retain within-person correlation. Imputing each visit as independent will destroy trajectory structure and understate uncertainty. Joint multivariate models, multilevel chained equations, or long-format methods can represent repeated measurements; the choice should reflect the intended analysis.

When dropout occurs after treatment discontinuation, decide whether the estimand is treatment-policy (follow participants regardless of discontinuation) or hypothetical (what would happen without discontinuation). The missing data assumption depends on this choice. Collecting outcomes after discontinuation is often the most direct way to reduce missingness. If this is not possible, the primary model and sensitivity analysis should make the assumed post-discontinuation trajectory explicit.

## Special structures and variables

For clustered observations, the imputation model should preserve between- and within-cluster variation, including cluster-level covariates and random effects or fixed indicators as appropriate. Imputing at the individual level with no cluster structure can bias standard errors and estimates, especially when cluster means predict missingness. If the number of clusters is small, multilevel imputation models can be unstable; consider simpler prespecified models and sensitivity checks.

In complex surveys, missingness and sampling weights interact. Imputation models should include design variables such as strata, primary sampling unit, and weights, or otherwise account for the survey design. Standard Rubin pooling may need design-based variance estimates. Consult the survey agency's replicate-weight guidance when available; a simple MI workflow on the raw sample may not reproduce the intended population estimand.

Structural missing values need separate treatment. A pregnancy-specific measure for a nonpregnant participant is not an unknown value; imputing it invents a quantity with no defined meaning. “Not measured,” “not applicable,” and “not recorded” may need distinct codes. For prediction, a missingness pattern may itself be available at deployment, but it can reflect local workflow and fail to transport. Evaluate whether missingness indicators improve held-out prediction and whether that improvement persists across sites.

## Worked sensitivity analysis in R

The following pseudocode illustrates delta adjustment after a chained-equations imputation for a continuous outcome. In practice, apply the shift to values that were imputed because of dropout, preserve observed outcomes, refit the analysis in every imputed dataset, and pool results at each delta. The exact `mice` object structure and analysis require adaptation to the dataset.

```r
library(mice)
imp <- mice(dat, m = 50, maxit = 20, seed = 491,
            printFlag = FALSE)
deltas <- c(0, 1, 2, 3)  # higher score means worse symptoms
results <- lapply(deltas, function(delta) {
  completed <- lapply(seq_len(imp$m), function(j) {
    d <- complete(imp, j)
    miss <- is.na(dat$outcome_6m)
    d$outcome_6m[miss & dat$arm == "active"] <-
      d$outcome_6m[miss & dat$arm == "active"] + delta
    d
  })
  fits <- lapply(completed, function(d)
    lm(outcome_6m ~ arm + baseline + age, data = d))
  pool(as.mira(fits))
})
```

This demonstration omits implementation details for retaining imputation metadata and Rubin degrees of freedom; use a validated MI workflow or a package designed for sensitivity analysis. The substantive calculation is the shift among missing active-arm outcomes, not a post hoc change to observed values. If the missingness fraction is 20%, a two-point delta shifts the overall active-arm mean by roughly 0.4 points before covariate adjustment, illustrating how a seemingly modest assumption can matter.

Plot the pooled treatment estimate and interval across delta values. A tipping point occurs where the estimate crosses a prespecified decision boundary, which could be zero, a clinically important difference, or a noninferiority margin. State the boundary before analysis. A p-value crossing 0.05 is not itself a scientifically meaningful tipping point if the effect magnitude remains clinically similar.

## What diagnostics can and cannot tell you

Convergence checks assess whether the imputation algorithm has stabilized; trace plots of means and standard deviations should fluctuate without persistent drift. Compare observed and imputed distributions by group and across conditional predictor strata. Inspect impossible values and logical constraints. For predictive mean matching, look for donor scarcity and repeated donor values; for logistic imputation, check separation and extreme probabilities.

Good diagnostics do not verify MAR. Imputed values are generated under the fitted assumptions, so agreement between observed and imputed distributions may be expected even when the missing values in reality differ. Sensitivity analyses address this untestable part. Conversely, implausible imputations can reveal a poorly specified model even if the missingness assumption were valid.

For a primary analysis, document the missingness estimand, mechanism assumption, imputation or likelihood model, variables and interactions included, number of imputations, software version, convergence diagnostics, pooling method, and sensitivity scenarios. Provide denominators by visit and treatment group. The statistical analysis plan should state how missing outcomes, intercurrent events, and protocol deviations relate to the estimand before unblinded results are examined.

A transparent results table can show the primary complete-case or likelihood estimate only when it is prespecified, the primary MI estimate under MAR, and selected MNAR sensitivity estimates with confidence intervals. Include the proportion missing at each visit and the number contributing observed outcome data. Explain whether sensitivity scenarios changed the direction, magnitude, or clinical conclusion. Readers should be able to distinguish uncertainty due to sampling from uncertainty about the missingness mechanism.

Suppose 15% of the intervention group and 8% of control participants lack a 6-month outcome, and observed participants improve by 5 and 4 points, respectively. The observed-case contrast is −1 point if lower scores indicate greater improvement, but that contrast compares selected subsets. If missing intervention participants were more symptomatic, a MAR model using baseline severity and early response may predict poorer outcomes than a complete-case analysis. The delta analysis then asks how much worse they might plausibly be than those predictions. This illustrates why reporting only the missingness percentage or an MCAR test does not settle the bias question.

When missingness is minimal, simple and complex approaches may yield similar estimates, but “less than 5%” is not a universal safety threshold. A small amount of missingness concentrated among the sickest participants can matter more than a larger amount scattered randomly. Conversely, extensive missingness does not automatically invalidate an analysis if the observed history is rich and assumptions are plausible, though precision and sensitivity to unverifiable assumptions become increasingly important.

Prioritize preventing missingness in primary outcomes; statistical adjustment cannot fully replace careful follow-up and reason capture.

If more than one plausible mechanism is credible, compare more than one sensitivity model rather than presenting a single delta as definitive.

Interpret imputed values as draws from a specified predictive distribution, not recovered facts.

Report uncertainty from imputation along with sampling uncertainty.

## Pitfalls in implementation and interpretation

Do not use last observation carried forward as if it were a neutral fill. It assumes the outcome remains fixed after the last visit and often understates uncertainty. Mean imputation reduces variance and distorts correlations. Missing indicators do not generally remove bias in regression, although they can be useful operationally in prediction systems when the act of measurement carries information and validation supports the approach.

The number of imputations should be large enough that Monte Carlo error is negligible for the estimand; 5 imputations is often too few when missing information is substantial. Inspect trace plots and convergence, distributions of observed and imputed values, and relationships among variables. Compare imputed and observed distributions conditionally, not only marginally. Report software, variables in the imputation model, methods by variable, iterations, number of datasets, pooling rule, and sensitivity assumptions.

Imputation does not repair outcome mismeasurement, selection into the study, or confounding. If a covariate is absent for an entire site, there may be no information to impute a site-specific relationship. If dropout is related to unrecorded deterioration, MAR may be implausible. Improve data collection where possible: record reasons for missingness, maintain outcome follow-up after treatment discontinuation, and prioritize primary endpoint ascertainment.

## References and further reading

- Little RJA, Rubin DB. *Statistical Analysis with Missing Data*. 3rd ed. Wiley; 2019.
- White IR, Royston P, Wood AM. Multiple imputation using chained equations: issues and guidance for practice. *Stat Med*. 2011;30:377–399. [doi:10.1002/sim.4067](https://doi.org/10.1002/sim.4067)
- Sterne JAC, White IR, Carlin JB, et al. Multiple imputation for missing data in epidemiological and clinical research. *BMJ*. 2009;338:b2393. [doi:10.1136/bmj.b2393](https://doi.org/10.1136/bmj.b2393)
- Carpenter JR, Kenward MG. *Multiple Imputation and Its Application*. Wiley; 2013.
