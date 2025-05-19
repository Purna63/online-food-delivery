import mongoose from 'mongoose';

const storeStatusSchema = new mongoose.Schema({
  openHour: {
    type: Number,
    default: 8, // 8 AM
    min: 0,
    max: 23
  },
  closeHour: {
    type: Number,
    default: 21, // 9 PM
    min: 0,
    max: 23
  },
  isManuallyClosed: {
    type: Boolean,
    default: false
  }
});

const StoreStatus = mongoose.model('StoreStatus', storeStatusSchema);
export default StoreStatus;
