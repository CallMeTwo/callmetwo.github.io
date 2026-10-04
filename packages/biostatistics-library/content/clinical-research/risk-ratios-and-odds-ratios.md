---
title: Risk ratios and odds ratios
summary: Two ratios that compare an event rate between groups, and when each one answers a different clinical question.
---

## Overview

Risk ratios (RRs) and odds ratios (ORs) compare relative occurrence of binary outcomes between groups. An RR divides risks; an OR divides odds. Both are dimensionless, but their numerical values and interpretations differ, especially when outcomes are common. Relative measures should generally be accompanied by group-specific risks and an absolute contrast.

An effect measure is not just a reporting preference. Design, sampling, outcome frequency, adjustment, and target population influence what it estimates. State the comparison direction, time horizon, and whether the effect is marginal or conditional. A ratio below 1 can indicate benefit or harm depending on event and reference-group definitions.

## Risks, odds, and ratios

Risk is the probability of an event in a defined population over a specified period. For a group with a events among n participants, estimated risk is a/n. Odds are p/(1−p), the event probability divided by the non-event probability. When p is small, odds and risk are close; as p grows, odds increasingly exceed risk.

The risk ratio is RR=p1/p0. If p0=.20 and p1=.15, RR=.75: risk is 25% lower relative to control. The odds ratio is OR=[p1/(1−p1)]/[p0/(1−p0)] = (.15/.85)/(.20/.80)≈.706. Calling this a 29% reduction in risk would be incorrect; it is a reduction in odds. When baseline risk is 50%, RR and OR can differ greatly.

## Worked 2×2 calculation

Suppose 30 of 200 intervention participants and 44 of 200 controls have a 30-day event. Risks are .15 and .22. RR=.15/.22=.682, a relative risk reduction of about 31.8%. The odds ratio is (30×156)/(170×44)=.626. The absolute risk difference is .15−.22=−.07, or seven fewer events per 100 over 30 days. NNT is about 1/.07=14.3, conventionally rounded up to 15 over that horizon.

These quantities answer related but different questions. The OR is farther from 1 than the RR because the outcome is common. NNT is unstable if the risk-difference interval crosses zero; report the absolute difference and uncertainty.

~~~r
tab <- matrix(c(30, 170, 44, 156), nrow = 2, byrow = TRUE)
risk1 <- tab[1, 1] / sum(tab[1, ])
risk0 <- tab[2, 1] / sum(tab[2, ])
c(RR = risk1 / risk0,
  OR = (tab[1, 1] * tab[2, 2]) / (tab[1, 2] * tab[2, 1]),
  RD = risk1 - risk0)
~~~

This assumes independent groups and complete fixed-horizon outcomes. If data are paired or clustered, variance must reflect that structure. For survival outcomes with censoring, use time-to-event methods rather than crude proportions.

## Estimation and intervals

For a log risk ratio, approximate variance is 1/a−1/n1+1/c−1/n0 for event counts a and c. A confidence interval is calculated on log scale then exponentiated. For log odds ratio, approximate variance is 1/a+1/b+1/c+1/d. These Wald formulas can fail with sparse cells or zero counts; score, likelihood, exact, or Bayesian methods may be more suitable.

Ratios are asymmetric, so intervals should generally be constructed on log scale. A ratio interval from .50 to .90 does not translate to a symmetric percentage-change interval around the point estimate. Report the ratio and bounds, plus risks in both groups. For rare outcomes, small event counts yield wide intervals even if total sample size seems large.

## Design and effect measure choice

In a cohort study with known denominators, RR is often directly estimable. In case-control sampling, the fraction of cases is set by design, so absolute risks and RRs cannot generally be estimated without additional population data; OR is estimable under sampling assumptions and can approximate RR when outcomes are rare. In cross-sectional studies, prevalence ratios may be more interpretable than prevalence odds ratios, but model choice and sampling design matter.

In randomized trials, logistic regression coefficients produce conditional ORs. Log-binomial or modified Poisson models can estimate RRs; standardization from logistic predictions can produce marginal risks and contrasts. Choice should align with estimand, model stability, and reporting. Do not interpret a conditional OR as a marginal RR.

