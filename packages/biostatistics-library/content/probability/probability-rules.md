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

### Time-to-event risks and repeated opportunities

The multiplication rule is especially useful when a clinical outcome requires
several sequential stages. If survival through stage two is conditional on
surviving stage one, multiply P(survive stage one) by P(survive stage two | survive
stage one); the second probability must use the survivors as its denominator.
For repeated independent opportunities with event probability p, the chance
of at least one event in n opportunities is 1−(1−p)ⁿ. This formula fails when
risks change over time or opportunities are dependent, as often occurs when
patients become more susceptible after an earlier event. For varying hazards,
survival analysis models the changing instantaneous event rate instead.

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

## Event algebra in longitudinal clinical questions

The elementary rules become easier to apply when events are defined with an explicit person, outcome, and time window. “Developed an infection” might mean any infection during admission, the first infection by day 30, or a particular organism by day 30. Probabilities from different windows cannot be added as though they describe a single event set. For competing outcomes such as cardiovascular death and non-cardiovascular death, the event definitions are mutually exclusive for a first cause of death, while the same person may experience both diagnoses at different times. State whether the outcome is “ever,” “first,” “at least one,” or “exactly one.”

For events A and B, the addition identity P(A∪B)=P(A)+P(B)−P(A∩B) is an inclusion-exclusion formula. For three events, add the three marginal probabilities, subtract the three pairwise intersections, then add the triple intersection. This prevents double counting. Complements can simplify complicated unions: P(at least one of A1,…,Ak)=1−P(none). If the events are independent and each has probability p, the latter becomes 1−(1−p)^k. Independence must be justified; recurrent events within one person often have dependence because prior events alter treatment and baseline risk.

The chain rule P(A∩B)=P(A)P(B|A) generalizes to sequences: P(A∩B∩C)=P(A)P(B|A)P(C|A∩B). This is useful for treatment pathways. If 90% survive surgery and 95% of surgical survivors avoid a complication, the joint probability of surviving and avoiding complication is 0.90×0.95 only if the second percentage uses the survivor denominator. Multiplying two probabilities with the wrong denominators silently changes the question.

### Worked example: at least one event over repeated visits

If a patient's independent risk of a mild adverse event on each of four monthly administrations is 0.06, then the chance of at least one event is 1−0.94^4=0.2193, about 21.9%. It is not 4×6%=24%, because that sum counts patients with multiple events more than once. The probability of exactly one is 4(0.06)(0.94)^3≈0.199. The probability of two or more is 0.2193−0.199≈0.0203.

```r
p <- 0.06
k <- 4
at_least_one <- 1 - (1 - p)^k
exactly_one <- choose(k, 1) * p * (1 - p)^(k - 1)
c(at_least_one = at_least_one, exactly_one = exactly_one,
  two_or_more = at_least_one - exactly_one)
```

This model supposes a constant per-visit risk and independence across visits. If susceptibility increases after an event, or doses are postponed after symptoms, the calculation is not appropriate. A time-to-event model with changing hazard or a recurrent-event model is needed. The formula also treats each administration as an opportunity with a common observation window; competing dropout may reduce the number of opportunities.

### Probability statements and uncertainty in estimated probabilities

The rules are exact when their inputs are known probabilities. Clinical probabilities are usually estimated from finite samples, so 0.06 itself has uncertainty. Plugging a point estimate into the repeated-risk equation yields a point estimate, not a confidence interval. For independent identical Bernoulli opportunities, one can propagate uncertainty by simulation from a suitable posterior or bootstrap the source data while preserving patient-level clusters. When event probabilities differ by visit, the no-event probability under independence is ∏(1−p_j); with dependence, marginal visit risks are insufficient to determine the joint risk.

### Pitfalls in communicating unions and intersections

“A or B” usually means inclusive or, A, B, or both. Clinical endpoints sometimes mean mutually exclusive categories, while composite outcomes mean at least one component and count a participant only once. For a composite endpoint, component frequencies cannot generally be summed to recover the proportion with any event. Report component-specific outcomes as well as the union, and explain whether recurrent events are counted once or multiple times. For sequential risks, define the conditional denominator clearly. Avoid describing a probability as an incidence rate: a rate has person-time units and can exceed one, whereas a probability is bounded by zero and one. The CDC epidemiology text and the conditional-probability article provide additional event and denominator examples.


