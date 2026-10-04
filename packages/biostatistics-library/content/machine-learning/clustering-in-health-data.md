---
title: Clustering in health data
summary: An introduction to unsupervised grouping, choices of distance and cluster number, and validation of patient subtypes.
---

## Overview and key ideas

Clustering groups observations by similarity without using a supplied outcome label. Common methods include k-means (assign points to k centroids), hierarchical clustering (build a nested tree of groups), and density-based methods such as DBSCAN (find dense regions and mark some points as noise). Different algorithms optimize different definitions of a cluster; they need not discover the same groups.

In health research, clustering is often used to explore phenotypes from symptoms, laboratory values, imaging features, or longitudinal profiles. A cluster is first a mathematical grouping under specified preprocessing and distance choices. Calling it a disease subtype requires evidence that it is stable, clinically meaningful, and useful in independent data.

## When to use it

Use clustering to generate hypotheses or summarize complex profiles when no outcome label defines the groups. For instance, researchers may explore whether patients with chronic disease show distinct combinations of inflammatory markers. It is not a substitute for classification when known labels exist, and it does not establish that clusters are natural biological entities.

## Assumptions and limitations

- Results depend on included variables, scaling, missing-data handling, distance metric, algorithm, and chosen cluster number. These choices are substantive, not cosmetic.
- K-means favors roughly spherical, similarly sized clusters and is sensitive to initialization and outliers. It minimizes squared Euclidean distances, so continuous standardized data are the usual setting.
- High-dimensional data can appear to contain clusters even when structure is weak. Dimensionality reduction may help visualization but can also change distances and apparent group structure.
- Cluster labels are arbitrary and may be unstable under resampling. Validate membership stability and replicate the solution in a separate cohort.
- If clinical outcomes are inspected repeatedly to choose clusters or narrate them, apparent outcome differences are exploratory and require independent confirmation.

## Worked example

Imagine 120 patients described by three standardized biomarkers. K-means with k = 2 returns groups of 70 and 50 patients. If the mean biomarker profiles differ, describe the standardized values and uncertainty, then test whether assignments remain similar across bootstrap samples and a later cohort. Suppose 14 of 70 patients in group A and 20 of 50 in group B are hospitalized next year: risks are 20% and 40%, a 20 percentage-point observed difference. Because hospitalization was not used to create groups only if that was prespecified and true, this outcome comparison may be treated as a separate exploratory association; it is not evidence that group membership causes hospitalization or that a cluster-targeted intervention works.

## Interpretation and common pitfalls

- Report preprocessing, features, distance, algorithm, initialization, and how k was selected. Show cluster sizes and profiles, not just a colorful plot.
- Assess stability under resampling and alternative defensible choices; quantify uncertainty in assignments when possible.
- Avoid selecting k solely because it yields the most clinically appealing story. Silhouette scores and elbow plots are diagnostics, not proof of true subtypes.
- Do not use “phenotype” or “endotype” as if established from one exploratory dataset. Replication and biological or clinical validation are needed.
- Protect against leakage if clustering is part of a prediction pipeline: learn transformations and clusters from training data, then apply them unchanged to evaluation data.


## K-means objective and cluster-number diagnostics

Given standardized vectors x_i and k centers mu_g, k-means minimizes within-cluster sum of squares W=sum_g sum_(i assigned g)||x_i-mu_g||^2. It alternates assignment to the nearest center and recomputation of centers until assignments stabilize. Because the objective is non-convex, starting values can lead to different local minima; use multiple starts and report stability. A cluster is defined relative to selected variables, transformations, distance, and cohort. It is not proof of a latent disease class.

The elbow plot compares W across candidate k, but an elbow can be absent or subjective. The average silhouette contrasts a patient’s mean within-cluster distance a(i) with its nearest alternative-cluster distance b(i): s(i)=(b-a)/max(a,b). Values near 1 suggest separation under the chosen metric; near 0 indicates overlap. Silhouette is not clinical validity. Gap statistics compare observed dispersion to a reference null, whose construction itself matters. Bootstrap or subsampling stability asks whether similar groups recur under data perturbation. Align labels before comparing runs because cluster numbers are arbitrary.

```r
set.seed(41)
X <- scale(as.matrix(dat[c("crp", "albumin", "egfr")]))
km <- kmeans(X, centers = 3, nstart = 50, iter.max = 100)
km$size
aggregate(as.data.frame(X), list(cluster = km$cluster), mean)
# silhouette requires package cluster; inspect several k, not only the best score
library(cluster)
sil <- silhouette(km$cluster, dist(X))
mean(sil[, "sil_width"])
```

