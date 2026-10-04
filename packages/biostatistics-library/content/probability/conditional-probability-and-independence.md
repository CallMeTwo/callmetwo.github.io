---
title: Conditional probability and independence
summary: Probability of one event given another, how to test independence from a two-way table, and why conditioning changes the risk you see.
---

## Overview and key ideas

A **conditional probability** answers: *among those for whom B is known to be
true, how likely is A?* Formally, P(A|B) = P(A and B) / P(B), defined for
P(B) > 0. The vertical bar is read "given". Clinically, nearly every quoted risk
is conditional: the risk of readmission *given* discharge on a new medication,
the risk of infection *given* ICU stay.

Two events are **independent** when knowing B changes nothing about the chance of
A: P(A|B) = P(A), equivalently P(A and B) = P(A)P(B). Independence is a statement
about a population; in a two-way (2×2) table you check it by comparing a
conditional probability with its marginal counterpart. If they differ, A and B
are associated — and that association is what most epidemiologic studies try to
quantify.

## When to use it

| Setting | Example question |
| --- | --- |
| Subgroup risk | Is the 30-day mortality risk the same in patients over 80 as in those under? |
| Screening follow-up | Given a positive test, what is the chance of true disease? (prevents the base-rate error) |
| Association in a 2×2 table | Does vaccination status change the probability of infection? |
| Stratified analysis | Within each stratum, is the exposure associated with the outcome? (see Simpson's paradox) |

## Assumptions and limitations

- **Conditioning changes the reference population.** P(readmission) and
  P(readmission | treated) are risks in different groups; comparing them is only
  meaningful if both are estimated from the same underlying population.
- **Conditional independence ≠ marginal independence.** Two variables can be
  independent overall yet dependent within strata, or vice versa (Simpson's
  paradox), usually because of a common cause (confounder).
- Independence is a *model assumption*, not something data can prove — only
  disprove. In observational studies it is typically unverifiable (e.g.
  treatment assignment being independent of prognosis without randomisation).
- Very small conditioning sets (e.g. "given the patient is a 97-year-old smoker
  with CKD stage 4") make estimates unstable even when mathematically valid.

### Confounding, stratification and causal interpretation

An overall conditional probability can differ from the within-stratum
probabilities because the groups have different mixes of baseline risk. This
is the arithmetic behind Simpson's paradox; it is not evidence that one of
the tables is wrong. Stratifying on a genuine pre-exposure confounder can
clarify an association, but conditioning on a collider (a common effect of
exposure and outcome causes) can create a spurious association. Therefore,
choose adjustment variables from the causal question and time order, not just
from which covariates change a crude estimate. In a randomized trial,
independence of assigned treatment and baseline prognosis is a design
property in expectation, while chance imbalances remain possible in a finite
sample.

## Worked example

A hospital tracked readmission within 30 days. Of 400 discharged patients on a
pharmacist follow-up programme, 120 were readmitted; of 1000 patients without it,
180 were readmitted.

- P(readmitted | programme) = 120/400 = 0.30
- P(readmitted | no programme) = 180/1000 = 0.18
- P(readmitted) overall = 300/1400 ≈ 0.214

Because P(readmitted | programme) = 0.30 ≠ 0.214 = P(readmitted), readmission and
programme participation are **not independent** in this data. A more meaningful
comparison is the two conditional risks: programme participants had a higher
readmission rate (30% vs 18%). That is exactly the kind of pattern that prompts
looking for confounding — if participants were sicker at baseline, the
association may not reflect the programme itself.

## Interpretation and common pitfalls

- **Base-rate neglect** — P(disease | positive test) can be far below the test's
  sensitivity when disease is rare; the prior probability matters as much as the
  test.
- **Confusing independence with mutual exclusivity** — mutually exclusive events
  are maximally *dependent* (one occurring rules the other out); independent
  events can co-occur freely.
- **Marginal vs conditional association** — declaring "no association" from the
  overall table can be wrong when a confounder differs between groups; always
  check stratum-specific conditional probabilities.
- **Direction of conditioning** — P(A|B) and P(B|A) are generally different;
  writing the wrong one reverses the whole interpretation.

## References and further reading

- Hernán MA, Robins JM. [Causal Inference: What If](https://www.hsph.harvard.edu/miguel-hernan/causal-inference-book/). Chapman & Hall/CRC; 2020.
- Greenland S, Pearl J, Robins JM. [Causal diagrams for epidemiologic research](https://doi.org/10.1097/00001648-199901000-00008). *Epidemiology*. 1999.

- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott Williams & Wilkins.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland JM, Altman DG. *Medical Statistics: A Companion Guide*. Nelson.

The [Bayes' theorem article](bayes-theorem.html) shows how conditioning updates
beliefs with test results.
