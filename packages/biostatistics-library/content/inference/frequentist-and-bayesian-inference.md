---
title: Frequentist and Bayesian inference
summary: Two coherent frameworks for quantifying uncertainty, with different probability interpretations, assumptions, and decision summaries.
---

## Overview and key ideas

Frequentist and Bayesian methods are frameworks for learning from data. Both can use probability models, likelihoods, covariates, and prior scientific knowledge, but they attach probability to different things.

In a **frequentist** analysis, the unknown parameter is fixed and the data are random under repeated sampling. A 95% confidence procedure is designed so that, over repeated samples under the model, 95% of intervals constructed by that procedure contain the fixed parameter. After one interval is observed, the parameter is not assigned a 95% probability of lying inside it. A p-value is the probability, assuming the null model and specified analysis, of data at least as incompatible with that model as those observed; it is not the probability the null hypothesis is true.

In a **Bayesian** analysis, unknown parameters are represented with probability distributions. A prior distribution expresses uncertainty before the current data; the likelihood updates it to a posterior distribution: `posterior ∝ likelihood × prior`. A 95% credible interval contains 95% of posterior probability under the model and prior. This probability statement is conditional on the chosen model and prior, whose influence should be examined and reported.

Neither framework is automatically objective, assumption-free, or appropriate for every question. Frequentist methods also require modeling choices; Bayesian methods can provide direct probability statements but depend on prior and model specification.

## When to use it

Frequentist confidence intervals and tests are common when long-run operating characteristics, prespecified type I error, and established regulatory procedures are central. Bayesian inference is useful when decisions require probabilities about effect sizes, when prior evidence can be transparently incorporated, or when hierarchical modeling and adaptive decisions are natural. Either approach can support estimation, prediction, or decisions; choice should follow the scientific question, data structure, and decision context rather than a blanket preference.

Bayesian analyses are not synonymous with adaptive trials, and frequentist analyses are not limited to null-hypothesis tests. Bayesian models can be used in fixed designs, and frequentist estimation can focus on intervals and practical effect sizes.

## Assumptions and limitations

- **Model and data quality:** Both approaches depend on correct enough outcome, sampling, and missing-data models. A sophisticated framework cannot repair biased measurement or selection.
- **Prior sensitivity:** With sparse data, the prior can strongly influence the posterior. Justify informative priors from relevant evidence, show prior-to-posterior updates, and examine plausible alternatives. “Noninformative” priors are not universally noninformative and can behave poorly for some parameters.
- **Frequentist operating characteristics:** Error rates and coverage are properties under repeated use and the specified sampling model. A 5% type I error rate is not a 5% probability that a particular result is false.
- **Interval interpretation:** Confidence and credible intervals may look numerically similar but answer different probability questions. Neither interval alone determines clinical importance.
- **Decision context:** A posterior probability such as `P(effect > clinically important margin | data)` is not itself a decision; utilities, harms, costs, and thresholds still matter. Frequentist decisions also require a loss or policy context beyond a p-value.
- **Selective analysis:** Unreported outcome switching, optional stopping, multiplicity, and publication bias can distort results in either framework. Bayesian updating does not automatically make arbitrary data-dependent analyses harmless for every decision or model.
- **Prior-data conflict:** A prior that conflicts with current evidence can produce a misleadingly precise or awkward posterior. Check predictive implications and report conflict diagnostics.

## Worked example

Suppose a randomized trial estimates a treatment effect on a symptom scale as a mean improvement of 3 points, with standard error 1.5 points. In a simplified normal model, a frequentist 95% confidence interval is `3 ± 1.96 × 1.5`, or approximately `0.06 to 5.94` points. Under the model, the interval procedure has 95% long-run coverage. It does not mean there is a 95% probability that this particular interval contains the fixed true effect.

For illustration, use a normal prior centered at 0 with SD 4 points and a normal likelihood with estimate 3 and SE 1.5. The posterior variance is `1 / (1/16 + 1/2.25) ≈ 1.973`, so posterior SD is about 1.405. The posterior mean is `(1.973 / 2.25) × 3 ≈ 2.63` points, and an approximate 95% credible interval is `−0.12 to 5.38`. The posterior probability that the benefit exceeds 1 point is about 88% under this prior and model. A more skeptical prior would lower that probability; a weak prior would bring it closer to the data-only estimate. This illustrates why the prior belongs in the report and sensitivity analysis.

## Interpretation and common pitfalls

- Avoid saying that a p-value is the probability the null is true, or that a confidence interval gives a probability distribution for the fixed parameter.
- Do not call a Bayesian posterior “the probability the result is true” without stating the model, prior, and parameter event being evaluated.
- Compare methods using the same estimand and outcome scale. Different estimates may reflect different priors, likelihoods, or models rather than a fundamental framework dispute.
- Statistical evidence is not the same as evidence of clinical importance. State a clinically meaningful effect or decision threshold when possible.
- When reporting a Bayesian model, provide prior rationale, posterior summaries, computation and convergence checks, and sensitivity analyses. For a frequentist analysis, state the sampling model, estimand, interval procedure, and any multiplicity or sequential design.
- Avoid caricatures: frequentist analysis can incorporate design knowledge and Bayesian analysis can be prespecified with strict error control for a given decision problem.

## References and further reading

- Wasserstein RL, Schirm AL, Lazar NA. [Moving to a world beyond “p < 0.05”](https://doi.org/10.1080/00031305.2019.1583913). *The American Statistician*. 2019;73(sup1):1–19.
- U.S. Food and Drug Administration. [Guidance for the Use of Bayesian Statistics in Medical Device Clinical Trials](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/guidance-use-bayesian-statistics-medical-device-clinical-trials). 2010.
- Greenland S, Senn SJ, Rothman KJ, et al. [Statistical tests, P values, confidence intervals, and power: a guide to misinterpretations](https://doi.org/10.1007/s10654-016-0149-3). *European Journal of Epidemiology*. 2016;31:337–350.
- The library's [introduction to Bayesian inference](../practice/introduction-to-bayesian-inference.html), [p-values and significance levels](p-values-and-significance-levels.html), and [confidence intervals](confidence-intervals.html) cover these tools in more detail.
