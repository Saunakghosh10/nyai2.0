export function preprocessDocument(text: string): string {
  // Simplified preprocessing for faster processing
  return text
    .replace(/\s+/g, ' ')
    .replace(/[\r\n]+/g, '\n')
    .trim()
    .slice(0, 4000); // Limit context size for faster processing
}

export function extractRelevantContext(fullText: string, question: string): string {
  // Simplified context extraction
  const sentences = fullText.split(/[.!?]+/);
  const questionWords = new Set(question.toLowerCase().split(/\W+/));
  
  // Quick relevance check using Set for faster lookups
  const relevantSentences = sentences.filter(sentence => {
    const words = new Set(sentence.toLowerCase().split(/\W+/));
    return Array.from(questionWords).some(word => words.has(word));
  });

  return relevantSentences.slice(0, 5).join('. ') + '.';
} 