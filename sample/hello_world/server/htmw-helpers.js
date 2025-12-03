import { ClientError } from "./ClientError.js";

const REMOVE = "remove";
const ATTR = "attr";
const VALUE = "value";

function bySelector(selector) {

    return {
        append:  html => [selector, html],
        remove: () => [selector, "", REMOVE],
        setAttr: (name, value) => [selector, [name, value], ATTR],
        setValue: value => [selector, value, VALUE],
    };

}

function parseBody(req) {

    if (!Array.isArray(req.body)) throw new ClientError("Invalid payload - send an array with at least 2 items");
    const [tagName, id, data] = req.body;
    return { tagName, id, data };

}

function byId(id) {

    return bySelector(`#${id}`);

}

export {
    byId,
    bySelector,
    parseBody
};
