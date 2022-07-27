/** Shared properties for all data entered by the user. */
export type DataRecord = {
  id: string;
  createdAt: number;
  updatedAt: number;
};

/** Returns a new, somewhat random ID. */
export function id(): string {
  return Math.floor(Math.random() * 10 ** 16)
    .toString()
    .padStart(16, "0");
}

/**
 * Reads and parses JSON stored in the localStorage item specified by the
 * provided key. Returns `null` instead of throwing an exception if anything
 * goes wrong.
 */
export function tryParse(localStorageKey: string): any | null {
  let result: any | null = null;
  try {
    const rawResult = localStorage.getItem(localStorageKey);
    if (rawResult) result = JSON.parse(rawResult);
  } catch {
    // Stick with null as the default value
  }

  return result;
}

/** Returns a new instance of DataRecord or a type derived from it. */
export function newRecord<T extends DataRecord>(
  initial: Omit<T, keyof DataRecord>
): T {
  const now = Date.now();
  return { id: id(), createdAt: now, updatedAt: now, ...initial } as T;
}
