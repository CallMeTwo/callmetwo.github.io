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

## Deriving and reporting a p-value

For a two-sided one-sample t test, the statistic is
\(t=(\bar y-\mu_0)/(s/\sqrt n)\), with \(n-1\) degrees of freedom under
the null model. Suppose 25 patients have mean systolic-pressure change −4.0
mmHg and SD 8.0. The standard error is \(8/\sqrt{25}=1.6\), so testing a
zero mean gives \(t=-4/1.6=-2.50\), df 24, and a two-sided p-value about
0.020. This is the probability, assuming the mean change is exactly zero
and the model is appropriate, of observing a statistic at least as extreme
as −2.50 in either direction. It is not the probability that the null is
true, nor the probability that chance alone caused the result.

```r
x <- c(-2, -5, 1, -8, -3, -4, 2, -6, -7, 0,
       -4, -5, 3, -2, -9, -1, -6, -3, 2, -5,
       -4, -7, 1, -2, -5)
t.test(x, mu = 0, alternative = "two.sided")
```

The toy vector is illustrative; its output need not match the summary
calculation above. In a real report give the estimate, interval, test
statistic with degrees of freedom, exact p-value (to sensible precision),
and sample size. “p = 0.000” is impossible: report “p < 0.001” when the
software rounds a very small value to zero at the chosen display precision.
The p-value depends on the test statistic, alternative hypothesis,
sampling model, stopping rule, and analysis choices; changing any of these
changes the reference distribution and the meaning of the calculation.

### Direction, tails, and design choices

The alternative must reflect the scientific question before data inspection.
A one-sided test can have more power in its prespecified direction, but it
cannot be used to claim an effect in the opposite direction when results
disappoint. A two-sided p-value is not always exactly twice a one-sided value
(this equality relies on symmetry and a statistic in the expected direction).
Likewise, repeated looks at accumulating data, outcome switching, selective
subgroup reporting, or choosing covariates after seeing their p-values make
the nominal reference distribution misleading. Sequential designs require
an adjusted boundary or an explicitly valid sequential method.

Statistical significance also does not measure magnitude. If a trial
estimates a 0.4-mmHg reduction with 95% CI −0.8 to −0.0 and p = 0.049, the
data remain compatible with a tiny effect and with an effect that might
matter clinically. Conversely, a clinically important estimate with a
wide interval and p = 0.12 may signal inadequate precision rather than
evidence of no effect. Interpret the interval against a prespecified
clinically important difference and the design’s limitations.

### Reproducible calculation and diagnostics

For a continuous outcome, inspect the distribution of within-group
residuals and the dependence structure before relying on a textbook test.
With paired observations, analyze within-person differences; with clusters,
account for intracluster dependence. A p-value computed from an incorrect
standard error is not repaired by more decimal places. Avoid reporting only
whether p fell above or below 0.05; that dichotomy discards information and
encourages threshold-driven claims. When many hypotheses are tested, define
the family and error criterion in advance (see the multiple-testing article).

## What a p-value can and cannot say

The p-value is calibrated to a reference model. A low value indicates that
the observed test statistic is unusual if the null parameter value and all
model assumptions hold. It does not quantify how much the data favor the
alternative over the null; likelihood ratios, Bayes factors, or posterior
probabilities answer different questions and require their own assumptions.
Nor does a p-value measure the probability of replication: replication
depends on effect size, variability, sample size, design, and analytic
choices. A result with p=0.04 is not categorically different from p=0.06;
the two values typically correspond to very similar data and should be
interpreted with estimates and uncertainty rather than a bright line.

P-values are also not invariant to analysis choices. For example, an
unadjusted comparison and an age-adjusted comparison can test different
estimands; a one-sided alternative changes the tail; a rank test may target
a distributional shift rather than a mean difference. Report the method
and estimand so readers know what null was evaluated. In regression, the
coefficient p-value tests a conditional model parameter given included
covariates. It is not a test of whether the variable is “important,” and
its value can change with coding, collinearity, and adjustment decisions.

