---
title: Null and alternative hypotheses
summary: The null hypothesis states the default position that the test must reject, and the alternative states what the researcher wants evidence for.
---

## Overview and key ideas

Hypothesis testing formalises a decision problem with two competing statements. The **null hypothesis (H0)** is the default position - typically no difference, no association, or no effect - and it carries the burden of proof: it is rejected only when the data are sufficiently incompatible with it. The **alternative hypothesis (H1)** states what the researcher wants evidence for.

The alternative can be **two-sided** (an effect in either direction, for example H1: mean difference not equal to 0) or **one-sided** (an effect in a prespecified direction, for example H1: the new treatment is superior). Two-sided tests split the significance level between both tails and are the default in medical research.

Two structural points matter. First, the test is asymmetric: failing to reject H0 is not the same as accepting it; it only means the data did not reach the threshold for rejection. Second, the null is a mathematical device that defines the error probabilities of the procedure; it is not a scientific claim the researcher believes to be true.

The choice between a point null ("difference exactly equals 0") and a composite or margin-based null deserves attention. Exact point nulls are mathematically convenient and are the default for superiority tests, but they can be unambitious: if the true difference is 0.001 mmol/L, the null is false and the study will eventually "reject" it while nothing of interest has been shown. Margin-based hypotheses (non-inferiority, equivalence) instead anchor the test to a clinically meaningful boundary, which is often a better formulation of the scientific question, at the cost of having to justify the margin up front.

## When to use it

| Setting | Typical formulation |
| --- | --- |
| Superiority trial | H0: treatment difference = 0; H1: difference is not 0 (two-sided) |
| Non-inferiority trial | H0: new treatment is worse by at least the margin; H1: worse by less than the margin |
| Case-control study | H0: odds ratio = 1; H1: odds ratio is not 1 |
| Observational cohort | H0: no exposure-disease association; H1: an association exists |

## Assumptions and limitations

- A one-sided H1 is defensible only if a result in the opposite direction would be of no scientific or regulatory interest, and only if it is prespecified before the data are seen; a post hoc one-sided test is a route to p-hacking.
- In non-inferiority and equivalence designs the null is not "no effect" but "an effect of at least a clinically meaningful size"; the margin must be clinically justified, because the conclusion is only as meaningful as the margin.
- The probability statements behind the test (type I and type II errors) are valid only under the test's conditions: randomisation or a correct error model, independent observations, and the prespecified analysis. Design or selection bias invalidates the p-value no matter how carefully the hypotheses are worded.
- The choice of null value is a modelling decision that changes the answer; "H0: difference = 0.1" is a different test from "H0: difference = 0".

## Worked example

A non-inferiority trial compares a new oral anticoagulant with warfarin for stroke prevention in atrial fibrillation. The prespecified margin is 1.5 percentage points per year of stroke risk: the new drug would be acceptable even if it were worse by up to 1.5% per year. The hypotheses are H0: (new drug - warfarin) stroke rate is at least +1.5% versus H1: the difference is less than +1.5%. The observed rate difference is -0.2% (favouring the new drug) and the upper limit of the 95% CI is +1.1%. Because even the worst value compatible with the data lies below the margin, H0 is rejected and non-inferiority is declared: the data are incompatible with the new drug being clinically worse by the prespecified margin.

## Interpretation and common pitfalls

- **"We proved the null."** A failure to reject H0 is an absence of evidence against it, not evidence for it; a small underpowered study "proves" almost nothing in either direction.
- **Believing that rejecting H0 establishes H1 as true.** It shows the data are incompatible with H0 at the chosen level; the effect size and its CI, not the verdict, describe what remains plausible.
- **Choosing a one-sided test after seeing the data** to obtain a smaller p-value - invalid, because the tail probability was selected after the direction of the result was known.
- **Mismatching hypothesis and decision.** Using a two-sided test when only one direction would change practice, or the reverse, wastes power or creates a question no one asked.

## References and further reading

- Chow SC, Lu J, Jiang H. *Design and Analysis of Clinical Trials*. Wiley.
- Wasserstein RL, Lazar NA. [The ASA's statement on p-values: context, process, and purpose](https://doi.org/10.1080/00031305.2016.1154108). *The American Statistician*. 2016;70(2):129–133.
- Piaggio G, Elbourne DR, Pocock SJ, Evans SJW, Altman DG. [Reporting of noninferiority and equivalence randomized trials](https://doi.org/10.1001/jama.2012.87802). *JAMA*. 2012;308(24):2594–2604.
- The [p-values article](/biostatistics-library/inference/p-values-and-significance-levels.html) explains how test results are quantified.
