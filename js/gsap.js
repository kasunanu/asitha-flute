document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  // --- PRELOADER LOGIC ---
  const preloader = document.getElementById("preloader");
  
  // Hide the preloader when the window is fully loaded
  window.addEventListener("load", () => {
    const tl = gsap.timeline();

    tl.to(".loader-content", {
      opacity: 0,
      y: -20,
      duration: 1.5
    })
    .to(preloader, {
      yPercent: -100, // Slides up like a curtain
      duration: 1.5,
      ease: "power4.inOut"
    })
    .from("#smooth-wrapper", {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power2.out"
    }, "-=1") // Starts slightly before the curtain finishes
    .set(preloader, { display: "none" }); // Remove from DOM so it doesn't block clicks
  });

  const smoother = ScrollSmoother.create({
    wrapper: "#body",
    content: "#smooth-wrapper",
    smooth: 2,
    smoothTouch: false,
    normalizeScroll: true,
    ignoreMobileResize: true,
    effects: true,
    preventDefault: true,
  });

  /* 🔹 Hero image zoom + fade */
  if (document.querySelector(".hero_section") && document.querySelector(".hero-bg")) {
    ScrollTrigger.create({
      trigger: ".hero_section",
      start: "top top",
      end: "bottom top",
      pin: ".hero-bg",
      pinSpacing: false
    });

    gsap.to(".hero-bg", {
      scale: 1.3,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero_section",
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });
  }

  /* 🔹 Text color change */
  const textElements = document.querySelectorAll(".color_change");
  textElements.forEach((textElement) => {
    const text = textElement.innerHTML;
    textElement.innerHTML = text
      .replace(/\n/g, "<br>")
      .split(/(<br\s*\/?>)/g)
      .map((part) => {
        if (part.match(/<br\s*\/?>/i)) return part;
        return part.split(/( )/g).map((char) => {
          if (char === " ") return `<span class="space">&nbsp;</span>`;
          return `<span>${char}</span>`;
        }).join("");
      }).join("");

    const chars = textElement.querySelectorAll("span");
    if (chars.length > 0) {
      gsap.fromTo(chars, 
        { color: "#747474" }, 
        {
          color: "#ffffff",
          scrollTrigger: {
            trigger: textElement,
            start: "top 70%",
            end: "bottom 50%",
            scrub: true,
          },
          stagger: 0.05,
        }
      );
    }
  });

// --- VIDEO SLIDER START ---

