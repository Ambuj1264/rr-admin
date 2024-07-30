interface PackagesFieldsInterface {
    id?: string;
    fields?: string[];
    title?: string;
    key?: string;
    type?: string;
    editField?: string;
    editable?: boolean;
    displayable?: boolean;
    cellScale?: number;
    options?: any;
    apiKey?: string;
    defaultValue?: any;
    placeholder?: string;
    variant?: string;
    createValidators?: string[];
    createErrorMsgs?: string[];
  }
  
  export const PackagesEditFields = [
    {
      fields: ["service"],
      title: "Select Service",
      type: "select",
      cellScale: 2,
      apiKey: "service",
      valueKey: "value",
      variant: "outlined",
      editable:false,
      options: [],
      createValidators: ["required"],
      createErrorMsgs: ["Required"],
    },
    {
      fields: ["items"],
      title: "Select Items",
      type: "Multipleselect",
      cellScale: 3,
      apiKey: "items",
      valueKey: "value",
      variant: "outlined",
      options: [],
      createValidators: ["required"],
      createErrorMsgs: ["Required"],
    },
    {
      fields: ["basicPackagePrice"],
      placeholder: "Basic package price",
      type: "number",
      cellScale: 1.7,
      apiKey: "basicPackagePrice",
      title:"Basic package price ($)",
      variant: "outlined",
      createValidators: ["required", "matchRegexp:^[0-9]{0,10}$", "minNumber:0"],
      createErrorMsgs: [
      "This field is required",
      "Only 10 digit allowed",
      "Value must be greater than 0",
    ],
  },
    {
      fields: ["deluxePackagePrice"],
      placeholder: "Deluxe package price",
      type: "number",
      cellScale: 1.7,
      apiKey: "deluxePackagePrice",
      title:"Deluxe package price ($)",
      variant: "outlined",
      createValidators: ["required", "matchRegexp:^[0-9]{0,10}$", "minNumber:0"],
      createErrorMsgs: [
      "This field is required",
      "Only 10 digit allowed",
      "Value must be greater than 0",
    ],
    },
    {
      fields: ["superdeluxePackagePrice"],
      placeholder: "Super Deluxe package price",
      type: "number",
      cellScale: 1.7,
      apiKey: "superDeluxePackagePrice",
      title:"Super Deluxe package price ($)",
      variant: "outlined",
      createValidators: ["required", "matchRegexp:^[0-9]{0,10}$", "minNumber:0"],
      createErrorMsgs: [
      "This field is required",
      "Only 10 digit allowed",
      "Value must be greater than 0",
    ],
    },
    {
      fields: ["basic"],
      title: "Basic",
      apiKey: "basic",
      type: "checkbox",
      cellScale: 1.1,
      editField: true,
    },
    {
      fields: ["deluxe"],
      title: "Deluxe",
      apiKey: "deluxe",
      type: "checkbox",
      cellScale: 1.1,
      editField: true,
    },
    {
      fields: ["superDeluxe"],
      title: "Super deluxe",
      apiKey: "superDeluxe",
      type: "checkbox",
      cellScale:1.1,
      editField: true,
    },
  ] as any[];
  