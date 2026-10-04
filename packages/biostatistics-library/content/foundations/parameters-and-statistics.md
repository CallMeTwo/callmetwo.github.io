---
title: Parameters and statistics
summary: A parameter is a fixed population quantity; a statistic is the number computed from a sample that estimates it.
---

## Overview

A parameter is a quantity that describes a defined population or data-generating process; a statistic is calculated from observed data. Researchers use statistics to learn about parameters, but the numerical estimate is meaningful only after its target is clear. The target could be a population mean, a treatment effect under assignment, a prevalence at a specified date, or the proportion of future patients whose risk exceeds a threshold. Different sampling schemes and analysis choices can make the same statistic estimate different targets.

The distinction is foundational because statistical uncertainty belongs to the procedure that generated the estimate. If we repeatedly drew samples under the same design, the statistic would vary. Its sampling distribution describes this variation, its standard error measures spread, and inferential procedures use that distribution to quantify compatibility with target values. A standard error does not account automatically for measurement error, confounding, selection, or model misspecification.

## Define the target before choosing the calculation

A parameter needs a population, outcome, time, and summary operation. “Average blood pressure” is incomplete until we know which people, whether pressure is baseline or follow-up, how repeated readings are combined, and what population the average is intended to represent. For intervention research, an estimand further specifies the treatment conditions being compared and how events such as discontinuation, rescue therapy, or death enter the outcome.

Suppose a randomized trial compares assignment to a new antihypertensive strategy with usual care. The treatment-policy estimand compares outcomes by randomized assignment regardless of adherence. A hypothetical estimand may ask what the contrast would have been had everyone remained on assigned therapy. These are distinct parameters. Randomization directly supports the first comparison, while the second requires additional modeling assumptions because adherence after randomization is related to prognosis.

The estimand determines the statistic. A difference in sample means estimates a difference in population means under a simple random sample or randomized comparison with complete outcomes. A weighted mean may be needed under unequal-probability sampling. A regression coefficient can estimate a conditional association, while standardized predictions can target a marginal contrast. The analysis should explain why its statistic corresponds to the stated target.

## Statistics vary from sample to sample

Let Y1,...,Yn be independent observations from a population with mean μ and variance σ². The sample mean is Ybar = (1/n)ΣYi. It is unbiased for μ under this sampling model, and its variance is σ²/n; therefore its standard error is estimated by s/√n. Increasing sample size reduces random error at a square-root rate: quadrupling n halves the standard error. This gain assumes that observations are independent and sampled from the target population. Repeated observations per patient or cluster sampling alter the variance.

A statistic can be biased even when calculated without arithmetic error. If a clinic estimates disease prevalence only among patients who returned for follow-up, the observed proportion may miss people who moved, became too ill, or lacked access. The statistic then describes respondents; it estimates population prevalence only if the selection mechanism and adjustment support that inference. A large sample reduces sampling variability around the wrong target, not systematic bias.

A ratio statistic illustrates why estimator properties can be subtle. A sample proportion is a ratio of event count to sample size and is unbiased under simple binomial sampling. A ratio of two estimated totals, such as cost per quality-adjusted life-year, is generally not exactly unbiased in finite samples and can have a skewed distribution. The method for uncertainty must match the statistic rather than defaulting to a symmetric normal interval.

## A worked estimation example

Consider a random sample of 100 adults from a defined clinic population. Their mean systolic pressure is 132 mmHg and standard deviation is 16 mmHg. Under independent, approximately representative sampling, the standard error of the mean is 16/√100 = 1.6 mmHg. A t-based 95% interval is approximately 132 ± 1.984(1.6), or 128.8 to 135.2 mmHg. This interval quantifies repeated-sampling uncertainty under the assumptions; it does not include uncertainty caused by nonresponse or measurement calibration.

The calculation in R is:

```r
x <- clinic$sbp
x <- x[!is.na(x)]
n <- length(x)
mean_x <- mean(x)
se_x <- sd(x) / sqrt(n)
ci <- mean_x + c(-1, 1) * qt(.975, df = n - 1) * se_x
c(n = n, mean = mean_x, se = se_x, lower = ci[1], upper = ci[2])
```

