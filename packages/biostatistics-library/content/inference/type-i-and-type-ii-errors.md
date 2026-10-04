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

## Power as a design curve

For a two-arm parallel trial with equal group sizes, continuous normally
distributed outcome, common SD \(\sigma\), target difference \(\delta\),
and two-sided type-I error alpha, a useful large-sample approximation is
\(n_{arm}=2(z_{1-\alpha/2}+z_{1-\beta})^2\sigma^2/\delta^2\). With alpha
0.05, 80% power, SD 15, and difference 5 mmHg, this gives
\(2(1.96+0.84)^2(225)/25=141.1\), rounded up to 142 per arm. This is
an approximation: exact calculations use a noncentral t distribution and
may include allocation ratio, attrition, clustering, or multiplicity.
If 10% are expected to lack the primary endpoint, recruit
\(142/(1-.10)=158\) per arm, not 156? More exactly 157.8, rounded to
158. Attrition inflation assumes missingness only reduces analyzable n;
it does not remove bias caused by informative missingness.

Power changes continuously with the true effect. A trial sized for 5 mmHg
may have substantially lower power for 3 mmHg and greater power for 7 mmHg.
The planning target should therefore come from a clinically meaningful
effect, credible variability, and the intended analysis—not from an effect
chosen to make the sample size feasible. Sensitivity analyses across
plausible SDs and effects show how robust the design is. For non-inferiority,
power depends on the margin and the anticipated true difference; a larger
margin makes success easier but can make the clinical question less
valuable. For clustered trials, account for design effect and number of
clusters; simply multiplying the individual-level sample size by a design
effect may still understate the need when cluster count is small.

```r
alpha <- 0.05
power_target <- 0.80
sigma <- 15
delta <- 5
n_per_arm <- 2 * (qnorm(1 - alpha / 2) +
                  qnorm(power_target))^2 * sigma^2 / delta^2
ceiling(n_per_arm) # 142
ceiling(ceiling(n_per_arm) / 0.90) # 158 with 10% attrition
```

This z approximation reproduces the hand calculation, not a complete
protocol-level sample-size analysis. Use design-specific tools for
repeated measures, binary outcomes, time-to-event endpoints, cluster
randomization, adaptive designs, and planned interim analyses. Document
the assumptions in the protocol so readers can assess whether realized
conditions were close to those used for planning.

## Error rates across a research program

Alpha is a long-run conditional property: among repetitions in which the
null and model assumptions hold, the procedure rejects at most alpha of
the time. It does not mean the probability that a particular positive
finding is false. The latter depends also on the proportion of hypotheses
that are true, study power, bias, and selective publication. When many
endpoints or subgroups are examined, unadjusted per-test alpha no longer
controls the chance of any false positive; familywise procedures or a
hierarchical testing plan may be needed. False-discovery-rate procedures
target a different quantity and are more natural for broad discovery
screens, where some false leads are tolerable.

The trade-off between alpha and beta applies to a fixed design and fixed
sample size. Larger samples can reduce both errors for a fixed meaningful
effect, but cannot remove systematic bias. A very large observational
dataset can reject an exact null for a negligible association while
residual confounding remains; a small randomized trial can produce an
imprecise estimate despite low bias. Thus error control should accompany,
not replace, assessment of design validity and effect magnitude.

## Interpreting a negative result

### Consequences depend on the decision context

The relative costs of false positives and false negatives differ by
setting. In a confirmatory drug trial, a false positive may expose many
patients to an ineffective or harmful treatment, so stringent type-I
control is important. In a screening program, false negatives may delay
care, while some false positives can be resolved with confirmatory tests.
The conventional alpha=0.05 and power=80% are conventions, not universal
optimal values. A decision analysis can make the trade-offs explicit by
combining event probabilities, consequences, and available follow-up
actions. In high-consequence safety monitoring, thresholds may be chosen
to detect signals early while acknowledging that false alarms trigger
review rather than immediate definitive action.

