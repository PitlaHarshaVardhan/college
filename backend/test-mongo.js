const mongoose = require('mongoose');

const uris = [
  'mongodb://bachelorsaikitchen_db_user:94409912%40Harsha@ac-0depqsd-shard-00-00.8u2eusj.mongodb.net:27017,ac-0depqsd-shard-00-01.8u2eusj.mongodb.net:27017,ac-0depqsd-shard-00-02.8u2eusj.mongodb.net:27017/leave_management?ssl=true&replicaSet=atlas-0depqsd-shard-0&authSource=admin&retryWrites=true&w=majority',
  'mongodb://bachelorsaikitchen_db_user:xlU2Igm3R9u2DYiO@ac-0depqsd-shard-00-00.8u2eusj.mongodb.net:27017,ac-0depqsd-shard-00-01.8u2eusj.mongodb.net:27017,ac-0depqsd-shard-00-02.8u2eusj.mongodb.net:27017/leave_management?ssl=true&replicaSet=atlas-0depqsd-shard-0&authSource=admin&retryWrites=true&w=majority'
];

async function test(uri, label) {
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(label + ' WORKED');
    await mongoose.disconnect();
    return uri;
  } catch (err) {
    console.log(label + ' FAILED: ' + err.message);
    return null;
  }
}

async function run() {
  const uri1 = await test(uris[0], 'PASS1 (94409912@Harsha)');
  if (uri1) process.exit(0);

  const uri2 = await test(uris[1], 'PASS2 (xlU2Igm3R9u2DYiO)');
  if (uri2) process.exit(0);

  process.exit(1);
}

run();
