// Data which is able to be hashed.
export type hashable = bigint | string | BigInt | number;

// A method which is able to hash a given datum.
export interface Hasher {
  (data: hashable[]): Promise<BigInt>;
}
