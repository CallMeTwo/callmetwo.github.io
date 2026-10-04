---
title: Null and alternative hypotheses
summary: The null hypothesis states the default position that the test must reject, and the alternative states what the researcher wants evidence for.
---

## Overview and key ideas

Hypothesis testing formalises a decision problem with two competing statements. The **null hypothesis (H0)** is the default position - typically no difference, no association, or no effect - and it carries the burden of proof: it is rejected only when the data are sufficiently incompatible with it. The **alternative hypothesis (H1)** states what the researcher wants evidence for.

The alternative can be **two-sided** (an effect in either direction, for example H1: mean difference not equal to 0) or **one-sided** (an effect in a prespecified direction, for example H1: the new treatment is superior). Two-sided tests split the significance level between both tails and are the default in medical research.

Two structural points matter. First, the test is asymmetric: failing to reject H0 is not the same as accepting it; it only means the data did not reach the threshold for rejection. Second, the null is a mathematical device that defines the error probabilities of the procedure; it is not a scientific claim the researcher believes to be true.

The choice between a point null ("difference exactly equals 0") and a composite or margin-based null deserves attention. Exact point nulls are mathematically convenient and are the default for superiority tests, but they can be unambitious: if the true difference is 0.001 mmol/L, the null is false and the study will eventually "reject" it while nothing of interest has been shown. Margin-based hypotheses (non-inferiority, equivalence) instead anchor the test to a clinically meaningful boundary, which is often a better formulation of the scientific question, at the cost of having to justify the margin up front.

## When to use it

| Setting | Typical formulation |
| --- | --- |
| Superiority trial | H0: treatment difference = 0; H1: difference is not 0 (two-sided) |
| Non-inferiority trial | H0: new treatment is worse by at least the margin; H1: worse by less than the margin |
| Case-control study | H0: odds ratio = 1; H1: odds ratio is not 1 |
| Observational cohort | H0: no exposure-disease association; H1: an association exists |

## Assumptions and limitations

- A one-sided H1 is defensible only if a result in the opposite direction would be of no scientific or regulatory interest, and only if it is prespecified before the data are seen; a post hoc one-sided test is a route to p-hacking.
- In non-inferiority and equivalence designs the null is not "no effect" but "an effect of at least a clinically meaningful size"; the margin must be clinically justified, because the conclusion is only as meaningful as the margin.
- The probability statements behind the test (type I and type II errors) are valid only under the test's conditions: randomisation or a correct error model, independent observations, and the prespecified analysis. Design or selection bias invalidates the p-value no matter how carefully the hypotheses are worded.
- The choice of null value is a modelling decision that changes the answer; "H0: difference = 0.1" is a different test from "H0: difference = 0".

## Worked example

A non-inferiority trial compares a new oral anticoagulant with warfarin for stroke prevention in atrial fibrillation. The prespecified margin is 1.5 percentage points per year of stroke risk: the new drug would be acceptable even if it were worse by up to 1.5% per year. The hypotheses are H0: (new drug - warfarin) stroke rate is at least +1.5% versus H1: the difference is less than +1.5%. The observed rate difference is -0.2% (favouring the new drug) and the upper limit of the 95% CI is +1.1%. Because even the worst value compatible with the data lies below the margin, H0 is rejected and non-inferiority is declared: the data are incompatible with the new drug being clinically worse by the prespecified margin.

## Interpretation and common pitfalls

- **"We proved the null."** A failure to reject H0 is an absence of evidence against it, not evidence for it; a small underpowered study "proves" almost nothing in either direction.
- **Believing that rejecting H0 establishes H1 as true.** It shows the data are incompatible with H0 at the chosen level; the effect size and its CI, not the verdict, describe what remains plausible.
- **Choosing a one-sided test after seeing the data** to obtain a smaller p-value - invalid, because the tail probability was selected after the direction of the result was known.
- **Mismatching hypothesis and decision.** Using a two-sided test when only one direction would change practice, or the reverse, wastes power or creates a question no one asked.

