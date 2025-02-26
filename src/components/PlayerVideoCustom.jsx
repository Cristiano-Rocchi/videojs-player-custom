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
      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: "auto",
        fluid: true,
        responsive: true,
        controlBar: {
          children: [
            "progressControl",
            "playToggle",
            "volumePanel",
            "currentTimeDisplay",
            "timeDivider",
            "durationDisplay",
            "fullscreenToggle",
          ],
        },
        sources: [
          {
            src: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
            type: "video/mp4",
          },
        ],
      });

      // **🔹 1. Aggiungiamo il mini player dentro .vjs-mouse-display**
      const tooltipDiv = document.querySelector(".vjs-mouse-display");

      if (tooltipDiv) {
        const previewVideo = document.createElement("video");
        previewVideo.src = playerRef.current.currentSrc();
        previewVideo.muted = true;
        previewVideo.className = "progress-preview-video";
        tooltipDiv.appendChild(previewVideo);
        previewRef.current = previewVideo;
      }

      // **🔹 2. Facciamo aggiornare il mini player con il tempo corretto**
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

      // **🔹 3. Creiamo il pulsante "Precedente"**
      class CustomPrevButton extends videojs.getComponent("Button") {
        constructor(player, options) {
          super(player, options);
          this.addClass("vjs-prev-button");
          this.controlText("Precedente");
          this.el().innerHTML = "⏮️";
        }

        handleClick() {
          console.log("Vai al video precedente");
        }
      }

      // **🔹 4. Creiamo il pulsante "Prossimo"**
      class CustomNextButton extends videojs.getComponent("Button") {
        constructor(player, options) {
          super(player, options);
          this.addClass("vjs-next-button");
          this.controlText("Prossimo");
          this.el().innerHTML = "⏭️";
        }

        handleClick() {
          console.log("Vai al video successivo");
        }
      }

      // **🔹 5. Registriamo i pulsanti personalizzati**
      videojs.registerComponent("CustomPrevButton", CustomPrevButton);
      videojs.registerComponent("CustomNextButton", CustomNextButton);

      // **🔹 6. Aggiungiamo i pulsanti alla fine della control bar**
      const controlBar = playerRef.current.getChild("controlBar");

      controlBar.addChild(
        "CustomPrevButton",
        {},
        controlBar.children().length - 1
      );
      controlBar.addChild(
        "CustomNextButton",
        {},
        controlBar.children().length - 1
      );
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
