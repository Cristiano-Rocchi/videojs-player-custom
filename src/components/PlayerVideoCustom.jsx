import React, { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./PlayerVideoCustom.css";

const PlayerVideoCustom = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const previewRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const videoList = [
    {
      src: "https://www.w3schools.com/html/mov_bbb.mp4",
      type: "video/mp4",
      title: "Video di Test",
    },

    {
      src: "https://media.istockphoto.com/id/1697150103/it/video/guidare-sotto-la-pioggia-di-notte.mp4?s=mp4-640x640-is&k=20&c=virq68l1edFMhw55u_f15bdcx56hZQAQQ83RJBFBqzw=",
      type: "video/mp4",
      title: "Video di Test",
    },
  ];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && videoRef.current && !playerRef.current) {
      //wrapper div per le icons in controlBar
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

      videojs.registerComponent("GroupedControls", GroupedControls);

      class GroupedControls2 extends Component {
        constructor(player, options) {
          super(player, options);
          this.addClass("vjs-grouped-controls-2");
        }

        createEl() {
          const el = videojs.dom.createEl("div", {
            className: "vjs-grouped-controls-2",
          });

          const prevButton = videojs.dom.createEl("button", {
            className: "vjs-prev-button",
            innerHTML: `
              <svg style="position: relative; top: 10px;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg><span style="position: relative; top: 2px;">Precedente</span>
            `,
          });

          const nextButton = videojs.dom.createEl("button", {
            className: "vjs-next-button",
            innerHTML: `
              <span style="position: relative; top: 2px;">Successivo</span><svg style="position: relative; top: 10px;" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            `,
          });

          //Eventi click per cambiare video
          prevButton.addEventListener("click", () => {
            if (window.changeVideo) {
              window.changeVideo(-1); // Vai al video precedente
            }
          });

          nextButton.addEventListener("click", () => {
            if (window.changeVideo) {
              window.changeVideo(1); // Vai al video successivo
            }
          });

          el.appendChild(prevButton);
          el.appendChild(nextButton);

          return el;
        }
      }

      videojs.registerComponent("GroupedControls2", GroupedControls2);

      window.changeVideo = (direction) => {
        setCurrentVideoIndex((prevIndex) => {
          let newIndex = prevIndex + direction;

          // Controllo per evitare indici fuori limite
          if (newIndex < 0) newIndex = videoList.length - 1;
          if (newIndex >= videoList.length) newIndex = 0;

          // 1. Ripristiniamo il player principale
          if (playerRef.current) {
            playerRef.current.pause();
            playerRef.current.src({
              type: "video/mp4",
              src: videoList[newIndex].src,
            });
            playerRef.current.load();
            playerRef.current.play();
          }

          // 2. Aggiorniamo il mini player con il nuovo video
          if (previewRef.current) {
            previewRef.current.src = videoList[newIndex].src;
            previewRef.current.load(); // Ricarichiamo l'anteprima
          }

          return newIndex;
        });
      };

      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: "auto",
        fluid: true,
        responsive: true,
        aspectRatio: "16:9",
        doubleClickFullscreen: true,
        controlBar: {
          children: [
            {
              name: "GroupedControls",
              children: [
                "playToggle",
                "progressControl",
                "volumePanel",
                "currentTimeDisplay",
                "timeDivider",
                "durationDisplay",
              ],
            },
            {
              name: "GroupedControls2",
              children: ["fullscreenToggle"],
            },
          ],
        },
        sources: [
          {
            src: videoList[currentVideoIndex].src,
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
