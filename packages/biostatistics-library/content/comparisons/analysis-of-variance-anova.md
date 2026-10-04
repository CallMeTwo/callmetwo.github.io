---
title: Analysis of variance (ANOVA)
summary: Comparing the means of three or more groups with a single F-test, then locating which pairs differ.
---

## Overview and key ideas

When you want to compare the means of three or more groups, a string of
pairwise t-tests inflates the type I error rate (three comparisons at 5% each
give about a 14% chance of at least one false positive). One-way analysis of
variance (ANOVA) makes a single omnibus test of whether all group means are
equal by partitioning the total variation into two components:

- **Between-group variation** — how far each group mean lies from the overall
  mean, summarised by MS_between = SSB / (k − 1).
- **Within-group variation** — the scatter of individuals around their group
  mean, summarised by MS_within = SSW / (N − k).

Under the null hypothesis that all k group means are equal, the ratio
F = MS_between / MS_within follows an F distribution with (k − 1, N − k)
degrees of freedom. A large F means the group means are more spread out than
can be explained by the within-group scatter alone. If the omnibus test is
significant, a post-hoc procedure (e.g. Tukey's HSD) identifies which pairs
of groups differ while controlling the family-wise error rate.

ANOVA is not a different kind of question from the t-test: for exactly two
groups it is algebraically equivalent (F = t²). It extends the same logic to
k groups, and to two-way designs (e.g. treatment × sex) that add main effects
and an interaction term.

## When to use it

| Setting | Example question |
| --- | --- |
| Multi-arm clinical trial | Do three glucose-lowering strategies produce different HbA1c at 12 months? |
| Dose-response study | Does the outcome differ across four dose levels of the same drug? |
| Two-way design | Do readmission rates differ by hospital and by patient age group, and do they interact? |
| Quality improvement | Are length-of-stay distributions equivalent across four surgical units? |

Use one-way ANOVA for one factor with three or more independent groups. Use
two-way ANOVA when you want to model two factors and their interaction
simultaneously. For non-normal or ordinal outcomes use the Kruskal–Wallis
test instead; for repeated measurements within subjects use
repeated-measures ANOVA.

## Assumptions and limitations

- **Independence** — each subject contributes exactly one observation.
  Repeated measures, matched groups, or clustering violate this and need
  repeated-measures ANOVA, mixed models, or cluster-robust methods.
- **Approximate normality within groups** — the F-test is reasonably robust
  for moderate sample sizes; with small or heavily skewed groups, extreme
  outliers can distort the result. Check group boxplots or Q–Q plots.
- **Homogeneity of variances** — the groups should have similar variances.
  With roughly equal group sizes the F-test tolerates mild
  heteroscedasticity; with very unequal n and unequal variances, Welch's
  ANOVA is the safer default. Levene's test screens for variance
  differences.
- **Fixed vs random effects** — the classical one-way ANOVA treats group
  membership as fixed (you care about exactly these k groups). If the groups
  are a random sample from a larger population, a random-effects model
  changes both the hypothesis and the test.

The test tells you only that *some* means differ, not which ones or by how
much — plan your post-hoc comparisons before looking at the data.

## Worked example

A 12-month trial randomised 30 type 2 diabetes patients to three
glucose-lowering strategies (n = 10 per arm). Mean HbA1c at 12 months was
7.0% (standard care), 6.5% (drug A) and 6.0% (drug B), with each group's SD
about 0.7.

- SSB = 10[(7.0 − 6.5)² + (6.5 − 6.5)² + (6.0 − 6.5)²] = 5.0, so
  MS_between = 5.0 / 2 = 2.5
- SSW = 27 × 0.7² = 13.23, so MS_within = 13.23 / 27 = 0.49
- F(2, 27) = 2.5 / 0.49 = 5.1, p ≈ 0.013

The three strategies do not all give the same mean HbA1c. Tukey's HSD (with
a critical difference of about 0.78%) separates standard care from drug B
(1.0% apart, significant) but not the other pairs: drug A and drug B (0.5%
apart) are not distinguishable at this sample size. Report all three group
means with 95% CIs, not just the F statistic.

## Interpretation and common pitfalls

- **A significant ANOVA is not the end of the analysis.** It only says at
  least one mean differs; without post-hoc comparisons you cannot say which.
- **Do not "test down" with unadjusted pairwise t-tests.** Running all
  pairwise t-tests after a significant ANOVA inflates the type I error; use
  Tukey, Dunnett (versus a single control), or pre-planned contrasts.
