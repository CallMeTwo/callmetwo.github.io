---
title: Scales of measurement
summary: Nominal, ordinal, interval and ratio scales describe how much structure a variable carries, and the structure fixes which operations are valid.
---

## Overview and key ideas

The **scale of measurement** classifies a variable by the structure its values
carry, in four ascending levels:

- **Nominal** — categories with no order (blood group, sex, hospital site).
  Summarise with counts and proportions; models can use indicator variables
  without implying a numeric order.
- **Ordinal** — ordered categories with unequal or unknown spacing (NYHA
  class I–IV, pain mild/moderate/severe). Ranking is valid; arithmetic is not.
- **Interval** — ordered, equal-spaced values with no true zero (Celsius
  temperature, IQ, dates). Differences are meaningful; ratios are not (20°C
  is not twice as hot as 10°C).
- **Ratio** — interval plus a true zero, so ratios are meaningful (weight,
  blood pressure, concentrations, durations, counts).

The level is not a property of the quantity but of the *scale chosen to record
it*: weight is a ratio scale in kilograms but ordinal if recorded only as
"underweight / normal / overweight". The recorded scale is the ceiling on the
analyses you can legitimately do — ratio-scale information cannot be recovered
from a coarser record.

## When to use it

Scale of measurement is fixed when the instrument is designed, because it
decides which statistics and tests are admissible. Typical scenarios:

| Setting | Example question |
| --- | --- |
| Heart-failure clinic | Patients are graded NYHA I–IV (ordinal) and weighed (ratio); which summaries are valid for each? |
| Quality survey | Staff rate communication "poor/fair/good/excellent" (ordinal) — can we compute a mean? |
| Lab reference interval | Serum creatinine is ratio-scale, supporting both mean and coefficient of variation. |
| Trial endpoint | Time to first event (ratio, survival analysis) versus "event by 90 days" (nominal) — a design choice, not a technicality. |

In a heart-failure clinic, NYHA class is ordinal: class III is worse than II,
but the "distance" II→III need not equal III→IV. Weight is ratio-scale: a 70
kg patient really weighs twice a 35 kg patient, so ratios and geometric means
are legitimate. The same patient, measured on scales of different richness,
supports different analyses.

## Assumptions and limitations

- **The recorded scale is a ceiling, not a floor.** Once a continuous
  measurement is collapsed into categories, the finer information is gone.
  Record at the finest defensible scale and bin only at analysis time, if ever.
- **Interval scales lack a true zero.** For Celsius, "10 degrees higher" is
  meaningful but "twice as warm" is not; ratio-based operations (coefficients
  of variation, relative changes) should be avoided on interval data.
- **Ordinal spacing is unknown.** Treating Likert or NYHA scores as
  equally-spaced numbers is a modelling assumption that should be stated, not
  assumed.
- **Some "categorical" data are interval in disguise.** Recording time-of-day
  as "morning/afternoon/evening" throws away interval structure that could
  support time-based analysis.

The classification breaks down for variables measured on different scales in
different contexts (a date is interval; a duration is ratio) and for hybrid
instruments, where the scale is assigned per item rather than per
questionnaire.

## Worked example

A heart-failure clinic records, for 120 patients, NYHA class (ordinal), body
weight (ratio) and serum sodium concentration (ratio). NYHA class III is the
mode (45 patients, 37.5%); the class distribution is best summarised by the
mode and the proportion in III–IV. Median weight is 78 kg (IQR 70–86); a
geometric mean is meaningful for positive values when a multiplicative summary
is useful. Serum sodium has a mean of 138 mmol/L (SD 3.1); concentration has a
meaningful zero, so ratios are defined, though the coefficient of variation is
not necessarily the clinically most useful summary.

The point: the same 120 patients support a mode and proportions for the
ordinal variable and medians and IQR (or means and SDs if roughly symmetric)
for numeric variables. The recorded scale constrains interpretation, but it
does not alone dictate a statistical method: distribution, design, estimand
and model assumptions matter too.

## Interpretation and common pitfalls

- **Computing a mean on ordinal data and reporting it as a "score".** A mean
  of 2.4 on a 1–4 NYHA scale implies equal spacing; report proportions by
  class or the median unless the spacing assumption is defensible.
