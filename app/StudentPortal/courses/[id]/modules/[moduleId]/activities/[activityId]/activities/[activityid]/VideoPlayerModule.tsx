"use client";
import React, { useRef, useState, useEffect } from "react";
import { useAccessibility } from "@/app/components/AccessibilityContext";
import { VideoBlockConfig } from "@/app/lib/course.types";
import { Play, Pause, Volume2, VolumeX, Maximize2, CheckCircle, Loader2 } from "lucide-react";
interface VideoPlayerModuleProps {
    config: VideoBlockConfig;
    onComplete: (points?: number) => void;
    submitting: boolean;
}
export default function VideoPlayerModule({ config, onComplete, submitting }: VideoPlayerModuleProps) {
    const { announce } = useAccessibility();
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null);
    const [playing, setPlaying] = useState(false);
    const [muted, setMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [hasWatched80Percent, setHasWatched80Percent] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, "0");
        const s = Math.floor(secs % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };
    // playback
    const togglePlay = () => {
        if (!videoRef.current) return;
        if (playing) {
            videoRef.current.pause();
            announce("Video paused.");
        } else {
            videoRef.current.play();
            announce("Video playing.");
        }
        setPlaying(!playing);
    };
    const toggleMute = () => {
        if (!videoRef.current) return;
        videoRef.current.muted = !muted;
        setMuted(!muted);
        announce(muted ? "Audio unmuted." : "Audio muted.");
    };
    const handleTimeUpdate = () => {
        const v = videoRef.current;
        if (!v) return;
        setCurrentTime(v.currentTime);
        // Unlock completion after 80% watched
        if (!hasWatched80Percent && v.duration > 0 && v.currentTime / v.duration >= 0.8) {
            setHasWatched80Percent(true);
            announce("You have watched enough of the video. You may now mark it as complete.");
        }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!config.allowPlaybackControl || !videoRef.current || duration === 0) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        videoRef.current.currentTime = ratio * duration;
        announce(`Seeked to ${formatTime(ratio * duration)}.`);
    };
    const handleFullscreen = () => {
        videoRef.current?.requestFullscreen();
        announce("Entered fullscreen mode.");
    };
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
    return (
        <div className="mt-6 space-y-4" aria-label={`Video module: ${config.title}`}>
            {/* Video Container */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-black shadow-xl aspect-video">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                        <Loader2 className="animate-spin text-white" size={36} />
                    </div>
                )}
                <video
                    ref={videoRef}
                    src={config.videoUrl}
                    className="w-full h-full object-contain"
                    aria-label={config.title}
                    onLoadedMetadata={(e) => { setDuration(e.currentTarget.duration); setIsLoading(false); }}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => { setPlaying(false); setHasWatched80Percent(true); announce("Video ended."); }}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}

                />
                {/* Big play button overlay */}
                {!playing && !isLoading && (
                    <button
                        onClick={togglePlay}
                        className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors group focus-visible:outline focus-visible:outline-3 focus-visible:outline-white"
                        aria-label="Play video"
                    >
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-transform">
                            <Play className="text-slate-900 ml-1" size={28} fill="currentColor" />
                        </div>
                    </button>
                )}
            </div>
            {/* Custom Control Bar */}
            <div
                className="flex flex-col gap-2 px-4 py-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)]"
                role="group"
                aria-label="Video playback controls"
            >
                {/* Progress Bar */}
                <div
                    ref={progressBarRef}
                    role="slider"
                    aria-label="Video progress"
                    aria-valuenow={Math.round(progressPercent)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                    tabIndex={config.allowPlaybackControl ? 0 : -1}
                    onClick={handleProgressClick}
                    onKeyDown={(e) => {
                        if (!config.allowPlaybackControl || !videoRef.current) return;
                        if (e.key === "ArrowRight") videoRef.current.currentTime = Math.min(duration, currentTime + 10);
                        if (e.key === "ArrowLeft") videoRef.current.currentTime = Math.max(0, currentTime - 10);
                    }}
                    className={`w-full h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden ${config.allowPlaybackControl ? "cursor-pointer focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color,#2563eb)]" : "cursor-not-allowed opacity-60"}`}
                >
                    <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
                {/* Controls Row */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={togglePlay}
                        className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-main)] transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color,#2563eb)]"
                        aria-label={playing ? "Pause" : "Play"}
                    >
                        {playing ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <span className="text-xs font-mono text-[var(--text-muted)] select-none" aria-hidden="true">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                    <div className="flex-1" />
                    {!config.allowPlaybackControl && (
                        <span className="text-xs text-amber-600 font-semibold px-2 py-0.5 bg-amber-100 rounded-full">
                            Seeking disabled by tutor
                        </span>
                    )}
                    <button onClick={toggleMute} className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-main)] transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color,#2563eb)]" aria-label={muted ? "Unmute" : "Mute"}>
                        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    <button onClick={handleFullscreen} className="p-2 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-main)] transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color,#2563eb)]" aria-label="Enter fullscreen">
                        <Maximize2 size={18} />
                    </button>
                </div>
            </div>
            {/* Complete Button */}
            <div className="text-center">
                {!hasWatched80Percent && (
                    <p className="text-sm text-[var(--text-muted)] mb-2">
                        Watch at least 80% of the video to unlock completion.
                    </p>
                )}
                <button
                    onClick={() => onComplete(20)}
                    disabled={!hasWatched80Percent || submitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2 focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring-color,#2563eb)]"
                    aria-label="Mark video as complete"
                    aria-disabled={!hasWatched80Percent || submitting}
                >
                    {submitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                    {submitting ? "Submitting..." : "Mark as Complete"}
                </button>
            </div>
        </div>
    );
}