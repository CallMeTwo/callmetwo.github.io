---
title: Meta-analysis and forest plots
summary: Combining the results of several comparable studies into one pooled effect estimate, shown study by study on a forest plot.
---

## Overview and key ideas

A meta-analysis is the quantitative synthesis step of a systematic review: it combines the results of independent studies on the same question into a single pooled estimate with a confidence interval. Each study contributes a point estimate (risk ratio, odds ratio, mean difference, hazard ratio) and a standard error, and the method weighs them — usually by the inverse of the variance, so larger, more precise studies count more — then combines the weights into an overall estimate.

Two models govern the combination. Under the **fixed-effects** model the true effect is assumed identical in every study, and any between-study differences are pure sampling noise. Under the **random-effects** model each study estimates its own true effect, drawn from a distribution of effects; a between-study variance component (tau-squared) is estimated and added to each study's variance, giving more weight to smaller studies and producing wider intervals. Random effects is the usual default when studies genuinely differ.

The **forest plot** displays each study as a square (sized by its weight) with its confidence interval, and the pooled estimate as a diamond; the width of the diamond is the pooled CI, and whether it crosses the line of no effect is the pooled significance.

## When to use it

| Setting | Example question |
| --- | --- |
| Pooled RCT evidence | Across all RCTs, does a beta-blocker started in acute MI reduce 1-year mortality? |
| Diagnostic test meta-analysis | What is the pooled sensitivity and specificity of cardiac MRI for myocarditis? |
| Rare outcomes | What is the pooled hazard ratio for relapse with a maintenance drug in multiple sclerosis? |
| Subgroup exploration | Does the treatment effect differ by age, sex, or baseline severity across trials? |

## Assumptions and limitations

- **Like with like** — valid pooling requires studies to be answering the same question with comparable populations, interventions and outcomes; averaging non-comparable studies produces a precise number with no real meaning.
- **Independence of studies** — the standard errors assume each study's estimate is independent; overlapping patient samples or shared authors break this.
- **Model choice matters** — the fixed-effects model is only defensible when between-study heterogeneity is negligible; when it is not, its narrow confidence interval is false precision.
- **Small-study effects** — the pooled estimate can be distorted if small studies systematically differ from large ones (often correlated with publication bias); this is checked by funnel plots and explored in sensitivity analyses.

## Worked example

Four RCTs report the risk of stroke with a new anticoagulant versus placebo over one year:

| Trial | Events/Total (drug) | Events/Total (placebo) | RR |
| --- | --- | --- | --- |
| A | 30/800 | 50/800 | 0.60 |
| B | 15/600 | 25/600 | 0.60 |
| C | 10/400 | 20/400 | 0.50 |
| D | 8/300 | 18/300 | 0.44 |

On the log scale, inverse-variance weights favour the larger trials A and B. A fixed-effects pooled RR is ≈ **0.56** (95% CI 0.48–0.65); because trials differ only modestly, heterogeneity is low and the fixed-effects result is acceptable. On the forest plot the diamond sits well to the left of the vertical no-effect line at RR = 1, so the pooled analysis finds a statistically significant ~44% relative reduction in stroke, with the precision much tighter than any single trial — exactly the added value of pooling.

Interpretation: each trial alone is suggestive but imprecise; pooled, they yield a single estimate with a narrow interval. The key discipline is that pooling is only legitimate because all four trials were adequately comparable; if trial D had a very different population, it should be examined separately or analysed under a random-effects model rather than silently averaged in.

## Interpretation and common pitfalls

- Choosing fixed effects by convenience despite real heterogeneity, and reporting an artificially narrow, misleading confidence interval.
- Pooling non-comparable studies (different interventions, populations or endpoints) to manufacture a "significant" overall result.
- Reading the pooled diamond as the effect in *your* population: the estimate reflects the studies included, so applicability still has to be judged separately.
- Ignoring the forest plot's weights: the pooled number is driven by the few large studies, so it can look very different from a simple average of the trial RRs.

