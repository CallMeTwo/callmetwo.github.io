---
title: Probability rules
summary: How to combine event probabilities using the complement, the addition rule, and the multiplication rule in clinical settings.
---

## Overview

Probability assigns values from zero to one to events in a defined population and time frame. The complement, addition, and multiplication rules are identities that let us combine event probabilities. Their most common misuse comes from confusing overlap, mutual exclusivity, or independence. Draw a probability tree or define events in words before calculating.

## Complement and “at least one”

For event A, P(not A)=1−P(A). The complement is useful for repeated opportunities: if each of n independent patients has event probability p, probability of at least one event is 1−(1−p)ⁿ. For p=.02 and n=50, this is 1−.98⁵⁰≈.636, not 50×.02 exactly. Independence and constant risk are assumptions; shared exposure or heterogeneous risks alter the calculation.

## Addition and overlap

P(A∪B)=P(A)+P(B)−P(A∩B). If A and B are mutually exclusive, the overlap is zero. For example, “readmission by day 30” and “death before day 30” may be competing first events and cannot both be first outcomes, but participants can have both at different times depending on definitions. For overlapping diagnoses or adverse events, subtract overlap to avoid double counting.

## Multiplication and conditional probability

P(A∩B)=P(A)P(B|A). Under independence, this becomes P(A)P(B). Sequential conditional risks can differ: the chance of infection followed by hospitalization is P(infection)×P(hospitalization|infection), not the product of marginal rates unless independent. Probability trees make these dependencies visible.

## Risk versus rate

Risk is probability over a specified period and lies between zero and one. Incidence rate is events per person-time and can exceed one; it is not itself a probability. Under a constant hazard λ, risk by time t is 1−exp(−λt), not λt except as a low-risk approximation. Competing risks change cumulative incidence and require accounting for other event types.

### Interpretation

Specify events, population, time horizon, and dependence assumptions. Probability identities do not resolve confounding, selection, or uncertainty in estimated probabilities. When inputs are estimated, report uncertainty or simulate the combined quantity. A numerically correct calculation can answer the wrong clinical question if event definitions are vague.

### Worked example with overlap

In 1,000 patients, 120 experience nausea and 80 experience dizziness; 30 experience both. Then P(nausea or dizziness)=(120+80−30)/1000=.17. Adding marginal proportions gives .20 and double-counts the 30 people in the overlap. If the question is “at least one event,” use the union. If it is “both events,” use intersection .03. If events are mutually exclusive by definition, overlap is zero; do not assume that merely because categories are presented separately.

```r
n <- 1000
p_A <- 120/n; p_B <- 80/n; p_both <- 30/n
p_either <- p_A + p_B - p_both
p_neither <- 1 - p_either
c(either = p_either, neither = p_neither)
```

For a composite safety endpoint, define whether the outcome counts participants with any component, first event, or total episodes. Component overlap and time ordering affect the probability and clinical interpretation.

### Repeated independent opportunities

If event risk per procedure is p and a patient undergoes n independent procedures with identical risk, chance of at least one event is 1−(1−p)^n. At p=.02 and n=10, risk is about 18.3%, not 20%. If risks differ by procedure, probability of none is product of (1−pᵢ), under independence. If procedures share susceptibility or risks cluster, independence fails and this formula overstates/understates as appropriate to dependence.

### Conditional chains

For infection followed by hospitalization, P(infection and hospitalization)=P(infection)P(hospitalization|infection). If infection risk is .1 and hospitalization among infected is .2, joint probability is .02. Multiplying .1 by the unconditional hospitalization probability would answer a different question. For a chain of events A, B, C, factor as P(A)P(B|A)P(C|A,B).

## Competing events and cumulative incidence

A probability over time needs a time horizon and event definition. With competing events, such as death before readmission, cumulative incidence accounts for the fact that a competing event can prevent the event of interest. Cause-specific hazards and cumulative incidence answer different questions. Categories are mutually exclusive only under a clear first-event rule; “ever hospitalized” and “ever had an adverse event” can overlap. Define chronology and horizon before summing probabilities.

## Unknown overlap and probability bounds

If only marginal probabilities are known, the intersection is not determined. For events A and B, max(0,P(A)+P(B)−1)≤P(A∩B)≤min(P(A),P(B)). Therefore, P(A∪B) lies between max(P(A),P(B)) and min(1,P(A)+P(B)). Assuming independence chooses one possible overlap, P(A)P(B), but that requires evidence.

For nausea risk .12 and dizziness risk .08, overlap could range from 0 to .08 based only on marginals; “at least one” could range from .12 to .20. If independence were justified, overlap=.0096 and union=.1904. Patient-level joint data are needed to know the actual overlap.

### Conditional formulas for diagnostic pathways

