export default {
  testEnvironment: "node",
  preset: "ts-jest",
  moduleFileExtensions: ["ts", "tsx", "js"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  modulePathIgnorePatterns: ["<rootDir>/dist/"],
  // force jest to run a single worker at a time.
  // this is due to jest using json serialization which breaks when trying to pass `bigint`s around in test processes.
  // https://github.com/jestjs/jest/issues/11617
  maxWorkers: 1,
};
