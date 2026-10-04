---
title: Bayes’ theorem
summary: How to update the probability of disease after a test result using prevalence, sensitivity, and specificity.
---

## Overview and key ideas

Bayes' theorem converts what you knew *before* a test (the **prior** or pre-test
probability) into what you know *after* it (the **posterior** or post-test
probability):

P(disease | positive test) = [P(positive | disease) × P(disease)] / P(positive)

The numerator combines the test's **sensitivity** with the disease **prevalence**.
The denominator, P(positive), averages the positive rate over people with and
without disease, using sensitivity and **specificity**:

P(positive) = sensitivity × prevalence + (1 − specificity) × (1 − prevalence)

The result, P(disease | positive test), is the **positive predictive value (PPV)**
— the quantity clinicians actually want. Its mirror image, P(disease | negative
test), is the negative predictive value (NPV).

## When to use it

| Setting | Example question |
| --- | --- |
| Screening low-prevalence disease | After a positive screening test in a general population, how likely is true disease? |
| Diagnosis in high-risk groups | In a symptomatic patient with high pre-test probability, how much does the same test change the probability? |
| Sequential testing | After two independent tests, what is the cumulative probability of disease? |
| Interpreting false results | How many positive results in a screening round will be false positives? |

## Assumptions and limitations

- **Prevalence must be that of the population being tested.** A PPV calculated
  from a low-prevalence screening population is meaningless in a specialist clinic
  where disease is common.
- **Sensitivity and specificity must apply to the tested population** (spectrum
  bias: a test that performs differently in mild vs advanced disease gives a
  misleading PPV if those proportions are not the ones assumed).
- For sequential tests, the tests must be **conditionally independent** given the
  true disease state; using the same assay twice does not halve the error rate.
- The theorem is exact; all error comes from the input estimates and from the
  population assumptions behind them.

### Odds form and likelihood ratios

Bayes' rule can also be written as posterior odds = prior odds × likelihood
ratio. For a positive result, LR+ = sensitivity/(1−specificity); for a
negative result, LR− = (1−sensitivity)/specificity. This form makes sequential
updating transparent: multiply odds by each test's likelihood ratio only when
tests are conditionally independent given disease status, or when a joint
model supplies the appropriate combined likelihood. Test performance can
also change with disease severity and setting, so likelihood ratios estimated
in a case-control sample should not be assumed to transfer unchanged to
screening.

## Worked example

A blood test screens for a disease with 1% prevalence, 95% sensitivity, and 99%
specificity. In 10,000 screened people:

- 100 truly have the disease; 95 of them test positive (true positives).
- 9,900 do not; 1% of them — 99 people — test positive (false positives).
- Total positives = 95 + 99 = 194, so PPV = 95/194 ≈ 0.49.

Equivalently, directly from Bayes: PPV = (0.95 × 0.01) / [(0.95 × 0.01) +
(0.01 × 0.99)] = 0.0095 / 0.0194 ≈ 0.49. So a positive result in this population
is almost a coin flip: even a highly specific test yields a PPV near 50% when the
disease affects only 1 in 100 people. If the same test is used in a group where
prevalence is 20%, PPV jumps to (0.95 × 0.20)/(0.95 × 0.20 + 0.01 × 0.80) ≈ 96%
— the same test, the same errors, a very different conclusion.

## Interpretation and common pitfalls

- **Base-rate neglect** — quoting sensitivity/specificity while ignoring
  prevalence; a 99%-specific test can still produce more false than true positives
  in rare disease.
- **Confusing PPV with sensitivity** — sensitivity is a property of the test
  (fixed, roughly, by the disease); PPV is a property of the *population* being
  tested and moves with prevalence.
- **Applying test characteristics out of context** — a PPV from a research study
  with case-enrichment does not transfer to routine practice.
- **Ignoring changing prevalence** — as screening erodes prevalence or as
  pre-test probability shifts with symptoms, the PPV of an unchanged test
  changes; update the prior accordingly.

## Bayesian updating: likelihood, prior, and posterior

Bayes' theorem follows from the definition of conditional probability: P(H|D)=P(D|H)P(H)/P(D). H is a hypothesis or state, D is observed evidence, P(H) is prior probability, and P(D|H) is the likelihood of the evidence under H. The denominator averages the likelihood over possible states. For two states, posterior odds equal prior odds multiplied by the likelihood ratio. This odds form makes clear that evidence changes prior odds according to how much more likely it is under one state than another.

