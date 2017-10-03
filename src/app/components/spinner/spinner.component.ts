import {Input, OnInit} from '@angular/core';
import {ControlValueAccessor} from '@angular/forms';

export abstract class SpinnerComponent implements ControlValueAccessor, OnInit {

  private value: number;
  @Input() public min: number;
  @Input() public max: number;
  public text: string;
  public isDisabled: boolean;
  private onChange: (value: number) => void;
  private onTouched: () => void;

  constructor() {
    this.value = 0;
    this.text = null;
  }

  public ngOnInit(): void {
    this.value = this.min;
    this.updateText();
  }

  public abstract get fillMark(): string;

  public abstract get emptyMark(): string;

  public updateText(): void {
      this.text = '';
      for (let i = 0; i < this.value; i++) {
        this.text += this.fillMark;
      }
      for (let i = 0; i < this.max - this.value; i++) {
        this.text += this.emptyMark;
      }
  }

  public add(): void {
    if (this.value < this.max) {
      this.value++;
      this.updateText();

      if (this.onChange) {
        this.onChange(this.value);
      }

      if (this.onTouched) {
        this.onTouched();
      }
    }
  }

  public less(): void {
    if (this.value > this.min) {
      this.value--;
      this.updateText();

      if (this.onChange) {
        this.onChange(this.value);
      }

      if (this.onTouched) {
        this.onTouched();
      }
    }
  }

  public writeValue(value: number): void {
    this.value = value;
    this.updateText();
  }

  public registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