## Confounding and adjustment

For observational comparisons, crude ratios can be confounded by common causes of treatment and outcome. Regression adjustment, standardization, weighting, or matching can address measured confounders under assumptions. The adjusted estimate’s target may differ: conditional OR, marginal RR, and standardized RD are not interchangeable. Identify the target population and adjustment set.

Odds ratios are non-collapsible: conditional and marginal ORs can differ even without confounding. A coefficient changing after covariate adjustment does not prove that confounding was removed. Standardized risks can provide marginal contrasts that are easier to interpret. Causal interpretation additionally needs exchangeability, positivity, consistency, and valid measurement.

## Sparse data and model choices

Zero or rare events create separation and unstable estimates in logistic regression. Continuity corrections can affect results, and exact or penalized methods may be needed. Firth logistic regression reduces small-sample bias for ORs but does not directly estimate an RR. Bayesian models can stabilize sparse estimates through priors; assess prior sensitivity.

For common outcomes, modified Poisson regression with robust variance is often used to estimate RRs, but convergence and boundary predictions should be checked. Log-binomial models directly target RR but can have convergence problems. Standardization from a flexible outcome model is another route, with uncertainty estimated via bootstrap or delta method.

## Conditional versus marginal measures

A conditional OR compares odds at fixed covariate values. A marginal OR compares population-average odds after averaging predicted risks. Non-collapsibility means they differ even in randomized data. For a risk ratio, conditional and marginal measures can also differ under effect heterogeneity. Report whether estimates are conditional or marginal and how standardized values were computed.

When communicating a policy effect, marginal risks and absolute differences usually describe population burden more directly. For etiologic modeling, conditional parameters may be relevant. Choose the measure by question rather than treating adjusted coefficients as universally interpretable.

## Time-to-event ratios

Hazard ratios compare instantaneous event rates among those still at risk, conditional on survival to each time. They are not risk ratios and can be difficult to interpret when proportional hazards fail. A hazard ratio of .70 does not imply 30% fewer people experience the event by a fixed time. Report survival or cumulative-incidence curves and fixed-horizon absolute risks where possible.

Competing events alter the risk estimand. Cause-specific hazards, subdistribution hazards, and cumulative incidence answer different questions. Crude risk ratios at a fixed horizon may be meaningful if follow-up is complete; otherwise use appropriate survival methods. State censoring and competing-event assumptions.

## Communicating relative and absolute effects together

If control risk is 2%, RR=.75 yields intervention risk 1.5%, an absolute reduction of .5 percentage points. If control risk is 20%, the same RR implies 15%, a 5-point reduction. Relative effects aid comparison across baseline risks, but absolute effects convey expected event counts. Use baseline risks appropriate to the target and show uncertainty.

Avoid statements like “risk was reduced by 25%” without specifying relative scale, comparator, event, and time. Say “risk ratio 0.75 (95% CI...), with estimated risks ... and difference ... over ...”. For ORs, name odds and avoid translating directly into risk changes unless baseline risk is used correctly.

### Odds-ratio conversion to an absolute risk

An odds ratio can be translated to a risk only when a baseline risk is known. If control risk is p0 and OR=θ, corresponding intervention risk under a simple common OR model is p1=θp0/(1−p0+θp0). For p0=.20 and θ=.70, p1=.14/(.80+.14)=.149, so the implied RR is .745 and RD is about −5.1 percentage points. The OR is not a 30% risk reduction.

If p0=.50 with the same OR, p1=.7(.5)/[.50+.7(.50)]=.35/.85=.412. The risk ratio is .824 and RD −8.8 percentage points. This illustrates that an OR’s risk interpretation depends on baseline risk. The common OR assumption may not hold across subgroups, and adjusted conditional ORs should not be applied indiscriminately to population risks.

Use baseline risk from a population relevant to the decision. If baseline risk is estimated with uncertainty, propagate it along with uncertainty in OR. For a model-based conversion, standardize predicted risks under each exposure condition rather than applying one coefficient to one baseline value when covariate distributions vary.

