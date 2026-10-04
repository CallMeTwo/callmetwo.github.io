---
title: Repeated-measures designs
summary: Plan studies with multiple observations per person or cluster, separating within-subject change from between-subject differences and modeling dependence appropriately.
---

## Overview

Repeated-measures designs collect multiple outcomes from the same person, household, clinic, or other unit. They can reveal change over time and improve precision, but observations within a unit are correlated and cannot be treated as independent rows. The design determines which changes can be estimated, how timing affects interpretation, and which analysis methods are defensible.

The central planning questions are: what is the experimental or sampling unit, what is the primary time contrast, how will repeated observations be scheduled, and what sources of dependence must be handled? Repeated measurements do not automatically increase the effective sample size in proportion to the number of visits. More observations can add information about trajectories, but between-person heterogeneity and missing follow-up limit gains.

## Choose a design that identifies the contrast

In a parallel-group trial, participants are randomized once and followed at multiple times. The treatment contrast compares groups at each follow-up or compares trajectories. In a crossover study, each participant receives multiple treatments in sequence; within-person comparison can improve efficiency, but requires assumptions about washout, period effects, and carryover. In a paired design, two conditions or body sites are measured within a person, with pair as the analysis unit.

Repeated cross-sectional sampling measures different individuals from the same population at each time. It estimates population change but not individual trajectories. A panel cohort repeatedly measures the same participants, allowing within-person change but requiring attention to attrition and practice effects. Ecological time series aggregate outcomes by period and can support interrupted time-series analyses, but do not identify individual-level change.

Choose follow-up times based on the expected response dynamics and decision. Early visits capture onset or acute harms; later visits assess persistence. If treatment effect is expected to peak around month 3, sparse measurements only at baseline and month 12 can miss the time course. Too many visits increase burden and missingness. Prespecify windows and allowable visit deviations.

## Independent units, repeated observations, and power

The independent unit is the unit randomized or independently sampled. In a trial randomizing 40 clinics with 30 patients each, there are 40 treatment assignments, not 1,200. In a patient-randomized longitudinal study with six visits, there are 1,200 measurements but 200 independent patients. Analyses and power calculations must reflect the actual level of assignment and dependence.

For a simple repeated-measures outcome with (m) equally spaced visits and within-person correlation \(\rho\), the variance of a person-level mean can be approximated as \(\sigma^2[1+(m-1)\rho]/m\). If \(m=4\) and \(\rho=0.6\), this is \(\sigma^2(2.8/4)=0.70\sigma^2\), not \(0.25\sigma^2\) as if visits were independent. Repeated measurements help, but diminishing returns occur as correlation rises.

For cluster randomization, a rough design effect is (1+(\bar m-1)\rho_c), where \(\bar m\) is cluster size and \(\rho_c\) intracluster correlation. Unequal cluster sizes inflate it. Planning should use plausible ICC, number of clusters, cluster-size variability, attrition, and the intended model. Adding clusters generally provides more information about a cluster-level treatment effect than adding observations to a few existing clusters.

## Define the outcome trajectory and estimand

The estimand might be a treatment difference at a particular visit, difference in change from baseline, average difference over follow-up, slope difference, or area-under-trajectory contrast. These are not interchangeable. A treatment-by-time interaction tests whether treatment contrasts vary across time under the specified time coding; it does not automatically represent a clinically meaningful trajectory summary.

Categorical time makes few assumptions about shape but uses more parameters and gives visit-specific comparisons. Numeric time is parsimonious but assumes the chosen functional form, often linear. Splines can represent nonlinear trends; knots should be planned based on expected response and sample size. In nonlinear trajectories, a single slope can obscure early benefit followed by waning.

Baseline outcome may be included as a covariate in an analysis of follow-up outcomes or modeled as part of the repeated response vector. Avoid including baseline twice in a way that creates redundancy. In randomized trials, ANCOVA often improves precision for a prespecified follow-up endpoint. For trajectory analysis, a mixed model with baseline and post-baseline repeated outcomes can use all measurements under MAR, but the estimand and covariance need clear specification.

## Example: trial with repeated symptom scores

