---
title: Transformers for health data
summary: An introduction to attention-based sequence models for clinical text, codes, and time series, with cautions about scale and evaluation.
---

## Overview

Transformers represent sequences by repeatedly combining each element with information from other elements through attention. They underpin many language models and can also process clinical codes, time-stamped records, images, and multimodal data. Their flexibility permits contextual representations but does not guarantee that learned relationships are clinically meaningful, temporally valid, or safe.

Health applications include note classification, summarization, information extraction, code sequence modeling, and clinical decision support. These tasks have different targets and evidence requirements. A model that predicts a diagnosis from notes is not necessarily estimating disease prevalence; a generated summary is not a verified clinical record. Define intended users, data availability, output, and action before selecting prompting or fine-tuning strategies.

## Self-attention and sequence representations

A transformer maps input tokens into vectors with positional or temporal information. Self-attention computes relationships among tokens: queries and keys determine attention weights, which combine value vectors. Multiple attention heads can represent different relationships. Feed-forward layers transform each token representation, and residual connections and normalization support training of deep networks.

Attention is not inherently an explanation. A token receiving a large attention weight does not prove it caused or justified the output. Multiple attention patterns can produce similar outputs, and attention visualization depends on layer, head, and aggregation. Use perturbation, counterfactual testing, and external evidence to inspect behavior; avoid causal interpretations.

Transformers process sequences in parallel more readily than recurrent networks, but standard self-attention cost grows roughly quadratically with sequence length. Long clinical histories may require truncation, chunking, retrieval, or long-context variants. These choices affect which records are considered and may omit relevant events. State the context window and selection rule.

### Tokens, records, and clinical time

Text tokenization splits notes into units, often subwords. Clinical abbreviations, misspellings, medication names, and local templates can tokenize unpredictably. Structured records may be represented as tokens with event type, value, unit, and time interval. A token sequence is a designed representation, not a neutral copy of the medical record.

Temporal leakage is a major risk. Notes written after diagnosis, discharge summaries, copied-forward assessments, and billing codes can reveal the outcome. A retrospective extract may make documentation timestamps differ from when information became available to clinicians. For prospective prediction, define the index time and include only content available then. Test data construction for post-index leakage.

De-identification may remove names but leave rare events, dates, locations, or distinctive phrases. Language models can memorize or reproduce sensitive content. Apply privacy review, minimize data, control access, and evaluate leakage risks. Pretraining corpora may include data with uncertain provenance or consent; document source and licensing constraints.

### Worked example: note classification and drafting support

Suppose a model classifies emergency department notes as requiring urgent follow-up within seven days. Define the label from a validated outcome process and specify whether the model sees triage text only or the complete note. If the task is to predict at triage, later physician notes and discharge instructions are leakage even if they appear in the same record. Split by patient and time, and test at a different site.

For generation, suppose a model drafts a discharge summary from chart data. Evaluate factual consistency, omitted critical information, unsupported statements, and whether medication changes match the record. Fluency is not clinical accuracy. Review outputs by clinicians blinded to the model where feasible, and measure error severity as well as frequency.

~~~r
# Conceptual prompt construction; production requires approved model/API tooling.
prompt <- paste(
  "Summarize only the information below. Mark unknown items as unknown.",
  "Do not infer a diagnosis or recommend treatment.",
  paste0("Record: ", note_text)
)
~~~

This sketch does not run a model or guarantee safe output. Prompt wording, system instructions, model version, decoding settings, and retrieved context all form part of the evaluated intervention. The model should cite or link source passages when possible, and a human reviewer should verify consequential statements.

## Pretraining, fine-tuning, and prompting

Pretraining estimates representations from large corpora, often by predicting masked or subsequent tokens. Fine-tuning adapts model parameters to a target task; instruction tuning and preference optimization further shape responses. Prompting provides task instructions without changing weights, though examples and context still influence outputs. These strategies trade data needs, computational cost, control, and privacy.

