import User from "./models/users.model.js";
import Product from "./models/products.model.js";
import Cart from "./models/carts.model.js";
import Pet from "./models/pets.model.js";
import Adoption from "./models/adoptions.model.js";

class Manager {
    constructor(model) {
        this.model = model;
    }

    createOne = async (data) => {
        try {
            return await this.model.create(data);
        } catch (error) {
            throw new Error(`Error creating document: ${error.message}`);
        }
    };

    readAll = async (filter = {}) => {
        try {
            return await this.model.find(filter).lean();
        } catch (error) {
            throw new Error(`Error reading documents: ${error.message}`);
        }
    };

    readBy = async (query) => {
        try {
            return await this.model.findOne(query).lean();
        } catch (error) {
            throw new Error(`Error reading document: ${error.message}`);
        }
    };

    readById = async (id) => {
        try {
            return await this.model.findById(id).lean();
        } catch (error) {
            throw new Error(`Error reading document by ID: ${error.message}`);
        }
    };

    updateOne = async (id, data) => {
        try {
            return await this.model.findOneAndUpdate({ _id: id }, data, { new: true });
        } catch (error) {
            throw new Error(`Error updating document: ${error.message}`);
        }
    };

    updateById = async (id, data) => {
        try {
            return await this.model.findByIdAndUpdate(id, data, { new: true });
        } catch (error) {
            throw new Error(`Error updating document by ID: ${error.message}`);
        }
    };

    destroyOne = async (id) => {
        try {
            return await this.model.findOneAndDelete({ _id: id });
        } catch (error) {
            throw new Error(`Error deleting document: ${error.message}`);
        }
    };

    destroyById = async (id) => {
        try {
            return await this.model.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Error deleting document by ID: ${error.message}`);
        }
    };
}

export default Manager;

// Instancias del manager para cada colección
const usersManager = new Manager(User);
const productsManager = new Manager(Product);
const cartsManager = new Manager(Cart);
const petsManager = new Manager(Pet);
const adoptionsManager = new Manager(Adoption);

export { usersManager, productsManager, cartsManager, petsManager, adoptionsManager };