Suppose 240 participants are randomized to treatment or control, with pain scores at baseline and months 1, 3, and 6. Lower scores are better. A linear mixed model with categorical visit, treatment, baseline score, and treatment-by-visit interaction estimates adjusted mean differences at each visit. If the month-6 contrast is −1.8 points (95% CI −3.0 to −0.6), interpret it against a prespecified clinically important difference, perhaps 2 points. The confidence interval includes effects smaller than that threshold and effects near it.

```r
library(lme4)
dat$visit <- factor(dat$visit, levels = c("1m", "3m", "6m"))
fit <- lmer(score ~ treatment * visit + baseline_score +
              (1 | participant_id), data = dat)
summary(fit)
```

This example assumes continuous approximately Gaussian residuals and a random intercept. For numeric time, the coefficient represents a linear treatment difference in slope. Cluster-randomized allocation requires clinic-level structure and small-sample inference. Check fit and missingness; a random intercept does not fix informative dropout.

## Crossover and within-person comparisons

Crossover studies compare treatment periods within the same participant, controlling stable person-level characteristics. Randomize treatment sequence and allow an adequate washout. Period effects occur when outcome changes over calendar or study period; sequence effects can arise from differential order; carryover occurs when prior treatment affects later outcomes. Analyze period and sequence according to the design, and assess carryover with scientific reasoning rather than a low-powered preliminary test alone.

A two-period crossover estimate can be a within-person difference adjusted for period. If treatment effects are not reversible or disease progresses, crossover may be inappropriate. Dropout after the first period can destroy the within-person comparison and induce selection. A parallel design may be preferable despite larger sample needs.

Paired measurements also arise in diagnostic method comparisons or bilateral procedures. Analyze the within-pair difference and account for pair. Treating paired readings as independent discards correlation and usually wastes precision. Conversely, pairing does not remove time-varying confounding or guarantee exchangeability if order was not randomized.

## Correlation structures and analysis choices

Linear mixed models represent subject-specific trajectories through random intercepts and slopes. Generalized estimating equations estimate population-average effects with a working correlation and robust variance. Repeated-measures ANOVA imposes restrictive balance and covariance assumptions and handles incomplete follow-up poorly. Choose based on outcome type, target effect, number of clusters, and missingness.

An unstructured covariance estimates a separate covariance for each pair of visits and can be flexible but parameter-intensive. Compound symmetry assumes constant correlation; AR(1) assumes correlation declines with visit lag. Random intercept/slope models imply a particular covariance shape. Inspect empirical correlations and fit diagnostics, but avoid selecting a structure based only on a data-driven criterion. Prespecify plausible alternatives and test sensitivity.

For binary outcomes, marginal GEE and logistic mixed models estimate different effects. For count outcomes, include person-time or exposure offsets when appropriate. For time-to-event outcomes with recurrent events, standard repeated-measures methods are not automatically suitable; choose recurrent-event survival methods. The outcome process drives method choice.

The covariance structure affects efficiency and sometimes finite-sample inference, but it is not the estimand. In a randomized study, treatment-by-visit mean contrasts can remain the target under several reasonable covariance models, while standard errors differ. Use a structure that converges and matches the visit spacing; compare a small number of prespecified alternatives. An unstructured covariance with eight visits has 36 unique covariance parameters before means, often too many for a modest sample.

Mixed models make predictions conditional on random effects or averaged over their distribution; GEE directly targets population-average means. In Gaussian identity-link settings, fixed-effect averages often coincide, but random-effects and residual covariance assumptions differ. In logistic settings, subject-specific and marginal ORs differ by noncollapsibility. Report the scale and level rather than calling both simply “the treatment effect.”

Repeated-measures ANOVA is most suitable for balanced designs with complete data and restrictive covariance assumptions such as sphericity. Greenhouse–Geisser corrections address some violations for omnibus within-subject tests but do not solve dropout or irregular visits. Modern mixed models offer more flexibility, provided the mean and missingness assumptions are credible.

For a time-to-event outcome with repeated episodes, define whether the target is first event, event count, gap time, or mean cumulative function. Andersen–Gill models, conditional recurrent-event models, frailty models, and joint frailty models answer different questions and treat terminal events differently. A repeated-measures Gaussian model on event counts may lose timing information and mishandle at-risk exposure.

## Missing visits and informative dropout