A pretrained model may perform poorly on local terminology, populations, or workflows. Domain adaptation can improve performance but risks overfitting or memorizing sensitive records. Report pretraining sources, checkpoints, fine-tuning data, prompt templates, retrieval sources, and model versions. If using external hosted models, document data handling and version updates.

For few-shot prompting, examples should be selected without using evaluation labels and should represent intended input variety. Retrieval-augmented generation can ground responses in local documents, but retrieval errors and stale sources remain possible. Evaluate the full retrieval-and-generation pipeline, including source relevance, missing evidence, contradictions, and citation fidelity.

## Evaluation design for predictions and generated text

For classification, evaluate discrimination, calibration, threshold performance, subgroup errors, and uncertainty. For extraction, assess entity-level precision and recall with explicit matching rules. For summarization, combine automated checks with expert review of factuality, omissions, unsupported content, and clinical relevance. Generic language metrics such as n-gram overlap can reward copying while missing dangerous factual errors.

Construct test sets from the intended population and use patient-level and temporal separation. Avoid training/test contamination through duplicate notes, copied templates, or pretraining overlap where detectable. A test set should include rare but consequential scenarios, contradictory records, negation, uncertainty, and missing context. Report sample sizes and confidence intervals; small clinician review samples cannot support precise safety claims.

Prompt and model selection constitute tuning. If multiple prompts, temperatures, models, and output formats are tried on the test set, its results are no longer independent. Use a development set to refine and lock the system, then evaluate once on a separate cohort. Repeat evaluation when model provider or version changes.

## Reliability, uncertainty, and human review

Generative outputs may vary across runs, even with identical input, depending on sampling settings and model implementation. Measure stability across repeated runs and clinically equivalent prompts. A confident or coherent answer does not imply correctness. Calibrating uncertainty for free-text generation is difficult; use explicit abstention, source-grounding, and human review rather than an unvalidated confidence score.

Define review intensity according to consequence. A low-risk formatting suggestion differs from a medication recommendation or diagnosis. Human review must be feasible and meaningful; automation bias can cause clinicians to accept incorrect outputs. Measure override rates, reviewer time, error detection, and downstream outcomes. Clearly label generated content and preserve provenance.

## Fairness, safety, and privacy

Evaluate performance across language, age, sex, ethnicity, disability, care setting, and other relevant groups, with uncertainty. Models can perform worse for dialects, non-native speakers, or groups underrepresented in pretraining. De-identification and language normalization can also remove clinically meaningful context. Engage users and affected communities in evaluation.

Test for harmful recommendations, hallucinated facts, omission of critical warnings, privacy leakage, prompt injection, and misuse. Red-team cases should cover realistic workflow failures, not only adversarial tricks. Minimize sensitive data sent to external services and verify contractual and governance protections. Logs themselves may contain protected information.

For decision support, define prohibited uses and escalation paths. Do not allow generated text to silently overwrite the medical record. Retain source references, clinician edits, and model version for audit. A human-in-the-loop label is insufficient unless the human has time, training, authority, and accessible evidence to review the result.

## Deployment, updates, and monitoring

A silent evaluation can test latency, retrieval, data access, version stability, and local error patterns without affecting care. An impact study should assess patient outcomes, clinician workload, trust, delays, and harms. Compare with usual workflows and include downstream effects. Technical benchmark gains alone do not demonstrate improved care.

Monitor output quality, error severity, subgroup performance, source citation correctness, and changes in input data. Model providers may update weights or serving behavior; pin versions where possible and retest changes. Define rollback, incident reporting, and a named governance owner. Keep a record of prompts, retrieval corpora, decoding parameters, and model revisions.

## Minimum reporting for a health transformer

Describe task, population, data source, index time, output use, model name/version, pretraining and fine-tuning, prompt, context construction, retrieval, decoding, and evaluation. State patient/time split rules and contamination checks. Report task-specific metrics, expert review protocol, subgroup results, uncertainty, safety tests, and external evaluation.

