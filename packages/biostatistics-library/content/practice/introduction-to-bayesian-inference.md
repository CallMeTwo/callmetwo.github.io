---
title: Introduction to Bayesian inference
summary: Combine a probability model with prior information to obtain posterior distributions, summarize uncertainty, and make decisions transparently.
---

## Overview

Bayesian inference treats unknown quantities as uncertain and represents that uncertainty with probability distributions. A prior distribution describes uncertainty before the current data; a likelihood describes how the data would arise for each parameter value; Bayes' theorem combines them into a posterior distribution. The posterior is the basis for interval summaries, predictions, and decisions.

The practical appeal is direct probability statements about parameters, coherent uncertainty propagation, and the ability to incorporate external information. The main responsibility is equally direct: state the prior and likelihood, examine their implications, and show whether conclusions depend on choices that reasonable analysts might dispute. Bayesian analysis does not remove judgment; it makes some of it explicit.

## From likelihood to posterior

For parameter \(\theta\) and observed data \(y\), the posterior density is proportional to likelihood times prior: \(p(\theta\mid y)\propto p(y\mid\theta)p(\theta)\). The normalizing constant ensures the posterior integrates to one. A 95% credible interval contains 95% posterior probability for the parameter, conditional on the model and prior. This interpretation differs from the long-run coverage definition of a frequentist confidence interval.

Suppose a trial estimates a treatment effect with standard error 2 points, with positive values favoring treatment. The likelihood is approximated by \(Y\mid\theta\sim N(\theta,2^2)\). Let the prior be \(\theta\sim N(0,5^2)\), centered at no effect but allowing substantial benefit or harm. Normal-normal conjugacy gives posterior variance \(V=(1/25+1/4)^{-1}=3.448\), and posterior mean \(m=V(0/25+Y/4)\). If observed estimate is 4, then \(m=3.45\), posterior SD is 1.86, and a central 95% credible interval is approximately −0.20 to 7.10. The posterior probability of any benefit is \(P(\theta>0\mid y)=\Phi(3.45/1.86)=0.968\). These are conditional statements under the assumed normal likelihood and prior.

```r
y <- 4
se <- 2
prior_mean <- 0
prior_sd <- 5
post_var <- 1 / (1 / prior_sd^2 + 1 / se^2)
post_mean <- post_var * (prior_mean / prior_sd^2 + y / se^2)
post_sd <- sqrt(post_var)
c(mean = post_mean,
  lower = post_mean - qnorm(.975) * post_sd,
  upper = post_mean + qnorm(.975) * post_sd,
  prob_benefit = pnorm(post_mean / post_sd))
```

The example is conjugate, so calculation is analytic. Most clinical models require numerical methods such as Markov chain Monte Carlo (MCMC), Hamiltonian Monte Carlo, or variational approximations. Before interpreting a posterior, check convergence diagnostics, effective sample sizes, divergent transitions, and posterior predictive fit. A chain that ran without an error is not evidence that it explored the posterior reliably.

## Choosing a prior that can be defended

Priors can represent external evidence, plausible effect ranges, symmetry, sparsity, or regularization. A weakly informative prior constrains implausible extremes while leaving data to dominate in ranges the data can estimate. A skeptical prior for a treatment effect may center on zero and assign little mass to very large effects. A hierarchical prior can partially pool site-specific estimates toward a shared distribution, reducing noisy extremes while allowing real variation.

“Noninformative” priors are not universally neutral. A flat prior on a parameter depends on its scale: flat on a risk difference is not flat on a risk ratio. Improper priors can yield improper posteriors in some models. Weak priors may still matter with sparse data, separation in logistic regression, or variance components near zero. Prior predictive simulation is a practical check: draw parameters from the prior, simulate data, and ask whether the implied outcomes are scientifically possible.

For a binary outcome with baseline risk 0.10 and treatment log-odds ratio \(\beta\), a normal prior \(N(0,1^2)\) allows odds ratios from about 0.14 to 7.1 in its central 95%. That may be too broad for a well-studied intervention, or appropriate for a novel one. Translate priors to absolute event probabilities, not just coefficient scales. Skeptical priors can prevent implausibly large estimates from tiny studies, but should not be used to force a preferred conclusion.

