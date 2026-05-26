export function getCantinaTwoInitialPosition(lastPage?: string) {
    if (
        lastPage === "/hall/one" ||
        lastPage === "/hall/afterpcroom-one"
    ) {
        return { x: 14, y: 11, direction: "left" as const };
    }

    if (lastPage === "/hall/center-one") {
        return { x: 2, y: 11, direction: "right" as const };
    }
    if (lastPage?.startsWith("/cafeteria")) {
        return { x: 6, y: 3, direction: "down" as const };
    }

    return { x: 9, y: 5, direction: "up" as const };
}