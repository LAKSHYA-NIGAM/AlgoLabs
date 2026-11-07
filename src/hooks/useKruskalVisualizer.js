import { useState, useEffect, useRef, useCallback } from 'react';
import { generateKruskalSnapshots } from '../algorithms/kruskal.js';
import { DEFAULT_VERTICES, DEFAULT_EDGES } from '../data/defaultGraph.js';

export function useKruskalVisualizer(initialVertices = DEFAULT_VERTICES, initialEdges = DEFAULT_EDGES) {
  const [vertices, setVertices] = useState(initialVertices);
  const [edges, setEdges] = useState(initialEdges);

  // Simulation output
  const [simulationData, setSimulationData] = useState(() =>
    generateKruskalSnapshots(initialVertices, initialEdges)
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const timerRef = useRef(null);

  // Re-generate snapshots whenever vertices or edges change
  const recompute = useCallback((newV, newE) => {
    const res = generateKruskalSnapshots(newV, newE);
    setSimulationData(res);
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  // Update graph
  const setCustomGraph = useCallback((newV, newE) => {
    setVertices(newV);
    setEdges(newE);
    recompute(newV, newE);
  }, [recompute]);

  // Stepping controls
  const handleNext = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev < simulationData.snapshots.length - 1) {
        return prev + 1;
      }
      setIsPlaying(false);
      return prev;
    });
  }, [simulationData.snapshots.length]);

  const handlePrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStep(0);
  }, []);

  const handleSeek = useCallback((step) => {
    setIsPlaying(false);
    setCurrentStep(Math.max(0, Math.min(simulationData.snapshots.length - 1, step)));
  }, [simulationData.snapshots.length]);

  const handlePlay = useCallback(() => {
    if (currentStep >= simulationData.snapshots.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  }, [currentStep, simulationData.snapshots.length]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // Autoplay effect
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.round(1500 / speed);
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < simulationData.snapshots.length - 1) {
            return prev + 1;
          }
          setIsPlaying(false);
          return prev;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, speed, simulationData.snapshots.length]);

  const currentSnapshot = simulationData.snapshots[currentStep] || simulationData.snapshots[0];

  return {
    vertices,
    edges,
    currentStep,
    totalSteps: simulationData.snapshots.length,
    currentSnapshot,
    simulationData,
    isPlaying,
    speed,
    setSpeed,
    handlePlay,
    handlePause,
    handleNext,
    handlePrev,
    handleReset,
    handleSeek,
    setCustomGraph
  };
}
