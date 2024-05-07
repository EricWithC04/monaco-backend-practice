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

    // Configuración necesaria para flake8
    const options = {
        mode: 'text',
        pythonOptions: ['-m'], // Utilizar el módulo flake8
        scriptPath: '', // No se necesita especificar un directorio de scripts
        args: ['-', '--format=%(row)d:%(col)d:%(code)s:%(text)s'], // Argumentos para flake8
    };

    try {
        
        const pyShell = new PythonShell('flake8', options)

        pyShell.send(code)

        pyShell.on('message', (message) => {
            console.log(message);
            res.status(200).json({ "msg": message })
        })

        pyShell.end((err) => {})

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
        PythonShell.runString(code, null)
            .then(([result]) => console.log(result))
            .catch(err => console.log("Hubo un error en la ejecucion del codigo", err))

        return res.status(200).json({ "msg": "Codigo ejecutado correctamente" })
    } catch (err) {
        console.error({ msg: "Error al ejecutar el codigo", error: err.message });
    }
})

app.listen(3000, () => {
    console.log("Server running on port 3000")
})