---
title: Fisher’s exact test
summary: An exact test for a 2×2 table that uses the hypergeometric distribution, ideal when expected cell counts are small.
---

## Overview

Fisher’s exact test evaluates association in a contingency table by conditioning on its margins and using the hypergeometric distribution. It is especially useful for sparse 2×2 tables, where the large-sample chi-square approximation may be unreliable. “Exact” refers to the conditional sampling calculation under the null, not to freedom from assumptions: observations must still arise from a design compatible with the table model, and the result does not correct confounding or dependence.

## Why conditioning produces a hypergeometric law

If row and column totals are fixed, one cell determines the other three. Under the null of no association, the number of events allocated to one group follows a hypergeometric distribution. Fisher’s test sums probabilities for tables deemed at least as extreme as observed. For a one-sided alternative, extremeness has a clear direction; for two-sided alternatives, software may define it as tables with probability no greater than the observed table. Different two-sided conventions can give slightly different answers, so report software/method when relevant.

### Small trial example

Suppose a rare adverse event occurs in 1 of 12 treated patients and 5 of 12 controls. The observed risk difference is 33.3 percentage points lower on treatment, but the sample is small and the interval will be broad. Fisher’s exact test assesses the table conditional on its margins; it does not imply that conditioning is the only scientifically relevant sampling model.

```r
tab <- matrix(c(1, 11, 5, 7), nrow = 2, byrow = TRUE,
              dimnames = list(arm = c("treated", "control"),
                              event = c("yes", "no")))
fisher.test(tab)                    # two-sided conditional test
fisher.test(tab, alternative = "less")
```

Because the row order and outcome coding determine the direction, verify that “less” corresponds to the intended odds ratio before using a one-sided result. The two-sided test is the usual default unless a directional alternative was justified in advance.

## What an exact p-value does not do

Discrete data yield attainable p-values in jumps. A non-randomized exact test can be conservative: its actual Type I error may be below the nominal level. This is the cost of a valid finite-sample guarantee under the chosen conditional model. Mid-p methods reduce conservatism by assigning half the observed-table probability to the tail, but they are not guaranteed to control Type I error at the nominal level for every table. They should not be selected after seeing which version is significant.

Exactness also does not mean the effect estimate is precise. An odds ratio can be infinite or poorly estimated when a cell is zero; conditional maximum-likelihood estimates and exact intervals are available, but intervals may be wide. If risk is common, odds ratio can materially exceed the risk ratio. Provide absolute risks and a clinically interpretable contrast where possible, alongside an interval suited to sparse data.

### Beyond a simple 2×2 table

Fisher’s procedure extends to r×c tables, but the number of possible tables can grow quickly. Monte Carlo conditional sampling approximates exact p-values when full enumeration is expensive; report simulation settings or enough reproducibility details. For matched pairs use McNemar’s test, not Fisher’s test on a flattened table. For clustered observations or confounded comparisons, use an appropriate regression or design-based method; small cell counts may require penalized or Bayesian models with carefully stated assumptions.

Choose Fisher because the table and sampling design motivate conditional exact inference, not because it is a universal “small sample test.” State cell counts, effect estimate and interval, two-sided convention, and whether the analysis was prespecified. Interpret the p-value as compatibility evidence under the conditional null—not the chance that treatment has no effect.

## Manual probability calculation

Suppose 1 of 12 treated participants and 5 of 12 controls experience an adverse event. Conditional on 6 total events and equal group sizes, the number of events in the treated group X follows a hypergeometric distribution with N=24, K=6, n=12. The probability of observing x events is [choose(6,x) choose(18,12−x)]/choose(24,12). Fisher’s two-sided p-value sums probabilities for tables considered at least as extreme as the observed table under the software’s convention. The calculation is exact for this conditional distribution, not an approximation using a continuous curve.

```r
tab <- matrix(c(1, 11, 5, 7), nrow = 2, byrow = TRUE)
fisher.test(tab)
# Show the conditional probability of each possible exposed event count
x <- 0:6
dhyper(x, m = 6, n = 18, k = 12)
```

The hypergeometric probabilities sum to one over feasible x. Whether a two-sided test includes tables with probability no greater than observed or uses another ordering affects the p-value. R’s `fisher.test` reports a conditional maximum-likelihood odds ratio and conditional interval for a 2×2 table; its estimate can differ from the sample cross-product odds ratio. State the estimate type if reporting it.

### Exact does not mean assumption-free

The test conditions on both margins. In some designs, one margin is fixed by sampling, such as a case-control study fixing numbers of cases and controls. In other settings, both margins are random, and conditioning is still a valid test under common null models but may be less powerful than unconditional alternatives. Fisher’s procedure is a test of conditional association, not a universal method for every sparse table.

Independence of units remains essential. If each patient contributes multiple lesions, or if treatment is assigned by clinic, a 2×2 table of lesion counts violates the ordinary hypergeometric sampling assumption. If data are matched, use the pair structure (e.g. McNemar for paired binary outcomes). If there are strata, a conditional analysis or regression can account for them; pooling may create confounding or Simpson’s paradox.

## Zero cells and effect estimation

