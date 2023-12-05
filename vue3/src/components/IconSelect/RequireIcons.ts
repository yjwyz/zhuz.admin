let icons = [] as any;
const modules = import.meta.glob("../../assets/svg/*.svg");
for (const path in modules) {
  const p = path.split("assets/svg/")[1].split(".svg")[0];
  icons.push(p);
}

export default icons;
