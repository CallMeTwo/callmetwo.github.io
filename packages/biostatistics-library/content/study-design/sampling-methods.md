---
title: Sampling methods
summary: How to choose a subset of a population so that the inferences drawn from it are valid, unbiased, and appropriately precise.
---

## Overview

Sampling is the set of rules by which observations enter a study. Those rules determine what population a result can describe, what uncertainty is attributable to selection, and which analyses are valid. The first question is therefore not “How many people can we recruit?” but “Which population quantity are we trying to estimate, and through what mechanism could observed units represent it?” A sample may be large and precisely measured yet systematically miss people who differ in the outcome.

Probability sampling gives each eligible unit a known, nonzero inclusion probability under the design. This enables design-based inference: the population values are treated as fixed, while repeated hypothetical samples reveal the estimator’s sampling distribution. Nonprobability samples have unknown selection probabilities. They can support description of participants, feasibility work, and causal analyses under explicit assumptions, but a conventional standard error does not convert volunteer data into a probability sample.

## Start with the population, then construct a frame

Define the target by unit, eligibility, geography, and time. “Adults with asthma in the region” leaves open whether the target includes undiagnosed residents, people in institutions, and people not registered with a clinician. A frame is the operational list from which selection occurs: a household address register, patient roster, school list, or claims file. The target and frame rarely coincide perfectly. Undercoverage, duplicates, stale records, and false eligibility are coverage errors. They are not repaired merely by increasing the sample size.

For every stage, record the selection unit and conditional probability. A household survey may select districts, census areas, households, and then one adult within each household. If the probabilities are 0.20, 0.10, 0.50, and 0.25, an adult’s overall inclusion probability is their product, 0.0025, before nonresponse adjustment. The base weight is its inverse, 400. It says how many target units that sampled person represents under the design; it is not a measure of that person's importance.

The estimand influences the design. Estimating a regional mean may favor proportional allocation. Estimating a rare subgroup’s prevalence may require oversampling that subgroup. Measuring service quality across hospitals may require sampling hospitals first, then patients within them. The population, estimand, sampling frame, selection stages, and planned analysis should be written together so a reader can see the chain from question to estimate.

## Choose a design that matches the inferential job

In simple random sampling without replacement, every size-n subset of an N-unit frame is equally likely. It is conceptually clean and provides a useful benchmark, but can be costly when the frame is geographically dispersed. Systematic sampling selects every k-th unit after a random start. It is efficient for an ordered list, provided periodic structure in the list does not align with the outcome or selection interval. A random start does not eliminate a bias created by a repeating ordering pattern.

Time-location sampling is sometimes used when no person-level list exists, for example to recruit people attending venues at varying times. The sampling unit is then a venue-time slot, and attendance frequency affects a person's chance of selection. A defensible design enumerates venue-time units, samples them with known probabilities, records attendance or selection multiplicity, and accounts for repeat visits. Recruiting whoever happens to be present at a single venue and time is a convenience sample, even if the venue is busy. For mobile or hidden populations, network-based designs may be more feasible but require additional assumptions about network degree, recruitment, and connectedness; their estimates should not be presented as ordinary household-survey estimates.

Sampling without replacement can also be informative when a large fraction of a small eligible population is observed. If 800 of 1,000 patients are sampled, treating the observations as if drawn from an infinite population overstates sampling variance. The finite-population correction is \(\sqrt{1-n/N}=\sqrt{0.2}\), reducing the standard error relative to the with-replacement approximation. This correction applies to uncertainty from selection within that frame; it does not account for measurement error, nonresponse, frame undercoverage, or uncertainty about whether the frame itself represents the scientific target.

Stratified sampling partitions the population into mutually exclusive groups and draws a sample in each. Stratification guarantees representation of small groups and can improve overall precision when outcomes are more homogeneous within strata than across them. It is useful when both subgroup and overall estimates matter. The analysis must account for the population shares when allocation is disproportionate.

Cluster sampling selects groups—clinics, schools, villages—then observes some or all members inside sampled groups. It reduces travel and listing costs, but people in a shared cluster often resemble one another. In a multistage design, sample primary units first and then select people within those units. A design with many clusters and few people per cluster is often more informative than one with few clusters and many people in each, though the cost structure and estimand matter.

