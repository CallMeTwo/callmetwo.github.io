---
title: Sample size and statistical power
summary: Determining how many participants a study needs to detect a clinically meaningful effect with a pre-specified probability, controlling false-positive and false-negative error.
---

## Overview and key ideas

**Statistical power** is the probability that a study will correctly reject the null hypothesis when a true effect of a specified size exists. It is set in advance alongside the significance level (α, typically 0.05 two-sided), the clinically important effect size (the smallest difference worth detecting, e.g. a 10-percentage-point reduction in event rate), the outcome's variability (SD for continuous outcomes), and the design (two groups vs one, cluster randomisation, crossover). **Sample size calculation** inverts this: given α, power (conventionally 80% or 90%), and the target effect size, it computes the number of participants required.

The four inputs that determine power are α, the effect size, the outcome variance, and the sample size; changing any one changes the others. A study underpowered for the effect it claims to detect cannot distinguish a real effect from chance even when the null is rejected, and a non-significant result is uninterpretable without knowing what effect the study was powered to find.

Key formulas (two independent groups, two-sided):

- Two means: n per group ≈ 2 (z_{1−α/2} + z_{1−β})² σ² / Δ²
- Two proportions: n per group ≈ [z_{1−α/2} √(2 p̄(1−p̄)) + z_{1−β} √(p₁(1−p₁) + p₂(1−p₂))]² / (p₁ − p₂)²

where p̄ = (p₁ + p₂)/2 and Δ is the difference in means.

## When to use it

| Setting | Example calculation question |
| --- | --- |
| Phase III superiority trial | How many patients per arm to detect a drop in 5-year event rate from 20% to 10% with 80% power at α = 0.05 two-sided? |
| Non-inferiority trial | How many patients to demonstrate that the 95% CI for the treatment difference stays within −5 mmHg (the non-inferiority margin) for a blood-pressure drug? |
| Cluster-randomised trial | How many clusters (schools, practices) are needed, given a design effect of 4 and expected 30% loss to follow-up? |
| Diagnostic accuracy study | How many patients to estimate sensitivity within a 95% CI half-width of 3 percentage points when sensitivity is expected near 90%? |
| Equivalence or feasibility pilot | A pilot study of 20–30 patients to estimate the event rate and SD for the definitive trial's sample size calculation, not to answer the primary question. |

## Assumptions and limitations

- **The effect size is an assumption, not a fact.** The calculation is conditional on the effect really being as large as assumed; if the true effect is half the assumed size, power collapses. Base the assumed effect on prior evidence, not on the smallest effect that will look plausible.
- **The outcome variance is assumed.** An underestimated SD inflates the required n; a conservative (larger) SD assumption is safer.
- **Independence of observations.** Cluster designs, repeated measures, and matched pairs violate this; the design effect factor 1 + (m − 1)ρ (m = cluster size, ρ = intra-class correlation) must be applied, or standard errors are too small and power is overstated.
- **Loss to follow-up.** The calculated n is the number analysed; if 20% are expected to drop out, recruit n / 0.8 and state this explicitly in the protocol.
- **Non-inferiority margins** must be justified clinically before the calculation; the margin, not a p-value, is the central design parameter.

## Worked example

A trial will compare a new drug with standard therapy for a chronic condition. Standard therapy yields a 5-year event rate of 20% (p₁ = 0.20). The clinically important target is an absolute reduction to 10% (p₂ = 0.10), so Δ = 0.10. Set α = 0.05 two-sided (z_{1−α/2} = 1.96) and power 80% (z_{1−β} = 0.84).

p̄ = (0.20 + 0.10)/2 = 0.15.

- z_{1−α/2} √(2 × 0.15 × 0.85) = 1.96 × √0.255 = 1.96 × 0.505 = 0.989
- z_{1−β} √(0.20×0.80 + 0.10×0.90) = 0.84 × √0.25 = 0.84 × 0.50 = 0.420
- n per group = (0.989 + 0.420)² / 0.10² = 1.409² / 0.01 = 1.987 / 0.01 ≈ **199 per group**

Round up to 200 per group. With 15% expected loss to follow-up, recruit 200 / 0.85 ≈ 236 per group, for a total of 472 randomised patients. If the true effect were only 0.05 (20% vs 15%), the required n would rise to roughly 800 per group — the sample size is extremely sensitive to the assumed effect size.

## Interpretation and common pitfalls

