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

- Chow S, Shao W, Wang H, Lokhnygina Y. *Sample Size Calculations in Clinical Research*. 3rd ed. CRC Press, 2017.
- [CONSORT 2010 statement](https://doi.org/10.1136/bmj.c332), including transparent reporting of sample-size assumptions.
- Dupont W, Schuemaker M. *Power and Sample Size Calculation*. CRC Press.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland M. *An Introduction to Medical Statistics*. Oxford University Press.

The [randomized controlled trials article](/biostatistics-library/study-design/randomized-controlled-trials.html) discusses how the sample-size assumptions connect to a trial's design and analysis plan.
