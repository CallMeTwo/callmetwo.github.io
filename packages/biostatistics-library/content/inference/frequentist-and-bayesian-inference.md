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

## A common model, two probability statements

Consider observations `y` with likelihood `L(θ; y)`. Both frameworks use this likelihood, but their probability statements concern different objects. In frequentist inference, `θ` is fixed and a statistic such as `T(Y)` varies across repeated samples generated under the sampling model. In Bayesian inference, the observed data are conditioned upon and uncertainty about `θ` is represented by a distribution. The frameworks can agree closely with a well-calibrated likelihood and weakly influential prior, yet diverge with sparse data, boundary parameters, hierarchical shrinkage, or different conditioning choices.

A confidence interval is a procedure `C(Y)` satisfying `P_θ{θ ∈ C(Y)} ≥ 0.95` for relevant parameter values, under repeated sampling. The probability statement is about the procedure before data are observed. After observing an interval, frequentist theory does not assign a probability distribution to the fixed parameter. A Bayesian credible interval instead satisfies `P(θ ∈ C | y)=0.95` for the specified posterior, but a 95% credible interval can vary depending on whether it is equal-tailed or highest posterior density and on the prior and likelihood. A posterior probability is coherent conditional on that model; it is not a guarantee that the model is true.

A p-value is a tail probability under a null hypothesis and a specified test statistic/design: `P_{H0}(T(Y) at least as extreme as T(y_obs))`. It is not `P(H0 | data)`. A likelihood ratio compares how well parameter values explain observed data but is not itself a posterior odds ratio unless prior odds and a Bayesian model are supplied. A Bayes factor compares marginal likelihoods, integrating likelihood over parameter priors; its value can be sensitive to prior dispersion, especially under alternatives.

## Normal-normal calculation and prior sensitivity

Suppose an estimated treatment benefit is `y=3` points with known standard error `s=1.5`. A normal likelihood is proportional to `exp{−(θ−3)^2/(2×1.5²)}`. The frequentist Wald interval is `3 ± 1.96(1.5) = [0.06, 5.94]`; the corresponding two-sided p-value for `θ=0` is about 0.0455. This p-value is conditional on the null model and the test procedure; it is not the probability the treatment has no effect.

For a normal prior `θ~N(μ0,τ²)`, posterior variance and mean are:

`V = 1 / (1/τ² + 1/s²)` and `m = V(μ0/τ² + y/s²)`.

With `μ0=0`, `τ=4`, `V=1/(1/16+1/2.25)=1.973`, posterior SD is `1.405`, and posterior mean is `m=2.63`. The equal-tailed 95% credible interval is `2.63 ± 1.96(1.405) = [−0.12, 5.38]`. The posterior probability of benefit exceeding 1 point is `P(θ>1|y)=1−Φ((1−2.63)/1.405)≈0.877`. This probability answers a clinically framed event under the assumed model and prior.

The prior's role can be made visible by varying its SD. A very wide prior approaches the likelihood-based estimate; a tight skeptical prior pulls the posterior toward zero. Prior predictive simulation is often more informative than labeling a prior “weak.” For each candidate prior, simulate plausible treatment effects and outcomes before observing data and ask whether the implied magnitudes make scientific sense. When historical data inform a prior, assess compatibility and relevance across populations, endpoints, and standard of care. Robust mixture priors can borrow strongly when current data agree and discount historical evidence when they conflict, but their mixture weights and components still need justification.

## Estimation, testing, and decisions

Estimation is not synonymous with hypothesis testing. Frequentist reports can emphasize an estimate and confidence interval; Bayesian reports can provide posterior summaries, interval probabilities, and predictive distributions. For decisions, specify consequences. If action is warranted when a benefit exceeds a clinical margin, report the probability of that event and the harms/costs at stake. A frequentist confidence interval can also be compared to a prespecified margin, but a decision rule requires a policy that maps evidence to action and accounts for losses.

Bayesian decision theory chooses an action `a` minimizing posterior expected loss, `E[L(a,θ)|y]`. With two actions and a simplified benefit-harm threshold, the optimal choice depends on the posterior probability of benefit and the relative losses of false action and missed benefit. This makes explicit why `P(benefit>0|data)` alone is insufficient: a tiny benefit and a lifesaving benefit may have the same event probability but different utilities. Frequentist decision procedures can likewise be evaluated by repeated-sampling properties such as power, type I error, and expected loss.