Sampling with unequal probabilities is useful for rare outcomes, high-priority subpopulations, or units expected to yield more information. The Horvitz–Thompson estimator of a finite-population total is

\[
\widehat{T}_{HT}=\sum_{i\in s}rac{y_i}{\pi_i},
\]

where \(\pi_i\) is unit i’s inclusion probability. When the population size is known, divide by N for a mean. A ratio or Hájek estimator divides the weighted total by the sum of weights; it is often more stable but has small-sample bias. The sampling design—not a rule that weights must sum to a particular number—determines the estimator and its variance.

## Worked allocation: precision, cost, and subgroup goals

Suppose a registry contains 5,000 eligible patients: 1,200 aged 18–40, 2,000 aged 41–60, and 1,800 aged 61 or older. A sample of 400 allocated proportionally yields 96, 160, and 144 patients. If their observed HbA1c means are 7.4, 8.1, and 8.5 percentage points, the population-weighted mean is

\[
(1200/5000)(7.4)+(2000/5000)(8.1)+(1800/5000)(8.5)=8.08.
\]

Proportional allocation gives equal inclusion probabilities here. If the study instead samples 100 people in each age group to ensure adequate precision for age-specific estimates, the overall mean must still use the population shares 0.24, 0.40, and 0.36; the unweighted mean of the three equally sized samples would target an artificial population with equal age-group shares.

For fixed total n and equal field costs, Neyman allocation is approximately \(n_h\propto N_hS_h\), where S_h is the within-stratum outcome standard deviation. It allocates more observations to large or variable strata and minimizes variance for a single outcome under its assumptions. If costs differ, a cost-aware allocation changes this rule; if several outcomes are primary, no one allocation is optimal for all. Subgroup minimums, logistical constraints, and the need for an overall estimate generally call for a transparent compromise.

## Design effects and honest uncertainty

Under simple random sampling, the variance of a sample mean is approximately \((1-n/N)s^2/n\). The finite-population correction matters when a substantial fraction of a finite frame is sampled. For equal cluster size m and intraclass correlation ρ, a rough design effect is \(1+(m-1)ρ\). With 20 patients per clinic and ρ=0.04, this is 1.76. A nominal sample of 1,000 observations then has about 568 independent-observation equivalents for a mean-like estimand. The approximation is for planning and intuition: unequal cluster sizes, stratification, weights, and outcome-specific patterns change the true design effect.

Use the actual strata, cluster identifiers, weights, and—where supplied—replicate weights in variance estimation. A weighted point estimate paired with an ordinary unweighted standard error is not a design-based analysis. In R, the survey package represents this structure:

```r
library(survey)
design <- svydesign(ids = ~psu, strata = ~stratum,
                     weights = ~final_weight, data = dat,
                     nest = TRUE)
svymean(~hba1c, design, na.rm = TRUE)
svyby(~hba1c, ~age_group, design, svymean, na.rm = TRUE)
```

The variables in this example must reflect the actual design. If there is only one sampled primary unit in a stratum, or too few clusters overall, conventional design-based variance estimation may be unstable. Simplifying the design variables to make software run can conceal the problem; report limitations and use an analysis appropriate to the available design information.

For a stratified mean, the point estimate is \(\sum_h W_h\bar y_h\), where \(W_h=N_h/N\). Ignoring finite population corrections, its variance estimate is \(\sum_h W_h^2s_h^2/n_h\). This expression shows why stratification helps when strata are internally homogeneous: the within-stratum variances replace the larger pooled variance. It also shows why a small sample in one stratum can dominate uncertainty if its outcome is highly variable. Allocation should be planned for the estimates that matter, not just for a pleasingly balanced table.

Take two groups with population shares 0.8 and 0.2, standard deviations 10 and 20, and 100 total observations. Proportional allocation gives 80 and 20 observations, with variance approximately \(.8^2(10^2/80)+.2^2(20^2/20)=1.8\), so the standard error is 1.34. Neyman allocation is proportional to \(N_hS_h\), giving about 67 and 33; the variance falls to roughly 1.60. The gain is modest in this example, and assumes the standard deviations are known, costs are equal, and the overall mean is the objective. If subgroup-specific precision is required, a minimum allocation to the smaller group may matter more than the slight improvement in the overall mean.