- **Confusing the quantity with the scale.** Sodium is intrinsically a ratio
  quantity, but if the lab only reports "normal/low/high" the recorded scale
  is nominal and only counts are valid.
- **Taking ratios on interval data.** "Sodium changed by a factor of two" or
  "Celsius temperature doubled" misuses a scale with no true zero.
- **Binning at data entry.** Recording a continuous lab value as
  "above/below the reference range" in the form makes later continuous
  analysis impossible even if the raw value existed in the lab report.

## Measurement scales, transformations, and model meaning

The classical nominal, ordinal, interval, and ratio categories describe which transformations preserve meaning. Nominal labels permit relabeling; only equality/inequality is meaningful. Ordinal data preserve rank under any strictly increasing transformation, but spacing is unknown. Interval data preserve differences under positive affine transformations: Celsius and Fahrenheit have different zeros but equal intervals. Ratio scales have a meaningful zero, so ratios such as “twice as long” are interpretable. These categories help prevent nonsensical summaries, but modern measurement also asks how a construct is operationalized and whether the instrument behaves similarly across groups.

A statistical model places additional structure on the scale. Treating ordinal scores as numbers assumes a particular spacing; treating an interval score as Gaussian assumes a residual distribution, not merely equal intervals. Transformations affect coefficient interpretation. In a model of log outcome, a coefficient β corresponds to a multiplicative factor exp(β); if β=.20, the factor is 1.22, approximately a 22% increase. A log transformation is only valid for positive values and changes the estimand from an arithmetic mean contrast to a geometric-scale contrast unless retransformation is handled carefully.

Categorizing a continuous variable is not an innocent change of scale. It loses within-category ordering, makes results depend on cut points, and can create residual confounding. If a threshold is clinically established, binary classification may answer an important decision question, but retain and report the underlying continuous measurement where possible. Standardization to z-scores is useful for comparing measurements on different units, but it does not make different constructs equivalent.

### Worked example: log scale and ratio interpretation

Suppose a linear model for log(CRP) estimates a treatment coefficient β=−0.223. Exponentiating gives exp(−0.223)=0.80, so the fitted geometric mean under treatment is 80% of control, or 20% lower on the ratio scale. The coefficient itself is not a reduction of 0.223 mg/L. A confidence interval for β, for example (−0.40, −0.05), transforms to (exp(−.40), exp(−.05))=(0.67, 0.95). These are ratios of conditional geometric means under model assumptions.

```r
beta <- -0.223
ci <- c(-0.40, -0.05)
c(ratio = exp(beta), percent_change = 100 * (exp(beta) - 1),
  ratio_lower = exp(ci[1]), ratio_upper = exp(ci[2]))
```

If the clinical target is the arithmetic mean CRP, this transformed coefficient does not directly answer it. Retransformation can require a residual-variance correction, and that correction can differ by group if variances are unequal.

### Validity of a scale in context

A scale's label does not guarantee valid interpretation. A 0–10 pain rating is bounded and ordinal in a strict sense, but a validated multi-item score may often be analyzed approximately continuously if the distribution and study objective support it. Check floor and ceiling effects, missing item rules, reliability, responsiveness, and measurement invariance across language or demographic groups. A one-unit difference should have a defensible interpretation. For scores derived from questionnaires, follow the instrument's scoring manual rather than improvising sums or imputations.

Select a summary and model that preserve the scientifically relevant information and state the assumptions needed. Report original units alongside standardized effects when practical. Include units in variable names or metadata, define transformations, and ensure plots display interpretable axes. Measurement theory references and instrument-specific validation studies are essential when the construct is not directly observable.


## Construct validity and differential measurement

Many biomedical variables are latent constructs: pain, frailty, anxiety, adherence, and quality of life cannot be read directly from a device. A questionnaire operationalizes a construct through items, scoring, and timing. Content validity asks whether items cover the intended domain; construct validity asks whether scores behave as predicted; criterion validity compares with an accepted measure when one exists; responsiveness asks whether change in score reflects meaningful change. Reliability is necessary for some uses but does not alone establish validity. Details belong with the measurement-tool article, but the analytic consequence is direct: a scale with different meaning across groups can create biased comparisons.

