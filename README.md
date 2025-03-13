### ---🇮🇹 **Versione Italiana**---

### ----- PLAYER VIDEO KUNSTOM (VERSIONE YOUTUBE) -------

[Guarda il Video Dimostrativo](https://res.cloudinary.com/dytgyobxj/video/upload/v1741103874/Registrazione_2025-03-04_16571111111_afuwg1.mp4)
**VideoPlayer ispirato al player di Youtube, con lo stesso stile e le stesse funzionalità del piu grande player mondiale.**
● Stile di Youtube con precisione assoluta nei dettagli
● MINIPLAYER attivabile al passaggio del mouse sulla barra di avanzamento del video
● Bottone AUTOPLAY per il video successivo.
● Bottone NEXT per passare al video successivo.
● Possibilità di cambiare qualita del video riprodotto
● Possibilità di modificare la velocità del video riprodotto
● Timer di spospensione integrato
● Bottone sottotitoli solo per aspetto visivo(Coming Soon: funzionante alla prossima versione)

EXTRA
● PROPS personalizzabili (vedi sotto sezione PROPS)

![Player Screenshot](https://res.cloudinary.com/dytgyobxj/image/upload/v1677921371/Screenshot_2025-03-04_142231_xzubnx.png)

### PROPS PERSONALIZZABILI

.supporta props native di video-js.(vedi [Documentazione di Video.js](https://videojs.com/)) + props personalizzabili per un controllo maggiore e un esperienza unica.
**--PROPS NATIVE SUPPORTATE--**
**autoplay** , **loop**, **muted** ,**volume**, **aspectRatio**, **controls**, **doubleClickFullscreen**

**--PROPS EXTRA--** -**size** (Int) – Definisce la dimensione del player in percentuale. "**25**", "**50**", "**75**", "**100**" (default: "100"). ESEMPIO: **size={50}** //dimensione 50%
--**width** (string) -Definisce la dimensione del player in pixel. quindi totalmente personalizzabile. ESEMPIO: **width={"700px"}** -**color**(string) -Cambia il colore delle icone del player con qualsiasi colore anche HEX o RGB **color"red"**, **color= "#ffff"** -**darkMode** (boolean) -Esperienza DARK. Cambia il colore dei button all':hover ESEMPIO **darkMode={true}** -**title** (boolean) -Mostra il titolo del video nella barra di controllo ESEMPIO: **title={true}** -**quality** (boolean) -Nasconde l'icona settings per la qualita video ESEMPIO: **quality={false}** -**tooltips** (boolean) -Rimuove le tooltips che appaiona all'hover delle icone ESEMPIO **tooltips={false}**
--**videoList** (array) – Puoi inserire una lista di oggetti video da riprodurre. Ogni oggetto deve contenere almeno i seguenti campi:
**_src:_** Il link al video (stringa, obbligatorio).
**_type:_** Il tipo di video (stringa, obbligatorio, es. "video/mp4").
**_title:_** Il titolo del video (stringa, facoltativo).
**_qualities:_** Un array di opzioni per la qualità video (facoltativo).
-- **_(Esempio di utilizzo piu avanti)_**---

### INSTALLAZIONE

Per utilizzare il player, basta installarlo nel tuo progetto. Puoi farlo tramite npm o yarn:

- NPM
  **npm install player-video-kunstom-pro**
- YARN
  **yarn add player-video-kunstom-pro**

Dopo l'installazione, importa il player nel tuo progetto React:

**import { PlayerVideoKunstomPro } from "player-video-kunstom-pro";**

E aggiungi il player nel tuo JSX:

**<PlayerVideoKunstomPro videoList={videoList} />**

### Esempio di utilizzo

Dopo aver installato il pacchetto, puoi utilizzare il player nel tuo progetto React come segue:

import React from "react";
import { PlayerVideoKunstomPro } from "player-video-kunstom-pro";

cons videoList = [
{
src: "https://www.w3schools.com/html/mov_bbb.mp4",
type: "video/mp4",
title: "Video di Test 1",
},
{
src: "https://media.istockphoto.com/id/1697150103/it/video/guidare-sotto-la-pioggia-di-notte.mp4?s=mp4-640x640-is&k=20&c=virq68l1edFMhw55u_f15bdcx56hZQAQQ83RJBFBqzw=",
type: "video/mp4",
title: "Video di Test 2",
},
{
src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
type: "video/mp4",
title: "Video di Test 3",
qualities: [
{
label: "720p",
src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
type: "video/mp4",
},
{
label: "360p",
src: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4",
type: "video/mp4",
},
],
},
];

const App = () => {
return (

<div className="App">
<PlayerVideoKunstomPro
        videoList={videoList}
        autoplay={true}
        size="50"
        color="black"
      />
</div>
);
};

export default App;

### Problemi comuni

- **Il video non si carica:** assicurati di aver fornito un URL valido per il video.
- **Le qualità video non sono visibili:** controlla che la prop `quality` sia impostata correttamente.
- **Video Youtube**: install video-js-youtube con npm install video-js-youtube
- **PROPS width + size**: Applicando entrambe le props prevarrà la width
-

### Metodi e Eventi

- Il player offre la possibilità di registrare eventi personalizzati, come l'inizio della riproduzione, la fine del video, o cambiamenti di qualità.
- Puoi anche utilizzare i metodi play(), pause(), seek() e molti altri per integrare il player in flussi di lavoro complessi.

### Risorse e Link Utili

- [Documentazione di Video.js](https://videojs.com/)
- [Esempio di implementazione in React](https://github.com/your-repo-link)
-
