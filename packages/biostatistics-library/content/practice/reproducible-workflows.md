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

## A reproducible analysis lifecycle

## Data provenance and validation

## Example project layout

A maintainable structure might include `README.md`, `renv.lock`, `data-raw/` for scripts that acquire data (not sensitive raw records), `R/` for reusable functions, `analysis/` for ordered scripts, `reports/` for rendered outputs, and `outputs/` for derived tables/figures. A Makefile or workflow tool can encode dependencies so a changed source reruns only downstream steps. Avoid files named `final_final2.R`; use version control and tagged releases.

Separate exploratory notebooks from the production analysis and convert validated logic into scripts/functions. Record assumptions in code comments and maintain a data dictionary. Keep generated outputs reproducible and label manual annotations explicitly. If external inputs are unavailable to collaborators, provide synthetic fixtures that exercise the pipeline.

## Code review and analytic validation

## Version control practice

## Reproducible R analysis example

A project can start by reading immutable input, validating schema, transforming via functions, and writing derived outputs to a controlled location. Use `here::here()` or project-relative paths, `targets`/`drake` for dependency graphs, and `renv` for package state. Write tests for critical recodes and derivations; a test should fail when outcome coding unexpectedly changes. Render report in CI from a clean environment and check output for errors and key numerical values.

```r
stopifnot(!anyDuplicated(dat[c("id", "visit")]))
stopifnot(all(dat$outcome %in% c(0, 1, NA)))
dat$event <- as.integer(dat$status == "event")
saveRDS(dat, here::here("derived", "analysis_data.rds"))
```

The checks depend on the expected unit of observation and valid outcome coding; tailor them to the data dictionary. Validation code should report exceptions rather than silently coerce malformed values. Sensitive derived files should remain in approved storage and not be committed.

## Reproducibility in regulated clinical work

Clinical analyses may require validated environments, audit trails, access controls, and change control. Reproducible code should be accompanied by review and validation appropriate to intended use. Maintain traceability from source data to derived variables to table cells. Preserve audit logs and analysis dataset snapshots. Public open-source workflows are useful but do not replace applicable data governance and quality systems.

Commit small coherent changes with messages describing analytical intent, not only file names. Use branches for substantial work and code review for primary derivations. Tag a release corresponding to manuscript submission and preserve the repository state. Resolve conflicts by comparing semantics, not blindly taking one side. Never commit raw protected data, credentials, or temporary exports; add repository ignore rules and scan history if sensitive material was accidentally introduced.

For collaborative analysis, maintain issues for assumptions and decisions, document who approved changes, and keep a decision log. Scripts should run in a declared order or workflow graph. Avoid manual dependence on current working directory and interactive object state. A clean render from an empty session is a meaningful check of computational reproducibility.

## Reproducibility limits and replication

## Reproducible reporting pipeline

## Handoff checklist

Use automated checks for key output totals and report rendering, but preserve human review of clinical interpretation and disclosure risk. Archive review approvals and known limitations with each release.

For tables and figures, generate values directly from saved analysis objects and test key counts against source data. Archive report source plus rendered artifact and link both to the data snapshot and code commit. This prevents manually edited results from drifting away from reproducible analysis.

## Provenance metadata

For manuscripts, generate the reported numeric results from the final locked analysis data and include a consistency check against abstract and table values.

Release notes should summarize code, data, and environment changes and identify outputs regenerated for each version.

Review rendered outputs for accidental disclosure of small cells, identifiers, or embedded source data. Include safe synthetic fixtures for code review and document which production inputs require protected access. These steps support reproduction while maintaining governance obligations.

Record input-file checksums, query/extract timestamp, code commit, package lockfile, and report-render time. Provenance metadata helps distinguish real analytic changes from updated source extracts or software behavior. Keep a manifest with each publication release and make data access steps explicit.

Deliver a README with data inputs, access instructions, environment setup, execution order, expected runtime, outputs, and known limitations. Include a license or data-use constraints, contact/ownership, and code version. A new analyst should be able to reproduce key outputs without relying on undocumented knowledge. For long pipelines, provide a small smoke-test dataset and expected output to verify setup quickly.

Archive both source and rendered report with the exact commit and data snapshot. Distinguish a reproducibility package from a public dataset; sensitive data may require secure access approval. Document any step that cannot be automated and why.

Generate manuscript tables and figures from a single analysis dataset and scripted functions. Include assertions that key totals match the CONSORT/STROBE flow and that denominators reconcile. Use unit tests for derived endpoints and snapshot expected summaries for regression checks. Render the full report from a clean process with warnings visible. Record data release ID and code commit in output metadata so results map to exact inputs.

For collaboration, document decisions and assumptions in README or analysis log, review code changes, and archive release artifacts. A container can capture system dependencies, but should be combined with a lockfile and documented data access. Reproducibility includes secure governance: do not expose row-level data in reports, logs, or test fixtures.

Exact reproducibility can fail because of nondeterministic parallel algorithms, floating-point differences, package updates, or changing external resources. Record tolerances for numerical comparison and provide expected output hashes or key checks. Replication with new data tests generalizability, not merely code. Share limitations, unavailable dependencies, and data access requirements so another team can assess what can be reproduced.