The code silently treats remaining records as an independent sample and reports a complete-case mean. For cluster samples, use design-based variance estimation; for repeated observations, define a patient-level summary or fit a model that accounts for within-person dependence. If 20% of eligible patients have no measured pressure and their outcomes differ from respondents, the interval above is too narrow as a statement about the full clinic population because it covers only sampling variation among observed records.

An estimate should be judged against meaningful values as well as zero. A mean pressure of 132 may be precisely estimated but not answer whether the clinic meets a treatment target, whether the distribution has a high-risk tail, or whether a policy reduced pressure. A parameter is a summary; it does not fully describe a population distribution.

## Estimators and their trade-offs

An estimator is a rule that maps data to a statistic. Different estimators target the same parameter with different properties. The sample mean is efficient under normal sampling but sensitive to extreme values. The median is robust to large tails but estimates a different population feature and may have less precision under symmetric normal data. A trimmed mean trades some tail sensitivity for a target between the mean and median. Selection should follow the scientific question and data-generating process rather than a rule that one summary is universally robust.

For a proportion near zero or one, the Wald interval p-hat ± 1.96√[p-hat(1−p-hat)/n] can have poor coverage and even extend outside [0,1]. Score-based Wilson intervals generally behave better, and exact binomial intervals may be appropriate when events are very rare, though conservatism and interpretation should be understood. For small samples, use methods matched to the sampling distribution rather than relying automatically on large-sample approximations.

Regression estimators introduce additional choices. In linear regression, the coefficient for a continuous predictor describes a conditional mean change per unit under the specified model. In logistic regression, the coefficient is a conditional log odds ratio; exponentiating it yields an odds ratio, not a risk ratio. Adjusted and unadjusted estimates can differ because of confounding, non-collapsibility, or both. To report a marginal risk difference, one may predict each participant's outcome under each treatment and average those predictions, provided the causal assumptions and model are suitable.

Weights can correct known unequal inclusion probabilities or improve standardization to a target population, but extreme weights increase variance and small effective sample size. Trimming weights changes the procedure and can change the target or introduce bias. Report how weights were constructed, inspect their distribution, and compare reasonable sensitivity analyses. Robust variance estimates do not eliminate bias if the inclusion mechanism is misunderstood.

## Confidence intervals, tests, and practical meaning

A confidence interval is produced by a procedure that, under its assumptions, covers the fixed parameter at the stated long-run rate. A 95% interval is not a probability distribution over the parameter after the data are observed. Bayesian credible intervals do have a posterior probability interpretation conditional on the model and prior, but they answer a different inferential framework. Both kinds of intervals depend on model assumptions and data quality.

A p-value measures how incompatible the observed statistic, or something more extreme, is with a specified null model. It is not the probability the null is true, the probability results occurred by chance, or a measure of effect importance. Report estimates and intervals so readers can see direction, magnitude, and precision. When many outcomes or analyses are explored, the interpretation of nominal p-values changes because the search itself creates opportunities for chance findings.

Consider a treatment difference estimated at −5 mmHg with a 95% interval from −8.5 to −1.5. The interval excludes zero under the analysis model, yet clinical judgment still asks whether a reduction of 1.5 mmHg at the least favorable end is worthwhile given adverse effects and cost. If instead the interval were −11 to 1, the data would be compatible with meaningful benefit and little or no effect; a nonsignificant test would not prove no effect. For equivalence, a clinically justified margin must be prespecified and the whole interval must satisfy the decision criterion.

## Missingness, selection, and uncertainty beyond the standard error

Sampling uncertainty is only one component of uncertainty. Measurement error, missing outcomes, selection into a study, and uncertain model structure may dominate the reported standard error. A complete-case statistic can be unbiased under special conditions, but is not automatically representative. Multiple imputation addresses missing values under an explicit model, commonly a missing-at-random assumption conditional on included variables. Sensitivity analyses can assess plausible departures from that assumption.

For an observational treatment comparison, the adjusted statistic estimates a causal contrast only if confounding is controlled, consistency and positivity are plausible, and selection and measurement are adequately addressed. A very narrow confidence interval does not rescue a violated identification assumption. Distinguish statistical uncertainty that an interval quantifies from systematic uncertainty that requires design knowledge, sensitivity analysis, external validation, or replication.

## Reporting the estimand and its estimate

