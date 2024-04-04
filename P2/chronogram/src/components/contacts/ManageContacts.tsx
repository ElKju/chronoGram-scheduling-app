import React, { useState, useEffect, useRef } from 'react';
import { Button, CircularProgress} from '@mui/material';
import { DataGrid, GridCallbackDetails, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddContactModal from './AddContactModal';
import { Contact, ContactFormData } from './contactInterfaces';
import EditContactModal from './EditContactModal';

const ManageContacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalContacts, setTotalContacts] = useState<number>(0);
  let previousUrl = useRef<string | null>(null);
  let nextUrl = useRef<string | null>(null);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const contactInit: Contact = {
    id:111111111111,
    first_name: "testing",
    last_name: "testing",
    email_address: "testing@gmail.com"
  }
  const [selectedContact, setSelectedContact] = useState<Contact>(contactInit);
  const [url, setUrl] = useState<string>('http://127.0.0.1:8000/contacts/list/all');


  useEffect(() => {
    fetchContacts(url);
  }, [url]);

  const fetchContacts = async (url: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const data = await response.json();
      nextUrl.current = data.next;
      previousUrl.current = data.previous;
      const contactsWithId = data.results.map((contact: Contact) => ({ ...contact}));
      setTotalContacts(data.count);
      setContacts(contactsWithId);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('An error occurred:', error);
      setError('Failed to fetch contacts. Please try again later.');
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'first_name', headerName: 'First Name', width: 150, headerAlign: 'center'},
    { field: 'last_name', headerName: 'Last Name', width: 150, headerAlign: 'center'},
    { field: 'email_address', headerName: 'Email Address', width: 300, headerAlign: 'center'},
    {
      field: 'actions',
      headerName: 'Actions',
      headerAlign: 'center',
      width: 175,
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button 
            style={{ textTransform: 'none', fontSize: '1rem' }} 
            startIcon={<EditIcon />} 
            onClick={() => handleEditButtonClick(params.row.id)}>Edit</Button>
            <EditContactModal
              open={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onSubmit={handleEditContact} 
              contact={selectedContact}/>
          <Button 
            style = {{textTransform: 'none', fontSize:'1rem'}} 
            startIcon = {<DeleteIcon/>} 
            onClick={() => handleDelete(params.row.id)}>Delete</Button>
        </div>
      ),
      
    },
  ];

  const handleAddContact = async (contactData: ContactFormData) => {

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://127.0.0.1:8000/contacts/create/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        body: JSON.stringify(contactData),
      });
      if (!response.ok) {
        throw new Error('Failed to edit contact');
      }
    } catch (error) {
      console.error('Error editing contact:', error);
    }
    setIsAddContactModalOpen(false);
    window.location.reload()
  };

  const handleEditButtonClick = (contactId: number) => {
    const selectedContact = contacts.find(contact => contact.id === contactId);
    if (selectedContact!==null && selectedContact!==undefined) {
      // If the contact is found, set it as the selected contact and open the edit modal
      setSelectedContact(selectedContact);
      setIsEditModalOpen(true);
    } else {
      console.error(`Contact with ID ${contactId} not found.`);
    }
  };

  const handleEditContact = async (editedContact: ContactFormData, contactId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://127.0.0.1:8000/contacts/${contactId}/edit/`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedContact),
      });
      if (!response.ok) {
        throw new Error('Failed to edit contact');
      }
    } catch (error) {
      console.error('Error editing contact:', error);
    }
    setIsEditModalOpen(false);
    window.location.reload()
  };

  const handleDelete = async (contactId: number) => {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`http://127.0.0.1:8000/contacts/delete/?contact_ids=${contactId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
    window.location.reload()
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  const handlePage = (model: GridPaginationModel, details: GridCallbackDetails<any>) => {

    if(previousUrl.current==null && nextUrl.current){
      setUrl(nextUrl.current)
    }

    if (previousUrl.current && nextUrl.current == null){
      setUrl(previousUrl.current)
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        paddingBottom: '3rem',
      }}
    >
      <h1>Manage Contacts</h1>
      <br/>
      <div style={{ flex: '1', overflowY: 'auto' }}>
      <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-start' }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setIsAddContactModalOpen(true)}
        style={{ textTransform: 'none', fontSize: '1rem', padding: '5px 10px' }}
      >
        Add Contact
      </Button>
      <AddContactModal
        open={isAddContactModalOpen}
        onClose={() => setIsAddContactModalOpen(false)}
        onSubmit={handleAddContact}
      />
      </div>
        <DataGrid 
          rowCount={totalContacts} 
          rows={contacts} 
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          paginationMode="server"
          onPaginationModelChange={handlePage}
          pageSizeOptions={[10]}
        />
      </div>
    </div>
  );
};

export default ManageContacts;