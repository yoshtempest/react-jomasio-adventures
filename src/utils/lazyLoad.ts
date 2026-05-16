import { lazy } from "react";

export function lazyLoad(fn: () => Promise<any>) {
  const Component = lazy(fn);
  (Component as any).preload = fn;
  return Component;
}