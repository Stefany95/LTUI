export interface ISubStop {
    id: string;
    name: string;
    url: string;
    type: string;
}

export interface IParadas {
    id: string;
    name: string;
    url: string;
    type: string;
    substops: ISubStop[];
}

export interface IRootObject {
    paradas: IParadas[];
}