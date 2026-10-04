---
title: Bayes’ theorem
summary: How to update the probability of disease after a test result using prevalence, sensitivity, and specificity.
---

## Overview

Bayes’ theorem updates a probability after observing evidence. It combines a prior probability with how likely the evidence is under competing states of the world. In clinical medicine, it converts pre-test probability into post-test probability using sensitivity and specificity, or updates belief about a treatment effect using a likelihood and prior distribution. The arithmetic is simple; the hard work is specifying the population, prior information, and evidence model correctly.

## Diagnostic testing through counts

Suppose disease prevalence is 1%, test sensitivity is 90%, and specificity is 95%. Among 10,000 people, about 100 have disease, of whom 90 test positive. Of 9,900 without disease, 5% or 495 test positive falsely. Thus PPV=90/(90+495)=15.4%. Even a reasonably sensitive and specific test yields many false positives in a low-prevalence population.

Bayes’ formula expresses this as P(D|+)=P(+|D)P(D)/P(+), where P(+)=P(+|D)P(D)+P(+|not D)P(not D). The prior/pre-test probability is prevalence or an individualized clinical probability before the result; likelihood terms encode test behavior; the posterior is probability of disease after the result.

```r
prev <- .01
sens <- .90
spec <- .95
ppv <- sens * prev / (sens * prev + (1 - spec) * (1 - prev))
ppv
```

This assumes sensitivity/specificity apply to the target population and test result is correctly classified. Predictive values change with prevalence even if test characteristics remain constant. Spectrum effects can also change sensitivity/specificity across settings.

## Odds and likelihood ratios

Pre-test odds are p/(1−p). A positive likelihood ratio is LR+=sensitivity/(1−specificity), and post-test odds=pre-test odds×LR+. Convert back to probability by odds/(1+odds). For a negative result use LR−=(1−sensitivity)/specificity. This odds form is convenient for sequential evidence and illustrates that a test result multiplies, rather than replaces, prior odds.

With prevalence .01, pre-test odds≈.0101 and LR+=.90/.05=18, giving post-test odds≈.182 and probability .154. A positive result raises probability substantially, yet does not make disease more likely than not. A second test’s likelihood ratio can be multiplied only if conditional independence is defensible given disease status; correlated tests can double-count the same signal.

## Bayesian parameter updating

In Bayesian statistics, a prior density p(θ) and likelihood p(y|θ) produce posterior p(θ|y)∝p(y|θ)p(θ). A credible interval contains a stated posterior probability under the model and prior. The prior encodes knowledge or regularization before the current data; it should be described and checked with prior predictive simulations. Weakly informative priors can stabilize implausible estimates without dominating data, but “noninformative” is not invariant across parameterizations.

### Interpretation and common pitfalls

Do not confuse P(Disease|positive) with P(positive|Disease); these reverse conditional probabilities and can differ greatly. A positive predictive value from a referral clinic may not transport to population screening. The prior should represent pre-test risk in the evaluated population, not a generic prevalence from an unrelated setting. For treatment effects, Bayesian posterior probabilities depend on prior and likelihood; they are not frequentist p-values.

Bayes’ theorem updates evidence but does not correct biased tests, selection, confounding, or data leakage. Report the prior, likelihood, target population, and sensitivity analysis. If the decision is whether to treat, posterior probability alone is not enough: harms, benefits, costs, and patient preferences determine the action threshold.

## Natural frequencies prevent base-rate errors

The prevalence calculation becomes intuitive when represented as a cohort of 10,000. With 1% disease prevalence, 100 people have disease and 9,900 do not. Sensitivity .90 yields 90 true positives and 10 false negatives. Specificity .95 yields 9,405 true negatives and 495 false positives. Of 585 positive tests, 90 are true disease, so PPV=15.4%. The false-positive count is large because the non-diseased group is much larger than the diseased group.

Changing prevalence changes predictive value. At 10% prevalence among 10,000, there are 1,000 diseased, 900 true positives; 9,000 non-diseased, 450 false positives; PPV=900/(900+450)=66.7%. Sensitivity and specificity were held constant in this arithmetic. In practice, spectrum effects can change them too, so transportability is not guaranteed.

### Likelihood ratios and sequential evidence

