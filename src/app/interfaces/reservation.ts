export interface Reservation {
    name: string;
    phone: string;
    chairs: number;
    day: string;
    hour: string;
    timestamp: number;
    idUser: string;
    idRestaurant: string;
    type: string;
    menu: Array<any>;
    price: number;
    medioPago: string;
    typeReservation: string;
}
