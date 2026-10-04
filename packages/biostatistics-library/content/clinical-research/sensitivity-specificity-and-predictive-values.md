---
title: Sensitivity, specificity and predictive values
summary: How well a test detects and excludes disease — and why a positive result's meaning depends on how common the disease is.
---

## Overview

Sensitivity and specificity describe test accuracy conditional on the true disease state, defined by a reference standard. Sensitivity is the proportion of diseased people testing positive; specificity is the proportion of non-diseased people testing negative. Positive and negative predictive values instead condition on the test result and depend on disease prevalence in the tested population.

These measures do not by themselves establish that testing improves health. Their values depend on threshold, disease spectrum, reference standard, and study design. Define the target condition and clinical role—screening, diagnosis, triage, or rule-out—before choosing a test threshold.

## The 2×2 table and threshold-specific estimates

For a binary test and reference standard, true positives (TP) and false negatives (FN) occur among people with disease; true negatives (TN) and false positives (FP) among those without. Sensitivity=TP/(TP+FN), specificity=TN/(TN+FP), PPV=TP/(TP+FP), and NPV=TN/(TN+FN). Always show counts and denominators alongside percentages.

Suppose 100 people have disease and 900 do not. A test yields TP=80, FN=20, TN=810, FP=90. Sensitivity=.80, specificity=.90, PPV=80/170=47.1%, and NPV=810/830=97.6%. Despite 90% specificity and 80% sensitivity, fewer than half of positive results represent disease because prevalence is 10%.

~~~r
tab <- matrix(c(80, 20, 90, 810), nrow = 2, byrow = TRUE,
              dimnames = list(reference = c("disease", "no_disease"),
                              test = c("positive", "negative")))
se <- tab["disease", "positive"] / sum(tab["disease", ])
sp <- tab["no_disease", "negative"] / sum(tab["no_disease", ])
ppv <- tab["disease", "positive"] / sum(tab[, "positive"])
npv <- tab["no_disease", "negative"] / sum(tab[, "negative"])
c(sensitivity = se, specificity = sp, PPV = ppv, NPV = npv)
~~~

Check row and column ordering; silently reversing the table reverses the interpretation. The calculation assumes one independent test per person and a valid reference status for everyone.

## Thresholds create trade-offs

For continuous test scores, lowering the positive threshold generally increases sensitivity and decreases specificity; raising it generally does the reverse. Screening often favors sensitivity when missed disease is costly and confirmatory testing is available. A high-risk intervention may require specificity to reduce unnecessary harm. No threshold is optimal without a decision context.

Youden’s J (sensitivity+specificity−1) chooses a threshold maximizing a balanced accuracy criterion. It weights sensitivity and specificity symmetrically and does not include prevalence, follow-up burden, treatment effects, or patient preferences. Use it as a descriptive summary, not a universal clinical cutoff. Prefer prespecified thresholds from guidelines or decision analysis and validate them independently.

Indeterminate results need their own rule. Excluding them can make accuracy look better; classifying them positive or negative changes sensitivity and specificity. Report the proportion indeterminate and how those patients are managed. Repeat testing also changes performance and should be evaluated as a testing strategy, not as isolated accuracy.

## Likelihood ratios and sequential updating

Positive likelihood ratio LR+=sensitivity/(1−specificity); negative likelihood ratio LR−=(1−sensitivity)/specificity. Likelihood ratios express how much a test result shifts odds. Pretest odds are p/(1−p); post-test odds=pretest odds×LR. Convert back to probability as odds/(1+odds).

In the example, LR+=.80/.10=8 and LR−=.20/.90=.222. With pretest probability .10, pretest odds=.10/.90=.111. A positive result gives post-test odds .888 and probability .888/1.888=47.0%, matching PPV. A negative result gives odds .0247 and probability about 2.4%. Thus the same test result has different post-test meaning at a different pretest probability.

Sequential test updating assumes appropriate conditional independence or a joint model. Two tests based on the same biological signal may have correlated errors; multiplying their likelihood ratios as if independent overstates evidence. Specify test sequence and dependence. Likelihood ratios also vary with disease severity and threshold, so a single value may not apply across the spectrum.

## Precision and confidence intervals

Sensitivity and specificity are binomial proportions with denominators TP+FN and TN+FP. Their uncertainty depends on numbers with and without disease, not simply total sample size. Wilson or exact intervals are preferable to a simple Wald interval, especially when estimates approach 0 or 1. PPV and NPV need intervals too and should reflect target prevalence uncertainty if prevalence is estimated.