Measurement invariance asks whether the item-score relationship is comparable across groups or time. Differential item functioning can occur when people with the same latent severity answer an item differently because of language or culture. If measurement is not invariant, observed score differences may combine construct differences and instrument behavior. Translation requires cultural adaptation and validation rather than literal substitution. Record instrument version, interviewer mode, language, calibration, and assessment window.

### Worked example: reliability and attenuation

Classical measurement error provides a useful approximation. If observed X = true X + independent mean-zero error, then in simple linear regression the slope is attenuated toward zero by approximately the reliability ratio Var(true X)/Var(observed X). If true exposure variance is 9 and measurement-error variance is 3, reliability is 9/(9+3)=0.75. A true slope of 2 would be expected to appear near 1.5 under this simplified model. This is not a universal correction: systematic error, differential error, nonlinear models, and confounding require more careful methods.

```r
var_true <- 9
var_error <- 3
reliability <- var_true / (var_true + var_error)
true_slope <- 2
c(reliability = reliability,
  approximate_observed_slope = reliability * true_slope)
```

Repeated measurements or validation substudies can estimate measurement properties, but the replicate design must match the error source. Technical replicates measure instrument variation; repeated visits include biological variation; independent raters measure inter-rater agreement. Bland–Altman limits of agreement assess individual-level differences between methods and should not be replaced by correlation, which can be high despite systematic disagreement.

### Scale transformations in a regression

If a ratio-scale biomarker is log-transformed, a linear coefficient can be translated to a ratio. If Y=log(X), a coefficient of .10 implies exp(.10)=1.105, approximately a 10.5% increase in the geometric-scale outcome per one-unit predictor increase. If the predictor is itself standardized, define exactly which SD was used. For a logit model, a coefficient is a log odds ratio; exponentiating produces an odds ratio, not a risk ratio. For ordinal logistic regression, proportional odds imposes one common odds ratio across cumulative thresholds.

```r
beta <- 0.10
c(ratio = exp(beta), percent_change = 100 * (exp(beta) - 1))
```

Coefficient interpretations should specify the contrast and conditional variables. Interaction terms mean the effect varies with another predictor; a single coefficient no longer summarizes an overall association. Present predicted outcomes at meaningful values when that improves interpretation.

### Choosing and reporting scale-sensitive methods

Use medians and rank-based procedures when order is defensible but intervals are not, while noting that rank tests are not generic tests of medians under all distribution shapes. For multi-item scores, follow validated scoring rules and assess ceiling/floor effects. For bounded proportions, beta regression may be useful for continuous values strictly between zero and one; zeros and ones require a model that represents those masses. For counts, distinguish a count scale from an ordinal rating with integer labels. Always retain original units in tables and plots where possible, and describe transformations, cutoffs, and scoring decisions before reporting model outputs.


## Agreement, repeatability, and meaningful change

A scale used for group comparisons may still be inadequate for monitoring individual change. Measurement error creates a smallest detectable change; clinical importance is a separate threshold. For two repeated measures with reliability ICC and SD σ, a common standard error of measurement is SEM=σ√(1−ICC), and the 95% minimal detectable change for a difference is about 1.96√2×SEM under standard assumptions. A change can be statistically detectable at group level while smaller than measurement noise for an individual.

### Worked calculation: detectable change

Suppose a functional score has SD 12 and test-retest ICC .84. SEM=12√.16=4.8 points. The individual-level minimal detectable change is 1.96√2(4.8)=13.3 points. A mean improvement of 3 points in a large trial might be estimated precisely and potentially matter clinically, even though a 3-point change in one person cannot be confidently distinguished from measurement variation under this reliability estimate. The concepts answer different questions.

```r
sd_score <- 12; icc <- 0.84
sem <- sd_score * sqrt(1 - icc)
mdc95 <- qnorm(.975) * sqrt(2) * sem
c(SEM = sem, MDC95 = mdc95)
```

This calculation assumes stable true status between repeated measurements, independent measurement errors, and an appropriate ICC definition. If patients truly change between test and retest or error variance differs by severity, the interpretation changes. Use validation-study estimates from a population and administration mode relevant to the current use.

