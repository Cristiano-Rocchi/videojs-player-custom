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
          // Pulsante Next
          const nextButton = videojs.dom.createEl("button", {
            className: "vjs-next-button",
            innerHTML: `
              <svg fill="#ffffff" width="32px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M208,40V216a8,8,0,0,1-16,0V142.26416l-119.65625,73.124A16.00029,16.00029,0,0,1,48,201.73535V54.26465A16.0002,16.0002,0,0,1,72.34277,40.61133L192,113.73535V40a8,8,0,0,1,16,0Z"></path> </g></svg>
            `,
          });

          nextButton.addEventListener("click", () => {
            if (window.changeVideo) {
              window.changeVideo(1);
            }
          });

          // Pulsante Prev
          const prevButton = videojs.dom.createEl("button", {
            className: "vjs-prev-button",
            innerHTML: `<svg fill="#ffffff" width="32px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M56,32a8.00008,8.00008,0,0,1,8,8v73.73535l119.65723-73.124A16.0002,16.0002,0,0,1,208,54.26465v147.4707a16.004,16.004,0,0,1-24.34375,13.65283L64,142.26416V216a8,8,0,0,1-16,0V40A8.00008,8.00008,0,0,1,56,32Z"></path> </g></svg>`,
          });

          prevButton.addEventListener("click", () => {
            if (window.changeVideo) {
              window.changeVideo(-1);
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
            className: "vjs-skip-forward-button sec10",
            innerHTML: `
           <svg fill="white" width="24px"  viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><g ><path d="m21.4873.996654c-.0019-.414209-.3391-.748494-.7533-.746646-.4143.001848-.7485.339129-.7467.753342l.0089 1.98571c.0036.80942.0049 1.35311-.04 1.76445l-.0017.01526c-.4565-.50181-.9598-.96023-1.503-1.36839-1.7969-1.35006-4.0318-2.15038-6.4515-2.15038-5.93706 0-10.75 4.81294-10.75 10.75 0 5.9371 4.81294 10.75 10.75 10.75 5.9371 0 10.75-4.8129 10.75-10.75 0-.4142-.3358-.75-.75-.75s-.75.3358-.75.75c0 5.1086-4.1414 9.25-9.25 9.25-5.10863 0-9.25-4.1414-9.25-9.25 0-5.10863 4.14137-9.25 9.25-9.25 2.0836 0 4.0044.68804 5.5505 1.84962.4989.37489.9588.79909 1.3723 1.26532-.0283.00379-.0579.00738-.0888.01076-.4114.04492-.9551.04363-1.7645.04002l-1.9857-.00886c-.4142-.00185-.7515.33244-.7533.74665-.0019.41421.3324.75149.7466.75334l2.029.00905c.7549.00339 1.3845.00621 1.8907-.04906.5309-.05798 1.0203-.18758 1.4453-.51655.0678-.05245.133-.10802.1955-.1665.106-.0993.2041-.20699.2931-.3221.329-.42508.4586-.91441.5166-1.44534.0553-.50618.0524-1.13575.0491-1.89062z"/><path d="m9.75 10.4142c0-1.19004-1.43883-1.78603-2.28033-.94453l-1 1.00003c-.29289.2929-.29289.7677 0 1.0606s.76777.2929 1.06066 0l.71967-.7196v5.1893c0 .4142.33579.75.75.75s.75-.3358.75-.75z"/><path clip-rule="evenodd" d="m15 9.25c-1.5188 0-2.75 1.2312-2.75 2.75v2c0 1.5188 1.2312 2.75 2.75 2.75s2.75-1.2312 2.75-2.75v-2c0-1.5188-1.2312-2.75-2.75-2.75zm-1.25 2.75c0-.6904.5596-1.25 1.25-1.25s1.25.5596 1.25 1.25v2c0 .6904-.5596 1.25-1.25 1.25s-1.25-.5596-1.25-1.25z" fill-rule="evenodd"/></g></svg>
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
              <svg fill="#ffffff" width="32px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="m4 18a12 12 0 1 0 12-12h-4v-5l-6 6 6 6v-5h4a10 10 0 1 1 -10 10z"/><path d="m19.64 22.13a2.81 2.81 0 0 1 -1.28-.27 2.36 2.36 0 0 1 -.89-.77 3.39 3.39 0 0 1 -.47-1.25 7.12 7.12 0 0 1 -.17-1.68 7.24 7.24 0 0 1 .17-1.68 3.46 3.46 0 0 1 .52-1.25 2.36 2.36 0 0 1 .89-.77 2.81 2.81 0 0 1 1.28-.27 2.44 2.44 0 0 1 2.16 1 5.31 5.31 0 0 1 .7 2.93 5.31 5.31 0 0 1 -.7 2.93 2.44 2.44 0 0 1 -2.21 1.08zm0-1.22a1 1 0 0 0 1-.55 3.24 3.24 0 0 0 .3-1.51v-1.38a3.17 3.17 0 0 0 -.3-1.5 1.22 1.22 0 0 0 -2.05 0 3.18 3.18 0 0 0 -.29 1.5v1.38a3.25 3.25 0 0 0 .29 1.51 1 1 0 0 0 1.05.55z"/><path d="m12.62 17.42a1.46 1.46 0 0 0 1-.27.84.84 0 0 0 .31-.68v-.08a.94.94 0 0 0 -.3-.74 1.2 1.2 0 0 0 -.83-.27 1.65 1.65 0 0 0 -.89.24 2.1 2.1 0 0 0 -.68.68l-.93-.83a5.37 5.37 0 0 1 .44-.51 2.7 2.7 0 0 1 .54-.4 2.55 2.55 0 0 1 .7-.27 3.25 3.25 0 0 1 .87-.1 3.94 3.94 0 0 1 1.06.14 2.33 2.33 0 0 1 .82.4 1.91 1.91 0 0 1 .54.63 1.87 1.87 0 0 1 .18.83 2 2 0 0 1 -.11.67 1.82 1.82 0 0 1 -.32.52 1.79 1.79 0 0 1 -.47.36 2.27 2.27 0 0 1 -.57.2v.06a2.34 2.34 0 0 1 .63.21 1.7 1.7 0 0 1 .51.38 1.89 1.89 0 0 1 .34.55 2.07 2.07 0 0 1 .12.73 2 2 0 0 1 -.2.92 2 2 0 0 1 -.58.72 2.66 2.66 0 0 1 -.89.45 3.76 3.76 0 0 1 -1.15.16 4.1 4.1 0 0 1 -1-.11 3.1 3.1 0 0 1 -.76-.31 2.76 2.76 0 0 1 -.56-.45 4.22 4.22 0 0 1 -.44-.55l1.07-.81a3.07 3.07 0 0 0 .28.42 1.94 1.94 0 0 0 .36.34 1.57 1.57 0 0 0 .45.22 2 2 0 0 0 .57.07 1.45 1.45 0 0 0 1-.3 1.12 1.12 0 0 0 .34-.85v-.08a1 1 0 0 0 -.37-.8 1.78 1.78 0 0 0 -1.06-.28h-.76v-1.21z"/><path d="m0 0h32v32h-32z" fill="none"/></svg>
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
            className: "vjs-skip-rewind-button sec10",
            innerHTML: `
             <svg fill="white" width="24px" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m6.46967 10.4697c-.29289.2929-.29289.7677 0 1.0606s.76777.2929 1.06066 0zm1.78033 5.5303c0 .4142.33579.75.75.75s.75-.3358.75-.75zm-5.5-4c0-.4142-.33579-.75-.75-.75s-.75.3358-.75.75zm3.24903-8 .4505.59962zm-1.99903 1.99903.54801.51204.02745-.02939.02416-.03215zm.01269-4.99568c.00185-.414213-.33244-.751495-.74665-.753343s-.75149.332437-.75334.746647zm-.75885 1.98236-.75-.00334zm3.68 3.68.00334.75zm1.98906.74114c.41421-.00185.74849-.33913.74664-.75334s-.33913-.7485-.75334-.74665zm-5.26052-1.50418-.59312.45902zm.3545.3545-.45902.59312zm12.23312 5.74283v2h1.5v-2zm-2.5 2v-2h-1.5v2zm1.25 1.25c-.6904 0-1.25-.5596-1.25-1.25h-1.5c0 1.5188 1.2312 2.75 2.75 2.75zm1.25-1.25c0 .6904-.5596 1.25-1.25 1.25v1.5c1.5188 0 2.75-1.2312 2.75-2.75zm-1.25-3.25c.6904 0 1.25.5596 1.25 1.25h1.5c0-1.5188-1.2312-2.75-2.75-2.75zm0-1.5c-1.5188 0-2.75 1.2312-2.75 2.75h1.5c0-.6904.5596-1.25 1.25-1.25zm-13.75 2.75c0 5.9371 4.81294 10.75 10.75 10.75v-1.5c-5.10863 0-9.25-4.1414-9.25-9.25zm10.75 10.75c5.9371 0 10.75-4.8129 10.75-10.75h-1.5c0 5.1086-4.1414 9.25-9.25 9.25zm10.75-10.75c0-5.93706-4.8129-10.75-10.75-10.75v1.5c5.1086 0 9.25 4.14137 9.25 9.25zm-10.75-10.75c-2.41966 0-4.65456.80032-6.45148 2.15038l.90101 1.19924c1.54606-1.16158 3.46683-1.84962 5.55047-1.84962zm-6.45148 2.15038c-.81333.61107-1.53707 1.33481-2.14814 2.14814l1.19924.90101c.5262-.70037 1.14954-1.32371 1.84991-1.84991zm-3.03582-2.403726-.00886 1.985716 1.49999.00669.00886-1.98571zm4.42448 6.419056 1.98572-.00886-.0067-1.49999-1.98571.00886zm-4.43334-4.43334c-.00345.77414-.00746 1.41813.04887 1.93398.05798.53093.18758 1.02026.51655 1.44534l1.18625-.91804c-.09017-.11652-.16839-.29389-.21166-.69014-.04492-.41134-.04363-.95503-.04002-1.76445zm4.42665 2.93335c-.80942.00361-1.3531.0049-1.76445-.04002-.39625-.04327-.57362-.12149-.69014-.21166l-.91804 1.18625c.42508.32897.91441.45857 1.44534.51655.51585.05633 1.15984.05232 1.93398.04887zm.53918 3.55395-1 1.00003 1.06066 1.0606 1-1zm.78033 2.53033v4h1.5v-4zm0-1.5858v.0858h1.5v-.0858zm0 .0858v1.5h1.5v-1.5zm-5.18074-4.13831c.08838.1142.18558.2211.29066.31976l1.02669-1.09358c-.04739-.04449-.09123-.0927-.1311-.14422zm.29066.31976c.0632.05933.12925.11569.19794.16884l.91804-1.18625c-.03099-.02399-.06078-.0494-.08929-.07616zm.09207-1.19447-.12673.13563 1.09601 1.0241.12674-.13564zm5.07834 5.04332c-.0184.0184-.0508.0375-.09038.0443-.03548.0062-.06566.0008-.08858-.0087s-.04806-.027-.0688-.0564c-.02313-.0329-.03257-.0693-.03257-.0953h1.5c0-1.19004-1.43883-1.78603-2.28033-.94453z" /></svg>
            `,
          });
          skip10RewindButton.addEventListener("click", () => {
            if (this.player_) {
              const currentTime = this.player_.currentTime();
              this.player_.currentTime(currentTime - 5);
            }
          });

          // Append Button

          el.appendChild(skip10RewindButton);
          el.appendChild(skip30RewindButton);

          el.appendChild(prevButton);
          el.appendChild(nextButton);

          el.appendChild(skip30ForwardButton);
          el.appendChild(skip10ForwardButton);

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
              children: ["progressControl", "muteToggle", "volumeControl"],
            },
            {
              name: "GroupedControlsCenter",
              children: ["playToggle"],
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