In diagnosis, the likelihood ratio for a positive result is sensitivity/(1−specificity), while that for a negative result is (1−sensitivity)/specificity. A test with a large positive likelihood ratio can raise disease probability substantially, but the posterior still depends on pretest probability. Pretest probability should come from the intended setting and patient characteristics, not from the test result being interpreted. Repeated tests cannot be treated as independent evidence if their errors share a mechanism or if the second test was selected based on the first.

Bayesian inference also describes uncertainty about parameters. A prior distribution represents information or regularization before the current data; the likelihood represents the data model; the posterior is proportional to their product. A credible interval contains a stated posterior probability under the model and prior. Prior sensitivity is essential when data are sparse, events are rare, or the prior materially influences the result. A prior is not automatically subjective guesswork: it can encode external evidence, weak regularization, or exchangeability assumptions, but those choices must be transparent.

### Worked example: positive predictive value and likelihood ratios

For prevalence 1%, sensitivity 90%, and specificity 95%, prior odds are 0.01/0.99=0.0101. The positive likelihood ratio is 0.90/0.05=18. Posterior odds are 0.0101×18=0.1818. Converting back to probability gives 0.1818/(1+0.1818)=0.154. This matches the 2×2 table calculation: a positive test raises disease probability from 1% to about 15.4%, but does not make disease certain.

```r
prior <- 0.01
sensitivity <- 0.90
specificity <- 0.95
lr_pos <- sensitivity / (1 - specificity)
prior_odds <- prior / (1 - prior)
post_odds <- prior_odds * lr_pos
post_prob <- post_odds / (1 + post_odds)
c(likelihood_ratio = lr_pos, posterior_probability = post_prob)
```

This calculation assumes test characteristics transport to the current population and test reading is defined consistently. If multiple tests are conditionally dependent, multiplying their likelihood ratios overstates evidence.

### Beta-binomial updating for a risk

For x events among n exchangeable Bernoulli observations, a Beta(a,b) prior for event probability p and binomial likelihood yield a Beta(a+x,b+n−x) posterior. With a uniform Beta(1,1) prior and 8 events among 100 patients, the posterior is Beta(9,93), with mean 9/102≈0.0882. A 95% equal-tailed credible interval is obtained from the 2.5th and 97.5th percentiles of that beta distribution. This modest prior smooths estimates away from exact zero or one; with larger samples its influence wanes.

```r
x <- 8; n <- 100
a_post <- 1 + x
b_post <- 1 + n - x
c(posterior_mean = a_post / (a_post + b_post),
  lower = qbeta(0.025, a_post, b_post),
  upper = qbeta(0.975, a_post, b_post))
```

The posterior assumes a common risk and conditionally independent observations. Clustered patients or changing risks require hierarchical or regression models. A credible interval does not include uncertainty about model structure or prior choice; show sensitivity to reasonable alternatives when the data are weak.

### Reporting Bayesian analyses

State the likelihood, prior distributions and scales, computation method, convergence diagnostics for simulation, posterior summaries, and sensitivity analyses. Distinguish posterior probability of a hypothesis from a frequentist p-value. A posterior probability that a parameter exceeds a clinically meaningful threshold can directly address a decision question, but a treatment decision also depends on harms, costs, and preferences. Prior-posterior plots can reveal whether the data dominate the prior. The Bayes theorem and frequentist/Bayesian inference articles elsewhere in the library develop these interpretations.


## Prior specification and sensitivity analysis

Bayesian results can be sensitive to prior choice when information is limited. A conjugate prior makes updating transparent, but convenience does not make the prior scientifically neutral. For a binomial probability, Beta(1,1) is uniform on the probability scale; Beta(.5,.5) is Jeffreys' prior and places more mass near boundaries. A prior uniform on log odds is different again. Prior distributions should be assessed on the parameter scale clinicians understand, not only by their algebraic form.

In a nonrandomized comparison with sparse events, a weakly informative prior on log odds ratios can reduce implausibly extreme estimates caused by complete separation. Such regularization is especially helpful when there are many covariates relative to events, but the posterior still depends on model structure and prior scales. Compare plausible priors and report whether conclusions change. A “noninformative” prior does not exist independently of parameterization; transformations of parameters change what uniformity means.

