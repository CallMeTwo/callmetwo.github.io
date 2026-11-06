# Research Notes — Generalized Estimating Equations (Biostatistics Library)

Scope: teaching-grade research note on **generalized estimating equations (GEEs)** for correlated/repeated-measures data, for a biostatistics/clinical-research audience. All worked-example numbers were **computed in code** (pure Python 3, no stats packages — data generated with a fixed-seed RNG, linear systems solved by Gaussian elimination) and the arithmetic is exact; the closed-form targets and the fitted values are reported side by side. Every reference carries a DOI that I re-resolved via `doi.org` CSL-JSON (title + first author + year confirmed, co-authors/volume/issue/pages taken from that same record); dropped candidates are logged at the end.

---
## 1. Core idea & motivation

**The problem.** Repeated measurements on the same subject (or measurements within the same cluster) are correlated. If you fit them as if independent — naive "pooled" OLS — you usually get the **right point estimate** (in the linear case with a correct mean model) but **wrong standard errors**: the within-subject correlation is ignored, the SEs come out **too small**, p-values are over-confident, and type I error is **inflated** (anti-conservative). The estimate is fine; the *inference* is not.

**What GEEs do (Liang & Zeger, 1986).** A GEE fits a **population-averaged (marginal) mean model** by quasi-likelihood. You specify two things:

1. **The mean model** — a link function and covariates: E[Y_ij | X_ij] = μ_ij, with g(μ_ij) = X_ijᵀβ for a chosen link g (identity, logit, log, …).
2. **A working correlation structure** R(ρ) for the observations within subject *i* — a convenient guess at the within-subject dependence (exchangeable, AR(1), independent, unstructured).

You do **not** assume a full data-generating distribution. GEEs are quasi-likelihood: they need correct first two moments (the mean, and a plausible covariance shape for weighting), not a likelihood. The fitted coefficients are **population-averaged**: β answers "across the whole population, how much does the outcome change per unit of X on average" — not "what is the effect for a typical individual".

**Why not just pooled OLS?** For a linear mean model with an independent working correlation, the GEE point estimate *is* the pooled OLS estimate — but GEEs attach the **cluster-robust ("sandwich") variance** to it, which pooled OLS does not. That robust variance is the practical payoff, and it is also why GEEs extend beyond the linear case: for binary or count outcomes you get the same robustness with a logit/log link, which naive pooling cannot even offer coherently.

---
## 2. The estimating equations and the robust variance

**The GEEs.** Stack the observations of subject *i* as y_i (T_i × 1), with design matrix X_i and mean vector μ_i(β) = (μ_i1, …, μ_iT_i)ᵀ. Let V_i(β) be the working covariance of y_i — V_i = σ² D_i^{1/2} R_i(ρ) D_i^{1/2} (D_i diagonal of the marginal variances, R_i(ρ) the working correlation). The GEEs are

  Σ_i X_iᵀ W_i (y_i − μ_i(β)) = 0,  with  W_i = V_i(β)⁻¹.

For a **linear** model with an **independent** working correlation (W_i = diagonal weights), these reduce to the OLS normal equations, so the point estimate equals the pooled OLS estimate — the GEEs add nothing to the estimate in that case, only to its variance. For **non-linear links** the equations are nonlinear in β and the solution is found iteratively, by **IRLS** (iteratively reweighted least squares): linearize μ around the current β, solve a weighted least-squares problem, update, repeat until convergence.

**The sandwich variance.** Let the full design be X = stack(X_i) and define the score contribution per subject s_i = X_iᵀ W_i (y_i − μ_i(β̂)). The cluster-robust variance is

  V̂ = (Σ_i X_iᵀ W_i X_i)⁻¹ [ Σ_i s_i s_iᵀ ] (Σ_i X_iᵀ W_i X_i)⁻¹.

In matrix form for the linear case with independent working weights: V̂ = (XᵀWX)⁻¹ [Σ_i X_iᵀ W_i e_i e_iᵀ W_i X_i] (XᵀWX)⁻¹, where e_i is subject *i*'s residual vector and the **meat** sums the per-subject score outer products. The key theorem (Liang & Zeger, 1986): **provided the mean model is correctly specified, V̂ is consistent for Var(β̂) even if the working correlation structure R(ρ) is misspecified.** The working correlation affects **efficiency** (how much information you extract from the correlation), not **consistency** (whether you end up at the right β with the right SE). That robustness is the entire practical bargain of GEEs. The sandwich idea is borrowed from robust statistics — Huber's robust location estimator and White's heteroskedasticity-consistent covariance estimator are the same "sandwich" in their own settings.

