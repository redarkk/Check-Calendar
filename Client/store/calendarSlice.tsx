import { createSlice ,PayloadAction} from "@reduxjs/toolkit";

interface CalendarEvent {
    id: Number;
    product: string;
    technicianName:string,
    customerEmail:string,
    startTime:string,
    endTime:string,
    dateOfBooking:Date,
    // Add other properties as needed
  }

  const initialState: CalendarEvent[] = []; // Set the initial state as an array of CalendarEvent
const calendarSlice=createSlice({
    name:'calendar',
    initialState,
    reducers:{
        addEvent:(state,action:PayloadAction<CalendarEvent>)=>{
            state.push(action.payload);
        },
        removeEvent:(state,action:PayloadAction<Number>)=>{
            return state.filter((event)=>event.id!==action.payload);
        },
    }

});

export const {addEvent,removeEvent}= calendarSlice.actions;
export default calendarSlice.reducer;