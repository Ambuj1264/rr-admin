import React from "react";
import { Route, Routes } from "react-router";
import Overview from "./content/overview";
import ProtectedRoute from "./router/Protected";
import SidebarLayout from "./layouts/SidebarLayout";
import Status404 from "./content/pages/Status/Status404";
import Status500 from "./content/pages/Status/Status500";
import RegistrationOverview from "./content/pages/Components/Registration";
import HeadComponent from "./frontend-component/UserInterface/HeadComponent";
import ForgetPaswordOverview from "./content/pages/Components/forget-password";
import ResetPaswordOverview from "./content/pages/Components/reset-password";
import FooterComponent from "./frontend-component/UserInterface/FooterComponent";
import PublicRoute from "./router/publicRoute";
import OurServices from "./frontend-component/UserInterface/our-services";
import ImageUploadCard from "./frontend-component/internal-component/services/imageUploadCard";
import EditService from "./frontend-component/internal-component/services/editServices";
import EditHeader from "./frontend-component/internal-component/header/editHeader";
import AddHeader from "./frontend-component/internal-component/header/addHeader";
import EditFooter from "./frontend-component/internal-component/Footer/EditFooter";
import AddFooter from "./frontend-component/internal-component/Footer/AddFooter";
import ServiceDescriptionListing from "./frontend-component/UserInterface/ServiceDescription";
import ServicesDescription from "./frontend-component/internal-component/service-description/AddServiceDescription";
import EditServicesDescription from "./frontend-component/internal-component/service-description/EditServiceDescription";
import ServicePageListing from "./frontend-component/UserInterface/service-page";
import AddServicePage from "./frontend-component/internal-component/service-page/AddServicePage";
import EditServicePage from "./frontend-component/internal-component/service-page/EditServicePage";
import AddItems from "./frontend-component/internal-component/Manage-packages/Items/addItems";
import EditItem from "./frontend-component/internal-component/Manage-packages/Items/editServices";
import ItemComponent from "./frontend-component/UserInterface/Items";
import EditPackages from "./frontend-component/internal-component/Manage-packages/Packages/editPackages";
import AddPackages from "./frontend-component/internal-component/Manage-packages/Packages/addPackages";
import PackagesComponent from "./frontend-component/UserInterface/Packages";
import Reservation from "./frontend-component/UserInterface/Reservation";
import { ReservationComponent } from "./frontend-component/UserInterface/ReservationForm";
import AddRerservationForm from "./frontend-component/internal-component/ReservationForm/AddReservationForm";
import EditReservationForm from "./frontend-component/internal-component/ReservationForm/EditReservationForm";
import ManageCalendar from "./frontend-component/UserInterface/manage-calendar";
import AddSlot from "./frontend-component/internal-component/manage-calendar/AddSlot";
import EditSlot from "./frontend-component/internal-component/manage-calendar/EditSlot";
import DashboardCrypto from "./content/dashboards/Crypto";
const MainRouter = () => {
  return (
    <>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Overview />} />
          <Route path="/registration" element={<RegistrationOverview />} />
          <Route path="/forget-password" element={<ForgetPaswordOverview />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPaswordOverview />}
          />
        </Route>
        <Route path="404" element={<Status404 />} />
        <Route path="*" element={<Status404 />} />
        <Route path="500" element={<Status500 />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<SidebarLayout />}>
          <Route path="/" element={<DashboardCrypto />} />
            <Route path="/auth/header" element={<HeadComponent />} />
            <Route path="/auth/footer" element={<FooterComponent />} />
            <Route path="/auth/dashboard" element={<Overview />} />
            <Route path="/auth/our-services" element={<OurServices />} />
            <Route path="/auth/addServices" element={ <ImageUploadCard />} />
            <Route path="/auth/editServices/:id" element={ <EditService />} />
            <Route path="/auth/editHeader/:id" element={ <EditHeader/>} />
            <Route path="/auth/editFooter/:id" element={ <EditFooter/>} />
            <Route path="/auth/editServiceDescription/:id" element={ <EditServicesDescription/>} />
            <Route path="/auth/addServiceDescription" element={ <ServicesDescription/>} />
            <Route path="/auth/serviceDescriptionListing" element={ <ServiceDescriptionListing/>} />
            <Route path="/auth/packages/ProductItemsListing" element={ <ItemComponent/>} />
            <Route path="/auth/packages/PackagesListing" element={ <PackagesComponent/>} />
            <Route path="/auth/packages/addItem" element={ <AddItems/>} />
            <Route path="/auth/packages/addPackages" element={ <AddPackages/>} />
            <Route path="/auth/packages/editItem/:id" element={ <EditItem/>} />
            <Route path="/auth/packages/editPackages/:id" element={ <EditPackages/>} />
            <Route path="/auth/addService-page" element={ <AddServicePage />} />
            <Route path="/auth/editService-page/:id" element={ <EditServicePage />} />
            <Route path="/auth/service-page" element={ <ServicePageListing />} />
            <Route path="/auth/addHeader" element={ <AddHeader />} />
            <Route path="/auth/addFooter" element={ <AddFooter />} />
            <Route path="/auth/reservation/reservationListing" element={ <Reservation/>} />
            <Route path="/auth/reservation/reservationFormList" element={ <ReservationComponent />} />
            <Route path="/auth/reservationForm/addReservationForm" element={ <AddRerservationForm />} />
            <Route path="/auth/reservationForm/editReservationForm/:id" element={ <EditReservationForm />} />
          <Route path="/auth/calendar/slots" element={ <ManageCalendar />} />
              <Route path="/auth/calendar/addSlot" element={ <AddSlot/>} />
            <Route path="/auth/calendar/editSlot/:id" element={ <EditSlot />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default MainRouter;