If sensitivity is 80/100=.80, a rough standard error is sqrt(.8*.2/100)=.04; a normal interval is approximately .72 to .88. For small denominators, exact or score intervals can differ substantially. Report numerator and denominator and interval method. Avoid excessive decimal precision.

~~~r
binom.test(80, 100)$conf.int
binom.test(810, 900)$conf.int
~~~

These exact binomial intervals assume independent observations and fixed reference groups. If participants are clustered, use cluster-aware methods. If the threshold was selected on the same data, these intervals do not account for cutpoint selection and are optimistic for future performance.

## Study design and sources of bias

A diagnostic accuracy study should recruit participants who resemble the intended clinical population, preferably consecutive or randomly sampled patients. A two-gate design comparing known advanced cases with healthy controls can exaggerate accuracy due to spectrum differences. Report setting, recruitment, disease severity, comorbidities, and prior testing.

Verification bias occurs when only some participants receive the reference standard, often based on index-test result. Missing reference status can bias sensitivity and specificity. Apply the reference standard to all participants when feasible; otherwise use valid correction methods and sensitivity analyses. Differential verification uses different reference standards and can also distort estimates.

Incorporation bias occurs when the index test contributes to the reference diagnosis. Reviewers should be blinded to index results where possible. Reference standards may be imperfect; describe adjudication, inter-rater agreement, and uncertainty. A “gold standard” is not infallible.

Timing matters. If disease status changes between index and reference tests, discordance may reflect progression rather than test error. State the interval and whether treatment occurred between tests. In screening, follow-up may be needed to identify initially missed disease; incomplete follow-up can misclassify false negatives.

## Study size and precision planning

Plan separate sample sizes for diseased and non-diseased participants because sensitivity and specificity have different denominators. To estimate sensitivity near .80 with a 95% margin of error of .05 under a simple normal approximation requires about 1.96²(.8)(.2)/.05²≈246 diseased participants. At 10% prevalence, obtaining that many cases may require enrolling roughly 2,460 people, before loss or design effects.

If the study uses case-control sampling to obtain sufficient cases, sensitivity and specificity may be estimable under suitable spectrum and verification, but PPV/NPV and calibration do not directly represent the target population. For clustered recruitment, inflate sample size and account for intraclass correlation. Precision planning should reflect clinically important lower bounds, not only expected point estimates.

## Predictive values and prevalence transport

PPV and NPV change with prevalence. With Se=.80 and Sp=.90 at prevalence .01, PPV=.008/(.008+.099)=7.5%. At prevalence .30, PPV=.24/(.24+.07)=77.4%. A screening test can therefore generate many false positives in a low-prevalence population even if sensitivity and specificity appear stable.

Transporting sensitivity and specificity also requires caution because case severity and non-disease comorbidities affect score distributions. A test validated in specialty care may not perform similarly in primary care. Validate in the intended setting and report prevalence, spectrum, and predictive values there. Recalculation using a new prevalence alone cannot correct changed sensitivity or specificity.

### Indeterminate and repeated results

Tests may yield borderline, uninterpretable, or technically failed results. Report these separately and describe repeat or confirmatory pathways. A complete-case analysis that drops failures can overstate accuracy if failures are more common among sick or difficult-to-test patients. For an intention-to-diagnose assessment, retain all attempted tests and count the pathway outcome.

Repeated testing can improve sensitivity or specificity depending on whether results are combined with an OR rule, AND rule, or sequential strategy. Errors across repeats may be correlated. Estimate performance of the full algorithm, including retesting intervals and missing follow-up. Do not multiply single-test likelihood ratios unless dependence assumptions are credible.

## Clinical consequences and decision utility

False negatives may delay treatment; false positives can cause anxiety, invasive follow-up, and cost. Sensitivity and specificity do not assign these consequences. Decision-curve analysis, cost-effectiveness analysis, or explicit utility models can compare thresholds and testing strategies. Include harms and downstream pathways, not just test classification.

A high-sensitivity test may be useful as a first-stage screen if confirmatory testing is safe and accessible. If follow-up is unavailable, false positives can cause lasting harm. A rule-out claim should consider pretest probability and the negative likelihood ratio. A negative result does not reduce risk to zero.

### Reporting accuracy for clinical readers

