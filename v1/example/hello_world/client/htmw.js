const h = "htmw", d = document;
const childIndex = n => childIndex[n] = childIndex[n] || Array.from(n.parentNode.children).indexOf(n);
const path = (n, ps) => n?.parentElement ? path(n.parentElement, [[n.getAttribute("id"), n.nodeName, childIndex(n)], ...ps]) : ps.reverse();
const postJSON = x => fetch(`/${h}`, { method: "POST", body: JSON.stringify(x), headers: { "Content-Type": "application/json" }});
const parser = new DOMParser();
const req = e => {

    const data = [[e.type], ...path(e.target, [])];
    if (e.currentTarget instanceof HTMLFormElement) {

        e.preventDefault();
        data[0][1] = Array.from(new FormData(e.currentTarget).entries());

    }
    postJSON(data)
        .then(r => r.ok ? r.json() : [])
        .then(rs => rs
            .map(([selector, ...rest]) => [d.querySelector(selector) || selector, ...rest])
            .filter(x => typeof x[0] === "object" || console.warn("Missing element", x))
            .forEach(([el, value]) => {
                if (typeof value === "string")
                    el.innerHTML = value;
                else if (value?.value !== undefined)
                    el.value = value.value;
                else if (value?.after !== undefined) {
                    const parsed = parser.parseFromString(value.after, "text/html");
                    register(parsed.body);
                    Array.from(parsed.body.children).forEach(x => el.appendChild(x));
                }
                else
                    console.warn("Unrecognised value", [el, value]);
            })
        );

};
const listen = (e, x) => e.addEventListener(x || "click", req);
function register(container) {
    if (container?.hasAttribute?.(h)) listen(x, x.getAttribute(h));
    for(let x of container.querySelectorAll(`[${h}]`))
        listen(x, x.getAttribute(h));
};
register(d);