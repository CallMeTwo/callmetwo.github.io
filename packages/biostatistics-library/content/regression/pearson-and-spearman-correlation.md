---
title: Pearson and Spearman correlation
summary: Measure linear and monotonic association between paired variables, examine scatterplots and uncertainty, and avoid interpreting correlation as agreement or causation.
---

## Overview

Correlation summarizes how two variables vary together. Pearson's product-moment correlation measures linear association on the original scale; Spearman's rank correlation measures monotonic association using ranks. Both are dimensionless and lie between −1 and 1. Neither establishes causation, agreement between measurement methods, or a useful prediction rule by itself.

The scatterplot is essential. The same Pearson coefficient can arise from a linear cloud, a curved relationship, or one influential point. Report the coefficient with an interval, sample size, variable definitions, and plot. Choose the measure based on the question and relationship shape, not only a normality test.

## Pearson correlation and covariance

For paired observations ((X_i,Y_i)), Pearson correlation is (r=\mathrm{Cov}(X,Y)/(s_Xs_Y)). It measures linear association: (r=1) when points lie exactly on an increasing straight line and (r=-1) for a decreasing line. Multiplying either variable by a positive constant or adding a constant does not change (r); reversing one variable's sign reverses the sign.

Suppose (r=0.60) between weekly exercise hours and a fitness score. The squared correlation (r^2=0.36) equals the proportion of variance explained by the simple linear regression of score on exercise, under the usual sample calculation. It does not mean exercise causes 36% of fitness or that a person's score will be predicted accurately. Confounding, measurement error, and restricted range affect the association.

```r
plot(dat$exercise_hours, dat$fitness_score,
     xlab = "Exercise hours per week", ylab = "Fitness score")
cor.test(dat$exercise_hours, dat$fitness_score,
         method = "pearson", conf.level = 0.95)
```

The conventional t-based interval and test rely on independent paired observations and bivariate-normal assumptions for exact small-sample inference. With large samples, inference may be more robust, but outliers and nonlinearity remain. Add a fitted smooth or regression line to inspect shape; report robust or bootstrap intervals when assumptions are questionable.

## Spearman rank correlation

Spearman's \(\rho_s\) is Pearson correlation applied to ranks. It measures monotonic association: as one variable increases, the other tends to increase or decrease, though not necessarily at a constant rate. It is useful for ordinal variables, skewed distributions, or monotonic nonlinear relationships. Ties are assigned average ranks and affect exact calculations.

If biomarker levels rise monotonically with disease severity but increase sharply only at high severity, Pearson correlation may understate or mischaracterize the pattern while Spearman captures ordering. If the association is U-shaped, Spearman may be near zero despite a strong relationship because it is not monotonic. Rank correlation does not detect every nonlinear association.

```r
cor.test(dat$severity_rank, dat$biomarker,
         method = "spearman", exact = FALSE)
```

The approximate test is appropriate with ties or moderate-to-large samples; `exact=TRUE` is most useful in small samples without ties. Spearman's coefficient has no direct interpretation in original units and does not estimate an average change. If the scientific question is how an outcome changes per unit exposure, regression may be more informative.

## Worked example and interval interpretation

In a sample of 40 patients, Pearson (r=0.45) between baseline inflammation marker and length of stay. A Fisher z transform (z=\tfrac12\log[(1+r)/(1-r)]\) gives (z=0.485), standard error (1/\sqrt{n-3}=0.164). The 95% interval on z-scale is 0.164 to 0.806; transforming back gives correlation interval approximately 0.16 to 0.67. The estimate suggests a positive linear association, but uncertainty is substantial.

An interval excluding zero is evidence against zero population linear correlation under the assumed sampling model; it does not show the relationship is clinically useful. The relation may be driven by age or disease severity. Fit a regression with prespecified confounders if adjustment is required, and report adjusted slopes or partial correlations with clear assumptions.

For Spearman's statistic, rank the two measurements and compute Pearson correlation of those ranks. Suppose five participants have exercise ranks 1, 2, 3, 4, 5 and fitness ranks 2, 1, 3, 5, 4. The rank differences are −1, 1, 0, −1, 1; with no ties, \(\rho_s=1-6\sum d_i^2/[n(n^2-1)]=1-6(4)/(5(24))=0.80\). The high value reflects largely concordant ordering, not a unit change in fitness per hour.

