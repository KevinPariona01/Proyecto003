//REFERENCIAS AL HTML
const lblTicket1 = document.querySelector('#lblTicket1');
const lblEscritorio1 = document.querySelector('#lblEscritorio1');
const lblTicket2 = document.querySelector('#lblTicket2');
const lblEscritorio2 = document.querySelector('#lblEscritorio2');
const lblTicket3 = document.querySelector('#lblTicket3');
const lblEscritorio3 = document.querySelector('#lblEscritorio3');
const lblTicket4 = document.querySelector('#lblTicket4');
const lblEscritorio4 = document.querySelector('#lblEscritorio4');
const activar = document.querySelector('#activar');

//MENSAJE DEFAULT
const msg_dafult = 'No hay Ticket';
const socket = io();
let audio;
let band;

activar.addEventListener('click', function() {
    try{
        audio = new Audio();
        band = true;
    }catch(error){
        band = false;
        console.log(error);
    }  
});

let numero_ultimo_ticket=0;
socket.on('estado-actual', async (payload) => {
    audio = new Audio('./audio/new-ticket.mp3');

    //COMO ME ROTARNA 4, LO DESESTRUCTURAMOS
    const [ticket1, ticket2, ticket3, ticket4 ] = payload;

    if(ticket1){   
      
    numero_ultimo_ticket = localStorage.getItem("numero-ultimo-ticket");
    console.log(numero_ultimo_ticket);
    let revisar = ticket1.numero != numero_ultimo_ticket
    revisar? numero_ultimo_ticket=ticket1.numero: null;
    localStorage.setItem("numero-ultimo-ticket",numero_ultimo_ticket);
    if(band && revisar){ console.log("INGRESO", ticket1.numero, numero_ultimo_ticket); await audio.play()}

        lblTicket1.innerText = 'Ticket ' + ticket1.numero;
        lblEscritorio1.innerText = ticket1.escritorio;
    }else{ lblTicket1.innerText = msg_dafult }
    if(ticket2){
        lblTicket2.innerText = 'Ticket ' + ticket2.numero;
        lblEscritorio2.innerText = ticket2.escritorio;
    }else{ lblTicket2.innerText = msg_dafult }
    if(ticket3){
        lblTicket3.innerText = 'Ticket ' + ticket3.numero;
        lblEscritorio3.innerText = ticket3.escritorio;
    }else{ lblTicket3.innerText = msg_dafult }
    if(ticket4){
        lblTicket4.innerText = 'Ticket ' + ticket4.numero;
        lblEscritorio4.innerText = ticket4.escritorio;
    }else{ lblTicket4.innerText = msg_dafult }
    
});