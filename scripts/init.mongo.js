/*
 * Run using the mongo shell. For remote databases, ensure that the
 * connection string is supplied in the command line. For example:
 * localhost:
 *   mongo issuetracker scripts/init.mongo.js
 * Atlas:
 *   mongo mongodb+srv://user:pwd@xxx.mongodb.net/issuetracker scripts/init.mongo.js
 * MLab:
 *   mongo mongodb://user:pwd@xxx.mlab.com:33533/issuetracker scripts/init.mongo.js
 */

db.issues.remove({});

const issuesDB = [
  {
    SerialNo: 1, Name: 'Li Yiran',
    Phone: '89020619', Timestamp: new Date(),
  },
  {
    SerialNo: 2, Name: 'Sunny',
    Phone: '86180167', Timestamp: new Date(),
  },
];

db.issues.insertMany(issuesDB);
const count = db.issues.count();
print('Inserted', count, 'issues');

db.issues.createIndex({ SerialNo : 1 }, { unique: true });

