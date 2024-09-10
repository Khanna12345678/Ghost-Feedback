import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {//void here means that we don't care about the return value
    if(connection.isConnected){
        console.log("User already connected");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {});

        // `mongoose.connect()` returns a Mongoose instance, which contains a list of connections.
        // We are interested in the first connection (index 0) which represents the primary connection.
        // The `readyState` property of a connection indicates whether the connection is open or not.
        // Therefore, we assign the `readyState` of the primary connection to `connection.isConnected`.
        connection.isConnected = db.connections[0].readyState;

        console.log("Connected to MongoDB");
        
    } catch (error) {
        
        console.log("Error connecting to MongoDB:", error);
        
        
        process.exit(1);
        // When there is an error while connecting to the database, we need to make sure that the process is exited with a non-zero code, so that the container can automatically restart it.
    }
}

export default dbConnect;