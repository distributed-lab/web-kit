export function hexToDecimal(chainHexOrId: string | number): number {
  if (Number.isInteger(chainHexOrId)) return Number(chainHexOrId)
  return parseInt(String(chainHexOrId), 16)
}