Describe target condition, intended role, participant selection, index test procedure, reference standard, blinding, threshold, timing, missing and indeterminate results, and sample size. Provide the complete 2×2 table and estimates with confidence intervals. State prevalence and predictive values for the intended setting. Report subgroup and external validation where supported.

Follow STARD reporting guidance for diagnostic accuracy studies. Distinguish accuracy from clinical utility and impact. Explain how false positives and false negatives affect the care pathway. Report protocol deviations and all thresholds examined to reduce selective reporting.

### Verification bias and correction

Partial verification occurs when reference testing depends on the index result. Suppose all positive screens receive biopsy but only a small random subset of negatives do. If unverified negatives are treated as disease-free, false negatives are missed and sensitivity is biased upward. Specificity may also be distorted. Record who receives verification and why, then use complete verification or validated statistical correction.

Inverse-probability weighting can adjust for verification under a model for the probability of receiving the reference standard conditional on observed variables. Multiple imputation of missing reference status is another option under assumptions. Both require measured predictors of verification and correct models; neither rescues verification that depends on unobserved disease after conditioning. Conduct sensitivity analyses and report the assumptions.

Differential verification uses different reference tests based on the index result or clinical features. If one reference is less sensitive, apparent index-test accuracy can be biased. Use a uniform reference when ethical and feasible, or a composite adjudication with blinded reviewers. If the reference is imperfect, consider latent-class approaches only when multiple tests and assumptions provide identification; do not label the result as gold-standard accuracy.

### A fuller Bayesian updating example

For prevalence .10, pretest odds are .10/.90=.111. If LR+=8, post-test odds=.888 and probability=.888/(1+.888)=.47. With prevalence .01, pretest odds=.0101; the same LR+ gives odds=.0808 and probability .0748. Thus a positive result yields about 7.5% post-test probability in a low-prevalence setting versus 47% in the higher-prevalence setting. The test evidence is similar, but the starting risk differs.

For a negative result and LR−=.222, prevalence .30 gives pretest odds=.30/.70=.429. Post-test odds=.095 and probability=.087. The negative test reduces risk substantially but leaves nearly 9% probability, which may be too high to rule out disease when the clinical stakes are serious. A decision depends on threshold for further evaluation.

Likelihood ratios can be more portable than predictive values, but only if sensitivity and specificity remain similar across spectrum, threshold, and setting. Disease severity and competing conditions can change them. Validate LRs in the target spectrum and provide uncertainty. A likelihood ratio is a summary, not a guarantee that every patient’s odds update identically.

### Confidence intervals and clustered samples

For sensitivity, a Wilson interval can be calculated from TP successes among diseased participants; specificity is TN among non-diseased. Exact binomial intervals are conservative but useful with small counts. For a paired design in which each participant receives two tests, comparing sensitivities requires the discordant case results, not independent-proportion formulas. McNemar-type methods or paired bootstrap can be used.

If participants are clustered within clinics, disease status and test results may correlate. Standard binomial intervals are too narrow. Use a cluster bootstrap or appropriate hierarchical model, and report the number of independent sites. For repeated tests on one patient, define whether accuracy is per test, episode, or person. An episode-level OR rule cannot be evaluated as independent repeated rows.

Precision should be reported for all key metrics. PPV may be based on few positive tests even in a large cohort, and sensitivity may be imprecise when there are few diseased participants. A confidence interval crossing a clinically important threshold signals uncertainty that should affect the clinical claim.

## Threshold selection and optimism

A threshold selected to maximize sensitivity, specificity, Youden’s J, or another metric on a development sample will look better there than in new patients. Either prespecify a threshold from clinical guidance or choose it in a development set and validate independently. If sample size is limited, use nested cross-validation or bootstrap the threshold-selection procedure, while recognizing that internal validation is not external evidence.

Report all thresholds examined and the rationale for the chosen operating point. A data-driven cutoff can be unstable: small changes in sample composition may change the optimal value. Give a threshold confidence interval or sensitivity analysis where possible. Prefer rounded, clinically implementable values and validate after rounding.

If the test result is continuous, a single cutoff may discard useful information. A multilevel pathway can use low, intermediate, and high zones with different actions. Evaluate the full pathway’s sensitivity, specificity, referrals, and outcomes, including how indeterminate zones are handled. Decision curves can assess risk-threshold utility when the output is a calibrated risk.

## Study design and intended spectrum

