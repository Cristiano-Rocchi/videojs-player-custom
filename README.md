### ----- PLAYER VIDEO KUNSTOM (YOUTUBE VERSION) -------

[Watch the Demo Video](https://res.cloudinary.com/dytgyobxj/video/upload/youtube_ilwtv0.mp4)

**VideoPlayer inspired by the YouTube player, with the same style and features as the world's biggest player. With added graphic customizations via props and multilingual support.**

● **YouTube Style** with absolute attention to detail  
● **MINIPLAYER** activated when hovering the mouse over the video progress bar  
● Support for **MINI-VIDEO** mode and **CINEMA** mode  
● **AUTOPLAY** button for the next video  
● **NEXT** button to skip to the next video  
● Ability to **change the video quality** during playback  
● Ability to **adjust the video speed** during playback  
● Built-in **SLEEP TIMER**  
● Subtitles button for visual appearance only (Coming Soon: functional in the next version)  
● **SUPPORTED LANGUAGES**  
🇮🇹 Italian  
🇬🇧 English  
🇪🇸 Spanish  
🇩🇪 German  
🇫🇷 French  
🇵🇹 Portuguese  
🇳🇱 Dutch  
🇵🇱 Polish  
🇹🇷 Turkish  
🇦🇪 Arabic  
🇯🇵 Japanese  
🇨🇳 Chinese  
🇷🇺 Russian

**EXTRA**  
● **Customizable PROPS** (see the PROPS section below)

![Player Screenshot](https://res.cloudinary.com/dytgyobxj/image/upload/Screenshot_2025-03-15_113436_c76zcl.jpg)

| ![Image 1](https://res.cloudinary.com/dytgyobxj/image/upload/Screenshot_2025-03-15_113639_f8um0u.jpg) | ![Image 2](https://res.cloudinary.com/dytgyobxj/image/upload/Screenshot_2025-03-15_113801_ayrtee.jpg) | ![Image 3](https://res.cloudinary.com/dytgyobxj/image/upload/Screenshot_2025-03-15_113903_oxq3d6.jpg) |
| ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |

### CUSTOMIZABLE PROPS

Supports native props of video-js. (see [Video.js Documentation](https://videojs.com/)) + customizable props for more control and a unique experience.

**--SUPPORTED NATIVE PROPS--**  
**autoplay**, **loop**, **muted**, **volume**, **aspectRatio**, **controls**, **doubleClickFullscreen**

## **--EXTRA PROPS--**

-------------------------------**SIZE**-------------------------------------

- **size** (Int) – Defines the size of the player as a percentage. "**25**", "**50**", "**75**", "**100**" (default: "100"). EXAMPLE: **size={50}** // 50% size

------------------------------**WIDTH**-------------------------------------

- **width** (string) – Defines the player size in pixels, fully customizable. EXAMPLE: **width={"700px"}**
- **color** (string) – Changes the color of the player icons to any color, including HEX or RGB values. EXAMPLE: **color="red"**, **color="#ffff"**
- **darkMode** (boolean) – Dark mode experience. Changes the button color on hover. EXAMPLE: **darkMode={true}**

----------------------------**TOOLTIPS**-------------------------------------

- **tooltips** (boolean) – Removes the tooltips that appear when hovering over the icons. EXAMPLE: **tooltips={false}**

----------------------------**LANGUAGE**-----------------------------------

- **language** (string) – Supports 13 languages, modifying the texts in the player and the alerts. EXAMPLE: **language={"ita"}**  
  Supported languages: **eng (default), ita, esp, deu, fra, por, nld, pol, tur, ara, jpn, zho, rus**

---------------------------**COLOR**-------------------------------------

- **Color** (string) – Customizable icon color via props. Accepts both color names and HEX, RGB, RGBA values.  
  EXAMPLE: **color="red"**, **color="#ffff"**

----------------------------**VIDEOLIST**---------------------------------

- **videoList** (array) – You can input a list of video objects to be played. Each object must contain at least the following fields:  
  **_src:_** The link to the video (string, mandatory).  
  **_type:_** The video type (string, mandatory, e.g., "video/mp4").  
  **_title:_** The title of the video (string, optional).

  ### INSTALLATION

To use the player, simply install it in your project. You can do this via npm or yarn:

- NPM  
  **npm install player-video-kunstom-pro**
- YARN  
  **yarn add player-video-kunstom-pro**

After installation, import the player into your React project:

**import { PlayerVideoKunstomPro } from "player-video-kunstom-pro";**

And add the player in your JSX:

**<PlayerVideoKunstomPro videoList={videoList} />**

### Usage Example

After installing the package, you can use the player in your React project as follows:

### Esempio di utilizzo

Dopo aver installato il pacchetto, puoi utilizzare il player nel tuo progetto React come segue:

```javascript
import React from "react";
import { PlayerVideoKunstomPro } from "player-video-kunstom-pro";

// Definisci la lista dei video
const videoList = [
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

// Componente App che utilizza PlayerVideoKunstomPro
const App = () => {
  return (
    <div className="App">
      <PlayerVideoKunstomPro
        videoList={videoList}
        width={"1500px"}
        language={"esp"}
      />
    </div>
  );
};

export default App;
```

### Common Issues

- **The video doesn't load:** make sure you provided a valid video URL.
- **Video qualities are not visible:** check that the `quality` prop is set correctly.
- **YouTube Video:** install video-js-youtube with `npm install video-js-youtube`.
- **PROPS width + size:** When both props are applied, the `width` prop will take precedence.

### Methods and Events

- The player allows you to register custom events, such as video start, video end, or quality changes.
- You can also use methods like `play()`, `pause()`, `seek()`, and many others to integrate the player into more complex workflows.

### Useful Resources and Links

- [Video.js Documentation](https://videojs.com/)
- [React Implementation Example](https://github.com/your-repo-link)

### ---🇮🇹 **Versione Italiana**---

### ----- PLAYER VIDEO KUNSTOM (VERSIONE YOUTUBE) -------

[Guarda il Video Dimostrativo](https://res.cloudinary.com/dytgyobxj/video/upload/youtube_ilwtv0.mp4)

**VideoPlayer ispirato al player di Youtube, con lo stesso stile e le stesse funzionalità del piu grande player mondiale. Con aggiunta di personalizazioni grafiche tramite props e supporto multilingue**

● **Stile di Youtube** con precisione assoluta nei dettagli
● **MINIPLAYER** attivabile al passaggio del mouse sulla barra di avanzamento del video
● Supporto modalità **MINI-VIDEO** e modalità **CINEMA**
● Bottone **AUTOPLAY** per il video successivo.
● Bottone **NEXT**per passare al video successivo.
● Possibilità di **cambiare qualita del video** riprodotto
● Possibilità di **modificare la velocità del video** riprodotto
● **TIMER** di spospensione integrato
● Bottone sottotitoli solo per aspetto visivo(Coming Soon: funzionante alla prossima versione)
● **LINGUE SUPPORTATE**
🇮🇹 Italiano
🇬🇧 English
🇪🇸 Español
🇩🇪 Deutsch
🇫🇷 Français
🇵🇹 Português
🇳🇱 Nederlands
🇵🇱 Polski
🇹🇷 Türkçe
🇦🇪 العربية
🇯🇵 日本語
🇨🇳 中文
🇷🇺 Русский

**EXTRA**
● **PROPS personalizzabili** (vedi sotto sezione PROPS)

![Player Screenshot](https://res.cloudinary.com/dytgyobxj/image/upload/Screenshot_2025-03-15_113436_c76zcl.jpg)

| ![Image 1](https://res.cloudinary.com/dytgyobxj/image/upload/Screenshot_2025-03-15_113639_f8um0u.jpg) | ![Image 2](https://res.cloudinary.com/dytgyobxj/image/upload/Screenshot_2025-03-15_113801_ayrtee.jpg) | ![Image 3](https://res.cloudinary.com/dytgyobxj/image/upload/Screenshot_2025-03-15_113903_oxq3d6.jpg) |
| ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |

### PROPS PERSONALIZZABILI

.supporta props native di video-js.(vedi [Documentazione di Video.js](https://videojs.com/)) + props personalizzabili per un controllo maggiore e un esperienza unica.
**--PROPS NATIVE SUPPORTATE--**
**autoplay** , **loop**, **muted** ,**volume**, **aspectRatio**, **controls**, **doubleClickFullscreen**

## **--PROPS EXTRA--**

-------------------------------**SIZE**------------------------------------- -**size** (Int) – Definisce la dimensione del player in percentuale. "**25**", "**50**", "**75**", "**100**" (default: "100"). ESEMPIO: **size={50}** //dimensione 50%

- ------------------------------**WIDTH**-------------------------------------
  --**width** (string) -Definisce la dimensione del player in pixel. quindi totalmente personalizzabile. ESEMPIO: **width={"700px"}** -**color**(string) -Cambia il colore delle icone del player con qualsiasi colore anche HEX o RGB **color"red"**, **color= "#ffff"** -**darkMode** (boolean) -Esperienza DARK. Cambia il colore dei button all':hover ESEMPIO **darkMode={true}**
- ----------------------------**TOOLTIPS**----------------------------------------------- -**tooltips** (boolean) -Rimuove le tooltips che appaiona all'hover delle icone ESEMPIO **tooltips={false}**
- ----------------------------**LANGUAGE**---------------------------------------------------
  **language**(string)- Supporta 13 lingue modificando i testi nel player e gli alert ESEMPIO **language={"ita"}**
  Lingue supporte : **eng(default), ita, esp, deu, fra, por, nld, pol, tur, ara, jpn, zho ,rus**
- ---------------------------**COLOR**---------------------------------------------------
  **Color**(string) - Colore icone personalizzabili tramite props. Accettia sia il nome del colore che valori HEX, RGB, RGBA
  ESEMPIO: (color"red"), (color= "#ffff")
- ----------------------------**VIDEOLIST**---------------------------------------------------
  --**videoList** (array) – Puoi inserire una lista di oggetti video da riprodurre. Ogni oggetto deve contenere almeno i seguenti campi:
  **_src:_** Il link al video (stringa, obbligatorio).
  **_type:_** Il tipo di video (stringa, obbligatorio, es. "video/mp4").
  **_title:_** Il titolo del video (stringa, facoltativo).

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

export default App;

```javascript
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
        videoList={videoList} width={"1500px"} language={"ita"}
      />
</div>
);
};

```

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

```

```
