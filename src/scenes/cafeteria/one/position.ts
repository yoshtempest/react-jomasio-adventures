export function getCafeteriaOneInitialPosition(lastPage?: LastPage) {
    if (
        lastPage === "/cafeteria/battle"
    ) {
        return { x: 13, y: 5, direction: "right" };
    }

    return { x: 9, y: 10, direction: "up" };
}