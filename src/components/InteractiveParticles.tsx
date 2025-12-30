"use client";

import { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

// Vertex Shader
const vertexShader = `
precision highp float;

attribute vec3 position;
attribute vec2 uv;
attribute float pindex;
attribute vec3 offset;
attribute float angle;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform float uRandom;
uniform float uDepth;
uniform float uSize;
uniform vec2 uTextureSize;
uniform sampler2D uTexture;
uniform sampler2D uTouch;

varying vec2 vPUv;
varying vec2 vUv;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float random(float n) {
  return fract(sin(n) * 43758.5453123);
}

void main() {
  vUv = uv;
  vec2 puv = offset.xy / uTextureSize;
  vPUv = puv;

  vec4 colA = texture2D(uTexture, puv);
  float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;

  vec3 displaced = offset;
  displaced.xy += vec2(random(pindex) - 0.5, random(offset.x + pindex) - 0.5) * uRandom;
  float rndz = (random(pindex) + snoise(vec2(pindex * 0.1, uTime * 0.1)));
  displaced.z += rndz * (random(pindex) * 2.0 * uDepth);
  displaced.xy -= uTextureSize * 0.5;

  float t = texture2D(uTouch, puv).r;
  displaced.z += t * 20.0 * rndz;
  displaced.x += cos(angle) * t * 20.0 * rndz;
  displaced.y += sin(angle) * t * 20.0 * rndz;

  float psize = (snoise(vec2(uTime, pindex) * 0.5) + 2.0);
  psize *= max(grey, 0.2);
  psize *= uSize;

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  mvPosition.xyz += position * psize;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
precision highp float;

uniform sampler2D uTexture;
varying vec2 vPUv;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec2 puv = vPUv;

  vec4 colA = texture2D(uTexture, puv);
  float grey = colA.r * 0.21 + colA.g * 0.71 + colA.b * 0.07;
  vec4 colB = vec4(grey, grey, grey, 1.0);

  float border = 0.3;
  float radius = 0.5;
  float dist = radius - distance(uv, vec2(0.5));
  float t = smoothstep(0.0, border, dist);

  gl_FragColor = vec4(colB.rgb, t);
}
`;

class TouchTexture {
  size = 64;
  maxAge = 120;
  radius = 0.15;
  trail: Array<{ x: number; y: number; age: number; force: number }> = [];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: THREE.Texture;

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.canvas.height = this.size;
    this.ctx = this.canvas.getContext("2d")!;
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.size, this.size);
    this.texture = new THREE.Texture(this.canvas);
  }

  update() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.size, this.size);

    this.trail = this.trail.filter((p) => {
      p.age++;
      return p.age <= this.maxAge;
    });

    this.trail.forEach((p) => this.drawTouch(p));
    this.texture.needsUpdate = true;
  }

  addTouch(point: { x: number; y: number }) {
    const last = this.trail[this.trail.length - 1];
    let force = 0;
    if (last) {
      const dx = last.x - point.x;
      const dy = last.y - point.y;
      force = Math.min(dx * dx + dy * dy * 10000, 1);
    }
    this.trail.push({ ...point, age: 0, force });
  }

  drawTouch(p: { x: number; y: number; age: number; force: number }) {
    const pos = { x: p.x * this.size, y: (1 - p.y) * this.size };
    let intensity =
      p.age < this.maxAge * 0.3
        ? Math.sin((p.age / (this.maxAge * 0.3)) * Math.PI * 0.5)
        : Math.sin(
            (1 - (p.age - this.maxAge * 0.3) / (this.maxAge * 0.7)) *
              Math.PI *
              0.5
          );
    intensity *= p.force;

    const r = this.size * this.radius * intensity;
    if (r <= 0) return;

    const grd = this.ctx.createRadialGradient(
      pos.x,
      pos.y,
      r * 0.25,
      pos.x,
      pos.y,
      r
    );
    grd.addColorStop(0, "rgba(255,255,255,0.2)");
    grd.addColorStop(1, "rgba(0,0,0,0)");
    this.ctx.beginPath();
    this.ctx.fillStyle = grd;
    this.ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

class Particles {
  container = new THREE.Object3D();
  mesh: THREE.Mesh | null = null;
  hitArea: THREE.Mesh | null = null;
  touch: TouchTexture | null = null;
  width = 0;
  height = 0;

  init(texture: THREE.Texture) {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const img = texture.image as HTMLImageElement;
    this.width = img.width;
    this.height = img.height;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = this.width;
    canvas.height = this.height;
    ctx.scale(1, -1);
    ctx.drawImage(img, 0, 0, this.width, this.height * -1);
    const imgData = ctx.getImageData(0, 0, this.width, this.height);
    const colors = imgData.data;

    const threshold = 34;
    const numPoints = this.width * this.height;
    let numVisible = 0;
    for (let i = 0; i < numPoints; i++) {
      if (colors[i * 4] > threshold) numVisible++;
    }

    const geometry = new THREE.InstancedBufferGeometry();

    const positions = new Float32Array([
      -0.5, 0.5, 0, 0.5, 0.5, 0, -0.5, -0.5, 0, 0.5, -0.5, 0,
    ]);
    const uvs = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.BufferAttribute(uvs, 2));
    geometry.setIndex(new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1));

    const indices = new Uint16Array(numVisible);
    const offsets = new Float32Array(numVisible * 3);
    const angles = new Float32Array(numVisible);

    for (let i = 0, j = 0; i < numPoints; i++) {
      if (colors[i * 4] <= threshold) continue;
      offsets[j * 3] = i % this.width;
      offsets[j * 3 + 1] = Math.floor(i / this.width);
      offsets[j * 3 + 2] = 0;
      indices[j] = i;
      angles[j] = Math.random() * Math.PI;
      j++;
    }

    geometry.setAttribute("pindex", new THREE.InstancedBufferAttribute(indices, 1));
    geometry.setAttribute("offset", new THREE.InstancedBufferAttribute(offsets, 3));
    geometry.setAttribute("angle", new THREE.InstancedBufferAttribute(angles, 1));

    const material = new THREE.RawShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uRandom: { value: 1.0 },
        uDepth: { value: 2.0 },
        uSize: { value: 0.0 },
        uTextureSize: { value: new THREE.Vector2(this.width, this.height) },
        uTexture: { value: texture },
        uTouch: { value: null },
      },
      vertexShader,
      fragmentShader,
      depthTest: false,
      transparent: true,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.container.add(this.mesh);

    // Hit area
    const hitGeo = new THREE.PlaneGeometry(this.width, this.height);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false });
    this.hitArea = new THREE.Mesh(hitGeo, hitMat);
    this.container.add(this.hitArea);

    // Touch texture
    this.touch = new TouchTexture();
    material.uniforms.uTouch.value = this.touch.texture;
  }

  update(delta: number) {
    if (!this.mesh) return;
    this.touch?.update();
    (this.mesh.material as THREE.RawShaderMaterial).uniforms.uTime.value += delta;
  }

  show(time = 1.0) {
    if (!this.mesh) return;
    const u = (this.mesh.material as THREE.RawShaderMaterial).uniforms;
    gsap.fromTo(u.uSize, { value: 0.5 }, { value: 1.5, duration: time });
    gsap.to(u.uRandom, { value: 2.0, duration: time });
    gsap.fromTo(u.uDepth, { value: 40.0 }, { value: 4.0, duration: time * 1.5 });
  }

  hide(time = 0.8): Promise<void> {
    return new Promise((resolve) => {
      if (!this.mesh) return resolve();
      const u = (this.mesh.material as THREE.RawShaderMaterial).uniforms;
      gsap.to(u.uRandom, { value: 5.0, duration: time, onComplete: resolve });
      gsap.to(u.uDepth, { value: -20.0, duration: time, ease: "power2.in" });
      gsap.to(u.uSize, { value: 0.0, duration: time * 0.8 });
    });
  }

  destroy() {
    if (this.mesh) {
      this.container.remove(this.mesh);
      this.mesh.geometry.dispose();
      (this.mesh.material as THREE.Material).dispose();
      this.mesh = null;
    }
    if (this.hitArea) {
      this.container.remove(this.hitArea);
      this.hitArea.geometry.dispose();
      (this.hitArea.material as THREE.Material).dispose();
      this.hitArea = null;
    }
  }

  resize(fovHeight: number) {
    if (!this.mesh || !this.hitArea || !this.height) return;
    const scale = fovHeight / this.height;
    this.mesh.scale.set(scale, scale, 1);
    this.hitArea.scale.set(scale, scale, 1);
  }
}