## Worked example: overlapping outcomes and a composite endpoint

Among 1,000 patients followed for one year, suppose 80 have a cardiovascular event, 50 have a serious bleeding event, and 20 experience both. The probability of at least one endpoint is (80+50−20)/1000=.11, not .13. Exactly one of the two occurs in 60+30=90 patients, so P(exactly one)=.09. The probability of neither is 1−.11=.89. These categories partition the cohort only if follow-up is complete and each patient is counted once per endpoint definition. If recurrent episodes are counted, counts are no longer mutually exclusive patient categories.

```r
n <- 1000; n_cv <- 80; n_bleed <- 50; n_both <- 20
p_any <- (n_cv + n_bleed - n_both) / n
p_exactly_one <- (n_cv + n_bleed - 2*n_both) / n
p_neither <- 1 - p_any
c(any = p_any, exactly_one = p_exactly_one, neither = p_neither)
```

The inclusion-exclusion calculation assumes all numerator counts refer to the same cohort and time horizon. For time-to-first-event analysis, a person experiencing bleeding first may later have a cardiovascular event; competing-risk definitions differ from “ever had either.” State the outcome construction before applying probability rules.

## Sequential conditional risks and denominator checks

Suppose 1,000 patients are admitted, 100 develop sepsis, and 20 of those die. Then P(sepsis and death)=P(sepsis)P(death|sepsis)=.10×.20=.02. If 30 deaths occur overall, using 30/1,000=.03 as the conditional death probability among septic patients would be incorrect. The denominator in P(death|sepsis) is the 100 septic patients. Conversely, the probability that a death occurred among septic patients is P(sepsis|death)=20/30=.667, a different quantity useful for case review but not prognosis.

For multi-stage care pathways, multiply conditional probabilities using the eligible denominator at each stage. If a test has 95% sensitivity among diseased patients and a confirmatory procedure is completed by 80% of test-positive patients, the probability a diseased person receives confirmation is .95×.80=.76 only if completion probability truly conditions on a positive test in that target group. Nonattendance related to symptoms or access can change who reaches each stage.

### Independence as a practical hypothesis

If two independent adverse events each have probability .10, the chance of both is .01 and at least one is .19. If a shared frailty factor makes them positively associated, the joint probability can exceed .01, increasing the union probability. Independence can sometimes be a useful modeling approximation, but it should be defended by the mechanism and checked against repeated or joint outcome data. A contingency table can estimate association, although sparse cells make estimates unstable. A non-significant test does not prove independence.

For repeated opportunities with unequal risks p1,…,pk and conditional independence, the chance of no event is ∏(1−pj), so P(at least one)=1−∏(1−pj). If risks depend on prior outcomes, replace marginal risks with conditional probabilities along the sequence. This chain-rule representation always holds, even though independence simplification may not. In longitudinal medicine, hazard models describe instantaneous risk conditional on having remained event-free, and cumulative risk integrates this changing hazard over time.

## Probability estimates and confidence intervals

When probabilities are estimated as sample proportions, include their uncertainty. In the 1,000-person composite example, p̂=.11 and the binomial standard error is sqrt(.11×.89/1000)=.0099. A rough Wald interval is .091 to .129. For rare outcomes or small samples, Wilson or exact intervals are preferred. The overlap count and marginal counts are dependent, so uncertainty for a union can be estimated directly from the patient-level indicator “A or B,” not by treating the two proportions as independent.

```r
any_event <- c(rep(1, 110), rep(0, 890))
prop.test(sum(any_event), length(any_event), correct = FALSE)$conf.int
```

This creates a synthetic indicator with the stated event count and demonstrates a score interval. Real analyses should build the union indicator from patient identifiers and clearly defined time windows. If participants are clustered by ward, use a cluster-aware interval; the simple binomial interval assumes independent people.

The difference between a probability and a rate matters for communication. A 10% one-year risk is a probability; 10 events per 100 person-years is a rate. Under a constant hazard of .10 per person-year, one-year risk is 1−e^−.10=9.5%, not exactly 10%. With competing events, the probability of a cause-specific event depends on both its hazard and hazards of alternatives. The survival and competing-risk sections develop these calculations.


