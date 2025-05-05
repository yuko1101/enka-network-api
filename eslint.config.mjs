import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistics from "@stylistic/eslint-plugin-ts";

export default tseslint.config(
    {
        ignores: [
            "example/**/*.js",
            "scripts/**/*.js",
            "test/**/*.js",
            "docs/",
            "dist/",
        ],
    },
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    {
        plugins: {
            "@stylistics/ts": stylistics,
        },
        rules: {
            "arrow-spacing": [
                "error",
                {
                    "before": true,
                    "after": true,
                },
            ],
            "brace-style": [
                "error",
                "1tbs",
                {
                    "allowSingleLine": true,
                },
            ],
            "comma-dangle": [
                "error",
                "always-multiline",
            ],
            "comma-spacing": "error",
            "comma-style": "error",
            "curly": [
                "error",
                "multi-line",
                "consistent",
            ],
            "dot-location": [
                "error",
                "property",
            ],
            "handle-callback-err": "off",
            "indent": [
                "error",
                4,
                {
                    "SwitchCase": 1,
                },
            ],
            "keyword-spacing": "error",
            "max-nested-callbacks": [
                "error",
                {
                    "max": 4,
                },
            ],
            "max-statements-per-line": [
                "error",
                {
                    "max": 2,
                },
            ],
            "no-cond-assign": "error",
            "no-console": "off",
            "no-const-assign": "error",
            "no-dupe-args": "error",
            "no-empty-interface": "off",
            "no-fallthrough": "error",
            "no-floating-decimal": "error",
            "no-inline-comments": "off",
            "no-lonely-if": "error",
            "no-multi-spaces": "error",
            "no-multiple-empty-lines": [
                "error",
                {
                    "max": 2,
                    "maxEOF": 1,
                    "maxBOF": 0,
                },
            ],
            "no-shadow": [
                "error",
                {
                    "allow": [
                        "err",
                        "resolve",
                        "reject",
                    ],
                },
            ],
            "no-trailing-spaces": [
                "error",
            ],
            "no-var": "error",
            "object-curly-spacing": [
                "error",
                "always",
            ],
            "prefer-const": "error",
            "quotes": [
                "error",
                "double",
            ],
            "semi": "error",
            "space-before-blocks": "error",
            "@stylistics/ts/space-before-function-paren": [
                "error",
                {
                    "anonymous": "never",
                    "named": "never",
                    "asyncArrow": "always",
                },
            ],
            "space-in-parens": "error",
            "space-infix-ops": "error",
            "space-unary-ops": "error",
            "spaced-comment": "error",
            "yoda": [
                "error",
                "never",
                {
                    "exceptRange": true,
                },
            ],
        },
    },
);