With ties, software computes correlation of average ranks and uses an appropriate approximation or permutation procedure. Exact null distributions become more complicated. For small samples, a permutation test can reassign one variable's labels among independent pairs, but the exchangeability assumption must be credible. Repeated or matched data require restricted permutations.

## Scatterplots reveal the data structure

Inspect a scatterplot before calculating a coefficient. Look for curvature, clusters, ceiling or floor effects, heteroscedasticity, tied values, influential observations, and restricted range. Color or facet by a meaningful group if Simpson's paradox is plausible: a pooled association can differ from within-group associations because group membership affects both variables.

An outlier can materially change Pearson correlation because it depends on squared deviations. Verify data entry and measurement. Do not remove valid observations solely because the correlation becomes nonsignificant; report sensitivity with and without influential observations if scientifically justified. Spearman is less sensitive to magnitude extremes but can still be affected by rank changes and ties.

Anscombe's quartet demonstrates why a coefficient and regression line are not sufficient: datasets with nearly identical means, variances, correlations, and fitted lines can have radically different shapes and outliers. A single high-leverage patient with an extreme biomarker value may create an apparent linear relationship. Plot axes in meaningful ranges and inspect raw points rather than only a smoothed summary.

Heteroscedasticity does not change the definition of Pearson correlation but can make conventional inference inaccurate. A transformation such as log biomarker may improve interpretability if the relationship is multiplicative, but it changes the association being measured. Report the scale used and show the transformed relationship. Rank-based association avoids unit dependence but does not solve selection bias or dependence.

