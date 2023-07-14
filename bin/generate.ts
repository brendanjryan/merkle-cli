import { HASHERS } from "../src/hasher/hashers";
import { MerkleTree } from "../src/merkle";
import { Command, Option } from "@commander-js/extra-typings";
import fs from "fs";

// example usage:
// yarn generate --input ./data/input.json --output ./data/output.json --prove <data> --proofOutput ./data/proof.json
async function run() {
  // Declare program and all options - by doing so this way we ensure that
  // options are typed.
  const program = new Command()
    .requiredOption("-i, --input <inputFile>", "Data input file")
    .requiredOption("-o, --output <outputFile>", "Tree output file")
    .addOption(
      new Option(
        "-h --hash <hash>",
        "Hash function which should be used"
      ).choices(Object.keys(HASHERS))
    )
    .option("-p, --prove <proveValue>", "Value to generate a proof for")
    .option("-po, --proofOutput <outputFile>", "File to output proof to")
    .parse();

  const options = program.opts();

  // Extract the input and output filenames from the program options

  const hash = (options.hash && HASHERS[options.hash]) || HASHERS.poseidon;
  console.log(options);

  // Read the input file contents
  // @ts-ignore
  const data = JSON.parse(fs.readFileSync(options.input));

  console.log("building merkle tree...");
  const tree = await MerkleTree.newFromStringLeaves(data["data"], hash);

  console.log("successfully generated merkle tree");

  console.log(`writing json representation of tree to ${options.output}...`);
  fs.writeFileSync(options.output, tree.toJSON());

  if (options.prove) {
    console.log(`generating proof for ${options.prove}`);
    const proof = await tree.getMerkleProofForString(options.prove);

    if (options.proofOutput) {
      console.log("writng proof output to file...");
      fs.writeFileSync(options.proofOutput, JSON.stringify(proof));
    }
  }
}

// entrypoint
(async () => {
  await run();
})();
