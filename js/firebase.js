// Import the functions you need from the SDKs you need
import { initializeApp } from "../lib/firebase-app.js";
import { getAnalytics } from "../lib/firebase-analytics.js";
import { getDatabase, ref, set, onValue, remove, get, child, update } from "../lib/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDkhxYpa2R6vpgJ9aP29BPH6U8HAhGLeI4",
    authDomain: "checklist-ebf66.firebaseapp.com",
    databaseURL: "https://checklist-ebf66-default-rtdb.firebaseio.com",
    projectId: "checklist-ebf66",
    storageBucket: "checklist-ebf66.appspot.com",
    messagingSenderId: "742713182144",
    appId: "1:742713182144:web:5b43e918100d643f23aa25",
    measurementId: "G-102E0JJETY"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export { getDatabase, ref, set, onValue, remove, get, child, update }

function writeListData(cod, title, itens) {
    const db = getDatabase();
    set(ref(db, 'lists/' + cod), {
        title: title,
        cod: cod,
        itens: itens
    })
}
function removeListData(cod) {
    const db = getDatabase()
    remove(ref(db, 'lists/' + cod))
}
function readListData(cod) {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `lists/${cod}`)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        return snapshot.val()
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
}
const itens = [
    {
        title: 'Frutas',
        checked: false
    },
    {
        title: 'Água sanitária',
        checked: false
    },
    {
        title: 'Sabão líquido',
        checked: false
    }
]

//writeListData('derusa', 'Minha lista', itens)
//readListData('derusa')
//removeListData('derusa')