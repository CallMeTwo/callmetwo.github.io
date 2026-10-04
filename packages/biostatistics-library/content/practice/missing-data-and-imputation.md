---
title: Missing data and imputation
summary: How incomplete data bias results, the MCAR/MAR/MNAR taxonomy, and how multiple imputation recovers unbiased estimates with honest uncertainty.
---

## Overview and key ideas

Every analysis that silently drops incomplete records is, strictly speaking, an analysis of the subpopulation that has complete records. If the missing values are unrelated to anything, that is usually harmless; but in clinical research the missingness is often informative. Sicker patients drop out of follow-up, patients doing poorly stop reporting their pain scores, and the people who skip the 12-month visit are precisely the ones whose outcomes you most want to know.

Missing data are conventionally classified by mechanism:

- **MCAR (missing completely at random)** — the missingness depends on nothing (a blood tube spilled). Complete-case analysis is unbiased but loses power.
- **MAR (missing at random)** — the missingness depends on observed data (older patients miss follow-up more often) but not on the unobserved value itself. Multiple imputation can remove the bias.
- **MNAR (missing not at random)** — the missingness depends on the unobserved value (the worst outcomes never return for testing). No standard method is unbiased; sensitivity analysis is required.

The standard remedy for MAR data is **multiple imputation**. The recipe: (1) fit an imputation model using all observed variables, including those related to the missingness; (2) draw m (typically 20–50) completed datasets, each with the missing values replaced by plausible draws from their predictive distributions; (3) run the analysis of interest separately in each imputed dataset; (4) pool the m estimates and variances with Rubin's rules, which adds a between-imputation variance term so that the final confidence interval reflects uncertainty from the imputation itself.

Why "multiple" instead of a single imputed dataset? A single imputed value replaces each missing number with one plausible guess, so the analysis behaves as if those values were measured — the resulting standard errors are too small. Drawing many plausible values, one per dataset, makes the variability *across* the datasets a genuine part of the uncertainty: the pooled interval is wider and honest about what the missingness cost us.

## When to use it

| Setting | Example question |
| --- | --- |
| Randomized trial | 15% of patients are missing the 12-month systolic BP — how do we estimate the treatment effect without bias? |
| Longitudinal cohort | HbA1c is missing at 12 and 24 months for some patients — can we model the trajectory without dropping whole patients? |
| Observational registry | 30% of records lack eGFR because sites collected it differently — is the association with mortality still estimable? |
| Questionnaire study | 6-minute walk distance was not recorded for 40 patients — which patients, and why? |

The decision sequence is short: quantify how much is missing per variable, check whether the missingness correlates with observed variables (which distinguishes MCAR from MAR), choose the method, and pre-specify all of this in the analysis plan before looking at the main results.

## Assumptions and limitations

- **MAR is the key assumption** — if the mechanism is actually MNAR, multiple imputation will be systematically biased in a direction you cannot see. Use sensitivity analyses such as tipping-point or pattern-mixture approaches to bound the damage.
- **The imputation model must be adequate** — it should include the outcome, the treatment or predictor of interest, and strong predictors of both. Imputing a variable from too few predictors gives weak, implausible values, and linearly imputing a binary outcome is a common subtle error.
- **Heavy missingness degrades precision** — with more than about half of a key variable missing, even a correct MAR method yields wide, fragile intervals.
- **Single imputation is not a fix** — mean or regression imputation fills values but understates variance, producing confidence intervals that are too narrow.

## Worked example

A randomized trial of an antihypertensive drug follows 400 patients for 12 months. The 12-month systolic BP is missing for 60 patients (15%), and the missingness is associated with baseline BP and treatment allocation — consistent with MAR. A complete-case analysis of the remaining 340 patients gives a treatment–control difference of −4.2 mmHg.

Run multiple imputation (m = 25, imputing from baseline BP, age, sex, treatment, and missingness indicators), analyse each dataset, and pool with Rubin's rules: the difference is **−6.1 mmHg (95% CI −8.3 to −3.9)**, with a visible contribution from the between-imputation variance. The complete-case estimate was biased toward the null because the missing patients in the control arm tended to have higher baseline BPs. The pooled interval — not the one from the 340 complete patients — is what you report, alongside a description of how much was missing and why.

