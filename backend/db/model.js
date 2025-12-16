const mongoose = require('mongoose');


const pageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
})


const Page = mongoose.model('Page', pageSchema);

module.exports = Page;