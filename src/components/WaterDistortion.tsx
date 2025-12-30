"use client";

import { useEffect, useRef, useCallback } from "react";

interface WaterDistortionProps {
  className?: string;
  imageSrc?: string;
  blueish?: number;
  scale?: number;
  illumination?: number;
  surfaceDistortion?: number;
  waterDistortion?: number;
  effectOnly?: boolean; // Зөвхөн effect харуулах, зураггүй
}

const vertexShaderSource = `
  precision mediump float;
  varying vec2 vUv;
  attribute vec2 a_position;

  void main() {
    vUv = .5 * (a_position + 1.);
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  varying vec2 vUv;
  uniform sampler2D u_image_texture;
  uniform float u_time;
  uniform float u_ratio;
  uniform float u_img_ratio;
  uniform float u_blueish;
  uniform float u_scale;
  uniform float u_illumination;
  uniform float u_surface_distortion;
  uniform float u_water_distortion;

  #define TWO_PI 6.28318530718
  #define PI 3.14159265358979323846

  vec3 mod289(vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
  vec2 mod289(vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
  vec3 permute(vec3 x) { return mod289(((x*34.)+1.)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1., 0.) : vec2(0., 1.);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.);
    m = m*m;
    m = m*m;
    vec3 x = 2. * fract(p * C.www) - 1.;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130. * dot(m, g);
  }

  mat2 rotate2D(float r) {
    return mat2(cos(r), sin(r), -sin(r), cos(r));
  }

  float surface_noise(vec2 uv, float t, float scale) {
    vec2 n = vec2(.1);
    vec2 N = vec2(.1);
    mat2 m = rotate2D(.5);
    for (int j = 0; j < 10; j++) {
      uv *= m;
      n *= m;
      vec2 q = uv * scale + float(j) + n + (.5 + .5 * float(j)) * (mod(float(j), 2.) - 1.) * t;
      n += sin(q);
      N += cos(q) / scale;
      scale *= 1.2;
    }
    return (N.x + N.y + .1);
  }

  void main() {
    vec2 uv = vUv;
    uv.y = 1. - uv.y;
    uv.x *= u_ratio;

    float t = .002 * u_time;
    vec3 color = vec3(0.);
    float opacity = 0.;

    float outer_noise = snoise((.3 + .1 * sin(t)) * uv + vec2(0., .2 * t));
    vec2 surface_noise_uv = 2. * uv + (outer_noise * .2);

    float surface_noise = surface_noise(surface_noise_uv, t, u_scale);
    surface_noise *= pow(uv.y, .3);
    surface_noise = pow(surface_noise, 2.);

    vec2 img_uv = vUv;
    img_uv -= .5;
    if (u_ratio > u_img_ratio) {
      img_uv.x = img_uv.x * u_ratio / u_img_ratio;
    } else {
      img_uv.y = img_uv.y * u_img_ratio / u_ratio;
    }
    float scale_factor = 1.4;
    img_uv *= scale_factor;
    img_uv += .5;
    img_uv.y = 1. - img_uv.y;

    img_uv += (u_water_distortion * outer_noise);
    img_uv += (u_surface_distortion * surface_noise);

    vec4 img = texture2D(u_image_texture, img_uv);
    img *= (1. + u_illumination * surface_noise);

    color += img.rgb;
    color += u_illumination * vec3(1. - u_blueish, 1., 1.) * surface_noise;
    opacity += img.a;

    float edge_width = .02;
    float edge_alpha = smoothstep(0., edge_width, img_uv.x) * smoothstep(1., 1. - edge_width, img_uv.x);
    edge_alpha *= smoothstep(0., edge_width, img_uv.y) * smoothstep(1., 1. - edge_width, img_uv.y);
    color *= edge_alpha;
    opacity *= edge_alpha;

    gl_FragColor = vec4(color, opacity);
  }
`;

