import React, {  useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { Activity } from './models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';


function App() {
  const [activitie, setActivitie] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

useEffect(() => {
    agent.Activitie.list().then(response => {
        let activitie: Activity[]= [];
        response.forEach(activity =>{
          activity.date = activity.date.split('T')[0];
          activitie.push(activity);
        })
         setActivitie(activitie);
         setLoading(false);
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
  setSubmitting(true);
  if(activity.id){
    agent.Activitie.update(activity).then(() => {
      setActivitie([...activitie.filter(x => x.id !== activity.id), activity])
      setSelectedActivity(activity);
      setEditMode(false);
      setSubmitting(false);
          
    })
  } else{
    activity.id = uuid();
    agent.Activitie.create(activity).then(() => {
      setActivitie([...activitie, activity])
      setSelectedActivity(activity);
      setEditMode(false);
      setSubmitting(false);
      
      
    })
  }
}
function handleDeleteActivity(id: string){
  
  setSubmitting(true);
  agent.Activitie.delete(id).then(() => {
  setActivitie([...activitie.filter(x => x.id !== id)]);
  setSubmitting(false);
  })
  
}

if (loading) return <LoadingComponent content='Loading app'></LoadingComponent>
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
    submitting={submitting}
  />
  </Container>
          
    </>
  );
}

export default App;
