---
title: Null and alternative hypotheses
summary: The null hypothesis states the default position that the test must reject, and the alternative states what the researcher wants evidence for.
---

## Overview

A statistical hypothesis is a statement about a parameter or data-generating process. The null hypothesis defines the reference model against which the data are evaluated; the alternative describes departures that the design aims to detect. These are not necessarily competing beliefs about reality. They are operational definitions that determine test calibration, power, and the conclusions permitted by the study.

## Translate the clinical question

For a randomized trial with mean outcome μT and μC, a superiority test may specify H0: μT−μC=0 against H1: μT−μC≠0. The two-sided alternative recognizes departures in either direction. A one-sided alternative is defensible only when the opposite direction would not support any relevant claim and the direction was chosen before data inspection.

A non-inferiority trial asks a different question. If larger values are better and Δ>0 is the maximum acceptable loss, H0: μT−μC≤−Δ is tested against H1: μT−μC>−Δ. Failure to reject equality in a superiority test does not establish non-inferiority; the margin, population, assay sensitivity, adherence, and analysis populations need specific justification.

## Margins and meaningful nulls

A point null of exactly zero is mathematically convenient but can be scientifically weak: a huge study may detect a negligible departure. Equivalence instead asks whether the true effect lies within (−Δ,+Δ), usually requiring two one-sided tests or a corresponding 90% confidence interval wholly inside the margins at a 5% level. The margin must be clinically defensible and set without reference to observed results.

```r
# Illustrative two-sided test of a mean difference
x_t <- c(8, 6, 7, 4, 9, 5, 6, 7)
x_c <- c(5, 4, 6, 3, 7, 4, 5, 6)
t.test(x_t, x_c, alternative = "two.sided")
```

The code tests a mean difference under independent observations and Welch’s variance approach. It does not validate the choice of endpoint, margin, or study design. For clustered or repeated observations, a model reflecting dependence is needed.

### Decisions after observing data

Rejecting H0 means the data are sufficiently inconsistent with the null under the chosen procedure and assumptions; it does not prove H1 or establish causation. Failing to reject means evidence was insufficient at the specified threshold, not that H0 is true. To support “no clinically meaningful difference,” plan an equivalence or non-inferiority analysis and show an interval narrow enough to exclude relevant effects.

Pre-specify the parameter, direction, margin, alpha, and test. Report the estimate and interval even when the test is not significant. A directional hypothesis must not be chosen after seeing the sign of the estimate; doing so invalidates the advertised error rate. Hypotheses should constrain claims while leaving interpretation anchored in effect magnitude, precision, and the clinical threshold.

## Superiority is not equivalence

A superiority test typically places equality in the null and seeks evidence of a departure. A non-significant result leaves open a wide range of possible effects unless the interval is sufficiently narrow. Equivalence reverses the burden: investigators specify lower and upper margins ±Δ, and claim equivalence only when data are sufficiently precise to rule out effects outside those bounds. The null is that the effect is at or beyond one of the unacceptable boundaries; the alternative is that it lies wholly within the acceptable region. This is why ordinary failure to reject zero cannot establish equivalence.

For a mean difference where higher values are better and Δ=3 is the largest acceptable loss, non-inferiority tests H0: θ≤−3 versus H1: θ>−3. If an estimate is −0.5 with 95% CI −2.4 to 1.4, the lower confidence bound is above −3, supporting non-inferiority under the stated assumptions. It does not prove identical effects, nor does it show the new treatment is superior. The margin must be clinically justified and preserve an adequate fraction of established benefit.

## One-sided alternatives and direction

A one-sided test can increase power for a prespecified direction, but it is legitimate only when the opposite direction would not be interpreted as evidence for an important effect and would not change the decision. If a drug could plausibly cause harm, a one-sided test that ignores harm is generally inappropriate. Switching to a one-sided alternative after seeing the estimate effectively doubles the opportunity to reject in the chosen direction and invalidates the nominal alpha.

