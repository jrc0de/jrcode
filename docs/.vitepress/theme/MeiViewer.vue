<template>
  <div class="mei-block">
    <div ref="container" class="mei-viewer"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue"

const props = defineProps({
  meiContent: { type: String, required: true },
  scale: { type: Number, default: 40 },
})

const container = ref(null)
let toolkit = null
let resizeObserver = null
let renderScheduled = false

function render() {
  if (!toolkit || !container.value) return

  // Largeur réelle disponible dans le conteneur
  const containerWidth = container.value.clientWidth
  if (containerWidth === 0) return

  // pageWidth est exprimé dans l'unité Verovio, qui est elle-même
  // affectée par `scale` : on compense pour obtenir la largeur réelle en px
  const pageWidth = Math.round((containerWidth * 100) / props.scale)

  toolkit.setOptions({
    scale: props.scale,
    footer: "none",
    header: "none",
    breaks: "auto",
    pageWidth,
    adjustPageHeight: true,
  })

  toolkit.redoLayout()
  container.value.innerHTML = toolkit.renderToSVG(1)
}

function scheduleRender() {
  if (renderScheduled) return
  renderScheduled = true
  requestAnimationFrame(() => {
    renderScheduled = false
    render()
  })
}

onMounted(async () => {
  const createVerovioModule = (await import("verovio/wasm")).default
  const { VerovioToolkit } = await import("verovio/esm")

  const VerovioModule = await createVerovioModule()
  toolkit = new VerovioToolkit(VerovioModule)

  toolkit.loadData(props.meiContent)
  render()

  // Reflow quand le conteneur change de taille (resize fenêtre, sidebar, etc.)
  resizeObserver = new ResizeObserver(() => scheduleRender())
  resizeObserver.observe(container.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.mei-block {
  position: relative;
  margin: 16px 0;
  border-radius: 8px;
  background-color: #dcdce0;
  overflow: hidden;
}

.mei-viewer {
  display: block;
  padding: 20px 24px;
}

.mei-viewer :deep(svg) {
  width: 100%;
  height: auto;
  display: block;
}
</style>
