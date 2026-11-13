import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

/** Ett fält i statusraden: ren text ("done") eller [etikett, värde] ("claims", 3). */
export type SbarItem = string | [string, string | number];
type Items = SbarItem[] | null;

const Ctx = createContext<{ items: Items; set: (i: Items) => void }>({ items: null, set: () => {} });

export function SbarProvider({ children }: { children: ReactNode }) {
  const [items, set] = useState<Items>(null);
  return <Ctx.Provider value={{ items, set }}>{children}</Ctx.Provider>;
}

export const useSbarItems = () => useContext(Ctx).items;

/** Låter en sida (t.ex. rapporten) ta över mittfältet i statusraden. */
export function useSbar(items: Items) {
  const { set } = useContext(Ctx);
  const key = JSON.stringify(items);
  useEffect(() => {
    set(key === 'null' ? null : (JSON.parse(key) as Items));
  }, [key, set]);
  useEffect(() => () => set(null), [set]);
}
