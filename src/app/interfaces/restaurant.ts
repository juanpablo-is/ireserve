export interface Restaurant {
    idUser: string;
    type: string;
    name: string;
    address: string;
    dateStart: Date;
    dateEnd: Date;
    geoPoint: any;
    countTables: number;
    phone: number;
    urlPhoto: string;
}
