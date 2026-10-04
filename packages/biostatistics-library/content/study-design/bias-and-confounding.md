---
title: Bias and confounding
summary: A causal framework for recognizing selection, measurement, and confounding mechanisms before trusting an estimate.
---

## Overview

Bias is systematic error: the study’s estimate misses its intended target for reasons other than random sampling variation. Increasing sample size narrows standard errors but does not remove the error; it can produce a precise estimate of the wrong quantity. Confounding, selection, and measurement are distinct mechanisms, yet commonly overlap. A treatment may be offered to sicker patients (confounding), those patients may have more intensive outcome surveillance (measurement), and follow-up may depend on recovery (selection).

Start by defining the target contrast: population, strategies, time zero, outcome, follow-up horizon, and effect scale. Then ask how the observed comparison could differ from the target. A model computes a contrast; design assumptions determine whether it has a causal interpretation.

## Sketch the causal sequence

A directed acyclic graph (DAG) records proposed causal relationships. Let A be treatment, Y outcome, and L baseline severity. If severity affects treatment and outcome, A ← L → Y is a backdoor path. Adjustment for an adequate set of common causes can block it. If treatment changes biomarker M, which affects outcome, A → M → Y is part of the total effect; adjusting for M removes part of that effect. If treatment and an unmeasured factor U both cause clinic attendance S, then A → S ← U → Y. Restricting analysis to attendees conditions on a collider and may create an association.

A DAG is a scientific argument, not something correlations uniquely reveal. Establish time order first. Include causes of treatment and outcome, post-treatment variables, eligibility, missingness, and measurement. For each arrow, write why the cause could change the effect. A common cause is not automatically a confounder, and an associated variable may instead be mediator, collider, proxy, or selection consequence. Automated p-value selection has no general causal basis.

The estimand clarifies which variables matter. “Effect of treatment” could mean initiating now versus never initiating, sustained use versus discontinuation, or assignment to an offer regardless of adherence. Each contrast may need different assumptions and adjustment. Describe an ideal target trial before deciding which records or covariates to use.

## Standardize instead of comparing unlike groups

Suppose A is binary and L is a measured pretreatment risk factor. Standardization predicts outcome under each treatment for each person, then averages predictions over a common target distribution:

$$
R(a)=\frac{1}{N}\sum_{i=1}^N P(Y_i=1\mid A=a,L_i),\quad RD=R(1)-R(0).
$$

A causal interpretation requires consistency, conditional exchangeability given measured history, positivity, and adequate estimation. Exchangeability means no residual common causes remain; positivity means each relevant patient could receive either strategy. Neither condition can be proven by a model fit statistic.

Example: among 1,000 patients, half have high severity. Outcome risk is 5% at low severity and 20% at high severity regardless of treatment. If 80% of treated but only 20% of untreated patients are high severity, crude risks are 17% and 8%, respectively: an apparent 9 percentage-point treatment harm. Standardizing both groups to 50% high severity yields 12.5% in each. The arithmetic demonstrates compositional confounding; in real data, unmeasured differences may remain.

Regression adjustment, stratification, matching, weighting, and g-computation are alternative implementations. They can target different populations and have different stability. Propensity scores summarize measured treatment predictors; assess covariate balance after using them rather than celebrating high discrimination. No method balances unmeasured covariates by definition.

## Selection can manufacture an association

Selection may occur at recruitment, database inclusion, follow-up, or complete-case analysis. Suppose both smoking and an unrelated condition cause hospital admission. Among admitted patients, smoking may become negatively associated with the other cause of admission, even if they are independent in the community. This collider bias is induced by restricting to hospital patients.

A high follow-up rate does not assure unbiased follow-up. If people with poor prognosis are less likely to return in one group, the observed participants can be selected survivors. Report who entered, who remained, reasons for dropout, and how completeness relates to exposure and prognosis. Inverse-probability-of-censoring weights can address dropout conditional on measured history when each history retains a positive chance of observation. They cannot correct dependence on an unmeasured deterioration. Imputation handles missing values under explicit assumptions; it does not repair selection into the original sample.