LR+ compares probability of a positive result in diseased versus non-diseased people. LR− compares probability of a negative result under those conditions. A positive result multiplies pre-test odds by LR+; a negative result multiplies by LR−. An LR near 1 provides little information. Odds convert to probability by p=odds/(1+odds).

With prior probability .10, odds=.111. If LR+=5, posterior odds=.556 and probability=.357. A “positive” result therefore raises risk from 10% to about 36%, not to 50%. Whether that crosses a treatment or confirmatory-testing threshold depends on consequences. A second test may contribute another LR, but only if results are conditionally independent given disease or the joint likelihood is modeled. Two correlated biomarkers can supply much less combined evidence than multiplying their marginal LRs suggests.

## Prior predictive checking for Bayesian models

For parameter inference, prior predictive simulation asks what data the prior and likelihood imply before observing the study. If a prior on a treatment effect predicts implausibly large response rates, extreme negative probabilities, or impossible biomarker values, it should be reconsidered. This check is distinct from posterior predictive checking, which evaluates whether the fitted model can reproduce observed features.

An informative prior should describe evidence source, population, outcome definition, and why it is exchangeable with the current setting. Historical controls may differ in supportive care or eligibility. Robust mixture priors can discount historical information when current data conflict, but the borrowing rule should be designed and simulated before the trial.

## Decisions and thresholds

A posterior disease probability does not alone determine action. If treatment prevents a severe outcome with little harm, a lower threshold may be rational; if treatment is toxic, a higher threshold may be preferred. Expected utility or a decision curve formalizes benefit and harm. The test decision can involve confirmatory testing, surveillance, or treatment, each with different consequences.

Bayes’ theorem updates probabilities conditional on stated evidence. It cannot correct a biased sample, imperfect reference standard, or unmeasured confounding. Report prevalence source, test characteristics and uncertainty, target population, and any dependence assumptions. For Bayesian parameter analyses, report prior, likelihood, posterior summaries, and sensitivity analysis. Keep posterior probability distinct from p-value and from action threshold.

### Update with a second test

Suppose pre-test probability is 15%, LR+ for an initial test is 4, and a confirmatory test has conditional LR+=6 among people positive on the first test. Initial odds=.15/.85=.176; after the first result, odds=.706 and probability=.414. If the second result is conditionally independent given disease, odds then become 4.24 and probability=.809. The independence condition is strong: tests using the same biomarker may have correlated errors, so multiply joint likelihood ratios only if validated.

A sequential pathway changes who receives the second test. Its sensitivity and specificity in first-test-positive patients may differ from values measured in an unselected cohort. Verification bias occurs if only positives receive the reference standard; then estimated test accuracy can be biased. Model the testing pathway and report the population to which test performance applies.

### Bayesian estimation of a probability

For k successes among n Bernoulli observations, a Beta(a,b) prior is conjugate: posterior is Beta(a+k,b+n−k). With a uniform Beta(1,1) prior and 12/200 events, posterior is Beta(13,189); posterior mean is 13/202≈6.44%, slightly above sample proportion 6%. A prior centered near a known baseline risk can shrink more strongly, but its influence should be examined.

```r
k <- 12; n <- 200
post_a <- 1 + k; post_b <- 1 + n - k
c(mean = post_a/(post_a + post_b),
  quantile(qbeta(c(.025, .975), post_a, post_b)))
```

A posterior credible interval is conditional on prior and binomial model. If participants are clustered or risk varies, the simple binomial likelihood underestimates uncertainty; use a hierarchical model or beta-binomial variation.

## Prior sensitivity and reference information

Priors should be specified on the parameter scale and justified by prior predictive behavior. A uniform prior on probability is not uniform on log odds or logit scale. An informative prior may be valuable when previous high-quality trials exist, but populations, endpoints, and care standards must be comparable. Discount or robustify historical borrowing when conflict is plausible.

Show posterior results under at least a defensible primary prior and plausible alternatives when prior influence could matter. Report posterior probabilities for clinically meaningful thresholds rather than only a posterior mean. State whether a prior is skeptical, weakly informative, or based on external data, and explain the source.

### Uncertainty in sensitivity and specificity