Historical borrowing needs extra care. Prior data should be sufficiently comparable in population, outcome definition, standard of care, and treatment implementation. A commensurate or robust mixture prior can allow borrowing when historical and current evidence agree but reduce it when they conflict. Simply pooling old controls with new controls ignores temporal changes and can create bias. Prespecify the borrowing model and show sensitivity to discounting or no-borrowing alternatives.

## Posterior summaries for estimation and decisions

Summaries should follow the question. Report posterior mean or median, a credible interval, and probabilities tied to clinically meaningful thresholds. If benefit is defined as at least 3 points, then \(P(\theta>3\mid y)\) can be more useful than \(P(\theta>0\mid y)\). A high probability of any benefit can coexist with a low probability of worthwhile benefit. State the sign convention and threshold.

Bayesian decisions combine posterior uncertainty with consequences. If action A has benefit when \(\theta>0\) and harm otherwise, choose A when expected utility under the posterior exceeds that of alternatives. The posterior probability alone does not identify the optimal action unless utilities are specified. For example, 90% probability of benefit may still not justify a toxic intervention if benefit is small and harm is large; a lower probability may justify a low-risk intervention.

Posterior predictive distributions answer questions about future observations or patients. They include both parameter uncertainty and outcome variability. A credible interval for the population mean is narrower than a predictive interval for one future patient's outcome. Do not present one as the other. Posterior predictive checks compare observed data features with replicated datasets from the fitted model, revealing lack of fit in tails, group variation, zero inflation, or temporal patterns.

## Regression and hierarchical models

In Bayesian regression, coefficients and variance components receive priors, and the posterior captures their joint uncertainty. Regularizing priors can stabilize estimates when predictors are correlated or outcomes rare. In a logistic model with complete separation, a proper weakly informative prior yields finite posterior estimates where maximum likelihood diverges. But coefficient shrinkage changes interpretation and should be described; an odds ratio is still conditional on covariates and may not be a causal effect.

Hierarchical models represent subgroup effects as draws from a population distribution. If clinic-specific treatment effects are \(\theta_j\sim N(\mu,\tau^2)\), the posterior for each clinic balances its own data with the estimated overall distribution. Small clinics are shrunk more; large clinics less. This partial pooling can improve prediction and reduce false discovery, but it does not mean all clinics have identical effects. Report both between-clinic heterogeneity and uncertainty in the population mean.

Model comparison can use posterior predictive performance, information criteria such as LOO or WAIC, Bayes factors, or prior probability on models. These answer different questions. Bayes factors are particularly sensitive to prior scale because they compare integrated likelihoods; diffuse priors can penalize a model strongly. Cross-validation targets predictive performance and is often easier to interpret for prediction. Do not treat a single model-comparison statistic as a universal measure of truth.

## Computation, diagnostics, and reproducibility

MCMC draws are dependent samples. Multiple chains should explore the same posterior, with rank-normalized \(\hat R\) near 1, adequate effective sample size for quantities of interest, and no unresolved divergences in HMC. Trace plots reveal sticking or slow mixing. Centering, scaling, reparameterization, and better priors can improve computation, but do not hide problematic diagnostics by merely increasing iterations.

```r
library(brms)
fit <- brm(outcome ~ treatment + age + baseline + (1 | site),
           data = dat, family = gaussian(),
           prior = c(prior(normal(0, 5), class = "b"),
                     prior(student_t(3, 0, 10), class = "sigma")),
           chains = 4, iter = 4000, seed = 724)
summary(fit)
pp_check(fit)
```

The code is illustrative; priors must be calibrated to outcome units and coefficient scaling. Inspect the prior predictive distribution before fitting. For a binary, count, or survival endpoint, choose a likelihood matching the data structure and define the estimand with care. Save the model code, package versions, random seed, data provenance, and posterior draws or a reproducible way to regenerate them.

## Sensitivity analysis is part of the result

Fit plausible alternatives: a more skeptical and a broader prior, alternative likelihood assumptions, treatment-effect heterogeneity, and a model with no historical borrowing. Compare posterior estimates and clinically relevant probabilities. If conclusions change, explain which assumptions drive the result; do not select the prior that yields the preferred answer. Sensitivity analysis is especially important when the data are weak relative to the prior, the endpoint is rare, or a decision threshold is close to the posterior mass.

