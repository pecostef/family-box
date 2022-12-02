export function applyTemplate<T>(template: any, backing: any): T {
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
    if (!!placeholders) {
      placeholders.forEach(function (placeholder) {
        //Placeholder - {var}
        const phText = placeholder.substring(1, placeholder.length - 1);
        //phText = var
        if (backing[phText]) {
          template = template.replace(placeholder, backing[phText]);
        }
      });
    }
    return template as T;
  } else if (typeof template === 'object') {
    for (const i in template) {
      const m = /{(.+)}/.exec(template[i]);
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

function applyObjectTemplating(template: any, backing: any) {
  for (const i in template) {
    const m = /{(.+)}/.exec(template[i]);
    if (m && backing && backing[m[1]]) {
      // replace with a deep clone of the value from the backing model
      template[i] = JSON.parse(JSON.stringify(backing[m[1]]));
    } else if (template[i] && 'object' === typeof template[i]) {
      // traverse down recursively
      applyObjectTemplating(template[i], backing);
    }
  }
  return template;
}

function applyStringTemplating(template: any, backing: any) {
  for (let i in template) {
    if (template[i] && 'string' === typeof template[i]) {
      const placeholders: string[] | undefined =
        template[i].match(/\{(.*?)\}/g);
      if (!!placeholders) {
        placeholders.forEach(function (placeholder) {
          //Placeholder - {var}
          const phText = placeholder.substring(1, placeholder.length - 1);
          //phText = var
          if (backing[phText]) {
            template[i] = template[i].replace(placeholder, backing[phText]);
          }
        });
      }
    }
  }
  return template;
}
