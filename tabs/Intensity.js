import * as React from 'react';
import { ExpoWebGLRenderingContext, GLView } from 'expo-gl';
import { Renderer } from 'expo-three';


export default function Intensity() {
    global.THREE = global.THREE || THREE;

    return (
        <GLView
          style={{ flex: 1 }}
          onContextCreate={(gl) => {
            // Create a WebGLRenderer without a DOM element
            const renderer = new Renderer({ gl });
            renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
          }}
        />
      );
}