---
title: Clustering in health data
summary: An introduction to unsupervised grouping, choices of distance and cluster number, and validation of patient subtypes.
---

## Overview

Clustering groups observations so that members of a group are similar under a chosen representation and distance, while groups differ according to an algorithmic criterion. It is an unsupervised learning task: the method does not use an outcome label to define the groups. In health research, clustering can explore patient profiles, trajectories, or service use, but an algorithm always returns a partition or structure even when no meaningful subtypes exist.

A cluster is not automatically a disease subtype, causal mechanism, or treatment-response group. Its meaning depends on who was sampled, which variables were included, how they were scaled, which distance was used, and how many clusters were requested. Useful findings require stability, external replication, clinical interpretation, and evidence that the distinction matters for a decision.

## Define the unit and scientific purpose

Specify whether each row represents a person, visit, image, or time window. If patients contribute multiple records, ordinary clustering may group visits rather than people and may treat repeated measurements as independent. Decide whether the question concerns baseline phenotypes, longitudinal trajectories, or patterns of resource use; these require different representations.

Clustering is most useful for generating hypotheses, summarizing complex profiles, or exploring whether a proposed classification is reflected in data. It is weak evidence for a natural taxonomy. If the goal is prediction of a known outcome, supervised learning is more directly aligned. If the goal is causal treatment-effect heterogeneity, clustering on outcomes or treatment response can create biased subgroups and requires methods designed for causal inference.

Choose variables based on the construct, not simply availability. Including age, utilization, and laboratory measures can yield groups driven primarily by age or care access. Variables downstream of clinical decisions may cluster treatment patterns rather than biology. Avoid leakage from future outcomes when clusters will be used for prospective prediction.

## Representations, distances, and scaling

K-means minimizes within-cluster squared Euclidean distances to centroids. It works best for numeric features with meaningful distance, approximately compact spherical groups, and manageable outlier influence. The algorithm alternates between assigning each observation to its nearest centroid and updating centroids until convergence. It can find a local optimum, so different starts may produce different solutions.

Scale matters: a biomarker spanning thousands of units can dominate a variable spanning 0–1. Standardization gives equal variance weight but can overemphasize noise or rare extreme values. Robust scaling may help with heavy tails. One-hot encoding nominal variables changes geometry in ways that depend on category frequency; ordinal coding imposes numeric spacing. Gower distance or methods for mixed data may be more appropriate, but their handling of missingness and variable weights must be stated.

High-dimensional correlated features can count one construct multiple times. Dimension reduction can simplify structure but may preserve variation unrelated to clinical meaning. Feature selection, imputation, scaling, and representation learning are data-adaptive steps and should be repeated in stability analyses. Use a clinically motivated feature set and conduct sensitivity analyses with plausible alternatives.

## K-means objective and worked example

For observations x_i assigned to cluster C_k with centroid μ_k, K-means minimizes WCSS = Σ_k Σ_(i in C_k) ||x_i−μ_k||². WCSS never increases as the number of clusters K increases, so its minimum alone cannot select K. A hypothetical set of standardized patient profiles may have WCSS 120 at K=2 and 84 at K=3. The 30% reduction does not prove three subtypes; adding a group always improves in-sample fit.

Imagine four patients represented by two standardized values: (−1,−1), (−1,1), (1,−1), and (1,1). With K=2, one possible assignment groups by the first coordinate, giving centroids (−1,0) and (1,0). Another equally plausible assignment groups by the second coordinate. Both solutions have the same WCSS. Without clinical purpose or external evidence, the data do not identify a unique interpretation.

~~~r
set.seed(202)
x <- scale(dat[c("age", "creatinine", "symptom_score")])
km <- kmeans(x, centers = 3, nstart = 50)
table(km$cluster)
aggregate(dat[c("age", "creatinine", "symptom_score")],
          list(cluster = km$cluster), median)
~~~

This is an exploratory example. The number of clusters is specified, and different initializations may yield different solutions. Fit preprocessing within each bootstrap or resampled dataset when assessing stability. Summaries on original clinical units are easier to interpret than standardized centroids alone. Inspect outliers, missingness, and whether clusters are driven by one variable or site.

## Choosing the number and form of clusters

