import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Table, TableBody, TableContainer, TableRow, Box, Avatar, Card, IconButton } from '@mui/material';
import { EditOutlined, PersonOutlineOutlined } from '@mui/icons-material';
import UserStatusChip from './UserStatusChip';
import { RootState } from '../../../redux/store';
import { getComparator, stableSort } from '../../../utils/utils';
import CommonTableCell from '../../../components/common/table/CommonTableCell';
import TableHeadList from '../../../components/common/table/TableHeadList';
import { openDialog } from '../../../redux/reducer/dialogSlice';
import { generateRandomColor } from '../../../constant/commonFunctions';
import ActiveChip from './ActiveChip';
import NoDataFound from '../../../components/common/table/NoDataFoundModule';


const headCells = [
    { id: "id", label: "Action", disablePadding: false, numeric: false, width: "120px", isFilterable: false, isSorting: false },
    { id: "name", label: "Name", disablePadding: false, numeric: true, width: "380px", isFilterable: true, isSorting: true, isSticky: { position: "left" as "left", positionStart: "0", zIndex: 5, } },
    { id: "email", label: "Email", disablePadding: false, numeric: false, width: "320px", isFilterable: false, isSorting: true },
    { id: "mobile", label: "Mobile", disablePadding: false, numeric: false, width: "180px", isFilterable: false, isSorting: true },
    { id: "user_type", label: "User Type", disablePadding: false, numeric: false, width: "200px", isFilterable: false, isSorting: true },
    { id: "is_active", label: "Is Active", disablePadding: false, numeric: false, width: "180px", isFilterable: false, isSorting: true },
    { id: "pincode", label: "Pin Code", disablePadding: false, numeric: false, width: "170px", isFilterable: true, isSorting: true },
    { id: "taluka", label: "Taluka", disablePadding: false, numeric: false, width: "200px", isFilterable: true, isSorting: true },
    { id: "district", label: "District", disablePadding: false, numeric: false, width: "200px", isFilterable: false, isSorting: true },

];

interface UserListPagePropes {
    userList: any[]
}
const UserListPage: React.FC<UserListPagePropes> = ({ userList }) => {
    const dispatch = useDispatch();
    const { orderBy, order } = useSelector((state: RootState) => state.sorting);
    const visibleRows: any[] = useMemo(() => userList && stableSort(userList, getComparator(order, orderBy)), [order, orderBy, userList]);
    const [totalItems, setTotalItems] = useState(0);
    const handleConfirmUpdate = (data: any) => {
        dispatch(openDialog({ type: "addEditUserDetails", moduleType: 'user', isFullScreen: false, title: "Update Details", size: "sm", payload: data }));
    };
    return (
        <Box>
            <Card elevation={0}>
                {/* <Box display={'flex'} justifyContent={'flex-end'} alignItems={'center'} gap={1} p={0.8} sx={{ borderBottom: '1px solid #c1c2c7' }}>
                    <MoreOptionsButton />
                </Box> */}
                <TableContainer sx={{ minHeight: 'calc(80vh - 59px)', maxHeight: 'calc(80vh - 59px)' }}>
                    <Table stickyHeader aria-label="sticky table" size="small" sx={{ minWidth: 750, tableLayout: 'fixed' }}>
                        <TableHeadList headCells={headCells} />
                        <TableBody>
                            {visibleRows.map((user: any, index: any) => (
                                <TableRow key={index + 'users'}>
                                    <CommonTableCell style={{ textAlign: 'center', padding: 'none' }} value={
                                        <IconButton size="small" onClick={() => handleConfirmUpdate(user)}>
                                            <EditOutlined />
                                        </IconButton>
                                    } />
                                    <CommonTableCell style={{ textAlign: 'left', position: "sticky", left: 0, zIndex: 4, background: "#ffff" }} value={
                                        <Box sx={{ cursor: 'pointer' }} display={'flex'} alignItems='center' gap={1}>
                                            <Avatar alt="Specification" sx={{ width: 30, height: 30, borderRadius: '50%', marginRight: 1, backgroundColor: generateRandomColor() }} >
                                                <PersonOutlineOutlined fontSize='small' />
                                            </Avatar>
                                            <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>
                                                {user.name}
                                            </span>
                                        </Box>}
                                    />
                                    <CommonTableCell value={user.email} />
                                    <CommonTableCell style={{ textAlign: 'center' }} value={user.mobile} />
                                    <CommonTableCell style={{ textAlign: 'left' }} value={<UserStatusChip status={user.user_type} />} />
                                    <CommonTableCell style={{ textAlign: 'center' }} value={<ActiveChip isActive={user.is_active} />} />
                                    <CommonTableCell style={{ textAlign: 'center' }} textOverflow value={user.pincode || '--'} />
                                    <CommonTableCell textOverflow value={user.taluka || '--'} />
                                    <CommonTableCell textOverflow value={user.district || '--'} />
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                    {
                        visibleRows.length === 0 && <NoDataFound height={'50vh'} moduleName={'User List '} />
                    }
                </TableContainer>
                
            </Card>
        </Box>
    );
};

export default UserListPage;