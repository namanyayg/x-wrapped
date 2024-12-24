export const getWordEquivalency = (wordCount: number): string => {
  if (wordCount >= 100000) {
    return `${(wordCount / 100000).toFixed(1)} novels`;
  } else if (wordCount >= 2000) {
    return `${(wordCount / 2000).toFixed(1)} essays`;
  }
  return `${(wordCount / 250).toFixed(1)} blog posts`;
};

export const getEngagementEquivalency = (count: number): string => {
  if (count >= 50000) {
    return `${(count / 50000).toFixed(1)} stadium crowds`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)} concert venues`;
  } else if (count >= 100) {
    return `${(count / 20).toFixed(1)} school buses`;
  }
  return `many people in a room`;
}; 