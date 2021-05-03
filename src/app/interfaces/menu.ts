export interface Categoria {
    name: string;
    price: string;
}

export interface RootObject {
    dishes: Categoria[];
    idUser: string;
}
