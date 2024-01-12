import { InviteStatus } from "../config/constant";
import { UserGroup } from "./UserGroup";
import { UserInfo } from "./UserInfo";

export type Invite = {
    id?: number;
    message: string;
    crated?: string;
    lastChange?: string;
    status?: InviteStatus;
    userInfo?: UserInfo; 
    userGroup?: UserGroup;
}