Missing visits reduce information and can bias estimates if missingness depends on unobserved outcomes. Mixed models use incomplete trajectories under MAR conditional on included variables and observed history. GEE generally requires stronger missingness assumptions unless weighted methods are used. Multiple imputation can support sensitivity analyses but must preserve longitudinal correlation, time trends, and interactions.

Record reasons for missed visits, treatment discontinuation, and withdrawal. Continue outcome collection after treatment stops when possible. Compare missingness by arm, visit, baseline severity, and prior outcomes. Plan an MNAR sensitivity analysis such as delta adjustment or a pattern-mixture model. Last observation carried forward assumes no change after the last measurement and is generally not a neutral solution.

Suppose at month 6, outcome missingness is 8% in control and 20% in active treatment, with more active-arm withdrawals following adverse events. A complete-case comparison selects different subsets and can bias the treatment contrast. A mixed model under MAR can use baseline and earlier outcomes, but if participants with unobserved worsening are more likely to withdraw, an MNAR sensitivity shift is needed. Report missingness by reason and arm, not just the overall percentage.

For a delta analysis, impute missing outcomes under MAR, then shift missing values in one group by a clinically plausible amount. Repeat across a prespecified range and plot effect estimates with intervals. The tipping point where conclusions change summarizes robustness, not the true unseen outcomes. State whether the primary estimand is treatment-policy, hypothetical, or another strategy for intercurrent events.

Inverse-probability weighting can reweight observed visits by the predicted probability of remaining observed. For longitudinal dropout, weights depend on prior covariates and outcomes. Extreme weights indicate limited support; report truncation and effective sample size. Weighting and MI both rely on measured histories and model assumptions; neither resolves MNAR without additional assumptions.

## Measurement and operational design

Repeated measurement itself can alter responses through learning, fatigue, or testing effects. Standardize instruments, timing windows, administration mode, and assessor training. Calibrate devices and define how duplicate measurements are combined. In clinical settings, visit timing may be triggered by symptoms; irregular observation can be informative and should be modeled or carefully described.

Reduce avoidable burden by collecting measurements that answer the estimand. Long questionnaires and frequent visits can increase attrition. Remote measurements may improve completion but alter measurement properties. Plan site procedures, reminders, window rules, and data quality checks. If a primary endpoint is measured several times, define which visit or summary is confirmatory to avoid selective reporting.

Sample-size planning should simulate the planned analysis when trajectories, unequal visit schedules, cluster randomization, or dropout are important. Inputs include between-person variance, residual variance, within-person correlation, clinically meaningful treatment contrast, number and timing of visits, cluster size, and attrition. Report sensitivity across plausible correlations; optimistic assumptions about correlation can make a design appear more efficient than it is.

More frequent measurement can improve estimation of nonlinear trends and event timing, but gains diminish when adjacent values are highly correlated. Increasing sample size often improves population effect precision more than adding many visits to each participant. Consider burden, cost, and missingness jointly with statistical efficiency. A design with fewer strategically timed visits can outperform a dense schedule that causes attrition.

## Reporting and interpretation

Report the experimental unit, number of repeated observations per participant, visit schedule, treatment contrast, time coding, covariance structure, missingness handling, and number of independent clusters. Show group trajectories with uncertainty and visit-specific denominators. Distinguish within-person changes from between-group effects. Avoid interpreting a significant interaction without presenting the estimated contrasts and their intervals.

The analysis should reflect the design. A highly flexible model cannot create information at unobserved times or repair differential attrition. If individual trajectories are highly variable, report that heterogeneity as well as the average. For clinical decisions, pair average effects with responder distributions or clinically meaningful thresholds when prespecified.

## Contrast calculation for a time interaction

Suppose a model codes control as 0, active as 1, and month 1 as the reference. Treatment coefficient is −0.5 and treatment-by-month-6 coefficient is −1.3. The month-6 treatment contrast is −1.8 points. Its variance is (Var(\hat\beta_T)+Var(\hat\beta_{T6})+2Cov(\hat\beta_T,\hat\beta_{T6})); the standard error cannot be obtained by adding the separate standard errors. Use a contrast function or model-based marginal means to calculate the estimate and interval.

