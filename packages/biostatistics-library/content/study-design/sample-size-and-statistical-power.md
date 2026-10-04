---
title: Sample size and statistical power
summary: Determining how many participants a study needs to detect a clinically meaningful effect with a pre-specified probability, controlling false-positive and false-negative error.
---

## Overview

Sample-size planning turns the scientific question into a design that can produce useful evidence. It links the target population, treatment contrast, outcome, follow-up, analysis, and decision rule to the precision or error rates the study can attain. A conventional power calculation asks: if a specified effect and set of nuisance parameters were true, how often would the planned test reject its null? Solving that question for sample size gives a conditional design target. It is not a promise that the study will detect an effect, nor a probability that the hypothesis is true.

The calculation belongs after the estimand and primary analysis have been specified. A superiority study planned for a moderate difference cannot be reinterpreted as an equivalence study if its confidence interval includes zero. Conversely, a result with a small p-value can still be too imprecise to establish a clinically useful effect. Good planning makes the intended decision explicit, uses plausible inputs, shows how the answer changes when those inputs change, and checks that recruitment and follow-up can deliver the required information.

## Start from the decision the study must support

Write down the population, strategies being compared, outcome, time horizon, and summary contrast. Decide whether the goal is hypothesis testing, estimation with a specified precision, or a decision such as superiority, noninferiority, or equivalence. Then define the success rule. For a superiority test this includes the null, sidedness, type-I error rate, target power, multiplicity strategy, and analysis. For an estimation study it may instead be the desired confidence-interval width. For noninferiority or equivalence, specify the clinically justified margin and the direction of acceptable difference before looking at the data.

The minimum clinically important difference (MCID) is not necessarily the effect most likely to occur. It is the smallest effect whose evidence would change a clinical or policy decision. Planning for a larger effect can make a study inexpensive, but the design may then be unable to resolve an important, more modest benefit. Planning around an implausibly tiny effect can be ethically and operationally wasteful. Consult clinicians, patients, policy-makers, and prior evidence, and report why the selected value matters.

The analysis used in the calculation should match the planned primary analysis. A two-sample t-test formula may be adequate for a simple continuous endpoint with independent observations, but not automatically for baseline-adjusted repeated measures, clustered randomization, survival outcomes, or adaptive allocation. A calculation for the wrong estimand or test can be mathematically correct and still produce a poorly designed study.

## What determines the required information?

For a fixed design, power rises with the magnitude of the target effect and sample size and falls as outcome variability increases. It also depends on the type-I error rate, allocation ratio, dependence among observations, outcome prevalence, censoring, and analysis efficiency. Raising power from 80% to 90% generally requires a noticeable increase in enrollment. Reducing alpha to protect against multiple comparisons also increases the sample required for the same power.

In a simple two-group comparison of means with equal group size (n), common standard deviation σ, and difference δ, the standard error of the estimated difference is σ√(2/n). A normal-approximation sample size per group is

\[
n \approx \frac{2\sigma^2 (z_{1-\alpha/2}+z_{1-\beta})^2}{\delta^2},
\]

where (1-\beta) is target power. This approximation assumes independent observations, a common variance, and a test whose sampling distribution is sufficiently close to normal. Exact software calculations may differ slightly, especially with small samples or non-normal outcomes.

### Worked example: a continuous endpoint

Suppose a trial compares a new rehabilitation program with usual care on a functional score. Clinicians consider a 6-point mean difference important. Prior data suggest a standard deviation of 12 points. With equal allocation, two-sided α=.05, and 80% power, the approximation gives:

\[
n \approx 2(12^2)(1.96+0.84)^2/6^2 \approx 63
\]

analyzable participants per group. If approximately 15% of enrolled participants are expected to lack an endpoint measurement, the enrollment target is (63/(1-.15)\approx75) per group. This simple inflation addresses anticipated loss of analyzable observations; it does not correct bias if missingness depends on outcome or treatment response.

```r
delta <- 6
sd <- 12
alpha <- 0.05
target_power <- 0.80
n_analyzable <- ceiling(
  2 * sd^2 * (qnorm(1 - alpha / 2) + qnorm(target_power))^2 / delta^2
)
loss_fraction <- 0.15
n_enroll <- ceiling(n_analyzable / (1 - loss_fraction))
c(analyzable_per_arm = n_analyzable,
  enroll_per_arm = n_enroll,
  total_enroll = 2 * n_enroll)
```

