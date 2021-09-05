// Most of this code was taken from @itsMapleLeaf's vite-plugin-babel-macros
// @see https://github.com/itsMapleLeaf/vite-plugin-babel-macros
import * as babel from "@babel/core"
import type { TransformResult } from "vite"

const sourceRegex = /\.(j|t)sx?$/
const tsxRegex = /\.(j|t)sx$/

export default function gooberCSSPropPlugin() {
  return {
    name: "goober-css-prop",
    enforce: "pre",
    async transform(source: string, filename: string) {
      if (filename.includes("node_modules")) {
        return undefined
      }

      if (!sourceRegex.test(filename)) {
        return undefined
      }

      const result = await babel.transformAsync(source, {
        filename,
        plugins: [
          require.resolve("@babel/plugin-syntax-jsx"),
          [
            require.resolve("@babel/plugin-syntax-typescript"),
            { isTSX: tsxRegex.test(filename) },
          ],
          require.resolve("@agney/babel-plugin-goober-css-prop"),
        ],
        babelrc: false,
        configFile: false,
        sourceMaps: true,
      })
      return result as TransformResult | null
    },
  } as const
}