- **Underpowered studies are the norm, not the exception.** Most clinical trials are powered for 80% of the assumed effect, meaning that even when the assumed effect is real, one in five studies will miss it. A non-significant result from an underpowered study is weak evidence of no effect, not evidence of a small effect.
- **Treating the sample size as a fixed target rather than a conditional statement.** "The study needed 400 patients" is meaningless without stating the effect size and outcome variance the 400 was calculated for; report all inputs, not just n.
- **Using observed (post-hoc) power.** Post-hoc power (power computed from the observed effect size) is a monotone function of the p-value; it adds no information and is misleading. A non-significant result always has post-hoc power below 50%; that is tautological, not informative.
- **Ignoring the design effect in cluster trials.** A trial with 30 clusters of 100 patients each (raw n = 3,000) with ICC = 0.05 has a design effect of 1 + 99 × 0.05 ≈ 6; the effective sample size is about 500, not 3,000. Computing power from the raw count overstates precision by roughly the square root of the design effect.

## References and further reading

## Power is a design property, not an interpretation of results

## Binary outcomes, allocation ratios, and precision

## Dropout inflation and cluster attrition

Inflating analyzable N by (1/(1-r)) handles a fixed expected fraction (r) of independent participant losses, but not differential attrition, cluster loss, or informative missingness. In cluster trials, losing one clinic can remove many participants and change balance; plan cluster-level contingency and consider unequal cluster size. If attrition differs by arm, use arm-specific projections and power under plausible missing-data mechanisms. Recruitment targets should include ineligible screening failures separately from post-enrollment dropout.

## Information fraction and interim monitoring

## Design assurance and Bayesian assurance

### Equivalence sample size implication

For equivalence, the null is that the difference is at or beyond either margin; power concerns placing the full confidence interval within the equivalence bounds when the true difference is near zero. Consequently, equivalence often requires more participants than a superiority test designed to detect a moderate difference. Specify the clinically justified margin before planning, account for expected adherence and assay sensitivity, and use a validated two-one-sided-tests or CI-based calculation. A smaller margin can sharply increase required N but yields stronger evidence of similarity.

Conventional power conditions on fixed nuisance parameters and a fixed alternative. In practice, baseline rate, variance, and true effect are uncertain. Assurance averages power over a distribution for these parameters and can better describe the probability a design succeeds before data are observed. Bayesian assurance integrates over prior uncertainty; frequentist design assurance can average over scenario weights. Results depend on those distributions, so publish assumptions and compare with conventional power. This is particularly useful for small populations, rare diseases, or uncertain event rates.

Recruitment feasibility can also be probabilistic: simulate monthly enrollment rates, site activation, screening failure, and dropout to estimate the chance of reaching target information by a funding deadline. A statistically powered design that cannot accrue its target is not viable. Adaptive sample-size rules can be planned, but adaptation must be included in operating-characteristic simulations and governance documents.

