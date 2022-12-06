export function applyTemplate<T>(
  template: T,
  backing: { [key: string]: unknown }
): T {
  if (!template) {
    return template;
  }
  const templateDeepCopy = JSON.parse(JSON.stringify(template));
  if (!backing) {
    return templateDeepCopy;
  }
  return applyTemplateRecursive(templateDeepCopy, backing);
}

function applyTemplateRecursive<T>(
  template: T,
  backing: { [key: string]: unknown }
): T {
  if (!template || !backing) {
    return template;
  }
  if (Array.isArray(template)) {
    for (let i = 0; i < template.length; i++) {
      template[i] = applyTemplate(template[i], backing);
    }
    return template as T;
  } else if (typeof template === 'string') {
    const placeholders = template.match(/\{(.*?)\}/g);
    if (placeholders) {
      placeholders.forEach(function (placeholder) {
        //Placeholder - {var}
        const phText = placeholder.substring(1, placeholder.length - 1);
        //phText = var
        if (backing[phText]) {
          template = (template as string).replace(
            placeholder,
            backing[phText] as string
          ) as T;
        }
      });
    }
    return template as T;
  } else if (typeof template === 'object') {
    for (const i in template) {
      const m = /{(.+)}/.exec(template[i] as string);
      if (m && backing && backing[m[1]]) {
        // replace with a deep clone of the value from the backing model
        template[i] = JSON.parse(JSON.stringify(backing[m[1]]));
      } else {
        // traverse down recursively
        template[i] = applyTemplate(template[i], backing);
      }
    }
    return template;
  }
  return template;
}
