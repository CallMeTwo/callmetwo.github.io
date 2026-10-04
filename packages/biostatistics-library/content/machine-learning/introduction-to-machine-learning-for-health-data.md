---
title: Introduction to machine learning for health data
summary: A practical introduction to supervised and unsupervised learning, evaluation, leakage, and responsible use in biomedical research.
---

## Overview and key ideas

Machine learning (ML) describes algorithms that use data to estimate patterns or make predictions. In **supervised learning**, examples have a known outcome: a model may estimate 30-day readmission from information available at discharge. In **unsupervised learning**, outcomes are not supplied; methods summarize structure, such as grouping patients by measured profiles. These goals differ from causal inference. A model that predicts who receives a treatment or has an outcome does not, by itself, estimate what would happen if treatment were changed.

A useful workflow is: define the intended population, time point, outcome, and action; assemble a cohort that represents that use; split data at the correct unit; fit and tune within development data; evaluate once on held-out or external data; then assess calibration, subgroup performance, and consequences of use. The model is only one part of a prediction system, which also includes data collection, workflow, thresholds, and monitoring.

For a binary outcome, a model may output a probability (e.g., 0.18 risk of deterioration). A threshold turns that probability into a decision, but the right threshold depends on the costs of false alarms and missed cases. Ranking metrics such as area under the ROC curve (AUC) do not tell us whether probabilities are accurate or whether acting on them helps patients.

## When to use it

ML can be useful when the goal is prediction or pattern discovery, the data contain information relevant to that goal, and the proposed use can be evaluated. Examples include predicting deterioration from vital-sign histories, classifying pathology images, or exploring whether laboratory profiles contain reproducible subgroups. Begin with a clinical question and a simple baseline (such as a prevalence estimate or regression model); use a more complex method only if it adds reliable value.

## Assumptions and limitations

- **Representative data:** the development sample and deployment population must have sufficiently similar relationships between predictors and outcome. Changes in coding, referral, prevalence, or care can degrade performance.
- **No information leakage:** every predictor must be available at the stated prediction time. Data cleaning, imputation, scaling, feature selection, and tuning must be learned using training folds only. Repeated admissions from one patient should generally remain in one partition; random row splitting can place nearly identical records on both sides.
- **Adequate outcome information:** effective sample size depends on outcome events, predictor complexity, clustering, and missingness, not just total rows. High-dimensional data need stronger regularization and broader validation.
- **Measurement and selection:** labels may be noisy or reflect unequal access to care. A model can reproduce historical disparities even when sensitive attributes are removed.
- **Prediction is not intervention evidence:** predictive associations can be confounded, and treatment decisions can change the outcome being predicted.

## Worked example

Suppose 2,000 adult admissions are used to predict unplanned ICU transfer within 24 hours after ward arrival. The target time is arrival; predictors include age, initial vital signs, and laboratory results available by then. There are 160 transfers (8%). A useful baseline that predicts 8% for everyone has no discrimination but gives a reference Brier score of 0.08 × 0.92² + 0.92 × 0.08² = 0.0737. The team compares regularized logistic regression and a tree ensemble using patient-level, temporal cross-validation. If a model has AUC 0.78, that means a randomly selected case tends to receive a higher score than a randomly selected non-case; it does not mean 78% of patients are correctly classified. The team also checks calibration, sensitivity and positive predictive value at a clinically selected alert threshold, subgroup errors, and alert burden. A later hospital cohort is reserved for external evaluation.

## Interpretation and common pitfalls

- Specify the prediction horizon and information cutoff. “Predict mortality” is incomplete without when predictions are made and over what period.
- Keep a final test set untouched until choices are finished. Repeatedly inspecting its performance makes it part of model development.
- Compare with a meaningful baseline, report uncertainty, and evaluate calibration as well as discrimination. See [model validation and overfitting](../regression/model-validation-and-overfitting.html).
- Audit errors and performance across clinically relevant groups. Aggregate performance can hide poor performance in a smaller subgroup.
- A feature-importance score describes how a fitted model uses data under a particular procedure; it is not a causal effect or proof of biological mechanism.
- Monitor performance after implementation, with governance for updates, human oversight, and a route to investigate harms.


## Prediction targets, estimands, and data-generating process

