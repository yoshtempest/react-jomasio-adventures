export type GameControlLayer = {
  onConfirm?: () => boolean | void;
  onCancel?: () => boolean | void;
  onOpen?: () => boolean | void;

  onUp?: () => boolean | void;
  onDown?: () => boolean | void;
  onLeft?: () => boolean | void;
  onRight?: () => boolean | void;

  onConfirmRelease?: () => void;
  onCancelRelease?: () => void;

  onUpRelease?: () => void;
  onDownRelease?: () => void;
  onLeftRelease?: () => void;
  onRightRelease?: () => void;

  blockGlobalOpen?: boolean;
};
