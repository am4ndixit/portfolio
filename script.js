(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const stage = $('.stage'), video = $('#hero-video'), canvas = $('#frames');
  let scrollProgress = 0, targetScroll = 0;
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  // Text splitter with word wrapping protection for mobile/responsive layouts
  const split = (el, mode = 'chars') => {
    if (!el) return [];
    const text = el.textContent.trim();
    el.textContent = '';
    if (mode === 'chars') {
      const out = [];
      text.split(' ').forEach((word, wi, all) => {
        const wrap = document.createElement('span');
        wrap.className = 'word';
        [...word].forEach(ch => {
          const m = document.createElement('span');
          m.className = 'mask';
          const c = document.createElement('span');
          c.className = 'char';
          c.textContent = ch;
          m.append(c);
          wrap.append(m);
          out.push(c);
        });
        el.append(wrap, wi < all.length - 1 ? ' ' : '');
      });
      return out;
    }
    return text.split(' ').map((p, i, all) => {
      const w = document.createElement('span');
      w.className = 'w';
      w.textContent = p;
      el.append(w, i < all.length - 1 ? ' ' : '');
      return w;
    });
  };

  // Live IST Clock
  const tick = () => {
    const clk = $('#clock');
    if (clk) {
      clk.textContent = new Date().toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' IST';
    }
  };
  tick();
  setInterval(tick, 30000);

  // Copy email with race-condition safe toast
  let toastTimer;
  const copyBtn = $('#copy-mail');
  if (copyBtn) {
    copyBtn.addEventListener('click', async e => {
      const mail = e.currentTarget.dataset.mail || 'dixitaman117@gmail.com';
      try {
        await navigator.clipboard.writeText(mail);
      } catch {
        const t = document.createElement('textarea');
        t.value = mail;
        document.body.append(t);
        t.select();
        document.execCommand('copy');
        t.remove();
      }
      const toast = $('#toast');
      if (toast) {
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
      }
    });
  }

  // Tap-to-flip cards on touch screens
  $$('.flip').forEach(f => f.addEventListener('click', () => {
    if (!fine) f.classList.toggle('on');
  }));

  // Track global pointer for 3D parallax & lighting
  window.addEventListener('pointermove', e => {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  }, { passive: true });

  /* ===========================================================
     Cinematic 3D Fly-Through Engine (Three.js)
     Continuous camera dive inside 3D space as you scroll down
     with floating minimalist geometric structures and stardust
  =========================================================== */
  let hasThree3D = false;
  let update3DScene = null;

  const init3DScene = () => {
    if (!window.THREE || !canvas) return false;
    try {
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      if (renderer.toneMapping !== undefined) {
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.2;
      }

      const scene = new THREE.Scene();
      // Cinematic atmospheric fog matching portfolio obsidian palette (#050806)
      scene.fog = new THREE.FogExp2(0x050806, 0.0085);

      const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 400);
      camera.position.set(0, 0, 16);
      const lookTarget = new THREE.Vector3(0, 0, -18);
      camera.lookAt(lookTarget);

      // Lights: Ambient base + Headlight moving with camera + Cool & Mint Directionals
      const ambLight = new THREE.AmbientLight(0x182c20, 2.2);
      scene.add(ambLight);

      const camLight = new THREE.PointLight(0x9df7bb, 3.8, 100, 1.1);
      camLight.position.set(0, 0, 16);
      scene.add(camLight);

      const rimLightA = new THREE.DirectionalLight(0x22c55e, 2.2);
      rimLightA.position.set(16, 22, 12);
      scene.add(rimLightA);

      const rimLightB = new THREE.DirectionalLight(0xa5b4fc, 1.4);
      rimLightB.position.set(-18, -12, -45);
      scene.add(rimLightB);

      // Materials: Sleek faceted obsidian with luminous mint wireframes
      const darkBodyMat = new THREE.MeshStandardMaterial({
        color: 0x0c1a12,
        emissive: 0x041008,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.88
      });

      const glassBodyMat = new THREE.MeshPhysicalMaterial({
        color: 0x143322,
        emissive: 0x071e10,
        roughness: 0.1,
        metalness: 0.2,
        transmission: 0.72,
        transparent: true,
        opacity: 0.82,
        ior: 1.5
      });

      const edgeMintMat = new THREE.LineBasicMaterial({
        color: 0x9df7bb,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });

      const edgeWhiteMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending
      });

      const edgeSubtleMat = new THREE.LineBasicMaterial({
        color: 0x34d399,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
      });

      // Helper to assemble clean minimalist structures with edge-highlighting
      const structures = [];
      const addStructure = (geo, bodyMat, lineMat, pos, rot, rotSpeed, floatAmp = 0.35, floatSpeed = 1.0) => {
        const group = new THREE.Group();
        const mesh = new THREE.Mesh(geo, bodyMat);
        group.add(mesh);

        // Crisp wireframe / edge lines
        const edges = new THREE.EdgesGeometry(geo, 15);
        const lines = new THREE.LineSegments(edges, lineMat);
        group.add(lines);

        group.position.set(pos[0], pos[1], pos[2]);
        group.rotation.set(rot[0], rot[1], rot[2]);
        scene.add(group);

        structures.push({
          group,
          baseY: pos[1],
          rx: rotSpeed[0],
          ry: rotSpeed[1],
          rz: rotSpeed[2],
          amp: floatAmp,
          f: floatSpeed,
          phase: Math.random() * Math.PI * 2
        });
        return group;
      };

      // -------------------------------------------------------------
      // 1. WAYPOINT 1: HERO & INGRESS GATEWAY (Z: 10 to -25)
      // -------------------------------------------------------------
      // Main Entrance Portal Gate: Majestic faceted hexagonal torus ring
      addStructure(
        new THREE.TorusGeometry(5.2, 0.24, 16, 64),
        darkBodyMat, edgeMintMat,
        [0, 0, -6], [0.12, 0, 0], [0.001, 0.002, 0.0008], 0.2, 0.8
      );

      // Hero Focal Gem: Floating Octahedron inside the gateway
      addStructure(
        new THREE.OctahedronGeometry(1.5, 0),
        glassBodyMat, edgeMintMat,
        [0, 0, -8], [0.3, 0.4, 0.1], [0.006, 0.009, 0.004], 0.35, 1.2
      );

      // Flanking Diamond Obelisks / Prisms
      addStructure(
        new THREE.CylinderGeometry(0, 0.85, 5.5, 4),
        darkBodyMat, edgeMintMat,
        [-7.2, 1.2, -12], [0.2, 0.4, 0.1], [0.003, 0.005, 0.002], 0.4, 1.1
      );
      addStructure(
        new THREE.CylinderGeometry(0, 0.85, 5.5, 4),
        darkBodyMat, edgeMintMat,
        [7.5, -0.8, -15], [-0.15, -0.3, 0.2], [-0.002, 0.004, -0.003], 0.35, 0.9
      );

      // Weightless Floating Shards
      addStructure(
        new THREE.TetrahedronGeometry(1.6, 0),
        glassBodyMat, edgeWhiteMat,
        [-4.5, -3.2, -20], [0.4, 0.2, -0.3], [0.005, -0.004, 0.003], 0.3, 1.3
      );
      addStructure(
        new THREE.TetrahedronGeometry(1.7, 0),
        glassBodyMat, edgeMintMat,
        [4.8, 3.2, -18], [-0.3, 0.5, 0.2], [-0.004, 0.006, 0.002], 0.3, 1.2
      );

      // -------------------------------------------------------------
      // 2. WAYPOINT 2: SELECTED WORK / POLYHEDRA CORRIDOR (Z: -35 to -75)
      // -------------------------------------------------------------
      // Truncated Octahedron / Archimedean Solid
      addStructure(
        new THREE.IcosahedronGeometry(2.4, 0),
        darkBodyMat, edgeMintMat,
        [-4.8, 1.6, -42], [0.2, -0.3, 0.1], [0.004, 0.006, -0.002], 0.45, 0.95
      );

      // Nested Hypercube / Tesseract Frame
      const hypercubeGroup = new THREE.Group();
      const hcOuter = new THREE.Mesh(new THREE.BoxGeometry(3.0, 3.0, 3.0), darkBodyMat);
      const hcOuterLines = new THREE.LineSegments(new THREE.EdgesGeometry(hcOuter.geometry), edgeMintMat);
      const hcInner = new THREE.Mesh(new THREE.OctahedronGeometry(1.6, 0), glassBodyMat);
      const hcInnerLines = new THREE.LineSegments(new THREE.EdgesGeometry(hcInner.geometry), edgeWhiteMat);
      hypercubeGroup.add(hcOuter, hcOuterLines, hcInner, hcInnerLines);
      hypercubeGroup.position.set(5.2, -2.0, -58);
      scene.add(hypercubeGroup);
      structures.push({
        group: hypercubeGroup,
        baseY: -2.0,
        rx: 0.005, ry: -0.007, rz: 0.003,
        amp: 0.4, f: 1.05,
        phase: 1.2
      });

      // Floating Tech Slabs / Monolith Wafers
      addStructure(
        new THREE.BoxGeometry(4.6, 0.3, 2.4),
        darkBodyMat, edgeSubtleMat,
        [-5.8, -2.6, -68], [0.35, 0.2, -0.15], [-0.002, 0.004, 0.002], 0.35, 0.85
      );
      addStructure(
        new THREE.BoxGeometry(3.8, 0.26, 2.2),
        glassBodyMat, edgeMintMat,
        [5.0, 3.0, -48], [-0.2, -0.35, 0.1], [0.003, -0.003, 0.004], 0.3, 1.15
      );

      // -------------------------------------------------------------
      // 3. WAYPOINT 3: ABOUT / CORE ARCHITECTURE (Z: -85 to -125)
      // -------------------------------------------------------------
      // Sequential Cyberspace Ring Gate 1 (Camera flies right through its aperture!)
      addStructure(
        new THREE.TorusGeometry(6.6, 0.25, 16, 72),
        darkBodyMat, edgeMintMat,
        [0, 0, -92], [0.28, 0.15, -0.1], [0.001, 0.0018, -0.0008], 0.25, 0.75
      );

      // Gyroscope Satellite (3 Interlocking Gimbal Rings)
      const gyroGroup = new THREE.Group();
      const gR1 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.06, 12, 48), darkBodyMat);
      const gL1 = new THREE.LineSegments(new THREE.EdgesGeometry(gR1.geometry), edgeMintMat);
      const gR2 = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.06, 12, 48), darkBodyMat);
      gR2.rotation.x = Math.PI / 2;
      const gL2 = new THREE.LineSegments(new THREE.EdgesGeometry(gR2.geometry), edgeWhiteMat);
      const gR3 = new THREE.Mesh(new THREE.OctahedronGeometry(0.9, 0), glassBodyMat);
      const gL3 = new THREE.LineSegments(new THREE.EdgesGeometry(gR3.geometry), edgeMintMat);
      gyroGroup.add(gR1, gL1, gR2, gL2, gR3, gL3);
      gyroGroup.position.set(-6.2, 2.8, -106);
      scene.add(gyroGroup);
      structures.push({
        group: gyroGroup,
        baseY: 2.8,
        rx: 0.008, ry: 0.012, rz: -0.005,
        amp: 0.45, f: 1.1,
        phase: 2.3
      });

      // Sequential Cyberspace Ring Gate 2 (Camera zooms through the second ring!)
      addStructure(
        new THREE.TorusGeometry(6.2, 0.24, 16, 72),
        darkBodyMat, edgeMintMat,
        [0.4, -0.3, -118], [-0.22, -0.18, 0.25], [-0.0012, 0.002, 0.001], 0.25, 0.8
      );

      // Slender Data Monolith Column
      addStructure(
        new THREE.BoxGeometry(1.0, 7.5, 1.0),
        darkBodyMat, edgeSubtleMat,
        [6.8, -0.8, -112], [0.1, -0.2, 0.15], [0.002, 0.003, -0.001], 0.4, 0.9
      );

      // -------------------------------------------------------------
      // 4. WAYPOINT 4: JOURNEY / QUANTUM LATTICE (Z: -135 to -175)
      // -------------------------------------------------------------
      // Geodesic 20-sided Sphere
      addStructure(
        new THREE.IcosahedronGeometry(3.0, 1),
        darkBodyMat, edgeMintMat,
        [4.8, 2.0, -145], [0.2, 0.1, -0.3], [0.004, -0.005, 0.002], 0.4, 0.9
      );

      // Open Modular Lattice Corridor Frame
      addStructure(
        new THREE.BoxGeometry(6.2, 6.2, 1.4),
        darkBodyMat, edgeMintMat,
        [-0.2, 0, -160], [0, 0, Math.PI / 4], [0.0008, 0.001, 0.0015], 0.2, 0.7
      );

      // Floating Hexagonal Prism
      addStructure(
        new THREE.CylinderGeometry(2.0, 2.0, 1.0, 6),
        glassBodyMat, edgeMintMat,
        [-5.2, -2.4, -168], [0.4, -0.2, 0.3], [0.004, 0.005, -0.003], 0.35, 1.05
      );

      // Precision Diamond Bipyramid
      addStructure(
        new THREE.OctahedronGeometry(2.2, 0),
        darkBodyMat, edgeWhiteMat,
        [5.4, -2.6, -172], [-0.3, 0.4, 0.1], [-0.003, 0.004, 0.002], 0.35, 1.1
      );

      // -------------------------------------------------------------
      // 5. WAYPOINT 5: HORIZON / EVENT HORIZON TERMINUS (Z: -185 to -225)
      // -------------------------------------------------------------
      // Grand Infinity Horizon Beacon
      addStructure(
        new THREE.TorusGeometry(7.8, 0.3, 16, 80),
        darkBodyMat, edgeMintMat,
        [0, 0, -208], [0, 0, 0], [0.0008, 0.0012, 0.001], 0.2, 0.6
      );

      // Twin Architectural Horizon Pylons
      addStructure(
        new THREE.BoxGeometry(0.9, 10.0, 0.9),
        darkBodyMat, edgeMintMat,
        [-7.2, 0, -200], [0, 0.1, 0.05], [0.001, 0.002, 0], 0.2, 0.7
      );
      addStructure(
        new THREE.BoxGeometry(0.9, 10.0, 0.9),
        darkBodyMat, edgeMintMat,
        [7.2, 0, -200], [0, -0.1, -0.05], [-0.001, 0.002, 0], 0.2, 0.7
      );

      // Focal Core Beacon Diamond
      addStructure(
        new THREE.OctahedronGeometry(1.8, 0),
        glassBodyMat, edgeMintMat,
        [0, 0, -214], [0.2, 0.3, 0.1], [0.007, 0.01, 0.004], 0.3, 1.2
      );

      // -------------------------------------------------------------
      // 6. DEPTH TUNNEL STARDUST & CINEMATIC SPEED PARTICLES
      // -------------------------------------------------------------
      const starCount = 1800;
      const starGeo = new THREE.BufferGeometry();
      const starPos = new Float32Array(starCount * 3);
      const starDrift = new Float32Array(starCount * 3);
      const starCols = new Float32Array(starCount * 3);

      // Circular glowing particle texture
      const createParticleSprite = () => {
        const sc = document.createElement('canvas');
        sc.width = 64; sc.height = 64;
        const sctx = sc.getContext('2d');
        const gr = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gr.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gr.addColorStop(0.2, 'rgba(157, 247, 187, 0.95)');
        gr.addColorStop(0.5, 'rgba(157, 247, 187, 0.35)');
        gr.addColorStop(1, 'rgba(0, 0, 0, 0)');
        sctx.fillStyle = gr;
        sctx.fillRect(0, 0, 64, 64);
        const tex = new THREE.CanvasTexture(sc);
        tex.needsUpdate = true;
        return tex;
      };

      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        starPos[i3] = (Math.random() - 0.5) * 44;     // X: -22 to 22
        starPos[i3 + 1] = (Math.random() - 0.5) * 32; // Y: -16 to 16
        starPos[i3 + 2] = 20 - Math.random() * 245;  // Z: 20 to -225

        starDrift[i3] = (Math.random() - 0.5) * 0.015;
        starDrift[i3 + 1] = (Math.random() - 0.5) * 0.015;
        starDrift[i3 + 2] = (Math.random() - 0.5) * 0.02;

        if (i % 3 === 0) {
          starCols[i3] = 0.62; starCols[i3 + 1] = 0.98; starCols[i3 + 2] = 0.74; // Electric Mint
        } else if (i % 3 === 1) {
          starCols[i3] = 0.98; starCols[i3 + 1] = 1.0; starCols[i3 + 2] = 0.98;  // Diamond White
        } else {
          starCols[i3] = 0.40; starCols[i3 + 1] = 0.92; starCols[i3 + 2] = 0.85; // Aquamarine
        }
      }

      starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
      starGeo.setAttribute('color', new THREE.BufferAttribute(starCols, 3));

      const starMat = new THREE.PointsMaterial({
        size: 1.85,
        map: createParticleSprite(),
        transparent: true,
        opacity: 0.92,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const starPoints = new THREE.Points(starGeo, starMat);
      scene.add(starPoints);

      // Resize listener
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onResize);

      // Frame updater: Camera flies forward deep inside 3D space with scroll
      let time = 0;
      update3DScene = (p, dt = 0.016) => {
        time += dt;

        // Smooth mouse lerp
        mouse.x += (mouse.targetX - mouse.x) * 0.06;
        mouse.y += (mouse.targetY - mouse.y) * 0.06;

        if (!reduce) {
          // 1. Camera depth flight ("zooming in / going inside" as you scroll down)
          const zStart = 16.0;
          const zEnd = -215.0;
          const targetZ = zStart + p * (zEnd - zStart);
          camera.position.z += (targetZ - camera.position.z) * 0.075;

          // 2. Cinematic spline flight curve (organic drone banking & panning)
          const curveX = Math.sin(p * Math.PI * 2.2) * 3.4 + (mouse.x * 2.2);
          const curveY = Math.cos(p * Math.PI * 1.8) * 1.8 + (mouse.y * 1.5);
          camera.position.x += (curveX - camera.position.x) * 0.055;
          camera.position.y += (curveY - camera.position.y) * 0.055;

          // 3. Dynamic forward look-at target
          lookTarget.set(
            camera.position.x * 0.4,
            camera.position.y * 0.4,
            camera.position.z - 30.0
          );
          camera.lookAt(lookTarget);

          // 4. Subtle camera roll / banking
          camera.rotation.z = Math.sin(p * Math.PI * 2.2) * 0.04 - (mouse.x * 0.03);

          // 5. Headlight follows camera position
          camLight.position.copy(camera.position);

          // 6. Rotate and bob floating structures
          structures.forEach(st => {
            st.group.rotation.x += st.rx;
            st.group.rotation.y += st.ry;
            st.group.rotation.z += st.rz;
            st.group.position.y = st.baseY + Math.sin(time * st.f + st.phase) * st.amp;
          });

          // 7. Update and wrap stardust particles relative to moving camera
          const pArr = starGeo.attributes.position.array;
          const camZ = camera.position.z;
          for (let i = 0; i < starCount; i++) {
            const i3 = i * 3;
            pArr[i3] += starDrift[i3];
            pArr[i3 + 1] += starDrift[i3 + 1];

            // Wrap particles that fall behind or too far ahead of camera
            if (pArr[i3 + 2] > camZ + 8) {
              pArr[i3 + 2] -= 245;
            } else if (pArr[i3 + 2] < camZ - 237) {
              pArr[i3 + 2] += 245;
            }
          }
          starGeo.attributes.position.needsUpdate = true;
        }

        renderer.render(scene, camera);
      };

      stage.classList.add('has-3d');
      return true;
    } catch (err) {
      console.warn('Three.js 3D WebGL initialization skipped:', err);
      return false;
    }
  };

  // Attempt 3D WebGL initialization
  hasThree3D = init3DScene();

  // If GSAP is missing, unveil content gracefully and exit
  if (!window.gsap || !window.ScrollTrigger) {
    $('#loader')?.remove();
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // Smooth scroll with Lenis
  let lenis;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ lerp: 0.085, smoothWheel: true, syncTouch: false });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
      const targetId = a.getAttribute('href');
      const t = targetId === '#' ? null : $(targetId);
      if (t) {
        e.preventDefault();
        lenis.scrollTo(t);
      }
    }));
  }

  // Safe video scrub setup (only if video metadata is confirmed)
  if (video) {
    video.addEventListener('loadedmetadata', () => {
      if (video.duration) {
        stage.classList.add('has-video');
        video.pause();
      }
    });
  }

  // Master visual tick loop
  let lastTime = performance.now();
  const draw = () => {
    const now = performance.now();
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    scrollProgress += (targetScroll - scrollProgress) * 0.12;
    const p = scrollProgress;

    // 1. If WebGL 3D scene is active, render it
    if (hasThree3D && update3DScene) {
      update3DScene(p, dt);
    }
  };
  gsap.ticker.add(draw);

  // Scroll position updates
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: s => {
      targetScroll = s.progress;
      const bar = $('#progress');
      if (bar) bar.style.transform = `scaleX(${s.progress})`;
    }
  });

  // Nav hide on scroll down, reveal on scroll up
  let lastY = 0;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: s => {
      const y = s.scroll();
      const nav = $('#nav');
      if (nav) nav.classList.toggle('hide', y > lastY && y > 180);
      lastY = y;
    }
  });

  // Nav active pill links
  $$('.pill a').forEach(a => {
    const sec = $(a.getAttribute('href'));
    if (sec) {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: s => a.classList.toggle('active', s.isActive)
      });
    }
  });

  // Hero and Loader Intro Sequence
  const heroTitle = $('#hero-title');
  const ctaTitle = $('#cta-title');
  const chars = split(heroTitle, 'chars');
  const ctaChars = split(ctaTitle, 'chars');

  const intro = () => {
    $('#loader')?.remove();
    if (reduce) return;

    if (chars.length) {
      gsap.from(chars, {
        yPercent: 115,
        rotateX: -45,
        duration: 1.2,
        stagger: 0.04,
        ease: 'power4.out'
      });
    }

    gsap.from(['#hero-sub', '#hero-line', '.hero-cta', '.scroll-hint', '#nav'], {
      opacity: 0,
      y: 22,
      duration: 1,
      stagger: 0.1,
      delay: 0.4,
      ease: 'power3.out'
    });

    if (heroTitle) {
      gsap.to(heroTitle, {
        scale: 1.2,
        opacity: 0,
        y: -75,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom 35%',
          scrub: true
        }
      });
    }
  };

  // Loader count animation
  const count = { v: 0 };
  gsap.to(count, {
    v: 100,
    duration: reduce ? 0.05 : 1.3,
    ease: 'power2.inOut',
    onUpdate: () => {
      const cEl = $('#count');
      if (cEl) cEl.textContent = Math.round(count.v);
    },
    onComplete: () => {
      gsap.to('#loader', {
        yPercent: reduce ? 0 : -100,
        duration: reduce ? 0 : 0.85,
        ease: 'power4.inOut',
        onComplete: intro
      });
    }
  });

  // Animated Stat Counters
  $$('[data-count]').forEach(el => {
    const end = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const o = { v: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(o, {
        v: end,
        duration: reduce ? 0 : 1.8,
        ease: 'power3.out',
        snap: { v: 1 },
        onUpdate: () => {
          el.textContent = Math.round(o.v) + suffix;
        }
      })
    });
  });

  // Mission Word Scrub Reveal
  const missionEl = $('#mission');
  const words = split(missionEl, 'words');
  if (reduce) {
    $$('.reveal .w').forEach(w => w.style.opacity = 1);
  } else if (missionEl && words.length) {
    gsap.to(words, {
      opacity: 1,
      stagger: 0.08,
      ease: 'none',
      scrollTrigger: {
        trigger: '#mission',
        start: 'top 80%',
        end: 'bottom 45%',
        scrub: true
      }
    });
  }

  // CTA Headline Reveal
  if (!reduce && ctaChars.length) {
    gsap.from(ctaChars, {
      yPercent: 115,
      duration: 1.1,
      stagger: 0.04,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: '#cta-title',
        start: 'top 85%'
      }
    });
  }

  // Journey Timeline Fill & Steps
  const tl = $('#timeline');
  if (tl) {
    const fill = document.createElement('span');
    fill.className = 'fill';
    tl.append(fill);
    ScrollTrigger.create({
      trigger: tl,
      start: 'top 70%',
      end: 'bottom 60%',
      scrub: true,
      onUpdate: s => {
        fill.style.height = (s.progress * 100) + '%';
        $$('li', tl).forEach((li, i) => li.classList.toggle('on', s.progress >= (i / 4) - 0.02));
      }
    });
  }

  // Interactive Cursor, Magnetics & 3D Tilt (Fine pointers only)
  if (fine && !reduce) {
    const cur = $('#cursor');
    if (cur) {
      const xTo = gsap.quickTo(cur, 'x', { duration: 0.16 });
      const yTo = gsap.quickTo(cur, 'y', { duration: 0.16 });
      let cursorActive = false;

      addEventListener('pointermove', e => {
        if (!cursorActive) {
          cur.classList.add('active');
          cursorActive = true;
        }
        xTo(e.clientX);
        yTo(e.clientY);
      });

      $$('a, button, .flip').forEach(el => {
        el.addEventListener('pointerenter', () => {
          cur.classList.add('on');
          const b = $('b', cur);
          if (b) b.textContent = el.dataset.cursor || (el.classList.contains('flip') ? 'Flip' : '');
        });
        el.addEventListener('pointerleave', () => {
          cur.classList.remove('on');
          const b = $('b', cur);
          if (b) b.textContent = '';
        });
      });
    }

    // Magnetic buttons
    $$('.mag').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        gsap.to(b, {
          x: (e.clientX - r.left - r.width / 2) * 0.28,
          y: (e.clientY - r.top - r.height / 2) * 0.35,
          duration: 0.35
        });
      });
      b.addEventListener('pointerleave', () => {
        gsap.to(b, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1, .4)' });
      });
    });

    // 3D Tilt Cards with specular hover follow
    $$('.tilt').forEach(c => {
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        c.style.setProperty('--mx', (x * 100) + '%');
        c.style.setProperty('--my', (y * 100) + '%');
        if (!c.classList.contains('flip') && c.id !== 'community') {
          gsap.to(c, {
            rotateY: (x - 0.5) * 8,
            rotateX: (0.5 - y) * 7,
            duration: 0.45,
            transformPerspective: 1000
          });
        }
      });
      c.addEventListener('pointerleave', () => {
        if (!c.classList.contains('flip') && c.id !== 'community') {
          gsap.to(c, { rotateX: 0, rotateY: 0, duration: 0.75, ease: 'power3.out' });
        }
      });
    });
  }

  /* ===========================================================
     3D GitHub Contributions Model (Three.js)
     Interactive 3D isometric commit matrix for github.com/am4ndixit
  =========================================================== */
  const initContributions3D = () => {
    const cCanvas = $('#contrib-canvas');
    const cViewport = $('.contrib-viewport');
    const tooltip = $('#contrib-tooltip');
    if (!window.THREE || !cCanvas || !cViewport) return;

    try {
      const cRenderer = new THREE.WebGLRenderer({
        canvas: cCanvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      cRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      const cScene = new THREE.Scene();
      const cCamera = new THREE.PerspectiveCamera(38, 16 / 9, 0.1, 100);
      cCamera.position.set(0, 11.5, 17.5);
      cCamera.lookAt(0, 0.4, 0);

      const updateSize = () => {
        const w = cViewport.clientWidth || 800;
        const h = cViewport.clientHeight || 360;
        cRenderer.setSize(w, h, false);
        cCamera.aspect = w / h;
        cCamera.updateProjectionMatrix();
      };

      const matrixRoot = new THREE.Group();
      cScene.add(matrixRoot);

      // Pedestal
      const pedGeo = new THREE.BoxGeometry(24.2, 0.28, 4.2);
      const pedMat = new THREE.MeshPhysicalMaterial({
        color: 0x08110b,
        roughness: 0.25,
        metalness: 0.1,
        transparent: true,
        opacity: 0.88
      });
      const pedestal = new THREE.Mesh(pedGeo, pedMat);
      pedestal.position.set(0, -0.14, 0);
      matrixRoot.add(pedestal);

      const wireGeo = new THREE.EdgesGeometry(pedGeo);
      const wireMat = new THREE.LineBasicMaterial({ color: 0x9DF7BB, transparent: true, opacity: 0.35 });
      pedestal.add(new THREE.LineSegments(wireGeo, wireMat));

      // Lighting
      cScene.add(new THREE.AmbientLight(0x0a160e, 1.4));
      const cDirLight = new THREE.DirectionalLight(0xffffff, 1.1);
      cDirLight.position.set(6, 12, 8);
      cScene.add(cDirLight);

      const cMintLight = new THREE.PointLight(0x9DF7BB, 3.0, 20);
      cMintLight.position.set(-8, 6, 6);
      cScene.add(cMintLight);

      const cLavLight = new THREE.PointLight(0xC9B8FF, 2.2, 20);
      cLavLight.position.set(8, 4, -4);
      cScene.add(cLavLight);

      const hoverLight = new THREE.PointLight(0x9DF7BB, 0, 8);
      cScene.add(hoverLight);

      // Real 2026 commit records
      const activeMap = {
        '31_6': { date: '2026-06-06', count: 2 },
        '38_4': { date: '2026-07-23', count: 2 },
        '38_5': { date: '2026-07-24', count: 6 },
        '39_2': { date: '2026-07-28', count: 14, peak: true },
        '39_3': { date: '2026-07-29', count: 6 },
        '42_4': { date: '2026-08-20', count: 1 },
        '43_4': { date: '2026-08-27', count: 1 },
        '43_5': { date: '2026-08-28', count: 1 },
        '43_6': { date: '2026-08-29', count: 3 },
        '44_2': { date: '2026-09-01', count: 1 },
        '47_1': { date: '2026-09-21', count: 1 },
        '47_2': { date: '2026-09-22', count: 1 },
        '47_3': { date: '2026-09-23', count: 2 },
        '47_4': { date: '2026-09-24', count: 7 },
        '51_1': { date: '2026-10-19', count: 2 },
        '51_4': { date: '2026-10-22', count: 6 },
        '52_2': { date: '2026-10-27', count: 8, hackday: true },
        '52_4': { date: '2026-10-29', count: 2 }
      };

      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const formatDateStr = (dStr) => {
        try {
          const [y, m, d] = dStr.split('-');
          return `${months[+m - 1]} ${+d}, ${y}`;
        } catch { return dStr; }
      };

      const interactiveMeshes = [];
      const cols = 53, rows = 7;
      const spacingX = 0.44, spacingZ = 0.48;

      const baseTileMat = new THREE.MeshStandardMaterial({
        color: 0x121c15,
        roughness: 0.38,
        metalness: 0.08
      });

      const getPillarMat = count => {
        if (count >= 10) {
          return new THREE.MeshStandardMaterial({
            color: 0x9DF7BB,
            emissive: 0x4fc577,
            emissiveIntensity: 1.1,
            roughness: 0.12,
            metalness: 0.1
          });
        }
        if (count >= 6) {
          return new THREE.MeshStandardMaterial({
            color: 0x40c463,
            emissive: 0x1f7435,
            emissiveIntensity: 0.9,
            roughness: 0.18
          });
        }
        if (count >= 3) {
          return new THREE.MeshStandardMaterial({
            color: 0x2fa856,
            emissive: 0x134d26,
            emissiveIntensity: 0.7,
            roughness: 0.22
          });
        }
        return new THREE.MeshStandardMaterial({
          color: 0x226b3a,
          emissive: 0x0c3016,
          emissiveIntensity: 0.5,
          roughness: 0.25
        });
      };

      // Build 53 x 7 grid
      for (let w = 0; w < cols; w++) {
        for (let d = 0; d < rows; d++) {
          const key = `${w}_${d}`;
          const item = activeMap[key];
          const count = item ? item.count : 0;
          const posX = (w - cols / 2 + 0.5) * spacingX;
          const posZ = (d - rows / 2 + 0.5) * spacingZ;

          let mesh;
          if (count > 0) {
            const h = 0.45 + Math.min(count, 14) * 0.22;
            const geo = new THREE.BoxGeometry(0.36, h, 0.36);
            mesh = new THREE.Mesh(geo, getPillarMat(count));
            mesh.position.set(posX, h / 2, posZ);

            if (item.peak) {
              const bGeo = new THREE.SphereGeometry(0.08, 12, 12);
              const bMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
              const beacon = new THREE.Mesh(bGeo, bMat);
              beacon.position.set(0, h / 2 + 0.15, 0);
              mesh.add(beacon);
            }
          } else {
            const geo = new THREE.BoxGeometry(0.36, 0.08, 0.36);
            mesh = new THREE.Mesh(geo, baseTileMat);
            mesh.position.set(posX, 0.04, posZ);
          }

          mesh.userData = {
            date: item ? item.date : `2026-w${w + 1}-d${d + 1}`,
            count,
            peak: item?.peak,
            hackday: item?.hackday
          };
          matrixRoot.add(mesh);
          interactiveMeshes.push(mesh);
        }
      }

      // Initial isometric orientation
      let targetRotY = -0.32;
      let targetRotX = 0.48;
      let currRotY = -0.32;
      let currRotX = 0.48;
      matrixRoot.rotation.set(currRotX, currRotY, 0);

      // Drag to rotate in 3D
      let isDragging = false;
      let prevPointer = { x: 0, y: 0 };

      cCanvas.addEventListener('pointerdown', e => {
        isDragging = true;
        prevPointer.x = e.clientX;
        prevPointer.y = e.clientY;
      });

      window.addEventListener('pointermove', e => {
        if (!isDragging) return;
        const dx = e.clientX - prevPointer.x;
        const dy = e.clientY - prevPointer.y;
        prevPointer.x = e.clientX;
        prevPointer.y = e.clientY;

        targetRotY += dx * 0.007;
        targetRotX += dy * 0.005;
        targetRotX = Math.max(0.18, Math.min(0.95, targetRotX));
      });

      window.addEventListener('pointerup', () => { isDragging = false; });
      window.addEventListener('pointercancel', () => { isDragging = false; });

      // Raycasting for interactive hover tooltips
      const raycaster = new THREE.Raycaster();
      const pointerVec = new THREE.Vector2();
      let hoveredMesh = null;

      cCanvas.addEventListener('pointermove', e => {
        const rect = cCanvas.getBoundingClientRect();
        pointerVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        pointerVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(pointerVec, cCamera);
        const intersects = raycaster.intersectObjects(interactiveMeshes);

        if (intersects.length > 0) {
          const hit = intersects[0].object;
          if (hit !== hoveredMesh) {
            hoveredMesh = hit;
            const u = hit.userData;
            const dFormatted = formatDateStr(u.date);
            if (u.count > 0) {
              const note = u.peak ? ' · Peak day' : (u.hackday ? ' · Hackday 3rd place' : '');
              tooltip.textContent = `${dFormatted} · ${u.count} contribution${u.count > 1 ? 's' : ''}${note}`;
              tooltip.classList.add('highlight');
              hoverLight.position.copy(hit.position);
              hoverLight.position.y += 1.5;
              hoverLight.intensity = 2.0;
            } else {
              tooltip.textContent = `${dFormatted} · No contributions`;
              tooltip.classList.remove('highlight');
              hoverLight.intensity = 0;
            }
          }
        } else if (hoveredMesh) {
          hoveredMesh = null;
          tooltip.textContent = 'Hover over a 3D commit pillar to inspect';
          tooltip.classList.remove('highlight');
          hoverLight.intensity = 0;
        }
      });

      cCanvas.addEventListener('pointerleave', () => {
        hoveredMesh = null;
        tooltip.textContent = 'Hover over a 3D commit pillar to inspect';
        tooltip.classList.remove('highlight');
        hoverLight.intensity = 0;
      });

      // Responsive resize
      if (window.ResizeObserver) {
        new ResizeObserver(updateSize).observe(cViewport);
      }
      updateSize();

      // Render loop
      const renderContrib = () => {
        requestAnimationFrame(renderContrib);
        if (!isDragging && !reduce) {
          targetRotY += 0.0012; // Calm automatic drift
        }

        currRotY += (targetRotY - currRotY) * 0.08;
        currRotX += (targetRotX - currRotX) * 0.08;
        matrixRoot.rotation.y = currRotY;
        matrixRoot.rotation.x = currRotX;

        cRenderer.render(cScene, cCamera);
      };
      renderContrib();
    } catch (e) {
      console.warn('3D Contributions model initialization skipped:', e);
    }
  };

  // Initialize 3D GitHub Contributions Model
  initContributions3D();
})();
