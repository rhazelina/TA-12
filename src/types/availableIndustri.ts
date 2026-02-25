export interface CompanyData {
    address: string;
    id: number;
    name: string;
    quota: number;
    remaining_slots: number;
    sector: string;
}

export interface ICompanyResponse {
    data: CompanyData[];
    total: number;
}