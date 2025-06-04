const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = "mongodb+srv://byard7689:cXCOixhóqSwLHOGU@cluster0.yzszhvp.mongodb.net/?retryWrites=true&w=majority";
  
  try {
    console.log('Attempting to connect to MongoDB...');
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Successfully connected to MongoDB.');
    
    const dbList = await client.db().admin().listDatabases();
    console.log('Available databases:', dbList.databases.map(db => db.name));
    
    await client.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

testConnection();