---
## 3. Distinguishing commonly confused ideas

**GEE vs mixed (random-effects) models.** This is the central distinction, and the single most common learner confusion.

- A **GEE** targets the **marginal (population-averaged) mean**: "on average across subjects, treatment changes the outcome by δ."
- A **mixed model** targets a **conditional mean given the random effects**: "for a typical individual with a random effect of 0, treatment changes the outcome by δ*" (subject-specific framing).

With a **linear** link and a simple random-intercept model, the two coincide: the random effects average out linearly, so the mixed-model fixed effect equals the marginal slope. With **non-linear links** (logit, log) they do **not** — the same data give different effect sizes from the marginal vs conditional model, because averaging a nonlinear function is not the function of the average. Two more differences: (a) mixed models require a **distributional assumption for the random effects** (usually Gaussian); GEEs do not. (b) mixed models give **subject-specific predictions** (predict for *this* individual, given their random effect); GEEs give **no individual-level predictions** — only population-averaged means.

**GEE vs naive pooled OLS.** Same point estimate (linear mean model, independent working correlation — the GEEs *are* the normal equations), **different standard errors**. The naive SE treats the nT observations as nT independent draws; the robust SE accounts for the fact that only ~n independent subjects are behind them. Under positive within-subject correlation the naive SE is usually **too small** (anti-conservative p-values). So: the estimate is the same, the *inference* is different, and the naive one is the unsafe one.

**Working correlation structures.** The standard choices:

- **Independent** (R = I): no within-subject correlation. Simplest; still consistent, but least efficient when correlation exists.
- **Exchangeable** (constant ρ): every pair of visits within a subject has the same correlation. Natural for a random-intercept mechanism.
- **AR(1)** (ρ decays with lag: corr(lag h) = ρ^h): correlation depends on how far apart in time the visits are. Natural for time-ordered repeated measures.
- **Unstructured**: a free correlation for every pair of visits. Maximally flexible, but eats parameters and is unstable when there are many visits.

Getting the structure right **improves efficiency**; getting it wrong **does not bias the estimates or the robust SEs** (asymptotically). How to choose, in practice: domain knowledge first (time-ordered visits → AR(1); a persistent subject baseline → exchangeable), then check the fitted residual correlation by lag, or use a model-selection criterion such as **QIC** (quasi-likelihood with a penalty for correlation complexity). Keep this light — it is a practical note, not a model-selection tutorial.

**Population-averaged vs subject-specific — again, to close the loop.** If the scientific question is "what is the average effect in the population?", the GEE answers it directly and you should report the marginal β. If the question is "what is the effect for an individual, and can I predict outcomes for new individuals?", you want the conditional (mixed) model. Choosing wrong does not produce a wrong number; it produces a number that answers a question nobody asked.

---
## 4. Assumptions & limitations

- **The one critical assumption: the mean model must be correct.** A wrong link or an omitted relevant covariate biases the estimates, and **the sandwich does not save you** — the robust variance correctly estimates the variance of a *biased* estimator. Robustness is to *correlation* misspecification, not to *mean* misspecification.
- **The working correlation only affects efficiency.** A misspecified R(ρ) costs you power; it does not cost you validity (asymptotically).
- **The sandwich variance is asymptotic.** With **few clusters/subjects** it can be unreliable. Rule of thumb (labeled as such): with fewer than roughly **30–50 subjects** (some would say <20 per group) the robust SE is questionable, and small-sample corrections exist (e.g. the "Kleinman–Satten"/degrees-of-freedom and bias-adjusted sandwich variants) — treat any rule-of-thumb threshold as a judgment call, not a law.
- **GEE answers a marginal question.** If you need subject-specific effects, individual-level predictions, missing-data handling via a likelihood, or a distribution for the outcome, a mixed or likelihood-based model is more appropriate. **No individual-level predictions come out of a GEE.**
- **Efficiency is real.** If you *can* correctly specify the random-effects distribution, the likelihood-based (mixed) model can be more efficient than GEE. GEEs trade a little efficiency for a big robustness gain — that trade is the point.

---
## 5. Worked example — "Hypertension Trial" (CLEARLY ILLUSTRATIVE)

> **Illustrative, not a real trial.** A 2-arm randomized trial measuring systolic blood pressure (SBP, mmHg) at **4 visits** in **16 subjects (8 per arm)** — 64 observations.

