---
title: Conditional probability and independence
summary: Probability of one event given another, how to test independence from a two-way table, and why conditioning changes the risk you see.
---

## Overview

Conditional probability quantifies event A among cases where event B is known: P(A|B)=P(A∩B)/P(B), provided P(B)>0. It formalizes how information changes risk. Independence means knowing B does not change the probability of A, equivalently P(A|B)=P(A) or P(A∩B)=P(A)P(B). In clinical data, denominators make conditional statements concrete: risk of disease among exposed, test positivity among diseased, or readmission among discharged patients.

## Read a 2×2 table by conditioning

Suppose 100 patients are vaccinated and 20 become infected; 100 unvaccinated patients have 30 infections. Infection risk conditional on vaccination is 20/100=.20; conditional on no vaccination it is 30/100=.30. The marginal risk is 50/200=.25. These conditional risks describe observed strata. A risk ratio is .67 and risk difference −.10, but causal interpretation requires suitable assignment or confounding assumptions.

Conditional directions reverse differently: P(vaccinated|infected)=20/50=.40, not .20. Sensitivity is P(test positive|disease); PPV is P(disease|test positive). Confusing these is the base-rate error.

## Independence and factorization

Events A and B are independent if occurrence of one supplies no probabilistic information about the other. Mutually exclusive events with positive probabilities are not independent because one excludes the other. Independence of random variables is stronger than zero correlation; nonlinear dependence can have zero Pearson correlation. In clinical data, repeated measures from one person are seldom independent, and patients at the same clinic may share exposures or care.

## Conditioning can change associations

Conditioning on a subgroup can create or reverse association if the conditioning variable is affected by both exposure and outcome. For example, restricting analysis to hospitalized patients can associate unrelated causes of hospitalization. A collider is a common effect of two variables; conditioning on it induces dependence. Causal diagrams help decide which variables to condition on. Stratifying automatically on every available variable can introduce bias.

### Sequential testing and Bayes

For sequential tests, posterior risk after a second result depends on the joint likelihood of both results given disease. Multiplying likelihood ratios assumes conditional independence given disease status. If tests share technology or biological signal, this can overstate evidence. Define the population and conditioning information at each step.

Conditional probability is arithmetic, not causal explanation. Report denominator, time window, and sampling design. Independence assumptions should follow the data-generating process, not software convenience.

## Bayes reversal and diagnostic quantities

Sensitivity is P(test+|disease); positive predictive value is P(disease|test+). Specificity is P(test−|no disease); negative predictive value is P(no disease|test−). These are not symmetric because conditioning changes the denominator. A screening test can have high sensitivity and specificity yet low PPV when disease is rare. Bayes’ theorem connects the quantities using prevalence.

A likelihood ratio expresses how much a result shifts odds. LR+ = sensitivity/(1−specificity), and LR−=(1−sensitivity)/specificity. Posterior odds equal prior odds times LR. If tests are sequential, update after each result using conditional performance in the population that reached that test. The second test’s characteristics may differ because first-test positives are a selected spectrum.

### Independence in clinical data

Independence means joint probability factorizes for every relevant event, not merely that Pearson correlation is zero. Two measurements may be uncorrelated but dependent through a nonlinear relationship. Independence of individuals is also distinct from independence of variables: repeated outcomes within each patient violate independent-row sampling even if treatment and outcome are conceptually separate.

Common sources of dependence include repeated measurements, family relationships, shared clinic, common exposure, and matched sampling. Standard errors that ignore such dependence can be too small. Use cluster-aware models, random effects, GEE, or design-based methods. A contingency table does not make observations independent by formatting them into cells.

## Conditioning, selection, and collider bias

Conditioning on a variable can change associations. If hospitalization is caused by both exposure and illness severity, restricting analysis to hospitalized patients can create an association between exposure and severity even when none exists in the source population. This is collider bias. Similarly, analyzing only patients with complete follow-up can induce bias if both prognosis and treatment affect follow-up.

Before stratifying or adjusting, identify the question and causal structure. Conditioning on a confounder may reduce bias; conditioning on a mediator changes the total-effect estimand; conditioning on a collider may create bias. Probability calculations remain correct for the selected group, but that group may not represent the target population.

