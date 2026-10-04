---
title: P-values and significance levels
summary: The p-value is the probability of data at least this extreme under the null hypothesis, compared with a prespecified threshold alpha to decide whether to reject it.
---

## Overview

A p-value is a tail probability calculated under a specified null model: assuming that model and the analysis procedure, it is the probability of obtaining a test statistic at least as incompatible with the null as the observed statistic. It is not the probability that the null is true, nor the probability that chance alone produced the data. Its meaning depends on the design, model, test direction, and analysis plan.

## What a threshold does

The significance level α is a long-run false rejection rate for a testing procedure when its null is true and assumptions hold. Choosing α=.05 means that in repeated valid studies of a true null, about 5% would cross the prespecified rejection boundary. It does not create a bright scientific boundary between “real” and “not real.” Values .049 and .051 carry nearly identical evidence, though threshold-based rules may treat them differently.

Consider an estimated treatment difference of 2.0 units with SE=1.2. The z statistic is 1.67; a two-sided normal p-value is about .096. A 95% interval is −0.35 to 4.35. The result is not proof of no effect: the interval includes potentially meaningful benefit and possible small harm. Interpretation asks which effects remain compatible and whether the study was precise enough to be useful.

```r
est <- 2
se <- 1.2
z <- est / se
p <- 2 * pnorm(-abs(z))
ci <- est + qnorm(c(.025, .975)) * se
c(z = z, p_value = p, lower = ci[1], upper = ci[2])
```

This calculation uses a normal reference distribution and a known or well-estimated standard error. In actual analyses, use the model-specific test and account for design, finite degrees of freedom, clustering, stratification, and multiplicity.

### Evidence is not magnitude

The p-value is influenced by effect size, variability, sample size, and analysis choices. With enormous n, a tiny and clinically irrelevant difference can yield a very small p-value. With a small study, an important effect can produce a large p-value because uncertainty is wide. Pair p-values with an effect estimate, interval, clinically meaningful benchmark, and transparent design description.

Optional stopping, endpoint switching, unplanned subgroup searches, and selective reporting change the effective probability of a false positive. A nominal p-value is valid only for the analysis that was actually prespecified or for a fully accounted exploratory procedure. Report all primary outcomes and planned analyses; identify post hoc findings and treat them as hypothesis-generating.

## Language that preserves meaning

Prefer “the estimate was X (95% CI L to U; p=...)” to “there was a trend” or “approached significance.” Avoid interpreting p>.05 as equivalence or p<.05 as clinical importance. For Bayesian analyses, posterior probabilities answer different questions and should not be called p-values. A p-value is one summary of data-model compatibility; scientific conclusions require design knowledge, effect magnitude, precision, and external evidence.

## A p-value is conditional on the whole procedure

The conventional definition hides a chain of conditions: a null model is specified; a test statistic is chosen; the sampling distribution under the null is derived or approximated; then extremeness is defined, including whether the test is one-sided or two-sided. The p-value is calibrated only if the complete data-generation and analysis procedure matches that construction. In randomized studies, randomization can justify design-based inference; in observational models, the reference distribution depends more heavily on distributional and confounding assumptions.

Exact tests can also yield p-values that are discrete because only a finite number of outcomes are possible. A p-value of .06 in a tiny trial does not differ substantively from .05, and the nominal threshold may be unattainable. Report the value and uncertainty rather than pretending the threshold is a natural law.

## Why p-values vary between replications

If the null is true and a test is valid, p-values are approximately uniform over repeated studies. When the alternative is true, their distribution depends on effect size and design. Therefore, one study’s p-value is a random draw; a replication can have a different result even with the same underlying effect. A small p-value can be followed by a larger one, and a value above .05 can be followed by a smaller one, without either study being fraudulent. Replication and synthesis should compare estimates and uncertainty, not tally “significant” outcomes.

