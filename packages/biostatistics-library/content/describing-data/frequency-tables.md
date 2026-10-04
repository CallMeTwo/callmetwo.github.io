---
title: Frequency tables
summary: Counts, proportions and two-way cross-tabulations as the starting point for summarising categorical clinical data.
---

## Overview and key ideas

Before any test or model, categorical data — vital status, adverse event grade, blood group, treatment arm, response yes/no — must be summarised. The **frequency table** lists each category with its count and proportion. Proportions should always be given with the denominator: "48/120 (40%) had nausea" is informative; "40% had nausea" is not.

The most useful form in clinical work is the **two-way (contingency) table**, which cross-tabulates two categorical variables, e.g. treatment arm × adverse event. Each cell is a count, and row, column and overall percentages answer different questions:

- **Row percentages** — the distribution of one variable within each level of the other; e.g. the event rate within each treatment arm.
- **Column percentages** — the distribution of the other variable within each level; e.g. what share of all events occurred in each arm.
- **Overall (marginal) percentages** — the base rate, ignoring the other variable.

Reporting counts and percentages together is a journal standard, because small numbers make percentages unstable and uninterpretable on their own, and readers need the denominators to judge how much weight a cell deserves.

## When to use it

| Setting | Example question |
| --- | --- |
| Baseline characteristics | Are the randomised arms similar in age band, sex and comorbidity burden? |
| Adverse event summaries | How often does each event (any grade, grade ≥ 3) occur in each arm? |
| Diagnostic test evaluation | Counts of true and false positives against a reference standard (2×2 table)? |
| Stratified reporting | Does the event rate differ by age band or by study site? |
| Quality indicators | What fraction of discharges met each care-bundle element? |

## Assumptions and limitations

- Every percentage needs a stated denominator. Mixing bases (percentages of rows in one column, of columns in another) is a common and confusing error.
- Percentages from small denominators are extremely unstable: 1/3 (33%) vs 2/5 (40%) is not a meaningful difference; report the counts and compare with an exact test.
- The table summarises what was observed, not what would have been: loss to follow-up, refusal, or incomplete records change the denominator and can bias rates. Missingness should appear as an explicit row or column, not be silently dropped.
- A two-way table describes association, not causation; a striking pattern may be confounded by a variable not in the table (age is the classic).
- With many categories or sparse cells the table becomes unreadable and downstream tests lose validity; chi-squared approximations need reasonably large expected cell counts (rule of thumb: at least 5 per cell).

### Denominators, missingness and uncertainty

Choose the denominator from the question and design. In a randomized trial,
the event proportion is often events divided by participants assigned to that
arm; in a person-time analysis, events are divided by accumulated time at risk.
These answer different questions and should not share the label “rate” without
definition. State how many participants lack the outcome and whether each row
uses all randomized people, those with an observed result, or another analysis
set. A proportion is also an estimate: for small samples, report a confidence
interval using a suitable binomial method (for example, Wilson or exact), since
the Wald interval can extend below zero or above one.

## Worked example

In a two-arm trial, nausea was recorded at day 28:

| Group | Nausea | No nausea | Total | Row % |
| --- | --- | --- | --- | --- |
| New drug (n = 50) | 12 | 38 | 50 | 24% |
| Placebo (n = 50) | 6 | 44 | 50 | 12% |
| Total (n = 100) | 18 | 82 | 100 | 18% |

The row percentages (24% vs 12%) are the clinically meaningful comparison: nausea was twice as common with the new drug. The column percentages answer a different question — 12/18 (67%) of all nauseated patients were on the new drug — and the marginal 18% is the overall base rate. If the protocol stratified by age, adding a third layer would show whether the 24% vs 12% gap is driven by one age band, the check that guards against Simpson's paradox, where an association can reverse direction within strata.

## Interpretation and common pitfalls

