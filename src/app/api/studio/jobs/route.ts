/**
 * Trabajos del Estudio.
 * GET: los últimos del proyecto, con un enlace temporal al video cuando está listo.
 * POST { note, files: [{ path, type }] }: crea un trabajo y pide que se arme el video.
 */

import { STUDIO_BUCKET, studioConfigured, studioDb, studioDenied, studioProject, triggerRender } from "@/lib/studio";

export async function GET(request: Request) {
  const project = studioProject(request);
  if (!studioConfigured() || !project) return studioDenied();

  const { data, error } = await studioDb()
    .from("studio_jobs")
    .select("id, note, status, video_path, title, description, error, created_at, files")
    .eq("project", project.slug)
    .order("created_at", { ascending: false })
    .limit(20);
  if (error) {
    console.error("[studio] list failed", error);
    return Response.json({ error: "database_error" }, { status: 500 });
  }

  const jobs = await Promise.all(
    (data ?? []).map(async (job) => {
      let videoUrl: string | null = null;
      if (job.video_path) {
        const { data: signed } = await studioDb().storage.from(STUDIO_BUCKET).createSignedUrl(job.video_path, 60 * 60);
        videoUrl = signed?.signedUrl ?? null;
      }
      const { files, video_path: _videoPath, ...rest } = job;
      void _videoPath;
      return { ...rest, fileCount: Array.isArray(files) ? files.length : 0, videoUrl };
    }),
  );
  return Response.json({ jobs });
}

export async function POST(request: Request) {
  const project = studioProject(request);
  if (!studioConfigured() || !project) return studioDenied();

  let body: { note?: unknown; files?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const note = typeof body.note === "string" ? body.note.trim().slice(0, 300) : "";
  const prefix = `uploads/${project.slug}/`;
  const files = (Array.isArray(body.files) ? body.files : [])
    .filter(
      (f): f is { path: string; type: string } =>
        typeof f?.path === "string" && f.path.startsWith(prefix) && !f.path.includes("..") && typeof f?.type === "string",
    )
    .slice(0, 10)
    .map((f) => ({ path: f.path, type: f.type }));
  if (!files.length) return Response.json({ error: "no_files" }, { status: 400 });

  const { data, error } = await studioDb()
    .from("studio_jobs")
    .insert({ project: project.slug, note, files, status: "uploaded" })
    .select("id")
    .single();
  if (error || !data) {
    console.error("[studio] insert failed", error);
    return Response.json({ error: "database_error" }, { status: 500 });
  }

  const dispatched = await triggerRender();
  return Response.json({ id: data.id, dispatched });
}