A transparent result identifies the target population, outcome definition, follow-up time, effect scale, estimator, adjustment set or weighting procedure, missing-data approach, and uncertainty method. State whether an effect is marginal or conditional and name the reference group and units. Report denominators and exclusions so a reader can reconstruct the analysis population. For weighted or clustered samples, describe the design variables and variance method.

When a point estimate is transformed, explain the transformation. A coefficient on the log scale, exponentiated odds ratio, standardized risk difference, and absolute risk all represent related but not interchangeable summaries. If an estimate is intended for a different target population than the observed sample, show the standardization or transport assumptions and identify regions with little data support.


## Design-based inference and finite populations

Inference can be grounded in a sampling design rather than a probability model for outcomes. In a probability sample, each unit has a known, nonzero inclusion probability. The Horvitz–Thompson estimator of a population total is the sum of each observed outcome divided by its inclusion probability. Dividing an estimated total by an estimated population size yields a ratio or Hájek estimator of a mean. These weighting rules restore representation under unequal sampling probabilities, but their uncertainty depends on the actual design, including stratification, clustering, and without-replacement sampling.

For example, a health survey may deliberately sample rural residents at twice the rate of urban residents. The unweighted sample proportion is not generally the national prevalence. If rural and urban inclusion probabilities are 0.04 and 0.02, their inverse-probability weights are 25 and 50. The weighted prevalence is the weighted event count divided by total weight. Variance calculations must retain design strata and primary sampling units; treating all weighted rows as independent usually understates uncertainty. Nonresponse adjustments may improve representation when response propensities are modeled adequately, but do not guarantee correction for unmeasured differences between respondents and nonrespondents.

Finite-population correction can matter when a substantial fraction of a small population is sampled without replacement. If 80 of 100 eligible clinics are sampled, sampling variability for the finite-population mean is smaller than if the same 80 clinics were sampled from a very large superpopulation. The correction factor for a simple random sample is approximately sqrt((N−n)/(N−1)). Analysts should clarify whether inference concerns the finite list itself or a broader process of future clinics; those are different targets and may not warrant the same correction.

## Clustered and repeated observations

When outcomes within a cluster are correlated, the effective sample size can be far smaller than the row count. For equal cluster size m and intraclass correlation ρ, a rough design effect is 1+(m−1)ρ. With 20 patients per clinic and ρ=0.05, the design effect is 1+19(0.05)=1.95, so 1,000 patient records contain roughly the precision of 513 independent observations under this simple approximation. Unequal cluster sizes can increase the design effect further.

The point estimate may also need to reflect the desired weighting. A patient-average treatment effect weights large clinics more heavily; a clinic-average effect gives each clinic equal weight. Mixed models and generalized estimating equations encode different correlation structures and interpretations. Cluster-robust standard errors need enough independent clusters to work well; with few clusters, small-sample corrections or randomization-based inference may be preferable. Report the number of clusters, their size distribution, and the level at which assignment occurred.

Repeated measures require a target summary too. A baseline-adjusted follow-up mean difference, an average difference across all time points, and a difference in change are not necessarily the same estimand. A mixed model can use incomplete longitudinal observations under assumptions about missingness conditional on observed data, but it does not automatically make missing-not-at-random dropout ignorable. Plot trajectories, state the time contrast, and conduct sensitivity analyses when dropout may depend on unseen outcomes.

## Transformations and non-linear summaries

Many statistics are transformations of an underlying estimator. For a risk ratio, the log ratio often has a more nearly symmetric sampling distribution; inference can be performed on that scale and exponentiated for presentation. If two independent groups have event counts a and c and denominators n1 and n0, the estimated log risk ratio is log[(a/n1)/(c/n0)]. Its approximate variance is 1/a−1/n1+1/c−1/n0 when counts are sufficiently large. With zero or sparse cells, this approximation fails; exact or likelihood-based methods, carefully justified continuity corrections, or Bayesian models may be considered.

The odds ratio is non-collapsible: a conditional odds ratio can differ from a marginal odds ratio even without confounding. Therefore, a change in logistic regression coefficients after covariate adjustment is not by itself proof that confounding was removed. For a clinical audience, standardized predicted risks can make the target more transparent. For each person, predict outcome under each intervention value, average those predictions over the target population, then contrast averages. This g-computation approach still needs correct model specification or a robust alternative and causal identification assumptions.

