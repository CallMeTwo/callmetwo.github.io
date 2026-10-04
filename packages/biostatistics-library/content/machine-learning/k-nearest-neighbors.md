---
title: K-nearest neighbors
summary: A distance-based prediction method, including scaling and neighborhood choices that matter for biomedical data.
---

## Overview and key ideas

K-nearest neighbors (k-NN) predicts an outcome for a new patient by finding the k most similar patients in the training data. For classification, it uses a majority vote or the proportion of neighbors in each class; for regression, it averages their outcomes, sometimes with closer neighbors weighted more heavily. It is a **lazy** method: it stores training records rather than fitting a compact equation.

The distance metric defines similarity. Euclidean distance is common for continuous variables; mixed clinical data may require carefully designed scaling and categorical distance. The value of k controls smoothness: small k is sensitive to noise, while large k averages over broader neighborhoods and can blur local patterns.

## When to use it

k-NN can serve as a transparent conceptual baseline when similar patients are expected to have similar outcomes, for example estimating length of stay from a small, consistently measured set of admission features. It can also support exploratory similarity searches, provided similarity is not presented as a clinical match without validation.

## Assumptions and limitations

- Features must be on comparable scales or the largest numeric units dominate distance. Standardization parameters must be learned in each training fold.
- The method suffers in high dimensions: observations become far apart and “nearest” may not mean clinically similar. Irrelevant variables and correlated measurements distort neighborhoods.
- Missing data and mixed variable types require explicit handling. Imputation and transformations must not use held-out outcomes or population information unavailable at prediction time.
- Class imbalance affects majority votes; class weighting and probability interpretation require evaluation. Neighbor fractions are not automatically calibrated risks.
- k-NN does not naturally extrapolate beyond the observed data and can be slow at prediction time for large datasets.

## Worked example

To classify a new patient as likely or unlikely to have a 30-day readmission, suppose the five nearest training patients (after scaling age, comorbidity score, and prior admissions) include three readmissions and two non-readmissions. Unweighted 5-NN predicts the readmission class and gives a simple neighbor proportion of 3/5 = 0.60. With inverse-distance weights of 0.40, 0.25, 0.15, 0.12, and 0.08, where the first three neighbors had readmission, the weighted score is 0.40 + 0.25 + 0.15 = 0.80. That change illustrates how weighting affects output; neither score is a calibrated 60% or 80% risk without evaluation. Select k and metric within cross-validation, then assess calibration and external performance.

## Interpretation and common pitfalls

- “Nearest” is determined by chosen variables, scales, and metric. It is not an intrinsic statement that two patients are clinically equivalent.
- Tune k, distance, and weighting only inside development data. Report a simple baseline and uncertainty.
- Preserve patient-level separation in repeated-measure data and time-aware separation for future prediction.
- Inspect whether one feature or missingness pattern dominates distances. Conduct sensitivity analyses with clinically defensible feature sets.
- Do not infer treatment effects from neighboring patients’ outcomes; treatment selection may differ for important reasons.

## References and further reading

- Cover TM, Hart PE. Nearest neighbor pattern classification. *IEEE Transactions on Information Theory*. 1967;13:21–27. [doi:10.1109/TIT.1967.1053964](https://doi.org/10.1109/TIT.1967.1053964)
- Hastie T, Tibshirani R, Friedman J. *The Elements of Statistical Learning*. 2nd ed. Springer; 2009. [doi:10.1007/978-0-387-84858-7](https://doi.org/10.1007/978-0-387-84858-7)
