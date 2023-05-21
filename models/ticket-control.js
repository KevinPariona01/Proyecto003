const path = require('path');
const fs = require('fs');

class Ticket{

    constructor(numero, escritorio){
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl{

    constructor(){
        this.ultimo = 0;//NÚMERO DEL ULTIMO TICKET
        this.hoy = new Date().getDate();//OBTENER DIA ACTUAL
        this.tickets = [];//ESTE TIENE LOS TICKETS PENDIENTES
        this.ultimos4 = [];//EN LA PANTALLA SOLO SE MOSTRARA 4 TICKETS QUE ESTAN O FUERON ATENDIDOS

        
        this.init();
    }

    get toJson(){
        return {
            "ultimo": this.ultimo,
            "hoy":this.hoy,
            "tickets":this.tickets,
            "ultimos4":this.ultimos4
        }
    }

    init(){
        const { ultimo, hoy, tickets, ultimos4 } = require('../db/data.json');
        if(hoy===this.hoy){
            this.ultimo = ultimo;
            this.hoy = hoy;
            this.tickets = tickets;
            this.ultimos4 = ultimos4;
        }else{
            //ES OTRO DIA
            this.guardarDB();
        }
    }

    siguiente(){
        this.ultimo += 1;
        const ticket = new Ticket(this.ultimo, null);//NO TIENE ESCRITORIO AUN
        this.tickets.push(ticket);
        this.guardarDB();//EN CASO SE CIERRE EL BACKEND
        return 'Ticket ' + ticket.numero;
    }

    atenderTicket(escritorio){
        //NO TENEMOS TICKETS
        if(this.tickets.length ===0 ){
            return null;
        }

        //REMUEVE EL PRIMER ELEMENTO DEL ARREGLO Y LO RETORNA(TICKET QUE REMOVIO)
        //ESTO LO HACE PORQUE YA NO ESTARÁ EN LOS TICKETS PORQUE YA SERÁ ATENDIDO, ENTONCES SE SACA DEL ARREGLO PERO SE PONE EN LOS ULTIMOS 4 PORQUE LOS ULTIMOS 4 SON LOS TICKETS QUE SE ATENDIERON O ESTAN SIENDO ATENDIDOS Y SE MOSTRARA EN LA PANTALLA, PERO NO ESTARÁ EN EL ARREGLO DE TICKETS PORQUE AHI SOLO ESTAN LOS TICKETS QUE ESTAN SIN ATENDER
        const ticket =this.tickets.shift();
        ticket.escritorio = escritorio;

        //AÑADE UN NUEVO OBJETO AL ARREGLO PERO AL INICIO
        this.ultimos4.unshift(ticket);

        if(this.ultimos4.length>4){
            //CORTA LA ULTIMA POSICION DEL ARREGLO, SOLO 1
            this.ultimos4.splice(-1,1);
        }

        this.guardarDB();

        return ticket;
    }

    guardarDB(){
        //SE PONE EL __dirname PARA QUE OBTENGA LA UBICACION DE DONDE ESTA, LUEGO CONTINUADO DE LOS DOS PUNTOS, ESTO PARA QUE SALGA DE AHI E INGRESE A LA RUTA QUE QUEREMOS
        const dbPath = path.join(__dirname, '../db/data.json');
        //OBTIENE EL OBJETO NUEVO QUE EH CREADO Y LO GUARDO EN EL ARCHIVO JSON
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }

}

module.exports = TicketControl;