For generated outputs, include examples of representative successes and failures with privacy safeguards. Separate model accuracy from user impact. Use TRIPOD+AI for prediction components and relevant guidance for clinical language systems. State limitations and whether the model is research-only, assistive, or authorized for a defined workflow.

## A test plan for note classification

Construct a cohort whose notes represent the actual prediction moment. For triage classification, include only text available at triage and label a subsequent, prespecified event. Split at patient level and by time; if deployment is across sites, reserve a site. Remove duplicate or copied-forward text across partitions. Have a sample of labels reviewed by clinicians and report agreement and adjudication.

At a chosen threshold, present a confusion matrix with counts. If 200 notes are evaluated, 40 meet the target; the model flags 50, of which 28 are true positives. Sensitivity is 28/40=70%, PPV is 28/50=56%, and false positives are 22. These measures are not accuracy, and confidence intervals are needed. Compare with current triage practice, and assess whether errors differ by language, note length, or demographic group.

If the model summarizes notes, define a structured rubric. For each statement, check whether it is supported by source text, whether important findings are omitted, whether temporal order is preserved, and whether uncertainty is represented accurately. A factuality rate can be calculated as supported claims divided by all verifiable claims, but severity-weighted errors may be more clinically meaningful. Reviewers should be trained, use a prespecified rubric, and resolve disagreements transparently.

Automated metrics can aid triage of outputs but cannot replace expert review. ROUGE or BLEU-like overlap metrics reward lexical similarity; a valid paraphrase can score poorly, while a copied but incorrect sentence can score well. Evaluate clinically important facts and omissions directly. Report inter-rater agreement and the number of outputs examined.

### Prompting as a model component

A prompt specifies role, task, constraints, format, examples, and available context. Small changes can alter output. Freeze a prompt template before final evaluation and store its version with the model. Few-shot examples should be chosen from development data and checked for sensitive content. Examples that are unusually clean may give an unrealistic estimate of performance.

Instruction wording can reduce some failures but cannot enforce correctness. “Do not hallucinate” does not guarantee that unsupported statements are absent. Ask the system to distinguish source-supported facts from unknowns, preserve uncertainty, and provide citations to source passages. Validate that cited material actually supports the generated statement.

Temperature, top-p sampling, maximum tokens, stop sequences, and other decoding settings affect outputs. Deterministic decoding may improve repeatability but not truth. For stochastic generation, evaluate multiple runs per case and summarize variation. If outputs change materially with innocuous prompt wording, include that fragility in safety assessment.

## Retrieval-augmented systems

Retrieval-augmented generation supplies documents or chart passages as context. It can ground answers in current institutional guidance, but performance depends on retrieval recall, ranking, document version, chunking, and context limits. Test whether the correct evidence is retrieved for representative queries. A correct answer cannot be expected if relevant data are absent or buried.

Measure retrieval and generation separately. For retrieval, assess whether necessary passages appear in top-ranked results and whether contradictory guidance is surfaced. For generation, measure faithfulness to retrieved content, omission, and appropriate uncertainty. Use document provenance and dates. The model may cite a relevant-looking but outdated policy unless retrieval filters by version.

Clinical notes can contain untrusted instructions or copied text that acts like prompt injection. Treat retrieved text as data, not authority to override system safety rules. Test adversarial and accidental instructions, protect tools and data access, and ensure the model cannot execute unsafe actions without explicit controls. The full application includes retrieval, prompt assembly, model, post-processing, and user interface.

### Privacy and memorization risks

Language models may retain fragments from training data, especially for rare or repeated text. Membership inference and extraction risks depend on model and access. Avoid sending identifiable clinical text to an unapproved service. Use data minimization, de-identification where appropriate, access controls, encryption, and retention limits. De-identification should be evaluated for residual direct and quasi-identifiers.

Synthetic or generated notes are not automatically anonymous; they can reproduce rare combinations or memorized text. Use governance review before sharing. Logging prompts and outputs helps audit behavior but can create another sensitive dataset. Define retention, access, redaction, and incident response for logs.