In a predictive pipeline, centering, scaling, feature selection, and cluster fitting must be learned on training data; assign validation patients to frozen centroids. In exploratory subtype work, distinguish discovery from validation: derive groups in one cohort, specify a reproducible assignment rule, then examine reproducibility and external clinical associations elsewhere. If outcomes informed feature choice, k selection, or naming, later outcome comparisons are post-selection and hypothesis-generating. Report cluster sizes, profiles, uncertainty in membership, and patients poorly assigned near boundaries. For mixed data, Euclidean k-means is usually inappropriate; consider Gower distances with suitable clustering or model-based approaches and explain the implied geometry.


## Development workflow: from question to a defensible cluster solution

Define the scientific role of clustering before fitting it. In exploratory work, the purpose may be to summarize heterogeneity and generate hypotheses. In a predictive pipeline, the purpose may be to assign new patients using a rule learned from training data. These require different evaluation plans. State the eligible population, measurement window, features, transformations, distance, algorithm, and proposed use. Avoid using future outcomes or variables downstream of the phenotype definition to create the groups.

Preprocessing is part of the model: imputation, transformations, scaling, feature selection, dimensionality reduction, and the clustering algorithm must be documented. In prediction tasks, learn those transformations and the clusters in training folds only; map validation patients to the frozen solution. In exploratory taxonomy work, assess sensitivity to plausible preprocessing and algorithm choices. The cluster count should be informed by multiple diagnostics and scientific utility rather than selected because one value produces an attractive narrative.

Quantify both separation and stability. Silhouette width measures relative distances under the chosen metric; bootstrap co-clustering evaluates reproducibility under resampling; neither establishes clinical meaning. Report cluster sizes and uncertainty. A high silhouette score can describe geometrically distinct groups that are biologically trivial, while lower separation may be expected for continuous disease spectra. Do not dichotomize continuous phenotypes solely to make a clean figure.

For a deployment rule, save the exact training centers or medoids, scaling parameters, feature order, missing-data procedure, and software version. Evaluate assignment coverage, distance to the nearest cluster, and out-of-support frequency in an external cohort. Re-fitting clusters in each validation sample does not test whether the original classifier transports. For etiologic or prognostic interpretation, examine prespecified associations in independent data and account for multiple comparisons. If outcomes influenced clustering decisions, call the findings exploratory and avoid ordinary confirmatory p-values.

A report should include cohort flow, missingness, feature rationale, preprocessing, distance, algorithm, initialization strategy, candidate cluster counts, selection criteria, stability, cluster profiles, and validation population. Describe limitations of the induced geometry: labels are arbitrary, membership can be uncertain, and the groups need not correspond to natural biological kinds. Clinical terminology such as subtype, endotype, or treatment-responsive group needs independent evidence beyond a clustering output.

## Alternative algorithms and mixed-type patient data

Hierarchical agglomerative clustering starts with each patient as a singleton and repeatedly merges the closest groups. The linkage rule determines how distance between groups is defined: single linkage can chain observations through bridges; complete linkage favors compact groups but is sensitive to outliers; average linkage uses average pairwise distance; Ward linkage merges groups that minimally increase within-cluster sum of squares and is most naturally paired with Euclidean geometry. A dendrogram displays nested merges, but drawing a horizontal cut at a particular height is still a choice of cluster count. Rescaling features can change the entire tree.

Density-based methods such as DBSCAN identify regions with enough observations within a radius epsilon and classify sparse points as noise. They can detect non-spherical shapes and do not require k, but epsilon and minimum-neighbor settings can be difficult in mixed-density health data. High-dimensional distances weaken the notion of density. A “noise” observation may be a rare but clinically important patient, not a data error. Report the fraction designated noise and examine who they are.

For categorical or mixed data, ordinary Euclidean distance after arbitrary numeric coding is generally inappropriate. Gower dissimilarity can combine numeric ranges and categorical mismatches, after which partitioning-around-medoids can yield observed patients as representatives. Model-based latent class analysis instead posits a mixture of class-specific distributions; posterior probabilities quantify membership conditional on that model. Conditional independence of indicators within classes is a strong assumption and local dependence can create spurious extra classes. These methods answer different questions and should not be compared by a single fit score alone.

```r
# Hierarchical clustering illustration for continuous standardized markers
Z <- scale(dat[c("crp", "albumin", "egfr")])
d <- dist(Z, method = "euclidean")
hc <- hclust(d, method = "ward.D2")
plot(hc, labels = FALSE, hang = -1)
groups <- cutree(hc, k = 3)
table(groups)
```

