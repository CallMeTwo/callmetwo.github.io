---
title: McNemar’s test
summary: A paired test for changes in a binary outcome before and after treatment, or between two matched measurements.
---

## Overview and key ideas

McNemar's test compares a binary outcome measured twice on the same subjects —
before and after an intervention, or under two matched conditions. It ignores
the subjects whose outcome did not change and focuses only on those who changed
between the two measurements, asking whether changes in one direction are
as common as changes in the other.

Arrange the data in a 2×2 table of paired outcomes:

|  | After: yes | After: no |
| --- | --- | --- |
| Before: yes | a | b |
| Before: no | c | d |

The two off-diagonal cells are the "discordant" pairs — subjects who changed
from yes to no (b) or from no to yes (c). McNemar's statistic is

    chi-square = (b - c)^2 / (b + c)

on 1 degree of freedom, or for small discordant counts a signed binomial test
of b against c. The concordant cells (a and d) carry no information about the
direction of change.

## When to use it

| Setting | Example question |
| --- | --- |
| Before-and-after intervention | Did a smoking-cessation programme change the quit rate among the same 200 patients? |
| Matched diagnostic comparison | Do two screening tests disagree on the same cohort in a systematic direction? |
| Left-right or paired sites | Is disease more common in one eye than the other in the same patients? |
| Repeated binary measurement | Did a policy change alter the proportion of patients receiving a recommended care? |

Use it whenever the two measurements are on the *same* units; a plain chi-square
test would be wrong because it treats paired observations as independent.

## Assumptions and limitations

- **Paired data** — the two measurements must come from the same subjects or
  matched pairs; applying McNemar's to independent samples is a design error.
- **Binary outcome** — the method is defined for a two-category result; more
  categories need a different marginal-homogeneity test (e.g. Stuart–Maxwell).
- **Independence between pairs** — pairs themselves must be independent;
  clustering within pairs is not accommodated.
- **Discordant counts must be adequate** — the large-sample chi-square form is
  unreliable when b + c is small (often below 25); use the exact binomial form
  in that case.
- **It tests marginal change, not agreement** — McNemar's asks whether the two
  marginals differ, not whether the two measurements agree; use Cohen's kappa
  for agreement.

## Worked example

In 215 patients with hypertension, 120 had a blood pressure above target before
a medication change and 95 were at target. After six months, 70 of the 120 who were
previously above target were still above target (a = 70) and 50 fell to target
(b = 50); of the 95 who were at target, 15 went above target (c = 15) and 80
stayed at target (d = 80). The discordant pairs are b = 50 and c = 15. McNemar's
statistic is (50 - 15)^2 / (50 + 15) = 1225 / 65 ≈ 18.8, giving a p-value well
below 0.001: far more patients moved from above target to at target than the
reverse. The marginal proportion above target changed from 120/215 = 55.8% to
85/215 = 39.5%, a decrease of 16.3 percentage points. This before-and-after
association alone does not establish that the medication change caused the
improvement; secular changes and co-interventions remain possible.

## Interpretation and common pitfalls

- McNemar's tests whether the *proportion* changed, not whether the two
  measurements agree — a non-significant result does not mean the two tests are
  interchangeable; check agreement with kappa or a kappa-style measure.
- Do not use an independent-samples test (chi-square, two-proportion z) on
  paired data — it ignores the pairing and gives a wrong p-value.
- When the number of discordant pairs is small, use the exact binomial version
  rather than the chi-square approximation.
- Report the paired proportions (e.g. 48% before, 28% after) and the change,
  not just the p-value, so the size of the shift is visible.

## Derivation from discordant pairs

For paired binary observations, the table has concordant cells (both
positive and both negative) and discordant cells. Under the null of equal
marginal probabilities, each discordant pair is equally likely to change
from positive to negative as the reverse. Conditional on the total number
of discordant pairs \(b+c\), the count in one direction follows
\(Binomial(b+c,0.5)\). This yields an exact binomial test. The large-sample
McNemar statistic without continuity correction is
\((b-c)^2/(b+c)\), approximately chi-square with one degree of freedom.
The continuity-corrected version uses
\((|b-c|-1)^2/(b+c)\); it is less liberal in small samples, while the
exact test is preferable when discordant counts are sparse.

