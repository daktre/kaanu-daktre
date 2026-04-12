import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"

export default (() => {
  const Footer: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>
          Built with <a href="https://quartz.jzhao.xyz/">Quartz v{version}</a> and tended in <a href="https://obsidian.md">Obsidian</a>. © {year}
        </p>
        <p>
          Unless noted otherwise, all original content here is open knowledge — free to read, share, and build upon with attribution. Where we have drawn on others' work, we have tried to acknowledge it; if we have fallen short, do write to us at hello AT daktre DOT com.
        </p>
        <p>
          Part of the <a href="https://daktre.com">daktre.com</a> web.
        </p>
      </footer>
    )
  }
  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
