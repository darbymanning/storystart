import { loader } from "$LIBRARY_DIR/storyblok.js"

export async function load({ url }) {
  return await loader(url)
}
