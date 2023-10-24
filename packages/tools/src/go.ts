export const go = async <C extends () => unknown, E = Error>(
  cb: C,
): Promise<[E | null, Awaited<ReturnType<C>> | null]> => {
  try {
    const res = await cb()
    return [null, res as Awaited<ReturnType<C>>]
  } catch (e) {
    return [e as E, null]
  }
}