A zero cell can produce a sample odds ratio of zero or infinity. This is not a software malfunction; the data provide a boundary estimate. Fisher’s test can still return a finite p-value, while the interval may be very wide. Adding 0.5 to every cell is a common continuity correction for a rough log-odds interval, but it changes the estimator and is not a general exact solution. Conditional maximum likelihood, profile likelihood, mid-p, penalized logistic regression, or Bayesian models are alternatives with differing assumptions.

For communication, show absolute risks, risk difference, and an interval suited to the sparse data. If no events occur in one arm, do not conclude the risk is zero. The “rule of three” gives a rough upper 95% risk bound of 3/n after zero events under independent binomial sampling. Exact binomial intervals are readily calculated:

```r
binom.test(1, 12)$conf.int
binom.test(5, 12)$conf.int
```

The arm-specific intervals are not a direct interval for their difference; use a method for the two-sample contrast. Avoid inferring no harm from a small safety sample.

## Two-sided tests and one-sided alternatives

For a one-sided test, the alternative has a specified direction, such as treatment reducing event odds. Direction must be chosen before examining the data, and the opposite direction may remain clinically important. A one-sided test is not appropriate merely because observed events favor treatment. In sparse tables, discreteness means a one-sided p-value may not be half of the two-sided value.

Two-sided definitions are also not unique for discrete distributions. A probability-ordering rule adds probabilities of all tables with null probability at most that of the observed table. Other definitions double the smaller one-sided tail or use a likelihood-ratio ordering. They can yield different values. Report the software and alternative, especially near a decision threshold; do not shop across conventions.

### Extension to larger tables

For r×c tables, Fisher’s exact procedure conditions on all margins and sums over feasible tables. The number of tables can become large, making exact enumeration computationally demanding. Monte Carlo sampling estimates the conditional tail probability. Increase replicates when the p-value is near a threshold and report simulation uncertainty. For ordered categories, exact trend tests may use ordering; for sparse multivariable regression, exact logistic methods may be computationally intensive and still target conditional odds ratios.

## Design and reporting

A sparse table can reflect a rare event, a small study, an imbalanced allocation, or overly fine categories. Fisher’s test handles the approximation issue but cannot manufacture information. Sample-size planning for rare outcomes should consider expected number of events, follow-up, and a clinically meaningful difference, not just participant count. If events are very rare, accumulating person-time or combining evidence across studies may be more informative than a single underpowered trial.

Report the full table with counts and denominators, the effect estimate and interval, the exact or approximate method, sidedness, and how the two-sided extremeness was defined if material. Explain whether margins were conditioned on and how the sampling design supports that calculation. Interpret the result as evidence about association under the stated model. Causality still depends on randomization or confounding control, and clinical importance depends on absolute effect and uncertainty.

### Odds-ratio intervals and clinical meaning

The sample odds ratio for the example is (1×7)/(11×5)=0.127 for treated versus control. This suggests lower odds in the treated group, but its precision is poor because the table has only six total events. The exact test’s p-value is not an interval estimate. Report an appropriate conditional confidence interval and arm-specific risks; readers need the possible effect range as well as the test result. If the outcome is common, translate odds into predicted risks using a baseline risk because an odds ratio can exaggerate relative-risk reduction.

A difference between groups in a rare-event trial may be clinically important even if the exact p-value is not small. Conversely, a low exact p-value does not guarantee benefit if the table arises from a nonrandomized comparison with confounding. Sparse-event interpretation should foreground uncertainty, outcome severity, follow-up, and prior safety evidence.

## Power and information in rare outcomes

Fisher’s exact method can have lower power than an unconditional test because conditioning discards some information about random margins. A more powerful method may be justified if its sampling assumptions match the design. Regardless of method, power is driven by event counts and allocation. With one event in the treatment arm and five in control, the evidence is limited; adding non-event participants helps less than accruing informative events, though follow-up and risk population matter.

A trial planned for a rare event should calculate event yield under plausible baseline rates, expected treatment effect, and follow-up. If the anticipated event count is extremely low, a single trial may only exclude very large harms. Prespecified pooled safety monitoring, registry follow-up, or meta-analysis may be needed. Do not interpret absence of statistical significance as evidence of equal safety.

### Reporting exact analyses reproducibly

Include software and version when the exact definition or confidence interval method may differ. Record table orientation and outcome coding, because a one-sided direction depends on both. If Monte Carlo inference was used, state the number of replicates and seed. Provide raw cell counts in the manuscript or supplement; percentages hide the discreteness that determines exact inference.

## Mid-p and unconditional alternatives

The conventional exact test guarantees conditional Type I error control but can be conservative because p-values are discrete. A mid-p value assigns half the observed-table probability to the tail, which often improves power but can exceed the nominal false-positive rate for some configurations. Unconditional exact tests, such as Barnard’s or Boschloo’s tests, avoid conditioning on both margins and can be more powerful when their sampling model matches the design. These methods are not interchangeable defaults; specify the design and error guarantee sought.

