export function getProgressColor(percentage: number): string {
  if (percentage <= 50) {
    return "linear-gradient(90deg, #c4ff61 0%, #c4ff61 100%)";
  } else if (percentage <= 70) {
    return "linear-gradient(90deg, #c4ff61 50%, #F1B44D 100%)";
  } else {
    return "linear-gradient(90deg, #c4ff61 0%, #F1B44D 50%, #FF6767 100%)";
  }
}

export function truncateText(
  text: string | undefined,
  maxLength: number
): string {
  if (!text) return "";
  if (text.length > maxLength) {
    return text.slice(0, maxLength).trimEnd() + "...";
  }
  return text;
}
