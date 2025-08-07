const Product = require('../models/Product');

const getSuggestions = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.trim().length < 2) {
      return res.status(400).json([]);
    }

    const regex = new RegExp(query, 'i'); // case-insensitive partial match
    const suggestions = await Product.find({ name: regex })
      .limit(10)
      .select('_id name');

    res.json(suggestions);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getSuggestions,
};
