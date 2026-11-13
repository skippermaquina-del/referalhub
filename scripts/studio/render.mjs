/**
 * Arma los Shorts del Estudio (/studio) con ffmpeg.
 *
 * Modo cola (GitHub Actions):
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/studio/render.mjs
 *   Toma los trabajos en estado "uploaded", baja las fotos y videos del almacén
 *   "studio", arma un video vertical 1080x1920 y lo sube a renders/<id>.mp4.
 *
 * Modo local (para probar sin Supabase):
 *   node scripts/studio/render.mjs --local [--keep-audio] [--prompt "<instrucciones>"] <proyecto> "<nota>" <salida.mp4> <archivo1> [archivo2 ...]
 *
 * Reglas del video:
 *   - Fotos: 3 s cada una con un acercamiento lento.
 *   - Videos: hasta 6 s cada uno, sin el audio original.
 *   - La nota se reparte en subtítulos grandes, una frase por plano.
 *   - Logo arriba y franja con teléfono y web abajo en todos los planos.
 *   - Transiciones con movimiento y música del proyecto.
 *   - Al final, 3,5 s de tarjeta con logo, nombre, teléfono y web del negocio.
 *   - Como máximo 10 archivos, para que el Short quede corto.
 *
 * Con "mantener el audio original" (keep_audio), los videos van completos (hasta
 * 90 s cada uno) con su sonido, solo con el logo arriba: sin música, subtítulos ni
 * franja encima. Cortes directos entre planos y música solo en la tarjeta final.
 *
 * Las instrucciones libres (prompt) las interpreta Claude: ver plan.mjs.
 */

import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { planFromPrompt } from "./plan.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const { studioProjects } = await import(join(ROOT, "src/data/studio-projects.ts"));

const W = 1080;
const H = 1920;
const FPS = 30;
const PHOTO_SECONDS = 3;
const VIDEO_MAX_SECONDS = 6;
const TALK_MAX_SECONDS = 90;
const END_SECONDS = 3.5;
const END_TALK_SECONDS = 5;
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

const hex = (c) => c.replace("#", "0x");
const TRANSITION = 0.35;
const TRANSITIONS = ["slideleft", "smoothup", "circleopen", "wipeleft", "slideup", "radial"];
const BAR_H = 210;
/**
 * TikTok, Reels y Shorts tapan los ~500 px de abajo con el nombre, los hashtags y
 * la música, así que la franja con teléfono y web va por encima de esa zona.
 */
const BAR_Y = H - 500 - BAR_H;

/** Divide la nota en frases cortas: una por plano. */
export function captionChunks(note) {
  const sentences = note
    .replace(/\s+/g, " ")
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.replace(/[.]+$/, "").trim())
    .filter(Boolean);
  const chunks = [];
  for (const s of sentences) {
    const words = s.split(" ");
    if (s.length <= 40) {
      chunks.push(s);
      continue;
    }
    for (let i = 0; i < words.length; i += 6) chunks.push(words.slice(i, i + 6).join(" "));
  }
  return chunks;
}

/** Texto en un archivo (drawtext lo lee de ahí para no pelear con comillas y dos puntos). */
function textFile(work, name, text) {
  const f = join(work, `${name}.txt`);
  writeFileSync(f, text);
  return escapePath(f);
}

/**
 * Lo que va encima de cada plano: logo y nombre arriba, subtítulo grande, y la
 * franja de abajo con teléfono y web. Entrada: [0:v] ya en 1080x1920; [1:v] = logo.
 */
