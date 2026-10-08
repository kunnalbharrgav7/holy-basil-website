import User from "../models/User.js";
import FranchiseStock from "../models/FranchiseStock.js";

/**
 * Check karta hai ki kya franchise ke paas order kiye gaye saare items ka stock hai ya nahi
 */
async function checkFranchiseStock(franchiseId, items) {
  for (const item of items) {
    const stock = await FranchiseStock.findOne({
      franchiseId: franchiseId,
      product: item.product,
    });

    // Agar stock record nahi mila, ya quantity required se kam hai
    if (!stock || stock.quantity < item.quantity) {
      return false;
    }
  }
  return true; // Saare items available hain
}

/**
 * Pincode -> City/District -> Admin fallback ke basis par best partner decide karta hai
 */
export async function resolveFulfillmentPartner(shippingAddress, items) {
  const { pincode, city, district } = shippingAddress;
  const searchCity = (city || district || "").trim().toLowerCase();

  // --- TIER 1: Exact Pincode Match ---
  if (pincode) {
    const primaryFranchises = await User.find({
      role: "franchise",
      serviceablePincodes: pincode,
    });

    for (const franchise of primaryFranchises) {
      const hasStock = await checkFranchiseStock(franchise._id, items);
      if (hasStock) {
        return {
          fulfillmentType: "FRANCHISE",
          fulfilledBy: franchise._id,
          routingStage: "EXACT_PINCODE",
        };
      }
    }
  }

  // --- TIER 2: City / District Fallback Match ---
  if (searchCity) {
    // Regex se case-insensitive search karte hain
    const secondaryFranchises = await User.find({
      role: "franchise",
      $or: [
        { storeCity: new RegExp(`^${searchCity}$`, "i") },
        { storeDistrict: new RegExp(`^${searchCity}$`, "i") },
      ],
    });

    for (const franchise of secondaryFranchises) {
      const hasStock = await checkFranchiseStock(franchise._id, items);
      if (hasStock) {
        return {
          fulfillmentType: "FRANCHISE",
          fulfilledBy: franchise._id,
          routingStage: "CITY_FALLBACK",
        };
      }
    }
  }

  // --- TIER 3: Admin Central Warehouse Fallback ---
  // Agar koi franchise nahi mili, ya kisi ke paas stock nahi tha
  return {
    fulfillmentType: "ADMIN",
    fulfilledBy: null,
    routingStage: "ADMIN_CENTRAL",
  };
}
