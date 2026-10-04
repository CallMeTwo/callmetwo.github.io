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

## Conditioning, selection, and causal structure

Conditional probability answers a restricted question: among individuals for whom B is known to hold, what fraction also satisfy A? In notation, P(A|B)=P(A∩B)/P(B), provided P(B)>0. The conditioning set changes the target population. Sensitivity is P(test positive | disease), whereas positive predictive value is P(disease | test positive); their denominators differ. Reversing the condition is a common but consequential error.

Independence means P(A∩B)=P(A)P(B), equivalently P(A|B)=P(A) when P(B)>0. It is a property of the joint distribution, not a synonym for “unrelated” or “no causal effect.” Two events may be independent in an observed table while a causal relation exists masked by other structure; conversely, association does not by itself establish direct causation. Mutual exclusivity implies dependence unless one event has probability zero. In trial randomization, assignment is independent of baseline potential outcomes in expectation under the randomization mechanism; the realized finite sample may have imbalances.

Conditioning can also introduce bias. A collider is a common effect of two variables; restricting to its value can associate its causes even if they were initially independent. For example, among hospitalized people, an exposure that increases admission and a separate illness that increases admission can become associated because hospitalization is a shared selection mechanism. Stratifying is appropriate only when guided by the causal structure and target estimand. Statistical tests for independence cannot decide which covariates should be adjusted for.

### Worked example: screening test and base rate

Suppose disease prevalence is 1%, sensitivity 90%, and specificity 95%. In 10,000 screened people, about 100 have disease: 90 test positive and 10 test negative. Of 9,900 without disease, 5% (495) test positive and 9,405 test negative. Thus P(disease|positive)=90/(90+495)=0.154, or 15.4%, despite 90% sensitivity. The low base rate means false positives outnumber true positives. Bayes' theorem formalizes this calculation.

```r
prev <- 0.01
sens <- 0.90
spec <- 0.95
ppv <- sens * prev / (sens * prev + (1 - spec) * (1 - prev))
npv <- spec * (1 - prev) / (spec * (1 - prev) + (1 - sens) * prev)
c(PPV = ppv, NPV = npv)
# PPV about 0.154; NPV about 0.999
```

The result applies only if prevalence, sensitivity, and specificity are valid for the screened population and test protocol. Spectrum effects can change sensitivity and specificity across settings; predictive values also change with prevalence. A screening result is not a diagnosis unless confirmatory testing and clinical context support it.

### Simpson's paradox and adjusted comparisons

Imagine a treatment appears beneficial in both low- and high-risk strata, yet harmful overall because more high-risk patients received treatment. The marginal comparison averages strata with different weights; the conditional comparisons use within-stratum denominators. These results are not mathematically contradictory. Which contrast is relevant depends on the question: the crude population association, a standardized risk under a common covariate distribution, or a causal treatment effect. Standardization computes a weighted average of stratum-specific risks using an explicit target distribution. Logistic regression's conditional odds ratio is not generally equal to a marginal odds ratio even without confounding because odds ratios are non-collapsible.

In observational studies, conditioning on measured confounders may reduce bias only if the confounders are appropriately measured and modeled; unmeasured confounding remains possible. Conditioning on mediators changes a total-effect question to a direct-effect question, while conditioning on colliders can create bias. Draw a causal diagram before selecting adjustment variables. Report stratum-specific risks or standardized effects when they clarify heterogeneity, and avoid using “adjusted” as a synonym for “causal.” See Hernán and Robins' *Causal Inference: What If* for formal treatment of these assumptions.


## Bayes reversal and diagnostic performance in context

Diagnostic measures are conditional probabilities tied to distinct denominators. Sensitivity=P(T+|D+), specificity=P(T−|D−), positive predictive value=P(D+|T+), and negative predictive value=P(D−|T−). Sensitivity and specificity characterize test behavior conditional on disease state; predictive values characterize the screened population after a result and therefore depend on prevalence. Likelihood ratios combine sensitivity and specificity into evidence multipliers that can be transported more readily across prevalence settings, although spectrum and protocol effects can alter them.

