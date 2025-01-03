import chalk from "chalk"
import figlet from "figlet"
import Api, { type Space } from "./api"
import ora from "ora"
import type { PackageJson } from "type-fest"
import { createSelection as selection, createPrompt as prompt } from "bun-promptx"
import credentials from "./credentials"
import { appendFile } from "node:fs/promises"
import { $ } from "bun"
import { Glob } from "bun"

if (!(await $`which storyblok`.quiet())) {
  console.error("Please install the Storyblok CLI first using `npm install -g storyblok`")
  process.exit(1)
}

if (!credentials?.token) {
  console.error("No credentials found")
  console.error("Please login first using `storyblok login`")
  process.exit(1)
}

console.log(chalk.cyan(figlet.textSync("storystart")))
console.log()
console.log()

const spinner = ora()

spinner.start("Fetching user data")

const user_result = await Api.get_user()

user_result
  .map(async ({ user }) => {
    spinner.stop()
    console.log(`Hey ${user.firstname} 👋`)
    console.log()

    const space = selection([{ text: "Create a new space" }, { text: "Select an existing space" }])

    if (space.selectedIndex === 0) {
      const { value: name } = prompt("Enter the space name: ", { required: true })

      if (!name) {
        spinner.fail("Name is required")
        process.exit(1)
      }

      spinner.start("Creating space")
      const space_result = await Api.create_space({ name })
      space_result.map(async ({ space }) => setup(space))
    } else if (space.selectedIndex === 1) {
      spinner.start("Fetching spaces")
      const result = await Api.get_spaces()
      spinner.stop()

      result.map(async ({ spaces }) => {
        const selected_space = selection(spaces.map((space) => ({ text: space.name })))
        if (selected_space.selectedIndex === null) return
        const space_by_idx = spaces[selected_space.selectedIndex]

        const space_result = await Api.get_space(space_by_idx.id)

        space_result.map(async ({ space }) => setup(space))
      })
    }
  })
  .mapErr((err) => spinner.fail(err.message))

async function setup_vite_config() {
  let new_imports = `import regenerate_storyblok_types from "./scripts/plugin.js";\n`
  let new_plugins = ["regenerate_storyblok_types()"]

  const vite_config = await Bun.file("vite.config.ts").text()

  const has_vite_plugin_basic_ssl = vite_config.includes("@vitejs/plugin-basic-ssl")

  if (!has_vite_plugin_basic_ssl) {
    new_imports += `import basic_ssl from "@vitejs/plugin-basic-ssl";\n`
    new_plugins.push("basic_ssl()")
  }

  const updated_config =
    new_imports +
    vite_config.replace(
      /plugins:\s*\[([^\]]*)]/,
      (_, plugins) => `plugins: [${plugins}, ${new_plugins.join(", ")}]`
    )

  Bun.write("vite.config.ts", updated_config)
}

async function install_dependencies() {
  const new_dependencies = new Map([
    ["ora", "^8.1.1"],
    ["@types/bun", "^1.1.14"],
    ["@storyblok/svelte", "^4.0.10"],
    ["storyblok-generate-ts", "^2.1.0"],
    ["lodash", "^4.17.15"],
    ["@vitejs/plugin-basic-ssl", "^1.2.0"],
  ])

  const package_json = (await Bun.file("package.json").json()) as PackageJson

  function has_dependency(name: string) {
    return package_json.dependencies?.[name] || package_json.devDependencies?.[name]
  }

  for (const [name, version] of new_dependencies) {
    if (!has_dependency(name)) await $`bun add ${name}@${version} -DE`.quiet()
  }
}

async function setup(space: Space) {
  await appendFile(".env.local", `PUBLIC_STORYBLOK_ACCESS_TOKEN="${space.first_token}"`)

  const files_path = `${import.meta.dirname}/files/`
  const glob = new Glob(`${files_path}**`)

  for await (const file of glob.scan(".")) {
    Bun.write(
      file.replace(files_path, ""),
      (await Bun.file(file).text())
        .replaceAll("$SPACE_ID", space.id.toString())
        .replaceAll("$COMPONENTS_DIR", "/src/lib/components")
        .replaceAll("$LIBRARY_DIR", "$lib")
    )
  }

  await setup_vite_config()
  await install_dependencies()

  await $`open raycast://confetti`.nothrow().quiet()

  console.log("")
  console.log("🚀 Setup complete!\n")

  process.exit(0)
}