## Agreement is not correlation

Correlation measures co-ranking or linear association, not interchangeability. Two devices can have correlation 0.99 while one reads every value 10 units higher. For paired methods, plot difference against average, estimate mean bias, and calculate limits of agreement (mean difference ±1.96 SD of differences) if differences are approximately normal and variance is stable. Examine proportional bias and clinically acceptable limits. If measurements are repeated across subjects, use methods that account for within-person replication.

A high Cronbach alpha indicates internal consistency under assumptions, but alpha rises with item count and can be high for redundant items; it does not establish unidimensionality or validity. Factor structure, item behavior, test-retest reliability, inter-rater agreement, and responsiveness may each matter for a tool's intended use. Choose reliability evidence matched to the measurement context.

## Scaling and standardization decisions

Z-standardizing a measurement (subtract mean, divide by SD) helps optimization and coefficient comparison but makes the unit sample-dependent. If different studies standardize to different SDs, standardized coefficients are not directly comparable. Centering can make an intercept meaningful but does not change fitted values in a model with an intercept. Rescaling age from years to decades changes coefficient units by a factor of ten, not model fit. Explain any scale transformation so coefficients retain clinical interpretation.

For bounded scores, a linear model can predict impossible values near boundaries. Inspect fitted range and residuals; ordinal, beta, censored, or item-response models may better represent the measurement process. However, complex models can be less transparent and need adequate data. Choose the simplest model that respects the score's meaningful structure and the estimand, and report the original scale so readers can judge practical size.

## Ordinal regression and threshold effects

For an ordinal outcome with levels mild, moderate, severe, cumulative-logit proportional-odds regression models logit[P(Y≤j)] as a threshold-specific intercept minus a shared linear predictor. A positive coefficient shifts probability toward higher categories under common coding conventions, but software signs differ. The proportional-odds assumption says the predictor has the same log-odds effect at every threshold. Assess this assumption; if it fails, partial proportional-odds or multinomial models may be preferable, at a cost in complexity and precision.

Report predicted category probabilities rather than only a common odds ratio when that helps clinical interpretation. A common odds ratio does not mean each category's probability changes by the same amount. Check sparse categories and consider combining adjacent levels only when clinically sensible and prespecified. For a single ordinal item, a mean score makes an equal-spacing assumption; state it if used.

## Measurement time and meaningful comparability

The same scale can behave differently at baseline and follow-up because of learning, treatment response, interviewer changes, or instrument drift. Longitudinal invariance asks whether item relationships remain stable over time. If not, an apparent score change may partly reflect the measurement process. Standard operating procedures, blinded assessors, device calibration, and training reduce avoidable drift. Include visit windows and assessment mode in the analysis data so such changes can be investigated rather than hidden.

Before transforming a variable, write down what one unit means and what contrast matters. For a log-transformed outcome, specify whether conclusions concern geometric means, median ratios, or arithmetic means after correction. For z-scores, identify the reference distribution; for categories, define ordering and cut points; for scores, cite the scoring algorithm and missing-item policy. Scale decisions are part of the scientific model and should be reported with the same care as covariate selection.

When scores contain multiple items, missing-item rules affect comparability. A total computed from all items is not directly comparable with a total computed from half the items unless the validated instrument permits prorating. Reverse-coded items must be recoded before summing, and category labels should remain consistent across language versions. Retain item-level data when permitted so scoring can be audited and alternative validated scores can be derived without re-contacting participants.

Model checking should return to the scale of the observed variable. For binary outcomes, assess calibration and probabilities; for ordinal outcomes, compare predicted cumulative probabilities with observed category frequencies; for continuous outcomes, examine residual spread and influential points; for counts, inspect zeros and mean-variance behavior. A mathematically valid coefficient can still be scientifically uninterpretable if coding, units, thresholds, or reference levels are undocumented.

## References and further reading

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Bland JM, Altman DG. *Statistics with Confidence*. BMJ Books.
- Agresti A. *Categorical Data Analysis*. Wiley.
- The *Describing data* articles in this library pair scales with appropriate
  summaries and plots.
