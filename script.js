
const weddingDate = new Date(2026, 10, 25, 0, 0, 0);

// Countdown
function updateCountdown() {
  const diff = weddingDate.getTime() - Date.now();
  const note = document.getElementById("countdown-note");

  if (diff <= 0) {
    ["days", "hours", "minutes", "seconds"].forEach(id => {
      document.getElementById(id).textContent = "00";
    });
    if (note) note.textContent = "Today is the special day! ❤️";
    return;
  }

  document.getElementById("days").textContent =
    String(Math.floor(diff / 86400000)).padStart(3, "0");

  document.getElementById("hours").textContent =
    String(Math.floor((diff % 86400000) / 3600000)).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Scroll animations
const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

// Falling golden decorations
const hero = document.querySelector(".hero");
let petalCount = 0;

function createPetal() {
  if (!hero || petalCount >= 18) return;

  petalCount++;
  const petal = document.createElement("span");
  petal.className = "petal";
  petal.textContent = Math.random() > 0.5 ? "✦" : "❋";
  petal.style.left = Math.random() * 100 + "%";

  const duration = 7 + Math.random() * 7;
  petal.style.fontSize = (10 + Math.random() * 13) + "px";
  petal.style.animationDuration = duration + "s";

  hero.appendChild(petal);

  setTimeout(() => {
    petal.remove();
    petalCount--;
  }, duration * 1000);
}

setInterval(createPetal, 650);

// Background music
const music = document.getElementById("weddingMusic");
const musicBtn = document.getElementById("musicBtn");

async function playWeddingMusic() {
  if (!music) return;

  try {
    await music.play();

    if (musicBtn) {
      musicBtn.classList.add("playing");
      musicBtn.textContent = "♫";
      musicBtn.title = "Pause music";
    }
  } catch (error) {
    // Browser autoplay restriction: wait for visitor interaction.
    console.log("Tap anywhere to start wedding music.");
  }
}

function pauseWeddingMusic() {
  if (!music) return;

  music.pause();

  if (musicBtn) {
    musicBtn.classList.remove("playing");
    musicBtn.textContent = "♫";
    musicBtn.title = "Play music";
  }
}

// Attempt autoplay when the invitation page opens.
window.addEventListener("load", () => {
  playWeddingMusic();
});

// If autoplay is blocked, the first tap starts the song.
document.addEventListener("pointerdown", function startOnFirstTap() {
  if (music && music.paused) {
    playWeddingMusic();
  }
}, { once: true });

// Music button toggles playback.
if (musicBtn) {
  musicBtn.addEventListener("click", async event => {
    event.stopPropagation();

    if (music.paused) {
      await playWeddingMusic();
    } else {
      pauseWeddingMusic();
    }
  });
}

// WhatsApp invitation sharing
async function shareInvitation() {
  const text =
    "💛 Wedding Invitation 💛\n\n" +
    "Ved Prakash Arya & Khushi Kumari\n" +
    "Wedding Date: 25 November 2026\n" +
    "Venue: Khushi Borewell, Near Sahu Dharamsala, " +
    "Katkamdag, Hazaribagh, Jharkhand\n\n" +
    "You are invited to celebrate this beautiful occasion! ❤️\n\n" +
    "Invitation: " + window.location.href;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Ved & Khushi Wedding Invitation",
        text: text
      });
      return;
    } catch (error) {
      if (error.name === "AbortError") return;
    }
  }

  window.open(
    "https://wa.me/?text=" + encodeURIComponent(text),
    "_blank",
    "noopener,noreferrer"
  );
}

["shareVenue", "shareBottom", "shareFab"].forEach(id => {
  const button = document.getElementById(id);
  if (button) button.addEventListener("click", shareInvitation);
});
