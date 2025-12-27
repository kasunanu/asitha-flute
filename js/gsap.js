gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(ScrollSmoother);

// let smoother = ScrollSmoother.create({
//   wrapper: ".scroll-container",
//   // content: "main",
//   smooth: 1,
//   effects: true,
// });

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

/* Inject image into .hero-bg */

// const heroBg = document.querySelector(".hero-bg");

/* CLEAN previous content */
// heroBg.innerHTML = "";

// /* Create image */
// const img = new Image();
// img.src = "images/hero_bg.jpg";
// img.alt = "Hero Background";

// heroBg.appendChild(img);

// /* GSAP */
// gsap.fromTo(
//   img,
//   { scale: 0.5, opacity: 1 },
//   {
//     scale: 1.2,
//     opacity: 0,
//     ease: "none",
//     scrollTrigger: {
//       trigger: ".hero_section",
//       start: "top top",
//       endTrigger: ".about_con",
//       end: "bottom bottom",
//       scrub: true,
//       invalidateOnRefresh: true
//     }
//   }
// );




/* 🔹 Text color change per character (with spaces + line breaks) */
const textElements = document.querySelectorAll(".color_change");

textElements.forEach((textElement) => {
  const text = textElement.innerHTML;

  // Preserve <br> tags and spaces by splitting carefully
  textElement.innerHTML = text
    .replace(/\n/g, "<br>") // Convert raw newlines to <br>
    .split(/(<br\s*\/?>)/g) // Split while keeping <br>
    .map((part) => {
      if (part.match(/<br\s*\/?>/i)) return part; // Keep <br> as is

      // Split every character *including spaces* (use regex)
      return part
        .split(/( )/g)
        .map((char) => {
          if (char === " ") {
            // Wrap spaces in a span with a non-breaking space
            return `<span class="space">&nbsp;</span>`;
          }
          return `<span>${char}</span>`;
        })
        .join("");
    })
    .join("");

  const chars = textElement.querySelectorAll("span");

  // Animate characters from white to black (adjust colors if needed)
  gsap.fromTo(
    chars,
    { color: "#747474ff" },
    {
      color: "#ffffffff",
      scrollTrigger: {
        trigger: textElement,
        start: "top 70%",
        end: "bottom 50%",
        scrub: true,
      },
      stagger: 0.05,
      duration: 1,
    }
  );

  // 🔹 Image "Reveal" on Scroll
  gsap.utils.toArray(".square-box-content").forEach((box) => {
    gsap.fromTo(
      box,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: box,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });
});

// parallax effect

gsap.set(".paralax_eff", { yPercent: -50 });

gsap.to(".paralax_eff", {
  yPercent: 100,
  ease: "none",
  scrollTrigger: {
    trigger: ".clusterBurrowing",
    scrub: 1,
  },
});

// marquee

let direction = 1;

const duration = 8;
const marquees = document.querySelectorAll(".marquee");
const tl = gsap.timeline({
  repeat: -1,
  yoyo: false,
  onReverseComplete() {
    this.totalTime(this.rawTime() + this.duration() * 1); // otherwise when the playhead gets back to the beginning, it'd stop. So push the playhead forward 10 iterations (it could be any number)
  },
});

marquees.forEach((marquee) => {
  // This works beacause all the elements inside the marquee wrapper are exactly the same
  tl.to(
    marquee.querySelectorAll("h2"),
    {
      xPercent: marquee.dataset.reversed === "true" ? -100 : 100,
      repeat: 0,
      ease: "linear",
      duration: duration,
    },
    "<"
  );
});

let scroll = ScrollTrigger.create({
  onUpdate(self) {
    // Update the direction of the animation based on the direction of scroll
    if (self.direction !== direction) {
      direction *= -1;
    }

    // Update the animation speed (duration) based on the scroll speed
    tl.timeScale((duration * self.getVelocity()) / 5000);

    // Go back to the default duration
    gsap.to(tl, { timeScale: direction });
  },
});

// video slider

const slides = document.querySelectorAll(".slide");
const thumbnails = document.querySelectorAll(".thumbnail");
const progressFill = document.getElementById("progressFill");
let currentSlide = 0;
let isInSlider = false;

// Format time helper
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Initialize video controls for each slide
slides.forEach((slide, index) => {
  const video = slide.querySelector("video");
  const playPauseBtn = slide.querySelector(".play-pause");
  const playIcon = playPauseBtn.querySelector(".play-icon");
  const pauseIcon = playPauseBtn.querySelector(".pause-icon");
  const muteBtn = slide.querySelector(".mute-btn");
  const volumeIcon = muteBtn.querySelector(".volume-icon");
  const muteIcon = muteBtn.querySelector(".mute-icon");
  const volumeSlider = slide.querySelector(".volume-slider");
  const volumeFill = slide.querySelector(".volume-fill");
  const volumeHandle = slide.querySelector(".volume-handle");
  const timeDisplay = slide.querySelector(".time-display");

  // Update time display
  video.addEventListener("timeupdate", () => {
    timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(
      video.duration || 0
    )}`;
  });

  video.addEventListener("loadedmetadata", () => {
    timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(
      video.duration
    )}`;
  });

  // Play/Pause button
  playPauseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (video.paused) {
      video.play();
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
    } else {
      video.pause();
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    }
  });

  // Mute button
  muteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    video.muted = !video.muted;
    if (video.muted) {
      volumeIcon.style.display = "none";
      muteIcon.style.display = "block";
      volumeFill.style.width = "0%";
    } else {
      volumeIcon.style.display = "block";
      muteIcon.style.display = "none";
      volumeFill.style.width = video.volume * 100 + "%";
    }
  });

  // Volume slider
  let isDragging = false;

  function updateVolume(clientX) {
    const rect = volumeSlider.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const volume = x / rect.width;
    video.volume = volume;
    volumeFill.style.width = volume * 100 + "%";

    if (volume > 0 && video.muted) {
      video.muted = false;
      volumeIcon.style.display = "block";
      muteIcon.style.display = "none";
    }
  }

  volumeHandle.addEventListener("mousedown", (e) => {
    isDragging = true;
    e.preventDefault();
  });

  volumeSlider.addEventListener("click", (e) => {
    e.stopPropagation();
    updateVolume(e.clientX);
  });

  document.addEventListener("mousemove", (e) => {
    if (isDragging) {
      updateVolume(e.clientX);
    }
  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Initialize first video
  if (index === 0) {
    pauseIcon.style.display = "block";
    playIcon.style.display = "none";
  }
});

