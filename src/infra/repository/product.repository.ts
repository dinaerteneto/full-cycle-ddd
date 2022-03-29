import Product from "../../domain/entity/product";
import ProductRepositoryInterface from "../../domain/repository/product-repository.interface";
import ProductModel from "../db/sequelize/model/product.model";

export default class ProductRepository implements ProductRepositoryInterface {

    async create(entity: Product): Promise<void> {
        const { id, name, price } = entity
        await ProductModel.create({
            id, name, price
        })
    }
    async update(entity: Product): Promise<void> {
        const { id, name, price } = entity
        await ProductModel.update(
            {
                name,
                price
            },
            {
                where: { id }
            }
        )
    }
    async find(id: string): Promise<Product> {
        const product = await ProductModel.findOne({ where: { id } })
        return new Product(
            product.id,
            product.name,
            product.price
        )
    }
    async findAll(): Promise<Product[]> {
        const productModels = await ProductModel.findAll()
        return productModels.map(
            item => new Product(item.id, item.name, item.price)
        )
    }

}