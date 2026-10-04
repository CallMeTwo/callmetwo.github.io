---
title: Independent and paired t-tests
summary: Comparing the means of two groups, using separate samples or matched before-and-after measurements from the same subjects.
---

## Overview

A t-test compares a mean with a reference value or another mean while scaling the observed difference by its estimated standard error. The essential first decision is whether observations are independent or naturally paired. Independent groups consist of different participants; paired data contain two linked measurements per person or matched unit. The paired analysis works on within-pair differences and can remove stable between-person variability.

## Independent samples: Welch as the default

For group means x̄₁ and x̄₀, Welch’s statistic is (x̄₁−x̄₀)/√(s₁²/n₁+s₀²/n₀), with approximate degrees of freedom reflecting the separate variance estimates. Unlike the pooled Student test, Welch does not assume equal population variances and performs well when they are equal too. The estimand remains a difference in means; the test does not require equal group sizes.

Suppose systolic pressure at follow-up averages 132 (SD 15, n=40) in usual care and 125 (SD 13, n=38) in a new-care arm. The estimated arm difference is −7 mmHg. The Welch SE is √(15²/40+13²/38)≈3.15, so a rough interval is −7±2(3.15), about −13.3 to −0.7. This suggests a reduction but leaves uncertainty about whether the effect exceeds a prespecified clinically important threshold.

## Paired measurements: analyze change directly

For paired values Xpre and Xpost, define D=Xpost−Xpre (or state the opposite convention). The paired t-test is a one-sample t-test on D; SE=SD(D)/√n. It relies on the differences being independent across subjects and reasonably modeled by a normal distribution for small samples. The marginal pre and post distributions need not each be normal. Pairing improves precision when within-person measurements are positively correlated because SD(D)²=SD(pre)²+SD(post)²−2r SD(pre)SD(post).

```r
# Independent groups: Welch's two-sample test
t.test(bp ~ arm, data = trial, var.equal = FALSE)

# Paired rows must refer to the same participants
t.test(trial$bp_after, trial$bp_before, paired = TRUE)
```

Validate the match identifier and one record per time point before using the paired option. Treating paired values as independent wastes information and misstates uncertainty; pairing unrelated patients invents dependence. If treatment assignment was randomized, compare arms using a prespecified follow-up outcome model or baseline-adjusted analysis rather than relying only on within-arm change tests.

## Assumptions, robustness, and alternatives

The t procedures assume a meaningful continuous outcome, independent sampling units, and an appropriate mean/variance model. Outliers can dominate the mean and standard error, particularly in small samples. Inspect raw data and group distributions; normality tests alone are poor decision rules. The t-test can be robust to moderate skew in balanced, sufficiently large samples, but highly skewed costs or count outcomes may call for a different estimand/model. A rank test does not automatically test a difference in medians; choose it only if its distributional estimand answers the question.

For clustered or repeated follow-up, use mixed models, generalized estimating equations, or cluster-level analyses as appropriate. For heteroscedastic outcomes, Welch is preferable to a preliminary variance test followed by a data-dependent t-test choice. Missing paired follow-up can create selection bias; the complete-pair analysis estimates change among those observed unless stronger assumptions support generalization.

## Communicating the result

Report group means and SDs as descriptive spread, mean difference with confidence interval as inferential uncertainty, test and degrees of freedom, and the direction of subtraction. For paired data, report the distribution of changes and number of complete pairs. Distinguish statistical evidence from clinical relevance by relating the interval to a meaningful difference. Do not infer a treatment effect from a pre/post change in one arm alone; time trends, regression to the mean, and co-interventions offer alternative explanations.

## Deriving the standard errors

For independent arms, the variance of the mean difference is approximately sT²/nT+sC²/nC. Welch’s t statistic divides the observed contrast by the square root of this estimate. Its degrees of freedom use the Welch–Satterthwaite approximation, which accounts for unequal variance and sample size. The pooled Student test instead estimates one common variance and uses nT+nC−2 degrees of freedom. When variances are genuinely similar, estimates are close; when not, pooled inference can be miscalibrated, particularly when the smaller arm has the larger variance.

