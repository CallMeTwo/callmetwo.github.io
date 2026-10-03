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

## References and further reading

- van Buuren S. *Flexible Imputation of Missing Data*. CRC Press.
- Rubin DB. *Multiple Imputation for Nonresponse in Surveys*. Wiley.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.

*The topic map's "Sample size and study design" section covers planning for expected missingness upfront (article planned).*
