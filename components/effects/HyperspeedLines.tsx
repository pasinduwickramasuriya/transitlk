// 'use client'

// import { useEffect, useRef, FC } from 'react';
// import * as THREE from 'three';
// import { BloomEffect, EffectComposer, EffectPass, RenderPass } from 'postprocessing';

// interface Distortion {
//     uniforms: Record<string, { value: any }>;
//     getDistortion: string;
//     getJS?: (progress: number, time: number) => THREE.Vector3;
// }

// interface Colors {
//     roadColor: number;
//     islandColor: number;
//     background: number;
//     shoulderLines: number;
//     brokenLines: number;
//     leftCars: number[];
//     rightCars: number[];
//     sticks: number;
// }

// interface HyperspeedOptions {
//     onSpeedUp?: (ev: MouseEvent | TouchEvent) => void;
//     onSlowDown?: (ev: MouseEvent | TouchEvent) => void;
//     distortion?: string | Distortion;
//     length: number;
//     roadWidth: number;
//     islandWidth: number;
//     lanesPerRoad: number;
//     fov: number;
//     fovSpeedUp: number;
//     speedUp: number;
//     carLightsFade: number;
//     totalSideLightSticks: number;
//     lightPairsPerRoadWay: number;
//     shoulderLinesWidthPercentage: number;
//     brokenLinesWidthPercentage: number;
//     brokenLinesLengthPercentage: number;
//     lightStickWidth: [number, number];
//     lightStickHeight: [number, number];
//     movingAwaySpeed: [number, number];
//     movingCloserSpeed: [number, number];
//     carLightsLength: [number, number];
//     carLightsRadius: [number, number];
//     carWidthPercentage: [number, number];
//     carShiftX: [number, number];
//     carFloorSeparation: [number, number];
//     colors: Colors;
// }

// interface HyperspeedProps {
//     effectOptions?: Partial<HyperspeedOptions>;
//     className?: string;
// }

// // Utility functions
// function nsin(val: number) {
//     return Math.sin(val) * 0.5 + 0.5;
// }

// function random(base: number | [number, number]): number {
//     if (Array.isArray(base)) {
//         return Math.random() * (base[1] - base[0]) + base[0];
//     }
//     return Math.random() * base;
// }

// function pickRandom<T>(arr: T | T[]): T {
//     if (Array.isArray(arr)) {
//         return arr[Math.floor(Math.random() * arr.length)];
//     }
//     return arr;
// }

// function lerp(current: number, target: number, speed = 0.1, limit = 0.001): number {
//     let change = (target - current) * speed;
//     if (Math.abs(change) < limit) {
//         change = target - current;
//     }
//     return change;
// }

// const turbulentUniforms = {
//     uFreq: { value: new THREE.Vector4(4, 8, 8, 1) },
//     uAmp: { value: new THREE.Vector4(25, 5, 10, 10) }
// };

// const turbulentDistortion: Distortion = {
//     uniforms: turbulentUniforms,
//     getDistortion: `
//     uniform vec4 uFreq;
//     uniform vec4 uAmp;
//     float nsin(float val){
//       return sin(val) * 0.5 + 0.5;
//     }
//     #define PI 3.14159265358979
//     float getDistortionX(float progress){
//       return (
//         cos(PI * progress * uFreq.r + uTime) * uAmp.r +
//         pow(cos(PI * progress * uFreq.g + uTime * (uFreq.g / uFreq.r)), 2. ) * uAmp.g
//       );
//     }
//     float getDistortionY(float progress){
//       return (
//         -nsin(PI * progress * uFreq.b + uTime) * uAmp.b +
//         -pow(nsin(PI * progress * uFreq.a + uTime / (uFreq.b / uFreq.a)), 5.) * uAmp.a
//       );
//     }
//     vec3 getDistortion(float progress){
//       return vec3(
//         getDistortionX(progress) - getDistortionX(0.0125),
//         getDistortionY(progress) - getDistortionY(0.0125),
//         0.
//       );
//     }
//   `,
//     getJS: (progress: number, time: number) => {
//         const uFreq = turbulentUniforms.uFreq.value;
//         const uAmp = turbulentUniforms.uAmp.value;

//         const getX = (p: number) =>
//             Math.cos(Math.PI * p * uFreq.x + time) * uAmp.x +
//             Math.pow(Math.cos(Math.PI * p * uFreq.y + time * (uFreq.y / uFreq.x)), 2) * uAmp.y;

//         const getY = (p: number) =>
//             -nsin(Math.PI * p * uFreq.z + time) * uAmp.z -
//             Math.pow(nsin(Math.PI * p * uFreq.w + time / (uFreq.z / uFreq.w)), 5) * uAmp.w;

