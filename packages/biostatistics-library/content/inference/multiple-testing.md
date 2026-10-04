---
title: Multiple testing
summary: Testing many hypotheses inflates the chance of false positives; Bonferroni and Holm corrections control the familywise error rate at a prespecified level.
---

## Overview and key ideas

When m hypotheses are each tested at level alpha, even if all m nulls are true, the probability of at least one false rejection is 1 - (1 - alpha)^m. For 20 independent tests at alpha 0.05 that probability is 1 - 0.95^20, about 0.64: in a 20-way screen, a "significant" finding is far more likely to be a false positive than a real discovery. The **familywise error rate (FWER)** is the probability of at least one false rejection within a "family" of tests, and multiple testing correction is designed to control it.

Two standard methods are used:

- **Bonferroni.** Reject any hypothesis with p at most alpha / m. Simple and valid under any dependence between the tests, but conservative - it loses power, especially when the tests are correlated.
- **Holm (step-down).** Order the p-values from smallest to largest. Compare the smallest to alpha / m, the next to alpha / (m - 1), and so on; stop at the first failure and reject all hypotheses up to that point. Holm rejects at least everything Bonferroni rejects, controls the FWER under any dependence, and is the usual default when an FWER method is wanted.

For very large families (genomics, thousands of variants), FWER control can be so strict that nothing is declared significant; a **false discovery rate** procedure (Benjamini-Hochberg) instead controls the expected fraction of false positives among the rejected hypotheses and is often preferred there. Whichever method is used, the "family" of tests must be defined before the analysis.

A common way to think about the choice between FWER and FDR: FWER control is "the probability of even one false alarm is at most alpha", which is the right guarantee when a single false positive is costly (a drug is approved on the basis of a spurious biomarker). FDR control is "of everything I call positive, the expected false fraction is at most q", which is the right guarantee when you expect only a small fraction of many hypotheses to be true and can tolerate a few false leads in the follow-up screen.

## When to use it

| Setting | Why correction is needed |
| --- | --- |
| Biomarker screen | 20 candidate biomarkers tested for association with disease progression |
| Neuroimaging study | Thousands of brain regions or voxels tested for activation |
| Trial subgroup analyses | Effect re-estimated in every subgroup until one looks promising |
| Secondary endpoints | Several prespecified secondary or co-primary comparisons in one trial |
| Genomic association study | Millions of variants tested; FDR procedures are typically used instead |

## Assumptions and limitations

- Bonferroni and Holm control the FWER under any dependence structure, so independence is not required; but both are conservative when the tests are positively correlated, because the effective multiplicity is less than m.
- The choice of family determines the correction: correcting every comparison ever made (confirmatory plus exploratory) is over-conservative, while correcting only the confirmatory family and leaving exploratory fishing uncorrected is a design decision that must be declared.
- A single prespecified primary endpoint needs no correction; the moment the analysis branches into several data-driven comparisons, the effective multiplicity grows.
- With thousands of correlated tests, FWER control may declare nothing significant; switching to FDR gives a different error guarantee and should be prespecified, not chosen after the results are seen.

## Worked example

A heart failure study screens 4 prespecified candidate biomarkers in 300 patients, with two-sided alpha 0.05 per test and the family defined as these 4 tests. The p-values are 0.004, 0.016, 0.060, and 0.300.

- **Bonferroni** threshold: 0.05 / 4 = 0.0125. Only biomarker 1 (p = 0.004) is significant.
- **Holm:** 0.004 is at most 0.05/4 = 0.0125, reject; 0.016 is at most 0.05/3 = 0.0167, reject; 0.060 exceeds 0.05/2 = 0.025, stop. Biomarkers 1 and 2 are significant.

Holm recovers biomarker 2 at no additional FWER cost. Without any correction, 2 of the 4 biomarkers would be declared significant - and if all 4 were truly unassociated, the probability of at least one false positive would be 1 - 0.95^4, about 0.19, nearly 1 in 5 screens.

## Interpretation and common pitfalls