Fixed-effect and random-effects models answer different questions. A fixed-effect summary assumes a common underlying effect (with differences arising from sampling error); a random-effects model estimates a mean of a distribution of effects and adds between-study variance τ². The random-effects mean is not a universal treatment effect, and a prediction interval can reveal uncertainty for a new setting. Avoid choosing the model solely from a heterogeneity p-value. Prespecify clinically plausible effect measures, explore sources of heterogeneity cautiously, and account for dependent estimates when studies report multiple outcomes or time points.

## References and further reading

## Effect scales and study-level variance

## Calculating a study estimate and its variance

For a 2×2 trial, log RR is θ=log[(a/n1)/(c/n0)] and a common large-sample variance is (1/a-1/n1+1/c-1/n0). For OR, log OR=log(ad/bc) with variance (1/a+1/b+1/c+1/d). These approximations can fail with sparse/zero cells; use appropriate exact or likelihood methods and document continuity corrections if any. For a mean difference, variance is (s_1^2/n_1+s_0^2/n_0). Always confirm denominators and event definitions from the source report.

Example: 30/500 vs 20/500 events gives RR=1.5 and approximate SE(log RR)=sqrt(1/30−1/500+1/20−1/500)=0.283. A 95% CI is exp[log(1.5)±1.96(.283)] ≈0.86–2.62. The wide interval illustrates why direction alone is inadequate. Pool log effects and transform only after synthesis; weighting raw ratios arithmetically is generally incorrect.

## Prediction interval and absolute translation

## Correlated effects and multilevel synthesis

## Worked model comparison and interpretation

Suppose a common-effect model gives RR .84 (95% CI .76–.93), while REML random effects gives RR .82 (95% CI .68–.99), tau=.20, and prediction interval .55–1.22. The average effect estimate is similar, but random-effects uncertainty and prediction interval show that benefit is not guaranteed in every setting. The prediction interval includes no effect and modest harm. Do not conclude the interventions are universally beneficial from the pooled CI alone; explain where clinical differences may drive the spread and whether the included trial settings match implementation.

If a prediction interval is very wide because there are few studies, it is still a warning about uncertainty, not a reason to suppress it. Consider whether pooling is clinically meaningful and present study-specific estimates. The random-effects mean is an average weighted by inverse within-study variance plus between-study variance; it need not represent the effect in the largest or most relevant trial.

## Data extraction and audit trail

## A synthesis decision checklist

## Reporting a pooled conclusion

Show study-level estimates and intervals with a clearly labeled pooled model; state how multi-arm, zero-event, and missing-variance studies were handled. Report all prespecified sensitivity analyses and explain which assumptions materially change the pooled conclusion.

State outcome and horizon, included studies/participants, effect scale, pooling model, heterogeneity estimate, and interval. Translate to absolute effects with baseline risk and describe prediction uncertainty. Note risk-of-bias and publication-bias limitations. A pooled estimate should not erase trial-level variation or replace judgment about applicability to a particular population.

Before pooling, ask whether studies estimate the same population, intervention contrast, outcome definition, time point, and effect measure. Check overlap in clinical context and risk of bias. If differences are expected but effects remain conceptually commensurate, random effects may summarize a distribution; if constructs or estimands differ, separate syntheses or narrative comparison are more honest. Statistical heterogeneity tests should not decide clinical comparability.

After pooling, report mean effect and CI, tau², I² with caution, and prediction interval if feasible. Translate to absolute effect at a stated baseline risk. Discuss how outlier/influential studies, risk of bias, missing data, and model choices affect conclusions. If only a few studies exist, emphasize uncertainty in heterogeneity and refrain from strong claims about moderator effects.

## Zero-event studies and rare outcomes

Studies with zero events in one arm contribute information about relative effects; adding a continuity correction may allow log-ratio calculation but can bias estimates, particularly with unequal group sizes. Studies with zero events in both arms do not inform a relative risk under standard likelihood but do inform absolute event burden and may matter for risk-difference synthesis. Use methods suited to rare events, such as binomial likelihood models or Mantel–Haenszel approaches, and perform sensitivity analyses. Do not exclude rare-event evidence solely because software returns an infinite estimate.

Report how many studies were excluded from each meta-analysis and why (missing variance, incompatible design, zero events). Different synthesis subsets may have different populations, so the pooled estimate can shift for reasons beyond model choice. Provide a clear study-level table and avoid overinterpreting a pooled result based on a small fraction of eligible studies.

