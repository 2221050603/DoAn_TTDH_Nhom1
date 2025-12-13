const OrderModel = require("../models/orderModel");

const OrderController = {
  renderOrderForm: async (req, res) => {
    try {
      const result = await OrderModel.getStore(req.params.id);
      res.render("order", { store: result.rows[0] });
    } catch (err) {
      res.status(500).send("Lỗi server");
    }
  },

  submitOrder: async (req, res) => {
    try {
      await OrderModel.create(req.body);
      res.send("Đơn hàng đã được gửi thành công!");
    } catch {
      res.status(500).send("Lỗi xử lý đơn hàng");
    }
  },
};

module.exports = OrderController;