## Human factors and responsibility

Generative interfaces can encourage automation bias: fluent prose appears authoritative, and users may review it less carefully. Make generated text visibly distinct from verified chart content. Cite source sections and expose uncertainty or missing context. Users should be able to edit, reject, or report errors, and the system should not silently enter orders or overwrite records.

Design responsibility and review to match risk. A note formatter may require spot checks; an abnormal-result recommendation needs qualified review before action. Evaluate whether clinicians can detect seeded errors and how review time changes. If the workload makes careful review unrealistic, the human oversight design is not safe merely because a clinician is nominally involved.

### Comparing models and versions fairly

Compare a transformer with simpler baselines such as keyword rules, regularized regression on structured features, or existing clinical scores. Use the same test cases and report paired uncertainty. Benchmark data should represent local language, abbreviations, and case mix. A general-purpose model’s public benchmark score may not estimate performance in the intended clinical workflow.

A provider update can change outputs without an application code change. Pin model versions when possible, retain representative regression tests, and rerun safety and quality evaluations after updates. Prompt templates, retrieval sources, and safety filters also require versioning. A “same model name” does not ensure identical behavior.

Thresholds and post-processing rules need separate validation. If a language model returns a confidence score or category, test calibration and consistency. If an output is converted to structured fields, evaluate extraction accuracy and error propagation. Evaluate end-to-end system behavior rather than reporting model API performance alone.

## Evaluating clinical value and harms

Potential benefits include faster documentation, improved information retrieval, and reduced missed findings. Potential harms include fabricated facts, omitted uncertainty, biased language, privacy breaches, and inappropriate reliance. Define outcomes before implementation: time saved, documentation errors, care delays, clinician workload, patient comprehension, and downstream clinical events.

A prospective impact study should compare the full system with usual practice. Randomized, stepped-wedge, or controlled observational designs may be appropriate depending on workflow and risk. Monitor not only average benefit but who gains or loses. A tool that accelerates documentation for one language group while increasing correction burden for another needs redesign.

### A reproducibility record

Archive model version, API parameters, prompt and examples, retrieval index version, source documents, post-processing, test cases, evaluation date, and governance approvals. Preserve input-output pairs only under privacy safeguards. Record clinician edits and error classifications in a way that supports audit without unnecessary exposure.

When reporting, distinguish errors due to model generation, missing or stale context, retrieval failure, interface design, and user action. This decomposition helps remediation. A model card should state supported population and tasks, contraindications, known failure patterns, monitoring owners, and update policy. Transparency is necessary for responsible use but does not substitute for validation.

### When not to use a transformer

A transformer may not be justified for small structured datasets, low-risk formatting tasks with simpler automation, or decisions that require a fully auditable deterministic rule. It may also be unsuitable when privacy controls, version pinning, source attribution, or meaningful human review cannot be provided. Compare simpler approaches and choose the least complex system that meets the validated need.

## Model and prompt uncertainty

For stochastic generation, estimate run-to-run variation on the same cases and distinguish output variability from correctness. For classification, use patient-level bootstrap intervals and assess calibration. Small manual review samples support qualitative error discovery but not precise estimates of rare unsafe outputs. Plan enough cases and targeted challenge examples for the consequences under study, and state the limits of reviewer capacity.

## References and further reading

- Lewis P, Perez E, Piktus A, et al. Retrieval-augmented generation for knowledge-intensive NLP tasks. *Advances in Neural Information Processing Systems*. 2020;33.
- Vaswani A, Shazeer N, Parmar N, et al. Attention is all you need. *Advances in Neural Information Processing Systems*. 2017;30.
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378).
- Moons KGM, Damen JAA, Kaul T, et al. PROBAST+AI. *BMJ*. 2025;388:e082505. [doi:10.1136/bmj-2024-082505](https://doi.org/10.1136/bmj-2024-082505).
- See [Recurrent neural networks](recurrent-neural-networks.html) for sequential health data.
