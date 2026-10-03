export interface TopicGroup {
  title: string
  topics: string[]
}

export interface TopicSection {
  id: string
  title: string
  description: string
  groups: TopicGroup[]
}

// A starting taxonomy for the prototype, not an exhaustive syllabus.
// Article content will be added separately after the structure is reviewed.
export const sections: TopicSection[] = [
  {
    id: 'foundations', title: 'Foundations', description: 'The language of data and statistical thinking.',
    groups: [
      { title: 'Getting started', topics: ['What is biostatistics?', 'Populations and samples', 'Parameters and statistics'] },
      { title: 'Understanding variables', topics: ['Categorical and numerical data', 'Scales of measurement', 'Data quality and coding'] }
    ]
  },
  {
    id: 'describing-data', title: 'Describing & visualizing data', description: 'Turn observations into useful summaries.',
    groups: [
      { title: 'Descriptive statistics', topics: ['Mean, median and mode', 'Variance and standard deviation', 'Quantiles and the interquartile range'] },
      { title: 'Exploring distributions', topics: ['Frequency tables', 'Histograms and box plots', 'Scatter plots and relationships'] }
    ]
  },
  {
    id: 'probability', title: 'Probability & distributions', description: 'A framework for randomness and uncertainty.',
    groups: [
      { title: 'Probability essentials', topics: ['Probability rules', 'Conditional probability and independence', 'Bayes’ theorem'] },
      { title: 'Common distributions', topics: ['Binomial and Poisson distributions', 'Normal distribution', 'Sampling distributions and the central limit theorem'] }
    ]
  },
  {
    id: 'study-design', title: 'Study design & sampling', description: 'Connect the research question to the data you collect.',
    groups: [
      { title: 'Designing a study', topics: ['Cross-sectional studies', 'Cohort and case-control studies', 'Randomized controlled trials'] },
      { title: 'Planning and validity', topics: ['Sampling methods', 'Bias and confounding', 'Sample size and statistical power'] }
    ]
  },
  {
    id: 'inference', title: 'Statistical inference', description: 'Estimate effects and reason about evidence.',
    groups: [
      { title: 'Estimation', topics: ['Point estimates and standard errors', 'Confidence intervals', 'Effect sizes'] },
      { title: 'Hypothesis testing', topics: ['Null and alternative hypotheses', 'P-values and significance levels', 'Type I and Type II errors', 'Multiple testing'] }
    ]
  },
  {
    id: 'comparisons', title: 'Comparing groups', description: 'Find methods for different outcomes and study designs.',
    groups: [
      { title: 'Numerical outcomes', topics: ['Independent and paired t-tests', 'Analysis of variance (ANOVA)', 'Mann–Whitney and Wilcoxon tests', 'Kruskal–Wallis test'] },
      { title: 'Categorical outcomes', topics: ['Chi-square test', 'Fisher’s exact test', 'McNemar’s test'] }
    ]
  },
  {
    id: 'regression', title: 'Correlation & regression', description: 'Explore associations and build statistical models.',
    groups: [
      { title: 'Associations and models', topics: ['Pearson and Spearman correlation', 'Simple and multiple linear regression', 'Logistic regression', 'Poisson and negative binomial regression'] },
      { title: 'Working with models', topics: ['Model assumptions and diagnostics', 'Interaction and effect modification', 'Model validation and overfitting'] }
    ]
  },
  {
    id: 'survival', title: 'Survival & longitudinal data', description: 'Work with time to events and repeated observations.',
    groups: [
      { title: 'Time-to-event analysis', topics: ['Censoring and survival functions', 'Kaplan–Meier curves and the log-rank test', 'Cox proportional hazards model'] },
      { title: 'Repeated measurements', topics: ['Repeated-measures designs', 'Mixed-effects models', 'Generalized estimating equations'] }
    ]
  },
  {
    id: 'clinical-research', title: 'Clinical research & evidence', description: 'Organize methods used to evaluate health evidence.',
    groups: [
      { title: 'Risk and diagnostic accuracy', topics: ['Risk ratios and odds ratios', 'Absolute risk differences', 'Sensitivity, specificity and predictive values', 'ROC curves and AUC'] },
      { title: 'Evidence synthesis', topics: ['Systematic reviews', 'Meta-analysis and forest plots', 'Heterogeneity and publication bias'] }
    ]
  },
  {
    id: 'practice', title: 'Statistical practice', description: 'Make analyses transparent, reproducible and useful.',
    groups: [
      { title: 'Further methods', topics: ['Missing data and imputation', 'Bootstrap and permutation methods', 'Introduction to Bayesian inference'] },
      { title: 'From analysis to reporting', topics: ['Statistical analysis plans', 'Reproducible workflows', 'Reporting and interpreting results'] }
    ]
  }
]

export const topicCount = sections.reduce((total, section) =>
  total + section.groups.reduce((count, group) => count + group.topics.length, 0), 0)

export function filterSections(query: string): TopicSection[] {
  const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean)
  if (!terms.length) return sections
  return sections.map(section => ({
    ...section,
    groups: section.groups.map(group => ({
      ...group,
      topics: group.topics.filter(topic => {
        const text = `${section.title} ${group.title} ${topic}`.toLocaleLowerCase()
        return terms.every(term => text.includes(term))
      })
    })).filter(group => group.topics.length > 0)
  })).filter(section => section.groups.length > 0)
}