The exact p-value should not be confused with the alpha chosen to govern a
decision. Alpha is set before data collection and represents a long-run
false rejection tolerance for a procedure; a p-value is computed after
observing data. If p<alpha, the rule rejects; if p≥alpha, it does not.
This decision does not establish a scientific truth. Evidence can be
graded, and a well-designed study with an estimate precise enough to rule
out clinically important effects may be more informative than a nominally
significant but fragile result.

## A result can be surprising for reasons beyond chance

The reference distribution assumes the analysis was selected as stated.
If authors inspect outcomes and report only the one with a small p-value,
the reported value is selected and no longer has the advertised
calibration. The same concern applies to repeated interim looks without
stopping boundaries, subgroup searches, and model selection. These
practices can yield impressive p-values even if every null is true. Use a
prespecified analysis plan, report deviations, and label exploratory
analyses honestly. Independent replication is particularly valuable when
the finding is selected from many candidates.

In observational epidemiology, a tiny p-value can coexist with residual
confounding, selection bias, or measurement error. Large data sets make
standard errors small, so small systematic discrepancies from zero can
produce tiny p-values. This says the estimated association is precise
conditional on the model; it does not certify causal identification.
Interpret the estimate against subject-matter knowledge, plausible bias,
absolute effect, and design strengths and weaknesses.

### Discreteness and exact tests

When a test and interval are obtained by inverting one another, they are
dual summaries: a two-sided level-0.05 test rejects a null value exactly
when its corresponding 95% confidence interval excludes that value. The
word “corresponding” matters. A likelihood-ratio p-value paired with a
Wald interval, or an exact test paired with a Wald interval, may not match
at the boundary because they use different constructions. Differences do
not automatically indicate an error, but the method should be made clear.
For multiple adjusted tests, pointwise intervals similarly do not
correspond to adjusted p-values unless the intervals are simultaneous.

Report exact p-values to two or three significant digits when useful, but
avoid spurious precision such as p=0.0478321. Values below a software
display threshold should be given as a bound, for example p<0.001. Never
write p=0: continuous test distributions assign a tail probability, even
if floating-point arithmetic underflows at extremely small values. For
large-scale genomic analyses, adjusted p-values can be extremely tiny;
scientific interpretation still depends on effect sizes and replication.
The reporting standard should preserve enough precision to distinguish
meaningful values without implying that the p-value itself is an exact
measure of evidence.

For discrete data, attainable test statistics and p-values come in jumps.
In a small 2×2 table, an exact test may have no possible p-value near 0.05;
its actual type-I error can be well below the nominal level because a
randomized test would be needed to attain exactly alpha. “Exact” means
that the null distribution is calculated from the assumed discrete model,
not that the conclusion is assumption-free. Fisher's exact test
conditions on observed margins; other unconditional exact procedures
answer a related but not identical question. State the test and the
conditioning assumptions, especially when competing methods differ.

For a two-sided test, “as extreme or more extreme” also requires a
definition. For symmetric continuous statistics, doubling the smaller
one-sided tail is standard. For discrete or asymmetric null distributions,
several two-sided conventions exist and can produce different p-values.
The method should be selected in advance and reported; a smaller value
chosen after examining alternatives is not a neutral technical detail.

### Simulated calibration

## Practical language for results

Prefer “the estimated reduction was 4.0 mmHg (95% CI 0.8 to 7.2; p=0.02)”
to “the treatment was effective (p<0.05).” The first gives direction,
magnitude, precision, and a model-based compatibility summary; the latter
reduces the conclusion to a threshold and hides uncertainty. If the study
was exploratory, say so. If the p-value was adjusted, name the procedure
and family. If the study was designed for non-inferiority or equivalence,
report the margin and the confidence-bound comparison rather than relying
on a superiority-test p-value.

