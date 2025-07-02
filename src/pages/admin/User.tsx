import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  Box,
  Button,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  TextField, // Thêm TextField
  TableFooter,
  TablePagination,
  TableSortLabel,
  SelectChangeEvent,
} from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import MainBox from "../../components/layout/MainBox.tsx";
import Header from "../../components/layout/Header.tsx";
import {useSelector} from "react-redux";
// interface Role {
//   id: number;
//   name: string;
// }
interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  status: boolean;
  roles: string[];
  createdOn: string;
  updateOn: string | null;
}

interface ApiResponse {
  data: {
    content: User[];
    pageable: {
      pageNumber: number;
      pageSize: number;
    };
    totalPages: number;
    totalElements: number; // Total number of users
  };
}

type TablePaginationActionsProps = {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
};

// const roleMap: { [key: string]: string } = {
//   ROLE_ADMIN: "ADMIN",
//   // ROLE_REPOSITORY: "NHÂN VIÊN KHO",
//   ROLE_SALE: "NHÂN VIÊN BÁN HÀNG",
//   ROLE_SUPPORT: "NHÂN VIÊN CHĂM SÓC",
// };
type Props = {};
export default function User({}: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0); // Update page to start at 0
  const [totalElements, setTotalElements] = useState<number>(0); // Total number of users
  const [pageSize, setPageSize] = useState<number>(10); // Rows per page
  const [sortColumn, setSortColumn] = useState<string>("name"); // Default sorting column
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Default sorting order
  const [selectedRole, setSelectedRole] = useState<string | "">("");
  // const [anchorEl, setAnchorEl] = useState<any | HTMLElement>(null);
  // const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>(""); // Thêm searchQuery
  const store = useSelector((state: any) => state.storeSetting.store);

 
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery); // Update the debounced search query
    }, 1000); // 1000ms delay

    // Cleanup timeout if user types again before the delay finishes
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   localStorage.removeItem('user');
  //   localStorage.removeItem('stores');
  //   navigate('/login');
  // }

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // const searchFilter = searchQuery ? `&search=${searchQuery}` : ""; // Thêm search query

        const roleFilter = selectedRole ? `&role=${selectedRole}` : "";
        const searchFilter = debouncedSearchQuery ? `&search=${debouncedSearchQuery}` : "";
        const response = await fetch(

            `http://localhost:8080/v1/user?page=${page}&limit=${pageSize}&sort=${sortColumn}&order=${sortOrder}${roleFilter}${searchFilter}&storeId=${store?.id}`

        );
        const data: ApiResponse = await response.json();
        setUsers(data.data.content);
        setTotalElements(data.data.totalElements); // Set total elements
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    // fetchUsers(page, pageSize , sortColumn , sortOrder);
    fetchUsers();

    // const storedUser = localStorage.getItem("user");
    // if (storedUser) {
    //   setCurrentUser(JSON.parse(storedUser));
    // }
  }, [page, pageSize, sortColumn, sortOrder, selectedRole    
    //, searchQuery 
    , debouncedSearchQuery, store]);

  const handlePageChange = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0); // Reset to page 0 when changing rows per page
  };
  const handleSort = (column: string) => {
    const isAsc = sortColumn === column && sortOrder === "asc";
    setSortOrder(isAsc ? "desc" : "asc");
    setSortColumn(column);
  };
  const handleRoleChange = (event: SelectChangeEvent) => {
    setSelectedRole(event.target.value as string); // Update selected role
    setPage(0); // Reset to page 0 when filtering
  };
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value); // Cập nhật giá trị search query
    setPage(0); // Reset về trang đầu khi tìm kiếm

  };
  const roleMap: Record<string, string> = {
    // ROLE_ADMIN: "Admin",
    ROLE_REPOSITORY: "NHÂN VIÊN KHO",
    ROLE_SALE: "NHÂN VIÊN BÁN HÀNG",
    // Thêm các role khác nếu có
  };
  
  

  function TablePaginationActions({
    count,
    page,
    rowsPerPage,
    onPageChange,
  }: TablePaginationActionsProps) {
    const handleBackButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      onPageChange(event, page + 1);
    };

    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <Button
          onClick={handleBackButtonClick}
          disabled={page === 0}
          size="small"
        >
          <KeyboardArrowLeft />
        </Button>
        <Button
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          size="small"
        >
          <KeyboardArrowRight />
        </Button>
      </Box>
    );
  }

  return (
      <Box>
        <Header/>
        <MainBox>
          <Box className="titleHeader">Danh sách nhân viên</Box>
          <Box sx={{ padding: 3, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
              <TextField
                  label="Tìm kiếm theo tên hoặc số điện thoại"
                  variant="outlined"
                  value={searchQuery}
                  onChange={handleSearchChange}

                  sx={{
                    width: "30%",
                    borderRadius: 1,
                    backgroundColor: "white",
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                  InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                    ),
                    style: { backgroundColor: "white" }, // This ensures the input field background is white
                  }}
              />

              <Select
                  displayEmpty
                  sx={{
                    minWidth: "20%",
                    colorText: "",

                    backgroundColor: "white",
                    borderRadius: 1,
                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                  }}
                  value={selectedRole}
                  onChange={handleRoleChange}
              >
                <MenuItem value="">Tất cả vai trò</MenuItem>
                {/*<MenuItem value="ROLE_ADMIN">ADMIN</MenuItem>*/}
                <MenuItem value="ROLE_REPOSITORY">NHÂN VIÊN KHO</MenuItem>
                <MenuItem value="ROLE_SALE">NHÂN VIÊN BÁN HÀNG</MenuItem>
                {/*<MenuItem value="ROLE_SUPPORT">NHÂN VIÊN CHĂM SÓC</MenuItem>*/}
              </Select>

              <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate(`/admin/user/create`)}
                  sx={{
                    ml: 2, // Space between Select and Button
                    py: 1.2, // Slight padding for button height
                    px: 3, // Padding for width
                    backgroundColor: "#1976d2", // Primary color
                    boxShadow: "0px 4px 10px rgba(25, 118, 210, 0.2)", // Blue shadow for effect
                    "&:hover": {
                      backgroundColor: "#1565c0", // Darker shade on hover
                    },
                  }}
              >
                Thêm nhân viên
              </Button>
            </Box>
            <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "400px",
                }}
            >
              {loading ? (
                  <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "50vh", // Full viewport height to vertically center
                      }}
                  >
                    <CircularProgress />
                  </Box>
              ) : (
                  <>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>
                              <TableSortLabel
                                  active={sortColumn === "id"}
                                  direction={sortColumn === "id" ? sortOrder : "asc"}
                                  onClick={() => handleSort("id")}
                              >
                                Mã nhân viên
                              </TableSortLabel>
                            </TableCell>
                            <TableCell>
                              <TableSortLabel
                                  active={sortColumn === "name"}
                                  direction={sortColumn === "name" ? sortOrder : "asc"}
                                  onClick={() => handleSort("name")}
                              >
                                Tên nhân viên
                              </TableSortLabel>
                            </TableCell>
                            <TableCell>
                              <TableSortLabel
                                  active={sortColumn === "phoneNumber"}
                                  direction={
                                    sortColumn === "phoneNumber" ? sortOrder : "asc"
                                  }
                                  onClick={() => handleSort("phoneNumber")}
                              >
                                Số điện thoại
                              </TableSortLabel>
                            </TableCell>
                            <TableCell>
                              <TableSortLabel>Vai trò</TableSortLabel>
                            </TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {users.map((user) => (
                              <TableRow
                                  key={user.id}
                                  onClick={() => navigate(`/admin/user/${user.id}`)}
                                  hover
                                  sx={{
                                    cursor: "pointer",
                                  }}
                              >
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.phoneNumber}</TableCell>
                                <TableCell>
                                  {user.roles && user.roles.length > 0
                                      ? user.roles.map((r) => roleMap[r] || r).join(", ")
                                      : "Không có vai trò"}
                                </TableCell>
                                <TableCell>
                                  <Chip
                                      label={user.status ? "Hoạt động" : "Khoá"}
                                      color={user.status ? "success" : "error"}
                                  />
                                </TableCell>
                                {/* <TableCell>
                        <Button
                          color="primary"
                          onClick={() => navigate(`/admin/user/${user.id}`)}
                        >
                          Chi tiết
                        </Button>
                      </TableCell> */}
                              </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TablePagination
                              rowsPerPageOptions={[10, 25, 50]}
                              count={totalElements}
                              rowsPerPage={pageSize}
                              page={page}
                              onPageChange={handlePageChange}
                              onRowsPerPageChange={handleChangeRowsPerPage}
                              ActionsComponent={TablePaginationActions}
                              labelRowsPerPage="Số hàng trên mỗi trang"
                              labelDisplayedRows={({ from, to, count }) =>
                                  `${from}-${to} trong tổng số ${count}`
                              }
                          />
                        </TableFooter>
                      </Table>
                    </TableContainer>
                  </>
              )}
            </Box>
          </Box>
        </MainBox>
      </Box>
  );
}


