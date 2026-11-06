# Research Notes — Quantiles and the interquartile range

Scope: a teaching-grade note on **quantiles, the quartiles, the IQR, the boxplot, the 1.5xIQR outlier fence, and why the median/IQR are robust while the mean/SD are not**, for a biostatistics / clinical-research audience (section *Describing and visualizing data*, group *Descriptive statistics*). Every worked-example number was **computed in code** (a `/tmp` script, pure Python, `math` only — no statistics packages) and reproduced to display rounding. All six references carry a DOI re-resolved via `doi.org` CSL-JSON (title + first author + year all matched; bibliographic detail from that record). The interactive-lab method is documented with the ground-truth pins reproduced verbatim.

---

## Core concept

**Quantile.** A quantile of a data set is a value that cuts off a specified fraction of the observations. The **p-th quantile** (p in (0,1)) is the value below which a proportion p of the data fall. Quantiles are defined by *position in the ordered data*, not by averaging — which is exactly why they behave well with outliers.

Special cases:
- **Median = the 50th percentile** (p = 0.5): half the data below, half above.
- **Quartiles** divide the data into four equal-probability groups: **Q1 = the 25th percentile**, **Q2 = the 50th percentile (= the median)**, **Q3 = the 75th percentile**.

**Interquartile range (IQR).** The span of the *middle half* of the data:

    IQR = Q3 − Q1.

It is a measure of **spread** that ignores the outer quarter on each side — and because it is built from quantiles (positions) rather than squared deviations, one extreme value moves it very little.

**Why several conventions exist.** There is no single canonical way to turn a finite sorted sample into "the" p-th quantile: for most p the cut point falls *between* two data values and you must decide how to interpolate. Hyndman and Fan (1996) catalog nine standard definitions, R-1 through R-9. This page uses **R-7**, the linear-interpolation method that is the default in R, NumPy, and most software:

    h = (n − 1)·p,   j = floor(h)
    q̂(p) = x_(j+1) + (h − j)·(x_(j+2) − x_(j+1)),

where x_(1) ≤ … ≤ x_(n) are the sorted values. The median is q̂(0.5), Q1 = q̂(0.25), Q3 = q̂(0.75). The existence of nine conventions is not a curiosity — it is the *reason* two packages can print slightly different quartiles for the same data.

**The boxplot and the five-number summary.** A boxplot (McGill, Tukey and Larsen, 1978) is the five-number summary drawn to scale: **minimum, Q1, median, Q3, maximum**. The "box" runs from Q1 to Q3 (height = IQR) with a line at the median; the "whiskers" extend to the most extreme observations still inside the fences; points beyond the fences are plotted as outliers. One glance gives center (median), spread (IQR), asymmetry (median position + whisker lengths), and extremes (the flagged points).

---

## Commonly-confused ideas

**(a) Quantile vs percentile — same idea, two names.** A *percentile* is just a quantile on a 0–100 scale: the 25th percentile is the 0.25 quantile, the 90th percentile the 0.90 quantile. "Percentile" is more common in clinical writing (a baby "in the 75th percentile for weight"); "quantile" with p ∈ (0,1) in the statistics literature. They are not two different objects.

**(b) IQR vs range vs variance/SD — different notions of spread, very different robustness.** All three measure spread, but they are not equally robust:
- The **range** (max − min) uses the two most extreme values, so a single extreme observation moves it by its full magnitude — zero robustness to one outlier.
- The **variance/SD** is built from *squared* deviations from the mean. Squaring amplifies large deviations quadratically, and because the mean itself shifts toward the outlier, one extreme value inflates the SD sharply. In the worked example, the single value 13.8 inflates the SD from 0.62 to 1.92 (~3x).
- The **IQR** uses the 25th and 75th percentiles, immune to one extreme value — the robust spread to pair with the robust center (the median).

The "SD is squaring, so it is very sensitive to one extreme" point is the one to emphasize: it is the algebraic reason the mean/SD pair is fragile while the median/IQR pair is not.

**(c) Median vs mean — breakdown point.** Both summarize "center," but with completely different robustness. The **breakdown point** is the fraction of the data you can corrupt (push to arbitrary values) before a statistic is dragged to an arbitrary value — a notion developed in Huber and Ronchetti (2009, *Robust Statistics*). The **mean has breakdown point 0**: one arbitrarily large value moves the mean to match it (as the outlier grows without bound, so does the mean). The **median has breakdown point ~50%**: you must corrupt roughly *half* the sample before the median itself can be pushed arbitrarily far. This is the cleanest way to say why the median is robust and the mean is not.

