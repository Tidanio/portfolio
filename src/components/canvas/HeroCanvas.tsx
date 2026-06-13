"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial } from "@react-three/drei";
import type { Group, Mesh } from "three";

/**
 * Geometría abstracta procedimental:
 *  - Un icosaedro subdividido con material que se "deforma" orgánicamente.
 *  - Una carcasa wireframe externa que gira lentamente en sentido opuesto.
 *  - Todo el grupo hace un parallax sutil siguiendo al ratón.
 */
function AbstractShape() {
  const outer = useRef<Group>(null); // parallax con el ratón
  const core = useRef<Mesh>(null); // núcleo sólido (giro continuo)
  const shell = useRef<Mesh>(null); // carcasa wireframe (giro lento inverso)

  useFrame((state, delta) => {
    // Giro continuo del núcleo.
    if (core.current) {
      core.current.rotation.y += delta * 0.2;
      core.current.rotation.z += delta * 0.05;
    }
    // Carcasa girando despacio en sentido contrario.
    if (shell.current) {
      shell.current.rotation.y -= delta * 0.08;
      shell.current.rotation.x += delta * 0.04;
    }
    // Parallax suave del conjunto hacia la posición del puntero.
    if (outer.current) {
      const targetY = state.pointer.x * 0.4;
      const targetX = -state.pointer.y * 0.3;
      outer.current.rotation.y += (targetY - outer.current.rotation.y) * 0.05;
      outer.current.rotation.x += (targetX - outer.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={outer}>
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.9}>
        {/* Núcleo sólido deformable */}
        <Icosahedron ref={core} args={[1.6, 6]}>
          <MeshDistortMaterial
            color="#6366f1"
            emissive="#1e1b4b"
            emissiveIntensity={0.45}
            metalness={0.45}
            roughness={0.18}
            distort={0.35}
            speed={1.6}
          />
        </Icosahedron>

        {/* Carcasa wireframe externa */}
        <Icosahedron ref={shell} args={[2.5, 1]}>
          <meshBasicMaterial
            color="#818cf8"
            wireframe
            transparent
            opacity={0.12}
          />
        </Icosahedron>
      </Float>
    </group>
  );
}

/**
 * Canvas del Hero. Se importa con next/dynamic (ssr:false) desde HeroSection,
 * de modo que three.js solo se descarga en cliente y no bloquea el render
 * inicial de la página.
 */
export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 2]} // limita el pixel ratio (rendimiento en pantallas retina)
      gl={{ antialias: true, alpha: true }} // alpha: deja ver el fondo oscuro
    >
      {/* Iluminación pensada para el tema oscuro */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={1.1} />
      <pointLight position={[-6, -3, -4]} intensity={28} color="#6366f1" />
      <pointLight position={[6, 4, 2]} intensity={18} color="#a855f7" />

      <AbstractShape />
    </Canvas>
  );
}
