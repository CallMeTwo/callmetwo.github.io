---
title: Bias and confounding
summary: Systematic errors that distort study results — selection bias, information bias, and confounding — and how to detect and control them.
---

## Overview and key ideas

**Bias** is any systematic deviation of an estimated effect from its true value, caused by the study's design, conduct, or analysis. Unlike random error, bias does not shrink with a larger sample size; more data make a biased estimate more precisely wrong. The three broad families are:

- **Selection bias** — the way participants are chosen or retained makes the observed exposure–outcome association differ from the one in the source population. Classic examples: low response rate that correlates with the outcome, hospital (Berkson) selection of controls, loss to follow-up that differs by group, and excluding long-term survivors from a cohort.
- **Information (misclassification) bias** — the way exposure or outcome is measured systematically differs between groups or over time. Classic examples: recall bias in case-control studies (cases remember exposures differently than controls), diagnostic suspicion bias (clinicians investigate differently in treated patients), and unblinded outcome assessment.
- **Confounding** — the exposure is associated with a third variable (the **confounder**) that independently affects the outcome, so the crude association mixes the exposure's effect with the confounder's. A confounder must be (1) associated with the exposure, (2) an independent cause of the outcome, and (3) not on the causal pathway between exposure and outcome.

## When to use it

Bias and confounding are not methods to "use"; they are threats to check in every study. Typical moments where each matters most:

| Threat | Where it is most likely to arise |
| --- | --- |
| Selection bias | Retrospective studies using hospital or registry data; studies with loss to follow-up; case-control studies with poorly chosen controls. |
| Information bias | Unblinded outcome assessment; self-reported exposure in case-control studies; using administrative codes that change over time. |
| Confounding | Any observational study of a behaviour or social exposure (smoking, diet, SES); registry studies where groups differ systematically at baseline. |

In a properly randomised trial, confounding is controlled by design; residual confounding and information bias remain possible (e.g., through post-randomisation dropouts or unblinded assessments).

## Assumptions and limitations

- **Confounding control by regression** assumes the model is correctly specified: all relevant confounders are measured, the exposure–confounder and confounder–outcome relationships are correctly modelled (linearity, no unmodelled interactions), and no unmeasured confounder remains. An unmeasured or poorly measured confounder can leave substantial residual confounding.
- **Stratification** requires adequate numbers in each stratum; sparse strata produce unstable stratum-specific estimates and wide intervals.
- **Misclassification** that is non-differential (unrelated to group) usually biases a binary exposure–outcome association toward the null; differential misclassification can bias in either direction and is often worse.
- **Direct standardisation** of rates requires an external standard population; results depend on the choice of standard and are not comparable across studies using different standards.
- **Instrumental-variable and marginal-structural-model approaches** for unmeasured confounding rest on strong, untestable assumptions (e.g., the exclusion restriction for instruments); they are tools of last resort, not routine practice.

## Worked example

A case-control study examined coffee drinking and lung cancer (168 cases, 1832 non-cases with coffee; 28 cases, 1972 non-cases without). Crude OR = (168 × 1972) / (1832 × 28) ≈ **6.5** — suggesting coffee is a strong carcinogen.

Stratifying by smoking (a confounder: coffee drinkers are more likely to smoke, and smoking causes lung cancer):

| Smoking | Coffee: cases/non-cases | No coffee: cases/non-cases | OR |
| --- | --- | --- | --- |
| Smoker | 160 / 840 | 20 / 980 | 9.3 |
| Non-smoker | 8 / 992 | 8 / 992 | 1.0 |

The stratum-specific ORs are 9.3 among smokers and 1.0 among non-smokers. Thus this constructed table does **not** show a crude association explained away by smoking: the Mantel–Haenszel common OR is about 6.7, close to the crude OR of 6.5. Instead, it illustrates why one should inspect stratum-specific effects before reporting a single adjusted estimate: the association differs sharply across strata, which could represent effect modification, sparse-data instability, or a deliberately simplified teaching example. A confounder can change a crude estimate, but its presence and magnitude should be assessed with causal knowledge and estimates, not inferred from whether a variable reaches statistical significance.

## Interpretation and common pitfalls

