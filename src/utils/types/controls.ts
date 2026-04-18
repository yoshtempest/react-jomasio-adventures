export type GameControlLayer = {
    onConfirm?: () => void;
    onCancel?: () => void;
    onOpen?: () => void;
    blockGlobalOpen?: boolean;
};