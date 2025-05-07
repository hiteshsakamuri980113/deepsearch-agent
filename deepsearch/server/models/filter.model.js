import mongoose from "mongoose";

const FilterLineSchema = new mongoose.Schema({
  filterName: {
    type: String,
    required: true,
  }, // e.g., "name", "popularity"
  condition: {
    type: String,
    required: true,
  }, // e.g., "contains", "greater than"
  criteria: {
    type: String,
    required: true,
  }, // User input
  logicalOperator: {
    type: String,
    required: true,
  }, // e.g., "AND", "OR"
});

const FilterBlockSchema = new mongoose.Schema({
  filterLines: {
    type: [FilterLineSchema],
    required: true,
  },
  blockLogicalOperator: {
    type: String,
    required: true,
  }, // e.g., "AND", "OR"
});

const FilterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  filterBlocks: {
    type: [FilterBlockSchema],
    required: true,
  },
});

export default mongoose.model("Filter", FilterSchema);
