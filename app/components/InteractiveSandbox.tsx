"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAccessibility } from "./AccessibilityContext";

interface NodeItem {
    id: string;
    name: string;
    x: number; // grid position (0 to 10)
    y: number; // grid position (0 to 10)
    color: string;
}

export default function InteractiveSandbox() {
    const { announce } = useAccessibility();

    // Nodes starting layout configuration
    const [nodes, setNodes] = useState<NodeItem[]>([
        { id: "battery", name: "Battery Node", x: 2, y: 3, color: "#ef4444" },
        { id: "resistor", name: "Resistor Node", x: 4, y: 7, color: "#3b82f6" },
        { id: "led", name: "LED Node", x: 8, y: 2, color: "#10b981" },
    ]);

    const [grabbedNodeId, setGrabbedNodeId] = useState<string | null>(null);
    const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);

    // Track node coordinate positions before keyboard translations start
    const [originalCoordinates, setOriginalCoordinates] = useState<{ x: number; y: number } | null>(null);

    // Resolution metrics
    const gridSize = 10;
    const canvasPixelSize = 500;
    const stepRatio = canvasPixelSize / gridSize; // 50px per step

    // Select Nodes references helper
    const battery = useMemo(() => nodes.find(n => n.id === "battery")!, [nodes]);
    const resistor = useMemo(() => nodes.find(n => n.id === "resistor")!, [nodes]);
    const led = useMemo(() => nodes.find(n => n.id === "led")!, [nodes]);

    // Electrical loop matching logic:
    // Horizontally aligned, Battery (left), Resistor (middle), LED (right)
    const isCircuitComplete = useMemo(() => {
        return (
            battery.y === resistor.y &&
            resistor.y === led.y &&
            battery.x < resistor.x &&
            resistor.x < led.x
        );
    }, [battery, resistor, led]);

    // Dispatch live announcements on completion
    useEffect(() => {
        if (isCircuitComplete) {
            announce("Success! The circuit is complete. The current is flowing and the LED is illuminated.");
        }
    }, [isCircuitComplete, announce]);

    // Mouse Drag implementation
    const handlePointerDown = (e: React.PointerEvent<SVGElement>, id: string) => {
        e.preventDefault();
        setDraggedNodeId(id);
        const node = nodes.find(n => n.id === id);
        if (node) {
            setOriginalCoordinates({ x: node.x, y: node.y });
            announce(`${node.name} selected at X: ${node.x}, Y: ${node.y}. Drag to move.`);
        }
    };

    const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
        if (!draggedNodeId) return;
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();

        // Relative mouse position within coordinates
        const clientX = e.clientX - rect.left;
        const clientY = e.clientY - rect.top;

        // Map to ViewBox grid dimensions (0 to gridSize)
        let gridX = Math.round((clientX / rect.width) * gridSize);
        let gridY = Math.round((clientY / rect.height) * gridSize);

        // Bounds lock
        gridX = Math.max(0, Math.min(gridSize, gridX));
        gridY = Math.max(0, Math.min(gridSize, gridY));

        setNodes(prev =>
            prev.map(n => (n.id === draggedNodeId ? { ...n, x: gridX, y: gridY } : n))
        );
    };

    const handlePointerUp = () => {
        if (draggedNodeId) {
            const node = nodes.find(n => n.id === draggedNodeId);
            if (node) {
                announce(`${node.name} placed at coordinate X: ${node.x}, Y: ${node.y}.`);
            }
            setDraggedNodeId(null);
        }
    };

    // Keyboard Navigation Matrix implementation
    const handleKeyboardInteraction = useCallback((e: React.KeyboardEvent<HTMLButtonElement>, id: string) => {
        const activeNode = nodes.find(n => n.id === id);
        if (!activeNode) return;

        // Grabbing action toggle
        if (e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            if (grabbedNodeId === id) {
                // Drop
                setGrabbedNodeId(null);
                setOriginalCoordinates(null);
                announce(`Object placement locked at coordinate X: ${activeNode.x}, Y: ${activeNode.y}.`);
            } else {
                // Grab
                setGrabbedNodeId(id);
                setOriginalCoordinates({ x: activeNode.x, y: activeNode.y });
                announce(`${activeNode.name} selected at grid index position X: ${activeNode.x}, Y: ${activeNode.y}. Use arrows to translate, Enter to lock, Escape to cancel.`);
            }
            return;
        }

        // Controls loop active when node is grabbed
        if (grabbedNodeId === id) {
            let stepSize = 1;
            const isMicroMove = e.shiftKey;

            if (isMicroMove) {
                stepSize = 0.1; // Shift + Arrow micro-movement step
            }

            let nextX = activeNode.x;
            let nextY = activeNode.y;
            let moved = false;

            switch (e.key) {
                case "ArrowUp":
                    nextY = Math.max(0, activeNode.y - stepSize);
                    moved = true;
                    break;
                case "ArrowDown":
                    nextY = Math.min(gridSize, activeNode.y + stepSize);
                    moved = true;
                    break;
                case "ArrowLeft":
                    nextX = Math.max(0, activeNode.x - stepSize);
                    moved = true;
                    break;
                case "ArrowRight":
                    nextX = Math.min(gridSize, activeNode.x + stepSize);
                    moved = true;
                    break;
                case "Enter":
                    e.preventDefault();
                    setGrabbedNodeId(null);
                    setOriginalCoordinates(null);
                    announce(`Object placement locked at coordinate position X: ${activeNode.x.toFixed(1)}, Y: ${activeNode.y.toFixed(1)}.`);
                    break;
                case "Escape":
                    e.preventDefault();
                    if (originalCoordinates) {
                        setNodes(prev =>
                            prev.map(n => (n.id === id ? { ...n, x: originalCoordinates.x, y: originalCoordinates.y } : n))
                        );
                        announce(`Movement cancelled. ${activeNode.name} reset to original coordinate position X: ${originalCoordinates.x}, Y: ${originalCoordinates.y}.`);
                    }
                    setGrabbedNodeId(null);
                    setOriginalCoordinates(null);
                    break;
                default:
                    break;
            }

            if (moved) {
                e.preventDefault();
                // Force state updates to sync visually
                setNodes(prev =>
                    prev.map(n => (n.id === id ? { ...n, x: Number(nextX.toFixed(1)), y: Number(nextY.toFixed(1)) } : n))
                );
                announce(`Object moved to coordinate position X: ${nextX.toFixed(1)}, Y: ${nextY.toFixed(1)}.`);
            }
        }
    }, [nodes, grabbedNodeId, originalCoordinates, announce]);

    return (
        <div className="flex flex-col gap-4 border border-[var(--border-color)] bg-[var(--bg-primary)] rounded-2xl p-6 shadow-md">

            {/* Simulation instructions header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h2 className="text-lg font-bold">2D Interactive Circuit Sandbox</h2>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                        Task: Move Battery, Resistor, & LED to align on the same horizontal row (Y line) with Battery on Left, Resistor in Middle, LED on Right.
                    </p>
                </div>
                <div className="flex items-center gap-2 font-bold text-xs bg-[var(--bg-secondary)] px-3 py-1.5 rounded-full border border-[var(--border-color)]">
                    Status:{" "}
                    {isCircuitComplete ? (
                        <span className="text-[var(--success-accent)] flex items-center gap-1">
                            🟢 Circuit Working
                        </span>
                    ) : (
                        <span className="text-[var(--error-accent)] flex items-center gap-1">
                            🔴 Open Circuit
                        </span>
                    )}
                </div>
            </div>

            {/* SVG Canvas Board */}
            <div className="relative aspect-square w-full max-w-[500px] mx-auto bg-slate-950 rounded-xl overflow-hidden shadow-inner border border-slate-800">

                {/* Visual snappings grids background */}
                <svg
                    className="w-full h-full cursor-crosshair select-none"
                    viewBox="0 0 500 500"
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                >
                    <defs>
                        <pattern id="sandbox-grid" width={stepRatio} height={stepRatio} patternUnits="userSpaceOnUse">
                            <path d={`M ${stepRatio} 0 L 0 0 0 ${stepRatio}`} fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth={1} />
                        </pattern>
                    </defs>

                    {/* Grid Fill */}
                    <rect width="100%" height="100%" fill="url(#sandbox-grid)" />

                    {/* Draw Wire Connections */}
                    {/* Complete glow path vs. incomplete dotted path */}
                    <path
                        d={`M ${battery.x * stepRatio} ${battery.y * stepRatio} L ${resistor.x * stepRatio} ${resistor.y * stepRatio} L ${led.x * stepRatio} ${led.y * stepRatio} Z`}
                        fill="none"
                        stroke={isCircuitComplete ? "var(--success-accent)" : "rgba(255, 255, 255, 0.2)"}
                        strokeWidth={isCircuitComplete ? 4 : 2}
                        strokeDasharray={isCircuitComplete ? "0" : "5, 5"}
                        className={isCircuitComplete ? "animate-pulse" : ""}
                        style={{ transition: "stroke 0.3s, stroke-width 0.3s" }}
                    />

                    {/* Node Renderers */}
                    {nodes.map((node) => {
                        const isGrabbed = grabbedNodeId === node.id || draggedNodeId === node.id;
                        const cx = node.x * stepRatio;
                        const cy = node.y * stepRatio;

                        return (
                            <g
                                key={node.id}
                                transform={`translate(${cx}, ${cy})`}
                                className="cursor-grab active:cursor-grabbing"
                                onPointerDown={(e) => handlePointerDown(e, node.id)}
                            >
                                {/* Glow ring if grabbed or if circuit complete */}
                                {isGrabbed && (
                                    <circle r={24} fill="none" stroke="var(--focus-ring-color)" strokeWidth={2} strokeDasharray="3, 3" className="animate-spin" style={{ transformOrigin: "0 0", animationDuration: "12s" }} />
                                )}
                                {node.id === "led" && isCircuitComplete && (
                                    <circle r={28} fill="rgba(253, 224, 71, 0.3)" className="animate-ping" />
                                )}

                                {/* Primary Object Circle */}
                                <circle
                                    r={16}
                                    fill={node.id === "led" && isCircuitComplete ? "#fde047" : node.color}
                                    stroke={isGrabbed ? "var(--focus-ring-color)" : "#ffffff"}
                                    strokeWidth={isGrabbed ? 3 : 1.5}
                                    className="shadow-lg"
                                />

                                {/* Node labels symbols */}
                                <text y={5} textAnchor="middle" fill="#ffffff" className="text-[10px] font-extrabold select-none pointer-events-none">
                                    {node.id === "battery" ? "⚡" : node.id === "resistor" ? "Ω" : "💡"}
                                </text>

                                {/* Coordinates tags overlays */}
                                <text y={-22} textAnchor="middle" fill={isGrabbed ? "var(--focus-ring-color)" : "#94a3b8"} className="text-[9px] font-mono font-bold select-none pointer-events-none bg-slate-900 px-1 py-0.5 rounded">
                                    {node.name.split(" ")[0]} ({node.x.toFixed(1)}, {node.y.toFixed(1)})
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Visually Displayed Keyboard User Manual */}
            <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-xs space-y-1.5 text-[var(--text-main)]">
                <h3 className="font-bold uppercase tracking-wide text-[var(--text-muted)]">Keyboard Instructions</h3>
                <ul className="list-disc pl-4 space-y-1">
                    <li>Press <kbd className="font-bold bg-[var(--bg-tertiary)] px-1 rounded border border-[var(--border-color)]">Tab</kbd> to focus on elements below.</li>
                    <li>Press <kbd className="font-bold bg-[var(--bg-tertiary)] px-1 rounded border border-[var(--border-color)]">Spacebar</kbd> to grab or release a focused element.</li>
                    <li>Use <kbd className="font-bold bg-[var(--bg-tertiary)] px-1 rounded border border-[var(--border-color)]">Arrow keys</kbd> to move elements.</li>
                    <li>Hold <kbd className="font-bold bg-[var(--bg-tertiary)] px-1 rounded border border-[var(--border-color)]">Shift + Arrows</kbd> for micro-movement.</li>
                    <li>Press <kbd className="font-bold bg-[var(--bg-tertiary)] px-1 rounded border border-[var(--border-color)]">Enter</kbd> to confirm or <kbd className="font-bold bg-[var(--bg-tertiary)] px-1 rounded border border-[var(--border-color)]">Escape</kbd> to reset coordinates.</li>
                </ul>
            </div>

            {/* ======================================================== */}
            {/* PARALLEL ACCESSIBLE DOM (Offscreen mirror for Screen Readers) */}
            {/* ======================================================== */}
            <div className="sr-only">
                <h3 id="sandbox-keyboard-title">Accessible Sandbox Simulation Nodes List</h3>
                <p id="sandbox-keyboard-desc">
                    Below is a keyboard-accessible list mirroring the visual 2D simulation coordinates.
                    Select components, press Spacebar to grab, use arrow keys to navigate the grid, Enter to lock, or Escape to cancel.
                </p>
                <div role="application" aria-labelledby="sandbox-keyboard-title" aria-describedby="sandbox-keyboard-desc">
                    {nodes.map((node) => {
                        const isGrabbed = grabbedNodeId === node.id;
                        return (
                            <button
                                key={node.id}
                                id={`accessible-btn-${node.id}`}
                                role="button"
                                aria-pressed={isGrabbed}
                                aria-label={`${node.name} at coordinates grid position X ${node.x.toFixed(1)}, Y ${node.y.toFixed(1)}`}
                                onKeyDown={(e) => handleKeyboardInteraction(e, node.id)}
                                className="focus:outline-3 focus:outline-[var(--focus-ring-color)]"
                            >
                                {node.name} (Position X: {node.x.toFixed(1)}, Y: {node.y.toFixed(1)})
                                {isGrabbed ? " [Grabbed - Use Arrow Keys to move]" : " [Unselected - Press Space to select]"}
                            </button>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