Review data transformation code for key uniqueness, missing-value semantics, date/time-zone handling, and unit conversions. Validate derived outcomes against hand-calculated records and independent code for primary endpoints. Compare statistical output with textbook calculations or another package for critical analyses. Review does not replace clinical adjudication: domain experts should confirm endpoint definitions and plausible ranges.

Continuous integration can render reports and run fast checks on each change. Protect secrets in environment managers, never write credentials into notebooks, and inspect HTML outputs for embedded patient-level data. Archive exact code commit and data snapshot used for publication so later package updates do not silently alter results.

Record source system, extraction date, query version, filters, and data dictionary. Use checksums or immutable snapshots to detect source changes. Validate identifiers, dates, ranges, duplicate records, and joins with assertions. For clinical datasets, document whether rows represent people, visits, specimens, or events. Derive analysis variables from source fields in code with unit tests and traceable mappings. Never overwrite raw data; keep correction logs and transformations deterministic.

Example assertions in R can check unique patient-visit keys, permitted values, and expected row counts after joins. Fail loudly when assumptions are violated instead of silently dropping records. Summarize exclusions by reason and compare against the flow diagram. Data cleaning decisions should be reviewed and versioned like analysis code.

## Computational environments and random processes

Package lockfiles support environment restoration but do not guarantee identical results across CPU architectures or system libraries. Record R/Python version, operating system, package versions, locale, timezone, and external software. Set random seeds for bootstrap, imputation, and simulation; for parallel work use reproducible RNG streams and record worker settings. Avoid relying on hidden objects in interactive sessions; render from a fresh process.

## Sharing under governance constraints

For protected or licensed data, make code public only if it contains no identifiers, secrets, or contract-restricted material. Provide synthetic data or a data-access workflow so methods can be inspected without disclosure. Document data-use restrictions and reproducibility limitations explicitly. Reproducibility is improved by transparent code and metadata even when raw data cannot legally be shared.

Reproducibility begins before modeling: preserve a read-only raw-data source, record provenance and permissions, define a data dictionary, and separate raw, intermediate, and analysis-ready data. Use scripts or notebooks to transform data deterministically; avoid manual spreadsheet edits without an auditable log. Store code and metadata under version control, with meaningful commits and tagged analysis releases. Pin package versions with a lockfile and capture system details when results depend on external software or APIs.

```r
sessionInfo()
renv::snapshot()  # record package versions for this project
```

`renv` helps restore an R package library but does not capture operating system libraries, external databases, private data access, or random-number state by itself. Record seeds for stochastic procedures, while recognizing that parallel computations and package changes can affect exact sequences. Keep credentials and protected health information out of repositories and logs; use approved secure storage and role-based access.

## Project structure and automated checks

Organize projects with explicit directories for data, code, outputs, and documentation; use relative paths through a project root rather than machine-specific absolute paths. Define functions for repeated transformations, validate input schemas, and assert row counts and allowed ranges after joins. A join can silently multiply rows if keys are not unique; check key uniqueness before and after joins. Unit tests for deterministic data transformations can catch regressions, while analytic validation compares results with known examples or independent implementations.

Generate tables and figures from analysis objects, not manually retyped values. A single source of truth prevents abstract numbers and manuscript values from diverging. Use literate reports (Quarto/R Markdown) to combine code, methods, and results; render from a clean session to detect hidden state. Preserve output artifacts only when they are meaningful and reproducible; avoid committing large temporary files or derived data with sensitive content.

## Data privacy, collaboration, and handoff

Reproducibility does not require publishing identifiable data. Share code, synthetic examples, data dictionaries, and controlled-access procedures where lawful and ethical. Document data transformations and analysis populations so authorized collaborators can reproduce results in a secure environment. Record software versions, execution date, data snapshot identifier, and known limitations in a README. For collaborative work, code review, issue tracking, branch discipline, and named ownership clarify decisions and reduce undocumented changes.

Before handoff, run the project from a clean environment, verify key output values against the report, inspect warnings, and archive the exact code/data version used. Distinguish computational reproducibility (same data and code reproduce result) from replicability (new data support conclusion). Both are important, but they answer different questions.

- Peng RD. Reproducible research in computational science. *Science*. 2011;334:1226–1227. https://doi.org/10.1126/science.1213847
- National Academies. *Reproducibility and Replicability in Science*. 2019. https://doi.org/10.17226/25303

- Peng RD. Reproducible research in computational science. *Science*. 2011;334:1226–1227. [doi:10.1126/science.1213847](https://doi.org/10.1126/science.1213847)

- Leisch F, R-Core-Team. *Reproducible Research with R*. Springer.
- Wickham H, Grolemund G. *R for Data Science*. O'Reilly Media.
- Bland M. *Statistics in Practice: A Guide to the Statistical Methods in Medicine and the Health Sciences*. Chapman and Hall.

The [sampling methods article](../study-design/sampling-methods.html) discusses upstream data-collection choices that a reproducible pipeline inherits.
