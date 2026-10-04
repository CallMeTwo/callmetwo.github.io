---
title: Interaction and effect modification
summary: Assess whether associations differ across levels of another variable, distinguish statistical interaction from causal effect modification, and report contrasts on useful scales.
---

## Overview

Effect modification occurs when an exposure or treatment effect differs across levels of another variable. Interaction is the statistical representation of that variation on a chosen model scale. Because effect measures are scale-dependent, “there is an interaction” is incomplete unless the scale and target contrast are stated.

Interactions can be scientifically important: a treatment may help patients with high baseline risk more in absolute terms, an environmental exposure may affect children differently than adults, or a diagnostic test may perform differently by disease stage. Analyses should be motivated by mechanism or decisions, not discovered by searching many subgroups after seeing the data.

## Product terms and contrast calculations

For continuous outcome (Y), a linear model with binary treatment (A) and continuous modifier (Z) is \(E(Y\mid A,Z)=\beta_0+\beta_AA+\beta_ZZ+\beta_{AZ}AZ\). The treatment contrast at (Z=z) is \(\beta_A+\beta_{AZ}z\). Thus \(\beta_A\) is the treatment effect only at (Z=0); centering (Z) at a meaningful value makes that main effect useful.

Suppose treatment coefficient is −2.0 points, interaction with age-per-decade is 0.6, and age is centered at 60. At age 60, treatment contrast is −2.0. At age 70, it is −2.0+0.6=−1.4. If lower outcome is better, treatment benefit is smaller at older age on the additive scale. The standard error at age 70 is \(\sqrt{Var(\hat\beta_A)+Var(\hat\beta_{AZ})+2Cov(\hat\beta_A,\hat\beta_{AZ})}\), not a combination of separate confidence intervals.

```r
fit <- lm(outcome ~ treatment * age10 + baseline, data = dat)
coef(fit)
# Use emmeans or a model-matrix contrast to estimate treatment effects
# at age10 = 0 and age10 = 1, with intervals.
```

The `*` formula includes both main effects and their interaction. Do not fit the product term while omitting constituent main effects unless there is a compelling constrained model. Calculate contrasts at values with data support and show confidence intervals. For logistic or Cox models, interaction coefficients are on log-odds or log-hazard scales, not automatically on risk difference or survival probability scales.

## Scale dependence: additive and multiplicative interaction

Two exposures can interact on an additive scale but not multiplicative scale, or vice versa. Additive interaction asks whether the joint excess risk exceeds the sum of separate excess risks; it is often relevant to public-health burden. Multiplicative interaction asks whether the joint relative effect differs from the product of individual relative effects. The choice should follow the scientific and decision question.

For binary exposures (A) and (B), let risks be (p_{00},p_{10},p_{01},p_{11}). Additive interaction contrast is \(IC=p_{11}-p_{10}-p_{01}+p_{00}\). If risks are 0.05, 0.10, 0.12, and 0.22 respectively, IC=0.22−0.10−0.12+0.05=0.05: five percentage points of excess joint risk beyond additivity. The relative excess risk due to interaction (RERI) uses risk ratios and equals \(RR_{11}-RR_{10}-RR_{01}+1\) under a common reference risk.

Logistic regression product terms assess interaction on odds scale. When outcomes are common, odds ratios differ from risk ratios, so a nonsignificant product term does not show no additive interaction. Estimate standardized risks under each exposure combination and calculate additive contrasts with uncertainty. Delta method or bootstrap can obtain intervals; bootstrap must resample the independent unit.

### Uncertainty for additive interaction

For the risk interaction contrast \(IC=p_{11}-p_{10}-p_{01}+p_{00}\), estimate four risks and their joint covariance. The variance of the contrast depends on covariance among predicted risks, especially when the same participants contribute to model-based standardization. A bootstrap that resamples participants and recomputes all four risks is often straightforward; resample clusters if assignment or sampling is clustered. Do not combine four separate confidence limits as though estimates were independent.

For RERI based on adjusted risk ratios, calculate all ratios relative to the same reference group and propagate uncertainty on the joint coefficient vector. Delta-method intervals can be asymmetric or cross impossible values in sparse data. Bootstrap or simulation-based intervals may be more stable, but sparse cells remain a limitation. Report underlying risks and counts so readers can see data support.

