---
title: Meta-analysis and forest plots
summary: Combining the results of several comparable studies into one pooled effect estimate, shown study by study on a forest plot.
---

## Overview

Meta-analysis combines quantitative results from multiple studies to estimate a summary effect and its uncertainty. It is a component of evidence synthesis, not a mechanical average. Before pooling, determine whether studies address a sufficiently compatible question and whether their estimates can be expressed on a common scale. A precise pooled estimate can be misleading if it combines different populations, interventions, outcomes, or biases.

A forest plot displays study estimates and intervals alongside a pooled result, but the diamond is only meaningful under the chosen model and assumptions. Pooling can improve precision when studies estimate a common or interpretable distribution of effects; it cannot repair poor study conduct or create comparability that is absent.

## Effect scales and within-study uncertainty

For a binary outcome, studies may report risk ratios, odds ratios, or risk differences. For continuous outcomes, mean differences require a common scale; standardized mean differences can combine different instruments but change interpretation. Time-to-event studies may report hazard ratios. Do not combine incompatible measures without justified transformation.

Most conventional meta-analyses operate on a scale with approximately normal sampling behavior, such as log risk ratio or log odds ratio. Each study contributes an estimate y_i and within-study variance v_i. In a fixed-effect model, weight w_i=1/v_i. The pooled estimate is Σw_i y_i / Σw_i, with variance 1/Σw_i. This assumes one common underlying effect and only sampling error differs.

### Worked inverse-variance calculation

Suppose two independent studies report log risk ratios −0.20 (SE .10) and −0.35 (SE .15). Their fixed-effect weights are 100 and 44.4. The pooled log ratio is [100(−.20)+44.4(−.35)]/144.4≈−.246. Exponentiating gives RR≈0.78. The standard error is sqrt(1/144.4)=.083; a rough 95% interval on the log scale is −.246±1.96(.083), or −.409 to −.083, which exponentiates to about .66 to .92.

This estimate assumes a common effect, independent study estimates, comparable outcome definitions, and valid reported variances. With only two studies, heterogeneity is difficult to estimate. The arithmetic is straightforward; deciding whether these trials should be combined is the scientific task.

~~~r
yi <- c(-0.20, -0.35)
sei <- c(0.10, 0.15)
wi <- 1 / sei^2
mu <- sum(wi * yi) / sum(wi)
se_mu <- sqrt(1 / sum(wi))
exp(c(estimate = mu, lower = mu - 1.96 * se_mu,
      upper = mu + 1.96 * se_mu))
~~~

This example calculates a fixed-effect log risk ratio and exponentiates the estimate and interval. For real analyses, confirm effect direction, variance formula, study independence, and zero-event handling. Use software with methods suitable to the data structure and report its estimator.

## Fixed-effect and random-effects models

A fixed-effect model assumes a common true effect across studies; observed differences arise from sampling error. A random-effects model assumes study effects vary around a mean with between-study variance τ². Under a random-effects model, weights are typically 1/(v_i+τ²), so small studies receive relatively more weight than under fixed effect. The mean describes the average of a distribution of effects, not necessarily the effect in any particular setting.

Random-effects models do not solve clinical heterogeneity. If studies differ in intervention definition or target population, a pooled mean may lack a coherent interpretation. τ² is uncertain, especially with few studies, and the pooled interval can understate uncertainty if estimation method is unsuitable. Report τ², method for estimating it, and prediction interval when meaningful.

A prediction interval estimates the range in which a true effect in a new comparable study may lie under the model. It is often wider than a confidence interval for the mean and may include no effect even when the pooled mean interval excludes zero. It depends on the random-effects assumptions and should not be read as a guarantee for every future site.

## Heterogeneity and forest plots

Clinical heterogeneity concerns populations, interventions, comparators, outcomes, and follow-up. Methodological heterogeneity concerns design and bias. Statistical heterogeneity describes variability beyond sampling error. I² estimates the proportion of observed variability attributed to between-study variation, but it depends on precision and number of studies and does not measure clinical importance. τ² describes variance on the analysis scale.

