---
title: Probability rules
summary: How to combine event probabilities using the complement, the addition rule, and the multiplication rule in clinical settings.
---

## Overview and key ideas

Probability is the language of uncertainty in medicine: it assigns a number between
0 and 1 to the chance that an event occurs, where 0 means impossible and 1 means
certain. Risk, prevalence, and survival probabilities are all probabilities written
in clinical clothing.

Three rules do almost all of the work in practice:

- **Complement rule** — P(not A) = 1 − P(A). Often the easiest way to answer
  "at least one" questions, by subtracting the chance of none from 1.
- **Addition (inclusion–exclusion) rule** — P(A or B) = P(A) + P(B) − P(A and B).
  If A and B cannot both happen (mutually exclusive), the overlap term is 0 and
  P(A or B) = P(A) + P(B).
- **Multiplication rule** — P(A and B) = P(A) × P(B|A). If A and B are
  independent, this reduces to P(A) × P(B).

These rules are identities — they are always true for correctly specified events —
so mistakes with them are almost always mistakes in setting up the events, not in
the arithmetic.

## When to use it

| Setting | Example question |
| --- | --- |
| Hospital infection surveillance | What is the chance an ICU patient develops VAP, a CLABSI, or both during a stay? |
| Clinical trials | What is the chance a patient in the treatment arm has an event, versus no event? |
| Risk communication | What is the chance a patient survives surgery *and* the postoperative period? |
| Cohort studies | What proportion of the exposed group develops disease, versus the unexposed group? |

## Assumptions and limitations

- The events must be defined for **the same population and time frame**; mixing a
  five-year risk with a one-year risk in one expression gives a number that refers
  to nothing.
- **Mutual exclusivity and independence are different.** Mutually exclusive events
  never co-occur; independent events' chances do not change when the other occurs.
  Confusing them is the most common setup error.
- Independence is an *assumption to justify or test*, not a default. Two events
  sharing a cause (e.g. both linked to frailty) are usually dependent.
- The rules combine probabilities exactly, but the inputs still carry sampling
  uncertainty — a "15%" computed from a small study is an estimate.

## Worked example

In a 100-patient ICU cohort, 10 patients (10%) developed ventilator-associated
pneumonia (VAP), 8 (8%) developed a catheter-related bloodstream infection
(CLABSI), and 3 (3%) developed both. Using the addition rule:

P(VAP or CLABSI) = 0.10 + 0.08 − 0.03 = 0.15.

So 15% of patients had at least one of the two common nosocomial infections, not
18% — naively adding the two marginals would double-count the 3 patients with
both. For the multiplication rule: if 95% of patients survive surgery and, among
those survivors, 90% survive the postoperative period, the chance of surviving
both is 0.95 × 0.90 = 0.855, so the complement rule gives a 14.5% chance of dying
in either phase.

## Interpretation and common pitfalls

- **Double counting** — adding P(A) and P(B) without subtracting the overlap
  inflates the probability of "A or B".
- **Assuming independence** — multiplying probabilities when the events are
  dependent (e.g. a patient's chance of bleeding and of poor healing both rise
  with age) over- or under-estimates the joint probability.
- **Forgetting the complement** — "probability of at least one infection" is
  1 − P(no infection); for rare independent events this is roughly the sum of the
  individual risks, but the exact calculation is safer.
- **Inclusive "or"** — in probability "A or B" includes the case where both
  occur; if a clinical question really means "exactly one", subtract both overlaps.

## References and further reading

- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Biostatistics*. Pearson.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.

*The topic map's "Conditional probability" article develops the multiplication
rule with conditioning in detail (article planned).*
