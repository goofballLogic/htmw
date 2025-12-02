import express from "express";
import { handleSubmit, handleClick } from "./event-handlers.js";

const app = express();
const PORT = process.env.PORT || "8080";
app.use(express.static("../client"));
app.use(express.json());

class ClientError extends Error {}

app.post("/htmw", (req, res) => {

    try {

        if (!Array.isArray(req.body)) throw new ClientError("Unexpected non-array");
        if (!req.body.every(x => Array.isArray(x))) throw new ClientError("Unexpected non-array items");
        const [eventName, data] = req.body[0];
        if(eventName == "submit") {

            const ret = handleSubmit(data, req.body);
            if (ret) {

                console.log("Sending", ret);
                res.send(ret);
                return;

            }

        } else if (eventName === "click") {

            const ret = handleClick(data, req.body);
            if (ret) {

                console.log("Sending", ret);
                res.send(ret);
                return;

            }

        }
        console.dir(req.body, { depth: 10 });
        throw new Error(`Unhandled event: ${eventName}`);

    } catch(err) {

        console.error(err);
        res.status(err instanceof ClientError ? 400 : 500).send(err.message);

    }

});

app.listen(PORT, () => {

    console.log(`Listening on ${PORT}`);

});


