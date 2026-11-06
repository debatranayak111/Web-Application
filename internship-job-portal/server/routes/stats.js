import express from 'express';
import { dbService, getDbStatus } from '../storage/db.js';

const router = express.Router();

// GET /api/stats - High-level portal statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await dbService.getStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/health - Server and DB status
router.get('/health', (req, res) => {
  const dbInfo = getDbStatus();
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: dbInfo
  });
});

export default router;
