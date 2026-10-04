---
title: Chi-square test
summary: A test of association between two categorical variables, built from the difference between observed and expected cell counts.
---

## Overview and key ideas

The chi-square test of independence asks whether two categorical variables are
associated in a single population. It compares the counts you actually observed
in each cell of a contingency table with the counts you would expect if the two
variables were independent. Large discrepancies between observed and expected
counts push the test statistic up and lower the p-value.

The test statistic is

    chi-square = sum over cells of (observed - expected)^2 / expected

and is compared with a chi-square distribution whose degrees of freedom are
(rows - 1)(columns - 1). For a 2×2 table there is 1 degree of freedom, and the
chi-square statistic equals the square of a two-sided z-test for two
proportions.

## When to use it

The natural settings are cross-tabulations in which both variables are
categorical and the sample is a single group:

| Setting | Example question |
| --- | --- |
| Case-control study | Is smoking status associated with lung cancer among hospital patients? |
| Quality monitoring | Does the rate of a complication differ across three surgical teams? |
| Survey research | Is a self-reported health behaviour associated with income group? |
| Screening | Does test result (positive/negative) relate to true disease status? |

Use it when every expected cell count is reasonably large (commonly at least 5).

## Assumptions and limitations

- **Independence of observations** — each subject contributes to exactly one
  cell; clustered or repeated data violate this and inflate significance.
- **Expected counts** — the approximation is poor when any expected count is
  below 5, or when more than 20% of expected counts are below 5; prefer Fisher's
  exact test (for 2×2) or a simulation-based test.
- **Categorical, exhaustive categories** — overlapping or "other" buckets
  dilute the association.
- **It tests association, not direction or strength** — a significant result
  says the variables are related, not how strongly or in which direction; report
  a measure of effect such as the odds ratio or risk ratio alongside.

## Worked example

In a case-control study of 300 patients, 200 had lung cancer and 100 did not.
Among cases, 160 were smokers; among controls, 40 were smokers. The table is:

|  | Smoker | Non-smoker | Total |
| --- | --- | --- | --- |
| Cancer | 160 | 40 | 200 |
| No cancer | 40 | 60 | 100 |

If smoking and cancer were independent, the expected number of smokers among
cases would be (200 × 200) / 300 ≈ 133. The observed 160 is well above that. The
Pearson chi-square statistic is 48 on 1 degree of freedom, giving a p-value far
below 0.001 — strong evidence of an association. The odds ratio
(160×60)/(40×40) = 6.0 quantifies it: cases had about six times the odds of
having smoked compared with controls.

## Interpretation and common pitfalls

- A significant chi-square in an observational study shows association, not
  cause — confounding (age, occupational exposure) can drive the relationship.
- Do not use the test when expected counts are small; the p-value becomes
  unreliable and anti-conservative.
- For 2×2 tables the test is equivalent to comparing two proportions — reporting
  the difference in proportions or an odds ratio is more informative than the
  chi-square value alone.
- Larger samples make trivial associations "significant"; pair the test with an
  effect size and a confidence interval.

## Calculation from a contingency table

For each cell in a table, independence implies expected count
\(E_{ij}=n_{i+}n_{+j}/N\). In the smoking example, 200 of 300 patients
are cases and 200 of 300 are smokers, so expected smoker cases are
\(200\times200/300=133.33\). Expected non-smoker cases are
\(200\times100/300=66.67\); the two expected control counts are 66.67 and
33.33. The Pearson statistic sums \((O-E)^2/E\) over all four cells,
giving approximately 48.0. With one degree of freedom, this is far into
the tail of the chi-square distribution (p<0.001). Because the case-control
sample fixes the numbers of cases and controls, the estimated odds ratio
can be interpreted as a case-control association; the table does not
identify population disease risk or a risk ratio.

```r
tab <- matrix(c(160, 40, 40, 60), nrow = 2, byrow = TRUE,
              dimnames = list(c("Cancer", "No cancer"),
                              c("Smoker", "Non-smoker")))
chisq.test(tab, correct = FALSE)
chisq.test(tab, correct = FALSE)$expected
```