## Simpson’s paradox: a numerical pattern

Suppose treatment appears beneficial in each severity stratum but harmful overall because treatment is given mostly to severe patients. The aggregate conditional probability P(outcome|treatment) mixes different severity distributions; stratum-specific probabilities condition on severity. Neither marginal nor stratified number is universally preferable: the causal estimand determines whether to standardize over a target severity distribution. This is why denominator and conditioning variables must be named.

## Probability trees and chains

For sequential events A then B, P(A∩B)=P(A)P(B|A). A tree diagram labels each branch with a conditional probability and terminal path probability. Summing paths gives marginal probability. This helps calculate multi-stage screening, treatment response followed by toxicity, and event progression. Do not multiply marginal probabilities unless independence is justified.

## Reporting conditional risks

State “among whom,” time window, and event definition. For example, 30-day readmission among discharged patients differs from 30-day readmission among all admitted patients if death occurs before discharge. Competing events and censoring affect conditional probabilities over time. Probability rules are identities, but scientific validity depends on correctly defining populations, conditioning sets, and dependence.

### Conditional probability and risk sets over time

A hazard is an instantaneous conditional rate among people event-free up to time t, not the unconditional probability of an event. Survival probability is the probability of remaining event-free through t; under hazard λ(t), S(t)=exp(−∫₀ᵗ λ(u)du). With competing events, the cumulative incidence of one cause depends on all cause-specific hazards. This distinction prevents confusing conditional risk among survivors with population risk over a fixed horizon.

For example, a 30-day readmission risk among people discharged alive excludes in-hospital deaths by design. A readmission cumulative incidence from admission must account for death before discharge. State the risk set and time origin.

### Selection and conditioning examples

Conditioning on a positive screening result changes disease prevalence in the evaluated subset; PPV is conditional on that result. Conditioning on clinic attendance can also select patients with symptoms or access factors. Among only hospitalized patients, exposure and severity may become associated because both influence admission. These are not arithmetic errors: they are properties of the selected population. The challenge is whether that conditional quantity matches the target.

Causal diagrams can distinguish confounders (common causes of exposure and outcome), mediators (on causal pathway), and colliders (common effects). Adjusting for a mediator estimates a direct rather than total effect; adjusting for a collider can induce bias. Probability conditioning is the mathematical operation; causal assumptions determine which conditioning set is appropriate.

### Independence of observations versus events

The multiplication rule for independent events is distinct from independent sampling units. A patient’s repeated infections may be dependent over time because susceptibility persists; a clinic outbreak creates shared risks among patients. Binomial/Poisson models assuming independent outcomes may understate uncertainty. Use clustered or recurrent-event models and describe the dependence structure.

Zero correlation does not imply independence unless additional conditions, such as joint normality, hold. Conversely, strong correlation is one form of dependence but not the only one. Model diagnostics focused only on Pearson correlation can miss nonlinear dependence.

### Worked Simpson pattern

Suppose recovery is 90/100 (90%) under A and 18/20 (90%) under B for mild disease; for severe disease it is 5/20 (25%) under A and 4/10 (40%) under B. B is equal or better within each stratum. Yet pooled recovery is 95/120=79.2% for A and 22/30=73.3% for B because B treated a larger fraction of severe patients.

The reversal arises because treatment B is used more often in severe patients. Marginal recovery P(recovery|treatment) mixes different severity distributions; conditional probabilities within severity compare more similar patients. Which summary is appropriate depends on whether the target is crude population experience or a causal effect standardized to a target severity distribution. State the target weights and assumptions.

### Conditional independence in diagnostic tests

Two test results may be independent in the general population only after conditioning on disease status, and even then may share error mechanisms. If correlated, multiplying marginal likelihood ratios exaggerates evidence. A latent-class model or joint sensitivity/specificity can represent dependence, but requires data and assumptions. Sequential testing algorithms should be validated end-to-end in the population where they will be used.

### Probability of conjunctions and chains

The chain rule always holds: P(A∩B∩C)=P(A)P(B|A)P(C|A,B). Independence is not required. For a clinical pathway, probability of a positive screen followed by confirmatory disease diagnosis decomposes into screening positivity and confirmation conditional on screening result. Summing all terminal paths gives overall probability. This is a reliable way to prevent denominator errors.

