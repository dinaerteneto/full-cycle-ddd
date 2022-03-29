import Customer from "../entity/customer"
import Order from "../entity/order"
import OrderItem from "../entity/order-item"
import OrderService from "./order.service"

describe("Order serice unit tests", () => {

    it("should get total of all orders", () => {
        const item1 = new OrderItem("any item id", "any item name", 100, "any product id", 1)
        const item2 = new OrderItem("other item id", "other item name", 200, "other product id", 2)

        const order1 = new Order("any order id", "any customer id", [item1])
        const order2 = new Order("other order id", "other customer id", [item2])

        const total = OrderService.total([order1, order2])
        expect(total).toBe(500)
    })

    it("should place an order", () => {
        const customer = new Customer("any customer id", "any customer name")
        const item = new OrderItem("any item id", "any item name", 100, "any product id", 1)
        const order = OrderService.placeOrder(customer, [item])
        
        expect(order.total()).toBe(100)
        expect(customer.rewardPoints).toBe(50)
    })
})