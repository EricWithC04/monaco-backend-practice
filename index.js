import express from "express"
import cors from "cors"
import helmet from "helmet"
import vm from "vm"

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
        const sandbox = { console }
        const context = vm.createContext(sandbox)
        const result = vm.runInContext(code, context)

        return res.status(200).json({ result })
    } catch (err) {
        console.error({ msg: "Error al ejecutar el codigo", error: err.message });
    }
})

app.listen(3000, () => {
    console.log("Server running on port 3000")
})