Forest plots should include study labels, effect estimates, confidence intervals, sample sizes or weights, pooled estimate, and an axis showing no effect. Use consistent direction: specify which group is favored. For rare outcomes, zero-event studies require careful handling; excluding them can discard information, while continuity corrections can influence results. Select methods based on estimand and design.

A forest plot is not evidence that pooling is appropriate. If effects differ in direction, outcome definitions, or patient populations, show study results without a pooled diamond or synthesize narratively. Explain the decision.

## Prediction intervals and absolute translation

A relative effect is not directly an absolute benefit. If baseline risk is 20% and pooled RR=.78, the corresponding risk is approximately 15.6%, an absolute reduction of 4.4 percentage points. At baseline risk 4%, expected risk is about 3.1%, a reduction near 0.9 points. These translations assume the relative effect applies to the target population and that follow-up aligns.

Report absolute effects for meaningful baseline risks, with uncertainty. A pooled estimate may apply to trial populations but not a local population with different care, adherence, or outcome risk. Do not present one NNT as universal. Use prediction intervals to illustrate between-setting variation when the model and study set support it.

## Dependence and multi-arm studies

Standard formulas assume independent study estimates. Multi-arm trials share a control group; treating each comparison as independent double counts participants and understates uncertainty. Combine intervention arms when scientifically appropriate, split control counts cautiously, or use multivariate models. Multiple outcomes or follow-up times from the same study are correlated and may require robust variance estimation or multilevel models.

Cluster-randomized trials may report estimates adjusted for clustering. If not, effective sample size or variance correction needs an intraclass correlation and average cluster size. Crossover and paired designs also require their covariance structure. Record how each study estimate and variance were derived.

## Sensitivity analyses and influence

Check influence by omitting one study at a time, restricting to low-risk-of-bias studies, varying effect-measure and heterogeneity estimators, and examining assumptions for missing summary data. Sensitivity analysis should be motivated, not used to find a preferred result. If conclusions change substantially, report that fragility.

Small-study effects and publication bias can distort pooled results. Funnel asymmetry can arise from heterogeneity or chance and is not definitive proof of missing studies. Compare protocols and registries, search grey literature, and use selection-model or trim-and-fill methods only with clear limitations. Certainty assessment includes publication bias among other domains.

## Reporting a synthesis

State review question, eligibility, effect measure, model, τ² estimator, interval method, prediction interval, and heterogeneity measures. Provide forest plot data and code where possible. Explain whether pooling was prespecified and why studies were considered compatible. Report risk of bias and certainty, not only statistical heterogeneity.

For each result, identify study populations and follow-up. Distinguish fixed-effect common-effect estimates from random-effects averages. Translate relative effects into absolute outcomes using baseline risk and state assumptions. Do not equate statistical significance with certainty, clinical importance, or policy recommendation.

### Calculating study estimates and standard errors

For a 2×2 study with a events among n1 intervention participants and c among n0 control participants, estimated log risk ratio is log[(a/n1)/(c/n0)]. A common large-sample variance is 1/a−1/n1+1/c−1/n0. This approximation can be unstable with sparse or zero cells; exact likelihood methods, generalized linear mixed models, or other approaches may be preferable. Continuity corrections add constants and can meaningfully affect rare-event synthesis.

For an odds ratio, log OR = log[ad/bc] for table cells a,b,c,d, with approximate variance 1/a+1/b+1/c+1/d. Odds ratios are not risk ratios, particularly when outcomes are common. For a continuous mean difference, the variance is s1²/n1+s0²/n0. Standardized mean differences divide the mean difference by a pooled standard deviation and have small-sample correction choices. Confirm whether published intervals are adjusted and which standard error they imply.

When studies report medians and ranges but not means and SDs, conversions may assume distributional shape. Extract raw summaries and use validated methods if conversion is necessary. Perform sensitivity analyses excluding converted studies. Do not impute a common SD without evidence; that can fabricate precision and change weights.

### Heterogeneity estimation and small-study uncertainty

