export async function load({ params, parent }) {
	const slug = params.page || "home"

	const { api, version } = await parent()

	const response = await api.get(`cdn/stories/${slug}`, { version })

	return { story: response.data.story }
}
