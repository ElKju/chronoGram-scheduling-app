import { Contact } from "../contacts/contactInterfaces";
import dayjs, { Dayjs } from 'dayjs';

export interface Calendar {
  id: number;
  owner: number;
  title: string;
  description: string;
  duration: string;
  availability_set: Availability_Set[]; 
  invitees: Contact[];
}

export interface Invitees {
  id: number;
  calendar: Calendar;
  contact: Contact;
}

export interface Availability_Set {
  id: number;
  start_time: Dayjs;
  end_time: Dayjs;
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