---
title: Non-randomized intervention studies
summary: How to estimate intervention effects when assignment is not randomized, using explicit causal questions and quasi-experimental designs.
---

## Overview and key ideas

A **non-randomized intervention study** evaluates an intervention whose assignment is determined by clinicians, patients, institutions, policy, or logistics rather than chance. Examples include a new discharge program introduced at selected hospitals, a law implemented in some regions, or a treatment chosen according to clinical severity. These studies may be prospective or retrospective and may include comparison groups and repeated measurements.

Because the intervention groups can differ before treatment, an observed outcome difference mixes the intervention effect with **selection and confounding**. Statistical adjustment can help only for measured, adequately modeled factors. A useful starting point is to specify the target question as if a trial could be run: eligible population, treatment strategies, assignment time, follow-up, outcome, and causal contrast. This target-trial framing helps avoid immortal-time bias, misaligned eligibility and treatment assignment, and inappropriate comparator selection.

**Quasi-experimental designs** strengthen causal inference by exploiting a policy threshold, rollout timing, comparison series, or other assignment mechanism. They do not remove assumptions; they make the identifying assumptions more explicit and sometimes more plausible.

## When to use it

Use these designs when randomization is infeasible, unethical, or unavailable, or when evaluating real-world policies and service changes. Common approaches include:

| Design | Core comparison | Key identifying idea |
| --- | --- | --- |
| Difference-in-differences | Change in treated units versus change in comparison units | In the absence of intervention, average outcome trends would have been parallel |
| Interrupted time series | Outcome level and trend before versus after intervention | No coincident event or change in measurement explains the post-intervention shift |
| Regression discontinuity | Units just above versus below an assignment cutoff | Near the cutoff, potential outcomes vary smoothly and the cutoff is not manipulated |
| Instrumental variables | Outcome differences induced by an instrument | Instrument affects treatment, is independent of potential outcomes, and affects outcome only through treatment (plus design-specific assumptions) |
| Propensity score weighting or matching | Outcomes among measured-covariate comparable groups | Conditional exchangeability, positivity, consistency, and correct enough estimation |

When treatment starts at different times across places, the analysis must account for treatment timing and potentially different effects by cohort and time since adoption. A simple two-way fixed-effects coefficient can be misleading under staggered adoption and heterogeneous effects.

## Assumptions and limitations

- **Exchangeability / no unmeasured confounding:** Conditional on measured covariates or the quasi-experimental design, treatment assignment is independent of relevant potential outcomes. This cannot generally be verified from observed data alone.
- **Consistency and well-defined treatment:** “Intervention” must represent sufficiently clear strategies. Different versions, uptake, and co-interventions can make the causal contrast ambiguous.
- **Positivity:** For covariate patterns in the target population, there must be a realistic chance of receiving each strategy. Extreme propensity weights signal weak overlap and unstable extrapolation.
- **Difference-in-differences:** Parallel trends concerns the untreated potential outcomes, not merely similar observed baseline levels. Similar pre-trends are supportive but cannot prove future parallel trends. Anticipation, spillovers, changing group composition, or concurrent policies can violate the design.
- **Interrupted time series:** Enough observations are needed before and after; seasonality, autocorrelation, secular trends, and concurrent events must be modeled. A single before-after contrast is not a robust time-series analysis.
- **Regression discontinuity:** The assignment rule must be enforced around a known cutoff; inspect manipulation and covariate continuity. The effect is local to units near that cutoff.
- **Instrumental variables:** The exclusion restriction is especially demanding and usually not testable directly. The estimate often applies to compliers, not every patient.
- **Outcome and follow-up:** Differential outcome ascertainment, loss to follow-up, and competing events can bias estimates even when the assignment design is credible.

## Worked example

A health system introduces a pharmacist-led discharge service at 8 hospitals. Eight similar hospitals do not introduce it during the same period. Thirty-day readmission falls from 18% to 14% in intervention hospitals and from 16% to 15% in comparison hospitals.

The unadjusted difference-in-differences estimate is:

`(14% − 18%) − (15% − 16%) = −4% − (−1%) = −3 percentage points.`

This estimate says readmission declined 3 percentage points more in the intervention hospitals, under the parallel-trends and other assumptions. It is not automatically causal: the service may have been introduced in hospitals already improving faster, or another discharge policy may have changed at the same time. Several pre-intervention periods, a prespecified comparison group, case-mix trends, implementation timing, and negative-control outcomes can help assess credibility. The standard error must reflect hospital-level assignment; treating every patient as independent would overstate precision.

