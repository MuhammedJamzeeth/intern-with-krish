import net, { Socket } from "net";

const port = 3000;

const server = net.createServer((socket: Socket) => {
  console.log("Client connected");

  socket.write("Hello World"); // send response to client

  socket.on("end", () => {
    console.log("Client disconnected");
  });

  socket.on("error", (err: Error) => {
    console.error("Socket error:", err.message);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
