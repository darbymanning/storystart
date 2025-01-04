import { parse } from "cookie"
import api from "./api"
import { generate_types } from "./generate"

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

      let previous_components = ""

      async function generate() {
        const result = await api.get_components(space_id, init)

        result.map(async (data) => {
          // compare new data with previous components

          if (JSON.stringify(data) === previous_components) return

          // update previous components
          previous_components = JSON.stringify(data)

          const result = await generate_types({ space_id, data })

          result.map((contents) => {
            const msg = JSON.stringify({
              type: "type_generation",
              contents,
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
