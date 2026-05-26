export function getCafeteriaFourInitialPosition(lastPage?: string) {
    if (lastPage?.startsWith("/cafeteria")) {
        return { x: 13, y: 5, direction: "left" as const };
    }

    return { x: 9, y: 11, direction: "up" as const };
}