interface InteractiveParticlesProps {
  className?: string;
  samples?: string[];
}

export function InteractiveParticles({
  className = "",
  samples = [
    "/images/sample-01.png",
    "/images/sample-02.png",
    "/images/sample-03.png",
    "/images/sample-04.png",
  ],
}: InteractiveParticlesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    renderer: null as THREE.WebGLRenderer | null,
    scene: null as THREE.Scene | null,
    camera: null as THREE.PerspectiveCamera | null,
    particles: null as Particles | null,
    clock: null as THREE.Clock | null,
    raf: 0,
    fovHeight: 0,
    currentSample: -1,
    raycaster: new THREE.Raycaster(),
    mouse: new THREE.Vector2(),
  });

  const goto = useCallback((index: number) => {
    const s = stateRef.current;
    const loader = new THREE.TextureLoader();

    const initNew = () => {
      loader.load(samples[index], (texture) => {
        if (!s.particles) return;
        s.particles.init(texture);
        s.particles.resize(s.fovHeight);
        s.particles.show();
      });
    };

    if (s.currentSample < 0) {
      initNew();
    } else {
      s.particles?.hide().then(() => {
        s.particles?.destroy();
        initNew();
      });
    }
    s.currentSample = index;
  }, [samples]);

  const next = useCallback(() => {
    const s = stateRef.current;
    const nextIdx = s.currentSample < samples.length - 1 ? s.currentSample + 1 : 0;
    goto(nextIdx);
  }, [samples.length, goto]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const s = stateRef.current;

    // Setup
    s.scene = new THREE.Scene();
    s.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 10000);
    s.camera.position.z = 300;

    s.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    s.renderer.setSize(window.innerWidth, window.innerHeight);
    s.renderer.setClearColor(0x000000, 1);
    container.appendChild(s.renderer.domElement);

    s.clock = new THREE.Clock(true);
    s.particles = new Particles();
    s.scene.add(s.particles.container);

    // Resize
    const resize = () => {
      if (!s.camera || !s.renderer) return;
      s.camera.aspect = window.innerWidth / window.innerHeight;
      s.camera.updateProjectionMatrix();
      s.fovHeight = 2 * Math.tan((s.camera.fov * Math.PI) / 180 / 2) * s.camera.position.z;
      s.renderer.setSize(window.innerWidth, window.innerHeight);
      s.particles?.resize(s.fovHeight);
    };
    resize();
    window.addEventListener("resize", resize);

    // Mouse
    const onMouseMove = (e: MouseEvent) => {
      if (!s.camera || !s.particles?.hitArea) return;
      const rect = container.getBoundingClientRect();
      s.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      s.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      s.raycaster.setFromCamera(s.mouse, s.camera);
      const hits = s.raycaster.intersectObject(s.particles.hitArea);
      if (hits.length > 0 && hits[0].uv && s.particles.touch) {
        s.particles.touch.addTouch({ x: hits[0].uv.x, y: hits[0].uv.y });
      }
    };
    container.addEventListener("mousemove", onMouseMove);

    // Animate
    const animate = () => {
      s.raf = requestAnimationFrame(animate);
      if (!s.clock || !s.renderer || !s.scene || !s.camera) return;
      s.particles?.update(s.clock.getDelta());
      s.renderer.render(s.scene, s.camera);
    };
    animate();

    // Start
    goto(Math.floor(Math.random() * samples.length));

    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", onMouseMove);
      s.particles?.destroy();
      s.renderer?.dispose();
      if (s.renderer) container.removeChild(s.renderer.domElement);
    };
  }, [goto, samples.length]);

  return (
    <div
      ref={containerRef}
      className={`bg-black cursor-pointer ${className}`}
      onClick={next}
    />
  );
}

export default InteractiveParticles;