//         const distortion = new THREE.Vector3(
//             getX(progress) - getX(progress + 0.007),
//             getY(progress) - getY(progress + 0.007),
//             0
//         );
//         const lookAtAmp = new THREE.Vector3(-2, -5, 0);
//         const lookAtOffset = new THREE.Vector3(0, 0, -10);
//         return distortion.multiply(lookAtAmp).add(lookAtOffset);
//     }
// };

// // Shaders
// const carLightsFragment = `
//   #define USE_FOG;
//   ${THREE.ShaderChunk['fog_pars_fragment']}
//   varying vec3 vColor;
//   varying vec2 vUv; 
//   uniform vec2 uFade;
//   void main() {
//     vec3 color = vec3(vColor);
//     float alpha = smoothstep(uFade.x, uFade.y, vUv.x);
//     gl_FragColor = vec4(color, alpha);
//     if (gl_FragColor.a < 0.0001) discard;
//     ${THREE.ShaderChunk['fog_fragment']}
//   }
// `;

// const carLightsVertex = `
//   #define USE_FOG;
//   ${THREE.ShaderChunk['fog_pars_vertex']}
//   attribute vec3 aOffset;
//   attribute vec3 aMetrics;
//   attribute vec3 aColor;
//   uniform float uTravelLength;
//   uniform float uTime;
//   varying vec2 vUv; 
//   varying vec3 vColor; 
//   #include <getDistortion_vertex>
//   void main() {
//     vec3 transformed = position.xyz;
//     float radius = aMetrics.r;
//     float myLength = aMetrics.g;
//     float speed = aMetrics.b;

//     transformed.xy *= radius;
//     transformed.z *= myLength;

//     transformed.z += myLength - mod(uTime * speed + aOffset.z, uTravelLength);
//     transformed.xy += aOffset.xy;

//     float progress = abs(transformed.z / uTravelLength);
//     transformed.xyz += getDistortion(progress);

//     vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
//     gl_Position = projectionMatrix * mvPosition;
//     vUv = uv;
//     vColor = aColor;
//     ${THREE.ShaderChunk['fog_vertex']}
//   }
// `;

// const roadVertex = `
//   #define USE_FOG;
//   uniform float uTime;
//   ${THREE.ShaderChunk['fog_pars_vertex']}
//   uniform float uTravelLength;
//   varying vec2 vUv; 
//   #include <getDistortion_vertex>
//   void main() {
//     vec3 transformed = position.xyz;
//     vec3 distortion = getDistortion((transformed.y + uTravelLength / 2.) / uTravelLength);
//     transformed.x += distortion.x;
//     transformed.z += distortion.y;
//     transformed.y += -1. * distortion.z;  
    
//     vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.);
//     gl_Position = projectionMatrix * mvPosition;
//     vUv = uv;
//     ${THREE.ShaderChunk['fog_vertex']}
//   }
// `;

// const roadFragment = `
//   #define USE_FOG;
//   varying vec2 vUv; 
//   uniform vec3 uColor;
//   uniform float uTime;
//   uniform float uLanes;
//   uniform vec3 uBrokenLinesColor;
//   uniform vec3 uShoulderLinesColor;
//   uniform float uShoulderLinesWidthPercentage;
//   uniform float uBrokenLinesWidthPercentage;
//   uniform float uBrokenLinesLengthPercentage;
//   ${THREE.ShaderChunk['fog_pars_fragment']}
//   void main() {
//     vec2 uv = vUv;
//     vec3 color = vec3(uColor);
    
//     uv.y = mod(uv.y + uTime * 0.05, 1.);
//     float laneWidth = 1.0 / uLanes;
//     float brokenLineWidth = laneWidth * uBrokenLinesWidthPercentage;
//     float laneEmptySpace = 1. - uBrokenLinesLengthPercentage;

//     float brokenLines = step(1.0 - brokenLineWidth, fract(uv.x * 2.0)) * step(laneEmptySpace, fract(uv.y * 10.0));
//     float sideLines = step(1.0 - brokenLineWidth, fract((uv.x - laneWidth * (uLanes - 1.0)) * 2.0)) + step(brokenLineWidth, uv.x);

//     brokenLines = mix(brokenLines, sideLines, uv.x);
//     color = mix(color, uBrokenLinesColor, brokenLines);
    
//     gl_FragColor = vec4(color, 1.);
//     ${THREE.ShaderChunk['fog_fragment']}
//   }
// `;

