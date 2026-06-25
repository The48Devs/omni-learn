"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useAccessibility } from "./AccessibilityContext";
import {
    Check,
    X,
    RefreshCw,
    ZoomIn,
    ZoomOut,
    Home,
    AlertCircle,
    Sparkles,
    Trash2,
    HelpCircle
} from "lucide-react";

interface Connection {
    from: string;
    fromTerminal: string;
    to: string;
    toTerminal: string;
}

interface SandboxProps {
    config?: {
        sandboxComponents?: string[];
        savedSimulationSetup?: {
            connections: Connection[];
            positions?: Record<string, { x: number; y: number }>;
            targetStates?: Record<string, string>;
        };
        labNotes?: string;
    };
    onComplete?: (points: number) => void;
}

export default function InteractiveSandbox({ config, onComplete }: SandboxProps) {
    const { announce, theme } = useAccessibility();

    // Load active components list defined by the tutor
    const sandboxComponents = useMemo(() => {
        return config?.sandboxComponents || ["Battery", "LED", "Switch"];
    }, [config]);

    // Tutor master rules schemas
    const tutorConnections = useMemo(() => {
        return config?.savedSimulationSetup?.connections || [];
    }, [config]);

    const tutorPositions = useMemo(() => {
        return config?.savedSimulationSetup?.positions || {};
    }, [config]);

    // Student Interaction States
    const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
    const [connections, setConnections] = useState<Connection[]>([]);
    const [selectedSourceNode, setSelectedSourceNode] = useState<{ component: string; terminal: string } | null>(null);
    const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [draggingComponent, setDraggingComponent] = useState<string | null>(null);

    // Viewport transform matrices
    const [zoomScale, setZoomScale] = useState<number>(1.0);
    const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState<boolean>(false);
    const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    // Keyboard accessibility state
    const [grabbedNodeId, setGrabbedNodeId] = useState<string | null>(null);
    const [originalCoordinates, setOriginalCoordinates] = useState<{ x: number; y: number } | null>(null);

    // Accessibility Keyboard Routing state
    const [kbFromComponent, setKbFromComponent] = useState<string>("");
    const [kbFromTerminal, setKbFromTerminal] = useState<string>("");
    const [kbToComponent, setKbToComponent] = useState<string>("");
    const [kbToTerminal, setKbToTerminal] = useState<string>("");

    // Evaluation State
    const [isValidated, setIsValidated] = useState<boolean>(false);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [showErrors, setShowErrors] = useState<boolean>(false);

    const canvasRef = useRef<HTMLDivElement>(null);

    // Initialize/reset workspace positions on configuration change
    useEffect(() => {
        const initialPositions: Record<string, { x: number; y: number }> = {};
        sandboxComponents.forEach((comp, idx) => {
            // Stack components on the left side of the board to make students drag them into target bounds
            initialPositions[comp] = {
                x: 60,
                y: 80 + idx * 110
            };
        });
        setPositions(initialPositions);
        setConnections([]);
        setIsValidated(false);
        setValidationErrors([]);
        setShowErrors(false);
    }, [config, sandboxComponents]);

    // Live mouse position tracker on the canvas (compensated for scale & pan values)
    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!canvasRef.current || !selectedSourceNode) return;
            const rect = canvasRef.current.getBoundingClientRect();
            setMousePos({
                x: (e.clientX - rect.left - panOffset.x) / zoomScale,
                y: (e.clientY - rect.top - panOffset.y) / zoomScale
            });
        };
        window.addEventListener("mousemove", handleGlobalMouseMove);
        return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
    }, [selectedSourceNode, zoomScale, panOffset]);

    // Pointer-up safety tracker
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            setDraggingComponent(null);
            setIsPanning(false);
        };
        window.addEventListener("mouseup", handleGlobalMouseUp);
        return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
    }, []);

    // Zoom & pan utility functions
    const zoomIn = () => setZoomScale(prev => Math.min(2.0, prev + 0.15));
    const zoomOut = () => setZoomScale(prev => Math.max(0.5, prev - 0.15));
    const resetCamera = () => {
        setZoomScale(1.0);
        setPanOffset({ x: 0, y: 0 });
        announce("Camera viewpoint reset.");
    };

    const panViewport = (dir: "up" | "down" | "left" | "right") => {
        const amt = 80;
        setPanOffset(prev => {
            switch (dir) {
                case "up": return { ...prev, y: prev.y + amt };
                case "down": return { ...prev, y: prev.y - amt };
                case "left": return { ...prev, x: prev.x + amt };
                case "right": return { ...prev, x: prev.x - amt };
            }
        });
    };

    // Calculate canvas anchor pins offset inside component coordinate space
    const getTerminalCoords = (compName: string, terminal: string) => {
        const pos = positions[compName] || { x: 150, y: 150 };
        // Component Card is w-[6.25rem] (100px) by h-[4.375rem] (70px)
        let offset = { x: 15, y: 35 };
        if (terminal === "positive" || terminal === "terminal-2") {
            offset = { x: 85, y: 35 };
        }
        return { x: pos.x + offset.x, y: pos.y + offset.y };
    };

    // Mouse pointer dragging handler
    const handleCanvasMouseMove = (e: React.MouseEvent) => {
        if (!canvasRef.current) return;

        if (draggingComponent) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = Math.max(10, Math.min(1800, (e.clientX - rect.left - panOffset.x) / zoomScale - 50));
            const y = Math.max(10, Math.min(1800, (e.clientY - rect.top - panOffset.y) / zoomScale - 35));

            setPositions(prev => ({ ...prev, [draggingComponent]: { x, y } }));
            setIsValidated(false); // Reset completion status on canvas updates
        } else if (isPanning) {
            setPanOffset({
                x: e.clientX - panStart.x,
                y: e.clientY - panStart.y
            });
        }
    };

    const handleCanvasMouseDown = (e: React.MouseEvent) => {
        if (e.button === 1 || e.shiftKey) {
            setIsPanning(true);
            setPanStart({
                x: e.clientX - panOffset.x,
                y: e.clientY - panOffset.y
            });
        }
    };

    // Pointer-based wiring click handlers
    const handleTerminalClick = (componentName: string, terminalName: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setIsValidated(false);

        if (selectedSourceNode === null) {
            setSelectedSourceNode({ component: componentName, terminal: terminalName });
            announce(`Selected ${terminalName === "positive" || terminalName === "terminal-2" ? "positive" : "negative"} terminal on ${componentName}. Select target pin.`);
        } else {
            if (selectedSourceNode.component === componentName) {
                // Toggle cancel if same component is clicked
                setSelectedSourceNode(null);
                return;
            }

            const newConn: Connection = {
                from: selectedSourceNode.component,
                fromTerminal: selectedSourceNode.terminal,
                to: componentName,
                toTerminal: terminalName
            };

            const exists = connections.some(conn =>
                (conn.from === newConn.from && conn.fromTerminal === newConn.fromTerminal && conn.to === newConn.to && conn.toTerminal === newConn.toTerminal) ||
                (conn.from === newConn.to && conn.fromTerminal === newConn.toTerminal && conn.to === newConn.from && conn.toTerminal === newConn.fromTerminal)
            );

            if (!exists) {
                setConnections(prev => [...prev, newConn]);
                announce(`Connected wire between ${selectedSourceNode.component} and ${componentName}.`);
            }
            setSelectedSourceNode(null);
        }
    };

    const handleRemoveConnection = (idx: number) => {
        setConnections(prev => prev.filter((_, i) => i !== idx));
        setIsValidated(false);
        announce("Wire removed.");
    };

    // Keyboard-only card movement
    const handleComponentKeyboard = (e: React.KeyboardEvent, compName: string) => {
        if (e.key === " " || e.key === "Spacebar") {
            e.preventDefault();
            if (grabbedNodeId === compName) {
                setGrabbedNodeId(null);
                setOriginalCoordinates(null);
                announce(`Component ${compName} locked at coordinate position X ${Math.round(positions[compName].x)}, Y ${Math.round(positions[compName].y)}.`);
            } else {
                setGrabbedNodeId(compName);
                setOriginalCoordinates({ ...positions[compName] });
                announce(`${compName} selected. Use arrow keys to navigate workspace, Spacebar to drop, Escape to revert.`);
            }
            return;
        }

        if (grabbedNodeId === compName) {
            const step = e.shiftKey ? 5 : 25;
            let moved = false;
            let nextX = positions[compName].x;
            let nextY = positions[compName].y;

            switch (e.key) {
                case "ArrowUp":
                    nextY = Math.max(10, positions[compName].y - step);
                    moved = true;
                    break;
                case "ArrowDown":
                    nextY = Math.min(1800, positions[compName].y + step);
                    moved = true;
                    break;
                case "ArrowLeft":
                    nextX = Math.max(10, positions[compName].x - step);
                    moved = true;
                    break;
                case "ArrowRight":
                    nextX = Math.min(1800, positions[compName].x + step);
                    moved = true;
                    break;
                case "Enter":
                    e.preventDefault();
                    setGrabbedNodeId(null);
                    setOriginalCoordinates(null);
                    announce(`Component ${compName} locked at coordinate position X ${Math.round(positions[compName].x)}, Y ${Math.round(positions[compName].y)}.`);
                    break;
                case "Escape":
                    e.preventDefault();
                    if (originalCoordinates) {
                        setPositions(prev => ({ ...prev, [compName]: originalCoordinates }));
                        announce("Movement canceled. Component returned to original position.");
                    }
                    setGrabbedNodeId(null);
                    setOriginalCoordinates(null);
                    break;
                default:
                    break;
            }

            if (moved) {
                e.preventDefault();
                setPositions(prev => ({
                    ...prev,
                    [compName]: { x: nextX, y: nextY }
                }));
                setIsValidated(false);
                announce(`Moved ${compName} to X: ${Math.round(nextX)}, Y: ${Math.round(nextY)}.`);
            }
        }
    };

    // Keyboard-only Wire Routing dropdown connector
    const handleConnectKb = () => {
        if (!kbFromComponent || !kbFromTerminal || !kbToComponent || !kbToTerminal) return;

        const newConn: Connection = {
            from: kbFromComponent,
            fromTerminal: kbFromTerminal,
            to: kbToComponent,
            toTerminal: kbToTerminal
        };

        const exists = connections.some(conn =>
            (conn.from === newConn.from && conn.fromTerminal === newConn.fromTerminal && conn.to === newConn.to && conn.toTerminal === newConn.toTerminal) ||
            (conn.from === newConn.to && conn.fromTerminal === newConn.toTerminal && conn.to === newConn.from && conn.toTerminal === newConn.fromTerminal)
        );

        if (!exists) {
            setConnections(prev => [...prev, newConn]);
            announce(`Wire connected between ${kbFromComponent} and ${kbToComponent} via Keyboard Panel.`);
        } else {
            announce(`Wire connection already exists.`);
        }

        setKbFromComponent("");
        setKbFromTerminal("");
        setKbToComponent("");
        setKbToTerminal("");
        setIsValidated(false);
    };

    const handleReset = () => {
        const initialPositions: Record<string, { x: number; y: number }> = {};
        sandboxComponents.forEach((comp, idx) => {
            initialPositions[comp] = {
                x: 60,
                y: 80 + idx * 110
            };
        });
        setPositions(initialPositions);
        setConnections([]);
        setIsValidated(false);
        setValidationErrors([]);
        setShowErrors(false);
        announce("Workspace reset. Components returned to default setup coordinates.");
    };

    // Circuit Validator Engine
    const handleVerify = () => {
        const errors: string[] = [];

        // 1. Verify component placement coordinates (±65px grid tolerance area)
        sandboxComponents.forEach((comp) => {
            const studentPos = positions[comp];
            const targetPos = tutorPositions[comp];
            if (studentPos && targetPos) {
                const distance = Math.sqrt(
                    Math.pow(studentPos.x - targetPos.x, 2) +
                    Math.pow(studentPos.y - targetPos.y, 2)
                );
                if (distance > 65) {
                    errors.push(`Move the ${comp} to its designated target outline box.`);
                }
            } else if (targetPos) {
                errors.push(`Ensure ${comp} is positioned on the canvas.`);
            }
        });

        // 2. Validate structural terminal-to-terminal wiring map (bidirectional checking)
        tutorConnections.forEach((tutorConn) => {
            const isWired = connections.some((studentConn) => {
                return (
                    (studentConn.from === tutorConn.from &&
                        studentConn.fromTerminal === tutorConn.fromTerminal &&
                        studentConn.to === tutorConn.to &&
                        studentConn.toTerminal === tutorConn.toTerminal) ||
                    (studentConn.from === tutorConn.to &&
                        studentConn.fromTerminal === tutorConn.toTerminal &&
                        studentConn.to === tutorConn.from &&
                        studentConn.toTerminal === tutorConn.fromTerminal)
                );
            });

            if (!isWired) {
                const termFormat = (comp: string, term: string) => {
                    if (comp === "Battery") {
                        return term === "positive" ? "positive (+)" : "negative (-)";
                    }
                    return term === "terminal-1" ? "terminal 1" : "terminal 2";
                };
                errors.push(
                    `Missing Wire: Connect ${tutorConn.from} (${termFormat(tutorConn.from, tutorConn.fromTerminal)}) to ${tutorConn.to} (${termFormat(tutorConn.to, tutorConn.toTerminal)}).`
                );
            }
        });

        setValidationErrors(errors);

        if (errors.length === 0) {
            setIsValidated(true);
            announce("Success! Circuit complete. Correct connections established, current is flowing.");
        } else {
            setIsValidated(false);
            announce(`Verification failed. ${errors.length} rules remaining: ${errors.join(" ")}`);
        }
    };

    return (
        <div className="flex flex-col gap-[1rem] border border-[var(--border-color,#E5E7EB)] bg-[var(--bg-primary,#FFFFFF)] rounded-2xl p-[1.5rem] shadow-sm">

            {/* Simulation Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-[0.75rem]">
                <div>
                    <h2 className="text-[1.1rem] font-extrabold text-[var(--text-main,#041A3E)] uppercase tracking-wide">
                        2D Interactive Circuit Sandbox (Student View)
                    </h2>
                    <p className="text-[0.75rem] text-[var(--text-muted,#6B7280)] mt-[0.25rem]">
                        Drag the components into their designated targets and draw wire connections between the terminal pins.
                    </p>
                </div>
                <div className="flex items-center gap-[0.5rem] font-bold text-[0.75rem] bg-[var(--bg-secondary,#F3F4F6)] px-[0.75rem] py-[0.35rem] rounded-full border border-[var(--border-color,#E5E7EB)] shrink-0 select-none">
                    Circuit Status:{" "}
                    {isValidated ? (
                        <span className="text-[var(--success-accent,#10B981)] flex items-center gap-[0.25rem]">
                            🟢 Working & Complete
                        </span>
                    ) : (
                        <span className="text-[var(--error-accent,#EF4444)] flex items-center gap-[0.25rem]">
                            🔴 Incomplete Circuit
                        </span>
                    )}
                </div>
            </div>

            {/* Lab Notes Configuration Block */}
            {config?.labNotes && (
                <div className="p-[1rem] bg-indigo-50/10 border border-indigo-500/20 rounded-xl space-y-[0.25rem]">
                    <h3 className="text-[0.8rem] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-[0.25rem]">
                        <span>🔬</span> Lab Instructor Notes
                    </h3>
                    <p className="text-[0.78rem] text-[var(--text-main,#041A3E)] font-mono leading-relaxed whitespace-pre-line">
                        {config.labNotes}
                    </p>
                </div>
            )}

            {/* Visual Infinite Grid Canvas Board */}
            <div
                ref={canvasRef}
                onMouseMove={handleCanvasMouseMove}
                onMouseDown={handleCanvasMouseDown}
                className="relative w-full rounded-2xl bg-[#0B1329] overflow-hidden border border-slate-800 shadow-inner select-none cursor-default"
                style={{
                    height: "22rem",
                    backgroundImage: "radial-gradient(#1e293b 1.5px, transparent 0)",
                    backgroundSize: "16px 16px"
                }}
            >
                {/* Viewport Transform Layer */}
                <div
                    style={{
                        transform: `translate(${panOffset.x / 16}rem, ${panOffset.y / 16}rem) scale(${zoomScale})`,
                        transformOrigin: "0 0",
                        width: "125rem",
                        height: "125rem",
                        position: "absolute"
                    }}
                >
                    {/* Faded outlines indicating component target locations */}
                    {Object.entries(tutorPositions).map(([compName, targetPos]: [string, any]) => (
                        <div
                            key={`target-${compName}`}
                            style={{
                                width: "6.25rem",
                                height: "4.375rem",
                                left: `${targetPos.x / 16}rem`,
                                top: `${targetPos.y / 16}rem`,
                            }}
                            className="absolute border-2 border-dashed border-slate-700/50 rounded-xl flex flex-col justify-center items-center text-center text-slate-500 text-[0.65rem] font-bold pointer-events-none select-none z-0 bg-slate-900/10"
                        >
                            <span className="opacity-40 uppercase tracking-widest text-[0.55rem]">Place Here</span>
                            <span className="opacity-60">{compName}</span>
                        </div>
                    ))}

                    {/* SVG Wire Layout Connections */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                        <style>{`
                            @keyframes currentFlow {
                                to { stroke-dashoffset: -20px; }
                            }
                            .wire-active {
                                stroke-dasharray: 8px, 6px;
                                animation: currentFlow 1.2s linear infinite;
                            }
                        `}</style>

                        {/* Render placed wires */}
                        {connections.map((conn, idx) => {
                            const fromPt = getTerminalCoords(conn.from, conn.fromTerminal);
                            const toPt = getTerminalCoords(conn.to, conn.toTerminal);
                            const dx = toPt.x - fromPt.x;
                            const dy = toPt.y - fromPt.y;

                            const pathD = `M ${fromPt.x} ${fromPt.y} C ${fromPt.x + dx * 0.25} ${fromPt.y + dy * 0.8}, ${fromPt.x + dx * 0.75} ${fromPt.y - dy * 0.2}, ${toPt.x} ${toPt.y}`;
                            return (
                                <g key={idx}>
                                    <path
                                        d={pathD}
                                        fill="none"
                                        stroke={isValidated ? "#10b981" : "#ef4444"}
                                        strokeWidth="3.5"
                                        strokeLinecap="round"
                                        className={isValidated ? "wire-active" : "opacity-80"}
                                        style={{ transition: "stroke 0.3s" }}
                                    />
                                    {/* Middle point connector removal handle */}
                                    <circle
                                        cx={fromPt.x + dx * 0.5}
                                        cy={fromPt.y + dy * 0.5}
                                        r="12"
                                        fill="#ef4444"
                                        className="cursor-pointer opacity-0 hover:opacity-100 transition-opacity pointer-events-auto shadow-md"
                                        onClick={() => handleRemoveConnection(idx)}
                                    >
                                        <title>Click to remove wire connection</title>
                                    </circle>
                                    <text
                                        x={fromPt.x + dx * 0.5}
                                        y={fromPt.y + dy * 0.5 + 4}
                                        textAnchor="middle"
                                        fill="#ffffff"
                                        className="text-[10px] font-extrabold cursor-pointer opacity-0 hover:opacity-100 pointer-events-none"
                                    >
                                        ✕
                                    </text>
                                </g>
                            );
                        })}

                        {/* Interactive Dragging Connection Wire Preview */}
                        {selectedSourceNode && (
                            (() => {
                                const fromPt = getTerminalCoords(selectedSourceNode.component, selectedSourceNode.terminal);
                                const dx = mousePos.x - fromPt.x;
                                const dy = mousePos.y - fromPt.y;
                                const pathD = `M ${fromPt.x} ${fromPt.y} C ${fromPt.x + dx * 0.25} ${fromPt.y + dy * 0.8}, ${fromPt.x + dx * 0.75} ${fromPt.y - dy * 0.2}, ${mousePos.x} ${mousePos.y}`;
                                return (
                                    <path
                                        d={pathD}
                                        fill="none"
                                        stroke="#38bdf8"
                                        strokeWidth="3"
                                        strokeDasharray="4 4"
                                        className="animate-pulse"
                                    />
                                );
                            })()
                        )}
                    </svg>

                    {/* Render components as absolute-positioned card divs */}
                    {sandboxComponents.map((comp, idx) => {
                        const pos = positions[comp] || { x: 50 + idx * 110, y: 80 };
                        const isGrabbed = grabbedNodeId === comp;
                        const isDragging = draggingComponent === comp;
                        const isLedTest = comp === "LED" && isValidated;

                        return (
                            <div
                                key={comp}
                                tabIndex={0}
                                onKeyDown={(e) => handleComponentKeyboard(e, comp)}
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    setDraggingComponent(comp);
                                    setGrabbedNodeId(null);
                                }}
                                style={{
                                    width: "6.25rem",
                                    height: "4.375rem",
                                    left: `${pos.x / 16}rem`,
                                    top: `${pos.y / 16}rem`,
                                    transform: isGrabbed ? "scale(1.05)" : "none",
                                }}
                                className={`absolute rounded-xl flex flex-col justify-between p-[0.4rem] border shadow-md select-none transition-all duration-150 z-20 focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)] focus-visible:outline-offset-2 ${theme === "high-contrast"
                                        ? isGrabbed || isDragging
                                            ? "bg-black border-4 border-yellow-300 text-yellow-300 shadow-[0_0_15px_#fde047]"
                                            : "bg-black border-4 border-yellow-400 text-yellow-400"
                                        : isLedTest
                                            ? "bg-yellow-950/80 border-yellow-400 text-yellow-200 shadow-[0_0_20px_rgba(253,224,71,0.5)] animate-pulse"
                                            : isGrabbed || isDragging
                                                ? "bg-slate-800 border-sky-400 text-sky-300 scale-105 cursor-grabbing"
                                                : "bg-slate-900 border-slate-700 text-slate-100 cursor-grab hover:border-slate-500"
                                    }`}
                                aria-label={`${comp}. Location Coordinates: X ${Math.round(pos.x)}, Y ${Math.round(pos.y)}.${isGrabbed ? " Grabbed. Move using Arrow keys." : " Press Spacebar to select."}`}
                            >
                                <div className="flex justify-between items-center text-[0.65rem] border-b border-slate-700/60 pb-[0.2rem] select-none">
                                    <span className="font-bold truncate w-[80%] flex items-center gap-[0.2rem]">
                                        {comp === "LED" && isLedTest ? "💡" : "⚡"} {comp}
                                    </span>
                                </div>

                                {/* Dual-Indicator Terminal connectors */}
                                <div className="flex justify-between px-[0.1rem] pb-[0.2rem]">
                                    <button
                                        type="button"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={(e) => handleTerminalClick(comp, comp === "Battery" ? "negative" : "terminal-1", e)}
                                        className={`w-[0.875rem] h-[0.875rem] rounded-full border flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${selectedSourceNode?.component === comp &&
                                                (selectedSourceNode.terminal === "negative" || selectedSourceNode.terminal === "terminal-1")
                                                ? "bg-sky-400 border-white scale-115 ring-2 ring-sky-500/65"
                                                : comp === "Battery"
                                                    ? "bg-amber-400 border-amber-600 hover:bg-amber-300 text-[0.55rem] text-black font-extrabold"
                                                    : "bg-slate-600 border-slate-800 hover:bg-slate-500 text-[0.55rem] text-white"
                                            }`}
                                        title={comp === "Battery" ? "Negative (-)" : "Terminal 1"}
                                        aria-label={`${comp === "Battery" ? "Negative" : "Terminal 1"} pin`}
                                    >
                                        <span className="select-none pointer-events-none">
                                            {comp === "Battery" ? "-" : "1"}
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onMouseDown={(e) => e.stopPropagation()}
                                        onClick={(e) => handleTerminalClick(comp, comp === "Battery" ? "positive" : "terminal-2", e)}
                                        className={`w-[0.875rem] h-[0.875rem] rounded-full border flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${selectedSourceNode?.component === comp &&
                                                (selectedSourceNode.terminal === "positive" || selectedSourceNode.terminal === "terminal-2")
                                                ? "bg-sky-400 border-white scale-115 ring-2 ring-sky-500/65"
                                                : comp === "Battery"
                                                    ? "bg-red-500 border-red-700 hover:bg-red-400 text-[0.55rem] text-white font-extrabold"
                                                    : "bg-slate-600 border-slate-800 hover:bg-slate-500 text-[0.55rem] text-white"
                                            }`}
                                        title={comp === "Battery" ? "Positive (+)" : "Terminal 2"}
                                        aria-label={`${comp === "Battery" ? "Positive" : "Terminal 2"} pin`}
                                    >
                                        <span className="select-none pointer-events-none">
                                            {comp === "Battery" ? "+" : "2"}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Viewport Zoom Control Buttons Overlay */}
                <div className="absolute bottom-[0.5rem] right-[0.5rem] bg-[#0b1329]/95 border border-slate-700/60 rounded-xl p-[0.4rem] flex items-center gap-[0.4rem] z-30 shadow-md">
                    <button
                        type="button"
                        onClick={zoomIn}
                        style={{ width: "1.6rem", height: "1.6rem" }}
                        className="rounded bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400"
                        title="Zoom In"
                    >
                        <ZoomIn size={12} />
                    </button>
                    <span className="text-[0.65rem] font-bold text-slate-300 w-[2.2rem] text-center">
                        {Math.round(zoomScale * 100)}%
                    </span>
                    <button
                        type="button"
                        onClick={zoomOut}
                        style={{ width: "1.6rem", height: "1.6rem" }}
                        className="rounded bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400"
                        title="Zoom Out"
                    >
                        <ZoomOut size={12} />
                    </button>
                    <button
                        type="button"
                        onClick={resetCamera}
                        style={{ width: "1.6rem", height: "1.6rem" }}
                        className="rounded bg-slate-800 text-white text-[0.6rem] font-bold hover:bg-slate-700 flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400"
                        title="Reset Viewport Position"
                    >
                        <Home size={12} />
                    </button>
                </div>

                {/* Grid Camera Panning Presets */}
                <div className="absolute top-[0.5rem] right-[0.5rem] bg-[#0b1329]/95 border border-slate-700/60 rounded-xl p-[0.35rem] grid grid-cols-3 gap-[0.15rem] z-30 shadow-md select-none">
                    <div></div>
                    <button type="button" onClick={() => panViewport("up")} style={{ width: "1.2rem", height: "1.2rem" }} className="bg-slate-800 text-white text-[0.55rem] rounded hover:bg-slate-700 flex items-center justify-center focus-visible:ring-1 focus-visible:ring-sky-400" aria-label="Pan Up">▲</button>
                    <div></div>
                    <button type="button" onClick={() => panViewport("left")} style={{ width: "1.2rem", height: "1.2rem" }} className="bg-slate-800 text-white text-[0.55rem] rounded hover:bg-slate-700 flex items-center justify-center focus-visible:ring-1 focus-visible:ring-sky-400" aria-label="Pan Left">◀</button>
                    <div></div>
                    <button type="button" onClick={() => panViewport("right")} style={{ width: "1.2rem", height: "1.2rem" }} className="bg-slate-800 text-white text-[0.55rem] rounded hover:bg-slate-700 flex items-center justify-center focus-visible:ring-1 focus-visible:ring-sky-400" aria-label="Pan Right">▶</button>
                    <div></div>
                    <button type="button" onClick={() => panViewport("down")} style={{ width: "1.2rem", height: "1.2rem" }} className="bg-slate-800 text-white text-[0.55rem] rounded hover:bg-slate-700 flex items-center justify-center focus-visible:ring-1 focus-visible:ring-sky-400" aria-label="Pan Down">▼</button>
                    <div></div>
                </div>
            </div>

            {/* Checklist Validation Report */}
            <div className="p-[1rem] bg-[var(--bg-secondary,#F3F4F6)] border border-[var(--border-color,#E5E7EB)] rounded-xl space-y-[0.75rem]">
                <div className="flex items-center justify-between">
                    <h4 className="font-bold text-[0.85rem] text-[var(--text-main,#041A3E)]">
                        Circuit Verification Status
                    </h4>
                    <span className={`px-[0.5rem] py-[0.1rem] rounded-full text-[0.7rem] font-bold ${isValidated
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            : "bg-amber-100 text-amber-800 border border-amber-300"
                        }`}>
                        {isValidated ? "Verified & Complete" : "Pending Verification"}
                    </span>
                </div>

                {!isValidated && showErrors && validationErrors.length > 0 && (
                    <div className="p-[0.75rem] bg-red-500/10 border border-red-500/20 rounded-lg text-[0.75rem] text-red-600 dark:text-red-400 space-y-[0.25rem]">
                        <p className="font-bold flex items-center gap-[0.35rem]">
                            <AlertCircle size={14} className="text-red-500" />
                            Please resolve the following issues to complete the circuit:
                        </p>
                        <ul className="list-disc pl-[1rem] space-y-[0.15rem]">
                            {validationErrors.map((err, idx) => (
                                <li key={idx}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {isValidated && (
                    <div className="p-[0.75rem] bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[0.75rem] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-[0.5rem]">
                        <Check className="text-emerald-500 animate-bounce" size={16} />
                        <span>Success! The circuit wiring and component positions match the tutor's rules. Current is flowing.</span>
                    </div>
                )}

                <div className="flex gap-[0.5rem]">
                    <button
                        type="button"
                        onClick={() => {
                            setShowErrors(true);
                            handleVerify();
                        }}
                        className="px-[1rem] py-[0.5rem] bg-[#FF6B35] hover:opacity-90 text-white text-[0.75rem] font-bold rounded-lg transition-colors focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)]"
                    >
                        Verify Circuit Setup
                    </button>

                    <button
                        type="button"
                        onClick={handleReset}
                        className="px-[1rem] py-[0.5rem] border border-[var(--border-color,#E5E7EB)] hover:bg-[var(--bg-secondary,#F3F4F6)] text-[var(--text-main,#041A3E)] text-[0.75rem] font-bold rounded-lg transition-colors flex items-center gap-[0.25rem] focus-visible:outline focus-visible:outline-3 focus-visible:outline-[var(--focus-ring,#FF6B35)]"
                    >
                        <RefreshCw size={12} /> Reset Canvas
                    </button>
                </div>
            </div>

            {/* List of plottings (with click to delete for mouse users) */}
            {connections.length > 0 && (
                <div className="p-[1rem] bg-[var(--bg-secondary,#F3F4F6)] border border-[var(--border-color,#E5E7EB)] rounded-xl space-y-[0.5rem]">
                    <h4 className="font-bold text-[0.8rem] text-[var(--text-muted,#6B7280)] uppercase tracking-wider">
                        Active Wire Connections ({connections.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[0.5rem]">
                        {connections.map((conn, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-[var(--bg-primary,#FFFFFF)] p-[0.4rem] px-[0.75rem] rounded-lg border border-[var(--border-color,#E5E7EB)] text-[0.75rem]">
                                <span className="font-semibold text-[var(--text-main,#041A3E)]">
                                    🔌 {conn.from} ({conn.fromTerminal}) ⚡ {conn.to} ({conn.toTerminal})
                                </span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveConnection(idx)}
                                    className="text-[var(--error-accent,#EF4444)] font-bold hover:opacity-80 flex items-center gap-[0.1rem] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring,#FF6B35)]"
                                    aria-label={`Remove wire between ${conn.from} and ${conn.to}`}
                                >
                                    <Trash2 size={12} /> Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Keyboard Wire Routing Helper Panel (W3C/WCAG AA keyboard wiring compliance) */}
            <div className="p-[1rem] bg-[var(--bg-secondary,#F3F4F6)] border border-[var(--border-color,#E5E7EB)] rounded-xl space-y-[0.75rem]">
                <h4 className="font-bold text-[0.8rem] text-[var(--text-muted,#6B7280)] uppercase tracking-wider">
                    Keyboard Wire Routing Assistant
                </h4>
                <div className="flex flex-wrap gap-[0.75rem] items-end text-[0.75rem]">
                    <div className="space-y-[0.25rem]">
                        <label htmlFor="kb-from-select" className="block font-medium text-[var(--text-muted,#6B7280)]">From Component:</label>
                        <select
                            id="kb-from-select"
                            value={kbFromComponent}
                            onChange={(e) => {
                                setKbFromComponent(e.target.value);
                                setKbFromTerminal("");
                            }}
                            className="bg-[var(--bg-primary,#FFFFFF)] border border-[var(--border-color,#E5E7EB)] text-[var(--text-main,#041A3E)] rounded p-[0.4rem] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                        >
                            <option value="">-- Choose Component --</option>
                            {sandboxComponents.map(comp => (
                                <option key={comp} value={comp}>{comp}</option>
                            ))}
                        </select>
                    </div>

                    {kbFromComponent && (
                        <div className="space-y-[0.25rem]">
                            <label htmlFor="kb-from-term" className="block font-medium text-[var(--text-muted,#6B7280)]">Terminal Port:</label>
                            <select
                                id="kb-from-term"
                                value={kbFromTerminal}
                                onChange={(e) => setKbFromTerminal(e.target.value)}
                                className="bg-[var(--bg-primary,#FFFFFF)] border border-[var(--border-color,#E5E7EB)] text-[var(--text-main,#041A3E)] rounded p-[0.4rem] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                            >
                                <option value="">-- Choose Pin --</option>
                                <option value={kbFromComponent === "Battery" ? "negative" : "terminal-1"}>
                                    {kbFromComponent === "Battery" ? "Negative (-)" : "Terminal 1"}
                                </option>
                                <option value={kbFromComponent === "Battery" ? "positive" : "terminal-2"}>
                                    {kbFromComponent === "Battery" ? "Positive (+)" : "Terminal 2"}
                                </option>
                            </select>
                        </div>
                    )}

                    {kbFromTerminal && (
                        <>
                            <div className="space-y-[0.25rem]">
                                <label htmlFor="kb-to-select" className="block font-medium text-[var(--text-muted,#6B7280)]">To Component:</label>
                                <select
                                    id="kb-to-select"
                                    value={kbToComponent}
                                    onChange={(e) => {
                                        setKbToComponent(e.target.value);
                                        setKbToTerminal("");
                                    }}
                                    className="bg-[var(--bg-primary,#FFFFFF)] border border-[var(--border-color,#E5E7EB)] text-[var(--text-main,#041A3E)] rounded p-[0.4rem] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                                >
                                    <option value="">-- Choose Component --</option>
                                    {sandboxComponents.filter(c => c !== kbFromComponent).map(comp => (
                                        <option key={comp} value={comp}>{comp}</option>
                                    ))}
                                </select>
                            </div>

                            {kbToComponent && (
                                <div className="space-y-[0.25rem]">
                                    <label htmlFor="kb-to-term" className="block font-medium text-[var(--text-muted,#6B7280)]">Terminal Port:</label>
                                    <select
                                        id="kb-to-term"
                                        value={kbToTerminal}
                                        onChange={(e) => setKbToTerminal(e.target.value)}
                                        className="bg-[var(--bg-primary,#FFFFFF)] border border-[var(--border-color,#E5E7EB)] text-[var(--text-main,#041A3E)] rounded p-[0.4rem] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                                    >
                                        <option value="">-- Choose Pin --</option>
                                        <option value={kbToComponent === "Battery" ? "negative" : "terminal-1"}>
                                            {kbToComponent === "Battery" ? "Negative (-)" : "Terminal 1"}
                                        </option>
                                        <option value={kbToComponent === "Battery" ? "positive" : "terminal-2"}>
                                            {kbToComponent === "Battery" ? "Positive (+)" : "Terminal 2"}
                                        </option>
                                    </select>
                                </div>
                            )}
                        </>
                    )}

                    {kbFromTerminal && kbToTerminal && (
                        <button
                            type="button"
                            onClick={handleConnectKb}
                            className="bg-[#FF6B35] text-white font-bold px-[1rem] py-[0.45rem] rounded hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--focus-ring,#FF6B35)]"
                        >
                            Connect Wire
                        </button>
                    )}
                </div>
            </div>

            {/* Keyboard Manual instructions */}
            <div className="p-[1rem] bg-[var(--bg-secondary,#F3F4F6)] border border-[var(--border-color,#E5E7EB)] rounded-xl text-[0.75rem] space-y-[0.4rem] text-[var(--text-main,#041A3E)] select-none">
                <h3 className="font-bold uppercase tracking-wide text-[var(--text-muted,#6B7280)] flex items-center gap-[0.25rem]">
                    <HelpCircle size={14} /> Keyboard Manual
                </h3>
                <ul className="list-disc pl-[1rem] space-y-[0.15rem]">
                    <li>Press <kbd className="font-bold bg-[var(--bg-primary,#FFFFFF)] px-[0.25rem] rounded border border-[var(--border-color,#E5E7EB)]">Tab</kbd> to focus on component cards or terminal pins.</li>
                    <li>Press <kbd className="font-bold bg-[var(--bg-primary,#FFFFFF)] px-[0.25rem] rounded border border-[var(--border-color,#E5E7EB)]">Spacebar</kbd> to select/grab a focused component.</li>
                    <li>Use <kbd className="font-bold bg-[var(--bg-primary,#FFFFFF)] px-[0.25rem] rounded border border-[var(--border-color,#E5E7EB)]">Arrow keys</kbd> to translate components. Hold <kbd className="font-bold bg-[var(--bg-primary,#FFFFFF)] px-[0.25rem] rounded border border-[var(--border-color,#E5E7EB)]">Shift</kbd> for micro-movement.</li>
                    <li>Press <kbd className="font-bold bg-[var(--bg-primary,#FFFFFF)] px-[0.25rem] rounded border border-[var(--border-color,#E5E7EB)]">Enter</kbd> to drop and lock a component card, or <kbd className="font-bold bg-[var(--bg-primary,#FFFFFF)] px-[0.25rem] rounded border border-[var(--border-color,#E5E7EB)]">Escape</kbd> to cancel.</li>
                </ul>
            </div>

            {/* Validation completion CTA */}
            {isValidated && (
                <div className="text-center mt-[0.5rem]">
                    <button
                        type="button"
                        onClick={() => {
                            if (onComplete) onComplete(30);
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-[0.8rem] rounded-xl shadow-lg transition-transform hover:scale-[1.01] focus-visible:outline focus-visible:outline-3 focus-visible:outline-emerald-400"
                    >
                        🚀 Submit Completed Circuit
                    </button>
                </div>
            )}

            {/* PARALLEL ACCESSIBLE DOM (Offscreen Screen Reader Mirror) */}
            <div className="sr-only">
                <h3 id="sr-sandbox-title">Screen Reader Accessible Sandbox Node List</h3>
                <p id="sr-sandbox-desc">
                    Below is a keyboard-accessible list mirroring the sandbox layout. Tab to select component buttons, press Spacebar to toggle grab mode, use arrow keys to navigate the grid coordinates, and press Escape to drop.
                </p>
                <div role="application" aria-labelledby="sr-sandbox-title" aria-describedby="sr-sandbox-desc">
                    {sandboxComponents.map((comp) => {
                        const pos = positions[comp] || { x: 0, y: 0 };
                        const isGrabbed = grabbedNodeId === comp;
                        return (
                            <button
                                key={`sr-btn-${comp}`}
                                id={`sr-accessible-btn-${comp}`}
                                role="button"
                                aria-pressed={isGrabbed}
                                aria-label={`${comp} component card at coordinates position X ${Math.round(pos.x)}, Y ${Math.round(pos.y)}`}
                                onKeyDown={(e) => handleComponentKeyboard(e, comp)}
                                className="focus:outline-3 focus:outline-[var(--focus-ring-color,#2563eb)]"
                            >
                                {comp} (Position X: {Math.round(pos.x)}, Y: {Math.round(pos.y)})
                                {isGrabbed ? " [Grabbed - Use Arrow Keys to Move]" : " [Select component to move]"}
                            </button>
                        );
                    })}
                </div>
            </div>

        </div>
    );
}