// Зөвхөн effect харуулах shader - зураггүй
const effectOnlyFragmentShader = `
  precision mediump float;

  varying vec2 vUv;
  uniform float u_time;
  uniform float u_ratio;
  uniform float u_blueish;
  uniform float u_scale;
  uniform float u_illumination;

  vec3 mod289(vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
  vec2 mod289(vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
  vec3 permute(vec3 x) { return mod289(((x*34.)+1.)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1., 0.) : vec2(0., 1.);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.);
    m = m*m;
    m = m*m;
    vec3 x = 2. * fract(p * C.www) - 1.;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130. * dot(m, g);
  }

  mat2 rotate2D(float r) {
    return mat2(cos(r), sin(r), -sin(r), cos(r));
  }

  float surface_noise(vec2 uv, float t, float scale) {
    vec2 n = vec2(.1);
    vec2 N = vec2(.1);
    mat2 m = rotate2D(.5);
    for (int j = 0; j < 10; j++) {
      uv *= m;
      n *= m;
      vec2 q = uv * scale + float(j) + n + (.5 + .5 * float(j)) * (mod(float(j), 2.) - 1.) * t;
      n += sin(q);
      N += cos(q) / scale;
      scale *= 1.2;
    }
    return (N.x + N.y + .1);
  }

  void main() {
    vec2 uv = vUv;
    uv.y = 1. - uv.y;
    uv.x *= u_ratio;

    float t = .002 * u_time;

    float outer_noise = snoise((.3 + .1 * sin(t)) * uv + vec2(0., .2 * t));
    vec2 surface_noise_uv = 2. * uv + (outer_noise * .2);

    float sn = surface_noise(surface_noise_uv, t, u_scale);
    sn *= pow(uv.y, .3);
    sn = pow(sn, 2.);

    // Dark effect
    float intensity = sn * u_illumination * 1.2;
    vec3 lightColor = vec3(1. - u_blueish, 1., 1.) * 0.4;
    vec3 color = lightColor * intensity;

    // Opacity бууруулсан
    float opacity = clamp(intensity * 0.5, 0.0, 0.5);

    gl_FragColor = vec4(color, opacity);
  }
`;

interface Uniforms {
  u_time: WebGLUniformLocation | null;
  u_ratio: WebGLUniformLocation | null;
  u_img_ratio: WebGLUniformLocation | null;
  u_blueish: WebGLUniformLocation | null;
  u_scale: WebGLUniformLocation | null;
  u_illumination: WebGLUniformLocation | null;
  u_surface_distortion: WebGLUniformLocation | null;
  u_water_distortion: WebGLUniformLocation | null;
  u_image_texture: WebGLUniformLocation | null;
}