The 90% sensitivity and 95% specificity in the screening example are estimates, not constants. Their uncertainty depends on how many diseased and non-diseased participants were tested. If sensitivity is estimated from 100 diseased people, a few classifications can shift it materially. PPV uncertainty depends jointly on prevalence and test performance. A plug-in Bayes calculation may therefore look more certain than evidence warrants.

For formal inference, use a joint model for prevalence, sensitivity, and specificity or propagate uncertainty by bootstrap/Bayesian posterior simulation. Preserve the sampling design: case-control diagnostic studies often oversample disease and require separate prevalence information to estimate predictive values. Verification of disease status only among test-positive participants creates verification bias.

### Calibration and transport

A predicted probability is calibrated if, among people assigned probability p, approximately fraction p experience the event. Test likelihood ratios and Bayesian posterior risks should be checked in the target setting. A model calibrated in a specialty clinic may overpredict in primary care because prevalence and case mix differ. Recalibration of the intercept may address prevalence shift under assumptions, but changes in sensitivity or disease spectrum require more extensive validation.

### Prior odds and evidence strength

With prior probability .01, pre-test odds are about 1:99. An LR+ of 10 gives posterior odds 10:99 and probability about 9.2%, not 10% exactly. Even a strong likelihood ratio may leave low posterior probability when prior risk is tiny. Conversely, a negative result with LR−=.1 can leave substantial risk when prior probability is high. Clinical thresholds should be compared with posterior probability, and additional testing may be warranted.

### Likelihood and posterior predictive checks

In Bayesian models, posterior predictive checks simulate replicated data from the posterior and compare features such as event rates, extremes, subgroup patterns, and residual correlations with observed data. Poor fit signals that the likelihood may miss heterogeneity or dependence. A posterior distribution can be numerically precise and still be misleading under model misspecification. Sensitivity to priors addresses only one source of modeling uncertainty.

## Communicating updates

A transparent statement gives prior probability, test result, likelihood ratio or sensitivity/specificity, and posterior probability. If risk is described as “one in N,” convert consistently and specify the population. For treatment models, show posterior interval and probability beyond a clinically relevant threshold, along with prior and model. Separate statistical belief updating from the decision about whether to treat.

### Diagnostic test uncertainty

The sensitivity and specificity estimates themselves have binomial uncertainty, and prevalence may also be estimated imprecisely. A useful sensitivity analysis varies all three across plausible ranges and recalculates PPV/NPV. For example, a test with fixed sensitivity/specificity may have much lower PPV when prevalence halves. If clinical action depends on a threshold, show whether the posterior probability crosses that threshold across the range rather than reporting a single plug-in estimate.

### Calibration and subgroup performance

A test’s likelihood ratio can vary by disease severity, age, comorbidity, or setting. Sensitivity measured in severe hospitalized cases may overstate performance in early disease screening. Validate predictive values in the target population or transport using prevalence and spectrum information. A positive result does not have one universal meaning across settings.

### Bayesian decision threshold

Suppose treatment is beneficial if disease is present but causes harm if absent. Expected utility can define the posterior probability threshold at which treatment’s expected benefit exceeds expected harm. That threshold depends on outcome values and treatment effects, not just test accuracy. Shared decision-making may alter utilities. Keep clinical decision thresholds distinct from statistical cutoffs such as p<.05.

### Prior probability and referral populations

A pre-test probability should represent the person’s clinical population before the test. A study that recruits many cases and controls for precision does not preserve disease prevalence; its PPV is not a population PPV. Referral clinics are enriched for disease, so a positive result there has higher predictive value than in community screening. When moving between settings, update using a defensible prevalence and assess whether likelihood ratios transport.

### Common reporting errors

Do not say a test is “95% accurate” without defining accuracy as a weighted combination of sensitivity and specificity at a particular prevalence. Do not describe sensitivity as the chance a positive patient has disease. State the denominator and target. For Bayesian analyses, do not call a 95% credible interval a confidence interval or omit the prior that generates it.

### Sensitivity analysis example

If prevalence falls from 2% to .5% while sensitivity .90 and specificity .95 remain fixed, PPV becomes .009/(.009+.04975)=15.3%. If specificity improves to .99 at .5% prevalence, PPV becomes .0045/(.0045+.00995)=31.1%. This shows why small specificity changes can strongly affect screening PPV at low prevalence. Treat these as scenarios, not a guarantee: performance may change with disease spectrum and verification method.

