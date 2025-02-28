import React, { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./PlayerVideoKunstom-pro.css";
import "videojs-youtube";

const PlayerVideoKunstomPro = ({
  videoList = [],
  onVideoChange,
  autoplay = false,
  loop = false,
  muted = false,
  volume = 1,
  aspectRatio = "16:9",
  doubleClickFullscreen = true,
  controls = true,
}) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const previewRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

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
              <svg fill="#ffffff" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 51.53 51.53" xml:space="preserve" stroke="#ffffff" stroke-width="0.0005153099999999999"><g id="SVGRepo_iconCarrier"> <g> <path d="M44.9,1.963c-3.662,0-6.631,2.969-6.631,6.631V23.81c-0.285-0.324-0.617-0.609-1-0.831L6,4.926 c-1.238-0.715-2.762-0.715-4,0C0.763,5.64,0,6.961,0,8.39v36.104c0,1.43,0.763,2.75,2,3.465c0.619,0.356,1.311,0.535,2,0.535 c0.691,0,1.381-0.179,2-0.535l31.269-18.053c0.383-0.223,0.715-0.508,1-0.832v13.863c0,3.662,2.969,6.631,6.631,6.631 s6.631-2.969,6.631-6.631V8.594C51.531,4.932,48.562,1.963,44.9,1.963z"></path> </g> </g></svg>
            `,
          });

          nextButton.addEventListener("click", () => {
            if (window.changeVideo) {
              window.changeVideo(1); // Vai al video successivo
            }
          });

          // skip avanti 30 secondi
          const skip30ForwardButton = videojs.dom.createEl("button", {
            className: "vjs-skip-forward-button",
            innerHTML: `
              <svg fill="#ffffff" width="32px"  viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="0.00032"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;}</style></defs><title>forward--30</title><path d="M26,18A10,10,0,1,1,16,8h4v5l6-6L20,1V6H16A12,12,0,1,0,28,18Z"></path><path d="M19.64,22.13a2.81,2.81,0,0,1-1.28-.27,2.36,2.36,0,0,1-.89-.77A3.39,3.39,0,0,1,17,19.84a7.12,7.12,0,0,1-.17-1.68A7.24,7.24,0,0,1,17,16.48a3.46,3.46,0,0,1,.52-1.25,2.36,2.36,0,0,1,.89-.77,2.81,2.81,0,0,1,1.28-.27,2.44,2.44,0,0,1,2.16,1,5.31,5.31,0,0,1,.7,2.93,5.31,5.31,0,0,1-.7,2.93A2.44,2.44,0,0,1,19.64,22.13Zm0-1.22a1,1,0,0,0,1-.55,3.24,3.24,0,0,0,.3-1.51V17.47a3.17,3.17,0,0,0-.3-1.5,1.22,1.22,0,0,0-2.05,0,3.18,3.18,0,0,0-.29,1.5v1.38a3.25,3.25,0,0,0,.29,1.51A1,1,0,0,0,19.64,20.91Z"></path><path d="M12.62,17.42a1.46,1.46,0,0,0,1-.27.84.84,0,0,0,.31-.68v-.08a.94.94,0,0,0-.3-.74,1.2,1.2,0,0,0-.83-.27,1.65,1.65,0,0,0-.89.24,2.1,2.1,0,0,0-.68.68l-.93-.83a5.37,5.37,0,0,1,.44-.51,2.7,2.7,0,0,1,.54-.4,2.55,2.55,0,0,1,.7-.27,3.25,3.25,0,0,1,.87-.1,3.94,3.94,0,0,1,1.06.14,2.33,2.33,0,0,1,.82.4,1.91,1.91,0,0,1,.54.63,1.87,1.87,0,0,1,.18.83,2,2,0,0,1-.11.67,1.82,1.82,0,0,1-.32.52,1.79,1.79,0,0,1-.47.36,2.27,2.27,0,0,1-.57.2V18a2.34,2.34,0,0,1,.63.21,1.7,1.7,0,0,1,.51.38,1.89,1.89,0,0,1,.34.55,2.07,2.07,0,0,1,.12.73,2,2,0,0,1-.2.92,2,2,0,0,1-.58.72,2.66,2.66,0,0,1-.89.45,3.76,3.76,0,0,1-1.15.16,4.1,4.1,0,0,1-1-.11A3.1,3.1,0,0,1,11,21.7a2.76,2.76,0,0,1-.56-.45A4.22,4.22,0,0,1,10,20.7l1.07-.81a3.07,3.07,0,0,0,.28.42,1.94,1.94,0,0,0,.36.34,1.57,1.57,0,0,0,.45.22,2,2,0,0,0,.57.07,1.45,1.45,0,0,0,1-.3,1.12,1.12,0,0,0,.34-.85v-.08a1,1,0,0,0-.37-.8,1.78,1.78,0,0,0-1.06-.28h-.76V17.42Z"></path><rect id="_Transparent_Rectangle_" data-name="<Transparent Rectangle>" class="cls-1" width="24" height="24"></rect></g></svg>
            `,
          });

          skip30ForwardButton.addEventListener("click", () => {
            if (this.player_) {
              const currentTime = this.player_.currentTime();
              this.player_.currentTime(currentTime + 5);
            }
          });

          //skip avanti 10 secondi
          const skip10ForwardButton = videojs.dom.createEl("button", {
            className: "vjs-skip-forward-button",
            innerHTML: `
            <svg   width="28px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19.6916 7.34849C19.4416 7.01849 18.9716 6.94849 18.6416 7.19849C18.3116 7.44849 18.2416 7.91849 18.4916 8.24849C19.5716 9.68849 20.1416 11.3685 20.1416 13.1085C20.1416 17.5985 16.4916 21.2485 12.0016 21.2485C7.51156 21.2485 3.86156 17.5985 3.86156 13.1085C3.86156 8.61849 7.51156 4.97849 12.0016 4.97849C12.5816 4.97849 13.1716 5.04849 13.8116 5.19849C13.8416 5.20849 13.8716 5.19849 13.9116 5.19849C13.9316 5.19849 13.9616 5.21849 13.9816 5.21849C14.0116 5.21849 14.0316 5.20849 14.0616 5.20849C14.1016 5.20849 14.1316 5.19849 14.1616 5.18849C14.2116 5.17849 14.2616 5.15849 14.3116 5.12849C14.3416 5.10849 14.3816 5.09849 14.4116 5.07849C14.4216 5.06849 14.4416 5.06849 14.4516 5.05849C14.4816 5.03849 14.4916 5.00849 14.5116 4.98849C14.5516 4.94849 14.5816 4.91849 14.6116 4.86849C14.6416 4.82849 14.6516 4.77849 14.6716 4.73849C14.6816 4.70849 14.7016 4.67849 14.7116 4.64849C14.7116 4.62849 14.7116 4.61849 14.7116 4.59849C14.7216 4.54849 14.7216 4.49849 14.7116 4.44849C14.7116 4.39849 14.7116 4.35849 14.7016 4.30849C14.6916 4.26849 14.6716 4.22849 14.6516 4.17849C14.6316 4.12849 14.6116 4.07849 14.5816 4.03849C14.5716 4.01849 14.5716 4.00849 14.5616 3.99849L12.5816 1.52849C12.3216 1.20849 11.8516 1.15849 11.5316 1.40849C11.2116 1.66849 11.1616 2.13849 11.4116 2.45849L12.2316 3.47849C12.1516 3.47849 12.0716 3.46849 11.9916 3.46849C6.68156 3.46849 2.35156 7.78849 2.35156 13.1085C2.35156 18.4285 6.67156 22.7485 11.9916 22.7485C17.3116 22.7485 21.6316 18.4285 21.6316 13.1085C21.6416 11.0385 20.9616 9.04849 19.6916 7.34849Z" fill="#ffffff"></path> <path d="M9.5415 16.6708C9.1315 16.6708 8.7915 16.3308 8.7915 15.9208V12.5308L8.6015 12.7508C8.3215 13.0608 7.8515 13.0808 7.5415 12.8108C7.2315 12.5308 7.2115 12.0608 7.4815 11.7508L8.9815 10.0808C9.1915 9.85081 9.5215 9.77081 9.8115 9.88081C10.1015 9.99081 10.2915 10.2708 10.2915 10.5808V15.9308C10.2915 16.3408 9.9615 16.6708 9.5415 16.6708Z" fill="#ffffff"></path> <path d="M14 16.6703C12.48 16.6703 11.25 15.4403 11.25 13.9203V12.5703C11.25 11.0503 12.48 9.82031 14 9.82031C15.52 9.82031 16.75 11.0503 16.75 12.5703V13.9203C16.75 15.4403 15.52 16.6703 14 16.6703ZM14 11.3303C13.31 11.3303 12.75 11.8903 12.75 12.5803V13.9303C12.75 14.6203 13.31 15.1803 14 15.1803C14.69 15.1803 15.25 14.6203 15.25 13.9303V12.5803C15.25 11.8903 14.69 11.3303 14 11.3303Z" fill="#ffffff"></path> </g></svg>
            `,
          });

          skip10ForwardButton.addEventListener("click", () => {
            if (this.player_) {
              const currentTime = this.player_.currentTime();
              this.player_.currentTime(currentTime + 5);
            }
          });

          //skip indietro 30 secondi
          const skip30RewindButton = videojs.dom.createEl("button", {
            className: "vjs-skip-rewind-button",
            innerHTML: `
              <svg fill="#ffffff" width="32px"  viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="0.00032"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;}</style></defs><title>forward--30</title><path d="M26,18A10,10,0,1,1,16,8h4v5l6-6L20,1V6H16A12,12,0,1,0,28,18Z"></path><path d="M19.64,22.13a2.81,2.81,0,0,1-1.28-.27,2.36,2.36,0,0,1-.89-.77A3.39,3.39,0,0,1,17,19.84a7.12,7.12,0,0,1-.17-1.68A7.24,7.24,0,0,1,17,16.48a3.46,3.46,0,0,1,.52-1.25,2.36,2.36,0,0,1,.89-.77,2.81,2.81,0,0,1,1.28-.27,2.44,2.44,0,0,1,2.16,1,5.31,5.31,0,0,1,.7,2.93,5.31,5.31,0,0,1-.7,2.93A2.44,2.44,0,0,1,19.64,22.13Zm0-1.22a1,1,0,0,0,1-.55,3.24,3.24,0,0,0,.3-1.51V17.47a3.17,3.17,0,0,0-.3-1.5,1.22,1.22,0,0,0-2.05,0,3.18,3.18,0,0,0-.29,1.5v1.38a3.25,3.25,0,0,0,.29,1.51A1,1,0,0,0,19.64,20.91Z"></path><path d="M12.62,17.42a1.46,1.46,0,0,0,1-.27.84.84,0,0,0,.31-.68v-.08a.94.94,0,0,0-.3-.74,1.2,1.2,0,0,0-.83-.27,1.65,1.65,0,0,0-.89.24,2.1,2.1,0,0,0-.68.68l-.93-.83a5.37,5.37,0,0,1,.44-.51,2.7,2.7,0,0,1,.54-.4,2.55,2.55,0,0,1,.7-.27,3.25,3.25,0,0,1,.87-.1,3.94,3.94,0,0,1,1.06.14,2.33,2.33,0,0,1,.82.4,1.91,1.91,0,0,1,.54.63,1.87,1.87,0,0,1,.18.83,2,2,0,0,1-.11.67,1.82,1.82,0,0,1-.32.52,1.79,1.79,0,0,1-.47.36,2.27,2.27,0,0,1-.57.2V18a2.34,2.34,0,0,1,.63.21,1.7,1.7,0,0,1,.51.38,1.89,1.89,0,0,1,.34.55,2.07,2.07,0,0,1,.12.73,2,2,0,0,1-.2.92,2,2,0,0,1-.58.72,2.66,2.66,0,0,1-.89.45,3.76,3.76,0,0,1-1.15.16,4.1,4.1,0,0,1-1-.11A3.1,3.1,0,0,1,11,21.7a2.76,2.76,0,0,1-.56-.45A4.22,4.22,0,0,1,10,20.7l1.07-.81a3.07,3.07,0,0,0,.28.42,1.94,1.94,0,0,0,.36.34,1.57,1.57,0,0,0,.45.22,2,2,0,0,0,.57.07,1.45,1.45,0,0,0,1-.3,1.12,1.12,0,0,0,.34-.85v-.08a1,1,0,0,0-.37-.8,1.78,1.78,0,0,0-1.06-.28h-.76V17.42Z"></path><rect id="_Transparent_Rectangle_" data-name="<Transparent Rectangle>" class="cls-1" width="24" height="24"></rect></g></svg>
            `,
          });
          skip30RewindButton.addEventListener("click", () => {
            if (this.player_) {
              const currentTime = this.player_.currentTime();
              this.player_.currentTime(currentTime - 5);
            }
          });

          //skip indietro 10 secondi
          const skip10RewindButton = videojs.dom.createEl("button", {
            className: "vjs-skip-rewind-button",
            innerHTML: `
              <svg width="28px"  viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" stroke-width="3" stroke="#ffffff" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><polyline points="9.57 15.41 12.17 24.05 20.81 21.44" stroke-linecap="round"></polyline><path d="M26.93,41.41V23a.09.09,0,0,0-.16-.07s-2.58,3.69-4.17,4.78" stroke-linecap="round"></path><rect x="32.19" y="22.52" width="11.41" height="18.89" rx="5.7"></rect><path d="M12.14,23.94a21.91,21.91,0,1,1-.91,13.25" stroke-linecap="round"></path></g></svg>
            `,
          });
          skip10RewindButton.addEventListener("click", () => {
            if (this.player_) {
              const currentTime = this.player_.currentTime();
              this.player_.currentTime(currentTime - 5);
            }
          });

          // Append Button
          el.appendChild(nextButton);
          el.appendChild(skip30ForwardButton);
          el.appendChild(skip10ForwardButton);
          el.appendChild(skip10RewindButton);
          el.appendChild(skip30RewindButton);

          return el;
        }
      }

      videojs.registerComponent("GroupedControlsStart", GroupedControlsStart);

      class GroupedControlsCenter extends Component {
        constructor(player, options) {
          super(player, options);
          this.addClass("vjs-grouped-controls-center");
        }

        createEl() {
          const el = videojs.dom.createEl("div", {
            className: "vjs-grouped-controls-center",
          });

          return el;
        }
      }

      videojs.registerComponent("GroupedControlsCenter", GroupedControlsCenter);

      class GroupedControlsEnd extends Component {
        constructor(player, options) {
          super(player, options);
          this.addClass("vjs-grouped-controls-end");
        }

        createEl() {
          const el = videojs.dom.createEl("div", {
            className: "vjs-grouped-controls-end",
          });

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
        controlBar: {
          children: [
            {
              name: "GroupedControlsStart",
              children: ["playToggle", "nextButton"],
            },
            {
              name: "GroupedControlsCenter",
              children: ["progressControl", "volumePanel"],
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
            previewRef.current.currentTime = videoTime;
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

      // ** Aggiungi il mini player per l'anteprima **
      const tooltipDiv = document.querySelector(".vjs-mouse-display");
      if (tooltipDiv) {
        const previewVideo = document.createElement("video");
        previewVideo.src = playerRef.current.currentSrc();
        previewVideo.muted = true;
        previewVideo.className = "progress-preview-video";
        tooltipDiv.appendChild(previewVideo);
        previewRef.current = previewVideo;
      }
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

      if (playerRef.current) {
        playerRef.current.pause();
        playerRef.current.src({
          type: videoList[newIndex]?.type || "video/mp4",
          src: videoList[newIndex]?.src || "",
        });
        playerRef.current.load();
        playerRef.current.play();
      }

      if (previewRef.current) {
        previewRef.current.src = videoList[newIndex]?.src || "";
        previewRef.current.load();
      }

      if (onVideoChange) {
        onVideoChange(newIndex);
      }

      return newIndex;
    });
  };

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
    <div className="player-container">
      {isMounted &&
        (videoList.length > 0 ? (
          <div data-vjs-player>
            <div className="video-player">
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

export default PlayerVideoKunstomPro;
