---
title: Repeated-measures designs
summary: Study designs where the same subjects are measured several times, and why simple t-tests fail on such data.
---

## Overview and key ideas

A **repeated-measures design** observes the same subject on multiple occasions:
before and after a treatment, at clinic visits, or at fixed intervals. The
defining feature is that observations from the same person are **correlated** —
a patient's diastolic blood pressure at visit 2 carries information about visit
1 — while observations from different people are independent. This within-
subject correlation violates the independence assumption of ordinary t-tests
and ANOVA.

Two related designs matter. In a **within-subject (crossover or pre-post)**
design, every subject receives all conditions, acting as their own control
for greater precision. In a **parallel-group longitudinal** design,
different subjects receive different treatments and are followed over time,
combining a between-subject factor with a repeated time factor. The analysis
problem in both is the same: model the mean response as a function of time and
treatment while accounting for the covariance structure of the repeated
observations.

## When to use it

| Setting | Example question |
| --- | --- |
| Clinical trial | Does a new antihypertensive lower blood pressure more than placebo across 12 weeks of follow-up? |
| Paediatrics | How does lung function change with age, and does inhaled therapy modify that trajectory? |
| Rehabilitation | Does physiotherapy improve pain scores from baseline through six weeks? |

Repeated measures are most valuable when between-subject variability is large but each
subject is stable — comparing the same person across conditions beats comparing different patients.

## Assumptions and limitations

- **Sphericity** (or its generalisation, compound symmetry): in repeated
  measures ANOVA, the variances of the pairwise differences between time
  points must be equal; real longitudinal data often violate this, and the
  Greenhouse–Geisser correction adjusts degrees of freedom, though model-based
  approaches are preferred.
- **Balanced data**: classic repeated-measures ANOVA wants the same set of
  visits for everyone; real studies have dropouts and missed visits, which
  move the analysis toward mixed models or GEE.
- **Independence between subjects** must still hold; clustering (patients from
  the same clinic) needs additional modelling.
- Attrition bias: if the patients who drop out differ systematically from
  those who remain, trajectory estimates for the completers do not represent
  the original cohort.

## Worked example

In a crossover trial, 40 adults with mild hypertension record home systolic
blood pressure weekly for 8 weeks on usual care and 8 weeks on a new agent
(order randomised). The mean fall in systolic pressure is 2.1 mmHg on usual
care and 9.4 mmHg on the new agent. Because each subject is measured under
both conditions, the paired difference (new minus usual) has mean 7.3 mmHg
with SD 5.8, giving a 95% CI of 7.3 ± 1.99 × 5.8/sqrt(40) = 7.3 ± 1.8, i.e.
5.5 to 9.1 mmHg. The within-subject design shrinks the standard error to
about 0.9 mmHg; an unpaired comparison of the two sets of readings, ignoring
that the same 40 people produced both, would have a roughly two-fold larger
standard error and could miss the effect.

## Interpretation and common pitfalls

- Running separate t-tests at each time point and ignoring the correlation
  inflates the type I error; with six visits that is up to six tests, each
  adding error.
- Reporting a single "average over all visits" per subject and then doing a
  standard two-sample test discards the time information and the within-
  subject precision that motivated the design.
- Averaging subjects' individual slopes and assuming those slopes are
  representative can misstate the population mean trajectory when slopes and
  intercepts trade off.
- Ignoring missing visits: complete-case analysis keeps only subjects with
  every visit, which can be a biased subset; model-based methods use all
  available measurements under a stated missingness assumption.

Choose the estimand before selecting the covariance model: a treatment-by-time contrast at week 12, an average difference over follow-up, and a trajectory difference are distinct questions. A baseline-adjusted follow-up analysis can be more efficient than analyzing change scores in a randomized trial when baseline predicts outcome; the approach should be prespecified and aligned with the estimand. For informative dropout, standard likelihood or GEE analyses do not automatically remove bias. Include sensitivity analyses under plausible departures from missing-at-random, and report visit-specific sample sizes and the missing-data strategy.

## References and further reading

## Design choices: timing, balance, and estimands

## Choosing a covariance strategy

## Worked treatment-by-time contrast

Suppose average pain scores are measured at baseline and 4, 8, and 12 weeks. A linear mixed model with categorical visit and treatment-by-visit interaction estimates a separate intervention-control contrast at each follow-up visit. If the week-12 coefficient is −1.8 points (95% CI −3.0 to −0.6) on a 0–10 scale, the estimated difference favors treatment by 1.8 points at week 12, with an interval excluding zero. Whether it is clinically important depends on a prespecified meaningful-change threshold and harms/burden. A global interaction test alone would not provide this visit-specific interpretation.

