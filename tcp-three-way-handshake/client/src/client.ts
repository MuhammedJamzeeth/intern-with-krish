import net from "net";

const PORT = 3000;

const client = net.createConnection({ port: PORT }, () => {
  console.log("Client: connected to server");
});

client.on("data", (data) => {
  console.log("Client: received:", data.toString().trim());
  client.end(); // FIN
});

client.on("end", () => {
  console.log("Client: got 'end' (server half closed)");
});

client.on("close", (hadError) => {
  console.log("Client: closed. hadError =", hadError);
});

client.on("error", (err) => {
  console.error("Client error:", err.message);
});
