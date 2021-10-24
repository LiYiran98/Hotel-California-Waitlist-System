const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost/waitlist';

async function testDelete() {
  console.log('\n--- testDelete ---');
  const client = new MongoClient(url, { useNewUrlParser: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db();
    const collection = db.collection('issues');

    const customer = {SerialNo: 3};
    const result = await collection.deleteOne(customer, function(err, obj) {
      if (err) throw err;
      console.log("1 document deleted");
    });

    const docs = await collection.find()
      .toArray();
    console.log('Result after removing customer 3:\n', docs);
    
  } catch(err) {
    console.log(err);
  } finally {
    client.close();
  }
}

testDelete();
