import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends("next/core-web-vitals", "next/typescript"),
	{
		rules: {
			// For TypeScript projects, use the TypeScript ESLint rule:
			"@typescript-eslint/no-unused-vars": "warn", // 🟡 Yellow warning

			// If you also want to adjust the base ESLint rule (optional):
			"no-unused-vars": "off", // 🔴 Disable base rule (use TypeScript's rule instead)
		},
	},
];

export default eslintConfig;