The additive interaction contrast can be negative, zero, or positive. Its interpretation depends on which outcome is coded as adverse and on the reference exposure categories. A positive RERI for a harmful outcome indicates excess joint risk beyond the sum of separate excess risks under the chosen scale; it does not by itself identify a biological mechanism.

## Effect modification in randomized trials

Randomization supports an unbiased average treatment contrast, but subgroup estimates are less precise and can be vulnerable to chance. Prespecify a small number of plausible modifiers based on biology, baseline risk, or treatment mechanism. Test the interaction directly; “significant in one subgroup, not significant in another” is not evidence that subgroup effects differ.

Display subgroup-specific treatment effects and intervals, interaction estimate, scale, and p-value or interval. Consider baseline risk stratification: even a constant relative effect yields larger absolute benefit for high-risk patients. This is clinically meaningful absolute-effect heterogeneity, though not necessarily relative-effect interaction. A treatment rule should use calibrated absolute benefits and harms, not subgroup p-values alone.

## Confounding and causal effect modification

In observational studies, apparent effect modification can arise from confounding that differs across modifier strata, measurement error, selection, or model misspecification. Causal effect modification is defined in terms of potential outcomes and requires identification assumptions within relevant subgroups. Ensure positivity in each stratum: if no older patients receive treatment, the older-patient effect is not identified from data.

The modifier should generally be measured before exposure for baseline effect modification. Stratifying on a post-treatment variable can induce collider bias or change the estimand. For time-varying modifiers or treatment, longitudinal methods may be necessary. Define whether effects are conditional or standardized to subgroup covariate distributions.

In a randomized trial, treatment is randomized overall, but small subgroups can have chance imbalance and wide intervals. Randomization within strata supports subgroup contrasts only if allocation and analysis account for those strata. Post hoc cut points, selective reporting, and multiple subgroup looks weaken confirmatory claims. An interaction p-value should be interpreted together with the effect estimates and prior plausibility.

When treatment is assigned at cluster level, subgroup effect analysis may have few clusters in each category. Participant count can obscure the true precision constraint. Use design-based or mixed modeling that respects cluster assignment and avoid overinterpreting apparent subgroup variation from a handful of clinics.

Subgroup-specific estimates can be standardized to a common covariate distribution, making comparisons less confounded by different covariate mixes across subgroups. This is especially useful in observational studies. The target distribution should be stated; standardizing each subgroup to its own composition answers a different question than using a shared target.

## Continuous modifiers and nonlinear interaction

Dichotomizing a continuous modifier at the median discards information and creates an arbitrary threshold. Model continuous modifiers continuously, using splines if effect variation may be nonlinear. Interaction between treatment and spline basis terms requires joint testing and contrasts across the range. Plot treatment effect with uncertainty against modifier values, marking data density and avoiding unsupported tails.

Centering a modifier changes main-effect interpretation but not fitted values. Scaling per decade or standard deviation can aid communication. If the modifier has nonlinear main effect, include that main effect alongside interaction terms. Use hierarchical principles: retain lower-order terms when including higher-order interactions.

## Multiplicity and overfitting

If 20 subgroup interactions are tested at 0.05, chance findings are expected. Predefine primary modifiers, adjust or control false discovery for broad screening, and label exploratory signals. Replicate candidate heterogeneity in independent data. Do not use a forest plot of many noisy subgroup estimates to imply stable individual treatment effects.

Interaction terms consume sample size quickly. Power is generally lower for interaction than main effect because information is spread across cells and modifier values. Use simulation or dedicated sample-size calculations that account for prevalence of modifier, outcome rate, and correlation. A null interaction with a wide interval is inconclusive, not evidence of homogeneous effects.

In logistic regression, the treatment-by-modifier coefficient is a difference in log odds ratios per modifier unit. Suppose treatment log OR is −0.50 at modifier zero and interaction coefficient is 0.15 per 10 years. At 10 units above zero, log OR is −0.35 and OR is 0.70. The risk difference still depends on baseline risk. Generate predicted risks for each treatment and modifier value, then contrast them on the absolute scale.

