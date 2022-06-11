import { UserType } from "./user-type.enum";
import { User } from "./user.interface";

export class Admin extends User {
    userType = UserType.Admin;
}