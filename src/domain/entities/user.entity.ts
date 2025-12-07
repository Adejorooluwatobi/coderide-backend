import { BaseEntity } from "./base.entity";
import { Rider } from "./rider.entity";
import { Driver } from "./driver.entity";
import { PaymentMethod } from "./payment-method.entity";
import { Notification } from "./notification.entity";
import { Rating } from "./rating.entity";
import { UserType } from "../enums/user-type.enum";


export class User extends BaseEntity {
    email: string;
    phone: string;
    password: string;
    firstName: string;
    lastName: string;
    userType: UserType;
    profilePicture?: string;
    isActive: boolean;
    isVerified: boolean;
    deletedAt?: Date;

    rider?: Rider;
    driver?: Driver;
    paymentMethods?: PaymentMethod[];
    notifications?: Notification[];
    sentRatings?: Rating[];
    receivedRatings?: Rating[];

    constructor(data: Partial<User>) {
        super();
        Object.assign(this, data);
    }
}