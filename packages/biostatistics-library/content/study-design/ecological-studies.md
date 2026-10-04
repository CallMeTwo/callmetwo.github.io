---
title: Ecological studies
summary: Population-level designs for studying group exposures and outcomes, with attention to aggregation, ecological bias, and multilevel alternatives.
---

## Overview and key ideas

An **ecological study** uses groups rather than people as the units of analysis. Groups may be countries, districts, hospitals, schools, or calendar periods. Researchers compare group-level exposure summaries (such as average air pollution or vaccination coverage) with group-level outcomes (such as mortality rates). These designs are useful when the exposure is inherently contextual, when policy is assigned to groups, or when individual data are unavailable.

The group association is a real population-level quantity, but it does not automatically describe an individual-level association. A correlation between district deprivation and district mortality does not establish that the more deprived individuals in each district are the people who died. That leap is the **ecological fallacy**. The reverse error also occurs: an individual-level association need not predict the effect of a group policy, because context and composition can act differently.

Aggregation loses information about within-group exposure and outcome variation, the joint distribution of individual exposure and confounders, and sometimes the timing or distribution of exposure. Ecological bias is therefore not fixed by simply adding more groups. It can arise even with perfectly measured group averages.

## When to use it

Use an ecological design when the question itself concerns places, institutions, or policies—for example, whether districts with higher heat exposure have higher heat-related mortality—or when the exposure is only defined at group level. Repeated group observations can assess changes around policy adoption; geographic comparisons can describe spatial patterns and generate hypotheses. Ecological comparisons are often efficient for initial surveillance and hypothesis generation.

If the intended conclusion concerns individuals, prefer linked individual-level data or a multilevel design. A contextual exposure can still be analyzed at group level alongside individual outcomes, but the model should retain individual records and represent the clustering and contextual variables explicitly.

## Assumptions and limitations

- **Correct unit and target:** State whether the estimand is a group-level association, a contextual effect, or an individual causal effect. These are different questions.
- **Confounding:** Group-level socioeconomic, demographic, health-system, and environmental factors may confound comparisons. Group means alone cannot generally recover unobserved within-group confounding.
- **Aggregation and ecological bias:** A group exposure-outcome relationship can differ in magnitude or direction from the individual relationship. Aggregate data usually cannot identify the individual cross-classification needed to resolve this.
- **Measurement and denominator:** Rates require appropriate population denominators and comparable case ascertainment. Small-area rates may be unstable; age-standardization can improve comparability but does not remove all confounding.
- **Spatial and temporal dependence:** Neighboring areas and adjacent time periods are often correlated. Ordinary regression standard errors can be too small if dependence is ignored; spatial structure, clustering, and serial correlation may need modeling.
- **Boundary and scale choices:** Results can change with geographic units or time windows (the modifiable areal unit problem). Report how boundaries and aggregation periods were selected.
- **Causal interpretation:** Ecological designs do not randomize exposure. A group-level association alone rarely supports causal conclusions without a credible design and explicit assumptions.

## Worked example

Suppose 20 districts have average annual fine-particle pollution and age-standardized cardiovascular mortality rates. A regression estimates 1.8 additional deaths per 100,000 per year for each 5 µg/m³ higher district-average pollution (95% CI 0.4 to 3.2).

This is an estimated **between-district association**. It does not mean that an individual exposed to 5 µg/m³ more pollution has 1.8 additional deaths per 100,000. Districts also differ in income, smoking, access to care, migration, and pollution measurement. Age-standardization addresses age composition only; it does not control those other differences. An individual-level cohort with residential exposure estimates, confounders, and a multilevel model could address a different, person-level question while accounting for district clustering. Even that design would require causal assumptions and careful exposure measurement.

## Interpretation and common pitfalls

- Do not translate a group-level slope into an individual risk ratio or individual treatment effect.
- Do not treat age-standardization or a large number of areas as protection against ecological bias.
- Separate **composition** (who lives in an area) from **context** (features of the area that affect residents). Aggregate summaries often combine the two.
- For policy evaluations, define the intervention at the level where it is assigned and account for time trends, concurrent policies, and spillovers.
- When individual records are available, multilevel regression can separate within- and between-group associations by including group means and individual deviations. It does not magically recover information that was never measured, and it still depends on model specification and confounder control.
- Present maps and correlations as descriptive evidence unless the design supports a causal claim.

## References and further reading

- Wakefield J. [Ecologic studies revisited](https://doi.org/10.1146/annurev.publhealth.29.020907.090821). *Annual Review of Public Health*. 2008;29:75–90.
- Greenland S, Robins J. [Invited commentary: ecologic studies—biases, misconceptions, and counterexamples](https://doi.org/10.1093/oxfordjournals.aje.a117069). *American Journal of Epidemiology*. 1994;139(8):747–760.
- Robinson WS. [Ecological correlations and the behavior of individuals](https://doi.org/10.2307/2087176). *American Sociological Review*. 1950;15(3):351–357.
- The library's [cross-sectional studies article](cross-sectional-studies.html) introduces group and individual snapshots; [bias and confounding](bias-and-confounding.html) reviews confounding in observational comparisons.
