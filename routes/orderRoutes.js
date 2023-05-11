const express = require("express");
const { getOneOrder, createOrder, updateOrder, deleteOrder, setUser, getAllOrders } = require("../controllers/orderController");
const authController = require("./../controllers/authController")

const orderRouter = express.Router();

orderRouter.use(authController.protect)

orderRouter.
    route("/"). 
    post(setUser, createOrder).
    get(getAllOrders)

orderRouter.
    route("/:id").
    get(getOneOrder).
    put(updateOrder).
    delete(deleteOrder)

module.exports = orderRouter;