## Hypotheses as estimands and decision boundaries

The null is not chosen in isolation: it is a statement about a clearly
defined estimand. Before writing \(H_0\), specify population, treatment
conditions, endpoint, follow-up, and summary measure. For example,
“treatment effect” could mean a 12-month risk difference in all randomized
participants under a treatment-policy strategy, or a hazard ratio among
those remaining event-free. Those are different quantities and induce
different hypotheses. In a randomized trial, an intention-to-treat
estimand preserves the randomized comparison but may include treatment
discontinuation; a per-protocol estimand asks about adherence and requires
additional assumptions to avoid selection bias.

For superiority on an additive scale, one may write \(H_0:\Delta=0\) versus
\(H_1:\Delta\ne0\), where positive and negative signs must be defined in
advance. In a non-inferiority trial, define \(\Delta=\text{new}-\text{control}\)
for an outcome where lower is better. A margin M>0 is the largest loss
deemed acceptable, so \(H_0:\Delta\ge M\) versus \(H_1:\Delta<M\). For
non-inferiority at one-sided level 0.025, the upper bound of the
corresponding 97.5% one-sided interval (equivalently the upper bound of a
95% two-sided interval under matching procedures) must be below M. The
margin should preserve a clinically meaningful fraction of the established
control benefit and be justified using prior evidence, not selected from
the observed confidence interval.

Equivalence asks whether the effect lies inside both limits: \(H_0:\Delta\le
-M\text{ or }\Delta\ge M\) against \(H_1:-M<\Delta<M\). The two one-sided
tests procedure (TOST) rejects both components of the null; equivalently,
the matching 90% two-sided interval at alpha=0.05 must fit entirely inside
[-M,M]. Merely obtaining p>0.05 for a zero-difference test does not establish
equivalence. A wide interval can include zero and clinically large benefit
or harm simultaneously.

```r
# Illustrative normal-theory TOST for difference estimate d and SE s.
# Both one-sided p-values must be below alpha.
d <- -0.2; s <- 0.45; margin <- 1.5; alpha <- 0.05
z_lower <- (d - (-margin)) / s  # test that d is above -margin
z_upper <- (d - margin) / s    # test that d is below +margin
p_lower <- pnorm(z_lower, lower.tail = FALSE)
p_upper <- pnorm(z_upper, lower.tail = TRUE)
c(p_lower = p_lower, p_upper = p_upper,
  equivalent = p_lower < alpha && p_upper < alpha)
```

Here both bounds are met: lower-bound statistic is 2.89 (one-sided p≈0.0019)
and upper-bound statistic is −3.78 (p≈0.00008). The example assumes a
normal estimator with known SE and is for illustration; real analyses use
the design-appropriate standard error and prespecified population. For a
binary endpoint, scale and margin definition need clinical justification;
the same numerical percentage-point margin does not correspond to a
constant relative effect at all baseline risks.

## One-sided tests, composite nulls, and multiplicity

A one-sided alternative has meaning only if effects in the excluded
direction would not support the scientific claim and would not change
practice. If a new drug is unexpectedly harmful, a prespecified superiority
test aimed only at benefit does not license a confirmatory claim about
harm; report the estimate and interval and follow the safety analysis plan.
Choosing the tail after observing the sign approximately doubles the false
positive opportunity and invalidates the nominal error guarantee.

Many hypotheses are composite. A test of \(H_0:\beta=0\) evaluates one
point, while a clinically negligible region such as \(|\beta|<\delta\)
requires equivalence or interval-based reasoning. A nonsignificant point
null is not evidence that the effect is in that region. Similarly, testing
multiple endpoints, doses, subgroups, or interim looks creates a family of
decisions. Prespecify which hypothesis is primary, the order of gatekeeping,
and any adjustment procedure; post-hoc selection cannot inherit the error
rate promised for one preplanned test.

## Statistical nulls and scientific claims

