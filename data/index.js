import faker from 'faker';

let _orders = [],
   _products = [],
   _restaurants = [];

let _params = {
   numRestaurants: 50,
   numOrders: 200,
   numProducts: 5,
   purchaseInterval: 2,
};

function getLatestDate(date1, date2) {
   if (new Date(`${date1}`).getTime() > new Date(`${date2}`).getTime()) {
      return date1;
   }
   return date2;
}

function createProducts() {
   function createProduct() {
      const priceAmount = faker.finance.amount(1, 20, 2);
      return {
         _id: faker.random.uuid(),
         numRestaurants: 0,
         numOrders: 0,
         restaurantIds: [],
         orders: [],
         lastPurchased: null,
         name: faker.commerce.productName(),
         description: faker.commerce.productDescription(),
         cost: {
            amount: priceAmount,
            tag: `$${priceAmount}`,
         },
      };
   }
   for (let i = 0; i < _params.numProducts; i++) {
      _products.push(createProduct());
   }
}

function addProductsToOrder(orderId, timeOfPurchase, restaurantProductIds) {
   function orderSize() {
      return faker.random.number({ min: 5, max: restaurantProductIds.length });
   }
   function linkProductsToOrder(orderProducts) {
      for (let i = 0; i < orderSize(); i++) {
         const productId = faker.random.arrayElement(restaurantProductIds);
         for (let i = 0; i < _products.length; i++) {
            if (_products[i]._id === productId) {
               // Find the order the product is going to
               if (_products[i].orders.length === 0) {
                  _products[i].orders.push({
                     _id: orderId,
                     timeOfPurchase,
                     quantitySold: 1,
                  });
               } else {
                  let mult = false;
                  for (let j = 0; j < _products[i].orders.length; j++) {
                     if (_products[i].orders[j]._id === orderId) {
                        _products[i].orders[j].quantitySold += 1;
                        mult = true;
                     }
                  }
                  if (!mult) {
                     _products[i].orders.push({
                        _id: orderId,
                        timeOfPurchase,
                        quantitySold: 1,
                     });
                  }
               }
               _products[i].numOrders += 1;
               _products[i].lastPurchased = _products[i].lastPurchased
                  ? getLatestDate(_products[i].lastPurchased, timeOfPurchase)
                  : timeOfPurchase;
               orderProducts.push(productId);
            }
         }
      }
   }

   const orderProducts = [];
   linkProductsToOrder(orderProducts);
   return orderProducts;
}

function createOrders(restaurantId, restaurantProductIds) {
   function createOrder() {
      const _id = faker.random.uuid();
      const timeOfPurchase = faker.date.recent(_params.purchaseInterval);
      const products = addProductsToOrder(
         _id,
         timeOfPurchase,
         restaurantProductIds,
      );

      const order = {
         _id,
         restaurantId,
         numProducts: products.length,
         products,
         timeOfPurchase,
      };
      return order;
   }
   const orders = [];
   for (let i = 0; i < _params.numOrders; i++) {
      orders.push(createOrder(restaurantId));
   }
   _orders = _orders.concat(orders);
   return orders.map((o) => o._id);
}

function addProductsToRestaurant(restaurantId) {
   function inventorySize() {
      return faker.random.number({ min: 5, max: _params.numProducts });
   }
   function pickProduct() {
      let product = faker.random.arrayElement(_products);
      while (product.restaurantIds.includes(restaurantId)) {
         product = faker.random.arrayElement(_products);
      }
      return product;
   }
   function linkProductsToRestaurant(restaurantProducts) {
      for (let i = 0; i < inventorySize(); i++) {
         const product = pickProduct();
         for (let i = 0; i < _products.length; i++) {
            if (_products[i]._id === product._id) {
               _products[i].restaurantIds.push(restaurantId);
               _products[i].numRestaurants += 1;
               restaurantProducts.push(product._id);
            }
         }
      }
   }

   const restaurantProducts = [];
   linkProductsToRestaurant(restaurantProducts);
   return restaurantProducts;
}

function createRestaurants() {
   function createRestaurant() {
      const _id = faker.random.uuid();
      const productIds = addProductsToRestaurant(_id);
      const orderIds = createOrders(_id, productIds);
      return {
         _id,
         numOrders: orderIds.length,
         numProducts: productIds.length,
         orders: orderIds,
         products: productIds,
         name: faker.company.companyName(),
      };
   }
   for (let i = 0; i < _params.numRestaurants; i++) {
      _restaurants.push(createRestaurant());
   }
}

export function mock(params) {
   _params = { ..._params, ...params };
   createProducts();
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

export function rank(products) {
   // reverse sort by rank
   function comparator(p1, p2) {
      function reducer(acc, e) {
         // Get recency in minutes
         const r =
            (new Date().getTime() - new Date(`${e.timeOfPurchase}`).getTime()) /
            60000;

         // Get popularity coef
         const c = 100 / r;
         // Get quantity sold
         const q = e.quantitySold;

         return c * q + acc;
      }
      const s1 = p1.orders.reduce(reducer, 0);
      const s2 = p2.orders.reduce(reducer, 0);

      if (s1 < s1) return 1;
      if (s1 > s2) return -1;
      return 0;
   }

   products.sort(comparator);
}
