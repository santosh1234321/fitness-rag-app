function findRelevantChunks(question, chunks) {
  const words = question.toLowerCase().split(" ");

  return chunks
    .map(chunk => {
      let score = 0;
      words.forEach(word => {
        if (chunk.toLowerCase().includes(word)) score++;
      });
      return { chunk, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(c => c.chunk);
}

module.exports = findRelevantChunks;
