---
title: What is biostatistics?
summary: The branch of statistics applied to biological and medical research — turning messy data into trustworthy evidence.
---

## Overview and key ideas

[Biostatistics](https://en.wikipedia.org/wiki/Biostatistics) (also
[biometry](https://en.wikipedia.org/wiki/Biometry)) is the application of
statistical methods to biology, medicine and public health. Where general
statistics develops the mathematics of inference, biostatistics focuses on
the practical problems of real research: how to design a study, how to
summarise what was measured, how to quantify uncertainty, and how to report
findings honestly.

A biostatistician works at every stage of a study:

- **Before data collection** — choosing a study design and calculating the
  sample size needed to answer the question reliably.
- **During analysis** — selecting appropriate tests, building models, and
  checking their assumptions.
- **After analysis** — interpreting results in clinical terms and writing
  methods and results sections that other researchers can reproduce.

## When to use it

Any study that draws conclusions from samples rather than whole populations
relies on biostatistics. Typical settings include:

| Setting | Example question |
| --- | --- |
| Clinical trials | Does a new treatment reduce mortality compared with the standard? |
| Epidemiology | Is exposure to air pollution associated with higher asthma rates? |
| Screening programmes | How well does this test detect disease in early stages? |
| Health services research | Does the intervention change wait times or outcomes? |

## Assumptions and limitations

Statistical conclusions are only as strong as the data and design behind
them. Common pitfalls that statistics alone cannot fix:

- **Selection bias** — the sample does not represent the population of interest.
- **Confounding** — a third variable explains the observed association.
- **Missing data** — incomplete records that change who is being measured.
- **Overinterpretation** — reading causation into an observational
  association, or treating a p-value of 0.06 as "nearly significant".

### Design, estimand and analysis belong together

Start with a target population and a question that specifies the comparison,
outcome and time horizon. The design determines what can be learned: random
allocation can support a causal treatment contrast under appropriate conduct
and follow-up, while an observational association requires attention to
confounding and selection. Before seeing outcomes, an analysis plan should
state the primary estimand, outcome scale, missing-data approach, subgroup
analyses and sensitivity checks. Reporting an effect estimate with a
confidence interval shows its magnitude and precision; neither a small p-value
nor a complex model repairs poor measurement or a misaligned design.

## Worked example

Suppose a trial randomises 200 patients to a new drug and 200 to placebo.
After one year, 18 of 200 in the drug group and 30 of 200 in the placebo
group had the bad outcome. A biostatistician would compare the two event
rates (9% vs 15%), test whether the difference is likely due to chance,
estimate the effect size (e.g. relative risk ≈ 0.60), and report a confidence
interval — not just a p-value — so readers can judge both precision and
clinical importance.

## Interpretation and common pitfalls

- A non-significant result is evidence of *no detectable effect*, not proof
  of no effect.
- Effect sizes matter more than significance: a statistically significant
  2% improvement may be clinically irrelevant.
- Always state the population the results apply to.

## References and further reading

- National Academies. [Reproducibility and Replicability in Science](https://doi.org/10.17226/25303). 2019.
- STROBE Initiative. [Reporting guidance for observational studies](https://www.strobe-statement.org/).
- CONSORT. [CONSORT 2025 statement](https://doi.org/10.1136/bmj-2024-081123). *BMJ*. 2025.

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis
  and Other Advanced Topics*. Brooks/Cole.
- See also: the [Confidence intervals](../inference/confidence-intervals.html)
  article in the *Statistical inference* section.