function overlayGraph(project, work, i, caption, { logoOnly = false } = {}) {
  const bold = escapePath(FONT_BOLD);
  const medium = escapePath(FONT_MEDIUM);
  const top = [
    `[1:v]scale=118:-1[lg]`,
    `[0:v][lg]overlay=40:56`,
    `drawtext=fontfile='${bold}':textfile='${textFile(work, `name-${i}`, project.name)}':fontsize=44:fontcolor=white:x=176:y=96:shadowcolor=black@0.7:shadowx=2:shadowy=2`,
  ];
  if (logoOnly) return top.join(",");
  const parts = [
    ...top,
    `drawbox=x=0:y=${BAR_Y}:w=${W}:h=${BAR_H}:color=${hex(project.primary)}@0.92:t=fill`,
    `drawtext=fontfile='${bold}':textfile='${textFile(work, `phone-${i}`, project.phone)}':fontsize=74:fontcolor=${hex(project.accent)}:x=(w-text_w)/2:y=${BAR_Y + 30}`,
    `drawtext=fontfile='${medium}':textfile='${textFile(work, `web-${i}`, project.website)}':fontsize=38:fontcolor=white:x=(w-text_w)/2:y=${BAR_Y + 130}`,
  ];
  if (caption) {
    parts.push(
      `drawtext=fontfile='${bold}':textfile='${textFile(work, `cap-${i}`, wrap(caption, 18, 3))}':fontsize=78:fontcolor=white:text_align=C:` +
        `borderw=7:bordercolor=black@0.85:line_spacing=10:x=(w-text_w)/2:y=${BAR_Y - 70}-text_h:` +
        `alpha='min(1,t/0.25)'`,
    );
  }
  return parts.join(",");
}

const VIDEO_ENC = ["-c:v", "libx264", "-preset", "veryfast", "-crf", "21", "-pix_fmt", "yuv420p", "-r", String(FPS)];
const ENCODE = [...VIDEO_ENC, "-an"];
/** Con audio: mismo formato en todos los planos para poder unirlos con concat. */
const ENCODE_AV = [...VIDEO_ENC, "-c:a", "aac", "-b:a", "160k", "-ar", "44100", "-ac", "2"];
const SILENCE = ["-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo"];

function hasAudio(file) {
  return run("ffprobe", ["-v", "error", "-select_streams", "a", "-show_entries", "stream=index", "-of", "csv=p=0", file]).trim() !== "";
}

/** Movimiento de las fotos: acercar, alejar o desplazar, alternando. */
function photoMotion(i, frames) {
  const centerX = "iw/2-(iw/zoom/2)";
  const centerY = "ih/2-(ih/zoom/2)";
  switch (i % 3) {
    case 0:
      return `zoompan=z='min(zoom+0.0011,1.15)':d=${frames}:x='${centerX}':y='${centerY}'`;
    case 1:
      return `zoompan=z='if(eq(on,1),1.15,max(zoom-0.0011,1.0))':d=${frames}:x='${centerX}':y='${centerY}'`;
    default:
      return `zoompan=z=1.12:d=${frames}:x='(iw-iw/zoom)*on/${frames}':y='${centerY}'`;
  }
}

function photoSegment(src, out, i, project, work, caption, withAudio = false) {
  const d = PHOTO_SECONDS;
  const frames = Math.round(d * FPS);
  const base =
    `scale=${W * 1.2}:${H * 1.2}:force_original_aspect_ratio=increase,crop=${W * 1.2}:${H * 1.2},` +
    `${photoMotion(i, frames)}:s=${W}x${H}:fps=${FPS},setsar=1`;
  const graph = `[0:v]${base}[b];` + overlayGraph(project, work, i, caption).replace("[0:v]", "[b]");
  const audio = withAudio ? [...SILENCE] : [];
  const maps = withAudio ? ["-map", "[v]", "-map", "2:a"] : ["-map", "[v]"];
  run("ffmpeg", [
    "-y", "-i", src, "-i", join(ROOT, "public", project.logo), ...audio,
    "-filter_complex", graph + "[v]", ...maps, "-t", String(d), ...(withAudio ? ENCODE_AV : ENCODE), out,
  ]);
  return d;
}

function videoSegment(src, out, i, project, work, caption) {
  const total = duration(src);
  const d = Math.max(1.5, Math.min(VIDEO_MAX_SECONDS, total || VIDEO_MAX_SECONDS));
  const start = total > d + 1 ? Math.min(1, (total - d) / 2) : 0; // salta el primer segundo, que suele ser movido
  const base = `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},fps=${FPS},setsar=1`;
  const graph = `[0:v]${base}[b];` + overlayGraph(project, work, i, caption).replace("[0:v]", "[b]");
  run("ffmpeg", [
    "-y", "-ss", start.toFixed(2), "-i", src, "-i", join(ROOT, "public", project.logo),
    "-filter_complex", graph, "-t", d.toFixed(2), ...ENCODE, out,
  ]);
  return d;
}