The probability that a published significant result reflects a real effect depends on prior plausibility, power, bias, and selection, not only the p-value. For example, among a large set of low-prior-probability hypotheses with modest power, a meaningful fraction of nominal positives may be false even when every individual test is technically calibrated. This is one reason preregistration, complete reporting, and independent validation matter.

## Thresholds, multiplicity, and optional stopping

A fixed .05 rule assumes one planned test or a properly controlled family. Testing many outcomes, subgroups, or time points and highlighting any p<.05 increases false-positive risk. Repeatedly checking accumulating data and stopping when significance appears similarly changes the sampling procedure. Sequential tests and group-sequential boundaries provide valid alternatives when early stopping is planned. Exploratory analysis remains valuable, but its p-values should be treated as a starting point and findings independently checked.

Do not “correct” optional stopping by changing a threshold informally. Specify the stopping rule and use methods whose operating characteristics cover it. Do not suppress nonsignificant endpoints. A transparent report includes the registered primary analysis, deviations, all key outcomes, and a distinction between prespecified and exploratory results.

### Avoid significance language traps

“Statistically significant” means a specified decision threshold was crossed under the procedure; it does not mean large, clinically important, or likely to replicate. “Not significant” means the threshold was not crossed; it does not show absence of an effect. Report exact p-values sensibly (e.g., p=.032, p<.001) but avoid false precision such as p=.0000. Pair with an effect estimate and confidence interval. Discuss whether the data distinguish clinically important benefit from negligible or harmful effects, and name limitations that affect the model’s validity.

## Bayesian evidence is not a transformed p-value

A p-value describes how surprising a test statistic is under a null model. A Bayes factor compares how well two models predict the data, integrating likelihood over parameter distributions under each model. Posterior odds equal prior odds times the Bayes factor. The two can differ substantially because a p-value conditions on a point null and a test statistic, while a Bayes factor depends on the alternative prior and uses the likelihood more fully. Neither should be translated directly into the other without explicit assumptions.

This distinction explains why a small p-value does not tell how probable an effect is. The posterior probability requires a prior distribution over hypotheses or parameters. In repeated-testing settings, p-values require multiplicity control; Bayesian models can partially pool related effects, but they also depend on prior and model structure and can be overconfident if dependence or selection is omitted.

## P-value functions and compatibility

Rather than focusing on one threshold, a p-value function evaluates the test evidence over a range of hypothesized parameter values. Inverting two-sided tests yields confidence intervals: parameter values that would not be rejected form the interval under the corresponding procedure. This connection shows why a p-value alone is incomplete. The interval reveals which effect sizes are compatible with data at a sequence of thresholds, subject to the same model assumptions.

For example, if a 95% interval for risk difference is −1 to 8 percentage points, the data are compatible with slight harm and substantial benefit. A p-value above .05 for zero does not make all those values equally likely, but neither does it select one. The interval and likelihood shape should be interpreted with prior evidence and clinical context.

### Practical numerical reporting

Report p-values to a useful precision: p=.047 or p<.001, not p=.000. Avoid comparing two p-values as if their difference measures the difference between treatment effects. If arm A yields p=.04 and arm B yields p=.06, the results are not necessarily statistically different; test the contrast directly. Avoid phrases “trend toward significance,” “marginally significant,” or “highly significant,” which obscure the estimate and threshold convention.

For a preregistered primary test, explain α and whether the test was one- or two-sided. For secondary outcomes, describe multiplicity and exploratory status. When a p-value is reported alongside a confidence interval, ensure both use a compatible model and sidedness. Include enough information to reproduce the statistic, especially for permutation, exact, complex-survey, or sequential analyses.

### An applied reading exercise

Imagine two trials estimate the same 2-unit treatment benefit. Trial A has SE .7 and reports p=.004; trial B has SE 1.5 and reports p=.18. Their point estimates agree, but trial B is less precise. The p-values differ because their standard errors differ, not because the estimated benefit has changed. Trial A’s interval is roughly 0.6 to 3.4; trial B’s about −0.9 to 4.9. The second trial cannot distinguish no effect from a meaningful benefit. This is a much more informative comparison than labeling one trial positive and one negative.

