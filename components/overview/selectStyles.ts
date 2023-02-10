const selectStyles = {
  control: (baseStyles: any, state: any) => ({
    ...baseStyles,
    borderColor: state.isFocused ? "var(--main-color)" : "var(--border-color)",
    width: "100%",
    borderWidth: "1px",
    borderRadius: "8px",
    boxShadow: "none",
    outline: "none",
    "&:hover": {
      borderColor: "var(--main-color)",
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
  menu: (baseStyles: any, state: any) => ({
    ...baseStyles,
    borderColor: "var(--border-color)",
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
      ? "var(--main-color-10pct-transparency)"
      : "none",
    "&:hover": {
      backgroundColor: "var(--main-color-10pct-transparency)",
    },
  }),
};

export { selectStyles };