The p-value is not the chance the observed result happened “by chance.”
Data arise from chance variation under all statistical models, and the
calculation conditions on the null and assumptions rather than assigning
causes to the realized result. A tiny p-value can arise from a real
association, a biased design, a mistaken model, or selective reporting.
The inference requires scientific judgment about which explanation is
plausible. Similarly, a p-value of 0.8 does not show that the null model is
true; it says the observed statistic is not unusual under that model.

### Nested model comparisons

In regression, a likelihood-ratio test compares nested models, such as a
model with and without a prespecified set of covariates. Under regularity
conditions, twice the log-likelihood difference follows an approximate
chi-square distribution with degrees of freedom equal to the number of
added parameters. This tests whether the larger model improves fit under
the likelihood framework; it does not show that the added predictors are
causal or improve out-of-sample prediction. With boundary parameters (for
example, a variance component equal to zero) the reference distribution
may be a mixture rather than ordinary chi-square. Model selection after
many candidate comparisons also introduces multiplicity and optimism.

Simulation also shows why an individual p-value cannot serve as a posterior
probability. Under a true null, p-values are spread across the interval,
not concentrated near zero; under a real alternative they tend to be
smaller, with the distribution depending on power. The same p=0.03 could
arise in a well-powered, prespecified trial of a plausible intervention
or as the smallest of dozens of exploratory analyses. The numerical value
does not encode which context produced it. Prior plausibility, study
quality, multiplicity, and publication processes all affect how much
confidence a reader should place in the finding.

At extremely small sample sizes, p-values are limited by the discreteness
of the data and the test may have low attainable power. At extremely large
sample sizes, negligible departures from a point null can yield tiny
p-values. Therefore, the same threshold has no universal substantive
meaning. Interpret the p-value jointly with an effect estimate, interval,
design quality, and prespecified decision threshold. If a protocol uses
multiple looks or a group sequential design, report the adjusted boundary
and cumulative alpha spending rather than comparing every interim p-value
with 0.05.

The long-run definition can be made concrete by simulation. If the null
model is true and the test is correctly calibrated, repeated null datasets
produce p-values that are approximately uniform on [0,1] for a continuous
test; thus about 5% fall below 0.05. Discrete tests often produce
super-uniform p-values, so the fraction is at most 5%. If model assumptions
fail, p-values need not be uniform, and false positive rates can be much
larger or smaller than intended.

```r
set.seed(7)
B <- 10000
pvals <- replicate(B, {
  x <- rnorm(20, mean = 0, sd = 1) # null mean is zero
  t.test(x, mu = 0)$p.value
})
mean(pvals < .05) # approximately .05, with Monte Carlo variation
hist(pvals, breaks = 20, main = "Null p-values", xlab = "p-value")
```

This simulation checks only the test under the simulated model. It does
not validate normality, independence, randomization, or the actual study's
data-generation process. Repeating an analysis many times on the same
dataset is not equivalent to this calibration exercise because the
repeated datasets here are generated under a known null model.

## References and further reading

- Wasserstein RL, Lazar NA. [The ASA's statement on p-values: context, process, and purpose](https://doi.org/10.1080/00031305.2016.1154108). *The American Statistician*. 2016;70(2):129–133.
- Greenland S, Senn SJ, Rothman KJ, et al. [Statistical tests, P values, confidence intervals, and power: a guide to misinterpretations](https://doi.org/10.1007/s10654-016-0149-3). *European Journal of Epidemiology*. 2016;31:337–350.
- Lang TA, Altman DG. [The SAMPL guidelines](https://www.equator-network.org/reporting-guidelines/sampl/), basic statistical reporting in biomedical journals.
- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott-Raven.
- The [null and alternative hypotheses article](/biostatistics-library/inference/null-and-alternative-hypotheses.html) describes the hypotheses that p-values evaluate.
