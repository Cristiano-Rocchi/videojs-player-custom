import React, { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./PlayerVideoKunstom-youtube.css";
import "videojs-youtube";

const PlayerVideoKunstomYoutube = ({
  videoList = [],
  onVideoChange,
  autoplay = false,
  loop = false,
  muted = false,
  volume = 1,
  aspectRatio = "16:9",
  doubleClickFullscreen = false,
  controls = true,

  size = null,
  width = null,
  color = "white",

  quality = true,
  tooltips = true,
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const previewRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const currentVideoIndexRef = useRef(0);

  let timerTimeout; // Variabile globale per memorizzare il timeout attivo

  /*props*/

  const sizeClass = width ? "" : size ? `size-${size}` : "size-100";

  const [showQuality, setShowQuality] = useState(quality);
  const [showTooltips, setShowTooltips] = useState(tooltips);

  //color
  useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", color);

    // Cambia il colore degli SVG
    const svgs = document.querySelectorAll(
      ".vjs-grouped-controls-center svg, .vjs-grouped-controls-end svg"
    );
    svgs.forEach((svg) => {
      svg.setAttribute("fill", color);
    });
  }, [color]);

  //quality
  useEffect(() => {
    setShowQuality(quality);
    updateQualityVisibility(quality);
  }, [quality]);

  //tooltips
  useEffect(() => {
    if (!showTooltips) {
      const style = document.createElement("style");
      style.innerHTML = `
        .vjs-play-control[title]::after,
        .vjs-mute-control[title]::after,
        .vjs-fullscreen-control[title]::after,
         {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, [showTooltips]);

  useEffect(() => {
    console.log("CurrentVideoIndex aggiornato:", currentVideoIndex);
    setSelectedVideoIndex(currentVideoIndex);
  }, [currentVideoIndex]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (
      isMounted &&
      videoRef.current &&
      !playerRef.current &&
      videoList.length > 0
    ) {
      //wrapper div per le icons in controlBar
      const Component = videojs.getComponent("Component");

      class GroupedControlsStart extends Component {
        constructor(player, options) {
          super(player, options);
          this.addClass("vjs-grouped-controls-start");
        }

        createEl() {
          const el = videojs.dom.createEl("div", {
            className: "vjs-grouped-controls-start",
          });

          // Pulsante Next
          const nextButton = videojs.dom.createEl("button", {
            className: "vjs-next-button",
            innerHTML: `
              <svg fill="${color}" width="32px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M208,40V216a8,8,0,0,1-16,0V142.26416l-119.65625,73.124A16.00029,16.00029,0,0,1,48,201.73535V54.26465A16.0002,16.0002,0,0,1,72.34277,40.61133L192,113.73535V40a8,8,0,0,1,16,0Z"></path> </g></svg>
            `,
          });

          nextButton.addEventListener("click", () => {
            if (window.changeVideo) {
              window.changeVideo(1);
            }
          });

          setTimeout(() => {
            const settingsMenu = document.querySelector(".settings-menu");
            if (settingsMenu) {
              nextButton.addEventListener("click", () => {
                if (window.changeVideo) {
                  window.changeVideo(1);
                  settingsMenu.style.display = "none";
                }
              });
            } else {
              console.error("Elemento .settings-menu non trovato nel DOM.");
            }
          }, 1000);

          el.appendChild(nextButton);

          return el;
        }
      }

      videojs.registerComponent("GroupedControlsStart", GroupedControlsStart);

      class GroupedControlsEnd extends Component {
        constructor(player, options) {
          super(player, options);
          this.addClass("vjs-grouped-controls-end");
          this.autoNextEnabled = false; // Stato iniziale spento
          this.qualityMenuVisible = false;
          this.showQualityButton = options.quality;
        }

        createEl() {
          const el = videojs.dom.createEl("div", {
            className: "vjs-grouped-controls-end",
          });

          //AUTOPLAY TOGGLE
          // Creazione del toggle switch per "auto next"
          const label = videojs.dom.createEl("label", {
            className: "switch",
          });

          const checkbox = videojs.dom.createEl("input", {
            type: "checkbox",
            className: "autoplay-toggle",
          });

          const slider = videojs.dom.createEl("span", {
            className: "slider",
          });

          // Definiamo l'icona Play in una costante
          const playSVG = `<svg  class="svg-icon" style="width: 1em; height: 1em; vertical-align: middle; fill: currentColor; overflow: hidden;" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
            <path d="M852.727563 392.447107C956.997809 458.473635 956.941389 565.559517 852.727563 631.55032L281.888889 993.019655C177.618644 1059.046186 93.090909 1016.054114 93.090909 897.137364L93.090909 126.860063C93.090909 7.879206 177.675064-35.013033 281.888889 30.977769L852.727563 392.447107 852.727563 392.447107Z"></path>
          </svg>`;

          // Creazione dello span per l'icona (inizialmente vuoto)
          const icon = videojs.dom.createEl("span", {
            className: "slider-icon",
          });

          slider.appendChild(icon); // Aggiunge l'icona nel pallino

          // Evento per attivare/disattivare "auto next" e cambiare icona
          checkbox.addEventListener("change", () => {
            this.autoNextEnabled = checkbox.checked;
            icon.innerHTML = this.autoNextEnabled ? playSVG : ""; // Mostra Play se attivo, altrimenti vuoto
          });

          label.appendChild(checkbox);
          label.appendChild(slider);
          el.appendChild(label);

          // Evento per il cambio video quando finisce
          this.player_.on("ended", () => {
            if (this.autoNextEnabled && window.changeVideo) {
              window.changeVideo(1); // Passa al video successivo
            }
          });

          const cinemaMode = videojs.dom.createEl("div", {
            className: "vjs-cinema-btn",
            innerHTML: `<svg fill="${color}"  height="100%" version="1.1" viewBox="0 0 36 36"><use class="ytp-svg-shadow" xlink:href="#ytp-id-53"></use><path d="m 28,11 0,14 -20,0 0,-14 z m -18,2 16,0 0,10 -16,0 0,-10 z"  fill-rule="evenodd" id="ytp-id-53"></path></svg>

`,
          });
          cinemaMode.addEventListener("click", function () {
            const videoContainer = document.querySelector(".video-player");

            if (videoContainer.classList.contains("cinema-mode")) {
              videoContainer.classList.remove("cinema-mode");
            } else {
              videoContainer.classList.add("cinema-mode");
            }
          });

          const miniVideoMode = videojs.dom.createEl("div", {
            className: "mini-video-btn",
            innerHTML: `<svg fill="${color}" height="100%" version="1.1" viewBox="0 0 36 36" ><use class="ytp-svg-shadow" xlink:href="#ytp-id-43"></use><path d="M25,17 L17,17 L17,23 L25,23 L25,17 L25,17 Z M29,25 L29,10.98 C29,9.88 28.1,9 27,9 L9,9 C7.9,9 7,9.88 7,10.98 L7,25 C7,26.1 7.9,27 9,27 L27,27 C28.1,27 29,26.1 29,25 L29,25 Z M27,25.02 L9,25.02 L9,10.97 L27,10.97 L27,25.02 L27,25.02 Z"  id="ytp-id-43"></path></svg>`,
          });

          const newIcon = videojs.dom.createEl("div", {
            className: "mini-video-icon",
            innerHTML: `<svg fill="${color}" height="24px" version="1.1" viewBox="0 0 24 24" width="24px"><g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1"><g transform="translate(12.000000, 12.000000) scale(-1, 1) translate(-12.000000, -12.000000) "><path d="M19,19 L5,19 L5,5 L12,5 L12,3 L5,3 C3.89,3 3,3.9 3,5 L3,19 C3,20.1 3.89,21 5,21 L19,21 C20.1,21 21,20.1 21,19 L21,12 L19,12 L19,19 Z M14,3 L14,5 L17.59,5 L7.76,14.83 L9.17,16.24 L19,6.41 L19,10 L21,10 L21,3 L14,3 Z"  fill-rule="nonzero"></path></g></g></svg>`,
          });

          const videoContainer = document.querySelector(".video-player");

          miniVideoMode.addEventListener("click", () => {
            const abc = document.querySelector(".vjs-grouped-controls-start");
            abc.appendChild(newIcon);

            videoContainer.classList.toggle("mini-video-mode");
            newIcon.addEventListener("click", () => {
              videoContainer.classList.remove("mini-video-mode");
            });
          });

          // Rimuove eventuali bottoni esistenti per evitare duplicati
          document
            .querySelectorAll(".vjs-settings-button")
            .forEach((btn) => btn.remove());

          // Crea il bottone impostazioni
          const settingsButton = document.createElement("button");
          settingsButton.className = "vjs-settings-button";
          settingsButton.innerHTML = `
    <svg fill="${color}" height="100%" style="pointer-events: none;" version="1.1" viewBox="0 0 36 36">
        <use class="svg-settings" xlink:href="#ytp-id-42"></use>
        <path d="m 23.94,18.78 c .03,-0.25 .05,-0.51 .05,-0.78 0,-0.27 -0.02,-0.52 -0.05,-0.78 
            l 1.68,-1.32 c .15,-0.12 .19,-0.33 .09,-0.51 l -1.6,-2.76 c -0.09,-0.17 -0.31,-0.24 
            -0.48,-0.17 l -1.99,.8 c -0.41,-0.32 -0.86,-0.58 -1.35,-0.78 l -0.30,-2.12 
            c -0.02,-0.19 -0.19,-0.33 -0.39,-0.33 l -3.2,0 c -0.2,0 -0.36,.14 -0.39,.33 
            l -0.30,2.12 c -0.48,.2 -0.93,.47 -1.35,.78 l -1.99,-0.8 c -0.18,-0.07 -0.39,0 
            -0.48,.17 l -1.6,2.76 c -0.10,.17 -0.05,.39 .09,.51 l 1.68,1.32 c -0.03,.25 
            -0.05,.52 -0.05,.78 0,.26 .02,.52 .05,.78 l -1.68,1.32 c -0.15,.12 -0.19,.33 
            -0.09,.51 l 1.6,2.76 c .09,.17 .31,.24 .48,.17 l 1.99,-0.8 c .41,.32 .86,.58 
            1.35,.78 l .30,2.12 c .02,.19 .19,.33 .39,.33 l 3.2,0 c .2,0 .36,-0.14 .39,-0.33 
            l .30,-2.12 c .48,-0.2 .93,-0.47 1.35,-0.78 l 1.99,.8 c .18,.07 .39,0 .48,-0.17 
            l 1.6,-2.76 c .09,-0.17 .05,-0.39 -0.09,-0.51 l -1.68,-1.32 0,0 z 
            m -5.94,2.01 c -1.54,0 -2.8,-1.25 -2.8,-2.8 0,-1.54 1.25,-2.8 2.8,-2.8 
            1.54,0 2.8,1.25 2.8,2.8 0,1.54 -1.25,2.8 -2.8,2.8 l 0,0 z" id="ytp-id-42">
        </path>
    </svg>`;

          // Trova il player e aggiunge il bottone dentro di esso (non nel body)
          const player = document.querySelector(".video-js"); // Assumendo che il player abbia questa classe
          if (player) {
            player.appendChild(settingsButton);
          }

          // Aggiunge l'evento di click per mostrare il menu delle impostazioni
          settingsButton.addEventListener("click", showSettingsMenu);

          document.body.appendChild(settingsButton);

          const subtitlesButton = videojs.dom.createEl("div", {
            className: ".vjs-subtitles-btn",
            innerHTML: `<svg fill="${color}" class="ytp-subtitles-button-icon" height="100%" version="1.1" viewBox="0 0 36 36" fill-opacity="1"><use class="ytp-svg-shadow" xlink:href="#ytp-id-40"></use><path d="M11,11 C9.9,11 9,11.9 9,13 L9,23 C9,24.1 9.9,25 11,25 L25,25 C26.1,25 27,24.1 27,23 L27,13 C27,11.9 26.1,11 25,11 L11,11 Z M11,17 L14,17 L14,19 L11,19 L11,17 L11,17 Z M20,23 L11,23 L11,21 L20,21 L20,23 L20,23 Z M25,23 L22,23 L22,21 L25,21 L25,23 L25,23 Z M25,19 L16,19 L16,17 L25,17 L25,19 L25,19 Z" id="ytp-id-40"></path></svg>`,
          });

          el.appendChild(subtitlesButton);
          el.appendChild(settingsButton);
          el.appendChild(miniVideoMode);
          el.appendChild(cinemaMode);

          return el;
        }
      }

      videojs.registerComponent("GroupedControlsEnd", GroupedControlsEnd);

      // Crea una nuova istanza del player Video.js
      playerRef.current = videojs(videoRef.current, {
        controls: controls,
        autoplay: autoplay,
        loop: loop,
        muted: muted,
        volume: volume,
        preload: "auto",
        fluid: true,
        responsive: true,
        aspectRatio: aspectRatio,
        doubleClickFullscreen: doubleClickFullscreen,
        color: color,

        controlBar: {
          children: [
            {
              name: "GroupedControlsStart",
              children: [
                "progressControl",
                "playToggle",

                "volumePanel",
                "currentTimeDisplay",
                "timeDivider",
                "durationDisplay",
              ],
            },
            {
              name: "GroupedControlsEnd",
              children: ["fullscreenToggle"],
            },
          ],
        },
        sources:
          videoList.length > 0
            ? [
                {
                  src: videoList[currentVideoIndex]?.src || "",
                  type: videoList[currentVideoIndex]?.type || "video/mp4",
                },
              ]
            : [
                {
                  src: fallbackVideo.src,
                  type: fallbackVideo.type,
                },
              ],
      });

      // Funzionalità per l'anteprima durante la navigazione sulla barra di progresso
      const progressBar = document.querySelector(".vjs-progress-control");

      progressBar.addEventListener("mousemove", (event) => {
        if (previewRef.current && playerRef.current) {
          const rect = progressBar.getBoundingClientRect();
          const percentage = (event.clientX - rect.left) / rect.width;
          const duration = playerRef.current.duration();

          if (!isNaN(duration) && isFinite(duration)) {
            const videoTime = percentage * duration;

            // Controlla se è un video di YouTube
            const isYouTube =
              playerRef.current.currentType() === "video/youtube";

            if (!isYouTube) {
              previewRef.current.currentTime = videoTime;
            }
          }
        }
      });

      progressBar.addEventListener("mouseleave", () => {
        if (previewRef.current) {
          previewRef.current.style.display = "none";
        }
      });

      progressBar.addEventListener("mouseenter", () => {
        if (previewRef.current) {
          previewRef.current.style.display = "block";
        }
      });

      // ** Aggiungi il mini player per l'anteprima (solo per video normali) **
      playerRef.current.on("loadedmetadata", () => {
        const tooltipDiv = document.querySelector(".vjs-mouse-display");
        const isYouTube = playerRef.current.currentType() === "video/youtube";

        // Se il video è YouTube, rimuove il miniplayer
        if (isYouTube) {
          if (previewRef.current) {
            previewRef.current.remove();
            previewRef.current = null;
          }
          return;
        }

        // Se non è YouTube, crea il miniplayer
        if (tooltipDiv && !previewRef.current) {
          const previewVideo = document.createElement("video");
          previewVideo.src = playerRef.current.currentSrc();
          previewVideo.muted = true;
          previewVideo.className = "progress-preview-video";
          tooltipDiv.appendChild(previewVideo);
          previewRef.current = previewVideo;
        }
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [isMounted]);

  const changeVideo = (direction) => {
    if (videoList.length === 0) return;

    setCurrentVideoIndex((prevIndex) => {
      let newIndex = prevIndex + direction;

      if (newIndex < 0) newIndex = videoList.length - 1;
      if (newIndex >= videoList.length) newIndex = 0;

      console.log("Nuovo CurrentVideoIndex:", newIndex);

      // Aggiorniamo anche il ref, che mantiene sempre il valore aggiornato
      currentVideoIndexRef.current = newIndex;

      // Pausa il video corrente e aggiorna la sorgente
      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.src({
          type: videoList[newIndex]?.type || "video/mp4",
          src: videoList[newIndex]?.src || "",
        });
        playerRef.current.load();
        playerRef.current.play();
      }

      // Aggiorna il mini player con il nuovo video
      if (previewRef.current) {
        previewRef.current.src = videoList[newIndex]?.src || "";
        previewRef.current.load();
      }

      // Chiude il menu qualità quando cambia video
      if (document.querySelector(".quality-menu")) {
        document.querySelector(".quality-menu").style.display = "none";
      }

      return newIndex; // Restituisce il valore aggiornato
    });
  };

  const showQualities = () => {
    const latestVideoIndex = currentVideoIndexRef.current;

    if (
      !videoList.length ||
      latestVideoIndex === undefined ||
      latestVideoIndex < 0
    ) {
      alert("Errore: Nessun video selezionato.");
      return;
    }

    const currentVideo = videoList[latestVideoIndex];

    if (
      !currentVideo ||
      !currentVideo.qualities ||
      currentVideo.qualities.length === 0
    ) {
      alert("Questo video non ha qualità da scegliere.");
      return;
    }

    // Rimuove eventuali menu di qualità già aperti
    document.querySelector(".quality-menu")?.remove();

    // Creazione del menu qualità
    const qualityMenu = document.createElement("div");
    qualityMenu.className = "quality-menu sub-menu";

    // ✅ Aggiunge l'icona in alto

    // Aggiunge le opzioni di qualità
    currentVideo.qualities.forEach((quality) => {
      const qualityOption = document.createElement("button");
      qualityOption.className = "quality-option";
      qualityOption.innerText = quality.label;

      qualityOption.addEventListener("click", () => {
        changeQlty(quality.label);
        qualityMenu.remove();
      });

      qualityMenu.appendChild(qualityOption);
    });

    // Posizionamento
    const qualityButton = document.querySelector(".vjs-quality-button");
    if (qualityButton) {
      const buttonRect = qualityButton.getBoundingClientRect();
      Object.assign(qualityMenu.style, {
        left: `${buttonRect.left + buttonRect.width / 2}px`,
        top: `${buttonRect.top + window.scrollY - 105}px`,
        transform: "translateX(-50%)",
        position: "absolute",
      });
    }

    document.body.appendChild(qualityMenu);

    // Chiude il menu al click esterno
    const closeMenu = (event) => {
      if (!qualityMenu.contains(event.target)) {
        qualityMenu.remove();
        document.removeEventListener("click", closeMenu);
      }
    };

    setTimeout(() => {
      document.addEventListener("click", closeMenu);
    }, 100);
  };

  const changeQlty = (quality) => {
    // Usiamo il ref per prendere sempre l'indice aggiornato
    const latestVideoIndex = currentVideoIndexRef.current;

    if (
      videoList.length === 0 ||
      latestVideoIndex === undefined ||
      !videoList[latestVideoIndex]
    )
      return;

    const currentVideo = videoList[latestVideoIndex];

    if (!currentVideo.qualities || currentVideo.qualities.length === 0) return;

    const selectedQuality = currentVideo.qualities.find(
      (q) => q.label === quality
    );

    if (!selectedQuality) return;

    console.log(`Cambiando qualità a: ${quality}`);

    if (playerRef.current) {
      playerRef.current.pause();
      playerRef.current.src({
        type: selectedQuality.type || "video/mp4",
        src: selectedQuality.src || "",
      });
      playerRef.current.load();
      playerRef.current.play();
    }
  };

  const updateQualityVisibility = (isVisible) => {
    if (playerRef.current) {
      const settingQltyButton = document.querySelector(".vjs-setting-button");
      if (settingQltyButton) {
        settingQltyButton.style.display = isVisible ? "block" : "none";
      }
    }
  };

  const changeVelocity = (speed) => {
    const video = document.querySelector("video"); // Trova il video nella pagina
    if (video) {
      video.playbackRate = speed; // Cambia la velocità di riproduzione
    }
  };

  const closeAllSubMenus = () => {
    document.querySelectorAll(".sub-menu").forEach((menu) => menu.remove());
  };
  const showSettingsMenu = (event) => {
    event.stopPropagation();

    let settingsMenu = document.querySelector(".settings-menu");

    if (settingsMenu) {
      settingsMenu.remove(); // Rimuovi completamente invece di nascondere
      return;
    }

    // 1. Ottieni il container del player Video.js
    const player = playerRef.current;
    const playerContainer = player.el();

    // 2. Crea il menu
    settingsMenu = document.createElement("div");
    settingsMenu.className = "settings-menu";
    const menuContent = document.createElement("div");
    menuContent.className = "menu-content";

    // 3. Aggiungi il menu AL CONTAINER DEL PLAYER
    playerContainer.appendChild(settingsMenu);

    ["Velocità", "Qualità", "Timer"].forEach((text) => {
      const option = document.createElement("div");
      option.className = "settings-option";
      option.innerText = text;

      if (text === "Qualità") {
        option.classList.add("vjs-quality-button");

        option.innerHTML = `
         <svg fill="${color}" height="24" viewBox="0 0 24 24" width="24"><path d="M15,17h6v1h-6V17z M11,17H3v1h8v2h1v-2v-1v-2h-1V17z M14,8h1V6V5V3h-1v2H3v1h11V8z            M18,5v1h3V5H18z M6,14h1v-2v-1V9H6v2H3v1 h3V14z M10,12h11v-1H10V12z"></path></svg>  Qualità
        `;

        option.addEventListener("click", (e) => {
          e.stopPropagation();
          closeAllSubMenus();

          showQualities(option);
        });
      }

      if (text === "Velocità") {
        option.classList.add("vjs-speed-button");

        option.innerHTML = `
          <svg fill="${color}" height="24" viewBox="0 0 24 24" width="24">
            <path d="M10,8v8l6-4L10,8L10,8z M6.3,5L5.7,4.2C7.2,3,9,2.2,11,2l0.1,1C9.3,3.2,7.7,3.9,6.3,5z  
                     M5,6.3L4.2,5.7C3,7.2,2.2,9,2,11 l1,.1C3.2,9.3,3.9,7.7,5,6.3z  
                     M5,17.7c-1.1-1.4-1.8-3.1-2-4.8L2,13c0.2,2,1,3.8,2.2,5.4L5,17.7z  
                     M11.1,21c-1.8-0.2-3.4-0.9-4.8-2 l-0.6,.8C7.2,21,9,21.8,11,22L11.1,21z  
                     M22,12c0-5.2-3.9-9.4-9-10l-0.1,1c4.6,.5,8.1,4.3,8.1,9s-3.5,8.5-8.1,9l0.1,1C18.2,21.5,22,17.2,22,12z" 
              ></path>
          </svg>Velocità
        `;

        option.addEventListener("click", (e) => {
          e.stopPropagation();
          closeAllSubMenus();

          const menuContent = settingsMenu.querySelector(".menu-content");
          menuContent.style.background = "none";

          // Aggiungi menuContent al settingsMenu
          settingsMenu.appendChild(menuContent);

          // Poi procedi con il posizionamento
          const buttonRect = event.target.getBoundingClientRect();
          const containerRect = playerContainer.getBoundingClientRect();

          Object.assign(settingsMenu.style, {
            left: `${
              buttonRect.left - containerRect.left + buttonRect.width / 2
            }px`,
            top: `${buttonRect.top - containerRect.top - 100}px`,
            transform: "translateX(-50%)",
            position: "absolute",
            zIndex: "99999",
            display: "flex",
          });

          // Nascondi tutte le SVG dentro le opzioni principali
          const allSvgs = menuContent.querySelectorAll(".settings-option svg");
          allSvgs.forEach((svg) => {
            svg.style.display = "none";
          });

          // Seleziona TUTTE le opzioni del menu
          const allOptions = menuContent.querySelectorAll(".settings-option");

          // Applica lo stile a tutte le opzioni
          allOptions.forEach((opt) => {
            opt.style.color = "transparent";

            opt.style.cursor = "default"; // Rimuove la "manina"
          });

          showSpeedMenu(option);
        });
      }

      if (text === "Timer") {
        option.classList.add("vjs-timer-button");

        option.innerHTML = `
        <svg fill="${color}" height="24" viewBox="0 0 24 24" width="24"><path d="M16.67,4.31C19.3,5.92,21,8.83,21,12c0,4.96-4.04,9-9,9c-2.61,0-5.04-1.12-6.72-3.02C5.52,17.99,5.76,18,6,18 c6.07,0,11-4.93,11-11C17,6.08,16.89,5.18,16.67,4.31 M14.89,2.43C15.59,3.8,16,5.35,16,7c0,5.52-4.48,10-10,10 c-1,0-1.97-0.15-2.89-0.43C4.77,19.79,8.13,22,12,22c5.52,0,10-4.48,10-10C22,7.48,19,3.67,14.89,2.43L14.89,2.43z M12,6H6v1h4.5 L6,10.99v0.05V12h6v-1H7.5L12,7.01V6.98V6L12,6z"></path></svg>  Timer di sospensione
      `;

        //chiusura stili menu settings
        option.addEventListener("click", (e) => {
          e.stopPropagation();
          closeAllSubMenus();

          // Seleziona TUTTE le opzioni del menu
          const allOptions = menuContent.querySelectorAll(".settings-option");

          // Applica lo stile a tutte le opzioni
          allOptions.forEach((opt) => {
            opt.style.color = "transparent";

            opt.style.cursor = "default"; // Rimuove la "manina"
          });

          showTimerMenu(option);
        });

        option.addEventListener("click", (e) => {
          e.stopPropagation();
          closeAllSubMenus();

          const menuContent = settingsMenu.querySelector(".menu-content");
          menuContent.style.background = "none";

          // Nascondi tutte le SVG dentro le opzioni principali
          const allSvgs = menuContent.querySelectorAll(".settings-option svg");
          allSvgs.forEach((svg) => {
            svg.style.display = "none";
          });

          showTimerMenu(option);
        });
      }

      menuContent.appendChild(option);
    });

    settingsMenu.appendChild(menuContent);
    // 4. Posizionamento CORRETTO rispetto al container del player
    const buttonRect = event.target.getBoundingClientRect();
    const containerRect = playerContainer.getBoundingClientRect();

    Object.assign(settingsMenu.style, {
      left: `${buttonRect.left - containerRect.left + buttonRect.width / 2}px`, // allineamento orizzontale
      top: `${buttonRect.top - containerRect.top - 130}px`, // allineamento verticale
      transform: "translateX(-50%)",
      position: "absolute",
      zIndex: "99999",
      display: "flex",
    });

    // 5. Gestione speciale per la modalità fullscreen
    if (player.isFullscreen()) {
      const fullscreenWrapper = document.querySelector(".vjs-fullscreen");
      if (fullscreenWrapper) {
        // Ricalcola le coordinate per il contesto fullscreen
        const fsRect = fullscreenWrapper.getBoundingClientRect();
        settingsMenu.style.left = `${
          buttonRect.left - fsRect.left + buttonRect.width / 2
        }px`;
        settingsMenu.style.top = `${buttonRect.top - fsRect.top - 130}px`;
        settingsMenu.style.position = "fixed";
      }
    }

    // 6. Modifica il gestore dei click esterni
    const clickHandler = (e) => {
      if (!settingsMenu.contains(e.target)) {
        settingsMenu.remove();
        document.removeEventListener("click", clickHandler);
      }
    };

    // Timeout per evitare la chiusura immediata
    setTimeout(() => {
      document.addEventListener("click", clickHandler);
    }, 10);
  };
  const showTimerMenu = (parentOption) => {
    document.querySelector(".timer-menu")?.remove();

    const timerMenu = document.createElement("div");
    timerMenu.className = "timer-menu sub-menu";
    timerMenu.style.position = "absolute";
    timerMenu.style.left = "100%";
    timerMenu.style.top = "0";
    timerMenu.style.background = "rgba(0, 0, 0, 0.8)";
    timerMenu.style.padding = "10px";
    timerMenu.style.borderRadius = "5px";
    timerMenu.style.zIndex = "1000";

    //Aggiunge l'icona in alto
    const iconContainer = document.createElement("div");
    iconContainer.className = "icon-backward";

    iconContainer.innerHTML = `
        <svg fill="${color}" width="14px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 309.14 309.14" xml:space="preserve"  stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style="fill:#ffffff;" d="M112.855,154.571L240.481,26.946c2.929-2.929,2.929-7.678,0-10.606L226.339,2.197 C224.933,0.79,223.025,0,221.036,0c-1.989,0-3.897,0.79-5.303,2.197L68.661,149.268c-2.929,2.929-2.929,7.678,0,10.606 l147.071,147.071c1.406,1.407,3.314,2.197,5.303,2.197c1.989,0,3.897-0.79,5.303-2.197l14.142-14.143 c2.929-2.929,2.929-7.678,0-10.606L112.855,154.571z"></path> </g></svg>
    Timer di sospensione`;
    iconContainer.style.textAlign = "center";
    iconContainer.style.marginBottom = "10px";

    //ripristina il settings.menu
    iconContainer.addEventListener("click", (e) => {
      e.stopPropagation();

      const settingsMenu = document.querySelector(".settings-menu");
      if (settingsMenu) {
        const menuContent = settingsMenu.querySelector(".menu-content");

        // Ripristina colore opzioni
        const allOptions = menuContent.querySelectorAll(".settings-option");
        allOptions.forEach((opt) => {
          opt.style.color = "white"; // Colore originale
        });

        // Ripristina SVG
        const allSvgs = menuContent.querySelectorAll("svg");
        allSvgs.forEach((svg) => {
          svg.style.display = ""; // Reset display
        });

        // Ripristina background
        menuContent.style.background = "";
      }
      timerMenu.remove(); // Chiude direttamente il timer-menu
    });

    timerMenu.appendChild(iconContainer);

    const times = [
      { label: "5 minuti", value: 5 },
      { label: "15 minuti", value: 15 },
      { label: "30 minuti", value: 30 },
      { label: "60 minuti", value: 60 },
      { label: "90 minuti", value: 90 },
      { label: "120 minuti", value: 120 },
    ];

    times.forEach((time) => {
      const timeOption = document.createElement("div");
      timeOption.className = "timer-option";
      timeOption.innerText = time.label;

      timeOption.addEventListener("click", (e) => {
        e.stopPropagation();
        setVideoTimer(time.value);
        timerMenu.remove();
        document.querySelector(".settings-menu")?.remove();
      });

      timerMenu.appendChild(timeOption);
    });

    parentOption.appendChild(timerMenu);
  };

  const showSpeedMenu = (parentOption) => {
    document.querySelector(".speed-menu")?.remove();

    const speedMenu = document.createElement("div");
    speedMenu.className = "speed-menu sub-menu";
    speedMenu.style.position = "absolute";
    speedMenu.style.left = "100%";
    speedMenu.style.top = "0";
    speedMenu.style.background = "rgba(0, 0, 0, 0.8)";
    speedMenu.style.padding = "10px";
    speedMenu.style.borderRadius = "5px";
    speedMenu.style.zIndex = "1000";

    // ✅ Aggiunge l'icona in alto
    const iconContainer = document.createElement("div");

    iconContainer.className = "icon-backward";

    iconContainer.innerHTML = `
        <svg fill="${color}" width="14px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 309.14 309.14" xml:space="preserve" fill="#ffffff" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M112.855,154.571L240.481,26.946c2.929-2.929,2.929-7.678,0-10.606L226.339,2.197 C224.933,0.79,223.025,0,221.036,0c-1.989,0-3.897,0.79-5.303,2.197L68.661,149.268c-2.929,2.929-2.929,7.678,0,10.606 l147.071,147.071c1.406,1.407,3.314,2.197,5.303,2.197c1.989,0,3.897-0.79,5.303-2.197l14.142-14.143 c2.929-2.929,2.929-7.678,0-10.606L112.855,154.571z"></path> </g></svg>
    Velocita di riproduzione`;
    iconContainer.style.textAlign = "center";
    iconContainer.style.marginBottom = "10px";

    //ripristina il settings menu
    iconContainer.addEventListener("click", (e) => {
      e.stopPropagation();

      const settingsMenu = document.querySelector(".settings-menu");
      if (settingsMenu) {
        const menuContent = settingsMenu.querySelector(".menu-content");

        // Ripristina colore opzioni
        const allOptions = menuContent.querySelectorAll(".settings-option");
        allOptions.forEach((opt) => {
          opt.style.color = "white"; // Colore originale
        });

        // Ripristina SVG
        const allSvgs = menuContent.querySelectorAll("svg");
        allSvgs.forEach((svg) => {
          svg.style.display = ""; // Reset display
        });

        // Ripristina background
        menuContent.style.background = "";
      }
      speedMenu.remove(); // Chiude direttamente il timer-menu
    });

    speedMenu.appendChild(iconContainer);

    const speeds = [
      { label: "0.25", value: 0.25 },
      { label: "0.5", value: 0.5 },
      { label: "0.75", value: 0.75 },
      { label: "Normale", value: 1 },
      { label: "1.25", value: 1.25 },
      { label: "1.5", value: 1.5 },
      { label: "1.75", value: 1.75 },
      { label: "2", value: 2 },
    ];

    speeds.forEach((speed) => {
      const speedOption = document.createElement("div");
      speedOption.className = "speed-option";
      speedOption.innerText = speed.label;
      speedOption.style.cursor = "pointer";
      speedOption.style.padding = "5px";

      speedOption.addEventListener("click", (e) => {
        e.stopPropagation();
        changeVelocity(speed.value);
        speedMenu.remove();

        document.querySelector(".settings-menu")?.remove();
      });

      speedMenu.appendChild(speedOption);
    });

    parentOption.appendChild(speedMenu);
  };

  setTimeout(() => {
    const remainingTimeDisplay = document.querySelector(".vjs-remaining-time");
    const currentTime = document.querySelector(".vjs-current-time");
    const duration = document.querySelector(".vjs-duration");
    const timeDivider = document.querySelector(".vjs-time-divider");

    if (remainingTimeDisplay) remainingTimeDisplay.style.display = "none";
    if (currentTime) currentTime.style.display = "inline";
    if (duration) duration.style.display = "inline";
    if (timeDivider) timeDivider.style.display = "inline";
  }, 500);

  window.changeVideo = changeVideo;

  useEffect(() => {
    if (playerRef.current && videoList.length > 0) {
      playerRef.current.src({
        type: videoList[currentVideoIndex]?.type || "video/mp4",
        src: videoList[currentVideoIndex]?.src || "",
      });
      playerRef.current.load();
      playerRef.current.play();
    }
  }, [videoList, currentVideoIndex]);

  const setVideoTimer = (minutes) => {
    clearTimeout(timerTimeout); // Annulla eventuali timer attivi

    const video = document.querySelector("video");
    if (video) {
      timerTimeout = setTimeout(() => {
        video.pause(); // Pausa il video dopo il tempo selezionato
        alert(`Il video è stato bloccato dopo ${minutes} minuti.

        Premere OK per continuare.`);
      }, minutes * 60 * 1000);
    }
  };

  const fallbackVideo = {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    type: "video/mp4",
    title: "Video di Default",
  };

  return (
    <div className={`player-container `}>
      {isMounted &&
        (videoList.length > 0 ? (
          <div data-vjs-player>
            <div
              className={`video-player ${sizeClass}`}
              style={{
                width: width || "100%",
              }}
            >
              <video ref={videoRef} className="video-js" />
            </div>
          </div>
        ) : (
          <div className="no-videos-message">
            <p>
              ⚠️ Nessun video disponibile. Aggiungi una lista di video per
              iniziare.
            </p>
          </div>
        ))}
    </div>
  );
};

export default PlayerVideoKunstomYoutube;
