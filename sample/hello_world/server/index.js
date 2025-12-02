import express from "express";
import htmw from "./htmw-handlers.js";

const app = express();
const PORT = process.env.PORT || "8080";
app.use(express.static("../client"));
app.use(express.json());

app.use("/htmw", htmw);

app.listen(PORT, () => {

    console.log(`Listening on ${PORT}`);

});