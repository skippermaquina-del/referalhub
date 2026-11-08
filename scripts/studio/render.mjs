/**
 * Arma los Shorts del Estudio (/studio) con ffmpeg.
 *
 * Modo cola (GitHub Actions):
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/studio/render.mjs
 *   Toma los trabajos en estado "uploaded", baja las fotos y videos del almacén
 *   "studio", arma un video vertical 1080x1920 y lo sube a renders/<id>.mp4.
 *
 * Modo local (para probar sin Supabase):
 *   node scripts/studio/render.mjs --local <proyecto> "<nota>" <salida.mp4> <archivo1> [archivo2 ...]
 *
 * Reglas del video:
 *   - Fotos: 3 s cada una con un acercamiento lento.
 *   - Videos: hasta 6 s cada uno, sin el audio original.
 *   - La nota aparece arriba en el primer plano.
 *   - Al final, 3,5 s de tarjeta con logo, nombre, teléfono y web del negocio.
 *   - Como máximo 10 archivos, para que el Short quede corto.
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const { studioProjects } = await import(join(ROOT, "src/data/studio-projects.ts"));

const W = 1080;
const H = 1920;
const FPS = 30;
const PHOTO_SECONDS = 3;
const VIDEO_MAX_SECONDS = 6;
const END_SECONDS = 3.5;
const MAX_ITEMS = 10;
const FONT_DIR = process.env.STUDIO_FONT_DIR || "/usr/share/fonts/opentype/inter";
const FONT_BOLD = join(FONT_DIR, "Inter-Bold.otf");
const FONT_MEDIUM = join(FONT_DIR, "Inter-Medium.otf");
const BUCKET = "studio";

const VIDEO_EXT = new Set([".mp4", ".mov", ".m4v", ".webm", ".qt"]);

function run(cmd, args) {
  return execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"], maxBuffer: 64 * 1024 * 1024 }).toString();
}

function has(cmd) {
  try {
    execFileSync("which", [cmd], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

/** Corta el texto en renglones de hasta `max` caracteres (sin partir palabras). */
export function wrap(text, max = 26, maxLines = 5) {
  const words = text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines = [];
  let line = "";
  for (const w of words) {
    if ((line + " " + w).trim().length > max && line) {
      lines.push(line);
      line = w;
    } else {
      line = (line + " " + w).trim();
    }
  }
  if (line) lines.push(line);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = kept[maxLines - 1].replace(/\s*\S*$/, "") + "…";
    return kept.join("\n");
  }
  return lines.join("\n");
}

function isVideo(file) {
  return VIDEO_EXT.has(extname(file).toLowerCase());
}

function duration(file) {
  const out = run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", file]);
  return parseFloat(out) || 0;
}

/** Fotos: HEIC a JPG y giro según EXIF, para que ffmpeg las lea derechas. */
function normalizePhoto(file, work, i) {
  let src = file;
  const ext = extname(file).toLowerCase();
  if ((ext === ".heic" || ext === ".heif") && has("heif-convert")) {
    const jpg = join(work, `heic-${i}.jpg`);
    run("heif-convert", [file, jpg]);
    src = jpg;
  }
  const tool = has("magick") ? "magick" : has("convert") ? "convert" : null;
  if (!tool) return src;
  const out = join(work, `photo-${i}.jpg`);
  run(tool, [src, "-auto-orient", "-strip", "-quality", "92", out]);
  return out;
}