Frequentist operating characteristics are especially important when a trial's public-health role requires controlled long-run false-positive risk. Bayesian designs can also be evaluated by simulation under null and alternative scenarios to quantify false-positive rates, power, sample size, and expected outcomes. Bayesian updating does not mean optional stopping is automatically harmless: posterior coherence under a fixed likelihood/prior can survive some stopping rules, but model misspecification, data-dependent model changes, multiplicity, and decision thresholds can still distort inference. Likewise, frequentist sequential methods can support valid interim looks when stopping is built into the design.

## Models, nuisance parameters, and hierarchical data

Both approaches require a likelihood that represents the data reasonably. Missing outcomes, clustering, censoring, measurement error, and outcome distributions need modeling in either framework. Frequentist likelihood-based inference often uses asymptotic approximations, bootstrap procedures, randomization inference, or exact methods. Bayesian inference integrates over parameter distributions and commonly uses MCMC or approximate computation. Neither a small p-value nor a concentrated posterior repairs selection bias or a bad measurement process.

Hierarchical models illustrate a practical difference in presentation. Bayesian partial pooling represents group effects as draws from a common distribution and yields posterior distributions for group estimates. Frequentist mixed models also shrink group estimates through estimated variance components. Results may be similar, but uncertainty accounting and interpretation differ. Report the level of inference: conditional effects, population-average effects, or group-specific predictions. For treatment effects across sites, specify whether the goal is an average effect or prediction for a new site.

## R illustration

For the normal-normal example, direct calculation needs no simulation:

```r
y <- 3; se <- 1.5; prior_mean <- 0; prior_sd <- 4
post_var <- 1 / (1 / prior_sd^2 + 1 / se^2)
post_sd <- sqrt(post_var)
post_mean <- post_var * (prior_mean / prior_sd^2 + y / se^2)
ci <- post_mean + qnorm(c(0.025, 0.975)) * post_sd
prob_gt_1 <- pnorm(1, mean = post_mean, sd = post_sd, lower.tail = FALSE)
c(post_mean = post_mean, post_sd = post_sd, lower = ci[1],
  upper = ci[2], probability_benefit_gt_1 = prob_gt_1)
```

This returns values close to 2.63, 1.405, −0.12, 5.38, and 0.877. It assumes the reported estimate is normally distributed with known standard error and that the prior is normal. In real analyses, uncertainty in variance, covariate adjustment, clustering, and missing data may require a fuller model. Validate MCMC convergence with multiple chains, trace plots, effective sample sizes, and diagnostics such as R-hat; convergence diagnostics indicate computational mixing, not model validity.

## Practical comparison and reporting

Do not choose a framework based on which produces the desired conclusion. Prespecify the estimand and analysis; describe model assumptions; report effect scale and uncertainty; distinguish confirmatory analysis from sensitivity analysis; and show how plausible alternatives affect conclusions. For a Bayesian analysis, report prior distributions and rationale, prior predictive checks, computational methods, convergence, posterior summaries, and sensitivity to priors. For a frequentist analysis, report sampling design, test and interval procedure, multiplicity/sequential adjustments, and relevant operating characteristics. In both, distinguish evidence for any nonzero effect from evidence for a clinically important effect, and make clear the role of external evidence and selection.


## Coverage, calibration, and repeated use

A nominal interval or test only has its advertised operating characteristic under its stated sampling model and analysis plan. A 95% interval may under-cover when standard errors ignore clustering, model selection, or informative censoring. A 5% test can exceed its error rate under repeated outcome switching or unadjusted multiple looks. These are not arguments against frequentist methods; they show that guarantees attach to a complete procedure, including design and analysis, rather than to a label.

Bayesian posterior probabilities also have calibration properties that can be examined. Across many comparable cases where a model assigns 90% probability to an event, those events should occur about 90% of the time under a well-calibrated predictive framework. Posterior predictive checks compare replicated data to observed summaries; prior predictive checks assess plausible data before seeing observations. Neither check proves truth, but each can reveal a model that cannot reproduce important features. In hierarchical models, inspect group-level predictions and not only marginal fit.

Confidence intervals and credible intervals may coincide under particular priors, likelihoods, and approximations. For example, a normal mean with known variance and a flat prior yields a posterior normal distribution centered at the sample mean, whose equal-tailed interval matches the usual confidence interval. This coincidence is model- and prior-specific; it does not erase the different interpretation. Conversely, a Bayesian credible interval need not have 95% repeated-sampling coverage for every parameter value, although good frequentist operating properties can be a design goal.

## Multiplicity, selection, and evidence synthesis