For a 2×2 table, R's default applies Yates' continuity correction; setting
`correct = FALSE` reproduces the uncorrected Pearson statistic above.
Yates correction attempts to improve approximation for discrete counts but
can be conservative. State whether it was applied. In larger tables, the
usual Pearson test has no such correction by default.

## Degrees of freedom and model perspective

The independence model estimates row and column marginal probabilities but
no association parameters. The unrestricted table has one fewer free
parameter per cell after the total is fixed. Their difference in parameter
count gives \((r-1)(c-1)\) degrees of freedom. Equivalently, for a 2×2
table the null is an odds ratio of one. A likelihood-ratio statistic
\(G^2=2\sum O\log(O/E)\) uses the same asymptotic degrees of freedom and
often agrees with Pearson chi-square when counts are moderate. Both rely
on asymptotic approximations; neither removes confounding or sampling
bias.

The chi-square test is omnibus for an r×c table. If significant, inspect
standardized residuals or planned contrasts to understand which cells
contribute, but cellwise follow-up introduces multiplicity. Adjust those
comparisons or use a model with prespecified contrasts. Cramér's V
\(\sqrt{X^2/[N\min(r-1,c-1)]}\) summarizes association strength on a
0–1 scale, though the meaning depends on table dimensions and context.
For 2×2 tables, report risk difference or odds ratio with an interval
instead; the chi-square statistic alone is not an effect size.

## Sparse cells and alternatives

The common rule that expected counts should all be at least 5 is a
conservative heuristic, not a theorem. Approximation quality depends on
table shape, sparsity, and the inferential target. A frequently cited
guideline allows no expected count below 1 and no more than 20% below 5;
for a 2×2 table, Fisher's exact test or an exact unconditional method is
often preferable when counts are sparse. For larger tables, a Monte Carlo
conditional p-value can approximate the exact conditional distribution.
Combine categories only when substantively defensible and preferably
planned before examining results; arbitrary collapsing changes the
question and can conceal clinically meaningful distinctions.

```r
# Monte Carlo p-value for a sparse larger table
chisq.test(tab, simulate.p.value = TRUE, B = 100000)
```

Monte Carlo error depends on the number of simulations; with B=100,000,
the standard error of an estimated tail probability p is approximately
\(\sqrt{p(1-p)/B}\). A simulated p-value near 0.05 should be rerun with
more replicates if a decision depends on a narrow threshold. Set a seed
for reproducibility. Do not report the simulation count as if it were the
sample size; B describes numerical approximation, while N is the study
sample.

## Dependence, survey designs, and interpretation

## Effect measures and confidence intervals

The Pearson statistic grows with both sample size and association strength,
so it is not itself a measure of practical importance. For a 2×2 table,
report the odds ratio with a confidence interval and, when the design
supports it, risks and risk difference. In a cohort or randomized trial,
the risk ratio and difference are directly interpretable at a stated
follow-up horizon. In a case-control sample, the numbers of cases and
controls are fixed by design, so the table's row proportions do not
estimate population disease risk; the odds ratio is the usual estimable
association measure.

For the smoking table, the odds ratio is
\((160\times60)/(40\times40)=6.0\). Its large magnitude corresponds to
strong evidence of association in the sampled case-control population,
but the interval remains important. The standard error of log OR for an
unadjusted 2×2 table is approximately
\(\sqrt{1/160+1/40+1/40+1/60}=0.270\). Thus the log-scale 95% interval
is \(\log(6)\pm1.96(0.270)\), which exponentiates to approximately 3.5
to 10.2. This is a wide range despite the strong p-value and does not
adjust for age or occupational exposure.

For an r×c table, Cramér's V summarizes association magnitude, but its
maximum interpretation depends on table dimensions and it may be biased
upward in small samples. A standardized residual for cell (i,j) compares
observed and expected counts; adjusted residuals can identify which cells
drive an omnibus result, but scanning many cells is a multiple-testing
problem. Present observed and expected counts rather than only a color
heatmap or residual plot.

## Sampling and causal interpretation

## Worked 2×2 effect interval and interpretation

