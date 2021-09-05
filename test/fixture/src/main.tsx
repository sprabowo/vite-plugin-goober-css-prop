import * as React from "react"
import ReactDOM from "react-dom"
import { setup } from "goober"

setup(React.createElement)

const isActive = false

ReactDOM.render(
  <React.StrictMode>
    <h1 css="color: red;">Hello</h1>
    <h2
      css={{
        ...(!isActive && { backgroundColor: "yellow" }),
      }}
    >
      World
    </h2>
  </React.StrictMode>,
  document.getElementById("root")
)
