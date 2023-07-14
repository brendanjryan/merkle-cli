import { Hasher, hashable } from "./iface";
import { hashValues } from "./poseidon";
import { createHash } from "crypto";

// A poseidon hasher which first normalizes values by taking the hex value of the SHA-256 hash of a given string.
export const sha256NormalizedPoseidonHasher: Hasher = async (
  data: hashable[]
): Promise<BigInt> => {
  const stringData = data.map((item) => item.toString());

  // normalize data to sha256 of fixed length
  const normalized = stringData.map((item) => {
    const hash = createHash("sha256");
    hash.update(item);
    return BigInt(`0x${hash.digest("hex")}`);
  });

  const res = await hashValues(normalized);
  return res;
};

// Define new hashers here...

// Hasher manifest -- used by cli invocation

type IndexedHasher = Record<string, Hasher>;

export const HASHERS: IndexedHasher = {
  poseidon: sha256NormalizedPoseidonHasher,
};
