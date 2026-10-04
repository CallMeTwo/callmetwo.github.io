---
title: Fisher’s exact test
summary: An exact test for a 2×2 table that uses the hypergeometric distribution, ideal when expected cell counts are small.
---

## Overview and key ideas

Fisher's exact test asks whether two binary variables are associated when the
sample is too small for the chi-square approximation to be trustworthy. Instead
of relying on a large-sample distribution, it computes the exact probability of
observing a table at least as extreme as the one at hand, conditional on the
fixed row and column totals, using the hypergeometric distribution.

For a 2×2 table with cell counts a, b, c, d and row totals (a+b), (c+d) and
column totals (a+c), (b+d), the probability of that particular arrangement is

    P = [(a+b)!(c+d)!(a+c)!(b+d)!] / [a! b! c! d! n!]

and the p-value sums the probabilities of all tables as extreme or more
extreme than the observed one (one-sided), or of both tails (two-sided). The
test is "exact" because no approximation is involved — it is valid for any
sample size, down to tables with counts of zero.

## When to use it

| Setting | Example question |
| --- | --- |
| Rare event | In 40 patients, does a rare adverse reaction differ between two drug groups? |
| Small pilot study | Is a new marker present more often in 15 diseased than 15 healthy subjects? |
| Low-prevalence screening | Does a diagnostic test differ by sex when only a few positives are expected? |
| Any 2×2 table with a small expected count | Whenever the chi-square approximation would be unreliable |

Reach for Fisher's test whenever a chi-square test on the same table would have
an expected count below 5, or whenever the study is simply small.

## Assumptions and limitations

- **Fixed margins** — the classic form conditions on the row and column totals
  being fixed; for two independent random samples this is a conventional
  approximation, but it is standard and well behaved.
- **2×2 tables only in its common form** — conditional exact tests extend to
  larger R×C tables but can be computationally expensive. Use a Monte Carlo
  conditional test (for example, a simulated Fisher–Freeman–Halton test) or
  an asymptotic chi-square method when appropriate. Barnard's and Boschloo's
  unconditional tests are 2×2 procedures, not general R×C alternatives.
- **Independence of observations** — as with any test of association, each
  subject must contribute one cell.
- **Conservative tendency** — because the test is exact over a discrete set of
  tables, its actual size can fall below the nominal level (e.g. 0.05), making
  it slightly conservative, especially one-sided.

## Worked example

A small trial of a topical treatment enrolls 12 patients, 6 per group. Two of
the six treated patients and zero of the six controls develop a rash. The table
is:

|  | Rash | No rash | Total |
| --- | --- | --- | --- |
| Treated | 2 | 4 | 6 |
| Control | 0 | 6 | 6 |

The chi-square test has expected counts of 1 in each rash cell, so its
large-sample approximation is unreliable. Conditional on the margins, Fisher's
exact test gives a one-sided p-value of about 0.227 and a common probability-
ordered two-sided p-value of about 0.455. Two-sided exact p-values can depend
on the convention used to order tables, so identify the software when exact
results matter. There is a hint of an association but not
enough evidence at the 0.05 level — a reminder that with only 12 patients the
study is underpowered to detect anything but a very large effect.

## Interpretation and common pitfalls

- Fisher's test is more appropriate than chi-square for small counts, but it
  does not rescue an underpowered study — a non-significant result in a tiny
  sample still means the study could not detect a moderate effect.
- Report the odds ratio and its confidence interval alongside the p-value; the
  p-value alone does not convey the size or precision of the association.
- Do not treat Fisher's test as the default for every 2×2 table — for large
  samples chi-square (or the equivalent proportion test) is simpler and
  equally valid.
- For a one-sided test, decide the direction of the alternative *before*
  looking at the data; choosing the side that yields the smaller p-value
  inflates the type I error rate.

## Conditional probability and two-sided definitions

