export type GameControlLayer = {
    onConfirm?: () => void;
    onCancel?: () => void;
    onOpen?: () => void;

    onUp?: () => void;
    onDown?: () => void;
    onLeft?: () => void;
    onRight?: () => void;

    onUpRelease?: () => void;
    onDownRelease?: () => void;
    onLeftRelease?: () => void;
    onRightRelease?: () => void;

    blockGlobalOpen?: boolean;
};