- Choosing the wrong percentage base: comparing 24% (a row %) with 67% (a column %) as if they were the same quantity.
- Rounding a column of percentages to 100% and silently discarding missing responses; the missing count should be reported.
- Reading a 2×2 table as a causal effect, or as a precise one: small tables need exact (Fisher) tests and wide confidence intervals.
- Over-stratifying: splitting into many small subgroups produces percentages from tiny denominators that look precise but are noise.

## Build a table from the estimand and denominator

A frequency table starts with a unit of analysis and a set of mutually exclusive categories. A participant-level endpoint needs one record per participant or a clearly defined rule to reduce repeated records. A visit-level table may count the same person more than once and should say so. Before calculating percentages, specify whether the target is a proportion of participants, visits, procedures, or person-time. Duplicate records can inflate numerators and denominators together or unevenly, changing the result.

For a one-way table, let n_j be the number in category j and N the denominator. The sample proportion is p̂_j=n_j/N. If categories are exhaustive and mutually exclusive, Σn_j=N and the proportions sum to one before rounding. If there are missing or “unknown” values, state whether those are shown as a category or excluded from the percentage denominator. The choice must follow the question: a completion rate may include every eligible participant, whereas a distribution among respondents may condition on nonmissing answers.

For a two-way table, the same cell count can be expressed with several denominators. If row i is treatment assignment and column j is event status, n_ij/n_i. gives risk within treatment row; n_ij/n_.j gives the treatment composition among those with outcome j; n_ij/N gives a joint proportion. These are different conditional or joint probabilities. Use row percentages to compare outcome frequency across treatment arms when arms are in rows. Label the denominator directly in headings or footnotes.

### Worked example: risk difference, risk ratio, and odds ratio

In the nausea table, risk is 12/50=.24 in the new-drug arm and 6/50=.12 in placebo. The absolute risk difference is .24−.12=.12 (12 percentage points); the risk ratio is .24/.12=2.0. The odds are .24/.76=.316 and .12/.88=.136, giving an odds ratio .316/.136≈2.32. Since nausea is not very rare, the odds ratio is farther from 1 than the risk ratio. “Twice the risk” and “2.32 times the odds” are not interchangeable.

An approximate standard error for the risk difference is sqrt[.24(.76)/50+.12(.88)/50]=sqrt(.005712)=.0756. A Wald 95% interval is .12±1.96(.0756), or −.028 to .268. This interval shows substantial uncertainty and includes no difference. A simple point estimate of a doubled risk should not be mistaken for precise evidence. For small samples, score-based or exact methods can have better coverage than Wald approximations.

```r
tab <- matrix(c(12, 38, 6, 44), nrow = 2, byrow = TRUE,
              dimnames = list(arm = c("new", "placebo"),
                              outcome = c("nausea", "none")))
addmargins(tab)
prop.table(tab, margin = 1) # row percentages
prop.table(tab, margin = 2) # column percentages
p <- tab[, "nausea"] / rowSums(tab)
rd <- p[1] - p[2]
rr <- p[1] / p[2]
se_rd <- sqrt(sum(p * (1-p) / rowSums(tab)))
c(risk_difference = rd, risk_ratio = rr,
  lower = rd - qnorm(.975)*se_rd,
  upper = rd + qnorm(.975)*se_rd)
```

This code assumes independent participants, complete outcome ascertainment, and row order matching the comparison. If participants are clustered by site or observed repeatedly, use a design-aware interval. `fisher.test(tab)` is useful for sparse-cell association tests but does not provide the risk difference directly; estimate the measure that answers the clinical question.

## Sparse cells, uncertainty, and privacy

Expected cell counts, rather than observed counts alone, govern the usual chi-square approximation. Under independence, expected count is row total × column total / grand total. In a 2×2 table with small expected values, Fisher's exact test conditions on margins and computes a tail probability from the hypergeometric distribution. It can be conservative and does not remove the need to present an effect estimate with interval. For larger sparse tables, consider exact or Monte Carlo methods and combine categories only when clinically defensible.

