export function getCantinaOneInitialPosition(lastPage?: string) {
    if (
        lastPage === "/director/two"
       ) {
        return { x: 10, y: 4, direction: "down" as const };
    }
    if (
        lastPage === "/cantina/battle"
    ) {
        return { x: 9, y: 5, direction: "up" as const };
    }

    return { x: 8, y: 11, direction: "up" as const };
}