interface addUserFieldsInterface {
  id: string;
  fields: string[]; // key name(s) in Order model from orderById query
  title: string; // title text displayed on screen
  key: string; // key name for object values (e.g. lookup value)
  type: string; // UI control type
  editField: string; // key name from orderEditFields query
  editable?: boolean; // is field editable
  displayable?: boolean; // is field displayable
  cellScale?: number; // width multiplier
  options?: any; // options list for select drop-down controls
  apiKey?: string; // key name passed to mutation (falls back to field name if not defined)
  defaultValue?: any; // dynamic, default value for the field
  variant: string; // defined any this variant
}
export const addUserFields = [
  {
    fields: ["First name"],
    placeholder: "Enter your first name",
    type: "text",
    apiKey: "firstName",
    cellScale: 6,
    value: "",
    variant: "outlined",
    createValidators: [
      "required",
      "matchRegexp:^(?=.{1,30}$)[A-Za-z]+( [A-Za-z]+)*$",
    ],
    createErrorMsgs: ["The field is required", "First name must contain only letters and have a character limit of 30"],
  },
  {
    fields: ["Last name"],
    placeholder: "Enter your last name",
    type: "text",
    apiKey: "lastName",
    cellScale: 6,
    value: "",
    variant: "outlined",
    createValidators: [
      "required",
      "matchRegexp:^(?=.{1,30}$)[A-Za-z]+( [A-Za-z]+)*$",
    ],
    createErrorMsgs: ["The field is required", "Last name must contain only letters and have a character limit of 30"],
  },
  {
    fields: ["phone"],
    placeholder: "Enter your phone number",
    type: "text",
    apiKey: "phone",
    cellScale: 6,
    variant: "outlined",
    createValidators: ["required", "matchRegexp:^[0-9]{10}$", "minNumber:0"],
    createErrorMsgs: [
      "The field is required",
      "Please enter 10 digit’s only",
      "Value must be greater than 0",
    ],
  },
  {
    fields: ["email"],
    placeholder: "Enter your email",
    type: "text",
    apiKey: "email",
    cellScale: 6,
    value: "",
    variant: "outlined",
    createValidators: [
      "required",
      "matchRegexp:^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9]+\\.[A-Za-z]+$",
    ],
    createErrorMsgs: ["The field is required", "Invalid email"],
  },
  {
    fields: ["password"],
    placeholder: "Enter your password",
    type: "password",
    cellScale: 6,
    apiKey: "password",
    variant: "outlined",
    createValidators: [
      "required",
      "matchRegexp:^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,}$"
    ],
    createErrorMsgs: [
      "The field is required",
      "Password should contains at least 8 characters and containing special character, uppercase, lowercase and numbers"

    ],
  },
  
] as unknown as addUserFieldsInterface[];
