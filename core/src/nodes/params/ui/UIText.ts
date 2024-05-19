import { AccessTypes } from '../../../data/AccessTypes';
import { DataAccess } from '../../../data/DataAccess';
import { DataTypes } from '../../../data/DataTypes';
import { NodeEvent } from '../../../misc/Events';
import { NumberTypes } from '../../../data/NumberTypes';
import { InputManager } from '../../../io/InputManager';
import { OutputManager } from '../../../io/OutputManager';
import { UINodeJSONType, UINodeBase } from './UINodeBase';

export type UITextJSONType = UINodeJSONType & {
  value?: string;
};

export class UIText extends UINodeBase {
  get displayName (): string {
    return 'UIText';
  }

  
  

  protected prev: string = '';
  protected textInputElement: HTMLInputElement | undefined;

  protected onSettingsChanged: NodeEvent = new NodeEvent();

  public setupViewElement (container: HTMLDivElement): void {
    this.textInputElement = this.createNumberElement();
    container.appendChild(this.textInputElement);
    super.setupViewElement(container);
  }

  public setupInspectorElement (container: HTMLDivElement): void {
    const numberTypeId = 'ui-number-number-type';
    const minId = 'ui-number-min';
    const maxId = 'ui-number-max';

    const html = `
      <ul>
        <li>
          <div>
            <label for='${numberTypeId}'>number type</label>
            <select name='${numberTypeId}' id='${numberTypeId}' class='${numberTypeId} form-select input-block'>
              <option value='${NumberTypes.INTEGER}'>Integer</option>
              <option value='${NumberTypes.FLOAT}'>Float</option>
            </select>
          </div>
        </li>
        <li>
          <div class="">
            <label for='${minId}'>min</label>
            <input type='text' type='number' name='${minId}' id='${minId}' class='form-control input-block ${minId}' />
          </div>
        </li>
        <li>
          <div class="">
            <label for='${maxId}'>max</label>
            <input type='text' type='number' name='${maxId}' id='${maxId}' class='form-control input-block ${maxId}' />
          </div>
        </li>
      </ul>
    `;
    const template = document.createElement('template');
    template.innerHTML = html;
    container.appendChild(template.content);

    

    const numberTypeSelect = container.getElementsByClassName(numberTypeId)[0] as HTMLSelectElement;
    numberTypeSelect.addEventListener('change', (e: Event) => {
      const select = e.target as HTMLSelectElement;
      this.onSettingsChanged.emit({ node: this });
    });

    
  }

  public setupGUIElement (container: HTMLDivElement): void {
    const span = this.createGUILabelSpan();
    container.appendChild(span);

    const el = this.createNumberElement();
    el.style.width = '80px';
    container.appendChild(el);
  }

  protected createNumberElement () {
    const input = document.createElement('input');
    // input.classList.add('webkit-spin-button');
    input.setAttribute('type', 'text');
    input.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    }, false);

    input.addEventListener('change', this.onTextValueChanged.bind(this));
    input.addEventListener('mouseup', this.onTextValueChanged.bind(this));
    input.addEventListener('keyup', this.onTextValueChanged.bind(this));
    input.addEventListener('paste', this.onTextValueChanged.bind(this));
    input.addEventListener('dblclick', (e) => { e.stopPropagation(); }, false);

    input.value = this.prev.toString();

    

    this.onValueChanged.on(() => {
      input.value = this.prev.toString();
    });

    return input;
  }

  public registerInputs (_manager: InputManager): void {
  }

  public registerOutputs (manager: OutputManager): void {
    manager.add('O', 'Output value', DataTypes.STRING, AccessTypes.ITEM);
  }
  

  public solve (access: DataAccess): void {
    access.setData(0, String(this.prev));
  }

  public setTextValue (value: string): UIText {
    const prev = this.prev;
    this.prev = value;
    if (prev !== value) {
      this.notifyValueChanged();
    }
    return this;
  }

  protected onTextValueChanged (e: Event): void {
    const element = e.target as HTMLInputElement;
    const value = String(element.value);
    const prev = this.prev;
    this.prev = value;
    if (prev !== value) {
      this.notifyValueChanged();
    }
  }

  public toJSON (name: string): UITextJSONType {
    return {
      ...super.toJSON(name),
      ...{
        value: this.prev,
      }
    };
  }

  public fromJSON (json: UITextJSONType): void {
    this.prev = json.value ?? this.prev;
    this.notifyValueChanged();
    this.onSettingsChanged.emit({ node: this });
    super.fromJSON(json);
  }

  public dispose (): void {
    this.onSettingsChanged.dispose();
    super.dispose();
  }
}
