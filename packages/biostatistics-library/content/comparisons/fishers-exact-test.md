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
- **2×2 tables only** — the exact generalisation to larger tables exists but is
  computationally heavier; for R×C tables use a simulation (Monte Carlo) chi-square
  or the Barnard test instead.
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

The chi-square test would have an expected count of 0 in one cell, so it is
inappropriate. Fisher's exact test gives a one-sided p-value of about 0.073 and
a two-sided p-value of about 0.13. There is a hint of an association but not
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

## References and further reading

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis
  and Other Advanced Topics*. Brooks/Cole.
- The topic map's *Comparing groups* section contrasts this with the chi-square
  test for larger samples (article planned).
