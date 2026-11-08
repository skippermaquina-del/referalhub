"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type Project = { slug: string; name: string; primary: string; accent: string; logo: string };
type Job = {
  id: string;
  note: string;
  status: "uploaded" | "rendering" | "ready" | "failed" | "sent" | "published" | "rejected";
  title: string | null;
  description: string | null;
  error: string | null;
  created_at: string;
  fileCount: number;
  videoUrl: string | null;
};
type Lang = "en" | "es" | "ru";

const MAX_BYTES = 50 * 1024 * 1024;
const CODE_KEY = "studio-code";
const LANG_KEY = "studio-lang";

const T = {
  en: {
    title: "Shorts Studio",
    code: "Access code",
    enter: "Enter",
    wrong: "Wrong code",
    notConfigured: "The studio is not set up yet.",
    pick: "Add photos and videos",
    pickHint: "Up to 10 files, 50 MB each. Short clips work best.",
    note: "What does it show?",
    notePh: "e.g. Sub-Zero fridge not cooling. Replaced the fan motor.",
    send: "Make the Short",
    sending: "Uploading…",
    tooBig: "too large (max 50 MB)",
    sent: "Sent. The video will be ready in a few minutes.",
    failedUpload: "Upload failed. Try again.",
    recent: "Your Shorts",
    none: "Nothing yet.",
    st: { uploaded: "In line", rendering: "Making the video…", ready: "Ready", failed: "Error", sent: "Waiting for approval", published: "Published", rejected: "Rejected" },
    files: "files",
    copy: "Copy",
    copied: "Copied",
    download: "Download",
    titleLbl: "Title",
    descLbl: "Description",
    logout: "Log out",
  },
  es: {
    title: "Estudio de Shorts",
    code: "Código de acceso",
    enter: "Entrar",
    wrong: "Código incorrecto",
    notConfigured: "El estudio todavía no está configurado.",
    pick: "Agregar fotos y videos",
    pickHint: "Hasta 10 archivos de 50 MB cada uno. Mejor clips cortos.",
    note: "¿Qué se ve?",
    notePh: "Ej.: Heladera Sub-Zero que no enfría. Se cambió el motor del ventilador.",
    send: "Armar el Short",
    sending: "Subiendo…",
    tooBig: "muy pesado (máx. 50 MB)",
    sent: "Enviado. El video estará listo en unos minutos.",
    failedUpload: "No se pudo subir. Probá de nuevo.",
    recent: "Tus Shorts",
    none: "Todavía nada.",
    st: { uploaded: "En cola", rendering: "Armando el video…", ready: "Listo", failed: "Error", sent: "Esperando aprobación", published: "Publicado", rejected: "Rechazado" },
    files: "archivos",
    copy: "Copiar",
    copied: "Copiado",
    download: "Descargar",
    titleLbl: "Título",
    descLbl: "Descripción",
    logout: "Salir",
  },
  ru: {
    title: "Студия Shorts",
    code: "Код доступа",
    enter: "Войти",
    wrong: "Неверный код",
    notConfigured: "Студия ещё не настроена.",
    pick: "Добавить фото и видео",
    pickHint: "До 10 файлов, до 50 МБ каждый. Лучше короткие ролики.",
    note: "Что на видео?",
    notePh: "Напр.: холодильник Sub-Zero не холодит. Заменил мотор вентилятора.",
    send: "Сделать Short",
    sending: "Загрузка…",
    tooBig: "слишком большой (макс. 50 МБ)",
    sent: "Отправлено. Видео будет готово через несколько минут.",
    failedUpload: "Не удалось загрузить. Попробуйте ещё раз.",
    recent: "Ваши Shorts",
    none: "Пока ничего.",
    st: { uploaded: "В очереди", rendering: "Собираю видео…", ready: "Готово", failed: "Ошибка", sent: "Ждёт одобрения", published: "Опубликовано", rejected: "Отклонено" },
    files: "файлов",
    copy: "Копировать",
    copied: "Скопировано",
    download: "Скачать",
    titleLbl: "Заголовок",
    descLbl: "Описание",
    logout: "Выйти",
  },
} as const;