// // Fixed App class
// class HyperspeedApp {
//     container: HTMLElement;
//     options: HyperspeedOptions;
//     renderer: THREE.WebGLRenderer;
//     composer: EffectComposer;
//     camera: THREE.PerspectiveCamera;
//     scene: THREE.Scene;
//     clock: THREE.Clock;
//     disposed: boolean = false;
//     fogUniforms: Record<string, { value: any }>;
//     road!: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
//     carLights!: THREE.Mesh<THREE.InstancedBufferGeometry, THREE.ShaderMaterial>;
//     fovTarget: number;
//     speedUpTarget: number = 0;
//     speedUp: number = 0;
//     timeOffset: number = 0;

//     constructor(container: HTMLElement, options: HyperspeedOptions) {
//         this.container = container;
//         this.options = options;
//         this.fovTarget = options.fov;

//         // Initialize Three.js
//         this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
//         this.renderer.setSize(container.offsetWidth, container.offsetHeight, false);
//         this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//         this.composer = new EffectComposer(this.renderer);
//         container.appendChild(this.renderer.domElement);

//         this.camera = new THREE.PerspectiveCamera(
//             options.fov,
//             container.offsetWidth / container.offsetHeight,
//             0.1,
//             10000
//         );
//         this.camera.position.set(0, 8, -5);

//         this.scene = new THREE.Scene();
//         this.scene.background = new THREE.Color(options.colors.background);

//         const fog = new THREE.Fog(options.colors.background, options.length * 0.2, options.length * 500);
//         this.scene.fog = fog;

//         this.fogUniforms = {
//             fogColor: { value: fog.color },
//             fogNear: { value: fog.near },
//             fogFar: { value: fog.far }
//         };

//         this.clock = new THREE.Clock();

//         // Bind methods
//         this.onMouseDown = this.onMouseDown.bind(this);
//         this.onMouseUp = this.onMouseUp.bind(this);
//         this.onTouchStart = this.onTouchStart.bind(this);
//         this.onTouchEnd = this.onTouchEnd.bind(this);
//         this.onWindowResize = this.onWindowResize.bind(this);
//         this.tick = this.tick.bind(this);

//         window.addEventListener('resize', this.onWindowResize);
//     }

//     init() {
//         this.initPasses();
//         this.createRoad();
//         this.createCarLights();

//         // Add event listeners
//         this.container.addEventListener('mousedown', this.onMouseDown);
//         this.container.addEventListener('mouseup', this.onMouseUp);
//         this.container.addEventListener('mouseout', this.onMouseUp);
//         this.container.addEventListener('touchstart', this.onTouchStart, { passive: true });
//         this.container.addEventListener('touchend', this.onTouchEnd, { passive: true });

//         this.tick();
//     }

//     initPasses() {
//         const renderPass = new RenderPass(this.scene, this.camera);
//         const bloomPass = new EffectPass(
//             this.camera,
//             new BloomEffect({
//                 luminanceThreshold: 0.2,
//                 luminanceSmoothing: 0,
//                 resolutionScale: 1
//             })
//         );

//         renderPass.renderToScreen = false;
//         bloomPass.renderToScreen = true;

//         this.composer.addPass(renderPass);
//         this.composer.addPass(bloomPass);
//     }

//     createRoad() {
//         const geometry = new THREE.PlaneGeometry(this.options.roadWidth, this.options.length, 20, 100);

//         const material = new THREE.ShaderMaterial({
//             fragmentShader: roadFragment,
//             vertexShader: roadVertex,
//             side: THREE.DoubleSide,
//             uniforms: {
//                 uTravelLength: { value: this.options.length },
//                 uColor: { value: new THREE.Color(this.options.colors.roadColor) },
//                 uTime: { value: 0 },
//                 uLanes: { value: this.options.lanesPerRoad },
//                 uBrokenLinesColor: { value: new THREE.Color(this.options.colors.brokenLines) },
//                 uShoulderLinesColor: { value: new THREE.Color(this.options.colors.shoulderLines) },
//                 uShoulderLinesWidthPercentage: { value: this.options.shoulderLinesWidthPercentage },
//                 uBrokenLinesLengthPercentage: { value: this.options.brokenLinesLengthPercentage },
//                 uBrokenLinesWidthPercentage: { value: this.options.brokenLinesWidthPercentage },
//                 ...this.fogUniforms,
//                 ...turbulentDistortion.uniforms
//             }
//         });

//         material.onBeforeCompile = (shader) => {
//             shader.vertexShader = shader.vertexShader.replace(
//                 '#include <getDistortion_vertex>',
//                 turbulentDistortion.getDistortion
//             );
//         };

