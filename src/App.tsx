function App() {
  return (
    <main className="page">
      <header className="header">
        <h1>Varun Soni</h1>
        <p className="tagline">
          zookeeper of neurons
        </p>
      </header>

      <hr className="rule" />

      <div className="timeline">
        <article className="entry">
          <div className="years">2024 - 2026</div>
          <div>
            <p>
              ML Engineer / Research Assistant at{' '}
              <a
                href="https://www.izfp.fraunhofer.de/"
                target="_blank"
                rel="noreferrer"
              >
                Fraunhofer IZFP
              </a>
              , Saarbrücken. Built a novel approach to predict ultrasound weld quality from acoustic emission signals using machine learning. {/*Physically collected acoustic emission signals (~200+ GB), converted them to RGB spectrograms via STFT, and trained ResNet-18, EfficientNet, and a Vision Transformer on ~400 labelled specimens.
            </p>
            <p>
              Recommended EfficientNet for production deployment — 97% accuracy,
              F1 = 0.97, 5M parameters, lower variance than ViT with ~80% fewer
              parameters. Tracked experiments with MLflow, used Docker for
              reproducibility, and presented results to research supervisors.*/}
            </p>
          </div>
        </article>

        <article className="entry">
          <div className="years">2021 - 2026</div>
          <div>
            <p>
              M.Sc. Data Science and Artificial Intelligence at{' '}
              <a href="https://www.uni-saarland.de/" target="_blank" rel="noreferrer">
                Universität des Saarlandes
              </a>
              , Saarbrücken.
            </p>
            <p>
              Thesis:{' '}
              <em>
                Acoustic Emission Analysis in Ultrasound Welding using Machine
                Learning
              </em>{' '}
              (Fraunhofer IZFP), supervised by Prof. Dr.-Ing. Hans-Georg
              Herrmann, Prof. Dr. Dietrich Klakow, and Dr.-Ing. Bernd Wolter.
            </p>
          </div>
        </article>

        <article className="entry">
          <div className="years">2019</div>
          <div>
            <p>
              Development intern at Reliance Corporate IT Park, Mumbai.
              Contributed to an internal e-portal using MEAN stack.
            </p>
          </div>
        </article>

        <article className="entry">
          <div className="years">2018 - 2019</div>
          <div>
            <p>
              Eduvance Industrial IoT programme; built a sensor data pipeline in Python that read GPIO inputs and published readings to an MQTT broker.
            </p>
          </div>
        </article>

        <article className="entry">
          <div className="years">2017  2021</div>
          <div>
            <p>
              B.E. Computer Engineering at Don Bosco Institute of
              Technology, Mumbai (GPA 9.15 / 10). Final-year project: generative
              speech system (English → Hindi) via encoder-decoder NMT and TTS.
            </p>
          </div>
        </article>
      </div>

      <section className="section">
        <h2>bio</h2>
        <p>
          machine learning researcher working on computer vision
          and industrial quality control. most recently built a novel system that predicts ultrasound weld quality from acoustic emission signals using three state-of-the-art architectures. acoustic emission signals are non-destructive, cheap, and suitable for production. finished with an M.Sc. in Data
          Science and AI at Saarland University.
        </p>
      </section>

      <section className="section">
        <h2>thesis</h2>
        <div className="pub">
          <span className="pub-title">
            Acoustic Emission Analysis in Ultrasound Welding
          </span>
          <span className="pub-meta">
            M.Sc. thesis · Universität des Saarlandes / Fraunhofer IZFP · 2026
          </span>
          <p className="pub-body">
            Ultrasound welding joins dissimilar metals (e.g. Al/Cu tabs) under
            high-frequency vibration and pressure. Quality checks usually rely
            on destructive tensile/shear tests. This work instead uses acoustic
            emission signals recorded during welding: raw amplitude-time traces
            (~500 MB each) are turned into compact RGB spectrograms via
            short-time Fourier transforms, then classified as weld success or
            failure.
          </p>
          <p>
            Three ImageNet-pretrained architectures were compared — ResNet-18,
            EfficientNet-B0, and ViT. EfficientNet matched ViT statistically
            (McNemar, α = 0.05) while staying more stable in training (0.5%
            variance) and far cheaper (5M vs 22M parameters), making it the
            recommendation for industrial deployment. Failed welds tend to show
            shorter duration, spectral broadening, and irregular intensity —
            patterns the models pick up from the spectrograms.
          </p>
        </div>
      </section>

      <section className="section">
        <h2>projects</h2>
        <ul>
          <li>
            <span className="project-title">
              T.U.E.S.D.A.Y. — Automatic Voice Dubbing
            </span>
            <br />
            End-to-end generative speech pipeline: ASR → neural machine
            translation → TTS. Attention-based encoder-decoder on a parallel
            English–Hindi corpus (TensorFlow / Seq2Seq).
          </li>
          <li>
            <span className="project-title">
              Semantic Similarity via Bi-Encoders
            </span>
            <br />
            Fine-tuned BERT sentence embeddings for semantic similarity on the
            SICK benchmark; outperformed a BiLSTM baseline (PyTorch / Hugging
            Face).
          </li>
        </ul>
      </section>

      <section className="section">
        <h2>elsewhere</h2>
        <div className="links">
          <a href="mailto:varunsoni1402@gmail.com">email</a>
          <a
            href="https://github.com/lvzer"
            target="_blank"
            rel="noreferrer"
          >
            github
          </a>
          <a
            href="https://linkedin.com/in/varunsoniii"
            target="_blank"
            rel="noreferrer"
          >
            linkedin
          </a>
        </div>
      </section>
    </main>
  )
}

export default App