For a test-positive population, P(disease|positive) uses true positives divided by all positives. The chain rule P(disease and positive)=P(disease)P(positive|disease) helps construct natural-frequency tables. Reversing conditioning changes the denominator, which is why sensitivity does not equal PPV. Bayes’ theorem derives the latter from prevalence and test performance.

### Composite outcomes

A composite “any event” probability is a union of component events and needs overlap handling. Time-to-first-event composites count the first occurrence only; total event counts include recurrences. If components have different severity, the probability of any component may be dominated by a mild event. Report component probabilities and define the composite rule.

## Conditional probability trees

A tree begins with mutually exclusive branches that sum to one. Each next branch is conditional on the path so far; terminal path probabilities multiply along branches, and probabilities of disjoint terminal paths add. This is useful for testing algorithms: among 1,000 people, first test positive/negative, then confirmatory test result conditional on first. A tree makes selection and denominator shifts visible. For a sequential diagnostic pathway, branch first on disease status, then each result conditional on prior branches. Multiply along each path and sum disjoint paths for target probabilities. Natural-frequency counts (for example, out of 1,000 screened) make false positives and denominators easier to communicate than percentages alone.

```r
prev <- .02
sens1 <- .90; spec1 <- .95
p_pos <- sens1 * prev + (1-spec1) * (1-prev)
p_neg <- 1 - p_pos
c(positive = p_pos, negative = p_neg)
```

The first-stage result changes disease probability for the next stage. Confirmatory test performance should be conditional on having reached it if selection affects spectrum.

### Competing risks and time horizons

For mutually exclusive competing outcomes by a fixed horizon, probabilities sum to at most one. “Death by 30 days” and “readmission by 30 days” may both occur if readmission precedes death, so they are not necessarily mutually exclusive unless defined as first event. Define chronology. In survival analysis, cumulative incidence accounts for the fact that another event prevents the event of interest. Treating competing death as independent censoring can overstate absolute risk.

### Risk, odds, and rate

Risk is P(event by t). Odds are p/(1−p), unbounded, and odds ratios compare odds. A rate is events/person-time and has inverse-time units. If hazard is constant λ, survival S(t)=e^(−λt) and risk=1−S(t). Approximation λt is reasonable only when λt is small. These quantities answer distinct questions and should not be interchanged in prose.

## Uncertainty propagation

If event probabilities are estimated, a derived union or sequential risk inherits uncertainty and covariance among inputs. The delta method, bootstrap, or posterior simulation can propagate it. Assuming independent inputs when they are estimated from overlapping participants can misstate uncertainty. Report intervals or sensitivity ranges for decision-relevant probabilities.

### A full screening example

Suppose prevalence is 2%, sensitivity .90, specificity .95. The chance of positive result is P(+)=.90(.02)+.05(.98)=.067. Thus around 6.7% of screened people test positive. The chance of disease and positive is .018, while false positive is .049. PPV=.018/.067≈26.9%. The probability of a negative is .933; NPV=P(no disease and negative)/P(negative)=.95(.98)/.933≈99.8%.

```r
prev <- .02; sens <- .90; spec <- .95
p_pos <- sens * prev + (1-spec) * (1-prev)
ppv <- sens * prev / p_pos
npv <- spec * (1-prev) / (1-p_pos)
c(p_positive = p_pos, PPV = ppv, NPV = npv)
```

This example combines conditional and total-probability rules. It assumes test properties transport to screened people and disease prevalence is correct. A decision about follow-up should account for harms of false positives and missed cases.

### Conditional probabilities in risk prediction

A probability may be conditional on covariates, time, selection, or prior test result. A risk model estimates P(Y=1|X=x), not automatically P(Y=1 under intervention). Calibration is population-dependent. If the target distribution changes, marginal risks change even when conditional model coefficients remain the same. Standardization averages conditional predictions over target covariates.

### Rates and Poisson processes

A rate λ has units 1/time; probability over t is not λ unless using a small-risk approximation. Under a homogeneous Poisson process, P(N(t)=k)=e^(−λt)(λt)^k/k!, and P(at least one)=1−e^(−λt). If event rate varies, integrated intensity Λ(t)=∫λ(u)du replaces λt. Dependence between events violates the simple process assumptions.

### Summary of event algebra

Complement, union, intersection, and conditional probability rules are exact identities. Correct application depends on event definitions, overlap, dependence, and time horizon. Draw a table or tree, verify denominators, and propagate uncertainty when inputs are estimated.


## References and further reading

- CDC. [Principles of Epidemiology: probability and rates](https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section2.html).
- Rosner B. [Fundamentals of Biostatistics](https://www.cengage.com/c/fundamentals-of-biostatistics-9e-rosner/).

- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Biostatistics*. Pearson.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.

The [conditional probability article](conditional-probability-and-independence.html)
develops the multiplication rule in detail.
