---
title: Heterogeneity and publication bias
summary: Two threats to a meta-analysis — genuine differences between studies, and the missing studies that never made it into print.
---

## Overview

Heterogeneity describes differences among studies in their populations, interventions, outcomes, methods, or effect estimates. In evidence synthesis, the central question is not whether studies are identical, but whether differences alter the meaning of the combined result and what range of effects may apply across settings. Statistical heterogeneity is one part of this assessment; clinical and methodological differences must be examined directly.

Publication bias and selective reporting can make available evidence differ from all evidence conducted. Funnel plot asymmetry may indicate small-study effects, but does not prove publication bias. Heterogeneity and missing studies can coexist and influence each other. Review the clinical context, protocols, registries, and study methods before interpreting diagnostic plots or tests.

## Sources and consequences of heterogeneity

Clinical heterogeneity includes differences in patient severity, age, comorbidity, intervention dose, comparator care, follow-up, and outcome definition. Methodological heterogeneity includes design, measurement, risk of bias, and analytic adjustment. Statistical heterogeneity reflects variability in estimates beyond sampling error under a model. These dimensions are related but not interchangeable.

An average effect can be useful when studies estimate a common contrast in related settings. If a drug dose, target population, or endpoint differs substantially, an average may not answer a coherent clinical question. Random-effects models allow true effects to vary statistically, but do not explain variation or make incompatible studies comparable. Use the scientific question to determine whether to pool.

## Q, I-squared, and tau-squared

Cochran’s Q compares observed study estimates with the fixed-effect pooled estimate, weighted by within-study precision. Under homogeneity it is approximately chi-squared with k−1 degrees of freedom, though it has low power when few studies are available and can detect trivial variation when many precise studies exist. A nonsignificant Q does not establish homogeneity.

I² is often calculated as max(0,(Q−df)/Q)×100%. It estimates the proportion of observed variability attributed to between-study variation under the model. It is not the percentage of effects that are heterogeneous or a measure of clinical importance. I² depends on study precision and the number of studies.

Tau-squared (τ²) estimates between-study variance on the chosen effect scale. Its square root is the standard deviation of true effects. Interpret τ² in context: a standard deviation of 0.2 on log risk ratio implies a multiplicative spread of about exp(.2)=1.22 around the mean ratio. Estimation is uncertain with few studies; report method and sensitivity.

### Worked heterogeneity calculation

Suppose three studies have effect estimates y=(−.20,−.35,−.10) and fixed-effect weights w=(100,44.4,64). The weighted mean is approximately −.197. Q=Σw_i(y_i−mean)²≈1.25. With df=2, Q is below df, so conventional I² truncates to zero. This does not demonstrate identical effects; the dataset is small and imprecise, and clinically meaningful differences may remain plausible.

~~~r
yi <- c(-0.20, -0.35, -0.10)
wi <- c(100, 44.4, 64)
mu <- weighted.mean(yi, wi)
Q <- sum(wi * (yi - mu)^2)
df <- length(yi) - 1
I2 <- max(0, (Q - df) / Q) * 100
c(pooled = mu, Q = Q, df = df, I2 = I2)
~~~

The calculation assumes independent estimates and fixed-effect weights. In practice, use validated meta-analysis software and report τ² as well. For dependent effects or multi-arm trials, the covariance structure changes Q and pooled uncertainty.

## Estimating and explaining tau-squared

Common τ² estimators include DerSimonian–Laird, restricted maximum likelihood, and Paule–Mandel. Their behavior differs, particularly with few studies. The random-effects pooled mean weights studies by 1/(v_i+τ²); as τ² grows, weights become more balanced. This can increase small-study influence. Choose an estimator and interval method prospectively and conduct sensitivity analyses.

A prediction interval combines uncertainty in the mean with between-study variation. It approximates the range for a true effect in a new comparable study under the random-effects model. It is not a prediction for an individual patient and may be unreliable when few studies are available. A mean confidence interval can exclude the null while the prediction interval crosses it, indicating potential variation in direction across settings.

