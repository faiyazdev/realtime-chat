export function formatNumber(num: number) {
  return Intl.NumberFormat("en-US", {
    minimumIntegerDigits: 2,
  }).format(num);
}

// number to minutes and seconds

export function formatTime(time: number | null) {
  if (time === null) return "--:--";
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${formatNumber(minutes)}:${formatNumber(seconds)}`;
}

console.log(formatNumber(2));
