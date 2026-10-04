---
title: Chi-square test
summary: A test of association between two categorical variables, built from the difference between observed and expected cell counts.
---

## Overview

Pearson’s chi-square test evaluates whether categorical variables are associated by comparing observed cell counts with counts expected under independence. It is a test of a table-level null hypothesis, not a measure of association size and not a causal analysis. The test is most familiar for a two-way contingency table, but its logic extends to goodness-of-fit and homogeneity questions.

## Expected counts and the statistic

For cell (i,j), expected count under independence is Eᵢⱼ=(row totalᵢ×column totalⱼ)/N. Pearson’s statistic is X²=Σ(Oᵢⱼ−Eᵢⱼ)²/Eᵢⱼ, approximately chi-square with (r−1)(c−1) degrees of freedom if observations are independent and expected counts support the large-sample approximation. The statistic accumulates discrepancies across cells, so it can identify evidence against independence without saying which pattern drives it.

### Calculation with a 2×2 table

Suppose treatment A has 18 recoveries and 42 non-recoveries; treatment B has 30 recoveries and 30 non-recoveries. Recovery risks are 30% and 50%. Under independence, each group’s expected recovery count is 24. Contributions across the four cells give X²=5.00 (df=1), approximately p=.025. The risk difference is 20 percentage points, risk ratio 1.67, and odds ratio 2.33. These effects answer different questions and should accompany the test.

```r
tab <- matrix(c(18, 42, 30, 30), nrow = 2, byrow = TRUE,
              dimnames = list(arm = c("A", "B"),
                              outcome = c("recovered", "not")))
chisq.test(tab, correct = FALSE)
rowSums(tab); prop.table(tab, margin = 1)
```

The code uses a Pearson approximation without Yates’ continuity correction to expose the standard statistic. R defaults to correction in a 2×2 table; report which version was used. Row percentages here are recovery distributions within arm; column percentages would answer a different question.

### Sparse cells and table structure

The chi-square reference distribution can be inaccurate when expected counts are small, especially when the table has many sparse cells. No single cutoff is universal, but inspect expected counts rather than observed counts alone. For a 2×2 table, Fisher’s exact test conditions on margins; for larger tables, exact or Monte Carlo methods may be feasible. Collapsing categories solely to make the p-value work discards information and may hide clinically meaningful distinctions. Sparse data can also demand a model designed for rare outcomes rather than a test substitution.

The table’s sampling design matters. Pearson’s test assumes independent observational units and ordinary multinomial sampling. Repeated measurements, matched pairs, clustered participants, complex survey weights, or stratified randomization require design-aware inference. McNemar’s test handles paired binary outcomes; survey-adjusted tests account for weights and clustering. A naive chi-square test on thousands of correlated records can produce spuriously precise evidence.

### Association, effect, and causality

A small p-value says the observed table differs from independence more than expected under the null and approximation. It does not provide direction unless cell proportions are examined, nor magnitude without measures such as risk difference, odds ratio, Cramér’s V, or standardized residuals. For large samples, trivial deviations can be significant. For small samples, important differences may be uncertain.

Association does not establish causation. Confounding can create or mask a table association; adjusted regression or stratified methods may be needed, guided by the design and causal question. For a two-by-two table, report event counts/denominators by group, chosen effect measure and interval, test method, expected-count diagnostics, and whether observations were independent. Never report percentages without denominators. If the target is treatment effect, identify the estimand and whether adjustment is warranted rather than equating a test of independence with causal evidence.

## Construct the table around the question

A contingency table is a compact representation of joint categorical outcomes. Its row and column labels should make the denominator logic explicit. In a treatment-by-outcome table, rows as arms make row proportions equal to event risks in each arm. In a case-control sample, columns may be sampled by outcome status, so the sampled proportions cannot estimate population risks without additional sampling information. Column percentages then answer how exposure is distributed among sampled cases and controls, not risk of disease by exposure.

