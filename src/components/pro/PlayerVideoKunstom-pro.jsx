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

          // Seconda icona (pulsante personalizzato)
          const skipForwardButton = videojs.dom.createEl("button", {
            className: "vjs-skip-forward-button",
            innerHTML: `
              <svg fill="#ffffff" width="32px"  viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" stroke-width="0.00032"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><style>.cls-1{fill:none;}</style></defs><title>forward--30</title><path d="M26,18A10,10,0,1,1,16,8h4v5l6-6L20,1V6H16A12,12,0,1,0,28,18Z"></path><path d="M19.64,22.13a2.81,2.81,0,0,1-1.28-.27,2.36,2.36,0,0,1-.89-.77A3.39,3.39,0,0,1,17,19.84a7.12,7.12,0,0,1-.17-1.68A7.24,7.24,0,0,1,17,16.48a3.46,3.46,0,0,1,.52-1.25,2.36,2.36,0,0,1,.89-.77,2.81,2.81,0,0,1,1.28-.27,2.44,2.44,0,0,1,2.16,1,5.31,5.31,0,0,1,.7,2.93,5.31,5.31,0,0,1-.7,2.93A2.44,2.44,0,0,1,19.64,22.13Zm0-1.22a1,1,0,0,0,1-.55,3.24,3.24,0,0,0,.3-1.51V17.47a3.17,3.17,0,0,0-.3-1.5,1.22,1.22,0,0,0-2.05,0,3.18,3.18,0,0,0-.29,1.5v1.38a3.25,3.25,0,0,0,.29,1.51A1,1,0,0,0,19.64,20.91Z"></path><path d="M12.62,17.42a1.46,1.46,0,0,0,1-.27.84.84,0,0,0,.31-.68v-.08a.94.94,0,0,0-.3-.74,1.2,1.2,0,0,0-.83-.27,1.65,1.65,0,0,0-.89.24,2.1,2.1,0,0,0-.68.68l-.93-.83a5.37,5.37,0,0,1,.44-.51,2.7,2.7,0,0,1,.54-.4,2.55,2.55,0,0,1,.7-.27,3.25,3.25,0,0,1,.87-.1,3.94,3.94,0,0,1,1.06.14,2.33,2.33,0,0,1,.82.4,1.91,1.91,0,0,1,.54.63,1.87,1.87,0,0,1,.18.83,2,2,0,0,1-.11.67,1.82,1.82,0,0,1-.32.52,1.79,1.79,0,0,1-.47.36,2.27,2.27,0,0,1-.57.2V18a2.34,2.34,0,0,1,.63.21,1.7,1.7,0,0,1,.51.38,1.89,1.89,0,0,1,.34.55,2.07,2.07,0,0,1,.12.73,2,2,0,0,1-.2.92,2,2,0,0,1-.58.72,2.66,2.66,0,0,1-.89.45,3.76,3.76,0,0,1-1.15.16,4.1,4.1,0,0,1-1-.11A3.1,3.1,0,0,1,11,21.7a2.76,2.76,0,0,1-.56-.45A4.22,4.22,0,0,1,10,20.7l1.07-.81a3.07,3.07,0,0,0,.28.42,1.94,1.94,0,0,0,.36.34,1.57,1.57,0,0,0,.45.22,2,2,0,0,0,.57.07,1.45,1.45,0,0,0,1-.3,1.12,1.12,0,0,0,.34-.85v-.08a1,1,0,0,0-.37-.8,1.78,1.78,0,0,0-1.06-.28h-.76V17.42Z"></path><rect id="_Transparent_Rectangle_" data-name="<Transparent Rectangle>" class="cls-1" width="24" height="24"></rect></g></svg>
            `,
          });

          skipForwardButton.addEventListener("click", () => {
            console.log("Seconda icona cliccata!");
          });

          // Aggiungiamo entrambi i pulsanti
          el.appendChild(nextButton);
          el.appendChild(skipForwardButton);

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
