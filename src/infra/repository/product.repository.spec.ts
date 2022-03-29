import { Sequelize } from "sequelize-typescript"
import Product from "../../domain/entity/product"
import ProductModel from "../db/sequelize/model/product.model"
import ProductRepository from "./product.repository"
import { v4 as uuid } from "uuid"
import { faker as faker } from "@faker-js/faker"

describe("Product repository test", () => {

    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize.addModels([ProductModel])
        await sequelize.sync()
    })

    beforeAll(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory',
            logging: false,
            sync: { force: true }
        })
    })

    afterAll(async () => {
        await sequelize.dropAllSchemas({ logging: false })
        await sequelize.close()
    })



    it("should create a product", async () => {
        const productRepository = new ProductRepository()
        const product = new Product(uuid(), faker.commerce.product(), parseFloat(faker.commerce.price()))
        await productRepository.create(product)
        const productModel = await ProductModel.findOne({ where: { id: product.id } })
        expect(productModel.toJSON()).toStrictEqual({
            id: product.id,
            name: product.name,
            price: product.price
        })
    })

    it("should update a product", async () => {
        const productRepository = new ProductRepository()
        const product = new Product(uuid(), faker.commerce.product(), parseFloat(faker.commerce.price()))
        await productRepository.create(product)

        product.changeName(faker.commerce.product())
        product.changePrice(200)
        await productRepository.update(product)

        const productModel = await ProductModel.findOne({ where: { id: product.id } })

        expect(productModel.toJSON()).toStrictEqual({
            id: product.id,
            name: product.name,
            price: 200
        })
    })

    it("should find a product by id", async () => {
        const productRepository = new ProductRepository()
        const product = new Product(uuid(), faker.commerce.product(), parseFloat(faker.commerce.price()))
        await productRepository.create(product)

        const productModel = await ProductModel.findOne({ where: { id: product.id } })
        const foundProduct = await productRepository.find(product.id)

        const { id, name, price } = foundProduct

        expect(productModel.toJSON()).toStrictEqual({
            id, name, price
        })
    })

    it("should find all product", async () => {
        const productRepository = new ProductRepository()

        const product1 = new Product(uuid(), faker.commerce.product(), parseFloat(faker.commerce.price()))
        const product2 = new Product(uuid(), faker.commerce.product(), parseFloat(faker.commerce.price()))
        await productRepository.create(product1)
        await productRepository.create(product2)

        const fountProducts = await productRepository.findAll()
        const products = [product1, product2]

        expect(products).toEqual(fountProducts)
    })

})