## Interpretation and common pitfalls

- Label the estimate as causal only when the design's assumptions are credible, not because a regression adjusted for many covariates.
- Draw a causal diagram or write the assignment process in words before choosing adjustment variables. Adjusting for mediators or colliders can introduce bias.
- Avoid “significant pre-trend test = parallel trends.” Such tests can have low power; substantively assess pre-intervention trajectories and use sensitivity analysis.
- Do not compare a post-intervention group with a historically convenient control without addressing secular change and composition.
- Report the target population, treatment strategies, estimand, assumptions, diagnostics, and sensitivity analyses. If assumptions are weak, present the finding as an association and explain what would change the conclusion.
- For staggered adoption, select methods suited to treatment timing and heterogeneous effects rather than relying automatically on a conventional two-way fixed-effects model.

## Target trial specification and causal estimands

Begin by writing a target trial protocol even when only observational records are available. Specify eligibility, treatment strategies, assignment time (“time zero”), follow-up start and end, outcome, causal contrast, and analysis. Alignment matters: if eligibility is assessed before treatment but follow-up begins after treatment, selected patients must survive or remain event-free long enough to enter one arm, creating immortal-time or selection bias. A new-user, active-comparator cohort often aligns treatment initiation better than comparing prevalent users with untreated people.

Potential outcomes clarify the estimand. For a binary strategy `a`, let `Y^a` be the outcome that would occur if a person followed strategy `a`. The average treatment effect is `E(Y^1 − Y^0)` in a stated target population; the average treatment effect among treated is `E(Y^1 − Y^0 | A=1)`. These differ when effects vary and populations differ. In observational data, treatment received may depart from treatment initiated; specify whether the target is an initiation effect, a sustained-strategy effect, or a per-protocol effect. The intention-to-treat contrast is natural under random assignment, but not automatically defined in the same way for nonrandomized treatment receipt.

Identification typically invokes consistency, conditional exchangeability, and positivity. Consistency requires that observed outcomes under the received strategy equal the corresponding potential outcome and that versions of treatment are sufficiently well-defined. Exchangeability states that, conditional on measured pre-treatment covariates `L`, treatment is independent of potential outcomes. Positivity requires both strategies to occur with positive probability at each covariate pattern in the target population. These assumptions are substantive; model fit does not prove them. Interference also matters when one unit's treatment affects another's outcome, as with hospital policies or vaccination. Define exposure mappings or use group-level estimands when spillovers are expected.

## Adjustment methods and what they estimate

In a simple baseline-treatment setting, the propensity score `e(L)=P(A=1|L)` can support matching, stratification, or weighting. Inverse probability weights create a pseudo-population in which measured baseline covariates are balanced in expectation. For an ATE, stabilized weights may use `P(A=a)/P(A=a|L)`; for an ATT, treated observations receive weight 1 and controls receive `e(L)/(1-e(L))`. Weighted outcome contrasts target different populations, so always state the estimand. Examine propensity overlap, standardized mean differences, weight distributions, and effective sample size. Weight truncation can reduce variance but changes the bias-variance tradeoff and may change the target. It should be prespecified and reported.

A small executable example for baseline binary exposure:

```r
ps_fit <- glm(A ~ age + severity + comorbidity, family = binomial(), data = d)
d$ps <- predict(ps_fit, type = "response")
# Stabilized ATE weights
d$sw <- ifelse(d$A == 1, mean(d$A) / d$ps,
               (1 - mean(d$A)) / (1 - d$ps))
weighted_fit <- glm(Y ~ A, family = binomial(), data = d, weights = sw)
summary(weighted_fit)
```

This code illustrates weight construction; it is not a complete analysis. Standard model-based standard errors from weighted `glm` generally do not account for estimated weights or clustering. Use robust/sandwich or bootstrap inference appropriate to the sampling and assignment structure, and diagnose positivity before fitting an outcome model. For risk differences, estimate standardized risks under each treatment rather than interpreting a logistic coefficient as a risk difference. Doubly robust estimators combine treatment and outcome models and can remain consistent if one of the two is correctly specified under the other identification assumptions; “doubly robust” does not protect against unmeasured confounding or positivity violations.

When treatment and confounders evolve over time, ordinary regression adjustment can be biased if time-varying confounders are affected by prior treatment. Marginal structural models use inverse-probability weights for treatment and censoring histories; the g-formula models longitudinal outcomes under specified treatment regimes; structural nested models are another option. These approaches require sequential exchangeability, consistency, and positivity at each time. Extreme longitudinal weights are common and often reveal weak support for the target regime. State whether the estimand concerns sustained treatment, a dynamic strategy, or initiation.

