import { UserType } from "./user-type.enum";
import { User } from "./user.interface";

export class Doctor extends User {
    userType = UserType.Doctor;
}