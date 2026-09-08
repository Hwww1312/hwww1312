"use client";

import { Component, type ReactNode } from "react";
import { ModelFallback } from "@/components/three/ModelFallback";

type Props = { children: ReactNode; fallbackReason?: string };
type State = { failed: boolean };

export class WebGLErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="canvas-host grain-overlay" aria-hidden="true">
          <ModelFallback
            reason={
              this.props.fallbackReason ||
              "3D unavailable — static plate composition."
            }
          />
        </div>
      );
    }
    return this.props.children;
  }
}
