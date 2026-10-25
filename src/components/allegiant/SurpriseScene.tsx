"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Escena 3D "Caja sorpresa": cajas de cartón con los aparatos que reparamos
 * (se agarran y se lanzan, vuelven solas) y un regalo que explota en fuegos
 * artificiales. Se carga bajo demanda (next/dynamic) al acercarse al scroll.
 */

type Props = {
  /** Texto de las cajas (según el idioma): nombres de aparatos, lema y "frágil". */
  labels: string[];
  tagline: string;
  fragile: string;
  active: boolean;
  opened: boolean;
  onOpen: () => void;
  onUnsupported: () => void;
};

const PALETTE = [0xf26b21, 0xffffff, 0x4d7cff, 0xffc36b, 0xff8a4d];
const CAM_Z = 12;
const FOV = 50;

function makeTex(draw: (g: CanvasRenderingContext2D, w: number, h: number) => void) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  draw(c.getContext("2d")!, 512, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

function kraft(g: CanvasRenderingContext2D, w: number, h: number) {
  g.fillStyle = "#c39459";
  g.fillRect(0, 0, w, h);
  for (let i = 0; i < 2400; i++) {
    g.fillStyle = `rgba(${90 + Math.random() * 60},${60 + Math.random() * 40},30,${Math.random() * 0.08})`;
    g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 3, 1);
  }
  const gr = g.createLinearGradient(0, 0, w, h);
  gr.addColorStop(0, "rgba(255,255,255,.07)");
  gr.addColorStop(1, "rgba(0,0,0,.14)");
  g.fillStyle = gr;
  g.fillRect(0, 0, w, h);
}

function frontTex(label: string, tagline: string) {
  return makeTex((g, w, h) => {
    kraft(g, w, h);
    g.fillStyle = "rgba(242,107,33,.95)"; // cinta naranja
    g.fillRect(0, 0, w, h * 0.09);
    g.textAlign = "center";
    g.fillStyle = "#1b2f57";
    g.font = "900 62px Arial Black, Arial";
    g.fillText("ALLEGIANT", w / 2, h * 0.34);
    g.fillStyle = "#f26b21";
    g.font = "800 26px Arial";
    g.fillText("A P P L I A N C E S", w / 2, h * 0.43);
    g.strokeStyle = "rgba(60,35,10,.6)";
    g.lineWidth = 4;
    g.strokeRect(w * 0.12, h * 0.52, w * 0.76, h * 0.2);
    g.fillStyle = "rgba(60,35,10,.85)";
    // El nombre se achica hasta caber dentro del recuadro.
    let size = 44;
    g.font = `800 ${size}px Arial`;
    while (size > 22 && g.measureText(label.toUpperCase()).width > w * 0.7) {
      size -= 2;
      g.font = `800 ${size}px Arial`;
    }
    g.fillText(label.toUpperCase(), w / 2, h * 0.65);
    g.font = "700 24px Arial";
    g.fillStyle = "rgba(60,35,10,.65)";
    g.fillText(tagline, w / 2, h * 0.85);
  });
}

function sideTex(fragile: string) {
  return makeTex((g, w, h) => {
    kraft(g, w, h);
    g.fillStyle = "rgba(242,107,33,.95)";
    g.fillRect(0, 0, w, h * 0.09);
    g.save();
    g.translate(w / 2, h / 2);
    g.rotate(-0.1);
    g.fillStyle = "#1b2f57";
    g.fillRect(-150, -42, 300, 84);
    g.fillStyle = "#fff";
    g.font = "900 46px Arial Black, Arial";
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(fragile, 0, 2);
    g.restore();
  });
}

function topTex() {
  return makeTex((g, w, h) => {
    kraft(g, w, h);
    g.fillStyle = "rgba(242,107,33,.95)";
    g.fillRect(w * 0.42, 0, w * 0.16, h);
  });
}

function spriteTex() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.4, "rgba(255,255,255,.6)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

type Toy = {
  mesh: THREE.Mesh;
  home: THREE.Vector3;
  vel: THREE.Vector3;
  ang: THREE.Vector3;
  held: boolean;
  phase: number;
};

