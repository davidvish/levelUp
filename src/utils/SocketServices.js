// import SocketIOClient from "socket.io-client";
// import { tripStatusSuccessAction } from "../module/PersonalCab/action";
// import { receiveMessageRequestAction } from "../module/Chat/action";
// import { driverLocationRequestAction } from "../module/MyRides/action";

// class WSService {
//   initializeSocket = (userToken, customerId, dispatch) => {
//     try {
//       //  console.log("initializing socket", userToken);
//       if (!customerId) {
//         console.log("Skipping socket initialization.", "customerId not found");
//         return;
//       }
//       // this.socket = SocketIOClient(ENV.BASE_URL, {
//       this.socket = SocketIOClient("https://mayaride-socket.suffescom.dev/", {
//         reconnection: true,
//         reconnectionAttempts: Infinity,
//       });

//       this.socket.on("connect", () => {
//         console.log("Socket connect");

//         this.socket.emit(
//           "customersocket",
//           {
//             customerId,
//           },
//           (data) => {
//             console.log("Customer connect Socket response", data);
//             // dispatch(tripStatusSuccessAction(data));
//           }
//         );

//         this.socket.on("order_customer_socket", (data) => {
//           console.log("order_customer_socket response", data);
//           dispatch(tripStatusSuccessAction(data));
//         });

//         this.socket.on("new_message", (data) => {
//           console.log("new_message response", data);
//           dispatch(receiveMessageRequestAction(data));
//         });
//         this.socket.on("order_customer_location_socket", (data) => {
//           console.log("order_customer_location_socket response", data);
//           dispatch(driverLocationRequestAction(data));
//         });

//         setInterval(() => {
//           this.socket.emit("ping");
//         }, 10000);
//       });

//       this.socket.on("disconnect", () => {
//         console.log("Socket disconnected");
//       });

//       this.socket.on("connect_error", (err) => {
//         console.log("socket connection error: ", err);
//         //    console.log("socket connection error: ", JSON.stringify(err));
//       });

//       this.socket.on("error", (err) => {
//         console.log("socket error: ", err);
//         //    console.log("socket error: ", JSON.stringify(err));
//       });
//     } catch (error) {
//       //  console.log("initialize token error: ", error);
//     }
//   };

//   emit(event, data = {}, acknowldge) {
//     // console.log('event', event, data)
//     this.socket.emit(event, data, acknowldge);
//   }
//   on(event, cb) {
//     if (this.socket) {
//       this.socket.on(event, cb);
//     }
//   }
//   removeListener(listenerName) {
//     this.socket?.removeListener(listenerName);
//   }
//   sendMessage(event, data = {}, acknowldge) {
//     //     console.log(event, data, "event");
//     this.socket?.emit(event, data, acknowldge);
//   }
//   messageFromServer(event, cb) {
//     this.socket.on(event, cb);
//   }
//   socketInstace() {
//     return this.socket;
//   }
// }

// const SocketServices = new WSService();

// export default SocketServices;