Bootstrap methods approximate a statistic's sampling distribution by resampling observational units and repeating the entire estimation procedure. The resampling unit must respect the design: resample patients for independent patient data, clusters for cluster-randomized data, and potentially strata within sampling strata for complex surveys. If variable selection, imputation, or tuning is part of the estimator, repeat it inside each bootstrap replicate. Holding the selected model fixed gives intervals conditional on selection and generally understates full procedure uncertainty.

## A contrast between uncertainty methods

Suppose 12 of 80 treated patients and 20 of 80 controls experience an event. The observed risks are 0.15 and 0.25, giving a risk difference of −0.10 and risk ratio 0.60. The approximate standard error for the risk difference is sqrt[0.15(0.85)/80 + 0.25(0.75)/80] ≈ 0.063. A rough normal interval is −0.10 ± 1.96(0.063), or −0.223 to 0.023. It includes no difference while also including a substantial benefit. A Wilson/Newcombe interval is generally preferable for small binomial samples, but the interpretation remains: the sample is not precise enough to rule out several clinically relevant values.

The number needed to treat is the reciprocal of an absolute risk reduction, here 1/0.10=10 over the stated follow-up. Its uncertainty is not well represented by simply taking reciprocals of the risk-difference interval when that interval crosses zero; the transformed interval has disconnected or unbounded regions. Report the risk difference and interval first, with NNT conventions and time horizon clear. Avoid reporting an NNT without the underlying baseline risk, endpoint, and duration.

A Bayesian analysis instead combines a likelihood with a prior distribution to obtain a posterior distribution for parameters. A posterior interval can directly state that a specified proportion of posterior mass lies in a range, conditional on model and prior. The prior can stabilize estimation for sparse data, but its influence should be examined, especially when evidence is limited. A Bayesian posterior probability is not assumption-free; the likelihood, exchangeability assumptions, and prior all matter. Frequentist and Bayesian summaries answer different questions and should not be mixed casually in one interpretation.

## Limits of interval estimates

Intervals often cover only sampling variation conditional on an analysis model. They may not include uncertainty from choosing among outcomes, selecting a model, estimating nuisance parameters, or transporting results to another health system. Prediction intervals for individual outcomes are wider than confidence intervals for a mean because they include person-to-person variation. Intervals for a treatment effect across settings may need to include between-study heterogeneity.

If a model has strong nonlinearities, sparse data, or estimates near a parameter boundary, symmetric Wald intervals can be misleading. Likelihood profiles, bootstrap distributions, score intervals, or posterior summaries may better reflect asymmetry. However, a sophisticated interval cannot compensate for poor data, weak measurement, or lack of overlap between compared groups. Show raw denominators or distributions when possible so readers can assess support.

## Practical checklist for statistical quantities

Before reporting a number, identify: the population or process it describes; the outcome scale and time point; whether it is an estimand, estimator, or realized estimate; the sampling and assignment units; and the assumptions used for uncertainty. Check that transformations preserve the interpretation readers need. Compare interval width with clinically meaningful differences. Assess whether missingness, selection, clustering, and multiplicity are addressed. If the statistic is weighted or adjusted, explain the reference population and the role of each adjustment.

A good statistical report states what the data estimate and where the estimate may fail. “The mean was 132 mmHg” is descriptive but incomplete if the intended claim concerns all eligible patients. “The estimated population mean was 132 mmHg (95% CI 128.8–135.2) from a stratified cluster sample, using design weights and Taylor-linearized variance” makes the target and uncertainty method more assessable. Then discuss residual coverage and nonresponse limitations in plain language.

## References and further reading

- ICH. [E9(R1): Estimands and sensitivity analysis in clinical trials](https://database.ich.org/sites/default/files/E9-R1_Step4_Guideline_2019_1203.pdf).
- Greenland S et al. [Statistical tests, P values, confidence intervals, and power](https://doi.org/10.1007/s10654-016-0149-3). *Eur J Epidemiol*. 2016.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and Other Advanced Topics*. Brooks/Cole.
- Bland JM, Altman DG. *Statistics with Confidence*. BMJ Books.