The DerSimonian–Laird estimator is common but can underestimate τ², especially with few or unevenly sized studies. Restricted maximum likelihood and Paule–Mandel are alternatives; Hartung–Knapp-type intervals can better reflect uncertainty in the mean under some conditions, though variants can behave poorly with very few studies. Choice should be prespecified and justified. Report estimator and software implementation.

I² is often computed from Cochran’s Q, but it is not a proportion of causal effect variation and can be large in precise studies for small absolute τ². Conversely, low I² in a handful of imprecise studies does not prove homogeneity. Interpret τ² on a clinically meaningful scale and examine study estimates, prediction intervals, and context.

With only two studies, between-study variance is weakly identified. A random-effects point estimate may be produced, but inference about the distribution of true effects is unreliable. Present both study results and be cautious about average-effect claims. If an intervention differs substantially across the two studies, synthesis may not be meaningful at all.

## Dependence, multiple outcomes, and multilevel structure

A study may contribute several effects: multiple treatment arms, outcomes, time points, or subgroups. These are correlated. Selecting one outcome after seeing results can bias the synthesis; treating all effects as independent underestimates standard errors. Prespecify a hierarchy, combine outcomes only when justified, or use multivariate or robust-variance methods with enough studies.

For multi-arm trials, if two intervention arms share one control, the two log ratios are correlated. Combining clinically similar intervention arms avoids double counting; splitting the control sample can be an approximation but changes variance. Network meta-analysis models direct and indirect comparisons jointly and requires transitivity and consistency assumptions; it is not a simple extension of pairwise pooling.

Repeated follow-up estimates also depend on time. Pooling a 3-month effect with a 2-year effect may blur changing efficacy or harms. Select a clinically meaningful time point or model the trajectory. Report any imputation or selection among timepoints.

### Worked absolute-risk translation

Suppose pooled RR=.78 with a 95% interval .66 to .92. At a target baseline risk of 20%, the point estimate implies treated risk .156 and RD=−.044, or 4.4 fewer events per 100. Translating interval endpoints yields treated risks .132 to .184 and absolute reductions from 6.8 to 1.6 points, if baseline risk is fixed and RR transports. Uncertainty in baseline risk would widen the absolute-effect uncertainty.

At a 4% baseline risk, point treated risk is .0312 and RD=−.0088, less than one event prevented per 100. Thus a constant relative effect does not imply constant absolute benefit. If baseline risk varies across patients, use a distribution or strata rather than presenting a single population average without context.

These calculations assume the relative effect applies, follow-up is comparable, and event definitions match. For odds ratios, converting directly as if they were risk ratios is incorrect; use the baseline odds transformation. For hazard ratios, absolute risk needs baseline survival and proportional-hazards assumptions, and competing risks may require cumulative incidence methods.

### Rare outcomes and zero-event trials

When both study arms have zero events, the study provides little information about a relative effect but may inform absolute safety if sample size and follow-up are adequate. Excluding double-zero studies is common for log-ratio estimators, but they may matter in risk-difference analyses or hierarchical likelihood approaches. Single-zero studies can be sensitive to continuity correction. State the approach and conduct sensitivity analyses.

For rare events, Peto odds ratio methods rely on assumptions such as balanced allocation and small effects. Generalized linear mixed models or beta-binomial approaches may be alternatives, but small numbers of studies challenge estimation. Do not select a method solely because it includes more studies or produces statistical significance.

### Forest plot construction and audit

A forest plot should make study weights, effect direction, null value, and uncertainty legible. Use a logarithmic axis for ratios and a linear axis for differences. Label which direction favors each intervention. Do not truncate confidence intervals without indicating it. Plot study names and sample sizes; include the pooled estimate and, for random effects, prediction interval when interpretable.

Audit plotted values against extraction tables and analysis output. Check row ordering, sign reversal, unit conversion, and whether a confidence interval corresponds to the right endpoint. For multi-arm studies, ensure shared comparators are handled. A visually persuasive plot cannot compensate for incorrect extraction or a mismatched effect measure.

## Publication bias and selective availability

