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

## References and further reading

- Greenland S, Rothman K, Lachin JM. *Modern Epidemiology*. Lippincott Williams & Wilkins.
- Agresti A. *Categorical Data Analysis*. John Wiley & Sons.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.

*The "Hypothesis testing for categorical data" topic develops the chi-squared and Fisher's exact tests built on these tables (article planned).*
