import express from "express";
import listRouter from "./router/list.js";
import { handleClientErrors } from "./ClientError.js";

const app = express();
const PORT = process.env.PORT || "8080";
app.use(express.static("../client"));
app.use(express.json());

app.use("/list", listRouter);

app.use(handleClientErrors);

app.listen(PORT, () => {

    console.log(`Listening on ${PORT}`);

});

