import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { startConnection, sendMessage, stopConnection, ChatHistoryMessage } from "../Services/signalR";
import { Box, TextField, Button, Typography, Paper, Container, CircularProgress } from "@mui/material";
import { format } from "date-fns";

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatHistoryMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      startConnection(
        (msg) => {
          setMessages((prev) => [...prev, msg]);
        },
        (msgs) => {
          setMessages(msgs);
          setIsLoading(false);
        }
      )
        .then(() => {
          setIsConnected(true);
        })
        .catch((error) => {
          console.error("Failed to start connection:", error);
          setIsConnected(false);
          setIsLoading(false);
        });
    }

    return () => {
      stopConnection();
    };
  }, [user?.id]);

  const handleSendMessage = async () => {
    if (!message.trim() || !user?.id) return;

    try {
      await sendMessage(user.id, message);
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h5" align="center">
          Please log in to access the chat
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, height: "80vh", display: "flex", flexDirection: "column" }}>
        <Typography variant="h5" gutterBottom>
          Chat Room
        </Typography>
        {!isConnected && (
          <Typography color="error" gutterBottom>
            Not connected to chat server
          </Typography>
        )}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            mb: 2,
            p: 2,
            backgroundColor: "#f5f5f5",
            borderRadius: 1,
          }}
        >
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </Box>
          ) : messages.length === 0 ? (
            <Typography align="center" color="textSecondary">
              No messages yet. Start the conversation!
            </Typography>
          ) : (
            messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.user === user.username ? "flex-end" : "flex-start",
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 1,
                    maxWidth: "70%",
                    backgroundColor: msg.user === user.username ? "#e3f2fd" : "#fff",
                  }}
                >
                  <Typography variant="subtitle2" color="textSecondary">
                    {msg.user}
                  </Typography>
                  <Typography variant="body1">{msg.message}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {format(new Date(msg.timestamp), "MMM d, yyyy HH:mm")}
                  </Typography>
                </Paper>
              </Box>
            ))
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isConnected}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!isConnected || !message.trim()}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatPage; 