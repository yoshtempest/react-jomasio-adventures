export function getPcRoomSixInitialPosition(lastPage?: string) {
    if (lastPage?.startsWith("/pcRoom")) {
        return { x: 12, y: 4, direction: "left" as const };
    }

    return { x: 3, y: 4, direction: "down" as const };
}