Meta-analysis conditions on studies that were found and reported. Unpublished null findings, selective outcome reporting, and delayed publication can skew the evidence. Search registries and protocols, compare prespecified outcomes with publications, and contact authors. Funnel plot asymmetry tests have low power with few studies and can flag heterogeneity rather than publication bias.

Sensitivity methods such as selection models make assumptions about the probability of publication. Trim-and-fill is exploratory and can misrepresent asymmetry. Present the evidence for missingness and how conclusions change under specified scenarios. Do not claim that a nonsignificant asymmetry test rules out publication bias.

## Evidence synthesis and interpretation

A random-effects average may describe the mean of effects in included settings, but a future hospital may lie outside that distribution. Prediction intervals require comparable studies and reasonable τ² estimates. If effect modifiers are known, explain how the target setting differs. A subgroup or meta-regression may help but is ecological and underpowered with few studies.

Risk-of-bias judgments should inform interpretation. A pooled estimate dominated by high-risk studies should not be presented as definitive. Sensitivity analyses restricted to lower-risk studies can show dependence, but may be imprecise. Certainty assessment additionally considers inconsistency, indirectness, imprecision, and publication bias.

## Reproducible analysis workflow

Maintain extraction tables with one row per estimate and links to source location. Store the formula used for each transformed effect and variance. Use code to generate pooled estimates and plots from the same analysis dataset. Record package versions, estimator choices, and random seeds for resampling. Have another analyst verify key values and reproduce the primary result.

The review should distinguish protocol decisions from post hoc choices. Report all major outcomes and models examined, explain deviations, and make analysis code available where licensing permits. This prevents selective presentation and supports future updates.

### Choosing between pooled and unpooled summaries

Pooling is most defensible when studies share a clinical question and the effect measure refers to a common contrast. Differences in dose, duration, control care, severity, and follow-up may make the average hard to interpret. A random-effects model allows true effects to vary statistically; it does not explain why they vary or guarantee that the included settings represent the target.

If studies are too different, present a structured table, forest plot without a pooled diamond, and narrative account of effect size and certainty. Avoid vote counting by whether confidence intervals exclude the null. A small, imprecise study may have a clinically important estimate; a large study may be precise but indirect. Describe patterns without implying a single combined parameter.

A prediction interval combines uncertainty in the mean with estimated between-study variation. It may cross the null even when the pooled mean interval does not, signaling that effects in some comparable settings could differ in direction. With few studies, both τ² and the prediction interval are unstable; show the study estimates and avoid false precision.

For each pooled outcome, identify the studies and follow-up contributing to the estimate. If outcomes are selectively unavailable, show how many studies could not contribute and why. A forest plot and analysis table should be reproducible from the extracted dataset, with transformations documented.

State whether the summary estimates a common effect or the mean of a distribution of effects, and identify the population of studies to which that summary might apply.

Do not let the choice of pooling model substitute for clinical judgment about comparability.

Explain why studies were grouped or separated and how that decision affects the clinical interpretation of the result.

When absolute effects are communicated, use baseline risks that represent the intended population and preserve uncertainty in both relative effects and baseline risk.

Make the analytical choices legible enough that an independent team can reproduce the synthesis.

State all software and model options that materially affect estimates.

Include data and code where permissions allow.

## Weight is not study quality

Inverse-variance weight reflects statistical precision under the model, not freedom from bias or clinical importance. A large biased study can dominate a pooled estimate; interpret weights alongside design and risk of bias.

## References and further reading

- Deeks JJ, Higgins JPT, Altman DG, editors. *Cochrane Handbook for Systematic Reviews of Interventions*. [Chapter 10: Analysing data and undertaking meta-analyses](https://training.cochrane.org/handbook/current/chapter-10).
- DerSimonian R, Laird N. Meta-analysis in clinical trials. *Controlled Clinical Trials*. 1986;7:177–188. [doi:10.1016/0197-2456(86)90046-2](https://doi.org/10.1016/0197-2456(86)90046-2).
- See [Heterogeneity and publication bias](heterogeneity-and-publication-bias.html) for τ², prediction, and small-study effects.