## Bounds when overlap is unknown

If only marginal probabilities are known, the union is not determined because the overlap is unknown. Fréchet bounds give max[P(A),P(B)] ≤ P(A∪B) ≤ min[1,P(A)+P(B)]. For risks .10 and .08, the chance of at least one lies between .10 and .18. Independence would imply .10+.08−.008=.172, but that is only one possible joint structure. Reporting the independence-derived figure as fact when overlap data are unavailable hides a strong assumption.

Similarly, P(A∩B) lies between max[0,P(A)+P(B)−1] and min[P(A),P(B)]. These bounds can be useful in evidence synthesis when only separate outcome summaries are available. If the bounds are too wide to inform decisions, collect joint outcome data rather than assuming independence. This is particularly important for harms that share biological pathways.

## Competing events and probability over time

For event types A and B that compete as first events, the cumulative probability of A by time t depends on A's hazard and survival from all event types. Adding cause-specific risks estimated while censoring competing events can overestimate real-world cumulative incidence. The probability rules remain valid, but the relevant joint event structure is time-dependent. Define whether a competing event removes the possibility of the outcome or merely changes its subsequent risk, and choose a competing-risk estimand accordingly.

A simple illustration uses constant cause-specific hazards λA and λB. Overall event-free survival is exp[−(λA+λB)t], and cumulative incidence of A is λA/(λA+λB)×[1−exp{−(λA+λB)t}]. If λA=.04 and λB=.06 per year over three years, the probability of A first is .4×[1−exp(−.30)]=.104. Ignoring B would produce 1−exp(−.12)=.113, slightly higher here; the gap grows with competing hazard and follow-up.

```r
lambda_a <- .04; lambda_b <- .06; t <- 3
cif_a <- lambda_a/(lambda_a+lambda_b) *
  (1 - exp(-(lambda_a+lambda_b)*t))
cif_a
```

This constant-hazard calculation is illustrative. Use nonparametric cumulative-incidence estimators or regression when hazards vary and account for censoring. See the library's event-time and competing-risk materials.

## Worked example: overlap bounds and shared causes

Suppose registry data give 12% with chronic kidney disease and 8% with heart failure, but linkage has not yet provided the number with both. The proportion with either lies between 12% (if all heart-failure cases are among CKD cases) and 20% (if no one has both). Assuming independence gives .12+.08−(.12×.08)=.1904, but this value is not identified by the two marginals. Because age, diabetes, and hypertension cause both conditions, independence is implausible. Use linked records or report bounds rather than presenting an independence estimate as observed fact.

In practice, overlap is often available in person-level data; calculate it once per unique person and time horizon. Duplicate claims or encounters can inflate counts if the unit of analysis is accidentally changed from person to event. State whether the event is ever observed, first occurrence, or number of episodes.

When presenting composite risks, use a small table listing event A only, event B only, both, and neither. This partition makes the union and exact-one probabilities auditable. If data are only available as marginal risks, state whether dependence is unknown, assumed, or estimated. That short clarification can prevent an independence approximation from being mistaken for a measured result.

If one event makes another impossible, the events are mutually exclusive and their intersection probability is zero; the union probability is the sum of the two risks. This is common for mutually exclusive first causes of death. If a participant can experience both conditions over follow-up, they are not mutually exclusive even if only one is recorded as the primary outcome. The outcome coding rule determines which probability identity applies.

## Keep probability and rate language distinct

A probability always lies from zero to one over a defined interval. A rate has inverse-time units and can be greater than one; 150 events per 100 person-years is a valid rate but not a 150% probability. The conversion from a constant hazard to risk uses the exponential survival relation, while a simple multiplication by time is only a small-risk approximation. Use “risk” for cumulative probability and “rate” for events divided by person-time.

## References and further reading

- CDC. [Principles of Epidemiology: probability and rates](https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section2.html).
- Rosner B. [Fundamentals of Biostatistics](https://www.cengage.com/c/fundamentals-of-biostatistics-9e-rosner/).

- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Biostatistics*. Pearson.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.

The [conditional probability article](conditional-probability-and-independence.html)
develops the multiplication rule in detail.
