import s from "/src/UI/_CommonStyles/_exports.module.scss"

export const stripeCardElementStyle = {
  base: {
    fontSize: "20px",
    "::placeholder": { color: s.colorInputPlaceholder }
  },
  invalid: {
    color: s.colorDanger,
    iconColor: s.colorDanger
  }
}
