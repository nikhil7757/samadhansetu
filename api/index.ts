export default async function handler(req: any, res: any) {
  try {
    const { default: app } = await import('../backend/src/index.js');
    return app(req, res);
  } catch (err: any) {
    return res.status(500).json({
      error: 'Vercel invocation error',
      message: err?.message || String(err),
      stack: err?.stack,
    });
  }
}
