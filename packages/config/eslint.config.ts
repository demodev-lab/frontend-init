import json from "@eslint/json";
import importPlugin from "eslint-plugin-import";
import perfectionist from "eslint-plugin-perfectionist";
import { defineConfig } from "eslint/config";
import { Alphabet } from "eslint-plugin-perfectionist/alphabet";

export default defineConfig([
  {
    files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { perfectionist, import: importPlugin },
    rules: {
      "import/no-duplicates": ["error", { "prefer-inline": true }],
      "perfectionist/sort-imports": [
        "error",
        {
          type: "alphabetical",
          groups: [
            ["type-import", "type-internal", "type-parent", "type-sibling", "type-index"],
            ["value-builtin", "value-external"],
            "value-internal",
            ["value-parent", "value-sibling", "value-index"],
            "ts-equals-import",
            "unknown",
          ],
        },
      ],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { perfectionist },
    rules: {
      "perfectionist/sort-named-imports": [
        "error",
        {
          type: "custom",
          alphabet: Alphabet.generateRecommendedAlphabet()
            .sortByLocaleCompare("en-US")
            .placeAllWithCaseBeforeAllWithOtherCase("lowercase")
            .getCharacters(),
          ignoreCase: false,
          groups: ["value-import", { newlinesBetween: 0 }, "type-import"],
        },
      ],
    },
  },
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
]);
