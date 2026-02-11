import { Box, Button, Paper, Autocomplete, TextField, Typography, SelectChangeEvent } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { lazy, useCallback, useEffect, useState } from "react";

import { AddCircleOutlineOutlined, Groups, VolunteerActivism, LocalHospital, Bloodtype, AdminPanelSettings, MedicalServices, HealthAndSafety, Engineering, Person, GetApp } from "@mui/icons-material";
import { RootState } from "../../../redux/store";
import { resetRefresh } from "../../../redux/reducer/refreshSlice";
import { openDialog } from "../../../redux/reducer/dialogSlice";
import PageHead from "../../../components/common/page/PageHead";
import CustomPagination from "../../../components/common/table/TablePagination";
import TableSkeleton from "../../../components/loader/TableSkeleton";
import { FetchUserListService, FetchUserTypeListService } from "../../../utils/services/user.service";



const UserListComponent = lazy(() => import("./UserListPage"));

const iconMap: { [key: string]: JSX.Element } = {
    rugnamitra: <Groups fontSize="small" />,
    ngo: <VolunteerActivism fontSize="small" />,
    hospital: <LocalHospital fontSize="small" />,
    pharmacy: <LocalHospital fontSize="small" />,
    bloodbank: <Bloodtype fontSize="small" />,
    dho: <AdminPanelSettings fontSize="small" />,
    tho: <Engineering fontSize="small" />,
    doctor: <MedicalServices fontSize="small" />,
    stemy: <HealthAndSafety fontSize="small" />,
    abha: <HealthAndSafety fontSize="small" />,
    mo: <Person fontSize="small" />,
    cmrf: <Person fontSize="small" />,
};

interface UserType {
    label: string;
    id: number;
    type?: string;
    isDisabled?: boolean;
    icon?: JSX.Element;
}

const UserListPage: React.FC = () => {
    const dispatch = useDispatch();
    const [value, setValue] = useState<UserType | null>(null);
    const [userList, setUserList] = useState<any[]>([]);
    const [userTypes, setUserTypes] = useState<UserType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const { user_list: moduleRefresh } = useSelector((state: RootState) => state.refresh);
    // const searchString = useSelector((state: RootState) => state.tableSearch);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [payload, setPayload] = useState<{ offset: number; limit: number }>({
        offset: 0,
        limit: 15,
    });

    const fetchUserTypeList = async () => {
        const { code, data } = await FetchUserTypeListService({});
        if (code === 200 && data && data.data) {
            const formattedUserTypes = data.data.map((type: { lable: string; id: number; type?: string }) => ({
                label: type.lable,
                id: type.id,
                type: type.type || type.lable.toLowerCase().replace(/\s+/g, ''),
                isDisabled: false,
                icon: iconMap[type.type || type.lable.toLowerCase().replace(/\s+/g, '')] || <Person fontSize="small" />,
            }));
            setUserTypes(formattedUserTypes);
        } else {
            setUserTypes([]);
            setValue(null);
        }
    };

    useEffect(() => {
        fetchUserTypeList();
    }, []);

    const fetchPortListDataService = useCallback(async () => {
        const payloadData = {
            limit: payload.limit,
            offset: payload.offset,
        };
        setLoading(true);
        const { code, data } = await FetchUserListService(payloadData);
        if (code === 200 && data && data.data) {
            setUserList(data.data);
            setTotalCount(data.total_count);
            dispatch(resetRefresh());
        } else {
            setUserList([]);
        }
        setLoading(false);
    }, [payload, dispatch, value,  moduleRefresh]);

    useEffect(() => {
        fetchPortListDataService();
    }, [fetchPortListDataService]);

    const handleChange = (event: React.SyntheticEvent, newValue: UserType | null) => {
        setValue(newValue);
        setPayload((prev) => ({ ...prev, offset: 0 }));
    }

    const handleRowsPerPageChange = useCallback((event: any) => {
        setPayload(prev => ({ ...prev, limit: Number(event.target.value), offset: 0 }));
    }, []);

    const handlePageChange = useCallback((_event: React.ChangeEvent<unknown>, newPage: number) => {
        setPayload(prev => ({ ...prev, offset: (newPage - 1) * prev.limit }));
    }, []);

    const handleCustomerCreate = () => {
        dispatch(openDialog({ type: "addEditUserDetails", moduleType: 'user', isFullScreen: false, title: "Register New User", size: "sm" }));
    };

    return (
        <Box>
            <Box>
                <PageHead
                    primary={`${value?.label ?? 'All'} User List`}
                    back={value?.icon ?? <Person />}
                    secondary={<>                         <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCustomerCreate}
                        startIcon={<AddCircleOutlineOutlined />}
                    >
                        Create New User
                    </Button>

                    </>
                    }
                />
            </Box>
            <Paper sx={{ boxShadow: 3, pb: 1 }}>
                <Box sx={{ p: 1, borderBottom: 1, borderColor: 'grey.400', borderRadius: '8px 8px 0 0' }}>
                    <Autocomplete
                        value={value}
                        onChange={handleChange}
                        options={userTypes}
                        getOptionLabel={(option) => option.label}
                        getOptionDisabled={(option) => option.isDisabled ?? false}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Select User Type"
                                placeholder="Select User Type"
                                variant="outlined"
                                size="small"
                                InputLabelProps={{
                                    className: params.InputLabelProps?.className || "",
                                }}
                            />
                        )}
                        renderOption={(props, option) => (
                            <li {...props} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {option.icon}
                                {option.label}
                            </li>
                        )}
                        sx={{ maxWidth: 300 }}
                    />
                </Box>
                {loading && (
                    <TableSkeleton columns={9} rows={15} />
                )}
                {!loading && (
                    <Box py={0}>
                        <UserListComponent userList={userList} />
                        <CustomPagination
                            count={totalCount}
                            rowsPerPage={payload.limit}
                            page={payload.offset / payload.limit + 1}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            rowsPerPageOptions={[15, 20, 25, 30]}
                        />
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default UserListPage;