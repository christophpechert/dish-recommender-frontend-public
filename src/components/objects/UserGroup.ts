import { Keyword } from "./Keyword";
import { Menu } from "./Menu";
import { UserInfo } from "./UserInfo";

export type UserGroup = {
    id?: number;
    name: string;
    created?: string;
    lastChange?: string;
    userInfos?: UserInfo[];
}

export type UserGroupWithMenusAndKeywords = {
    id: number;
    name: string;
    menus: Menu[];
    keywords: Keyword[];
}
