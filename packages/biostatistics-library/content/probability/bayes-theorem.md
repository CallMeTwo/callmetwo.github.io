---
title: Bayes’ theorem
summary: How to update the probability of disease after a test result using prevalence, sensitivity, and specificity.
---

## Overview and key ideas

Bayes' theorem converts what you knew *before* a test (the **prior** or pre-test
probability) into what you know *after* it (the **posterior** or post-test
probability):

P(disease | positive test) = [P(positive | disease) × P(disease)] / P(positive)

The numerator combines the test's **sensitivity** with the disease **prevalence**.
The denominator, P(positive), averages the positive rate over people with and
without disease, using sensitivity and **specificity**:

P(positive) = sensitivity × prevalence + (1 − specificity) × (1 − prevalence)

The result, P(disease | positive test), is the **positive predictive value (PPV)**
— the quantity clinicians actually want. Its mirror image, P(disease | negative
test), is the negative predictive value (NPV).

## When to use it

| Setting | Example question |
| --- | --- |
| Screening low-prevalence disease | After a positive screening test in a general population, how likely is true disease? |
| Diagnosis in high-risk groups | In a symptomatic patient with high pre-test probability, how much does the same test change the probability? |
| Sequential testing | After two independent tests, what is the cumulative probability of disease? |
| Interpreting false results | How many positive results in a screening round will be false positives? |

## Assumptions and limitations

- **Prevalence must be that of the population being tested.** A PPV calculated
  from a low-prevalence screening population is meaningless in a specialist clinic
  where disease is common.
- **Sensitivity and specificity must apply to the tested population** (spectrum
  bias: a test that performs differently in mild vs advanced disease gives a
  misleading PPV if those proportions are not the ones assumed).
- For sequential tests, the tests must be **conditionally independent** given the
  true disease state; using the same assay twice does not halve the error rate.
- The theorem is exact; all error comes from the input estimates and from the
  population assumptions behind them.

### Odds form and likelihood ratios

Bayes' rule can also be written as posterior odds = prior odds × likelihood
ratio. For a positive result, LR+ = sensitivity/(1−specificity); for a
negative result, LR− = (1−sensitivity)/specificity. This form makes sequential
updating transparent: multiply odds by each test's likelihood ratio only when
tests are conditionally independent given disease status, or when a joint
model supplies the appropriate combined likelihood. Test performance can
also change with disease severity and setting, so likelihood ratios estimated
in a case-control sample should not be assumed to transfer unchanged to
screening.

## Worked example

A blood test screens for a disease with 1% prevalence, 95% sensitivity, and 99%
specificity. In 10,000 screened people:

- 100 truly have the disease; 95 of them test positive (true positives).
- 9,900 do not; 1% of them — 99 people — test positive (false positives).
- Total positives = 95 + 99 = 194, so PPV = 95/194 ≈ 0.49.

Equivalently, directly from Bayes: PPV = (0.95 × 0.01) / [(0.95 × 0.01) +
(0.01 × 0.99)] = 0.0095 / 0.0194 ≈ 0.49. So a positive result in this population
is almost a coin flip: even a highly specific test yields a PPV near 50% when the
disease affects only 1 in 100 people. If the same test is used in a group where
prevalence is 20%, PPV jumps to (0.95 × 0.20)/(0.95 × 0.20 + 0.01 × 0.80) ≈ 96%
— the same test, the same errors, a very different conclusion.

## Interpretation and common pitfalls

- **Base-rate neglect** — quoting sensitivity/specificity while ignoring
  prevalence; a 99%-specific test can still produce more false than true positives
  in rare disease.
- **Confusing PPV with sensitivity** — sensitivity is a property of the test
  (fixed, roughly, by the disease); PPV is a property of the *population* being
  tested and moves with prevalence.
- **Applying test characteristics out of context** — a PPV from a research study
  with case-enrichment does not transfer to routine practice.
- **Ignoring changing prevalence** — as screening erodes prevalence or as
  pre-test probability shifts with symptoms, the PPV of an unchanged test
  changes; update the prior accordingly.

## References and further reading

- Deeks JJ, Altman DG. [Diagnostic tests 4: likelihood ratios](https://doi.org/10.1136/bmj.329.7458.168). *BMJ*. 2004.
- Altman DG, Bland JM. [Diagnostic tests 2: predictive values](https://doi.org/10.1136/bmj.309.6947.102). *BMJ*. 1994.

- Bland JM, Altman DG. *Medical Statistics: A Companion Guide*. Nelson.
- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott Williams & Wilkins.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.

The [conditional probability article](conditional-probability-and-independence.html)
covers the underlying probability calculus.