Before calculating a test, verify that each participant contributes to exactly one cell for the analysis being performed, category definitions are mutually exclusive, and missingness is represented rather than silently removed. Ordinal categories should not be collapsed automatically: severity grades have order and collapsing can erase trends. If a category has no observations, determine whether it is structurally impossible or a random zero; these situations have different modeling implications.

## A detailed 2×2 calculation

Take the table with treatment A: 18 recoveries, 42 non-recoveries; treatment B: 30 recoveries, 30 non-recoveries. The margins are 48 and 72 outcomes, 60 participants per arm, N=120. Under independence, expected counts in each arm are 24 recoveries and 36 non-recoveries. Pearson’s statistic is 2[(18−24)²/24]+2[(42−36)²/36]=3+2=5, with one degree of freedom and p≈.025. The observed recovery risks are .30 and .50, risk difference +.20, risk ratio 1.67, and odds ratio (30×42)/(30×18)=2.33 for B relative to A.

```r
tab <- matrix(c(18, 42, 30, 30), nrow = 2, byrow = TRUE)
expected <- outer(rowSums(tab), colSums(tab)) / sum(tab)
chi2 <- sum((tab - expected)^2 / expected)
df <- (nrow(tab) - 1) * (ncol(tab) - 1)
pchisq(chi2, df = df, lower.tail = FALSE)
chisq.test(tab, correct = FALSE)
```

This code exposes the expected-count calculation and yields X²=5. The result is different from a previous approximate hand calculation; the actual table governs. A good analysis note checks arithmetic with software and checks software against the table margins. With this table, Yates’ correction makes the test more conservative; name the correction if used.

## Localizing a global association

The omnibus statistic indicates departure from independence but does not identify contributing cells. Pearson residuals (O−E)/√E show which cells differ from expectation, though residual inspection across many cells is itself a multiple-comparison exercise. Adjusted standardized residuals account for row and column margins and can be compared with a normal reference as an exploratory diagnostic. They are not causal effects.

For larger tables, a global test may be significant because of a few cells while most distributions are similar. Display observed and expected counts, row/column proportions, and perhaps residual shading in a mosaic plot. If follow-up cellwise tests are used, predefine or adjust the family. Collapsing categories after seeing which cells drive significance overstates evidence.

```r
chisq.test(tab)$expected
chisq.test(tab)$stdres
mosaicplot(tab, shade = TRUE, main = "Arm by outcome")
```

The standard residual matrix is useful for diagnosis, not a replacement for effect estimation. With ordered categories, a trend test or ordinal regression may use the order more efficiently than a nominal chi-square test.

## Sparse data and Monte Carlo inference

The approximation relies on the distribution of the statistic being close to chi-square. Sparse expected counts can make tail probabilities inaccurate; a frequently cited heuristic is that no expected cell should be below 1 and not too many below 5, but it is not a universal theorem. A 2×2 table with limited counts is often handled by Fisher’s exact test. For larger tables, Monte Carlo sampling of tables with fixed margins can approximate the conditional null distribution:

```r
set.seed(2026)
chisq.test(tab, simulate.p.value = TRUE, B = 100000)
```

The Monte Carlo p-value has simulation error. Its approximate SE is √[p(1−p)/B]; if the result is near a decision threshold, increase B and report the simulation settings. Fisher’s exact test conditions on margins, which are fixed by design in some settings but not others; exactness is a property of a sampling model, not a general warranty. Sparse-data regression may use penalization or Bayesian priors, but those methods change assumptions and should be reported explicitly.

## Dependence, matching, and sampling designs

The Pearson test treats units as independent. If each participant is measured before and after, use McNemar for paired binary outcomes or an appropriate repeated-measures model. If patients share clinics, use a model or variance estimator that accounts for clustering. If the data arise from a complex survey, use survey-weighted Rao–Scott adjustments; ordinary Pearson statistics ignore stratification and unequal probabilities. For matched case-control sets, conditional logistic regression or matched methods respect the matching structure.

Observations may also be dependent because one person contributes multiple events. A table of events is not a table of independent people if recurrent outcomes are counted. Aggregate at the participant level or model recurrent counts with robust variance/frailty as appropriate. Verify what the unit of analysis represents before applying a test.

