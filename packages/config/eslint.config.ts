import json from "@eslint/json";
import importPlugin from "eslint-plugin-import";
import perfectionist from "eslint-plugin-perfectionist";
import { defineConfig } from "eslint/config";
import { Alphabet } from "eslint-plugin-perfectionist/alphabet";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { perfectionist, import: importPlugin },
  },
  {
    files: ["src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    rules: {
      ...perfectionist.configs["recommended-alphabetical"].rules,
      "perfectionist/sort-switch-case": "off",
      "perfectionist/sort-jsx-props": "off",
      "perfectionist/sort-objects": [
        "error",
        {
          type: "unsorted",
          useConfigurationIf: {
            objectType: "non-destructured",
          },
        },
      ],
      "perfectionist/sort-intersection-types": [
        "error",
        {
          groups: ["named", "unknown"],
        },
      ],
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
      "import/no-duplicates": ["error", { "prefer-inline": true }],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
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
    ignores: ["**/tsconfig.json", "**/tsconfig.*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
  {
    files: ["**/tsconfig.json", "**/tsconfig.*.json"],
    plugins: { json },
    language: "json/jsonc",
    extends: ["json/recommended"],
  },
]);