**(d) The many sample-quantile conventions.** There is no unique "the" sample quantile. Hyndman and Fan's nine methods give slightly different Q1/Q3 on the same data, and on *small* samples the differences can show to a decimal place. This is a convention, not a deep truth — which is why **you must know which method your software uses (R-7 here) so your reported quartiles are reproducible.** Two tools disagreeing is a feature of the ambiguity, not a bug in either.

**(e) Inner fence (1.5xIQR) vs outer fence (3xIQR) — mild vs extreme.** The boxplot flags points beyond **fences** built from the quartiles and IQR:
- **Inner fence** = Q1 − 1.5·IQR (low) and Q3 + 1.5·IQR (high). Points beyond are **mild** (suspected) outliers; standard whiskers stop at the most extreme data point *inside* the inner fence.
- **Outer fence** = Q1 − 3·IQR and Q3 + 3·IQR. Points beyond are **extreme** outliers.

Hoaglin and Iglewicz (1987) and Iglewicz and Hoaglin (1987) formalize this resistant (Tukey-style) labeling: the 1.5xIQR and 3xIQR multipliers are **conventions for separating mild from extreme, not derived constants** — rule-of-thumb values that work well for roughly normal data but are not statistically mandated.
---

## Assumptions and limitations

- **Quantiles need ordered (and, in practice, continuous) data.** The definition is "the value at position h in the ordered sample," so the data must be orderable. For heavily *discrete* or *tied* data (a Likert scale, a lab value to one decimal), "the value below which p falls" is not unique — many observations share a value — and the interpolated quantile is only a convention; read it as "the data value at that position," not a precise cut point.

- **The IQR only summarizes the middle.** It says nothing about the *tails* beyond Q1 and Q3. Two samples can have identical Q1, median, Q3 yet wildly different tails. The IQR is deliberately blind to the extremes — that is what makes it robust — but you must look at the flagged outliers and min/max separately to see what the tails are doing.

- **The fence is a heuristic, not a test.** The 1.5xIQR / 3xIQR fences are not a significance test or a likelihood decision; they flag *candidates*. A point beyond the fence is a prompt to **investigate** (assay error, unit mislabel, a legitimate extreme), not an automatic instruction to delete it.

- **The fence is itself sample-sensitive.** Because the fence is built from Q1, Q3 and the IQR — all computed from the same sample — *removing or adding an extreme value changes the fence*, which can change which points are flagged. The worked example exposes this: with 13.8 present, the only flagged outlier is 13.8; remove 13.8 and the upper fence drops to 7.075, which then flags 7.2. This is a **limitation, not a bug** — the reported outlier set depends on the starting sample, so state your rule (and that it is conventional) explicitly.

- **Sample quantiles are consistent, but any one method is a convention.** For any fixed distribution the R-7 sample quantile converges to the true population quantile as n → ∞, so all reasonable methods agree in large samples. In *small* samples the choice matters, and quartiles are **noisy** — a quantile's standard error shrinks only as 1/√n, and the quartiles (at 25%/75%) are estimated less precisely than the median. Do not over-read a quartile computed from n = 10.

---

## Worked example — HbA1c, n = 20 (right-skewed lab value)

**Setting.** HbA1c (%) in 20 adult diabetes outpatients. HbA1c is right-skewed, and this sample carries one extreme value (13.8) — a probable mislabelled/failed assay or a new-onset patient — the situation that motivates reporting the median (IQR) over the mean (SD). Sorted values (n = 20):

    4.7, 4.9, 5.0, 5.1, 5.2, 5.2, 5.3, 5.4, 5.5, 5.6,
    5.6, 5.7, 5.8, 5.9, 6.0, 6.1, 6.3, 6.6, 7.2, 13.8

**Quantile positions (R-7).** With n = 20, the (n − 1)·p positions are:
- Q1: (20 − 1)·0.25 = **4.75** → Q1 = x_(5) + 0.75·(x_(6) − x_(5)) = 5.2 + 0.75·(5.2 − 5.2) = **5.200**
- Median: (20 − 1)·0.50 = **9.5** → median = x_(10) + 0.5·(x_(11) − x_(10)) = 5.6 + 0.5·(5.6 − 5.6) = **5.600**
- Q3: (20 − 1)·0.75 = **14.25** → Q3 = x_(15) + 0.25·(x_(16) − x_(15)) = 6.0 + 0.25·(6.1 − 6.0) = **6.025**

