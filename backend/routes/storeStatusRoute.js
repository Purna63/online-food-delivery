import express from 'express';
import StoreStatus from '../models/storeStatusModel.js';

const router = express.Router();

// Helper function to ensure single document
const getOrCreateStoreStatus = async () => {
  let status = await StoreStatus.findOne();
  if (!status) {
    status = await StoreStatus.create({});
  }
  return status;
};

// GET current store status
router.get('/', async (req, res) => {
  try {
    res.set('Cache-Control', 'no-store');
    const status = await getOrCreateStoreStatus();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching store status.' });
  }
});

// UPDATE store hours or manual toggle
router.patch('/', async (req, res) => {
  try {
    const { openHour, closeHour, isManuallyClosed } = req.body;

    // Validate input (optional but safe)
    if (openHour !== undefined && (openHour < 0 || openHour > 23)) {
      return res.status(400).json({ error: 'openHour must be between 0 and 23' });
    }
    if (closeHour !== undefined && (closeHour < 0 || closeHour > 23)) {
      return res.status(400).json({ error: 'closeHour must be between 0 and 23' });
    }

    const status = await getOrCreateStoreStatus();

    if (openHour !== undefined) status.openHour = openHour;
    if (closeHour !== undefined) status.closeHour = closeHour;
    if (isManuallyClosed !== undefined) status.isManuallyClosed = isManuallyClosed;

    await status.save();
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Server error while updating store status.' });
  }
});

export default router;
