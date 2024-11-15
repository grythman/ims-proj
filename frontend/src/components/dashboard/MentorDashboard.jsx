import {
    Assessment as AssessmentIcon,
    Close as CloseIcon,
    Description as DescriptionIcon,
    Download as DownloadIcon,
    Save as SaveIcon,
    Send as SendIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    LinearProgress,
    MenuItem,
    Paper,
    Rating,
    Select,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator
} from '@mui/lab';
import React, { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from 'recharts';
import api, {
    addAdvice,
    createMentorReport,
    getAdviceCategories,
    getAdviceHistory,
    getAdviceTemplates,
    getEvaluationStatistics,
    getMentorReportHistory,
    getMentorReportTemplate,
    getMentorStatistics,
    getPerformanceMetrics,
    getPerformanceTrends,
    getReportStatistics,
    getStudentStatistics,
    signMentorReport
} from '../../services/api';

const MentorDashboard = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [evaluationDialog, setEvaluationDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [evaluationData, setEvaluationData] = useState({
        rating: 0,
        comments: '',
        status: 'pending',
    });
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success',
    });
    const [adviceHistory, setAdviceHistory] = useState([]);
    const [adviceDialog, setAdviceDialog] = useState(false);
    const [adviceCategories, setAdviceCategories] = useState([]);
    const [adviceTemplates, setAdviceTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [adviceData, setAdviceData] = useState({
        category: '',
        title: '',
        content: '',
        priority: 'normal',
        followUpDate: null,
    });
    const [reportDialog, setReportDialog] = useState(false);
    const [selectedStudentForReport, setSelectedStudentForReport] = useState(null);
    const [reportTemplate, setReportTemplate] = useState(null);
    const [performanceMetrics, setPerformanceMetrics] = useState(null);
    const [reportHistory, setReportHistory] = useState([]);
    const [reportData, setReportData] = useState({
        technicalSkills: {
            rating: 0,
            comments: '',
        },
        softSkills: {
            rating: 0,
            comments: '',
        },
        projectContribution: {
            rating: 0,
            comments: '',
        },
        learningAbility: {
            rating: 0,
            comments: '',
        },
        workEthic: {
            rating: 0,
            comments: '',
        },
        overallPerformance: '',
        strengths: '',
        areasForImprovement: '',
        recommendations: '',
        additionalComments: '',
    });
    const [signatureData, setSignatureData] = useState('');
    const [statistics, setStatistics] = useState(null);
    const [selectedStudentStats, setSelectedStudentStats] = useState(null);
    const [evaluationStats, setEvaluationStats] = useState(null);
    const [reportStats, setReportStats] = useState(null);
    const [performanceTrends, setPerformanceTrends] = useState(null);
    const [activityLogs, setActivityLogs] = useState([]);
    const [loadingStats, setLoadingStats] = useState(false);
    const [dateRange, setDateRange] = useState('month');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        const fetchAdviceData = async () => {
            try {
                const [categoriesRes, templatesRes] = await Promise.all([
                    getAdviceCategories(),
                    getAdviceTemplates(),
                ]);
                setAdviceCategories(categoriesRes.data);
                setAdviceTemplates(templatesRes.data);
            } catch (error) {
                console.error('Error fetching advice data:', error);
            }
        };

        fetchAdviceData();
    }, []);

    useEffect(() => {
        const fetchAdviceHistory = async () => {
            if (selectedStudent) {
                try {
                    const response = await getAdviceHistory(selectedStudent.id);
                    setAdviceHistory(response.data);
                } catch (error) {
                    console.error('Error fetching advice history:', error);
                }
            }
        };

        fetchAdviceHistory();
    }, [selectedStudent]);

    useEffect(() => {
        const fetchReportData = async () => {
            if (selectedStudentForReport) {
                try {
                    const [templateRes, metricsRes, historyRes] = await Promise.all([
                        getMentorReportTemplate(),
                        getPerformanceMetrics(selectedStudentForReport),
                        getMentorReportHistory(selectedStudentForReport),
                    ]);
                    setReportTemplate(templateRes.data);
                    setPerformanceMetrics(metricsRes.data);
                    setReportHistory(historyRes.data);
                } catch (error) {
                    console.error('Error fetching report data:', error);
                    showNotification('Error loading report data', 'error');
                }
            }
        };

        fetchReportData();
    }, [selectedStudentForReport]);

    useEffect(() => {
        const fetchStatistics = async () => {
            setLoadingStats(true);
            try {
                const [
                    statsRes,
                    evalStatsRes,
                    reportStatsRes,
                ] = await Promise.all([
                    getMentorStatistics(),
                    getEvaluationStatistics(),
                    getReportStatistics(),
                ]);

                setStatistics(statsRes.data);
                setEvaluationStats(evalStatsRes.data);
                setReportStats(reportStatsRes.data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
                showNotification('Error loading statistics', 'error');
            }
            setLoadingStats(false);
        };

        fetchStatistics();
    }, []);

    useEffect(() => {
        const fetchStudentStatistics = async () => {
            if (selectedStudent) {
                try {
                    const [statsRes, trendsRes] = await Promise.all([
                        getStudentStatistics(selectedStudent),
                        getPerformanceTrends(selectedStudent),
                    ]);
                    setSelectedStudentStats(statsRes.data);
                    setPerformanceTrends(trendsRes.data);
                } catch (error) {
                    console.error('Error fetching student statistics:', error);
                }
            }
        };

        fetchStudentStatistics();
    }, [selectedStudent]);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const response = await getMentorReports();
            setReports(response.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
            showNotification('Error loading reports', 'error');
        }
        setLoading(false);
    };

    const handleViewReport = async (reportId) => {
        try {
            const response = await getMentorReportDetails(reportId);
            setSelectedReport(response.data);
            setEvaluationDialog(true);
        } catch (error) {
            console.error('Error fetching report details:', error);
            showNotification('Error loading report details', 'error');
        }
    };

    const handleDownload = async (reportId) => {
        try {
            const response = await downloadMentorReport(reportId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `report-${reportId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error downloading report:', error);
            showNotification('Error downloading report', 'error');
        }
    };

    const handleEvaluate = async (reportId) => {
        try {
            await submitReportEvaluation(reportId, evaluationData);
            setEvaluationDialog(false);
            fetchReports();
            showNotification('Report evaluated successfully');
            setEvaluationData({
                rating: 0,
                comments: '',
                status: 'pending',
            });
        } catch (error) {
            console.error('Error evaluating report:', error);
            showNotification('Error evaluating report', 'error');
        }
    };

    const handleTemplateSelect = (templateId) => {
        const template = adviceTemplates.find(t => t.id === templateId);
        if (template) {
            setAdviceData({
                ...adviceData,
                title: template.title,
                content: template.content,
                category: template.category,
            });
        }
        setSelectedTemplate(templateId);
    };

    const handleAdviceSubmit = async () => {
        try {
            await addAdvice(selectedStudent.id, adviceData);
            setAdviceDialog(false);
            // Refresh advice history
            const response = await getAdviceHistory(selectedStudent.id);
            setAdviceHistory(response.data);
            showNotification('Advice submitted successfully');
            resetAdviceData();
        } catch (error) {
            console.error('Error submitting advice:', error);
            showNotification('Error submitting advice', 'error');
        }
    };

    const resetAdviceData = () => {
        setAdviceData({
            category: '',
            title: '',
            content: '',
            priority: 'normal',
            followUpDate: null,
        });
        setSelectedTemplate('');
    };

    const showNotification = (message, severity = 'success') => {
        setNotification({
            open: true,
            message,
            severity,
        });
    };

    const handleCreateReport = async () => {
        try {
            const response = await createMentorReport(selectedStudentForReport, reportData);
            if (signatureData) {
                await signMentorReport(response.data.id, { signature: signatureData });
            }
            setReportDialog(false);
            showNotification('Report created successfully');
            resetReportData();
        } catch (error) {
            console.error('Error creating report:', error);
            showNotification('Error creating report', 'error');
        }
    };

    const resetReportData = () => {
        setReportData({
            technicalSkills: { rating: 0, comments: '' },
            softSkills: { rating: 0, comments: '' },
            projectContribution: { rating: 0, comments: '' },
            learningAbility: { rating: 0, comments: '' },
            workEthic: { rating: 0, comments: '' },
            overallPerformance: '',
            strengths: '',
            areasForImprovement: '',
            recommendations: '',
            additionalComments: '',
        });
        setSignatureData('');
    };

    const getMentorReports = async () => {
        // Implementation
        const response = await api.get('/mentor/reports/');
        return response;
    };

    const getMentorReportDetails = async (reportId) => {
        // Implementation
        const response = await api.get(`/mentor/reports/${reportId}/details/`);
        return response;
    };

    const downloadMentorReport = async (reportId) => {
        // Implementation
        const response = await api.get(`/mentor/reports/${reportId}/download/`, {
            responseType: 'blob'
        });
        return response;
    };

    const submitReportEvaluation = async (reportId, evaluationData) => {
        // Implementation
        const response = await api.post(`/mentor/reports/${reportId}/evaluate/`, evaluationData);
        return response;
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Student Reports
                </Typography>

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
                                    <TableCell>Submission Date</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reports.map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell>{report.student.name}</TableCell>
                                        <TableCell>{report.title}</TableCell>
                                        <TableCell>
                                            {new Date(report.submissionDate).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={report.type}
                                                color={report.type === 'final' ? 'primary' : 'default'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={report.status}
                                                color={
                                                    report.status === 'approved' ? 'success' :
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

                {/* Report Evaluation Dialog */}
                <Dialog
                    open={evaluationDialog}
                    onClose={() => setEvaluationDialog(false)}
                    maxWidth="md"
                    fullWidth
                >
                    {selectedReport && (
                        <>
                            <DialogTitle>
                                Report Evaluation
                                <IconButton
                                    onClick={() => setEvaluationDialog(false)}
                                    sx={{ position: 'absolute', right: 8, top: 8 }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </DialogTitle>
                            <DialogContent dividers>
                                <Grid container spacing={3}>
                                    {/* Report Details */}
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            {selectedReport.title}
                                        </Typography>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Submitted by {selectedReport.student.name} on{' '}
                                            {new Date(selectedReport.submissionDate).toLocaleDateString()}
                                        </Typography>
                                    </Grid>

                                    {/* Report Content */}
                                    <Grid item xs={12}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Typography variant="body1">
                                                    {selectedReport.content}
                                                </Typography>
                                                {selectedReport.attachments?.map((attachment, index) => (
                                                    <Button
                                                        key={index}
                                                        startIcon={<DownloadIcon />}
                                                        onClick={() => handleDownload(selectedReport.id)}
                                                        sx={{ mt: 2 }}
                                                    >
                                                        Download Attachment {index + 1}
                                                    </Button>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    </Grid>

                                    {/* Evaluation Form */}
                                    <Grid item xs={12}>
                                        <Typography variant="h6" gutterBottom>
                                            Evaluation
                                        </Typography>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography component="legend">Rating</Typography>
                                            <Rating
                                                value={evaluationData.rating}
                                                onChange={(e, newValue) => setEvaluationData({
                                                    ...evaluationData,
                                                    rating: newValue,
                                                })}
                                                precision={0.5}
                                                size="large"
                                            />
                                        </Box>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            label="Comments"
                                            value={evaluationData.comments}
                                            onChange={(e) => setEvaluationData({
                                                ...evaluationData,
                                                comments: e.target.value,
                                            })}
                                            sx={{ mb: 2 }}
                                        />
                                        <TextField
                                            select
                                            fullWidth
                                            label="Status"
                                            value={evaluationData.status}
                                            onChange={(e) => setEvaluationData({
                                                ...evaluationData,
                                                status: e.target.value,
                                            })}
                                        >
                                            <MenuItem value="approved">Approve</MenuItem>
                                            <MenuItem value="needs_revision">Needs Revision</MenuItem>
                                            <MenuItem value="rejected">Reject</MenuItem>
                                        </TextField>
                                    </Grid>
                                </Grid>
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
                        </>
                    )}
                </Dialog>

                {/* Advice Dialog */}
                <Dialog
                    open={adviceDialog}
                    onClose={() => {
                        setAdviceDialog(false);
                        resetAdviceData();
                    }}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        Give Advice & Guidance
                        <IconButton
                            onClick={() => {
                                setAdviceDialog(false);
                                resetAdviceData();
                            }}
                            sx={{ position: 'absolute', right: 8, top: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={3}>
                            {/* Template Selection */}
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Use Template</InputLabel>
                                    <Select
                                        value={selectedTemplate}
                                        label="Use Template"
                                        onChange={(e) => handleTemplateSelect(e.target.value)}
                                    >
                                        <MenuItem value="">
                                            <em>None</em>
                                        </MenuItem>
                                        {adviceTemplates.map((template) => (
                                            <MenuItem key={template.id} value={template.id}>
                                                {template.title}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Category Selection */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        value={adviceData.category}
                                        label="Category"
                                        onChange={(e) => setAdviceData({
                                            ...adviceData,
                                            category: e.target.value
                                        })}
                                    >
                                        {adviceCategories.map((category) => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Priority Selection */}
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Priority</InputLabel>
                                    <Select
                                        value={adviceData.priority}
                                        label="Priority"
                                        onChange={(e) => setAdviceData({
                                            ...adviceData,
                                            priority: e.target.value
                                        })}
                                    >
                                        <MenuItem value="low">Low</MenuItem>
                                        <MenuItem value="normal">Normal</MenuItem>
                                        <MenuItem value="high">High</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Title */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Title"
                                    value={adviceData.title}
                                    onChange={(e) => setAdviceData({
                                        ...adviceData,
                                        title: e.target.value
                                    })}
                                    required
                                />
                            </Grid>

                            {/* Content */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Advice Content"
                                    multiline
                                    rows={6}
                                    value={adviceData.content}
                                    onChange={(e) => setAdviceData({
                                        ...adviceData,
                                        content: e.target.value
                                    })}
                                    required
                                />
                            </Grid>

                            {/* Follow-up Date */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Follow-up Date"
                                    type="date"
                                    value={adviceData.followUpDate || ''}
                                    onChange={(e) => setAdviceData({
                                        ...adviceData,
                                        followUpDate: e.target.value
                                    })}
                                    InputLabelProps={{ shrink: true }}
                                    helperText="Optional: Set a date to follow up on this advice"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            startIcon={<SaveIcon />}
                            onClick={() => {
                                // Handle save as draft
                            }}
                        >
                            Save as Draft
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SendIcon />}
                            onClick={handleAdviceSubmit}
                            disabled={!adviceData.title || !adviceData.content || !adviceData.category}
                        >
                            Send Advice
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

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6">
                                    Mentor Reports
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AssessmentIcon />}
                                    onClick={() => {
                                        setSelectedStudentForReport(selectedStudent?.id);
                                        setReportDialog(true);
                                    }}
                                    disabled={!selectedStudent}
                                >
                                    Generate Report
                                </Button>
                            </Box>

                            {/* Report History Timeline */}
                            {reportHistory.length > 0 ? (
                                <Timeline>
                                    {reportHistory.map((report, index) => (
                                        <TimelineItem key={report.id}>
                                            <TimelineOppositeContent color="text.secondary">
                                                {new Date(report.createdAt).toLocaleDateString()}
                                            </TimelineOppositeContent>
                                            <TimelineSeparator>
                                                <TimelineDot color="primary">
                                                    <DescriptionIcon />
                                                </TimelineDot>
                                                {index < reportHistory.length - 1 && <TimelineConnector />}
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <Card variant="outlined">
                                                    <CardContent>
                                                        <Typography variant="subtitle1" gutterBottom>
                                                            Performance Report
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                                            <Chip
                                                                label={`Technical Skills: ${report.technicalSkills.rating}/5`}
                                                                color="primary"
                                                                size="small"
                                                            />
                                                            <Chip
                                                                label={`Soft Skills: ${report.softSkills.rating}/5`}
                                                                color="secondary"
                                                                size="small"
                                                            />
                                                        </Box>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {report.overallPerformance.substring(0, 100)}...
                                                        </Typography>
                                                    </CardContent>
                                                    <CardActions>
                                                        <Button size="small" onClick={() => {
                                                            setReportData(report);
                                                            setReportDialog(true);
                                                        }}>
                                                            View Full Report
                                                        </Button>
                                                    </CardActions>
                                                </Card>
                                            </TimelineContent>
                                        </TimelineItem>
                                    ))}
                                </Timeline>
                            ) : (
                                <Typography color="text.secondary" align="center">
                                    No reports generated yet
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Report Generation Dialog */}
                <Dialog
                    open={reportDialog}
                    onClose={() => {
                        setReportDialog(false);
                        resetReportData();
                    }}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        Generate Mentor Report
                        <IconButton
                            onClick={() => {
                                setReportDialog(false);
                                resetReportData();
                            }}
                            sx={{ position: 'absolute', right: 8, top: 8 }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={3}>
                            {/* Performance Metrics */}
                            {performanceMetrics && (
                                <Grid item xs={12}>
                                    <Card variant="outlined" sx={{ mb: 3 }}>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Performance Metrics
                                            </Typography>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={4}>
                                                    <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="subtitle2" gutterBottom>
                                                            Attendance Rate
                                                        </Typography>
                                                        <Typography variant="h4" color="primary">
                                                            {performanceMetrics.attendanceRate}%
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="subtitle2" gutterBottom>
                                                            Tasks Completed
                                                        </Typography>
                                                        <Typography variant="h4" color="primary">
                                                            {performanceMetrics.tasksCompleted}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} md={4}>
                                                    <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="subtitle2" gutterBottom>
                                                            Project Contributions
                                                        </Typography>
                                                        <Typography variant="h4" color="primary">
                                                            {performanceMetrics.projectContributions}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}

                            {/* Skills Assessment */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Technical Skills
                                </Typography>
                                <Rating
                                    value={reportData.technicalSkills.rating}
                                    onChange={(e, newValue) => setReportData({
                                        ...reportData,
                                        technicalSkills: { ...reportData.technicalSkills, rating: newValue }
                                    })}
                                    precision={0.5}
                                />
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Comments"
                                    value={reportData.technicalSkills.comments}
                                    onChange={(e) => setReportData({
                                        ...reportData,
                                        technicalSkills: { ...reportData.technicalSkills, comments: e.target.value }
                                    })}
                                    sx={{ mt: 1 }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Soft Skills
                                </Typography>
                                <Rating
                                    value={reportData.softSkills.rating}
                                    onChange={(e, newValue) => setReportData({
                                        ...reportData,
                                        softSkills: { ...reportData.softSkills, rating: newValue }
                                    })}
                                    precision={0.5}
                                />
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Comments"
                                    value={reportData.softSkills.comments}
                                    onChange={(e) => setReportData({
                                        ...reportData,
                                        softSkills: { ...reportData.softSkills, comments: e.target.value }
                                    })}
                                    sx={{ mt: 1 }}
                                />
                            </Grid>

                            {/* Project Contribution */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Project Contribution
                                </Typography>
                                <Rating
                                    value={reportData.projectContribution.rating}
                                    onChange={(e, newValue) => setReportData({
                                        ...reportData,
                                        projectContribution: { ...reportData.projectContribution, rating: newValue }
                                    })}
                                    precision={0.5}
                                />
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Comments"
                                    value={reportData.projectContribution.comments}
                                    onChange={(e) => setReportData({
                                        ...reportData,
                                        projectContribution: { ...reportData.projectContribution, comments: e.target.value }
                                    })}
                                    sx={{ mt: 1 }}
                                />
                            </Grid>

                            {/* Learning and Work Ethic */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Learning Ability
                                </Typography>
                                <Rating
                                    value={reportData.learningAbility.rating}
                                    onChange={(e, newValue) => setReportData({
                                        ...reportData,
                                        learningAbility: { ...reportData.learningAbility, rating: newValue }
                                    })}
                                    precision={0.5}
                                />
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Comments"
                                    value={reportData.learningAbility.comments}
                                    onChange={(e) => setReportData({
                                        ...reportData,
                                        learningAbility: { ...reportData.learningAbility, comments: e.target.value }
                                    })}
                                    sx={{ mt: 1 }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Work Ethic
                                </Typography>
                                <Rating
                                    value={reportData.workEthic.rating}
                                    onChange={(e, newValue) => setReportData({
                                        ...reportData,
                                        workEthic: { ...reportData.workEthic, rating: newValue }
                                    })}
                                    precision={0.5}
                                />
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Comments"
                                    value={reportData.workEthic.comments}
                                    onChange={(e) => setReportData({
                                        ...reportData,
                                        workEthic: { ...reportData.workEthic, comments: e.target.value }
                                    })}
                                    sx={{ mt: 1 }}
                                />
                            </Grid>

                            {/* Overall Assessment */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Overall Performance Assessment
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={reportData.overallPerformance}
                                    onChange={(e) => setReportData({
                                        ...reportData,
                                        overallPerformance: e.target.value
                                    })}
                                    required
                                />
                            </Grid>

                            {/* Strengths and Areas for Improvement */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Key Strengths
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={reportData.strengths}
                                    onChange={(e) => setReportData({
                                        ...reportData,
                                        strengths: e.target.value
                                    })}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Areas for Improvement
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={reportData.areasForImprovement}
                                    onChange={(e) => setReportData({
                                        ...reportData,
                                        areasForImprovement: e.target.value
                                    })}
                                />
                            </Grid>

                            {/* Recommendations */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Recommendations
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    value={reportData.recommendations}
                                    onChange={(e) => setReportData({
                                        ...reportData,
                                        recommendations: e.target.value
                                    })}
                                />
                            </Grid>

                            {/* Additional Comments */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle1" gutterBottom>
                                    Additional Comments
                                </Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    value={reportData.additionalComments}
                                    onChange={(e) => setReportData({
                                        ...reportData,
                                        additionalComments: e.target.value
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
                            startIcon={<SaveIcon />}
                            onClick={() => {
                                // Handle save as draft
                            }}
                        >
                            Save as Draft
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SendIcon />}
                            onClick={handleCreateReport}
                            disabled={!signatureData}
                        >
                            Submit Report
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Statistics Tab */}
                <Tab icon={<AssessmentIcon />} label="Statistics" />

                {activeTab === 4 && (
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Data Statistics
                        </Typography>

                        {loadingStats ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Grid container spacing={3}>
                                {/* Overview Statistics */}
                                <Grid item xs={12}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Overview
                                            </Typography>
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} sm={3}>
                                                    <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="h4" color="primary">
                                                            {statistics?.totalStudents}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Total Students
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={3}>
                                                    <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="h4" color="primary">
                                                            {statistics?.activeInternships}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Active Internships
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={3}>
                                                    <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="h4" color="primary">
                                                            {statistics?.pendingReports}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Pending Reports
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} sm={3}>
                                                    <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="h4" color="primary">
                                                            {statistics?.completedEvaluations}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            Completed Evaluations
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Evaluation Statistics */}
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Evaluation Distribution
                                            </Typography>
                                            <Box sx={{ height: 300 }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={evaluationStats?.distribution}
                                                            dataKey="value"
                                                            nameKey="name"
                                                            cx="50%"
                                                            cy="50%"
                                                            outerRadius={80}
                                                            label
                                                        >
                                                            {evaluationStats?.distribution.map((entry, index) => (
                                                                <Cell key={index} fill={entry.color} />
                                                            ))}
                                                        </Pie>
                                                        <RechartsTooltip />
                                                        <Legend />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Report Statistics */}
                                <Grid item xs={12} md={6}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6" gutterBottom>
                                                Report Submission Trends
                                            </Typography>
                                            <Box sx={{ height: 300 }}>
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={reportStats?.trends}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="date" />
                                                        <YAxis />
                                                        <RechartsTooltip />
                                                        <Legend />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="submissions"
                                                            stroke="#8884d8"
                                                            name="Submissions"
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="evaluations"
                                                            stroke="#82ca9d"
                                                            name="Evaluations"
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Student Performance Trends */}
                                {selectedStudent && (
                                    <Grid item xs={12}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Student Performance Trends
                                                </Typography>
                                                <Box sx={{ height: 300 }}>
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <BarChart data={performanceTrends?.data}>
                                                            <CartesianGrid strokeDasharray="3 3" />
                                                            <XAxis dataKey="period" />
                                                            <YAxis />
                                                            <RechartsTooltip />
                                                            <Legend />
                                                            <Bar
                                                                dataKey="technicalSkills"
                                                                name="Technical Skills"
                                                                fill="#8884d8"
                                                            />
                                                            <Bar
                                                                dataKey="softSkills"
                                                                name="Soft Skills"
                                                                fill="#82ca9d"
                                                            />
                                                            <Bar
                                                                dataKey="overallPerformance"
                                                                name="Overall Performance"
                                                                fill="#ffc658"
                                                            />
                                                        </BarChart>
                                                    </ResponsiveContainer>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}

                                {/* Activity Timeline */}
                                <Grid item xs={12}>
                                    <Card>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                                <Typography variant="h6">
                                                    Activity Timeline
                                                </Typography>
                                                <FormControl size="small" sx={{ minWidth: 120 }}>
                                                    <Select
                                                        value={dateRange}
                                                        onChange={(e) => setDateRange(e.target.value)}
                                                    >
                                                        <MenuItem value="week">Last Week</MenuItem>
                                                        <MenuItem value="month">Last Month</MenuItem>
                                                        <MenuItem value="quarter">Last Quarter</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            <Timeline>
                                                {activityLogs.map((activity, index) => (
                                                    <TimelineItem key={index}>
                                                        <TimelineOppositeContent color="text.secondary">
                                                            {new Date(activity.timestamp).toLocaleString()}
                                                        </TimelineOppositeContent>
                                                        <TimelineSeparator>
                                                            <TimelineDot color={activity.type === 'evaluation' ? 'primary' : 'secondary'} />
                                                            <TimelineConnector />
                                                        </TimelineSeparator>
                                                        <TimelineContent>
                                                            <Typography variant="body2">
                                                                {activity.description}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {activity.details}
                                                            </Typography>
                                                        </TimelineContent>
                                                    </TimelineItem>
                                                ))}
                                            </Timeline>
                                        </CardContent>
                                    </Card>
                                </Grid>

                                {/* Student-specific Statistics */}
                                {selectedStudentStats && (
                                    <Grid item xs={12}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    Student Statistics
                                                </Typography>
                                                <Grid container spacing={3}>
                                                    <Grid item xs={12} md={4}>
                                                        <Card variant="outlined">
                                                            <CardContent>
                                                                <Typography variant="subtitle2" color="text.secondary">
                                                                    Report Completion Rate
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                                    <LinearProgress
                                                                        variant="determinate"
                                                                        value={selectedStudentStats.reportCompletionRate}
                                                                        sx={{ flexGrow: 1, mr: 2 }}
                                                                    />
                                                                    <Typography variant="h6">
                                                                        {selectedStudentStats.reportCompletionRate}%
                                                                    </Typography>
                                                                </Box>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <Card variant="outlined">
                                                            <CardContent>
                                                                <Typography variant="subtitle2" color="text.secondary">
                                                                    Average Evaluation Score
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                                    <Rating
                                                                        value={selectedStudentStats.averageEvaluation}
                                                                        readOnly
                                                                        precision={0.5}
                                                                    />
                                                                    <Typography variant="h6" sx={{ ml: 1 }}>
                                                                        {selectedStudentStats.averageEvaluation}
                                                                    </Typography>
                                                                </Box>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                    <Grid item xs={12} md={4}>
                                                        <Card variant="outlined">
                                                            <CardContent>
                                                                <Typography variant="subtitle2" color="text.secondary">
                                                                    Attendance Rate
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                                    <LinearProgress
                                                                        variant="determinate"
                                                                        value={selectedStudentStats.attendanceRate}
                                                                        sx={{ flexGrow: 1, mr: 2 }}
                                                                    />
                                                                    <Typography variant="h6">
                                                                        {selectedStudentStats.attendanceRate}%
                                                                    </Typography>
                                                                </Box>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                )}
                            </Grid>
                        )}
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default MentorDashboard; 