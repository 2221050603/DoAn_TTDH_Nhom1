const express = require("express");
const app = express();
const path = require("path");
const port = 3000;

const carRoutes = require("./routes/carRoutes");
const car_managerRoutes = require("./routes/car_managerRoutes");
const user_managerRoutes = require("./routes/user_managerRoutes");
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const addressRoutes = require("./routes/addressRoutes");    
const orderRoutes = require("./routes/orderRoutes");        
const searchRoutes = require("./routes/searchRoutes");      
const homeRoutes = require("./routes/homeRoutes");          

app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Routes
app.use("/", homeRoutes);
app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/", carRoutes);
app.use("/", car_managerRoutes);
app.use("/", user_managerRoutes);
app.use("/", addressRoutes);
app.use("/", orderRoutes);
app.use("/", searchRoutes);

app.listen(port, () =>
  console.log(`Server đang chạy tại http://localhost:${port}`)
);