A sensitivity analysis should accompany this: for instance, a tipping-point analysis asking how strongly the missing 12-month values would have to differ from the observed ones (conditional on the same covariates) to move the pooled estimate back across zero. If that threshold is large, the MAR conclusion is robust; if it is small, the trial's conclusion is fragile to the missingness and the report must say so.

## Interpretation and common pitfalls

- **Complete-case analysis is not "conservative"** — it is usually biased, and its standard errors are wrong, sometimes in both directions.
- **Exclude the outcome from the imputation model and you bias the effect** — the imputation model must include the outcome and the treatment, plus strong predictors of both; omitting the outcome typically attenuates the estimated treatment effect toward the null.
- **Report the missingness pattern, not just the fraction** — "15% missing" tells a reader nothing; describe which variables, in which strata, and the evidence for the mechanism.
- **Do not treat imputed values as real measurements** — derived quantities (ratios, composites) must be computed within each imputed dataset, not after pooling.

Multiple imputation is valid under a correctly specified imputation model and a missing-at-random assumption conditional on included observed data; MAR cannot be verified from observed data alone. Include analysis variables, outcome, auxiliary predictors of missingness, and design features in imputation, and make the imputation model congenial to the analysis (including interactions or nonlinearities when needed). Pool estimates and within/between-imputation variance with Rubin's rules; do not average p-values. Complete-case analysis can be unbiased in special cases but often loses precision and may select a different population. Add a sensitivity analysis for plausible missing-not-at-random departures, such as delta-adjusted imputation.

## References and further reading

## Missingness mechanisms and identification

## Missing covariates versus missing outcomes

## Worked delta-adjustment sensitivity

Suppose MAR multiple imputation estimates a treatment RD of −3 percentage points. For participants missing outcomes in the intervention arm, assume event odds are multiplied by δ relative to MAR predictions; vary δ from 1 (MAR) to 2, 3, and 5 while also varying control-arm assumptions. Recalculate RD and interval at each scenario. If conclusions change only under very large plausible worsening, the result may be reasonably robust; if a small shift crosses a decision threshold, uncertainty from missingness is consequential. The exact delta scale (risk, odds, mean units) must be stated.

Pattern-mixture sensitivity is often easier to explain clinically than selection-model parameters. However, delta is unobserved and cannot be estimated from data; elicit plausible values from clinical context and show a range. Avoid selecting the most favorable scenario.

## Inverse-probability weighting

## Worked multiple-imputation reporting example

Suppose 12% of week-12 outcomes are missing, more often among participants with high baseline severity and prior worsening. The analysis may use multiple imputation under MAR including treatment, baseline severity, earlier outcomes, site, and predictors of dropout. Report that assumption, number of imputations, method for continuous/binary variables, pooling rule, and sensitivity analyses. Show missingness by arm and reason. If delta-adjusted imputation shifts missing treatment outcomes toward worse scores and the treatment conclusion changes at a small shift, conclude evidence is sensitive to plausible MNAR departures.

Do not report only “multiple imputation was performed.” Describe model compatibility with primary analysis and diagnostics. For interactions and nonlinear terms, use passive derivation or methods that preserve relationships. If imputed values fall outside scale bounds, revise model rather than truncate post hoc without justification.

## Missingness in prediction and diagnostics

An auditable missing-data workflow should connect the assumptions, diagnostics, primary estimator, and sensitivity conclusions in one place.

## MI pooling and uncertainty

For each of (m) imputations, estimate (Q_j) and within-imputation variance (U_j). Rubin's pooled estimate is ̅Q; total variance is ̅U+(1+1/m)B, where B is between-imputation variance. The extra term reflects uncertainty about missing values. With few imputations, degrees of freedom are reduced and Monte Carlo error can be substantial. Increase m when missing information is high and report number of imputations, pooling method, and fraction of missing information.