export default function SurpriseScene({ labels, tagline, fragile, active, opened, onOpen, onUnsupported }: Props) {
  const mount = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);
  const openRef = useRef<() => void>(() => {});
  const onOpenRef = useRef(onOpen);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  useEffect(() => {
    onOpenRef.current = onOpen;
  }, [onOpen]);
  useEffect(() => {
    if (opened) openRef.current();
  }, [opened]);

  useEffect(() => {
    const host = mount.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      onUnsupported();
      return;
    }
    const small = Math.min(window.innerWidth, window.innerHeight) < 700;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    const canvas = renderer.domElement;
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;touch-action:pan-y;";
    host.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    camera.position.set(0, 0.8, CAM_Z);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.HemisphereLight(0x9fb4ff, 0x2a1a08, 0.7));
    const key = new THREE.DirectionalLight(0xffe0b8, 1.5);
    key.position.set(-4, 6, 8);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x6f92ff, 0.8);
    rim.position.set(5, 3, -6);
    scene.add(rim);
    const glow = new THREE.PointLight(0xf26b21, 0, 30);
    glow.position.set(0, 1, 4);
    scene.add(glow);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(o: T) => {
      disposables.push(o);
      return o;
    };

    // ---- cajas ----
    const side = track(sideTex(fragile));
    const top = track(topTex());
    const sideMat = track(new THREE.MeshStandardMaterial({ map: side, roughness: 0.9 }));
    const topMat = track(new THREE.MeshStandardMaterial({ map: top, roughness: 0.85 }));
    const toys: Toy[] = labels.map((label, k) => {
      const front = track(frontTex(label, tagline));
      const frontMat = track(new THREE.MeshStandardMaterial({ map: front, roughness: 0.9 }));
      const geo = track(new THREE.BoxGeometry(1.5, 1.2, 1.35));
      const mesh = new THREE.Mesh(geo, [sideMat, sideMat, topMat, topMat, frontMat, sideMat]);
      scene.add(mesh);
      return {
        mesh,
        home: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        ang: new THREE.Vector3((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.4, 0),
        held: false,
        phase: k * 1.7,
      };
    });

    // ---- regalo ----
    const gift = new THREE.Group();
    const giftMat = track(new THREE.MeshStandardMaterial({ color: 0x35599f, roughness: 0.35, metalness: 0.15, emissive: 0x0d1d44 }));
    const ribbonMat = track(new THREE.MeshStandardMaterial({ color: 0xf26b21, roughness: 0.4, emissive: 0x3a1503 }));
    const body = new THREE.Mesh(track(new THREE.BoxGeometry(3, 2.4, 3)), giftMat);
    gift.add(body);
    const rb1 = new THREE.Mesh(track(new THREE.BoxGeometry(3.05, 2.42, 0.45)), ribbonMat);
    const rb2 = new THREE.Mesh(track(new THREE.BoxGeometry(0.45, 2.42, 3.05)), ribbonMat);
    gift.add(rb1, rb2);
    const lid = new THREE.Group();
    lid.add(new THREE.Mesh(track(new THREE.BoxGeometry(3.3, 0.5, 3.3)), giftMat));
    lid.add(new THREE.Mesh(track(new THREE.BoxGeometry(3.35, 0.52, 0.45)), ribbonMat));
    lid.add(new THREE.Mesh(track(new THREE.BoxGeometry(0.45, 0.52, 3.35)), ribbonMat));
    for (const r of [0.6, -0.6]) {
      const bow = new THREE.Mesh(track(new THREE.TorusGeometry(0.5, 0.14, 12, 28)), ribbonMat);
      bow.position.set(r * 0.9, 0.55, 0);
      bow.rotation.set(Math.PI / 2.3, 0, r > 0 ? 0.6 : -0.6);
      lid.add(bow);
    }
    lid.position.y = 1.3;
    gift.add(lid);
    const giftPick = new THREE.Mesh(
      track(new THREE.BoxGeometry(3.6, 3.4, 3.6)),
      track(new THREE.MeshBasicMaterial({ visible: false })),
    );
    gift.add(giftPick);
    scene.add(gift);

    // ---- fuegos artificiales ----
    const FW = small ? 500 : 1000;
    const fwPos = new Float32Array(FW * 3).fill(-999);
    const fwCol = new Float32Array(FW * 3);
    const fwVel = new Float32Array(FW * 3);
    const fwLife = new Float32Array(FW);
    const fwBase = new Float32Array(FW * 3);
    const fwGeo = track(new THREE.BufferGeometry());
    fwGeo.setAttribute("position", new THREE.BufferAttribute(fwPos, 3));
    fwGeo.setAttribute("color", new THREE.BufferAttribute(fwCol, 3));
    const sprite = track(spriteTex());
    const fwMat = track(
      new THREE.PointsMaterial({
        size: small ? 0.5 : 0.42,
        map: sprite,
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    );
    const fireworks = new THREE.Points(fwGeo, fwMat);
    fireworks.frustumCulled = false;
    scene.add(fireworks);
    let fwNext = 0;
    const burst = (x: number, y: number, z: number, n: number) => {
      const c1 = new THREE.Color(PALETTE[(Math.random() * PALETTE.length) | 0]);
      const c2 = new THREE.Color(PALETTE[(Math.random() * PALETTE.length) | 0]);
      const speed = 4.5 + Math.random() * 3;
      for (let k = 0; k < n; k++) {
        const i = fwNext;
        fwNext = (fwNext + 1) % FW;
        const u = Math.random() * 2 - 1;
        const th = Math.random() * Math.PI * 2;
        const r = Math.sqrt(1 - u * u);
        const sp = speed * (0.7 + Math.random() * 0.3);
        fwPos[i * 3] = x;
        fwPos[i * 3 + 1] = y;
        fwPos[i * 3 + 2] = z;
        fwVel[i * 3] = Math.cos(th) * r * sp;
        fwVel[i * 3 + 1] = u * sp;
        fwVel[i * 3 + 2] = Math.sin(th) * r * sp * 0.6;
        const c = k % 3 === 0 ? c2 : c1;
        fwBase[i * 3] = c.r;
        fwBase[i * 3 + 1] = c.g;
        fwBase[i * 3 + 2] = c.b;
        fwLife[i] = 1;
      }
    };

    // ---- apertura ----
    let lidPop = 0;
    let giftPulse = 0;
    let flash = 0;
    let done = false;
    const timers: number[] = [];
    openRef.current = () => {
      if (done) return;
      done = true;
      lidPop = 1;
      giftPulse = 1;
      flash = 1;
      const at = (ms: number, x: number, y: number) =>
        timers.push(window.setTimeout(() => burst(x, y, 1.5, small ? 160 : 260), ms));
      at(0, 0, 2.2);
      at(250, -2.6, 3.2);
      at(450, 2.7, 3.0);
      at(750, -1.2, 4.2);
      at(950, 1.4, 4.4);
    };

    // ---- tamaño y distribución ----
    let wVis = 10;
    let hVis = 10;
    const layout = () => {
      const w = host.clientWidth || 600;
      const h = host.clientHeight || 400;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      hVis = 2 * CAM_Z * Math.tan((FOV * Math.PI) / 360);
      wVis = hVis * camera.aspect;
      const portrait = camera.aspect < 0.9;
      const fr = portrait
        ? [[-0.3, 0.3], [0.3, 0.26], [-0.3, -0.34], [0.3, -0.36], [0, 0.44]]
        : [[-0.36, 0.1], [0.36, 0.14], [-0.22, -0.3], [0.25, -0.32], [0, 0.38]];
      const s = Math.max(portrait ? 0.85 : 0.7, Math.min(1.15, wVis * 0.085));
      toys.forEach((t, i) => {
        t.home.set(fr[i][0] * wVis, fr[i][1] * hVis, 0.5);
        t.mesh.scale.setScalar(s);
        if (t.vel.lengthSq() < 0.001 && !t.held) t.mesh.position.copy(t.home);
      });
      const gs = Math.max(0.5, Math.min(1, wVis / 9, hVis / 7));
      gift.scale.setScalar(gs);
      gift.position.set(0, -0.3, 0);
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(host);

    // ---- interacción ----
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const plane = new THREE.Plane();
    const hit = new THREE.Vector3();
    const off = new THREE.Vector3();
    const lastP = new THREE.Vector3();
    let lastT = 0;
    let held: Toy | null = null;
    const setNdc = (cx: number, cy: number) => {
      const r = canvas.getBoundingClientRect();
      ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
    };
    const pickToy = (cx: number, cy: number) => {
      setNdc(cx, cy);
      const hs = ray.intersectObjects(toys.map((t) => t.mesh), false);
      return hs.length ? toys.find((t) => t.mesh === hs[0].object) ?? null : null;
    };
    const pickGift = (cx: number, cy: number) => {
      setNdc(cx, cy);
      return ray.intersectObject(giftPick, false).length > 0;
    };
    const down = (e: PointerEvent) => {
      const t = pickToy(e.clientX, e.clientY);
      if (t) {
        held = t;
        t.held = true;
        t.vel.set(0, 0, 0);
        plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(new THREE.Vector3()).negate(), t.mesh.position);
        ray.ray.intersectPlane(plane, hit);
        off.copy(t.mesh.position).sub(hit);
        lastP.copy(t.mesh.position);
        lastT = performance.now();
        canvas.setPointerCapture(e.pointerId);
        canvas.style.cursor = "grabbing";
        return;
      }
      if (pickGift(e.clientX, e.clientY)) onOpenRef.current();
    };
    const move = (e: PointerEvent) => {
      if (!held) {
        canvas.style.cursor = pickToy(e.clientX, e.clientY) ? "grab" : pickGift(e.clientX, e.clientY) ? "pointer" : "";
        return;
      }
      setNdc(e.clientX, e.clientY);
      if (ray.ray.intersectPlane(plane, hit)) {
        const now = performance.now();
        const dt = Math.max(8, now - lastT) / 1000;
        const np = hit.clone().add(off);
        held.vel.lerp(np.clone().sub(lastP).divideScalar(dt), 0.5);
        held.ang.set(held.vel.y * 0.25, held.vel.x * 0.25, 0);
        held.mesh.position.copy(np);
        lastP.copy(np);
        lastT = now;
      }
    };
    const up = () => {
      if (!held) return;
      held.held = false;
      const speed = held.vel.length();
      if (speed > 2) held.vel.z -= Math.min(speed, 25) * 0.6;
      held.vel.clampLength(0, 40);
      held = null;
      canvas.style.cursor = "";
    };
    const touchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t && (pickToy(t.clientX, t.clientY) || pickGift(t.clientX, t.clientY))) e.preventDefault();
    };
    const touchMove = (e: TouchEvent) => {
      if (held) e.preventDefault();
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("touchstart", touchStart, { passive: false });
    canvas.addEventListener("touchmove", touchMove, { passive: false });

    // ---- bucle ----
    const clock = new THREE.Clock();
    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!activeRef.current || document.hidden) return;
      const t = clock.elapsedTime;

      toys.forEach((o) => {
        if (o.held) {
          o.mesh.rotation.x += o.ang.x * dt;
          o.mesh.rotation.y += o.ang.y * dt;
          return;
        }
        o.mesh.position.addScaledVector(o.vel, dt);
        const toHome = o.home.clone().sub(o.mesh.position);
        const far = o.mesh.position.z < -25 || o.mesh.position.distanceTo(o.home) > 45;
        if (far) {
          o.mesh.position.copy(o.home).add(new THREE.Vector3(0, 7, 0));
          o.vel.set(0, -2, 0);
        }
        o.vel.addScaledVector(toHome, dt * (o.vel.length() > 6 ? 0.4 : 2.4));
        o.vel.multiplyScalar(Math.pow(0.35, dt));
        o.mesh.rotation.x += (o.ang.x + 0.1) * dt;
        o.mesh.rotation.y += (o.ang.y + 0.18) * dt;
        o.ang.multiplyScalar(Math.pow(0.6, dt));
        o.mesh.position.y += Math.sin(t * 1.1 + o.phase) * 0.004;
      });

      gift.rotation.y = Math.sin(t * 0.4) * 0.35 + t * 0.12;
      lidPop = Math.max(0, lidPop - dt * 0.8);
      giftPulse = Math.max(0, giftPulse - dt * 2.4);
      flash = Math.max(0, flash - dt * 1.6);
      const pop = done ? Math.sin(Math.min(1, lidPop) * Math.PI) * 1.8 : 0;
      lid.position.y = 1.3 + (done ? 0.1 : Math.sin(t * 1.6) * 0.05) + pop;
      lid.rotation.z = done ? pop * 0.25 : Math.sin(t * 0.9) * 0.05;
      body.scale.setScalar(1 + giftPulse * 0.08);
      glow.intensity = (done ? 1.2 : 0.4 + 0.3 * Math.sin(t * 2)) * 3 + flash * 10;

      for (let i = 0; i < FW; i++) {
        if (fwLife[i] <= 0) {
          fwPos[i * 3 + 1] = -999;
          continue;
        }
        fwLife[i] -= dt * 0.55;
        fwVel[i * 3 + 1] -= 4.2 * dt;
        fwVel[i * 3] *= 1 - dt * 0.6;
        fwVel[i * 3 + 2] *= 1 - dt * 0.6;
        fwPos[i * 3] += fwVel[i * 3] * dt;
        fwPos[i * 3 + 1] += fwVel[i * 3 + 1] * dt;
        fwPos[i * 3 + 2] += fwVel[i * 3 + 2] * dt;
        const l = Math.max(0, fwLife[i]);
        fwCol[i * 3] = fwBase[i * 3] * l;
        fwCol[i * 3 + 1] = fwBase[i * 3 + 1] * l;
        fwCol[i * 3 + 2] = fwBase[i * 3 + 2] * l;
      }
      fwGeo.attributes.position.needsUpdate = true;
      fwGeo.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((id) => window.clearTimeout(id));
      ro.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("touchstart", touchStart);
      canvas.removeEventListener("touchmove", touchMove);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      canvas.remove();
    };
    // La escena se crea una sola vez; el resto entra por refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={mount} className="absolute inset-0" />;
}
