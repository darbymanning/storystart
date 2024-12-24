# Storystart

This is a starter template for SvelteKit with Storyblok. It includes a basic setup for a SvelteKit project with Storyblok as a headless CMS.

This is a [SvelteKit](https://svelte.dev/docs/kit/introduction) application bootstrapped with [sv](https://svelte.dev/docs/kit/cli). There are some opinionated choices made in this starter template. Specifically:

- [Bun](https://bun.sh)
- [Tailwind v4 beta](https://tailwindcss.com/docs/v4-beta)
- A generate script to create TypeScript types for Storyblok components
- [@vitejs/plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl) for local development with HTTPS
- A `storyblok.ts` file which provides snake_case exports (more Sveltey, extend as necessary)
- The entire components folder imported to use as Storyblok components, so as long as the component name in Storyblok matches the filename, it will be loaded automatically

## Getting Started

To get started, use degit to clone this repository, and run the `setup` script. This will create a `.env.local` file, and install the necessary dependencies.

```bash
bunx degit darbymanning/storystart storystart
cd storystart
bun setup
```

After running the setup script, you can start the development server with the following command:

```bash
bun dev
```

This will start the development server at `https://localhost:5173`.

The generate script runs in the background using a vite plugin, which polls the Storyblok API for changes every 10 seconds. This means that you can make changes to your Storyblok components schema, and the types will be updated automatically. If you want to manually regenerate the types, you can run the following command:

```bash
bun generate
```

You can specify a different interval for the polling by setting the `interval_ms` in the vite plugin options. For example, to regenerate the types every 5 seconds, you can add the following to the `vite.config.ts` file:

```ts
plugins: [
	regenerate_storyblok_types({ interval_ms: 5000 }), // regenerate every 5 seconds
]
```