Consider 2×2 counts a=true positive, b=false positive, c=false negative, d=true negative. Sensitivity=a/(a+c), specificity=d/(b+d), PPV=a/(a+b), and NPV=d/(c+d). Every reported percentage should name its denominator. “The test is 90% accurate” is usually unhelpful because overall accuracy depends on prevalence and conceals the different costs of false positives and false negatives. Decision thresholds should reflect clinical consequences and downstream capacity.

### Worked example: changing prevalence changes PPV

Using sensitivity .90 and specificity .95, PPV at 1% prevalence is .154. At 10% prevalence, the same test has PPV=.90(.10)/[.90(.10)+.05(.90)]=.667. Thus, two-thirds of positive results are true positives in the higher-prevalence population, versus about one-sixth in the low-prevalence setting. The sensitivity and specificity were held fixed purely to illustrate Bayes' theorem; in practice they may change because disease severity and spectrum differ.

```r
ppv_from_prevalence <- function(prev, sens, spec) {
  sens * prev / (sens * prev + (1 - spec) * (1 - prev))
}
sapply(c(0.01, 0.10), ppv_from_prevalence,
       sens = 0.90, spec = 0.95)
```

This function assumes one fixed binary disease definition and test threshold. It should not be used to “correct” predictive values if the validation study used a different case definition or selectively verified test results. Partial verification, referral bias, and missing gold-standard assessments can bias sensitivity and specificity estimates.

## Independence, dependence, and factorization

Independence is valuable because it permits factorization of a joint distribution. For independent events, P(A,B)=P(A)P(B); for independent random variables, their joint density factors into marginal densities. Conditional independence given C means P(A,B|C)=P(A|C)P(B|C), which does not imply marginal independence. For example, two symptoms can be independent within disease strata but associated overall because both are more common when disease is present. Conditional independence is central in naive Bayes classifiers and graphical models, but the assumption often fails when predictors share mechanisms.

Repeated test results are rarely independent if both use the same specimen, device, or reader. If a second test is performed only after the first is positive, then the tested population is selected and conditional risks must reflect that pathway. Multiplying likelihood ratios for sequential tests assumes conditional independence of results given disease status. Correlated errors make the combined evidence weaker than this product suggests.

### Conditional probability and causal diagrams

In a directed acyclic graph, conditioning on a common cause can help block a noncausal path, while conditioning on a collider can open one. Suppose exposure E and an unmeasured illness U both cause hospital admission H; among admitted patients, E and U can become associated even if independent in the source population. This is selection (collider) bias. Conditional probabilities are mathematically valid in every such subset, but causal interpretation depends on how the subset arose. Always distinguish “among hospitalized patients” from “in the population that generated admissions.”

When comparing outcomes across groups, report marginal and conditional quantities with their target meaning. Standardization averages conditional risks over a chosen covariate distribution. A regression coefficient may be conditional on covariates and need not equal the marginal population contrast. For odds ratios, non-collapsibility creates this distinction even absent confounding. A model is not a causal adjustment set by itself; the assumptions require subject-matter reasoning.

## Tables as probability audits

A 2×2 table is an effective check against reversed conditioning. Put the condition defining the denominator in rows or columns and label totals. Calculate probabilities from the appropriate joint cell divided by the conditioning margin. If the numerical answer exceeds one or uses the wrong population size, the table reveals it. For multiway tables, compute stratum-specific probabilities before marginalizing, and explain the weights used in an overall estimate. This simple discipline prevents many errors in clinical interpretation.


## Marginalization and Simpson's paradox: a numeric illustration

Suppose a treatment is used more often in high-risk patients. In the low-risk stratum, event risks are 4/100=.04 under treatment and 8/200=.04 under control; in the high-risk stratum, risks are 30/300=.10 and 40/400=.10. There is no within-stratum difference, yet if treatment patients are predominantly high-risk, the crude risks can differ. In a stronger example, modest benefit in both strata can reverse marginally because group weights differ. The weighted average must use each group's actual covariate distribution for crude risk, or a common target distribution for standardized risk.

