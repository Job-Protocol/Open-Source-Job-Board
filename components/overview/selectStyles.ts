



const selectStyles = {
  control: (baseStyles: any, state: any) => ({
    ...baseStyles,
    borderColor: state.isFocused ? "#F67637" : '#F67637',
    width: "100%",
    borderWidth: "1px",
    borderRadius: "8px",
    boxShadow: "none",
    outline: "none",
    color: "#05192D",
    "&:hover": {
      borderColor: '#F67637',
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
    color: "#05192D",
  }),
  clearIndicator: (baseStyles: any, state: any) => ({
    ...baseStyles,
    cursor: "pointer",
    ":hover": {
      color: '#F67637',
    },
  }),
  menu: (baseStyles: any, state: any) => ({
    ...baseStyles,
    borderColor: "#F67637",
    borderWidth: "1px",
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
      ? "#F6763710"
      : "none",
    "&:hover": {
      backgroundColor: '#F6763710',
    },
    color: "#1f2534",
  }),
};

export { selectStyles };
