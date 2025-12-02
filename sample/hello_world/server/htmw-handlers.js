import { Router } from "express";
const router = new Router();

const todoItem = (taskName, tid, listId, className = "complete") => `

<form id="${className}-task-${tid}" htmw>

    <button type="submit" class="${className}">
        <span>${taskName}</span>
    </button>
    <input type="hidden" name="list-id" value="${listId}" />

</form>

`;

const database = {};

class ClientError extends Error {}

router.post("/", (req, res) => {

    if (!Array.isArray(req.body)) throw new ClientError("Non array body posted");
    if (req.body.length !== 3) throw new ClientError("Payload must be array[3]");
    const [tagName, id] = req.body;
    const selector = `${tagName}#${id}`;
    const handled =
        handleAddTask(selector, req, res)
        || handleMutateTask(selector, req, res, "FORM#complete-task-", true)
        || handleMutateTask(selector, req, res, "FORM#uncomplete-task-", false)
        ;
    if (!handled) throw new ClientError("Invalid command or query definition");

});

export default router;

function handleMutateTask(selector, req, res, prefix, makeCompleted) {

    if (!selector.startsWith(prefix)) return false;
    const [, id, data] = req.body;
    const listId = data?.["list-id"];
    const tid = selector.substring(prefix.length);
    const task = database[listId]?.[tid];
    if (!task) {

        res.status(404).send("Not found");

    } else {

        task.complete = makeCompleted;
        res.status(200).send([
            [`#${id}`, "", "remove"],
            makeCompleted
                ? [ "#completed", todoItem(task.taskName, tid, listId, "uncomplete") ]
                : [ "#todo", todoItem(task.taskName, tid, listId, "complete") ]
        ]);

    }
    return true;

}

function handleAddTask(selector, req, res) {

    if (selector !== "FORM#add-item") return false;
    const [, , data] = req.body;
    const taskName = data?.["task-name"];
    const listId = data?.["list-id"];
    const tid = crypto.randomUUID();
    database[listId] = database[listId] || {};
    database[listId][tid] = { taskName };
    res.status(200).send([
        ["#add-item input[name=task-name]", "", "value"],
        ["#todo", todoItem(taskName, tid, listId)]
    ]);
    return true;

}