function escapePath(p) {
  return p.replace(/\\/g, "/").replace(/:/g, "\\:").replace(/'/g, "\\'");
}

function captionFilter(captionFile, project) {
  if (!captionFile) return "";
  const box = project.primary.replace("#", "0x");
  return (
    `,drawtext=fontfile='${escapePath(FONT_BOLD)}':textfile='${escapePath(captionFile)}':` +
    `fontsize=62:fontcolor=white:line_spacing=14:x=(w-text_w)/2:y=190:` +
    `box=1:boxcolor=${box}@0.88:boxborderw=34`
  );
}

function fades(d) {
  return `,fade=t=in:st=0:d=0.25,fade=t=out:st=${(d - 0.25).toFixed(2)}:d=0.25`;
}

const ENCODE = ["-c:v", "libx264", "-preset", "veryfast", "-crf", "21", "-pix_fmt", "yuv420p", "-r", String(FPS), "-an"];

function photoSegment(src, out, captionFile, project) {
  const d = PHOTO_SECONDS;
  const frames = d * FPS;
  const vf =
    `scale=${W * 1.2}:${H * 1.2}:force_original_aspect_ratio=increase,crop=${W * 1.2}:${H * 1.2},` +
    `zoompan=z='min(zoom+0.0009,1.12)':d=${frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=${W}x${H}:fps=${FPS},` +
    `setsar=1` +
    captionFilter(captionFile, project) +
    fades(d);
  run("ffmpeg", ["-y", "-i", src, "-vf", vf, "-t", String(d), ...ENCODE, out]);
  return d;
}

function videoSegment(src, out, captionFile, project) {
  const total = duration(src);
  const d = Math.max(1, Math.min(VIDEO_MAX_SECONDS, total || VIDEO_MAX_SECONDS));
  const vf =
    `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},fps=${FPS},setsar=1` +
    captionFilter(captionFile, project) +
    fades(d);
  run("ffmpeg", ["-y", "-i", src, "-t", d.toFixed(2), "-vf", vf, ...ENCODE, out]);
  return d;
}

function endCard(project, out, work) {
  const d = END_SECONDS;
  const logo = join(ROOT, "public", project.logo);
  const text = (name, s) => {
    const f = join(work, `end-${name}.txt`);
    writeFileSync(f, s);
    return escapePath(f);
  };
  const accent = project.accent.replace("#", "0x");
  const vf =
    `[1:v]scale=440:-1[logo];[0:v][logo]overlay=(W-w)/2:330,` +
    `drawtext=fontfile='${escapePath(FONT_BOLD)}':textfile='${text("name", project.name)}':fontsize=80:fontcolor=white:x=(w-text_w)/2:y=880,` +
    `drawtext=fontfile='${escapePath(FONT_MEDIUM)}':textfile='${text("tag", project.tagline)}':fontsize=40:fontcolor=0xd5dbe7:x=(w-text_w)/2:y=1000,` +
    `drawtext=fontfile='${escapePath(FONT_BOLD)}':textfile='${text("phone", project.phone)}':fontsize=96:fontcolor=${accent}:x=(w-text_w)/2:y=1210,` +
    `drawtext=fontfile='${escapePath(FONT_MEDIUM)}':textfile='${text("web", project.website)}':fontsize=46:fontcolor=white:x=(w-text_w)/2:y=1360,` +
    `fade=t=in:st=0:d=0.3`;
  run("ffmpeg", [
    "-y",
    "-f", "lavfi", "-i", `color=c=${project.primary}:s=${W}x${H}:d=${d}:r=${FPS}`,
    "-i", logo,
    "-filter_complex", vf,
    "-t", String(d),
    ...ENCODE,
    out,
  ]);
  return d;
}

/** Arma el Short completo. Devuelve la duración en segundos. */
export function renderShort({ project, note, files, out }) {
  if (!existsSync(FONT_BOLD)) throw new Error(`Font not found: ${FONT_BOLD}`);
  if (!files.length) throw new Error("No files to render");
  const work = mkdtempSync(join(tmpdir(), "studio-"));
  try {
    const items = files.slice(0, MAX_ITEMS);
    const captionText = wrap(note);
    const captionFile = captionText ? join(work, "caption.txt") : null;
    if (captionFile) writeFileSync(captionFile, captionText);

    const segments = [];
    let total = 0;
    items.forEach((file, i) => {
      const seg = join(work, `seg-${String(i).padStart(2, "0")}.mp4`);
      const cap = i === 0 ? captionFile : null;
      total += isVideo(file)
        ? videoSegment(file, seg, cap, project)
        : photoSegment(normalizePhoto(file, work, i), seg, cap, project);
      segments.push(seg);
    });
    const end = join(work, "seg-end.mp4");
    total += endCard(project, end, work);
    segments.push(end);

    const list = join(work, "list.txt");
    writeFileSync(list, segments.map((s) => `file '${s}'`).join("\n"));
    run("ffmpeg", [
      "-y",
      "-f", "concat", "-safe", "0", "-i", list,
      "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo",
      "-map", "0:v", "-map", "1:a", "-shortest",
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "22", "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart",
      out,
    ]);
    return total;
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

/** Título y descripción listos para YouTube, Instagram y TikTok (sin inventar nada: sale de la nota). */
export function captions(project, note) {
  const clean = note.replace(/\s+/g, " ").trim();
  const first = (clean.split(/(?<=[.!?])\s/)[0] || clean).slice(0, 70).trim();
  const title = (first ? `${first} | ${project.name}` : `${project.name} | ${project.tagline}`).slice(0, 100);
  const description = [clean, project.descriptionFooter, project.hashtags.join(" ")].filter(Boolean).join("\n\n");
  return { title, description };
}

/* ---------------- Cola en Supabase ---------------- */

async function supabase(path, init = {}) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  const res = await fetch(`${url}${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, ...(init.headers || {}) },
  });
  if (!res.ok) throw new Error(`Supabase ${init.method || "GET"} ${path.split("?")[0]} → ${res.status}: ${await res.text()}`);
  return res;
}

async function updateJob(id, fields, onlyIfStatus) {
  const filter = onlyIfStatus ? `&status=eq.${onlyIfStatus}` : "";
  const res = await supabase(`/rest/v1/studio_jobs?id=eq.${id}${filter}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify({ ...fields, updated_at: new Date().toISOString() }),
  });
  return res.json();
}

async function processQueue() {
  const res = await supabase(`/rest/v1/studio_jobs?status=eq.uploaded&order=created_at.asc&limit=5`);
  const jobs = await res.json();
  console.log(`${jobs.length} job(s) waiting`);

  for (const job of jobs) {
    const claimed = await updateJob(job.id, { status: "rendering" }, "uploaded");
    if (!claimed.length) continue; // otro proceso lo tomó

    const work = mkdtempSync(join(tmpdir(), "studio-dl-"));
    try {
      const project = studioProjects[job.project];
      if (!project) throw new Error(`Unknown project "${job.project}"`);

      const local = [];
      for (const [i, f] of job.files.entries()) {
        const file = await supabase(`/storage/v1/object/${BUCKET}/${encodeURI(f.path)}`);
        const dest = join(work, `in-${i}${extname(f.path) || ".bin"}`);
        writeFileSync(dest, Buffer.from(await file.arrayBuffer()));
        local.push(dest);
      }

      const out = join(work, "short.mp4");
      const seconds = renderShort({ project, note: job.note, files: local, out });
      const videoPath = `renders/${job.project}/${job.id}.mp4`;
      await supabase(`/storage/v1/object/${BUCKET}/${videoPath}`, {
        method: "POST",
        headers: { "Content-Type": "video/mp4", "x-upsert": "true" },
        body: readFileSync(out),
      });
      const { title, description } = captions(project, job.note);
      await updateJob(job.id, { status: "ready", video_path: videoPath, title, description, error: null });
      console.log(`✓ ${job.id} (${seconds.toFixed(1)} s)`);
    } catch (err) {
      console.error(`✗ ${job.id}`, err);
      const msg = String(err?.stderr || err?.message || err).slice(-500);
      await updateJob(job.id, { status: "failed", error: msg });
    } finally {
      rmSync(work, { recursive: true, force: true });
    }
  }
}

/* ---------------- Entrada ---------------- */

const args = process.argv.slice(2);
if (args[0] === "--local") {
  const [, slug, note, out, ...files] = args;
  const project = studioProjects[slug];
  if (!project) throw new Error(`Unknown project "${slug}"`);
  const seconds = renderShort({ project, note, files, out });
  console.log(`Wrote ${out} (${seconds.toFixed(1)} s)`);
  console.log(captions(project, note));
} else if (args.length === 0) {
  await processQueue();
}
