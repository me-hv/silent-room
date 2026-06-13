"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatSeconds } from "@/lib/format";

type AudioPlayerProps = {
  src: string;
};

export function AudioPlayer({ src }: AudioPlayerProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!waveformRef.current) return;

    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      url: src,
      waveColor: "#525252",
      progressColor: "#fafafa",
      cursorColor: "#a3a3a3",
      height: 54,
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
    });

    wavesurferRef.current = wavesurfer;
    wavesurfer.on("ready", () => {
      setIsReady(true);
      setDuration(wavesurfer.getDuration());
    });
    wavesurfer.on("play", () => setIsPlaying(true));
    wavesurfer.on("pause", () => setIsPlaying(false));
    wavesurfer.on("finish", () => setIsPlaying(false));
    wavesurfer.on("timeupdate", (time) => setCurrentTime(time));

    return () => {
      wavesurfer.destroy();
      wavesurferRef.current = null;
    };
  }, [src]);

  return (
    <div className="rounded-md border border-line bg-neutral-950 p-3">
      <div ref={waveformRef} className="min-h-[54px]" />
      <div className="mt-3 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="secondary"
          className="size-9 px-0"
          onClick={() => wavesurferRef.current?.playPause()}
          disabled={!isReady}
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
        </Button>
        <p className="font-mono text-xs text-muted">
          {formatSeconds(currentTime)} / {formatSeconds(duration)}
        </p>
      </div>
    </div>
  );
}
