import { UserType } from "./user-type.enum";
import { User } from "./user.interface";

export class Client extends User {
    userType = UserType.Client;
}