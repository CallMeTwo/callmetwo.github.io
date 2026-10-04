---
title: Reporting and interpreting results
summary: Reporting guidelines (CONSORT, STROBE, STARD) and the interpretive discipline — confidence intervals, effect sizes, and the difference between statistical and clinical significance.
---

## Overview and key ideas

A result is not reported until it has been *communicated*: a number with its uncertainty, in a context a reader can evaluate. The field has settled on **reporting guidelines** — structured checklists that specify what must be stated for each study design — and most journals require the relevant one:

- **CONSORT** — randomised controlled trials: flow of participants through allocation and analysis, the primary analysis exactly as pre-specified, and all results for all prespecified endpoints.
- **STROBE** — observational studies (cohort, case–control, cross-sectional): the population, why, exposure and outcome definitions, confounders considered, and the quantitative measures of association with their precision.
- **STARD** — diagnostic accuracy studies: the reference standard, blinding of readers, the 2×2 counts, and sensitivity/specificity (or, where appropriate, likelihood ratios and ROC points).

Beyond the checklist, good reporting means three things about every key result: (1) the **point estimate** (the effect size, in clinically meaningful units), (2) its **uncertainty** (95% confidence interval), and (3) the **interpretation in plain terms** — what the number means for the patient, not just for the p-value. A result reported as only "p = 0.03" discards the two most important pieces of information.

The interpretive core: **statistical significance is not the finding; the effect size and its precision are the finding.** The p-value answers a fixed null question; the confidence interval answers the useful one — how large, and how precisely estimated, is the effect? A narrow interval that excludes both the null and the minimal clinically important difference is a genuinely reassuring result; a wide interval that merely fails to reach 0.05 is a much weaker claim, and the two must not be presented the same way.

## When to use it

| Setting | Example question |
| --- | --- |
| A finished RCT | Does the manuscript report the CONSORT flow, the pre-specified primary analysis, and effect sizes with CIs for every key endpoint? |
| An observational cohort | Are the exposures, outcomes, and confounders defined clearly enough (STROBE) that the hazard ratio can be judged for residual confounding? |
| A diagnostic test evaluation | Is the reference standard and the blinding of test readers stated (STARD), so the sensitivity is not inflated by verification bias? |
| A journal submission | Does the paper state which guideline it followed, with the completed checklist as a supplement? |

These rules apply to any quantitative result in a paper, abstract, conference slide, or press release. The guideline is chosen by the *design of the study*, not by what is convenient to report.

## Assumptions and limitations

- **Guidelines are checklists, not validators** — a CONSORT-compliant trial can still be biased by poor randomisation or selective follow-up; the checklist makes the bias *visible*, not absent.
- **The confidence interval inherits the model's assumptions** — a CI around a hazard ratio presumes proportional hazards; around a regression coefficient, linearity and independent errors. Reporting the CI without checking its assumptions is reporting a number, not a guarantee.
- **STARD results are only as good as the reference standard** — if the "gold standard" is imperfect or differs by group, sensitivity and specificity are mismeasured in a direction the 2×2 table cannot reveal.
- **A reporting guideline cannot fix a study that wasn't designed to answer the question** — post-hoc subgroup "findings" reported as if confirmatory are the most common interpretive failure, and no checklist can launder them.

## Worked example

A 500-patient RCT of a new vaccine reports, per CONSORT: 250 per arm randomised, 246 and 244 analysed; 9 cases in vaccine, 21 in placebo. The hazard ratio for infection is 0.42 (95% CI 0.19–0.93), p = 0.031.

The correct interpretation is layered. First, the *effect*: vaccinated patients had about 58% fewer infections (HR 0.42), and the 95% CI (0.19–0.93) says the true protection could plausibly range from 7% to 81% — so the result is statistically significant but imprecisely estimated. Second, the *clinical* read: even the worst end of the interval (HR 0.93) is a small benefit, while the central estimate is large; the authors should state whether a 58% relative reduction meets the threshold for adoption given cost and side effects. Reporting only "p = 0.03, vaccine effective" would have discarded the range and the magnitude. The CONSORT flow table lets a reader confirm the 250→246/244 drop did not break the randomisation.

