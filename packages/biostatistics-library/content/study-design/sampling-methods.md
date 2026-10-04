---
title: Sampling methods
summary: How to choose a subset of a population so that the inferences drawn from it are valid, unbiased, and appropriately precise.
---

## Overview and key ideas

A **sample** is the subset of a population from which data are actually collected; the **population** (or **target population**) is the group to which inferences are to be generalised. The choice of sampling method determines which population the results apply to and how much error is introduced by the sampling process itself. The two broad families are **probability sampling** (every member of the population has a known, non-zero chance of selection) and **non-probability sampling** (selection is based on researcher judgment or convenience).

- **Simple random sampling.** Each member has the same probability of selection. Easy to describe; inefficient when the population is large or spread out.
- **Stratified sampling.** The population is divided into subgroups (strata) — e.g., by age group, sex, hospital ward — and a separate random sample is drawn from each stratum. This reduces variance for stratum-specific estimates and ensures representation of small but important subgroups.
- **Cluster sampling.** Instead of sampling individual units, randomly select groups (clusters) — e.g., schools, primary care practices, villages — and measure all (or a sample of) individuals within the selected clusters. Efficient when a full list of individuals is unavailable; introduces intra-class correlation, which inflates variance.
- **Systematic sampling.** Select every kth member from an ordered list (k = population size / desired sample size). Efficient and easy to implement; valid only if the list order is unrelated to the variable of interest.
- **Convenience and volunteer sampling.** No probability framework; results cannot be generalised to a defined population without strong additional assumptions.

## When to use it

| Sampling method | Typical clinical or research setting |
| --- | --- |
| Stratified random sampling | Estimating the prevalence of diabetes in a city, stratified by age group and sex, to ensure adequate representation of each age stratum. |
| Cluster sampling | A school-based programme to reduce obesity: randomly select 20 schools from a district, then measure BMI in all students in the selected schools. |
| Systematic sampling | Estimating mean blood pressure in a health screen: every 5th patient on the registration list over a one-week period. |
| Convenience sampling | A pilot study of 30 patients recruited from one hospital's outpatient clinic to estimate feasibility and rough effect size before a definitive trial. |
| Two-stage stratified cluster sampling | National health surveys (e.g., NHANES): stratify by geography, cluster by census tract, random sample of households within each tract. |

## Assumptions and limitations

- **Representativeness.** The sample must be drawn from the target population. If the frame (list from which sampling starts) is incomplete or outdated, no sampling technique will fix the bias.
- **Response rate.** A high non-response rate, particularly if related to the outcome (sick people are less likely to attend a screening), introduces selection bias regardless of the sampling method.
- **Intra-class correlation (ICC) in cluster sampling.** Individuals within the same cluster tend to be more similar to each other than to individuals in other clusters; the effective sample size is smaller than the raw count, and standard errors must be adjusted.
- **Stratification must be on a variable related to the outcome.** Stratifying by a variable unrelated to the outcome adds cost and complexity without reducing variance.
- **Non-probability samples** do not justify design-based population estimates on their own. Generalising beyond the sample requires explicit assumptions about selection and outcomes, often with adjustment or external population data; convenience samples can still be useful for feasibility work or descriptive questions about participants themselves.

## Worked example

A hospital wants to estimate mean HbA1c among its adult diabetic outpatients. Its sampling frame has 5,000 registered adults: 1,200 aged 18–40, 2,000 aged 41–60, and 1,800 aged 61+.

Using **stratified sampling** with proportional allocation and a desired total sample of 400:

- 18–40: n = 400 × 1,200/5,000 = 96
- 41–60: n = 400 × 2,000/5,000 = 160
- 61+: n = 400 × 1,800/5,000 = 144

A random sample of 96, 160, and 144 patients is drawn from the respective strata. Suppose the mean HbA1c is 7.4% (SD 1.1) in the 18–40 group, 8.1% (SD 1.3) in the 41–60 group, and 8.5% (SD 1.4) in the 61+ group.

Stratified mean = (96/400 × 7.4) + (160/400 × 8.1) + (144/400 × 8.5) = 1.776 + 3.240 + 3.060 = **8.08%**.

Using these illustrative SDs and ignoring finite-population corrections, the estimated SE is sqrt[(0.24² × 1.1²/96) + (0.40² × 1.3²/160) + (0.36² × 1.4²/144)] ≈ 0.065 percentage points. Proportional allocation gives each person the same selection probability, so the weighted mean equals the sample mean here. Stratification can improve precision when strata are internally more homogeneous than the whole population; the gain is not automatic and should be evaluated with a design-based variance estimator.

