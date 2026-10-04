---
title: Frequentist and Bayesian inference
summary: Two coherent frameworks for quantifying uncertainty, with different probability interpretations, assumptions, and decision summaries.
---

## Overview

Frequentist and Bayesian analyses use the same observed data but attach uncertainty to different objects. A frequentist procedure evaluates how an estimator or test would behave over repeated samples under a specified data-generating model. A Bayesian analysis combines a likelihood with a prior distribution to obtain a posterior distribution for unknown parameters. This difference is practical: it determines what a 95% interval means, how previous evidence enters, and how conclusions are expressed.

Neither framework repairs a poor design. Both depend on a meaningful estimand, valid measurement, appropriate sampling assumptions, and an analysis that respects clustering, missingness, and treatment assignment. The choice should follow the scientific question and decision context rather than a belief that one label automatically makes the result more objective.

## Two accounts of uncertainty

Let y be observed data and θ an unknown treatment effect. A frequentist confidence procedure is calibrated by its behavior across hypothetical repetitions. If the procedure is used repeatedly under the same model, 95% of intervals constructed this way cover the fixed true θ. Once one interval is observed, the parameter is not assigned a 95% probability of lying in it.

Bayesian inference specifies p(θ), a prior, and updates it using the sampling model p(y|θ): p(θ|y) ∝ p(y|θ)p(θ). A 95% credible interval can be read as containing 95% posterior probability, conditional on the model and prior. This clear probability statement does not make it assumption-free: an influential prior or misspecified likelihood can yield a misleading posterior.

## Worked comparison: a small trial

Suppose a trial estimates mean pain reduction difference as 2 points (new treatment minus control), with standard error 1.2. A normal approximation gives a frequentist 95% interval 2 ± 1.96(1.2), or −0.35 to 4.35 points. A two-sided test against zero gives z=1.67, p≈0.096. The data are compatible with effects in either direction and with a clinically useful benefit; they do not establish equivalence.

For an illustrative Bayesian analysis, place a prior θ~N(0, 2²), expressing substantial but not unlimited belief in effects near zero, and use likelihood y|θ~N(θ, 1.2²). The posterior variance is (1/4+1/1.44)⁻¹≈1.108, so posterior SD≈1.053; posterior mean is 1.108(2/1.44)≈1.54. The approximate 95% credible interval is −0.52 to 3.60. The posterior probability θ>0 is about 0.93 and θ>1 is about 0.70. These probabilities answer threshold questions directly, but they inherit the prior and normal-likelihood assumptions.

### Computation in R

```r
estimate <- 2
se <- 1.2
freq_ci <- estimate + qnorm(c(.025, .975)) * se
z <- estimate / se
p_value <- 2 * pnorm(-abs(z))

prior_mean <- 0
prior_sd <- 2
post_var <- 1 / (1 / prior_sd^2 + 1 / se^2)
post_mean <- post_var * (prior_mean / prior_sd^2 + estimate / se^2)
post_sd <- sqrt(post_var)
post_ci <- post_mean + qnorm(c(.025, .975)) * post_sd
prob_benefit <- pnorm((post_mean - 1) / post_sd)
```

The example treats the standard error as known and uses conjugate normal distributions for transparency. Real trial analyses usually estimate nuisance parameters, incorporate stratification or baseline adjustment, and may use robust or hierarchical models. Software output should be checked against the estimand, scale, and prior predictive behavior.

### Choosing and reporting a framework

Frequentist methods are natural when a protocol defines a repeated-use error guarantee, as in confirmatory regulatory testing. Bayesian methods are useful when evidence must be updated coherently, prior information is defensible, or decisions depend on posterior probabilities and expected losses. Hybrid workflows are possible, but their operating characteristics and decision rules must be explicit.

Report the estimand and model first, then interval interpretation. For Bayesian work, give the prior, likelihood, posterior summary, computational diagnostics, and sensitivity to plausible alternatives. For frequentist work, specify the test or interval procedure and any multiplicity strategy. A p-value is not the probability that the null is true, and a posterior probability is not prior-free proof. In both cases, show effect size and uncertainty on a clinically interpretable scale.

## The estimand comes before the philosophy

A choice between inferential frameworks cannot rescue an ambiguous target. In a clinical trial, “the effect” might mean a treatment-policy difference in outcomes regardless of discontinuation, a per-protocol effect under adherence, or a hypothetical effect if treatment had continued. These estimands differ when rescue therapy, nonadherence, death, or crossover occurs. Define the population, treatment conditions, outcome, handling of intercurrent events, and summary measure before debating how uncertainty should be represented.

