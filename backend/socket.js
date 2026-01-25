module.exports = (io) => {
  io.on("connection", (socket) => {
    socket.on("joinWard", (wardId) => {
      socket.join(wardId);
    });
  });
};