Prediction estimates an outcome distribution conditional on information available at a defined time, such as P(Y within 30 days | X at discharge). Causal inference instead targets a contrast between potential outcomes under interventions, for example E[Y(1)-Y(0)]. A highly predictive variable can be a consequence of disease, clinician response, or access to care; that does not make it a valid treatment target. State whether the aim is risk prediction, classification, ranking, clustering, causal effect estimation, or resource allocation before selecting an algorithm.

A prediction dataset is a sample from a data-generating process shaped by eligibility, measurement, coding, follow-up, and selection. Outcome labels can be proxies: readmission depends on care access, and “sepsis” labels may inherit clinician documentation practices. Missingness can encode clinical attention. Label validation and cohort construction may matter more than algorithm choice. Define the target population and distinguish predictors from outcomes and downstream consequences. For time-to-event outcomes, censoring means absence of observed event is not equivalent to a known negative label.

## A worked risk and threshold calculation

Suppose a cohort has 1,000 patients, 100 events, and a model flags 200 people at a threshold. If it captures 70 events, sensitivity is 70/100=70%. There are 130 false positives, so PPV is 70/(70+130)=35%; 800 are unflagged, of whom 30 have the event, giving NPV 770/800=96.25%. High NPV partly reflects the 10% event prevalence. If an intervention has limited capacity, threshold selection should compare expected benefit and harm, not maximize accuracy. A threshold of 0.20 may be defensible only if relative consequences support it and predicted risks are calibrated.

```r
# Decision-curve net benefit at threshold pt:
# NB = TP/n - FP/n * pt/(1-pt)
tp <- 70; fp <- 130; n <- 1000; pt <- .20
nb_model <- tp/n - fp/n * pt/(1-pt)
nb_all <- (tp + 30)/n - (800/n) * pt/(1-pt)
c(model = nb_model, treat_all = nb_all, treat_none = 0)
```

This illustrative calculation treats all flagged people at threshold 0.20 and assumes threshold odds encode the harm-benefit trade-off. It does not prove treatment efficacy or account for limited capacity, competing harms, or intervention uptake. Decision curves summarize a range of thresholds; prospective impact evaluation tests the whole pathway.

## Choosing a baseline and governing complexity

Begin with a prevalence-only benchmark, then a clinically plausible regression model, then algorithms suited to data structure. Compare under identical resampling, preprocessing, and tuning effort. Effective complexity depends on events, predictor correlation, label noise, missingness, and clustering, not just parameter count. Regularization shrinks unstable estimates; trees model interactions but may be unstable; neural nets can learn representations given sufficient data. Calibration, transport, subgroup performance, and net benefit are separate properties. Document model updates and monitor shifts in prevalence, input distributions, and outcomes after deployment.


## Development workflow: from question to a defensible model

A model is meaningful only after the prediction problem has been made precise. State the eligible population, prediction index time, outcome definition, prediction horizon, and intended action. For example, “predict deterioration” is incomplete: a usable specification says which patients, what counts as deterioration, when prediction occurs, and how far ahead it should signal. Predictors must be available at that index time. Variables entered later may encode the outcome or the clinical response to it. This is temporal leakage even if the data table contains no obvious duplicate column.

Choose the independent unit to match deployment. If the system will predict for new patients, every record from a patient belongs to one partition. If it will predict future cases at an existing hospital, a chronological split is often more informative than a random split. If use at a new hospital is intended, retain site-level external validation. Confidence intervals and effective sample size should reflect clustering by patient or site; thousands of rows do not imply thousands of independent people.

Keep every data-adaptive step inside resampling: imputation, scaling, feature filtering, encoding, dimension reduction, class rebalancing, and hyperparameter selection. A typical nested workflow uses inner folds to choose settings and outer folds to estimate the performance of that entire selection process. A separate temporal or external test cohort, if available, should be used once after choices are frozen. Repeatedly checking its results turns it into development data. Report the number of patients and outcomes in each split, not only the row count.

Use metrics tied to the intended decision. Discrimination measures ranking; for a binary outcome, ROC AUC is the probability that a randomly selected case receives a higher score than a randomly selected non-case. It does not assess absolute risk. Calibration compares predicted and observed risks, using calibration-in-the-large, slope, and plots with uncertainty. At a chosen operating point, show sensitivity, specificity, positive predictive value, negative predictive value, and the proportion flagged. Precision-recall summaries can be informative when events are uncommon. For time-to-event outcomes, account for censoring rather than labeling patients event-free before adequate follow-up. Decision-curve analysis or a prospective impact study is needed to connect predictions to clinical net benefit.