- **Fishing.** Running subgroups or secondary analyses until one clears 0.05 and reporting only that one - the effective family is all the tests run, prespecified or not.
- **Correcting the single primary endpoint.** The prespecified primary analysis needs no multiplicity adjustment; applying Bonferroni to it only makes rejection harder for no benefit, while the real inflation comes from the uncorrected exploratory tests.
- **Choosing the method after seeing the results**, for example falling back on "no correction" when the correction removes significance.
- **Defining the family post hoc** to minimise or maximise the correction; the family should be the prespecified set of hypotheses, not whichever set is convenient.

## Step-down adjustment and false discovery rate

For sorted p-values \(p_{(1)}\le\cdots\le p_{(m)}\), Holm compares
\(p_{(i)}\) with \(\alpha/(m-i+1)\), stopping at the first failure. In the
four-biomarker example, adjusted p-values are 0.016, 0.048, 0.12, and 0.30.
Thus the first two discoveries survive familywise correction at 0.05. The
adjusted values can be interpreted as the smallest familywise alpha at
which each hypothesis would be rejected by the step-down procedure.

```r
p <- c(inflammation = .004, troponin = .016,
       natriuretic_peptide = .060, renal_marker = .300)
p.adjust(p, method = "holm")
p.adjust(p, method = "bonferroni")
p.adjust(p, method = "BH")
```

The Benjamini–Hochberg (BH) procedure controls the false discovery rate
(FDR), \(E[V/(R\vee1)]\), where V is the number of false rejections and R
the total rejections. Sort p-values and find the largest i such that
\(p_{(i)}\le iq/m\); reject through i. Unlike FWER, FDR is not the
probability of at least one false discovery. Under an all-null global
scenario, BH's FDR equals the probability of any rejection, but when some
nulls are false, the guarantees differ. Standard BH control holds under
independence and certain positive dependence structures; the
Benjamini–Yekutieli procedure is valid under arbitrary dependence but is
more conservative. `p.adjust(..., method="BH")` returns adjusted p-values
for BH; selecting a method after viewing which yields more discoveries
invalidates the planned error guarantee.

## Defining the hypothesis family

Multiplicity is a property of the decision process, not just a count of
columns in a results table. A family may comprise all co-primary endpoints,
all pairwise comparisons among treatment arms, all candidate biomarkers,
or all planned interim looks. Distinct scientific questions may justify
separate families, but the boundary should be defined before unblinding and
reported transparently. Hierarchical gatekeeping tests a primary endpoint
first and releases alpha to secondary endpoints only if a prespecified
condition is met. Closed testing can provide strong FWER control across
complex hypotheses, although it may be more involved than Holm.

In ANOVA, Tukey's method controls familywise error over all pairwise mean
comparisons; Dunnett is more efficient when every active arm is compared
with one common control. For a small set of planned contrasts, Holm or a
contrast-based simultaneous interval may be suitable. The omnibus test
does not magically remove multiplicity if investigators then inspect many
unplanned subgroups. Conversely, a single prespecified primary contrast
does not require adjustment merely because descriptive tables contain
other summaries.

## Interpretation, selection, and uncertainty

Adjusted significance does not estimate effect magnitude, remove bias, or
validate a hypothesis generated by the same data. Report unadjusted effect
estimates and confidence intervals alongside adjusted p-values, while
distinguishing simultaneous intervals from ordinary pointwise intervals.
In large screens, FDR results are useful for prioritizing follow-up; they
are not a license to treat every selected feature as confirmed. Replication
in independent data and shrinkage of selected effect estimates are often
needed because the most extreme discoveries are subject to winner's curse.

Multiplicity also arises from analytic flexibility: trying multiple
outcome definitions, transformations, covariate sets, exclusions, and
subgroups, then reporting the preferred result. A correction over a
narrowly defined published table does not account for unreported analysis
paths. Prespecification, transparent reporting, and independent validation
address this broader selective-inference problem more effectively than
applying a mechanical correction to only the final p-values.

## Dependence and structured hypotheses

## Analysis flexibility and selective reporting

The multiplicity counted by an adjustment is only as complete as the
analysis history. A researcher may try several outcome definitions,
transformations, covariate sets, missing-data methods, or exclusion rules.
If the preferred result is selected because its p-value is smallest, the
nominal error rate for that final model no longer describes the search.
An ordinary Holm correction across three published endpoints does not
account for ten unpublished model variants that were also examined.
Transparent protocols, registered reports, and disclosure of analytic
choices make the evidence easier to interpret; selective inference methods
may help in specific settings but are not a universal correction for
unrecorded flexibility.

