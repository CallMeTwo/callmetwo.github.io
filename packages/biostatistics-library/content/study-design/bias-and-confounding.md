---
title: Bias and confounding
summary: Systematic errors that distort study results — selection bias, information bias, and confounding — and how to detect and control them.
---

## Overview and key ideas

**Bias** is any systematic deviation of an estimated effect from its true value, caused by the study's design, conduct, or analysis. Unlike random error, bias does not shrink with a larger sample size; more data make a biased estimate more precisely wrong. The three broad families are:

- **Selection bias** — the way participants are chosen or retained makes the observed exposure–outcome association differ from the one in the source population. Classic examples: low response rate that correlates with the outcome, hospital (Berkson) selection of controls, loss to follow-up that differs by group, and excluding long-term survivors from a cohort.
- **Information (misclassification) bias** — the way exposure or outcome is measured systematically differs between groups or over time. Classic examples: recall bias in case-control studies (cases remember exposures differently than controls), diagnostic suspicion bias (clinicians investigate differently in treated patients), and unblinded outcome assessment.
- **Confounding** — the exposure is associated with a third variable (the **confounder**) that independently affects the outcome, so the crude association mixes the exposure's effect with the confounder's. A confounder must be (1) associated with the exposure, (2) an independent cause of the outcome, and (3) not on the causal pathway between exposure and outcome.

## When to use it

Bias and confounding are not methods to "use"; they are threats to check in every study. Typical moments where each matters most:

| Threat | Where it is most likely to arise |
| --- | --- |
| Selection bias | Retrospective studies using hospital or registry data; studies with loss to follow-up; case-control studies with poorly chosen controls. |
| Information bias | Unblinded outcome assessment; self-reported exposure in case-control studies; using administrative codes that change over time. |
| Confounding | Any observational study of a behaviour or social exposure (smoking, diet, SES); registry studies where groups differ systematically at baseline. |

In a properly randomised trial, confounding is controlled by design; residual confounding and information bias remain possible (e.g., through post-randomisation dropouts or unblinded assessments).

## Assumptions and limitations

- **Confounding control by regression** assumes the model is correctly specified: all relevant confounders are measured, the exposure–confounder and confounder–outcome relationships are correctly modelled (linearity, no unmodelled interactions), and no unmeasured confounder remains. An unmeasured or poorly measured confounder can leave substantial residual confounding.
- **Stratification** requires adequate numbers in each stratum; sparse strata produce unstable stratum-specific estimates and wide intervals.
- **Misclassification** that is non-differential (unrelated to group) usually biases a binary exposure–outcome association toward the null; differential misclassification can bias in either direction and is often worse.
- **Direct standardisation** of rates requires an external standard population; results depend on the choice of standard and are not comparable across studies using different standards.
- **Instrumental-variable and marginal-structural-model approaches** for unmeasured confounding rest on strong, untestable assumptions (e.g., the exclusion restriction for instruments); they are tools of last resort, not routine practice.

## Worked example

A case-control study examined coffee drinking and lung cancer (168 cases, 1832 non-cases with coffee; 28 cases, 1972 non-cases without). Crude OR = (168 × 1972) / (1832 × 28) ≈ **6.5** — suggesting coffee is a strong carcinogen.

Stratifying by smoking (a confounder: coffee drinkers are more likely to smoke, and smoking causes lung cancer):

| Smoking | Coffee: cases/non-cases | No coffee: cases/non-cases | OR |
| --- | --- | --- | --- |
| Smoker | 160 / 840 | 20 / 980 | 9.3 |
| Non-smoker | 8 / 992 | 8 / 992 | 1.0 |

The stratum-specific ORs are 9.3 among smokers and 1.0 among non-smokers. Thus this constructed table does **not** show a crude association explained away by smoking: the Mantel–Haenszel common OR is about 6.7, close to the crude OR of 6.5. Instead, it illustrates why one should inspect stratum-specific effects before reporting a single adjusted estimate: the association differs sharply across strata, which could represent effect modification, sparse-data instability, or a deliberately simplified teaching example. A confounder can change a crude estimate, but its presence and magnitude should be assessed with causal knowledge and estimates, not inferred from whether a variable reaches statistical significance.

## Interpretation and common pitfalls

- **Confounding by indication**: in observational studies of treatments, sicker patients receive the treatment, so the treatment looks harmful when it merely treated the sick. Randomisation, propensity methods, or restriction are needed; raw comparison is not valid.
- **Overadjustment**: adjusting for a variable on the causal pathway between exposure and outcome (a mediator), or for a collider (a common effect of exposure and outcome), *creates* bias that was not there; adjusting for a collider opens a spurious association.
- **Assuming "not significant" means "no confounding"**: a confounder can be associated with the outcome but fail a significance test for association with the exposure (especially with low power), and still materially confound the effect.
- **Relying on a single adjustment**: one regression model is not a proof of unbiasedness. Sensitivity analyses (different models, stratification, negative-control outcomes, quantitative bias analysis) are how researchers argue that residual confounding is unlikely to explain the result.

## References and further reading

- Hernán MA, Robins JM. [*Causal Inference: What If*](https://www.hsph.harvard.edu/miguel-hernan/causal-inference-book/). Chapman & Hall/CRC, 2020.
- [STROBE Statement](https://www.strobe-statement.org/), reporting guidance for observational epidemiology.
- Rothman KJ, Greenland S, Lash TL, eds. *Modern Epidemiology*. 3rd ed. Lippincott Williams & Wilkins, 2008.
- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Fox J. *Applied Regression Analysis and Generalized Linear Models*. SAGE Publications.
- Hernán M, Robins J. *Causal Inference: What If*. Chapman & Hall/CRC.

The [cohort and case-control article](/biostatistics-library/study-design/cohort-and-case-control-studies.html) covers how control selection and follow-up introduce specific selection biases.
