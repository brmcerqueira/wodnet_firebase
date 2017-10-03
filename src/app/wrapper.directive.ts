import {Directive, Input, TemplateRef, ViewContainerRef} from "@angular/core";

@Directive({
  selector: '[wrapper]'
})
export class WrapperDirective {

  @Input() public item: any;

  constructor(private viewContainer: ViewContainerRef) {}

  @Input()
  public set wrapper(templateRef: TemplateRef<any>) {
    this.viewContainer.createEmbeddedView(templateRef).context.item = this.item;
  }
}
