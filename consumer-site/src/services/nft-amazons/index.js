import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyAbnoFWEHGEz8ZZbfHQAzfAl5YCovjjATo",
  authDomain: "crypto-service-starter.firebaseapp.com",
  projectId: "crypto-service-starter",
  storageBucket: "crypto-service-starter.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MSG_SENDER_ID || "267559044017",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:267559044017:web:bcb105da2a8b5850b93390"
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