
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
    color: customer_config.colors.main,
    "&:hover": {
      borderColor: customer_config.colors.border
    },
  }),
  container: (baseStyles: any, state: any) => ({
    ...baseStyles,
    width: "100%",
  }),
  // placeholder: (baseStyles: any, state: any) => ({
  //   ...baseStyles,
  //   color: "#1F2534CC",
  //   fontWeight: 400,
  //   fontSize: "16px",
  // }),
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
    borderRadius: "8px",
    marginTop: "4px",
    boxShadow: "0px",
    outline: "0px",
    padding: "8px",
    // width: "100%"
  }),
  menuList: (baseStyles: any, state: any) => ({
    ...baseStyles,
    padding: "0px",
    // width: "100%"
  }),
  option: (baseStyles: any, state: any) => ({
    ...baseStyles,
    paddingTop: "8px",
    paddingBottom: "8px",
    borderRadius: "4px",
    backgroundColor: state.isSelected
      ? `${customer_config.colors.main}30`
      : "none",
    "&:hover": {
      backgroundColor: `${customer_config.colors.main}30`,
    },
    color: customer_config.colors.text,
  }),
};

export { selectStyles };
