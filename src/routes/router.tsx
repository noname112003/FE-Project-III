import { createBrowserRouter } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import LoginPage from "../pages/login/LoginPage";
import OrderListPage from "../pages/order/order-list/OrderListPage";
import CreateOrderPage from "../pages/order/create-order/CreateOrderPage";
import DetailOrderPage from "../pages/order/detail-order/DetailOrderPage";
import User from "../pages/admin/User";
import CreateUser from "../pages/admin/CreateUser";
import DetailUser from "../pages/admin/DetailUser";
import UpdateUser from "../pages/admin/UpdateUser";
import ChangePassword from "../pages/admin/ChangePassword";
import UserProfile from "../pages/admin/UserProfile";
import CustomerPage from "../pages/customer/CustomerPage";
import CustomerDetailPage from "../pages/customer/CustomerDetailPage";
import OverviewPage from "../pages/overview/OverviewPage";
import ProductPage from "../pages/product/ProductPage";
import VariantPage from "../pages/product/variants/VariantPage";
import BrandPage from "../pages/product/brands/BrandPage";
import ProductDetail from "../pages/product/product-detail/ProductDetail";
import CategoryPage from "../pages/product/categories/CategoryPage";
import ProductEdit from "../pages/product/product-detail/product-edit/ProductEdit";
import AddVariant from "../pages/product/product-detail/add-variant/AddVariant";
import AddProduct from "../pages/product/add-product/AddProduct";
import PrivateRoute from "../components/router/PrivateRoute";
import OrderRoute from "../components/router/OrderRoute";
import CustomerRoute from "../components/router/CustomerRoute";
import ProductRoute from "../components/router/ProductRoute";
import AdminRoute from "../components/router/AdminRoute";
import AccessDeniedPage from "../pages/AccessDeniedPage.tsx";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <HomeLayout />,
        children: [
          {
            path: "/",
            element: <OverviewPage/>
          },
          {
            path: "orders",
            element: <OrderRoute />,
            children: [
              {
                path: "",
                element: <OrderListPage />
              },
              {
                path: "create",
                element: <CreateOrderPage />
              },
              {
                path: ":id",
                element: <DetailOrderPage />
              },
            ]
          },
          {
            path: "customers",
            element: <CustomerRoute />,
            children: [
              {
                path: "",
                element: <CustomerPage />
              },
              {
                path: ":customerId",  // Dynamic route với customerID
                element: <CustomerDetailPage />  // Component sẽ render chi tiết khách hàng
              },
            ]
          },
          {
            path: "products",
            element: <ProductRoute />,
            children: [
              {
                path: "",
                element: <ProductPage />,
              },
              {
                path: "categories",
                element: <CategoryPage />,
              },
              {
                path: "brands",
                element: <BrandPage />,
              },
              {
                path: "variants",
                element: <VariantPage />,
              },
              {
                path: ":id",
                element: <ProductDetail />,
              },
              {
                path: ":id/edit",
                element: <ProductEdit />,
              },
              {
                path: "create",
                element: <AddProduct />,
              },
              {
                path: ":id/variants/create",
                element: <AddVariant />,
              }
            ]
          },
          {
            path: "account/:id",
            element: <UserProfile />,
          },
          {
            path: "account/change-password/:id",
            element: <ChangePassword />,
          },
          {
            path: "/admin",
            element: <AdminRoute />,
            children: [
              {
                path: "user",
                element: <User />,
              },
              {
                path: "user/create",
                element: <CreateUser />,
              },
              {
                path: "user/:id",
                element: (
                  <DetailUser/>
                ),
              },
              {
                path: "user/update/:id",
                element: <UpdateUser />,
              },
            ]
          },
          {
            path: "/accessdenied",
            element: <AccessDeniedPage />
          }
        ],
      }
    ]
  }
]);