Ward clustering is sensitive to outliers and favors compact groups. Check robustness with other plausible linkage or distance choices and resampling. The dendrogram is descriptive: it does not establish that three classes exist. For a clinical presentation, show feature profiles and overlap rather than treating arbitrary cluster numbers as ordered severity.

## Cluster stability and reproducible assignment

A practical stability analysis repeatedly samples patients, refits the complete preprocessing and clustering pipeline, and compares partitions on overlapping patients. The adjusted Rand index compares pairwise same/different assignments while correcting for chance; values near one indicate similar partitions, while values near zero are consistent with chance-level agreement. Its interpretation depends on cluster size and number. Per-patient co-clustering probabilities can show that a broad group is stable while borderline members move between groups. Report both global and patient-level stability rather than choosing the most favorable statistic.

For a cluster intended to guide care, define a patient assignment rule and a policy for ambiguity. K-means can assign to the closest center, but distance to the center should be compared with training distributions. A patient far from every center should not be forced into a familiar category without warning. A model-based mixture can retain posterior probabilities rather than applying a hard maximum-probability label. Evaluate whether uncertainty is concentrated in a clinically meaningful subgroup or reflects noisy assays.

The validation plan should separate geometric reproducibility, biological plausibility, prognostic association, treatment interaction, and clinical utility. Replication of the same profiles in a second cohort supports reproducibility. It does not show that groups have different causal treatment responses. A treatment-selection claim needs an appropriately designed interaction analysis or trial, with adequate power and prospective confirmation. Avoid naming a cluster “responder” because its observed outcome was favorable after exploratory inspection.


## Full comparative analysis: selecting and validating a solution

Assume 500 patients have four skewed inflammatory measurements, 12% missingness in one assay, and two hospitals. The team seeks exploratory profiles, not an individual risk score. First display distributions by site and missingness. If one hospital uses a different assay platform, standardization pooled across sites can create clusters that primarily identify institution. Investigate harmonization and include a site-held-out sensitivity analysis. Impute only with a defensible approach; mean imputation can create artificial central points and change cluster geometry. The analysis plan should state whether outliers are errors to correct, rare cases to retain, or a separate population of interest.

Log-transform positive markers where measurement science supports it, then center and scale. Compare k-means for compact spherical groups, hierarchical Ward clustering for nested structure, and a medoid approach if robustness to outliers is important. Candidate k values should be evaluated using dispersion, silhouette, cluster-size plausibility, and bootstrap stability. Suppose k=2 yields clusters of 310 and 190 with mean silhouette .31; k=3 yields a group of 9 and silhouette .34. The small increase may not justify a rare cluster unless those nine patients form a reproducible and clinically meaningful profile. Use resampling to test whether the nine-person group recurs.