### Confidence intervals and sparse cells

For a log RR, estimate log(p1/p0) and use its standard error to construct an interval, then exponentiate. The log scale enforces positive bounds and often yields better coverage. The approximate variance uses event counts in denominators; when counts are small, its normal approximation is unreliable. Score intervals for risk ratios or profile-likelihood methods can improve performance.

For an OR from a 2×2 table, the Wald interval on log scale may fail when any cell is small or zero. Adding .5 to every cell is a continuity correction, not a neutral fix; different corrections yield different results and can bias sparse meta-analysis. Exact conditional methods condition on margins and answer a particular sampling question. Penalized likelihood or Bayesian estimation can stabilize estimates, but priors or penalties should be stated.

A nonsignificant interval that spans a wide range is inconclusive, not evidence of no effect. Report event counts by arm, not just the total sample. If a rare adverse event is central, plan sufficient follow-up and consider exact or hierarchical methods. Avoid emphasizing a relative ratio without showing the underlying absolute counts.

## Sample design and estimability

Case-control studies sample based on outcome status. The sample odds ratio estimates an exposure-outcome association under appropriate control sampling, but the sample proportion of cases is artificial. Absolute risk and risk ratio require source-population sampling fractions, incidence density methods, or external risk data. In nested case-control sampling, conditional logistic regression can estimate an incidence rate ratio under its design assumptions.

In cohort studies with censoring, a crude 2×2 table may misclassify people with short follow-up as non-events. Use survival analysis or fixed-horizon cumulative incidence with censoring methods. In cross-sectional samples, the measured quantity is prevalence; prevalence odds ratios may be far from prevalence ratios when conditions are common. Modified Poisson or log-binomial approaches can estimate prevalence ratios, but account for survey design where relevant.

Cluster sampling and cluster randomization induce correlation. Standard errors based on independent rows are too small. Use cluster-robust or multilevel methods and report number of clusters. A ratio point estimate may remain similar while interval width changes materially.

## Worked adjusted contrast through standardization

Suppose a logistic model predicts event risk from treatment, age, and baseline severity. To estimate a marginal RR, predict each participant’s risk as if treated and as if control, average predictions in the target sample, and divide the two averages. For a marginal RD, subtract them. This g-computation approach clarifies the target population and avoids interpreting the conditional regression coefficient as a population ratio.

~~~r
fit <- glm(event ~ treatment + age + severity,
           data = dat, family = binomial())
d1 <- transform(dat, treatment = 1)
d0 <- transform(dat, treatment = 0)
p1 <- mean(predict(fit, d1, type = "response"))
p0 <- mean(predict(fit, d0, type = "response"))
c(risk1 = p1, risk0 = p0, RR = p1 / p0, RD = p1 - p0)
~~~

In observational data, causal interpretation requires adequate confounder measurement, positivity, consistency, and correct model specification or a robust estimator. The standardization population is the analyzed sample unless an external target is supplied. Bootstrap at the patient or cluster level to obtain uncertainty and repeat the model fit in every replicate.

### Effect modification and scale

An effect can be homogeneous on one scale but heterogeneous on another. A constant RR implies larger absolute differences at higher baseline risks. A constant RD implies different RRs as baseline risk changes. Therefore, statements about “no interaction” depend on whether interaction is assessed on additive, multiplicative, or another scale. Select the scale based on clinical or scientific interpretation.

Subgroup estimates are often noisy. Compare effects directly with an interaction term or contrast, not by whether separate subgroup p-values cross .05. Prespecify subgroups, show absolute risks and intervals, and seek replication. Prediction of baseline risk is not evidence that treatment benefit differs; estimating individualized treatment effects requires causal design and separate validation.

### Confounding, mediation, and collider bias

A confounder is a common cause of exposure and outcome. Adjusting for measured confounders can help estimate a causal contrast under assumptions. A mediator lies on the pathway from exposure to outcome; adjusting for it removes part of the total effect and targets a direct effect under additional assumptions. A collider is caused by exposure and outcome or their causes; conditioning on it can create spurious association.

