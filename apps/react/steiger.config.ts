import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // Ignore TanStack Router routing directories
    ignores: ["app/**"],
  },
]);