For nonlinear derived quantities, compute the quantity within each imputation and pool estimates/variance appropriately, rather than impute components and calculate one result from pooled means. For standardized risks, bootstrap within each imputation or use nested methods to combine imputation and sampling uncertainty. Software defaults may not support complex survey design correctly; document method.

## Data collection remains the strongest intervention

## Analysis plan for missingness

The report should distinguish records excluded because of ineligibility from missing values among eligible participants. Provide missingness by variable, group, and visit, reasons where known, and participant flow. Make clear whether the estimand includes outcomes after discontinuation or switches.

## Interpretation of robustness

Document software versions, random seeds, imputation methods by variable type, and the final pooled estimates. Archive imputation diagnostics with the analysis record.

Include a flow diagram or table that tracks participants with observed, intermittent-missing, and monotone-dropout outcomes by arm. This clarifies which records inform each estimand and whether follow-up continued after treatment discontinuation.

Report imputation and weighting models, variables included, software, convergence, number of imputations, pooling, and sensitivity ranges. Explain which assumptions are testable and which require judgment; do not imply that missing-at-random was empirically confirmed.

Robustness across MAR and plausible MNAR scenarios increases confidence but cannot prove the missingness mechanism. If conclusions change under modest delta shifts, frame the result as uncertain and prioritize data collection or follow-up. The proportion missing alone does not determine bias; even small missingness can matter if strongly outcome-related, while larger missingness can be manageable under valid assumptions.

Before analysis, define missingness by variable and visit, structural versus accidental absence, primary assumption, auxiliary variables, and sensitivity approach. Draw a missingness pattern table and compare patterns across treatment/site. Document software and imputation settings, number of imputations, iterations, convergence checks, and pooling. Provide a table of complete-case and primary imputed estimates as context, but do not select between them by which is significant.

Sensitivity results should be framed around plausible departures: how much worse would missing outcomes need to be to change a clinical conclusion? If a conclusion is robust only under MAR, state that limitation clearly. Missing data treatment is part of the estimand and evidence interpretation, not a post hoc technical appendix.

Prevention is better than modeling: simplify forms, validate ranges at entry, train staff, monitor missingness by site and arm, and follow participants after treatment discontinuation when possible. Record reasons and timing. Missingness patterns can reveal workflow or safety problems. Statistical adjustment cannot recover information when outcomes are almost never observed in a subgroup or when missingness depends strongly on unobserved values.

In prediction-model development, imputation must occur inside each resampling fold to avoid leakage; validation data should use an imputation approach available at deployment. Complete-case validation can bias performance if missing predictors are common. Compare imputation and missingness indicators carefully; a missingness indicator can encode workflow patterns that fail to transport. Report proportion missing per predictor, imputation method, and how missing data are handled for new patients.

For observation indicator (R_t), stabilized weights multiply inverse conditional probabilities of being observed at each visit given prior observed history. Fit response models using predictors measured before each missingness decision; calculate weight distributions and effective sample size. Extreme weights indicate positivity issues; truncation can reduce variance but changes bias. Use robust SE accounting for repeated observations and estimated weights. Weighting estimates can be compared with MI/likelihood results as sensitivity, not as proof one method is correct.

Missing covariates and outcomes affect analyses differently. Missing covariates can reduce adjustment and induce confounding if complete cases are selected; multiple imputation may recover information under MAR. Missing outcomes in randomized trials compromise precision and potentially treatment comparison; likelihood, MI, or weighting each encode assumptions. Structural missingness (not collected by design) should not be conflated with values omitted by chance. For example, a pregnancy-only measure is structurally missing for others, not a MAR variable to impute.

Auxiliary variables improve imputation when they predict missingness or the missing value, even if not in the final model, but avoid including colliders or variables unavailable at intended prediction time without rationale. For longitudinal studies, include treatment, visit, prior/future outcomes, baseline predictors, and dropout predictors. For cluster studies, include cluster-level predictors and preserve intracluster correlation.

## Diagnostics and number of imputations