- **Confounding by indication**: in observational studies of treatments, sicker patients receive the treatment, so the treatment looks harmful when it merely treated the sick. Randomisation, propensity methods, or restriction are needed; raw comparison is not valid.
- **Overadjustment**: adjusting for a variable on the causal pathway between exposure and outcome (a mediator), or for a collider (a common effect of exposure and outcome), *creates* bias that was not there; adjusting for a collider opens a spurious association.
- **Assuming "not significant" means "no confounding"**: a confounder can be associated with the outcome but fail a significance test for association with the exposure (especially with low power), and still materially confound the effect.
- **Relying on a single adjustment**: one regression model is not a proof of unbiasedness. Sensitivity analyses (different models, stratification, negative-control outcomes, quantitative bias analysis) are how researchers argue that residual confounding is unlikely to explain the result.

## References and further reading

## A causal structure for identifying bias

## Identification: adjustment sets and target trial thinking

## Measurement error and quantitative bias analysis

### Reporting a quantitative bias analysis

State each bias parameter, its source (validation subset, prior literature, or expert range), its assumed probability distribution, and whether uncertainty is propagated jointly with sampling error. Show the observed estimate beside bias-adjusted estimates over a grid or simulation distribution. A single “corrected” number can imply unjustified precision. Distinguish probabilistic bias analysis from a confidence interval: the former reflects uncertainty in bias parameters and the latter usually reflects sampling variability conditional on the model.

Exposure measurement error can attenuate or otherwise distort effects. Under simple nondifferential misclassification of a binary exposure, the observed association often moves toward the null, but this is not guaranteed after covariate adjustment or with multiple categories. Differential error—when accuracy depends on outcome status—can create associations in either direction. Biomarker degradation, self-report recall, coding algorithms, and changes in assay platforms are distinct mechanisms and should be described rather than grouped as generic “measurement error.”

Validation data can estimate sensitivity and specificity of a classification algorithm or a calibration equation for a noisy continuous measure. Regression calibration, SIMEX, Bayesian measurement models, and probabilistic bias analysis make different assumptions and target different error structures. In a quantitative bias analysis, assign plausible distributions to sensitivity, specificity, or confounder prevalence/effects, repeatedly correct the estimate, and summarize the resulting bias-adjusted distribution. Sensitivity parameters should be based on validation studies or expert elicitation and varied broadly enough to show uncertainty.

## Selection and collider examples

If both exposure and disease cause hospital attendance, restricting an analysis to hospital patients conditions on a common effect (a collider). Within the hospital sample, exposure and disease can become associated even if independent in the source population. Adjusting for additional variables does not necessarily remove this induced path. Similarly, restricting to complete cases can condition on a variable caused by exposure, outcome, and health status. Draw the selection variable explicitly in the DAG and assess whether inclusion depends on causes of exposure and outcome.

Selection weights can recover a target population contrast only if selection predictors are measured and inclusion probability is positive. Report the population represented after selection and compare estimates with alternative sampling frames. Sensitivity analyses for selection should specify how outcome risk among excluded individuals differs from included individuals; a vague statement that “selection bias may occur” does not convey its likely impact.

An adjustment set should block noncausal backdoor paths from exposure to outcome without conditioning on mediators or colliders. A causal diagram is a compact statement of temporal and causal assumptions, not an empirical proof. Identify variables by their role at the relevant time: baseline confounders precede treatment; mediators occur after treatment; time-varying confounders can be affected by prior treatment; selection variables determine inclusion or observation. The same measured variable can play different roles under different scientific questions.

Target-trial thinking sharpens observational comparisons by specifying eligibility, treatment strategies, assignment procedure, time zero, follow-up, outcome, causal contrast, and analysis. Emulating this protocol helps expose biases such as prevalent-user bias, immortal time, and misaligned eligibility. It does not make the observational study randomized: consistency, exchangeability, positivity, correct measurement, and no interference remain assumptions. Compare the observed data structure with the hypothetical trial and state which protocol components could not be emulated.

For a binary outcome, g-computation estimates conditional outcome risks and averages predictions under each strategy. Inverse-probability weighting instead creates a pseudo-population where measured covariates are independent of treatment. Doubly robust estimators combine outcome and treatment models and can remain consistent if one of those models is correct, under the causal identification assumptions and regularity conditions. “Doubly robust” does not protect against unmeasured confounding, positivity violations, or misspecified both models. Check covariate balance, overlap, weight tails, and model calibration.

## Positivity and practical diagnostics

Positivity requires that each treatment strategy has a nonzero probability within every covariate pattern in the target population. Structural positivity failure occurs when a treatment is contraindicated for a subgroup; practical failure occurs when available data provide little overlap. Plot propensity score distributions by treatment, inspect minimum and maximum estimated probabilities, examine effective sample size after weighting, and inspect stabilized-weight percentiles. Large weights indicate that a few observations represent many others and can dominate estimates. Restricting to common support changes the target population and should be stated as an estimand decision, not merely a computational fix.

