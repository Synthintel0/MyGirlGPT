import { split } from 'sentence-splitter'

/**
 *
 * @param text
 * @param limit Limit the length of each section to 50 words by default.
 */
export const splitParagraphToShorterParts = (text: string, limit = 50) => {
  const parts = split(text)
  const sentences = parts
    .filter((p) => p.type === 'Sentence')
    .reduce<string[]>((r, v) => {
      r.push(v.raw)
      return r
    }, [])

  const result: string[] = []
  let currentParagraph = ''
  let currentTotalWordCount = 0
  sentences.forEach((sentence, i) => {
    const wordCount = sentence.split(' ').length
    if (currentTotalWordCount + wordCount < limit) {
      currentParagraph += sentence
      currentTotalWordCount += wordCount
    } else {
      result.push(currentParagraph)
      currentParagraph = sentence
      currentTotalWordCount = wordCount
    }
    if (i === sentences.length - 1) {
      result.push(currentParagraph)
    }
  })
  return result
}
