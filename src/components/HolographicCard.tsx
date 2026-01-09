"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// Assets
const cardtemplateback =
  "https://raw.githubusercontent.com/pizza3/asset/master/cardtemplateback4.png";
const flower =
  "https://raw.githubusercontent.com/pizza3/asset/master/flower3.png";
const noise2 =
  "https://raw.githubusercontent.com/pizza3/asset/master/noise2.png";
const backtexture =
  "https://raw.githubusercontent.com/pizza3/asset/master/color3.jpg";
const helvetikerFont =
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_bold.typeface.json";
const helvetikerFontRegular =
  "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json";
const voronoi =
  "https://raw.githubusercontent.com/pizza3/asset/master/rgbnoise2.png";

// Shaders
const vert = `
  varying vec2 vUv;
  varying vec3 camPos;
  varying vec3 eyeVector;
  varying vec3 vNormal;

  void main() {
    vUv = uv;
    camPos = cameraPosition;
    vNormal = normal;
    vec4 worldPosition = modelViewMatrix * vec4( position, 1.0);
    eyeVector = normalize(worldPosition.xyz - abs(cameraPosition));
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

const fragPlane = `
  varying vec2 vUv;
  uniform sampler2D skullrender;
  uniform sampler2D cardtemplate;
  uniform sampler2D backtexture;
  uniform sampler2D noiseTex;
  uniform sampler2D noise;
  uniform vec4 resolution;
  uniform vec3 cardColor0;
  uniform vec3 cardColor1;
  varying vec3 camPos;
  varying vec3 eyeVector;
  varying vec3 vNormal;

  float Fresnel(vec3 eyeVector, vec3 worldNormal) {
    return pow( 1.0 + dot( eyeVector, worldNormal), 1.80 );
  }

  void main() {
    vec2 uv = gl_FragCoord.xy/resolution.xy ;
    vec4 temptex = texture2D( cardtemplate, vUv);
    vec4 skulltex = texture2D( skullrender, uv - 0.5 );
    gl_FragColor = temptex;
    float f = Fresnel(eyeVector, vNormal);
    vec4 noisetex = texture2D( noise, mod(vUv*2.,1.));
    if(gl_FragColor.g >= .5 && gl_FragColor.r < 0.6){
      gl_FragColor = f + skulltex;
      gl_FragColor += noisetex/5.;
    } else {
      vec4 bactex = texture2D( backtexture, vUv);
      float tone = pow(dot(normalize(camPos), normalize(bactex.rgb)), 1.);
      // Mix between the two colors based on tone
      vec3 mixedColor = mix(cardColor0/255.0, cardColor1/255.0, tone);
      vec4 colortex = vec4(mixedColor, 1.0);
      vec2 uv2 = vUv;
      vec3 pixeltex = texture2D(noiseTex,mod(uv*5.,1.)).rgb;
      float iTime = 1.*0.004;
      uv.y += iTime / 10.0;
      uv.x -= (sin(iTime/10.0)/2.0);
      uv2.y += iTime / 14.0;
      uv2.x += (sin(iTime/10.0)/9.0);
      float result = 0.0;
      result += texture2D(noiseTex, mod(uv*4.,1.) * 0.6 + vec2(iTime*-0.003)).r;
      result *= texture2D(noiseTex, mod(uv2*4.,1.) * 0.9 + vec2(iTime*+0.002)).b;
      result = pow(result, 10.0);
      gl_FragColor *= colortex;
      gl_FragColor += vec4(sin((tone + vUv.x + vUv.y/10.)*10.))/8.;
    }
    gl_FragColor.a = temptex.a;
  }