For a planned one-sided test at .025, the corresponding two-sided 95% interval boundary is asymmetric in its decision relevance; do not quote a two-sided p-value and claim the one-sided result unless the plan defined this. State the tail, parameter scale, and boundary precisely.

## Composite nulls, point nulls, and model structure

A null need not be a single value. Testing a treatment difference against a clinically important margin uses a composite null containing many parameter values. Regression tests may ask whether a set of coefficients is jointly zero, whether an interaction exists, or whether a slope exceeds a threshold. In each case, the null must correspond to the model parameterization and coding. For categorical predictors, the meaning of the coefficient depends on reference level; a joint test of all factor contrasts differs from a test of one selected contrast.

A point null of exactly no effect is often an approximation. In causal inference, the sharp null that treatment changes no participant’s outcome differs from a weak null of zero average treatment effect. Randomization tests based on the sharp null and model-based tests of an average effect therefore have different interpretations. Describe which null is tested, especially when the method is permutation-based.

## Connect hypotheses to estimates

The test statistic compresses evidence into a tail probability; the estimate and interval retain direction and magnitude. Report the prespecified null, alternative, α, analysis population, and estimate on a clinical scale. When a result is not statistically significant, inspect whether the confidence interval excludes clinically meaningful benefit and harm. If it does not, say the estimate is imprecise. For non-inferiority, report both intention-to-treat and per-protocol analyses when required by the protocol, and discuss whether deviations may bias toward similarity. Hypotheses are a design contract that bounds conclusions, not a substitute for substantive interpretation.

## Hypotheses for regression and stratified analyses

In a linear model, the hypothesis βj=0 concerns the conditional mean difference per unit of xj given the other modeled predictors. A joint hypothesis such as β2=β3=0 tests whether a multi-level factor contributes any conditional association. The reference category affects individual coefficients but not the fitted comparisons as a whole. If the design includes an interaction, a main-effect coefficient is the effect at the reference value of the interacting variable, not a universal average effect. Write the contrast in the parameterization actually used and consider reporting marginal predictions when those better answer the clinical question.

Stratified analyses can test homogeneity of effects across strata, but “no interaction” is scale dependent. Risk differences may be constant while risk ratios vary, or vice versa. State the effect scale on which the null is formulated. A test of interaction often has low power, so a nonsignificant interaction test is not proof that effects are identical. Present stratum-specific estimates and intervals with context rather than overinterpreting a single interaction p-value.

## Randomization tests and sharp hypotheses

A randomization test compares the observed statistic with values generated by reallocating treatment according to the actual randomization mechanism. Under the sharp null that treatment changes no participant’s outcome, all missing potential outcomes are known to equal observed outcomes, enabling an exact reference distribution. This differs from the weak null that the average treatment effect is zero: individual benefits and harms can cancel to an average of zero, but the sharp null is false. Large-sample methods may test a weak average-effect null, while randomization inference usually tests the sharp null unless additional procedures are used.

Preserve blocking, stratification, or cluster randomization in permutations. Arbitrarily permuting individual labels in a cluster trial violates the design. The test can be robust to outcome distribution under the randomization scheme, but it does not provide causal inference for nonrandomized exposure allocation without additional assumptions.

### Protocol language and deviations

A test’s error guarantee depends on how hypotheses and analyses were chosen. A protocol should define primary and secondary hypotheses, direction, margins, estimands, significance level, interim strategy, and multiplicity family. Deviations may be necessary because data collection encounters unforeseen problems. Document their timing relative to unblinding and explain why they were made. The honest distinction between confirmatory and exploratory analysis preserves the value of new discoveries without claiming an error rate that the analysis did not earn.

### A worked non-inferiority interpretation

Assume the primary endpoint is a functional score where larger values are better. Investigators set a non-inferiority margin of 4 points before enrollment, based on prior placebo-controlled evidence and expert/patient judgment. The estimated treatment difference (new minus standard) is −1.2 with a 95% CI from −3.5 to 1.1. Since the lower bound remains above −4, the result meets the statistical criterion for non-inferiority. The interval still allows the new treatment to be 3.5 points worse, so the clinical acceptability of that possibility depends on the margin’s justification. It does not prove equal efficacy or superiority.

