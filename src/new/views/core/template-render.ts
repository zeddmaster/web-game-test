
export function renderTemplate(template: string|Element, uuid?: string): Element
{
  if(template instanceof Element){
    if(uuid)
      template.setAttribute('data-uuid', uuid);

    return template;
  }

  const templateElem = document.createElement('template');
  templateElem.innerHTML = template.trim();

  if(!templateElem.content.firstElementChild)
    throw new Error('Не удалось отрендерить объект');

  const element = templateElem.content.firstElementChild;

  if(uuid)
    element.setAttribute('data-uuid', uuid);

  return element;
}