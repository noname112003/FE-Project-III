import { createBrowserRouter } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
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
import ForgotPasswordPage from "../pages/login/ForgotPasswordPage.tsx";
import Login from "../pages/login/Login.tsx"
import StoreSetting from "../pages/store/StoreSetting.tsx";
import UpdateOrderPage from "../pages/order/create-order/UpdateOrderPage.tsx";
import NewUserProfile from "../pages/admin/NewUserProfile.tsx";
import StoreList from "../pages/store/ListStorePage.tsx";
import CreateStore from "../pages/store/CreateStore.tsx";
import ProductPageV2 from "../pages/product/ProductPageV2.tsx";
import ProductDetailV2 from "../pages/product/product-detail/ProductDetailV2.tsx";
import ProductEditV2 from "../pages/product/product-detail/product-edit/ProductEditV2.tsx";

export const router = createBrowserRouter([
  // {
  //   path: "/login",
  //   element: <LoginPage />
  // },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />
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
                path: ":id/update",
                element: <UpdateOrderPage />
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
            path: "warehouse",
            element: <AdminRoute/>,
            children: [
              {
                path: "create",
                element: <AddProduct />,
              },
              {
                path: "products",
                element: <ProductPageV2 />,
              },
              {
                path: "products/:id",
                element: <ProductDetailV2 />,
              },
              {
                path: "products/:id/edit",
                element: <ProductEditV2 />,
              }
            ]
          },
          {
            path: "account/:id",
            element: <NewUserProfile />,
          },
          {
            path: "account/v2/:id",
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
            path: "/store",
            element: <AdminRoute />,
            children: [
              {
                path: "",
                element: <StoreSetting />,
              },
            ]
          },
          {
            path: "/stores",
            element: <AdminRoute />,
            children: [
              {
                path: "",
                element: <StoreList />,
              },
              {
                path: "create",
                element: <CreateStore/>
              }
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