When groups are present, calculate and plot both pooled and group-specific patterns when scientifically relevant. A pooled positive association can coexist with negative within-group associations (Simpson's paradox) if group means differ. This reflects different conditioning. Clarify whether the target is an overall population association or a within-stratum association.

## Correlation is not agreement

Two methods can correlate perfectly yet disagree systematically. If method B always reads 10 units higher than method A, correlation may be 1 while the methods are not interchangeable. Agreement requires examining paired differences, bias, and limits of agreement, such as Bland–Altman analysis, with attention to repeated measurements and heteroscedastic differences. Intraclass correlation may be relevant for reliability but depends on the model and design.

Correlation also does not imply causation. A third variable can create association, reverse causation can operate, and selection can induce correlation. For example, exercise and lower blood pressure may correlate because age and health status influence both. Adjustment can help under a causal model but does not guarantee identification. Use causal designs and explicit assumptions for causal claims.

### Limits of agreement in a measurement study

Suppose two devices have paired differences (D_i=A_i-B_i), mean difference 1.2 units, and SD 3.0. Under approximately normal differences, 95% limits of agreement are (1.2\pm1.96(3.0)), or −4.7 to 7.1 units. Whether those limits are acceptable depends on clinical tolerance; correlation alone cannot answer that. Plot differences against paired means to assess proportional bias and increasing variability. For repeated pairs per person, account for within-person dependence in the limits.

Intraclass correlation coefficients quantify reliability or agreement under particular variance-component models. There are multiple ICC forms depending on whether raters are fixed or sampled, whether absolute agreement or consistency is desired, and whether single or average measurements are used. Always state the ICC model and confidence interval. A high ICC can result from a broad between-person range even when measurement error is clinically large.

Measurement error in either variable usually attenuates Pearson correlation toward zero under classical assumptions. Replicate measurements or reliability studies can quantify error, but error correction requires assumptions. Shared systematic error can instead inflate association. Describe measurement procedures and assess whether correlated errors are plausible.

## Testing many correlations

Correlation matrices with dozens of variables create many hypotheses. At 5% per test, some small p-values occur by chance. Define primary relationships, adjust for multiplicity when confirmatory, or label screening analyses exploratory. False-discovery-rate control can be useful for discovery, but does not turn correlations into causal findings. Report the full matrix or selection process rather than only significant pairs.

Correlation estimates in small samples are noisy and can be strongly affected by selection. Confidence intervals are important; a point estimate of 0.7 from 12 participants is not precise. Sample-size planning can target interval width or power for a scientifically relevant correlation. Range restriction in selected cohorts can attenuate observed correlation compared with the source population.

## Missingness, repeated observations, and weighting

Correlation calculated on complete pairs can be biased if missingness depends on either variable. Compare missingness patterns and consider likelihood or imputation methods when the target is a population association. Pairwise deletion in a matrix can produce different sample sizes for different entries and even a non-positive-definite matrix; report denominators.

Repeated measurements from the same person are not independent pairs. Pooling all person-visits can inflate precision and mix within-person with between-person association. Use repeated-measures correlation, multilevel models, or separate within- and between-person effects. For survey samples, incorporate sampling weights and design rather than using an unweighted coefficient as a population estimate.

## Choosing Pearson, Spearman, or regression

Use Pearson when linear association on the measurement scale is meaningful and no severe influential points dominate. Use Spearman for monotonic rank association or ordinal variables. Use regression when the goal is a conditional mean relationship, adjustment, prediction, or covariate-specific contrast. For nonmonotonic association, consider splines or other flexible models. For binary or censored outcomes, specialized association measures may be more suitable.

Do not choose Spearman automatically because a Shapiro–Wilk test rejects normality; with large samples tiny deviations trigger rejection, and correlation validity depends on joint structure and outliers. Plot the data and define the scientific target. Pearson and Spearman answer related but distinct questions; reporting both can be a sensitivity check if prespecified, not a way to choose the smaller p-value.

Kendall's tau is another rank-based measure with a concordance interpretation: it compares the proportion of concordant and discordant pairs. It can be useful for ordinal data and small samples, though its numerical magnitude differs from Spearman's rho. Do not compare coefficients across methods as if they share a scale. Select the measure that matches the question and report it by name.

Partial correlation adjusts for linear association with specified covariates, but it can be misleading if relationships are nonlinear or covariate selection is inappropriate. Multiple regression often provides a clearer framework because it models the outcome conditional mean and allows flexible terms. For binary outcomes, use logistic or other generalized models; correlation with a binary indicator has point-biserial interpretation but does not substitute for the relevant effect measure.

When reporting a matrix, show sample sizes and confidence intervals for important relationships. Use a diverging color scale centered at zero, label the coefficient method, and avoid using color intensity as a proxy for significance. If one variable is repeated or measured at multiple visits, account for within-person dependence rather than interpreting a conventional matrix of pooled rows.

For repeated data, the correlation between a person's usual biomarker level and usual outcome can differ from the within-person correlation between deviations around their personal means. Repeated-measures correlation estimates a common within-person linear association; a multilevel model can permit person-specific slopes. Report the number of people and observations, and whether slopes are assumed common. A naive Pearson coefficient over all visits weights people with more observations more heavily.

In paired method comparison, the two measurements are designed to be dependent. Their correlation can be high because participants span a wide range even when within-person differences are clinically unacceptable. Analyze differences and agreement limits. In twin or family data, account for family clustering; a standard correlation interval assumes independent pairs.

Survey weighting changes the target population. A weighted correlation may estimate association in the population represented by the sample, but variance needs replicate weights, Taylor linearization, or another design-based method. Convenience samples with truncated ranges can yield attenuated correlations; correction for range restriction requires strong assumptions and should be treated as sensitivity, not routine adjustment.

The Fisher z interval assumes an approximately bivariate-normal sample and independent pairs. Bootstrap confidence intervals can relax some distributional assumptions but must resample the independent unit. If data are clustered, resample clusters, not rows. If many correlations are planned, a multivariate bootstrap can preserve their dependence and support simultaneous intervals, although it requires adequate sample size.

The p-value for correlation tests a zero population correlation under the sampling assumptions. It does not test whether a relationship is nonlinear, clinically useful, or causal. A near-zero Pearson coefficient can conceal a strong U-shaped association; a near-zero Spearman coefficient can conceal a nonmonotonic pattern. A plot and flexible regression can reveal such structure.

### Correlation matrices as exploratory tools

A matrix can quickly identify redundant variables or candidate associations, but it is not a complete analysis plan. Strong correlation between predictors can destabilize regression coefficients, while moderate pairwise correlations do not rule out multivariable collinearity. Conversely, low pairwise correlations can coexist with a strong joint linear combination. Use the matrix to understand data, then model the scientific question directly.

For high-dimensional biomarker screening, estimate correlations with confidence intervals and account for multiplicity or use hierarchical shrinkage. Replicate leading signals in independent data. Data-driven selection on the same sample leads to winner's curse: the largest observed correlations tend to overstate population associations. Report selection and validation steps.

Missing data can create non-positive-definite correlation matrices when pairwise deletion uses different participant subsets for each pair. This can invalidate PCA or covariance-based methods. Multiple imputation or complete-case analysis with clear assumptions may be preferable; alternatively, use methods designed for missing covariance. Report pairwise denominators and avoid silently mixing sample sizes.

## Design and causal context

Cross-sectional correlations cannot establish which variable changed first. Longitudinal measurement can help describe temporal ordering but still does not remove time-varying confounding or reverse causation. If the target is causal, define an intervention contrast and identify assumptions; correlation is descriptive evidence, not a causal estimand.

Selection into a clinic, trial, or complete-case dataset can induce associations between variables that are independent in the source population. For example, conditioning on referral affected by both exposure and disease severity can create collider bias. A high observed correlation in a selected sample may therefore not transport to the population. Describe sampling and selection mechanisms.

## Reporting the coefficient

State the coefficient type, sample size, confidence interval, p-value when relevant, handling of ties and missing pairs, and independence unit. Include a scatterplot or rank plot for key relationships. Name units and whether variables were transformed. If adjusted, state covariates and whether the result is a partial correlation or regression coefficient. Avoid qualitative labels such as “strong” without context; practical importance depends on measurement reliability and the scientific use.

A transparent sentence could read: “Among 84 participants with complete paired measurements, baseline CRP and length of stay had a Spearman correlation of 0.38 (95% CI 0.17 to 0.56); the association was monotonic but does not imply a causal effect.” If the coefficient was selected after screening many markers, add that it is exploratory and report the screening strategy.

The interval's uncertainty reflects sampling variation under the assumed design. It does not include uncertainty from measurement calibration, selection, unmeasured confounding, or choice among Pearson and rank methods. Sensitivity analyses should address plausible threats rather than merely report whichever method is significant.

For clinical monitoring, a modest correlation may still support useful screening if combined with other information, while a high correlation may be inadequate for replacing a reference test. Evaluate the decision task directly rather than setting universal thresholds for “weak” or “strong” correlation.

Report the plotting scale and any axis transformation alongside the coefficient.

If the relation is used to calibrate a surrogate measure, separately validate the prediction error and agreement limits in the target population.

In a clinical biomarker setting, evaluate whether a correlation is stable across assay batches, sites, and disease severity. Batch-specific shifts can create or obscure association. Plot paired values by batch and account for repeated samples when the same patient contributes multiple measurements.

## References and further reading

- Schober P, Boer C, Schwarte LA. Correlation coefficients: appropriate use and interpretation. *Anesthesia & Analgesia*. 2018;126:1763–1768. [doi:10.1213/ANE.0000000000002864](https://doi.org/10.1213/ANE.0000000000002864)
- Bland JM, Altman DG. Statistical methods for assessing agreement between two methods of clinical measurement. *The Lancet*. 1986;1:307–310. [doi:10.1016/S0140-6736(86)90837-8](https://doi.org/10.1016/S0140-6736(86)90837-8)
- Mukaka MM. A guide to appropriate use of correlation coefficient in medical research. *Malawi Medical Journal*. 2012;24:69–71. [PMCID: PMC3576830](https://pmc.ncbi.nlm.nih.gov/articles/PMC3576830/)
- Bland JM, Altman DG. Calculating correlation coefficients with repeated observations: Part 1—correlation within subjects. *BMJ*. 1995;310:446. [doi:10.1136/bmj.310.6977.446](https://doi.org/10.1136/bmj.310.6977.446)
