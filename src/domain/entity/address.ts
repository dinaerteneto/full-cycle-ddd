export default class Address {

    private _street: string
    private _zipcode: string
    private _country: string
    private _city: string
    private _number: number = 0

    constructor(
        street: string,
        zipcode: string,
        country: string,
        city: string,
        number: number
    ) {
        this._street = street
        this._zipcode = zipcode
        this._country = country
        this._city = city
        this._number = number
    }

    get street(): string {
        return this._street
    }

    get zipcode(): string {
        return this._zipcode
    }

    get country(): string {
        return this._country
    }

    get city(): string {
        return this._city
    }

    get number(): number {
        return this._number
    }

}