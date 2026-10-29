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
     3D WebGL Model Engine (Three.js)
     Cinematic AI Neural Core with Gyroscopic Rings & Particles
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
        renderer.toneMappingExposure = 1.15;
      }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.set(0, 0, 7.2);

      const modelRoot = new THREE.Group();
      scene.add(modelRoot);

      // Core Group
      const coreGroup = new THREE.Group();
      modelRoot.add(coreGroup);

      // 1. Faceted Liquid Glass Core
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x11281c,
        emissive: 0x05150c,
        roughness: 0.14,
        metalness: 0.15,
        transmission: 0.88,
        ior: 1.5,
        transparent: true,
        opacity: 0.85,
        reflectivity: 0.8
      });
      const glassGeo = new THREE.IcosahedronGeometry(1.35, 0);
      const glassMesh = new THREE.Mesh(glassGeo, glassMat);
      coreGroup.add(glassMesh);

      // 2. Outer Glowing Neural Lattice (Wireframe)
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x9DF7BB,
        wireframe: true,
        transparent: true,
        opacity: 0.42
      });
      const wireGeo = new THREE.IcosahedronGeometry(1.358, 0);
      const wireMesh = new THREE.Mesh(wireGeo, wireMat);
      coreGroup.add(wireMesh);

      // 3. Inner Pulsing Quantum Nucleus
      const nucleusMat = new THREE.MeshBasicMaterial({
        color: 0x9DF7BB,
        wireframe: true,
        transparent: true,
        opacity: 0.78
      });
      const nucleus = new THREE.Mesh(new THREE.OctahedronGeometry(0.72, 0), nucleusMat);
      coreGroup.add(nucleus);

      const centerGlow = new THREE.Mesh(
        new THREE.SphereGeometry(0.38, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0x9DF7BB, transparent: true, opacity: 0.35 })
      );
      coreGroup.add(centerGlow);

      // 4. Concentric Gyroscopic Gimbal Rings
      const ringMatMint = new THREE.MeshBasicMaterial({
        color: 0x9DF7BB,
        transparent: true,
        opacity: 0.38
      });
      const ringMatWhite = new THREE.MeshBasicMaterial({
        color: 0xF4F6F2,
        transparent: true,
        opacity: 0.28
      });
      const ringMatLav = new THREE.MeshBasicMaterial({
        color: 0xC9B8FF,
        transparent: true,
        opacity: 0.32
      });

      const ringA = new THREE.Mesh(new THREE.TorusGeometry(2.35, 0.015, 16, 100), ringMatMint);
      ringA.rotation.set(68 * Math.PI / 180, 0, -22 * Math.PI / 180);
      modelRoot.add(ringA);

      const ringB = new THREE.Mesh(new THREE.TorusGeometry(2.85, 0.013, 16, 100), ringMatLav);
      ringB.rotation.set(0, 62 * Math.PI / 180, 18 * Math.PI / 180);
      modelRoot.add(ringB);

      const ringC = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.012, 16, 100), ringMatWhite);
      ringC.rotation.set(38 * Math.PI / 180, 55 * Math.PI / 180, 0);
      modelRoot.add(ringC);

      // Orbital Satellites
      const satGeo = new THREE.SphereGeometry(0.065, 12, 12);
      const satMat = new THREE.MeshBasicMaterial({ color: 0x9DF7BB });
      const satA = new THREE.Mesh(satGeo, satMat);
      ringA.add(satA); satA.position.set(2.35, 0, 0);

      const satB = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      ringB.add(satB); satB.position.set(0, 2.85, 0);

      // 5. Floating 3D Polyhedra & Wire Cubes
      const shards = [];
      const shardGeo = new THREE.BoxGeometry(0.38, 0.38, 0.38);
      const shardMat = new THREE.MeshBasicMaterial({
        color: 0x9DF7BB,
        wireframe: true,
        transparent: true,
        opacity: 0.4
      });
      const shardPositions = [
        [-3.2, 1.8, -1.2],
        [3.0, -1.6, -0.8],
        [-2.4, -2.1, 0.8],
        [2.6, 2.2, 0.5]
      ];
      shardPositions.forEach(pos => {
        const sh = new THREE.Mesh(shardGeo, shardMat);
        sh.position.set(...pos);
        sh.userData = {
          rx: (Math.random() - 0.5) * 0.02,
          ry: (Math.random() - 0.5) * 0.02,
          rz: (Math.random() - 0.5) * 0.02
        };
        modelRoot.add(sh);
        shards.push(sh);
      });

      // 6. Neural Particle Constellation
      const pCount = 520;
      const pGeo = new THREE.BufferGeometry();
      const pPos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        const r = 2.0 + Math.random() * 5.0;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        pPos[i * 3 + 2] = r * Math.cos(phi);
      }
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0x9DF7BB,
        size: 0.038,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending
      });
      const particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      // 7. Lighting
      const ambientLight = new THREE.AmbientLight(0x0a140e, 1.2);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(4, 5, 4);
      scene.add(dirLight);

      const mintLight = new THREE.PointLight(0x9DF7BB, 3.2, 15);
      mintLight.position.set(-3, 2, 3);
      scene.add(mintLight);

      const lavLight = new THREE.PointLight(0xC9B8FF, 2.5, 15);
      lavLight.position.set(3, -2, -2);
      scene.add(lavLight);

      const cursorLight = new THREE.PointLight(0x9DF7BB, 1.8, 10);
      cursorLight.position.set(0, 0, 3);
      scene.add(cursorLight);

      // Resize handler
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', onResize);

      // Frame updater
      let time = 0;
      update3DScene = (p, dt = 0.016) => {
        time += dt;

        // Smooth mouse lerp
        mouse.x += (mouse.targetX - mouse.x) * 0.06;
        mouse.y += (mouse.targetY - mouse.y) * 0.06;

        cursorLight.position.set(mouse.x * 4, mouse.y * 3, 3.2);

        if (!reduce) {
          // Model rotation & drift
          coreGroup.rotation.y = time * 0.22 + p * 1.8;
          coreGroup.rotation.x = Math.sin(time * 0.3) * 0.12 + p * 0.6;

          nucleus.rotation.y = -time * 0.45;
          nucleus.rotation.z = time * 0.3;
          const pulse = 1 + Math.sin(time * 3.0) * 0.08;
          nucleus.scale.set(pulse, pulse, pulse);

          ringA.rotation.z = -22 * Math.PI / 180 + time * 0.28 + p * 1.6;
          ringB.rotation.x = 18 * Math.PI / 180 + time * 0.22 + p * 1.4;
          ringC.rotation.y = 55 * Math.PI / 180 - time * 0.32 - p * 1.8;

          shards.forEach(sh => {
            sh.rotation.x += sh.userData.rx;
            sh.rotation.y += sh.userData.ry;
            sh.rotation.z += sh.userData.rz;
          });

          particles.rotation.y = time * 0.03 + p * 0.6;
          particles.rotation.x = time * 0.02;

          // Parallax & scroll camera track
          modelRoot.rotation.y = mouse.x * 0.38;
          modelRoot.rotation.x = -mouse.y * 0.28;
          modelRoot.position.y = -p * 2.2 + (Math.sin(p * Math.PI) * 0.4);
          modelRoot.position.x = Math.sin(p * Math.PI * 1.2) * 0.9;
          camera.position.z = 7.2 + p * 1.6;
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
    // 2. Video scrub fallback
    else if (stage.classList.contains('has-video') && video && video.duration) {
      const t = Math.min(video.duration - 0.05, p * video.duration);
      if (Math.abs(video.currentTime - t) > 0.03) {
        video.currentTime = t;
      }
    }
    // 3. Robust procedural CSS 3D fallback
    else if (!reduce) {
      gsap.set('.o1', { y: p * -240, scale: 1 + p * 0.8 });
      gsap.set('.o2', { y: p * -480, x: p * 110 });
      gsap.set('.o3', { y: p * 340, x: p * -140 });
      gsap.set('.s1', { y: p * 280, rotate: -14 + p * 45 });
      gsap.set('.s2', { y: p * -380, rotate: 12 - p * 55 });

      // Camera drift on parent wrappers so CSS keyframes aren't wiped out
      gsap.set('.motion-world', {
        rotationY: (p - 0.5) * 8,
        rotationX: (0.5 - p) * 5,
        scale: 1 + p * 0.06,
        transformOrigin: '50% 50%'
      });
      gsap.set('.core-wrap', { y: p * -32 });
      gsap.set('.cube-wrap-a', { x: p * -60, y: p * 40 });
      gsap.set('.cube-wrap-b', { x: p * 50, y: p * -60 });
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