If there are multiple follow-up contrasts, define whether month 6 is primary and whether secondary visit comparisons are adjusted for multiplicity. A joint test of all treatment-by-visit terms asks whether trajectories differ at any visit; it does not identify the most important time. Prespecify the clinically relevant comparison and show all planned time-specific estimates to avoid cherry-picking.

Baseline adjustment should also match the design. For a single primary post-baseline endpoint, ANCOVA commonly models follow-up score as outcome with baseline score covariate. Comparing change scores can be less efficient when baseline and follow-up are correlated and may be sensitive to regression to the mean. With several repeated follow-ups, a mixed model can include baseline or constrain baseline means according to randomization. State exactly how baseline contributes.

## Design choices that affect interpretation

Measurement timing should be aligned to the intervention's expected mechanism. If pharmacologic response reaches steady state after four weeks, a day-3 endpoint may not answer the primary effectiveness question. If harms occur early and benefits accrue later, collect sufficiently frequent early and long-term outcomes. A single endpoint can hide a tradeoff; consider a prespecified benefit-risk framework rather than treating all visits as independent outcomes.

In crossover designs, washout should reflect pharmacokinetics and carryover, and period duration should be adequate to observe response. If treatment effects persist after washout or disease changes irreversibly, a crossover comparison may be biased. Analyze sequence and period effects as planned, and avoid excluding participants based on post-randomization completion without sensitivity analysis.

For observational panels, repeated measures can control stable individual characteristics through fixed-effects methods, but time-varying confounding remains. A person-fixed-effect analysis removes time-invariant factors but cannot estimate effects of exposures that do not change within person and may amplify measurement error. Mixed models assume random effects independent of covariates unless specified otherwise. Neither approach automatically makes the analysis causal.

## A reporting example

An interpretable report might state: “Mean pain was measured at baseline and months 1, 3, and 6. We estimated treatment differences at each follow-up using a linear mixed model with categorical visit, baseline pain, treatment-by-visit interactions, and a participant random intercept. The primary contrast was adjusted mean difference at month 6; lower values favor treatment. Standard errors used the model-based covariance and 95% confidence intervals. Follow-up completion was 91% in treatment and 94% in control; a delta-adjusted analysis assessed departures from MAR.” This makes the estimand, coding, and limitations visible.

Include numbers of participants and observations at each visit, not only the enrolled total. If model-based estimates use all available records, explain that participants with incomplete records contribute observed data under the stated missingness assumption. Show uncertainty bands and clarify whether they represent confidence intervals for group means or prediction intervals for individuals.

For trials, report allocation ratio and whether follow-up windows were adhered to. For observational panels, explain recruitment and attrition over time. If visit schedules differ between groups, describe how timing was handled and assess whether measurement opportunity itself is informative.

When the primary contrast is a single follow-up endpoint, a design emphasizing baseline-adjusted precision may be simpler than testing the entire trajectory. When treatment dynamics themselves matter, collect enough intermediate visits to distinguish onset, peak, and waning. The measurement schedule should follow the scientific question, not just clinic convenience.

Report protocol deviations in visit timing and whether measurements outside allowed windows were included; timing shifts can affect response interpretation.

For home monitoring, consider whether device adherence and measurement time are informative rather than assuming a complete regular panel.

Device calibration should be consistent across visits.

Record calibration drift as a potential source of apparent change.

## References and further reading

- Fitzmaurice GM, Laird NM, Ware JH. *Applied Longitudinal Analysis*. 2nd ed. Wiley; 2011.
- Diggle PJ, Heagerty P, Liang K-Y, Zeger SL. *Analysis of Longitudinal Data*. 2nd ed. Oxford University Press; 2002.
- Liang K-Y, Zeger SL. Longitudinal data analysis using generalized linear models. *Biometrika*. 1986;73:13–22. [doi:10.1093/biomet/73.1.13](https://doi.org/10.1093/biomet/73.1.13)
- Laird NM, Ware JH. Random-effects models for longitudinal data. *Biometrics*. 1982;38:963–974. [doi:10.2307/2529876](https://doi.org/10.2307/2529876)
- ICH E9(R1): Addendum on Estimands and Sensitivity Analysis in Clinical Trials; 2019. [ich.org](https://www.ich.org/page/efficacy-guidelines)