### Worked example: posterior probability of exceeding a threshold

For 8 events among 100 participants and Beta(1,1) prior, the posterior is Beta(9,93). The posterior mean is 9/102=.0882. Suppose a clinically important threshold is 10%. Compute P(p>.10|data)=1−F_Beta(.10;9,93), which is approximately 0.309. This is a decision-relevant probability but does not itself decide whether to act: expected benefits, harms, and consequences of false decisions still matter.

```r
a_post <- 9; b_post <- 93
p_gt_10 <- pbeta(0.10, a_post, b_post, lower.tail = FALSE)
credible_interval <- qbeta(c(.025, .975), a_post, b_post)
c(posterior_mean = a_post/(a_post+b_post),
  probability_above_10pct = p_gt_10,
  lower = credible_interval[1], upper = credible_interval[2])
```

The prior contributes one pseudo-count to events and non-events under Beta(1,1), though this pseudo-count interpretation is specific to conjugate updating. If the 100 observations are clustered or from a selected population, the binomial likelihood is inadequate. A hierarchical model may partially pool site-specific risks; a transport model may be needed for another population.

## Bayesian intervals and frequentist properties

A 95% credible interval has 95% posterior probability under the model and prior. It does not automatically have 95% frequentist coverage for every parameter value; coverage can be checked by simulation under repeated data-generating conditions. Conversely, a confidence interval's repeated-sampling coverage does not provide a posterior probability statement after observing data. In many regular large-sample problems the intervals are numerically similar, but their interpretations and sensitivity differ.

Bayesian credible intervals can be equal-tailed or highest posterior density (HPD). Equal-tailed intervals allocate 2.5% posterior probability to each tail; HPD intervals contain the highest-density region but can be nonunique for multimodal distributions. State which is used. For asymmetric posteriors, the posterior mean, median, and mode differ; choose summaries based on loss function and decision context. If squared-error loss is relevant, posterior mean minimizes expected squared error; absolute-error loss favors the median.

## Hierarchical pooling and partial pooling

Suppose several hospitals each have a binary event rate. Separate estimates are noisy, while a single pooled estimate ignores real variation. A hierarchical model assumes site risks arise from a shared distribution and learns both overall distribution and site-specific values. Small sites are pulled more toward the overall mean; large sites remain closer to their data. This partial pooling can stabilize estimates, but depends on exchangeability: sites should plausibly be draws from a common population after included covariates. Extreme sites should not be dismissed as noise if they signal different care or data quality.

Posterior predictive checks compare simulated replicated data from the fitted model with observed features, such as event counts, zero counts, or between-site variation. Convergence diagnostics assess computation, not model truth. For Markov chain Monte Carlo, inspect trace plots, effective sample sizes, and R-hat; also check sensitivity to parameterization and priors. Report computational settings sufficiently for reproducibility.

## Sequential learning and decisions

Bayesian updating can incorporate evidence sequentially: posterior after study one becomes prior for study two if the likelihoods and populations are appropriately compatible. Avoid double-counting participants or reusing the same evidence. In clinical trials, Bayesian monitoring rules can define stopping based on posterior probabilities, but type I error and operating characteristics should be evaluated by simulation over null and alternative scenarios. A posterior probability threshold alone is not a full design.

For decisions, choose an action a to maximize posterior expected utility E[U(a,θ)|data]. This formalizes how uncertainty, benefit, harm, and preferences combine. Sensitivity to utility assumptions can be as consequential as prior sensitivity. The Bayesian article complements the library's randomized-trial, decision-curve, and health-economics articles.


## Conjugacy as transparent algebra

The beta-binomial update works because the likelihood contributes p^x(1−p)^(n−x), while the Beta(a,b) prior contributes p^(a−1)(1−p)^(b−1). Multiplying yields Beta(a+x,b+n−x). Posterior precision grows with total pseudo-count a+b+n, while posterior mean is a weighted average of prior mean a/(a+b) and observed proportion x/n. The weights are prior effective sample size and data sample size. This interpretation helps explain shrinkage and how prior influence declines as n grows.

For a Poisson count x over exposure T and Gamma(shape a, rate b) prior on λ, the posterior is Gamma(a+x,b+T). Its mean is (a+x)/(b+T). Parameterization matters: some software uses a scale rather than a rate, and confusing them yields incorrect results. Always state distribution parameterization.