The point null \(H_0:\Delta=0\) is a convenient reference, but many
scientific questions concern a range of effects. A test may reject zero
while the entire estimated effect remains below a clinically meaningful
threshold. Conversely, a confidence interval that contains zero can still
exclude important benefits. A useful protocol therefore names both the
primary null and the clinically relevant region. For a continuous outcome,
one might define a 2-point reduction as important; for a risk difference,
the threshold could be an absolute risk reduction tied to treatment harms
and costs. Such thresholds are context-specific and should be agreed with
clinical stakeholders before results are observed.

In observational studies, “no association” and “no causal effect” are not
equivalent hypotheses. A regression coefficient of zero after adjustment
is a model-based conditional association statement. A causal null compares
potential outcomes under alternative exposure assignments, which are not
both observed for any one person. Identification requires assumptions
such as consistency, exchangeability conditional on measured confounders,
and positivity. A p-value for a regression coefficient cannot test these
assumptions; causal interpretation rests on design, measurement, and
sensitivity analysis as well as estimation.

## Composite hypotheses and interval logic

### Translating an interval into a superiority claim

Assume the treatment-minus-control risk-difference estimate is −0.2
percentage points with a 95% interval from −1.1 to +0.7. If lower risk is
better, the interval includes zero and is compatible with modest benefit
or modest harm; the trial has not demonstrated superiority. If the
prespecified non-inferiority margin is +1.5 points, the upper bound +0.7
lies below the margin, so non-inferiority may be supported under the
specified analysis. These are not contradictory: the data can fail to
prove superiority while ruling out an unacceptable loss. If the interval
were −2.0 to +1.7, the upper bound would exceed the harm margin and
non-inferiority would not be established, even though the point estimate
is favorable. For lower-is-better outcomes, it is specifically the upper
bound that is compared with the harm margin.

For an event where higher is better, reverse the sign convention or
compare the lower confidence bound with the negative margin. Writing the
estimand and direction explicitly prevents a common error: using the
wrong confidence bound simply because treatment and control labels were
reversed in a model. A protocol should define the contrast and margin in
words and symbols and state which analysis set supports the primary claim.

## Bayesian hypotheses and scientific uncertainty

In Bayesian analysis, a point null can receive a posterior probability
only when the model assigns it positive prior probability (for example,
as one component of a spike-and-slab prior). Under a continuous prior,
the probability that a parameter is exactly zero remains zero before and
after observing data; inference instead describes posterior mass in
regions, such as \(P(|\Delta|<\delta\mid data)\). A region of practical
equivalence (ROPE) is one way to express negligible effects, but its bounds
must still be clinically justified. A 95% credible interval has a
posterior probability interpretation conditional on likelihood, prior,
and model; a 95% confidence interval has a long-run coverage interpretation.
Neither framework can compensate for a poor estimand or biased data.

The distinction between “no evidence” and “evidence of no important
effect” can be formalized by choosing an interval of negligible effects.
Suppose clinically trivial differences are within ±1 point. An estimate
of 0.1 with 95% CI [−0.4, 0.6] is precise enough to place plausible values
inside that region, whereas an estimate of 0.1 with CI [−2.5, 2.7] is
not. A conventional p-value for testing zero could be large in both cases;
only the second result remains compatible with important differences.

## References and further reading

When the null is composite, the test's type-I error guarantee must hold
over every parameter value in the null region, not only at one convenient
boundary. In non-inferiority, the hardest-to-reject null is often the
boundary at the margin; the trial must still be designed so its interval
can exclude that margin when the therapy is truly acceptable. The margin
should be set using preserved historical benefit, assay sensitivity, and
clinical judgment. A margin that is too wide can declare non-inferiority
even when the new intervention gives up most of the established benefit.

For equivalence, both one-sided null components must be rejected. If a
90% two-sided interval is [−0.8, 0.6] and the prespecified equivalence
range is [−1.0, 1.0], equivalence is supported at alpha=0.05. If it is
[−1.2, 0.6], the result is inconclusive: the data do not exclude a loss
beyond the lower margin, even though zero lies within the interval. For
superiority, the usual two-sided 95% interval excluding zero corresponds
to rejection at 0.05 for a matching test. These familiar correspondences
depend on using the same model, estimand, and variance method for the test
and interval.