## Quasi-experimental designs in greater detail

### Difference-in-differences

With two groups and two periods, the contrast is `(Y_T,post − Y_T,pre) − (Y_C,post − Y_C,pre)`. Its causal interpretation requires parallel counterfactual trends: absent intervention, treated and comparison outcomes would have changed equally on the chosen scale. The assumption concerns untreated potential outcomes and cannot be proven by a non-significant pretrend test. Plot multiple pre-periods, examine substantive comparability, investigate concurrent shocks and anticipation, and consider placebo dates/outcomes. With staggered adoption and heterogeneous treatment effects, traditional two-way fixed-effects regression can mix comparisons and assign unintuitive weights. Cohort-time estimators or event-study methods designed for staggered adoption are usually preferable. Cluster uncertainty at the level treatment is assigned; a large patient count does not compensate for a small number of treated hospitals.

### Interrupted time series

Segmented regression estimates immediate level and slope changes, for example `Y_t = β0 + β1 time + β2 post + β3 time_after + ε_t`. `β2` is an immediate level shift and `β3` a slope change, given the specified model. Seasonal patterns, autocorrelation, changing outcome definitions, and concurrent interventions can imitate intervention effects. A control series can strengthen the design if it shares background shocks but is not affected by the intervention. Report the number and spacing of observations and use a plausible functional form; segmented regression cannot turn a coincident event into an identified treatment effect.

### Regression discontinuity and instrumental variables

Regression discontinuity estimates a local effect near an assignment cutoff. It needs continuity of potential outcomes at the threshold, no precise manipulation of the running variable, and a treatment probability jump. Show the assignment rule, density and covariate continuity diagnostics, bandwidth sensitivity, and functional-form sensitivity. In fuzzy RD, assignment changes treatment probability and is used as an instrument; the estimand is local to compliers near the cutoff under additional assumptions.

Instrumental-variable analysis requires relevance, independence, exclusion, and often monotonicity for a local average treatment effect interpretation. The exclusion restriction—that the instrument affects the outcome only through treatment—is generally not empirically testable. Weak instruments produce unstable estimates and poor coverage. Explain the substantive mechanism and the population of compliers rather than calling IV a generic solution to confounding.

## Sensitivity, missingness, and design credibility

Observed balance is not the same as exchangeability. Negative controls can reveal some residual bias if their assumptions are defensible; quantitative bias analysis can show how strong an unmeasured confounder would need to be to alter conclusions. Compare results across plausible specifications and report where estimates depend on modeling choices. Do not use a single “robustness” result to imply all bias has been removed.

Missing outcomes and censoring can be informative. Inverse probability-of-censoring weights require that predictors of censoring and outcome be measured and modeled; multiple imputation requires a credible missingness model. Competing events alter the estimand: a cause-specific hazard ratio is not the same as cumulative incidence under competing risks. State the outcome scale and how death, switching, adherence, and loss to follow-up are handled.

A credible nonrandomized estimate is a joint product of design, subject-matter knowledge, measurement, and analysis. Present a causal diagram or explicit adjustment rationale, assess overlap before adjustment, and distinguish prespecified from exploratory decisions. If assumptions remain weak, communicate an adjusted association with sensitivity bounds rather than overstating a causal effect.


## Choosing among designs and preventing common analytic failures

Choose the design from the intervention's assignment process, not from whichever regression is easiest. If allocation follows a sharp threshold, an RD design may be more credible than broad covariate adjustment. If rollout timing is external to local outcome trends, DiD or event-study methods may help. If a policy affects an entire system with a clear implementation date, interrupted time series with adequate pre/post observations and a control series can be informative. Where none of these mechanisms is credible, a carefully designed cohort emulation may still estimate an association, but causal interpretation depends heavily on measured confounding assumptions.

Do not select covariates by whether their p-values change after adjustment. Use subject-matter knowledge and a causal diagram. Adjust for pre-treatment common causes of exposure and outcome; avoid conditioning on consequences of treatment when estimating total effects. Some post-treatment variables can be needed for per-protocol strategies or mediation questions, but their roles and estimands differ. “More covariates” can increase bias through collider conditioning, amplify measurement error, or destroy positivity.

Treatment and comparator definitions should account for adherence and co-intervention. A policy may be assigned at hospital level but only partly implemented; intention-to-treat-like assignment effects and effects of actually receiving the service are different estimands. If uptake is influenced by prognosis, naive as-treated comparisons reintroduce confounding. Instrumental variables, per-protocol weighting, or implementation models may be appropriate, but each adds assumptions. State whether contamination between groups is possible and whether spillovers are part of the policy effect.