## Effect measures and adjusted analyses

For 2×2 comparisons, present event risks, RD, RR, or OR with an interval. The choice follows the decision. For an r×c table, Cramér’s V scales the chi-square statistic by sample size and the smaller table dimension; it summarizes association strength but has no direction and can be difficult to compare across table sizes. Goodman–Kruskal measures or ordinal association statistics may be more interpretable when categories are ordered.

If the objective is adjusted association, logistic, log-binomial, or Poisson regression with robust variance may estimate conditional or marginal effects, depending on specification. A significant unadjusted table can disappear after accounting for confounders, or emerge after stratification through Simpson’s paradox. Adjustment must be based on a causal or descriptive plan; adding variables mechanically can create collider bias or change the estimand. Chi-square remains a useful descriptive screen but is not the adjusted analysis.

## Sample size and interpretation

Planning a chi-square test requires anticipated category probabilities under null and alternative, alpha, power, degrees of freedom, and allocation. Sparse expected counts at the planned sample size suggest that asymptotic testing may be unsuitable; simulation or exact planning can help. If the scientific target is a risk difference, planning directly for that contrast may be clearer than planning around a generic chi-square statistic.

Report total N, cell counts, denominator percentages, statistic, degrees of freedom, p-value, expected-count diagnostics or exact method, effect measure and interval, and sampling/assignment design. Avoid reporting percentages alone. Explain the direction of the association and whether it is adjusted. Statistical significance indicates evidence against independence under the model; it does not establish causality or practical importance.

### Goodness-of-fit and homogeneity questions

The same Pearson statistic supports different designs. A goodness-of-fit test compares one categorical variable’s observed counts with prespecified probabilities, with df typically categories−1 minus estimated parameters. A homogeneity test compares category distributions across independently sampled populations. An independence test asks whether two variables are associated in one sampled population. The table and degrees of freedom may look alike, but the sampling plan and interpretation differ.

For goodness-of-fit, expected probabilities should come from a scientific model or prespecified reference distribution; estimating them from the same table changes degrees of freedom. If categories are ordered, a test sensitive to trend may be more powerful than a general chi-square goodness-of-fit test. For a homogeneity question, each population needs independent sampling and clear denominators. State which design generated the counts.

### Rates and person-time are not table proportions

A table of event yes/no by group is suitable when each person has a defined common follow-up window. If follow-up duration differs, comparing event proportions can be biased because participants have unequal time at risk. Use incidence rates with person-time offsets or survival models, accounting for censoring and competing risks. A chi-square test on person-level “ever event” ignores time and may misrepresent rate differences.

### Visual and numerical checks

Display row percentages when the question is risk within group, but retain counts. Check that totals reconcile with the analytic population and that missing categories have not disappeared. If a large cell dominates X², examine whether it reflects meaningful association or data errors. For repeated hospital visits, aggregate or model dependence; a table of visit-level outcomes can overstate information if people contribute multiple visits.

### Worked example with denominators

In the recovery table, treatment A has 18/60 recovered (30%) and B has 30/60 (50%). The row percentages make the risk contrast visible, while the counts show that each estimate is based on 60 people. The RD is 20 points and RR 1.67; approximate intervals would be wide enough to convey uncertainty. A chi-square p-value summarizes evidence against equal distributions but should never substitute for those measures. If the table instead sampled 60 recovered patients and 60 not recovered by design, the same percentages would not estimate recovery risks.

### Common coding errors

Factor levels can be dropped when subsetting data, and missing outcomes can silently change the denominator. Use `table()` with explicit missingness checks, compare sums with the analytic sample, and set category order intentionally. If cells are ordered, a trend test can answer a directional question more efficiently, but it assumes scores or ordering structure. Report how categories were defined.

### Survey and clustered inference

Complex survey data use weights to represent unequal inclusion probabilities and often have stratification and clustered sampling. The ordinary Pearson statistic assumes simple multinomial sampling and typically understates variance. A Rao–Scott correction adjusts the test for design effects; survey software also reports design degrees of freedom based on primary sampling units. State the survey design declaration and weighted denominator.