If time instead enters linearly, the interaction estimates difference in slope. A coefficient of −0.15 pain points/week implies an additional 1.8-point reduction over 12 weeks under a linearity assumption. Plot data and fitted means to assess whether early response plateaus or reverses. The categorical and linear-time models answer different questions and should not be selected after checking which is significant.

## Baseline adjustment and change scores

For randomized trials with baseline and follow-up continuous outcomes, ANCOVA of follow-up on treatment and baseline is usually more efficient than unadjusted change comparison when baseline predicts follow-up. Change-score analysis constrains the baseline coefficient to one; ANCOVA estimates it from data. Both can estimate a randomized group contrast under suitable models, but in nonrandomized studies baseline adjustment does not by itself control confounding or regression to the mean. If baseline values differ by chance, include the prespecified baseline measure and explain the estimand.

With multiple follow-ups, baseline can be modeled as a covariate or included as one of the repeated outcomes depending on question. Do not treat post-randomization measurements as baseline covariates. For outcomes with floor/ceiling effects, consider models respecting bounds and report scale interpretation. Standardized effect sizes can aid comparison but should complement raw-unit differences.

## Multiplicity and trajectory summaries

Testing treatment effects at many visits raises multiplicity. Options include one prespecified primary visit, a global trajectory test followed by controlled contrasts, hierarchical testing, or simultaneous confidence bands. A global test asks whether any modeled trajectory difference exists; it does not establish benefit at every time. For a trajectory summary, area under the curve, slope, time to response, or proportion achieving meaningful improvement can be clinically interpretable if defined before analysis. Report raw mean profiles as well as model contrasts and confidence intervals.

The design determines the covariance structure. Compound symmetry assumes equal correlation among all pairs of visits; AR(1) assumes correlation decays with visit lag; unstructured covariance estimates each variance and covariance and can be efficient with enough participants and few time points, but can be unstable with many visits. Random-intercept models imply a particular covariance that may not match decay over time. Mixed models can combine random effects and residual serial correlation; GEE specifies a working correlation and robust sandwich variance. Use the simplest structure consistent with the design and scientific process, then assess residual dependence.

Sphericity in repeated-measures ANOVA is equality of variances of pairwise differences, a condition stronger than equal marginal variances. Mauchly's test has limited reliability in small samples and excessive sensitivity in large ones; Greenhouse–Geisser or Huynh–Feldt corrections adjust degrees of freedom but do not change the modeled means. Mixed models avoid the sphericity requirement but impose their own covariance and missingness assumptions. Report the covariance choice and any correction.

## Sample size with repeated observations

The benefit from repeated measures depends on within-person correlation and the contrast. Baseline adjustment can substantially reduce variance when baseline predicts follow-up, but extra post-baseline observations may add less if highly correlated. Design simulations should reproduce planned visit schedule, covariance, dropout, treatment-by-time effect, and analysis model. If treatment effect is expected to emerge gradually, powering only for a final visit can differ from powering for a slope or global trajectory. Use the primary estimand to drive calculation and prespecify any fallback if convergence fails.

For a cluster or stepped-wedge repeated-measures design, there are at least two correlation structures: within participant over time and participants within cluster. Secular trends are especially important in stepped wedges because intervention exposure is correlated with calendar period. Include period effects and account for cluster-level allocation; power depends on number of clusters and timing, not only total participant-visits. Simulation is generally preferable to a simple design-effect formula.

## Measurement schedule, burden, and informative observation

## Analysis choices for incomplete trajectories

## Sample-size worked reasoning

## Interpretation of within-person change

### Reporting checklist

Give the visit schedule and windows, primary trajectory estimand, covariance model, analysis population, missingness assumptions, and treatment-discontinuation strategy. Plot group means with intervals and show denominators by visit; make clear whether participants differ across waves. Report raw-unit contrasts and clinically meaningful thresholds. Repeated measurements improve characterization of change but do not create independent participants or eliminate confounding in uncontrolled designs.

An average trajectory can hide heterogeneous response: some participants improve, some remain stable, and some worsen. Show distributions or individual trajectories where sample size permits, while avoiding overplotting and selective illustration. The estimated population mean change does not imply that a typical individual changes by exactly that amount. Random slopes describe modeled heterogeneity but can be sensitive to visit count and covariance assumptions. If responder categories are clinically important, define thresholds prospectively and report their uncertainty alongside continuous outcomes.

Distinguish statistical from reliable change. A change can exceed measurement error yet be too small to matter clinically, or be clinically important but imprecisely estimated. Report scale units, validated minimal important difference if available, and confidence intervals. For within-person monitoring, measurement error and individual prediction intervals matter more than group mean standard errors.

