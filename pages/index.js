import Head from 'next/head';
import styles from '../styles/Home.module.css';
import InfiniteScroll from 'react-infinite-scroller';
import MUIDataTable from 'mui-datatables';
import { useEffect, useState } from 'react';

import Loader from '../components/Loader';
import makeColumns from '../utils/columns';

export default function Home(props) {
   const [state, setState] = useState({
      data: props.data,
      paginationIndex: 10,
      paginatedData: props.data.slice(0, 10),
      filterChecked: false,
      loading: false,
   });

   async function fetchMoreData() {
      if (window.scrollY + window.innerHeight === document.body.offsetHeight) {
         console.log(state.paginationIndex, state.data.length);
         if (state.paginationIndex < state.data.length) {
            console.log('appending data');
            setState((prev) => {
               const start = prev.paginationIndex;
               const end = prev.paginationIndex + 10;
               const records = [...prev.paginatedData];
               const newSlice = prev.data.slice(start, end);
               const newRecords = records.concat(newSlice);
               return {
                  ...prev,
                  paginationIndex: end,
                  paginatedData: newRecords,
               };
            });
         } else {
            console.log('async data call');
            setState((prev) => ({
               ...prev,
               loading: true,
            }));
            let data = [];
            try {
               const res = await fetch(`${window.location.origin}/api/rank`, {
                  method: 'POST',
                  body: {
                     days: 2,
                  },
               });
               const body = await res.json();
               data = body.data;
            } catch (err) {
               console.error('Err fetching data:', err);
            }
            setState((prev) => {
               const start = prev.paginationIndex;
               const end = prev.paginationIndex + 10;
               const records = [...prev.paginatedData];
               const newData = prev.data.concat(data);
               const newSlice = newData.slice(start, end);
               const newRecords = records.concat(newSlice);
               return {
                  ...prev,
                  loading: false,
                  paginationIndex: end,
                  data: newData,
                  paginatedData: newRecords,
               };
            });
         }
      }
   }

   useEffect(() => {
      window.onscroll = async () => {
         setState((prev) => ({ ...prev, scroll: true }));
      };
      return () => (window.onscroll = null);
   }, []);

   useEffect(() => {
      if (state.scroll) {
         setState((prev) => ({ ...prev, scroll: false }));
         fetchMoreData();
      }
   }, [state]);

   return (
      <div className={styles.container}>
         <Head>
            <title>Trendy</title>
         </Head>
         {state.loading && <Loader />}

         <main className={styles.main}>
            <h1 className={styles.title}>Trendy</h1>

            <div className={styles.grid}>
               {state.data.length > 0 && (
                  <MUIDataTable
                     data={state.paginatedData}
                     columns={makeColumns(state, setState)}
                     pagination={false}
                     options={{
                        responsive: 'simple',
                        pagination: false,
                        selectableRows: 'none',
                     }}
                  />
               )}
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
   let data = [];
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
