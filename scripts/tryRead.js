const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost/waitlist';

async function testRead() {
  console.log('\n--- testRead ---');
  const client = new MongoClient(url, { useNewUrlParser: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db();
    const collection = db.collection('issues');

    const docs = await collection.find()
      .toArray();
    console.log('Result of find:\n', docs);
  } catch(err) {
    console.log(err);
  } finally {
    client.close();
  }
}

testRead();
