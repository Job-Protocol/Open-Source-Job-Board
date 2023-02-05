const selectStyles = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    borderColor: state.isFocused ? "var(--main-color)" : "var(--border-color)",
    width: "272px",
    borderWidth: "1px",
    borderRadius: "8px",
    boxShadow: "none",
    outline: "none",
    "&:hover": {
      borderColor: "var(--main-color)",
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
    borderColor: "var(--border-color)",
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
    backgroundColor: state.isSelected
      ? "var(--main-color-10pct-transparency)"
      : "none",
    "&:hover": {
      backgroundColor: "var(--main-color-10pct-transparency)",
    },
  }),
};

export { selectStyles };