`;

const fragPlaneback = `
  varying vec2 vUv;
  uniform sampler2D skullrender;
  uniform sampler2D cardtemplate;
  uniform sampler2D backtexture;
  uniform sampler2D noiseTex;
  uniform sampler2D noise;
  uniform vec4 resolution;
  uniform vec3 cardColor0;
  uniform vec3 cardColor1;
  varying vec3 camPos;
  varying vec3 eyeVector;
  varying vec3 vNormal;

  float Fresnel(vec3 eyeVector, vec3 worldNormal) {
    return pow( 1.0 + dot( eyeVector, worldNormal), 1.80 );
  }

  void main() {
    vec2 uv = gl_FragCoord.xy/resolution.xy ;
    vec4 temptex = texture2D( cardtemplate, vUv);
    vec4 skulltex = texture2D( skullrender, vUv );
    gl_FragColor = temptex;
    vec4 noisetex = texture2D( noise, mod(vUv*2.,1.));
    float f = Fresnel(eyeVector, vNormal);

    vec2 uv2 = vUv;
    vec3 pixeltex = texture2D(noiseTex,mod(uv*5.,1.)).rgb;
    float iTime = 1.*0.004;
    uv.y += iTime / 10.0;
    uv.x -= (sin(iTime/10.0)/2.0);
    uv2.y += iTime / 14.0;
    uv2.x += (sin(iTime/10.0)/9.0);
    float result = 0.0;
    result += texture2D(noiseTex, mod(uv*4.,1.) * 0.6 + vec2(iTime*-0.003)).r;
    result *= texture2D(noiseTex, mod(uv2*4.,1.) * 0.9 + vec2(iTime*+0.002)).b;
    result = pow(result, 10.0);

    vec4 bactex = texture2D( backtexture, vUv);
    float tone = pow(dot(normalize(camPos), normalize(bactex.rgb)), 1.);
    // Mix between the two colors based on tone
    vec3 mixedColor = mix(cardColor0/255.0, cardColor1/255.0, tone);
    vec4 colortex = vec4(mixedColor, 1.0);
    if(gl_FragColor.g >= .5 && gl_FragColor.r < 0.6){
      float tone2 = pow(dot(normalize(camPos), normalize(skulltex.rgb)), 1.);
      vec3 mixedColor2 = mix(cardColor0/255.0, cardColor1/255.0, tone2);
      vec4 colortex2 = vec4(mixedColor2, 1.0);
      if(skulltex.a > 0.2){
        gl_FragColor = colortex;
      } else {
        gl_FragColor = vec4(0.) + f;
        gl_FragColor += noisetex/5.;
      }
      gl_FragColor += noisetex/5.;
    } else {
      gl_FragColor *= colortex;
      gl_FragColor += vec4(sin((tone + vUv.x + vUv.y/10.)*10.))/8.;
    }
  }
`;

const vertskull = `
  varying vec3 vNormal;
  varying vec3 camPos;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 eyeVector;

  void main() {
    vNormal = normal;
    vUv = uv;
    camPos = cameraPosition;
    vPosition = position;
    vec4 worldPosition = modelViewMatrix * vec4( position, 1.0);
    eyeVector = normalize(worldPosition.xyz - cameraPosition);
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`;

const fragskull = `
  #define NUM_OCTAVES 5
  uniform vec4 resolution;
  varying vec3 vNormal;
  varying vec3 vPosition;
  uniform float time;
  varying vec3 camPos;
  varying vec2 vUv;
  uniform vec3 color1;
  uniform vec3 color0;
  varying vec3 eyeVector;

  float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);
    float res = mix(
      mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
      mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
  }

  float fbm(vec2 x) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100);
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
      v += a * noise(x);
      x = rot * x * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  float setOpacity(float r, float g, float b) {
    float tone = (r + g + b) / 3.0;
    float alpha = 1.0;
    if(tone<0.69) {
      alpha = 0.0;
    }
    return alpha;
  }

  vec3 rgbcol(float r, float g, float b) {
    return vec3(r/255.0,g/255.0,b/255.0);
  }

  float Fresnel(vec3 eyeVector, vec3 worldNormal) {
    return pow( 1.0 + dot( eyeVector, worldNormal), 3.0 );
  }

  void main() {
    vec2 olduv = gl_FragCoord.xy/resolution.xy ;
    float f = Fresnel(eyeVector, vNormal);
    float gradient2 = (f)*(.3 - vPosition.y) ;
    float scale = 8.;
    olduv.y = olduv.y - time;
    vec2 p = olduv*scale;
    float noise = fbm( p + time );

    vec2 uv = gl_FragCoord.xy/resolution.xy ;

    vec3 newCam = vec3(0.,5.,10.);
    float gradient = dot(.0 -  normalize( newCam ), normalize( vNormal )) ;

    vec3 viewDirectionW = normalize(camPos - vPosition);
    float fresnelTerm = dot(viewDirectionW, vNormal);
    fresnelTerm = clamp( 1. - fresnelTerm, 0., 1.) ;

    vec3 color = vec3(noise) + gradient;
    vec3 color2 = color - 0.2;

    float noisetone = setOpacity(color.r,color.g,color.b);
    float noisetone2 = setOpacity(color2.r,color2.g,color2.b);

    vec4 backColor = vec4(color, 1.);
    backColor.rgb = rgbcol(color0.r,color0.g,color0.b)*noisetone;

    vec4 frontColor = vec4(color2, 1.);
    frontColor.rgb = rgbcol(color1.r,color1.g,color1.b)*noisetone;

    if(noisetone2>0.0){
      gl_FragColor = frontColor;
    } else {
      gl_FragColor = backColor;
    }
  }
