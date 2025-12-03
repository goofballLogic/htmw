import { Router } from "express";
import { database } from "../infra/database.js";
import todoItem from "./view/todoItem.js";
import { byId, bySelector, parseBody } from "../htmw-helpers.js";

const listRouter = new Router();

listRouter.post("/", addTask);
listRouter.post("/:listId", addTask);
listRouter.post("/:listId/item/:tid", mutateTask);

export default listRouter;

function addTask(req, res) {

    const { id, data } = parseBody(req);
    const listId = req.params?.listId || crypto.randomUUID();
    const taskName = data?.["task-name"];
    const tid = crypto.randomUUID();
    database[listId] = database[listId] || {};
    database[listId][tid] = { taskName };
    res.status(200).send([
        byId(id).setAttr("action", `/list/${listId}`),
        bySelector(`#${id} input[name=task-name]`).setValue(""),
        byId("todo").append(todoItem(taskName, tid, listId))
    ]);

}

function mutateTask(req, res) {

    const { listId, tid } = req.params;
    const task = database[listId]?.[tid];
    if (!task) {

        res.status(404).send("Not found");

    } else {

        const { id, data } = parseBody(req);
        task.complete = data.completed == 1;
        const targetContainerId = task.complete ? "completed" : "todo";
        res.status(200).send([
            byId(id).remove(id),
            byId(targetContainerId).append(todoItem(task.taskName, tid, listId, task.complete))
        ]);

    }

}
