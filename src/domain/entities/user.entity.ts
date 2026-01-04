import { BaseEntity } from "./base.entity";
import { Rider } from "./rider.entity";
import { Driver } from "./driver.entity";
import { PaymentMethod } from "./payment-method.entity";
import { Notification } from "./notification.entity";
import { Rating } from "./rating.entity";
import { UserType } from "../enums/user-type.enum";
import { ApiProperty } from "@nestjs/swagger";


export class User extends BaseEntity {
    @ApiProperty()
    email: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    userType: UserType;

    @ApiProperty()
    profilePicture?: string;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    isVerified: boolean;

    @ApiProperty()
    deletedAt?: Date;

    @ApiProperty()
    rider?: Rider;

    @ApiProperty()
    driver?: Driver;

    @ApiProperty()
    paymentMethods?: PaymentMethod[];

    @ApiProperty()
    notifications?: Notification[];

    @ApiProperty()
    sentRatings?: Rating[];

    @ApiProperty()
    receivedRatings?: Rating[];

    constructor(data: Partial<User>) {
        super();
        Object.assign(this, data);
    }
}