A table is descriptive even when a p-value is added. Statistical significance does not establish a clinically important difference, and a nonsignificant test does not establish equivalence. For randomized trials, baseline significance tests are generally unhelpful: randomization balances in expectation, and observed baseline differences are chance variation. Describe relevant baseline distributions without selecting covariates by p-value.

When cells are very small, privacy risk may matter. Public reports may suppress counts or combine categories under a prespecified disclosure rule. Suppression should not obscure denominators in a way that makes percentages misleading. For rare adverse events, narrative summaries and aggregate totals may be safer than finely stratified tables.

## Stratification and standardization

A crude table can conceal different age or site distributions across exposure groups. Stratified tables show conditional proportions and help detect heterogeneity or confounding, but many strata create sparse cells. A standardized risk uses stratum-specific risks weighted by a common target distribution. For age strata k, p̂_std=Σw_k p̂_k, with weights summing to one. State the target weights: the study population, an external population, or an equal-stratum contrast. Standardization changes the summary target and should not be presented as a generic adjusted percentage.

For example, if treatment and control risks are calculated within younger and older groups, an overall crude difference may reflect different age mixes. Show both stratum sizes and risks. If treatment effect varies by age, a single standardized average masks that interaction; report subgroup contrasts with uncertainty and avoid overinterpretation of underpowered strata.

## Missing categories and denominators

A missing outcome should not disappear silently. Show observed and missing counts by group, and report whether percentages use randomized participants or only those with observed outcomes. Complete-case proportions estimate the risk among observed participants; they estimate the assigned population risk only under additional assumptions. In longitudinal studies, missingness can depend on earlier outcomes, adverse events, or treatment discontinuation. A frequency table can reveal patterns but cannot determine whether missingness is ignorable. Follow with a missing-data strategy aligned with the estimand and sensitivity analysis.

For each table, document the unit, time period, category definitions, denominator, treatment of missingness, and rounding convention. These details make a frequency table a reproducible analysis rather than a decorative summary.


## Confidence intervals and comparison of proportions

For one binomial proportion p̂=x/n, the Wald interval p̂±1.96√[p̂(1−p̂)/n] is easy but performs poorly near zero or one and with small n. Wilson score intervals invert a score test and usually stay within [0,1]. Exact Clopper–Pearson intervals guarantee at least nominal coverage but can be conservative. State the method and retain numerator and denominator so readers can assess precision.

For the nausea comparison, pooled proportion is 18/100=.18 under the null of equal risks. The standard error for a two-proportion score test is √[.18(.82)(1/50+1/50)]=.0768, so z=(.24−.12)/.0768=1.56, with a two-sided p-value around .12. This test does not contradict the point estimate; it reflects substantial uncertainty. The confidence interval for the risk difference (approximately −.03 to .27 by an unpooled Wald method) shows that both small harm and appreciable increase remain plausible.

```r
x <- c(12, 6); n <- c(50, 50)
prop.test(x, n, correct = FALSE)$estimate
prop.test(x, n, correct = FALSE)$conf.int
prop.test(x, n, correct = FALSE)$p.value
```

For two groups, `prop.test` uses a score procedure for equality of proportions; its confidence interval is for a related contrast and defaults can differ by options. It assumes independent binomial observations. For clustered trials or paired binary outcomes, use methods respecting the design. A p-value is not the difference estimate; report an absolute contrast and interval.

## Missingness and multi-response categories

If a survey permits multiple selections, category percentages need not sum to 100%; the denominator may be respondents while each person contributes to several categories. Label this clearly. For mutually exclusive categories with missing responses, include an unknown row or show nonmissing denominator plus missing n. Excluding missing values changes the target to respondents and can bias the distribution if nonresponse relates to the response category.

A missingness table by arm and time can reveal differential outcome collection. For example, 10/100 missing in treatment and 2/100 in control is not simply a 6% overall missing proportion; the arm imbalance may inform the missing-data analysis. A table cannot identify MCAR, MAR, or MNAR from observed data alone. Do not impute a missing category as “no event” unless the data collection definition supports that coding.

