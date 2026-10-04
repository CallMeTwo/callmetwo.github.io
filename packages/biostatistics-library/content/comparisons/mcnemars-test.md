---
title: McNemar’s test
summary: A paired test for changes in a binary outcome before and after treatment, or between two matched measurements.
---

## Overview

McNemar’s test analyzes paired binary outcomes by asking whether changes in one direction occur as often as changes in the opposite direction. It is used for before/after classifications, matched case-control pairs, or paired diagnostic readings. The marginal totals matter, but only discordant pairs provide evidence about asymmetry; concordant pairs contribute no directional information.

## Discordance is the information

Write the matched outcomes in a 2×2 table. Let b be positive before and negative after; c be negative before and positive after. Under equal marginal probabilities, conditional on b+c discordant pairs, b follows Binomial(b+c, .5). The large-sample McNemar statistic is (b−c)²/(b+c), approximately chi-square with 1 df. A continuity-corrected version subtracts 1 from |b−c|; exact binomial inference is preferable when discordances are sparse.

### Worked example: improved classification

Among 80 patients evaluated before and after a diagnostic training, 10 change from incorrect to correct and 3 from correct to incorrect. The net difference in marginal correct classifications is (10−3)/80=8.75 percentage points. Conditional on 13 discordant pairs, the probability under symmetry of at least this imbalance can be obtained from a binomial test. The paired structure is essential: comparing the two marginal proportions as if each came from 80 different patients ignores covariance.

```r
tab <- matrix(c(42, 3, 10, 25), nrow = 2, byrow = TRUE,
              dimnames = list(before = c("correct", "incorrect"),
                              after = c("correct", "incorrect")))
mcnemar.test(tab, correct = FALSE)
binom.test(x = 10, n = 13, p = .5)
```

Confirm row/column orientation before interpreting the direction. `mcnemar.test` is asymptotic; exact binomial test here makes the discordant-pair calculation explicit. If table labels are switched, the p-value is unchanged but the directional narrative reverses.

### Effect size and uncertainty

The paired marginal risk difference is (c−b)/N or (b−c)/N depending on the stated direction. Report the two discordant counts, total N, and that risk difference with an interval designed for paired proportions. McNemar’s p-value alone does not quantify magnitude. A result can have a small p-value with a modest net change when N is large, or a large observed difference with wide uncertainty when few participants are discordant.

The test’s null concerns equality of marginal probabilities, not agreement. High agreement can coexist with asymmetric change, and low agreement can coexist with equal margins. For agreement questions, report a measure such as kappa with its limitations; for diagnostic accuracy against a reference standard, sensitivity/specificity may be the target.

### Design boundaries

Each matched pair should be independent of other pairs. More than two repeated binary measurements require a longitudinal method such as generalized estimating equations or mixed-effects logistic regression. Clustered pairs need cluster-aware inference. In before/after studies, McNemar controls the paired comparison but does not control secular trends, regression to the mean, or concurrent interventions; it estimates a marginal change, not necessarily a causal intervention effect.

Specify outcome definition, timing, pairing mechanism, handling of missing pairs, exact versus asymptotic method, and the direction of the difference. Excluding participants with one missing measurement can bias results if missingness depends on outcome. The meaningful sample size for the test is the number of discordant pairs, so planning should consider expected discordance, not only total enrollment.

## The probability model behind the test

For n paired binary outcomes, let p10 be the probability of outcome 1 at the first occasion and 0 at the second, and p01 the reverse. Equality of marginal probabilities is equivalent to p10=p01. Conditional on the number of discordant pairs m=b+c, each discordant pair points in either direction with probability .5 under the null. Thus b|m follows Binomial(m,.5). This conditional argument eliminates the concordant cells and explains why precision depends on discordance rather than N alone.

The uncorrected statistic (b−c)²/(b+c) is the square of a large-sample standardized difference. A continuity correction reduces its magnitude by one in the numerator before squaring. The exact binomial test uses the discrete reference distribution and controls size conditionally, though attainable p-values are coarse. For small m, report the exact result and both directional counts; for large m, asymptotic versions converge.

