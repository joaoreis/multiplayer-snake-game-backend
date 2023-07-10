export default class Queue {
    constructor() {
        this.elements = {};
        this.head = 0;
        this.tail = 0;
    }

    enqueue(element) {
        this.elements[this.tail] = element;
        this.tail++;
    }
// { 0:0 , 1:1 ,2:2 ,3:3 }
    dequeue() {
        if (this.isEmpty) return;
        const item = this.elements[this.head];
        delete this.elements[this.head];
        this.tail--;
        return item;
    }

    peek() {
        if (!this.isEmpty) {
            return this.elements[this.head]
        }
    }

    get length() {
        return this.tail - this.head;
    }
    get isEmpty() {
        return this.length === 0;
    }
}
