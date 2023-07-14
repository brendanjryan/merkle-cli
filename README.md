# merkle-cli

A command line tool for generating merkle trees and proofs using a configurable set of hash functions. 

## Usage

```bash
yarn generate --input ./data/input.json --output ./data/output.json --hash poseidon --prove hello_world --proofOutput ./data/proof.json
```

### Currently supported hashes

* Poseidon

## Development

## Setup

Setup via yarn is preferred, and can be achieved via the following command.

```bash
yarn install
```

## Running tests 

Tests are run automatically via the following jest command

```bash
yarn test
```

## Adding a new hash method 

New hashes can be added by adding a new file in the [hasher](./src/hasher) directory and conforming to the [`Hasher` interface](./src/hasher/iface.ts).