- **Unequal group sizes are a risk factor.** Very unequal n combined with
  unequal variances can make the F-test anti-conservative or
  over-conservative — check Levene's test and consider Welch's ANOVA.
- **ANOVA compares means, not variances.** If the groups differ mainly in
  spread rather than location, the F-test can mislead; inspect the
  distributions before interpreting.

## Model formulation and sums of squares

One-way ANOVA is the ordinary linear model
\(Y_{ij}=\mu+\tau_j+\epsilon_{ij}\), with a constraint such as
\(\sum_j\tau_j=0\) to identify the parameters. Its F test compares a
model with group-specific means against an intercept-only model. The total
sum of squares decomposes as \(SST=SSB+SSW\):

- \(SSB=\sum_j n_j(\bar Y_j-\bar Y)^2\) measures variation among group
  means, weighted by group size.
- \(SSW=\sum_j\sum_i(Y_{ij}-\bar Y_j)^2\) measures residual variation
  within groups.
- Dividing by degrees of freedom gives mean squares; their ratio is the
  F statistic. Under the equal-mean null and model assumptions, the ratio
  follows \(F_{k-1,N-k}\).

The omnibus test has no direction and does not quantify how different the
means are. A small p-value means at least one mean differs under the
model, but it does not establish that every pair differs. Report an effect
measure such as eta-squared \(SSB/SST\) or omega-squared, along with
pairwise estimates and intervals. Eta-squared is upward biased in small
samples; omega-squared applies a correction and can be slightly negative
as an unbiased estimator, in which case it is often reported as zero with
the untruncated estimate available.

## Worked calculation and R implementation

Use the existing illustration of three groups with n=10 each, means
7.0, 6.5, and 6.0, and common SD 0.7. The grand mean is 6.5. Thus
\(SSB=10[(0.5)^2+0^2+(-0.5)^2]=5.0\), and with within-group variance
\(0.49\), \(SSW=27(0.49)=13.23\). The residual mean square is
\(13.23/27=0.49\); the between-group mean square is 2.5; hence
\(F=2.5/0.49=5.10\) with 2 and 27 degrees of freedom. The associated
p-value is approximately 0.013. The sample eta-squared is
\(5/(5+13.23)=0.274\), indicating that about 27% of observed sample
variation is between these groups; it is not a causal or population
variance decomposition without further assumptions.

```r
dat <- data.frame(
  hba1c = c(7.0, 6.5, 6.0),
  arm = factor(c("standard", "drug_A", "drug_B")),
  n = c(10, 10, 10), sd = c(.7, .7, .7)
)
# Reconstructing only the ANOVA summary quantities:
grand <- weighted.mean(dat$hba1c, dat$n)
ss_between <- sum(dat$n * (dat$hba1c - grand)^2)
ss_within <- sum((dat$n - 1) * dat$sd^2)
Fstat <- (ss_between / (nrow(dat) - 1)) /
  (ss_within / (sum(dat$n) - nrow(dat)))
c(F = Fstat, p = pf(Fstat, 2, 27, lower.tail = FALSE),
  eta2 = ss_between / (ss_between + ss_within))
```

These are summary statistics, not patient-level observations, so they
cannot support diagnostics or post-hoc calculations that need the actual
within-arm values. With individual-level data, fit `aov(hba1c ~ arm,
data = trial)` and examine residuals. Tukey intervals from `TukeyHSD()`
protect the family of all pairwise comparisons under the equal-variance
model; Dunnett contrasts are preferable when every active arm is compared
only with a common control.

## Assumption assessment and robust alternatives

Independence is mainly secured by design, not by a residual plot. Check
whether participants were randomized or sampled independently and whether
multiple observations per person, household, clinic, or provider exist.
If clustering is present, a standard ANOVA treats correlated observations
as independent and understates uncertainty. Use mixed models, generalized
estimating equations, cluster-level summaries, or cluster-robust inference
appropriate to the design.

Normality concerns the within-group errors (equivalently residuals), not
the pooled raw outcome across all groups. With balanced groups and moderate
sample sizes, the F test is reasonably robust to moderate departures, but
heavy tails and outliers can dominate the mean and sum of squares. Inspect
Q–Q plots and residual-versus-fitted plots, alongside raw data plots. A
formal Shapiro–Wilk test can reject tiny harmless deviations in large data
or miss important departures in small samples; it should not be used as an
automatic switch between ANOVA and a rank test.