Selection also affects transportability. A volunteer sample may estimate an effect valid among volunteers but fail to represent the target population if effect modifiers differ. Distinguish this from internal validity: selection can distort the comparison within the study and can also limit generalization.

## Quantify measurement error where possible

Exposure misclassification may be differential: cases can recall prior exposure more carefully than controls, or clinicians may test treated patients more often. The shortcut that nondifferential misclassification always biases toward the null only holds under restricted conditions, such as some binary exposure models. Error can bias either way with multiple categories, confounder error, nonlinear relations, or differential recording.

With classical error in a simple linear regression, if observed exposure X* = X + U and U is independent noise, the slope is attenuated by the reliability ratio λ = Var(X)/[Var(X)+Var(U)]. A true slope of 2 with λ=0.6 appears roughly 1.2. This approximation does not apply universally, especially with multiple covariates or differential error.

Validation subsamples, duplicate assays, repeat measures, blinded adjudication, and high-quality record linkage can estimate accuracy. When validation data are unavailable, probabilistic bias analysis varies plausible sensitivity, specificity, or reliability values and shows how estimates shift. State the source of assumptions and identify what degree of error would reverse the conclusion.

## Inspect overlap before weighting

Positivity requires both strategies to be possible for every history represented in the target. If nearly every patient with severe renal failure receives the same treatment, the data do not directly support a contrast for that subgroup. Model-based predictions there are extrapolations.

Estimated treatment probabilities near zero or one create extreme inverse-probability weights. Inspect overlap by treatment, covariate balance, maximum weights, and effective sample size. Trimming unsupported observations may stabilize estimates but changes the target population. Prefer a clinically defined restriction or explicit overlap-population estimand and report what population remains.

## Calculate standardized risks in R

    fit <- glm(event ~ treated + age + severity,
               family = binomial(), data = d)
    d1 <- transform(d, treated = 1)
    d0 <- transform(d, treated = 0)
    risk1 <- mean(predict(fit, newdata = d1, type = "response"))
    risk0 <- mean(predict(fit, newdata = d0, type = "response"))
    c(risk_treated = risk1, risk_control = risk0,
      risk_difference = risk1 - risk0)

This estimates model-based marginal risks over the empirical covariate distribution. It is conditional on the model and identification assumptions. Bootstrap the entire estimation procedure for sampling uncertainty; in clustered data, resample clusters. The confidence interval does not incorporate uncertainty about unmeasured confounding or the causal graph.

## Handle evolving confounders as histories

In longitudinal care, treatment may change a later covariate that guides future treatment and predicts outcome. For example, month-one therapy changes a biomarker at month two; that biomarker determines continuation and predicts the endpoint. Ordinary adjustment for it can block part of the earlier treatment effect, while omitting it leaves later treatment confounded.

Marginal structural models use inverse-probability weights based on treatment and censoring history to create a pseudo-population where measured past covariates no longer predict treatment. The weighted outcome model can compare sustained strategies. Validity requires sequential exchangeability, positivity over time, consistency, and well-estimated weights. Extreme weights signal limited support or unstable models. Truncation trades potential bias for variance and deserves sensitivity analysis.

Time zero must align with eligibility and assignment. If patients are defined as treated by a prescription filled within 30 days after discharge but follow-up starts at discharge, treated patients must survive event-free until the fill. Counting this waiting period as treated time creates immortal-time bias. Define strategies at a shared starting point, handle grace periods explicitly, or emulate a target trial using cloning, censoring, and weighting. These approaches do not remove unmeasured confounding.

## Probe assumptions with sensitivity analyses

For unmeasured confounding, specify plausible prevalence differences and outcome associations. For selection, vary risk among unobserved people. For misclassification, vary sensitivity and specificity. Anchor ranges in external evidence or expert knowledge and show scenarios capable of changing the substantive interpretation.

Suppose an adjusted risk ratio is 0.80. An omitted frailty factor occurs in 40% of untreated and 20% of treated participants and doubles risk. A simplified bias factor is

$$
BF=\frac{1+p_0(RR_{UY}-1)}{1+p_1(RR_{UY}-1)}
=\frac{1+0.40}{1+0.20}=1.167.
$$

