import React, { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "./PlayerVideoCustom.css";

const PlayerVideoCustom = () => {
  //---------STATI---------
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const containerRef = useRef(null); // Wrapper per evitare conflitti con React
  const [isMounted, setIsMounted] = useState(false); // Controlla il montaggio

  //---------EFFECT---------
  useEffect(() => {
    setIsMounted(true); // Segnala che il componente è montato
  }, []);

  useEffect(() => {
    if (isMounted && videoRef.current && !playerRef.current) {
      console.log("Inizializzando Video.js");

      playerRef.current = videojs(videoRef.current, {
        controls: true,
        autoplay: false,
        preload: "auto",
        fluid: true,
        responsive: true,
        controlBar: {
          volumePanel: { inline: false }, // Sposta il controllo del volume fuori dalla barra
        },

        sources: [
          {
            src: "https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4",
            type: "video/mp4",
          },
        ],
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose(); // Elimina l'istanza di Video.js
        playerRef.current = null; // Resetta il riferimento
      }
    };
  }, [isMounted]); // L'effetto viene eseguito solo dopo che il componente è montato

  return (
    <div ref={containerRef} className="player-container">
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
