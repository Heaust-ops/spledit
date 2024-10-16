export class Modifiers {
  uniqueId = 0;
  instances = {} as Record<number, (u: Uint8Array) => Uint8Array>;

  add(fn: (u: Uint8Array) => Uint8Array) {
    this.uniqueId++;
    this.instances[this.uniqueId] = fn;
    return this.uniqueId;
  }

  remove(idOrFn: number | Function) {
    if (typeof idOrFn === "number") {
      delete this.instances[this.uniqueId];
      return;
    }

    for (const key in this.instances) {
      if (this.instances[key] !== idOrFn) continue;
      delete this.instances[key];
      return;
    }
  }

  cascade(u: Uint8Array) {
    let t_u = u;

    for (const key in this.instances) {
      const result = this.instances[key](t_u);
      t_u = result;
    }

    return t_u;
  }
}
