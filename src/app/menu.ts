export interface Additional {
    name: string;
    price: string;
}

export interface PlatosCorriente {
    name: string;
    price: string;
}

export interface Entrance {
    price: string;
    name: string;
}

export interface Drink {
    price: string;
    name: string;
}

export interface PlatosFuerte {
    price: string;
    name: string;
}

export interface Dishes {
    additionals: Additional[];
    platosCorrientes: PlatosCorriente[];
    entrances: Entrance[];
    drinks: Drink[];
    platosFuertes: PlatosFuerte[];
}

export interface RootObject {
    dishes: Dishes;
    idUser: string;
}