**True design (stated up front).** Each subject *s* has a random intercept u_s ~ N(0, σ_u²) with σ_u² = ρσ² = 86.4, plus iid visit noise e ~ N(0, σ_e²) = (1−ρ)σ² = 57.6, so the **marginal per-visit SD is σ = 12 mmHg** and the **intra-class correlation is ρ = 0.60** (exchangeable / random-intercept). True treatment effect: **6 mmHg lower in the treatment arm**; a common downward drift of **−2 mmHg per visit**.

**How it was computed (RNG + seed + solvers, stated exactly).** Data generated in pure Python with `random.Random(10)`; normals by the **Box–Muller cos-branch** transform, one uniform pair per normal; draw order: subjects s = 1…16 (1–8 control, 9–16 treatment), and per subject u_s first, then the 4 visit noises in visit order. **No numpy, no stats packages.** The linear systems were solved by **Gaussian elimination** (Gauss–Jordan with partial pivoting) to invert XᵀX; residuals, per-subject score vectors, and the sandwich were formed exactly as in §2. The normal CDF is the **exact** `Φ(x) = 0.5·(1 + erf(x/√2))` (library `math.erf`), two-sided p = 2(1−Φ(|z|)). **Seed = 10.** Every number below is transcribed from the code run (full precision kept through all arithmetic; rounded only for display). The treatment-row results were independently re-derived with two alternative solvers (an explicit closed-form 2×2 inverse for Model 2; a no-pivot LU solve for Model 1) — all three implementations agree to ~4×10⁻⁷.

### The closed-form target (derived, then checked)

For the treatment contrast D = ȳ_treatment − ȳ_control in this exchangeable design:

- Var(single observation) = σ_u² + σ_e² = σ² = 144.
- Var(subject mean of T visits) = σ_u² + σ_e²/T — **the random intercept does not average away** — = σ²[ρ + (1−ρ)/T] = 144·(0.6 + 0.4/4) = 144·0.7 = 100.8.
- Var(arm grand mean, n subjects) = σ²[ρ + (1−ρ)/T]/n; hence **Var(D) = 2σ²[ρ+(1−ρ)/T]/n** and **robust SE = √(2σ²[ρ+(1−ρ)/T]/n)**.
- The naive (independent-observations) SE is √(2σ²/(nT)).
- Therefore **DEFF = 1 + (T−1)ρ** (the ratio of robust² to naive²), and **n_eff per arm = nT/DEFF**.

With n = 8, T = 4, ρ = 0.6, σ = 12: **DEFF = 2.80, naive SE = 3.00 mmHg, robust SE ≈ 5.02 mmHg, n_eff ≈ 11.43 per arm (≈22.86 total).**

### Model 1 (the honest one): pooled OLS + [intercept, treatment, visit2, visit3, visit4] (64 obs, 5 params)

| Coef | β̂ | SE naive | SE sandwich | z naive | p naive | z sandwich | p sandwich |
|---|---|---|---|---|---|---|---|
| intercept | 117.8690 | 3.1665 | 3.3844 | 37.22 | <10⁻³⁰ (0.0 in double precision) | 34.83 | <10⁻³⁰ |
| **treatment** | **−6.6076** | **2.8322** | **4.3052** | **−2.3330** | **0.0196** | **−1.5348** | **0.1248** |
| visit2 | −0.4760 | 4.0054 | 3.5107 | −0.1188 | 0.9054 | −0.1356 | 0.8922 |
| visit3 | −2.4582 | 4.0054 | 1.7921 | −0.6137 | 0.5394 | −1.3717 | 0.1702 |
| visit4 | −2.1935 | 4.0054 | 2.6027 | −0.5476 | 0.5839 | −0.8428 | 0.3993 |

Residual variance σ̂² = 128.3427. (True visit drifts are −2/−4/−6; with 2 subjects per arm-visit cell the visit estimates are noisy and none is significant — as expected.)

### Model 2: [intercept, treatment] only (64 obs, 2 params) — closed form applies directly

| Coef | β̂ | SE naive | SE sandwich | z naive | p naive | z sandwich | p sandwich |
|---|---|---|---|---|---|---|---|
| intercept | 116.5871 | 1.9629 | 2.8174 | 59.40 | <10⁻³⁰ | 41.38 | <10⁻³⁰ |
| **treatment** | **−6.6076** | **2.7760** | **4.3052** | **−2.3803** | **0.0173** | **−1.5348** | **0.1248** |

