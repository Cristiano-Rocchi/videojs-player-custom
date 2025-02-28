import React, { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css"; // Import del CSS per Video.js
import "./PlayerVideoKunstom-pro.css"; // Puoi aggiungere il CSS personalizzato per il nuovo player

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
              children: ["playToggle"],
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

      if (onVideoChange) {
        onVideoChange(newIndex);
      }

      return newIndex;
    });
  };

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
