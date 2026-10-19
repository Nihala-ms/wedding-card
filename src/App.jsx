
import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import "./index.css";

const wedding = {
  bride: "Ayesha",
  groom: "Ayaan",
  brideFather: "Muhammed Basheer",
  brideMother: "Safiya Basheer",
  brideAddress: "Basheer House, Ponnani, Malappuram, Kerala",
  groomFather: "Abdul Rahman",
  groomMother: "Fathima Rahman",
  groomAddress: "Rahman Manzil, Kottakkal, Malappuram, Kerala",
  date: "2027-02-14T10:00:00",
  displayDate: "14 FEBRUARY 2027",
  ceremonyTime: "12:00 PM ",
  venue: "AURORA CASTLE THRISSUR",
  address: "Thrissur, Kerala, India",
  mapsUrl: "https://maps.google.com/?q=Thrissur+Kerala",
};

const photos = [
  {
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=90",
    title: "The beginning",
  },
  {
    image:
      "https://images.unsplash.com/photo-1692991812506-9d365d755bdc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    title: "Little moments",
  },
  {
    image:
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=1200&q=90",
    title: "A lifetime together",
  },
  {
    image:
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=90",
    title: "Made for forever",
  },
];

function getCountdown() {
  const difference = new Date(wedding.date).getTime() - Date.now();

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference / 3600000) % 24),
    minutes: Math.floor((difference / 60000) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

function SectionLabel({ children }) {
  return (
    <p className="section-label">
      <span className="label-line" />
      {children}
      <span className="label-line" />
    </p>
  );
}

function App() {
  const [letterOpened, setLetterOpened] = useState(false);
  const [countdown, setCountdown] = useState(getCountdown);
  const [activePhoto, setActivePhoto] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicError, setMusicError] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdown());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!activePhoto) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setActivePhoto(null);
      if (event.key === "ArrowRight") {
        setActivePhoto((current) => {
          if (!current) return current;
          const index = photos.findIndex((photo) => photo.image === current.image);
          return photos[(index + 1) % photos.length];
        });
      }
      if (event.key === "ArrowLeft") {
        setActivePhoto((current) => {
          if (!current) return current;
          const index = photos.findIndex((photo) => photo.image === current.image);
          return photos[(index - 1 + photos.length) % photos.length];
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePhoto]);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (audio.paused) {
        audio.volume = 0.4;
        await audio.play();
      } else {
        audio.pause();
      }
      setMusicError(false);
    } catch (error) {
      setMusicError(true);
      console.warn("Music could not start:", error);
    }
  };

  const openLetter = async () => {
    setLetterOpened(true);
    const audio = audioRef.current;

    if (audio) {
      try {
        audio.volume = 0.4;
        await audio.play();
        setMusicError(false);
      } catch (error) {
        setMusicError(true);
        console.warn("Music could not start:", error);
      }
    }
  };

  const shareInvitation = async () => {
    const shareData = {
      title: `${wedding.bride} & ${wedding.groom} — Wedding Invitation`,
      text: `With love, we invite you to celebrate the wedding of ${wedding.bride} and ${wedding.groom} on ${wedding.displayDate}.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(
          `${shareData.text}\n${shareData.url}`
        );
        window.alert("Invitation link copied!");
      } else {
        window.prompt("Copy your invitation link:", window.location.href);
      }
    } catch (error) {
      if (error?.name !== "AbortError") {
        console.warn("Sharing was not completed:", error);
      }
    }
  };

  return (
    <main className="wedding-site" id="home">
      <audio
        ref={audioRef}
        src="/music/wedding.mp3"
        loop
        preload="auto"
        onPlay={() => {
          setIsPlaying(true);
          setMusicError(false);
        }}
        onPause={() => setIsPlaying(false)}
        onError={() => {
          setIsPlaying(false);
          setMusicError(true);
        }}
      />

      <header className="site-header">
        <a className="brand" href="#home" aria-label="InviteMe home">
          <span className="brand-symbol">i<span>.</span></span>
          <span className="brand-copy">
            <strong>inviteme</strong>
            <small>THE ART OF INVITATION</small>
          </span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? "×" : "☰"}
        </button>

        <nav className={`main-nav ${menuOpen ? "nav-open" : ""}`}>
          <a href="#invitation" onClick={() => setMenuOpen(false)}>Invitation</a>
          <a href="#story" onClick={() => setMenuOpen(false)}>Our story</a>
          <a href="#gallery" onClick={() => setMenuOpen(false)}>Gallery</a>
          <a href="#venue" onClick={() => setMenuOpen(false)}>Venue</a>
          
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-kicker">
            <span className="kicker-star">✳</span>
            A NEW CHAPTER BEGINS
          </div>

          <h1 className="hero-title">
            A little more
            <br />
            <em>love,</em> a lot more
            <br />
            <span>forever.</span>
          </h1>

          <p className="hero-description">
            Two hearts, two families, one beautiful promise.
            We would love for you to be part of our special day.
          </p>

          <div className="hero-couple">
            <span>{wedding.bride}</span>
            <span className="couple-ampersand">&</span>
            <span>{wedding.groom}</span>
          </div>

          <div className="hero-meta">
            <span className="meta-dot" />
            {wedding.displayDate}
            <span className="meta-divider">/</span>
            {wedding.address}
          </div>

          <a className="hero-cta" href="#invitation">
            <span className="cta-icon">↓</span>
            Open our invitation
          </a>

          <p className="hero-note">MADE WITH LOVE, SHARED WITH YOU</p>
        </div>

        <div className="hero-visual">
          <div className="hero-image-main">
            <img
              src="https://images.unsplash.com/photo-1571131639829-a022890def49?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
              alt="Elegant wedding celebration"
              fetchPriority="high"
            />
          </div>

          <div className="hero-image-small">
            <img
              src="https://images.unsplash.com/photo-1519741357542-22a23fd3627b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
              alt="Romantic wedding details"
            />
          </div>

          <div className="hero-photo-tag">
            <span>THE WEDDING OF</span>
            <strong>{wedding.bride} <i>&</i> {wedding.groom}</strong>
          </div>

          <div className="hero-roundel" aria-hidden="true">
            <svg viewBox="0 0 100 100" className="roundel-svg">
              <defs>
                <path id="roundel-circle" d="M 50,50 m -35,0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
              </defs>
              <text>
                <textPath href="#roundel-circle">
                  MADE WITH LOVE • MADE WITH LOVE •
                </textPath>
              </text>
            </svg>
            <span>♡</span>
          </div>
        </div>

        <div className="hero-bottom-line">
          <span>AN INVITATION TO REMEMBER</span>
          <span>01 — 04</span>
        </div>
      </section>

      <section className="intro-strip">
        <span className="intro-symbol">✳</span>
        <p>
          A beautiful day becomes unforgettable when it is shared with the
          people we love.
        </p>
        <span className="intro-symbol">✳</span>
      </section>


<section className="invitation-section section-wrap" id="invitation">
  <div className="section-topline">
    <span>01 / THE INVITATION</span>
    <span>SEALED WITH LOVE</span>
  </div>

  <div className="invitation-heading">
    <div>
      <SectionLabel>A NOTE FROM OUR HEARTS</SectionLabel>
      <h2>
        Something special,
        <br />
        <em>just for you.</em>
      </h2>
    </div>
    <p>
      Some moments deserve more than a message.
      Open this little letter and share in our happiness.
    </p>
  </div>

  <div className={`invitation-stage ${letterOpened ? "is-open" : ""}`}>
    <div className="envelope-shadow" />

    <article
      className="letter-paper"
      aria-label="Wedding invitation letter"
      aria-hidden={!letterOpened}
    >
      <div className="letter-scroll">
        <div className="letter-inner">
          <div className="letter-top-mark">
            A <span>✳</span> A
          </div>

          <p className="letter-overline">
            WITH THE BLESSINGS OF OUR FAMILIES
          </p>

          <span className="letter-rule"><i>✦</i></span>

          <p className="letter-dear">Dear Family & Friends,</p>

          <h3>
            With grateful hearts
            <br />
            <em>and endless joy,</em>
          </h3>

          <p className="letter-copy">
            We warmly invite you to celebrate the wedding of
          </p>

          <div className="letter-couple">
            <span>{wedding.bride}</span>
            <i>&</i>
            <span>{wedding.groom}</span>
          </div>

          <div className="letter-date">
            <span>{wedding.displayDate}</span>
            <span>{wedding.ceremonyTime}</span>
          </div>

          <p className="letter-malayalam">
            സ്നേഹത്തോടെ ക്ഷണിക്കുന്നു
          </p>

          <span className="letter-rule"><i>❦</i></span>

          <p className="letter-signoff">
            With love and happiness,
          </p>

          
        </div>
      </div>
    </article>

    <div className="envelope-shell" aria-hidden="true">
      <div className="envelope-back" />
      <div className="envelope-left" />
      <div className="envelope-right" />
      <div className="envelope-bottom" />
      <div className="envelope-flap" />
    </div>

    {!letterOpened && (
      <button
        type="button"
        className="envelope-seal"
        onClick={openLetter}
        aria-label="Open the wedding invitation"
      >
        <span>A</span>
        <small>♡</small>
      </button>
    )}

    
  </div>

  <div className="invitation-stage-caption">
    <span className="caption-star">✳</span>
    {letterOpened
      ? "Take your time. Every word comes with love."
      : "Tap the seal to open your personal invitation"}
    <span className="caption-star">✳</span>
  </div>

  {musicError && (
    <p className="music-message">
      Music could not play. Check that public/music/wedding.mp3 exists.
    </p>
  )}

  <div className="music-control-row">
    <button
      type="button"
      className="music-toggle"
      onClick={toggleMusic}
    >
      <span className={`music-icon ${isPlaying ? "music-playing" : ""}`}>
        {isPlaying ? "Ⅱ" : "♫"}
      </span>
      {isPlaying ? "Pause the music" : "Play our song"}
    </button>
    
  </div>

  <div className="family-grid">
    <article className="family-card">
      <span className="family-heart">♡</span>
      <p className="card-overline">THE BRIDE</p>
      <h3>{wedding.bride}</h3>
      <p>Daughter of</p>
      <strong>{wedding.brideFather}</strong>
      <strong>{wedding.brideMother}</strong>
        <p className="family-address">{wedding.brideAddress}</p>

    </article>

    <article className="family-card family-card-featured">
      <span className="family-heart">♡</span>
      <p className="card-overline">THE GROOM</p>
      <h3>{wedding.groom}</h3>
      <p>Son of</p>
      <strong>{wedding.groomFather}</strong>
      <strong>{wedding.groomMother}</strong>
        <p className="family-address">{wedding.groomAddress}</p>

    </article>
  </div>
</section>

      <section className="countdown-band">
        <div className="countdown-heading">
          <SectionLabel>THE BIG DAY IS GETTING CLOSER</SectionLabel>
          <h2>Counting down to <em>forever.</em></h2>
          <p>Every second brings us closer to our favourite day.</p>
        </div>

        <div className="countdown-grid">
          {[
            ["Days", countdown.days],
            ["Hours", countdown.hours],
            ["Minutes", countdown.minutes],
            ["Seconds", countdown.seconds],
          ].map(([label, value]) => (
            <div className="countdown-unit" key={label}>
              <span className="countdown-value">
                {String(value).padStart(2, "0")}
              </span>
              <span className="countdown-label">{label}</span>
            </div>
          ))}
        </div>

        <span className="countdown-decoration" aria-hidden="true">✳</span>
      </section>

      <section className="story-section section-wrap" id="story">
        <div className="story-visual">
          <img
            src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1100&q=90"
            alt="A couple celebrating their love"
            loading="lazy"
          />
          <div className="story-photo-stamp">
            <span>OUR</span>
            <strong>Story</strong>
            <span>IN LOVE</span>
          </div>
          <span className="story-photo-note">A moment, a memory, a lifetime.</span>
        </div>

        <div className="story-copy">
          <div className="section-topline">
            <span>02 / OUR STORY</span>
            <span>ALWAYS & FOREVER</span>
          </div>
          <SectionLabel>A LITTLE ABOUT US</SectionLabel>
          <h2>
            One story.
            <br />
            <em>Two hearts.</em>
            <br />
            A thousand tomorrows.
          </h2>
          <p>
            Some stories feel like home from the very beginning. Ours is
            about little moments, shared smiles, family, and the beautiful
            promise of walking through life together.
          </p>
          <p>
            As we begin this new chapter, we would be honoured to have our
            favourite people by our side.
          </p>
          <div className="story-signature">
            <span>With love,</span>
            <strong>{wedding.bride} <i>&</i> {wedding.groom}</strong>
          </div>
        </div>
      </section>

      <section className="details-section" id="details">
        <div className="details-inner section-wrap">
          <div className="details-heading">
            <SectionLabel>PUT IT IN YOUR CALENDAR</SectionLabel>
            <h2>The details of <em>our day.</em></h2>
            <p>All the little details to help you celebrate with us.</p>
          </div>

          <div className="details-layout">
            <div className="details-image">
              <img
                src="https://images.unsplash.com/photo-1660643916995-62df84079ef7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"
                alt="Beautiful wedding reception setting"
                loading="lazy"
              />
              <div className="details-image-overlay">
                <span>PLEASE SAVE THE DATE</span>
                <strong>{wedding.displayDate}</strong>
                <span>WE CAN'T WAIT TO SEE YOU</span>
              </div>
            </div>

            <div className="event-details-card">
              <div className="event-detail">
                <span className="event-detail-icon">✳</span>
                <div>
                  <span className="event-detail-label">THE DATE</span>
                  <h3>{wedding.displayDate}</h3>
                  <p>Sunday celebration of love</p>
                </div>
              </div>

              <div className="event-detail">
                <span className="event-detail-icon">◷</span>
                <div>
                  <span className="event-detail-label">NIKKAH</span>
                  <h3>{wedding.ceremonyTime}</h3>
                  <p>Please arrive a little early.</p>
                </div>
              </div>

              <div className="event-detail">
                <span className="event-detail-icon">⌖</span>
                <div>
                  <span className="event-detail-label">THE PLACE</span>
                  <h3>{wedding.venue}</h3>
                  <p>{wedding.address}</p>
                  <a
                    className="inline-link"
                    href={wedding.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Get directions <span>↗</span>
                  </a>
                </div>
              </div>

              <div className="event-detail">
                <span className="event-detail-icon">♡</span>
                <div>
                  <span className="event-detail-label">THE DRESS CODE</span>
                  <h3>Festive & traditional</h3>
                  <p>Wear something that makes you feel wonderful.</p>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </section>

      <section className="malayalam-banner">
        <span className="banner-star">✳</span>
        <p>സ്നേഹത്തോടെ ക്ഷണിക്കുന്നു</p>
        <span className="banner-translation">
          Inviting you with love, blessings, and a heart full of happiness.
        </span>
        <span className="banner-star">✳</span>
      </section>

      <section className="gallery-section section-wrap" id="gallery">
        <div className="gallery-heading">
          <div>
            <SectionLabel>03 / THE GALLERY</SectionLabel>
            <h2>Love, in little <em>frames.</em></h2>
          </div>
          <p>
            A few beautiful moments that remind us why forever is worth
            celebrating.
          </p>
        </div>

        <div className="gallery-grid">
          {photos.map((photo, index) => (
            <button
              type="button"
              className={`gallery-card gallery-card-${index + 1}`}
              key={photo.image}
              onClick={() => setActivePhoto(photo)}
              aria-label={`View photo: ${photo.title}`}
            >
              <img src={photo.image} alt={photo.title} loading="lazy" />
              <span className="gallery-card-caption">
                <span>{photo.title}</span>
                <span className="gallery-arrow">↗</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="venue-section" id="venue">
        <div className="venue-inner section-wrap">
          <div className="venue-copy">
            <SectionLabel>04 / COME FIND US</SectionLabel>
            <h2>
              Your place is
              <br />
              <em>with us.</em>
            </h2>
            <p>
              The best part of a special day is sharing it with special people.
              We hope you can join us.
            </p>

            <div className="venue-address">
              <span className="venue-pin">⌖</span>
              <div>
                <span className="event-detail-label">THE WEDDING VENUE</span>
                <strong>{wedding.venue}</strong>
                <span>{wedding.address}</span>
              </div>
            </div>

            <a
              className="primary-button"
              href={wedding.mapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open Google Maps <span>↗</span>
            </a>
          </div>

          <div className="venue-qr-wrap">
            <div className="venue-qr-card">
              <div className="qr-topline">
                <span>INVITATION NO. 001</span>
                <span>♡</span>
              </div>
              <div className="qr-code">
                <QRCodeSVG
                  value={wedding.mapsUrl}
                  size={180}
                  level="H"
                  includeMargin
                  bgColor="#fffaf4"
                  fgColor="#4b1f2b"
                  title="Scan to open the wedding venue in Google Maps"
                />
              </div>
              <h3>Find your way to us.</h3>
              <p>Scan with your phone camera for directions.</p>
              <div className="qr-bottomline">
                <span>{wedding.bride} & {wedding.groom}</span>
                <span>14.02.2027</span>
              </div>
            </div>
            <span className="qr-floating-star">✳</span>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#home">
          <span className="brand-symbol">i<span>.</span></span>
          <span className="brand-copy">
            <strong>inviteme</strong>
            <small>THE ART OF INVITATION</small>
          </span>
        </a>

        <p>Made with love for a day to remember.</p>

        <a className="footer-top" href="#home">
          Back to top ↑
        </a>

        <span className="footer-bottom">
          {wedding.bride} & {wedding.groom} · {wedding.displayDate}
        </span>
      </footer>

      {activePhoto && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
          onClick={() => setActivePhoto(null)}
        >
          <button
            type="button"
            className="lightbox-close"
            aria-label="Close image"
            onClick={() => setActivePhoto(null)}
          >
            ×
          </button>

          <button
            type="button"
            className="lightbox-arrow lightbox-prev"
            aria-label="Previous photo"
            onClick={(event) => {
              event.stopPropagation();
              const index = photos.findIndex((photo) => photo.image === activePhoto.image);
              setActivePhoto(photos[(index - 1 + photos.length) % photos.length]);
            }}
          >
            ←
          </button>

          <img
            src={activePhoto.image}
            alt={activePhoto.title}
            onClick={(event) => event.stopPropagation()}
          />

          <button
            type="button"
            className="lightbox-arrow lightbox-next"
            aria-label="Next photo"
            onClick={(event) => {
              event.stopPropagation();
              const index = photos.findIndex((photo) => photo.image === activePhoto.image);
              setActivePhoto(photos[(index + 1) % photos.length]);
            }}
          >
            →
          </button>

          <p>{activePhoto.title}</p>
        </div>
      )}
    </main>
  );
}

export default App;