### Prior-data conflict

A strong prior can conflict with current evidence. In a Bayesian model, report the conflict, inspect data and model fit, and perform sensitivity analyses with weaker or robust priors. Automatically overriding current data with historical information or discarding a prior after observing results undermines the analysis plan. In hierarchical borrowing, quantify how much prior effective sample size contributes.

### Clinical thresholds and expected consequences

A posterior probability of 20% can warrant treatment if missed disease is catastrophic and treatment is safe, while a 70% probability may not justify a toxic intervention. Decision threshold depends on relative harms and benefits. Expected utility compares outcomes weighted by their values; diagnostic decision curves express net benefit over threshold probabilities. Bayes supplies updated risk, while utility determines action.

### Bayesian intervals and frequentist calibration

A 95% credible interval contains 95% posterior probability conditional on prior and model. Its repeated-sampling coverage may be above or below 95% depending on prior and truth. A frequentist 95% confidence interval has long-run coverage under its procedure but not posterior interpretation. Report the framework accurately and assess sensitivity when decisions are high stakes.

### Population transport and prior sensitivity

Predictive values depend on prevalence, but likelihood ratios can also vary with disease spectrum. Recalculate posterior risks across plausible prevalence and accuracy ranges when a test moves from specialty care to screening. In Bayesian parameter analysis, vary prior scale and shape; a prior that looks weak on one parameterization may be informative on another. Report how clinically relevant posterior probabilities change, not merely that a sensitivity analysis was run.

### Communication in natural frequencies

For patient discussions, “about 15 of 100 positive results indicate disease” may be clearer than PPV=.15. Use a denominator appropriate to the decision and explain uncertainty in test performance. Natural frequencies preserve the base rate and help patients understand false-positive follow-up burden.

### Updating clinical evidence responsibly

The prior is an explicit starting point, not a claim of certainty. Current evidence changes it through the likelihood, while model checking and replication determine whether the update is credible. For diagnostic use, show how risk changes across plausible prevalence; for treatment inference, show prior sensitivity and clinically relevant posterior probabilities. Separate the posterior statement from the utility-based decision.

### Communicating posterior intervals

A credible interval’s probability statement is conditional on model and prior. If a 95% posterior interval for risk is 3% to 9%, the model assigns 95% posterior probability to that interval. It does not mean 95% of future patients will have risk in that range; that requires a predictive distribution. In counseling, distinguish uncertainty about a population parameter from variability in an individual’s outcome.

### Practical workflow

Define the target population and prior risk; check test performance in a comparable spectrum; calculate posterior risk with a transparent table or odds update; evaluate uncertainty and dependence; then compare with decision thresholds and patient preferences. Reassess calibration after implementation. This workflow keeps a correct equation from being used with mismatched inputs.

### Avoid overconfident likelihood multiplication

In sequential testing, dependence is often hidden by treating each result as new independent evidence. If two tests share the same assay platform or biomarker, their errors may be correlated even after conditioning on disease. Use joint performance data or a model that includes dependence. Multiplying likelihood ratios without this check can produce a posterior probability that is far too high.

A final report should state the posterior’s conditioning assumptions and whether probability refers to disease, a parameter, or a future outcome; these are distinct targets.



In high-stakes settings, show alternative prior and test-performance scenarios and explain whether the action decision changes.


When discussing an individualized posterior risk, specify whether the prior is population prevalence or a patient-specific pre-test probability based on symptoms and history.

A threshold-based treatment decision should also consider the probability and severity of harms under treatment, not disease probability alone.

## References and further reading

- Deeks JJ, Altman DG. [Diagnostic tests 4: likelihood ratios](https://doi.org/10.1136/bmj.329.7458.168). *BMJ*. 2004.
- Altman DG, Bland JM. [Diagnostic tests 2: predictive values](https://doi.org/10.1136/bmj.309.6947.102). *BMJ*. 1994.

- Bland JM, Altman DG. *Medical Statistics: A Companion Guide*. Nelson.
- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott Williams & Wilkins.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.

The [conditional probability article](conditional-probability-and-independence.html)
covers the underlying probability calculus.