Explore sources of variation using prespecified subgroups or meta-regression only when the number of studies and data support it. A study-level association between mean age and effect is ecological; it does not establish patient-level age interaction. Avoid data dredging across many moderators. Explain whether findings are hypothesis-generating.

## Small-study effects and publication bias

Publication bias occurs when the availability or publication of studies depends on results. Selective outcome reporting within published studies creates a related problem. Small-study effects describe a pattern where smaller studies show systematically different effects, but causes include publication bias, design quality, intervention differences, and chance. Funnel plots visualize effect against precision; asymmetry is a signal to investigate, not a diagnosis.

Egger-type regression tests can detect asymmetry under assumptions, but have low power with few studies and can be misleading when heterogeneity exists. Begg rank tests and trim-and-fill also have limitations. Avoid applying tests mechanically or interpreting a nonsignificant result as evidence that bias is absent. Guidance often discourages these methods with very few studies.

Look for missing evidence directly: search trial registries, compare protocols with publications, examine conference abstracts, contact investigators, and assess funding and dissemination patterns. Use sensitivity analyses such as selection models only with clear assumptions. Report the plausibility of missing studies and how their potential results could alter conclusions.

## Forest and funnel plots

A forest plot shows individual estimates and confidence intervals, weights, pooled estimate, and sometimes prediction interval. Inspect direction, spread, overlap, and influential studies. A plot can reveal incompatible scales or outliers but cannot identify their causes. Ensure axes and labels are correct, and specify which direction favors each group.

A funnel plot places effect estimate against precision or standard error. Under no small-study effects, estimates often scatter symmetrically around the mean, with wider spread among less precise studies. True effect modification correlated with study size can create asymmetry without publication bias. When outcomes are rare, funnel plot behavior is especially difficult to interpret.

### Certainty and subgroup interpretation

Heterogeneity can reduce certainty when effects vary in ways not explained or applicable to the target. But high I² alone should not automatically downgrade evidence; inspect absolute magnitude, τ², prediction interval, and clinical differences. Conversely, low I² does not establish applicability if all studies share a bias or narrow population.

Subgroup comparisons should test interaction, not compare significance labels. If one subgroup has p<.05 and another p>.05, that is not evidence that effects differ. Prefer within-study interactions and prespecified hypotheses. Report effect estimates and intervals in each group, with numbers of studies and participants.

## Reporting publication-bias assessment

State which studies and reports were searched, whether registries and grey literature were included, and how selective reporting was assessed. If funnel plots or tests were used, state criteria and limitations. Do not use the phrase publication bias as a definitive conclusion from asymmetry alone. Explain alternative causes and sensitivity results.

Report heterogeneity measures alongside study-level effects and clinical descriptors. Give τ² method, I², Q with degrees of freedom, and prediction interval where appropriate. Show subgroup or meta-regression methods and their prespecification. Interpret how variation affects confidence and transport rather than treating a statistic as a pass/fail threshold.

## Subgroup analysis without ecological overreach

A subgroup analysis asks whether an effect differs across categories such as age group, disease severity, dose, or design. The key quantity is an interaction or difference between subgroup effects. Separate pooled estimates can be shown, but one significant and one nonsignificant result does not demonstrate a difference. Use within-study interactions where possible, since between-study comparisons confound subgroup with study characteristics.

Study-level meta-regression relates effect estimates to study averages or design attributes. If trials with higher mean age show smaller effects, this does not prove older individuals benefit less; the association may reflect dose, setting, or risk of bias. Individual participant data meta-analysis can evaluate person-level interactions more directly, but still needs adequate information, comparable data, and prespecified analyses.

The number of studies limits moderator analyses. With a handful of trials, a multivariable meta-regression is overfit and estimates are unstable. Choose a small number of clinically motivated modifiers, show scatterplots and intervals, and label findings exploratory. Correcting for multiple hypotheses may be relevant, but transparency and replication are more important than a mechanical p-value adjustment alone.

### Outliers and influential studies

An outlying study has an estimate far from others; an influential study materially changes the pooled result when removed. These are not necessarily erroneous. Differences may be real because of population, intervention intensity, follow-up, or bias. Verify extraction, inspect design and risk of bias, and compare methods before excluding a study.