### Independence assumptions in models

Logistic and Poisson likelihoods often assume conditional independence of observations given covariates. Cluster random effects induce conditional dependence; GEE uses working correlation and robust covariance; survival frailty models represent shared hazard. If repeated measures are ignored, standard errors can be too small, though coefficient bias depends on model and sampling. The independent unit is determined by assignment and data generation.

### Interpretation checklist

For any conditional statement, identify the event after the bar, population, time origin, and denominator. For independence, specify whether it concerns events, variables, or observational units. For adjusted analyses, say which variables were conditioned on and why. Probability notation is compact; the words around it prevent misinterpretation.

### Probability tables as denominator audits

For every conditional probability, write numerator and denominator explicitly. “20 of 100 exposed patients infected” is P(infection|exposure)=.20; “20 of 50 infected patients were exposed” is P(exposure|infection)=.40. Both are correct, but they answer different questions. Natural-frequency tables reduce reversal errors and help communicate Bayes’ theorem.

### Marginalization

To obtain a marginal probability, sum over mutually exclusive strata: P(A)=Σj P(A|Bj)P(Bj). The weights P(Bj) define the population distribution. Standardizing to a different set of weights changes the marginal quantity and can alter comparisons. Always state the target population weights when producing adjusted risks.

### Independence versus mutual exclusivity

Events are mutually exclusive if they cannot occur together, so P(A∩B)=0. If both have positive probability, they cannot be independent because P(A)P(B)>0. For example, a patient cannot have first event type A and first event type B at the same time, but a patient can experience both diagnoses over follow-up. Definitions determine whether events overlap. Do not treat categories as mutually exclusive just because a table has separate rows.

### Conditional risk and competing events

Conditional risk among those surviving to time t differs from cumulative risk from baseline. A hazard is conditional on remaining event-free up to t, while cumulative incidence integrates hazard over the population still at risk. With competing death, probability of readmission by day 30 is reduced because some patients die first. State the risk set and estimand; do not multiply a constant rate by time except as a low-risk approximation under stable hazard.

### Stratified probabilities and standardization

Marginal probability is a weighted average of stratum-specific probabilities, with weights equal to stratum prevalence in the target population. If weights differ between treatment groups, crude risks combine both treatment association and case mix. Standardization applies common target weights to both groups. This changes the estimand from observed marginal risk to a standardized risk and relies on adequate overlap and measured covariates.

### Independence and randomization

Random assignment makes treatment independent of potential outcomes in expectation, but observed covariates can still be imbalanced by chance. This is not the same as all observations being independent: cluster randomization deliberately creates within-cluster dependence. Analyze according to assignment unit and use design-aware variance. Conditional independence assumptions should be distinguished from randomization assumptions.

### Probability and causal diagrams

Directed acyclic graphs encode causal assumptions and help decide which variables to condition on. A confounder is a common cause; adjustment can block a backdoor path. A mediator lies on a causal path; conditioning changes the total effect. A collider is a common effect; conditioning opens a noncausal path. The conditional probabilities in an observational dataset can be calculated exactly, but causal interpretation depends on the diagram and identification assumptions.

### Worked base-rate example

In a population of 10,000 with disease prevalence 1%, 100 people have disease. At 90% sensitivity, 90 test positive. Among 9,900 without disease, 5% false-positive rate yields 495 positives. Thus P(disease|positive)=90/585=.154, while P(positive|disease)=90/100=.90. The denominator reversal explains why sensitivity cannot be interpreted as PPV.

### Standardization example

Suppose risk under A is 10% in low-risk patients and 40% in high-risk patients; under B it is 8% and 35%. If target population is 80% low-risk, standardized risks are A=.8(.10)+.2(.40)=.16, B=.8(.08)+.2(.35)=.134, RD=−2.6 points. If high-risk prevalence is 50%, standardized risks become .25 and .215, RD=−3.5 points. Absolute effect changes with target mix even when stratum risks are fixed.

