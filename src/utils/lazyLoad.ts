import { lazy, type ComponentType, type LazyExoticComponent } from "react";

type PreloadableComponent<T = unknown> = LazyExoticComponent<
  ComponentType<T>
> & {
  preload: () => Promise<{ default: ComponentType<T> }>;
};

export function lazyLoad<T = unknown>(
  fn: () => Promise<{ default: ComponentType<T> }>,
): PreloadableComponent<T> {
  const Component = lazy(fn) as PreloadableComponent<T>;
  Component.preload = fn;
  return Component;
}
