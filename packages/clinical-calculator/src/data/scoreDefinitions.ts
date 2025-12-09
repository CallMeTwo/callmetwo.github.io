// Clinical Scoring Systems Data

export interface SelectOption {
  value: number
  label: string
}

export interface Variable {
  id: string
  label: string
  type: 'checkbox' | 'select'
  points?: number
  description?: string
  options?: SelectOption[]
}

export interface Interpretation {
  range: [number, number]
  category: string
  color: string
  recommendation: string
}

export interface ScoringSystem {
  id: string
  name: string
  description: string
  variables: Variable[]
  calculate: (values: Record<string, number | boolean>) => number
  interpretations: Interpretation[]
}

export const scoringSystems: Record<string, ScoringSystem> = {
  wells: {
    id: 'wells',
    name: 'Wells Score (Pulmonary Embolism Risk)',
    description: 'Assesses the pretest probability of pulmonary embolism',
    variables: [
      {
        id: 'dvt_signs',
        label: 'Clinical signs of deep vein thrombosis',
        type: 'checkbox',
        points: 3,
        description: 'Swelling, pain on palpation of deep veins'
      },
      {
        id: 'pe_likely',
        label: 'PE is the most likely diagnosis',
        type: 'checkbox',
        points: 3,
        description: 'Clinical judgment'
      },
      {
        id: 'heart_rate',
        label: 'Heart rate > 100 bpm',
        type: 'checkbox',
        points: 1.5,
        description: 'Tachycardia'
      },
      {
        id: 'immobilization',
        label: 'Immobilization ≥ 3 days or surgery in past 4 weeks',
        type: 'checkbox',
        points: 1.5,
        description: 'Recent immobility'
      },
      {
        id: 'dvt_pe_history',
        label: 'History of DVT or PE',
        type: 'checkbox',
        points: 1.5,
        description: 'Previous thromboembolism'
      },
      {
        id: 'hemoptysis',
        label: 'Hemoptysis',
        type: 'checkbox',
        points: 1,
        description: 'Coughing up blood'
      },
      {
        id: 'malignancy',
        label: 'Malignancy (active)',
        type: 'checkbox',
        points: 1,
        description: 'Active cancer'
      }
    ],
    calculate: (values) => {
      return Object.values(values).reduce((sum, val) => {
        return sum + (val ? 1 : 0);
      }, 0);
    },
    interpretations: [
      { range: [0, 2], category: 'Low Risk', color: '#28a745', recommendation: 'D-dimer may not be needed' },
      { range: [2, 6], category: 'Intermediate Risk', color: '#ffc107', recommendation: 'D-dimer or CT angiography recommended' },
      { range: [6, Infinity], category: 'High Risk', color: '#dc3545', recommendation: 'CT angiography or V/Q scan recommended' }
    ]
  },

  alvarado: {
    id: 'alvarado',
    name: 'Alvarado Score (Appendicitis Diagnosis)',
    description: 'Helps diagnose acute appendicitis',
    variables: [
      {
        id: 'migration_pain',
        label: 'Migration of pain to right iliac fossa',
        type: 'checkbox',
        points: 1,
        description: 'Pain moves from periumbilical to RLQ'
      },
      {
        id: 'anorexia',
        label: 'Anorexia',
        type: 'checkbox',
        points: 1,
        description: 'Loss of appetite'
      },
      {
        id: 'nausea_vomiting',
        label: 'Nausea or vomiting',
        type: 'checkbox',
        points: 1,
        description: 'Gastrointestinal symptoms'
      },
      {
        id: 'rlq_pain',
        label: 'Right lower quadrant tenderness',
        type: 'checkbox',
        points: 2,
        description: 'Localized abdominal tenderness'
      },
      {
        id: 'rebound_tenderness',
        label: 'Rebound tenderness',
        type: 'checkbox',
        points: 1,
        description: 'Pain on release of pressure'
      },
      {
        id: 'elevated_temperature',
        label: 'Elevated temperature (≥37.3°C)',
        type: 'checkbox',
        points: 1,
        description: 'Fever'
      },
      {
        id: 'elevated_wbc',
        label: 'Elevated WBC (>10,000)',
        type: 'checkbox',
        points: 2,
        description: 'White blood cell count'
      },
      {
        id: 'left_shift',
        label: 'Left shift in WBC (>75%)',
        type: 'checkbox',
        points: 1,
        description: 'Increased immature neutrophils'
      }
    ],
    calculate: (values) => {
      let score = 0;
      const pointMap: Record<string, number> = {
        migration_pain: 1,
        anorexia: 1,
        nausea_vomiting: 1,
        rlq_pain: 2,
        rebound_tenderness: 1,
        elevated_temperature: 1,
        elevated_wbc: 2,
        left_shift: 1
      };
      Object.keys(values).forEach(key => {
        if (values[key]) score += pointMap[key];
      });
      return score;
    },
    interpretations: [
      { range: [0, 4], category: 'Low Probability', color: '#28a745', recommendation: 'Appendicitis unlikely' },
      { range: [5, 6], category: 'Intermediate Probability', color: '#ffc107', recommendation: 'Further imaging recommended' },
      { range: [7, 10], category: 'High Probability', color: '#dc3545', recommendation: 'Appendicitis likely, consider surgery' }
    ]
  },

  child: {
    id: 'child',
    name: 'Child-Pugh Score (Liver Disease Severity)',
    description: 'Assesses severity of chronic liver disease',
    variables: [
      {
        id: 'bilirubin',
        label: 'Serum Bilirubin (mg/dL)',
        type: 'select',
        options: [
          { value: 1, label: '< 1.4' },
          { value: 2, label: '1.4 - 2.8' },
          { value: 3, label: '> 2.8' }
        ],
        description: 'Liver function'
      },
      {
        id: 'albumin',
        label: 'Serum Albumin (g/dL)',
        type: 'select',
        options: [
          { value: 1, label: '> 3.5' },
          { value: 2, label: '2.8 - 3.5' },
          { value: 3, label: '< 2.8' }
        ],
        description: 'Protein synthesis'
      },
      {
        id: 'inr',
        label: 'INR (Prothrombin Time)',
        type: 'select',
        options: [
          { value: 1, label: '< 1.7' },
          { value: 2, label: '1.7 - 2.3' },
          { value: 3, label: '> 2.3' }
        ],
        description: 'Clotting function'
      },
      {
        id: 'ascites',
        label: 'Ascites',
        type: 'select',
        options: [
          { value: 1, label: 'None' },
          { value: 2, label: 'Mild' },
          { value: 3, label: 'Moderate to Severe' }
        ],
        description: 'Fluid accumulation'
      },
      {
        id: 'encephalopathy',
        label: 'Hepatic Encephalopathy',
        type: 'select',
        options: [
          { value: 1, label: 'None' },
          { value: 2, label: 'Grade 1-2' },
          { value: 3, label: 'Grade 3-4' }
        ],
        description: 'Mental status'
      }
    ],
    calculate: (values) => {
      return Object.values(values).reduce((sum, val) => sum + ((val as number) || 0), 0);
    },
    interpretations: [
      { range: [5, 6], category: 'Class A (Well-compensated)', color: '#28a745', recommendation: '10-year survival: 45%' },
      { range: [7, 9], category: 'Class B (Moderately decompensated)', color: '#ffc107', recommendation: '10-year survival: 16%' },
      { range: [10, 15], category: 'Class C (Decompensated)', color: '#dc3545', recommendation: '10-year survival: 4%' }
    ]
  }
};
