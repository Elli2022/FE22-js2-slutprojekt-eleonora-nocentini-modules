// dom-utils.ts

export const getElement = (id: string) => document.getElementById(id);

export const createAndStyleElement = (
  type: string,
  styles: Record<string, string>
) => {
  const element = document.createElement(type);
  Object.assign(element.style, styles);
  return element;
};
