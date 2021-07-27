/**
 * Sets A value in Local Storage
 * @param name
 * @param value
 */
export function setItem(name: string, value: string): void {
  localStorage.setItem(name, value)
}
/**
 * Gets A value from Local Storage
 * @param name
 */
export function getItem(name: string): string {
  const value = localStorage.getItem(name)
  return typeof value === "string" ? value : ""
}
