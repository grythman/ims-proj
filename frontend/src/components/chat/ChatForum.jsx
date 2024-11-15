import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  IconButton,
  Tab,
  Tabs,
  Card,
  CardContent,
  CardActions,
  Menu,
  MenuItem,
  Badge,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  MoreVert as MoreVertIcon,
  Forum as ForumIcon,
  Chat as ChatIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import {
  getForumThreads,
  createThread,
  getThreadDetails,
  addThreadReply,
  getDirectMessages,
  sendDirectMessage,
  getChatParticipants,
  markMessageAsRead,
  uploadChatAttachment,
} from '../../services/api';

const ChatForum = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [newThread, setNewThread] = useState({
    title: '',
    content: '',
    category: 'general',
  });
  const [loading, setLoading] = useState(false);
  const [threadDialog, setThreadDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const messagesEndRef = useRef(null);
  const [attachment, setAttachment] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchThreads();
    fetchParticipants();
  }, []);

  useEffect(() => {
    if (selectedParticipant) {
      fetchDirectMessages(selectedParticipant.id);
    }
  }, [selectedParticipant]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchThreads = async () => {
    setLoading(true);
    try {
      const response = await getForumThreads({
        search: searchQuery,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
      });
      setThreads(response.data);
    } catch (error) {
      console.error('Error fetching threads:', error);
      showNotification('Error loading threads', 'error');
    }
    setLoading(false);
  };

  const fetchParticipants = async () => {
    try {
      const response = await getChatParticipants();
      setParticipants(response.data);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const fetchDirectMessages = async (participantId) => {
    setLoading(true);
    try {
      const response = await getDirectMessages(participantId);
      setMessages(response.data);
      // Mark messages as read
      response.data
        .filter(msg => !msg.read && msg.sender.id !== currentUser.id)
        .forEach(msg => markMessageAsRead(msg.id));
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
    setLoading(false);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !attachment) return;

    try {
      let attachmentId = null;
      if (attachment) {
        const formData = new FormData();
        formData.append('file', attachment);
        const attachmentResponse = await uploadChatAttachment(formData);
        attachmentId = attachmentResponse.data.id;
      }

      await sendDirectMessage({
        recipient: selectedParticipant.id,
        content: newMessage,
        attachmentId,
      });

      setNewMessage('');
      setAttachment(null);
      fetchDirectMessages(selectedParticipant.id);
    } catch (error) {
      console.error('Error sending message:', error);
      showNotification('Error sending message', 'error');
    }
  };

  const handleCreateThread = async () => {
    try {
      await createThread(newThread);
      setThreadDialog(false);
      fetchThreads();
      showNotification('Thread created successfully');
      setNewThread({
        title: '',
        content: '',
        category: 'general',
      });
    } catch (error) {
      console.error('Error creating thread:', error);
      showNotification('Error creating thread', 'error');
    }
  };

  const handleThreadReply = async (threadId, content) => {
    try {
      await addThreadReply(threadId, { content });
      const response = await getThreadDetails(threadId);
      setSelectedThread(response.data);
    } catch (error) {
      console.error('Error adding reply:', error);
      showNotification('Error adding reply', 'error');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const showNotification = (message, severity = 'success') => {
    setNotification({
      open: true,
      message,
      severity,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab icon={<ChatIcon />} label="Direct Messages" />
          <Tab icon={<ForumIcon />} label="Forum" />
        </Tabs>

        {activeTab === 0 ? (
          // Direct Messages
          <Grid container spacing={2}>
            {/* Participants List */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ height: '70vh', overflow: 'auto' }}>
                <List>
                  {participants.map((participant) => (
                    <ListItem
                      key={participant.id}
                      button
                      selected={selectedParticipant?.id === participant.id}
                      onClick={() => setSelectedParticipant(participant)}
                    >
                      <ListItemAvatar>
                        <Badge
                          color="success"
                          variant="dot"
                          invisible={!participant.online}
                        >
                          <Avatar src={participant.avatar}>
                            {participant.name.charAt(0)}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={participant.name}
                        secondary={participant.role}
                      />
                      {participant.unreadCount > 0 && (
                        <Chip
                          label={participant.unreadCount}
                          color="primary"
                          size="small"
                        />
                      )}
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>

            {/* Chat Area */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
                {selectedParticipant ? (
                  <>
                    {/* Chat Header */}
                    <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                      <Typography variant="h6">
                        {selectedParticipant.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedParticipant.role}
                      </Typography>
                    </Box>

                    {/* Messages */}
                    <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                      {messages.map((message) => (
                        <Box
                          key={message.id}
                          sx={{
                            display: 'flex',
                            justifyContent: message.sender.id === currentUser.id ? 'flex-end' : 'flex-start',
                            mb: 2,
                          }}
                        >
                          <Box
                            sx={{
                              maxWidth: '70%',
                              bgcolor: message.sender.id === currentUser.id ? 'primary.main' : 'grey.100',
                              color: message.sender.id === currentUser.id ? 'white' : 'text.primary',
                              borderRadius: 2,
                              p: 2,
                            }}
                          >
                            <Typography variant="body1">
                              {message.content}
                            </Typography>
                            {message.attachment && (
                              <Box sx={{ mt: 1 }}>
                                <Button
                                  size="small"
                                  startIcon={<AttachFileIcon />}
                                  href={message.attachment.url}
                                  target="_blank"
                                >
                                  {message.attachment.name}
                                </Button>
                              </Box>
                            )}
                            <Typography variant="caption" color="text.secondary">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                      <div ref={messagesEndRef} />
                    </Box>

                    {/* Message Input */}
                    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                      <Grid container spacing={2}>
                        <Grid item xs>
                          <TextField
                            fullWidth
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          />
                        </Grid>
                        <Grid item>
                          <Button
                            component="label"
                            variant="outlined"
                          >
                            <AttachFileIcon />
                            <input
                              type="file"
                              hidden
                              onChange={(e) => setAttachment(e.target.files[0])}
                            />
                          </Button>
                        </Grid>
                        <Grid item>
                          <Button
                            variant="contained"
                            endIcon={<SendIcon />}
                            onClick={handleSendMessage}
                          >
                            Send
                          </Button>
                        </Grid>
                      </Grid>
                      {attachment && (
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            label={attachment.name}
                            onDelete={() => setAttachment(null)}
                            size="small"
                          />
                        </Box>
                      )}
                    </Box>
                  </>
                ) : (
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography color="text.secondary">
                      Select a participant to start chatting
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        ) : (
          // Forum
          <Box>
            {/* Forum Header */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  size="small"
                  placeholder="Search threads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
                <TextField
                  select
                  size="small"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="all">All Categories</MenuItem>
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="academic">Academic</MenuItem>
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="social">Social</MenuItem>
                </TextField>
              </Box>
              <Button
                variant="contained"
                startIcon={<ForumIcon />}
                onClick={() => setThreadDialog(true)}
              >
                New Thread
              </Button>
            </Box>

            {/* Threads List */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {threads.map((thread) => (
                  <Grid item xs={12} key={thread.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box>
                            <Typography variant="h6" gutterBottom>
                              {thread.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Posted by {thread.author.name} on {new Date(thread.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Chip
                            label={thread.category}
                            size="small"
                            color={
                              thread.category === 'technical' ? 'primary' :
                              thread.category === 'academic' ? 'secondary' :
                              'default'
                            }
                          />
                        </Box>
                        <Typography variant="body1" sx={{ mt: 2 }}>
                          {thread.content}
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                          <Chip
                            size="small"
                            label={`${thread.replies} replies`}
                            icon={<ForumIcon />}
                          />
                          <Chip
                            size="small"
                            label={`${thread.views} views`}
                            icon={<VisibilityIcon />}
                          />
                        </Box>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          onClick={() => setSelectedThread(thread)}
                        >
                          View Discussion
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {/* New Thread Dialog */}
            <Dialog
              open={threadDialog}
              onClose={() => setThreadDialog(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogTitle>Create New Thread</DialogTitle>
              <DialogContent>
                <TextField
                  fullWidth
                  label="Title"
                  value={newThread.title}
                  onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                  sx={{ mb: 2, mt: 2 }}
                />
                <TextField
                  fullWidth
                  label="Content"
                  multiline
                  rows={4}
                  value={newThread.content}
                  onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                  sx={{ mb: 2 }}
                />
                <TextField
                  select
                  fullWidth
                  label="Category"
                  value={newThread.category}
                  onChange={(e) => setNewThread({ ...newThread, category: e.target.value })}
                >
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="academic">Academic</MenuItem>
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="social">Social</MenuItem>
                </TextField>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setThreadDialog(false)}>Cancel</Button>
                <Button
                  variant="contained"
                  onClick={handleCreateThread}
                >
                  Create Thread
                </Button>
              </DialogActions>
            </Dialog>

            {/* Thread Details Dialog */}
            <Dialog
              open={Boolean(selectedThread)}
              onClose={() => setSelectedThread(null)}
              maxWidth="md"
              fullWidth
            >
              {selectedThread && (
                <>
                  <DialogTitle>
                    {selectedThread.title}
                    <Typography variant="subtitle2" color="text.secondary">
                      {selectedThread.author.name} - {new Date(selectedThread.createdAt).toLocaleDateString()}
                    </Typography>
                  </DialogTitle>
                  <DialogContent dividers>
                    <Typography variant="body1" paragraph>
                      {selectedThread.content}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Replies
                    </Typography>
                    <List>
                      {selectedThread.replies.map((reply) => (
                        <ListItem key={reply.id} alignItems="flex-start">
                          <ListItemAvatar>
                            <Avatar src={reply.author.avatar}>
                              {reply.author.name.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle2">
                                  {reply.author.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(reply.createdAt).toLocaleString()}
                                </Typography>
                              </Box>
                            }
                            secondary={reply.content}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Box sx={{ mt: 2 }}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        placeholder="Write a reply..."
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Button
                          variant="contained"
                          onClick={() => handleThreadReply(selectedThread.id, newReply)}
                          disabled={!newReply.trim()}
                        >
                          Reply
                        </Button>
                      </Box>
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setSelectedThread(null)}>Close</Button>
                  </DialogActions>
                </>
              )}
            </Dialog>
          </Box>
        )}
      </Paper>

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
    </Container>
  );
};

export default ChatForum; 