## Interpretation and common pitfalls

- **Treating p < 0.05 as "real" and p ≥ 0.05 as "nothing"** — significance is a binary gate the data crossed by chance of the null; the size and precision of the effect, from the CI, carry the scientific content.
- **Reporting a p-value without the estimate and CI** — the most common and most damaging omission; it makes the effect size and its uncertainty unknowable to the reader.
- **Cherry-picking significant subgroup or secondary endpoints** as if they were the primary analysis; the guideline (and the SAP) exist to prevent exactly this.
- **Conflating statistical and clinical significance** — a highly significant 1-point blood-pressure change may be clinically trivial, while a borderline 15-point change may be transformative; both require the effect size in context, not just the p.

Reporting recommendations change over time: use the current design-specific checklist (CONSORT 2025 for randomized trials, STROBE for observational studies, STARD for diagnostic accuracy, and TRIPOD+AI for prediction models using regression or machine learning). A checklist supports completeness; it neither certifies low risk of bias nor substitutes for protocol/SAP access. Report denominators, missingness, analysis populations, effect scale, precision, and deviations from planned methods. Interpret intervals against a clinically meaningful threshold where one is defined, and avoid treating a 95% confidence interval as a 95% probability statement about the fixed parameter.

## References and further reading

## Estimate, uncertainty, and clinical meaning

## Reporting models and diagnostics

## Common interpretation errors

## Worked result interpretation

Suppose an RCT estimates risk difference −0.02 (95% CI −0.045 to 0.005) and RR 0.80 (95% CI 0.62–1.03). A careful statement is: “The estimated 2-year event risk was 2 percentage points lower with treatment; the interval is compatible with 4.5 points lower to 0.5 points higher. Relative risk was estimated at 0.80, with interval including no difference.” Avoid saying treatment “reduced risk by 20%” as a definitive finding; that frames the point estimate without uncertainty. Whether evidence is sufficient depends on clinical threshold and study quality.

For an observational adjusted OR of 0.70, state “odds were lower” and describe adjustment set; do not claim 30% lower risk. If causal interpretation is intended, explain identification assumptions and sensitivity to unmeasured confounding. For a predictive model, AUC=.82 does not mean 82% accuracy; report calibration and threshold performance.

## Audience-specific communication

## Evidence strength and causal language

## Report uncertainty honestly

Distinguish sampling error from systematic error and model uncertainty. A confidence interval does not include unmeasured confounding unless explicitly modeled; a posterior interval is conditional on its prior and likelihood. Report design limitations, missingness, measurement error, and selection transparently. Avoid overprecise wording when the data are sparse or assumptions weak. The strongest conclusion is the one supported by effect size, interval, design quality, and sensitivity—not by a single thresholded p-value.

When multiple analyses disagree, show the range and explain differences in estimand/assumptions. Do not privilege a favorable analysis without justification. Provide protocol/SAP deviations and all outcomes, including harms. If a claim depends on a subgroup or post hoc threshold, label it and recommend independent confirmation.

Use verbs aligned with design: randomized assignment may support causal inference for the specified estimand if conduct and missing-data assumptions are sound; cohort associations require confounding/selection assumptions; cross-sectional associations often have ambiguous temporality. “Associated with” is safer than “caused” when identification is not established. For prediction models, say “predicts” only in a validated population and distinguish prognostic association from treatment benefit.

State important limitations with direction where possible. For example, differential loss to follow-up among sicker participants may bias results toward healthier outcomes, though the direction depends on group patterns. Generic limitations that “more research is needed” are less useful than explaining which uncertainty changes decisions.

## Complete results reporting

## Reporting limitations constructively

If conclusions rely on a particular model or threshold, show sensitivity to reasonable alternatives. Report null and adverse outcomes with the same visibility as favorable outcomes, and disclose analysis changes made after seeing results.

## Final communication check

When space is limited, preserve effect estimate, interval, denominator, and design limitations before secondary p-values or model details.

Ensure reporting follows the appropriate guideline and checklist, with deviations explained rather than used as a substitute for methodological description.

### Example language