Repeated interim efficacy testing can inflate type-I error. Group-sequential boundaries (O'Brien–Fleming, Pocock, or alpha-spending) allocate the error over information time; they alter critical values and sometimes expected sample size. O'Brien–Fleming boundaries are stringent early and close to the final nominal level, while Pocock boundaries are more even. Futility stopping can be nonbinding or binding, and its definition affects operating characteristics. Plan the number/timing of looks, data maturity, boundary, committee, and effect-estimation adjustment. Early stopping for benefit often overestimates effects, especially for modest trials.

## Event-rate uncertainty and blinded re-estimation

When control event rate is uncertain, power is highly sensitive to it. Simulate low, central, and high event-rate scenarios, recruitment rates, and censoring. Blinded re-estimation can update pooled event incidence or variance without exposing treatment contrast, provided its rule and any maximum sample-size adjustment are prespecified. An unblinded adaptation requires controlled type-I error methods and independent oversight. Report both planned and achieved event counts; a time-based study end can yield fewer events than expected even with full enrollment.

For two independent proportions \(p_1,p_0\) with group sizes \(n_1,n_0\), the standard error under the alternative is approximately \(\sqrt{p_1(1-p_1)/n_1+p_0(1-p_0)/n_0}\). Power calculations use a null-based critical value and alternative distribution; exact and score-based procedures can differ from a simple normal approximation when events are rare. A 1:1 allocation is usually most efficient for equal per-person costs and equal variances, but unequal allocation may be appropriate when one treatment arm is expensive or safety exposure should be limited. For fixed total N, imbalance usually reduces power.

The clinically meaningful difference must be paired with a credible control event rate. If the assumed control risk is 20% but the true risk is 10%, absolute event counts and power may differ substantially. Use blinded sample-size re-estimation based on nuisance parameters (such as pooled event rate or SD) when justified and prespecified; changing the target effect after unblinded interim results compromises error control. For noninferiority, sample size depends on the margin, expected true difference, and one-sided type-I error; a wider margin can make a trial smaller while weakening clinical protection.

## Simulation for complex designs

Analytic formulae become unreliable for adaptive randomization, zero-inflated outcomes, complex longitudinal covariance, competing-risk estimands, multiple co-primary endpoints, or small-cluster designs. Simulation can estimate operating characteristics by repeatedly generating data under plausible scenarios, applying the exact planned randomization and analysis, and recording rejection, bias, coverage, convergence, and stopping. The simulation code should be validated with simple special cases and shared with the protocol.

```r
set.seed(2026)
B <- 2000
reject <- replicate(B, {
  x <- rnorm(120, mean = 0, sd = 1)
  y <- rnorm(120, mean = 0.25, sd = 1)
  t.test(x, y, var.equal = FALSE)$p.value < 0.05
})
mean(reject)  # Monte Carlo estimate of power for this simple scenario
```

Monte Carlo error for an estimated power \(\hat p\) is approximately \(\sqrt{\hat p(1-\hat p)/B}\); at power .80 with B=2,000 it is about .009. Increase replicates when comparing close design options. The example is a teaching demonstration, not a substitute for simulating the intended design, missingness, and prespecified primary analysis.

## Multiplicity and decision-based sample size

Multiple primary endpoints, treatment arms, dose comparisons, interim looks, and subgroup claims create multiplicity. A hierarchical testing strategy, gatekeeping, Holm adjustment, or family-wise alpha allocation can control error; the selected strategy changes power and must be incorporated into sample-size planning. False-discovery-rate control may suit exploratory screening but does not provide the same family-wise guarantee. Clearly identify confirmatory versus exploratory objectives.

In Bayesian designs, sample size can be chosen to meet posterior probability criteria under a prior, but also evaluate frequentist operating characteristics (type-I error and power) across plausible true effects. Decision-theoretic designs can minimize expected loss or maximize expected utility, but require explicit utilities and stakeholder agreement. A small expected sample size under early stopping does not imply a small maximum sample size; budget for the maximum and report the stopping probabilities.

## Precision, feasibility, and interpretation

A design can be adequately powered for a moderate effect yet too imprecise for a rare serious harm or subgroup. Consider co-primary precision goals for safety if they drive decisions. Feasibility parameters include recruitment rate, retention, event incidence, adherence, cluster availability, and data latency. Pilot studies estimate feasibility and instrument behavior more reliably than treatment effects; small pilot effect estimates are noisy and should not be used uncritically for definitive planning.

After the study, compare the observed confidence interval with prespecified clinically important bounds. A nonsignificant finding whose interval excludes meaningful benefit can support lack of a clinically important effect; one with a wide interval remains inconclusive. Do not claim equivalence from failure to reject superiority. Equivalence requires prespecified two-sided margins and confidence-interval containment; noninferiority requires the interval to exclude an unacceptable loss according to the chosen direction and analysis population.

### Cluster and event-driven design effects

If an individually randomized calculation requires 100 participants per arm but randomization is by clinic with average 15 participants and ICC=.03, the equal-size design effect is \(1+14(.03)=1.42\), giving about 142 participants per arm before attrition. Unequal clinic sizes increase the design effect; the number of clinics also constrains reliable estimation and degrees of freedom. Add clusters rather than only increasing people per cluster when feasible. For event-driven survival trials, calculate the number of events needed for the target hazard ratio and power, then project recruitment and follow-up using control survival, accrual duration, dropout, and administrative study end.

For a two-sided log-rank comparison with equal allocation, a common approximation for required events is \(D\approx4(z_{1-\alpha/2}+z_{1-\beta})^2/[\log(HR)]^2\). At HR=.70, alpha=.05 and power=.80, this is about 247 events. This is an event target, not a participant count; low event incidence may require a much larger cohort and longer observation. Verify assumptions with design-specific software or simulation.

Power is the probability that a prespecified test rejects its null under a particular alternative and a fully specified design. It depends on sample size, effect size, outcome variability or event rate, allocation ratio, significance level, dependence, and analysis. “Observed power” computed from the observed effect is largely a transformation of the p-value and adds no useful information; report the effect estimate and confidence interval. A nonsignificant result can be compatible with both no meaningful effect and clinically important benefit or harm.

For two independent means with equal allocation, the standard error of the difference is \(\sigma\sqrt{2/n}\). If \(\sigma=12\), the target difference is 6, two-sided \(\alpha=.05\), and power 80%, then \(n≈2(1.96+.84)^2(144)/36≈63\) per arm. If 15% attrition is expected, randomize about \(63/.85≈75\) per arm. This inflation assumes the attrition is roughly proportional and does not itself repair informative missingness.

```r
delta <- 6; sd <- 12; alpha <- .05; target_power <- .80
n <- ceiling(2 * (qnorm(1 - alpha / 2) + qnorm(target_power))^2 * sd^2 / delta^2)
n_adjusted <- ceiling(n / (1 - .15))
c(analyzable_per_arm = n, randomize_per_arm = n_adjusted)
```

The formula assumes normally distributed outcomes or adequate large-sample behavior, equal variance, independent individuals, and no interim alpha spending. For a binary outcome, power depends on both event probabilities and allocation; for survival endpoints, it is often driven primarily by the number of events, with recruitment and follow-up determining how many participants are needed to accrue them. For cluster trials, apply a design effect only as an approximation and ensure enough clusters to estimate between-cluster variation.

## Choosing assumptions and design targets

Choose the minimum clinically important difference in consultation with clinicians, patients, and decision-makers. Use external evidence or pilot data for baseline rates and variability, but avoid an unstable small pilot estimate as the sole input. Explore a range: show how required sample size changes with plausible SD, event rate, loss to follow-up, and effect. Conservative event assumptions may increase sample size, but “conservative” depends on whether the uncertainty concerns feasibility or power. The primary estimand and analysis must match the calculation—for example, a superiority calculation cannot be relabeled a noninferiority design after observing results.

Type-I error and power describe repeated-study operating characteristics under specified assumptions. They are not the probability that the alternative is true or that a significant result is replicated. Multiplicity across primary outcomes, doses, interim looks, or subgroups affects false-positive control and should be planned. A group-sequential design can stop early for benefit, harm, or futility, but requires alpha-spending or equivalent boundaries and may produce biased effect estimates after early stopping. Bayesian designs can target posterior decision probabilities and expected losses, but operating characteristics across scenarios should still be evaluated.

For precision-based planning, specify a desired confidence interval width rather than power against one effect. For estimation studies, this is often more aligned with the aim. For diagnostic sensitivity, sample size is driven by the number with disease; precision in a rare condition may require screening many more participants than the diseased subgroup size suggests. For prevalence, incorporate sampling design and expected prevalence. For prediction models, events-per-parameter rules are inadequate alone; expected overfitting, shrinkage, calibration, and validation sample size matter.

## Reporting and reproducibility

Report the exact formula or software, version, inputs, allocation, sidedness, alpha, target power or precision, assumed event rates/SD, attrition, design effect, and any multiplicity adjustment. Include sensitivity scenarios and distinguish total recruited from analyzable sample size. Preserve code and output. Post hoc sample size justifications based on observed effects are misleading; instead report what effect sizes the interval rules out or remains compatible with. If recruitment falls short, quantify the resulting precision and avoid lowering the clinical threshold after seeing data.

- Chow SC, Shao J, Wang H, Lokhnygina Y. *Sample Size Calculations in Clinical Research*. 3rd ed. Chapman & Hall/CRC; 2017.
- Julious SA. *Sample Sizes for Clinical Trials*. Chapman & Hall/CRC; 2010.
- Riley RD, Ensor J, Snell KIE, et al. Calculating the sample size required for developing a clinical prediction model. *BMJ*. 2020;368:m441. https://doi.org/10.1136/bmj.m441

- Chow S, Shao W, Wang H, Lokhnygina Y. *Sample Size Calculations in Clinical Research*. 3rd ed. CRC Press, 2017.
- [CONSORT 2010 statement](https://doi.org/10.1136/bmj.c332), including transparent reporting of sample-size assumptions.
- Dupont W, Schuemaker M. *Power and Sample Size Calculation*. CRC Press.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland M. *An Introduction to Medical Statistics*. Oxford University Press.

The [randomized controlled trials article](/biostatistics-library/study-design/randomized-controlled-trials.html) discusses how the sample-size assumptions connect to a trial's design and analysis plan.
