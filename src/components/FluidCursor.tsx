"use client";
import useFluidCursor from "@/hooks/useFluidCursor";
import { useEffect } from "react";

const FluidCursor = () => {
  useEffect(() => {
    useFluidCursor();
  }, []);

  return (
    <div className="fixed top-0 left-0 z-2">
      <canvas id="fluid" className="w-screen h-screen" />
    </div>
  );
};
export default FluidCursor;
