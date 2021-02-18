import nextConnect from 'next-connect';
import middleware from '../../../middleware/db';
import mock from '../../../data';

const handler = nextConnect();
handler.use(middleware);

handler.post(async (req, res) => {
   try {
      // Check headers for API key
      if (req.headers['x-api-key'] !== process.env.TRENDY_MOCK_API_KEY) {
         res.status(403);
         res.send('Unauthorized');
      } else {
         const params = req.body;
         const db = req.db;
         const response = await db.listCollections().toArray();
         const colls = response.map((c) => c.name);
         const { productBulk, orderBulk, restaurantBulk } = mock(params);
         await Promise.all([
            db.collection('products').drop(),
            db.collection('orders').drop(),
            db.collection('restaurants').drop(),
         ]);
         await Promise.all([
            db.createCollection('products'),
            db.createCollection('orders'),
            db.createCollection('restaurants'),
         ]);
         await Promise.all([
            db.collection('products').bulkWrite(productBulk),
            db.collection('orders').bulkWrite(orderBulk),
            db.collection('restaurants').bulkWrite(restaurantBulk),
         ]);
         res.status(200).json({
            body: 'Success!',
            collections: colls,
         });
      }
   } catch (err) {
      console.error('Err creating mock data:', err);
      res.status(500);
      res.json({
         body: 'Internal Server Error',
      });
   }
});

export default handler;
