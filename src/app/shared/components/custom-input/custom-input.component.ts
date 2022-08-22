import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  PatternValidator,
  ValidationErrors,
  Validator
} from '@angular/forms';

declare type FormHooks = 'change' | 'blur' | 'submit';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
export class CustomInputComponent implements OnInit, ControlValueAccessor, Validator {

  constructor() {

    console.log(this.inputInfo);
  }

  @Input() select_option: any[] = [];
  // @Input() bindValue: any;
  @Output() valueChange = new EventEmitter();
  @Output() onKeyupEnter = new EventEmitter();
  @Output() onBlur = new EventEmitter();
  @Input() ngModelOptions: {
    name?: string;
    standalone?: boolean;
    updateOn?: FormHooks;
  };
  @Input() input: 'select' | 'textbox' | 'textarea' | 'checkbox' | 'daterange' = 'textbox';
  @Input() partialTime = false;
  @Input() multiple = false;
  @Input() selectItem: any[];
  @Input() inputInfo: { label?, placeholder?, row? };
  @Input() type: any;
  @Input() min: any;
  @Input() max: any;
  @Input() maxLength: number;
  @Input() readonly = false;
  @Input() bindLabel: string;
  @Input() bindValue: string;
  @Input() required = false;
  @Input() dirty = false;
  @Input() value: any;
  @Input() disabled = false;
  @Input() isValide = false;
  @Input() msgError: string;
  defaultErrorText = ' est obligatoire.';
  @Input() isInLine: boolean;
  @Input() appendright: string;
  @Input() inp_pattern: RegExp | String;
  @Input() labelClassName: string;
  @Output() dateRangeCreated = new EventEmitter();
  onChange: any = () => {};
  onTouched: any = () => {};
  onValidationChange: any = () => {};

  ngOnInit(): void {
    // tslint:disable-next-line:curly
    // if(this.inputInfo)
    // this.inputInfo.id = this.inputInfo?.label?.trim();
  }

  change(value: any): void {
    // console.log(value, this.value);
    this.value = value;
    if (this.max) {
      if (value > this.max) {
        this.value = this.max;
        this.onChange(this.value);
        this.valueChange.emit(this.value);
        return;
      }
    }

    if (this.min) {
      if (value < this.min) {
        this.value = this.min;
        this.onChange(this.value);
        this.valueChange.emit(this.value);
        return;
      }
    }

    // this.value = value;
    this.valueChange.emit(this.value);
    this.onChange(this.value);
    this.onValidationChange();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: any): void {
    this.value = obj;
    // console.log('obj', obj);
  }

  registerOnValidatorChange?(fn: () => void): void {
    this.onValidationChange = fn;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    let isRequired;
    if (this.required) {
      isRequired = this.value && this.value.length > 0;
    }
    return isRequired;
  }

  getMessage(msgError: any) {
    return String.fromCharCode(msgError);
  }

  sendTime($event): void {
    if(!$event){
      this.dateRangeCreated.emit('');
      return;
    }
    if(!this.partialTime) {
      this.dateRangeCreated.emit($event);
    } else {
      this.dateRangeCreated.emit({
        date1 : $event[0].toJSON().split('T')[0],
        date2: $event[1].toJSON().split('T')[0]
      })
    }
  }
}
