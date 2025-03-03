import "./App.css";
import React from "react";
import PlayerVideoKunstomPro from "./components/pro/PlayerVideoKunstom-pro";

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
  {
    src: "https://www.youtube.com/watch?v=cc2kFJ3gc4o&ab_channel=NoiBiancocelesti",
    type: "video/youtube",
    title: "YouTube Video Test",
  },
];

function App() {
  return (
    <div className="App">
      <PlayerVideoKunstomPro videoList={videoList} />
    </div>
  );
}

export default App;