## Worked calculations and direction

Suppose among 100 people, 18 move from negative before to positive after and 6 move from positive before to negative after. Net positive prevalence increases by (18−6)/100=12 percentage points. The uncorrected chi-square statistic is 12²/24=6, giving p≈.014 with 1 df. The exact two-sided binomial probability is P(X≤6 or X≥18) for X~Binomial(24,.5), about .023. This difference is expected because the exact distribution is discrete and the chi-square approximation smooths it.

```r
b <- 18 # before negative, after positive
c <- 6  # before positive, after negative
n <- 100
risk_difference <- (b - c) / n
stat <- (b - c)^2 / (b + c)
c(rd = risk_difference, X2 = stat,
  asymptotic_p = pchisq(stat, df = 1, lower.tail = FALSE))
binom.test(b, b + c, p = .5)
```

Always define the table orientation and the sign of the reported risk difference. Reversing before and after changes its sign but not the two-sided p-value. In R, `mcnemar.test()` expects a square matrix with paired categories; verify which off-diagonal cells correspond to each transition.

## Paired marginal difference and uncertainty

The paired marginal risk difference equals (b−c)/n under the stated coding. Its estimated variance depends on the joint distribution of the paired outcomes, not on the two marginal binomial variances alone. A naive two-independent-proportions interval ignores positive or negative pairing and can be too wide or too narrow. Use a paired-proportion interval, score method, or bootstrap that resamples complete pairs. For small samples, intervals can be asymmetric and exact methods conservative.

The matched-pair odds ratio b/c summarizes the ratio of the two discordant transition probabilities. It differs from the marginal risk ratio and can be unstable when either discordant cell is zero. If all discordant pairs move one direction, a boundary estimate occurs; report counts and an interval rather than adding an arbitrary correction without disclosure.

## Agreement is a different target

McNemar tests marginal homogeneity, not whether two measurements agree person by person. If both methods label every participant positive, margins agree perfectly but classification agreement is trivial. If a diagnostic test replaces another, examine sensitivity/specificity against a reference standard, positive/negative agreement, and kappa where appropriate. Kappa is prevalence-sensitive and should not be treated as a universal agreement metric. McNemar can detect systematic directional disagreement, but not which classification is correct.

### Beyond two measurements and independent pairs

For three or more repeated binary occasions, Cochran’s Q extends the marginal-homogeneity question, while generalized estimating equations or mixed logistic models can estimate time effects and covariate associations. If pairs are themselves clustered, variance estimation must account for the higher-level cluster. For matched case-control designs with conditional sampling, use methods aligned to matched sets rather than a simple pre/post test.

Missing one of the paired outcomes excludes the pair in basic McNemar analysis. If missingness is associated with status or change, complete-pair results can be biased. Report complete-pair count, missingness pattern, and sensitivity analysis when important. In before-after intervention studies, pairing controls stable individual characteristics but not secular trends, learning, regression to the mean, or changes in co-interventions. The test describes a marginal shift; causal attribution requires a stronger design, such as a controlled interrupted time series or randomized rollout.

## Sample size and design

A rough normal approximation uses expected directional discordance probabilities. If p10=.20 and p01=.08, net change is .12 and total discordance .28. The standard error scale is driven by √(p10+p01); fewer discordances mean less information even at the same N. Use pilot data for both directional rates, plan for incomplete pairs, and calculate exact power when counts are small. Recruiting additional participants cannot fix bias from informative missing pairs or an uncontrolled secular trend.

Report b, c, the paired risk difference with interval, total complete pairs, test variant (exact, corrected, uncorrected), and p-value. State whether the data are diagnostic, before-after, or matched and what causal claim the design supports. Do not write “there was no change” solely because p>.05; discuss the uncertainty in net change.

## Comparing two diagnostic procedures

