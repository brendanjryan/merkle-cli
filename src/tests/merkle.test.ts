import { MerkleTree, Node, JSONTree, JSONNode, MerkleProof } from "../merkle";
import { hashValues, init } from "../hasher/poseidon";
import { Hasher } from "../hasher/iface";
import fs from "fs";
import path from "path";
import { sha256NormalizedPoseidonHasher } from "../hasher/hashers";

describe("MerkleTree", () => {
  let hasher: Hasher;

  beforeAll(async () => {
    // use the poseidon hasher for all tests
    await init();
  });

  describe("newFromStringLeaves", () => {
    const testCases: { leaves: string[]; expectedRoot: bigint }[] = [
      {
        leaves: ["foo", "bar"],
        expectedRoot:
          8319328667317149036300994636354503818079303821870836788923033243152155822735009174762584097n,
      },
      {
        leaves: ["foo", "bar", "jazz", "thing"],
        expectedRoot:
          43956635362225951124093673638678455238826677743810067350561793544754832820019750129868411255n,
      },
    ];

    testCases.forEach(({ leaves, expectedRoot }) => {
      it(`should build a Merkle tree from string leaves ${testCases}`, async () => {
        const merkleTree = await MerkleTree.newFromStringLeaves(
          leaves,
          sha256NormalizedPoseidonHasher
        );

        expect(merkleTree.root.value).toEqual(expectedRoot);
      });
    });
  });

  describe("newFromLeaves", () => {
    const testCases: { leaves: BigInt[]; expectedRoot: BigInt }[] = [
      {
        leaves: [1n, 2n],
        expectedRoot:
          15319109825086151171670436578627209586345833021315916872859089073770256088324959809124250928n,
      },
      {
        leaves: [1n, 2n, 3n, 4n],
        expectedRoot:
          67894699183177306125723683862095100089202235598358741680480899804765006553678335031587927193n,
      },
    ];

    testCases.forEach(({ leaves, expectedRoot }) => {
      it("should build a Merkle tree from BigInt leaves", async () => {
        const merkleTree = await MerkleTree.newFromLeaves(leaves, hasher);

        expect(merkleTree.root.value).toEqual(expectedRoot);
      });
    });
  });

  describe("getMerkleProof", () => {
    const testCases: {
      leaves: BigInt[];
      leafValue: BigInt;
      expectedProof: MerkleProof;
    }[] = [
      {
        leaves: [1n, 2n],
        leafValue: BigInt(2n),
        expectedProof: {
          values: [1n],
          indexHints: [1],
        },
      },
      // tests on 3 level tree
      {
        leaves: [1n, 2n, 3n, 4n],
        leafValue: BigInt(1n),
        expectedProof: {
          values: [
            2n,
            41681222491537713262410310408636105938045296702812166253848912965195419022514918821068245400n,
          ],
          indexHints: [0, 0],
        },
      },
      {
        leaves: [1n, 2n, 3n, 4n],
        leafValue: BigInt(2n),
        expectedProof: {
          values: [
            1n,
            41681222491537713262410310408636105938045296702812166253848912965195419022514918821068245400n,
          ],
          indexHints: [1, 0],
        },
      },
      {
        leaves: [1n, 2n, 3n, 4n],
        leafValue: BigInt(3n),
        expectedProof: {
          values: [
            4n,
            15319109825086151171670436578627209586345833021315916872859089073770256088324959809124250928n,
          ],
          indexHints: [0, 1],
        },
      },
      {
        leaves: [1n, 2n, 3n, 4n],
        leafValue: BigInt(4n),
        expectedProof: {
          values: [
            3n,
            15319109825086151171670436578627209586345833021315916872859089073770256088324959809124250928n,
          ],
          indexHints: [1, 1],
        },
      },
      // Add more test cases here...
    ];

    testCases.forEach(({ leaves, leafValue, expectedProof }) => {
      it("should return the Merkle proof for a given leaf value", async () => {
        const merkleTree = await MerkleTree.newFromLeaves(leaves, hashValues);
        const proof = merkleTree.getMerkleProof(leafValue);

        expect(proof).toEqual(expectedProof);
      });
    });
  });

  describe("toJSON", () => {
    const testCases: { leaves: BigInt[]; expectedJSON: string }[] = [
      {
        leaves: [1n, 2n],
        expectedJSON: fs.readFileSync(
          path.join(__dirname, "./data/two_level.golden.json"),
          "utf-8"
        ),
      },
      {
        leaves: [1n, 2n, 3n, 4n],
        expectedJSON: fs.readFileSync(
          path.join(__dirname, "./data/three_level.golden.json"),
          "utf-8"
        ),
      },
    ];

    testCases.forEach(({ leaves, expectedJSON }) => {
      it("should serialize the Merkle tree to a JSON string", async () => {
        const merkleTree = await MerkleTree.newFromLeaves(leaves, hashValues);
        const json = merkleTree.toJSON();

        expect(json).toEqual(expectedJSON.trim());
      });
    });
  });
});