Fisher's exact test conditions on both observed margins of a 2×2 table.
Given fixed row and column totals, the upper-left cell follows a
hypergeometric distribution under the null odds ratio of one. If a and b
are case/control exposed counts and margins are fixed, the probability of
each possible table is determined by combinations, not by a large-sample
chi-square approximation. The exact p-value sums probabilities of tables
at least as incompatible with independence as the observed one.

For the common “probability no greater than observed” definition, R sums
the null probabilities of all feasible tables whose probability is less
than or equal to that of the observed table. Other definitions of a
two-sided exact p-value exist, including doubling the smaller one-sided
tail. They can differ in discrete samples. State software and method when
this distinction matters; do not choose the convention that produces the
more favorable result after seeing the table.

```r
tab <- matrix(c(1, 9, 11, 3), nrow = 2, byrow = TRUE,
              dimnames = list(c("Treatment", "Control"),
                              c("Event", "No event")))
fisher.test(tab, alternative = "two.sided")
fisher.test(tab, alternative = "greater")
```

Here `greater` refers to an odds ratio greater than one for the displayed
row and column orientation. Changing row/column order changes which
direction is called greater, so define it from the clinical contrast
rather than relying on labels. A one-sided test is defensible only when
the direction is prespecified and an effect in the opposite direction
would not count as evidence for the scientific claim.

## Worked example with sparse counts

Suppose a small randomized pilot has 12 patients per arm, with 1 adverse
event in the new-treatment arm and 6 in control. The risk difference is
\(1/12-6/12=-0.417\), a large apparent absolute reduction, but there is
substantial uncertainty because there are only seven events. The odds
ratio is \((1\times6)/(11\times6)=0.091\). Fisher's test calculates the
conditional tail probability exactly under fixed margins; it avoids the
poor chi-square approximation that can occur with expected counts well
below five. Exactness refers to the null distribution conditional on the
margins—it does not mean that the estimate is precise or the study is
free of bias.

Fisher's test in R also returns a conditional maximum-likelihood odds
ratio estimate and a conditional exact interval. These may differ from
the cross-product estimate and Wald interval, particularly in sparse
tables. The conditional estimate is not generally the same as the
unconditional maximum-likelihood estimate. Report which interval is
used and include the cell counts so readers can see the data's limited
information.

## When Fisher is appropriate and what it does not solve

## Worked example: exact inference versus approximation

In the 12-per-arm adverse-event example, total events are 7 and total
nonevents are 17. Under the fixed-margin null, the number of events in the
treatment arm has a hypergeometric distribution with support from 0 to 7.
The observed value 1 is in the low tail, which corresponds to fewer events
on treatment than expected if the odds ratio were one. A one-sided exact
p-value for benefit sums probabilities of tables with one or fewer
treatment events; the conventional two-sided p-value adds equally or more
extreme tables according to the selected probability ordering. The exact
test conditions on the margins, so it can be conservative when the
discrete support has no tail probability near the nominal cutoff.

```r
small <- matrix(c(1, 11, 6, 6), nrow = 2, byrow = TRUE,
                dimnames = list(arm = c("New", "Control"),
                                outcome = c("Event", "No event")))
fisher.test(small, alternative = "less")
fisher.test(small, alternative = "two.sided")
```

In this orientation the odds ratio compares event odds for new versus
control, and `less` tests an odds ratio below one. If rows or columns are
reordered, update the alternative accordingly. R reports a conditional
odds-ratio estimate and exact confidence interval by default; it may not
equal the cross-product estimate 0.091 exactly. The interval is often
asymmetric and may extend widely because only seven events occurred.
That uncertainty should be retained in interpretation even if the exact
p-value is small.

## Exactness, conservatism, and alternatives

“Exact” is conditional on the table margins and null model. In a
randomized trial the treatment totals are fixed by design, but outcome
total is random; conditioning on it can discard information. Barnard's or
Boschloo's unconditional exact tests avoid conditioning on both margins
and can be more powerful, but their calculation and interpretation are
less familiar. For larger samples, Pearson chi-square or a score test can
be more efficient. The method should be chosen based on design and
prespecified analysis, not whichever yields significance.

