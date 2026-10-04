---
title: Reproducible workflows
summary: The habits that make an analysis verifiable — version control, scripts over point-and-click, pinned software and seeds, and an audit trail from raw data to reported number.
---

## Overview and key ideas

A **reproducible workflow** is one in which a third party, given the raw data and your code, can regenerate every number, figure, and table in the paper by running a sequence of commands — without asking you to "email the R session" or to walk them through a series of GUI clicks. Reproducibility is not about perfecting the science; it is about making your *process* auditable.

This is distinct from, but stronger than, *replicability* (does another group get the same conclusion?) and *reproducibility of the data* (can the raw data be shared?). In this article "reproducible" means the narrow, technical sense: a fixed sequence of operations that turns given data into the reported outputs, every step recorded.

The core habits, in order of impact:

- **Version control (git).** Every analysis lives in a repository. Code is committed at meaningful stages, so the exact code that produced the results in a paper is a specific, citable commit — not "the script in my laptop that I keep updating."
- **Scripts, not spreadsheets and menus.** The analysis is a sequence of readable, ordered steps (R or Python scripts, or notebooks committed with their kernels). Point-and-click software is fine for exploration, but the numbers that go into the manuscript must come from code.
- **Pinned software.** Analysis results depend on library versions. A lockfile (`renv`/`packrat` for R, `environment.yml` or `requirements.txt`/`uv.lock` for Python) records exactly which versions were used. A result that cannot be run with the same versions is not reproducible, only "probably the same."
- **Randomness made deterministic.** Any random component — resampling, simulation, random-number generation for splits — gets an explicitly recorded seed so it can be replayed.
- **Audit trail from raw to reported.** Raw data (or a documented, hash-verified copy) → cleaning script → analysis script → output. Each step's input and output are traceable, and the transformation from source data to the number in Table 2 is a chain anyone can walk.

## When to use it

| Setting | Example question |
| --- | --- |
| A submitted manuscript | A reviewer asks for the code behind Figure 3 — can you point to a commit that regenerates it exactly? |
| A multi-site collaboration | Five sites contribute data over two years; every version of the pooled analysis must be traceable to a data snapshot |
| A regulatory submission | The agency will inspect the code that produced the primary analysis; every change after the SAP lock is a documented commit |
| Your own follow-up | Six months later, can you rerun "the last analysis" without rediscovering which ten unsaved files you edited? |

Reproducibility matters most where results will be scrutinised (trials, publications, submissions) or reused (shared datasets, living analyses). Even a small single-author project benefits: the next version of yourself is the first beneficiary of a traceable process.

## Assumptions and limitations

- **Reproducibility is not the same as validity.** A perfectly reproducible analysis can still answer the wrong question or rest on biased data. The workflow controls *process*; it does not control *design*.
- **It is not zero-cost.** Setting up version control, a lockfile, and organised scripts takes real time up front, and it resists ad-hoc exploratory habits. The trade-off is well worth it for anything that will be cited or submitted.
- **Data access is the usual blocker.** Code without data reproduces nothing. If the raw data cannot be shared (privacy, ethics), the reproducibility claim is partial: code and synthetic/derived data are reproducible, the raw-data step is not. State this explicitly.
- **Notebooks have a specific trap.** A notebook is only reproducible if its execution environment is also pinned; a saved .ipynb with unrecorded dependencies is a snapshot, not a recipe.

## Worked example

A group analyses a 2-year registry of 4,000 sepsis patients to estimate the association between early lactate clearance and 28-day mortality. The workflow: a git repository with `data/` (raw CSV plus SHA-256 checksums recorded at import), `clean/` (one script turning raw → analysis-ready file, committed once the cleaning logic is frozen), `analysis/` (the Cox model script), and `output/` (tables and figures regenerated, never hand-edited). The R environment is locked with `renv`; the analysis script sets `set.seed(2026)` for the bootstrap SE of the hazard ratio.

A collaborator six months later clones the repo, runs `renv::restore()`, executes the three scripts in order, and regenerates every table in the paper. The hazard ratio 0.86 (95% CI 0.79–0.94) appears bit-for-bit. When a new site's data arrives, the team creates a new branch, records the new checksum, reruns the chain, and commits the diff — the old results remain reproducible at the old commit.

## Interpretation and common pitfalls

- **Committing a script is not the same as committing the environment** — "it runs on my machine" fails when the library is a different version; the lockfile is the missing half.
- **Spreadsheets as a hidden data pipeline** — if a cleaning step happened in an Excel file that was "just organised," that step is invisible to anyone rerunning the code; the chain is broken exactly where it is hardest to audit.
- **Forgetting the seed (or using a different one per run)** — any stochastic step without a recorded seed makes the reported standard error or split non-replayable.
- **Editing figures by hand** — regenerating a figure from code and then nudging the legend in a drawing tool means the published figure is no longer what the code produces.

Reproducibility has several layers: computational reproducibility reruns the same analysis, while independent replication asks whether new data support the conclusion. A seed alone may not guarantee bit-for-bit results across software versions, hardware, parallel algorithms, or nondeterministic libraries; record versions, environment, and data provenance, and state the expected reproducibility level. Keep personally identifiable data and credentials out of version control, use access controls and approved storage, and document any transformations that cannot be shared. A container or lockfile makes dependencies easier to reconstruct but does not preserve data access or guarantee future availability.

## References and further reading

- Peng RD. Reproducible research in computational science. *Science*. 2011;334:1226–1227. [doi:10.1126/science.1213847](https://doi.org/10.1126/science.1213847)

- Leisch F, R-Core-Team. *Reproducible Research with R*. Springer.
- Wickham H, Grolemund G. *R for Data Science*. O'Reilly Media.
- Bland M. *Statistics in Practice: A Guide to the Statistical Methods in Medicine and the Health Sciences*. Chapman and Hall.

The [sampling methods article](../study-design/sampling-methods.html) discusses upstream data-collection choices that a reproducible pipeline inherits.