The elbow plot compares within-cluster sum of squares over K and looks for diminishing returns, but elbows can be subjective or absent. Silhouette width compares within-cluster cohesion with separation from the nearest alternative group; it favors certain geometries and does not establish clinical value. Gap statistics compare observed compactness with a reference null distribution. Information criteria apply to model-based clustering under distributional assumptions. No single index determines the “true” K.

Consider algorithmic stability and usefulness. If small perturbations change membership substantially, labels are fragile. If a three-cluster solution is stable but differs only by a clinically irrelevant lab value, it may not aid decisions. Assess multiple algorithms and representations, but avoid selecting whichever produces the most attractive story. Prespecify primary criteria where possible and report alternatives explored.

Density-based methods can identify irregular shapes and label outliers as noise; hierarchical clustering produces nested merges and requires a cut rule; latent class or mixture models estimate probabilistic membership under distributional assumptions. These approaches answer different structural questions. Compare solutions using stability and external evidence, not just internal fit.

## Stability and external replication

Bootstrap or subsample patients, refit the entire pipeline, and compare cluster assignments using adjusted Rand index, variation of information, or pairwise co-membership. Label switching must be handled because cluster numbers have no inherent identity. Report stability distributions and whether small groups recur. A cluster that appears only in one of many starts or samples is weak evidence.

External replication asks whether a similar profile structure appears in another cohort, site, or time period. Exact centroids may shift with prevalence and measurement; compare clinically meaningful characteristics and assignment rules. If a model will assign future patients, fit a fixed preprocessing and clustering rule and assess assignment uncertainty and out-of-distribution behavior. Re-running clustering in each clinic may produce different labels that cannot be compared.

Outcome association after clustering is not independent confirmation if many cluster counts and outcome comparisons were explored. Treat post-clustering comparisons as exploratory, adjust or account for selection, and validate in new data. Clusters derived from outcome-related predictors can be associated with the outcome by construction.

## Clinical interpretation and common failure modes

Profile clusters using original-unit distributions, not only means. Show within-cluster spread, sample size, event count, site composition, missingness, and uncertainty. A cluster label such as “high-risk inflammatory phenotype” should be grounded in prespecified variables and externally supported outcomes, not chosen after inspecting favorable patterns.

Small clusters may represent data errors, rare but important patients, or algorithmic artifacts. Investigate source records and whether the cluster persists under reasonable preprocessing choices. K-means is sensitive to outliers because centroids are means and squared distances penalize extremes heavily. Robust alternatives or explicit outlier handling may be needed, with choices documented.

Cluster membership is often uncertain, yet hard labels imply certainty. Mixture models can provide posterior membership probabilities; K-means distances can show relative proximity, but are not calibrated probabilities. Patients near boundaries may switch groups with small measurement changes. Avoid assigning a treatment or diagnosis solely from unstable membership.

## Reproducibility and deployment

Report inclusion criteria, unit, features, transformations, distance, algorithm, random starts, initialization, K selection, and software version. Provide code and a clear assignment procedure. If any feature selection or dimension reduction used the full dataset, describe this and avoid claiming unbiased external performance.

Before operational use, define how new patients are assigned, how missing or out-of-range values are handled, and whether the cluster model is frozen or periodically refit. Monitor cluster prevalence, feature distributions, membership uncertainty, and outcomes. A change in assay or care pathway can shift the partition. Re-estimate clusters only with a documented versioning and validation process.

Clustering can support service design if groups lead to feasible, beneficial actions. Evaluate those actions prospectively. A cluster taxonomy that does not improve prediction, treatment choice, or communication may add complexity without utility. Keep the distinction between exploratory pattern discovery and validated clinical classification clear.

### Distance geometry in mixed health data

Most clustering results are consequences of a distance matrix. Numeric variables may be standardized, transformed, or weighted; binary and nominal features need a dissimilarity definition; and missing pairs may be excluded or imputed. If different patient pairs have distances computed from different observed subsets, those distances may not be comparable. State the rules and evaluate sensitivity to them.