Sparse data also make effect estimates unstable. If a cell is zero, the
cross-product odds ratio is zero or infinite and its Wald log interval is
undefined; adding 0.5 to every cell is a continuity correction that can
stabilize computation but changes the estimator. Exact conditional methods,
Firth penalized logistic regression, or Bayesian models with weakly
informative priors may be preferable depending on the question. Penalized
methods reduce separation bias but cannot manufacture information—report
the small event counts and wide uncertainty.

When there are covariates, stratified exact procedures can condition within
strata, but become cumbersome with many strata. Conditional logistic
regression is designed for matched sets. Ordinary logistic regression may
separate under sparse outcomes and produce enormous coefficients; exact
or penalized likelihood methods address estimation but still require
careful confounding control and model specification.

## Reporting exact tests responsibly

## Quantifying effect and uncertainty in sparse tables

For the pilot table, absolute risks are 1/12=8.3% versus 6/12=50.0%;
the difference is −41.7 percentage points. An approximate interval based
on independent binomial variances is very wide, emphasizing that this
small trial does not establish a precise treatment effect. The conditional
odds ratio estimate from Fisher's procedure may differ from the crude
cross-product value, and the exact interval can be highly asymmetric. This
is expected when the likelihood is skewed and should not be hidden by
reporting only the p-value.

In a randomized trial, risk difference is often clinically more useful
than OR. Compute risks from arm denominators and use a score-based interval
for the difference; for very sparse outcomes, consider exact or
unconditional intervals. If the control risk is high, OR can make a
benefit appear more extreme than RR. In a case-control study, sampled
case/control fractions do not estimate risks, though the odds ratio is
often estimable; an OR approximates RR only for a rare outcome under
appropriate sampling assumptions.

The zero-cell problem deserves special care. If no events occur in one
arm, an ordinary log-OR estimate is infinite. A continuity correction
such as adding 0.5 to all cells yields a finite approximation but is not
an exact solution and can materially affect small datasets. Exact
conditional inference handles boundary tables, but its interval may
include a very broad range. Firth penalized logistic regression often
reduces first-order bias and separation, while Bayesian priors can
regularize estimates; report the method and avoid implying that the
result is precise merely because an estimate is finite.

## Design implications

## Extension to larger tables in R

For the 2×2 pilot, provide the event risk in each arm (1/12 and 6/12),
not just the odds ratio, so readers can assess absolute clinical impact.
If a pilot is intended to estimate an effect for a definitive trial, its
wide interval should inform a range of plausible effects rather than be
used as the sole sample-size target.

When a 2×2 table comes from a randomized experiment, randomization-based
inference can condition on the treatment allocation and enumerate
assignments under a sharp no-effect null. Fisher's test conditions on the
observed outcome margins as well, so it is related but not always identical
to the design-based randomization test. With fixed treatment arm sizes,
permuting treatment labels over outcomes follows the assignment scheme;
with stratified randomization, permute within strata. Be clear whether the
goal is conditional association inference or a randomization test of the
trial's sharp null.

Fisher's test is also unrelated to “Fisher information” despite the shared
name. The test was developed for exact inference in contingency tables;
its p-value is not a posterior probability and does not make a small study
automatically definitive.

For an R×C table, `fisher.test()` performs a conditional exact test when
computationally feasible. If enumeration is too demanding, its
`simulate.p.value = TRUE` option draws tables under the fixed-margin null
and estimates the tail probability. The margins must be nonzero and the
simulation count controls numerical precision. A seed supports
reproducibility; it does not affect the statistical assumptions.

```r
tab_rc <- matrix(c(12, 7, 4, 9, 11, 6, 5, 8, 13), nrow = 3,
                 byrow = TRUE)
set.seed(81)
fisher.test(tab_rc, simulate.p.value = TRUE, B = 50000)
```