If the trials are combined, use an appropriate synthesis that accounts for standard errors, heterogeneity, and design compatibility. Do not “vote count” significance. A p-value from a very large observational study can also be tiny while residual confounding makes the causal effect uncertain; design quality is not encoded in the tail probability.

### Tests as decision rules

In some settings, alpha is tied to a regulatory or programmatic decision. Then the decision rule should be written clearly: which endpoint, population, test, threshold, and handling of missing data lead to success. If a gatekeeping sequence is used, specify what happens when a prior gate fails. A p-value below threshold may satisfy a formal rule but the decision-maker should still examine effect size, safety, external evidence, and applicability. Statistical decision and clinical decision are related but not identical.

### Reproducibility and full reporting

Report the analysis model, test statistic where useful, degrees of freedom, sidedness, and exact p-value. If a test is permutation-based, give the number of permutations and random seed; if exact, state the conditional setup; if a sequential design, name the boundary or spending function. Make all outcomes and planned contrasts visible. Independent analysts should be able to reconstruct the inferential path from protocol through result, including deviations.

### A minimal reproducible p-value report

For a two-arm continuous primary outcome, a report should identify the contrast direction, estimate, standard error or interval, test statistic, degrees of freedom, p-value, and planned alpha/multiplicity method. For example, “The adjusted mean difference (intervention minus control) was −3.2 points (95% CI −5.7 to −0.7; t(184)=−2.64; p=.009), using the prespecified linear model.” This gives the reader enough to understand the result without overloading the narrative. Then interpret the interval against the MCID and discuss model assumptions.

For exact or resampling methods, specify the conditioning or randomization scheme. For rare events, distinguish one-sided from two-sided exact inference and acknowledge discreteness. For complex survey or cluster analyses, state the variance procedure because the p-value depends on it. An isolated p-value without this context is difficult to reproduce and easy to misread.

### Why “p=.05” is not a universal standard

Different fields and decisions tolerate different false-positive risks. A confirmatory drug approval may use stringent control across outcomes; exploratory quality improvement may prioritize rapid detection and tolerate more false alarms if followed by review. Lowering alpha does not make evidence intrinsically stronger; it changes the decision rule and usually reduces power. The chosen threshold must be declared before results and interpreted alongside consequences.

## Model checking and p-values

A model-based p-value can be numerically correct under its assumed sampling distribution yet scientifically misleading if the outcome model is wrong. Residual dependence, separation in logistic regression, overdispersion in count models, or unmodeled cluster effects can distort standard errors and reference distributions. Diagnostic checks do not prove assumptions, but they can expose major departures. Use robust, exact, permutation, or alternative-model sensitivity analyses when justified, and report the primary method rather than choosing the most favorable p-value.

For randomized experiments, randomization inference offers a design-based check that can be less reliant on parametric outcome assumptions. Its null must match the sharp or average-effect claim, and the randomization scheme must be faithfully reproduced. Multiple versions of the test are not interchangeable.

### Separate evidence, decision, and importance

A study can produce a small p-value and a trivial effect; it can also produce a large p-value and an effect that would matter if confirmed. Evidence against a null, a decision rule, and clinical importance are separate dimensions. A treatment decision may reasonably require more than statistical significance: safety, cost, alternative therapies, feasibility, and patient preferences matter. Conversely, a nonsignificant but precise estimate can rule out a worthwhile benefit.

Use wording that preserves uncertainty. “The data provide evidence of a reduction” is more defensible than “the treatment works” when intervals remain broad. “The estimated difference was small and imprecise” communicates more than “not significant.” If the confidence interval is incompatible with important benefit, say that specifically and indicate the assumptions under which the conclusion holds.

### Analysis flexibility and selective reporting

Analytic choices can affect p-values: excluding outliers, transforming outcomes, choosing covariates, changing endpoint timing, or trying alternate subgroup cuts. Some flexibility is legitimate when decisions respond to data quality, but undisclosed searching makes nominal p-values too optimistic. A preregistered analysis provides a reference point; a transparent deviation log makes later exploratory work interpretable.