For Gower distance, numeric differences are scaled by observed ranges and categorical matches contribute zero while mismatches contribute one, with contributions averaged across available features. A broad range can compress clinically meaningful differences, and a rare category can have disproportionate influence. Consider clinically chosen weights and show how cluster assignments change. Mixed-data methods such as partitioning around medoids can use arbitrary dissimilarities and are less sensitive to extreme observations than K-means, but are not immune to poor representations.

Correlated variables effectively reweight a construct. If five laboratory values measure similar renal function, they can collectively dominate one symptom score. Examine correlation structure and consider combining redundant measures, using a justified dimension reduction, or weighting domains before clustering. Domain weighting changes the question and should be reported as a substantive choice.

## Alternative algorithms and what they optimize

Hierarchical agglomerative clustering starts with individual observations and repeatedly merges the closest groups according to a linkage rule. Single linkage can form elongated chains; complete linkage favors compact groups; average linkage uses average pairwise distances; Ward linkage seeks increases in within-cluster variance for squared Euclidean settings. A dendrogram shows nested merges, but the vertical scale and cut height do not reveal a natural number without additional evidence.

Model-based clustering assumes data arise from a mixture of distributions and estimates component parameters and membership probabilities. A Gaussian mixture can represent elliptical groups and quantify uncertainty, but may fit skewed or heavy-tailed clinical measures poorly. Bayesian information criterion can guide component number under model assumptions; it should be complemented by diagnostics, stability, and interpretability. Latent class models for categorical indicators make their own conditional-independence and measurement assumptions.

Density methods such as DBSCAN define clusters as dense regions and can label isolated observations as noise. They may suit irregular geometric structures, but results depend on neighborhood radius and minimum density. In high dimensions, density becomes sparse and parameter choice difficult. Spectral clustering constructs a graph of similarities and partitions its eigenstructure; it can find nonconvex patterns but requires a defensible affinity matrix and can be sensitive to graph construction.

No method is universally superior. Internal metrics tend to favor particular shapes and distance assumptions. Compare algorithm families only when each is meaningfully specified and validated. A simpler solution with stable assignments and coherent clinical profiles may be more useful than an intricate model with slightly better internal score.

### More rigorous assessment of cluster number

Use multiple criteria with distinct interpretations. The elbow curve plots within-cluster sum of squares; it describes fit improvement, not evidence that groups exist. Average silhouette width compares separation and cohesion but depends on distance and can prefer a small number of broad groups. Gap statistic contrasts observed dispersion with reference data generated under a null. Mixture-model criteria compare likelihood penalized for complexity, conditional on a probability model.

The null reference matters. A uniform reference over a bounding box may be inappropriate for skewed or correlated biomedical variables. Compare against simulated data preserving marginal and perhaps correlation structure where feasible. If a claimed subtype structure is no better than a continuous gradient, clustering may discretize a continuum rather than discover categories.

Assess whether a cluster solution is robust to patient resampling, initializations, feature subsets, scaling, missing-data choices, and sites. A consensus matrix shows how often pairs co-cluster across runs. Stability alone does not validate meaning: a strong age gradient can create stable partitions with arbitrary boundaries. Combine stability with external, prespecified clinical criteria.

### Worked stability analysis

Suppose 500 bootstrap samples are drawn from a cohort and a three-cluster solution is refit each time. After aligning labels, a pair of patients is assigned to the same cluster in 470 of 500 runs, yielding co-clustering frequency 0.94. Another pair is together in only 260 runs (0.52), suggesting uncertain boundary membership. Summarize within-cluster consistency and inspect whether a small group persists. Do not report only the best-fitting run.

~~~r
set.seed(50)
x <- scale(dat[c("age", "creatinine", "symptom_score")])
km <- kmeans(x, centers = 3, nstart = 50)
sil <- cluster::silhouette(km$cluster, dist(x))
mean(sil[, "sil_width"])
~~~

This computes one internal silhouette summary for one standardized dataset and fixed K. It does not include selection uncertainty or prove clinical validity. For stability, repeatedly resample patients, refit scaling and clustering, align labels, and summarize agreement. If sites are the target of transport, assess solutions across sites rather than only random patient samples.

## Post-cluster outcome analysis