Automated covariate selection by p-value can include mediators or colliders and exclude important confounders. Choose adjustment variables from a causal model and study design. Report adjusted and unadjusted results when informative, but do not call one causal solely because it includes more variables. Sensitivity analyses for unmeasured confounding can show how strong an omitted factor would need to be to explain an association.

## Ratios in meta-analysis and evidence synthesis

Pooling log ratios is common because their sampling distributions can be approximately normal. Ensure studies use the same ratio type and event definition. Do not pool OR and RR as if identical, especially for common outcomes. If converting, state baseline risks and assumptions. Zero-event studies and multi-arm trials require methods that respect sparse data and dependence.

A pooled ratio should be translated into absolute outcomes using relevant baseline risks and uncertainty. Heterogeneity means the average may not apply to every setting. Show study-level estimates and prediction intervals where appropriate. Report whether a ratio is common, conditional, marginal, or random-effects average.

### Reporting checklist

State the event and time horizon; group risks and denominators; ratio type and direction; interval method; design and sampling; adjustment set; whether estimate is conditional or marginal; handling of zero cells, censoring, clustering, and missingness; and baseline risk used for absolute translation. Report risk difference where useful. Describe causal assumptions if making causal claims.

Use language that matches the scale. “Odds were lower” for an OR; “risk was lower” for an RR only with cumulative risk data and defined follow-up. Include units and confidence intervals. A ratio alone can obscure clinical magnitude and leave readers to infer an absolute effect that may not apply.

### Communicating effects without scale confusion

For a treatment study, a clear sentence might report that 15% of intervention participants and 22% of controls experienced an event by 30 days, corresponding to RR .68 and RD −7 percentage points. The interval around each contrast communicates sampling precision. If the outcome is common, avoid describing the OR of .63 as a 37% risk reduction. If a relative effect is the main result, translate it using a baseline risk relevant to the audience.

For observational studies, distinguish adjusted association from causal effect. Explain the source population, exposure definition, confounder strategy, and remaining assumptions. A statistically precise ratio can still be biased by unmeasured confounding or selection. Avoid causal verbs when design and assumptions support only association.

When follow-up differs, do not compare raw cumulative risks without addressing censoring. When competing events occur, state the risk definition and estimator. When participants have repeated events, distinguish risk of any event from event rate. These details determine whether the ratio answers the stated question.

### Reporting the numerical scale

The reference group and event direction should be explicit in tables and prose. For a ratio of .70, state which group is in the numerator and whether the event is desirable. If the event is recovery, a value below 1 can indicate less recovery, whereas for an adverse event it can indicate benefit. Use consistent coding across models and forest plots.

A relative effect can appear stable while baseline risk changes. Whenever possible show event counts, group risks, ratio, and absolute difference together. In subgroup communication, avoid presenting a common ratio as an individualized benefit estimate; individual benefit requires a causal framework and adequate data support. Report intervals and clarify whether they are adjusted, marginal, or conditional.

### Interval interpretation

A confidence interval for a ratio that includes 1 is compatible with no relative association under the model, but may also include clinically important benefit or harm. Do not report only whether it crosses 1. Compare its bounds with meaningful relative and absolute effects, and remember that systematic bias is not represented by the interval.

If the event is common, the odds ratio can differ substantially from the risk ratio; if risk is rare, the numerical approximation may be closer but still depends on design. Report actual risks rather than relying on a rare-outcome label alone.

### Avoiding denominator errors

Use the number at risk in each group as the denominator for cumulative risks. If follow-up differs, a crude event proportion may compare different observation windows and should not be labeled a risk ratio without qualification.

## References and further reading

- Greenland S, Pearl J, Robins JM. Causal diagrams for epidemiologic research. *Epidemiology*. 1999;10:37–48.
- Zhang J, Yu KF. What's the relative risk? A method of correcting the odds ratio in cohort studies of common outcomes. *JAMA*. 1998;280:1690–1691. [doi:10.1001/jama.280.19.1690](https://doi.org/10.1001/jama.280.19.1690).
- See [Absolute risk differences](absolute-risk-differences.html) for additive effects.
