const express = require("express");
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const morgan = require("morgan");


//Customer Routes

const guestHomeRoutes = require('./routes/customerRoutes/guestHomeRoutes');
const customerLoginRoutes = require("./routes/customerRoutes/loginRoutes");
const customerSignUpRoutes = require("./routes/customerRoutes/SignUpRoutes");
const customerHomeRoutes = require("./routes/customerRoutes/homeRoutes");
const customerViewProductRoutes = require("./routes/customerRoutes/ViewProductRoutes");
const customerVerificationRoutes = require("./routes/customerRoutes/VerificationRoutes");
const customerCartRoutes = require("./routes/customerRoutes/CartRoutes");
const customerWishlistRoutes = require("./routes/customerRoutes/WishlistRoutes");
const customerAddressRoutes = require("./routes/customerRoutes/AddressRoutes");
const customerInvoiceRoutes = require("./routes/customerRoutes/InvoiceRoutes");
const customerOTPloginRoutes = require("./routes/customerRoutes/OTPloginRoutes");
const customerselectPaymentRoutes = require("./routes/customerRoutes/selectPaymentRoutes");
const customerCashOnDeliveryRoutes = require("./routes/customerRoutes/CashOnDeliveryRoutes");
const customerOrdersRoutes = require("./routes/customerRoutes/OrdersRoutes");
const customerCheckStockRoutes = require("./routes/customerRoutes/CheckStockRoutes");
const customerProfileRoutes = require("./routes/customerRoutes/ProfileRoutes");
const customerRazorPayRoutes = require("./routes/customerRoutes/RazorPayRoutes");
const customerPaypalRoutes = require("./routes/customerRoutes/PaypalRoutes");
const customerCouponRoutes = require("./routes/customerRoutes/CouponRoutes");
const customerWalletRoutes = require("./routes/customerRoutes/WalletRoutes");
const customerWalletPaymentRoutes = require("./routes/customerRoutes/WalletPaymentRoutes");

//Admin Routes

const adminLoginRoutes = require("./routes/adminRoutes/loginRoutes");
const adminHomeRoutes = require("./routes/adminRoutes/HomeRoutes");
const adminLogOutRoutes = require("./routes/adminRoutes/logOutRoutes");
const adminCategoryRoutes = require("./routes/adminRoutes/CategoryRoutes");
const adminViewCustomerRoutes = require("./routes/adminRoutes/ViewCustomerRoutes");
const adminProductRoutes = require("./routes/adminRoutes/productRoutes");
const adminPendingOrdersRoutes = require("./routes/adminRoutes/PendingOrdersRoutes");
const adminviewOrderDetailsRoutes = require("./routes/adminRoutes/viewOrderDetailsRoutes");
const adminAcceptOrderRoutes = require("./routes/adminRoutes/AcceptOrderRoutes");
const adminRejectOrderRoutes = require("./routes/adminRoutes/RejectOrderRoutes");
const adminOrderProgressRoutes = require("./routes/adminRoutes/OrderProgressRoutes");
const adminOrderDeliveredRoutes = require("./routes/adminRoutes/OrderDeliveredRoutes");
const adminCompletedOrdersRoutes = require("./routes/adminRoutes/CompletedOrdersRoutes");
const adminSalesReportRoutes = require("./routes/adminRoutes/SalesReportRoutes");
const adminCateogryOfferRoutes = require("./routes/adminRoutes/CateogryOfferRoutes");
const adminProductOfferRoutes = require("./routes/adminRoutes/ProductOfferRoutes");
const adminCouponRoutes = require("./routes/adminRoutes/CouponRoutes");

//Common Routes

const errorController = require("./controller/404");

const connectDB = require("./database/connection"); 

const adminDatabase = require("./models/adminModel");

dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8080;

// mongodb connection
connectDB();

const app = express();

// app.use(morgan(":method :status :url'http-version'"));

app.use(function (req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
});

app.use(
  session({
    secret: "key",
    resave: false,
    saveUninitialized: false,
  })
);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/Customer", customerSignUpRoutes);
app.use("/Customer", customerLoginRoutes);
app.use("/Customer", customerHomeRoutes);
app.use("/Customer", customerViewProductRoutes);
app.use("/Customer", customerVerificationRoutes);
app.use("/Customer", customerCartRoutes);
app.use("/Customer", customerWishlistRoutes);
app.use("/Customer", customerAddressRoutes);
app.use("/Customer", customerselectPaymentRoutes);
app.use("/Customer", customerInvoiceRoutes);
app.use("/Customer", customerCashOnDeliveryRoutes);
app.use("/Customer", customerOrdersRoutes);
app.use("/Customer", customerCheckStockRoutes);
app.use("/Customer", customerProfileRoutes);
app.use("/Customer", customerRazorPayRoutes);
app.use("/Customer", customerPaypalRoutes);
app.use("/Customer", customerCouponRoutes);
app.use("/Customer", customerWalletRoutes);
app.use("/Customer", customerWalletPaymentRoutes);
app.use("/Customer", customerOTPloginRoutes);
app.use("/", guestHomeRoutes);

app.use("/Admin", adminLoginRoutes);
app.use("/Admin", adminHomeRoutes);
app.use("/Admin", adminCategoryRoutes);
app.use("/Admin", adminViewCustomerRoutes);
app.use("/Admin", adminProductRoutes);
app.use("/Admin", adminPendingOrdersRoutes);
app.use("/Admin", adminviewOrderDetailsRoutes);
app.use("/Admin", adminAcceptOrderRoutes);
app.use("/Admin", adminRejectOrderRoutes);
app.use("/Admin", adminOrderProgressRoutes);
app.use("/Admin", adminOrderDeliveredRoutes);
app.use("/Admin", adminCompletedOrdersRoutes);
app.use("/Admin", adminSalesReportRoutes);
app.use("/Admin", adminCateogryOfferRoutes);
app.use("/Admin", adminProductOfferRoutes);
app.use("/Admin", adminCouponRoutes);
app.use("/Admin", adminLogOutRoutes);

app.use(errorController.get404);
app.use(adminDatabase); //create admin collection (only one time)

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