Suppose baseline-follow-up outcome SD is 10 and baseline-follow-up correlation is 0.6. ANCOVA residual variance is approximately \(10^2(1-.6^2)=64\), compared with 100 for an unadjusted follow-up comparison. This can reduce required N by about 36% under ideal linear-model assumptions. The gain depends on correlation being similar in the trial population and a correctly specified baseline adjustment. For a multi-visit trial, this simple calculation is only an intuition; simulate the full covariance and missingness structure.

For cluster repeated measures, include within-person correlation, within-cluster correlation, and correlation across cluster-periods. In stepped-wedge designs, secular trend modeling can dominate power. Report number of clusters, periods, sequence allocation, average participants per cluster-period, expected ICCs, and attrition. Sensitivity scenarios should vary ICC because it is often poorly estimated in small pilots.

Mixed-model likelihood and multiple imputation can use partially observed outcome histories under MAR when the model includes predictors of missingness and outcome. GEE with empirical covariance typically needs MCAR for naive consistency; weighted GEE can relax this to MAR given correctly modeled observation probabilities. Complete-case analysis requires stronger assumptions and often loses precision. Last observation carried forward assumes no change after the last observation and understates uncertainty, so avoid it as default. State the missingness mechanism assumed and why plausible.

For multiple imputation, include all repeated outcomes, treatment, baseline predictors, auxiliary variables related to dropout, and design factors. Preserve nonlinear time trends, treatment-by-time interactions, and clustering. Impute at the correct level for cluster trials; individual-level imputation ignoring cluster can shrink within-cluster dependence. Examine convergence and compare distributions of observed and imputed values. Conduct MNAR sensitivity analyses for outcomes after dropout, particularly when deterioration or adverse effects cause missed visits.

## Data management and protocol deviations

Specify one row per person-visit or one row per interval, unique keys, visit windows, allowable duplicates, and adjudication of measurements outside windows. Preserve original timestamp and source to reproduce derived time variables. Define handling of unscheduled visits and repeated measures within a window before looking at outcomes (for example, closest to target date). Document treatment discontinuation and rescue therapy as intercurrent events, not merely missing visits. These operational rules can change which measurement enters the estimand and should be reproducible from code.

Visit timing can affect what is estimated. Measurements close to treatment initiation may capture acute response; widely spaced visits can miss transient harms. Define windows and rules for unscheduled measurements. If visit attendance depends on worsening or improvement, observed measurement times are informative and standard mixed models can be biased. Joint models for outcome and visit intensity, inverse intensity weighting, or sensitivity analyses may be appropriate, depending on the observation process. Record reasons for unscheduled visits and missed visits.

Repeated testing can cause practice or learning effects; biological markers may have diurnal variation; and instruments can drift. Standardize procedures, train assessors, calibrate instruments, and retain raw data with timestamps. Distinguish random measurement error from systematic change in measurement conditions. Reliability studies with replicate measurements can quantify within-person noise and inform the minimum detectable change, which is not the same as a clinically important change.

### Regression to the mean and baseline imbalance

Participants are sometimes enrolled because a measurement is unusually high, then improve on repeat testing even without intervention. This regression to the mean can be mistaken for treatment response in single-arm pre/post designs. A concurrent randomized control group helps separate natural fluctuation from treatment effect. Comparing change scores does not automatically solve the problem, especially if baseline measurement error is substantial. ANCOVA of follow-up adjusted for baseline is generally efficient under randomization and often handles chance baseline imbalance well, while the estimand remains a between-arm follow-up contrast.

Repeated measurement itself can alter behavior or assessment (testing effects), and instruments can drift over time. Maintain calibration and blinded measurement where possible, and distinguish biological change from measurement-process change. If the study aims to estimate within-person variability, replicate measurements close together may be needed; if the aim is long-term trajectory, schedule observations to capture clinically relevant curvature rather than simply maximizing count.

Repeated-measures designs collect multiple observations from the same participant, allowing study of within-person change and potentially improving precision. The design must define baseline, follow-up schedule, primary time point or trajectory contrast, and allowable visit windows. More measurements do not always mean more information: closely spaced observations add less independent information when within-person correlation is high, and measurement burden can increase dropout. Equal visit schedules simplify interpretation; event-triggered or irregular schedules may be clinically necessary but require explicit modeling of observation times.

Distinguish a repeated cross-sectional sample from a longitudinal cohort. In repeated cross-sections, each time point may include different people and estimates population-level change; in a longitudinal design, within-person dependence and attrition shape the estimand. A complete-case analysis of only participants with every visit discards partial information and can select a healthier subset. Use all available data under a justified missingness model, and describe participant flow by visit.