//         this.road = new THREE.Mesh(geometry, material);
//         this.road.rotation.x = -Math.PI / 2;
//         this.road.position.z = -this.options.length / 2;
//         this.scene.add(this.road);
//     }


//     createCarLights() {
//         const curve = new THREE.LineCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1));
//         const tubeGeometry = new THREE.TubeGeometry(curve, 40, 1, 8, false);

//         // ✅ Fixed: Create InstancedBufferGeometry properly
//         const instanced = new THREE.InstancedBufferGeometry();

//         // Copy all attributes from the tube geometry
//         instanced.setIndex(tubeGeometry.index);
//         instanced.setAttribute('position', tubeGeometry.attributes.position);
//         instanced.setAttribute('normal', tubeGeometry.attributes.normal);
//         instanced.setAttribute('uv', tubeGeometry.attributes.uv);

//         // Set instance count
//         instanced.instanceCount = this.options.lightPairsPerRoadWay * 2;

//         const laneWidth = this.options.roadWidth / this.options.lanesPerRoad;
//         const aOffset: number[] = [];
//         const aMetrics: number[] = [];
//         const aColor: number[] = [];

//         const leftColors = this.options.colors.leftCars.map(c => new THREE.Color(c));
//         const rightColors = this.options.colors.rightCars.map(c => new THREE.Color(c));

//         for (let i = 0; i < this.options.lightPairsPerRoadWay; i++) {
//             const radius = random(this.options.carLightsRadius);
//             const length = random(this.options.carLightsLength);
//             const speed = random(this.options.movingAwaySpeed);

//             const carLane = i % this.options.lanesPerRoad;
//             let laneX = carLane * laneWidth - this.options.roadWidth / 2 + laneWidth / 2;

//             const carWidth = random(this.options.carWidthPercentage) * laneWidth;
//             const carShiftX = random(this.options.carShiftX) * laneWidth;
//             laneX += carShiftX;

//             const offsetY = random(this.options.carFloorSeparation) + radius * 1.3;
//             const offsetZ = -random(this.options.length);

//             // Left light
//             aOffset.push(laneX - carWidth / 2, offsetY, offsetZ);
//             aMetrics.push(radius, length, speed);
//             const leftColor = pickRandom(leftColors);
//             aColor.push(leftColor.r, leftColor.g, leftColor.b);

//             // Right light
//             aOffset.push(laneX + carWidth / 2, offsetY, offsetZ);
//             aMetrics.push(radius, length, speed);
//             const rightColor = pickRandom(rightColors);
//             aColor.push(rightColor.r, rightColor.g, rightColor.b);
//         }

//         instanced.setAttribute('aOffset', new THREE.InstancedBufferAttribute(new Float32Array(aOffset), 3));
//         instanced.setAttribute('aMetrics', new THREE.InstancedBufferAttribute(new Float32Array(aMetrics), 3));
//         instanced.setAttribute('aColor', new THREE.InstancedBufferAttribute(new Float32Array(aColor), 3));

//         const material = new THREE.ShaderMaterial({
//             fragmentShader: carLightsFragment,
//             vertexShader: carLightsVertex,
//             transparent: true,
//             uniforms: {
//                 uTime: { value: 0 },
//                 uTravelLength: { value: this.options.length },
//                 uFade: { value: new THREE.Vector2(0, 1 - this.options.carLightsFade) },
//                 ...this.fogUniforms,
//                 ...turbulentDistortion.uniforms
//             }
//         });

//         material.onBeforeCompile = (shader) => {
//             shader.vertexShader = shader.vertexShader.replace(
//                 '#include <getDistortion_vertex>',
//                 turbulentDistortion.getDistortion
//             );
//         };

//         this.carLights = new THREE.Mesh(instanced, material);
//         this.carLights.frustumCulled = false;
//         this.scene.add(this.carLights);

//         // Dispose the original geometry to free memory
//         tubeGeometry.dispose();
//     }

//     onMouseDown() {
//         if (this.options.onSpeedUp) this.options.onSpeedUp({} as MouseEvent);
//         this.fovTarget = this.options.fovSpeedUp;
//         this.speedUpTarget = this.options.speedUp;
//     }

//     onMouseUp() {
//         if (this.options.onSlowDown) this.options.onSlowDown({} as MouseEvent);
//         this.fovTarget = this.options.fov;
//         this.speedUpTarget = 0;
//     }

//     onTouchStart() {
//         this.onMouseDown();
//     }

//     onTouchEnd() {
//         this.onMouseUp();
//     }

//     onWindowResize() {
//         const width = this.container.offsetWidth;
//         const height = this.container.offsetHeight;

