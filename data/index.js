import faker from 'faker';
import fs from 'fs';

let _orders = [],
   _products = [],
   _restaurants = [];

let _params = {
   numRestaurants: 50,
   numOrders: 200,
   numProducts: 5,
   purchaseInterval: 2,
};

function createProducts(orderId, restaurantId) {
   function createProduct() {
      const _id = faker.random.uuid();
      const priceAmount = faker.finance.amount();
      return {
         _id,
         orderId,
         restaurantId,
         name: faker.commerce.productName(),
         description: faker.commerce.productDescription(),
         cost: {
            amount: priceAmount,
            tag: `$${priceAmount}`,
         },
      };
   }
   const products = [];
   for (let i = 0; i < _params.numProducts; i++) {
      products.push(createProduct());
   }
   _products = _products.concat(products);
   return products.map((p) => p._id);
}

function createOrder(restaurantId) {
   const _id = faker.random.uuid();
   const products = createProducts(_id, restaurantId);
   return {
      _id,
      restaurantId,
      products,
      timeOfPurchase: faker.date.recent(_params.purchaseInterval),
   };
}

function createOrders(restaurantId) {
   const orders = [];
   for (let i = 0; i < _params.numOrders; i++) {
      orders.push(createOrder(restaurantId));
   }
   _orders = _orders.concat(orders);
   return orders.map((o) => o._id);
}

function createRestaurant() {
   const _id = faker.random.uuid();
   return {
      _id,
      orders: createOrders(_id),
      name: faker.company.companyName(),
   };
}

function createRestaurants() {
   for (let i = 0; i < _params.numRestaurants; i++) {
      _restaurants.push(createRestaurant());
   }
}

export default function mock(params) {
   _params = { ..._params, ...params };
   createRestaurants();

   const restaurantBulk = _restaurants.map((r) => ({
      insertOne: { document: r },
   }));
   const orderBulk = _orders.map((o) => ({ insertOne: { document: o } }));
   const productBulk = _products.map((p) => ({ insertOne: { document: p } }));

   return {
      productBulk,
      orderBulk,
      restaurantBulk,
   };
}