For a table \(\begin{smallmatrix}a&b\\c&d\end{smallmatrix}\), the
unadjusted odds ratio is \(ad/(bc)\). Under the large-sample log-Wald
approximation, \(SE[\log(OR)]=\sqrt{1/a+1/b+1/c+1/d}\), and a 95% interval
is the exponentiated log estimate plus or minus 1.96 SE. In the smoking
table, OR=6 and SE≈0.270, yielding an interval around 3.5 to 10.2. The
approximation is unsuitable when cells are sparse or zero; use exact or
profile-likelihood intervals in those cases. Even this interval is an
unadjusted association and may be confounded.

For a cohort table, relative risk is
\([a/(a+b)]/[c/(c+d)]\) if rows represent exposure groups and columns
outcomes; risk difference is the subtraction of those row risks. These
effect measures can be more intuitive than an OR when outcomes are common.
For randomized trials, give both arms' denominators and event risks so
absolute benefit can be assessed. For case-control sampling, do not
mistake the sampled case fraction among exposed for disease risk.

## Practical decisions for sparse and large tables

Before analysis, define whether categories are mutually exclusive and
exhaustive. A participant should not appear in multiple cells unless the
model accounts for repeated or multi-response data. A “not measured” or
“unknown” category may represent missingness rather than a substantive
level; including it in the table can create an association driven by the
measurement process. Report missing counts separately and use an
appropriate missing-data strategy when missingness is informative.

If one or more expected counts are small, first inspect whether the table
is sparse because categories are rare or because the sample is small.
For 2×2, Fisher's exact test conditions on margins. For larger R×C tables,
Fisher–Freeman–Halton exact inference is available but can be expensive;
Monte Carlo conditional tests approximate its p-value. A simulated
Pearson chi-square is another approximation. Barnard and Boschloo tests
are unconditional 2×2 methods and should not be described as general
R×C solutions. State which null distribution was used.

In a large table, an omnibus p-value may be tiny while Cramér's V is
small. For example, with N=10,000, even a modest deviation from
independence can yield a large chi-square statistic. Report the statistic
and effect size together, and show adjusted residuals only as exploratory
cell diagnostics unless a multiplicity procedure protects the selected
cells. In ordered categories, a linear-by-linear association or ordinal
model may gain power by using the order, but scores and trend assumptions
must be defensible.

The chi-square test assumes a sampling structure that makes the table
counts follow a multinomial or product-multinomial model. In a randomized
trial with fixed arm sizes, the test of equal response proportions has a
closely related two-sample binomial interpretation. In case-control
sampling, conditioning on outcome totals supports inference on the odds
ratio. In cross-sectional surveys with unequal selection probabilities,
ordinary chi-square ignores weights and clustering and can produce both
biased estimates and incorrect precision; survey-weighted tests use
design-adjusted degrees of freedom.

Association is not causation. Stratified tables can reveal confounding or
effect heterogeneity, including Simpson's paradox, where a marginal
association differs from stratum-specific associations because group
composition varies. A Mantel–Haenszel estimate or logistic regression can
adjust for measured covariates under assumptions, but neither addresses
unmeasured confounding automatically. If a significant association is
reported, give plausible alternative explanations and distinguish the
descriptive table result from a causal claim.

## Reporting checklist for the analysis

## Power, sample size, and sparse-data planning

For a 2×2 comparison of proportions, chi-square power depends on both
proportions, allocation, alpha, and total sample size. A target odds ratio
does not fix power without a baseline risk: the same odds ratio yields
different risk differences at different baseline prevalences. For a
multi-category association, planning can use a prespecified table of
expected proportions under the alternative and a noncentral chi-square
distribution, but small expected cells call for simulation under the
actual design. Multiple planned comparisons, cluster sampling, and survey
weights alter the effective information and should be represented in
planning rather than corrected after data collection.

The Pearson test's degrees of freedom increase with table dimensions. A
large table can have low power for a localized pattern if many categories
are sparse, while collapsing categories may obscure a meaningful trend.
If ordered categories are present, a trend test or ordinal regression can
use their ordering and may answer a more focused question. The categories
must represent a genuine scale; arbitrary numeric scores imply spacing
that may not exist.

