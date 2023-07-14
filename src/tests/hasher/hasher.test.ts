import { sha256NormalizedPoseidonHasher } from "../../hasher/hashers";
import { createHash } from "crypto";

describe("sha256NormalizedPoseidonHasher", () => {
  const testData = [
    {
      input: ["abc"],
      expectedHash:
        49027809723761651149526689468110169273635844472886828393593502789297525661793054944512259968n,
    },
    {
      input: ["123"],
      expectedHash:
        41688253489143635424905287260312315007718210359084721774881250886732575485249875210696613905n,
    },
    {
      input: [123], // should be the same as above test
      expectedHash:
        41688253489143635424905287260312315007718210359084721774881250886732575485249875210696613905n,
    },
    {
      input: ["abc", 123],
      expectedHash:
        14554664075521231640243598517456306064492005931199729837499446615834366098323623431609004433n,
    },
  ];

  testData.forEach((data) => {
    it(`should normalize and hash the data correctly [${data.input}]`, async () => {
      const { input, expectedHash } = data;

      // Call the hasher with the input data
      const result = await sha256NormalizedPoseidonHasher(input);

      expect(result).toEqual(expectedHash);
    });
  });
});
