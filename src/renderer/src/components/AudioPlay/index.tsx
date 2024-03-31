import React, { useEffect, useRef, useState } from "react";
import "./index.module.less";

interface AudioPlayProps {
  src: string;
}

export default function AudioPlay({ src }: AudioPlayProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const changePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    // setIsPlaying(!isPlaying);
  };

  const onPlay = () => {
    setIsPlaying(true);
  };

  const onEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div styleName="audio-play" onClick={changePlay}>
      <audio
        src={src}
        controls
        ref={audioRef}
        onPlay={onPlay}
        onEnded={onEnded}
      />
      <div styleName="audio-content">
        <div styleName={`bg${isPlaying ? " voice-play" : ""}`}></div>
      </div>
    </div>
  );
}
