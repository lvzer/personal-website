import { Controls, type Theme } from '../Controls'
import { flattenInline, site, type SiteVersion } from '../content'

type Props = {
  theme: Theme
  version: SiteVersion
  onToggleTheme: () => void
  onSetVersion: (version: SiteVersion) => void
}

function Prompt({ path = '~' }: { path?: string }) {
  return (
    <div className="term-prompt-line">
      <span className="term-user">varun@soni</span>
      <span className="term-sep">:</span>
      <span className="term-path">{path}</span>
      <span className="term-dollar">$</span>
    </div>
  )
}

export function TerminalView({
  theme,
  version,
  onToggleTheme,
  onSetVersion,
}: Props) {
  return (
    <main className="term-page" data-term-theme={theme}>
      <div className="term-window">
        <div className="term-titlebar">
          <span className="term-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="term-title">varun@soni — zsh — 80x24</span>
        </div>

        <div className="term-body">
          <Prompt />
          <p className="term-cmd">whoami</p>
          <p className="term-out">
            {site.name}
            <br />
            <span className="term-muted">{site.tagline}</span>
          </p>

          <Prompt />
          <p className="term-cmd">cat bio.txt</p>
          <p className="term-out">{site.bio}</p>

          <Prompt />
          <p className="term-cmd">ls -l timeline/</p>
          <div className="term-out term-timeline">
            {site.timeline.map((entry) => (
              <div key={entry.years} className="term-entry">
                <span className="term-years">{entry.years}</span>
                {entry.paragraphs.map((parts, i) => (
                  <p key={i}>{flattenInline(parts)}</p>
                ))}
              </div>
            ))}
          </div>

          <Prompt path="~/thesis" />
          <p className="term-cmd">head -n 40 README.md</p>
          <div className="term-out">
            <p className="term-heading"># {site.thesis.title}</p>
            <p className="term-muted">
              {site.thesis.metaBefore}
              <a href={site.thesis.github.href} target="_blank" rel="noreferrer">
                {site.thesis.github.label}
              </a>
            </p>
            {site.thesis.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <Prompt />
          <p className="term-cmd">cat projects.log</p>
          <div className="term-out">
            {site.projects.map((project) => (
              <p key={project.title}>
                <span className="term-heading">{project.title}</span>
                <br />
                {project.body}
              </p>
            ))}
          </div>

          <Prompt />
          <p className="term-cmd">./contact.sh</p>
          <div className="term-out term-extras">
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

          <Prompt />
          <p className="term-cmd term-active">
            <span className="term-cursor" aria-hidden="true" />
          </p>
        </div>
      </div>
    </main>
  )
}