For paired data, calculate Dᵢ=afterᵢ−beforeᵢ, then t=D̄/(sD/√n) with n−1 degrees of freedom. The standard error depends on the within-person covariance. Pairing is most efficient when repeated measures are positively correlated, but a poor or artificial match can reduce precision. The pair itself is the independent unit for inference.

```r
x <- c(132, 128, 141, 136, 127, 130, 139, 125)
y <- c(126, 129, 135, 132, 124, 128, 133, 123)
d <- x - y
c(mean_difference = mean(x) - mean(y),
  welch_se = sqrt(var(x)/length(x) + var(y)/length(y)),
  paired_se = sd(d)/sqrt(length(d)))
t.test(x, y, var.equal = FALSE)
t.test(x, y, paired = TRUE)
```

These values illustrate that the paired and independent analyses answer different questions, even on the same arrays. In real data, verify that x and y are matched measurements before using the paired call.

## Confidence intervals and clinical thresholds

For the independent contrast, report mean difference and a Welch confidence interval. For paired data, report mean within-person change and its t interval. A p-value says whether a zero difference is excluded under the model; the interval indicates whether the data exclude clinically important effects. If a minimal important difference is 5 mmHg and a treatment contrast is −3 with interval −7 to 1, the study is compatible with a meaningful reduction as well as little effect. This is not equivalence.

Standardized effects such as Cohen’s d can support synthesis across scales but rely on an SD denominator and obscure original units. Give the raw-unit contrast as primary. For paired data, specify whether the standardizer is baseline SD, pooled SD, or SD of change; these yield different d values.

### Robustness, skew, and outliers

The t-test concerns means. With finite variance, the sample mean’s asymptotic distribution becomes normal, but small samples with strong skew or influential observations can have poor coverage. Plot group distributions and individual values; a histogram may conceal a single point. Welch addresses unequal variances, not severe skew, dependence, or outliers. Bootstrap intervals or permutation tests may be considered, but their validity depends on exchangeability and design. Trimmed-mean methods target a robust location quantity rather than the arithmetic mean.

Do not run Shapiro–Wilk separately in each arm and automatically switch methods based on p-value. Normality tests have low power in small samples and detect irrelevant deviations in large samples. Choose the estimand and analysis in advance, then use plots and sensitivity analyses to understand robustness.

## Baseline adjustment in a randomized trial

For a follow-up endpoint, ANCOVA regresses follow-up on treatment and baseline outcome, generally yielding a more precise treatment contrast when baseline predicts follow-up. Testing change from baseline with a t-test can be valid in some settings, but separate within-arm pre/post tests do not test the randomized treatment effect. State whether the estimate is adjusted, and include prespecified covariates only. For nonrandomized groups, baseline adjustment alone may not remove confounding.

Missing paired outcomes deserve special care. The paired t-test uses complete pairs and therefore targets observed completers unless missingness assumptions permit broader interpretation. Compare baseline features of completers and noncompleters, model missingness if needed, and perform sensitivity analyses when missingness may depend on unobserved outcomes.

### Reporting

Report group n, mean and SD, mean contrast, confidence interval, test variant and degrees of freedom. For paired data, report number of pairs, mean difference, SD of differences, and sign convention. Include the primary endpoint time, missingness, and covariate adjustment. Translate the interval into clinically meaningful units and avoid choosing t versus rank testing after seeing which p-value is smaller.

### Choosing a comparison from the design

The independent t-test compares means from unrelated experimental units. The paired test compares within-unit differences or carefully matched pairs. The distinction is not based on whether the data are stored in two columns; it follows from randomization and measurement structure. A crossover trial uses within-person comparisons but may need to model period and carryover effects. Matched observational pairs may require conditional methods if the matching design is central.

If participants are measured repeatedly at three or more visits, conducting many paired t-tests inflates multiplicity and ignores the trajectory structure. Use a repeated-measures model or prespecified contrast. If there are missing visits, a mixed model may use incomplete records under a missing-at-random assumption, while complete-pair analyses can select a subset. Report the assumption and sensitivity.

### Welch versus pooled Student inference

The pooled Student test estimates one common variance: s_p²=[(n1−1)s1²+(n0−1)s0²]/(n1+n0−2), and SE=s_p√(1/n1+1/n0). Welch uses separate variances and degrees of freedom. When sample sizes differ and the group variances differ, pooling can distort Type I error. Welch is a sensible default because it remains close to Student performance under equal variance and avoids a preliminary variance test that changes method based on noisy data.