## Rates, person-time, and recurrent events

A proportion uses people with an event divided by people at risk over a specified interval. An incidence rate uses events divided by accumulated person-time and has units such as events per 100 person-years. If each patient can experience multiple admissions, event counts can exceed participant counts; a simple proportion of people with any admission and a recurrent-event rate answer different questions. Frequency tables should label outcome and denominator precisely.

When follow-up varies, comparing crude proportions can be misleading. A table can show event count, number at risk, person-time, and rate per standardized time unit. Statistical modeling may then account for covariates and overdispersion. Do not call events/person-time a percentage or compare it directly with a fixed-horizon cumulative risk.

## R table construction and audit

Construct factor levels explicitly so zero-count categories appear and order is meaningful. Check row and column totals against the analysis population. R's `table()` drops missing values unless they are made explicit; report missing counts separately or use `useNA`.

```r
dat$arm <- factor(dat$arm, levels = c("control", "active"))
dat$outcome <- factor(dat$outcome, levels = c("no", "yes"))
tab <- with(dat, table(arm, outcome, useNA = "ifany"))
addmargins(tab)
round(100 * prop.table(tab, 1), 1)
```

Audit that each participant contributes once if the target is participant risk. If long data contain multiple visits, filter to the defined endpoint window or create one participant-level outcome before tabulation. Always state how duplicate records and unresolved outcome status were handled.

## Three-way tables and effect modification

A three-way table adds a stratifying variable such as age group or site. Present stratum-specific denominators and outcome proportions, then decide whether the goal is descriptive stratification, confounding control, or effect-modification assessment. A common crude comparison can differ from stratum-specific comparisons because group composition changes. If treatment effects vary across strata, report interaction evidence and clinically meaningful stratum estimates with intervals; a large table alone does not establish a subgroup effect.

Before splitting, assess whether cells will remain interpretable. Ten age bands crossed with treatment, outcome, and site can create dozens of sparse cells and disclosure risk. Collapse categories only using a defensible clinical rule, or fit an appropriate regression and display standardized estimates. Avoid choosing cut points based on observed outcome patterns.

## Baseline tables and trial reporting

Baseline tables should describe the randomized groups, not be a contest to demonstrate balance using p-values. Include characteristics selected for clinical relevance and prognostic value, with continuous variables summarized in appropriate units and categorical variables as counts and percentages. Standardized mean differences can describe magnitude of imbalance without dependence on sample size, but do not determine whether adjustment is needed mechanically. The randomization scheme and prespecified analysis plan guide covariate adjustment.

For outcomes, distinguish participants with at least one event from total event episodes. If a participant has several adverse events, a “number affected” table and an “event count” table differ. Define severity grades, relatedness, and observation windows. Readers need these definitions to understand the denominator and compare studies.

For a reported percentage, preserve enough precision to avoid implying certainty that the data do not support: 1/7 is 14.3%, but the count communicates the limited evidence. Rounding may cause displayed rows to sum to 99% or 101%; state that totals may not sum because of rounding. Never adjust a cell silently to force 100%, since that distorts the observed table.

A table should also specify whether confidence intervals are pointwise or adjusted for multiple comparisons when many categories or groups are shown. A set of 20 intervals each at 95% confidence does not jointly provide 95% coverage for all proportions. If the table is exploratory, say so; if it supports a confirmatory claim, prespecify the comparison and multiplicity strategy.

## References and further reading

- CDC. [Principles of Epidemiology: rates and denominators](https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section2.html).
- Agresti A. [An Introduction to Categorical Data Analysis](https://doi.org/10.1002/0470114754). Wiley.

- Greenland S, Rothman K, Lachin JM. *Modern Epidemiology*. Lippincott Williams & Wilkins.
- Agresti A. *Categorical Data Analysis*. John Wiley & Sons.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.

The *Probability* articles in this library explain the chance models behind
proportions and two-way tables.
