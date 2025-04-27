import ReactDOMServer from 'react-dom/server';

/**
 * Converts a Lucide React Icon into an actual DOM SVG element.
 * @param {React.ReactElement} IconComponent - A JSX element of the icon (e.g. <Coins size={24} />)
 * @returns {SVGElement} - A usable DOM node for animation.
 */
export function iconToDomNode(IconComponent) {
  const svgString = ReactDOMServer.renderToStaticMarkup(IconComponent);
  const template = document.createElement('template');
  template.innerHTML = svgString.trim();
  return template.content.firstChild;
}
