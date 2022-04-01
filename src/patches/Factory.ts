import {Factory} from 'konva/lib/Factory';
import {ANIMATE} from '../symbols';
import type {Node} from 'konva/lib/Node';
import {Animator} from '../tweening/Animator';

declare module 'konva/lib/types' {
  export interface GetSet<Type, This extends Node> {
    (): Type;
    (value: Type): This;
    (value: typeof ANIMATE): Animator<Type, This>;
    (value: Type, time: number): Generator;
  }
}

Factory.overWriteSetter = function overWriteSetter(
  constructor: Function,
  attr: string,
  validator?: any,
  after?: () => void,
) {
  const name = attr.charAt(0).toUpperCase() + attr.slice(1);
  const setter = `set${name}`;
  constructor.prototype[setter] = function (val: any, time?: any) {
    if (val === ANIMATE) {
      return new Animator(this, attr);
    }

    if (time !== undefined) {
      return new Animator(this, attr).key(val, time).run();
    }

    this._setAttr(attr, val);
    after?.call(this);

    return this;
  };
};

Factory.addOverloadedGetterSetter = function addOverloadedGetterSetter(
  constructor: Function,
  attr: string,
) {
  const capitalizedAttr = attr.charAt(0).toUpperCase() + attr.slice(1);
  const setter = 'set' + capitalizedAttr;
  const getter = 'get' + capitalizedAttr;

  constructor.prototype[attr] = function (...args: any[]) {
    return args.length ? this[setter](...args) : this[getter]();
  };
};