## Interpretation and common pitfalls

- **Confusing the sample frame with the target population.** A sample of hospital inpatients cannot support inferences about the general community; the target population must be stated explicitly in the methods section.
- **Ignoring non-response.** If 40% of a convenience sample does not attend and the non-respondents are systematically sicker, the mean HbA1c will be biased low; the non-response rate and any evidence about its direction must be reported.
- **Using a raw count to estimate precision in cluster sampling.** If 20 schools are sampled with 100 students each (n = 2,000) and the ICC is 0.05, the design effect is 1 + (100 − 1) × 0.05 ≈ 6.0; the effective sample size is about 333, not 2,000. Standard errors computed from n = 2,000 will be far too small.
- **Treating a convenience sample as random.** Recruiting "the first 50 patients who came to clinic today" does not produce a random sample of the clinic's diabetic population; generalisability beyond the sampled group is not supported.

## References and further reading

## From target population to analytic sample

## Variance estimation and design-based inference

## Sample allocation and optimality

Proportional allocation samples each stratum according to its population share and is operationally simple. Neyman allocation assigns sample size roughly proportional to stratum size times outcome SD, (n_h\propto N_hS_h\), minimizing variance for a fixed total sample under equal costs. If rural outcomes vary more than urban outcomes, Neyman allocation may oversample rural residents even without a dedicated subgroup objective. With unequal data collection costs, allocation should also account for cost; practical designs often balance precision, subgroup minima, and field logistics rather than optimize one statistic.

For a survey estimating several outcomes, there is no single optimal allocation because each outcome has different stratum variances. Choose a compromise based on priority outcomes and report precision for secondary estimates. Minimum subgroup sample sizes protect analytic usefulness but increase weighting variation. Pilot or prior survey data can estimate within-stratum variance, although unstable estimates should be shrunk or explored through scenarios.

## Calibration, raking, and weight trimming

Calibration adjusts survey weights so weighted totals match known population margins, such as age, sex, or region. Raking iteratively matches several margins without requiring a full cross-tabulation. This can reduce nonresponse bias if the calibration variables predict response and outcomes, and improve precision when they are strongly associated with outcomes. It cannot correct bias from unmeasured differences after conditioning on calibration variables, and margins from a different year or population can introduce error. Compare uncalibrated and calibrated estimates and document the source of control totals.

Weight trimming caps extreme weights to limit variance but changes the estimator and can reintroduce bias. Report the trimming rule, proportion and total weight mass affected, and sensitivity of key estimates to reasonable cut points. Assess both design effect and bias implications. A small standard error after aggressive trimming is not evidence that the target population is represented. Propensity calibration or entropy balancing can match richer margins, but positivity and model support still matter.

## Design effect versus effective sample size

The design effect is estimator-specific: \(DEFF=Var_{design}(\hat\theta)/Var_{SRS}(\hat\theta)\). It can be below one under efficient stratification and above one under clustering or unequal weights. Effective sample size \(n/DEFF\) is a useful communication approximation for a mean or proportion, not a literal count of independent participants and not a universal value for all outcomes. Report the design and variance method rather than reducing complex sampling to one effective N.

The sampling design determines not only weights but also the variance estimator. Under simple random sampling without replacement, the estimated variance of a sample mean is \((1-n/N)s^2/n\), where the finite-population correction reflects sampling a substantial fraction of the frame. Under stratified sampling, estimate each stratum mean and combine it using population shares; the variance is the sum of squared shares times stratum variances. Under cluster sampling, primary sampling units (PSUs) are the independent units for variance estimation, and within-PSU observations are correlated. Treating all people as independent is pseudoreplication.

In a Taylor-linearized survey estimator, the statistic is approximated by a linear combination of observations and the design variance is calculated from PSU-level contributions. Replicate-weight approaches (jackknife, balanced repeated replication, or bootstrap variants) instead recompute the statistic over supplied replicate weights. Replicate methods are particularly helpful for nonlinear quantities such as quantiles, ratios, and regression contrasts, but the correct replicate scheme and scaling constants are design-specific. Use released replicate weights exactly as documented.

