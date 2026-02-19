const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    altText: { type: String, default: '' }
}, { _id: true });

const singleImageSchema = new mongoose.Schema({
    url: { type: String, default: '' },
    publicId: { type: String, default: '' }
}, { _id: false });

const policeTrainingSchema = new mongoose.Schema({
    // Location hierarchy
    state: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    policeStation: { type: String, required: true, trim: true },

    // Event details
    eventDate: { type: Date, required: true },
    location: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },

    // Training photos (multiple)
    photos: { type: [photoSchema], default: [] },

    // Chief Guest / Officer section
    officerName: { type: String, trim: true, default: '' },
    officerDesignation: { type: String, trim: true, default: '' },
    officerDistrict: { type: String, trim: true, default: '' },
    officerState: { type: String, trim: true, default: '' },
    officerPhoto: { type: singleImageSchema, default: () => ({}) },
    momentoPhoto: { type: singleImageSchema, default: () => ({}) },
    officerNote: { type: String, trim: true, default: '' },

    createdAt: { type: Date, default: Date.now }
});

// Text index for search
policeTrainingSchema.index({
    state: 'text',
    district: 'text',
    policeStation: 'text',
    officerName: 'text',
    location: 'text'
});

module.exports = mongoose.model('PoliceTraining', policeTrainingSchema);