Clusters are often compared on outcomes to claim clinical relevance. If clustering features were selected or transformed using outcome information, those outcome differences are partly built in. Even without direct outcome use, exploring many values of K and many outcomes creates selection. Treat such results as exploratory, report all evaluated solutions and outcomes, and validate the chosen profile in independent data.

Cluster membership is a derived variable with uncertainty. Regression that treats a selected hard assignment as known can understate uncertainty in downstream associations. In probabilistic mixture models, posterior membership probabilities can be propagated or sensitivity analyses can compare hard and soft assignment. For K-means, bootstrap assignment stability provides an empirical view, though it is not a formal posterior probability.

Do not infer treatment-effect heterogeneity from differing outcome rates across clusters. High baseline risk does not mean greater relative or absolute treatment benefit. To estimate whether treatment effects vary, use a randomized design or causal methods that directly model treatment-effect heterogeneity, preserve uncertainty, and validate the subgroup policy.

## Deciding if a cluster is clinically useful

A useful subgroup should have a reproducible profile, adequate size, a plausible relation to the clinical construct, and a decision that differs in a beneficial way. Define what action might follow before labeling clusters. If no feasible action exists, the taxonomy may be descriptive only. Evaluate whether the grouping adds information beyond continuous risk scores or established classifications.

Engage clinicians and patients in interpreting profiles. A statistical group driven by utilization may describe barriers to care rather than a patient phenotype. A group with severe symptoms but missing laboratory values may reflect measurement access. Name clusters descriptively from measured features and avoid stigmatizing labels. Check whether membership maps to socioeconomic or demographic proxies and what consequences follow.

External replication need not reproduce identical centroids, but should show comparable structure and actionable meaning. Freeze a cluster assignment rule and test it in new data when future classification is intended. If each cohort is reclustered independently, matching groups post hoc can be subjective; report matching criteria and ambiguity.

## Operational assignment and uncertainty

A deployment rule must include feature definitions, transformations, model parameters, and how new patients are assigned. K-means assigns to the nearest centroid, even for a patient far outside the training range. Add a support measure such as distance to nearest centroid and specify when the model abstains. For density methods, new points may be labeled noise; for hierarchical clustering, a rule for assigning new observations is not inherent and must be designed.

Monitor cluster prevalence, distances, missingness, and outcomes over time. Shifts may indicate a changing population, measurement pipeline, or care process. Refitting the clusters can change labels and complicate comparisons; maintain versioned solutions and validate any update. If clusters inform treatment allocation, prospectively test the policy and include safeguards for uncertain membership.

## Reporting an exploratory cluster analysis

Report the sample, unit, feature rationale, preprocessing, distance, algorithm, initialization, software, cluster-number criteria, and every major analysis choice. Show cluster sizes, profiles in original units, distributions and within-cluster spread, missingness, site composition, and assignment uncertainty. Include stability results and external validation when available. Distinguish discovery from confirmatory evidence.

Make clear whether the output is an exploratory description, a replicated taxonomy, a predictive feature, or an implemented classification. Avoid claiming “subtypes” when a continuous risk gradient or sampling artifact could explain the grouping. Share code and seeds where possible. A transparent account lets readers judge what structure the data support and what remains a hypothesis.

### When clusters should remain exploratory

If no independent cohort or actionable distinction exists, present the groups as an exploratory summary and avoid naming them as disease subtypes. State what additional data or prospective evidence would change that interpretation.

## References and further reading

- MacQueen J. Some methods for classification and analysis of multivariate observations. *Proceedings of the Fifth Berkeley Symposium on Mathematical Statistics and Probability*. 1967;1:281–297. [Project Euclid](https://projecteuclid.org/ebooks/berkeley-symposium-on-mathematical-statistics-and-probability/Proceedings-of-the-Fifth-Berkeley-Symposium-on-Mathematical-Statistics-and-Probability-Volume-1/chapter/Some-methods-for-classification-and-analysis-of-multivariate-observations/bsmsp/1200512992).
- Hennig C. Cluster-wise assessment of cluster stability. *Computational Statistics & Data Analysis*. 2007;52:258–271. [doi:10.1016/j.csda.2006.11.025](https://doi.org/10.1016/j.csda.2006.11.025).
- See [K-nearest neighbors](k-nearest-neighbors.html) for distance-based supervised prediction.
