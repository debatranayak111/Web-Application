import express from 'express';
import { dbService } from '../storage/db.js';

const router = express.Router();

// GET /api/students/profile - Get current student profile
router.get('/profile', async (req, res) => {
  try {
    const email = req.query.email || '2024091239@gitam.edu';
    const profile = await dbService.getStudentProfile(email);
    res.json({
      success: true,
      data: profile
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/students/profile - Update / create student profile
router.put('/profile', async (req, res) => {
  try {
    const { fullName, email } = req.body;
    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        error: 'Full name and email address are required'
      });
    }

    const updated = await dbService.updateStudentProfile(req.body);
    res.json({
      success: true,
      message: 'Student profile updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
