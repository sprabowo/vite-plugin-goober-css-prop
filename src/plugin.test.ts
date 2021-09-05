import { join } from "path"
import type { OutputChunk } from "rollup"
import { build } from "vite"
import type { Plugin } from "vite"
import gooberCSSProp from "./plugin"

test("css prop string", async () => {
  const code = `<div css="background: red;">test</div>`
  const result = await gooberCSSProp().transform(code, "container.tsx")
  expect(result?.code).toMatchInlineSnapshot(`
    "<_CSSDiv>test</_CSSDiv>;

    var styled = require(\\"goober\\").styled;

    var _CSSDiv = styled(\\"div\\")\`background: red;\`;"
  `)
})

test("css prop css attribute", async () => {
  const code = `<div css={{ backgroundColor: 'yellow' }}>test</div>`
  const result = await gooberCSSProp().transform(code, "container.tsx")
  expect(result?.code).toMatchInlineSnapshot(`
    "<_CSSDiv _css={{
      backgroundColor: 'yellow'
    }}>test</_CSSDiv>;

    var styled = require(\\"goober\\").styled;

    var _CSSDiv = styled(\\"div\\")\`\${p => p._css}\`;"
  `)
})

test("css prop css attribute with conditional state 1", async () => {
  const isActive = true
  const code = `<div css={${isActive} && \`background-color: blue\`}>test</div>`
  const result = await gooberCSSProp().transform(code, "container.tsx")
  expect(result?.code).toMatchInlineSnapshot(`
    "<_CSSDiv _css={true && \`background-color: blue\`}>test</_CSSDiv>;

    var styled = require(\\"goober\\").styled;

    var _CSSDiv = styled(\\"div\\")\`\${p => p._css}\`;"
  `)
})

test("css prop css attribute with conditional state 2", async () => {
  const isActive = false
  const code = `<div css={{...(${isActive} && {backgroundColor: 'green'}), ...(${!isActive} && {backgroundColor: 'yellow'})}}>test</div>`
  const result = await gooberCSSProp().transform(code, "container.tsx")
  expect(result?.code).toMatchInlineSnapshot(`
    "<_CSSDiv _css={{ ...(false && {
        backgroundColor: 'green'
      }),
      ...(true && {
        backgroundColor: 'yellow'
      })
    }}>test</_CSSDiv>;

    var styled = require(\\"goober\\").styled;

    var _CSSDiv = styled(\\"div\\")\`\${p => p._css}\`;"
  `)
})

test("typechecks as a vite plugin", () => {
  const plugin: Plugin = gooberCSSProp()
})

test("vite integration", async () => {
  let result = await build({
    root: join(__dirname, "../test/fixture"),
    plugins: [gooberCSSProp()],
    logLevel: "silent",
    build: {
      minify: false,
      write: false,
    },
  })
  result = [result].flat()[0]

  const code = result.output.find(
    (item): item is OutputChunk => item.type === "chunk"
  )?.code

  expect(code).toContain(`color: red;`)
  expect(code).toContain(`backgroundColor: \"yellow\"`)
}, 10000)
