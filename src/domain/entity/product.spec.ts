import Product from "./product"

describe("Product unit test", () => {
    it("should throw error when id is empty", () => {
        expect(() => {
            new Product("", "Any Product", 100)
        }).toThrowError("ID is required")
    })

    it("should throw error when name is empty", () => {
        expect(() => {
            new Product("Any Id", "", 100)
        }).toThrowError("Name is required")
    })

    it("should throw error when is less than zero", () => {
        expect(() => {
            new Product("Any Id", "Any Product", -1)
        }).toThrowError("Price must be greater than zero")
    })

    it("should change name", () => {
        const product = new Product("Any Id", "Any Product", 100)
        product.changeName("Other name")
        expect(product.name).toBe("Other name")
    })

    it("should change price", () => {
        const product = new Product("Any Id", "Any Product", 100)
        product.changePrice(150)
        expect(product.price).toBe(150)
    })

})