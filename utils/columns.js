import {
   FormLabel,
   TextField,
   FormGroup,
   FormControlLabel,
   Checkbox,
} from '@material-ui/core';

function transform(lastPurchased) {
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

function normalize(age) {
   if (!age) return null;
   const digits = age.match(/[0-9]+/gi);
   if (!digits || digits.length === 0) return null;
   let min = parseInt(digits[0]);
   if (age.includes('hour')) {
      min = min * 60;
   } else if (age.includes('day')) {
      min = min * 60 * 24;
   }
   return min;
}

export default function makeColumns(state, setState) {
   return [
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
            sort: true,
            customBodyRender: transform,
            filterType: 'custom',
            customFilterListOptions: {
               render: (v) => {
                  if (v[0] && v[1] && !state.filterChecked) {
                     return `Start Time(min): ${v[0]}, End Time(min): ${v[1]}`;
                  } else if (v[0]) {
                     return `Start Time(min): ${v[0]}`;
                  } else if (v[1]) {
                     return `End Time(min): ${v[1]}`;
                  }
                  return [];
               },
               update: (filterList, filterPos, index) => {
                  console.log(
                     'customFilterListOnDelete: ',
                     filterList,
                     filterPos,
                     index,
                  );

                  if (filterPos === 0) {
                     filterList[index].splice(filterPos, 1, '');
                  } else if (filterPos === 1) {
                     filterList[index].splice(filterPos, 1);
                  } else if (filterPos === -1) {
                     filterList[index] = [];
                  }

                  return filterList;
               },
            },
            filterOptions: {
               names: [],
               logic(_age, filters) {
                  const age = normalize(_age);
                  const lower = normalize(filters[0]);
                  const upper = normalize(filters[1]);
                  if (lower && upper) {
                     return age < lower || age > upper;
                  } else if (lower) {
                     return age < lower;
                  } else if (upper) {
                     return age > upper;
                  }
                  return false;
               },
               display: (filterList, onChange, index, column) => (
                  <div>
                     <FormLabel>Last Sold </FormLabel>
                     <FormGroup row={state.windowWidth < 400 ? false : true}>
                        <TextField
                           label="min"
                           value={filterList[index][0] || ''}
                           onChange={(event) => {
                              filterList[index][0] = event.target.value;
                              onChange(filterList[index], index, column);
                           }}
                           style={{ width: '45%', marginRight: '5%' }}
                        />
                        <TextField
                           label="max"
                           value={filterList[index][1] || ''}
                           onChange={(event) => {
                              filterList[index][1] = event.target.value;
                              onChange(filterList[index], index, column);
                           }}
                           style={{ width: '45%' }}
                        />
                     </FormGroup>
                  </div>
               ),
            },
         },
      },
      {
         name: 'quantity',
         label: 'Quantity',
         options: {
            filter: true,
            sort: true,
         },
      },
      {
         name: 'description',
         label: 'Description',
         options: {
            filter: true,
            sort: true,
         },
      },
      {
         name: 'price',
         label: 'Price',
         options: {
            filter: true,
            sort: true,
         },
      },
   ];
}
