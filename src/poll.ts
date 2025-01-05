import { parse } from "cookie"
import api from "./api.js"
import { generate_types } from "./generate"
import { db } from "./db/index.js"
import { spaces } from "./db/schema.js"
import { eq } from "drizzle-orm"
import type { ServerWebSocket } from "bun"

type WSData = {
  space_id: string
  token: string
  poll_timer?: ReturnType<typeof setInterval> | null
}

async function generate({
  ws,
  skip_diff_check = false,
}: {
  ws: ServerWebSocket<WSData>
  skip_diff_check?: boolean
}) {
  const { space_id } = ws.data
  const init = { headers: { Authorization: ws.data.token } }

  const query = (
    await db
      .select()
      .from(spaces)
      .where(eq(spaces.id, Number(space_id)))
      .limit(1)
  )[0]

  let previous_components: string = query?.content || ""

  const result = await api.get_components(space_id, init)

  result.map(async (content) => {
    // compare new data with previous components
    if (!skip_diff_check && JSON.stringify(content) === previous_components) return

    const stringified = JSON.stringify(content)
    await db
      .insert(spaces)
      .values({ id: Number(space_id), content: stringified })
      .onConflictDoUpdate({ target: spaces.id, set: { content: stringified } })

    // update previous components
    previous_components = JSON.stringify(content)

    const result = await generate_types({ space_id, content })

    result.map(async (content) => {
      const msg = JSON.stringify({
        type: "type_generation",
        content,
      })
      ws.send(msg)
    })
  })
}

const server = Bun.serve<WSData>({
  fetch(request, server) {
    const data = parse(request.headers.get("cookie") || "")
    server.upgrade(request, { data })

    return undefined
  },
  websocket: {
    async open(ws) {
      ws.data.poll_timer = setInterval(() => generate({ ws }), 5000)
      await generate({ ws })
    },
    async message(ws, message) {
      const _message = typeof message === "string" ? JSON.parse(message) : null
      if (_message.type !== "request_type_generation") return

      await generate({ ws, skip_diff_check: true })
    },
    async close(ws) {
      if (ws.data.poll_timer) clearInterval(ws.data.poll_timer)
    },
  },
})

console.log(`Listening on ${server.hostname}:${server.port}`)
