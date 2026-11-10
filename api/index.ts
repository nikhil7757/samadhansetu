let appInstance: any;

try {
  const mod = await import('../backend/dist/index.js');
  appInstance = mod.default || mod;
} catch (_err) {
  try {
    const mod = await import('../backend/src/index.js');
    appInstance = mod.default || mod;
  } catch (err) {
    console.error('Failed to import backend app instance:', err);
  }
}

export default function handler(req: any, res: any) {
  if (typeof appInstance === 'function') {
    return appInstance(req, res);
  }
  res.status(500).json({ error: 'Backend serverless app instance not available' });
}