Leave-one-out analysis recalculates the pooled effect after omitting each study. Baujat plots or influence diagnostics can identify studies contributing to heterogeneity and pooled effect. Report these as diagnostics, not a license to remove inconvenient studies. If one trial drives the conclusion, state that fragility and explore whether its methods or context justify different weight or interpretation.

Robust variance methods can reduce sensitivity to model assumptions but cannot solve sparse evidence or severe incompatibility. Bayesian hierarchical models can regularize τ², but results may depend on priors with few studies. Present the assumptions and sensitivity, especially when policy depends on the pooled estimate.

### Small-study effects: a worked interpretation

Suppose a funnel plot shows that small trials report larger benefits while large trials cluster near a modest effect. This pattern could arise because small positive studies are more likely to be published; it could also arise because small trials used higher doses, enrolled more severe patients, or had weaker allocation concealment. Funnel asymmetry alone cannot distinguish these causes.

A practical assessment combines methods: compare trial registry outcomes with publications; examine effect by sample size and risk of bias; check whether intervention intensity differs; search abstracts and theses; and model plausible missing-study scenarios. If the conclusion changes substantially under a reasonable selection model, report that fragility. If asymmetry is absent, selective outcome reporting may still exist, especially for secondary outcomes.

The Egger regression tests association between standardized effects and precision. Its assumptions can fail when effect measures are bounded or heterogeneity is substantial. With fewer than about ten studies, the test is typically uninformative. Even beyond that, a low p-value is evidence of asymmetry, not proof of publication bias. Interpretation requires study context.

## Heterogeneity across outcome scales and designs

Different effect measures can produce apparent heterogeneity. An odds ratio is non-collapsible and diverges from a risk ratio as outcomes become common; converting studies to a common scale may require baseline risks and assumptions. Mean differences can vary with measurement scale; standardized mean differences depend on within-study variability. Hazard ratios can vary with time and proportional-hazards departures.

A synthesis should not pool randomized and observational estimates without considering confounding and target differences. Design subgroups can be informative, but the studies may estimate different causal quantities. Sensitivity analyses restricted by design or risk of bias help reveal dependence. A model with design as a moderator cannot eliminate unmeasured differences.

Network meta-analysis adds indirect comparisons. Transitivity requires that effect modifiers be similarly distributed across comparisons; inconsistency signals disagreement between direct and indirect evidence. Rank probabilities may look decisive despite wide uncertainty. Report comparative effects, intervals, certainty, and assumptions rather than league tables alone.

## Heterogeneity in diagnostic accuracy reviews

Sensitivity and specificity vary with threshold and participant spectrum. A bivariate random-effects model can represent correlated sensitivity and specificity and between-study variation. A summary ROC curve describes a threshold relationship; a single pooled sensitivity and specificity may not correspond to any usable threshold. Differences in reference standard, verification, and case mix can dominate statistical heterogeneity.

Funnel plots for diagnostic accuracy require special methods and are difficult to interpret. Small studies may use different thresholds or patient spectra, which creates asymmetry. Publication bias assessment should consider study selection and selective threshold reporting directly. Report threshold definitions and test versions.

### Absolute interpretation across settings

A heterogeneous relative effect can yield very different absolute benefits across baseline risks. If RR varies from .6 to .9 across settings, the difference is not captured by a single average RR. Translate study or prediction-interval bounds using plausible baseline risks and clearly state assumptions. This can show whether treatment decisions are robust across contexts.

Do not combine baseline risk from one setting with a pooled relative effect without checking compatibility. The risk reduction may vary due to adherence, co-interventions, competing events, and outcome ascertainment. Use local data or external evidence for baseline risk and consider calibration. If impact varies substantially, a universal recommendation may not follow from an average meta-analysis.

### Statistical and clinical importance

A large I² can occur when study effects differ by small amounts but are precisely estimated; a low I² can occur with few imprecise studies. Focus on τ² and prediction intervals in units clinicians understand, along with study differences. Ask whether plausible effects across settings would change a decision. If not, heterogeneity may be statistically detectable but not decision-relevant.