Both approaches require a sampling model that describes the data well enough for the question. A Bayesian posterior based on an exchangeable independent normal likelihood remains wrong if patients are clustered by clinic and that dependence is ignored. A frequentist p-value from a randomized trial remains invalid if randomization, stratification, or interim monitoring is discarded in the analysis. Model checking is not an optional decoration of either framework.

## Priors as quantitative assumptions

A prior is not merely a technical requirement to produce a posterior. It states, on the parameter scale, what values were plausible before observing the current likelihood. A normal prior centered at zero may encode skepticism about large effects; a weakly informative prior can regularize extreme estimates while preserving broad support; an informative prior may incorporate earlier randomized evidence. The prior must be coherent with the parameter scale: a normal prior on a probability can assign impossible values, while a beta prior respects [0,1].

Prior predictive simulation makes assumptions visible. Draw parameters from the prior, then simulate trial outcomes. If the prior predicts implausibly large response rates or treatment effects, revise it with scientific justification before seeing the observed treatment contrast. Sensitivity analysis should compare plausible priors, including a weakly informative reference and a skeptical or historical-data prior, and show how clinically relevant posterior probabilities move. Historical borrowing requires exchangeability assessment: changes in standard of care, eligibility, measurement, and endpoint definition can make old controls poor representatives of current controls.

## Decision analysis is a distinct final step

Posterior probabilities can inform decisions, but they do not themselves encode preferences. Suppose the posterior probability that benefit exceeds 1 unit is 0.70. Whether to adopt treatment depends on the harms, costs, alternatives, and consequences of false adoption or rejection. Formal Bayesian decision analysis minimizes posterior expected loss; a threshold rule is justified only by the decision context. Frequentist decision procedures also encode losses, often through operating characteristics over parameter values. Separating inference from action prevents a statistical threshold from masquerading as a clinical value judgment.

## Computation and diagnostics

Conjugate examples can be evaluated analytically, but realistic hierarchical models often require simulation. For Markov chain Monte Carlo, assess trace plots, effective sample size, chain mixing, and convergence diagnostics; use posterior predictive checks to find systematic model failures. A high effective sample size does not establish that the model is scientifically appropriate. For approximate methods such as variational inference, assess approximation error where possible. Record software, version, random seed, model code, and diagnostic results so that the numerical posterior can be reproduced.

A Bayesian interval can have poor frequentist coverage for some parameter values, particularly under strong priors, small samples, or boundary constraints. Conversely, a frequentist confidence procedure’s repeated-sampling guarantee does not ensure a narrow or decision-useful interval in the realized study. Neither property settles all practical concerns. Report the likelihood model, prior rationale or error-rate procedure, sensitivity analyses, and interpretation in the language that actually follows from that method.

## A trial example from design through interpretation

Suppose a phase II trial enrolls 60 participants per arm and the outcome is binary response. The frequentist analysis could estimate a risk difference and give an interval whose coverage follows from the specified binomial procedure; a prespecified threshold may determine whether the study advances. A Bayesian analysis might assign beta priors to each response probability, derive a posterior distribution for the risk difference, and calculate P(RD>0|data) or P(RD>δ|data), where δ is a clinically meaningful benefit. Both analyses can be valuable, but they are not automatically interchangeable. A posterior probability above .95 and a two-sided p-value below .05 are not equivalent claims because they condition on different quantities and may encode different prior information.

If historical response data are available, a Bayesian model can borrow them through a prior or hierarchical control model. Borrowing should be discounted when historical and current patients differ. One strategy uses a mixture prior with a robust component that limits borrowing when current outcomes conflict with the historical distribution. The model should be evaluated by simulation under scenarios: compatible history, a changed control rate, treatment effect null, and plausible alternatives. Frequentist operating characteristics (false positive rate, power, bias, interval coverage) remain important even for a Bayesian design used to make high-stakes decisions. Simulations also reveal sensitivity to prior and model assumptions before trial enrollment.

### Calibration is an empirical question

