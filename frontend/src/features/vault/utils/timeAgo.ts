export function formatTimeAgo(isoString: string): string {
  if (!isoString) return "";
  try {
    const ms = Date.now() - new Date(isoString).getTime();
    if (isNaN(ms)) return "niedawno";
    const mins = Math.floor(ms / 60000);
    if (mins < 1) return "przed chwilą";
    if (mins < 60) return `${mins} min temu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} godz. temu`;
    const days = Math.floor(hours / 24);
    if (days === 1) return "wczoraj";
    return `${days} dni temu`;
  } catch (e) {
    return "niedawno";
  }
}