//         this.renderer.setSize(width, height);
//         this.camera.aspect = width / height;
//         this.camera.updateProjectionMatrix();
//         this.composer.setSize(width, height);
//     }

//     update(delta: number) {
//         const lerpPercentage = Math.exp(-(-60 * Math.log2(1 - 0.1)) * delta);
//         this.speedUp += lerp(this.speedUp, this.speedUpTarget, lerpPercentage, 0.00001);
//         this.timeOffset += this.speedUp * delta;
//         const time = this.clock.elapsedTime + this.timeOffset;

//         // ✅ Fixed: Type-safe uniform updates
//         if (this.road?.material?.uniforms?.uTime) {
//             this.road.material.uniforms.uTime.value = time;
//         }
//         if (this.carLights?.material?.uniforms?.uTime) {
//             this.carLights.material.uniforms.uTime.value = time;
//         }

//         // Update camera FOV
//         const fovChange = lerp(this.camera.fov, this.fovTarget, lerpPercentage);
//         if (Math.abs(fovChange) > 0.001) {
//             this.camera.fov += fovChange * delta * 6;
//             this.camera.updateProjectionMatrix();
//         }

//         // Camera look-at with distortion
//         if (turbulentDistortion.getJS) {
//             const distortion = turbulentDistortion.getJS(0.025, time);
//             this.camera.lookAt(
//                 new THREE.Vector3(
//                     this.camera.position.x + distortion.x,
//                     this.camera.position.y + distortion.y,
//                     this.camera.position.z + distortion.z
//                 )
//             );
//         }
//     }

//     render(delta: number) {
//         this.composer.render(delta);
//     }

//     tick() {
//         if (this.disposed) return;

//         const delta = this.clock.getDelta();
//         this.update(delta);
//         this.render(delta);
//         requestAnimationFrame(this.tick);
//     }

//     dispose() {
//         this.disposed = true;

//         // Remove event listeners
//         window.removeEventListener('resize', this.onWindowResize);
//         this.container.removeEventListener('mousedown', this.onMouseDown);
//         this.container.removeEventListener('mouseup', this.onMouseUp);
//         this.container.removeEventListener('mouseout', this.onMouseUp);
//         this.container.removeEventListener('touchstart', this.onTouchStart);
//         this.container.removeEventListener('touchend', this.onTouchEnd);

//         // Dispose Three.js resources
//         this.renderer?.dispose();
//         this.composer?.dispose();
//         this.scene?.clear();
//     }
// }

// const defaultOptions: HyperspeedOptions = {
//     length: 400,
//     roadWidth: 10,
//     islandWidth: 2,
//     lanesPerRoad: 4,
//     fov: 90,
//     fovSpeedUp: 150,
//     speedUp: 2,
//     carLightsFade: 0.4,
//     totalSideLightSticks: 20,
//     lightPairsPerRoadWay: 40,
//     shoulderLinesWidthPercentage: 0.05,
//     brokenLinesWidthPercentage: 0.1,
//     brokenLinesLengthPercentage: 0.5,
//     lightStickWidth: [0.12, 0.5],
//     lightStickHeight: [1.3, 1.7],
//     movingAwaySpeed: [60, 80],
//     movingCloserSpeed: [-120, -160],
//     carLightsLength: [400 * 0.03, 400 * 0.2],
//     carLightsRadius: [0.05, 0.14],
//     carWidthPercentage: [0.3, 0.5],
//     carShiftX: [-0.8, 0.8],
//     carFloorSeparation: [0, 5],
//     colors: {
//         roadColor: 0x080808,
//         islandColor: 0x0a0a0a,
//         background: 0x000000,
//         shoulderLines: 0xffffff,
//         brokenLines: 0xffffff,
//         leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
//         rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
//         sticks: 0x03b3c3
//     }
// };

// const Hyperspeed: FC<HyperspeedProps> = ({ effectOptions = {}, className = "" }) => {
//     const containerRef = useRef<HTMLDivElement>(null);
//     const appRef = useRef<HyperspeedApp | null>(null);

//     useEffect(() => {
//         const container = containerRef.current;
//         if (!container) return;

//         const mergedOptions = { ...defaultOptions, ...effectOptions };

//         // Cleanup previous instance
//         if (appRef.current) {
//             appRef.current.dispose();
//         }

//         // Create new app
//         const app = new HyperspeedApp(container, mergedOptions);
//         appRef.current = app;
//         app.init();

//         return () => {
//             if (appRef.current) {
//                 appRef.current.dispose();
//                 appRef.current = null;
//             }
//         };
//     }, [effectOptions]);

//     return <div ref={containerRef} className={`w-full h-full ${className}`} />;
// };

// export default Hyperspeed;