```r
ps <- glm(treated ~ age + severity + comorbidity, family = binomial(), data = dat)
dat$ps <- predict(ps, type = "response")
dat$w <- ifelse(dat$treated == 1, 1 / dat$ps, 1 / (1 - dat$ps))
quantile(dat$w, c(0, .5, .9, .95, .99, 1))
```

This basic inverse-probability treatment weighting code omits stabilization, censoring, and survey weights; it illustrates diagnostics, not a complete estimator. Report balance after weighting using standardized differences and distribution plots. Truncating weights can reduce variance but introduces bias and should be prespecified with sensitivity analyses over cut points. Effective sample size \((\sum w)^2/\sum w^2\) can summarize weight concentration, but it does not replace causal validity assessment.

## Sensitivity analysis and bias triangulation

## Negative controls and falsification tests

A negative-control outcome is not causally affected by the exposure but shares sources of confounding or measurement bias; a detected association signals possible residual bias. A negative-control exposure shares confounding structure with the target exposure but cannot affect the outcome under the causal theory. Their usefulness depends on credible exclusion assumptions and adequate measurement. A null negative-control result does not prove no bias because the control may be insensitive or differently confounded. Pre-specify controls and interpret them as diagnostic evidence, not as automatic correction.

Falsification tests can also examine temporal leads: future exposure should not cause past outcomes under a causal model. An association may indicate confounding, reverse causation, or time alignment problems. However, anticipation or exposure measurement error can complicate this test. Explain expected patterns under both causal and bias scenarios, then integrate these checks with quantitative sensitivity analysis and substantive knowledge.

Because unmeasured confounding cannot generally be ruled out from observed data, quantify robustness. For binary outcomes, E-values summarize the minimum strength of association an unmeasured confounder would need with both exposure and outcome (conditional on measured covariates) to explain an observed risk ratio, under stated assumptions. Quantitative bias analysis can specify prevalence and effect of an unmeasured confounder and propagate uncertainty. Negative-control exposures or outcomes can reveal certain residual biases if their exclusion restrictions are credible. Alternative exposure definitions, lag periods, and active comparators probe design sensitivity.

No single diagnostic validates causal inference. Balance checks detect only measured imbalance; propensity-score overlap does not guarantee no unmeasured confounding; placebo tests can be insensitive; and model fit statistics do not test exchangeability. Triangulation across designs with different likely biases can strengthen inference when conclusions align. Report which biases are most plausible, their likely directions, and whether sensitivity analyses materially change the substantive conclusion.

### Confounding by indication

Clinical treatment is commonly assigned because of prognosis. Patients with more severe disease may be more likely to receive an intensive treatment and also more likely to experience the outcome. A crude comparison can make effective treatment appear harmful. Baseline disease severity is a confounder if it precedes treatment and affects both assignment and outcome. Measure it before treatment, capture clinically relevant dimensions, and ensure overlap in treatment choices. Propensity-score matching or weighting can balance measured covariates, but balance diagnostics do not reveal unmeasured severity or repair structural nonpositivity.

Check standardized mean differences and distributions after weighting/matching rather than testing baseline p-values. Estimate the target contrast explicitly: matching often changes the population to those matchable, while inverse-probability weighting may target the full eligible population and can yield extreme weights. Trim or restrict only with a clear estimand and report the resulting target population. Use negative controls or quantitative bias analysis to probe residual confounding; these provide evidence about robustness, not proof of exchangeability.

Confounding is a failure of comparability between exposure groups: causes of both exposure and outcome create noncausal paths that remain open. A directed acyclic graph (DAG) makes assumptions explicit. If age affects both treatment choice and mortality, age is a confounder; standardization, stratification, or regression adjustment may block that path. A mediator lies on the causal pathway from exposure to outcome, so adjusting for it removes part of the total effect. A collider is caused by two variables; conditioning on it can create an association that was absent before adjustment. These roles are question-specific, not labels attached permanently to variables.

Suppose treatment \(A\) is influenced by disease severity \(L\), and severity also predicts outcome \(Y\). To estimate the total effect of treatment, compare outcomes after controlling for pre-treatment severity, provided there is overlap. If treatment affects a post-treatment biomarker \(M\) that then affects \(Y\), adjusting for \(M\) changes the estimand and may induce additional bias. If an unmeasured factor \(U\) affects both treatment and outcome, measured adjustment cannot fully identify the causal effect; sensitivity analysis can quantify how strong such confounding would need to be to explain the association.