```r
library(survey)
# Two-stage design: PSUs are nested within strata; weight is final person weight.
d <- svydesign(ids = ~psu, strata = ~stratum, weights = ~final_weight,
               data = dat, nest = TRUE)
svymean(~outcome, d, na.rm = TRUE)
svyglm(outcome ~ age + sex, design = d, family = quasibinomial())
```

For multistage sampling, list every stage in `ids` when stage-specific sampling fractions or finite population corrections are available. The variance calculation otherwise uses a with-replacement approximation at the first stage. A lonely PSU in a stratum prevents the usual within-stratum variance calculation; do not solve this silently by treating the design as simple random sampling. Follow the agency's guidance, combine strata only when substantively defensible, or use a documented lonely-PSU adjustment and sensitivity analysis.

### Worked weighted prevalence and uncertainty

Suppose two strata have population sizes 9,000 and 1,000. We sample 450 from each; 36 urban and 90 rural respondents have the outcome. Unweighted prevalence is \((36+90)/900=14\%\). Population-standardized prevalence is \(.9(36/450)+.1(90/450)=9.2\%\). This point estimate is design-weighted; its uncertainty is not calculated by applying an ordinary binomial formula to the pooled 900. It must reflect stratum allocation, finite-population fractions if material, and nonresponse adjustments. A correct report gives both the weighted estimate and its design-based interval, along with effective sample sizes or design effects where useful.

Weights may be normalized to sum to the sample size without changing weighted means, but normalization does not turn the sample into a probability sample or fix omitted clusters. For totals, retain the population scale. For domain estimates, use a survey subpopulation/domain operation rather than deleting all non-domain records before variance calculation; deletion can remove information about the sample design and underestimate uncertainty.

### Sampling for rare outcomes and subgroups

Disproportionate stratification or oversampling can make rare subgroups estimable. Plan the number of sampled units from the desired subgroup precision, expected response, and within-stratum variance. If selecting participants based on an outcome for a case-control analysis, the design is no longer a simple population survey; analysis should reflect the outcome-dependent sampling mechanism. Adaptive sampling, respondent-driven sampling, and venue-time sampling may be necessary for hidden populations but rely on specialized assumptions about network structure, recruitment, and inclusion probability. They should not be described as ordinary random samples.

For longitudinal panels, initial probability sampling does not guarantee later-wave representativeness. Attrition weights can model continued response conditional on measured history, but require positivity and correct response models. Refreshment samples can restore cross-sectional coverage and help diagnose attrition assumptions. Keep base weights, nonresponse adjustments, calibration, and longitudinal attrition adjustments separately documented so analysts can reconstruct the target estimand and run sensitivity analyses.

### Example: disproportional stratified sampling

Suppose a target population has 9,000 urban and 1,000 rural residents, but a survey samples 450 from each stratum to permit rural estimates. The sample is 50% rural although the population is 10% rural. An unweighted estimate of prevalence gives rural residents five times their population representation. Base weights are inverse selection probabilities: urban weight 9,000/450=20 and rural weight 1,000/450≈2.22. If urban and rural prevalence are 8% and 20%, the population prevalence is \(.9(.08)+.1(.20)=.092\), or 9.2%; the unweighted sample prevalence is 14%. The example shows why subgroup oversampling improves subgroup precision but requires population weighting for aggregate estimates.

```r
weighted.mean(dat$condition, w = dat$final_weight, na.rm = TRUE)
```

The final weight should reflect selection and any documented nonresponse/calibration steps. Compute uncertainty with the full survey design; a weighted mean alone supplies no valid design-based interval.

Sampling design begins with a target population and a sampling frame. The target population is the set of people, places, or events to which the research question refers; the frame is the operational list or mechanism from which units can be selected. A hospital registry may be a useful frame for estimating outcomes among patients treated at that hospital, but it does not automatically represent all residents with the condition. Coverage error occurs when eligible units are absent or ineligible units appear. Nonresponse, refusal, unreachable participants, and missing measurements create further selection, which probability sampling alone does not remove.

In a simple random sample of \(n\) units from a finite population of size \(N\), each unit has inclusion probability \(n/N\). The sample mean is unbiased for the population mean under the design, and its variance includes a finite-population correction \((1-n/N)\). When sampling is unequal, each unit's inclusion probability \(\pi_i\) should be recorded; the Horvitz–Thompson total is \(\hat T=\sum_{i\in s} y_i/\pi_i\). Its population-mean counterpart divides by a known or estimated population size. Large weights identify units representing many unsampled units and can make estimates unstable, so weight distributions and design-based standard errors matter.

