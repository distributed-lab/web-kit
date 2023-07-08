export const isHex = (value: string): boolean => {
  return /^0x[0-9a-f]+$/i.test(value)
}
