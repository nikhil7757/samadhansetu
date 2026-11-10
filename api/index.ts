export default async function handler(req: any, res: any) {
  try {
    const mod = await import('../backend/dist/index.js');
    const app = mod.default || mod;
    return app(req, res);
  } catch (err: any) {
    console.error('Serverless error:', err);
    return res.status(500).json({
      error: 'Serverless invocation error',
      message: err?.message || String(err),
      stack: err?.stack,
    });
  }
}