The adjusted ratio becomes approximately 0.80 × 1.167 = 0.93 under this scenario. The formula is not a universal correction; it ignores multiple biases and uncertainty in its inputs. A grid of scenarios is more informative than one convenient assumption.

Negative-control outcomes or exposures can detect some residual bias if they share its causes but have no causal connection to the primary endpoint. A non-null control association is a warning; a null association does not validate every assumption. Triangulation across studies with different weaknesses is useful, while acknowledging that shared biases can make results agree.

## Match the conclusion to what was identified

An adjusted association is not automatically a causal effect. State whether the analysis is descriptive, predictive, or causal. For causal work, report population, strategies, time zero, horizon, effect scale, adjustment rationale, and assumptions. Give absolute effects when decisions concern numbers of events.

Odds ratios are non-collapsible, so conditional and marginal odds ratios may differ even without confounding. Hazard ratios compare instantaneous rates within changing risk sets and do not directly describe population risk. A coefficient change after adjustment alone does not prove that confounding was removed. When risk matters, compute standardized risks and risk differences.

Separate sampling uncertainty from structural uncertainty. A narrow interval describes variability under the analysis; it does not show that the data were selected, measured, or compared appropriately. A defensible report makes each adjustment traceable to a causal concern and explains which credible alternatives remain.

## Effect scales and model behavior

Confounding is defined relative to a contrast, and the numerical estimate depends on the effect scale. A variable can change an odds ratio after adjustment even if it is not a confounder because the odds ratio is non-collapsible: conditional odds ratios average differently from marginal odds ratios. This differs from confounding, where the crude estimate differs because groups have different distributions of common causes. Comparing regression coefficients before and after adjustment is therefore an unreliable confounding diagnostic, especially in logistic models.

For policy and clinical decisions, marginal absolute risks often communicate consequences more directly than conditional coefficients. If an intervention changes risk from 2% to 1%, the relative risk is 0.5 and the risk difference is −1 percentage point. In a higher-risk group, the same relative risk from 20% to 10% means a −10-point difference. Both can be true; they answer different questions. Name the target population over which a standardized risk is averaged. A conditional odds ratio may be useful for etiologic or prediction modeling, but it should not be described as a population risk ratio.

Model misspecification can add bias to confounding bias. A linear outcome model that forces a constant treatment effect may be wrong when effects vary with severity. Flexible splines or interactions can improve fit, but they do not resolve unmeasured confounding. Propensity-score methods also require care: a treatment model with excellent classification can still produce poor balance, while a model with modest discrimination may balance the covariates that matter. Inspect standardized mean differences, variance ratios, distributional overlap, and balance across nonlinear terms.

## A concrete quantitative bias analysis

Suppose a study estimates a risk ratio of 0.75 after adjustment for recorded factors. A plausible unmeasured occupational exposure may be more common in controls and independently raise disease risk. A deterministic bias analysis can specify prevalence among treated and untreated participants and a risk ratio linking the factor to outcome. For each parameter combination, compute a bias factor, adjust the observed contrast, and display a two-dimensional table or contour plot. The output is not a corrected truth; it is a map from assumptions to conclusions.

For a binary unmeasured confounder U, one simplified risk-ratio bias factor is

$$
BF=\frac{1+p_0(RR_{UY}-1)}{1+p_1(RR_{UY}-1)},
$$

where p0 and p1 are the prevalences in untreated and treated groups, respectively. If p0=0.50, p1=0.25, and RR_UY=1.5, then BF=(1+0.50×0.5)/(1+0.25×0.5)=1.20/1.125=1.067. Multiplying the observed ratio 0.75 by 1.067 gives 0.80. This remains a protective association under that scenario. If the unmeasured factor is more imbalanced or more strongly prognostic, the estimate can move closer to or beyond one. The formula assumes a simple structure and should not be used as a plug-in correction for complex data.

Probabilistic bias analysis assigns distributions, rather than fixed values, to uncertain prevalences and measurement parameters. Repeated draws yield a distribution of bias-adjusted effects alongside sampling uncertainty. The choice of distributions should be defensible and transparent; narrow distributions without evidence create a false impression of precision. Separate uncertainty due to sampling from uncertainty due to the bias model where possible. Include scenarios where two biases could reinforce one another, since assuming that selection and confounding cancel is not justified.