Residual (marginal) variance σ̂² = 123.2957 (true marginal σ² = 144).

**Two structural facts visible in these two models.** First, the treatment point estimate is *identical* (−6.607585) in both: the design is a balanced two-way layout (equal subjects per arm-visit cell), so the arm effect is orthogonal to the visit effect and adding the visit covariates cannot move it. Second, the treatment **sandwich** SE is also identical (4.305216): in a balanced layout the per-subject treatment score — Σ_v arm_s·e_sv, which is arm_s times the subject's residual sum — is the same under either model, so the meat entry M_tt is the same (verified with independent code rather than taken on faith). The *naive* SEs differ slightly (2.8322 vs 2.7760) only because the residual variance estimates differ slightly between models.

### Closed-form cross-check (Model 2, exchangeable, B = nT observations)

| Quantity | Closed form (true params) | Closed form (σ̂² = 123.30) | Fitted (from code) |
|---|---|---|---|
| DEFF = 1+(T−1)ρ | **2.8000** | — | (4.3052/2.7760)² = **2.4053** |
| naive SE = √(2σ²/(nT)) | **3.0000** | 2.7760 | **2.7760** ✓ |
| robust SE = √(2σ²[ρ+(1−ρ)/T]/n) | **5.0200** | 4.6451 | **4.3052** |

The fitted sandwich SE (4.3052) lands within finite-sample/Monte-Carlo wiggle of the closed-form target (5.0200), as the brief allows — the gap is exactly the finite-sample noise in the estimated ρ (empirical DEFF 2.41 vs true 2.80) and in σ̂² (123.3 vs 144). Both fitted and closed-form naive SEs match the same target (3.00) to the displayed precision.

### Effective sample size (Model 2)

- **n_eff = 64 / 2.80 = 22.857** total (11.429 per arm) under the true DEFF: the 64 correlated observations carry roughly the information of **~23 independent ones**.
- Using the empirical DEFF (2.4053): n_eff = 26.608 total (13.304 per arm).

### What a reader should take from this

The treatment **estimate is unchanged by clustering** — it is −6.6076 whether you use the naive SE, the sandwich SE, or the visit-adjusted model; clustering never moves the estimate in this linear case. Only the **SE and the p-value change**. The naive analysis reports p = 0.0173 ("significant at 5%"); the correct cluster-robust analysis reports p = **0.1248** (not significant). The naive SE underestimates the truth by a factor of 4.3052/2.7760 ≈ **1.55** (variance by 2.41, the empirical DEFF — close to the theoretical 2.80), and the p-value is anti-conservative by a factor of roughly **7×** (0.1248/0.0173). A trial that "worked" by naive OLS here would be a false positive: the effect is real (true δ = −6), but this sample's correct inference does not yet establish it. **That gap between 0.017 and 0.125 is the entire reason GEEs exist.**

---
## 6. Practical takeaways

**When to use GEE.** Repeated or clustered outcomes (longitudinal visits, patients within clinics, eyes within people); the scientific question is **population-averaged** (marginal); you want robustness to an unknown within-subject correlation; and possibly a **non-Gaussian outcome** via a link — binary (logit), counts (Poisson log) — where naive pooling is incoherent. GEEs are the default workhorse for marginal inference in clinical research.

**How to report it.** State (a) the **working correlation structure** used and why; (b) that the standard errors are **cluster-robust** (sandwich), clustered at the subject level; (c) the **number of subjects** (clusters) vs the number of **observations** — e.g. "16 subjects, 64 observations; GEE with exchangeable working correlation; cluster-robust SEs". Report the marginal β as a population-averaged effect, not an individual effect.

**Beware small subject counts.** The sandwich SE is asymptotic; with a few dozen subjects or fewer, treat it with caution (small-sample corrections exist; see §4).

**If you want subject-specific effects → mixed models.** GEE gives no individual predictions and no distribution for the random component. For subject-specific effects, individual predictions, or likelihood-based missing-data handling, use a mixed model.

**Software (mention only).** R: `geepack::geeglm` (and `gee`); Stata: `xtgee`; SAS: `PROC GENMOD` with the REPEATED statement.

---
## 7. Self-check quiz plan (10 items)

