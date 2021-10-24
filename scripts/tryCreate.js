const { MongoClient } = require('mongodb');

 const url = 'mongodb://localhost/waitlist';

// Atlas URL  - replace UUU with user, PPP with password, XXX with hostname
//const url = "mongodb+srv://liyiran:7auTudWLBhPEp7n@cluster0.tmzsi.mongodb.net/test?retryWrites=true&w=majority";

// mLab URL - replace UUU with user, PPP with password, XXX with hostname
// const url = 'mongodb://UUU:PPP@XXX.mlab.com:33533/issuetracker';

function testWithCallbacks(callback) {
  console.log('\n--- testWithCallbacks ---');
  const client = new MongoClient(url, { useNewUrlParser: true });
  client.connect(function(err, client) {
    if (err) {
      callback(err);
      return;
    }
    console.log('Connected to MongoDB');

    const db = client.db();
    const collection = db.collection('issues');

    const customer = {SerialNo: 3, Name: 'A. Callback', Phone: '89020619', Timestamp: new Date() };
    collection.insertOne(customer, function(err, result) {
      if (err) {
        client.close();
        callback(err);
        return;
      }
      console.log('Result of insert:\n', result.insertedId);
      collection.find({ _id: result.insertedId})
        .toArray(function(err, docs) {
        if (err) {
          client.close();
          callback(err);
          return;
        }
        console.log('Result of find:\n', docs);
        client.close();
        callback(err);
      });
    });
  });
}

async function testWithAsync() {
  console.log('\n--- testWithAsync ---');
  const client = new MongoClient(url, { useNewUrlParser: true });
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db();
    const collection = db.collection('issues');

    const customer = { SerialNo: 4, Name: 'B. Callback', Phone: '89020619', Timestamp: new Date() };
    const result = await collection.insertOne(customer);
    console.log('Result of insert:\n', result.insertedId);

    const docs = await collection.find({ _id: result.insertedId })
      .toArray();
    console.log('Result of find:\n', docs);
  } catch(err) {
    console.log(err);
  } finally {
    client.close();
  }
}

testWithCallbacks(function(err) {
  if (err) {
    console.log(err);
  }
  testWithAsync();
});