In healthcare datasets, many records can come from the same patient, clinician, or hospital. A chi-square test on all rows treats them as independent and can exaggerate evidence. Aggregate at the independent unit or use GEE, mixed models, or cluster-robust methods appropriate to the endpoint. Number of independent clusters matters more than raw row count for uncertainty.

### Interpretation checklist

Ask: What is the independent unit? Which margin is fixed by sampling? Which percentages answer the clinical question? Are expected counts adequate? Is the effect adjusted or crude? Could confounding or selection explain the association? Report counts, denominators, effect size and interval, and the exact design-aware method. This checklist prevents a simple table test from carrying a stronger interpretation than the data support.

### The chi-square approximation in context

The chi-square reference distribution is asymptotic: it approximates the sampling distribution as information grows. Its quality depends on expected counts and table structure, not just total N. A large total can coexist with rare sparse categories. Monte Carlo and exact methods address calibration under particular conditional models, while penalized or Bayesian regression may estimate effects under a specified model. State which approximation is being used and why it fits the data.

For binary outcomes, continuity correction subtracts a small amount from observed-expected deviation in the 2×2 statistic to improve approximation in discrete data. It can be overly conservative at moderate sample sizes; report whether it was applied. The correction is not a substitute for exact inference where counts are extremely sparse.

### Stratified tables and Simpson’s paradox

A pooled table can show a different direction from each stratum when a third variable is associated with both exposure and outcome. For instance, treatment may appear to improve outcomes overall because low-risk patients disproportionately received it, while within each severity stratum its advantage is smaller or absent. A chi-square test of the pooled table detects association but cannot explain this structure. Display stratified tables and use a method such as Mantel–Haenszel or regression when justified. Whether to adjust depends on the causal question; not every variable should be controlled mechanically.

### Confidence intervals complement testing

For a 2×2 table, risk difference, risk ratio, and odds ratio intervals communicate magnitude. For multi-category tables, report Cramér’s V or model-based contrasts with intervals. An omnibus p-value can be highly significant in a large sample with tiny association. Readers need both evidence and effect scale.

### Keep causal conclusions separate

Even when assignment is randomized, the chi-square test on observed outcomes may estimate a crude association affected by missingness or nonadherence. In observational studies, it is strictly descriptive absent additional causal assumptions. Report the design and analysis population alongside the test. A table is a starting point for understanding categorical data, not a causal model by itself.

### Do not report a p-value without the table

For categorical outcomes, sparse cell counts are scientifically informative and should remain visible. Percentages can look stable while representing only a few observations. Include denominators, explain row versus column percentages, and provide the actual table in text or supplement. For multiway tables, show relevant strata and model-based estimates rather than an opaque global statistic.

### Final interpretation

Pearson’s chi-square test is a useful global screen for categorical association when observations are independent and expected counts support its approximation. It does not identify magnitude, direction, or cause. Present cell counts and denominator percentages with an effect estimate and interval; use exact or design-aware alternatives when sparse or dependent data violate the simple model.

When reporting a significant association, identify which group has the higher event proportion and give the absolute and relative scale; the statistic itself has no direction.

For a report-ready table, show n and row percentages in each arm, then state the Pearson statistic, degrees of freedom, and exact p-value. Add a confidence interval for the prespecified effect measure and note if design-based correction or continuity correction was used. This allows clinical readers to assess both the observed pattern and its precision.

## References and further reading

- Agresti A. *An Introduction to Categorical Data Analysis*. 3rd ed. Wiley, 2018.
- Lang TA, Altman DG. [The SAMPL guidelines](https://www.equator-network.org/reporting-guidelines/sampl/), statistical reporting guidance.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis
  and Other Advanced Topics*. Brooks/Cole.
- The [Fisher's exact test article](/biostatistics-library/comparisons/fishers-exact-test.html) covers inference for sparse 2×2 tables.
