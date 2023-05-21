const TicketControl = require('../models/ticket-control');
//AL ENCENDER EL SERVIDOR COMO SE CREAR EL OBJETO SE INICIA EL CONSTRUCTOR, ENTONCES YA ACTIVA LO QUE ESTE DENTRO DEL CONSTRUCTOR POR ESO OBTIENE LA DATA DE DB
const ticketControl = new TicketControl();

const socketController = (socket) => {

    //AL CONECTARSE OBTIENE EL ULTIMO TICKER
    socket.emit('ultimo-ticket', ticketControl.ultimo)
    //AL CONECTARSE OBTIENE LOS ULTIMOS 4 QUE ESTAN SIENDO ATENDIDOS SI ES QUE HAY
    socket.emit('estado-actual', ticketControl.ultimos4)

    socket.emit('tickets-pendientes', ticketControl.tickets.length)

    //SE ACCIONA CUANDO LLAMA A ESTA ACCION
    socket.on('siguiente-ticket', ( payload, callback ) => {
        const siguiente = ticketControl.siguiente();
        callback(siguiente);
        //NOTIFICAR QUE HAY UN NUEVO TICKET PENDIENTE
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length)
    })

    socket.on('atender-ticket', (payload, callback)=>{
        //NOTA: CUANDO VIENE DATA EN UN OBJETO, SERIA payload.data siendo data el atributo del objeto que hemos enviado
        if(!payload.escritorio){//SI NO ENVIAMOS EL ESCRIOTRIO ENTONCES RETORNAMOS ESTE MENSAJE
            return callback({
                ok: false,
                msg: "El escriotrio es obligatorio"
            });
        }

        const ticket = ticketControl.atenderTicket(payload.escritorio);
        //CUANDO ATIENDE UNO ESE TICKET EMITE A TODOS LOS DEMAS CLIENTES PARA QUE SE ACTUALIZE LA PANTALLA DEL TICKET ATENDIDO
        socket.broadcast.emit('estado-actual', ticketControl.ultimos4)
        if(!ticket){
            callback({//PUEDE SER RETURN O SIN RETURN
                ok: false,
                msg: "Ya no hay tickets pendientes"
            });
        }else{
            callback({//PUEDE SER RETURN O SIN RETURN
                ok: true,
                ticket
            });
        }

        //----SE HACE DE ESTA MANERA PARA USAR EL MISMO METODO, O TAMBIEN SE PODIA UTILZIAR UN CALLBACK QUE LE RETORNE A EL MISMO Y SOLO USAR EL BROADCAST
        //EMITE A TODOS LOS DEMAS EXCEPTO A EL
        socket.broadcast.emit('tickets-pendientes', ticketControl.tickets.length)
        //EMITE SOLO A EL
        socket.emit('tickets-pendientes', ticketControl.tickets.length)

    });


    //EMITE A LAS DEMAS PANTALLAS QUE ACTUALIZE YA QUE SE GENERO OTRO TICKET
    socket.on('actualizar-pantallas', ticketActual => {
        socket.broadcast.emit('actualizar-pantalla', ticketActual);
    })

}



module.exports = {
    socketController
}