Sample size in quasi-experimental studies is constrained by the number of independent assignment units and the strength of the natural experiment. A study with thousands of patients in two treated hospitals may have much less information than its patient count suggests. Cluster robust standard errors need adequate clusters; with few clusters use small-sample corrections or randomization-based methods where justified, and acknowledge remaining uncertainty. Report the number of clusters and intervention timing, not only participant counts.

### Difference-in-differences calculation in R

A minimal two-group/two-period illustration can estimate the interaction contrast:

```r
# d has group (treated/control), post (0/1), and outcome columns
fit <- lm(outcome ~ treated * post, data = d)
coef(fit)["treated:post"]
```

The interaction coefficient is the difference-in-differences estimate in this simple model. With repeated observations, inference must reflect assignment clustering; ordinary `lm` standard errors above are not appropriate for clustered treatment. With many periods or staggered adoption, use a method designed for the adoption structure, include event-time estimates, and avoid interpreting a single pooled coefficient without checking effect heterogeneity. The code estimates an algebraic contrast; it does not test the parallel trends assumption.


## Interpretation across effect scales

Effect measures are not interchangeable. A logistic regression coefficient is a conditional odds ratio; it is non-collapsible, so adjusted and unadjusted odds ratios may differ even without confounding. A hazard ratio is conditional on the risk set and proportional-hazards assumptions and does not directly give an absolute risk difference. For policy decisions, standardized risks, risk differences, or cumulative incidence can be easier to interpret. State whether the reported contrast is a risk ratio, odds ratio, mean difference, rate difference, survival contrast, or local IV effect, and over what follow-up horizon.

Effect heterogeneity matters for transportability. A propensity-weighted ATE estimates a target population contrast only when weights support that target; ATT weighting answers a treated-population question. If effects vary by severity, age, or site, a pooled effect can hide clinically important variation. Prespecify plausible modifiers, avoid overfitting sparse subgroups, and distinguish a subgroup estimate from evidence of interaction. Transporting an estimate to another region requires comparing effect modifiers and treatment versions, not just adjusting baseline prevalence.

### Sensitivity calculation for an unmeasured confounder

A transparent sensitivity analysis starts by specifying a hypothetical confounder and asking how strongly it would need to relate to treatment and outcome to explain the estimated association. For ratio measures, E-values provide one summary under specific assumptions, but they do not address selection bias, measurement error, or multiple confounders automatically. For difference-in-differences, vary plausible differential untreated trends; for interrupted time series, model alternative trend shapes and concurrent shocks; for IV, discuss plausible direct effects of the instrument. Sensitivity parameters should be anchored to subject-matter knowledge where possible and presented as scenarios, not as proof that bias is absent.

For example, if the estimated effect is a 3 percentage-point readmission reduction, show how the conclusion changes if treated hospitals would have improved an additional 1, 2, or 3 points even without the program. This can be calculated by subtracting each assumed differential trend from the DiD estimate. A 2-point violation leaves a −1-point adjusted contrast; a 3-point violation removes the estimated effect. Such a statement is more informative than merely saying “parallel trends may be violated.”


## Distinguish design diagnostics from assumption tests

Diagnostics can detect some contradictions but cannot certify identification. Good propensity overlap shows measured covariate support, not absence of unmeasured confounding. Similar pre-intervention trends support but do not prove parallel trends. Covariate continuity around an RD cutoff is reassuring but does not establish absence of precise manipulation in unobserved variables. A strong first stage supports IV relevance but does not prove exclusion. Present diagnostics as evidence about assumptions and specify which threats they cannot address.


## References and further reading

- Hernán MA, Wang W, Leaf DE. [Target trial emulation: a framework for causal inference from observational data](https://doi.org/10.1001/jama.2022.21383). *JAMA*. 2022;328(24):2446–2447.
- Hernán MA, Robins JM. [Using big data to emulate a target trial when a randomized trial is not available](https://doi.org/10.1097/EDE.0000000000000477). *Epidemiology*. 2016;27(3):335–338.
- Zeldow B, Hatfield LA. [Confounding and regression adjustment in difference-in-differences studies](https://doi.org/10.1111/1475-6773.13666). *Health Services Research*. 2021;56(5):932–941.
- The library's [bias and confounding article](bias-and-confounding.html) reviews confounding and adjustment; [randomized controlled trials](randomized-controlled-trials.html) describes the design benchmark these approaches seek to approximate.