For randomized two-arm trials with a fixed group allocation, unconditional methods may exploit the random allocation and event-count process. Fisher’s conditional analysis is familiar and robust in its scope but may lose power. If the primary claim depends on a threshold, sensitivity analysis across defensible exact procedures can show whether discreteness drives the decision, while the prespecified primary method remains clear.

### Rare events and risk difference

When events are rare, the odds ratio can be numerically close to the risk ratio, but absolute risk difference remains decision-relevant. If 1/12 versus 5/12 events, risks are 8.3% and 41.7%, a large observed difference with enormous uncertainty. The point difference of −33.3 percentage points should not be read as a stable treatment effect; its interval is wide. Exact test significance and effect precision should be discussed separately.

### Communicate the scope of exactness

The finite-sample calculation answers a narrow question conditional on margins and the null model. It does not account for uncertainty in exposure measurement, selection into the study, multiplicity, or causal confounding. A small exact p-value can still arise from a biased table, while a large one may reflect sparse information. Give the full table and confidence interval so readers can assess magnitude and uncertainty independently of the test.

### Compare exact inference with effect uncertainty

For the sparse 1/12 versus 5/12 table, the conditional exact p-value answers whether the allocation of six events is compatible with equal odds given the margins. A confidence interval for the odds ratio can span very large benefit and harm because only six events were observed. This is not contradictory: a test gives a tail probability under one null, while the interval reveals a broad set of effect values compatible with data. Clinical safety decisions should account for event severity, prior knowledge, and cumulative evidence.

### Stratification and confounding

If a prognostic factor such as disease severity is strongly associated with treatment allocation and event risk, an unstratified Fisher test can confound the comparison. For a small number of strata, a Cochran–Mantel–Haenszel analysis may estimate a common odds ratio under homogeneity; exact conditional logistic methods are another option. If effects vary by stratum, a single pooled association may be inadequate. Exactness does not remove confounding; design and covariate structure remain central.

### Distinguish association from intervention effect

In a randomized trial, treatment assignment can support a causal contrast, subject to adherence and missing outcomes. In a case-control study, sampling by outcome prevents direct risk estimation from the table; the odds ratio may estimate an exposure-disease association under appropriate sampling. In a cross-sectional survey, temporal direction may be unclear. Fisher’s calculation is the same form, but design determines which effect measure and causal interpretation are valid.

### Final reporting checklist

Report all four counts, group denominators, effect scale, interval, sidedness, exact method, and sampling design. For zeros, describe boundary estimates and uncertainty. For repeated or matched data, use the corresponding paired method. Do not characterize a non-significant sparse result as no association or safety equivalence.

### Practical comparison with chi-square

For a 2×2 table with adequate expected counts, Pearson chi-square and Fisher exact often give similar conclusions. Fisher conditions on margins and can be more conservative because the distribution is discrete. Yates-corrected chi-square can be similarly conservative but is still an approximation. Do not switch methods after seeing which result is significant. Prespecify a criterion based on design and counts, or report an appropriate sensitivity analysis transparently.

For larger tables, the choice may be driven by computational feasibility and whether conditioning is justified. Report if a Monte Carlo p-value was used, and quantify its simulation precision near a decision boundary.

### Conditional odds ratio interpretation

The conditional maximum-likelihood odds ratio reported by Fisher’s procedure estimates the association given the fixed margins. It can differ from the crude cross-product ratio, especially with small samples. A confidence interval may use conditional probability ordering and be conservative. If a ratio estimate will guide clinical decisions, also report arm-specific risks and an absolute contrast. The choice of effect measure should reflect whether sampling fixed exposure or outcome margins and whether risks are identifiable.

### Don't overstate a sparse table

A single event can move an odds ratio dramatically. Even if a test produces p<.05, the effect estimate may have a broad interval and need replication. If p>.05, the study may simply be uninformative. Explain the evidence scale without dichotomizing small counts into proof/no proof.

### Final interpretation

Fisher’s exact test is a useful finite-sample tool for sparse categorical comparisons when its conditional model matches the design. Its main output is evidence against a conditional null, not a guarantee of precision or causality. Pair it with event counts, absolute risks, a suitable interval, and careful discussion of how much the sparse data can establish.

### Software and reproducibility notes

R’s `fisher.test()` uses a conditional procedure; for 2×2 tables, it can calculate an exact p-value and conditional interval. Larger tables may use network algorithms or Monte Carlo simulation. Different packages can define two-sided extremeness or confidence limits differently. Record the method, alternative, and software version when results are consequential. A zero Monte Carlo exceedance count should never be reported as p=0; use the plus-one estimate and report its simulation precision.

### Final interpretation

Exact conditional inference is most valuable when counts are sparse and the table’s sampling structure supports conditioning on margins. The p-value is only one component of the result. Sparse data generally mean wide uncertainty, so discuss absolute risks and possible effect range, and avoid translating “exact” into “certain.”

## References and further reading

- Agresti A. *An Introduction to Categorical Data Analysis*. 3rd ed. Wiley, 2018.
- Fisher RA. *The Design of Experiments*. Oliver and Boyd, 1935.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis
  and Other Advanced Topics*. Brooks/Cole.
- The [chi-square test article](/biostatistics-library/comparisons/chi-square-test.html) describes the large-sample counterpart.
