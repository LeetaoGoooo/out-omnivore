/**
 * Reads and parses JSON from a File object
 * @param file Browser File object
 * @returns Promise of parsed JSON data with type checking
 */
export async function readJsonFile<T>(file: File): Promise<T> {
  try {
    const text = await file.text();
    return JSON.parse(text) as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to read or parse JSON file: ${error.message}`);
    }
    throw error;
  }
}
