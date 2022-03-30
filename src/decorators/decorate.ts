export function decorate(fn: Function, ...decorators: MethodDecorator[]) {
  const target = {[fn.name]: fn};
  const descriptor = Object.getOwnPropertyDescriptor(target, fn.name);
  for (let i = decorators.length - 1; i >= 0; i--) {
    decorators[i](target, fn.name, descriptor);
  }
}