## Selection, measurement, and time-varying confounding

Selection bias arises when inclusion, retention, or complete-case status depends jointly on exposure and outcome causes. Conditioning on being hospitalized can associate a treatment with other causes of hospitalization even if none existed in the source population. Loss to follow-up can bias estimates if censoring is related to prognosis after accounting for measured predictors. Inverse-probability-of-selection or censoring weights can help under conditional exchangeability and positivity, but unstable probabilities produce variance and sensitivity to model errors.

Misclassification of a binary exposure that is independent of outcome status often attenuates an association, but differential misclassification can bias in either direction. Outcome measurement error can also distort effects, especially when assessors know treatment allocation. Validation subsamples, blinded adjudication, calibration studies, and probabilistic bias analysis can inform correction. Recall bias in case-control studies is one example of differential measurement; nondifferential does not universally mean toward the null, particularly with multiple categories or adjusted models.

Time-varying confounding requires special care when prior exposure affects a confounder that then affects later exposure and outcome. Conventional regression adjustment for that confounder can block part of the effect of prior treatment while controlling confounding of subsequent treatment. Marginal structural models use inverse-probability treatment weights to create a pseudo-population in which measured time-varying confounders are independent of treatment history. This requires sequential exchangeability, positivity at every time, consistency, and adequate weight models.

## Worked example: standardization and positivity

Imagine outcomes by treatment and severity stratum:

| Severity | Treated risk | Control risk | Target-population share |
|---|---:|---:|---:|
| Mild | 0.05 | 0.08 | 0.60 |
| Severe | 0.20 | 0.30 | 0.40 |

Standardized treated risk is \(0.6(0.05)+0.4(0.20)=0.11\); standardized control risk is \(0.6(0.08)+0.4(0.30)=0.168\). The standardized risk difference is −0.058. Crude risks can differ from this contrast if treatment allocation across severity strata differs. Standardization requires that both treatment levels have data in each relevant stratum. If severe patients almost always receive treatment, the control risk for severe patients is poorly supported and the causal contrast relies on extrapolation.

```r
target <- data.frame(severity = c("mild", "severe"), weight = c(.60, .40))
# fit must include treatment, severity, and a defensible outcome model
nd1 <- transform(target, treatment = 1)
nd0 <- transform(target, treatment = 0)
rd <- with(target, sum(weight * predict(fit, nd1, type = "response")) -
                       weight * predict(fit, nd0, type = "response"))
```

In production code, preserve the same covariate records in both prediction sets, use a bootstrap or influence-function method for uncertainty, and check model calibration and overlap. The snippet illustrates g-computation; it does not fix unmeasured confounding.

Report a prespecified causal question (population, treatment strategies, outcome, follow-up, contrast), a DAG or equivalent rationale for adjustment, missing-data and selection handling, and sensitivity analyses. Distinguish precision from validity: a narrow interval quantifies sampling uncertainty under the model and design, not residual confounding or selection bias. Quantitative bias analysis, negative controls, alternative definitions, and triangulation across designs can probe robustness but do not prove absence of bias.

- Hernán MA, Robins JM. *Causal Inference: What If*. Chapman & Hall/CRC; 2020. https://www.hsph.harvard.edu/miguel-hernan/causal-inference-book/
- Greenland S, Pearl J, Robins JM. Causal diagrams for epidemiologic research. *Epidemiology*. 1999;10:37–48. https://doi.org/10.1097/00001648-199901000-00008
- Cole SR, Hernán MA. Constructing inverse probability weights for marginal structural models. *American Journal of Epidemiology*. 2008;168:656–664. https://doi.org/10.1093/aje/kwn164

- Hernán MA, Robins JM. [*Causal Inference: What If*](https://www.hsph.harvard.edu/miguel-hernan/causal-inference-book/). Chapman & Hall/CRC, 2020.
- [STROBE Statement](https://www.strobe-statement.org/), reporting guidance for observational epidemiology.
- Rothman KJ, Greenland S, Lash TL, eds. *Modern Epidemiology*. 3rd ed. Lippincott Williams & Wilkins, 2008.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Fox J. *Applied Regression Analysis and Generalized Linear Models*. SAGE Publications.
- Hernán M, Robins J. *Causal Inference: What If*. Chapman & Hall/CRC.

The [cohort and case-control article](/biostatistics-library/study-design/cohort-and-case-control-studies.html) covers how control selection and follow-up introduce specific selection biases.
