import nextConnect from 'next-connect';
import middleware from '../../../middleware/db';
import { rank } from '../../../data';

const handler = nextConnect();
handler.use(middleware);

function transform(docs) {
   const data = docs.map(
      ({ name, lastPurchased, lastNumSold, description, cost }) => ({
         name,
         lastPurchased,
         quantity: lastNumSold,
         description,
         price: cost.tag,
      }),
   );
   return data;
}

handler.post(async (req, res) => {
   const db = req.db;
   const { days = 2 } = req.body;
   // 48 hour(2 days) interval in ms
   const interval = 1000 * 60 * 60 * 24 * days;
   try {
      const docs = await db
         .collection('products')
         .find({
            lastPurchased: {
               $lt: new Date(),
               $gte: new Date(new Date() - interval),
            },
         })
         .limit(100)
         .toArray();
      rank(docs);
      const data = transform(docs);
      res.status(200);
      res.json({ data, size: data.length });
   } catch (err) {
      console.error('Err fetching recent records:', err);
      res.status(500);
      res.end('Internal Server Error');
   }
});

export default handler;
