import { useEffect, useRef, useState } from 'react';
import './App.css';
import image from './assets/AboutMeNoBg.webp';
import QRCode from 'react-qr-code';
function App() {
  const canvasRef = useRef(null);
  const outputCanvasRef = useRef(null);
  const canvas = canvasRef.current;

  const ctx = canvas?.getContext('2d');
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [downloadSize, setDownloadSize] = useState({ width: 290, height: 420 });
  const [pos, setPos] = useState({
    x: 0,
    y: 0,
  });
  const [stream, setStream] = useState<string[]>([]);
  const [loc, setLoc] = useState();
  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = image;
      img.onload = () => {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scale, scale);
        ctx.drawImage(
          img,
          -img.width / 2,
          -img.height / 2,
          img.width,
          img.height
        );
        ctx.restore();
      };
    }
  }, [image, rotation, scale]);

  const transferToSecondCanvas = () => {
    if (canvasRef.current && outputCanvasRef.current) {
      const outputCanvas = outputCanvasRef.current;
      const outputCtx = outputCanvas.getContext('2d');
      outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
      outputCtx.drawImage(
        canvasRef.current,
        0,
        0,
        outputCanvas.width,
        outputCanvas.height
      );
    }
  };

  const downloadCanvasImage = () => {
    if (canvasRef.current) {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = downloadSize.width;
      tempCanvas.height = downloadSize.height;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(
        canvasRef.current,
        0,
        0,
        tempCanvas.width,
        tempCanvas.height
      );
      const link = document.createElement('a');
      link.href = tempCanvas.toDataURL('image/png');
      link.download = 'canvas-image.png';
      link.click();
    }
  };

  useEffect(() => {
    const timeID = setTimeout(() => {
      navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    devices.forEach(device => {
      setStream(prev => [...prev, `${device.kind}: ${device.label} (ID: ${device.deviceId})`]);
    });
  })
      setLoc(window.location.href);
    });
    return () => {
      clearTimeout(timeID);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <pre>{JSON.stringify(stream, null, 2)}</pre>
      <QRCode height={256} width={256} value={loc || ''} />
      <input
        type="range"
        min="0"
        max="360"
        value={rotation}
        onChange={(e) => setRotation(Number(e.target.value))}
      />
      <input
        type="range"
        min="0.1"
        max="2"
        step="0.1"
        value={scale}
        onChange={(e) => setScale(Number(e.target.value))}
      />
      <canvas
        ref={canvasRef}
        width={400}
        height={300}
        className="border rounded-lg"
      />
      <button onClick={transferToSecondCanvas}>
        Transfer to Second Canvas
      </button>
      <canvas
        ref={outputCanvasRef}
        width={400}
        height={300}
        className="border rounded-lg"
      />
      <select
        onChange={(e) => {
          const [width, height] = e.target.value.split('x').map(Number);
          setDownloadSize({ width, height });
        }}
        className="border p-2 rounded"
      >
        <option value="290x420">290x420 px</option>
        <option value="1000x1000">1000x1000 px</option>
      </select>
      <button onClick={downloadCanvasImage}>Download Image</button>
    </div>
  );
}

export default App;
