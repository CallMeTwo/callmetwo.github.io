---
title: Type I and Type II errors
summary: A hypothesis test can be wrong in two directions - a false positive (Type I, controlled by alpha) or a false negative (Type II, governed by power).
---

## Overview and key ideas

A hypothesis test has four possible outcomes, depending on whether H0 is true and what decision is made:

| | H0 true | H0 false |
| --- | --- | --- |
| Reject H0 | Type I error (probability alpha) | Correct rejection (power, 1 - beta) |
| Fail to reject H0 | Correct decision | Type II error (probability beta) |

The **Type I error rate (alpha)** is the probability of a false positive - rejecting a true null - and is set by the researcher through the significance level, conventionally 0.05. The **Type II error rate (beta)** is the probability of a false negative - missing a real effect - and is determined by the effect size, the sample size, the variability, and alpha. The **power** of the study is 1 - beta and is conventionally targeted at 0.80 to 0.90 in the design stage.

For a fixed sample size the two errors trade off: tightening alpha makes beta larger (the test less sensitive) and loosening alpha makes beta smaller. Increasing the sample size is the only way to reduce both at once.

Because beta depends on the true effect size, which is unknown, power is really a *curve*: high power for large effects, falling to alpha for an effect of zero. The design convention is to pick the minimal clinically important difference, the effect the study must be able to detect with acceptable probability, and size the study so power reaches the target at *that* effect. A study that achieves 80% power for a large effect but only 35% for the clinically important one has not met the standard, even though a power calculation can be shown to report 80%.

## When to use it

- **Sample size calculation** - before a trial, choose n so that power to detect the minimal clinically important difference reaches the target (usually 80-90%).
- **Interpreting a non-significant result** - ask whether the study was powered for an effect of the size that matters; a "null" result from a small study may be an undetected effect.
- **Choosing alpha** - a confirmatory regulatory trial favours a low alpha (for example one-sided 0.025); an exploratory screening study tolerates a higher alpha in exchange for sensitivity.

## Assumptions and limitations

- Alpha, beta, and power are properties of the *procedure* over repeated samples, not of the single study in front of you: your particular result is not "80% likely to be correct" because the design power was 80%.
- **Observed (post hoc) power** - the power computed from the observed effect - is a monotone function of the p-value and adds nothing beyond what the p-value already says.
- The design-time power calculation assumes the true effect equals the planning value; if the true effect is smaller, the actual power is lower and the study is more prone to a Type II error than advertised.
- With multiple endpoints or subgroups, a per-test alpha of 0.05 no longer controls the probability of at least one false positive; see the multiple testing article.

## Worked example

A trial aims to detect a 5 mmHg difference in systolic blood pressure between two antihypertensive drugs (SD 15 mmHg in each arm, two-sided alpha 0.05). The required sample size is about 2 x (1.96 + 0.84)^2 x 15^2 / 5^2 = 142 patients per arm. If the study enrolls only 40 per arm, the power to detect a true 5 mmHg difference falls to roughly one-third: a "no difference" result from that smaller study is highly likely even when a clinically meaningful effect exists. Conversely, if a large trial with 1,000 patients per arm finds no difference, the residual probability of a Type II error for a 5 mmHg effect is small, making that null result much more credible.

## Interpretation and common pitfalls

- **"Non-significant means no effect."** A failure to reject is uninformative when power is low; report the power, sample size, and CI, and frame the result as "no detectable effect of this size".
- **Confusing the p-value with beta.** The p-value is not the probability of a Type II error; beta is a design-time property of the procedure.
- **Powering for the smallest detectable effect** rather than the minimal clinically important difference - a study can have "80% power" for an effect no one cares about while being underpowered for the one that would change practice.
- **Treating 80% power as a law.** It is a pragmatic compromise that accepts a 20% false-negative rate; for high-stakes confirmatory decisions, higher power is often warranted.

## References and further reading

- Dupont WD, Schuemaker L. *Statistical Power for Clinical Trials*. Marcel Dekker.
- Wasserstein RL, Lazar NA. [The ASA's statement on p-values: context, process, and purpose](https://doi.org/10.1080/00031305.2016.1154108). *The American Statistician*. 2016;70(2):129–133.
- Lang TA, Altman DG. [The SAMPL guidelines](https://www.equator-network.org/reporting-guidelines/sampl/), basic statistical reporting in biomedical journals.
- The [p-values article](/biostatistics-library/inference/p-values-and-significance-levels.html) explains the evidence summary and its limitations.
