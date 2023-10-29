import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2'; // Import SweetAlert2
import './Data.css'; // Import your custom CSS file

const firebaseConfig = {
  apiKey: "AIzaSyBIL08YXBsalBbQQwLMAcxcWTJF3Hi0bk8",
  authDomain: "bread-and-butter-6383f.firebaseapp.com",
  databaseURL: "https://bread-and-butter-6383f-default-rtdb.firebaseio.com",
  projectId: "bread-and-butter-6383f",
  storageBucket: "bread-and-butter-6383f.appspot.com",
  messagingSenderId: "46107145176",
  appId: "1:46107145176:web:f0c654b61525fc767bb8ad",
  measurementId: "G-55T342GB1T"
};
const app = initializeApp(firebaseConfig);

const EMAILJS_SERVICE_ID = 'service_uszvn6z';
const EMAILJS_TEMPLATE_ID = 'template_emahdns';
const EMAILJS_USER_ID = 'wRiEw_iWck_I-3pFC';

emailjs.init(EMAILJS_USER_ID);

function DataTable() {
  const [data, setData] = useState([]);

  const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'foodType', headerName: 'Food Type', width: 200 },
    { field: 'phoneNumber', headerName: 'Phone Number', type: 'number', width: 150 },
    { field: 'address', headerName: 'Address', width: 250 },
    { field: 'qty', headerName: 'Quantity', type: 'number', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => {
        const row = params.row;

        return (
          <div>
            <button
              onClick={() => handleAccept(row.id, row.email)}
              className="accept-button" // Apply styling via CSS class
            >
              Accept
            </button>
            <button
              onClick={() => handleReject(row.id)}
              className="reject-button" // Apply styling via CSS class
            >
              Reject
            </button>
          </div>
        );
      },
    },
  ];

  const handleAccept = (id, userEmail) => {
    // Send an email to the user
    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        to_email: userEmail, // The recipient's email address
        // Add other email parameters as needed
      })
   
const database = getDatabase(app);
const databaseRef = ref(database, 'requests/' + id);

remove(databaseRef)
.then(() => {
  console.log('Email sent:');
  // Show a success message using SweetAlert
  Swal.fire({
    icon: 'success',
    title: 'Success',
    text: 'You have accepted the request',
  });

})
.catch((error) => {
  console.error('Email error:', error);
});
};
  const handleReject = (id) => {
    // Delete the data from Firebase
    const database = getDatabase(app);
    const databaseRef = ref(database, 'requests/' + id);
  
    // Remove the rejected request
    const updatedData = data.filter((row) => row.id !== id);
    setData(updatedData);
  
    // Use 'remove' to delete the data from Firebase
    remove(databaseRef)
      .then(() => {
        console.log('Data removed from Firebase');
        // Show a "rejected" message using SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Rejected',
          text: 'You have canceled the request',
        });
      })
      .catch((error) => {
        console.error('Error removing data from Firebase:', error);
      });
  };
  
  useEffect(() => {
    const database = getDatabase(app);
    const databaseRef = ref(database, 'requests');

    const unsubscribe = onValue(databaseRef, (snapshot) => {
      const dataFromFirebase = snapshot.val();
      if (dataFromFirebase) {
        const dataArray = Object.entries(dataFromFirebase).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setData(dataArray);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={data} columns={columns} pageSize={5} checkboxSelection />
    </div>
  );
}

export default DataTable;
