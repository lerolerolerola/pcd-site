document.addEventListener("DOMContentLoaded", () => {
  // --- 1. Selectors ---
  const menuItems = document.querySelectorAll(".menu-item");
  const hero = document.querySelector(".hero");
  const circleWords = document.querySelectorAll(".word");
  const editionLinks = document.querySelectorAll(".edition-link");
  const practiceContainer = document.querySelector(".practices-column-text");
  const quoteSec = document.querySelector(".quote-section");
  const progressBar = document.getElementById("quote-progress-bar");

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

//   function animateOval() {
//     // Logic inside if ensures the spin stops when isPaused is true
//     if (!isPaused && editionLinks.length > 0) {
//       editionLinks.forEach((link, i) => {
//         const spacing = (i / editionLinks.length) * (Math.PI * 2);
//         const currentAngle = spacing + angleOffset;
//         const x = Math.cos(currentAngle) * radiusX;
//         const y = Math.sin(currentAngle) * radiusY;

//         link.style.left = "50%";
//         link.style.top = "50%";
//         link.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
//       });
//       angleOffset += speed;
//     }
//     requestAnimationFrame(animateOval);
//   }

  function animateOval() {
    // 1. Check if we are on Desktop
    const isDesktop = window.innerWidth > 768;

    // 2. Only run the oval math if we are on desktop AND not paused
    if (isDesktop && !isPaused && editionLinks.length > 0) {
      editionLinks.forEach((link, i) => {
        const spacing = (i / editionLinks.length) * (Math.PI * 2);
        const currentAngle = spacing + angleOffset;
        const x = Math.cos(currentAngle) * radiusX;
        const y = Math.sin(currentAngle) * radiusY;

        link.style.left = "50%";
        link.style.top = "50%";
        link.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      });
      angleOffset += speed;
    }
    // 3. If we are on mobile, clear the inline styles so the CSS can take over
    else if (!isDesktop) {
      editionLinks.forEach((link) => {
        link.style.left = "";
        link.style.top = "";
        link.style.transform = "";
      });
    }

    requestAnimationFrame(animateOval);
  }

  /** 4. MASTER SCROLL EVENT **/
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    // A. Practice Section: Redaction logic (Triggered while moving)
    if (practiceContainer) {
      practiceContainer.classList.add("is-scrolling");
      window.clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        practiceContainer.classList.remove("is-scrolling");
      }, 150);
    }

    // B. Sticky Menu Logic
    menuData.forEach((data) => {
      if (scrollY > data.initialY - 16) {
        data.el.style.position = "fixed";
        data.el.style.top = "16px";
      } else {
        data.el.style.position = "absolute";
        data.el.style.top = data.topPct + "%";
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

    // D. Quote Section: Sticky Blackout Logic & Progress Bar
    // if (quoteSec) {
    //   const rect = quoteSec.getBoundingClientRect();

    //   // If the section is "locked" in view
    //   if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
    //     const totalHeight = rect.height - window.innerHeight;
    //     const progress = Math.abs(rect.top) / totalHeight;

    //     // Update Progress Bar
    //     if (progressBar) progressBar.style.height = progress * 100 + "%";

    //     // Switch categories based on scroll depth
    //     if (progress < 0.33) updateBlackout("quotes");
    //     else if (progress < 0.66) updateBlackout("change");
    //     else updateBlackout("about");
    //   }
    //   // Reset to first state if user scrolls back up
    //   else if (rect.top > 0) {
    //     updateBlackout("quotes");
    //   }
    // }

    if (quoteSec && window.innerWidth > 768) {
      const rect = quoteSec.getBoundingClientRect();

      if (rect.top <= 0 && rect.bottom >= window.innerHeight) {
        const totalHeight = rect.height - window.innerHeight;
        const progress = Math.abs(rect.top) / totalHeight;

        if (progressBar) progressBar.style.height = progress * 100 + "%";

        if (progress < 0.33) updateBlackout("quotes");
        else if (progress < 0.66) updateBlackout("change");
        else updateBlackout("about");
      } else if (rect.top > 0) {
        // Hide progress if we are above the section
        if (progressBar) progressBar.style.height = "0%";
        updateBlackout("quotes");
      }
    }
  });

  /** 5. EXECUTION **/
  init();
  animateOval();

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
