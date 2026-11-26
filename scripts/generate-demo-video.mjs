import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const bytes = await page.evaluate(async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 270;
    const context = canvas.getContext('2d');
    const stream = canvas.captureStream(12);
    const recorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp8',
      videoBitsPerSecond: 150000,
    });
    const chunks = [];
    recorder.ondataavailable = (event) => chunks.push(event.data);
    const done = new Promise((resolve) => (recorder.onstop = resolve));
    recorder.start();
    const start = performance.now();
    await new Promise((resolve) => {
      const draw = (now) => {
        context.fillStyle = '#0f172a';
        context.fillRect(0, 0, 480, 270);
        for (let i = 0; i < 4; i++) {
          context.fillStyle = ['#60a5fa', '#a78bfa', '#34d399', '#fbbf24'][i];
          context.beginPath();
          context.arc(
            70 + i * 110,
            135 + Math.sin((now - start) / 450 + i) * 45,
            32,
            0,
            Math.PI * 2,
          );
          context.fill();
        }
        if (now - start < 1600) requestAnimationFrame(draw);
        else resolve();
      };
      requestAnimationFrame(draw);
    });
    recorder.stop();
    await done;
    stream.getTracks().forEach((track) => track.stop());
    return Array.from(new Uint8Array(await new Blob(chunks, { type: 'video/webm' }).arrayBuffer()));
  });
  await mkdir('demo/public/samples', { recursive: true });
  await writeFile('demo/public/samples/background.webm', new Uint8Array(bytes));
  console.log('Synthetic local WebM: ' + bytes.length + ' bytes.');
} finally {
  await browser.close();
}