In Cox models, a treatment-by-modifier term represents variation in log hazard ratio, assuming proportional hazards within each modifier level unless time interactions are added. A constant HR interaction can coexist with varying absolute survival differences because baseline hazards differ. If PH is violated, both treatment and modifier effects may vary over time; report time-specific or RMST effects.

For ordinal outcomes, effect modification may be assessed on cumulative odds scale, which assumes proportional odds across thresholds. If proportional odds fails, interaction interpretation depends on threshold-specific effects. For count outcomes, log-link interactions are multiplicative on rates; additive rate differences may be more relevant for resource planning. Always name the effect scale.

### Power and precision for interactions

Interaction power depends on modifier prevalence, predictor measurement reliability, event frequency, and treatment allocation. A continuous modifier generally retains more information than a median split, but measurement error attenuates interaction estimates. For a binary modifier with only 10% in one subgroup, that subgroup's treatment contrast is imprecise even in a moderate trial. Plan sample size by simulation under realistic joint distributions and report expected interval width.

Main-effect power calculations do not guarantee adequate power for effect modification. If interaction is central to a treatment rule, recruit enough participants across modifier ranges and ensure both treatment options are represented. Enrichment designs can improve information in a target subgroup but change generalizability; describe the target population.

Failure to detect interaction should be reported with its interval. If the interval rules out only very large heterogeneity but includes clinically important variation, evidence of homogeneity is weak. Equivalence-style reasoning for treatment-effect variation requires prespecified margins and adequate precision.

## Example: absolute benefit by baseline risk

Suppose treatment reduces relative risk by 20% across baseline risk strata. For baseline risk 5%, treated risk is 4%, absolute reduction 1 percentage point (NNT 100). For baseline risk 25%, treated risk is 20%, reduction 5 points (NNT 20). There is no relative-risk modification, yet absolute benefit differs fivefold. A treatment-allocation decision may appropriately prioritize high baseline risk if treatment harms and costs are similar.

This calculation assumes the relative risk transports across strata and baseline risks are calibrated. If treatment effect varies or risks are estimated with error, derive standardized risks and uncertainty by subgroup. NNT is unstable when risk difference is near zero and should include a horizon and interval.

An additive interaction calculation can make the public-health implication concrete. Let baseline risk be 5%, risk with exposure A alone 10%, with B alone 12%, and with both 22%. The observed joint risk exceeds the additive expectation (0.10+0.12-0.05=0.17) by 0.05. Among 1,000 people with both exposures, this corresponds to 50 excess events relative to additivity, if risks transport and the causal assumptions hold. The interval for that excess should be reported; point estimates can be unstable when cell counts are small.

For a treatment modifier analysis, show both relative and absolute contrasts if they inform different decisions. A constant relative effect can justify prioritizing high baseline risk even without biological interaction; a relative interaction can alter absolute benefit in more complex ways. Avoid using “responders” unless response is defined prospectively and the treatment rule is validated.

## Reporting effect modification

State modifier scale and timing, interaction scale and model term, prespecification, number of analyses, and covariate adjustment. Report subgroup estimates with intervals and the interaction contrast, not separate significance labels. Give absolute effects when relevant and show data support. Explain whether interpretation is causal, predictive, or associational.

For logistic models, distinguish odds-scale interaction from risk-scale interaction. For survival models, distinguish hazard-ratio interaction from survival-probability or RMST differences. For continuous outcomes, state outcome units and modifier centering. A statement that “effect varied by age” should specify how much and on what scale.

Report the full interaction specification and lower-order terms, modifier coding, model sample size, and events or observations across modifier ranges. If a result is exploratory, say so where the claim is made. Provide code or contrast definitions sufficient for an independent analyst to reproduce the subgroup estimates.

For multiple subgroups, a forest plot should use a common effect scale and show interaction tests or an overall heterogeneity test where appropriate. Do not visually rank noisy subgroup point estimates without showing uncertainty. Clinical recommendations require validated absolute benefits and harms, not only statistical heterogeneity.

When a modifier is centered, state its centering value so readers understand the reference treatment effect. If standardized, report the standard deviation and population used for scaling.

