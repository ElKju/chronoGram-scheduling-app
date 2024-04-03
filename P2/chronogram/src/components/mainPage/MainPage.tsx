import React from 'react';
import { Paper, Typography} from '@mui/material';
import ActionAreaCard from './ActionAreaCard'; // Import the modified ActionAreaCard component
import contactImg from './contactimg.jpg'
import scheduleImg from './scheduleimg.jpg'
import editImg from './editimg.png'

const MainBody: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 'calc(100vh - 64px - 56px)', padding: '20px' }}>
      <div style={{ width: '100%' }}>
        <BannerAndCardsContainer />
      </div>
    </div>
  );
};

const BannerAndCardsContainer: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Banner />
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%' }}>
        <ActionAreaCard title="Contacts" content="Create new contacts or manage your existing contacts here." buttonText="Manage Contacts" image = {contactImg} navigateTo='/contacts/list/all'/>
        <ActionAreaCard title="Schedules" content="Create new 1:1 schedules or manage your existing schedules here." buttonText="Manage Schedules" image = {scheduleImg} navigateTo = '/schedules/list/all' />
        <ActionAreaCard title="Edit Account Information" content="Manage account details here." buttonText="Edit Account" image = {editImg} navigateTo ='/account/edit'/>
      </div>
    </div>
  );
};

const Banner: React.FC = () => {
  return (
    <Paper elevation={3} style={{ width: '100%', padding: '40px', marginBottom: '20px', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        It Is Good To See You, User!
      </Typography>
      <Typography variant="body1">
        Welcome to ChronoGram! Create Or Manage Your 1:1 Schedules
      </Typography>
    </Paper>
  );
};

export default MainBody;
