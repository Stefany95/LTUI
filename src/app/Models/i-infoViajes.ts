export interface ICompany {
    id: string;
    name: string;
}

export interface ILocation {
    id: string;
    name: string;
}  

export interface IDepartureArrival {
    date: string;
    time: string;
}

export interface IPrice {
    seatPrice: number;
    taxPrice: number;
    price: number;
}

export interface IConnection {
    node: ILocation;
    waitingInformation: IWaitingInformation;
    company: ICompany;
    seatClass: string;
    availableSeats: number;
    withBPE: boolean;
}

export interface IWaitingInformation {
    arrival: IDepartureArrival;
    departure: IDepartureArrival;
}

export interface IBusInfo {
    id: string;
    company: ICompany;
    from: ILocation;
    to: ILocation;
    availableSeats: number;
    withBPE: boolean;
    departure: IDepartureArrival;
    arrival: IDepartureArrival;
    travelDuration: number;
    travelDistance: number;
    seatClass: string;
    price: IPrice;
    insurance: number;
    allowCanceling: boolean;
    travelCancellationLimitDate: string;
    travelCancellationFee: number;
    manualConfirmation: boolean;
    connection: IConnection;
}
export interface IInfoBustable{
    id: string;
    company : string;
    departure: string;
    arrival : string;
    price : number;
    seatClass: string;
    from: string;
    to: string;
}