In cluster sampling, the simple design effect approximation assumes equal cluster size and a common intraclass correlation. Unequal cluster sizes increase variance because observations concentrate in a smaller number of independent units. A rough extension multiplies the ICC contribution by a cluster-size coefficient of variation term; for planning, simulation using plausible cluster sizes and correlations is safer. The number of clusters is especially consequential for variance estimation and for cluster-level exposures: adding people to a few existing clinics can improve measurement within clinics but contributes little information about variation between clinics. An analysis with many participants but only a handful of independent clusters should not be described as having a large effective sample for every inferential purpose.

Replicate-weight methods provide another route to variance estimation. Balanced repeated replication, jackknife replication, or bootstrap replicate weights repeatedly perturb the sampling units according to the design and calculate the estimator in each replicate. They can accommodate complex estimators such as medians or calibrated totals, provided the replication scheme is appropriate and supplied correctly. Analysts should preserve the survey provider’s replicate scaling constants and degrees-of-freedom conventions; substituting a generic bootstrap can misrepresent stratification and clustering.

## Nonresponse, calibration, and convenience recruitment

A response rate alone cannot tell how biased an estimate is. Bias depends on outcome differences between respondents and nonrespondents after conditioning on variables used in adjustment. Compare respondents with frame variables, model response probabilities, and calibrate weights to reliable population totals where defensible. These steps require that relevant predictors of participation and outcome are observed, response probabilities are not near zero for important groups, and the model is sufficiently accurate. Calibration cannot repair unmeasured selection merely because weighted margins match census totals.

Extreme weights can inflate variance. Trimming caps weights and trades variance for possible bias; specify the rule, show how much weight is affected, and compare estimates under reasonable alternatives. The Kish approximation \(1+CV(w)^2\) summarizes one source of weight-induced variance inflation, but it is not a universal design effect and does not replace the actual variance estimator.

Convenience samples, clinic volunteers, online panels, and referral chains have no design-based inclusion probabilities unless an actual probability mechanism has been incorporated. They may still answer questions about enrolled participants or support model-based inference if selection is ignorable given measured covariates and there is adequate overlap with the target population. State those assumptions. Do not call a sample representative simply because its age and sex margins resemble the population.

Calibration is most credible when external totals match the survey’s target population, reference date, and definitions. Raking can align several marginal distributions—for example age, sex, and region—but does not force their joint distribution to match. If outcome prevalence varies strongly across an omitted interaction, matching one-way margins may leave residual bias. Conversely, calibrating to noisy or outdated totals can make an estimate worse. Compare estimates before and after adjustment, inspect weight ranges and effective sample sizes, and avoid tuning the calibration variables after seeing which version yields the preferred result.

For nonprobability data, poststratification is not automatically a cure. A common approach models the probability of participation conditional on observed characteristics, then weights or standardizes to a population benchmark. This relies on conditional exchangeability of selection: after conditioning on included covariates, respondents and nonrespondents must have comparable outcome distributions. It also requires positivity, so every relevant covariate pattern in the target has some chance of appearing in the sample. If certain rural or older groups are entirely absent, extrapolation is a model assumption rather than empirical representation. External validation, sensitivity analyses for residual selection, and honest narrowing of the target are more useful than a single adjusted number.

Nonresponse follow-up can also be designed as a second-phase sample. A random subsample of initial nonrespondents can receive more intensive contact, and its outcomes can help estimate differences between respondents and nonrespondents. Two-phase inclusion probabilities must then be reflected in weights. This strategy often yields stronger information than simply sending repeated reminders to everyone, because it converts a portion of the nonresponse problem into a probability sample with known follow-up selection.

## Reporting the sample as part of the result

Report the target population and time period, frame and known coverage gaps, unit at each sampling stage, selection probabilities or method, stratum and cluster structure, response dispositions, exclusions, and replacement rules. Explain base weights and each later adjustment separately. Present weighted estimates with design-correct intervals and identify whether the result is a total, mean, prevalence, or subgroup/domain estimate. For longitudinal panels, distinguish the original sample from the people retained at each wave; attrition weights require additional assumptions and do not erase selective loss by themselves.