The output is about 63 analyzable and 75 enrolled per arm. Before using it, confirm that the scale, variance, endpoint timing, and analysis correspond to the protocol. If baseline adjustment is planned, any efficiency gain should be grounded in a credible correlation estimate and should not be silently assumed.

## Match the calculation to the outcome and design

For a binary outcome, the control and treatment probabilities both matter. For example, a relative risk reduction of 25% means different absolute differences when control risk is 4% versus 20%; the lower event rate generally requires more participants for the same relative contrast. Normal approximations can be poor with rare events or small samples. Use validated score, exact, or simulation-based procedures where needed, and clearly identify whether the target contrast is a risk difference, risk ratio, or odds ratio.

For a time-to-event endpoint, power is often driven mainly by the number of observed events, not simply the number randomized. Under equal allocation and proportional hazards, a common approximation for a two-sided log-rank test is

\[
D \approx \frac{4(z_{1-\alpha/2}+z_{1-\beta})^2}{[\log(HR)]^2},
\]

where (D) is the required number of events. If the target hazard ratio is 0.70, with α=.05 and 80% power, the result is about 247 events. The total enrollment needed to obtain those events depends on control survival, accrual, follow-up, competing risks, and loss to follow-up. A participant count without an event-accrual projection is incomplete for an event-driven trial.

Cluster randomization changes effective information because people in one clinic or school tend to resemble each other. For equal cluster size (m) and intraclass correlation ρ, the approximate design effect is (1+(m-1)\rho). If an individual-level calculation calls for 100 people per arm, average cluster size is 15, and ICC=.03, the design effect is 1.42 and a rough inflation gives 142 people per arm. This approximation does not account for a small number of clusters, unequal cluster sizes, or cluster dropout; design and analysis should be planned together.

Repeated measurements can improve precision when within-person correlation is favorable and the analysis models the covariance appropriately. A longitudinal calculation therefore needs the number and timing of measurements, expected correlation, dropout pattern, and treatment-by-time contrast. For diagnostic sensitivity, the relevant information is often the number with disease, so a low-prevalence condition can require screening a large cohort. For prediction model development, the aim is not merely a significant coefficient: planning should consider overfitting, shrinkage, calibration, and the size of an independent validation sample.

## Noninferiority, equivalence, and estimation targets

In noninferiority studies, the margin represents the largest clinically acceptable loss relative to control. It must be justified using clinical consequences and reliable historical evidence, not chosen to make recruitment manageable. Planning depends on that margin, expected treatment difference, one-sided alpha, adherence, crossover, and analysis population. A wide margin reduces the required sample but weakens the claim. Both intention-to-treat and per-protocol analyses are often important because nonadherence can bias toward apparent similarity.

Equivalence requires the full confidence interval to lie inside prespecified lower and upper margins. The null includes differences beyond either margin, so equivalence is not established by failing to show superiority. Because the interval must be sufficiently narrow, equivalence designs often need larger samples than a superiority design for a moderate effect. For either design, explain what clinical evidence supports the margin and how the planned analysis handles intercurrent events.

If the primary objective is estimation, specify the precision needed instead of inventing a null effect solely to produce a power calculation. A prevalence survey may target a confidence interval with a given half-width; a mean-estimation study may target a maximum standard error. Precision depends on sampling design, clustering, nonresponse, and finite-population correction where applicable. State whether the precision target applies overall or within key subgroups.

## Uncertainty in the planning inputs

The assumed effect, standard deviation, control event rate, ICC, recruitment rate, and attrition are uncertain. Treat them as scenarios, not known constants. Use external studies, registries, and carefully interpreted pilots. Small pilots are usually more informative about recruitment, retention, measurement variability, and data workflow than about treatment effect; their effect estimates are noisy and tend to exaggerate promising findings.

