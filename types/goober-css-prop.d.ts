import { CSSAttribute } from "goober"

declare module "react" {
  // The css prop
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: CSSAttribute | TemplateStringsArray | string
  }
  // The inline svg css prop
  interface SVGProps<T> extends SVGProps<SVGSVGElement> {
    css?: CSSAttribute | TemplateStringsArray | string
  }
}