## Use design and analysis as complementary safeguards

Prevention is usually more credible than repair. Restrict eligibility to people for whom both strategies are possible; align treatment assignment and time zero; use an active comparator; collect covariates before exposure; standardize outcome surveillance; blind adjudicators; and document reasons for nonparticipation and dropout. These choices reduce the burden placed on statistical adjustment.

When reporting an observational effect, provide a compact chain of reasoning: the target trial or estimand, causal diagram or adjustment logic, sample-selection process, measurement quality, overlap diagnostics, estimator, and sensitivity analyses. Explain why each covariate was included and why post-exposure variables were not adjusted for. Report changes in target population after matching or trimming. Present balance and uncertainty, not only a model table.

Readers should be able to distinguish three questions: whether the estimate is precise, whether measured data support the modeled contrast, and whether the causal assumptions are credible. Confidence intervals answer the first under a statistical model. Diagnostics illuminate the second. Subject-matter knowledge, design, and sensitivity analysis inform the third. No single p-value or robustness check collapses these questions into one.

## Diagnose residual structure in practice

Residual confounding is more likely when treatment choice is strongly guided by prognosis, when key covariates are measured crudely, or when groups have little overlap. A useful audit asks whether clinicians knew something relevant that the dataset omits: functional status, patient preference, frailty, contraindications, or access to care. These factors can influence both receipt and outcome even when coded diagnoses look balanced.

Balance diagnostics should be clinically interpretable. A standardized mean difference of 0.1 is a common rough flag, not a pass-fail theorem. Check distributions, tails, nonlinear terms, and important interactions, since equal means can conceal different shapes. If matching discards many people, compare characteristics of retained and excluded participants. If weighting produces a low effective sample size, the nominal cohort size overstates the information available for the weighted contrast.

Negative controls and quantitative sensitivity analyses complement these checks. A negative control should share confounding structure with the primary analysis while lacking a plausible causal pathway. An association can expose residual structure, but the absence of one does not prove the primary estimate unbiased. Report the expected direction of each concern and whether it would amplify or attenuate the observed contrast.

## Explain uncertainty without overclaiming

Confidence intervals are conditional on the estimator and sampling model. They do not include uncertainty about whether the adjustment set was sufficient, whether selection was ignorable, or whether a measurement instrument captured the construct. Report a sensitivity interval or scenario separately from the conventional sampling interval so readers can see which uncertainty is represented. Avoid labeling an estimate robust because several models return similar answers if all share the same unmeasured source of bias.

When assumptions are weak, downgrade the wording of the conclusion. An estimate may still be useful for surveillance, prediction, or hypothesis generation even if causal interpretation is not secure. The appropriate response to bias risk is not always to discard the study; it is to make the estimand and evidential limits explicit.

## References and further reading

- Hernán MA, Robins JM. [*Causal Inference: What If*](https://www.hsph.harvard.edu/miguel-hernan/causal-inference-book/). Chapman & Hall/CRC; 2020.
- Greenland S, Pearl J, Robins JM. Causal diagrams for epidemiologic research. *Epidemiology*. 1999;10:37–48. https://doi.org/10.1097/00001648-199901000-00008
- Cole SR, Hernán MA. Constructing inverse probability weights for marginal structural models. *American Journal of Epidemiology*. 2008;168:656–664. https://doi.org/10.1093/aje/kwn164
- Lash TL, Fox MP, Fink AK. *Applying Quantitative Bias Analysis to Epidemiologic Data*. Springer; 2009. https://doi.org/10.1007/978-0-387-87959-8
- Rothman KJ, Greenland S, Lash TL, eds. *Modern Epidemiology*. 3rd ed. Lippincott Williams & Wilkins; 2008.
- Hernán MA, Sauer BC, Hernández-Díaz S, Platt R, Shrier I. Specifying a target trial prevents immortal time bias and other self-inflicted injuries in observational analyses. *Journal of Clinical Epidemiology*. 2016;79:70–75. https://doi.org/10.1016/j.jclinepi.2016.04.014
