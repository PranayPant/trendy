import nextConnect from 'next-connect';
import middleware from '../../../middleware/db';
import { rank } from '../../../data';

const handler = nextConnect();
handler.use(middleware);

function transform(docs) {
   function getElapsedTime(lastPurchased) {
      const ms = new Date().getTime() - new Date(`${lastPurchased}`).getTime();
      let time = Math.ceil(ms / 60000);
      if (time < 60) {
         time = `${time} min ago`;
      } else if (time >= 60 && time < 1440) {
         const hrs = Math.ceil(time / 60);
         time = `${hrs} ${hrs > 1 ? 'hours' : 'hour'} ago`;
      } else {
         const days = Math.ceil(time / 1440);
         time = `${days} ${days > 1 ? 'days' : 'day'} ago`;
      }
      return time;
   }
   const data = docs.map(
      ({ name, lastPurchased, lastNumSold, description, cost }) => ({
         name,
         lastPurchased: getElapsedTime(lastPurchased),
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