Compare observed and imputed distributions by variable and missingness pattern. Check impossible values, marginal tails, conditional associations, and convergence across chained-equation iterations. Passive imputation can maintain deterministic relationships (e.g. BMI derived from height and weight), but transformations need consistent handling. The fraction of missing information and Monte Carlo error guide number of imputations; high missingness or complex models may need dozens to hundreds. Stable pooled estimates across seeds provide a useful computational check, not proof the imputation model is correct.

Let (R=1) indicate an observed outcome. MCAR means (R) is independent of observed and unobserved data; MAR means missingness depends only on observed data conditional on variables in the model; MNAR allows dependence on the unobserved value after conditioning. MCAR is rarely plausible in clinical data. MAR is an assumption that cannot be verified from observed data alone; include variables predictive of missingness and outcome, and use design knowledge to support it. MNAR requires sensitivity parameters or joint models because observed records do not identify the missing distribution.

Complete-case analysis can be unbiased under restrictive conditions, such as missingness independent of outcome conditional on modeled covariates, but often loses precision and can induce selection bias. Missing-indicator methods for covariates do not generally remove bias. For outcome missingness, likelihood-based models and multiple imputation are valid under MAR with correct specification. Inverse-probability-of-observation weighting requires correct response probabilities and positivity; extreme weights cause instability.

## Multiple imputation workflow

Impute missing values multiple times from predictive distributions that preserve uncertainty, analyze each completed dataset, and pool estimates using Rubin's rules. Include outcome, exposure, auxiliary predictors of missingness, nonlinear terms, interactions, and design structure. Imputation should respect data types and bounds: logistic or multinomial models for categorical variables, predictive mean matching for skewed continuous values, and appropriate longitudinal/multilevel models for repeated or clustered records. Avoid imputing structural missingness as though it were accidental.

```r
library(mice)
imp <- mice(dat, m = 40, maxit = 20, seed = 2026,
            printFlag = FALSE)
fits <- with(imp, glm(outcome ~ exposure + age + sex, family = binomial()))
summary(pool(fits), conf.int = TRUE)
```

Check chain trace/convergence, observed and imputed distributions, and whether imputed values are plausible. More imputations reduce Monte Carlo error; 40 is an example, not a universal standard. The imputation and analysis models should be congenial; if the analysis includes interactions or nonlinearities, incorporate them in imputation. Standard `mice` defaults may not respect survey or multilevel structure without method selection.

## MNAR sensitivity analysis

Delta adjustment shifts imputed outcomes for missing participants by a clinically interpretable amount relative to MAR predictions. Vary delta across plausible deterioration/improvement and identify where conclusions change. Pattern-mixture models stratify by missingness pattern; selection models specify response probability conditional on unobserved outcome. Neither is identified without restrictions, so report assumptions and a range rather than a single MNAR estimate. Tipping-point plots communicate robustness more usefully than asserting missingness was “handled” by imputation.

For dropout in longitudinal trials, distinguish intermittent missing visits from monotone dropout and treatment discontinuation. Include prior outcomes and reasons for dropout. Do not use last observation carried forward as a default: it assumes outcome remains fixed and understates uncertainty. Report amount, pattern, and reason for missingness by randomized group and planned sensitivity analyses.

- Little RJA, Rubin DB. *Statistical Analysis with Missing Data*. 3rd ed. Wiley; 2019.
- White IR, Royston P, Wood AM. Multiple imputation using chained equations. *Statistics in Medicine*. 2011;30:377–399. https://doi.org/10.1002/sim.4067
- Sterne JAC, White IR, Carlin JB, et al. Multiple imputation for missing data in epidemiological and clinical research. *BMJ*. 2009;338:b2393. https://doi.org/10.1136/bmj.b2393

- Sterne JAC, White IR, Carlin JB, et al. Multiple imputation for missing data in epidemiological and clinical research: potential and pitfalls. *BMJ*. 2009;338:b2393. [doi:10.1136/bmj.b2393](https://doi.org/10.1136/bmj.b2393)

- van Buuren S. *Flexible Imputation of Missing Data*. CRC Press.
- Rubin DB. *Multiple Imputation for Nonresponse in Surveys*. Wiley.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.

The [sample size and statistical power article](../study-design/sample-size-and-statistical-power.html) discusses planning for expected missingness and its effect on precision.