const slides = document.querySelectorAll(".slide");
const thumbnails = document.querySelectorAll(".thumbnail");
const progressFill = document.getElementById("progressFill");
let currentSlide = 0;
let isInSlider = false;

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// 1. Initialize Video Controls & Seek Bar
slides.forEach((slide) => {
  const video = slide.querySelector("video");
  const playPauseBtn = slide.querySelector(".play-pause");
  const muteBtn = slide.querySelector(".mute-btn");
  const seekBar = slide.querySelector(".volume-slider"); 
  const seekFill = slide.querySelector(".volume-fill");

  if (!video) return;

  // Sync Button Icons on Play/Pause
  const updateButtonIcons = () => {
    const playIcon = playPauseBtn?.querySelector(".play-icon");
    const pauseIcon = playPauseBtn?.querySelector(".pause-icon");
    if (video.paused) {
      if (playIcon) playIcon.style.display = "block";
      if (pauseIcon) pauseIcon.style.display = "none";
    } else {
      if (playIcon) playIcon.style.display = "none";
      if (pauseIcon) pauseIcon.style.display = "block";
    }
  };

  video.addEventListener("play", updateButtonIcons);
  video.addEventListener("pause", updateButtonIcons);

  playPauseBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    video.paused ? video.play() : video.pause();
  });

  muteBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    const vIcon = muteBtn.querySelector(".volume-icon");
    const mIcon = muteBtn.querySelector(".mute-icon");
    if (vIcon) vIcon.style.display = video.muted ? "none" : "block";
    if (mIcon) mIcon.style.display = video.muted ? "block" : "none";
  });

  // Seek Bar Logic
  if (seekBar) {
    seekBar.addEventListener("click", (e) => {
      const rect = seekBar.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      video.currentTime = pct * video.duration;
    });

    video.addEventListener("timeupdate", () => {
      const pct = (video.currentTime / video.duration) * 100;
      if (seekFill) seekFill.style.width = pct + "%";
      const timeDisplay = slide.querySelector(".time-display");
      if (timeDisplay) timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration || 0)}`;
    });
  }
});

// 2. Thumbnail Navigation
thumbnails.forEach((thumb) => {
  thumb.addEventListener("click", () => {
    const index = parseInt(thumb.getAttribute("data-thumb"));
    const container = document.querySelector(".slider-container");
    // Calculate scroll position precisely
    const sectionStart = container.offsetTop;
    const sectionHeight = container.offsetHeight;
    const targetScroll = sectionStart + (sectionHeight * (index / 3));

    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  });
});

// 3. Slide Changing Logic
function changeSlide(index) {
  slides.forEach((s, i) => {
    const video = s.querySelector("video");
    if (!video) return;

    if (i === index) {
      s.classList.add("active");
      if (isInSlider) {
        video.play().catch(() => {
          video.muted = true;
          video.play();
        });
      }
    } else {
      s.classList.remove("active");
      video.pause();
      video.currentTime = 0;
    }
  });

  thumbnails.forEach((t, i) => {
    i === index ? t.classList.add("active") : t.classList.remove("active");
  });
  currentSlide = index;
}

// 4. Scroll Trigger for Pinning & Section Entry/Exit
ScrollTrigger.create({
  trigger: ".slider-container",
  start: "top top",
  end: "bottom bottom",
  pin: ".slider-sticky",
  pinSpacing: true, // Prevents overlapping
  scrub: 1,
  onEnter: () => {
    isInSlider = true;
    changeSlide(currentSlide);
  },
  onLeave: () => {
    isInSlider = false;
    // STOP ALL VIDEOS when scrolling past
    slides.forEach(s => s.querySelector("video")?.pause());
  },
  onEnterBack: () => {
    isInSlider = true;
    changeSlide(currentSlide);
  },
  onLeaveBack: () => {
    isInSlider = false;
    // STOP ALL VIDEOS when scrolling above
    slides.forEach(s => s.querySelector("video")?.pause());
  },
  onUpdate: (self) => {
    if (progressFill) progressFill.style.width = self.progress * 100 + "%";
    
    // Switch slides based on scroll position
    let newIdx = Math.min(Math.floor(self.progress * 3), 2);
    if (currentSlide !== newIdx) changeSlide(newIdx);
  },
});

// --- VIDEO SLIDER END ---

  /* 🔹 Image Reveal */
  gsap.utils.toArray(".square-box-content").forEach((box) => {
    gsap.fromTo(box, { opacity: 0, y: 50 }, {
      opacity: 1, y: 0, duration: 1.5, ease: "power2.out",
      scrollTrigger: { trigger: box, start: "top 80%", toggleActions: "play none none reverse" }
    });
  });

/* 🔹 Multiple Parallax Sections Logic */
gsap.utils.toArray(".clusterBurrowing").forEach((container) => {
  const innerElement = container.querySelector(".paralax_eff");

  if (innerElement) {
    // Set initial position
    gsap.set(innerElement, { yPercent: -50 });

    // Create animation for THIS specific container
    gsap.to(innerElement, {
      yPercent: 50, // Reduced from 100 for a smoother feel across multiple sections
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top bottom", // Starts when container enters bottom of screen
        end: "bottom top",   // Ends when container leaves top of screen
        scrub: true
      }
    });
  }
});

  /* 🔹 Marquee */
  const marquees = document.querySelectorAll(".marquee");
  if (marquees.length > 0) {
    let direction = 1;
    const tl = gsap.timeline({ repeat: -1 });
    marquees.forEach((m) => {
      tl.to(m.querySelectorAll("h2"), {
        xPercent: m.dataset.reversed === "true" ? -100 : 100,
        ease: "linear", duration: 8
      }, "<");
    });
    ScrollTrigger.create({
      onUpdate: (self) => {
        if (self.direction !== direction) direction *= -1;
        tl.timeScale(direction * (1 + Math.abs(self.getVelocity() / 2500)));
        gsap.to(tl, { timeScale: direction, duration: 0.5 });
      }
    });
  }

  /* 🔹 Services Track */
  const track = document.querySelector(".services-track");
  if (track) {
    const scrollDistance = track.scrollWidth - window.innerWidth + (window.innerWidth * 0.1);
    gsap.to(track, {
      x: -scrollDistance,
      ease: "none",
      scrollTrigger: {
        trigger: ".services-container",
        start: "top top",
        end: () => `+=${scrollDistance}`,
        scrub: 1,
        pin: true,
      },
    });
  }

  /* 🔹 Noise & Particles (Unchanged) */
  const noiseBG = document.querySelector('.noiseBG');
  if (noiseBG) {
    const animateNoise = () => {
      gsap.to(noiseBG, {
        duration: 0.03,
        backgroundPosition: `${Math.random() * 100}% ${Math.random() * 100}%`,
        onComplete: animateNoise,
        ease: "steps(1)"
      });
    };
    animateNoise();
  }

  if (document.getElementById("particles-js")) {
    particlesJS("particles-js", {
      particles: {
        number: { value: 140, density: { enable: true, value_area: 900 } },
        color: { value: "#ffffff" },
        shape: { type: "triangle" },
        opacity: { value: 0.4 },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.25, width: 1 },
        move: { enable: true, speed: 3, random: true, out_mode: "out" }
      },
      interactivity: {
        detect_on: "window",
        events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
        modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
      },
      retina_detect: true
    });
  }
});