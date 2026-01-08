import { ApiProperty } from "@nestjs/swagger";
import { BaseEntity } from "./base.entity";
import { Ride } from "./ride.entity";
import { Rider } from "./rider.entity";
import { Driver } from "./driver.entity";
import { Admin } from "./admin.entity";
import { ChatType } from "../enums/chat.enum";
import { ChatMessage } from "./chat-message.entity";

export class Chat extends BaseEntity {
    @ApiProperty()
    rideId?: string;

    @ApiProperty({ type: () => Ride })
    ride?: Ride;

    @ApiProperty()
    riderId?: string;

    @ApiProperty({ type: () => Rider })
    rider?: Rider;

    @ApiProperty()
    driverId?: string;

    @ApiProperty({ type: () => Driver })
    driver?: Driver;

    @ApiProperty()
    adminId?: string;

    @ApiProperty({ type: () => Admin })
    admin?: Admin;

    @ApiProperty({ enum: ChatType })
    type: ChatType;

    @ApiProperty({ type: () => [ChatMessage] })
    messages?: ChatMessage[];

    constructor(data: Partial<Chat>) {
        super();
        Object.assign(this, data);
    }
}
