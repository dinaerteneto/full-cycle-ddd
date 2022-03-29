import Order from "./order"
import OrderItem from "./order-item"

describe("Order unit test", () => {

    it("should throw error when id is empty", () => {
        expect(() => {
            new Order("", "Any customer ID", [])
        }).toThrowError("ID is required")
    })

    it("should throw error when customerID is empty", () => {
        expect(() => {
            new Order("Any Order ID", "", [])
        }).toThrowError("Customer ID is required")
    })

    it("should throw error if items qtd is zero", () => {
        expect(() => {
            new Order("Any Order ID", "Any Customer ID", [])
        }).toThrowError("Item qtd must be greater than 0")
    })

    it("should calculate total", () => {
        const item = new OrderItem("Any Id", "Any Name", 100, "Any Product Id", 2)
        const order = new Order("Any Id", "Any Customer Id", [item])
        expect(order.total()).toBe(200)

        const item2 = new OrderItem("Other Id", "Any Name", 200, "Other Product Id", 2)
        const order2 = new Order("Any Id", "Any Customer Id", [item, item2])
        expect(order2.total()).toBe(600)
    })

    it("should throw error if item qtd is less or equal zero", () => {
        expect(() => {
            new OrderItem("Any Id", "Any Name", 100, "Any Product Id", 0)
        }).toThrowError("Item qtd must be greater than 0")
    })

})