/**
 * Video con su sonido (alguien habla): completo, encajado sobre un fondo borroso
 * del mismo video para no recortar nada, con el logo arriba y el volumen parejo.
 */
function talkSegment(src, out, i, project, work) {
  const total = duration(src);
  const d = Math.max(1, Math.min(TALK_MAX_SECONDS, total || TALK_MAX_SECONDS));
  const sound = hasAudio(src);
  const graph =
    `[0:v]split[a][b];` +
    `[a]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},boxblur=30:2,eq=brightness=-0.08[bg];` +
    `[b]scale=${W}:${H}:force_original_aspect_ratio=decrease[fg];` +
    `[bg][fg]overlay=(W-w)/2:(H-h)/2,fps=${FPS},setsar=1[c];` +
    overlayGraph(project, work, i, "", { logoOnly: true }).replace("[0:v]", "[c]") +
    "[v];" +
    (sound
      ? `[0:a]aresample=44100,loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=out:st=${Math.max(0, d - 0.4).toFixed(2)}:d=0.4[aout]`
      : `[2:a]anull[aout]`);
  run("ffmpeg", [
    "-y", "-i", src, "-i", join(ROOT, "public", project.logo), ...(sound ? [] : SILENCE),
    "-filter_complex", graph, "-map", "[v]", "-map", "[aout]", "-t", d.toFixed(2), ...ENCODE_AV, out,
  ]);
  return d;
}

