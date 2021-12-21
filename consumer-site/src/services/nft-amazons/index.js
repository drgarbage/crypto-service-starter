import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBvAKWcZ_3d17NgKRD5hV50C6Jcah6Wy-s",
  authDomain: "bemaster-3de27.firebaseapp.com",
  projectId: "bemaster-3de27",
  storageBucket: "bemaster-3de27.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MSG_SENDER_ID || "643018371266",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:643018371266:web:5733874f8c2e60d8f78b5b",
  measurementId: "G-0L9GF8VDW8"
};

firebase.initializeApp(firebaseConfig);

// context: { web3, wallet, contract }
export const publish = async (context, image, meta) => {
  let { wallet, contract } = context;
  
  let { events, status } = await contract
    .methods
    .mint(wallet.account)
    .send({from:wallet.account});

  if(!status) throw new Error('Publish failed.');
  
  let tokenId = events.Transfer.returnValues.tokenId;
    
  meta.tokenId = tokenId;
  // upload image
  let snapImg = await firebase
    .storage()
    .ref()
    .child(`nft-amazons/${tokenId}.jpg`)
    .put(image);

  meta.image = await snapImg.ref.getDownloadURL();
  
  // upload meta
  await firebase
    .firestore()
    .doc(`nft-amazons/${tokenId}`)
    .set(meta, {merge:true});

  return meta;
}

export const publishAndBook = async (context, image, meta, price) => {
  let { wallet, web3, contract, marketContract} = context;

  let publishedMeta = await publish(context, image, meta);
  await contract.methods.approve(marketContract.options.address, publishedMeta.tokenId)
    .send({from:wallet.account});
  let book = await marketContract.methods
    .book(contract.options.address, publishedMeta.tokenId, web3.utils.toWei(price))
    .send({from:wallet.account});
  
  return book;
}