### Worked example: Gamma-Poisson rate update

Assume a Gamma(2,100) prior for events per person-year, using shape-rate notation; prior mean is .02. Observe 12 events over 500 person-years. Posterior is Gamma(14,600), mean 14/600=.0233 per person-year. The data update prior belief rather than simply reporting 12/500=.024; with more exposure, the posterior mean moves closer to the observed rate.

```r
shape_post <- 2 + 12
rate_post <- 100 + 500
c(posterior_mean = shape_post / rate_post,
  lower = qgamma(.025, shape_post, rate = rate_post),
  upper = qgamma(.975, shape_post, rate = rate_post))
```

The prior is illustrative and must be justified against external knowledge. Gamma-Poisson conjugacy assumes a constant rate and Poisson counts; heterogeneity or time-varying rates needs a different model. If prior and current study populations differ, exchangeability is questionable and borrowing should be discounted or modeled hierarchically.

## Calibration, prior predictive checks, and conflict

Before seeing data, simulate parameters and data from the prior predictive distribution. Ask whether the implied event counts, risks, or treatment effects are plausible. A prior may look weak on the coefficient scale but imply near-certain outcomes over a clinical horizon. After observing data, compare prior and posterior and check for conflict: if the observed likelihood lies in a tail of prior predictive outcomes, investigate population differences, data errors, or prior misspecification. Sensitivity to a robust mixture prior can reduce overconfident borrowing from potentially incompatible historical data.

Prior predictive checks do not select a prior uniquely; they expose implications for review. Posterior predictive checks then assess whether fitted models can reproduce key data features. Both are necessary because a posterior can be computationally well-behaved while the model fails to represent observed heterogeneity or tail behavior.

## Combining prior and evidence without double counting

Prior information may come from previous trials, registries, or expert elicitation. If historical participants overlap with the current dataset, counting them again as prior evidence double-counts information. If the earlier and current populations differ, a fully exchangeable prior can overstate borrowing. Commensurate or power priors discount historical data according to compatibility; robust mixture priors allow a component with weak borrowing. The model choice should be motivated and sensitivity reported.

A simple meta-analytic prior for a treatment effect can use a normal distribution centered on prior evidence with variance reflecting both its uncertainty and expected between-study heterogeneity. A very narrow prior implies strong transportability across studies; this should be questioned when eligibility, standard care, outcome definition, or follow-up differ. Plot prior and likelihood on the same scale to reveal conflict.

## Decision thresholds and expected loss

Posterior probability is an input to decisions, not a decision rule by itself. For a binary action with benefit B if disease is treated and harm H if a person without disease is treated, treat when posterior disease probability exceeds H/(B+H) under a simple utility model. If false negatives have substantial harm, the threshold falls; if treatment toxicity is high, it rises. Real decisions can include diagnostic costs, downstream testing, and patient preferences. A threshold chosen for one setting may not be appropriate in another.

Decision analysis should show how conclusions change across plausible utility values and posterior uncertainty. This connects Bayesian estimation with decision-curve analysis and health economics, while keeping the probability model and preference assumptions distinct.

In clinical communication, convert posterior probabilities to natural frequencies when useful. A 15.4% probability among positive tests can be described as roughly 15 true cases among 100 positive results under the stated prevalence and test performance. Include the false-positive count and setting so patients understand why the same test result can imply a different probability in primary care and a specialty clinic.

A posterior probability is conditional on the model being used. If disease prevalence is misspecified, test accuracy is poorly estimated, or the likelihood ignores dependence, the numerical posterior can be sharply wrong despite exact arithmetic. Communicate the inputs and perform sensitivity analysis over plausible prevalence and test-performance ranges. Calibration against outcomes in the intended clinical workflow is necessary before deploying a Bayesian risk estimate as a decision aid.

## References and further reading

- Deeks JJ, Altman DG. [Diagnostic tests 4: likelihood ratios](https://doi.org/10.1136/bmj.329.7458.168). *BMJ*. 2004.
- Altman DG, Bland JM. [Diagnostic tests 2: predictive values](https://doi.org/10.1136/bmj.309.6947.102). *BMJ*. 1994.

- Bland JM, Altman DG. *Medical Statistics: A Companion Guide*. Nelson.
- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott Williams & Wilkins.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.

The [conditional probability article](conditional-probability-and-independence.html)
covers the underlying probability calculus.
