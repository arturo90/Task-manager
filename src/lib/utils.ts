export function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}
