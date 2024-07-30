import * as Yup from "yup";

export const SUPPORTED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
];

export const serviceValidation = Yup.object({
  serviceName: Yup.string()
    .max(40, "Only 40 characters are allowed")
    .required("This field is required"),
  serviceDescription: Yup.string()
    .max(300, "Only 300 characters are allowed")
    .required("This field is required"),
  priority: Yup.boolean(),
  image: Yup.mixed()
    .test("required", "Image is required", (value: any) => value.type)
});
export const editServiceValidation = Yup.object({
  serviceName: Yup.string()
    .max(40, "Only 40 characters are allowed")
    .required("This field is required"),
  serviceDescription: Yup.string()
    .max(300, "Only 300 characters are allowed")
    .required("This field is required"),
  priority: Yup.boolean(),
});

export const logoValidation = Yup.object({
  image: Yup.mixed()
    .test("required", "Image is required", (value: any) => value.type)
    .test(
      "type",
      "Only jpg, png, jpeg, svg format are allowed",
      (value: any) => !value || SUPPORTED_FORMATS.includes(value.type)
    ),
});
export const logoEditValidation = Yup.object({
  image: Yup.mixed().test("required", "Image is required", (value: any) => value.type).test(
    "type",
    "Only jpg, png, jpeg, svg format are allowed",
    (value: any) => !value || SUPPORTED_FORMATS.includes(value.type)
  ),
});



export const reservationSchema = Yup.object().shape({
  
  name: Yup.string()
    .max(50, "Are you sure you entered your name correctly?")
    .matches(/^[A-Za-z]+( [A-Za-z]+)*$/, "No extra spaces are allowed")
    .required("Name of Person Reserving is required"),
 
});