function readStore(key: string): string {
  try {
    return localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
}
function writeStore(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
}

const supabase =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    : null;

export function StudioApp() {
  const [lang, setLang] = useState<Lang>("en");
  const t = T[lang];
  const [code, setCode] = useState("");
  const [project, setProject] = useState<Project | null>(null);
  const [loginError, setLoginError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [copied, setCopied] = useState("");

  const headers = useCallback((c: string) => ({ "x-studio-code": c, "Content-Type": "application/json" }), []);

  const login = useCallback(
    async (c: string) => {
      setLoginError("");
      const res = await fetch("/api/studio/session", { headers: headers(c), cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { project: Project };
        setProject(data.project);
        setCode(c);
        writeStore(CODE_KEY, c);
        return true;
      }
      writeStore(CODE_KEY, null);
      setLoginError(res.status === 503 ? T[lang].notConfigured : T[lang].wrong);
      return false;
    },
    [headers, lang],
  );

  const loadJobs = useCallback(async () => {
    if (!code) return;
    const res = await fetch("/api/studio/jobs", { headers: headers(code), cache: "no-store" });
    if (res.ok) setJobs(((await res.json()) as { jobs: Job[] }).jobs);
  }, [code, headers]);

  // Idioma y código recordados en este teléfono.
  useEffect(() => {
    const id = setTimeout(() => {
      const savedLang = readStore(LANG_KEY) as Lang;
      if (savedLang && savedLang in T) setLang(savedLang);
      const saved = readStore(CODE_KEY);
      if (saved) void login(saved);
    }, 0);
    return () => clearTimeout(id);
    // Solo al abrir la página.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mientras haya videos armándose, se revisa cada 10 s; si no, cada 30 s.
  const anyBusy = jobs.some((j) => j.status === "uploaded" || j.status === "rendering");
  useEffect(() => {
    if (!project) return;
    const first = setTimeout(() => void loadJobs(), 0);
    const timer = setInterval(() => void loadJobs(), anyBusy ? 10000 : 30000);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [project, loadJobs, anyBusy]);

  async function submit() {
    if (!project || !files.length || busy || !supabase) return;
    setBusy(true);
    setMessage("");
    try {
      const uploaded: { path: string; type: string }[] = [];
      for (const file of files) {
        const type = file.type || (file.name.toLowerCase().endsWith(".mov") ? "video/quicktime" : "image/jpeg");
        const res = await fetch("/api/studio/upload-url", {
          method: "POST",
          headers: headers(code),
          body: JSON.stringify({ type, size: file.size }),
        });
        if (!res.ok) throw new Error(`upload-url ${res.status}`);
        const { path, token } = (await res.json()) as { path: string; token: string };
        const { error } = await supabase.storage.from("studio").uploadToSignedUrl(path, token, file, { contentType: type });
        if (error) throw error;
        uploaded.push({ path, type });
      }
      const res = await fetch("/api/studio/jobs", {
        method: "POST",
        headers: headers(code),
        body: JSON.stringify({ note, files: uploaded }),
      });
      if (!res.ok) throw new Error(`jobs ${res.status}`);
      setFiles([]);
      setNote("");
      setMessage(t.sent);
      await loadJobs();
    } catch (err) {
      console.error(err);
      setMessage(t.failedUpload);
    } finally {
      setBusy(false);
    }
  }

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(""), 1500);
    } catch {
      /* el navegador no dejó copiar */
    }
  }

  const tooBig = files.filter((f) => f.size > MAX_BYTES);
  const accent = project?.accent ?? "#f26f21";
  const primary = project?.primary ?? "#1c2f58";

  const langPicker = (
    <div style={{ display: "flex", gap: 6 }}>
      {(Object.keys(T) as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => {
            setLang(l);
            writeStore(LANG_KEY, l);
          }}
          style={{
            padding: "4px 10px",
            borderRadius: 14,
            border: "1px solid #cbd5e1",
            background: l === lang ? primary : "white",
            color: l === lang ? "white" : "#334155",
            fontSize: 13,
            textTransform: "uppercase",
          }}
        >
          {l}
        </button>
      ))}
    </div>
  );

  if (!project) {
    return (
      <main style={styles.page}>
        <div style={{ ...styles.card, maxWidth: 380, margin: "60px auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h1 style={{ margin: 0, fontSize: 22, color: "#0f172a" }}>{t.title}</h1>
            {langPicker}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void login(code.trim());
            }}
          >
            <input
              type="password"
              autoComplete="current-password"
              placeholder={t.code}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={{ ...styles.button, background: primary }}>
              {t.enter}
            </button>
            {loginError && <p style={{ color: "#b91c1c", marginTop: 10 }}>{loginError}</p>}
          </form>
        </div>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.logo} alt="" width={44} height={44} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#0f172a" }}>{project.name}</div>
            <div style={{ fontSize: 13, color: "#64748b" }}>{t.title}</div>
          </div>
          {langPicker}
        </header>

        <section style={styles.card}>
          <label style={{ ...styles.pick, borderColor: accent }}>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              style={{ display: "none" }}
              onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 10))}
            />
            <span style={{ fontWeight: 700, color: primary, fontSize: 17 }}>＋ {t.pick}</span>
            <span style={{ fontSize: 13, color: "#64748b" }}>{t.pickHint}</span>
          </label>

          {files.length > 0 && (
            <ul style={{ listStyle: "none", padding: 0, margin: "12px 0", fontSize: 14, color: "#334155" }}>
              {files.map((f) => (
                <li key={f.name + f.size} style={{ padding: "4px 0" }}>
                  {f.type.startsWith("video") ? "🎬" : "📷"} {f.name} · {(f.size / 1024 / 1024).toFixed(1)} MB
                  {f.size > MAX_BYTES && <strong style={{ color: "#b91c1c" }}> — {t.tooBig}</strong>}
                </li>
              ))}
            </ul>
          )}

          <label style={{ display: "block", fontWeight: 600, margin: "14px 0 6px", color: "#0f172a" }}>{t.note}</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t.notePh}
            maxLength={300}
            rows={3}
            style={{ ...styles.input, resize: "vertical", fontFamily: "inherit" }}
          />

          <button
            type="button"
            onClick={() => void submit()}
            disabled={busy || !files.length || tooBig.length > 0}
            style={{ ...styles.button, background: accent, opacity: busy || !files.length || tooBig.length ? 0.5 : 1 }}
          >
            {busy ? t.sending : t.send}
          </button>
          {message && <p style={{ marginTop: 10, color: "#0f172a" }}>{message}</p>}
        </section>

        <h2 style={{ fontSize: 18, margin: "26px 0 10px", color: "#0f172a" }}>{t.recent}</h2>
        {jobs.length === 0 && <p style={{ color: "#64748b" }}>{t.none}</p>}
        {jobs.map((job) => (
          <article key={job.id} style={{ ...styles.card, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, fontSize: 13, color: "#64748b" }}>
              <span>
                {new Date(job.created_at).toLocaleString()} · {job.fileCount} {t.files}
              </span>
              <span
                style={{
                  padding: "2px 10px",
                  borderRadius: 12,
                  background: job.status === "ready" ? "#dcfce7" : job.status === "failed" ? "#fee2e2" : "#e0e7ff",
                  color: job.status === "ready" ? "#166534" : job.status === "failed" ? "#991b1b" : "#1e3a8a",
                  whiteSpace: "nowrap",
                }}
              >
                {t.st[job.status]}
              </span>
            </div>
            {job.note && <p style={{ margin: "8px 0", color: "#0f172a" }}>{job.note}</p>}
            {job.status === "failed" && job.error && (
              <p style={{ fontSize: 12, color: "#991b1b", wordBreak: "break-word" }}>{job.error.slice(-200)}</p>
            )}
            {job.videoUrl && (
              <>
                <video
                  src={job.videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  style={{ width: "100%", maxHeight: 520, borderRadius: 8, background: "#000", marginTop: 6 }}
                />
                {job.title && (
                  <CopyRow label={t.titleLbl} text={job.title} onCopy={() => void copy(job.title!, job.id + "t")} done={copied === job.id + "t"} t={t} />
                )}
                {job.description && (
                  <CopyRow label={t.descLbl} text={job.description} onCopy={() => void copy(job.description!, job.id + "d")} done={copied === job.id + "d"} t={t} />
                )}
                <a href={job.videoUrl} download style={{ display: "inline-block", marginTop: 10, color: primary, fontWeight: 600 }}>
                  ⬇ {t.download}
                </a>
              </>
            )}
          </article>
        ))}

        <button
          type="button"
          onClick={() => {
            writeStore(CODE_KEY, null);
            setProject(null);
            setCode("");
            setJobs([]);
          }}
          style={{ marginTop: 20, background: "none", border: "none", color: "#64748b", textDecoration: "underline" }}
        >
          {t.logout}
        </button>
      </div>
    </main>
  );
}

