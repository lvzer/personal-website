import { Controls, type Theme } from '../Controls'
import { site, type SiteVersion } from '../content'
import { Inline } from '../Inline'

type Props = {
  theme: Theme
  version: SiteVersion
  onToggleTheme: () => void
  onSetVersion: (version: SiteVersion) => void
}

export function ClassicView({
  theme,
  version,
  onToggleTheme,
  onSetVersion,
}: Props) {
  return (
    <main className="page">
      <header className="header">
        <h1>{site.name}</h1>
        <p className="tagline">{site.tagline}</p>
      </header>

      <hr className="rule" />

      <section className="section">
        <h2>bio</h2>
        <p>{site.bio}</p>
      </section>

      <div className="timeline">
        {site.timeline.map((entry) => (
          <article key={entry.years} className="entry">
            <div className="years">{entry.years}</div>
            <div>
              {entry.paragraphs.map((parts, i) => (
                <p key={i}>
                  <Inline parts={parts} />
                </p>
              ))}
            </div>
          </article>
        ))}
      </div>

      <section className="section">
        <h2>thesis</h2>
        <div className="pub">
          <span className="pub-title">{site.thesis.title}</span>
          <span className="pub-meta">
            {site.thesis.metaBefore}
            <a
              href={site.thesis.github.href}
              target="_blank"
              rel="noreferrer"
            >
              {site.thesis.github.label}
            </a>
          </span>
          {site.thesis.paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? 'pub-body' : undefined}>
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>projects</h2>
        <ul>
          {site.projects.map((project) => (
            <li key={project.title}>
              <span className="project-title">{project.title}</span>
              <br />
              {project.body}
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h2>extras</h2>
        <div className="extras-row">
          <div className="links">
            {site.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external
                  ? { target: '_blank', rel: 'noreferrer' }
                  : {})}
              >
                {link.label}
              </a>
            ))}
          </div>
          <Controls
            theme={theme}
            version={version}
            onToggleTheme={onToggleTheme}
            onSetVersion={onSetVersion}
            className="view-controls"
          />
        </div>
      </section>
    </main>
  )
}