```r
# Welch is R's default two-sample t-test
res <- t.test(outcome ~ group, data = dat)
res$estimate
res$conf.int
res$statistic
res$parameter
```

The formula method subtracts group means according to factor level order. Confirm which group is first so the estimate’s sign has the intended meaning. Report degrees of freedom, which may be non-integer under Welch.

### Causal interpretation and baseline values

In a randomized trial, the unadjusted between-arm comparison estimates an intention-to-treat effect under randomization, subject to missing outcome concerns. In observational groups, a t-test only compares observed means and does not control confounding. Matching or regression may adjust measured covariates but still relies on assumptions about unmeasured confounding and overlap.

For baseline and follow-up measures in a randomized study, ANCOVA often improves precision. A test that compares within-arm change to zero does not test the treatment effect; the estimand is the contrast between randomized groups. Distinguish effect estimation from pre/post description.

### The estimand determines the summary

A t-test is specifically about means. If the clinical question concerns median waiting time, probability of superiority, or proportion exceeding a threshold, a mean comparison may not be the desired estimand. Conversely, skewness does not automatically make the mean meaningless; resource planning may care about arithmetic mean cost even when the distribution is right-skewed. Robust or bootstrap inference can retain the mean target. Make the target explicit before selecting a rank test.

For a paired design, the mean of within-person differences is often the natural target. If patients contribute two eyes or paired organs, within-person dependence must be respected and the clinical unit of inference clarified. A simple paired t-test handles one pair per person; multiple paired organs may require a mixed model or cluster-robust SE.

## Sample-size implications

For independent equal-size groups with common SD σ and target mean difference δ, a rough normal approximation is n per arm ≈2(z1−α/2+z1−β)²σ²/δ². For paired designs, replace σ with the SD of within-pair differences; strong correlation can substantially lower that SD and required n. Planning should use realistic variance estimates, account for dropout, and define the clinically worthwhile δ. Post hoc power based on observed δ is not a useful interpretation.

### Missing data and the analysis population

For paired analyses, participants missing either measurement are often omitted. If missingness is related to response or adverse events, the complete-pair mean change may not represent all enrolled participants. Mixed models can include incomplete longitudinal records under a missing-at-random assumption, and multiple imputation can incorporate auxiliary predictors. Neither method removes the need for sensitivity analysis when unobserved outcomes plausibly influence missingness.

Report numbers assessed at each time and reasons for missingness by arm. In a randomized comparison, avoid changing from intention-to-treat to completers without explaining the estimand and potential bias.

### Welch calculation in a clinical example

Using usual-care SD 15, n=40 and new-care SD 13, n=38, the difference (new minus usual) is −7 mmHg. The Welch SE is √(13²/38+15²/40)=√(4.45+5.625)=3.17 mmHg. Welch degrees of freedom are approximately (4.45+5.625)² / [4.45²/37+5.625²/39] ≈75. A t critical value near 1.99 gives a 95% interval about −13.3 to −0.7. This interval excludes zero but still includes reductions below a 5-mmHg clinical target.

```r
n1 <- 38; m1 <- 125; s1 <- 13
n0 <- 40; m0 <- 132; s0 <- 15
se <- sqrt(s1^2/n1 + s0^2/n0)
df <- (s1^2/n1 + s0^2/n0)^2 /
  ((s1^2/n1)^2/(n1-1) + (s0^2/n0)^2/(n0-1))
diff <- m1 - m0
ci <- diff + qt(c(.025, .975), df) * se
c(diff = diff, SE = se, df = df, lower = ci[1], upper = ci[2])
```

The example assumes independent participants and uses summary data. A real trial may prespecify baseline adjustment, and the adjusted contrast can differ. Report the analysis plan rather than substituting a test based on descriptive group summaries.

### Unequal variances and allocation

If one arm has much larger variability and smaller size, pooled variance can overweight the wrong group and distort nominal error. Welch’s method adapts degrees of freedom. A preliminary Levene test followed by pooled or Welch testing is not recommended: the two-stage procedure has its own error behavior and adds little benefit. Use Welch by default unless the pooled model is justified by design and scientific knowledge.

