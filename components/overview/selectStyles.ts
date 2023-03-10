
import customer_config from "@/customer_config.json";


const selectStyles = {
  control: (baseStyles: any, state: any) => ({
    ...baseStyles,
    borderColor: state.isFocused ? customer_config.colors.border : customer_config.colors.border,
    width: "100%",
    borderWidth: customer_config.border_width,
    borderRadius: "8px",
    boxShadow: "none",
    outline: "none",
    backgroundColor: customer_config.colors.background,
    color: customer_config.colors.main,
    "&:hover": {
      borderColor: customer_config.colors.border
    },
  }),
  container: (baseStyles: any, state: any) => ({
    ...baseStyles,
    width: "100%",
    color: "blue"
    // backgroundColor: "red",
  }),
  placeholder: (baseStyles: any, state: any) => ({
    ...baseStyles,
    color: customer_config.colors.text.dark,
    fontWeight: 400,
    fontSize: "16px",
  }),
  dropdownIndicator: (baseStyles: any, state: any) => ({
    ...baseStyles,
    //color: customer_config.colors.main,
    cursor: "pointer",
    ":hover": {
      color: customer_config.colors.main,
    },
  }),
  clearIndicator: (baseStyles: any, state: any) => ({
    ...baseStyles,
    cursor: "pointer",
    ":hover": {
      color: customer_config.colors.main,
    },
  }),
  menu: (baseStyles: any, state: any) => ({
    ...baseStyles,
    borderColor: customer_config.colors.border,
    borderWidth: customer_config.border_width,
    backgroundColor: customer_config.colors.cards,
    borderRadius: "8px",
    marginTop: "4px",
    boxShadow: "0px",
    outline: "0px",
    padding: "8px",
    color: customer_config.colors.text.dark,
    // width: "100%"
  }),
  menuList: (baseStyles: any, state: any) => ({
    ...baseStyles,
    padding: "0px",
    // color: "green"
    // width: "100%"
  }),
  singleValue: (baseStyles: any, state: any) => ({
    ...baseStyles,
    color: customer_config.colors.text.dark,
  }),
  option: (baseStyles: any, state: any) => ({
    ...baseStyles,
    paddingTop: "8px",
    paddingBottom: "8px",
    // borderRadius: "40px",
    backgroundColor: state.isSelected
      ? `${customer_config.colors.main}30`
      : "none",
    "&:hover": {
      backgroundColor: `${customer_config.colors.main}30`,
    },
    // color: customer_config.colors.main,
    // color: customer_config.colors.main,
  }),
};

export { selectStyles };
