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

## References and further reading

- Holm S. [A simple sequentially rejective multiple test procedure](https://doi.org/10.2307/4615733). *Scandinavian Journal of Statistics*. 1979;6(2):65–70.
- Benjamini Y, Hochberg Y. [Controlling the false discovery rate: a practical and powerful approach to multiple testing](https://doi.org/10.1111/j.2517-6161.1995.tb02031.x). *Journal of the Royal Statistical Society: Series B*. 1995;57(1):289–300.
- Greenland S, Rothman KJ, Lachin JM. *Modern Epidemiology*. Lippincott-Raven.
- The [p-values article](/biostatistics-library/inference/p-values-and-significance-levels.html) discusses interpretation of individual tests.
