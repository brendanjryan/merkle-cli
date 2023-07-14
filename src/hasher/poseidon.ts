// @ts-ignore -- no types
import { buildPoseidon } from "circomlibjs";
import { hashable } from "./iface";

// private instance of poseidon hash -- lazily initiated
let poseidon: any | undefined;

// Warms up the poseidon hash -- useful if you do not want the first operation to
// be slower than incremental operations.
export async function init() {
  if (poseidon !== undefined) {
    return poseidon;
  }

  poseidon = await buildPoseidon();
}

// hash a single item using the poseidon hash method.
export async function hashValue(item: hashable): Promise<BigInt> {
  return hashValues([item]);
}

// hash multiple items using the poseidon hash method.
export async function hashValues(items: hashable[]): Promise<BigInt> {
  await init();

  const res = poseidon.F.toString(poseidon(items));
  return BigInt(`0x${res}`);
}
