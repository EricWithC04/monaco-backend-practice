import express from "express"
import cors from "cors"
import helmet from "helmet"
import { PythonShell } from "python-shell"

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())

app.post("/lint-python", (req, res) => {
    const code = req.body.code

    try {
        PythonShell.run('flake8', null).then(() => console.log('Linting successful'))
    } catch (err) {
        console.error({ msg: 'Error al ejecutar el linter', error: err.message });
    }
})

app.post("/execute", (req, res) => {
    const code = req.body.code

    if (!code) {
        throw new Error("No code provided")
    }

    try {
        PythonShell.runString(code, null).then(([result]) => console.log(result))

        return res.status(200).json({ "msg": "Codigo ejecutado correctamente" })
    } catch (err) {
        console.error({ msg: "Error al ejecutar el codigo", error: err.message });
    }
})

app.listen(3000, () => {
    console.log("Server running on port 3000")
})