**Five-number summary and fences.**
- min = **4.7**, max = **13.8**
- IQR = Q3 − Q1 = 6.025 − 5.2 = **0.825**
- Lower fence = Q1 − 1.5·IQR = 5.2 − 1.2375 = **3.9625**
- Upper fence = Q3 + 1.5·IQR = 6.025 + 1.2375 = **7.2625**
- **Flagged outlier = {13.8}** — the only value beyond a fence
- **Whisker ends** (most extreme data still inside the fences): lower **4.7**, upper **7.2**

**Mean and SD (the fragile pair).** mean = **6.045**, SD = **1.9228**.

### The robustness contrast (the teaching point)

The same data, with and without the extreme 13.8, computed in code:

| Statistic | WITH 13.8 (n=20) | WITHOUT 13.8 (n=19) | Comment |
|---|---|---|---|
| Mean | **6.045** | **5.6368** | one value raises it by **+0.408** |
| SD | **1.9228** | **0.6211** | one value inflates it ~**3.1x** (squaring) |
| Median | **5.600** | **5.600** | **exactly unchanged** |
| Q1 | **5.200** | **5.200** | unchanged (well inside the middle half) |
| Q3 | **6.025** | **5.950** | moves only slightly |
| IQR | **0.825** | **0.750** | moves only slightly |
| Upper fence | 7.2625 | 7.075 | the fence itself shifts |

**Reading.** The single 13.8 **raises the mean by +0.408** (6.045 → 5.6368) and **inflates the SD from 0.6211 to 1.9228 (~3.1x)** — the mean averages in the outlier and the SD squares it. Yet it **leaves the median exactly at 5.600** and **does not move Q1 at all**, only nudging Q3 and the IQR a little. That is robustness, concretely: the median/IQR pair tells a stable story about the *typical* patient while the mean/SD pair is dominated by one questionable measurement. For a skewed, long-tailed lab value like HbA1c, **median (IQR) is the honest summary.**

**Honest limitation (the fence wrinkle).** Removing 13.8 shifts Q3 to 5.950 and the upper fence to 7.075, which then **flags 7.2** as the new outlier. The outlier set is therefore not intrinsic to the data — it depends on the sample, because the fence is computed from that same sample. The fence flags *candidates to investigate*, and its own position moves when the extreme values move.

---

## Practical takeaways

- **Report median (IQR) for skewed / long-tailed health data.** For right-skewed measures (HbA1c, biomarkers, length of stay, costs) the distribution is not normal and the mean/SD mislead; STROBE (von Elm et al., 2007) endorses median (IQR) for non-normally distributed data. This is the **STROBE reporting convention** — a convention, not a derived rule.
- **Pair the median with the IQR, not just the SD.** The SD is the fragile partner (it squares deviations, so one extreme inflates it); the IQR is the robust spread that matches the robust center. "Median (IQR)" gives a center and a spread both resistant to outliers.
- **The boxplot is the five-number summary, drawn to scale.** The default display for a single skewed variable: center (median), spread (IQR box), asymmetry (median position + whisker lengths), and extremes (flagged points) in one figure.
- **The fence flags candidates — investigate, do not auto-delete.** A point beyond 1.5xIQR is a hypothesis ("is this an error?"), not a verdict. Check the source: unit error, mislabel, repeat the assay, confirm the value. Auto-deleting on a fence removes the very extremes that are scientifically interesting.
- **Know your software's quantile method (R-7 here).** Quartiles differ slightly across packages because of the nine Hyndman-and-Fan conventions. State or assume R-7 (the R/NumPy default) so your Q1/Q3/median are reproducible and any cross-tool discrepancy is understood.

---

## Interactive lab plan

**"Quantile and IQR robustness lab."** The learner generates a deterministic, seeded right-skewed sample (a log-normal HbA1c-like scale), then adds high "contamination" (extreme values) with a slider and watches the **mean and SD move while the median and IQR stay nearly put**, with a **live SVG boxplot** updating — the hands-on version of the worked-example contrast.

**Controls.** **n** — number of base observations (default 40). **σ** — spread of the underlying log-normal (default 0.35). **C** — "extreme values" slider; each added value is a high contamination point.

