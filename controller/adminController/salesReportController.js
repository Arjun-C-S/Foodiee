const Order = require("../../models/orderModel");
const moment = require("moment");
const Customer = require("../../models/customerModel");

exports.salesReporTodaytGet = (req, res) => {
  if(req.session.admin) {
    let today = moment().format("L");

    Order.aggregate([
      {
        $match: {
          $or: [
            {
              $and: [
                { Payment_Status: "COMPLETED" },
                { Order_Status: "DELIVERED" },
                { Order_Date_toFilter: today },
              ],
            },
            {
              Order_Status: "REJECTED",
            },
          ],
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "Customer_id",
          foreignField: "_id",
          as: "CustomerData",
        },
      },
      { $unwind: "$CustomerData" },
    ])
      .then((CompletedOrderData) => {
        console.log(CompletedOrderData);
        res.render("Admin/salesReport", {
          pageTitle: "Sales Report",
          CompletedOrderData: CompletedOrderData,
          filterTime: "Today",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect('/Admin/')
  }
  

};

exports.salesReportWeekGet = (req, res) => {
  if(req.session.admin) {
    let today = moment().format("L");
    let week = moment().subtract(7, "days").calendar();
  
    Order.aggregate([
      {
        $match: {
          $or: [
            {
              $and: [
                { Payment_Status: "COMPLETED" },
                { Order_Status: "DELIVERED" },
                { Order_Date_toFilter: { $gte: week, $lte: today } },
              ],
            },
            {
              Order_Status: "REJECTED",
            },
          ],
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "Customer_id",
          foreignField: "_id",
          as: "CustomerData",
        },
      },
      { $unwind: "$CustomerData" },
    ])
      .then((CompletedOrderData) => {
        res.render("Admin/salesReport", {
          pageTitle: "Sales Report",
          CompletedOrderData: CompletedOrderData,
          filterTime: "Week",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect('/Admin/')
  }
  
};
exports.salesReportYearGet = (req, res) => {
  if(req.session.admin) {
    let year = moment().format("L").split("/")[2];

    Order.aggregate([
      {
        $match: {
          $or: [
            {
              $and: [
                { Payment_Status: "COMPLETED" },
                { Order_Status: "DELIVERED" },
                { Order_Date_toFilter: { $regex: year } },
              ],
            },
            {
              Order_Status: "REJECTED",
            },
          ],
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "Customer_id",
          foreignField: "_id",
          as: "CustomerData",
        },
      },
      { $unwind: "$CustomerData" },
    ])
      .then((CompletedOrderData) => {
        res.render("Admin/salesReport", {
          pageTitle: "Sales Report",
          CompletedOrderData: CompletedOrderData,
          filterTime: "Year",
        });
      })
      .catch((err) => {
        console.log(err);
      });
  
  } else {
    res.redirect('/Admin/')
  }
  
};
