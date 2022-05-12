import React, {  useEffect, useState } from 'react';

import Axios from 'axios';
import { Container } from 'semantic-ui-react';
import { Activity } from './models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';

function App() {
  const [activitie, setActivitie] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
useEffect(() => {
    Axios.get<Activity[]>('http://localhost:5000/api/activitie').then(response => {
         setActivitie(response.data);
    })
}, [])

function handleSelectActivity(id: string){
  setSelectedActivity(activitie.find(x => x.id === id))
}

function handleCancelSelectActivity(){
  setSelectedActivity(undefined);
}

function handleFormOpen(id?: string){
  id ? handleSelectActivity(id) : handleCancelSelectActivity();
  setEditMode(true);
}

function handleFormClose(){
  setEditMode(false);
}

function handleCreateOrEditActivity(activity: Activity){
  activity.id 
    ? setActivitie([...activitie.filter(x => x.id !== activity.id), activity])
    : setActivitie([...activitie,{...activity, id: uuid()}]);
  setEditMode(false);
  setSelectedActivity(activity);
}
function handleDeleteActivity(id: string){
  setActivitie([...activitie.filter(x => x.id !== id)])
}
  return (

  <>
  <NavBar openForm={handleFormOpen} />
  <Container style={{marginTop: '7em'}}>
  <ActivityDashboard 
    activitie={activitie} 
    selectedActivity={selectedActivity}
    selectActivity={handleSelectActivity}
    cancelSelectActivity={handleCancelSelectActivity}
    editMode={editMode}
    openForm={handleFormOpen}
    closeForm={handleFormClose}
    createOrEdit={handleCreateOrEditActivity}
    deleteActivity={handleDeleteActivity}

  />
  </Container>
          
    </>
  );
}

export default App;
