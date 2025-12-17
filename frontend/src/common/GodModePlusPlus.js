// import { useEffect } from "react";

// export default function Spark3D() {
//   useEffect(() => {
//     const container = document.createElement("div");
//     container.id = "spark-3d-container";
//     container.style.position = "fixed";
//     container.style.inset = "0";
//     container.style.pointerEvents = "none";
//     container.style.overflow = "hidden";
//     document.body.appendChild(container);

//     const handleMove = (e) => spawn3DSparks(e.clientX, e.clientY);

//     window.addEventListener("mousemove", handleMove);

//     return () => {
//       window.removeEventListener("mousemove", handleMove);
//       container.remove();
//     };
//   }, []);

//   const spawn3DSparks = (x, y) => {
//     const container = document.getElementById("spark-3d-container");
//     if (!container) return;

//     const count = 20 + Math.random() * 20;

//     for (let i = 0; i < count; i++) {
//       const spark = document.createElement("div");
//       spark.classList.add("spark-3d");

//       // Random Z-depth  (0 = near, 1 = far)
//       const z = Math.random();
//       const scale = 1 + z * 1.4; // far objects appear smaller
//       spark.style.transform = `scale(${1 / scale})`;

//       // RGB plasma HSL colour
//       const color = `hsl(${Math.random() * 360}, 100%, 70%)`;
//       spark.style.background = color;
//       spark.style.boxShadow = `1px 1px 12px ${color}, 1px 1px 22px ${color}`;

//       // Random explosion angle
//       const angle = Math.random() * Math.PI * 2;

//       // Depth controls speed
//       const baseSpeed = 40 + Math.random() * 120;
//       const speed = baseSpeed * (0.4 + z);

//       // 2D movement
//       const tx = Math.cos(angle) * speed;
//       const ty = Math.sin(angle) * speed;

//       // Turbulence (drift)
//       const driftX = (Math.random() - 0.5) * 40;
//       const driftY = (Math.random() - 0.5) * 40;

//       spark.style.setProperty("--tx", `${tx + driftX}px`);
//       spark.style.setProperty("--ty", `${ty + driftY}px`);

//       // spawn position
//       spark.style.left = `${x}px`;
//       spark.style.top = `${y}px`;

//       // deeper particles fade slower
//       spark.style.animationDuration = `${1.6 + z * 1.2}s`;

//       container.appendChild(spark);

//       setTimeout(() => spark.remove(), 2600);
//     }
//   };

//   return null;
// }





import { useEffect } from "react";

export default function GodParticles() {
  useEffect(() => {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100vw";
    container.style.height = "100vh";
    container.style.pointerEvents = "none";
    container.style.overflow = "hidden";
    container.style.perspective = "800px";
    container.id = "god-particle-layer";

    document.body.appendChild(container);

    const createParticle = (x, y) => {
      const spark = document.createElement("div");

      const size = Math.random() * 2 + 2;
      const hue = Math.floor(Math.random() * 90); // RGB spectrum

      spark.style.position = "absolute";
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;
      spark.style.width = `${size}px`;
      spark.style.height = `${size}px`;
      spark.style.borderRadius = "50%";
      spark.style.background = `hsl(${hue}, 70%, 60%)`;
      spark.style.boxShadow = `0 0 8px hsl(${hue}, 100%, 70%)`;
      spark.style.transformStyle = "preserve-3d";

      const dx = (Math.random() - 0.5) * 60;
      const dy = (Math.random() - 0.5) * 60;
      const dz = (Math.random() - 0.5) * 200;

      const fallSpeed = Math.random() * 700 + 600;
      const rotate = Math.random() * 360;

      spark.animate(
        [
          { transform: `translate3d(0,0,0) rotate(0deg)`, opacity: 1 },
          { transform: `translate3d(${dx}px, ${dy}px, ${dz}px) rotate(${rotate}deg)`, opacity: 0 },
        ],
        { duration: fallSpeed, easing: "cubic-bezier(0.1, 0, 0.2, 1)" }
      );

      container.appendChild(spark);

      setTimeout(() => spark.parentNode?.removeChild(spark), fallSpeed);
    };

    let lastX = 0, lastY = 0;

    const handleMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      const dist = Math.hypot(x - lastX, y - lastY);

      if (dist > 5) {
        // spawn ONLY 2–3 particles
        const amount = Math.floor(Math.random() * 3) + 2; // 2 or 3

        for (let i = 0; i < amount; i++) {
          createParticle(x, y);
        }
      }

      lastX = x;
      lastY = y;
    };

    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener("mousemove", handleMove);

      const layer = document.getElementById("god-particle-layer");
      layer?.parentNode?.removeChild(layer);
    };
  }, []);

  return null;
}