function changeSlide(index) {
  slides.forEach((s, i) => {
    const video = s.querySelector("video");
    const playPauseBtn = s.querySelector(".play-pause");
    const playIcon = playPauseBtn.querySelector(".play-icon");
    const pauseIcon = playPauseBtn.querySelector(".pause-icon");

    if (i === index) {
      s.classList.add("active");
      if (isInSlider) {
        video.play();
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
      }
    } else {
      s.classList.remove("active");
      video.pause();
      video.currentTime = 0;
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    }
  });

  thumbnails.forEach((t, i) => {
    if (i === index) {
      t.classList.add("active");
    } else {
      t.classList.remove("active");
    }
  });

  currentSlide = index;
}

// Scroll-triggered slide changes with pinning
ScrollTrigger.create({
  trigger: ".slider-container",
  start: "top top",
  end: "bottom bottom",
  pin: ".slider-sticky",
  pinSpacing: false,
  scrub: 1,
  onEnter: () => {
    isInSlider = true;
    const video = slides[currentSlide].querySelector("video");
    video.play();
    const playIcon = slides[currentSlide].querySelector(".play-icon");
    const pauseIcon = slides[currentSlide].querySelector(".pause-icon");
    playIcon.style.display = "none";
    pauseIcon.style.display = "block";
  },
  onLeave: () => {
    isInSlider = false;
    slides.forEach((slide) => {
      const video = slide.querySelector("video");
      video.pause();
      const playIcon = slide.querySelector(".play-icon");
      const pauseIcon = slide.querySelector(".pause-icon");
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    });
  },
  onEnterBack: () => {
    isInSlider = true;
    const video = slides[currentSlide].querySelector("video");
    video.play();
    const playIcon = slides[currentSlide].querySelector(".play-icon");
    const pauseIcon = slides[currentSlide].querySelector(".pause-icon");
    playIcon.style.display = "none";
    pauseIcon.style.display = "block";
  },
  onLeaveBack: () => {
    isInSlider = false;
    slides.forEach((slide) => {
      const video = slide.querySelector("video");
      video.pause();
      const playIcon = slide.querySelector(".play-icon");
      const pauseIcon = slide.querySelector(".pause-icon");
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    });
  },
  onUpdate: (self) => {
    const progress = self.progress;
    progressFill.style.width = progress * 100 + "%";

    if (progress < 0.33) {
      if (currentSlide !== 0) changeSlide(0);
    } else if (progress < 0.66) {
      if (currentSlide !== 1) changeSlide(1);
    } else {
      if (currentSlide !== 2) changeSlide(2);
    }
  },
});