Suppose a paired diagnostic assessment yields 18 pairs changing from
negative to positive after a new protocol and 6 changing from positive to
negative. There are 24 discordant pairs. The uncorrected statistic is
\((18-6)^2/24=6\), with p≈0.014. Under the exact conditional null, the
two-sided p-value is twice the probability of 18 or more successes in
Binomial(24,0.5), approximately 0.023. The difference reflects small
sample discreteness and convention, not an arithmetic contradiction.

```r
tab <- matrix(c(40, 18, 6, 36), nrow = 2, byrow = TRUE,
              dimnames = list("Before" = c("Negative", "Positive"),
                              "After" = c("Negative", "Positive")))
mcnemar.test(tab, correct = FALSE)
mcnemar.test(tab, correct = TRUE)
binom.test(x = 18, n = 24, p = .5, alternative = "two.sided")
```

The exact binomial version makes the conditioning explicit. Check table
orientation before interpreting direction: in this layout, 18 represents
before-negative/after-positive and 6 the reverse. The McNemar p-value
tests marginal homogeneity, not agreement. A high proportion of
concordant pairs can coexist with systematic directional change among
discordants.

## Effect estimation and interval reporting

McNemar's test is a hypothesis test, not a complete description of
agreement or change. Report b and c, the net discordant difference, and
the marginal proportions before and after. The paired marginal risk
difference is \((b-c)/n\). In the example with n=100 pairs, that is
\((18-6)/100=0.12\), a 12-percentage-point increase in positive
classification. An interval for this paired difference should account
for within-pair covariance; an independent-proportions interval is not
appropriate. Matched-pair odds ratio \(b/c=3\) summarizes the direction
among discordant pairs, but is not the same as a risk ratio.

When the goal is diagnostic agreement rather than change in marginal
positive rate, use measures such as Cohen's kappa or positive and negative
agreement, with prevalence and bias considered. McNemar can detect
directional asymmetry but cannot say whether positive classifications are
correct without a reference standard. In a before-after clinical study,
secular trends, learning effects, and changes in patient mix can explain
observed differences; paired analysis controls stable within-person
characteristics but not time-varying confounding.

## Extensions and design cautions

## Sample size and detectable marginal change

Power for McNemar's test depends on discordant pairs, not just the total
number of pairs. Let p10 be the probability of one direction of
discordance and p01 the reverse. The net marginal difference is
\(p_{10}-p_{01}\), while total discordance is \(p_{10}+p_{01}\). If most
pairs are concordant, there is little information about a directional
change even when n is large. An approximate normal test statistic has
noncentrality proportional to
\(\sqrt n(p_{10}-p_{01})/\sqrt{p_{10}+p_{01}}\), showing why sample-size
planning needs plausible discordance rates from pilot data, not only
expected overall prevalence.

For diagnostic tests measured in the same people, McNemar can compare
sensitivity or specificity only when both methods are evaluated against
the same reference standard in the same participants and the paired
classification outcomes are formed appropriately. Comparing sensitivity
across separate patient groups is not paired. For comparing two
diagnostic tests, the discordant pairs among truly diseased participants
inform sensitivity difference; those among nondiseased participants
inform specificity difference. If disease status is misclassified or the
reference standard is imperfect, the paired test's p-value does not
address that bias.

## Interpretation in before–after and diagnostic settings

## Sample-size planning from discordance

For planning, let p10 denote the probability of a pair changing in one
direction and p01 the reverse. Under a two-sided alternative, a normal
approximation for the number of pairs is
\[
n\approx\frac{[z_{1-\alpha/2}\sqrt{p_{10}+p_{01}}+
z_{1-\beta}\sqrt{p_{10}+p_{01}-(p_{10}-p_{01})^2}]^2}
{(p_{10}-p_{01})^2}.
\]

