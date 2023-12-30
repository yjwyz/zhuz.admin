/**
 *
 * @param attributes
 * @param data
 * @returns
 */
export function handleMapper<T>(attributes: string[], data: any): T {
  let result = {} as any;
  for (const attribute of attributes) {
    result[attribute as any] = data[attribute];
  }
  return result as T;
}
