import { ExactMatchItem, ReceiverOfItem, ResultObject, SearchDataItem } from "../App";

interface NameAndPhonePayload {
  type: 'NameAndPhone';
  name: string;
  phone: string;
}

interface NameAndEmailPayload {
  type: 'NameAndEmail';
  name: string;
  email: string;
}

interface NameAndAddressPayload {
  type: 'NameAndAddress';
  name: string;
  addressLn1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface NameAndAccountNbrPayload {
  type: 'NameAndAccountNbr';
  name: string;
  accountNbr: string;
}

interface ShipperUserIdPayload {
  type: 'ShipperUserId';
  shipperUserId: string;
}

export type SearchPayload =
  | NameAndPhonePayload
  | NameAndEmailPayload
  | NameAndAddressPayload
  | NameAndAccountNbrPayload
  | ShipperUserIdPayload;

export function prepareResultObjectsFromData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchData: Record<string, any>
): ResultObject[] {
  const resultObjects: ResultObject[] = [];
  searchData.forEach((item: SearchDataItem) => {
        item.exactMatch.forEach((exactMatchItem: ExactMatchItem ) => {
          exactMatchItem.receiverOf.forEach((receiverOfItem: ReceiverOfItem) => {
            const resultObject: ResultObject = {
                receiverOfItem
            };
            resultObjects.push(resultObject);
          });
        });
  });
  return resultObjects;
}

export async function makeSearchQuery(payload: SearchPayload): Promise<ResultObject[] | undefined> {
  const url = 'http://localhost:3007/searchData';
  const headers = {
    'Content-Type': 'application/json',
    'mode': payload.type,
    ...payload,
  };

  try {
    const response = await fetch(url, { method: 'GET', headers });
    // Handle the response as needed
      const json = await response.json();
    console.info("Response: " + json);
    return prepareResultObjectsFromData(json);
  } catch (error) {
    // Handle errors
    console.error('Error making search query:', error);
  }
}

// // Example usage:
// const nameAndPhonePayload: NameAndPhonePayload = { type: 'NameAndPhone', name: 'stephan ridel', phone: '1251255648' };
// makeSearchQuery(nameAndPhonePayload);

// const nameAndEmailPayload: NameAndEmailPayload = { type: 'NameAndEmail', name: 'stephan ridel', email: 'stephan@myemail.com' };
// makeSearchQuery(nameAndEmailPayload);

// const nameAndAddressPayload: NameAndAddressPayload = {
//   type: 'NameAndAddress',
//   name: 'stephan ridel',
//   addressLn1: '123 west abc street',
//   city: 'fair lawn',
//   state: 'nj',
//   zip: '07410',
//   country: 'us',
// };
// makeSearchQuery(nameAndAddressPayload);

// const nameAndAccountNbrPayload: NameAndAccountNbrPayload = { type: 'NameAndAccountNbr', name: 'temu', accountNbr: '0000c5g34' };
// makeSearchQuery(nameAndAccountNbrPayload);

// const shipperUserIdPayload: ShipperUserIdPayload = { type: 'ShipperUserId', shipperUserId: 'temushpid' };
// makeSearchQuery(shipperUserIdPayload);