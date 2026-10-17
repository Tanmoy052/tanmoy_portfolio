const mongoose = require('mongoose');
require('dotenv').config();

async function check() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('ERROR: MONGODB_URI is not defined in .env');
    process.exit(1);
  }

  const start = Date.now();
  await mongoose.connect(uri);
  const latency = Date.now() - start;

  const stateNames = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  console.log('MongoDB Ready State:', stateNames[mongoose.connection.readyState]);
  console.log('Database Name:', mongoose.connection.name);
  console.log('Host Cluster:', mongoose.connection.host);
  console.log('Port:', mongoose.connection.port);
  console.log('Handshake Latency:', latency + ' ms');

  // Ping database
  const ping = await mongoose.connection.db.admin().ping();
  console.log('Admin Ping Response:', JSON.stringify(ping));

  // List collections and counts
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('\nCollections & Documents:');
  for (const c of collections) {
    const count = await mongoose.connection.db.collection(c.name).countDocuments();
    console.log(`  • ${c.name}: ${count} document(s)`);
  }

  await mongoose.disconnect();
  console.log('\nVerification complete: MongoDB is fully connected and healthy.');
}

check().catch((err) => {
  console.error('Connection verification failed:', err);
  process.exit(1);
});
