
export function renderTemplate(template: string|Element): Element
{
  if(template instanceof Element){
    return template;
  }

  const templateElem = document.createElement('template');
  templateElem.innerHTML = template.trim();

  if(!templateElem.content.firstElementChild)
    throw new Error('Не удалось отрендерить объект');

  return templateElem.content.firstElementChild;
}