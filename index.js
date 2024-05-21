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

            const parts = message.split(":")

            const formatedError = {
                row: parts[0],
                col: parts[1],
                code: parts[2],
                typeError: parts[3],
                description: parts[4]
            }

            res.status(200).json({ "error": formatedError })
        })

        pyShell.end((err) => {})

    } catch (err) {
        console.error({ msg: 'Error al ejecutar el linter', error: err.message });
    }
})

app.post("/lint-fastapi", (req, res) => {
    const code = req.body.code

    if (!code) {
        throw new Error("No code provided")
    }

    try {
        fetch('http://127.0.0.1:8000/lint', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code: code
            })
        })
            .then(response => response.json())
            .then(data => {
                return res.status(200).json(data)
        })
    } catch (err) {
        console.error(err);
    }
})

app.post("/execute", (req, res) => {
    const code = req.body.code

    if (!code) {
        throw new Error("No code provided")
    }

    try {
        PythonShell.runString(code, null)
            .then((results) => {
                results.forEach(result => console.log(result));
            })
            .catch(err => console.log("Hubo un error en la ejecucion del codigo", err))

        return res.status(200).json({ "msg": "Codigo ejecutado correctamente" })
    } catch (err) {
        console.error({ msg: "Error al ejecutar el codigo", error: err.message });
    }
})

app.post("/execute/fastapi", (req, res) => {
    const code = req.body.code

    if (!code) {
        throw new Error("No code provided")
    }

    try {
        fetch('http://127.0.0.1:8000/execute', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                code: code
            })
        })
            .then(response => response.json())
            .then(data => {
                return res.status(200).json(data)
            })
    } catch (err) {
        console.error(err)
    }
})

app.listen(3000, () => {
    console.log("Server running on port 3000")
})