For Monte Carlo inference, report that the p-value was simulated and give
B. If the estimate is near a decision threshold, increase B and assess
Monte Carlo variability. Conditional exact inference tests independence
given the margins. If the design or substantive question instead calls
for an unconditional model, fit a log-linear or multinomial model with
appropriate covariates rather than assuming the conditional test answers
every association question.

Fisher's exact test can also be used when some cell counts are zero, but
the resulting odds-ratio interval may be one-sided or very wide. A zero
cell is information about rarity, not a data-entry problem to “fix” by
adding a constant without explanation. If a continuity correction is
used for an effect estimate, distinguish it from the exact test itself.

Sparse cells often result from a rare disease, uncommon exposure, or an
overly granular category scheme. Before data collection, enrich case
sampling or oversample informative groups if the design allows, while
retaining correct sampling weights or likelihood. For a trial with a rare
adverse event, extend follow-up or use a larger safety database rather
than relying on a handful of events. If categories can be collapsed
without sacrificing important meaning, plan the collapse in advance.
Do not combine cells post hoc solely to obtain a chi-square approximation
or favorable p-value.

Fisher's exact test is conditional on margins, which is natural in some
case-control settings but may be unnecessarily conservative in randomized
experiments where only treatment margins are fixed. Barnard's or
Boschloo's unconditional exact tests can be more powerful for 2×2 data
under independent binomial sampling, at the cost of less common
implementation and choices about nuisance parameters. For R×C tables,
conditional exact tests and Monte Carlo approximations are available;
the 2×2 Barnard/Boschloo procedures do not extend directly to those
tables.

Report all four cell counts, row/column definitions, odds-ratio estimate
and interval, exact p-value, and alternative direction. State whether
the two-sided p-value uses probability ordering, doubled-tail convention,
or a specific software implementation when reproducibility requires it.
If the endpoint is common, explain that the OR is not the RR. If the
design is case-control, do not calculate population risks from the sampled
case/control fractions. In a randomized trial, supplement OR with arm
risks and absolute risk difference. Exact inference is a way to handle
small-sample sampling distributions, not a substitute for transparent
effect reporting or an adequate study design.

For 2×2 tables, Fisher's exact test is a useful option for sparse counts,
small samples, or designs where conditioning on margins is natural. It is
not automatically superior in every setting. With large samples it can
be conservative because attainable p-values are discrete, and an
unconditional exact procedure may have better power for some designs.
For larger r×c tables, conditional exact calculations can be expensive;
Monte Carlo methods can approximate them, and log-linear models can
represent structured associations.

Fisher's test does not adjust for confounding, clustering, repeated
measurements, survey weights, or covariates. A matched case-control design
requires matched analysis (often conditional logistic regression), not an
ordinary Fisher test on pooled counts. In a cohort with sparse events,
Fisher can test association but cannot by itself estimate an adjusted
risk ratio; exact or penalized regression may be needed for covariate
adjustment. For a randomized trial, report arm-specific risks and the
absolute risk difference with an appropriate interval in addition to the
exact p-value.

The choice between Fisher and Pearson chi-square should be driven by
design and expected-count behavior, not by whether one p-value crosses
0.05. If the outcome is common, an odds ratio can exaggerate the risk
ratio; exact inference does not change that interpretive distinction.
Small p-values from a sparse table can coexist with a wide interval and
substantial uncertainty about clinical effect magnitude.

## References and further reading

- Agresti A. *An Introduction to Categorical Data Analysis*. 3rd ed. Wiley, 2018.
- Fisher RA. *The Design of Experiments*. Oliver and Boyd, 1935.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis
  and Other Advanced Topics*. Brooks/Cole.
- The [chi-square test article](/biostatistics-library/comparisons/chi-square-test.html) describes the large-sample counterpart.