Stratification divides the frame into mutually exclusive groups and samples within each. It ensures representation of small but important groups and can improve precision when outcomes differ across strata. Disproportionate allocation is appropriate when subgroup estimates are important, but weighted estimates are then needed for population-wide summaries. Cluster sampling selects groups such as clinics or villages, then people within groups; it can reduce travel and recruitment cost while increasing variance because people in the same cluster tend to resemble one another. A multistage design may sample districts, facilities, then patients; each stage contributes to the overall inclusion probability.

## Design effect, weighting, and precision

For equal cluster sizes \(m\) and intraclass correlation \(\rho\), the approximate cluster design effect is \(DEFF=1+(m-1)\rho\). If each clinic contributes 20 patients and \(\rho=0.04\), then \(DEFF=1+19(0.04)=1.76\): 1,000 clustered observations carry roughly the variance of 568 independent observations (effective sample size \(1000/1.76\)). This approximation is a planning aid; unequal cluster size can further increase the design effect. Analyses should retain cluster identifiers and use survey-design methods, cluster-robust variance with enough clusters, or a justified multilevel model.

```r
library(survey)
# dat contains outcome, stratum, PSU, and final sampling weight.
dsgn <- svydesign(ids = ~PSU, strata = ~stratum,
                  weights = ~weight, data = dat, nest = TRUE)
svymean(~outcome, dsgn, na.rm = TRUE)
svyby(~outcome, ~stratum, dsgn, svymean, na.rm = TRUE)
```

This code assumes weights and design variables were constructed correctly. A standard `mean()` and standard error treat observations as independent and generally understate uncertainty for clustered or stratified samples. For a two-phase sample, include the appropriate stage information or replicate weights supplied by the survey producer. Document whether weights are base inverse-probability weights, nonresponse adjusted, calibrated to population margins, or trimmed.

The Kish approximation for unequal weights is \(DEFF_w\approx1+CV(w)^2\), where \(CV\) is the coefficient of variation of weights. This illustrates why extreme weights reduce precision, but it is not a substitute for the actual design variance: correlation between weights and outcomes can make the true effect smaller or larger. Trimming weights trades some bias for lower variance and should be prespecified and accompanied by sensitivity analysis.

## Nonresponse, missingness, and representativeness

Response rate alone does not quantify nonresponse bias. Bias depends on how response relates to the outcome, conditional on variables used for adjustment. If participation is more likely among healthier people and health status is poorly observed among nonparticipants, even a high response rate may leave substantial bias. Compare respondents with frame information, model response probabilities, apply calibrated nonresponse adjustments, and examine sensitivity to unmeasured differences. Weighting restores representation only under assumptions: relevant selection predictors are observed, positivity holds, and the adjustment model is adequate.

Sampling and missing-data mechanisms overlap but are not identical. Deliberate oversampling of a subgroup is a known design feature; a survey skip or refusal to answer income is item nonresponse. Follow the sampling design for selection and use appropriate missing-data methods for missing measurements. Do not automatically impute structural non-sampling units as if their outcomes were missing at random. For linked or convenience samples, explain the recruitment process and state which population is defensibly represented.

Plan the sample around the primary estimand: overall mean, subgroup prevalence, trend, or treatment effect. A sample size sufficient for the overall prevalence may be too small for a rare subgroup. Account for design effect, anticipated nonresponse, eligibility failure, and multiplicity of planned subgroup analyses. Report frame construction, selection at every stage, probabilities, substitutions, response dispositions, weighting, calibration totals, variance estimation, and limitations on transportability. These details allow readers to reproduce the design-based estimate rather than treating the observed sample as a simple random draw.

- Lohr SL. *Sampling: Design and Analysis*. 3rd ed. Chapman & Hall/CRC; 2021. https://doi.org/10.1201/9780429298899
- Lumley T. *Complex Surveys: A Guide to Analysis Using R*. Wiley; 2010. https://doi.org/10.1002/9780470580066
- Heeringa SG, West BT, Berglund PA. *Applied Survey Data Analysis*. 2nd ed. Chapman & Hall/CRC; 2017.

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and Other Advanced Topics*. Brooks/Cole.
- Bland M. *An Introduction to Medical Statistics*. Oxford University Press.
- Lohr L. *Sampling: Design and Analysis*. Wiley.

The [bias and confounding article](/biostatistics-library/study-design/bias-and-confounding.html) explains how selection bias, including sampling-related bias, distorts results.