Prefer: “The adjusted difference was −2.0 points (95% CI −4.1 to 0.1), compatible with a modest benefit or little difference.” Avoid “almost significant” or “proved no effect.” For observational data, report association and causal assumptions separately. For models, distinguish discrimination from calibration; for tests, report prevalence and predictive values at the use setting. Plain language should preserve uncertainty rather than remove it.

Make the conclusion answer the prespecified question, identify the population and horizon, and state practical relevance. Avoid extrapolating beyond studied populations or turning exploratory analyses into recommendations.

Before submission, verify every abstract and discussion claim against the estimate and interval. Check that units, denominators, reference group, horizon, and adjusted/unadjusted labels are consistent across text, tables, figures, and supplement. Report deviations and funding/conflicts, and use guideline checklists relevant to the study design.

For each limitation, describe the mechanism, likely direction if known, and impact on interpretation. “Residual confounding is possible” is less informative than naming a plausible unmeasured severity factor and explaining how it might affect treatment assignment and outcome. State which results are robust to alternate assumptions and which are not. Limitations should calibrate the conclusion rather than serve as a generic closing paragraph.

Distinguish internal validity, precision, and transportability. A well-randomized but narrow trial may have strong internal validity and limited generalizability; a representative survey may estimate prevalence precisely but not causal effects. Keep conclusions aligned to the design's strengths and limits.

Include participant flow, exclusions, baseline characteristics with clinically relevant distributions, outcome denominators, missingness, adverse events, protocol deviations, and all prespecified analyses. For models, report covariate handling and diagnostics. For meta-analysis, include study selection and heterogeneity. For diagnostic studies, include threshold and reference standard. Use relevant reporting guidelines (CONSORT, STROBE, STARD, TRIPOD, PRISMA) as checklists, not substitutes for transparent methods.

When results are null, report estimates and intervals and distinguish evidence of absence from absence of evidence. If an interval excludes a minimally important effect, explain that; if it is wide, acknowledge uncertainty. Avoid changing the conclusion based on whether p=.049 or .051.

Scientific reports need methods and uncertainty detail; clinical summaries should translate effects to natural frequencies and meaningful horizons; public communication should avoid relative-only framing and explain uncertainty plainly. Keep the underlying estimate consistent across audiences. Visual displays should show denominators and reference groups. Do not use truncated axes or icon arrays that exaggerate small differences.

Do not say “the treatment caused a 20% reduction” when the estimate is an odds ratio of 0.80; state odds and translate to absolute risk if possible. Do not interpret a hazard ratio as cumulative risk reduction. Do not describe a nonsignificant result as “no effect”; state which effects remain compatible with its interval. Avoid “trend” for p=.06 and avoid equating statistical significance with clinical importance. For a Bayesian posterior probability, state the model/prior assumptions and differentiate it from a frequentist p-value.

## Reporting absolute effects with baseline scenarios

When relative effects are more transportable than baseline risk, provide absolute effects for several plausible baseline risks at a fixed horizon. For RR=.8, baseline risks 2%, 10%, and 30% imply risk reductions 0.4, 2, and 6 percentage points (NNT 250, 50, and about 17). This shows how the same relative estimate maps to different decisions. Do not imply all scenarios were observed in the trial; label them as model-based translations and propagate uncertainty when possible.

## Abstract and main-text discipline

Abstracts should give design, setting, sample size, primary outcome, effect estimate with interval, and conclusion proportionate to evidence. Avoid unsupported causal verbs in observational studies. Main text should identify prespecified analyses and report absolute counts, denominators, missingness, and adverse events. Supplementary analyses should be indexed and linked, not used to bury inconvenient outcomes. Ensure values in abstract, text, tables, and figures agree through scripted output generation.

State model family, link, covariates, functional forms, clustering/correlation structure, variance estimator, and missing-data assumptions. Report how continuous predictors were modeled and why. Include diagnostics relevant to the model: residuals and calibration for regression, proportional-hazards assessment for Cox models, influence and convergence for mixed models, and calibration/discrimination for prediction. Diagnostics should inform interpretation and sensitivity analysis rather than be used as a pass/fail ritual.

For adjusted results, explain the target population and whether estimates are conditional or marginal. A coefficient is not automatically an adjusted population effect. State how standard errors were calculated and whether model selection was prespecified. If assumptions are materially violated, report alternative analyses and how conclusions change.

