export interface IAsientos {
    seat: string;
    position: IPosition;
    occupied: boolean;
    type: string;
    selected : boolean;
}

export interface IPosition {
    x: number;
    y: number;
    z: number;
}