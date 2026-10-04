---
title: Transformers for health data
summary: An introduction to attention-based sequence models for clinical text, codes, and time series, with cautions about scale and evaluation.
---

## Overview and key ideas

Transformers represent a sequence as vectors and use **self-attention** so each position can combine information from other positions. Positional information is added because attention alone does not encode order. Unlike a recurrent network, attention can process many positions in parallel during training, though computation and memory can grow rapidly with sequence length. Transformer encoders are often used for representation or classification; decoder-style models predict subsequent tokens; encoder-decoder designs map one sequence to another.

In health data, inputs may be clinical text, coded events, laboratory sequences, or images converted into patches. A pretrained model can transfer representations, but domain adaptation does not guarantee clinical validity. A language model’s fluent output is not evidence that a generated statement is true.

## When to use it

Transformers are candidates when long-range relationships in text or event sequences matter, when a relevant pretrained model exists, or when multimodal representation is needed. Examples include classifying discharge summaries or summarizing a longitudinal record for clinician review. For small structured cohorts, compare against simpler models; task-specific transformer training often needs substantial data and compute.

## Assumptions and limitations

- Tokenization, sequence truncation, temporal encoding, and missingness handling shape what the model can learn. State what context was available at prediction time.
- Pretraining corpora can contain duplicates, future information, or population-specific language. Patient privacy and data-use constraints apply.
- Attention weights are not automatically explanations of model decisions. Generated text can be plausible but unsupported, omit uncertainty, or invent facts.
- Evaluation must be patient-level and preferably external or temporal. Leakage can occur through near-duplicate notes, repeated patients, or target-derived text.
- Assess calibration for predicted risks, subgroup performance, robustness, privacy, and human factors. A benchmark score alone is not evidence of improved care.

## Worked example

A team classifies discharge summaries for a documented medication-related harm. The cohort contains 10,000 admissions, with 500 positive labels. If notes from a patient appear in both training and test sets, the model may recognize templates or copied phrases. Split by patient and time; make sure the note was finalized by the intended decision time. On a later cohort of 2,000 admissions with 100 positive labels, suppose sensitivity is 82/100 = 82% and 190 of 1,900 negatives are flagged, giving specificity 90% and PPV 82/(82+190) ≈ 30.1%. Review false positives and false negatives with clinicians, check site and demographic subgroups, and determine whether the label itself reflects a reliable clinical definition before considering workflow use.

## Interpretation and common pitfalls

- Define whether the task is classification, extraction, forecasting, or generation; evaluate the output that will actually be used.
- Compare with existing rules and human workflow under the same test population. Use confidence intervals and external data.
- For generated clinical text, check factual consistency against source records and require appropriate human review; do not evaluate only readability.
- Do not treat model attention, embeddings, or token scores as causal explanations or validated clinical reasoning.
- Report data sources, model version, prompts or fine-tuning, exclusions, and safeguards. TRIPOD+AI is relevant to prediction studies, while other task-specific reporting guidance may apply.

## References and further reading

- Vaswani A, Shazeer N, Parmar N, et al. Attention is all you need. *Advances in Neural Information Processing Systems*. 2017;30. [NeurIPS proceedings](https://papers.nips.cc/paper/7181-attention-is-all-you-need)
- Rajkomar A, Oren E, Chen K, et al. Scalable and accurate deep learning with electronic health records. *npj Digital Medicine*. 2018;1:18. [doi:10.1038/s41746-018-0029-1](https://doi.org/10.1038/s41746-018-0029-1)
- Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement. *BMJ*. 2024;385:e078378. [doi:10.1136/bmj-2023-078378](https://doi.org/10.1136/bmj-2023-078378)
