import { db } from "./db.js";
import { todoItem } from "./views.js";

const at = selector => ({ set: x => [selector, x] });
const findInPath = path => ({
    idAndName: (id, name) => path.some(([pid, pname]) => pid === id && pname === name)
});

export function handleClick(data, body) {

    if (findInPath(body).idAndName("todo", "SECTION")) {

        console.log("click complete todo");
        console.log(data);
        throw new Error("Not implemented");

    }

}

export function handleSubmit(data, [, formSpec] = []) {

    const ret = [];
    const dataObject = Object.fromEntries(data);

    if (formSpec?.[0] === "add-item") {

        let listId = dataObject["list-id"];
        if (!(listId in db)) {

            listId = crypto.randomUUID();
            console.log("New list", listId);
            ret.push(
                at("#list-id").set({ value: listId })
            );
            db[listId] = [];

        }
        const record = {
            id: crypto.randomUUID(),
            listId,
            name: dataObject["task-name"]
        };
        db[listId].push(record);
        ret.push(
            at("section#todo").set({ after: todoItem(record) }),
            at("input#task-name").set({ value: "" })
        );

    } else {

        console.error("Unhandled", formSpec);

    }
    return ret;

}
