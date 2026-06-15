type BaseDependencies = {
  setPopup: (msg: string) => void;
};

export function createInteractionMap<TDeps extends BaseDependencies>(
  messages: Record<string, string>,
  deps: TDeps,
  custom?: Record<string, (deps: TDeps) => void>,
) {
  const interactions: Record<string, () => void> = Object.fromEntries(
    Object.entries(messages).map(([key, message]) => [
      key,
      () => deps.setPopup(message),
    ]),
  );

  if (custom) {
    for (const key in custom) {
      interactions[key] = () => custom[key](deps);
    }
  }

  return interactions;
}
