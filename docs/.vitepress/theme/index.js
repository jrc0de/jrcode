import DefaultTheme from "vitepress/theme"
import MeiViewer from "./MeiViewer.vue"
import "./custom.css"

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("MeiViewer", MeiViewer)
  },
}
