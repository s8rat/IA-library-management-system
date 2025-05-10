import * as signalR from "@microsoft/signalr";

export interface ChatHistoryMessage {
  User: string;
  Message: string;
  Timestamp?: string;
}

let connection: signalR.HubConnection | null = null;

export function startConnection(
  onReceiveMessage: (msg: ChatHistoryMessage) => void,
  onReceiveHistory: (msgs: ChatHistoryMessage[]) => void
) {
  connection = new signalR.HubConnectionBuilder()
    .withUrl("http://127.0.0.1:5205/chathub")
    .withAutomaticReconnect()
    .build();

  connection.on(
    "ReceiveMessage",
    (user: string, message: string, timestamp?: string) => {
      onReceiveMessage({ User: user, Message: message, Timestamp: timestamp });
    }
  );

  connection.on("ReceiveChatHistory", (messages: ChatHistoryMessage[]) => {
    // Map backend's { User, Message, Timestamp } to { user, message, timestamp }
    const normalized = messages.map((msg) => ({
      User: msg.User,
      Message: msg.Message,
      Timestamp: msg.Timestamp,
    }));
    onReceiveHistory(normalized);
  });
  return connection.start();
}

export function sendMessage(userId: number, message: string) {
  if (connection) {
    connection.invoke("SendMessageToAll", userId, message);
  }
}

export function stopConnection() {
  if (connection) {
    connection.stop();
    connection = null;
  }
}
