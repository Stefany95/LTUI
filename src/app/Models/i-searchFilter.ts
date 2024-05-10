export interface ISearchFilterBus {
    from: string;
    to: string;
    travelDate: string;
    affiliateCode: string;
    "include-connections": boolean;
}

export interface ISearchFilterAsientos {
    travelId: string;
    orientation: string;
    type: string;
}