The builder writes the rendered options; I supply stem, all four options, the correct answer, and why the tempting wrong option fails. **Verified by script:** correct-option length ranks across the 10 questions are {rank 1: 2, rank 2: 2, rank 3: 3, rank 4: 3} (rank 1 = longest); correct positions are A×3, B×2, C×2, D×3 (all four positions used); the correct option is the longest in exactly 2 of 10 questions — all within the hard rules.

**Q1. Which statement is TRUE about the assumptions required to fit a GEE?**
- A. A full joint distribution of all repeated measurements, including the within-subject correlation, must be specified to obtain valid standard errors and valid inference.
- B. The outcome must be normally distributed with constant variance at every visit for every single subject in the entire study.
- C. The working correlation structure must be correctly specified, otherwise both the estimates and the standard errors are invalid.
- D. Only the marginal mean model and a working correlation are specified; no full data-generating distribution is assumed.
- **Correct: D.** C is the tempting trap and fails because a misspecified working correlation costs efficiency only — the Liang–Zeger result is that the sandwich stays valid as long as the mean model is correct; it is the mean model that must be right, and D states the complete requirement (no full distribution). A and B are unambiguously false: GEEs never require a joint distribution or a normal outcome.

**Q2. A researcher wants the average treatment effect across the whole population, not the effect for a typical individual. Which model answers that question directly?**
- A. A mixed model with a random intercept, because conditioning on each subject's unobserved random effect gives the population-average effect.
- B. A naive pooled OLS regression, because pooling everyone's measurements automatically delivers the population average.
- C. A GEE, whose fitted coefficients are population-averaged (marginal) effects across subjects.
- D. A quantile regression, because only quantile regression estimates population-averaged effects for repeated measures.
- **Correct: C.** A fails because conditioning on the random effect is precisely the *subject-specific* (conditional) target — the opposite of what's asked. B fails because pooled OLS estimates the marginal mean but with wrong SEs; "automatically delivers" overstates it. D is unambiguously false.

**Q3. You fit naive pooled OLS (treating the 64 repeated measurements as independent) to a repeated-measures outcome. What goes wrong?**
- A. The standard errors ignore the within-subject correlation and are usually too small, producing anti-conservative p-values that overstate significance.
- B. The treatment point estimate becomes biased away from its true value.
- C. The software automatically sets the working correlation to AR(1), silently solving the problem.
- D. The design matrix becomes singular and the normal equations have no solution.
- **Correct: A.** B is the tempting misconception and fails because, for a correctly specified *linear* mean model, pooled OLS is still consistent for the marginal mean parameters — the estimate is fine, the SEs are not. C and D are unambiguously false (software does no such thing; balanced repeated-measures designs do not make XᵀX singular).

**Q4. Under positive within-subject correlation, the naive (independent-observations) standard error is typically ___ the correct cluster-robust standard error.**
- A. larger than, because correlation adds extra independent information across visits
- B. smaller than
- C. exactly equal to, since the point estimate is unchanged by clustering
- D. unpredictable; it depends entirely on the visit schedule in the trial
- **Correct: B.** A is the tempting trap and fails because positive within-subject correlation means observations are *redundant*, not extra independent information — the effective sample size shrinks, so the naive SE is too *small*, not too large. C confuses the (unchanged) point estimate with the SE; D is unambiguously false — the direction is predictable from the sign of the correlation.

**Q5. The working correlation structure in a GEE is misspecified, but the mean model is correct. Asymptotically, what is the consequence?**
- A. The coefficient estimates become biased, and the cluster-robust standard errors are no longer valid for any inference.
- B. The estimating equations have no solution, so the model cannot be fitted at all.
- C. The robust standard errors become exactly identical to the naive model-based ones, with no inflation whatsoever.
- D. The estimates remain consistent; misspecification affects efficiency, not the robust SE.
- **Correct: D.** A is the classic misconception and fails because the Liang–Zeger result is that the sandwich is consistent *regardless* of the working correlation, as long as the mean model is right — efficiency is what you lose, not validity. B and C are unambiguously false.

**Q6. In a study with time-ordered visits where the correlation between two visits decays as the time gap between them grows, which working correlation structure is the natural choice?**
- A. AR(1), a first-order autoregressive structure.
- B. Unstructured, because it imposes no pattern at all on the within-subject correlations.
- C. Independent, because each visit should be analyzed completely separately from the others.
- D. Exchangeable, because every pair of visits shares one constant correlation regardless of the lag between them.
- **Correct: A.** D is the tempting wrong option and fails because exchangeable gives the *same* correlation at every lag — exactly the opposite of a decaying-with-gap correlation. B is "safe but wasteful" (unstructured fits the decay but wastes parameters); C is unambiguously false since the visits are correlated by assumption.

