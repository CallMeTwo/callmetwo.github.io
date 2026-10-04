---
title: Populations and samples
summary: The population is the group you want to know about; the sample is what you can actually measure, and the link between them is sampling.
---

## Overview and key ideas

A **population** is the complete set of individuals or events about which you
want to draw conclusions; a **sample** is the subset you actually observe.
Statistics exists because populations are almost never measurable in full, so
we measure a sample and infer the population quantity from it. Three concepts
link the two:

- **Sampling frame** — the list or mechanism that defines who could enter the
  sample (e.g. the hospital's admissions register for the year).
- **Probability sampling** — every member of the frame has a known, non-zero
  chance of selection; this is what makes valid population inference possible.
- **Non-probability sampling** — convenience samples (patients seen on a ward
  round). Useful for pilot work, but inference to a wider population rests on
  how typical the sample is.

Precision improves with sample size, but no sample size fixes a sampling
mechanism that systematically excludes part of the population.

## When to use it

Defining population, frame and sampling scheme is a design-stage task.
Typical scenarios:

| Setting | Example question |
| --- | --- |
| Surveillance | What is the central-line bloodstream infection rate in all ICU admissions this year? |
| Cohort study | Among all patients newly diagnosed with type 2 diabetes, what is the 5-year risk of retinopathy? |
| Clinical trial | Which population do the results apply to — those randomised, those who took the drug, or all patients like them? |
| Quality audit | Do 60 consecutive knee replacements represent the year's caseload, or only consenting surgeons? |

In the surveillance example the population is "all ICU admissions to our
hospital this year", the frame is the admissions register, and 100% capture
makes it a census — a reminder that census and sample are roles, not
properties of data.

## Assumptions and limitations

Inference from a sample to a population rests on two assumptions:

- **Representativeness** — the sampling mechanism does not systematically
  exclude or over-represent subgroups; a frame covering only telephone-triage
  admissions under-represents the sickest patients.
- **Non-selective errors** — mistakes in who is sampled or how they are
  counted do not correlate with the outcome being measured.

The method breaks down when non-participation is selective: an audit whose
response rate falls from 90% to 40% over the year is not sampling the same
population at both points. Missing data within the sample is a second,
separate problem, but it compounds the first — the effective sample may differ
from the sample in exactly the way the population question cares about.

### Design-based inference and nonresponse

In probability sampling, each sampled unit has a known inclusion probability
πᵢ. When these probabilities differ, an unweighted estimate may not represent
the target population; design weights are typically related to 1/πᵢ, and
variance calculations must also reflect stratification and clustering. A
response rate alone does not determine nonresponse bias: the bias depends on
how response relates to the outcome after accounting for observed information.
Define the target population, eligibility period, frame and nonresponse
strategy before analysis. Randomization in a trial supports an internal
treatment comparison, but does not guarantee that results transport to every
population of interest.

## Worked example

A hospital wants the infection rate among all 1,420 ICU admissions in a year.
Auditing every chart is infeasible, so the team randomly selects 100 charts
and finds central-line bloodstream infection in 7 of them: a point estimate of
7.0%. Treating the selection as a simple random sample, the standard error is
sqrt(p(1-p)/n) = sqrt(0.07 × 0.93 / 100) ≈ 0.026, so a 95% confidence
interval is roughly 7.0% ± 1.96 × 2.6% — about 2% to 12%.

The interval is wide because of the modest sample size, not a flaw in the
logic: with n = 100, a 7% rate is imprecisely estimated, and the honest
conclusion is that the true rate plausibly lies in the 2–12% range, subject to
the assumption that the register frame covers all ICU admissions.

## Interpretation and common pitfalls

- **Reporting the sample, silently claiming the population.** If 100 charts
  were randomly sampled from a frame of 1,420, the rate applies to the frame —
  but only if the frame is complete. State frame and population separately.
- **Conflating non-response with random error.** If 30 of 100 charts could
  not be obtained and missingness correlates with severity, the effective
  sample is no longer the random sample.
- **Extrapolating across settings.** A rate estimated at one hospital cannot
  be generalised to "all hospitals" by statistics alone; that is a multi-centre
  design question, not arithmetic.
- **Choosing the sample size after seeing the data.** Power is a planning
  concept; a post-hoc "we only had 40 patients" does not become a design
  decision.

## Target, source, and analytic populations

A population is not always a geographic census. The target population is the group to which the scientific question refers; the source population is the group from which participants could actually be recruited; the analytic sample is the set contributing data to a particular analysis. These groups may differ because of eligibility, consent, enrollment, follow-up, or missing outcomes. Generalizability concerns how results transport from the study sample to a target setting; internal validity concerns whether the study identifies an effect for its own eligible participants. A trial can have strong internal validity and limited transportability, or the reverse.

Probability sampling gives each unit a known selection probability. Under simple random sampling, each of N population members has equal chance n/N of selection. Stratified designs sample within prespecified subgroups to ensure representation or improve precision. Cluster sampling selects groups such as clinics and then patients; it is operationally efficient but yields correlated outcomes. Convenience sampling has unknown selection probabilities, so ordinary sample summaries do not automatically estimate population quantities. Weighting may correct known unequal probabilities or measured nonresponse patterns, but cannot repair selection driven by unmeasured factors without additional assumptions.

Nonresponse and loss to follow-up can create selection bias when participation depends jointly on exposure and outcome risk. A flow diagram should account for screened, eligible, enrolled, followed, and analyzed participants. Compare included and excluded groups using available variables, but recognize that similar measured characteristics do not prove absence of selection bias. In longitudinal studies, complete-case analysis changes the target to those with complete records unless missingness assumptions justify broader inference.

### Worked example: unequal-probability sampling

A health survey samples 400 rural and 600 urban residents, although the target population is 30% rural and 70% urban. If observed disease prevalence is 12% in rural respondents and 8% in urban respondents, the unweighted sample prevalence is (400×.12 + 600×.08)/1000 = 9.6%. The population-standardized estimate is .30×.12 + .70×.08 = .092, or 9.2%. The difference is small here, but can be large when oversampling is stronger or subgroup risks differ substantially.

```r
sample_n <- c(rural = 400, urban = 600)
risk <- c(rural = 0.12, urban = 0.08)
population_share <- c(rural = 0.30, urban = 0.70)
unweighted <- weighted.mean(risk, sample_n)
standardized <- weighted.mean(risk, population_share)
c(unweighted = unweighted, standardized = standardized)
```

This calculation assumes that each stratum's sample risk estimates its population risk. If nonresponse within rural or urban strata depends on disease beyond modeled variables, post-stratification alone does not remove the bias. Weight uncertainty should also be reflected in standard errors.

### Clustering and effective sample size

With average cluster size m and intraclass correlation ρ, a rough design effect for equal-sized clusters is DEFF ≈ 1+(m−1)ρ. For m=20 and ρ=.05, DEFF=1.95; 1,000 clustered observations may have variance like roughly 1,000/1.95≈513 independent observations for a mean under this approximation. This is not a replacement for design-based analysis: unequal cluster sizes, stratification, and multistage selection change the calculation. Use cluster-robust, mixed-model, or survey-design methods appropriate to the estimand and sampling process.

Describe the sampling frame, selection mechanism, recruitment dates, eligibility, participation, and losses. Make claims no broader than the design supports. When transporting results, compare distributions of effect modifiers between study and target populations and state the assumptions used to standardize. Sampling design is part of the analysis, not a background detail.


## Selection mechanisms and transportability

Selection occurs at multiple stages: a clinic may serve a distinct catchment; eligibility may exclude comorbid patients; consent may depend on treatment preference; follow-up may depend on prognosis; analysis may condition on complete data. Each stage can alter the distribution of exposures, outcomes, and effect modifiers. A participant flow chart makes counts visible, but causal diagrams and sensitivity analyses are needed to understand implications.

External validity is not established by matching a demographic table. To transport a trial effect, identify variables that modify treatment effect and compare their distributions in trial and target populations. If individual-level data and target margins are available, standardize trial-specific conditional effects to the target distribution under assumptions of conditional exchangeability and positivity. If some target groups were absent from the trial, extrapolation relies on modeling beyond observed support and should be explicit. A nationally diverse sample can still be unrepresentative if participation is selective.

### Worked example: nonresponse weighting

Suppose 70% of invited low-risk adults and 40% of invited high-risk adults respond. Among respondents, outcome risks are 5% and 20%, respectively; the target invitation frame is 60% low-risk and 40% high-risk. The respondent mix is proportional to .60×.70=.42 and .40×.40=.16, so among responders the high-risk share is .16/(.42+.16)=27.6%, less than the target's 40%. The unweighted respondent risk is .724×.05+.276×.20=.0914. Standardizing risks to the frame yields .60×.05+.40×.20=.11. Here measured risk strata permit correction; if response differs by unobserved outcome within strata, this does not suffice.

```r
frame_share <- c(low = .60, high = .40)
response <- c(low = .70, high = .40)
risk <- c(low = .05, high = .20)
respondent_share <- frame_share * response
respondent_share <- respondent_share / sum(respondent_share)
unweighted <- sum(respondent_share * risk)
standardized <- sum(frame_share * risk)
c(unweighted = unweighted, standardized = standardized)
```

This simple post-stratification assumes response is ignorable conditional on risk stratum and that the risk estimates are transportable within stratum. Inverse-probability weights can become large when response probabilities are low; report weight distributions and assess sensitivity to truncation.

### Probability sampling versus random assignment

Sampling and treatment allocation are different random mechanisms. Probability sampling supports design-based generalization from sample to a frame; random assignment supports unbiased comparison of treatment groups among the randomized units. A randomized convenience sample can have strong internal causal validity but limited generalization. A representative observational survey may describe population prevalence accurately yet have confounded exposure-outcome associations. State which randomization is present and what inferential claim it supports.

### Sample size, precision, and representation

Larger samples narrow random error, but do not eliminate bias. Increasing a convenience sample from 500 to 5,000 can produce a very precise estimate of the wrong population quantity. Sample-size planning should account for clustering, unequal weights, nonresponse, subgroup objectives, and multiplicity. Oversampling small groups can improve subgroup precision; weighting then restores population representation for overall estimates. Plan the sample and analysis together rather than treating weights as a post hoc repair.

In reports, distinguish the recruited sample from the analytic denominator for each result. Show missingness and exclusions by reason; describe the sampling frame and recruitment sites; characterize relevant target-population differences. For transport claims, identify assumptions and provide sensitivity analyses where data allow. The CONSORT and STROBE statements improve transparency, but generalizability requires substantive reasoning about who could enter and remain in the study.


## Positivity and support in subgroup sampling

Positivity means every covariate pattern in the target population has a nonzero probability of entering the relevant exposure or treatment group. In sampling, a subgroup absent from the frame cannot be represented by reweighting; in causal inference, a treatment never used for a covariate pattern cannot be compared there without extrapolation. Extreme weights are a warning that the observed data poorly support the target contrast. Trimming can stabilize estimates but changes the effective target population and should be described.

### Effective sample size under weights

A rough effective sample size for normalized weights wi is (Σwi)²/Σwi². It equals n for equal weights and falls when weights are concentrated. For example, weights 1,1,1,7 sum to 10 and yield effective n=100/(1+1+1+49)=1.92, far below four nominal records. This formula is a diagnostic, not a complete design-based degrees-of-freedom calculation.

```r
w <- c(1, 1, 1, 7)
(sum(w)^2) / sum(w^2)
```

Inspect weight histograms, minimum and maximum inclusion probabilities, and subgroup representation. Report whether weights were calibrated, trimmed, or normalized, and how variance accounted for their estimation. A weighted point estimate with a naive unweighted standard error is internally inconsistent.

## Recruitment and consent as selection processes

Enrollment may depend on health literacy, trust, transportation, disease severity, and treatment preference. These factors can affect both participation and outcomes. Recruitment strategies that broaden access improve inclusiveness, but statistical weighting can only adjust measured selection predictors under assumptions. Document outreach, reasons for refusal where ethically collected, and site-level participation. Avoid describing participants as “representative” merely because their age and sex distributions resemble census margins; unmeasured clinical characteristics and access mechanisms may still differ.

For multi-site studies, distinguish site sampling from patient sampling. Sites may be chosen purposively for expertise or infrastructure, not randomly from all hospitals. A random effect captures modeled site heterogeneity but does not by itself make those sites representative. If deployment targets community settings unlike trial centers, conduct external validation or transport analyses using target-setting data.

## Sampling uncertainty versus coverage error

A narrow confidence interval addresses random sampling variation under the model; it does not capture coverage error when the sampling frame omits relevant people. Telephone surveys that exclude people without access, registries that omit untreated disease, and EHR cohorts that exclude patients receiving care elsewhere can all produce systematic differences. Weighting to known margins may reduce some differences but cannot prove representativeness. Triangulate with external data sources, sensitivity analyses, and a clear description of the frame. Population claims should be proportionate to frame coverage and participation.

## Nonprobability samples and cautious inference

Many clinical datasets arise from registries, EHRs, and opt-in cohorts with unknown inclusion probabilities. The observed distribution can describe the records captured, but population estimates require additional structure. Calibration weighting aligns measured margins with a target source; inverse odds of sampling weights can support transport when selection is explainable by measured covariates. Both methods require overlap and correct measurement of selection predictors. If participation depends on unmeasured prognosis, sensitivity analysis should quantify how strong that dependence would need to be to change conclusions.

Repeated sampling from an EHR does not make the sample random. A very large dataset may reduce Monte Carlo error while retaining systematic undercoverage. Report the health systems, catchment, period, coding inclusion criteria, and care outside the network. Validate against external sources and avoid extrapolating to people who rarely access the represented system.

## Cluster sampling and intraclass correlation

Patients in the same clinic share staff, protocols, and neighborhood context. The intraclass correlation ρ is the fraction of total variance attributable to between-clinic differences in a simple random-intercept model. With m equally sampled patients per clinic, the design effect formula 1+(m−1)ρ shows why adding more people to the same clinics yields diminishing information. Adding clinics may be more valuable than adding within-clinic patients, especially for clinic-level interventions. Sample-size planning should use plausible ICC values and number of clusters, and analysis should use cluster-aware methods.

A useful sampling report names the geographic and temporal frame, inclusion probabilities if known, recruitment channels, eligibility criteria, response fractions, and the unit selected at every stage. Describe nonparticipation and attrition without implying that a large denominator removes bias. For weighted estimates, show weighted and unweighted sample sizes, target margins, and weight diagnostics. These details let readers evaluate whether the sample statistic estimates the intended population parameter or only characterizes the records observed.

Sampling uncertainty is not the only uncertainty in transport. Treatment effects can differ across settings because of baseline risk, co-interventions, adherence, health-system capacity, or outcome ascertainment. A transported estimate should specify which characteristics are allowed to vary and which mechanisms are assumed stable. If effect modifiers are unknown or absent from both datasets, present a qualitative limitation or quantitative sensitivity analysis instead of claiming broad representativeness.

## Precision gains from stratification

If a known subgroup strongly predicts the outcome, stratified sampling can ensure adequate representation and sometimes reduce variance by estimating within-stratum quantities before weighting them to the population. The gain depends on within-stratum homogeneity and proportional allocation. Disproportionate allocation may be useful for rare groups but requires weights for population totals. Analyze with the strata and selection probabilities retained; discarding that design information wastes precision and can bias standard errors.

## References and further reading

- CDC. [Principles of Epidemiology: rates and appropriate denominators](https://archive.cdc.gov/www_cdc_gov/csels/dsepd/ss1978/lesson3/section2.html).
- STROBE Initiative. [Checklist for reporting observational studies](https://www.strobe-statement.org/checklists/).

- Rosner B. *Fundamentals of Biostatistics*. Cengage Learning.
- Kleinbaum D, Kupper L, Muller K, Nizam A. *Applied Regression Analysis and
  Other Advanced Topics*. Brooks/Cole.
- Bland JM, Altman DG. *Statistics with Confidence*. BMJ Books.
- The *Sampling methods* topic in this library covers probability sampling
  methods in detail.