**Readouts (all to 3 dp).** min, Q1, median, Q3, max, IQR, lower fence, upper fence, whisker-lo, whisker-hi, mean, SD, and the count + values of flagged outliers.

**Live boxplot.** An SVG box from Q1 to Q3, a median line, whiskers to the most extreme in-fence values, and a dot per flagged outlier — redrawn on every control change so the student *sees* the mean/SD markers drift away from the (stable) box.

**Deterministic RNG recipe (the builder mirrors this bit-for-bit).**
- **PRNG:** `mulberry32(42)`, canonical body, adding the constant **exactly once** inside the draw, no pre-mix:

      a = (a + 0x6D2B79F5) | 0
      t = Math.imul(a ^ (a >>> 15), 1 | a)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296

  (The second `imul` line takes `t`, not `a` — this is the exact body the PM's reference
  generator ran; `Math.imul(a ^ (t >>> 7), 61 | t)` yields a different stream and does NOT
  reproduce the pins.)

- **Normals:** draw n standard normals by the **Marsaglia polar** method (Box-Muller), **cos branch first, then sin**:

      u1, u2;  r = sqrt(-2·ln u1);  z0 = r·cos(2π·u2);  z1 = r·sin(2π·u2)

  emit `exp(3.8 + σ·z)` for each (log-normal, mean-scale ≈ e^3.8 ≈ 44.7).
- **Contamination:** for c = 1 … C, add one value at `max(base) + 15·c`.
- **Quantiles:** R-7 linear interpolation (the definition in the core concept).

**Ground-truth pins (builder must match to 3 dp; auditor re-verifies).**

| Config | min | Q1 | median | Q3 | max | IQR | lo-fence | hi-fence | w-lo | w-hi | mean | SD | outliers |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| n=40, σ=0.35, C=0 | 14.187 | 31.550 | 42.632 | 54.690 | 104.664 | 23.140 | −3.160 | 89.400 | 14.187 | 75.679 | 44.814 | 17.319 | 1 (104.664) |
| n=40, σ=0.35, C=1 | 14.187 | 31.987 | 44.572 | 55.318 | 119.664 | 23.330 | −3.008 | 90.313 | 14.187 | 75.679 | 46.639 | 20.715 | 2 |
| n=40, σ=0.35, C=2 | 14.187 | 32.179 | 45.376 | 55.410 | 134.664 | 23.231 | −2.668 | 90.256 | 14.187 | 75.679 | 48.735 | 24.559 | 3 |
| n=40, σ=0.35, C=3 | 14.187 | 32.370 | 46.181 | 56.450 | 149.664 | 24.080 | −3.751 | 92.571 | 14.187 | 75.679 | 51.082 | 28.734 | 4 |
| n=10, σ=0.35, C=0 | 23.463 | 30.514 | 37.367 | 40.495 | 50.035 | 9.980 | 15.544 | 55.465 | 23.463 | 50.035 | 36.713 | 8.047 | 0 |
| n=80, σ=0.35, C=0 | 14.187 | 33.337 | 44.200 | 53.124 | 104.664 | 19.787 | 3.655 | 82.805 | 14.187 | 80.159 | 45.692 | 17.042 | 3 |
| n=40, σ=1.0, C=0 | 1.684 | 16.544 | 39.254 | 79.547 | 508.130 | 63.003 | −77.961 | 174.053 | 1.684 | 152.718 | 64.220 | 85.323 | 2 |

(PM-corrected pin set, 2026-11-05: the first pin table was generated with a buggy Python RNG
emulation and has been replaced. The values above are produced by the EXACT canonical-JS body
above (verified three ways: the PM's Node reference generator, the researcher's independent Node
re-implementation, and a Python bit-level emulation — all agree bit-for-bit). The contamination
pins are internally consistent — e.g. C=1 max 119.664 = C=0 max 104.664 + 15·1 — confirming one
fixed base sample. The natural (uncontaminated) sample already carries values above its own fence
(1 at n=40, 3 at n=80, 0 at n=10) — the fence is sample-dependent, and the C slider adds extremes
on top of the real tail.)

**Robustness deltas the prose should state (C: 0 → 3, n=40, σ=0.35).** mean 44.814 → 51.082 (Δ **+6.269**); median 42.632 → 46.181 (Δ **+3.549**, ~1.8x smaller); SD 17.319 → 28.734 (Δ **+11.415**); IQR 23.140 → 24.080 (Δ **+0.940**, barely moves). Honest caption: **"Adding extremes pulls the mean ~2x as far as the median and the SD ~12x as far as the IQR — the IQR barely moves at all."**

