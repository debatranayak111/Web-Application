import express from 'express';
import { dbService } from '../storage/db.js';

const router = express.Router();

// GET /api/applications - List applications with optional query filters
router.get('/', async (req, res) => {
  try {
    const { studentEmail, jobId } = req.query;
    const apps = await dbService.getApplications({ studentEmail, jobId });
    res.json({
      success: true,
      count: apps.length,
      data: apps
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/applications/student/:email - Applications submitted by a specific student
router.get('/student/:email', async (req, res) => {
  try {
    const apps = await dbService.getApplications({ studentEmail: req.params.email });
    res.json({
      success: true,
      count: apps.length,
      data: apps
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/applications/job/:jobId - Applications received for a specific job
router.get('/job/:jobId', async (req, res) => {
  try {
    const apps = await dbService.getApplications({ jobId: req.params.jobId });
    res.json({
      success: true,
      count: apps.length,
      data: apps
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/applications - Submit a new job application
router.post('/', async (req, res) => {
  try {
    const { jobId, studentEmail, studentName } = req.body;
    if (!jobId || !studentEmail) {
      return res.status(400).json({
        success: false,
        error: 'Job ID and Student Email are required to apply'
      });
    }

    const application = await dbService.createApplication(req.body);
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Track your status on the dashboard.',
      data: application
    });
  } catch (err) {
    const status = err.status || 400;
    res.status(status).json({ success: false, error: err.message });
  }
});

// PATCH /api/applications/:id/status - Update application status (Recruiter action)
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Accepted', 'Rejected'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = await dbService.updateApplicationStatus(req.params.id, status, feedback);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    res.json({
      success: true,
      message: `Application status updated to ${status}`,
      data: updated
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/applications/:id - Withdraw application (Student action)
router.delete('/:id', async (req, res) => {
  try {
    const success = await dbService.deleteApplication(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    res.json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
