import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Activity } from '../layout/models/activity';


export default class ActivityStore{
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = true;

    constructor(){
        makeAutoObservable(this)
    }

    get activitieByDate(){
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
        Date.parse(a.date) -    Date.parse(b.date));
    }
    get groupActivitie() {
        return Object.entries(
            this.activitieByDate.reduce((activitie, activity) =>{
                const date = activity.date;
                activitie[date] = activitie[date] ? [...activitie[date], activity] : [activity];
                return activitie;
            }, {} as {[key: string]: Activity[]})
        )
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try{
            const activitie = await agent.Activitie.list();
                    activitie.forEach(activity =>{
                   this.setActivity(activity);
                  })
                  this.setLoadingInitial(false);
        }catch (error){
            console.log(error);            
            this.setLoadingInitial(false);
           }
    }

    loadActivity = async (id:string) => {
        let activity = this.getActivity(id);
        if (activity){
            this.selectedActivity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activitie.details(id);
                this.setActivity(activity);
                runInAction(() => {
                    this.selectedActivity = activity;
                })                
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setActivity = (activity: Activity) => {
        activity.date = activity.date.split('T')[0];
        this.activityRegistry.set(activity.id, activity);
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
          try {
            await agent.Activitie.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })

        }catch (error){
            console.log(error);
            runInAction (() => {
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activitie.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;

            })
        } catch (error) {
            console.log(error);
            runInAction (() =>{
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;
        try {
            await agent.Activitie.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.loading = false;
            })
            
        } catch (error) {
            console.log(error);
            runInAction (() =>{
                this.loading = false;
            })
        }
    }
} 