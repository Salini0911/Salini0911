import React from "react";
import { Header, Menu } from "semantic-ui-react";
import Calendar from 'react-calendar'

export default function ActivityFilters(){
    return(
        <>
           <Menu vertical size='large' style={{width: '87%', marginTop: 26}} >
            <Header icon='filter' attached color='teal' content='Filters'/>
            <Menu.Item content='All Activities' />
            <Menu.Item content="I am going" />
            <Menu.Item content="I am hosting"/>
        </Menu>
        <Header/>
        <Calendar />
        </>
     
    )
}