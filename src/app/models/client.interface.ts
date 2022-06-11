import { ClientAppointment } from "./client-appointment.interface";
import { User } from "./user.interface";

export class Client extends User {
    medicalHistory!: ClientAppointment[];
}