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
  doubleClickFullscreen = true,
  controls = true,
  darkMode = false,
  size = null,
  width = null,
  color = "white",
  title = false,
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

  /*props*/
  const themeClass = darkMode ? "dark-mode" : "light-mode";
  const sizeClass = width ? "" : size ? `size-${size}` : "size-100";
  const [showTitle, setShowTitle] = useState(title);
  const [showQuality, setShowQuality] = useState(quality);
  const [showTooltips, setShowTooltips] = useState(tooltips);

  //title
  useEffect(() => {
    setShowTitle(title);
    updateTitleVisibility(title);
  }, [title]);

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
        .vjs-fullscreen-control[title]::after {
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
          this.titleEnabled = options.title;
        }

        createEl() {
          const el = videojs.dom.createEl("div", {
            className: "vjs-grouped-controls-start",
          });

          if (showTitle && videoList.length > 0) {
            const titleElement = videojs.dom.createEl("p", {
              className: "vjs-title-video",
              innerHTML: `&#8226; ${videoList[currentVideoIndex].title}`,
            });
            el.appendChild(titleElement);
          }

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

          //QUALITY
          // Menu qualità (inizialmente nascosto)
          const qualityMenu = videojs.dom.createEl("div", {
            className: "quality-menu",
            style: "display: none;",
          });

          if (showQuality) {
            const settingButton = videojs.dom.createEl("button", {
              className: "vjs-setting-button",
              innerHTML: `<svg fill="${color}" width="24px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 54 54" xml:space="preserve" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M51.22,21h-5.052c-0.812,0-1.481-0.447-1.792-1.197s-0.153-1.54,0.42-2.114l3.572-3.571 c0.525-0.525,0.814-1.224,0.814-1.966c0-0.743-0.289-1.441-0.814-1.967l-4.553-4.553c-1.05-1.05-2.881-1.052-3.933,0l-3.571,3.571 c-0.574,0.573-1.366,0.733-2.114,0.421C33.447,9.313,33,8.644,33,7.832V2.78C33,1.247,31.753,0,30.22,0H23.78 C22.247,0,21,1.247,21,2.78v5.052c0,0.812-0.447,1.481-1.197,1.792c-0.748,0.313-1.54,0.152-2.114-0.421l-3.571-3.571 c-1.052-1.052-2.883-1.05-3.933,0l-4.553,4.553c-0.525,0.525-0.814,1.224-0.814,1.967c0,0.742,0.289,1.44,0.814,1.966l3.572,3.571 c0.573,0.574,0.73,1.364,0.42,2.114S8.644,21,7.832,21H2.78C1.247,21,0,22.247,0,23.78v6.439C0,31.753,1.247,33,2.78,33h5.052 c0.812,0,1.481,0.447,1.792,1.197s0.153,1.54-0.42,2.114l-3.572,3.571c-0.525,0.525-0.814,1.224-0.814,1.966 c0,0.743,0.289,1.441,0.814,1.967l4.553,4.553c1.051,1.051,2.881,1.053,3.933,0l3.571-3.572c0.574-0.573,1.363-0.731,2.114-0.42 c0.75,0.311,1.197,0.98,1.197,1.792v5.052c0,1.533,1.247,2.78,2.78,2.78h6.439c1.533,0,2.78-1.247,2.78-2.78v-5.052 c0-0.812,0.447-1.481,1.197-1.792c0.751-0.312,1.54-0.153,2.114,0.42l3.571,3.572c1.052,1.052,2.883,1.05,3.933,0l4.553-4.553 c0.525-0.525,0.814-1.224,0.814-1.967c0-0.742-0.289-1.44-0.814-1.966l-3.572-3.571c-0.573-0.574-0.73-1.364-0.42-2.114 S45.356,33,46.168,33h5.052c1.533,0,2.78-1.247,2.78-2.78V23.78C54,22.247,52.753,21,51.22,21z M52,30.22 C52,30.65,51.65,31,51.22,31h-5.052c-1.624,0-3.019,0.932-3.64,2.432c-0.622,1.5-0.295,3.146,0.854,4.294l3.572,3.571 c0.305,0.305,0.305,0.8,0,1.104l-4.553,4.553c-0.304,0.304-0.799,0.306-1.104,0l-3.571-3.572c-1.149-1.149-2.794-1.474-4.294-0.854 c-1.5,0.621-2.432,2.016-2.432,3.64v5.052C31,51.65,30.65,52,30.22,52H23.78C23.35,52,23,51.65,23,51.22v-5.052 c0-1.624-0.932-3.019-2.432-3.64c-0.503-0.209-1.021-0.311-1.533-0.311c-1.014,0-1.997,0.4-2.761,1.164l-3.571,3.572 c-0.306,0.306-0.801,0.304-1.104,0l-4.553-4.553c-0.305-0.305-0.305-0.8,0-1.104l3.572-3.571c1.148-1.148,1.476-2.794,0.854-4.294 C10.851,31.932,9.456,31,7.832,31H2.78C2.35,31,2,30.65,2,30.22V23.78C2,23.35,2.35,23,2.78,23h5.052 c1.624,0,3.019-0.932,3.64-2.432c0.622-1.5,0.295-3.146-0.854-4.294l-3.572-3.571c-0.305-0.305-0.305-0.8,0-1.104l4.553-4.553 c0.304-0.305,0.799-0.305,1.104,0l3.571,3.571c1.147,1.147,2.792,1.476,4.294,0.854C22.068,10.851,23,9.456,23,7.832V2.78 C23,2.35,23.35,2,23.78,2h6.439C30.65,2,31,2.35,31,2.78v5.052c0,1.624,0.932,3.019,2.432,3.64 c1.502,0.622,3.146,0.294,4.294-0.854l3.571-3.571c0.306-0.305,0.801-0.305,1.104,0l4.553,4.553c0.305,0.305,0.305,0.8,0,1.104 l-3.572,3.571c-1.148,1.148-1.476,2.794-0.854,4.294c0.621,1.5,2.016,2.432,3.64,2.432h5.052C51.65,23,52,23.35,52,23.78V30.22z"></path> <path d="M27,18c-4.963,0-9,4.037-9,9s4.037,9,9,9s9-4.037,9-9S31.963,18,27,18z M27,34c-3.859,0-7-3.141-7-7s3.141-7,7-7 s7,3.141,7,7S30.859,34,27,34z"></path> </g> </g></svg>`,
            });

            settingButton.addEventListener("click", () => {
              if (this.qualityMenuVisible) {
                qualityMenu.style.display = "none"; // Chiude il menu
              } else {
                // Mostra il menu con le opzioni di qualità
                const latestVideoIndex = currentVideoIndexRef.current;
                const currentVideo = videoList[latestVideoIndex];

                qualityMenu.innerHTML = ""; // Pulisce il menu

                if (currentVideo?.qualities?.length > 0) {
                  currentVideo.qualities.forEach((quality) => {
                    const qualityOption = videojs.dom.createEl("button", {
                      className: "quality-option",
                      innerHTML: quality.label,
                    });

                    qualityOption.addEventListener("click", () => {
                      console.log(`Cambiando qualità a: ${quality.label}`);
                      changeQlty(quality.label);
                      qualityMenu.style.display = "none"; // Chiude il menu
                      this.qualityMenuVisible = false;
                    });

                    qualityMenu.appendChild(qualityOption);
                  });
                } else {
                  qualityMenu.innerHTML =
                    "<p class='no-quality'>Nessuna qualità disponibile</p>";
                }

                qualityMenu.style.display = "block"; // Mostra il menu
              }

              this.qualityMenuVisible = !this.qualityMenuVisible;
            });

            el.appendChild(settingButton);
          }

          const cinemaMode = videojs.dom.createEl("div", {
            className: "vjs-cinema-btn",
            innerHTML: `<svg height="100%" version="1.1" viewBox="0 0 36 36"><use class="ytp-svg-shadow" xlink:href="#ytp-id-53"></use><path d="m 28,11 0,14 -20,0 0,-14 z m -18,2 16,0 0,10 -16,0 0,-10 z" fill="#fff" fill-rule="evenodd" id="ytp-id-53"></path></svg>

`,
          });
          cinemaMode.addEventListener("click", function () {
            const videoContainer = document.querySelector(".video-player"); // Seleziona il container del player

            if (videoContainer.classList.contains("cinema-mode")) {
              videoContainer.classList.remove("cinema-mode"); // Ritorna alla dimensione originale
            } else {
              videoContainer.classList.add("cinema-mode"); // Applica la modalità cinema
            }
          });

          const miniVideoMode = videojs.dom.createEl("div", {
            className: "mini-video-mode",
            innerHTML: `<svg height="100%" version="1.1" viewBox="0 0 36 36" ><use class="ytp-svg-shadow" xlink:href="#ytp-id-43"></use><path d="M25,17 L17,17 L17,23 L25,23 L25,17 L25,17 Z M29,25 L29,10.98 C29,9.88 28.1,9 27,9 L9,9 C7.9,9 7,9.88 7,10.98 L7,25 C7,26.1 7.9,27 9,27 L27,27 C28.1,27 29,26.1 29,25 L29,25 Z M27,25.02 L9,25.02 L9,10.97 L27,10.97 L27,25.02 L27,25.02 Z" fill="#fff" id="ytp-id-43"></path></svg>`,
          });

          miniVideoMode.addEventListener("click", () => {
            const videoPlayer = document.querySelector(".video-player");
            const controlsEnd = document.querySelector(
              ".vjs-grouped-controls-end"
            );
            const controlsStart = document.querySelector(
              ".vjs-grouped-controls-start"
            );
            const iconNext = document.querySelector(".vjs-next-button svg");
            const timeDivider = document.querySelector(".vjs-time-divider");
            const allIcons = document.querySelectorAll(
              ".vjs-play-control,  .vjs-current-time, .vjs-duration"
            );
            const volumePanel = document.querySelector("vjs-volume-panel");
            const progressControl = document.querySelector(
              ".vjs-progress-control"
            );

            if (progressControl) {
              progressControl.style.width = "118%";
              progressControl.style.bottom = "25px";
            }

            if (volumePanel) {
              volumePanel.style.display = "none";
            }

            if (videoPlayer) {
              videoPlayer.style.width = "400px";
            }

            if (controlsEnd) {
              controlsEnd.style.display = "none";
            }
            if (controlsStart) {
              controlsStart.style.position = "relative";
              controlsStart.style.top = "10px";
            }
            if (iconNext) {
              iconNext.style.position = "relative";
              iconNext.style.top = "3px";
            }
            if (timeDivider) {
              timeDivider.style.display = "none";
            }
            allIcons.forEach((control) => {});
          });

          const settingsButton = videojs.dom.createEl("div", {
            className: "",
            innerHTML: `<svg height="100%" version="1.1" viewBox="0 0 36 36" ><use class="svg-settings" xlink:href="#ytp-id-42"></use><path d="m 23.94,18.78 c .03,-0.25 .05,-0.51 .05,-0.78 0,-0.27 -0.02,-0.52 -0.05,-0.78 l 1.68,-1.32 c .15,-0.12 .19,-0.33 .09,-0.51 l -1.6,-2.76 c -0.09,-0.17 -0.31,-0.24 -0.48,-0.17 l -1.99,.8 c -0.41,-0.32 -0.86,-0.58 -1.35,-0.78 l -0.30,-2.12 c -0.02,-0.19 -0.19,-0.33 -0.39,-0.33 l -3.2,0 c -0.2,0 -0.36,.14 -0.39,.33 l -0.30,2.12 c -0.48,.2 -0.93,.47 -1.35,.78 l -1.99,-0.8 c -0.18,-0.07 -0.39,0 -0.48,.17 l -1.6,2.76 c -0.10,.17 -0.05,.39 .09,.51 l 1.68,1.32 c -0.03,.25 -0.05,.52 -0.05,.78 0,.26 .02,.52 .05,.78 l -1.68,1.32 c -0.15,.12 -0.19,.33 -0.09,.51 l 1.6,2.76 c .09,.17 .31,.24 .48,.17 l 1.99,-0.8 c .41,.32 .86,.58 1.35,.78 l .30,2.12 c .02,.19 .19,.33 .39,.33 l 3.2,0 c .2,0 .36,-0.14 .39,-0.33 l .30,-2.12 c .48,-0.2 .93,-0.47 1.35,-0.78 l 1.99,.8 c .18,.07 .39,0 .48,-0.17 l 1.6,-2.76 c .09,-0.17 .05,-0.39 -0.09,-0.51 l -1.68,-1.32 0,0 z m -5.94,2.01 c -1.54,0 -2.8,-1.25 -2.8,-2.8 0,-1.54 1.25,-2.8 2.8,-2.8 1.54,0 2.8,1.25 2.8,2.8 0,1.54 -1.25,2.8 -2.8,2.8 l 0,0 z" fill="#fff" id="ytp-id-42"></path></svg>`,
          });

          const subtitlesButton = videojs.dom.createEl("div", {
            className: "",
            innerHTML: ` <svg class="ytp-subtitles-button-icon" height="100%" version="1.1" viewBox="0 0 36 36" fill-opacity="1"><use class="ytp-svg-shadow" xlink:href="#ytp-id-40"></use><path d="M11,11 C9.9,11 9,11.9 9,13 L9,23 C9,24.1 9.9,25 11,25 L25,25 C26.1,25 27,24.1 27,23 L27,13 C27,11.9 26.1,11 25,11 L11,11 Z M11,17 L14,17 L14,19 L11,19 L11,17 L11,17 Z M20,23 L11,23 L11,21 L20,21 L20,23 L20,23 Z M25,23 L22,23 L22,21 L25,21 L25,23 L25,23 Z M25,19 L16,19 L16,17 L25,17 L25,19 L25,19 Z" fill="#fff" id="ytp-id-40"></path></svg>`,
          });

          el.appendChild(qualityMenu);
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
              title: title,
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
    console.log("CurrentVideoIndex al momento del click:", latestVideoIndex);

    if (
      videoList.length === 0 ||
      latestVideoIndex === undefined ||
      latestVideoIndex < 0
    ) {
      alert("Errore: Nessun video selezionato.");
      return;
    }

    const currentVideo = videoList[latestVideoIndex];

    console.log("CurrentVideo:", currentVideo);

    if (
      !currentVideo ||
      !currentVideo.qualities ||
      currentVideo.qualities.length === 0
    ) {
      alert("Questo video non ha qualità da scegliere.");
      return;
    }

    // Creiamo il menu per selezionare la qualità
    const qualityMenu = document.createElement("div");
    qualityMenu.className = "quality-menu";

    // Aggiungiamo ogni qualità come un'opzione cliccabile
    currentVideo.qualities.forEach((quality) => {
      const qualityOption = document.createElement("button");
      qualityOption.className = "quality-option";
      qualityOption.innerText = quality.label;

      // Quando clicco, cambio qualità
      qualityOption.addEventListener("click", () => {
        console.log(`Selezionata qualità: ${quality.label}`);
        changeQlty(quality.label);
        qualityMenu.remove(); // Chiude il menu dopo la selezione
      });

      qualityMenu.appendChild(qualityOption);
    });

    // Aggiungiamo il menu al corpo del documento
    document.body.appendChild(qualityMenu);
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

  const updateTitleVisibility = (isVisible) => {
    if (playerRef.current) {
      const titleElement = document.querySelector(".vjs-title-video");
      if (titleElement) {
        titleElement.style.display = isVisible ? "block" : "none";
      }
    }
  };

  const updateQualityVisibility = (isVisible) => {
    if (playerRef.current) {
      const settingButton = document.querySelector(".vjs-setting-button");
      if (settingButton) {
        settingButton.style.display = isVisible ? "block" : "none";
      }
    }
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

  const fallbackVideo = {
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    type: "video/mp4",
    title: "Video di Default",
  };

  return (
    <div
      className={`player-container ${darkMode ? "dark-mode" : "light-mode"}  `}
    >
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