For a two-arm study with baseline and follow-up, ANCOVA of follow-up on treatment and baseline often gives a more precise treatment contrast than comparing raw change scores when baseline predicts follow-up. For multiple follow-up visits, a treatment-by-time interaction estimates differential trajectories. If nonlinear change is expected, categorical visit effects or splines avoid forcing a straight line. Decide whether the target is average between-group difference at each visit, average slope, area under the trajectory, or a clinically meaningful summary.

## Correlation and analysis models

Repeated observations from one person are correlated. Repeated-measures ANOVA assumes a restrictive covariance structure, including sphericity for univariate within-subject tests. Greenhouse–Geisser corrections adjust degrees of freedom when sphericity is violated, but mixed models and GEE can represent unbalanced schedules and broader covariance structures. Mixed models produce subject-specific conditional effects for nonlinear outcomes; GEE estimates population-average contrasts with robust variance given enough independent clusters.

```r
library(lme4)
long_data$time_f <- factor(long_data$visit)
fit <- lmer(outcome ~ treatment * time_f + baseline + (1 | id),
            data = long_data, REML = TRUE)
anova(fit)
```

Categorical time estimates a treatment contrast at each visit relative to the reference. The example assumes Gaussian outcomes, a random intercept, and likelihood-based inference under MAR. Consider random slopes if individual trajectories plausibly vary and data support their estimation. Use planned contrasts with multiplicity control or clear labeling as exploratory; do not select a favorable visit after inspecting many p-values. For binary or count outcomes, choose an appropriate GLMM or GEE and state whether odds, risk, or rate contrasts are reported.

## Sample size and missingness

Power for longitudinal designs depends on the covariance matrix, not only number of visits. Baseline-follow-up correlation can increase precision for an adjusted treatment contrast, while high within-person correlation means later visits add diminishing information. Clustered recruitment, unequal allocation, visit-specific attrition, and treatment-by-time effects should be represented in simulation or validated software. Planning only for a cross-sectional endpoint can underpower trajectory interactions.

Missingness should be summarized by arm and visit, with reasons and timing. Likelihood mixed models are valid under MAR conditional on observed variables included in the model and correct specification; GEE's ordinary estimating equations generally need stronger missingness conditions, while weighted GEE can address observed-history-dependent dropout. Neither resolves missing-not-at-random dropout without assumptions. Conduct sensitivity analyses such as delta-adjusted multiple imputation or pattern-mixture models when clinically plausible deterioration influences missingness.

Control measurement conditions across visits: instrument versions, assessor training, time of day, and protocol deviations. Practice effects, maturation, seasonal change, regression to the mean, and concurrent interventions can mimic change. In uncontrolled before-after studies, secular trends cannot be separated from intervention effects without additional assumptions or a comparison group. In randomized studies, retain intention-to-treat assignment and define strategies for treatment discontinuation and rescue therapy.

Report the visit schedule, analysis population, covariance model, time coding, estimand, missing-data method, effect estimates with intervals at clinically meaningful times, and sensitivity analyses. Plot individual trajectories lightly behind group summaries where useful; show denominators at each visit. Avoid relying solely on a global interaction p-value, which does not reveal size, direction, or clinical importance of the differences.

- Fitzmaurice GM, Laird NM, Ware JH. *Applied Longitudinal Analysis*. 2nd ed. Wiley; 2011.
- Gueorguieva R, Krystal JH. Move over ANOVA: progress in analyzing repeated-measures data. *Archives of General Psychiatry*. 2004;61:310–317. https://doi.org/10.1001/archpsyc.61.3.310
- Diggle PJ, Heagerty P, Liang KY, Zeger SL. *Analysis of Longitudinal Data*. 2nd ed. Oxford University Press; 2002.

- Vickers AJ, Altman DG. Analysing controlled trials with baseline and follow up measurements. *BMJ*. 2001;323:1123–1124. [doi:10.1136/bmj.323.7321.1123](https://doi.org/10.1136/bmj.323.7321.1123)

- Dupont WD, Schuemaker M. *Design and Analysis of Clinical Research*.
  Lippincott Williams & Wilkins.
- Bland M, Altman DG. *Statistics with Confidence: Confidence Intervals and
  Guide to Statistical Analysis with Medcalc*. BMJ Books.
- Diggle P, Heagerty P, Liang K, Zeger S. *Analysis of Longitudinal Data*.
  Oxford University Press.

*The "Mixed-effects models" and "Generalized estimating equations" articles
develop the two main model-based approaches to these designs.*