The estimate may differ by analysis population. Nonadherence can dilute treatment differences toward zero, favoring non-inferiority in an intention-to-treat analysis; exclusions in per-protocol analysis can introduce selection bias. Agreement across analyses, careful protocol adherence, and assay sensitivity support interpretation but do not eliminate uncertainty. State the margin, its clinical basis, interval method, and populations analyzed.

### When evidence is insufficient

Consider a superiority estimate of 1.5 with a 95% interval −2.0 to 5.0. The interval crosses zero, but the proper conclusion is not “the treatments are the same.” It supports a range from modest harm to substantial benefit. If an equivalence margin were ±2, this interval would fail equivalence because its endpoints extend beyond both margins. The study may be underinformative for that question even if the point estimate is near zero.

Power calculations for equivalence must target precision inside the margins, not detection of a difference from zero. A design can have high power for a superiority effect and low power to establish equivalence, or vice versa. Specify the intended claim at design stage.

### A worked equivalence decision

Suppose a generic formulation is compared with a reference, and the acceptable mean difference is ±2 units. The estimated difference is 0.3 with a 90% interval from −1.1 to 1.7. Since the full interval lies inside −2 to 2, the result meets the usual two-one-sided-test criterion for equivalence at 5%, assuming the margin and analysis are justified. If the interval were −2.2 to 1.3, equivalence would not be established even though zero remains well inside it and the point estimate is close to zero. The confidence limits, not proximity of the estimate to zero, determine the conclusion.

This example illustrates why the null/alternative must be tied to the intended claim. A superiority test asks whether evidence supports a difference; equivalence asks whether differences large enough to matter can be excluded. Non-inferiority asks whether an unacceptable loss can be excluded in one direction. These are different hypotheses and require separate planning.

### Avoid post hoc threshold changes

A margin, alpha, and direction chosen after looking at the estimate are tailored to the observed data and no longer provide the planned error guarantee. If a prespecified margin proves impractical or scientifically outdated, revise the protocol prospectively and document why. If the revision occurs after unblinding, present the analysis as exploratory or sensitivity analysis, then seek independent confirmation.

### Hypotheses in Bayesian analyses

Bayesian estimation can assign continuous prior distributions to effects without a point null, but model comparison may still contrast a point-null hypothesis with an alternative model. The Bayes factor depends on the prior distribution under the alternative, so a very diffuse prior can penalize prediction by spreading probability across effects the data did not observe. Specify the hypotheses and prior scales; a posterior interval crossing zero is not a Bayesian test of a point null and does not by itself yield posterior probability of no effect.

### Revisit hypotheses only with transparency

Scientific understanding can evolve during a study. New analyses may be valuable when unexpected safety signals, data-quality problems, or mechanisms emerge. The appropriate response is to record the new hypothesis, timing, and analytic choices, then distinguish that work from the prespecified primary test. A hypothesis generated and tested on the same data has weaker confirmatory status and should be independently evaluated.

### Relate the hypothesis to the estimand

A hypothesis should name the target parameter, not merely the statistical test. “No effect” is underspecified if the outcome could be risk, rate, odds, mean change, or time-to-event hazard. A null hazard ratio of one under a proportional-hazards model differs from equality of survival probabilities at a fixed time. A zero average risk difference can conceal treatment-effect heterogeneity. State the estimand, scale, horizon, and population before writing H0 and H1.

This precision helps avoid test selection after inspecting data. For a common binary outcome, a risk difference may better match a public-health decision than an odds ratio; for non-inferiority, the margin must be on the chosen scale. The same word “no difference” can imply distinct hypotheses across scales, so report the numerical boundary.

### Reporting a hypothesis clearly

