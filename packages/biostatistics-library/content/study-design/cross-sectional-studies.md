---
title: Cross-sectional studies
summary: A design that measures exposure and outcome simultaneously, producing a snapshot of disease and risk-factor prevalence in a population.
---

## Overview and key ideas

A cross-sectional (prevalence) study measures both the exposure of interest and the outcome in each individual at a single point in time — or over a short, well-defined window. Unlike cohort or case-control designs, it does not follow people forward in time: it photographs the population, and each person contributes exactly one exposure–outcome pair. The central quantity is the **prevalence** of the outcome in the population, and among people with the outcome, the **cross-sectional odds ratio** (or prevalence ratio) comparing exposure between those with and without the outcome.

Because the same sample supplies both denominators, a cross-sectional survey is usually the cheapest design for questions of the form "how common is this, and who has it?"

Prevalence and association are summarised on different scales: the disease itself is described by a proportion (the prevalence), while exposure is compared between diseased and non-diseased people, giving a cross-sectional odds ratio — or, with the log-binomial model, a prevalence ratio. The choice matters for interpretation: an odds ratio of 2 for a common outcome looks striking but corresponds to a much smaller prevalence ratio.

## When to use it

Cross-sectional designs fit questions about the burden of disease at one point in time, not about temporal causality.

| Setting | Example question |
| --- | --- |
| National or local health surveys | What proportion of adults in this district meet the case definition of undiagnosed hypertension? |
| Occupational and service planning | How prevalent is low back pain among nurses in this hospital, and how is it associated with years worked? |
| Screening evaluation | What is the prevalence of diabetic retinopathy in this clinic's diabetic population, and is it associated with HbA1c? |
| Public health surveillance | What proportion of adolescents reports less than the recommended physical activity, by socioeconomic stratum? |

Cross-sectional data also supply prior probabilities for diagnostic-accuracy studies and baseline characteristics for later cohort work.

## Assumptions and limitations

