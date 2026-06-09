export function getCantinaTwoInitialPosition(lastPage?: LastPage): ExplorePosition {
    if (lastPage === "/library/secret-passage") {
        return { x: 2, y: 4, direction: "down" };
    }

    return { x: 9, y: 5, direction: "up" };
}