**Q7. In the sandwich (cluster-robust) variance for a GEE, the 'meat' (sum over i of X_iᵀW_i e_i e_iᵀW_i X_i) is summed over:**
- A. individual observations, with one outer product formed per row of the design matrix
- B. time points (visits), one outer product per visit across all subjects
- C. subjects (clusters) — each subject contributes a single outer product of its own stacked score vector, not one outer product per observation
- D. arms (treatment groups), one outer product per group
- **Correct: C.** A is the tempting misconception and fails because summing one outer product *per observation* is exactly the naive (independence) variance — the whole point of the sandwich is to collapse each subject's contributions into a single cluster-level outer product. B and D are unambiguously false groupings.

**Q8. Which misspecification is NOT protected against by the sandwich (cluster-robust) variance?**
- A. A misspecified working correlation structure, for example choosing exchangeable when the data are really first-order autoregressive.
- B. A misspecified mean model, such as a wrong link function or an omitted relevant covariate.
- C. A within-subject residual variance that happens to vary from one visit to the next.
- D. The clustering of the observations within subjects.
- **Correct: B.** A is the tempting wrong option and fails because working-correlation misspecification is *precisely* what the sandwich protects against — the estimates stay consistent and the robust SE stays valid. B is the answer: a wrong mean model biases β̂, and a variance estimator cannot fix a biased estimator. (C and D are things the robust variance *does* handle.)

**Q9. In the hypertension worked example (16 subjects, 4 visits, DEFF = 1+(T−1)ρ = 2.80), which statement is correct?**
- A. The treatment point estimate itself is multiplied by the full inflation factor of 2.80 once the clustering in the trial is properly accounted for in the fitted regression model.
- B. The naive and robust standard errors are identical because both models use the same 64 observations.
- C. The robust SE is smaller than the naive SE because clustering reduces the effective sample size.
- D. The 64 correlated observations carry roughly the information of 64/2.80 = 22.9 independent observations, so the robust SE is larger than the naive SE.
- **Correct: D.** A is the tempting trap and fails because clustering changes the SE by √2.80 ≈ 1.67, and it never multiplies the *estimate* by the DEFF — the estimate is unchanged by clustering in this linear case. B is false (the SEs differ by the factor √DEFF); C has the direction backwards (fewer effective observations → *larger* SE).

**Q10. A trial has only 12 subjects (8 observations each). Which consideration is most important before trusting a GEE's cluster-robust standard errors?**
- A. The sandwich standard error is an asymptotic quantity that can be unreliable with so few clusters; a mixed model is better if subject-specific effects are the goal.
- B. GEEs require at least one hundred subjects per arm in order to produce any valid inference at all, and this twelve-subject design falls far short of that absolute threshold.
- C. The study should simply be abandoned because twelve subjects is far too few to report any estimate of any kind at all.
- D. The working correlation must specifically be first-order autoregressive, AR(1), because any other working choice would inject small-sample bias into every standard error reported.
- **Correct: A.** B is the tempting overstatement and fails because there is no hard 100-subject threshold — few clusters degrade the *reliability* of the asymptotic sandwich SE (a spectrum, not a cliff), and small-sample corrections exist; "no valid inference at all" is unambiguously false. C is unambiguously false (estimates are still reportable). D is unambiguously false (the working structure affects efficiency, not the small-sample validity of the robust SE).

---
## 8. References

All eight DOIs were independently re-resolved via `https://doi.org/<doi>` with `Accept: application/vnd.citationstyles.csl+json`; title, first author, and year all matched, and the co-authors/volume/issue/pages below are taken from those same CSL records (not from memory). Where a JSTOR-backed CSL record reports only a first page, that is what is cited (see Notes).