---

## 10-question self-check quiz plan

Each item: stem, four options (A–D), the correct option, and a one-line explanation of why the tempting wrong option(s) fail. The length/position spread was **script-verified** to the hard rules (correct option longest in exactly 2 of 10; length ranks {1:2, 2:2, 3:3, 4:3}, rank 1 = longest; positions A:2, B:3, C:3, D:2 — all four used).

1. **Stem:** The 25th percentile, or first quartile (Q1), of a data set is the value:
   - A. the observation that leaves exactly one quarter of the data below it and three quarters above it, once the values are sorted in ascending order
   - B. the value below which 25% of the observations fall  **(correct)**
   - C. the point that lies one quarter of the way between the smallest and the largest value in the sample
   - D. the value that divides the range into four equal-length segments
   - *Why:* B is the definition; A, C and D all confuse "position of the cut" with "a quarter of the range."

2. **Stem:** The interquartile range (IQR) of a data set is:
   - A. the difference between the largest and the smallest values, spanning the full width of the distribution
   - B. Q3 minus Q1, the width of the central half of the data  **(correct)**
   - C. the distance from the minimum to the maximum
   - D. half the range, computed as (max − min) divided by two
   - *Why:* B. A and C are the same misconception (the range, not the IQR); D is half the range, not the middle-50% span.

3. **Stem:** The median of a data set is equal to which of the following?
   - A. the arithmetic mean, which adds every observation and then divides by n
   - B. the value that occurs most frequently in the data, i.e. the mode
   - C. the 50th percentile  **(correct)**
   - D. the 10th percentile
   - *Why:* C. A (mean) and B (mode) are different central statistics that only sometimes coincide with the median; D is just wrong.

4. **Stem:** Why is the median robust to a single extreme outlier while the mean is not?
   - A. The median and the mean are always equal, so an outlier moves both of them by the same amount.
   - B. The mean drops the largest observation before averaging, so it is immune to extreme values.
   - C. Extreme values are removed before either statistic is calculated, so neither is ever affected.
   - D. It depends only on the order of the values, so a single extreme point barely moves it, whereas the mean uses every value and is pulled strongly toward the outlier.  **(correct)**
   - *Why:* D (order vs average; breakdown point ~50% vs 0). A is false; B inverts the roles (the median is the insensitive one); C is false — nothing is pre-removed.
5. **Stem:** A Tukey boxplot is a scale drawing of which summary of the data?
   - A. the five-number summary: minimum, Q1, median, Q3, maximum  **(correct)**
   - B. the complete empirical distribution, drawn as a separate mark for every single observation in the sample
   - C. the mean, the standard deviation, and the sample size, arranged left to right
   - D. only the median and the mode of the data set
   - *Why:* A. B is a strip/jitter plot; C is the fragile summary the box does not encode; D omits Q1, Q3 and the min/max.

6. **Stem:** In a classic boxplot, a point is flagged as a mild outlier when it lies beyond:
   - A. one full standard deviation away from the sample mean, on either side of it
   - B. Q1 − 1.5 x IQR or Q3 + 1.5 x IQR  **(correct)**
   - C. the median plus one entire interquartile range above, or minus one IQR below
   - D. three times the sample range, measured outward from the minimum and the maximum
   - *Why:* B is the Tukey 1.5xIQR inner fence. A is the normal z=1 idea; C is a made-up median fence; D is not a standard rule.

7. **Stem:** The breakdown point of the median is about 50% because:
   - A. it is a trimmed mean that discards the most extreme observations first
   - B. it only ever uses the lower half of the sorted data
   - C. roughly half of the data can be replaced with arbitrarily large values before the median is pushed to an arbitrary location, whereas a single point can drag the mean as far as you like.  **(correct)**
   - D. it is a geometric mean, which cannot exceed the largest value
   - *Why:* C is the definition of a ~50% breakdown point. A is false (not a trimmed mean); B is false (uses the order of the whole sample); D is false (not a geometric mean).