A compact R pattern for a binary outcome illustrates the separation between fitting, discrimination, and calibration. It presumes `dat` has one row per patient, a 0/1 `event`, and predictors fixed before the prediction time. The split is only illustrative; repeated patients, sites, or calendar time require grouped or temporal partitions. The final test set must not be used to tune the model.

```r
set.seed(41)
i <- sample(seq_len(nrow(dat)), floor(.8 * nrow(dat)))
train <- dat[i, ]; test <- dat[-i, ]
fit <- glm(event ~ age + prior_admissions + severity,
           data = train, family = binomial())
p <- predict(fit, newdata = test, type = "response")
# Calibration-in-the-large: intercept ideally 0 when slope fixed at 1
cal0 <- glm(test$event ~ 1, offset = qlogis(p), family = binomial())
# Calibration slope: ideally 1; assess uncertainty, not only point estimate
cals <- glm(test$event ~ qlogis(p), family = binomial())
coef(cal0); coef(cals)
```

The code does not replace internal validation or uncertainty intervals. A small event count can make both performance and calibration estimates unstable. Bootstrap at the patient level or repeat appropriately grouped resampling, and report intervals. When transporting a model, compare outcome prevalence, predictor distributions, measurement practice, and label ascertainment; recalibration of the intercept can address a prevalence shift under restrictive conditions, but cannot repair changed predictor effects or systematic measurement errors.

For a clinical prediction report, document the cohort flow, missingness, feature timing, model specification, tuning procedure, split unit, and evaluation population. TRIPOD+AI provides a reporting framework. PROBAST+AI can help assess risk of bias and applicability. Neither checklist certifies clinical usefulness. A retrospective prediction model still requires prospective evaluation of workflow, alert burden, clinician response, and patient outcomes before claims of benefit.


## Complete evaluation plan and interpretation

A protocol should specify the cohort, index date, horizon, outcome, predictors, and intended action before model comparison. State whether estimates target current patients, future patients at the same sites, or patients at new sites. Define missing-data handling and eligibility for each predictor. Construct a data dictionary with timestamp semantics; common EHR fields have entry, specimen, and result times that differ. Define whether death competes with readmission, whether follow-up ends at transfer, and how repeated admissions are handled.

A defensible development plan has a locked external or temporal test set and a resampling scheme within the remaining development data. Within every fold, fit imputation, scaling, one-hot encoding, feature selection, dimensionality reduction, and any oversampling. Use nested resampling when comparing tuned models. Report optimism-corrected or test performance with uncertainty. For binary risk models, include calibration plot, intercept, slope, Brier score, discrimination, and operating characteristics at clinically justified thresholds. For prediction over time, use censoring-aware metrics and define the time horizon. For unsupervised learning, assess stability and external replication rather than conventional prediction AUC.

Performance differences are often uncertain. If model A has AUC .78 and B .79, paired bootstrap intervals for the difference are more informative than comparing separate confidence intervals. Even a statistically distinguishable gain may not matter if calibration, net benefit, or workload is unchanged. Conversely, a modest AUC can support useful triage if high-risk identification is reliable and intervention consequences are favorable. Model comparison should be prespecified and tied to intended use, not a leaderboard across dozens of metrics.

After evaluation, make an implementation plan: specify who receives the output, threshold or queueing rule, action, override, data refresh, and monitoring. Monitor calibration and alert rate, not merely input drift. A change in coding can create distribution shift without a change in patient biology. Reassess performance after software or workflow changes. If a prediction changes treatment, observed outcome patterns will change too, so passive monitoring can become biased; prospective evaluation or causal methods may be needed to estimate impact. Prediction quality and clinical utility are distinct claims.


## Ethical and implementation considerations

Prediction systems distribute resources and attention. A threshold may determine who receives follow-up, imaging, or intensive monitoring, so assess whether each group has comparable access to the downstream intervention. Equal AUC does not imply equal calibration or equal consequences. Quantify false-positive and false-negative burden by relevant groups, but interpret disparities in light of data quality, clinical context, and uncertainty. Fairness criteria can conflict when outcome prevalence differs; state the normative goal rather than implying one metric resolves it.

Data governance covers consent or lawful basis, privacy, security, retention, and secondary use. De-identification may not prevent linkage in rare-disease or small-community datasets. Minimize inputs and restrict use to the stated purpose. Avoid feeding predictions into care before prospective evaluation if doing so would alter labels and make the evidence uninterpretable. For deployed systems, assign responsibility for versioning, incident response, drift detection, override, and retirement. A model without accountable maintenance is not a finished product.