Suppose two tests are applied to the same patients, each compared with a shared reference standard. To compare sensitivity, restrict to participants truly diseased and construct a paired 2×2 table of whether each test detected disease; McNemar tests equality of marginal sensitivities. To compare specificity, restrict to non-diseased participants and compare paired negative classifications. Applying one McNemar test to all patients without separating disease status answers a different question about overall positive classification and can be misleading when prevalence is low.

Both tests should be evaluated on the same participants and reference standard. If verification depends on an initial test result, selection bias can distort sensitivity and specificity. McNemar adjusts for paired readings but not for an imperfect reference standard or selective verification. Report the reference method and missing/indeterminate results.

### Sample-size sensitivity to discordance

For a rough planning illustration, let p10=.20 and p01=.08. The net difference is .12 and total discordance .28. With α=.05 and power .80, a normal approximation for n is approximately [z(.975)√(.28)+z(.80)√(.28−.12²)]²/.12², around 150 pairs. If directional discordance rates were .10 and .06, the net change halves while total discordance is .16, and required sample size rises sharply. Pilot estimates of both cells are therefore crucial.

The formula assumes complete paired observations and a two-sided alternative. Use exact power when expected discordant counts are small. Inflate enrollment for incomplete pairs, but assess differential missingness because recruitment inflation alone does not remove selection bias.

## Reporting no evidence of change

A nonsignificant McNemar result can arise because directions are balanced or because few pairs are discordant. Report b and c and an interval for the marginal change, so the reader sees which explanation is plausible. When all pairs are concordant, test information about directional change is absent; do not infer interchangeability of measurements. Agreement and marginal change are distinct targets.

### The role of concordant observations

Concordant positive pairs (both positive) and concordant negative pairs (both negative) determine overall agreement and prevalence, but under the null of equal margins they offer no information about directional asymmetry. A sample with 500 concordant pairs and 2 discordant pairs has far less power to detect a marginal shift than one with 100 discordant pairs, even at the same total n. Always report the transition table, not only the margin totals.

A matched-pair odds ratio b/c uses only discordants. If b=0 and c>0, the ratio is at a boundary, but the exact binomial test remains defined. A confidence interval for the marginal risk difference depends on the full paired multinomial distribution. Choose an interval method that matches the estimand rather than deriving it from independent binomial arms.

### Controlled before–after inference

A simple pre/post McNemar test cannot distinguish an intervention effect from secular change. If a comparison group is available, a difference-in-differences design may compare changes across groups, subject to parallel-trends and other assumptions. For repeated monthly binary outcomes, interrupted time-series logistic models can estimate level and slope changes while accounting for autocorrelation. McNemar remains useful for paired marginal change but should not be presented as causal evidence without design support.

### A complete paired-binary result

A useful statement is: “Among 100 complete pairs, 18 changed from negative to positive and 6 from positive to negative; positive classification increased by 12 percentage points (paired interval …), exact McNemar p=….” This reports the information that drives the test and the marginal effect. If agreement is the target, provide agreement statistics separately. If a causal claim is intended, explain how the design addresses time trends and co-interventions.

### Exact, corrected, and uncorrected versions

The uncorrected chi-square version is asymptotic; the continuity-corrected version is more conservative for moderate discordance; the exact binomial test respects the discrete conditional distribution. These can yield different p-values in small samples. Choose based on sample size and prespecified protocol, not which crosses .05. Name the method in results and include discordant counts so the reader can see why it was chosen.

When discordant counts are large, exact and asymptotic results become similar. With only a few discordants, exact p-values are coarse and confidence intervals broad. A zero in one off-diagonal cell is not an obstacle to the exact test, though a matched-pair odds ratio can be infinite. Report a boundary estimate honestly with interval bounds.

### Study design limits

McNemar controls for stable characteristics shared within a pair but not time-varying confounders, learning, regression to the mean, or changes in measurement. In before-after quality-improvement work, a control group or interrupted time series may be needed to support causal attribution. In diagnostic comparison, the shared reference standard and verification process determine validity. The test alone addresses only marginal paired change.