## Transparent deviations and multiplicity

Compare the report with protocol, registry, and SAP. Disclose outcome changes, added analyses, and timing relative to unblinding. For exploratory analyses, say how many outcomes, cutpoints, subgroups, and models were considered when known. Multiplicity adjustment is not always required for exploration, but selective emphasis must be avoided. Provide all estimates in supplement or data repository where possible.

Report an effect estimate with confidence or credible interval on a clinically interpretable scale. A p-value measures compatibility of data with a model-based null, not the probability the null is true and not the size or importance of an effect. A small p-value can accompany a trivial effect in a large study; a clinically important estimate can be imprecise in a small study. Interpret the full interval against prespecified clinical thresholds and plausible harms.

For binary outcomes, present event counts and absolute risks by group alongside relative measures. For survival outcomes, state time horizon, risk sets, censoring, competing events, and whether a hazard ratio assumes proportional hazards. For continuous outcomes, include units, baseline/follow-up distributions, and meaningful thresholds. For observational studies, distinguish adjusted association from causal effect and state assumptions. For prediction, report calibration and decision relevance in addition to discrimination.

## Confidence intervals and p-values

A 95% frequentist confidence procedure covers the true parameter in 95% of repeated samples under model assumptions; after observing data, it is not a 95% posterior probability statement. The interval includes sampling uncertainty but not automatically bias, measurement error, model selection, or multiplicity. A p-value below .05 does not indicate practical importance or replication probability. Avoid binary “significant/non-significant” language where estimates and intervals can communicate gradation.

When many outcomes, subgroups, time points, or models are examined, selective reporting inflates false-positive risk. Identify primary and secondary analyses and explain multiplicity strategy. Exploratory findings can be reported transparently as exploratory; they need independent confirmation. Report all prespecified outcomes regardless of significance and disclose protocol/SAP deviations with dates and rationale.

## Tables, figures, and reproducible claims

Every table should state analysis denominator, missing data, units, reference group, and adjustment set. Avoid significance stars without estimates and intervals. Forest plots should show effect scale and direction; survival plots should include numbers at risk; ROC curves should identify thresholds or intended operating point. Use captions that allow figures to be interpreted without searching the methods. Round consistently and avoid excessive decimals that imply unsupported precision.

Distinguish prespecified results from post hoc analyses and label subgroup findings accordingly. A “trend toward significance” is not a distinct evidential category. Do not claim equivalence from nonsignificance. Report both absolute and relative effects when they answer complementary questions, and avoid translating odds or hazards directly to risk without appropriate baseline information.

- Wasserstein RL, Schirm AL, Lazar NA. Moving to a world beyond “p<0.05”. *The American Statistician*. 2019;73(sup1):1–19. https://doi.org/10.1080/00031305.2019.1583913
- Greenland S, Senn SJ, Rothman KJ, et al. Statistical tests, P values, confidence intervals, and power. *European Journal of Epidemiology*. 2016;31:337–350. https://doi.org/10.1007/s10654-016-0149-3

- CONSORT 2025. [BMJ 2025;389:e081123](https://doi.org/10.1136/bmj-2024-081123)
- STROBE Statement. [The Lancet 2007;370:1453–1457](https://doi.org/10.1016/S0140-6736(07)61602-X)
- Bossuyt PM, Reitsma JB, Bruns DE, et al. STARD 2015. [BMJ 2015;351:h5527](https://doi.org/10.1136/bmj.h5527)
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378)

- Altman DG, Schulz KF, Moher D. *The CONSORT Statement: Revised Recommendations for Reporting Parallel Group Randomised Trials*. BMJ.
- von Elm E, Altman DG, Egger M, Pocock SJ, Gøtzsche PC, Vandenbroucke JP. *The STROBE Statement: Strengthening the Reporting of Observational Studies in Epidemiology*.
- Bland M. *Statistics in Practice: A Guide to the Statistical Methods in Medicine and the Health Sciences*. Chapman and Hall.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.

The [confidence intervals article](../inference/confidence-intervals.html) develops the interval interpretation used throughout.