A sampling plan succeeds when a reader can reconstruct who could enter, how selection occurred, and why the reported uncertainty corresponds to that process. Those design facts are not administrative details appended to analysis: they define the population to which the estimate refers.

### Domains, rare outcomes, and planned subgroup estimates

A domain is a population subgroup for which an estimate is wanted, such as adults aged 65 years or older within a national survey. Domain estimation should retain the full design object and identify the subgroup as a domain. Dropping all non-domain observations before variance estimation can make a sampled stratum appear to contain fewer primary units than it really did, leading to poor or undefined variance estimates. In R, `subset(design, age >= 65)` retains the design structure for a domain analysis; it is not equivalent to filtering the raw data and rebuilding the design from the remaining rows.

Rare populations may require disproportionate selection. Suppose 2% of a frame has a particular disease but the study needs at least 100 affected people for stable subgroup description. A simple random sample of 1,000 would yield about 20 on average. A stratified design that samples the known disease registry at a higher rate can improve precision, but the aggregate prevalence requires weights that restore the population distribution. If disease status is not known in the frame, a screening phase may be needed: sample broadly, measure a short screening instrument, then select eligible individuals at a higher second-phase probability. Record both probabilities; using only the second-phase sample fraction gives incorrect weights.

The planning target should distinguish precision for a population total from precision for a subgroup mean, and distinguish estimation from hypothesis testing. A design with a narrow overall confidence interval may still have too few independent clusters or too few subgroup events for adjusted modeling. Power calculations should use the number of independent sampling units and anticipated design effect rather than the raw number of records. For rare outcomes, the expected number of events after nonresponse and design losses is often a clearer planning quantity than nominal N.

### A compact analysis audit in R

The point estimate and its uncertainty should travel together. This small workflow makes the declared sampling variables explicit and can be extended with the survey provider’s design documentation:

```r
library(survey)
options(survey.lonely.psu = "adjust")
d <- svydesign(ids = ~psu, strata = ~stratum,
               weights = ~weight, data = dat,
               nest = TRUE)
overall <- svymean(~case, d, na.rm = TRUE)
by_region <- svyby(~case, ~region, d, svymean,
                   na.rm = TRUE, vartype = c("se", "ci"))
coef(overall)
confint(overall)
```

The lonely-PSU option shown is a software choice, not a universal remedy. A single sampled primary unit in a stratum can signal a design feature that requires collapsing strata, certainty-unit treatment, or another prespecified variance method. The analyst should consult design documentation rather than selecting an option because it produces finite standard errors. Likewise, missing weights or strata values should be resolved from source records or documented rules, not silently replaced with one.

An audit should compare the weighted sample totals with known frame or population controls, tabulate response by key frame characteristics, inspect the distribution of weights, and verify that the number of sampled clusters and strata matches the design report. Recalculate important estimates under plausible nonresponse adjustments or trimming thresholds. Such checks do not prove representativeness; they reveal whether the implemented analysis is consistent with the stated design and how sensitive the conclusion is to consequential choices.

## References and further reading

- Heeringa SG, West BT, Berglund PA. *Applied Survey Data Analysis*. 2nd ed. Chapman & Hall/CRC; 2017.
- Horvitz DG, Thompson DJ. A generalization of sampling without replacement from a finite universe. *Journal of the American Statistical Association*. 1952;47(260):663–685. https://doi.org/10.1080/01621459.1952.10483446
- Lohr SL. *Sampling: Design and Analysis*. 3rd ed. Chapman & Hall/CRC; 2021. https://doi.org/10.1201/9780429298899
- Lumley T. *Complex Surveys: A Guide to Analysis Using R*. Wiley; 2010. https://doi.org/10.1002/9780470580066
- Valliant R, Dever JA, Kreuter F. *Practical Tools for Designing and Weighting Sample Surveys*. 2nd ed. Springer; 2018.
- The [bias and confounding article](/biostatistics-library/study-design/bias-and-confounding.html) discusses selection bias and related threats to inference.