Type-I and type-II errors are also conditional on a specified model and
analysis. If a trial has two co-primary outcomes and success requires both,
the global false-positive probability can be controlled differently than
if success requires either; the logical rule changes the error structure.
If the trial can stop early after multiple looks, nominal per-look alpha
is not the overall alpha. If a primary endpoint is missing for some
participants, the estimand and missing-data strategy influence both
standard error and bias. The design plan should specify the success rule,
interim monitoring, multiplicity, and missing outcome assumptions so the
advertised operating characteristics correspond to the actual decision.

### Distinguish error rates from posterior credibility

Suppose a field tests 100 independent null hypotheses at alpha=0.05 and
all nulls are true. The expected number of false rejections is 5, and the
probability of at least one is \(1-0.95^{100}\approx0.994\). If instead
10% of hypotheses are truly non-null and each such test has 80% power,
then out of 100 tests the expected counts are 5 false positives and 8 true
positives. Among the 13 expected discoveries, only 8/13≈62% correspond to
true alternatives on average under this simplified setup. This is not a
universal posterior probability for any one result; it illustrates why
the positive predictive value depends on prevalence of true hypotheses
and design quality, not alpha alone. Multiplicity control addresses one
part of this issue; bias and selective reporting can further reduce
credibility.

## References and further reading

If a result is nonsignificant, inspect the estimate and interval relative
to the important-effect threshold. For example, estimate 1 mmHg with 95%
CI −4 to 6 is compatible with moderate benefit and harm; it is inconclusive.
Estimate 0.2 with CI −0.5 to 0.9 may rule out effects larger than a
prespecified 1-mmHg threshold and provide evidence against a meaningful
benefit, despite the same nonsignificant label. Post-hoc “observed power”
computed from the observed effect mostly restates the p-value and should
not be used to certify the result. Report the planned power and, more
usefully, the confidence interval and the effects it excludes.

## Sample-size sensitivity and design constraints

For a binary endpoint, a two-sample proportion calculation makes baseline
risk explicit. For example, detecting a reduction from 20% to 15% with
equal allocation and two-sided alpha=0.05 needs substantially fewer
participants than detecting a reduction from 2% to 1.5%, although both
represent RR=0.75. The latter requires a much larger sample because there
are fewer events and the absolute difference is smaller. In addition to
statistical power, consider feasibility, event adjudication, competing
risks, and the consequences of false-positive treatment adoption.

```r
power.prop.test(p1 = .20, p2 = .15, sig.level = .05,
                power = .80, alternative = "two.sided")
power.prop.test(p1 = .020, p2 = .015, sig.level = .05,
                power = .80, alternative = "two.sided")
```

The function assumes independent binomial samples and uses an
approximation; exact or simulation-based methods may be preferable for
small samples, unequal allocation, or complex designs. The second
calculation illustrates the effect of baseline event frequency, not a
universal enrollment recommendation. For a time-to-event endpoint, use
anticipated event accrual and follow-up rather than treating every
participant as if fully observed for a fixed period.

```r
normal_power <- function(n_per_arm, delta, sd, alpha = 0.05) {
  se <- sd * sqrt(2 / n_per_arm)
  zcrit <- qnorm(1 - alpha / 2)
  ncp <- delta / se
  pnorm(-zcrit - ncp) + pnorm(zcrit - ncp, lower.tail = FALSE)
}
normal_power(142, delta = 5, sd = 15) # approximately 0.80
```

This normal approximation is intended for planning intuition. For a
protocol, use an exact noncentral-t calculation or a validated design
package and match the planned model, allocation ratio, alpha, and missing
data assumptions.

The approximation in the example assumes equal allocation, a continuous
endpoint, independent participants, common SD, and a normal estimator. The
sample size scales quadratically with variability and inversely with the
square of the target effect: doubling SD quadruples n, while targeting a
3-mmHg difference rather than 5 mmHg multiplies n by \((5/3)^2\approx2.78\).
This sensitivity is why the protocol should justify the SD and important
difference using prior studies or clinical input, then show plausible
alternatives. A falsely optimistic SD produces an underpowered study even
if the formula is applied perfectly.

