import { observer } from "mobx-react-lite";
import React, { Fragment } from "react";

import {  Header } from "semantic-ui-react";


import { useStore } from "../../../app/stores/store";
import ActivityListItem from "./ActivityListItem";

export default observer( function ActivityList(){
     const {activityStore} = useStore();
     const { groupActivitie} = activityStore;
     
    return (
        <>
            {groupActivitie.map(([group, activitie]) =>(
                <Fragment key={group} >
                    <Header sub color='teal'>
                        {group}
                    </Header>                    
                    {activitie.map(activity => (
                    <ActivityListItem key={activity.id} activity={activity} />
                    ))}                
                </Fragment>
            ))}
        </>
        
    )
})