//REFERENCIAS HTML
const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnCrear = document.querySelector('.btn');

const socket = io();

socket.on('connect',()=>{
    console.log("CONECTADO");
    btnCrear.disabled = false;
});

socket.on('disconnect',()=>{
    btnCrear.disabled = true;
});

socket.on('actualizar-pantalla',(payload)=>{
    lblNuevoTicket.innerText = payload;
});



//CON ESTO CUANDO INGRESO A LA PANTALLA OBTENDRE EL ULTIMO TICKET Y ESTE SE MOSTRAR EN LA PANTALLA
socket.on('ultimo-ticket',(ultimo)=>{
    lblNuevoTicket.innerText = 'Ticket: ' + ultimo;
});

btnCrear.addEventListener('click', ()=>{
    socket.emit('siguiente-ticket', null, ( ticket )=>{
        //ACA NO ES NECESARIO AÑADIR EL PREFIJO TICKET COMO ARRIBA YA QUE EL SERVER ME DEVUELVE LA PALABRA COMPLETA
        lblNuevoTicket.innerText = ticket;
        //EMITO OTRO PARA QUE EN LAS DEMAS VENTANAS TAMBIEN SE ACTUALIZEN SI ESTAN MOSTRANDO LA PANTALLA PARA GENERAR TICKETS
        socket.emit('actualizar-pantallas', ticket);
        
    });
    
    
});