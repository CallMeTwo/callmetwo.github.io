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

## References and further reading

- MacQueen J. Some methods for classification and analysis of multivariate observations. In: *Proceedings of the Fifth Berkeley Symposium on Mathematical Statistics and Probability*. 1967;1:281–297. [Project Euclid](https://projecteuclid.org/ebooks/berkeley-symposium-on-mathematical-statistics-and-probability/Proceedings-of-the-Fifth-Berkeley-Symposium-on-Mathematical-Statistics-and/citation)
- von Luxburg U. A tutorial on spectral clustering. *Statistics and Computing*. 2007;17:395–416. [doi:10.1007/s11222-007-9033-z](https://doi.org/10.1007/s11222-007-9033-z)