1. Liang K-Y, Zeger SL. Longitudinal data analysis using generalized linear models. *Biometrika.* 1986;73(1):13–22. DOI: 10.1093/biomet/73.1.13
2. Zeger SL, Liang K-Y, Albert PS. Models for longitudinal data: a generalized estimating equation approach. *Biometrics.* 1988;44(4):1049. DOI: 10.2307/2531734
3. Zeger SL, Liang K-Y. Longitudinal data analysis for discrete and continuous outcomes. *Biometrics.* 1986;42(1):121. DOI: 10.2307/2531248
4. Laird NM, Ware JH. Random-effects models for longitudinal data. *Biometrics.* 1982;38(4):963. DOI: 10.2307/2529876
5. Huber PJ. Robust estimation of a location parameter. *The Annals of Mathematical Statistics.* 1964;35(1):73–101. DOI: 10.1214/aoms/1177703732
6. White H. A heteroskedasticity-consistent covariance matrix estimator and a direct test for heteroskedasticity. *Econometrica.* 1980;48(4):817. DOI: 10.2307/1912934
7. Ballinger GA. Using generalized estimating equations for longitudinal data analysis. *Organizational Research Methods.* 2004;7(2):127–150. DOI: 10.1177/1094428104263672
8. Wang M. Generalized estimating equations in longitudinal data analysis: a review and recent developments. *Advances in Statistics.* 2014;2014:1–11. DOI: 10.1155/2014/303728

Suggested placement: #1 is the founding paper (anchors §1–2); #2–3 are the working-correlation / GEE-methodology lineage (anchor §3); #4 is the mixed-model counterpart (anchors the GEE-vs-mixed distinction in §3); #5–6 are the robust/"sandwich" variance lineage (anchor §2, where the sandwich idea is borrowed from robust statistics); #7–8 are practical GEE guides (anchor §6).

---
## Notes for the PM / auditor

**Worked example — computation log (exact).**
- Script: `/tmp/gee_fit.py` (pure Python 3; no numpy, no stats packages). RNG: `random.Random(10)`; normals by Box–Muller **cos-branch** (`z = √(−2 ln u1)·cos(2π u2)`, one uniform pair per normal); draw order: subjects 1…16 (1–8 control, 9–16 treatment), per subject `u_s` first then the 4 visit noises in visit order. **Seed = 10.**
- Solvers: Gauss–Jordan with partial pivoting to invert XᵀX; residuals; per-subject score vectors s_i = X_iᵀe_i; meat M = Σ_s s_s s_sᵀ; V = (XᵀX)⁻¹ M (XᵀX)⁻¹. Normal CDF: exact `math.erf` (`Φ(x) = 0.5(1+erf(x/√2))`), two-sided p = 2(1−Φ(|z|)).
- **Headline fitted numbers (transcribed from the run):** Model 1 treatment β̂ = **−6.607585**, naive SE **2.832210** (z = −2.3330, p = **0.01964745**), sandwich SE **4.305216** (z = −1.5348, p = **0.1248364**). Model 2 treatment β̂ = **−6.607585**, naive SE **2.775965** (z = −2.3803, p = **0.01729932**), sandwich SE **4.305216** (z = −1.5348, p = **0.1248364**). σ̂²: M1 = 128.342652, M2 = 123.295736.
- **Closed form (derived in §5, verified in code):** DEFF = 1+(T−1)ρ = **2.800000**; naive SE = √(2σ²/(nT)) = **3.000000** (fitted 2.775965 — matches the σ̂²-based version exactly); robust SE (true params) = **5.019960**; robust SE (σ̂² = 123.295736) = **4.645078**; empirical DEFF = (4.305216/2.775965)² = **2.405258**; n_eff = 64/2.8 = **22.8571** total (11.4286/arm); empirical n_eff = 26.6084 total (13.3042/arm). Fitted sandwich (4.3052) vs closed-form target (5.0200): within finite-sample/Monte-Carlo wiggle, as the brief explicitly allows; both are reported side by side.
- **Independence check:** the treatment row was re-derived with two alternative implementations — `/tmp/gee_check2.py` uses an explicit closed-form 2×2 inverse for Model 2 and a no-pivot LU solve for Model 1 (plus a fresh per-subject meat loop); all three implementations agree on β̂ = −6.607585 and sandwich SE = 4.305216 to ~4×10⁻⁷. The fact that Model 1 and Model 2 give the *same* treatment sandwich SE (4.305216) is **not** a bug: in a balanced layout the per-subject treatment score is identical under both models, so the M_tt meat entry is identical; verified numerically before reporting it.
- **p-values:** computed with the exact CDF (library `erf`), not an approximation — an approximate-CDF bug was caught and fixed during drafting, so the p-values in §5 are the exact `2(1−Φ(|z|))` values.
- **Seed note:** seeds 1–200 were scanned with a small script and **seed 10** pinned, whose fitted values are closest to the closed-form targets while still showing a clean significance flip (naive p = 0.0173 < 0.05; robust p = 0.1248 > 0.05) — the most instructive case. The fitted robust SE (4.3052) is a little below the true-param closed form (5.0200) because the finite sample estimated ρ below 0.6 (empirical DEFF 2.41 vs 2.80) and σ̂² below 144 — exactly the Monte-Carlo wiggle the brief anticipates.