```r
risk_t_low <- 4/100; risk_t_high <- 30/300
risk_c_low <- 8/200; risk_c_high <- 40/400
# Standardize each treatment risk to a 50:50 target mix
c(treatment = .5*risk_t_low + .5*risk_t_high,
  control = .5*risk_c_low + .5*risk_c_high)
```

This example's stratum-specific risks happen to be equal, so standardized risks also match. If treatment allocation and risk strata differ, crude estimates can still differ because their weights differ. Always show the strata and target weights used; the phrase “adjusted for risk” is not enough to define the marginal quantity.

## Diagnostic verification and missing reference standards

Sensitivity and specificity are often estimated only in people who receive a definitive reference test. If verification is more likely after a positive screening result, the verified subset is selected. Naively calculating test characteristics among verified participants can produce verification bias. Blinded assessment, complete verification, or methods that account for the verification mechanism may be needed. The reference standard itself can be imperfect, in which case apparent test accuracy is relative to that standard rather than latent disease truth.

Conditional probabilities also depend on the disease definition and threshold. Changing a cutoff trades sensitivity against specificity; PPV and NPV then depend on the target prevalence. Report the threshold, intended setting, disease spectrum, and time between index and reference tests. If disease status can develop between tests, their temporal relationship changes the conditional probabilities.

## Probability trees and sequential testing

A probability tree makes conditional denominators visible. At each branch, probabilities outgoing from a node sum to one. For sequential tests, branch on the first result, then use the second-test probabilities conditional on disease status and first result where appropriate. Multiplying sensitivity values from two tests assumes conditional independence among diseased patients; specificity multiplication similarly assumes conditional independence among nondiseased patients. Shared assay technology can violate both.

Suppose prevalence is .02; test 1 has sensitivity .9 and false-positive rate .1, and test 2 has sensitivity .95 and false-positive rate .05. Under conditional independence, joint positive likelihood ratio is (.9/.1)×(.95/.05)=171. Prior odds .02/.98=.0204 yield posterior odds 3.49 and probability .777. If errors are positively correlated, the second positive adds less information, and this posterior is too high. A confirmatory test should be validated in the exact sequential pathway, not assumed independent from marginal characteristics.

## Independence and randomization

Randomization balances measured and unmeasured baseline prognostic factors in expectation, but it does not guarantee exact balance in a finite trial. Baseline p-values do not test whether randomization “worked”; random imbalance is expected. The assignment mechanism supports an independence statement, while post-randomization adherence and censoring can reintroduce selection. An intention-to-treat comparison preserves the randomized contrast; per-protocol effects require additional assumptions about adherence.

When reading an article, translate “risk among exposed” into P(Y|E), “exposure among cases” into P(E|Y), and “probability of disease after a positive test” into P(D|T+). Write the denominator beside each percentage and verify that it matches the question. This routine catches base-rate reversals, particularly when a diagnostic test has high sensitivity in a low-prevalence population.

For reports and dashboards, display both the conditional probability and its denominator, such as “30 of 400 participants (7.5%) were readmitted by day 30.” State whether the percentage is conditional on enrollment, survival, a positive screen, or completion of follow-up. This makes conditional structure visible and helps stakeholders compare like with like.

Conditional probability also clarifies subgroup reporting. “Risk among patients aged 65+” conditions on age group; comparing it with risk among younger patients is descriptive unless age and other differences are handled for a causal question. A subgroup-specific estimate may be imprecise even when the overall estimate is precise. Show denominators and intervals and avoid reading noisy subgroup fluctuations as biological effect modification without a prespecified interaction analysis.

## References and further reading

- Hernán MA, Robins JM. [Causal Inference: What If](https://www.hsph.harvard.edu/miguel-hernan/causal-inference-book/). Chapman & Hall/CRC; 2020.
- Greenland S, Pearl J, Robins JM. [Causal diagrams for epidemiologic research](https://doi.org/10.1097/00001648-199901000-00008). *Epidemiology*. 1999.

- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott Williams & Wilkins.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland JM, Altman DG. *Medical Statistics: A Companion Guide*. Nelson.

The [Bayes' theorem article](bayes-theorem.html) shows how conditioning updates
beliefs with test results.
