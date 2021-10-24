#Hotel California Waitlist System
This is the solution to Tutorial-5 of the module IT5007 at the National University of Singapore.

Before executing the project, make sure you have installed MongoDB.

To download the repository:
```
git clone https://github.com/LiYiran98/Hotel-California-Waitlist-System.git
```

Then enter the project directory:
```
cd Hotel-California-Waitlist-System
```

Install the dependencies:
```
npm install
```

To initialize the database and test MongoDB operations:
```
mongo waitlist scripts/init.mongo.js
node scripts/tryCreate.js
node scripts/tryRead.js
node scripts/tryDelete.js
```

Delete the test Data:
```
mongo waitlist scripts/deleteTestData.js
```

To run the server:
```
npm start
```

Then you will be able to see the webpage at `http://localhost:3000`.