Homogeneous variance matters most when group sizes are unequal. Levene or
Brown–Forsythe tests can screen variance differences, but selecting the
final procedure solely from a preliminary variance-test p-value creates a
two-stage analysis whose properties are not the nominal ones. Welch's
one-way test directly compares means without assuming equal variances and
is often a good choice when heteroscedasticity is plausible. Games–Howell
comparisons can follow Welch ANOVA. Kruskal–Wallis is not a universal
heteroscedastic alternative: it tests rank distributions and can respond
to shape or spread differences, not only median differences.

## Factorial, repeated-measures, and covariate-adjusted ANOVA

## Planned contrasts and multiplicity strategy

An omnibus ANOVA should be paired with a prespecified follow-up strategy.
If a new drug is compared with standard care and a second active drug is
also studied, the key questions may be two active-versus-control contrasts,
not every pair. Dunnett adjustment uses the shared-control correlation and
usually provides more power than Tukey over all pairs. If the scientific
hypothesis is that higher doses improve an outcome monotonically, a
planned linear trend contrast can be more focused than an omnibus test,
but it can miss a nonmonotone response. The contrast coefficients should
sum to zero and be chosen before seeing the group means.

For the three-arm HbA1c example, an active-treatment average versus
standard care contrast has weights \((-1,0.5,0.5)\) if the group ordering
is standard, drug A, drug B. Its estimate is
\(-7.0+0.5(6.5)+0.5(6.0)=-0.75\) percentage points. With equal n=10 and
pooled residual variance 0.49, its SE is
\(\sqrt{0.49(1/10+0.25/10+0.25/10)}=0.271\). This planned average
contrasts both active arms with control, but assumes that averaging them
is scientifically meaningful. It does not show that each active agent is
effective individually.

```r
trial <- data.frame(
  hba1c = c(7.4, 6.8, 7.1, 6.9, 7.2, 6.7, 7.3, 6.6, 7.0, 7.0,
            6.9, 6.4, 6.7, 6.5, 6.2, 6.8, 6.1, 6.6, 6.3, 6.5,
            6.2, 5.8, 6.1, 5.9, 6.3, 5.7, 6.0, 5.8, 6.2, 6.0),
  arm = factor(rep(c("standard", "drug_A", "drug_B"), each = 10),
               levels = c("standard", "drug_A", "drug_B")))
fit <- aov(hba1c ~ arm, data = trial)
summary(fit)
```

The raw toy measurements need not reproduce the summary-statistic example
exactly; they illustrate fitting the model to individual data. In a real
analysis, estimate the planned contrast and its interval from the fitted
model, then apply the prespecified multiplicity procedure if it belongs
to a family of confirmatory tests. Avoid interpreting a significant
omnibus F as permission to explore every pair at unadjusted alpha.

## Assumption checks with scientific judgment

Residual diagnostics should be read alongside the design and outcome
process. A single extreme length-of-stay observation may be a data error,
a genuine medically complex patient, or a distinct population; deletion
should not be automatic. Compare conclusions under robust or transformed
models when influential observations materially change results, and report
the estimand for each. A log transformation changes the target from an
arithmetic mean difference in original units toward differences in log
means or geometric means. Back-transformed group means are not generally
the arithmetic means.

Levene's test is itself sensitive to nonnormality and has limited power in
small samples. A nonsignificant test does not prove equal variances.
Welch ANOVA avoids requiring equal variances, while robust standard errors
or bootstrap methods can provide alternatives under suitable sample sizes.
If group sample sizes are very unequal, inspect both variance and outcome
shape carefully. A rank-based alternative changes the estimand and should
not be selected as a mechanical consequence of a diagnostic p-value.

## Reporting and clinical meaning

## Sample size and precision for multiple means

ANOVA power depends on the number of groups, allocation, residual SD, and
the configuration of true means. A standardized omnibus effect is
\(f=\sqrt{\sum_jp_j(\mu_j-\mu)^2}/\sigma\), where pj is the fraction
assigned to group j. Cohen's conventional f labels are rough heuristics,
not clinical criteria. Power is computed from a noncentral F distribution
with noncentrality parameter related to total N and f; an omnibus design
can be powered while specific pairwise contrasts remain imprecise. If a
particular treatment-control contrast is the decision target, size the
study for that contrast and account for multiplicity rather than relying
only on omnibus power.

