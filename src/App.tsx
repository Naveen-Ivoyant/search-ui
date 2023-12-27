import { useEffect } from 'react';
import './App.css'
import { SearchUI } from './components/SearchUI';
import {useGetSearchedDataQuery} from './features/api/apiSlice'

export type ShipmentDataItem = {
  partyType: string;
  name: string;
  addressLn1: string;
  city: string;
  state: string;
  zip: string;
  adTknNr?: string,
  phone?: string,
  rICd: string,
  
};

export type ReceiverOfItem = {
  trackingId: any;
  shipmentData: ShipmentDataItem[];
};

export type ExactMatchItem = {
  receiverOf: ReceiverOfItem[];
};

export type SearchDataItem = {
  exactMatch: ExactMatchItem[];
};

export interface ResultObject {
  receiverOfItem: ReceiverOfItem;
}

function App() {

  const {
    data: searchData,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetSearchedDataQuery();

  const receiverOfItemArray: ResultObject[] = [];

  useEffect(() => {
    if (isSuccess) {
      console.log('Raw Data loaded:', searchData);

      searchData.forEach((item: SearchDataItem, firstIndex: number) => {
        item.exactMatch.forEach((exactMatchItem: ExactMatchItem, exactMatchIndex: number) => {
          exactMatchItem.receiverOf.forEach((receiverOfItem: ReceiverOfItem, receiverOfIndex: number) => {
            const resultObject: ResultObject = {
                receiverOfItem
            };
            receiverOfItemArray.push(resultObject);
          });
        });
      });
      
      console.log(receiverOfItemArray);

    } else if (isError) {
      console.error('Error loading data:', error);
    }
  }, [isSuccess, isError, searchData, error]);

  return (
    <div className="app-container">
      {isSuccess && <SearchUI receiverOfItemArray={receiverOfItemArray} />}
    </div>
  );
}

export default App















// interface ResultArray {
//   firstIndex: number;
//   exactMatchIndex: number;
//   receiverOfIndex: number;
//   value: string;
// }

// console.log(searchData[0].exactMatch[0].receiverOf[0].shipmentData)

// shipmentData: (2) [{…}, {…}]
// 0 : {partyType: 'ShipTo', name: 'STEVEN RIDEL', addressLn1: '123 WEST ABC street', city: 'FAIR LAWN', state: 'NJ', zip: '07410'}
// 1 : {partyType: 'ShipFrom', name: 'CONVERSE', addressLn1: '11500 80TH avenue', city: 'PLEASANT PRAIRIE', state: 'WI', zip: '531582909'}

// op:
// Item at indices [0, 0, 2]
// ShipmentData[0]:
// partyType: ShipTo
// name: STEPHAN RIDEL
// addressLn1: 123 WEST ABC street
// city: FAIR LAWN
// state: NJ
// zip: 07410
  
// ShipmentData[1]:
// partyType: ShipFrom
// name: CONVERSE
// addressLn1: 11500 80TH avenue
// city: PLEASANT PRAIRIE
// state: WI
// zip: 531582909

// const resultObject = {
//   firstIndex,
//   exactMatchIndex,
//   receiverOfIndex,
//   value: `Item at indices [${firstIndex}, ${exactMatchIndex}, ${receiverOfIndex}]`,
// };

    // Fetch Dynamically
    // searchData.forEach((item: SearchDataItem, firstIndex: number) => {
    //   item.exactMatch.forEach((exactMatchItem: ExactMatchItem, exactMatchIndex: number) => {
    //     exactMatchItem.receiverOf.forEach((receiverOfItem: ReceiverOfItem, receiverOfIndex: number) => {
    //       console.log(
    //         `Item at indices [${firstIndex}, ${exactMatchIndex}, ${receiverOfIndex}]`
    //       );

    //       // Log information for each object in shipmentData
    //       receiverOfItem.shipmentData.forEach((shipmentDataItem: ShipmentDataItem, shipmentDataIndex: number) => {
    //         console.log(`   ShipmentData[${shipmentDataIndex}]:`);
    //         console.log(`   partyType: ${shipmentDataItem.partyType}`);
    //         console.log(`   name: ${shipmentDataItem.name}`);
    //         console.log(`   addressLn1: ${shipmentDataItem.addressLn1}`);
    //         console.log(`   city: ${shipmentDataItem.city}`);
    //         console.log(`   state: ${shipmentDataItem.state}`);
    //         console.log(`   zip: ${shipmentDataItem.zip}`);
    //         console.log(`   adTknNr: ${shipmentDataItem.adTknNr}`);
    //         console.log(`   phone: ${shipmentDataItem.phone}`);
    //         console.log(`   rICd: ${shipmentDataItem.rICd}`);

    //       });
    //     });
    //   });
        // });