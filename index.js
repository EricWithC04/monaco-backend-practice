import express from "express"
import cors from "cors"
import helmet from "helmet"
import vm from "vm"
import { PythonShell } from "python-shell"

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())

app.post("/execute", (req, res) => {
    const code = req.body.code

    if (!code) {
        throw new Error("No code provided")
    }

    try {
        // const options = {
        //     mode: "text",
        //     pythonPath: "C:/Users/merca/AppData/Local/Programs/Python/Python312/python.exe",
        //     pythonOptions: ["-u"],
        //     args: ['']
        // }

        // const sandbox = { console }
        // const context = vm.createContext(sandbox)
        // const result = vm.runInContext(code, context)

        PythonShell.runString(code, null).then(([result]) => console.log(result))

        return res.status(200).json({ "hola": "hola" })
    } catch (err) {
        console.error({ msg: "Error al ejecutar el codigo", error: err.message });
    }
})

app.listen(3000, () => {
    console.log("Server running on port 3000")
})