### Essentials for reproducible reporting

State the two measurement occasions or methods, outcome coding, number of complete pairs, both discordant counts, marginal risk difference, interval, test variant, and missing-data approach. Separate agreement from marginal change, and separate statistical evidence from causal interpretation.

### Sample-size planning caveats

For a paired design, total enrollment is not sufficient to plan power: investigators need plausible probabilities of change in each direction. If expected discordance is much lower than assumed, power drops. If many pairs are incomplete, effective discordant information falls further. Use pilot transition tables or prior paired studies and run sensitivity scenarios. Exact power calculations are useful when expected discordant counts are small.

### Interpreting a null result

A large p-value may reflect balanced discordance, few discordant pairs, or both. Show b and c, estimate marginal change with an interval, and distinguish “no evidence of marginal shift” from “the methods agree.” If equivalence of margins is the goal, define a meaningful bound and plan a precision-based analysis; McNemar’s ordinary null test cannot establish equivalence.

### Comparison with independent proportion tests

An independent two-proportion test assumes the groups consist of different units. Applying it to paired before/after records ignores covariance and can misstate variance. McNemar conditions on discordance and directly tests marginal homogeneity. If pre and post samples are genuinely independent repeated cross-sections rather than the same people, McNemar is inappropriate; use an independent-proportion method, accounting for survey or cluster design if needed.

### Difference from kappa

Kappa compares observed agreement with agreement expected from marginal prevalences; it can be low when agreement is high if prevalence is extreme. McNemar asks whether margins differ. A pair of diagnostic methods can have high kappa and a directional marginal difference, or low kappa with balanced margins. Choose a statistic based on whether the question is consistency or directional change.

### Final interpretation

McNemar’s test isolates directional change among discordant pairs. Its p-value should always travel with the transition counts, marginal risks, effect interval, and design context. It measures neither agreement nor causality by itself. The paired structure can improve the question’s precision, but only a valid matched design, complete follow-up strategy, and appropriate interpretation support the final clinical claim.

### Do not confuse a paired test with a matched cohort analysis

McNemar is appropriate for two binary outcomes observed on the same units or pairs. A matched case-control study with matched sets may require conditional logistic regression, particularly with covariates or multiple controls per case. Flattening a matched set into a 2×2 table can discard the matching and misstate variance. Identify the pairing mechanism and use the test that corresponds to it.

### Final interpretation

McNemar’s test uses discordant pairs to assess a change in paired binary margins. Report both directions of change, the net risk difference and uncertainty, and the design context. Agreement, causality, and equivalence require other analyses or stronger designs; a nonsignificant McNemar result proves none of them.

The net percentage-point change is not the same as the fraction of discordant pairs moving in one direction. Give both denominators: b and c among all complete pairs for the marginal contrast, and b/(b+c) conditional on discordance for the binomial test.

For paired classification studies, include prevalence and the proportion of discordant pairs as well as McNemar inference. A high concordance rate can make few discordances informative for the directional question, while overall accuracy can be dominated by the majority class. Interpret transition counts within the study population and reference-standard process.

If there are few discordant pairs, report exact binomial inference and an interval for the marginal risk difference; the asymptotic chi-square approximation can be poor.

### Report the transition matrix

A transition matrix makes the paired design visible and allows readers to distinguish stable positive/negative classifications from directional changes. Include it in the main results for small studies or as a supplement for large tables, with totals and missing pairs clearly stated.

For a before-after study, describe co-interventions and the timing of measurements; pairing alone does not control calendar effects or regression to the mean.

This contextual information matters for clinical interpretation.

## References and further reading

- McNemar Q. [Note on the sampling error of the difference between correlated proportions or percentages](https://doi.org/10.1007/BF02295996). *Psychometrika*. 1947;12:153–157.
- Agresti A. *An Introduction to Categorical Data Analysis*. 3rd ed. Wiley, 2018.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis
  and Other Advanced Topics*. Brooks/Cole.
