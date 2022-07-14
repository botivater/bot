import { Observer } from './observer.interface';

export abstract class Subject {
  protected observerCollection: Observer[] = [];

  protected registerObserver(observer: Observer): void {
    this.observerCollection.push(observer);
  }

  protected unregisterObserver(observer: Observer): void {
    this.observerCollection = this.observerCollection.filter(
      (o) => o !== observer,
    );
  }

  protected notifyObservers(): void {
    this.observerCollection.forEach((o) => o.update());
  }
}
