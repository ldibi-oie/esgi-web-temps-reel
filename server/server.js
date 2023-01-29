require('dotenv').config()
const express = require('express');
const app = express();
const PORT = process.env.PORT;
//New imports
const http = require('http').Server(app);
const cors = require('cors');
const { nextTick } = require('process');

const socketIO = require('socket.io')(http, {
    cors: {
        origin: process.env.SOCKET_URL_CLIENT
    }
});
//Add this before the app.get() block
let users = [];
socketIO.on('connection', (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  socket.on('send_message' , (data) => {
    console.log(data , data.room)
    socketIO.to(data.room).emit('messageResponse', data);
  })

  // socket.on('message', (data) => {
  //   socketIO.emit('messageResponse', data);
  // });

  socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

  socket.on('newUser', (data) => {
    console.log(data)
    // data.socketID != localStorage.getItem(data) ? users.push(data) : next()
    if(users.includes(data) === false){
      users.push(data) 
    }
    console.log(users)

    socketIO.emit('newUserResponse', users);
  });

  socket.on('deleteUserConnected', (data) => {
    console.log(data)
    // data.socketID != localStorage.getItem(data) ? users.push(data) : next()
    const index = users.indexOf(data);
    console.log(index)
    if (index !== -1) { // only splice array when item is found
      console.log('=========================================');
      console.log('deleteUserConnected: A user disconnected');
      console.log('=========================================');
      users.splice(index, 1); // 2nd parameter means remove one item only
    console.log(users)

    }

    socketIO.emit('newUserResponse', users);
  });

  socket.on("create_room" , (room) => {
    socket.join(room)
    console.log("-------- rooms----------")
    console.log(socket.rooms)
    console.log("-------- rooms----------")
  })

  socket.on("enter_room" , (room) => {
    socket.join(room)
    console.log("-------- rooms----------")
    console.log(socket.rooms)
    console.log("-------- rooms----------")
  })

  socket.on("leave_room" , (room) => {
    socket.leave(room)
    console.log(socket.rooms)
  })

  socket.on('chatbot' , (value) => {
    console.log("user has click on " + value);

    switch (value) {
      case 'start':
        var reponse = [
          {
            uid : "chatbot",
            name: "MotorService Bot",
            message: "Vérifier l’entretien de son véhicule",
            type: "button",
            value: "verify"
          },
          {
            uid : "chatbot",
            name: "MotorService Bot",
            message: "Avoir des informations sur les véhicules",
            type: "button",
            value: "infos_vehicule"
          },
          {
            uid : "chatbot",
            name: "MotorService Bot",
            message: "Avoir des informations  de contact",
            type: "button",
            value: "infos_contact"
          },
          {
            uid : "chatbot",
            name: "MotorService Bot",
            message: "Souhaite arrêter le workflow ",
            type: "button",
            value: "close"
          },
        ]
        socketIO.emit('chatbotResponse' , reponse)

        break;
      case 'close':
        console.log("user has click on " + value);
        var reponse = [
          {
            uid: "chatbot",
            name: "MotorService Bot",
            message: "Cliquez pour commencer",
            type: "button",
            value: "start",
          }
        ]
        socketIO.emit('chatbotClose' , reponse)
        break;
      case 'verify':
        var reponse = [{
          uid : "chatbot",
          name: "MotorService Bot",
          message: "Donner l'année",
          type: "text",
          value: "verify_year"
        }]
        socketIO.emit('chatbotResponse' , reponse)

        break;
      case 'verify_year_date_less':
        var reponse = [{
          uid : "chatbot",
          name: "MotorService Bot",
          message: "Donner le nombre de kilomètres parcourus depuis le dernier entretien",
          type: "text",
          value: "verify_year"
        },
        {
          uid : "chatbot",
          name: "MotorService Bot",
          message: "supérieur ou égal à 10000 kilometres",
          type: "button",
          value: "km_more"
        },
        {
          uid : "chatbot",
          name: "MotorService Bot",
          message: "inférieur à 10000 kilometres",
          type: "button",
          value: "km_less"
        }]
        socketIO.emit('chatbotResponse' , reponse)

        break;
      case 'infos_contact':
        var reponse = [{
          uid : "chatbot",
          name: "MotorService Bot",
          message: "souhaite une adresse email de contact",
          type: "button",
          value: "email"
        },
        {
          uid : "chatbot",
          name: "MotorService Bot",
          message: "souhaite un numéro de téléphone",
          type: "button",
          value: "numero"
        }]
        socketIO.emit('chatbotResponse' , reponse)

        break;
      case 'infos_vehicule':
        var reponse = [{
          uid : "chatbot",
          name: "MotorService Bot",
          message: "Quel type d'usage ? ",
          type: "text",
          value: "text"
        },
        {
          uid : "chatbot",
          name: "MotorService Bot",
          message: "Routier",
          type: "button",
          value: "rdv"
        },
        {
          uid : "chatbot",
          name: "MotorService Bot",
          message: "Tout-terrain",
          type: "button",
          value: "rdv"
        },
        {
          uid : "chatbot",
          name: "MotorService Bot",
          message: "Sportif",
          type: "button",
          value: "rdv"
        }]
        socketIO.emit('chatbotResponse' , reponse)

        break;
      case 'rdv':
        var reponse = [{
          uid : "chatbot",
          name: "MotorService Bot",
          message: "Vous pouvez faire un essai , voici les disponibilités pour cette semaine : choisissez ",
          type: "text",
          value: "text"
        },
        {
          uid : "chatbot",
          name: "MotorService Bot",
          message: "demain",
          type: "button",
          value: "saved"
        },
        {
          uid : "chatbot",
          name: "MotorService Bot",
          message: "apres-demain",
          type: "button",
          value: "saved"
        },
        {
          uid : "chatbot",
          name: "MotorService Bot",
          message: "aujourd'hui",
          type: "button",
          value: "saved"
        }]
        socketIO.emit('chatbotResponse' , reponse)

        break;
      case 'email':
        var reponse = [{
          uid : "chatbot",
          name: "MotorService Bot",
          message: "Voici l'adresse email de contact : motorservice@service.fr",
          type: "text",
          value: "email"
        }]
        socketIO.emit('chatbotResponse' , reponse)

        break;
      case 'numero':
        var reponse = [{
          uid : "chatbot",
          name: "MotorService Bot",
          message: "Voici le numero de tel du contact : 06 06 06 06 06",
          type: "text",
          value: "email"
        }]
        socketIO.emit('chatbotResponse' , reponse)

        break;
      case 'km_less':
        var reponse = [{
          uid : "chatbot",
          name: "MotorService Bot",
          message: "Souhaitez vous reviser votre vehicule ?",
          type: "text",
          value: "verify_year_date"
        }, {
          uid : "chatbot",
          name: "MotorService Bot",
          message: "Oui",
          type: "button",
          value: "yes"
        },
        {
          uid : "chatbot",
          name: "MotorService Bot",
          message: "Non",
          type: "button",
          value: "no"
        }]
        console.log(reponse)

        socketIO.emit('chatbotResponse' , reponse)
        break;
      case 'no':
        var reponse = [
          {
            uid: "chatbot",
            name: "MotorService Bot",
            message: "Cliquez pour commencer",
            type: "button",
            value: "start",
          }
        ]
        socketIO.emit('chatbotClose' , reponse)
        break;
      case 'saved':
        var reponse = [
          {
            uid: "chatbot",
            name: "MotorService Bot",
            message: "RDV bien enregistré ! ",
            type: "text",
            value: "start",
          }
          ,
          {
            uid: "chatbot",
            name: "MotorService Bot",
            message: "Recommencer",
            type: "button",
            value: "close",
          }
        ]
        socketIO.emit('chatbotClose' , reponse)
        break;
        
        default:
        console.log(`Sorry, we are out of ${value}.`);
    }
    
  })

  

  socket.on('chatbotFooter' , (val) => {
    console.log("value : " + JSON.stringify(val))
    var date;
    switch (val) {
      case 'verify_year':
        var reponse = [{
          uid : "chatbot",
          name: "MotorService Bot",
          message: "Quelle est la date de dernier entretien de la moto ?",
          type: "text",
          value: "verify_year_date"
        }, {
          uid : "chatbot",
          name: "MotorService Bot",
          message: "< 1 an",
          type: "button",
          value: "verify_year_date_more"
        },
        {
          uid : "chatbot",
          name: "MotorService Bot",
          message: "> 1 an",
          type: "button",
          value: "verify_year_date_less"
        }]
        console.log(reponse)

        socketIO.emit('chatbotResponse' , reponse)
      break;
      
      default:
        console.log(`Sorry, we are out of ${val}.`);
    }
  })

  socket.on('disconnect', () => {
    console.log('🔥: A user disconnected');
    users = users.filter((user) => user.socketID !== socket.id);
    socketIO.emit('newUserResponse', users);
    socket.disconnect();
  });

});

// app.use(cors());
app.get('/api', (req, res) => {
  res.json({
    message: 'Hello world',
  });
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});