- **No temporal ordering.** Exposure and outcome are measured together, so the design cannot establish which came first: a survey of smoking and depression cannot distinguish whether smoking causes depression or depressed people start smoking.
- **Prevalence, not incidence.** Prevalence reflects both new-onset incidence and duration; a fast-fatal or fast-resolving disease looks rare even with high incidence.
- **Prevalent-case (Neyman) bias.** Only people who survived and remain in the survey population are counted, so long-surviving or chronic cases are over-represented.
- **Prevalence–incidence–duration relation.** Prevalence ≈ incidence × average duration of disease; a cross-sectional estimate therefore conflates three quantities, and comparing prevalence across populations with different survival or remission patterns can mislead.
- **New cases are missed.** Cases arising after the measurement window are not captured, so cross-sectional data cannot support statements about incident disease.
- **Small-cell approximation.** Confidence intervals for proportions rely on the normal approximation; with fewer than about 5 expected events the interval is unreliable and an exact (Clopper–Pearson) method should be used instead.
- All estimates assume the sample is representative of the target population; a low response rate or convenience sample invalidates the prevalence estimate (see the library's sampling article).

## Worked example

A health screening examined 1,200 adults aged 40–75 in one city district. Ninety-six of them had diabetes. Among the 96 diabetics, 41 reported regular physical activity; among the 1,104 non-diabetics, 512 did.

- Diabetes prevalence = 96 / 1,200 = 8.0% (95% CI by the normal approximation for a proportion: about 6.5%–9.5%).
- Cross-sectional odds ratio for diabetes, regular vs irregular activity = (41 × 592) / (55 × 512) ≈ 0.86 (95% CI ≈ 0.59–1.26).

The point estimate is near 1 and the interval includes 1, so regular activity shows no detectable cross-sectional association with diabetes in this survey — and the design cannot say whether inactivity, if anything, preceded the diabetes, since both were measured on the same day.

## Interpretation and common pitfalls

- Reporting a cross-sectional odds ratio as if it were causal: because exposure and disease coexist, there is no evidence about which came first.
- Confusing prevalence with incidence: a 20% prevalence may mean many short-lived cases or a few long-lived ones; they have very different public-health meanings.
- Assuming non-responders are missing at random: people who refuse a health survey are often systematically different (worse health, different income), which can bias prevalence in either direction.
- Ignoring survey weights: in a two-stage cluster survey (as in most national health surveys), unweighted means are not population prevalences; weighted estimates and design-adjusted standard errors are required.
- Generalising a single-site snapshot: a one-time survey in one district says nothing about prevalence in another population with different age structure, healthcare access, or referral patterns.

## References and further reading

## What a cross-section can and cannot identify

## Estimands and causal structure

Cross-sectional research supports several distinct estimands. A weighted prevalence describes the proportion of a target population with a condition at a specified date or during a specified interval. A prevalence difference contrasts those proportions across groups. A standardized prevalence contrast predicts prevalence under a common covariate distribution. A causal effect of exposure on outcome is more demanding because the exposure may not precede the outcome and because selection into the cross-sectional sample can depend on exposure, disease duration, survival, or both. State which quantity the design can identify before choosing regression.

For an exposure (A), outcome (Y), and covariates (X), regression standardization computes predicted prevalence for each exposure level and averages over the target sample: \(\hat p_a=n^{-1}\sum_i\hat P(Y=1\mid A=a,X_i)\). The contrast \(\hat p_1-\hat p_0\) is a covariate-standardized association. It can be interpreted causally only if consistency, conditional exchangeability, positivity, valid measurement, and an appropriate sampling/selection mechanism are plausible. Cross-sectional timing often makes exchangeability and temporal ordering particularly difficult to defend.

```r
fit <- glm(asthma ~ exposure + age + sex + smoking,
           family = binomial(), data = dat)
dat1 <- transform(dat, exposure = 1)
dat0 <- transform(dat, exposure = 0)
p1 <- mean(predict(fit, dat1, type = "response"), na.rm = TRUE)
p0 <- mean(predict(fit, dat0, type = "response"), na.rm = TRUE)
c(p1 = p1, p0 = p0, prevalence_difference = p1 - p0,
  prevalence_ratio = p1 / p0)
```

The code standardizes over observed covariate records and is illustrative for an independent sample. Use survey-weighted fitting/prediction for complex sampling, account for uncertainty in both model fit and standardization (for example, design-respecting bootstrap or influence functions), and define how missing covariates are handled. Predictions do not repair unmeasured confounding or reverse causation.

## Repeated cross-sections and ecological time contrasts

## Nonresponse and item missingness

Differentiate unit nonresponse (no interview), item nonresponse (some fields missing), and ineligible units. Unit response adjustments use frame variables and paradata to estimate response propensities; item missingness may be handled with multiple imputation or item-specific weights. Imputation should preserve skip patterns, bounded scales, interactions, and complex survey structure. For multilevel designs, include PSU/stratum or appropriate random effects; ignoring clustering in imputation can distort both point estimates and variance. Pool estimates using rules consistent with the survey design and imputation procedure.

Report missingness by key exposure and outcome groups, compare respondents with available frame data, and run sensitivity analyses if missing-not-at-random responses are plausible. For sensitive outcomes, mode and privacy conditions affect item completion. A “prefer not to answer” category may be substantively distinct from accidental missingness. Do not use complete-case prevalence without explaining the denominator and selection assumptions.

## Communicating prevalence precisely

## Comparing prevalence over time with changing composition

### Interpretation checklist

For each estimate, give the target population, survey date/reference interval, numerator and denominator, weighting/standardization method, and uncertainty method. For associations, state whether estimates are crude, adjusted conditional ratios, or standardized marginal contrasts. Explain plausible reverse causation, survivor selection, and nonresponse. A cross-sectional design can describe burden very well; causal claims need additional temporal data or assumptions beyond the design label.

For two survey waves, report the crude difference and an age-standardized difference using a common standard population. Direct standardization applies wave-specific age-stratum prevalence to fixed age weights; indirect standardization can help when stratum counts are sparse but yields a standardized ratio rather than a directly comparable prevalence. Standardization addresses measured composition only. It does not solve changes in survey coverage, response mode, wording, or diagnostic criteria. Use replicate weights or design-based covariance to obtain uncertainty for standardized contrasts and note that weights may be estimated.

Use a clear denominator: all eligible adults, all respondents with complete outcome data, or a weighted domain. Give counts as well as weighted percentages, and identify whether estimates are age-standardized. A prevalence estimate from a probability survey applies to its target population and reference date only under coverage and response assumptions. Avoid generalizing a university or clinic sample to a national population because its sample size is large. The sampling mechanism, not N alone, supports representativeness.

Repeated cross-sectional surveys sample a new or partly overlapping set of people at each wave. They estimate population-level prevalence change, not individual-level change. Survey weights should reflect wave-specific selection and nonresponse, and estimates should account for clustering when the same primary sampling units recur. A change in age composition can produce a prevalence trend even if age-specific prevalence is stable; present crude and appropriately standardized trends. If the same people are followed, the study is instead longitudinal and requires within-person dependence and attrition handling.

When survey items or instruments change, apparent trends may reflect measurement non-equivalence. Maintain stable wording, response categories, administration mode, and timing, or conduct bridging studies. Mode changes can alter who responds and how people answer sensitive questions. Seasonal diseases require comparable field dates or explicit seasonal adjustment. For rare outcomes, pooled waves can improve precision but may mask real temporal change; a model with wave indicators and prespecified trend form is preferable to assuming linearity without evidence.

## Selection and prevalence-incidence bias

## Cross-sectional mediation and effect modification

### Example: additive and multiplicative interaction

Suppose prevalence is 5% in unexposed nonsmokers, 8% in exposed nonsmokers, 7% in unexposed smokers, and 14% in exposed smokers. The additive interaction contrast is \(.14-.08-.07+.05=.04\), or four percentage points beyond the sum of separate differences. The multiplicative contrast is \((.14/.07)/(.08/.05)=1.25\). Thus interaction depends on scale. Report stratum-specific prevalence and the scale-specific contrast with interval; a single product term in logistic regression tests multiplicative interaction on odds, not additive interaction in prevalence.

Cross-sectional mediation analysis is especially difficult because exposure, mediator, and outcome are measured simultaneously; temporal order and mediator-outcome confounding are usually uncertain. Product-of-coefficients estimates can be numerically computed but should not be given causal indirect-effect interpretation without strong temporal and identification assumptions. Longitudinal measurement with exposure before mediator and outcome is preferable. For descriptive effect modification, estimate group-specific prevalence contrasts and an interaction on a stated scale; interaction differs between additive and multiplicative scales. Public health decisions often care about additive interaction because it reflects excess cases, while multiplicative interaction may fit relative-effect questions.

Stratum-specific estimates need uncertainty and adequate sample support. A statistically significant interaction is not required to report clinically important heterogeneity, but exploratory patterns should be labeled as such. Avoid dichotomizing continuous modifiers at arbitrary cutpoints; use smooth interaction functions when sample size supports them.

Prevalent cases are those who both developed disease and remained available at sampling. If exposure increases mortality after onset, exposed cases may be underrepresented among survivors; if exposure prolongs disease duration, exposed cases may be overrepresented. This length-biased sampling makes exposure associations among prevalent cases differ from associations with disease onset. A cross-sectional association between current exposure and prevalent disease can therefore reverse the direction of an etiologic association. Incident-case ascertainment or a carefully defined longitudinal design is often needed for causal etiologic questions.

Clinic-based cross-sections select on attendance, which can be caused by both disease and healthcare access. Conditioning on attendance may induce collider bias. Population-based probability samples improve representativeness but still require response adjustment and measurement of nonresponse predictors. Report who was eligible, sampled, contacted, enrolled, and included in each denominator. Excluding people with missing exposure or outcome can create complete-case selection; characterize those exclusions and use appropriate imputation or weighting under explicit assumptions.

### Prevalence contrasts with uncertainty

For prevalence \(p=x/n\), the standard error under independent Bernoulli sampling is approximately \(\sqrt{p(1-p)/n}\). At p=.30 and n=600, this is about .0187, giving an approximate 95% margin of 3.7 percentage points. With cluster sampling, this understates uncertainty; a design effect of 1.5 inflates the standard error by \(\sqrt{1.5}\), making the margin roughly 4.5 points. For small samples or extreme proportions, use Wilson or exact intervals instead of the Wald interval.

Comparing two independent prevalences can be expressed as a risk difference or ratio. Pre-specify the primary scale and report both absolute and relative measures if useful. A prevalence ratio of 1.5 may mean 1.5 times a low prevalence or a very large absolute burden, depending on baseline prevalence. Standardized comparisons help separate demographic composition from within-stratum differences, but standardization weights should correspond to a stated target population.

A cross-sectional study measures exposure and outcome at approximately the same time in a defined population or sample. It is efficient for estimating prevalence, describing service needs, and exploring associations, but the temporal ordering needed for many causal questions may be unknown. An association between current exercise and current pain, for example, can reflect exercise affecting pain, pain changing exercise, or both being related to age or occupation. Retrospective histories may restore some temporal information but introduce recall and measurement error.

Define the reference period carefully. Point prevalence asks whether a person has the condition at the survey date; period prevalence asks whether it occurred during an interval. Prevalence is a function of both incidence and duration. A treatment that prolongs survival with disease can increase prevalence despite reducing disease incidence, so prevalent cases are a selected group of survivors. For conditions with onset and remission, prevalence depends on the timing and season of data collection.

Sampling should represent the target population at the intended reference time. If household, clinic, and web respondents are combined, their inclusion probabilities and coverage differences need attention. Nonresponse adjustment cannot recover people whose selection mechanism is not represented by observed information. Standard errors must respect cluster and stratification features. When estimating prevalence by age or sex, report numerator and denominator and consider direct standardization if populations are compared with different demographic compositions.

## Measures and models for prevalence data

For a binary outcome, prevalence is \(x/n\); a Wilson interval is often preferable to a Wald interval. When comparing groups, report prevalence differences and ratios with uncertainty. Logistic regression models prevalence odds, which can overstate prevalence ratios when the outcome is common. Log-binomial or modified Poisson models can estimate adjusted prevalence ratios, while standardized predictions can provide adjusted prevalence differences. These are descriptive associations unless confounding and temporal assumptions support a causal interpretation.

Example: in a survey, 180 of 600 exposed participants and 120 of 600 unexposed participants report current asthma. Prevalences are 30% and 20%; the prevalence difference is 10 percentage points, prevalence ratio 1.5, and prevalence odds ratio \((180/420)/(120/480)=1.71\). The odds ratio is noticeably farther from one than the ratio. If the design sampled by clinic, use survey-weighted estimates and cluster-aware variance rather than these unweighted calculations.

```r
dat$asthma <- as.integer(dat$asthma == "yes")
dat$exposed <- as.integer(dat$exposed == "yes")
with(dat, tapply(asthma, exposed, mean, na.rm = TRUE))
fit <- glm(asthma ~ exposed + age + sex, family = poisson(link = "log"),
           data = dat)
# Use a sandwich variance estimator for the modified Poisson model.
```

The fitted exposure coefficient exponentiates to a conditional prevalence ratio under the model, but naive Poisson standard errors are not appropriate for binary data. Use robust covariance (for example `sandwich::vcovHC`) or a design-aware survey model; check predicted probabilities and model fit. For a marginal adjusted contrast, predict each participant's outcome under exposed and unexposed status, then average each set of predictions and subtract or divide. State the covariate distribution over which averaging occurred.

## Bias, causal framing, and reporting

Selection into a cross-sectional sample can create collider bias if both exposure and outcome affect participation. Excluding people who died, recovered, or left employment before sampling can induce survivor bias. Reverse causation is particularly plausible for behaviors and clinical measurements changed by diagnosis. Confounding control helps only for measured, correctly specified variables; adding every available covariate can increase bias if some variables are mediators or colliders.

Predefine exposure, outcome, reference period, and subgroup analyses. Use validated instruments where possible; report missingness and whether prevalence denominators exclude unknown statuses. For continuous outcomes, describe distribution and measurement conditions; for repeated cross-sections, distinguish a population trend from individual change. A repeated survey of different people can estimate changing prevalence but cannot by itself describe within-person trajectories. When causal interpretation is intended, use an explicit causal diagram, justify temporal ordering, and state the additional assumptions rather than relying on the cross-sectional label alone.

- Setia MS. Methodology series module 3: cross-sectional studies. *Indian Journal of Dermatology*. 2016;61:261–264. https://doi.org/10.4103/0019-5154.182410
- Rothman KJ, Greenland S, Lash TL. *Modern Epidemiology*. 3rd ed. Lippincott Williams & Wilkins; 2008.
- Lumley T. *Complex Surveys: A Guide to Analysis Using R*. Wiley; 2010. https://doi.org/10.1002/9780470580066

- [STROBE Statement](https://www.strobe-statement.org/), reporting guidance for cross-sectional and other observational studies.
- Rothman KJ, Greenland S, Lash TL, eds. *Modern Epidemiology*. 3rd ed. Lippincott Williams & Wilkins, 2008.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and Other Advanced Topics*. Brooks/Cole.

The [sampling methods article](/biostatistics-library/study-design/sampling-methods.html) explains how survey design, nonresponse, and weighting affect population estimates.
