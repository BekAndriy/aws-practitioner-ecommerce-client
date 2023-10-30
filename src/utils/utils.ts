const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const formatAsPrice = (price: number) => priceFormatter.format(price);

interface MapArray {
  <T, K extends keyof T>(
    values: T[],
    key: K,
    initMap?: Map<T[K], T>,
  ): Map<T[K], T>;
  <T, C extends (item: T) => unknown>(
    values: T[],
    callback: C,
    initMap?: Map<ReturnType<C>, T>,
  ): Map<ReturnType<C>, T>;
}

export const mapArray: MapArray = <T>(
  values: T[],
  key: unknown,
  initMap: Map<unknown, T> = new Map(),
) => {
  const res = values.reduce((mapped, item) => {
    const parsedKey =
      typeof key === "function" ? key(item) : item[key as keyof T];
    return mapped.set(parsedKey, item);
  }, initMap);
  return res;
};