## Preregistration and deviations

## Hypotheses for multi-arm and dose-response studies

## Writing the null in operational terms

An operational hypothesis should make clear which parameter is tested,
the scale, direction, and analysis population. “There is no difference in
readmission” is underspecified: it could mean equal 30-day risks, equal
odds, equal incidence rates, equal hazards, or equal mean counts. It could
refer to all randomized participants or only those completing follow-up.
These choices affect both analysis and interpretation. A useful protocol
sentence might say: “The primary hypothesis is that the marginal
12-month risk difference in all randomized adults assigned to intervention
versus usual care equals zero; negative values favor intervention.” That
sentence identifies the contrast and sign before any test is run.

For observational research, the null should also be distinguished from a
causal estimand. A crude equality of observed risks is a descriptive null;
an adjusted conditional odds ratio of one is a model-specific association
null; equality of potential-outcome means is a causal null. Confounding can
make the first two differ from the third. State whether the objective is
description, prediction, or causal effect estimation, because the same
regression command can be used for different goals without identifying
the same quantity.

In a three-arm trial, an omnibus null such as
\(H_0:\mu_A=\mu_B=\mu_C\) differs from a targeted contrast such as
\(H_0:\mu_A-(\mu_B+\mu_C)/2=0\). The omnibus F test asks whether any
mean differs; it does not identify which treatment comparison is important.
A planned contrast can directly address whether two active regimens
together outperform control, potentially with greater power than all pairwise
tests. The contrast and weights should be set before looking at outcomes;
weights summing to zero ensure the contrast compares means rather than
their overall level.

For dose-response, a null of equal outcomes across all dose groups may be
less relevant than a prespecified trend or monotonicity hypothesis. A
linear trend test gains power if the relationship is approximately linear
but can miss a U-shaped response. Modeling dose as categorical avoids
imposing a curve but spends more degrees of freedom. Restricted cubic
splines can represent nonlinear trends, though the number and placement of
knots should be chosen without outcome-driven searching. The scientific
alternative should describe the plausible response pattern, and graphical
estimates with intervals should accompany a single test statistic.

In factorial designs, the interaction hypothesis asks whether treatment
effects differ across levels of another factor. A main effect averaged
over the other factor may be misleading when interaction is important.
Define contrasts on an interpretable scale and distinguish an interaction
test from separate within-subgroup tests. The latter do not test equality
of subgroup effects and often have substantially less power.

Writing the null and alternative in the protocol forces choices about
direction, analysis scale, population, endpoint, and decision threshold.
Preregistration does not eliminate judgment, but it separates planned
confirmatory claims from analyses suggested by observed data. If an
endpoint definition or model changes after data inspection, report why,
whether the change preceded unblinding, and how it affects inference.
Exploratory hypotheses are valuable for discovery; they should be labeled
so future evidence can assess them without mistaking them for a successful
prespecified test.

## References and further reading

- Chow SC, Lu J, Jiang H. *Design and Analysis of Clinical Trials*. Wiley.
- Wasserstein RL, Lazar NA. [The ASA's statement on p-values: context, process, and purpose](https://doi.org/10.1080/00031305.2016.1154108). *The American Statistician*. 2016;70(2):129–133.
- Piaggio G, Elbourne DR, Pocock SJ, Evans SJW, Altman DG. [Reporting of noninferiority and equivalence randomized trials](https://doi.org/10.1001/jama.2012.87802). *JAMA*. 2012;308(24):2594–2604.
- The [p-values article](/biostatistics-library/inference/p-values-and-significance-levels.html) explains how test results are quantified.
- Schuirmann DJ. A comparison of the two one-sided tests procedure and the power approach for assessing the equivalence of average bioavailability. *Journal of Pharmacokinetics and Biopharmaceutics*. 1987;15:657–680. [doi:10.1007/BF01068419](https://doi.org/10.1007/BF01068419)
