import { Elysia } from "elysia"
import apiRoutes from "./api/index.js"

const app = new Elysia()

app.use(apiRoutes)

export default app.listen(process.env.PORT || 3000)
