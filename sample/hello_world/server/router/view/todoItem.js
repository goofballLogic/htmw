export default (taskName, tid, listId, isComplete) => `

<form id="item-${tid}" action="/list/${listId}/item/${tid}" htmw>

    <button type="submit">
        <span>${taskName}</span>
    </button>
    <input type="hidden" name="completed" value="${isComplete ? 0 : 1}" />
    <button type="submit" method="delete">
        Delete
    </button>
</form>

`;
