import express from 'express';
import { dbService } from '../storage/db.js';

const router = express.Router();

// GET /api/jobs - List all jobs with filters and search
router.get('/', async (req, res) => {
  try {
    const { q, category, workplaceType, employmentType, minStipend, sortBy } = req.query;
    const jobs = await dbService.getJobs({
      q,
      category,
      workplaceType,
      employmentType,
      minStipend,
      sortBy
    });
    res.json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/jobs/categories - List available categories
router.get('/meta/categories', async (req, res) => {
  try {
    const jobs = await dbService.getJobs({});
    const categories = Array.from(new Set(jobs.map(j => j.category))).filter(Boolean);
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/jobs/:id - Single job details
router.get('/:id', async (req, res) => {
  try {
    const job = await dbService.getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, error: 'Job opportunity not found' });
    }
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/jobs - Post a new job opportunity
router.post('/', async (req, res) => {
  try {
    const { title, company, description, category, location } = req.body;
    if (!title || !company || !description) {
      return res.status(400).json({
        success: false,
        error: 'Please provide Title, Company Name, and Job Description'
      });
    }

    const newJob = await dbService.createJob(req.body);
    res.status(201).json({
      success: true,
      message: 'Job opportunity published successfully',
      data: newJob
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT /api/jobs/:id - Update existing job opportunity
router.put('/:id', async (req, res) => {
  try {
    const updated = await dbService.updateJob(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Job opportunity not found' });
    }
    res.json({
      success: true,
      message: 'Job opportunity updated successfully',
      data: updated
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/jobs/:id - Remove job opportunity
router.delete('/:id', async (req, res) => {
  try {
    const success = await dbService.deleteJob(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, error: 'Job opportunity not found' });
    }
    res.json({
      success: true,
      message: 'Job opportunity and related applications removed successfully'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

