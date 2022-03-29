import Address from './address'
import Customer from './customer'

describe("Customer unit tests", () => {
    it("should throw error when id is empty", () => {
        expect(() => {
            new Customer("", "Any Name")
        }).toThrowError("ID is required")
    })
    it("should throw error when name is empty", () => {
        expect(() => {
            new Customer("Any ID", "")
        }).toThrowError("Name is required")
    })    
    it("should change name", () => {
        const costumer = new Customer("Any ID", "Any Name")
        costumer.changeName("Other Name")
        expect(costumer.name).toBe("Other Name")
    })
    it("should activate customer", () => {
        const costumer = new Customer("Any ID", "Any Name")
        costumer.address = new Address(
            "Any Address",
            "Any zipcode",
            "Any Country",
            "Any City",
            100
        )
        costumer.activate()
        expect(costumer.isActive()).toBe(true)
    })
    it("should deactivate customer", () => {
        const costumer = new Customer("Any ID", "Any Name")
        costumer.deactivate()
        expect(costumer.isActive()).toBe(false)
    })    
    it("should thow error when active customer without address", () => {
        expect(() => {
            const costumer = new Customer("Any ID", "Any Name")
            costumer.activate()
        }).toThrowError("Address is mandatory to active customer")

    })

    it("should add reward points", () => {
        const costumer = new Customer("Any ID", "Any Name")

        expect(costumer.rewardPoints).toBe(0)
        
        costumer.addRewardPoint(10)
        expect(costumer.rewardPoints).toBe(10)

        costumer.addRewardPoint(10)
        expect(costumer.rewardPoints).toBe(20)
    })

})