Maintain an extraction sheet containing raw numerators/denominators and source page/table, derived effect, SE, and conversion formula. A second reviewer should verify primary outcomes and uncertain conversions. Keep code that transforms arm-level counts into effect estimates. If a paper reports multiple adjusted models, follow a prespecified hierarchy and capture covariates to avoid selecting the most favorable. Preserve all eligible studies in the review even if a specific estimate cannot be pooled.

If one study contributes multiple follow-up times, outcomes, or treatment arms, effect estimates are correlated. Naively entering each as an independent row double-counts participants and narrows intervals. Options include choosing a prespecified time point, combining outcomes, multivariate meta-analysis with within-study covariance, three-level models, or robust variance estimation. When correlations are unavailable, sensitivity analyses over plausible correlations are preferable to assuming zero. Robust variance needs a sufficient number of independent studies and small-sample corrections when few clusters are present.

For network meta-analysis, preserve multi-arm covariance and assess global/local inconsistency. Ranking metrics should be accompanied by effect estimates versus a relevant comparator and certainty, since small imprecise differences can still produce a confident-looking rank order.

## Forest plot audit

Before publication, verify the displayed effect measure, reference direction, study labels, event denominators, transformed intervals, weights, and pooled estimate against analysis output. A plot can visually exaggerate by truncating axis or using inconsistent scales. Ensure studies with zero events in both arms are handled according to estimand/method, not silently omitted. Provide a table of extracted data and transformations when reproducibility permits.

The random-effects mean describes average study effect on the chosen scale, not a guaranteed effect in every setting. Prediction intervals include estimated between-study dispersion plus uncertainty in the mean. Translate pooled relative effects to absolute effects using a clinically relevant baseline risk and time horizon; show multiple baseline-risk scenarios if they vary. Such translation assumes relative effect transportability and may not account for effect modification.

## Sensitivity analyses

Prespecify common-effect versus random-effects analyses, tau estimator, Hartung–Knapp adjustment, exclusion of high-risk studies, alternative effect scales, and handling of missing SDs. Leave-one-out analysis identifies dependence on individual studies but should not determine inclusion. A change from statistically significant to nonsignificant after one study is removed reflects uncertainty, not a license to choose the preferred result. Present the full evidence and explain clinical reasons for any restricted synthesis.

Choose the effect measure before synthesis based on design and clinical interpretation. For binary outcomes, log RR is natural in cohort/trial settings; log OR is estimable from case-control studies and logistic models but differs from RR for common outcomes. For continuous outcomes measured on the same scale, use mean difference; for different validated instruments measuring a common construct, standardized mean difference may be necessary but loses natural units. Time-to-event synthesis often uses log HR, which assumes compatible estimands and typically proportional hazards. Do not pool incomparable measures by mechanically transforming without the required baseline information and assumptions.

A common-effect model assumes one true effect under all studies and observed differences arise from sampling error. A random-effects model assumes study true effects vary around a distribution with mean μ and variance τ². Random effects do not automatically make a synthesis generalizable; the distribution of included studies defines its scope. DerSimonian–Laird can underestimate tau² with few or unequal studies; REML and Paule–Mandel are often preferred, with Hartung–Knapp adjustment considered for uncertainty in the mean. With very few studies, all methods are unstable and prediction intervals especially uncertain.

```r
library(metafor)
fit <- rma(yi = log_rr, sei = se_log_rr, data = studies,
           method = "REML", test = "knha")
predict(fit, transf = exp)
forest(fit, atransf = exp, xlab = "Risk ratio")
```

Here each row must be an independent study estimate on the log-RR scale with its correct standard error. Multi-arm trials sharing a control create correlated contrasts; combine arms or use a multivariate/multilevel model rather than counting the control group twice as independent. Cluster trials and crossover trials need design-adjusted variances. `test="knha"` implements a small-sample adjustment; it can be conservative with very few studies, so report the method and sensitivity results.

## Forest plots and influential studies

## Worked log-risk-ratio synthesis

