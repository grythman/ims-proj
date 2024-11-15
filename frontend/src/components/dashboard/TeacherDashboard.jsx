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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
  Rating,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Comment as CommentIcon,
  Assignment as AssignmentIcon,
  Star as StarIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Note as NoteIcon,
  Edit as EditIcon,
  Create as CreateIcon,
  SaveAlt as SaveAltIcon,
  Signature as Signature,
} from '@mui/icons-material';
import {
  getSubmittedReports,
  evaluateReport,
  getReportDetails,
  downloadReport,
  getMentorEvaluationsByTeacher,
  getMentorEvaluationDetails,
  addTeacherComment,
  updateMentorEvaluation,
  getStudentsList,
  getStudentProgressDetails,
  getStudentSubmissions,
  getStudentAllEvaluations,
  addProgressNote,
  submitFinalEvaluation,
  getFinalEvaluationTemplate,
  getStudentFinalEvaluationData,
  signFinalEvaluation,
} from '../../services/api';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator
} from '@mui/lab';

const TeacherDashboard = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [evaluationDialog, setEvaluationDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    search: '',
  });
  const [evaluationData, setEvaluationData] = useState({
    grade: '',
    comments: '',
    recommendations: '',
    status: 'pending',
  });
  const [mentorEvaluations, setMentorEvaluations] = useState([]);
  const [selectedMentorEval, setSelectedMentorEval] = useState(null);
  const [mentorEvalDialog, setMentorEvalDialog] = useState(false);
  const [commentDialog, setCommentDialog] = useState(false);
  const [teacherComment, setTeacherComment] = useState('');
  const [loadingMentorEvals, setLoadingMentorEvals] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentProgress, setStudentProgress] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(false);
  const [progressNote, setProgressNote] = useState('');
  const [noteDialog, setNoteDialog] = useState(false);
  const [finalEvalDialog, setFinalEvalDialog] = useState(false);
  const [selectedStudentForFinal, setSelectedStudentForFinal] = useState(null);
  const [finalEvalData, setFinalEvalData] = useState({
    academicPerformance: '',
    technicalSkills: '',
    softSkills: '',
    overallPerformance: '',
    recommendations: '',
    grade: '',
    comments: '',
  });
  const [signatureData, setSignatureData] = useState('');
  const [evaluationTemplate, setEvaluationTemplate] = useState(null);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    fetchReports();
    const fetchMentorEvaluations = async () => {
      setLoadingMentorEvals(true);
      try {
        const response = await getMentorEvaluationsByTeacher();
        setMentorEvaluations(response.data);
      } catch (error) {
        console.error('Error fetching mentor evaluations:', error);
        setNotification({
          open: true,
          message: 'Error loading mentor evaluations',
          severity: 'error',
        });
      }
      setLoadingMentorEvals(false);
    };

    fetchMentorEvaluations();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await getStudentsList();
        setStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchEvaluationTemplate = async () => {
      setLoadingTemplate(true);
      try {
        const response = await getFinalEvaluationTemplate();
        setEvaluationTemplate(response.data);
      } catch (error) {
        console.error('Error fetching evaluation template:', error);
      }
      setLoadingTemplate(false);
    };

    fetchEvaluationTemplate();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await getSubmittedReports();
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setNotification({
        open: true,
        message: 'Error loading reports',
        severity: 'error',
      });
    }
    setLoading(false);
  };

  const handleViewReport = async (reportId) => {
    try {
      const response = await getReportDetails(reportId);
      setSelectedReport(response.data);
      setEvaluationDialog(true);
    } catch (error) {
      console.error('Error fetching report details:', error);
      setNotification({
        open: true,
        message: 'Error loading report details',
        severity: 'error',
      });
    }
  };

  const handleDownload = async (reportId) => {
    try {
      const response = await downloadReport(reportId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report-${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading report:', error);
      setNotification({
        open: true,
        message: 'Error downloading report',
        severity: 'error',
      });
    }
  };

  const handleEvaluate = async (reportId) => {
    try {
      await evaluateReport(reportId, evaluationData);
      setEvaluationDialog(false);
      fetchReports(); // Refresh the reports list
      setNotification({
        open: true,
        message: 'Report evaluated successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error evaluating report:', error);
      setNotification({
        open: true,
        message: 'Error evaluating report',
        severity: 'error',
      });
    }
  };

  const handleViewMentorEvaluation = async (evaluationId) => {
    try {
      const response = await getMentorEvaluationDetails(evaluationId);
      setSelectedMentorEval(response.data);
      setMentorEvalDialog(true);
    } catch (error) {
      console.error('Error fetching mentor evaluation details:', error);
      setNotification({
        open: true,
        message: 'Error loading evaluation details',
        severity: 'error',
      });
    }
  };

  const handleAddComment = async () => {
    try {
      await addTeacherComment(selectedMentorEval.id, { comment: teacherComment });
      setCommentDialog(false);
      // Refresh evaluation details
      const response = await getMentorEvaluationDetails(selectedMentorEval.id);
      setSelectedMentorEval(response.data);
      setNotification({
        open: true,
        message: 'Comment added successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      setNotification({
        open: true,
        message: 'Error adding comment',
        severity: 'error',
      });
    }
  };

  const handleStudentSelect = async (studentId) => {
    setLoadingProgress(true);
    try {
      const [progressRes, submissionsRes, evaluationsRes] = await Promise.all([
        getStudentProgressDetails(studentId),
        getStudentSubmissions(studentId),
        getStudentAllEvaluations(studentId),
      ]);

      setSelectedStudent(studentId);
      setStudentProgress({
        ...progressRes.data,
        submissions: submissionsRes.data,
        evaluations: evaluationsRes.data,
      });
    } catch (error) {
      console.error('Error fetching student progress:', error);
      setNotification({
        open: true,
        message: 'Error loading student progress',
        severity: 'error',
      });
    }
    setLoadingProgress(false);
  };

  const handleAddNote = async () => {
    try {
      await addProgressNote(selectedStudent, { note: progressNote });
      setNoteDialog(false);
      // Refresh progress data
      const response = await getStudentProgressDetails(selectedStudent);
      setStudentProgress(prev => ({ ...prev, ...response.data }));
      setNotification({
        open: true,
        message: 'Note added successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error adding note:', error);
      setNotification({
        open: true,
        message: 'Error adding note',
        severity: 'error',
      });
    }
  };

  const handleFinalEvaluation = async (studentId) => {
    setSelectedStudentForFinal(studentId);
    try {
      const response = await getStudentFinalEvaluationData(studentId);
      setFinalEvalData(response.data);
      setFinalEvalDialog(true);
    } catch (error) {
      console.error('Error fetching student data:', error);
      setNotification({
        open: true,
        message: 'Error loading student data',
        severity: 'error',
      });
    }
  };

  const handleSubmitFinalEvaluation = async () => {
    try {
      const evaluationResponse = await submitFinalEvaluation(
        selectedStudentForFinal,
        finalEvalData
      );
      
      if (signatureData) {
        await signFinalEvaluation(evaluationResponse.data.id, {
          signature: signatureData
        });
      }

      setFinalEvalDialog(false);
      setNotification({
        open: true,
        message: 'Final evaluation submitted successfully',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error submitting final evaluation:', error);
      setNotification({
        open: true,
        message: 'Error submitting final evaluation',
        severity: 'error',
      });
    }
  };

  const filteredReports = reports.filter(report => {
    return (
      (filters.status === 'all' || report.status === filters.status) &&
      (filters.type === 'all' || report.type === filters.type) &&
      (report.student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        report.title.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Student Reports
        </Typography>

        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="evaluated">Evaluated</MenuItem>
                <MenuItem value="needs_revision">Needs Revision</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={filters.type}
                label="Report Type"
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="preliminary">Preliminary</MenuItem>
                <MenuItem value="final">Final</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Reports Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Report Title</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Submission Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.student.name}</TableCell>
                    <TableCell>{report.title}</TableCell>
                    <TableCell>
                      <Chip
                        label={report.type}
                        color={report.type === 'final' ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(report.submissionDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={report.status}
                        color={
                          report.status === 'evaluated' ? 'success' :
                          report.status === 'needs_revision' ? 'warning' :
                          'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="View Report">
                        <IconButton
                          onClick={() => handleViewReport(report.id)}
                          size="small"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Download Report">
                        <IconButton
                          onClick={() => handleDownload(report.id)}
                          size="small"
                        >
                          <DownloadIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Evaluation Dialog */}
        <Dialog
          open={evaluationDialog}
          onClose={() => setEvaluationDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Evaluate Report
            <IconButton
              onClick={() => setEvaluationDialog(false)}
              sx={{ position: 'absolute', right: 8, top: 8 }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            {selectedReport && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6">
                    {selectedReport.title}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    Submitted by {selectedReport.student.name} on{' '}
                    {new Date(selectedReport.submissionDate).toLocaleDateString()}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Grade"
                    type="number"
                    value={evaluationData.grade}
                    onChange={(e) => setEvaluationData({
                      ...evaluationData,
                      grade: e.target.value
                    })}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Comments"
                    multiline
                    rows={4}
                    value={evaluationData.comments}
                    onChange={(e) => setEvaluationData({
                      ...evaluationData,
                      comments: e.target.value
                    })}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Recommendations"
                    multiline
                    rows={3}
                    value={evaluationData.recommendations}
                    onChange={(e) => setEvaluationData({
                      ...evaluationData,
                      recommendations: e.target.value
                    })}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={evaluationData.status}
                      label="Status"
                      onChange={(e) => setEvaluationData({
                        ...evaluationData,
                        status: e.target.value
                      })}
                    >
                      <MenuItem value="approved">Approve</MenuItem>
                      <MenuItem value="needs_revision">Needs Revision</MenuItem>
                      <MenuItem value="rejected">Reject</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEvaluationDialog(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => handleEvaluate(selectedReport.id)}
            >
              Submit Evaluation
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification Alert */}
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

        {/* Mentor Evaluations Overview */}
        <Tab icon={<AssignmentIcon />} label="Mentor Evaluations" />
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Mentor Evaluations Overview
            </Typography>

            {loadingMentorEvals ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {/* Statistics Cards */}
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Total Evaluations
                          </Typography>
                          <Typography variant="h4">
                            {mentorEvaluations.length}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Average Rating
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="h4">
                              {mentorEvaluations.length > 0
                                ? (mentorEvaluations.reduce((acc, curr) => acc + curr.rating, 0) / mentorEvaluations.length).toFixed(1)
                                : 'N/A'}
                            </Typography>
                            <StarIcon color="primary" sx={{ ml: 1 }} />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Card>
                        <CardContent>
                          <Typography color="textSecondary" gutterBottom>
                            Pending Review
                          </Typography>
                          <Typography variant="h4">
                            {mentorEvaluations.filter(evaluation => !evaluation.teacherReviewed).length}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Evaluations List */}
                <Grid item xs={12}>
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Student</TableCell>
                          <TableCell>Mentor</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Rating</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Teacher Comments</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {mentorEvaluations.map((evaluation) => (
                          <TableRow key={evaluation.id}>
                            <TableCell>{evaluation.student.name}</TableCell>
                            <TableCell>{evaluation.mentor.name}</TableCell>
                            <TableCell>
                              {new Date(evaluation.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Rating value={evaluation.rating} readOnly precision={0.5} />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={evaluation.teacherReviewed ? "Reviewed" : "Pending"}
                                color={evaluation.teacherReviewed ? "success" : "warning"}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              {evaluation.teacherComments ? (
                                <Tooltip title={evaluation.teacherComments}>
                                  <IconButton size="small">
                                    <CommentIcon />
                                  </IconButton>
                                </Tooltip>
                              ) : (
                                <Typography variant="body2" color="text.secondary">
                                  No comments
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell align="right">
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleViewMentorEvaluation(evaluation.id)}
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            )}

            {/* Mentor Evaluation Details Dialog */}
            <Dialog
              open={mentorEvalDialog}
              onClose={() => setMentorEvalDialog(false)}
              maxWidth="md"
              fullWidth
            >
              {selectedMentorEval && (
                <>
                  <DialogTitle>
                    Mentor Evaluation Details
                    <IconButton
                      onClick={() => setMentorEvalDialog(false)}
                      sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </DialogTitle>
                  <DialogContent dividers>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Student: {selectedMentorEval.student.name}
                          </Typography>
                          <Typography variant="subtitle2" color="text.secondary">
                            Mentor: {selectedMentorEval.mentor.name}
                          </Typography>
                          <Typography variant="subtitle2" color="text.secondary">
                            Date: {new Date(selectedMentorEval.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                          Overall Rating
                        </Typography>
                        <Rating
                          value={selectedMentorEval.rating}
                          readOnly
                          precision={0.5}
                          size="large"
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                          Evaluation Categories
                        </Typography>
                        <Grid container spacing={2}>
                          {selectedMentorEval.categories.map((category) => (
                            <Grid item xs={12} md={6} key={category.name}>
                              <Card variant="outlined">
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
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                          Mentor Comments
                        </Typography>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="body1">
                            {selectedMentorEval.mentorComments}
                          </Typography>
                        </Paper>
                      </Grid>

                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                          Teacher Comments
                        </Typography>
                        {selectedMentorEval.teacherComments ? (
                          <Paper variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="body1">
                              {selectedMentorEval.teacherComments}
                            </Typography>
                          </Paper>
                        ) : (
                          <Button
                            variant="outlined"
                            startIcon={<CommentIcon />}
                            onClick={() => setCommentDialog(true)}
                          >
                            Add Comment
                          </Button>
                        )}
                      </Grid>
                    </Grid>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setMentorEvalDialog(false)}>Close</Button>
                  </DialogActions>
                </>
              )}
            </Dialog>

            {/* Add Comment Dialog */}
            <Dialog
              open={commentDialog}
              onClose={() => setCommentDialog(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Add Teacher Comment</DialogTitle>
              <DialogContent>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Your Comment"
                  value={teacherComment}
                  onChange={(e) => setTeacherComment(e.target.value)}
                  sx={{ mt: 2 }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setCommentDialog(false)}>Cancel</Button>
                <Button
                  variant="contained"
                  onClick={handleAddComment}
                  disabled={!teacherComment.trim()}
                >
                  Submit Comment
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}

        {/* Student Progress Monitoring */}
        <Tab icon={<TrendingUpIcon />} label="Student Progress" />
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {/* Student Selection */}
              <Grid item xs={12} md={3}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Students
                  </Typography>
                  <List>
                    {students.map((student) => (
                      <ListItem
                        key={student.id}
                        button
                        selected={selectedStudent === student.id}
                        onClick={() => handleStudentSelect(student.id)}
                      >
                        <ListItemIcon>
                          <SchoolIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={student.name}
                          secondary={`ID: ${student.studentId}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>

              {/* Progress Display */}
              <Grid item xs={12} md={9}>
                {loadingProgress ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : studentProgress ? (
                  <Grid container spacing={2}>
                    {/* Overview Cards */}
                    <Grid item xs={12}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Card>
                            <CardContent>
                              <Typography color="textSecondary" gutterBottom>
                                Internship Progress
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CircularProgress
                                  variant="determinate"
                                  value={studentProgress.completionPercentage}
                                  sx={{ mr: 2 }}
                                />
                                <Typography variant="h4">
                                  {studentProgress.completionPercentage}%
                                </Typography>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Card>
                            <CardContent>
                              <Typography color="textSecondary" gutterBottom>
                                Reports Submitted
                              </Typography>
                              <Typography variant="h4">
                                {studentProgress.submissions.length}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Card>
                            <CardContent>
                              <Typography color="textSecondary" gutterBottom>
                                Average Evaluation
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="h4">
                                  {studentProgress.averageEvaluation}
                                </Typography>
                                <Rating
                                  value={studentProgress.averageEvaluation}
                                  readOnly
                                  precision={0.5}
                                  sx={{ ml: 1 }}
                                />
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Progress Timeline */}
                    <Grid item xs={12}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6">
                              Progress Timeline
                            </Typography>
                            <Button
                              variant="outlined"
                              startIcon={<NoteIcon />}
                              onClick={() => setNoteDialog(true)}
                            >
                              Add Note
                            </Button>
                          </Box>
                          <Timeline>
                            {studentProgress.timeline.map((event, index) => (
                              <TimelineItem key={index}>
                                <TimelineOppositeContent color="text.secondary">
                                  {new Date(event.date).toLocaleDateString()}
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                  <TimelineDot color={event.type === 'submission' ? 'primary' : 'secondary'} />
                                  <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>
                                  <Typography variant="subtitle2">
                                    {event.title}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {event.description}
                                  </Typography>
                                </TimelineContent>
                              </TimelineItem>
                            ))}
                          </Timeline>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Submissions and Evaluations */}
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Recent Submissions
                          </Typography>
                          <List>
                            {studentProgress.submissions.slice(0, 5).map((submission) => (
                              <ListItem key={submission.id}>
                                <ListItemText
                                  primary={submission.title}
                                  secondary={`Submitted on ${new Date(submission.date).toLocaleDateString()}`}
                                />
                                <Chip
                                  label={submission.status}
                                  color={
                                    submission.status === 'approved' ? 'success' :
                                    submission.status === 'pending' ? 'warning' : 'error'
                                  }
                                  size="small"
                                />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Recent Evaluations
                          </Typography>
                          <List>
                            {studentProgress.evaluations.slice(0, 5).map((evaluation) => (
                              <ListItem key={evaluation.id}>
                                <ListItemText
                                  primary={evaluation.title}
                                  secondary={`By ${evaluation.evaluator} on ${new Date(evaluation.date).toLocaleDateString()}`}
                                />
                                <Rating value={evaluation.rating} readOnly precision={0.5} />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                ) : (
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      Select a student to view their progress
                    </Typography>
                  </Paper>
                )}
              </Grid>
            </Grid>

            {/* Add Note Dialog */}
            <Dialog
              open={noteDialog}
              onClose={() => setNoteDialog(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Add Progress Note</DialogTitle>
              <DialogContent>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Note"
                  value={progressNote}
                  onChange={(e) => setProgressNote(e.target.value)}
                  sx={{ mt: 2 }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setNoteDialog(false)}>Cancel</Button>
                <Button
                  variant="contained"
                  onClick={handleAddNote}
                  disabled={!progressNote.trim()}
                >
                  Add Note
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}

        {/* Final Evaluations */}
        <Tab icon={<CreateIcon />} label="Final Evaluations" />
        {activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Final Evaluations
            </Typography>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Internship Company</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Progress</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.internshipCompany}</TableCell>
                      <TableCell>
                        <Chip
                          label={student.evaluationStatus}
                          color={
                            student.evaluationStatus === 'completed' ? 'success' :
                            student.evaluationStatus === 'in_progress' ? 'warning' :
                            'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <LinearProgress
                          variant="determinate"
                          value={student.internshipProgress}
                          sx={{ height: 8, borderRadius: 5 }}
                        />
                        <Typography variant="caption">
                          {student.internshipProgress}%
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleFinalEvaluation(student.id)}
                          disabled={student.internshipProgress < 100}
                          startIcon={<CreateIcon />}
                        >
                          Final Evaluation
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Final Evaluation Dialog */}
            <Dialog
              open={finalEvalDialog}
              onClose={() => setFinalEvalDialog(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>
                Final Evaluation
                <IconButton
                  onClick={() => setFinalEvalDialog(false)}
                  sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={3}>
                  {/* Student Information */}
                  <Grid item xs={12}>
                    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Student Information
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2">
                            <strong>Name:</strong> {finalEvalData.studentName}
                          </Typography>
                          <Typography variant="body2">
                            <strong>ID:</strong> {finalEvalData.studentId}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="body2">
                            <strong>Company:</strong> {finalEvalData.company}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Duration:</strong> {finalEvalData.duration} weeks
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>

                  {/* Evaluation Categories */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Performance Evaluation
                    </Typography>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Academic Performance"
                      multiline
                      rows={4}
                      value={finalEvalData.academicPerformance}
                      onChange={(e) => setFinalEvalData({
                        ...finalEvalData,
                        academicPerformance: e.target.value
                      })}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Technical Skills"
                      multiline
                      rows={4}
                      value={finalEvalData.technicalSkills}
                      onChange={(e) => setFinalEvalData({
                        ...finalEvalData,
                        technicalSkills: e.target.value
                      })}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Soft Skills"
                      multiline
                      rows={4}
                      value={finalEvalData.softSkills}
                      onChange={(e) => setFinalEvalData({
                        ...finalEvalData,
                        softSkills: e.target.value
                      })}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Overall Performance"
                      multiline
                      rows={4}
                      value={finalEvalData.overallPerformance}
                      onChange={(e) => setFinalEvalData({
                        ...finalEvalData,
                        overallPerformance: e.target.value
                      })}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Recommendations"
                      multiline
                      rows={3}
                      value={finalEvalData.recommendations}
                      onChange={(e) => setFinalEvalData({
                        ...finalEvalData,
                        recommendations: e.target.value
                      })}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Final Grade"
                      type="number"
                      inputProps={{ min: 0, max: 100 }}
                      value={finalEvalData.grade}
                      onChange={(e) => setFinalEvalData({
                        ...finalEvalData,
                        grade: e.target.value
                      })}
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Additional Comments"
                      multiline
                      rows={3}
                      value={finalEvalData.comments}
                      onChange={(e) => setFinalEvalData({
                        ...finalEvalData,
                        comments: e.target.value
                      })}
                    />
                  </Grid>

                  {/* Digital Signature */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Digital Signature
                    </Typography>
                    <Box
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        p: 2,
                        mt: 1
                      }}
                    >
                      <TextField
                        fullWidth
                        label="Type your full name to sign"
                        value={signatureData}
                        onChange={(e) => setSignatureData(e.target.value)}
                        required
                        helperText="This will serve as your electronic signature"
                      />
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                        Date: {new Date().toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  startIcon={<SaveAltIcon />}
                  onClick={() => {
                    // Handle save as draft
                  }}
                >
                  Save as Draft
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmitFinalEvaluation}
                  disabled={!signatureData}
                  startIcon={<Signature />}
                >
                  Submit & Sign
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default TeacherDashboard; 