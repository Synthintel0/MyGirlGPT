import * as HTMLParser from 'node-html-parser'
import showdown from 'showdown'

const showdownConverter = new showdown.Converter()

export const beautifyMarkdown = (content: string): string => {
  // markdown to html
  const htmlContent = showdownConverter
    .makeHtml(content)
    .replaceAll(/<strong>/g, '')
    .replaceAll(/<\/strong>/g, '')
    .replaceAll(/<em>/g, '\n\n<i>')
    .replaceAll(/\<\/em\>\s*/g, '</i>\n\n')

  // modify html
  const html1 = HTMLParser.parse(htmlContent).firstChild as HTMLParser.HTMLElement
  const html2 = HTMLParser.parse('<p></p>').firstChild as HTMLParser.HTMLElement
  html1.childNodes.forEach((node) => {
    if (node.nodeType === HTMLParser.NodeType.TEXT_NODE) {
      const b = HTMLParser.parse('<b></b>').firstChild as HTMLParser.HTMLElement
      b.appendChild(node)
      html2.appendChild(b)
    } else {
      html2.appendChild(node)
    }
  })

  // html to markdown
  return html2
    .toString()
    .replaceAll(/<p>/g, '')
    .replaceAll(/<\/p>/g, '')
    .replaceAll(/<i>/g, '_')
    .replaceAll(/<\/i>/g, '_')
    .replaceAll(/<b>/g, '*')
    .replaceAll(/<\/b>/g, '*')
}
