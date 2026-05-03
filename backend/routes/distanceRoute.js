import express from "express";
import axios from "axios";
import { calculateDistance } from "../utils/distance.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { lat, lng } = req.body;

  const RESTAURANT_LAT = 20.30255;
  const RESTAURANT_LNG = 86.404246;

  const distance = calculateDistance(RESTAURANT_LAT, RESTAURANT_LNG, lat, lng);

  // DELIVERY LIMIT
  if (distance > 12) {
    return res.json({
      distance: Number(distance.toFixed(2)),
      deliveryCharge: 0,
      error: "Sorry, we do not deliver to this location.",
    });
  }

  const BASE_PRICE = 10;
const PER_KM_RATE = 5;

const roundedDistance = Math.ceil(distance);
const deliveryCharge = BASE_PRICE + (roundedDistance * PER_KM_RATE);

  // 🔹 Reverse Geocode (Get Address)
  let address = "";

  try {
    const geoRes = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          latlng: `${lat},${lng}`,
          key: process.env.GOOGLE_MAP_KEY,
        },
      },
    );

    if (geoRes.data.status === "OK" && geoRes.data.results.length > 0) {
      address = geoRes.data.results[0].formatted_address;
    }
  } catch (err) {
    console.log("Geocode error:", err.message);
  }

  res.json({
    distance: Number(distance.toFixed(2)),
    deliveryCharge,
    address,
    lat,
    lng,
    mapLink: `https://www.google.com/maps?q=${lat},${lng}`,
  });
});

export default router;
