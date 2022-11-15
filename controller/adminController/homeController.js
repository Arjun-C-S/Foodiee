const moment = require("moment");

const Admin = require("../../models/adminModel");
const Customer = require("../../models/customerModel");
const Order = require("../../models/orderModel");

exports.homeGet = async (req, res) => {
  if (req.session.admin) {
    Order.find({ Order_Date_toFilter: moment().format("L") })
      .count()
      .then((TodaysBookingCount) => {
        // console.log(TodaysBookingCount);
        Order.find()
          .count()
          .then((TotalBookingCount) => {
            Customer.find()
              .count()
              .then((NumberOfCustomers) => {
                Order.aggregate([
                  {
                    $group: {
                      _id: null,
                      count: { $sum: "$Total_Amount" },
                    },
                  },
                ])
                  .then((Total_Revenue) => {
                    let today = moment().format("L");
                    let week = moment().subtract(7, "days").calendar();
                    Order.aggregate([
                      {
                        $group: {
                          _id: { order_date: "$Order_Date_toFilter" },
                          Total_Revenue: { $sum: "$Total_Amount" },
                        },
                      },
                      {
                        $match: {
                          $and: [
                            {
                              "_id.order_date": {
                                $gt: week,
                                $lte: today,
                              },
                            },
                          ],
                        },
                      },
                    ]).sort("_id.order_date")
                      .then((CompletedOrderData) => {
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
                        ])
                        .then((orderCountinthisWeek) => {
                          // console.log(orderCountinthisWeek.length);
                          let backsevendays =[]
                          for(i = 6 ; i >= 0; i--) {
                              backsevendays.push(moment().subtract(i, "days").format('llll').split(",")[0]);
                          }
                          // console.log(Total_Revenue_Past_Week);

                          let prevWeekStart = moment().subtract(7, "days").calendar();
                          let prevWeekEnd = moment().subtract(14, "days").calendar();
                          // console.log(prevWeekStart);
                          // console.log(prevWeekEnd);
                          Order.aggregate([
                            {
                              $group: {
                                _id: { order_date: "$Order_Date_toFilter" },
                                Total_Revenue: { $sum: "$Total_Amount" },
                              },
                            },
                            {
                              $match: {
                                $and: [
                                  {
                                    "_id.order_date": {
                                      $gt: prevWeekEnd,
                                      $lte: prevWeekStart,
                                    },
                                  },
                                ],
                              },
                            },
                          ]).sort("_id.order_date")
                          .then((PrevWeekSales) => {
                            let day14;
                            let salesPrevWeek = [] 
                            for(let i = 13; i >= 7; i--) {
                              day14 = moment().subtract(i, "days").calendar();
                              salesPrevWeek.push({ _id: { order_date: day14}, Total_Revenue: 0})
                            }
                            for(let i = 0; i < PrevWeekSales.length; i++) {
                              for(let j = 0; j < salesPrevWeek.length; j++ ) {
                                if(salesPrevWeek[j]._id.order_date === PrevWeekSales[i]._id.order_date) {
                                  salesPrevWeek[j] = PrevWeekSales[i]
                                }
                              }
                            }
                            let salesThisWeek = []
                            for(let i = 6; i >= 0; i--) {
                              day14 = moment().subtract(i, "days").format('L');
                              salesThisWeek.push({ _id: { order_date: day14}, Total_Revenue: 0})
                            }
                            for(let i = 0; i < CompletedOrderData.length; i++) {
                              for(let j = 0; j < salesThisWeek.length; j++ ) {
                                if(salesThisWeek[j]._id.order_date === CompletedOrderData[i]._id.order_date) {
                                  salesThisWeek[j] = CompletedOrderData[i]
                                }
                              }
                            }
                            let Total_Revenue_Past_Week = []
                            for(let i = 0; i < salesThisWeek.length; i++) {
                              Total_Revenue_Past_Week.push(salesThisWeek[i].Total_Revenue)
                            }
                            let Total_Revenue_second_Past_Week = []
                            for(let i = 0; i < salesPrevWeek.length; i++) {
                              Total_Revenue_second_Past_Week.push(salesPrevWeek[i].Total_Revenue)
                            }
                            let sumOfSalesinThisWeek = Total_Revenue_Past_Week.reduce((partialSum, a) => partialSum + a, 0);
                            let sumOfSalesinPrevWeek = Total_Revenue_second_Past_Week.reduce((partialSum, a) => partialSum + a, 0);
                            if(sumOfSalesinThisWeek > sumOfSalesinPrevWeek) {
                              per_increase_inSales =  (sumOfSalesinThisWeek - sumOfSalesinPrevWeek) / sumOfSalesinPrevWeek * 100
                              per_decrease_inSales = 0
                            } else {
                              per_decrease_inSales =  (sumOfSalesinPrevWeek - sumOfSalesinThisWeek) / sumOfSalesinPrevWeek * 100
                              per_increase_inSales = 0
                            }


                            Order.aggregate([
                              {
                                $group: {
                                  _id: { Payment_Method: "$Payment_Method" , Month: {$substr: ['$Order_Date_toFilter', 0, 2]} },
                                  Total_Revenue: { $sum: "$Total_Amount" },
                                },
                              },
                            ]).sort("Order_Date_toFilter")
                            .then((PaymentWiseRevenue) => {
                              let months = []
                              for(let i = 0; i <= 5; i++) {
                                months.push(moment().subtract(31 * i, "days").format('ll').split(' ')[0])
                              }

                              let payment_cod_revenue = []
                              for(let i = 0 ; i < 6; i++) {
                                let this_month = moment().subtract(31 * i, "days").format('L').split('/')[0]
                                payment_cod_revenue.push({ _id: { Payment_Method: 'COD', Month: this_month }, Total_Revenue: 0 })
                              }
                              for(let i = 0 ; i < PaymentWiseRevenue.length; i++) {
                                for(let j = 0; j < payment_cod_revenue.length; j++) {
                                  if(payment_cod_revenue[j]._id.Month === PaymentWiseRevenue[i]._id.Month && payment_cod_revenue[j]._id.Payment_Method === PaymentWiseRevenue[i]._id.Payment_Method) {
                                    payment_cod_revenue[j] = PaymentWiseRevenue[i]
                                  }
                                }
                              }

                              let payment_paypal_revenue = []
                              for(let i = 0 ; i < 6; i++) {
                                let this_month = moment().subtract(31 * i, "days").format('L').split('/')[0]
                                payment_paypal_revenue.push({ _id: { Payment_Method: 'PAYPAL', Month: this_month }, Total_Revenue: 0 })
                              }
                              for(let i = 0 ; i < PaymentWiseRevenue.length; i++) {
                                for(let j = 0; j < payment_paypal_revenue.length; j++) {
                                  if(payment_paypal_revenue[j]._id.Month === PaymentWiseRevenue[i]._id.Month  && payment_paypal_revenue[j]._id.Payment_Method === PaymentWiseRevenue[i]._id.Payment_Method) {
                                    payment_paypal_revenue[j] = PaymentWiseRevenue[i]
                                  }
                                }
                              }

                              let payment_razorpay_revenue = []
                              for(let i = 0 ; i < 6; i++) {
                                let this_month = moment().subtract(31 * i, "days").format('L').split('/')[0]
                                payment_razorpay_revenue.push({ _id: { Payment_Method: 'RAZORPAY', Month: this_month }, Total_Revenue: 0 })
                              }
                              // console.log(payment_razorpay_revenue);
                              for(let i = 0 ; i < PaymentWiseRevenue.length; i++) {
                                for(let j = 0; j < payment_razorpay_revenue.length; j++) {
                                  if(payment_razorpay_revenue[j]._id.Month === PaymentWiseRevenue[i]._id.Month  && payment_razorpay_revenue[j]._id.Payment_Method === PaymentWiseRevenue[i]._id.Payment_Method) {
                                    payment_razorpay_revenue[j] = PaymentWiseRevenue[i]
                                  }
                                }
                              }


                              // console.log(payment_cod_revenue);

                              let payment_cod_revenue_final = []
                              for(let i = 0; i < payment_cod_revenue.length; i++) {
                                payment_cod_revenue_final.push(payment_cod_revenue[i].Total_Revenue)
                              }
                              let MaxgraphMaxPaymentMethod_cod = payment_cod_revenue_final[0]
                              for(let i = 1; i < payment_cod_revenue_final.length; i++) {
                                if(MaxgraphMaxPaymentMethod_cod < payment_cod_revenue_final[i]) {
                                  MaxgraphMaxPaymentMethod_cod = payment_cod_revenue_final[i]
                                }
                              }
                              
                              // console.log(payment_paypal_revenue);

                              let payment_paypal_revenue_final = []
                              for(let i = 0; i < payment_paypal_revenue.length; i++) {
                                payment_paypal_revenue_final.push(payment_paypal_revenue[i].Total_Revenue)
                              }
                              let MaxgraphMaxPaymentMethod_paypal = payment_paypal_revenue_final[0]
                              for(let i = 1; i < payment_paypal_revenue_final.length; i++) {
                                if(MaxgraphMaxPaymentMethod_paypal < payment_paypal_revenue_final[i]) {
                                  MaxgraphMaxPaymentMethod_paypal = payment_paypal_revenue_final[i]
                                }
                              }
                              // console.log(payment_razorpay_revenue);

                              let payment_razorpay_revenue_final = []
                              for(let i = 0; i < payment_razorpay_revenue.length; i++) {
                                payment_razorpay_revenue_final.push(payment_razorpay_revenue[i].Total_Revenue)
                              }
                              let MaxgraphMaxPaymentMethod_razorpay = payment_razorpay_revenue_final[0]
                              for(let i = 1; i < payment_razorpay_revenue_final.length; i++) {
                                if(MaxgraphMaxPaymentMethod_razorpay < payment_razorpay_revenue_final[i]) {
                                  MaxgraphMaxPaymentMethod_razorpay = payment_razorpay_revenue_final[i]
                                }
                              }

                              let graphMaxPaymentMethod = Math.max(MaxgraphMaxPaymentMethod_cod, MaxgraphMaxPaymentMethod_paypal,MaxgraphMaxPaymentMethod_razorpay )
                              // console.log(graphMaxPaymentMethod);

                              Order.aggregate([
                                { $unwind: '$Product' },
                                {
                                  $lookup: {
                                    from: "products",
                                    localField: "Product.product_id",
                                    foreignField: "_id",
                                    as: "Result",
                                  },
                                },{ $unwind: '$Result' },
                                {
                                  $lookup: {
                                    from: "categories",
                                    localField: "Result.Category_id",
                                    foreignField: "_id",
                                    as: "CategoryDetails",
                                  },
                                },{ $unwind: '$CategoryDetails' },
                                {
                                  $group: {
                                    _id: { category: "$CategoryDetails._id" },
                                    "Category_name": {
                                      "$first": "$CategoryDetails.Category_name"
                                    },
                                    Total_Revenue: { $sum: "$Product.Total_Price" },
                                  },
                                },
                                {
                                  $sort: {"Category_name": 1}
                                },
                              ])
                              .then((CategoryDetails)=> {
                                // console.log(CategoryDetails);

                                Order.aggregate([
                                  { $unwind: '$Product' },
                                  {
                                    $lookup: {
                                      from: "products",
                                      localField: "Product.product_id",
                                      foreignField: "_id",
                                      as: "Result",
                                    },
                                  },{ $unwind: '$Result' },
                                  {
                                    $lookup: {
                                      from: "categories",
                                      localField: "Result.Category_id",
                                      foreignField: "_id",
                                      as: "CategoryDetails",
                                    },
                                  },{ $unwind: '$CategoryDetails' },
                                  {
                                    $group: {
                                      _id: { product: "$Result.product_name" },
                                      "Category_id": {
                                        "$first": "$Result.Category_id"
                                      },
                                      "Category_name": {
                                        "$first": "$CategoryDetails.Category_name"
                                      },
                                      Total_Revenue: { $sum: "$Product.Total_Price" },
                                    },
                                  },
                                  {
                                    $sort: {"Category_name": 1}
                                  },
                                ]).then((productData) => {
                                  // console.log(productData);
                                  let catProdarray = []
                                  let catProdLabel = []
                                  for(let i =0 ; i< CategoryDetails.length; i++) {
                                    catProdarray[i] = new Array()
                                    catProdLabel[i] = new Array()
                                  }
                                  for ( let i = 0; i < CategoryDetails.length; i++) { 
                                    for(let j = 0 ; j < productData.length ; j++) {
                                      if(productData[j].Category_name === CategoryDetails[i].Category_name) {
                                        catProdarray[i].push(Math.round(productData[j].Total_Revenue * 100 / CategoryDetails[i].Total_Revenue))
                                        catProdLabel[i].push(productData[j]._id.product)
                                      }
                                    }
                                  }
                                  let labelLength = []
                                  for(let i = 0 ; i < catProdLabel.length; i++) {
                                    labelLength.push(catProdLabel[i].length)
                                  }

                                  // for ( let i = 0; i < CategoryDetails.length; i++) { 
                                  //   for(let j = 0 ; j < productData.length ; j++) {
                                  //     if(productData[j].Category_name === CategoryDetails[i].Category_name) {
                                  //       catProdarray[i].push(Category_name = CategoryDetails[i].Category_name, Category_sales = Math.round(productData[j].Total_Revenue * 100 / CategoryDetails[i].Total_Revenue))
                                  //     }
                                  //   }
                                  // }


                                  // console.log( Total_Revenue[0]);
                                  
                                  res.render("Admin/home", {
                                    adminName: req.session.admin,
                                    pageTitle: "Admin || Dashboard",
                                    TodaysBookingCount: TodaysBookingCount,
                                    TotalBookingCount: TotalBookingCount,
                                    NumberOfCustomers: NumberOfCustomers,
                                    Total_Revenue: Total_Revenue[0].count,
                                    backsevendays: backsevendays,
                                    Total_Revenue_Past_Week: Total_Revenue_Past_Week,
                                    Total_Revenue_second_Past_Week: Total_Revenue_second_Past_Week,
                                    orderCountinthisWeek: orderCountinthisWeek.length,
                                    per_increase_inSales: per_increase_inSales,
                                    per_decrease_inSales: per_decrease_inSales,
                                    months: months,
                                    payment_cod_revenue_final: payment_cod_revenue_final,
                                    payment_paypal_revenue_final: payment_paypal_revenue_final,
                                    payment_razorpay_revenue_final: payment_razorpay_revenue_final,
                                    graphMaxPaymentMethod: graphMaxPaymentMethod,
                                    CategoryDetails: CategoryDetails,
                                    productData: productData,
                                    catProdarray: JSON.stringify(catProdarray),
                                    catProdLabel: catProdLabel,
                                    labelLength: JSON.stringify(labelLength),
                                  });
                                }).catch((err) => {
                                  console.log(err);
                                })
                              }).catch((err) => {
                                console.log(err);
                              })
                            }).catch((err) => {
                              console.log(err);
                            })
                          }).catch((err) => {
                            console.log(err);
                          })
                          }).catch((err) => {
                            console.log(err);
                          })
                      })
                      .catch((err) => {
                        console.log(err);
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                    });
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.redirect("/Admin/");
  }
};

exports.homePost = (req, res) => {
  Admin.find({ email: req.body.email, password: req.body.password })
    .then((data) => {
      req.session.admin = data[0].name;
      res.redirect("/Admin/home");
    })
    .catch((err) => {
      req.session.invalidCredentials = true;
      res.redirect("/Admin/");
    });
};
