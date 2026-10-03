---
title: Chi-square test
summary: A test of association between two categorical variables, built from the difference between observed and expected cell counts.
---

## Overview and key ideas

The chi-square test of independence asks whether two categorical variables are
associated in a single population. It compares the counts you actually observed
in each cell of a contingency table with the counts you would expect if the two
variables were independent. Large discrepancies between observed and expected
counts push the test statistic up and lower the p-value.

The test statistic is

    chi-square = sum over cells of (observed - expected)^2 / expected

and is compared with a chi-square distribution whose degrees of freedom are
(rows - 1)(columns - 1). For a 2×2 table there is 1 degree of freedom, and the
chi-square statistic equals the square of a two-sided z-test for two
proportions.

## When to use it

The natural settings are cross-tabulations in which both variables are
categorical and the sample is a single group:

| Setting | Example question |
| --- | --- |
| Case-control study | Is smoking status associated with lung cancer among hospital patients? |
| Quality monitoring | Does the rate of a complication differ across three surgical teams? |
| Survey research | Is a self-reported health behaviour associated with income group? |
| Screening | Does test result (positive/negative) relate to true disease status? |

Use it when every expected cell count is reasonably large (commonly at least 5).

## Assumptions and limitations

- **Independence of observations** — each subject contributes to exactly one
  cell; clustered or repeated data violate this and inflate significance.
- **Expected counts** — the approximation is poor when any expected count is
  below 5, or when more than 20% of expected counts are below 5; prefer Fisher's
  exact test (for 2×2) or a simulation-based test.
- **Categorical, exhaustive categories** — overlapping or "other" buckets
  dilute the association.
- **It tests association, not direction or strength** — a significant result
  says the variables are related, not how strongly or in which direction; report
  a measure of effect such as the odds ratio or risk ratio alongside.

## Worked example

In a case-control study of 300 patients, 200 had lung cancer and 100 did not.
Among cases, 160 were smokers; among controls, 40 were smokers. The table is:

|  | Smoker | Non-smoker | Total |
| --- | --- | --- | --- |
| Cancer | 160 | 40 | 200 |
| No cancer | 40 | 60 | 100 |

If smoking and cancer were independent, the expected number of smokers among
cases would be (200 × 200) / 300 ≈ 133. The observed 160 is well above that. The
chi-square statistic is about 58 on 1 degree of freedom, giving a p-value far
below 0.001 — strong evidence of an association. The odds ratio
(160×60)/(40×40) = 6.0 quantifies it: cases had about six times the odds of
having smoked compared with controls.

## Interpretation and common pitfalls

- A significant chi-square in an observational study shows association, not
  cause — confounding (age, occupational exposure) can drive the relationship.
- Do not use the test when expected counts are small; the p-value becomes
  unreliable and anti-conservative.
- For 2×2 tables the test is equivalent to comparing two proportions — reporting
  the difference in proportions or an odds ratio is more informative than the
  chi-square value alone.
- Larger samples make trivial associations "significant"; pair the test with an
  effect size and a confidence interval.

## References and further reading

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis
  and Other Advanced Topics*. Brooks/Cole.
- The topic map's *Comparing groups* section contrasts this with Fisher's exact
  test for small samples (article planned).