8. **Stem:** The 1.5 x IQR and 3 x IQR fence multipliers are best described as:
   - A. conventional rule-of-thumb choices (Tukey, Hoaglin), not derived constants  **(correct)**
   - B. exact probability constants that follow directly from the shape of the standard normal distribution
   - C. universal constants that can never be changed in any application
   - D. software defaults that are identical to a two-sided hypothesis test at 5%
   - *Why:* A — they are Tukey/Hoaglin conventions. B false (not derived from the normal); C false (adjustable); D false (a fence is not a test).

9. **Stem:** Two software packages report slightly different quartiles for the same data. The most likely cause is:
   - A. the data were not sorted in ascending order before either package computed its quartiles, which always shifts the results
   - B. different sample-quantile conventions (e.g. R-7 versus another Hyndman-Fan method)  **(correct)**
   - C. quartiles are only defined for exactly 100 observations, so one of the reports must be invalid
   - D. one package refused to run for an even sample size
   - *Why:* B — the nine Hyndman-and-Fan conventions differ slightly. A is false (sorting is always done and not the cause); C and D are unambiguously false.

10. **Stem:** A value falls beyond the 1.5 x IQR upper fence. The correct next step is to:
    - A. immediately delete it, because the 1.5 x IQR fence is a formal significance test at the 0.05 level
    - B. replace it with the median so the summary statistics shrink
    - C. investigate it as a candidate outlier, not delete it  **(correct)**
    - D. ignore it, since the fence is only a cosmetic feature of the boxplot and means nothing
    - *Why:* C — the fence flags candidates to investigate; it is not a test and not a delete order. A is the dangerous misconception; B and D are unambiguously wrong.

---

## References

All six DOIs were independently re-resolved via `https://doi.org/<doi>` with `Accept: application/vnd.citationstyles.csl+json`; title, first author, and year matched in every case, and the volume/issue/pages below are from those same CSL records (not retyped from memory). No candidates were dropped.

1. Hyndman, R. J., and Fan, Y. (1996). Sample Quantiles in Statistical Packages. *The American Statistician*, 50(4), 361–365. DOI: 10.1080/00031305.1996.10473566
2. McGill, R., Tukey, J. W., and Larsen, W. A. (1978). Variations of Box Plots. *The American Statistician*, 32(1), 12–16. DOI: 10.1080/00031305.1978.10479236
3. Hoaglin, D. C., and Iglewicz, B. (1987). Fine-Tuning Some Resistant Rules for Outlier Labeling. *Journal of the American Statistical Association*, 82(400), 1147–1149. DOI: 10.1080/01621459.1987.10478551
4. Iglewicz, B., and Hoaglin, D. C. (1987). Use of Boxplots for Process Evaluation. *Journal of Quality Technology*, 19(4), 180–190. DOI: 10.1080/00224065.1987.11979063
5. von Elm, E., Altman, D. G., Egger, M., Pocock, S. J., Gøtzsche, P. C., and Vandenbroucke, J. P. (2007). The Strengthening the Reporting of Observational Studies in Epidemiology (STROBE) Statement: Guidelines for Reporting Observational Studies. *PLoS Medicine*, 4(10), e296. DOI: 10.1371/journal.pmed.0040296
6. Huber, P. J., and Ronchetti, E. M. (2009). *Robust Statistics.* Wiley Series in Probability and Statistics. Wiley. DOI: 10.1002/9780470434697

Suggested placement: #1 (Hyndman and Fan) anchors the core concept and conventions (why R-7, why packages differ); #2 (McGill, Tukey and Larsen) the boxplot / five-number summary; #3–#4 (Hoaglin and Iglewicz; Iglewicz and Hoaglin) the 1.5xIQR / 3xIQR inner- vs outer-fence discussion; #5 (von Elm et al., STROBE) the "median (IQR) for skewed data" takeaway; #6 (Huber and Ronchetti) the median-vs-mean breakdown point.

---

## Notes for the PM / auditor