Consecutive enrollment reduces selection of unusually clear cases and healthy controls. Case-control designs can be efficient for early test development but may exaggerate accuracy because cases and controls are sampled from different clinical pathways. Report recruitment source, disease severity, comorbidities, prior treatment, and exclusions.

In a screening program, people without disease may include benign conditions that mimic symptoms. In a specialty clinic, disease prevalence and severity are higher. Sensitivity and specificity can change across these spectra. External validation should reflect the actual point of care and operator, not only another dataset from the same highly selected source.

The reference standard should be applied within a reasonable time of the index test and before treatment changes disease status. If the standard is invasive, ethical constraints may limit universal verification; describe the trade-off and methods. Blinding prevents knowledge of index results from influencing reference classification.

### Interpreting predictive values in service planning

A screening test with sensitivity .90 and specificity .95 in a population of 10,000 with prevalence 1% would yield about 90 true positives, 495 false positives, 10 false negatives, and 9,405 true negatives. PPV is 90/(90+495)=15.4%; roughly five and a half positive screens occur per true case. The confirmatory pathway must accommodate this volume and its harms.

At prevalence 10%, with the same conditional accuracy, expected TP=900, FP=450, FN=100, TN=8,550, and PPV=66.7%. A test service cannot use PPV from a high-prevalence clinic to communicate screening performance in the general population. Estimate prevalence in the intended setting or report a range.

NPV can be high in low-prevalence populations even for weak tests, so a high NPV alone is not proof of strong rule-out performance. Report LR−, pretest risk, post-test risk, and relevant clinical threshold. Similarly, high PPV in a specialty clinic may mostly reflect high pretest probability.

## Imperfect tests and latent condition

Some conditions lack a definitive reference standard. Expert panels may combine imaging, symptoms, and follow-up; such adjudication can be subjective and may incorporate the index test. State criteria and blinding. Multiple imperfect tests can support latent-class models, but identification requires assumptions such as conditional independence or restrictions on sensitivity and specificity. These assumptions can be implausible when tests share biological mechanisms.

When no gold standard exists, accuracy estimates are conditional on the chosen reference definition. Sensitivity and specificity against an imperfect standard may understate or overstate true disease accuracy. Describe this limitation and avoid calling the reference “truth” without qualification. Clinical outcomes and utility may be more relevant than agreement with a flawed surrogate.

## Reporting the testing pathway

Report the test sequence: who is tested, threshold, confirmatory test, repeat interval, and treatment action. Give accuracy at each stage and for the combined strategy. Include failed tests, nonattendance, and indeterminate results. A test can have excellent accuracy but low program sensitivity if many eligible people never complete testing.

Measure downstream consequences such as time to diagnosis, unnecessary procedures, anxiety, and access to treatment. If a negative result reassures clinicians, assess delayed diagnoses. If a positive result triggers limited specialist referrals, evaluate who receives them. Accuracy is a property of test against reference in a sample; impact is a property of the whole care pathway.

For each cutpoint, preserve units and assay version. A numerical threshold without measurement precision or specimen context may not transfer between instruments or laboratories.

## References and further reading

- Whiting PF, Rutjes AWS, Westwood ME, et al. QUADAS-2: a revised tool for the quality assessment of diagnostic accuracy studies. *Ann Intern Med*. 2011;155:529–536. [doi:10.7326/0003-4819-155-8-201110180-00009](https://doi.org/10.7326/0003-4819-155-8-201110180-00009).
- Bossuyt PM, Reitsma JB, Bruns DE, et al. STARD 2015. *BMJ*. 2015;351:h5527. [doi:10.1136/bmj.h5527](https://doi.org/10.1136/bmj.h5527).
- See [ROC curves and AUC](roc-curves-and-auc.html) for full threshold curves.
- Bossuyt PM, Reitsma JB, Bruns DE, et al. STARD 2015: an updated list of essential items for reporting diagnostic accuracy studies. *BMJ*. 2015;351:h5527. [doi:10.1136/bmj.h5527](https://doi.org/10.1136/bmj.h5527).
- Deeks JJ, Altman DG. Diagnostic tests 4: likelihood ratios. *BMJ*. 2004;329:168–169. [doi:10.1136/bmj.329.7458.168](https://doi.org/10.1136/bmj.329.7458.168).
- See [ROC curves and AUC](roc-curves-and-auc.html) for threshold curves and AUC.
