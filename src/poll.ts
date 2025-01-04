import { parse } from "cookie"
import api from "./api.js"
import { generate_types } from "./generate"
import { db } from "./db/index.js"
import { spaces } from "./db/schema.js"
import { eq } from "drizzle-orm"

const server = Bun.serve<{
  space_id: string
  token: string
  poll_timer?: ReturnType<typeof setInterval> | null
}>({
  fetch(request, server) {
    const data = parse(request.headers.get("cookie") || "")
    server.upgrade(request, { data })

    return undefined
  },
  websocket: {
    async open(ws) {
      const { space_id, token } = ws.data
      const init = { headers: { Authorization: token } }

      const query = (
        await db
          .select()
          .from(spaces)
          .where(eq(spaces.id, Number(space_id)))
          .limit(1)
      )[0]

      let previous_components: string = JSON.stringify(query?.content || "")

      async function generate() {
        const result = await api.get_components(space_id, init)

        result.map(async (content) => {
          // compare new data with previous components
          if (JSON.stringify(content) === previous_components) return

          await db
            .insert(spaces)
            .values({ id: Number(space_id), content })
            .onConflictDoUpdate({ target: spaces.id, set: { content: content } })

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

      ws.data.poll_timer = setInterval(generate, 5000)

      await generate()
    },
    async message() {},
    async close(ws) {
      if (ws.data.poll_timer) clearInterval(ws.data.poll_timer)
    },
  },
})

console.log(`Listening on ${server.hostname}:${server.port}`)