// Thumbnail click handlers
thumbnails.forEach((thumb) => {
  thumb.addEventListener("click", () => {
    const index = parseInt(thumb.getAttribute("data-thumb"));
    changeSlide(index);

    // Scroll to corresponding position
    const container = document.querySelector(".slider-container");
    const scrollTo = container.offsetTop + container.offsetHeight * (index / 3);
    window.scrollTo({
      top: scrollTo,
      behavior: "smooth",
    });
  });
});

// services sec js

const track = document.querySelector(".services-track");
const cards = document.querySelectorAll(".service-card");

// Calculate total scroll distance
const trackWidth = track.scrollWidth;
const windowWidth = window.innerWidth;
const scrollDistance = trackWidth - windowWidth + windowWidth * 0.1;

// Horizontal scroll animation
gsap.to(track, {
  x: -scrollDistance,
  ease: "none",
  scrollTrigger: {
    trigger: ".services-container",
    start: "top top",
    end: () => `+=${scrollDistance}`,
    scrub: 1,
    pin: true,
    anticipatePin: 1,
  },
});

// Animate cards on scroll
cards.forEach((card, index) => {
  gsap.from(card, {
    opacity: 0,
    y: 100,
    scrollTrigger: {
      trigger: ".services-container",
      start: "top center",
      end: "center center",
      scrub: 1,
    },
    delay: index * 0.1,
  });
});

var static = $('.noiseBG');
staticAnimate(static);

function staticAnimate(object) {
    TweenMax.to(object, .03, {
        backgroundPosition: Math.floor(Math.random() * 100) + 1 + "% " + Math.floor(Math.random() * 10) + 1 + "%", 
        onComplete: staticAnimate,
        onCompleteParams: [object],
        ease:SteppedEase.config(1)
    });
}

// ScrollMagic

particlesJS("particles-js", {
  particles: {
    number: {
      value: 140,
      density: { enable: true, value_area: 900 }
    },
    color: { value: "#ffffff" },
    shape: { type: "triangle" },
    opacity: { value: 0.4 },
    size: { value: 3, random: true },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#ffffff",
      opacity: 0.25,
      width: 1
    },
    move: {
      enable: true,
      speed: 3,
      random: true,
      out_mode: "out"
    }
  },
  interactivity: {
    detect_on: "window",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: true, mode: "push" },
      resize: true
    },
    modes: {
      repulse: { distance: 100, duration: 0.4 },
      push: { particles_nb: 4 }
    }
  },
  retina_detect: true
});