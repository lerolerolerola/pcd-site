document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Selectors ---
  const menuItems = document.querySelectorAll(".menu-item");
  const hero = document.querySelector(".hero");
  const circleWords = document.querySelectorAll(".hero .word");
  const editionLinks = document.querySelectorAll(".edition-link");
  const practiceContainer = document.querySelector(".plural-practices");
  const quoteSec = document.querySelector(".quote-section");
  const progressBar = document.getElementById("quote-progress-bar");

  // Theme section
  const blocks = document.querySelectorAll(".theme-content-block");
  const themeEllipse = document.querySelectorAll(".theme-word");
  let currentIndex = 0;
  let isBlinking = false;

  // --- EYE SPAWNER LOGIC ---

  let idleTimer;
  let spawnInterval;
  let isFirstSpawn = true;

  const IDLE_WAIT = 6000; // Wait 6s of silence
  const FAST_SPAWN_GAP = 4000; // Then spawn every 4s

  function clearAllImages() {
    const images = document.querySelectorAll(".spawned-image");
    images.forEach((img) => {
      img.style.opacity = "0";
      img.style.transform = "scale(0.8) translateY(20px)";
      setTimeout(() => img.remove(), 500);
    });
  }

  function resetActivity() {
    // 1. Clear everything
    clearTimeout(idleTimer);
    clearInterval(spawnInterval);
    clearAllImages();

    // 2. Reset the acceleration flag
    isFirstSpawn = true;

    // 3. Set the timer for the very first eye
    idleTimer = setTimeout(createImage, IDLE_WAIT);
  }

  function createImage() {
    const img = document.createElement("img");
    const MAX_STAMPS = 50;

    const stampImages = [
      "images/reflect.svg",
      "images/reform.svg",
      "images/resist.svg",
    ];

    // img.src = "images/OLHO.png";
    const randomIndex = Math.floor(Math.random() * stampImages.length);
    img.src = stampImages[randomIndex];
    img.className = "spawned-image";

    // 1. Check if we reached the limit
    const currentStamps = document.querySelectorAll(".spawned-image");
    if (currentStamps.length >= MAX_STAMPS) {
      const oldest = currentStamps[0];
      oldest.style.opacity = "0";
      setTimeout(() => oldest.remove(), 500);
    }

    // Randomize Size
    const randomSize = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
    img.style.width = `${randomSize}px`;
    img.style.height = "auto";

    // Randomize Blink Speed (ScaleY animation in CSS)
    const blinkDuration = (Math.random() * (5 - 2) + 2).toFixed(2);
    img.style.animationDuration = `0.5s, ${blinkDuration}s`;

    // Randomize Position
    const maxX = window.innerWidth - randomSize;
    const maxY = window.innerHeight - randomSize;
    img.style.left = `${Math.random() * maxX}px`;
    img.style.top = `${Math.random() * maxY}px`;

    document.body.appendChild(img);

    // --- THE ACCELERATION FIX ---
    if (isFirstSpawn) {
      isFirstSpawn = false;
      // Immediately stop the single-shot timer and start the rapid-fire interval
      clearInterval(spawnInterval);
      spawnInterval = setInterval(createImage, FAST_SPAWN_GAP);
    }
  }

  // Event Listeners
  window.addEventListener("mousemove", resetActivity);
  window.addEventListener("scroll", resetActivity);
  window.addEventListener("keydown", resetActivity);
  window.addEventListener("click", resetActivity);

  // Start the initial idle countdown
  resetActivity();

  // //EYE SPAWNER LOGIC Script

  // let idleTimer;
  // let spawnInterval;
  // let isFirstSpawn = true;

  // const IDLE_WAIT = 6000;
  // const SPAWN_GAP = 10000;
  // const FAST_SPAWN_GAP = 100;

  // function resetActivity() {
  //   clearTimeout(idleTimer);
  //   clearInterval(spawnInterval);

  //   clearAllImages();
  //   isFirstSpawn = true; // Reset the flag when the user moves/scrolls

  //   // Start the countdown to the first single eye
  //   idleTimer = setTimeout(createImage, IDLE_WAIT);
  // }

  // function clearAllImages() {
  //     const images = document.querySelectorAll('.spawned-image');
  //     images.forEach(img => {
  //         img.style.opacity = '0';
  //         img.style.transform = 'scale(0.8) translateY(20px)';
  //         setTimeout(() => img.remove(), 500);
  //     });
  // }
  // function resetActivity() {
  //     clearTimeout(idleTimer);
  //     clearInterval(spawnInterval);

  //     clearAllImages();

  //     idleTimer = setTimeout(startSpawning, IDLE_WAIT);
  // }

  // function startSpawning() {

  //     createImage();

  //     clearInterval(spawnInterval);
  //     spawnInterval = setInterval(createImage, SPAWN_GAP);
  // }

  // function createImage() {
  //   const img = document.createElement("img");

  //   const randomSize = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
  //   img.style.width = `${randomSize}px`;
  //   img.style.height = "auto"; // Maintains aspect ratio

  //   const randomId = Math.floor(Math.random() * 1000);
  //   img.src = "images/OLHO.png";
  //   img.className = "spawned-image";

  //   const blinkDuration = (Math.random() * (5 - 2) + 2).toFixed(2);
  //   img.style.animationDuration = `0.5s, ${blinkDuration}s`;

  //   const maxX = window.innerWidth - randomSize;
  //   const maxY = window.innerHeight - randomSize;

  //   img.style.left = `${Math.random() * maxX}px`;
  //   img.style.top = `${Math.random() * maxY}px`;

  //   document.body.appendChild(img);

  //   // --- ACCELERATION LOGIC ---
  //   // If this was the first eye, immediately kick off the fast interval
  //   if (isFirstSpawn) {
  //     isFirstSpawn = false;
  //     clearInterval(spawnInterval);
  //     spawnInterval = setInterval(createImage, FAST_SPAWN_GAP);
  //   }
  // }

  // window.addEventListener('mousemove', resetActivity);
  // window.addEventListener('scroll', resetActivity);
  // window.addEventListener('keydown', resetActivity);
  // window.addEventListener('click', resetActivity);

  // resetActivity();

  // PISCAR THEME

  function performBlinkTransition() {
    // EXIT if mobile or already animating
    if (window.innerWidth <= 768 || isBlinking) return;

    isBlinking = true;

    // 1. Close Lids
    document.body.classList.add("blinking");

    // 2. Mid-blink: Swap the text (Wait 600ms for lids to meet)
    setTimeout(() => {
      // Hide current
      blocks[currentIndex].classList.remove("active");
      blocks[currentIndex].style.display = "none";

      // Calculate next index
      currentIndex = (currentIndex + 1) % blocks.length;

      // Show next
      blocks[currentIndex].style.display = "block";
      themeEllipse.forEach((el) => {
        el.innerHTML = newText;
      });

      // Force a reflow so the browser notices the display change
      void blocks[currentIndex].offsetWidth;
      blocks[currentIndex].classList.add("active");
    }, 600);

    // 3. Open Lids (Wait slightly longer so swap is invisible)
    setTimeout(() => {
      document.body.classList.remove("blinking");

      // Allow next blink only after lids are fully open
      setTimeout(() => {
        isBlinking = false;
      }, 600);
    }, 800);

    // Texto elipses tema
    if (currentIndex === 0) {
      newText = "resist";
    } else if (currentIndex === 1) {
      newText = "reform";
    } else {
      newText = "reflect";
    }
  }

  // function cycleThemeText() {
  //   // Remove active class from current
  //   blocks[currentIndex].classList.remove("active");

  //   // Move to next (loop back to 0 at the end)
  //   currentIndex = (currentIndex + 1) % blocks.length;

  //   // Add active class to next
  //   blocks[currentIndex].classList.add("active");
  // }

  // Variables for shared calculations
  let menuData = [];
  let wordData = [];
  let centerX, centerY;
  let scrollTimeout;

  // --- Mobile Click-to-Reveal Logic ---
  const labels = document.querySelectorAll(".quote-header span");

  labels.forEach((label) => {
    label.addEventListener("click", () => {
      // Only allow clicks to trigger redaction on mobile
      if (window.innerWidth <= 768) {
        const category = label.id.replace("label-", "");
        updateBlackout(category);
      }
    });
  });

  /** 2. INITIAL CALCULATIONS & WORD WRAPPING **/
  function init() {
    // A. Hero Explosion Math (Radial Center)
    // radiusX = window.innerWidth < 768 ? 150 : 420;
    // radiusY = window.innerWidth < 768 ? 250 : 220;
    if (hero) {
      // 1. Reset words to 0 to get their "natural" position for math
      circleWords.forEach((el) => (el.style.transform = "none"));

      centerX = window.innerWidth / 2;
      centerY = hero.offsetHeight / 2;

      wordData = Array.from(circleWords).map((word) => {
        // Measurement is now accurate because transform is 'none'
        const wordX = word.offsetLeft + word.offsetWidth / 2;
        const wordY = word.offsetTop + word.offsetHeight / 2;
        const angle = Math.atan2(wordY - centerY, wordX - centerX);
        return { el: word, angle: angle };
      });
    }

    radiusX = window.innerWidth < 768 ? window.innerWidth * 0.45 : 420;
    radiusY = window.innerWidth < 768 ? window.innerHeight * 0.35 : 220;
    if (hero) {
      centerX = window.innerWidth / 2;
      centerY = hero.offsetHeight / 2;

      wordData = Array.from(circleWords).map((word) => {
        // Use static offset relative to hero to prevent "lifting together" bug
        const wordX = word.offsetLeft + word.offsetWidth / 2;
        const wordY = word.offsetTop + word.offsetHeight / 2;
        const angle = Math.atan2(wordY - centerY, wordX - centerX);
        return { el: word, angle: angle };
      });
    }

    // B. Sticky Menu Initial Positions
    menuData = Array.from(menuItems).map((item) => {
      const topPct = parseFloat(item.dataset.top);
      const rightPct = parseFloat(item.dataset.right);

      item.style.top = topPct + "%";
      item.style.right = rightPct + "%";
      item.style.position = "absolute";

      return {
        el: item,
        topPct: topPct,
        rightPct: rightPct,
        initialY: (topPct / 100) * (hero ? hero.offsetHeight : 0),
      };
    });

    // C. Redaction Word Wrapping (Plural Practices)
    if (practiceContainer && !practiceContainer.dataset.wrapped) {
      const paragraphs = practiceContainer.querySelectorAll("p");
      paragraphs.forEach((p) => {
        const words = p.innerText.split(" ");
        p.innerHTML = words.map((word) => `<span>${word}</span>`).join(" ");
      });
      practiceContainer.dataset.wrapped = "true";
    }

    // Team section word wrapping for scroll effect
    const teamText = document.querySelectorAll(
      ".member-name, .member-affiliation, .member-role",
    );
    teamText.forEach((el) => {
      if (!el.dataset.wrapped) {
        const words = el.innerText.split(" ");
        el.innerHTML = words.map((word) => `<span>${word}</span>`).join(" ");
        el.dataset.wrapped = "true";
      }
    });

    const h2Titles = document.querySelectorAll("h2");
    h2Titles.forEach((el) => {
      if (!el.dataset.wrapped) {
        const words = el.innerText.split(" ");
        // Wrap each word in a span for the block effect
        el.innerHTML = words.map((word) => `<span>${word}</span>`).join(" ");
        el.dataset.wrapped = "true";
      }
    });

    // MOBILE TEXTURE GENERATOR
    if (window.innerWidth <= 768 && !hero.dataset.multiplied) {
      const layer = document.querySelector(".words-layer");
      const originalWords = Array.from(circleWords);

      // Clear and create a 'track' for the ticker
      layer.innerHTML = "";
      const tickerTrack = document.createElement("div");
      tickerTrack.classList.add("ticker-track");

      // Multiply to ensure the line is long enough to loop
      for (let i = 0; i < 19; i++) {
        originalWords.forEach((word) => {
          const clone = word.cloneNode(true);
          tickerTrack.appendChild(clone);
        });
      }
      // Mark as multiplied so it doesn't double-up on resize
      layer.appendChild(tickerTrack);
      hero.dataset.multiplied = "true";
    }
  }

  /** 3. OVAL ANIMATION (Previous Editions) **/
  //   const radiusX = 420;
  //   const radiusY = 220;
  let radiusX = window.innerWidth < 768 ? 150 : 420; // Smaller radius for mobile
  let radiusY = window.innerWidth < 768 ? 250 : 220;
  let angleOffset = 0;
  const speed = 0.005;
  let isPaused = false; // Tracks hover state

  // Attach hover detection
  editionLinks.forEach((link) => {
    link.addEventListener("mouseenter", () => (isPaused = true));
    link.addEventListener("mouseleave", () => (isPaused = false));
  });

  function positionLinks() {
    const isDesktop = window.innerWidth > 768;
    const radX = isDesktop ? 300 : 150;
    const radY = isDesktop ? 180 : 250;

    if (isDesktop && editionLinks.length > 0) {
      editionLinks.forEach((link, i) => {
        // Calculate a fixed position based on the index
        const spacing = (i / editionLinks.length) * (Math.PI * 2);
        // We remove the angleOffset to keep it static
        const x = Math.cos(spacing) * radX;
        const y = Math.sin(spacing) * radY;

        link.style.left = "50%";
        link.style.top = "50%";
        link.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      });
    } else {
      // Clear styles for mobile stack
      editionLinks.forEach((link) => {
        link.style.left = "";
        link.style.top = "";
        link.style.transform = "";
      });
    }
  }

  /** 4. MASTER SCROLL EVENT **/
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    const redactSections = document.querySelectorAll(
      ".plural-practices, .team-section",
    );
    redactSections.forEach((s) => s.classList.add("is-scrolling"));
    document.body.classList.add("is-scrolling");

    window.clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      // Remove from both
      redactSections.forEach((s) => s.classList.remove("is-scrolling"));
      document.body.classList.remove("is-scrolling");
    }, 85);

    // A. Practice Section: Redaction logic (Triggered while moving)
    // if (practiceContainer) {
    //   practiceContainer.classList.add("is-scrolling");
    //   window.clearTimeout(scrollTimeout);
    //   scrollTimeout = setTimeout(() => {
    //     practiceContainer.classList.remove("is-scrolling");
    //   }, 150);
    // }

    // MENU STICKY/  HERO PC
    menuData.forEach((data) => {
      if (scrollY > data.initialY - 16) {
        data.el.style.position = "fixed";
        data.el.style.top = "16px";

        if (data.isCentered) {
          data.el.style.left = "50%";
          data.el.style.transform = "translateX(-50%)";
        } else if (data.rightPct) {
          data.el.style.right = data.rightPct + "%";
          data.el.style.left = "auto";
        }
      } else {
        // Return to original Hero position
        data.el.style.position = "absolute";
        data.el.style.top = data.topPct + "%";

        if (data.isCentered) {
          data.el.style.left = "50%";
          data.el.style.transform = "translateX(-50%)";
        } else if (data.rightPct) {
          data.el.style.right = data.rightPct + "%";
          data.el.style.left = "auto";
        }
      }

      // Hide Logo ONLY when hitting the footer
      if (data.isCentered && footer) {
        const footerRect = footer.getBoundingClientRect();
        if (footerRect.top < 100) {
          data.el.style.opacity = "0";
          data.el.style.pointerEvents = "none";
        } else {
          data.el.style.opacity = "1";
          data.el.style.pointerEvents = "auto";
        }
      }
    });

    // C. Hero Section: Explosion Animation
    if (hero && scrollY < hero.offsetHeight + 100) {
      wordData.forEach((data) => {
        const distance = scrollY * 0.7; // Speed of words moving out
        const tx = Math.cos(data.angle) * distance;
        const ty = Math.sin(data.angle) * distance;
        data.el.style.transform = `translate(${tx}px, ${ty}px)`;
      });
    }

    if (quoteSec && window.innerWidth > 768) {
      const rect = quoteSec.getBoundingClientRect();

      if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
        const totalHeight = rect.height - window.innerHeight;
        const progress = Math.abs(rect.top) / totalHeight;

        if (progressBar) progressBar.style.height = progress * 100 + "%";

        // if (progress < 0.33) updateBlackout("quotes");
        // else if (progress < 0.66) updateBlackout("about");
        // else updateBlackout("change");
        if (progress < 0.33) {
          updateBlackout("theme");
        } else if (progress < 0.66) {
          updateBlackout("about");
        } else if (progress < 0.75) {
          updateBlackout("change"); // New state
          // } else {
          //   updateBlackout("intro");
        }
      } else if (rect.top > 0) {
        // Hide progress if we are above the section
        if (progressBar) progressBar.style.height = "0%";
        updateBlackout("theme");
      }
    }
  });

  /** 5. EXECUTION **/
  init();
  positionLinks();

  updateBlackout("quotes");

  // setInterval(cycleThemeText, 4000);

  setInterval(performBlinkTransition, 5000);

  window.addEventListener("resize", () => {
    init(); // Recalculate center points and initialY triggers
  });
});

/** GLOBAL UI FUNCTIONS (Accessible to onclick attributes) **/
function showCategory(cat) {
  document
    .querySelectorAll(".text")
    .forEach((t) => t.classList.remove("visible"));
  document
    .querySelectorAll(`.text.${cat}`)
    .forEach((t) => t.classList.add("visible"));
}

function hideAll() {
  document
    .querySelectorAll(".text")
    .forEach((t) => t.classList.remove("visible"));
}

function updateBlackout(cat) {
  // Update text visibility
  document.querySelectorAll(".quote-section .text").forEach((t) => {
    t.classList.toggle("visible", t.classList.contains(cat));
  });
  // Update vertical label active state
  document.querySelectorAll(".quote-header span").forEach((s) => {
    s.classList.toggle("active", s.id === `label-${cat}`);
  });
}
