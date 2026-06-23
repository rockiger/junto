export async function sceneJsonToSvgString(sceneJson: string): Promise<string> {
	const { exportToSvg, restore } = await import('@excalidraw/excalidraw')
	const data = JSON.parse(sceneJson)
	const { elements, appState, files } = restore(data, null, null)
	const svgEl = await exportToSvg({
		elements,
		appState,
		files,
		exportPadding: 10,
	})
	return new XMLSerializer().serializeToString(svgEl)
}