A prior-data conflict can appear as poor posterior predictive fit or strong tension between historical and current observations. The posterior may compromise between them, but the compromise is not necessarily scientifically credible. Robust mixture priors, power priors, or explicit source-specific models can limit borrowing. State the maximum possible borrowing and the rule by which current data reduce it.

## Eliciting and communicating prior information

Prior elicitation should begin on a scale clinicians understand. Ask what range of treatment effects is plausible, what values would be surprising, and whether benefit and harm are symmetric. For an odds ratio or hazard ratio, discuss log ratios or translate candidate values into absolute risks at representative baseline risk. For a continuous outcome, check units and the standard deviation used to scale coefficients. A prior that seems weak on a standardized scale can be extremely strong when outcome units are small.

External evidence can inform a prior, but its uncertainty and relevance must be preserved. A meta-analysis estimate should not simply be inserted as a fixed known mean with near-zero variance. Account for between-study heterogeneity and differences in setting. If the new trial is intended to confirm effectiveness, a deliberately robust prior can borrow modestly while allowing current data to dominate under conflict. Publish the prior distribution and the rationale before examining comparative outcomes.

Prior predictive checking is a concrete diagnostic. Draw parameters, simulate hypothetical datasets under the planned design, and summarize event rates, effect sizes, and subgroup patterns. If a prior implies an implausible mortality rate or enormous treatment benefit in many simulated trials, revise it with substantive justification. This does not prove the prior is correct; it ensures its implications are visible. Posterior predictive checks perform a parallel role after observing data by comparing replicated and actual data patterns.

## Relationship to frequentist analyses

Bayesian and frequentist analyses may use the same likelihood yet answer different inferential questions. A frequentist confidence procedure is designed to cover a fixed parameter at a stated long-run rate under repeated sampling. A Bayesian credible interval assigns posterior probability to parameter values conditional on the model and prior. With a diffuse prior and a well-behaved large sample, estimates may be numerically similar, but that approximation should not erase the distinction.

A Bayesian posterior probability that treatment benefit exceeds a threshold can directly support a decision rule, but the rule's operating characteristics should be evaluated under plausible scenarios. For a confirmatory trial, regulators and investigators may also require frequentist type I error control. A Bayesian design can simulate false-positive probability under a null and power under alternatives, then calibrate its posterior threshold. Such calibration does not make the posterior frequentist; it characterizes the decision rule's repeated-sampling behavior.

Bayesian credible intervals can differ from confidence intervals because of prior information, parameter constraints, or nuisance-parameter treatment. Do not say that a confidence interval has a 95% probability of containing the parameter. Conversely, do not omit prior dependence when describing a credible interval. Report both analyses when useful, but name their distinct assumptions and interpretations.

## Trial monitoring and sample size

Bayesian monitoring rules can use posterior probabilities such as (P(\theta>0\mid data)>0.99) for efficacy or (P(\theta< -\delta\mid data)>0.95) for unacceptable harm. The threshold and timing should be prespecified. Repeated posterior updating is mathematically coherent, but the practical decision still needs simulation for false-positive rates, power, expected sample size, and probability of stopping early under null and alternative scenarios. Do not invent a stopping rule after seeing interim evidence.

Bayesian sample-size planning can target expected posterior interval width, assurance (the probability that a future study achieves a desired posterior conclusion), or operating characteristics of a decision rule. Assurance averages conditional power over a prior distribution for the true effect; it is not the same as power at a single fixed effect. It can be strongly affected by the prior, so show scenarios and explain whose uncertainty the prior represents.

For adaptive or platform trials, borrowing across arms and stages can improve efficiency but creates dependencies that must be modeled. A shared control group, changing standard of care, or nonconcurrent controls cannot be treated as exchangeable without justification. Robust dynamic borrowing should be evaluated under prior-data conflict and temporal drift, not only under the scenario where all controls agree.

## Missing data and model uncertainty

