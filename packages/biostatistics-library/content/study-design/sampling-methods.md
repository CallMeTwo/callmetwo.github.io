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

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and Other Advanced Topics*. Brooks/Cole.
- Bland M. *An Introduction to Medical Statistics*. Oxford University Press.
- Lohr L. *Sampling: Design and Analysis*. Wiley.

The [bias and confounding article](/biostatistics-library/study-design/bias-and-confounding.html) explains how selection bias, including sampling-related bias, distorts results.
