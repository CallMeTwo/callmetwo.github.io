---
title: P-values and significance levels
summary: The p-value is the probability of data at least this extreme under the null hypothesis, compared with a prespecified threshold alpha to decide whether to reject it.
---

## Overview and key ideas

The **p-value** is the probability, assuming the null hypothesis is true, of obtaining a test statistic at least as extreme as the one actually observed. It measures incompatibility between the data and the null: a small p means that, if the null were true, data this extreme would be unusual.

The **significance level (alpha)** - conventionally 0.05, and often 0.025 one-sided in confirmatory trials - is the threshold chosen before the data are examined. If p is at most alpha, the null is rejected; otherwise it is not rejected. For a two-sided test the level is split across both tails, so the p-value is twice the one-tail probability for a symmetric test statistic.

The p-value is a property of the data under the null, not a probability about hypotheses: it is not P(H0 is true | data), and it is not the probability that the observed effect is "real".

A useful way to build intuition for what a p-value does and does not say is to fix the true state of the world and ask what p-values the procedure would produce. If the null is exactly true, a p-value at or below 0.05 appears in exactly 5% of repetitions. If the null is false and the effect is large, p-values concentrate far below 0.05. If the null is false but the effect is tiny, p-values scatter around and above the threshold and the test will often "fail". The p-value of your one study is a single draw from whichever of these distributions applies - and without knowing the true effect and the power of the design, you cannot say which draw you have.

## When to use it

| Setting | Role of the p-value |
| --- | --- |
| Confirmatory trial, prespecified primary endpoint | Decision rule at a prespecified alpha, often one-sided 0.025 |
| Trial secondary and exploratory endpoints | Descriptive only; interpret cautiously with multiplicity in mind |
| Observational study | Screening for associations worth investigating, not proof of causation |
| Meta-analysis | Combining study-level evidence on a common scale |

## Assumptions and limitations

- The p-value is valid only under the test's conditions: correct randomisation or error model, independent observations, and the prespecified analysis. Optional stopping, switching endpoints, or subgroup fishing makes the nominal p-value too small.
- The p-value depends heavily on sample size: with a very large n a trivially small effect becomes "significant", and with a small n a clinically large effect may not reach significance. The p-value says nothing about the magnitude of the effect.
- The 0.05 threshold is a convention, not a boundary of evidence: p = 0.051 and p = 0.049 are almost indistinguishable in strength of evidence but are treated categorically differently.
- The p-value is computed as if the null were exactly true; in practice it is only approximately true, which matters most when interpreting borderline values.

## Worked example

A trial randomises 80 patients per arm to an antihypertensive or to placebo. Over six months, systolic blood pressure falls 4.2 mmHg more in the treatment arm, with a standard error of the difference of 2.0 mmHg. The test statistic is z = 4.2 / 2.0 = 2.10, giving a two-sided p-value of about 0.036. Because 0.036 is below 0.05, the null hypothesis of no difference is rejected. The correct reading is: if the drug truly had no effect, a difference of 4.2 mmHg or more would occur in about 3.6% of similarly sized trials - not "there is a 96.4% probability the drug works". The 95% CI for the difference, 4.2 +/- 1.96 x 2.0, that is 0.3 to 8.1 mmHg, should be reported alongside, because it shows the range of clinically plausible effects rather than a pass/fail verdict at 0.05.

## Interpretation and common pitfalls

- **"The p-value is the probability that the null is true."** It is P(data this extreme | H0 true), computed with the null assumed; reversing the conditioning gives a different (Bayesian) quantity.
- **"p = 0.03 means a 3% chance the result is due to chance."** The p-value is the tail probability of the test statistic under H0, not a probability that randomness produced the study.
- **Dichotomising at 0.05.** "Significant" and "not significant" are administrative labels, not a categorical difference in evidence; report the p-value and the effect size with its CI.
- **P-hacking.** Optional stopping, selective outcome reporting, and subgroup fishing all push p-values down and invalidate the nominal alpha.

## References and further reading

- Wasserstein RL, Lazar NA. [The ASA's statement on p-values: context, process, and purpose](https://doi.org/10.1080/00031305.2016.1154108). *The American Statistician*. 2016;70(2):129–133.
- Greenland S, Senn SJ, Rothman KJ, et al. [Statistical tests, P values, confidence intervals, and power: a guide to misinterpretations](https://doi.org/10.1007/s10654-016-0149-3). *European Journal of Epidemiology*. 2016;31:337–350.
- Lang TA, Altman DG. [The SAMPL guidelines](https://www.equator-network.org/reporting-guidelines/sampl/), basic statistical reporting in biomedical journals.
- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott-Raven.
- The [null and alternative hypotheses article](/biostatistics-library/inference/null-and-alternative-hypotheses.html) describes the hypotheses that p-values evaluate.
