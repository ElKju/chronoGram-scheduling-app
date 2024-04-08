import { Availability_SetFormDataFinal } from "../schedules/scheduleInterfaces";

export interface suggestedSchedules  {
    calendar: number;
    events: events[];
    id:number;
    finalized:boolean;
}

export interface events  {
    availability_details: Availability_SetFormDataFinal;
    invitee_details: Invitee_Details;
}

export interface Invitee_Details  {
    contact: number;
    first_name: string;
    last_name: string;
}