export function WaterDistortion({
  className = "",
  imageSrc = "/portrait.jpg",
  blueish = 0.6,
  scale = 7,
  illumination = 0.15,
  surfaceDistortion = 0.07,
  waterDistortion = 0.03,
  effectOnly = false,
}: WaterDistortionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const uniformsRef = useRef<Uniforms | null>(null);
  const animationRef = useRef<number>(0);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const createShader = useCallback(
    (gl: WebGLRenderingContext, sourceCode: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, sourceCode);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    },
    []
  );

  const getUniforms = useCallback(
    (gl: WebGLRenderingContext, program: WebGLProgram): Uniforms => {
      return {
        u_time: gl.getUniformLocation(program, "u_time"),
        u_ratio: gl.getUniformLocation(program, "u_ratio"),
        u_img_ratio: gl.getUniformLocation(program, "u_img_ratio"),
        u_blueish: gl.getUniformLocation(program, "u_blueish"),
        u_scale: gl.getUniformLocation(program, "u_scale"),
        u_illumination: gl.getUniformLocation(program, "u_illumination"),
        u_surface_distortion: gl.getUniformLocation(program, "u_surface_distortion"),
        u_water_distortion: gl.getUniformLocation(program, "u_water_distortion"),
        u_image_texture: gl.getUniformLocation(program, "u_image_texture"),
      };
    },
    []
  );

  const initShader = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return null;
    }

    const glContext = gl as WebGLRenderingContext;

    const vertexShader = createShader(glContext, vertexShaderSource, glContext.VERTEX_SHADER);
    // effectOnly үед зураггүй shader ашиглана
    const fragShaderSource = effectOnly ? effectOnlyFragmentShader : fragmentShaderSource;
    const fragmentShader = createShader(glContext, fragShaderSource, glContext.FRAGMENT_SHADER);

    if (!vertexShader || !fragmentShader) return null;

    const program = glContext.createProgram();
    if (!program) return null;

    glContext.attachShader(program, vertexShader);
    glContext.attachShader(program, fragmentShader);
    glContext.linkProgram(program);

    if (!glContext.getProgramParameter(program, glContext.LINK_STATUS)) {
      console.error("Program link error:", glContext.getProgramInfoLog(program));
      return null;
    }

    const uniforms = getUniforms(glContext, program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const vertexBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, vertices, glContext.STATIC_DRAW);

    glContext.useProgram(program);

    const positionLocation = glContext.getAttribLocation(program, "a_position");
    glContext.enableVertexAttribArray(positionLocation);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
    glContext.vertexAttribPointer(positionLocation, 2, glContext.FLOAT, false, 0, 0);

    return { gl: glContext, uniforms };
  }, [createShader, getUniforms, effectOnly]);

  const loadImage = useCallback((src: string) => {
    const gl = glRef.current;
    const uniforms = uniformsRef.current;
    if (!gl || !uniforms) return;

    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = src;
    image.onload = () => {
      imageRef.current = image;

      const imageTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, imageTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.uniform1i(uniforms.u_image_texture, 0);

      resizeCanvas();
    };
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    const uniforms = uniformsRef.current;
    const image = imageRef.current;

    if (!canvas || !gl || !uniforms) return;
    // effectOnly биш үед image байх ёстой
    if (!effectOnly && !image) return;

    const devicePixelRatio = Math.min(window.devicePixelRatio, 2);

    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform1f(uniforms.u_ratio, canvas.width / canvas.height);

    // effectOnly үед image ratio хэрэггүй
    if (!effectOnly && image) {
      const imgRatio = image.naturalWidth / image.naturalHeight;
      gl.uniform1f(uniforms.u_img_ratio, imgRatio);
    }
  }, [effectOnly]);

  const updateUniforms = useCallback(() => {
    const gl = glRef.current;
    const uniforms = uniformsRef.current;
    if (!gl || !uniforms) return;

    gl.uniform1f(uniforms.u_blueish, blueish);
    gl.uniform1f(uniforms.u_scale, scale);
    gl.uniform1f(uniforms.u_illumination, illumination);
    gl.uniform1f(uniforms.u_surface_distortion, surfaceDistortion);
    gl.uniform1f(uniforms.u_water_distortion, waterDistortion);
  }, [blueish, scale, illumination, surfaceDistortion, waterDistortion]);

  const render = useCallback(() => {
    const gl = glRef.current;
    const uniforms = uniformsRef.current;
    if (!gl || !uniforms) return;

    const currentTime = performance.now();
    gl.uniform1f(uniforms.u_time, currentTime);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    animationRef.current = requestAnimationFrame(render);
  }, []);

  useEffect(() => {
    const result = initShader();
    if (!result) return;

    glRef.current = result.gl;
    uniformsRef.current = result.uniforms;

    updateUniforms();

    if (effectOnly) {
      // effectOnly үед image ачаалахгүй, шууд resize хийж render эхлүүлнэ
      resizeCanvas();
      animationRef.current = requestAnimationFrame(render);
    } else {
      // Зурагтай үед image ачаална
      loadImage(imageSrc);
      animationRef.current = requestAnimationFrame(render);
    }

    const handleResize = () => resizeCanvas();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [initShader, loadImage, render, resizeCanvas, updateUniforms, imageSrc, effectOnly]);

  useEffect(() => {
    updateUniforms();
  }, [updateUniforms]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
    />
  );
}

export default WaterDistortion;
