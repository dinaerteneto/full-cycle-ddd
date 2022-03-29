import Address from "./address"

export default class Customer {

    private _id: string
    private _name: string
    private _status: boolean = true
    private _address!: Address
    private _rewardPoints: number = 0

    constructor(id: string, name: string) {
        this._id = id
        this._name = name
        this.validate()
    }

    get id(): string {
        return this._id
    }

    get name(): string {
        return this._name
    }

    get Address(): Address {
        return this._address
    }

    get rewardPoints(): number {
        return this._rewardPoints
    }

    set address(address: Address) {
        this._address = address
    }

    isActive(): boolean {
        return this._status
    }

    validate(): boolean {
        if (this._id.length === 0) {
            throw new Error("ID is required")
        }
        if (this._name.length === 0) {
            throw new Error("Name is required")
        }
        return true
    }

    changeName(name: string): void {
        this._name = name
        this.validate()
    }

    changeAddress(address: Address): void {
        this._address = address
    }

    activate(): void {
        if (this._address === undefined) {
            throw new Error("Address is mandatory to active customer")
        }
        this._status = true
    }

    deactivate(): void {
        this._status = false
    }

    addRewardPoint(point: number): void {
        this._rewardPoints += point
    }

}