import Head from 'next/head';
import styles from '../styles/Home.module.css';
import InfiniteScroll from 'react-infinite-scroller';
import MUIDataTable from 'mui-datatables';
import { useState } from 'react';

export default function Home(props) {
   const [state, setState] = useState({ data: props.data });
   const columns = [
      {
         name: 'name',
         label: 'Name',
         options: {
            filter: true,
            sort: true,
         },
      },
      {
         name: 'lastPurchased',
         label: 'Last Sold',
         options: {
            filter: true,
            sort: false,
         },
      },
      {
         name: 'description',
         label: 'Description',
         options: {
            filter: true,
            sort: false,
         },
      },
      {
         name: 'price',
         label: 'Price',
         options: {
            filter: true,
            sort: false,
         },
      },
   ];

   async function fetchMoreData() {
      const res = await fetch(`${window.location.origin}/api/rank`, {
         method: 'POST',
         body: {
            days: 2,
         },
      });
      const body = await res.json();
      const data = body.data;
      setState((prev) => ({ ...prev, data: prev.data.concat(data) }));
   }

   return (
      <div className={styles.container}>
         <Head>
            <title>Trendy</title>
         </Head>

         <main className={styles.main}>
            <h1 className={styles.title}>Trendy</h1>

            <div className={styles.grid}>
               <InfiniteScroll
                  pageStart={0}
                  loadMore={fetchMoreData}
                  hasMore={true}
                  loader={
                     <div className="loader" key={0}>
                        Loading ...
                     </div>
                  }
               >
                  <MUIDataTable
                     data={state.data}
                     columns={columns}
                     pagination={false}
                     options={{
                        responsive: 'simple',
                        pagination: false,
                        selectableRows: 'none',
                     }}
                  />
               </InfiniteScroll>
            </div>
         </main>

         <footer className={styles.footer}>
            <a
               href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
               target="_blank"
               rel="noopener noreferrer"
            >
               Powered by{' '}
               <img
                  src="/vercel.svg"
                  alt="Vercel Logo"
                  className={styles.logo}
               />
            </a>
         </footer>
      </div>
   );
}

export async function getStaticProps() {
   let data = null;
   try {
      const res = await fetch(`${process.env.TRENDY_APP_URL}/api/rank`, {
         method: 'POST',
         body: {
            days: 2,
         },
      });
      const body = await res.json();
      data = body.data;
   } catch (err) {
      console.error('Err getting static props for page /:', err);
   } finally {
      // The value of the `props` key will be
      //  passed to the `Home` component
      return {
         props: { data },
      };
   }
}
