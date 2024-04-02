import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse';

//Define Interfaces
interface ISale {
  Id: number;
  storeId: number;
  marketPlace?: string;
  storeName?: string;
  country?: string;
  orderId: string;
  latest_ship_date: string;
  shipment_status: string;
  destination: string;
  items: number;
  orderValue: number;
  overDueDays: number;
};

interface IStore {
  storeId: number;
  marketplace: string;
  country: string;
  shopName: string;
};

//Function to calculate overdue days
function getDays(shipDate: string): number {

  let date1 = new Date(shipDate);
  let date2 = new Date();

  // Calculating the time difference
  // of two dates
  let Difference_In_Time =
    date2.getTime() - date1.getTime();

  // Calculating the no. of days between
  // two dates
  let Difference_In_Days =
    Math.round
      (Difference_In_Time / (1000 * 3600 * 24));

  return Difference_In_Days;
}

//Export Function to to get Sales and Store data
export function getSales(req: any, res: any) {
   //Validate inputs
   if (!req)
   return res.json({ sales: [], totalPages: 0 });

  //Set CSV path
  const csvStoreFilePath = path.resolve(__dirname, '../data/stores.csv');
  const csvSalesFilePath = path.resolve(__dirname, '../data/orders/orders.csv');
  var data: ISale[] = [];
  var storeData: IStore[] = [];

  fs.createReadStream(csvStoreFilePath).pipe(parse({ delimiter: ",", from_line: 2 }))
    .on('data', function (row) {
      var item: IStore = {
        storeId: parseInt(row[0]),
        marketplace: row[1],
        country: row[2],
        shopName: row[3]
      };

      storeData.push(item)
    })
    .on('end', function () {

     

      // Get request params
      const page = req.query.page ? parseInt(req.query.page) : 0;
      const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0;
      const sortByDaysVal = req.query.sortByDays ? parseInt(req.query.sortByDays) : 0;

      
      // Calculate the start and end indexes for the requested page
      const startIndex = (page - 1) * pageSize;
      const endIndex = page * pageSize;

      fs.createReadStream(csvSalesFilePath).pipe(parse({ delimiter: ",", from_line: 2 }))
        .on('data', function (row) {
          //Code for format string
          var splitted = row[3].split("/");
          var formatedDate: string = splitted[2] + '-' + splitted[1] + '-' + splitted[0];
          //Find store from store list
          var store = storeData.find(({ storeId }) => storeId === parseInt(row[1]));

          var item: ISale = {
            Id: parseInt(row[0]),
            storeId: parseInt(row[1]),
            storeName: store?.shopName,
            marketPlace: store?.marketplace,
            country: store?.country,
            orderId: row[2],
            latest_ship_date: row[3],
            shipment_status: row[4],
            destination: row[5],
            items: parseInt(row[6]),
            orderValue: parseFloat(row[7]),
            overDueDays: getDays(formatedDate)
          };

          data.push(item)
        })
        .on('end', function () {
          //Sorting 
          if (sortByDaysVal === 1)
            data.sort((a: ISale, b: ISale) => a.overDueDays - b.overDueDays);
          else
            data.sort((a: ISale, b: ISale) => b.overDueDays - a.overDueDays);


          // Slice the products array based on the indexes
          const paginatedSales = data.slice(startIndex, endIndex);

          //console.log('Data loaded',paginatedSales);
          // Calculate the total number of pages
          const totalPages = Math.ceil(data.length / pageSize);

          // Send the paginated products and total pages as the API response
          res.json({ sales: paginatedSales, totalPages });

        })
    })
}