Show a sensitivity table or plot across plausible values. For a binary outcome, vary the event rate and absolute effect. For cluster trials, vary ICC and cluster size. For a survival endpoint, vary event rate, accrual, and censoring. This reveals which inputs control feasibility and which evidence would be most valuable. If nuisance parameters are uncertain, a blinded sample-size re-estimation may sometimes update pooled variance or event incidence under a prespecified rule. It must not become an informal opportunity to increase sample size based on an unblinded effect estimate.

Conventional power conditions on a single effect and nuisance parameter set. Design assurance averages success probability over specified uncertainty distributions. For a Bayesian plan, this may integrate posterior decision success over priors; a frequentist assurance calculation may average across scenario weights. Assurance is more realistic when inputs are highly uncertain, but its answer inherits those distributions. Present them and compare assurance with ordinary scenario-based power.

## Enrollment loss, multiplicity, and interim looks

If a fixed fraction (r) of participants are expected to have no analyzable outcome, a first approximation is (N_{enroll}=N_{analyzable}/(1-r)). This assumes roughly independent participant losses. It does not repair differential attrition, informative missingness, loss of an entire clinic, or lack of outcome maturity. Plan these mechanisms explicitly and account for screening failures separately from post-enrollment dropout.

Multiple primary outcomes, treatment arms, doses, subgroups, and interim looks affect false-positive error. A hierarchical testing strategy, gatekeeping, Holm adjustment, or family-wise alpha allocation may be appropriate, but the chosen method changes power and belongs in the sample-size calculation. Exploratory false-discovery-rate control does not provide the same family-wise guarantee as a confirmatory testing plan.

Repeated interim efficacy testing at nominal α=.05 inflates the chance of a false positive. Group-sequential designs use boundaries or alpha-spending functions to preserve the overall error rate. O'Brien–Fleming boundaries are particularly stringent early and close to the fixed-sample critical value at the end; Pocock-type boundaries spend more alpha earlier. The number and timing of looks, information fraction, futility rule, and stopping population must be prespecified. Early stopping for benefit can exaggerate the estimated effect, particularly when a modest trial crosses a boundary after an extreme interim result. See the library's [interim analysis and monitoring article](interim-analysis-and-monitoring-in-randomized-trials.html).

## When formulas are not enough

Use simulation when the design includes adaptive randomization, complex longitudinal covariance, small numbers of clusters, competing risks, multiple co-primary endpoints, nonstandard estimands, or complicated stopping rules. Repeatedly generate data under scenarios, apply the exact planned randomization and analysis, and record power, type-I error, coverage, bias, convergence, and stopping behavior. Validate the code against simple special cases and quantify Monte Carlo error.

```r
set.seed(2026)
B <- 5000
reject <- replicate(B, {
  control <- rnorm(120, mean = 0, sd = 1)
  treatment <- rnorm(120, mean = 0.25, sd = 1)
  t.test(treatment, control, var.equal = FALSE)$p.value < 0.05
})
estimated_power <- mean(reject)
mc_se <- sqrt(estimated_power * (1 - estimated_power) / B)
c(power = estimated_power, monte_carlo_se = mc_se)
```

This demonstration estimates power for a simple two-sample setting only. At estimated power near .80 with 5,000 replicates, Monte Carlo standard error is about .006. A real simulation should encode the intended allocation, covariates, missingness, endpoint timing, and primary analysis; document software and random seeds so the design can be audited.

## Reading the result after the study

Power is a property of a design under an assumed data-generating process. “Observed power” calculated from the observed treatment effect mostly restates the p-value and is not a useful post-study interpretation. Report the treatment estimate and confidence interval. A nonsignificant estimate with an interval excluding clinically important benefit can support a conclusion that such benefit is unlikely; a wide interval remains inconclusive. Do not infer equivalence from non-significance. Equivalence requires interval containment within prespecified margins, and noninferiority requires exclusion of an unacceptable loss in the prespecified direction.

Report the target estimand, test and sidedness, alpha, power or precision target, allocation, assumed effect, variance or event rate, attrition, clustering, multiplicity, software/version, and sensitivity scenarios. Distinguish the analyzable target from the enrollment target. Include the code and output or make them available with the protocol. Avoid post hoc sample-size justifications based on the effect observed in the completed study.

## Precision, allocation, and practical feasibility

