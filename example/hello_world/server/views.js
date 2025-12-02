export const todoItem = ({ listId, id, name }) => `
    <form htmw id="complete">
        <input type="hidden" name="id" value="${id}" />
        <input type="hidden" name="list_id" value="${listId}" />
        <button type="submit">${name}</button>
    </form>
`;
