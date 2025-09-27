import React, { useEffect, useRef, useState } from "react";
import "./NetworkTraffic.css";

const NetworkFlowVisualizer = () => {
  const canvasRef = useRef(null);
  const [animationState, setAnimationState] = useState("idle");
  const animationDataRef = useRef({
    packetsToSend: 0,
    lastStateChangeTime: performance.now(),
    animationState: "idle",
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    // Elementos de la red
    const elements = {
      user1: {
        x: width * 0.1,
        y: height * 0.4,
        size: 40,
        label: "Usuario 1",
        image: "🧑‍💻",
      },
      user2: {
        x: width * 0.1,
        y: height * 0.6,
        size: 40,
        label: "Usuario 2",
        image: "👩‍💻",
      },
      router1: {
        x: width * 0.4,
        y: height / 2,
        size: 30,
        label: "Router 1",
        image: "📡",
      },
      router2: {
        x: width * 0.6,
        y: height / 2,
        size: 30,
        label: "Router 2",
        image: "📡",
      },
      server: {
        x: width * 0.85,
        y: height / 2,
        size: 40,
        label: "Servidor Web",
        image: "🌐",
      },
    };

    // Líneas de conexión
    const lines = [
      {
        id: "u1-r1",
        start: elements.user1,
        end: elements.router1,
        color: "#63b3ed",
      },
      {
        id: "u2-r1",
        start: elements.user2,
        end: elements.router1,
        color: "#63b3ed",
      },
      {
        id: "r1-r2",
        start: elements.router1,
        end: elements.router2,
        color: "#63b3ed",
      },
      {
        id: "r2-s",
        start: elements.router2,
        end: elements.server,
        color: "#63b3ed",
      },
      {
        id: "s-r2",
        start: elements.server,
        end: elements.router2,
        color: "#63b3ed",
      },
      {
        id: "r2-r1",
        start: elements.router2,
        end: elements.router1,
        color: "#63b3ed",
      },
      {
        id: "r1-u1",
        start: elements.router1,
        end: elements.user1,
        color: "#63b3ed",
      },
      {
        id: "u1-u2",
        start: elements.user1,
        end: elements.user2,
        color: "#63b3ed",
      },
    ];

    const dataPackets = [];
    const totalRequestPackets = 3;
    const totalVideoPackets = 8;
    const totalSharePackets = 3;
    const stateWaitTime = 2000;
    const animationSpeed = 0.001; // Más lento
    const packetDelay = 700; // Tiempo entre paquetes

    const requestPath = ["u1-r1", "r1-r2", "r2-s"];
    const responsePath = ["s-r2", "r2-r1", "r1-u1"];
    const sharePath = ["u1-u2"];

    const getPath = (pathIds) =>
      pathIds.map((id) => lines.find((l) => l.id === id));

    const drawLine = (start, end, color) => {
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
    };

    const drawElement = (element) => {
      ctx.fillStyle = "#2d3748";
      ctx.beginPath();
      ctx.arc(element.x, element.y, element.size, 0, 2 * Math.PI);
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.font = "16px Arial";
      ctx.fillText(element.label, element.x, element.y + element.size + 20);

      ctx.font = "30px Arial";
      ctx.fillText(element.image, element.x, element.y + 10);
    };

    const drawPacket = (packet) => {
      ctx.beginPath();
      ctx.arc(packet.x, packet.y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = packet.color;
      ctx.fill();
    };

    const updatePackets = (deltaTime) => {
      for (let i = dataPackets.length - 1; i >= 0; i--) {
        const packet = dataPackets[i];
        packet.t += animationSpeed * deltaTime;
        const currentLine = packet.path[0];
        if (!currentLine) {
          dataPackets.splice(i, 1);
          continue;
        }
        const { start, end } = currentLine;
        packet.x = start.x + (end.x - start.x) * packet.t;
        packet.y = start.y + (end.y - start.y) * packet.t;
        if (packet.t >= 1) {
          packet.path.shift();
          packet.t = 0;
        }
      }
    };

    let lastTime = performance.now();
    let lastPacketSent = performance.now();

    const sendPacket = (start, end, color, pathIds) => {
      const path = getPath(pathIds);
      dataPackets.push({
        x: start.x,
        y: start.y,
        t: 0,
        color,
        path,
        finalDestination: end,
      });
    };

    const animate = (currentTime) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      const now = performance.now();

      ctx.clearRect(0, 0, width, height);
      Object.values(elements).forEach(drawElement);
      lines.forEach((line) => drawLine(line.start, line.end, line.color));

      const activeLineColor = "#007bff";

      switch (animationDataRef.current.animationState) {
        case "idle":
          if (
            now - animationDataRef.current.lastStateChangeTime >
            stateWaitTime
          ) {
            animationDataRef.current.animationState = "request";
            animationDataRef.current.packetsToSend = totalRequestPackets;
            setAnimationState("request");
            lastPacketSent = now;
          }
          break;
        case "request":
          getPath(requestPath).forEach((line) =>
            drawLine(line.start, line.end, activeLineColor)
          );
          if (
            animationDataRef.current.packetsToSend > 0 &&
            now - lastPacketSent > packetDelay
          ) {
            sendPacket(elements.user1, elements.server, "#ffc658", requestPath);
            animationDataRef.current.packetsToSend--;
            lastPacketSent = now;
          }
          if (
            dataPackets.length === 0 &&
            animationDataRef.current.packetsToSend === 0
          ) {
            animationDataRef.current.animationState = "response";
            animationDataRef.current.packetsToSend = totalVideoPackets;
            setAnimationState("response");
            lastPacketSent = now;
          }
          break;
        case "response":
          getPath(responsePath).forEach((line) =>
            drawLine(line.start, line.end, activeLineColor)
          );
          if (
            animationDataRef.current.packetsToSend > 0 &&
            now - lastPacketSent > packetDelay
          ) {
            sendPacket(
              elements.server,
              elements.user1,
              "#82ca9d",
              responsePath
            );
            animationDataRef.current.packetsToSend--;
            lastPacketSent = now;
          }
          if (
            dataPackets.length === 0 &&
            animationDataRef.current.packetsToSend === 0
          ) {
            animationDataRef.current.animationState = "share";
            animationDataRef.current.packetsToSend = totalSharePackets;
            setAnimationState("share");
            lastPacketSent = now;
          }
          break;
        case "share":
          getPath(sharePath).forEach((line) =>
            drawLine(line.start, line.end, activeLineColor)
          );
          if (
            animationDataRef.current.packetsToSend > 0 &&
            now - lastPacketSent > packetDelay
          ) {
            sendPacket(elements.user1, elements.user2, "#e91e63", sharePath);
            animationDataRef.current.packetsToSend--;
            lastPacketSent = now;
          }
          if (
            dataPackets.length === 0 &&
            animationDataRef.current.packetsToSend === 0
          ) {
            animationDataRef.current.animationState = "done";
            animationDataRef.current.lastStateChangeTime = now;
            setAnimationState("done");
          }
          break;
        case "done":
          if (
            now - animationDataRef.current.lastStateChangeTime >
            stateWaitTime
          ) {
            animationDataRef.current.animationState = "idle";
            setAnimationState("idle");
          }
          break;
      }

      updatePackets(deltaTime);
      dataPackets.forEach(drawPacket);

      requestAnimationFrame(animate);
    };

    animate(performance.now());

    const handleResize = () => {
      const newWidth = canvas.offsetWidth;
      const newHeight = canvas.offsetHeight;

      // Asignar las dimensiones internas al Canvas
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Recalcular posiciones solo si las dimensiones son válidas
      if (newWidth > 0 && newHeight > 0) {
        // ... (Tu lógica de posición de elementos, que ya usa newWidth/newHeight) ...
        elements.user1.x = newWidth * 0.1;
        elements.user1.y = newHeight * 0.4;
        elements.user2.x = newWidth * 0.1;
        // ... (resto de los cálculos de posición) ...
        elements.server.x = newWidth * 0.85;
        elements.server.y = newHeight / 2;
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="section-container">
      <div className="canvas-wrapper">
        <canvas ref={canvasRef} className="canvas-style" />
      </div>
    </div>
  );
};

export default NetworkFlowVisualizer;
