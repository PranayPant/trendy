import nextConnect from 'next-connect';
import { MongoClient } from 'mongodb';
import setup from '../data';

const client = new MongoClient(process.env.TRENDY_DATABASE_URL, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
});

async function database(req, res, next) {
   try {
      if (!client.isConnected()) {
         await client.connect();
      }
      const db = client.db();
      req.db = db;
   } catch (err) {
      console.error('Err accessing db from middleware:', err);
      res.status(500);
      res.send('Internal Server Error');
   }
   return next();
}

const middleware = nextConnect();

middleware.use(database);

export default middleware;