Bayesian computation naturally propagates uncertainty for parameters inside a specified model; it does not automatically account for uncertainty about missingness or model choice. A Bayesian longitudinal model under MAR still relies on MAR unless missingness is modeled with an informative selection or pattern-mixture component. For MNAR analyses, place interpretable priors on sensitivity parameters and show how conclusions vary. The missing-data-and-imputation article details these mechanisms and sensitivity approaches.

Model averaging can incorporate uncertainty across candidate models by weighting posterior predictions by model probabilities. These probabilities depend on prior probabilities over models and parameters, and Bayes factors may be sensitive to prior scale. For clinical prediction, out-of-sample validation often offers a clearer comparison of predictive utility. For causal inference, model averaging does not eliminate confounding or identification assumptions.

## A complete analysis narrative

A credible report states the estimand, outcome likelihood, prior distributions and rationale, computation method, diagnostics, posterior summaries, predictive checks, sensitivity analyses, and decision rule. Include clinically interpretable quantities such as absolute risk differences and posterior probabilities of exceeding an important threshold. If a hierarchical model is used, report heterogeneity and how much subgroup estimates are pooled. If historical data contribute, describe their source and borrowing mechanism.

Readers should be able to reproduce the fit and see which assumptions drive the conclusion. Share code, simulation settings, software versions, and enough posterior diagnostics to assess computation. Explain disagreements with a frequentist analysis in terms of priors, likelihood, estimand, or small-sample behavior instead of calling one approach inherently more objective.

For the conjugate example above, a useful sensitivity analysis compares prior SDs of 2, 5, and 10. With observed estimate 4 and SE 2, the prior SD of 2 pulls the posterior more strongly toward zero than SD 5; SD 10 is nearly flat over the likelihood-supported range. Calculate (P(\theta>3\mid y)) for each prior, not only the interval endpoint. If this probability remains high across reasonable priors, the evidence for a clinically important effect is less prior-sensitive. If it changes substantially, describe the current data as insufficient to dominate prior assumptions.

The “reasonable” range should be set from domain knowledge and previous evidence, preferably before the primary estimate is known. An extreme prior included only to create a dramatic sensitivity result is not informative. Conversely, showing only a single prior hides an important modeling choice. A compact table of prior scale, posterior mean, credible interval, and threshold probability often makes the dependence easy to inspect.

When posterior summaries are transformed, such as from log odds to risk difference, transform every posterior draw and summarize on the target scale. Transforming only the posterior mean coefficient does not generally yield the posterior mean risk difference because nonlinear transformations do not commute with averaging. For a target population, standardize predictions over a prespecified covariate distribution; this produces a marginal quantity distinct from a conditional regression coefficient.

In a trial with 20 events among 100 control participants, a fitted model can generate replicated event counts under the posterior predictive distribution. If nearly all replications contain between 5 and 40 events, the observed count may be plausible; if the model almost never produces 20 because it ignores site heterogeneity, that mismatch points to a structural issue. Predictive checks are diagnostic prompts, not a formal proof of model adequacy. Check the summaries that matter to the scientific question, including tails and subgroup patterns.

Provide enough contextual information for readers to assess applicability: the target setting, historical evidence used, practical consequences of the chosen thresholds, and planned response to prior conflict. Bayesian results are conditional conclusions, and their usefulness depends on whether those conditions match the decision environment.

An explicit prior sensitivity table makes these conditions easier to inspect.

Report probabilities with clear thresholds and units.

## References and further reading

- Gelman A, Carlin JB, Stern HS, Dunson DB, Vehtari A, Rubin DB. *Bayesian Data Analysis*. 3rd ed. CRC Press; 2013.
- McElreath R. *Statistical Rethinking*. 2nd ed. CRC Press; 2020.
- Kruschke JK. *Doing Bayesian Data Analysis*. 2nd ed. Academic Press; 2014.
- Spiegelhalter DJ, Abrams KR, Myles JP. *Bayesian Approaches to Clinical Trials and Health-Care Evaluation*. Wiley; 2004.
- van de Schoot R, et al. Bayesian statistics and modelling. *Nature Reviews Methods Primers*. 2021;1:1. [doi:10.1038/s43586-020-00001-2](https://doi.org/10.1038/s43586-020-00001-2)
