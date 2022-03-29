import OrderItem from "./order-item"

export default class Order {

    private _id: string
    private _customerId: string
    private _total: number = 0
    private _items: OrderItem[]

    constructor(
        id: string,
        customerId: string,
        items: OrderItem[]
    ) {
        this._id = id
        this._customerId = customerId
        this._items = items
        this._total = this.total()
        this.validate()
    }

    get id(): string {
        return this._id
    }

    get customerId(): string {
        return this._customerId
    }

    get items(): OrderItem[] {
        return this._items
    }

    validate(): boolean {
        if (this._id.length === 0) {
            throw new Error("ID is required")
        }
        if (this._customerId.length === 0) {
            throw new Error("Customer ID is required")
        }
        if (this._items.length === 0) {
            throw new Error("Item qtd must be greater than 0")
        }
        if (this._items.some(item => item.quantity <= 0)) {
            throw new Error("Item qtd must be greater than 0")
        }
        return true
    }

    total(): number {
        return this._items.reduce((acc, item) => acc + item.price, 0)
    }

    removeAllItems(): void {
        this._items.splice(0, this._items.length)
    }

    addItem(item: OrderItem): void {
        const index = this._items.findIndex(object => object.id === item.id);
        if (index === -1) {
          this._items.push(item);
        }        
    }
}