Equal allocation is usually efficient when per-participant costs and outcome variances are similar. If one arm costs more or exposure to an experimental intervention should be limited, unequal allocation may be justified, but with fixed total enrollment it generally reduces power. The loss is modest for mild imbalance and more pronounced as the ratio becomes extreme. Include site capacity and expected variance in the decision; do not assume a 2:1 ratio is “free” because the control group is easier to recruit.

Sample size is also a feasibility forecast. For a multicenter study, estimate site start-up, eligible population, consent, screening failure, monthly accrual, treatment adherence, retention, and endpoint completion. These factors can be modeled jointly: if monthly recruitment is variable, simulate the probability of reaching the required information by the funding deadline. A trial that needs 200 participants at a recruitment rate of 4 per month but has only 30 months of enrollment cannot meet its target without changing sites, eligibility, timeline, or design. Increasing the calculated N without a recruitment plan only makes the gap larger.

Cluster trials need a special feasibility check. Adding people within existing clinics can yield less information than adding clinics because participants within one cluster contribute correlated outcomes. The design-effect formula is a rough planning tool, and its reliability depends on the number of clusters, the cluster-size distribution, and the ICC. With few clusters, degrees of freedom and chance imbalance can dominate; simulate the exact randomization and small-sample analysis. Budget for cluster-level loss, because one clinic dropping out may remove an entire unit and compromise balance.

### Sensitivity table example

Suppose the main design depends on a standard deviation between 10 and 14 and a meaningful difference between 5 and 7 points. Recalculate across the full grid rather than selecting the single most favorable pair. Since sample size scales approximately with σ²/δ², increasing the SD from 12 to 14 raises the requirement by about 36%, while changing the target difference from 6 to 5 raises it by about 44%. This relationship makes clear why plausible measurement variability and clinical thresholds deserve more attention than minor rounding of a software output.

```r
grid <- expand.grid(sd = c(10, 12, 14), delta = c(5, 6, 7))
grid$n_per_arm <- with(grid, ceiling(
  2 * sd^2 * (qnorm(.975) + qnorm(.80))^2 / delta^2
))
grid
```

The grid reports analyzable participants per arm under the same normal approximation as above. Add separate columns for attrition, design effect, and multiplicity if they apply, rather than concealing these adjustments in one unexplained multiplier. If assumptions vary by scenario in a correlated way—for example, sites with lower event rates also recruit more slowly—model their joint distribution rather than combining impossible extremes.

## Record assumptions so the calculation can be revisited

When the final design changes, retain a versioned record of the original assumptions and the reason for each revision. A smaller feasible sample should be described with the power or precision it can actually provide, not justified afterward using its observed treatment effect. If a funder requires a fixed budget, compare options such as fewer sites, a more efficient endpoint, baseline adjustment, or longer follow-up while preserving the clinical question. Any efficiency gain must be credible before outcomes are known and compatible with the planned analysis.

Record the primary calculation in the protocol before recruitment starts. During the study, report enrollment and information progress without recasting the original target based on interim effect estimates unless a valid adaptation was prespecified. At closeout, compare planned and achieved follow-up, event counts, missingness, and precision to explain departures from the design.

## References and further reading

- Chow SC, Shao J, Wang H, Lokhnygina Y. *Sample Size Calculations in Clinical Research*. 3rd ed. Chapman & Hall/CRC; 2017.
- Julious SA. *Sample Sizes for Clinical Trials*. Chapman & Hall/CRC; 2009.
- Lakens D. Sample size justification. *Collabra: Psychology*. 2022;8(1):33267. [https://doi.org/10.1525/collabra.33267](https://doi.org/10.1525/collabra.33267)
- ICH E9(R1). *Estimands and Sensitivity Analysis in Clinical Trials*. International Council for Harmonisation; 2019. [Guideline](https://database.ich.org/sites/default/files/E9-R1_Step4_Guideline_2019_1203.pdf)
- Whitehead J. *The Design and Analysis of Sequential Clinical Trials*. 2nd ed. Wiley; 1997.
- The library's [interim analysis article](interim-analysis-and-monitoring-in-randomized-trials.html) discusses sequential monitoring; its [randomized trials article](randomized-controlled-trials.html) reviews allocation and trial estimands.