function endCard(project, out, work, music = null) {
  const d = music === null ? END_SECONDS : END_TALK_SECONDS;
  const logo = join(ROOT, "public", project.logo);
  const bold = escapePath(FONT_BOLD);
  const medium = escapePath(FONT_MEDIUM);
  const vf =
    `[1:v]scale=440:-1[logo];[0:v][logo]overlay=(W-w)/2:330,` +
    `drawtext=fontfile='${bold}':textfile='${textFile(work, "end-name", project.name)}':fontsize=80:fontcolor=white:x=(w-text_w)/2:y=880,` +
    `drawtext=fontfile='${medium}':textfile='${textFile(work, "end-tag", project.tagline)}':fontsize=40:fontcolor=0xd5dbe7:x=(w-text_w)/2:y=1000,` +
    `drawtext=fontfile='${bold}':textfile='${textFile(work, "end-cta", project.cta)}':fontsize=52:fontcolor=white:x=(w-text_w)/2:y=1150,` +
    `drawtext=fontfile='${bold}':textfile='${textFile(work, "end-phone", project.phone)}':fontsize=104:fontcolor=${hex(project.accent)}:x=(w-text_w)/2:y=1240,` +
    `drawtext=fontfile='${medium}':textfile='${textFile(work, "end-web", project.website)}':fontsize=46:fontcolor=white:x=(w-text_w)/2:y=1400`;
  if (music === null) {
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
  // Con audio propio (modo "audio original"): entra con un fundido y lleva la música.
  const audioIn = music ? ["-stream_loop", "-1", "-i", music] : SILENCE;
  const af = music
    ? `[2:a]atrim=0:${d},asetpts=PTS-STARTPTS,aresample=44100,loudnorm=I=-16:TP=-1.5:LRA=11,afade=t=in:st=0:d=0.4,afade=t=out:st=${(d - 1.5).toFixed(2)}:d=1.5[aout]`
    : `[2:a]anull[aout]`;
  run("ffmpeg", [
    "-y",
    "-f", "lavfi", "-i", `color=c=${project.primary}:s=${W}x${H}:d=${d}:r=${FPS}`,
    "-i", logo,
    ...audioIn,
    "-filter_complex", `${vf},fade=t=in:st=0:d=0.4[v];${af}`,
    "-map", "[v]", "-map", "[aout]",
    "-t", String(d),
    ...ENCODE_AV,
    out,
  ]);
  return d;
}

/** Elige una pista de música del proyecto (la misma para el mismo trabajo). */
function pickMusic(project, seed) {
  const list = (project.music || []).map((m) => join(ROOT, "public", m)).filter((m) => existsSync(m));
  if (!list.length) return null;
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return list[h % list.length];
}

/** Arma el Short completo. Devuelve la duración en segundos. */
export function renderShort({ project, note, files, out, seed = note, keepAudio = false, music: withMusic = true, captions: customCaptions = null }) {
  if (!existsSync(FONT_BOLD)) throw new Error(`Font not found: ${FONT_BOLD}`);
  if (!files.length) throw new Error("No files to render");
  const work = mkdtempSync(join(tmpdir(), "studio-"));
  try {
    const items = files.slice(0, MAX_ITEMS);
    // customCaptions: [] = sin subtítulos; una lista = un subtítulo por plano.
    const chunks = customCaptions ?? captionChunks(note);
    const fillers = customCaptions ? [] : project.captions || [];
    const captionFor = (i) =>
      i < chunks.length ? chunks[i] : fillers.length ? fillers[(i - chunks.length) % fillers.length] : "";
    const music = withMusic ? pickMusic(project, seed) : null;

    if (keepAudio) return renderWithSound({ project, items, out, work, captionFor, music });

    const segments = [];
    const durations = [];
    items.forEach((file, i) => {
      const seg = join(work, `seg-${String(i).padStart(2, "0")}.mp4`);
      durations.push(
        isVideo(file)
          ? videoSegment(file, seg, i, project, work, captionFor(i))
          : photoSegment(normalizePhoto(file, work, i), seg, i, project, work, captionFor(i)),
      );
      segments.push(seg);
    });
    const end = join(work, "seg-end.mp4");
    durations.push(endCard(project, end, work));
    segments.push(end);

    // Une los planos con transiciones (xfade) en vez de cortes a negro.
    const inputs = segments.flatMap((s) => ["-i", s]);
    const filters = [];
    let last = "[0:v]";
    let offset = 0;
    for (let k = 1; k < segments.length; k++) {
      offset += durations[k - 1] - TRANSITION;
      const label = k === segments.length - 1 ? "[vout]" : `[x${k}]`;
      const tr = TRANSITIONS[(k - 1) % TRANSITIONS.length];
      filters.push(`${last}[${k}:v]xfade=transition=${tr}:duration=${TRANSITION}:offset=${offset.toFixed(3)}${label}`);
      last = label;
    }
    const total = durations.reduce((a, b) => a + b, 0) - TRANSITION * (segments.length - 1);
    if (segments.length === 1) filters.push("[0:v]copy[vout]");

    // Música: se repite si hace falta, volumen parejo y salida suave al final.
    const audioIdx = segments.length;
    const audioIn = music
      ? ["-stream_loop", "-1", "-i", music]
      : ["-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo"];
    if (music) {
      filters.push(
        `[${audioIdx}:a]atrim=0:${total.toFixed(2)},asetpts=PTS-STARTPTS,loudnorm=I=-16:TP=-1.5:LRA=11,` +
          `afade=t=in:st=0:d=0.5,afade=t=out:st=${Math.max(0, total - 1.5).toFixed(2)}:d=1.5[aout]`,
      );
    }

    run("ffmpeg", [
      "-y",
      ...inputs,
      ...audioIn,
      "-filter_complex", filters.join(";"),
      "-map", "[vout]",
      "-map", music ? "[aout]" : `${audioIdx}:a`,
      "-t", total.toFixed(2),
      "-c:v", "libx264", "-preset", "veryfast", "-crf", "22", "-pix_fmt", "yuv420p", "-r", String(FPS),
      "-c:a", "aac", "-b:a", "160k", "-ar", "44100", "-movflags", "+faststart",
      out,
    ]);
    return total;
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}

/**
 * Modo "audio original": cada plano lleva su propio sonido (los videos, el suyo;
 * las fotos, silencio; la tarjeta final, la música) y se unen con cortes directos.
 */
function renderWithSound({ project, items, out, work, captionFor, music }) {
  const segments = [];
  let total = 0;
  items.forEach((file, i) => {
    const seg = join(work, `seg-${String(i).padStart(2, "0")}.mp4`);
    total += isVideo(file)
      ? talkSegment(file, seg, i, project, work)
      : photoSegment(normalizePhoto(file, work, i), seg, i, project, work, captionFor(i), true);
    segments.push(seg);
  });
  const end = join(work, "seg-end.mp4");
  total += endCard(project, end, work, music ?? false);
  segments.push(end);

  const n = segments.length;
  const streams = segments.map((_, k) => `[${k}:v][${k}:a]`).join("");
  run("ffmpeg", [
    "-y",
    ...segments.flatMap((s) => ["-i", s]),
    "-filter_complex", `${streams}concat=n=${n}:v=1:a=1[v][a]`,
    "-map", "[v]", "-map", "[a]",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "22", "-pix_fmt", "yuv420p", "-r", String(FPS),
    "-c:a", "aac", "-b:a", "160k", "-ar", "44100", "-movflags", "+faststart",
    out,
  ]);
  return total;
}

/** Título y descripción listos para YouTube, Instagram y TikTok (sin inventar nada: sale de la nota). */
export function captions(project, note, plan = null) {
  const clean = note.replace(/\s+/g, " ").trim();
  const first = (clean.split(/(?<=[.!?])\s/)[0] || clean).slice(0, 70).trim();
  const title = plan?.title || (first ? `${first} | ${project.name}` : `${project.name} | ${project.tagline}`).slice(0, 100);
  const tags = [...new Set([...project.hashtags, ...(plan?.extraHashtags || [])])];
  const description = [plan?.descriptionBody || clean, project.descriptionFooter, tags.join(" ")].filter(Boolean).join("\n\n");
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

      const plan = await planFromPrompt({
        project,
        note: job.note,
        prompt: job.prompt,
        keepAudio: job.keep_audio === true,
        files: local.map((f) => ({ video: isVideo(f) })),
      });
      if (plan) console.log("Plan from instructions:", JSON.stringify(plan));
      const out = join(work, "short.mp4");
      const seconds = renderShort({
        project,
        note: job.note,
        files: local,
        out,
        seed: job.id,
        keepAudio: plan?.keepAudio ?? job.keep_audio === true,
        music: plan?.music ?? true,
        captions: plan?.captions ?? null,
      });
      const videoPath = `renders/${job.project}/${job.id}.mp4`;
      await supabase(`/storage/v1/object/${BUCKET}/${videoPath}`, {
        method: "POST",
        headers: { "Content-Type": "video/mp4", "x-upsert": "true" },
        body: readFileSync(out),
      });
      const { title, description } = captions(project, job.note, plan);
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
  // Opciones: --keep-audio, --prompt "<instrucciones>" (este último necesita ANTHROPIC_API_KEY).
  const rest = args.slice(1);
  const flag = (name) => {
    const i = rest.indexOf(name);
    if (i === -1) return undefined;
    const [, value] = rest.splice(i, name === "--prompt" ? 2 : 1);
    return value ?? true;
  };
  const keepAudio = flag("--keep-audio") === true;
  const prompt = flag("--prompt") || "";
  const [slug, note, out, ...files] = rest;
  const project = studioProjects[slug];
  if (!project) throw new Error(`Unknown project "${slug}"`);
  const plan = await planFromPrompt({ project, note, prompt, keepAudio, files: files.map((f) => ({ video: isVideo(f) })) });
  if (plan) console.log("Plan:", plan);
  const seconds = renderShort({
    project, note, files, out,
    keepAudio: plan?.keepAudio ?? keepAudio,
    music: plan?.music ?? true,
    captions: plan?.captions ?? null,
  });
  console.log(`Wrote ${out} (${seconds.toFixed(1)} s)`);
  console.log(captions(project, note, plan));
} else if (args.length === 0) {
  await processQueue();
}
