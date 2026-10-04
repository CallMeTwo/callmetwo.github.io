---
title: Confidence intervals
summary: A 95% confidence interval is a random interval that, over repeated samples, covers the true parameter 95% of the time - not a probability statement about this particular interval.
---

## Overview and key ideas

A **confidence interval (CI)** gives a range of plausible values for an unknown parameter, computed from the sample. For a mean (normal data or large n), a 95% CI is x-bar +/- 1.96 x SE; for a proportion, the large-sample interval is p-hat +/- 1.96 x sqrt(p-hat (1 - p-hat) / n). The width of the interval, roughly 4 x SE, is a direct measure of precision: a wide interval signals an imprecise estimate.

The interpretation trips up most readers. In the frequentist framework the parameter (the true mean, say) is **fixed**, and it is the interval that is **random**. "95% confidence" means: if the study were repeated many times, each time computing an interval with the same rule, then 95% of those intervals would contain the true parameter. Once your interval has been computed, it either contains the true value or it does not - so saying "there is a 95% probability that the true mean lies in this interval" is strictly wrong.

A CI also doubles as a hypothesis test: for a two-sided test at level alpha, the null value is rejected exactly when the 100(1 - alpha)% CI excludes it. A 95% CI for a risk ratio that does not include 1 corresponds to a p-value below 0.05.

Three practical notes round out the picture. First, for small samples the multiplier 1.96 is replaced by the appropriate t critical value with n - 1 degrees of freedom, giving a slightly wider interval. Second, wider is not inherently worse: a wide interval for a rare outcome may be an honest reflection of limited information, and the remedy is usually a larger sample or a longer follow-up, not a different calculation. Third, all of this presumes the model is right: a confidence interval inherits the assumptions of the estimator that produced it, so a model with strong confounding produces a precise interval around the wrong target.

## When to use it

| Setting | Example question |
| --- | --- |
| Randomised trial | By how much does the new drug lower LDL, and how precise is that estimate? |
| Non-inferiority trial | Is the upper limit of the CI below the prespecified non-inferiority margin? |
| Epidemiological cohort | What range of relative risks is compatible with the observed association? |
| Regression analysis | What is the plausible range for a regression coefficient after adjustment? |

## Assumptions and limitations

- The x-bar +/- 1.96 x SE formula is exact for normal data and approximate otherwise through the central limit theorem. With small n and skewed data (biomarkers with long right tails, for example), a log transformation or a t-based interval is more reliable.
- The normal-approximation CI for a proportion misbehaves near 0 or 1; use a Wilson or exact (Clopper-Pearson) interval when the event count is small.
- For ratio measures (risk ratio, odds ratio, hazard ratio) the CI is computed on the log scale and back-transformed, producing an asymmetric interval.
- A CI assumes the analysis model is correct and the sample is representative of the target population. A biased study produces a narrow interval centred in the wrong place.

## Worked example

In a single-arm study, 45 of 100 patients on a statin had their LDL lowered by at least 20% at 12 months, so p-hat = 0.45. The standard error is sqrt(0.45 x 0.55 / 100) = 0.0497, giving a 95% CI of 0.45 +/- 1.96 x 0.0497, that is 0.353 to 0.548 (35% to 55%). The correct reading: across many repetitions of this 100-patient study, 95% of the intervals computed this way would cover the true proportion of patients who respond. It is *not* correct to say "there is a 95% probability that the true response rate is between 35% and 55%"; the frequentist 95% attaches to the long-run performance of the procedure, not to this particular realised interval.

## Interpretation and common pitfalls

- **"There is a 95% probability the parameter is in this interval."** Under the frequentist reading the interval is fixed once observed and the parameter is fixed; the 95% refers to repeated sampling, not to this interval.
- **Equating "the CI crosses the null" with "equivalence."** A wide interval that includes both clinically beneficial and harmful values is evidence of imprecision, not of harmlessness. Declaring equivalence requires a formal equivalence or non-inferiority design with prespecified margins.
- **Using the CI only as a disguised p-value.** The interval also conveys the range of clinically plausible effects; if it spans values that would change management, the study is too imprecise to be decisive whatever the p-value says.
- **Taking a narrow CI as proof of accuracy.** Width reflects sample size and variability, not freedom from bias.

## References and further reading

- Altman DG, Machin D, Bryant TN, Gardner MJ, eds. *Statistics with Confidence: Confidence Intervals and Statistical Guidelines*. 2nd ed. BMJ Books, 2000.
- Lang TA, Altman DG. [The SAMPL guidelines](https://www.equator-network.org/reporting-guidelines/sampl/), recommendations for reporting estimates and uncertainty.
- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott-Raven.
- The [point estimates and standard errors article](/biostatistics-library/inference/point-estimates-and-standard-errors.html) explains the sampling uncertainty that determines interval width.
