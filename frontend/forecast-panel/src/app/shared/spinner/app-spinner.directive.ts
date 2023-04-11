import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  HostListener,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { SpinnerComponent } from './spinner.component';


@Directive({
  selector: '[appSpinner]'
})
export class AppSpinnerDirective implements OnInit {

  private message: string;
  private spin: boolean;
  private red: boolean;
  private full: boolean;

  @Input('appSpinner')
  set showSpinner(spinning: boolean) {
    this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(SpinnerComponent);
    this.container.clear();
    this.spin = spinning;
  }

  @Input('appSpinnerMessage')
  set spinnerMessage(message: string) {
    this.message = message;
  }

  @Input('appSpinnerRed')
  set redSpinner(red: boolean) {
    this.red = red;
  }

  @Input('appSpinnerFull')
  set fullSpinner(full: boolean) {
    this.full = full;
  }

  componentFactory: ComponentFactory<SpinnerComponent>;
  spinnerComponent: ComponentRef<SpinnerComponent>;

  constructor(private container: ViewContainerRef,
              private template: TemplateRef<any>,
              private componentFactoryResolver: ComponentFactoryResolver) {

  }

  ngOnInit(): void {
    if (this.spin) {
      this.container.createEmbeddedView(this.template);
      this.spinnerComponent = this.container.createComponent(this.componentFactory);
      this.spinnerComponent.instance.message = this.message;
      this.spinnerComponent.instance.redSpiner = this.red;
      this.spinnerComponent.instance.fullSpiner = this.full;
    } else {
      this.container.createEmbeddedView(this.template);
    }
  }

  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    event.stopPropagation();
  }

  @HostListener('mousedown', ['$event'])
  public onMouseDown(event: any): void {
    event.stopPropagation();
  }

  @HostListener('mouseup', ['$event'])
  public onMouseUp(event: any): void {
    event.stopPropagation();
  }
}