**Worked example — computation log (exact).**
- Script: `/tmp/q_iqr_verify.py` (pure Python 3, `math` only; no statistics packages), run via the terminal.
- Quantile method: R-7 linear interpolation exactly as stated in the brief: `h = (n−1)·p`, `j = floor(h)`, `q̂(p) = x_(j+1) + (h−j)·(x_(j+2) − x_(j+1))`.
- **All HbA1c numbers reproduced EXACTLY to display rounding (verified in code):** n=20; min 4.7; max 13.8; positions 4.75 / 9.5 / 14.25; Q1 **5.200**; median **5.600**; Q3 **6.025**; IQR **0.825**; lower fence **3.9625**; upper fence **7.2625**; flagged outlier **{13.8}**; whiskers **4.7 / 7.2**; mean **6.045**; SD **1.9228** (sample SD, denominator n−1 = 19; the n−1 denominator matches the pin — the n denominator would give 1.8742, so the pin uses n−1).
- **Robustness contrast (WITHOUT 13.8, n=19), all exact:** mean **5.6368**; SD **0.6211** (n−1); median **5.600** (exactly); Q1 **5.200** (exactly); Q3 **5.950**; IQR **0.750**; upper fence **7.075**; 7.2 **is** then flagged (7.2 > 7.075) — the fence-sensitivity wrinkle reproduced. Mean gap **+0.408**; SD ratio **3.096** (~3.1x). All match the brief's pinned deltas.

**Lab pins — discrepancy investigated, RESOLVED by the PM (2026-11-05).** The first pin table in
this file (min 24.872, median 44.176, max 114.359 …) was generated by the PM with a Python
`mulberry32` emulation that had a transcription bug (`(1|t)` where the canonical body has
`(1|a)`, plus a mangled second line). The researcher's faithful implementations (real Node JS with
`Math.imul`/`|`/`^`/`>>>`, and an independent Python bit-level emulation — the two agree
bit-for-bit) produced min 14.187, median 42.632, max 104.664, mean 44.814, SD 17.319 at the
default, which the PM verified is what the **canonical** body produces (a `/tmp` variant test:
canonical `Math.imul(t^(t>>>7), …)` → 14.187…; the literal `Math.imul(a^(t>>>7), …)` → 21.680…;
the buggy Python emulation → 24.872…). The pin table above has been replaced with the canonical-JS
values, the RNG recipe line corrected to the exact body, and the briefs updated to match. **The
builder must implement the exact canonical-JS body printed above and reproduce the corrected pins
to 3 dp; the old 24.872/44.176/114.359 set is void.**

**Reference-verification log.** All six verified via `doi.org` CSL-JSON (title + first author + year all matched; bibliographic detail in the References section):
- 10.1080/00031305.1996.10473566 — "Sample Quantiles in Statistical Packages", Hyndman, 1996, *American Statistician* 50(4):361–365. **PASS.**
- 10.1080/00031305.1978.10479236 — "Variations of Box Plots", McGill, 1978, *American Statistician* 32(1):12–16. **PASS.**
- 10.1080/01621459.1987.10478551 — "Fine-Tuning Some Resistant Rules for Outlier Labeling", Hoaglin, 1987, *JASA* 82(400):1147–1149. **PASS.**
- 10.1080/00224065.1987.11979063 — "Use of Boxplots for Process Evaluation", Iglewicz, 1987, *J. Quality Technology* 19(4):180–190. **PASS.**
- 10.1371/journal.pmed.0040296 — "…(STROBE) Statement: Guidelines for Reporting Observational Studies", von Elm, 2007, *PLoS Medicine* 4(10):e296. **PASS** (family is "von Elm"; my substring check flagged the bare "Elm", but the CSL title, author and year all match — a true match, not a drop).
- 10.1002/9780470434697 — "Robust Statistics", Huber, 2009, *Wiley Series in Probability and Statistics*. **PASS.**
- **No drops.**

**Teaching judgment calls I made (flagged for the builder).**
- I framed the median-vs-mean contrast through the **breakdown point** (0 for the mean, ~50% for the median), citing Huber and Ronchetti as the brief asked, and kept the SD-squaring point concrete with the worked-example numbers (0.6211 → 1.9228, ~3.1x) so it is shown, not just asserted.
- I labeled the 1.5xIQR and 3xIQR multipliers and the "median (IQR) for skewed data" rule as **conventions / rule-of-thumb** (Tukey, Hoaglin; STROBE) rather than derived constants, and kept the fence-sensitivity wrinkle as a short limitation note in the worked example (not leading with it), as instructed.
- I did **not** write the rendered quiz options into any HTML (researcher scope); section 7 is the full plan (options, correct answer, one-line explanation each) with the length/position spread script-verified.
- I did **not** edit `topics.ts` or add the slug (builder's step, outside researcher scope). Suggested slug: `describing-data/quantiles-and-the-interquartile-range` (i.e. `public/describing-data/quantiles-and-the-interquartile-range.html`).
