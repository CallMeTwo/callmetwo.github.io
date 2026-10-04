---
title: What is biostatistics?
summary: The branch of statistics applied to biological and medical research — turning messy data into trustworthy evidence.
---

## Overview and key ideas

[Biostatistics](https://en.wikipedia.org/wiki/Biostatistics) (also
[biometry](https://en.wikipedia.org/wiki/Biometry)) is the application of
statistical methods to biology, medicine and public health. Where general
statistics develops the mathematics of inference, biostatistics focuses on
the practical problems of real research: how to design a study, how to
summarise what was measured, how to quantify uncertainty, and how to report
findings honestly.

A biostatistician works at every stage of a study:

- **Before data collection** — choosing a study design and calculating the
  sample size needed to answer the question reliably.
- **During analysis** — selecting appropriate tests, building models, and
  checking their assumptions.
- **After analysis** — interpreting results in clinical terms and writing
  methods and results sections that other researchers can reproduce.

## When to use it

Any study that draws conclusions from samples rather than whole populations
relies on biostatistics. Typical settings include:

| Setting | Example question |
| --- | --- |
| Clinical trials | Does a new treatment reduce mortality compared with the standard? |
| Epidemiology | Is exposure to air pollution associated with higher asthma rates? |
| Screening programmes | How well does this test detect disease in early stages? |
| Health services research | Does the intervention change wait times or outcomes? |

## Assumptions and limitations

Statistical conclusions are only as strong as the data and design behind
them. Common pitfalls that statistics alone cannot fix:

- **Selection bias** — the sample does not represent the population of interest.
- **Confounding** — a third variable explains the observed association.
- **Missing data** — incomplete records that change who is being measured.
- **Overinterpretation** — reading causation into an observational
  association, or treating a p-value of 0.06 as "nearly significant".

### Design, estimand and analysis belong together

Start with a target population and a question that specifies the comparison,
outcome and time horizon. The design determines what can be learned: random
allocation can support a causal treatment contrast under appropriate conduct
and follow-up, while an observational association requires attention to
confounding and selection. Before seeing outcomes, an analysis plan should
state the primary estimand, outcome scale, missing-data approach, subgroup
analyses and sensitivity checks. Reporting an effect estimate with a
confidence interval shows its magnitude and precision; neither a small p-value
nor a complex model repairs poor measurement or a misaligned design.

## Worked example

Suppose a trial randomises 200 patients to a new drug and 200 to placebo.
After one year, 18 of 200 in the drug group and 30 of 200 in the placebo
group had the bad outcome. A biostatistician would compare the two event
rates (9% vs 15%), test whether the difference is likely due to chance,
estimate the effect size (e.g. relative risk ≈ 0.60), and report a confidence
interval — not just a p-value — so readers can judge both precision and
clinical importance.

## Interpretation and common pitfalls

- A non-significant result is evidence of *no detectable effect*, not proof
  of no effect.
- Effect sizes matter more than significance: a statistically significant
  2% improvement may be clinically irrelevant.
- Always state the population the results apply to.

## From research question to defensible estimate

Biostatistics is best understood as a chain of decisions, each of which constrains the next. Begin by specifying the target population, the intervention or exposure, the comparator, the outcome, and the time horizon. This operational question determines the estimand: for example, a 12-month risk difference under assignment to treatment versus control among eligible adults. The design then determines what observations are available and which sources of bias require control. Measurement procedures define how the outcome is represented. Finally, the analysis estimates the prespecified contrast and communicates uncertainty. A sophisticated model cannot rescue a mismatch between the question and the observed data.

A useful distinction is descriptive, predictive, and causal work. Description summarizes the observed sample, such as the proportion admitted to intensive care. Prediction estimates outcomes for future individuals and must be judged on data not used to fit the model, with calibration as well as discrimination. Causal inference asks what would have happened under alternative interventions; this requires a design or assumptions that identify a contrast between potential outcomes. The same dataset can support one aim strongly and another weakly. A high predictive accuracy does not demonstrate that changing a predictor will change the outcome.

The uncertainty statement should match the inferential target. A confidence interval quantifies the long-run behavior of a procedure under repeated sampling assumptions; a Bayesian credible interval summarizes posterior probability conditional on a likelihood and prior. Neither interval incorporates every uncertainty automatically. Measurement error, selection into the study, model misspecification, and unmeasured confounding require separate consideration. Report absolute effects alongside relative measures where possible: a relative risk of 0.75 means a 25% relative reduction, but its absolute meaning depends on baseline risk.

### Worked calculation: two scales of treatment effect

Suppose 18/200 participants assigned a new treatment and 30/200 assigned usual care experience an event by one year. The estimated risks are 0.09 and 0.15. The risk difference (treatment minus control) is −0.06, or 6 fewer events per 100 participants. The risk ratio is 0.09/0.15 = 0.60, a 40% relative reduction. The reciprocal absolute benefit is 1/0.06 = 16.7, often communicated as about 17 people treated for one fewer event over this period, subject to uncertainty and the trial estimand. These summaries answer different questions; reporting only the relative reduction can exaggerate the practical scale when baseline risk is low.

```r
x_t <- 18; n_t <- 200
x_c <- 30; n_c <- 200
p_t <- x_t / n_t; p_c <- x_c / n_c
c(risk_treatment = p_t, risk_control = p_c,
  risk_difference = p_t - p_c, risk_ratio = p_t / p_c,
  number_needed_to_treat = 1 / (p_c - p_t))
# 0.09, 0.15, -0.06, 0.60, 16.67
```

This code computes point estimates only. A report should also give interval estimates and state whether the denominator is randomized participants, treated participants, or person-time. For clustered allocation, repeated outcomes, or censoring, the simple binomial calculation is not the correct uncertainty model.

### Practical analytic workflow

Before analysis, inspect the protocol and data dictionary; identify unit, time origin, eligibility, allocation, clustering, repeated measurements, and missingness. Freeze primary outcome definitions and contrasts before examining treatment effects. Summarize missingness by arm and visit, validate ranges against source systems, and use plots to identify coding and distribution issues. Choose a model from the estimand and design, not from the smallest p-value. Check whether conclusions depend on plausible alternative assumptions. Archive code, software versions, data provenance, and decisions so another analyst can reproduce the result.

Biostatistical practice is collaborative: clinicians establish meaningful thresholds and plausible mechanisms; data managers document how records arise; statisticians assess identification and uncertainty; patients help define outcomes that matter. The analyst should distinguish an observed association from a causal conclusion and translate the model output back into the population and time frame that motivated the study. References such as CONSORT, STROBE, and the National Academies' reproducibility report provide reporting frameworks, but they complement rather than replace sound design.


## Worked example: randomized comparison and uncertainty

Use the trial counts above to add uncertainty. Let pT=.09 and pC=.15. The estimated standard error of the risk difference is approximately sqrt[pT(1−pT)/200 + pC(1−pC)/200] = sqrt(.0004095+.0006375)=.0324. A simple Wald interval is −.06±1.96(.0324), or −.123 to .003. The interval includes no difference but also permits a clinically meaningful reduction of about 12 events per 100. A two-sided p-value near .06 would not justify declaring the treatments equivalent. Equivalence needs a prespecified margin and an analysis designed to rule out differences larger than that margin.

```r
p_t <- 18/200; p_c <- 30/200
rd <- p_t - p_c
se_rd <- sqrt(p_t*(1-p_t)/200 + p_c*(1-p_c)/200)
rd + c(-1, 1) * qnorm(.975) * se_rd
```

This large-sample Wald interval is pedagogical; score-based intervals generally have better behavior in small samples. For a randomized trial with stratification or clustering, use an estimator and standard error consistent with the randomization design. For censored time-to-event outcomes, a one-year binary risk comparison discards event timing and may mishandle censoring; use survival methods aligned with the estimand.

Biostatistics also distinguishes type I error, power, and precision. A design may control the long-run false-positive rate at 5% under a null model, but that does not mean a significant finding has a 95% probability of being true. Power is the probability of rejecting a specified null for a particular alternative, conditional on model assumptions. Sample-size calculations require a clinically meaningful effect, outcome variance or event rate, allocation ratio, significance level, desired power, and anticipated missingness. They do not guarantee representativeness or measurement quality.

### Multiplicity, subgroup claims, and model flexibility

When many outcomes, time points, models, or subgroups are examined, the chance of at least one small p-value rises. Prespecification, hierarchical outcome strategies, family-wise error control, or false-discovery control may be appropriate depending on whether claims are confirmatory or exploratory. Subgroup analyses need interaction tests and adequate sample sizes; finding significance in one subgroup but not another is not itself evidence that effects differ. Flexible model selection after inspecting results makes ordinary confidence intervals and p-values too optimistic unless selection is accounted for.

A useful analysis plan names the primary contrast, handling of intercurrent events (such as treatment discontinuation or rescue medication), missing-data assumptions, covariates, multiplicity strategy, and sensitivity analyses. The estimand may be treatment-policy (effect of assignment regardless of discontinuation), per-protocol (effect under adherence assumptions), or another scientifically motivated target. These are distinct questions and can produce different answers. ICH E9(R1) provides a framework for making this explicit.

### Reproducibility and responsible communication

Reproducibility requires more than sharing a p-value. Provide a clear denominator, units, outcome definition, time horizon, effect measure, interval, and enough methods to recreate the analysis. Use version-controlled scripts, immutable raw data, and a record of transformations. Protect privacy and avoid publishing disclosive records. Report deviations from the protocol and distinguish planned from post hoc analyses. Readers should be able to see which conclusions are robust and which depend on assumptions. Biostatistics is most useful when it narrows uncertainty honestly and informs decisions without converting uncertainty into false certainty.


## Distinguishing association, prediction, and intervention effects

A measured association describes how variables co-vary in observed data. Prediction asks how accurately information available at a defined time forecasts an outcome in new individuals. A causal estimand compares outcomes under alternative interventions, including counterfactual outcomes that cannot both be observed for one person. These aims lead to different design and validation choices. A prediction model may include variables that are consequences of disease if they are available at the prediction time, while causal adjustment for a post-treatment mediator can remove part of the total treatment effect. The same coefficient cannot be interpreted interchangeably across aims.

For prediction, split data at the patient level so repeat visits from one person do not leak into both training and test sets. In temporal deployment, validate on a later period because coding and clinical practice drift. Evaluate calibration: among people assigned predicted risk 20%, about 20% should experience the outcome over the specified horizon. Discrimination alone, such as AUC, does not ensure accurate absolute risk. For causal work, identify confounders using design and subject-matter knowledge, and assess positivity: each relevant covariate pattern needs a meaningful chance of receiving each compared intervention. Extrapolation into unsupported regions depends heavily on the model.

### Translating evidence into a decision

Suppose a treatment lowers an outcome risk from 15% to 9%, but causes an additional adverse event in 2% of people. The treatment may still be preferred, but the risk difference alone is not a complete net-benefit calculation. Decision analysis combines event probabilities with utilities or costs: expected utility under an action is the sum of outcome utility times its probability. Utility weights should reflect patient preferences and time horizon. A statistically precise effect can remain decision-uncertain if preferences or downstream costs vary.

A complete report therefore links the estimate to the action it informs. Identify the population, alternatives, outcome consequences, uncertainty, and assumptions about adherence or competing risks. Avoid translating an average effect into a guarantee for an individual. Explain absolute frequencies with a common denominator and time horizon, e.g. “about six fewer events per 100 treated for one year,” alongside relative effect and uncertainty.

## Choosing a measure before fitting a model

Risk difference is additive and directly conveys excess or prevented cases; risk ratio is multiplicative and often easier to compare across baseline risk; odds ratio is natural to logistic regression but can exaggerate relative risks for common outcomes; rate ratio uses person-time; hazard ratio compares instantaneous hazards among those still event-free. These measures are not interchangeable. A hazard ratio of 0.7 does not generally mean a 30% lower cumulative risk at a fixed time, especially under nonproportional hazards or competing events. The primary estimand should dictate the measure and model, not software defaults.

## Choosing an analysis strategy: a compact case study

Imagine a pragmatic trial comparing a new discharge-planning service with usual care on 30-day readmission. The outcome is binary, but the design includes randomization by hospital and some patients may be readmitted more than once. Begin by deciding whether the estimand is the probability of any readmission by day 30, time to first readmission, or total recurrent admissions. For a one-time binary endpoint, calculate the risk in each randomized group and an absolute risk difference; account for site stratification and any cluster allocation in uncertainty. For recurrent events, define whether death terminates follow-up and consider a rate or recurrent-event model. This design question precedes the test choice.

The analysis population also matters. An intention-to-treat treatment-policy estimand compares groups as randomized despite discontinuation, while missing 30-day status still needs a strategy. Linkage to an administrative system might reduce missingness but can miss events outside the network. Prespecify adjustment for randomization strata, do not adjust for post-randomization adherence when estimating the total assignment effect, and conduct sensitivity analysis for unobserved outcomes. Report both absolute and relative effects with intervals and the follow-up horizon.

This example illustrates why “use a chi-square test” is an incomplete answer. The test alone does not define the endpoint, handle clustering, specify the target effect, or address missingness. A methods section should make each choice understandable and reproducible.

## Biostatistics and ethical stewardship

Statistical analyses affect clinical recommendations, resource allocation, and public understanding. Avoid selective reporting, outcome switching, and claims unsupported by uncertainty. Do not use statistical significance as a binary gate for whether an effect exists. Protect confidentiality in small cells and linked data; aggregate or suppress values when disclosure risk warrants it. When sharing code, remove credentials and direct identifiers. Document analytic limitations in language that decision-makers can use, including whether uncertainty is sampling-based, model-based, or due to unavailable information.

## A checklist for interpreting a result

Ask: What population and time period does the estimate describe? Was the sample selected in a way that supports this population claim? What exact outcome and denominator were used? Is the reported effect absolute, relative, a rate, or a hazard? What sources of uncertainty are represented in its interval, and what systematic biases are not? Was the analysis prespecified, and how many alternatives were examined? Is the result clinically meaningful, not merely statistically detectable? Would plausible missing-data, measurement, or model assumptions change the conclusion? These questions turn a result into evidence that can be evaluated rather than a number to accept or reject.

## Common reporting errors to avoid

Do not equate a p-value with the probability that the null hypothesis is true, or a confidence interval with the range containing most individual values. Do not report a relative effect without baseline risk when an absolute interpretation matters. Do not call an association causal because a regression included many covariates. Do not infer no effect from a non-significant result when the interval still includes important benefit or harm. State who was studied and when; specify whether the effect is average, conditional, or individualized. These distinctions are central to responsible evidence use.

## Role of uncertainty in evidence synthesis

A single study contributes an estimate with uncertainty; systematic reviews combine results while considering differences in populations, interventions, outcomes, and risk of bias. A narrow interval within one study does not resolve heterogeneity across settings. Meta-analysis can improve precision for a shared estimand, but pooling unlike outcomes or incompatible designs creates a precise average with unclear meaning. Biostatistics helps make these decisions explicit, from study-level estimators through heterogeneity models and prediction intervals for effects in new settings.

## References and further reading

- National Academies. [Reproducibility and Replicability in Science](https://doi.org/10.17226/25303). 2019.
- STROBE Initiative. [Reporting guidance for observational studies](https://www.strobe-statement.org/).
- CONSORT. [CONSORT 2025 statement](https://doi.org/10.1136/bmj-2024-081123). *BMJ*. 2025.

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis
  and Other Advanced Topics*. Brooks/Cole.
- See also: the [Confidence intervals](../inference/confidence-intervals.html)
  article in the *Statistical inference* section.
