import { AdminPermission } from "../enums/admin-permision.enum";
import { BaseEntity } from "./base.entity";

export class Admin extends BaseEntity {
    username: string;
    password: string;
    
    // Stores the sum of all permissions (e.g., 32 + 4 = 36)
    permissions: AdminPermission; 

    constructor(data: Partial<Admin>) {
        super();
        Object.assign(this, data);
    }
}