export type InlinePart =
  | string
  | { type: 'link'; href: string; label: string }
  | { type: 'em'; text: string }

export type Project = {
  title: string
  body: string
}

export type LinkRef = { href: string; label: string; external?: boolean }

export type SiteVersion = 'classic' | 'three' | 'terminal'

export function flattenInline(parts: InlinePart[]): string {
  return parts
    .map((p) => {
      if (typeof p === 'string') return p
      if (p.type === 'em') return p.text
      return p.label
    })
    .join('')
}

export const site = {
  name: 'Varun Soni',
  tagline: 'zookeeper of neurons',
  bio: 'machine learning researcher working on sensor data, computer vision, and industrial quality control. most recently built a novel system that predicts ultrasound weld quality from acoustic emission signals using three SOtA architectures. finished with an M.Sc. in Data Science and AI at Saarland University.',
  timeline: [
    {
      years: '2024 - 2026',
      paragraphs: [
        [
          'ML Researcher / Research Assistant at ',
          {
            type: 'link' as const,
            href: 'https://www.izfp.fraunhofer.de/',
            label: 'Fraunhofer IZFP',
          },
          ', Saarbrücken. Built a novel approach to predict ultrasound weld quality from acoustic emissions using machine learning.',
        ],
      ],
    },
    {
      years: '2021 - 2026',
      paragraphs: [
        [
          'M.Sc. Data Science and Artificial Intelligence at ',
          {
            type: 'link' as const,
            href: 'https://www.uni-saarland.de/',
            label: 'Universität des Saarlandes',
          },
          ', Saarbrücken.',
        ],
        [
          'Thesis: ',
          {
            type: 'em' as const,
            text: 'Acoustic Emission Analysis in Ultrasound Welding using Machine Learning',
          },
          ' (Fraunhofer IZFP), supervised by Prof. Dr.-Ing. Hans-Georg Herrmann, Prof. Dr. Dietrich Klakow, and Dr.-Ing. Bernd Wolter.',
        ],
      ],
    },
    {
      years: '2019',
      paragraphs: [
        [
          'Development intern at Reliance Corporate IT Park, Mumbai. Contributed to an internal e-portal using MEAN stack.',
        ],
      ],
    },
    {
      years: '2018 - 2019',
      paragraphs: [
        [
          'Eduvance Industrial IoT programme; built a sensor data pipeline in Python that read GPIO inputs and published readings to an MQTT broker.',
        ],
      ],
    },
    {
      years: '2017 - 2021',
      paragraphs: [
        [
          'B.E. Computer Engineering, Mumbai University (GPA 9.15 / 10). Final-year project: generative speech system (English → Hindi) via encoder-decoder ASR, NMT, and TTS.',
        ],
      ],
    },
  ],
  thesis: {
    title: 'Acoustic Emission Analysis in Ultrasound Welding',
    metaBefore:
      'M.Sc. thesis · Universität des Saarlandes / Fraunhofer IZFP · 2026 · ',
    github: {
      href: 'https://github.com/lvzer/UWA',
      label: 'github',
    },
    paragraphs: [
      'Ultrasound welding joins dissimilar metals (e.g. Al/Cu tabs) under high-frequency vibration and pressure. Quality control usually relies on destructive tensile/shear tests. This work instead uses acoustic emission signals recorded during welding: raw amplitude-time traces (~500 MB each) are turned into compact RGB spectrograms via short-time Fourier transforms, then manually labelled as successes or failures.',
      "3 ImageNet-pretrained architectures were compared: ResNet-18, EfficientNet_b0, and ViT. EfficientNet matched ViT statistically (acc. to McNemar's test, α = 0.05) while staying more stable in training (0.5% variance) and far cheaper (5M vs 22M parameters), making it the recommendation for industrial deployment. Common patterns that the models tend to pick up on are shorter duration, spectral broadening, and irregular intensity.",
    ],
  },
  projects: [
    {
      title: 'T.U.E.S.D.A.Y. — Automatic Voice Dubbing',
      body: 'End-to-end generative speech pipeline: ASR → NMT → TTS. Attention-based encoder-decoder on a parallel English-Hindi corpus (TensorFlow / Seq2Seq). Responsible for the ASR component of the pipeline.',
    },
    {
      title: 'Semantic Similarity via Bi-Encoders',
      body: 'Fine-tuned BERT sentence embeddings for semantic similarity on the SICK benchmark; outperformed a BiLSTM baseline (PyTorch / Hugging Face).',
    },
  ] satisfies Project[],
  links: [
    { href: 'mailto:varunsoni1402@gmail.com', label: 'email' },
    { href: 'https://github.com/lvzer', label: 'github', external: true },
    {
      href: 'https://linkedin.com/in/varunsoniii',
      label: 'linkedin',
      external: true,
    },
  ] satisfies LinkRef[],
}

export const VERSION_ORDER: SiteVersion[] = ['classic', 'three', 'terminal']

export const VERSION_LABEL: Record<SiteVersion, string> = {
  classic: 'classic',
  three: '3d',
  terminal: 'term',
}
