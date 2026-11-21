/**
 * Three.js 3D Setup for College Website
 * Creates a rotating 3D college building icon in the hero section
 */

let scene, camera, renderer, building, group, particles;

function init3D() {
  const container = document.getElementById("hero-3d");
  if (!container) return;

  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 6);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  const pointLight = new THREE.PointLight(0x2563eb, 1);
  pointLight.position.set(0, 5, 5);
  scene.add(pointLight);

  // Group for the building
  group = new THREE.Group();
  scene.add(group);

  // --- Build a stylized 3D college building ---
  // Base
  const baseGeo = new THREE.BoxGeometry(2, 0.4, 2);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x8e9eab });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.y = 0.2;
  group.add(base);

  // Main building body
  const bodyGeo = new THREE.BoxGeometry(1.6, 3.2, 1.6);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x2563eb,
    roughness: 0.4,
    metalness: 0.2,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 1.8;
  group.add(body);

  // Roof
  const roofGeo = new THREE.BoxGeometry(1.8, 0.2, 1.8);
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x1e40af });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = 3.4;
  group.add(roof);

  // Dome
  const domeGeo = new THREE.SphereGeometry(0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const domeMat = new THREE.MeshStandardMaterial({ color: 0x2563eb });
  const dome = new THREE.Mesh(domeGeo, domeMat);
  dome.position.set(0, 3.6, 0);
  group.add(dome);

  // Dome top
  const topGeo = new THREE.CylinderGeometry(0, 0.2, 0.4, 16);
  const topMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
  const top = new THREE.Mesh(topGeo, topMat);
  top.position.set(0, 3.9, 0);
  group.add(top);

  // Windows
  const windowGeo = new THREE.PlaneGeometry(0.25, 0.4);
  const windowMat = new THREE.MeshStandardMaterial({
    color: 0xbfdbfe,
    emissive: 0x3b82f6,
    emissiveIntensity: 0.5,
    transparent: true,
    opacity: 0.8,
  });

  const windowPositions = [
    [-0.6, 1.2, 0.81],
    [0.6, 1.2, 0.81],
    [-0.6, 2.2, 0.81],
    [0.6, 2.2, 0.81],
    [-0.6, 1.2, -0.81],
    [0.6, 1.2, -0.81],
    [-0.6, 2.2, -0.81],
    [0.6, 2.2, -0.81],
    [0.81, 1.2, -0.6],
    [-0.81, 1.2, -0.6],
    [0.81, 2.2, -0.6],
    [-0.81, 2.2, -0.6],
  ];

  windowPositions.forEach((pos) => {
    const win = new THREE.Mesh(windowGeo, windowMat);
    win.position.set(pos[0], pos[1], pos[2]);
    if (pos[2] === 0.81) {
      win.rotation.y = 0;
    } else if (pos[2] === -0.81) {
      win.rotation.y = Math.PI;
    } else if (pos[0] === 0.81) {
      win.rotation.y = Math.PI / 2;
    } else {
      win.rotation.y = -Math.PI / 2;
    }
    group.add(win);
  });

  // Door
  const doorGeo = new THREE.PlaneGeometry(0.5, 0.9);
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x374151 });
  const door = new THREE.Mesh(doorGeo, doorMat);
  door.position.set(0, 0.65, 0.811);
  group.add(door);

  // --- Floating particles ---
  particles = new THREE.Group();
  scene.add(particles);

  const particleGeo = new THREE.SphereGeometry(0.05, 8, 8);
  const particleMat = new THREE.MeshStandardMaterial({
    color: 0x2563eb,
    emissive: 0x2563eb,
    emissiveIntensity: 1,
  });

  for (let i = 0; i < 40; i++) {
    const p = new THREE.Mesh(particleGeo, particleMat);
    const angle = (i / 40) * Math.PI * 2;
    const radius = 4 + Math.random() * 3;
    p.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 4, Math.sin(angle) * radius);
    particles.add(p);
  }

  // Position
  camera.position.set(0, 2, 7);

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);

    // Rotate building slowly
    if (group) {
      group.rotation.y += 0.008;
      group.rotation.x = Math.sin(Date.now() * 0.001) * 0.05;
    }

    // Float particles
    if (particles) {
      particles.rotation.y += 0.002;
      particles.children.forEach((p, i) => {
        p.position.y += Math.sin(Date.now() * 0.001 + i) * 0.003;
      });
    }

    renderer.render(scene, camera);
  }

  animate();

  // Handle resize
  window.addEventListener("resize", () => {
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });
}

// Export for use in main.js
window.init3D = init3D;
window.THREE = window.THREE || null;
