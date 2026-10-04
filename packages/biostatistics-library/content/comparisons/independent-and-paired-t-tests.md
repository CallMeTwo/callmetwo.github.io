---
title: Independent and paired t-tests
summary: Comparing the means of two groups, using separate samples or matched before-and-after measurements from the same subjects.
---

## Overview and key ideas

The t-test asks whether the difference between two group means is larger than
would be expected from sampling variability alone. The test statistic
t = (difference in means) / (standard error of that difference) follows
Student's t distribution with a suitable number of degrees of freedom under
the null hypothesis of no true difference.

Two situations call for two versions:

- **Independent (two-sample) t-test** — the two groups come from separate
  subjects, e.g. a drug arm versus a placebo arm. The variability of each
  group is estimated from its own data, and the difference is compared
  against a combined standard error (classical Student) or an
  uncombined one (Welch's t-test).
- **Paired (matched) t-test** — each subject contributes two measurements,
  e.g. systolic blood pressure before and after treatment, or the two eyes of
  the same patient. The analysis is a one-sample t-test on the n
  within-subject differences, which removes between-subject variability and
  usually gives much more power.

The choice between the two is a design question: does a pairing exist in the
data or not? A paired test on unrelated groups, or an independent test on
clearly paired data, wastes information or misstates the uncertainty.

## When to use it

| Setting | Example question |
| --- | --- |
| Randomised trial, two arms | Does drug A lower systolic BP more than standard care after 12 weeks? |
| Before-and-after study | Does a 4-week exercise programme reduce fasting glucose within the same patients? |
| Matched controls | Does a biomarker differ between cases and age-, sex- and site-matched controls? |
| Contralateral comparison | Is function better in the treated limb than in the untreated limb of the same patient? |

Use the independent version when the groups contain different people, and the
paired version when each subject or matched set produces both measurements.
If treatment was assigned by cluster or several observations come from each
cluster, account for that dependence with a cluster-level analysis or an
appropriate model; a plain t-test on individuals is not enough. If you have
more than two groups, use one-way ANOVA instead of a series of t-tests.

## Assumptions and limitations

- **Independence** — observations within and between groups are independent;
  this is violated by clustered sampling (several patients from the same
  clinic, family members) or by analysing repeated measurements as if they
  were independent.
- **Normality and influential observations** — with small samples, strong
  skewness or influential outliers can make t-based inference unreliable;
  sample size alone does not determine a safe cutoff. For the paired test it
  is the *within-pair differences* that should be plausibly normal. Inspect
  plots and the study design; for larger samples, the sampling distribution
  of the mean is often less sensitive to moderate non-normality, but extreme
  tails and dependence still matter.
- **Equal variances** — the classical Student two-sample t-test assumes equal
  group variances. Welch's t-test, which does not, is the safer default in
  most software and is preferred unless you have a good reason otherwise.
- **Small-sample fragility** — with very small n the p-value can be carried
  by a single outlier; always report the data (means, SDs, ideally a plot)
  alongside the test.

Neither test estimates more than a difference in mean locations: if the two
distributions differ in shape rather than level, the mean difference may not
summarise what you care about.

## Worked example

**Paired example.** In 8 patients with hypertension, diastolic BP (mmHg) was
measured before and after 8 weeks of a new beta-blocker. The within-patient
differences (before − after) were: 4, 6, 5, 8, 7, 6, 9, 3.

- Mean difference d-bar = 6.0 mmHg; SD of the differences s_d = 2.0
- SE = s_d / sqrt(n) = 2.0 / sqrt(8) = 0.71
- t = 6.0 / 0.71 = 8.5 on 7 degrees of freedom, two-sided p < 0.001
- 95% CI for the mean difference: 6.0 ± 2.365 × 0.71 = (4.3, 7.7) mmHg

The treatment lowered diastolic BP by about 6 mmHg on average (95% CI 4.3 to
7.7), a highly significant reduction. Note that the analysis uses only the 8
differences — the before and after values are never compared as two separate
groups, which would have been wrong.

**Independent example.** In a separate parallel-group trial, 8 patients per
arm have individual BP reductions with mean 6.0 mmHg (SD 2.0) on the new drug
and 1.5 mmHg (SD 2.2) on placebo. These are SDs of individual changes within
each independent arm; the SD 2.0 above was calculated from paired changes in
the separate before-and-after example and is not automatically transferable.
Welch's standard error is sqrt(2.0²/8 + 2.2²/8) = 1.05 mmHg, so
t = (6.0 − 1.5)/1.05 = 4.28 with approximately 13.8 degrees of freedom
(two-sided p ≈ 0.0008). Using the corresponding t critical value (about 2.15),
the 95% CI for the difference in mean reductions is about 2.24 to 6.76 mmHg.
This comparison supports a larger average reduction on the drug in this
illustrative sample; it is a different estimand and design from the paired
within-arm test above.

## Interpretation and common pitfalls

- **Pairing is a design feature, not an analysis choice.** If you measured
  the same people twice, use the paired test; choosing the independent test
  because it "gave a cleaner result" is wrong and usually underpowered.
- **Significance is not equivalence.** A non-significant t-test means you
  could not detect a difference, not that the true difference is zero —
  report the confidence interval and consider the study's power.
- **Do not run several t-tests for 3+ groups.** Comparing three arms
  pairwise inflates the family-wise type I error; use one-way ANOVA (or
  pre-planned contrasts) instead.
- **Check the assumptions before trusting small-sample p-values.** A single
  extreme outlier can carry the whole result; look at the data, not just the
  test output.

## Derivation and choice of standard error

For two independent means, the observed difference is
\(\bar Y_1-\bar Y_0\). Under independent sampling,
\(Var(\bar Y_1-\bar Y_0)=\sigma_1^2/n_1+\sigma_0^2/n_0\); replacing
unknown variances by sample variances gives the Welch standard error
\(\sqrt{s_1^2/n_1+s_0^2/n_0}\). Welch–Satterthwaite degrees of freedom
approximate the distribution of that studentized difference:

\[
\nu=\frac{(s_1^2/n_1+s_0^2/n_0)^2}
{(s_1^2/n_1)^2/(n_1-1)+(s_0^2/n_0)^2/(n_0-1)}.
\]

The pooled Student t test instead assumes a common population variance and
uses a pooled variance estimate with \(n_1+n_0-2\) degrees of freedom.
When that equal-variance assumption holds, pooling can be slightly more
efficient. When it fails and sample sizes differ, the pooled test can have
poor type-I error control; the Welch test is therefore a sensible default.
It does not require equal variances and loses little when variances are
equal. It still assumes independent observations and an approximately
normal sampling distribution of the mean difference (or enough data for a
useful approximation).

For paired measurements, first calculate each within-person difference
\(D_i=Y_{i,post}-Y_{i,pre}\). The paired t statistic is
\(\bar D/(s_D/\sqrt n)\). Pairing can improve precision because stable
between-person differences cancel. If pre and post SDs are both 10 and
their correlation is 0.8, the SD of the difference is
\(\sqrt{10^2+10^2-2(0.8)(10)(10)}=6.32\), not 14.14 as it would be for
independent measurements. But pairing helps only when pairs are correctly
matched and the analysis retains the randomized or sampled unit. An
unpaired analysis of paired measurements wastes information; treating
paired observations as independent underestimates or mischaracterizes
uncertainty.

## Worked example with unequal variability

Suppose an intervention arm has n=24, mean change −5.2, SD 8.0, and a
control arm has n=18, mean change −1.0, SD 4.0 (negative change is
improvement). The estimated treatment-minus-control contrast is −4.2.
Welch SE is \(\sqrt{64/24+16/18}=1.89\). The Welch degrees of freedom are
approximately 35.5, so the 95% interval is roughly
\(-4.2\pm2.03(1.89)=[-8.03,-0.37]\). This estimates a larger average
reduction in the treatment arm, while remaining compatible with an effect
as small as about half a unit. The clinical meaning depends on the outcome
scale and its minimally important difference; p<0.05 alone does not answer
that question.

```r
treated <- c(-8, -6, -4, -7, 1, -9, -3, -5, -4, -2,
             -6, -8, 0, -5, -7, -4, -10, -1, -6, -3,
             -5, 2, -9, -4)
control <- c(-3, 1, -2, 0, -5, 2, -1, -4, 3,
             -2, 1, -3, 0, -6, 2, -1, -2, 1)
t.test(treated, control, var.equal = FALSE)
```

For paired data, use `t.test(post, pre, paired = TRUE)` only when vectors
are in matched order and have no unmatched observations. A safer workflow
keeps an explicit participant identifier and checks one record per person
per occasion before reshaping. Missing one of a pair removes that person's
contribution from a paired test; if missingness relates to outcome or
treatment, the complete-pair estimate may be biased. A longitudinal model
can use partial records under a stated missing-data assumption, but does
not make informative dropout ignorable automatically.

## Diagnostics, robustness, and design

## Confidence intervals, effect size, and planning

The mean difference and its confidence interval are usually more useful
than the t statistic alone. A 95% interval for independent means is
\((\bar x_1-\bar x_0)\pm t_{.975,\nu}\,SE\), using Welch degrees of
freedom when variances are not assumed equal. Its units match the outcome.
Standardized mean difference can facilitate meta-analysis across different
scales, but depends on which SD is used and should not replace a raw-unit
effect when that scale is clinically meaningful. Cohen's d is the mean
difference divided by a pooled SD; Hedges' g applies a small-sample
correction. Conventional small/medium/large labels are not clinical
thresholds.

For paired data, report the mean within-person change and its CI, plus the
SD of individual changes. A CI for the mean change describes uncertainty
about the average, not the range of individual responses. If the clinical
question is how many patients improve by a minimally important amount,
report a responder proportion and compare that endpoint separately with
appropriate multiplicity handling. Dichotomizing a continuous outcome
usually loses information, so retain the continuous analysis as primary
unless the responder definition is clinically established.

For equal-size groups with common SD, sample size for a two-sided test is
approximately
\(n_{arm}=2(z_{1-\alpha/2}+z_{1-\beta})^2\sigma^2/\delta^2\). At alpha .05,
80% power, SD 15, and target difference 5, this yields about 142 per arm.
If the target difference is 3 instead, required n is multiplied by
\((5/3)^2\), to about 393 per arm. Small studies should not be planned
around overly optimistic effects; show sensitivity to plausible SDs,
attrition, allocation ratio, clustering, and multiple primary contrasts.

```r
sigma <- 15; delta <- 5; alpha <- .05; power <- .80
n <- 2 * (qnorm(1 - alpha / 2) + qnorm(power))^2 *
  sigma^2 / delta^2
ceiling(n) # approximate number per arm
```

This normal approximation is for simple independent groups. Use exact
noncentral-t calculations or design software for protocol sample size,
especially with small samples, unequal allocation, cluster randomization,
or covariate adjustment. ANCOVA can reduce residual variance when baseline
outcome predicts follow-up, but the sample-size calculation should reflect
that anticipated correlation and the actual primary estimand.

Inspect distributions and the raw data, not only a normality-test p-value.
For independent groups, examine group-specific histograms or Q–Q plots and
the distribution of residuals. The t procedure is often robust to moderate
skew with balanced groups, but small samples with extreme outliers can be
highly sensitive. Variance inequality combined with severe imbalance is a
particular concern for the pooled test. Welch addresses unequal variance
but not dependence, outliers, or a poor estimand. If an outcome is strongly
skewed, a log-scale analysis estimates a contrast in mean log outcome
(often a ratio of geometric means), not a raw-unit mean difference. A
permutation procedure can be useful when randomization supports exchangeable
labels, but it tests a sharp null of no individual treatment effect under
the randomization scheme; it is not automatically a test of equality of
population means under every alternative.

The unit of analysis must match the design. For cluster-randomized studies,
patients within a clinic are correlated; a simple t test treating all
patients as independent yields an artificially small standard error. Use
cluster-level summaries or a model with cluster-robust inference and enough
clusters. In crossover trials, period and carryover effects may matter;
the paired t test of raw outcomes is valid only under an appropriate
design and estimand. For matched case-control pairs, analyze within-pair
differences or use a conditional model appropriate to the endpoint.

## Reporting

## Paired example: how correlation changes uncertainty

Suppose 20 patients have systolic pressure measured before and after
treatment. Let mean within-person reduction be 6 mmHg and SD of paired
differences be 10. The SE is \(10/\sqrt{20}=2.24\); with 19 degrees of
freedom, a 95% interval is about \(6\pm2.09(2.24)=[1.3,10.7]\) mmHg.
This paired interval uses the variability of change, not separate baseline
and follow-up SDs. In a separate scenario with marginal SDs both 12 and
pre-post correlation 0.75, the SD of the difference is
\(\sqrt{12^2+12^2-2(0.75)(12)(12)}=8.49\), giving SE≈1.90 for n=20.
The SD of paired differences is the sufficient variance summary for the
paired t calculation; reconstruct it from marginal SDs only when the
within-person correlation is also known.

The following synthetic vectors illustrate the paired call; their output
is not intended to reproduce the preceding summary calculation.

```r
before <- c(148, 162, 155, 171, 139, 158, 166, 151, 144, 160,
            173, 149, 156, 168, 142, 164, 153, 159, 147, 170)
after <- c(141, 155, 147, 165, 134, 151, 160, 145, 139, 152,
           166, 144, 150, 160, 138, 157, 147, 151, 142, 163)
t.test(before, after, paired = TRUE)
```

Here the contrast is before minus after, so positive values indicate a
reduction. The R output estimates the mean paired difference and its t
interval. Report the pairing unit and number of complete pairs; do not
call the standard deviation of differences an SE.

## Sensitivity and robust summaries

## A note on baseline adjustment in randomized trials

Report the measurement unit and clinically important difference beside
the estimate; standardized statistics alone make practical interpretation
difficult for clinicians and patients.

For an independent-groups t test, the nominal sample size is the number
of independent participants, not the number of repeated measurements or
laboratory replicates. Averaging technical replicates before analysis
avoids treating assay repeats as new patients. If outcomes are measured
within clinics or families, use an analysis that reflects that clustering.
Always show n by arm and explain exclusions; unequal missingness can
change both the precision and the population represented by the complete
case comparison.

For a continuous endpoint measured at baseline and follow-up, comparing
follow-up means with a Welch t test is unbiased under randomization but
may be less precise than analysis of covariance. ANCOVA models follow-up
as a function of treatment and baseline value; when baseline predicts
follow-up, residual variance falls and the treatment contrast gains
precision. Comparing change scores instead imposes a coefficient of one
on baseline in the outcome-change relationship, which may not be optimal.
The analysis plan should specify the primary method before outcomes are
seen and report adjusted mean difference with interval. Baseline-adjusted
analysis is not a license to adjust for post-randomization variables that
may mediate treatment effects.

When a few values are extreme, show a plot and consider whether they are
valid observations. A trimmed-mean or robust regression sensitivity
analysis can indicate whether the mean result depends on tail values, but
these target a different or modified estimand and should be labeled.
Winsorizing or deleting outliers after inspecting the outcome can bias
inference. A rank test may be useful for ordinal outcomes, but it does not
estimate the same raw mean difference. For log-normal outcomes, analyze
logs only if a multiplicative contrast is meaningful and present a
back-transformed ratio with a clear interpretation.

The t test is also not suitable for comparing multiple time points within
the same participants by repeatedly testing each visit. That approach
ignores correlation and multiplies type-I error. A repeated-measures or
mixed model can estimate the trajectory and planned contrasts jointly;
define time as categorical or continuous according to the expected pattern.
If only a single follow-up is primary, baseline-adjusted ANCOVA is often
more efficient than comparing change scores, especially when baseline
measurement predicts follow-up. The choice should follow the estimand and
protocol, not which test yields the smallest p-value.

Report group sample sizes, means and SDs (not just SEs), mean difference
with units and confidence interval, test statistic, degrees of freedom,
and exact p-value. State whether the comparison was paired and whether a
Welch or pooled variance method was used. Give the direction of subtraction
so a positive contrast is unambiguous. For clinical interpretation, compare
the interval with a clinically meaningful threshold and show baseline
values or changes as appropriate. Do not choose between t, Mann–Whitney,
or transformations by whichever produces a significant p-value; choose
based on the estimand and design, and explain the analysis plan.

## References and further reading

- Welch BL. [The generalization of Student's problem when several different population variances are involved](https://doi.org/10.1093/biomet/34.1-2.28). *Biometrika*. 1947;34(1–2):28–35.
- Altman DG, Machin D, Bryant TN, Gardner MJ, eds. *Statistics with Confidence*. 2nd ed. BMJ Books, 2000.
- Lang TA, Altman DG. [The SAMPL guidelines](https://www.equator-network.org/reporting-guidelines/sampl/), basic statistical reporting in biomedical journals.
