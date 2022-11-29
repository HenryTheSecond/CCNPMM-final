const mongoose = require('mongoose');

const connectDB = async () => {
    /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */
    const uri = "mongodb+srv://congtuyen2032001:congtuyen2032001@cluster0.vkji1jb.mongodb.net/?retryWrites=true&w=majority";

    try {
        // Connect to the MongoDB cluster
        const con = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("connected");
    } catch (e) {
        console.error(e);
    }
}

module.exports = { connectDB };
