import { createContext, useContext } from "react"
import ActivityStore from "./ActivityStore";


interface store{
    activityStore: ActivityStore
}

export const store: store = {
        activityStore: new ActivityStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}