## Log-linear models and adjusted association

A log-linear model represents expected cell counts through log-linear
terms. For a two-way table, the independence model includes row and column
main effects but no interaction; adding the interaction corresponds to
association. For three-way tables, conditional independence can be tested
by comparing hierarchical models, revealing whether a two-way association
persists after stratifying on a third variable. This is a principled way
to distinguish marginal from conditional association, though sparse cells
can cause unstable estimates and require combining scientifically
defensible categories or penalization.

```r
tab3 <- array(c(12, 18, 22, 28, 25, 15, 35, 25),
              dim = c(2, 2, 2),
              dimnames = list(exposure = c("No", "Yes"),
                              outcome = c("No", "Yes"),
                              age = c("Younger", "Older")))
fit_ind <- loglin(tab3, list(c(1, 3), c(2, 3)), fit = TRUE)
fit_sat <- loglin(tab3, list(c(1, 2, 3)), fit = TRUE)
```

This is a schematic log-linear model comparison: `loglin` terms denote
interactions among dimensions, and the exact model should be written to
match the conditional-independence question. For applied regression with
individual-level covariates, logistic regression estimates adjusted
associations and supports interactions; categorical table tests alone
cannot adjust continuously for age or account for multiple confounders.

## Communicating percentages without denominator errors

When cells represent counts of events over different person-time rather
than one classification per participant, a contingency-table chi-square
test discards exposure duration. Use a rate model with a log person-time
offset, such as Poisson or negative-binomial regression, to compare
incidence rates and account for covariates or overdispersion.

When there are structural zeros—cells impossible by design, such as a
procedure not offered to one age group—the usual independence model is not
appropriate because it assigns probability to impossible combinations.
Exclude or model structural cells according to the sampling mechanism;
do not interpret their zero expected counts as evidence against
independence. Distinguish structural zeros from sampling zeros, which are
possible cells that happen to be unobserved and may require exact or
penalized methods.

Always identify whether percentages are rowwise or columnwise. In a
case-control table with cases and controls in rows, row percentages show
smoking prevalence within case status; column percentages show the
fraction of cases among smokers. Because case-control sampling fixes the
case/control totals, column percentages cannot estimate population disease
risk. In a cohort table with exposure in rows and outcome in columns,
row percentages estimate outcome risks if follow-up and sampling support
that interpretation. Include both counts and percentages so the
denominator is visible.

Give the exact contingency table with category definitions, total N,
denominator for percentages, chi-square statistic, degrees of freedom,
and p-value. State Pearson, likelihood-ratio, continuity-corrected, exact,
or simulated inference as applicable, including Monte Carlo replicate
count. Add an effect size and interval. For sparse data, report why an
exact or simulation method was selected; for complex sampling, identify
the design-based procedure. This enables readers to distinguish strong
statistical evidence from a large but possibly unimportant association.

Each participant must contribute once to a conventional table. Repeated
visits, matched pairs, household clusters, or multiple lesions per patient
violate the independent multinomial sampling model. For paired binary
outcomes use McNemar's test; for clustered categorical outcomes use a
GEE, mixed model, or design-based method. In a complex survey, account for
weights, strata, and primary sampling units using survey-adjusted tests.
Treating a weighted table as if its cell counts were independent raw
counts does not produce valid standard errors.

A statistically significant association does not state which variable
causes the other, nor whether the relationship is clinically important.
In an observational table, age, disease severity, or selection into the
sample can generate or distort the association. Report cell counts and
row/column denominators, an effect estimate with interval, and the sampling
design. Distinguish row percentages (risk within exposure group) from
column percentages (exposure composition among outcomes); switching them
can reverse the substantive interpretation.

## References and further reading

- Agresti A. *An Introduction to Categorical Data Analysis*. 3rd ed. Wiley, 2018.
- Lang TA, Altman DG. [The SAMPL guidelines](https://www.equator-network.org/reporting-guidelines/sampl/), statistical reporting guidance.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis
  and Other Advanced Topics*. Brooks/Cole.
- The [Fisher's exact test article](/biostatistics-library/comparisons/fishers-exact-test.html) covers inference for sparse 2×2 tables.