```r
w <- c(low = .8, high = .2)
risk_A <- c(low = .10, high = .40)
risk_B <- c(low = .08, high = .35)
sum(w * risk_A) - sum(w * risk_B)
```

Standardization requires stratum-specific risks to be identified and target weights chosen. In observational data, residual confounding and positivity violations remain concerns.

### Conditional probability and missingness

Complete-case probability P(outcome|observed) equals target P(outcome) only under assumptions about observation. If severe patients are less likely to return, observed follow-up risk is selected. Weighting or imputation can adjust under measured predictors and missingness assumptions. Conditioning on being observed does not automatically preserve the original cohort.

### Dependence between variables and observations

Independence of events A and B is not the same as independent patients. A and B can be dependent within a person even when people are sampled independently. Conversely, treatment and outcome can be statistically dependent because treatment affects outcome, while assignments may be independent by randomization. State what independence assumption applies to which random quantities.

For multivariate normal variables, zero covariance implies independence, but this special property does not hold generally. A zero Pearson correlation can coexist with strong nonlinear dependence. Tests and models that assume independence should be justified by design and distribution, not by a nonsignificant correlation.

### A decision-relevant conditional statement

“Among patients with a positive test, 15% had disease” is a predictive value in the tested population. “Among diseased patients, 90% tested positive” is sensitivity. “Among patients discharged alive, 8% returned within 30 days” conditions on discharge and follow-up. These statements are not interchangeable. Include conditioning group and time period in prose and tables.

### Final interpretation

Conditional probability is central to clinical risk, diagnostic testing, and causal analysis. Independence is a strong factorization assumption, while conditioning can alter both association and target population. Name denominators, dependence structure, and causal role of adjusted variables to make probability statements interpretable.

### Probability of selection and transport

A probability conditional on being enrolled, tested, or followed may differ from the target-population probability. Screening studies with verification only among positives, complete-case cohorts, and referral clinics all condition on selection. To generalize, characterize selection variables and use weighting or modeling under explicit assumptions. A precise conditional estimate can still be the wrong target for policy.

### Independent events in risk calculations

If two treatment harms are independent, chance of at least one is 1−(1−p1)(1−p2). If they share a mechanism, overlap may be greater; if mutually exclusive, overlap is zero. Estimate the joint event directly when possible. Do not multiply marginal complements without a dependence justification.

### Summary for practice

Conditional probability tells exactly which population a risk describes; independence permits factorization but is a substantive assumption. Use tables to keep denominators visible, trees for sequential events, and causal structure to guide adjustment. Repeated or clustered observations need dependence-aware variance. These steps make conditional statements useful without overclaiming.

In prose, use “among those with B” to express P(A|B), and avoid dropping the denominator from risk statements.



A conditioning variable can be a confounder, mediator, or collider; its causal role determines whether adjustment is appropriate.


For every conditional probability, write the numerator event and the conditioning denominator explicitly before simplifying the ratio.

If a probability is standardized, state the target distribution used for weighting the conditional risks.

Conditioning is a mathematical operation; the study design determines whether the resulting quantity answers a causal or descriptive question.

Report both marginal and relevant conditional probabilities when conditioning materially changes the clinical interpretation.

A probability statement without its denominator is incomplete.

That denominator should name the population, selection condition, and time window.



### Summary of conditioning

Marginal risk averages over a population mix; conditional risk describes a subgroup defined by known information. Changing that subgroup changes the probability and sometimes the association. Identify the conditioning set and use causal structure to decide whether it is appropriate for adjustment.


State any assumptions that make the conditioning group comparable across exposures.

Use this discipline in both analysis plans and clinical communication.

## References and further reading

- Hernán MA, Robins JM. [Causal Inference: What If](https://www.hsph.harvard.edu/miguel-hernan/causal-inference-book/). Chapman & Hall/CRC; 2020.
- Greenland S, Pearl J, Robins JM. [Causal diagrams for epidemiologic research](https://doi.org/10.1097/00001648-199901000-00008). *Epidemiology*. 1999.

- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott Williams & Wilkins.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland JM, Altman DG. *Medical Statistics: A Companion Guide*. Nelson.

The [Bayes' theorem article](bayes-theorem.html) shows how conditioning updates
beliefs with test results.