Exploratory work remains valuable and should not be discouraged by
mechanical demands to adjust every descriptive calculation. The key is to
distinguish estimation and hypothesis generation from confirmatory claims.
If exploratory screens use FDR control, report the full tested family and
treat results as candidates for replication. If a study makes a small
number of confirmatory claims, define those hypotheses and their testing
sequence before data access. Error control should support honest inference,
not substitute for it.

The number m alone does not fully describe a multiple-testing problem.
Highly correlated endpoints may carry overlapping information; Bonferroni
remains valid but can lose substantial power. Resampling methods can exploit
the joint dependence among test statistics to obtain simultaneous
critical values, but they require exchangeability or other design
conditions and careful implementation. Correlation is not permission to
ignore multiplicity: quantify the family and choose a method with a
guarantee appropriate to the design.

Hierarchical hypotheses encode scientific structure. For example, a trial
may first test the primary endpoint, then a key secondary endpoint, and
then additional outcomes in a prespecified sequence. If the primary test
fails, later outcomes may be reported as descriptive or exploratory rather
than confirmatory. Graph-based gatekeeping can recycle alpha across
families after rejection, but the rule and transition weights must be
specified in advance. This can be more powerful than flat Bonferroni while
keeping the overall FWER controlled.

For post-hoc comparisons after one-way ANOVA, Tukey's honestly significant
difference controls familywise error for all pairwise means under the
model. Dunnett's method is tailored to several active treatments versus a
shared control and typically yields narrower intervals than adjusting all
pairwise comparisons. If comparisons were planned around clinically
meaningful contrasts (such as pooled active treatment versus control),
test those contrasts directly rather than all pairs. The design should
determine the comparison family; choosing it after inspecting group means
creates selection bias.

## FDR workflow and reporting

## Choosing the error criterion from the use case

Familywise control is a natural target for a small confirmatory family in
which any false claim could trigger a costly decision, such as several
co-primary endpoints that determine approval. FDR is often more suitable
for exploratory screens where the purpose is to create a shortlist for
independent validation and a limited number of false leads is acceptable.
Neither method is universally more rigorous: the criteria answer different
questions. A q=0.05 FDR procedure does not guarantee that no more than 5%
of a particular realized set of discoveries are false; it controls the
expected false fraction over repeated applications under its assumptions.

Expected false positives can be approximated by m0 alpha for m0 true null
tests under unadjusted testing, but that expectation says nothing about the
probability any one result is false. If only a small subset of hypotheses
are truly associated, the positive predictive value may remain modest even
with a low per-test alpha. This motivates validation and replication in
addition to multiplicity adjustment. In discovery science, avoid treating
the adjusted p-value as the final evidence of clinical relevance; assess
effect size, calibration, reproducibility, and clinical utility.

When multiple outcomes are correlated, a prespecified composite endpoint
can reduce the number of tests but changes the estimand and may combine
components of unequal importance. A hierarchical composite or gatekeeping
strategy makes that trade-off explicit. Creating a composite after seeing
which outcomes were significant does not solve multiplicity and can
produce a difficult-to-interpret endpoint. The clinical question should
drive endpoint construction before sample size and analysis plans are
finalized.

## Simultaneous intervals and planned contrasts

When the aim is to report all pairwise differences among k means, readers
need intervals that protect the family as well as p-values. Tukey
simultaneous intervals use the studentized range distribution; each interval
is wider than a corresponding pointwise 95% interval, but the family has
approximately 95% coverage under the ANOVA model. For treatment-versus-
control contrasts, Dunnett intervals use their joint correlation and are
typically narrower than Tukey intervals because they protect only the
comparisons actually of interest. This is a gain from defining the
scientific family in advance, not a loophole to choose a smaller family
after seeing data.

```r
fit <- aov(outcome ~ arm, data = trial)
TukeyHSD(fit, "arm", conf.level = .95)
```

