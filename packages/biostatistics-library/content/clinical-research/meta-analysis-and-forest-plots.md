---
title: Meta-analysis and forest plots
summary: Combining the results of several comparable studies into one pooled effect estimate, shown study by study on a forest plot.
---

## Overview and key ideas

A meta-analysis is the quantitative synthesis step of a systematic review: it combines the results of independent studies on the same question into a single pooled estimate with a confidence interval. Each study contributes a point estimate (risk ratio, odds ratio, mean difference, hazard ratio) and a standard error, and the method weighs them — usually by the inverse of the variance, so larger, more precise studies count more — then combines the weights into an overall estimate.

Two models govern the combination. Under the **fixed-effects** model the true effect is assumed identical in every study, and any between-study differences are pure sampling noise. Under the **random-effects** model each study estimates its own true effect, drawn from a distribution of effects; a between-study variance component (tau-squared) is estimated and added to each study's variance, giving more weight to smaller studies and producing wider intervals. Random effects is the usual default when studies genuinely differ.

The **forest plot** displays each study as a square (sized by its weight) with its confidence interval, and the pooled estimate as a diamond; the width of the diamond is the pooled CI, and whether it crosses the line of no effect is the pooled significance.

## When to use it

| Setting | Example question |
| --- | --- |
| Pooled RCT evidence | Across all RCTs, does a beta-blocker started in acute MI reduce 1-year mortality? |
| Diagnostic test meta-analysis | What is the pooled sensitivity and specificity of cardiac MRI for myocarditis? |
| Rare outcomes | What is the pooled hazard ratio for relapse with a maintenance drug in multiple sclerosis? |
| Subgroup exploration | Does the treatment effect differ by age, sex, or baseline severity across trials? |

## Assumptions and limitations

- **Like with like** — valid pooling requires studies to be answering the same question with comparable populations, interventions and outcomes; averaging non-comparable studies produces a precise number with no real meaning.
- **Independence of studies** — the standard errors assume each study's estimate is independent; overlapping patient samples or shared authors break this.
- **Model choice matters** — the fixed-effects model is only defensible when between-study heterogeneity is negligible; when it is not, its narrow confidence interval is false precision.
- **Small-study effects** — the pooled estimate can be distorted if small studies systematically differ from large ones (often correlated with publication bias); this is checked by funnel plots and explored in sensitivity analyses.

## Worked example

Four RCTs report the risk of stroke with a new anticoagulant versus placebo over one year:

| Trial | Events/Total (drug) | Events/Total (placebo) | RR |
| --- | --- | --- | --- |
| A | 30/800 | 50/800 | 0.60 |
| B | 15/600 | 25/600 | 0.60 |
| C | 10/400 | 20/400 | 0.50 |
| D | 8/300 | 18/300 | 0.44 |

On the log scale, inverse-variance weights favour the larger trials A and B. A fixed-effects pooled RR is ≈ **0.56** (95% CI 0.48–0.65); because trials differ only modestly, heterogeneity is low and the fixed-effects result is acceptable. On the forest plot the diamond sits well to the left of the vertical no-effect line at RR = 1, so the pooled analysis finds a statistically significant ~44% relative reduction in stroke, with the precision much tighter than any single trial — exactly the added value of pooling.

Interpretation: each trial alone is suggestive but imprecise; pooled, they yield a single estimate with a narrow interval. The key discipline is that pooling is only legitimate because all four trials were adequately comparable; if trial D had a very different population, it should be examined separately or analysed under a random-effects model rather than silently averaged in.

## Interpretation and common pitfalls

- Choosing fixed effects by convenience despite real heterogeneity, and reporting an artificially narrow, misleading confidence interval.
- Pooling non-comparable studies (different interventions, populations or endpoints) to manufacture a "significant" overall result.
- Reading the pooled diamond as the effect in *your* population: the estimate reflects the studies included, so applicability still has to be judged separately.
- Ignoring the forest plot's weights: the pooled number is driven by the few large studies, so it can look very different from a simple average of the trial RRs.

Fixed-effect and random-effects models answer different questions. A fixed-effect summary assumes a common underlying effect (with differences arising from sampling error); a random-effects model estimates a mean of a distribution of effects and adds between-study variance τ². The random-effects mean is not a universal treatment effect, and a prediction interval can reveal uncertainty for a new setting. Avoid choosing the model solely from a heterogeneity p-value. Prespecify clinically plausible effect measures, explore sources of heterogeneity cautiously, and account for dependent estimates when studies report multiple outcomes or time points.

## References and further reading

- Higgins JPT, Thomas J, Chandler J, Cumpston M, Li T, et al. *Cochrane Handbook for Systematic Reviews of Interventions*, 2nd edn. Wiley-Blackwell.
- Bland M, Altman DG. "Some methods and software for assessing scale of heterogeneity in meta-analysis." *Statistics in Medicine*. 1996.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- The library's "Heterogeneity and publication bias" article covers how to test and interpret between-study differences.