Suppose investigators expect 20% of pairs to change from negative to
positive and 8% to change from positive to negative. The net marginal
change is 12 percentage points, while 28% are discordant in either
direction. At alpha=0.05 and 80% power, the approximation gives about
150 pairs. This is very different from treating the endpoint as two
independent proportions because within-pair association determines how
many observations are discordant. A pilot or prior paired study should
inform both directional discordance probabilities; assuming fewer
discordant pairs than occur in practice can badly underpower the design.

```r
p10 <- .20
p01 <- .08
alpha <- .05
power <- .80
delta <- p10 - p01
n_approx <- (qnorm(1 - alpha / 2) * sqrt(p10 + p01) +
  qnorm(power) * sqrt(p10 + p01 - delta^2))^2 / delta^2
ceiling(n_approx)
```

Use exact binomial power or software designed for paired proportions for
final planning, particularly when discordant counts are small. Inflate
for incomplete pairs, but also consider why pairs may be missing. If
missingness depends on the change itself, merely recruiting extra
participants does not eliminate bias.

## Estimating the paired risk difference

## Choosing the correct test for paired binary questions

When discordant counts are very low, report the two directional transitions
and the exact p-value alongside an interval; asymptotic chi-square output
can be sensitive to correction choice.

The continuity correction should be named in the results because it
changes the chi-square approximation, especially when discordance is low.
For large discordant counts the corrected and uncorrected results converge;
for sparse pairs, exact binomial inference is easier to justify.

The reporting table should label discordance explicitly (for example,
before-positive/after-negative versus before-negative/after-positive).
Different software packages define the direction of the risk difference
and odds ratio according to row and column order, so print the table and
verify the contrast signs before writing “improved” or “worsened.”

Pairwise deletion is appropriate only if incomplete pairs can be omitted
without changing the target population or biasing the comparison. If
participants with a positive baseline result are more likely to miss
follow-up, complete-pair marginal proportions can be distorted. Describe
the number and pattern of missing pairs by initial status and treatment,
and consider sensitivity analysis or a repeated binary-outcome model
under an explicit missing-data assumption. The exact paired test cannot
correct informative loss to follow-up.

For small samples, the exact binomial test conditions on the total
discordance and is straightforward to explain, but two-sided p-values are
discrete. When b+c is very small, the smallest attainable p-value may be
larger than the conventional alpha, so a nonsignificant result can reflect
limited resolution as well as limited effect. Report the discordant count
and an interval for the marginal difference rather than interpreting
“p>0.05” as proof of equal marginal rates.

McNemar is often confused with Cohen's kappa or an ordinary chi-square
test. They address different targets. McNemar tests whether the marginal
probability of a positive classification is equal at the two occasions.
Kappa measures agreement beyond chance under its marginal prevalence
structure. A chi-square test of independence between before and after
classifications asks whether the two measurements are associated; strong
association can coexist with a systematic shift in positive rate. A test
of marginal homogeneity is therefore not a test of agreement or
association.

For a screening method comparison, first specify whether the target is
change in positive rate, agreement between methods, sensitivity difference,
or specificity difference. McNemar applies to paired binary calls on the
same units. It does not tell whether one method is more accurate without
reference-standard status. For sensitivity, restrict paired calls to
reference-positive participants; for specificity, use reference-negative
participants. Report how many participants contributed to each analysis
and whether the reference standard was applied regardless of index-test
results, since differential verification can bias diagnostic comparisons.

## Data validation and reproducible table construction

Before testing, confirm one paired record per subject and that the
classification labels have consistent definitions across occasions. A
common data error is reversing positive/negative coding at one time point,
which swaps b and c and reverses the estimated direction while leaving a
two-sided p-value unchanged. Generate the table explicitly and verify
that its row and column totals match the analysis sample.

```r
paired <- data.frame(
  id = 1:100,
  before = factor(c(rep("Negative", 58), rep("Positive", 42)),
                  levels = c("Negative", "Positive")),
  after = factor(c(rep("Negative", 40), rep("Positive", 18),
                   rep("Negative", 6), rep("Positive", 36)),
                 levels = c("Negative", "Positive"))
)
tab <- with(paired, table(before, after))
tab
stopifnot(sum(tab) == nrow(paired))
mcnemar.test(tab, correct = FALSE)
```

