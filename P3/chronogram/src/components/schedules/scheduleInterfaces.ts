import { Dayjs } from 'dayjs';
import { Contact } from '../contacts/contactInterfaces';

export interface Calendar {
  id: number;
  owner: number;
  title: string;
  description: string;
  duration: string;
  availability_set: Availability_Set[]; 
  invitees: Invitees[];
}

export interface Availability_Set {
  id: number;
  start_time: Dayjs;
  end_time: Dayjs;
}

export interface Invitees {
  calendar: number;
  contact: number;
  random_link_token: string;
  availability_sets: Availability_Set[];
}

export interface EditedScheduleFormData {
  owner: number;
  title: string;
  description: string;
  duration: string;
  availability_set:Availability_SetFormDataFinal[];
  invitees: Invitees_FormData[];
}

export interface ScheduleFormData {
  title: string;
  description: string;
  duration: string;
  availability_set:Availability_SetFormDataFinal[];
  invitees: Invitees_FormData[];
}

export interface Availability_SetFormData {
  start_time: Dayjs;
  end_time: Dayjs;
}

export interface Availability_SetFormDataFinal {
  start_time: string;
  end_time: string;
}

export interface Invitees_FormData {
  contact: Number;
}