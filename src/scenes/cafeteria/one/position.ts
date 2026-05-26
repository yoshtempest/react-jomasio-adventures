export function getCafeteriaOneInitialPosition(lastPage?: string) {
    if (
        lastPage === "/cafeteria/battle"
    ) {
        return { x: 13, y: 5, direction: "right" as const };
    }

    return { x: 9, y: 10, direction: "up" as const };
}