Frequentist intervals are judged by coverage across repetitions; Bayesian posterior intervals can also be evaluated for frequentist calibration under design scenarios. Neither framework guarantees calibration in every realized setting. A Bayesian credible interval can be narrower and decision-useful while undercovering at some true values; a nominal 95% confidence interval can have correct average coverage but poor conditional behavior in a particular subgroup. The appropriate calibration target depends on who will use the analysis and what consequences matter.

Sensitivity analysis should distinguish uncertainty within a model from uncertainty about the model itself. Changing a prior while holding the likelihood fixed examines prior sensitivity; changing the outcome distribution, missingness assumptions, or population transportability addresses model uncertainty. In frequentist work, alternative estimators and robust standard errors can probe modeling choices, but a menu of specifications is not a substitute for identifying the primary analysis and explaining why alternatives are credible.

### Frequentist operating characteristics for Bayesian rules

A Bayesian decision rule can be calibrated by simulating its behavior over a grid of true effects. For example, declare success if posterior probability of benefit exceeds .99 and conditional predictive probability of eventual success exceeds a prespecified threshold. Under each null scenario, estimate the proportion of simulated trials declared successful; under alternatives, estimate power. This does not convert the posterior into a frequentist p-value. It quantifies how the proposed rule behaves before use and can prevent a prior-driven threshold from creating unacceptable false-positive rates.

Conversely, frequentist procedures can be expressed as confidence distributions or used within a decision-theoretic framework, though interpretations require care. The goal is not to blend terminology but to state what the procedure guarantees, what assumptions it needs, and which decision it informs.

## A practical analysis report

A concise report should state the estimand and analysis model, the prior or repeated-sampling procedure, and the summary that directly answers the question. Frequentist results might include estimate, 95% confidence interval, and p-value if prespecified. Bayesian results might include posterior median/mean, credible interval, probabilities beyond clinically relevant thresholds, prior specification, posterior predictive checks, and computational diagnostics. In either case, show absolute effects when possible, discuss missing data and multiplicity, and explain sensitivity to plausible assumptions. Readers should be able to tell whether the uncertainty statement applies to a repeated procedure, a posterior distribution, or a decision threshold.

### Handling missing outcomes

Frequentist and Bayesian analyses both need an explicit missing-data strategy. A likelihood analysis under missing at random can use observed outcomes conditional on included predictors, while multiple imputation draws plausible missing values and combines uncertainty across completed datasets. Bayesian joint models can place distributions on outcomes and missingness-related parameters, but a Bayesian label does not identify the missingness mechanism. Missing not at random assumptions are not testable from observed data alone; perform sensitivity analyses that shift unobserved outcomes or specify pattern-mixture/delta adjustments.

The target estimand determines how intercurrent events and missingness relate. If treatment discontinuation is part of a treatment-policy effect, follow outcomes after discontinuation where possible. A hypothetical estimand asks what would happen under a counterfactual scenario and needs modeling assumptions. The analysis should align with this target before selecting the framework.

### Comparing summaries without forcing agreement

A frequentist confidence interval and Bayesian credible interval may differ because of prior information, parameter constraints, nuisance-parameter treatment, or interval construction. Compare their assumptions before comparing endpoints. A diffuse prior does not always reproduce a frequentist procedure, particularly for nonlinear, high-dimensional, or weakly identified models. Likewise, likelihood-based intervals are not entirely “objective” if model selection or nuisance structure was data-dependent.

A useful sensitivity table can show the frequentist estimate and interval alongside Bayesian posterior summaries under several priors. This helps stakeholders see which conclusions arise from current data and which depend on previous evidence. It is not necessary for the numbers to match; explain why they differ and which decision each summary supports.

### Checklist for a defensible analysis

Before analysis, identify the estimand, outcome model, randomization/sampling structure, handling of missingness, and multiplicity family. For Bayesian work, add prior predictive checks, prior justification, and sensitivity plans; for simulation-based posterior calculations, add convergence and Monte Carlo diagnostics. For frequentist work, state the estimator, reference distribution, variance method, and any sequential or multiplicity correction. For both, show absolute effects and uncertainty, assess model fit, and make the language of conclusions match the inferential statement.

### Example with a binary response

Suppose 36 of 60 participants respond under a new therapy and 29 of 60 under control. The crude risk difference is .117, and the risk ratio is 1.24. A frequentist score interval for the risk difference would reflect binomial sampling; a Bayesian model might place independent Beta(1,1) priors on arm response probabilities. The posteriors would be Beta(37,25) and Beta(30,32), respectively. A simulation from these distributions estimates the posterior distribution of the difference and probabilities such as P(pT−pC>.05|data).