With three equally allocated arms, two-sided pairwise comparisons after
Tukey adjustment require more information than a single prespecified
contrast. More groups also increase degrees of freedom and the number of
potential comparisons. A balanced design is often efficient when costs
and variances are similar; unequal allocation can be justified by shared
control arms, safety needs, or recruitment constraints, but reduces
precision for a fixed total sample size. Include attrition and any cluster
design effect and choose a target difference that would change clinical
decisions.

## Beyond one-way fixed-effects ANOVA

## Reading post-hoc intervals in the example

In the equal-size three-arm example, the standard error for a pairwise
difference is \(\sqrt{MSE(1/10+1/10)}=\sqrt{0.098}=0.313\). Tukey's
studentized-range critical value for three means and 27 residual degrees
of freedom is about 3.5. The Tukey HSD threshold is
\(q\sqrt{MSE/n}=3.5\sqrt{0.49/10}\approx0.78\), equivalently a
simultaneous pairwise t threshold of about \((q/\sqrt2)(0.313)\). Thus
the 1.0-point standard-care versus drug-B difference exceeds the
simultaneous threshold, while 0.5-point differences do not. The original
worked-example conclusion is correct; the common trap is multiplying the
studentized-range critical value by the pairwise SE without dividing by
\(\sqrt2\). The omnibus F can be significant even when some individual
pairs are not.

This illustrates why post-hoc arithmetic needs to use the actual
procedure. Do not transfer a standard error or critical value from one
method to another. Software output should be checked against the design,
and pairwise confidence intervals should be reported so the uncertainty
is visible rather than summarized by a binary significant/nonsignificant
label.

Random-effects ANOVA is appropriate when the levels of a factor are
sampled from a wider population and inference targets between-level
variance, such as variability across hospitals. Its variance components
answer a different question from fixed-effects contrasts among a specified
set of hospitals. Mixed models can include random intercepts and slopes,
but with very few clusters variance estimates are unstable and standard
asymptotics may fail. State which factors are fixed or random based on
the scientific sampling process rather than software defaults.

For bounded proportions or counts, Gaussian ANOVA may predict impossible
values and violate variance assumptions. Binomial or count regression
with an appropriate link models the outcome distribution directly.
Repeated measures and nested data likewise call for covariance models
rather than treating all measurements as independent. ANOVA is a useful
linear-model framework, not a universal test for any outcome with groups.

Present each group mean and SD, n, and a plot showing raw data where
possible. Report the omnibus F statistic with numerator and denominator
degrees of freedom, p-value, and an effect-size measure; then state the
planned contrasts with adjusted intervals. For repeated-measures designs,
identify the within-subject covariance method, sphericity correction if
used, and missing-data handling. In a trial, report baseline-adjusted
contrasts when planned and avoid separate within-group pre/post tests as
evidence of treatment efficacy. A significant difference can be small;
compare intervals with a clinically meaningful difference and explain
whether uncertainty remains compatible with benefit or harm.

Two-way ANOVA models two factors and their interaction. If treatment effect
differs by sex, the interaction term is the direct test of that effect
modification; significant main effects averaged over the other factor can
be misleading. In unbalanced designs, sequential (Type I) sums of squares
depend on term order, while Type II/III tests answer different conditional
questions. State the parameterization and contrasts, especially with
interactions. Estimated marginal means are often easier to communicate
than raw coefficients.

Repeated-measures ANOVA handles within-person measurements but classical
versions require assumptions about covariance, including sphericity when
there are more than two repeated levels. Greenhouse–Geisser corrections
adjust degrees of freedom when sphericity fails, while mixed-effects models
can represent flexible covariance and incomplete follow-up under a
missing-at-random assumption. ANCOVA adjusts a post-treatment continuous
outcome for baseline covariates; in a randomized trial, including baseline
outcome can improve precision. The model should include treatment and
baseline score, and the adjusted treatment contrast—not a set of within-arm
pre-post tests—answers the randomized comparison.

## References and further reading

- Lang TA, Altman DG. [The SAMPL guidelines](https://www.equator-network.org/reporting-guidelines/sampl/), guidance on reporting statistical analyses and estimates.
- Maxwell SE, Delaney HD, Kelley K. *Designing Experiments and Analyzing Data: A Model Comparison Perspective*. 3rd ed. Routledge, 2018.
- Chow S, Lu J, Jehessel M. *Design and Analysis of Clinical Trials*. Wiley.
- Bland J, Altman D. *Statistics with Confidence*. BMJ Books.
- The [multiple-testing article](/biostatistics-library/inference/multiple-testing.html) explains family-wise error control for post-hoc contrasts.
