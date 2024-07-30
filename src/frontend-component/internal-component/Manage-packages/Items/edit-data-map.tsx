interface ItemFieldsInterface {
    id: string;
    fields: string[];
    title: string;
    key: string;
    type: string;
    editField: string;
    editable?: boolean;
    displayable?: boolean;
    cellScale?: number;
    options?: any;
    apiKey?: string;
    defaultValue?: any;
    placeholder?:string
    variant?: string
    createValidators?:string[],
    createErrorMsgs?: string[]
  }
  
  export const editItemFields = [
    {
      fields: ["itemName"],
      placeholder: "Enter your item name",
      type: "text",
      apiKey:"itemName",
      cellScale: 2,
      variant:"outlined",
      title:"Item name",
      editable:false,
      createValidators: [
        "required", "matchRegexp:^.{0,40}$"
      ],
      createErrorMsgs: ["This field is required", "Only 40 characters are allow"],
    },
    {
      fields: ["basicQuantity"],
      placeholder: "Basic quantity",
      type: "number",
      cellScale: 1.1,
      apiKey: "basicQuantity",
      title:"Basic quantity",
      variant: "outlined",
      createValidators: ["required", "matchRegexp:^[0-9]{0,4}$", "minNumber:0"],
      createErrorMsgs: [
      "This field is required",
      "Please enter 4 digit’s only",
      "Value must be greater than 0",
    ],
    },
    {
      fields: ["deluxeQuantity"],
      placeholder: "Deluxe quantity",
      type: "number",
      cellScale: 1.1,
      apiKey: "deluxeQuantity",
      title:"Deluxe quantity",
      variant: "outlined",
      createValidators: ["required", "matchRegexp:^[0-9]{0,4}$", "minNumber:0"],
      createErrorMsgs: [
      "This field is required",
      "Please enter 4 digit’s only",
      "Value must be greater than 0",
    ],
    },
    {
      fields: ["superDeluxeQuantity"],
      placeholder: "Super deluxe",
      type: "number",
      cellScale: 1.1,
      apiKey: "superDeluxeQuantity",
      title:"Super deluxe quantity",
      variant: "outlined",
      createValidators: ["required", "matchRegexp:^[0-9]{0,4}$", "minNumber:0"],
      createErrorMsgs: [
      "This field is required",
      "Please enter 4 digit’s only",
      "Value must be greater than 0",
    ],
    },
   
   
  ] as ItemFieldsInterface[];
  