The evaluation ladder moves from internal validation to external validation, prospective silent evaluation, and impact evaluation. Internal validation estimates optimism within source data; external validation tests transport; a silent study tests real-time feasibility; an impact study tests whether use improves outcomes or decisions. Success at one stage does not guarantee success at the next. Report negative findings and workflow failures. Transparent limitations help readers decide whether evidence applies to their population and use case.


## Sample size, missingness, and uncertainty in evidence

The number of rows is not the effective sample size when observations are clustered or repeated. Event count, site count, follow-up, and predictor availability constrain what can be learned. A million notes from a few hundred people do not validate new-patient performance. Rare outcomes make threshold metrics and subgroup estimates imprecise; report denominators and intervals. A model with narrow bootstrap intervals can still be biased if the bootstrap sample mirrors a flawed cohort design.

Missingness mechanisms matter. Missing completely at random is uncommon in clinical data; a test may be absent because the clinician saw no indication, because the patient lacked access, or because a value was not captured. Imputation under a missing-at-random assumption cannot fix missing-not-at-random bias without additional information. Include missingness indicators only when clinically and operationally appropriate, and conduct sensitivity analyses. Avoid treating “not measured” as normal. For longitudinal predictors, distinguish no event from no observation and account for censoring.

Report model uncertainty and data uncertainty separately. Confidence intervals quantify sampling variation under assumptions; they do not capture changes in coding, care, prevalence, or clinical policy. External data help assess transport but may still be unrepresentative of later deployment. State which uncertainties remain and define monitoring triggers for recalibration or redevelopment. A carefully stated limitation is more informative than an unsupported claim that a model is generalizable.


## A practical analysis checklist

Before modeling, write a one-sentence target specification: population, prediction time, outcome, horizon, and intended action. Verify each variable’s measurement and availability time. Inspect cohort inclusion, outcome prevalence, follow-up, missingness, and repeated observations. Draw a simple data-flow or causal diagram to distinguish baseline predictors, treatment decisions, outcomes, and selection mechanisms. Pre-register the primary performance measures and important subgroups where feasible.

During development, preserve a locked test cohort, use patient/site/time grouping that matches intended use, and fit every preprocessing step inside resampling. Compare simple clinical baselines with candidate algorithms using nested tuning. Record all attempted model families and metrics to avoid selective reporting. For survival or competing-risk targets, use methods that respect censoring and state which event probability is estimated. For clustering, validate stability and independent replication rather than classification measures.

At evaluation, report confidence intervals, calibration, discrimination, threshold consequences, subgroup denominators, and external validity. Explain limitations of the label and the likely direction of bias where possible. AUC does not measure calibration or benefit; an explanation plot does not establish mechanism; a high-quality test score does not establish implementation impact. The final report should say what decisions evidence supports and what remains unknown.

After evaluation, define monitoring and governance before deployment: expected data ranges, alert thresholds, outcome-label delay, review owner, update approval, rollback, and end-of-life criteria. Monitor clinical burden and access as well as model metrics. If performance shifts, determine whether the cause is prevalence, coding, measurement, or population change before recalibrating or retraining. Changes should be versioned and independently re-evaluated. This lifecycle is part of responsible statistical practice.

## References and further reading

- Moons KGM, Damen JAA, Kaul T, et al. PROBAST+AI: an updated quality, risk of bias, and applicability assessment tool for prediction models using regression or artificial intelligence methods. *BMJ*. 2025;388:e082505. [doi:10.1136/bmj-2024-082505](https://doi.org/10.1136/bmj-2024-082505)
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement: updated guidance for reporting clinical prediction models that use regression or machine learning methods. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378)
- Van Calster B, McLernon DJ, van Smeden M, Wynants L, Steyerberg EW. Calibration: the Achilles heel of predictive analytics. *BMC Medicine*. 2019;17:230. [doi:10.1186/s12916-019-1466-7](https://doi.org/10.1186/s12916-019-1466-7)
- Obermeyer Z, Powers B, Vogeli C, Mullainathan S. Dissecting racial bias in an algorithm used to manage the health of populations. *Science*. 2019;366:447–453. [doi:10.1126/science.aax2342](https://doi.org/10.1126/science.aax2342)