function CopyRow({
  label,
  text,
  onCopy,
  done,
  t,
}: {
  label: string;
  text: string;
  onCopy: () => void;
  done: boolean;
  t: (typeof T)[Lang];
}) {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b" }}>
        <span>{label}</span>
        <button type="button" onClick={onCopy} style={{ background: "none", border: "none", color: "#2563eb", fontSize: 13 }}>
          {done ? t.copied : t.copy}
        </button>
      </div>
      <div style={{ whiteSpace: "pre-wrap", fontSize: 14, color: "#0f172a", background: "#f8fafc", padding: 8, borderRadius: 6 }}>{text}</div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#f1f5f9", padding: "20px 16px 40px", fontFamily: "system-ui, -apple-system, sans-serif" },
  card: { background: "white", borderRadius: 12, padding: 16, boxShadow: "0 1px 3px rgba(15,23,42,0.08)" },
  input: { width: "100%", padding: "12px", fontSize: 16, border: "1px solid #cbd5e1", borderRadius: 8, boxSizing: "border-box", color: "#0f172a", background: "white" },
  button: { width: "100%", marginTop: 14, padding: "14px", fontSize: 17, fontWeight: 700, color: "white", border: "none", borderRadius: 10 },
  pick: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "22px 12px", border: "2px dashed", borderRadius: 12, cursor: "pointer", textAlign: "center" },
};
