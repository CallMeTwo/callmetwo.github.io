---
title: Generalized estimating equations
summary: A robust method for correlated repeated and clustered outcomes that estimates population-average effects.
---

## Overview and key ideas

**Generalized estimating equations (GEE)** extend generalized linear models to
correlated data — repeated measures on the same subject or outcomes clustered
within hospitals, schools, or families — by replacing the likelihood with a set
of moment equations. The model has three pieces: the **mean structure**
(logit or linear link, as in a GLM), the **variance structure**, and a
**working correlation structure** describing how a subject's repeated
observations depend on each other (independent, exchangeable,
first-order autoregressive).

The parameter estimates answer a **population-averaged** question: "what is
the average effect of the exposure across all subjects?" The key practical
feature is robustness — with a correct mean model but a **mis-specified
working correlation**, the coefficient estimates remain consistent and the
**sandwich (robust) standard errors** remain valid. This makes GEE attractive
when the true correlation structure is unknown.

## When to use it

| Setting | Example question |
| --- | --- |
| Longitudinal binary outcome | Does a vaccination reduce the probability of infection across three seasonal follow-ups? |
| Clustered counts | Are antibiotic resistance counts per admission over a year associated with ward-level cleaning compliance? |
| Repeated binary data | Which factors predict repeated falls across quarterly home visits? |

Choose GEE when you want the **average** treatment or exposure effect in the population,
the outcome is binary or count (a GLM family), or you prefer not to commit to a subject-specific distribution.

## Assumptions and limitations

- **Correct specification of the mean model** is essential; unlike the
  covariance structure, a wrong mean model biases the estimates.
- The working correlation structure need not be correct for valid inference,
  but a poor choice reduces **efficiency** — wider standard errors, fewer
  events detected for the same sample.
- GEE handles **missing data as complete cases by default** in most
  implementations; unlike mixed models it does not naturally exploit the
  likelihood for missing-at-random data, so attrition can bias results.
- With a small number of clusters, the sandwich variance can be
  anti-conservative; small-sample corrections are needed.
- Inference is about the population average, not about any individual
  subject; do not quote a GEE coefficient as an individual-level prediction.

## Worked example

In a cohort of 300 elderly residents followed for a year with quarterly
assessments (1,200 person-observations), researchers ask whether a new
balancing programme reduces the odds of falls between visits. A GEE with a
logit link and exchangeable working correlation gives, for programme
participation, an odds ratio of 0.62 (95% CI 0.47 to 0.82, robust SE):
participating residents had, on average across the population, 38% lower odds
of falling in a given quarter, independent of their own previous fall history.
The exchangeable structure assumed equal correlation between any pair of a
person's visits; even if the true correlation decays with time (autoregressive
would be closer), the coefficient and its robust SE remain valid — only
efficiency is at stake.

## Interpretation and common pitfalls

- **Population-averaged versus subject-specific**: a GEE odds ratio and a
  mixed-model (logistic random-effects) odds ratio for the same data can
  differ numerically, even with the same mean model; the GEE ratio describes
  the marginal, across-the-population association. Do not mix the two
  estimands in one sentence.
- Trusting the **model-based** standard errors that come with some GEE
  software defaults: the valid ones are the robust/sandwich versions —
  verify which was printed.
- Treating a poor working-correlation choice as an error: it affects
  efficiency, not validity of the robust SE, as long as the mean model is
  right and clusters are reasonably sized.
- Applying GEE to data with only one or two observations per subject while
  treating the subject as a cluster — the correlation estimate is then
  unstable; consider modelling the clustering factor directly instead.

GEE targets a population-averaged mean, which generally differs from a subject-specific effect in a nonlinear model such as logistic regression. The sandwich variance is asymptotically robust to a misspecified working correlation when the mean model is correct and the number of independent clusters is sufficiently large; with few clusters, ordinary sandwich intervals can be too narrow. Consider small-sample corrections or cluster-level methods, and report the number and size distribution of clusters. GEE handles within-cluster correlation, not confounding caused by cluster assignment or informative cluster size.

## References and further reading

- Liang KY, Zeger SL. Longitudinal data analysis using generalized linear models. *Biometrika*. 1986;73:13–22. [doi:10.1093/biomet/73.1.13](https://doi.org/10.1093/biomet/73.1.13)

- Diggle P, Heagerty P, Liang K, Zeger S. *Analysis of Longitudinal Data*.
  Oxford University Press.
- Liang K, Zeger S. Longitudinal data analysis using generalized estimating
  equations. *Biometrics* 1986;42:1056-1070.
- Agresti A. *Categorical Data Analysis*. Wiley.

*The "Mixed-effects models" article develops the subject-specific
counterpart to the population-averaged perspective used here.*