Conversely, a moderate τ² may matter if some settings have benefit and others harm. Explore credible effect modifiers and avoid claiming one average applies everywhere. The goal is not to eliminate heterogeneity but to understand its implications and communicate the range of evidence.

## Reproducible assessment workflow

Before analysis, specify effect measure, random-effects estimator, interval method, heterogeneity measures, subgroup hypotheses, and publication-bias methods. Record the order of studies and data transformations. Generate plots from the analysis code and check labels and directions. Preserve all eligible studies in primary analyses unless a principled criterion excludes them.

Report which sensitivity analyses were prespecified, which were added after seeing results, and why. Make extracted data and scripts available where allowed. Readers should be able to trace a pooled estimate to source data and understand how heterogeneity and missing evidence affect the conclusion.

## Communicating the result

A balanced conclusion states the pooled mean, between-study variation, prediction interval if credible, clinical differences, risk of bias, and plausible missing evidence. It explains whether the average is relevant to a target setting and what uncertainty remains. Avoid reducing the synthesis to “I² was high” or “the funnel plot was symmetric.”

Where uncertainty is large, identify what new evidence would help: trials in underrepresented populations, standardized outcome measurement, larger pragmatic studies, or individual participant data. Recommendations may need local adaptation rather than a single universal effect assumption.

### Evidence that may be missing

Outcome reporting can be selective even when every trial is published. Compare protocols, statistical analysis plans, registry entries, abstracts, and final reports for changed outcomes, time points, or analyses. A study may report a favorable scale while omitting another prespecified measure. Assess this at the outcome level and explain how unavailable results affect confidence.

Funding and sponsorship can be associated with study design and dissemination, but funding source alone does not prove bias. Examine comparator choice, outcome definitions, analysis population, publication timing, and data access. Include non-commercial and unpublished evidence where possible. Grey-literature inclusion can reduce dissemination bias but may introduce reports with insufficient methods; risk of bias should be evaluated consistently.

Selective availability can also occur through language restrictions or inaccessible full text. State restrictions and reasons. If studies in a language or region are excluded, consider whether effects, interventions, or standard care may differ. A search that excludes unpublished evidence should not claim exhaustive certainty about the evidence base.

## Worked prediction-interval interpretation

Suppose a random-effects model estimates a mean log RR of −0.20 with τ=.25. A rough 95% prediction range for a new study’s log effect is mean ±1.96τ, or −0.69 to .29, before accounting for uncertainty in the mean and τ. Exponentiating gives RR about .50 to 1.34. The average effect favors intervention, but a new setting could plausibly show little benefit or harm under this illustrative model. A proper prediction interval includes uncertainty in estimated heterogeneity and may be wider.

This calculation demonstrates why average-effect confidence intervals and prediction intervals answer different questions. The numerical range is not reliable with few studies or a poorly estimated τ. Show the observed study effects and explain which settings are considered comparable. Do not promise that the interval covers an individual patient’s response.

## References and further reading

- IntHout J, Ioannidis JPA, Rovers MM, Goeman JJ. Plea for routinely presenting prediction intervals in meta-analysis. *BMJ Open*. 2016;6:e010247. [doi:10.1136/bmjopen-2015-010247](https://doi.org/10.1136/bmjopen-2015-010247).
- Page MJ, Higgins JPT, Sterne JAC. Assessing risk of bias due to missing results in a synthesis. In: *Cochrane Handbook for Systematic Reviews of Interventions*.
- See [Systematic reviews](systematic-reviews.html) for search and selection methods.
- Higgins JPT, Thompson SG. Quantifying heterogeneity in a meta-analysis. *Statistics in Medicine*. 2002;21:1539–1558. [doi:10.1002/sim.1186](https://doi.org/10.1002/sim.1186).
- Sterne JAC, Sutton AJ, Ioannidis JPA, et al. Recommendations for examining and interpreting funnel plot asymmetry in meta-analyses of randomised controlled trials. *BMJ*. 2011;343:d4002. [doi:10.1136/bmj.d4002](https://doi.org/10.1136/bmj.d4002).
- See [Meta-analysis and forest plots](meta-analysis-and-forest-plots.html) for pooling and prediction intervals.
