const ops = {
    value: (el, content) => { if (el) el.value = content; },
    remove: el => el.remove(),
    _: (el, content) => el.innerHTML += content
};

document.addEventListener("submit", async function handleSubmit(e) {

    if (!e.target?.hasAttribute("htmw")) return;
    e.preventDefault();
    const data = JSON.stringify([
        e.target.tagName,
        e.target.getAttribute("id"),
        Object.fromEntries(new FormData(e.target).entries())
    ]);
    const resp = await fetch("/htmw", { method: "POST", body: data, headers: { "content-type": "application/json" } });
    if(!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
    if (resp.status === 204) return;
    const json = await resp.json();
    if (!Array.isArray(json)) return;
    json
        .filter(x => Array.isArray(x) && x.length > 1)
        .map(([selector, content, opname]) => [
            document.querySelector(selector),
            content,
            ops[opname] || ops._
        ])
        .filter(x => x[0])
        .forEach(([el, content, op]) => { op(el, content); });

});