```r
set.seed(17)
features <- c("crp", "ferritin", "albumin", "neutrophils")
# Example only: imputation should be learned and sensitivity-tested.
med <- vapply(dat[features], median, 0.0, na.rm=TRUE)
X <- as.data.frame(Map(function(x, m) { x[is.na(x)] <- m; x },
                       dat[features], med))
Z <- scale(log1p(X))
ks <- 2:5
fits <- lapply(ks, function(k) kmeans(Z, centers=k, nstart=100))
data.frame(k=ks,
  withinss=sapply(fits, `[[`, "tot.withinss"),
  min_cluster=sapply(fits, function(f) min(f$size)))
```

The median-imputation example is intentionally a sensitivity-analysis starting point, not a universally recommended missing-data solution. Repeat with an appropriate imputation method and alternate transformations. Bootstrap patients, refit preprocessing and clustering, and compare co-clustering; preserve site structure if sampling by hospital. Once selected, describe clusters by original-unit distributions with uncertainty, not only standardized centroids. Replicate the fixed feature definition in an independent cohort, then ask whether profiles correspond to known biology or useful decisions. Outcome differences discovered after trying multiple k values remain exploratory. Neither a silhouette statistic nor a clinically appealing label establishes a natural subtype.


## Clinical interpretation and treatment relevance

A stable profile is an empirical description of a cohort under a chosen representation. Clinical interpretation should start with original-scale measurements, distributions, and overlap. Cluster centroids can hide skew, outliers, and multimodality; report medians, quantiles, proportions, and patient examples that are de-identified. Describe how many members fall near the boundary and whether group differences are larger than assay reproducibility. If measurements have clinically established reference ranges, present them alongside standardized summaries.

An association between cluster membership and outcome is not evidence of distinct response to treatment. To claim that cluster-guided treatment improves outcome, estimate a prespecified treatment-by-cluster interaction under an appropriate design, ideally a randomized trial or a robust causal analysis with adequate overlap and event counts. A subgroup with a high event rate may simply be a severity stratum. The utility of a taxonomy depends on whether it changes a decision and whether that decision improves outcomes. Cluster-based labels should not be used to restrict care without prospective evidence.

Ethical review matters when groups correlate with race, disability, language, or access. These variables may reflect structural exposures and measurement differences rather than intrinsic biology. Examine how cluster assignment changes under alternative feature sets and assess whether labels could stigmatize patients. Include affected clinical communities in defining intended use and communication. Use neutral descriptive names until mechanisms are independently established. A reproducible, carefully qualified phenotype can be valuable without being framed as a newly discovered disease subtype.


## Statistical reporting after exploratory discovery

After groups are fixed, report profiles with uncertainty intervals and avoid treating sample-derived clusters as fixed without qualification. Bootstrap intervals for cluster-specific means can be misleading if cluster assignments are held fixed; a full-pipeline bootstrap should repeat preprocessing and clustering, align labels, and summarize both profile and membership variability. If alignment is unstable, describe that instability rather than forcing a one-to-one match. When testing multiple outcomes, label the analysis exploratory and control the false-discovery rate only as a partial safeguard; multiplicity correction does not remove selection bias from choosing the representation based on observed outcomes.

For longitudinal subtyping, trajectory mixture models assume a particular number and shape of latent trajectories and may assign people probabilistically. Compare predicted trajectories with observed individual paths and inspect whether a subgroup is driven by follow-up duration or informative dropout. Patients with more visits can dominate distance-based methods unless observation schedules are standardized or modeled. State whether the aim is to discover retrospective disease courses or classify future patients from early information. These are different scientific questions and require different validation designs.

A transparent report should make the solution reproducible without asserting that there is one uniquely correct partition. Provide code or precise settings, feature definitions, transformation parameters, distance or likelihood, random seeds, and stability results. Publish a cluster assignment rule only if it has been validated for new patients. Otherwise, present the work as cohort exploration and use it to formulate independent hypotheses.


In every report, distinguish the exploration sample from any validation sample and specify which choices were made before validation. A second cohort should be used to test a frozen representation and assignment strategy; re-discovering an attractive partition independently is evidence of recurring structure, but not proof that the original labels transfer. Present both perspectives clearly. These distinctions let readers assess how much evidence supports the cluster solution and prevent descriptive grouping from being mistaken for a validated clinical classification.


Cluster count should therefore be treated as a modeling decision with uncertainty, not as a discovered constant. Reporting solutions across a small set of defensible counts can show which broad profiles persist and which finer subdivisions are fragile. Independent replication and clinical utility remain the key next steps.


Where assignment is intended for future patients, define a reject option for low-confidence or out-of-support cases and report its frequency. Performance among confidently assigned patients should be reported together with coverage, since refusing difficult assignments can make apparent validity look better. Keep an exploratory cluster map separate from any clinical classification claim until the assignment rule has been validated prospectively.


If no reliable assignment or replication is available, retain the result as an exploratory summary rather than a clinical tool.


Reference the cluster count, stability criterion, and external replication plan in the analysis protocol where possible. This keeps exploratory choices transparent and makes the evidence easier to reproduce.

## References and further reading

- Moons KGM, Damen JAA, Kaul T, et al. PROBAST+AI: an updated quality, risk of bias, and applicability assessment tool for prediction models using regression or artificial intelligence methods. *BMJ*. 2025;388:e082505. [doi:10.1136/bmj-2024-082505](https://doi.org/10.1136/bmj-2024-082505)
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378)
- MacQueen J. Some methods for classification and analysis of multivariate observations. In: *Proceedings of the Fifth Berkeley Symposium on Mathematical Statistics and Probability*. 1967;1:281–297. [Project Euclid](https://projecteuclid.org/ebooks/berkeley-symposium-on-mathematical-statistics-and-probability/Proceedings-of-the-Fifth-Berkeley-Symposium-on-Mathematical-Statistics-and/citation)
- von Luxburg U. A tutorial on spectral clustering. *Statistics and Computing*. 2007;17:395–416. [doi:10.1007/s11222-007-9033-z](https://doi.org/10.1007/s11222-007-9033-z)