Confidence intervals for subgroup effects and their differences should reflect the original randomization or sampling unit. If data are clustered, resample clusters or use a design-aware variance estimator; treating each participant as independent can make apparent heterogeneity look more precise than it is.

An interaction interval should be compared with a clinically meaningful heterogeneity threshold, not only zero. Prespecify the scale and threshold when treatment personalization is the goal.

Report risk and harm contrasts together when both affect the same decision.

## Interpreting plots of conditional effects

A plot of treatment effect across a modifier should state the scale, show a confidence band, and mark the distribution of observed modifier values. If the model is logistic, distinguish conditional odds-ratio curve from standardized absolute-risk difference curve. The same underlying model can produce curves with different shapes on different scales. Choose the scale tied to the decision and make alternative scales available when they reveal materially different patterns.

Do not infer effect modification by checking whether pointwise confidence intervals overlap. Overlap of two 95% intervals is not a formal interaction test; non-overlap is conservative and also not equivalent. Estimate the difference between subgroup effects directly, with its standard error or interval. For a continuous modifier, use a joint test of interaction terms and display the effect curve.

Predicted subgroup effects near the edge of observed support are often unstable. A smooth curve may conceal sparse data. Show a rug, histogram, or density by treatment, and avoid highlighting unsupported extremes. If data coverage differs by exposure, restrict or standardize to common support and state how the target population changes.

## Interaction in survival and repeated-measures models

In a Cox model, treatment-by-modifier interaction describes modification of a conditional hazard ratio if proportional hazards holds. If the treatment effect also changes over time, a treatment-by-time term and potentially modifier-by-treatment-by-time term are needed. Such models can become data-hungry. Report time-specific hazard contrasts and absolute survival or RMST differences where clinically meaningful.

For repeated measures, treatment-by-modifier-by-time interactions assess whether treatment trajectories vary across modifier values. Specify whether time is numeric or categorical and calculate treatment contrasts at each relevant time. A significant three-way interaction does not identify when or how large the differences are; predicted trajectories with intervals help.

For count outcomes, a product term in log-link model tests multiplicative rate modification. If the clinical question is excess events, standardize rates and report additive rate differences. Interaction conclusions should not be transferred automatically from one outcome family to another.

## Multiplicity and selective subgroup claims

Subgroup analyses are especially vulnerable to selective reporting because researchers can choose modifiers, cut points, outcomes, and scales. List all planned interactions in the protocol or analysis plan. If exploratory screening generates a candidate modifier, report the full search and treat it as hypothesis-generating; validate in independent data before changing treatment policy.

Adjusting for multiplicity can control false positives but does not solve low power or confounding. A hierarchical model can partially pool subgroup effects, reducing extreme noisy estimates, though results depend on the heterogeneity prior. Report the distribution of subgroup effects and uncertainty rather than declaring each subgroup winner or loser.

## References and further reading
The interaction contrast should be expressed in units that clinicians can act on, such as additional cases prevented or mean score points gained, when the data support that translation. Relative-scale heterogeneity alone may not indicate a useful change in policy.

When modifying a clinical guideline, validate the proposed subgroup rule prospectively and assess calibration, net benefit, and harms. Exploratory heterogeneity estimates should not directly become treatment eligibility criteria.

- Rothman KJ, Greenland S, Walker AM. Concepts of interaction. *American Journal of Epidemiology*. 1980;112:467–470. [doi:10.1093/oxfordjournals.aje.a113015](https://doi.org/10.1093/oxfordjournals.aje.a113015)
- Knol MJ, VanderWeele TJ. Recommendations for presenting analyses of effect modification and interaction. *International Journal of Epidemiology*. 2012;41:514–520. [doi:10.1093/ije/dyr218](https://doi.org/10.1093/ije/dyr218)
- VanderWeele TJ. *Explanation in Causal Inference: Methods for Mediation and Interaction*. Oxford University Press; 2015.
- Altman DG, Bland JM. Interaction revisited: the difference between two estimates. *BMJ*. 2003;326:219. [doi:10.1136/bmj.326.7382.219](https://doi.org/10.1136/bmj.326.7382.219)
- The [simple and multiple linear regression article](simple-and-multiple-linear-regression.html) discusses regression contrasts and model terms.