When many outcomes or subgroups are examined, the chance of at least one striking result rises. Frequentist family-wise or false-discovery procedures define particular error criteria; Bayesian hierarchical models can partially pool estimates and reduce extreme subgroup estimates, but shrinkage is not a substitute for prespecifying hypotheses or reporting all analyses. Selective publication changes the evidence base before either framework is applied. A posterior computed from a biased published likelihood remains conditional on a selected record unless the selection mechanism is modeled.

Evidence synthesis can combine studies in either framework. Frequentist meta-analysis estimates a pooled effect and heterogeneity under a specified model; Bayesian hierarchical synthesis places distributions on study effects and heterogeneity, permitting direct predictive distributions for a new setting. With few studies, heterogeneity estimates and priors can strongly influence inference. Report study comparability, outcome harmonization, and prediction intervals where relevant. A precise pooled average may not predict a local effect if context varies.

## A more complete reporting example

For the symptom trial above, a transparent report might say: “The estimated mean improvement was 3.0 points (standard error 1.5; 95% Wald confidence interval 0.06 to 5.94; two-sided p=0.046 for a zero-effect null). The interval procedure has nominal 95% coverage under the specified normal model. Under a prespecified normal prior N(0,16), the posterior mean was 2.63 points (posterior SD 1.41; 95% equal-tailed credible interval −0.12 to 5.38); the posterior probability that improvement exceeds 1 point was 0.88. Under a tighter skeptical prior N(0,1), this probability was substantially lower.” The exact numerical sensitivity should be calculated rather than described qualitatively in an actual report. This presentation distinguishes inferential questions and clinical margin, rather than presenting a p-value as the sole result.


## Computation and reproducibility

Frequentist estimates may use optimization, estimating equations, resampling, or randomization distributions. Report convergence warnings and fallback methods when optimization is unstable. For bootstrap intervals, resample at the independent sampling or randomization unit and repeat all data-adaptive steps. A bootstrap that resamples individuals in a cluster-randomized trial breaks the design and generally understates uncertainty. Randomization inference can provide a design-based test under the actual assignment mechanism, but its estimand and assumptions differ from model-based regression.

Bayesian computation approximates integrals that are often unavailable in closed form. Markov chain Monte Carlo requires assessing whether chains explore the posterior, including divergent transitions for Hamiltonian methods, effective sample size, R-hat, and trace behavior. A good diagnostic does not show that the posterior is substantively reasonable; posterior predictive checks and prior sensitivity are separate requirements. Variational approximations can be fast but may understate uncertainty. State software and versions and retain code, seeds, and data-processing decisions for reproducibility.

### Conjugate example for a binary outcome

For `x` events among `n` independent patients with event probability `p`, a Beta prior `p~Beta(a,b)` yields posterior `Beta(a+x,b+n−x)`. With a uniform `Beta(1,1)` prior and 12 events among 100 patients, posterior is `Beta(13,89)`. Its mean is `13/102≈0.127`; a credible interval can be computed with beta quantiles. A frequentist estimate is `12/100=0.12`; a Wilson interval is often preferable to a simple Wald interval for a proportion near boundaries. The Bayesian result is conditional on the prior and binomial model; the model assumes independent equal-probability observations, which may fail with clustering or heterogeneous risk.

```r
x <- 12; n <- 100; a <- 1; b <- 1
qbeta(c(.025, .975), a + x, b + n - x)
mean_post <- (a + x) / (a + b + n)
```

This illustration demonstrates conjugate updating, not a complete clinical analysis. If event probability varies by patient, use a regression model and report marginal risks as well as conditional coefficients. If observations are clustered, a beta-binomial or hierarchical model may be appropriate, with a prior on between-group heterogeneity and sensitivity analysis.


## References and further reading

- Wasserstein RL, Schirm AL, Lazar NA. [Moving to a world beyond “p < 0.05”](https://doi.org/10.1080/00031305.2019.1583913). *The American Statistician*. 2019;73(sup1):1–19.
- U.S. Food and Drug Administration. [Guidance for the Use of Bayesian Statistics in Medical Device Clinical Trials](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/guidance-use-bayesian-statistics-medical-device-clinical-trials). 2010.
- Greenland S, Senn SJ, Rothman KJ, et al. [Statistical tests, P values, confidence intervals, and power: a guide to misinterpretations](https://doi.org/10.1007/s10654-016-0149-3). *European Journal of Epidemiology*. 2016;31:337–350.
- The library's [introduction to Bayesian inference](../practice/introduction-to-bayesian-inference.html), [p-values and significance levels](p-values-and-significance-levels.html), and [confidence intervals](confidence-intervals.html) cover these tools in more detail.
