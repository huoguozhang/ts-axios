interface A {
  name: string
  age: number
}
class C {
  constructor(options: any){
  }
}
interface B extends Promise<A> {
}

