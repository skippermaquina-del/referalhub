"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";
import type { Lang, Localized } from "@/data/eyeodin";

const STORAGE_KEY = "eyeodin-lang";

/**
 * El idioma vive fuera de React, en `localStorage`, así que se lee como lo
 * que es: un almacén externo. Resolverlo dentro de un efecto obligaría a un
 * `setState` en el montaje, que es justo lo que desaconseja el compilador.
 */
const listeners = new Set<() => void>();

/** Cache del valor resuelto. `getSnapshot` debe devolver siempre el mismo
 *  objeto mientras nada cambie, o React vuelve a renderizar sin parar. */
let current: Lang | null = null;

function resolve(): Lang {
  if (current) return current;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "es" || saved === "en") {
      current = saved;
      return current;
    }
  } catch {
    // Almacenamiento bloqueado: se cae al idioma del navegador.
  }
  current = navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
  return current;
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  // Otra pestaña puede cambiar el idioma: que esta se entere.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    current = event.newValue === "en" ? "en" : "es";
    listeners.forEach((listener) => listener());
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function write(next: Lang) {
  current = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // El idioma sigue funcionando, solo no se recuerda entre visitas.
  }
  listeners.forEach((listener) => listener());
}

type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Atajo para no repetir `copy[lang]` en cada línea de la página. */
  t: (value: Localized) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function useLang(): LangContextValue {
  const value = useContext(LangContext);
  if (!value) throw new Error("useLang debe usarse dentro de <LangProvider>");
  return value;
}

/**
 * Idioma de la landing. El servidor y la hidratación pintan español; ya
 * hidratado, React vuelve a preguntar al almacén y aplica la preferencia
 * guardada o la del navegador.
 *
 * Envuelve al contenido en el `<div>` raíz para marcar ahí el `lang`
 * correcto sin tocar el `<html>` del resto del sitio.
 */
export function LangProvider({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  const lang = useSyncExternalStore<Lang>(subscribe, resolve, () => "es");
  const t = useCallback((value: Localized) => value[lang], [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang: write, t }}>
      <div className={className} lang={lang}>
        {children}
      </div>
    </LangContext.Provider>
  );
}