```r
set.seed(9)
B <- 200000
p_t <- rbeta(B, 37, 25)
p_c <- rbeta(B, 30, 32)
rd <- p_t - p_c
c(median = median(rd), quantile(rd, c(.025, .975)),
  prob_any_benefit = mean(rd > 0),
  prob_benefit_over_5pp = mean(rd > .05))
```

This uses a uniform prior on each arm probability, which is not always weak or neutral in small samples; priors are coordinate-dependent. The posterior probability for a five-point benefit can change under a skeptical prior centered on no difference. A frequentist interval answers coverage for a risk-difference procedure. Show both only if they serve a purpose, and avoid suggesting the posterior probability is the chance a reported result is true.

### Choosing based on audience and decision

A clinical team may find “probability of at least a five-point improvement” easier to use than a p-value, while a confirmatory trial may require a specified frequentist error rate. Regulators, journals, and data-monitoring committees may have established expectations. A method should be understandable to the decision-makers, and its assumptions should be documented so another analyst can reproduce it. If prior evidence is strong but heterogeneous, neither discarding it nor pooling it naively is defensible; model its relevance and show sensitivity.

### Effect heterogeneity and partial pooling

If treatment effects are estimated across hospitals, the separate site estimates will be noisy, especially at small sites. A frequentist mixed-effects model can estimate an overall mean and between-site variance, while a Bayesian hierarchical model assigns a distribution to site effects and produces partial pooling. Partial pooling shrinks extreme site estimates toward the overall mean in proportion to their uncertainty; it is neither complete pooling nor a collection of unrelated estimates. The amount of shrinkage depends on the estimated or prior between-site variation.

This approach can stabilize estimates, but it cannot show that every site truly shares one effect. Check posterior predictive distributions or residual heterogeneity, examine site-level covariates, and avoid interpreting a shrunk site estimate as direct evidence for an individual hospital. The estimand may be an average site effect, effect for a typical site, or effect for a new site, each with different uncertainty. A frequentist random-effects interval and Bayesian credible interval also target different probability statements, so label accordingly.

### A compact model comparison in R

The normal-normal calculation earlier assumed a known SE. For a binomial endpoint, posterior simulation is straightforward, while frequentist methods include score intervals or generalized linear models. Keep the analysis scale aligned: compare posterior and frequentist risk differences if the question is absolute benefit, rather than juxtaposing a posterior probability for RR with a frequentist odds-ratio p-value.

```r
# Posterior sampling for two independent response probabilities
set.seed(103)
B <- 100000
pt <- rbeta(B, 1 + 36, 1 + 60 - 36)
pc <- rbeta(B, 1 + 29, 1 + 60 - 29)
rd <- pt - pc
c(mean_rd = mean(rd),
  quantile(rd, c(.025, .5, .975)),
  posterior_prob_rd_gt_0 = mean(rd > 0),
  posterior_prob_rd_gt_0_05 = mean(rd > .05))

# Conventional frequentist comparison on response proportions
prop.test(c(36, 29), c(60, 60), correct = FALSE)
```

The Beta(1,1) priors are illustrative, not automatically appropriate. `prop.test` uses a large-sample approximation; exact or score procedures can differ. A real analysis should prespecify the method, model allocation strata if present, and use a prior predictive check. Monte Carlo error can be reduced by increasing B, but the prior and likelihood dominate inferential validity.

## References and further reading

- Wasserstein RL, Schirm AL, Lazar NA. [Moving to a world beyond “p < 0.05”](https://doi.org/10.1080/00031305.2019.1583913). *The American Statistician*. 2019;73(sup1):1–19.
- U.S. Food and Drug Administration. [Guidance for the Use of Bayesian Statistics in Medical Device Clinical Trials](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/guidance-use-bayesian-statistics-medical-device-clinical-trials). 2010.
- Greenland S, Senn SJ, Rothman KJ, et al. [Statistical tests, P values, confidence intervals, and power: a guide to misinterpretations](https://doi.org/10.1007/s10654-016-0149-3). *European Journal of Epidemiology*. 2016;31:337–350.
- The library's [introduction to Bayesian inference](../practice/introduction-to-bayesian-inference.html), [p-values and significance levels](p-values-and-significance-levels.html), and [confidence intervals](confidence-intervals.html) cover these tools in more detail.