A methods statement can say: “The primary estimand was the treatment-policy difference in mean symptom score at week 12. We tested H0: μT−μC=0 against a two-sided alternative at α=.05; the analysis used baseline-adjusted ANCOVA.” For non-inferiority, state the scale, direction, and margin numerically. For an interaction, identify the modifier and scale. This is more informative than “groups were compared using a t-test” because it ties the inferential claim to a parameter and population.

### Statistical versus scientific hypotheses

A clinical mechanism may predict benefit only in a biomarker-defined subgroup, but the statistical null is a parameter restriction within a particular model. A test can reject because of bias or model failure without confirming the mechanism. Conversely, failure to reject can arise from low information. Treat the scientific hypothesis as a broader explanation and the statistical test as a limited implication of that explanation, requiring replication and contextual evidence.

### A short checklist before testing

Before choosing a test, write the estimand in words, parameterize it on a clinically useful scale, state the null boundary, identify whether direction is one- or two-sided, and choose the alpha/margin and multiplicity family. Confirm the analysis model estimates that parameter and reflects the assignment and sampling design. This short sequence prevents common mismatches, such as using a two-sample test for paired data or treating nonsignificance as equivalence.

After analysis, return to the original hypothesis and compare the estimate and interval with its boundary. Do not redefine the hypothesis to fit an observed trend. If the data suggest a new question, label it exploratory and design a future study to answer it.

### Worked superiority and non-inferiority distinctions

Suppose the estimated functional-score contrast is −1.2 points with a 95% interval −3.5 to 1.1. Under a superiority null of zero, the interval crosses zero, so the study does not demonstrate a difference at the usual two-sided level. Under a non-inferiority margin of −4, the lower bound −3.5 is above the unacceptable-loss boundary, so the same data may meet the statistical non-inferiority criterion. The conclusions differ because the hypotheses differ; the analysis is not inconsistent. A margin of −3 would lead to another conclusion, which is why its clinical basis must be settled before results are seen.

For equivalence with bounds −2 and 2, the 90% interval must lie entirely within both limits under the two-one-sided-test procedure. A point estimate near zero does not suffice if uncertainty remains broad. State the margins alongside the interval in any report.

### Reproducible hypothesis statements

Write the hypotheses in the protocol using words and notation. For example: “We test whether the week-12 treatment-policy mean difference in the randomized population is zero, two-sided, at α=.05; negative values favor intervention.” Include the outcome scale and missing-data strategy. This makes it clear what the test means and prevents direction ambiguity when coefficients or software contrasts reverse the group order.

### Summarize conclusions within the boundary

A test conclusion is limited to the parameter and model named in the hypothesis. Rejecting a null of zero adjusted mean difference does not prove every subgroup benefits, establish a biological mechanism, or guarantee future effectiveness. Failing to reject does not establish an exact null. Keep conclusions near the tested statement and use estimates, intervals, and external evidence for broader claims.

### Final interpretation

A well-formed hypothesis is a transparent contract between design and conclusion. It names the target effect, comparison, scale, direction, boundary, and multiplicity context. Once data are observed, report the estimate and interval against that boundary, and do not broaden a narrow statistical rejection into a causal or clinical claim the test was not designed to support.

## References and further reading

- Chow SC, Lu J, Jiang H. *Design and Analysis of Clinical Trials*. Wiley.
- Wasserstein RL, Lazar NA. [The ASA's statement on p-values: context, process, and purpose](https://doi.org/10.1080/00031305.2016.1154108). *The American Statistician*. 2016;70(2):129–133.
- Piaggio G, Elbourne DR, Pocock SJ, Evans SJW, Altman DG. [Reporting of noninferiority and equivalence randomized trials](https://doi.org/10.1001/jama.2012.87802). *JAMA*. 2012;308(24):2594–2604.
- The [p-values article](/biostatistics-library/inference/p-values-and-significance-levels.html) explains how test results are quantified.
- Schuirmann DJ. A comparison of the two one-sided tests procedure and the power approach for assessing the equivalence of average bioavailability. *Journal of Pharmacokinetics and Biopharmaceutics*. 1987;15:657–680. [doi:10.1007/BF01068419](https://doi.org/10.1007/BF01068419)
