import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip,
  Alert,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  TablePagination,
  Card,
  CardContent,
  CardActions,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CardMedia,
  Switch,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Security as SecurityIcon,
  ManageAccounts as ManageAccountsIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  Upload as UploadIcon,
  Newspaper as NewsIcon,
  Image as ImageIcon,
  Settings as SettingsIcon,
  Palette as PaletteIcon,
  Backup as BackupIcon,
  History as HistoryIcon,
  Send as SendIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserRoles,
  updateUserRole,
  getUserPermissions,
  updateUserPermissions,
  getAllOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getOrganizationDetails,
  uploadOrganizationLogo,
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
  uploadNewsImage,
  getSystemSettings,
  updateSystemSettings,
  getThemes,
  updateEmailSettings,
  testEmailSettings,
  getSystemLogs,
  backupSystem,
} from '../../services/api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDialog, setUserDialog] = useState(false);
  const [permissionDialog, setPermissionDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    password: '',
    isActive: true,
  });
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [orgDialog, setOrgDialog] = useState(false);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [orgData, setOrgData] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    country: '',
    phone: '',
    email: '',
    website: '',
    industry: '',
    employeeCount: '',
    status: 'active',
    logo: null,
  });
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [newsDialog, setNewsDialog] = useState(false);
  const [loadingNews, setLoadingNews] = useState(false);
  const [newsData, setNewsData] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'normal',
    publishDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    image: null,
    status: 'draft',
  });
  const [systemSettings, setSystemSettings] = useState({
    siteName: '',
    siteDescription: '',
    maintenanceMode: false,
    theme: 'light',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12',
    defaultLanguage: 'en',
    emailSettings: {
      smtpHost: '',
      smtpPort: '',
      smtpUser: '',
      smtpPassword: '',
      senderEmail: '',
      senderName: '',
    },
    notifications: {
      emailNotifications: true,
      systemNotifications: true,
      reportSubmissions: true,
      evaluationUpdates: true,
    },
    security: {
      sessionTimeout: 30,
      passwordExpiry: 90,
      maxLoginAttempts: 5,
      twoFactorAuth: false,
    },
  });
  const [themes, setThemes] = useState([]);
  const [testingEmail, setTestingEmail] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [backingUp, setBackingUp] = useState(false);
  const [systemLogs, setSystemLogs] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchPermissions();
    const fetchOrganizations = async () => {
      setLoadingOrgs(true);
      try {
        const response = await getAllOrganizations();
        setOrganizations(response.data);
      } catch (error) {
        console.error('Error fetching organizations:', error);
        showNotification('Error loading organizations', 'error');
      }
      setLoadingOrgs(false);
    };

    fetchOrganizations();
    const fetchNews = async () => {
      setLoadingNews(true);
      try {
        const response = await getAllNews();
        setNews(response.data);
      } catch (error) {
        console.error('Error fetching news:', error);
        showNotification('Error loading news', 'error');
      }
      setLoadingNews(false);
    };

    fetchNews();
  }, []);

  useEffect(() => {
    const fetchSystemSettings = async () => {
      setLoadingSettings(true);
      try {
        const [settingsRes, themesRes] = await Promise.all([
          getSystemSettings(),
          getThemes(),
        ]);
        setSystemSettings(settingsRes.data);
        setThemes(themesRes.data);
      } catch (error) {
        console.error('Error fetching system settings:', error);
        showNotification('Error loading system settings', 'error');
      }
      setLoadingSettings(false);
    };

    fetchSystemSettings();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      showNotification('Error loading users', 'error');
    }
    setLoading(false);
  };

  const fetchRoles = async () => {
    try {
      const response = await getUserRoles();
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await getUserPermissions();
      setPermissions(response.data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  const handleCreateUser = async () => {
    try {
      await createUser(userData);
      setUserDialog(false);
      fetchUsers();
      showNotification('User created successfully');
      resetUserData();
    } catch (error) {
      console.error('Error creating user:', error);
      showNotification('Error creating user', 'error');
    }
  };

  const handleUpdateUser = async () => {
    try {
      await updateUser(selectedUser.id, userData);
      setUserDialog(false);
      fetchUsers();
      showNotification('User updated successfully');
      resetUserData();
    } catch (error) {
      console.error('Error updating user:', error);
      showNotification('Error updating user', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        fetchUsers();
        showNotification('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        showNotification('Error deleting user', 'error');
      }
    }
  };

  const handleUpdatePermissions = async () => {
    try {
      await updateUserPermissions(selectedUser.id, {
        permissions: selectedUser.permissions,
      });
      setPermissionDialog(false);
      fetchUsers();
      showNotification('Permissions updated successfully');
    } catch (error) {
      console.error('Error updating permissions:', error);
      showNotification('Error updating permissions', 'error');
    }
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  const resetUserData = () => {
    setUserData({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      role: '',
      password: '',
      isActive: true,
    });
    setSelectedUser(null);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = (
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleCreateOrganization = async () => {
    try {
      const formData = new FormData();
      Object.keys(orgData).forEach(key => {
        if (key !== 'logo') {
          formData.append(key, orgData[key]);
        }
      });
      if (orgData.logo) {
        formData.append('logo', orgData.logo);
      }

      await createOrganization(formData);
      setOrgDialog(false);
      fetchOrganizations();
      showNotification('Organization created successfully');
      resetOrgData();
    } catch (error) {
      console.error('Error creating organization:', error);
      showNotification('Error creating organization', 'error');
    }
  };

  const handleUpdateOrganization = async () => {
    try {
      const formData = new FormData();
      Object.keys(orgData).forEach(key => {
        if (key !== 'logo') {
          formData.append(key, orgData[key]);
        }
      });
      if (orgData.logo) {
        formData.append('logo', orgData.logo);
      }

      await updateOrganization(selectedOrg.id, formData);
      setOrgDialog(false);
      fetchOrganizations();
      showNotification('Organization updated successfully');
      resetOrgData();
    } catch (error) {
      console.error('Error updating organization:', error);
      showNotification('Error updating organization', 'error');
    }
  };

  const handleDeleteOrganization = async (orgId) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        await deleteOrganization(orgId);
        fetchOrganizations();
        showNotification('Organization deleted successfully');
      } catch (error) {
        console.error('Error deleting organization:', error);
        showNotification('Error deleting organization', 'error');
      }
    }
  };

  const resetOrgData = () => {
    setOrgData({
      name: '',
      description: '',
      address: '',
      city: '',
      country: '',
      phone: '',
      email: '',
      website: '',
      industry: '',
      employeeCount: '',
      status: 'active',
      logo: null,
    });
    setSelectedOrg(null);
  };

  const handleCreateNews = async () => {
    try {
      const formData = new FormData();
      Object.keys(newsData).forEach(key => {
        if (key !== 'image') {
          formData.append(key, newsData[key]);
        }
      });
      if (newsData.image) {
        formData.append('image', newsData.image);
      }

      await createNews(formData);
      setNewsDialog(false);
      fetchNews();
      showNotification('News created successfully');
      resetNewsData();
    } catch (error) {
      console.error('Error creating news:', error);
      showNotification('Error creating news', 'error');
    }
  };

  const handleUpdateNews = async () => {
    try {
      const formData = new FormData();
      Object.keys(newsData).forEach(key => {
        if (key !== 'image') {
          formData.append(key, newsData[key]);
        }
      });
      if (newsData.image) {
        formData.append('image', newsData.image);
      }

      await updateNews(selectedNews.id, formData);
      setNewsDialog(false);
      fetchNews();
      showNotification('News updated successfully');
      resetNewsData();
    } catch (error) {
      console.error('Error updating news:', error);
      showNotification('Error updating news', 'error');
    }
  };

  const handleDeleteNews = async (newsId) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        await deleteNews(newsId);
        fetchNews();
        showNotification('News deleted successfully');
      } catch (error) {
        console.error('Error deleting news:', error);
        showNotification('Error deleting news', 'error');
      }
    }
  };

  const resetNewsData = () => {
    setNewsData({
      title: '',
      content: '',
      category: 'general',
      priority: 'normal',
      publishDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      image: null,
      status: 'draft',
    });
    setSelectedNews(null);
  };

  const handleSettingsUpdate = async () => {
    try {
      await updateSystemSettings(systemSettings);
      showNotification('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      showNotification('Error updating settings', 'error');
    }
  };

  const handleEmailTest = async () => {
    setTestingEmail(true);
    try {
      await testEmailSettings(systemSettings.emailSettings);
      showNotification('Test email sent successfully');
    } catch (error) {
      console.error('Error testing email settings:', error);
      showNotification('Error sending test email', 'error');
    }
    setTestingEmail(false);
  };

  const handleSystemBackup = async () => {
    setBackingUp(true);
    try {
      await backupSystem();
      showNotification('System backup created successfully');
    } catch (error) {
      console.error('Error creating backup:', error);
      showNotification('Error creating backup', 'error');
    }
    setBackingUp(false);
  };

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const response = await getAllOrganizations();
      setOrganizations(response.data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      setNotification({
        open: true,
        message: 'Error loading organizations',
        severity: 'error'
      });
    }
    setLoading(false);
  };

  const fetchNews = async () => {
    setLoadingNews(true);
    try {
      const response = await getAllNews();
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
      showNotification('Error loading news', 'error');
    }
    setLoadingNews(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5">
            User Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              resetUserData();
              setUserDialog(true);
            }}
          >
            Add User
          </Button>
        </Box>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Filter by Role</InputLabel>
              <Select
                value={filterRole}
                label="Filter by Role"
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <MenuItem value="all">All Roles</MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role.id} value={role.name}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Users Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Full Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.role}
                            color={
                              user.role === 'admin' ? 'error' :
                              user.role === 'teacher' ? 'primary' :
                              'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.isActive ? 'Active' : 'Inactive'}
                            color={user.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Edit User">
                            <IconButton
                              onClick={() => {
                                setSelectedUser(user);
                                setUserData({
                                  username: user.username,
                                  email: user.email,
                                  firstName: user.firstName,
                                  lastName: user.lastName,
                                  role: user.role,
                                  isActive: user.isActive,
                                });
                                setUserDialog(true);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Manage Permissions">
                            <IconButton
                              onClick={() => {
                                setSelectedUser(user);
                                setPermissionDialog(true);
                              }}
                            >
                              <SecurityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete User">
                            <IconButton
                              onClick={() => handleDeleteUser(user.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={filteredUsers.length}
              page={page}
              onPageChange={(e, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
            />
          </>
        )}

        {/* User Dialog */}
        <Dialog
          open={userDialog}
          onClose={() => {
            setUserDialog(false);
            resetUserData();
          }}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {selectedUser ? 'Edit User' : 'Add New User'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Username"
                  value={userData.username}
                  onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={userData.firstName}
                  onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={userData.lastName}
                  onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={userData.role}
                    label="Role"
                    onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.id} value={role.name}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {!selectedUser && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={userData.password}
                    onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                    required
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={userData.isActive}
                      onChange={(e) => setUserData({ ...userData, isActive: e.target.checked })}
                    />
                  }
                  label="Active Account"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setUserDialog(false);
                resetUserData();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={selectedUser ? handleUpdateUser : handleCreateUser}
            >
              {selectedUser ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Permissions Dialog */}
        <Dialog
          open={permissionDialog}
          onClose={() => setPermissionDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Manage User Permissions
          </DialogTitle>
          <DialogContent dividers>
            {selectedUser && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  User: {selectedUser.username}
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  Role: {selectedUser.role}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <FormGroup>
                    {permissions.map((permission) => (
                      <FormControlLabel
                        key={permission.id}
                        control={
                          <Checkbox
                            checked={selectedUser.permissions?.includes(permission.id)}
                            onChange={(e) => {
                              const newPermissions = e.target.checked
                                ? [...(selectedUser.permissions || []), permission.id]
                                : selectedUser.permissions?.filter((p) => p !== permission.id);
                              setSelectedUser({
                                ...selectedUser,
                                permissions: newPermissions,
                              });
                            }}
                          />
                        }
                        label={permission.name}
                      />
                    ))}
                  </FormGroup>
                </Box>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPermissionDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleUpdatePermissions}
            >
              Save Permissions
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification */}
        <Alert
          severity={notification.severity}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            display: notification.open ? 'flex' : 'none',
          }}
          onClose={() => setNotification({ ...notification, open: false })}
        >
          {notification.message}
        </Alert>

        {/* Organizations Grid */}
        {loadingOrgs ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {organizations.map((org) => (
              <Grid item xs={12} md={6} lg={4} key={org.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {org.logo ? (
                        <Avatar
                          src={org.logo}
                          sx={{ width: 60, height: 60, mr: 2 }}
                          variant="rounded"
                        />
                      ) : (
                        <Avatar
                          sx={{ width: 60, height: 60, mr: 2, bgcolor: 'primary.main' }}
                          variant="rounded"
                        >
                          <BusinessIcon sx={{ fontSize: 30 }} />
                        </Avatar>
                      )}
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {org.name}
                        </Typography>
                        <Chip
                          label={org.status}
                          color={org.status === 'active' ? 'success' : 'default'}
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {org.description}
                    </Typography>

                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <LocationIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={`${org.city}, ${org.country}`}
                          secondary={org.address}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <PhoneIcon />
                        </ListItemIcon>
                        <ListItemText primary={org.phone} />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <EmailIcon />
                        </ListItemIcon>
                        <ListItemText primary={org.email} />
                      </ListItem>
                      {org.website && (
                        <ListItem>
                          <ListItemIcon>
                            <WebsiteIcon />
                          </ListItemIcon>
                          <ListItemText primary={org.website} />
                        </ListItem>
                      )}
                    </List>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Industry: {org.industry}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Employees: {org.employeeCount}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedOrg(org);
                        setOrgData({
                          ...org,
                          logo: null,
                        });
                        setOrgDialog(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteOrganization(org.id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Organization Dialog */}
        <Dialog
          open={orgDialog}
          onClose={() => {
            setOrgDialog(false);
            resetOrgData();
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedOrg ? 'Edit Organization' : 'Add New Organization'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {/* Logo Upload */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {orgData.logo ? (
                    <Avatar
                      src={URL.createObjectURL(orgData.logo)}
                      sx={{ width: 100, height: 100, mr: 2 }}
                      variant="rounded"
                    />
                  ) : selectedOrg?.logo ? (
                    <Avatar
                      src={selectedOrg.logo}
                      sx={{ width: 100, height: 100, mr: 2 }}
                      variant="rounded"
                    />
                  ) : (
                    <Avatar
                      sx={{ width: 100, height: 100, mr: 2 }}
                      variant="rounded"
                    >
                      <BusinessIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                  )}
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadIcon />}
                  >
                    Upload Logo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => setOrgData({
                        ...orgData,
                        logo: e.target.files[0],
                      })}
                    />
                  </Button>
                </Box>
              </Grid>

              {/* Basic Information */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Organization Name"
                  value={orgData.name}
                  onChange={(e) => setOrgData({ ...orgData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Industry"
                  value={orgData.industry}
                  onChange={(e) => setOrgData({ ...orgData, industry: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={orgData.description}
                  onChange={(e) => setOrgData({ ...orgData, description: e.target.value })}
                  required
                />
              </Grid>

              {/* Contact Information */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={orgData.email}
                  onChange={(e) => setOrgData({ ...orgData, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={orgData.phone}
                  onChange={(e) => setOrgData({ ...orgData, phone: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Website"
                  value={orgData.website}
                  onChange={(e) => setOrgData({ ...orgData, website: e.target.value })}
                />
              </Grid>

              {/* Location Information */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  value={orgData.address}
                  onChange={(e) => setOrgData({ ...orgData, address: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="City"
                  value={orgData.city}
                  onChange={(e) => setOrgData({ ...orgData, city: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Country"
                  value={orgData.country}
                  onChange={(e) => setOrgData({ ...orgData, country: e.target.value })}
                  required
                />
              </Grid>

              {/* Additional Information */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Employee Count"
                  type="number"
                  value={orgData.employeeCount}
                  onChange={(e) => setOrgData({ ...orgData, employeeCount: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={orgData.status}
                    label="Status"
                    onChange={(e) => setOrgData({ ...orgData, status: e.target.value })}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOrgDialog(false);
                resetOrgData();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={selectedOrg ? handleUpdateOrganization : handleCreateOrganization}
            >
              {selectedOrg ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* News Grid */}
        {loadingNews ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {news.map((item) => (
              <Grid item xs={12} md={6} key={item.id}>
                <Card>
                  {item.image && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.image}
                      alt={item.title}
                    />
                  )}
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        {item.title}
                      </Typography>
                      <Box>
                        <Chip
                          label={item.status}
                          color={
                            item.status === 'published' ? 'success' :
                            item.status === 'draft' ? 'default' : 'warning'
                          }
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Chip
                          label={item.priority}
                          color={
                            item.priority === 'high' ? 'error' :
                            item.priority === 'normal' ? 'primary' : 'default'
                          }
                          size="small"
                        />
                      </Box>
                    </Box>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {item.content.substring(0, 200)}...
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Category: {item.category}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Published: {new Date(item.publishDate).toLocaleDateString()}
                      </Typography>
                      {item.expiryDate && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          Expires: {new Date(item.expiryDate).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedNews(item);
                        setNewsData({
                          ...item,
                          image: null,
                        });
                        setNewsDialog(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDeleteNews(item.id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* News Dialog */}
        <Dialog
          open={newsDialog}
          onClose={() => {
            setNewsDialog(false);
            resetNewsData();
          }}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedNews ? 'Edit News' : 'Add News'}
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {/* Title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={newsData.title}
                  onChange={(e) => setNewsData({ ...newsData, title: e.target.value })}
                  required
                />
              </Grid>

              {/* Content */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Content"
                  multiline
                  rows={6}
                  value={newsData.content}
                  onChange={(e) => setNewsData({ ...newsData, content: e.target.value })}
                  required
                />
              </Grid>

              {/* Category and Priority */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newsData.category}
                    label="Category"
                    onChange={(e) => setNewsData({ ...newsData, category: e.target.value })}
                  >
                    <MenuItem value="general">General</MenuItem>
                    <MenuItem value="announcement">Announcement</MenuItem>
                    <MenuItem value="event">Event</MenuItem>
                    <MenuItem value="update">Update</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={newsData.priority}
                    label="Priority"
                    onChange={(e) => setNewsData({ ...newsData, priority: e.target.value })}
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Dates */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Publish Date"
                  type="date"
                  value={newsData.publishDate}
                  onChange={(e) => setNewsData({ ...newsData, publishDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Expiry Date"
                  type="date"
                  value={newsData.expiryDate}
                  onChange={(e) => setNewsData({ ...newsData, expiryDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  helperText="Optional"
                />
              </Grid>

              {/* Image Upload */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {newsData.image ? (
                    <Box sx={{ mr: 2 }}>
                      <img
                        src={URL.createObjectURL(newsData.image)}
                        alt="Preview"
                        style={{ maxWidth: 200, maxHeight: 200 }}
                      />
                    </Box>
                  ) : selectedNews?.image ? (
                    <Box sx={{ mr: 2 }}>
                      <img
                        src={selectedNews.image}
                        alt="Current"
                        style={{ maxWidth: 200, maxHeight: 200 }}
                      />
                    </Box>
                  ) : null}
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<ImageIcon />}
                  >
                    Upload Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => setNewsData({
                        ...newsData,
                        image: e.target.files[0],
                      })}
                    />
                  </Button>
                </Box>
              </Grid>

              {/* Status */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newsData.status}
                    label="Status"
                    onChange={(e) => setNewsData({ ...newsData, status: e.target.value })}
                  >
                    <MenuItem value="draft">Draft</MenuItem>
                    <MenuItem value="published">Published</MenuItem>
                    <MenuItem value="archived">Archived</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setNewsDialog(false);
                resetNewsData();
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={selectedNews ? handleUpdateNews : handleCreateNews}
            >
              {selectedNews ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* System Settings */}
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            System Settings
          </Typography>

          {loadingSettings ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {/* General Settings */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      General Settings
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Site Name"
                          value={systemSettings.siteName}
                          onChange={(e) => setSystemSettings({
                            ...systemSettings,
                            siteName: e.target.value
                          })}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Site Description"
                          value={systemSettings.siteDescription}
                          onChange={(e) => setSystemSettings({
                            ...systemSettings,
                            siteDescription: e.target.value
                          })}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={systemSettings.maintenanceMode}
                              onChange={(e) => setSystemSettings({
                                ...systemSettings,
                                maintenanceMode: e.target.checked
                              })}
                            />
                          }
                          label="Maintenance Mode"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Appearance Settings */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PaletteIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        Appearance
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <InputLabel>Theme</InputLabel>
                          <Select
                            value={systemSettings.theme}
                            label="Theme"
                            onChange={(e) => setSystemSettings({
                              ...systemSettings,
                              theme: e.target.value
                            })}
                          >
                            {themes.map((theme) => (
                              <MenuItem key={theme.id} value={theme.value}>
                                {theme.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Date Format</InputLabel>
                          <Select
                            value={systemSettings.dateFormat}
                            label="Date Format"
                            onChange={(e) => setSystemSettings({
                              ...systemSettings,
                              dateFormat: e.target.value
                            })}
                          >
                            <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                            <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                            <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel>Time Format</InputLabel>
                          <Select
                            value={systemSettings.timeFormat}
                            label="Time Format"
                            onChange={(e) => setSystemSettings({
                              ...systemSettings,
                              timeFormat: e.target.value
                            })}
                          >
                            <MenuItem value="12">12 Hour</MenuItem>
                            <MenuItem value="24">24 Hour</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Email Settings */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EmailIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        Email Settings
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="SMTP Host"
                          value={systemSettings.emailSettings.smtpHost}
                          onChange={(e) => setSystemSettings({
                            ...systemSettings,
                            emailSettings: {
                              ...systemSettings.emailSettings,
                              smtpHost: e.target.value
                            }
                          })}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="SMTP Port"
                          value={systemSettings.emailSettings.smtpPort}
                          onChange={(e) => setSystemSettings({
                            ...systemSettings,
                            emailSettings: {
                              ...systemSettings.emailSettings,
                              smtpPort: e.target.value
                            }
                          })}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="SMTP Username"
                          value={systemSettings.emailSettings.smtpUser}
                          onChange={(e) => setSystemSettings({
                            ...systemSettings,
                            emailSettings: {
                              ...systemSettings.emailSettings,
                              smtpUser: e.target.value
                            }
                          })}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          type="password"
                          label="SMTP Password"
                          value={systemSettings.emailSettings.smtpPassword}
                          onChange={(e) => setSystemSettings({
                            ...systemSettings,
                            emailSettings: {
                              ...systemSettings.emailSettings,
                              smtpPassword: e.target.value
                            }
                          })}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Sender Email"
                          value={systemSettings.emailSettings.senderEmail}
                          onChange={(e) => setSystemSettings({
                            ...systemSettings,
                            emailSettings: {
                              ...systemSettings.emailSettings,
                              senderEmail: e.target.value
                            }
                          })}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Sender Name"
                          value={systemSettings.emailSettings.senderName}
                          onChange={(e) => setSystemSettings({
                            ...systemSettings,
                            emailSettings: {
                              ...systemSettings.emailSettings,
                              senderName: e.target.value
                            }
                          })}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          variant="outlined"
                          startIcon={<SendIcon />}
                          onClick={handleEmailTest}
                          disabled={testingEmail}
                        >
                          {testingEmail ? 'Sending Test Email...' : 'Send Test Email'}
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Notification Settings */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Notification Settings
                    </Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={systemSettings.notifications.emailNotifications}
                            onChange={(e) => setSystemSettings({
                              ...systemSettings,
                              notifications: {
                                ...systemSettings.notifications,
                                emailNotifications: e.target.checked
                              }
                            })}
                          />
                        }
                        label="Email Notifications"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={systemSettings.notifications.systemNotifications}
                            onChange={(e) => setSystemSettings({
                              ...systemSettings,
                              notifications: {
                                ...systemSettings.notifications,
                                systemNotifications: e.target.checked
                              }
                            })}
                          />
                        }
                        label="System Notifications"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={systemSettings.notifications.reportSubmissions}
                            onChange={(e) => setSystemSettings({
                              ...systemSettings,
                              notifications: {
                                ...systemSettings.notifications,
                                reportSubmissions: e.target.checked
                              }
                            })}
                          />
                        }
                        label="Report Submissions"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={systemSettings.notifications.evaluationUpdates}
                            onChange={(e) => setSystemSettings({
                              ...systemSettings,
                              notifications: {
                                ...systemSettings.notifications,
                                evaluationUpdates: e.target.checked
                              }
                            })}
                          />
                        }
                        label="Evaluation Updates"
                      />
                    </FormGroup>
                  </CardContent>
                </Card>
              </Grid>

              {/* Security Settings */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Security Settings
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Session Timeout (minutes)"
                          value={systemSettings.security.sessionTimeout}
                          onChange={(e) => setSystemSettings({
                            ...systemSettings,
                            security: {
                              ...systemSettings.security,
                              sessionTimeout: e.target.value
                            }
                          })}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Password Expiry (days)"
                          value={systemSettings.security.passwordExpiry}
                          onChange={(e) => setSystemSettings({
                            ...systemSettings,
                            security: {
                              ...systemSettings.security,
                              passwordExpiry: e.target.value
                            }
                          })}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          type="number"
                          label="Max Login Attempts"
                          value={systemSettings.security.maxLoginAttempts}
                          onChange={(e) => setSystemSettings({
                            ...systemSettings,
                            security: {
                              ...systemSettings.security,
                              maxLoginAttempts: e.target.value
                            }
                          })}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={systemSettings.security.twoFactorAuth}
                              onChange={(e) => setSystemSettings({
                                ...systemSettings,
                                security: {
                                  ...systemSettings.security,
                                  twoFactorAuth: e.target.checked
                                }
                              })}
                            />
                          }
                          label="Two-Factor Authentication"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* System Maintenance */}
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <BackupIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        System Maintenance
                      </Typography>
                    </Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          startIcon={<BackupIcon />}
                          onClick={handleSystemBackup}
                          disabled={backingUp}
                        >
                          {backingUp ? 'Creating Backup...' : 'Create System Backup'}
                        </Button>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          System Logs
                        </Typography>
                        <Paper variant="outlined" sx={{ mt: 1, p: 2, maxHeight: 200, overflow: 'auto' }}>
                          {systemLogs.map((log, index) => (
                            <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                              {new Date(log.timestamp).toLocaleString()} - {log.message}
                            </Typography>
                          ))}
                        </Paper>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Save Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    onClick={handleSettingsUpdate}
                    startIcon={<SaveIcon />}
                  >
                    Save Settings
                  </Button>
                </Box>
              </Grid>
            </Grid>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminDashboard; 