`;

interface HolographicCardProps {
  className?: string;
  autoRotate?: boolean;
  color0?: [number, number, number];
  color1?: [number, number, number];
  color2?: [number, number, number];
  textColor0?: [number, number, number];
  textColor1?: [number, number, number];
  bloomStrength?: number;
  bloomRadius?: number;
  text?: string;
  label?: string;
  descTop?: string;
  descBottom?: string;
  externalRotationY?: number;
  onRotationUpdate?: (updateFn: (rotation: number) => void) => void;
}

export default function HolographicCard({
  className = "",
  autoRotate = true,
  color0 = [0, 51, 64],
  color1 = [26, 179, 179],
  color2 = [0, 77, 255],
  textColor0,
  textColor1,
  bloomStrength = 0.8,
  bloomRadius = 1.29,
  text = "Code",
  label = "CREATIVE",
  descTop = "",
  descBottom = "",
  externalRotationY,
  onRotationUpdate,
}: HolographicCardProps) {
  // Use separate text colors or fall back to card colors
  const actualTextColor0 = textColor0 ?? [0, 51, 64];
  const actualTextColor1 = textColor1 ?? [26, 179, 179];
  const containerRef = useRef<HTMLDivElement>(null);
  const externalRotationRef = useRef(externalRotationY ?? 0);

  // Provide update function to parent
  useEffect(() => {
    if (onRotationUpdate) {
      onRotationUpdate((rotation: number) => {
        externalRotationRef.current = rotation;
      });
    }
  }, [onRotationUpdate]);

  // Update ref when prop changes (fallback)
  useEffect(() => {
    if (externalRotationY !== undefined) {
      externalRotationRef.current = externalRotationY;
    }
  }, [externalRotationY]);

  const stateRef = useRef<{
    scene: THREE.Scene | null;
    sceneRTT: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    cameraRTT: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    composer: EffectComposer | null;
    bloomPass: UnrealBloomPass | null;
    controls: OrbitControls | null;
    frontcard: THREE.Mesh | null;
    backcard: THREE.Mesh | null;
    frontmaterial: THREE.ShaderMaterial | null;
    backmaterial: THREE.ShaderMaterial | null;
    skullmaterial: THREE.ShaderMaterial | null;
    modelgroup: THREE.Group | null;
    clock: THREE.Clock | null;
    raf: number;
    matrix: THREE.Matrix4;
    labelMeshes: THREE.Mesh[];
  }>({
    scene: null,
    sceneRTT: null,
    camera: null,
    cameraRTT: null,
    renderer: null,
    composer: null,
    bloomPass: null,
    controls: null,
    frontcard: null,
    backcard: null,
    frontmaterial: null,
    backmaterial: null,
    skullmaterial: null,
    modelgroup: null,
    clock: null,
    raf: 0,
    matrix: new THREE.Matrix4(),
    labelMeshes: [],
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const s = stateRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Setup scenes
    s.scene = new THREE.Scene();
    s.sceneRTT = new THREE.Scene();

    // Cameras
    s.camera = new THREE.PerspectiveCamera(30, width / height, 1, 10000);
    s.camera.position.z = 95;

    s.cameraRTT = new THREE.PerspectiveCamera(30, width / height, 1, 10000);
    s.cameraRTT.position.z = 45;
    s.cameraRTT.position.y = -2;

    // Renderer
    s.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    s.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    s.renderer.setSize(width, height);
    s.renderer.autoClear = false;
    s.renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(s.renderer.domElement);

    // Controls (disable when using external rotation)
    s.controls = new OrbitControls(s.camera, s.renderer.domElement);
    s.controls.enableZoom = false;
    s.controls.enablePan = false;
    s.controls.enableRotate = autoRotate; // Disable mouse rotation when controlled externally
    s.controls.update();

    // Bloom pass
    const renderScene = new RenderPass(s.sceneRTT, s.cameraRTT);
    s.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      bloomStrength,
      bloomRadius,
      0.85
    );
    s.composer = new EffectComposer(s.renderer);
    s.composer.renderToScreen = false;
    s.composer.addPass(renderScene);
    s.composer.addPass(s.bloomPass);

    // Clock
    s.clock = new THREE.Clock();

    // Texture loader
    const loader = new THREE.TextureLoader();

    // Front card
    const frontGeometry = new THREE.PlaneGeometry(28, 42);
    s.frontmaterial = new THREE.ShaderMaterial({
      uniforms: {
        cardtemplate: { value: loader.load(cardtemplateback) },
        backtexture: { value: loader.load(backtexture) },
        noise: { value: loader.load(noise2) },
        skullrender: { value: s.composer.readBuffer.texture },
        resolution: { value: new THREE.Vector2(width, height) },
        noiseTex: { value: loader.load(voronoi) },
        cardColor0: { value: new THREE.Vector3(...color0) },
        cardColor1: { value: new THREE.Vector3(...color1) },
      },
      vertexShader: vert,
      fragmentShader: fragPlane,
      transparent: true,
      depthWrite: false,
    });
    s.frontcard = new THREE.Mesh(frontGeometry, s.frontmaterial);
    s.scene.add(s.frontcard);

    // Back card
    const backGeometry = new THREE.PlaneGeometry(28, 42);
    s.backmaterial = new THREE.ShaderMaterial({
      uniforms: {
        cardtemplate: { value: loader.load(cardtemplateback) },
        backtexture: { value: loader.load(backtexture) },
        noise: { value: loader.load(noise2) },
        skullrender: { value: loader.load(flower) },
        resolution: { value: new THREE.Vector2(width, height) },
        noiseTex: { value: loader.load(voronoi) },
        cardColor0: { value: new THREE.Vector3(...color0) },
        cardColor1: { value: new THREE.Vector3(...color1) },
      },
      vertexShader: vert,
      fragmentShader: fragPlaneback,
      transparent: true,
      depthWrite: false,
    });
    s.backcard = new THREE.Mesh(backGeometry, s.backmaterial);
    s.backcard.rotation.set(0, Math.PI, 0);
    s.scene.add(s.backcard);

    // Add label text
    const fontLoader2 = new FontLoader();
    fontLoader2.load(helvetikerFontRegular, (font) => {
      // Top text
      const topTextGeometry = new TextGeometry(label, {
        font: font,
        size: 1.6,
        depth: 0.1,
        curveSegments: 12,
        bevelEnabled: false,
      });
      const textMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.FrontSide,
        transparent: true,
        opacity: 1,
      });
      const topTextMesh = new THREE.Mesh(topTextGeometry, textMaterial);
      topTextMesh.position.set(-11, 16, 0.1);
      s.scene!.add(topTextMesh);
      s.labelMeshes.push(topTextMesh);

      // Bottom text (flipped)
      const bottomTextGeometry = new TextGeometry(label, {
        font: font,
        size: 1.6,
        depth: 0.1,
        curveSegments: 12,
        bevelEnabled: false,
      });
      const bottomTextMesh = new THREE.Mesh(
        bottomTextGeometry,
        textMaterial.clone()
      );
      bottomTextMesh.position.set(11, -16, 0.1);
      bottomTextMesh.rotation.set(0, 0, Math.PI);
      s.scene!.add(bottomTextMesh);
      s.labelMeshes.push(bottomTextMesh);

      // Description texts (smaller)
      const descMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.FrontSide,
        transparent: true,
        opacity: 0.8,
      });

      if (descTop) {
        // Split text into 2 lines if too long (more than 25 chars)
        const maxChars = 25;
        let topLine1 = descTop;
        let topLine2 = "";

        if (descTop.length > maxChars) {
          const words = descTop.split(" ");
          topLine1 = "";
          topLine2 = "";
          let currentLine = "";

          for (const word of words) {
            if ((currentLine + " " + word).trim().length <= maxChars) {
              currentLine = (currentLine + " " + word).trim();
            } else {
              if (!topLine1) {
                topLine1 = currentLine;
                currentLine = word;
              } else {
                topLine2 = (topLine2 + " " + currentLine).trim();
                currentLine = word;
              }
            }
          }
          if (currentLine) {
            if (!topLine1) topLine1 = currentLine;
            else topLine2 = (topLine2 + " " + currentLine).trim();
          }
        }

        // First line
        const descTopGeometry1 = new TextGeometry(topLine1, {
          font: font,
          size: 1.1,
          depth: 0.05,
          curveSegments: 8,
          bevelEnabled: false,
        });
        const descTopMesh1 = new THREE.Mesh(descTopGeometry1, descMaterial);
        descTopMesh1.position.set(-11, topLine2 ? 13 : 12.5, 0.1);
        s.scene!.add(descTopMesh1);
        s.labelMeshes.push(descTopMesh1);

        // Second line if exists
        if (topLine2) {
          const descTopGeometry2 = new TextGeometry(topLine2, {
            font: font,
            size: 1.1,
            depth: 0.05,
            curveSegments: 8,
            bevelEnabled: false,
          });
          const descTopMesh2 = new THREE.Mesh(
            descTopGeometry2,
            descMaterial.clone()
          );
          descTopMesh2.position.set(-11, 11, 0.1);
          s.scene!.add(descTopMesh2);
          s.labelMeshes.push(descTopMesh2);
        }
      }

      if (descBottom) {
        // Split text into 2 lines - shorter line on top, longer on bottom
        const words = descBottom.split(" ");
        let line1 = "";
        let line2 = "";

        if (words.length > 2) {
          // Put fewer words on first line (shorter), more on second (longer)
          const splitPoint = Math.floor(words.length / 3);
          line1 = words.slice(0, splitPoint).join(" ");
          line2 = words.slice(splitPoint).join(" ");
        } else {
          line1 = descBottom;
        }

        // First line (shorter, on top) - right aligned
        const descBottomGeometry1 = new TextGeometry(line1, {
          font: font,
          size: 1.1,
          depth: 0.05,
          curveSegments: 8,
          bevelEnabled: false,
        });
        descBottomGeometry1.computeBoundingBox();
        const textWidth1 =
          descBottomGeometry1.boundingBox!.max.x -
          descBottomGeometry1.boundingBox!.min.x;
        const descBottomMesh1 = new THREE.Mesh(
          descBottomGeometry1,
          descMaterial.clone()
        );
        descBottomMesh1.position.set(11 - textWidth1, line2 ? -12 : -13.5, 0.1);
        s.scene!.add(descBottomMesh1);
        s.labelMeshes.push(descBottomMesh1);

        // Second line (longer, on bottom) - right aligned
        if (line2) {
          const descBottomGeometry2 = new TextGeometry(line2, {
            font: font,
            size: 1.1,
            depth: 0.05,
            curveSegments: 8,
            bevelEnabled: false,
          });
          descBottomGeometry2.computeBoundingBox();
          const textWidth2 =
            descBottomGeometry2.boundingBox!.max.x -
            descBottomGeometry2.boundingBox!.min.x;
          const descBottomMesh2 = new THREE.Mesh(
            descBottomGeometry2,
            descMaterial.clone()
          );
          descBottomMesh2.position.set(11 - textWidth2, -14, 0.1);
          s.scene!.add(descBottomMesh2);
          s.labelMeshes.push(descBottomMesh2);
        }
      }
    });

    // Skull material (3D text) - uses separate text colors
    s.skullmaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        color1: { value: new THREE.Vector3(...actualTextColor1) },
        color0: { value: new THREE.Vector3(...actualTextColor0) },
        resolution: { value: new THREE.Vector2(width * 2, height) },
      },
      vertexShader: vertskull,
      fragmentShader: fragskull,
    });

    s.modelgroup = new THREE.Group();

    // Load 3D Text
    const fontLoader = new FontLoader();
    fontLoader.load(helvetikerFont, (font) => {
      const textGeometry = new TextGeometry(text, {
        font: font,
        size: 4,
        depth: 1.5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.3,
        bevelSize: 0.2,
        bevelOffset: 0,
        bevelSegments: 5,
      });

      textGeometry.center();

      const textMesh = new THREE.Mesh(textGeometry, s.skullmaterial!);
      textMesh.position.set(0, -3.5, -10);
      textMesh.rotation.set(Math.PI, 0, Math.PI);
      textMesh.scale.set(-1, 1, 1);

      s.modelgroup!.add(textMesh);
      s.sceneRTT!.add(s.modelgroup!);
    });

    // Animation
    const period = 5;
    const animate = () => {
      s.raf = requestAnimationFrame(animate);

      if (!s.renderer || !s.scene || !s.camera || !s.composer) return;

      const deltaTime = s.clock!.getElapsedTime() * 1000;

      // Update skull rotation to follow camera
      if (s.modelgroup && s.camera) {
        s.modelgroup.rotation.set(
          -s.camera.rotation.x,
          -s.camera.rotation.y,
          0
        );
      }

      // Auto rotate or external rotation
      if (!autoRotate && s.frontcard) {
        // Use external rotation from scroll (only when autoRotate is false)
        const radius = 95;
        const radians = (externalRotationRef.current * Math.PI) / 180;
        s.camera.position.x = Math.sin(radians) * radius;
        s.camera.position.z = Math.cos(radians) * radius;
        s.camera.lookAt(s.frontcard.position);
      } else if (autoRotate && s.frontcard) {
        s.matrix.makeRotationY((s.clock!.getDelta() * 0.7 * Math.PI) / period);
        s.camera.position.applyMatrix4(s.matrix);
        s.camera.lookAt(s.frontcard.position);
      }

      // Show/hide labels based on camera position (front/back)
      if (s.labelMeshes.length > 0 && s.camera) {
        const isFrontFacing = s.camera.position.z > 0;
        s.labelMeshes.forEach((mesh) => {
          mesh.visible = isFrontFacing;
        });
      }

      // Update bloom
      if (s.bloomPass) {
        s.bloomPass.strength = bloomStrength;
        s.bloomPass.radius = bloomRadius;
      }

      // Update skull material (3D text colors)
      if (s.skullmaterial) {
        s.skullmaterial.uniforms.time.value = deltaTime / 4000;
        s.skullmaterial.uniforms.color1.value = new THREE.Vector3(...actualTextColor1);
        s.skullmaterial.uniforms.color0.value = new THREE.Vector3(...actualTextColor0);
      }

      s.composer.render();
      s.renderer.render(s.scene, s.camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (
        !container ||
        !s.camera ||
        !s.renderer ||
        !s.frontmaterial ||
        !s.skullmaterial
      )
        return;

      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      s.camera.aspect = newWidth / newHeight;
      s.camera.updateProjectionMatrix();

      if (s.cameraRTT) {
        s.cameraRTT.aspect = newWidth / newHeight;
        s.cameraRTT.updateProjectionMatrix();
      }

      s.frontmaterial.uniforms.resolution.value = new THREE.Vector2(
        newWidth,
        newHeight
      );
      s.skullmaterial.uniforms.resolution.value = new THREE.Vector2(
        newWidth * 2,
        newHeight
      );

      if (s.backmaterial) {
        s.backmaterial.uniforms.resolution.value = new THREE.Vector2(
          newWidth,
          newHeight
        );
      }

      s.renderer.setSize(newWidth, newHeight);
      s.composer?.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(s.raf);
      window.removeEventListener("resize", handleResize);

      s.renderer?.dispose();
      s.frontmaterial?.dispose();
      s.backmaterial?.dispose();
      s.skullmaterial?.dispose();

      if (s.renderer && container.contains(s.renderer.domElement)) {
        container.removeChild(s.renderer.domElement);
      }
    };
  }, [
    autoRotate,
    bloomStrength,
    bloomRadius,
    color0,
    color1,
    color2,
    actualTextColor0,
    actualTextColor1,
    text,
    label,
    descTop,
    descBottom,
  ]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full bg-transparent ${className}`}
    />
  );
}