Suppose three studies report RRs 0.70, 0.90, and 1.10 with log-scale standard errors 0.20, 0.15, and 0.25. A fixed-effect inverse-variance estimate weights each log RR by (1/SE^2), producing more weight for the precise second study. Random effects add τ² to each variance, reducing dominance of the largest study and moving weights toward equality. The random-effects pooled log RR is not the arithmetic mean of RRs; pool on the log scale and exponentiate. Always state whether intervals include uncertainty in τ² and which estimator was used.

```r
yi <- log(c(.70, .90, 1.10))
sei <- c(.20, .15, .25)
fit <- metafor::rma(yi = yi, sei = sei, method = "REML", test = "knha")
predict(fit, transf = exp)
```

The prediction output includes estimated mean and prediction interval on the transformed scale. With only three studies, tau uncertainty is substantial; treat both pooled and predicted effects cautiously. Report the forest plot, individual effects, heterogeneity statistics, and prediction interval rather than only the pooled point estimate.

## Missing standard deviations and conversions

When SDs are missing, derive them from SE, confidence interval, test statistic, or p-value only when the reported statistic and design permit valid recovery. Contact authors first when feasible and document every conversion. Imputing a common SD from another study can distort weights and heterogeneity; run sensitivity analyses across plausible SDs. For medians and ranges, conversion to means/SD assumes distributional shape and can fail for skewed clinical outcomes. Consider methods for skewed data or synthesize medians separately.

For multi-arm studies, combine clinically equivalent arms using arithmetic for participant counts and means and pooled within-group variance; do not duplicate a shared comparator as independent. For crossover trials, use paired differences and within-person correlation. If correlation is unknown, vary plausible values and show sensitivity.

Forest plots show each study's estimate and interval, study weight, and pooled estimate; they are diagnostic as well as presentational. Ensure axes are labeled on the effect scale, null value is shown, and direction favors named groups. Weight area should correspond to analysis weight, but a large study's weight is not evidence of low bias. Display study characteristics or risk-of-bias judgments alongside estimates so outliers can be interpreted.

Influence diagnostics include leave-one-out analyses, Baujat plots, standardized residuals, and influence measures. A study can be influential because it is large, has an extreme effect, or has unusually small variance. Removing a study solely because it changes significance is not justified; investigate eligibility, extraction, outcome definition, and bias, then report sensitivity analysis with rationale. Robust variance or mixture models can explore outliers but add assumptions.

## Dependence and multiple outcomes

Meta-analyses often contain multiple correlated effects per study, such as several time points, doses, or outcomes. Selecting one outcome after seeing results creates selective reporting; treating all as independent understates uncertainty. Options include prespecifying one effect, combining correlated outcomes, multivariate meta-analysis, three-level models, or robust variance estimation with enough independent studies. Specify the correlation assumptions and conduct sensitivity analyses because within-study correlations are often unavailable.

For network meta-analysis, transitivity and consistency assumptions are central: comparisons must be exchangeable across the network and direct/indirect evidence should agree. A connected network is not sufficient to guarantee valid ranking. Present uncertainty in treatment effects and ranks, assess inconsistency, and avoid overinterpreting rank probabilities as proof of clinical superiority.

- Cochrane Handbook for Systematic Reviews of Interventions, Chapter 10. https://training.cochrane.org/handbook/current/chapter-10
- Viechtbauer W. Conducting meta-analyses in R with the metafor package. *JSS*. 2010;36:1–48. https://doi.org/10.18637/jss.v036.i03
- IntHout J, Ioannidis JPA, Borm GF. The Hartung-Knapp-Sidik-Jonkman method for random effects meta-analysis is straightforward and considerably outperforms the standard DerSimonian-Laird method. *BMC Medical Research Methodology*. 2014;14:25. https://doi.org/10.1186/1471-2288-14-25

- Higgins JPT, Thomas J, Chandler J, Cumpston M, Li T, et al. *Cochrane Handbook for Systematic Reviews of Interventions*, 2nd edn. Wiley-Blackwell.
- Bland M, Altman DG. "Some methods and software for assessing scale of heterogeneity in meta-analysis." *Statistics in Medicine*. 1996.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- The library's "Heterogeneity and publication bias" article covers how to test and interpret between-study differences.
