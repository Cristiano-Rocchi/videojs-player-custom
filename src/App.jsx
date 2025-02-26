import "./App.css";
import React from "react";
import PlayerVideoCustom from "./components/PlayerVideoCustom";
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
];

function App() {
  return (
    <div className="App">
      <PlayerVideoCustom videoList={videoList} />
    </div>
  );
}

export default App;
