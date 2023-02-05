const selectStyles = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    borderColor: state.isFocused ? "#EE4C83" : "#E2E2E2",
    width: "272px",
    borderWidth: "1px",
    borderRadius: "8px",
    boxShadow: "none",
    outline: "none",
    "&:hover": {
      borderColor: "#EE4C83",
    },
  }),
  placeholder: (baseStyles, state) => ({
    ...baseStyles,
    color: "#1F2534CC",
    fontWeight: 400,
    fontSize: "16px",
  }),
  dropdownIndicator: (baseStyles, state) => ({
    ...baseStyles,
    color: "#05192D",
  }),
  menu: (baseStyles, state) => ({
    ...baseStyles,
    borderColor: "#E2E2E2",
    borderWidth: "1px",
    borderRadius: "8px",
    color: "#1F2534",
    fontWeight: 400,
    fontSize: "16px",
    marginTop: "4px",
    boxShadow: "0px",
    outline: "0px",
    padding: "8px",
  }),
  menuList: (baseStyles, state) => ({
    ...baseStyles,
    padding: "0px",
  }),
  option: (baseStyles, state) => ({
    ...baseStyles,
    borderRadius: "4px",
    backgroundColor: state.isSelected ? "#EE4C831A" : "none",
    "&:hover": {
      backgroundColor: "#EE4C831A",
    },
  }),
};

export { selectStyles };
