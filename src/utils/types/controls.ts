export type GameControlLayer = {
    onConfirm?: () => boolean | void;
    onCancel?: () => boolean | void;
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