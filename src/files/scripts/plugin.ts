import type { Plugin } from "vite"
import { WebSocket } from "ws"
import fs from "node:fs/promises"

const socket = new WebSocket("wss://artificial-maude-darby-d1295314.koyeb.app/", {
  headers: {
    Cookie: "token=$TOKEN; space_id=$SPACE_ID",
  },
})

function echo(text: string) {
  console.log("\x1b[33m[vite-regenerate-storyblok-types]\x1b[0m " + text)
}

socket.addEventListener("open", () => {
  echo("🔌 Listening for Storyblok component changes")

  fs.access(".$COMPONENTS_DIR/types.ts", fs.constants.F_OK).catch(() =>
    socket.send(JSON.stringify({ type: "request_type_generation" }))
  )
})

socket.addEventListener("message", (msg) => {
  if (typeof msg.data !== "string") return

  try {
    const data = JSON.parse(msg.data)
    if (data.type !== "type_generation") return
    fs.writeFile(".$COMPONENTS_DIR/types.ts", String(data.content))
    echo("🪄 Updated types.ts")
  } catch (e) {
    echo(`❌ ${e}`)
  }
})

export default function regenerate_storyblok_types(): Plugin {
  return {
    name: "vite-regenerate-storyblok-types",
    closeBundle: socket.close,
  }
}
