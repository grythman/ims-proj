import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardActions,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
  Rating,
  Snackbar,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar,
  Star as StarIcon,
} from '@mui/material';
import {
  Assessment,
  School,
  Person,
  Schedule,
  Description,
  Add as AddIcon,
  CloudUpload as CloudUploadIcon,
  Work,
  Close as CloseIcon,
  ArrowRight as ArrowRightIcon,
  PhotoCamera,
  CalendarToday,
  Event,
  EventAvailable,
  AccessTime,
} from '@mui/icons-material';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator
} from '@mui/lab';
import {
  submitReport,
  registerInternship,
  getInternshipDetails,
  getAvailableCompanies,
  getMentorEvaluations,
  getEvaluationDetails,
  getTeacherEvaluations,
  getTeacherEvaluationDetails,
  getStudentProfile,
  updateStudentProfile,
  updateStudentAvatar,
  submitPreliminaryReport,
  getPreliminaryReportStatus,
  getPreliminaryReportFeedback,
  updatePreliminaryReport,
  getInternshipDuration
} from '../../services/api';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [studentData, setStudentData] = useState({
    internshipStatus: 'Active',
    reportStatus: 'Pending',
    evaluations: [],
    internshipDuration: {
      startDate: '2024-01-01',
      endDate: '2024-06-30',
    },
  });
  const [openReportDialog, setOpenReportDialog] = useState(false);
  const [reportData, setReportData] = useState({
    title: '',
    description: '',
    file: null,
  });
  const [reports, setReports] = useState([
    // Sample data - replace with API call
    {
      id: 1,
      title: 'Weekly Report 1',
      submissionDate: '2024-03-15',
      status: 'pending',
    },
    {
      id: 2,
      title: 'Monthly Progress Report',
      submissionDate: '2024-03-01',
      status: 'evaluated',
    },
  ]);
  const [internshipData, setInternshipData] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    supervisor: '',
    description: '',
  });
  const [companies, setCompanies] = useState([]);
  const [registrationStatus, setRegistrationStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [internshipDetails, setInternshipDetails] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [evaluationDialogOpen, setEvaluationDialogOpen] = useState(false);
  const [loadingEvaluations, setLoadingEvaluations] = useState(false);
  const [teacherEvaluations, setTeacherEvaluations] = useState([]);
  const [selectedTeacherEvaluation, setSelectedTeacherEvaluation] = useState(null);
  const [teacherEvaluationDialogOpen, setTeacherEvaluationDialogOpen] = useState(false);
  const [loadingTeacherEvaluations, setLoadingTeacherEvaluations] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    studentId: '',
    department: '',
    semester: '',
    address: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: '',
    },
  });
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [preliminaryReports, setPreliminaryReports] = useState([]);
  const [selectedPrelimReport, setSelectedPrelimReport] = useState(null);
  const [prelimReportDialog, setPrelimReportDialog] = useState(false);
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [revisionDialog, setRevisionDialog] = useState(false);
  const [internshipDuration, setInternshipDuration] = useState(null);
  const [loadingDuration, setLoadingDuration] = useState(false);
  const [evaluationType, setEvaluationType] = useState('mentor');

  useEffect(() => {
    const fetchInternshipDetails = async () => {
      try {
        const response = await getInternshipDetails();
        setInternshipDetails(response.data);
      } catch (error) {
        console.error('Error fetching internship details:', error);
      }
    };

    const fetchCompanies = async () => {
      try {
        const response = await getAvailableCompanies();
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    const fetchEvaluations = async () => {
      setLoadingEvaluations(true);
      try {
        const response = await getMentorEvaluations();
        setEvaluations(response.data);
      } catch (error) {
        console.error('Error fetching evaluations:', error);
      }
      setLoadingEvaluations(false);
    };

    const fetchTeacherEvaluations = async () => {
      setLoadingTeacherEvaluations(true);
      try {
        const response = await getTeacherEvaluations();
        setTeacherEvaluations(response.data);
      } catch (error) {
        console.error('Error fetching teacher evaluations:', error);
      }
      setLoadingTeacherEvaluations(false);
    };

    const fetchProfileData = async () => {
      try {
        const response = await getStudentProfile();
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setNotification({
          open: true,
          message: 'Error loading profile data',
          severity: 'error',
        });
      }
    };

    const fetchPreliminaryReports = async () => {
      try {
        const response = await getPreliminaryReportStatus();
        setPreliminaryReports(response.data);
      } catch (error) {
        console.error('Error fetching preliminary reports:', error);
      }
    };

    const fetchInternshipDuration = async () => {
      setLoadingDuration(true);
      try {
        const response = await getInternshipDuration();
        setInternshipDuration(response.data);
      } catch (error) {
        console.error('Error fetching internship duration:', error);
        setNotification({
          open: true,
          message: 'Error loading internship duration',
          severity: 'error',
        });
      }
      setLoadingDuration(false);
    };

    fetchInternshipDetails();
    fetchCompanies();
    fetchEvaluations();
    fetchTeacherEvaluations();
    fetchProfileData();
    fetchPreliminaryReports();
    fetchInternshipDuration();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', reportData.title);
      formData.append('description', reportData.description);
      formData.append('file', reportData.file);

      await submitReport(formData);
      setOpenReportDialog(false);
      // Refresh reports list
      // Add success notification
    } catch (error) {
      console.error('Error submitting report:', error);
      // Add error notification
    }
  };

  const handleFileChange = (e) => {
    setReportData({
      ...reportData,
      file: e.target.files[0],
    });
  };

  const handleInternshipRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerInternship(internshipData);
      setRegistrationStatus('success');
      // Refresh internship details
      const response = await getInternshipDetails();
      setInternshipDetails(response.data);
    } catch (error) {
      setRegistrationStatus('error');
      console.error('Error registering internship:', error);
    }
    setLoading(false);
  };

  const handleViewEvaluation = async (evaluationId) => {
    try {
      const response = await getEvaluationDetails(evaluationId);
      setSelectedEvaluation(response.data);
      setEvaluationDialogOpen(true);
    } catch (error) {
      console.error('Error fetching evaluation details:', error);
    }
  };

  const handleViewTeacherEvaluation = async (evaluationId) => {
    try {
      const response = await getTeacherEvaluationDetails(evaluationId);
      setSelectedTeacherEvaluation(response.data);
      setTeacherEvaluationDialogOpen(true);
    } catch (error) {
      console.error('Error fetching teacher evaluation details:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateStudentProfile(profileData);
      setEditMode(false);
      setNotification({
        open: true,
        message: 'Profile updated successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      setNotification({
        open: true,
        message: 'Error updating profile',
        severity: 'error',
      });
    }
    setSaving(false);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);
      try {
        await updateStudentAvatar(formData);
        // Refresh profile data to get new avatar
        const response = await getStudentProfile();
        setProfileData(response.data);
        setNotification({
          open: true,
          message: 'Profile picture updated successfully',
          severity: 'success',
        });
      } catch (error) {
        console.error('Error updating avatar:', error);
        setNotification({
          open: true,
          message: 'Error updating profile picture',
          severity: 'error',
        });
      }
    }
  };

  const handlePreliminarySubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', reportData.title);
      formData.append('description', reportData.description);
      formData.append('file', reportData.file);
      formData.append('type', 'preliminary');

      await submitPreliminaryReport(formData);
      setPrelimReportDialog(false);
      // Refresh reports list
      const response = await getPreliminaryReportStatus();
      setPreliminaryReports(response.data);
      setNotification({
        open: true,
        message: 'Preliminary report submitted successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error submitting preliminary report:', error);
      setNotification({
        open: true,
        message: 'Error submitting preliminary report',
        severity: 'error',
      });
    }
  };

  const handleViewFeedback = async (reportId) => {
    try {
      const response = await getPreliminaryReportFeedback(reportId);
      setSelectedPrelimReport(response.data);
      setFeedbackDialog(true);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Quick Stats */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Dashboard Overview
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Internship Status
                    </Typography>
                    <Typography variant="h5">
                      {studentData.internshipStatus}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={3}>
                <Card>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Report Status
                    </Typography>
                    <Typography variant="h5">
                      {studentData.reportStatus}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {/* Add more quick stat cards */}
            </Grid>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12}>
          <Paper sx={{ width: '100%' }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab icon={<Description />} label="Reports" />
              <Tab icon={<Assessment />} label="Evaluations" />
              <Tab icon={<Person />} label="Profile" />
              <Tab icon={<Schedule />} label="Schedule" />
              <Tab icon={<Work />} label="Internship" />
            </Tabs>
            
            {/* Reports Tab */}
            {activeTab === 0 && (
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6">Reports</Typography>
                  <Box>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={() => setPrelimReportDialog(true)}
                      sx={{ mr: 2 }}
                    >
                      Submit Preliminary Report
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenReportDialog(true)}
                    >
                      Submit Final Report
                    </Button>
                  </Box>
                </Box>

                {/* Preliminary Reports Section */}
                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                  Preliminary Reports
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Submission Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Feedback</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {preliminaryReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>{report.title}</TableCell>
                          <TableCell>{new Date(report.submissionDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Chip
                              label={report.status}
                              color={
                                report.status === 'approved' ? 'success' :
                                report.status === 'needs_revision' ? 'warning' :
                                report.status === 'rejected' ? 'error' : 'default'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {report.hasFeedback && (
                              <Button
                                size="small"
                                color="primary"
                                onClick={() => handleViewFeedback(report.id)}
                              >
                                View Feedback
                              </Button>
                            )}
                          </TableCell>
                          <TableCell>
                            {report.status === 'needs_revision' && (
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => {
                                  setSelectedPrelimReport(report);
                                  setRevisionDialog(true);
                                }}
                              >
                                Submit Revision
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Preliminary Report Submission Dialog */}
                <Dialog
                  open={prelimReportDialog}
                  onClose={() => setPrelimReportDialog(false)}
                  maxWidth="md"
                  fullWidth
                >
                  <DialogTitle>Submit Preliminary Report</DialogTitle>
                  <form onSubmit={handlePreliminarySubmit}>
                    <DialogContent>
                      <TextField
                        autoFocus
                        margin="dense"
                        label="Report Title"
                        type="text"
                        fullWidth
                        required
                        value={reportData.title}
                        onChange={(e) => setReportData({ ...reportData, title: e.target.value })}
                      />
                      <TextField
                        margin="dense"
                        label="Description"
                        multiline
                        rows={4}
                        fullWidth
                        required
                        value={reportData.description}
                        onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                      />
                      <Button
                        component="label"
                        variant="outlined"
                        startIcon={<CloudUploadIcon />}
                        sx={{ mt: 2 }}
                      >
                        Upload Report File
                        <input
                          type="file"
                          hidden
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                        />
                      </Button>
                      {reportData.file && (
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          Selected file: {reportData.file.name}
                        </Typography>
                      )}
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setPrelimReportDialog(false)}>Cancel</Button>
                      <Button type="submit" variant="contained">
                        Submit
                      </Button>
                    </DialogActions>
                  </form>
                </Dialog>

                {/* Feedback Dialog */}
                <Dialog
                  open={feedbackDialog}
                  onClose={() => setFeedbackDialog(false)}
                  maxWidth="md"
                  fullWidth
                >
                  <DialogTitle>Report Feedback</DialogTitle>
                  <DialogContent dividers>
                    {selectedPrelimReport && (
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1" gutterBottom>
                            Report: {selectedPrelimReport.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Submitted on: {new Date(selectedPrelimReport.submissionDate).toLocaleDateString()}
                          </Typography>
                        </Grid>
                        
                        <Grid item xs={12}>
                          <Typography variant="h6" gutterBottom>
                            Reviewer Comments
                          </Typography>
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="body1">
                              {selectedPrelimReport.feedback}
                            </Typography>
                          </Paper>
                        </Grid>

                        {selectedPrelimReport.suggestedChanges && (
                          <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                              Suggested Changes
                            </Typography>
                            <List>
                              {selectedPrelimReport.suggestedChanges.map((change, index) => (
                                <ListItem key={index}>
                                  <ListItemIcon>
                                    <ArrowRightIcon />
                                  </ListItemIcon>
                                  <ListItemText primary={change} />
                                </ListItem>
                              ))}
                            </List>
                          </Grid>
                        )}
                      </Grid>
                    )}
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setFeedbackDialog(false)}>Close</Button>
                  </DialogActions>
                </Dialog>

                {/* Revision Submission Dialog */}
                <Dialog
                  open={revisionDialog}
                  onClose={() => setRevisionDialog(false)}
                  maxWidth="md"
                  fullWidth
                >
                  <DialogTitle>Submit Revision</DialogTitle>
                  <DialogContent>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Please submit your revised report addressing the feedback provided.
                    </Typography>
                    <TextField
                      margin="dense"
                      label="Revision Notes"
                      multiline
                      rows={4}
                      fullWidth
                      required
                      value={reportData.revisionNotes}
                      onChange={(e) => setReportData({ ...reportData, revisionNotes: e.target.value })}
                    />
                    <Button
                      component="label"
                      variant="outlined"
                      startIcon={<CloudUploadIcon />}
                      sx={{ mt: 2 }}
                    >
                      Upload Revised Report
                      <input
                        type="file"
                        hidden
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </Button>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setRevisionDialog(false)}>Cancel</Button>
                    <Button
                      variant="contained"
                      onClick={() => {
                        // Handle revision submission
                        setRevisionDialog(false);
                      }}
                    >
                      Submit Revision
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* Existing Final Reports Section */}
                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                  Final Reports
                </Typography>
                {/* Your existing reports table */}
              </Box>
            )}

            {/* Evaluations Tab */}
            {activeTab === 1 && (
              <Box sx={{ p: 3 }}>
                <Tabs
                  value={evaluationType}
                  onChange={(e, newValue) => setEvaluationType(newValue)}
                  sx={{ mb: 3 }}
                >
                  <Tab label="Mentor Evaluations" value="mentor" />
                  <Tab label="Teacher Evaluations" value="teacher" />
                </Tabs>

                {evaluationType === 'mentor' ? (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Mentor Evaluations
                    </Typography>

                    {loadingEvaluations ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <CircularProgress />
                      </Box>
                    ) : evaluations.length > 0 ? (
                      <Timeline position="alternate">
                        {evaluations.map((evaluation) => (
                          <TimelineItem key={evaluation.id}>
                            <TimelineOppositeContent color="text.secondary">
                              {new Date(evaluation.date).toLocaleDateString()}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                              <TimelineDot color={evaluation.score >= 4 ? "success" : evaluation.score >= 3 ? "primary" : "warning"} />
                              <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                              <Card>
                                <CardContent>
                                  <Typography variant="h6" component="div">
                                    {evaluation.title}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Rating
                                      value={evaluation.score}
                                      readOnly
                                      precision={0.5}
                                      emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                                    />
                                    <Typography variant="body2" sx={{ ml: 1 }}>
                                      ({evaluation.score}/5)
                                    </Typography>
                                  </Box>
                                  <Typography variant="body2" color="text.secondary">
                                    By: {evaluation.mentor_name}
                                  </Typography>
                                  <Button
                                    size="small"
                                    color="primary"
                                    onClick={() => handleViewEvaluation(evaluation.id)}
                                    sx={{ mt: 1 }}
                                  >
                                    View Details
                                  </Button>
                                </CardContent>
                              </Card>
                            </TimelineContent>
                          </TimelineItem>
                        ))}
                      </Timeline>
                    ) : (
                      <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                          No evaluations available yet.
                        </Typography>
                      </Paper>
                    )}

                    {/* Evaluation Details Dialog */}
                    <Dialog
                      open={evaluationDialogOpen}
                      onClose={() => setEvaluationDialogOpen(false)}
                      maxWidth="md"
                      fullWidth
                    >
                      {selectedEvaluation && (
                        <>
                          <DialogTitle>
                            Evaluation Details
                            <IconButton
                              aria-label="close"
                              onClick={() => setEvaluationDialogOpen(false)}
                              sx={{ position: 'absolute', right: 8, top: 8 }}
                            >
                              <CloseIcon />
                            </IconButton>
                          </DialogTitle>
                          <DialogContent dividers>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                  {selectedEvaluation.title}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                  Evaluated by {selectedEvaluation.mentor_name} on{' '}
                                  {new Date(selectedEvaluation.date).toLocaleDateString()}
                                </Typography>
                              </Grid>
                              
                              <Grid item xs={12}>
                                <Box sx={{ mb: 2 }}>
                                  <Typography variant="subtitle1" gutterBottom>
                                    Overall Performance
                                  </Typography>
                                  <Rating
                                    value={selectedEvaluation.score}
                                    readOnly
                                    precision={0.5}
                                    size="large"
                                  />
                                </Box>
                              </Grid>

                              {/* Evaluation Categories */}
                              {selectedEvaluation.categories?.map((category) => (
                                <Grid item xs={12} md={6} key={category.name}>
                                  <Card variant="outlined" sx={{ height: '100%' }}>
                                    <CardContent>
                                      <Typography variant="subtitle1" gutterBottom>
                                        {category.name}
                                      </Typography>
                                      <Rating value={category.score} readOnly precision={0.5} />
                                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {category.comments}
                                      </Typography>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))}

                              {/* General Feedback */}
                              <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                  General Feedback
                                </Typography>
                                <Paper variant="outlined" sx={{ p: 2 }}>
                                  <Typography variant="body1">
                                    {selectedEvaluation.feedback}
                                  </Typography>
                                </Paper>
                              </Grid>

                              {/* Areas for Improvement */}
                              {selectedEvaluation.improvements && (
                                <Grid item xs={12}>
                                  <Typography variant="subtitle1" gutterBottom>
                                    Areas for Improvement
                                  </Typography>
                                  <List>
                                    {selectedEvaluation.improvements.map((item, index) => (
                                      <ListItem key={index}>
                                        <ListItemIcon>
                                          <ArrowRightIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={item} />
                                      </ListItem>
                                    ))}
                                  </List>
                                </Grid>
                              )}
                            </Grid>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={() => setEvaluationDialogOpen(false)}>Close</Button>
                          </DialogActions>
                        </>
                      )}
                    </Dialog>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Teacher Evaluations
                    </Typography>

                    {loadingTeacherEvaluations ? (
                      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <CircularProgress />
                      </Box>
                    ) : teacherEvaluations.length > 0 ? (
                      <Grid container spacing={3}>
                        {teacherEvaluations.map((evaluation) => (
                          <Grid item xs={12} md={6} key={evaluation.id}>
                            <Card>
                              <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                  <Typography variant="h6" gutterBottom>
                                    {evaluation.title}
                                  </Typography>
                                  <Chip
                                    label={evaluation.semester}
                                    color="primary"
                                    size="small"
                                  />
                                </Box>
                                
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  Evaluated by: {evaluation.teacher_name}
                                </Typography>
                                
                                <Typography variant="body2" color="text.secondary">
                                  Date: {new Date(evaluation.date).toLocaleDateString()}
                                </Typography>

                                <Box sx={{ mt: 2, mb: 1 }}>
                                  <Typography variant="subtitle2" gutterBottom>
                                    Overall Grade
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="h4" color="primary" sx={{ mr: 1 }}>
                                      {evaluation.grade}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      / {evaluation.max_grade}
                                    </Typography>
                                  </Box>
                                </Box>

                                <Button
                                  variant="outlined"
                                  size="small"
                                  onClick={() => handleViewTeacherEvaluation(evaluation.id)}
                                  sx={{ mt: 2 }}
                                >
                                  View Details
                                </Button>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Paper sx={{ p: 3, textAlign: 'center' }}>
                        <Typography color="text.secondary">
                          No teacher evaluations available yet.
                        </Typography>
                      </Paper>
                    )}

                    {/* Teacher Evaluation Details Dialog */}
                    <Dialog
                      open={teacherEvaluationDialogOpen}
                      onClose={() => setTeacherEvaluationDialogOpen(false)}
                      maxWidth="md"
                      fullWidth
                    >
                      {selectedTeacherEvaluation && (
                        <>
                          <DialogTitle>
                            Teacher Evaluation Details
                            <IconButton
                              aria-label="close"
                              onClick={() => setTeacherEvaluationDialogOpen(false)}
                              sx={{ position: 'absolute', right: 8, top: 8 }}
                            >
                              <CloseIcon />
                            </IconButton>
                          </DialogTitle>
                          <DialogContent dividers>
                            <Grid container spacing={3}>
                              <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom>
                                  {selectedTeacherEvaluation.title}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                  Evaluated by {selectedTeacherEvaluation.teacher_name} | {selectedTeacherEvaluation.semester}
                                </Typography>
                              </Grid>

                              <Grid item xs={12}>
                                <Card variant="outlined">
                                  <CardContent>
                                    <Typography variant="h5" gutterBottom>
                                      Overall Grade: {selectedTeacherEvaluation.grade} / {selectedTeacherEvaluation.max_grade}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      Evaluation Date: {new Date(selectedTeacherEvaluation.date).toLocaleDateString()}
                                    </Typography>
                                  </CardContent>
                                </Card>
                              </Grid>

                              {/* Evaluation Criteria */}
                              {selectedTeacherEvaluation.criteria?.map((criterion) => (
                                <Grid item xs={12} md={6} key={criterion.name}>
                                  <Card variant="outlined">
                                    <CardContent>
                                      <Typography variant="subtitle1" gutterBottom>
                                        {criterion.name}
                                      </Typography>
                                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="h6" color="primary">
                                          {criterion.score}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                          / {criterion.max_score}
                                        </Typography>
                                      </Box>
                                      <Typography variant="body2" color="text.secondary">
                                        {criterion.comments}
                                      </Typography>
                                    </CardContent>
                                  </Card>
                                </Grid>
                              ))}

                              {/* Recommendations */}
                              {selectedTeacherEvaluation.recommendations && (
                                <Grid item xs={12}>
                                  <Typography variant="h6" gutterBottom>
                                    Recommendations
                                  </Typography>
                                  <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="body1">
                                      {selectedTeacherEvaluation.recommendations}
                                    </Typography>
                                  </Paper>
                                </Grid>
                              )}

                              {/* Additional Comments */}
                              {selectedTeacherEvaluation.comments && (
                                <Grid item xs={12}>
                                  <Typography variant="h6" gutterBottom>
                                    Additional Comments
                                  </Typography>
                                  <Paper variant="outlined" sx={{ p: 2 }}>
                                    <Typography variant="body1">
                                      {selectedTeacherEvaluation.comments}
                                    </Typography>
                                  </Paper>
                                </Grid>
                              )}
                            </Grid>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={() => setTeacherEvaluationDialogOpen(false)}>
                              Close
                            </Button>
                          </DialogActions>
                        </>
                      )}
                    </Dialog>
                  </Box>
                )}
              </Box>
            )}

            {/* Profile Tab */}
            {activeTab === 2 && (
              <Box sx={{ p: 3 }}>
                <Paper sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6">Personal Information</Typography>
                    <Button
                      variant="contained"
                      color={editMode ? "error" : "primary"}
                      onClick={() => setEditMode(!editMode)}
                    >
                      {editMode ? "Cancel" : "Edit Profile"}
                    </Button>
                  </Box>

                  <Box component="form" onSubmit={handleProfileUpdate}>
                    <Grid container spacing={3}>
                      {/* Profile Picture */}
                      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={editMode && (
                            <IconButton
                              component="label"
                              sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': { bgcolor: 'primary.dark' },
                              }}
                            >
                              <PhotoCamera />
                              <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                              />
                            </IconButton>
                          )}
                        >
                          <Avatar
                            src={profileData.avatarUrl}
                            sx={{ width: 100, height: 100 }}
                          />
                        </Badge>
                      </Grid>

                      {/* Personal Details */}
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="First Name"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                          disabled={!editMode}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Last Name"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                          disabled={!editMode}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          disabled={!editMode}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Phone Number"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          disabled={!editMode}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Student ID"
                          value={profileData.studentId}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Department"
                          value={profileData.department}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Semester"
                          value={profileData.semester}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Address"
                          multiline
                          rows={2}
                          value={profileData.address}
                          onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                          disabled={!editMode}
                        />
                      </Grid>

                      {/* Emergency Contact */}
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                          Emergency Contact
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Contact Name"
                          value={profileData.emergencyContact.name}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            emergencyContact: {
                              ...profileData.emergencyContact,
                              name: e.target.value,
                            },
                          })}
                          disabled={!editMode}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Relationship"
                          value={profileData.emergencyContact.relationship}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            emergencyContact: {
                              ...profileData.emergencyContact,
                              relationship: e.target.value,
                            },
                          })}
                          disabled={!editMode}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Emergency Contact Phone"
                          value={profileData.emergencyContact.phone}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            emergencyContact: {
                              ...profileData.emergencyContact,
                              phone: e.target.value,
                            },
                          })}
                          disabled={!editMode}
                        />
                      </Grid>
                    </Grid>

                    {editMode && (
                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={saving}
                          startIcon={saving ? <CircularProgress size={20} /> : null}
                        >
                          Save Changes
                        </Button>
                      </Box>
                    )}
                  </Box>
                </Paper>

                {/* Notification Snackbar */}
                <Snackbar
                  open={notification.open}
                  autoHideDuration={6000}
                  onClose={() => setNotification({ ...notification, open: false })}
                >
                  <Alert
                    onClose={() => setNotification({ ...notification, open: false })}
                    severity={notification.severity}
                    sx={{ width: '100%' }}
                  >
                    {notification.message}
                  </Alert>
                </Snackbar>
              </Box>
            )}

            {/* Schedule Tab */}
            {activeTab === 3 && (
              <Box sx={{ p: 3 }}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Internship Duration
                  </Typography>

                  {loadingDuration ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                      <CircularProgress />
                    </Box>
                  ) : internshipDuration ? (
                    <Grid container spacing={3}>
                      {/* Duration Overview Card */}
                      <Grid item xs={12}>
                        <Card sx={{ mb: 3 }}>
                          <CardContent>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center', p: 2 }}>
                                  <CalendarToday color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                  <Typography variant="h6" gutterBottom>
                                    Start Date
                                  </Typography>
                                  <Typography variant="h5" color="primary">
                                    {new Date(internshipDuration.startDate).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center', p: 2 }}>
                                  <AccessTime color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                  <Typography variant="h6" gutterBottom>
                                    Duration
                                  </Typography>
                                  <Typography variant="h5" color="primary">
                                    {internshipDuration.totalWeeks} weeks
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: 'center', p: 2 }}>
                                  <Event color="primary" sx={{ fontSize: 40, mb: 1 }} />
                                  <Typography variant="h6" gutterBottom>
                                    End Date
                                  </Typography>
                                  <Typography variant="h5" color="primary">
                                    {new Date(internshipDuration.endDate).toLocaleDateString()}
                                  </Typography>
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Progress Card */}
                      <Grid item xs={12} md={6}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              Progress Overview
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                              <LinearProgress
                                variant="determinate"
                                value={internshipDuration.progressPercentage}
                                sx={{ height: 10, borderRadius: 5 }}
                              />
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {internshipDuration.progressPercentage}% Complete
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                              {internshipDuration.remainingDays} days remaining
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Important Dates Card */}
                      <Grid item xs={12} md={6}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              Important Dates
                            </Typography>
                            <Timeline>
                              {internshipDuration.importantDates?.map((date, index) => (
                                <TimelineItem key={index}>
                                  <TimelineOppositeContent color="text.secondary">
                                    {new Date(date.date).toLocaleDateString()}
                                  </TimelineOppositeContent>
                                  <TimelineSeparator>
                                    <TimelineDot color={date.completed ? "success" : "primary"}>
                                      <EventAvailable />
                                    </TimelineDot>
                                    {index < internshipDuration.importantDates.length - 1 && (
                                      <TimelineConnector />
                                    )}
                                  </TimelineSeparator>
                                  <TimelineContent>
                                    <Typography variant="body1">
                                      {date.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                      {date.description}
                                    </Typography>
                                  </TimelineContent>
                                </TimelineItem>
                              ))}
                            </Timeline>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Weekly Schedule Card */}
                      <Grid item xs={12}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              Weekly Schedule
                            </Typography>
                            <TableContainer>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Day</TableCell>
                                    <TableCell>Start Time</TableCell>
                                    <TableCell>End Time</TableCell>
                                    <TableCell>Total Hours</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {internshipDuration.weeklySchedule?.map((day) => (
                                    <TableRow key={day.day}>
                                      <TableCell>{day.day}</TableCell>
                                      <TableCell>{day.startTime}</TableCell>
                                      <TableCell>{day.endTime}</TableCell>
                                      <TableCell>{day.totalHours} hours</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  ) : (
                    <Alert severity="info">
                      No internship duration information available. Please register for an internship first.
                    </Alert>
                  )}
                </Paper>
              </Box>
            )}

            {/* Internship Tab */}
            {activeTab === 4 && (
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Internship Registration
                </Typography>

                {internshipDetails ? (
                  <Box sx={{ mb: 4 }}>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Current Internship Status
                    </Alert>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Card>
                          <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                              {internshipDetails.company}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                              Position: {internshipDetails.position}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Duration: {new Date(internshipDetails.startDate).toLocaleDateString()} - {new Date(internshipDetails.endDate).toLocaleDateString()}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  </Box>
                ) : (
                  <Box component="form" onSubmit={handleInternshipRegistration} sx={{ mt: 2 }}>
                    {registrationStatus === 'success' && (
                      <Alert severity="success" sx={{ mb: 2 }}>
                        Internship registration successful!
                      </Alert>
                    )}
                    {registrationStatus === 'error' && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        Error registering internship. Please try again.
                      </Alert>
                    )}

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth required>
                          <InputLabel>Company</InputLabel>
                          <Select
                            value={internshipData.company}
                            label="Company"
                            onChange={(e) => setInternshipData({ ...internshipData, company: e.target.value })}
                          >
                            {companies.map((company) => (
                              <MenuItem key={company.id} value={company.id}>
                                {company.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          label="Position"
                          value={internshipData.position}
                          onChange={(e) => setInternshipData({ ...internshipData, position: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          label="Start Date"
                          type="date"
                          value={internshipData.startDate}
                          onChange={(e) => setInternshipData({ ...internshipData, startDate: e.target.value })}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          required
                          label="End Date"
                          type="date"
                          value={internshipData.endDate}
                          onChange={(e) => setInternshipData({ ...internshipData, endDate: e.target.value })}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          required
                          label="Supervisor Name"
                          value={internshipData.supervisor}
                          onChange={(e) => setInternshipData({ ...internshipData, supervisor: e.target.value })}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label="Internship Description"
                          value={internshipData.description}
                          onChange={(e) => setInternshipData({ ...internshipData, description: e.target.value })}
                        />
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                      >
                        Register Internship
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default StudentDashboard; 