The function assumes independent errors with common variance for the
classical one-way ANOVA. If variances differ substantially, use a method
appropriate for heteroscedastic comparisons (such as Games–Howell) rather
than applying Tukey mechanically. For a handful of preplanned contrasts,
define the contrast matrix and use simultaneous inference that matches
those contrasts. Reporting both unadjusted and adjusted intervals can be
useful if clearly labeled; readers should not mistake pointwise intervals
for familywise-protected ones.

Multiplicity also affects confidence statements across multiple outcomes.
If a trial claims “at least one secondary endpoint improved” after
examining ten endpoints, pointwise 95% intervals do not support that
family-level claim. If the goal is estimation rather than binary decisions,
showing all effect estimates and pointwise intervals can still be
informative, provided the selection and multiplicity context is explicit.
For confirmatory claims, use simultaneous intervals or a prespecified
testing hierarchy.

### Example: what changes between FWER and FDR?

Consider five ordered p-values 0.001, 0.010, 0.030, 0.070, and 0.20.
At familywise alpha 0.05, Holm's first threshold is 0.010, so 0.001 passes;
the second threshold is 0.0125, so 0.010 also passes; the third is
0.0167, so the procedure stops. The adjusted p-values for the first three
are 0.005, 0.040, and 0.090. Under BH at q=0.05, thresholds are
0.010, 0.020, 0.030, 0.040, and 0.050. The third p-value equals its
threshold, so BH rejects the first three. The procedures differ because
they control different error criteria. Rounding matters near thresholds;
use full precision in computation and state the intended method.

```r
p <- c(.001, .010, .030, .070, .20)
cbind(raw = p, holm = p.adjust(p, "holm"),
      BH = p.adjust(p, "BH"))
```

For BH, adjusted values are obtained by scaling ordered p-values by
\(m/i\), taking the cumulative minimum from largest rank to smallest,
then restoring original order. The first three adjusted BH values here
are 0.005, 0.025, and 0.050; the remaining values are 0.0875 and 0.20.
This demonstrates that reporting only whether each raw p-value is below
0.05 obscures the family-level guarantee.

In biomarker discovery, FDR control can be paired with independent
validation. One sensible workflow is to define a family of candidate
features, control BH q at 0.05, estimate effects with intervals, then
evaluate shortlisted markers in an independent cohort using a prespecified
analysis. Report how many hypotheses entered the family, how many passed,
whether filtering was independent of the test statistic, and how missing
or low-quality features were handled. Filtering based on the same outcome
signal can alter calibration; independent filtering based on a covariate
unrelated to the null test statistic may improve power under specific
conditions.

An adjusted p-value should be paired with the raw p-value and effect
estimate. The BH adjusted value is not the posterior probability that a
particular finding is false. Rather, the procedure's guarantee concerns
the expected false fraction among the selected set, under its assumptions.
Do not write “there is a 5% chance this biomarker is false” from an FDR
threshold. Discovery screens prioritize candidates; clinical use requires
validation, calibration, and evidence of utility.

## References and further reading

- Holm S. [A simple sequentially rejective multiple test procedure](https://doi.org/10.2307/4615733). *Scandinavian Journal of Statistics*. 1979;6(2):65–70.
- Benjamini Y, Hochberg Y. [Controlling the false discovery rate: a practical and powerful approach to multiple testing](https://doi.org/10.1111/j.2517-6161.1995.tb02031.x). *Journal of the Royal Statistical Society: Series B*. 1995;57(1):289–300.
- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott-Raven.
- Benjamini Y, Yekutieli D. The control of the false discovery rate in multiple testing under dependency. *Annals of Statistics*. 2001;29(4):1165–1188. [doi:10.1214/aos/1013699998](https://doi.org/10.1214/aos/1013699998)
- Dunnett CW. A multiple comparison procedure for comparing several treatments with a control. *Journal of the American Statistical Association*. 1955;50(272):1096–1121. [doi:10.1080/01621459.1955.10501294](https://doi.org/10.1080/01621459.1955.10501294)
- Tukey JW. Comparing individual means in the analysis of variance. *Biometrics*. 1949;5(2):99–114. [doi:10.2307/3001913](https://doi.org/10.2307/3001913)
- The [p-values article](/biostatistics-library/inference/p-values-and-significance-levels.html) discusses interpretation of individual tests.
