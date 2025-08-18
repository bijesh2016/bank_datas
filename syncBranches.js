const axios = require('axios');
const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://locator:Tv9U9iDZMYKkxIGp@atm-locator.qjevvkc.mongodb.net/'; 

// MongoDB Schema
const branchSchema = new mongoose.Schema({
  _id: String,
  title: String,
  title_np: String,
  telephone: String,
  email: String,
  address: String,
  address_np: String,
  latitude: String,
  longitude: String,
  province: {
    id: String,
    title: String,
    titleNp: String,
    code: Number
  },
  district: {
    id: String,
    title: String,
    titleNp: String,
    code: Number
  },
  branch_manager: {
    name: String,
    nameNp: String
  },
  extended_hour_display_name: String,
  qos: Boolean,
  has_evening_counter: Boolean,
  sudden_holiday: Boolean,
  opens_saturday: Boolean,
  hide_in_website: Boolean
});

const Branch = mongoose.model('BulkBranch', branchSchema);

async function syncBranches() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Connected to MongoDB');

    // Fetch from API
    const response = await axios.get('https://gibl-public-api.gibl.com.np/branch-data/list?page=1&limit=20');
    const branches = response.data.data.branch;

    // Upsert each branch
    for (const b of branches) {
      const doc = {
        _id: b.id,
        title: b.title,
        title_np: b.title_np,
        telephone: b.telephone,
        email: b.email,
        address: b.address,
        address_np: b.address_np,
        latitude: b.latitude,
        longitude: b.longitude,
        province: {
          id: b.province?.id || null,
          title: b.province?.title || null,
          titleNp: b.province?.titleNp || null,
          code: b.province?.code || null
        },
        district: {
          id: b.district?.id || null,
          title: b.district?.title || null,
          titleNp: b.district?.titleNp?.trim() || null,
          code: b.district?.code || null
        },
        branch_manager: {
          name: b.branch_manager?.name || null,
          nameNp: b.branch_manager?.nameNp || null
        },
        extended_hour_display_name: b.extended_hour?.display_name || null,
        qos: Boolean(b.qos),
        has_evening_counter: Boolean(b.has_evening_counter),
        sudden_holiday: Boolean(b.sudden_holiday),
        opens_saturday: Boolean(b.opens_saturday),
        hide_in_website: Boolean(b.hide_in_website)
      };

      await Branch.updateOne({ _id: doc._id }, doc, { upsert: true });
    }

    console.log('Branches synced successfully!');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error syncing branches:', err.message);
    mongoose.disconnect();
  }
}

syncBranches();
