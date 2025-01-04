import type { Plugin } from "vite"
import { WebSocket } from "ws"
import fs from "node:fs/promises"

const socket = new WebSocket("ws://localhost:3000", {
  headers: {
    Cookie: "token=$TOKEN; space_id=$SPACE_ID",
  },
})

function echo(text: string) {
  console.log("\x1b[33m[vite-regenerate-storyblok-types]\x1b[0m " + text)
}

export default function regenerate_storyblok_types(): Plugin {
  return {
    name: "vite-regenerate-storyblok-types",
    configureServer() {
      socket.addEventListener("open", () => echo("🔌 Listening for Storyblok component changes..."))

      socket.addEventListener("message", (msg) => {
        if (typeof msg.data !== "string") return

        try {
          const data = JSON.parse(msg.data)
          if (data.type !== "type_generation") return
          fs.writeFile(".$COMPONENTS_DIR/types.ts", String(data.contents))
          echo("🪄 Updated types.ts")
        } catch (e) {
          echo(`❌ ${e}`)
        }
      })
    },
    closeBundle() {
      socket.close()
    },
  }
}