The row-major construction here contains 40 negative-negative, 18
negative-positive, 6 positive-negative, and 36 positive-positive pairs.
In real data, do not assume row order; use `merge` or a validated wide
format by subject ID, inspect duplicates, and address missing pairs
explicitly. If multiple visits exist, selecting only the first and last
visit changes the target and should be preplanned.

Confidence intervals for marginal change can be calculated by score or
unconditional methods for paired proportions; ordinary independent-sample
proportion intervals ignore covariance. Exact McNemar inference supplies
a test conditional on discordances, while confidence intervals for the
marginal difference target a distinct parameter. Pair the test with an
interval for the difference when the clinical interpretation concerns
absolute change, and explain any method mismatch.

Let a and d be concordant positives and negatives, and b and c the two
discordant directions. The marginal positive rates are
\((a+b)/n\) and \((a+c)/n\); their difference is \((b-c)/n\). In the
18-versus-6 example with n=100, the difference is 0.12. An approximate
variance is
\([b+c-(b-c)^2/n]/n^2\). Substitution gives
\([24-144/100]/10000=0.002256\), SE≈0.0475. A Wald interval is
approximately 0.027 to 0.213, though score-based or exact intervals can
have better coverage with sparse discordances. The interval estimates a
population marginal change under the sampling model; it does not measure
agreement or individual treatment response.

Report the transition table because it reveals how the marginal contrast
arose. A net increase of 12 points could result from 18 favorable and 6
unfavorable changes, or 60 favorable and 48 unfavorable changes. The net
estimate is the same, but the latter has more discordant information and
typically greater precision. The p-value also depends on the total
discordance, not only on the net difference.

In a before–after study, the observed shift in classification may reflect
the intervention, but it can also reflect temporal changes in disease
prevalence, rater learning, or different threshold application. Pairing
removes stable individual-level differences but not these time effects.
For an intervention trial, randomized concurrent control groups are
stronger for causal attribution than a single-group before-after design.
Report both marginals and transition counts; the same marginal change can
arise from very different individual transitions.

Agreement is a separate concept from equality of marginals. Two methods
could have equal positive rates but disagree on many individuals. Conversely,
they may agree almost perfectly but have different marginal positive rates
if a smaller set of discordant pairs is unbalanced. Use a full agreement
table, kappa or positive/negative agreement as appropriate, and McNemar
when the question is whether marginal proportions differ. Kappa itself is
prevalence-sensitive and should not be presented as a universal agreement
score.

If there are multiple repeated assessments, avoid conducting all pairwise
McNemar tests without adjustment. A marginal logistic GEE can estimate
time contrasts while accounting for within-subject dependence; a mixed
logistic model can represent subject-specific heterogeneity. The model
choice changes whether an effect is population-averaged or subject-specific,
so align the estimand with the clinical question. Include the number of
discordant pairs and an interval for the marginal change; a p-value alone
conceals how much information came from transitions.

The classical test assumes independent pairs and exactly one paired binary
outcome per subject. If participants are clustered within sites or have
multiple repeated assessments, use a marginal model such as GEE or a
mixed-effects logistic model. For matched sets with more than two
categories, Stuart–Maxwell or Bowker symmetry tests generalize related
ideas but answer distinct questions. For multi-time binary responses,
McNemar pairwise testing creates multiplicity and ignores the joint
trajectory; longitudinal models are typically preferable.

The continuity-corrected chi-square statistic is sometimes reported by
default in software, while exact methods may use different two-sided
probability orderings. Report the specific method, especially with few
discordant pairs. Do not select the corrected or uncorrected version based
on the smaller p-value. If no discordant pairs exist, there is no evidence
of a marginal difference, but the sample may be uninformative about the
size of change; provide an interval or exact bound rather than declaring
perfect equivalence.

## References and further reading

- McNemar Q. [Note on the sampling error of the difference between correlated proportions or percentages](https://doi.org/10.1007/BF02295996). *Psychometrika*. 1947;12:153–157.
- Agresti A. *An Introduction to Categorical Data Analysis*. 3rd ed. Wiley, 2018.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis
  and Other Advanced Topics*. Brooks/Cole.
