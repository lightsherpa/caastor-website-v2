/* Block-type catalogue for the page-builder. Used by the public
   renderer and the admin editor. Keep `blank()` in sync with the
   renderer's expectations. */

export const BLOCK_TYPES = [
  { type: "heading", label: "Heading", icon: "list" },
  { type: "paragraph", label: "Text", icon: "message" },
  { type: "image", label: "Image", icon: "grid" },
  { type: "gallery", label: "Gallery", icon: "layers" },
  { type: "quote", label: "Quote", icon: "message" },
  { type: "callout", label: "Callout", icon: "flag" },
  { type: "code", label: "Code", icon: "command" },
  { type: "cta", label: "Call to action", icon: "arrowRight" },
  { type: "embed", label: "Embed", icon: "link" },
  { type: "divider", label: "Divider", icon: "more" },
];

let counter = 0;
export function newId() {
  counter += 1;
  return `b${Date.now().toString(36)}${counter}`;
}

export function blankBlock(type) {
  const id = newId();
  switch (type) {
    case "heading":
      return { id, type, level: 2, text: "Section heading" };
    case "paragraph":
      return { id, type, markdown: "Write something **brilliant**. Markdown supported." };
    case "image":
      return { id, type, url: "", alt: "", caption: "" };
    case "gallery":
      return { id, type, images: [] };
    case "quote":
      return { id, type, text: "A quote worth pulling out.", cite: "" };
    case "callout":
      return { id, type, tone: "brand", title: "Good to know", body: "An aside that stands out." };
    case "code":
      return { id, type, lang: "js", code: "console.log('hello');" };
    case "cta":
      return { id, type, text: "Ready to start?", label: "Book a demo", href: "/contact-us" };
    case "embed":
      return { id, type, url: "" };
    case "divider":
      return { id, type };
    default:
      return { id, type: "paragraph", markdown: "" };
  }
}
