import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';

const ManageContacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalContacts, setTotalContacts] = useState<number>(0);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchContacts('http://127.0.0.1:8000/contacts/list/all');
  }, []);

  const fetchContacts = async (url: string) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const data = await response.json();
      const contactsWithId = data.results.map((contact: Contact, index: number) => ({ ...contact, id: index + 1 }));
      setTotalContacts(data.count);
      setContacts(contactsWithId);
      setNextPageUrl(data.next);
      if(data.next===null){
        setNextPageUrl(data.previous)
      }
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('An error occurred:', error);
      setError('Failed to fetch contacts. Please try again later.');
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'first_name', headerName: 'First Name', width: 150, editable: true},
    { field: 'last_name', headerName: 'Last Name', width: 150, editable: true },
    { field: 'email_address', headerName: 'Email Address', width: 300, editable: true },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <Button onClick={() => handleEdit(params.row.id)}>Edit</Button>
          <Button onClick={() => handleDelete(params.row.id)}>Delete</Button>
          <Button onClick={() => handleDelete(params.row.id)}>Test</Button>
        </>
      ),
    },
  ];

  const handleEdit = (contactId: number) => {
    // Handle edit action here
    console.log(`Editing contact with ID: ${contactId}`);
  };

  const handleDelete = (contactId: number) => {
    // Handle delete action here
    console.log(`Deleting contact with ID: ${contactId}`);
  };

  const handleAdd = () => {
    // Handle delete action here
    console.log('Add contact here');
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const handleNextPage = () => {
    if (nextPageUrl) {
      fetchContacts(nextPageUrl);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh', 
      }}
    >
      <h1>Manage Contacts</h1>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleAdd()}
      >
        Add Contact
      </Button>
      <div
        style={{
          height: 'calc(100% - 200px)', 
          width: '80vw', 
          maxWidth: '1000px', 
        }}
      ></div>
      <div
        style={{
          height: 'calc(100% - 100px)', 
          width: '80vw', 
          maxWidth: '1000px', 
        }}
      >
        <DataGrid 
          rowCount={totalContacts} 
          rows={contacts} 
          columns={columns}
          editMode="row"
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          paginationMode="server"
          onPaginationModelChange={handleNextPage}
          pageSizeOptions={[10]}
        />
      </div>
    </div>
  );  
};

export default ManageContacts;

interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email_address: string;
}