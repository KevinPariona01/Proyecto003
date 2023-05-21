//REFERENCIAS HTML
const lblEscritorio = document.querySelector('h1');//PRIMER h1 QUE
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divAlerta = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');
const span = document.querySelector('span');

const socket = io();

const searhParams = new URLSearchParams(window.location.search);//CON ESTO OBTENGO LOS PARAMETROS QUE SE TIENEN POR LA URL
//SI NO TIENE EL PARAMETRO ESCRITORIO LANZA UN ERROR Y NOS MANDA AL index.html
if(!searhParams.has('escritorio')){
    window.location = 'index.html';
    throw new Error('El escritorio es obligatorio');
}

//SI TIENE EL PARAMETRO escritorio LO TOMA
const escritorio = searhParams.get('escritorio');
lblEscritorio.innerText = escritorio;

socket.on('tickets-pendientes', (tickets)=>{
    lblPendientes.innerText = tickets
    if(tickets>0){
        divAlerta.style.display = 'none';
    }
    
});

btnAtender.addEventListener('click', () =>{
    socket.emit('atender-ticket', {escritorio}, ({ ok, msg, ticket }) =>{
        if(!ok){//SI EL OK VIENE FALSE
            lblTicket.innerText = 'Nadie';
            span.innerText = 'Ya no hay más tickets';
            return divAlerta.style.display = '';
        }else{
            divAlerta.style.display = 'none';
        }

        lblTicket.innerText = 'Ticket: ' + ticket.numero;
    });
});