### Diagnostics with scientific judgment

Plot individual measurements and residuals. A Q-Q plot can flag heavy tails, but small-sample deviations do not automatically invalidate inference. Check data entry and instrument range before labeling observations as outliers. Sensitivity analyses can compare Welch means, trimmed means, or rank effects, but each targets a different summary. Do not remove a valid extreme observation solely because it changes significance.

### Reporting direction and uncertainty

Write the contrast order explicitly, e.g. “new treatment minus control.” Give sample size, mean and SD per arm, mean difference, interval, test and degrees of freedom. For paired designs, give complete-pair count and SD of differences. Discuss the interval relative to a minimal important difference; do not report only p-value or standardized effect.

### The role of randomization and confounding

An independent t-test compares observed means; randomization supports interpreting that contrast as an average treatment effect. In nonrandomized studies, age, severity, site, and treatment selection can confound the crude mean comparison. Covariate adjustment, matching, or weighting may address measured confounding under assumptions, but the plain t-test does not. A small p-value cannot distinguish treatment effect from baseline differences.

In a randomized study with a continuous baseline measure strongly predictive of outcome, ANCOVA can improve precision and reduce chance imbalance. The analysis should be prespecified. For multiple sites or repeated outcomes, use models that incorporate dependence rather than applying ordinary t tests to correlated observations.

### Distribution summaries for interpretation

A mean and SD summarize symmetric distributions but can conceal skew, floor effects, and subgroups. Display a histogram, dot plot, or quantiles when the sample allows. In a paired study, plot within-person differences; pre/post marginal plots alone do not reveal whether changes are consistent or driven by a few individuals. Diagnostics inform interpretation, not automatic method switching.

### Multiplicity across repeated tests

Testing each follow-up visit separately creates multiple opportunities for a false-positive result. Choose a primary time point or model the trajectory with a prespecified contrast. If multiple pairwise comparisons are reported, adjust or clearly label them exploratory. A t-test at one time point is not a complete longitudinal analysis.

### Final interpretation

The t-test is simple because its target is clear: a mean or mean difference. Its validity depends on the independent unit, variance estimate, pairing, and a meaningful outcome scale. Report the contrast and interval, not just a test label, and relate uncertainty to clinical thresholds. A correct design choice matters more than a generic normality checklist.

### Effect size beyond significance

A standardized mean difference is sometimes used when studies measure the same construct on different scales. It depends on the denominator SD and can vary across populations even when the raw difference is stable. Give the raw-unit difference first and identify the standardization convention if reporting d or Hedges’ g. A confidence interval around the raw contrast is usually the clearest guide to clinical relevance.

### Final interpretation

Use the independent t-test for unrelated units and the paired test for genuine matched measurements. Welch inference avoids an unnecessary equal-variance assumption; paired inference uses the within-unit differences. Report mean contrasts and intervals in clinical units, and let the design, missingness, and target estimand guide the method.

When a mean contrast is nonsignificant, interpret the interval against the clinically important range instead of concluding that groups are equal. For paired studies, the interval applies to mean within-pair change, not agreement of the two measurements.

For repeated outcomes at several visits, define the primary time point or longitudinal contrast before fitting the model. A collection of t-tests increases multiplicity and can confuse transient fluctuation with a sustained treatment effect. Use a model that matches the repeated design and report the covariance assumptions.

When means have a strong floor or ceiling effect, describe the bounded scale and consider whether a mean contrast remains clinically meaningful.

### What the two tests do not cover

The basic t procedures do not handle time-to-event censoring, ordinal response structures, or count outcomes. For censored recovery time, a survival estimand may be needed; for repeated binary outcomes, use a generalized model. Applying a t-test to a transformed or coded outcome changes the quantity being estimated and needs justification.

## References and further reading

- Welch BL. [The generalization of Student's problem when several different population variances are involved](https://doi.org/10.1093/biomet/34.1-2.28). *Biometrika*. 1947;34(1–2):28–35.
- Altman DG, Machin D, Bryant TN, Gardner MJ, eds. *Statistics with Confidence*. 2nd ed. BMJ Books, 2000.
- Lang TA, Altman DG. [The SAMPL guidelines](https://www.equator-network.org/reporting-guidelines/sampl/), basic statistical reporting in biomedical journals.
