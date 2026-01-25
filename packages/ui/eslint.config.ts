import baseConfig from "@shared/config/eslint";
import tseslint from "typescript-eslint";

export default tseslint.config(...baseConfig, ...tseslint.configs.recommended);