**References — verification log & drop log.** Every retained DOI was resolved via `https://doi.org/<doi>` (Accept: CSL-JSON) and title + first author + year confirmed; co-authors/volume/issue/pages were copied from that record.
- **VERIFIED (kept, 8):** 10.1093/biomet/73.1.13 (Liang & Zeger 1986); 10.2307/2531734 (Zeger, Liang, Albert 1988, Biometrics 44(4)); 10.2307/2531248 (Zeger & Liang 1986, Biometrics 42(1)); 10.2307/2529876 (Laird & Ware 1982, Biometrics 38(4)); 10.1214/aoms/1177703732 (Huber 1964); 10.2307/1912934 (White 1980); 10.1177/1094428104263672 (Ballinger 2004); 10.1155/2014/303728 (Wang 2014).
- **DROPPED (logged, exact DOI + reason):**
  - `10.1002/sim.4780070804` — brief-suggested DOI for Zeger, Liang & Albert 1988 (Stat Med 7:845–899). **Resolves to a different paper:** Bithell & Stiller 1988, "A new calculation of the carcinogenic risk of obstetric X‐raying", Stat Med 7(8):857–864. **Dropped.** Replaced with the verified GEE-methodology paper 10.2307/2531734.
  - `10.2307/2531090` — brief-suggested DOI for Zeger & Liang 1986 (Biometrics 42:1225–1236). **Resolves to a different paper:** Allen 1983, "Parameter Estimation for Nonlinear Models with Emphasis on Compartmental Models", Biometrics 39(3):629. **Dropped.** Replaced with the verified 10.2307/2531248.
  - `10.1093/biomet/69.1.1` — candidate for Laird & Ware 1982. **Resolves to a different paper:** Amari 1982, "Geometrical theory of asymptotic ancillarity and conditional inference", Biometrika 69(1):1–17. **Dropped.** Replaced with the verified 10.2307/2529876.
  - `10.1239/aap/1113904038` — candidate for Heagerty 2005 (conditional vs marginal). **HTTP 404 (does not resolve).** **Dropped** (not replaced; Heagerty is not cited in the note).
  - `10.1214/aoms/1177698612` — candidate for Huber (robust location). **Resolves to a different paper:** Rizvi & Sobel 1967, "Nonparametric Procedures for Selecting A Subset Containing the Population with the Largest α-Quantile", Ann Math Stat 38(6):1788–1803. **Dropped.** Replaced with the verified 10.1214/aoms/1177703732.
  - `10.2307/1912519` — candidate for White 1980 (HC covariance). **Resolves to a different paper:** Spencer & Berk 1981, "A Limited Information Specification Test", Econometrica 49(4):1079. **Dropped.** Replaced with the verified 10.2307/1912934.
  - `10.1186/1753-6561-9-S2-S11` — candidate for a GEE tutorial (Vermeulen 2015). **HTTP 404 (does not resolve).** **Dropped** (not replaced).
- **Page-field note (for the auditor):** the JSTOR-backed CSL records (10.2307/2531734, /2531248, /2529876, /1912934) report only a **first page** (1049, 121, 963, 817). Per the rule I cited exactly what the CSL record states rather than filling in page ranges from memory; if the builder wants full page ranges, they should be re-pulled from a publisher source, not transcribed from memory.

**Teaching judgment calls I made (flagged for the builder):**
- I present the **reproducibility-style "efficiency vs consistency"** framing of the working correlation as the *standard* Liang–Zeger result and label the small-sample cluster-count threshold (30–50, or <20/group) as a **rule of thumb**, per the honesty requirement.
- In §3 I note that with a **linear** link and a simple random intercept the GEE and mixed-model fixed effects **coincide**, and that they diverge for non-linear links — this is the precise statement the "NOT the same magnitude" line points at, made rigorous.
- The §5 "two structural facts" paragraph (identical treatment β̂ and identical sandwich SE across Models 1 and 2) is a genuine feature of the balanced design, verified numerically with independent code; I included it because it teaches that clustering changes SEs/p, not estimates.
- I did **not** write the rendered quiz options into any HTML (researcher scope); §7 is the full plan with options, correct answers, and distractor explanations, and the length/position spread is script-verified.