For a binary endpoint, power depends on both event probabilities and the
allocation ratio. A relative effect does not uniquely determine n: a risk
reduction from 20% to 15% is easier to detect than from 2% to 1.5%, despite
the same RR=0.75, because events are much rarer in the latter setting.
Time-to-event sample size is often driven primarily by the number of
events, so accrual and follow-up assumptions matter as much as total
enrollment. Loss to follow-up, competing events, and nonadherence can
reduce event counts and power; inflate using realistic assumptions and
consider sensitivity analysis rather than a single fragile forecast.

When multiple primary hypotheses are tested, a Bonferroni allocation of
alpha across m tests increases the required sample size. A gatekeeping or
hierarchical plan can preserve power for important secondary questions,
provided the sequence is clinically justified and prespecified. Adaptive
designs and interim looks can use information efficiently but need
adjusted stopping boundaries that preserve type-I error; naïve repeated
testing at 0.05 inflates false positives. Futility stopping can reduce
expected sample size, but should use a planned criterion and distinguish
nonbinding futility rules from efficacy boundaries.

## Decision errors are not the only study risks

## Power under unequal allocation and clustering

With allocation ratio r=n1/n0, the variance of a difference between
independent means is \(\sigma^2(1/n_1+1/n_0)\). For fixed total sample
size, equal allocation minimizes this variance when outcome variance and
per-participant cost are equal. If treatment is more expensive or safety
information is especially valuable in one arm, unequal allocation may be
reasonable, but it generally requires more participants for the same
power. When arm variances differ, optimal allocation can instead be
proportional to their SDs under equal cost, though practical and ethical
considerations may dominate.

Cluster randomization adds correlation. If the individual-level target is
142 per arm and average cluster size is 20 with ICC=0.05, design effect is
\(1+19(0.05)=1.95\), implying roughly 277 individuals per arm after the
simple inflation. But this is only a first approximation: number of
clusters, unequal cluster sizes, small-sample degrees of freedom, and
cluster-level variation matter. A trial with 14 clusters total may have
far less power than one with the same patient count across 80 clusters.
Power calculations should be based on the randomized unit and use
appropriate small-sample methods; adding patients to a few clusters may
not compensate for too few independent clusters.

The effective sample-size concept is useful for intuition but does not
mean a clustered trial literally contains a fractional number of
independent participants. It highlights that information depends on the
correlation structure. Measure or justify the ICC from relevant data and
explore uncertainty in it. If ICC is underestimated, planned enrollment
may be insufficient; if clusters vary widely in size, the design effect
can exceed the equal-size approximation.

Power calculations address random sampling variability under specified
models. They do not account for systematic bias from poor randomization,
outcome assessment, selective attrition, unblinded measurement, or
confounding. A high-powered biased study can be precisely wrong. Nor does
80% power mean an 80% chance the study conclusion is correct; posterior
probability of a hypothesis requires prior probabilities and a full
evidence model. For a single study, report the estimate and interval, and
evaluate how results bear on meaningful benefit and harm.

Consider a trial with observed difference 0.2 mmHg and 95% CI −3.7 to 4.1.
If a 5-mmHg benefit matters, the interval makes such a benefit less
compatible with data than it would be in a tiny study, but still does not
prove exact equality. A formal equivalence design would prespecify margins
and require the full interval inside them. Avoid retrospective statements
such as “the study had 80% power to detect the observed effect”; design
power is calculated for an anticipated effect, while observed uncertainty
is summarized by the interval.

## References and further reading

- Dupont WD, Schuemaker L. *Statistical Power for Clinical Trials*. Marcel Dekker.
- Wasserstein RL, Lazar NA. [The ASA's statement on p-values: context, process, and purpose](https://doi.org/10.1080/00031305.2016.1154108). *The American Statistician*. 2016;70(2):129–133.
- Lang TA, Altman DG. [The SAMPL guidelines](https://www.equator-network.org/reporting-guidelines/sampl/), basic statistical reporting in biomedical journals.
- The [p-values article](/biostatistics-library/inference/p-values-and-significance-levels.html) explains the evidence summary and its limitations.
- Chow SC, Shao J, Wang H, Lokhnygina Y. *Sample Size Calculations in Clinical Research*. 3rd ed. Chapman & Hall/CRC, 2017.
- Julious SA. *Sample Sizes for Clinical Trials*. Chapman & Hall/CRC, 2010.
