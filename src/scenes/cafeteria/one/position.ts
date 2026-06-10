export function getCafeteriaOneInitialPosition(lastPage?: LastPage): ExplorePosition {
    if (
        lastPage === "/cafeteria/battle"
    ) {
        return { x: 13, y: 5, direction: "right" };
    }

    return { x: 8, y: 10, direction: "up" };
}