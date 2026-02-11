import { setPermission } from "../../redux/reducer/permissionSlice";
import { showSnackbar } from "../../redux/reducer/snackbarSlice";
import store from "../../redux/store";
import { responseDataPermissionUsingRole } from "./Permission";

type user_role_permission = {
    uuid: string
    parent_id: string,
    name: string,
    slug: string,
    module_url: string,
    icon: string,
    module_order: string,
    is_navigation: number,
    operations: Array<string>,
}

type NavigationItem = {
    id: number;
    title: string;
    icon: string | null;
    url: string;
    uuid: string;
    subMenus: NavigationItem[];
};


export const handleMakingNestedData = (dispatch: any) => {
    const authUser = store.getState().authUser;
    let mainPermissionsObject = responseDataPermissionUsingRole[authUser?.userDetails?.user_type === 'volunteer' ? 'volunteer' : 'admin'] ?? {};
    const user_role_permission: Array<user_role_permission> = mainPermissionsObject?.user_role_permission ?? [];
    let nestedPermissionsDataArray = store.getState().permission?.nestedPermissionsData ?? [];
    if (!nestedPermissionsDataArray || nestedPermissionsDataArray?.length === 0) {
        const buildNestedArrayWithDetails = (permissions: user_role_permission[]): Array<any> => {
            try {
                const map: Record<string, any> = {};
                permissions.forEach((item) => {
                    const { uuid, parent_id } = item;

                    map[uuid] = map[uuid] ?? { ...item, children: [] };
                    map[uuid] = { ...item, children: map[uuid].children ?? [] };

                    if (parent_id !== "0") {
                        map[parent_id] = map[parent_id] ?? { children: [] };
                        map[parent_id].children.push(map[uuid]);
                    }
                });
                const nestedArray = Object.values(map).filter((item) => item.parent_id === "0");
                return nestedArray;
            } catch (e: any) {
                console.error("Error while building nested array with details:", e);
                throw e; 
            }
        };
        const nestedArrayWithDetails: Array<any> = buildNestedArrayWithDetails(user_role_permission);
        if (nestedArrayWithDetails && nestedArrayWithDetails.length > 0) {
            const PermissionReduxObject: any = store.getState().permission ?? {};
            dispatch(setPermission({ ...PermissionReduxObject, nestedPermissionsData: nestedArrayWithDetails }));
            nestedPermissionsDataArray = nestedArrayWithDetails;
        }
    }
    return nestedPermissionsDataArray;
};

export const handleNav = (dispatch: any): any => {
    let navigateTabsArray: any = store.getState().permission?.navigateTabsArray ?? [];
    if (!navigateTabsArray || navigateTabsArray?.length === 0) {
        try {
            const nestedPermissionsDataArray = handleMakingNestedData(dispatch);
            const buildNavigationArray = (nestedArray: any): NavigationItem[] => {
                return nestedArray?.filter((item: any) => item.is_navigation === 1)
                    ?.map((item: any) => ({
                        id: Number(item.module_order ? item.module_order.trim() : 0),
                        title: item.name,
                        icon: item.icon ?? null,
                        url: item.module_url,
                        uuid: item.uuid,
                        subMenus: buildNavigationArray(item.children ?? []),
                    }))?.sort((a: any, b: any) => a.id - b.id);
            };

            const navigationArray = buildNavigationArray(nestedPermissionsDataArray);
            const PermissionReduxObject: any = store.getState().permission ?? {};
            dispatch(setPermission({ ...PermissionReduxObject, navigateTabsArray: navigationArray, }));
            return navigationArray;
        }
        catch (e: any) {
            dispatch(showSnackbar({ message: "Failed to process permission navigate.", type: "error" }));
            console.error("Failed to process permission navigate:", e);
        }
    }
    return navigateTabsArray;
}