Do not treat preregistration as a guarantee of validity. A prespecified model can still be inappropriate, and data may reveal unexpected problems. Explain the reason for alternatives, show how estimates change, and seek independent validation. Robust conclusions that persist across defensible analyses are more reassuring than a single threshold-crossing result.

### What a result can support

A small p-value can support the statement that the observed data are unusual under the specified null and procedure. It cannot by itself establish causality, clinical benefit, model adequacy, or reproducibility. A large p-value may leave important effects unresolved. The strongest report combines a defensible design, transparent analysis, complete outcome reporting, effect estimates with intervals, and a restrained conclusion.

Readers should see the study as one contribution to evidence, not a binary verdict. Synthesis across studies, external validation, and mechanistic understanding can change confidence in a treatment even when each individual result sits on one side or the other of .05.

### Confidence intervals reveal more than thresholds

For a two-sided test derived by inversion, a 95% confidence interval contains parameter values that would not be rejected at α=.05 under the same procedure. This connection helps explain why the interval is a richer summary: it shows how the conclusion changes across candidate effects, not just whether zero crossed a single boundary. It does not mean all values inside the interval have equal probability or all values outside are impossible.

If the interval spans the null and the MCID, the data leave clinical uncertainty. If it crosses the null but lies entirely below a worthwhile benefit threshold, the study can provide evidence against a large benefit without establishing exact zero. Describe that distinction directly.

### Communicating evidence without binary labels

A sound conclusion names the estimate, its uncertainty, and the plausible clinical interpretation. It may state that evidence was inconclusive for the prespecified superiority test while ruling out effects larger than a certain size. This is more useful than “negative trial.” Similarly, a statistically significant estimate with a tiny absolute difference may provide little reason to change care. Threshold labels should not replace effect-based reasoning.

### Keep exploratory questions useful

Exploration is essential for discovering unanticipated patterns. The appropriate response is not to suppress exploratory p-values but to disclose how the question arose, how many analyses were tried, and what independent evidence is needed. Label results as candidates, share the analysis path, and avoid presenting a selected finding as if it were the sole planned test. Transparent uncertainty allows useful leads without overstating certainty.

### Final interpretation

Treat p-values as calibrated summaries under an analysis procedure, not as universal evidence scores. A defensible account pairs them with the estimate, interval, design, analysis plan, and clinical threshold. The threshold organizes a decision; it does not replace scientific judgment, replication, or transparent reporting.

### Use p-values in cumulative evidence

A single p-value should be interpreted alongside prior studies, protocol adherence, outcome validity, and replication. Evidence accumulates through consistent effect estimates and uncertainty, not by counting how many studies crossed a binary threshold. Meta-analysis should examine design compatibility and heterogeneity, rather than combine p-values alone. This broader view reduces overreliance on one nominal result.

When p-values are rounded for display, preserve enough precision to distinguish values near prespecified decision boundaries.

If p-values are compared across studies, also compare effect estimates, standard errors, populations, and outcome definitions; a larger p-value can reflect lower precision rather than a smaller effect.

## References and further reading

- Wasserstein RL, Lazar NA. [The ASA's statement on p-values: context, process, and purpose](https://doi.org/10.1080/00031305.2016.1154108). *The American Statistician*. 2016;70(2):129–133.
- Greenland S, Senn SJ, Rothman KJ, et al. [Statistical tests, P values, confidence intervals, and power: a guide to misinterpretations](https://doi.org/10.1007/s10654-016-0149-3). *European Journal of Epidemiology*. 2016;31:337–350.
- Lang TA, Altman DG. [The SAMPL guidelines](https://www.equator-network.org/reporting-guidelines/sampl/), basic statistical reporting in biomedical journals.
- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott-Raven.
- The [null and alternative hypotheses article](/biostatistics-library/inference/null-and-alternative-hypotheses.html) describes the hypotheses that p-values evaluate.
