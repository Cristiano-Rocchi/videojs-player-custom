import React, { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./PlayerVideoCustom.css";

const PlayerVideoCustom = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const previewRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && videoRef.current && !playerRef.current) {
      // 📌 Creiamo un nuovo wrapper per i controlli (tranne fullscreen)
      const Component = videojs.getComponent("Component");

      class GroupedControls extends Component {
        constructor(player, options) {
          super(player, options);
          this.addClass("vjs-grouped-controls");
        }

        createEl() {
          const el = videojs.dom.createEl("div", {
            className: "vjs-grouped-controls",
          });

          return el;
        }
      }

      // 📌 Registriamo il nuovo componente
      videojs.registerComponent("GroupedControls", GroupedControls);

      // 📌 Inizializziamo il player con il wrapper per i controlli
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: "auto",
        fluid: true,
        responsive: true,
        controlBar: {
          children: [
            {
              name: "GroupedControls", // Questo div conterrà tutti i controlli tranne fullscreen
              children: [
                "playToggle",
                "progressControl",
                "volumePanel",
                "currentTimeDisplay",
                "timeDivider",
                "durationDisplay",
              ],
            },
            "fullscreenToggle", // Questo resta fuori
          ],
        },
        sources: [
          {
            src: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
            type: "video/mp4",
          },
        ],
      });

      // ** Aggiunta del mini player per l'anteprima **
      const tooltipDiv = document.querySelector(".vjs-mouse-display");
      if (tooltipDiv) {
        const previewVideo = document.createElement("video");
        previewVideo.src = playerRef.current.currentSrc();
        previewVideo.muted = true;
        previewVideo.className = "progress-preview-video";
        tooltipDiv.appendChild(previewVideo);
        previewRef.current = previewVideo;
      }

      // ** Aggiornamento dell'anteprima sul progresso **
      const progressBar = document.querySelector(".vjs-progress-control");
      progressBar.addEventListener("mousemove", (event) => {
        if (previewRef.current) {
          const rect = progressBar.getBoundingClientRect();
          const percentage = (event.clientX - rect.left) / rect.width;
          const videoTime = percentage * playerRef.current.duration();
          previewRef.current.currentTime = videoTime;
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

      setTimeout(() => {
        const remainingTimeDisplay = document.querySelector(
          ".vjs-remaining-time"
        );
        const currentTime = document.querySelector(".vjs-current-time");
        const duration = document.querySelector(".vjs-duration");
        const timeDivider = document.querySelector(".vjs-time-divider");

        if (remainingTimeDisplay) remainingTimeDisplay.style.display = "none";
        if (currentTime) currentTime.style.display = "inline";
        if (duration) duration.style.display = "inline";
        if (timeDivider) timeDivider.style.display = "inline";
      }, 500);
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [isMounted]);

  return (
    <div className="player-container">
      {isMounted && (
        <div data-vjs-player>
          <div className="video-player">
            <video ref={videoRef} className="video-js" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerVideoCustom;
